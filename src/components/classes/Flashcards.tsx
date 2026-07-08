import { useCallback, useEffect, useState } from 'react';
import { Volume2, Star, RotateCw, ArrowLeft, ArrowRight } from 'lucide-react';
import { formatTopic, type Lesson } from '../../content/classes/types';
import { useAppStore } from '../../stores/appStore';

interface Props {
  lessons: Lesson[];
  starredIds: Set<string>;
  onToggleStar: (id: string) => void;
  onSpeak: (text: string) => void;
}

const Flashcards = ({ lessons, starredIds, onToggleStar, onSpeak }: Props) => {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const ttsEnabled = useAppStore((s) => s.settings.ttsEnabled);

  // Reset when the lesson set changes (filters, shuffle, etc.).
  useEffect(() => {
    setIndex(0);
    setFlipped(false);
  }, [lessons]);

  // Pronounce each card's German automatically.
  useEffect(() => {
    const lesson = lessons[index];
    if (ttsEnabled && lesson) {
      const id = setTimeout(() => onSpeak(lesson.de), 350);
      return () => clearTimeout(id);
    }
  }, [index, lessons, ttsEnabled, onSpeak]);

  const next = useCallback(() => {
    setIndex((i) => (i < lessons.length - 1 ? i + 1 : i));
    setFlipped(false);
  }, [lessons.length]);

  const prev = useCallback(() => {
    setIndex((i) => (i > 0 ? i - 1 : i));
    setFlipped(false);
  }, []);

  // Keyboard shortcuts: space flips, arrows navigate, A plays audio.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          setFlipped((f) => !f);
          break;
        case 'arrowleft':
          e.preventDefault();
          prev();
          break;
        case 'arrowright':
          e.preventDefault();
          next();
          break;
        case 'a':
          e.preventDefault();
          if (lessons[index]) onSpeak(lessons[index].de);
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, lessons, next, prev, onSpeak]);

  if (lessons.length === 0) {
    return (
      <div className="card p-8 text-center text-gray-500 dark:text-gray-400">
        No lessons found. Try adjusting your filters.
      </div>
    );
  }

  const lesson = lessons[index];

  return (
    <>
      <div
        key={index}
        onClick={() => setFlipped((f) => !f)}
        className="card p-8 min-h-[280px] flex flex-col justify-between cursor-pointer screen-in"
      >
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          {!flipped ? (
            <>
              <h2 className="text-3xl font-bold mb-2">{lesson.de}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                {formatTopic(lesson.topic)} • {lesson.type}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSpeak(lesson.de);
                }}
                className="mt-4 p-3 bg-brand-600 hover:bg-brand-700 text-white rounded-full transition-colors"
                aria-label="Pronounce"
              >
                <Volume2 size={24} />
              </button>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-green-600 dark:text-green-400">
                {lesson.en}
              </h2>
              {lesson.notes && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-4 italic">
                  💡 {lesson.notes}
                </p>
              )}
            </>
          )}
        </div>
        <div className="flex items-center justify-center mt-4 text-gray-400">
          <RotateCw size={18} className="mr-2" />
          <span className="text-sm">Tap to flip</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={prev}
          disabled={index === 0}
          className="btn px-4 py-2 bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {index + 1} / {lessons.length}
          </span>
          <button
            onClick={() => onToggleStar(lesson.id)}
            aria-label="Star this card"
            className={`p-2 rounded-full transition-colors ${
              starredIds.has(lesson.id)
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
            }`}
          >
            <Star size={20} fill={starredIds.has(lesson.id) ? 'currentColor' : 'none'} />
          </button>
        </div>

        <button
          onClick={next}
          disabled={index === lessons.length - 1}
          className="btn px-4 py-2 bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
        >
          <ArrowRight size={20} />
        </button>
      </div>
    </>
  );
};

export default Flashcards;
