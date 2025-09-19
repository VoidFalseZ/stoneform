// pages/admin/investments.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Icon } from '@iconify/react';
import AdminLayout from '../../components/admin/Layout';
import useAdminAuth from '../../lib/auth/useAdminAuth';

export default function InvestmentManagement() {
  const { loading: authLoading } = useAdminAuth();
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [actionReason, setActionReason] = useState('');
  const [filters, setFilters] = useState({
    user: '',
    product: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    if (authLoading) return;
    
    // Mock data for demonstration
    const mockInvestments = [
      {
        id: 'INV001',
        userId: 'USR001',
        userName: 'John Doe',
        userEmail: 'john@example.com',
        product: 'Gold Package',
        productId: 'GOLD-001',
        amount: 5000000,
        duration: 12,
        expectedReturn: 15.5,
        status: 'pending',
        createdAt: '2023-10-15 14:30:22',
        startDate: null,
        endDate: null,
        currentValue: 5000000,
        transactions: ['TXN001'],
        notes: 'New investment request'
      },
      {
        id: 'INV002',
        userId: 'USR002',
        userName: 'Jane Smith',
        userEmail: 'jane@example.com',
        product: 'Silver Package',
        productId: 'SILVER-001',
        amount: 2500000,
        duration: 6,
        expectedReturn: 9.2,
        status: 'active',
        createdAt: '2023-10-10 09:15:44',
        startDate: '2023-10-11',
        endDate: '2024-04-11',
        currentValue: 2615000,
        transactions: ['TXN002', 'TXN003'],
        notes: 'Regular monthly investor'
      },
      {
        id: 'INV003',
        userId: 'USR003',
        userName: 'Robert Johnson',
        userEmail: 'robert@example.com',
        product: 'Platinum Package',
        productId: 'PLATINUM-001',
        amount: 10000000,
        duration: 24,
        expectedReturn: 22.8,
        status: 'completed',
        createdAt: '2023-05-15 11:22:33',
        startDate: '2023-05-16',
        endDate: '2025-05-16',
        currentValue: 12280000,
        transactions: ['TXN004', 'TXN005', 'TXN006'],
        notes: 'Long-term investment completed successfully'
      },
      {
        id: 'INV004',
        userId: 'USR004',
        userName: 'Alice Brown',
        userEmail: 'alice@example.com',
        product: 'Gold Package',
        productId: 'GOLD-001',
        amount: 3000000,
        duration: 12,
        expectedReturn: 15.5,
        status: 'suspended',
        createdAt: '2023-09-20 16:45:18',
        startDate: '2023-09-21',
        endDate: '2024-09-21',
        currentValue: 3100000,
        transactions: ['TXN007'],
        notes: 'Temporarily suspended due to account review',
        suspensionReason: 'Account verification required'
      },
      {
        id: 'INV005',
        userId: 'USR005',
        userName: 'Charlie Wilson',
        userEmail: 'charlie@example.com',
        product: 'Bronze Package',
        productId: 'BRONZE-001',
        amount: 1000000,
        duration: 3,
        expectedReturn: 5.5,
        status: 'rejected',
        createdAt: '2023-10-14 13:20:55',
        startDate: null,
        endDate: null,
        currentValue: 1000000,
        transactions: [],
        notes: 'Insufficient documentation',
        rejectionReason: 'Missing identification documents'
      },
      {
        id: 'INV006',
        userId: 'USR001',
        userName: 'John Doe',
        userEmail: 'john@example.com',
        product: 'Silver Package',
        productId: 'SILVER-001',
        amount: 2000000,
        duration: 6,
        expectedReturn: 9.2,
        status: 'cancelled',
        createdAt: '2023-10-12 10:30:44',
        startDate: null,
        endDate: null,
        currentValue: 2000000,
        transactions: ['TXN008'],
        notes: 'User requested cancellation',
        cancellationReason: 'Changed investment strategy'
      }
    ];
    
    setInvestments(mockInvestments);
    setLoading(false);
  }, [authLoading]);

  const handleAction = (investment, type) => {
    setSelectedInvestment(investment);
    setActionType(type);
    setActionReason('');
    setShowModal(true);
  };

  const confirmAction = async () => {
    try {
      // In a real app, this would call an API to update the investment status
      let updatedInvestment = { ...selectedInvestment };
      
      switch (actionType) {
        case 'approve':
          updatedInvestment.status = 'active';
          updatedInvestment.startDate = new Date().toISOString().split('T')[0];
          updatedInvestment.endDate = calculateEndDate(selectedInvestment.duration);
          break;
        case 'reject':
          updatedInvestment.status = 'rejected';
          updatedInvestment.rejectionReason = actionReason;
          break;
        case 'suspend':
          updatedInvestment.status = 'suspended';
          updatedInvestment.suspensionReason = actionReason;
          break;
        case 'cancel':
          updatedInvestment.status = 'cancelled';
          updatedInvestment.cancellationReason = actionReason;
          break;
        case 'reactivate':
          updatedInvestment.status = 'active';
          updatedInvestment.suspensionReason = '';
          break;
      }

      const updatedInvestments = investments.map(inv => 
        inv.id === selectedInvestment.id ? updatedInvestment : inv
      );
      
      setInvestments(updatedInvestments);
      setShowModal(false);
      
      console.log(`Investment ${actionType}d:`, selectedInvestment.id);
      
    } catch (error) {
      console.error('Failed to process investment action:', error);
    }
  };

  const calculateEndDate = (duration) => {
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + duration);
    return endDate.toISOString().split('T')[0];
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const filteredInvestments = investments.filter(investment => {
    if (filters.user && !investment.userName.toLowerCase().includes(filters.user.toLowerCase())) return false;
    if (filters.product !== 'all' && investment.product !== filters.product) return false;
    if (filters.status !== 'all' && investment.status !== filters.status) return false;
    if (filters.dateFrom && new Date(investment.createdAt) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(investment.createdAt) > new Date(filters.dateTo)) return false;
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
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
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
      active: 'bg-green-500/20 text-green-400 border border-green-500/30',
      completed: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      suspended: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
      rejected: 'bg-red-500/20 text-red-400 border border-red-500/30',
      cancelled: 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getAvailableActions = (investment) => {
    const actions = {
      pending: ['approve', 'reject'],
      active: ['suspend', 'cancel'],
      suspended: ['reactivate', 'cancel'],
      rejected: [],
      completed: [],
      cancelled: []
    };
    
    return actions[investment.status] || [];
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading investments...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout title="Investment Management">
      <Head>
        <title>Stoneform Capital | Investment Management</title>
      </Head>

      {/* Action Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 max-w-md w-full">
            <h3 className="text-white font-semibold text-lg mb-4">
              {actionType.charAt(0).toUpperCase() + actionType.slice(1)} Investment
            </h3>
            
            <div className="bg-black/20 p-4 rounded-xl mb-4">
              <p className="text-white font-semibold">{selectedInvestment?.userName}</p>
              <p className="text-gray-400 text-sm">{selectedInvestment?.userEmail}</p>
              <p className="text-white mt-2">Investment: {selectedInvestment?.product}</p>
              <p className="text-white">Amount: {formatCurrency(selectedInvestment?.amount)}</p>
              <p className="text-gray-400 text-sm">ID: {selectedInvestment?.id}</p>
            </div>

            {(actionType === 'reject' || actionType === 'suspend' || actionType === 'cancel') && (
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">
                  Reason for {actionType}
                  {actionType === 'reject' && 'ion'}
                  {actionType === 'suspend' && 'ion'}
                  {actionType === 'cancel' && 'lation'}
                </label>
                <textarea
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder={`Enter reason for ${actionType}...`}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[80px]"
                  required
                />
              </div>
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
                disabled={(actionType === 'reject' || actionType === 'suspend' || actionType === 'cancel') && !actionReason}
                className={`px-4 py-2 rounded-xl ${
                  actionType === 'approve' || actionType === 'reactivate' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : actionType === 'reject' || actionType === 'cancel'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-orange-600 hover:bg-orange-700'
                } text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Confirm {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Section */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-6">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Icon icon="mdi:filter" className="text-purple-400" />
          Filter Investments
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">User Search</label>
            <input
              type="text"
              value={filters.user}
              onChange={(e) => handleFilterChange('user', e.target.value)}
              placeholder="Search by user name..."
              className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Product</label>
            <select 
              value={filters.product}
              onChange={(e) => handleFilterChange('product', e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Products</option>
              <option value="Gold Package">Gold Package</option>
              <option value="Silver Package">Silver Package</option>
              <option value="Platinum Package">Platinum Package</option>
              <option value="Bronze Package">Bronze Package</option>
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
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="suspended">Suspended</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Date Range</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-2 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                placeholder="From"
              />
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-2 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                placeholder="To"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Investments Table */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white font-semibold text-xl flex items-center gap-2">
            <Icon icon="mdi:chart-box" className="text-blue-400" />
            Investment Portfolio ({filteredInvestments.length})
          </h2>
          <div className="flex gap-2">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl flex items-center gap-2">
              <Icon icon="mdi:file-export" className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-3 px-4 text-left text-gray-400 text-sm font-medium">Investment ID</th>
                <th className="py-3 px-4 text-left text-gray-400 text-sm font-medium">User</th>
                <th className="py-3 px-4 text-left text-gray-400 text-sm font-medium">Package</th>
                <th className="py-3 px-4 text-left text-gray-400 text-sm font-medium">Amount</th>
                <th className="py-3 px-4 text-left text-gray-400 text-sm font-medium">Duration</th>
                <th className="py-3 px-4 text-left text-gray-400 text-sm font-medium">Status</th>
                <th className="py-3 px-4 text-left text-gray-400 text-sm font-medium">Date</th>
                <th className="py-3 px-4 text-left text-gray-400 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvestments.map((investment) => (
                <tr key={investment.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4">
                    <div className="text-white text-sm font-mono">{investment.id}</div>
                    <div className="text-gray-400 text-xs">{investment.productId}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-white">{investment.userName}</div>
                    <div className="text-gray-400 text-xs">{investment.userEmail}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-white">{investment.product}</div>
                    <div className="text-gray-400 text-xs">{investment.duration} months</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-white">{formatCurrency(investment.amount)}</div>
                    <div className="text-green-400 text-xs">
                      {investment.expectedReturn}% return
                    </div>
                    {investment.currentValue && (
                      <div className="text-blue-400 text-xs">
                        Current: {formatCurrency(investment.currentValue)}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-white">{investment.duration} months</div>
                    {investment.startDate && (
                      <div className="text-gray-400 text-xs">
                        Start: {formatDate(investment.startDate)}
                      </div>
                    )}
                    {investment.endDate && (
                      <div className="text-gray-400 text-xs">
                        End: {formatDate(investment.endDate)}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(investment.status)}</td>
                  <td className="py-3 px-4">
                    <div className="text-gray-400 text-sm">{formatDateTime(investment.createdAt)}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1 flex-wrap">
                      <button
                        className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                        title="View Details"
                      >
                        <Icon icon="mdi:eye" className="w-4 h-4" />
                      </button>
                      {getAvailableActions(investment).map(action => (
                        <button
                          key={action}
                          onClick={() => handleAction(investment, action)}
                          className={`p-1 ${
                            action === 'approve' || action === 'reactivate' 
                              ? 'text-green-400 hover:text-green-300' 
                              : action === 'reject' || action === 'cancel'
                              ? 'text-red-400 hover:text-red-300'
                              : 'text-orange-400 hover:text-orange-300'
                          } transition-colors`}
                          title={action.charAt(0).toUpperCase() + action.slice(1)}
                        >
                          <Icon 
                            icon={
                              action === 'approve' ? 'mdi:check' :
                              action === 'reject' ? 'mdi:close' :
                              action === 'suspend' ? 'mdi:pause' :
                              action === 'reactivate' ? 'mdi:play' :
                              'mdi:cancel'
                            } 
                            className="w-4 h-4" 
                          />
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{investments.length}</div>
            <div className="text-gray-400 text-sm">Total</div>
          </div>
          <div className="bg-yellow-500/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {investments.filter(i => i.status === 'pending').length}
            </div>
            <div className="text-gray-400 text-sm">Pending</div>
          </div>
          <div className="bg-green-500/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {investments.filter(i => i.status === 'active').length}
            </div>
            <div className="text-gray-400 text-sm">Active</div>
          </div>
          <div className="bg-blue-500/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {investments.filter(i => i.status === 'completed').length}
            </div>
            <div className="text-gray-400 text-sm">Completed</div>
          </div>
          <div className="bg-orange-500/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">
              {investments.filter(i => i.status === 'suspended').length}
            </div>
            <div className="text-gray-400 text-sm">Suspended</div>
          </div>
          <div className="bg-red-500/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-400">
              {investments.filter(i => i.status === 'rejected' || i.status === 'cancelled').length}
            </div>
            <div className="text-gray-400 text-sm">Rejected/Cancelled</div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}