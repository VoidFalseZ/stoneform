// pages/payment.js
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Clipboard, ClipboardCheck, Download, CreditCard } from 'lucide-react';
import { Icon } from '@iconify/react';
import { getPaymentByOrderId } from '../utils/api';

export default function Payment() {
  const router = useRouter();
  const [payment, setPayment] = useState(null);
  const [expired, setExpired] = useState(false);
  const [timer, setTimer] = useState('');
  const [copied, setCopied] = useState({}); // { key: true/false }
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchPayment = async () => {
      if (router.query.order_id) {
        setLoading(true);
        setErrorMsg('');
        try {
          const res = await getPaymentByOrderId(router.query.order_id);
          if (res && res.data) {
            setPayment(res.data);
            startCountdown(res.data.expired_at);
            setErrorMsg('');
          } else if (res && res.message) {
            setErrorMsg(res.message);
            setPayment(null);
          } else {
            setErrorMsg('Data pembayaran tidak ditemukan.');
            setPayment(null);
          }
        } catch (e) {
          if (e?.response?.status === 404 && e?.response?.data?.message) {
            setErrorMsg(e.response.data.message);
          } else {
            setErrorMsg('Data pembayaran tidak ditemukan.');
          }
          setPayment(null);
        }
        setLoading(false);
      }
    };
    fetchPayment();
    // eslint-disable-next-line
  }, [router.query.order_id]);

  const startCountdown = (expiredAt) => {
    const end = new Date(expiredAt).getTime();
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = end - now;
      if (diff <= 0) {
        setTimer('00:00:00');
        setExpired(true);
        clearInterval(interval);
        return;
      }
      const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
      setTimer(`${h}:${m}:${s}`);
    }, 1000);
  };

  const formatCurrency = (amt) => new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    maximumFractionDigits: 0 
  }).format(amt);

  const handleCopy = (key, text) => {
    navigator.clipboard.writeText(text);
    setCopied((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopied((prev) => ({ ...prev, [key]: false }));
    }, 1800);
  };

  const handleDownloadQR = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'qris.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the object URL
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading QR code:', error);
      // Fallback: open in new tab if download fails
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <Head>
          <title>Stoneform Capital | Pembayaran {router.query.order_id}</title>
          <meta name="description" content="Stoneform Capital Pembayaran" />
          <link rel="icon" href="/logo.png" />
        </Head>
        <div className="bg-gradient-to-r from-purple-800/50 to-pink-600/50 backdrop-blur-xl rounded-3xl p-8 border border-purple-400/20 shadow-2xl max-w-md w-full text-center">
          <p className="text-white text-sm animate-pulse">Memuat data pembayaran...</p>
        </div>
      </div>
    );
  }
  if (!payment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <Head>
          <title>Stoneform Capital | Pembayaran {router.query.order_id}</title>
          <meta name="description" content="Stoneform Capital Pembayaran" />
          <link rel="icon" href="/logo.png" />
        </Head>
        <div className="bg-gradient-to-r from-purple-800/50 to-pink-600/50 backdrop-blur-xl rounded-3xl p-8 border border-purple-400/20 shadow-2xl max-w-md w-full text-center">
          <p className="text-white text-sm">{errorMsg || 'Data pembayaran tidak ditemukan.'}</p>
        </div>
      </div>
    );
  }

  // Fallbacks for missing/null fields
  const amount = payment.amount || 0;
  const paymentMethod = payment.payment_method || '';
  const paymentChannel = payment.payment_channel || '';
  const paymentCode = payment.payment_code || '';
  const expiredAt = payment.expired_at || '';
  const product = payment.product || '';
  const orderId = payment.order_id || '';

  // QR code url
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(paymentCode)}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex flex-col items-center justify-center py-8 px-4">
      <Head>
        <title>Stoneform Capital | Pembayaran {router.query.order_id}</title>
        <meta name="description" content="Stoneform Capital Pembayaran" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <div className="max-w-sm w-full mx-auto">
        <div className="bg-gradient-to-r from-purple-800/50 to-pink-600/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-400/20 shadow-2xl animate-fadeIn">
          
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white mb-3">Pembayaran Investasi</h2>
            <div className="space-y-1 text-sm text-purple-200">
              <div>Produk: <span className="font-medium text-cyan-400">{product}</span></div>
              <div>Nominal: <span className="font-medium text-cyan-400">{formatCurrency(amount)}</span></div>
              <div>Metode: <span className="font-medium text-cyan-400">{paymentMethod === 'QRIS' ? 'QRIS' : `Bank Transfer (${paymentChannel || '-'})`}</span></div>
            </div>
          </div>

          {/* Payment Info Card */}
          <div className="bg-gradient-to-br from-purple-700/30 to-pink-600/20 rounded-xl p-4 border border-purple-400/20 shadow-lg mb-6">
            
            {/* Order ID */}
            <div className="bg-gradient-to-r from-purple-800/60 to-pink-600/40 border border-purple-400/30 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="flex items-center gap-1 text-purple-300">
                    <Clipboard className="w-3.5 h-3.5" />
                    <span className="text-xs">Order ID</span>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy('orderId', orderId)}
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-all ${
                    copied.orderId 
                      ? 'bg-green-500/80 text-white' 
                      : 'bg-purple-600/60 text-white hover:bg-purple-600/80'
                  }`}
                >
                  {copied.orderId ? <ClipboardCheck className="w-3 h-3" /> : <Clipboard className="w-3 h-3" />}
                  {copied.orderId ? 'Tersalin' : 'Salin'}
                </button>
              </div>
              <div className="text-white font-mono text-sm mt-1 tracking-wider break-all">
                {orderId}
              </div>
            </div>

            {paymentMethod === 'QRIS' ? (
              <>
                {/* QRIS Section */}
                <div className="text-center mb-4">
                  {/* QRIS Icon (mdi:qrcode-scan) */}
                  <div className="flex justify-center mb-3">
                    <div className="bg-white rounded-lg p-2 shadow-md">
                      <Icon icon="mdi:qrcode-scan" className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-3 inline-block shadow-lg">
                    <img 
                      src={qrUrl} 
                      alt="QRIS" 
                      className="w-32 h-32 rounded-lg"
                    />
                  </div>
                  
                  <button
                    onClick={() => handleDownloadQR(qrUrl)}
                    className="mt-3 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 shadow text-sm mx-auto"
                  >
                    <Download className="w-4 h-4" /> 
                    Download QR
                  </button>
                  
                  <p className="mt-2 text-purple-200 text-xs">
                    Scan QRIS di aplikasi e-wallet/bank Anda
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Bank Transfer Section */}
                <div className="mb-4">
                  {/* Bank Transfer Icon (mdi:bank-transfer) */}
                  <div className="flex justify-center mb-3">
                    <div className="bg-white rounded-lg p-2 shadow-md">
                      <Icon icon="mdi:bank-transfer" className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-800/60 to-pink-600/40 border border-purple-400/30 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-3.5 h-3.5 text-purple-300" />
                        <span className="text-xs text-purple-300">Virtual Account</span>
                      </div>
                      <button
                        onClick={() => handleCopy('va', paymentCode)}
                        className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-all ${
                          copied.va 
                            ? 'bg-green-500/80 text-white' 
                            : 'bg-purple-600/60 text-white hover:bg-purple-600/80'
                        }`}
                      >
                        {copied.va ? <ClipboardCheck className="w-3 h-3" /> : <Clipboard className="w-3 h-3" />}
                        {copied.va ? 'Tersalin' : 'Salin'}
                      </button>
                    </div>
                    <div className="text-white font-mono text-sm tracking-wider break-all">
                      {paymentCode}
                    </div>
                  </div>
                  
                  <p className="text-purple-200 text-xs text-center mt-3">
                    Transfer ke Virtual Account <span className="font-medium text-cyan-400">{paymentChannel || '-'}</span><br/>
                    melalui ATM, m-banking, atau internet banking
                  </p>
                </div>
              </>
            )}

            {/* Timer */}
            <div className="text-center">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-sm ${
                expired 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-shake' 
                  : 'bg-green-500/20 text-green-400 border border-green-500/30'
              }`}>
                <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                {expired ? 'Waktu pembayaran habis!' : `Batas waktu: ${timer}`}
              </div>
            </div>
          </div>

          {/* Complete Button */}
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] text-sm"
          >
            Pembayaran Selesai
          </button>
        </div>

        {/* Copyright dengan jarak yang cukup dari bottom navbar */}
        <div className="text-center text-white/60 text-xs flex items-center justify-center gap-2 mt-8 mb-4">
          <Icon icon="solar:copyright-bold" className="w-3 h-3" />
          <span>2025 Stoneform Capital. All Rights Reserved.</span>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }
        .animate-fadeIn { 
          animation: fadeIn 0.4s ease-out; 
        }
        .animate-shake { 
          animation: shake 0.6s ease-in-out infinite; 
        }
      `}</style>
    </div>
  );
}