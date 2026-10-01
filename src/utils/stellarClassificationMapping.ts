import { StarData, SpectralClass } from '../types';

export interface MappedClassificationInfo {
  star: StarData;
  harvardClass?: 'O' | 'B' | 'A' | 'F' | 'G' | 'K' | 'M';
  otherClass?: 'WR' | 'LBV' | 'WD' | 'NS' | 'BD' | 'C' | 'S';
  yerkesClass: 'Ia+' | 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | 'VII';
  yerkesTitle: string;
  variableTypes: string[];
  systemType: string;
  population: 'Population I' | 'Population II' | 'Population III';
}

/**
 * Checks if a star is an ultra-luminous hypergiant (Ia+ / 0)
 */
export function isHypergiant(star: StarData): boolean {
  const stage = (star.stellarStage || '').toLowerCase();
  const spec = star.spectralType || '';
  return (
    stage.includes('hypergiant') ||
    spec.includes('Ia+') ||
    spec.includes('Ia-0') ||
    spec.includes('0') ||
    spec.includes('Ia-O') ||
    ['stephenson-2-18', 'uy-scuti', 'vy-canis-majoris', 'nml-cygni', 'westerlund-1-26', 'v354-cephei', 'ah-scorpii', 'kw-sagittarii', 'v382-carinae', 'v509-cassiopeiae', 'rho-cassiopeiae', 'eta-carinae-a', 'pistol-star', 's-doradus'].includes(star.id)
  );
}

/**
 * Checks if a star is a supergiant (Ia, Ib, Iab)
 */
export function isSupergiant(star: StarData): boolean {
  if (isHypergiant(star)) return false;
  const stage = (star.stellarStage || '').toLowerCase();
  const spec = star.spectralType || '';
  return stage.includes('supergiant') || /I[ab]/.test(spec) || spec.includes('Ib') || spec.includes('Ia');
}

/**
 * Checks if a star is a bright giant (II)
 */
export function isBrightGiant(star: StarData): boolean {
  if (isHypergiant(star) || isSupergiant(star)) return false;
  const stage = star.stellarStage || '';
  const spec = star.spectralType || '';
  return stage === 'Bright Giant' || spec.includes('II') && !spec.includes('VII');
}

/**
 * Checks if a star is a normal giant (III)
 */
export function isNormalGiant(star: StarData): boolean {
  if (isHypergiant(star) || isSupergiant(star) || isBrightGiant(star)) return false;
  const stage = star.stellarStage || '';
  const spec = star.spectralType || '';
  return (stage.includes('Giant') && !stage.includes('Sub')) || spec.includes('III');
}

/**
 * Checks if a star is a subgiant (IV)
 */
export function isSubgiant(star: StarData): boolean {
  const stage = star.stellarStage || '';
  const spec = star.spectralType || '';
  return stage === 'Subgiant' || spec.includes('IV');
}

/**
 * Checks if a star is a main sequence dwarf (V)
 */
export function isMainSequence(star: StarData): boolean {
  const stage = star.stellarStage || '';
  const spec = star.spectralType || '';
  return (
    stage === 'Main Sequence' ||
    stage === 'Main Sequence Dwarf' ||
    stage === 'Red Dwarf' ||
    spec.includes('V') && !spec.includes('IV') && !spec.includes('VI') && !spec.includes('VII')
  );
}

/**
 * Checks if a star is a compact degenerate relic or white dwarf (VII)
 */
export function isDegenerateRemnant(star: StarData): boolean {
  const stage = star.stellarStage || '';
  const sc = star.spectralClass;
  const spec = star.spectralType || '';
  return (
    sc === 'WD' ||
    sc === 'NS' ||
    stage === 'White Dwarf' ||
    stage === 'Neutron Star / Pulsar' ||
    stage === 'Stellar Black Hole' ||
    spec.includes('VII') ||
    spec.startsWith('D')
  );
}

/**
 * Maps any star to its Yerkes Luminosity Class
 */
export function getStarYerkesClass(star: StarData): { classNumeral: 'Ia+' | 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | 'VII'; title: string } {
  if (isDegenerateRemnant(star)) {
    return { classNumeral: 'VII', title: 'White Dwarfs & Relics' };
  }
  if (isHypergiant(star)) {
    return { classNumeral: 'Ia+', title: 'Luminous Hypergiants' };
  }
  if (isSupergiant(star)) {
    return { classNumeral: 'I', title: 'Supergiants' };
  }
  if (isBrightGiant(star)) {
    return { classNumeral: 'II', title: 'Bright Giants' };
  }
  if (isNormalGiant(star)) {
    return { classNumeral: 'III', title: 'Normal Giants' };
  }
  if (isSubgiant(star)) {
    return { classNumeral: 'IV', title: 'Subgiants' };
  }
  if (isMainSequence(star)) {
    return { classNumeral: 'V', title: 'Main Sequence Dwarfs' };
  }
  if (star.metallicityFeH !== undefined && star.metallicityFeH < -1.0) {
    return { classNumeral: 'VI', title: 'Subdwarfs' };
  }
  return { classNumeral: 'V', title: 'Main Sequence Dwarfs' };
}

