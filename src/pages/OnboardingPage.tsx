import { useState } from 'react';
import { Fuchs } from '../components/Fuchs';
import { useAppStore } from '../stores/appStore';

/* ---- Step content (copy from the design handoff) ---- */

const KICKERS = ['Welcome', 'Your goal', 'Your level', 'Daily habit'];
const TITLES = ['Meet Fuchs', 'What brings you here?', 'Where are you now?', 'How much a day?'];
const SUBS = [
  'Your Black Forest fox, and your guide up the Trail.',
  'We tune every drill to what matters most to you.',
  'CEFR levels, so we start you at the right depth.',
  'Small and steady keeps your streak — and your German — alive.',
];

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  width: 26,
  height: 26,
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const GOALS = [
  {
    title: 'Travel',
    desc: 'Order, ask, explore',
    icon: (
      <svg {...iconProps} stroke="currentColor">
        <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2.5 1.5V22l4-1 4 1v-1.5L13 19v-5.5l8 2.5z" />
      </svg>
    ),
  },
  {
    title: 'Work & career',
    desc: 'Emails and meetings',
    icon: (
      <svg {...iconProps} stroke="currentColor">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    ),
  },
  {
    title: 'People',
    desc: 'Family, friends, dating',
    icon: (
      <svg {...iconProps} stroke="currentColor">
        <circle cx="9" cy="9" r="3.2" />
        <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
        <circle cx="17.5" cy="10" r="2.6" />
        <path d="M15.2 20a5 5 0 0 1 8.3-3.2" />
      </svg>
    ),
  },
  {
    title: 'Sharpen my mind',
    desc: 'A good daily habit',
    icon: (
      <svg {...iconProps} stroke="currentColor">
        <path d="M9.5 2a5.5 5.5 0 0 0-3 10.1V16a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2v-3.9A5.5 5.5 0 0 0 9.5 2Z" />
        <path d="M8 21h3" />
      </svg>
    ),
  },
];

const LEVELS = [
  { code: 'A1', label: 'Beginner', title: 'A1 · Beginner', desc: "Starting from zero — we'll build your first words and phrases from the ground up." },
  { code: 'A2', label: 'Elementary', title: 'A2 · Elementary', desc: 'You know a few words and phrases — time to link them into everyday sentences.' },
  { code: 'B1', label: 'Intermediate', title: 'B1 · Intermediate', desc: 'You can hold a chat — we sharpen grammar, cases and range.' },
  { code: 'C1', label: 'Advanced', title: 'C1 · Advanced', desc: 'Polishing the edges — nuance, idiom and precision.' },
];
const TRACK_FILL = ['6%', '35%', '63%', '88%'];

const DAILY = [
  { min: '5', label: 'Casual', sub: '5 min / day', xpGoal: 30 },
  { min: '10', label: 'Regular', sub: '10 min / day', xpGoal: 50 },
  { min: '15', label: 'Serious', sub: '15 min / day', xpGoal: 80 },
  { min: '30', label: 'Intense', sub: '30 min / day', xpGoal: 150 },
];

/**
 * First-run onboarding: Meet Fuchs → goal (2x2 grid) → CEFR level track →
 * daily habit. Gates the app until completed; re-runnable from the You tab.
 */
