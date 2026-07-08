import { Moon, Sun } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import BoltLogo from './BoltLogo';

/**
 * First-visit theme chooser: pick Midnight or Daylight before starting.
 * Shown until a choice is made (settings.themeChosen).
 */
const ThemeOnboarding = () => {
  const updateSettings = useAppStore((s) => s.updateSettings);

  const choose = (darkMode: boolean) =>
    updateSettings({ darkMode, themeChosen: true });

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-gray-950/90 backdrop-blur-sm p-4">
      <div className="w-full max-w-md text-center animate-spring-in">
        <BoltLogo size={64} className="mx-auto mb-4 rounded-2xl shadow-glow-red" />
        <h1 className="text-3xl font-bold text-white mb-1">Willkommen! 👋</h1>
        <p className="text-gray-300 mb-8">How do you like your DeutschSprint?</p>

        <div className="grid grid-cols-2 gap-4">
          {/* Midnight */}
          <button
            onClick={() => choose(true)}
            className="group rounded-2xl p-5 text-left bg-gray-900 border-2 border-gray-700 hover:border-brand-500 hover:shadow-glow-red transition-all active:scale-[0.98]"
          >
            <div className="h-20 rounded-xl mb-4 bg-gradient-to-br from-gray-900 via-gray-800 to-brand-900 border border-gray-700 relative overflow-hidden">
              <span className="absolute bottom-2 left-2 h-1.5 w-12 rounded-full bg-brand-500" />
              <span className="absolute bottom-2 left-16 h-1.5 w-6 rounded-full bg-gold-500" />
            </div>
            <p className="font-bold text-white flex items-center gap-2">
              <Moon size={16} className="text-brand-400" /> Midnight
            </p>
            <p className="text-xs text-gray-400 mt-1">Deep ink, electric energy</p>
          </button>

          {/* Daylight */}
          <button
            onClick={() => choose(false)}
            className="group rounded-2xl p-5 text-left bg-gray-900 border-2 border-gray-700 hover:border-gold-500 hover:shadow-glow-gold transition-all active:scale-[0.98]"
          >
            <div className="h-20 rounded-xl mb-4 bg-gradient-to-br from-gray-50 via-white to-gold-300/40 border border-gray-200 relative overflow-hidden">
              <span className="absolute bottom-2 left-2 h-1.5 w-12 rounded-full bg-brand-500" />
              <span className="absolute bottom-2 left-16 h-1.5 w-6 rounded-full bg-gold-500" />
            </div>
            <p className="font-bold text-white flex items-center gap-2">
              <Sun size={16} className="text-gold-400" /> Daylight
            </p>
            <p className="text-xs text-gray-400 mt-1">Cool paper, bright & clean</p>
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          You can switch anytime in Settings.
        </p>
      </div>
    </div>
  );
};

export default ThemeOnboarding;