/**
 * Determines variable star categories for a given star
 */
export function getStarVariableCategories(star: StarData): string[] {
  const vars: string[] = [];
  const desc = (star.description || '').toLowerCase();
  const facts = (star.notableFacts || []).map((f) => f.toLowerCase()).join(' ');
  const combined = `${desc} ${facts} ${star.name.toLowerCase()}`;

  // Cepheids
  if (
    star.id === 'polaris' ||
    star.id === 'delta-cephei' ||
    star.id === 'beta-doradus' ||
    star.id === 'mekbuda' ||
    combined.includes('cepheid')
  ) {
    vars.push('Cepheid Variable');
  }

  // RR Lyrae / ancient horizontal branch
  if (
    star.id === 'delta-scuti' ||
    star.id === 'gamma-doradus' ||
    combined.includes('rr lyrae') ||
    combined.includes('delta scuti') ||
    combined.includes('gamma doradus') ||
    combined.includes('horizontal branch')
  ) {
    vars.push('RR Lyrae / Short-Period Pulsator');
  }

  // Mira variables (Long period AGB pulsators)
  if (
    star.id === 'mira' ||
    star.id === 'mira-a' ||
    star.id === 'chi-cygni' ||
    star.id === 'r-andromedae' ||
    star.id === 'r-cassiopeiae' ||
    star.id === 'r-trianguli' ||
    star.id === 't-cephei' ||
    star.id === 's-persei' ||
    combined.includes('mira variable') ||
    combined.includes('long-period variable') ||
    combined.includes('mira-type')
  ) {
    vars.push('Mira Long-Period Variable');
  }

  // Semiregular & Irregular
  if (
    star.id === 'betelgeuse' ||
    star.id === 'antares' ||
    star.id === 'mu-cephei' ||
    star.id === 'uy-scuti' ||
    star.id === 'vy-canis-majoris' ||
    star.id === 'ah-scorpii' ||
    star.id === 'kw-sagittarii' ||
    star.id === 'v354-cephei' ||
    star.id === 'scheat' ||
    star.id === 'gorgonea-tertia' ||
    combined.includes('semiregular') ||
    combined.includes('irregular variable')
  ) {
    vars.push('Semiregular / Irregular Variable');
  }

  // Cataclysmic & Eclipsing Binaries
  if (
    star.id === 'algol' ||
    star.id === 'sheliak' ||
    star.id === 'hde-226868' ||
    combined.includes('eclipsing binary') ||
    combined.includes('cataclysmic') ||
    combined.includes('accretion disk') ||
    combined.includes('nova')
  ) {
    vars.push('Cataclysmic / Eclipsing Binary');
  }

  // Eruptive & Flare Variables
  if (
    star.id === 'proxima-centauri' ||
    star.id === 'eta-carinae-a' ||
    star.id === 'pistol-star' ||
    star.id === 'p-cygni' ||
    star.id === 's-doradus' ||
    star.id === 'cygnus-ob2-12' ||
    star.id === 'v4998-sagittarii' ||
    star.id === 'lbv-1806-20' ||
    combined.includes('flare') ||
    combined.includes('eruptive') ||
    combined.includes('luminous blue variable')
  ) {
    vars.push('Eruptive / Flare Variable');
  }

  // Rotational Variables (spots, magnetic patches)
  if (
    star.id === 'barnards-star' ||
    star.id === 'kapteyns-star' ||
    star.id === 'przybylski-star' ||
    star.id === 'alpha-circini' ||
    combined.includes('starspot') ||
    combined.includes('rotational modulation') ||
    combined.includes('by draconis') ||
    combined.includes('roap')
  ) {
    vars.push('Rotational / Magnetic Variable');
  }

  return vars;
}

/**
 * Determines Star System architecture classification
 */
