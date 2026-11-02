const fs = require('fs');
const path = require('path');

const solPath = path.resolve('src/data/solarSystemCatalog.ts');
let code = fs.readFileSync(solPath, 'utf8');

const solMetrics = {
  'sol-sun': { massEarth: 333000, massJupiter: 1047.57, orbitalPeriodDays: null, semiMajorAxisAU: null, albedo: null, albedoType: undefined, discoveryMethod: 'naked eye' },
  'sol-jupiter': { massEarth: 317.828, massJupiter: 1.0, orbitalPeriodDays: 4332.59, semiMajorAxisAU: 5.2044, albedo: 0.503, albedoType: 'measured', discoveryMethod: 'naked eye' },
  'sol-saturn': { massEarth: 95.159, massJupiter: 0.2994, orbitalPeriodDays: 10759.22, semiMajorAxisAU: 9.5826, albedo: 0.342, albedoType: 'measured', discoveryMethod: 'naked eye' },
  'sol-uranus': { massEarth: 14.536, massJupiter: 0.0457, orbitalPeriodDays: 30685.4, semiMajorAxisAU: 19.2184, albedo: 0.300, albedoType: 'measured', discoveryMethod: 'telescopic' },
  'sol-neptune': { massEarth: 17.147, massJupiter: 0.05395, orbitalPeriodDays: 60189.0, semiMajorAxisAU: 30.07, albedo: 0.290, albedoType: 'measured', discoveryMethod: 'mathematical prediction' },
  'sol-earth': { massEarth: 1.0, massJupiter: 0.003146, orbitalPeriodDays: 365.256, semiMajorAxisAU: 1.0, albedo: 0.306, albedoType: 'measured', discoveryMethod: 'primary anchor' },
  'sol-venus': { massEarth: 0.815, massJupiter: 0.002564, orbitalPeriodDays: 224.701, semiMajorAxisAU: 0.7233, albedo: 0.75, albedoType: 'measured', discoveryMethod: 'naked eye' },
  'sol-mars': { massEarth: 0.107, massJupiter: 0.000338, orbitalPeriodDays: 686.98, semiMajorAxisAU: 1.5237, albedo: 0.17, albedoType: 'measured', discoveryMethod: 'naked eye' },
  'sol-mercury': { massEarth: 0.0553, massJupiter: 0.000174, orbitalPeriodDays: 87.969, semiMajorAxisAU: 0.3871, albedo: 0.142, albedoType: 'measured', discoveryMethod: 'naked eye' },
  'sol-moon': { massEarth: 0.0123, massJupiter: 0.0000387, orbitalPeriodDays: 27.322, semiMajorAxisAU: 0.00257, albedo: 0.12, albedoType: 'measured', discoveryMethod: 'naked eye' },
  'sol-ganymede': { massEarth: 0.0248, massJupiter: 0.000078, orbitalPeriodDays: 7.155, semiMajorAxisAU: 0.00716, albedo: 0.43, albedoType: 'measured', discoveryMethod: 'telescopic' },
  'sol-titan': { massEarth: 0.0225, massJupiter: 0.0000708, orbitalPeriodDays: 15.945, semiMajorAxisAU: 0.00817, albedo: 0.22, albedoType: 'measured', discoveryMethod: 'telescopic' },
  'sol-callisto': { massEarth: 0.018, massJupiter: 0.0000566, orbitalPeriodDays: 16.689, semiMajorAxisAU: 0.01258, albedo: 0.22, albedoType: 'measured', discoveryMethod: 'telescopic' },
  'sol-io': { massEarth: 0.015, massJupiter: 0.0000472, orbitalPeriodDays: 1.769, semiMajorAxisAU: 0.00282, albedo: 0.63, albedoType: 'measured', discoveryMethod: 'telescopic' },
  'sol-europa': { massEarth: 0.008, massJupiter: 0.0000252, orbitalPeriodDays: 3.551, semiMajorAxisAU: 0.00449, albedo: 0.67, albedoType: 'measured', discoveryMethod: 'telescopic' },
  'sol-triton': { massEarth: 0.00358, massJupiter: 0.0000113, orbitalPeriodDays: 5.877, semiMajorAxisAU: 0.00237, albedo: 0.76, albedoType: 'measured', discoveryMethod: 'telescopic' },
  'sol-pluto': { massEarth: 0.00218, massJupiter: 0.0000069, orbitalPeriodDays: 90560.0, semiMajorAxisAU: 39.482, albedo: 0.52, albedoType: 'measured', discoveryMethod: 'photographic plate' },
  'sol-eris': { massEarth: 0.0028, massJupiter: 0.0000088, orbitalPeriodDays: 203830.0, semiMajorAxisAU: 67.781, albedo: 0.96, albedoType: 'measured', discoveryMethod: 'telescopic' },
  'sol-haumea': { massEarth: 0.00066, massJupiter: 0.0000021, orbitalPeriodDays: 103774.0, semiMajorAxisAU: 43.218, albedo: 0.66, albedoType: 'measured', discoveryMethod: 'telescopic' },
  'sol-makemake': { massEarth: 0.0005, massJupiter: 0.0000016, orbitalPeriodDays: 112897.0, semiMajorAxisAU: 45.79, albedo: 0.81, albedoType: 'measured', discoveryMethod: 'telescopic' },
  'sol-titania': { massEarth: 0.00057, massJupiter: 0.0000018, orbitalPeriodDays: 8.706, semiMajorAxisAU: 0.00291, albedo: 0.27, albedoType: 'measured', discoveryMethod: 'telescopic' },
  'sol-rhea': { massEarth: 0.00039, massJupiter: 0.0000012, orbitalPeriodDays: 4.518, semiMajorAxisAU: 0.00352, albedo: 0.949, albedoType: 'measured', discoveryMethod: 'telescopic' },
  'sol-oberon': { massEarth: 0.0005, massJupiter: 0.0000016, orbitalPeriodDays: 13.463, semiMajorAxisAU: 0.0039, albedo: 0.23, albedoType: 'measured', discoveryMethod: 'telescopic' },
  'sol-iapetus': { massEarth: 0.0003, massJupiter: 0.00000095, orbitalPeriodDays: 79.321, semiMajorAxisAU: 0.0238, albedo: 0.05, albedoType: 'measured', discoveryMethod: 'telescopic' },
  'sol-gonggong': { massEarth: 0.00029, massJupiter: 0.00000092, orbitalPeriodDays: 202570.0, semiMajorAxisAU: 67.5, albedo: 0.14, albedoType: 'measured', discoveryMethod: 'telescopic' },
  'sol-charon': { massEarth: 0.00026, massJupiter: 0.00000083, orbitalPeriodDays: 6.387, semiMajorAxisAU: 0.000131, albedo: 0.38, albedoType: 'measured', discoveryMethod: 'photographic plate' },
  'sol-umbriel': { massEarth: 0.00021, massJupiter: 0.00000067, orbitalPeriodDays: 4.144, semiMajorAxisAU: 0.00178, albedo: 0.21, albedoType: 'measured', discoveryMethod: 'telescopic' },
  'sol-ariel': { massEarth: 0.00022, massJupiter: 0.0000007, orbitalPeriodDays: 2.52, semiMajorAxisAU: 0.00128, albedo: 0.39, albedoType: 'measured', discoveryMethod: 'telescopic' },
  'sol-dione': { massEarth: 0.00018, massJupiter: 0.00000058, orbitalPeriodDays: 2.737, semiMajorAxisAU: 0.00252, albedo: 0.998, albedoType: 'measured', discoveryMethod: 'telescopic' },
  'sol-quaoar': { massEarth: 0.0002, massJupiter: 0.00000063, orbitalPeriodDays: 105470.0, semiMajorAxisAU: 43.69, albedo: 0.12, albedoType: 'measured', discoveryMethod: 'telescopic' },
  'sol-tethys': { massEarth: 0.0001, massJupiter: 0.00000032, orbitalPeriodDays: 1.888, semiMajorAxisAU: 0.00197, albedo: 1.229, albedoType: 'measured', discoveryMethod: 'telescopic' },
  'sol-sedna': { massEarth: 0.00017, massJupiter: 0.00000053, orbitalPeriodDays: 4160000.0, semiMajorAxisAU: 506.0, albedo: 0.32, albedoType: 'measured', discoveryMethod: 'telescopic' },
  'sol-ceres': { massEarth: 0.000157, massJupiter: 0.00000049, orbitalPeriodDays: 1683.14, semiMajorAxisAU: 2.7675, albedo: 0.09, albedoType: 'measured', discoveryMethod: 'telescopic' },
  'sol-orcus': { massEarth: 0.0001, massJupiter: 0.00000032, orbitalPeriodDays: 89610.0, semiMajorAxisAU: 39.419, albedo: 0.23, albedoType: 'measured', discoveryMethod: 'telescopic' },
  'sol-salacia': { massEarth: 0.00008, massJupiter: 0.00000025, orbitalPeriodDays: 100140.0, semiMajorAxisAU: 42.19, albedo: 0.044, albedoType: 'measured', discoveryMethod: 'telescopic' },
  'sol-varda': { massEarth: 0.00004, massJupiter: 0.00000013, orbitalPeriodDays: 114620.0, semiMajorAxisAU: 46.12, albedo: 0.10, albedoType: 'measured', discoveryMethod: 'telescopic' },
  'sol-ixion': { massEarth: 0.00005, massJupiter: 0.00000016, orbitalPeriodDays: 91400.0, semiMajorAxisAU: 39.7, albedo: 0.14, albedoType: 'measured', discoveryMethod: 'telescopic' },
  'sol-gkunhomdima': { massEarth: 0.00003, massJupiter: 0.00000009, orbitalPeriodDays: 104500.0, semiMajorAxisAU: 43.4, albedo: 0.17, albedoType: 'measured', discoveryMethod: 'telescopic' },
  'sol-2002ms4': { massEarth: 0.00004, massJupiter: 0.00000013, orbitalPeriodDays: 99400.0, semiMajorAxisAU: 41.9, albedo: 0.05, albedoType: 'measured', discoveryMethod: 'telescopic' },
  'sol-varuna': { massEarth: 0.00003, massJupiter: 0.00000009, orbitalPeriodDays: 103400.0, semiMajorAxisAU: 43.0, albedo: 0.127, albedoType: 'measured', discoveryMethod: 'telescopic' },
  'sol-chaos': { massEarth: 0.00002, massJupiter: 0.00000006, orbitalPeriodDays: 113000.0, semiMajorAxisAU: 45.9, albedo: 0.05, albedoType: 'measured', discoveryMethod: 'telescopic' },
  'sol-vesta': { massEarth: 0.000043, massJupiter: 0.00000014, orbitalPeriodDays: 1325.75, semiMajorAxisAU: 2.3618, albedo: 0.423, albedoType: 'measured', discoveryMethod: 'telescopic' },
  'sol-pallas': { massEarth: 0.000034, massJupiter: 0.00000011, orbitalPeriodDays: 1686.0, semiMajorAxisAU: 2.773, albedo: 0.101, albedoType: 'measured', discoveryMethod: 'telescopic' },
  'sol-enceladus': { massEarth: 0.000018, massJupiter: 0.000000057, orbitalPeriodDays: 1.37, semiMajorAxisAU: 0.00159, albedo: 1.375, albedoType: 'measured', discoveryMethod: 'telescopic' },
  'sol-miranda': { massEarth: 0.000011, massJupiter: 0.000000035, orbitalPeriodDays: 1.413, semiMajorAxisAU: 0.000868, albedo: 0.32, albedoType: 'measured', discoveryMethod: 'telescopic' },
  'sol-hygiea': { massEarth: 0.000015, massJupiter: 0.000000047, orbitalPeriodDays: 2034.0, semiMajorAxisAU: 3.142, albedo: 0.072, albedoType: 'measured', discoveryMethod: 'telescopic' },
  'sol-proteus': { massEarth: 0.000008, massJupiter: 0.000000025, orbitalPeriodDays: 1.122, semiMajorAxisAU: 0.000786, albedo: 0.096, albedoType: 'measured', discoveryMethod: 'spacecraft imaging' },
  'sol-mimas': { massEarth: 0.0000063, massJupiter: 0.00000002, orbitalPeriodDays: 0.942, semiMajorAxisAU: 0.00124, albedo: 0.962, albedoType: 'measured', discoveryMethod: 'telescopic' },
};

