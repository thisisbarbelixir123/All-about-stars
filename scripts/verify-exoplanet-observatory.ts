import fs from 'node:fs';
import path from 'node:path';

type Phase = 'tokens' | 'loading-formatters' | 'shortcuts' | 'hud' | 'safety' | 'all';

interface CheckResult {
  name: string;
  passed: boolean;
  message?: string;
}

const ROOT_DIR = process.cwd();

function checkTokensPhase(): CheckResult[] {
  const results: CheckResult[] = [];

  const indexHtmlPath = path.join(ROOT_DIR, 'index.html');
  const indexCssPath = path.join(ROOT_DIR, 'src', 'index.css');

  if (!fs.existsSync(indexHtmlPath)) {
    results.push({ name: 'index.html exists', passed: false, message: 'index.html not found' });
    return results;
  }
  if (!fs.existsSync(indexCssPath)) {
    results.push({ name: 'src/index.css exists', passed: false, message: 'src/index.css not found' });
    return results;
  }

  const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
  const indexCss = fs.readFileSync(indexCssPath, 'utf-8');

  // 1. index.html does not contain Orbitron or Plus Jakarta Sans
  const hasOrbitron = indexHtml.includes('Orbitron');
  const hasPlusJakarta = indexHtml.includes('Plus+Jakarta+Sans') || indexHtml.includes('Plus Jakarta Sans');
  results.push({
    name: 'index.html retires Orbitron and Plus Jakarta Sans',
    passed: !hasOrbitron && !hasPlusJakarta,
    message: hasOrbitron
      ? 'index.html still references Orbitron'
      : hasPlusJakarta
        ? 'index.html still references Plus Jakarta Sans'
        : undefined,
  });

  // 2. index.html includes Instrument Sans and JetBrains Mono
  const hasInstrumentSans = indexHtml.includes('Instrument+Sans');
  const hasJetBrainsMono = indexHtml.includes('JetBrains+Mono');
  results.push({
    name: 'index.html includes Instrument Sans and JetBrains Mono',
    passed: hasInstrumentSans && hasJetBrainsMono,
    message: !hasInstrumentSans
      ? 'index.html missing Instrument+Sans'
      : !hasJetBrainsMono
        ? 'index.html missing JetBrains+Mono'
        : undefined,
  });

  // 3. index.html has sky selection instead of cyan selection
  const hasCyanSelection = indexHtml.includes('selection:bg-cyan-500');
  const hasSkySelection = indexHtml.includes('selection:bg-sky-500');
  results.push({
    name: 'index.html uses sky selection styling',
    passed: !hasCyanSelection && hasSkySelection,
    message: hasCyanSelection
      ? 'index.html still contains cyan text selection'
      : !hasSkySelection
        ? 'index.html missing selection:bg-sky-500'
        : undefined,
  });

  // 4. src/index.css defines .observatory-panel and .observatory-control
  const hasObservatoryPanel = indexCss.includes('.observatory-panel');
  const hasObservatoryControl = indexCss.includes('.observatory-control');
  results.push({
    name: 'src/index.css defines .observatory-panel and .observatory-control',
    passed: hasObservatoryPanel && hasObservatoryControl,
    message: !hasObservatoryPanel
      ? 'src/index.css missing .observatory-panel'
      : !hasObservatoryControl
        ? 'src/index.css missing .observatory-control'
        : undefined,
  });

  // 5. src/index.css defines global :focus-visible
  const hasFocusVisible = /:focus-visible\s*\{[^}]*outline:\s*2px solid #38bdf8/i.test(indexCss);
  results.push({
    name: 'src/index.css defines :focus-visible with #38bdf8 outline',
    passed: hasFocusVisible,
    message: hasFocusVisible ? undefined : 'src/index.css missing :focus-visible with #38bdf8 outline',
  });

  // 6. src/index.css maps --font-display, --font-title, and --font-sans to Instrument Sans
  const fontDisplayMatch = /--font-display:\s*['"]?Instrument Sans/i.test(indexCss);
  const fontTitleMatch = /--font-title:\s*['"]?Instrument Sans/i.test(indexCss);
  const fontSansMatch = /--font-sans:\s*['"]?Instrument Sans/i.test(indexCss);
  results.push({
    name: 'src/index.css maps fonts to Instrument Sans',
    passed: fontDisplayMatch && fontTitleMatch && fontSansMatch,
    message: !fontDisplayMatch
      ? '--font-display is not Instrument Sans'
      : !fontTitleMatch
        ? '--font-title is not Instrument Sans'
        : !fontSansMatch
          ? '--font-sans is not Instrument Sans'
          : undefined,
  });

  // 7. src/index.css contains zero .cosmic-glass or .cosmic-glow-
  const hasCosmicGlass = indexCss.includes('.cosmic-glass');
  const hasCosmicGlow = indexCss.includes('.cosmic-glow-');
  results.push({
    name: 'src/index.css removes legacy cosmic-glass and cosmic-glow classes',
    passed: !hasCosmicGlass && !hasCosmicGlow,
    message: hasCosmicGlass
      ? 'src/index.css still defines .cosmic-glass'
      : hasCosmicGlow
        ? 'src/index.css still defines .cosmic-glow-'
        : undefined,
  });

  // 8. src/index.css preserves prefers-reduced-motion and cursor rules
  const hasReducedMotion = indexCss.includes('@media (prefers-reduced-motion: reduce)');
  const hasDisabledCursor = indexCss.includes('button:disabled');
  results.push({
    name: 'src/index.css preserves reduced-motion and cursor rules',
    passed: hasReducedMotion && hasDisabledCursor,
    message: !hasReducedMotion
      ? 'src/index.css missing prefers-reduced-motion'
      : !hasDisabledCursor
        ? 'src/index.css missing button:disabled cursor rule'
        : undefined,
  });

  return results;
}

function parsePhaseArg(): Phase {
  const phaseArg = process.argv.find((arg) => arg.startsWith('--phase='));
  if (phaseArg) {
    const val = phaseArg.replace('--phase=', '').trim() as Phase;
    return val;
  }
  if (process.argv.includes('--all')) {
    return 'all';
  }
  return 'tokens';
}

function main() {
  const phase = parsePhaseArg();
  console.log(`Running Exoplanet Observatory verification for phase: [${phase}]`);

  const results: CheckResult[] = [];

  if (phase === 'tokens' || phase === 'all') {
    results.push(...checkTokensPhase());
  }

  let failures = 0;
  for (const r of results) {
    if (r.passed) {
      console.log(`  PASS: ${r.name}`);
    } else {
      console.error(`  FAIL: ${r.name}${r.message ? ` -> ${r.message}` : ''}`);
      failures++;
    }
  }

  if (failures > 0) {
    console.error(`\nVerification failed with ${failures} error(s).`);
    process.exit(1);
  } else {
    console.log(`\nAll checks passed (${results.length} checks).`);
    process.exit(0);
  }
}

main();
