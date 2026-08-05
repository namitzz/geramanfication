/**
 * Local data safety: export/import the entire Tovo store as a JSON file.
 *
 * Until accounts land, this is how a learner keeps their progress across
 * devices, browser clears, or a lost phone. The persisted key never changes
 * (`deutschsprint-v4`), so a backup restores cleanly into any build.
 */

const STORE_KEY = 'deutschsprint-v4';

export interface BackupFile {
  app: 'tovo';
  version: 1;
  exportedAt: string;
  key: string;
  state: unknown;
}

export function exportData(): void {
  const raw = localStorage.getItem(STORE_KEY);
  const payload: BackupFile = {
    app: 'tovo',
    version: 1,
    exportedAt: new Date().toISOString(),
    key: STORE_KEY,
    state: raw ? JSON.parse(raw) : null,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tovo-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Restore from a previously exported file. Resolves true on success; the caller
 * should reload so the store re-hydrates. Accepts both a wrapped BackupFile and
 * a bare persisted-state object, and refuses anything unrecognisable.
 */
export async function importData(file: File): Promise<boolean> {
  const text = await file.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return false;
  }
  const obj = parsed as Partial<BackupFile> & Record<string, unknown>;
  const state = obj && obj.app === 'tovo' && 'state' in obj ? obj.state : parsed;
  // Zustand persist shape is `{ state: {...}, version: n }`.
  if (!state || typeof state !== 'object' || !('state' in (state as object))) return false;
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
  return true;
}
