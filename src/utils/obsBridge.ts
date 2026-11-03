/**
 * OBS Studio Integration & Webhook/Event Bridge Utility
 * Supports OBS Browser Source window.obsstudio API, native events, and URL parameters.
 */

export interface ObsStatus {
  recording: boolean;
  recordingPaused?: boolean;
  streaming: boolean;
  virtualCam?: boolean;
  replayBuffer?: boolean;
}

export interface ObsBridgeConfig {
  isObs: boolean;
  isAutoTour: boolean;
  tourPace?: 'short' | 'medium' | 'long';
  cleanBroadcast: boolean;
}

declare global {
  interface Window {
    obsstudio?: {
      pluginVersion?: string;
      getStatus?: (callback: (status: ObsStatus) => void) => void;
      onActiveChange?: (callback: (active: boolean) => void) => void;
      onVisibilityChange?: (callback: (visible: boolean) => void) => void;
      getCurrentScene?: (callback: (scene: { name: string; width: number; height: number }) => void) => void;
    };
  }
}

/**
 * Parses URL query parameters for OBS and automated tour configurations:
 * ?obs=1 -> flags OBS environment, enables clean broadcast mode
 * ?tour=auto -> automatically plays tour on first body without zooming in
 * ?pace=short|medium|long -> pre-sets tour progression pace
 * ?clean=1 -> hides all toolbars and non-essential UI
 */
export function parseObsUrlParams(): ObsBridgeConfig {
  if (typeof window === 'undefined') {
    return { isObs: false, isAutoTour: false, cleanBroadcast: false };
  }

  const params = new URLSearchParams(window.location.search);
  const obsParam = params.get('obs');
  const tourParam = params.get('tour');
  const paceParam = params.get('pace');
  const cleanParam = params.get('clean');

  const isObs = obsParam === '1' || obsParam === 'true' || Boolean(window.obsstudio);
  const isAutoTour = tourParam === 'auto' || tourParam === '1' || tourParam === 'true';
  const cleanBroadcast = isObs || cleanParam === '1' || cleanParam === 'true';

  let tourPace: 'short' | 'medium' | 'long' | undefined;
  if (paceParam === 'short' || paceParam === 'medium' || paceParam === 'long') {
    tourPace = paceParam;
  }

  return {
    isObs,
    isAutoTour,
    tourPace,
    cleanBroadcast,
  };
}

/**
 * Checks whether the current window is executing inside OBS Studio (Browser Source)
 */
export function checkIsObsStudio(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return Boolean(window.obsstudio) || params.get('obs') === '1' || params.get('obs') === 'true';
}
