import type { ReactNode } from 'react';
import { useAppStore } from '../stores/appStore';
import { Moon, Sun, Type, Volume2, Target, RotateCcw } from 'lucide-react';

/** A pill toggle switch in the brand color. */
const Toggle = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
  <button
    role="switch"
    aria-checked={on}
    onClick={onClick}
    className={`relative w-14 h-7 rounded-full transition-colors flex-shrink-0 ${
      on ? 'bg-brand-600' : 'bg-gray-300 dark:bg-gray-600'
    }`}
  >
    <span
      className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
        on ? 'translate-x-7' : ''
      }`}
    />
  </button>
);

/** A settings card: icon + title + subtitle, with optional control/body. */
const Row = ({
  icon,
  title,
  subtitle,
  control,
  children,
  danger,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  control?: ReactNode;
  children?: ReactNode;
  danger?: boolean;
}) => (
  <div className="card p-5">
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className={danger ? 'text-red-500' : 'text-brand-500'}>{icon}</span>
        <div>
          <h3 className={`font-semibold ${danger ? 'text-red-500' : ''}`}>{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
        </div>
      </div>
      {control}
    </div>
    {children && <div className="mt-4">{children}</div>}
  </div>
);

const SettingsPage = () => {
  const { settings, updateSettings, resetAllData } = useAppStore();

  const handleReset = () => {
    if (
      window.confirm(
        'Reset all your progress? This cannot be undone.'
      )
    ) {
      resetAllData();
    }
  };

  return (
    <div className="space-y-6">
      <header className="mb-2">
        <h1 className="text-3xl font-bold">Settings</h1>
      </header>

      <div className="space-y-3 stagger">
        <Row
          icon={settings.darkMode ? <Moon size={22} /> : <Sun size={22} />}
          title="Dark Mode"
          subtitle="Light or dark theme"
          control={
            <Toggle
              on={settings.darkMode}
              onClick={() => updateSettings({ darkMode: !settings.darkMode })}
            />
          }
        />

        <Row
          icon={<Volume2 size={22} />}
          title="Auto Audio"
          subtitle="Automatically pronounce German words"
          control={
            <Toggle
              on={settings.ttsEnabled}
              onClick={() => updateSettings({ ttsEnabled: !settings.ttsEnabled })}
            />
          }
        />

        <Row
          icon={<Type size={22} />}
          title="Dyslexic-Friendly Font"
          subtitle="Use OpenDyslexic"
          control={
            <Toggle
              on={settings.dyslexicFont}
              onClick={() => {
                updateSettings({ dyslexicFont: !settings.dyslexicFont });
                document.body.classList.toggle('dyslexic-font');
              }}
            />
          }
        />

        <Row icon={<Type size={22} />} title="Font Size" subtitle="Text readability">
          <div className="flex gap-2">
            {(['small', 'medium', 'large'] as const).map((size) => (
              <button
                key={size}
                onClick={() => updateSettings({ fontSize: size })}
                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                  settings.fontSize === size
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {size[0].toUpperCase() + size.slice(1)}
              </button>
            ))}
          </div>
        </Row>

        <Row icon={<Target size={22} />} title="Daily Goal" subtitle="Reviews per day">
          <input
            type="number"
            min={5}
            max={100}
            value={settings.dailyGoal}
            onChange={(e) =>
              updateSettings({ dailyGoal: parseInt(e.target.value) || 20 })
            }
            className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:border-brand-500"
          />
        </Row>

        <Row
          icon={<RotateCcw size={22} />}
          title="Reset All Data"
          subtitle="Delete all progress and settings"
          danger
        >
          <button
            onClick={handleReset}
            className="btn w-full py-3 bg-red-500 hover:bg-red-600 text-white"
          >
            Reset Everything
          </button>
        </Row>
      </div>
    </div>
  );
};

export default SettingsPage;
