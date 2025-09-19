// components/admin/Sidebar.js
import { useRouter } from 'next/router';
import { Icon } from '@iconify/react';

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const menuItems = [
    { icon: "mdi:view-dashboard", label: "Dashboard", path: "/admin/dashboard" },
    { icon: "mdi:account-group", label: "Manage Users", path: "/admin/users" },
    { icon: "mdi:cash-check", label: "Approve Withdrawals", path: "/admin/withdrawals" },
    { icon: "mdi:star-check", label: "Moderate Testimonials", path: "/admin/testimonials" },
    { icon: "mdi:chart-box", label: "View Investments", path: "/admin/investments" },
    { icon: "mdi:package-variant", label: "Products", path: "/admin/products" },
    { icon: "mdi:bank", label: "Banks", path: "/admin/banks" },
    { icon: "mdi:credit-card", label: "Accounts", path: "/admin/accounts" },
    { icon: "mdi:swap-horizontal", label: "Transactions", path: "/admin/transactions" },
    { icon: "mdi:history", label: "User Spins", path: "/admin/user-spins" },
    { icon: "mdi:clipboard-check", label: "User Tasks", path: "/admin/user-tasks" },
    { icon: "mdi:forum", label: "Forums", path: "/admin/forums" },
    { icon: "mdi:cog", label: "Settings", path: "/admin/settings" },
    { icon: "mdi:cog", label: "Spin Prizes", path: "/admin/spin-prizes" },
    { icon: "mdi:cog", label: "Tasks", path: "/admin/tasks" },
  ];

  return (
    <div className={`bg-black/30 backdrop-blur-xl border-r border-white/10 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col h-full`}>
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        {sidebarOpen && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Icon icon="mdi:shield-account" className="text-white text-xl" />
            </div>
            <h1 className="text-white font-bold text-lg">Admin Panel</h1>
          </div>
        )}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
        >
          <Icon icon={sidebarOpen ? "mdi:chevron-left" : "mdi:chevron-right"} className="w-5 h-5" />
        </button>
      </div>
      
      {/* Scrollable menu container */}
      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-4 space-y-2">
          {menuItems.map((item) => (
            <SidebarButton
              key={item.path}
              icon={item.icon}
              label={item.label}
              active={router.pathname === item.path}
              expanded={sidebarOpen}
              onClick={() => router.push(item.path)}
            />
          ))}
        </div>
      </div>
      
      {/* Fixed logout button at bottom */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
        >
          <Icon icon="mdi:logout" className="w-4 h-4" />
          {sidebarOpen && "Logout"}
        </button>
      </div>
    </div>
  );
}

function SidebarButton({ icon, label, active, expanded, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
        active ? 'bg-purple-600/20 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'
      }`}
    >
      <Icon icon={icon} className="w-5 h-5 flex-shrink-0" />
      {expanded && <span className="text-sm font-medium">{label}</span>}
    </button>
  );
}