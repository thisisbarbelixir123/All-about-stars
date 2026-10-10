// Global Canvas Safety Guard
// Completely protects CanvasRenderingContext2D and CanvasGradient against non-finite arguments
// and invalid CSS color strings (such as scientific notation numbers e.g. 1e-16 in rgba() in Firefox)

export function installCanvasSafetyPatches(): void {
  if (typeof window === 'undefined') return;

  // 1. Patch CanvasGradient.prototype.addColorStop
  if (typeof CanvasGradient !== 'undefined' && CanvasGradient.prototype) {
    const originalAddColorStop = CanvasGradient.prototype.addColorStop;

    CanvasGradient.prototype.addColorStop = function (offset: number, color: string): void {
      try {
        const safeOffset = Math.max(0, Math.min(1, Number.isFinite(offset) ? offset : 0));

        let safeColor = typeof color === 'string' ? color.trim() : 'rgba(0, 0, 0, 0)';

        if (!safeColor || safeColor.includes('NaN') || safeColor.includes('undefined') || safeColor.includes('null')) {
          safeColor = 'rgba(0, 0, 0, 0)';
        } else if (safeColor === 'transparent') {
          safeColor = 'rgba(0, 0, 0, 0)';
        }

        // Check for scientific notation or unparsed expressions in rgba / rgb strings
        if (safeColor.includes('rgba')) {
          safeColor = safeColor.replace(/rgba\(\s*(-?\d*\.?\d+(?:[eE][-+]?\d+)?)\s*,\s*(-?\d*\.?\d+(?:[eE][-+]?\d+)?)\s*,\s*(-?\d*\.?\d+(?:[eE][-+]?\d+)?)\s*,\s*(-?\d*\.?\d+(?:[eE][-+]?\d+)?)\s*\)/gi, (_m, rStr, gStr, bStr, aStr) => {
            const r = Math.max(0, Math.min(255, Math.round(parseFloat(rStr) || 0)));
            const g = Math.max(0, Math.min(255, Math.round(parseFloat(gStr) || 0)));
            const b = Math.max(0, Math.min(255, Math.round(parseFloat(bStr) || 0)));
            const aRaw = parseFloat(aStr);
            const a = Number.isFinite(aRaw) ? Math.max(0, Math.min(1, aRaw)) : 0;
            return `rgba(${r}, ${g}, ${b}, ${a.toFixed(4)})`;
          });
        } else if (safeColor.includes('rgb')) {
          safeColor = safeColor.replace(/rgb\(\s*(-?\d*\.?\d+(?:[eE][-+]?\d+)?)\s*,\s*(-?\d*\.?\d+(?:[eE][-+]?\d+)?)\s*,\s*(-?\d*\.?\d+(?:[eE][-+]?\d+)?)\s*\)/gi, (_m, rStr, gStr, bStr) => {
            const r = Math.max(0, Math.min(255, Math.round(parseFloat(rStr) || 0)));
            const g = Math.max(0, Math.min(255, Math.round(parseFloat(gStr) || 0)));
            const b = Math.max(0, Math.min(255, Math.round(parseFloat(bStr) || 0)));
            return `rgb(${r}, ${g}, ${b})`;
          });
        } else if (/[eE]/.test(safeColor)) {
          safeColor = safeColor.replace(/[-+]?\d*\.?\d+[eE][-+]?\d+/g, (match) => {
            const val = parseFloat(match);
            if (!Number.isFinite(val) || Math.abs(val) < 0.0001) return '0';
            if (val >= 0.9999) return '1';
            return val.toFixed(4);
          });
        }

        originalAddColorStop.call(this, safeOffset, safeColor);
      } catch {
        try {
          const safeOffset = Math.max(0, Math.min(1, Number.isFinite(offset) ? offset : 0));
          originalAddColorStop.call(this, safeOffset, 'rgba(0, 0, 0, 0)');
        } catch {
          // Suppress any further error so the requestAnimationFrame render loop never breaks
        }
      }
    };
  }

  // 2. Patch CanvasRenderingContext2D.prototype.createRadialGradient
  if (typeof CanvasRenderingContext2D !== 'undefined' && CanvasRenderingContext2D.prototype) {
    const originalCreateRadialGradient = CanvasRenderingContext2D.prototype.createRadialGradient;

    CanvasRenderingContext2D.prototype.createRadialGradient = function (
      x0: number,
      y0: number,
      r0: number,
      x1: number,
      y1: number,
      r1: number
    ): CanvasGradient {
      const sX0 = Number.isFinite(x0) ? x0 : 0;
      const sY0 = Number.isFinite(y0) ? y0 : 0;
      const sR0 = Number.isFinite(r0) ? Math.max(0, r0) : 0;
      const sX1 = Number.isFinite(x1) ? x1 : sX0;
      const sY1 = Number.isFinite(y1) ? y1 : sY0;
      const sR1 = Number.isFinite(r1) ? Math.max(0.001, r1) : Math.max(0.001, sR0 + 1);

      try {
        return originalCreateRadialGradient.call(this, sX0, sY0, sR0, sX1, sY1, sR1);
      } catch {
        // Fallback with minimal safe parameters
        return originalCreateRadialGradient.call(this, 0, 0, 0, 0, 0, 100);
      }
    };

    // 3. Patch CanvasRenderingContext2D.prototype.createLinearGradient
    const originalCreateLinearGradient = CanvasRenderingContext2D.prototype.createLinearGradient;

    CanvasRenderingContext2D.prototype.createLinearGradient = function (
      x0: number,
      y0: number,
      x1: number,
      y1: number
    ): CanvasGradient {
      const sX0 = Number.isFinite(x0) ? x0 : 0;
      const sY0 = Number.isFinite(y0) ? y0 : 0;
      const sX1 = Number.isFinite(x1) ? x1 : 0;
      const sY1 = Number.isFinite(y1) ? y1 : 0;

      try {
        return originalCreateLinearGradient.call(this, sX0, sY0, sX1, sY1);
      } catch {
        return originalCreateLinearGradient.call(this, 0, 0, 100, 0);
      }
    };
  }
}

// Auto-install on module load
installCanvasSafetyPatches();
