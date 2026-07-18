// src/app/topbar.tsx
import { Bell, Wallet, LogOut, LayoutDashboard, PlayCircle, BrainCircuit } from 'lucide-react';
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

  const handleLogout = () => {
    disconnect();
    navigate('/');
  };

  return (
    <header className="h-16 backdrop-blur-lg border-b border-border-primary bg-bg-primary flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
      {/* Left: primary nav links */}
      <div className="flex items-center gap-1">
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
              <span className="hidden sm:inline">{link.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Right: Wallet & actions */}
      <div className="flex items-center gap-2">
        {isConnected ? (
          <Button onClick={handleLogout} variant="ghost" size="sm" className="font-mono text-xs">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={connect}>
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