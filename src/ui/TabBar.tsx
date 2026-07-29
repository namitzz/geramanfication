import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Layers, Library, User } from 'lucide-react';
import { spring } from '../motion/springs';

const tabs = [
  { to: '/', icon: Sparkles, label: 'Today' },
  { to: '/practice', icon: Layers, label: 'Practice' },
  { to: '/library', icon: Library, label: 'Library' },
  { to: '/you', icon: User, label: 'You' },
];

export default function TabBar() {
  const { pathname } = useLocation();
  return (
    <nav
      className="glass fixed bottom-0 left-1/2 z-40 w-[calc(100%-28px)] max-w-app -translate-x-1/2 rounded-full p-1.5"
      style={{ marginBottom: 'max(14px, env(safe-area-inset-bottom))' }}
    >
      <div className="flex">
        {tabs.map((t) => {
          const active = t.to === '/' ? pathname === '/' : pathname.startsWith(t.to);
          const Icon = t.icon;
          return (
            <NavLink
              key={t.to}
              to={t.to}
              className="relative flex flex-1 items-center justify-center py-2.5"
              aria-label={t.label}
            >
              {active && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-full bg-accent-soft"
                  transition={spring.snappy}
                />
              )}
              <span className="relative flex flex-col items-center gap-1">
                <Icon size={20} style={{ color: active ? 'var(--accent)' : 'var(--faint)' }} />
                <span
                  className="text-[10px] font-medium"
                  style={{ color: active ? 'var(--accent)' : 'var(--faint)' }}
                >
                  {t.label}
                </span>
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
