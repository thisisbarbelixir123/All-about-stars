import React, { useId } from 'react';
import { StarData } from '../types';
import { computeD65StellarColor } from '../utils/stellarColorsD65';

export interface StarDot2DProps {
  star?: StarData | null;
  colorHex?: string;
  coronaColorHex?: string;
  sizeClassName?: string;
  pulse?: boolean;
  className?: string;
  /**
   * If true, renders diffraction flare spikes (also non-solid / translucent).
   * Default is false for small dots.
   */
  showDiffractionSpikes?: boolean;
}

/**
 * StarDot2D: Concentric Corona Colorization with Brighter Lower Circle
 * 
 * Rules:
 * 1. Concentric corona colorization:
 *    - Translucent outer corona atmospheric halo
 *    - Concentric inner corona ring
 *    - Photosphere core
 * 2. Brighter lower circle:
 *    - Distinct lower concentric disc / crescent highlight with elevated luminosity
 * 3. The shine from the stars are not 100% solid:
 *    - All shines, rays, and outer halos use smooth alpha gradients (max 0.45 opacity fading to 0%)
 */
export const StarDot2D: React.FC<StarDot2DProps> = ({
  star,
  colorHex,
  coronaColorHex,
  sizeClassName = 'w-3 h-3',
  pulse = false,
  className = '',
  showDiffractionSpikes = false,
}) => {
  const uniqueId = useId().replace(/[:]/g, '');

  let baseColor = colorHex;
  let outerCorona = coronaColorHex;
  let innerCorona = coronaColorHex;
  let brighterLower = colorHex;

  if (star) {
    const d65 = computeD65StellarColor({
      spectralType: star.spectralType,
      spectralClass: star.spectralClass,
      temperature: star.temperature,
      stellarStage: star.stellarStage,
    });
    baseColor = colorHex || star.colorHex || d65.colorHex;
    outerCorona = coronaColorHex || star.coronaColorHex || d65.coronaColorHex;
    innerCorona = d65.innerCoronaHex || outerCorona;
    brighterLower = d65.brighterLowerHex || baseColor;
  } else if (baseColor) {
    const d65 = computeD65StellarColor({ spectralClass: 'G', temperature: 5778 });
    outerCorona = coronaColorHex || d65.coronaColorHex;
    innerCorona = d65.innerCoronaHex;
    brighterLower = d65.brighterLowerHex;
  } else {
    baseColor = '#ffefdf';
    outerCorona = '#ffdca8';
    innerCorona = '#fff8e7';
    brighterLower = '#ffffff';
  }

  const shineGradId = `star-shine-${uniqueId}`;
  const coronaGradId = `star-corona-${uniqueId}`;
  const coreGradId = `star-core-${uniqueId}`;

  return (
    <span
      className={`relative inline-flex items-center justify-center shrink-0 ${
        pulse ? 'animate-pulse' : ''
      } ${sizeClassName} ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 36 36"
        className="w-full h-full overflow-visible pointer-events-none select-none"
      >
        <defs>
          {/* Layer 1: Ethereal non-solid outer shine (strictly translucent, max 45% alpha) */}
          <radialGradient id={shineGradId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={outerCorona} stopOpacity="0.42" />
            <stop offset="45%" stopColor={outerCorona} stopOpacity="0.18" />
            <stop offset="85%" stopColor={outerCorona} stopOpacity="0.04" />
            <stop offset="100%" stopColor={outerCorona} stopOpacity="0.0" />
          </radialGradient>

          {/* Layer 2: Concentric inner corona ring */}
          <radialGradient id={coronaGradId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={innerCorona} stopOpacity="0.65" />
            <stop offset="60%" stopColor={outerCorona} stopOpacity="0.35" />
            <stop offset="100%" stopColor={outerCorona} stopOpacity="0.0" />
          </radialGradient>

          {/* Layer 3: Photosphere core with brighter lower circle concentration */}
          <radialGradient id={coreGradId} cx="50%" cy="66%" r="52%">
            <stop offset="0%" stopColor={brighterLower} stopOpacity="1.0" />
            <stop offset="55%" stopColor={baseColor} stopOpacity="1.0" />
            <stop offset="100%" stopColor={baseColor} stopOpacity="0.92" />
          </radialGradient>
        </defs>

        {/* Optional diffraction cross spikes (non-solid, translucent 28% opacity) */}
        {showDiffractionSpikes && (
          <g opacity="0.32">
            <line x1="2" y1="18" x2="34" y2="18" stroke={innerCorona} strokeWidth="0.8" strokeLinecap="round" />
            <line x1="18" y1="2" x2="18" y2="34" stroke={innerCorona} strokeWidth="0.8" strokeLinecap="round" />
          </g>
        )}

        {/* 1. Translucent Non-Solid Outer Shine Halo */}
        <circle cx="18" cy="18" r="17" fill={`url(#${shineGradId})`} />

        {/* 2. Concentric Corona Outer Ring */}
        <circle
          cx="18"
          cy="18"
          r="12.5"
          fill="none"
          stroke={outerCorona}
          strokeWidth="0.9"
          strokeOpacity="0.35"
        />

        {/* 3. Concentric Corona Inner Aura */}
        <circle cx="18" cy="18" r="11" fill={`url(#${coronaGradId})`} />

        {/* 4. Photosphere Core Disc */}
        <circle cx="18" cy="18" r="7.5" fill={`url(#${coreGradId})`} />

        {/* 5. Concentric Brighter Lower Circle (luminous lower crescent/circle concentration) */}
        <ellipse
          cx="18"
          cy="21.5"
          rx="4.2"
          ry="2.4"
          fill={brighterLower}
          opacity="0.85"
        />
        <circle
          cx="18"
          cy="21.8"
          r="1.6"
          fill="#ffffff"
          opacity="0.55"
        />
      </svg>
    </span>
  );
};
