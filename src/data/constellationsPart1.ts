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
        { x: 30, y: 80, name: 'Alpheratz', isPrincipal: true, mag: 2.06 },
        { x: 45, y: 60, name: 'Delta And' },
        { x: 60, y: 40, name: 'Mirach' },
        { x: 80, y: 25, name: 'Almach' },
        { x: 65, y: 70, name: 'Mu And' },
        { x: 50, y: 30, name: 'Pi And' }
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
        { x: 50, y: 25, name: 'Alpha Ant', isPrincipal: true, mag: 4.25 },
        { x: 40, y: 60, name: 'Epsilon Ant' },
        { x: 65, y: 75, name: 'Iota Ant' }
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
        { x: 75, y: 30, name: 'Alpha Aps', isPrincipal: true, mag: 3.83 },
        { x: 50, y: 55, name: 'Gamma Aps' },
        { x: 30, y: 70, name: 'Beta Aps' },
        { x: 55, y: 80, name: 'Delta Aps' }
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
        { x: 30, y: 30, name: 'Sadalsuud', isPrincipal: true, mag: 2.87 },
        { x: 45, y: 32, name: 'Sadalmelik' },
        { x: 60, y: 35, name: 'Eta Aqr' },
        { x: 70, y: 40, name: 'Zeta Aqr' },
        { x: 65, y: 65, name: 'Delta Aqr (Skat)' },
        { x: 40, y: 75, name: 'Lambda Aqr' }
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
        { x: 50, y: 45, name: 'Altair', isPrincipal: true, mag: 0.77 },
        { x: 45, y: 35, name: 'Tarazed' },
        { x: 55, y: 55, name: 'Alshain' },
        { x: 25, y: 35, name: 'Zeta Aql' },
        { x: 75, y: 65, name: 'Theta Aql' },
        { x: 50, y: 80, name: 'Lambda Aql' }
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
        { x: 40, y: 30, name: 'Beta Ara', isPrincipal: true, mag: 2.85 },
        { x: 60, y: 30, name: 'Alpha Ara' },
        { x: 45, y: 70, name: 'Gamma Ara' },
        { x: 65, y: 65, name: 'Zeta Ara' },
        { x: 35, y: 85, name: 'Epsilon Ara' }
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
        { x: 75, y: 35, name: 'Hamal', isPrincipal: true, mag: 2.01 },
        { x: 55, y: 48, name: 'Sheratan' },
        { x: 40, y: 60, name: 'Mesarthim' },
        { x: 25, y: 70, name: '41 Arietis' }
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
        { x: 50, y: 20, name: 'Capella', isPrincipal: true, mag: 0.08 },
        { x: 30, y: 40, name: 'Menkalinan' },
        { x: 25, y: 75, name: 'Theta Aur' },
        { x: 60, y: 85, name: 'Elnath (shared)' },
        { x: 75, y: 55, name: 'Iota Aur' }
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
        { x: 50, y: 85, name: 'Arcturus', isPrincipal: true, mag: -0.05 },
        { x: 35, y: 60, name: 'Epsilon Boo (Izar)' },
        { x: 65, y: 60, name: 'Eta Boo (Muphrid)' },
        { x: 40, y: 35, name: 'Delta Boo' },
        { x: 60, y: 35, name: 'Beta Boo (Nekkar)' },
        { x: 50, y: 15, name: 'Gamma Boo (Seginus)' }
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
        { x: 45, y: 25, name: 'Alpha Cae', isPrincipal: true, mag: 4.45 },
        { x: 40, y: 60, name: 'Gamma Cae' },
        { x: 65, y: 80, name: 'Beta Cae' }
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
        { x: 45, y: 75, name: 'Beta Cam', isPrincipal: true, mag: 4.02 },
        { x: 60, y: 50, name: 'Alpha Cam' },
        { x: 40, y: 30, name: '7 Cam' },
        { x: 30, y: 15, name: 'Gamma Cam' }
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
        { x: 50, y: 50, name: 'Praesepe / Delta Cnc' },
        { x: 50, y: 80, name: 'Beta Cnc (Tarf)', isPrincipal: true, mag: 3.52 },
        { x: 40, y: 30, name: 'Gamma Cnc' },
        { x: 70, y: 25, name: 'Iota Cnc' },
        { x: 25, y: 65, name: 'Alpha Cnc (Acubens)' }
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
        { x: 60, y: 60, name: 'Cor Caroli', isPrincipal: true, mag: 2.89 },
        { x: 40, y: 35, name: 'Chara (Beta CVn)' }
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
        { x: 45, y: 25, name: 'Sirius', isPrincipal: true, mag: -1.46 },
        { x: 30, y: 35, name: 'Murzim' },
        { x: 55, y: 60, name: 'Wezen' },
        { x: 40, y: 80, name: 'Adhara' },
        { x: 70, y: 80, name: 'Aludra' }
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
        { x: 60, y: 55, name: 'Procyon', isPrincipal: true, mag: 0.34 },
        { x: 35, y: 40, name: 'Gomeisa' }
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
        { x: 25, y: 35, name: 'Algedi' },
        { x: 30, y: 45, name: 'Dabih' },
        { x: 50, y: 75, name: 'Omega Cap' },
        { x: 75, y: 65, name: 'Zeta Cap' },
        { x: 80, y: 40, name: 'Deneb Algedi', isPrincipal: true, mag: 2.81 },
        { x: 70, y: 35, name: 'Nashira' }
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
        { x: 30, y: 35, name: 'Canopus', isPrincipal: true, mag: -0.74 },
        { x: 55, y: 45, name: 'Miaplacidus' },
        { x: 75, y: 55, name: 'Avior' },
        { x: 80, y: 75, name: 'Aspidiske' },
        { x: 60, y: 70, name: 'Theta Car' }
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
        { x: 20, y: 65, name: 'Caph (Beta Cas)' },
        { x: 35, y: 35, name: 'Schedar (Alpha Cas)', isPrincipal: true, mag: 2.24 },
        { x: 50, y: 55, name: 'Gamma Cas (Navi)' },
        { x: 70, y: 25, name: 'Ruchbah (Delta Cas)' },
        { x: 85, y: 50, name: 'Segin (Epsilon Cas)' }
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
        { x: 80, y: 75, name: 'Alpha Cen', isPrincipal: true, mag: -0.01 },
        { x: 65, y: 70, name: 'Hadar (Beta Cen)' },
        { x: 45, y: 55, name: 'Gamma Cen' },
        { x: 35, y: 40, name: 'Delta Cen' },
        { x: 25, y: 25, name: 'Theta Cen (Menkent)' },
        { x: 55, y: 35, name: 'Epsilon Cen' },
        { x: 40, y: 75, name: 'Zeta Cen' }
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
        { x: 50, y: 20, name: 'Gamma Cep (Errai)' },
        { x: 30, y: 55, name: 'Beta Cep (Alfirk)' },
        { x: 70, y: 55, name: 'Iota Cep' },
        { x: 40, y: 80, name: 'Alderamin', isPrincipal: true, mag: 2.45 },
        { x: 75, y: 75, name: 'Zeta Cep' },
        { x: 85, y: 65, name: 'Delta Cep (prototype)' }
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
        { x: 25, y: 65, name: 'Diphda', isPrincipal: true, mag: 2.04 },
        { x: 40, y: 55, name: 'Eta Cet' },
        { x: 55, y: 50, name: 'Theta Cet' },
        { x: 65, y: 40, name: 'Mira (pulsating)' },
        { x: 80, y: 30, name: 'Menkar (Alpha Cet)' },
        { x: 75, y: 20, name: 'Gamma Cet' }
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
        { x: 30, y: 40, name: 'Alpha Cha', isPrincipal: true, mag: 4.07 },
        { x: 55, y: 35, name: 'Gamma Cha' },
        { x: 75, y: 55, name: 'Beta Cha' },
        { x: 45, y: 70, name: 'Delta Cha' }
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
        { x: 50, y: 25, name: 'Alpha Cir', isPrincipal: true, mag: 3.19 },
        { x: 35, y: 75, name: 'Beta Cir' },
        { x: 70, y: 70, name: 'Gamma Cir' }
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
        { x: 45, y: 35, name: 'Phact', isPrincipal: true, mag: 2.65 },
        { x: 65, y: 45, name: 'Wazn (Beta Col)' },
        { x: 35, y: 65, name: 'Epsilon Col' },
        { x: 75, y: 75, name: 'Gamma Col' }
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
        { x: 40, y: 35, name: 'Beta Com', isPrincipal: true, mag: 4.26 },
        { x: 65, y: 45, name: 'Alpha Com (Diadem)' },
        { x: 30, y: 65, name: 'Gamma Com' }
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
        { x: 25, y: 55, name: 'Meridiana', isPrincipal: true, mag: 4.10 },
        { x: 40, y: 70, name: 'Beta CrA' },
        { x: 60, y: 70, name: 'Gamma CrA' },
        { x: 75, y: 55, name: 'Delta CrA' },
        { x: 80, y: 35, name: 'Epsilon CrA' }
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
        { x: 20, y: 45, name: 'Theta CrB' },
        { x: 35, y: 60, name: 'Beta CrB' },
        { x: 50, y: 65, name: 'Alphecca', isPrincipal: true, mag: 2.21 },
        { x: 65, y: 55, name: 'Gamma CrB' },
        { x: 75, y: 40, name: 'Delta CrB' },
        { x: 85, y: 25, name: 'Epsilon CrB' }
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
        { x: 30, y: 35, name: 'Gienah', isPrincipal: true, mag: 2.58 },
        { x: 65, y: 30, name: 'Algorab (Delta Crv)' },
        { x: 70, y: 70, name: 'Kraz (Beta Crv)' },
        { x: 35, y: 65, name: 'Minkar (Epsilon Crv)' },
        { x: 15, y: 45, name: 'Alchiba (Alpha Crv)' }
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
        { x: 30, y: 35, name: 'Delta Crt (Labrum)', isPrincipal: true, mag: 3.56 },
        { x: 70, y: 35, name: 'Gamma Crt' },
        { x: 50, y: 60, name: 'Alpha Crt (Alkes)' },
        { x: 35, y: 80, name: 'Beta Crt' },
        { x: 65, y: 80, name: 'Zeta Crt' }
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
        { x: 50, y: 80, name: 'Acrux', isPrincipal: true, mag: 0.77 },
        { x: 50, y: 20, name: 'Gacrux (Gamma Cru)' },
        { x: 25, y: 45, name: 'Mimosa (Beta Cru)' },
        { x: 75, y: 50, name: 'Imai (Delta Cru)' },
        { x: 65, y: 65, name: 'Ginan (Epsilon Cru)' }
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
        { x: 50, y: 15, name: 'Deneb', isPrincipal: true, mag: 1.25 },
        { x: 50, y: 45, name: 'Sadr (Gamma Cyg)' },
        { x: 50, y: 85, name: 'Albireo (Beta Cyg)' },
        { x: 20, y: 40, name: 'Delta Cyg' },
        { x: 80, y: 50, name: 'Gienah (Epsilon Cyg)' }
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
        { x: 45, y: 35, name: 'Rotanev', isPrincipal: true, mag: 3.63 },
        { x: 65, y: 30, name: 'Sualocin (Alpha Del)' },
        { x: 70, y: 50, name: 'Gamma Del' },
        { x: 50, y: 55, name: 'Delta Del' },
        { x: 30, y: 80, name: 'Epsilon Del (Deneb Dulfim)' }
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
        { x: 45, y: 25, name: 'Alpha Dor', isPrincipal: true, mag: 3.27 },
        { x: 55, y: 50, name: 'Beta Dor' },
        { x: 40, y: 75, name: 'Gamma Dor' },
        { x: 65, y: 80, name: 'Delta Dor' }
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
        { x: 80, y: 25, name: 'Eltanin', isPrincipal: true, mag: 2.23 },
        { x: 70, y: 15, name: 'Rastaban (Beta Dra)' },
        { x: 60, y: 25, name: 'Nu Dra' },
        { x: 70, y: 35, name: 'Xi Dra' },
        { x: 50, y: 45, name: 'Delta Dra' },
        { x: 35, y: 60, name: 'Thuban (ancient North Star)' },
        { x: 20, y: 75, name: 'Edasich (Iota Dra)' }
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
        { x: 40, y: 30, name: 'Kitalpha', isPrincipal: true, mag: 3.92 },
        { x: 65, y: 45, name: 'Delta Equ' },
        { x: 50, y: 75, name: 'Gamma Equ' },
        { x: 25, y: 65, name: 'Beta Equ' }
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
        { x: 25, y: 15, name: 'Cursa (Beta Eri)' },
        { x: 35, y: 30, name: 'Zaurak' },
        { x: 45, y: 45, name: 'Acamar (Theta Eri)' },
        { x: 55, y: 65, name: 'Epsilon Eri (planet host)' },
        { x: 75, y: 85, name: 'Achernar', isPrincipal: true, mag: 0.45 }
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
        { x: 45, y: 35, name: 'Alpha For (Dalim)', isPrincipal: true, mag: 3.85 },
        { x: 65, y: 65, name: 'Beta For' },
        { x: 30, y: 75, name: 'Nu For' }
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
        { x: 35, y: 25, name: 'Castor (Alpha Gem)' },
        { x: 55, y: 25, name: 'Pollux (Beta Gem)', isPrincipal: true, mag: 1.14 },
        { x: 30, y: 55, name: 'Mebsuta' },
        { x: 50, y: 55, name: 'Wasat' },
        { x: 25, y: 80, name: 'Tejat (Mu Gem)' },
        { x: 45, y: 85, name: 'Alhena (Gamma Gem)' }
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
        { x: 60, y: 40, name: 'Alnair', isPrincipal: true, mag: 1.74 },
        { x: 40, y: 25, name: 'Beta Gru (Tiaki)' },
        { x: 25, y: 45, name: 'Gamma Gru (Al Dhanab)' },
        { x: 45, y: 70, name: 'Delta Gru' },
        { x: 50, y: 85, name: 'Epsilon Gru' }
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
        { x: 40, y: 40, name: 'Pi Her' },
        { x: 60, y: 40, name: 'Eta Her' },
        { x: 65, y: 60, name: 'Zeta Her' },
        { x: 35, y: 60, name: 'Epsilon Her' },
        { x: 50, y: 85, name: 'Kornephoros', isPrincipal: true, mag: 2.77 },
        { x: 50, y: 15, name: 'Rasalgethi (Alpha Her)' }
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
        { x: 45, y: 20, name: 'Alpha Hor', isPrincipal: true, mag: 3.85 },
        { x: 50, y: 45, name: 'Delta Hor' },
        { x: 40, y: 70, name: 'Beta Hor' },
        { x: 65, y: 80, name: 'Zeta Hor' }
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
        { x: 15, y: 25, name: 'Head of Hydra' },
        { x: 30, y: 40, name: 'Alphard', isPrincipal: true, mag: 1.98 },
        { x: 45, y: 55, name: 'Zeta Hya' },
        { x: 60, y: 65, name: 'Nu Hya' },
        { x: 75, y: 70, name: 'Gamma Hya' },
        { x: 90, y: 75, name: 'Pi Hya' }
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
        { x: 30, y: 25, name: 'Alpha Hyi' },
        { x: 65, y: 45, name: 'Gamma Hyi' },
        { x: 45, y: 80, name: 'Beta Hyi', isPrincipal: true, mag: 2.80 }
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
        { x: 45, y: 25, name: 'Alpha Ind (The Persian)', isPrincipal: true, mag: 3.11 },
        { x: 65, y: 55, name: 'Beta Ind' },
        { x: 35, y: 75, name: 'Theta Ind' }
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
