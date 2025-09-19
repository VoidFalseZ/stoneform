// pages/tugas.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { BarChart3, Users, Home, CreditCard, User, Gift, ArrowLeft } from 'lucide-react';
import { Icon } from '@iconify/react';
import { getBonusTasks, submitBonusTask } from '../../utils/api';
import BottomNavbar from '../../components/BottomNavbar';

export default function Bonus() {
  const router = useRouter();

  const [copied, setCopied] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState({}); // { [taskId]: true/false }
  const [message, setMessage] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user && user.reff_code) setReferralCode(user.reff_code);
      }
    } catch {}
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setMessage('');
    getBonusTasks()
      .then(res => {
        if (!ignore) setTasks(res.data || []);
      })
      .catch(e => { if (!ignore) setMessage(e.message || 'Gagal memuat tugas'); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, []);

  const handleClaim = async (taskId) => {
    setClaiming(prev => ({ ...prev, [taskId]: true }));
    setMessage('');
    try {
      await submitBonusTask(taskId);
      setMessage('Hadiah berhasil diambil!');
      // Refresh tasks
      setLoading(true);
      const res = await getBonusTasks();
      setTasks(res.data || []);
    } catch (e) {
      setMessage(e.message || 'Gagal mengambil hadiah');
    } finally {
      setClaiming(prev => ({ ...prev, [taskId]: false }));
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 pb-24">
      <Head>
        <title>Stoneform Capital | Bonus Tasks</title>
        <meta name="description" content="Program Bonus dan Referral Stoneform Capital" />
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
              <Icon icon="mdi:star" className="text-xl text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Tugas</h1>
            </div>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-800/50 to-pink-600/50 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-purple-400/20 shadow-2xl text-white">
          <div className="flex items-center justify-center gap-2 text-lg font-semibold mb-3">
            <Icon icon="mdi:account-group" className="text-xl text-yellow-400" />
            Sistem Referral
          </div>
          <div className="text-sm text-purple-200 text-center leading-relaxed">
            Tingkatkan penghasilan Anda dengan sistem referral kami! Undang teman dan dapatkan bonus dari aktivitas mereka.
          </div>
        </div>

        {/* Referral System Details */}
        <div className="bg-gradient-to-br from-purple-800/40 to-pink-600/30 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-purple-400/20 shadow-2xl">
          <div className="text-md font-semibold text-white mb-4 flex items-center justify-center gap-2">
            <Icon icon="mdi:cash-multiple" className="text-purple-300" />
            Komisi Referral
          </div>
          <div className="text-sm text-purple-200 space-y-3">
            <div className="flex items-start gap-3">
              <Icon icon="mdi:circle-outline" className="text-purple-300 mt-1 flex-shrink-0" />
              <span>Level 1: Dapatkan 5% dari investasi anggota langsung.</span>
            </div>
            <div className="flex items-start gap-3">
              <Icon icon="mdi:circle-outline" className="text-purple-300 mt-1 flex-shrink-0" />
              <span>Level 2: Dapatkan 2% dari investasi anggota Level 2.</span>
            </div>
            <div className="flex items-start gap-3">
              <Icon icon="mdi:circle-outline" className="text-purple-300 mt-1 flex-shrink-0" />
              <span>Level 3: Dapatkan 1% dari investasi anggota Level 3.</span>
            </div>
            <div className="mt-4 text-center italic">
              Contoh: Undang 100 pengguna dan total investasi Rp 100,000,000 dapatkan Rp 5,000,000!
            </div>
          </div>
        </div>

        {/* Referral Code Section */}
        {isClient && (
          <div className="bg-gradient-to-br from-purple-800/40 to-pink-600/30 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-purple-400/20 shadow-2xl">
            <div className="text-md font-semibold text-white mb-4 text-center">
              Kode Referral Anda
            </div>
            <div className="relative flex items-center bg-white/10 border border-purple-300/30 rounded-2xl p-3 mb-4">
              <span className="flex-1 text-lg font-bold text-white text-center">
                {referralCode}
              </span>
            </div>
            <button 
              onClick={copyToClipboard}
              className={`w-full flex items-center justify-center gap-2 text-white font-semibold py-3 rounded-2xl transition-all duration-300 shadow-lg ${
                copied 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:scale-105'
              }`}
            >
              <Icon icon="mdi:content-copy" className="w-5 h-5" />
              {copied ? 'Tersalin!' : 'Salin Kode'}
            </button>
          </div>
        )}

        {/* Bonus Tasks Header */}
        <div className="bg-gradient-to-r from-purple-800/50 to-pink-600/50 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-purple-400/20 shadow-2xl text-white">
          <div className="flex items-center justify-center gap-2 text-lg font-semibold mb-3">
            <Icon icon="mdi:star" className="text-xl text-yellow-400" />
            Bonus Tasks
          </div>
          <div className="text-sm text-purple-200 text-center leading-relaxed">
            Undang anggota baru yang berinvestasi untuk membuka hadiah eksklusif!
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center py-8 animate-fadeIn">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-400 border-t-transparent mb-2"></div>
              <span className="text-purple-200">Mengambil data tugas...</span>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center text-purple-200 py-8">Tidak ada tugas bonus.</div>
          ) : tasks.map((task) => {
            const percent = task.percent || 0;
            const isLocked = task.lock;
            const isTaken = task.taken;
            const canClaim = !isLocked && !isTaken;
            return (
              <div 
                key={task.id} 
                className={`relative bg-gradient-to-br from-purple-700/30 to-purple-600/20 backdrop-blur-xl rounded-2xl p-4 border transition-all duration-300 ${
                  canClaim
                    ? 'border-purple-400/40 shadow-lg scale-[1.02]'
                    : 'border-purple-400/20'
                }`}
              >
                {canClaim && (
                  <span className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold py-1 px-3 rounded-full">
                    Aktif
                  </span>
                )}
                <div className="text-md font-semibold text-white text-center mb-4">
                  {task.name}
                </div>
                <div className="bg-gradient-to-br from-purple-800/40 to-pink-600/30 rounded-2xl p-3 mb-4 border border-purple-400/20">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-purple-200">
                      LV{task.required_level} Aktif: <strong className="text-cyan-400">{task.active_subordinate_count}/{task.required_active_members}</strong>
                    </span>
                    <span className="text-purple-200">
                      Hadiah: <strong className="text-green-400">Rp {formatCurrency(task.reward)}</strong>
                    </span>
                  </div>
                </div>
                <div className="h-3 bg-purple-800/30 rounded-full overflow-hidden mb-4 border border-purple-400/20 relative">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  ></div>
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-white font-semibold bg-purple-800/80 px-2 py-1 rounded-full">
                    {percent}%
                  </span>
                </div>
                <button
                  className={`w-full flex items-center justify-center gap-2 font-semibold py-2 rounded-2xl transition-all duration-300 ${
                    canClaim
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:scale-105 shadow-lg'
                      : isTaken
                        ? 'bg-gray-500/40 text-gray-200 cursor-not-allowed'
                        : 'bg-gradient-to-br from-purple-800/20 to-purple-700/10 text-purple-400 cursor-not-allowed'
                  }`}
                  disabled={!canClaim || claiming[task.id]}
                  onClick={() => handleClaim(task.id)}
                >
                  {claiming[task.id] ? (
                    <span className="flex items-center gap-2"><span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span> Memproses...</span>
                  ) : isTaken ? (
                    <>
                      <Icon icon="mdi:check-circle" className="w-4 h-4" />
                      Sudah Diambil
                    </>
                  ) : isLocked ? (
                    <>
                      <Icon icon="mdi:lock" className="w-4 h-4" />
                      Terkunci
                    </>
                  ) : (
                    <>
                      <Icon icon="mdi:gift" className="w-4 h-4" />
                      Ambil
                    </>
                  )}
                </button>
              </div>
            );
          })}
          {message && (
            <div className="text-center text-sm text-yellow-300 py-2 animate-fadeIn">{message}</div>
          )}
        </div>
        {/* Copyright dengan jarak yang cukup dari bottom navbar */}
        <div className="text-center text-white/60 text-xs flex items-center justify-center gap-2 mt-8 mb-8">
          <Icon icon="solar:copyright-bold" className="w-3 h-3" />
          <span>2025 Stoneform Capital. All Rights Reserved.</span>
        </div>
      </div>

      {/* Bottom Navigation - Updated to match spin-wheel.js style */}
        <div className="fixed bottom-0 left-0 right-0 bg-black/30 backdrop-blur-xl border-t border-purple-400/20 z-50">
          <div className="max-w-4xl mx-auto grid grid-cols-5 gap-1 p-2">
            <BottomNavbar />
          </div>
        </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.4s ease-out; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
}