const OnboardingFlow = () => {
  const { onboarding, updateOnboarding, updateSettings } = useAppStore();
  const [step, setStep] = useState(0);

  const canNext =
    step === 0 ||
    (step === 1 && onboarding.goal !== null) ||
    step === 2 ||
    (step === 3 && onboarding.daily !== null);

  const next = () => {
    if (step >= 3) {
      // Daily habit choice also sets the XP day-goal for the header bar.
      const chosen = DAILY[onboarding.daily ?? 1];
      updateSettings({ dailyGoal: chosen.xpGoal });
      updateOnboarding({ done: true });
      return;
    }
    setStep(step + 1);
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-[26px] pb-7 pt-14">
      {/* progress dots */}
      <div className="mb-7 flex gap-[7px]">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-[5px] flex-1 rounded-full transition-colors duration-300"
            style={{ background: i <= step ? 'var(--primary)' : 'var(--ring)' }}
          />
        ))}
      </div>

      <p className="fr eyebrow mb-1.5" style={{ color: 'var(--primary)' }}>
        {KICKERS[step]}
      </p>
      <h1 className="fr mb-2 text-[29px] font-semibold leading-[1.08]" style={{ color: 'var(--ink)' }}>
        {TITLES[step]}
      </h1>
      <p className="mb-6 max-w-[300px] text-[15px] leading-[1.45]" style={{ color: 'var(--muted)' }}>
        {SUBS[step]}
      </p>

      {/* Step 0 — Meet Fuchs */}
      {step === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="fx-breathe">
            <Fuchs variant="kit" size={140} />
          </div>
          <p className="fr mt-5 text-[22px] font-semibold" style={{ color: 'var(--ink)' }}>
            Hallo, I'm Fuchs.
          </p>
          <p className="mt-1.5 max-w-[250px] text-sm leading-6" style={{ color: 'var(--muted)' }}>
            Feed me German and I'll grow from a scruffy kit into a sharp, bright fox.
          </p>
        </div>
      )}

      {/* Step 1 — Goal 2x2 grid, fill-on-select */}
      {step === 1 && (
        <div className="grid grid-cols-2 gap-3">
          {GOALS.map((g, i) => {
            const sel = onboarding.goal === i;
            return (
              <button
                key={g.title}
                onClick={() => updateOnboarding({ goal: i })}
                className="press relative rounded-[20px] p-4 text-left transition-all duration-150"
                style={
                  sel
                    ? { background: 'var(--grad-soft)', border: '1.5px solid transparent' }
                    : { background: 'var(--surface)', border: '1.5px solid var(--line)' }
                }
              >
                <span className="block" style={{ color: sel ? '#fff' : 'var(--primary)' }}>
                  {g.icon}
                </span>
                <span
                  className="absolute right-3.5 top-3.5 flex h-[18px] w-[18px] items-center justify-center rounded-full text-[11px] font-extrabold"
                  style={
                    sel
                      ? { background: '#fff', color: 'var(--primary)' }
                      : { border: '1.5px solid var(--line)' }
                  }
                >
                  {sel ? '✓' : ''}
                </span>
                <span className="fr mt-3.5 block text-[15px] font-semibold" style={{ color: sel ? '#fff' : 'var(--ink)' }}>
                  {g.title}
                </span>
                <span className="mt-1 block text-xs leading-[1.35]" style={{ color: sel ? '#E4E1FF' : 'var(--faint)' }}>
                  {g.desc}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Step 2 — Level track (progression encoded left→right) */}
      {step === 2 && (
        <>
          <div className="relative mx-0.5 mb-6 pt-1.5">
            <div className="absolute left-[6%] right-[6%] top-[31px] h-[3px] rounded" style={{ background: 'var(--line)' }} />
            <div
              className="absolute left-[6%] top-[31px] h-[3px] rounded transition-all duration-300"
              style={{ width: TRACK_FILL[onboarding.level], background: 'var(--grad-soft)' }}
            />
            <div className="relative flex justify-between">
              {LEVELS.map((l, i) => {
                const active = onboarding.level === i;
                return (
                  <button
                    key={l.code}
                    onClick={() => updateOnboarding({ level: i })}
                    className="press flex w-1/4 flex-col items-center gap-2.5"
                  >
                    <span
                      className="fr flex h-[50px] w-[50px] items-center justify-center rounded-full text-[15px] font-semibold transition-all duration-150"
                      style={
                        active
                          ? {
                              background: 'var(--grad-soft)',
                              color: '#fff',
                              transform: 'scale(1.12)',
                              boxShadow: '0 6px 16px -4px rgba(78,71,201,.5)',
                            }
                          : {
                              background: 'var(--surface)',
                              border: '2px solid var(--line)',
                              color: 'var(--faint)',
                            }
                      }
                    >
                      {l.code}
                    </span>
                    <span className="text-center text-[11px] font-semibold" style={{ color: active ? 'var(--ink)' : 'var(--faint)' }}>
                      {l.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="bg-grad-deep rounded-[20px] p-[22px] text-white">
            <p className="fr mb-1 text-xl font-semibold">{LEVELS[onboarding.level].title}</p>
            <p className="text-[13.5px] leading-6" style={{ color: '#D9D6FA' }}>
              {LEVELS[onboarding.level].desc}
            </p>
          </div>
        </>
      )}

      {/* Step 3 — Daily habit rows */}
      {step === 3 && (
        <div className="flex flex-col gap-2.5">
          {DAILY.map((d, i) => {
            const sel = onboarding.daily === i;
            return (
              <button
                key={d.label}
                onClick={() => updateOnboarding({ daily: i })}
                className="press flex w-full items-center gap-3.5 rounded-2xl p-3.5 text-left transition-colors duration-150"
                style={{
                  background: 'var(--surface)',
                  border: `1.5px solid ${sel ? 'var(--primary)' : 'var(--line)'}`,
                }}
              >
                <span
                  className="fr flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-base font-semibold"
                  style={sel ? { background: 'var(--primary)', color: '#fff' } : { background: 'var(--surface2)', color: 'var(--primary)' }}
                >
                  {d.min}
                </span>
                <span className="flex-1">
                  <span className="block text-[15px] font-semibold" style={{ color: 'var(--ink)' }}>
                    {d.label}
                  </span>
                  <span className="block text-[13px]" style={{ color: 'var(--muted)' }}>
                    {d.sub}
                  </span>
                </span>
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full text-[13px] font-extrabold text-white"
                  style={{ background: sel ? 'var(--primary)' : 'transparent' }}
                >
                  {sel ? '✓' : ''}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-auto pt-6">
        <button
          onClick={next}
          disabled={!canNext}
          className="btn-primary press w-full py-4 text-base"
          style={!canNext ? { background: 'var(--ring)', color: 'var(--faint)', boxShadow: 'none' } : undefined}
        >
          {step >= 3 ? 'Start learning →' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default OnboardingFlow;
