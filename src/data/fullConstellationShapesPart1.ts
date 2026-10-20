import { ConstellationShape } from './constellationsCore';

// Define full constellation stick figures for all 88 constellations
export const FULL_CONSTELLATION_SHAPES: Record<string, ConstellationShape> = {
  // 1. andromeda
'andromeda': {
    mainAsterismName: "Chained Maiden Line",
    stars: [
      { ra: 0.1398, dec: 29.0904, catalogStarId: 'alpheratz', name: "Alpheratz (Alpha And)", isPrincipal: true, mag: 2.06, isAsterismCore: true },
      { ra: 0.6554, dec: 30.861, name: "Delta And", isAsterismCore: true },
      { ra: 1.1622, dec: 35.6206, catalogStarId: 'mirach', name: "Mirach (Beta And)", mag: 2.07, isAsterismCore: true },
      { ra: 2.065, dec: 42.3297, catalogStarId: 'almach', name: "Almach (Gamma And)", mag: 2.1, isAsterismCore: true },
      { ra: 0.6147, dec: 33.7193, name: "Pi And (Right Arm)" },
      { ra: 0.2849, dec: 38.6816, name: "Theta And (Right Hand Chained)" },
      { ra: 0.9459, dec: 38.4993, name: "Mu And (Left Arm)" },
      { ra: 0.8302, dec: 41.0789, name: "Nu And (Left Hand Chained)" },
      { ra: 1.6332, dec: 48.6282, name: "51 And (Right Leg)" },
      { ra: 1.6133, dec: 41.4055, name: "Upsilon And (Left Foot)" }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [1, 4], [4, 5], [1, 6], [6, 7], [2, 8], [3, 9]
    ],
    asterismLines: [[0, 1], [1, 2], [2, 3]]
  },

  // 2. antlia
'antlia': {
    mainAsterismName: "Pneumatic Cylinder",
    stars: [
      { ra: 9.7367, dec: -27.7695, name: "Theta Ant (Piston Handle)" },
      { ra: 10.4525, dec: -31.0678, catalogStarId: 'alpha-antliae', name: "Alpha Ant (Pump Valve)", isPrincipal: true, mag: 4.25, isAsterismCore: true },
      { ra: 9.4874, dec: -35.9513, catalogStarId: 'epsilon-antliae', name: "Epsilon Ant (Cylinder Wall)", mag: 4.51, isAsterismCore: true },
      { ra: 9.9812, dec: -35.891, name: "Eta Ant (Compression Chamber)" },
      { ra: 10.9453, dec: -37.1378, catalogStarId: 'iota-antliae', name: "Iota Ant (Vacuum Base Reservoir)", mag: 4.6, isAsterismCore: true },
      { ra: 9.5128, dec: -31.8892, name: "Zeta Ant (Pressure Gauge Foot)" }
    ],
    lines: [
      [0, 1], [1, 2], [1, 3], [2, 5], [3, 4], [5, 4]
    ],
    asterismLines: [[1, 2], [2, 4]]
  },

  // 3. apus
'apus': {
    mainAsterismName: "Bird of Paradise Plumage",
    stars: [
      { ra: 16.3391, dec: -78.6957, name: "Delta1 Aps (Beak)" },
      { ra: 14.7977, dec: -79.0448, catalogStarId: 'alpha-apodis', name: "Alpha Aps (Head & Eye)", isPrincipal: true, mag: 3.83, isAsterismCore: true },
      { ra: 16.5575, dec: -78.8971, catalogStarId: 'gamma-apodis', name: "Gamma Aps (Breast)", mag: 3.86, isAsterismCore: true },
      { ra: 16.718, dec: -77.5174, catalogStarId: 'beta-apodis', name: "Beta Aps (Body / Flank)", mag: 4.24, isAsterismCore: true },
      { ra: 16.3408, dec: -78.6675, name: "Delta2 Aps (Wing Plumage)", isAsterismCore: true },
      { ra: 14.0889, dec: -76.7968, name: "Theta Aps (Trailing Tail Feather)" },
      { ra: 17.3665, dec: -67.7707, name: "Zeta Aps (Upper Wing)" }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4], [2, 4], [3, 5], [2, 6]
    ],
    asterismLines: [[1, 2], [2, 3], [3, 4]]
  },

  // 4. aquarius
'aquarius': {
    mainAsterismName: "The Water Jar & Cascading Stream",
    stars: [
      { ra: 21.6592, dec: 2.2436, name: "25 Aqr (Head)" },
      { ra: 22.0964, dec: -0.3199, catalogStarId: 'sadalmelik', name: "Sadalmelik (Alpha Aqr - Shoulder)", mag: 2.95, isAsterismCore: true },
      { ra: 21.526, dec: -5.5712, catalogStarId: 'sadalsuud', name: "Sadalsuud (Beta Aqr - Left Shoulder)", isPrincipal: true, mag: 2.87, isAsterismCore: true },
      { ra: 22.2806, dec: -7.7833, name: "Ancha (Theta Aqr - Torso)" },
      { ra: 22.4805, dec: -0.0199, name: "Zeta Aqr (Urn Lip)", isAsterismCore: true },
      { ra: 22.3609, dec: -1.3873, name: "Gamma Aqr (Urn Body)", isAsterismCore: true },
      { ra: 22.5893, dec: -0.1175, name: "Eta Aqr (Urn Spout)", isAsterismCore: true },
      { ra: 22.4213, dec: 1.3774, name: "Pi Aqr (Urn Base)", isAsterismCore: true },
      { ra: 22.8769, dec: -7.5796, name: "Hydor (Lambda Aqr - Water Stream)" },
      { ra: 22.8265, dec: -13.5926, name: "Tau Aqr (Meandering Stream)" },
      { ra: 23.1574, dec: -21.1724, name: "88 Aqr (Stream Current)" },
      { ra: 22.9108, dec: -15.8208, catalogStarId: 'skat', name: "Skat (Delta Aqr - Right Leg)", mag: 3.27 },
      { ra: 23.3828, dec: -20.1006, name: "98 Aqr (Pool Reservoir)" }
    ],
    lines: [
      [0, 1], [0, 2], [1, 2], [1, 3], [2, 3], [1, 4], [4, 5], [5, 6], [5, 7], [4, 7], [6, 8], [8, 9], [9, 10], [10, 12], [3, 11], [11, 12]
    ],
    asterismLines: [[4, 5], [5, 6], [5, 7], [4, 7]]
  },

  // 5. aquila
'aquila': {
    mainAsterismName: "Family of Altair",
    stars: [
      { ra: 19.771, dec: 10.6133, catalogStarId: 'tarazed', name: "Tarazed (Gamma Aql - Head)", mag: 2.72, isAsterismCore: true },
      { ra: 19.8464, dec: 8.8683, catalogStarId: 'altair', name: "Altair (Alpha Aql - Heart)", isPrincipal: true, mag: 0.77, isAsterismCore: true },
      { ra: 19.9219, dec: 6.4068, catalogStarId: 'alshain', name: "Alshain (Beta Aql - Throat)", mag: 3.71, isAsterismCore: true },
      { ra: 19.0902, dec: 13.8635, name: "Zeta Aql (Northern Wing Inner)" },
      { ra: 18.9937, dec: 15.0683, name: "Epsilon Aql (Northern Wing Tip)" },
      { ra: 20.1884, dec: -0.8215, name: "Theta Aql (Southern Wing Inner)" },
      { ra: 19.8745, dec: 1.0057, name: "Eta Aql (Southern Wing Tip)" },
      { ra: 19.425, dec: 3.1148, name: "Delta Aql (Tail Base)" },
      { ra: 19.1041, dec: -4.8826, name: "Lambda Aql (Tail Feathers)" }
    ],
    lines: [
      [0, 1], [1, 2], [1, 3], [3, 4], [1, 5], [5, 6], [2, 7], [7, 8]
    ],
    asterismLines: [[0, 1], [1, 2]]
  },

  // 6. ara
