import { Download } from 'lucide-react';
import audioManifest from '../content/generated/audioManifest.json';

interface AudioEntry {
  file: string;
  count: number;
  bytes: number;
}

const manifest = audioManifest as Record<string, AudioEntry>;

function formatSize(bytes: number): string {
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} KB`;
}

interface Props {
  deckId: string;
  className?: string;
}

/**
 * Offers a one-click download of a deck's German audio pack (a ZIP of MP3s
 * pre-generated with a female neural voice). Renders nothing for decks without
 * a bundled pack (e.g. the large API vocabulary decks).
 */
const AudioDownloadButton = ({ deckId, className = '' }: Props) => {
  const entry = manifest[deckId];
  if (!entry) return null;

  const href = `${import.meta.env.BASE_URL}audio/${entry.file}`;

  return (
    <a
      href={href}
      download={entry.file}
      className={`chip bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${className}`}
      title={`Download ${entry.count} German audio clips (${formatSize(entry.bytes)})`}
    >
      <Download size={15} />
      Audio · {formatSize(entry.bytes)}
    </a>
  );
};

export default AudioDownloadButton;
