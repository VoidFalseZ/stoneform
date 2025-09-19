import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';
import { Home, Users, Gift, CreditCard, User, BarChart3, Copy, ExternalLink, Star } from 'lucide-react';
import { getTeamInvited } from '../utils/api';
import { Icon } from '@iconify/react';
import BottomNavbar from '../components/BottomNavbar';

export default function Komisi() {
  const router = useRouter();
  const [copied, setCopied] = useState({ code: false, link: false });
  const [reffCode, setReffCode] = useState('');
  const [teamStats, setTeamStats] = useState({
    1: { active: 0, count: 0 },
    2: { active: 0, count: 0 },
    3: { active: 0, count: 0 },
  });

  useEffect(() => {
    // Get referral code from localStorage.user.reff_code
    if (typeof window !== 'undefined') {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user && user.reff_code) {
            setReffCode(user.reff_code);
          }
        }
      } catch (e) {
        // ignore
      }
    }
    // Fetch team invited stats
    getTeamInvited()
      .then((res) => {
        if (res && res.data) setTeamStats(res.data);
      })
      .catch(() => {});
  }, []);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied((prev) => ({ ...prev, [type]: true }));
    setTimeout(() => setCopied((prev) => ({ ...prev, [type]: false })), 2000);
  };

  const referralLink = reffCode ? `${window.location.origin}/register?reff=${reffCode}` : '';

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 pb-32">
        <Head>
          <title>Stoneform Capital | Referral</title>
          <meta name="description" content="Stoneform Capital Referral" />
          <link rel="icon" href="/logo.png" />
      </Head>
        <div className="max-w-md mx-auto p-6">
          {/* Hero Stats Card */}
          <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Icon icon="solar:medal-star-bold" className="text-4xl text-yellow-400" />
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white">Raih Kesuksesan</h2>
                <p className="text-white/80 text-sm">Bersama Program Referral Terbaik</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">
                  {(teamStats[1]?.count || 0) + (teamStats[2]?.count || 0) + (teamStats[3]?.count || 0)}
                </div>
                <div className="text-white/70 text-xs">Total Referral</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {(teamStats[1]?.active || 0) + (teamStats[2]?.active || 0) + (teamStats[3]?.active || 0)}
                </div>
                <div className="text-white/70 text-xs">Member Aktif</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">3</div>
                <div className="text-white/70 text-xs">Level Komisi</div>
              </div>
            </div>
          </div>

          {/* Referral Code Section */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-white/20 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Icon icon="solar:code-bold" className="text-2xl text-blue-400" />
              <h3 className="text-lg font-bold text-white">Kode Referral Anda</h3>
            </div>
            
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-4 mb-4 border border-blue-400/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon icon="solar:hashtag-bold" className="text-xl text-blue-400" />
                  <span className="text-xl font-bold text-white font-mono tracking-wide">
                    {reffCode || '---'}
                  </span>
                </div>
                <Copy className="text-blue-400" size={20} />
              </div>
            </div>

            <button 
              onClick={() => copyToClipboard(reffCode, 'code')}
              className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg ${
                copied.code 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white scale-105' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white hover:scale-105'
              }`}
              disabled={!reffCode}
            >
              {copied.code ? (
                <>
                  <Icon icon="solar:check-circle-bold" className="text-xl" />
                  Kode Tersalin!
                </>
              ) : (
                <>
                  <Icon icon="solar:copy-bold" className="text-xl" />
                  Salin Kode Referral
                </>
              )}
            </button>
          </div>

          {/* Referral Link Section */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-white/20 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Icon icon="solar:link-bold" className="text-2xl text-green-400" />
              <h3 className="text-lg font-bold text-white">Link Referral</h3>
            </div>
            
            <div className="bg-gradient-to-r from-green-600/20 to-teal-600/20 rounded-2xl p-4 mb-4 border border-green-400/30">
              <div className="flex items-center gap-3">
                <Icon icon="solar:global-bold" className="text-xl text-green-400 flex-shrink-0" />
                <span className="text-sm text-white font-medium truncate flex-1">
                  {referralLink || 'Link akan muncul setelah login'}
                </span>
                <ExternalLink className="text-green-400 flex-shrink-0" size={16} />
              </div>
            </div>

            <button 
              onClick={() => copyToClipboard(referralLink, 'link')}
              className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg ${
                copied.link 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white scale-105' 
                  : 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white hover:scale-105'
              }`}
              disabled={!reffCode}
            >
              {copied.link ? (
                <>
                  <Icon icon="solar:check-circle-bold" className="text-xl" />
                  Link Tersalin!
                </>
              ) : (
                <>
                  <Icon icon="solar:share-bold" className="text-xl" />
                  Bagikan Link Referral
                </>
              )}
            </button>
          </div>

          {/* Commission Levels */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-white/20 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Icon icon="solar:crown-star-bold" className="text-2xl text-yellow-400" />
              <h3 className="text-lg font-bold text-white">Level Komisi</h3>
            </div>

            <div className="space-y-4">
              {/* Level 1 */}
              <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-5 border border-purple-400/30 hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                      <Icon icon="solar:medal-ribbons-star-bold" className="text-xl text-white" />
                    </div>
                    <div>
                      <div className="text-white font-bold">Level 1 - Direct</div>
                      <div className="text-purple-200 text-sm">Referral Langsung</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-400">5%</div>
                    <div className="text-white/70 text-xs">Komisi</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:users-group-rounded-bold" className="text-cyan-400" />
                      <span className="text-white font-semibold">{teamStats[1]?.count || 0}</span>
                      <span className="text-white/70 text-sm">Diundang</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:shield-check-bold" className="text-green-400" />
                      <span className="text-white font-semibold">{teamStats[1]?.active || 0}</span>
                      <span className="text-white/70 text-sm">Aktif</span>
                    </div>
                  </div>
                  <button
                onClick={() => router.push(`/referral/my-team?level=1`)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-1.5 px-3 rounded-lg text-sm hover:scale-105 transition-all duration-300 flex items-center gap-1.5 min-w-[110px]"
                  >
                    <span>Lihat Tim</span>
                    <Icon icon="solar:arrow-right-bold" />
                  </button>
                </div>
              </div>

              {/* Level 2 */}
              <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl p-5 border border-blue-400/30 hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                      <Icon icon="solar:medal-ribbons-star-bold" className="text-xl text-white" />
                    </div>
                    <div>
                      <div className="text-white font-bold">Level 2 - Indirect</div>
                      <div className="text-blue-200 text-sm">Referral dari Level 1</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-400">2%</div>
                    <div className="text-white/70 text-xs">Komisi</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:users-group-rounded-bold" className="text-cyan-400" />
                      <span className="text-white font-semibold">{teamStats[2]?.count || 0}</span>
                      <span className="text-white/70 text-sm">Diundang</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:shield-check-bold" className="text-green-400" />
                      <span className="text-white font-semibold">{teamStats[2]?.active || 0}</span>
                      <span className="text-white/70 text-sm">Aktif</span>
                    </div>
                  </div>
                  <button
                onClick={() => router.push(`/referral/my-team?level=2`)}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-1.5 px-3 rounded-lg text-sm hover:scale-105 transition-all duration-300 flex items-center gap-1.5 min-w-[110px]"
                  >
                    <span>Lihat Tim</span>
                    <Icon icon="solar:arrow-right-bold" />
                  </button>
                </div>
              </div>

              {/* Level 3 */}
              <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-2xl p-5 border border-orange-400/30 hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                      <Icon icon="solar:medal-ribbons-star-bold" className="text-xl text-white" />
                    </div>
                    <div>
                      <div className="text-white font-bold">Level 3 - Network</div>
                      <div className="text-orange-200 text-sm">Referral dari Level 2</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-400">1%</div>
                    <div className="text-white/70 text-xs">Komisi</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:users-group-rounded-bold" className="text-cyan-400" />
                      <span className="text-white font-semibold">{teamStats[3]?.count || 0}</span>
                      <span className="text-white/70 text-sm">Diundang</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:shield-check-bold" className="text-green-400" />
                      <span className="text-white font-semibold">{teamStats[3]?.active || 0}</span>
                      <span className="text-white/70 text-sm">Aktif</span>
                    </div>
                  </div>
                  <button
                onClick={() => router.push(`/referral/my-team?level=3`)}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-1.5 px-3 rounded-lg text-sm hover:scale-105 transition-all duration-300 flex items-center gap-1.5 min-w-[110px]"
                  >
                    <span>Lihat Tim</span>
                    <Icon icon="solar:arrow-right-bold" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-white/20 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Icon icon="solar:gift-bold" className="text-2xl text-pink-400" />
              <h3 className="text-lg font-bold text-white">Keuntungan Referral</h3>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl p-4 border border-green-400/30 hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                    <Icon icon="solar:dollar-bold" className="text-2xl text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold mb-1">Komisi Tinggi</h4>
                    <p className="text-green-200 text-sm">Dapatkan hingga 8% total komisi dari 3 level referral</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-4 border border-blue-400/30 hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                    <Icon icon="solar:graph-up-bold" className="text-2xl text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold mb-1">Passive Income</h4>
                    <p className="text-blue-200 text-sm">Dapatkan penghasilan pasif dari jaringan yang terus berkembang</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-4 border border-purple-400/30 hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                    <Icon icon="solar:clock-circle-bold" className="text-2xl text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold mb-1">Pencairan Cepat</h4>
                    <p className="text-purple-200 text-sm">Proses withdrawal yang mudah dan cepat setiap saat</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-white/60 text-xs flex items-center justify-center gap-2 mb-4">
            <Icon icon="solar:copyright-bold" className="w-3 h-3" />
            <span>2025 Stoneform Capital. All Rights Reserved.</span>
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNavbar />
      </div>

      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Poppins', sans-serif; }
        body { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
      `}</style>
    </>
  );
}