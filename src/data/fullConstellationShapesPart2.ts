import { ConstellationShape } from './constellationsCore';

// Part 2 of constellation stick figures (constellations 45 to 88)
export const FULL_CONSTELLATION_SHAPES_PART_2: Record<string, ConstellationShape> = {
  // 45. lacerta
'lacerta': {
    mainAsterismName: "Little Cassiopeia / Lizard's Spine",
    stars: [
      { ra: 22.3927, dec: 52.229, catalogStarId: 'beta-lacertae', name: "Beta Lac (Snout & Head)", mag: 4.43 },
      { ra: 22.5215, dec: 50.2825, catalogStarId: 'alpha-lacertae', name: "Alpha Lac (Shoulders)", isPrincipal: true, mag: 3.77, isAsterismCore: true },
      { ra: 22.4086, dec: 49.4764, name: "4 Lac (Front Left Claw)" },
      { ra: 22.4922, dec: 47.7069, name: "5 Lac (Front Right Claw)" },
      { ra: 22.2662, dec: 37.7487, name: "1 Lac (Mid Spine)", isAsterismCore: true },
      { ra: 22.3504, dec: 46.5366, name: "2 Lac (Lower Back)", isAsterismCore: true },
      { ra: 22.5081, dec: 43.1234, name: "6 Lac (Hind Left Claw)" },
      { ra: 22.6752, dec: 44.2763, name: "11 Lac (Hind Right Claw)" },
      { ra: 22.6913, dec: 40.2254, name: "12 Lac (Curled Tail Tip)" }
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
      { ra: 10.1395, dec: 11.9672, catalogStarId: 'regulus', name: "Regulus (Alpha Leo - Heart)", isPrincipal: true, mag: 1.36, isAsterismCore: true },
      { ra: 10.1222, dec: 16.7627, name: "Eta Leo (Chest)", isAsterismCore: true },
      { ra: 10.3329, dec: 19.8415, catalogStarId: 'algieba', name: "Algieba (Gamma Leo - Mane Crest)", mag: 2.08, isAsterismCore: true },
      { ra: 10.2782, dec: 23.4173, name: "Adhafera (Zeta Leo - Top of Mane)", isAsterismCore: true },
      { ra: 9.7642, dec: 23.7743, name: "Ras Elased (Epsilon Leo - Muzzle)", isAsterismCore: true },
      { ra: 9.5287, dec: 22.968, catalogStarId: 'alterf', name: "Alterf (Lambda Leo - Nose Tip)" },
      { ra: 11.2351, dec: 20.5237, catalogStarId: 'zosma', name: "Zosma (Delta Leo - Back / Rump)", mag: 2.56, isAsterismCore: true },
      { ra: 11.2373, dec: 15.4296, catalogStarId: 'chertan', name: "Chertan (Theta Leo - Flank)", isAsterismCore: true },
      { ra: 11.8177, dec: 14.5721, catalogStarId: 'denebola', name: "Denebola (Beta Leo - Lion Tail Tuft)", mag: 2.14, isAsterismCore: true },
      { ra: 9.6858, dec: 9.8923, catalogStarId: 'subra', name: "Subra (Omicron Leo - Front Paws)" },
      { ra: 10.5469, dec: 9.3066, name: "Rho Leo (Hind Paws)" }
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
      { ra: 10.8885, dec: 34.2149, catalogStarId: 'praecipua', name: "Praecipua (46 LMi - Cub Head)", isPrincipal: true, mag: 3.83, isAsterismCore: true },
      { ra: 10.4647, dec: 36.7072, catalogStarId: 'beta-leonis-minoris', name: "Beta LMi (Back / Spine)", mag: 4.21, isAsterismCore: true },
      { ra: 10.1238, dec: 35.2447, name: "21 LMi (Cub Tail)", isAsterismCore: true },
      { ra: 9.5704, dec: 36.3976, name: "10 LMi (Cub Paws)" },
      { ra: 10.4319, dec: 33.7961, name: "30 LMi (Chest)" }
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
      { ra: 5.091, dec: -22.371, name: "Epsilon Lep (West Ear)" },
      { ra: 5.2155, dec: -16.2055, name: "Mu Lep (East Ear)" },
      { ra: 5.7826, dec: -14.822, name: "Zeta Lep (Head & Eye)" },
      { ra: 5.5455, dec: -17.8223, catalogStarId: 'arneb', name: "Arneb (Alpha Lep - Hare Heart)", isPrincipal: true, mag: 2.58, isAsterismCore: true },
      { ra: 5.4708, dec: -20.7594, catalogStarId: 'nihal', name: "Nihal (Beta Lep - Belly)", mag: 2.81, isAsterismCore: true },
      { ra: 5.7411, dec: -22.4484, name: "Gamma Lep (Flank)", isAsterismCore: true },
      { ra: 5.8554, dec: -20.8791, name: "Delta Lep (Hind Paw)", isAsterismCore: true },
      { ra: 5.9401, dec: -14.1677, name: "Eta Lep (Front Paw)" },
      { ra: 6.1026, dec: -14.9353, name: "Theta Lep (Cotton Tail)" }
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
      { ra: 15.5921, dec: -14.7895, name: "Zubenelakrab (Gamma Lib - Beam Pivot & Tongue)", isAsterismCore: true },
      { ra: 15.2834, dec: -9.3829, catalogStarId: 'zubeneschamali', name: "Zubeneschamali (Beta Lib - Northern Scale Pan)", isPrincipal: true, mag: 2.61, isAsterismCore: true },
      { ra: 14.848, dec: -16.0418, catalogStarId: 'zubenelgenubi', name: "Zubenelgenubi (Alpha Lib - Southern Scale Pan)", mag: 2.75, isAsterismCore: true },
      { ra: 15.0678, dec: -25.282, catalogStarId: 'brachium', name: "Brachium (Sigma Lib - Pan Weight South)", mag: 3.25, isAsterismCore: true },
      { ra: 15.8971, dec: -16.7293, name: "Theta Lib (Suspension Cord West)" },
      { ra: 15.6171, dec: -28.1351, name: "Upsilon Lib (Suspension Cord East)" },
      { ra: 15.6443, dec: -29.7777, name: "Tau Lib (Plumb Bob)" }
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
      { ra: 14.6988, dec: -47.3882, catalogStarId: 'men-alpha-lupi', name: "Men (Alpha Lup - Wolf Eye)", isPrincipal: true, mag: 2.3, isAsterismCore: true },
      { ra: 14.9755, dec: -43.134, catalogStarId: 'ke-kouan', name: "Ke Kouan (Beta Lup - Snout & Fangs)", mag: 2.68, isAsterismCore: true },
      { ra: 15.5857, dec: -41.1668, name: "Gamma Lup (Ears)" },
      { ra: 15.3562, dec: -40.6475, name: "Delta Lup (Chest / Shoulder)", isAsterismCore: true },
      { ra: 15.378, dec: -44.6896, name: "Epsilon Lup (Front Paws)" },
      { ra: 15.2047, dec: -52.0992, name: "Zeta Lup (Back / Spine)", isAsterismCore: true },
      { ra: 16.002, dec: -38.3967, name: "Eta Lup (Hind Leg & Claws)", isAsterismCore: true },
      { ra: 16.1099, dec: -36.8023, name: "Theta Lup (Bushy Tail)" }
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
      { ra: 9.3509, dec: 34.3926, catalogStarId: 'alpha-lyncis', name: "Elvashak (Alpha Lyn - Lynx Eye)", isPrincipal: true, mag: 3.13, isAsterismCore: true },
      { ra: 9.3141, dec: 36.8026, name: "38 Lyn (Tufted Ears)" },
      { ra: 8.3806, dec: 43.1881, catalogStarId: 'alsciaukat', name: "31 Lyn (Forequarters)", mag: 4.25, isAsterismCore: true },
      { ra: 7.4452, dec: 49.2115, name: "21 Lyn (Arched Spine)", isAsterismCore: true },
      { ra: 6.6434, dec: 61.4777, name: "10 Lyn (Flank)", isAsterismCore: true },
      { ra: 6.327, dec: 59.011, name: "2 Lyn (Hind Leg & Paw)" },
      { ra: 6.9546, dec: 58.4228, name: "15 Lyn (Front Paw)" }
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
      { ra: 18.6156, dec: 38.7837, catalogStarId: 'vega', name: "Vega (Alpha Lyr - Brilliant Jewel)", isPrincipal: true, mag: 0.03, isAsterismCore: true },
      { ra: 18.739, dec: 39.6701, name: "Epsilon Lyr (The Double-Double Ear)", isAsterismCore: true },
      { ra: 18.7462, dec: 37.6051, name: "Zeta Lyr (Tuning Peg West)", isAsterismCore: true },
      { ra: 18.9084, dec: 36.8986, name: "Delta2 Lyr (Tuning Peg East)", isAsterismCore: true },
      { ra: 18.8347, dec: 33.3627, catalogStarId: 'sheliak', name: "Sheliak (Beta Lyr - Resonating Box Corner)", mag: 3.52, isAsterismCore: true },
      { ra: 18.9824, dec: 32.6896, catalogStarId: 'sulafat', name: "Sulafat (Gamma Lyr - Sounding Box Base)", mag: 3.25, isAsterismCore: true },
      { ra: 19.2293, dec: 39.146, name: "Eta Lyr (Lyre Arm Strut)" }
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
      { ra: 6.1707, dec: -74.753, catalogStarId: 'alpha-mensae', name: "Alpha Men (Summit Plateau Peak)", isPrincipal: true, mag: 5.09, isAsterismCore: true },
      { ra: 5.5313, dec: -76.3409, catalogStarId: 'gamma-mensae', name: "Gamma Men (Eastern Cliff Rim)", mag: 5.18, isAsterismCore: true },
      { ra: 5.0453, dec: -71.3143, name: "Beta Men (Western Precipice)", isAsterismCore: true },
      { ra: 4.9198, dec: -74.9369, name: "Eta Men (Talus Slope)" },
      { ra: 4.7178, dec: -70.931, name: "Mu Men (Table Valley Base)" }
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
      { ra: 20.8328, dec: -33.7797, catalogStarId: 'alpha-microscopii', name: "Alpha Mic (Eyepiece Tube)", mag: 4.89, isAsterismCore: true },
      { ra: 21.0215, dec: -32.2577, catalogStarId: 'gamma-microscopii', name: "Gamma Mic (Coarse Adjustment Dial)", isPrincipal: true, mag: 4.67, isAsterismCore: true },
      { ra: 21.299, dec: -32.1725, name: "Epsilon Mic (Objective Lens Barrel)", isAsterismCore: true },
      { ra: 21.346, dec: -40.8096, name: "Theta Mic (Specimen Stage Rest)" },
      { ra: 20.8663, dec: -33.178, name: "Beta Mic (Horseshoe Base Stand)" }
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
      { ra: 6.4803, dec: -7.0331, catalogStarId: 'beta-monocerotis', name: "Beta Mon (Triple Star Spiraling Horn)", isPrincipal: true, mag: 3.74, isAsterismCore: true },
      { ra: 7.1977, dec: -0.4928, name: "Delta Mon (Muzzle / Head)" },
      { ra: 7.6875, dec: -9.5511, catalogStarId: 'alpha-monocerotis', name: "Alpha Mon (Heart / Withers)", mag: 3.94, isAsterismCore: true },
      { ra: 6.2476, dec: -6.2748, name: "Gamma Mon (Flank / Spine)", isAsterismCore: true },
      { ra: 8.1432, dec: -2.9838, name: "Zeta Mon (Rump & Tail)", isAsterismCore: true },
      { ra: 6.3962, dec: 4.5956, name: "Epsilon Mon (Front Hooves)" },
      { ra: 6.5484, dec: 7.333, name: "13 Mon (Hind Hooves)" }
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
      { ra: 12.6197, dec: -69.1356, catalogStarId: 'alpha-muscae', name: "Alpha Mus (Head / Compound Eyes)", isPrincipal: true, mag: 2.69, isAsterismCore: true },
      { ra: 12.7713, dec: -68.1081, catalogStarId: 'beta-muscae', name: "Beta Mus (Thorax Joint)", mag: 3.04, isAsterismCore: true },
      { ra: 12.5411, dec: -72.133, name: "Gamma Mus (West Wingtip)", isAsterismCore: true },
      { ra: 13.0378, dec: -71.5489, name: "Delta Mus (East Wingtip)", isAsterismCore: true },
      { ra: 12.2929, dec: -67.9607, name: "Epsilon Mus (Abdomen Tip)", isAsterismCore: true },
      { ra: 11.804, dec: -66.8149, name: "Mu Mus (Abdomen Flank)" }
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
      { ra: 16.3307, dec: -50.1555, catalogStarId: 'gamma-2-normae', name: "Gamma2 Nor (Right-Angle Rule Arm)", isPrincipal: true, mag: 4.02, isAsterismCore: true },
      { ra: 16.1082, dec: -45.1733, name: "Delta Nor (Corner Junction Apex)", isAsterismCore: true },
      { ra: 16.4531, dec: -47.5548, name: "Epsilon Nor (Leveling Leg Base)", isAsterismCore: true },
      { ra: 16.0536, dec: -49.2297, name: "Eta Nor (Plumb Bob Anchor)" },
      { ra: 16.0589, dec: -57.7751, name: "Iota1 Nor (Measuring Foot)" }
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
      { ra: 21.6913, dec: -77.39, catalogStarId: 'nu-octantis', name: "Nu Oct (Index Pivot Mirror)", mag: 3.73, isAsterismCore: true },
      { ra: 22.7676, dec: -81.3816, name: "Beta Oct (West Arc Arm)", isAsterismCore: true },
      { ra: 21.0786, dec: -77.0238, name: "Alpha Oct (East Arc Arm)", isAsterismCore: true },
      { ra: 21.1464, dec: -88.9565, catalogStarId: 'polaris-australis', name: "Polaris Australis (Sigma Oct - True South Celestial Pole)", isPrincipal: true, mag: 5.47, isAsterismCore: true },
      { ra: 14.4487, dec: -83.6679, name: "Delta Oct (Graduated Vernier Arc)" }
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
      { ra: 17.5822, dec: 12.56, catalogStarId: 'rasalhague', name: "Rasalhague (Alpha Oph - Head of Healer)", isPrincipal: true, mag: 2.08, isAsterismCore: true },
      { ra: 17.7245, dec: 4.5673, catalogStarId: 'cebalrai', name: "Cebalrai (Beta Oph - Right Shoulder)", isAsterismCore: true },
      { ra: 16.9611, dec: 9.375, name: "Kappa Oph (Left Shoulder)", isAsterismCore: true },
      { ra: 16.2391, dec: -3.6943, catalogStarId: 'yed-prior', name: "Yed Prior (Delta Oph - West Hand clutching Serpens Caput)", isAsterismCore: true },
      { ra: 16.3054, dec: -4.6925, catalogStarId: 'yed-posterior', name: "Yed Posterior (Epsilon Oph - West Wrist)" },
      { ra: 16.5152, dec: 1.9839, catalogStarId: 'marfik', name: "Marfik (Lambda Oph - East Hand clutching Serpens Cauda)" },
      { ra: 17.173, dec: -15.7249, catalogStarId: 'sabik', name: "Sabik (Eta Oph - Right Knee / Foot)", mag: 2.43, isAsterismCore: true },
      { ra: 16.6193, dec: -10.5671, catalogStarId: 'han', name: "Han (Zeta Oph - Left Knee / Foot)", mag: 2.57, isAsterismCore: true },
      { ra: 17.3668, dec: -24.9995, name: "Theta Oph (Right Foot on Scorpion Stinger)" },
      { ra: 16.519, dec: -16.6127, name: "Phi Oph (Left Foot on Antares)" }
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
      { ra: 5.9195, dec: 7.4071, catalogStarId: 'betelgeuse', name: "Betelgeuse (Alpha Ori - Red Supergiant Shoulder)", mag: 0.5, isAsterismCore: true },
      { ra: 5.4189, dec: 6.3497, catalogStarId: 'bellatrix', name: "Bellatrix (Gamma Ori - Left Shoulder)", mag: 1.64, isAsterismCore: true },
      { ra: 5.5856, dec: 9.9342, catalogStarId: 'meissa', name: "Meissa (Lambda Ori - Head of the Hunter)", mag: 3.39 },
      { ra: 5.6793, dec: -1.9426, catalogStarId: 'alnitak', name: "Alnitak (Zeta Ori - Belt East)", mag: 1.77, isAsterismCore: true },
      { ra: 5.6036, dec: -1.2019, catalogStarId: 'alnilam', name: "Alnilam (Epsilon Ori - Belt Center)", mag: 1.69, isAsterismCore: true },
      { ra: 5.5334, dec: -0.2991, catalogStarId: 'mintaka', name: "Mintaka (Delta Ori - Belt West)", mag: 2.23, isAsterismCore: true },
      { ra: 5.588, dec: -5.3876, name: "Great Orion Nebula (M42 / Theta Ori - Sword)", isAsterismCore: true },
      { ra: 5.7959, dec: -9.6696, catalogStarId: 'saiph', name: "Saiph (Kappa Ori - Right Knee)", mag: 2.07, isAsterismCore: true },
      { ra: 5.2423, dec: -8.2016, catalogStarId: 'rigel', name: "Rigel (Beta Ori - Brilliant Left Foot)", isPrincipal: true, mag: 0.13, isAsterismCore: true },
      { ra: 6.0397, dec: 9.6473, name: "Mu Ori (Club Arm)" },
      { ra: 5.9064, dec: 20.2762, name: "Chi1 Ori (Raised Club Knot)" },
      { ra: 4.9149, dec: 10.1508, name: "Pi1 Ori (Shield Top)" },
      { ra: 4.8435, dec: 8.9002, name: "Pi2 Ori (Shield Upper)" },
      { ra: 4.8307, dec: 6.9613, catalogStarId: 'tabit', name: "Tabit (Pi3 Ori - Shield Center)" },
      { ra: 4.8534, dec: 5.6051, name: "Pi4 Ori (Shield Lower)" },
      { ra: 4.9042, dec: 2.4407, name: "Pi5 Ori (Shield Bottom)" }
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
      { ra: 20.4275, dec: -56.7351, catalogStarId: 'peacock', name: "Peacock (Alpha Pav - Brilliant Eye)", isPrincipal: true, mag: 1.94, isAsterismCore: true },
      { ra: 20.7493, dec: -66.2032, name: "Beta Pav (Breast)", isAsterismCore: true },
      { ra: 21.4407, dec: -65.3662, name: "Gamma Pav (Left Wing Plume)", isAsterismCore: true },
      { ra: 20.1454, dec: -66.1821, catalogStarId: 'delta-pavonis', name: "Delta Pav (Right Wing Plume)", mag: 3.56, isAsterismCore: true },
      { ra: 20.0099, dec: -72.9105, name: "Epsilon Pav (Outer Left Fan Feather)" },
      { ra: 18.7173, dec: -71.4281, name: "Zeta Pav (Center Left Plume)" },
      { ra: 17.7622, dec: -64.7239, name: "Eta Pav (Center Right Plume)" },
      { ra: 18.8703, dec: -62.1876, name: "Lambda Pav (Outer Right Fan Feather)" }
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
      { ra: 23.0793, dec: 15.2053, catalogStarId: 'markab', name: "Markab (Alpha Peg - Southwest Corner)", mag: 2.48, isAsterismCore: true },
      { ra: 23.0629, dec: 28.0828, catalogStarId: 'scheat', name: "Scheat (Beta Peg - Northwest Corner)", mag: 2.42, isAsterismCore: true },
      { ra: 0.1398, dec: 29.0904, catalogStarId: 'alpheratz', name: "Alpheratz (Alpha And - Northeast Corner)", mag: 2.06, isAsterismCore: true },
      { ra: 0.2206, dec: 15.1836, catalogStarId: 'algenib', name: "Algenib (Gamma Peg - Southeast Corner)", mag: 2.84, isAsterismCore: true },
      { ra: 22.691, dec: 10.8314, catalogStarId: 'homam', name: "Homam (Zeta Peg - Neck Base)" },
      { ra: 22.17, dec: 6.1979, name: "Baham (Theta Peg - Forehead)" },
      { ra: 21.7364, dec: 9.875, catalogStarId: 'enif', name: "Enif (Epsilon Peg - Muzzle & Nose)", isPrincipal: true, mag: 2.39, isAsterismCore: true },
      { ra: 22.7167, dec: 30.2212, catalogStarId: 'matar', name: "Matar (Eta Peg - Front Knee)" },
      { ra: 22.1665, dec: 33.1782, name: "Pi Peg (Front Hoof 1)" },
      { ra: 22.1169, dec: 25.3451, name: "Iota Peg (Front Hoof 2)" }
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
      { ra: 3.4054, dec: 49.8612, catalogStarId: 'mirfak', name: "Mirfak (Alpha Per - Heart / Torso)", isPrincipal: true, mag: 1.79, isAsterismCore: true },
      { ra: 3.1361, dec: 40.9556, catalogStarId: 'algol-a', name: "Algol (Beta Per - Gorgon Medusa Eye)", mag: 2.12, isAsterismCore: true },
      { ra: 3.08, dec: 53.5065, name: "Gamma Per (Warrior Helmet Crest)" },
      { ra: 2.8449, dec: 55.8955, name: "Eta Per (Raised Diamond Sword Tip)" },
      { ra: 3.7154, dec: 47.7875, name: "Delta Per (Body Flank)", isAsterismCore: true },
      { ra: 3.9642, dec: 40.0102, name: "Epsilon Per (Right Thigh)", isAsterismCore: true },
      { ra: 3.9828, dec: 35.791, catalogStarId: 'menkib', name: "Menkib (Xi Per - Winged Sandal West)" },
      { ra: 3.9022, dec: 31.8836, catalogStarId: 'atik', name: "Zeta Per (Winged Sandal East)", mag: 2.85, isAsterismCore: true },
      { ra: 3.0863, dec: 38.8403, name: "Rho Per (Serpent Hair of Medusa)" }
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
      { ra: 0.4381, dec: -42.306, catalogStarId: 'ankaa', name: "Ankaa (Alpha Phe - Heart of the Firebird)", isPrincipal: true, mag: 2.39, isAsterismCore: true },
      { ra: 1.5209, dec: -49.0727, name: "Delta Phe (Golden Crest & Beak)" },
      { ra: 1.1014, dec: -46.7184, catalogStarId: 'tiaki-phe', name: "Beta Phe (Western Flaming Wingtip)", mag: 3.32, isAsterismCore: true },
      { ra: 1.4728, dec: -43.3182, name: "Gamma Phe (Eastern Flaming Wingtip)", isAsterismCore: true },
      { ra: 0.1568, dec: -45.7474, name: "Epsilon Phe (Tail Plume West)", isAsterismCore: true },
      { ra: 1.1397, dec: -55.2458, name: "Zeta Phe (Tail Plume East)", isAsterismCore: true },
      { ra: 1.2531, dec: -45.5317, name: "Nu Phe (Trailing Fire Tail)" }
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
      { ra: 6.8032, dec: -61.9414, catalogStarId: 'alpha-pictoris', name: "Alpha Pic (Easel Apex Clamp)", isPrincipal: true, mag: 3.27, isAsterismCore: true },
      { ra: 5.8305, dec: -56.1667, name: "Gamma Pic (Left Shelf Leg)", isAsterismCore: true },
      { ra: 5.7881, dec: -51.0665, catalogStarId: 'beta-pictoris', name: "Beta Pic (Famous Exoplanet Disk - Right Shelf Leg)", mag: 3.86, isAsterismCore: true },
      { ra: 6.1716, dec: -54.9686, name: "Delta Pic (Left Tripod Foot)" },
      { ra: 5.3228, dec: -50.606, name: "Zeta Pic (Right Tripod Foot)" },
      { ra: 5.0469, dec: -49.1514, name: "Eta Pic (Rear Strut Foot)" }
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
      { ra: 2.0341, dec: 2.7638, catalogStarId: 'alrescha', name: "Alrescha (Alpha Psc - The Ribbon Knot)", mag: 3.82, isAsterismCore: true },
      { ra: 1.7566, dec: 9.1578, name: "Omicron Psc (Northern Cord)" },
      { ra: 1.5247, dec: 15.3458, catalogStarId: 'alpherg', name: "Eta Psc (North Fish Tail)", isPrincipal: true, mag: 3.62 },
      { ra: 23.0646, dec: 3.82, name: "Beta Psc (Fumalsamakah - North Fish Mouth)", mag: 4.48, isAsterismCore: true },
      { ra: 23.2861, dec: 3.2823, name: "Gamma Psc (North Fish Belly)" },
      { ra: 0.8114, dec: 7.5851, name: "Delta Psc (Western Cord)" },
      { ra: 1.0491, dec: 7.8901, name: "Epsilon Psc (Mid Cord)" },
      { ra: 23.4661, dec: 6.379, name: "Theta Psc (Circlet South)", mag: 4.27, isAsterismCore: true },
      { ra: 23.6658, dec: 5.6263, name: "Iota Psc (Circlet West)", isAsterismCore: true },
      { ra: 23.7008, dec: 1.78, name: "Lambda Psc (Circlet North)", isAsterismCore: true },
      { ra: 23.4489, dec: 1.2556, name: "Kappa Psc (Circlet East)", isAsterismCore: true },
      { ra: 23.2861, dec: 3.2823, name: "Gamma Psc (Circlet Base)", isAsterismCore: true }
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
      { ra: 22.9608, dec: -29.6222, catalogStarId: 'fomalhaut', name: "Fomalhaut (Alpha PsA - Fish Mouth)", isPrincipal: true, mag: 1.16, isAsterismCore: true },
      { ra: 22.6776, dec: -27.0436, name: "Epsilon PsA (Dorsal Fin)", isAsterismCore: true },
      { ra: 22.9325, dec: -32.5396, catalogStarId: 'delta-piscis-austrini', name: "Delta PsA (Upper Body)", mag: 4.2, isAsterismCore: true },
      { ra: 22.8754, dec: -32.8755, name: "Gamma PsA (Tail Peduncle)", isAsterismCore: true },
      { ra: 22.5251, dec: -32.3461, name: "Beta PsA (Upper Fluke)", isAsterismCore: true },
      { ra: 21.7491, dec: -33.0258, name: "Iota PsA (Lower Fluke)" },
      { ra: 21.7956, dec: -30.8983, name: "Theta PsA (Fish Belly)" }
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
      { ra: 8.1257, dec: -24.3043, catalogStarId: 'tureis', name: "Tureis (Rho Pup - Aft Mast)", mag: 2.81, isAsterismCore: true },
      { ra: 7.4872, dec: -43.3014, name: "Sigma Pup (Upper Transom)", isAsterismCore: true },
      { ra: 7.8216, dec: -24.8598, name: "Xi Pup (Captain Bridge Deck)", isAsterismCore: true },
      { ra: 7.2857, dec: -37.0975, name: "Pi Pup (Poop Deck Railing)" },
      { ra: 8.0597, dec: -40.0031, catalogStarId: 'zeta-puppis', name: "Naos (Zeta Pup - Blazing Supergiant Hull)", isPrincipal: true, mag: 2.25, isAsterismCore: true },
      { ra: 7.6472, dec: -26.8038, name: "k Pup (Stern Keel Foot)" }
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
      { ra: 8.7265, dec: -33.1864, catalogStarId: 'alpha-pyxidis', name: "Alpha Pyx (Needle North Point)", isPrincipal: true, mag: 3.68, isAsterismCore: true },
      { ra: 8.6684, dec: -35.3084, catalogStarId: 'beta-pyxidis', name: "Beta Pyx (Magnetic Gimbal Pivot)", mag: 3.97, isAsterismCore: true },
      { ra: 8.8422, dec: -27.7098, name: "Gamma Pyx (Needle South Point)", isAsterismCore: true },
      { ra: 8.9254, dec: -27.6818, name: "Delta Pyx (East Azimuth Card)" },
      { ra: 9.3582, dec: -25.9654, name: "Theta Pyx (West Azimuth Card)" }
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
      { ra: 4.2404, dec: -62.4738, catalogStarId: 'alpha-reticuli', name: "Alpha Ret (North Diamond Apex)", isPrincipal: true, mag: 3.33, isAsterismCore: true },
      { ra: 3.7367, dec: -64.8069, catalogStarId: 'beta-reticuli', name: "Beta Ret (West Crosshair Vertex)", mag: 3.84, isAsterismCore: true },
      { ra: 4.0149, dec: -62.1593, name: "Gamma Ret (East Crosshair Vertex)", isAsterismCore: true },
      { ra: 3.9791, dec: -61.4002, name: "Delta Ret (South Diamond Apex)", isAsterismCore: true },
      { ra: 4.2747, dec: -59.3022, name: "Epsilon Ret (Central Optical Crosshair)", isAsterismCore: true }
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
      { ra: 19.6683, dec: 18.0139, catalogStarId: 'sham', name: "Sham (Alpha Sge - Upper Fletching Feather)", mag: 4.38, isAsterismCore: true },
      { ra: 19.6841, dec: 17.476, name: "Beta Sge (Lower Fletching Feather)", isAsterismCore: true },
      { ra: 20.1657, dec: 20.915, name: "Theta Sge (Arrow Nock & Crest)" },
      { ra: 19.7898, dec: 18.5343, name: "Delta Sge (Slender Wooden Shaft)", isAsterismCore: true },
      { ra: 19.9793, dec: 19.4921, catalogStarId: 'gamma-sagittae', name: "Gamma Sge (Barbed Arrowhead)", isPrincipal: true, mag: 3.47, isAsterismCore: true },
      { ra: 20.086, dec: 19.9911, name: "Eta Sge (Upper Barb Tip)" }
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
      { ra: 18.4029, dec: -34.3846, catalogStarId: 'kaus-australis', name: "Kaus Australis (Epsilon Sgr - South Bow)", isPrincipal: true, mag: 1.85, isAsterismCore: true },
      { ra: 18.3499, dec: -29.8281, catalogStarId: 'kaus-media', name: "Kaus Media (Delta Sgr - Bow Center)", mag: 2.72, isAsterismCore: true },
      { ra: 18.4662, dec: -25.4217, catalogStarId: 'kaus-borealis', name: "Kaus Borealis (Lambda Sgr - Teapot Lid Peak)", mag: 2.82, isAsterismCore: true },
      { ra: 18.9211, dec: -26.2967, catalogStarId: 'nunki', name: "Nunki (Sigma Sgr - Teapot Handle Top)", mag: 2.05, isAsterismCore: true },
      { ra: 19.0435, dec: -29.8801, catalogStarId: 'ascella', name: "Ascella (Zeta Sgr - Teapot Handle Bottom)", isAsterismCore: true },
      { ra: 18.0968, dec: -30.4241, catalogStarId: 'alnasl', name: "Alnasl (Gamma Sgr - Teapot Spout / Arrowhead)", isAsterismCore: true },
      { ra: 19.1627, dec: -21.0236, name: "Albaldah (Pi Sgr - Archer Head)" },
      { ra: 19.2939, dec: -18.9529, name: "d Sgr (Helmet Crest)" },
      { ra: 19.9307, dec: -26.2994, catalogStarId: 'terebellum-omega', name: "Omega Sgr (Terebellum 1)" },
      { ra: 19.9491, dec: -27.1699, name: "59 Sgr (Terebellum 2)" },
      { ra: 19.9826, dec: -26.1958, name: "60 Sgr (Terebellum 3)" },
      { ra: 19.3981, dec: -40.6159, catalogStarId: 'rukbat', name: "Rukbat (Alpha Sgr - Front Hoof)" },
      { ra: 19.3773, dec: -44.459, catalogStarId: 'arkab-prior', name: "Arkab Prior (Beta1 Sgr - Hind Hoof)" }
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
      { ra: 16.0906, dec: -19.8054, catalogStarId: 'acrab', name: "Acrab / Graffias (Beta Sco - North Claw)", mag: 2.62, isAsterismCore: true },
      { ra: 16.0056, dec: -22.6217, catalogStarId: 'dschubba', name: "Dschubba (Delta Sco - Scorpion Forehead)", mag: 2.29, isAsterismCore: true },
      { ra: 15.9809, dec: -26.1141, name: "Pi Sco (South Claw)", isAsterismCore: true },
      { ra: 16.4901, dec: -26.432, catalogStarId: 'antares', name: "Antares (Alpha Sco - Rival of Mars)", isPrincipal: true, mag: 0.96, isAsterismCore: true },
      { ra: 16.598, dec: -28.216, name: "Tau Sco (Chest Plate)" },
      { ra: 16.8361, dec: -34.2932, catalogStarId: 'larawag', name: "Larawag (Epsilon Sco - Upper Abdomen)", isAsterismCore: true },
      { ra: 16.8645, dec: -38.0473, name: "Mu Sco (Mid Tail Curve)", isAsterismCore: true },
      { ra: 16.8999, dec: -42.362, name: "Zeta Sco (Lower Tail Loop)", isAsterismCore: true },
      { ra: 17.2026, dec: -43.2392, name: "Eta Sco (Tail Base)", isAsterismCore: true },
      { ra: 17.622, dec: -42.9978, catalogStarId: 'sargas', name: "Sargas (Theta Sco - Sweeping Stinger Hook)", mag: 1.86, isAsterismCore: true },
      { ra: 17.7931, dec: -40.127, name: "Iota Sco (Elevated Tail Joint)" },
      { ra: 17.5601, dec: -37.1038, catalogStarId: 'shaula', name: "Shaula (Lambda Sco - The Stinger Barb)", mag: 1.62, isAsterismCore: true },
      { ra: 17.5127, dec: -37.2958, name: "Lesath (Upsilon Sco - Stinger Poison Sac)", isAsterismCore: true }
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
      { ra: 0.9768, dec: -29.3575, catalogStarId: 'alpha-sculptoris', name: "Alpha Scl (Carved Marble Bust)", isPrincipal: true, mag: 4.31, isAsterismCore: true },
      { ra: 23.5495, dec: -37.8183, name: "Beta Scl (Turntable Left)", isAsterismCore: true },
      { ra: 23.3137, dec: -32.532, catalogStarId: 'gamma-sculptoris', name: "Gamma Scl (Turntable Right)", mag: 4.41, isAsterismCore: true },
      { ra: 23.8154, dec: -28.1303, name: "Delta Scl (Studio Tripod Base)", isAsterismCore: true },
      { ra: 1.7608, dec: -25.0526, name: "Epsilon Scl (Sculptor Mallet)" }
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
      { ra: 18.5868, dec: -8.2441, catalogStarId: 'alpha-scuti', name: "Alpha Sct (Shield Top Crest)", isPrincipal: true, mag: 3.83, isAsterismCore: true },
      { ra: 18.7862, dec: -4.7479, catalogStarId: 'beta-scuti', name: "Beta Sct (Western Shield Rim)", mag: 4.22, isAsterismCore: true },
      { ra: 18.4866, dec: -14.5658, name: "Gamma Sct (Eastern Shield Rim)", isAsterismCore: true },
      { ra: 18.7046, dec: -9.0526, catalogStarId: 'delta-scuti', name: "Delta Sct (Shield Point Bottom)", mag: 4.71, isAsterismCore: true },
      { ra: 18.7253, dec: -8.2752, name: "Epsilon Sct (Central Embossed Boss / Cross)", isAsterismCore: true },
      { ra: 18.951, dec: -5.8463, name: "Eta Sct (Lower Decorative Rivet)" }
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
      { ra: 15.7698, dec: 15.4218, name: "Beta Ser (Serpent Crest)", isAsterismCore: true },
      { ra: 15.9409, dec: 15.6616, name: "Gamma Ser (Snout)", isAsterismCore: true },
      { ra: 15.8123, dec: 18.1416, name: "Kappa Ser (Jaw)", isAsterismCore: true },
      { ra: 15.7378, dec: 6.4256, catalogStarId: 'unukalhai', name: "Unukalhai (Alpha Ser - Cor Serpentis / Heart)", isPrincipal: true, mag: 2.63, isAsterismCore: true },
      { ra: 15.827, dec: -3.4302, name: "Mu Ser (Body Coil West)" },
      { ra: 17.6264, dec: -15.3986, name: "Xi Ser (Body Coil East)" },
      { ra: 18.3552, dec: -2.8988, name: "Eta Ser (Tail Section)" },
      { ra: 18.937, dec: 4.2036, catalogStarId: 'alya', name: "Alya (Theta Ser - Double Star Tail Tip)", mag: 4.03, isAsterismCore: true }
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
      { ra: 10.1323, dec: -0.3717, catalogStarId: 'alpha-sextantis', name: "Alpha Sex (Pivot Index Apex)", isPrincipal: true, mag: 4.49, isAsterismCore: true },
      { ra: 9.8751, dec: -8.105, name: "Gamma Sex (West Scale Sector)", isAsterismCore: true },
      { ra: 10.5049, dec: -0.637, catalogStarId: 'beta-sextantis', name: "Beta Sex (East Scale Sector)", mag: 5.08, isAsterismCore: true },
      { ra: 10.4913, dec: -2.7391, name: "Delta Sex (60-Degree Calibrated Arc)", isAsterismCore: true }
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
      { ra: 4.5987, dec: 16.5093, catalogStarId: 'aldebaran', name: "Aldebaran (Alpha Tau - The Fiery Eye)", isPrincipal: true, mag: 0.85, isAsterismCore: true },
      { ra: 4.4769, dec: 19.1804, name: "Ain (Epsilon Tau - Northern Eye)", isAsterismCore: true },
      { ra: 4.3299, dec: 15.6276, name: "Gamma Tau (Bull Snout)", isAsterismCore: true },
      { ra: 4.3822, dec: 17.5425, name: "Delta Tau (Nose)", isAsterismCore: true },
      { ra: 5.4382, dec: 28.6075, catalogStarId: 'elnath', name: "Elnath (Beta Tau - Northern Horn Tip)", mag: 1.65, isAsterismCore: true },
      { ra: 5.6274, dec: 21.1425, catalogStarId: 'tianguan', name: "Tianguan (Zeta Tau - Southern Horn Tip)", mag: 3.01, isAsterismCore: true },
      { ra: 3.7914, dec: 24.1051, catalogStarId: 'alcyone', name: "Alcyone (Eta Tau / Pleiades M45 - Shoulder Cluster)", mag: 2.87, isAsterismCore: true },
      { ra: 4.0113, dec: 12.4903, name: "Lambda Tau (Chest)" },
      { ra: 3.4528, dec: 9.7327, name: "Xi Tau (Front Hoof 1)" },
      { ra: 3.4136, dec: 9.0289, name: "Omicron Tau (Front Hoof 2)" }
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
      { ra: 18.4496, dec: -45.9685, catalogStarId: 'alpha-telescopii', name: "Alpha Tel (Objective Lens)", isPrincipal: true, mag: 3.51, isAsterismCore: true },
      { ra: 18.4805, dec: -49.0706, catalogStarId: 'zeta-telescopii', name: "Zeta Tel (Center Tube Pivot)", mag: 4.1, isAsterismCore: true },
      { ra: 18.1872, dec: -45.9544, name: "Epsilon Tel (Eyepiece Mount)", isAsterismCore: true },
      { ra: 18.5293, dec: -45.9148, name: "Delta Tel (Mounting Strut West)" },
      { ra: 19.5869, dec: -48.0992, name: "Iota Tel (Mounting Strut East)" }
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
      { ra: 1.8847, dec: 29.5788, catalogStarId: 'mothallah', name: "Mothallah (Alpha Tri - Apex of Triangle)", mag: 3.41, isAsterismCore: true },
      { ra: 2.1591, dec: 34.9873, catalogStarId: 'beta-trianguli', name: "Beta Tri (Western Base Star)", isPrincipal: true, mag: 3, isAsterismCore: true },
      { ra: 2.2886, dec: 33.8472, name: "Gamma Tri (Eastern Base Star)", isAsterismCore: true },
      { ra: 2.2842, dec: 34.2242, name: "Delta Tri (Base Reinforcement)" }
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
      { ra: 16.8111, dec: -69.0277, catalogStarId: 'atria', name: "Atria (Alpha TrA - Brilliant Apex)", isPrincipal: true, mag: 1.91, isAsterismCore: true },
      { ra: 15.919, dec: -63.4307, catalogStarId: 'betria', name: "Betria (Beta TrA - Southwest Base Star)", mag: 2.85, isAsterismCore: true },
      { ra: 15.3152, dec: -68.6795, name: "Gatlina (Gamma TrA - Southeast Base Star)", isAsterismCore: true },
      { ra: 16.2573, dec: -63.6857, name: "Delta TrA (Base Support)" }
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
      { ra: 0.5257, dec: -62.9582, catalogStarId: 'beta-tucanae', name: "Beta Tuc (Bill Tip)", mag: 4.36 },
      { ra: 23.2905, dec: -58.2357, name: "Gamma Tuc (Bill Base)", isAsterismCore: true },
      { ra: 22.3084, dec: -60.2596, catalogStarId: 'alpha-tucanae', name: "Alpha Tuc (Head & Eye)", isPrincipal: true, mag: 2.86, isAsterismCore: true },
      { ra: 22.4555, dec: -64.9664, name: "Delta Tuc (Breast / Body)", isAsterismCore: true },
      { ra: 23.9986, dec: -65.5771, name: "Epsilon Tuc (Tail / Flank)", isAsterismCore: true },
      { ra: 0.3345, dec: -64.8748, name: "Zeta Tuc (Perched Foot)" }
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
      { ra: 11.0621, dec: 61.751, catalogStarId: 'dubhe', name: "Dubhe (Alpha UMa - Bowl Pointer)", mag: 1.79, isAsterismCore: true },
      { ra: 11.0307, dec: 56.3824, catalogStarId: 'merak', name: "Merak (Beta UMa - Bowl Pointer)", mag: 2.37, isAsterismCore: true },
      { ra: 11.8972, dec: 53.6948, catalogStarId: 'phecda', name: "Phecda (Gamma UMa - Bowl Base)", mag: 2.44, isAsterismCore: true },
      { ra: 12.2571, dec: 57.0326, catalogStarId: 'megrez', name: "Megrez (Delta UMa - Bowl Rim)", mag: 3.31, isAsterismCore: true },
      { ra: 12.9005, dec: 55.9598, catalogStarId: 'alioth', name: "Alioth (Epsilon UMa - Tail)", isPrincipal: true, mag: 1.77, isAsterismCore: true },
      { ra: 13.3988, dec: 54.9254, catalogStarId: 'mizar-aa', name: "Mizar & Alcor (Zeta UMa - Tail)", mag: 2.23, isAsterismCore: true },
      { ra: 13.7923, dec: 49.3133, catalogStarId: 'alkaid', name: "Alkaid (Eta UMa - Tail Tip)", mag: 1.86, isAsterismCore: true },
      { ra: 9.5255, dec: 63.0619, name: "23 UMa (Bear Neck)" },
      { ra: 8.5044, dec: 60.7182, catalogStarId: 'muscida', name: "Muscida (Omicron UMa - Bear Snout)", mag: 3.35 },
      { ra: 8.6533, dec: 65.0209, name: "Pi1 UMa (Bear Ear)" },
      { ra: 9.5476, dec: 51.6773, name: "Theta UMa (Chest)" },
      { ra: 8.9868, dec: 48.0418, catalogStarId: 'talitha', name: "Talitha (Iota UMa - Front Claws)" },
      { ra: 9.0604, dec: 47.1565, name: "Alkaphrah (Kappa UMa - Front Claws)" },
      { ra: 10.2849, dec: 42.9144, catalogStarId: 'tania-borealis', name: "Tania Borealis (Lambda UMa - Hind Thigh)" },
      { ra: 10.3721, dec: 41.4995, catalogStarId: 'tania-australis', name: "Tania Australis (Mu UMa - Hind Claws)" },
      { ra: 11.308, dec: 33.0943, catalogStarId: 'alula-borealis', name: "Alula Borealis (Nu UMa - Back Leg)" },
      { ra: 11.303, dec: 31.5293, catalogStarId: 'alula-australis', name: "Alula Australis (Xi UMa - Back Claws)" }
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
      { ra: 2.5303, dec: 89.2641, catalogStarId: 'polaris', name: "Polaris (Alpha UMi - North Star)", isPrincipal: true, mag: 1.98, isAsterismCore: true },
      { ra: 17.5369, dec: 86.5865, catalogStarId: 'yildun', name: "Yildun (Delta UMi - Curved Tail)", mag: 4.35, isAsterismCore: true },
      { ra: 16.7662, dec: 82.0373, name: "Epsilon UMi (Tail Base)", isAsterismCore: true },
      { ra: 15.7343, dec: 77.7945, name: "Zeta UMi (Bowl Rim East)", isAsterismCore: true },
      { ra: 14.8451, dec: 74.1555, catalogStarId: 'kochab', name: "Kochab (Beta UMi - Guardian of the Pole)", mag: 2.08, isAsterismCore: true },
      { ra: 15.3455, dec: 71.834, catalogStarId: 'pherkad', name: "Pherkad (Gamma UMi - Guardian of the Pole)", mag: 3.05, isAsterismCore: true },
      { ra: 16.2917, dec: 75.7553, name: "Eta UMi (Bowl Rim West)", isAsterismCore: true },
      { ra: 14.1475, dec: 77.5475, name: "4 UMi (Bear Snout)" },
      { ra: 14.4588, dec: 75.696, name: "5 UMi (Little Bear Paw)" }
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
      { ra: 9.1333, dec: -43.4326, catalogStarId: 'alsuhail', name: "Suhail (Lambda Vel - Topmast Gilded Cross)", mag: 2.21, isAsterismCore: true },
      { ra: 8.7451, dec: -54.7088, catalogStarId: 'alsephina', name: "Alsephina (Delta Vel - False Cross Northwest)", mag: 1.96, isAsterismCore: true },
      { ra: 9.3686, dec: -55.0107, catalogStarId: 'markeb', name: "Markeb (Kappa Vel - False Cross Southeast)", mag: 2.47, isAsterismCore: true },
      { ra: 8.1589, dec: -47.3366, catalogStarId: 'regor', name: "Regor (Gamma Vel - Wolf-Rayet Jewel)", isPrincipal: true, mag: 1.78, isAsterismCore: true },
      { ra: 10.7795, dec: -49.4203, name: "Mu Vel (Canvas Clew Line)", isAsterismCore: true },
      { ra: 9.9477, dec: -54.5678, name: "Phi Vel (Outer Sail Tack)" }
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
      { ra: 13.4199, dec: -11.1613, catalogStarId: 'spica', name: "Spica (Alpha Vir - Ear of Wheat)", isPrincipal: true, mag: 0.98, isAsterismCore: true },
      { ra: 12.6943, dec: -1.4494, catalogStarId: 'gamma-virginis-a', name: "Porrima (Gamma Vir - Waist / Girdle)", mag: 3.48, isAsterismCore: true },
      { ra: 12.3318, dec: -0.6668, name: "Zaniah (Eta Vir - Shoulder)", isAsterismCore: true },
      { ra: 11.8449, dec: 1.7647, catalogStarId: 'zavijava', name: "Zavijava (Beta Vir - Maiden Head & Crown)", mag: 3.61, isAsterismCore: true },
      { ra: 13.0363, dec: 10.9591, catalogStarId: 'vindemiatrix', name: "Vindemiatrix (Epsilon Vir - Outspread Wing)", mag: 2.83, isAsterismCore: true },
      { ra: 13.5782, dec: -0.5958, catalogStarId: 'heze', name: "Heze (Zeta Vir - Gown Drapery)", mag: 3.38, isAsterismCore: true },
      { ra: 14.2669, dec: -6.0005, name: "Syrma (Iota Vir - Flowing Hem of Dress)" },
      { ra: 13.1658, dec: -5.539, name: "Theta Vir (Left Arm Holding Sheaf)" },
      { ra: 14.7177, dec: -5.6582, name: "Rijl al Awwa (Mu Vir - Foot)" }
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
      { ra: 7.1451, dec: -70.4971, name: "Gamma Vol (Fish Snout)", isAsterismCore: true },
      { ra: 9.0408, dec: -66.3961, name: "Alpha Vol (Thorax / Wing Pivot)", isAsterismCore: true },
      { ra: 8.4289, dec: -66.1369, catalogStarId: 'beta-volantis', name: "Beta Vol (West Flying Wingtip)", isPrincipal: true, mag: 3.77, isAsterismCore: true },
      { ra: 7.2805, dec: -67.9572, name: "Delta Vol (East Flying Wingtip)", isAsterismCore: true },
      { ra: 8.1322, dec: -68.6171, name: "Epsilon Vol (Body Flank)", isAsterismCore: true },
      { ra: 7.697, dec: -72.6061, name: "Zeta Vol (Tail Fin Fluke West)" },
      { ra: 8.3303, dec: -71.5149, name: "Kappa Vol (Tail Fin Fluke East)" }
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
      { ra: 19.4784, dec: 24.6649, catalogStarId: 'anser', name: "Anser (Alpha Vul - The Goose in Fox Muzzle)", isPrincipal: true, mag: 4.44, isAsterismCore: true },
      { ra: 19.891, dec: 24.0796, name: "13 Vul (Fox Ears & Crown)" },
      { ra: 20.0183, dec: 27.7536, catalogStarId: '15-vulpeculae', name: "15 Vul (Fox Shoulder)", mag: 4.66, isAsterismCore: true },
      { ra: 20.2628, dec: 27.8142, name: "23 Vul (Prowling Spine / Back)", isAsterismCore: true },
      { ra: 20.8688, dec: 27.0969, name: "31 Vul (Bushy Fox Tail)" },
      { ra: 20.2374, dec: 28.6948, name: "21 Vul (Front Paws)" },
      { ra: 20.642, dec: 21.2012, name: "29 Vul (Hind Paws)" }
    ],
    lines: [
      [0, 1], [1, 2], [0, 2], [2, 3], [3, 4], [2, 5], [3, 6]
    ],
    asterismLines: [[0, 2], [2, 3], [3, 4]]
  }
};