'ara': {
    mainAsterismName: "Sacrificial Hearth",
    stars: [
      { ra: 17.5307, dec: -49.8761, catalogStarId: 'alpha-arae', name: "Alpha Ara (Altar Flame)", mag: 2.85, isAsterismCore: true },
      { ra: 17.4217, dec: -55.5299, catalogStarId: 'beta-arae', name: "Beta Ara (Left Cornice)", isPrincipal: true, mag: 2.85, isAsterismCore: true },
      { ra: 17.4232, dec: -56.3777, name: "Gamma Ara (Right Cornice)", isAsterismCore: true },
      { ra: 17.5183, dec: -60.6838, name: "Delta Ara (Left Pillar)", isAsterismCore: true },
      { ra: 16.977, dec: -55.9901, catalogStarId: 'zeta-arae', name: "Zeta Ara (Right Pillar)", mag: 3.12, isAsterismCore: true },
      { ra: 16.9931, dec: -53.1604, name: "Epsilon Ara (Altar Pedestal Base)" },
      { ra: 16.8298, dec: -59.0414, name: "Eta Ara (Plinth Foot)" }
    ],
    lines: [
      [0, 1], [0, 2], [1, 2], [1, 3], [2, 4], [3, 4], [3, 5], [4, 5], [4, 6]
    ],
    asterismLines: [[1, 2], [2, 4], [4, 3], [3, 1]]
  },

  // 7. aries
'aries': {
    mainAsterismName: "Ram's Horns",
    stars: [
      { ra: 1.8922, dec: 19.2939, catalogStarId: 'mesarthim', name: "Mesarthim (Gamma Ari - Horn Tip)", mag: 3.88, isAsterismCore: true },
      { ra: 1.9107, dec: 20.808, catalogStarId: 'sheratan', name: "Sheratan (Beta Ari - Horn Base)", mag: 2.64, isAsterismCore: true },
      { ra: 2.1196, dec: 23.4624, catalogStarId: 'hamal', name: "Hamal (Alpha Ari - Crown)", isPrincipal: true, mag: 2.01, isAsterismCore: true },
      { ra: 1.9558, dec: 17.8176, name: "Iota Ari (Muzzle)" },
      { ra: 2.8331, dec: 27.2605, name: "Bharani (41 Ari - Golden Fleece Back)" },
      { ra: 2.7985, dec: 29.2471, name: "39 Ari (Rump & Tail)" },
      { ra: 2.9869, dec: 21.3404, name: "Epsilon Ari (Foreleg)" },
      { ra: 3.1938, dec: 19.7267, name: "Delta Ari (Hind Leg)" }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [2, 4], [4, 5], [1, 6], [4, 7]
    ],
    asterismLines: [[0, 1], [1, 2]]
  },

  // 8. auriga
'auriga': {
    mainAsterismName: "Charioteer Pentagon & The Kids",
    stars: [
      { ra: 5.9921, dec: 54.2847, name: "Delta Aur (Helmet Crest)" },
      { ra: 5.2782, dec: 45.998, catalogStarId: 'capella-aa', name: "Capella (Alpha Aur - Heart Star)", isPrincipal: true, mag: 0.08, isAsterismCore: true },
      { ra: 5.9921, dec: 44.9474, catalogStarId: 'menkalinan', name: "Menkalinan (Beta Aur - Left Shoulder)", mag: 1.9, isAsterismCore: true },
      { ra: 5.9954, dec: 37.2126, name: "Mahasim (Theta Aur - Chariot Reins)", isAsterismCore: true },
      { ra: 5.4382, dec: 28.6075, name: "Elnath (Beta Tau - Charioteer Left Foot)", isAsterismCore: true },
      { ra: 4.9499, dec: 33.1661, name: "Hassaleh (Iota Aur - Right Foot)", isAsterismCore: true },
      { ra: 5.0328, dec: 43.8233, catalogStarId: 'almaaz', name: "Almaaz (Epsilon Aur - Kid 1)", mag: 2.98, isAsterismCore: true },
      { ra: 5.0413, dec: 41.0758, catalogStarId: 'sadatoni', name: "Sadatoni (Zeta Aur - Kid 2)", isAsterismCore: true },
      { ra: 5.1086, dec: 41.2345, name: "Haedus II (Eta Aur - Kid 3)", isAsterismCore: true }
    ],
    lines: [
      [0, 1], [0, 2], [1, 2], [2, 3], [3, 4], [4, 5], [5, 1], [1, 6], [6, 7], [7, 8], [8, 6]
    ],
    asterismLines: [[1, 2], [2, 3], [3, 4], [4, 5], [5, 1]]
  },

  // 9. bootes
'bootes': {
    mainAsterismName: "The Kite Asterism",
    stars: [
      { ra: 15.0324, dec: 40.3906, catalogStarId: 'nekkar', name: "Nekkar (Beta Boo - Head)", isAsterismCore: true },
      { ra: 14.5346, dec: 38.3082, catalogStarId: 'seginus', name: "Seginus (Gamma Boo - Right Shoulder)", isAsterismCore: true },
      { ra: 15.2584, dec: 33.3148, name: "Delta Boo (Left Shoulder)", isAsterismCore: true },
      { ra: 14.7498, dec: 27.0742, catalogStarId: 'izar', name: "Izar (Epsilon Boo - Belt)", mag: 2.35, isAsterismCore: true },
      { ra: 14.261, dec: 19.1824, catalogStarId: 'arcturus', name: "Arcturus (Alpha Boo - Heart/Knees)", isPrincipal: true, mag: -0.05, isAsterismCore: true },
      { ra: 13.9114, dec: 18.3977, catalogStarId: 'muphrid', name: "Muphrid (Eta Boo - Left Foot)", mag: 2.68, isAsterismCore: true },
      { ra: 14.4199, dec: 51.8507, name: "Asellus Primus (Theta Boo - Raised Crook Staff)" },
      { ra: 14.2694, dec: 51.3672, name: "Asellus Secundus (Iota Boo - Staff Tip)" },
      { ra: 14.2246, dec: 51.7889, name: "Asellus Tertius (Kappa Boo - Hunting Dogs Leash)" }
    ],
    lines: [
      [0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [4, 5], [2, 6], [6, 7], [1, 8]
    ],
    asterismLines: [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4]]
  },

  // 10. caelum
'caelum': {
    mainAsterismName: "Engraver's Chisel",
    stars: [
      { ra: 4.676, dec: -41.8638, catalogStarId: 'alpha-caeli', name: "Alpha Cae (Beveled Cutting Edge)", isPrincipal: true, mag: 4.45, isAsterismCore: true },
      { ra: 4.701, dec: -37.1443, name: "Beta Cae (Edge Corner)", isAsterismCore: true },
      { ra: 5.0734, dec: -35.483, name: "Gamma Cae (Chisel Steel Shaft)", isAsterismCore: true },
      { ra: 4.5139, dec: -44.9537, name: "Delta Cae (Bolster Collar)" },
      { ra: 4.7971, dec: -30.0204, name: "Zeta Cae (Mallet Striking Handle)" }
    ],
    lines: [
      [0, 1], [0, 2], [1, 2], [2, 3], [3, 4]
    ],
    asterismLines: [[0, 2], [2, 4]]
  },

  // 11. camelopardalis
'camelopardalis': {
    mainAsterismName: "The Long-Necked Giraffe",
    stars: [
      { ra: 4.9548, dec: 53.7521, name: "7 Cam (Snout & Horns)" },
      { ra: 3.8393, dec: 71.3323, name: "Gamma Cam (Crown)" },
      { ra: 4.9008, dec: 66.3427, catalogStarId: 'alpha-camelopardalis', name: "Alpha Cam (Neck Apex)", mag: 4.29, isAsterismCore: true },
      { ra: 3.8254, dec: 65.526, name: "BE Cam (Mid-Neck)" },
      { ra: 5.057, dec: 60.4422, catalogStarId: 'beta-camelopardalis', name: "Beta Cam (Withers / Shoulders)", isPrincipal: true, mag: 4.02, isAsterismCore: true },
      { ra: 3.4845, dec: 59.9403, name: "CS Cam (Back & Rump)", isAsterismCore: true },
      { ra: 5.1023, dec: 58.9724, name: "11 Cam (Front Hooves)" },
      { ra: 5.1034, dec: 59.0213, name: "12 Cam (Hind Hooves)" }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [4, 6], [5, 7]
    ],
    asterismLines: [[2, 4], [4, 5]]
  },

  // 12. cancer
