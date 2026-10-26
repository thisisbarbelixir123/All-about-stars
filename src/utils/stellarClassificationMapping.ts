import { StarData } from '../types';

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
 * Checks if a star is an ultra-luminous hypergiant (Ia+ / 0).
 * Dynamically evaluated based on stellar stage, spectral type luminosity notation, and extreme physical scale.
 */
export function isHypergiant(star: StarData): boolean {
  const stage = (star.stellarStage || '').toLowerCase();
  const spec = (star.spectralType || '').trim();

  if (stage.includes('hypergiant')) return true;
  if (/\b(Ia\+|Ia-0|Ia-O|Ia\/0|0)\b/i.test(spec) || spec.includes('Ia+') || spec.includes('Ia-0')) return true;

  // Physical criteria: extreme radius & extreme radiant power
  if (star.diameterSolar >= 800 && star.luminositySolar >= 80000) return true;
  if (star.luminositySolar >= 350000 && star.massSolar >= 25 && !isDegenerateRemnant(star)) return true;

  return false;
}

/**
 * Checks if a star is a supergiant (Ia, Ib, Iab).
 * Dynamically evaluated without hardcoded ID lists.
 */
export function isSupergiant(star: StarData): boolean {
  if (isHypergiant(star)) return false;
  if (isDegenerateRemnant(star)) return false;

  const stage = (star.stellarStage || '').toLowerCase();
  const spec = (star.spectralType || '').trim();

  if (stage.includes('supergiant')) return true;
  if (/\b(Ia|Ib|Iab)\b/.test(spec) || (/^[^I]*\bI\b/.test(spec) && !/\b(II|III|IV|VI|VII)\b/.test(spec))) return true;

  // Physical supergiant criteria
  if (star.luminositySolar >= 10000 && star.diameterSolar >= 40 && star.massSolar >= 8) return true;

  return false;
}

/**
 * Checks if a star is a bright giant (II).
 */
export function isBrightGiant(star: StarData): boolean {
  if (isHypergiant(star) || isSupergiant(star) || isDegenerateRemnant(star)) return false;

  const stage = (star.stellarStage || '').toLowerCase();
  const spec = (star.spectralType || '').trim();

  if (stage.includes('bright giant')) return true;
  if (/\bII\b/.test(spec) && !/\b(VII|III)\b/.test(spec)) return true;

  return false;
}

/**
 * Checks if a star is a subdwarf (VI).
 */
export function isSubdwarf(star: StarData): boolean {
  const stage = (star.stellarStage || '').toLowerCase();
  const spec = (star.spectralType || '').trim();
  const sc = (star.spectralClass || '').trim();

  return (
    stage.includes('subdwarf') ||
    /^(ESD|USD|SD)[-:\s]*[OBAFGKMLTYCS]/i.test(spec) ||
    /^(ESD|USD|SD)[-:\s]*[OBAFGKMLTYCS]/i.test(sc) ||
    (/\bVI\b/.test(spec) && !/\bVII\b/.test(spec)) ||
    (spec.endsWith('VI') && !spec.endsWith('VII'))
  );
}

/**
 * Checks if a star is a normal giant (III).
 */
export function isNormalGiant(star: StarData): boolean {
  if (isHypergiant(star) || isSupergiant(star) || isBrightGiant(star) || isSubdwarf(star) || isDegenerateRemnant(star)) return false;

  const stage = (star.stellarStage || '').toLowerCase();
  const spec = (star.spectralType || '').trim();

  if (stage.includes('giant') && !stage.includes('subgiant')) return true;
  if (/\bIII\b/.test(spec) && !/\b(VIII|VII)\b/.test(spec)) return true;

  // Physical criteria for evolved giants
  if (star.diameterSolar >= 10 && star.diameterSolar < 200 && star.luminositySolar >= 25 && star.luminositySolar < 10000) return true;

  return false;
}

/**
 * Checks if a star is a subgiant (IV).
 */
export function isSubgiant(star: StarData): boolean {
  if (isHypergiant(star) || isSupergiant(star) || isBrightGiant(star) || isNormalGiant(star) || isDegenerateRemnant(star)) return false;

  const stage = (star.stellarStage || '').toLowerCase();
  const spec = (star.spectralType || '').trim();

  return stage.includes('subgiant') || /\bIV\b/.test(spec);
}

/**
 * Checks if a star is a compact degenerate relic or white dwarf (VII).
 */
