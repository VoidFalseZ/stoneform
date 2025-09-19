// pages/admin/forums.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Icon } from '@iconify/react';
import AdminLayout from '../../components/admin/Layout';
import useAdminAuth from '../../lib/auth/useAdminAuth';

export default function ForumModeration() {
  const { loading: authLoading } = useAdminAuth();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState('');

  useEffect(() => {
    if (authLoading) return;
    
    // Mock data for demonstration
    const mockPosts = [
      {
        id: 1,
        title: 'Investment Strategy Discussion',
        author: 'User 123',
        content: 'I wanted to discuss long-term investment strategies for the current market conditions...',
        replies: 12,
        likes: 24,
        status: 'pending',
        createdAt: '2023-05-15 14:30:22',
        category: 'Investment Strategies'
      },
      {
        id: 2,
        title: 'Market Analysis - Q2 2023',
        author: 'User 456',
        content: 'Here is my analysis of the market trends for Q2 2023 based on recent economic indicators...',
        replies: 8,
        likes: 15,
        status: 'accepted',
        createdAt: '2023-05-14 11:15:44',
        category: 'Market Analysis'
      },
      {
        id: 3,
        title: 'New to Investing - Need Guidance',
        author: 'User 789',
        content: 'I\'m new to investing and would appreciate some guidance on where to start...',
        replies: 23,
        likes: 42,
        status: 'rejected',
        createdAt: '2023-05-13 09:22:11',
        category: 'Beginner Questions'
      },
      {
        id: 4,
        title: 'Real Estate vs Stock Market',
        author: 'User 101',
        content: 'Which do you think is a better investment in the current economic climate?',
        replies: 17,
        likes: 31,
        status: 'pending',
        createdAt: '2023-05-12 16:45:33',
        category: 'Investment Comparisons'
      }
    ];
    
    setPosts(mockPosts);
    setFilteredPosts(mockPosts);
    setLoading(false);
  }, [authLoading]);

  useEffect(() => {
    if (selectedStatus === 'all') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(post => post.status === selectedStatus));
    }
  }, [selectedStatus, posts]);

  const handleAction = (post, action) => {
    setSelectedPost(post);
    setModalAction(action);
    setShowModal(true);
  };

  const confirmAction = () => {
    // Update post status
    const updatedPosts = posts.map(p => 
      p.id === selectedPost.id 
        ? { ...p, status: modalAction === 'delete' ? 'deleted' : modalAction } 
        : p
    );
    
    setPosts(updatedPosts);
    setShowModal(false);
    
    // In a real app, this would call an API to update the post status
    console.log(`${modalAction} post:`, selectedPost.id);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-yellow-500/10 text-yellow-400',
      accepted: 'bg-green-500/10 text-green-400',
      rejected: 'bg-red-500/10 text-red-400',
      deleted: 'bg-gray-500/10 text-gray-400'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading forum posts...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout title="Forum Moderation">
      <Head>
        <title>Stoneform Capital | Forum Moderation</title>
      </Head>

      {/* Action Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 max-w-md w-full">
            <h3 className="text-white font-semibold text-lg mb-4">
              {modalAction === 'accept' ? 'Accept Post' : 
               modalAction === 'reject' ? 'Reject Post' : 'Delete Post'}
            </h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to {modalAction} the post "{selectedPost.title}" by {selectedPost.author}?
              {modalAction === 'accept' && ' This will reward the user.'}
              {modalAction === 'reject' && ' This will not reward the user.'}
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
                  modalAction === 'accept' 
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
          <h2 className="text-white font-semibold text-xl">Forum Posts</h2>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-4 py-2 rounded-xl text-sm ${
                selectedStatus === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              All Posts
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
              onClick={() => setSelectedStatus('accepted')}
              className={`px-4 py-2 rounded-xl text-sm ${
                selectedStatus === 'accepted'
                  ? 'bg-green-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Accepted
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

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center">
            <Icon icon="mdi:forum-remove" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-400 text-lg">No posts found</h3>
            <p className="text-gray-500 mt-2">
              {selectedStatus === 'all' 
                ? 'There are no forum posts yet.' 
                : `There are no ${selectedStatus} posts.`}
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div key={post.id} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* Post content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="text-white font-semibold text-lg">{post.title}</h3>
                    {getStatusBadge(post.status)}
                    <span className="text-gray-400 text-sm bg-white/5 rounded-full px-3 py-1">
                      {post.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-400 mb-4 line-clamp-2">{post.content}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Icon icon="mdi:account" className="w-4 h-4" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon icon="mdi:clock" className="w-4 h-4" />
                      {formatDate(post.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon icon="mdi:comment" className="w-4 h-4" />
                      {post.replies} replies
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon icon="mdi:thumb-up" className="w-4 h-4" />
                      {post.likes} likes
                    </span>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex lg:flex-col gap-2">
                  {post.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleAction(post, 'accept')}
                        className="p-2 bg-green-600/20 hover:bg-green-600/30 rounded-lg text-green-400 flex items-center gap-2"
                        title="Accept (Reward User)"
                      >
                        <Icon icon="mdi:check" className="w-4 h-4" />
                        <span className="lg:hidden">Accept</span>
                      </button>
                      <button
                        onClick={() => handleAction(post, 'reject')}
                        className="p-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg text-red-400 flex items-center gap-2"
                        title="Reject (No Reward)"
                      >
                        <Icon icon="mdi:close" className="w-4 h-4" />
                        <span className="lg:hidden">Reject</span>
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleAction(post, 'delete')}
                    className="p-2 bg-gray-600/20 hover:bg-gray-600/30 rounded-lg text-gray-400 flex items-center gap-2"
                    title="Delete Post"
                  >
                    <Icon icon="mdi:delete" className="w-4 h-4" />
                    <span className="lg:hidden">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}