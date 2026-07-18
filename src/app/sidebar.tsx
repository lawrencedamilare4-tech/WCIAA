import { NavLink, useLocation, matchPath } from 'react-router-dom';
import {
  LayoutDashboard,
  PlayCircle,
  Radar,
  BrainCircuit,
  TrendingUp,
  Shield,
  Users,
  User,
  Trophy,
  FileText,
  Gift,
  Bell,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { useUIStore } from '@/stores/ui-store';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
  match?: string | string[];
}

const navItems: NavItem[] = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/live', icon: PlayCircle, label: 'Live Matches' },
  {
    to: '/live',
    icon: Radar,
    label: 'Match Intelligence',
    match: '/match/:matchId',
  },
  { to: '/ai-analyst', icon: BrainCircuit, label: 'AI Analyst' },
  { to: '/predictions', icon: TrendingUp, label: 'Predictions' },
  { to: '/tactical', icon: Shield, label: 'Tactical Center' },
  { to: '/teams', icon: Users, label: 'Teams' },
  { to: '/players', icon: User, label: 'Players' },
  { to: '/tournament', icon: Trophy, label: 'Tournament' },
  { to: '/premium', icon: FileText, label: 'Premium Reports' },
  { to: '/rewards', icon: Gift, label: 'Rewards' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const location = useLocation();

  return (
    <motion.aside
      className={cn(
        'flex flex-col w-60 border-r border-border-primary bg-bg-primary h-screen sticky top-0',
        className
      )}
      animate={{ width: sidebarCollapsed ? 64 : 240 }}
      transition={{ duration: 0.2 }}
    >
      {/* Brand logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border-primary">
        {!sidebarCollapsed && (
          <span className="text-xl font-bold tracking-tight">WCIA</span>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-md hover:bg-bg-secondary text-text-secondary"
        >
          {sidebarCollapsed ? (
            <ChevronsRight className="h-5 w-5" />
          ) : (
            <ChevronsLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const patterns = Array.isArray(item.match)
            ? item.match
            : [item.match ?? item.to];
          const isActive = patterns.some((pattern) =>
            matchPath({ path: pattern, end: false }, location.pathname)
          );

          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={cn(
                'relative flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'text-text-primary font-semibold'
                  : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary',
                sidebarCollapsed && 'justify-center px-2'
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 rounded-md bg-bg-tertiary"
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                />
              )}
              <item.icon className="relative z-10 h-5 w-5 shrink-0" />
              <AnimatePresence initial={false}>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    className="relative z-10 overflow-hidden whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom section (user info) */}
      <div className="p-3 border-t border-border-primary">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-xs font-bold">
            U
          </div>
          {!sidebarCollapsed && <span className="text-sm font-medium">User</span>}
        </div>
      </div>
    </motion.aside>
  );
}