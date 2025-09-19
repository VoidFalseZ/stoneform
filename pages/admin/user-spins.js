// pages/admin/user-spins.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Icon } from '@iconify/react';
import AdminLayout from '../../components/admin/Layout';
import useAdminAuth from '../../lib/auth/useAdminAuth';

export default function UserSpins() {
  const { loading: authLoading } = useAdminAuth();
  const [spins, setSpins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: '7days',
    searchUser: '',
    prizeType: 'all'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    if (authLoading) return;
    loadSpins();
  }, [authLoading, filters, currentPage]);

  const loadSpins = async () => {
    try {
      // Mock data - replace with actual API call
      const mockSpins = [
        {
          id: 1,
          userId: 'USR001',
          username: 'john_doe',
          email: 'john@example.com',
          prizeWon: 'Grand Prize',
          prizeAmount: 1000000,
          prizeType: 'cash',
          status: 'pending',
          spinDate: '2024-01-22T10:30:00Z',
          claimedDate: null,
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0...'
        },
        {
          id: 2,
          userId: 'USR002',
          username: 'jane_smith',
          email: 'jane@example.com',
          prizeWon: 'Medium Prize',
          prizeAmount: 100000,
          prizeType: 'cash',
          status: 'claimed',
          spinDate: '2024-01-22T09:15:00Z',
          claimedDate: '2024-01-22T09:16:00Z',
          ipAddress: '192.168.1.101',
          userAgent: 'Mozilla/5.0...'
        },
        {
          id: 3,
          userId: 'USR003',
          username: 'mike_wilson',
          email: 'mike@example.com',
          prizeWon: 'No Prize',
          prizeAmount: 0,
          prizeType: 'none',
          status: 'completed',
          spinDate: '2024-01-22T08:45:00Z',
          claimedDate: null,
          ipAddress: '192.168.1.102',
          userAgent: 'Mozilla/5.0...'
        },
        {
          id: 4,
          userId: 'USR004',
          username: 'sarah_davis',
          email: 'sarah@example.com',
          prizeWon: 'Small Prize',
          prizeAmount: 25000,
          prizeType: 'cash',
          status: 'claimed',
          spinDate: '2024-01-21T16:20:00Z',
          claimedDate: '2024-01-21T16:25:00Z',
          ipAddress: '192.168.1.103',
          userAgent: 'Mozilla/5.0...'
        },
        {
          id: 5,
          userId: 'USR005',
          username: 'robert_brown',
          email: 'robert@example.com',
          prizeWon: 'Major Prize',
          prizeAmount: 500000,
          prizeType: 'cash',
          status: 'cancelled',
          spinDate: '2024-01-21T14:10:00Z',
          claimedDate: null,
          ipAddress: '192.168.1.104',
          userAgent: 'Mozilla/5.0...'
        }
      ];
      
      // Apply filters
      let filteredSpins = mockSpins.filter(spin => {
        if (filters.status !== 'all' && spin.status !== filters.status) return false;
        if (filters.prizeType !== 'all' && spin.prizeType !== filters.prizeType) return false;
        if (filters.searchUser && !spin.username.toLowerCase().includes(filters.searchUser.toLowerCase()) && 
            !spin.email.toLowerCase().includes(filters.searchUser.toLowerCase())) return false;
        return true;
      });
      
      setSpins(filteredSpins);
    } catch (error) {
      console.error('Failed to load user spins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleForceAction = async (spinId, action) => {
    const confirmMessage = action === 'claim' 
      ? 'Are you sure you want to force claim this prize?'
      : 'Are you sure you want to cancel this spin?';
      
    if (!confirm(confirmMessage)) return;
    
    try {
      const updatedSpins = spins.map(spin =>
        spin.id === spinId
          ? {
              ...spin,
              status: action === 'claim' ? 'claimed' : 'cancelled',
              claimedDate: action === 'claim' ? new Date().toISOString() : null
            }
          : spin
      );
      setSpins(updatedSpins);
    } catch (error) {
      console.error(`Failed to ${action} spin:`, error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'claimed': return 'bg-green-500/20 text-green-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      case 'completed': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getPrizeTypeColor = (type) => {
    switch (type) {
      case 'cash': return 'bg-green-500/20 text-green-400';
      case 'bonus': return 'bg-blue-500/20 text-blue-400';
      case 'none': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID');
  };

  const totalPages = Math.ceil(spins.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSpins = spins.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    totalSpins: spins.length,
    pendingSpins: spins.filter(s => s.status === 'pending').length,
    claimedSpins: spins.filter(s => s.status === 'claimed').length,
    totalPrizeValue: spins.filter(s => s.status === 'claimed').reduce((sum, s) => sum + s.prizeAmount, 0)
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading user spins...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout title="User Spins History">
      <Head>
        <title>User Spins | Stoneform Capital Admin</title>
      </Head>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">User Spins History</h1>
          <p className="text-gray-400">Monitor and manage user spin activities</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Total Spins</h3>
            <Icon icon="mdi:dice-6" className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalSpins}</div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Pending Claims</h3>
            <Icon icon="mdi:clock-alert" className="w-6 h-6 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.pendingSpins}</div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Claimed Prizes</h3>
            <Icon icon="mdi:check-circle" className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.claimedSpins}</div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Total Claimed Value</h3>
            <Icon icon="mdi:cash-multiple" className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            Rp {stats.totalPrizeValue.toLocaleString('id-ID')}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Search User</label>
            <div className="relative">
              <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={filters.searchUser}
                onChange={(e) => handleFilterChange('searchUser', e.target.value)}
                placeholder="Username or email"
                className="w-full bg-white/10 border border-white/20 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="claimed">Claimed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Prize Type</label>
            <select
              value={filters.prizeType}
              onChange={(e) => handleFilterChange('prizeType', e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Types</option>
              <option value="cash">Cash Prize</option>
              <option value="bonus">Bonus Points</option>
              <option value="none">No Prize</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Date Range</label>
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Spins Table */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <Icon icon="mdi:history" className="text-purple-400" />
            Spin History ({spins.length} total)
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/20">
              <tr>
                <th className="text-left text-gray-400 font-medium p-4">User</th>
                <th className="text-left text-gray-400 font-medium p-4">Prize Won</th>
                <th className="text-left text-gray-400 font-medium p-4">Amount</th>
                <th className="text-left text-gray-400 font-medium p-4">Type</th>
                <th className="text-left text-gray-400 font-medium p-4">Status</th>
                <th className="text-left text-gray-400 font-medium p-4">Spin Date</th>
                <th className="text-left text-gray-400 font-medium p-4">Claimed Date</th>
                <th className="text-left text-gray-400 font-medium p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {currentSpins.map((spin) => (
                <tr key={spin.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div>
                      <div className="text-white font-medium">{spin.username}</div>
                      <div className="text-gray-400 text-sm">{spin.email}</div>
                      <div className="text-gray-500 text-xs">ID: {spin.userId}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-white font-medium">{spin.prizeWon}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-white">
                      {spin.prizeAmount > 0 ? `Rp ${spin.prizeAmount.toLocaleString('id-ID')}` : '-'}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPrizeTypeColor(spin.prizeType)}`}>
                      {spin.prizeType === 'none' ? 'No Prize' : spin.prizeType.charAt(0).toUpperCase() + spin.prizeType.slice(1)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(spin.status)}`}>
                      {spin.status.charAt(0).toUpperCase() + spin.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-white text-sm">{formatDate(spin.spinDate)}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-white text-sm">
                      {spin.claimedDate ? formatDate(spin.claimedDate) : '-'}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {spin.status === 'pending' && spin.prizeAmount > 0 && (
                        <>
                          <button
                            onClick={() => handleForceAction(spin.id, 'claim')}
                            className="p-2 text-green-400 hover:bg-green-400/20 rounded-lg transition-colors"
                            title="Force Claim"
                          >
                            <Icon icon="mdi:check-circle" className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleForceAction(spin.id, 'cancel')}
                            className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                            title="Cancel Spin"
                          >
                            <Icon icon="mdi:close-circle" className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => {
                          // Show detailed view modal
                          alert(`Detailed view for spin ID: ${spin.id}\nIP: ${spin.ipAddress}`);
                        }}
                        className="p-2 text-blue-400 hover:bg-blue-400/20 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Icon icon="mdi:eye" className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-white/10 flex items-center justify-between">
            <div className="text-gray-400 text-sm">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, spins.length)} of {spins.length} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Icon icon="mdi:chevron-left" className="w-4 h-4" />
              </button>
              
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Icon icon="mdi:chevron-right" className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}