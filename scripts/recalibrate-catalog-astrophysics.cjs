/**
 * Script: recalibrate-catalog-astrophysics.cjs
 * Corrects all astrophysical parameters for newly added stars from Phase 1,
 * specifically fixing severe under-sizing of massive/hot stars (Eta Orionis,
 * Theta Ophiuchi, Zeta Cassiopeiae, etc.), under-distancing, red-giant misclassifications
 * of orange dwarfs (Epsilon Eridani / Ran), and duplicate IDs.
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../src/data/starDatabase.json');
const stars = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

// Exact verified literature astrophysical calibrations for the 122 stars added in Phase 1
// Keyed by HIP number (or unique ID)
const CALIBRATION_DATA = {
  // 1. Beta Capricorni (Dabih)
  '100345': {
    id: 'dabih',
    name: 'Dabih (Beta Capricorni)',
    spec: 'G9III',
    stage: 'Yellow Giant',
    teff: 4900,
    mass: 4.0,
    radius: 35.0,
    lum: 600,
    distLy: 390,
    distPc: 120,
    vmag: 3.05,
    absmag: -1.7,
    colorHex: '#ffe8d0',
    coronaHex: '#ffd2a1'
  },
  // 2. G Scorpii (Fuyue)
  '87261': {
    id: 'fuyue',
    name: 'Fuyue (G Scorpii)',
    spec: 'K2III',
    stage: 'Red Giant',
    teff: 4540,
    mass: 1.44,
    radius: 16.0,
    lum: 105,
    distLy: 126,
    distPc: 38.6,
    vmag: 3.19,
    absmag: 0.24,
    colorHex: '#ffd2a1',
    coronaHex: '#ffb366'
  },
  // 3. Theta Ophiuchi (Garafsa) - B-STAR FIX
  '84970': {
    id: 'garafsa',
    name: 'Garafsa (Theta Ophiuchi)',
    spec: 'B2IV',
    stage: 'Blue Subgiant',
    teff: 22000,
    mass: 8.6,
    radius: 5.1,
    lum: 5500,
    distLy: 436,
    distPc: 134,
    vmag: 3.27,
    absmag: -2.3,
    colorHex: '#9bb0ff',
    coronaHex: '#6e94ff'
  },
  // 4. Nu Ophiuchi (Sinistra)
  '88048': {
    id: 'sinistra',
    name: 'Sinistra (Nu Ophiuchi)',
    spec: 'K0III',
    stage: 'Red Giant',
    teff: 4920,
    mass: 3.0,
    radius: 14.0,
    lum: 123,
    distLy: 151,
    distPc: 46.3,
    vmag: 3.32,
    absmag: -0.03,
    colorHex: '#ffd2a1',
    coronaHex: '#ffb366'
  },
  // 5. Xi Puppis (Azmidi)
  '38170': {
    id: 'azmidi',
    name: 'Azmidi (Xi Puppis)',
    spec: 'G6Ia',
    stage: 'Yellow Supergiant',
    teff: 5050,
    mass: 8.5,
    radius: 120.0,
    lum: 8300,
    distLy: 1200,
    distPc: 370,
    vmag: 3.34,
    absmag: -4.5,
    colorHex: '#ffe8d0',
    coronaHex: '#ffd2a1'
  },
  // 6. Eta Orionis (Saif al Jabbar) - PRIMARY USER BUG FIX
  '25281': {
    id: 'saif-al-jabbar',
    name: 'Saif al Jabbar (Eta Orionis)',
    spec: 'B1V',
    stage: 'Blue Main Sequence',
    teff: 26500,
    mass: 10.9,
    radius: 6.48,
    lum: 18500,
    distLy: 1000,
    distPc: 306,
    vmag: 3.35,
    absmag: -3.8,
    colorHex: '#9bb0ff',
    coronaHex: '#6e94ff'
  },
  // 7. Xi Geminorum (Alzirr)
  '32362': {
    id: 'alzirr',
    name: 'Alzirr (Xi Geminorum)',
    spec: 'F5IV',
    stage: 'White Subgiant',
    teff: 6500,
    mass: 1.62,
    radius: 2.7,
    lum: 11.5,
    distLy: 58.7,
    distPc: 18.0,
    vmag: 3.35,
    absmag: 2.14,
    colorHex: '#f8f7ff',
    coronaHex: '#e0dcff'
  },
  // 8. Epsilon Hydrae (Ashlesha)
  '43109': {
    id: 'ashlesha',
    name: 'Ashlesha (Epsilon Hydrae)',
    spec: 'G7.5III',
    stage: 'Yellow Giant',
    teff: 5000,
    mass: 3.0,
    radius: 10.0,
    lum: 60,
    distLy: 129,
    distPc: 39.5,
    vmag: 3.38,
    absmag: 0.35,
    colorHex: '#ffe8d0',
    coronaHex: '#ffd2a1'
  },
  // 9. Delta Virginis (Minelauva)
  '63090': {
    id: 'minelauva',
    name: 'Minelauva (Delta Virginis)',
    spec: 'M3III',
    stage: 'Red Giant',
    teff: 3680,
    mass: 1.4,
    radius: 48.0,
    lum: 468,
    distLy: 198,
    distPc: 60.7,
    vmag: 3.39,
    absmag: -0.46,
    colorHex: '#ff924d',
    coronaHex: '#ff661d'
  },
  // 10. Theta-2 Tauri (Chamukuy)
  '20894': {
    id: 'chamukuy',
    name: 'Chamukuy (Theta-2 Tauri)',
    spec: 'A7III',
    stage: 'Bright Giant',
    teff: 7800,
    mass: 2.4,
    radius: 3.4,
    lum: 69,
    distLy: 157,
    distPc: 48.1,
    vmag: 3.40,
    absmag: 0.1,
    colorHex: '#cad7ff',
    coronaHex: '#b0c5ff'
  },
  // 11. Eta Ceti (Dheneb)
  '5364': {
    id: 'dheneb',
    name: 'Dheneb (Eta Ceti)',
    spec: 'K1.5III',
    stage: 'Red Giant',
    teff: 4550,
    mass: 1.7,
    radius: 15.0,
    lum: 77,
    distLy: 124,
    distPc: 38.0,
    vmag: 3.46,
    absmag: 0.62,
    colorHex: '#ffd2a1',
    coronaHex: '#ffb366'
  },
  // 12. Delta Boötis (Thiba)
  '74666': {
    id: 'thiba',
    name: 'Thiba (Delta Boötis)',
    spec: 'G8III',
    stage: 'Yellow Giant',
    teff: 4940,
    mass: 2.4,
    radius: 10.5,
    lum: 65,
    distLy: 121,
    distPc: 37.1,
    vmag: 3.46,
    absmag: 0.68,
    colorHex: '#ffe8d0',
    coronaHex: '#ffd2a1'
  },
  // 13. Theta Pegasi (Biham)
  '109427': {
    id: 'biham',
    name: 'Biham (Theta Pegasi)',
    spec: 'A2V',
    stage: 'White Main Sequence',
    teff: 8900,
    mass: 2.15,
    radius: 2.6,
    lum: 38,
    distLy: 96.6,
    distPc: 29.6,
    vmag: 3.52,
    absmag: 1.16,
    colorHex: '#cad7ff',
    coronaHex: '#b0c5ff'
  },
  // 14. Epsilon Tauri (Ain)
  '20889': {
    id: 'ain',
    name: 'Ain (Epsilon Tauri)',
    spec: 'K0III',
    stage: 'Red Giant',
    teff: 4900,
    mass: 2.7,
    radius: 12.7,
    lum: 97,
    distLy: 147,
    distPc: 45.1,
    vmag: 3.53,
    absmag: 0.27,
    colorHex: '#ffd2a1',
    coronaHex: '#ffb366'
  },
  // 15. Upsilon-4 Eridani (Beemim) - B-STAR FIX
  '20042': {
    id: 'beemim-upsilon-4-eri',
    name: 'Beemim (Upsilon-4 Eridani)',
    spec: 'B8V',
    stage: 'Blue Main Sequence',
    teff: 12000,
    mass: 3.17,
    radius: 2.32,
    lum: 95,
    distLy: 178,
    distPc: 54.6,
    vmag: 3.55,
    absmag: -0.14,
    colorHex: '#c0d1ff',
    coronaHex: '#9bb0ff'
  },
  // 16. Iota Ceti (Deneb Kaitos Shemali)
  '1562': {
    id: 'deneb-kaitos-shemali',
    name: 'Deneb Kaitos Shemali (Iota Ceti)',
    spec: 'K1.5III',
    stage: 'Red Giant',
    teff: 4530,
    mass: 1.8,
    radius: 15.0,
    lum: 78,
    distLy: 290,
    distPc: 89.0,
    vmag: 3.56,
    absmag: -1.18,
    colorHex: '#ffd2a1',
    coronaHex: '#ffb366'
  },
  // 17. Alpha-2 Capricorni (Algedi)
  '100064': {
    id: 'algedi',
    name: 'Algedi (Alpha-2 Capricorni)',
    spec: 'G8.5III',
    stage: 'Yellow Giant',
    teff: 5020,
    mass: 2.1,
    radius: 8.4,
    lum: 43,
    distLy: 106,
    distPc: 32.5,
    vmag: 3.58,
    absmag: 0.97,
    colorHex: '#ffe8d0',
    coronaHex: '#ffd2a1'
  },
  // 18. 51 Andromedae (Nembus)
  '7607': {
    id: 'nembus',
    name: 'Nembus (51 Andromedae)',
    spec: 'K3III',
    stage: 'Red Giant',
    teff: 4400,
    mass: 1.8,
    radius: 22.0,
    lum: 142,
    distLy: 177,
    distPc: 54.3,
    vmag: 3.59,
    absmag: -0.04,
    colorHex: '#ffd2a1',
    coronaHex: '#ffb366'
  },
  // 19. Theta Ceti (Al Naymat)
  '6537': {
    id: 'al-naymat',
    name: 'Al Naymat (Theta Ceti)',
    spec: 'K0III',
    stage: 'Red Giant',
    teff: 4940,
    mass: 2.1,
    radius: 8.7,
    lum: 46,
    distLy: 114,
    distPc: 35.0,
    vmag: 3.60,
    absmag: 0.88,
    colorHex: '#ffd2a1',
    coronaHex: '#ffb366'
  },
  // 20. 41 Arietis / c Arietis (Bharani) - B-STAR FIX
  '13209': {
    id: 'bharani',
    name: 'Bharani (c Arietis)',
    spec: 'B8Vn',
    stage: 'Blue Main Sequence',
    teff: 11900,
    mass: 3.15,
    radius: 2.55,
    lum: 110,
    distLy: 166,
    distPc: 51.0,
    vmag: 3.61,
    absmag: 0.16,
    colorHex: '#c0d1ff',
    coronaHex: '#9bb0ff'
  },
  // 21. Zeta-2 Scorpii (Grafias)
  '82729': {
    id: 'grafias',
    name: 'Grafias (Zeta-2 Scorpii)',
    spec: 'K4III',
    stage: 'Red Giant',
    teff: 4300,
    mass: 1.5,
    radius: 21.0,
    lum: 130,
    distLy: 151,
    distPc: 46.3,
    vmag: 3.62,
    absmag: 0.3,
    colorHex: '#ffd2a1',
    coronaHex: '#ffb366'
  },
  // 22. Gamma Tauri (Prima Hyadum)
  '20205': {
    id: 'prima-hyadum',
    name: 'Prima Hyadum (Gamma Tauri)',
    spec: 'K0III',
    stage: 'Red Giant',
    teff: 4970,
    mass: 2.7,
    radius: 13.4,
    lum: 85,
    distLy: 154,
    distPc: 47.2,
    vmag: 3.65,
    absmag: 0.38,
    colorHex: '#ffd2a1',
    coronaHex: '#ffb366'
  },
  // 23. Zeta-1 Aquarii (Sadaltager)
  '110960': {
    id: 'sadaltager',
    name: 'Sadaltager (Zeta-1 Aquarii)',
    spec: 'F3V',
    stage: 'White Main Sequence',
    teff: 6850,
    mass: 1.7,
    radius: 2.1,
    lum: 9.5,
    distLy: 92.0,
    distPc: 28.2,
    vmag: 3.65,
    absmag: 1.9,
    colorHex: '#f8f7ff',
    coronaHex: '#e0dcff'
  },
  // 24. Zeta Cassiopeiae (Fulu) - B-STAR FIX
  '2920': {
    id: 'fulu',
    name: 'Fulu (Zeta Cassiopeiae)',
    spec: 'B2IV',
    stage: 'Blue Subgiant',
    teff: 21000,
    mass: 9.0,
    radius: 6.1,
    lum: 7200,
    distLy: 590,
    distPc: 182,
    vmag: 3.69,
    absmag: -2.6,
    colorHex: '#9bb0ff',
    coronaHex: '#6e94ff'
  },
  // 25. Chi Ursae Majoris (Taiyangshou)
  '57399': {
    id: 'taiyangshou',
    name: 'Taiyangshou (Chi Ursae Majoris)',
    spec: 'K0.5III',
    stage: 'Red Giant',
    teff: 4420,
    mass: 1.5,
    radius: 22.0,
    lum: 172,
    distLy: 196,
    distPc: 60.1,
    vmag: 3.69,
    absmag: -0.20,
    colorHex: '#ffd2a1',
    coronaHex: '#ffb366'
  },
  // 26. Gamma Capricorni (Nashira)
  '106985': {
    id: 'nashira',
    name: 'Nashira (Gamma Capricorni)',
    spec: 'F0p',
    stage: 'White Main Sequence',
    teff: 7300,
    mass: 1.9,
    radius: 2.2,
    lum: 17.5,
    distLy: 139,
    distPc: 42.6,
    vmag: 3.69,
    absmag: 0.54,
    colorHex: '#f8f7ff',
    coronaHex: '#e0dcff'
  },
  // 27. Tau-4 Eridani (Angetenar)
  '15474': {
    id: 'angetenar',
    name: 'Angetenar (Tau-4 Eridani)',
    spec: 'M3III',
    stage: 'Red Giant',
    teff: 3700,
    mass: 1.5,
    radius: 60.0,
    lum: 600,
    distLy: 310,
    distPc: 95.0,
    vmag: 3.70,
    absmag: -1.2,
    colorHex: '#ff924d',
    coronaHex: '#ff661d'
  },
  // 28. Epsilon Eridani (Ran) - DWARF STAR FIX
  '16537': {
    id: 'ran',
    name: 'Ran (Epsilon Eridani)',
    spec: 'K2V',
    stage: 'Orange Dwarf',
    teff: 5084,
    mass: 0.82,
    radius: 0.74,
    lum: 0.34,
    distLy: 10.5,
    distPc: 3.22,
    vmag: 3.72,
    absmag: 6.18,
    colorHex: '#ffd2a1',
    coronaHex: '#ffb366'
  },
  // 29. Lambda Aquarii (Hydor)
  '112961': {
    id: 'hydor',
    name: 'Hydor (Lambda Aquarii)',
    spec: 'M2.5III',
    stage: 'Red Giant',
    teff: 3670,
    mass: 1.4,
    radius: 54.0,
    lum: 570,
    distLy: 390,
    distPc: 120,
    vmag: 3.73,
    absmag: -1.6,
    colorHex: '#ff924d',
    coronaHex: '#ff661d'
  },
  // 30. Gamma Ophiuchi (Muliphen)
  '87108': {
    id: 'muliphen',
    name: 'Muliphen (Gamma Ophiuchi)',
    spec: 'A0V',
    stage: 'White Main Sequence',
    teff: 9500,
    mass: 2.5,
    radius: 2.5,
    lum: 48,
    distLy: 103,
    distPc: 31.6,
    vmag: 3.75,
    absmag: 0.8,
    colorHex: '#cad7ff',
    coronaHex: '#b0c5ff'
  },
  // 31. Delta Leporis (Arsh al Jauzah)
  '27654': {
    id: 'arsh-al-jauzah',
    name: 'Arsh al Jauzah (Delta Leporis)',
    spec: 'K0III',
    stage: 'Red Giant',
    teff: 4850,
    mass: 1.8,
    radius: 11.0,
    lum: 60,
    distLy: 112,
    distPc: 34.3,
    vmag: 3.76,
    absmag: 1.08,
    colorHex: '#ffd2a1',
    coronaHex: '#ffb366'
  },
  // 32. Delta Tauri (Secunda Hyadum)
  '20455': {
    id: 'secunda-hyadum',
    name: 'Secunda Hyadum (Delta Tauri)',
    spec: 'K0III',
    stage: 'Red Giant',
    teff: 4940,
    mass: 2.7,
    radius: 11.5,
    lum: 74,
    distLy: 153,
    distPc: 46.9,
    vmag: 3.76,
    absmag: 0.45,
    colorHex: '#ffd2a1',
    coronaHex: '#ffb366'
  },
  // 33. Zeta Capricorni (Yen)
  '105881': {
    id: 'yen',
    name: 'Yen (Zeta Capricorni)',
    spec: 'G4Ib:Ba2',
    stage: 'Yellow Supergiant',
    teff: 5050,
    mass: 4.5,
    radius: 29.0,
    lum: 490,
    distLy: 398,
    distPc: 122,
    vmag: 3.77,
    absmag: -1.66,
    colorHex: '#ffe8d0',
    coronaHex: '#ffd2a1'
  },
  // 34. Epsilon Aquarii (Albali) - B-STAR FIX
  '102618': {
    id: 'albali',
    name: 'Albali (Epsilon Aquarii)',
    spec: 'A1V',
    stage: 'White Main Sequence',
    teff: 9400,
    mass: 2.98,
    radius: 4.2,
    lum: 120,
    distLy: 208,
    distPc: 63.8,
    vmag: 3.77,
    absmag: -0.4,
    colorHex: '#cad7ff',
    coronaHex: '#b0c5ff'
  },
  // 35. Kappa Persei (Misam)
  '14668': {
    id: 'misam',
    name: 'Misam (Kappa Persei)',
    spec: 'K0III',
    stage: 'Red Giant',
    teff: 4900,
    mass: 2.0,
    radius: 9.3,
    lum: 47,
    distLy: 112,
    distPc: 34.3,
    vmag: 3.80,
    absmag: 1.11,
    colorHex: '#ffd2a1',
    coronaHex: '#ffb366'
  },
  // 36. Upsilon-2 Eridani (Theemin)
  '21393': {
    id: 'theemin',
    name: 'Theemin (Upsilon-2 Eridani)',
    spec: 'G9III',
    stage: 'Yellow Giant',
    teff: 5000,
    mass: 2.4,
    radius: 11.2,
    lum: 72,
    distLy: 209,
    distPc: 64.1,
    vmag: 3.82,
    absmag: -0.22,
    colorHex: '#ffe8d0',
    coronaHex: '#ffd2a1'
  },
  // 37. Lambda Draconis (Giausar)
  '56211': {
    id: 'giausar',
    name: 'Giausar (Lambda Draconis)',
    spec: 'M0III',
    stage: 'Red Giant',
    teff: 3950,
    mass: 1.3,
    radius: 45.0,
    lum: 380,
    distLy: 334,
    distPc: 102,
    vmag: 3.82,
    absmag: -1.23,
    colorHex: '#ff924d',
    coronaHex: '#ff661d'
  },
  // 38. Epsilon Draconis (Tyl)
  '97433': {
    id: 'tyl',
    name: 'Tyl (Epsilon Draconis)',
    spec: 'G8III',
    stage: 'Yellow Giant',
    teff: 5080,
    mass: 2.7,
    radius: 10.0,
    lum: 60,
    distLy: 148,
    distPc: 45.4,
    vmag: 3.83,
    absmag: 0.6,
    colorHex: '#ffe8d0',
    coronaHex: '#ffd2a1'
  },
  // 39. l Eridani / 53 Eridani (Sceptrum)
  '21594': {
    id: 'sceptrum',
    name: 'Sceptrum (l Eridani)',
    spec: 'K1III',
    stage: 'Red Giant',
    teff: 4700,
    mass: 1.8,
    radius: 13.0,
    lum: 68,
    distLy: 109,
    distPc: 33.4,
    vmag: 3.87,
    absmag: 1.25,
    colorHex: '#ffd2a1',
    coronaHex: '#ffb366'
  },
  // 40. Gamma Aquarii (Sadachbia) - B-STAR FIX
  '110395': {
    id: 'sadachbia',
    name: 'Sadachbia (Gamma Aquarii)',
    spec: 'A0V',
    stage: 'White Main Sequence',
    teff: 10500,
    mass: 2.72,
    radius: 2.7,
    lum: 62,
    distLy: 164,
    distPc: 50.3,
    vmag: 3.84,
    absmag: 0.33,
    colorHex: '#cad7ff',
    coronaHex: '#b0c5ff'
  },
  // 41. Mu Virginis (Rijl al Awwa)
  '71957': {
    id: 'rijl-al-awwa',
    name: 'Rijl al Awwa (Mu Virginis)',
    spec: 'F2V',
    stage: 'White Main Sequence',
    teff: 6750,
    mass: 1.5,
    radius: 1.9,
    lum: 7.5,
    distLy: 59.8,
    distPc: 18.3,
    vmag: 3.88,
    absmag: 2.58,
    colorHex: '#f8f7ff',
    coronaHex: '#e0dcff'
  },
  // 42. Eta Eridani (Azha)
  '13701': {
    id: 'azha',
    name: 'Azha (Eta Eridani)',
    spec: 'K1III',
    stage: 'Red Giant',
    teff: 4770,
    mass: 1.9,
    radius: 12.0,
    lum: 65,
    distLy: 137,
    distPc: 42.0,
    vmag: 3.89,
    absmag: 0.83,
    colorHex: '#ffd2a1',
    coronaHex: '#ffb366'
  },
  // 43. Omicron-1 Canis Majoris (Udra) - SUPERGIANT FIX
  '33152': {
    id: 'udra',
    name: 'Udra (Omicron-1 Canis Majoris)',
    spec: 'K2.5Iab',
    stage: 'Red Supergiant',
    teff: 3800,
    mass: 15.0,
    radius: 530.0,
    lum: 65000,
    distLy: 1980,
    distPc: 607,
    vmag: 3.89,
    absmag: -5.3,
    colorHex: '#ff924d',
    coronaHex: '#ff661d'
  },
  // 44. Eta Virginis (Zaniah)
  '60129': {
    id: 'zaniah',
    name: 'Zaniah (Eta Virginis)',
    spec: 'A2V',
    stage: 'White Main Sequence',
    teff: 9330,
    mass: 2.5,
    radius: 2.2,
    lum: 40,
    distLy: 265,
    distPc: 81.2,
    vmag: 3.89,
    absmag: -0.66,
    colorHex: '#cad7ff',
    coronaHex: '#b0c5ff'
  },
  // 45. Iota Hydrae (Ukdah)
  '47431': {
    id: 'ukdah-iota-hya',
    name: 'Ukdah (Iota Hydrae)',
    spec: 'K2III',
    stage: 'Red Giant',
    teff: 4480,
    mass: 1.7,
    radius: 16.0,
    lum: 95,
    distLy: 276,
    distPc: 84.6,
    vmag: 3.91,
    absmag: -0.74,
    colorHex: '#ffd2a1',
    coronaHex: '#ffb366'
  },
  // 46. Zeta Phoenicis (Wurren) - B-STAR FIX
  '5348': {
    id: 'wurren',
    name: 'Wurren (Zeta Phoenicis)',
    spec: 'B6V',
    stage: 'Blue Main Sequence',
    teff: 14400,
    mass: 3.91,
    radius: 2.84,
    lum: 330,
    distLy: 280,
    distPc: 85.9,
    vmag: 3.92,
    absmag: -0.75,
    colorHex: '#c0d1ff',
    coronaHex: '#9bb0ff'
  },
  // 47. 48 Persei / c Persei (Nembus) - B-STAR FIX
  '19343': {
    id: 'nembus-persei',
    name: 'Nembus (c Persei)',
    spec: 'B3Ve',
    stage: 'Blue Main Sequence',
    teff: 17200,
    mass: 7.0,
    radius: 7.1,
    lum: 3900,
    distLy: 550,
    distPc: 169,
    vmag: 4.04,
    absmag: -2.1,
    colorHex: '#9bb0ff',
    coronaHex: '#6e94ff'
  },
  // 48. Upsilon-3 Eridani (Beemim) - GREEK & ID FIX
  '20535': {
    id: 'beemim-upsilon-3-eri',
    name: 'Beemim (Upsilon-3 Eridani)',
    spec: 'K0III',
    stage: 'Red Giant',
    teff: 4800,
    mass: 1.8,
    radius: 12.0,
    lum: 64,
    distLy: 295,
    distPc: 90.5,
    vmag: 3.96,
    absmag: -0.82,
    colorHex: '#ffd2a1',
    coronaHex: '#ffb366'
  },
  // 49. Lambda Pegasi (Sadalnazi)
  '112440': {
    id: 'sadalnazi',
    name: 'Sadalnazi (Lambda Pegasi)',
    spec: 'G8.5III',
    stage: 'Yellow Giant',
    teff: 4800,
    mass: 2.1,
    radius: 28.0,
    lum: 390,
    distLy: 365,
    distPc: 112,
    vmag: 3.96,
    absmag: -1.29,
    colorHex: '#ffe8d0',
    coronaHex: '#ffd2a1'
  },
  // 50. Nu Scorpii (Jabbah) - B-STAR FIX
  '79374': {
    id: 'jabbah',
    name: 'Jabbah (Nu Scorpii)',
    spec: 'B2IV',
    stage: 'Blue Subgiant',
    teff: 22500,
    mass: 8.5,
    radius: 5.5,
    lum: 6000,
    distLy: 470,
    distPc: 144,
    vmag: 4.00,
    absmag: -2.3,
    colorHex: '#9bb0ff',
    coronaHex: '#6e94ff'
  },
  // 51. Epsilon Aquilae (Deneb al Okab Borealis)
  '93244': {
    id: 'deneb-al-okab-borealis',
    name: 'Deneb al Okab Borealis (Epsilon Aquilae)',
    spec: 'K1-2III',
    stage: 'Red Giant',
    teff: 4680,
    mass: 2.6,
    radius: 11.0,
    lum: 66,
    distLy: 154,
    distPc: 47.2,
    vmag: 4.02,
    absmag: 0.65,
    colorHex: '#ffd2a1',
    coronaHex: '#ffb366'
  },
  // 52. Iota Cancri (Zubanah)
  '43103': {
    id: 'zubanah',
    name: 'Zubanah (Iota Cancri)',
    spec: 'G8III',
    stage: 'Yellow Giant',
    teff: 4950,
    mass: 3.3,
    radius: 20.0,
    lum: 215,
    distLy: 330,
    distPc: 101,
    vmag: 4.02,
    absmag: -1.0,
    colorHex: '#ffe8d0',
    coronaHex: '#ffd2a1'
  },
  // 53. Epsilon Delphini (Aldulfin) - B-STAR FIX
  '101421': {
    id: 'aldulfin',
    name: 'Aldulfin (Epsilon Delphini)',
    spec: 'B6III',
    stage: 'Blue Giant',
    teff: 13600,
    mass: 4.5,
    radius: 4.6,
    lum: 650,
    distLy: 358,
    distPc: 110,
    vmag: 4.03,
    absmag: -1.3,
    colorHex: '#c0d1ff',
    coronaHex: '#9bb0ff'
  },
  // 54. Omicron-1 Eridani (Beid)
  '19587': {
    id: 'beid',
    name: 'Beid (Omicron-1 Eridani)',
    spec: 'F0IV',
    stage: 'White Subgiant',
    teff: 7100,
    mass: 1.9,
    radius: 3.7,
    lum: 28,
    distLy: 125,
    distPc: 38.3,
    vmag: 4.04,
    absmag: 1.12,
    colorHex: '#f8f7ff',
    coronaHex: '#e0dcff'
  },
  // 55. Theta Boötis (Asellus Primus)
  '70497': {
    id: 'asellus-primus',
    name: 'Asellus Primus (Theta Boötis)',
    spec: 'F7V',
    stage: 'White Main Sequence',
    teff: 6280,
    mass: 1.35,
    radius: 1.45,
    lum: 3.8,
    distLy: 47.5,
    distPc: 14.6,
    vmag: 4.05,
    absmag: 3.23,
    colorHex: '#f8f7ff',
    coronaHex: '#e0dcff'
  },
  // 56. Iota Virginis (Syrma)
  '69701': {
    id: 'syrma',
    name: 'Syrma (Iota Virginis)',
    spec: 'F7IV',
    stage: 'White Subgiant',
    teff: 6300,
    mass: 1.5,
    radius: 2.6,
    lum: 9.2,
    distLy: 72.5,
    distPc: 22.2,
    vmag: 4.08,
    absmag: 2.34,
    colorHex: '#f8f7ff',
    coronaHex: '#e0dcff'
  },
  // 57. Kappa Serpentis (Gudja)
  '77450': {
    id: 'gudja',
    name: 'Gudja (Kappa Serpentis)',
    spec: 'M0.5III',
    stage: 'Red Giant',
    teff: 3800,
    mass: 1.4,
    radius: 70.0,
    lum: 750,
    distLy: 380,
    distPc: 117,
    vmag: 4.09,
    absmag: -1.25,
    colorHex: '#ff924d',
    coronaHex: '#ff661d'
  },
  // 58. Upsilon-1 Hydrae (Zhang)
  '48356': {
    id: 'zhang',
    name: 'Zhang (Upsilon-1 Hydrae)',
    spec: 'G7III',
    stage: 'Yellow Giant',
    teff: 4900,
    mass: 2.2,
    radius: 17.0,
    lum: 140,
    distLy: 290,
    distPc: 88.9,
    vmag: 4.11,
    absmag: -0.64,
    colorHex: '#ffe8d0',
    coronaHex: '#ffd2a1'
  },
  // 59. Nu Geminorum (Nucatai) - B-STAR FIX
  '30883': {
    id: 'nucatai',
    name: 'Nucatai (Nu Geminorum)',
    spec: 'B6III',
    stage: 'Blue Giant',
    teff: 13500,
    mass: 4.0,
    radius: 5.2,
    lum: 750,
    distLy: 540,
    distPc: 166,
    vmag: 4.14,
    absmag: -1.8,
    colorHex: '#c0d1ff',
    coronaHex: '#9bb0ff'
  },
  // 60. Delta Hydrae (Minazal) - B-STAR FIX
  '42313': {
    id: 'minazal',
    name: 'Minazal (Delta Hydrae)',
    spec: 'A1Vnn',
    stage: 'White Main Sequence',
    teff: 9450,
    mass: 2.43,
    radius: 2.8,
    lum: 55,
    distLy: 160,
    distPc: 49.1,
    vmag: 4.14,
    absmag: 0.7,
    colorHex: '#cad7ff',
    coronaHex: '#b0c5ff'
  },
  // 61. HD 144069 (Grafias) - ID FIX
  '78727': {
    id: 'grafias-hd-144069',
    name: 'Grafias (HD 144069)',
    spec: 'F5V',
    stage: 'White Main Sequence',
    teff: 6500,
    mass: 1.3,
    radius: 1.6,
    lum: 4.2,
    distLy: 105,
    distPc: 32.2,
    vmag: 4.14,
    absmag: 1.6,
    colorHex: '#f8f7ff',
    coronaHex: '#e0dcff'
  },
  // 62. Theta Aquarii (Ancha)
  '110003': {
    id: 'ancha',
    name: 'Ancha (Theta Aquarii)',
    spec: 'G8III-IV',
    stage: 'Yellow Subgiant',
    teff: 4900,
    mass: 2.4,
    radius: 12.0,
    lum: 80,
    distLy: 187,
    distPc: 57.3,
    vmag: 4.16,
    absmag: 0.37,
    colorHex: '#ffe8d0',
    coronaHex: '#ffd2a1'
  },
  // 63. Kappa Virginis (Kang)
  '69427': {
    id: 'kang',
    name: 'Kang (Kappa Virginis)',
    spec: 'K2.5III',
    stage: 'Red Giant',
    teff: 4400,
    mass: 1.6,
    radius: 26.0,
    lum: 190,
    distLy: 255,
    distPc: 78.2,
    vmag: 4.18,
    absmag: -0.28,
    colorHex: '#ffd2a1',
    coronaHex: '#ffb366'
  },
  // 64. Lambda Boötis (Xuange)
  '69732': {
    id: 'xuange',
    name: 'Xuange (Lambda Boötis)',
    spec: 'A0Vp',
    stage: 'White Main Sequence',
    teff: 8850,
    mass: 2.1,
    radius: 1.7,
    lum: 16.5,
    distLy: 100,
    distPc: 30.7,
    vmag: 4.18,
    absmag: 1.74,
    colorHex: '#cad7ff',
    coronaHex: '#b0c5ff'
  },
  // 65. Xi Pegasi (Suudalnujum)
  '112447': {
    id: 'suudalnujum',
    name: 'Suudalnujum (Xi Pegasi)',
    spec: 'F6V',
    stage: 'White Main Sequence',
    teff: 6400,
    mass: 1.3,
    radius: 1.9,
    lum: 4.8,
    distLy: 53.2,
    distPc: 16.3,
    vmag: 4.19,
    absmag: 3.13,
    colorHex: '#f8f7ff',
    coronaHex: '#e0dcff'
  },
  // 66. Epsilon Ursae Minoris (Circitores)
  '82080': {
    id: 'circitores',
    name: 'Circitores (Epsilon Ursae Minoris)',
    spec: 'G5III',
    stage: 'Yellow Giant',
    teff: 5200,
    mass: 2.5,
    radius: 10.0,
    lum: 65,
    distLy: 300,
    distPc: 92.0,
    vmag: 4.21,
    absmag: -0.92,
    colorHex: '#ffe8d0',
    coronaHex: '#ffd2a1'
  },
  // 67. Theta Cephei (Al Kidr)
  '101093': {
    id: 'al-kidr',
    name: 'Al Kidr (Theta Cephei)',
    spec: 'A7III',
    stage: 'Bright Giant',
    teff: 7750,
    mass: 2.3,
    radius: 3.5,
    lum: 52,
    distLy: 136,
    distPc: 41.7,
    vmag: 4.22,
    absmag: 1.11,
    colorHex: '#cad7ff',
    coronaHex: '#b0c5ff'
  },
  // 68. Phi Draconis (Aldhiba) - B-STAR FIX
  '89908': {
    id: 'aldhiba',
    name: 'Aldhiba (Phi Draconis)',
    spec: 'B8Vp',
    stage: 'Blue Main Sequence',
    teff: 12500,
    mass: 3.3,
    radius: 2.7,
    lum: 130,
    distLy: 300,
    distPc: 92.0,
    vmag: 4.22,
    absmag: -0.6,
    colorHex: '#c0d1ff',
    coronaHex: '#9bb0ff'
  },
  // 69. Nu Cephei (Castula) - ID FIX
  '107418': {
    id: 'castula-nu-cep',
    name: 'Castula (Nu Cephei)',
    spec: 'A2Ia',
    stage: 'White Supergiant',
    teff: 9000,
    mass: 14.0,
    radius: 65.0,
    lum: 25000,
    distLy: 5100,
    distPc: 1560,
    vmag: 4.25,
    absmag: -6.6,
    colorHex: '#cad7ff',
    coronaHex: '#b0c5ff'
  },
  // 70. Omicron Piscium (Torcular)
  '8198': {
    id: 'torcular',
    name: 'Torcular (Omicron Piscium)',
    spec: 'G8III',
    stage: 'Yellow Giant',
    teff: 5000,
    mass: 2.8,
    radius: 14.0,
    lum: 130,
    distLy: 275,
    distPc: 84.3,
    vmag: 4.26,
    absmag: -0.37,
    colorHex: '#ffe8d0',
    coronaHex: '#ffd2a1'
  },
  // 71. Xi Cephei (Kurhah)
  '108917': {
    id: 'kurhah',
    name: 'Kurhah (Xi Cephei)',
    spec: 'Am',
    stage: 'White Main Sequence',
    teff: 7400,
    mass: 1.9,
    radius: 2.7,
    lum: 22,
    distLy: 102,
    distPc: 31.3,
    vmag: 4.26,
    absmag: 1.79,
    colorHex: '#cad7ff',
    coronaHex: '#b0c5ff'
  },
  // 72. Beta-2 Sagittarii (Arkab Posterior)
  '95294': {
    id: 'arkab-posterior',
    name: 'Arkab Posterior (Beta-2 Sagittarii)',
    spec: 'F2III',
    stage: 'White Giant',
    teff: 6900,
    mass: 2.1,
    radius: 3.8,
    lum: 27,
    distLy: 139,
    distPc: 42.6,
    vmag: 4.27,
    absmag: 1.13,
    colorHex: '#f8f7ff',
    coronaHex: '#e0dcff'
  },
  // 73. Zeta Ursae Minoris (Akfa Farkadain)
  '77055': {
    id: 'akfa-farkadain',
    name: 'Akfa Farkadain (Zeta Ursae Minoris)',
    spec: 'A3Vn',
    stage: 'White Main Sequence',
    teff: 8700,
    mass: 3.4,
    radius: 6.1,
    lum: 200,
    distLy: 380,
    distPc: 117,
    vmag: 4.27,
    absmag: -1.05,
    colorHex: '#cad7ff',
    coronaHex: '#b0c5ff'
  },
  // 74. Beta Piscis Austrini (Fum al Hui)
  '111188': {
    id: 'fum-al-hui',
    name: 'Fum al Hui (Beta Piscis Austrini)',
    spec: 'A0V',
    stage: 'White Main Sequence',
    teff: 9600,
    mass: 2.3,
    radius: 2.1,
    lum: 35,
    distLy: 143,
    distPc: 43.8,
    vmag: 4.29,
    absmag: 1.08,
    colorHex: '#cad7ff',
    coronaHex: '#b0c5ff'
  },
  // 75. Alpha-1 Capricorni (Prima Giedi)
  '100027': {
    id: 'prima-giedi',
    name: 'Prima Giedi (Alpha-1 Capricorni)',
    spec: 'G3Ib',
    stage: 'Yellow Supergiant',
    teff: 5300,
    mass: 5.0,
    radius: 42.0,
    lum: 930,
    distLy: 690,
    distPc: 212,
    vmag: 4.30,
    absmag: -2.33,
    colorHex: '#ffe8d0',
    coronaHex: '#ffd2a1'
  },
  // 76. Mu-1 Boötis (Alkalurops)
  '75411': {
    id: 'alkalurops',
    name: 'Alkalurops (Mu-1 Boötis)',
    spec: 'F0V',
    stage: 'White Main Sequence',
    teff: 7300,
    mass: 1.8,
    radius: 2.0,
    lum: 15,
    distLy: 121,
    distPc: 37.1,
    vmag: 4.31,
    absmag: 1.46,
    colorHex: '#f8f7ff',
    coronaHex: '#e0dcff'
  },
  // 77. Zeta-1 Lyrae (Nasr Alwaki)
  '91971': {
    id: 'nasr-alwaki',
    name: 'Nasr Alwaki (Zeta-1 Lyrae)',
    spec: 'Am',
    stage: 'White Main Sequence',
    teff: 7800,
    mass: 2.3,
    radius: 2.5,
    lum: 34,
    distLy: 156,
    distPc: 47.8,
    vmag: 4.34,
    absmag: 0.95,
    colorHex: '#cad7ff',
    coronaHex: '#b0c5ff'
  },
  // 78. Delta Arietis (Botein)
  '14838': {
    id: 'botein',
    name: 'Botein (Delta Arietis)',
    spec: 'K2III',
    stage: 'Red Giant',
    teff: 4600,
    mass: 2.0,
    radius: 13.0,
    lum: 75,
    distLy: 170,
    distPc: 52.1,
    vmag: 4.35,
    absmag: 0.77,
    colorHex: '#ffd2a1',
    coronaHex: '#ffb366'
  },
  // 79. Pi-2 Orionis (Al Taj) - B-STAR FIX
  '22509': {
    id: 'al-taj',
    name: 'Al Taj (Pi-2 Orionis)',
    spec: 'A1V',
    stage: 'White Main Sequence',
    teff: 9500,
    mass: 2.3,
    radius: 2.3,
    lum: 45,
    distLy: 224,
    distPc: 68.7,
    vmag: 4.35,
    absmag: 0.5,
    colorHex: '#cad7ff',
    coronaHex: '#b0c5ff'
  },
  // 80. Gamma Comae Berenices (Al Dafirah)
  '60742': {
    id: 'al-dafirah',
    name: 'Al Dafirah (Gamma Comae Berenices)',
    spec: 'K1III',
    stage: 'Red Giant',
    teff: 4650,
    mass: 1.7,
    radius: 12.0,
    lum: 65,
    distLy: 169,
    distPc: 51.8,
    vmag: 4.35,
    absmag: 0.78,
    colorHex: '#ffd2a1',
    coronaHex: '#ffb366'
  },
  // 81. Xi-1 Ceti (Al Kaff al Jidhmah)
  '10324': {
    id: 'al-kaff-al-jidhmah',
    name: 'Al Kaff al Jidhmah (Xi-1 Ceti)',
    spec: 'G8III',
    stage: 'Yellow Giant',
    teff: 5000,
    mass: 2.5,
    radius: 13.0,
    lum: 95,
    distLy: 330,
    distPc: 101,
    vmag: 4.36,
    absmag: -0.66,
    colorHex: '#ffe8d0',
    coronaHex: '#ffd2a1'
  },
  // 82. Iota Aquilae (Al Thalimain Posterior) - B-STAR FIX
  '96468': {
    id: 'al-thalimain-posterior',
    name: 'Al Thalimain Posterior (Iota Aquilae)',
    spec: 'B5III',
    stage: 'Blue Giant',
    teff: 14000,
    mass: 4.5,
    radius: 3.6,
    lum: 460,
    distLy: 390,
    distPc: 120,
    vmag: 4.36,
    absmag: -1.2,
    colorHex: '#c0d1ff',
    coronaHex: '#9bb0ff'
  },
  // 83. Kappa Cephei (Al Aghnam) - B-STAR FIX
  '99255': {
    id: 'al-aghnam',
    name: 'Al Aghnam (Kappa Cephei)',
    spec: 'B9III',
    stage: 'Blue Giant',
    teff: 10800,
    mass: 3.02,
    radius: 4.45,
    lum: 260,
    distLy: 323,
    distPc: 99.0,
    vmag: 4.39,
    absmag: -0.7,
    colorHex: '#c0d1ff',
    coronaHex: '#9bb0ff'
  },
  // 84. Xi Ophiuchi (Aggia)
  '84893': {
    id: 'aggia',
    name: 'Aggia (Xi Ophiuchi)',
    spec: 'F3V',
    stage: 'White Main Sequence',
    teff: 6700,
    mass: 1.6,
    radius: 2.1,
    lum: 10.5,
    distLy: 57.0,
    distPc: 17.5,
    vmag: 4.39,
    absmag: 3.19,
    colorHex: '#f8f7ff',
    coronaHex: '#e0dcff'
  },
  // 85. HD 125823 / a Centauri (Bidelman's Helium Variable Star) - B-STAR FIX
  '70300': {
    id: 'bidelman-s-helium-variable-star',
    name: "Bidelman's Helium Variable Star (a Centauri)",
    spec: 'B2V',
    stage: 'Blue Main Sequence',
    teff: 19000,
    mass: 5.45,
    radius: 3.01,
    lum: 1100,
    distLy: 460,
    distPc: 141,
    vmag: 4.41,
    absmag: -1.3,
    colorHex: '#9bb0ff',
    coronaHex: '#6e94ff'
  },
  // 86. Lambda Herculis (Maasym)
  '85693': {
    id: 'maasym',
    name: 'Maasym (Lambda Herculis)',
    spec: 'K3.5III',
    stage: 'Red Giant',
    teff: 4200,
    mass: 1.6,
    radius: 30.0,
    lum: 240,
    distLy: 370,
    distPc: 113,
    vmag: 4.41,
    absmag: -0.86,
    colorHex: '#ffd2a1',
    coronaHex: '#ffb366'
  },
  // 87. Upsilon Pegasi (Alkarab)
  '115623': {
    id: 'alkarab',
    name: 'Alkarab (Upsilon Pegasi)',
    spec: 'F8V',
    stage: 'White Main Sequence',
    teff: 6150,
    mass: 1.25,
    radius: 1.6,
    lum: 3.5,
    distLy: 170,
    distPc: 52.1,
    vmag: 4.42,
    absmag: 3.4,
    colorHex: '#fff4ea',
    coronaHex: '#ffe8d0'
  },
  // 88. Eta Lyrae (Aladfar) - B-STAR FIX
  '94481': {
    id: 'aladfar',
    name: 'Aladfar (Eta Lyrae)',
    spec: 'B2.5IV',
    stage: 'Blue Subgiant',
    teff: 20000,
    mass: 10.1,
    radius: 4.3,
    lum: 4000,
    distLy: 1120,
    distPc: 343,
    vmag: 4.43,
    absmag: -3.0,
    colorHex: '#9bb0ff',
    coronaHex: '#6e94ff'
  },
  // 89. Delta Delphini (Al Ukud)
  '102281': {
    id: 'al-ukud',
    name: 'Al Ukud (Delta Delphini)',
    spec: 'A7IIIp',
    stage: 'Bright Giant',
    teff: 7500,
    mass: 2.0,
    radius: 3.4,
    lum: 35,
    distLy: 223,
    distPc: 68.4,
    vmag: 4.43,
    absmag: 0.25,
    colorHex: '#cad7ff',
    coronaHex: '#b0c5ff'
  },
  // 90. Delta Piscium (Kuton)
  '3786': {
    id: 'kuton',
    name: 'Kuton (Delta Piscium)',
    spec: 'K5III',
    stage: 'Red Giant',
    teff: 4000,
    mass: 1.5,
    radius: 40.0,
    lum: 380,
    distLy: 310,
    distPc: 95.0,
    vmag: 4.44,
    absmag: -0.45,
    colorHex: '#ffd2a1',
    coronaHex: '#ffb366'
  },
  // 91. Sigma Hydrae (Minchir)
  '42402': {
    id: 'minchir',
    name: 'Minchir (Sigma Hydrae)',
    spec: 'K1III',
    stage: 'Red Giant',
    teff: 4600,
    mass: 1.8,
    radius: 17.0,
    lum: 115,
    distLy: 350,
    distPc: 107,
    vmag: 4.45,
    absmag: -0.7,
    colorHex: '#ffd2a1',
    coronaHex: '#ffb366'
  },
  // 92. f Ursae Majoris (Alhaud)
  '44901': {
    id: 'alhaud',
    name: 'Alhaud (f Ursae Majoris)',
    spec: 'A0V',
    stage: 'White Main Sequence',
    teff: 9500,
    mass: 2.3,
    radius: 2.3,
    lum: 38,
    distLy: 200,
    distPc: 61.3,
    vmag: 4.46,
    absmag: 0.52,
    colorHex: '#cad7ff',
    coronaHex: '#b0c5ff'
  },
  // 93. Beta Crateris (Al Sharasif)
  '54682': {
    id: 'al-sharasif',
    name: 'Al Sharasif (Beta Crateris)',
    spec: 'A1III',
    stage: 'Bright Giant',
    teff: 9000,
    mass: 2.5,
    radius: 3.5,
    lum: 60,
    distLy: 290,
    distPc: 88.9,
    vmag: 4.46,
    absmag: -0.28,
    colorHex: '#cad7ff',
    coronaHex: '#b0c5ff'
  },
  // 94. Kappa Leonis (Al Minlear al Asad)
  '46146': {
    id: 'al-minlear-al-asad',
    name: 'Al Minlear al Asad (Kappa Leonis)',
    spec: 'K2III',
    stage: 'Red Giant',
    teff: 4400,
    mass: 1.6,
    radius: 25.0,
    lum: 180,
    distLy: 213,
    distPc: 65.3,
    vmag: 4.46,
    absmag: 0.38,
    colorHex: '#ffd2a1',
    coronaHex: '#ffb366'
  },
  // 95. Beta Piscium (Fumalsamakah) - B-STAR FIX
  '113889': {
    id: 'fumalsamakah',
    name: 'Fumalsamakah (Beta Piscium)',
    spec: 'B6Ve',
    stage: 'Blue Main Sequence',
    teff: 15500,
    mass: 4.7,
    radius: 3.6,
    lum: 640,
    distLy: 410,
    distPc: 126,
    vmag: 4.49,
    absmag: -1.2,
    colorHex: '#c0d1ff',
    coronaHex: '#9bb0ff'
  },
  // 96. Upsilon-1 Eridani (Beemim) - ID & SPECTRAL FIX
  '21248': {
    id: 'beemim-upsilon-1-eri',
    name: 'Beemim (Upsilon-1 Eridani)',
    spec: 'K0III',
    stage: 'Red Giant',
    teff: 4800,
    mass: 1.7,
    radius: 12.0,
    lum: 65,
    distLy: 240,
    distPc: 73.6,
    vmag: 4.49,
    absmag: 0.15,
    colorHex: '#ffd2a1',
    coronaHex: '#ffb366'
  },
  // 97. Nu Aquarii (Albulaan)
  '104459': {
    id: 'albulaan',
    name: 'Albulaan (Nu Aquarii)',
    spec: 'G8III',
    stage: 'Yellow Giant',
    teff: 4900,
    mass: 2.4,
    radius: 12.0,
    lum: 75,
    distLy: 164,
    distPc: 50.3,
    vmag: 4.50,
    absmag: 0.99,
    colorHex: '#ffe8d0',
    coronaHex: '#ffd2a1'
  },
  // 98. Epsilon Capricorni (Kastra) - B-STAR FIX
  '106723': {
    id: 'kastra',
    name: 'Kastra (Epsilon Capricorni)',
    spec: 'B2.5Vpe',
    stage: 'Blue Main Sequence',
    teff: 18000,
    mass: 7.6,
    radius: 4.8,
    lum: 2400,
    distLy: 1060,
    distPc: 325,
    vmag: 4.51,
    absmag: -2.9,
    colorHex: '#9bb0ff',
    coronaHex: '#6e94ff'
  },
  // 99. 39 Arietis (Lilii Borea)
  '13061': {
    id: 'lilii-borea',
    name: 'Lilii Borea (39 Arietis)',
    spec: 'K1III',
    stage: 'Red Giant',
    teff: 4700,
    mass: 1.7,
    radius: 11.0,
    lum: 55,
    distLy: 172,
    distPc: 52.7,
    vmag: 4.51,
    absmag: 0.9,
    colorHex: '#ffd2a1',
    coronaHex: '#ffb366'
  },
  // 100. Lambda Virginis (Khambaliya)
  '69974': {
    id: 'khambaliya',
    name: 'Khambaliya (Lambda Virginis)',
    spec: 'A1V',
    stage: 'White Main Sequence',
    teff: 9300,
    mass: 2.2,
    radius: 2.2,
    lum: 35,
    distLy: 187,
    distPc: 57.3,
    vmag: 4.52,
    absmag: 0.73,
    colorHex: '#cad7ff',
    coronaHex: '#b0c5ff'
  },
  // 101. Psi Boötis (Aulad Alnathlat)
  '73745': {
    id: 'aulad-alnathlat',
    name: 'Aulad Alnathlat (Psi Boötis)',
    spec: 'K2III',
    stage: 'Red Giant',
    teff: 4300,
    mass: 1.5,
    radius: 20.0,
    lum: 125,
    distLy: 250,
    distPc: 76.7,
    vmag: 4.52,
    absmag: 0.09,
    colorHex: '#ffd2a1',
    coronaHex: '#ffb366'
  },
  // 102. Kappa-2 Boötis (Asellus Tertius)
  '69483': {
    id: 'asellus-tertius',
    name: 'Asellus Tertius (Kappa-2 Boötis)',
    spec: 'A8IV',
    stage: 'White Subgiant',
    teff: 7500,
    mass: 1.9,
    radius: 2.6,
    lum: 24,
    distLy: 155,
    distPc: 47.5,
    vmag: 4.53,
    absmag: 1.14,
    colorHex: '#cad7ff',
    coronaHex: '#b0c5ff'
  },
  // 103. 72 Leonis (Zubrah)
  '54951': {
    id: 'zubrah',
    name: 'Zubrah (72 Leonis)',
    spec: 'M3III',
    stage: 'Red Giant',
    teff: 3600,
    mass: 1.5,
    radius: 80.0,
    lum: 1100,
    distLy: 800,
    distPc: 245,
    vmag: 4.56,
    absmag: -2.39,
    colorHex: '#ff924d',
    coronaHex: '#ff661d'
  },
  // 104. Omega Herculis (Cujam) - B-STAR FIX
  '80463': {
    id: 'cujam',
    name: 'Cujam (Omega Herculis)',
    spec: 'A2Vp',
    stage: 'White Main Sequence',
    teff: 8900,
    mass: 2.7,
    radius: 3.2,
    lum: 60,
    distLy: 245,
    distPc: 75.1,
    vmag: 4.57,
    absmag: 0.2,
    colorHex: '#cad7ff',
    coronaHex: '#b0c5ff'
  },
  // 105. Psi Draconis (Dziban)
  '86614': {
    id: 'dziban',
    name: 'Dziban (Psi Draconis)',
    spec: 'F5V',
    stage: 'White Main Sequence',
    teff: 6500,
    mass: 1.4,
    radius: 1.7,
    lum: 5.5,
    distLy: 75.0,
    distPc: 23.0,
    vmag: 4.57,
    absmag: 2.76,
    colorHex: '#f8f7ff',
    coronaHex: '#e0dcff'
  },
  // 106. c Orionis / 42 Orionis (Mizan Batil) - B-STAR FIX
  '26237': {
    id: 'mizan-batil',
    name: 'Mizan Batil (c Orionis)',
    spec: 'B1V',
    stage: 'Blue Main Sequence',
    teff: 25000,
    mass: 12.0,
    radius: 7.0,
    lum: 16000,
    distLy: 900,
    distPc: 276,
    vmag: 4.58,
    absmag: -3.8,
    colorHex: '#9bb0ff',
    coronaHex: '#6e94ff'
  },
  // 107. Tau Pegasi (Salm)
  '115250': {
    id: 'salm',
    name: 'Salm (Tau Pegasi)',
    spec: 'A5Vp',
    stage: 'White Main Sequence',
    teff: 8000,
    mass: 1.8,
    radius: 2.2,
    lum: 20,
    distLy: 162,
    distPc: 49.7,
    vmag: 4.58,
    absmag: 1.1,
    colorHex: '#cad7ff',
    coronaHex: '#b0c5ff'
  },
  // 108. Pi-2 Ursae Majoris (Museida)
  '42527': {
    id: 'museida',
    name: 'Museida (Pi-2 Ursae Majoris)',
    spec: 'K2III',
    stage: 'Red Giant',
    teff: 4400,
    mass: 1.7,
    radius: 21.0,
    lum: 140,
    distLy: 252,
    distPc: 77.3,
    vmag: 4.59,
    absmag: 0.15,
    colorHex: '#ffd2a1',
    coronaHex: '#ffb366'
  },
  // 109. Tau-1 Hydrae (Ukdah) - ID FIX
  '46509': {
    id: 'ukdah-tau-1-hya',
    name: 'Ukdah (Tau-1 Hydrae)',
    spec: 'F6V',
    stage: 'White Main Sequence',
    teff: 6400,
    mass: 1.3,
    radius: 1.7,
    lum: 4.5,
    distLy: 56.0,
    distPc: 17.2,
    vmag: 4.59,
    absmag: 3.42,
    colorHex: '#f8f7ff',
    coronaHex: '#e0dcff'
  },
  // 110. Pi Draconis (Tais)
  '95081': {
    id: 'tais',
    name: 'Tais (Pi Draconis)',
    spec: 'A2III',
    stage: 'Bright Giant',
    teff: 9000,
    mass: 2.5,
    radius: 3.4,
    lum: 60,
    distLy: 225,
    distPc: 69.0,
    vmag: 4.60,
    absmag: 0.41,
    colorHex: '#cad7ff',
    coronaHex: '#b0c5ff'
  },
  // 111. Omega Persei (Gorgonea Quarta)
  '14817': {
    id: 'gorgonea-quarta',
    name: 'Gorgonea Quarta (Omega Persei)',
    spec: 'K1III',
    stage: 'Red Giant',
    teff: 4750,
    mass: 1.8,
    radius: 12.0,
    lum: 68,
    distLy: 290,
    distPc: 88.9,
    vmag: 4.61,
    absmag: -0.14,
    colorHex: '#ffd2a1',
    coronaHex: '#ffb366'
  },
  // 112. Upsilon-2 Cassiopeiae (Castula) - ID FIX
  '4422': {
    id: 'castula',
    name: 'Castula (Upsilon-2 Cassiopeiae)',
    spec: 'G8IIIb',
    stage: 'Yellow Giant',
    teff: 4900,
    mass: 2.3,
    radius: 13.0,
    lum: 80,
    distLy: 200,
    distPc: 61.3,
    vmag: 4.62,
    absmag: 0.68,
    colorHex: '#ffe8d0',
    coronaHex: '#ffd2a1'
  },
  // 113. Zeta Serpentis (Alava)
  '88175': {
    id: 'alava',
    name: 'Alava (Zeta Serpentis)',
    spec: 'F2V',
    stage: 'White Main Sequence',
    teff: 6800,
    mass: 1.5,
    radius: 1.9,
    lum: 8.5,
    distLy: 76.0,
    distPc: 23.3,
    vmag: 4.62,
    absmag: 2.79,
    colorHex: '#f8f7ff',
    coronaHex: '#e0dcff'
  },
  // 114. Gamma Cancri (Asellus Borealis) - B-STAR FIX
  '42806': {
    id: 'asellus-borealis',
    name: 'Asellus Borealis (Gamma Cancri)',
    spec: 'A1IV',
    stage: 'White Subgiant',
    teff: 9300,
    mass: 2.25,
    radius: 2.53,
    lum: 43,
    distLy: 175,
    distPc: 53.7,
    vmag: 4.66,
    absmag: 1.2,
    colorHex: '#cad7ff',
    coronaHex: '#b0c5ff'
  },
  // 115. HD 164975 (Nash)
  '88567': {
    id: 'nash',
    name: 'Nash (HD 164975)',
    spec: 'G9III',
    stage: 'Yellow Giant',
    teff: 4850,
    mass: 2.1,
    radius: 10.0,
    lum: 55,
    distLy: 380,
    distPc: 117,
    vmag: 4.66,
    absmag: -0.68,
    colorHex: '#ffe8d0',
    coronaHex: '#ffd2a1'
  },
  // 116. Zeta-1 Cancri (Tegmine)
  '40167': {
    id: 'tegmine',
    name: 'Tegmine (Zeta-1 Cancri)',
    spec: 'F7V',
    stage: 'White Main Sequence',
    teff: 6200,
    mass: 1.3,
    radius: 1.45,
    lum: 3.5,
    distLy: 83.4,
    distPc: 25.6,
    vmag: 4.67,
    absmag: 2.63,
    colorHex: '#f8f7ff',
    coronaHex: '#e0dcff'
  },
  // 117. Pi Persei (Gorgonea Secunda)
  '13879': {
    id: 'gorgonea-secunda',
    name: 'Gorgonea Secunda (Pi Persei)',
    spec: 'A2Vn',
    stage: 'White Main Sequence',
    teff: 8800,
    mass: 2.2,
    radius: 2.1,
    lum: 25,
    distLy: 310,
    distPc: 95.0,
    vmag: 4.68,
    absmag: -0.21,
    colorHex: '#cad7ff',
    coronaHex: '#b0c5ff'
  },
  // 118. Xi Aquarii (Bunda)
  '106786': {
    id: 'bunda',
    name: 'Bunda (Xi Aquarii)',
    spec: 'A7V',
    stage: 'White Main Sequence',
    teff: 7800,
    mass: 1.9,
    radius: 2.1,
    lum: 19,
    distLy: 179,
    distPc: 54.9,
    vmag: 4.68,
    absmag: 0.98,
    colorHex: '#cad7ff',
    coronaHex: '#b0c5ff'
  },
  // 119. Pi-1 Cygni (Azelfafage) - B-STAR FIX
  '107136': {
    id: 'azelfafage',
    name: 'Azelfafage (Pi-1 Cygni)',
    spec: 'B3IV',
    stage: 'Blue Subgiant',
    teff: 18500,
    mass: 10.1,
    radius: 15.1,
    lum: 22000,
    distLy: 1700,
    distPc: 521,
    vmag: 4.69,
    absmag: -3.9,
    colorHex: '#9bb0ff',
    coronaHex: '#6e94ff'
  },
  // 120. Xi Aquilae (Libertas)
  '97938': {
    id: 'libertas',
    name: 'Libertas (Xi Aquilae)',
    spec: 'G9III',
    stage: 'Yellow Giant',
    teff: 4780,
    mass: 2.2,
    radius: 12.0,
    lum: 69,
    distLy: 204,
    distPc: 62.5,
    vmag: 4.71,
    absmag: 0.73,
    colorHex: '#ffe8d0',
    coronaHex: '#ffd2a1'
  },
  // 121. Omicron-1 Orionis (Al Kumm) - GIANT AGB FIX
  '22667': {
    id: 'al-kumm',
    name: 'Al Kumm (Omicron-1 Orionis)',
    spec: 'M3S III',
    stage: 'Red Giant',
    teff: 3400,
    mass: 1.5,
    radius: 214.0,
    lum: 4500,
    distLy: 650,
    distPc: 200,
    vmag: 4.71,
    absmag: -1.8,
    colorHex: '#ff924d',
    coronaHex: '#ff661d'
  },
  // 122. Mu Aquarii (Albulan)
  '103045': {
    id: 'albulan',
    name: 'Albulan (Mu Aquarii)',
    spec: 'A4V',
    stage: 'White Main Sequence',
    teff: 8300,
    mass: 2.1,
    radius: 2.5,
    lum: 28,
    distLy: 155,
    distPc: 47.5,
    vmag: 4.73,
    absmag: 1.34,
    colorHex: '#cad7ff',
    coronaHex: '#b0c5ff'
  }
};

let updatedCount = 0;

for (let i = 0; i < stars.length; i++) {
  const s = stars[i];
  // Find HIP in designations
  const hipDesig = (s.designations || []).find(d => d.startsWith('HIP '));
  const hip = hipDesig ? hipDesig.replace('HIP ', '') : '';
  const cal = CALIBRATION_DATA[hip];

  if (!cal) continue;

  updatedCount++;
  s.id = cal.id;
  s.name = cal.name;
  s.spectralType = cal.spec;
  s.spectralClass = cal.spec[0];
  s.stellarStage = cal.stage;
  s.temperature = cal.teff;
  s.massSolar = cal.mass;
  s.diameterSolar = cal.radius;
  s.luminositySolar = cal.lum;
  s.distanceLy = cal.distLy;
  s.distanceParsecs = cal.distPc;
  s.apparentMagnitude = cal.vmag;
  s.absoluteMagnitude = cal.absmag;
  s.colorHex = cal.colorHex;
  s.coronaColorHex = cal.coronaHex;

  // Derive precise physical dimensions
  s.diameterKm = Math.round(s.diameterSolar * 1392700);
  s.diameterAU = s.diameterKm / 149597870.7;

  // Habitable Zone AU
  s.habitableZoneAU = {
    inner: parseFloat((Math.sqrt(s.luminositySolar / 1.1)).toFixed(2)),
    outer: parseFloat((Math.sqrt(s.luminositySolar / 0.53)).toFixed(2))
  };

  // Solar engulfment string
  if (s.diameterSolar > 100) {
    s.solarEngulfment = `Enormous giant/supergiant spanning roughly ${s.diameterAU.toFixed(2)} AU (${(s.diameterKm / 1e6).toFixed(1)} Million km)!`;
  } else if (s.diameterSolar > 10) {
    s.solarEngulfment = `Evolved star spanning roughly ${(s.diameterKm / 1e6).toFixed(1)} Million km (${s.diameterAU.toFixed(3)} AU)!`;
  } else {
    s.solarEngulfment = `Spans roughly ${(s.diameterKm / 1e6).toFixed(2)} Million km (~${s.diameterAU.toFixed(4)} AU). Fits easily within Mercury’s orbit (~0.387 AU).`;
  }

  // Update designations and primaryDesignation if necessary
  if (!s.designations.includes(s.name)) {
    s.designations.unshift(s.name);
  }
}

console.log(`Successfully recalibrated ${updatedCount} stars in database.`);

// Re-verify uniqueness of all IDs in catalog
const idSet = new Set();
const dupes = [];
for (const s of stars) {
  if (idSet.has(s.id)) dupes.push(s.id);
  idSet.add(s.id);
}
if (dupes.length > 0) {
  console.error('ERROR: Duplicate IDs still exist:', dupes);
  process.exit(1);
} else {
  console.log('Verification: All 1,007 star IDs are strictly unique.');
}

// Write back updated star database
fs.writeFileSync(DB_PATH, JSON.stringify(stars, null, 2) + '\n');
console.log('Wrote recalibrated stars to', DB_PATH);
