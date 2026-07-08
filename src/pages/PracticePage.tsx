import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { allDecks } from '../content/decks';
import { getDueCards } from '../utils/srs';
import { useAppStore, getTodayKey } from '../stores/appStore';
import { WORDS_PER_DAY } from '../content/dailyWords';

const icon = (children: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" width="24" height="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

/* Custom drill icons from the design handoff. */
const DRILLS = [
  {
    title: 'Grammar Gym',
    sub: 'Cases & articles — 365 rules',
    tag: '+10 XP',
    to: '/grammar',
    icon: icon(
      <>
        <path d="M3 12h18" />
        <rect x="4" y="8" width="4" height="8" rx="1.5" />
        <rect x="16" y="8" width="4" height="8" rx="1.5" />
      </>
    ),
  },
  {
    title: 'Sentence Builder',
    sub: 'Arrange the word order',
    tag: '+15 XP',
    to: '/sentences?mode=build',
    icon: icon(
      <>
        <rect x="3" y="9.5" width="6.5" height="6" rx="1.5" />
        <rect x="14.5" y="9.5" width="6.5" height="6" rx="1.5" />
        <path d="M9.5 12.5h5" />
      </>
    ),
  },
  {
    title: 'Dictation',
    sub: 'Listen & type what you hear',
    tag: '+12 XP',
    to: '/sentences?mode=listen',
    icon: icon(
      <>
        <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
        <rect x="3" y="13" width="4" height="6" rx="2" />
        <rect x="17" y="13" width="4" height="6" rx="2" />
      </>
    ),
  },
  {
    title: 'Translate',
    sub: 'English → German',
    tag: '+15 XP',
    to: '/sentences?mode=translate',
    icon: icon(
      <>
        <path d="M3 6h7M6.5 5v1.5c0 3.5-1.5 6-4 7.5" />
        <path d="M5 10.5c.5 2.5 2.5 4 5 5" />
        <path d="m12.5 20 3.5-8 3.5 8M14 17h4.5" />
      </>
    ),
  },
  {
    title: 'Cloze',
    sub: 'Fill the gap in real sentences',
    tag: '+10 XP',
    to: '/cloze',
    icon: icon(
      <>
        <path d="M3 12h4M17 12h4" />
        <rect x="8.5" y="8.5" width="7" height="7" rx="1.5" strokeDasharray="2.4 2.4" />
      </>
    ),
  },
  {
    title: 'Speak & Score',
    sub: 'Say it aloud, graded by word',
    tag: 'Mic',
    to: '/speak',
    icon: icon(
      <>
        <rect x="9" y="3" width="6" height="11" rx="3" />
        <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3" />
      </>
    ),
  },
];

/* Everything else stays one tap away (feature parity). */
const MORE = [
  { title: "Today's 50 words", sub: 'Your daily batch of new vocabulary', to: '/today' },
  { title: 'Daily Sprint', sub: "Today's sentence puzzle — three tries", to: '/daily' },
  { title: 'Der·Die·Das Reflex', sub: '45-second article sprint', to: '/reflex' },
  { title: 'Text Analyzer', sub: 'Break down any German text', to: '/analyzer' },
  { title: 'Classes', sub: 'Course flashcards & quizzes', to: '/classes' },
  { title: 'MCQ Test', sub: '110 hard questions', to: '/mcq-testing' },
];

const PracticePage = () => {
  const navigate = useNavigate();
  const { srsRecords, dailyReview } = useAppStore();

  const allCardIds = allDecks.flatMap((d) => d.cards.map((c) => c.id));
  const dueCount = getDueCards(allCardIds, srsRecords).length;
  const doneToday =
    dailyReview.date === getTodayKey() ? dailyReview.cursor - dailyReview.dayStart : 0;

  return (
    <div>
      <h2 className="fr mb-4 text-[26px] font-semibold" style={{ color: 'var(--ink)' }}>
        Practice
      </h2>

      {/* Featured: SRS flashcards */}
      <button
        onClick={() => navigate(dueCount > 0 ? '/review' : '/today')}
        className="bg-grad shadow-hero press relative mb-6 w-full overflow-hidden rounded-[22px] p-[22px] text-left"
      >
        <div className="absolute -right-6 -top-6 h-[120px] w-[120px] rounded-full bg-white/10" />
        <p className="eyebrow" style={{ color: 'rgba(255,255,255,.8)' }}>
          Today's review · SRS
        </p>
        <h3 className="fr mb-1 mt-2 text-2xl font-semibold text-white">Flashcards</h3>
        <p className="mb-4 text-sm" style={{ color: 'rgba(255,255,255,.85)' }}>
          {dueCount > 0
            ? `${dueCount} cards due across your boxes`
            : `Nothing due — ${WORDS_PER_DAY - Math.min(doneToday, WORDS_PER_DAY)} new words waiting today`}
        </p>
        <span
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold"
          style={{ color: 'var(--primary-ink)' }}
        >
          Start review →
        </span>
      </button>

      {/* Drills: clean hairline-divided list */}
      <p className="eyebrow mb-1" style={{ color: 'var(--faint)' }}>
        Drills
      </p>
      <div style={{ borderTop: '1px solid var(--line)' }}>
        {DRILLS.map((d) => (
          <button
            key={d.title}
            onClick={() => navigate(d.to)}
            className="press flex w-full items-center gap-4 px-0.5 py-[15px] text-left"
            style={{ borderBottom: '1px solid var(--line)' }}
          >
            <span className="flex flex-shrink-0" style={{ color: 'var(--primary)' }}>
              {d.icon}
            </span>
            <span className="flex-1">
              <span className="fr block text-[17px] font-semibold" style={{ color: 'var(--ink)' }}>
                {d.title}
              </span>
              <span className="mt-px block text-[13px]" style={{ color: 'var(--muted)' }}>
                {d.sub}
              </span>
            </span>
            <span
              className="whitespace-nowrap rounded-full px-2.5 py-[3px] text-[11px] font-bold"
              style={{
                color: d.tag === 'Mic' ? 'var(--violet)' : 'var(--primary)',
                background: 'var(--primary-soft)',
              }}
            >
              {d.tag}
            </span>
          </button>
        ))}
      </div>

      {/* More modes (feature parity) */}
      <p className="eyebrow mb-1 mt-7" style={{ color: 'var(--faint)' }}>
        More
      </p>
      <div style={{ borderTop: '1px solid var(--line)' }}>
        {MORE.map((m) => (
          <button
            key={m.title}
            onClick={() => navigate(m.to)}
            className="press flex w-full items-center gap-4 px-0.5 py-[13px] text-left"
            style={{ borderBottom: '1px solid var(--line)' }}
          >
            <span className="flex-1">
              <span className="fr block text-[15px] font-medium" style={{ color: 'var(--ink)' }}>
                {m.title}
              </span>
              <span className="block text-xs" style={{ color: 'var(--muted)' }}>
                {m.sub}
              </span>
            </span>
            <span style={{ color: 'var(--faint)' }}>→</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PracticePage;