export function isDegenerateRemnant(star: StarData): boolean {
  const stage = (star.stellarStage || '').toLowerCase();
  const sc = star.spectralClass;
  const spec = (star.spectralType || '').trim();
  const desc = `${star.description || ''} ${(star.notableFacts || []).join(' ')} ${star.name}`.toLowerCase();

  return (
    sc === 'WD' ||
    sc === 'NS' ||
    stage.includes('white dwarf') ||
    stage.includes('neutron star') ||
    stage.includes('pulsar') ||
    stage.includes('black hole') ||
    /\bVII\b/.test(spec) ||
    spec.startsWith('D') ||
    spec.includes('WD') ||
    desc.includes('pulsar') ||
    desc.includes('magnetar')
  );
}

/**
 * Checks if a star is a main sequence dwarf (V).
 */
export function isMainSequence(star: StarData): boolean {
  if (isDegenerateRemnant(star) || isHypergiant(star) || isSupergiant(star) || isBrightGiant(star) || isNormalGiant(star) || isSubgiant(star) || isSubdwarf(star)) {
    return false;
  }

  const stage = (star.stellarStage || '').toLowerCase();
  const spec = (star.spectralType || '').trim();

  return (
    stage.includes('main sequence') ||
    stage.includes('red dwarf') ||
    stage.includes('blue straggler') ||
    (/\bV\b/.test(spec) && !/\b(IV|VI|VII)\b/.test(spec)) ||
    true // If no other luminosity class matched, normal stars are hydrogen-burning dwarfs
  );
}

/**
 * Maps any star to its Yerkes Luminosity Class dynamically.
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
  return { classNumeral: 'V', title: 'Main Sequence Dwarfs' };
}

/**
 * Determines variable star categories dynamically from astrophysical descriptions,
 * notable facts, stage, and spectroscopic classification.
 */
export function getStarVariableCategories(star: StarData): string[] {
  const vars: string[] = [];
  const desc = (star.description || '').toLowerCase();
  const facts = (star.notableFacts || []).map((f) => f.toLowerCase()).join(' ');
  const stage = (star.stellarStage || '').toLowerCase();
  const spec = (star.spectralType || '').toLowerCase();
  const combined = `${desc} ${facts} ${star.name.toLowerCase()} ${stage} ${spec}`;

  // 1. Cepheid Variables
  if (
    combined.includes('cepheid') ||
    combined.includes('period-luminosity') ||
    combined.includes('leavitt') ||
    combined.includes('classical cepheid') ||
    combined.includes('delta cephei-type')
  ) {
    vars.push('Cepheid Variable');
  }

  // 2. RR Lyrae & Short-Period Pulsators
  if (
    combined.includes('rr lyrae') ||
    combined.includes('rr-lyrae') ||
    combined.includes('delta scuti') ||
    combined.includes('gamma doradus') ||
    combined.includes('horizontal branch pulsator')
  ) {
    vars.push('RR Lyrae / Short-Period Pulsator');
  }

  // 3. Mira Long-Period Variables (AGB pulsators)
  if (
    combined.includes('mira variable') ||
    combined.includes('mira-type') ||
    combined.includes('mira pulsator') ||
    combined.includes('long-period variable') ||
    combined.includes('long period variable') ||
    (combined.includes('mira') && stage.includes('giant'))
  ) {
    vars.push('Mira Long-Period Variable');
  }

  // 4. Semiregular & Irregular Variables
  if (
    combined.includes('semiregular') ||
    combined.includes('semi-regular') ||
    combined.includes('irregular variable') ||
    combined.includes('slow irregular') ||
    combined.includes('pulsates irregularly') ||
    combined.includes('great dimming')
  ) {
    vars.push('Semiregular / Irregular Variable');
  }

  // 5. Cataclysmic & Nova Variables
  if (
    combined.includes('cataclysmic') ||
    combined.includes('nova') ||
    combined.includes('supernova') ||
    combined.includes('dwarf nova') ||
    combined.includes('recurrent nova') ||
    combined.includes('accretion disk') ||
    combined.includes('symbiotic star')
  ) {
    vars.push('Cataclysmic / Eclipsing Binary');
  }

  // 6. Eruptive & Flare Variables
  if (
    combined.includes('flare') ||
    combined.includes('eruptive') ||
    combined.includes('luminous blue variable') ||
    star.spectralClass === 'LBV' ||
    combined.includes('t tauri') ||
    combined.includes('fu orionis') ||
    combined.includes('r coronae borealis') ||
    stage.includes('luminous blue variable')
  ) {
    vars.push('Eruptive / Flare Variable');
  }

  // 7. Rotational & Magnetic Variables
  if (
    combined.includes('starspot') ||
    combined.includes('rotational modulation') ||
    combined.includes('rotational variable') ||
    combined.includes('by draconis') ||
    combined.includes('alpha-2 canum venaticorum') ||
    combined.includes('roap') ||
    combined.includes('magnetic patch')
  ) {
    vars.push('Rotational / Magnetic Variable');
  }

  // 8. Eclipsing Binaries
  if (
    star.isContactBinary ||
    combined.includes('eclipsing binary') ||
    combined.includes('eclipsing variable') ||
    combined.includes('algol-type') ||
    combined.includes('beta lyrae-type') ||
    combined.includes('w ursae majoris')
  ) {
    if (!vars.includes('Cataclysmic / Eclipsing Binary')) {
      vars.push('Cataclysmic / Eclipsing Binary');
    }
  }

  return vars;
}

