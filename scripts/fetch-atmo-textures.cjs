const fs = require('fs');
const path = require('path');
const https = require('https');

const TEXTURES_DIR = path.resolve(__dirname, '../public/textures/planets');

const ATMO_SOURCES = {
  'earth-specular.jpg': [
    'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/earth_specular_2048.jpg'
  ],
  'earth-clouds.png': [
    'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/earth_clouds_2048.png',
    'https://raw.githubusercontent.com/CelestiaProject/CelestiaContent/master/textures/hires/earth-clouds.png',
    'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/earth_clouds_1024.png'
  ],
  'venus-clouds.jpg': [
    'https://raw.githubusercontent.com/CelestiaProject/CelestiaContent/master/textures/medres/venus-clouds.jpg'
  ],
  'titan-clouds.jpg': [
    'https://raw.githubusercontent.com/CelestiaProject/CelestiaContent/master/textures/hires/titan-clouds.jpg'
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
  console.log(`Fetching atmospheric and specular textures...`);
  for (const [filename, urls] of Object.entries(ATMO_SOURCES)) {
    const destPath = path.join(TEXTURES_DIR, filename);
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
      console.log(`[EXISTS] ${filename} (${(fs.statSync(destPath).size / 1024).toFixed(1)} KB)`);
      continue;
    }
    let success = false;
    for (const url of urls) {
      try {
        console.log(`[FETCHING] ${filename} from ${url}...`);
        await downloadUrl(url, destPath);
        const sizeKb = (fs.statSync(destPath).size / 1024).toFixed(1);
        console.log(`[SUCCESS] Saved ${filename} (${sizeKb} KB)`);
        success = true;
        break;
      } catch (err) {
        console.warn(`[WARN] Failed to fetch ${url}: ${err.message}`);
      }
    }
    if (!success) {
      console.error(`[ERROR] Failed to download ${filename}`);
    }
  }
  console.log('Atmospheric fetch completed.');
}

main().catch(console.error);
