// pages/spin-wheel.js
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../../styles/SpinWheel.module.css';
import { Home, Users, Gift, CreditCard, User, BarChart3, Ticket, Trophy, Sparkles, Star, ArrowLeft } from 'lucide-react';
import { getSpinPrizeList, spinWheel, spinV2 } from '../../utils/api';
import { Icon } from '@iconify/react';
import BottomNavbar from '../../components/BottomNavbar';

export default function SpinWheel() {
  const router = useRouter();
  const [prizes, setPrizes] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({
    balance: 0,
    name: '',
    number: '',
    reff_code: '',
    spin_ticket: 0,
    total_invest: 0,
    total_withdraw: 0
  });
  const wheelRef = useRef(null);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [pointerActive, setPointerActive] = useState(false);

  // Define colors for the wheel segments
  const prizeColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFBE0B', 
    '#FB5607', '#8338EC', '#3A86FF', '#38B000'
  ];

  // Fetch prizes and user data
  useEffect(() => {
    const fetchSpinData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Ambil user dari localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          setUserData(user);
        }
        // Ambil data hadiah dari API utils
        const res = await getSpinPrizeList();
        if (res && res.success && Array.isArray(res.data)) {
          // Only use active prizes
          const filtered = res.data.filter((prize) => prize.status === 'Active');
          // Calculate total chance for percentage
          const totalChance = filtered.reduce((sum, prize) => sum + (typeof prize.chance === 'number' ? prize.chance : 0), 0);
          const processedPrizes = filtered.map((prize, index) => ({
            ...prize,
            color: prizeColors[index % prizeColors.length],
            textColor: '#FFFFFF',
            name: prize.amount >= 1000 ? `Rp ${formatCurrency(prize.amount)}` : `${prize.amount} Poin`,
            chancePercent: totalChance > 0 ? ((prize.chance / totalChance) * 100) : 0
          }));
          setPrizes(processedPrizes);
        } else {
          setError('Gagal memuat hadiah spin');
        }
      } catch (err) {
        setError('Network error. Please try again.');
        console.error('Error fetching spin data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpinData();
  }, []);

  // (server-driven) frontend no longer selects prize by probability

  // Calculate the final absolute rotation (degrees) so the selected prize center aligns with top
  const calculateRotation = (prizeIndex) => {
    if (!prizes || prizes.length === 0) return 0;
    const segmentAngle = 360 / prizes.length;

    // center of the target segment in degrees (SVG coords)
    const targetCenter = (prizeIndex + 0.5) * segmentAngle;

    // desired final angle so that targetCenter sits at top (12 o'clock / 270deg SVG)
    const desiredFinal = (270 - targetCenter + 360) % 360;

    // choose full spins (5-6) for effect and add desiredFinal to get absolute rotation
    const fullSpins = (5 + Math.floor(Math.random() * 2)) * 360;
    const finalRotation = fullSpins + desiredFinal;
    return finalRotation;
  };

  const handleSpin = async () => {
    if (userData.spin_ticket < 1) {
      setError('Tidak memiliki tiket spin yang cukup');
      return;
    }

    if (prizes.length === 0) {
      setError('Data hadiah belum dimuat');
      return;
    }

    setIsSpinning(true);
    setError(null);
    setResult(null);

    try {
      // Server-driven spin: call backend to get prize (server validates tickets)
      const previousRotation = currentRotation;
      const response = await spinV2();

      if (!response || !response.success) {
        setError(response?.message || 'Spin gagal');
        // Reset on error: smoothly snap back to previous rotation
        if (wheelRef.current) {
          wheelRef.current.style.transition = 'transform 600ms ease-out';
          wheelRef.current.style.transform = `rotate(${previousRotation}deg)`;
        }
        setCurrentRotation(previousRotation);
        setIsSpinning(false);
        return;
      }

      // server returned success with spin result -> animate to server prize
      const serverPrize = response.data && response.data.spin_result ? response.data.spin_result : null;
      let serverIndex = -1;
      if (serverPrize) {
        serverIndex = prizes.findIndex(p => (p.code && serverPrize.code && p.code === serverPrize.code) || (Number(p.amount) === Number(serverPrize.amount)));
      }
      if (serverIndex === -1) serverIndex = 0; // fallback

      // animate wheel to serverIndex
      const finalRotation = calculateRotation(serverIndex);
      const baseFull = Math.floor(currentRotation / 360) * 360;
      let targetRotation = baseFull + finalRotation;
      if (targetRotation <= currentRotation) targetRotation += 360;
      if (wheelRef.current) {
        wheelRef.current.style.transition = 'transform 4s cubic-bezier(0.2,0.7,0.3,1)';
        wheelRef.current.style.transform = `rotate(${targetRotation}deg)`;
      }
      await new Promise(resolve => setTimeout(resolve, 4200));
      setCurrentRotation(targetRotation);

      // briefly animate pointer and show result
      setPointerActive(true);
      setResult({
        prize: {
          amount: response.data.spin_result.amount,
          name: response.data.spin_result.amount >= 1000 ? `Rp ${formatCurrency(response.data.spin_result.amount)}` : `${response.data.spin_result.amount} Poin`
        },
        message: response.message,
        previousBalance: response.data.balance_info.previous_balance,
        currentBalance: response.data.balance_info.current_balance,
        prizeAmount: response.data.balance_info.prize_amount
      });
      setTimeout(() => setPointerActive(false), 1800);

      // Step 7: Update user data and show result
      const updatedUserData = {
        ...userData,
        balance: response.data.balance_info.current_balance,
        spin_ticket: userData.spin_ticket - 1
      };
      setUserData(updatedUserData);
      localStorage.setItem('user', JSON.stringify(updatedUserData));

    } catch (err) {
      setError(err.message || 'Network error. Please try again.');
      // Reset on error
      if (wheelRef.current) {
        wheelRef.current.style.transition = 'none';
        wheelRef.current.style.transform = `rotate(${currentRotation}deg)`;
      }
    } finally {
      setIsSpinning(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  // Create wheel segments with proper text alignment
  const createWheelSegments = () => {
  if (prizes.length === 0) return null;

  const segmentAngle = 360 / prizes.length;
  const radius = 120;
  const centerX = 120;
  const centerY = 120;

  return prizes.map((prize, index) => {
    const startAngleRad = (index * segmentAngle) * (Math.PI / 180);
    const endAngleRad = ((index + 1) * segmentAngle) * (Math.PI / 180);

    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);

    const largeArcFlag = segmentAngle > 180 ? 1 : 0;
    const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

    const textAngleRad = (startAngleRad + endAngleRad) / 2;
    const textRadius = radius * 0.7;
    const textX = centerX + textRadius * Math.cos(textAngleRad);
    const textY = centerY + textRadius * Math.sin(textAngleRad);

    // rotate text so it reads outward along the wheel
    const textAngleDeg = (textAngleRad * (180 / Math.PI)) + 90;
    return (
      <g key={index}>
        <path d={pathData} fill={prize.color} stroke="#fff" strokeWidth="2" />
        <text
          x={textX}
          y={textY}
          fill={prize.textColor}
          fontSize="11"
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="central"
          transform={`rotate(${textAngleDeg}, ${textX}, ${textY})`}
        >
          {prize.name}
        </text>
      </g>
    );
  });
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <Head>
          <title>Stoneform Capital | Spin Wheel</title>
          <meta name="description" content="Stoneform Capital Spin Wheel" />
          <link rel="icon" href="/logo.png" />
        </Head>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 text-center">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Memuat hadiah...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 pb-24">
      <Head>
        <title>Stoneform Capital | Spin Wheel</title>
        <meta name="description" content="Stoneform Capital Spin Wheel" />
        <link rel="icon" href="/logo.png" />
      </Head>

      {/* Top Navigation */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center">
          <button 
            onClick={() => router.back()}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 active:scale-95"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-3 mx-auto">
            <div className={`p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl`}>
              <Icon icon="streamline-ultimate:casino-chip-5" className="text-xl text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Spin Wheel</h1>
            </div>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-800/50 to-pink-600/50 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-purple-400/20 shadow-2xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-400" />
              Spin Wheel Hadiah
              <Sparkles className="w-8 h-8 text-pink-400" />
            </h1>
            <p className="text-purple-200">
              Dapatkan hadiah menarik dengan memutar roda keberuntungan!
            </p>
          </div>
        </div>

        {/* User Info Section */}
        <div className="bg-gradient-to-br from-purple-800/40 to-pink-600/30 backdrop-blur-xl rounded-3xl p-6 border border-purple-400/20 shadow-2xl mb-8">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-sm text-purple-200 mb-1">Saldo</div>
              <div className="text-xl font-bold text-cyan-400">Rp {formatCurrency(userData.balance)}</div>
            </div>
            <div className="text-center border-x border-purple-400/30">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Ticket className="w-8 h-8 text-yellow-400" />
                <div className="text-white text-3xl font-bold">{userData.spin_ticket}</div>
              </div>
              <div className="text-purple-200 text-sm">Tiket Spin</div>
            </div>
            <div className="text-center">
              <div className="text-purple-300 text-xs mb-1">Biaya Spin</div>
              <div className="text-yellow-400 font-bold">1 Tiket</div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 backdrop-blur-xl rounded-2xl p-4 border border-red-400/30 shadow-lg mb-8 text-red-200 text-center flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div className="bg-gradient-to-br from-green-800/40 to-emerald-600/30 backdrop-blur-xl rounded-3xl p-6 border border-green-400/20 shadow-2xl mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <div className="text-2xl font-bold text-green-400">Selamat! anda memenangkan</div>
              <Sparkles className="w-8 h-8 text-pink-400" />
            </div>
            <div className="text-3xl font-bold text-yellow-400 mb-4">
              {result.prize.name}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-black/20 rounded-xl p-3">
                <div className="text-purple-200">Saldo Sebelum</div>
                <div className="text-cyan-400 font-bold">Rp {formatCurrency(result.previousBalance)}</div>
              </div>
              <div className="bg-black/20 rounded-xl p-3">
                <div className="text-purple-200">Saldo Sekarang</div>
                <div className="text-cyan-400 font-bold">Rp {formatCurrency(result.currentBalance)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Spin Wheel Container */}
        <div className="bg-gradient-to-br from-purple-800/40 to-pink-600/30 backdrop-blur-xl rounded-3xl p-8 border border-purple-400/20 shadow-2xl mb-8">
          <div className="flex justify-center mb-8">
            <div className="relative w-64 h-64">
              {/* Wheel SVG */}
              <svg 
  ref={wheelRef}
  className="absolute inset-0 w-full h-full"
  viewBox="0 0 240 240"
  style={{ 
    transform: `rotate(${currentRotation}deg)`,
    transition: 'transform 4s cubic-bezier(0.2, 0.7, 0.3, 1)'
  }}
>
                {createWheelSegments()}
              </svg>
              
              {/* Center circle */}
              <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10 shadow-lg border-4 border-purple-600"></div>
              
              {/* Pointer (triangle pointing DOWN from top center) */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none">
                {/* triangle tip pointing DOWN into the wheel: use border-bottom */}
                <div className={`w-0 h-0 border-l-[16px] border-r-[16px] border-t-[24px] border-l-transparent border-r-transparent drop-shadow-lg ${pointerActive ? 'border-t-yellow-400 scale-110' : 'border-t-red-500'}`} style={{ marginTop: '22px' }}></div>
              </div>
            </div>
          </div>

          {/* Spin Button */}
          <button
            onClick={handleSpin}
            disabled={isSpinning || userData.spin_ticket < 1}
            className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg mb-4 ${
              isSpinning || userData.spin_ticket < 1 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:scale-105'
            }`}
          >
            {isSpinning ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Memutar...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                Putar Sekarang
              </>
            )}
          </button>
        </div>

        {/* Prize List */}
        <div className="bg-gradient-to-br from-purple-800/40 to-pink-600/30 backdrop-blur-xl rounded-3xl p-6 border border-purple-400/20 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-4 text-center flex items-center justify-center gap-2">
            <Gift className="w-6 h-6 text-pink-400" />
            Daftar Hadiah
          </h2>
          <div className="grid gap-3">
            {prizes.map((prize, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-2xl bg-black/20 backdrop-blur-sm border border-purple-400/20"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                    style={{ backgroundColor: prize.color }}
                  >
                    {index + 1}
                  </div>
                  <div className="text-white font-medium">{prize.name}</div>
                </div>
                <div className="text-purple-200 text-sm">
                  {prize.chancePercent.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Copyright dengan jarak yang cukup dari bottom navbar */}
        <div className="text-center text-white/60 text-xs flex items-center justify-center gap-2 mt-8 mb-8">
          <Icon icon="solar:copyright-bold" className="w-3 h-3" />
          <span>2025 Stoneform Capital. All Rights Reserved.</span>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/30 backdrop-blur-xl border-t border-purple-400/20 z-50">
        <div className="max-w-4xl mx-auto grid grid-cols-5 gap-1 p-2">
          <BottomNavbar />
        </div>
      </div>
    </div>
  );
}