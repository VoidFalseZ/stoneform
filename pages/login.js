import Head from 'next/head';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Icon } from '@iconify/react';
import { loginUser } from '../utils/api';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ number: '', password: '' });
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleNumberChange = (e) => {
    let value = e.target.value.replace(/[^0-9+]/g, '');

    // Normalize +62, 62, or leading 0 when followed by 8 -> make it start with 8
    // Examples:
    // +6281234... -> 81234...
    // 6281234... -> 81234...
    // 081234... -> 81234...
    // If user enters other patterns, keep digits only but ensure it starts with 8 when possible
    // Remove leading + if any for easier processing
    if (value.startsWith('+')) {
      value = value.slice(1);
    }

    // Now work with digits only
    value = value.replace(/[^0-9]/g, '');

    if (/^(62|0)8/.test(value)) {
      // remove leading 62 or 0
      value = value.replace(/^(62|0)/, '');
    }

    // Ensure it starts with 8; if user typed 8 already keep as is
    if (!value.startsWith('8') && value.length > 0) {
      // If first digit is not 8, try to remove any leading country code remnants like 62
      value = value.replace(/^62/, '');
    }

    // Enforce max length 12 (total digits)
    if (value.length > 12) value = value.slice(0, 12);

    setFormData((prev) => ({ ...prev, number: value }));
  };

  // Check form validity: phone must start with 8 and be 9-12 digits, password >=6
  useEffect(() => {
    const num = formData.number || '';
    const isPhoneValid = /^8\d{8,11}$/.test(num); // 9 to 12 digits total, starting with 8
    setIsFormValid(isPhoneValid && (formData.password || '').length >= 6);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification({ message: '', type: '' }); // Clear previous notifications
    
    try {
      const result = await loginUser(formData);
      
      if (result && result.success === true) {
        // Success response
        const successMessage = result.message || 'Login berhasil! Mengalihkan ke dashboard...';
        setNotification({ message: successMessage, type: 'success' });
        
        // Store auth data
        if (result.data && result.data.token) {
          localStorage.setItem('token', result.data.token);
          const expiry = new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString();
          localStorage.setItem('expired_at', expiry);
        }
        if (result.data && result.data.user) {
          localStorage.setItem('user', JSON.stringify(result.data.user));
        }
        if (result.data && result.data.application) {
          localStorage.setItem('application', JSON.stringify(result.data.application));
        }
        
        setFormData({ number: '', password: '' });
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('user-token-changed'));
        }
        
        // Redirect after showing success message
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
        
      } else if (result && result.success === false) {
        // Error response from server
        const errorMessage = result.message || 'Terjadi kesalahan. Silakan coba lagi.';
        setNotification({ message: errorMessage, type: 'error' });
      } else {
        // Unexpected response format
        setNotification({ message: 'Respon server tidak valid. Silakan coba lagi.', type: 'error' });
      }
      
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const statusCode = error.response.status;
        const responseData = error.response.data;
        
        if (statusCode >= 400 && statusCode < 500) {
          // Client errors (4xx)
          const errorMessage = responseData?.message || 'Data yang dimasukkan tidak valid';
          setNotification({ message: errorMessage, type: 'error' });
        } else if (statusCode >= 500) {
          // Server errors (5xx)
          const errorMessage = responseData?.message || 'Terjadi kesalahan server. Silakan coba lagi nanti.';
          setNotification({ message: errorMessage, type: 'error' });
        } else {
          setNotification({ message: 'Terjadi kesalahan yang tidak diketahui', type: 'error' });
        }
      } else if (error.request) {
        // Network error
        setNotification({ message: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.', type: 'error' });
      } else {
        // Other errors
        const errorMessage = error.message || 'Terjadi kesalahan. Silakan coba lagi.';
        setNotification({ message: errorMessage, type: 'error' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const expiredAt = typeof window !== 'undefined' ? localStorage.getItem('expired_at') : null;
    if (token && expiredAt) {
      const now = new Date();
      const expiry = new Date(expiredAt);
      if (now < expiry) {
        router.replace('/dashboard');
      }
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>Stoneform Capital | Login</title>
        <meta name="description" content="Login ke akun Stoneform Anda" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
        {/* Enhanced decorative background elements */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-br from-yellow-400/25 to-pink-400/25 rounded-full blur-3xl z-0 animate-pulse"></div>
        <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-gradient-to-br from-purple-400/25 to-blue-400/25 rounded-full blur-2xl z-0 animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 -right-10 w-40 h-40 bg-gradient-to-br from-green-400/20 to-cyan-400/20 rounded-full blur-xl z-0 animate-bounce-slow"></div>
        <div className="absolute bottom-1/4 -left-10 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-xl z-0 animate-bounce-slow delay-500"></div>

        {/* Floating icons */}
        <div className="absolute top-10 left-10 text-white/20 animate-float">
          <Icon icon="mdi:currency-usd" className="w-8 h-8" />
        </div>
        <div className="absolute top-20 right-20 text-white/20 animate-float delay-1000">
          <Icon icon="mdi:chart-line" className="w-6 h-6" />
        </div>
        <div className="absolute bottom-20 left-20 text-white/20 animate-float delay-2000">
          <Icon icon="mdi:diamond-stone" className="w-7 h-7" />
        </div>
        <div className="absolute bottom-10 right-10 text-white/20 animate-float delay-3000">
          <Icon icon="mdi:bank" className="w-6 h-6" />
        </div>

        <div className="relative z-10 w-full max-w-md p-6">
          <div className="bg-gradient-to-br from-purple-800/70 to-pink-600/70 backdrop-blur-xl rounded-3xl p-8 border border-purple-400/30 shadow-2xl animate-fadeIn hover:shadow-purple-500/20 transition-all duration-500">
            
            {/* Enhanced Logo Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl border border-purple-400/30 mb-3 transform group-hover:scale-110 transition-transform duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-pink-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <img 
                    src="/logo.png" 
                    alt="Logo" 
                    className="w-10 h-10 relative z-10" 
                    onError={(e) => { 
                      e.target.style.display = 'none'; 
                      e.target.nextSibling.style.display = 'block'; 
                    }} 
                  />
                  <Icon icon="mdi:diamond" className="text-yellow-400 w-10 h-10 relative z-10 drop-shadow-lg" style={{ display: 'none' }} />
                </div>
                {/* Floating particles around logo */}
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
                <div className="absolute -bottom-1 -left-2 w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-50 delay-500"></div>
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-2 tracking-wide flex items-center gap-3">
                <Icon icon="mdi:shield-check" className="w-6 h-6 text-green-400 animate-pulse" />
                Stoneform Capital
                <Icon icon="mdi:star-four-points" className="w-5 h-5 text-yellow-400 animate-spin-slow" />
              </h1>
              <div className="flex items-center gap-2 text-purple-200 text-sm font-medium">
                <Icon icon="mdi:shield-lock" className="w-4 h-4 text-green-400" />
                <span>Secured</span>
                <Icon icon="mdi:check-decagram" className="w-4 h-4 text-blue-400" />
                <span>Trusted</span>
                <Icon icon="mdi:trending-up" className="w-4 h-4 text-yellow-400" />
                <span>High Income</span>
              </div>
            </div>

            {/* Enhanced Header Section */}
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                <Icon icon="mdi:login" className="w-6 h-6 text-pink-400 animate-bounce-gentle" />
                Selamat Datang Kembali
                <Icon icon="mdi:hand-wave" className="w-6 h-6 text-yellow-400 animate-wave" />
              </h2>
              <p className="text-purple-200 text-sm flex items-center justify-center gap-2">
                <Icon icon="mdi:account-circle" className="w-4 h-4" />
                Masuk untuk mengelola investasi Anda
                <Icon icon="mdi:arrow-right" className="w-4 h-4 animate-pulse" />
              </p>
            </div>

            {/* Enhanced Notification */}
            {notification.message && (
              <div className={`mb-6 px-5 py-3 rounded-2xl text-sm font-medium flex items-center gap-3 animate-shake backdrop-blur-sm ${
                notification.type === 'success'
                  ? 'bg-green-500/20 text-green-300 border border-green-400/30'
                  : 'bg-red-500/20 text-red-300 border border-red-400/30'
              }`}>
                <Icon 
                  icon={notification.type === 'success' ? 'mdi:check-circle' : 'mdi:alert-circle'} 
                  className="w-5 h-5 flex-shrink-0" 
                />
                <span className="flex-1">{notification.message}</span>
                {notification.type === 'success' && (
                  <Icon icon="mdi:party-popper" className="w-5 h-5 animate-bounce" />
                )}
              </div>
            )}

            {/* Enhanced Form */}
            <form onSubmit={handleSubmit} className="space-y-6 animate-slideUp">
              <div className="space-y-2">
                <label htmlFor="number" className="block text-purple-200 text-sm font-semibold mb-2 flex items-center gap-2">
                  <Icon icon="mdi:phone" className="w-4 h-4 text-purple-300" />
                  Nomor HP
                </label>
                <div className="relative group">
                  <div className="flex items-center bg-white/10 rounded-xl border border-purple-400/20 focus-within:border-pink-400/40 focus-within:shadow-lg focus-within:shadow-pink-500/10 transition-all duration-300">
                    <div className="flex items-center px-4 py-3">
                      <Icon icon="flag:id-4x3" className="w-5 h-5 mr-2" />
                      <span className="text-purple-300 text-sm font-semibold">+62</span>
                    </div>
                    <input
                      type="tel"
                      id="number"
                      className="flex-1 bg-transparent outline-none px-2 py-3 text-white placeholder-purple-400 text-sm rounded-xl"
                      placeholder="8xxxxxxxxxxx"
                      value={formData.number}
                      onChange={handleNumberChange}
                      required
                      autoComplete="username"
                    />
                    <div className="px-3">
                      {/^8\d{8,11}$/.test(formData.number) ? (
                        <Icon icon="mdi:check-circle" className="w-5 h-5 text-green-400" />
                      ) : (
                        <Icon icon="mdi:phone-outline" className="w-5 h-5 text-purple-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-purple-200 text-sm font-semibold mb-2 flex items-center gap-2">
                  <Icon icon="mdi:lock" className="w-4 h-4 text-purple-300" />
                  Password
                </label>
                <div className="relative group">
                  <div className="flex items-center bg-white/10 rounded-xl border border-purple-400/20 focus-within:border-pink-400/40 focus-within:shadow-lg focus-within:shadow-pink-500/10 transition-all duration-300">
                    <Icon icon="mdi:lock" className="px-3 text-purple-300 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="flex-1 bg-transparent outline-none px-2 py-3 text-white placeholder-purple-400 text-sm rounded-xl"
                      placeholder="Masukkan password Anda"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="px-3 text-purple-300 hover:text-white transition-colors"
                    >
                      <Icon 
                        icon={showPassword ? "mdi:eye-off" : "mdi:eye"} 
                        className="w-5 h-5" 
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Enhanced Submit Button */}
              <button
                type="submit"
                className={`w-full font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg border border-purple-400/30 relative overflow-hidden ${
                  isFormValid 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:shadow-purple-500/25 hover:scale-105 text-white' 
                    : 'bg-gray-600/50 text-gray-300 cursor-not-allowed'
                }`}
                disabled={isLoading || !isFormValid}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-pink-400/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                {isLoading ? (
                  <span className="flex items-center gap-3 relative z-10">
                    <span className="animate-spin rounded-full h-6 w-6 border-2 border-purple-400 border-t-transparent"></span>
                    <span>Sedang Login...</span>
                    <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" />
                  </span>
                ) : (
                  <span className="flex items-center gap-3 relative z-10">
                    <Icon icon="mdi:login-variant" className="w-6 h-6" />
                    <span>Masuk Sekarang</span>
                    <Icon icon="mdi:arrow-right-bold" className="w-5 h-5" />
                  </span>
                )}
              </button>
            </form>

            {/* Enhanced Footer Links */}
            <div className="mt-8 text-center">
              <div className="text-purple-200 text-sm mb-4 flex items-center justify-center gap-2">
                <Icon icon="mdi:account-question" className="w-4 h-4" />
                Belum punya akun?
              </div>
              <Link href="/register">
                <span className="inline-flex items-center gap-2 text-pink-400 font-semibold hover:text-pink-300 transition-colors duration-200 bg-pink-400/10 px-4 py-2 rounded-xl hover:bg-pink-400/20 cursor-pointer">
                  <Icon icon="mdi:account-plus" className="w-4 h-4" />
                  Daftar Sekarang
                  <Icon icon="mdi:arrow-right" className="w-4 h-4" />
                </span>
              </Link>
            </div>

            {/* Enhanced Copyright */}
            <div className="text-center text-white/50 text-xs flex items-center justify-center gap-2 mt-8 pt-6 border-t border-purple-400/20">
              <Icon icon="mdi:copyright" className="w-4 h-4" />
              <span>2025 Stoneform Capital.</span>
              <Icon icon="mdi:heart" className="w-3 h-3 text-red-400 animate-pulse" />
              <span>All Rights Reserved.</span>
            </div>
          </div>
        </div>

        <style jsx global>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
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
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes bounce-gentle {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-3px); }
          }
          @keyframes wave {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-10deg); }
            75% { transform: rotate(10deg); }
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
          .animate-slideUp { animation: slideUp 0.5s ease-out; }
          .animate-shake { animation: shake 0.5s ease-in-out; }
          .animate-float { animation: float 3s ease-in-out infinite; }
          .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
          .animate-bounce-gentle { animation: bounce-gentle 2s ease-in-out infinite; }
          .animate-wave { animation: wave 2s ease-in-out infinite; }
          .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        `}</style>
      </div>
    </>
  );
}