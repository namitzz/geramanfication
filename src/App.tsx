import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './motion/PageTransition';
import TabBar from './ui/TabBar';
import BrandHeader from './ui/BrandHeader';
import { primeSpeech } from './utils/tts';
import {
  scheduleWhileOpen,
  scheduleTrigger,
  showReminder,
  notificationPermission,
  passedToday,
} from './utils/notifications';
import { useApp, getTodayKey } from './store/app';

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
import Sentence from './screens/Sentence';
import WeakSpots from './screens/WeakSpots';
import Speak from './screens/Speak';
import Reflex from './screens/Reflex';
import Puzzle from './screens/Puzzle';
import Privacy from './screens/Privacy';
import Account from './screens/Account';
import { trackPageview } from './utils/analytics';
import { supabase } from './lib/supabase';
import { syncNow, startAutoSync, stopAutoSync } from './lib/sync';

const wrap = (node: React.ReactNode) => <PageTransition>{node}</PageTransition>;

function Shell() {
  const location = useLocation();
  const onboarded = useApp((s) => s.onboarded);
  const fullscreen = ['/onboarding', '/session', '/results'].some((p) =>
    location.pathname.startsWith(p),
  );

  // Count an (anonymous) pageview on each route change; no-op unless analytics
  // is configured.
  useEffect(() => {
    trackPageview();
  }, [location.pathname]);

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
            <Route path="/quiz/classes" element={wrap(<Quiz mode="classes" title="Classes" />)} />
            <Route path="/quiz/type" element={wrap(<TypeQuiz />)} />
            <Route path="/fluency" element={wrap(<Fluency />)} />
            <Route path="/sentence" element={wrap(<Sentence />)} />
            <Route path="/weak" element={wrap(<WeakSpots />)} />
            <Route path="/speak" element={wrap(<Speak />)} />
            <Route path="/reflex" element={wrap(<Reflex />)} />
            <Route path="/puzzle" element={wrap(<Puzzle />)} />
            <Route path="/privacy" element={wrap(<Privacy />)} />
            <Route path="/account" element={wrap(<Account />)} />
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
  const reminderEnabled = useApp((s) => s.settings.reminderEnabled);
  const reminderTime = useApp((s) => s.settings.reminderTime);
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f7f4f1' : '#0c0a10');
  }, [theme]);

  // Daily reminder: fire while open, catch up on open, and (where supported)
  // schedule an OS-level trigger that can fire when the app is closed.
  useEffect(() => {
    const fire = () => {
      const st = useApp.getState();
      if (st.lastReminded === getTodayKey()) return;
      showReminder(st.progress.streak);
      st.markReminded();
    };

    scheduleWhileOpen(reminderTime, reminderEnabled, fire);

    if (reminderEnabled && notificationPermission() === 'granted') {
      const st = useApp.getState();
      // Catch-up: past the time today, goal not met, and not already reminded.
      const goalMet = st.progress.lastReviewDate === getTodayKey();
      if (passedToday(reminderTime) && !goalMet && st.lastReminded !== getTodayKey()) {
        fire();
      }
      scheduleTrigger(reminderTime, st.progress.streak);
    }

    return () => scheduleWhileOpen('', false, () => {});
  }, [reminderEnabled, reminderTime]);

  // Cloud sync (optional): when signed in, reconcile once then auto-push
  // local changes. No-op unless Supabase is configured.
  useEffect(() => {
    if (!supabase) return;
    let activeUser: string | null = null;
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const uid = session?.user.id ?? null;
      if (uid === activeUser) return;
      activeUser = uid;
      if (uid) {
        void syncNow(uid).then(() => startAutoSync(uid));
      } else {
        stopAutoSync();
      }
    });
    return () => {
      data.subscription.unsubscribe();
      stopAutoSync();
    };
  }, []);

  // Unlock speech synthesis on the first user gesture (needed by iOS/Safari).
  useEffect(() => {
    const prime = () => primeSpeech();
    window.addEventListener('pointerdown', prime, { once: true });
    window.addEventListener('keydown', prime, { once: true });
    return () => {
      window.removeEventListener('pointerdown', prime);
      window.removeEventListener('keydown', prime);
    };
  }, []);

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Shell />
    </BrowserRouter>
  );
}
