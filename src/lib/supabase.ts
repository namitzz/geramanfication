/**
 * Optional Supabase client for account + cloud sync.
 *
 * Inert unless BOTH VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set at
 * build time. When unset, `supabase` is null and every sync/auth helper is a
 * no-op, so the app stays fully local-first and offline — exactly as today.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase: SupabaseClient | null =
  URL && ANON
    ? createClient(URL, ANON, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true, // completes magic-link / OAuth redirects
        },
      })
    : null;

export const syncEnabled = (): boolean => supabase !== null;
