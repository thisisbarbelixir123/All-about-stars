import { ConstellationShape } from './constellationsCore';

// Define full constellation stick figures for all 88 constellations
export const FULL_CONSTELLATION_SHAPES: Record<string, ConstellationShape> = {
  // 1. andromeda
  'andromeda': {
    mainAsterismName: "Chained Maiden Line",
    stars: [
      { x: 32, y: 82, catalogStarId: 'alpheratz', name: "Alpheratz (Alpha And)", isPrincipal: true, mag: 2.06, isAsterismCore: true },
      { x: 44, y: 64, name: "Delta And", isAsterismCore: true },
      { x: 58, y: 46, catalogStarId: 'mirach', name: "Mirach (Beta And)", mag: 2.07, isAsterismCore: true },
      { x: 78, y: 28, catalogStarId: 'almach', name: "Almach (Gamma And)", mag: 2.1, isAsterismCore: true },
      { x: 30, y: 55, name: "Pi And (Right Arm)" },
      { x: 18, y: 48, name: "Theta And (Right Hand Chained)" },
      { x: 62, y: 62, name: "Mu And (Left Arm)" },
      { x: 74, y: 56, name: "Nu And (Left Hand Chained)" },
      { x: 48, y: 32, name: "51 And (Right Leg)" },
      { x: 86, y: 16, name: "Upsilon And (Left Foot)" }
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
      { x: 50, y: 16, name: "Theta Ant (Piston Handle)" },
      { x: 50, y: 38, catalogStarId: 'alpha-antliae', name: "Alpha Ant (Pump Valve)", isPrincipal: true, mag: 4.25, isAsterismCore: true },
      { x: 38, y: 62, catalogStarId: 'epsilon-antliae', name: "Epsilon Ant (Cylinder Wall)", mag: 4.51, isAsterismCore: true },
      { x: 62, y: 62, name: "Eta Ant (Compression Chamber)" },
      { x: 68, y: 84, catalogStarId: 'iota-antliae', name: "Iota Ant (Vacuum Base Reservoir)", mag: 4.6, isAsterismCore: true },
      { x: 32, y: 84, name: "Zeta Ant (Pressure Gauge Foot)" }
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
      { x: 82, y: 18, name: "Delta1 Aps (Beak)" },
      { x: 72, y: 30, catalogStarId: 'alpha-apodis', name: "Alpha Aps (Head & Eye)", isPrincipal: true, mag: 3.83, isAsterismCore: true },
      { x: 52, y: 50, catalogStarId: 'gamma-apodis', name: "Gamma Aps (Breast)", mag: 3.86, isAsterismCore: true },
      { x: 32, y: 68, catalogStarId: 'beta-apodis', name: "Beta Aps (Body / Flank)", mag: 4.24, isAsterismCore: true },
      { x: 58, y: 76, name: "Delta2 Aps (Wing Plumage)", isAsterismCore: true },
      { x: 18, y: 86, name: "Theta Aps (Trailing Tail Feather)" },
      { x: 38, y: 36, name: "Zeta Aps (Upper Wing)" }
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
      { x: 54, y: 16, name: "25 Aqr (Head)" },
      { x: 42, y: 26, catalogStarId: 'sadalmelik', name: "Sadalmelik (Alpha Aqr - Shoulder)", mag: 2.95, isAsterismCore: true },
      { x: 66, y: 24, catalogStarId: 'sadalsuud', name: "Sadalsuud (Beta Aqr - Left Shoulder)", isPrincipal: true, mag: 2.87, isAsterismCore: true },
      { x: 52, y: 40, name: "Ancha (Theta Aqr - Torso)" },
      { x: 34, y: 36, name: "Zeta Aqr (Urn Lip)", isAsterismCore: true },
      { x: 26, y: 42, name: "Gamma Aqr (Urn Body)", isAsterismCore: true },
      { x: 22, y: 35, name: "Eta Aqr (Urn Spout)", isAsterismCore: true },
      { x: 28, y: 48, name: "Pi Aqr (Urn Base)", isAsterismCore: true },
      { x: 26, y: 62, name: "Hydor (Lambda Aqr - Water Stream)" },
      { x: 32, y: 74, name: "Tau Aqr (Meandering Stream)" },
      { x: 22, y: 86, name: "88 Aqr (Stream Current)" },
      { x: 68, y: 68, catalogStarId: 'skat', name: "Skat (Delta Aqr - Right Leg)", mag: 3.27 },
      { x: 40, y: 90, name: "98 Aqr (Pool Reservoir)" }
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
      { x: 50, y: 28, catalogStarId: 'tarazed', name: "Tarazed (Gamma Aql - Head)", mag: 2.72, isAsterismCore: true },
      { x: 50, y: 42, catalogStarId: 'altair', name: "Altair (Alpha Aql - Heart)", isPrincipal: true, mag: 0.77, isAsterismCore: true },
      { x: 50, y: 56, catalogStarId: 'alshain', name: "Alshain (Beta Aql - Throat)", mag: 3.71, isAsterismCore: true },
      { x: 25, y: 32, name: "Zeta Aql (Northern Wing Inner)" },
      { x: 12, y: 20, name: "Epsilon Aql (Northern Wing Tip)" },
      { x: 74, y: 52, name: "Theta Aql (Southern Wing Inner)" },
      { x: 88, y: 64, name: "Eta Aql (Southern Wing Tip)" },
      { x: 44, y: 74, name: "Delta Aql (Tail Base)" },
      { x: 38, y: 88, name: "Lambda Aql (Tail Feathers)" }
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
      { x: 50, y: 18, catalogStarId: 'alpha-arae', name: "Alpha Ara (Altar Flame)", mag: 2.85, isAsterismCore: true },
      { x: 35, y: 35, catalogStarId: 'beta-arae', name: "Beta Ara (Left Cornice)", isPrincipal: true, mag: 2.85, isAsterismCore: true },
      { x: 65, y: 35, name: "Gamma Ara (Right Cornice)", isAsterismCore: true },
      { x: 35, y: 65, name: "Delta Ara (Left Pillar)", isAsterismCore: true },
      { x: 65, y: 65, catalogStarId: 'zeta-arae', name: "Zeta Ara (Right Pillar)", mag: 3.12, isAsterismCore: true },
      { x: 50, y: 82, name: "Epsilon Ara (Altar Pedestal Base)" },
      { x: 74, y: 82, name: "Eta Ara (Plinth Foot)" }
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
      { x: 26, y: 44, catalogStarId: 'mesarthim', name: "Mesarthim (Gamma Ari - Horn Tip)", mag: 3.88, isAsterismCore: true },
      { x: 40, y: 36, catalogStarId: 'sheratan', name: "Sheratan (Beta Ari - Horn Base)", mag: 2.64, isAsterismCore: true },
      { x: 55, y: 28, catalogStarId: 'hamal', name: "Hamal (Alpha Ari - Crown)", isPrincipal: true, mag: 2.01, isAsterismCore: true },
      { x: 68, y: 34, name: "Iota Ari (Muzzle)" },
      { x: 74, y: 48, name: "Bharani (41 Ari - Golden Fleece Back)" },
      { x: 86, y: 58, name: "39 Ari (Rump & Tail)" },
      { x: 48, y: 68, name: "Epsilon Ari (Foreleg)" },
      { x: 70, y: 75, name: "Delta Ari (Hind Leg)" }
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
      { x: 42, y: 15, name: "Delta Aur (Helmet Crest)" },
      { x: 30, y: 26, catalogStarId: 'capella-aa', name: "Capella (Alpha Aur - Heart Star)", isPrincipal: true, mag: 0.08, isAsterismCore: true },
      { x: 65, y: 24, catalogStarId: 'menkalinan', name: "Menkalinan (Beta Aur - Left Shoulder)", mag: 1.9, isAsterismCore: true },
      { x: 74, y: 58, name: "Mahasim (Theta Aur - Chariot Reins)", isAsterismCore: true },
      { x: 58, y: 84, name: "Elnath (Beta Tau - Charioteer Left Foot)", isAsterismCore: true },
      { x: 26, y: 72, name: "Hassaleh (Iota Aur - Right Foot)", isAsterismCore: true },
      { x: 20, y: 38, catalogStarId: 'almaaz', name: "Almaaz (Epsilon Aur - Kid 1)", mag: 2.98, isAsterismCore: true },
      { x: 16, y: 48, catalogStarId: 'sadatoni', name: "Sadatoni (Zeta Aur - Kid 2)", isAsterismCore: true },
      { x: 22, y: 50, name: "Haedus II (Eta Aur - Kid 3)", isAsterismCore: true }
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
      { x: 50, y: 18, catalogStarId: 'nekkar', name: "Nekkar (Beta Boo - Head)", isAsterismCore: true },
      { x: 32, y: 30, catalogStarId: 'seginus', name: "Seginus (Gamma Boo - Right Shoulder)", isAsterismCore: true },
      { x: 68, y: 32, name: "Delta Boo (Left Shoulder)", isAsterismCore: true },
      { x: 58, y: 52, catalogStarId: 'izar', name: "Izar (Epsilon Boo - Belt)", mag: 2.35, isAsterismCore: true },
      { x: 50, y: 72, catalogStarId: 'arcturus', name: "Arcturus (Alpha Boo - Heart/Knees)", isPrincipal: true, mag: -0.05, isAsterismCore: true },
      { x: 36, y: 84, catalogStarId: 'muphrid', name: "Muphrid (Eta Boo - Left Foot)", mag: 2.68, isAsterismCore: true },
      { x: 76, y: 16, name: "Asellus Primus (Theta Boo - Raised Crook Staff)" },
      { x: 84, y: 10, name: "Asellus Secundus (Iota Boo - Staff Tip)" },
      { x: 18, y: 22, name: "Asellus Tertius (Kappa Boo - Hunting Dogs Leash)" }
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
      { x: 42, y: 18, catalogStarId: 'alpha-caeli', name: "Alpha Cae (Beveled Cutting Edge)", isPrincipal: true, mag: 4.45, isAsterismCore: true },
      { x: 58, y: 22, name: "Beta Cae (Edge Corner)", isAsterismCore: true },
      { x: 50, y: 50, name: "Gamma Cae (Chisel Steel Shaft)", isAsterismCore: true },
      { x: 46, y: 70, name: "Delta Cae (Bolster Collar)" },
      { x: 52, y: 86, name: "Zeta Cae (Mallet Striking Handle)" }
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
      { x: 35, y: 14, name: "7 Cam (Snout & Horns)" },
      { x: 45, y: 18, name: "Gamma Cam (Crown)" },
      { x: 48, y: 38, catalogStarId: 'alpha-camelopardalis', name: "Alpha Cam (Neck Apex)", mag: 4.29, isAsterismCore: true },
      { x: 52, y: 54, name: "BE Cam (Mid-Neck)" },
      { x: 62, y: 68, catalogStarId: 'beta-camelopardalis', name: "Beta Cam (Withers / Shoulders)", isPrincipal: true, mag: 4.02, isAsterismCore: true },
      { x: 76, y: 70, name: "CS Cam (Back & Rump)", isAsterismCore: true },
      { x: 54, y: 88, name: "11 Cam (Front Hooves)" },
      { x: 80, y: 90, name: "12 Cam (Hind Hooves)" }
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
      { x: 46, y: 40, name: "Asellus Borealis (Gamma Cnc - Carapace)", isAsterismCore: true },
      { x: 54, y: 48, catalogStarId: 'asellus-australis', name: "Asellus Australis (Delta Cnc - Carapace)", mag: 3.94, isAsterismCore: true },
      { x: 50, y: 44, name: "Praesepe (Beehive Cluster M44 - Shell Heart)", isAsterismCore: true },
      { x: 30, y: 22, name: "Iota Cnc (North Claw)", isAsterismCore: true },
      { x: 18, y: 16, name: "Chi Cnc (Pincer Tip)" },
      { x: 72, y: 68, catalogStarId: 'acubens', name: "Acubens (Alpha Cnc - South Claw)", mag: 4.26, isAsterismCore: true },
      { x: 84, y: 76, name: "60 Cnc (Lower Pincer Tip)" },
      { x: 26, y: 56, name: "Tegmine (Zeta Cnc - West Walking Leg)" },
      { x: 62, y: 84, catalogStarId: 'tarf', name: "Altarf (Beta Cnc - South Walking Leg)", isPrincipal: true, mag: 3.52, isAsterismCore: true }
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
      { x: 66, y: 42, catalogStarId: 'cor-caroli', name: "Cor Caroli (Alpha CVn - Asterion Heart)", isPrincipal: true, mag: 2.89, isAsterismCore: true },
      { x: 80, y: 32, name: "24 CVn (Asterion Snout)" },
      { x: 34, y: 56, catalogStarId: 'chara', name: "Chara (Beta CVn - Hound Chara)", mag: 4.26, isAsterismCore: true },
      { x: 18, y: 68, name: "10 CVn (Chara Forepaw)" },
      { x: 50, y: 48, name: "Tuiren (Tether Leash Collar)" }
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
      { x: 42, y: 36, catalogStarId: 'sirius-a', name: "Sirius (Alpha CMa - Blazing Chest)", isPrincipal: true, mag: -1.46, isAsterismCore: true },
      { x: 56, y: 22, catalogStarId: 'muliphein', name: "Muliphein (Gamma CMa - Snout)" },
      { x: 50, y: 16, name: "Theta CMa (Ear / Crown)" },
      { x: 24, y: 48, catalogStarId: 'mirzam', name: "Mirzam (Beta CMa - Front Paw)", mag: 1.98, isAsterismCore: true },
      { x: 18, y: 66, name: "Zeta CMa (Front Foot)" },
      { x: 66, y: 60, catalogStarId: 'wezen', name: "Wezen (Delta CMa - Spine / Rump)", mag: 1.83, isAsterismCore: true },
      { x: 52, y: 78, catalogStarId: 'adhara', name: "Adhara (Epsilon CMa - Thigh)", mag: 1.5, isAsterismCore: true },
      { x: 76, y: 82, catalogStarId: 'aludra', name: "Aludra (Eta CMa - Hind Paw)", isAsterismCore: true },
      { x: 84, y: 52, name: "Omicron2 CMa (Tail Tip)" }
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
      { x: 62, y: 55, catalogStarId: 'procyon-a', name: "Procyon (Alpha CMi - Body)", isPrincipal: true, mag: 0.34, isAsterismCore: true },
      { x: 38, y: 36, catalogStarId: 'gomeisa', name: "Gomeisa (Beta CMi - Neck)", mag: 2.89, isAsterismCore: true },
      { x: 24, y: 26, name: "Gamma CMi (Snout)" },
      { x: 48, y: 72, name: "Epsilon CMi (Forepaw)" }
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
      { x: 20, y: 26, name: "Algedi (Alpha Cap - Horn Tip)", isAsterismCore: true },
      { x: 26, y: 34, name: "Dabih (Beta Cap - Goat Eye)", isAsterismCore: true },
      { x: 18, y: 44, name: "Nu Cap (Bearded Muzzle)" },
      { x: 32, y: 60, name: "Psi Cap (Chest & Foreleg)" },
      { x: 26, y: 74, name: "Omega Cap (Front Hoof)" },
      { x: 50, y: 48, name: "Theta Cap (Spine / Dorsal Ridge)", isAsterismCore: true },
      { x: 66, y: 52, name: "Iota Cap (Fish Body)", isAsterismCore: true },
      { x: 80, y: 56, name: "Nashira (Gamma Cap - Tail Peduncle)", isAsterismCore: true },
      { x: 84, y: 44, catalogStarId: 'deneb-algedi', name: "Deneb Algedi (Delta Cap - Upper Fluke)", isPrincipal: true, mag: 2.81, isAsterismCore: true },
      { x: 88, y: 68, name: "Zeta Cap (Lower Fluke)" }
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
      { x: 32, y: 22, catalogStarId: 'canopus', name: "Canopus (Alpha Car - Masthead Beacon)", isPrincipal: true, mag: -0.74, isAsterismCore: true },
      { x: 60, y: 34, catalogStarId: 'avior', name: "Avior (Epsilon Car - Gunwale)", mag: 1.86, isAsterismCore: true },
      { x: 80, y: 48, catalogStarId: 'aspidiske', name: "Aspidiske (Iota Car - Bow Hull)", isAsterismCore: true },
      { x: 66, y: 66, name: "Theta Car (Diamond Cross Keel)", isAsterismCore: true },
      { x: 44, y: 82, catalogStarId: 'miaplacidus', name: "Miaplacidus (Beta Car - Stern Keel)", isAsterismCore: true },
      { x: 26, y: 66, name: "Upsilon Car (Rudder Steering Oar)" },
      { x: 16, y: 52, name: "Chi Car (Tiller Arm)" }
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
      { x: 18, y: 48, catalogStarId: 'caph', name: "Caph (Beta Cas - Crown Peak 1)", isAsterismCore: true },
      { x: 34, y: 64, catalogStarId: 'schedar', name: "Schedar (Alpha Cas - Lap / Jewel)", isPrincipal: true, mag: 2.24, isAsterismCore: true },
      { x: 52, y: 42, name: "Navi (Gamma Cas - Crown Center)", isAsterismCore: true },
      { x: 68, y: 60, catalogStarId: 'ruchbah', name: "Ruchbah (Delta Cas - Knee)", isAsterismCore: true },
      { x: 84, y: 38, catalogStarId: 'segin', name: "Segin (Epsilon Cas - Crown Peak 2)", isAsterismCore: true },
      { x: 88, y: 20, name: "Iota Cas (Throne Backrest Top)" },
      { x: 72, y: 16, name: "50 Cas (Throne Canopy)" },
      { x: 42, y: 80, name: "Zeta Cas / Fulu (Throne Base)" },
      { x: 28, y: 82, catalogStarId: 'achird', name: "Achird (Eta Cas - Footstool)" }
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
      { x: 48, y: 14, catalogStarId: 'menkent', name: "Menkent (Theta Cen - Head)", isAsterismCore: true },
      { x: 40, y: 28, catalogStarId: 'muhlifain', name: "Muhlifain (Gamma Cen - Right Shoulder)" },
      { x: 58, y: 30, name: "Nu Cen (Left Shoulder)" },
      { x: 74, y: 22, name: "Delta Cen (Spearhead)" },
      { x: 48, y: 44, name: "Epsilon Cen (Human Waist)" },
      { x: 56, y: 46, name: "Zeta Cen (Horse Withers)" },
      { x: 34, y: 56, name: "Iota Cen (Horse Rump)" },
      { x: 26, y: 70, name: "d Cen (Hind Flank)" },
      { x: 20, y: 86, name: "k Cen (Hind Hoof)" },
      { x: 62, y: 76, name: "Hadar (Beta Cen - Front Knee Pointer)", isAsterismCore: true },
      { x: 78, y: 86, catalogStarId: 'alpha-centauri-a', name: "Rigil Kentaurus (Alpha Cen - Front Hoof Pointer)", isPrincipal: true, mag: 0.01, isAsterismCore: true }
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
      { x: 50, y: 14, name: "Errai (Gamma Cep - Royal Crown Peak)", isAsterismCore: true },
      { x: 32, y: 34, name: "Alfirk (Beta Cep - Western Crown Base)", isAsterismCore: true },
      { x: 68, y: 34, name: "Iota Cep (Eastern Crown Base)", isAsterismCore: true },
      { x: 24, y: 64, catalogStarId: 'alderamin', name: "Alderamin (Alpha Cep - Right Shoulder)", isPrincipal: true, mag: 2.45, isAsterismCore: true },
      { x: 76, y: 64, name: "Zeta Cep (Left Shoulder)", isAsterismCore: true },
      { x: 80, y: 82, name: "Delta Cep (Royal Robes Hem)", isAsterismCore: true },
      { x: 20, y: 80, name: "Epsilon Cep (Robe Hem West)" },
      { x: 48, y: 52, catalogStarId: 'mu-cephei', name: "Garnet Star (Mu Cep - Heart Jewel)", mag: 4.08 }
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
      { x: 80, y: 28, catalogStarId: 'menkar', name: "Menkar (Alpha Cet - Upper Jaw)", mag: 2.54, isAsterismCore: true },
      { x: 70, y: 38, catalogStarId: 'kaffaljidhma', name: "Kaffaljidhma (Gamma Cet - Snout)", isAsterismCore: true },
      { x: 78, y: 48, name: "Mu Cet (Lower Jaw)", isAsterismCore: true },
      { x: 88, y: 40, name: "Xi2 Cet (Tooth)", isAsterismCore: true },
      { x: 60, y: 46, name: "Delta Cet (Neck / Throat)", isAsterismCore: true },
      { x: 50, y: 60, catalogStarId: 'mira-a', name: "Mira (Omicron Cet - Pulsing Heart Variable)", mag: 3.5 },
      { x: 40, y: 68, catalogStarId: 'baten-kaitos', name: "Baten Kaitos (Zeta Cet - Belly / Flank)", mag: 3.74, isAsterismCore: true },
      { x: 28, y: 60, name: "Eta Cet (Tail Peduncle)" },
      { x: 30, y: 78, name: "Theta Cet (Lower Tail)" },
      { x: 18, y: 74, catalogStarId: 'diphda', name: "Diphda (Beta Cet - Upper Tail Fluke)", isPrincipal: true, mag: 2.04, isAsterismCore: true },
      { x: 10, y: 60, name: "Iota Cet (Lower Tail Fluke)" }
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
      { x: 76, y: 28, catalogStarId: 'alpha-chamaeleontis', name: "Alpha Cha (Snout)", isPrincipal: true, mag: 4.07, isAsterismCore: true },
      { x: 68, y: 18, name: "Theta Cha (Crested Head)" },
      { x: 50, y: 36, catalogStarId: 'gamma-chamaeleontis', name: "Gamma Cha (Back Spine)", mag: 4.11, isAsterismCore: true },
      { x: 36, y: 46, name: "Delta Cha (Flank)", isAsterismCore: true },
      { x: 22, y: 66, catalogStarId: 'beta-chamaeleontis', name: "Beta Cha (Curled Tail)", mag: 4.26, isAsterismCore: true },
      { x: 30, y: 82, name: "Epsilon Cha (Prehensile Tail Tip)" }
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
      { x: 50, y: 16, catalogStarId: 'alpha-circini', name: "Alpha Cir (Hinge Pivot)", isPrincipal: true, mag: 3.19, isAsterismCore: true },
      { x: 32, y: 76, catalogStarId: 'beta-circini', name: "Beta Cir (Left Pointer Needle)", mag: 4.07, isAsterismCore: true },
      { x: 68, y: 78, name: "Gamma Cir (Right Pointer Needle)", isAsterismCore: true },
      { x: 50, y: 52, name: "Delta Cir (Graduated Measurement Arc)" }
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
      { x: 70, y: 22, name: "Epsilon Col (Beak / Olive Twig)" },
      { x: 56, y: 36, catalogStarId: 'phact', name: "Phact (Alpha Col - Breast)", isPrincipal: true, mag: 2.65, isAsterismCore: true },
      { x: 42, y: 54, catalogStarId: 'wazn', name: "Wazn (Beta Col - Body)", mag: 3.12, isAsterismCore: true },
      { x: 76, y: 46, name: "Gamma Col (East Wingtip)" },
      { x: 58, y: 72, name: "Delta Col (West Wingtip)", isAsterismCore: true },
      { x: 26, y: 70, name: "Theta Col (Tail Feathers)" }
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
      { x: 50, y: 76, catalogStarId: 'diadem', name: "Diadem (Alpha Com - Golden Diadem)", mag: 4.32, isAsterismCore: true },
      { x: 30, y: 32, catalogStarId: 'beta-comae-berenices', name: "Beta Com (Northern Tress)", isPrincipal: true, mag: 4.26, isAsterismCore: true },
      { x: 70, y: 28, name: "Gamma Com (Eastern Tress)", isAsterismCore: true },
      { x: 44, y: 44, name: "31 Com (Center Cluster Stream)" },
      { x: 56, y: 52, name: "15 Com (Flowing Braid)" }
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
      { x: 48, y: 74, catalogStarId: 'meridiana', name: "Meridiana (Alpha CrA - Crown Jewel)", isPrincipal: true, mag: 4.1, isAsterismCore: true },
      { x: 36, y: 66, name: "Beta CrA (West Gem 1)", isAsterismCore: true },
      { x: 28, y: 54, name: "Gamma CrA (West Gem 2)", isAsterismCore: true },
      { x: 28, y: 40, name: "Delta CrA (West Tip)", isAsterismCore: true },
      { x: 38, y: 30, name: "Zeta CrA (North Gem)" },
      { x: 54, y: 28, name: "Epsilon CrA (East Gem 1)" },
      { x: 68, y: 36, name: "Kappa CrA (East Tip)" }
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
      { x: 50, y: 70, catalogStarId: 'alphecca', name: "Alphecca (Alpha CrB - Gemma Pearl)", isPrincipal: true, mag: 2.21, isAsterismCore: true },
      { x: 36, y: 60, catalogStarId: 'nusakan', name: "Nusakan (Beta CrB - West Pearl 1)", mag: 3.66, isAsterismCore: true },
      { x: 28, y: 46, name: "Theta CrB (West Pearl 2)", isAsterismCore: true },
      { x: 26, y: 32, name: "Iota CrB (West Terminal Tip)" },
      { x: 64, y: 60, name: "Gamma CrB (East Pearl 1)", isAsterismCore: true },
      { x: 72, y: 46, name: "Delta CrB (East Pearl 2)", isAsterismCore: true },
      { x: 74, y: 32, name: "Epsilon CrB (East Terminal Tip)", isAsterismCore: true }
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
      { x: 24, y: 76, name: "Alchiba (Alpha Crv - Beak Pecking Hydra)", isAsterismCore: true },
      { x: 38, y: 64, name: "Minkar (Epsilon Crv - Head)", isAsterismCore: true },
      { x: 48, y: 34, catalogStarId: 'algorab', name: "Algorab (Delta Crv - North Wing)", mag: 2.94, isAsterismCore: true },
      { x: 74, y: 28, catalogStarId: 'gienah-corvi', name: "Gienah (Gamma Crv - Wingtip)", isPrincipal: true, mag: 2.58, isAsterismCore: true },
      { x: 66, y: 72, catalogStarId: 'kraz', name: "Kraz (Beta Crv - Tail / Foot)", mag: 2.65, isAsterismCore: true },
      { x: 52, y: 80, name: "Eta Crv (Claw Grip)" }
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
      { x: 30, y: 22, catalogStarId: 'labrum', name: "Delta Crt (West Lip of Cup)", isPrincipal: true, mag: 3.56, isAsterismCore: true },
      { x: 50, y: 18, name: "Gamma Crt (Center Rim)", isAsterismCore: true },
      { x: 70, y: 22, name: "Beta Crt (East Lip of Cup)", isAsterismCore: true },
      { x: 32, y: 46, name: "Epsilon Crt (West Bowl)", isAsterismCore: true },
      { x: 68, y: 46, name: "Zeta Crt (East Bowl)", isAsterismCore: true },
      { x: 50, y: 52, name: "Eta Crt (Bowl Base)", isAsterismCore: true },
      { x: 50, y: 70, name: "Theta Crt (Chalice Stem)" },
      { x: 38, y: 86, catalogStarId: 'alkes', name: "Alkes (Alpha Crt - Pedestal Foot West)", mag: 4.08 },
      { x: 62, y: 86, name: "31 Crt (Pedestal Foot East)" }
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
      { x: 50, y: 84, catalogStarId: 'acrux-a', name: "Acrux (Alpha Cru - Southern Foot)", isPrincipal: true, mag: 0.77, isAsterismCore: true },
      { x: 50, y: 16, catalogStarId: 'gacrux', name: "Gacrux (Gamma Cru - Northern Top)", mag: 1.64, isAsterismCore: true },
      { x: 24, y: 46, catalogStarId: 'mimosa', name: "Mimosa (Beta Cru - Eastern Arm)", mag: 1.25, isAsterismCore: true },
      { x: 76, y: 44, catalogStarId: 'imai', name: "Imai (Delta Cru - Western Arm)", mag: 2.79, isAsterismCore: true },
      { x: 64, y: 62, name: "Ginan (Epsilon Cru - Fifth Diamond Star)", isAsterismCore: true }
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
      { x: 50, y: 16, catalogStarId: 'deneb', name: "Deneb (Alpha Cyg - Tail)", isPrincipal: true, mag: 1.25, isAsterismCore: true },
      { x: 50, y: 44, catalogStarId: 'sadr', name: "Sadr (Gamma Cyg - Swan Heart)", mag: 2.23, isAsterismCore: true },
      { x: 50, y: 66, name: "Eta Cyg (Slender Neck)" },
      { x: 50, y: 86, catalogStarId: 'albireo', name: "Albireo (Beta Cyg - Golden-Blue Beak)", mag: 3.05, isAsterismCore: true },
      { x: 28, y: 38, catalogStarId: 'fawaris', name: "Delta Cyg (North Wing Joint)", mag: 2.87, isAsterismCore: true },
      { x: 18, y: 28, name: "Theta Cyg (Outer North Wing)" },
      { x: 12, y: 18, name: "Iota Cyg (North Wingtip Feathers)" },
      { x: 72, y: 48, catalogStarId: 'gienah-cygni', name: "Gienah (Epsilon Cyg - South Wing Joint)", isAsterismCore: true },
      { x: 84, y: 58, name: "Zeta Cyg (Outer South Wing)" },
      { x: 90, y: 70, name: "Mu Cyg (South Wingtip Feathers)" }
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
      { x: 44, y: 34, catalogStarId: 'rotanev', name: "Rotanev (Beta Del - Diamond Head)", isPrincipal: true, mag: 3.63, isAsterismCore: true },
      { x: 58, y: 26, catalogStarId: 'sualocin', name: "Sualocin (Alpha Del - Diamond Head)", mag: 3.77, isAsterismCore: true },
      { x: 68, y: 38, name: "Gamma Del (Diamond Head)", isAsterismCore: true },
      { x: 54, y: 48, name: "Delta Del (Diamond Head)", isAsterismCore: true },
      { x: 78, y: 30, name: "Zeta Del (Snout)" },
      { x: 46, y: 52, name: "Eta Del (Throat)" },
      { x: 32, y: 68, name: "Deneb Dulfim (Epsilon Del - Leaping Tail)", isAsterismCore: true },
      { x: 20, y: 80, name: "Theta Del (Upper Fluke)" },
      { x: 22, y: 90, name: "Iota Del (Lower Fluke)" }
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
      { x: 80, y: 20, catalogStarId: 'gamma-doradus', name: "Gamma Dor (Sword Bill)", mag: 4.25 },
      { x: 66, y: 34, catalogStarId: 'alpha-doradus', name: "Alpha Dor (Fish Eye & Head)", isPrincipal: true, mag: 3.27, isAsterismCore: true },
      { x: 46, y: 28, catalogStarId: 'beta-doradus', name: "Beta Dor (Dorsal Fin)", mag: 3.76, isAsterismCore: true },
      { x: 42, y: 54, name: "Delta Dor (Streamlined Flank)", isAsterismCore: true },
      { x: 26, y: 74, name: "Zeta Dor (Tail Peduncle)", isAsterismCore: true },
      { x: 20, y: 88, name: "Theta Dor (Tail Fin Fluke)" }
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
      { x: 80, y: 18, catalogStarId: 'eltanin', name: "Eltanin (Gamma Dra - Head)", isPrincipal: true, mag: 2.23, isAsterismCore: true },
      { x: 72, y: 12, catalogStarId: 'rastaban', name: "Rastaban (Beta Dra - Head)", mag: 2.79, isAsterismCore: true },
      { x: 86, y: 12, name: "Kuma (Nu Dra - Head)", isAsterismCore: true },
      { x: 88, y: 22, name: "Grumium (Xi Dra - Jaw)", isAsterismCore: true },
      { x: 70, y: 32, name: "Mu Dra (Neck Loop)" },
      { x: 58, y: 35, name: "Chi Dra (Upper Coil)" },
      { x: 50, y: 24, name: "Aldhibah (Zeta Dra - High Coil)", isAsterismCore: true },
      { x: 40, y: 22, name: "Eta Dra (Polar Arc)", isAsterismCore: true },
      { x: 30, y: 30, name: "Theta Dra (Mid Body)" },
      { x: 24, y: 46, name: "Edasich (Iota Dra - Low Coil)", isAsterismCore: true },
      { x: 32, y: 62, catalogStarId: 'thuban', name: "Thuban (Alpha Dra - Ancient Pole Star)", mag: 3.67, isAsterismCore: true },
      { x: 44, y: 70, name: "Kappa Dra (Tail Sweep)" },
      { x: 30, y: 84, name: "Giausar (Lambda Dra - Tail Tip)" }
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
      { x: 72, y: 34, catalogStarId: 'kitalpha', name: "Kitalpha (Alpha Equ - Muzzle)", isPrincipal: true, mag: 3.92, isAsterismCore: true },
      { x: 56, y: 24, name: "Gamma Equ (Forehead)", isAsterismCore: true },
      { x: 44, y: 18, catalogStarId: 'delta-equulei', name: "Delta Equ (Ears)", mag: 4.47, isAsterismCore: true },
      { x: 34, y: 44, name: "Beta Equ (Neck / Mane)", isAsterismCore: true },
      { x: 50, y: 54, name: "Epsilon Equ (Throat)" }
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
      { x: 82, y: 14, catalogStarId: 'cursa', name: "Cursa (Beta Eri - River Source near Rigel)", mag: 2.78, isAsterismCore: true },
      { x: 74, y: 26, name: "Zaurak (Gamma Eri - Upper Bend)", isAsterismCore: true },
      { x: 62, y: 30, name: "Rana (Delta Eri - Meander 1)" },
      { x: 52, y: 24, name: "Azha (Eta Eri - Northern Crest)" },
      { x: 44, y: 34, name: "Beid (Omicron1 Eri - Mid Meander)" },
      { x: 42, y: 48, name: "Zibal (Zeta Eri - Center Current)", isAsterismCore: true },
      { x: 50, y: 60, name: "Theemin (Upsilon2 Eri - Loop)" },
      { x: 42, y: 70, name: "Angetenar (Tau2 Eri - Lower Sweep)" },
      { x: 32, y: 78, catalogStarId: 'acamar', name: "Acamar (Theta Eri - Ancient River Mouth)", mag: 3.2, isAsterismCore: true },
      { x: 24, y: 82, name: "Iota Eri (Deep South Bend)" },
      { x: 14, y: 90, catalogStarId: 'achernar', name: "Achernar (Alpha Eri - Brilliant River Terminus)", isPrincipal: true, mag: 0.45, isAsterismCore: true }
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
      { x: 44, y: 26, catalogStarId: 'dalim', name: "Dalim (Alpha For - Still Head)", isPrincipal: true, mag: 3.85, isAsterismCore: true },
      { x: 64, y: 46, catalogStarId: 'beta-fornacis', name: "Beta For (Receiver Vessel)", mag: 4.45, isAsterismCore: true },
      { x: 36, y: 68, name: "Nu For (Furnace Hearth)", isAsterismCore: true },
      { x: 54, y: 84, name: "Omega For (Combustion Base)" }
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
      { x: 34, y: 16, catalogStarId: 'castor-aa', name: "Castor (Alpha Gem - Mortal Twin Head)", mag: 1.93, isAsterismCore: true },
      { x: 66, y: 16, catalogStarId: 'pollux', name: "Pollux (Beta Gem - Immortal Twin Head)", isPrincipal: true, mag: 1.14, isAsterismCore: true },
      { x: 26, y: 32, catalogStarId: 'castor-ba', name: "Castor B (Castor Shoulder)", mag: 2.97 },
      { x: 26, y: 52, catalogStarId: 'mebsuta', name: "Mebsuta (Epsilon Gem - Castor Waist)", isAsterismCore: true },
      { x: 20, y: 72, catalogStarId: 'tejat-posterior', name: "Tejat (Mu Gem - Castor Knee)" },
      { x: 14, y: 84, catalogStarId: 'propus', name: "Propus (Eta Gem - Castor Foot)", isAsterismCore: true },
      { x: 74, y: 32, name: "Kappa Gem (Pollux Shoulder)" },
      { x: 64, y: 50, catalogStarId: 'wasat', name: "Wasat (Delta Gem - Pollux Waist)", mag: 3.55, isAsterismCore: true },
      { x: 68, y: 68, catalogStarId: 'mekbuda', name: "Mekbuda (Zeta Gem - Pollux Knee)" },
      { x: 60, y: 86, catalogStarId: 'alhena', name: "Alhena (Gamma Gem - Pollux Foot)", mag: 1.93, isAsterismCore: true },
      { x: 46, y: 36, name: "Theta Gem (Embracing Arms Intertwined)" }
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
      { x: 50, y: 14, catalogStarId: 'aldhanab', name: "Aldhanab (Gamma Gru - Crane Beak)", mag: 3.01, isAsterismCore: true },
      { x: 50, y: 32, name: "Epsilon Gru (Neck Curve)" },
      { x: 50, y: 46, name: "Zeta Gru (Throat)" },
      { x: 38, y: 62, catalogStarId: 'alnair', name: "Alnair (Alpha Gru - Heart / Left Wing)", isPrincipal: true, mag: 1.74, isAsterismCore: true },
      { x: 18, y: 48, name: "Delta1 Gru (Left Wingtip)", isAsterismCore: true },
      { x: 74, y: 66, name: "Theta Gru (Right Wing Joint)" },
      { x: 86, y: 74, name: "Iota Gru (Right Wingtip)" },
      { x: 44, y: 78, catalogStarId: 'tiaki', name: "Tiaki (Beta Gru - Body / Flank)", mag: 2.11, isAsterismCore: true },
      { x: 48, y: 92, name: "Eta Gru (Trailing Long Legs)" }
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
      { x: 50, y: 84, catalogStarId: 'rasalgethi', name: "Rasalgethi (Alpha Her - Hero Head)", mag: 3.35, isAsterismCore: true },
      { x: 36, y: 70, catalogStarId: 'kornephoros', name: "Kornephoros (Beta Her - Right Shoulder)", isPrincipal: true, mag: 2.77, isAsterismCore: true },
      { x: 64, y: 70, name: "Gamma Her (Left Shoulder)" },
      { x: 34, y: 48, catalogStarId: 'sarin', name: "Sarin (Delta Her - Keystone SE)", mag: 3.12, isAsterismCore: true },
      { x: 62, y: 48, catalogStarId: 'rutilicus', name: "Zeta Her (Keystone SW)", mag: 2.81, isAsterismCore: true },
      { x: 38, y: 30, name: "Pi Her (Keystone NE)", isAsterismCore: true },
      { x: 58, y: 32, name: "Epsilon Her (Keystone NW)", isAsterismCore: true },
      { x: 78, y: 56, name: "Xi Her (Club Elbow)" },
      { x: 88, y: 44, name: "Omicron Her (Club Knot)" },
      { x: 92, y: 32, name: "99 Her (Club Spike)" },
      { x: 42, y: 18, name: "Eta Her (Kneeling Thigh)", isAsterismCore: true },
      { x: 28, y: 12, name: "Iota Her (Knee on Draco)", isAsterismCore: true },
      { x: 68, y: 20, name: "Theta Her (Trailing Foot)" }
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
      { x: 50, y: 18, catalogStarId: 'alpha-horologii', name: "Alpha Hor (Clock Dial Summit)", isPrincipal: true, mag: 3.85, isAsterismCore: true },
      { x: 36, y: 36, catalogStarId: 'beta-horologii', name: "Beta Hor (Dial West)", mag: 4.98, isAsterismCore: true },
      { x: 64, y: 36, name: "Delta Hor (Dial East)", isAsterismCore: true },
      { x: 50, y: 58, name: "Gamma Hor (Escapement Anchor)", isAsterismCore: true },
      { x: 50, y: 84, name: "Iota Hor (Oscillating Pendulum Bob)", isAsterismCore: true }
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
      { x: 84, y: 18, name: "Minchir (Sigma Hya - Snout)", isAsterismCore: true },
      { x: 76, y: 14, name: "Rho Hya (Crown)", isAsterismCore: true },
      { x: 80, y: 26, name: "Zeta Hya (Jaw)", isAsterismCore: true },
      { x: 90, y: 26, name: "Epsilon Hya (Throat)", isAsterismCore: true },
      { x: 88, y: 34, name: "Delta Hya (Neck Top)", isAsterismCore: true },
      { x: 78, y: 34, name: "Eta Hya (Neck Bottom)", isAsterismCore: true },
      { x: 66, y: 44, catalogStarId: 'alphard', name: "Alphard (Alpha Hya - The Solitary Heart)", isPrincipal: true, mag: 1.98, isAsterismCore: true },
      { x: 54, y: 52, name: "Iota Hya (Coil below Cancer)" },
      { x: 44, y: 48, name: "Theta Hya (Coil below Sextans)" },
      { x: 34, y: 62, catalogStarId: 'lida', name: "Gamma Hya (Coil below Crater)", mag: 2.99, isAsterismCore: true },
      { x: 24, y: 72, name: "Pi Hya (Coil below Corvus)" },
      { x: 12, y: 82, name: "Beta Hya (Tail Tip near Centaurus)" }
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
      { x: 80, y: 26, catalogStarId: 'alpha-hydri', name: "Alpha Hyi (Head near Achernar)", mag: 2.86, isAsterismCore: true },
      { x: 66, y: 44, name: "Delta Hyi (Neck)" },
      { x: 46, y: 54, name: "Eta2 Hyi (Mid Coil)" },
      { x: 36, y: 68, name: "Epsilon Hyi (Lower Coil)", isAsterismCore: true },
      { x: 20, y: 84, catalogStarId: 'beta-hydri', name: "Beta Hyi (Tail at South Celestial Pole)", isPrincipal: true, mag: 2.8, isAsterismCore: true }
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
      { x: 50, y: 18, catalogStarId: 'alpha-indi', name: "The Persian (Alpha Ind - Feathered Headdress)", isPrincipal: true, mag: 3.11, isAsterismCore: true },
      { x: 66, y: 38, catalogStarId: 'beta-indi', name: "Beta Ind (East Shoulder)", mag: 3.67, isAsterismCore: true },
      { x: 36, y: 40, name: "Theta Ind (West Shoulder / Spear Grip)" },
      { x: 30, y: 64, name: "Delta Ind (Spear Shaft)" },
      { x: 24, y: 84, name: "Epsilon Ind (Spear Tip Pointing South)", isAsterismCore: true },
      { x: 62, y: 66, name: "Zeta Ind (Hunter Waist / Thigh)" },
      { x: 66, y: 88, name: "Eta Ind (Foot)" }
    ],
    lines: [
      [0, 1], [0, 2], [1, 5], [2, 5], [2, 3], [3, 4], [5, 6]
    ],
    asterismLines: [[0, 1], [1, 4]]
  }
};
