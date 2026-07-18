import { useCallback } from 'react';
import { signInWithOAuth } from '../services/auth-service';
import { toast } from 'sonner'; // we'll add Sonner in the app

export function useLogin() {
  const loginWithGoogle = useCallback(async () => {
    try {
      await signInWithOAuth('google');
    } catch (err) {
      toast.error('Failed to sign in with Google');
    }
  }, []);

  const loginWithGitHub = useCallback(async () => {
    try {
      await signInWithOAuth('github');
    } catch (err) {
      toast.error('Failed to sign in with GitHub');
    }
  }, []);

  return { loginWithGoogle, loginWithGitHub };
}