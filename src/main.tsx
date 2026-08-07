// Captures beforeinstallprompt before React mounts.
import './utils/installPrompt';
import '@fontsource/geist-sans/400.css';
import '@fontsource/geist-sans/500.css';
import '@fontsource/geist-sans/600.css';
import '@fontsource/geist-sans/700.css';
import '@fontsource/geist-mono/400.css';
import '@fontsource/geist-mono/500.css';
import '@fontsource/sora/700.css';
import '@fontsource/sora/800.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './ui/ErrorBoundary';
import { initMonitoring } from './utils/monitoring';
import { initAnalytics } from './utils/analytics';

// Optional, env-gated, privacy-conscious — both are no-ops unless configured.
initMonitoring();
initAnalytics();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
