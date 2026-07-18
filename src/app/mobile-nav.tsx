// src/app/mobile-nav.tsx
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PlayCircle,
  BrainCircuit,
  TrendingUp,
  Trophy,
  Users,
  User,
  Settings,
  Gift,
  Bell,
  FileText,
  Shield,
} from 'lucide-react';
import { cn } from '@/shared/utils/cn';

const mobileItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/live', icon: PlayCircle, label: 'Live' },
  { to: '/ai-analyst', icon: BrainCircuit, label: 'AI' },
  { to: '/predictions', icon: TrendingUp, label: 'Predict' },
  { to: '/tournament', icon: Trophy, label: 'Tourn.' },
  { to: '/teams', icon: Users, label: 'Teams' },
  { to: '/players', icon: User, label: 'Players' },
  { to: '/tactical', icon: Shield, label: 'Tactic' },
  { to: '/premium', icon: FileText, label: 'Premium' },
  { to: '/rewards', icon: Gift, label: 'Rewards' },
  { to: '/notifications', icon: Bell, label: 'Alerts' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function MobileNav({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 backdrop-blur-lg right-0 bg-bg-primary border-t border-border-primary z-50',
        'sm:opacity-0 sm:h-0',   // hidden on desktop
        className
      )}
    >
      {/* Horizontally scrollable list */}
      <div className="flex overflow-x-auto gap-1 px-2 py-2 scrollbar-hide">
        {mobileItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center min-w-[64px] h-14 rounded-lg text-xs font-medium transition-colors',
                isActive
                  ? 'text-brand'
                  : 'text-text-tertiary hover:text-text-primary'
              )
            }
          >
            <item.icon className="h-5 w-5 mb-0.5" />
            <span className="leading-tight text-center">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}