import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Icon } from '@iconify/react';
import { registerUser } from '../utils/api';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    password: '',
    password_confirmation: '',
    referral_code: '',
  });
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [referralLocked, setReferralLocked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [formValidation, setFormValidation] = useState({
    name: false,
    number: false,
    password: false,
    passwordMatch: false
  });

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  // Set referral code from query if present
  useEffect(() => {
    // If user already authenticated, redirect away from register
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const expiredAt = typeof window !== 'undefined' ? localStorage.getItem('expired_at') : null;
    if (token && expiredAt) {
      const now = new Date();
      const expiry = new Date(expiredAt);
      if (now < expiry) {
        router.replace('/dashboard');
        return;
      }
    }
    // Handle referral code from query string
    if (router.query && router.query.reff) {
      setFormData((prev) => ({ ...prev, referral_code: router.query.reff }));
      setReferralLocked(true);
    }
  }, [router]);

  // Form validation effect
  useEffect(() => {
    setFormValidation({
      name: formData.name.trim().length >= 3,
  // Number must start with '8' and be between 9 and 12 digits (inclusive)
  // ^8 followed by 8-11 digits -> total length 9-12
  number: /^8[0-9]{8,11}$/.test(formData.number),
      password: formData.password.length >= 6,
      passwordMatch: formData.password === formData.password_confirmation && formData.password.length > 0
    });
    setPasswordStrength(checkPasswordStrength(formData.password));
  }, [formData]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    // If editing the name field, allow only letters and spaces
    if (id === 'name') {
      const sanitized = value.replace(/[^A-Za-z\s]/g, '');
      setFormData((prev) => ({ ...prev, [id]: sanitized }));
      return;
    }

    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleNumberChange = (e) => {
    let value = e.target.value.replace(/[^0-9+]/g, '');
    // Normalize international prefix variations to start with '8'
    // If user enters +62, 62, or 0 followed by an 8, strip the prefix and keep the rest starting with 8
    // Examples: +6281234 -> 81234, 081234 -> 81234, 6281234 -> 81234
    // Remove leading + if present for easier handling
    if (value.startsWith('+')) value = value.slice(1);
    // If starts with '62' and next char is '8', remove '62'
    if (value.startsWith('62') && value[2] === '8') {
      value = value.slice(2);
    }
    // If starts with '0' and next char is '8', remove the leading '0'
    if (value.startsWith('0') && value[1] === '8') {
      value = value.slice(1);
    }
    // If user entered '8' prefixed correctly, or after normalization it starts with '8', keep digits only
    value = value.replace(/[^0-9]/g, '');
    // Enforce max length 12
    if (value.length > 12) value = value.slice(0, 12);
    setFormData((prev) => ({ ...prev, number: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (formData.password !== formData.password_confirmation) {
      setNotification({ message: 'Password dan konfirmasi password tidak sama', type: 'error' });
      return;
    }
    
    setIsLoading(true);
    setNotification({ message: '', type: '' }); // Clear previous notifications
    
    try {
      const result = await registerUser(formData);
      
      if (result && result.success === true) {
        // Success response
        const successMessage = result.message || 'Registrasi berhasil! Silakan login dengan akun Anda.';
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
        
        // Clear form data
        setFormData({ 
          name: '', 
          number: '', 
          password: '', 
          password_confirmation: '', 
          referral_code: referralLocked ? formData.referral_code : '' // Keep referral if locked
        });

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
      console.error('Register error:', error);
      
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

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 2) return 'bg-orange-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    if (passwordStrength <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Sangat Lemah';
    if (passwordStrength <= 2) return 'Lemah';
    if (passwordStrength <= 3) return 'Sedang';
    if (passwordStrength <= 4) return 'Kuat';
    return 'Sangat Kuat';
  };

  const isFormValid = Object.values(formValidation).every(Boolean);

  return (
    <>
      <Head>
        <title>Stoneform Capital | Register</title>
        <meta name="description" content="Buat akun Stoneform Anda" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden py-8">
        {/* Enhanced decorative background elements */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-br from-yellow-400/25 to-pink-400/25 rounded-full blur-3xl z-0 animate-pulse"></div>
        <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-gradient-to-br from-purple-400/25 to-blue-400/25 rounded-full blur-2xl z-0 animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 -right-10 w-40 h-40 bg-gradient-to-br from-green-400/20 to-cyan-400/20 rounded-full blur-xl z-0 animate-bounce-slow"></div>
        <div className="absolute bottom-1/4 -left-10 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-xl z-0 animate-bounce-slow delay-500"></div>

        {/* Floating icons */}
        <div className="absolute top-10 left-10 text-white/20 animate-float">
          <Icon icon="mdi:account-plus" className="w-8 h-8" />
        </div>
        <div className="absolute top-20 right-20 text-white/20 animate-float delay-1000">
          <Icon icon="mdi:handshake" className="w-6 h-6" />
        </div>
        <div className="absolute bottom-20 left-20 text-white/20 animate-float delay-2000">
          <Icon icon="mdi:rocket-launch" className="w-7 h-7" />
        </div>
        <div className="absolute bottom-10 right-10 text-white/20 animate-float delay-3000">
          <Icon icon="mdi:trophy" className="w-6 h-6" />
        </div>

        <div className="relative z-10 w-full max-w-lg p-6">
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
                {/* Success particles */}
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75"></div>
                <div className="absolute -bottom-1 -left-2 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-50 delay-500"></div>
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
                <Icon icon="mdi:account-plus" className="w-6 h-6 text-pink-400 animate-bounce-gentle" />
                Bergabung Bersama Kami
                <Icon icon="mdi:rocket-launch" className="w-6 h-6 text-blue-400 animate-pulse" />
              </h2>
              <p className="text-purple-200 text-sm flex items-center justify-center gap-2">
                <Icon icon="mdi:handshake" className="w-4 h-4" />
                Mulai perjalanan investasi Anda hari ini
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
              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-purple-200 text-sm font-semibold mb-2 flex items-center gap-2">
                  <Icon icon="mdi:account" className="w-4 h-4 text-purple-300" />
                  Nama Lengkap
                </label>
                <div className="relative group">
                  <div className="flex items-center bg-white/10 rounded-xl border border-purple-400/20 focus-within:border-pink-400/40 focus-within:shadow-lg focus-within:shadow-pink-500/10 transition-all duration-300">
                    <Icon icon="mdi:account" className="px-3 text-purple-300 w-5 h-5" />
                    <input
                      type="text"
                      id="name"
                      className="flex-1 bg-transparent outline-none px-2 py-3 text-white placeholder-purple-400 text-sm rounded-xl"
                      placeholder="Masukkan nama lengkap Anda"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                    />
                    <div className="px-3">
                      {formValidation.name ? (
                        <Icon icon="mdi:check-circle" className="w-5 h-5 text-green-400" />
                      ) : (
                        <Icon icon="mdi:account-outline" className="w-5 h-5 text-purple-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone Number Field */}
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
                      {formValidation.number ? (
                        <Icon icon="mdi:check-circle" className="w-5 h-5 text-green-400" />
                      ) : (
                        <Icon icon="mdi:phone-outline" className="w-5 h-5 text-purple-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Field */}
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
                      placeholder="Buat password yang kuat"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      autoComplete="new-password"
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
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-600/30 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                            style={{ width: `${(passwordStrength / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className={`text-xs font-medium ${getPasswordStrengthColor().replace('bg-', 'text-')}`}>
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <div className="text-xs text-purple-300 space-y-1">
                        <div className="flex items-center gap-2">
                          <Icon 
                            icon={formData.password.length >= 6 ? "mdi:check" : "mdi:close"} 
                            className={`w-3 h-3 ${formData.password.length >= 6 ? 'text-green-400' : 'text-red-400'}`} 
                          />
                          <span>Minimal 6 karakter</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="password_confirmation" className="block text-purple-200 text-sm font-semibold mb-2 flex items-center gap-2">
                  <Icon icon="mdi:lock-check" className="w-4 h-4 text-purple-300" />
                  Konfirmasi Password
                </label>
                <div className="relative group">
                  <div className="flex items-center bg-white/10 rounded-xl border border-purple-400/20 focus-within:border-pink-400/40 focus-within:shadow-lg focus-within:shadow-pink-500/10 transition-all duration-300">
                    <Icon icon="mdi:lock-check" className="px-3 text-purple-300 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="password_confirmation"
                      className="flex-1 bg-transparent outline-none px-2 py-3 text-white placeholder-purple-400 text-sm rounded-xl"
                      placeholder="Ulangi password Anda"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="px-3 text-purple-300 hover:text-white transition-colors mr-2"
                    >
                      <Icon 
                        icon={showConfirmPassword ? "mdi:eye-off" : "mdi:eye"} 
                        className="w-5 h-5" 
                      />
                    </button>
                    <div className="px-3">
                      {formData.password_confirmation && (
                        formValidation.passwordMatch ? (
                          <Icon icon="mdi:check-circle" className="w-5 h-5 text-green-400" />
                        ) : (
                          <Icon icon="mdi:close-circle" className="w-5 h-5 text-red-400" />
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Referral Code Field */}
              <div className="space-y-2">
                <label htmlFor="referral_code" className="block text-purple-200 text-sm font-semibold mb-2 flex items-center gap-2">
                  <Icon icon="mdi:gift-outline" className="w-4 h-4 text-purple-300" />
                  Kode Referral
                  <span className="text-xs text-purple-400">(Opsional)</span>
                </label>
                <div className="relative group">
                  <div className={`flex items-center bg-white/10 rounded-xl border border-purple-400/20 ${!referralLocked ? 'focus-within:border-pink-400/40 focus-within:shadow-lg focus-within:shadow-pink-500/10' : ''} transition-all duration-300`}>
                    <Icon icon="mdi:gift-outline" className="px-3 text-purple-300 w-5 h-5" />
                    <input
                      type="text"
                      id="referral_code"
                      className={`flex-1 bg-transparent outline-none px-2 py-3 text-white placeholder-purple-400 text-sm rounded-xl ${referralLocked ? 'opacity-60 cursor-not-allowed' : ''}`}
                      placeholder="Masukkan kode referral (jika ada)"
                      value={formData.referral_code}
                      onChange={handleChange}
                      disabled={referralLocked}
                    />
                    <div className="px-3">
                      {referralLocked ? (
                        <Icon icon="mdi:lock" className="w-5 h-5 text-yellow-400" />
                      ) : formData.referral_code ? (
                        <Icon icon="mdi:gift" className="w-5 h-5 text-green-400" />
                      ) : (
                        <Icon icon="mdi:gift-outline" className="w-5 h-5 text-purple-400" />
                      )}
                    </div>
                  </div>
                  {referralLocked && (
                    <div className="text-xs text-green-400 mt-1 flex items-center gap-1">
                      <Icon icon="mdi:information" className="w-4 h-4" />
                      Kode referral dari link undangan, tidak dapat diubah
                    </div>
                  )}
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
                    <span>Sedang Mendaftar...</span>
                    <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" />
                  </span>
                ) : (
                  <span className="flex items-center gap-3 relative z-10">
                    <Icon icon="mdi:account-plus" className="w-6 h-6" />
                    <span>Daftar Sekarang</span>
                    <Icon icon="mdi:rocket-launch" className="w-5 h-5" />
                  </span>
                )}
              </button>

              {/* Form Validation Summary */}
              {!isFormValid && (
                <div className="bg-orange-500/10 border border-orange-400/30 rounded-xl p-3 text-sm">
                  <div className="flex items-center gap-2 text-orange-300 mb-2">
                    <Icon icon="mdi:alert-circle" className="w-4 h-4" />
                    <span className="font-semibold">Lengkapi formulir:</span>
                  </div>
                  <div className="space-y-1 text-orange-200 text-xs">
                    {!formValidation.name && (
                      <div className="flex items-center gap-2">
                        <Icon icon="mdi:circle-small" className="w-3 h-3" />
                        <span>Nama minimal 3 karakter</span>
                      </div>
                    )}
                    {!formValidation.number && (
                      <div className="flex items-center gap-2">
                        <Icon icon="mdi:circle-small" className="w-3 h-3" />
                        <span>Nomor HP 9-12 digit, awalan 8 (contoh: 812345678)</span>
                      </div>
                    )}
                    {!formValidation.password && (
                      <div className="flex items-center gap-2">
                        <Icon icon="mdi:circle-small" className="w-3 h-3" />
                        <span>Password minimal 6 karakter</span>
                      </div>
                    )}
                    {!formValidation.passwordMatch && formData.password_confirmation && (
                      <div className="flex items-center gap-2">
                        <Icon icon="mdi:circle-small" className="w-3 h-3" />
                        <span>Password tidak sama</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </form>

            {/* Enhanced Footer Links */}
            <div className="mt-8 text-center">
              <div className="text-purple-200 text-sm mb-4 flex items-center justify-center gap-2">
                <Icon icon="mdi:account-check" className="w-4 h-4" />
                Sudah punya akun?
              </div>
              <Link href="/login">
                <span className="inline-flex items-center gap-2 text-pink-400 font-semibold hover:text-pink-300 transition-colors duration-200 bg-pink-400/10 px-4 py-2 rounded-xl hover:bg-pink-400/20 cursor-pointer">
                  <Icon icon="mdi:login" className="w-4 h-4" />
                  Login Sekarang
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
          .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        `}</style>
      </div>
    </>
  );
}