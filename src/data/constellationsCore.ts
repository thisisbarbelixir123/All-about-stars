export type ConstellationHemisphere = 'Northern' | 'Southern' | 'Equatorial';

export type ConstellationFamily =
  | 'Zodiac'
  | 'Ursa Major'
  | 'Perseus'
  | 'Hercules'
  | 'Orion'
  | 'Heavenly Waters'
  | 'Bayer'
  | 'La Caille';

export interface ConstellationShape {
  // Normalized coordinates (0 to 100) for drawing stick figures in an SVG viewBox="0 0 100 100"
  stars: Array<{
    x: number;
    y: number;
    name?: string;
    isPrincipal?: boolean;
    mag?: number;
    isAsterismCore?: boolean;
    catalogStarId?: string;
  }>;
  lines: Array<[number, number]>; // Indices in the stars array to connect with line segments
  mainAsterismName?: string;
  asterismLines?: Array<[number, number]>;
}

export interface ConstellationSectorInfo {
  name: string;
  shortCode: string;
  englishName: string;
  raRange: string;
  decRange: string;
  borderingConstellations: string[];
  boundaryPolygon: Array<{ x: number; y: number }>;
}

export interface ConstellationBorderInfo {
  raRange: string;
  decRange: string;
  borderingConstellations: string[];
  iauDelporteYear: number;
  boundarySummary: string;
  boundaryPolygon: Array<{ x: number; y: number }>;
  sectors?: ConstellationSectorInfo[];
}

export interface ConstellationInfo {
  id: string;
  name: string;
  latinName: string;
  genitive: string;
  abbreviation: string;
  englishName: string;
  resemblance: string;
  hemisphere: ConstellationHemisphere;
  family: ConstellationFamily;
  areaSqDeg: number;
  areaRank: number; // 1 to 88
  principalStarId: string;
  principalStarName: string;
  brightestMagnitude: number;
  bestViewingMonth: string;
  quadrant: string; // e.g. NQ1, SQ3
  isZodiac: boolean;
  zodiacSymbol?: string;
  zodiacDates?: string;
  borders: ConstellationBorderInfo;
  shape: ConstellationShape;
  description: string;
  mythology: string;
}

export type RawConstellationInfo = Omit<ConstellationInfo, 'resemblance' | 'borders'>;

export interface ZodiacSignInfo {
  index: number; // 1 to 13
  name: string;
  latinName: string;
  symbol: string;
  englishMeaning: string;
  astronomicalDates: string; // Actual dates Sun is in the constellation today
  traditionalDates: string;  // Astrological dates (tropical zodiac)
  sunDurationDays: number;
  principalStar: string;
  principalStarId: string;
  isThirteenth: boolean;
  scientificNotes: string;
}

export const WHAT_ARE_CONSTELLATIONS_INFO = {
  title: 'What Are Constellations?',
  subtitle: 'Celestial Locators: Why Constellations are Vital on Earth, but Illusions in Deep Space',
  mainConcept:
    'A constellation is an officially recognized sector of the celestial sphere. While ancient cultures imagined them as mythical figures, heroes, and animals drawn across the night sky, modern astronomy treats them as precise 88 bounded postal codes partitioning the entire sky dome.',
  keyPrinciples: [
    {
      title: 'Cosmic Perspective: Optical Alignments, Not Physical Families',
      badge: '3D Depth vs 2D Projection',
      content:
        'When we look up from Earth, stars in a constellation appear close together on a flat 2D celestial sphere. But in 3D interstellar space, these stars have no physical connection to one another whatsoever. One star might be 25 light-years away, while its neighboring "connection" in the stick figure is a supergiant 2,000 light-years deep into the galactic disk. If you traveled to another star system, the constellations as we know them would completely dissolve.'
    },
    {
      title: 'Celestial GPS: Indispensable Night-Sky Locators',
      badge: 'Essential Coordinate System',
      content:
        'Even though constellations are spatial optical projections, they remain indispensable navigational coordinates. Astronomers, navigators, and telescope pointing systems use constellation boundaries to locate exoplanets, meteor shower radiants (e.g., the Perseids emanate from Perseus), transient supernovae, and deep-sky nebulae. Stating that Betelgeuse is in Orion instantly tells any astronomer where to aim their telescope.'
    },
    {
      title: 'The Official 88 Boundaries (IAU Standardization)',
      badge: 'Standardized in 1922–1930',
      content:
        'In ancient times, different civilizations created overlapping and contradictory star figures. Ptolemy’s 2nd-century Almagest documented 48 classic northern constellations. Later Renaissance and Enlightenment explorers (such as Petrus Plancius, Johannes Hevelius, and Nicolas-Louis de Lacaille) mapped the rich southern skies. In 1922, the International Astronomical Union (IAU) officially recognized exactly 88 modern constellations, and in 1930, Belgian astronomer Eugène Delporte established precise geometric right-ascension and declination boundaries, covering every square arcsecond of the sky.'
    },
    {
      title: 'Asterisms vs. Constellations',
      badge: 'Important Distinction',
      content:
        'An asterism is an informal, recognizable pattern of stars that is NOT an official constellation. For example, the famous "Big Dipper" (or the Plough) is merely an asterism comprising the 7 brightest stars within the much larger constellation Ursa Major. The "Summer Triangle" is an asterism spanning three distinct constellations: Vega (Lyra), Deneb (Cygnus), and Altair (Aquila).'
    },
    {
      title: 'Resemblance vs. Exact Borders: The Dual Nature of a Constellation',
      badge: 'Silhouette & Sector',
      content:
        'Every constellation possesses two complementary identities: its visual Resemblance (the figurative shape or asterism, such as the Hunter, the Lion, or the Flying Horse) and its Exact Border (the official astronomical boundary lines published by Eugène Delporte in 1930). While human eyes seek the poetic silhouette, astronomical instruments rely on the exact coordinate boundaries along arcs of Right Ascension and Declination, ensuring that every single star, nebula, and galaxy belongs to exactly one of the 88 constellations without any overlap or unclaimed gaps.'
    }
  ]
};

