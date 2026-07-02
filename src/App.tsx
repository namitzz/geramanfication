import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LearnPage from './pages/LearnPage';
import DeckPage from './pages/DeckPage';
import ReviewPage from './pages/ReviewPage';
import ProgressPage from './pages/ProgressPage';
import SettingsPage from './pages/SettingsPage';
import ClassesPage from './pages/ClassesPage';
import MCQTestingPage from './pages/MCQTestingPage';
import { useAppStore } from './stores/appStore';
import { Suspense, lazy, useEffect, type ReactNode } from 'react';

// Lazy-loaded so their large datasets ship as separate chunks.
const VocabularyPage = lazy(() => import('./pages/VocabularyPage'));
const GrammarPage = lazy(() => import('./pages/GrammarPage'));
const SentencesPage = lazy(() => import('./pages/SentencesPage'));
const AnalyzerPage = lazy(() => import('./pages/AnalyzerPage'));

const lazyRoute = (node: ReactNode) => (
  <Suspense
    fallback={
      <div className="text-center py-12 text-gray-600 dark:text-gray-400">
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
          <Route path="/" element={<HomePage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/vocabulary" element={lazyRoute(<VocabularyPage />)} />
          <Route path="/classes" element={<ClassesPage />} />
          <Route path="/deck/:deckId" element={<DeckPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/grammar" element={lazyRoute(<GrammarPage />)} />
          <Route path="/sentences" element={lazyRoute(<SentencesPage />)} />
          <Route path="/analyzer" element={lazyRoute(<AnalyzerPage />)} />
          <Route path="/mcq-testing" element={<MCQTestingPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

