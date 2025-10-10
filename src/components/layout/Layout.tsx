import type { ReactNode } from 'react';
import Navigation from './Navigation';
import { useAppStore } from '../../stores/appStore';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { settings } = useAppStore();

  return (
    <div className={`min-h-screen ${settings.darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pb-20">
        <main className="max-w-4xl mx-auto px-4 py-6">
          {children}
        </main>
        <Navigation />
      </div>
    </div>
  );
};

export default Layout;
