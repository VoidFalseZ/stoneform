// pages/admin/tasks.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Icon } from '@iconify/react';
import AdminLayout from '../../components/admin/Layout';
import useAdminAuth from '../../lib/auth/useAdminAuth';

export default function TasksManagement() {
  const { loading: authLoading } = useAdminAuth();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [editingTask, setEditingTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    reward: '',
    levelRequired: 1,
    status: 'active'
  });

  useEffect(() => {
    if (authLoading) return;
    
    // Mock data for demonstration
    const mockTasks = [
      {
        id: 1,
        name: 'Complete Profile',
        description: 'Complete your user profile with all required information',
        reward: 5000,
        levelRequired: 1,
        status: 'active',
        completionCount: 1247,
        createdAt: '2023-01-15'
      },
      {
        id: 2,
        name: 'First Investment',
        description: 'Make your first investment on the platform',
        reward: 10000,
        levelRequired: 2,
        status: 'active',
        completionCount: 856,
        createdAt: '2023-01-15'
      },
      {
        id: 3,
        name: 'Refer a Friend',
        description: 'Refer a friend who signs up and completes their profile',
        reward: 15000,
        levelRequired: 3,
        status: 'inactive',
        completionCount: 342,
        createdAt: '2023-02-10'
      },
      {
        id: 4,
        name: 'Weekly Login',
        description: 'Log in to the platform for 7 consecutive days',
        reward: 2500,
        levelRequired: 1,
        status: 'active',
        completionCount: 892,
        createdAt: '2023-03-05'
      }
    ];
    
    setTasks(mockTasks);
    setFilteredTasks(mockTasks);
    setLoading(false);
  }, [authLoading]);

  useEffect(() => {
    if (selectedStatus === 'all') {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter(task => task.status === selectedStatus));
    }
  }, [selectedStatus, tasks]);

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      name: task.name,
      description: task.description,
      reward: task.reward,
      levelRequired: task.levelRequired,
      status: task.status
    });
    setShowEditModal(true);
  };

  const handleCreate = () => {
    setEditingTask(null);
    setFormData({
      name: '',
      description: '',
      reward: '',
      levelRequired: 1,
      status: 'active'
    });
    setShowCreateModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingTask) {
      // Update existing task
      const updatedTasks = tasks.map(task => 
        task.id === editingTask.id 
          ? { ...task, ...formData }
          : task
      );
      setTasks(updatedTasks);
      setShowEditModal(false);
    } else {
      // Create new task
      const newTask = {
        id: Math.max(...tasks.map(t => t.id)) + 1,
        ...formData,
        completionCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setTasks([...tasks, newTask]);
      setShowCreateModal(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'reward' || name === 'levelRequired' ? Number(value) : value
    }));
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: 'bg-green-500/10 text-green-400',
      inactive: 'bg-red-500/10 text-red-400'
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout title="Tasks Management">
      <Head>
        <title>Stoneform Capital | Tasks Management</title>
      </Head>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 max-w-md w-full">
            <h3 className="text-white font-semibold text-lg mb-4">Edit Task</h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Task Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows="3"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Reward (IDR)</label>
                    <input
                      type="number"
                      name="reward"
                      value={formData.reward}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Level Required</label>
                    <input
                      type="number"
                      name="levelRequired"
                      value={formData.levelRequired}
                      onChange={handleChange}
                      min="1"
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 max-w-md w-full">
            <h3 className="text-white font-semibold text-lg mb-4">Create New Task</h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Task Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows="3"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Reward (IDR)</label>
                    <input
                      type="number"
                      name="reward"
                      value={formData.reward}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Level Required</label>
                    <input
                      type="number"
                      name="levelRequired"
                      value={formData.levelRequired}
                      onChange={handleChange}
                      min="1"
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter Controls */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-white font-semibold text-xl">Tasks & Rewards</h2>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-4 py-2 rounded-xl text-sm ${
                selectedStatus === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              All Tasks
            </button>
            <button
              onClick={() => setSelectedStatus('active')}
              className={`px-4 py-2 rounded-xl text-sm ${
                selectedStatus === 'active'
                  ? 'bg-green-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setSelectedStatus('inactive')}
              className={`px-4 py-2 rounded-xl text-sm ${
                selectedStatus === 'inactive'
                  ? 'bg-red-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Inactive
            </button>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl flex items-center gap-2"
            >
              <Icon icon="mdi:plus" className="w-5 h-5" />
              New Task
            </button>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.length === 0 ? (
          <div className="col-span-full bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center">
            <Icon icon="mdi:task-off" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-400 text-lg">No tasks found</h3>
            <p className="text-gray-500 mt-2">
              {selectedStatus === 'all' 
                ? 'There are no tasks yet.' 
                : `There are no ${selectedStatus} tasks.`}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:scale-[1.02] transition-transform">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-white font-semibold text-lg">{task.name}</h3>
                {getStatusBadge(task.status)}
              </div>
              
              <p className="text-gray-400 text-sm mb-4">{task.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-400 text-sm">Reward</p>
                  <p className="text-green-400 font-semibold">{formatCurrency(task.reward)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Level Required</p>
                  <p className="text-white font-semibold">Level {task.levelRequired}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-white font-semibold">{task.completionCount.toLocaleString('id-ID')} times</p>
              </div>
              
              <button
                onClick={() => handleEdit(task)}
                className="w-full bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 rounded-xl py-2 flex items-center justify-center gap-2"
              >
                <Icon icon="mdi:pencil" className="w-4 h-4" />
                Edit Task
              </button>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}