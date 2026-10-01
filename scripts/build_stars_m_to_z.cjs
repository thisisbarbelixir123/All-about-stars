const fs = require('fs');
const { formatStar } = require('./star_formatter.cjs');

const part2 = require('./data_part2_m_to_p.cjs');
const part3 = require('./data_part3_p_to_z.cjs');

const allMtoZ = [...part2, ...part3];
console.log(`Total M to Z stars: ${allMtoZ.length}`);

const outPath = 'src/data/starsRemainingMainConstellationsMtoZ.ts';
const code = `import { StarData } from '../types';
import { makeStar } from './starHelper';

export const STARS_REMAINING_MAIN_M_TO_Z: StarData[] = [
${allMtoZ.map(formatStar).join(',\n\n')}
];
`;

fs.writeFileSync(outPath, code, 'utf-8');
console.log(`Successfully generated ${allMtoZ.length} stars into ${outPath}`);
