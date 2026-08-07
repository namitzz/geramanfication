import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useReducedMotion, type PanInfo } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import type { Card } from '../../types';
import { speak } from '../../utils/tts';
import { useApp } from '../../store/app';
import { spring } from '../../motion/springs';

const SWIPE = 110;
const genderTint: Record<string, string> = {
  der: '#5b8cff',
  die: '#ff6b9d',
  das: '#37d29a',
};

/** Tap to flip (3D), drag right = got it, drag left = again. */
export default function Flashcard({
  card,
  onGrade,
}: {
  card: Card;
  onGrade: (correct: boolean) => void;
}) {
  const reduce = useReducedMotion();
  const ttsEnabled = useApp((s) => s.settings.ttsEnabled);
  const [flipped, setFlipped] = useState(false);
  const dragged = useRef(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-180, 180], [-11, 11]);
  const gotOpacity = useTransform(x, [30, 120], [0, 1]);
  const againOpacity = useTransform(x, [-120, -30], [1, 0]);
  const glow = useTransform(
    x,
    [-140, 0, 140],
    ['0 0 0 1.5px var(--bad)', '0 0 0 1px var(--line)', '0 0 0 1.5px var(--good)'],
  );

  useEffect(() => {
    setFlipped(false);
    x.set(0);
    if (ttsEnabled) {
      const id = setTimeout(() => speak(card.de, 'de-DE'), 320);
      return () => clearTimeout(id);
    }
  }, [card.id, card.de, ttsEnabled, x]);

  const onDragEnd = (_e: unknown, info: PanInfo) => {
    const pass = Math.abs(info.offset.x) > SWIPE || Math.abs(info.velocity.x) > 550;
    if (pass) {
      if (navigator.vibrate) navigator.vibrate(8);
      onGrade(info.offset.x > 0);
    }
    setTimeout(() => (dragged.current = false), 0);
  };

  const tint = card.article ? genderTint[card.article] : undefined;

  return (
    <div className="relative flex flex-col items-center">
      {/* depth stack behind */}
      <div className="pointer-events-none absolute inset-x-6 top-4 h-full">
        <div className="card h-full opacity-40" style={{ transform: 'scale(0.94) translateY(10px)' }} />
      </div>

      <motion.div
        className="relative z-10 w-full"
        drag={reduce ? false : 'x'}
        dragSnapToOrigin
        dragElastic={0.5}
        style={{ x, rotate }}
        onDragStart={() => (dragged.current = true)}
        onDragEnd={onDragEnd}
        onClick={() => {
          if (!dragged.current) setFlipped((f) => !f);
        }}
        whileTap={reduce ? undefined : { scale: 0.99 }}
      >
        <motion.div
          className="relative"
          style={{ transformStyle: 'preserve-3d', boxShadow: glow }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={spring.gentle}
        >
          {/* Front — German */}
          <div
            className="card flex min-h-[340px] flex-col items-center justify-center p-8 text-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <p className="eyebrow text-faint mb-5">{card.level ?? 'A1'}</p>
            <h2 lang="de" className="display text-[40px]">
              {card.article && <span style={{ color: tint }}>{card.article} </span>}
              {card.de}
            </h2>
            {card.partOfSpeech && (
              <p className="text-faint mt-3 text-sm italic">{card.partOfSpeech}</p>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                speak(card.de, 'de-DE');
              }}
              className="glass mt-7 flex h-12 w-12 items-center justify-center rounded-full"
              style={{ color: 'var(--accent)' }}
              aria-label="Pronounce"
            >
              <Volume2 size={20} />
            </button>
            <p className="text-faint mt-6 text-xs">tap to flip · swipe to grade</p>
          </div>

          {/* Back — English */}
          <div
            className="card absolute inset-0 flex min-h-[340px] flex-col items-center justify-center p-8 text-center"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <p className="eyebrow text-faint mb-5">meaning</p>
            <h2 className="display text-[34px]" style={{ color: 'var(--good)' }}>
              {card.en}
            </h2>
            {card.exampleDe && (
              <p lang="de" className="text-muted mt-5 text-[15px] italic leading-6">
                „{card.exampleDe}“
              </p>
            )}
            {card.exampleEn && <p className="text-faint mt-1 text-sm">{card.exampleEn}</p>}
          </div>
        </motion.div>

        {/* swipe verdict overlays */}
        <motion.div
          style={{ opacity: gotOpacity }}
          className="pointer-events-none absolute right-5 top-5 rounded-xl border px-3 py-1 text-sm font-bold"
        >
          <span style={{ color: 'var(--good)' }}>GOT IT</span>
        </motion.div>
        <motion.div
          style={{ opacity: againOpacity }}
          className="pointer-events-none absolute left-5 top-5 rounded-xl border px-3 py-1 text-sm font-bold"
        >
          <span style={{ color: 'var(--bad)' }}>AGAIN</span>
        </motion.div>
      </motion.div>

      {/* explicit buttons (accessibility + reduced-motion fallback) */}
      <div className="z-10 mt-7 grid w-full grid-cols-2 gap-3">
        <button
          onClick={() => onGrade(false)}
          className="rounded-2xl py-4 text-[15px] font-bold"
          style={{ background: 'var(--bad-soft)', color: 'var(--bad)' }}
        >
          Again
        </button>
        <button
          onClick={() => onGrade(true)}
          className="rounded-2xl py-4 text-[15px] font-bold"
          style={{ background: 'var(--good-soft)', color: 'var(--good)' }}
        >
          Got it
        </button>
      </div>
    </div>
  );
}
