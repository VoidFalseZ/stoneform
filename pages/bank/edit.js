import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Home, Users, Gift, CreditCard, User, ArrowLeft, Save } from 'lucide-react';
import { Icon } from '@iconify/react';
import { getBankList, editBankAccount, getBankAccountById } from '../../utils/api';
import BottomNavbar from '../../components/BottomNavbar';


const navItems = [
  { label: 'Home', icon: Home, href: '/dashboard', key: 'dashboard' },
  { label: 'Komisi', icon: Users, href: '/komisi', key: 'komisi' },
  { label: 'Spin', icon: Gift, href: '/spin-wheel', key: 'spin' },
  { label: 'Testimoni', icon: CreditCard, href: '/testimoni', key: 'testimoni' },
  { label: 'Profil', icon: User, href: '/profile', key: 'profile' },
];

export default function BankEdit() {
  const router = useRouter();
  const { id } = router.query;
  const [bankId, setBankId] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [banks, setBanks] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchBanks();
    if (id) fetchAccount();
  }, [id]);

  const fetchBanks = async () => {
    try {
      const banksRes = await getBankList();
      setBanks(banksRes.data.banks || []);
    } catch (err) {
      setMessage(err.message);
      setMessageType('error');
    }
  };

  const fetchAccount = async () => {
    setIsLoading(true);
    try {
      const res = await getBankAccountById(id);
      let acc = res.data.bank_account;
      if (Array.isArray(acc)) {
        acc = acc[0];
      }
      if (acc) {
        setBankId(acc.bank_id ? acc.bank_id.toString() : '');
        setBankAccount(acc.account_number || '');
        setFullName(acc.account_name || '');
      } else {
        setMessage('Data rekening tidak ditemukan');
        setMessageType('error');
      }
    } catch (err) {
      setMessage(err.message);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    try {
      const res = await editBankAccount({
        id: parseInt(id, 10),
        bank_id: parseInt(bankId, 10),
        account_number: String(bankAccount),
        account_name: String(fullName)
      });
      setMessage(res.message);
      setMessageType('success');
      setTimeout(() => router.push('/bank'), 1500);
    } catch (err) {
      setMessage(err.message);
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin"></div>
          <p className="text-white/70 font-medium text-lg">Memuat data rekening...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 pb-24">
      <Head>
        <title>Stoneform Capital | Perbarui Informasi Rekening</title>
        <meta name="description" content="Edit akun bank Anda di Stoneform Capital" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
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
              <Icon icon="mdi:bank" className="text-xl text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Perbarui Rekening</h1>
            </div>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-orange-600/30 to-red-600/30 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              <Icon icon="mdi:bank-transfer" className="text-3xl text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Perbarui Rekening</h2>
              <p className="text-white/70 text-sm">Perbarui informasi rekening bank</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Bank Selection */}
            <div>
              <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Icon icon="mdi:bank" className="text-purple-300" />
                Pilih Bank
              </label>
              <div className="relative">
                <select
                  value={bankId}
                  onChange={e => setBankId(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-2xl px-4 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent appearance-none font-medium backdrop-blur-sm"
                  required
                >
                  <option value="" className="bg-gray-800 text-white">Pilih Bank Anda</option>
                  {banks.map(bank => (
                    <option key={bank.id} value={bank.id} className="bg-gray-800 text-white">{bank.name}</option>
                  ))}
                </select>
                <Icon icon="mdi:chevron-down" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 pointer-events-none" />
              </div>
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Icon icon="mdi:credit-card-outline" className="text-blue-300" />
                Nomor Rekening
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Masukkan nomor rekening"
                  value={bankAccount}
                  onChange={e => setBankAccount(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent font-medium backdrop-blur-sm placeholder-white/50"
                  required
                />
              </div>
            </div>

            {/* Account Name */}
            <div>
              <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Icon icon="mdi:account-outline" className="text-green-300" />
                Nama Pemilik Rekening
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Sesuai dengan nama di rekening bank"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent font-medium backdrop-blur-sm placeholder-white/50"
                  required
                />
              </div>
            </div>

            {/* Message Display */}
            {message && (
              <div className={`p-4 rounded-2xl border backdrop-blur-xl ${
                messageType === 'success' 
                  ? 'bg-green-500/20 border-green-400/30 text-green-100' 
                  : 'bg-red-500/20 border-red-400/30 text-red-100'
              }`}>
                <div className="flex items-center gap-2">
                  <Icon 
                    icon={messageType === 'success' ? 'mdi:check-circle' : 'mdi:alert-circle'} 
                    className="text-lg flex-shrink-0" 
                  />
                  <span className="font-medium">{message}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !bankId || !bankAccount || !fullName}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-orange-500/25 hover:scale-105 active:scale-95 disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Menyimpan Perubahan...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Simpan Perubahan
                </>
              )}
            </button>
          </form>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl mt-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Icon icon="mdi:alert-circle-outline" className="text-yellow-300" />
            Perhatian
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Icon icon="mdi:information" className="text-blue-400 mt-1 flex-shrink-0" />
              <p className="text-sm text-white/80">Pastikan data yang diubah sudah benar sebelum menyimpan</p>
            </div>
            <div className="flex items-start gap-3">
              <Icon icon="mdi:shield-check" className="text-green-400 mt-1 flex-shrink-0" />
              <p className="text-sm text-white/80">Rekening harus tetap aktif dan dapat menerima transfer</p>
            </div>
            <div className="flex items-start gap-3">
              <Icon icon="mdi:refresh" className="text-purple-400 mt-1 flex-shrink-0" />
              <p className="text-sm text-white/80">Periksa kembali data sebelum menyimpan</p>
            </div>
          </div>
        </div>
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

      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Poppins', sans-serif; }
        body { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
        select { -webkit-appearance: none; -moz-appearance: none; appearance: none; }
        select::-ms-expand { display: none; }
        input::placeholder, select::placeholder { color: rgba(255, 255, 255, 0.5) !important; }
        input:focus, select:focus { outline: none; }
      `}</style>
    </div>
  );
}