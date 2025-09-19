// pages/upload-withdrawal.js
import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Home, Users, Gift, CreditCard, User, BarChart3, ArrowLeft, Upload, FileText, Info, GiftIcon } from 'lucide-react';
import { checkForumStatus, submitForumTestimonial } from '../../utils/api';
import BottomNavbar from '../../components/BottomNavbar';
import { Icon } from '@iconify/react';

export default function UploadWithdrawal() {
    const router = useRouter();
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [statusLoading, setStatusLoading] = useState(true);
    const [canUpload, setCanUpload] = useState(false);
    const [statusMsg, setStatusMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        // Check forum status on mount
        const checkStatus = async () => {
            setStatusLoading(true);
            setErrorMsg('');
            try {
                const res = await checkForumStatus();
                if (res?.data?.has_withdrawal) {
                    setCanUpload(true);
                    setStatusMsg('Anda dapat mengunggah testimoni penarikan karena ada penarikan dalam 3 hari terakhir.');
                } else {
                    setCanUpload(false);
                    setStatusMsg('Anda belum melakukan penarikan dalam 3 hari terakhir. Silakan lakukan penarikan terlebih dahulu untuk bisa mengunggah testimoni.');
                }
            } catch (err) {
                setErrorMsg('Gagal memeriksa status penarikan.');
            } finally {
                setStatusLoading(false);
            }
        };
        checkStatus();
    }, []);

    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                setErrorMsg('File harus JPG atau PNG.');
                setSelectedFile(null);
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                setErrorMsg('Ukuran file maksimal 2MB.');
                setSelectedFile(null);
                return;
            }
            setErrorMsg('');
            setSelectedFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');
        // Extra validation: prevent submit if no image
        if (!selectedFile) {
            setErrorMsg('Pilih gambar terlebih dahulu.');
            return;
        }
        if (selectedFile === null || typeof selectedFile !== 'object') {
            setErrorMsg('Pilih gambar terlebih dahulu.');
            return;
        }
        if (comment.trim().length < 5 || comment.trim().length > 60) {
            setErrorMsg('Deskripsi minimal 5 dan maksimal 60 karakter.');
            return;
        }
        setIsSubmitting(true);
        setUploadProgress(0);
        try {
            // Simulate progress
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += 15;
                setUploadProgress(Math.min(progress, 95));
            }, 150);

            // Submit to API
            const res = await submitForumTestimonial({ image: selectedFile, description: comment });
            clearInterval(progressInterval);
            setUploadProgress(100);
            setIsSubmitting(false);
            if (res?.success) {
                setSuccessMsg(res?.message || 'Postingan terkirim, menunggu persetujuan.');
                setErrorMsg('');
                setTimeout(() => {
                    setSuccessMsg('');
                    router.push('/testimoni');
                }, 5000);
            } else {
                setErrorMsg(res?.message || 'Gagal mengunggah testimoni.');
                setSuccessMsg('');
            }
        } catch (err) {
            setIsSubmitting(false);
            setErrorMsg('Gagal mengunggah testimoni.');
            setSuccessMsg('');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 pb-24">
            <Head>
                <title>Stoneform | Unggah Penarikan</title>
                <meta name="description" content="Unggah bukti penarikan Stoneform" />
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
              <Icon icon="material-symbols:upload" className="text-xl text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Unggah Bukti Penarikan</h1>
            </div>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

            <div className="max-w-xl mx-auto p-6 mb-24">

                {/* Rules Section */}
                <div className="bg-gradient-to-br from-purple-800/40 to-pink-600/30 backdrop-blur-xl rounded-2xl p-5 border border-purple-400/20 shadow-xl mb-5">
                    <div className="flex items-center gap-2 mb-2">
                        <Info size={18} className="text-yellow-400" />
                        <h3 className="text-sm font-semibold text-yellow-200 m-0">Aturan Pengunggahan</h3>
                    </div>
                    <ul className="pl-5 mb-3 text-xs text-purple-100 list-disc">
                        <li>Gambar harus bukti penarikan yang sah di hari tersebut.</li>
                        <li>Deskripsi minimal 5 karakter, maksimal 60 karakter.</li>
                        <li>Hanya file JPG/PNG, maks 2MB.</li>
                    </ul>
                    <div className="inline-flex items-center bg-yellow-400/80 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                        <GiftIcon size={14} className="mr-1" />
                        Bonus: Rp 2.000 - Rp 20.000
                    </div>
                </div>

                {/* Status Section */}
                <div className="bg-gradient-to-br from-purple-800/40 to-pink-600/30 backdrop-blur-xl rounded-2xl p-5 border border-purple-400/20 shadow-xl mb-5">
                    <div className="flex items-center gap-2 mb-2">
                        <Info size={20} className="text-cyan-300" />
                        <span className="font-semibold text-purple-100 text-sm">Status</span>
                    </div>
                    {statusLoading ? (
                        <div className="text-xs text-purple-200 animate-pulse">Memeriksa status penarikan...</div>
                    ) : (
                        <div className={`text-xs ${canUpload ? 'text-green-300' : 'text-red-200'}`}>{statusMsg}</div>
                    )}
                </div>

                {/* Upload Form */}
                <div className="bg-gradient-to-br from-purple-800/40 to-pink-600/30 backdrop-blur-xl rounded-2xl p-5 border border-purple-400/20 shadow-xl mb-5">
                    <div className="flex items-center gap-2 mb-3">
                        <Upload size={18} className="text-cyan-300" />
                        <h3 className="text-sm font-semibold text-cyan-100 m-0">Unggah Bukti Penarikan</h3>
                    </div>
                    {/* Success & Error Message moved here */}
                    {errorMsg && (
                        <div className="text-xs text-red-300 mb-3 font-semibold border border-red-400/30 bg-red-900/30 rounded-lg px-3 py-2 animate-fadeIn">{errorMsg}</div>
                    )}
                    {successMsg && (
                        <div className="text-xs text-green-200 mb-3 font-semibold border border-green-400/30 bg-green-900/30 rounded-lg px-3 py-2 animate-fadeIn">{successMsg}</div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-xs font-semibold text-purple-100 mb-1">Deskripsi (5-60 karakter)</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                minLength={5}
                                maxLength={60}
                                placeholder="Tulis deskripsi singkat..."
                                required
                                className="w-full p-2 rounded-lg border border-purple-300/30 bg-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-400/40 min-h-[60px] resize-vertical"
                                disabled={!canUpload || isSubmitting}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-xs font-semibold text-purple-100 mb-1">Pilih Gambar (JPG/PNG, maks 2MB)</label>
                            {selectedFile && (
                                <div className="text-xs text-purple-200 text-center mb-2">{selectedFile.name}</div>
                            )}
                            <button
                                type="button"
                                onClick={canUpload && !isSubmitting ? handleFileSelect : undefined}
                                className={`w-full font-bold py-2 rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2 text-xs
                                    ${!canUpload || isSubmitting
                                        ? 'bg-gray-400 text-gray-100 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:scale-105 hover:shadow-purple-500/25'}
                                `}
                                disabled={!canUpload || isSubmitting}
                            >
                                <FileText size={14} />
                                Pilih Gambar
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/jpeg,image/png"
                                required
                                style={{ display: 'none' }}
                                disabled={!canUpload || isSubmitting}
                            />
                            {isSubmitting && (
                                <div className="w-full h-2 bg-purple-100/30 rounded-lg mt-2">
                                    <div className="h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting || !canUpload}
                            className={`w-full py-3 rounded-2xl font-bold flex items-center justify-center gap-2 text-sm transition-all duration-300 shadow-lg ${isSubmitting || !canUpload ? 'bg-purple-400/40 text-purple-100 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:scale-105 hover:shadow-purple-500/25'}`}
                        >
                            <Upload size={14} />
                            {isSubmitting ? 'Mengunggah...' : 'Submit'}
                        </button>
                    </form>
                </div>

                {/* Copyright dengan jarak yang cukup dari bottom navbar */}
        <div className="text-center text-white/60 text-xs flex items-center justify-center gap-2 mt-8 mb-8">
          <Icon icon="solar:copyright-bold" className="w-3 h-3" />
          <span>2025 Stoneform Capital. All Rights Reserved.</span>
        </div>
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-purple-900/95 backdrop-blur-xl border-t border-purple-400/30 shadow-2xl z-50">
                <div className="flex justify-around py-3 px-4 max-w-md mx-auto">
                    <BottomNavbar />
                </div>
            </div>

            {/* Add Material Design Icons */}
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/7.2.96/css/materialdesignicons.min.css"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
            />
            <style jsx global>{`
                @keyframes fadeIn {
                  from { opacity: 0; }
                  to { opacity: 1; }
                }
                .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
            `}</style>
        </div>
    );
}
// end of file