let enrichedCount = 0;
for (const [id, m] of Object.entries(solMetrics)) {
  const blockRegex = new RegExp(`id:\\s*'${id}',[\\s\\S]*?\\n  \\},`);
  const match = code.match(blockRegex);
  if (match) {
    let block = match[0];
    
    // Insert fields if missing
    if (!block.includes('massEarth') && m.massEarth !== undefined) {
      block = block.replace(/(id:\s*'[^']+',)/, `$1\n    massEarth: ${m.massEarth},\n    massJupiter: ${m.massJupiter},`);
    }
    if (!block.includes('orbitalPeriodDays') && m.orbitalPeriodDays !== undefined) {
      const pVal = m.orbitalPeriodDays === null ? 'null' : m.orbitalPeriodDays;
      const aVal = m.semiMajorAxisAU === null ? 'null' : m.semiMajorAxisAU;
      block = block.replace(/(hostSystem:\s*'[^']+',)/, `$1\n    orbitalPeriodDays: ${pVal},\n    semiMajorAxisAU: ${aVal},`);
    }
    if (!block.includes('albedo:') && m.albedo !== undefined && m.albedo !== null) {
      block = block.replace(/(temperatureK:\s*[^,]+,)/, `$1\n    albedo: ${m.albedo},\n    albedoType: 'measured',`);
    }
    if (!block.includes('discoveryMethod:') && m.discoveryMethod) {
      block = block.replace(/(discoveryYear:\s*[^,]+,)/, `$1\n    discoveryMethod: '${m.discoveryMethod}',`);
    }

    code = code.replace(match[0], block);
    enrichedCount++;
  }
}

fs.writeFileSync(solPath, code, 'utf8');
console.log(`Successfully enriched ${enrichedCount} Solar System bodies with full physical info in ${solPath}!`);
