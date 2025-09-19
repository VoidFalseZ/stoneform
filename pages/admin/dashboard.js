// pages/admin/dashboard.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Icon } from '@iconify/react';
import AdminLayout from '../../components/admin/Layout';
import { getDashboardStats } from '../../lib/api/admin';
import useAdminAuth from '../../lib/auth/useAdminAuth';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function AdminDashboard() {
  const { loading: authLoading } = useAdminAuth();
  const [data, setData] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    
    const loadData = async () => {
      try {
        // Mock data for demonstration
        setData({
          totalUsers: 1247,
          newUsersToday: 23,
          totalInvestments: 456,
          pendingInvestments: 12,
          totalWithdrawals: 189,
          pendingWithdrawals: 8,
          pendingTestimonials: 15,
          totalRevenue: 12500000,
          activeUsers: 892,
          investmentData: [
            { day: 'Mon', amount: 2500000 },
            { day: 'Tue', amount: 3200000 },
            { day: 'Wed', amount: 1800000 },
            { day: 'Thu', amount: 4200000 },
            { day: 'Fri', amount: 3500000 },
            { day: 'Sat', amount: 2800000 },
            { day: 'Sun', amount: 5100000 },
          ],
          userGrowthData: [
            { day: 'Mon', users: 12 },
            { day: 'Tue', users: 19 },
            { day: 'Wed', users: 15 },
            { day: 'Thu', users: 27 },
            { day: 'Fri', users: 23 },
            { day: 'Sat', users: 17 },
            { day: 'Sun', users: 31 },
          ],
          recentActivity: [
            { id: 1, user: 'User 123', action: 'New Investment', amount: 'Rp 500.000', time: '2 min ago' },
            { id: 2, user: 'User 456', action: 'Withdrawal Request', amount: 'Rp 250.000', time: '5 min ago' },
            { id: 3, user: 'User 789', action: 'Testimonial Upload', amount: '-', time: '10 min ago' },
            { id: 4, user: 'User 012', action: 'Account Registration', amount: '-', time: '15 min ago' }
          ]
        });
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    loadData();
  }, [authLoading]);

  if (authLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout title="Dashboard Overview">
      <Head>
        <title>Stoneform Capital | Admin Dashboard</title>
      </Head>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={data.totalUsers}
          change={data.newUsersToday}
          changeText="today"
          icon="mdi:account-group"
          color="blue"
        />
        <StatCard
          title="Total Investments"
          value={data.totalInvestments}
          change={data.pendingInvestments}
          changeText="pending"
          icon="mdi:chart-box"
          color="green"
        />
        <StatCard
          title="Total Withdrawals"
          value={data.totalWithdrawals}
          change={data.pendingWithdrawals}
          changeText="pending"
          icon="mdi:cash-multiple"
          color="purple"
        />
        <StatCard
          title="Pending Testimonials"
          value={data.pendingTestimonials}
          icon="mdi:star-circle"
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Investment Chart */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Icon icon="mdi:chart-line" className="text-green-400" />
            Investment Overview (Last 7 Days)
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.investmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" tickFormatter={(value) => `Rp ${value/1000000}Jt`} />
                <Tooltip 
                  formatter={(value) => [`Rp ${value.toLocaleString('id-ID')}`, 'Amount']}
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563' }}
                />
                <Bar dataKey="amount" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Icon icon="mdi:account-arrow-up" className="text-blue-400" />
            User Growth (Last 7 Days)
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563' }}
                />
                <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Icon icon="mdi:clock-alert" className="text-blue-400" />
          Recent Activity
        </h2>
        <div className="space-y-3">
          {data.recentActivity.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-black/20 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <Icon icon="mdi:alert-circle" className="text-blue-400 w-4 h-4" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{item.user}</p>
                  <p className="text-gray-400 text-xs">{item.action}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white text-sm">{item.amount}</p>
                <p className="text-gray-400 text-xs">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

// Stat Card Component
function StatCard({ title, value, change, changeText, icon, color }) {
  const colorClasses = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
    yellow: 'text-yellow-400'
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:scale-105 transition-transform">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <Icon icon={icon} className={`w-6 h-6 ${colorClasses[color]}`} />
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value.toLocaleString('id-ID')}</div>
      {change && (
        <div className="text-sm text-green-400">
          +{change} {changeText}
        </div>
      )}
    </div>
  );
}