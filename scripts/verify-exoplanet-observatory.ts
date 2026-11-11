import fs from 'node:fs';
import path from 'node:path';

type Phase = 'tokens' | 'loading-formatters' | 'shortcuts' | 'shortcuts-modal' | 'hud' | 'safety' | 'all';

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

async function checkLoadingFormattersPhase(): Promise<CheckResult[]> {
  const results: CheckResult[] = [];

  const loadingSpritePath = path.join(ROOT_DIR, 'src', 'components', 'LoadingSprite.tsx');
  const formattersPath = path.join(ROOT_DIR, 'src', 'utils', 'exoplanetFormatters.ts');
  const canvasPath = path.join(ROOT_DIR, 'src', 'components', 'ExoplanetCanvas3D.tsx');

  // 1. LoadingSprite checks
  if (!fs.existsSync(loadingSpritePath)) {
    results.push({ name: 'LoadingSprite.tsx exists', passed: false, message: 'LoadingSprite.tsx not found' });
  } else {
    const code = fs.readFileSync(loadingSpritePath, 'utf-8');
    const hasPing = code.includes('animate-ping');
    const hasGlow = /shadow-\[0_0_/i.test(code);
    const hasObservatoryPanel = code.includes('observatory-panel');
    results.push({
      name: 'LoadingSprite.tsx removes animate-ping and cyan glow shadows',
      passed: !hasPing && !hasGlow,
      message: hasPing
        ? 'LoadingSprite.tsx still contains animate-ping'
        : hasGlow
          ? 'LoadingSprite.tsx still contains glow shadow'
          : undefined,
    });
    results.push({
      name: 'LoadingSprite.tsx uses observatory-panel container',
      passed: hasObservatoryPanel,
      message: hasObservatoryPanel ? undefined : 'LoadingSprite.tsx missing observatory-panel',
    });
  }

  // 2. exoplanetFormatters.ts checks
  if (!fs.existsSync(formattersPath)) {
    results.push({
      name: 'src/utils/exoplanetFormatters.ts exists',
      passed: false,
      message: 'src/utils/exoplanetFormatters.ts does not exist',
    });
  } else {
    results.push({
      name: 'src/utils/exoplanetFormatters.ts exists',
      passed: true,
    });

    try {
      const mod = await import('../src/utils/exoplanetFormatters.ts');
      const hasInferColor = typeof mod.inferBodyColor === 'function';
      const hasFormatMass = typeof mod.formatCompactBodyMass === 'function';
      const hasGetTourMetric = typeof mod.getTourMetricDisplay === 'function';

      results.push({
        name: 'exoplanetFormatters exports required functions',
        passed: hasInferColor && hasFormatMass && hasGetTourMetric,
        message: !hasInferColor
          ? 'missing inferBodyColor'
          : !hasFormatMass
            ? 'missing formatCompactBodyMass'
            : !hasGetTourMetric
              ? 'missing getTourMetricDisplay'
              : undefined,
      });

      if (hasInferColor) {
        const earthColor = mod.inferBodyColor({ name: 'Earth', classification: 'Terran' } as any);
        results.push({
          name: 'inferBodyColor resolves Earth to #38bdf8',
          passed: earthColor === '#38bdf8',
          message: earthColor !== '#38bdf8' ? `Expected #38bdf8 but got ${earthColor}` : undefined,
        });
      }

      if (hasFormatMass) {
        const unknownMass = mod.formatCompactBodyMass({ massEarth: 0 } as any);
        results.push({
          name: 'formatCompactBodyMass returns Unknown Mass for 0 mass',
          passed: unknownMass === 'Unknown Mass',
          message: unknownMass !== 'Unknown Mass' ? `Expected "Unknown Mass" but got "${unknownMass}"` : undefined,
        });
      }

      if (hasGetTourMetric) {
        const metric = mod.getTourMetricDisplay(
          { diameterEarth: 1.0, diameterJupiter: 0.089, diameterKm: 12742, classification: 'Terran' } as any,
          'size'
        );
        results.push({
          name: 'getTourMetricDisplay formats size metric for Earth',
          passed: metric && metric.primary === '1.00 D⊕',
          message: metric?.primary !== '1.00 D⊕' ? `Expected "1.00 D⊕" but got "${metric?.primary}"` : undefined,
        });
      }
    } catch (err: any) {
      results.push({
        name: 'exoplanetFormatters imports and runs tests cleanly',
        passed: false,
        message: err.message,
      });
    }
  }

  // 3. ExoplanetCanvas3D imports formatters
  if (!fs.existsSync(canvasPath)) {
    results.push({ name: 'ExoplanetCanvas3D.tsx exists', passed: false, message: 'ExoplanetCanvas3D.tsx not found' });
  } else {
    const canvasCode = fs.readFileSync(canvasPath, 'utf-8');
    const importsFormatters = /from\s+['"][^'"]*exoplanetFormatters['"]/i.test(canvasCode);
    const hasInlineInfer = /function\s+inferBodyColor\s*\(/i.test(canvasCode);
    const hasInlineMass = /function\s+formatCompactBodyMass\s*\(/i.test(canvasCode);
    results.push({
      name: 'ExoplanetCanvas3D.tsx imports extracted formatters and eliminates inline duplicates',
      passed: importsFormatters && !hasInlineInfer && !hasInlineMass,
      message: !importsFormatters
        ? 'ExoplanetCanvas3D.tsx does not import from exoplanetFormatters'
        : hasInlineInfer
          ? 'ExoplanetCanvas3D.tsx still contains inline inferBodyColor'
          : hasInlineMass
            ? 'ExoplanetCanvas3D.tsx still contains inline formatCompactBodyMass'
            : undefined,
    });
  }

  return results;
}

function checkShortcutsModalPhase(): CheckResult[] {
  const results: CheckResult[] = [];

  const modalPath = path.join(ROOT_DIR, 'src', 'components', 'ExoplanetShortcutsModal.tsx');
  const canvasPath = path.join(ROOT_DIR, 'src', 'components', 'ExoplanetCanvas3D.tsx');

  // 1. ExoplanetShortcutsModal.tsx exists
  if (!fs.existsSync(modalPath)) {
    results.push({
      name: 'src/components/ExoplanetShortcutsModal.tsx exists',
      passed: false,
      message: 'ExoplanetShortcutsModal.tsx not found',
    });
    return results;
  }
  results.push({
    name: 'src/components/ExoplanetShortcutsModal.tsx exists',
    passed: true,
  });

  const modalCode = fs.readFileSync(modalPath, 'utf-8');

  // 2. Renders role="dialog" and aria-modal="true"
  const hasDialogRole = modalCode.includes('role="dialog"');
  const hasAriaModal = modalCode.includes('aria-modal="true"');
  results.push({
    name: 'ExoplanetShortcutsModal renders role="dialog" and aria-modal="true"',
    passed: hasDialogRole && hasAriaModal,
    message: !hasDialogRole ? 'missing role="dialog"' : !hasAriaModal ? 'missing aria-modal="true"' : undefined,
  });

  // 3. Uses observatory-panel and eliminates slop tokens
  const hasObservatoryPanel = modalCode.includes('observatory-panel');
  const hasSlopBg = modalCode.includes('bg-[#040816]');
  const hasCyanBorder = /border-cyan-500/i.test(modalCode);
  const hasGlowShadow = /shadow-\[0_0_/i.test(modalCode);
  results.push({
    name: 'ExoplanetShortcutsModal uses observatory-panel and removes cyan slop',
    passed: hasObservatoryPanel && !hasSlopBg && !hasCyanBorder && !hasGlowShadow,
    message: !hasObservatoryPanel
      ? 'missing observatory-panel'
      : hasSlopBg
        ? 'still contains bg-[#040816]'
        : hasCyanBorder
          ? 'still contains border-cyan-500'
          : hasGlowShadow
            ? 'still contains cyan glow shadow'
            : undefined,
  });

  // 4. Close button and dismiss button include min-h-11 (and close icon includes min-w-11)
  const hasMinH11 = /min-h-11/i.test(modalCode);
  const hasMinW11 = /min-w-11/i.test(modalCode);
  results.push({
    name: 'ExoplanetShortcutsModal buttons meet minimum 44px tap targets',
    passed: hasMinH11 && hasMinW11,
    message: !hasMinH11 ? 'missing min-h-11 on buttons' : !hasMinW11 ? 'missing min-w-11 on icon button' : undefined,
  });

  // 5. Zero em dashes
  const hasEmDash = modalCode.includes('\u2014');
  results.push({
    name: 'ExoplanetShortcutsModal has zero em dashes',
    passed: !hasEmDash,
    message: hasEmDash ? 'contains em dash (U+2014)' : undefined,
  });

  // 6. ExoplanetCanvas3D renders <ExoplanetShortcutsModal
  if (!fs.existsSync(canvasPath)) {
    results.push({
      name: 'ExoplanetCanvas3D renders ExoplanetShortcutsModal',
      passed: false,
      message: 'ExoplanetCanvas3D.tsx not found',
    });
  } else {
    const canvasCode = fs.readFileSync(canvasPath, 'utf-8');
    const importsModal = /import\s+.*ExoplanetShortcutsModal.*from/i.test(canvasCode);
    const rendersModal = /<ExoplanetShortcutsModal/i.test(canvasCode);
    const hasInlineShortcutsDialog = canvasCode.includes('aria-labelledby="stage-shortcuts-title"');
    results.push({
      name: 'ExoplanetCanvas3D renders ExoplanetShortcutsModal and removes inline modal JSX',
      passed: importsModal && rendersModal && !hasInlineShortcutsDialog,
      message: !importsModal
        ? 'ExoplanetCanvas3D does not import ExoplanetShortcutsModal'
        : !rendersModal
          ? 'ExoplanetCanvas3D does not render <ExoplanetShortcutsModal'
          : hasInlineShortcutsDialog
            ? 'ExoplanetCanvas3D still contains inline shortcuts dialog JSX'
            : undefined,
    });
  }

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

async function main() {
  const phase = parsePhaseArg();
  console.log(`Running Exoplanet Observatory verification for phase: [${phase}]`);

  const results: CheckResult[] = [];

  if (phase === 'tokens' || phase === 'all') {
    results.push(...checkTokensPhase());
  }

  if (phase === 'loading-formatters' || phase === 'all') {
    results.push(...(await checkLoadingFormattersPhase()));
  }

  if (phase === 'shortcuts' || phase === 'shortcuts-modal' || phase === 'all') {
    results.push(...checkShortcutsModalPhase());
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
