import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { allDecks } from '../content/decks';
import { useAppStore } from '../stores/appStore';

/**
 * The Trail — lessons as waypoints on a winding path (the app's signature
 * screen). Geometry is verbatim from the design handoff; nodes are wired to
 * real decks and real SRS progress.
 */

/* Exact path + node positions from the prototype (viewBox 0 0 346 620). */
const FULL_PATH =
  'M60 40 C 60 100, 286 100, 286 160 S 60 220, 60 280 S 286 340, 286 400 S 60 460, 60 520 S 286 560, 286 600';
const SEGMENTS = [
  '',
  'M60 40 C 60 100, 286 100, 286 160',
  'M60 40 C 60 100, 286 100, 286 160 S 60 220, 60 280',
  'M60 40 C 60 100, 286 100, 286 160 S 60 220, 60 280 S 286 340, 286 400',
  'M60 40 C 60 100, 286 100, 286 160 S 60 220, 60 280 S 286 340, 286 400 S 60 460, 60 520',
  FULL_PATH,
];
const POSITIONS: [number, number][] = [
  [60, 40],
  [286, 160],
  [60, 280],
  [286, 400],
  [60, 520],
  [286, 600],
];

/* Content-specific node glyphs (custom, per the handoff). */
type Glyph = 'check' | 'coffee' | 'house' | 'clock' | 'num' | 'text';
interface NodeDef {
  deckId: string;
  label: string;
  glyph: Glyph;
  text?: string;
}
const NODES: NodeDef[] = [
  { deckId: 'greetings', label: 'Greetings', glyph: 'check' },
  { deckId: 'travel-phrasebook', label: 'At the Café', glyph: 'coffee' },
  { deckId: 'family', label: 'Die Familie', glyph: 'house' },
  { deckId: 'days', label: 'Days & Time', glyph: 'clock' },
  { deckId: 'numbers', label: 'Numbers', glyph: 'num', text: '123' },
  { deckId: 'a1-basics', label: 'A1 Basics', glyph: 'text', text: 'der' },
];

