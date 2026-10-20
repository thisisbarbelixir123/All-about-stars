import { RawConstellationInfo } from './constellationsCore';

export const CONSTELLATIONS_PART_1: RawConstellationInfo[] = [
  // 1. Andromeda
  {
    id: 'andromeda',
    name: 'Andromeda',
    latinName: 'Andromeda',
    genitive: 'Andromedae',
    abbreviation: 'And',
    englishName: 'The Chained Maiden',
    hemisphere: 'Northern',
    family: 'Perseus',
    areaSqDeg: 722,
    areaRank: 19,
    principalStarId: 'alpheratz',
    principalStarName: 'Alpheratz (Alpha Andromedae)',
    brightestMagnitude: 2.06,
    bestViewingMonth: 'November',
    quadrant: 'NQ1',
    isZodiac: false,
    shape: {
      stars: [
        { ra: 0.1398, dec: 29.0904, name: 'Alpheratz', isPrincipal: true, mag: 2.06 },
        { ra: 0.6554, dec: 30.861, name: 'Delta And' },
        { ra: 1.1622, dec: 35.6206, name: 'Mirach' },
        { ra: 2.065, dec: 42.3297, name: 'Almach' },
        { ra: 0.9459, dec: 38.4993, name: 'Mu And' },
        { ra: 0.6147, dec: 33.7193, name: 'Pi And' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [1, 4],
        [2, 5]
      ]
    },
    description: 'Home to the magnificent Andromeda Galaxy (M31), the closest major spiral galaxy to our Milky Way.',
    mythology: 'The mythical princess chained to a rock as a sacrifice to the sea monster Cetus, rescued by the hero Perseus.'
  },

  // 2. Antlia
  {
    id: 'antlia',
    name: 'Antlia',
    latinName: 'Antlia',
    genitive: 'Antliae',
    abbreviation: 'Ant',
    englishName: 'The Air Pump',
    hemisphere: 'Southern',
    family: 'La Caille',
    areaSqDeg: 239,
    areaRank: 62,
    principalStarId: 'alpha-antliae',
    principalStarName: 'Alpha Antliae',
    brightestMagnitude: 4.25,
    bestViewingMonth: 'April',
    quadrant: 'SQ2',
    isZodiac: false,
    shape: {
      stars: [
        { ra: 10.4525, dec: -31.0678, name: 'Alpha Ant', isPrincipal: true, mag: 4.25 },
        { ra: 9.4874, dec: -35.9513, name: 'Epsilon Ant' },
        { ra: 10.9453, dec: -37.1378, name: 'Iota Ant' }
      ],
      lines: [
        [0, 1],
        [1, 2]
      ]
    },
    description: 'A modest southern constellation created by Nicolas-Louis de Lacaille commemorating Denis Papin’s air pump.',
    mythology: 'Honors Enlightenment scientific technology, specifically the pneumatic air pump invented for vacuum experiments.'
  },

  // 3. Apus
  {
    id: 'apus',
    name: 'Apus',
    latinName: 'Apus',
    genitive: 'Apodis',
    abbreviation: 'Aps',
    englishName: 'The Bird of Paradise',
    hemisphere: 'Southern',
    family: 'Bayer',
    areaSqDeg: 206,
    areaRank: 67,
    principalStarId: 'alpha-apodis',
    principalStarName: 'Alpha Apodis',
    brightestMagnitude: 3.83,
    bestViewingMonth: 'July',
    quadrant: 'SQ3',
    isZodiac: false,
    shape: {
      stars: [
        { ra: 14.7977, dec: -79.0448, name: 'Alpha Aps', isPrincipal: true, mag: 3.83 },
        { ra: 16.5575, dec: -78.8971, name: 'Gamma Aps' },
        { ra: 16.718, dec: -77.5174, name: 'Beta Aps' },
        { ra: 16.3391, dec: -78.6957, name: 'Delta Aps' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [1, 3]
      ]
    },
    description: 'A faint constellation near the South Celestial Pole representing the exotic Birds of Paradise of the East Indies.',
    mythology: 'Named Apus (from Greek apous, "footless") because trade specimens of birds of paradise had their feet removed in the Spice Islands.'
  },

  // 4. Aquarius
  {
    id: 'aquarius',
    name: 'Aquarius',
    latinName: 'Aquarius',
    genitive: 'Aquarii',
    abbreviation: 'Aqr',
    englishName: 'The Water Bearer',
    hemisphere: 'Equatorial',
    family: 'Zodiac',
    areaSqDeg: 980,
    areaRank: 10,
    principalStarId: 'sadalsuud',
    principalStarName: 'Sadalsuud (Beta Aquarii)',
    brightestMagnitude: 2.87,
    bestViewingMonth: 'October',
    quadrant: 'SQ4',
    isZodiac: true,
    zodiacSymbol: '♒',
    zodiacDates: 'Feb 16 – Mar 11 (Astro) / Jan 20 – Feb 18 (Trad)',
    shape: {
      stars: [
        { ra: 21.526, dec: -5.5712, name: 'Sadalsuud', isPrincipal: true, mag: 2.87 },
        { ra: 22.0964, dec: -0.3199, name: 'Sadalmelik' },
        { ra: 22.5893, dec: -0.1175, name: 'Eta Aqr' },
        { ra: 22.4805, dec: -0.0199, name: 'Zeta Aqr' },
        { ra: 22.9108, dec: -15.8208, name: 'Delta Aqr (Skat)' },
        { ra: 22.8769, dec: -7.5796, name: 'Lambda Aqr' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5]
      ]
    },
    description: 'An expansive ancient zodiac constellation symbolizing the pouring of life-giving water into the mouth of Piscis Austrinus.',
    mythology: 'Associated in Greek myth with Ganymede, the cupbearer to the Olympian gods; in Babylon, linked to the god Ea pouring waters.'
  },

  // 5. Aquila
  {
    id: 'aquila',
    name: 'Aquila',
    latinName: 'Aquila',
    genitive: 'Aquilae',
    abbreviation: 'Aql',
    englishName: 'The Eagle',
    hemisphere: 'Equatorial',
    family: 'Hercules',
    areaSqDeg: 652,
    areaRank: 22,
    principalStarId: 'altair',
    principalStarName: 'Altair (Alpha Aquilae)',
    brightestMagnitude: 0.77,
    bestViewingMonth: 'August',
    quadrant: 'NQ4',
    isZodiac: false,
    shape: {
      stars: [
        { ra: 19.8464, dec: 8.8683, name: 'Altair', isPrincipal: true, mag: 0.77 },
        { ra: 19.771, dec: 10.6133, name: 'Tarazed' },
        { ra: 19.9219, dec: 6.4068, name: 'Alshain' },
        { ra: 19.0902, dec: 13.8635, name: 'Zeta Aql' },
        { ra: 20.1884, dec: -0.8215, name: 'Theta Aql' },
        { ra: 19.1041, dec: -4.8826, name: 'Lambda Aql' }
      ],
      lines: [
        [1, 0],
        [0, 2],
        [3, 0],
        [0, 4],
        [2, 5]
      ]
    },
    description: 'Crossed by the Great Rift of the Milky Way; Altair forms a vertex of the famous Summer Triangle asterism.',
    mythology: 'The celestial eagle that carried Zeus’s thunderbolts and transported Ganymede to Mount Olympus.'
  },

  // 6. Ara
  {
    id: 'ara',
    name: 'Ara',
    latinName: 'Ara',
    genitive: 'Arae',
    abbreviation: 'Ara',
    englishName: 'The Altar',
    hemisphere: 'Southern',
    family: 'Hercules',
    areaSqDeg: 237,
    areaRank: 63,
    principalStarId: 'beta-arae',
    principalStarName: 'Beta Arae',
    brightestMagnitude: 2.85,
    bestViewingMonth: 'July',
    quadrant: 'SQ3',
    isZodiac: false,
    shape: {
      stars: [
        { ra: 17.4217, dec: -55.5299, name: 'Beta Ara', isPrincipal: true, mag: 2.85 },
        { ra: 17.5307, dec: -49.8761, name: 'Alpha Ara' },
        { ra: 17.4232, dec: -56.3777, name: 'Gamma Ara' },
        { ra: 16.977, dec: -55.9901, name: 'Zeta Ara' },
        { ra: 16.9931, dec: -53.1604, name: 'Epsilon Ara' }
      ],
      lines: [
        [0, 1],
        [0, 2],
        [1, 3],
        [2, 3],
        [2, 4]
      ]
    },
    description: 'A compact southern constellation immersed in the rich stellar streams of the Milky Way.',
    mythology: 'The sacred altar where the Olympian gods forged their alliance and swore oaths before battling the Titans.'
  },

  // 7. Aries
  {
    id: 'aries',
    name: 'Aries',
    latinName: 'Aries',
    genitive: 'Arietis',
    abbreviation: 'Ari',
    englishName: 'The Ram',
    hemisphere: 'Northern',
    family: 'Zodiac',
    areaSqDeg: 441,
    areaRank: 39,
    principalStarId: 'hamal',
    principalStarName: 'Hamal (Alpha Arietis)',
    brightestMagnitude: 2.01,
    bestViewingMonth: 'December',
    quadrant: 'NQ1',
    isZodiac: true,
    zodiacSymbol: '♈',
    zodiacDates: 'Apr 18 – May 13 (Astro) / Mar 21 – Apr 19 (Trad)',
    shape: {
      stars: [
        { ra: 2.1196, dec: 23.4624, name: 'Hamal', isPrincipal: true, mag: 2.01 },
        { ra: 1.9107, dec: 20.808, name: 'Sheratan' },
        { ra: 1.8922, dec: 19.2939, name: 'Mesarthim' },
        { ra: 2.8331, dec: 27.2605, name: '41 Arietis' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3]
      ]
    },
    description: 'A historic zodiac constellation marked by a compact crooked line of three bright stars.',
    mythology: 'The winged ram with the Golden Fleece that rescued Phrixus and Helle, later sought by Jason and the Argonauts.'
  },

  // 8. Auriga
  {
    id: 'auriga',
    name: 'Auriga',
    latinName: 'Auriga',
    genitive: 'Aurigae',
    abbreviation: 'Aur',
    englishName: 'The Charioteer',
    hemisphere: 'Northern',
    family: 'Perseus',
    areaSqDeg: 657,
    areaRank: 21,
    principalStarId: 'capella-aa',
    principalStarName: 'Capella (Alpha Aurigae)',
    brightestMagnitude: 0.08,
    bestViewingMonth: 'February',
    quadrant: 'NQ2',
    isZodiac: false,
    shape: {
      stars: [
        { ra: 5.2782, dec: 45.998, name: 'Capella', isPrincipal: true, mag: 0.08 },
        { ra: 5.9921, dec: 44.9474, name: 'Menkalinan' },
        { ra: 5.9954, dec: 37.2126, name: 'Theta Aur' },
        { ra: 5.4382, dec: 28.6075, name: 'Elnath (shared)' },
        { ra: 4.9499, dec: 33.1661, name: 'Iota Aur' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 0]
      ]
    },
    description: 'A brilliant northern pentagon of stars anchored by golden-yellow Capella, the 6th brightest star in the night sky.',
    mythology: 'Represents Erichthonius of Athens, inventor of the four-horse chariot, carrying the sacred goat Amalthea (Capella).'
  },

  // 9. Boötes
  {
    id: 'bootes',
    name: 'Boötes',
    latinName: 'Boötes',
    genitive: 'Boötis',
    abbreviation: 'Boo',
    englishName: 'The Herdsman',
    hemisphere: 'Northern',
    family: 'Ursa Major',
    areaSqDeg: 907,
    areaRank: 13,
    principalStarId: 'arcturus',
    principalStarName: 'Arcturus (Alpha Boötis)',
    brightestMagnitude: -0.05,
    bestViewingMonth: 'June',
    quadrant: 'NQ3',
    isZodiac: false,
    shape: {
      stars: [
        { ra: 14.261, dec: 19.1824, name: 'Arcturus', isPrincipal: true, mag: -0.05 },
        { ra: 14.7498, dec: 27.0742, name: 'Epsilon Boo (Izar)' },
        { ra: 13.9114, dec: 18.3977, name: 'Eta Boo (Muphrid)' },
        { ra: 15.2584, dec: 33.3148, name: 'Delta Boo' },
        { ra: 15.0324, dec: 40.3906, name: 'Beta Boo (Nekkar)' },
        { ra: 14.5346, dec: 38.3082, name: 'Gamma Boo (Seginus)' }
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
    description: 'Kite-shaped northern constellation anchored by Arcturus, found by following the arc of the Big Dipper’s handle.',
    mythology: 'The inventor of the agricultural plow who drives the Great Bear around the celestial pole.'
  },

  // 10. Caelum
  {
    id: 'caelum',
    name: 'Caelum',
    latinName: 'Caelum',
    genitive: 'Caeli',
    abbreviation: 'Cae',
    englishName: 'The Chisel',
    hemisphere: 'Southern',
    family: 'La Caille',
    areaSqDeg: 125,
    areaRank: 81,
    principalStarId: 'alpha-caeli',
    principalStarName: 'Alpha Caeli',
    brightestMagnitude: 4.45,
    bestViewingMonth: 'January',
    quadrant: 'SQ1',
    isZodiac: false,
    shape: {
      stars: [
        { ra: 4.676, dec: -41.8638, name: 'Alpha Cae', isPrincipal: true, mag: 4.45 },
        { ra: 5.0734, dec: -35.483, name: 'Gamma Cae' },
        { ra: 4.701, dec: -37.1443, name: 'Beta Cae' }
      ],
      lines: [
        [0, 1],
        [1, 2]
      ]
    },
    description: 'The eighth-smallest constellation, depicting a sculptor’s engraving chisel (Caelum Sculptoris).',
    mythology: 'Created by Lacaille to celebrate the fine carving tools of artistic engravers and sculptors.'
  },

  // 11. Camelopardalis
  {
    id: 'camelopardalis',
    name: 'Camelopardalis',
    latinName: 'Camelopardalis',
    genitive: 'Camelopardalis',
    abbreviation: 'Cam',
    englishName: 'The Giraffe',
    hemisphere: 'Northern',
    family: 'Ursa Major',
    areaSqDeg: 757,
    areaRank: 18,
    principalStarId: 'beta-camelopardalis',
    principalStarName: 'Beta Camelopardalis',
    brightestMagnitude: 4.02,
    bestViewingMonth: 'February',
    quadrant: 'NQ2',
    isZodiac: false,
    shape: {
      stars: [
        { ra: 5.057, dec: 60.4422, name: 'Beta Cam', isPrincipal: true, mag: 4.02 },
        { ra: 4.9008, dec: 66.3427, name: 'Alpha Cam' },
        { ra: 4.9548, dec: 53.7521, name: '7 Cam' },
        { ra: 3.8393, dec: 71.3323, name: 'Gamma Cam' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3]
      ]
    },
    description: 'A large but faint circumpolar constellation filling the blank region between Ursa Major and Cassiopeia.',
    mythology: 'Introduced by Petrus Plancius in 1612 representing the camel that brought Rebecca to Isaac in the Bible.'
  },

  // 12. Cancer
  {
    id: 'cancer',
    name: 'Cancer',
    latinName: 'Cancer',
    genitive: 'Cancri',
    abbreviation: 'Cnc',
    englishName: 'The Crab',
    hemisphere: 'Northern',
    family: 'Zodiac',
    areaSqDeg: 506,
    areaRank: 31,
    principalStarId: 'tarf',
    principalStarName: 'Tarf (Beta Cancri)',
    brightestMagnitude: 3.52,
    bestViewingMonth: 'March',
    quadrant: 'NQ2',
    isZodiac: true,
    zodiacSymbol: '♋',
    zodiacDates: 'Jul 21 – Aug 10 (Astro) / Jun 21 – Jul 22 (Trad)',
    shape: {
      stars: [
        { ra: 8.7447, dec: 18.1543, name: 'Praesepe / Delta Cnc' },
        { ra: 8.2753, dec: 9.1855, name: 'Beta Cnc (Tarf)', isPrincipal: true, mag: 3.52 },
        { ra: 8.7214, dec: 21.4685, name: 'Gamma Cnc' },
        { ra: 8.7783, dec: 28.7599, name: 'Iota Cnc' },
        { ra: 8.9748, dec: 11.8577, name: 'Alpha Cnc (Acubens)' }
      ],
      lines: [
        [1, 0],
        [0, 2],
        [2, 3],
        [0, 4]
      ]
    },
    description: 'The faintest zodiac constellation; famous for hosting the open star cluster Praesepe (The Beehive Cluster, M44).',
    mythology: 'The giant crab sent by Hera to distract Heracles during his battle with the multi-headed Hydra.'
  },

  // 13. Canes Venatici
  {
    id: 'canes-venatici',
    name: 'Canes Venatici',
    latinName: 'Canes Venatici',
    genitive: 'Canum Venaticorum',
    abbreviation: 'CVn',
    englishName: 'The Hunting Dogs',
    hemisphere: 'Northern',
    family: 'Ursa Major',
    areaSqDeg: 465,
    areaRank: 38,
    principalStarId: 'cor-caroli',
    principalStarName: 'Cor Caroli (Alpha-2 CVn)',
    brightestMagnitude: 2.89,
    bestViewingMonth: 'May',
    quadrant: 'NQ3',
    isZodiac: false,
    shape: {
      stars: [
        { ra: 12.9338, dec: 38.3184, name: 'Cor Caroli', isPrincipal: true, mag: 2.89 },
        { ra: 12.5624, dec: 41.3575, name: 'Chara (Beta CVn)' }
      ],
      lines: [[0, 1]]
    },
    description: 'Home to the famous Whirlpool Galaxy (M51) and anchored by the magnetic prototype star Cor Caroli.',
    mythology: 'Representing Asterion and Chara, the two hunting dogs held on a leash by Boötes as they pursue Ursa Major.'
  },

  // 14. Canis Major
  {
    id: 'canis-major',
    name: 'Canis Major',
    latinName: 'Canis Major',
    genitive: 'Canis Majoris',
    abbreviation: 'CMa',
    englishName: 'The Greater Dog',
    hemisphere: 'Southern',
    family: 'Orion',
    areaSqDeg: 380,
    areaRank: 43,
    principalStarId: 'sirius-a',
    principalStarName: 'Sirius A (The Dog Star)',
    brightestMagnitude: -1.46,
    bestViewingMonth: 'February',
    quadrant: 'SQ2',
    isZodiac: false,
    shape: {
      stars: [
        { ra: 6.7525, dec: -16.7161, name: 'Sirius', isPrincipal: true, mag: -1.46 },
        { ra: 6.3783, dec: -17.9559, name: 'Murzim' },
        { ra: 7.1399, dec: -26.3932, name: 'Wezen' },
        { ra: 6.9771, dec: -28.9721, name: 'Adhara' },
        { ra: 7.4016, dec: -29.3031, name: 'Aludra' }
      ],
      lines: [
        [1, 0],
        [0, 2],
        [2, 3],
        [2, 4]
      ]
    },
    description: 'Home to Sirius, the brightest star in Earth’s night sky, blazing with twice the visual brightness of Canopus.',
    mythology: 'The swiftest hound Laelaps, destined to always catch its quarry, placed into the heavens alongside Orion.'
  },

  // 15. Canis Minor
  {
    id: 'canis-minor',
    name: 'Canis Minor',
    latinName: 'Canis Minor',
    genitive: 'Canis Minoris',
    abbreviation: 'CMi',
    englishName: 'The Lesser Dog',
    hemisphere: 'Northern',
    family: 'Orion',
    areaSqDeg: 183,
    areaRank: 71,
    principalStarId: 'procyon-a',
    principalStarName: 'Procyon A',
    brightestMagnitude: 0.34,
    bestViewingMonth: 'March',
    quadrant: 'NQ2',
    isZodiac: false,
    shape: {
      stars: [
        { ra: 7.655, dec: 5.225, name: 'Procyon', isPrincipal: true, mag: 0.34 },
        { ra: 7.4525, dec: 8.2893, name: 'Gomeisa' }
      ],
      lines: [[0, 1]]
    },
    description: 'A compact constellation whose principal star Procyon forms the Winter Triangle with Betelgeuse and Sirius.',
    mythology: 'Orion’s smaller hunting dog, or the faithful dog Maera who led Erigone to the grave of her father Icarius.'
  },

  // 16. Capricornus
  {
    id: 'capricornus',
    name: 'Capricornus',
    latinName: 'Capricornus',
    genitive: 'Capricorni',
    abbreviation: 'Cap',
    englishName: 'The Sea-Goat',
    hemisphere: 'Southern',
    family: 'Zodiac',
    areaSqDeg: 414,
    areaRank: 40,
    principalStarId: 'deneb-algedi',
    principalStarName: 'Deneb Algedi (Delta Capricorni)',
    brightestMagnitude: 2.81,
    bestViewingMonth: 'September',
    quadrant: 'SQ4',
    isZodiac: true,
    zodiacSymbol: '♑',
    zodiacDates: 'Jan 19 – Feb 15 (Astro) / Dec 22 – Jan 19 (Trad)',
    shape: {
      stars: [
        { ra: 20.3009, dec: -12.5449, name: 'Algedi' },
        { ra: 20.3502, dec: -14.7814, name: 'Dabih' },
        { ra: 20.8637, dec: -26.9191, name: 'Omega Cap' },
        { ra: 21.4445, dec: -22.4113, name: 'Zeta Cap' },
        { ra: 21.784, dec: -16.1273, name: 'Deneb Algedi', isPrincipal: true, mag: 2.81 },
        { ra: 21.6682, dec: -16.6624, name: 'Nashira' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5],
        [5, 0]
      ]
    },
    description: 'Resembles a broad cosmic arrowhead or smile, marking the winter solstice point in antiquity.',
    mythology: 'The mythical hybrid creature with the head and torso of a goat and the tail of a fish, associated with the Greek god Pan.'
  },

  // 17. Carina
  {
    id: 'carina',
    name: 'Carina',
    latinName: 'Carina',
    genitive: 'Carinae',
    abbreviation: 'Car',
    englishName: 'The Keel',
    hemisphere: 'Southern',
    family: 'Heavenly Waters',
    areaSqDeg: 494,
    areaRank: 34,
    principalStarId: 'canopus',
    principalStarName: 'Canopus (Alpha Carinae)',
    brightestMagnitude: -0.74,
    bestViewingMonth: 'March',
    quadrant: 'SQ2',
    isZodiac: false,
    shape: {
      stars: [
        { ra: 6.3992, dec: -52.6957, name: 'Canopus', isPrincipal: true, mag: -0.74 },
        { ra: 9.22, dec: -69.7172, name: 'Miaplacidus' },
        { ra: 8.3752, dec: -59.5095, name: 'Avior' },
        { ra: 9.2848, dec: -59.2752, name: 'Aspidiske' },
        { ra: 10.7159, dec: -64.3945, name: 'Theta Car' }
      ],
      lines: [
        [0, 1],
        [1, 4],
        [4, 3],
        [3, 2],
        [2, 1]
      ]
    },
    description: 'Contains Canopus (2nd brightest star in the sky) and the extreme hypergiant Eta Carinae inside the Carina Nebula.',
    mythology: 'Originally part of the massive Ptolemaic constellation Argo Navis (the ship of Jason and the Argonauts), split by Lacaille.'
  },

  // 18. Cassiopeia
  {
    id: 'cassiopeia',
    name: 'Cassiopeia',
    latinName: 'Cassiopeia',
    genitive: 'Cassiopeiae',
    abbreviation: 'Cas',
    englishName: 'The Seated Queen',
    hemisphere: 'Northern',
    family: 'Perseus',
    areaSqDeg: 598,
    areaRank: 25,
    principalStarId: 'schedar',
    principalStarName: 'Schedar (Alpha Cassiopeiae)',
    brightestMagnitude: 2.24,
    bestViewingMonth: 'November',
    quadrant: 'NQ1',
    isZodiac: false,
    shape: {
      stars: [
        { ra: 0.153, dec: 59.1498, name: 'Caph (Beta Cas)' },
        { ra: 0.6751, dec: 56.5373, name: 'Schedar (Alpha Cas)', isPrincipal: true, mag: 2.24 },
        { ra: 0.9451, dec: 60.7167, name: 'Gamma Cas (Navi)' },
        { ra: 1.4303, dec: 60.2353, name: 'Ruchbah (Delta Cas)' },
        { ra: 1.9066, dec: 63.6701, name: 'Segin (Epsilon Cas)' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4]
      ]
    },
    description: 'Iconic circumpolar constellation forming a vivid "W" or "M" pattern opposite the Big Dipper across Polaris.',
    mythology: 'The vain queen of Ethiopia whose boastful claim that she was more beautiful than the Nereids brought divine punishment.'
  },

  // 19. Centaurus
  {
    id: 'centaurus',
    name: 'Centaurus',
    latinName: 'Centaurus',
    genitive: 'Centauri',
    abbreviation: 'Cen',
    englishName: 'The Centaur',
    hemisphere: 'Southern',
    family: 'Hercules',
    areaSqDeg: 1060,
    areaRank: 9,
    principalStarId: 'alpha-centauri-a',
    principalStarName: 'Alpha Centauri A (Rigil Kentaurus)',
    brightestMagnitude: -0.01,
    bestViewingMonth: 'May',
    quadrant: 'SQ3',
    isZodiac: false,
    shape: {
      stars: [
        { ra: 14.6601, dec: -60.834, name: 'Alpha Cen', isPrincipal: true, mag: -0.01 },
        { ra: 14.0637, dec: -60.373, name: 'Hadar (Beta Cen)' },
        { ra: 12.692, dec: -48.9599, name: 'Gamma Cen' },
        { ra: 12.1393, dec: -50.7224, name: 'Delta Cen' },
        { ra: 14.1114, dec: -36.37, name: 'Theta Cen (Menkent)' },
        { ra: 13.6648, dec: -53.4664, name: 'Epsilon Cen' },
        { ra: 13.9257, dec: -47.2884, name: 'Zeta Cen' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [2, 5],
        [2, 6]
      ]
    },
    description: 'Spectacular southern constellation containing our Sun’s closest stellar neighbors and Omega Centauri (NGC 5139).',
    mythology: 'Represents Chiron, the wise and civilized centaur who tutored Hercules, Achilles, and Asclepius.'
  },

  // 20. Cepheus
  {
    id: 'cepheus',
    name: 'Cepheus',
    latinName: 'Cepheus',
    genitive: 'Cephei',
    abbreviation: 'Cep',
    englishName: 'The King',
    hemisphere: 'Northern',
    family: 'Perseus',
    areaSqDeg: 588,
    areaRank: 27,
    principalStarId: 'alderamin',
    principalStarName: 'Alderamin (Alpha Cephei)',
    brightestMagnitude: 2.45,
    bestViewingMonth: 'October',
    quadrant: 'NQ4',
    isZodiac: false,
    shape: {
      stars: [
        { ra: 23.6558, dec: 77.6324, name: 'Gamma Cep (Errai)' },
        { ra: 21.4777, dec: 70.5607, name: 'Beta Cep (Alfirk)' },
        { ra: 22.828, dec: 66.2004, name: 'Iota Cep' },
        { ra: 21.3097, dec: 62.5856, name: 'Alderamin', isPrincipal: true, mag: 2.45 },
        { ra: 22.1809, dec: 58.2013, name: 'Zeta Cep' },
        { ra: 22.4862, dec: 58.4152, name: 'Delta Cep (prototype)' }
      ],
      lines: [
        [0, 1],
        [0, 2],
        [1, 3],
        [2, 4],
        [3, 4],
        [4, 5]
      ]
    },
    description: 'Resembles a child’s drawing of a house; home to Delta Cephei (prototype of Cepheid variables) and hypergiant Mu Cephei.',
    mythology: 'King of Ethiopia, husband of Cassiopeia and father of Andromeda in Greek mythology.'
  },

  // 21. Cetus
  {
    id: 'cetus',
    name: 'Cetus',
    latinName: 'Cetus',
    genitive: 'Ceti',
    abbreviation: 'Cet',
    englishName: 'The Sea Monster / Whale',
    hemisphere: 'Equatorial',
    family: 'Heavenly Waters',
    areaSqDeg: 1231,
    areaRank: 4,
    principalStarId: 'diphda',
    principalStarName: 'Diphda (Deneb Kaitos)',
    brightestMagnitude: 2.04,
    bestViewingMonth: 'November',
    quadrant: 'SQ1',
    isZodiac: false,
    shape: {
      stars: [
        { ra: 0.7265, dec: -17.9866, name: 'Diphda', isPrincipal: true, mag: 2.04 },
        { ra: 1.1432, dec: -10.1823, name: 'Eta Cet' },
        { ra: 1.4004, dec: -8.1833, name: 'Theta Cet' },
        { ra: 2.3224, dec: -2.9776, name: 'Mira (pulsating)' },
        { ra: 3.038, dec: 4.0897, name: 'Menkar (Alpha Cet)' },
        { ra: 2.7217, dec: 3.2358, name: 'Gamma Cet' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5],
        [5, 3]
      ]
    },
    description: 'The 4th largest constellation; home to Mira (Omicron Ceti), the prototype pulsating red giant variable star.',
    mythology: 'The monstrous sea beast sent by Poseidon to devour princess Andromeda, slain by Perseus.'
  },

  // 22. Chamaeleon
  {
    id: 'chamaeleon',
    name: 'Chamaeleon',
    latinName: 'Chamaeleon',
    genitive: 'Chamaeleontis',
    abbreviation: 'Cha',
    englishName: 'The Chameleon',
    hemisphere: 'Southern',
    family: 'Bayer',
    areaSqDeg: 132,
    areaRank: 79,
    principalStarId: 'alpha-chamaeleontis',
    principalStarName: 'Alpha Chamaeleontis',
    brightestMagnitude: 4.07,
    bestViewingMonth: 'April',
    quadrant: 'SQ2',
    isZodiac: false,
    shape: {
      stars: [
        { ra: 8.3088, dec: -76.9197, name: 'Alpha Cha', isPrincipal: true, mag: 4.07 },
        { ra: 10.5911, dec: -78.6078, name: 'Gamma Cha' },
        { ra: 12.3058, dec: -79.3122, name: 'Beta Cha' },
        { ra: 10.7545, dec: -80.4696, name: 'Delta Cha' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0]
      ]
    },
    description: 'A faint southern circumpolar diamond-shaped group; contains the Chamaeleon star-forming dark molecular clouds.',
    mythology: 'Created by Dutch navigators Keyser and de Houtman in 1597 representing the color-changing chameleon lizard.'
  },

  // 23. Circinus
  {
    id: 'circinus',
    name: 'Circinus',
    latinName: 'Circinus',
    genitive: 'Circini',
    abbreviation: 'Cir',
    englishName: 'The Compasses',
    hemisphere: 'Southern',
    family: 'La Caille',
    areaSqDeg: 93,
    areaRank: 85,
    principalStarId: 'alpha-circini',
    principalStarName: 'Alpha Circini',
    brightestMagnitude: 3.19,
    bestViewingMonth: 'July',
    quadrant: 'SQ3',
    isZodiac: false,
    shape: {
      stars: [
        { ra: 14.7085, dec: -64.9751, name: 'Alpha Cir', isPrincipal: true, mag: 3.19 },
        { ra: 15.2919, dec: -58.8012, name: 'Beta Cir' },
        { ra: 15.3896, dec: -59.3208, name: 'Gamma Cir' }
      ],
      lines: [
        [0, 1],
        [0, 2]
      ]
    },
    description: 'The fourth-smallest constellation; forms a narrow drafting compass situated right beside Alpha Centauri.',
    mythology: 'Introduced by Lacaille to celebrate the drafting divider used by architects and nautical cartographers.'
  },

  // 24. Columba
  {
    id: 'columba',
    name: 'Columba',
    latinName: 'Columba',
    genitive: 'Columbae',
    abbreviation: 'Col',
    englishName: 'The Dove',
    hemisphere: 'Southern',
    family: 'Heavenly Waters',
    areaSqDeg: 270,
    areaRank: 54,
    principalStarId: 'phact',
    principalStarName: 'Phact (Alpha Columbae)',
    brightestMagnitude: 2.65,
    bestViewingMonth: 'February',
    quadrant: 'SQ1',
    isZodiac: false,
    shape: {
      stars: [
        { ra: 5.6608, dec: -34.0741, name: 'Phact', isPrincipal: true, mag: 2.65 },
        { ra: 5.8493, dec: -35.7683, name: 'Wazn (Beta Col)' },
        { ra: 5.5202, dec: -35.4705, name: 'Epsilon Col' },
        { ra: 5.9589, dec: -35.2833, name: 'Gamma Col' }
      ],
      lines: [
        [0, 1],
        [0, 2],
        [1, 3]
      ]
    },
    description: 'Located directly south of Canis Major and Lepus; contains runaway star Mu Columbae escaping the Orion Nebula.',
    mythology: 'Represents the dove released from Noah’s Ark, or the dove sent ahead by the Argonauts through the Clashing Rocks.'
  },

  // 25. Coma Berenices
  {
    id: 'coma-berenices',
    name: 'Coma Berenices',
    latinName: 'Coma Berenices',
    genitive: 'Comae Berenices',
    abbreviation: 'Com',
    englishName: 'Berenice’s Hair',
    hemisphere: 'Northern',
    family: 'Ursa Major',
    areaSqDeg: 386,
    areaRank: 42,
    principalStarId: 'beta-comae-berenices',
    principalStarName: 'Beta Comae Berenices',
    brightestMagnitude: 4.26,
    bestViewingMonth: 'May',
    quadrant: 'NQ3',
    isZodiac: false,
    shape: {
      stars: [
        { ra: 13.1979, dec: 27.8782, name: 'Beta Com', isPrincipal: true, mag: 4.26 },
        { ra: 13.1665, dec: 17.5295, name: 'Alpha Com (Diadem)' },
        { ra: 12.449, dec: 28.2684, name: 'Gamma Com' }
      ],
      lines: [
        [2, 0],
        [0, 1]
      ]
    },
    description: 'Marks the North Galactic Pole and hosts the massive Coma Galaxy Cluster (Abell 1656) with thousands of galaxies.',
    mythology: 'The only constellation named after an actual historical person: Queen Berenice II of Egypt who cut her hair as a vow.'
  },

  // 26. Corona Australis
  {
    id: 'corona-australis',
    name: 'Corona Australis',
    latinName: 'Corona Australis',
    genitive: 'Coronae Australis',
    abbreviation: 'CrA',
    englishName: 'The Southern Crown',
    hemisphere: 'Southern',
    family: 'Hercules',
    areaSqDeg: 128,
    areaRank: 80,
    principalStarId: 'meridiana',
    principalStarName: 'Meridiana (Alpha CrA)',
    brightestMagnitude: 4.10,
    bestViewingMonth: 'August',
    quadrant: 'SQ4',
    isZodiac: false,
    shape: {
      stars: [
        { ra: 19.1579, dec: -37.9045, name: 'Meridiana', isPrincipal: true, mag: 4.10 },
        { ra: 19.1672, dec: -39.3408, name: 'Beta CrA' },
        { ra: 19.107, dec: -37.0634, name: 'Gamma CrA' },
        { ra: 19.1392, dec: -40.4967, name: 'Delta CrA' },
        { ra: 18.9787, dec: -37.1073, name: 'Epsilon CrA' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4]
      ]
    },
    description: 'An elegant horseshoe-shaped arc of stars situated right south of Sagittarius and Scorpius.',
    mythology: 'The golden crown placed in the heavens by the god Dionysus to honor his mother Semele.'
  },

  // 27. Corona Borealis
  {
    id: 'corona-borealis',
    name: 'Corona Borealis',
    latinName: 'Corona Borealis',
    genitive: 'Coronae Borealis',
    abbreviation: 'CrB',
    englishName: 'The Northern Crown',
    hemisphere: 'Northern',
    family: 'Ursa Major',
    areaSqDeg: 179,
    areaRank: 73,
    principalStarId: 'alphecca',
    principalStarName: 'Alphecca (Alpha CrB)',
    brightestMagnitude: 2.21,
    bestViewingMonth: 'July',
    quadrant: 'NQ3',
    isZodiac: false,
    shape: {
      stars: [
        { ra: 15.5488, dec: 31.3591, name: 'Theta CrB' },
        { ra: 15.4638, dec: 29.1057, name: 'Beta CrB' },
        { ra: 15.5781, dec: 26.7147, name: 'Alphecca', isPrincipal: true, mag: 2.21 },
        { ra: 15.7124, dec: 26.2956, name: 'Gamma CrB' },
        { ra: 15.8266, dec: 26.0684, name: 'Delta CrB' },
        { ra: 15.9598, dec: 26.8779, name: 'Epsilon CrB' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5]
      ]
    },
    description: 'A distinctive celestial tiara nestled between Boötes and Hercules, featuring recurring nova T Coronae Borealis.',
    mythology: 'The jeweled crown given by Dionysus to Ariadne after she was abandoned by Theseus on the island of Naxos.'
  },

  // 28. Corvus
  {
    id: 'corvus',
    name: 'Corvus',
    latinName: 'Corvus',
    genitive: 'Corvi',
    abbreviation: 'Crv',
    englishName: 'The Crow',
    hemisphere: 'Southern',
    family: 'Hercules',
    areaSqDeg: 184,
    areaRank: 70,
    principalStarId: 'gienah-corvi',
    principalStarName: 'Gienah (Gamma Corvi)',
    brightestMagnitude: 2.58,
    bestViewingMonth: 'May',
    quadrant: 'SQ3',
    isZodiac: false,
    shape: {
      stars: [
        { ra: 12.2634, dec: -17.5419, name: 'Gienah', isPrincipal: true, mag: 2.58 },
        { ra: 12.4977, dec: -16.5154, name: 'Algorab (Delta Crv)' },
        { ra: 12.5731, dec: -23.3968, name: 'Kraz (Beta Crv)' },
        { ra: 12.1687, dec: -22.6198, name: 'Minkar (Epsilon Crv)' },
        { ra: 12.1402, dec: -24.7289, name: 'Alchiba (Alpha Crv)' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
        [0, 4]
      ]
    },
    description: 'A compact quadrilateral asterism known as "The Spinnaker Sail", perched upon the coils of Hydra.',
    mythology: 'The sacred raven of Apollo sent to fetch water; lingered eating figs and returned with a water snake as an excuse.'
  },

  // 29. Crater
  {
    id: 'crater',
    name: 'Crater',
    latinName: 'Crater',
    genitive: 'Crateris',
    abbreviation: 'Crt',
    englishName: 'The Cup',
    hemisphere: 'Southern',
    family: 'Hercules',
    areaSqDeg: 282,
    areaRank: 53,
    principalStarId: 'labrum',
    principalStarName: 'Labrum (Delta Crateris)',
    brightestMagnitude: 3.56,
    bestViewingMonth: 'April',
    quadrant: 'SQ2',
    isZodiac: false,
    shape: {
      stars: [
        { ra: 11.3223, dec: -14.7785, name: 'Delta Crt (Labrum)', isPrincipal: true, mag: 3.56 },
        { ra: 11.4147, dec: -17.684, name: 'Gamma Crt' },
        { ra: 10.9962, dec: -18.2988, name: 'Alpha Crt (Alkes)' },
        { ra: 11.1943, dec: -22.8258, name: 'Beta Crt' },
        { ra: 11.746, dec: -18.3507, name: 'Zeta Crt' }
      ],
      lines: [
        [0, 1],
        [0, 2],
        [1, 2],
        [2, 3],
        [2, 4],
        [3, 4]
      ]
    },
    description: 'Faint chalice-shaped grouping resting on the back of Hydra alongside Corvus.',
    mythology: 'The golden goblet used by Apollo to drink ambrosia, placed alongside the raven and water snake.'
  },

  // 30. Crux
  {
    id: 'crux',
    name: 'Crux',
    latinName: 'Crux',
    genitive: 'Crucis',
    abbreviation: 'Cru',
    englishName: 'The Southern Cross',
    hemisphere: 'Southern',
    family: 'Heavenly Waters',
    areaSqDeg: 68,
    areaRank: 88,
    principalStarId: 'acrux-a',
    principalStarName: 'Acrux (Alpha Crucis)',
    brightestMagnitude: 0.77,
    bestViewingMonth: 'May',
    quadrant: 'SQ3',
    isZodiac: false,
    shape: {
      stars: [
        { ra: 12.4433, dec: -63.0991, name: 'Acrux', isPrincipal: true, mag: 0.77 },
        { ra: 12.5194, dec: -57.1132, name: 'Gacrux (Gamma Cru)' },
        { ra: 12.7954, dec: -59.6888, name: 'Mimosa (Beta Cru)' },
        { ra: 12.2524, dec: -58.7489, name: 'Imai (Delta Cru)' },
        { ra: 12.356, dec: -60.4011, name: 'Ginan (Epsilon Cru)' }
      ],
      lines: [
        [0, 1],
        [2, 3]
      ]
    },
    description: 'The smallest constellation of all 88, yet the most famous in the Southern Hemisphere; featured on 5 national flags.',
    mythology: 'Known to ancient Greeks as part of Centaurus; adopted by European navigators as a sacred navigational symbol.'
  },

  // 31. Cygnus
  {
    id: 'cygnus',
    name: 'Cygnus',
    latinName: 'Cygnus',
    genitive: 'Cygni',
    abbreviation: 'Cyg',
    englishName: 'The Swan',
    hemisphere: 'Northern',
    family: 'Hercules',
    areaSqDeg: 804,
    areaRank: 16,
    principalStarId: 'deneb',
    principalStarName: 'Deneb (Alpha Cygni)',
    brightestMagnitude: 1.25,
    bestViewingMonth: 'September',
    quadrant: 'NQ4',
    isZodiac: false,
    shape: {
      stars: [
        { ra: 20.6905, dec: 45.2803, name: 'Deneb', isPrincipal: true, mag: 1.25 },
        { ra: 20.3705, dec: 40.2567, name: 'Sadr (Gamma Cyg)' },
        { ra: 19.512, dec: 27.9597, name: 'Albireo (Beta Cyg)' },
        { ra: 19.7496, dec: 45.1308, name: 'Delta Cyg' },
        { ra: 20.7702, dec: 33.9703, name: 'Gienah (Epsilon Cyg)' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [3, 1],
        [1, 4]
      ]
    },
    description: 'The Northern Cross, flying down the Milky Way; Deneb is a white supergiant 200,000 times brighter than the Sun.',
    mythology: 'Zeus disguised as a swan to seduce Leda, or Orpheus transformed into a swan placed near his harp (Lyra).'
  },

  // 32. Delphinus
  {
    id: 'delphinus',
    name: 'Delphinus',
    latinName: 'Delphinus',
    genitive: 'Delphini',
    abbreviation: 'Del',
    englishName: 'The Dolphin',
    hemisphere: 'Northern',
    family: 'Heavenly Waters',
    areaSqDeg: 189,
    areaRank: 69,
    principalStarId: 'rotanev',
    principalStarName: 'Rotanev (Beta Delphini)',
    brightestMagnitude: 3.63,
    bestViewingMonth: 'September',
    quadrant: 'NQ4',
    isZodiac: false,
    shape: {
      stars: [
        { ra: 20.6258, dec: 14.5951, name: 'Rotanev', isPrincipal: true, mag: 3.63 },
        { ra: 20.6606, dec: 15.9122, name: 'Sualocin (Alpha Del)' },
        { ra: 20.7776, dec: 16.1243, name: 'Gamma Del' },
        { ra: 20.7243, dec: 15.0746, name: 'Delta Del' },
        { ra: 20.5535, dec: 11.3033, name: 'Epsilon Del (Deneb Dulfim)' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
        [3, 4]
      ]
    },
    description: 'A charming diamond asterism called Job’s Coffin with a trailing tail, leaping out of the celestial equator.',
    mythology: 'The dolphin that persuaded Amphitrite to marry Poseidon, and the dolphin that saved the Greek poet-musician Arion.'
  },

  // 33. Dorado
  {
    id: 'dorado',
    name: 'Dorado',
    latinName: 'Dorado',
    genitive: 'Doradus',
    abbreviation: 'Dor',
    englishName: 'The Dolphinfish / Swordfish',
    hemisphere: 'Southern',
    family: 'Bayer',
    areaSqDeg: 179,
    areaRank: 72,
    principalStarId: 'alpha-doradus',
    principalStarName: 'Alpha Doradus',
    brightestMagnitude: 3.27,
    bestViewingMonth: 'January',
    quadrant: 'SQ1',
    isZodiac: false,
    shape: {
      stars: [
        { ra: 4.5666, dec: -55.045, name: 'Alpha Dor', isPrincipal: true, mag: 3.27 },
        { ra: 5.5604, dec: -62.4898, name: 'Beta Dor' },
        { ra: 4.2671, dec: -51.4866, name: 'Gamma Dor' },
        { ra: 5.7462, dec: -65.7355, name: 'Delta Dor' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3]
      ]
    },
    description: 'Contains the majority of the Large Magellanic Cloud (LMC), our satellite galaxy hosting the Tarantula Nebula and R136a1.',
    mythology: 'Depicts the iridescent mahimahi dolphinfish (Coryphaena hippurus), recorded by Dutch navigators in 1598.'
  },

  // 34. Draco
  {
    id: 'draco',
    name: 'Draco',
    latinName: 'Draco',
    genitive: 'Draconis',
    abbreviation: 'Dra',
    englishName: 'The Dragon',
    hemisphere: 'Northern',
    family: 'Ursa Major',
    areaSqDeg: 1083,
    areaRank: 8,
    principalStarId: 'eltanin',
    principalStarName: 'Eltanin (Gamma Draconis)',
    brightestMagnitude: 2.23,
    bestViewingMonth: 'July',
    quadrant: 'NQ3',
    isZodiac: false,
    shape: {
      stars: [
        { ra: 17.9434, dec: 51.4889, name: 'Eltanin', isPrincipal: true, mag: 2.23 },
        { ra: 17.5072, dec: 52.3014, name: 'Rastaban (Beta Dra)' },
        { ra: 17.5369, dec: 55.1783, name: 'Nu Dra' },
        { ra: 17.8921, dec: 56.8726, name: 'Xi Dra' },
        { ra: 19.2093, dec: 67.6615, name: 'Delta Dra' },
        { ra: 14.0732, dec: 64.3759, name: 'Thuban (ancient North Star)' },
        { ra: 15.4155, dec: 58.9661, name: 'Edasich (Iota Dra)' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
        [2, 4],
        [4, 5],
        [5, 6]
      ]
    },
    description: 'Winding dragon coiling between the Big and Little Dippers; its star Thuban was Egypt’s North Star during the Pyramids.',
    mythology: 'Ladon, the hundred-headed dragon guarding the golden apples in the Garden of the Hesperides, slain by Hercules.'
  },

  // 35. Equuleus
  {
    id: 'equuleus',
    name: 'Equuleus',
    latinName: 'Equuleus',
    genitive: 'Equulei',
    abbreviation: 'Equ',
    englishName: 'The Little Horse',
    hemisphere: 'Northern',
    family: 'Heavenly Waters',
    areaSqDeg: 72,
    areaRank: 87,
    principalStarId: 'kitalpha',
    principalStarName: 'Kitalpha (Alpha Equulei)',
    brightestMagnitude: 3.92,
    bestViewingMonth: 'September',
    quadrant: 'NQ4',
    isZodiac: false,
    shape: {
      stars: [
        { ra: 21.2637, dec: 5.2479, name: 'Kitalpha', isPrincipal: true, mag: 3.92 },
        { ra: 21.2413, dec: 10.007, name: 'Delta Equ' },
        { ra: 21.1724, dec: 10.1316, name: 'Gamma Equ' },
        { ra: 21.3816, dec: 6.8111, name: 'Beta Equ' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0]
      ]
    },
    description: 'The second-smallest constellation in the sky, rising just before Pegasus like a foal preceding its mother.',
    mythology: 'Celeris, the foal presented by Hermes to Castor, or Hippe, daughter of Chiron who transformed into a horse.'
  },

  // 36. Eridanus
  {
    id: 'eridanus',
    name: 'Eridanus',
    latinName: 'Eridanus',
    genitive: 'Eridani',
    abbreviation: 'Eri',
    englishName: 'The River',
    hemisphere: 'Southern',
    family: 'Heavenly Waters',
    areaSqDeg: 1138,
    areaRank: 6,
    principalStarId: 'achernar',
    principalStarName: 'Achernar (Alpha Eridani)',
    brightestMagnitude: 0.45,
    bestViewingMonth: 'December',
    quadrant: 'SQ1',
    isZodiac: false,
    shape: {
      stars: [
        { ra: 5.1308, dec: -5.0865, name: 'Cursa (Beta Eri)' },
        { ra: 3.9672, dec: -13.5085, name: 'Zaurak' },
        { ra: 2.971, dec: -40.3047, name: 'Acamar (Theta Eri)' },
        { ra: 3.5488, dec: -9.4583, name: 'Epsilon Eri (planet host)' },
        { ra: 1.6286, dec: -57.2368, name: 'Achernar', isPrincipal: true, mag: 0.45 }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4]
      ]
    },
    description: 'The 6th largest constellation; Achernar ("The River’s End") is the flattest known star due to its rapid rotation.',
    mythology: 'The celestial river into which Phaethon crashed when he lost control of his father Apollo’s sun chariot.'
  },

  // 37. Fornax
  {
    id: 'fornax',
    name: 'Fornax',
    latinName: 'Fornax',
    genitive: 'Fornacis',
    abbreviation: 'For',
    englishName: 'The Chemical Furnace',
    hemisphere: 'Southern',
    family: 'La Caille',
    areaSqDeg: 398,
    areaRank: 41,
    principalStarId: 'dalim',
    principalStarName: 'Dalim (Alpha Fornacis)',
    brightestMagnitude: 3.85,
    bestViewingMonth: 'December',
    quadrant: 'SQ1',
    isZodiac: false,
    shape: {
      stars: [
        { ra: 3.2013, dec: -28.9876, name: 'Alpha For (Dalim)', isPrincipal: true, mag: 3.85 },
        { ra: 2.8182, dec: -32.4059, name: 'Beta For' },
        { ra: 2.0748, dec: -29.2968, name: 'Nu For' }
      ],
      lines: [
        [0, 1],
        [1, 2]
      ]
    },
    description: 'Home to the Hubble Ultra-Deep Field, looking back over 13 billion years into early cosmic time.',
    mythology: 'Created by Lacaille to honor the chemical furnace (Fornax Chimiae) used by chemist Antoine Lavoisier.'
  },

  // 38. Gemini
  {
    id: 'gemini',
    name: 'Gemini',
    latinName: 'Gemini',
    genitive: 'Geminorum',
    abbreviation: 'Gem',
    englishName: 'The Twins',
    hemisphere: 'Northern',
    family: 'Zodiac',
    areaSqDeg: 514,
    areaRank: 30,
    principalStarId: 'pollux',
    principalStarName: 'Pollux (Beta Geminorum)',
    brightestMagnitude: 1.14,
    bestViewingMonth: 'February',
    quadrant: 'NQ2',
    isZodiac: true,
    zodiacSymbol: '♊',
    zodiacDates: 'Jun 22 – Jul 20 (Astro) / May 21 – Jun 20 (Trad)',
    shape: {
      stars: [
        { ra: 7.5766, dec: 31.8883, name: 'Castor (Alpha Gem)' },
        { ra: 7.7553, dec: 28.0262, name: 'Pollux (Beta Gem)', isPrincipal: true, mag: 1.14 },
        { ra: 6.7322, dec: 25.1311, name: 'Mebsuta' },
        { ra: 7.3354, dec: 21.9823, name: 'Wasat' },
        { ra: 6.3827, dec: 22.5136, name: 'Tejat (Mu Gem)' },
        { ra: 6.6285, dec: 16.3993, name: 'Alhena (Gamma Gem)' }
      ],
      lines: [
        [0, 1],
        [0, 2],
        [1, 3],
        [2, 4],
        [3, 5]
      ]
    },
    description: 'Prominent winter zodiac constellation anchored by the famous twin stars Castor (a 6-star system) and Pollux.',
    mythology: 'Castor and Pollux (the Dioscuri), twin sons of Leda who sailed with the Argonauts and protect sailors.'
  },

  // 39. Grus
  {
    id: 'grus',
    name: 'Grus',
    latinName: 'Grus',
    genitive: 'Gruis',
    abbreviation: 'Gru',
    englishName: 'The Crane',
    hemisphere: 'Southern',
    family: 'Bayer',
    areaSqDeg: 366,
    areaRank: 45,
    principalStarId: 'alnair',
    principalStarName: 'Alnair (Alpha Gruis)',
    brightestMagnitude: 1.74,
    bestViewingMonth: 'October',
    quadrant: 'SQ4',
    isZodiac: false,
    shape: {
      stars: [
        { ra: 22.1372, dec: -46.961, name: 'Alnair', isPrincipal: true, mag: 1.74 },
        { ra: 22.7111, dec: -46.8846, name: 'Beta Gru (Tiaki)' },
        { ra: 21.8988, dec: -37.3649, name: 'Gamma Gru (Al Dhanab)' },
        { ra: 22.4878, dec: -43.4956, name: 'Delta Gru' },
        { ra: 22.8092, dec: -51.3169, name: 'Epsilon Gru' }
      ],
      lines: [
        [1, 0],
        [1, 2],
        [1, 3],
        [3, 4]
      ]
    },
    description: 'One of the four "Southern Birds"; a graceful long-legged constellation flying south of Piscis Austrinus.',
    mythology: 'First depicted in Petrus Plancius’s celestial globes in 1598, portraying the sacred crane symbolizing vigilance.'
  },

  // 40. Hercules
  {
    id: 'hercules',
    name: 'Hercules',
    latinName: 'Hercules',
    genitive: 'Herculis',
    abbreviation: 'Her',
    englishName: 'The Strongman',
    hemisphere: 'Northern',
    family: 'Hercules',
    areaSqDeg: 1225,
    areaRank: 5,
    principalStarId: 'kornephoros',
    principalStarName: 'Kornephoros (Beta Herculis)',
    brightestMagnitude: 2.77,
    bestViewingMonth: 'July',
    quadrant: 'NQ3',
    isZodiac: false,
    shape: {
      stars: [
        { ra: 17.2508, dec: 36.8092, name: 'Pi Her' },
        { ra: 16.7149, dec: 38.9223, name: 'Eta Her' },
        { ra: 16.6881, dec: 31.6027, name: 'Zeta Her' },
        { ra: 17.0048, dec: 30.9264, name: 'Epsilon Her' },
        { ra: 16.5037, dec: 21.4896, name: 'Kornephoros', isPrincipal: true, mag: 2.77 },
        { ra: 17.2441, dec: 14.3903, name: 'Rasalgethi (Alpha Her)' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
        [2, 4],
        [1, 5]
      ]
    },
    description: 'The 5th largest constellation; the central "Keystone" asterism hosts the Great Globular Cluster in Hercules (M13).',
    mythology: 'The divine Greek hero Heracles who completed the Twelve Labors to atone for sins and gain immortality.'
  },

  // 41. Horologium
  {
    id: 'horologium',
    name: 'Horologium',
    latinName: 'Horologium',
    genitive: 'Horologii',
    abbreviation: 'Hor',
    englishName: 'The Pendulum Clock',
    hemisphere: 'Southern',
    family: 'La Caille',
    areaSqDeg: 249,
    areaRank: 58,
    principalStarId: 'alpha-horologii',
    principalStarName: 'Alpha Horologii',
    brightestMagnitude: 3.85,
    bestViewingMonth: 'December',
    quadrant: 'SQ1',
    isZodiac: false,
    shape: {
      stars: [
        { ra: 4.2334, dec: -42.2944, name: 'Alpha Hor', isPrincipal: true, mag: 3.85 },
        { ra: 4.1807, dec: -41.9936, name: 'Delta Hor' },
        { ra: 2.9799, dec: -64.0713, name: 'Beta Hor' },
        { ra: 2.6777, dec: -54.5499, name: 'Zeta Hor' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3]
      ]
    },
    description: 'Created by Lacaille (Horologium Oscillatorium) to honor Christiaan Huygens’s invention of the pendulum clock.',
    mythology: 'Celebrates Enlightenment chronometry, which revolutionized navigation and precision timekeeping.'
  },

  // 42. Hydra
  {
    id: 'hydra',
    name: 'Hydra',
    latinName: 'Hydra',
    genitive: 'Hydrae',
    abbreviation: 'Hya',
    englishName: 'The Female Water Snake',
    hemisphere: 'Southern',
    family: 'Hercules',
    areaSqDeg: 1303,
    areaRank: 1,
    principalStarId: 'alphard',
    principalStarName: 'Alphard (Alpha Hydrae)',
    brightestMagnitude: 1.98,
    bestViewingMonth: 'April',
    quadrant: 'SQ2',
    isZodiac: false,
    shape: {
      stars: [
        { ra: 8.9232, dec: 5.9456, name: 'Head of Hydra' },
        { ra: 9.4598, dec: -8.6586, name: 'Alphard', isPrincipal: true, mag: 1.98 },
        { ra: 8.9232, dec: 5.9456, name: 'Zeta Hya' },
        { ra: 10.8271, dec: -16.1936, name: 'Nu Hya' },
        { ra: 13.3154, dec: -23.1715, name: 'Gamma Hya' },
        { ra: 14.1062, dec: -26.6824, name: 'Pi Hya' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5]
      ]
    },
    description: 'The largest constellation in the entire night sky, slithering over 100 degrees across more than a quarter of the celestial sphere.',
    mythology: 'The Lernaean Hydra with venomous breath and regenerating heads, defeated by Heracles in his Second Labor.'
  },

  // 43. Hydrus
  {
    id: 'hydrus',
    name: 'Hydrus',
    latinName: 'Hydrus',
    genitive: 'Hydri',
    abbreviation: 'Hyi',
    englishName: 'The Male Water Snake',
    hemisphere: 'Southern',
    family: 'Bayer',
    areaSqDeg: 243,
    areaRank: 61,
    principalStarId: 'beta-hydri',
    principalStarName: 'Beta Hydri',
    brightestMagnitude: 2.80,
    bestViewingMonth: 'November',
    quadrant: 'SQ1',
    isZodiac: false,
    shape: {
      stars: [
        { ra: 1.9795, dec: -61.5698, name: 'Alpha Hyi' },
        { ra: 3.7873, dec: -74.239, name: 'Gamma Hyi' },
        { ra: 0.4292, dec: -77.2542, name: 'Beta Hyi', isPrincipal: true, mag: 2.80 }
      ],
      lines: [
        [0, 1],
        [1, 2]
      ]
    },
    description: 'A far southern water snake near the South Celestial Pole; Beta Hydri is a solar twin showing the Sun’s distant future.',
    mythology: 'Created by Dutch navigators Keyser and de Houtman in 1597, representing sea snakes encountered in tropical waters.'
  },

  // 44. Indus
  {
    id: 'indus',
    name: 'Indus',
    latinName: 'Indus',
    genitive: 'Indi',
    abbreviation: 'Ind',
    englishName: 'The Indian',
    hemisphere: 'Southern',
    family: 'Bayer',
    areaSqDeg: 294,
    areaRank: 49,
    principalStarId: 'alpha-indi',
    principalStarName: 'The Persian (Alpha Indi)',
    brightestMagnitude: 3.11,
    bestViewingMonth: 'September',
    quadrant: 'SQ4',
    isZodiac: false,
    shape: {
      stars: [
        { ra: 20.6261, dec: -47.2915, name: 'Alpha Ind (The Persian)', isPrincipal: true, mag: 3.11 },
        { ra: 20.9135, dec: -58.4541, name: 'Beta Ind' },
        { ra: 21.3311, dec: -53.4494, name: 'Theta Ind' }
      ],
      lines: [
        [0, 1],
        [1, 2]
      ]
    },
    description: 'Southern constellation; home to Epsilon Indi, a nearby K-dwarf system orbited by a binary brown dwarf pair.',
    mythology: 'Introduced by Plancius in 1598 representing an indigenous inhabitant of Asia or the Americas holding arrows.'
  }
];
