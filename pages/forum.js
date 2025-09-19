// pages/testimoni.js
import React, { useState, useEffect } from 'react';
// S3Image component to fetch signed URL from API
// S3Image with modal popup
function S3Image({ imageKey, onClick }) {
    const [url, setUrl] = useState(null);
    useEffect(() => {
        let isMounted = true;
        const fetchUrl = async () => {
            try {
                const res = await fetch(`/api/s3-image?key=${encodeURIComponent(imageKey)}`);
                const data = await res.json();
                if (isMounted && data.url) setUrl(data.url);
            } catch (e) {}
        };
        fetchUrl();
        return () => { isMounted = false; };
    }, [imageKey]);
    if (!url) return (
        <div className="w-16 h-16 bg-purple-100 animate-pulse rounded-xl border border-purple-200/60" />
    );
    return (
        <img
            src={url}
            alt="bukti penarikan"
            className="w-16 h-16 object-cover rounded-xl border border-purple-200/60 shadow cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={onClick}
            style={{ background: '#f3e8ff' }}
        />
    );
}
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Home, Users, Gift, CreditCard, User, BarChart3 } from 'lucide-react';
import { Icon } from '@iconify/react';
import { getForumTestimonials } from '../utils/api';
import styles from '../styles/Home.module.css';
import BottomNavbar from '../components/BottomNavbar';

// S3 config from .env (replace with process.env.NEXT_PUBLIC_...)
const S3_ENDPOINT = process.env.NEXT_PUBLIC_S3_ENDPOINT;
const S3_BUCKET = process.env.NEXT_PUBLIC_S3_BUCKET;


