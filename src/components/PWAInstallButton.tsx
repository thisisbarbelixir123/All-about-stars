import React, { useState } from 'react';
import { Download, Share2, PlusSquare, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState<boolean>(false);

  // If already installed in standalone mode, hide button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        type="button"
        id="btn-pwa-install"
        onClick={install}
        className="min-h-[44px] flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs font-mono transition-colors cursor-pointer shrink-0"
        title="Install Starpedia 3D as a standalone app"
      >
        <Download className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
        <span className="hidden sm:inline">Install</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          type="button"
          id="btn-pwa-install-ios"
          onClick={() => setShowIOSGuide(true)}
          className="min-h-[44px] flex items-center gap-1.5 px-3 py-2 rounded-xl observatory-control border border-white/10 hover:border-sky-400/50 text-sky-300 text-xs font-mono font-semibold transition-all cursor-pointer shrink-0"
          title="Install Starpedia on iPhone or iPad"
        >
          <Download className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">Install App</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-sm rounded-2xl observatory-panel border border-white/10 p-6 shadow-2xl relative text-slate-100">
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center absolute top-3 right-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                aria-label="Close installation guide"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4 pr-8">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-sky-400">
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-mono">Install on iOS</h3>
                  <p className="text-xs text-slate-400">Add to iPhone / iPad Home Screen</p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs text-slate-300 font-sans border-y border-white/10 py-4 my-4">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-sky-400 shrink-0">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white">1. Tap the Share button</span> in the bottom Safari toolbar.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-sky-400 shrink-0">
                    <PlusSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white">2. Scroll down & select</span>{' '}
                    <span className="text-sky-300 font-mono font-medium">"Add to Home Screen"</span>.
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="min-h-[44px] w-full py-2.5 rounded-xl observatory-control border border-white/10 hover:border-white/20 text-sm font-semibold text-white transition-colors cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
