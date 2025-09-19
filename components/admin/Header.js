// components/admin/Header.js
import { Icon } from '@iconify/react';

export default function Header({ sidebarOpen, setSidebarOpen, title }) {
  return (
    <header className="bg-black/30 backdrop-blur-xl border-b border-white/10">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 md:hidden"
            >
              <Icon icon="mdi:menu" className="w-5 h-5" />
            </button>
            <h2 className="text-white font-semibold">{title}</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm hidden md:inline">Welcome, Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}