import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  /** Custom handler (e.g. back to a setup screen); defaults to history back. */
  onClick?: () => void;
  label?: string;
}

/** Consistent top-left back control used across practice pages. */
const BackButton = ({ onClick, label = 'Back' }: BackButtonProps) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={onClick ?? (() => navigate(-1))}
      className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
    >
      <ArrowLeft size={20} />
      <span>{label}</span>
    </button>
  );
};

export default BackButton;
