// pages/admin/banks.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Icon } from '@iconify/react';
import AdminLayout from '../../components/admin/Layout';
import useAdminAuth from '../../lib/auth/useAdminAuth';

export default function BankManagement() {
  const { loading: authLoading } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('banks');
  const [banks, setBanks] = useState([]);
  const [userAccounts, setUserAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBank, setEditingBank] = useState(null);
  const [bankForm, setBankForm] = useState({ name: '', code: '', status: 'active' });
  const [filters, setFilters] = useState({
    bank: 'all',
    status: 'all',
    verification: 'all'
  });

  useEffect(() => {
    if (authLoading) return;
    
    const loadData = async () => {
      try {
        // Mock data for banks
        const mockBanks = [
          { id: 1, name: 'Bank Central Asia', code: 'BCA', status: 'active' },
          { id: 2, name: 'Bank Mandiri', code: 'BRI', status: 'active' },
          { id: 3, name: 'Bank Rakyat Indonesia', code: 'BRI', status: 'active' },
          { id: 4, name: 'Bank Negara Indonesia', code: 'BNI', status: 'inactive' },
          { id: 5, name: 'Bank CIMB Niaga', code: 'CIMB', status: 'active' },
        ];

        // Mock data for user accounts
        const mockUserAccounts = [
          {
            id: 1,
            userName: 'John Doe',
            bankName: 'Bank Central Asia',
            accountNumber: '1234567890',
            accountHolder: 'John Doe',
            status: 'active',
            verification: 'verified',
            createdAt: '2023-05-15'
          },
          {
            id: 2,
            userName: 'Jane Smith',
            bankName: 'Bank Mandiri',
            accountNumber: '0987654321',
            accountHolder: 'Jane Smith',
            status: 'active',
            verification: 'pending',
            createdAt: '2023-06-20'
          },
          {
            id: 3,
            userName: 'Bob Johnson',
            bankName: 'Bank Rakyat Indonesia',
            accountNumber: '5678901234',
            accountHolder: 'Bob Johnson',
            status: 'inactive',
            verification: 'rejected',
            createdAt: '2023-07-10'
          },
          {
            id: 4,
            userName: 'Alice Brown',
            bankName: 'Bank CIMB Niaga',
            accountNumber: '4321098765',
            accountHolder: 'Alice Brown',
            status: 'active',
            verification: 'verified',
            createdAt: '2023-08-05'
          }
        ];

        setBanks(mockBanks);
        setUserAccounts(mockUserAccounts);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [authLoading]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleBankSubmit = (e) => {
    e.preventDefault();
    if (editingBank) {
      // Update existing bank
      setBanks(banks.map(bank => 
        bank.id === editingBank.id ? { ...bank, ...bankForm } : bank
      ));
    } else {
      // Add new bank
      const newBank = {
        id: Math.max(...banks.map(b => b.id)) + 1,
        ...bankForm
      };
      setBanks([...banks, newBank]);
    }
    setEditingBank(null);
    setBankForm({ name: '', code: '', status: 'active' });
  };

  const handleEditBank = (bank) => {
    setEditingBank(bank);
    setBankForm({ name: bank.name, code: bank.code, status: bank.status });
  };

  const handleToggleBankStatus = (bankId) => {
    setBanks(banks.map(bank => 
      bank.id === bankId 
        ? { ...bank, status: bank.status === 'active' ? 'inactive' : 'active' } 
        : bank
    ));
  };

  const handleToggleVerification = (accountId, status) => {
    setUserAccounts(userAccounts.map(account => 
      account.id === accountId 
        ? { ...account, verification: status } 
        : account
    ));
  };

  const filteredAccounts = userAccounts.filter(account => {
    if (filters.bank !== 'all' && account.bankName !== filters.bank) return false;
    if (filters.status !== 'all' && account.status !== filters.status) return false;
    if (filters.verification !== 'all' && account.verification !== filters.verification) return false;
    return true;
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading bank data...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout title="Bank & Accounts Management">
      <Head>
        <title>Stoneform Capital | Bank Management</title>
      </Head>

      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
            activeTab === 'banks'
              ? 'text-purple-400 border-b-2 border-purple-400 bg-white/5'
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('banks')}
        >
          <Icon icon="mdi:bank" className="inline mr-2 w-5 h-5" />
          Banks
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
            activeTab === 'accounts'
              ? 'text-purple-400 border-b-2 border-purple-400 bg-white/5'
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('accounts')}
        >
          <Icon icon="mdi:account-cash" className="inline mr-2 w-5 h-5" />
          User Accounts
        </button>
      </div>

      {/* Banks Section */}
      {activeTab === 'banks' && (
        <div className="space-y-6">
          {/* Add/Edit Bank Form */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Icon icon={editingBank ? "mdi:pencil" : "mdi:plus"} className="text-purple-400" />
              {editingBank ? 'Edit Bank' : 'Add New Bank'}
            </h2>
            <form onSubmit={handleBankSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Bank Name</label>
                <input
                  type="text"
                  value={bankForm.name}
                  onChange={(e) => setBankForm({ ...bankForm, name: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter bank name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Bank Code</label>
                <input
                  type="text"
                  value={bankForm.code}
                  onChange={(e) => setBankForm({ ...bankForm, code: e.target.value.toUpperCase() })}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter bank code"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Status</label>
                <select
                  value={bankForm.status}
                  onChange={(e) => setBankForm({ ...bankForm, status: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="md:col-span-3 flex justify-end gap-2">
                {editingBank && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingBank(null);
                      setBankForm({ name: '', code: '', status: 'active' });
                    }}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl flex items-center gap-2"
                >
                  <Icon icon={editingBank ? "mdi:content-save" : "mdi:plus"} className="w-4 h-4" />
                  {editingBank ? 'Update Bank' : 'Add Bank'}
                </button>
              </div>
            </form>
          </div>

          {/* Banks List */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Icon icon="mdi:bank" className="text-blue-400" />
              Bank List ({banks.length})
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-3 px-4 text-left">Bank Name</th>
                    <th className="py-3 px-4 text-left">Code</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {banks.map(bank => (
                    <tr key={bank.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-4 px-4 font-medium">{bank.name}</td>
                      <td className="py-4 px-4">{bank.code}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          bank.status === 'active' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {bank.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEditBank(bank)}
                            className="p-1 text-yellow-400 hover:text-yellow-300"
                            title="Edit"
                          >
                            <Icon icon="mdi:pencil" className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleToggleBankStatus(bank.id)}
                            className={`p-1 ${
                              bank.status === 'active' 
                                ? 'text-red-400 hover:text-red-300' 
                                : 'text-green-400 hover:text-green-300'
                            }`}
                            title={bank.status === 'active' ? 'Deactivate' : 'Activate'}
                          >
                            <Icon 
                              icon={bank.status === 'active' ? "mdi:close-circle" : "mdi:check-circle"} 
                              className="w-5 h-5" 
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* User Accounts Section */}
      {activeTab === 'accounts' && (
        <div className="space-y-6">
          {/* Filter Section */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Icon icon="mdi:filter" className="text-purple-400" />
              Filter Accounts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Bank</label>
                <select 
                  value={filters.bank}
                  onChange={(e) => handleFilterChange('bank', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Banks</option>
                  {[...new Set(userAccounts.map(acc => acc.bankName))].map(bank => (
                    <option key={bank} value={bank}>{bank}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Status</label>
                <select 
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Verification</label>
                <select 
                  value={filters.verification}
                  onChange={(e) => handleFilterChange('verification', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Verification</option>
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* User Accounts Table */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Icon icon="mdi:account-cash" className="text-blue-400" />
              User Accounts ({filteredAccounts.length})
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-3 px-4 text-left">User</th>
                    <th className="py-3 px-4 text-left">Bank</th>
                    <th className="py-3 px-4 text-left">Account Number</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Verification</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.map(account => (
                    <tr key={account.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium">{account.userName}</p>
                          <p className="text-gray-400 text-xs">{account.accountHolder}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">{account.bankName}</td>
                      <td className="py-4 px-4">{account.accountNumber}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          account.status === 'active' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {account.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          account.verification === 'verified' 
                            ? 'bg-green-500/20 text-green-400' 
                            : account.verification === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {account.verification}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          {account.verification === 'pending' && (
                            <>
                              <button 
                                onClick={() => handleToggleVerification(account.id, 'verified')}
                                className="p-1 text-green-400 hover:text-green-300"
                                title="Verify"
                              >
                                <Icon icon="mdi:check" className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => handleToggleVerification(account.id, 'rejected')}
                                className="p-1 text-red-400 hover:text-red-300"
                                title="Reject"
                              >
                                <Icon icon="mdi:close" className="w-5 h-5" />
                              </button>
                            </>
                          )}
                          <button className="p-1 text-blue-400 hover:text-blue-300" title="View Details">
                            <Icon icon="mdi:eye" className="w-5 h-5" />
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
              <p className="text-gray-400 text-sm">
                Showing 1 to {filteredAccounts.length} of {filteredAccounts.length} results
              </p>
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
        </div>
      )}
    </AdminLayout>
  );
}