'cancer': {
    mainAsterismName: "The Crab Carapace & Claws",
    stars: [
      { ra: 8.7214, dec: 21.4685, name: "Asellus Borealis (Gamma Cnc - Carapace)", isAsterismCore: true },
      { ra: 8.7447, dec: 18.1543, catalogStarId: 'asellus-australis', name: "Asellus Australis (Delta Cnc - Carapace)", mag: 3.94, isAsterismCore: true },
      { ra: 8.6703, dec: 19.6211, name: "Praesepe (Beehive Cluster M44 - Shell Heart)", isAsterismCore: true },
      { ra: 8.7783, dec: 28.7599, name: "Iota Cnc (North Claw)", isAsterismCore: true },
      { ra: 8.3344, dec: 27.2177, name: "Chi Cnc (Pincer Tip)" },
      { ra: 8.9748, dec: 11.8577, catalogStarId: 'acubens', name: "Acubens (Alpha Cnc - South Claw)", mag: 4.26, isAsterismCore: true },
      { ra: 8.9321, dec: 11.626, name: "60 Cnc (Lower Pincer Tip)" },
      { ra: 8.2035, dec: 17.6478, name: "Tegmine (Zeta Cnc - West Walking Leg)" },
      { ra: 8.2753, dec: 9.1855, catalogStarId: 'tarf', name: "Altarf (Beta Cnc - South Walking Leg)", isPrincipal: true, mag: 3.52, isAsterismCore: true }
    ],
    lines: [
      [0, 1], [0, 2], [1, 2], [0, 3], [3, 4], [1, 5], [5, 6], [0, 7], [1, 8]
    ],
    asterismLines: [[3, 0], [0, 1], [1, 5], [1, 8]]
  },

  // 13. canes-venatici
'canes-venatici': {
    mainAsterismName: "Asterion & Chara",
    stars: [
      { ra: 12.9338, dec: 38.3184, catalogStarId: 'cor-caroli', name: "Cor Caroli (Alpha CVn - Asterion Heart)", isPrincipal: true, mag: 2.89, isAsterismCore: true },
      { ra: 13.5742, dec: 49.016, name: "24 CVn (Asterion Snout)" },
      { ra: 12.5624, dec: 41.3575, catalogStarId: 'chara', name: "Chara (Beta CVn - Hound Chara)", mag: 4.26, isAsterismCore: true },
      { ra: 12.7498, dec: 39.2789, name: "10 CVn (Chara Forepaw)" },
      { ra: 12.5511, dec: 44.9153, name: "Tuiren (Tether Leash Collar)" }
    ],
    lines: [
      [0, 1], [2, 3], [0, 4], [2, 4]
    ],
    asterismLines: [[0, 2]]
  },

  // 14. canis-major
'canis-major': {
    mainAsterismName: "The Greater Dog Frame",
    stars: [
      { ra: 6.7525, dec: -16.7161, catalogStarId: 'sirius-a', name: "Sirius (Alpha CMa - Blazing Chest)", isPrincipal: true, mag: -1.46, isAsterismCore: true },
      { ra: 7.0626, dec: -15.6333, catalogStarId: 'muliphein', name: "Muliphein (Gamma CMa - Snout)" },
      { ra: 6.9032, dec: -12.0386, name: "Theta CMa (Ear / Crown)" },
      { ra: 6.3783, dec: -17.9559, catalogStarId: 'mirzam', name: "Mirzam (Beta CMa - Front Paw)", mag: 1.98, isAsterismCore: true },
      { ra: 6.3386, dec: -30.0634, name: "Zeta CMa (Front Foot)" },
      { ra: 7.1399, dec: -26.3932, catalogStarId: 'wezen', name: "Wezen (Delta CMa - Spine / Rump)", mag: 1.83, isAsterismCore: true },
      { ra: 6.9771, dec: -28.9721, catalogStarId: 'adhara', name: "Adhara (Epsilon CMa - Thigh)", mag: 1.5, isAsterismCore: true },
      { ra: 7.4016, dec: -29.3031, catalogStarId: 'aludra', name: "Aludra (Eta CMa - Hind Paw)", isAsterismCore: true },
      { ra: 7.0504, dec: -23.8333, name: "Omicron2 CMa (Tail Tip)" }
    ],
    lines: [
      [0, 1], [1, 2], [2, 0], [0, 3], [3, 4], [0, 5], [5, 6], [5, 7], [5, 8]
    ],
    asterismLines: [[0, 3], [0, 5], [5, 6], [5, 7]]
  },

  // 15. canis-minor
'canis-minor': {
    mainAsterismName: "Procyon Line",
    stars: [
      { ra: 7.655, dec: 5.225, catalogStarId: 'procyon-a', name: "Procyon (Alpha CMi - Body)", isPrincipal: true, mag: 0.34, isAsterismCore: true },
      { ra: 7.4525, dec: 8.2893, catalogStarId: 'gomeisa', name: "Gomeisa (Beta CMi - Neck)", mag: 2.89, isAsterismCore: true },
      { ra: 7.4694, dec: 8.9255, name: "Gamma CMi (Snout)" },
      { ra: 7.4275, dec: 9.2761, name: "Epsilon CMi (Forepaw)" }
    ],
    lines: [
      [0, 1], [1, 2], [0, 3]
    ],
    asterismLines: [[0, 1]]
  },

  // 16. capricornus
'capricornus': {
    mainAsterismName: "The Sea-Goat Triangle",
    stars: [
      { ra: 20.3009, dec: -12.5449, name: "Algedi (Alpha Cap - Horn Tip)", isAsterismCore: true },
      { ra: 20.3502, dec: -14.7814, name: "Dabih (Beta Cap - Goat Eye)", isAsterismCore: true },
      { ra: 20.3444, dec: -12.7591, name: "Nu Cap (Bearded Muzzle)" },
      { ra: 20.7683, dec: -25.2709, name: "Psi Cap (Chest & Foreleg)" },
      { ra: 20.8637, dec: -26.9191, name: "Omega Cap (Front Hoof)" },
      { ra: 21.0991, dec: -17.2329, name: "Theta Cap (Spine / Dorsal Ridge)", isAsterismCore: true },
      { ra: 21.3708, dec: -16.8345, name: "Iota Cap (Fish Body)", isAsterismCore: true },
      { ra: 21.6682, dec: -16.6624, name: "Nashira (Gamma Cap - Tail Peduncle)", isAsterismCore: true },
      { ra: 21.784, dec: -16.1273, catalogStarId: 'deneb-algedi', name: "Deneb Algedi (Delta Cap - Upper Fluke)", isPrincipal: true, mag: 2.81, isAsterismCore: true },
      { ra: 21.4445, dec: -22.4113, name: "Zeta Cap (Lower Fluke)" }
    ],
    lines: [
      [0, 1], [1, 2], [1, 3], [3, 4], [1, 5], [5, 6], [6, 7], [3, 6], [7, 8], [7, 9]
    ],
    asterismLines: [[0, 1], [1, 5], [5, 7], [7, 8], [8, 3], [3, 1]]
  },

  // 17. carina
