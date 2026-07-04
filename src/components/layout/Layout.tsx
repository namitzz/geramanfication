import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import TopBar from './TopBar';
import { useAppStore } from '../../stores/appStore';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { settings } = useAppStore();
  const location = useLocation();

  return (
    <div className={settings.darkMode ? 'dark' : ''}>
      <div className="min-h-screen theme-transition app-bg bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 pb-24">
        <TopBar />
        {/* key by pathname so content animates in on each navigation */}
        <main key={location.pathname} className="max-w-4xl mx-auto px-4 py-6 page-enter">
          {children}
        </main>
        <Navigation />
      </div>
    </div>
  );
};

export default Layout;
