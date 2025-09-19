// pages/admin/withdrawals.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Icon } from '@iconify/react';
import AdminLayout from '../../components/admin/Layout';
import useAdminAuth from '../../lib/auth/useAdminAuth';

export default function WithdrawalManagement() {
  const { loading: authLoading } = useAdminAuth();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    if (authLoading) return;
    
    // Mock data for demonstration
    const mockWithdrawals = [
      {
        id: 1,
        userId: 'USR001',
        user: 'John Doe',
        userEmail: 'john@example.com',
        amount: 2500000,
        charge: 2500,
        finalAmount: 2497500,
        bankName: 'BCA',
        accountNumber: '1234567890',
        accountName: 'John Doe',
        status: 'pending',
        createdAt: '2023-10-15 14:30:22',
        userBalance: 5000000,
        transactionId: 'TXN001'
      },
      {
        id: 2,
        userId: 'USR002',
        user: 'Jane Smith',
        userEmail: 'jane@example.com',
        amount: 1500000,
        charge: 1500,
        finalAmount: 1498500,
        bankName: 'BRI',
        accountNumber: '0987654321',
        accountName: 'Jane Smith',
        status: 'pending',
        createdAt: '2023-10-15 13:15:44',
        userBalance: 3000000,
        transactionId: 'TXN002'
      },
      {
        id: 3,
        userId: 'USR003',
        user: 'Robert Johnson',
        userEmail: 'robert@example.com',
        amount: 5000000,
        charge: 5000,
        finalAmount: 4995000,
        bankName: 'Mandiri',
        accountNumber: '5432167890',
        accountName: 'Robert Johnson',
        status: 'approved',
        approvedAt: '2023-10-14 15:30:00',
        createdAt: '2023-10-14 10:22:11',
        userBalance: 10000000,
        transactionId: 'TXN003'
      },
      {
        id: 4,
        userId: 'USR004',
        user: 'Alice Brown',
        userEmail: 'alice@example.com',
        amount: 1000000,
        charge: 1000,
        finalAmount: 999000,
        bankName: 'BNI',
        accountNumber: '1122334455',
        accountName: 'Alice Brown',
        status: 'rejected',
        rejectedAt: '2023-10-13 16:45:00',
        rejectionReason: 'Insufficient documentation',
        createdAt: '2023-10-13 09:10:33',
        userBalance: 2000000,
        transactionId: 'TXN004'
      }
    ];
    
    setWithdrawals(mockWithdrawals);
    setLoading(false);
  }, [authLoading]);

  const handleAction = (withdrawal, type) => {
    setSelectedWithdrawal(withdrawal);
    setActionType(type);
    setRejectionReason('');
    setShowModal(true);
  };

  const confirmAction = async () => {
    try {
      // In a real app, this would call an API to update the withdrawal status
      // and handle the balance adjustment
      if (actionType === 'approve') {
        // Approve withdrawal: deduct amount from user balance and create transaction
        const updatedWithdrawals = withdrawals.map(w => 
          w.id === selectedWithdrawal.id 
            ? { 
                ...w, 
                status: 'approved',
                approvedAt: new Date().toISOString(),
                userBalance: w.userBalance - w.amount
              }
            : w
        );
        setWithdrawals(updatedWithdrawals);
        
        console.log('Withdrawal approved:', selectedWithdrawal.id);
        console.log('User balance deducted:', selectedWithdrawal.amount);
        console.log('Transaction created for withdrawal');
        
      } else if (actionType === 'reject') {
        // Reject withdrawal: optionally return balance if it was already deducted
        const updatedWithdrawals = withdrawals.map(w => 
          w.id === selectedWithdrawal.id 
            ? { 
                ...w, 
                status: 'rejected',
                rejectedAt: new Date().toISOString(),
                rejectionReason: rejectionReason || 'Withdrawal rejected by admin'
              }
            : w
        );
        setWithdrawals(updatedWithdrawals);
        
        console.log('Withdrawal rejected:', selectedWithdrawal.id);
        console.log('Rejection reason:', rejectionReason);
      }
      
      setShowModal(false);
      
    } catch (error) {
      console.error('Failed to process withdrawal:', error);
    }
  };

  const generateDailyReport = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayWithdrawals = withdrawals.filter(w => 
      w.createdAt.startsWith(today)
    );
    
    const reportData = {
      date: today,
      totalWithdrawals: todayWithdrawals.length,
      totalAmount: todayWithdrawals.reduce((sum, w) => sum + w.amount, 0),
      totalCharges: todayWithdrawals.reduce((sum, w) => sum + w.charge, 0),
      pending: todayWithdrawals.filter(w => w.status === 'pending').length,
      approved: todayWithdrawals.filter(w => w.status === 'approved').length,
      rejected: todayWithdrawals.filter(w => w.status === 'rejected').length
    };
    
    // In a real app, this would generate and download a CSV/PDF report
    console.log('Daily Report:', reportData);
    alert(`Daily report generated for ${today}\nTotal Withdrawals: ${reportData.totalWithdrawals}\nTotal Amount: Rp ${reportData.totalAmount.toLocaleString('id-ID')}`);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const filteredWithdrawals = withdrawals.filter(withdrawal => {
    if (filters.status !== 'all' && withdrawal.status !== filters.status) return false;
    if (filters.dateFrom && new Date(withdrawal.createdAt) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(withdrawal.createdAt) > new Date(filters.dateTo)) return false;
    return true;
  });

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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
      approved: 'bg-green-500/20 text-green-400 border border-green-500/30',
      rejected: 'bg-red-500/20 text-red-400 border border-red-500/30'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading withdrawals...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout title="Withdrawal Management">
      <Head>
        <title>Stoneform Capital | Withdrawal Management</title>
      </Head>

      {/* Action Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 max-w-md w-full">
            <h3 className="text-white font-semibold text-lg mb-4">
              {actionType === 'approve' ? 'Approve' : 'Reject'} Withdrawal
            </h3>
            
            <div className="bg-black/20 p-4 rounded-xl mb-4">
              <p className="text-white font-semibold">{selectedWithdrawal?.user}</p>
              <p className="text-gray-400 text-sm">{selectedWithdrawal?.userEmail}</p>
              <p className="text-white mt-2">Amount: {formatCurrency(selectedWithdrawal?.amount)}</p>
              <p className="text-gray-400 text-sm">Charge: {formatCurrency(selectedWithdrawal?.charge)}</p>
              <p className="text-green-400 font-semibold">Final: {formatCurrency(selectedWithdrawal?.finalAmount)}</p>
              <p className="text-gray-400 text-sm mt-2">
                Bank: {selectedWithdrawal?.bankName} - {selectedWithdrawal?.accountNumber}
              </p>
            </div>

            {actionType === 'reject' && (
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">Rejection Reason</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter reason for rejection..."
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[80px]"
                  required
                />
              </div>
            )}

            {actionType === 'approve' && (
              <p className="text-yellow-400 text-sm mb-4">
                This will deduct {formatCurrency(selectedWithdrawal?.amount)} from user's balance and process the payment.
              </p>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                disabled={actionType === 'reject' && !rejectionReason}
                className={`px-4 py-2 rounded-xl ${
                  actionType === 'approve' 
                    ? 'bg-green-600 hover:bg-green-700 disabled:bg-green-600/50' 
                    : 'bg-red-600 hover:bg-red-700 disabled:bg-red-600/50'
                } text-white transition-colors disabled:cursor-not-allowed`}
              >
                Confirm {actionType === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Section */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-6">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Icon icon="mdi:filter" className="text-purple-400" />
          Filter Withdrawals
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Status</label>
            <select 
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
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

      {/* Withdrawals Table */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white font-semibold text-xl flex items-center gap-2">
            <Icon icon="mdi:cash-remove" className="text-blue-400" />
            Withdrawal Requests ({filteredWithdrawals.length})
          </h2>
          <button 
            onClick={generateDailyReport}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <Icon icon="mdi:file-download" className="w-5 h-5" />
            Generate Daily Report
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-3 px-4 text-left text-gray-400 text-sm font-medium">ID</th>
                <th className="py-3 px-4 text-left text-gray-400 text-sm font-medium">User</th>
                <th className="py-3 px-4 text-left text-gray-400 text-sm font-medium">Amount Details</th>
                <th className="py-3 px-4 text-left text-gray-400 text-sm font-medium">Bank Details</th>
                <th className="py-3 px-4 text-left text-gray-400 text-sm font-medium">Status</th>
                <th className="py-3 px-4 text-left text-gray-400 text-sm font-medium">Date</th>
                <th className="py-3 px-4 text-left text-gray-400 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWithdrawals.map((withdrawal) => (
                <tr key={withdrawal.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4">
                    <div className="text-white text-sm">#{withdrawal.id}</div>
                    <div className="text-gray-400 text-xs">{withdrawal.transactionId}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-white">{withdrawal.user}</div>
                    <div className="text-gray-400 text-xs">{withdrawal.userEmail}</div>
                    <div className="text-blue-400 text-xs">Balance: {formatCurrency(withdrawal.userBalance)}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-white">{formatCurrency(withdrawal.amount)}</div>
                    <div className="text-gray-400 text-xs">Charge: {formatCurrency(withdrawal.charge)}</div>
                    <div className="text-green-400 text-sm font-semibold">
                      Final: {formatCurrency(withdrawal.finalAmount)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-white">{withdrawal.bankName}</div>
                    <div className="text-gray-400 text-sm">{withdrawal.accountNumber}</div>
                    <div className="text-gray-400 text-xs">{withdrawal.accountName}</div>
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(withdrawal.status)}</td>
                  <td className="py-3 px-4">
                    <div className="text-gray-400 text-sm">{formatDate(withdrawal.createdAt)}</div>
                    {withdrawal.approvedAt && (
                      <div className="text-green-400 text-xs">Approved: {formatDate(withdrawal.approvedAt)}</div>
                    )}
                    {withdrawal.rejectedAt && (
                      <div className="text-red-400 text-xs">Rejected: {formatDate(withdrawal.rejectedAt)}</div>
                    )}
                    {withdrawal.rejectionReason && (
                      <div className="text-red-400 text-xs mt-1">Reason: {withdrawal.rejectionReason}</div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {withdrawal.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(withdrawal, 'approve')}
                          className="p-2 bg-green-600/20 hover:bg-green-600/30 rounded-lg text-green-400 transition-colors"
                          title="Approve Withdrawal"
                        >
                          <Icon icon="mdi:check" className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleAction(withdrawal, 'reject')}
                          className="p-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg text-red-400 transition-colors"
                          title="Reject Withdrawal"
                        >
                          <Icon icon="mdi:close" className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    {withdrawal.status !== 'pending' && (
                      <button
                        className="p-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg text-blue-400 transition-colors"
                        title="View Details"
                      >
                        <Icon icon="mdi:eye" className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{withdrawals.length}</div>
            <div className="text-gray-400 text-sm">Total Requests</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {withdrawals.filter(w => w.status === 'pending').length}
            </div>
            <div className="text-gray-400 text-sm">Pending</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {withdrawals.filter(w => w.status === 'approved').length}
            </div>
            <div className="text-gray-400 text-sm">Approved</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-400">
              {withdrawals.filter(w => w.status === 'rejected').length}
            </div>
            <div className="text-gray-400 text-sm">Rejected</div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}