/**
 * Captures the browser's `beforeinstallprompt` event at module-load time.
 *
 * Chrome fires this event very early — often before React has mounted — so a
 * listener attached inside a component's useEffect usually misses it and the
 * install button never appears. This module is imported first from main.tsx,
 * stashes the event, and lets components subscribe to it later.
 */

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<(e: BeforeInstallPromptEvent | null) => void>();

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    listeners.forEach((fn) => fn(deferredPrompt));
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    listeners.forEach((fn) => fn(null));
  });
}

export const getInstallPrompt = (): BeforeInstallPromptEvent | null =>
  deferredPrompt;

/** Consume the stashed prompt (it can only be used once). */
export const clearInstallPrompt = (): void => {
  deferredPrompt = null;
};

export const onInstallPromptChange = (
  fn: (e: BeforeInstallPromptEvent | null) => void
): (() => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
