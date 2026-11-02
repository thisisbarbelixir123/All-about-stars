const fs = require('fs');
const path = require('path');
const https = require('https');

const TEXTURES_DIR = path.resolve(__dirname, '../public/textures/planets');

if (!fs.existsSync(TEXTURES_DIR)) {
  fs.mkdirSync(TEXTURES_DIR, { recursive: true });
}

// Map each target filename to candidate remote URLs in order of preference
const TEXTURE_SOURCES = {
  'mercury.jpg': [
    'https://raw.githubusercontent.com/CelestiaProject/CelestiaContent/master/textures/hires/mercury.jpg'
  ],
  'venus.jpg': [
    'https://raw.githubusercontent.com/CelestiaProject/CelestiaContent/master/textures/hires/venus.jpg'
  ],
  'earth.jpg': [
    'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/CelestiaProject/CelestiaContent/master/textures/hires/earth.png'
  ],
  'moon.jpg': [
    'https://raw.githubusercontent.com/CelestiaProject/CelestiaContent/master/textures/hires/moon.jpg'
  ],
  'mars.jpg': [
    'https://raw.githubusercontent.com/CelestiaProject/CelestiaContent/master/textures/hires/mars.jpg'
  ],
  'jupiter.jpg': [
    'https://raw.githubusercontent.com/CelestiaProject/CelestiaContent/master/textures/hires/jupiter-2018.jpg',
    'https://raw.githubusercontent.com/CelestiaProject/CelestiaContent/master/textures/hires/jupiter.jpg'
  ],
  'io.png': [
    'https://raw.githubusercontent.com/CelestiaProject/CelestiaContent/master/textures/hires/io.png'
  ],
  'europa.jpg': [
    'https://raw.githubusercontent.com/CelestiaProject/CelestiaContent/master/textures/hires/europa.jpg'
  ],
  'ganymede.jpg': [
    'https://raw.githubusercontent.com/CelestiaProject/CelestiaContent/master/textures/hires/ganymede.jpg'
  ],
  'callisto.jpg': [
    'https://raw.githubusercontent.com/CelestiaProject/CelestiaContent/master/textures/hires/callisto.jpg'
  ],
  'saturn.jpg': [
    'https://raw.githubusercontent.com/CelestiaProject/CelestiaContent/master/textures/hires/saturn.jpg'
  ],
  'mimas.jpg': [
    'https://raw.githubusercontent.com/CelestiaProject/CelestiaContent/master/textures/hires/mimas.jpg'
  ],
  'enceladus.jpg': [
    'https://raw.githubusercontent.com/CelestiaProject/CelestiaContent/master/textures/hires/enceladus.jpg'
  ],
  'tethys.jpg': [
    'https://raw.githubusercontent.com/CelestiaProject/CelestiaContent/master/textures/hires/tethys.jpg'
  ],
  'dione.jpg': [
    'https://raw.githubusercontent.com/CelestiaProject/CelestiaContent/master/textures/hires/dione.jpg'
  ],
  'rhea.jpg': [
    'https://raw.githubusercontent.com/CelestiaProject/CelestiaContent/master/textures/hires/rhea.jpg'
  ],
  'titan.jpg': [
    'https://raw.githubusercontent.com/CelestiaProject/CelestiaContent/master/textures/hires/titan-clouds.jpg',
    'https://raw.githubusercontent.com/CelestiaProject/CelestiaContent/master/textures/hires/titan.png'
  ],
  'iapetus.jpg': [
    'https://raw.githubusercontent.com/CelestiaProject/CelestiaContent/master/textures/hires/iapetus.jpg'
  ],
  'uranus.jpg': [
    'https://raw.githubusercontent.com/CelestiaProject/CelestiaContent/master/textures/hires/uranus.jpg'
  ],
  'miranda.jpg': [
    'https://raw.githubusercontent.com/CelestiaProject/CelestiaContent/master/textures/hires/miranda.jpg'
  ],
  'ariel.jpg': [
    'https://raw.githubusercontent.com/CelestiaProject/CelestiaContent/master/textures/hires/ariel.jpg'
  ],
  'umbriel.jpg': [
    'https://raw.githubusercontent.com/CelestiaProject/CelestiaContent/master/textures/medres/umbriel.jpg'
  ],
  'titania.jpg': [
    'https://raw.githubusercontent.com/CelestiaProject/CelestiaContent/master/textures/medres/titania.jpg'
  ],
  'oberon.jpg': [
    'https://raw.githubusercontent.com/CelestiaProject/CelestiaContent/master/textures/medres/oberon.jpg'
  ],
  'neptune.jpg': [
    'https://raw.githubusercontent.com/CelestiaProject/CelestiaContent/master/textures/hires/neptune.jpg'
  ],
  'triton.jpg': [
    'https://raw.githubusercontent.com/CelestiaProject/CelestiaContent/master/textures/hires/triton.jpg'
  ],
  'proteus.jpg': [
    'https://raw.githubusercontent.com/CelestiaProject/CelestiaContent/master/textures/lores/proteus.jpg'
  ],
  'pluto.jpg': [
    'https://raw.githubusercontent.com/CelestiaProject/CelestiaContent/master/textures/hires/pluto.jpg'
  ],
  'charon.jpg': [
    'https://raw.githubusercontent.com/CelestiaProject/CelestiaContent/master/textures/hires/charon.jpg'
  ],
  'ceres.jpg': [
    'https://raw.githubusercontent.com/CelestiaProject/CelestiaContent/master/textures/hires/ceres.jpg'
  ],
  'vesta.jpg': [
    'https://raw.githubusercontent.com/CelestiaProject/CelestiaContent/master/textures/hires/vesta.jpg'
  ],
  'phobos.jpg': [
    'https://raw.githubusercontent.com/CelestiaProject/CelestiaContent/master/textures/hires/phobos.jpg'
  ],
  'deimos.jpg': [
    'https://raw.githubusercontent.com/CelestiaProject/CelestiaContent/master/textures/hires/deimos.jpg'
  ]
};

function downloadUrl(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    const req = https.get(url, { headers: { 'User-Agent': 'AllAboutStars-TextureFetcher' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        return downloadUrl(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve());
      });
    });
    req.on('error', (err) => {
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(err);
    });
    req.setTimeout(30000, () => {
      req.abort();
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(new Error(`Timeout downloading ${url}`));
    });
  });
}

async function main() {
  console.log(`Starting texture fetch for ${Object.keys(TEXTURE_SOURCES).length} celestial bodies...`);
  let successCount = 0;
  let failCount = 0;

  for (const [filename, urls] of Object.entries(TEXTURE_SOURCES)) {
    const destPath = path.join(TEXTURES_DIR, filename);
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
      console.log(`[EXISTS] ${filename} (${(fs.statSync(destPath).size / 1024).toFixed(1)} KB)`);
      successCount++;
      continue;
    }

    let downloaded = false;
    for (const url of urls) {
      try {
        console.log(`[FETCHING] ${filename} from ${url}...`);
        await downloadUrl(url, destPath);
        const sizeKb = (fs.statSync(destPath).size / 1024).toFixed(1);
        console.log(`[SUCCESS] Saved ${filename} (${sizeKb} KB)`);
        downloaded = true;
        successCount++;
        break;
      } catch (err) {
        console.warn(`[WARN] Failed to fetch ${url}: ${err.message}`);
      }
    }

    if (!downloaded) {
      console.error(`[ERROR] All mirrors failed for ${filename}`);
      failCount++;
    }
  }

  console.log(`\nFetch complete! Successfully downloaded/verified: ${successCount}, Failed: ${failCount}`);
}

main().catch(console.error);