export const ZODIAC_13_EXPLAINER = {
  title: 'The 13 Signs of the Zodiac (Yes, Thirteen!)',
  subtitle: 'The Ecliptic Highway, Axial Precession, and the Forgotten Serpent Bearer',
  introduction:
    'The Zodiac is the narrow band of the celestial sphere spanning roughly 8 degrees north and south of the ecliptic—the apparent annual path of the Sun across the background stars as viewed from Earth. Because the Moon and major planets orbit in nearly the same plane as Earth, they also wander through this same celestial highway.',
  ophiuchusSpotlight: {
    name: 'Ophiuchus (The Serpent Bearer)',
    symbol: '⛎',
    title: 'The 13th Astronomical Zodiac Constellation',
    summary:
      'The Sun spends approximately 18 days traveling through Ophiuchus (from roughly November 29 to December 17). That is more than double the time the Sun spends in Scorpius (which only lasts about 7 days)!',
    historyExplanation:
      'Why was Ophiuchus left out of the traditional 12-sign zodiac? Around 3,000 years ago, ancient Babylonian astronomers tracked the Sun moving through 13 constellations. However, the Babylonians used a 12-month calendar based on lunar cycles. To neatly harmonize the sky with their calendar, they divided the 360° circle of the sky into 12 equal 30° wedges and deliberately dropped Ophiuchus. While this made calendar mathematics clean, it parted ways with the physical reality of the sky.'
  },
  axialPrecessionNote:
    'Earth slowly wobbles on its rotational axis like a spinning top, completing one full cycle every 25,772 years (precession of the equinoxes). Because of this wobble, the dates when the Sun physically sits inside each constellation have shifted by almost an entire month since the Babylonians recorded them over 2,500 years ago!'
};

