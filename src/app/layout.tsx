import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { MobileNav } from './mobile-nav';
import { Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-bg-secondary flex">
      {/* Sidebar - hidden on small screens */}
      <Sidebar className="max-sm:hidden lg:flex" />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 lg:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav - visible only on small screens */}
      <MobileNav />
    </div>
  );
}