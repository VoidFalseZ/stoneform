import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Home, Users, Gift, CreditCard, User, ArrowLeft, Plus, Edit3, Trash2, AlertTriangle } from 'lucide-react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { getBankAccounts, deleteBankAccount } from '../utils/api';
import BottomNavbar from '../components/BottomNavbar';

const navItems = [
  { label: 'Home', icon: Home, href: '/dashboard', key: 'dashboard' },
  { label: 'Komisi', icon: Users, href: '/komisi', key: 'komisi' },
  { label: 'Spin', icon: Gift, href: '/spin-wheel', key: 'spin' },
  { label: 'Testimoni', icon: CreditCard, href: '/testimoni', key: 'testimoni' },
  { label: 'Profil', icon: User, href: '/profile', key: 'profile' },
];

export default function BankAccount() {
  const router = useRouter();
  const [bankAccounts, setBankAccounts] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info'); // 'success', 'error', 'info'
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, account: null });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchData();
  }, []);

  // Hoisted function so it can be called from useEffect above
  async function fetchData() {
    setLoading(true);
    try {
      const bankRes = await getBankAccounts();
      setBankAccounts(bankRes.data.bank_account || []);
    } catch (err) {
      setMessage(err.message);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteClick = (account) => {
    setDeleteModal({ show: true, account });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.account) return;
    
    setMessage('');
    try {
      const res = await deleteBankAccount(deleteModal.account.id);
      setMessage(res.message);
      setMessageType('success');
      fetchData();
    } catch (err) {
      setMessage(err.message);
      setMessageType('error');
    }
    
    setDeleteModal({ show: false, account: null });
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ show: false, account: null });
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 pb-24">
      <Head>
        <title>Stoneform Capital | Akun Bank</title>
        <meta name="description" content="Kelola akun bank Anda di Stoneform Capital" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/7.2.96/css/materialdesignicons.min.css" />
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
              <h1 className="text-lg font-bold text-white">Rekening Bank</h1>
            </div>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6">
        {/* Floating Message */}
        {message && (
          <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all duration-500 ${
            messageType === 'success' 
              ? 'bg-green-500/90 border-green-400/50 text-white' 
              : messageType === 'error'
              ? 'bg-red-500/90 border-red-400/50 text-white'
              : 'bg-blue-500/90 border-blue-400/50 text-white'
          }`}>
            <div className="flex items-center gap-2">
              <Icon 
                icon={messageType === 'success' ? 'mdi:check-circle' : messageType === 'error' ? 'mdi:alert-circle' : 'mdi:information'} 
                className="text-lg" 
              />
              <span className="font-medium">{message}</span>
            </div>
          </div>
        )}

        {/* Header Card */}
        <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              <Icon icon="mdi:bank-outline" className="text-3xl text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Rekening Bank</h2>
              <p className="text-white/70 text-sm">Kelola rekening untuk penarikan</p>
            </div>
          </div>
          
          <Link href="/bank/add">
            <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-105 active:scale-95">
              <Plus size={20} />
              Tambah Rekening Baru
            </button>
          </Link>
        </div>

        {/* Bank Accounts List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin"></div>
                <p className="text-white/70 font-medium">Memuat data...</p>
              </div>
            </div>
          ) : bankAccounts.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center">
              <Icon icon="mdi:bank-off-outline" className="text-6xl text-white/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Belum Ada Rekening</h3>
              <p className="text-white/70 text-sm mb-4">Tambahkan rekening bank untuk memulai penarikan dana</p>
            </div>
          ) : (
            bankAccounts.map(account => (
              <div key={account.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-3 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-2xl">
                      <Icon icon="mdi:bank" className="text-2xl text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-lg truncate">{account.bank_name}</h3>
                      <p className="text-white/80 font-medium">{account.account_number}</p>
                      <p className="text-white/60 text-sm truncate">{account.account_name}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link href={`/bank/edit?id=${account.id}`}>
                      <button className="p-3 rounded-xl bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 hover:text-blue-200 transition-all duration-300 active:scale-95">
                        <Edit3 size={18} />
                      </button>
                    </Link>
                    <button 
                      onClick={() => handleDeleteClick(account)}
                      className="p-3 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 hover:text-red-200 transition-all duration-300 active:scale-95"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-br from-purple-800/40 to-pink-600/30 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl mt-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Icon icon="mdi:lightbulb-outline" className="text-yellow-400" />
            Tips Keamanan
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Icon icon="mdi:check-circle" className="text-green-400 mt-1 flex-shrink-0" />
              <p className="text-sm text-white/80">Pastikan nama pemilik rekening sesuai dengan identitas Anda</p>
            </div>
            <div className="flex items-start gap-3">
              <Icon icon="mdi:shield-check" className="text-blue-400 mt-1 flex-shrink-0" />
              <p className="text-sm text-white/80">Gunakan nomor rekening yang valid dan aktif</p>
            </div>
            <div className="flex items-start gap-3">
              <Icon icon="mdi:close" className="text-red-500 mt-1 flex-shrink-0" />
              <p className="text-sm text-white/80">Rekening yang telah digunakan untuk penarikan tidak dapat dihapus</p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
        <div className="text-center text-white/60 text-xs flex items-center justify-center gap-2 mt-4 mb-12">
          <Icon icon="solar:copyright-bold" className="w-3 h-3" />
          <span>2025 Stoneform Capital. All Rights Reserved.</span>
        </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-purple-800/90 to-pink-700/90 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl max-w-sm w-full mx-4 animate-in fade-in zoom-in duration-300">
            <div className="text-center">
              <div className="p-3 bg-red-500/20 rounded-full w-fit mx-auto mb-4">
                <AlertTriangle className="text-red-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Hapus Rekening?</h3>
              <p className="text-white/70 mb-1">Anda yakin ingin menghapus rekening:</p>
              <p className="text-white font-semibold mb-4">{deleteModal.account?.bank_name} - {deleteModal.account?.account_number}</p>
              <p className="text-red-300 text-sm mb-6">Tindakan ini tidak dapat dibatalkan</p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteCancel}
                  className="flex-1 bg-white/10 text-white font-semibold py-3 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 rounded-2xl transition-all duration-300 shadow-lg"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation - Consistent with komisi.js */}
<div className="fixed bottom-0 left-0 right-0 bg-black/30 backdrop-blur-xl border-t border-purple-400/20 z-50">
  <div className="max-w-4xl mx-auto grid grid-cols-5 gap-1 p-2">
    <BottomNavbar />
  </div>
</div>


      <style jsx global>{`
        @import url('https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/7.2.96/css/materialdesignicons.min.css');
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Poppins', sans-serif; }
        body { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes zoomIn {
          from { transform: scale(0.9); }
          to { transform: scale(1); }
        }
        .animate-in {
          animation: fadeIn 0.3s ease-out;
        }
        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        .zoom-in {
          animation: zoomIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}