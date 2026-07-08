import { useEffect } from 'react';
import { useAppStore } from '../stores/appStore';

/**
 * Floating "+N XP" toast (spec: deep-indigo pill that floats up and fades).
 * Driven by the store's transient `toast` message.
 */
const Toast = () => {
  const toast = useAppStore((s) => s.toast);
  const clearToast = useAppStore((s) => s.clearToast);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(clearToast, 1400);
    return () => clearTimeout(id);
  }, [toast, clearToast]);

  if (!toast) return null;

  return (
    <div
      key={toast + Date.now()}
      className="fr fx-float-up pointer-events-none fixed bottom-28 left-1/2 z-[70] whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold text-white"
      style={{
        background: 'var(--indigo900)',
        boxShadow: '0 12px 28px -12px rgba(0,0,0,.5)',
      }}
    >
      {toast}
    </div>
  );
};

export default Toast;