export const ZODIAC_13_SIGNS: ZodiacSignInfo[] = [
  {
    index: 1,
    name: 'Aries',
    latinName: 'Aries',
    symbol: '♈',
    englishMeaning: 'The Ram',
    astronomicalDates: 'Apr 18 – May 13',
    traditionalDates: 'Mar 21 – Apr 19',
    sunDurationDays: 25.5,
    principalStar: 'Hamal (Alpha Arietis)',
    principalStarId: 'hamal',
    isThirteenth: false,
    scientificNotes: 'Contains the ancient First Point of Aries, which has now drifted into Pisces due to axial precession.'
  },
  {
    index: 2,
    name: 'Taurus',
    latinName: 'Taurus',
    symbol: '♉',
    englishMeaning: 'The Bull',
    astronomicalDates: 'May 14 – Jun 21',
    traditionalDates: 'Apr 20 – May 20',
    sunDurationDays: 38.2,
    principalStar: 'Aldebaran (Alpha Tauri)',
    principalStarId: 'aldebaran',
    isThirteenth: false,
    scientificNotes: 'Hosts two famous star clusters: the Pleiades (Seven Sisters) and the V-shaped Hyades cluster.'
  },
  {
    index: 3,
    name: 'Gemini',
    latinName: 'Gemini',
    symbol: '♊',
    englishMeaning: 'The Twins',
    astronomicalDates: 'Jun 22 – Jul 20',
    traditionalDates: 'May 21 – Jun 20',
    sunDurationDays: 29.3,
    principalStar: 'Pollux (Beta Geminorum)',
    principalStarId: 'pollux',
    isThirteenth: false,
    scientificNotes: 'Marked by the twin stars Castor (a sextuple star system) and Pollux (an exoplanet-hosting giant).'
  },
  {
    index: 4,
    name: 'Cancer',
    latinName: 'Cancer',
    symbol: '♋',
    englishMeaning: 'The Crab',
    astronomicalDates: 'Jul 21 – Aug 10',
    traditionalDates: 'Jun 21 – Jul 22',
    sunDurationDays: 21.1,
    principalStar: 'Tarf (Beta Cancri)',
    principalStarId: 'tarf',
    isThirteenth: false,
    scientificNotes: 'The faintest zodiac constellation; contains the Beehive Cluster (Messier 44) visible to the naked eye.'
  },
  {
    index: 5,
    name: 'Leo',
    latinName: 'Leo',
    symbol: '♌',
    englishMeaning: 'The Lion',
    astronomicalDates: 'Aug 11 – Sep 16',
    traditionalDates: 'Jul 23 – Aug 22',
    sunDurationDays: 36.9,
    principalStar: 'Regulus (Alpha Leonis)',
    principalStarId: 'regulus',
    isThirteenth: false,
    scientificNotes: 'Shaped like a crouching lion with a backwards sickle; home to the luminous blue subgiant Regulus.'
  },
  {
    index: 6,
    name: 'Virgo',
    latinName: 'Virgo',
    symbol: '♍',
    englishMeaning: 'The Maiden',
    astronomicalDates: 'Sep 17 – Oct 30',
    traditionalDates: 'Aug 23 – Sep 22',
    sunDurationDays: 44.5,
    principalStar: 'Spica (Alpha Virginis)',
    principalStarId: 'spica',
    isThirteenth: false,
    scientificNotes: 'The largest zodiac constellation and 2nd largest overall. The Sun spends over 44 days crossing its span.'
  },
  {
    index: 7,
    name: 'Libra',
    latinName: 'Libra',
    symbol: '♎',
    englishMeaning: 'The Scales',
    astronomicalDates: 'Oct 31 – Nov 22',
    traditionalDates: 'Sep 23 – Oct 22',
    sunDurationDays: 23.0,
    principalStar: 'Zubeneschamali (Beta Librae)',
    principalStarId: 'zubeneschamali',
    isThirteenth: false,
    scientificNotes: 'The only zodiac constellation representing an inanimate object rather than an animal or mythological character.'
  },
  {
    index: 8,
    name: 'Scorpius',
    latinName: 'Scorpius',
    symbol: '♏',
    englishMeaning: 'The Scorpion',
    astronomicalDates: 'Nov 23 – Nov 28',
    traditionalDates: 'Oct 23 – Nov 21',
    sunDurationDays: 6.8,
    principalStar: 'Antares (Alpha Scorpii)',
    principalStarId: 'antares',
    isThirteenth: false,
    scientificNotes: 'The Sun cuts across only the northern neck of Scorpius for fewer than 7 days before entering Ophiuchus!'
  },
  {
    index: 9,
    name: 'Ophiuchus',
    latinName: 'Ophiuchus',
    symbol: '⛎',
    englishMeaning: 'The Serpent Bearer',
    astronomicalDates: 'Nov 29 – Dec 17',
    traditionalDates: 'Omitted from traditional astrology',
    sunDurationDays: 18.6,
    principalStar: 'Rasalhague (Alpha Ophiuchi)',
    principalStarId: 'rasalhague',
    isThirteenth: true,
    scientificNotes: 'The real 13th constellation of the ecliptic! The Sun spends nearly 19 days here—far longer than in Scorpius.'
  },
  {
    index: 10,
    name: 'Sagittarius',
    latinName: 'Sagittarius',
    symbol: '♐',
    englishMeaning: 'The Archer',
    astronomicalDates: 'Dec 18 – Jan 18',
    traditionalDates: 'Nov 22 – Dec 21',
    sunDurationDays: 31.9,
    principalStar: 'Kaus Australis (Epsilon Sagittarii)',
    principalStarId: 'kaus-australis',
    isThirteenth: false,
    scientificNotes: 'Directly frames Sagittarius A*, the supermassive black hole at the center of the Milky Way galaxy.'
  },
  {
    index: 11,
    name: 'Capricornus',
    latinName: 'Capricornus',
    symbol: '♑',
    englishMeaning: 'The Sea-Goat',
    astronomicalDates: 'Jan 19 – Feb 15',
    traditionalDates: 'Dec 22 – Jan 19',
    sunDurationDays: 27.8,
    principalStar: 'Deneb Algedi (Delta Capricorni)',
    principalStarId: 'deneb-algedi',
    isThirteenth: false,
    scientificNotes: 'One of the oldest documented constellations, tracing back to Middle Bronze Age Mesopotamian boundary stones.'
  },
  {
    index: 12,
    name: 'Aquarius',
    latinName: 'Aquarius',
    symbol: '♒',
    englishMeaning: 'The Water-Bearer',
    astronomicalDates: 'Feb 16 – Mar 11',
    traditionalDates: 'Jan 20 – Feb 18',
    sunDurationDays: 24.1,
    principalStar: 'Sadalsuud (Beta Aquarii)',
    principalStarId: 'sadalsuud',
    isThirteenth: false,
    scientificNotes: 'Located in the region of the sky called the Sea or Water, alongside Cetus, Pisces, and Eridanus.'
  },
  {
    index: 13,
    name: 'Pisces',
    latinName: 'Pisces',
    symbol: '♓',
    englishMeaning: 'The Fishes',
    astronomicalDates: 'Mar 12 – Apr 17',
    traditionalDates: 'Feb 19 – Mar 20',
    sunDurationDays: 37.7,
    principalStar: 'Alpherg (Eta Piscium)',
    principalStarId: 'alpherg',
    isThirteenth: false,
    scientificNotes: 'Currently hosts the vernal equinox point (where the celestial equator intersects the ecliptic in March).'
  }
];

