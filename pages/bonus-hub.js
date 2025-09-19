// pages/bonus-hub.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { 
  Home, Users, CreditCard, User, Gift, 
  BarChart3, Ticket, Star, Sparkles, Trophy 
} from 'lucide-react';
import BottomNavbar from '../components/BottomNavbar';
import { Icon } from '@iconify/react';

export default function BonusHub() {
  const router = useRouter();
  const [userData, setUserData] = useState({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const userStr = localStorage.getItem('user');
      setUserData(userStr ? JSON.parse(userStr) : {});
    } catch {
      setUserData({});
    }
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 pb-24">
      <Head>
        <title>Stoneform Capital | Bonus Hub</title>
        <meta name="description" content="Pusat Bonus dan Hadiah Stoneform Capital" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <div className="max-w-md mx-auto p-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-800/50 to-pink-600/50 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-purple-400/20 shadow-2xl text-white">
          <div className="flex items-center justify-center gap-2 text-lg font-semibold mb-3">
            <Gift className="text-xl text-yellow-400" />
            Pusat Bonus & Hadiah
          </div>
          <div className="text-sm text-purple-200 text-center leading-relaxed">
            Tingkatkan penghasilan Anda dengan berbagai bonus dan hadiah menarik!
          </div>
        </div>

        {/* Action Cards */}
        <div className="space-y-6 mb-8">
          {/* Spin Wheel Card */}
          <div 
            className="bg-gradient-to-br from-purple-700/40 to-pink-500/30 backdrop-blur-xl rounded-3xl p-6 border border-purple-400/20 shadow-2xl cursor-pointer hover:scale-[1.02] transition-all duration-300"
            onClick={() => router.push('/bonus-hub/spin-wheel')}
          >
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-2xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">Spin Wheel</h3>
                <p className="text-sm text-purple-200">Putar roda keberuntungan dan menangkan hadiah menarik!</p>
              </div>
              <div className="text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Bonus Tasks Card */}
          <div 
            className="bg-gradient-to-br from-cyan-700/40 to-blue-500/30 backdrop-blur-xl rounded-3xl p-6 border border-cyan-400/20 shadow-2xl cursor-pointer hover:scale-[1.02] transition-all duration-300"
            onClick={() => router.push('/bonus-hub/task')}
          >
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-4 rounded-2xl">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">Bonus Tasks</h3>
                <p className="text-sm text-cyan-200">Selesaikan tugas dan dapatkan bonus eksklusif!</p>
              </div>
              <div className="text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright dengan jarak yang cukup dari bottom navbar */}
        <div className="text-center text-white/60 text-xs flex items-center justify-center gap-2 mt-8 mb-4">
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
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}