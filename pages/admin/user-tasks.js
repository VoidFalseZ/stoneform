// pages/admin/user-tasks.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Icon } from '@iconify/react';
import AdminLayout from '../../components/admin/Layout';
import useAdminAuth from '../../lib/auth/useAdminAuth';

export default function UserTasksManagement() {
  const { loading: authLoading } = useAdminAuth();
  const [userTasks, setUserTasks] = useState([]);
  const [filteredUserTasks, setFilteredUserTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState('');

  useEffect(() => {
    if (authLoading) return;
    
    // Mock data for demonstration
    const mockUserTasks = [
      {
        id: 1,
        user: 'User 123',
        task: 'Complete Profile',
        reward: 5000,
        status: 'completed',
        completedAt: '2023-05-15 14:30:22',
        claimedAt: '2023-05-15 14:32:18'
      },
      {
        id: 2,
        user: 'User 456',
        task: 'First Investment',
        reward: 10000,
        status: 'pending',
        completedAt: '2023-05-14 11:15:44',
        claimedAt: null
      },
      {
        id: 3,
        user: 'User 789',
        task: 'Refer a Friend',
        reward: 15000,
        status: 'claimed',
        completedAt: '2023-05-13 09:22:11',
        claimedAt: '2023-05-13 09:25:33'
      },
      {
        id: 4,
        user: 'User 101',
        task: 'Weekly Login',
        reward: 2500,
        status: 'rejected',
        completedAt: '2023-05-12 16:45:33',
        claimedAt: '2023-05-12 16:48:22',
        rejectionReason: 'Invalid proof provided'
      }
    ];
    
    setUserTasks(mockUserTasks);
    setFilteredUserTasks(mockUserTasks);
    setLoading(false);
  }, [authLoading]);

  useEffect(() => {
    if (selectedStatus === 'all') {
      setFilteredUserTasks(userTasks);
    } else {
      setFilteredUserTasks(userTasks.filter(task => task.status === selectedStatus));
    }
  }, [selectedStatus, userTasks]);

  const handleAction = (task, action) => {
    setSelectedTask(task);
    setModalAction(action);
    setShowModal(true);
  };

  const confirmAction = () => {
    // Update task status
    const updatedUserTasks = userTasks.map(t => 
      t.id === selectedTask.id 
        ? { 
            ...t, 
            status: modalAction === 'approve' ? 'claimed' : 
                   modalAction === 'reject' ? 'rejected' : 
                   modalAction === 'delete' ? 'deleted' : t.status,
            rejectionReason: modalAction === 'reject' ? 'Invalid claim' : t.rejectionReason
          } 
        : t
    );
    
    setUserTasks(updatedUserTasks);
    setShowModal(false);
    
    // In a real app, this would call an API to update the task status
    console.log(`${modalAction} user task:`, selectedTask.id);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      completed: 'bg-blue-500/10 text-blue-400',
      pending: 'bg-yellow-500/10 text-yellow-400',
      claimed: 'bg-green-500/10 text-green-400',
      rejected: 'bg-red-500/10 text-red-400',
      deleted: 'bg-gray-500/10 text-gray-400'
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
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading user tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout title="User Tasks Management">
      <Head>
        <title>Stoneform Capital | User Tasks</title>
      </Head>

      {/* Action Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 max-w-md w-full">
            <h3 className="text-white font-semibold text-lg mb-4">
              {modalAction === 'approve' ? 'Approve Claim' : 
               modalAction === 'reject' ? 'Reject Claim' : 'Delete Claim'}
            </h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to {modalAction} the task claim for "{selectedTask.task}" by {selectedTask.user}?
              {modalAction === 'reject' && (
                <div className="mt-3">
                  <label className="block text-sm text-gray-400 mb-1">Rejection Reason</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter reason for rejection"
                  />
                </div>
              )}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`px-4 py-2 rounded-xl ${
                  modalAction === 'approve' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : modalAction === 'reject'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-gray-600 hover:bg-gray-700'
                } text-white transition-colors`}
              >
                Confirm {modalAction}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Controls */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-white font-semibold text-xl">User Task Claims</h2>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-4 py-2 rounded-xl text-sm ${
                selectedStatus === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              All Claims
            </button>
            <button
              onClick={() => setSelectedStatus('pending')}
              className={`px-4 py-2 rounded-xl text-sm ${
                selectedStatus === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setSelectedStatus('claimed')}
              className={`px-4 py-2 rounded-xl text-sm ${
                selectedStatus === 'claimed'
                  ? 'bg-green-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Claimed
            </button>
            <button
              onClick={() => setSelectedStatus('rejected')}
              className={`px-4 py-2 rounded-xl text-sm ${
                selectedStatus === 'rejected'
                  ? 'bg-red-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Rejected
            </button>
          </div>
        </div>
      </div>

      {/* User Tasks Table */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-3 px-4 text-left text-gray-400 text-sm font-medium">User</th>
                <th className="py-3 px-4 text-left text-gray-400 text-sm font-medium">Task</th>
                <th className="py-3 px-4 text-left text-gray-400 text-sm font-medium">Reward</th>
                <th className="py-3 px-4 text-left text-gray-400 text-sm font-medium">Status</th>
                <th className="py-3 px-4 text-left text-gray-400 text-sm font-medium">Completed</th>
                <th className="py-3 px-4 text-left text-gray-400 text-sm font-medium">Claimed</th>
                <th className="py-3 px-4 text-left text-gray-400 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUserTasks.map((task) => (
                <tr key={task.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4 text-white">{task.user}</td>
                  <td className="py-3 px-4 text-white">{task.task}</td>
                  <td className="py-3 px-4 text-white">{formatCurrency(task.reward)}</td>
                  <td className="py-3 px-4">{getStatusBadge(task.status)}</td>
                  <td className="py-3 px-4 text-gray-400 text-sm">{formatDate(task.completedAt)}</td>
                  <td className="py-3 px-4 text-gray-400 text-sm">{formatDate(task.claimedAt)}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      {task.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAction(task, 'approve')}
                            className="p-2 bg-green-600/20 hover:bg-green-600/30 rounded-lg text-green-400"
                            title="Approve Claim"
                          >
                            <Icon icon="mdi:check" className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAction(task, 'reject')}
                            className="p-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg text-red-400"
                            title="Reject Claim"
                          >
                            <Icon icon="mdi:close" className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleAction(task, 'delete')}
                        className="p-2 bg-gray-600/20 hover:bg-gray-600/30 rounded-lg text-gray-400"
                        title="Delete Claim"
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

        {filteredUserTasks.length === 0 && (
          <div className="text-center py-8">
            <Icon icon="mdi:task-off" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-400 text-lg">No task claims found</h3>
            <p className="text-gray-500 mt-2">
              {selectedStatus === 'all' 
                ? 'There are no task claims yet.' 
                : `There are no ${selectedStatus} task claims.`}
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}