import { STARS_CATALOG } from './stars';
import { parseCoordinate } from '../utils/celestialMechanics';

/**
 * An AsterismNode can either be:
 * - A string: The exact ID of a star in STARS_CATALOG (e.g. 'betelgeuse', 'shaula', 'alkaid')
 * - A [number, number]: Direct [raDeg, decDeg] coordinates for guide vertices or uncataloged stars
 */
export type AsterismNode = string | [number, number];

export interface OfficialAsterismDefinition {
  id: string; // Constellation identifier e.g. 'ursa-major', 'orion', 'scorpius'
  aliases?: string[]; // E.g. ['uma'], ['ori'], ['sco']
  segments: AsterismNode[][];
}

export const OFFICIAL_ASTERISMS: OfficialAsterismDefinition[] = [
  // -------------------------------------------------------------
  // 1. URSA MAJOR (The Great Bear / The Big Dipper)
  // Fixes distorted circumpolar projection and mangled connecting lines.
  // Full IAU/astronomical figure: Big Dipper + Head/Snout + 3 Paws.
  // -------------------------------------------------------------
  {
    id: 'ursa-major',
    aliases: ['uma'],
    segments: [
      // Big Dipper Handle: Alkaid -> Mizar -> Alioth -> Megrez
      ['alkaid', 'mizar-aa', 'alioth', 'megrez'],
      // Big Dipper Bowl: Megrez -> Dubhe -> Merak -> Phecda -> Megrez (closed quad bowl)
      ['megrez', 'dubhe', 'merak', 'phecda', 'megrez'],
      // Bear's Head / Snout: Dubhe reaching forward to Muscida (Omicron UMa)
      ['dubhe', 'muscida'],
      // Bear's Front Paw: Merak reaching down to Talitha (Iota UMa)
      ['merak', 'talitha'],
      // Bear's Middle Paw: Phecda reaching down to Tania Borealis & Australis
      ['phecda', 'tania-borealis', 'tania-australis'],
      // Bear's Hind Paw: Phecda reaching down to Alula Borealis & Australis
      ['phecda', 'alula-borealis', 'alula-australis']
    ]
  },

  // -------------------------------------------------------------
  // 2. ORION (The Hunter)
  // Fixes incomplete lines. Restores complete hourglass torso, triangular
  // head (Meissa), sword (Hatysa/M42), western bow/shield arc (Pi stars),
  // and raised eastern club (Betelgeuse to Chi-1 Ori).
  // -------------------------------------------------------------
  {
    id: 'orion',
    aliases: ['ori'],
    segments: [
      // Shoulders: Betelgeuse <-> Bellatrix
      ['betelgeuse', 'bellatrix'],
      // West Body: Bellatrix <-> Rigel
      ['bellatrix', 'rigel'],
      // Feet Base: Rigel <-> Saiph
      ['rigel', 'saiph'],
      // East Body: Saiph <-> Betelgeuse
      ['saiph', 'betelgeuse'],
      // Orion's Belt: Mintaka <-> Alnilam <-> Alnitak
      ['mintaka', 'alnilam', 'alnitak'],
      // Head: Triangular apex Betelgeuse <-> Meissa (Lambda Ori) <-> Bellatrix
      ['betelgeuse', 'meissa', 'bellatrix'],
      // Orion's Sword / Nebula: Alnilam hanging down to Hatysa (Iota Ori / M42)
      ['alnilam', 'hatysa'],
      // Shield / Bow: Attached to Bellatrix at Tabit (Pi-3 Ori) with curved Pi arc
      ['bellatrix', 'tabit'],
      [[73.72, 10.15], [72.65, 8.90], 'tabit', [72.80, 5.61], [73.56, 2.44], [74.64, 1.71]],
      // Raised Club: Extending high above Betelgeuse toward Gemini
      ['betelgeuse', [90.60, 9.65], [92.99, 14.21], [91.89, 14.77], 'chi-1-orionis']
    ]
  },

  // -------------------------------------------------------------
  // 3. SCORPIUS (The Scorpion)
  // Fixes truncated stinger and single-bar claws. Restores the iconic
  // 3-claw crown, heart/spine, curving southern belly, and the full
  // hooked stinger tail curling up into Shaula & Lesath.
  // -------------------------------------------------------------
  {
    id: 'scorpius',
    aliases: ['sco'],
    segments: [
      // Three-claw Crown: Acrab (Beta) <-> Dschubba (Delta) <-> Fang (Pi Sco)
      ['acrab', 'dschubba', 'fang'],
      // Crown to Heart: Dschubba <-> Alniyat (Sigma) <-> Antares (Alpha)
      ['dschubba', 'alniyat', 'antares'],
      // Torso & Heart to Belly: Antares <-> Paikauhale (Tau) <-> Larawag (Epsilon) <-> Xamidimura (Mu-1)
      ['antares', 'tau-scorpii', 'larawag', 'xamidimura'],
      // Curving Southern Spine: Mu-1 Sco sweeping south through Zeta & Eta to Sargas (Theta)
      ['xamidimura', [-106.35, -42.36], [-101.96, -43.24], 'sargas'],
      // Hooked Tail & Stinger: Sargas curling northeast through Apollyon & Girtab to Shaula & Lesath
      ['sargas', 'iota-1-scorpii', 'girtab', 'shaula', 'lesath']
    ]
  },

  // -------------------------------------------------------------
  // 4. LEO (The Lion)
  // The Sickle (head & mane) + Body Rectangle + Hindquarters Triangle
  // -------------------------------------------------------------
  {
    id: 'leo',
    aliases: ['leo'],
    segments: [
      // The Sickle (backward question mark): Alterf -> Rasalas -> Adhafera -> Algieba -> Eta Leo -> Regulus
      [[146.46, 23.77], [148.19, 26.01], [154.17, 23.42], 'algieba', [151.83, 16.76], 'regulus'],
      // Body & Hind Triangle: Regulus -> Chertan -> Denebola -> Zosma -> Algieba
      ['regulus', 'chertan', 'denebola', 'zosma', 'algieba'],
      // Flank divider: Chertan -> Zosma
      ['chertan', 'zosma']
    ]
  },

  // -------------------------------------------------------------
  // 5. CASSIOPEIA (The Queen)
  // The iconic W shape
  // -------------------------------------------------------------
  {
    id: 'cassiopeia',
    aliases: ['cas'],
    segments: [
      ['caph', 'schedar', 'gamma-cassiopeiae', 'ruchbah', 'segin']
    ]
  },

  // -------------------------------------------------------------
  // 6. CYGNUS (The Swan / Northern Cross)
  // -------------------------------------------------------------
  {
    id: 'cygnus',
    aliases: ['cyg'],
    segments: [
      // Long crossbar / body: Deneb -> Sadr -> Albireo
      ['deneb', 'sadr', 'albireo'],
      // Wings: Fawaris (Delta Cyg) -> Sadr -> Gienah (Epsilon Cyg)
      ['fawaris', 'sadr', 'gienah-cygni']
    ]
  },

  // -------------------------------------------------------------
  // 7. CRUX (The Southern Cross)
  // -------------------------------------------------------------
  {
    id: 'crux',
    aliases: ['cru'],
    segments: [
      // Vertical beam: Gacrux -> Acrux
      ['gacrux', 'acrux-a'],
      // Horizontal crossbar: Mimosa -> Imai
      ['mimosa', 'imai']
    ]
  },

  // -------------------------------------------------------------
  // 8. CANIS MAJOR (The Great Dog)
  // -------------------------------------------------------------
  {
    id: 'canis-major',
    aliases: ['cma'],
    segments: [
      ['mirzam', 'sirius-a', [104.03, -17.05]],
      ['sirius-a', 'wezen', 'adhara', [95.08, -30.06]],
      ['wezen', 'aludra']
    ]
  },

  // -------------------------------------------------------------
  // 9. BOÖTES (The Herdsman / Kite)
  // -------------------------------------------------------------
  {
    id: 'bootes',
    aliases: ['boo'],
    segments: [
      ['arcturus', 'muphrid'],
      ['arcturus', 'izar', 'seginus', 'nekkar', 'izar']
    ]
  },

  // -------------------------------------------------------------
  // 10. SAGITTARIUS (The Archer / Teapot)
  // -------------------------------------------------------------
  {
    id: 'sagittarius',
    aliases: ['sgr'],
    segments: [
      // Teapot Spout: Alnasl -> Kaus Media -> Kaus Australis -> Alnasl
      ['alnasl', 'kaus-media', 'kaus-australis', 'alnasl'],
      // Teapot Lid: Kaus Media -> Kaus Borealis -> Nunki
      ['kaus-media', 'kaus-borealis', 'nunki'],
      // Teapot Handle: Nunki -> Ascella -> Kaus Australis
      ['nunki', 'ascella', 'kaus-australis'],
      // Lid rim: Kaus Borealis -> Ascella
      ['kaus-borealis', 'ascella']
    ]
  },

  // -------------------------------------------------------------
  // 11. PEGASUS (The Winged Horse)
  // -------------------------------------------------------------
  {
    id: 'pegasus',
    aliases: ['peg'],
    segments: [
      // Great Square: Markab -> Scheat -> Alpheratz -> Algenib -> Markab
      ['markab', 'scheat', 'alpheratz', 'algenib', 'markab'],
      // Neck and Head: Markab -> Homam -> Enif
      ['markab', 'homam', 'enif']
    ]
  },

  // -------------------------------------------------------------
  // 12. TAURUS (The Bull)
  // -------------------------------------------------------------
  {
    id: 'taurus',
    aliases: ['tau'],
    segments: [
      // Northern Horn: Elnath -> Aldebaran
      ['elnath', [67.15, 19.18], 'aldebaran'],
      // Southern Horn: Tianguan (Zeta Tau) -> Aldebaran
      ['tianguan', 'aldebaran'],
      // Hyades V-Face:
      ['aldebaran', [65.73, 17.54], [64.95, 15.63], [67.17, 15.87], 'aldebaran']
    ]
  },

  // -------------------------------------------------------------
  // 13. LYRA (The Lyre)
  // -------------------------------------------------------------
  {
    id: 'lyra',
    aliases: ['lyr'],
    segments: [
      ['vega', 'sheliak', 'sulafat', [283.4, 32.7], 'vega']
    ]
  },

  // -------------------------------------------------------------
  // 14. URSA MINOR (The Little Bear / Little Dipper)
  // -------------------------------------------------------------
  {
    id: 'ursa-minor',
    aliases: ['umi'],
    segments: [
      ['kochab', 'pherkad', [230.2, 71.8], [222.7, 74.2], 'kochab'],
      [[230.2, 71.8], [251.5, 82.0], [263.1, 86.6], 'polaris']
    ]
  },

  // -------------------------------------------------------------
  // 15. AQUARIUS (The Water-Bearer)
  // -------------------------------------------------------------
  {
    id: 'aquarius',
    aliases: ['aqr'],
    segments: [
      // Shoulders & Chest: Sadalsuud <-> Sadalmelik
      ['sadalsuud', 'sadalmelik'],
      // West arm reaching to Albali
      ['sadalsuud', [311.92, -9.50]],
      // Water stream cascading down from Sadalmelik through Ancha & Hydor to Skat
      ['sadalmelik', [334.21, -7.78], [343.15, -7.58], 'skat']
    ]
  },

  // -------------------------------------------------------------
  // 16. GEMINI (The Twins)
  // -------------------------------------------------------------
  {
    id: 'gemini',
    aliases: ['gem'],
    segments: [
      // Castor twin: Castor -> Mebsuta -> Tejat Posterior -> Propus
      ['castor-aa', 'mebsuta', 'tejat-posterior', 'propus'],
      // Pollux twin: Pollux -> Wasat -> Alhena
      ['pollux', 'wasat', 'alhena'],
      // Heads connected: Castor <-> Pollux
      ['castor-aa', 'pollux']
    ]
  },

  // -------------------------------------------------------------
  // 17. ANDROMEDA (The Chained Maiden)
  // -------------------------------------------------------------
  {
    id: 'andromeda',
    aliases: ['and'],
    segments: [
      ['alpheratz', 'mirach', 'almach']
    ]
  },

  // -------------------------------------------------------------
  // 18. CORONA BOREALIS (The Northern Crown)
  // -------------------------------------------------------------
  {
    id: 'corona-borealis',
    aliases: ['crb'],
    segments: [
      [[231.2, 30.6], 'nusakan', 'alphecca', [235.9, 29.1], [238.9, 26.3]]
    ]
  },

  // -------------------------------------------------------------
  // 19. AURIGA (The Charioteer)
  // -------------------------------------------------------------
  {
    id: 'auriga',
    aliases: ['aur'],
    segments: [
      // Pentagon: Capella -> Menkalinan -> [89.8, 30.0] -> 'elnath' -> Almaaz -> Capella
      ['capella-aa', 'menkalinan', [89.8, 30.0], 'elnath', 'almaaz', 'capella-aa']
    ]
  }
];

