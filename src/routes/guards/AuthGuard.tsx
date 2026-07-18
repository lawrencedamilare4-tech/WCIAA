// src/routes/guards/AuthGuard.tsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWalletUser } from '@/features/auth/components/WalletUserProvider';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useWalletUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      if (location.pathname !== '/') {
        navigate('/', { replace: true });
      }
    }
  }, [user, navigate, location]);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Please connect your wallet to access this page.</p>
      </div>
    );
  }

  return <>{children}</>;
}