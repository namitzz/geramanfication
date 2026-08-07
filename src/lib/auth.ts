/**
 * Passwordless auth (email magic link) via Supabase. Passwords are never
 * handled by the app. All helpers no-op if sync is disabled.
 */
import { supabase } from './supabase';

/** Where the magic-link should return to — this app's own origin + base path. */
const redirectTo = (): string =>
  typeof window !== 'undefined' ? window.location.origin + import.meta.env.BASE_URL : '';

export async function signInWithEmail(email: string): Promise<{ ok: boolean; message: string }> {
  if (!supabase) return { ok: false, message: 'Sync is not configured.' };
  const { error } = await supabase.auth.signInWithOtp({
    email: email.trim(),
    options: { emailRedirectTo: redirectTo() },
  });
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: 'Check your email for a sign-in link.' };
}

export async function signOut(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut();
}