export default function Testimoni() {
    const router = useRouter();
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalImage, setModalImage] = useState(null); // url string

    useEffect(() => {
        const fetchTestimonials = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await getForumTestimonials();
                setTestimonials((res.data || []).filter(t => t.status === 'Accepted'));
            } catch (err) {
                setError(err.message || 'Gagal memuat testimoni');
            } finally {
                setLoading(false);
            }
        };
        fetchTestimonials();
    }, []);

    const formatDate = (dateString) => {
        const d = new Date(dateString.replace(' ', 'T'));
        return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
            ' ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Modal overlay for image
    const ImageModal = ({ url, onClose }) => (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 animate-fadeIn" onClick={onClose}>
            <div className="relative max-w-full max-h-full p-4" onClick={e => e.stopPropagation()}>
                <img
                    src={url}
                    alt="Bukti Penarikan Besar"
                    className="rounded-2xl shadow-2xl border-4 border-purple-400/40 max-h-[80vh] max-w-[90vw] bg-white object-contain animate-slideUp"
                    style={{ boxShadow: '0 8px 32px 0 rgba(80,0,120,0.25)' }}
                />
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 bg-purple-700/80 hover:bg-pink-600/80 text-white rounded-full p-2 shadow-lg transition-all"
                    aria-label="Tutup"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 pb-32">
            <Head>
                <title>Stoneform | Testimoni</title>
                <meta name="description" content="Testimoni pengguna Stoneform" />
                <link rel="icon" href="/logo.png" />
            </Head>

            {modalImage && <ImageModal url={modalImage} onClose={() => setModalImage(null)} />}

            <div className="max-w-sm mx-auto p-4">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-purple-800/50 to-pink-600/50 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-purple-400/20 shadow-2xl flex flex-col items-center text-white">
                    <div className="flex items-center gap-2 text-xl font-bold mb-2">
                        <Icon icon="mdi:comment-quote-outline" className="text-yellow-400 w-6 h-6" />
                        Testimoni Penarikan
                    </div>
                    <div className="text-xs text-center opacity-90">Lihat pengalaman nyata dari member Stone Form yang sudah berhasil</div>
                </div>

                <div className="flex justify-center mb-6">
                    <button
                        onClick={() => router.push('/forum/upload')}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-105 text-sm flex items-center gap-2"
                    >
                        <Icon icon="mdi:upload" className="w-4 h-4" />
                        Unggah Bukti Penarikan!
                    </button>
                </div>

                {/* Testimonials List */}
                <div className="bg-gradient-to-br from-purple-800/40 to-pink-600/30 backdrop-blur-xl rounded-3xl p-6 border border-purple-400/20 shadow-2xl mb-6">
                    {loading && (
                        <div className="flex flex-col items-center py-8 animate-fadeIn">
                            <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-400 border-t-transparent mb-2"></div>
                            <span className="text-purple-200 text-sm">Memuat testimoni...</span>
                        </div>
                    )}
                    {error && !loading && (
                        <div className="text-center text-red-300 py-8 text-sm">{error}</div>
                    )}
                    {!loading && !error && testimonials.length === 0 && (
                        <div className="text-center text-purple-200 py-8 text-sm">Belum ada testimoni penarikan diterima.</div>
                    )}
                    {!loading && !error && testimonials.map((t) => (
                        <TestimonialCard key={t.id} t={t} setModalImage={setModalImage} />
                    ))}
                </div>

                {/* Add Testimonial CTA */}
                <div className="bg-gradient-to-br from-yellow-400/20 to-yellow-200/10 rounded-3xl p-6 border border-yellow-400/20 shadow-2xl text-center mb-6">
                    <div className="text-lg font-bold text-white mb-2 flex items-center justify-center gap-2">
                        <Icon icon="mdi:star-circle-outline" className="w-5 h-5 text-yellow-300" />
                        Bagikan Pengalaman Anda
                    </div>
                    <div className="text-xs text-purple-100 mb-1">Dapatkan bonus Rp 2.000 - Rp 20.000 untuk setiap testimoni yang terverifikasi</div>
                </div>

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

            {/* Add Font Awesome */}
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
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
        .modal-blur { backdrop-filter: blur(8px); }
      `}</style>
        </div>
    );
}

// TestimonialCard component for cleaner map rendering
function TestimonialCard({ t, setModalImage }) {
    // ...formatCurrency and formatDate are in parent scope, so pass as props if needed...
    const [imgUrl, setImgUrl] = useState(null);
    useEffect(() => {
        let isMounted = true;
        if (t.image) {
            fetch(`/api/s3-image?key=${encodeURIComponent(t.image)}`)
                .then(res => res.json())
                .then(data => { if (isMounted && data.url) setImgUrl(data.url); });
        }
        return () => { isMounted = false; };
    }, [t.image]);
    // fallback to parent S3Image if needed
    return (
        <div className="bg-gradient-to-br from-purple-700/30 to-pink-600/20 rounded-2xl p-5 mb-5 border border-purple-400/20 shadow flex flex-col relative animate-fadeIn">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <div className="flex items-center gap-2">
                        <Icon icon="mdi:account-circle" className="w-5 h-5 text-purple-400" />
                        <span className="font-bold text-white text-sm">{t.name}</span>
                    </div>
                    <div className="text-xs text-purple-200 ml-7">+62{String(t.number).replace(/^\+?62|^0/, '')}</div>
                </div>
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1">
                        <Icon icon="mdi:gift-outline" className="w-4 h-4 text-yellow-400" />
                        <span className="font-semibold text-yellow-400 text-sm">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(t.reward)}</span>
                    </div>
                </div>
            </div>
            <div className="flex gap-3 items-center mb-3">
                {t.image && imgUrl && (
                    <img
                        src={imgUrl}
                        alt="bukti penarikan"
                        className="w-16 h-16 object-cover rounded-xl border border-purple-200/60 shadow cursor-pointer hover:scale-105 transition-transform duration-200"
                        onClick={() => setModalImage(imgUrl)}
                        style={{ background: '#f3e8ff' }}
                    />
                )}
                <div className="flex-1">
                    <div className="text-sm text-white font-medium mb-1">{t.description}</div>
                </div>
            </div>
            <div className="flex justify-end items-center gap-2 mt-2">
                <Icon icon="mdi:calendar-clock" className="w-3 h-3 text-purple-200" />
                <span className="text-xs text-purple-200">{new Date(t.time.replace(' ', 'T')).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + new Date(t.time.replace(' ', 'T')).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
            </div>
        </div>
    );
}