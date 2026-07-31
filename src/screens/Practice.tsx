import { useNavigate } from 'react-router-dom';
import {
  Layers,
  RotateCcw,
  ListChecks,
  Keyboard,
  BookText,
  TextCursorInput,
  Brain,
  Blocks,
  Mic,
  Zap,
  GraduationCap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useApp } from '../store/app';
import { isCardDue } from '../utils/srs';
import { Stagger, Item } from '../motion/Reveal';
import Pressable from '../motion/Pressable';

interface Mode {
  icon: LucideIcon;
  title: string;
  sub: string;
  to: string;
  soon?: boolean;
}

export default function Practice() {
  const navigate = useNavigate();
  const dueCount = Object.values(useApp((s) => s.srsRecords)).filter(isCardDue).length;
  const mistakes = Object.keys(useApp((s) => s.mistakes)).length;

  const groups: { label: string; modes: Mode[] }[] = [
    {
      label: 'study',
      modes: [
        { icon: Layers, title: 'Flashcards', sub: "Today's words · swipe to grade", to: '/session' },
        { icon: RotateCcw, title: 'Review', sub: `${dueCount} due · ${mistakes} weak spots`, to: '/review' },
      ],
    },
    {
      label: 'quiz',
      modes: [
        { icon: ListChecks, title: 'Multiple choice', sub: 'Word → meaning', to: '/quiz/mcq' },
        { icon: Keyboard, title: 'Type-in', sub: 'Type the translation', to: '/quiz/type' },
        { icon: BookText, title: 'Grammar Gym', sub: '365 rules · gamified', to: '/quiz/grammar' },
        { icon: TextCursorInput, title: 'Cloze', sub: 'Fill the gap in real sentences', to: '/quiz/cloze' },
        { icon: Brain, title: 'Hard MCQ', sub: '110 tricky questions', to: '/quiz/hard' },
      ],
    },
    {
      label: 'more',
      modes: [
        { icon: Blocks, title: 'Sentence Lab', sub: 'Build · dictate · translate', to: '', soon: true },
        { icon: Mic, title: 'Speak & Score', sub: 'Say it out loud', to: '', soon: true },
        { icon: Zap, title: 'Reflex', sub: 'Gender speed game', to: '', soon: true },
        { icon: GraduationCap, title: 'Classes', sub: 'Guided lessons', to: '', soon: true },
      ],
    },
  ];

  return (
    <Stagger className="space-y-7">
      <Item>
        <h1 className="display text-[30px]">Practice</h1>
      </Item>

      {groups.map((g) => (
        <Item key={g.label}>
          <p className="eyebrow text-faint mb-3">{g.label}</p>
          <div className="space-y-3">
            {g.modes.map((m) => (
              <Pressable
                key={m.title}
                onClick={() => !m.soon && navigate(m.to)}
                disabled={m.soon}
                className="card flex w-full items-center gap-4 px-5 py-4 text-left"
                style={m.soon ? { opacity: 0.5 } : undefined}
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                  style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
                >
                  <m.icon size={20} />
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold">{m.title}</span>
                  <span className="text-faint truncate text-sm">{m.sub}</span>
                </span>
                {m.soon && <span className="mono text-faint ml-auto text-[10px]">soon</span>}
              </Pressable>
            ))}
          </div>
        </Item>
      ))}
    </Stagger>
  );
}