'carina': {
    mainAsterismName: "Diamond Cross & Keel",
    stars: [
      { ra: 6.3992, dec: -52.6957, catalogStarId: 'canopus', name: "Canopus (Alpha Car - Masthead Beacon)", isPrincipal: true, mag: -0.74, isAsterismCore: true },
      { ra: 8.3752, dec: -59.5095, catalogStarId: 'avior', name: "Avior (Epsilon Car - Gunwale)", mag: 1.86, isAsterismCore: true },
      { ra: 9.2848, dec: -59.2752, catalogStarId: 'aspidiske', name: "Aspidiske (Iota Car - Bow Hull)", isAsterismCore: true },
      { ra: 10.7159, dec: -64.3945, name: "Theta Car (Diamond Cross Keel)", isAsterismCore: true },
      { ra: 9.22, dec: -69.7172, catalogStarId: 'miaplacidus', name: "Miaplacidus (Beta Car - Stern Keel)", isAsterismCore: true },
      { ra: 9.785, dec: -65.072, name: "Upsilon Car (Rudder Steering Oar)" },
      { ra: 7.9463, dec: -52.9823, name: "Chi Car (Tiller Arm)" }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4], [1, 3], [4, 5], [5, 6], [0, 5]
    ],
    asterismLines: [[1, 2], [2, 3], [3, 4], [4, 1]]
  },

  // 18. cassiopeia
'cassiopeia': {
    mainAsterismName: "The Heavenly W / Crown",
    stars: [
      { ra: 0.153, dec: 59.1498, catalogStarId: 'caph', name: "Caph (Beta Cas - Crown Peak 1)", isAsterismCore: true },
      { ra: 0.6751, dec: 56.5373, catalogStarId: 'schedar', name: "Schedar (Alpha Cas - Lap / Jewel)", isPrincipal: true, mag: 2.24, isAsterismCore: true },
      { ra: 0.9451, dec: 60.7167, name: "Navi (Gamma Cas - Crown Center)", isAsterismCore: true },
      { ra: 1.4303, dec: 60.2353, catalogStarId: 'ruchbah', name: "Ruchbah (Delta Cas - Knee)", isAsterismCore: true },
      { ra: 1.9066, dec: 63.6701, catalogStarId: 'segin', name: "Segin (Epsilon Cas - Crown Peak 2)", isAsterismCore: true },
      { ra: 2.4844, dec: 67.4025, name: "Iota Cas (Throne Backrest Top)" },
      { ra: 2.0573, dec: 72.4213, name: "50 Cas (Throne Canopy)" },
      { ra: 0.6162, dec: 53.8969, name: "Zeta Cas / Fulu (Throne Base)" },
      { ra: 0.8184, dec: 57.8152, catalogStarId: 'achird', name: "Achird (Eta Cas - Footstool)" }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 2], [1, 7], [3, 7], [7, 8], [1, 8]
    ],
    asterismLines: [[0, 1], [1, 2], [2, 3], [3, 4]]
  },

  // 19. centaurus
'centaurus': {
    mainAsterismName: "The Southern Pointers & Centaur",
    stars: [
      { ra: 14.1114, dec: -36.37, catalogStarId: 'menkent', name: "Menkent (Theta Cen - Head)", isAsterismCore: true },
      { ra: 12.692, dec: -48.9599, catalogStarId: 'muhlifain', name: "Muhlifain (Gamma Cen - Right Shoulder)" },
      { ra: 13.8251, dec: -41.6877, name: "Nu Cen (Left Shoulder)" },
      { ra: 12.1393, dec: -50.7224, name: "Delta Cen (Spearhead)" },
      { ra: 13.6648, dec: -53.4664, name: "Epsilon Cen (Human Waist)" },
      { ra: 13.9257, dec: -47.2884, name: "Zeta Cen (Horse Withers)" },
      { ra: 13.3433, dec: -36.7123, name: "Iota Cen (Horse Rump)" },
      { ra: 12.2341, dec: -45.7239, name: "d Cen (Hind Flank)" },
      { ra: 13.4903, dec: -51.1651, name: "k Cen (Hind Hoof)" },
      { ra: 14.0637, dec: -60.373, name: "Hadar (Beta Cen - Front Knee Pointer)", isAsterismCore: true },
      { ra: 14.6601, dec: -60.834, catalogStarId: 'alpha-centauri-a', name: "Rigil Kentaurus (Alpha Cen - Front Hoof Pointer)", isPrincipal: true, mag: 0.01, isAsterismCore: true }
    ],
    lines: [
      [0, 1], [0, 2], [1, 4], [2, 4], [2, 3], [4, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10]
    ],
    asterismLines: [[9, 10]]
  },

  // 20. cepheus
'cepheus': {
    mainAsterismName: "The King House Asterism",
    stars: [
      { ra: 23.6558, dec: 77.6324, name: "Errai (Gamma Cep - Royal Crown Peak)", isAsterismCore: true },
      { ra: 21.4777, dec: 70.5607, name: "Alfirk (Beta Cep - Western Crown Base)", isAsterismCore: true },
      { ra: 22.828, dec: 66.2004, name: "Iota Cep (Eastern Crown Base)", isAsterismCore: true },
      { ra: 21.3097, dec: 62.5856, catalogStarId: 'alderamin', name: "Alderamin (Alpha Cep - Right Shoulder)", isPrincipal: true, mag: 2.45, isAsterismCore: true },
      { ra: 22.1809, dec: 58.2013, name: "Zeta Cep (Left Shoulder)", isAsterismCore: true },
      { ra: 22.4862, dec: 58.4152, name: "Delta Cep (Royal Robes Hem)", isAsterismCore: true },
      { ra: 22.2506, dec: 57.0436, name: "Epsilon Cep (Robe Hem West)" },
      { ra: 21.7251, dec: 58.78, catalogStarId: 'mu-cephei', name: "Garnet Star (Mu Cep - Heart Jewel)", mag: 4.08 }
    ],
    lines: [
      [0, 1], [0, 2], [1, 2], [1, 3], [2, 4], [3, 4], [3, 6], [4, 5], [6, 5], [1, 7], [2, 7]
    ],
    asterismLines: [[0, 1], [0, 2], [1, 3], [2, 4], [3, 4]]
  },

  // 21. cetus
'cetus': {
    mainAsterismName: "Sea Monster's Head & Tail",
    stars: [
      { ra: 3.038, dec: 4.0897, catalogStarId: 'menkar', name: "Menkar (Alpha Cet - Upper Jaw)", mag: 2.54, isAsterismCore: true },
      { ra: 2.7217, dec: 3.2358, catalogStarId: 'kaffaljidhma', name: "Kaffaljidhma (Gamma Cet - Snout)", isAsterismCore: true },
      { ra: 2.749, dec: 10.1141, name: "Mu Cet (Lower Jaw)", isAsterismCore: true },
      { ra: 2.4693, dec: 8.4601, name: "Xi2 Cet (Tooth)", isAsterismCore: true },
      { ra: 2.658, dec: 0.3285, name: "Delta Cet (Neck / Throat)", isAsterismCore: true },
      { ra: 2.3224, dec: -2.9776, catalogStarId: 'mira-a', name: "Mira (Omicron Cet - Pulsing Heart Variable)", mag: 3.5 },
      { ra: 1.8577, dec: -10.335, catalogStarId: 'baten-kaitos', name: "Baten Kaitos (Zeta Cet - Belly / Flank)", mag: 3.74, isAsterismCore: true },
      { ra: 1.1432, dec: -10.1823, name: "Eta Cet (Tail Peduncle)" },
      { ra: 1.4004, dec: -8.1833, name: "Theta Cet (Lower Tail)" },
      { ra: 0.7265, dec: -17.9866, catalogStarId: 'diphda', name: "Diphda (Beta Cet - Upper Tail Fluke)", isPrincipal: true, mag: 2.04, isAsterismCore: true },
      { ra: 0.3238, dec: -8.8239, name: "Iota Cet (Lower Tail Fluke)" }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 0], [1, 4], [4, 5], [5, 6], [6, 7], [7, 9], [6, 8], [8, 9], [9, 10]
    ],
    asterismLines: [[0, 1], [1, 2], [2, 3], [3, 0]]
  },

  // 22. chamaeleon
