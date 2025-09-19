import { Home, Users, Gift, CreditCard, User } from 'lucide-react';
import { useRouter } from 'next/router';

const navItems = [
  { label: 'Home', icon: Home, href: '/dashboard', key: 'dashboard' },
  { label: 'Komisi', icon: Users, href: '/referral', key: 'referral' },
  { label: 'Bonus', icon: Gift, href: '/bonus-hub', key: 'bonus' },
  { label: 'Testimoni', icon: CreditCard, href: '/forum', key: 'forum' },
  { label: 'Profil', icon: User, href: '/profile', key: 'profile' },
];

export default function BottomNavbar() {
  const router = useRouter();
  
  return (
    <div className="fixed bottom-6 left-6 right-6 z-50">
      <div className="max-w-md mx-auto">
        <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 rounded-3xl shadow-2xl shadow-purple-500/25 border border-purple-400/20 backdrop-blur-xl">
          <div className="grid grid-cols-5 p-3">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = router.pathname === item.href || 
                              (item.key === 'dashboard' && router.pathname === '/') ||
                              router.pathname.startsWith(item.href);
              
              return (
                <button
                  key={item.key}
                  onClick={() => router.push(item.href)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 relative ${
                    isActive
                      ? 'text-white transform scale-110'
                      : 'text-white/70 hover:text-white hover:scale-105 active:scale-95'
                  }`}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute -top-1 w-8 h-1 bg-white rounded-full shadow-lg"></div>
                  )}
                  
                  {/* Icon with active background */}
                  <div className={`p-2 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-white/20 shadow-lg' 
                      : 'hover:bg-white/10'
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  
                  {/* Label */}
                  <span className={`text-xs mt-1 font-medium transition-all duration-300 ${
                    isActive ? 'font-bold' : 'font-normal'
                  }`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}