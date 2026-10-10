import React from 'react';
import { StarData } from '../types';

export interface StarDot2DProps {
  star?: StarData | null;
  colorHex?: string;
  sizeClassName?: string;
  pulse?: boolean;
  className?: string;
}

export const StarDot2D: React.FC<StarDot2DProps> = ({
  star,
  colorHex,
  sizeClassName = 'w-2.5 h-2.5',
  pulse = false,
  className = '',
}) => {
  const finalColor = colorHex || star?.colorHex || '#ffffff';

  return (
    <span
      className={`inline-block rounded-full shrink-0 ${pulse ? 'animate-pulse' : ''} ${sizeClassName} ${className}`}
      style={{
        backgroundColor: finalColor,
        boxShadow: `0 0 8px ${finalColor}cc`,
      }}
      aria-hidden="true"
    />
  );
};
