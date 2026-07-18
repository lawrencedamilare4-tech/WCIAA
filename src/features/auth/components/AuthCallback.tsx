import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../shared/lib/supabase';

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // The OAuth redirect automatically exchanges the code for a session.
    // Once the session is set, WalletUserProvider will pick it up and we can redirect.
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        navigate('/dashboard', { replace: true });
      }
    });
  }, [navigate]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-text-secondary">Completing sign‑in…</p>
    </div>
  );
}