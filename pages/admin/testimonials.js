// pages/admin/testimonials.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Icon } from '@iconify/react';
import AdminLayout from '../../components/admin/Layout';
import useAdminAuth from '../../lib/auth/useAdminAuth';

export default function TestimonialModeration() {
  const { loading: authLoading } = useAdminAuth();
  const [testimonials, setTestimonials] = useState([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState('');

  useEffect(() => {
    if (authLoading) return;
    
    // Mock data for demonstration
    const mockTestimonials = [
      {
        id: 1,
        userName: 'John Doe',
        userInitials: 'JD',
        date: '2023-05-15',
        content: "I've been investing with Stoneform for 6 months now and the returns have been exceptional. The platform is easy to use and the support team is very helpful.",
        rating: 5,
        status: 'pending'
      },
      {
        id: 2,
        userName: 'Sarah Johnson',
        userInitials: 'SJ',
        date: '2023-05-14',
        content: "My experience with Stoneform Capital has been outstanding. The investment options are diverse and the returns are consistently good.",
        rating: 4,
        status: 'pending'
      },
      {
        id: 3,
        userName: 'Michael Chen',
        userInitials: 'MC',
        date: '2023-05-13',
        content: "As a first-time investor, I was nervous about where to put my money. Stoneform made the process simple and their educational resources were invaluable.",
        rating: 5,
        status: 'approved'
      },
      {
        id: 4,
        userName: 'Emily Williams',
        userInitials: 'EW',
        date: '2023-05-12',
        content: "The customer service at Stoneform is exceptional. They answered all my questions and helped me create a diversified portfolio that matches my risk tolerance.",
        rating: 5,
        status: 'rejected',
        rejectionReason: 'Inappropriate language'
      }
    ];
    
    setTestimonials(mockTestimonials);
    setFilteredTestimonials(mockTestimonials.filter(t => t.status === 'pending'));
    setLoading(false);
  }, [authLoading]);

  useEffect(() => {
    let result = testimonials;
    
    // Filter by status
    if (selectedStatus !== 'all') {
      result = result.filter(testimonial => testimonial.status === selectedStatus);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(testimonial => 
        testimonial.userName.toLowerCase().includes(term) || 
        testimonial.content.toLowerCase().includes(term)
      );
    }
    
    setFilteredTestimonials(result);
  }, [selectedStatus, searchTerm, testimonials]);

  const handleAction = (testimonial, action) => {
    setSelectedTestimonial(testimonial);
    setModalAction(action);
    setShowModal(true);
  };

  const confirmAction = () => {
    // Update testimonial status
    const updatedTestimonials = testimonials.map(t => 
      t.id === selectedTestimonial.id 
        ? { ...t, status: modalAction } 
        : t
    );
    
    setTestimonials(updatedTestimonials);
    setShowModal(false);
    
    // In a real app, this would call an API to update the testimonial status
    console.log(`${modalAction} testimonial:`, selectedTestimonial.id);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        icon={i < rating ? "mdi:star" : "mdi:star-outline"}
        className={i < rating ? "text-yellow-400 w-4 h-4" : "text-gray-400 w-4 h-4"}
      />
    ));
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-yellow-500/10 text-yellow-400',
      approved: 'bg-green-500/10 text-green-400',
      rejected: 'bg-red-500/10 text-red-400'
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
      year: 'numeric'
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout title="Testimonial Moderation">
      <Head>
        <title>Stoneform Capital | Testimonial Moderation</title>
      </Head>

      {/* Action Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 max-w-md w-full">
            <h3 className="text-white font-semibold text-lg mb-4">
              {modalAction === 'approved' ? 'Approve Testimonial' : 'Reject Testimonial'}
            </h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to {modalAction === 'approved' ? 'approve' : 'reject'} the testimonial from {selectedTestimonial.userName}?
              {modalAction === 'rejected' && (
                <div className="mt-3">
                  <label className="block text-sm text-gray-400 mb-1">Rejection Reason (Optional)</label>
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
                  modalAction === 'approved' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                } text-white transition-colors`}
              >
                Confirm {modalAction === 'approved' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Controls */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-white font-semibold text-xl">Testimonial Moderation</h2>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search testimonials..."
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
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTestimonials.length === 0 ? (
          <div className="col-span-full bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center">
            <Icon icon="mdi:comment-remove" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-400 text-lg">No testimonials found</h3>
            <p className="text-gray-500 mt-2">
              {selectedStatus === 'all' 
                ? 'There are no testimonials yet.' 
                : `There are no ${selectedStatus} testimonials.`}
            </p>
          </div>
        ) : (
          filteredTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:scale-[1.02] transition-transform">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">{testimonial.userInitials}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{testimonial.userName}</p>
                    <p className="text-gray-400 text-sm">{formatDate(testimonial.date)}</p>
                  </div>
                </div>
                {getStatusBadge(testimonial.status)}
              </div>
              
              <div className="flex mb-3">
                {renderStars(testimonial.rating)}
              </div>
              
              <p className="text-gray-300 mb-6">{testimonial.content}</p>
              
              {testimonial.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(testimonial, 'approved')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-xl flex items-center justify-center gap-2"
                  >
                    <Icon icon="mdi:check" className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(testimonial, 'rejected')}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-xl flex items-center justify-center gap-2"
                  >
                    <Icon icon="mdi:close" className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              )}
              
              {testimonial.status === 'rejected' && testimonial.rejectionReason && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-red-400 text-sm">
                    <span className="font-medium">Rejection Reason:</span> {testimonial.rejectionReason}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}