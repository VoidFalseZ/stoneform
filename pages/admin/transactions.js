// pages/admin/transactions.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Icon } from '@iconify/react';
import AdminLayout from '../../components/admin/Layout';
import useAdminAuth from '../../lib/auth/useAdminAuth';

export default function TransactionsManagement() {
  const { loading: authLoading } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('transactions');
  const [transactions, setTransactions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: '',
    search: ''
  });
  const [paymentFilters, setPaymentFilters] = useState({
    status: 'pending',
    method: 'all',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    if (authLoading) return;
    
    const loadData = async () => {
      try {
        // Mock data for transactions
        const mockTransactions = [
          {
            id: 1,
            userId: 'USR001',
            userName: 'John Doe',
            type: 'investment',
            amount: 5000000,
            status: 'completed',
            date: '2023-10-15 14:30:25',
            reference: 'INV20231015001',
            investmentId: 'INV001'
          },
          {
            id: 2,
            userId: 'USR002',
            userName: 'Jane Smith',
            type: 'withdrawal',
            amount: 2500000,
            status: 'pending',
            date: '2023-10-16 09:15:42',
            reference: 'WTH20231016001',
            investmentId: null
          },
          {
            id: 3,
            userId: 'USR003',
            userName: 'Bob Johnson',
            type: 'investment',
            amount: 10000000,
            status: 'completed',
            date: '2023-10-16 11:45:18',
            reference: 'INV20231016002',
            investmentId: 'INV002'
          },
          {
            id: 4,
            userId: 'USR004',
            userName: 'Alice Brown',
            type: 'withdrawal',
            amount: 1500000,
            status: 'failed',
            date: '2023-10-17 16:20:33',
            reference: 'WTH20231017001',
            investmentId: null
          },
          {
            id: 5,
            userId: 'USR001',
            userName: 'John Doe',
            type: 'investment',
            amount: 3000000,
            status: 'completed',
            date: '2023-10-18 13:05:57',
            reference: 'INV20231018001',
            investmentId: 'INV003'
          }
        ];

        // Mock data for payments
        const mockPayments = [
          {
            id: 1,
            userId: 'USR002',
            userName: 'Jane Smith',
            amount: 2500000,
            method: 'bank_transfer',
            status: 'pending',
            date: '2023-10-16 09:15:42',
            reference: 'PAY20231016001',
            investmentId: null,
            proofImage: '/api/placeholder/300/200',
            bankAccount: '1234567890 (BCA)',
            accountHolder: 'Jane Smith'
          },
          {
            id: 2,
            userId: 'USR005',
            userName: 'Charlie Wilson',
            amount: 7500000,
            method: 'bank_transfer',
            status: 'pending',
            date: '2023-10-17 14:22:18',
            reference: 'PAY20231017001',
            investmentId: 'INV004',
            proofImage: '/api/placeholder/300/200',
            bankAccount: '0987654321 (Mandiri)',
            accountHolder: 'Charlie Wilson'
          },
          {
            id: 3,
            userId: 'USR006',
            userName: 'Diana Prince',
            amount: 5000000,
            method: 'e_wallet',
            status: 'verified',
            date: '2023-10-15 16:45:12',
            reference: 'PAY20231015001',
            investmentId: 'INV005',
            proofImage: '/api/placeholder/300/200',
            bankAccount: 'N/A (Gopay)',
            accountHolder: 'Diana Prince'
          },
          {
            id: 4,
            userId: 'USR007',
            userName: 'Bruce Wayne',
            amount: 10000000,
            method: 'bank_transfer',
            status: 'rejected',
            date: '2023-10-14 11:30:45',
            reference: 'PAY20231014001',
            investmentId: null,
            proofImage: '/api/placeholder/300/200',
            bankAccount: '1122334455 (BNI)',
            accountHolder: 'Bruce Wayne'
          }
        ];

        setTransactions(mockTransactions);
        setPayments(mockPayments);
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

  const handlePaymentFilterChange = (field, value) => {
    setPaymentFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleVerifyPayment = (paymentId, status) => {
    setPayments(payments.map(payment => 
      payment.id === paymentId ? { ...payment, status } : payment
    ));
  };

  const handleExportCSV = () => {
    // In a real app, this would generate and download a CSV file
    alert('Exporting CSV functionality would be implemented here');
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filters.type !== 'all' && transaction.type !== filters.type) return false;
    if (filters.status !== 'all' && transaction.status !== filters.status) return false;
    if (filters.dateFrom && new Date(transaction.date) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(transaction.date) > new Date(filters.dateTo)) return false;
    if (filters.search && !(
      transaction.userName.toLowerCase().includes(filters.search.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(filters.search.toLowerCase()) ||
      transaction.userId.toLowerCase().includes(filters.search.toLowerCase())
    )) return false;
    return true;
  });

  const filteredPayments = payments.filter(payment => {
    if (paymentFilters.status !== 'all' && payment.status !== paymentFilters.status) return false;
    if (paymentFilters.method !== 'all' && payment.method !== paymentFilters.method) return false;
    if (paymentFilters.dateFrom && new Date(payment.date) < new Date(paymentFilters.dateFrom)) return false;
    if (paymentFilters.dateTo && new Date(payment.date) > new Date(paymentFilters.dateTo)) return false;
    return true;
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading transactions data...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout title="Transactions & Payments">
      <Head>
        <title>Stoneform Capital | Transactions & Payments</title>
      </Head>

      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
            activeTab === 'transactions'
              ? 'text-purple-400 border-b-2 border-purple-400 bg-white/5'
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('transactions')}
        >
          <Icon icon="mdi:swap-horizontal" className="inline mr-2 w-5 h-5" />
          Transactions
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
            activeTab === 'payments'
              ? 'text-purple-400 border-b-2 border-purple-400 bg-white/5'
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('payments')}
        >
          <Icon icon="mdi:cash-check" className="inline mr-2 w-5 h-5" />
          Payment Verification
        </button>
      </div>

      {/* Transactions Section */}
      {activeTab === 'transactions' && (
        <div className="space-y-6">
          {/* Filter Section */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Icon icon="mdi:filter" className="text-purple-400" />
              Filter Transactions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Type</label>
                <select 
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Types</option>
                  <option value="investment">Investment</option>
                  <option value="withdrawal">Withdrawal</option>
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
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
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
              <div>
                <label className="block text-sm text-gray-400 mb-2">Search</label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="User, Reference..."
                />
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <Icon icon="mdi:swap-horizontal" className="text-blue-400" />
                Transactions ({filteredTransactions.length})
              </h2>
              <button 
                onClick={handleExportCSV}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl flex items-center gap-2"
              >
                <Icon icon="mdi:file-export" className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">User</th>
                    <th className="py-3 px-4 text-left">Type</th>
                    <th className="py-3 px-4 text-left">Amount</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Reference</th>
                    <th className="py-3 px-4 text-left">Investment ID</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map(transaction => (
                    <tr key={transaction.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-4 px-4">
                        {new Date(transaction.date).toLocaleDateString('id-ID')}
                        <br />
                        <span className="text-gray-400 text-xs">
                          {new Date(transaction.date).toLocaleTimeString('id-ID')}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium">{transaction.userName}</p>
                          <p className="text-gray-400 text-xs">{transaction.userId}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          transaction.type === 'investment' 
                            ? 'bg-blue-500/20 text-blue-400' 
                            : 'bg-purple-500/20 text-purple-400'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-medium">
                        Rp {transaction.amount.toLocaleString('id-ID')}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          transaction.status === 'completed' 
                            ? 'bg-green-500/20 text-green-400' 
                            : transaction.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <code className="text-xs bg-black/20 px-2 py-1 rounded">
                          {transaction.reference}
                        </code>
                      </td>
                      <td className="py-4 px-4">
                        {transaction.investmentId ? (
                          <a className="text-blue-400 hover:text-blue-300 text-sm" href="#">
                            {transaction.investmentId}
                          </a>
                        ) : (
                          <span className="text-gray-500 text-sm">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <p className="text-gray-400 text-sm">
                Showing 1 to {filteredTransactions.length} of {filteredTransactions.length} results
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

      {/* Payments Section */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          {/* Filter Section */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Icon icon="mdi:filter" className="text-purple-400" />
              Filter Payments
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Status</label>
                <select 
                  value={paymentFilters.status}
                  onChange={(e) => handlePaymentFilterChange('status', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Method</label>
                <select 
                  value={paymentFilters.method}
                  onChange={(e) => handlePaymentFilterChange('method', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Methods</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="e_wallet">E-Wallet</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">From Date</label>
                <input
                  type="date"
                  value={paymentFilters.dateFrom}
                  onChange={(e) => handlePaymentFilterChange('dateFrom', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">To Date</label>
                <input
                  type="date"
                  value={paymentFilters.dateTo}
                  onChange={(e) => handlePaymentFilterChange('dateTo', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Icon icon="mdi:cash-check" className="text-blue-400" />
              Payment Verification ({filteredPayments.length})
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">User</th>
                    <th className="py-3 px-4 text-left">Amount</th>
                    <th className="py-3 px-4 text-left">Method</th>
                    <th className="py-3 px-4 text-left">Bank Account</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map(payment => (
                    <tr key={payment.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-4 px-4">
                        {new Date(payment.date).toLocaleDateString('id-ID')}
                        <br />
                        <span className="text-gray-400 text-xs">
                          {new Date(payment.date).toLocaleTimeString('id-ID')}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium">{payment.userName}</p>
                          <p className="text-gray-400 text-xs">{payment.userId}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium">
                        Rp {payment.amount.toLocaleString('id-ID')}
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">
                          {payment.method.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-sm">{payment.bankAccount}</p>
                          <p className="text-gray-400 text-xs">{payment.accountHolder}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          payment.status === 'verified' 
                            ? 'bg-green-500/20 text-green-400' 
                            : payment.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          {payment.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => handleVerifyPayment(payment.id, 'verified')}
                                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm flex items-center gap-1"
                              >
                                <Icon icon="mdi:check" className="w-4 h-4" />
                                Verify
                              </button>
                              <button 
                                onClick={() => handleVerifyPayment(payment.id, 'rejected')}
                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm flex items-center gap-1"
                              >
                                <Icon icon="mdi:close" className="w-4 h-4" />
                                Reject
                              </button>
                            </>
                          )}
                          <button className="p-1 text-blue-400 hover:text-blue-300" title="View Proof">
                            <Icon icon="mdi:image" className="w-5 h-5" />
                          </button>
                          {payment.investmentId && (
                            <a 
                              href="#" 
                              className="p-1 text-purple-400 hover:text-purple-300" 
                              title="View Investment"
                            >
                              <Icon icon="mdi:chart-box" className="w-5 h-5" />
                            </a>
                          )}
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
                Showing 1 to {filteredPayments.length} of {filteredPayments.length} results
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