'chamaeleon': {
    mainAsterismName: "The Chameleon Silhouette",
    stars: [
      { ra: 8.3088, dec: -76.9197, catalogStarId: 'alpha-chamaeleontis', name: "Alpha Cha (Snout)", isPrincipal: true, mag: 4.07, isAsterismCore: true },
      { ra: 8.344, dec: -77.4845, name: "Theta Cha (Crested Head)" },
      { ra: 10.5911, dec: -78.6078, catalogStarId: 'gamma-chamaeleontis', name: "Gamma Cha (Back Spine)", mag: 4.11, isAsterismCore: true },
      { ra: 10.7545, dec: -80.4696, name: "Delta Cha (Flank)", isAsterismCore: true },
      { ra: 12.3058, dec: -79.3122, catalogStarId: 'beta-chamaeleontis', name: "Beta Cha (Curled Tail)", mag: 4.26, isAsterismCore: true },
      { ra: 11.9938, dec: -78.2218, name: "Epsilon Cha (Prehensile Tail Tip)" }
    ],
    lines: [
      [1, 0], [0, 2], [2, 3], [3, 4], [4, 5], [3, 5]
    ],
    asterismLines: [[0, 2], [2, 3], [3, 4]]
  },

  // 23. circinus
'circinus': {
    mainAsterismName: "Draftsman's Divider",
    stars: [
      { ra: 14.7085, dec: -64.9751, catalogStarId: 'alpha-circini', name: "Alpha Cir (Hinge Pivot)", isPrincipal: true, mag: 3.19, isAsterismCore: true },
      { ra: 15.2919, dec: -58.8012, catalogStarId: 'beta-circini', name: "Beta Cir (Left Pointer Needle)", mag: 4.07, isAsterismCore: true },
      { ra: 15.3896, dec: -59.3208, name: "Gamma Cir (Right Pointer Needle)", isAsterismCore: true },
      { ra: 15.2825, dec: -60.9573, name: "Delta Cir (Graduated Measurement Arc)" }
    ],
    lines: [
      [0, 1], [0, 2], [1, 3], [2, 3]
    ],
    asterismLines: [[0, 1], [0, 2]]
  },

  // 24. columba
'columba': {
    mainAsterismName: "Noah's Dove Wings",
    stars: [
      { ra: 5.5202, dec: -35.4705, name: "Epsilon Col (Beak / Olive Twig)" },
      { ra: 5.6608, dec: -34.0741, catalogStarId: 'phact', name: "Phact (Alpha Col - Breast)", isPrincipal: true, mag: 2.65, isAsterismCore: true },
      { ra: 5.8493, dec: -35.7683, catalogStarId: 'wazn', name: "Wazn (Beta Col - Body)", mag: 3.12, isAsterismCore: true },
      { ra: 5.9589, dec: -35.2833, name: "Gamma Col (East Wingtip)" },
      { ra: 6.3686, dec: -33.4364, name: "Delta Col (West Wingtip)", isAsterismCore: true },
      { ra: 6.1255, dec: -37.2529, name: "Theta Col (Tail Feathers)" }
    ],
    lines: [
      [0, 1], [1, 2], [1, 3], [2, 4], [2, 5]
    ],
    asterismLines: [[1, 2], [2, 4]]
  },

  // 25. coma-berenices
'coma-berenices': {
    mainAsterismName: "Berenice's Tresses",
    stars: [
      { ra: 13.1665, dec: 17.5295, catalogStarId: 'diadem', name: "Diadem (Alpha Com - Golden Diadem)", mag: 4.32, isAsterismCore: true },
      { ra: 13.1979, dec: 27.8782, catalogStarId: 'beta-comae-berenices', name: "Beta Com (Northern Tress)", isPrincipal: true, mag: 4.26, isAsterismCore: true },
      { ra: 12.449, dec: 28.2684, name: "Gamma Com (Eastern Tress)", isAsterismCore: true },
      { ra: 12.8616, dec: 27.5407, name: "31 Com (Center Cluster Stream)" },
      { ra: 12.449, dec: 28.2684, name: "15 Com (Flowing Braid)" }
    ],
    lines: [
      [0, 1], [0, 2], [1, 3], [2, 4], [3, 4], [4, 0]
    ],
    asterismLines: [[1, 0], [0, 2]]
  },

  // 26. corona-australis
'corona-australis': {
    mainAsterismName: "Southern Wreath",
    stars: [
      { ra: 19.1579, dec: -37.9045, catalogStarId: 'meridiana', name: "Meridiana (Alpha CrA - Crown Jewel)", isPrincipal: true, mag: 4.1, isAsterismCore: true },
      { ra: 19.1672, dec: -39.3408, name: "Beta CrA (West Gem 1)", isAsterismCore: true },
      { ra: 19.107, dec: -37.0634, name: "Gamma CrA (West Gem 2)", isAsterismCore: true },
      { ra: 19.1392, dec: -40.4967, name: "Delta CrA (West Tip)", isAsterismCore: true },
      { ra: 19.0519, dec: -42.0951, name: "Zeta CrA (North Gem)" },
      { ra: 18.9787, dec: -37.1073, name: "Epsilon CrA (East Gem 1)" },
      { ra: 18.5564, dec: -38.726, name: "Kappa CrA (East Tip)" }
    ],
    lines: [
      [3, 2], [2, 1], [1, 0], [0, 5], [5, 4], [4, 6]
    ],
    asterismLines: [[3, 2], [2, 1], [1, 0], [0, 5]]
  },

  // 27. corona-borealis
'corona-borealis': {
    mainAsterismName: "Ariadne's Crown",
    stars: [
      { ra: 15.5781, dec: 26.7147, catalogStarId: 'alphecca', name: "Alphecca (Alpha CrB - Gemma Pearl)", isPrincipal: true, mag: 2.21, isAsterismCore: true },
      { ra: 15.4638, dec: 29.1057, catalogStarId: 'nusakan', name: "Nusakan (Beta CrB - West Pearl 1)", mag: 3.66, isAsterismCore: true },
      { ra: 15.5488, dec: 31.3591, name: "Theta CrB (West Pearl 2)", isAsterismCore: true },
      { ra: 16.024, dec: 29.8511, name: "Iota CrB (West Terminal Tip)" },
      { ra: 15.7124, dec: 26.2956, name: "Gamma CrB (East Pearl 1)", isAsterismCore: true },
      { ra: 15.8266, dec: 26.0684, name: "Delta CrB (East Pearl 2)", isAsterismCore: true },
      { ra: 15.9598, dec: 26.8779, name: "Epsilon CrB (East Terminal Tip)", isAsterismCore: true }
    ],
    lines: [
      [3, 2], [2, 1], [1, 0], [0, 4], [4, 5], [5, 6]
    ],
    asterismLines: [[2, 1], [1, 0], [0, 4], [4, 5], [5, 6]]
  },

  // 28. corvus
'corvus': {
    mainAsterismName: "The Spica Spinnaker / Sail",
    stars: [
      { ra: 12.1402, dec: -24.7289, name: "Alchiba (Alpha Crv - Beak Pecking Hydra)", isAsterismCore: true },
      { ra: 12.1687, dec: -22.6198, name: "Minkar (Epsilon Crv - Head)", isAsterismCore: true },
      { ra: 12.4977, dec: -16.5154, catalogStarId: 'algorab', name: "Algorab (Delta Crv - North Wing)", mag: 2.94, isAsterismCore: true },
      { ra: 12.2634, dec: -17.5419, catalogStarId: 'gienah-corvi', name: "Gienah (Gamma Crv - Wingtip)", isPrincipal: true, mag: 2.58, isAsterismCore: true },
      { ra: 12.5731, dec: -23.3968, catalogStarId: 'kraz', name: "Kraz (Beta Crv - Tail / Foot)", mag: 2.65, isAsterismCore: true },
      { ra: 12.5345, dec: -16.196, name: "Eta Crv (Claw Grip)" }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 1], [4, 5]
    ],
    asterismLines: [[1, 2], [2, 3], [3, 4], [4, 1]]
  },

  // 29. crater