/**
 * Resolves an asterism definition into clean GeoJSON-compatible number[][][]
 * coordinates with catalog star IDs tagged for 100% exact snapping.
 */
export function getCuratedAsterismCoordinates(
  constellationId: string,
  constellationAbbr?: string
): number[][][] | null {
  const cleanId = (constellationId || '').toLowerCase().trim();
  const cleanAbbr = (constellationAbbr || '').toLowerCase().trim();

  const asterism = OFFICIAL_ASTERISMS.find(
    (a) => a.id === cleanId || (a.aliases && (a.aliases.includes(cleanId) || a.aliases.includes(cleanAbbr)))
  );

  if (!asterism) return null;

  const resultSegments: number[][][] = [];

  for (const seg of asterism.segments) {
    const curSeg: number[][] = [];
    for (const node of seg) {
      if (Array.isArray(node)) {
        let r = node[0];
        if (r < 0) r += 360;
        const pt: any = [r, node[1]];
        pt.isDirectCoord = true;
        curSeg.push(pt);
      } else if (typeof node === 'string') {
        const star = STARS_CATALOG.find((s) => s.id === node);
        if (star) {
          const rawRa = (star as any).rightAscension || (star as any).ra;
          const rawDec = (star as any).declination || (star as any).dec;
          const raHours = parseCoordinate(rawRa);
          const decDeg = parseCoordinate(rawDec);
          if (!isNaN(raHours) && !isNaN(decDeg)) {
            const raDeg = ((raHours * 15) % 360 + 360) % 360;
            const pt: any = [raDeg, decDeg];
            pt.catalogStarId = star.id;
            curSeg.push(pt);
          }
        }
      }
    }
    if (curSeg.length >= 2) {
      resultSegments.push(curSeg);
    }
  }

  return resultSegments.length > 0 ? resultSegments : null;
}