export function getStarSystemType(star: StarData): string {
  const combined = `${star.description || ''} ${(star.notableFacts || []).join(' ')} ${star.name}`.toLowerCase();
  
  if (star.id === 'vfts-352' || combined.includes('contact binary') || combined.includes('kissing binary')) {
    return 'Contact Binary';
  }
  if (star.id === 'hde-226868' || combined.includes('x-ray binary') || combined.includes('microquasar')) {
    return 'X-Ray Binary';
  }
  if (
    ['castor', 'castor-a', 'polaris', 'mizar', 'alpha-centauri-a', 'alpha-centauri-b', 'proxima-centauri', 'alcyone', 'electra', 'maia', 'theta1-orionis-c'].includes(star.id) ||
    combined.includes('triple') ||
    combined.includes('quadruple') ||
    combined.includes('sextuple') ||
    combined.includes('multiple star')
  ) {
    return 'Multiple Star System';
  }
  if (
    ['alcyone', 'electra', 'maia', 'r136a1', 'melnick-42', 'bat99-98', 'vfts-682', 'vfts-352', 'theta1-orionis-c'].includes(star.id) ||
    combined.includes('pleiades') ||
    combined.includes('star cluster') ||
    combined.includes('open cluster') ||
    combined.includes('globular cluster')
  ) {
    return 'Star Cluster Member';
  }
  if (
    ['sirius-a', 'sirius-b', 'procyon-a', 'procyon-b', 'alpha-centauri-a', 'alpha-centauri-b', 'algol', 'spica', 'regulus', 'capella'].includes(star.id) ||
    combined.includes('binary') ||
    combined.includes('companion')
  ) {
    return 'Binary Star System';
  }
  if (star.exoplanetSystem && star.exoplanetSystem.hasExoplanets) {
    return 'Exoplanetary Host System';
  }
  return 'Single Star System';
}

/**
 * Determines Stellar Population
 */
export function getStarPopulation(star: StarData): 'Population I' | 'Population II' | 'Population III' {
  if (
    ['methuselah-star', 'kapteyns-star', 'arcturus', 'barnards-star'].includes(star.id) ||
    (star.metallicityFeH !== undefined && star.metallicityFeH < -0.5) ||
    (star.estimatedAgeMyr && star.estimatedAgeMyr >= 9500)
  ) {
    return 'Population II';
  }
  return 'Population I';
}

/**
 * Full classification info for any given star
 */
export function getComprehensiveStarMapping(star: StarData): MappedClassificationInfo {
  const isHarvard = ['O', 'B', 'A', 'F', 'G', 'K', 'M'].includes(star.spectralClass);
  const harvardClass = isHarvard ? (star.spectralClass as any) : undefined;
  
  let otherClass: 'WR' | 'LBV' | 'WD' | 'NS' | 'BD' | 'C' | 'S' | undefined;
  if (!isHarvard) {
    if (star.spectralClass === 'WR' || star.stellarStage === 'Wolf-Rayet') otherClass = 'WR';
    else if (star.spectralClass === 'LBV' || star.stellarStage === 'Luminous Blue Variable') otherClass = 'LBV';
    else if (star.spectralClass === 'WD' || star.stellarStage === 'White Dwarf') otherClass = 'WD';
    else if (star.spectralClass === 'NS' || star.stellarStage === 'Neutron Star / Pulsar') otherClass = 'NS';
    else if (['L', 'T', 'Y'].includes(star.spectralClass) || star.stellarStage === 'Brown Dwarf') otherClass = 'BD';
    else if (star.spectralClass === 'C' || star.stellarStage === 'Carbon Star') otherClass = 'C';
    else if (star.spectralClass === 'S' || star.stellarStage === 'S-Type Star') otherClass = 'S';
  }

  const yerkes = getStarYerkesClass(star);
  const vars = getStarVariableCategories(star);
  const systemType = getStarSystemType(star);
  const population = getStarPopulation(star);

  return {
    star,
    harvardClass,
    otherClass,
    yerkesClass: yerkes.classNumeral,
    yerkesTitle: yerkes.title,
    variableTypes: vars,
    systemType,
    population,
  };
}

/**
 * Returns all stars in the catalog mapped to a specific Harvard spectral class (O, B, A, F, G, K, M)
 */
export function getMappedStarsForHarvard(code: string, catalog: StarData[]): StarData[] {
  return catalog.filter((s) => s.spectralClass === code);
}

/**
 * Returns all stars in the catalog mapped to an exotic / other spectral class
 */
