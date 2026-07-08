import { useEffect, useState } from 'react';
import type { Card } from '../../types';
import type { SrsGrade } from '../../utils/srs';
import { speak } from '../../utils/tts';
import { useAppStore } from '../../stores/appStore';
import { sfxCorrect, sfxWrong } from '../../utils/sfx';

interface FlashcardProps {
  card: Card;
  /** Three-grade SRS answer: Again (box 1) / Good (+1) / Easy (+2). */
  onGrade: (grade: SrsGrade) => void;
}

const SpeakerIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
    <path d="M4 9h3l4-3v12l-4-3H4z" fill="currentColor" />
    <path d="M15 8a4 4 0 0 1 0 8" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
  </svg>
);

const Flashcard = ({ card, onGrade }: FlashcardProps) => {
  const [flipped, setFlipped] = useState(false);
  const { settings } = useAppStore();

  // New card -> always start on the German side (never leak the answer),
  // and pronounce the German automatically.
  useEffect(() => {
    setFlipped(false);
    if (settings.ttsEnabled) {
      const id = setTimeout(() => speak(card.de, 'de-DE'), 350);
      return () => clearTimeout(id);
    }
  }, [card.id, card.de, settings.ttsEnabled]);

  const grade = (g: SrsGrade) => {
    if (g === 'again') sfxWrong();
    else sfxCorrect();
    onGrade(g);
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <p className="eyebrow mb-4 text-center" style={{ color: 'var(--faint)' }}>
        tap to flip
      </p>

      {/* 3D flip card */}
      <div
        className="flip-scene relative min-h-[290px] cursor-pointer"
        onClick={() => setFlipped((f) => !f)}
        role="button"
        aria-label={flipped ? 'Show German side' : 'Reveal translation'}
      >
        <div className={`flip-inner relative min-h-[290px] ${flipped ? 'is-flipped' : ''}`}>
          {/* Front: German */}
          <div
            className="flip-face absolute inset-0 flex flex-col items-center justify-center rounded-3xl p-8 text-center"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              boxShadow: '0 24px 46px -32px rgba(33,30,69,.5)',
            }}
          >
            <p className="fr text-[40px] font-medium" style={{ color: 'var(--ink)' }}>
              {card.article ? (
                <>
                  <span style={{ color: 'var(--primary)' }}>{card.article}</span> {card.de}
                </>
              ) : (
                card.de
              )}
            </p>
            {card.partOfSpeech && (
              <p className="mt-1 text-sm italic" style={{ color: 'var(--faint)' }}>
                {card.partOfSpeech}
              </p>
            )}
            <button
              className="press mt-5 inline-flex h-[46px] w-[46px] items-center justify-center rounded-full"
              style={{ background: 'var(--surface2)', border: '1px solid var(--line)', color: 'var(--primary)' }}
              onClick={(e) => {
                e.stopPropagation();
                if (settings.ttsEnabled) speak(card.de, 'de-DE');
                else speak(card.de, 'de-DE');
              }}
              aria-label="Pronounce word"
            >
              <SpeakerIcon />
            </button>
          </div>

          {/* Back: English */}
          <div
            className="flip-face flip-back absolute inset-0 flex flex-col items-center justify-center rounded-3xl p-8 text-center"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              boxShadow: '0 24px 46px -32px rgba(33,30,69,.5)',
            }}
          >
            <p className="fr text-[30px] font-semibold" style={{ color: 'var(--good)' }}>
              {card.en}
            </p>
            {card.exampleDe && (
              <p className="mt-4 text-[15px] italic leading-6" style={{ color: 'var(--muted)' }}>
                „{card.exampleDe}“
              </p>
            )}
            {card.note && (
              <p className="mt-3 text-sm italic" style={{ color: 'var(--muted)' }}>
                {card.note}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Grades */}
      {flipped ? (
        <div className="fx-fade-up mt-6">
          <p className="mb-3 text-center text-sm" style={{ color: 'var(--muted)' }}>
            How well did you know it?
          </p>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              className="press rounded-[14px] py-3.5 text-[15px] font-bold"
              style={{ background: 'var(--bad-soft)', color: 'var(--bad)', border: '1.5px solid var(--bad)' }}
              onClick={() => grade('again')}
            >
              Again
            </button>
            <button
              className="press rounded-[14px] py-3.5 text-[15px] font-bold text-white"
              style={{ background: 'var(--primary)', boxShadow: '0 14px 26px -16px var(--primary)' }}
              onClick={() => grade('good')}
            >
              Good
            </button>
            <button
              className="press rounded-[14px] py-3.5 text-[15px] font-bold"
              style={{ background: 'var(--good-soft)', color: 'var(--good)', border: '1.5px solid var(--good)' }}
              onClick={() => grade('easy')}
            >
              Easy
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setFlipped(true)} className="btn-primary press mt-6 w-full py-4">
          Reveal answer
        </button>
      )}
    </div>
  );
};

export default Flashcard;
