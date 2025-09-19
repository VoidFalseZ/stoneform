// pages/ganti-sandi.js
import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Home, Users, Gift, CreditCard, User, BarChart3, ArrowLeft } from 'lucide-react';
import { Icon } from '@iconify/react';
import { changePassword } from '../utils/api';
import BottomNavbar from '../components/BottomNavbar';

// Define the same navigation items as in profile.js
const navItems = [
  { label: 'Home', icon: Home, href: '/dashboard', key: 'dashboard' },
  { label: 'Komisi', icon: Users, href: '/referral', key: 'komisi' },
  { label: 'Spin', icon: Gift, href: '/spin-wheel', key: 'spin' },
  { label: 'Testimoni', icon: CreditCard, href: '/testimoni', key: 'testimoni' },
  { label: 'Profil', icon: User, href: '/profile', key: 'profile' },
];


export default function GantiSandi() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [showPassword, setShowPassword] = useState({
    current_password: false,
    new_password: false,
    confirm_password: false
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    // Validation
    if (!formData.current_password) {
      setErrorMsg("Kata sandi saat ini wajib diisi.");
      setLoading(false);
      return;
    }
    if (!formData.new_password) {
      setErrorMsg("Kata sandi baru wajib diisi.");
      setLoading(false);
      return;
    }
    if (!formData.confirm_password) {
      setErrorMsg("Konfirmasi kata sandi wajib diisi.");
      setLoading(false);
      return;
    }
    if (formData.new_password.length < 6) {
      setErrorMsg("Kata sandi baru minimal 6 karakter.");
      setLoading(false);
      return;
    }
    if (formData.new_password !== formData.confirm_password) {
      setErrorMsg("Kata sandi baru dan konfirmasi tidak cocok.");
      setLoading(false);
      return;
    }

    // Call API
    try {
      const res = await changePassword({
        current_password: formData.current_password,
        password: formData.new_password,
        confirmation_password: formData.confirm_password
      });
      setSuccessMsg(res.message || "Kata sandi berhasil diperbarui!");
      setErrorMsg('');
      setLoading(false);
      setTimeout(() => {
        setSuccessMsg('');
        router.push('/profile');
      }, 2000);
    } catch (error) {
      setErrorMsg(error.message || "Terjadi kesalahan. Silakan coba lagi.");
      setSuccessMsg('');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 pb-24">
      <Head>
        <title>Stoneform Capital | Ganti Kata Sandi</title>
        <meta name="description" content="Ganti kata sandi Stoneform Capital" />
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
              <Icon icon="mdi:lock" className="text-xl text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Ganti Kata Sandi</h1>
            </div>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6">
        {/* Intro Section */}
        <div className="bg-gradient-to-r from-purple-800/50 to-pink-600/50 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-purple-400/20 shadow-2xl text-white text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Icon icon="mdi:lock-reset" className="w-6 h-6 text-yellow-400" />
            <h2 className="text-lg font-semibold">Ganti Sandi</h2>
          </div>
          <p className="text-sm text-purple-200">
            Ubah kata sandi Anda dengan aman dan cepat untuk melindungi akun Anda.
          </p>
        </div>

        {/* Form Section */}
        <div className="bg-gradient-to-br from-purple-800/40 to-pink-600/30 backdrop-blur-xl rounded-3xl p-6 border border-purple-400/20 shadow-2xl">
          {/* Success & Error Message */}
          {errorMsg && (
            <div className="text-xs text-red-300 mb-3 font-semibold border border-red-400/30 bg-red-900/30 rounded-lg px-3 py-2 animate-fadeIn">{errorMsg}</div>
          )}
          {successMsg && (
            <div className="text-xs text-green-200 mb-3 font-semibold border border-green-400/30 bg-green-900/30 rounded-lg px-3 py-2 animate-fadeIn">{successMsg}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
      {/* FadeIn Animation */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-purple-200 text-center mb-3">
                Kata Sandi Saat Ini
              </label>
              <div className="relative">
                <Icon icon="mdi:lock-outline" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 z-10" />
                <input
                  type={showPassword.current_password ? "text" : "password"}
                  name="current_password"
                  value={formData.current_password}
                  onChange={handleInputChange}
                  placeholder="•••••••"
                  className="w-full bg-white/10 border border-purple-300/30 text-white rounded-2xl pl-12 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-purple-300"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current_password')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white transition-colors"
                >
                  <Icon 
                    icon={showPassword.current_password ? "mdi:eye-off-outline" : "mdi:eye-outline"} 
                    className="w-5 h-5" 
                  />
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-purple-200 text-center mb-3">
                Kata Sandi Baru
              </label>
              <div className="relative">
                <Icon icon="mdi:key-outline" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 z-10" />
                <input
                  type={showPassword.new_password ? "text" : "password"}
                  name="new_password"
                  value={formData.new_password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full bg-white/10 border border-purple-300/30 text-white rounded-2xl pl-12 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-purple-300"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new_password')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white transition-colors"
                >
                  <Icon 
                    icon={showPassword.new_password ? "mdi:eye-off-outline" : "mdi:eye-outline"} 
                    className="w-5 h-5" 
                  />
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-purple-200 text-center mb-3">
                Konfirmasi Kata Sandi
              </label>
              <div className="relative">
                <Icon icon="mdi:key-outline" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 z-10" />
                <input
                  type={showPassword.confirm_password ? "text" : "password"}
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full bg-white/10 border border-purple-300/30 text-white rounded-2xl pl-12 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-purple-300"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm_password')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white transition-colors"
                >
                  <Icon 
                    icon={showPassword.confirm_password ? "mdi:eye-off-outline" : "mdi:eye-outline"} 
                    className="w-5 h-5" 
                  />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Icon icon="mdi:check-circle" className="w-5 h-5" />
                  Perbarui Sandi
                </>
              )}
            </button>
          </form>

          {/* Info Section */}
          <div className="mt-6 p-4 bg-gradient-to-br from-purple-700/30 to-purple-600/20 rounded-2xl border border-purple-400/20">
            <h3 className="text-purple-200 font-semibold text-sm mb-3 flex items-center gap-2">
              <Icon icon="mdi:information" className="text-purple-300" />
              Tips Keamanan Sandi
            </h3>
            <ul className="space-y-2 text-purple-200 text-xs">
              <li className="flex items-start gap-2">
                <Icon icon="mdi:check-circle" className="text-green-400 mt-0.5 flex-shrink-0" />
                <span>Minimal 6 karakter dengan kombinasi huruf besar, kecil, dan angka</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon icon="mdi:check-circle" className="text-green-400 mt-0.5 flex-shrink-0" />
                <span>Perbarui sandi setiap 3 bulan untuk keamanan maksimal</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon icon="mdi:check-circle" className="text-green-400 mt-0.5 flex-shrink-0" />
                <span>Jangan gunakan sandi yang sama untuk banyak akun</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon icon="mdi:check-circle" className="text-green-400 mt-0.5 flex-shrink-0" />
                <span>Hubungi dukungan jika lupa sandi saat ini</span>
              </li>
            </ul>
          </div>
        </div>
        {/* Copyright */}
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