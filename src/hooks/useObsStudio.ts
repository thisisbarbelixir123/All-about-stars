import { useEffect, useState, useRef, useCallback } from 'react';
import { parseObsUrlParams, ObsStatus, ObsBridgeConfig } from '../utils/obsBridge';

export interface UseObsStudioOptions {
  onTourStartRequested?: (pace?: 'short' | 'medium' | 'long') => void;
  onTourStopRequested?: () => void;
  onStatusChange?: (status: ObsStatus) => void;
}

export interface UseObsStudioReturn {
  isObs: boolean;
  obsStatus: ObsStatus;
  config: ObsBridgeConfig;
  startBroadcastTour: () => void;
  stopBroadcastTour: () => void;
}

/**
 * Hook to integrate OBS Studio events, status, and URL parameter triggers.
 * Listens to native browser source events:
 * - obsRecordingStarted / obsRecordingStopped
 * - obsStreamingStarted / obsStreamingStopped
 * - window.obsstudio.onActiveChange / onVisibilityChange
 */
export function useObsStudio(options: UseObsStudioOptions = {}): UseObsStudioReturn {
  const { onTourStartRequested, onTourStopRequested, onStatusChange } = options;

  const [config, setConfig] = useState<ObsBridgeConfig>(() => parseObsUrlParams());
  const [obsStatus, setObsStatus] = useState<ObsStatus>({
    recording: false,
    streaming: false,
  });

  const callbacksRef = useRef({ onTourStartRequested, onTourStopRequested, onStatusChange });
  callbacksRef.current = { onTourStartRequested, onTourStopRequested, onStatusChange };

  const startBroadcastTour = useCallback(() => {
    callbacksRef.current.onTourStartRequested?.(config.tourPace);
  }, [config.tourPace]);

  const stopBroadcastTour = useCallback(() => {
    callbacksRef.current.onTourStopRequested?.();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const parsed = parseObsUrlParams();
    setConfig(parsed);

    // Initial check via window.obsstudio API if present
    if (window.obsstudio?.getStatus) {
      window.obsstudio.getStatus((status: ObsStatus) => {
        setObsStatus(status);
        callbacksRef.current.onStatusChange?.(status);
        if (status.recording || status.streaming) {
          callbacksRef.current.onTourStartRequested?.(parsed.tourPace);
        }
      });
    }

    // Native OBS Studio Window Event Listeners
    const handleRecordingStarted = () => {
      setObsStatus((prev) => {
        const next = { ...prev, recording: true, recordingPaused: false };
        callbacksRef.current.onStatusChange?.(next);
        return next;
      });
      callbacksRef.current.onTourStartRequested?.(parsed.tourPace);
    };

    const handleRecordingStopped = () => {
      setObsStatus((prev) => {
        const next = { ...prev, recording: false, recordingPaused: false };
        callbacksRef.current.onStatusChange?.(next);
        return next;
      });
      callbacksRef.current.onTourStopRequested?.();
    };

    const handleRecordingPaused = () => {
      setObsStatus((prev) => ({ ...prev, recordingPaused: true }));
    };

    const handleRecordingUnpaused = () => {
      setObsStatus((prev) => ({ ...prev, recordingPaused: false }));
    };

    const handleStreamingStarted = () => {
      setObsStatus((prev) => {
        const next = { ...prev, streaming: true };
        callbacksRef.current.onStatusChange?.(next);
        return next;
      });
      callbacksRef.current.onTourStartRequested?.(parsed.tourPace);
    };

    const handleStreamingStopped = () => {
      setObsStatus((prev) => {
        const next = { ...prev, streaming: false };
        callbacksRef.current.onStatusChange?.(next);
        return next;
      });
      callbacksRef.current.onTourStopRequested?.();
    };

    window.addEventListener('obsRecordingStarted', handleRecordingStarted);
    window.addEventListener('obsRecordingStopped', handleRecordingStopped);
    window.addEventListener('obsRecordingPaused', handleRecordingPaused);
    window.addEventListener('obsRecordingUnpaused', handleRecordingUnpaused);
    window.addEventListener('obsStreamingStarted', handleStreamingStarted);
    window.addEventListener('obsStreamingStopped', handleStreamingStopped);

    // Handle OBS visibility and active status change if API exists
    if (window.obsstudio?.onActiveChange) {
      window.obsstudio.onActiveChange((active) => {
        if (!active) {
          // Stream/recording source deactivated in OBS scene
        }
      });
    }

    // Auto-trigger tour if URL parameter ?tour=auto was passed
    if (parsed.isAutoTour) {
      const timer = setTimeout(() => {
        callbacksRef.current.onTourStartRequested?.(parsed.tourPace);
      }, 300);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('obsRecordingStarted', handleRecordingStarted);
        window.removeEventListener('obsRecordingStopped', handleRecordingStopped);
        window.removeEventListener('obsRecordingPaused', handleRecordingPaused);
        window.removeEventListener('obsRecordingUnpaused', handleRecordingUnpaused);
        window.removeEventListener('obsStreamingStarted', handleStreamingStarted);
        window.removeEventListener('obsStreamingStopped', handleStreamingStopped);
      };
    }

    return () => {
      window.removeEventListener('obsRecordingStarted', handleRecordingStarted);
      window.removeEventListener('obsRecordingStopped', handleRecordingStopped);
      window.removeEventListener('obsRecordingPaused', handleRecordingPaused);
      window.removeEventListener('obsRecordingUnpaused', handleRecordingUnpaused);
      window.removeEventListener('obsStreamingStarted', handleStreamingStarted);
      window.removeEventListener('obsStreamingStopped', handleStreamingStopped);
    };
  }, []);

  return {
    isObs: config.isObs,
    obsStatus,
    config,
    startBroadcastTour,
    stopBroadcastTour,
  };
}
