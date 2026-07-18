import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { supabase } from '@/shared/lib/supabase';
import { toast } from 'sonner';
import { useWalletUser } from '@/features/auth/components/WalletUserProvider';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/Input';

const profileSchema = z.object({
  username: z.string().min(3).max(30).optional(),
  full_name: z.string().max(100).optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export function ProfileSection() {
  const { profile, refreshProfile } = useWalletUser();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile?.username ?? '',
      full_name: profile?.full_name ?? '',
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ username: data.username, full_name: data.full_name })
        .eq('id', profile!.id);
      if (error) throw error;
      await refreshProfile();
      toast.success('Profile updated');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <Input {...register('username')} placeholder="Enter username" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <Input {...register('full_name')} placeholder="Enter full name" />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}