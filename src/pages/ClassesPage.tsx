import { useEffect, useMemo, useState } from 'react';
import { BookOpen, GraduationCap } from 'lucide-react';
import { speak, getGermanVoice } from '../utils/tts';
import lessonsData from '../content/classes/lessons.json';
import type { Lesson } from '../content/classes/types';
import LessonFilters from '../components/classes/LessonFilters';
import Flashcards from '../components/classes/Flashcards';
import QuizRunner, { type ClassQuizMode } from '../components/classes/QuizRunner';

const lessons = lessonsData as Lesson[];
const STAR_KEY = 'classes-starred';

type ViewMode = 'flashcards' | 'quiz';

const ClassesPage = () => {
  // Filters
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyStarred, setShowOnlyStarred] = useState(false);
  const [shuffled, setShuffled] = useState(false);

  // Stars (persisted)
  const [starredIds, setStarredIds] = useState<Set<string>>(new Set());

  // View
  const [viewMode, setViewMode] = useState<ViewMode>('flashcards');
  const [quizMode, setQuizMode] = useState<ClassQuizMode | null>(null);

  // Audio
  const [showVoiceWarning, setShowVoiceWarning] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STAR_KEY);
    if (stored) setStarredIds(new Set(JSON.parse(stored)));
  }, []);

  useEffect(() => {
    const check = () => {
      if (getGermanVoice() === null) {
        setShowVoiceWarning(true);
        setTimeout(() => setShowVoiceWarning(false), 5000);
      }
    };
    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.addEventListener('voiceschanged', check, { once: true });
    } else {
      check();
    }
  }, []);

  const topics = ['all', ...Array.from(new Set(lessons.map((l) => l.topic)))];

  const filtered = useMemo(() => {
    let list = lessons;
    if (selectedTopic !== 'all') list = list.filter((l) => l.topic === selectedTopic);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (l) =>
          l.de.toLowerCase().includes(q) ||
          l.en.toLowerCase().includes(q) ||
          l.notes?.toLowerCase().includes(q)
      );
    }
    if (showOnlyStarred) list = list.filter((l) => starredIds.has(l.id));
    if (shuffled) list = [...list].sort(() => Math.random() - 0.5);
    return list;
  }, [selectedTopic, searchQuery, showOnlyStarred, shuffled, starredIds]);

  const toggleStar = (id: string) => {
    setStarredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem(STAR_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  const handleSpeak = (text: string) => {
    speak(text, 'de-DE').catch(() => setShowVoiceWarning(true));
  };

  // Active quiz takes over the screen.
  if (viewMode === 'quiz' && quizMode) {
    return (
      <QuizRunner
        pool={filtered}
        allLessons={lessons}
        mode={quizMode}
        onSpeak={handleSpeak}
        onExit={() => setQuizMode(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BookOpen size={28} /> Classes
        </h1>
      </header>

      {showVoiceWarning && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
          💡 No German voice detected — install one in your OS/browser for audio.
        </div>
      )}

      {/* View toggle */}
      <div className="flex gap-3">
        <button
          onClick={() => setViewMode('flashcards')}
          className={`btn flex-1 py-3 ${
            viewMode === 'flashcards'
              ? 'bg-brand-600 text-white shadow-card'
              : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          <BookOpen size={20} /> Flashcards
        </button>
        <button
          onClick={() => setViewMode('quiz')}
          className={`btn flex-1 py-3 ${
            viewMode === 'quiz'
              ? 'bg-emerald-600 text-white shadow-card'
              : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          <GraduationCap size={20} /> Quiz
        </button>
      </div>

      <LessonFilters
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        topics={topics}
        selectedTopic={selectedTopic}
        onTopic={setSelectedTopic}
        showOnlyStarred={showOnlyStarred}
        onToggleStarred={() => setShowOnlyStarred((v) => !v)}
        shuffled={viewMode === 'flashcards' ? shuffled : undefined}
        onToggleShuffle={
          viewMode === 'flashcards' ? () => setShuffled((v) => !v) : undefined
        }
      />

      {viewMode === 'flashcards' ? (
        <Flashcards
          lessons={filtered}
          starredIds={starredIds}
          onToggleStar={toggleStar}
          onSpeak={handleSpeak}
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4 stagger">
          <div className="card p-6">
            <h3 className="font-semibold text-lg mb-1">Multiple Choice</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Pick the translation from 4 options
            </p>
            <button
              onClick={() => setQuizMode('multiple-choice')}
              disabled={filtered.length < 4}
              className="btn-primary w-full py-3"
            >
              Start
            </button>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold text-lg mb-1">Type-In</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Type the translation (typo-tolerant)
            </p>
            <button
              onClick={() => setQuizMode('type-in')}
              disabled={filtered.length === 0}
              className="btn w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Start
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassesPage;
