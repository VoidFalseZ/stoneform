// pages/admin/users.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Icon } from '@iconify/react';
import AdminLayout from '../../components/admin/Layout';
import useAdminAuth from '../../lib/auth/useAdminAuth';

export default function UserManagement() {
  const { loading: authLoading } = useAdminAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    level: 'all',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    if (authLoading) return;
    
    const loadUsers = async () => {
      try {
        // Mock data for demonstration
        const mockUsers = [
          {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+628123456789',
            status: 'active',
            level: 'Premium',
            joinDate: '2023-05-15',
            balance: 2500000,
            totalInvestment: 10000000,
            referralCode: 'JOHN123',
            referredBy: 'REF456',
            spinTickets: 3
          },
          {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '+628987654321',
            status: 'blocked',
            level: 'Basic',
            joinDate: '2023-06-20',
            balance: 500000,
            totalInvestment: 3000000,
            referralCode: 'JANE456',
            referredBy: null,
            spinTickets: 0
          },
          {
            id: 3,
            name: 'Bob Johnson',
            email: 'bob@example.com',
            phone: '+628112233445',
            status: 'active',
            level: 'Gold',
            joinDate: '2023-07-10',
            balance: 7500000,
            totalInvestment: 25000000,
            referralCode: 'BOB789',
            referredBy: 'JOHN123',
            spinTickets: 5
          }
        ];
        setUsers(mockUsers);
      } catch (error) {
        console.error('Failed to load users:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [authLoading]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const filteredUsers = users.filter(user => {
    if (filters.status !== 'all' && user.status !== filters.status) return false;
    if (filters.level !== 'all' && user.level !== filters.level) return false;
    if (filters.dateFrom && new Date(user.joinDate) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(user.joinDate) > new Date(filters.dateTo)) return false;
    return true;
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout title="User Management">
      <Head>
        <title>Stoneform Capital | User Management</title>
      </Head>

      {/* Filter Section */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-6">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Icon icon="mdi:filter" className="text-purple-400" />
          Filter Users
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Status</label>
            <select 
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Level</label>
            <select 
              value={filters.level}
              onChange={(e) => handleFilterChange('level', e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Levels</option>
              <option value="Basic">Basic</option>
              <option value="Premium">Premium</option>
              <option value="Gold">Gold</option>
              <option value="Platinum">Platinum</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">From Date</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">To Date</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <Icon icon="mdi:account-group" className="text-blue-400" />
            Users ({filteredUsers.length})
          </h2>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl flex items-center gap-2">
            <Icon icon="mdi:plus" className="w-4 h-4" />
            Add User
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-3 px-4 text-left">User</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Level</th>
                <th className="py-3 px-4 text-left">Join Date</th>
                <th className="py-3 px-4 text-left">Balance</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.status === 'active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">{user.level}</td>
                  <td className="py-4 px-4">{new Date(user.joinDate).toLocaleDateString('id-ID')}</td>
                  <td className="py-4 px-4">Rp {user.balance.toLocaleString('id-ID')}</td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <button className="p-1 text-blue-400 hover:text-blue-300">
                        <Icon icon="mdi:eye" className="w-5 h-5" />
                      </button>
                      <button className="p-1 text-yellow-400 hover:text-yellow-300">
                        <Icon icon="mdi:pencil" className="w-5 h-5" />
                      </button>
                      <button className="p-1 text-red-400 hover:text-red-300">
                        <Icon icon="mdi:block-helper" className="w-5 h-5" />
                      </button>
                      <button className="p-1 text-purple-400 hover:text-purple-300">
                        <Icon icon="mdi:refresh" className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-gray-400 text-sm">Showing 1 to {filteredUsers.length} of {filteredUsers.length} results</p>
          <div className="flex gap-2">
            <button className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg">
              Previous
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg">
              1
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg">
              Next
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}