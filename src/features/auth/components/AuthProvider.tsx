// src/features/auth/components/WalletUserProvider.tsx
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/shared/lib/supabase';
import type { Session, User } from '@supabase/supabase-js';
import type { Database } from '@/shared/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isGuest: boolean;
}

interface AuthContextValue extends AuthState {
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function WalletUserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isGuest = user?.is_anonymous ?? false;

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id);
  }, [user, fetchProfile]);

  // Listen to auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setSession(session);
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.id);
      } else {
        setProfile(null);
      }
      setIsLoading(false); // always stop loading after this callback
    });

    // Initial session check
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to get initial session:', err);
        setIsLoading(false);
      });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const value: AuthContextValue = {
    user,
    session,
    profile,
    isLoading,
    isGuest,
    signOut: handleSignOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useWalletUser() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useWalletUser must be used within an WalletUserProvider');
  }
  return context;
}