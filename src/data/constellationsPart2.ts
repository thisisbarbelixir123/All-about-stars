import { RawConstellationInfo } from './constellationsCore';

export const CONSTELLATIONS_PART_2: RawConstellationInfo[] = [
  // 45. Lacerta
  {
    id: 'lacerta',
    name: 'Lacerta',
    latinName: 'Lacerta',
    genitive: 'Lacertae',
    abbreviation: 'Lac',
    englishName: 'The Lizard',
    hemisphere: 'Northern',
    family: 'Perseus',
    areaSqDeg: 201,
    areaRank: 68,
    principalStarId: 'alpha-lacertae',
    principalStarName: 'Alpha Lacertae',
    brightestMagnitude: 3.77,
    bestViewingMonth: 'October',
    quadrant: 'NQ4',
    isZodiac: false,
    shape: {
      stars: [
        { x: 50, y: 20, name: 'Alpha Lac', isPrincipal: true, mag: 3.77 },
        { x: 40, y: 40, name: 'Beta Lac' },
        { x: 60, y: 55, name: '4 Lac' },
        { x: 45, y: 75, name: '5 Lac' },
        { x: 55, y: 90, name: '1 Lac' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4]
      ]
    },
    description: 'A zigzagging celestial lizard created by Johannes Hevelius in 1687; home to blazar prototype BL Lacertae.',
    mythology: 'Filled a dark gap between Cygnus and Andromeda; Hevelius noted its small stars looked like a scuttling lizard.'
  },

  // 46. Leo
  {
    id: 'leo',
    name: 'Leo',
    latinName: 'Leo',
    genitive: 'Leonis',
    abbreviation: 'Leo',
    englishName: 'The Lion',
    hemisphere: 'Northern',
    family: 'Zodiac',
    areaSqDeg: 947,
    areaRank: 12,
    principalStarId: 'regulus',
    principalStarName: 'Regulus (Alpha Leonis)',
    brightestMagnitude: 1.36,
    bestViewingMonth: 'April',
    quadrant: 'NQ2',
    isZodiac: true,
    zodiacSymbol: '♌',
    zodiacDates: 'Aug 11 – Sep 16 (Astro) / Jul 23 – Aug 22 (Trad)',
    shape: {
      stars: [
        { x: 30, y: 75, name: 'Regulus', isPrincipal: true, mag: 1.36 },
        { x: 35, y: 55, name: 'Eta Leo' },
        { x: 45, y: 40, name: 'Algieba (Gamma Leo)' },
        { x: 50, y: 25, name: 'Adhafera' },
        { x: 40, y: 20, name: 'Ras Elased' },
        { x: 70, y: 50, name: 'Zosma (Delta Leo)' },
        { x: 60, y: 70, name: 'Chertan (Theta Leo)' },
        { x: 85, y: 60, name: 'Denebola (Beta Leo)' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [2, 5],
        [5, 6],
        [6, 0],
        [5, 7]
      ]
    },
    description: 'Majestic zodiac lion recognizable by the backwards "Sickle" asterism and the royal blue star Regulus.',
    mythology: 'The ferocious Nemean Lion whose golden fur was impervious to mortal weapons, strangled by Heracles.'
  },

  // 47. Leo Minor
  {
    id: 'leo-minor',
    name: 'Leo Minor',
    latinName: 'Leo Minor',
    genitive: 'Leonis Minoris',
    abbreviation: 'LMi',
    englishName: 'The Lesser Lion',
    hemisphere: 'Northern',
    family: 'Ursa Major',
    areaSqDeg: 232,
    areaRank: 64,
    principalStarId: 'praecipua',
    principalStarName: 'Praecipua (46 LMi)',
    brightestMagnitude: 3.83,
    bestViewingMonth: 'April',
    quadrant: 'NQ2',
    isZodiac: false,
    shape: {
      stars: [
        { x: 35, y: 40, name: 'Praecipua', isPrincipal: true, mag: 3.83 },
        { x: 65, y: 50, name: 'Beta LMi' },
        { x: 50, y: 75, name: '21 LMi' }
      ],
      lines: [
        [0, 1],
        [1, 2]
      ]
    },
    description: 'A faint constellation created by Hevelius north of Leo; uniquely lacks an Alpha star due to a historical catalog oversight.',
    mythology: 'Invented in 1687 to populate the empty patch between Ursa Major and Leo, representing a lion cub.'
  },

  // 48. Lepus
  {
    id: 'lepus',
    name: 'Lepus',
    latinName: 'Lepus',
    genitive: 'Leporis',
    abbreviation: 'Lep',
    englishName: 'The Hare',
    hemisphere: 'Southern',
    family: 'Orion',
    areaSqDeg: 290,
    areaRank: 51,
    principalStarId: 'arneb',
    principalStarName: 'Arneb (Alpha Leporis)',
    brightestMagnitude: 2.58,
    bestViewingMonth: 'January',
    quadrant: 'SQ1',
    isZodiac: false,
    shape: {
      stars: [
        { x: 35, y: 35, name: 'Arneb', isPrincipal: true, mag: 2.58 },
        { x: 60, y: 35, name: 'Nihal (Beta Lep)' },
        { x: 65, y: 65, name: 'Gamma Lep' },
        { x: 30, y: 65, name: 'Delta Lep' },
        { x: 80, y: 45, name: 'Mu Lep' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
        [1, 4]
      ]
    },
    description: 'Crouched at the feet of Orion the Hunter, forever pursued by Orion’s hunting dogs Canis Major and Canis Minor.',
    mythology: 'A celestial hare honored for its agility, placed below Orion to avoid the scorpion that defeated him.'
  },

  // 49. Libra
  {
    id: 'libra',
    name: 'Libra',
    latinName: 'Libra',
    genitive: 'Librae',
    abbreviation: 'Lib',
    englishName: 'The Scales',
    hemisphere: 'Southern',
    family: 'Zodiac',
    areaSqDeg: 538,
    areaRank: 29,
    principalStarId: 'zubeneschamali',
    principalStarName: 'Zubeneschamali (Beta Librae)',
    brightestMagnitude: 2.61,
    bestViewingMonth: 'June',
    quadrant: 'SQ3',
    isZodiac: true,
    zodiacSymbol: '♎',
    zodiacDates: 'Oct 31 – Nov 22 (Astro) / Sep 23 – Oct 22 (Trad)',
    shape: {
      stars: [
        { x: 50, y: 30, name: 'Zubeneschamali', isPrincipal: true, mag: 2.61 },
        { x: 30, y: 55, name: 'Zubenelgenubi (Alpha Lib)' },
        { x: 75, y: 60, name: 'Zubenelhakrabi (Gamma Lib)' },
        { x: 50, y: 80, name: 'Brachium (Sigma Lib)' }
      ],
      lines: [
        [0, 1],
        [0, 2],
        [1, 3],
        [2, 3]
      ]
    },
    description: 'The balance scales of justice held by neighboring Virgo; historically regarded as the claws of Scorpius.',
    mythology: 'The scales of Astraea, the goddess of justice; when the autumn equinox lay in Libra, day and night were equal.'
  },

  // 50. Lupus
  {
    id: 'lupus',
    name: 'Lupus',
    latinName: 'Lupus',
    genitive: 'Lupi',
    abbreviation: 'Lup',
    englishName: 'The Wolf',
    hemisphere: 'Southern',
    family: 'Hercules',
    areaSqDeg: 334,
    areaRank: 46,
    principalStarId: 'men-alpha-lupi',
    principalStarName: 'Men (Alpha Lupi)',
    brightestMagnitude: 2.30,
    bestViewingMonth: 'June',
    quadrant: 'SQ3',
    isZodiac: false,
    shape: {
      stars: [
        { x: 50, y: 30, name: 'Alpha Lup', isPrincipal: true, mag: 2.30 },
        { x: 35, y: 55, name: 'Beta Lup' },
        { x: 65, y: 50, name: 'Gamma Lup' },
        { x: 45, y: 75, name: 'Delta Lup' },
        { x: 70, y: 75, name: 'Zeta Lup' }
      ],
      lines: [
        [0, 1],
        [0, 2],
        [1, 3],
        [2, 4],
        [3, 4]
      ]
    },
    description: 'A rich southern constellation pierced by the spear of Centaurus on its way to the altar of Ara.',
    mythology: 'King Lycaon of Arcadia who served human flesh to Zeus and was transformed into a ravenous wolf.'
  },

  // 51. Lynx
  {
    id: 'lynx',
    name: 'Lynx',
    latinName: 'Lynx',
    genitive: 'Lyncis',
    abbreviation: 'Lyn',
    englishName: 'The Lynx',
    hemisphere: 'Northern',
    family: 'Ursa Major',
    areaSqDeg: 545,
    areaRank: 28,
    principalStarId: 'alpha-lyncis',
    principalStarName: 'Alpha Lyncis',
    brightestMagnitude: 3.13,
    bestViewingMonth: 'March',
    quadrant: 'NQ2',
    isZodiac: false,
    shape: {
      stars: [
        { x: 75, y: 80, name: 'Alpha Lyn', isPrincipal: true, mag: 3.13 },
        { x: 60, y: 60, name: '38 Lyn' },
        { x: 45, y: 45, name: '10 UMa' },
        { x: 35, y: 25, name: '2 Lyn' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3]
      ]
    },
    description: 'A very faint zigzagging constellation; Hevelius joked that only observers with the eyesight of a lynx could find it.',
    mythology: 'Created in 1687 to honor the sharp-eyed predatory wildcat roaming the northern forests.'
  },

  // 52. Lyra
  {
    id: 'lyra',
    name: 'Lyra',
    latinName: 'Lyra',
    genitive: 'Lyrae',
    abbreviation: 'Lyr',
    englishName: 'The Lyre / Harp',
    hemisphere: 'Northern',
    family: 'Hercules',
    areaSqDeg: 286,
    areaRank: 52,
    principalStarId: 'vega',
    principalStarName: 'Vega (Alpha Lyrae)',
    brightestMagnitude: 0.03,
    bestViewingMonth: 'August',
    quadrant: 'NQ4',
    isZodiac: false,
    shape: {
      stars: [
        { x: 35, y: 25, name: 'Vega', isPrincipal: true, mag: 0.03 },
        { x: 45, y: 45, name: 'Zeta Lyr' },
        { x: 65, y: 45, name: 'Delta Lyr' },
        { x: 60, y: 75, name: 'Sulafat (Gamma Lyr)' },
        { x: 40, y: 75, name: 'Sheliak (Beta Lyr)' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 1]
      ]
    },
    description: 'Compact gem of the summer sky anchored by brilliant sapphire-white Vega; home to the Ring Nebula (M57).',
    mythology: 'The enchanting lyre invented by Hermes from a tortoise shell and given to Orpheus, whose music charmed beasts and stones.'
  },

  // 53. Mensa
  {
    id: 'mensa',
    name: 'Mensa',
    latinName: 'Mensa',
    genitive: 'Mensae',
    abbreviation: 'Men',
    englishName: 'Table Mountain',
    hemisphere: 'Southern',
    family: 'La Caille',
    areaSqDeg: 153,
    areaRank: 75,
    principalStarId: 'alpha-mensae',
    principalStarName: 'Alpha Mensae',
    brightestMagnitude: 5.09,
    bestViewingMonth: 'January',
    quadrant: 'SQ1',
    isZodiac: false,
    shape: {
      stars: [
        { x: 50, y: 35, name: 'Alpha Men', isPrincipal: true, mag: 5.09 },
        { x: 75, y: 55, name: 'Gamma Men' },
        { x: 25, y: 65, name: 'Beta Men' }
      ],
      lines: [
        [0, 1],
        [0, 2]
      ]
    },
    description: 'The faintest constellation in the sky; its Alpha star is mag 5.09. Named after Table Mountain in Cape Town, South Africa.',
    mythology: 'Named Mons Mensae by Lacaille after his observatory site in South Africa; the Large Magellanic Cloud floats over it like a cloud.'
  },

  // 54. Microscopium
  {
    id: 'microscopium',
    name: 'Microscopium',
    latinName: 'Microscopium',
    genitive: 'Microscopii',
    abbreviation: 'Mic',
    englishName: 'The Microscope',
    hemisphere: 'Southern',
    family: 'La Caille',
    areaSqDeg: 210,
    areaRank: 66,
    principalStarId: 'gamma-microscopii',
    principalStarName: 'Gamma Microscopii',
    brightestMagnitude: 4.67,
    bestViewingMonth: 'September',
    quadrant: 'SQ4',
    isZodiac: false,
    shape: {
      stars: [
        { x: 45, y: 30, name: 'Gamma Mic', isPrincipal: true, mag: 4.67 },
        { x: 65, y: 50, name: 'Alpha Mic' },
        { x: 35, y: 70, name: 'Epsilon Mic' }
      ],
      lines: [
        [0, 1],
        [0, 2]
      ]
    },
    description: 'A modest constellation celebrating early optical microscopy, situated south of Capricornus.',
    mythology: 'Introduced by Lacaille to celebrate Antoni van Leeuwenhoek and the compound microscope unlocking the microbial world.'
  },

  // 55. Monoceros
  {
    id: 'monoceros',
    name: 'Monoceros',
    latinName: 'Monoceros',
    genitive: 'Monocerotis',
    abbreviation: 'Mon',
    englishName: 'The Unicorn',
    hemisphere: 'Equatorial',
    family: 'Heavenly Waters',
    areaSqDeg: 482,
    areaRank: 35,
    principalStarId: 'beta-monocerotis',
    principalStarName: 'Beta Monocerotis',
    brightestMagnitude: 3.74,
    bestViewingMonth: 'February',
    quadrant: 'NQ2',
    isZodiac: false,
    shape: {
      stars: [
        { x: 50, y: 40, name: 'Beta Mon', isPrincipal: true, mag: 3.74 },
        { x: 65, y: 65, name: 'Alpha Mon' },
        { x: 30, y: 30, name: 'Gamma Mon' },
        { x: 45, y: 15, name: '13 Mon' }
      ],
      lines: [
        [0, 1],
        [0, 2],
        [2, 3]
      ]
    },
    description: 'Rich in deep-sky treasures including the Rosette Nebula (NGC 2237) and the Christmas Tree Cluster inside the Cone Nebula.',
    mythology: 'A mythical horned unicorn created by Petrus Plancius in 1612, which appears multiple times in the Old Testament.'
  },

  // 56. Musca
  {
    id: 'musca',
    name: 'Musca',
    latinName: 'Musca',
    genitive: 'Muscae',
    abbreviation: 'Mus',
    englishName: 'The Fly',
    hemisphere: 'Southern',
    family: 'Bayer',
    areaSqDeg: 138,
    areaRank: 77,
    principalStarId: 'alpha-muscae',
    principalStarName: 'Alpha Muscae',
    brightestMagnitude: 2.69,
    bestViewingMonth: 'May',
    quadrant: 'SQ3',
    isZodiac: false,
    shape: {
      stars: [
        { x: 40, y: 25, name: 'Alpha Mus', isPrincipal: true, mag: 2.69 },
        { x: 65, y: 40, name: 'Beta Mus' },
        { x: 35, y: 65, name: 'Gamma Mus' },
        { x: 60, y: 75, name: 'Delta Mus' }
      ],
      lines: [
        [0, 1],
        [0, 2],
        [1, 3],
        [2, 3]
      ]
    },
    description: 'Located directly south of the Southern Cross; contains the striking dark molecular cloud known as the Coalsack nebula border.',
    mythology: 'Originally called Apis (the Bee) by Bayer in 1603; renamed Musca Australis (the Southern Fly) to avoid confusion with Apus.'
  },

  // 57. Norma
  {
    id: 'norma',
    name: 'Norma',
    latinName: 'Norma',
    genitive: 'Normae',
    abbreviation: 'Nor',
    englishName: 'The Carpenter’s Square',
    hemisphere: 'Southern',
    family: 'La Caille',
    areaSqDeg: 165,
    areaRank: 74,
    principalStarId: 'gamma-2-normae',
    principalStarName: 'Gamma-2 Normae',
    brightestMagnitude: 4.02,
    bestViewingMonth: 'July',
    quadrant: 'SQ3',
    isZodiac: false,
    shape: {
      stars: [
        { x: 50, y: 35, name: 'Gamma-2 Nor', isPrincipal: true, mag: 4.02 },
        { x: 35, y: 55, name: 'Epsilon Nor' },
        { x: 65, y: 60, name: 'Eta Nor' },
        { x: 45, y: 80, name: 'Delta Nor' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [1, 3]
      ]
    },
    description: 'Represents a carpenter’s set square and level; crossed by the glowing Norma Arm of the Milky Way galaxy.',
    mythology: 'Introduced by Lacaille in 1756 honoring craftsmanship tools used in masonry, carpentry, and geometry.'
  },

  // 58. Octans
  {
    id: 'octans',
    name: 'Octans',
    latinName: 'Octans',
    genitive: 'Octantis',
    abbreviation: 'Oct',
    englishName: 'The Octant',
    hemisphere: 'Southern',
    family: 'La Caille',
    areaSqDeg: 291,
    areaRank: 50,
    principalStarId: 'polaris-australis',
    principalStarName: 'Polaris Australis (Sigma Octantis)',
    brightestMagnitude: 5.47,
    bestViewingMonth: 'October',
    quadrant: 'SQ4',
    isZodiac: false,
    shape: {
      stars: [
        { x: 50, y: 50, name: 'Polaris Australis (South Pole Star)', isPrincipal: true, mag: 5.47 },
        { x: 75, y: 30, name: 'Nu Oct' },
        { x: 25, y: 35, name: 'Beta Oct' },
        { x: 40, y: 80, name: 'Delta Oct' }
      ],
      lines: [
        [1, 0],
        [2, 0],
        [3, 0]
      ]
    },
    description: 'Encompasses the South Celestial Pole! Its star Polaris Australis (Sigma Octantis) is the true southern pole star, depicted on Brazil’s flag.',
    mythology: 'Named by Lacaille after John Hadley’s 1730 reflecting octant, which laid the foundation for the nautical sextant.'
  },

  // 59. Ophiuchus
  {
    id: 'ophiuchus',
    name: 'Ophiuchus',
    latinName: 'Ophiuchus',
    genitive: 'Ophiuchi',
    abbreviation: 'Oph',
    englishName: 'The Serpent Bearer',
    hemisphere: 'Equatorial',
    family: 'Hercules',
    areaSqDeg: 948,
    areaRank: 11,
    principalStarId: 'rasalhague',
    principalStarName: 'Rasalhague (Alpha Ophiuchi)',
    brightestMagnitude: 2.08,
    bestViewingMonth: 'July',
    quadrant: 'SQ3',
    isZodiac: true,
    zodiacSymbol: '⛎',
    zodiacDates: 'Nov 29 – Dec 17 (The 13th Astronomical Zodiac!)',
    shape: {
      stars: [
        { x: 50, y: 20, name: 'Rasalhague', isPrincipal: true, mag: 2.08 },
        { x: 30, y: 40, name: 'Cebalrai (Beta Oph)' },
        { x: 70, y: 45, name: 'Kappa Oph' },
        { x: 35, y: 65, name: 'Yed Prior (Delta Oph)' },
        { x: 65, y: 70, name: 'Sabik (Eta Oph)' },
        { x: 50, y: 85, name: 'Zeta Oph' }
      ],
      lines: [
        [0, 1],
        [0, 2],
        [1, 3],
        [2, 4],
        [3, 5],
        [4, 5]
      ]
    },
    description: 'The real 13th constellation of the ecliptic! The Sun spends 18 days traveling through Ophiuchus each year.',
    mythology: 'Asclepius, the legendary Greek god of medicine and healing who learned the secrets of resurrecting the dead from serpents.'
  },

  // 60. Orion
  {
    id: 'orion',
    name: 'Orion',
    latinName: 'Orion',
    genitive: 'Orionis',
    abbreviation: 'Ori',
    englishName: 'The Hunter',
    hemisphere: 'Equatorial',
    family: 'Orion',
    areaSqDeg: 594,
    areaRank: 26,
    principalStarId: 'rigel',
    principalStarName: 'Rigel (Beta Orionis)',
    brightestMagnitude: 0.13,
    bestViewingMonth: 'January',
    quadrant: 'NQ1',
    isZodiac: false,
    shape: {
      stars: [
        { x: 30, y: 25, name: 'Betelgeuse (Alpha Ori)' },
        { x: 70, y: 25, name: 'Bellatrix (Gamma Ori)' },
        { x: 40, y: 50, name: 'Alnitak (Belt)' },
        { x: 50, y: 50, name: 'Alnilam (Belt)' },
        { x: 60, y: 50, name: 'Mintaka (Belt)' },
        { x: 30, y: 80, name: 'Saiph (Kappa Ori)' },
        { x: 70, y: 80, name: 'Rigel (Beta Ori)', isPrincipal: true, mag: 0.13 },
        { x: 50, y: 65, name: 'Orion Nebula (M42)' }
      ],
      lines: [
        [0, 1],
        [0, 2],
        [1, 4],
        [2, 3],
        [3, 4],
        [2, 5],
        [4, 6],
        [5, 6],
        [3, 7]
      ]
    },
    description: 'The most iconic constellation in the entire night sky, recognizable across all cultures by its three-star Belt and dazzling nebulae.',
    mythology: 'The gigantic mythological Greek hunter placed among the stars along with his hunting dogs, fleeing the Scorpion across the sky.'
  },

  // 61. Pavo
  {
    id: 'pavo',
    name: 'Pavo',
    latinName: 'Pavo',
    genitive: 'Pavonis',
    abbreviation: 'Pav',
    englishName: 'The Peacock',
    hemisphere: 'Southern',
    family: 'Bayer',
    areaSqDeg: 378,
    areaRank: 44,
    principalStarId: 'peacock',
    principalStarName: 'Peacock (Alpha Pavonis)',
    brightestMagnitude: 1.94,
    bestViewingMonth: 'August',
    quadrant: 'SQ4',
    isZodiac: false,
    shape: {
      stars: [
        { x: 75, y: 30, name: 'Peacock', isPrincipal: true, mag: 1.94 },
        { x: 50, y: 45, name: 'Beta Pav' },
        { x: 30, y: 60, name: 'Gamma Pav' },
        { x: 50, y: 75, name: 'Delta Pav' },
        { x: 70, y: 65, name: 'Lambda Pav' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 1]
      ]
    },
    description: 'A brilliant southern constellation anchored by Peacock (mag 1.94); contains globular cluster NGC 6752.',
    mythology: 'The sacred peacock of Hera, who placed the hundred eyes of her slain giant watchman Argus onto the bird’s tail feathers.'
  },

  // 62. Pegasus
  {
    id: 'pegasus',
    name: 'Pegasus',
    latinName: 'Pegasus',
    genitive: 'Pegasi',
    abbreviation: 'Peg',
    englishName: 'The Winged Horse',
    hemisphere: 'Northern',
    family: 'Perseus',
    areaSqDeg: 1121,
    areaRank: 7,
    principalStarId: 'enif',
    principalStarName: 'Enif (Epsilon Pegasi)',
    brightestMagnitude: 2.39,
    bestViewingMonth: 'October',
    quadrant: 'NQ4',
    isZodiac: false,
    shape: {
      stars: [
        { x: 30, y: 40, name: 'Markab (Alpha Peg)' },
        { x: 30, y: 70, name: 'Scheat (Beta Peg)' },
        { x: 65, y: 70, name: 'Alpheratz (Alpha And - corner)' },
        { x: 65, y: 40, name: 'Algenib (Gamma Peg)' },
        { x: 15, y: 25, name: 'Enif (Nose)', isPrincipal: true, mag: 2.39 }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
        [0, 4]
      ]
    },
    description: 'Dominated by the iconic "Great Square of Pegasus" asterism; 51 Pegasi hosted the first discovered exoplanet around a sun-like star.',
    mythology: 'The divine winged steed born from the neck of Medusa, ridden by Bellerophon to defeat the Chimera.'
  },

  // 63. Perseus
  {
    id: 'perseus',
    name: 'Perseus',
    latinName: 'Perseus',
    genitive: 'Persei',
    abbreviation: 'Per',
    englishName: 'The Hero',
    hemisphere: 'Northern',
    family: 'Perseus',
    areaSqDeg: 615,
    areaRank: 24,
    principalStarId: 'mirfak',
    principalStarName: 'Mirfak (Alpha Persei)',
    brightestMagnitude: 1.79,
    bestViewingMonth: 'December',
    quadrant: 'NQ1',
    isZodiac: false,
    shape: {
      stars: [
        { x: 50, y: 30, name: 'Mirfak', isPrincipal: true, mag: 1.79 },
        { x: 30, y: 45, name: 'Algol (Demon Star, Beta Per)' },
        { x: 70, y: 40, name: 'Gamma Per' },
        { x: 55, y: 65, name: 'Zeta Per' },
        { x: 40, y: 80, name: 'Epsilon Per' },
        { x: 65, y: 15, name: 'Eta Per (Double Cluster)' }
      ],
      lines: [
        [0, 1],
        [0, 2],
        [0, 3],
        [3, 4],
        [2, 5]
      ]
    },
    description: 'Radiant point of the August Perseid meteor shower; home to the prototype eclipsing binary star Algol.',
    mythology: 'The Greek hero who beheaded Medusa, rescued Andromeda from the sea monster Cetus, and founded Mycenae.'
  },

  // 64. Phoenix
  {
    id: 'phoenix',
    name: 'Phoenix',
    latinName: 'Phoenix',
    genitive: 'Phoenicis',
    abbreviation: 'Phe',
    englishName: 'The Phoenix',
    hemisphere: 'Southern',
    family: 'Bayer',
    areaSqDeg: 469,
    areaRank: 37,
    principalStarId: 'ankaa',
    principalStarName: 'Ankaa (Alpha Phoenicis)',
    brightestMagnitude: 2.39,
    bestViewingMonth: 'November',
    quadrant: 'SQ1',
    isZodiac: false,
    shape: {
      stars: [
        { x: 50, y: 25, name: 'Ankaa', isPrincipal: true, mag: 2.39 },
        { x: 35, y: 55, name: 'Beta Phe' },
        { x: 65, y: 55, name: 'Gamma Phe' },
        { x: 45, y: 80, name: 'Epsilon Phe' }
      ],
      lines: [
        [0, 1],
        [0, 2],
        [1, 3],
        [2, 3]
      ]
    },
    description: 'A striking southern constellation representing the legendary firebird that regenerates from its own ashes.',
    mythology: 'Introduced by Petrus Plancius in 1598, symbolizing rebirth, immortality, and celestial renewal.'
  },

  // 65. Pictor
  {
    id: 'pictor',
    name: 'Pictor',
    latinName: 'Pictor',
    genitive: 'Pictoris',
    abbreviation: 'Pic',
    englishName: 'The Painter’s Easel',
    hemisphere: 'Southern',
    family: 'La Caille',
    areaSqDeg: 247,
    areaRank: 59,
    principalStarId: 'alpha-pictoris',
    principalStarName: 'Alpha Pictoris',
    brightestMagnitude: 3.27,
    bestViewingMonth: 'January',
    quadrant: 'SQ1',
    isZodiac: false,
    shape: {
      stars: [
        { x: 45, y: 30, name: 'Alpha Pic', isPrincipal: true, mag: 3.27 },
        { x: 60, y: 65, name: 'Beta Pic (debris disk & planet)' },
        { x: 30, y: 75, name: 'Gamma Pic' }
      ],
      lines: [
        [0, 1],
        [0, 2]
      ]
    },
    description: 'Home to Beta Pictoris, the young star whose massive circumstellar debris disk and orbiting exoplanet revolutionized planet formation science.',
    mythology: 'Originally Chevalet du Peintre (The Painter’s Easel), introduced by Nicolas-Louis de Lacaille in 1756.'
  },

  // 66. Pisces
  {
    id: 'pisces',
    name: 'Pisces',
    latinName: 'Pisces',
    genitive: 'Piscium',
    abbreviation: 'Psc',
    englishName: 'The Fishes',
    hemisphere: 'Northern',
    family: 'Zodiac',
    areaSqDeg: 889,
    areaRank: 14,
    principalStarId: 'alpherg',
    principalStarName: 'Alpherg (Eta Piscium)',
    brightestMagnitude: 3.62,
    bestViewingMonth: 'November',
    quadrant: 'NQ1',
    isZodiac: true,
    zodiacSymbol: '♓',
    zodiacDates: 'Mar 12 – Apr 17 (Astro) / Feb 19 – Mar 20 (Trad)',
    shape: {
      stars: [
        { x: 25, y: 35, name: 'Western Fish (Circlet)' },
        { x: 40, y: 60, name: 'Omega Psc' },
        { x: 55, y: 80, name: 'Alrescha (Alpha Psc - Knot)' },
        { x: 70, y: 55, name: 'Alpherg (Eta Psc)', isPrincipal: true, mag: 3.62 },
        { x: 80, y: 30, name: 'Northern Fish' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4]
      ]
    },
    description: 'Sprawling V-shaped zodiac constellation connected at the knot star Alrescha; contains the First Point of Aries today.',
    mythology: 'Aphrodite and her son Eros who transformed into fish and tied their tails together with a cord to escape the monster Typhon.'
  },

  // 67. Piscis Austrinus
  {
    id: 'piscis-austrinus',
    name: 'Piscis Austrinus',
    latinName: 'Piscis Austrinus',
    genitive: 'Piscis Austrini',
    abbreviation: 'PsA',
    englishName: 'The Southern Fish',
    hemisphere: 'Southern',
    family: 'Heavenly Waters',
    areaSqDeg: 245,
    areaRank: 60,
    principalStarId: 'fomalhaut',
    principalStarName: 'Fomalhaut (Alpha PsA)',
    brightestMagnitude: 1.16,
    bestViewingMonth: 'October',
    quadrant: 'SQ4',
    isZodiac: false,
    shape: {
      stars: [
        { x: 40, y: 30, name: 'Fomalhaut', isPrincipal: true, mag: 1.16 },
        { x: 65, y: 40, name: 'Epsilon PsA' },
        { x: 75, y: 65, name: 'Delta PsA' },
        { x: 50, y: 75, name: 'Beta PsA' },
        { x: 30, y: 60, name: 'Gamma PsA' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 0]
      ]
    },
    description: 'Anchored by the solitary beacon Fomalhaut ("The Mouth of the Southern Fish"), encircled by an eye-shaped ring of dusty planetesimals.',
    mythology: 'The Great Fish that swallowed the water poured out by Aquarius; parent to the two smaller fish of Pisces in Syrian mythology.'
  },

  // 68. Puppis
  {
    id: 'puppis',
    name: 'Puppis',
    latinName: 'Puppis',
    genitive: 'Puppis',
    abbreviation: 'Pup',
    englishName: 'The Poop Deck / Stern',
    hemisphere: 'Southern',
    family: 'Heavenly Waters',
    areaSqDeg: 673,
    areaRank: 20,
    principalStarId: 'zeta-puppis',
    principalStarName: 'Zeta Puppis (Naos)',
    brightestMagnitude: 2.25,
    bestViewingMonth: 'February',
    quadrant: 'SQ2',
    isZodiac: false,
    shape: {
      stars: [
        { x: 50, y: 35, name: 'Naos (Zeta Pup)', isPrincipal: true, mag: 2.25 },
        { x: 70, y: 55, name: 'Pi Pup' },
        { x: 30, y: 65, name: 'Xi Pup (Aspinidiske)' },
        { x: 45, y: 80, name: 'Sigma Pup' }
      ],
      lines: [
        [0, 1],
        [0, 2],
        [2, 3]
      ]
    },
    description: 'The stern of the mythological ship Argo Navis; home to Naos, an extreme O-supergiant over 800,000 times as luminous as the Sun.',
    mythology: 'The elevated stern and poop deck where Jason stood guiding the ship Argo through uncharted seas.'
  },

  // 69. Pyxis
  {
    id: 'pyxis',
    name: 'Pyxis',
    latinName: 'Pyxis',
    genitive: 'Pyxidis',
    abbreviation: 'Pyx',
    englishName: 'The Mariner’s Compass',
    hemisphere: 'Southern',
    family: 'Heavenly Waters',
    areaSqDeg: 221,
    areaRank: 65,
    principalStarId: 'alpha-pyxidis',
    principalStarName: 'Alpha Pyxidis',
    brightestMagnitude: 3.68,
    bestViewingMonth: 'March',
    quadrant: 'SQ2',
    isZodiac: false,
    shape: {
      stars: [
        { x: 50, y: 25, name: 'Alpha Pyx', isPrincipal: true, mag: 3.68 },
        { x: 45, y: 55, name: 'Beta Pyx' },
        { x: 55, y: 80, name: 'Gamma Pyx' }
      ],
      lines: [
        [0, 1],
        [1, 2]
      ]
    },
    description: 'Positioned right next to the hull of Argo Navis; contains recurring nova T Pyxidis, a progenitor candidate for a Type Ia supernova.',
    mythology: 'Created by Lacaille as Pyxis Nautica, adding the magnetic navigational compass to the ancient Argonauts’ vessel.'
  },

  // 70. Reticulum
  {
    id: 'reticulum',
    name: 'Reticulum',
    latinName: 'Reticulum',
    genitive: 'Reticuli',
    abbreviation: 'Ret',
    englishName: 'The Reticle',
    hemisphere: 'Southern',
    family: 'La Caille',
    areaSqDeg: 114,
    areaRank: 82,
    principalStarId: 'alpha-reticuli',
    principalStarName: 'Alpha Reticuli',
    brightestMagnitude: 3.33,
    bestViewingMonth: 'January',
    quadrant: 'SQ1',
    isZodiac: false,
    shape: {
      stars: [
        { x: 35, y: 35, name: 'Alpha Ret', isPrincipal: true, mag: 3.33 },
        { x: 65, y: 35, name: 'Beta Ret' },
        { x: 65, y: 65, name: 'Gamma Ret' },
        { x: 35, y: 65, name: 'Delta Ret' },
        { x: 50, y: 80, name: 'Epsilon Ret' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
        [3, 4]
      ]
    },
    description: 'A compact diamond celebrating the crosshairs reticle inside telescope eyepieces, essential for measuring star positions.',
    mythology: 'Named Reticulum Rhomboidalis by Lacaille in 1756 to honor the micrometer crosshair grid he used to chart 10,000 southern stars.'
  },

  // 71. Sagitta
  {
    id: 'sagitta',
    name: 'Sagitta',
    latinName: 'Sagitta',
    genitive: 'Sagittae',
    abbreviation: 'Sge',
    englishName: 'The Arrow',
    hemisphere: 'Northern',
    family: 'Hercules',
    areaSqDeg: 80,
    areaRank: 86,
    principalStarId: 'gamma-sagittae',
    principalStarName: 'Gamma Sagittae',
    brightestMagnitude: 3.47,
    bestViewingMonth: 'August',
    quadrant: 'NQ4',
    isZodiac: false,
    shape: {
      stars: [
        { x: 80, y: 45, name: 'Gamma Sge (Point)', isPrincipal: true, mag: 3.47 },
        { x: 55, y: 50, name: 'Delta Sge (Shaft)' },
        { x: 30, y: 40, name: 'Alpha Sge (Sham)' },
        { x: 30, y: 60, name: 'Beta Sge (Feathers)' }
      ],
      lines: [
        [2, 1],
        [3, 1],
        [1, 0]
      ]
    },
    description: 'The third-smallest constellation; an unmistakable stick arrow flying across the Milky Way inside the Summer Triangle.',
    mythology: 'The celestial arrow shot by Heracles to kill the eagle that tormented Prometheus, or Apollo’s arrow that slew the Cyclopes.'
  },

  // 72. Sagittarius
  {
    id: 'sagittarius',
    name: 'Sagittarius',
    latinName: 'Sagittarius',
    genitive: 'Sagittarii',
    abbreviation: 'Sgr',
    englishName: 'The Archer',
    hemisphere: 'Southern',
    family: 'Zodiac',
    areaSqDeg: 867,
    areaRank: 15,
    principalStarId: 'kaus-australis',
    principalStarName: 'Kaus Australis (Epsilon Sgr)',
    brightestMagnitude: 1.85,
    bestViewingMonth: 'August',
    quadrant: 'SQ4',
    isZodiac: true,
    zodiacSymbol: '♐',
    zodiacDates: 'Dec 18 – Jan 18 (Astro) / Nov 22 – Dec 21 (Trad)',
    shape: {
      stars: [
        { x: 50, y: 80, name: 'Kaus Australis', isPrincipal: true, mag: 1.85 },
        { x: 35, y: 60, name: 'Kaus Media (Delta Sgr)' },
        { x: 35, y: 35, name: 'Kaus Borealis (Lambda Sgr)' },
        { x: 65, y: 45, name: 'Nunki (Sigma Sgr)' },
        { x: 75, y: 65, name: 'Ascella (Zeta Sgr)' },
        { x: 20, y: 65, name: 'Alnasl (Gamma Sgr - Spout)' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 0],
        [1, 4],
        [1, 5]
      ]
    },
    description: 'Contains the iconic "Teapot" asterism and marks the true heart of our Milky Way galaxy, directly pointing at supermassive black hole Sagittarius A*.',
    mythology: 'The mythical archer centaur aiming his arrow at the heart of Scorpius (Antares), linked in Babylon to Nergal.'
  },

  // 73. Scorpius
  {
    id: 'scorpius',
    name: 'Scorpius',
    latinName: 'Scorpius',
    genitive: 'Scorpii',
    abbreviation: 'Sco',
    englishName: 'The Scorpion',
    hemisphere: 'Southern',
    family: 'Zodiac',
    areaSqDeg: 497,
    areaRank: 33,
    principalStarId: 'antares',
    principalStarName: 'Antares (Alpha Scorpii)',
    brightestMagnitude: 0.96,
    bestViewingMonth: 'July',
    quadrant: 'SQ3',
    isZodiac: true,
    zodiacSymbol: '♏',
    zodiacDates: 'Nov 23 – Nov 28 (Astro - only 6 days!) / Oct 23 – Nov 21 (Trad)',
    shape: {
      stars: [
        { x: 25, y: 25, name: 'Dschubba (Delta Sco)' },
        { x: 25, y: 15, name: 'Graffias (Beta Sco)' },
        { x: 40, y: 35, name: 'Antares (Heart)', isPrincipal: true, mag: 0.96 },
        { x: 50, y: 55, name: 'Larawag (Epsilon Sco)' },
        { x: 55, y: 70, name: 'Sargas (Theta Sco)' },
        { x: 75, y: 75, name: 'Shaula (The Stinger)', mag: 1.62 },
        { x: 80, y: 65, name: 'Lesath (Upsilon Sco)' }
      ],
      lines: [
        [1, 0],
        [0, 2],
        [2, 3],
        [3, 4],
        [4, 5],
        [5, 6]
      ]
    },
    description: 'One of the very few constellations that truly resembles its namesake, sweeping across the southern Milky Way with a glowing stinger.',
    mythology: 'The scorpion sent by Gaia or Artemis to defeat the boastful giant hunter Orion; they are placed at opposite ends of the sky.'
  },

  // 74. Sculptor
  {
    id: 'sculptor',
    name: 'Sculptor',
    latinName: 'Sculptor',
    genitive: 'Sculptoris',
    abbreviation: 'Scl',
    englishName: 'The Sculptor’s Studio',
    hemisphere: 'Southern',
    family: 'La Caille',
    areaSqDeg: 475,
    areaRank: 36,
    principalStarId: 'alpha-sculptoris',
    principalStarName: 'Alpha Sculptoris',
    brightestMagnitude: 4.31,
    bestViewingMonth: 'November',
    quadrant: 'SQ1',
    isZodiac: false,
    shape: {
      stars: [
        { x: 35, y: 30, name: 'Alpha Scl', isPrincipal: true, mag: 4.31 },
        { x: 65, y: 40, name: 'Beta Scl' },
        { x: 50, y: 70, name: 'Gamma Scl' },
        { x: 70, y: 80, name: 'Delta Scl' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3]
      ]
    },
    description: 'Contains the South Galactic Pole and the famous Sculptor Galaxy (NGC 253), a brilliant starburst galaxy.',
    mythology: 'Introduced by Lacaille in 1756 as l’Atelier du Sculpteur (The Sculptor’s Studio) honoring classical sculptural arts.'
  },

  // 75. Scutum
  {
    id: 'scutum',
    name: 'Scutum',
    latinName: 'Scutum',
    genitive: 'Scuti',
    abbreviation: 'Sct',
    englishName: 'Sobieski’s Shield',
    hemisphere: 'Southern',
    family: 'Hercules',
    areaSqDeg: 109,
    areaRank: 84,
    principalStarId: 'alpha-scuti',
    principalStarName: 'Alpha Scuti',
    brightestMagnitude: 3.83,
    bestViewingMonth: 'August',
    quadrant: 'SQ4',
    isZodiac: false,
    shape: {
      stars: [
        { x: 50, y: 25, name: 'Alpha Sct', isPrincipal: true, mag: 3.83 },
        { x: 35, y: 50, name: 'Beta Sct' },
        { x: 65, y: 55, name: 'Gamma Sct' },
        { x: 50, y: 80, name: 'Delta Sct' }
      ],
      lines: [
        [0, 1],
        [0, 2],
        [1, 3],
        [2, 3]
      ]
    },
    description: 'The fifth-smallest constellation; immersed in the brilliant Scutum Star Cloud and home to colossal red hypergiant UY Scuti.',
    mythology: 'Created by Polish astronomer Johannes Hevelius in 1684 as Scutum Sobiescianum to honor King John III Sobieski after the Battle of Vienna.'
  },

  // 76. Serpens
  {
    id: 'serpens',
    name: 'Serpens',
    latinName: 'Serpens',
    genitive: 'Serpentis',
    abbreviation: 'Ser',
    englishName: 'The Serpent',
    hemisphere: 'Equatorial',
    family: 'Hercules',
    areaSqDeg: 637,
    areaRank: 23,
    principalStarId: 'unukalhai',
    principalStarName: 'Unukalhai (Alpha Serpentis)',
    brightestMagnitude: 2.63,
    bestViewingMonth: 'July',
    quadrant: 'NQ3/SQ3',
    isZodiac: false,
    shape: {
      stars: [
        { x: 30, y: 25, name: 'Unukalhai (Head)', isPrincipal: true, mag: 2.63 },
        { x: 20, y: 40, name: 'Beta Ser' },
        { x: 40, y: 45, name: 'Mu Ser' },
        { x: 65, y: 65, name: 'Eta Ser' },
        { x: 80, y: 75, name: 'Theta Ser (Tail)' }
      ],
      lines: [
        [1, 0],
        [0, 2],
        [2, 3],
        [3, 4]
      ]
    },
    description: 'The only constellation split into two disconnected non-contiguous parts: Serpens Caput (the Head) and Serpens Cauda (the Tail), divided by Ophiuchus; home to the Eagle Nebula (Pillars of Creation).',
    mythology: 'The enormous serpent wrestled by Asclepius (Ophiuchus), symbolizing rebirth and pharmacology.'
  },

  // 77. Sextans
  {
    id: 'sextans',
    name: 'Sextans',
    latinName: 'Sextans',
    genitive: 'Sextantis',
    abbreviation: 'Sex',
    englishName: 'The Sextant',
    hemisphere: 'Equatorial',
    family: 'Hercules',
    areaSqDeg: 314,
    areaRank: 47,
    principalStarId: 'alpha-sextantis',
    principalStarName: 'Alpha Sextantis',
    brightestMagnitude: 4.49,
    bestViewingMonth: 'April',
    quadrant: 'SQ2',
    isZodiac: false,
    shape: {
      stars: [
        { x: 35, y: 35, name: 'Alpha Sex', isPrincipal: true, mag: 4.49 },
        { x: 65, y: 55, name: 'Gamma Sex' },
        { x: 50, y: 80, name: 'Beta Sex' }
      ],
      lines: [
        [0, 1],
        [1, 2]
      ]
    },
    description: 'An equatorial constellation created by Hevelius in 1687 to commemorate his astronomical sextant destroyed in a tragic house fire in 1679.',
    mythology: 'Honors the non-telescopic sighting sextant Hevelius used to achieve legendary naked-eye star mapping precision.'
  },

  // 78. Taurus
  {
    id: 'taurus',
    name: 'Taurus',
    latinName: 'Taurus',
    genitive: 'Tauri',
    abbreviation: 'Tau',
    englishName: 'The Bull',
    hemisphere: 'Northern',
    family: 'Zodiac',
    areaSqDeg: 797,
    areaRank: 17,
    principalStarId: 'aldebaran',
    principalStarName: 'Aldebaran (Alpha Tauri)',
    brightestMagnitude: 0.85,
    bestViewingMonth: 'January',
    quadrant: 'NQ1',
    isZodiac: true,
    zodiacSymbol: '♉',
    zodiacDates: 'May 14 – Jun 21 (Astro) / Apr 20 – May 20 (Trad)',
    shape: {
      stars: [
        { x: 45, y: 55, name: 'Aldebaran (Eye of Bull)', isPrincipal: true, mag: 0.85 },
        { x: 35, y: 45, name: 'Ain (Epsilon Tau)' },
        { x: 40, y: 65, name: 'Hyades cluster base' },
        { x: 75, y: 30, name: 'Elnath (Beta Tau - Horn)' },
        { x: 70, y: 75, name: 'Zeta Tau (Southern Horn / Crab Nebula)' },
        { x: 20, y: 25, name: 'Pleiades (M45)' }
      ],
      lines: [
        [1, 0],
        [0, 2],
        [1, 3],
        [0, 4]
      ]
    },
    description: 'Magnificent zodiac constellation featuring fiery red giant Aldebaran, the V-shaped Hyades, the Pleiades cluster (M45), and the Crab Nebula (M1 supernova remnant).',
    mythology: 'Zeus disguised as a gentle snow-white bull who carried princess Europa across the sea to Crete.'
  },

  // 79. Telescopium
  {
    id: 'telescopium',
    name: 'Telescopium',
    latinName: 'Telescopium',
    genitive: 'Telescopii',
    abbreviation: 'Tel',
    englishName: 'The Telescope',
    hemisphere: 'Southern',
    family: 'La Caille',
    areaSqDeg: 252,
    areaRank: 57,
    principalStarId: 'alpha-telescopii',
    principalStarName: 'Alpha Telescopii',
    brightestMagnitude: 3.51,
    bestViewingMonth: 'August',
    quadrant: 'SQ4',
    isZodiac: false,
    shape: {
      stars: [
        { x: 45, y: 30, name: 'Alpha Tel', isPrincipal: true, mag: 3.51 },
        { x: 65, y: 60, name: 'Zeta Tel' },
        { x: 35, y: 75, name: 'Epsilon Tel' }
      ],
      lines: [
        [0, 1],
        [1, 2]
      ]
    },
    description: 'Created by Lacaille in 1756 to honor the invention of the astronomical refractor that opened humanity’s eyes to the cosmos.',
    mythology: 'Celebrates Galileo Galilei and the revolutionary tube of lenses that unveiled moons around Jupiter and craters on the Moon.'
  },

  // 80. Triangulum
  {
    id: 'triangulum',
    name: 'Triangulum',
    latinName: 'Triangulum',
    genitive: 'Trianguli',
    abbreviation: 'Tri',
    englishName: 'The Triangle',
    hemisphere: 'Northern',
    family: 'Heavenly Waters',
    areaSqDeg: 132,
    areaRank: 78,
    principalStarId: 'beta-trianguli',
    principalStarName: 'Beta Trianguli',
    brightestMagnitude: 3.00,
    bestViewingMonth: 'December',
    quadrant: 'NQ1',
    isZodiac: false,
    shape: {
      stars: [
        { x: 60, y: 35, name: 'Beta Tri', isPrincipal: true, mag: 3.00 },
        { x: 30, y: 65, name: 'Alpha Tri (Mothallah)' },
        { x: 75, y: 60, name: 'Gamma Tri' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 0]
      ]
    },
    description: 'Home to the Triangulum Galaxy (Messier 33), the third-largest galaxy in our Local Group after Andromeda and the Milky Way.',
    mythology: 'Known in ancient Greece as Deltoton due to its resemblance to the Greek letter Delta (Δ) and the Nile Delta.'
  },

  // 81. Triangulum Australe
  {
    id: 'triangulum-australe',
    name: 'Triangulum Australe',
    latinName: 'Triangulum Australe',
    genitive: 'Trianguli Australis',
    abbreviation: 'TrA',
    englishName: 'The Southern Triangle',
    hemisphere: 'Southern',
    family: 'Bayer',
    areaSqDeg: 110,
    areaRank: 83,
    principalStarId: 'atria',
    principalStarName: 'Atria (Alpha TrA)',
    brightestMagnitude: 1.91,
    bestViewingMonth: 'July',
    quadrant: 'SQ3',
    isZodiac: false,
    shape: {
      stars: [
        { x: 50, y: 25, name: 'Atria', isPrincipal: true, mag: 1.91 },
        { x: 25, y: 75, name: 'Beta TrA' },
        { x: 75, y: 75, name: 'Gamma TrA' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 0]
      ]
    },
    description: 'A striking equilateral triangle of bright stars in the southern sky anchored by orange bright giant Atria (mag 1.91).',
    mythology: 'First charted by Dutch navigators in 1598; serves as an unmistakable guidepost in southern celestial navigation.'
  },

  // 82. Tucana
  {
    id: 'tucana',
    name: 'Tucana',
    latinName: 'Tucana',
    genitive: 'Tucanae',
    abbreviation: 'Tuc',
    englishName: 'The Toucan',
    hemisphere: 'Southern',
    family: 'Bayer',
    areaSqDeg: 295,
    areaRank: 48,
    principalStarId: 'alpha-tucanae',
    principalStarName: 'Alpha Tucanae',
    brightestMagnitude: 2.86,
    bestViewingMonth: 'November',
    quadrant: 'SQ1',
    isZodiac: false,
    shape: {
      stars: [
        { x: 45, y: 25, name: 'Alpha Tuc', isPrincipal: true, mag: 2.86 },
        { x: 65, y: 55, name: 'Gamma Tuc' },
        { x: 35, y: 75, name: 'Beta Tuc' },
        { x: 60, y: 80, name: 'Delta Tuc' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3]
      ]
    },
    description: 'Contains the Small Magellanic Cloud (SMC) and 47 Tucanae (NGC 104), the second-brightest globular cluster in the sky.',
    mythology: 'Created by Dutch navigators representing the colorful South American toucan bird with its prominent bill.'
  },

  // 83. Ursa Major
  {
    id: 'ursa-major',
    name: 'Ursa Major',
    latinName: 'Ursa Major',
    genitive: 'Ursae Majoris',
    abbreviation: 'UMa',
    englishName: 'The Great Bear',
    hemisphere: 'Northern',
    family: 'Ursa Major',
    areaSqDeg: 1280,
    areaRank: 3,
    principalStarId: 'alioth',
    principalStarName: 'Alioth (Epsilon UMa)',
    brightestMagnitude: 1.77,
    bestViewingMonth: 'April',
    quadrant: 'NQ2',
    isZodiac: false,
    shape: {
      stars: [
        { x: 25, y: 40, name: 'Dubhe (Pointer)' },
        { x: 25, y: 65, name: 'Merak (Pointer)' },
        { x: 45, y: 65, name: 'Phecda' },
        { x: 45, y: 40, name: 'Megrez' },
        { x: 65, y: 35, name: 'Alioth', isPrincipal: true, mag: 1.77 },
        { x: 80, y: 25, name: 'Mizar & Alcor' },
        { x: 90, y: 15, name: 'Alkaid' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
        [3, 4],
        [4, 5],
        [5, 6]
      ]
    },
    description: 'The 3rd largest constellation; contains the world-famous "Big Dipper" (Plough) asterism whose pointer stars guide observers to Polaris.',
    mythology: 'Callisto, a nymph turned into a bear by jealous Hera; Zeus flung her by the tail into the starry heavens.'
  },

  // 84. Ursa Minor
  {
    id: 'ursa-minor',
    name: 'Ursa Minor',
    latinName: 'Ursa Minor',
    genitive: 'Ursae Minoris',
    abbreviation: 'UMi',
    englishName: 'The Lesser Bear',
    hemisphere: 'Northern',
    family: 'Ursa Major',
    areaSqDeg: 256,
    areaRank: 56,
    principalStarId: 'polaris',
    principalStarName: 'Polaris (North Star)',
    brightestMagnitude: 1.98,
    bestViewingMonth: 'June',
    quadrant: 'NQ3',
    isZodiac: false,
    shape: {
      stars: [
        { x: 20, y: 20, name: 'Polaris (North Celestial Pole)', isPrincipal: true, mag: 1.98 },
        { x: 35, y: 35, name: 'Yildun (Delta UMi)' },
        { x: 50, y: 45, name: 'Epsilon UMi' },
        { x: 60, y: 60, name: 'Zeta UMi' },
        { x: 80, y: 55, name: 'Kochab (Beta UMi)' },
        { x: 75, y: 75, name: 'Pherkad (Gamma UMi)' },
        { x: 55, y: 75, name: 'Eta UMi' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5],
        [5, 6],
        [6, 3]
      ]
    },
    description: 'Hosts the North Celestial Pole! Polaris marks the current rotational pivot around which all northern stars wheel each night.',
    mythology: 'Arcas, son of Callisto, placed beside his mother in the heavens to revolve forever around the celestial pole without setting.'
  },

  // 85. Vela
  {
    id: 'vela',
    name: 'Vela',
    latinName: 'Vela',
    genitive: 'Velorum',
    abbreviation: 'Vel',
    englishName: 'The Sails',
    hemisphere: 'Southern',
    family: 'Heavenly Waters',
    areaSqDeg: 500,
    areaRank: 32,
    principalStarId: 'regor',
    principalStarName: 'Regor (Gamma-2 Velorum)',
    brightestMagnitude: 1.78,
    bestViewingMonth: 'March',
    quadrant: 'SQ2',
    isZodiac: false,
    shape: {
      stars: [
        { x: 35, y: 35, name: 'Regor (Gamma Vel)', isPrincipal: true, mag: 1.78 },
        { x: 65, y: 30, name: 'Suhail (Lambda Vel)' },
        { x: 75, y: 65, name: 'Markeb (Kappa Vel)' },
        { x: 45, y: 75, name: 'Delta Vel' },
        { x: 25, y: 60, name: 'Mu Vel' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
        [0, 4]
      ]
    },
    description: 'The billowing sails of Argo Navis; home to the Vela Supernova Remnant and the famous Vela Pulsar.',
    mythology: 'The canvas sails that caught the ocean winds driving Jason and the Argonauts in search of the Golden Fleece.'
  },

  // 86. Virgo
  {
    id: 'virgo',
    name: 'Virgo',
    latinName: 'Virgo',
    genitive: 'Virginis',
    abbreviation: 'Vir',
    englishName: 'The Maiden',
    hemisphere: 'Equatorial',
    family: 'Zodiac',
    areaSqDeg: 1294,
    areaRank: 2,
    principalStarId: 'spica',
    principalStarName: 'Spica (Alpha Virginis)',
    brightestMagnitude: 0.98,
    bestViewingMonth: 'May',
    quadrant: 'SQ3',
    isZodiac: true,
    zodiacSymbol: '♍',
    zodiacDates: 'Sep 17 – Oct 30 (Astro - 44 days!) / Aug 23 – Sep 22 (Trad)',
    shape: {
      stars: [
        { x: 50, y: 75, name: 'Spica (Ear of Wheat)', isPrincipal: true, mag: 0.98 },
        { x: 45, y: 55, name: 'Porrima (Gamma Vir)' },
        { x: 35, y: 40, name: 'Zavijava (Beta Vir)' },
        { x: 60, y: 40, name: 'Auva (Delta Vir)' },
        { x: 75, y: 30, name: 'Vindemiatrix (Epsilon Vir)' },
        { x: 65, y: 70, name: 'Heze (Zeta Vir)' }
      ],
      lines: [
        [2, 1],
        [1, 0],
        [1, 3],
        [3, 4],
        [0, 5]
      ]
    },
    description: 'The 2nd largest constellation and largest in the Zodiac; hosts the Virgo Cluster containing over 1,500 galaxies including supergiant M87.',
    mythology: 'Dike / Astraea, the goddess of innocence and justice holding an ear of golden wheat (Spica), or Demeter the goddess of the harvest.'
  },

  // 87. Volans
  {
    id: 'volans',
    name: 'Volans',
    latinName: 'Volans',
    genitive: 'Volantis',
    abbreviation: 'Vol',
    englishName: 'The Flying Fish',
    hemisphere: 'Southern',
    family: 'Bayer',
    areaSqDeg: 141,
    areaRank: 76,
    principalStarId: 'beta-volantis',
    principalStarName: 'Beta Volantis',
    brightestMagnitude: 3.77,
    bestViewingMonth: 'March',
    quadrant: 'SQ2',
    isZodiac: false,
    shape: {
      stars: [
        { x: 45, y: 30, name: 'Beta Vol', isPrincipal: true, mag: 3.77 },
        { x: 65, y: 50, name: 'Gamma Vol' },
        { x: 30, y: 65, name: 'Alpha Vol' },
        { x: 55, y: 80, name: 'Delta Vol' },
        { x: 75, y: 70, name: 'Epsilon Vol' }
      ],
      lines: [
        [0, 1],
        [0, 2],
        [1, 3],
        [1, 4]
      ]
    },
    description: 'Depicts the tropical flying fish (Piscis Volans) leaping out of the ocean to escape pursuit by Dorado (the Dolphinfish).',
    mythology: 'Recorded by Dutch navigators Keyser and de Houtman in 1597 who were astonished by flying fish in tropical waters.'
  },

  // 88. Vulpecula
  {
    id: 'vulpecula',
    name: 'Vulpecula',
    latinName: 'Vulpecula',
    genitive: 'Vulpeculae',
    abbreviation: 'Vul',
    englishName: 'The Little Fox',
    hemisphere: 'Northern',
    family: 'Hercules',
    areaSqDeg: 268,
    areaRank: 55,
    principalStarId: 'anser',
    principalStarName: 'Anser (Alpha Vulpeculae)',
    brightestMagnitude: 4.44,
    bestViewingMonth: 'September',
    quadrant: 'NQ4',
    isZodiac: false,
    shape: {
      stars: [
        { x: 35, y: 40, name: 'Anser', isPrincipal: true, mag: 4.44 },
        { x: 65, y: 60, name: '13 Vul' },
        { x: 50, y: 75, name: '23 Vul' }
      ],
      lines: [
        [0, 1],
        [1, 2]
      ]
    },
    description: 'Home to the famous Dumbbell Nebula (M27, the first planetary nebula discovered) and the site where Jocelyn Bell Burnell discovered the first pulsar in 1967 (PSR B1919+21).',
    mythology: 'Created by Johannes Hevelius as Vulpecula et Anser (The Little Fox and the Goose) carrying a goose in its jaws.'
  }
];