/**
 * Determines Star System architecture classification dynamically.
 */
export function getStarSystemType(star: StarData): string {
  const desc = (star.description || '').toLowerCase();
  const facts = (star.notableFacts || []).map((f) => f.toLowerCase()).join(' ');
  const combined = `${desc} ${facts} ${star.name.toLowerCase()} ${(star.stellarStage || '').toLowerCase()}`;

  if (star.isContactBinary || combined.includes('contact binary') || combined.includes('kissing binary') || combined.includes('overcontact')) {
    return 'Contact Binary';
  }
  if (combined.includes('x-ray binary') || combined.includes('microquasar') || combined.includes('lmxb') || combined.includes('hmxb')) {
    return 'X-Ray Binary';
  }
  if (
    combined.includes('triple') ||
    combined.includes('quadruple') ||
    combined.includes('quintuple') ||
    combined.includes('sextuple') ||
    combined.includes('septuple') ||
    combined.includes('multiple star') ||
    combined.includes('nonuple') ||
    combined.includes('hierarchical')
  ) {
    return 'Multiple Star System';
  }
  if (
    combined.includes('star cluster') ||
    combined.includes('open cluster') ||
    combined.includes('globular cluster') ||
    combined.includes('pleiades') ||
    combined.includes('trapezium') ||
    combined.includes('hyades') ||
    combined.includes('stellar association')
  ) {
    return 'Star Cluster Member';
  }
  if (
    combined.includes('binary') ||
    combined.includes('companion') ||
    /\b(A|B|C|Aa|Ab|Ba|Bb)\b/.test(star.name) ||
    star.name.includes('+')
  ) {
    return 'Binary Star System';
  }
  if (star.exoplanetSystem && star.exoplanetSystem.hasExoplanets) {
    return 'Exoplanetary Host System';
  }
  return 'Single Star System';
}

/**
 * Determines Stellar Population dynamically based on metallicity, estimated age, and kinematics.
 */
export function getStarPopulation(star: StarData): 'Population I' | 'Population II' | 'Population III' {
  const combined = `${star.description || ''} ${(star.notableFacts || []).join(' ')}`.toLowerCase();

  // Population III (Primordial zero-metal stars or theoretical first-generation relics)
  if (
    (star.metallicityFeH !== undefined && star.metallicityFeH <= -2.5) ||
    combined.includes('population iii') ||
    combined.includes('primordial star') ||
    combined.includes('first-generation star')
  ) {
    return 'Population III';
  }

  // Population II (Ancient metal-poor halo or thick disk stars)
  if (
    (star.metallicityFeH !== undefined && star.metallicityFeH < -0.4) ||
    (star.estimatedAgeMyr !== undefined && star.estimatedAgeMyr >= 9000) ||
    combined.includes('population ii') ||
    combined.includes('metal-poor') ||
    combined.includes('ancient halo') ||
    combined.includes('globular cluster')
  ) {
    return 'Population II';
  }

  // Population I (Younger, metal-rich disc stars like the Sun)
  return 'Population I';
}

/**
 * Full classification info for any given star, computed dynamically.
 */
