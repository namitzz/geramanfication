/**
 * Fuchs — the app's Black Forest fox mascot (artwork from the design handoff).
 *
 * - <Fuchs/>     detailed fox: `variant` kit/grown (evolution tied to mastery),
 *                `mood` idle/perk/droop/curl (ear/tail/head transforms).
 * - <FuchsMini/> compact sitting fox used on the Trail, results and empty
 *                states; blinks; `mood` idle/sleep (sleep shows z Z).
 * - <FuchsMark/> head-only brand mark for the gradient header.
 */

export type FuchsVariant = 'kit' | 'grown';
export type FuchsMood = 'idle' | 'perk' | 'droop' | 'curl';

const EASE = 'transform .38s cubic-bezier(.34,1.5,.5,1)';

const MOODS: Record<
  FuchsMood,
  { earL: number; earR: number; tail: number; head: number; open: boolean; mouth: string }
> = {
  idle: { earL: 0, earR: 0, tail: 0, head: 0, open: true, mouth: 'M64 87 Q70 90 76 87' },
  perk: { earL: -14, earR: 14, tail: -13, head: -2, open: true, mouth: 'M63 86 Q70 93 77 86' },
  droop: { earL: 17, earR: -17, tail: 15, head: 3, open: true, mouth: 'M64 90 Q70 86 76 90' },
  curl: { earL: 6, earR: -6, tail: -6, head: 4, open: false, mouth: 'M65 88 Q70 90 75 88' },
};

interface FuchsProps {
  variant?: FuchsVariant;
  mood?: FuchsMood;
  size?: number;
  className?: string;
}

export const Fuchs = ({ variant = 'grown', mood = 'idle', size = 96, className }: FuchsProps) => {
  const isKit = variant === 'kit';
  const coat = isKit ? '#EE8B63' : '#E75A34';
  const coatDark = isKit ? '#D9764E' : '#C0441F';
  const belly = '#FBEDDD';
  const earInner = '#6E2B54';
  const ink = '#2E1E2C';
  const plum = '#B07A9C';
  const m = MOODS[mood];
  const kitScale = isKit ? 0.9 : 1;
  const w = size;
  const h = Math.round((size * 160) / 140);

  return (
    <svg viewBox="0 0 140 160" width={w} height={h} className={className} style={{ display: 'block', overflow: 'visible' }} aria-hidden>
      {/* tail */}
      <g transform={`rotate(${m.tail} 88 126)`} style={{ transition: EASE, transformOrigin: '88px 126px' }}>
        <path d="M84 126 C122 122 126 82 102 68 C120 88 110 120 82 116 Z" fill={coat} />
        <path d="M102 68 C114 64 122 76 117 88 C108 86 100 78 102 68 Z" fill={belly} />
      </g>
      {/* body */}
      <ellipse cx="60" cy="148" rx="10" ry="6" fill={coatDark} />
      <ellipse cx="82" cy="148" rx="10" ry="6" fill={coatDark} />
      <path d="M52 98 C45 118 47 140 58 146 C66 149 74 149 82 146 C93 140 95 118 88 98 Z" fill={coat} />
      <path d="M62 106 C57 120 59 134 66 140 C69 141 71 141 74 140 C81 134 83 120 78 106 Z" fill={belly} />
      {/* head */}
      <g
        transform={`translate(70 70) scale(${kitScale}) translate(-70 -70) rotate(${m.head} 70 70)`}
        style={{ transition: EASE, transformOrigin: '70px 70px' }}
      >
        <g transform={`rotate(${m.earL} 52 54)`} style={{ transition: EASE, transformOrigin: '52px 54px' }}>
          <path d="M48 56 L38 15 L69 46 Z" fill={coat} />
          <path d="M50 50 L45 27 L62 46 Z" fill={earInner} />
        </g>
        <g transform={`rotate(${m.earR} 88 54)`} style={{ transition: EASE, transformOrigin: '88px 54px' }}>
          <path d="M92 56 L102 15 L71 46 Z" fill={coat} />
          <path d="M90 50 L95 27 L78 46 Z" fill={earInner} />
        </g>
        <path d="M42 48 C42 40 54 33 70 33 C86 33 98 40 98 48 C100 75 88 93 70 97 C52 93 40 75 42 48 Z" fill={coat} />
        <path d="M44 60 C33 73 35 86 47 88 C53 82 55 71 52 62 Z" fill={belly} />
        <path d="M96 60 C107 73 105 86 93 88 C87 82 85 71 88 62 Z" fill={belly} />
        <path d="M55 65 C62 61 78 61 85 65 C87 80 78 92 70 94 C62 92 53 80 55 65 Z" fill={belly} />
        {isKit && (
          <path d="M70 33 C67 24 75 23 71 15" stroke={coatDark} strokeWidth="3.4" fill="none" strokeLinecap="round" />
        )}
        {m.open ? (
          <>
            <ellipse cx="59" cy="61" rx="3.6" ry="4.8" fill={ink}>
              <animate attributeName="ry" values="4.8;4.8;4.8;0.6;4.8" keyTimes="0;0.9;0.93;0.96;1" dur="4.6s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="81" cy="61" rx="3.6" ry="4.8" fill={ink}>
              <animate attributeName="ry" values="4.8;4.8;4.8;0.6;4.8" keyTimes="0;0.9;0.93;0.96;1" dur="4.6s" repeatCount="indefinite" />
            </ellipse>
            <circle cx="60.4" cy="59" r="1.1" fill="#fff" />
            <circle cx="82.4" cy="59" r="1.1" fill="#fff" />
          </>
        ) : (
          <>
            <path d="M54 62 Q59 67 64 62" stroke={ink} strokeWidth="2.4" fill="none" strokeLinecap="round" />
            <path d="M76 62 Q81 67 86 62" stroke={ink} strokeWidth="2.4" fill="none" strokeLinecap="round" />
          </>
        )}
        <path d="M65 73 C65 70.5 75 70.5 75 73 C75 78 70 81 70 81 C70 81 65 78 65 73 Z" fill={ink} />
        <path d="M70 81 L70 89" stroke={ink} strokeWidth="2" strokeLinecap="round" />
        <path d={m.mouth} stroke={ink} strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
      {mood === 'curl' && (
        <>
          <text x="104" y="40" className="fr" fontSize="15" fontWeight={600} fill={plum}>z</text>
          <text x="114" y="28" className="fr" fontSize="19" fontWeight={600} fill={plum}>Z</text>
        </>
      )}
    </svg>
  );
};

