import { useNavigate } from 'react-router-dom';
import { Moon, Sun, Volume2, VolumeX, RotateCcw, Target, ArrowRight } from 'lucide-react';
import { useApp } from '../store/app';
import { isCardDue } from '../utils/srs';
import Counter from '../motion/Counter';
import Pressable from '../motion/Pressable';
import Avatar from '../ui/Avatar';
import { Stagger, Item } from '../motion/Reveal';

export default function You() {
  const navigate = useNavigate();
  const { progress, srsRecords, settings, toggleTheme, updateSettings, reset } = useApp();
  const records = Object.values(srsRecords);
  const mastered = records.filter((r) => r.box === 5).length;
  const studied = records.length;
  const due = records.filter(isCardDue).length;
  const level = Math.floor(progress.xp / 100) + 1;

  const bigStats = [
    { label: 'XP', value: progress.xp },
    { label: 'Day streak', value: progress.streak },
    { label: 'Studied', value: studied },
    { label: 'Mastered', value: mastered },
    { label: 'Reviews', value: progress.totalReviews },
    { label: 'Due now', value: due },
  ];

  return (
    <Stagger className="space-y-6">
      <Item>
        <div className="flex items-center gap-4">
          <Avatar name={settings.name} size={56} />
          <div>
            <h1 className="display text-[26px]">{settings.name || 'You'}</h1>
            <p className="mono text-faint mt-0.5">Level {level}</p>
          </div>
        </div>
      </Item>

      <Item>
        <div className="grid grid-cols-3 gap-3">
          {bigStats.map((s) => (
            <div key={s.label} className="card flex flex-col items-center py-4">
              <span className="mono text-2xl font-semibold">
                <Counter value={s.value} />
              </span>
              <span className="text-faint mt-0.5 text-center text-[11px]">{s.label}</span>
            </div>
          ))}
        </div>
      </Item>

      <Item>
        <Pressable
          onClick={() => navigate('/fluency')}
          className="card flex w-full items-center gap-4 px-5 py-4"
        >
          <span
            className="flex h-11 w-11 items-center justify-center rounded-2xl"
            style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
          >
            <Target size={20} />
          </span>
          <span className="flex-1 text-left font-semibold">Fluency map</span>
          <ArrowRight size={18} className="text-faint" />
        </Pressable>
      </Item>

      <Item>
        <p className="eyebrow text-faint mb-3">settings</p>
        <div className="card divide-y" style={{ borderColor: 'var(--line)' }}>
          <Pressable
            onClick={toggleTheme}
            className="flex w-full items-center justify-between px-5 py-4"
          >
            <span className="flex items-center gap-3">
              {settings.theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
              <span className="font-medium">Theme</span>
            </span>
            <span className="mono text-faint text-sm">{settings.theme}</span>
          </Pressable>
          <Pressable
            onClick={() => updateSettings({ ttsEnabled: !settings.ttsEnabled })}
            className="flex w-full items-center justify-between px-5 py-4"
          >
            <span className="flex items-center gap-3">
              {settings.ttsEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              <span className="font-medium">Pronounce automatically</span>
            </span>
            <span className="mono text-faint text-sm">{settings.ttsEnabled ? 'on' : 'off'}</span>
          </Pressable>
        </div>
      </Item>

      <Item>
        <button
          onClick={() => {
            if (confirm('Reset all progress? This cannot be undone.')) reset();
          }}
          className="flex w-full items-center justify-center gap-2 py-3 text-sm font-medium"
          style={{ color: 'var(--bad)' }}
        >
          <RotateCcw size={16} /> Reset all progress
        </button>
      </Item>
    </Stagger>
  );
}
