// pages/admin/accounts.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Icon } from '@iconify/react';
import AdminLayout from '../../components/admin/Layout';
import useAdminAuth from '../../lib/auth/useAdminAuth';

export default function UserAccountManagement() {
  const { loading: authLoading } = useAdminAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState('');

  useEffect(() => {
    if (authLoading) return;
    
    // Mock data for demonstration
    const mockUsers = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+628123456789',
        joinDate: '2023-01-15',
        status: 'active',
        balance: 12500000,
        totalInvestments: 45000000,
        verificationStatus: 'verified',
        lastLogin: '2023-05-15 14:30:22',
        profileImage: null
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+628987654321',
        joinDate: '2023-02-20',
        status: 'active',
        balance: 8500000,
        totalInvestments: 32000000,
        verificationStatus: 'verified',
        lastLogin: '2023-05-14 11:15:44',
        profileImage: null
      },
      {
        id: 3,
        name: 'Robert Johnson',
        email: 'robert.j@example.com',
        phone: '+628112233445',
        joinDate: '2023-03-10',
        status: 'suspended',
        balance: 2500000,
        totalInvestments: 15000000,
        verificationStatus: 'pending',
        lastLogin: '2023-05-10 09:22:11',
        profileImage: null
      },
      {
        id: 4,
        name: 'Sarah Williams',
        email: 'sarah.w@example.com',
        phone: '+628554433221',
        joinDate: '2023-04-05',
        status: 'inactive',
        balance: 500000,
        totalInvestments: 5000000,
        verificationStatus: 'rejected',
        lastLogin: '2023-04-28 16:45:33',
        profileImage: null
      }
    ];
    
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
    setLoading(false);
  }, [authLoading]);

  useEffect(() => {
    let result = users;
    
    // Filter by status
    if (selectedStatus !== 'all') {
      result = result.filter(user => user.status === selectedStatus);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(term) || 
        user.email.toLowerCase().includes(term) ||
        user.phone.includes(term)
      );
    }
    
    setFilteredUsers(result);
  }, [selectedStatus, searchTerm, users]);

  const handleAction = (user, action) => {
    setSelectedUser(user);
    setModalAction(action);
    setShowModal(true);
  };

  const confirmAction = () => {
    // Update user status
    const updatedUsers = users.map(u => 
      u.id === selectedUser.id 
        ? { ...u, status: modalAction === 'activate' ? 'active' : 
                   modalAction === 'suspend' ? 'suspended' : u.status } 
        : u
    );
    
    setUsers(updatedUsers);
    setShowModal(false);
    
    // In a real app, this would call an API to update the user status
    console.log(`${modalAction} user:`, selectedUser.id);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: 'bg-green-500/10 text-green-400',
      suspended: 'bg-yellow-500/10 text-yellow-400',
      inactive: 'bg-red-500/10 text-red-400'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getVerificationBadge = (status) => {
    const statusClasses = {
      verified: 'bg-green-500/10 text-green-400',
      pending: 'bg-yellow-500/10 text-yellow-400',
      rejected: 'bg-red-500/10 text-red-400'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading user accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout title="User Account Management">
      <Head>
        <title>Stoneform Capital | User Accounts</title>
      </Head>

      {/* Action Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 max-w-md w-full">
            <h3 className="text-white font-semibold text-lg mb-4">
              {modalAction === 'activate' ? 'Activate Account' : 
               modalAction === 'suspend' ? 'Suspend Account' : 'View Details'}
            </h3>
            <p className="text-gray-400 mb-6">
              {modalAction === 'activate' ? `Are you sure you want to activate ${selectedUser.name}'s account?` : 
               modalAction === 'suspend' ? `Are you sure you want to suspend ${selectedUser.name}'s account?` : 
               `Viewing details for ${selectedUser.name}`}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                {modalAction === 'view' ? 'Close' : 'Cancel'}
              </button>
              {(modalAction === 'activate' || modalAction === 'suspend') && (
                <button
                  onClick={confirmAction}
                  className={`px-4 py-2 rounded-xl ${
                    modalAction === 'activate' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-yellow-600 hover:bg-yellow-700'
                  } text-white transition-colors`}
                >
                  Confirm
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filter Controls */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-white font-semibold text-xl">User Accounts</h2>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/5 border border-white/10 text-white rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-3 px-4 text-left text-gray-400 text-sm font-medium">User</th>
                <th className="py-3 px-4 text-left text-gray-400 text-sm font-medium">Contact</th>
                <th className="py-3 px-4 text-left text-gray-400 text-sm font-medium">Balance</th>
                <th className="py-3 px-4 text-left text-gray-400 text-sm font-medium">Status</th>
                <th className="py-3 px-4 text-left text-gray-400 text-sm font-medium">Verification</th>
                <th className="py-3 px-4 text-left text-gray-400 text-sm font-medium">Joined</th>
                <th className="py-3 px-4 text-left text-gray-400 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                        {user.profileImage ? (
                          <img src={user.profileImage} alt={user.name} className="w-10 h-10 rounded-full" />
                        ) : (
                          <span className="text-white font-semibold">
                            {user.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="text-white font-medium">{user.name}</div>
                        <div className="text-gray-400 text-sm">ID: #{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-white">{user.email}</div>
                    <div className="text-gray-400 text-sm">{user.phone}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-white">{formatCurrency(user.balance)}</div>
                    <div className="text-gray-400 text-sm">Invested: {formatCurrency(user.totalInvestments)}</div>
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(user.status)}</td>
                  <td className="py-3 px-4">{getVerificationBadge(user.verificationStatus)}</td>
                  <td className="py-3 px-4 text-gray-400 text-sm">{formatDate(user.joinDate)}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(user, 'view')}
                        className="p-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg text-blue-400"
                        title="View Details"
                      >
                        <Icon icon="mdi:eye" className="w-4 h-4" />
                      </button>
                      {user.status === 'active' ? (
                        <button
                          onClick={() => handleAction(user, 'suspend')}
                          className="p-2 bg-yellow-600/20 hover:bg-yellow-600/30 rounded-lg text-yellow-400"
                          title="Suspend Account"
                        >
                          <Icon icon="mdi:pause" className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAction(user, 'activate')}
                          className="p-2 bg-green-600/20 hover:bg-green-600/30 rounded-lg text-green-400"
                          title="Activate Account"
                        >
                          <Icon icon="mdi:play" className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <Icon icon="mdi:account-off" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-400 text-lg">No users found</h3>
            <p className="text-gray-500 mt-2">
              {searchTerm 
                ? `No users match your search for "${searchTerm}"` 
                : 'There are no users with the selected status.'}
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}