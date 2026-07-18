// src/app/topbar.tsx
import { Search, Bell, Wallet, LogOut, LayoutDashboard, PlayCircle, BrainCircuit } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useWallet } from '@/features/wallet/hooks/useWallet';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { cn } from '@/shared/utils/cn';

const navLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/live', icon: PlayCircle, label: 'Live' },
  { to: '/ai-analyst', icon: BrainCircuit, label: 'AI Analyst' },
];

export function Topbar() {
  const { address, isConnected, connect, disconnect } = useWallet();
  const navigate = useNavigate();
  const location = useLocation();

  // Combined logout: sign out of Supabase AND disconnect wallet
const handleLogout = () => {
  disconnect();   // this now also signs out of Supabase
  navigate('/');
};


  return (
    <header className="h-16 backdrop-blur-lg border-b border-border-primary bg-bg-primary flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
      {/* Left: primary nav links (desktop only) */}
      <div className="hidden md:flex items-center gap-1 mr-4">
        {navLinks.map((link) => {
          const isActive = location.pathname.startsWith(link.to);
          return (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-bg-tertiary text-text-primary'
                  : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
              )}
            >
              <link.icon className="h-4 w-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md ml-0 md:ml-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
          <input
            type="search"
            placeholder="Search teams, players, matches..."
            className="w-full h-9 pl-9 pr-3 rounded-md bg-bg-secondary border border-border-primary text-sm placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-1"
          />
        </div>
      </div>

      {/* Right: Wallet & actions */}
      <div className="flex items-center gap-2 ml-4">
        {isConnected ? (
          <Button onClick={handleLogout} variant="ghost" size="sm" className="font-mono text-xs">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </Button>
        ) : (
          <Button className='cursor-pointer hover:bg-gray-300' variant="outline" size="sm" onClick={connect}>
            <Wallet className="h-4 w-4 mr-2" />
            Connect Wallet
          </Button>
        )}

        <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('/notifications')}>
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full" />
        </Button>

        <Button variant="ghost" size="icon" onClick={disconnect}>
          <LogOut className="h-5 w-5 cursor-pointer" />
        </Button>
      </div>
    </header>
  );
}