const glyphSvg = (glyph: Glyph, color: string, text?: string) => {
  switch (glyph) {
    case 'check':
      return <path d="M-11 2 L-4 9 L11 -8" stroke={color} strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />;
    case 'coffee':
      return (
        <path
          d="M-9 -6 h14 v6 a7 7 0 0 1 -7 7 a7 7 0 0 1 -7 -7 Z M6 -4 h4 a4 4 0 0 1 0 8 h-3"
          stroke={color}
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    case 'house':
      return (
        <g transform="translate(-9,-11)" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M0 18 V9 L9 2 L18 9 V18" />
          <path d="M0 18 h18" />
          <rect x="7" y="10" width="4" height="8" />
        </g>
      );
    case 'clock':
      return (
        <g stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round">
          <circle r="9" />
          <path d="M0 -4 V0 L4 3" />
        </g>
      );
    default:
      return (
        <text y={glyph === 'num' ? 6 : 5} textAnchor="middle" className="fr" fontWeight={600} fontSize={glyph === 'num' ? 15 : 13} fill={color}>
          {text}
        </text>
      );
  }
};

const TrailPage = () => {
  const navigate = useNavigate();
  const { srsRecords, mistakes } = useAppStore();
  const weakCount = Object.keys(mistakes).length;

  /* Deck status from real SRS data: a lesson is "done" once ~80% of its cards
     have been studied (have SRS records). Current = first unfinished. */
  const { statuses, currentIndex, wordCounts } = useMemo(() => {
    const statuses: ('done' | 'current' | 'locked')[] = [];
    const wordCounts: number[] = [];
    let current = -1;
    for (const node of NODES) {
      const deck = allDecks.find((d) => d.id === node.deckId);
      const cards = deck?.cards ?? [];
      const studied = cards.filter((c) => srsRecords[c.id]).length;
      wordCounts.push(cards.length);
      const done = cards.length > 0 && studied >= Math.ceil(cards.length * 0.8);
      if (done) statuses.push('done');
      else if (current === -1) {
        statuses.push('current');
        current = statuses.length - 1;
      } else statuses.push('locked');
    }
    if (current === -1) current = NODES.length - 1;
    return { statuses, currentIndex: current, wordCounts };
  }, [srsRecords]);

  const [fx, fy] = POSITIONS[currentIndex];
  const foxX = fx === 60 ? 150 : 196;
  const foxY = fy - 30;

  return (
    <div className="pb-2">
      <svg viewBox="0 0 346 620" width="100%" style={{ display: 'block', overflow: 'visible' }}>
        {/* full path (rail) + completed overlay that draws in */}
        <path d={FULL_PATH} fill="none" stroke="var(--line)" strokeWidth="10" strokeLinecap="round" strokeDasharray="1 22" />
        {SEGMENTS[currentIndex] && (
          <path
            d={SEGMENTS[currentIndex]}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray="1 22"
            className="fx-thread-draw"
          />
        )}

        {/* Fuchs sits beside the current node */}
        <g transform={`translate(${foxX},${foxY})`}>
          <g className="fx-breathe">
            <g transform="scale(1.2)">
              <FuchsAsGroup />
            </g>
          </g>
        </g>

        {NODES.map((node, i) => {
          const [x, y] = POSITIONS[i];
          const status = statuses[i];
          const small = i === NODES.length - 1;
          const r = status === 'current' ? 34 : small ? 26 : 30;
          const clickable = status !== 'locked';
          const labelFill = status === 'locked' ? 'var(--faint)' : 'var(--ink)';
          const subFill = status === 'current' ? 'var(--primary)' : status === 'locked' ? 'var(--faint)' : 'var(--muted)';
          const sub =
            status === 'current' ? 'current lesson' : status === 'locked' ? 'locked' : `${wordCounts[i]} words · mastered`;

          return (
            <g key={node.deckId}>
              <g
                transform={`translate(${x},${y})`}
                style={clickable ? { cursor: 'pointer' } : undefined}
                onClick={clickable ? () => navigate(`/deck/${node.deckId}`) : undefined}
              >
                {status === 'done' && (
                  <>
                    <circle r={r} fill="var(--primary)" />
                    {glyphSvg(node.glyph, '#fff', node.text)}
                  </>
                )}
                {status === 'current' && (
                  <>
                    <circle r={r} fill="var(--surface)" stroke="var(--primary)" strokeWidth="3.5" />
                    {glyphSvg(node.glyph, 'var(--primary)', node.text)}
                  </>
                )}
                {status === 'locked' && (
                  <>
                    <circle r={r} fill="var(--surface2)" />
                    {glyphSvg(node.glyph, 'var(--faint)', node.text)}
                  </>
                )}
              </g>
              {!small && (
                <>
                  <text x={x} y={y + r + 22} textAnchor="middle" className="fr" fontWeight={600} fontSize="13.5" fill={labelFill}>
                    {node.label}
                  </text>
                  <text x={x} y={y + r + 37} textAnchor="middle" fontSize="10.5" fontWeight={status === 'current' ? 600 : 500} fill={subFill}>
                    {sub}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>

      {/* Loose threads (Comebacks) banner */}
      {weakCount > 0 && (
        <button
          onClick={() => navigate('/weak')}
          className="press mt-3.5 flex w-full items-center gap-3 rounded-2xl p-4 text-left"
          style={{ background: 'var(--amber-soft)', border: '1px solid var(--line)' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--amber-deep)', flexShrink: 0 }}>
            <path d="M7 17c-4-1-4-8 1-9 4-1 7 2 6 6-1 3-5 2-5-1 0-2 3-3 4-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="17.5" cy="7" r="1.4" fill="currentColor" />
          </svg>
          <span className="flex-1">
            <span className="fr block text-[15px] font-semibold" style={{ color: 'var(--ink)' }}>
              {weakCount} loose {weakCount === 1 ? 'thread' : 'threads'}
            </span>
            <span className="block text-[13px]" style={{ color: 'var(--muted)' }}>
              Help Fuchs chase them down →
            </span>
          </span>
        </button>
      )}
    </div>
  );
};

/** FuchsMini's artwork inlined as an SVG group (for embedding in the Trail). */
const FuchsAsGroup = () => (
  <>
    <ellipse cx="0" cy="34" rx="17" ry="5" fill="rgba(33,30,69,0.10)" />
    <path d="M-16 26 C-18 6 -10 -8 0 -10 C10 -8 18 6 16 26 C10 32 -10 32 -16 26Z" fill="var(--amber)" />
    <path d="M-9 24 C-9 14 -4 12 0 12 C4 12 9 14 9 24 C6 29 -6 29 -9 24Z" fill="#FBEFE0" />
    <path d="M-13 -6 L-19 -18 L-6 -12Z" fill="var(--amber)" />
    <path d="M13 -6 L19 -18 L6 -12Z" fill="var(--amber)" />
    <path d="M-13 -8 L-16 -15 L-9 -11Z" fill="#7B5A3A" />
    <path d="M13 -8 L16 -15 L9 -11Z" fill="#7B5A3A" />
    <circle cx="-5.5" cy="-2" r="1.6" fill="#211E45">
      <animate attributeName="r" values="1.6;1.6;1.6;0.3;1.6" keyTimes="0;0.9;0.93;0.96;1" dur="4.5s" repeatCount="indefinite" />
    </circle>
    <circle cx="5.5" cy="-2" r="1.6" fill="#211E45">
      <animate attributeName="r" values="1.6;1.6;1.6;0.3;1.6" keyTimes="0;0.9;0.93;0.96;1" dur="4.5s" repeatCount="indefinite" />
    </circle>
    <path d="M-2 3 q2 2 4 0" stroke="#211E45" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    <circle cx="0" cy="0.5" r="1.3" fill="#211E45" />
  </>
);

export default TrailPage;
