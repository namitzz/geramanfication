import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import GradientHeader from './GradientHeader';
import Toast from '../Toast';
import OnboardingFlow from '../../pages/OnboardingPage';
import { useAppStore } from '../../stores/appStore';

interface LayoutProps {
  children: ReactNode;
}

/** The four main tabs get the gradient header + bottom nav; exercise and
 * legacy screens render bare (they carry their own top controls). */
const MAIN_TABS = ['/', '/practice', '/words', '/you'];

const Layout = ({ children }: LayoutProps) => {
  const { settings, onboarding } = useAppStore();
  const location = useLocation();
  const isMainTab = MAIN_TABS.includes(location.pathname);

  return (
    <div className={settings.darkMode ? 'dark' : ''}>
      <div
        className="theme-transition min-h-screen"
        style={{ background: 'var(--bg)', color: 'var(--ink)' }}
      >
        {!onboarding.done ? (
          <OnboardingFlow />
        ) : (
          <>
            {isMainTab && <GradientHeader />}
            <main
              key={location.pathname}
              className={`screen-in mx-auto max-w-4xl px-[22px] ${
                isMainTab ? 'pb-28 pt-2' : 'py-6 pb-16'
              }`}
            >
              {children}
            </main>
            {isMainTab && <Navigation />}
          </>
        )}
        <Toast />
      </div>
    </div>
  );
};

export default Layout;
