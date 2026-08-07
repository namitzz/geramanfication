import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Moon,
  Sun,
  Volume2,
  VolumeX,
  RotateCcw,
  Target,
  ArrowRight,
  Bell,
  BellOff,
  Download,
  Upload,
  Cloud,
} from 'lucide-react';
import { useApp } from '../store/app';
import { isCardDue } from '../utils/srs';
import {
  notificationsSupported,
  notificationPermission,
  requestNotificationPermission,
} from '../utils/notifications';
import { exportData, importData } from '../utils/backup';
import { syncEnabled } from '../lib/supabase';
import Counter from '../motion/Counter';
import Pressable from '../motion/Pressable';
import Avatar from '../ui/Avatar';
import { Stagger, Item } from '../motion/Reveal';

export default function You() {
  const navigate = useNavigate();
  const { progress, srsRecords, settings, toggleTheme, updateSettings, reset } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);
  const [notice, setNotice] = useState('');

  const toggleReminder = async () => {
    if (settings.reminderEnabled) {
      updateSettings({ reminderEnabled: false });
      return;
    }
    if (!notificationsSupported()) {
      setNotice('This browser can’t show notifications.');
      return;
    }
    const perm =
      notificationPermission() === 'granted'
        ? 'granted'
        : await requestNotificationPermission();
    if (perm === 'granted') {
      updateSettings({ reminderEnabled: true });
      setNotice('');
    } else {
      setNotice('Allow notifications in your browser to get reminders.');
    }
  };

  const onImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const ok = await importData(file);
    if (ok) {
      setNotice('Backup restored — reloading…');
      setTimeout(() => window.location.reload(), 600);
    } else {
      setNotice('That file isn’t a valid Tovo backup.');
    }
  };
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

      {syncEnabled() && (
        <Item>
          <Pressable
            onClick={() => navigate('/account')}
            className="card flex w-full items-center gap-4 px-5 py-4"
          >
            <span
              className="flex h-11 w-11 items-center justify-center rounded-2xl"
              style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
            >
              <Cloud size={20} />
            </span>
            <span className="flex-1 text-left font-semibold">Account &amp; sync</span>
            <ArrowRight size={18} className="text-faint" />
          </Pressable>
        </Item>
      )}

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
          <Pressable
            onClick={toggleReminder}
            className="flex w-full items-center justify-between px-5 py-4"
          >
            <span className="flex items-center gap-3">
              {settings.reminderEnabled ? <Bell size={18} /> : <BellOff size={18} />}
              <span className="font-medium">Daily reminder</span>
            </span>
            <span className="mono text-faint text-sm">
              {settings.reminderEnabled ? 'on' : 'off'}
            </span>
          </Pressable>
          {settings.reminderEnabled && (
            <div className="flex items-center justify-between px-5 py-4">
              <label htmlFor="reminder-time" className="flex items-center gap-3">
                <span className="w-[18px]" aria-hidden />
                <span className="font-medium">Remind me at</span>
              </label>
              <input
                id="reminder-time"
                type="time"
                value={settings.reminderTime}
                onChange={(e) => updateSettings({ reminderTime: e.target.value })}
                className="mono rounded-lg bg-transparent px-2 py-1 text-sm"
                style={{ border: '1px solid var(--line-strong)', color: 'var(--ink)' }}
              />
            </div>
          )}
        </div>
        {notice && <p className="text-faint mt-2 px-1 text-[13px]">{notice}</p>}
      </Item>

      <Item>
        <p className="eyebrow text-faint mb-3">your data</p>
        <div className="card divide-y" style={{ borderColor: 'var(--line)' }}>
          <Pressable
            onClick={exportData}
            className="flex w-full items-center justify-between px-5 py-4"
          >
            <span className="flex items-center gap-3">
              <Download size={18} />
              <span className="font-medium">Export backup</span>
            </span>
            <ArrowRight size={16} className="text-faint" />
          </Pressable>
          <Pressable
            onClick={() => fileRef.current?.click()}
            className="flex w-full items-center justify-between px-5 py-4"
          >
            <span className="flex items-center gap-3">
              <Upload size={18} />
              <span className="font-medium">Restore backup</span>
            </span>
            <ArrowRight size={16} className="text-faint" />
          </Pressable>
        </div>
        <p className="text-faint mt-2 px-1 text-[13px]">
          Save your progress to a file, or move it to another device. Your data stays on this device
          until you sign in.
        </p>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          onChange={onImport}
          className="hidden"
          aria-hidden
        />
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
        <button
          onClick={() => navigate('/privacy')}
          className="text-faint mt-1 w-full py-2 text-center text-[13px] underline"
        >
          Privacy
        </button>
      </Item>
    </Stagger>
  );
}
