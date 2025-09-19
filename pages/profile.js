// pages/profile.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Home, Users, Gift, CreditCard, User, BarChart3 } from 'lucide-react';
import { Icon } from '@iconify/react';
import BottomNavbar from '../components/BottomNavbar';

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [applicationData, setApplicationData] = useState({ link_app: '', link_cs: '', link_group: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    // If no user data, use sample data
    if (!user.name) {
      setUserData({
        name: "Tester",
        number: "882646678601",
        balance: 0,
        total_deposit: 0,
        total_withdraw: 0,
        vip_level: 0,
        active: false // Default to unverified
      });
    } else {
      setUserData(user);
    }

    // Get application links from localStorage
    const link_app = localStorage.getItem('link_app') || '';
    const link_cs = localStorage.getItem('link_cs') || '';
    const link_group = localStorage.getItem('link_group') || '';
    setApplicationData({ link_app, link_cs, link_group });

    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expired_at');
    localStorage.removeItem('user');
    localStorage.removeItem('application');
    router.push('/login');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  // Check verification status
  const isVerified = userData?.active === true;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-400 border-t-transparent mb-4"></div>
          <p className="text-purple-200 text-sm">Memuat profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 pb-32">
      <Head>
        <title>Stoneform Capital | Profile</title>
        <meta name="description" content="Stoneform Capital Profile"/>
        <link rel="icon" href="/logo.png" />
      </Head>

      <div className="max-w-md mx-auto p-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-800/60 to-pink-600/60 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-purple-400/30 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-pink-400/20 rounded-full blur-xl"></div>
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-lg"></div>
          
          <div className="flex justify-between items-center mb-4 relative z-10">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-xl border border-purple-400/30">
                <Icon icon="mdi:account-circle" className="text-white w-9 h-9" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">{userData?.name || 'Tester'}</h2>
                <div className="flex items-center gap-2 mb-2">
                  <Icon icon="mdi:phone" className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-200 text-sm">
                    +62{userData?.number || '882646678601'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon 
                    icon="mdi:shield-check" 
                    className={`w-4 h-4 ${isVerified ? 'text-green-400' : 'text-red-400'}`} 
                  />
                  <span className={`text-xs font-medium ${isVerified ? 'text-green-400' : 'text-red-400'}`}>
                    {isVerified ? 'Verified Investor' : 'Unverified Investor'}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-xl mb-2 border border-purple-400/30">
                <img src="/logo.png" alt="Stoneform Capital" className="w-10 h-10 object-contain" />
              </div>
              <p className="text-purple-200 text-xs font-medium">Stoneform</p>
              <p className="text-purple-300 text-xs">Capital</p>
            </div>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-gradient-to-br from-purple-700/40 to-purple-600/30 rounded-2xl p-4 border border-purple-400/20 text-center shadow-lg">
            <div className="flex items-center justify-center gap-1 mb-2">
              <Icon icon="mdi:wallet" className="w-4 h-4 text-purple-400" />
              <p className="text-purple-200 text-xs">Saldo</p>
            </div>
            <p className="text-cyan-400 text-sm font-semibold">
              IDR {formatCurrency(userData?.balance || 0)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-700/40 to-green-600/30 rounded-2xl p-4 border border-green-400/20 text-center shadow-lg">
            <div className="flex items-center justify-center gap-1 mb-2">
              <Icon icon="mdi:trending-up" className="w-4 h-4 text-green-400" />
              <p className="text-purple-200 text-xs">Investasi</p>
            </div>
            <p className="text-green-400 text-sm font-semibold">
              IDR {formatCurrency(userData?.total_invest || 0)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-red-700/40 to-red-600/30 rounded-2xl p-4 border border-red-400/20 text-center shadow-lg">
            <div className="flex items-center justify-center gap-1 mb-2">
              <Icon icon="mdi:trending-down" className="w-4 h-4 text-red-400" />
              <p className="text-purple-200 text-xs">Withdraw</p>
            </div>
            <p className="text-red-400 text-sm font-semibold">
              IDR {formatCurrency(userData?.total_withdraw || 0)}
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button 
            onClick={() => router.push('/dashboard')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-105 flex items-center justify-center gap-2"
          >
            <Icon icon="mdi:plus-circle" className="w-5 h-5" />
            Investasi
          </button>
          
          <button 
            onClick={() => router.push('/withdraw')}
            className="bg-gradient-to-br from-purple-700/40 to-purple-600/30 hover:from-purple-600/50 hover:to-purple-500/40 text-white font-semibold py-3 rounded-2xl transition-all duration-300 border border-purple-400/20 hover:scale-105 shadow-lg flex items-center justify-center gap-2"
          >
            <Icon icon="mdi:minus-circle" className="w-5 h-5" />
            Withdraw
          </button>
        </div>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button 
            onClick={() => router.push('/portofolio')}
            className="bg-gradient-to-br from-purple-700/40 to-purple-600/30 hover:from-purple-600/50 hover:to-purple-500/40 text-white font-semibold py-3 rounded-2xl transition-all duration-300 border border-purple-400/20 flex items-center justify-center gap-2 hover:scale-105 shadow-lg"
          >
            <Icon icon="mdi:chart-line" className="w-5 h-5" />
            Portofolio Saya
          </button>
          <button 
            onClick={() => router.push('/bank')}
            className="bg-gradient-to-br from-purple-700/40 to-purple-600/30 hover:from-purple-600/50 hover:to-purple-500/40 text-white font-semibold py-3 rounded-2xl transition-all duration-300 border border-purple-400/20 flex items-center justify-center gap-2 hover:scale-105 shadow-lg"
          >
            <Icon icon="mdi:bank" className="w-5 h-5" />
            Akun Bank
          </button>
        </div>

        {/* Download APK */}
        <div className="bg-gradient-to-br from-purple-800/50 to-pink-600/40 backdrop-blur-xl rounded-3xl p-5 mb-6 border border-purple-400/30 shadow-2xl text-center relative overflow-hidden">
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-pink-400/10 to-purple-400/10 rounded-full blur-lg"></div>
          <div className="flex items-center justify-center gap-2 mb-3 relative z-10">
            <Icon icon="mdi:android" className="w-6 h-6 text-green-400" />
            <h3 className="text-cyan-400 font-semibold">Stoneform Capital APK</h3>
          </div>
          <p className="text-purple-200 text-xs mb-4 relative z-10">Download aplikasi mobile untuk kemudahan akses</p>
          {applicationData.link_app ? (
            <a
              href={applicationData.link_app}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2.5 px-6 rounded-2xl transition-all duration-300 text-sm shadow-lg hover:shadow-purple-500/25 hover:scale-105 flex items-center gap-2 mx-auto relative z-10"
            >
              <Icon icon="mdi:download" className="w-4 h-4" />
              DOWNLOAD NOW
            </a>
          ) : (
            <button disabled className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2.5 px-6 rounded-2xl opacity-50 cursor-not-allowed flex items-center gap-2 mx-auto relative z-10">
              <Icon icon="mdi:download" className="w-4 h-4" />
              DOWNLOAD NOW
            </button>
          )}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Row 1 */}
          <button 
            onClick={() => router.push('/history/investment')}
            className="bg-gradient-to-br from-purple-700/40 to-purple-600/30 hover:from-purple-600/50 hover:to-purple-500/40 text-white font-semibold p-4 rounded-2xl transition-all duration-300 border border-purple-400/20 flex items-center gap-3 text-sm hover:scale-105 shadow-lg"
          >
            <div className="w-10 h-10 bg-purple-600/30 rounded-xl flex items-center justify-center">
              <Icon icon="mdi:history" className="w-5 h-5 text-purple-300" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold">Riwayat</p>
              <p className="text-xs text-purple-300">Investasi</p>
            </div>
          </button>
          <button 
            onClick={() => router.push('/history/withdraw')}
            className="bg-gradient-to-br from-purple-700/40 to-purple-600/30 hover:from-purple-600/50 hover:to-purple-500/40 text-white font-semibold p-4 rounded-2xl transition-all duration-300 border border-purple-400/20 flex items-center gap-3 text-sm hover:scale-105 shadow-lg"
          >
            <div className="w-10 h-10 bg-red-600/30 rounded-xl flex items-center justify-center">
              <Icon icon="mdi:cash-clock" className="w-5 h-5 text-red-300" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold">Riwayat</p>
              <p className="text-xs text-purple-300">Withdraw</p>
            </div>
          </button>

          {/* Row 2 */}
          <button 
            onClick={() => router.push('/transactions')}
            className="bg-gradient-to-br from-purple-700/40 to-purple-600/30 hover:from-purple-600/50 hover:to-purple-500/40 text-white font-semibold p-4 rounded-2xl transition-all duration-300 border border-purple-400/20 flex items-center gap-3 text-sm hover:scale-105 shadow-lg"
          >
            <div className="w-10 h-10 bg-blue-600/30 rounded-xl flex items-center justify-center">
              <Icon icon="mdi:swap-horizontal" className="w-5 h-5 text-blue-300" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold">Semua</p>
              <p className="text-xs text-purple-300">Transaksi</p>
            </div>
          </button>
          {applicationData.link_cs ? (
            <a
              href={applicationData.link_cs}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-purple-700/40 to-purple-600/30 hover:from-purple-600/50 hover:to-purple-500/40 text-white font-semibold p-4 rounded-2xl transition-all duration-300 border border-purple-400/20 flex items-center gap-3 text-sm hover:scale-105 shadow-lg"
            >
              <div className="w-10 h-10 bg-green-600/30 rounded-xl flex items-center justify-center">
                <Icon icon="mdi:help-circle" className="w-5 h-5 text-green-300" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold">Bantuan</p>
                <p className="text-xs text-purple-300">Pengguna</p>
              </div>
            </a>
          ) : (
            <button disabled className="bg-gradient-to-br from-purple-700/40 to-purple-600/30 text-white font-semibold p-4 rounded-2xl opacity-50 cursor-not-allowed flex items-center gap-3 text-sm">
              <div className="w-10 h-10 bg-green-600/30 rounded-xl flex items-center justify-center">
                <Icon icon="mdi:help-circle" className="w-5 h-5 text-green-300" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold">Bantuan</p>
                <p className="text-xs text-purple-300">Pengguna</p>
              </div>
            </button>
          )}

          {/* Row 3 */}
          {applicationData.link_group ? (
            <a
              href={applicationData.link_group}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-purple-700/40 to-purple-600/30 hover:from-purple-600/50 hover:to-purple-500/40 text-white font-semibold p-4 rounded-2xl transition-all duration-300 border border-purple-400/20 flex items-center gap-3 text-sm hover:scale-105 shadow-lg"
            >
              <div className="w-10 h-10 bg-cyan-600/30 rounded-xl flex items-center justify-center">
                <Icon icon="mdi:telegram" className="w-5 h-5 text-cyan-300" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold">Saluran</p>
                <p className="text-xs text-purple-300">Telegram</p>
              </div>
            </a>
          ) : (
            <button disabled className="bg-gradient-to-br from-purple-700/40 to-purple-600/30 text-white font-semibold p-4 rounded-2xl opacity-50 cursor-not-allowed flex items-center gap-3 text-sm">
              <div className="w-10 h-10 bg-cyan-600/30 rounded-xl flex items-center justify-center">
                <Icon icon="mdi:telegram" className="w-5 h-5 text-cyan-300" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold">Saluran</p>
                <p className="text-xs text-purple-300">Telegram</p>
              </div>
            </button>
          )}
          <button 
            onClick={() => router.push('/password')}
            className="bg-gradient-to-br from-purple-700/40 to-purple-600/30 hover:from-purple-600/50 hover:to-purple-500/40 text-white font-semibold p-4 rounded-2xl transition-all duration-300 border border-purple-400/20 flex items-center gap-3 text-sm hover:scale-105 shadow-lg"
          >
            <div className="w-10 h-10 bg-yellow-600/30 rounded-xl flex items-center justify-center">
              <Icon icon="mdi:lock-reset" className="w-5 h-5 text-yellow-300" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold">Ganti</p>
              <p className="text-xs text-purple-300">Kata Sandi</p>
            </div>
          </button>
        </div>

        {/* User Stats */}
        <div className="bg-gradient-to-br from-purple-800/40 to-pink-600/30 backdrop-blur-xl rounded-2xl p-4 mb-6 border border-purple-400/20 shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <Icon 
              icon="mdi:shield-check" 
              className={`w-5 h-5 ${isVerified ? 'text-green-400' : 'text-red-400'}`} 
            />
            <h3 className="text-white font-semibold text-sm">Status Akun</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <Icon 
                icon={isVerified ? "mdi:check-circle" : "mdi:alert-circle"} 
                className={`w-6 h-6 mx-auto mb-1 ${isVerified ? 'text-green-400' : 'text-red-400'}`} 
              />
              <p className="text-purple-200 text-xs mb-1">Status</p>
              <p className={`font-bold text-xs ${isVerified ? 'text-green-400' : 'text-red-400'}`}>
                {isVerified ? 'Verified' : 'Unverified'}
              </p>
            </div>
            <div className="text-center">
              <Icon icon="mdi:calendar-check" className="text-green-400 w-6 h-6 mx-auto mb-1" />
              <p className="text-purple-200 text-xs mb-1">Member Sejak</p>
              <p className="text-white font-bold text-xs">2025</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-gradient-to-br from-red-700/40 to-red-600/30 hover:from-red-600/50 hover:to-red-500/40 text-red-400 font-semibold py-3 rounded-2xl transition-all duration-300 border border-red-400/20 flex items-center justify-center gap-2 mb-8 hover:scale-105 shadow-lg"
        >
          <Icon icon="mdi:logout" className="w-5 h-5" />
          Keluar
        </button>

        {/* Copyright */}
        <div className="text-center text-purple-300 text-xs flex items-center justify-center gap-2 mb-4">
          <Icon icon="mdi:copyright" className="w-3 h-3" />
          <span>2025 Stoneform Capital. Seluruh Hak Dilindungi.</span>
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