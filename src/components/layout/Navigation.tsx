import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, BarChart3, Settings, GraduationCap, Brain, Library } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/learn', icon: BookOpen, label: 'Learn' },
    { path: '/vocabulary', icon: Library, label: 'Vocab' },
    { path: '/classes', icon: GraduationCap, label: 'Classes' },
    { path: '/mcq-testing', icon: Brain, label: 'MCQ' },
    { path: '/progress', icon: BarChart3, label: 'Progress' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe backdrop-blur-md bg-white/85 dark:bg-gray-900/85 border-t border-gray-200/70 dark:border-gray-700/70">
      <div className="max-w-4xl mx-auto px-2">
        <div className="flex justify-around items-stretch">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive =
              path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(path);
            return (
              <Link
                key={path}
                to={path}
                aria-label={label}
                aria-current={isActive ? 'page' : undefined}
                className="flex-1 flex flex-col items-center gap-0.5 py-2 px-1 min-w-[44px]"
              >
                <span
                  className={`flex items-center justify-center w-11 h-7 rounded-full transition-colors ${
                    isActive
                      ? 'bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-300'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <Icon size={20} />
                </span>
                <span
                  className={`text-[10px] font-medium ${
                    isActive
                      ? 'text-brand-600 dark:text-brand-300'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
