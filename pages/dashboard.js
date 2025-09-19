// pages/dashboard.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getProducts } from '../utils/api';
import { BANKS, PAYMENT_METHODS } from '../constants/products';
import InvestmentModal from '../components/InvestmentModal';
import Toast from '../components/Toast';
import { Home, Users, Gift, CreditCard, User, BarChart3 } from 'lucide-react';
import { Icon } from '@iconify/react';
import BottomNavbar from '../components/BottomNavbar';

export default function Dashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [applicationData, setApplicationData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', type: 'success' });

  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem('user');
    const storedApplication = localStorage.getItem('application');
    
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserData({
          name: parsed.name || '',
          balance: parsed.balance || 0,
          active: parsed.active || false
        });
      } catch (e) {
        setUserData({ name: '', balance: 0, active: false });
      }
    }

    if (storedApplication) {
      try {
        const parsed = JSON.parse(storedApplication);
        setApplicationData({
          healthy: parsed.healthy || false
        });
      } catch (e) {
        setApplicationData({ healthy: false });
      }
    } else {
      setApplicationData({ healthy: false });
    }
    
    fetchProducts();
  }, []);

  // Set default selected product to Bintang 1 after products load
  useEffect(() => {
    if (products.length > 0 && !selectedProduct) {
      const b1 = products.find(p => p.name === 'Bintang 1');
      setSelectedProduct(b1 || products[0]);
    }
  }, [products, selectedProduct]);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getProducts();
      // The API returns { data: { products: [...] } }
      setProducts((data && data.data && data.data.products) ? data.data.products : []);
    } catch (err) {
      setError(err.message || 'Gagal memuat produk');
      setToast({ open: true, message: err.message || 'Gagal memuat produk', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      maximumFractionDigits: 0 
    }).format(amount);
  };

  const getStarIcon = (productName) => {
    if (productName.includes('1')) return 'mdi:star-outline';
    if (productName.includes('2')) return 'mdi:star-half-full';
    if (productName.includes('3')) return 'mdi:star';
    return 'mdi:star-outline';
  };

  const getVerificationStatus = () => {
    if (userData?.active) {
      return { text: 'Verified Investor', color: 'text-green-400' };
    }
    return { text: 'Unverified Investor', color: 'text-red-400' };
  };

  const getHealthStatus = () => {
    if (applicationData?.healthy) {
      return { text: 'Healthy', color: 'text-green-400' };
    }
    return { text: 'Unhealthy', color: 'text-red-400' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 pb-32">
      <Head>
        <title>Stoneform Capital | Dashboard</title>
        <meta name="description" content="Stoneform Capital Dashboard" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <div className="max-w-sm mx-auto p-4">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-800/60 to-pink-600/60 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-purple-400/30 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-pink-400/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-lg"></div>
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl border border-purple-400/30">
                  <Icon icon="mdi:account-circle" className="text-white w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white mb-1">{userData?.name || 'Tester'}</h1>
                  <div className="flex items-center gap-2">
                    <Icon icon="mdi:shield-check" className={`w-3 h-3 ${getVerificationStatus().color}`} />
                    <span className={`text-xs ${getVerificationStatus().color}`}>
                      {getVerificationStatus().text}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <Icon icon="mdi:wallet" className="w-4 h-4 text-purple-400" />
                <span className="text-purple-200 text-sm">Saldo:</span>
                <span className="font-semibold text-cyan-400">{formatCurrency(userData?.balance || 0)}</span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl mb-2 border border-purple-400/30">
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
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2 text-green-400">
              <Icon icon="mdi:trending-up" className="w-4 h-4" />
              <span className="font-semibold text-sm">Portfolio Growing</span>
            </div>
            <button 
              onClick={() => router.push('/portofolio')}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl transition-all duration-300 border border-white/20"
            >
              <Icon icon="mdi:chart-line" className="w-3 h-3" />
              <span className="text-xs">Portofolio Saya</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gradient-to-br from-purple-800/40 to-purple-600/30 backdrop-blur-xl rounded-2xl p-4 border border-purple-400/20 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <Icon icon="mdi:chart-box" className="text-purple-400 w-4 h-4" />
              <span className="text-purple-200 text-xs">Total Produk</span>
            </div>
            <p className="text-white font-bold text-lg">{products.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-800/40 to-green-600/30 backdrop-blur-xl rounded-2xl p-4 border border-green-400/20 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <Icon icon="mdi:shield-check" className="text-green-400 w-4 h-4" />
              <span className="text-purple-200 text-xs">Status</span>
            </div>
            <p className={`font-bold text-sm ${getHealthStatus().color}`}>{getHealthStatus().text}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-800/40 to-blue-600/30 backdrop-blur-xl rounded-2xl p-4 border border-blue-400/20 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <Icon icon="mdi:clock-check" className="text-blue-400 w-4 h-4" />
              <span className="text-purple-200 text-xs">Akses</span>
            </div>
            <p className="text-blue-400 font-bold text-sm">24/7</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-800/40 to-yellow-600/30 backdrop-blur-xl rounded-2xl p-4 border border-yellow-400/20 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <Icon icon="mdi:security" className="text-yellow-400 w-4 h-4" />
              <span className="text-purple-200 text-xs">Keamanan</span>
            </div>
            <p className="text-yellow-400 font-bold text-sm">Aman</p>
          </div>
        </div>

        {/* Loading spinner for products */}
        {loading && (
          <div className="flex flex-col items-center justify-center mb-6 animate-fadeIn">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-400 border-t-transparent"></div>
              <Icon icon="mdi:chart-box" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-400 w-5 h-5" />
            </div>
            <p className="text-white text-center mt-4 flex items-center gap-2 text-sm">
              <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
              Memuat produk investasi...
            </p>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="bg-gradient-to-r from-red-800/50 to-red-600/40 backdrop-blur-xl rounded-3xl p-6 border border-red-400/20 shadow-2xl text-center mx-auto mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Icon icon="mdi:alert-circle" className="text-red-400 w-6 h-6" />
              <h3 className="text-white font-semibold">Terjadi Kesalahan</h3>
            </div>
            <p className="text-red-200 mb-4 text-sm">{error}</p>
            <button 
              onClick={fetchProducts}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25 flex items-center gap-2 mx-auto text-sm"
            >
              <Icon icon="mdi:refresh" className="w-4 h-4" />
              Coba Lagi
            </button>
          </div>
        )}

        {/* Product Section */}
        {!loading && !error && (
          <>
            {products.length === 0 ? (
              <div className="bg-gradient-to-br from-purple-800/40 to-pink-600/30 backdrop-blur-xl rounded-3xl p-6 border border-purple-400/20 shadow-2xl text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Icon icon="mdi:information-outline" className="text-purple-400 w-6 h-6" />
                  <h3 className="text-white font-semibold">Produk Tidak Tersedia</h3>
                </div>
                <div className="text-purple-200 mb-4 text-sm">Tidak ada produk investasi tersedia saat ini.</div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <Icon icon="mdi:chart-box-outline" className="text-purple-400 w-5 h-5" />
                  <h2 className="text-xl font-bold text-white">Pilih Produk Investasi</h2>
                </div>

                {/* Product Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2 justify-center">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className={`
                        px-4 py-2 rounded-2xl font-semibold transition-all duration-300 whitespace-nowrap flex items-center gap-2 shadow-lg border text-sm
                        ${selectedProduct?.id === product.id
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-purple-500/25 scale-105 border-purple-400/30'
                          : 'bg-white/10 text-purple-200 hover:bg-white/20 backdrop-blur-sm border-purple-300/30 hover:scale-105'
                        }
                      `}
                    >
                      <Icon icon={getStarIcon(product.name)} className="w-3 h-3" />
                      {product.name}
                    </button>
                  ))}
                </div>

                {/* Selected Product Details */}
                {selectedProduct && (
                  <div className="bg-gradient-to-br from-purple-800/50 to-pink-600/40 backdrop-blur-xl rounded-3xl p-6 border border-purple-400/30 shadow-2xl relative overflow-hidden">
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-pink-400/10 to-purple-400/10 rounded-full blur-xl"></div>
                    
                    <div className="flex items-center gap-4 mb-6 relative z-10">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Icon icon={getStarIcon(selectedProduct.name)} className="text-white w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-white mb-1">{selectedProduct.name}</h2>
                        {selectedProduct.name === 'Bintang 1' && (
                          <div className="flex items-center gap-2">
                            <div className="bg-yellow-400/20 px-2 py-1 rounded-full border border-yellow-400/30">
                              <div className="flex items-center gap-1">
                                <Icon icon="mdi:star" className="w-3 h-3 text-yellow-400" />
                                <span className="text-yellow-400 text-xs font-semibold">Most Popular</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                      <div className="bg-gradient-to-br from-purple-700/40 to-purple-600/30 rounded-2xl p-4 border border-purple-400/20 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon icon="mdi:currency-usd-circle" className="text-purple-400 w-4 h-4" />
                          <h3 className="text-purple-200 text-xs font-medium">Min Investasi</h3>
                        </div>
                        <p className="text-lg font-bold text-white">{formatCurrency(selectedProduct.minimum)}</p>
                      </div>
                      <div className="bg-gradient-to-br from-pink-700/40 to-pink-600/30 rounded-2xl p-4 border border-pink-400/20 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon icon="mdi:currency-usd-circle-outline" className="text-pink-400 w-4 h-4" />
                          <h3 className="text-purple-200 text-xs font-medium">Max Investasi</h3>
                        </div>
                        <p className="text-lg font-bold text-white">{formatCurrency(selectedProduct.maximum)}</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-700/40 to-green-600/30 rounded-2xl p-4 border border-green-400/20 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon icon="mdi:trending-up" className="text-green-400 w-4 h-4" />
                          <h3 className="text-purple-200 text-xs font-medium">Kontrak Harian</h3>
                        </div>
                        <p className="text-lg font-bold text-white">{Math.ceil((selectedProduct.percentage * 2 / selectedProduct.duration))}%</p>
                      </div>
                      <div className="bg-gradient-to-br from-yellow-700/40 to-yellow-600/30 rounded-2xl p-4 border border-yellow-400/20 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon icon="mdi:calendar-check" className="text-yellow-400 w-4 h-4" />
                          <h3 className="text-purple-200 text-xs font-medium">Total Kontrak</h3>
                        </div>
                        <p className="text-lg font-bold text-white">{selectedProduct.percentage * 2}%</p>
                      </div>
                    </div>

                    {/* Investment Features */}
                    <div className="grid grid-cols-4 gap-2 mb-6 relative z-10">
                      <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
                        <Icon icon="mdi:shield-check" className="text-green-400 w-5 h-5 mx-auto mb-1" />
                        <span className="text-purple-200 text-xs">Aman</span>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
                        <Icon icon="mdi:clock-fast" className="text-blue-400 w-5 h-5 mx-auto mb-1" />
                        <span className="text-purple-200 text-xs">Cepat</span>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
                        <Icon icon="mdi:cash-multiple" className="text-yellow-400 w-5 h-5 mx-auto mb-1" />
                        <span className="text-purple-200 text-xs">Profit</span>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
                        <Icon icon="mdi:support" className="text-purple-400 w-5 h-5 mx-auto mb-1" />
                        <span className="text-purple-200 text-xs">Support</span>
                      </div>
                    </div>

                    <button
                      onClick={() => { setShowModal(true); }}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-purple-500/25 hover:scale-105 relative z-10 border border-purple-400/30"
                    >
                      <Icon icon="mdi:rocket" className="w-5 h-5" />
                      INVESTASI SEKARANG
                      <Icon icon="mdi:arrow-right" className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
        
        {/* Copyright dengan jarak yang cukup dari bottom navbar */}
        <div className="text-center text-white/60 text-xs flex items-center justify-center gap-2 mt-8 mb-4">
          <Icon icon="solar:copyright-bold" className="w-3 h-3" />
          <span>2025 Stoneform Capital. All Rights Reserved.</span>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/30 backdrop-blur-xl border-t border-purple-400/20 z-50">
        <div className="max-w-sm mx-auto">
          <BottomNavbar />
        </div>
      </div>

      {/* Investment Modal */}
      {showModal && selectedProduct && (
        <InvestmentModal
          open={showModal}
          onClose={() => setShowModal(false)}
          product={selectedProduct}
          user={userData}
          onSuccess={(paymentData) => {
            setShowModal(false);
            setSelectedProduct(null);
            setToast({ open: true, message: 'Investasi berhasil! Silakan lakukan pembayaran.', type: 'success' });
            router.push({
              pathname: '/payment',
              query: { data: encodeURIComponent(JSON.stringify(paymentData)) }
            });
          }}
        />
      )}

      {/* Toast Notification */}
      <Toast
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, open: false })}
      />

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.4s ease-out; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
}