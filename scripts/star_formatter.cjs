const fs = require('fs');
const path = require('path');

function formatStar(s) {
  const engulfs = s.engulfsPlanets && s.engulfsPlanets.length > 0 ? JSON.stringify(s.engulfsPlanets) : '[]';
  const exoplanetStr = s.exoplanetSystem ? JSON.stringify(s.exoplanetSystem, null, 6) : `{
      hasExoplanets: false,
      confirmedCount: 0,
      candidateCount: 0,
      systemOverview: 'No confirmed exoplanets detected.',
      planets: []
    }`;
  const notableStr = JSON.stringify(s.notableFacts || [], null, 6);

  return `  makeStar({
    id: ${JSON.stringify(s.id)},
    name: ${JSON.stringify(s.name)},
    alternateNames: ${JSON.stringify(s.alternateNames || [])},
    bayerDesignation: ${JSON.stringify(s.bayerDesignation)},
    constellation: ${JSON.stringify(s.constellation)},
    diameterSolar: ${s.diameterSolar},
    temperature: ${s.temperature},
    spectralType: ${JSON.stringify(s.spectralType)},
    spectralClass: ${JSON.stringify(s.spectralClass)},
    luminositySolar: ${s.luminositySolar},
    massSolar: ${s.massSolar},
    estimatedAge: ${JSON.stringify(s.estimatedAge)},
    estimatedAgeMyr: ${s.estimatedAgeMyr},
    metallicityFeH: ${s.metallicityFeH !== undefined ? s.metallicityFeH : 0.0},
    rotationalVelocityKmS: ${s.rotationalVelocityKmS || 5},
    distanceLy: ${s.distanceLy},
    apparentMagnitude: ${s.apparentMagnitude},
    absoluteMagnitude: ${s.absoluteMagnitude},
    surfaceGravityLogG: ${s.surfaceGravityLogG},
    colorHex: ${JSON.stringify(s.colorHex)},
    coronaColorHex: ${JSON.stringify(s.coronaColorHex)},
    solarEngulfment: ${JSON.stringify(s.solarEngulfment || 'Spans a fraction of an AU.')},
    engulfsPlanets: ${engulfs},
    habitableZoneAU: { inner: ${s.habitableZoneAU.inner}, outer: ${s.habitableZoneAU.outer} },
    exoplanetSystem: ${exoplanetStr},
    stellarStage: ${JSON.stringify(s.stellarStage)},
    lifespanEstimate: ${JSON.stringify(s.lifespanEstimate)},
    futureFate: ${JSON.stringify(s.futureFate)},
    fusionProcess: ${JSON.stringify(s.fusionProcess)},
    notableFacts: ${notableStr},
    description: ${JSON.stringify(s.description)}
  })`;
}

module.exports = { formatStar };