'crater': {
    mainAsterismName: "Apollo's Chalice",
    stars: [
      { ra: 11.3223, dec: -14.7785, catalogStarId: 'labrum', name: "Delta Crt (West Lip of Cup)", isPrincipal: true, mag: 3.56, isAsterismCore: true },
      { ra: 11.4147, dec: -17.684, name: "Gamma Crt (Center Rim)", isAsterismCore: true },
      { ra: 11.1943, dec: -22.8258, name: "Beta Crt (East Lip of Cup)", isAsterismCore: true },
      { ra: 11.4102, dec: -10.8593, name: "Epsilon Crt (West Bowl)", isAsterismCore: true },
      { ra: 11.746, dec: -18.3507, name: "Zeta Crt (East Bowl)", isAsterismCore: true },
      { ra: 11.9336, dec: -17.1508, name: "Eta Crt (Bowl Base)", isAsterismCore: true },
      { ra: 11.6114, dec: -9.8022, name: "Theta Crt (Chalice Stem)" },
      { ra: 10.9962, dec: -18.2988, catalogStarId: 'alkes', name: "Alkes (Alpha Crt - Pedestal Foot West)", mag: 4.08 },
      { ra: 12.0142, dec: -19.659, name: "31 Crt (Pedestal Foot East)" }
    ],
    lines: [
      [0, 1], [1, 2], [0, 3], [2, 4], [3, 5], [4, 5], [5, 6], [6, 7], [6, 8], [7, 8]
    ],
    asterismLines: [[0, 1], [1, 2], [2, 4], [4, 5], [5, 3], [3, 0]]
  },

  // 30. crux
'crux': {
    mainAsterismName: "The Southern Cross",
    stars: [
      { ra: 12.4433, dec: -63.0991, catalogStarId: 'acrux-a', name: "Acrux (Alpha Cru - Southern Foot)", isPrincipal: true, mag: 0.77, isAsterismCore: true },
      { ra: 12.5194, dec: -57.1132, catalogStarId: 'gacrux', name: "Gacrux (Gamma Cru - Northern Top)", mag: 1.64, isAsterismCore: true },
      { ra: 12.7954, dec: -59.6888, catalogStarId: 'mimosa', name: "Mimosa (Beta Cru - Eastern Arm)", mag: 1.25, isAsterismCore: true },
      { ra: 12.2524, dec: -58.7489, catalogStarId: 'imai', name: "Imai (Delta Cru - Western Arm)", mag: 2.79, isAsterismCore: true },
      { ra: 12.356, dec: -60.4011, name: "Ginan (Epsilon Cru - Fifth Diamond Star)", isAsterismCore: true }
    ],
    lines: [
      [1, 0], [2, 3], [1, 2], [2, 0], [0, 4], [4, 3], [3, 1]
    ],
    asterismLines: [[1, 0], [2, 3]]
  },

  // 31. cygnus
'cygnus': {
    mainAsterismName: "The Northern Cross",
    stars: [
      { ra: 20.6905, dec: 45.2803, catalogStarId: 'deneb', name: "Deneb (Alpha Cyg - Tail)", isPrincipal: true, mag: 1.25, isAsterismCore: true },
      { ra: 20.3705, dec: 40.2567, catalogStarId: 'sadr', name: "Sadr (Gamma Cyg - Swan Heart)", mag: 2.23, isAsterismCore: true },
      { ra: 19.9384, dec: 35.0834, name: "Eta Cyg (Slender Neck)" },
      { ra: 19.512, dec: 27.9597, catalogStarId: 'albireo', name: "Albireo (Beta Cyg - Golden-Blue Beak)", mag: 3.05, isAsterismCore: true },
      { ra: 19.7496, dec: 45.1308, catalogStarId: 'fawaris', name: "Delta Cyg (North Wing Joint)", mag: 2.87, isAsterismCore: true },
      { ra: 19.6074, dec: 50.2211, name: "Theta Cyg (Outer North Wing)" },
      { ra: 19.4951, dec: 51.7298, name: "Iota Cyg (North Wingtip Feathers)" },
      { ra: 20.7702, dec: 33.9703, catalogStarId: 'gienah-cygni', name: "Gienah (Epsilon Cyg - South Wing Joint)", isAsterismCore: true },
      { ra: 21.2156, dec: 30.2269, name: "Zeta Cyg (Outer South Wing)" },
      { ra: 21.7357, dec: 28.7426, name: "Mu Cyg (South Wingtip Feathers)" }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [1, 4], [4, 5], [5, 6], [1, 7], [7, 8], [8, 9]
    ],
    asterismLines: [[0, 1], [1, 3], [4, 1], [1, 7]]
  },

  // 32. delphinus
'delphinus': {
    mainAsterismName: "Job's Coffin",
    stars: [
      { ra: 20.6258, dec: 14.5951, catalogStarId: 'rotanev', name: "Rotanev (Beta Del - Diamond Head)", isPrincipal: true, mag: 3.63, isAsterismCore: true },
      { ra: 20.6606, dec: 15.9122, catalogStarId: 'sualocin', name: "Sualocin (Alpha Del - Diamond Head)", mag: 3.77, isAsterismCore: true },
      { ra: 20.7776, dec: 16.1243, name: "Gamma Del (Diamond Head)", isAsterismCore: true },
      { ra: 20.7243, dec: 15.0746, name: "Delta Del (Diamond Head)", isAsterismCore: true },
      { ra: 20.5885, dec: 14.6742, name: "Zeta Del (Snout)" },
      { ra: 20.5658, dec: 13.0272, name: "Eta Del (Throat)" },
      { ra: 20.5535, dec: 11.3033, name: "Deneb Dulfim (Epsilon Del - Leaping Tail)", isAsterismCore: true },
      { ra: 20.6456, dec: 13.3151, name: "Theta Del (Upper Fluke)" },
      { ra: 20.6303, dec: 11.3777, name: "Iota Del (Lower Fluke)" }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 0], [2, 4], [3, 5], [5, 6], [6, 7], [6, 8]
    ],
    asterismLines: [[0, 1], [1, 2], [2, 3], [3, 0]]
  },

  // 33. dorado
'dorado': {
    mainAsterismName: "The Leaping Swordfish",
    stars: [
      { ra: 4.2671, dec: -51.4866, catalogStarId: 'gamma-doradus', name: "Gamma Dor (Sword Bill)", mag: 4.25 },
      { ra: 4.5666, dec: -55.045, catalogStarId: 'alpha-doradus', name: "Alpha Dor (Fish Eye & Head)", isPrincipal: true, mag: 3.27, isAsterismCore: true },
      { ra: 5.5604, dec: -62.4898, catalogStarId: 'beta-doradus', name: "Beta Dor (Dorsal Fin)", mag: 3.76, isAsterismCore: true },
      { ra: 5.7462, dec: -65.7355, name: "Delta Dor (Streamlined Flank)", isAsterismCore: true },
      { ra: 5.0918, dec: -57.4727, name: "Zeta Dor (Tail Peduncle)", isAsterismCore: true },
      { ra: 5.2293, dec: -67.1853, name: "Theta Dor (Tail Fin Fluke)" }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [1, 3]
    ],
    asterismLines: [[1, 2], [2, 3], [3, 4]]
  },

  // 34. draco
