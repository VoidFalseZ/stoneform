import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Home, Users, Gift, CreditCard, User, BarChart3, ArrowLeft, Search, Filter } from 'lucide-react';
import { Icon } from '@iconify/react';
import { getTeamInvitedByLevel, getTeamDataByLevel } from '../../utils/api';
import BottomNavbar from '../../components/BottomNavbar';

export default function Team() {
  const router = useRouter();
  const { level } = router.query;
  const [teamData, setTeamData] = useState({
    totalInvestment: 0,
    activeMembers: 0,
    members: [],
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'inactive'

  // Hoisted fetch function with cancel token to avoid setState after unmount
  async function fetchData(cancelToken) {
    setLoading(true);
    try {
      // Get stats (active, count, total_invest)
      const statsRes = await getTeamInvitedByLevel(level);
      const stats = statsRes?.data?.[level] || { active: 0, count: 0, total_invest: 0 };

      // Get members
      const membersRes = await getTeamDataByLevel(level);
      const membersArr = membersRes?.data?.members || [];
      // Map members to UI format (guard against undefined phone)
      const members = membersArr.map((m, idx) => {
        let phone = (m.number || '').toString();
        if (phone.startsWith('0')) phone = `62${phone.slice(1)}`;
        else if (phone.startsWith('+62')) phone = phone.slice(1);
        else if (phone.startsWith('62')) phone = phone;
        else if (phone.length > 0) phone = `62${phone}`;
        return {
          id: idx + 1,
          phone,
          name: m.name,
          investment: m.total_invest,
          status: m.active ? 'active' : 'inactive',
        };
      });

      if (!cancelToken?.current) {
        setTeamData({
          totalInvestment: stats.total_invest || 0,
          activeMembers: stats.active || 0,
          members,
        });
      }
    } catch (e) {
      if (!cancelToken?.current) setTeamData({ totalInvestment: 0, activeMembers: 0, members: [] });
    } finally {
      if (!cancelToken?.current) setLoading(false);
    }
  }

  useEffect(() => {
    if (!level) return;
    const cancelToken = { current: false };
    fetchData(cancelToken);
    return () => { cancelToken.current = true; };
  }, [level]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getLevelColor = (level) => {
    switch (level) {
      case '1': return { from: 'from-purple-600', to: 'to-pink-600', border: 'border-purple-400', text: 'text-purple-300' };
      case '2': return { from: 'from-blue-600', to: 'to-cyan-600', border: 'border-blue-400', text: 'text-blue-300' };
      case '3': return { from: 'from-orange-600', to: 'to-red-600', border: 'border-orange-400', text: 'text-orange-300' };
      default: return { from: 'from-purple-600', to: 'to-pink-600', border: 'border-purple-400', text: 'text-purple-300' };
    }
  };

  const levelColor = getLevelColor(level);

  // Filter members based on search and status
  const filteredMembers = teamData.members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.phone.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 pb-32">
      <Head>
        <title>Stoneform Capital | Tim Saya Level {level}</title>
        <meta name="description" content="Daftar Anggota Tim Stoneform Capital" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
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
            <div className={`p-2 bg-gradient-to-r ${levelColor.from} ${levelColor.to} rounded-xl`}>
              <Icon icon="solar:users-group-two-rounded-bold" className="text-xl text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Tim Level {level}</h1>
              <p className="text-white/70 text-sm">
                {level === '1' ? 'Referral Langsung' : level === '2' ? 'Referral Tidak Langsung' : 'Jaringan Level 3'}
              </p>
            </div>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6">
        {/* Stats Header */}
        <div className={`bg-gradient-to-r ${levelColor.from}/30 ${levelColor.to}/30 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-white/20 shadow-2xl`}>
          <div className="flex items-center gap-3 mb-4">
            <Icon icon="solar:crown-star-bold" className="text-3xl text-yellow-400" />
            <div>
              <h2 className="text-xl font-bold text-white">Level {level} Team</h2>
              <p className="text-white/70 text-sm">Statistik & Performa Tim</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-2xl p-4 text-center border border-white/10">
              <Icon icon="solar:wallet-money-bold" className="text-2xl text-cyan-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">{formatCurrency(teamData.totalInvestment)}</div>
              <div className="text-white/70 text-xs">Total Investasi</div>
            </div>
            
            <div className="bg-white/10 rounded-2xl p-4 text-center border border-white/10">
              <Icon icon="solar:users-group-rounded-bold" className="text-2xl text-green-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">{teamData.activeMembers}</div>
              <div className="text-white/70 text-xs">Member Aktif</div>
            </div>
            
            <div className="bg-white/10 rounded-2xl p-4 text-center border border-white/10">
              <Icon icon="solar:medal-ribbons-star-bold" className="text-2xl text-purple-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-white">{teamData.members.length}</div>
              <div className="text-white/70 text-xs">Total Member</div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 mb-6 border border-white/20 shadow-xl">
          <div className="flex gap-3">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={18} />
              <input
                type="text"
                placeholder="Cari nama atau nomor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white rounded-2xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder-white/50 text-sm"
              />
            </div>
            
            {/* Filter Status */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-white/10 border border-white/20 text-white rounded-2xl px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-purple-400 appearance-none text-sm font-medium"
              >
                <option value="all" className="bg-gray-800 text-white">Semua</option>
                <option value="active" className="bg-gray-800 text-white">Aktif</option>
                <option value="inactive" className="bg-gray-800 text-white">Tidak Aktif</option>
              </select>
              <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/60 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        {/* Members List */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Icon icon="solar:users-group-rounded-bold" className={`text-2xl ${levelColor.text}`} />
            <h3 className="text-lg font-bold text-white">
              Daftar Member ({filteredMembers.length})
            </h3>
          </div>

          {loading ? (
            <div className="flex flex-col items-center py-12">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin mb-4"></div>
                <Icon icon="solar:users-group-rounded-bold" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-400 text-xl" />
              </div>
              <p className="text-white/70 font-medium text-lg">Memuat data tim...</p>
              <p className="text-white/50 text-sm mt-1">Mohon tunggu sebentar</p>
            </div>
          ) : filteredMembers.length > 0 ? (
            <div className="space-y-4">
              {filteredMembers.map((member, index) => (
                <div key={member.id} className={`bg-gradient-to-r ${levelColor.from}/20 ${levelColor.to}/20 backdrop-blur-xl rounded-2xl p-5 border ${levelColor.border}/30 hover:scale-[1.02] transition-all duration-300 shadow-lg`}>
                  <div className="flex items-center gap-4">
                    {/* Avatar with Index */}
                    <div className={`relative w-14 h-14 bg-gradient-to-r ${levelColor.from} ${levelColor.to} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <Icon icon="solar:user-bold" className="text-white text-2xl" />
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">#{index + 1}</span>
                      </div>
                    </div>

                    {/* Member Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-white font-bold text-lg truncate">{member.name}</h4>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                          member.status === 'active' 
                            ? 'bg-green-500/20 text-green-400 border border-green-400/30' 
                            : 'bg-gray-500/20 text-gray-400 border border-gray-400/30'
                        }`}>
                          <Icon 
                            icon={member.status === 'active' ? "solar:shield-check-bold" : "solar:shield-cross-bold"} 
                            className="text-xs" 
                          />
                          {member.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Icon icon="solar:phone-bold" className="text-blue-400" size={16} />
                          <span className="text-white/80 text-sm font-medium">+{member.phone.replace(/^62/, '62 ')}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Icon icon="solar:wallet-money-bold" className="text-cyan-400" size={16} />
                          <span className="text-white/80 text-sm">
                            <span className="font-semibold text-cyan-400">{formatCurrency(member.investment)}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : teamData.members.length === 0 ? (
            <div className="bg-gradient-to-r from-gray-600/20 to-gray-500/20 backdrop-blur-xl rounded-2xl p-8 border border-gray-400/30 text-center">
              <Icon icon="solar:users-group-rounded-linear" className="text-6xl text-gray-400 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-white mb-2">Belum Ada Member</h4>
              <p className="text-white/70 text-sm mb-4">Tim level {level} Anda masih kosong.</p>
              <button
                onClick={() => router.push('/referral')}
                className={`bg-gradient-to-r ${levelColor.from} ${levelColor.to} text-white font-semibold py-3 px-6 rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg`}
              >
                Mulai Referral Sekarang
              </button>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30 text-center">
              <Icon icon="solar:magnifer-bug-bold" className="text-4xl text-yellow-400 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-white mb-2">Tidak Ada Hasil</h4>
              <p className="text-white/70 text-sm">Tidak ditemukan member yang sesuai dengan pencarian "{searchTerm}"</p>
            </div>
          )}
        </div>

        {/* Copyright */}
        <div className="text-center text-white/60 text-xs flex items-center justify-center gap-2 mb-4">
          <Icon icon="solar:copyright-bold" className="w-3 h-3" />
          <span>2025 Stoneform Capital. All Rights Reserved.</span>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavbar />

      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Poppins', sans-serif; }
        body { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
        select { -webkit-appearance: none; -moz-appearance: none; appearance: none; }
        select::-ms-expand { display: none; }
        input::placeholder, select::placeholder { color: rgba(255, 255, 255, 0.5) !important; }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}