// pages/admin/spin-prizes.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Icon } from '@iconify/react';
import AdminLayout from '../../components/admin/Layout';
import useAdminAuth from '../../lib/auth/useAdminAuth';

export default function SpinPrizes() {
  const { loading: authLoading } = useAdminAuth();
  const [prizes, setPrizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPrize, setEditingPrize] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    chanceWeight: '',
    status: 'active',
    type: 'cash'
  });

  useEffect(() => {
    if (authLoading) return;
    loadPrizes();
  }, [authLoading]);

  const loadPrizes = async () => {
    try {
      // Mock data - replace with actual API call
      const mockPrizes = [
        {
          id: 1,
          name: 'Grand Prize',
          amount: 1000000,
          chanceWeight: 1,
          chancePercentage: 0.5,
          status: 'active',
          type: 'cash',
          totalWins: 2,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-20'
        },
        {
          id: 2,
          name: 'Major Prize',
          amount: 500000,
          chanceWeight: 3,
          chancePercentage: 1.5,
          status: 'active',
          type: 'cash',
          totalWins: 8,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-18'
        },
        {
          id: 3,
          name: 'Medium Prize',
          amount: 100000,
          chanceWeight: 15,
          chancePercentage: 7.5,
          status: 'active',
          type: 'cash',
          totalWins: 45,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-19'
        },
        {
          id: 4,
          name: 'Small Prize',
          amount: 25000,
          chanceWeight: 50,
          chancePercentage: 25.0,
          status: 'active',
          type: 'cash',
          totalWins: 156,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-21'
        },
        {
          id: 5,
          name: 'Mini Prize',
          amount: 5000,
          chanceWeight: 80,
          chancePercentage: 40.0,
          status: 'active',
          type: 'cash',
          totalWins: 243,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-22'
        },
        {
          id: 6,
          name: 'No Prize',
          amount: 0,
          chanceWeight: 51,
          chancePercentage: 25.5,
          status: 'active',
          type: 'none',
          totalWins: 189,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-21'
        }
      ];
      setPrizes(mockPrizes);
    } catch (error) {
      console.error('Failed to load prizes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPrize = async (e) => {
    e.preventDefault();
    try {
      // Mock API call
      const newPrize = {
        id: Date.now(),
        ...formData,
        amount: parseInt(formData.amount),
        chanceWeight: parseInt(formData.chanceWeight),
        chancePercentage: 0, // Will be calculated
        totalWins: 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      
      setPrizes([...prizes, newPrize]);
      setShowAddModal(false);
      setFormData({ name: '', amount: '', chanceWeight: '', status: 'active', type: 'cash' });
      
      // Recalculate percentages
      recalculatePercentages([...prizes, newPrize]);
    } catch (error) {
      console.error('Failed to add prize:', error);
    }
  };

  const handleEditPrize = async (e) => {
    e.preventDefault();
    try {
      const updatedPrizes = prizes.map(prize =>
        prize.id === editingPrize.id
          ? {
              ...prize,
              ...formData,
              amount: parseInt(formData.amount),
              chanceWeight: parseInt(formData.chanceWeight),
              updatedAt: new Date().toISOString().split('T')[0]
            }
          : prize
      );
      
      setPrizes(updatedPrizes);
      setShowEditModal(false);
      setEditingPrize(null);
      setFormData({ name: '', amount: '', chanceWeight: '', status: 'active', type: 'cash' });
      
      // Recalculate percentages
      recalculatePercentages(updatedPrizes);
    } catch (error) {
      console.error('Failed to update prize:', error);
    }
  };

  const handleDeletePrize = async (prizeId) => {
    if (!confirm('Are you sure you want to delete this prize?')) return;
    
    try {
      const updatedPrizes = prizes.filter(prize => prize.id !== prizeId);
      setPrizes(updatedPrizes);
      recalculatePercentages(updatedPrizes);
    } catch (error) {
      console.error('Failed to delete prize:', error);
    }
  };

  const recalculatePercentages = (prizeList) => {
    const totalWeight = prizeList.reduce((sum, prize) => sum + prize.chanceWeight, 0);
    const updatedPrizes = prizeList.map(prize => ({
      ...prize,
      chancePercentage: totalWeight > 0 ? (prize.chanceWeight / totalWeight) * 100 : 0
    }));
    setPrizes(updatedPrizes);
  };

  const openEditModal = (prize) => {
    setEditingPrize(prize);
    setFormData({
      name: prize.name,
      amount: prize.amount.toString(),
      chanceWeight: prize.chanceWeight.toString(),
      status: prize.status,
      type: prize.type
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({ name: '', amount: '', chanceWeight: '', status: 'active', type: 'cash' });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading spin prizes...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout title="Spin & Prizes Management">
      <Head>
        <title>Spin Prizes | Stoneform Capital Admin</title>
      </Head>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Spin Prizes Management</h1>
          <p className="text-gray-400">Manage prize amounts, chance weights, and status</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors"
        >
          <Icon icon="mdi:plus" className="w-5 h-5" />
          Add New Prize
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Total Prizes</h3>
            <Icon icon="mdi:gift" className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">{prizes.length}</div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Active Prizes</h3>
            <Icon icon="mdi:check-circle" className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {prizes.filter(p => p.status === 'active').length}
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Total Wins</h3>
            <Icon icon="mdi:trophy" className="w-6 h-6 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {prizes.reduce((sum, prize) => sum + prize.totalWins, 0)}
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Prize Pool</h3>
            <Icon icon="mdi:cash-multiple" className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            Rp {prizes.reduce((sum, prize) => sum + (prize.amount * prize.totalWins), 0).toLocaleString('id-ID')}
          </div>
        </div>
      </div>

      {/* Prizes Table */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <Icon icon="mdi:gift-outline" className="text-purple-400" />
            Prize Configuration
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/20">
              <tr>
                <th className="text-left text-gray-400 font-medium p-4">Prize Name</th>
                <th className="text-left text-gray-400 font-medium p-4">Amount</th>
                <th className="text-left text-gray-400 font-medium p-4">Type</th>
                <th className="text-left text-gray-400 font-medium p-4">Weight</th>
                <th className="text-left text-gray-400 font-medium p-4">Chance %</th>
                <th className="text-left text-gray-400 font-medium p-4">Total Wins</th>
                <th className="text-left text-gray-400 font-medium p-4">Status</th>
                <th className="text-left text-gray-400 font-medium p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {prizes.map((prize) => (
                <tr key={prize.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="text-white font-medium">{prize.name}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-white">
                      {prize.type === 'none' ? '-' : `Rp ${prize.amount.toLocaleString('id-ID')}`}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      prize.type === 'cash' ? 'bg-green-500/20 text-green-400' :
                      prize.type === 'bonus' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {prize.type === 'none' ? 'No Prize' : prize.type.charAt(0).toUpperCase() + prize.type.slice(1)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-white">{prize.chanceWeight}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-white font-medium">{prize.chancePercentage.toFixed(1)}%</div>
                  </td>
                  <td className="p-4">
                    <div className="text-white">{prize.totalWins}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      prize.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {prize.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(prize)}
                        className="p-2 text-blue-400 hover:bg-blue-400/20 rounded-lg transition-colors"
                        title="Edit Prize"
                      >
                        <Icon icon="mdi:pencil" className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePrize(prize.id)}
                        className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                        title="Delete Prize"
                      >
                        <Icon icon="mdi:delete" className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Prize Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-xl font-semibold">Add New Prize</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Icon icon="mdi:close" className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddPrize} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Prize Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Prize Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="cash">Cash Prize</option>
                  <option value="bonus">Bonus Points</option>
                  <option value="none">No Prize</option>
                </select>
              </div>
              
              {formData.type !== 'none' && (
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Amount (Rp)
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="0"
                    required={formData.type !== 'none'}
                  />
                </div>
              )}
              
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Chance Weight</label>
                <input
                  type="number"
                  value={formData.chanceWeight}
                  onChange={(e) => setFormData({ ...formData, chanceWeight: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  min="1"
                  required
                />
                <p className="text-gray-500 text-xs mt-1">Higher weight = higher chance of winning</p>
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-medium transition-colors"
                >
                  Add Prize
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Prize Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-xl font-semibold">Edit Prize</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Icon icon="mdi:close" className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleEditPrize} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Prize Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Prize Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="cash">Cash Prize</option>
                  <option value="bonus">Bonus Points</option>
                  <option value="none">No Prize</option>
                </select>
              </div>
              
              {formData.type !== 'none' && (
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Amount (Rp)
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="0"
                    required={formData.type !== 'none'}
                  />
                </div>
              )}
              
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Chance Weight</label>
                <input
                  type="number"
                  value={formData.chanceWeight}
                  onChange={(e) => setFormData({ ...formData, chanceWeight: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  min="1"
                  required
                />
                <p className="text-gray-500 text-xs mt-1">Higher weight = higher chance of winning</p>
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-medium transition-colors"
                >
                  Update Prize
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}