import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './motion/PageTransition';
import TabBar from './ui/TabBar';
import BrandHeader from './ui/BrandHeader';
import { useApp } from './store/app';

import Today from './screens/Today';
import Practice from './screens/Practice';
import Library from './screens/Library';
import You from './screens/You';
import Onboarding from './screens/Onboarding';
import Session from './screens/Session';
import Results from './screens/Results';
import Quiz from './screens/Quiz';
import TypeQuiz from './screens/TypeQuiz';
import Fluency from './screens/Fluency';

const wrap = (node: React.ReactNode) => <PageTransition>{node}</PageTransition>;

function Shell() {
  const location = useLocation();
  const onboarded = useApp((s) => s.onboarded);
  const fullscreen = ['/onboarding', '/session', '/results'].some((p) =>
    location.pathname.startsWith(p),
  );

  if (!onboarded && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="aurora relative mx-auto min-h-screen w-full max-w-app">
      <div className="relative z-10 px-5 pt-[max(18px,env(safe-area-inset-top))] pb-32">
        {!fullscreen && <BrandHeader />}
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={wrap(<Today />)} />
            <Route path="/practice" element={wrap(<Practice />)} />
            <Route path="/library" element={wrap(<Library />)} />
            <Route path="/you" element={wrap(<You />)} />
            <Route path="/onboarding" element={wrap(<Onboarding />)} />
            <Route path="/session" element={wrap(<Session mode="daily" />)} />
            <Route path="/review" element={wrap(<Session mode="review" />)} />
            <Route path="/results" element={wrap(<Results />)} />
            <Route path="/quiz/mcq" element={wrap(<Quiz mode="mcq" title="Multiple choice" />)} />
            <Route path="/quiz/grammar" element={wrap(<Quiz mode="grammar" title="Grammar Gym" />)} />
            <Route path="/quiz/cloze" element={wrap(<Quiz mode="cloze" title="Cloze" />)} />
            <Route path="/quiz/hard" element={wrap(<Quiz mode="hard" title="Hard MCQ" />)} />
            <Route path="/quiz/type" element={wrap(<TypeQuiz />)} />
            <Route path="/fluency" element={wrap(<Fluency />)} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
      {!fullscreen && <TabBar />}
    </div>
  );
}

export default function App() {
  const theme = useApp((s) => s.settings.theme);
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f5f5f6' : '#0a0a0b');
  }, [theme]);

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Shell />
    </BrowserRouter>
  );
}
