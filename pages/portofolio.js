// pages/investasi-saya.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Home, Users, Gift, CreditCard, User, BarChart3, ArrowLeft } from 'lucide-react';
import { getActiveInvestments } from '../utils/api';
import { Icon } from '@iconify/react';
import BottomNavbar from '../components/BottomNavbar';

const navItems = [
  { label: 'Home', icon: Home, href: '/dashboard', key: 'dashboard' },
  { label: 'Komisi', icon: Users, href: '/referral', key: 'komisi' },
  { label: 'Spin', icon: Gift, href: '/spin-wheel', key: 'spin' },
  { label: 'Testimoni', icon: CreditCard, href: '/testimoni', key: 'testimoni' },
  { label: 'Profil', icon: User, href: '/profile', key: 'profile' },
];

export default function InvestasiSaya() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [investments, setInvestments] = useState({});
  const [tabKeys, setTabKeys] = useState([]);
  const [invLoading, setInvLoading] = useState(true);
  const [invError, setInvError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.name) {
      setUserData({
        name: "Tester",
        number: "882646678601",
        balance: 0,
      });
    } else {
      setUserData(user);
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    setInvLoading(true);
    setInvError('');
    getActiveInvestments()
      .then(res => {
        const data = res.data || {};
        setInvestments(data);
        const keys = Object.keys(data);
        setTabKeys(keys);
        if (keys.length > 0) setActiveTab(keys[0]);
      })
      .catch(e => setInvError(e.message || 'Gagal memuat investasi aktif'))
      .finally(() => setInvLoading(false));
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  const getStatusColor = (status) => {
    if (status === 'Running') return 'bg-gradient-to-r from-green-500 to-emerald-500';
    if (status === 'Completed') return 'bg-gradient-to-r from-blue-500 to-indigo-500';
    if (status === 'Suspended') return 'bg-gradient-to-r from-red-500 to-rose-500';
    return 'bg-gradient-to-r from-gray-500 to-slate-500';
  };

  const getStarIcon = (tabName) => {
    if (tabName.includes('1')) return 'mdi:star-outline';
    if (tabName.includes('2')) return 'mdi:star-half-full';
    if (tabName.includes('3')) return 'mdi:star';
    return 'mdi:star-outline';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-400 border-t-transparent mb-4"></div>
          <p className="text-purple-200 text-sm">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 pb-24">
      <Head>
        <title>Stoneform Capital | Portofolio Saya</title>
        <meta name="description" content="Stoneform Capital - Portofolio Saya" />
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
              <Icon icon="mdi:chart-line" className="text-xl text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Portofolio Saya</h1>
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
          
          <div className="flex justify-between items-center relative z-10">
            <div className="flex-1">
              <div className="flex items-center gap-3 text-white font-bold text-lg mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl border border-purple-400/30">
                  <Icon icon="mdi:account-circle" className="text-white w-7 h-7" />
                </div>
                <div>
                  <p className="text-white font-semibold">{userData?.name || 'Unauthorized'}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-purple-200 text-sm">
                  <Icon icon="mdi:phone" className="w-4 h-4 text-purple-400" />
                  <span>+62{userData?.number || '882646678601'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon icon="mdi:wallet" className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-200 text-sm">Saldo:</span>
                  <span className="text-cyan-400 font-semibold text-sm">IDR {formatCurrency(userData?.balance || 0)}</span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-xl mb-2 border border-purple-400/30">
                <img src="/logo.png" alt="Logo" className="w-8 h-8" onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }} />
                <Icon icon="mdi:diamond" className="text-yellow-400 w-8 h-8" style={{ display: 'none' }} />
              </div>
              <p className="text-purple-200 text-xs font-medium">Stoneform</p>
              <p className="text-purple-300 text-xs">Capital</p>
            </div>
          </div>
        </div>

        {/* Investment Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-purple-800/40 to-indigo-600/30 backdrop-blur-xl rounded-2xl p-4 border border-purple-400/20 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <Icon icon="mdi:trending-up" className="text-green-400 w-5 h-5" />
              <span className="text-purple-200 text-xs">Total Investasi</span>
            </div>
            <p className="text-white font-bold text-lg">
              {Object.values(investments).flat().length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-800/40 to-pink-600/30 backdrop-blur-xl rounded-2xl p-4 border border-purple-400/20 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <Icon icon="mdi:cash-multiple" className="text-yellow-400 w-5 h-5" />
              <span className="text-purple-200 text-xs">Total Return</span>
            </div>
            <p className="text-green-400 font-bold text-lg">
              IDR {formatCurrency(
                Object.values(investments).flat().reduce((sum, inv) => sum + inv.total_returned, 0)
              )}
            </p>
          </div>
        </div>

        {/* Tabs dinamis dari API */}
        <div className="bg-gradient-to-br from-purple-800/40 to-pink-600/30 backdrop-blur-xl rounded-3xl p-4 mb-6 border border-purple-400/20 shadow-2xl">
          <div className="flex justify-center gap-2 flex-wrap">
            {tabKeys.length === 0 ? (
              <div className="flex items-center gap-2 text-purple-200 text-xs py-2">
                <Icon icon="mdi:information-outline" className="w-4 h-4" />
                <span>Tidak ada kategori investasi</span>
              </div>
            ) : (
              tabKeys.map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-4 py-2.5 text-xs font-semibold rounded-2xl transition-all duration-300 flex items-center gap-2 ${
                    activeTab === key
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl transform scale-105'
                      : 'bg-white/10 text-purple-200 hover:bg-white/20 hover:scale-105'
                  }`}
                >
                  <Icon icon={getStarIcon(key)} className="w-4 h-4" />
                  {key}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Product List dinamis */}
        <div className="space-y-4">
          {invLoading ? (
            <div className="flex flex-col items-center py-12 animate-fadeIn">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-400 border-t-transparent"></div>
                <Icon icon="mdi:chart-line" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-400 w-6 h-6" />
              </div>
              <span className="text-purple-200 mt-4 text-sm">Mengambil data investasi...</span>
            </div>
          ) : invError ? (
            <div className="bg-gradient-to-br from-red-800/40 to-red-600/30 backdrop-blur-xl rounded-3xl p-6 border border-red-400/20 shadow-2xl">
              <div className="flex items-center gap-4">
                <Icon icon="mdi:alert-circle" className="text-red-400 w-8 h-8 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold text-sm mb-1">Terjadi Kesalahan</h4>
                  <p className="text-red-200 text-xs">{invError}</p>
                </div>
              </div>
            </div>
          ) : !activeTab || !investments[activeTab] || investments[activeTab].length === 0 ? (
            <div className="bg-gradient-to-br from-purple-800/40 to-pink-600/30 backdrop-blur-xl rounded-3xl p-6 border border-purple-400/20 shadow-2xl">
              <div className="flex items-center gap-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                  <Icon icon="mdi:chart-pie" className="text-white w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-sm mb-1">Belum Ada Investasi</h4>
                  <p className="text-purple-200 text-xs">Anda belum memiliki investasi di kategori {activeTab}.</p>
                </div>
              </div>
            </div>
          ) : (
            investments[activeTab].map((inv, index) => {
              const percent = inv.duration > 0 ? Math.round((inv.total_paid / inv.duration) * 100) : 0;
              return (
                <div key={inv.id} className="bg-gradient-to-br from-purple-800/50 to-pink-600/40 backdrop-blur-xl rounded-3xl p-6 border border-purple-400/30 shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden group">
                  {/* Background decoration */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-pink-400/10 to-purple-400/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500"></div>
                  
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Icon icon="mdi:briefcase" className="text-white w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-white font-semibold text-sm block">ORDER ID: {inv.order_id}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg ${getStatusColor(inv.status)}`}>
                      {inv.status}
                    </span>
                  </div>

                  {/* Investment Details */}
                  <div className="grid grid-cols-2 gap-4 mb-4 relative z-10">
                    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon icon="mdi:wallet" className="text-cyan-400 w-4 h-4" />
                        <span className="text-cyan-200 text-xs">Jumlah Investasi</span>
                      </div>
                      <span className="text-cyan-400 font-semibold text-sm">IDR {formatCurrency(inv.amount)}</span>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon icon="mdi:cash-multiple" className="text-yellow-400 w-4 h-4" />
                        <span className="text-yellow-200 text-xs">Profit Harian</span>
                      </div>
                      <span className="text-yellow-400 font-semibold text-sm">IDR {formatCurrency(inv.daily_profit)}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4 relative z-10">
                    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon icon="mdi:calendar-star" className="text-pink-400 w-4 h-4" />
                        <span className="text-pink-200 text-xs">Kontrak Harian</span>
                      </div>
                      <span className="text-pink-400 font-semibold text-sm">{Math.ceil((inv.percentage * 2) / inv.duration)}%</span>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon icon="mdi:star-circle" className="text-orange-400 w-4 h-4" />
                        <span className="text-orange-200 text-xs">Total Kontrak</span>
                      </div>
                      <span className="text-orange-400 font-semibold text-sm">{Math.ceil((inv.percentage * 2))}%</span>
                    </div>
                  </div>

                  {/* Total Profit */}
                  <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl p-3 mb-4 border border-green-400/20 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon icon="mdi:cash-multiple" className="text-green-400 w-5 h-5" />
                        <span className="text-green-100 text-xs">Total Profit</span>
                      </div>
                      <span className="text-green-400 font-bold text-sm">IDR {formatCurrency(inv.total_returned)}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-purple-200 text-xs">Progress</span>
                      <span className="text-white text-xs font-semibold">{percent}%</span>
                    </div>
                    <div className="h-3 bg-purple-800/40 rounded-full overflow-hidden border border-purple-400/20 relative">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 relative overflow-hidden"
                        style={{ width: `${percent}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  {inv.last_return_at && inv.next_return_at && (
                    <div className="flex justify-between text-xs text-purple-300 mt-4 pt-3 border-t border-purple-400/20 relative z-10">
                      <div className="flex items-center gap-1">
                        <Icon icon="mdi:clock-outline" className="w-3 h-3" />
                        <span>Terakhir: {new Date(inv.last_return_at).toLocaleDateString('id-ID')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon icon="mdi:clock-plus-outline" className="w-3 h-3" />
                        <span>Berikutnya: {new Date(inv.next_return_at).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        {/* Copyright dengan jarak yang cukup dari bottom navbar */}
        <div className="text-center text-white/60 text-xs flex items-center justify-center gap-2 mt-8 mb-8">
          <Icon icon="solar:copyright-bold" className="w-3 h-3" />
          <span>2025 Stoneform Capital. All Rights Reserved.</span>
        </div>
      </div>

      {/* Bottom Navigation - Consistent with komisi.js */}
<div className="fixed bottom-0 left-0 right-0 bg-black/30 backdrop-blur-xl border-t border-purple-400/20 z-50">
  <div className="max-w-4xl mx-auto grid grid-cols-5 gap-1 p-2">
    <BottomNavbar />
  </div>
</div>

    </div>
  );
}