import { useCallback } from 'react';
import { signInAsGuest } from '../services/auth-service';
import { toast } from 'sonner';

export function useGuestSession() {
  const signInGuest = useCallback(async () => {
    try {
      await signInAsGuest();
    } catch (err) {
      toast.error('Failed to continue as guest');
    }
  }, []);

  return { signInGuest };
}