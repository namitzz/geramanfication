import { useEffect, useState } from 'react';
import { Download, X, Share, PlusSquare } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const isStandalone = (): boolean =>
  window.matchMedia('(display-mode: standalone)').matches ||
  // iOS Safari legacy flag
  (navigator as unknown as { standalone?: boolean }).standalone === true;

const isIOS = (): boolean =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  // iPadOS reports as Mac with touch
  (navigator.userAgent.includes('Mac') && 'ontouchend' in document);

/**
 * "Install app" button for the top bar. Uses the native install prompt where
 * the browser offers one (Chrome/Edge/Android); on iOS shows Add-to-Home-Screen
 * instructions (Safari has no install API). Hidden once the app is installed.
 */
const InstallButton = () => {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    setInstalled(isStandalone());

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (installed) return null;

  const canPrompt = deferred !== null;
  const ios = isIOS();
  // Nothing useful to offer (e.g. Firefox desktop): stay out of the way.
  if (!canPrompt && !ios) return null;

  const install = async () => {
    if (deferred) {
      await deferred.prompt();
      const { outcome } = await deferred.userChoice;
      if (outcome === 'accepted') setInstalled(true);
      setDeferred(null);
    } else {
      setShowHelp(true);
    }
  };

  return (
    <>
      <button
        onClick={install}
        className="chip bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 hover:bg-brand-200 dark:hover:bg-brand-900/60 transition-colors"
        title="Install DeutschSprint on this device"
      >
        <Download size={15} />
        <span className="hidden sm:inline">Install</span>
      </button>

      {/* iOS Add-to-Home-Screen instructions */}
      {showHelp && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 p-4"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="card p-6 max-w-sm w-full animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-lg">Install DeutschSprint</h3>
              <button onClick={() => setShowHelp(false)} aria-label="Close">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <ol className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <Share size={18} className="text-brand-500 flex-shrink-0" />
                Tap the <strong>Share</strong> button in Safari
              </li>
              <li className="flex items-center gap-2">
                <PlusSquare size={18} className="text-brand-500 flex-shrink-0" />
                Choose <strong>Add to Home Screen</strong>
              </li>
              <li className="flex items-center gap-2">
                <Download size={18} className="text-brand-500 flex-shrink-0" />
                Tap <strong>Add</strong> — done, works offline!
              </li>
            </ol>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallButton;
