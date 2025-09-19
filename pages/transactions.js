// pages/income.js

import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { ArrowLeft } from 'lucide-react';
import BottomNavbar from '../components/BottomNavbar';
import { getUserTransactions } from '../utils/api';

export default function Transactions() {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Filter options
  const filterOptions = [
    { value: 'all', label: 'Semua', icon: 'mdi:view-list' },
    { value: 'withdrawal', label: 'Penarikan', icon: 'mdi:bank-transfer-out' },
    { value: 'bonus', label: 'Bonus', icon: 'mdi:gift' },
    { value: 'team', label: 'Tim', icon: 'mdi:account-group' },
    { value: 'return', label: 'Return', icon: 'mdi:cash-refund' },
    { value: 'investment', label: 'Investasi', icon: 'mdi:trending-up' }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchTransactions();
  }, [router]);

  useEffect(() => {
    filterTransactions();
  }, [transactions, selectedFilter]);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUserTransactions();
      if (res.success && res.data && Array.isArray(res.data.transactions)) {
        setTransactions(res.data.transactions);
      } else {
        setTransactions([]);
        if (!res.success) {
          setError(res.message || 'Gagal memuat riwayat transaksi');
        }
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
      console.error('Error fetching transactions:', err);
      setTransactions([]);
    }
    setLoading(false);
  };

  const filterTransactions = () => {
    if (selectedFilter === 'all') {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(
        transactions.filter(tx => tx.transaction_type === selectedFilter)
      );
    }
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

  const getTxIcon = (type) => {
    switch (type) {
      case 'withdrawal':
        return 'mdi:bank-transfer-out';
      case 'bonus':
        return 'mdi:gift';
      case 'team':
        return 'mdi:account-group';
      case 'return':
        return 'mdi:cash-refund';
      case 'investment':
        return 'mdi:trending-up';
      default:
        return 'mdi:currency-usd';
    }
  };

  const getTxTypeColor = (type) => {
    switch (type) {
      case 'withdrawal':
        return 'from-red-500 to-pink-600';
      case 'bonus':
        return 'from-green-500 to-emerald-600';
      case 'team':
        return 'from-blue-500 to-indigo-600';
      case 'return':
        return 'from-purple-500 to-violet-600';
      case 'investment':
        return 'from-orange-500 to-red-600';
      default:
        return 'from-gray-500 to-slate-600';
    }
  };

  const calculateStatistics = () => {
    const totalTransactions = filteredTransactions.length;
    const successfulTransactions = filteredTransactions.filter(tx => tx.status === 'Success');
    
    const totalCredit = successfulTransactions
      .filter(tx => tx.transaction_flow === 'credit')
      .reduce((sum, tx) => sum + tx.amount, 0);
      
    const totalDebit = successfulTransactions
      .filter(tx => tx.transaction_flow === 'debit')
      .reduce((sum, tx) => sum + tx.amount, 0);

    return {
      totalTransactions,
      totalCredit,
      totalDebit,
      netBalance: totalDebit - totalCredit
    };
  };

  const stats = calculateStatistics();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-400 border-t-transparent"></div>
            <Icon icon="mdi:currency-usd" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-400 w-6 h-6" />
          </div>
          <span className="text-purple-200 mt-4 text-sm">Memuat riwayat transaksi...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 pb-24">
      <Head>
        <title>Stoneform Capital | Riwayat Transaksi</title>
        <meta name="description" content="Lacak semua transaksi Anda" />
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
              <Icon icon="mdi:currency-usd" className="text-xl text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Riwayat Transaksi</h1>
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
              <Icon icon="mdi:receipt-text-outline" className="text-white w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Riwayat Transaksi</h2>
            <p className="text-purple-200 text-sm">Lacak semua aktivitas keuangan Anda</p>
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
              {stats.totalTransactions}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-800/40 to-pink-600/30 backdrop-blur-xl rounded-2xl p-4 border border-purple-400/20 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <Icon icon="mdi:cash-multiple" className="text-green-400 w-5 h-5" />
              <span className="text-purple-200 text-xs">Saldo Bersih</span>
            </div>
            <p className={`font-bold text-lg ${stats.netBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              IDR {formatCurrency(Math.abs(stats.netBalance))}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-gradient-to-br from-purple-800/40 to-pink-600/30 backdrop-blur-xl rounded-2xl p-4 mb-6 border border-purple-400/20 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Icon icon="mdi:filter-variant" className="text-purple-300 w-5 h-5" />
            <span className="text-purple-200 text-sm font-medium">Filter Transaksi</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedFilter(option.value)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
                  selectedFilter === option.value
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                    : 'bg-white/10 text-purple-200 hover:bg-white/20 hover:text-white'
                }`}
              >
                <Icon icon={option.icon} className="w-4 h-4" />
                {option.label}
              </button>
            ))}
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
              onClick={fetchTransactions}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <Icon icon="mdi:refresh" className="w-4 h-4" />
              Coba Lagi
            </button>
          </div>
        )}

        {/* Transaction List */}
        {filteredTransactions.length === 0 && !error ? (
          <div className="bg-gradient-to-br from-purple-800/40 to-pink-600/30 backdrop-blur-xl rounded-3xl p-8 text-center border border-purple-400/20">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-4">
              <Icon icon="mdi:receipt-text-outline" className="text-white w-8 h-8" />
            </div>
            <h4 className="text-white font-semibold text-sm mb-1">
              {selectedFilter === 'all' ? 'Belum Ada Transaksi' : `Belum Ada Transaksi ${filterOptions.find(f => f.value === selectedFilter)?.label}`}
            </h4>
            <p className="text-purple-200 text-xs mb-6">
              {selectedFilter === 'all' 
                ? 'Anda belum melakukan transaksi apapun'
                : `Anda belum memiliki transaksi ${filterOptions.find(f => f.value === selectedFilter)?.label.toLowerCase()}`
              }
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/25 mx-auto border border-purple-400/30"
            >
              <Icon icon="mdi:rocket" className="w-5 h-5" />
              Mulai Investasi
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((tx) => (
              <div key={tx.id} className="bg-gradient-to-br from-purple-800/50 to-pink-600/40 backdrop-blur-xl rounded-3xl p-6 border border-purple-400/30 shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden group">
                {/* Background decoration */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-pink-400/10 to-purple-400/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500"></div>
                
                {/* Header with Transaction Type and Status */}
                <div className="flex justify-between items-center mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${getTxTypeColor(tx.transaction_type)} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Icon icon={getTxIcon(tx.transaction_type)} className="text-white w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-white font-semibold text-sm">
                        {tx.transaction_type.charAt(0).toUpperCase() + tx.transaction_type.slice(1)}
                      </span>
                      <p className="text-purple-300 text-xs">#{tx.order_id}</p>
                    </div>
                  </div>
                  {getStatusBadge(tx.status)}
                </div>

                {/* Transaction Details */}
                <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-xl p-4 mb-4 border border-indigo-400/20 relative z-10">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon icon="mdi:information-outline" className="text-white w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-indigo-200 text-sm leading-relaxed">
                        {tx.message}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Amount and Flow */}
                <div className="grid grid-cols-2 gap-4 mb-4 relative z-10">
                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon icon={tx.transaction_flow === 'debit' ? 'mdi:plus-circle' : 'mdi:minus-circle'} 
                            className={`w-4 h-4 ${tx.transaction_flow === 'debit' ? 'text-green-400' : 'text-red-400'}`} />
                      <span className="text-white text-xs">
                        {tx.transaction_flow === 'debit' ? 'Masuk' : 'Keluar'}
                      </span>
                    </div>
                    <span className={`font-semibold text-sm ${tx.transaction_flow === 'debit' ? 'text-green-400' : 'text-red-400'}`}>
                      {tx.transaction_flow === 'debit' ? '+' : '-'}IDR {formatCurrency(tx.amount)}
                    </span>
                  </div>
                  
                  {tx.charge > 0 && (
                    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon icon="mdi:cash-minus" className="text-orange-400 w-4 h-4" />
                        <span className="text-orange-200 text-xs">Biaya</span>
                      </div>
                      <span className="text-orange-400 font-semibold text-sm">IDR {formatCurrency(tx.charge)}</span>
                    </div>
                  )}
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-xs text-purple-300 relative z-10">
                  <Icon icon="mdi:calendar-outline" className="w-3 h-3" />
                  <span>
                    {new Date().toLocaleDateString('id-ID', { 
                      day: '2-digit', 
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))}
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