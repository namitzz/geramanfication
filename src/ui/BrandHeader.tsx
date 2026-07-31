import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/app';
import Logo from './Logo';
import Avatar from './Avatar';
import Pressable from '../motion/Pressable';

/** Slim brand bar for the main tabs: logo left, profile avatar right. */
export default function BrandHeader() {
  const navigate = useNavigate();
  const name = useApp((s) => s.settings.name);
  return (
    <header className="mb-5 flex items-center justify-between">
      <Logo size={22} />
      <Pressable onClick={() => navigate('/you')} aria-label="Profile" className="rounded-full">
        <Avatar name={name} size={36} />
      </Pressable>
    </header>
  );
}
