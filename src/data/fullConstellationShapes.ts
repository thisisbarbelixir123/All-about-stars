import { ConstellationShape } from './constellationsCore';
import { FULL_CONSTELLATION_SHAPES as PART_1 } from './fullConstellationShapesPart1';
import { FULL_CONSTELLATION_SHAPES_PART_2 as PART_2 } from './fullConstellationShapesPart2';

export const FULL_CONSTELLATION_SHAPES: Record<string, ConstellationShape> = {
  ...PART_1,
  ...PART_2
};
