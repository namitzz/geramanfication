import { useAppStore } from '../stores/appStore';
import { Moon, Sun, Type, Volume2, Target, RotateCcw } from 'lucide-react';

const SettingsPage = () => {
  const { settings, updateSettings, resetAllData } = useAppStore();

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all your progress? This cannot be undone.')) {
      resetAllData();
      alert('All data has been reset.');
    }
  };

  return (
    <div className="space-y-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Customize your learning experience
        </p>
      </header>

      <div className="space-y-4">
        {/* Dark Mode */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.darkMode ? <Moon size={24} /> : <Sun size={24} />}
              <div>
                <h3 className="font-semibold">Dark Mode</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Switch between light and dark themes
                </p>
              </div>
            </div>
            <button
              onClick={() => updateSettings({ darkMode: !settings.darkMode })}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                settings.darkMode ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.darkMode ? 'translate-x-7' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* TTS */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 size={24} />
              <div>
                <h3 className="font-semibold">Text-to-Speech</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enable pronunciation audio
                </p>
              </div>
            </div>
            <button
              onClick={() => updateSettings({ ttsEnabled: !settings.ttsEnabled })}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                settings.ttsEnabled ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.ttsEnabled ? 'translate-x-7' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Dyslexic Font */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Type size={24} />
              <div>
                <h3 className="font-semibold">Dyslexic-Friendly Font</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Use OpenDyslexic font
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                updateSettings({ dyslexicFont: !settings.dyslexicFont });
                document.body.classList.toggle('dyslexic-font');
              }}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                settings.dyslexicFont ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.dyslexicFont ? 'translate-x-7' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Font Size */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex items-center gap-3 mb-4">
            <Type size={24} />
            <div>
              <h3 className="font-semibold">Font Size</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Adjust text size for better readability
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {(['small', 'medium', 'large'] as const).map((size) => (
              <button
                key={size}
                onClick={() => updateSettings({ fontSize: size })}
                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                  settings.fontSize === size
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Daily Goal */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex items-center gap-3 mb-4">
            <Target size={24} />
            <div>
              <h3 className="font-semibold">Daily Goal</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Set your daily review target
              </p>
            </div>
          </div>
          <input
            type="number"
            min="5"
            max="100"
            value={settings.dailyGoal}
            onChange={(e) => updateSettings({ dailyGoal: parseInt(e.target.value) || 20 })}
            className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Reset Data */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex items-center gap-3 mb-4">
            <RotateCcw size={24} className="text-red-500" />
            <div>
              <h3 className="font-semibold text-red-500">Reset All Data</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Delete all progress and settings
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="w-full py-3 px-6 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
          >
            Reset Everything
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
