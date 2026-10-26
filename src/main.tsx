import './utils/canvasSafety';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { soundEffects } from './utils/soundEffects';

// Initialize global UI sound effects for all interactive buttons and controls
soundEffects.setupGlobalClickHandler();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