'draco': {
    mainAsterismName: "The Dragon's Head & Coils",
    stars: [
      { ra: 17.9434, dec: 51.4889, catalogStarId: 'eltanin', name: "Eltanin (Gamma Dra - Head)", isPrincipal: true, mag: 2.23, isAsterismCore: true },
      { ra: 17.5072, dec: 52.3014, catalogStarId: 'rastaban', name: "Rastaban (Beta Dra - Head)", mag: 2.79, isAsterismCore: true },
      { ra: 17.5369, dec: 55.1783, name: "Kuma (Nu Dra - Head)", isAsterismCore: true },
      { ra: 17.8921, dec: 56.8726, name: "Grumium (Xi Dra - Jaw)", isAsterismCore: true },
      { ra: 17.0889, dec: 54.47, name: "Mu Dra (Neck Loop)" },
      { ra: 18.3509, dec: 72.7328, name: "Chi Dra (Upper Coil)" },
      { ra: 17.1464, dec: 65.7146, name: "Aldhibah (Zeta Dra - High Coil)", isAsterismCore: true },
      { ra: 16.3999, dec: 61.5142, name: "Eta Dra (Polar Arc)", isAsterismCore: true },
      { ra: 16.0315, dec: 58.5653, name: "Theta Dra (Mid Body)" },
      { ra: 15.4155, dec: 58.9661, name: "Edasich (Iota Dra - Low Coil)", isAsterismCore: true },
      { ra: 14.0732, dec: 64.3759, catalogStarId: 'thuban', name: "Thuban (Alpha Dra - Ancient Pole Star)", mag: 3.67, isAsterismCore: true },
      { ra: 12.558, dec: 69.7882, name: "Kappa Dra (Tail Sweep)" },
      { ra: 11.5234, dec: 69.3311, name: "Giausar (Lambda Dra - Tail Tip)" }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 0], [0, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 12]
    ],
    asterismLines: [[0, 1], [1, 2], [2, 3], [3, 0]]
  },

  // 35. equuleus
'equuleus': {
    mainAsterismName: "Foal's Head",
    stars: [
      { ra: 21.2637, dec: 5.2479, catalogStarId: 'kitalpha', name: "Kitalpha (Alpha Equ - Muzzle)", isPrincipal: true, mag: 3.92, isAsterismCore: true },
      { ra: 21.1724, dec: 10.1316, name: "Gamma Equ (Forehead)", isAsterismCore: true },
      { ra: 21.2413, dec: 10.007, catalogStarId: 'delta-equulei', name: "Delta Equ (Ears)", mag: 4.47, isAsterismCore: true },
      { ra: 21.3816, dec: 6.8111, name: "Beta Equ (Neck / Mane)", isAsterismCore: true },
      { ra: 20.9846, dec: 4.2935, name: "Epsilon Equ (Throat)" }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 0]
    ],
    asterismLines: [[0, 1], [1, 2], [2, 3], [3, 0]]
  },

  // 36. eridanus
'eridanus': {
    mainAsterismName: "The Celestial River Course",
    stars: [
      { ra: 5.1308, dec: -5.0865, catalogStarId: 'cursa', name: "Cursa (Beta Eri - River Source near Rigel)", mag: 2.78, isAsterismCore: true },
      { ra: 3.9672, dec: -13.5085, name: "Zaurak (Gamma Eri - Upper Bend)", isAsterismCore: true },
      { ra: 3.7208, dec: -9.7634, name: "Rana (Delta Eri - Meander 1)" },
      { ra: 2.9405, dec: -8.8981, name: "Azha (Eta Eri - Northern Crest)" },
      { ra: 4.1978, dec: -6.8376, name: "Beid (Omicron1 Eri - Mid Meander)" },
      { ra: 3.2639, dec: -8.8197, name: "Zibal (Zeta Eri - Center Current)", isAsterismCore: true },
      { ra: 4.5925, dec: -30.5623, name: "Theemin (Upsilon2 Eri - Loop)" },
      { ra: 2.8506, dec: -21.004, name: "Angetenar (Tau2 Eri - Lower Sweep)" },
      { ra: 2.971, dec: -40.3047, catalogStarId: 'acamar', name: "Acamar (Theta Eri - Ancient River Mouth)", mag: 3.2, isAsterismCore: true },
      { ra: 2.6778, dec: -39.8554, name: "Iota Eri (Deep South Bend)" },
      { ra: 1.6286, dec: -57.2368, catalogStarId: 'achernar', name: "Achernar (Alpha Eri - Brilliant River Terminus)", isPrincipal: true, mag: 0.45, isAsterismCore: true }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10]
    ],
    asterismLines: [[0, 1], [1, 5], [5, 8], [8, 10]]
  },

  // 37. fornax
'fornax': {
    mainAsterismName: "Chemist's Alembic",
    stars: [
      { ra: 3.2013, dec: -28.9876, catalogStarId: 'dalim', name: "Dalim (Alpha For - Still Head)", isPrincipal: true, mag: 3.85, isAsterismCore: true },
      { ra: 2.8182, dec: -32.4059, catalogStarId: 'beta-fornacis', name: "Beta For (Receiver Vessel)", mag: 4.45, isAsterismCore: true },
      { ra: 2.0748, dec: -29.2968, name: "Nu For (Furnace Hearth)", isAsterismCore: true },
      { ra: 2.5641, dec: -28.2323, name: "Omega For (Combustion Base)" }
    ],
    lines: [
      [0, 1], [0, 2], [1, 2], [2, 3]
    ],
    asterismLines: [[0, 1], [0, 2]]
  },

  // 38. gemini
'gemini': {
    mainAsterismName: "The Twin Pillars & Feet",
    stars: [
      { ra: 7.5766, dec: 31.8883, catalogStarId: 'castor-aa', name: "Castor (Alpha Gem - Mortal Twin Head)", mag: 1.93, isAsterismCore: true },
      { ra: 7.7553, dec: 28.0262, catalogStarId: 'pollux', name: "Pollux (Beta Gem - Immortal Twin Head)", isPrincipal: true, mag: 1.14, isAsterismCore: true },
      { ra: 7.5767, dec: 31.8885, catalogStarId: 'castor-ba', name: "Castor B (Castor Shoulder)", mag: 2.97 },
      { ra: 6.7322, dec: 25.1311, catalogStarId: 'mebsuta', name: "Mebsuta (Epsilon Gem - Castor Waist)", isAsterismCore: true },
      { ra: 6.3827, dec: 22.5136, catalogStarId: 'tejat-posterior', name: "Tejat (Mu Gem - Castor Knee)" },
      { ra: 6.248, dec: 22.5068, catalogStarId: 'propus', name: "Propus (Eta Gem - Castor Foot)", isAsterismCore: true },
      { ra: 7.7408, dec: 24.398, name: "Kappa Gem (Pollux Shoulder)" },
      { ra: 7.3354, dec: 21.9823, catalogStarId: 'wasat', name: "Wasat (Delta Gem - Pollux Waist)", mag: 3.55, isAsterismCore: true },
      { ra: 7.0685, dec: 20.5703, catalogStarId: 'mekbuda', name: "Mekbuda (Zeta Gem - Pollux Knee)" },
      { ra: 6.6285, dec: 16.3993, catalogStarId: 'alhena', name: "Alhena (Gamma Gem - Pollux Foot)", mag: 1.93, isAsterismCore: true },
      { ra: 6.8798, dec: 33.9613, name: "Theta Gem (Embracing Arms Intertwined)" }
    ],
    lines: [
      [0, 2], [2, 3], [3, 4], [4, 5], [1, 6], [6, 7], [7, 8], [8, 9], [2, 10], [6, 10], [0, 1]
    ],
    asterismLines: [[0, 3], [3, 5], [1, 7], [7, 9]]
  },

  // 39. grus
