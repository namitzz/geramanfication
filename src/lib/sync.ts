/**
 * Local-first cloud sync.
 *
 * The device's local store stays the source of truth; the cloud is a mirror.
 * On sign-in we PULL the remote state, MERGE it with local (a union that keeps
 * the best of each — never a destructive last-write-wins), apply the result,
 * and PUSH it back. While signed in, local changes are pushed (debounced).
 *
 * Storage model: one `user_state` row per user holding the whole state blob as
 * JSONB — the same shape as the Export backup file. No-op if sync is disabled.
 */
import { supabase } from './supabase';
import { useApp, type SyncableState } from '../store/app';
import type { SrsRecord } from '../types';

const TABLE = 'user_state';

export function snapshot(): SyncableState {
  const s = useApp.getState();
  return {
    onboarded: s.onboarded,
    settings: s.settings,
    progress: s.progress,
    srsRecords: s.srsRecords,
    mistakes: s.mistakes,
    daily: s.daily,
  };
}

const ms = (d: string): number => {
  const t = Date.parse(d);
  return Number.isNaN(t) ? 0 : t;
};

/** Union merge — keeps the strongest signal from each side, loses nothing. */
export function mergeState(local: SyncableState, remote: SyncableState): SyncableState {
  // SRS: keep the more-advanced record per card (higher box, then more recent).
  const srsRecords: Record<string, SrsRecord> = { ...remote.srsRecords };
  for (const [id, r] of Object.entries(local.srsRecords)) {
    const other = srsRecords[id];
    srsRecords[id] =
      !other || r.box > other.box || (r.box === other.box && ms(r.lastReviewed) >= ms(other.lastReviewed))
        ? r
        : other;
  }

  // Mistakes: union, keep the newer entry per id.
  const mistakes = { ...remote.mistakes };
  for (const [id, m] of Object.entries(local.mistakes)) {
    const other = mistakes[id];
    if (!other || m.ts >= other.ts) mistakes[id] = m;
  }

  // Progress: take the higher of each counter; the later review date.
  const progress = {
    xp: Math.max(local.progress.xp, remote.progress.xp),
    streak: Math.max(local.progress.streak, remote.progress.streak),
    wordsLearned: Math.max(local.progress.wordsLearned, remote.progress.wordsLearned),
    totalReviews: Math.max(local.progress.totalReviews, remote.progress.totalReviews),
    lastReviewDate:
      ms(local.progress.lastReviewDate) >= ms(remote.progress.lastReviewDate)
        ? local.progress.lastReviewDate
        : remote.progress.lastReviewDate,
  };

  // Daily cursor: whichever is from the later day.
  const daily = ms(local.daily.date) >= ms(remote.daily.date) ? local.daily : remote.daily;

  // Settings follow the device you're actively on (local), but adopt a name
  // from the cloud if this device never set one.
  const settings = { ...local.settings };
  if (!settings.name && remote.settings.name) settings.name = remote.settings.name;

  return {
    onboarded: local.onboarded || remote.onboarded,
    settings,
    progress,
    srsRecords,
    mistakes,
    daily,
  };
}

async function pullRemote(userId: string): Promise<SyncableState | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from(TABLE).select('state').eq('user_id', userId).maybeSingle();
  if (error || !data) return null;
  return (data.state as SyncableState) ?? null;
}

async function pushRemote(userId: string, state: SyncableState): Promise<void> {
  if (!supabase) return;
  await supabase
    .from(TABLE)
    .upsert({ user_id: userId, state, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
}

/** Full reconcile: pull → merge → apply locally → push. Returns success. */
export async function syncNow(userId: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const local = snapshot();
    const remote = await pullRemote(userId);
    const merged = remote ? mergeState(local, remote) : local;
    if (remote) useApp.getState().hydrate(merged);
    await pushRemote(userId, merged);
    return true;
  } catch {
    return false;
  }
}

// ---- Debounced auto-push while signed in --------------------------------
let unsub: (() => void) | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;

export function startAutoSync(userId: string): void {
  stopAutoSync();
  if (!supabase) return;
  unsub = useApp.subscribe(() => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      void pushRemote(userId, snapshot());
    }, 2500);
  });
}

export function stopAutoSync(): void {
  if (timer) clearTimeout(timer);
  if (unsub) {
    unsub();
    unsub = null;
  }
}
