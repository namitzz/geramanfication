import { useNavigate } from 'react-router-dom';
import { Layers, RotateCcw, ListChecks, Keyboard, BookText, Mic } from 'lucide-react';
import { useApp } from '../store/app';
import { isCardDue } from '../utils/srs';
import { Stagger, Item } from '../motion/Reveal';
import Pressable from '../motion/Pressable';

export default function Practice() {
  const navigate = useNavigate();
  const dueCount = Object.values(useApp((s) => s.srsRecords)).filter(isCardDue).length;

  const live = [
    { icon: Layers, title: 'Flashcards', sub: "Today's words, swipe to grade", to: '/session', tint: 'var(--accent)' },
    { icon: RotateCcw, title: 'Review', sub: `${dueCount} due · spaced repetition`, to: '/review', tint: 'var(--good)' },
  ];
  const soon = [
    { icon: ListChecks, title: 'Multiple choice' },
    { icon: Keyboard, title: 'Type-in' },
    { icon: BookText, title: 'Grammar' },
    { icon: Mic, title: 'Speak & score' },
  ];

  return (
    <Stagger className="space-y-6">
      <Item>
        <h1 className="display text-[30px]">Practice</h1>
      </Item>
      <Item>
        <div className="space-y-3">
          {live.map((m) => (
            <Pressable
              key={m.title}
              onClick={() => navigate(m.to)}
              className="card flex w-full items-center gap-4 px-5 py-4 text-left"
            >
              <span
                className="flex h-11 w-11 items-center justify-center rounded-2xl"
                style={{ background: 'var(--accent-soft)', color: m.tint }}
              >
                <m.icon size={20} />
              </span>
              <span>
                <span className="block font-semibold">{m.title}</span>
                <span className="text-faint text-sm">{m.sub}</span>
              </span>
            </Pressable>
          ))}
        </div>
      </Item>
      <Item>
        <p className="eyebrow text-faint mb-3 mt-2">more modes soon</p>
        <div className="grid grid-cols-2 gap-3">
          {soon.map((m) => (
            <div key={m.title} className="card flex items-center gap-3 px-4 py-4 opacity-55">
              <m.icon size={18} className="text-faint" />
              <span className="text-sm font-medium">{m.title}</span>
            </div>
          ))}
        </div>
      </Item>
    </Stagger>
  );
}
