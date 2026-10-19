import { ConstellationShape } from './constellationsCore';

// Part 2 of constellation stick figures (constellations 45 to 88)
export const FULL_CONSTELLATION_SHAPES_PART_2: Record<string, ConstellationShape> = {
  // 45. lacerta
  'lacerta': {
    mainAsterismName: "Little Cassiopeia / Lizard's Spine",
    stars: [
      { x: 50, y: 14, catalogStarId: 'beta-lacertae', name: "Beta Lac (Snout & Head)", mag: 4.43 },
      { x: 50, y: 30, catalogStarId: 'alpha-lacertae', name: "Alpha Lac (Shoulders)", isPrincipal: true, mag: 3.77, isAsterismCore: true },
      { x: 30, y: 26, name: "4 Lac (Front Left Claw)" },
      { x: 70, y: 28, name: "5 Lac (Front Right Claw)" },
      { x: 42, y: 48, name: "1 Lac (Mid Spine)", isAsterismCore: true },
      { x: 58, y: 64, name: "2 Lac (Lower Back)", isAsterismCore: true },
      { x: 26, y: 68, name: "6 Lac (Hind Left Claw)" },
      { x: 74, y: 70, name: "11 Lac (Hind Right Claw)" },
      { x: 50, y: 86, name: "12 Lac (Curled Tail Tip)" }
    ],
    lines: [
      [0, 1], [1, 2], [1, 3], [1, 4], [4, 5], [5, 6], [5, 7], [5, 8]
    ],
    asterismLines: [[1, 4], [4, 5], [5, 8]]
  },

  // 46. leo
  'leo': {
    mainAsterismName: "The Sickle & Triangle",
    stars: [
      { x: 32, y: 76, catalogStarId: 'regulus', name: "Regulus (Alpha Leo - Heart)", isPrincipal: true, mag: 1.36, isAsterismCore: true },
      { x: 34, y: 56, name: "Eta Leo (Chest)", isAsterismCore: true },
      { x: 44, y: 40, catalogStarId: 'algieba', name: "Algieba (Gamma Leo - Mane Crest)", mag: 2.08, isAsterismCore: true },
      { x: 48, y: 24, name: "Adhafera (Zeta Leo - Top of Mane)", isAsterismCore: true },
      { x: 38, y: 16, name: "Ras Elased (Epsilon Leo - Muzzle)", isAsterismCore: true },
      { x: 26, y: 24, catalogStarId: 'alterf', name: "Alterf (Lambda Leo - Nose Tip)" },
      { x: 68, y: 46, catalogStarId: 'zosma', name: "Zosma (Delta Leo - Back / Rump)", mag: 2.56, isAsterismCore: true },
      { x: 60, y: 66, catalogStarId: 'chertan', name: "Chertan (Theta Leo - Flank)", isAsterismCore: true },
      { x: 88, y: 52, catalogStarId: 'denebola', name: "Denebola (Beta Leo - Lion Tail Tuft)", mag: 2.14, isAsterismCore: true },
      { x: 20, y: 84, catalogStarId: 'subra', name: "Subra (Omicron Leo - Front Paws)" },
      { x: 52, y: 84, name: "Rho Leo (Hind Paws)" }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [2, 6], [6, 7], [7, 0], [6, 8], [0, 9], [7, 10]
    ],
    asterismLines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [2, 6], [6, 7], [7, 0], [6, 8]]
  },

  // 47. leo-minor
  'leo-minor': {
    mainAsterismName: "Lesser Lion's Wedge",
    stars: [
      { x: 68, y: 38, catalogStarId: 'praecipua', name: "Praecipua (46 LMi - Cub Head)", isPrincipal: true, mag: 3.83, isAsterismCore: true },
      { x: 46, y: 50, catalogStarId: 'beta-leonis-minoris', name: "Beta LMi (Back / Spine)", mag: 4.21, isAsterismCore: true },
      { x: 26, y: 64, name: "21 LMi (Cub Tail)", isAsterismCore: true },
      { x: 54, y: 72, name: "10 LMi (Cub Paws)" },
      { x: 74, y: 56, name: "30 LMi (Chest)" }
    ],
    lines: [
      [0, 1], [1, 2], [0, 4], [1, 3], [4, 3]
    ],
    asterismLines: [[0, 1], [1, 2]]
  },

  // 48. lepus
  'lepus': {
    mainAsterismName: "The Throne of Orion / Hare",
    stars: [
      { x: 30, y: 16, name: "Epsilon Lep (West Ear)" },
      { x: 42, y: 14, name: "Mu Lep (East Ear)" },
      { x: 38, y: 32, name: "Zeta Lep (Head & Eye)" },
      { x: 50, y: 44, catalogStarId: 'arneb', name: "Arneb (Alpha Lep - Hare Heart)", isPrincipal: true, mag: 2.58, isAsterismCore: true },
      { x: 46, y: 66, catalogStarId: 'nihal', name: "Nihal (Beta Lep - Belly)", mag: 2.81, isAsterismCore: true },
      { x: 68, y: 52, name: "Gamma Lep (Flank)", isAsterismCore: true },
      { x: 68, y: 74, name: "Delta Lep (Hind Paw)", isAsterismCore: true },
      { x: 24, y: 72, name: "Eta Lep (Front Paw)" },
      { x: 80, y: 42, name: "Theta Lep (Cotton Tail)" }
    ],
    lines: [
      [0, 2], [1, 2], [2, 3], [3, 4], [3, 5], [4, 6], [5, 6], [4, 7], [5, 8]
    ],
    asterismLines: [[3, 4], [4, 6], [6, 5], [5, 3]]
  },

  // 49. libra
  'libra': {
    mainAsterismName: "The Scales Beam & Pans",
    stars: [
      { x: 50, y: 18, name: "Zubenelakrab (Gamma Lib - Beam Pivot & Tongue)", isAsterismCore: true },
      { x: 30, y: 38, catalogStarId: 'zubeneschamali', name: "Zubeneschamali (Beta Lib - Northern Scale Pan)", isPrincipal: true, mag: 2.61, isAsterismCore: true },
      { x: 70, y: 48, catalogStarId: 'zubenelgenubi', name: "Zubenelgenubi (Alpha Lib - Southern Scale Pan)", mag: 2.75, isAsterismCore: true },
      { x: 44, y: 72, catalogStarId: 'brachium', name: "Brachium (Sigma Lib - Pan Weight South)", mag: 3.25, isAsterismCore: true },
      { x: 20, y: 65, name: "Theta Lib (Suspension Cord West)" },
      { x: 78, y: 75, name: "Upsilon Lib (Suspension Cord East)" },
      { x: 56, y: 58, name: "Tau Lib (Plumb Bob)" }
    ],
    lines: [
      [0, 1], [0, 2], [1, 4], [4, 3], [1, 3], [2, 5], [5, 6], [2, 6], [0, 6]
    ],
    asterismLines: [[0, 1], [0, 2], [1, 3], [2, 3]]
  },

  // 50. lupus
  'lupus': {
    mainAsterismName: "The Celestial Wolf",
    stars: [
      { x: 48, y: 16, catalogStarId: 'men-alpha-lupi', name: "Men (Alpha Lup - Wolf Eye)", isPrincipal: true, mag: 2.3, isAsterismCore: true },
      { x: 38, y: 26, catalogStarId: 'ke-kouan', name: "Ke Kouan (Beta Lup - Snout & Fangs)", mag: 2.68, isAsterismCore: true },
      { x: 62, y: 30, name: "Gamma Lup (Ears)" },
      { x: 42, y: 46, name: "Delta Lup (Chest / Shoulder)", isAsterismCore: true },
      { x: 26, y: 62, name: "Epsilon Lup (Front Paws)" },
      { x: 64, y: 54, name: "Zeta Lup (Back / Spine)", isAsterismCore: true },
      { x: 74, y: 74, name: "Eta Lup (Hind Leg & Claws)", isAsterismCore: true },
      { x: 82, y: 48, name: "Theta Lup (Bushy Tail)" }
    ],
    lines: [
      [1, 0], [0, 2], [1, 3], [3, 4], [3, 5], [5, 6], [5, 7]
    ],
    asterismLines: [[1, 0], [0, 3], [3, 5], [5, 6]]
  },

  // 51. lynx
  'lynx': {
    mainAsterismName: "The Cat's Stalking Trail",
    stars: [
      { x: 82, y: 18, catalogStarId: 'alpha-lyncis', name: "Elvashak (Alpha Lyn - Lynx Eye)", isPrincipal: true, mag: 3.13, isAsterismCore: true },
      { x: 86, y: 32, name: "38 Lyn (Tufted Ears)" },
      { x: 68, y: 40, catalogStarId: 'alsciaukat', name: "31 Lyn (Forequarters)", mag: 4.25, isAsterismCore: true },
      { x: 50, y: 52, name: "21 Lyn (Arched Spine)", isAsterismCore: true },
      { x: 34, y: 64, name: "10 Lyn (Flank)", isAsterismCore: true },
      { x: 18, y: 76, name: "2 Lyn (Hind Leg & Paw)" },
      { x: 44, y: 84, name: "15 Lyn (Front Paw)" }
    ],
    lines: [
      [0, 1], [0, 2], [2, 3], [3, 4], [4, 5], [3, 6]
    ],
    asterismLines: [[0, 2], [2, 3], [3, 4], [4, 5]]
  },

  // 52. lyra
  'lyra': {
    mainAsterismName: "The Celestial Lyre Box & Vega",
    stars: [
      { x: 50, y: 18, catalogStarId: 'vega', name: "Vega (Alpha Lyr - Brilliant Jewel)", isPrincipal: true, mag: 0.03, isAsterismCore: true },
      { x: 64, y: 26, name: "Epsilon Lyr (The Double-Double Ear)", isAsterismCore: true },
      { x: 40, y: 34, name: "Zeta Lyr (Tuning Peg West)", isAsterismCore: true },
      { x: 60, y: 42, name: "Delta2 Lyr (Tuning Peg East)", isAsterismCore: true },
      { x: 36, y: 74, catalogStarId: 'sheliak', name: "Sheliak (Beta Lyr - Resonating Box Corner)", mag: 3.52, isAsterismCore: true },
      { x: 58, y: 82, catalogStarId: 'sulafat', name: "Sulafat (Gamma Lyr - Sounding Box Base)", mag: 3.25, isAsterismCore: true },
      { x: 74, y: 58, name: "Eta Lyr (Lyre Arm Strut)" }
    ],
    lines: [
      [0, 1], [0, 2], [2, 3], [2, 4], [3, 5], [4, 5], [3, 6], [5, 6]
    ],
    asterismLines: [[0, 2], [0, 3], [2, 3], [2, 4], [3, 5], [4, 5]]
  },

  // 53. mensa
  'mensa': {
    mainAsterismName: "Table Mountain Plateau",
    stars: [
      { x: 42, y: 24, catalogStarId: 'alpha-mensae', name: "Alpha Men (Summit Plateau Peak)", isPrincipal: true, mag: 5.09, isAsterismCore: true },
      { x: 70, y: 30, catalogStarId: 'gamma-mensae', name: "Gamma Men (Eastern Cliff Rim)", mag: 5.18, isAsterismCore: true },
      { x: 26, y: 58, name: "Beta Men (Western Precipice)", isAsterismCore: true },
      { x: 54, y: 68, name: "Eta Men (Talus Slope)" },
      { x: 68, y: 82, name: "Mu Men (Table Valley Base)" }
    ],
    lines: [
      [0, 1], [0, 2], [1, 3], [2, 3], [3, 4]
    ],
    asterismLines: [[0, 1], [0, 2], [2, 3], [3, 1]]
  },

  // 54. microscopium
  'microscopium': {
    mainAsterismName: "Compound Microscope",
    stars: [
      { x: 50, y: 16, catalogStarId: 'alpha-microscopii', name: "Alpha Mic (Eyepiece Tube)", mag: 4.89, isAsterismCore: true },
      { x: 66, y: 36, catalogStarId: 'gamma-microscopii', name: "Gamma Mic (Coarse Adjustment Dial)", isPrincipal: true, mag: 4.67, isAsterismCore: true },
      { x: 44, y: 54, name: "Epsilon Mic (Objective Lens Barrel)", isAsterismCore: true },
      { x: 30, y: 74, name: "Theta Mic (Specimen Stage Rest)" },
      { x: 62, y: 84, name: "Beta Mic (Horseshoe Base Stand)" }
    ],
    lines: [
      [0, 1], [0, 2], [1, 2], [2, 3], [3, 4]
    ],
    asterismLines: [[0, 2], [2, 4]]
  },

  // 55. monoceros
  'monoceros': {
    mainAsterismName: "The Unicorn's Horn & Body",
    stars: [
      { x: 80, y: 16, catalogStarId: 'beta-monocerotis', name: "Beta Mon (Triple Star Spiraling Horn)", isPrincipal: true, mag: 3.74, isAsterismCore: true },
      { x: 68, y: 32, name: "Delta Mon (Muzzle / Head)" },
      { x: 54, y: 44, catalogStarId: 'alpha-monocerotis', name: "Alpha Mon (Heart / Withers)", mag: 3.94, isAsterismCore: true },
      { x: 38, y: 52, name: "Gamma Mon (Flank / Spine)", isAsterismCore: true },
      { x: 22, y: 68, name: "Zeta Mon (Rump & Tail)", isAsterismCore: true },
      { x: 56, y: 78, name: "Epsilon Mon (Front Hooves)" },
      { x: 26, y: 86, name: "13 Mon (Hind Hooves)" }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4], [2, 5], [4, 6]
    ],
    asterismLines: [[0, 2], [2, 3], [3, 4]]
  },

  // 56. musca
  'musca': {
    mainAsterismName: "The Southern Fly Quadrangle",
    stars: [
      { x: 50, y: 22, catalogStarId: 'alpha-muscae', name: "Alpha Mus (Head / Compound Eyes)", isPrincipal: true, mag: 2.69, isAsterismCore: true },
      { x: 50, y: 46, catalogStarId: 'beta-muscae', name: "Beta Mus (Thorax Joint)", mag: 3.04, isAsterismCore: true },
      { x: 26, y: 42, name: "Gamma Mus (West Wingtip)", isAsterismCore: true },
      { x: 74, y: 44, name: "Delta Mus (East Wingtip)", isAsterismCore: true },
      { x: 42, y: 76, name: "Epsilon Mus (Abdomen Tip)", isAsterismCore: true },
      { x: 58, y: 74, name: "Mu Mus (Abdomen Flank)" }
    ],
    lines: [
      [0, 1], [1, 2], [1, 3], [1, 4], [1, 5], [4, 5], [2, 4], [3, 5]
    ],
    asterismLines: [[0, 1], [1, 2], [1, 3], [1, 4]]
  },

  // 57. norma
  'norma': {
    mainAsterismName: "The Right-Angle Level",
    stars: [
      { x: 30, y: 24, catalogStarId: 'gamma-2-normae', name: "Gamma2 Nor (Right-Angle Rule Arm)", isPrincipal: true, mag: 4.02, isAsterismCore: true },
      { x: 54, y: 44, name: "Delta Nor (Corner Junction Apex)", isAsterismCore: true },
      { x: 74, y: 70, name: "Epsilon Nor (Leveling Leg Base)", isAsterismCore: true },
      { x: 36, y: 64, name: "Eta Nor (Plumb Bob Anchor)" },
      { x: 48, y: 84, name: "Iota1 Nor (Measuring Foot)" }
    ],
    lines: [
      [0, 1], [1, 2], [1, 3], [3, 4]
    ],
    asterismLines: [[0, 1], [1, 2]]
  },

  // 58. octans
  'octans': {
    mainAsterismName: "The Polar Index Arm",
    stars: [
      { x: 50, y: 16, catalogStarId: 'nu-octantis', name: "Nu Oct (Index Pivot Mirror)", mag: 3.73, isAsterismCore: true },
      { x: 34, y: 48, name: "Beta Oct (West Arc Arm)", isAsterismCore: true },
      { x: 68, y: 52, name: "Alpha Oct (East Arc Arm)", isAsterismCore: true },
      { x: 52, y: 82, catalogStarId: 'polaris-australis', name: "Polaris Australis (Sigma Oct - True South Celestial Pole)", isPrincipal: true, mag: 5.47, isAsterismCore: true },
      { x: 42, y: 68, name: "Delta Oct (Graduated Vernier Arc)" }
    ],
    lines: [
      [0, 1], [0, 2], [1, 4], [4, 2], [0, 3]
    ],
    asterismLines: [[0, 1], [0, 2], [1, 4], [4, 2]]
  },

  // 59. ophiuchus
  'ophiuchus': {
    mainAsterismName: "The Giant Serpent Bearer",
    stars: [
      { x: 50, y: 14, catalogStarId: 'rasalhague', name: "Rasalhague (Alpha Oph - Head of Healer)", isPrincipal: true, mag: 2.08, isAsterismCore: true },
      { x: 34, y: 28, catalogStarId: 'cebalrai', name: "Cebalrai (Beta Oph - Right Shoulder)", isAsterismCore: true },
      { x: 68, y: 28, name: "Kappa Oph (Left Shoulder)", isAsterismCore: true },
      { x: 20, y: 44, catalogStarId: 'yed-prior', name: "Yed Prior (Delta Oph - West Hand clutching Serpens Caput)", isAsterismCore: true },
      { x: 24, y: 50, catalogStarId: 'yed-posterior', name: "Yed Posterior (Epsilon Oph - West Wrist)" },
      { x: 80, y: 44, catalogStarId: 'marfik', name: "Marfik (Lambda Oph - East Hand clutching Serpens Cauda)" },
      { x: 42, y: 62, catalogStarId: 'sabik', name: "Sabik (Eta Oph - Right Knee / Foot)", mag: 2.43, isAsterismCore: true },
      { x: 60, y: 64, catalogStarId: 'han', name: "Han (Zeta Oph - Left Knee / Foot)", mag: 2.57, isAsterismCore: true },
      { x: 32, y: 86, name: "Theta Oph (Right Foot on Scorpion Stinger)" },
      { x: 68, y: 86, name: "Phi Oph (Left Foot on Antares)" }
    ],
    lines: [
      [0, 1], [0, 2], [1, 2], [1, 3], [3, 4], [2, 5], [1, 6], [2, 7], [6, 7], [6, 8], [7, 9]
    ],
    asterismLines: [[0, 1], [0, 2], [1, 6], [2, 7], [6, 7]]
  },

  // 60. orion
  'orion': {
    mainAsterismName: "Orion's Belt & Hourglass",
    stars: [
      { x: 34, y: 28, catalogStarId: 'betelgeuse', name: "Betelgeuse (Alpha Ori - Red Supergiant Shoulder)", mag: 0.5, isAsterismCore: true },
      { x: 66, y: 26, catalogStarId: 'bellatrix', name: "Bellatrix (Gamma Ori - Left Shoulder)", mag: 1.64, isAsterismCore: true },
      { x: 50, y: 16, catalogStarId: 'meissa', name: "Meissa (Lambda Ori - Head of the Hunter)", mag: 3.39 },
      { x: 42, y: 50, catalogStarId: 'alnitak', name: "Alnitak (Zeta Ori - Belt East)", mag: 1.77, isAsterismCore: true },
      { x: 50, y: 50, catalogStarId: 'alnilam', name: "Alnilam (Epsilon Ori - Belt Center)", mag: 1.69, isAsterismCore: true },
      { x: 58, y: 50, catalogStarId: 'mintaka', name: "Mintaka (Delta Ori - Belt West)", mag: 2.23, isAsterismCore: true },
      { x: 50, y: 62, name: "Great Orion Nebula (M42 / Theta Ori - Sword)", isAsterismCore: true },
      { x: 36, y: 78, catalogStarId: 'saiph', name: "Saiph (Kappa Ori - Right Knee)", mag: 2.07, isAsterismCore: true },
      { x: 68, y: 80, catalogStarId: 'rigel', name: "Rigel (Beta Ori - Brilliant Left Foot)", isPrincipal: true, mag: 0.13, isAsterismCore: true },
      { x: 26, y: 16, name: "Mu Ori (Club Arm)" },
      { x: 20, y: 8, name: "Chi1 Ori (Raised Club Knot)" },
      { x: 80, y: 24, name: "Pi1 Ori (Shield Top)" },
      { x: 84, y: 34, name: "Pi2 Ori (Shield Upper)" },
      { x: 86, y: 46, catalogStarId: 'tabit', name: "Tabit (Pi3 Ori - Shield Center)" },
      { x: 82, y: 58, name: "Pi4 Ori (Shield Lower)" },
      { x: 78, y: 68, name: "Pi5 Ori (Shield Bottom)" }
    ],
    lines: [
      [2, 0], [2, 1], [0, 3], [1, 5], [3, 4], [4, 5], [4, 6], [3, 7], [5, 8], [7, 8], [0, 9], [9, 10], [1, 11], [11, 12], [12, 13], [13, 14], [14, 15]
    ],
    asterismLines: [[0, 1], [0, 3], [1, 5], [3, 4], [4, 5], [3, 7], [5, 8], [7, 8], [4, 6]]
  },

  // 61. pavo
  'pavo': {
    mainAsterismName: "The Peacock Eye & Fanned Tail",
    stars: [
      { x: 50, y: 18, catalogStarId: 'peacock', name: "Peacock (Alpha Pav - Brilliant Eye)", isPrincipal: true, mag: 1.94, isAsterismCore: true },
      { x: 50, y: 38, name: "Beta Pav (Breast)", isAsterismCore: true },
      { x: 32, y: 54, name: "Gamma Pav (Left Wing Plume)", isAsterismCore: true },
      { x: 68, y: 54, catalogStarId: 'delta-pavonis', name: "Delta Pav (Right Wing Plume)", mag: 3.56, isAsterismCore: true },
      { x: 20, y: 74, name: "Epsilon Pav (Outer Left Fan Feather)" },
      { x: 42, y: 82, name: "Zeta Pav (Center Left Plume)" },
      { x: 58, y: 82, name: "Eta Pav (Center Right Plume)" },
      { x: 80, y: 74, name: "Lambda Pav (Outer Right Fan Feather)" }
    ],
    lines: [
      [0, 1], [1, 2], [1, 3], [2, 3], [2, 4], [2, 5], [3, 6], [3, 7], [4, 5], [5, 6], [6, 7]
    ],
    asterismLines: [[0, 1], [1, 2], [1, 3], [2, 3]]
  },

  // 62. pegasus
  'pegasus': {
    mainAsterismName: "The Great Square of Pegasus",
    stars: [
      { x: 40, y: 44, catalogStarId: 'markab', name: "Markab (Alpha Peg - Southwest Corner)", mag: 2.48, isAsterismCore: true },
      { x: 40, y: 72, catalogStarId: 'scheat', name: "Scheat (Beta Peg - Northwest Corner)", mag: 2.42, isAsterismCore: true },
      { x: 74, y: 72, catalogStarId: 'alpheratz', name: "Alpheratz (Alpha And - Northeast Corner)", mag: 2.06, isAsterismCore: true },
      { x: 74, y: 44, catalogStarId: 'algenib', name: "Algenib (Gamma Peg - Southeast Corner)", mag: 2.84, isAsterismCore: true },
      { x: 28, y: 36, catalogStarId: 'homam', name: "Homam (Zeta Peg - Neck Base)" },
      { x: 22, y: 26, name: "Baham (Theta Peg - Forehead)" },
      { x: 12, y: 20, catalogStarId: 'enif', name: "Enif (Epsilon Peg - Muzzle & Nose)", isPrincipal: true, mag: 2.39, isAsterismCore: true },
      { x: 30, y: 84, catalogStarId: 'matar', name: "Matar (Eta Peg - Front Knee)" },
      { x: 18, y: 92, name: "Pi Peg (Front Hoof 1)" },
      { x: 46, y: 90, name: "Iota Peg (Front Hoof 2)" }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 0], [0, 4], [4, 5], [5, 6], [1, 7], [7, 8], [1, 9]
    ],
    asterismLines: [[0, 1], [1, 2], [2, 3], [3, 0]]
  },

  // 63. perseus
  'perseus': {
    mainAsterismName: "Segment of Perseus & Algol",
    stars: [
      { x: 50, y: 34, catalogStarId: 'mirfak', name: "Mirfak (Alpha Per - Heart / Torso)", isPrincipal: true, mag: 1.79, isAsterismCore: true },
      { x: 68, y: 48, catalogStarId: 'algol-a', name: "Algol (Beta Per - Gorgon Medusa Eye)", mag: 2.12, isAsterismCore: true },
      { x: 42, y: 16, name: "Gamma Per (Warrior Helmet Crest)" },
      { x: 28, y: 10, name: "Eta Per (Raised Diamond Sword Tip)" },
      { x: 36, y: 48, name: "Delta Per (Body Flank)", isAsterismCore: true },
      { x: 26, y: 64, name: "Epsilon Per (Right Thigh)", isAsterismCore: true },
      { x: 20, y: 82, catalogStarId: 'menkib', name: "Menkib (Xi Per - Winged Sandal West)" },
      { x: 40, y: 84, catalogStarId: 'atik', name: "Zeta Per (Winged Sandal East)", mag: 2.85, isAsterismCore: true },
      { x: 78, y: 38, name: "Rho Per (Serpent Hair of Medusa)" }
    ],
    lines: [
      [2, 0], [2, 3], [0, 1], [1, 8], [0, 4], [4, 5], [5, 6], [5, 7]
    ],
    asterismLines: [[2, 0], [0, 4], [4, 5], [5, 7], [0, 1]]
  },

  // 64. phoenix
  'phoenix': {
    mainAsterismName: "The Flaming Firebird",
    stars: [
      { x: 50, y: 38, catalogStarId: 'ankaa', name: "Ankaa (Alpha Phe - Heart of the Firebird)", isPrincipal: true, mag: 2.39, isAsterismCore: true },
      { x: 50, y: 16, name: "Delta Phe (Golden Crest & Beak)" },
      { x: 24, y: 34, catalogStarId: 'tiaki-phe', name: "Beta Phe (Western Flaming Wingtip)", mag: 3.32, isAsterismCore: true },
      { x: 76, y: 36, name: "Gamma Phe (Eastern Flaming Wingtip)", isAsterismCore: true },
      { x: 34, y: 68, name: "Epsilon Phe (Tail Plume West)", isAsterismCore: true },
      { x: 66, y: 68, name: "Zeta Phe (Tail Plume East)", isAsterismCore: true },
      { x: 50, y: 88, name: "Nu Phe (Trailing Fire Tail)" }
    ],
    lines: [
      [1, 0], [0, 2], [0, 3], [0, 4], [0, 5], [4, 6], [5, 6]
    ],
    asterismLines: [[1, 0], [0, 2], [0, 3], [0, 4], [0, 5]]
  },

  // 65. pictor
  'pictor': {
    mainAsterismName: "Artist's Easel & Tripod",
    stars: [
      { x: 50, y: 16, catalogStarId: 'alpha-pictoris', name: "Alpha Pic (Easel Apex Clamp)", isPrincipal: true, mag: 3.27, isAsterismCore: true },
      { x: 30, y: 56, name: "Gamma Pic (Left Shelf Leg)", isAsterismCore: true },
      { x: 70, y: 58, catalogStarId: 'beta-pictoris', name: "Beta Pic (Famous Exoplanet Disk - Right Shelf Leg)", mag: 3.86, isAsterismCore: true },
      { x: 18, y: 88, name: "Delta Pic (Left Tripod Foot)" },
      { x: 82, y: 88, name: "Zeta Pic (Right Tripod Foot)" },
      { x: 50, y: 90, name: "Eta Pic (Rear Strut Foot)" }
    ],
    lines: [
      [0, 1], [0, 2], [1, 2], [1, 3], [2, 4], [0, 5]
    ],
    asterismLines: [[0, 1], [0, 2], [1, 2]]
  },

  // 66. pisces
  'pisces': {
    mainAsterismName: "The Circlet & Celestial Ribbon",
    stars: [
      { x: 72, y: 82, catalogStarId: 'alrescha', name: "Alrescha (Alpha Psc - The Ribbon Knot)", mag: 3.82, isAsterismCore: true },
      { x: 76, y: 56, name: "Omicron Psc (Northern Cord)" },
      { x: 80, y: 34, catalogStarId: 'alpherg', name: "Eta Psc (North Fish Tail)", isPrincipal: true, mag: 3.62 },
      { x: 84, y: 18, name: "Beta Psc (Fumalsamakah - North Fish Mouth)", mag: 4.48, isAsterismCore: true },
      { x: 72, y: 22, name: "Gamma Psc (North Fish Belly)" },
      { x: 50, y: 80, name: "Delta Psc (Western Cord)" },
      { x: 34, y: 76, name: "Epsilon Psc (Mid Cord)" },
      { x: 22, y: 68, name: "Theta Psc (Circlet South)", mag: 4.27, isAsterismCore: true },
      { x: 14, y: 58, name: "Iota Psc (Circlet West)", isAsterismCore: true },
      { x: 18, y: 46, name: "Lambda Psc (Circlet North)", isAsterismCore: true },
      { x: 28, y: 50, name: "Kappa Psc (Circlet East)", isAsterismCore: true },
      { x: 28, y: 62, name: "Gamma Psc (Circlet Base)", isAsterismCore: true }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 2], [0, 5], [5, 6], [6, 11], [11, 7], [7, 8], [8, 9], [9, 10], [10, 11]
    ],
    asterismLines: [[7, 8], [8, 9], [9, 10], [10, 11], [11, 7]]
  },

  // 67. piscis-austrinus
  'piscis-austrinus': {
    mainAsterismName: "The Solitary Beacon Fomalhaut & Fish",
    stars: [
      { x: 26, y: 44, catalogStarId: 'fomalhaut', name: "Fomalhaut (Alpha PsA - Fish Mouth)", isPrincipal: true, mag: 1.16, isAsterismCore: true },
      { x: 44, y: 30, name: "Epsilon PsA (Dorsal Fin)", isAsterismCore: true },
      { x: 62, y: 28, catalogStarId: 'delta-piscis-austrini', name: "Delta PsA (Upper Body)", mag: 4.2, isAsterismCore: true },
      { x: 78, y: 42, name: "Gamma PsA (Tail Peduncle)", isAsterismCore: true },
      { x: 88, y: 32, name: "Beta PsA (Upper Fluke)", isAsterismCore: true },
      { x: 88, y: 56, name: "Iota PsA (Lower Fluke)" },
      { x: 56, y: 60, name: "Theta PsA (Fish Belly)" }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4], [3, 5], [0, 6], [6, 3]
    ],
    asterismLines: [[0, 1], [1, 2], [2, 3], [3, 4], [0, 6], [6, 3]]
  },

  // 68. puppis
  'puppis': {
    mainAsterismName: "Argo's Poop Deck",
    stars: [
      { x: 46, y: 22, catalogStarId: 'tureis', name: "Tureis (Rho Pup - Aft Mast)", mag: 2.81, isAsterismCore: true },
      { x: 68, y: 36, name: "Sigma Pup (Upper Transom)", isAsterismCore: true },
      { x: 38, y: 52, name: "Xi Pup (Captain Bridge Deck)", isAsterismCore: true },
      { x: 64, y: 64, name: "Pi Pup (Poop Deck Railing)" },
      { x: 32, y: 82, catalogStarId: 'zeta-puppis', name: "Naos (Zeta Pup - Blazing Supergiant Hull)", isPrincipal: true, mag: 2.25, isAsterismCore: true },
      { x: 76, y: 84, name: "k Pup (Stern Keel Foot)" }
    ],
    lines: [
      [0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 5], [4, 5]
    ],
    asterismLines: [[0, 1], [0, 2], [2, 4], [4, 5]]
  },

  // 69. pyxis
  'pyxis': {
    mainAsterismName: "Mariner's Needle",
    stars: [
      { x: 50, y: 18, catalogStarId: 'alpha-pyxidis', name: "Alpha Pyx (Needle North Point)", isPrincipal: true, mag: 3.68, isAsterismCore: true },
      { x: 50, y: 48, catalogStarId: 'beta-pyxidis', name: "Beta Pyx (Magnetic Gimbal Pivot)", mag: 3.97, isAsterismCore: true },
      { x: 50, y: 78, name: "Gamma Pyx (Needle South Point)", isAsterismCore: true },
      { x: 32, y: 48, name: "Delta Pyx (East Azimuth Card)" },
      { x: 68, y: 48, name: "Theta Pyx (West Azimuth Card)" }
    ],
    lines: [
      [0, 1], [1, 2], [3, 1], [1, 4]
    ],
    asterismLines: [[0, 1], [1, 2]]
  },

  // 70. reticulum
  'reticulum': {
    mainAsterismName: "The Celestial Crosshairs Rhombus",
    stars: [
      { x: 50, y: 16, catalogStarId: 'alpha-reticuli', name: "Alpha Ret (North Diamond Apex)", isPrincipal: true, mag: 3.33, isAsterismCore: true },
      { x: 26, y: 48, catalogStarId: 'beta-reticuli', name: "Beta Ret (West Crosshair Vertex)", mag: 3.84, isAsterismCore: true },
      { x: 74, y: 48, name: "Gamma Ret (East Crosshair Vertex)", isAsterismCore: true },
      { x: 50, y: 80, name: "Delta Ret (South Diamond Apex)", isAsterismCore: true },
      { x: 50, y: 48, name: "Epsilon Ret (Central Optical Crosshair)", isAsterismCore: true }
    ],
    lines: [
      [0, 1], [1, 3], [3, 2], [2, 0], [0, 4], [3, 4], [1, 4], [2, 4]
    ],
    asterismLines: [[0, 1], [1, 3], [3, 2], [2, 0]]
  },

  // 71. sagitta
  'sagitta': {
    mainAsterismName: "The Cosmic Arrow",
    stars: [
      { x: 22, y: 42, catalogStarId: 'sham', name: "Sham (Alpha Sge - Upper Fletching Feather)", mag: 4.38, isAsterismCore: true },
      { x: 22, y: 58, name: "Beta Sge (Lower Fletching Feather)", isAsterismCore: true },
      { x: 34, y: 50, name: "Theta Sge (Arrow Nock & Crest)" },
      { x: 54, y: 50, name: "Delta Sge (Slender Wooden Shaft)", isAsterismCore: true },
      { x: 78, y: 50, catalogStarId: 'gamma-sagittae', name: "Gamma Sge (Barbed Arrowhead)", isPrincipal: true, mag: 3.47, isAsterismCore: true },
      { x: 88, y: 44, name: "Eta Sge (Upper Barb Tip)" }
    ],
    lines: [
      [0, 2], [1, 2], [2, 3], [3, 4], [4, 5]
    ],
    asterismLines: [[0, 2], [1, 2], [2, 3], [3, 4]]
  },

  // 72. sagittarius
  'sagittarius': {
    mainAsterismName: "The Teapot Asterism",
    stars: [
      { x: 48, y: 72, catalogStarId: 'kaus-australis', name: "Kaus Australis (Epsilon Sgr - South Bow)", isPrincipal: true, mag: 1.85, isAsterismCore: true },
      { x: 36, y: 56, catalogStarId: 'kaus-media', name: "Kaus Media (Delta Sgr - Bow Center)", mag: 2.72, isAsterismCore: true },
      { x: 36, y: 36, catalogStarId: 'kaus-borealis', name: "Kaus Borealis (Lambda Sgr - Teapot Lid Peak)", mag: 2.82, isAsterismCore: true },
      { x: 62, y: 44, catalogStarId: 'nunki', name: "Nunki (Sigma Sgr - Teapot Handle Top)", mag: 2.05, isAsterismCore: true },
      { x: 72, y: 62, catalogStarId: 'ascella', name: "Ascella (Zeta Sgr - Teapot Handle Bottom)", isAsterismCore: true },
      { x: 20, y: 60, catalogStarId: 'alnasl', name: "Alnasl (Gamma Sgr - Teapot Spout / Arrowhead)", isAsterismCore: true },
      { x: 44, y: 18, name: "Albaldah (Pi Sgr - Archer Head)" },
      { x: 54, y: 22, name: "d Sgr (Helmet Crest)" },
      { x: 82, y: 34, catalogStarId: 'terebellum-omega', name: "Omega Sgr (Terebellum 1)" },
      { x: 88, y: 38, name: "59 Sgr (Terebellum 2)" },
      { x: 86, y: 48, name: "60 Sgr (Terebellum 3)" },
      { x: 68, y: 84, catalogStarId: 'rukbat', name: "Rukbat (Alpha Sgr - Front Hoof)" },
      { x: 80, y: 86, catalogStarId: 'arkab-prior', name: "Arkab Prior (Beta1 Sgr - Hind Hoof)" }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [1, 4], [1, 5], [0, 5], [2, 5], [2, 6], [6, 7], [3, 8], [8, 9], [9, 10], [10, 4], [0, 11], [4, 12]
    ],
    asterismLines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [1, 4], [1, 5]]
  },

  // 73. scorpius
  'scorpius': {
    mainAsterismName: "The Fishhook / Scorpion's Tail",
    stars: [
      { x: 28, y: 16, catalogStarId: 'acrab', name: "Acrab / Graffias (Beta Sco - North Claw)", mag: 2.62, isAsterismCore: true },
      { x: 38, y: 22, catalogStarId: 'dschubba', name: "Dschubba (Delta Sco - Scorpion Forehead)", mag: 2.29, isAsterismCore: true },
      { x: 48, y: 14, name: "Pi Sco (South Claw)", isAsterismCore: true },
      { x: 42, y: 34, catalogStarId: 'antares', name: "Antares (Alpha Sco - Rival of Mars)", isPrincipal: true, mag: 0.96, isAsterismCore: true },
      { x: 50, y: 44, name: "Tau Sco (Chest Plate)" },
      { x: 56, y: 54, catalogStarId: 'larawag', name: "Larawag (Epsilon Sco - Upper Abdomen)", isAsterismCore: true },
      { x: 62, y: 66, name: "Mu Sco (Mid Tail Curve)", isAsterismCore: true },
      { x: 60, y: 78, name: "Zeta Sco (Lower Tail Loop)", isAsterismCore: true },
      { x: 46, y: 86, name: "Eta Sco (Tail Base)", isAsterismCore: true },
      { x: 32, y: 84, catalogStarId: 'sargas', name: "Sargas (Theta Sco - Sweeping Stinger Hook)", mag: 1.86, isAsterismCore: true },
      { x: 22, y: 74, name: "Iota Sco (Elevated Tail Joint)" },
      { x: 20, y: 60, catalogStarId: 'shaula', name: "Shaula (Lambda Sco - The Stinger Barb)", mag: 1.62, isAsterismCore: true },
      { x: 28, y: 62, name: "Lesath (Upsilon Sco - Stinger Poison Sac)", isAsterismCore: true }
    ],
    lines: [
      [0, 1], [1, 2], [1, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 12], [10, 12]
    ],
    asterismLines: [[3, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 12]]
  },

  // 74. sculptor
  'sculptor': {
    mainAsterismName: "Sculptor's Turntable",
    stars: [
      { x: 50, y: 22, catalogStarId: 'alpha-sculptoris', name: "Alpha Scl (Carved Marble Bust)", isPrincipal: true, mag: 4.31, isAsterismCore: true },
      { x: 32, y: 48, name: "Beta Scl (Turntable Left)", isAsterismCore: true },
      { x: 68, y: 50, catalogStarId: 'gamma-sculptoris', name: "Gamma Scl (Turntable Right)", mag: 4.41, isAsterismCore: true },
      { x: 44, y: 74, name: "Delta Scl (Studio Tripod Base)", isAsterismCore: true },
      { x: 58, y: 86, name: "Epsilon Scl (Sculptor Mallet)" }
    ],
    lines: [
      [0, 1], [0, 2], [1, 2], [1, 3], [2, 3], [3, 4]
    ],
    asterismLines: [[0, 1], [1, 2], [2, 3], [3, 1]]
  },

  // 75. scutum
  'scutum': {
    mainAsterismName: "The Diamond Battle Shield",
    stars: [
      { x: 50, y: 18, catalogStarId: 'alpha-scuti', name: "Alpha Sct (Shield Top Crest)", isPrincipal: true, mag: 3.83, isAsterismCore: true },
      { x: 26, y: 50, catalogStarId: 'beta-scuti', name: "Beta Sct (Western Shield Rim)", mag: 4.22, isAsterismCore: true },
      { x: 74, y: 50, name: "Gamma Sct (Eastern Shield Rim)", isAsterismCore: true },
      { x: 50, y: 82, catalogStarId: 'delta-scuti', name: "Delta Sct (Shield Point Bottom)", mag: 4.71, isAsterismCore: true },
      { x: 50, y: 50, name: "Epsilon Sct (Central Embossed Boss / Cross)", isAsterismCore: true },
      { x: 62, y: 68, name: "Eta Sct (Lower Decorative Rivet)" }
    ],
    lines: [
      [0, 1], [1, 3], [3, 2], [2, 0], [0, 4], [3, 4], [1, 4], [2, 4], [3, 5]
    ],
    asterismLines: [[0, 1], [1, 3], [3, 2], [2, 0]]
  },

  // 76. serpens
  'serpens': {
    mainAsterismName: "Serpens Caput Triangular Head",
    stars: [
      { x: 24, y: 16, name: "Beta Ser (Serpent Crest)", isAsterismCore: true },
      { x: 18, y: 24, name: "Gamma Ser (Snout)", isAsterismCore: true },
      { x: 30, y: 24, name: "Kappa Ser (Jaw)", isAsterismCore: true },
      { x: 26, y: 38, catalogStarId: 'unukalhai', name: "Unukalhai (Alpha Ser - Cor Serpentis / Heart)", isPrincipal: true, mag: 2.63, isAsterismCore: true },
      { x: 36, y: 52, name: "Mu Ser (Body Coil West)" },
      { x: 64, y: 64, name: "Xi Ser (Body Coil East)" },
      { x: 76, y: 72, name: "Eta Ser (Tail Section)" },
      { x: 86, y: 82, catalogStarId: 'alya', name: "Alya (Theta Ser - Double Star Tail Tip)", mag: 4.03, isAsterismCore: true }
    ],
    lines: [
      [0, 1], [1, 2], [2, 0], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7]
    ],
    asterismLines: [[0, 1], [1, 2], [2, 0], [2, 3]]
  },

  // 77. sextans
  'sextans': {
    mainAsterismName: "Hevelius's Sextant",
    stars: [
      { x: 50, y: 20, catalogStarId: 'alpha-sextantis', name: "Alpha Sex (Pivot Index Apex)", isPrincipal: true, mag: 4.49, isAsterismCore: true },
      { x: 32, y: 68, name: "Gamma Sex (West Scale Sector)", isAsterismCore: true },
      { x: 72, y: 68, catalogStarId: 'beta-sextantis', name: "Beta Sex (East Scale Sector)", mag: 5.08, isAsterismCore: true },
      { x: 52, y: 84, name: "Delta Sex (60-Degree Calibrated Arc)", isAsterismCore: true }
    ],
    lines: [
      [0, 1], [0, 2], [1, 3], [3, 2]
    ],
    asterismLines: [[0, 1], [0, 2], [1, 3], [3, 2]]
  },

  // 78. taurus
  'taurus': {
    mainAsterismName: "The Hyades V & Pleiades",
    stars: [
      { x: 42, y: 48, catalogStarId: 'aldebaran', name: "Aldebaran (Alpha Tau - The Fiery Eye)", isPrincipal: true, mag: 0.85, isAsterismCore: true },
      { x: 36, y: 40, name: "Ain (Epsilon Tau - Northern Eye)", isAsterismCore: true },
      { x: 30, y: 52, name: "Gamma Tau (Bull Snout)", isAsterismCore: true },
      { x: 26, y: 44, name: "Delta Tau (Nose)", isAsterismCore: true },
      { x: 58, y: 16, catalogStarId: 'elnath', name: "Elnath (Beta Tau - Northern Horn Tip)", mag: 1.65, isAsterismCore: true },
      { x: 68, y: 32, catalogStarId: 'tianguan', name: "Tianguan (Zeta Tau - Southern Horn Tip)", mag: 3.01, isAsterismCore: true },
      { x: 14, y: 28, catalogStarId: 'alcyone', name: "Alcyone (Eta Tau / Pleiades M45 - Shoulder Cluster)", mag: 2.87, isAsterismCore: true },
      { x: 36, y: 72, name: "Lambda Tau (Chest)" },
      { x: 26, y: 88, name: "Xi Tau (Front Hoof 1)" },
      { x: 48, y: 86, name: "Omicron Tau (Front Hoof 2)" }
    ],
    lines: [
      [2, 3], [3, 1], [1, 0], [0, 2], [1, 4], [0, 5], [1, 6], [0, 7], [7, 8], [7, 9]
    ],
    asterismLines: [[2, 3], [3, 1], [1, 0], [0, 2], [1, 4], [0, 5]]
  },

  // 79. telescopium
  'telescopium': {
    mainAsterismName: "Herschel's Refractor Tube",
    stars: [
      { x: 50, y: 18, catalogStarId: 'alpha-telescopii', name: "Alpha Tel (Objective Lens)", isPrincipal: true, mag: 3.51, isAsterismCore: true },
      { x: 50, y: 52, catalogStarId: 'zeta-telescopii', name: "Zeta Tel (Center Tube Pivot)", mag: 4.1, isAsterismCore: true },
      { x: 50, y: 84, name: "Epsilon Tel (Eyepiece Mount)", isAsterismCore: true },
      { x: 32, y: 56, name: "Delta Tel (Mounting Strut West)" },
      { x: 68, y: 56, name: "Iota Tel (Mounting Strut East)" }
    ],
    lines: [
      [0, 1], [1, 2], [3, 1], [1, 4]
    ],
    asterismLines: [[0, 1], [1, 2]]
  },

  // 80. triangulum
  'triangulum': {
    mainAsterismName: "The Northern Triangle",
    stars: [
      { x: 50, y: 16, catalogStarId: 'mothallah', name: "Mothallah (Alpha Tri - Apex of Triangle)", mag: 3.41, isAsterismCore: true },
      { x: 26, y: 78, catalogStarId: 'beta-trianguli', name: "Beta Tri (Western Base Star)", isPrincipal: true, mag: 3, isAsterismCore: true },
      { x: 74, y: 78, name: "Gamma Tri (Eastern Base Star)", isAsterismCore: true },
      { x: 60, y: 84, name: "Delta Tri (Base Reinforcement)" }
    ],
    lines: [
      [0, 1], [1, 2], [2, 0], [2, 3]
    ],
    asterismLines: [[0, 1], [1, 2], [2, 0]]
  },

  // 81. triangulum-australe
  'triangulum-australe': {
    mainAsterismName: "The Southern Triangle",
    stars: [
      { x: 50, y: 20, catalogStarId: 'atria', name: "Atria (Alpha TrA - Brilliant Apex)", isPrincipal: true, mag: 1.91, isAsterismCore: true },
      { x: 22, y: 76, catalogStarId: 'betria', name: "Betria (Beta TrA - Southwest Base Star)", mag: 2.85, isAsterismCore: true },
      { x: 78, y: 76, name: "Gatlina (Gamma TrA - Southeast Base Star)", isAsterismCore: true },
      { x: 50, y: 84, name: "Delta TrA (Base Support)" }
    ],
    lines: [
      [0, 1], [1, 2], [2, 0], [1, 3], [3, 2]
    ],
    asterismLines: [[0, 1], [1, 2], [2, 0]]
  },

  // 82. tucana
  'tucana': {
    mainAsterismName: "The Toucan's Great Bill",
    stars: [
      { x: 84, y: 22, catalogStarId: 'beta-tucanae', name: "Beta Tuc (Bill Tip)", mag: 4.36 },
      { x: 68, y: 28, name: "Gamma Tuc (Bill Base)", isAsterismCore: true },
      { x: 50, y: 38, catalogStarId: 'alpha-tucanae', name: "Alpha Tuc (Head & Eye)", isPrincipal: true, mag: 2.86, isAsterismCore: true },
      { x: 40, y: 58, name: "Delta Tuc (Breast / Body)", isAsterismCore: true },
      { x: 26, y: 78, name: "Epsilon Tuc (Tail / Flank)", isAsterismCore: true },
      { x: 22, y: 90, name: "Zeta Tuc (Perched Foot)" }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [1, 3]
    ],
    asterismLines: [[0, 1], [1, 2], [2, 3], [3, 4]]
  },

  // 83. ursa-major
  'ursa-major': {
    mainAsterismName: "The Big Dipper / The Plough",
    stars: [
      { x: 44, y: 36, catalogStarId: 'dubhe', name: "Dubhe (Alpha UMa - Bowl Pointer)", mag: 1.79, isAsterismCore: true },
      { x: 42, y: 52, catalogStarId: 'merak', name: "Merak (Beta UMa - Bowl Pointer)", mag: 2.37, isAsterismCore: true },
      { x: 56, y: 54, catalogStarId: 'phecda', name: "Phecda (Gamma UMa - Bowl Base)", mag: 2.44, isAsterismCore: true },
      { x: 58, y: 38, catalogStarId: 'megrez', name: "Megrez (Delta UMa - Bowl Rim)", mag: 3.31, isAsterismCore: true },
      { x: 70, y: 32, catalogStarId: 'alioth', name: "Alioth (Epsilon UMa - Tail)", isPrincipal: true, mag: 1.77, isAsterismCore: true },
      { x: 80, y: 24, catalogStarId: 'mizar-aa', name: "Mizar & Alcor (Zeta UMa - Tail)", mag: 2.23, isAsterismCore: true },
      { x: 90, y: 16, catalogStarId: 'alkaid', name: "Alkaid (Eta UMa - Tail Tip)", mag: 1.86, isAsterismCore: true },
      { x: 30, y: 28, name: "23 UMa (Bear Neck)" },
      { x: 16, y: 22, catalogStarId: 'muscida', name: "Muscida (Omicron UMa - Bear Snout)", mag: 3.35 },
      { x: 22, y: 14, name: "Pi1 UMa (Bear Ear)" },
      { x: 30, y: 64, name: "Theta UMa (Chest)" },
      { x: 18, y: 74, catalogStarId: 'talitha', name: "Talitha (Iota UMa - Front Claws)" },
      { x: 24, y: 84, name: "Alkaphrah (Kappa UMa - Front Claws)" },
      { x: 62, y: 72, catalogStarId: 'tania-borealis', name: "Tania Borealis (Lambda UMa - Hind Thigh)" },
      { x: 68, y: 84, catalogStarId: 'tania-australis', name: "Tania Australis (Mu UMa - Hind Claws)" },
      { x: 80, y: 68, catalogStarId: 'alula-borealis', name: "Alula Borealis (Nu UMa - Back Leg)" },
      { x: 86, y: 78, catalogStarId: 'alula-australis', name: "Alula Australis (Xi UMa - Back Claws)" }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 6], [0, 7], [7, 8], [8, 9], [7, 9], [1, 10], [10, 11], [11, 12], [2, 13], [13, 14], [4, 15], [15, 16]
    ],
    asterismLines: [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 6]]
  },

  // 84. ursa-minor
  'ursa-minor': {
    mainAsterismName: "The Little Dipper",
    stars: [
      { x: 86, y: 16, catalogStarId: 'polaris', name: "Polaris (Alpha UMi - North Star)", isPrincipal: true, mag: 1.98, isAsterismCore: true },
      { x: 74, y: 26, catalogStarId: 'yildun', name: "Yildun (Delta UMi - Curved Tail)", mag: 4.35, isAsterismCore: true },
      { x: 62, y: 38, name: "Epsilon UMi (Tail Base)", isAsterismCore: true },
      { x: 50, y: 44, name: "Zeta UMi (Bowl Rim East)", isAsterismCore: true },
      { x: 38, y: 56, catalogStarId: 'kochab', name: "Kochab (Beta UMi - Guardian of the Pole)", mag: 2.08, isAsterismCore: true },
      { x: 42, y: 76, catalogStarId: 'pherkad', name: "Pherkad (Gamma UMi - Guardian of the Pole)", mag: 3.05, isAsterismCore: true },
      { x: 54, y: 64, name: "Eta UMi (Bowl Rim West)", isAsterismCore: true },
      { x: 26, y: 48, name: "4 UMi (Bear Snout)" },
      { x: 30, y: 86, name: "5 UMi (Little Bear Paw)" }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3], [4, 7], [5, 8]
    ],
    asterismLines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]]
  },

  // 85. vela
  'vela': {
    mainAsterismName: "The False Cross & Billowing Sails",
    stars: [
      { x: 48, y: 18, catalogStarId: 'alsuhail', name: "Suhail (Lambda Vel - Topmast Gilded Cross)", mag: 2.21, isAsterismCore: true },
      { x: 32, y: 40, catalogStarId: 'alsephina', name: "Alsephina (Delta Vel - False Cross Northwest)", mag: 1.96, isAsterismCore: true },
      { x: 68, y: 42, catalogStarId: 'markeb', name: "Markeb (Kappa Vel - False Cross Southeast)", mag: 2.47, isAsterismCore: true },
      { x: 42, y: 68, catalogStarId: 'regor', name: "Regor (Gamma Vel - Wolf-Rayet Jewel)", isPrincipal: true, mag: 1.78, isAsterismCore: true },
      { x: 74, y: 68, name: "Mu Vel (Canvas Clew Line)", isAsterismCore: true },
      { x: 24, y: 74, name: "Phi Vel (Outer Sail Tack)" }
    ],
    lines: [
      [0, 1], [0, 2], [1, 2], [1, 3], [2, 4], [3, 4], [3, 5], [1, 5]
    ],
    asterismLines: [[1, 2], [1, 3], [2, 4], [3, 4]]
  },

  // 86. virgo
  'virgo': {
    mainAsterismName: "The Maiden's Gown & Spica",
    stars: [
      { x: 62, y: 72, catalogStarId: 'spica', name: "Spica (Alpha Vir - Ear of Wheat)", isPrincipal: true, mag: 0.98, isAsterismCore: true },
      { x: 48, y: 50, catalogStarId: 'gamma-virginis-a', name: "Porrima (Gamma Vir - Waist / Girdle)", mag: 3.48, isAsterismCore: true },
      { x: 36, y: 32, name: "Zaniah (Eta Vir - Shoulder)", isAsterismCore: true },
      { x: 24, y: 22, catalogStarId: 'zavijava', name: "Zavijava (Beta Vir - Maiden Head & Crown)", mag: 3.61, isAsterismCore: true },
      { x: 58, y: 28, catalogStarId: 'vindemiatrix', name: "Vindemiatrix (Epsilon Vir - Outspread Wing)", mag: 2.83, isAsterismCore: true },
      { x: 64, y: 52, catalogStarId: 'heze', name: "Heze (Zeta Vir - Gown Drapery)", mag: 3.38, isAsterismCore: true },
      { x: 76, y: 78, name: "Syrma (Iota Vir - Flowing Hem of Dress)" },
      { x: 38, y: 64, name: "Theta Vir (Left Arm Holding Sheaf)" },
      { x: 84, y: 84, name: "Rijl al Awwa (Mu Vir - Foot)" }
    ],
    lines: [
      [3, 2], [2, 1], [1, 4], [1, 5], [5, 0], [1, 7], [7, 0], [0, 6], [6, 8]
    ],
    asterismLines: [[3, 2], [2, 1], [1, 4], [1, 5], [5, 0]]
  },

  // 87. volans
  'volans': {
    mainAsterismName: "Aerodynamic Flying Wings",
    stars: [
      { x: 50, y: 18, name: "Gamma Vol (Fish Snout)", isAsterismCore: true },
      { x: 50, y: 44, name: "Alpha Vol (Thorax / Wing Pivot)", isAsterismCore: true },
      { x: 22, y: 40, catalogStarId: 'beta-volantis', name: "Beta Vol (West Flying Wingtip)", isPrincipal: true, mag: 3.77, isAsterismCore: true },
      { x: 78, y: 40, name: "Delta Vol (East Flying Wingtip)", isAsterismCore: true },
      { x: 50, y: 72, name: "Epsilon Vol (Body Flank)", isAsterismCore: true },
      { x: 38, y: 88, name: "Zeta Vol (Tail Fin Fluke West)" },
      { x: 62, y: 88, name: "Kappa Vol (Tail Fin Fluke East)" }
    ],
    lines: [
      [0, 1], [1, 4], [1, 2], [1, 3], [4, 5], [4, 6], [5, 6]
    ],
    asterismLines: [[0, 1], [1, 2], [1, 3], [1, 4]]
  },

  // 88. vulpecula
  'vulpecula': {
    mainAsterismName: "Anser & The Prowling Fox",
    stars: [
      { x: 28, y: 48, catalogStarId: 'anser', name: "Anser (Alpha Vul - The Goose in Fox Muzzle)", isPrincipal: true, mag: 4.44, isAsterismCore: true },
      { x: 38, y: 34, name: "13 Vul (Fox Ears & Crown)" },
      { x: 48, y: 48, catalogStarId: '15-vulpeculae', name: "15 Vul (Fox Shoulder)", mag: 4.66, isAsterismCore: true },
      { x: 66, y: 48, name: "23 Vul (Prowling Spine / Back)", isAsterismCore: true },
      { x: 84, y: 36, name: "31 Vul (Bushy Fox Tail)" },
      { x: 42, y: 72, name: "21 Vul (Front Paws)" },
      { x: 70, y: 70, name: "29 Vul (Hind Paws)" }
    ],
    lines: [
      [0, 1], [1, 2], [0, 2], [2, 3], [3, 4], [2, 5], [3, 6]
    ],
    asterismLines: [[0, 2], [2, 3], [3, 4]]
  }
};
