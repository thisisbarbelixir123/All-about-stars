const fs = require('fs');
const { formatStar } = require('./star_formatter.cjs');

// Read existing part 1 (Andromeda through Cepheus)
const stars1To20 = require('./create_stars_a_to_l.cjs');
// Read part 2 (Cetus through Indus)
const stars21To44 = require('./data_part1_cetus_to_indus.cjs');

// Combine
const allAtoL = [...stars1To20, ...stars21To44];

console.log(`Total A to L stars: ${allAtoL.length}`);

const outPath = 'src/data/starsRemainingMainConstellationsAtoL.ts';
const code = `import { StarData } from '../types';
import { makeStar } from './starHelper';

export const STARS_REMAINING_MAIN_A_TO_L: StarData[] = [
${allAtoL.map(formatStar).join(',\n\n')}
];
`;

fs.writeFileSync(outPath, code, 'utf-8');
console.log(`Successfully generated ${allAtoL.length} stars into ${outPath}`);
