
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { SystemLogger } from './logging/system-logger';

// Log system startup as early as possible
SystemLogger.startup({
  environment: import.meta.env.MODE,
  version: import.meta.env.VITE_APP_VERSION || 'development'
});

// Register window events for system lifecycle
window.addEventListener('load', () => {
  SystemLogger.initPhase('DOM loaded', 100, { timing: performance.now() });
});

window.addEventListener('beforeunload', () => {
  SystemLogger.shutdown();
});

// Handle uncaught errors
window.addEventListener('error', (event) => {
  SystemLogger.critical('Uncaught error', event.error || event, { 
    message: event.message,
    filename: event.filename,
    lineno: event.lineno
  });
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
