import { StarData, SpectralClass } from '../types';

export interface MappedClassificationInfo {
  star: StarData;
  harvardClass?: 'O' | 'B' | 'A' | 'F' | 'G' | 'K' | 'M';
  otherClass?: 'WR' | 'LBV' | 'BD' | 'C' | 'S';
  remnantClass?: 'WD' | 'RQNS' | 'PSR' | 'MSP' | 'SGR' | 'X-NS' | 'SBH' | 'SMBH';
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
 * Checks if a star is a subdwarf (VI)
 */
export function isSubdwarf(star: StarData): boolean {
  const stage = (star.stellarStage || '').toLowerCase();
  const spec = (star.spectralType || '').trim();
  const specClass = (star.spectralClass || '').trim();
  return (
    stage === 'subdwarf' ||
    stage.includes('subdwarf') ||
    /^(ESD|USD|SD)[-:\s]*[OBAFGKMLTYCS]/i.test(spec) ||
    /^(ESD|USD|SD)[-:\s]*[OBAFGKMLTYCS]/i.test(specClass) ||
    (/\bVI\b/.test(spec) && !/\bVII\b/.test(spec)) ||
    (spec.endsWith('VI') && !spec.endsWith('VII'))
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
  if (isSubdwarf(star)) {
    return { classNumeral: 'VI', title: 'Subdwarfs' };
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
    star.id === 'rr-lyrae' ||
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
    star.id === 't-coronae-borealis' ||
    star.id === 'u-geminorum' ||
    star.id === 'v838-monocerotis' ||
    star.id === 'algol' ||
    star.id === 'sheliak' ||
    star.id === 'hde-226868' ||
    combined.includes('recurrent nova') ||
    combined.includes('dwarf nova') ||
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
    star.id === 'cor-caroli' ||
    star.id === 'barnards-star' ||
    star.id === 'kapteyns-star' ||
    star.id === 'przybylski-star' ||
    star.id === 'alpha-circini' ||
    combined.includes('starspot') ||
    combined.includes('rotational modulation') ||
    combined.includes('by draconis') ||
    combined.includes('alpha-2 canum venaticorum') ||
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
    ['castor', 'castor-a', 'castor-aa', 'polaris', 'mizar', 'mizar-a', 'mizar-aa', 'alpha-centauri-a', 'alpha-centauri-b', 'proxima-centauri', 'alcyone', 'electra', 'maia', 'theta-1-orionis-c', 'theta1-orionis-c'].includes(star.id) ||
    combined.includes('triple') ||
    combined.includes('quadruple') ||
    combined.includes('sextuple') ||
    combined.includes('multiple star')
  ) {
    return 'Multiple Star System';
  }
  if (
    ['alcyone', 'electra', 'maia', 'r136a1', 'melnick-42', 'bat99-98', 'vfts-682', 'vfts-352', 'theta-1-orionis-c', 'theta1-orionis-c'].includes(star.id) ||
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
  
  let otherClass: 'WR' | 'LBV' | 'BD' | 'C' | 'S' | undefined;
  let remnantClass: 'WD' | 'RQNS' | 'PSR' | 'MSP' | 'SGR' | 'X-NS' | 'SBH' | 'SMBH' | undefined;

  // Determine Remnants
  const stage = (star.stellarStage || '').toLowerCase();
  const spec = (star.spectralType || '').toLowerCase();
  const desc = `${star.description || ''} ${(star.notableFacts || []).join(' ')} ${star.name}`.toLowerCase();

  if (
    star.spectralClass === 'WD' ||
    stage.includes('white dwarf') ||
    spec.includes('wd') ||
    spec.startsWith('d') ||
    ['sirius-b', 'procyon-b', 'van-maanens-star', '40-eridani-b', 'bpm-37093', 'stein-2051-b', 'lp-40-365'].includes(star.id)
  ) {
    remnantClass = 'WD';
  } else if (
    ['sgr-1935-2154', 'swift-j1818-1607', 'magnetar-1e-2259', 'magnetar-1e-1048'].includes(star.id) ||
    desc.includes('magnetar') ||
    desc.includes('sgr') ||
    desc.includes('soft gamma repeater')
  ) {
    remnantClass = 'SGR';
  } else if (
    ['black-widow-pulsar', 'redback-pulsar', 'lich-pulsar', 'double-pulsar-a', 'double-pulsar-b'].includes(star.id) ||
    desc.includes('millisecond') ||
    desc.includes('spider') ||
    desc.includes('black widow')
  ) {
    remnantClass = 'MSP';
  } else if (
    star.id === 'scorpius-x-1-ns' ||
    desc.includes('lmxb') ||
    desc.includes('accreting neutron')
  ) {
    remnantClass = 'X-NS';
  } else if (
    ['crab-pulsar', 'vela-pulsar', 'psr-b0950-08', 'psr-b0656-14', 'psr-b1055-52', 'hulse-taylor-pulsar'].includes(star.id) ||
    star.id.includes('pulsar')
  ) {
    remnantClass = 'PSR';
  } else if (
    star.spectralClass === 'NS' ||
    stage.includes('neutron star') ||
    ['rx-j1856-3754', 'calvera', 'rx-j0720-3125', 'rx-j0806-4123', 'rx-j1308-2127', 'rx-j1605-3249', 'rx-j0420-5022', 'vela-jr-cco', 'pks-1209-cco'].includes(star.id)
  ) {
    remnantClass = 'RQNS';
  }

  // Determine Other Spectral Classes (excluding remnants which are now in Stellar Remnants)
  if (!isHarvard && !remnantClass) {
    if (star.spectralClass === 'WR' || star.stellarStage === 'Wolf-Rayet') otherClass = 'WR';
    else if (star.spectralClass === 'LBV' || star.stellarStage === 'Luminous Blue Variable') otherClass = 'LBV';
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
    remnantClass,
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

/**
 * Returns all stars mapped to a Stellar Remnant class
 */
export function getMappedStarsForRemnant(remnantId: string, catalog: StarData[]): StarData[] {
  const id = remnantId.toLowerCase();
  return catalog.filter((s) => {
    const sc = s.spectralClass;
    const stage = (s.stellarStage || '').toLowerCase();
    const spec = (s.spectralType || '').toLowerCase();
    const desc = `${s.description || ''} ${(s.notableFacts || []).join(' ')} ${s.name}`.toLowerCase();

    // 1. White Dwarfs
    if (id.includes('white-dwarf')) {
      return (
        sc === 'WD' ||
        stage.includes('white dwarf') ||
        spec.includes('wd') ||
        spec.startsWith('d') ||
        ['sirius-b', 'procyon-b', 'van-maanens-star', '40-eridani-b', 'bpm-37093', 'stein-2051-b', 'lp-40-365'].includes(s.id)
      );
    }

    // 2. Radio-Quiet Neutron Stars
    if (id.includes('radio-quiet')) {
      return (
        ['rx-j1856-3754', 'calvera', 'rx-j0720-3125', 'rx-j0806-4123', 'rx-j1308-2127', 'rx-j1605-3249', 'rx-j0420-5022', 'vela-jr-cco', 'pks-1209-cco'].includes(s.id) ||
        desc.includes('magnificent seven') ||
        desc.includes('isolated neutron star') ||
        desc.includes('central compact object') ||
        (spec.includes('(ins)') && !s.id.includes('pulsar'))
      );
    }

    // 3. Radio Pulsars
    if (id.includes('radio-pulsar')) {
      return (
        ['crab-pulsar', 'vela-pulsar', 'psr-b0950-08', 'psr-b0656-14', 'psr-b1055-52', 'hulse-taylor-pulsar'].includes(s.id) ||
        (s.id.includes('pulsar') && !s.id.includes('widow') && !s.id.includes('redback') && !s.id.includes('double'))
      );
    }

    // 4. Millisecond Pulsars
    if (id.includes('millisecond')) {
      return (
        ['black-widow-pulsar', 'redback-pulsar', 'lich-pulsar', 'double-pulsar-a', 'double-pulsar-b'].includes(s.id) ||
        desc.includes('millisecond') ||
        desc.includes('spider') ||
        desc.includes('black widow')
      );
    }

    // 5. Magnetars
    if (id.includes('magnetar')) {
      return (
        ['sgr-1935-2154', 'swift-j1818-1607', 'magnetar-1e-2259', 'magnetar-1e-1048'].includes(s.id) ||
        desc.includes('magnetar') ||
        desc.includes('sgr') ||
        desc.includes('axp') ||
        desc.includes('soft gamma repeater')
      );
    }

    // 6. Accreting Neutron Stars
    if (id.includes('accreting')) {
      return (
        s.id === 'scorpius-x-1-ns' ||
        desc.includes('lmxb') ||
        desc.includes('accreting neutron') ||
        desc.includes('x-ray burst')
      );
    }

    // 7. Stellar-Mass Black Holes (Removed from catalog and dossiers for now)
    if (id.includes('stellar-black-hole')) {
      return false;
    }

    // 8. Supermassive Black Holes (Removed from catalog and dossiers for now)
    if (id.includes('supermassive')) {
      return false;
    }

    return false;
  });
}
