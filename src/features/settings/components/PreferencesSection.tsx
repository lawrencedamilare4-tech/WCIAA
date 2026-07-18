import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { useTheme } from '@/shared/design-system/theme-provider';
import { useUIStore } from '@/stores/ui-store';

export function PreferencesSection() {
  const { theme, toggleTheme } = useTheme();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm">Theme</span>
          <Button variant="outline" size="sm" onClick={toggleTheme}>
            {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Sidebar</span>
          <Button variant="outline" size="sm" onClick={toggleSidebar}>
            {sidebarCollapsed ? 'Expand' : 'Collapse'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}