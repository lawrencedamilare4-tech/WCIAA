import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { supabase } from '@/shared/lib/supabase';
import { toast } from 'sonner';
import { useWalletUser } from '@/features/auth/components/WalletUserProvider';

const NOTIFICATION_TYPES = [
  { key: 'goal_alerts', label: 'Goal alerts' },
  { key: 'upset_alerts', label: 'Upset alerts' },
  { key: 'prediction_changes', label: 'Prediction confidence changes' },
  { key: 'premium_completed', label: 'Premium report completed' },
];

export function NotificationPreferences() {
  const { profile, refreshProfile } = useWalletUser();
  const preferences = profile?.preferences ?? {};
  const [saving, setSaving] = useState(false);

  const toggle = async (key: string) => {
    setSaving(true);
    const updated = { ...preferences, [key]: !preferences[key] };
    const { error } = await supabase
      .from('profiles')
      .update({ preferences: updated })
      .eq('id', profile!.id);
    if (error) toast.error('Failed to save');
    else {
      await refreshProfile();
      toast.success('Preference updated');
    }
    setSaving(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {NOTIFICATION_TYPES.map((nt) => (
            <div key={nt.key} className="flex items-center justify-between">
              <span className="text-sm">{nt.label}</span>
              <input
                type="checkbox"
                checked={preferences[nt.key] !== false} // default true
                onChange={() => toggle(nt.key)}
                disabled={saving}
                className="h-4 w-4 rounded border-border-primary"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}