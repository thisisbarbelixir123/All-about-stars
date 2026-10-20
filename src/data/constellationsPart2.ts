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
        { ra: 22.5215, dec: 50.2825, name: 'Alpha Lac', isPrincipal: true, mag: 3.77 },
        { ra: 22.3927, dec: 52.229, name: 'Beta Lac' },
        { ra: 22.4086, dec: 49.4764, name: '4 Lac' },
        { ra: 22.4922, dec: 47.7069, name: '5 Lac' },
        { ra: 22.2662, dec: 37.7487, name: '1 Lac' }
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
        { ra: 10.1395, dec: 11.9672, name: 'Regulus', isPrincipal: true, mag: 1.36 },
        { ra: 10.1222, dec: 16.7627, name: 'Eta Leo' },
        { ra: 10.3329, dec: 19.8415, name: 'Algieba (Gamma Leo)' },
        { ra: 10.2782, dec: 23.4173, name: 'Adhafera' },
        { ra: 9.7642, dec: 23.7743, name: 'Ras Elased' },
        { ra: 11.2351, dec: 20.5237, name: 'Zosma (Delta Leo)' },
        { ra: 11.2373, dec: 15.4296, name: 'Chertan (Theta Leo)' },
        { ra: 11.8177, dec: 14.5721, name: 'Denebola (Beta Leo)' }
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
        { ra: 10.8885, dec: 34.2149, name: 'Praecipua', isPrincipal: true, mag: 3.83 },
        { ra: 10.4647, dec: 36.7072, name: 'Beta LMi' },
        { ra: 10.1238, dec: 35.2447, name: '21 LMi' }
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
        { ra: 5.5455, dec: -17.8223, name: 'Arneb', isPrincipal: true, mag: 2.58 },
        { ra: 5.4708, dec: -20.7594, name: 'Nihal (Beta Lep)' },
        { ra: 5.7411, dec: -22.4484, name: 'Gamma Lep' },
        { ra: 5.8554, dec: -20.8791, name: 'Delta Lep' },
        { ra: 5.2155, dec: -16.2055, name: 'Mu Lep' }
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
        { ra: 15.2834, dec: -9.3829, name: 'Zubeneschamali', isPrincipal: true, mag: 2.61 },
        { ra: 14.848, dec: -16.0418, name: 'Zubenelgenubi (Alpha Lib)' },
        { ra: 15.5921, dec: -14.7895, name: 'Zubenelhakrabi (Gamma Lib)' },
        { ra: 15.0678, dec: -25.282, name: 'Brachium (Sigma Lib)' }
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
        { ra: 14.6988, dec: -47.3882, name: 'Alpha Lup', isPrincipal: true, mag: 2.30 },
        { ra: 14.9755, dec: -43.134, name: 'Beta Lup' },
        { ra: 15.5857, dec: -41.1668, name: 'Gamma Lup' },
        { ra: 15.3562, dec: -40.6475, name: 'Delta Lup' },
        { ra: 15.2047, dec: -52.0992, name: 'Zeta Lup' }
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
        { ra: 9.3509, dec: 34.3926, name: 'Alpha Lyn', isPrincipal: true, mag: 3.13 },
        { ra: 9.3141, dec: 36.8026, name: '38 Lyn' },
        { ra: 9.0107, dec: 41.783, name: '10 UMa' },
        { ra: 6.327, dec: 59.011, name: '2 Lyn' }
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
        { ra: 18.6156, dec: 38.7837, name: 'Vega', isPrincipal: true, mag: 0.03 },
        { ra: 18.7462, dec: 37.6051, name: 'Zeta Lyr' },
        { ra: 18.9084, dec: 36.8986, name: 'Delta Lyr' },
        { ra: 18.9824, dec: 32.6896, name: 'Sulafat (Gamma Lyr)' },
        { ra: 18.8347, dec: 33.3627, name: 'Sheliak (Beta Lyr)' }
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
        { ra: 6.1707, dec: -74.753, name: 'Alpha Men', isPrincipal: true, mag: 5.09 },
        { ra: 5.5313, dec: -76.3409, name: 'Gamma Men' },
        { ra: 5.0453, dec: -71.3143, name: 'Beta Men' }
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
        { ra: 21.0215, dec: -32.2577, name: 'Gamma Mic', isPrincipal: true, mag: 4.67 },
        { ra: 20.8328, dec: -33.7797, name: 'Alpha Mic' },
        { ra: 21.299, dec: -32.1725, name: 'Epsilon Mic' }
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
        { ra: 6.4803, dec: -7.0331, name: 'Beta Mon', isPrincipal: true, mag: 3.74 },
        { ra: 7.6875, dec: -9.5511, name: 'Alpha Mon' },
        { ra: 6.2476, dec: -6.2748, name: 'Gamma Mon' },
        { ra: 6.5484, dec: 7.333, name: '13 Mon' }
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
        { ra: 12.6197, dec: -69.1356, name: 'Alpha Mus', isPrincipal: true, mag: 2.69 },
        { ra: 12.7713, dec: -68.1081, name: 'Beta Mus' },
        { ra: 12.5411, dec: -72.133, name: 'Gamma Mus' },
        { ra: 13.0378, dec: -71.5489, name: 'Delta Mus' }
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
        { ra: 16.3307, dec: -50.1555, name: 'Gamma-2 Nor', isPrincipal: true, mag: 4.02 },
        { ra: 16.4531, dec: -47.5548, name: 'Epsilon Nor' },
        { ra: 16.0536, dec: -49.2297, name: 'Eta Nor' },
        { ra: 16.1082, dec: -45.1733, name: 'Delta Nor' }
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
        { ra: 21.1464, dec: -88.9565, name: 'Polaris Australis (South Pole Star)', isPrincipal: true, mag: 5.47 },
        { ra: 21.6913, dec: -77.39, name: 'Nu Oct' },
        { ra: 22.7676, dec: -81.3816, name: 'Beta Oct' },
        { ra: 14.4487, dec: -83.6679, name: 'Delta Oct' }
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
        { ra: 17.5822, dec: 12.56, name: 'Rasalhague', isPrincipal: true, mag: 2.08 },
        { ra: 17.7245, dec: 4.5673, name: 'Cebalrai (Beta Oph)' },
        { ra: 16.9611, dec: 9.375, name: 'Kappa Oph' },
        { ra: 16.2391, dec: -3.6943, name: 'Yed Prior (Delta Oph)' },
        { ra: 17.173, dec: -15.7249, name: 'Sabik (Eta Oph)' },
        { ra: 16.6193, dec: -10.5671, name: 'Zeta Oph' }
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
        { ra: 5.9195, dec: 7.4071, name: 'Betelgeuse (Alpha Ori)' },
        { ra: 5.4189, dec: 6.3497, name: 'Bellatrix (Gamma Ori)' },
        { ra: 5.6793, dec: -1.9426, name: 'Alnitak (Belt)' },
        { ra: 5.6036, dec: -1.2019, name: 'Alnilam (Belt)' },
        { ra: 5.5334, dec: -0.2991, name: 'Mintaka (Belt)' },
        { ra: 5.7959, dec: -9.6696, name: 'Saiph (Kappa Ori)' },
        { ra: 5.2423, dec: -8.2016, name: 'Rigel (Beta Ori)', isPrincipal: true, mag: 0.13 },
        { ra: 5.588, dec: -5.3876, name: 'Orion Nebula (M42)' }
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
        { ra: 20.4275, dec: -56.7351, name: 'Peacock', isPrincipal: true, mag: 1.94 },
        { ra: 20.7493, dec: -66.2032, name: 'Beta Pav' },
        { ra: 21.4407, dec: -65.3662, name: 'Gamma Pav' },
        { ra: 20.1454, dec: -66.1821, name: 'Delta Pav' },
        { ra: 18.8703, dec: -62.1876, name: 'Lambda Pav' }
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
        { ra: 23.0793, dec: 15.2053, name: 'Markab (Alpha Peg)' },
        { ra: 23.0629, dec: 28.0828, name: 'Scheat (Beta Peg)' },
        { ra: 0.1398, dec: 29.0904, name: 'Alpheratz (Alpha And - corner)' },
        { ra: 0.2206, dec: 15.1836, name: 'Algenib (Gamma Peg)' },
        { ra: 21.7364, dec: 9.875, name: 'Enif (Nose)', isPrincipal: true, mag: 2.39 }
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
        { ra: 3.4054, dec: 49.8612, name: 'Mirfak', isPrincipal: true, mag: 1.79 },
        { ra: 3.1361, dec: 40.9556, name: 'Algol (Demon Star, Beta Per)' },
        { ra: 3.08, dec: 53.5065, name: 'Gamma Per' },
        { ra: 3.9022, dec: 31.8836, name: 'Zeta Per' },
        { ra: 3.9642, dec: 40.0102, name: 'Epsilon Per' },
        { ra: 2.8449, dec: 55.8955, name: 'Eta Per (Double Cluster)' }
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
        { ra: 0.4381, dec: -42.306, name: 'Ankaa', isPrincipal: true, mag: 2.39 },
        { ra: 1.1014, dec: -46.7184, name: 'Beta Phe' },
        { ra: 1.4728, dec: -43.3182, name: 'Gamma Phe' },
        { ra: 0.1568, dec: -45.7474, name: 'Epsilon Phe' }
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
        { ra: 6.8032, dec: -61.9414, name: 'Alpha Pic', isPrincipal: true, mag: 3.27 },
        { ra: 5.7881, dec: -51.0665, name: 'Beta Pic (debris disk & planet)' },
        { ra: 5.8305, dec: -56.1667, name: 'Gamma Pic' }
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
        { ra: 23.2861, dec: 3.2823, name: 'Western Fish (Circlet)' },
        { ra: 23.9885, dec: 6.8633, name: 'Omega Psc' },
        { ra: 2.0341, dec: 2.7638, name: 'Alrescha (Alpha Psc - Knot)' },
        { ra: 1.5247, dec: 15.3458, name: 'Alpherg (Eta Psc)', isPrincipal: true, mag: 3.62 },
        { ra: 1.5247, dec: 15.3458, name: 'Northern Fish' }
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
        { ra: 22.9608, dec: -29.6222, name: 'Fomalhaut', isPrincipal: true, mag: 1.16 },
        { ra: 22.6776, dec: -27.0436, name: 'Epsilon PsA' },
        { ra: 22.9325, dec: -32.5396, name: 'Delta PsA' },
        { ra: 22.5251, dec: -32.3461, name: 'Beta PsA' },
        { ra: 22.8754, dec: -32.8755, name: 'Gamma PsA' }
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
        { ra: 8.0597, dec: -40.0031, name: 'Naos (Zeta Pup)', isPrincipal: true, mag: 2.25 },
        { ra: 7.2857, dec: -37.0975, name: 'Pi Pup' },
        { ra: 7.8216, dec: -24.8598, name: 'Xi Pup (Aspinidiske)' },
        { ra: 7.4872, dec: -43.3014, name: 'Sigma Pup' }
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
        { ra: 8.7265, dec: -33.1864, name: 'Alpha Pyx', isPrincipal: true, mag: 3.68 },
        { ra: 8.6684, dec: -35.3084, name: 'Beta Pyx' },
        { ra: 8.8422, dec: -27.7098, name: 'Gamma Pyx' }
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
        { ra: 4.2404, dec: -62.4738, name: 'Alpha Ret', isPrincipal: true, mag: 3.33 },
        { ra: 3.7367, dec: -64.8069, name: 'Beta Ret' },
        { ra: 4.0149, dec: -62.1593, name: 'Gamma Ret' },
        { ra: 3.9791, dec: -61.4002, name: 'Delta Ret' },
        { ra: 4.2747, dec: -59.3022, name: 'Epsilon Ret' }
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
        { ra: 19.9793, dec: 19.4921, name: 'Gamma Sge (Point)', isPrincipal: true, mag: 3.47 },
        { ra: 19.7898, dec: 18.5343, name: 'Delta Sge (Shaft)' },
        { ra: 19.6683, dec: 18.0139, name: 'Alpha Sge (Sham)' },
        { ra: 19.6841, dec: 17.476, name: 'Beta Sge (Feathers)' }
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
        { ra: 18.4029, dec: -34.3846, name: 'Kaus Australis', isPrincipal: true, mag: 1.85 },
        { ra: 18.3499, dec: -29.8281, name: 'Kaus Media (Delta Sgr)' },
        { ra: 18.4662, dec: -25.4217, name: 'Kaus Borealis (Lambda Sgr)' },
        { ra: 18.9211, dec: -26.2967, name: 'Nunki (Sigma Sgr)' },
        { ra: 19.0435, dec: -29.8801, name: 'Ascella (Zeta Sgr)' },
        { ra: 18.0968, dec: -30.4241, name: 'Alnasl (Gamma Sgr - Spout)' }
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
        { ra: 16.0056, dec: -22.6217, name: 'Dschubba (Delta Sco)' },
        { ra: 16.0906, dec: -19.8054, name: 'Graffias (Beta Sco)' },
        { ra: 16.4901, dec: -26.432, name: 'Antares (Heart)', isPrincipal: true, mag: 0.96 },
        { ra: 16.8361, dec: -34.2932, name: 'Larawag (Epsilon Sco)' },
        { ra: 17.622, dec: -42.9978, name: 'Sargas (Theta Sco)' },
        { ra: 17.5601, dec: -37.1038, name: 'Shaula (The Stinger)', mag: 1.62 },
        { ra: 17.5127, dec: -37.2958, name: 'Lesath (Upsilon Sco)' }
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
        { ra: 0.9768, dec: -29.3575, name: 'Alpha Scl', isPrincipal: true, mag: 4.31 },
        { ra: 23.5495, dec: -37.8183, name: 'Beta Scl' },
        { ra: 23.3137, dec: -32.532, name: 'Gamma Scl' },
        { ra: 23.8154, dec: -28.1303, name: 'Delta Scl' }
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
        { ra: 18.5868, dec: -8.2441, name: 'Alpha Sct', isPrincipal: true, mag: 3.83 },
        { ra: 18.7862, dec: -4.7479, name: 'Beta Sct' },
        { ra: 18.4866, dec: -14.5658, name: 'Gamma Sct' },
        { ra: 18.7046, dec: -9.0526, name: 'Delta Sct' }
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
        { ra: 15.7378, dec: 6.4256, name: 'Unukalhai (Head)', isPrincipal: true, mag: 2.63 },
        { ra: 15.7698, dec: 15.4218, name: 'Beta Ser' },
        { ra: 15.827, dec: -3.4302, name: 'Mu Ser' },
        { ra: 18.3552, dec: -2.8988, name: 'Eta Ser' },
        { ra: 18.937, dec: 4.2036, name: 'Theta Ser (Tail)' }
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
        { ra: 10.1323, dec: -0.3717, name: 'Alpha Sex', isPrincipal: true, mag: 4.49 },
        { ra: 9.8751, dec: -8.105, name: 'Gamma Sex' },
        { ra: 10.5049, dec: -0.637, name: 'Beta Sex' }
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
        { ra: 4.5987, dec: 16.5093, name: 'Aldebaran (Eye of Bull)', isPrincipal: true, mag: 0.85 },
        { ra: 4.4769, dec: 19.1804, name: 'Ain (Epsilon Tau)' },
        { ra: 4.4777, dec: 15.8709, name: 'Hyades cluster base' },
        { ra: 5.4382, dec: 28.6075, name: 'Elnath (Beta Tau - Horn)' },
        { ra: 5.6274, dec: 21.1425, name: 'Zeta Tau (Southern Horn / Crab Nebula)' },
        { ra: 3.7734, dec: 24.1139, name: 'Pleiades (M45)' }
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
        { ra: 18.4496, dec: -45.9685, name: 'Alpha Tel', isPrincipal: true, mag: 3.51 },
        { ra: 18.4805, dec: -49.0706, name: 'Zeta Tel' },
        { ra: 18.1872, dec: -45.9544, name: 'Epsilon Tel' }
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
        { ra: 2.1591, dec: 34.9873, name: 'Beta Tri', isPrincipal: true, mag: 3.00 },
        { ra: 1.8847, dec: 29.5788, name: 'Alpha Tri (Mothallah)' },
        { ra: 2.2886, dec: 33.8472, name: 'Gamma Tri' }
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
        { ra: 16.8111, dec: -69.0277, name: 'Atria', isPrincipal: true, mag: 1.91 },
        { ra: 15.919, dec: -63.4307, name: 'Beta TrA' },
        { ra: 15.3152, dec: -68.6795, name: 'Gamma TrA' }
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
        { ra: 22.3084, dec: -60.2596, name: 'Alpha Tuc', isPrincipal: true, mag: 2.86 },
        { ra: 23.2905, dec: -58.2357, name: 'Gamma Tuc' },
        { ra: 0.5257, dec: -62.9582, name: 'Beta Tuc' },
        { ra: 22.4555, dec: -64.9664, name: 'Delta Tuc' }
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
        { ra: 11.0621, dec: 61.751, name: 'Dubhe (Pointer)' },
        { ra: 11.0307, dec: 56.3824, name: 'Merak (Pointer)' },
        { ra: 11.8972, dec: 53.6948, name: 'Phecda' },
        { ra: 12.2571, dec: 57.0326, name: 'Megrez' },
        { ra: 12.9005, dec: 55.9598, name: 'Alioth', isPrincipal: true, mag: 1.77 },
        { ra: 13.3988, dec: 54.9254, name: 'Mizar & Alcor' },
        { ra: 13.7923, dec: 49.3133, name: 'Alkaid' }
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
        { ra: 2.5303, dec: 89.2641, name: 'Polaris (North Celestial Pole)', isPrincipal: true, mag: 1.98 },
        { ra: 17.5369, dec: 86.5865, name: 'Yildun (Delta UMi)' },
        { ra: 16.7662, dec: 82.0373, name: 'Epsilon UMi' },
        { ra: 15.7343, dec: 77.7945, name: 'Zeta UMi' },
        { ra: 14.8451, dec: 74.1555, name: 'Kochab (Beta UMi)' },
        { ra: 15.3455, dec: 71.834, name: 'Pherkad (Gamma UMi)' },
        { ra: 16.2917, dec: 75.7553, name: 'Eta UMi' }
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
        { ra: 8.1589, dec: -47.3366, name: 'Regor (Gamma Vel)', isPrincipal: true, mag: 1.78 },
        { ra: 9.1333, dec: -43.4326, name: 'Suhail (Lambda Vel)' },
        { ra: 9.3686, dec: -55.0107, name: 'Markeb (Kappa Vel)' },
        { ra: 8.7451, dec: -54.7088, name: 'Delta Vel' },
        { ra: 10.7795, dec: -49.4203, name: 'Mu Vel' }
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
        { ra: 13.4199, dec: -11.1613, name: 'Spica (Ear of Wheat)', isPrincipal: true, mag: 0.98 },
        { ra: 12.6943, dec: -1.4494, name: 'Porrima (Gamma Vir)' },
        { ra: 11.8449, dec: 1.7647, name: 'Zavijava (Beta Vir)' },
        { ra: 12.9267, dec: 3.3975, name: 'Auva (Delta Vir)' },
        { ra: 13.0363, dec: 10.9591, name: 'Vindemiatrix (Epsilon Vir)' },
        { ra: 13.5782, dec: -0.5958, name: 'Heze (Zeta Vir)' }
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
        { ra: 8.4289, dec: -66.1369, name: 'Beta Vol', isPrincipal: true, mag: 3.77 },
        { ra: 7.1451, dec: -70.4971, name: 'Gamma Vol' },
        { ra: 9.0408, dec: -66.3961, name: 'Alpha Vol' },
        { ra: 7.2805, dec: -67.9572, name: 'Delta Vol' },
        { ra: 8.1322, dec: -68.6171, name: 'Epsilon Vol' }
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
        { ra: 19.4784, dec: 24.6649, name: 'Anser', isPrincipal: true, mag: 4.44 },
        { ra: 19.891, dec: 24.0796, name: '13 Vul' },
        { ra: 20.2628, dec: 27.8142, name: '23 Vul' }
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
