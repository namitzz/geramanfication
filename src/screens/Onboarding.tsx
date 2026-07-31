import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import type { CEFRLevel } from '../types';
import { getLevelOffsets, type LevelOffset } from '../content/dailyWords';
import { useApp } from '../store/app';
import { LogoMark } from '../ui/Logo';
import { APP_NAME } from '../brand';
import MagneticButton from '../motion/MagneticButton';
import Pressable from '../motion/Pressable';
import { spring } from '../motion/springs';

const LEVEL_BLURB: Record<CEFRLevel, string> = {
  A1: 'Brand new to German',
  A2: 'Know the basics',
  B1: 'Can hold a conversation',
  B2: 'Comfortable & fluent-ish',
  C1: 'Advanced — refining',
};
const GOALS = [10, 20, 30, 50];

export default function Onboarding() {
  const navigate = useNavigate();
  const { completeOnboarding, jumpDailyTo, updateSettings } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [level, setLevel] = useState<CEFRLevel | null>(null);
  const [goal, setGoal] = useState(20);
  const [offsets, setOffsets] = useState<LevelOffset[]>([]);

  useEffect(() => {
    getLevelOffsets().then(setOffsets);
  }, []);

  const finish = () => {
    const off = offsets.find((o) => o.level === level)?.offset ?? 0;
    updateSettings({ name: name.trim(), dailyGoal: goal });
    jumpDailyTo(off);
    completeOnboarding();
    navigate('/', { replace: true });
  };

  const canNext = step === 0 ? name.trim().length > 0 : step === 1 ? !!level : true;
  const next = () => (step < 2 ? setStep((s) => s + 1) : finish());

  const slide = {
    initial: { opacity: 0, x: 24 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -24 },
    transition: spring.snappy,
  };

  return (
    <div className="flex min-h-[88vh] flex-col">
      <div className="pt-6">
        <span className="inline-flex items-center gap-2">
          <LogoMark size={22} />
          <span className="text-sm font-semibold lowercase" style={{ color: 'var(--ink)' }}>
            {APP_NAME}
          </span>
        </span>
        <div className="mt-3 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full"
              style={{ background: i <= step ? 'var(--accent)' : 'var(--line)' }}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="name" {...slide}>
              <h1 className="display text-[34px] mb-2">Hallo! 👋</h1>
              <p className="text-muted mb-8">What should we call you?</p>
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && canNext && next()}
                placeholder="Your name"
                maxLength={24}
                className="glass w-full rounded-2xl px-5 py-4 text-lg outline-none placeholder:text-faint"
                style={{ borderColor: 'var(--line-strong)', borderWidth: 1 }}
              />
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="lvl" {...slide}>
              <h1 className="display text-[34px] mb-2">Where are you starting?</h1>
              <p className="text-muted mb-8">We'll begin your daily words at the right level.</p>
              <div className="space-y-2.5">
                {(Object.keys(LEVEL_BLURB) as CEFRLevel[]).map((lv) => {
                  const on = level === lv;
                  return (
                    <Pressable
                      key={lv}
                      onClick={() => setLevel(lv)}
                      className="card flex w-full items-center px-5 py-4 text-left"
                      style={on ? { borderColor: 'var(--accent)', background: 'var(--accent-soft)' } : undefined}
                    >
                      <span className="mono text-lg font-semibold" style={{ color: on ? 'var(--accent)' : 'var(--ink)' }}>
                        {lv}
                      </span>
                      <span className="text-muted ml-3 text-sm">{LEVEL_BLURB[lv]}</span>
                    </Pressable>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="goal" {...slide}>
              <h1 className="display text-[34px] mb-2">Daily goal</h1>
              <p className="text-muted mb-8">How many words a day feels right?</p>
              <div className="grid grid-cols-2 gap-3">
                {GOALS.map((g) => {
                  const on = goal === g;
                  return (
                    <Pressable
                      key={g}
                      onClick={() => setGoal(g)}
                      className="card px-5 py-6 text-center"
                      style={on ? { borderColor: 'var(--accent)', background: 'var(--accent-soft)' } : undefined}
                    >
                      <span className="mono block text-3xl font-semibold" style={{ color: on ? 'var(--accent)' : 'var(--ink)' }}>
                        {g}
                      </span>
                      <span className="text-faint text-xs">words / day</span>
                    </Pressable>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="pb-4">
        <MagneticButton
          onClick={next}
          disabled={!canNext}
          className="w-full rounded-2xl py-4 font-semibold"
          style={{
            background: canNext ? 'var(--accent)' : 'var(--surface)',
            color: canNext ? 'var(--accent-ink)' : 'var(--faint)',
          }}
        >
          {step === 2 ? 'Start learning' : 'Continue'}
        </MagneticButton>
      </div>
    </div>
  );
}
