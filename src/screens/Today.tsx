import { useNavigate } from 'react-router-dom';
import { Flame, Award, Layers, ArrowRight } from 'lucide-react';
import { useApp, getTodayKey } from '../store/app';
import { isCardDue } from '../utils/srs';
import { WORDS_PER_DAY } from '../content/dailyWords';
import ProgressRing from '../motion/ProgressRing';
import Counter from '../motion/Counter';
import MagneticButton from '../motion/MagneticButton';
import { Stagger, Item } from '../motion/Reveal';

function greeting() {
  const h = new Date().getHours();
  return h < 11 ? 'Guten Morgen' : h < 18 ? 'Guten Tag' : 'Guten Abend';
}

export default function Today() {
  const navigate = useNavigate();
  const { progress, srsRecords, daily } = useApp();

  const records = Object.values(srsRecords);
  const dueCount = records.filter(isCardDue).length;
  const mastered = records.filter((r) => r.box === 5).length;

  const doneToday = daily.date === getTodayKey() ? daily.cursor - daily.dayStart : 0;
  const target = WORDS_PER_DAY;
  const ringProgress = Math.min(1, doneToday / target);
  const finished = doneToday >= target;
  const level = Math.floor(progress.xp / 100) + 1;

  const stats = [
    { icon: Flame, value: progress.streak, label: 'streak', tint: '#ff9f43' },
    { icon: Award, value: mastered, label: 'mastered', tint: 'var(--good)' },
    { icon: Layers, value: dueCount, label: 'due', tint: 'var(--accent)' },
  ];

  return (
    <Stagger className="space-y-7">
      <Item>
        <p className="text-muted text-sm">{greeting()} 👋</p>
        <h1 className="display mt-1 text-[30px]">
          Level {level}
          <span className="mono text-faint ml-2 align-middle text-base">· {progress.xp} XP</span>
        </h1>
      </Item>

      {/* Daily ring */}
      <Item className="flex flex-col items-center py-2">
        <ProgressRing progress={ringProgress} size={190} stroke={13}>
          <span className="mono text-4xl font-semibold">
            <Counter value={doneToday} />
            <span className="text-faint text-2xl">/{target}</span>
          </span>
          <span className="text-faint mt-1 text-sm">words today</span>
        </ProgressRing>
      </Item>

      {/* Stat chips */}
      <Item>
        <div className="grid grid-cols-3 gap-3">
          {stats.map(({ icon: Icon, value, label, tint }) => (
            <div key={label} className="card flex flex-col items-center gap-1 py-4">
              <Icon size={18} style={{ color: tint }} />
              <span className="mono text-2xl font-semibold">
                <Counter value={value} />
              </span>
              <span className="text-faint text-[11px]">{label}</span>
            </div>
          ))}
        </div>
      </Item>

      {/* Primary CTA */}
      <Item>
        <MagneticButton
          onClick={() => navigate('/session')}
          className="flex w-full items-center justify-between rounded-3xl px-6 py-5 text-left font-semibold"
          style={{
            background: finished ? 'var(--surface)' : 'var(--accent)',
            color: finished ? 'var(--ink)' : 'var(--accent-ink)',
            border: finished ? '1px solid var(--line)' : 'none',
          }}
        >
          <span>
            <span className="block text-lg">
              {finished ? 'Done for today ✓' : doneToday > 0 ? 'Continue' : "Today's words"}
            </span>
            <span className="text-sm opacity-80">
              {finished ? 'Come back tomorrow' : `${target - doneToday} to go`}
            </span>
          </span>
          <ArrowRight size={22} />
        </MagneticButton>
      </Item>

      {dueCount > 0 && (
        <Item>
          <button
            onClick={() => navigate('/review')}
            className="card flex w-full items-center justify-between px-5 py-4"
          >
            <span className="flex items-center gap-3">
              <Layers size={20} style={{ color: 'var(--accent)' }} />
              <span className="text-left">
                <span className="block font-semibold">Review</span>
                <span className="text-faint text-sm">{dueCount} due from spaced repetition</span>
              </span>
            </span>
            <ArrowRight size={18} className="text-faint" />
          </button>
        </Item>
      )}
    </Stagger>
  );
}