export const MYTHBUSTER_INFO = {
  title: 'Mythbuster: Do Constellations Define Your Personality?',
  subtitle: 'The Real Science of Interstellar Physics vs. Cultural Astrology',
  verdict: 'Myth Busted: Absolutely Not (Astrophysically Speaking)',
  friendlyNote: '…but it is totally harmless fun to enjoy! (The creator is a Pisces, btw 🐟✨)',
  sections: [
    {
      title: '1. The Gravity and Physics of Distant Stars',
      content:
        'Stars are colossal fusion reactors millions of trillions of kilometers away. The gravitational and electromagnetic force exerted on a newborn infant by a star in Taurus or Scorpius is trillions of times weaker than the gravitational pull of the obstetrician delivering the baby, the hospital bed, or the room ceiling light. There is zero physical mechanism through which a star could imprint behavioral traits on human DNA.'
    },
    {
      title: '2. The Stars Have Shifted by a Full Month',
      content:
        'Due to the 25,800-year precession of Earth’s rotational axis, the celestial backdrop has shifted approximately 30 degrees (a full zodiac sign) since the astrological rules were codified. If you were born on July 25, traditional horoscopes call you a "Leo", but the Sun was physically inside the stars of Cancer! If stars dictated personality, everyone would have been getting the "wrong" sign for the last 2,000 years.'
    },
    {
      title: '3. Constellations are Human Optical Inventions',
      content:
        'The stars in a constellation are not a group. They are scattered randomly at drastically different distances across three-dimensional space and are moving in different orbits around the galactic core. The shapes we recognize are arbitrary optical projections drawn by ancient cultures, just like seeing shapes in clouds.'
    },
    {
      title: '4. The Psychology: The Forer / Barnum Effect',
      content:
        'Why do astrological personality descriptions often feel so surprisingly accurate? Psychologists call this the Forer (or Barnum) Effect. When statements are phrased in vague, universally relatable, and flattering terms ("You have a need for other people to like and admire you, but can be self-critical at times"), the human brain naturally projects its own memories onto them and finds confirmation.'
    },
    {
      title: '5. The Verdict & The Creator’s Confession',
      content:
        'Does that mean horoscopes are bad? Not at all! As long as people understand the distinction between real empirical astrophysics and playful cultural folklore, enjoying astrology as an icebreaker, artistic inspiration, or fun conversation starter is completely fine and harmless. And as a fun note: the creator of this stellar comparator is a proud Pisces ♓ — who nonetheless loves the cold, rigorous beauty of actual astrophysics!'
    }
  ]
};