'grus': {
    mainAsterismName: "The Flying Crane Wing",
    stars: [
      { ra: 21.8988, dec: -37.3649, catalogStarId: 'aldhanab', name: "Aldhanab (Gamma Gru - Crane Beak)", mag: 3.01, isAsterismCore: true },
      { ra: 22.8092, dec: -51.3169, name: "Epsilon Gru (Neck Curve)" },
      { ra: 23.0147, dec: -52.7541, name: "Zeta Gru (Throat)" },
      { ra: 22.1372, dec: -46.961, catalogStarId: 'alnair', name: "Alnair (Alpha Gru - Heart / Left Wing)", isPrincipal: true, mag: 1.74, isAsterismCore: true },
      { ra: 22.4878, dec: -43.4956, name: "Delta1 Gru (Left Wingtip)", isAsterismCore: true },
      { ra: 23.1146, dec: -43.5204, name: "Theta Gru (Right Wing Joint)" },
      { ra: 23.1726, dec: -45.2467, name: "Iota Gru (Right Wingtip)" },
      { ra: 22.7111, dec: -46.8846, catalogStarId: 'tiaki', name: "Tiaki (Beta Gru - Body / Flank)", mag: 2.11, isAsterismCore: true },
      { ra: 22.7605, dec: -53.5001, name: "Eta Gru (Trailing Long Legs)" }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4], [3, 5], [5, 6], [3, 7], [7, 8]
    ],
    asterismLines: [[0, 2], [2, 3], [3, 4], [3, 7]]
  },

  // 40. hercules
'hercules': {
    mainAsterismName: "The Keystone Asterism",
    stars: [
      { ra: 17.2441, dec: 14.3903, catalogStarId: 'rasalgethi', name: "Rasalgethi (Alpha Her - Hero Head)", mag: 3.35, isAsterismCore: true },
      { ra: 16.5037, dec: 21.4896, catalogStarId: 'kornephoros', name: "Kornephoros (Beta Her - Right Shoulder)", isPrincipal: true, mag: 2.77, isAsterismCore: true },
      { ra: 16.3653, dec: 19.1531, name: "Gamma Her (Left Shoulder)" },
      { ra: 17.2505, dec: 24.8392, catalogStarId: 'sarin', name: "Sarin (Delta Her - Keystone SE)", mag: 3.12, isAsterismCore: true },
      { ra: 16.6881, dec: 31.6027, catalogStarId: 'rutilicus', name: "Zeta Her (Keystone SW)", mag: 2.81, isAsterismCore: true },
      { ra: 17.2508, dec: 36.8092, name: "Pi Her (Keystone NE)", isAsterismCore: true },
      { ra: 17.0048, dec: 30.9264, name: "Epsilon Her (Keystone NW)", isAsterismCore: true },
      { ra: 17.9627, dec: 29.2479, name: "Xi Her (Club Elbow)" },
      { ra: 18.1257, dec: 28.7625, name: "Omicron Her (Club Knot)" },
      { ra: 18.1171, dec: 30.5621, name: "99 Her (Club Spike)" },
      { ra: 16.7149, dec: 38.9223, name: "Eta Her (Kneeling Thigh)", isAsterismCore: true },
      { ra: 17.6577, dec: 46.0063, name: "Iota Her (Knee on Draco)", isAsterismCore: true },
      { ra: 17.9376, dec: 37.2505, name: "Theta Her (Trailing Foot)" }
    ],
    lines: [
      [0, 1], [0, 2], [1, 3], [2, 4], [3, 4], [4, 6], [6, 5], [5, 3], [2, 7], [7, 8], [8, 9], [5, 10], [10, 11], [6, 12]
    ],
    asterismLines: [[3, 4], [4, 6], [6, 5], [5, 3]]
  },

  // 41. horologium
'horologium': {
    mainAsterismName: "Galileo's Pendulum",
    stars: [
      { ra: 4.2334, dec: -42.2944, catalogStarId: 'alpha-horologii', name: "Alpha Hor (Clock Dial Summit)", isPrincipal: true, mag: 3.85, isAsterismCore: true },
      { ra: 2.9799, dec: -64.0713, catalogStarId: 'beta-horologii', name: "Beta Hor (Dial West)", mag: 4.98, isAsterismCore: true },
      { ra: 4.1807, dec: -41.9936, name: "Delta Hor (Dial East)", isAsterismCore: true },
      { ra: 2.7576, dec: -63.7046, name: "Gamma Hor (Escapement Anchor)", isAsterismCore: true },
      { ra: 2.7093, dec: -50.8003, name: "Iota Hor (Oscillating Pendulum Bob)", isAsterismCore: true }
    ],
    lines: [
      [0, 1], [0, 2], [1, 3], [2, 3], [3, 4]
    ],
    asterismLines: [[0, 3], [3, 4]]
  },

  // 42. hydra
'hydra': {
    mainAsterismName: "Head of Hydra & Alphard",
    stars: [
      { ra: 8.646, dec: 3.3414, name: "Minchir (Sigma Hya - Snout)", isAsterismCore: true },
      { ra: 8.8072, dec: 5.8378, name: "Rho Hya (Crown)", isAsterismCore: true },
      { ra: 8.9232, dec: 5.9456, name: "Zeta Hya (Jaw)", isAsterismCore: true },
      { ra: 8.7796, dec: 6.4188, name: "Epsilon Hya (Throat)", isAsterismCore: true },
      { ra: 8.6276, dec: 5.7038, name: "Delta Hya (Neck Top)", isAsterismCore: true },
      { ra: 8.7204, dec: 3.3987, name: "Eta Hya (Neck Bottom)", isAsterismCore: true },
      { ra: 9.4598, dec: -8.6586, catalogStarId: 'alphard', name: "Alphard (Alpha Hya - The Solitary Heart)", isPrincipal: true, mag: 1.98, isAsterismCore: true },
      { ra: 9.6643, dec: -1.1428, name: "Iota Hya (Coil below Cancer)" },
      { ra: 9.2394, dec: 2.3143, name: "Theta Hya (Coil below Sextans)" },
      { ra: 13.3154, dec: -23.1715, catalogStarId: 'lida', name: "Gamma Hya (Coil below Crater)", mag: 2.99, isAsterismCore: true },
      { ra: 14.1062, dec: -26.6824, name: "Pi Hya (Coil below Corvus)" },
      { ra: 11.8818, dec: -33.9081, name: "Beta Hya (Tail Tip near Centaurus)" }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [4, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11]
    ],
    asterismLines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]]
  },

  // 43. hydrus
'hydrus': {
    mainAsterismName: "Southern Water Snake Arc",
    stars: [
      { ra: 1.9795, dec: -61.5698, catalogStarId: 'alpha-hydri', name: "Alpha Hyi (Head near Achernar)", mag: 2.86, isAsterismCore: true },
      { ra: 2.3625, dec: -68.6594, name: "Delta Hyi (Neck)" },
      { ra: 1.9156, dec: -67.6473, name: "Eta2 Hyi (Mid Coil)" },
      { ra: 2.6598, dec: -68.2669, name: "Epsilon Hyi (Lower Coil)", isAsterismCore: true },
      { ra: 0.4292, dec: -77.2542, catalogStarId: 'beta-hydri', name: "Beta Hyi (Tail at South Celestial Pole)", isPrincipal: true, mag: 2.8, isAsterismCore: true }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4]
    ],
    asterismLines: [[0, 3], [3, 4]]
  },

  // 44. indus
'indus': {
    mainAsterismName: "Hunter's Spear",
    stars: [
      { ra: 20.6261, dec: -47.2915, catalogStarId: 'alpha-indi', name: "The Persian (Alpha Ind - Feathered Headdress)", isPrincipal: true, mag: 3.11, isAsterismCore: true },
      { ra: 20.9135, dec: -58.4541, catalogStarId: 'beta-indi', name: "Beta Ind (East Shoulder)", mag: 3.67, isAsterismCore: true },
      { ra: 21.3311, dec: -53.4494, name: "Theta Ind (West Shoulder / Spear Grip)" },
      { ra: 21.9653, dec: -54.9926, name: "Delta Ind (Spear Shaft)" },
      { ra: 22.056, dec: -56.786, name: "Epsilon Ind (Spear Tip Pointing South)", isAsterismCore: true },
      { ra: 20.8247, dec: -46.2268, name: "Zeta Ind (Hunter Waist / Thigh)" },
      { ra: 20.734, dec: -51.921, name: "Eta Ind (Foot)" }
    ],
    lines: [
      [0, 1], [0, 2], [1, 5], [2, 5], [2, 3], [3, 4], [5, 6]
    ],
    asterismLines: [[0, 1], [1, 4]]
  }
};