export function getMappedStarsForExotic(codeOrAbbr: string, catalog: StarData[]): StarData[] {
  const norm = codeOrAbbr.toUpperCase();
  return catalog.filter((s) => {
    if (norm.includes('WR')) return s.spectralClass === 'WR' || s.stellarStage === 'Wolf-Rayet';
    if (norm.includes('LBV')) return s.spectralClass === 'LBV' || s.stellarStage === 'Luminous Blue Variable';
    if (norm.includes('WD') || norm.includes('VII')) return s.spectralClass === 'WD' || s.stellarStage === 'White Dwarf';
    if (norm.includes('NS') || norm.includes('PULSAR')) return s.spectralClass === 'NS' || s.stellarStage === 'Neutron Star / Pulsar';
    if (
      !norm.includes('LBV') &&
      (norm.includes('BD') ||
        norm.includes('BROWN') ||
        norm === 'L' ||
        norm === 'T' ||
        norm === 'Y' ||
        /\b[LTY]\b/.test(norm) ||
        norm.includes('L / T / Y'))
    ) {
      return (
        s.spectralClass !== 'LBV' &&
        (['L', 'T', 'Y'].includes(s.spectralClass) || s.stellarStage === 'Brown Dwarf')
      );
    }
    if (norm === 'C' || norm.includes('CARBON')) return s.spectralClass === 'C' || s.stellarStage === 'Carbon Star';
    if (norm === 'S' || norm.includes('ZIRCONIUM') || norm.includes('S-TYPE')) return s.spectralClass === 'S' || s.stellarStage === 'S-Type Star';
    return false;
  });
}

/**
 * Returns all stars in the catalog mapped to a Yerkes Luminosity Class
 */
export function getMappedStarsForYerkes(romanNumeral: string, catalog: StarData[]): StarData[] {
  const norm = romanNumeral.trim();
  return catalog.filter((s) => {
    const yk = getStarYerkesClass(s);
    if (norm === 'Ia+' || norm === '0') return yk.classNumeral === 'Ia+';
    if (norm === 'Ia' || norm === 'Ib' || norm === 'Iab' || norm === 'I') return yk.classNumeral === 'I';
    if (norm === 'II') return yk.classNumeral === 'II';
    if (norm === 'III') return yk.classNumeral === 'III';
    if (norm === 'IV') return yk.classNumeral === 'IV';
    if (norm === 'V') return yk.classNumeral === 'V';
    if (norm === 'VI' || norm === 'sd') return yk.classNumeral === 'VI';
    if (norm === 'VII' || norm.includes('WD') || norm.includes('D')) return yk.classNumeral === 'VII';
    return false;
  });
}

/**
 * Returns all stars in the catalog mapped to a variable star class
 */
export function getMappedStarsForVariable(varId: string, catalog: StarData[]): StarData[] {
  const id = varId.toLowerCase();
  return catalog.filter((s) => {
    const vars = getStarVariableCategories(s);
    if (id.includes('cepheid')) return vars.includes('Cepheid Variable');
    if (id.includes('rr-lyrae')) return vars.includes('RR Lyrae / Short-Period Pulsator');
    if (id.includes('mira')) return vars.includes('Mira Long-Period Variable');
    if (id.includes('semiregular') || id.includes('irregular')) return vars.includes('Semiregular / Irregular Variable');
    if (id.includes('cataclysmic')) return vars.includes('Cataclysmic / Eclipsing Binary');
    if (id.includes('eruptive') || id.includes('flare')) return vars.includes('Eruptive / Flare Variable');
    if (id.includes('rotational')) return vars.includes('Rotational / Magnetic Variable');
    return vars.length > 0;
  });
}

/**
 * Returns all stars mapped to a Star System architecture
 */
export function getMappedStarsForStarSystem(systemId: string, catalog: StarData[]): StarData[] {
  const id = systemId.toLowerCase();
  return catalog.filter((s) => {
    const sys = getStarSystemType(s);
    if (id.includes('single')) return sys === 'Single Star System';
    if (id.includes('binary-star-systems')) return sys === 'Binary Star System';
    if (id.includes('contact')) return sys === 'Contact Binary';
    if (id.includes('xray') || id.includes('x-ray')) return sys === 'X-Ray Binary';
    if (id.includes('multiple')) return sys === 'Multiple Star System';
    if (id.includes('cluster')) return sys === 'Star Cluster Member';
    if (id.includes('planet') || id.includes('exoplanet')) return s.exoplanetSystem && s.exoplanetSystem.hasExoplanets;
    return true;
  });
}

/**
 * Returns all stars mapped to a Stellar Population
 */
export function getMappedStarsForPopulation(popId: string, catalog: StarData[]): StarData[] {
  const id = popId.toLowerCase();
  if (id.includes('iii')) {
    // Population III is hypothetical primordial stars; return earliest relics / primordial benchmarks
    return catalog.filter((s) => s.id === 'methuselah-star');
  }
  if (id.includes('ii')) {
    return catalog.filter((s) => getStarPopulation(s) === 'Population II');
  }
  return catalog.filter((s) => getStarPopulation(s) === 'Population I');
}
