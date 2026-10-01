import React from 'react';
import { StarData } from '../types';
import { StarEncyclopediaFrontpage } from './StarEncyclopediaFrontpage';

export interface StellarClassificationGuideProps {
  onSelectStar: (star: StarData) => void;
  onCompareStar: (star: StarData) => void;
  onJumpToCatalog?: () => void;
  onJumpToHRDiagram?: () => void;
  onJumpToConstellations?: () => void;
  onJumpToCatalogFilter?: (spectralClass?: string, stellarStage?: string) => void;
  initialSection?: 'what-is-a-star' | 'spectral-classes' | 'luminosity-stages' | 'life-cycles' | 'myths' | 'quiz';
}

/**
 * Unified StellarClassificationGuide:
 * Directly delegates to StarEncyclopediaFrontpage to eliminate duplicated UI code,
 * ensure single-source-of-truth updates, and provide the complete astrophysics & classification experience.
 */
export const StellarClassificationGuide: React.FC<StellarClassificationGuideProps> = ({
  initialSection = 'spectral-classes',
  ...props
}) => {
  return (
    <StarEncyclopediaFrontpage
      {...props}
      initialSection={initialSection}
    />
  );
};
