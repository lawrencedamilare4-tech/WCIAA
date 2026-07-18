// src/features/player-intelligence/types.ts
import type { Database } from '@/shared/types/supabase';

export type Player = Database['public']['Tables']['players']['Row'] & {
  team: { name: string; flag: string | null } | null;
};