interface FuchsMiniProps {
  size?: number;
  mood?: 'idle' | 'sleep';
  className?: string;
}

/** Compact sitting fox (trail node companion, results, empty states). */
export const FuchsMini = ({ size = 44, mood = 'idle', className }: FuchsMiniProps) => {
  const amber = '#EE9B4D';
  const belly = '#FBEFE0';
  const earIn = '#7B5A3A';
  const ink = '#211E45';
  const h = Math.round((size * 60) / 44);
  return (
    <svg viewBox="-22 -22 44 60" width={size} height={h} className={className} style={{ overflow: 'visible', display: 'block' }} aria-hidden>
      <ellipse cx="0" cy="34" rx="17" ry="5" fill="rgba(33,30,69,0.10)" />
      <path d="M-16 26 C-18 6 -10 -8 0 -10 C10 -8 18 6 16 26 C10 32 -10 32 -16 26Z" fill={amber} />
      <path d="M-9 24 C-9 14 -4 12 0 12 C4 12 9 14 9 24 C6 29 -6 29 -9 24Z" fill={belly} />
      <path d="M-13 -6 L-19 -18 L-6 -12Z" fill={amber} />
      <path d="M13 -6 L19 -18 L6 -12Z" fill={amber} />
      <path d="M-13 -8 L-16 -15 L-9 -11Z" fill={earIn} />
      <path d="M13 -8 L16 -15 L9 -11Z" fill={earIn} />
      {mood === 'sleep' ? (
        <>
          <path d="M-8 -2 q2.5 2 5 0" stroke={ink} strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <path d="M3 -2 q2.5 2 5 0" stroke={ink} strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <text x="15" y="-12" className="fr" fontSize="9" fontWeight={600} fill="#7B6EF0">z</text>
          <text x="20" y="-18" className="fr" fontSize="12" fontWeight={600} fill="#7B6EF0">Z</text>
        </>
      ) : (
        <>
          <circle cx="-5.5" cy="-2" r="1.9" fill={ink}>
            <animate attributeName="r" values="1.9;1.9;1.9;0.3;1.9" keyTimes="0;0.9;0.93;0.96;1" dur="4.6s" repeatCount="indefinite" />
          </circle>
          <circle cx="5.5" cy="-2" r="1.9" fill={ink}>
            <animate attributeName="r" values="1.9;1.9;1.9;0.3;1.9" keyTimes="0;0.9;0.93;0.96;1" dur="4.6s" repeatCount="indefinite" />
          </circle>
        </>
      )}
      <path d="M-2 3 q2 2 4 0" stroke={ink} strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <circle cx="0" cy="0.5" r="1.3" fill={ink} />
    </svg>
  );
};

/** Head-only brand mark for the gradient header. */
export const FuchsMark = ({ size = 22 }: { size?: number }) => (
  <svg viewBox="-22 -22 44 56" width={size} height={Math.round((size * 56) / 44)} style={{ overflow: 'visible' }} aria-hidden>
    <path d="M-16 26 C-18 6 -10 -8 0 -10 C10 -8 18 6 16 26 C10 32 -10 32 -16 26Z" fill="var(--amber)" />
    <path d="M-13 -6 L-19 -18 L-6 -12Z" fill="var(--amber)" />
    <path d="M13 -6 L19 -18 L6 -12Z" fill="var(--amber)" />
    <circle cx="-5.5" cy="-2" r="1.7" fill="#211E45" />
    <circle cx="5.5" cy="-2" r="1.7" fill="#211E45" />
  </svg>
);

export default Fuchs;
