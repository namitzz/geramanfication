import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Award, Layers, ArrowRight, Volume2, Target } from 'lucide-react';
import type { Card, CEFRLevel } from '../types';
import { useApp, getTodayKey } from '../store/app';
import { isCardDue } from '../utils/srs';
import { WORDS_PER_DAY, loadOrderedWords } from '../content/dailyWords';
import { dayNumber } from '../content/daily';
import { computeFluency, getLevelTotals } from '../lib/adaptive';
import { speak } from '../utils/tts';
import ProgressRing from '../motion/ProgressRing';
import Counter from '../motion/Counter';
import MagneticButton from '../motion/MagneticButton';
import StreakFlame from '../motion/StreakFlame';
import { Stagger, Item } from '../motion/Reveal';

const artTint: Record<string, string> = { der: '#5b8cff', die: '#ff6b9d', das: '#37d29a' };

function greeting() {
  const h = new Date().getHours();
  return h < 11 ? 'Guten Morgen' : h < 18 ? 'Guten Tag' : 'Guten Abend';
}

export default function Today() {
  const navigate = useNavigate();
  const { progress, srsRecords, mistakes, daily, settings } = useApp();
  const name = settings.name;

  const [wotd, setWotd] = useState<Card | null>(null);
  const [totals, setTotals] = useState<Record<CEFRLevel, number> | null>(null);
  useEffect(() => {
    loadOrderedWords().then((words) => {
      if (words.length) setWotd(words[dayNumber() % Math.min(words.length, 1500)]);
    });
    getLevelTotals().then(setTotals);
  }, []);

  const records = Object.values(srsRecords);
  const dueCount = records.filter(isCardDue).length;
  const mastered = records.filter((r) => r.box === 5).length;

  // Adaptive session mix preview (due → weak → new, capped at the goal).
  const goal = settings.dailyGoal;
  const weakVocab = Object.keys(mistakes).filter((id) => id.startsWith('vocab-')).length;
  const dueInSession = Math.min(dueCount, goal);
  const weakInSession = Math.min(weakVocab, goal - dueInSession);
  const freshInSession = Math.max(0, goal - dueInSession - weakInSession);
  const fluency = totals ? computeFluency(srsRecords, mistakes, totals) : null;

  const doneToday = daily.date === getTodayKey() ? daily.cursor - daily.dayStart : 0;
  const target = WORDS_PER_DAY;
  const ringProgress = Math.min(1, doneToday / target);
  const finished = doneToday >= target;
  const level = Math.floor(progress.xp / 100) + 1;

  const stats = [
    { icon: Flame, value: progress.streak, label: 'streak', tint: 'var(--flame-3)' },
    { icon: Award, value: mastered, label: 'mastered', tint: 'var(--good)' },
    { icon: Layers, value: dueCount, label: 'due', tint: 'var(--accent)' },
  ];

  return (
    <Stagger className="space-y-7">
      <Item>
        <p className="text-muted text-sm">
          {greeting()}
          {name ? `, ${name}` : ''} 👋
        </p>
        <h1 className="display mt-1 text-[30px]">
          Level {level}
          <span className="mono text-faint ml-2 align-middle text-base">· {progress.xp} XP</span>
        </h1>
        <div className="mt-2 text-sm">
          {progress.streak > 0 ? (
            <span className="text-muted inline-flex items-center gap-2">
              <StreakFlame count={progress.streak} /> day{progress.streak > 1 ? 's' : ''} strong
            </span>
          ) : (
            <span className="text-faint">Start your streak today 🔥</span>
          )}
        </div>
      </Item>

      {/* Daily ring */}
      <Item className="flex flex-col items-center py-2">
        <ProgressRing progress={ringProgress} size={190} stroke={13} gradient>
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

      {/* Word of the day */}
      {wotd && (
        <Item>
          <div className="card flex items-center gap-4 px-5 py-4">
            <button
              onClick={() => speak(wotd.de, 'de-DE')}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
              style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
              aria-label="Pronounce"
            >
              <Volume2 size={20} />
            </button>
            <div className="min-w-0 flex-1">
              <p className="eyebrow text-faint">word of the day</p>
              <p lang="de" className="truncate font-medium">
                {wotd.article && <span style={{ color: artTint[wotd.article] }}>{wotd.article} </span>}
                {wotd.de}
              </p>
              <p className="text-faint truncate text-sm">{wotd.en}</p>
            </div>
          </div>
        </Item>
      )}

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
              {finished ? 'Done for today ✓' : doneToday > 0 ? 'Continue focus' : 'Start your focus'}
            </span>
            <span className="text-sm opacity-80">
              {finished
                ? 'Come back tomorrow'
                : `${dueInSession} due · ${weakInSession} weak · ${freshInSession} new`}
            </span>
          </span>
          <ArrowRight size={22} />
        </MagneticButton>
      </Item>

      {/* Fluency — proof of progress (the USP) */}
      {fluency && (
        <Item>
          <button
            onClick={() => navigate('/fluency')}
            className="card flex w-full items-center gap-4 px-5 py-4"
          >
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
              style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
            >
              <Target size={22} />
            </span>
            <span className="min-w-0 flex-1 text-left">
              <span className="block font-semibold">Fluency</span>
              <span className="text-faint text-sm">
                {fluency.conversationalPct}% to conversational · {fluency.masteredTotal} mastered
              </span>
            </span>
            <ArrowRight size={18} className="text-faint" />
          </button>
        </Item>
      )}

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
