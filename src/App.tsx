import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LearnPage from './pages/LearnPage';
import DeckPage from './pages/DeckPage';
import ReviewPage from './pages/ReviewPage';
import GrammarPage from './pages/GrammarPage';
import ProgressPage from './pages/ProgressPage';
import SettingsPage from './pages/SettingsPage';
import ClassesPage from './pages/ClassesPage';
import MCQTestingPage from './pages/MCQTestingPage';
import { useAppStore } from './stores/appStore';
import { useEffect } from 'react';

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
          <Route path="/classes" element={<ClassesPage />} />
          <Route path="/deck/:deckId" element={<DeckPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/grammar" element={<GrammarPage />} />
          <Route path="/mcq-testing" element={<MCQTestingPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

