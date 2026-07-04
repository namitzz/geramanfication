import { Link } from 'react-router-dom';
import { Flame, Zap } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import BoltLogo from '../BoltLogo';

const TopBar = () => {
  const { progress } = useAppStore();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/70 dark:border-gray-700/70">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <BoltLogo size={26} className="rounded-md" />
          <span className="bg-gradient-to-r from-brand-600 to-violet-500 bg-clip-text text-transparent">
            DeutschSprint
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <span
            className="chip bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300"
            title={`${progress.streak}-day streak`}
          >
            <Flame size={16} />
            {progress.streak}
          </span>
          <span
            className="chip bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
            title={`${progress.xp} total XP`}
          >
            <Zap size={16} />
            {progress.xp}
          </span>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
