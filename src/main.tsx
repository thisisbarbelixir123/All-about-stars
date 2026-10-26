import './utils/canvasSafety';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { soundEffects } from './utils/soundEffects';
import { initAutoRunningText } from './utils/autoRunningText';

// Initialize global UI sound effects for all interactive buttons and controls
soundEffects.setupGlobalClickHandler();

// Ensure all text that doesn't fit the container in this app becomes running text
initAutoRunningText();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