export function getComprehensiveStarMapping(star: StarData): MappedClassificationInfo {
  const isHarvard = ['O', 'B', 'A', 'F', 'G', 'K', 'M'].includes(star.spectralClass);
  const harvardClass = isHarvard ? (star.spectralClass as any) : undefined;

  let otherClass: 'WR' | 'LBV' | 'BD' | 'C' | 'S' | undefined;
  let remnantClass: 'WD' | 'RQNS' | 'PSR' | 'MSP' | 'SGR' | 'X-NS' | 'SBH' | 'SMBH' | undefined;

  const stage = (star.stellarStage || '').toLowerCase();
  const spec = (star.spectralType || '').toLowerCase();
  const desc = `${star.description || ''} ${(star.notableFacts || []).join(' ')} ${star.name}`.toLowerCase();

  // 1. Determine Remnant Class dynamically
  if (
    star.spectralClass === 'WD' ||
    stage.includes('white dwarf') ||
    spec.includes('wd') ||
    spec.startsWith('d') ||
    desc.includes('white dwarf')
  ) {
    remnantClass = 'WD';
  } else if (
    desc.includes('magnetar') ||
    desc.includes('soft gamma repeater') ||
    desc.includes('sgr') ||
    desc.includes('anomalous x-ray pulsar') ||
    desc.includes('axp')
  ) {
    remnantClass = 'SGR';
  } else if (
    desc.includes('millisecond') ||
    desc.includes('spider') ||
    desc.includes('black widow') ||
    desc.includes('redback')
  ) {
    remnantClass = 'MSP';
  } else if (
    desc.includes('accreting') ||
    desc.includes('lmxb') ||
    desc.includes('hmxb') ||
    desc.includes('x-ray burst')
  ) {
    remnantClass = 'X-NS';
  } else if (
    desc.includes('pulsar') ||
    star.name.toLowerCase().includes('pulsar') ||
    star.id.includes('pulsar')
  ) {
    remnantClass = 'PSR';
  } else if (
    star.spectralClass === 'NS' ||
    stage.includes('neutron star') ||
    desc.includes('neutron star')
  ) {
    remnantClass = 'RQNS';
  }

  // 2. Determine Other Spectral Classes
  if (!isHarvard && !remnantClass) {
    if (star.spectralClass === 'WR' || stage.includes('wolf-rayet') || spec.includes('wr') || spec.startsWith('w')) {
      otherClass = 'WR';
    } else if (star.spectralClass === 'LBV' || stage.includes('luminous blue variable') || spec.includes('lbv')) {
      otherClass = 'LBV';
    } else if (['L', 'T', 'Y'].includes(star.spectralClass) || stage.includes('brown dwarf') || /^[lty]/.test(spec)) {
      otherClass = 'BD';
    } else if (star.spectralClass === 'C' || stage.includes('carbon star') || spec.startsWith('c')) {
      otherClass = 'C';
    } else if (star.spectralClass === 'S' || stage.includes('s-type') || spec.startsWith('s')) {
      otherClass = 'S';
    }
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
 * Returns all stars in the catalog mapped to a specific Harvard spectral class (O, B, A, F, G, K, M).
 */
export function getMappedStarsForHarvard(code: string, catalog: StarData[]): StarData[] {
  const norm = code.toUpperCase().trim();
  return catalog.filter((s) => s.spectralClass === norm || s.spectralType.toUpperCase().startsWith(norm));
}

/**
 * Returns all stars in the catalog mapped to an exotic / other spectral class dynamically.
 */
export function getMappedStarsForExotic(codeOrAbbr: string, catalog: StarData[]): StarData[] {
  const norm = codeOrAbbr.toUpperCase();
  return catalog.filter((s) => {
    // 1. Wolf-Rayet
    if (norm.includes('WR') || norm.includes('WOLF')) {
      return (
        s.spectralClass === 'WR' ||
        s.stellarStage === 'Wolf-Rayet' ||
        s.spectralType.includes('WR') ||
        s.spectralType.startsWith('W')
      );
    }

    // 2. Luminous Blue Variables
    if (norm.includes('LBV') || norm.includes('S DOR')) {
      return (
        s.spectralClass === 'LBV' ||
        s.stellarStage === 'Luminous Blue Variable' ||
        s.spectralType.includes('LBV')
      );
    }

    // 3. Brown Dwarfs (L, T, Y)
    if (norm.includes('L / T / Y') || norm.includes('BROWN') || /\b[LTY]\b/.test(norm)) {
      return (
        s.spectralClass !== 'LBV' &&
        (['L', 'T', 'Y'].includes(s.spectralClass) || s.stellarStage === 'Brown Dwarf' || /^[LTY]/.test(s.spectralType))
      );
    }

    // 4. Carbon Stars
    if (norm.startsWith('C') || norm.includes('CARBON')) {
      return (
        s.spectralClass === 'C' ||
        s.stellarStage === 'Carbon Star' ||
        s.spectralType.startsWith('C') ||
        /C-[RNJHD]/i.test(s.spectralType)
      );
    }

    // 5. S-Type Stars (Zirconium / Technetium)
    if (norm.startsWith('S') || norm.includes('ZIRCONIUM') || norm.includes('S-TYPE')) {
      return (
        s.spectralClass === 'S' ||
        s.stellarStage === 'S-Type Star' ||
        s.spectralType.startsWith('S') ||
        /S\d/i.test(s.spectralType)
      );
    }

    return false;
  });
}

/**
 * Returns all stars in the catalog mapped to a Yerkes Luminosity Class dynamically.
 */
export function getMappedStarsForYerkes(romanNumeral: string, catalog: StarData[]): StarData[] {
  const norm = romanNumeral.trim();
  return catalog.filter((s) => {
    const yk = getStarYerkesClass(s);
    if (norm === 'Ia+' || norm === '0') return yk.classNumeral === 'Ia+';
    if (norm.includes('Ia') || norm.includes('Ib') || norm === 'I') return yk.classNumeral === 'I';
    if (norm === 'II') return yk.classNumeral === 'II';
    if (norm === 'III') return yk.classNumeral === 'III';
    if (norm === 'IV') return yk.classNumeral === 'IV';
    if (norm === 'V') return yk.classNumeral === 'V';
    if (norm === 'VI' || norm.toLowerCase().includes('subdwarf')) return yk.classNumeral === 'VI';
    if (norm.includes('VII') || norm.includes('WD') || norm.includes('D')) return yk.classNumeral === 'VII';
    return false;
  });
}

/**
 * Returns all stars in the catalog mapped to a variable star class dynamically.
 */
export function getMappedStarsForVariable(varId: string, catalog: StarData[]): StarData[] {
  const id = varId.toLowerCase();
  return catalog.filter((s) => {
    const vars = getStarVariableCategories(s);
    const combined = `${s.description || ''} ${(s.notableFacts || []).join(' ')} ${s.name} ${s.stellarStage || ''}`.toLowerCase();

    // 1. All Pulsating Variables
    if (id === 'pulsating-variables') {
      return (
        vars.includes('Cepheid Variable') ||
        vars.includes('RR Lyrae / Short-Period Pulsator') ||
        vars.includes('Mira Long-Period Variable') ||
        vars.includes('Semiregular / Irregular Variable') ||
        combined.includes('pulsat')
      );
    }

    // 2. Cepheids
    if (id.includes('cepheid')) {
      return vars.includes('Cepheid Variable') || combined.includes('cepheid');
    }

    // 3. RR Lyrae
    if (id.includes('rr-lyrae')) {
      return vars.includes('RR Lyrae / Short-Period Pulsator') || combined.includes('rr lyrae') || combined.includes('delta scuti');
    }

    // 4. Mira
    if (id.includes('mira')) {
      return vars.includes('Mira Long-Period Variable') || combined.includes('mira');
    }

    // 5. Semiregular & Irregular
    if (id.includes('semiregular') || id.includes('irregular')) {
      return vars.includes('Semiregular / Irregular Variable') || combined.includes('semiregular') || combined.includes('irregular');
    }

    // 6. Cataclysmic Variables
    if (id.includes('cataclysmic')) {
      return (
        vars.includes('Cataclysmic / Eclipsing Binary') ||
        combined.includes('cataclysmic') ||
        combined.includes('nova')
      );
    }

    // 7. Eruptive & Flare Variables
    if (id.includes('eruptive') || id.includes('flare')) {
      return vars.includes('Eruptive / Flare Variable') || combined.includes('flare') || combined.includes('eruptive');
    }

    // 8. Rotational Variables
    if (id.includes('rotational')) {
      return vars.includes('Rotational / Magnetic Variable') || combined.includes('rotational') || combined.includes('starspot');
    }

    // 9. Eclipsing Binaries
    if (id.includes('eclipsing')) {
      return s.isContactBinary || combined.includes('eclipsing') || combined.includes('algol');
    }

    return vars.length > 0;
  });
}

/**
 * Returns all stars mapped to a Star System architecture dynamically.
 */
export function getMappedStarsForStarSystem(systemId: string, catalog: StarData[]): StarData[] {
  const id = systemId.toLowerCase();
  return catalog.filter((s) => {
    const sys = getStarSystemType(s);
    const combined = `${s.description || ''} ${(s.notableFacts || []).join(' ')} ${s.name} ${s.stellarStage || ''}`.toLowerCase();

    // 1. Binary Stars (General & Distinct Binary Pairs)
    if (id === 'binary-stars' || id.includes('binary-star')) {
      return (
        sys === 'Binary Star System' ||
        sys === 'Contact Binary' ||
        sys === 'X-Ray Binary' ||
        combined.includes('binary') ||
        /\b(A|B|Aa|Ab|Ba|Bb)\b/.test(s.name) ||
        s.name.includes('+')
      );
    }

    // 2. Eclipsing Binaries
    if (id.includes('eclipsing')) {
      return s.isContactBinary || combined.includes('eclipsing') || combined.includes('algol');
    }

    // 3. Contact Binaries
    if (id.includes('contact')) {
      return s.isContactBinary || sys === 'Contact Binary' || combined.includes('contact binary') || combined.includes('overcontact');
    }

    // 4. X-Ray Binaries
    if (id.includes('xray') || id.includes('x-ray')) {
      return sys === 'X-Ray Binary' || combined.includes('x-ray binary') || combined.includes('microquasar') || combined.includes('lmxb') || combined.includes('hmxb');
    }

    // 5. Multiple Star Systems (Triple, Quadruple, etc.)
    if (id.includes('multiple')) {
      return sys === 'Multiple Star System' || combined.includes('triple') || combined.includes('quadruple') || combined.includes('sextuple') || combined.includes('multiple star');
    }

    // 6. Star Clusters
    if (id.includes('cluster')) {
      return sys === 'Star Cluster Member' || combined.includes('cluster') || combined.includes('pleiades') || combined.includes('trapezium');
    }

    // 7. Exoplanetary Host Stars
    if (id.includes('planet') || id.includes('exoplanet')) {
      return s.exoplanetSystem && s.exoplanetSystem.hasExoplanets;
    }

    return true;
  });
}

/**
 * Returns all stars mapped to a Stellar Population dynamically.
 */
export function getMappedStarsForPopulation(popId: string, catalog: StarData[]): StarData[] {
  const id = popId.toLowerCase();

  if (id.includes('iii')) {
    // Population III (Primordial zero-metal stars or theoretical first-generation benchmarks)
    return catalog.filter((s) => {
      const combined = `${s.description || ''} ${(s.notableFacts || []).join(' ')}`.toLowerCase();
      return (
        (s.metallicityFeH !== undefined && s.metallicityFeH <= -2.5) ||
        combined.includes('population iii') ||
        combined.includes('primordial star') ||
        combined.includes('first-generation star') ||
        combined.includes('methuselah')
      );
    });
  }

  if (id.includes('ii')) {
    return catalog.filter((s) => getStarPopulation(s) === 'Population II');
  }

  return catalog.filter((s) => getStarPopulation(s) === 'Population I');
}

/**
 * Returns all stars mapped to a Stellar Remnant class dynamically.
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
        desc.includes('white dwarf')
      );
    }

    // 2. Radio-Quiet Neutron Stars
    if (id.includes('radio-quiet')) {
      return (
        (sc === 'NS' || stage.includes('neutron star')) &&
        (desc.includes('radio-quiet') ||
          desc.includes('isolated neutron star') ||
          desc.includes('magnificent seven') ||
          desc.includes('central compact object') ||
          desc.includes('cco') ||
          desc.includes('calvera') ||
          (spec.includes('(ins)') && !s.id.includes('pulsar')))
      );
    }

    // 3. Radio Pulsars
    if (id.includes('radio-pulsar')) {
      return (
        (sc === 'NS' || stage.includes('neutron star') || stage.includes('pulsar')) &&
        desc.includes('pulsar') &&
        !desc.includes('millisecond') &&
        !desc.includes('spider') &&
        !desc.includes('black widow') &&
        !desc.includes('redback')
      );
    }

    // 4. Millisecond & Spider Pulsars
    if (id.includes('millisecond')) {
      return (
        (sc === 'NS' || stage.includes('neutron star') || stage.includes('pulsar')) &&
        (desc.includes('millisecond') ||
          desc.includes('spider') ||
          desc.includes('black widow') ||
          desc.includes('redback') ||
          desc.includes('double pulsar'))
      );
    }

    // 5. Magnetars
    if (id.includes('magnetar')) {
      return (
        (sc === 'NS' || stage.includes('neutron star')) &&
        (desc.includes('magnetar') ||
          desc.includes('soft gamma repeater') ||
          desc.includes('sgr') ||
          desc.includes('anomalous x-ray pulsar') ||
          desc.includes('axp'))
      );
    }

    // 6. Accreting Neutron Stars & X-Ray Binaries
    if (id.includes('accreting')) {
      return (
        (sc === 'NS' || stage.includes('neutron star')) &&
        (desc.includes('accreting') ||
          desc.includes('lmxb') ||
          desc.includes('hmxb') ||
          desc.includes('x-ray burst') ||
          desc.includes('x-ray pulsar') ||
          desc.includes('low-mass x-ray binary'))
      );
    }

    // 7. Stellar-Mass Black Holes
    if (id.includes('stellar-black-hole')) {
      return (
        stage.includes('black hole') ||
        desc.includes('stellar-mass black hole') ||
        desc.includes('microquasar') ||
        desc.includes('black hole candidate') ||
        desc.includes('cygnus x-1')
      );
    }

    // 8. Supermassive Black Holes
    if (id.includes('supermassive')) {
      return (
        stage.includes('supermassive') ||
        desc.includes('supermassive black hole') ||
        desc.includes('sagittarius a*') ||
        desc.includes('galactic center')
      );
    }

    return false;
  });
}

/**
 * Returns all candidate / progenitor stars mapped to a Hypothetical Star class dynamically.
 */
export function getMappedStarsForHypothetical(hypoId: string, catalog: StarData[]): StarData[] {
  const id = hypoId.toLowerCase();

  // 1. Blue Dwarfs (Progenitor low-mass red dwarfs that will evolve into Blue Dwarfs)
  if (id.includes('blue-dwarf')) {
    return catalog.filter((s) => s.spectralClass === 'M' && s.stellarStage.includes('Red Dwarf') && s.massSolar <= 0.25);
  }

  // 2. Black Dwarfs (Progenitor white dwarfs in the catalog that will eventually cool into Black Dwarfs)
  if (id.includes('black-dwarf')) {
    return catalog.filter((s) => s.spectralClass === 'WD' || s.stellarStage.includes('White Dwarf') || s.spectralType.startsWith('D'));
  }

  // 3. Exotic Stars (Ultra-dense quark/strange candidate analogs: compact neutron stars & magnetars)
  if (id.includes('exotic-star')) {
    return catalog.filter((s) => s.spectralClass === 'NS' || s.stellarStage.includes('Neutron Star') || s.stellarStage.includes('Pulsar'));
  }

  // 4. Dark Stars (Primordial hypermassive diffuse giants & extreme radius titans)
  if (id.includes('dark-star')) {
    return catalog.filter((s) => isHypergiant(s) || s.diameterSolar >= 700);
  }

  // 5. Quasi-Stars (Core black hole accretion progenitors & hypermassive stars)
  if (id.includes('quasi-star')) {
    return catalog.filter((s) => {
      const text = `${s.description || ''} ${(s.notableFacts || []).join(' ')}`.toLowerCase();
      return s.massSolar >= 50 || text.includes('microquasar') || text.includes('black hole') || text.includes('accretion disk');
    });
  }

  // 6. Gravastars (Non-singular compact horizon alternatives: extreme magnetic neutron stars)
  if (id.includes('gravastar')) {
    return catalog.filter((s) => {
      const text = `${s.description || ''} ${(s.notableFacts || []).join(' ')}`.toLowerCase();
      return (s.spectralClass === 'NS' || s.stellarStage.includes('Neutron Star')) && (text.includes('magnetar') || text.includes('pulsar'));
    });
  }

  // 7. Iron Stars (Cold degenerate relic progenitors: ancient carbon-oxygen white dwarfs)
  if (id.includes('iron-star')) {
    return catalog.filter((s) => s.spectralClass === 'WD' || s.stellarStage.includes('White Dwarf'));
  }

  return [];
}
