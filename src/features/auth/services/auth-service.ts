import { supabase } from '../../../shared/lib/supabase';

/**
 * Sign in with OAuth provider (Google / GitHub)
 */
export async function signInWithOAuth(provider: 'google' | 'github') {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`, // we'll create this route
    },
  });
  if (error) throw error;
}

/**
 * Sign in as anonymous guest
 */
export async function signInAsGuest() {
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return data;
}

/**
 * Link an OAuth identity to the current anonymous user
 */
export async function linkIdentity(provider: 'google' | 'github') {
  const { error } = await supabase.auth.linkIdentity({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw error;
}

/**
 * Sign out
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Get current session (used for loading states)
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}