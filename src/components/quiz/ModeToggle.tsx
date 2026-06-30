export type QuizMode = 'flashcard' | 'multiple-choice' | 'type-in';

const MODES: { id: QuizMode; label: string }[] = [
  { id: 'flashcard', label: 'Flashcard' },
  { id: 'multiple-choice', label: 'Choice' },
  { id: 'type-in', label: 'Type In' },
];

interface Props {
  mode: QuizMode;
  onChange: (mode: QuizMode) => void;
}

/** Shared flashcard / multiple-choice / type-in switcher. */
const ModeToggle = ({ mode, onChange }: Props) => (
  <div className="flex gap-2 justify-center mb-6">
    {MODES.map(({ id, label }) => (
      <button
        key={id}
        onClick={() => onChange(id)}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          mode === id
            ? 'bg-brand-600 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
        }`}
      >
        {label}
      </button>
    ))}
  </div>
);

export default ModeToggle;
