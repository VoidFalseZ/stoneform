import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Home, Users, Gift, CreditCard, User, BarChart3, ArrowLeft } from 'lucide-react';
import { Icon } from '@iconify/react';
import { getBankAccounts, withdrawUser } from '../utils/api';
import BottomNavbar from '../components/BottomNavbar';

const navItems = [
  { label: 'Home', icon: Home, href: '/dashboard', key: 'dashboard' },
  { label: 'Komisi', icon: Users, href: '/referral', key: 'komisi' },
  { label: 'Spin', icon: Gift, href: '/spin-wheel', key: 'spin' },
  { label: 'Testimoni', icon: CreditCard, href: '/testimoni', key: 'testimoni' },
  { label: 'Profil', icon: User, href: '/profile', key: 'profile' },
];

const Withdraw = () => {
  const router = useRouter();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [selectedBankId, setSelectedBankId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [userData, setUserData] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [minWithdraw, setMinWithdraw] = useState(50000);
  const [maxWithdraw, setMaxWithdraw] = useState(5000000);
  const [fee, setFee] = useState(10);

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
    // Get min/max withdraw from localStorage.application
    try {
      const appConfig = JSON.parse(localStorage.getItem('application') || '{}');
      if (appConfig.min_withdraw) setMinWithdraw(Number(appConfig.min_withdraw));
      if (appConfig.max_withdraw) setMaxWithdraw(Number(appConfig.max_withdraw));
      if (appConfig.fee) setFee(Number(appConfig.withdraw_charge));
    } catch {}
    setPageLoading(false);
  }, [router]);

  useEffect(() => {
    // Ambil rekening bank
    const fetchBank = async () => {
      setFetching(true);
      try {
        const res = await getBankAccounts();
        setBankAccounts(res.data.bank_account || []);
        if (res.data.bank_account && res.data.bank_account.length > 0) {
          setSelectedBankId(res.data.bank_account[0].id);
        }
      } catch (err) {
        setErrorMsg('Gagal mengambil data rekening bank');
      } finally {
        setFetching(false);
      }
    };
    if (!pageLoading) {
      fetchBank();
    }
  }, [pageLoading]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    if (!selectedBankId) {
      setErrorMsg('Silakan pilih rekening bank terlebih dahulu');
      return;
    }
    const amountNum = Number(withdrawAmount);
    if (isNaN(amountNum) || amountNum < minWithdraw || amountNum > maxWithdraw) {
      setErrorMsg(`Jumlah penarikan minimal IDR ${formatCurrency(minWithdraw)} dan maksimal IDR ${formatCurrency(maxWithdraw)}`);
      return;
    }
    if (amountNum > userData?.balance) {
      setErrorMsg('Saldo tidak mencukupi untuk penarikan ini');
      return;
    }
    setLoading(true);
    try {
      const data = await withdrawUser({ amount: amountNum, bank_account_id: selectedBankId });
      if (data.success) {
        setSuccessMsg(data.message);
        setWithdrawAmount('');
      } else {
        setErrorMsg(data.message);
      }
    } catch (err) {
      setErrorMsg('Terjadi kesalahan saat memproses penarikan');
    }
    setLoading(false);
  };

  if (pageLoading) {
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
        <title>Stoneform Capital | Penarikan Dana</title>
        <meta name="description" content="Penarikan dana Stoneform Capital" />
        <link rel="icon" href="/logo.png" />
      </Head>

      {/* Top Navigation - Following portfolio style */}
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
              <Icon icon="mdi:cash-fast" className="text-xl text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Penarikan Dana</h1>
            </div>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6">
        {/* Header Section - Following portfolio style */}
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

        {/* Bank Account Selection */}
        <div className="bg-gradient-to-br from-purple-800/40 to-pink-600/30 backdrop-blur-xl rounded-3xl p-6 border border-purple-400/20 shadow-2xl mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Icon icon="mdi:bank" className="text-white w-5 h-5" />
            </div>
            <h3 className="text-white font-semibold text-lg">Pilih Rekening Tujuan</h3>
          </div>

          {fetching ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin"></div>
                <p className="text-purple-200 text-sm">Memuat data rekening...</p>
              </div>
            </div>
          ) : bankAccounts.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-red-400/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon icon="mdi:bank-off-outline" className="text-red-400 w-8 h-8" />
              </div>
              <h4 className="text-white font-semibold mb-2">Belum Ada Rekening Bank</h4>
              <p className="text-purple-200 text-sm mb-4">Anda harus menambahkan akun bank terlebih dahulu untuk melakukan penarikan dana.</p>
              <button
                onClick={() => router.push('/bank')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-105 active:scale-95 mx-auto"
              >
                <Icon icon="mdi:bank-plus" className="w-5 h-5" />
                Tambah Akun Bank
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {bankAccounts.map((bank) => (
                <div key={bank.id} className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${selectedBankId === bank.id ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-2 border-purple-400/50' : 'bg-white/10 border border-purple-400/20 hover:bg-white/15'}`}>
                  <label className="flex items-center gap-4 p-4 cursor-pointer">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${selectedBankId === bank.id ? 'border-purple-400 bg-purple-500' : 'border-purple-300'}`}>
                      {selectedBankId === bank.id && (
                        <Icon icon="mdi:check" className="text-white w-3 h-3" />
                      )}
                    </div>
                    <input
                      type="radio"
                      name="bank_account"
                      value={bank.id}
                      checked={selectedBankId === bank.id}
                      onChange={() => setSelectedBankId(bank.id)}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-3 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-2xl">
                        <Icon icon="mdi:bank" className="text-2xl text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold text-sm ${selectedBankId === bank.id ? 'text-white' : 'text-purple-100'}`}>
                          {bank.bank_name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Icon icon="mdi:credit-card-outline" className="text-purple-300 w-3 h-3" />
                          <span className={`text-xs ${selectedBankId === bank.id ? 'text-purple-200' : 'text-purple-300'}`}>
                            {bank.account_number}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Icon icon="mdi:account-outline" className="text-purple-300 w-3 h-3" />
                          <span className={`text-xs ${selectedBankId === bank.id ? 'text-purple-200' : 'text-purple-300'}`}>
                            {bank.account_name}
                          </span>
                        </div>
                      </div>
                    </div>
                    {selectedBankId === bank.id && (
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                        <Icon icon="mdi:check-bold" className="text-white w-4 h-4" />
                      </div>
                    )}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Withdrawal Form */}
        {bankAccounts.length > 0 && (
          <div className="bg-gradient-to-br from-purple-800/40 to-pink-600/30 backdrop-blur-xl rounded-3xl p-6 border border-purple-400/20 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Icon icon="mdi:cash-fast" className="text-white w-5 h-5" />
              </div>
              <h3 className="text-white font-semibold text-lg">Form Penarikan</h3>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-6">
              {/* Error/Success Message */}
              {errorMsg && (
                <div className="bg-gradient-to-r from-red-500/20 to-red-400/20 border border-red-400/30 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <Icon icon="mdi:alert-circle" className="text-red-400 w-5 h-5 flex-shrink-0" />
                    <p className="text-red-200 text-sm">{errorMsg}</p>
                  </div>
                </div>
              )}

              {successMsg && (
                <div className="bg-gradient-to-r from-green-500/20 to-green-400/20 border border-green-400/30 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <Icon icon="mdi:check-circle" className="text-green-400 w-5 h-5 flex-shrink-0" />
                    <p className="text-green-200 text-sm">{successMsg}</p>
                  </div>
                </div>
              )}

              {/* Withdrawal Amount */}
              <div>
                <label className="block text-purple-200 font-semibold text-sm mb-3">
                  <Icon icon="mdi:cash-multiple" className="inline w-4 h-4 mr-2" />
                  Jumlah Penarikan
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2 z-10">
                    <Icon icon="mdi:currency-usd" className="text-purple-300 w-4 h-4" />
                    <span className="text-purple-300 text-sm font-medium">IDR</span>
                  </div>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full bg-white/10 border border-purple-300/30 text-white rounded-2xl pl-20 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder-purple-300 text-lg font-semibold transition-all duration-300"
                    placeholder={minWithdraw.toLocaleString('id-ID')}
                    min={minWithdraw}
                    max={maxWithdraw}
                    required
                  />
                </div>
                <div className="flex items-center justify-between mt-3 text-xs">
                  <div className="flex items-center gap-1 text-purple-300">
                    <Icon icon="mdi:information-outline" className="w-3 h-3" />
                    <span>Min: IDR {formatCurrency(minWithdraw)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-purple-300">
                    <Icon icon="mdi:information-outline" className="w-3 h-3" />
                    <span>Maks: IDR {formatCurrency(maxWithdraw)}</span>
                  </div>
                </div>
              </div>

              {/* Confirmation Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-green-500/25 hover:scale-105 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                    <span>Memproses...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Icon icon="mdi:send-check" className="w-5 h-5" />
                    <span>Konfirmasi Penarikan</span>
                  </div>
                )}
              </button>
            </form>

            {/* Information Section */}
            <div className="mt-8 p-5 bg-gradient-to-br from-blue-700/30 to-indigo-600/20 rounded-2xl border border-blue-400/20">
              <h4 className="text-blue-200 font-semibold text-sm mb-4 flex items-center gap-2">
                <Icon icon="mdi:information-variant" className="text-blue-300 w-4 h-4" />
                Informasi Penarikan
              </h4>
              <div className="space-y-3">
                {[
                  { icon: "mdi:cash-multiple", text: `Penarikan dana min sebesar Rp ${formatCurrency(minWithdraw)}` },
                  { icon: "mdi:cash-minus", text: `Penarikan memakan biaya ${fee}% yang dipotong langsung dari jumlah penarikan` },
                  { icon: "mdi:clock-outline", text: "Penarikan dana akan tersedia setiap hari Senin hingga Sabtu pada pukul 12.00 - 17.00 WIB" },
                  { icon: "mdi:wallet-outline", text: "Pengguna dapat menarik seluruh saldo tersedia tanpa syarat apapun" },
                  { icon: "mdi:lightning-bolt", text: "Penarikan akan diproses sangat instan dalam 1-30 Menit" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Icon icon={item.icon} className="text-blue-300 w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="text-blue-200 text-xs leading-relaxed">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
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
};

export default Withdraw;