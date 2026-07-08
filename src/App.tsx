import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import TrailPage from './pages/TrailPage';
import PracticePage from './pages/PracticePage';
import LearnPage from './pages/LearnPage';
import DeckPage from './pages/DeckPage';
import ReviewPage from './pages/ReviewPage';
import SettingsPage from './pages/SettingsPage';
import ClassesPage from './pages/ClassesPage';
import MCQTestingPage from './pages/MCQTestingPage';
import { useAppStore } from './stores/appStore';
import { Suspense, lazy, useEffect, type ReactNode } from 'react';

// Lazy-loaded so their large datasets ship as separate chunks.
const WordsPage = lazy(() => import('./pages/WordsPage'));
const YouPage = lazy(() => import('./pages/YouPage'));
const VocabularyPage = lazy(() => import('./pages/VocabularyPage'));
const GrammarPage = lazy(() => import('./pages/GrammarPage'));
const SentencesPage = lazy(() => import('./pages/SentencesPage'));
const AnalyzerPage = lazy(() => import('./pages/AnalyzerPage'));
const DailySprintPage = lazy(() => import('./pages/DailySprintPage'));
const ReflexPage = lazy(() => import('./pages/ReflexPage'));
const SpeakPage = lazy(() => import('./pages/SpeakPage'));
const ClozePage = lazy(() => import('./pages/ClozePage'));
const WeakSpotsPage = lazy(() => import('./pages/WeakSpotsPage'));
const TodayPage = lazy(() => import('./pages/TodayPage'));

const lazyRoute = (node: ReactNode) => (
  <Suspense
    fallback={
      <div className="py-12 text-center" style={{ color: 'var(--muted)' }}>
        Loading…
      </div>
    }
  >
    {node}
  </Suspense>
);

function App() {
  const { settings } = useAppStore();

  useEffect(() => {
    // Apply dyslexic font setting on mount
    if (settings.dyslexicFont) {
      document.body.classList.add('dyslexic-font');
    }
  }, [settings.dyslexicFont]);

  return (
    <Router basename="/geramanfication">
      <Layout>
        <Routes>
          {/* Main tabs (Fuchs & The Trail IA) */}
          <Route path="/" element={<TrailPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/words" element={lazyRoute(<WordsPage />)} />
          <Route path="/you" element={lazyRoute(<YouPage />)} />

          {/* Engines + everything else (feature parity) */}
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/vocabulary" element={lazyRoute(<VocabularyPage />)} />
          <Route path="/classes" element={<ClassesPage />} />
          <Route path="/deck/:deckId" element={<DeckPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/grammar" element={lazyRoute(<GrammarPage />)} />
          <Route path="/sentences" element={lazyRoute(<SentencesPage />)} />
          <Route path="/analyzer" element={lazyRoute(<AnalyzerPage />)} />
          <Route path="/daily" element={lazyRoute(<DailySprintPage />)} />
          <Route path="/reflex" element={lazyRoute(<ReflexPage />)} />
          <Route path="/speak" element={lazyRoute(<SpeakPage />)} />
          <Route path="/cloze" element={lazyRoute(<ClozePage />)} />
          <Route path="/weak" element={lazyRoute(<WeakSpotsPage />)} />
          <Route path="/today" element={lazyRoute(<TodayPage />)} />
          <Route path="/mcq-testing" element={<MCQTestingPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
