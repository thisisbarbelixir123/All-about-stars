import { StarData } from '../types';
import { formatPhysicalDiameter } from './formatters';
import { soundEffects } from './soundEffects';

/**
 * Renders a high-resolution 1200x675 celestial dossier infographic card onto an offscreen canvas
 * and triggers a client-side PNG download.
 */
export async function exportStarDossierCard(star: StarData): Promise<string> {
  const width = 1200;
  const height = 675;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  // 1. Background: Deep obsidian space gradient
  const bgGrad = ctx.createRadialGradient(width * 0.35, height * 0.45, 10, width * 0.5, height * 0.5, width * 0.7);
  bgGrad.addColorStop(0, '#0c132c');
  bgGrad.addColorStop(0.5, '#050817');
  bgGrad.addColorStop(1, '#020308');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Procedural background starfield (stable pseudo-random from star ID)
  let seed = 0;
  for (let i = 0; i < star.id.length; i++) {
    seed = (seed * 31 + star.id.charCodeAt(i)) & 0xffffffff;
  }
  const pseudoRand = () => {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    return (seed >>> 0) / 4294967296;
  };

  ctx.save();
  for (let i = 0; i < 220; i++) {
    const sx = pseudoRand() * width;
    const sy = pseudoRand() * height;
    const sr = 0.5 + pseudoRand() * 1.6;
    const sa = 0.2 + pseudoRand() * 0.7;
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${sa})`;
    ctx.fill();
  }
  ctx.restore();

  // 3. Technical Coordinate Grid & Reticles
  ctx.save();
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)';
  ctx.lineWidth = 1;

  // Outer border inset 24px
  const inset = 28;
  ctx.strokeRect(inset, inset, width - inset * 2, height - inset * 2);

  // Corner brackets
  const bracketLen = 24;
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 2.5;

  // Top-left
  ctx.beginPath();
  ctx.moveTo(inset, inset + bracketLen);
  ctx.lineTo(inset, inset);
  ctx.lineTo(inset + bracketLen, inset);
  ctx.stroke();

  // Top-right
  ctx.beginPath();
  ctx.moveTo(width - inset - bracketLen, inset);
  ctx.lineTo(width - inset, inset);
  ctx.lineTo(width - inset, inset + bracketLen);
  ctx.stroke();

  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(inset, height - inset - bracketLen);
  ctx.lineTo(inset, height - inset);
  ctx.lineTo(inset + bracketLen, height - inset);
  ctx.stroke();

  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(width - inset - bracketLen, height - inset);
  ctx.lineTo(width - inset, height - inset);
  ctx.lineTo(width - inset, height - inset - bracketLen);
  ctx.stroke();
  ctx.restore();

  // 4. Header Ribbon: Starpedia 3D Astronomical Observatory
  ctx.save();
  ctx.font = 'bold 13px monospace';
  ctx.fillStyle = '#06b6d4';
  ctx.fillText('STARPEDIA 3D // STELLAR DOSSIER ARCHIVE', inset + 16, inset + 28);

  ctx.font = '12px monospace';
  ctx.fillStyle = '#64748b';
  ctx.textAlign = 'right';
  ctx.fillText(`EPOCH J2000.0 • CATALOG ID #${star.id.toUpperCase()}`, width - inset - 16, inset + 28);
  ctx.restore();

  // Divider line
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
  ctx.beginPath();
  ctx.moveTo(inset + 16, inset + 42);
  ctx.lineTo(width - inset - 16, inset + 42);
  ctx.stroke();

  // 5. Left Focal Stage: The Star Visual (Center X ~ 290, Y ~ 350)
  const starCenterX = 280;
  const starCenterY = 355;
  const starRadius = 110;

  // Ambient outer aura
  const auraGrad = ctx.createRadialGradient(starCenterX, starCenterY, starRadius * 0.2, starCenterX, starCenterY, starRadius * 2.3);
  auraGrad.addColorStop(0, `${star.colorHex}55`);
  auraGrad.addColorStop(0.5, `${star.colorHex}18`);
  auraGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = auraGrad;
  ctx.beginPath();
  ctx.arc(starCenterX, starCenterY, starRadius * 2.3, 0, Math.PI * 2);
  ctx.fill();

  // Star Photosphere
  const photoGrad = ctx.createRadialGradient(
    starCenterX - starRadius * 0.3,
    starCenterY - starRadius * 0.3,
    starRadius * 0.05,
    starCenterX,
    starCenterY,
    starRadius
  );
  photoGrad.addColorStop(0, '#ffffff');
  photoGrad.addColorStop(0.35, star.colorHex);
  photoGrad.addColorStop(0.85, star.colorHex);
  photoGrad.addColorStop(1, '#ffffff');

  ctx.save();
  ctx.shadowColor = star.colorHex;
  ctx.shadowBlur = 35;
  ctx.beginPath();
  ctx.arc(starCenterX, starCenterY, starRadius, 0, Math.PI * 2);
  ctx.fillStyle = photoGrad;
  ctx.fill();
  ctx.restore();

  // Crosshair markers around star
  ctx.save();
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
  ctx.lineWidth = 1;
  const chLen = 16;
  const chOffset = starRadius + 22;

  // Top
  ctx.beginPath();
  ctx.moveTo(starCenterX, starCenterY - chOffset);
  ctx.lineTo(starCenterX, starCenterY - chOffset - chLen);
  ctx.stroke();
  // Bottom
  ctx.beginPath();
  ctx.moveTo(starCenterX, starCenterY + chOffset);
  ctx.lineTo(starCenterX, starCenterY + chOffset + chLen);
  ctx.stroke();
  // Left
  ctx.beginPath();
  ctx.moveTo(starCenterX - chOffset, starCenterY);
  ctx.lineTo(starCenterX - chOffset - chLen, starCenterY);
  ctx.stroke();
  // Right
  ctx.beginPath();
  ctx.moveTo(starCenterX + chOffset, starCenterY);
  ctx.lineTo(starCenterX + chOffset + chLen, starCenterY);
  ctx.stroke();

  // Circumscribed orbital coordinate ring
  ctx.beginPath();
  ctx.setLineDash([4, 6]);
  ctx.arc(starCenterX, starCenterY, starRadius + 18, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Label under star
  ctx.save();
  ctx.font = '11px monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.textAlign = 'center';
  ctx.fillText(`SPECTRAL VISUAL MODEL • ${star.spectralType}`, starCenterX, starCenterY + starRadius + 44);
  ctx.restore();

  // 6. Right Side: Star Telemetry & Scientific Dossier
  const infoLeft = 530;
  let cursorY = inset + 85;

  // Primary Headline: Star Name
  ctx.save();
  ctx.font = '900 38px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(star.name, infoLeft, cursorY);
  ctx.restore();

  cursorY += 28;

  // Subtitle: Constellation and Stellar Stage
  ctx.save();
  ctx.font = '14px monospace';
  ctx.fillStyle = '#38bdf8';
  const stageName = star.stellarStage;
  ctx.fillText(`CONSTELLATION: ${star.constellation.toUpperCase()}  •  STAGE: ${stageName.toUpperCase()}`, infoLeft, cursorY);
  ctx.restore();

  cursorY += 26;

  // Alternate names
  if (star.alternateNames && star.alternateNames.length > 0) {
    ctx.save();
    ctx.font = '12px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText(`Designations: ${star.alternateNames.slice(0, 4).join(', ')}`, infoLeft, cursorY);
    ctx.restore();
    cursorY += 24;
  }

  // 7. Key Astrophysical Properties Grid (2 rows x 3 columns)
  cursorY += 10;
  const boxW = 190;
  const boxH = 68;
  const gapX = 14;
  const gapY = 12;

  const diameterObj = formatPhysicalDiameter(star.diameterKm, star.diameterSolar);

  const metrics = [
    { label: 'DIAMETER', val: diameterObj.metricSi, sub: diameterObj.solarFormatted, color: '#22d3ee' },
    { label: 'MASS', val: `${star.massSolar.toFixed(star.massSolar < 1 ? 2 : 1)} M☉`, sub: `${(star.massSolar * 1.989e30).toExponential(2)} kg`, color: '#60a5fa' },
    { label: 'TEMPERATURE', val: `${star.temperature.toLocaleString()} K`, sub: `${Math.round(star.temperature - 273.15).toLocaleString()} °C`, color: '#fbbf24' },
    { label: 'LUMINOSITY', val: `${star.luminositySolar >= 1000 ? star.luminositySolar.toLocaleString() : star.luminositySolar} L☉`, sub: 'Bolometric Flux', color: '#f472b6' },
    { label: 'DISTANCE', val: star.distanceLy < 0.001 ? '0.000016 ly' : `${star.distanceLy.toLocaleString()} ly`, sub: `${(star.distanceLy / 3.262).toFixed(1)} parsecs`, color: '#a78bfa' },
    { label: 'SPECTRAL CLASS', val: star.spectralType, sub: `${star.spectralClass}-Class Profile`, color: star.colorHex },
  ];

  metrics.forEach((m, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const bx = infoLeft + col * (boxW + gapX);
    const by = cursorY + row * (boxH + gapY);

    // Box background
    ctx.save();
    ctx.fillStyle = 'rgba(4, 10, 28, 0.75)';
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(bx, by, boxW, boxH, 8);
    ctx.fill();
    ctx.stroke();

    // Metric Label
    ctx.font = 'bold 9px monospace';
    ctx.fillStyle = '#64748b';
    ctx.fillText(m.label, bx + 10, by + 18);

    // Metric Value
    ctx.font = 'bold 15px monospace';
    ctx.fillStyle = m.color;
    ctx.fillText(m.val, bx + 10, by + 40);

    // Subtitle
    ctx.font = '10px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(m.sub, bx + 10, by + 58);
    ctx.restore();
  });

  cursorY += 2 * (boxH + gapY) + 16;

  // 8. Description / Astrophysical Insight text
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
  ctx.lineWidth = 1;
  const descBoxW = boxW * 3 + gapX * 2;
  const descBoxH = 88;
  ctx.beginPath();
  ctx.roundRect(infoLeft, cursorY, descBoxW, descBoxH, 8);
  ctx.fill();
  ctx.stroke();

  // Summary heading
  ctx.font = 'bold 10px monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('ASTROPHYSICAL SUMMARY', infoLeft + 12, cursorY + 20);

  // Wrap description text
  ctx.font = '12px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#cbd5e1';

  const fullText = star.description || 'Stellar body cataloged in the astrophysical survey.';
  const words = fullText.split(' ');
  let line = '';
  let lineY = cursorY + 40;
  const maxLineWidth = descBoxW - 24;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metricsResult = ctx.measureText(testLine);
    if (metricsResult.width > maxLineWidth && n > 0) {
      ctx.fillText(line, infoLeft + 12, lineY);
      line = words[n] + ' ';
      lineY += 18;
      if (lineY > cursorY + descBoxH - 12) break;
    } else {
      line = testLine;
    }
  }
  if (lineY <= cursorY + descBoxH - 12) {
    ctx.fillText(line, infoLeft + 12, lineY);
  }
  ctx.restore();

  // 9. Footer Watermark & Timestamp
  ctx.save();
  ctx.font = '11px monospace';
  ctx.fillStyle = '#475569';
  ctx.fillText('GENERATED BY STARPEDIA 3D ASTRONOMICAL ENGINE', inset + 16, height - inset - 14);

  const now = new Date();
  const dateStr = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')} UTC`;
  ctx.textAlign = 'right';
  ctx.fillText(`VERIFIED ASTRONOMY DATA • ${dateStr}`, width - inset - 16, height - inset - 14);
  ctx.restore();

  // 10. Convert canvas to PNG blob and trigger download
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas image blob generation failed'));
        return;
      }
      const url = URL.createObjectURL(blob);
      const cleanName = star.name.replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `${cleanName}_Dossier_Card.png`;

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(url), 4000);
      soundEffects.play('select');
      resolve(filename);
    }, 'image/png');
  });
}
