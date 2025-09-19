// components/InvestmentModal.js
import { useState } from 'react';
import { createInvestment } from '../utils/api';
import { useRouter } from 'next/router';
import { BANKS, PAYMENT_METHODS } from '../constants/products';
import { Icon } from '@iconify/react';

export default function InvestmentModal({ open, onClose, product, user, onSuccess }) {
  const router = useRouter();
  const [amount, setAmount] = useState(product?.minimum || '');
  const [paymentMethod, setPaymentMethod] = useState('QRIS');
  const [bank, setBank] = useState(BANKS[0].code);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open || !product) return null;

  const min = product.minimum;
  const max = product.maximum;
  const percentage = product.percentage;
  const duration = product.duration;

  const dailyProfit = amount && !isNaN(amount)
    ? ((amount * percentage / 100) / duration)
    : 0;
  const totalReturn = amount && !isNaN(amount)
    ? (parseInt(amount) + (amount * percentage / 100))
    : 0;

  const formatCurrency = (amt) => new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    maximumFractionDigits: 0 
  }).format(amt);

  const handleConfirm = async () => {
    setError('');
    if (!amount || isNaN(amount) || amount < min || amount > max) {
      setError(`Nominal investasi harus antara ${formatCurrency(min)} dan ${formatCurrency(max)}`);
      return;
    }
    if (paymentMethod === 'BANK' && !bank) {
      setError('Pilih bank transfer.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        product_id: product.id,
        amount: parseInt(amount),
        payment_method: paymentMethod,
        payment_channel: paymentMethod === 'BANK' ? bank : undefined,
      };
      const data = await createInvestment(payload);
      setLoading(false);
      // Redirect to payment page with order_id from response
      if (data && data.data && data.data.order_id) {
        router.push(`/payment?order_id=${encodeURIComponent(data.data.order_id)}`);
      } else {
        setError('Gagal mendapatkan order ID pembayaran');
      }
      // onSuccess(data); // No longer needed for redirect flow
    } catch (err) {
      setError(err.message || 'Gagal melakukan investasi');
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      style={{ animation: 'fadeIn 0.3s ease-out' }}
    >
      <div 
        className="bg-gradient-to-br from-purple-900/95 via-purple-800/90 to-pink-600/85 backdrop-blur-xl rounded-2xl p-4 max-w-xs w-full shadow-2xl border border-purple-400/20 relative"
        style={{ animation: 'slideUp 0.4s ease-out' }}
      >
        
        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-1.5 mb-0.5">
            <h2 className="text-lg font-bold text-white">{product.name}</h2>
            {product.name === 'Bintang 1' && (
              <svg className="w-5 h-5 fill-yellow-400 text-yellow-400" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            )}
          </div>
          <p className="text-purple-200 text-sm">
            Min: {formatCurrency(min)} | Max: {formatCurrency(max)}
          </p>
        </div>

        <div className="space-y-4">
          {/* Investment Amount */}
          <div>
            <label className="block text-white font-semibold mb-2 text-sm">Nominal Investasi</label>
            <div className="relative">
              <input
                type="number"
                min={min}
                max={max}
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-sm border border-purple-300/30 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 placeholder-purple-200"
                placeholder="Masukkan nominal"
                disabled={loading}
              />
              <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-white font-semibold mb-2 text-sm">Metode Pembayaran</label>
            <div className="grid grid-cols-2 gap-3">
              {PAYMENT_METHODS.map(method => (
                <label key={method.code} className="cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.code}
                    checked={paymentMethod === method.code}
                    onChange={() => setPaymentMethod(method.code)}
                    className="sr-only"
                    disabled={loading}
                  />
                  <div className={`
                    p-2.5 rounded-lg border transition-all duration-300 flex items-center gap-2 text-sm
                    ${paymentMethod === method.code 
                      ? 'border-purple-400 bg-purple-400/20 shadow-lg' 
                      : 'border-purple-300/30 bg-white/5 hover:bg-white/10'
                    }
                  `}>
                    {method.code === 'QRIS' ? (
                      <Icon icon="mdi:qrcode-scan" className="w-6 h-6 text-purple-300" />
                    ) : method.code === 'BANK' ? (
                      <Icon icon="mdi:bank-transfer" className="w-6 h-6 text-purple-300" />
                    ) : null}
                    <span className="text-white font-medium">{method.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Bank Selection */}
          {paymentMethod === 'BANK' && (
            <div>
              <label className="block text-white font-semibold mb-3">Pilih Bank</label>
              <select
                value={bank}
                onChange={e => setBank(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-sm border border-purple-300/30 rounded-2xl px-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                disabled={loading}
              >
                {BANKS.map(b => (
                  <option key={b.code} value={b.code} className="bg-purple-900 text-white">
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Investment Summary */}
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-4 border border-purple-300/20">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ringkasan Investasi
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-purple-200">Nominal</span>
                <span className="text-white font-semibold">{formatCurrency(amount || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-200">Kontrak Harian</span>
                <span className="text-green-400 font-semibold">{Math.ceil((percentage * 2) / duration)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-200">Kontrak Persentase</span>
                <span className="text-yellow-400 font-semibold">{percentage * 2}%</span>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-purple-300/50 to-transparent my-3"></div>
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold">Total Kembali</span>
                <span className="text-white font-bold text-lg">{formatCurrency(totalReturn)}</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div 
              className="bg-red-500/20 border border-red-400/50 rounded-xl p-4 text-red-300 text-center"
              style={{ animation: 'shake 0.5s ease-in-out' }}
            >
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-purple-800 disabled:to-pink-800 text-white font-bold py-2.5 px-3 rounded-lg text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/25 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  Konfirmasi
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-white/10 hover:bg-white/20 disabled:bg-white/5 text-white font-bold py-2.5 px-3 rounded-lg text-sm transition-all duration-300 backdrop-blur-sm border border-white/20 disabled:cursor-not-allowed"
            >
              Batal
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
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
      `}</style>
    </div>
  );
}