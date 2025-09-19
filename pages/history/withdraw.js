// pages/riwayat-withdraw.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Home, Users, Gift, CreditCard, User, BarChart3, ArrowLeft } from 'lucide-react';
import { Icon } from '@iconify/react';
import { getWithdrawalHistory } from '../../utils/api';
import BottomNavbar from '../../components/BottomNavbar';

// Navigation items (consistent with profile.js)
const navItems = [
  { label: 'Home', icon: Home, href: '/dashboard', key: 'dashboard' },
  { label: 'Komisi', icon: Users, href: '/referral', key: 'komisi' },
  { label: 'Spin', icon: Gift, href: '/spin-wheel', key: 'spin' },
  { label: 'Testimoni', icon: CreditCard, href: '/testimoni', key: 'testimoni' },
  { label: 'Profil', icon: User, href: '/profile', key: 'profile' },
];

export default function RiwayatWithdraw() {
  const router = useRouter();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchWithdrawalHistory();
  }, [router]);

  const fetchWithdrawalHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getWithdrawalHistory();
      if (res.success) {
        setWithdrawals(res.data || []);
      } else {
        setError(res.message || 'Gagal memuat riwayat withdraw');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
      console.error('Error fetching withdrawal history:', err);
    }
    setLoading(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusConfig = (status) => {
    const statusConfig = {
      'Success': { 
        color: 'text-green-400', 
        bgColor: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20', 
        borderColor: 'border-green-400/30',
        text: 'Berhasil', 
        icon: 'mdi:check-circle' 
      },
      'Pending': { 
        color: 'text-yellow-400', 
        bgColor: 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20', 
        borderColor: 'border-yellow-400/30',
        text: 'Menunggu', 
        icon: 'mdi:clock-outline' 
      },
      'Failed': { 
        color: 'text-red-400', 
        bgColor: 'bg-gradient-to-r from-red-500/20 to-rose-500/20', 
        borderColor: 'border-red-400/30',
        text: 'Gagal', 
        icon: 'mdi:close-circle' 
      }
    };

    return statusConfig[status] || statusConfig['Pending'];
  };

  const getStatusBadge = (status) => {
    const config = getStatusConfig(status);
    
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bgColor} border ${config.borderColor}`}>
        <Icon icon={config.icon} className={`w-4 h-4 ${config.color}`} />
        <span className={`text-xs font-semibold ${config.color}`}>
          {config.text}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-400 border-t-transparent"></div>
            <Icon icon="mdi:history" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-400 w-6 h-6" />
          </div>
          <span className="text-purple-200 mt-4 text-sm">Memuat riwayat withdraw...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 pb-24">
      <Head>
        <title>Stoneform Capital | Riwayat Withdraw</title>
        <meta name="description" content="Riwayat penarikan dana Stoneform Capital" />
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
              <Icon icon="mdi:history" className="text-xl text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Riwayat Withdraw</h1>
            </div>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-800/60 to-pink-600/60 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-purple-400/30 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-pink-400/20 rounded-full blur-xl"></div>
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-lg"></div>
          
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-xl border border-purple-400/30 mb-4">
              <Icon icon="mdi:cash-clock" className="text-white w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Riwayat Penarikan Dana</h2>
            <p className="text-purple-200 text-sm">Lihat semua transaksi penarikan dana Anda</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-purple-800/40 to-indigo-600/30 backdrop-blur-xl rounded-2xl p-4 border border-purple-400/20 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <Icon icon="mdi:counter" className="text-cyan-400 w-5 h-5" />
              <span className="text-purple-200 text-xs">Total Transaksi</span>
            </div>
            <p className="text-white font-bold text-lg">
              {withdrawals.length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-800/40 to-pink-600/30 backdrop-blur-xl rounded-2xl p-4 border border-purple-400/20 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <Icon icon="mdi:cash-multiple" className="text-green-400 w-5 h-5" />
              <span className="text-purple-200 text-xs">Total Penarikan</span>
            </div>
            <p className="text-green-400 font-bold text-lg">
              IDR {formatCurrency(
                withdrawals.reduce((sum, w) => sum + w.final_amount, 0)
              )}
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-gradient-to-br from-red-800/40 to-red-600/30 backdrop-blur-xl rounded-3xl p-6 border border-red-400/20 shadow-2xl mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Icon icon="mdi:alert-circle" className="text-red-400 w-8 h-8 flex-shrink-0" />
              <div>
                <h4 className="text-white font-semibold text-sm mb-1">Terjadi Kesalahan</h4>
                <p className="text-red-200 text-xs">{error}</p>
              </div>
            </div>
            <button 
              onClick={fetchWithdrawalHistory}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <Icon icon="mdi:refresh" className="w-4 h-4" />
              Coba Lagi
            </button>
          </div>
        )}

        {/* Withdrawals List */}
        {withdrawals.length === 0 && !error ? (
          <div className="bg-gradient-to-br from-purple-800/40 to-pink-600/30 backdrop-blur-xl rounded-3xl p-8 text-center border border-purple-400/20">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-4">
              <Icon icon="mdi:folder-open-outline" className="text-white w-8 h-8" />
            </div>
            <h4 className="text-white font-semibold text-sm mb-1">Belum Ada Riwayat</h4>
            <p className="text-purple-200 text-xs">Anda belum melakukan penarikan dana</p>
          </div>
        ) : (
          <div className="space-y-4">
            {withdrawals.map((withdrawal, index) => {
              const statusConfig = getStatusConfig(withdrawal.status);
              return (
                <div key={index} className="bg-gradient-to-br from-purple-800/50 to-pink-600/40 backdrop-blur-xl rounded-3xl p-6 border border-purple-400/30 shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden group">
                  {/* Background decoration */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-pink-400/10 to-purple-400/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500"></div>
                  
                  {/* Header with Order ID and Status */}
                  <div className="flex justify-between items-center mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Icon icon="mdi:receipt" className="text-white w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-white font-semibold text-sm">#{withdrawal.order_id}</span>
                        <p className="text-purple-300 text-xs">{formatDate(withdrawal.withdrawal_time)}</p>
                      </div>
                    </div>
                    {getStatusBadge(withdrawal.status)}
                  </div>

                  {/* Bank Details */}
                  <div className="bg-gradient-to-r from-indigo-600/20 to-blue-600/20 rounded-xl p-4 mb-4 border border-indigo-400/20 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <Icon icon="mdi:bank" className="text-white w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-blue-200 font-semibold text-sm">{withdrawal.bank_name}</h4>
                        <div className="flex items-center gap-2 text-xs text-blue-300 mt-1">
                          <Icon icon="mdi:credit-card-outline" className="w-3 h-3" />
                          <span>{withdrawal.account_number}</span>
                          <span>•</span>
                          <span>{withdrawal.account_name}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Amount Details Grid */}
                  <div className="grid grid-cols-2 gap-4 relative z-10">
                    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon icon="mdi:cash-remove" className="text-cyan-400 w-4 h-4" />
                        <span className="text-cyan-200 text-xs">Jumlah Penarikan</span>
                      </div>
                      <span className="text-cyan-400 font-semibold text-sm">IDR {formatCurrency(withdrawal.amount)}</span>
                    </div>
                    
                    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon icon="mdi:cash-minus" className="text-red-400 w-4 h-4" />
                        <span className="text-red-200 text-xs">Biaya Admin</span>
                      </div>
                      <span className="text-red-400 font-semibold text-sm">IDR {formatCurrency(withdrawal.charge)}</span>
                    </div>
                  </div>

                  {/* Final Amount */}
                  <div className={`mt-4 rounded-xl p-4 border relative z-10 ${statusConfig.bgColor} ${statusConfig.borderColor}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon icon="mdi:cash-check" className={`w-5 h-5 ${statusConfig.color}`} />
                        <span className={`text-sm ${statusConfig.color.replace('text-', 'text-').replace('-400', '-100')}`}>
                          Jumlah Diterima
                        </span>
                      </div>
                      <span className={`font-bold text-lg ${statusConfig.color}`}>
                        IDR {formatCurrency(withdrawal.final_amount)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Copyright */}
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