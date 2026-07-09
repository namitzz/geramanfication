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

/** The design is a phone app (~392px prototype). On larger screens the app
 * renders as a centered phone-width column on a tinted backdrop instead of
 * stretching across the viewport. */
const APP_COL = 'mx-auto w-full max-w-[430px]';

const Layout = ({ children }: LayoutProps) => {
  const { settings, onboarding } = useAppStore();
  const location = useLocation();
  const isMainTab = MAIN_TABS.includes(location.pathname);

  return (
    <div className={settings.darkMode ? 'dark' : ''}>
      {/* Backdrop behind the app column (prototype's tinted cream). */}
      <div
        className="theme-transition min-h-screen"
        style={{
          background: settings.darkMode
            ? 'radial-gradient(900px 600px at 12% -5%, #211E3D, transparent), radial-gradient(760px 620px at 105% 105%, #1A1730, transparent), #0F0D20'
            : 'radial-gradient(900px 600px at 12% -5%, #E7E5FB, transparent), radial-gradient(760px 620px at 105% 105%, #EFE9F6, transparent), #EBE6DC',
        }}
      >
        {/* The app column. */}
        <div
          className={`${APP_COL} theme-transition relative min-h-screen`}
          style={{
            background: 'var(--bg)',
            color: 'var(--ink)',
            boxShadow: '0 0 60px -18px rgba(33,30,69,0.35)',
          }}
        >
          {!onboarding.done ? (
            <OnboardingFlow />
          ) : (
            <>
              {isMainTab && <GradientHeader />}
              <main
                key={location.pathname}
                className={`screen-in px-[22px] ${isMainTab ? 'pb-28 pt-2' : 'py-6 pb-16'}`}
              >
                {children}
              </main>
              {isMainTab && <Navigation />}
            </>
          )}
          <Toast />
        </div>
      </div>
    </div>
  );
};

export default Layout;
