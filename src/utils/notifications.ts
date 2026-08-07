/**
 * Daily study reminders.
 *
 * The web can't guarantee notifications while the app is fully closed without a
 * push server, so this uses the best available layers:
 *  1. A setTimeout that fires at the chosen time while the app is open.
 *  2. A catch-up check on every app open (past the time + goal unmet).
 *  3. A progressive OS-level TimestampTrigger where supported (installed PWAs on
 *     some browsers), which can fire even when closed.
 */

const ICON = import.meta.env.BASE_URL + 'pwa-192x192.png';

export function notificationsSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}
export function notificationPermission(): NotificationPermission {
  return notificationsSupported() ? Notification.permission : 'denied';
}
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!notificationsSupported()) return 'denied';
  try {
    return await Notification.requestPermission();
  } catch {
    return 'denied';
  }
}

const title = 'Tovo — time to learn';
const body = (streak: number) =>
  streak > 0 ? `Keep your ${streak}-day streak alive 🔥` : 'A few minutes of German today?';

export async function showReminder(streak: number): Promise<void> {
  if (notificationPermission() !== 'granted') return;
  const options: NotificationOptions = { body: body(streak), icon: ICON, badge: ICON, tag: 'tovo-daily' };
  try {
    const reg = await navigator.serviceWorker?.ready;
    if (reg) await reg.showNotification(title, options);
    else new Notification(title, options);
  } catch {
    try {
      new Notification(title, options);
    } catch {
      /* ignore */
    }
  }
}

export function nextOccurrence(time: string, from = new Date()): number {
  const [h, m] = time.split(':').map(Number);
  const next = new Date(from);
  next.setHours(h || 0, m || 0, 0, 0);
  if (next.getTime() <= from.getTime()) next.setDate(next.getDate() + 1);
  return next.getTime();
}

/** True if the reminder time has already passed today. */
export function passedToday(time: string, from = new Date()): boolean {
  const [h, m] = time.split(':').map(Number);
  const t = new Date(from);
  t.setHours(h || 0, m || 0, 0, 0);
  return from.getTime() >= t.getTime();
}

let timer: ReturnType<typeof setTimeout> | undefined;
/** Fire once at the next occurrence while the tab is open, then reschedule. */
export function scheduleWhileOpen(time: string, enabled: boolean, onFire: () => void): void {
  if (timer) clearTimeout(timer);
  if (!enabled || !time || !notificationsSupported()) return;
  const delay = Math.max(1000, nextOccurrence(time) - Date.now());
  timer = setTimeout(() => {
    onFire();
    scheduleWhileOpen(time, enabled, onFire);
  }, delay);
}

/** Best-effort OS-scheduled trigger (fires when closed on supported browsers). */
export async function scheduleTrigger(time: string, streak: number): Promise<void> {
  if (!notificationsSupported() || !('serviceWorker' in navigator)) return;
  if (notificationPermission() !== 'granted' || !('TimestampTrigger' in window)) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const opts: any = {
      body: body(streak),
      icon: ICON,
      tag: 'tovo-daily',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      showTrigger: new (window as any).TimestampTrigger(nextOccurrence(time)),
    };
    await reg.showNotification(title, opts);
  } catch {
    /* ignore */
  }
}
