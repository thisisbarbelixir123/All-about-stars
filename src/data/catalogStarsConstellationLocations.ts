export interface ExtraFigureStar {
  x: number;
  y: number;
  catalogStarId: string;
  name: string;
  mag: number;
  locationDescription?: string;
}

export const STAR_CONSTELLATION_LOCATIONS: Record<string, string> = {
  "alpheratz": "Northeast Corner • Core Navigational Asterism",
  "mirach": "Beta And • Core Navigational Asterism",
  "almach": "Gamma And • Core Navigational Asterism",
  "alpha-antliae": "Pump Valve • Principal Anchor Star of Antlia",
  "epsilon-antliae": "Cylinder Wall • Core Navigational Asterism",
  "iota-antliae": "Vacuum Base Reservoir • Core Navigational Asterism",
  "alpha-apodis": "Head & Eye • Principal Anchor Star of Apus",
  "gamma-apodis": "Breast • Core Navigational Asterism",
  "beta-apodis": "Body / Flank • Core Navigational Asterism",
  "sadalmelik": "Shoulder • Core Navigational Asterism",
  "sadalsuud": "Left Shoulder • Principal Anchor Star of Aquarius",
  "skat": "Right Leg",
  "tarazed": "Head • Core Navigational Asterism",
  "altair": "Heart • Principal Anchor Star of Aquila",
  "alshain": "Throat • Core Navigational Asterism",
  "alpha-arae": "Altar Flame • Core Navigational Asterism",
  "beta-arae": "Left Cornice • Principal Anchor Star of Ara",
  "zeta-arae": "Right Pillar • Core Navigational Asterism",
  "mesarthim": "Horn Tip • Core Navigational Asterism",
  "sheratan": "Horn Base • Core Navigational Asterism",
  "hamal": "Crown • Principal Anchor Star of Aries",
  "capella-aa": "Heart Star • Principal Anchor Star of Auriga",
  "menkalinan": "Left Shoulder • Core Navigational Asterism",
  "almaaz": "Kid 1 • Core Navigational Asterism",
  "izar": "Belt • Core Navigational Asterism",
  "arcturus": "Heart/Knees • Principal Anchor Star of Boötes",
  "muphrid": "Left Foot • Core Navigational Asterism",
  "alpha-caeli": "Beveled Cutting Edge • Principal Anchor Star of Caelum",
  "alpha-camelopardalis": "Neck Apex • Core Navigational Asterism",
  "beta-camelopardalis": "Withers / Shoulders • Principal Anchor Star of Camelopardalis",
  "asellus-australis": "Carapace • Core Navigational Asterism",
  "acubens": "South Claw • Core Navigational Asterism",
  "tarf": "South Walking Leg • Principal Anchor Star of Cancer",
  "cor-caroli": "Asterion Heart • Principal Anchor Star of Canes Venatici",
  "chara": "Hound Chara • Core Navigational Asterism",
  "sirius-a": "Blazing Chest • Principal Anchor Star of Canis Major",
  "mirzam": "Front Paw • Core Navigational Asterism",
  "wezen": "Spine / Rump • Core Navigational Asterism",
  "adhara": "Thigh • Core Navigational Asterism",
  "procyon-a": "Body • Principal Anchor Star of Canis Minor",
  "gomeisa": "Neck • Core Navigational Asterism",
  "deneb-algedi": "Upper Fluke • Principal Anchor Star of Capricornus",
  "canopus": "Masthead Beacon • Principal Anchor Star of Carina",
  "avior": "Gunwale • Core Navigational Asterism",
  "schedar": "Lap / Jewel • Principal Anchor Star of Cassiopeia",
  "alpha-centauri-a": "Front Hoof Pointer • Principal Anchor Star of Centaurus",
  "alderamin": "Right Shoulder • Principal Anchor Star of Cepheus",
  "mu-cephei": "Heart Jewel",
  "menkar": "Upper Jaw • Core Navigational Asterism",
  "mira-a": "Pulsing Heart Variable",
  "baten-kaitos": "Belly / Flank • Core Navigational Asterism",
  "diphda": "Upper Tail Fluke • Principal Anchor Star of Cetus",
  "alpha-chamaeleontis": "Snout • Principal Anchor Star of Chamaeleon",
  "gamma-chamaeleontis": "Back Spine • Core Navigational Asterism",
  "beta-chamaeleontis": "Curled Tail • Core Navigational Asterism",
  "alpha-circini": "Hinge Pivot • Principal Anchor Star of Circinus",
  "beta-circini": "Left Pointer Needle • Core Navigational Asterism",
  "phact": "Breast • Principal Anchor Star of Columba",
  "wazn": "Body • Core Navigational Asterism",
  "diadem": "Golden Diadem • Core Navigational Asterism",
  "beta-comae-berenices": "Northern Tress • Principal Anchor Star of Coma Berenices",
  "meridiana": "Crown Jewel • Principal Anchor Star of Corona Australis",
  "alphecca": "Gemma Pearl • Principal Anchor Star of Corona Borealis",
  "nusakan": "West Pearl 1 • Core Navigational Asterism",
  "algorab": "North Wing • Core Navigational Asterism",
  "gienah-corvi": "Wingtip • Principal Anchor Star of Corvus",
  "kraz": "Tail / Foot • Core Navigational Asterism",
  "labrum": "West Lip of Cup • Principal Anchor Star of Crater",
  "alkes": "Pedestal Foot West",
  "acrux-a": "Southern Foot • Principal Anchor Star of Crux",
  "gacrux": "Northern Top • Core Navigational Asterism",
  "mimosa": "Eastern Arm • Core Navigational Asterism",
  "imai": "Western Arm • Core Navigational Asterism",
  "deneb": "Tail • Principal Anchor Star of Cygnus",
  "sadr": "Swan Heart • Core Navigational Asterism",
  "albireo": "Golden-Blue Beak • Core Navigational Asterism",
  "fawaris": "North Wing Joint • Core Navigational Asterism",
  "rotanev": "Diamond Head • Principal Anchor Star of Delphinus",
  "sualocin": "Diamond Head • Core Navigational Asterism",
  "gamma-doradus": "Sword Bill",
  "alpha-doradus": "Fish Eye & Head • Principal Anchor Star of Dorado",
  "beta-doradus": "Dorsal Fin • Core Navigational Asterism",
  "eltanin": "Head • Principal Anchor Star of Draco",
  "rastaban": "Head • Core Navigational Asterism",
  "thuban": "Ancient Pole Star • Core Navigational Asterism",
  "kitalpha": "Muzzle • Principal Anchor Star of Equuleus",
  "delta-equulei": "Ears • Core Navigational Asterism",
  "cursa": "River Source near Rigel • Core Navigational Asterism",
  "acamar": "Ancient River Mouth • Core Navigational Asterism",
  "achernar": "Brilliant River Terminus • Principal Anchor Star of Eridanus",
  "dalim": "Still Head • Principal Anchor Star of Fornax",
  "beta-fornacis": "Receiver Vessel • Core Navigational Asterism",
  "castor-a": "Mortal Twin Head • Core Navigational Asterism",
  "pollux": "Immortal Twin Head • Principal Anchor Star of Gemini",
  "castor-b": "Castor Shoulder",
  "wasat": "Pollux Waist • Core Navigational Asterism",
  "alhena": "Pollux Foot • Core Navigational Asterism",
  "aldhanab": "Crane Beak • Core Navigational Asterism",
  "alnair": "Heart / Left Wing • Principal Anchor Star of Grus",
  "tiaki": "Body / Flank • Core Navigational Asterism",
  "rasalgethi": "Hero Head • Core Navigational Asterism",
  "kornephoros": "Right Shoulder • Principal Anchor Star of Hercules",
  "sarin": "Keystone SE • Core Navigational Asterism",
  "rutilicus": "Keystone SW • Core Navigational Asterism",
  "alpha-horologii": "Clock Dial Summit • Principal Anchor Star of Horologium",
  "beta-horologii": "Dial West • Core Navigational Asterism",
  "alphard": "The Solitary Heart • Principal Anchor Star of Hydra",
  "lida": "Coil below Crater • Core Navigational Asterism",
  "alpha-hydri": "Head near Achernar • Core Navigational Asterism",
  "beta-hydri": "Tail at South Celestial Pole • Principal Anchor Star of Hydrus",
  "alpha-indi": "Feathered Headdress • Principal Anchor Star of Indus",
  "beta-indi": "East Shoulder • Core Navigational Asterism",
  "beta-lacertae": "Snout & Head",
  "alpha-lacertae": "Shoulders • Principal Anchor Star of Lacerta",
  "regulus": "Heart • Principal Anchor Star of Leo",
  "algieba": "Mane Crest • Core Navigational Asterism",
  "zosma": "Back / Rump • Core Navigational Asterism",
  "denebola": "Lion Tail Tuft • Core Navigational Asterism",
  "praecipua": "Cub Head • Principal Anchor Star of Leo Minor",
  "beta-leonis-minoris": "Back / Spine • Core Navigational Asterism",
  "arneb": "Hare Heart • Principal Anchor Star of Lepus",
  "nihal": "Belly • Core Navigational Asterism",
  "zubeneschamali": "Northern Scale Pan • Principal Anchor Star of Libra",
  "zubenelgenubi": "Southern Scale Pan • Core Navigational Asterism",
  "brachium": "Pan Weight South • Core Navigational Asterism",
  "men-alpha-lupi": "Wolf Eye • Principal Anchor Star of Lupus",
  "ke-kouan": "Snout & Fangs • Core Navigational Asterism",
  "alpha-lyncis": "Lynx Eye • Principal Anchor Star of Lynx",
  "alsciaukat": "Forequarters • Core Navigational Asterism",
  "vega": "Brilliant Jewel • Principal Anchor Star of Lyra",
  "sheliak": "Resonating Box Corner • Core Navigational Asterism",
  "sulafat": "Sounding Box Base • Core Navigational Asterism",
  "alpha-mensae": "Summit Plateau Peak • Principal Anchor Star of Mensa",
  "gamma-mensae": "Eastern Cliff Rim • Core Navigational Asterism",
  "alpha-microscopii": "Eyepiece Tube • Core Navigational Asterism",
  "gamma-microscopii": "Coarse Adjustment Dial • Principal Anchor Star of Microscopium",
  "beta-monocerotis": "Triple Star Spiraling Horn • Principal Anchor Star of Monoceros",
  "alpha-monocerotis": "Heart / Withers • Core Navigational Asterism",
  "alpha-muscae": "Head / Compound Eyes • Principal Anchor Star of Musca",
  "beta-muscae": "Thorax Joint • Core Navigational Asterism",
  "gamma-2-normae": "Angle Rule Arm • Principal Anchor Star of Norma",
  "nu-octantis": "Index Pivot Mirror • Core Navigational Asterism",
  "polaris-australis": "True South Celestial Pole • Principal Anchor Star of Octans",
  "rasalhague": "Head of Healer • Principal Anchor Star of Ophiuchus",
  "sabik": "Right Knee / Foot • Core Navigational Asterism",
  "han": "Left Knee / Foot • Core Navigational Asterism",
  "betelgeuse": "Red Supergiant Shoulder • Core Navigational Asterism",
  "bellatrix": "Left Shoulder • Core Navigational Asterism",
  "meissa": "Head of the Hunter",
  "alnitak": "Belt East • Core Navigational Asterism",
  "alnilam": "Belt Center • Core Navigational Asterism",
  "mintaka": "Belt West • Core Navigational Asterism",
  "saiph": "Right Knee • Core Navigational Asterism",
  "rigel": "Brilliant Left Foot • Principal Anchor Star of Orion",
  "peacock": "Brilliant Eye • Principal Anchor Star of Pavo",
  "delta-pavonis": "Right Wing Plume • Core Navigational Asterism",
  "markab": "Southwest Corner • Core Navigational Asterism",
  "scheat": "Northwest Corner • Core Navigational Asterism",
  "algenib": "Southeast Corner • Core Navigational Asterism",
  "enif": "Muzzle & Nose • Principal Anchor Star of Pegasus",
  "mirfak": "Heart / Torso • Principal Anchor Star of Perseus",
  "algol-a": "Gorgon Medusa Eye • Core Navigational Asterism",
  "atik": "Winged Sandal East • Core Navigational Asterism",
  "ankaa": "Heart of the Firebird • Principal Anchor Star of Phoenix",
  "tiaki-phe": "Western Flaming Wingtip • Core Navigational Asterism",
  "alpha-pictoris": "Easel Apex Clamp • Principal Anchor Star of Pictor",
  "beta-pictoris": "Right Shelf Leg • Core Navigational Asterism",
  "alrescha": "The Ribbon Knot • Core Navigational Asterism",
  "alpherg": "Circlet South • Principal Anchor Star of Pisces",
  "fomalhaut": "Fish Mouth • Principal Anchor Star of Piscis Austrinus",
  "delta-piscis-austrini": "Upper Body • Core Navigational Asterism",
  "tureis": "Aft Mast • Core Navigational Asterism",
  "zeta-puppis": "Blazing Supergiant Hull • Principal Anchor Star of Puppis",
  "alpha-pyxidis": "Needle North Point • Principal Anchor Star of Pyxis",
  "beta-pyxidis": "Magnetic Gimbal Pivot • Core Navigational Asterism",
  "alpha-reticuli": "North Diamond Apex • Principal Anchor Star of Reticulum",
  "beta-reticuli": "West Crosshair Vertex • Core Navigational Asterism",
  "sham": "Upper Fletching Feather • Core Navigational Asterism",
  "gamma-sagittae": "Barbed Arrowhead • Principal Anchor Star of Sagitta",
  "kaus-australis": "South Bow • Principal Anchor Star of Sagittarius",
  "kaus-media": "Bow Center • Core Navigational Asterism",
  "kaus-borealis": "Teapot Lid Peak • Core Navigational Asterism",
  "nunki": "Teapot Handle Top • Core Navigational Asterism",
  "acrab": "North Claw • Core Navigational Asterism",
  "dschubba": "Scorpion Forehead • Core Navigational Asterism",
  "antares": "Rival of Mars • Principal Anchor Star of Scorpius",
  "sargas": "Sweeping Stinger Hook • Core Navigational Asterism",
  "shaula": "The Stinger Barb • Core Navigational Asterism",
  "alpha-sculptoris": "Carved Marble Bust • Principal Anchor Star of Sculptor",
  "gamma-sculptoris": "Turntable Right • Core Navigational Asterism",
  "alpha-scuti": "Shield Top Crest • Principal Anchor Star of Scutum",
  "beta-scuti": "Western Shield Rim • Core Navigational Asterism",
  "delta-scuti": "Shield Point Bottom • Core Navigational Asterism",
  "unukalhai": "Cor Serpentis / Heart • Principal Anchor Star of Serpens",
  "alya": "Double Star Tail Tip • Core Navigational Asterism",
  "alpha-sextantis": "Pivot Index Apex • Principal Anchor Star of Sextans",
  "beta-sextantis": "East Scale Sector • Core Navigational Asterism",
  "aldebaran": "The Fiery Eye • Principal Anchor Star of Taurus",
  "elnath": "Northern Horn Tip • Core Navigational Asterism",
  "tianguan": "Southern Horn Tip • Core Navigational Asterism",
  "alcyone": "Shoulder Cluster • Core Navigational Asterism",
  "alpha-telescopii": "Objective Lens • Principal Anchor Star of Telescopium",
  "zeta-telescopii": "Center Tube Pivot • Core Navigational Asterism",
  "mothallah": "Apex of Triangle • Core Navigational Asterism",
  "beta-trianguli": "Western Base Star • Principal Anchor Star of Triangulum",
  "atria": "Brilliant Apex • Principal Anchor Star of Triangulum Australe",
  "betria": "Southwest Base Star • Core Navigational Asterism",
  "beta-tucanae": "Bill Tip",
  "alpha-tucanae": "Head & Eye • Principal Anchor Star of Tucana",
  "dubhe": "Bowl Pointer • Core Navigational Asterism",
  "merak": "Bowl Pointer • Core Navigational Asterism",
  "phecda": "Bowl Base • Core Navigational Asterism",
  "megrez": "Bowl Rim • Core Navigational Asterism",
  "alioth": "Tail • Principal Anchor Star of Ursa Major",
  "mizar-a": "Tail • Core Navigational Asterism",
  "alkaid": "Tail Tip • Core Navigational Asterism",
  "muscida": "Bear Snout",
  "polaris": "North Star • Principal Anchor Star of Ursa Minor",
  "yildun": "Curved Tail • Core Navigational Asterism",
  "kochab": "Guardian of the Pole • Core Navigational Asterism",
  "pherkad": "Guardian of the Pole • Core Navigational Asterism",
  "alsuhail": "Topmast Gilded Cross • Core Navigational Asterism",
  "alsephina": "False Cross Northwest • Core Navigational Asterism",
  "markeb": "False Cross Southeast • Core Navigational Asterism",
  "regor": "Wolf-Rayet Jewel • Principal Anchor Star of Vela",
  "spica": "Ear of Wheat • Principal Anchor Star of Virgo",
  "gamma-virginis-a": "Waist / Girdle • Core Navigational Asterism",
  "zavijava": "Maiden Head & Crown • Core Navigational Asterism",
  "vindemiatrix": "Outspread Wing • Core Navigational Asterism",
  "heze": "Gown Drapery • Core Navigational Asterism",
  "beta-volantis": "West Flying Wingtip • Principal Anchor Star of Volans",
  "anser": "The Goose in Fox Muzzle • Principal Anchor Star of Vulpecula",
  "15-vulpeculae": "Fox Shoulder • Core Navigational Asterism",
  "r-andromedae": "R Andromedae (Zirconium-Oxide S-Type Mira Giant)",
  "ross-248": "Ross 248 (Future Nearest Star to the Sun in ~33,000 Years)",
  "groombridge-34-a": "Groombridge 34 A (GX Andromedae Flare System)",
  "groombridge-34-b": "Groombridge 34 B (GQ Andromedae Flare Companion)",
  "wise-0146-4234": "WISE 0146+4234 Ultra-Cold Y-Dwarf Binary",
  "u-antliae": "U Antliae Detached Carbon Envelope Giant",
  "denis-j1048-3956": "DENIS J1048-3956 Ultra-Cool Flare Dwarf",
  "trappist-1": "Southern Water Stream Exoplanet System (7 Earths)",
  "ez-aquarii-a": "EZ Aquarii Triple Flare System A (Urn Pour Point)",
  "ez-aquarii-b": "EZ Aquarii Triple Flare System B (Urn Pour Point)",
  "ez-aquarii-c": "EZ Aquarii Triple Flare System C (Urn Pour Point)",
  "v-aquilae": "V Aquilae Deep Carbon Star (Eagle Wing)",
  "irc-10420": "IRC +10420 Yellow Supergiant Cocoon",
  "hulse-taylor-pulsar": "Hulse-Taylor Binary Pulsar (Gravitational Wave Prototype)",
  "westerlund-1-26": "Westerlund 1 Super Star Cluster Core (Red Supergiant)",
  "westerlund-1-237": "Westerlund 1 Massive Red Supergiant",
  "westerlund-1-75": "Westerlund 1 Cluster Evolved Member",
  "mu-arae": "Mu Arae (Cervantes Multi-Planet System)",
  "gliese-674": "Gliese 674 Red Dwarf Exoplanet Host",
  "teegardens-star": "Teegarden’s Star (Ultra-Cool Dwarf with 2 Habitable Worlds)",
  "tz-arietis": "TZ Arietis (Gliese 83.1 Flare Red Dwarf)",
  "uu-aurigae": "UU Aurigae Carbon Supergiant",
  "capella-ab": "Capella Ab (Close Giant Companion in Capella Quadruple)",
  "capella-h": "Capella H (GJ 195 A / Distant Red Dwarf in Capella Quadruple)",
  "capella-l": "Capella L (GJ 195 B / Faint Red Dwarf Companion to Capella H)",
  "gamma-1-caeli": "Gamma-1 Caeli Evolved Giant System",
  "stein-2051-b": "Stein 2051 B (Gravitational Deflection White Dwarf)",
  "dx-cancri": "DX Cancri High-Activity Flare Star",
  "la-superba": "La Superba (Y CVn / Deep Scarlet Carbon Star)",
  "vy-canis-majoris": "Red Hypergiant Sector (North of Sirius / Dog Torso)",
  "sirius-b": "The Pup (0.13 ly from Sirius A / Dog Chest)",
  "procyon-b": "Procyon B (White Dwarf Companion to Procyon A)",
  "luytens-star": "GJ 273 (Luyten’s Star Multi-Planet Red Dwarf)",
  "v602-carinae": "Carina Nebula Outer Arm Supergiant",
  "ck-carinae": "Carina Nebula Southern Cluster",
  "eta-carinae-a": "Homunculus Nebula Core (NGC 3372 / Keel Heart)",
  "ix-carinae": "Keel Center High-Luminosity Giant",
  "v382-carinae": "Yellow Supergiant Sector (Keel)",
  "rt-carinae": "Homunculus Peripheral Supergiant",
  "hd-93129a": "Trumpler 14 Core (Extreme O2 Supergiant)",
  "ev-carinae": "Mid-Keel Red Supergiant",
  "wr-30a": "Carina Wolf-Rayet Massive Binary",
  "wr-42e": "Colliding Wind Binary (Keel)",
  "wr-25": "Trumpler 16 Central Monster (Keel)",
  "pz-cassiopeiae": "PZ Cassiopeiae Extreme Red Supergiant",
  "rho-cassiopeiae": "Rho Cassiopeiae Yellow Supergiant (Naked-Eye Rarity)",
  "r-cassiopeiae": "R Cassiopeiae Mira Variable Giant",
  "v509-cassiopeiae": "HR 8752 Yellow Supergiant (Transitional Supergiant)",
  "wr-2": "WR 2 Massive Stripped Helium Star",
  "kpd-0005-5106": "KPD 0005+5106 (Hottest Known White Dwarf at 200,000 K)",
  "v766-centauri": "Yellow Supergiant Sector (Northern Flank)",
  "alpha-centauri-b": "Toliman (Alpha Centauri Binary / Southern Foot)",
  "proxima-centauri": "Proxima Orbit (2.18° SW of Alpha Centauri / Southern Foot)",
  "bpm-37093": "Crystallized Diamond Dwarf Core (Torso)",
  "v354-cephei": "V354 Cephei Luminous Hypergiant",
  "st-cephei": "ST Cephei Red Supergiant (King’s Crown)",
  "v419-cephei": "V419 Cephei Massive Envelope Supergiant",
  "vv-cephei-a": "VV Cephei A Eclipsing Hypergiant Monster",
  "rw-cephei": "RW Cephei Pulsating Red Hypergiant",
  "t-cephei": "T Cephei Long-Period Mira Giant (Crown Peak)",
  "kruger-60-a": "Kruger 60 Binary System Primary",
  "kruger-60-b": "DO Cephei Flare Dwarf (Kruger 60 Companion)",
  "my-cephei": "MY Cephei Red Supergiant (NGC 7419 Cluster)",
  "luyten-726-8-a": "BL Ceti Binary System (Whale Tail)",
  "uv-ceti": "Luyten 726-8 Flare Prototype (Whale Tail)",
  "tau-ceti": "Tau Ceti (Stable G-Type Solar Analogue / Whale Flank)",
  "lhs-1140": "LHS 1140 Rocky Super-Earth Host (Whale Body)",
  "psr-b1509-58": "Hand of God Pulsar (PSR B1509-58 Wind Nebula)",
  "rx-j1856-3754": "The Magnificent Seven Isolated Thermal Neutron Star",
  "nml-cygni": "Cygnus OB2 Association (North of Sadr)",
  "ky-cygni": "Northern Cross Luminous Supergiant Cloud",
  "bi-cygni": "Cygnus OB1 Red Supergiant",
  "bc-cygni": "Cygnus OB1 Association Member",
  "rw-cygni": "Evolved Red Supergiant (Northern Cross)",
  "chi-cygni": "Mira Variable Spine (Near Albireo / Swan Neck)",
  "cygnus-ob2-12": "Cygnus OB2 Cluster (Extreme Blue Supergiant)",
  "hde-226868": "Cygnus X-1 Accretion System (Near Eta Cygni / Neck)",
  "kepler-186": "Kepler Exoplanet Field (Earth-Sized Habitable Host)",
  "kepler-452": "Kepler Exoplanet Field (Earth 2.0 Host)",
  "61-cygni-a": "Bessel’s Flying Star System (Near Eastern Wing)",
  "61-cygni-b": "Bessel’s Flying Star Binary B (Near Eastern Wing)",
  "kepler-22": "Kepler Exoplanet Field (Water World Candidate Host)",
  "kepler-11": "Kepler Multi-Planet Coplanar System",
  "wr-142": "WO-Class Wolf-Rayet Stripped Core",
  "wr-136": "Crescent Nebula Central Star (NGC 6888)",
  "boyajians-star": "Tabby’s Star (Anomalous Light Curve / Near Delta Cyg)",
  "woh-g64": "WOH G64 Red Hypergiant (Large Magellanic Cloud)",
  "s-doradus": "S Doradus Prototype Luminous Blue Variable (LMC)",
  "r136a1": "Tarantula Nebula (R136 Super Star Cluster / LMC)",
  "woh-s70": "Large Magellanic Cloud Evolved Hypergiant",
  "r-doradus": "R Doradus (Largest Apparent Diameter Star in Sky)",
  "vfts-352": "VFTS 352 (Kissing Contact Binary / LMC)",
  "melnick-42": "Tarantula Nebula Outlier Monster (LMC)",
  "vfts-682": "VFTS 682 Isolated Runaway Monster (LMC)",
  "iras-05280-6910": "IRAS 05280-6910 Giant Red Envelope (LMC)",
  "sanduleak-2-73": "Sanduleak 2-73 Hypergiant Sector (LMC)",
  "bat99-98": "BAT99-98 High-Mass Monster (LMC)",
  "r136a2": "R136 Monster Cluster Member (LMC)",
  "r136a3": "R136 Massive Core Component (LMC)",
  "r136c": "R136 Luminous Wolf-Rayet Boundary",
  "hd-269810": "HD 269810 Extreme O2 Dwarf (LMC)",
  "gliese-687": "Gliese 687 Red Dwarf System (Dragon Body Arc)",
  "cats-eye-central": "Cat’s Eye Nebula (NGC 6543) Central White Dwarf",
  "wd-1856-534": "WD 1856+534 Jovian Planet Host White Dwarf",
  "epsilon-eridani": "Ran (Epsilon Eridani / Nearest Sun-Like Exoplanet Host)",
  "40-eridani-b": "Keid B (First Discovered White Dwarf in 1783)",
  "tv-geminorum": "Castor Foot Red Supergiant",
  "bu-geminorum": "Gemini Torso Evolved Supergiant",
  "geminga": "Geminga (PSR J0633+1746 Optical-Silent Gamma Pulsar)",
  "castor-c": "YY Geminorum (Eclipsing Flare Dwarf of Castor Sextuple)",
  "ngc-2371-central": "Double Nebula (NGC 2371-2) Ultra-Hot White Dwarf",
  "pi1-gruis": "Pi1 Gruis (Convective Giant with Giant Granulation Cells)",
  "gd-358": "V777 Herculis (Prototype Pulsating DB White Dwarf)",
  "gj-1061": "GJ 1061 Multi-Planet Red Dwarf System",
  "w-hydrae": "W Hydrae Asymptotic Giant Branch Star with Water Ring",
  "v-hydrae": "V Hydrae (Death Spiral Carbon Star Ejecting Plasma Bullets)",
  "wise-0855-0714": "WISE 0855-0714 (Coldest Sub-Zero Water Cloud Brown Dwarf)",
  "hd-10180": "HD 10180 (Dense Seven-Exoplanet Solar Analogue)",
  "cw-leonis": "IRC +10216 Carbon Soot Cocoon (Leo Head)",
  "wolf-359": "Wolf 359 (CN Leonis / Hind Leg Sector)",
  "r-leporis": "Hind’s Crimson Star (Deepest Red Carbon Star)",
  "gliese-229-b": "Gliese 229 B (First Confirmed Methane T-Dwarf in 1995)",
  "gliese-581": "Gliese 581 Famous Multi-Planet Red Dwarf",
  "wise-1541-2250": "WISE 1541-2250 Ultra-Cold Y-Dwarf",
  "methuselah-star": "HD 140283 (Methuselah Star / ~13.7 Billion Years Old)",
  "lacaille-8760": "AX Microscopii (Brightest M-Dwarf in the Night Sky)",
  "v838-monocerotis": "V838 Monocerotis (Luminous Red Nova Light Echo Star)",
  "plasketts-star": "Plaskett’s Star (One of Most Massive Known Binaries)",
  "ross-614-a": "Ross 614 Binary Red Dwarf Primary",
  "ross-614-b": "Ross 614 B Ultra-Low Mass Companion",
  "hd-143183": "HD 143183 Massive Evolved Supergiant",
  "barnards-star": "Barnard’s Star (High Proper Motion / Northern Torso)",
  "wolf-1061": "Wolf 1061 Habitable Zone Red Dwarf (Southern Foot)",
  "gj-1214": "GJ 1214 Ocean World Host (Serpent Holder Torso)",
  "theta1-orionis-c": "Trapezium Cluster Core (M42 / Sword Center)",
  "scr-1845-6357-a": "SCR 1845-6357 A Flare Red Dwarf",
  "scr-1845-6357-b": "SCR 1845-6357 B T-Dwarf Companion",
  "51-pegasi": "51 Pegasi (Helvetios / First Exoplanet Around Sun-Like Star)",
  "su-persei": "Double Cluster (NGC 869/884) Supergiant Periphery",
  "rs-persei": "Double Cluster Red Supergiant",
  "s-persei": "Double Cluster Red Hypergiant",
  "algol-b": "Algol B (Subgiant Companion to the Demon Star)",
  "eblm-j0555-57ab": "EBLM J0555-57Ab (Smallest Known Normal Fusion Star)",
  "kapteyns-star": "Kapteyn’s Star (Galactic Halo High-Velocity Red Dwarf)",
  "tx-piscium": "19 Piscium (Deep Ruby Carbon Star on Ecliptic)",
  "van-maanens-star": "Van Maanen 2 (Nearest Isolated White Dwarf to Earth)",
  "lacaille-9352": "Lacaille 9352 (High-Velocity Multi-Planet Red Dwarf)",
  "zeta-1-reticuli": "Zeta-1 Reticuli Twin Solar Analogue",
  "zeta-2-reticuli": "Zeta-2 Reticuli Exoplanetary Debris Disk Host",
  "wise-0350-5658": "WISE 0350-5658 Room-Temperature Y-Dwarf",
  "kw-sagittarii": "Teapot Lid Supergiant Sector",
  "gcirs-7": "Sagittarius A* Orbital Perimeter Core",
  "pistol-star": "Quintuplet Cluster / Galactic Center Core (Western Edge)",
  "ross-154": "Teapot Base Flare Dwarf",
  "psr-j1748-2446ad": "Terzan 5 Globular Cluster (Fastest Pulsar)",
  "sgr-1806-20": "Galactic Core Ultra-Magnetar",
  "wr-102": "Extreme Oxygen-Sequence Wolf-Rayet",
  "vx-sagittarii": "Pulsating Supergiant Core",
  "wr-93b": "Galactic Bar Wolf-Rayet Core",
  "peony-star": "Galactic Center Luminous Giant Core",
  "ah-scorpii": "AH Scorpii Extreme Red Supergiant",
  "gliese-667-c": "Gliese 667 C Triple System Habitable Zone Host",
  "gliese-667-a": "Gliese 667 A Primary K-Dwarf",
  "gliese-667-b": "Gliese 667 B Companion K-Dwarf",
  "gliese-1": "Gliese 1 (First Entry in Gliese Catalog of Nearby Stars)",
  "stephenson-2-18": "Stephenson 2 Open Cluster Core (Central Shield Cloud)",
  "uy-scuti": "Northern Shield Hypergiant Core",
  "irc-minus-10414": "Mid-Shield Evolved Supergiant",
  "rsgc1-f01": "RSGC1 Massive Star Cluster Core",
  "r-serpentis": "R Serpentis Long-Period Pulsating Giant",
  "lhs-292": "LHS 292 Magnetic Flare Dwarf",
  "ruby-star": "Ruby Star / 119 Tauri (Near Southern Hyades Flank)",
  "crab-pulsar": "Crab Nebula (M1 / SN 1054 Remnant / Southern Horn Tip)",
  "r-trianguli": "R Trianguli High-Amplitude Mira Variable",
  "ab7": "AB7 Binary Wolf-Rayet (Small Magellanic Cloud)",
  "hv-11417": "HV 11417 Massive Red Supergiant (Small Magellanic Cloud)",
  "lalande-21185": "Lalande 21185 (Southern Hind Paw Sector)",
  "alcor": "Alcor (Horse and Rider System / Optical Companion to Mizar)",
  "wise-1506-7027": "WISE 1506+7027 Nearby Ultra-Cool T-Dwarf",
  "lp-40-365": "LP 40-365 (GD 492 Hypervelocity Supernova Survivor)",
  "vela-pulsar": "Vela Supernova Remnant Core (PSR B0833-45)",
  "luhman-16-a": "Luhman 16 Brown Dwarf Binary (Third-Closest System)",
  "luhman-16-b": "Luhman 16 B Striated Cloud Dwarf",
  "ross-128": "Ross 128 (Inactive Red Dwarf with Earth-Mass Planet)",
  "lich-pulsar": "Lich (PSR B1257+12 First Exoplanet Pulsar System)",
  "gamma-virginis-b": "Porrima Companion (Gamma Virginis Binary / Waist)",
  "wolf-424-a": "Wolf 424 Binary Flare Red Dwarf A",
  "wolf-424-b": "Wolf 424 Binary Flare Red Dwarf B",
  "wd-1145-017": "WD 1145+017 Disintegrating Asteroid System",
  "nr-vulpeculae": "NR Vulpeculae Variable Supergiant",
  "sun": "Center of the Solar System (Anchor for all Planetary Orbits)",
  "epsilon-crucis": "Cross Arm Intersection • Intrometida on Brazilian Flag",
  "larawag": "Scorpion Tail Spine (Epsilon Scorpii) • Brazilian Flag Anchor",
  "iota-1-scorpii": "Scorpion Tail Stinger Joint • Apollyon on Brazilian Flag",
  "girtab": "Stinger Base • Kappa Scorpii on Brazilian Flag",
  "xamidimura": "Scorpion Tail Joint • Mu-1 Scorpii on Brazilian Flag",
  "muliphein": "Neck of the Greater Dog • Gamma CMa on Brazilian Flag",
  "gamma-trianguli-australis": "Base Vertex of Southern Triangle • Brazilian Flag Anchor",
  "calvera": "High-Latitude Core • Isolated Thermal Neutron Star (1RXS J141256.0+792204)",
  "black-widow-pulsar": "Arrow Shaft • Relativistic Millisecond Pulsar (PSR B1957+20)",
  "redback-pulsar": "Sextant Frame • Transitional Millisecond Pulsar (PSR J1023+0038)",
  "double-pulsar-a": "Stern Deck • Relativistic Double Pulsar Primary (PSR J0737-3039A)",
  "double-pulsar-b": "Stern Deck • Relativistic Double Pulsar Companion (PSR J0737-3039B)",
  "sgr-1935-2154": "Fox Body • Galactic Fast Radio Burst Magnetar",
  "swift-j1818-1607": "Teapot Steam • Youngest Fast-Spinning Magnetar (PSR J1818-1607)",
  "magnetar-1e-2259": "Queen's Throne Crown • CTB 109 Supernova Remnant Magnetar",
  "magnetar-1e-1048": "Keel Nebula Halo • Anomalous X-ray Pulsar Magnetar",
  "rx-j0720-3125": "Puppis Relic Cloud • Magnificent Seven Isolated Neutron Star",
  "rx-j0806-4123": "Vela Supernova Complex • Magnificent Seven Isolated Neutron Star",
  "rx-j1308-2127": "Berenice's Tresses Halo • Magnificent Seven Isolated Neutron Star (RBS 1223)",
  "rx-j1605-3249": "Northern Crown Perimeter • Magnificent Seven Thermal Neutron Star",
  "psr-b0950-08": "Lion's Flank • Canonical Radio Pulsar",
  "psr-b0656-14": "Twins' Feet Relic • Cooling Middle-Aged Neutron Star",
  "psr-b1055-52": "Fly Wing Relic • Three Musketeers Thermal Pulsar",
  "r-horologii": "Southern Variable • Mira Red Giant in Horologium",
  "scorpius-x-1-ns": "First Extrasolar X-Ray Source • Relativistic LMXB Neutron Star",
  "scorpius-x-1-optical": "V818 Scorpii • Irradiated Optical Companion to Scorpius X-1",
  "rx-j0420-5022": "Magnificent Seven • Isolated Thermal Neutron Star in Pictor",
  "rbs-1774": "Magnificent Seven RBS 1774 • High Magnetic Field INS in Equuleus",
  "psr-b1919-21": "LGM-1 • Historic First Radio Pulsar Discovered (1967)",
  "psr-j0030-0451": "NICER Precision Mapped Pulsar • Landmark Radius in Pisces",
  "psr-j0740-6620": "Ultra-Massive 2.08 M☉ Pulsar • Dense Matter Benchmark",
  "cas-a-neutron-star": "Cas A CCO • Central Compact Object with Carbon Atmosphere",
  "vela-jr-cco": "Vela Jr Central Compact Object • Young Thermal Neutron Star",
  "pks-1209-cco": "1E 1207.4-5209 • Isolated Neutron Star with Cyclotron Features",
  "sgr-1900-14": "Giant Flare Magnetar in Aquila • 10^15 Gauss Magnetic Monster",
  "1e-1841-045": "Kes 73 Magnetar • Pulsed Anomalous X-Ray Source in Scutum",
  "westerlund-1-magnetar": "Westerlund 1 Magnetar • Formed from >40 M☉ Massive Progenitor",
  "psr-b1259-63": "Gamma-Ray Binary Pulsar • Orbiting Be Star in Crux",
  "lggs-j004539-m31": "M31-RSG1 • Colossal Red Hypergiant in Andromeda Galaxy",
  "lggs-j004035-m31": "M31-RSG2 • 1,100 D☉ Red Supergiant in Andromeda Galaxy",
  "lggs-j004116-m31": "M31-RSG3 • 1,050 D☉ Red Hypergiant in Andromeda Galaxy",
  "af-andromedae": "AF And • Luminous Blue Variable Hypergiant in Andromeda",
  "lggs-j013414-m33": "M33-RSG1 • 1,280 D☉ Red Hypergiant in Triangulum Galaxy",
  "lggs-j013352-m33": "M33-RSG2 • 1,140 D☉ Red Supergiant in Triangulum Galaxy",
  "m33-var-a": "Variable A • Hubble-Sandage Eruptive Hypergiant in M33",
  "hv-888": "HV 888 • 1,374 D☉ Red Hypergiant in Large Magellanic Cloud",
  "woh-s281": "WOH S281 • 1,120 D☉ Red Supergiant in LMC",
  "woh-s341": "WOH S341 • 1,150 D☉ Red Hypergiant in LMC",
  "hv-916": "HV 916 • 1,040 D☉ Red Supergiant in Large Magellanic Cloud",
  "hv-11223": "HV 11223 • 1,080 D☉ Red Supergiant in Small Magellanic Cloud",
  "hv-838": "HV 838 • 1,020 D☉ Red Hypergiant in Small Magellanic Cloud",
  "k2-18": "K2-18 • Habitable Zone Sub-Neptune Host M-Dwarf in Leo",
  "gliese-436": "Noquisi • Host to Evaporating Comet Planet Gliese 436 b",
  "gliese-876": "IL Aquarii • Laplace Resonance 4-Planet System in Aquarius",
  "toi-700": "TOI-700 • Multi-Planet Habitable Zone Host in Dorado",
  "gliese-229-a": "Gliese 229 A • Host to Prototype T-Dwarf in Columba",
  "gliese-832": "GJ 832 • Habitable Zone Super-Earth Host in Grus",
  "ad-leonis": "Gl 388 • Extreme Magnetic Flare Star in Leo",
  "ev-lacertae": "Gl 873 • Rapidly Spinning Megaflare Star in Lacerta",
  "yz-ceti": "GJ 54.1 • 12.1 ly Flare Star with 3 Terrestrial Planets in Cetus",
  "gj-357": "GJ 357 • Temperate Super-Earth Host Red Dwarf in Hydra",
  "lhs-475": "LHS 475 • First Exoplanet Confirmed by JWST in Octans",
  "vb-10": "Van Biesbroeck 10 • Ultra-cool Red Dwarf Boundary in Aquila",
  "struve-2398-a": "Struve 2398 A • 11.5 ly Binary Red Dwarf in Draco",
  "struve-2398-b": "Struve 2398 B • 11.5 ly Flare Star Companion in Draco",
  "gliese-412-a": "Gl 412 A • 15.8 ly High-Velocity Red Dwarf in Ursa Major",
  "wx-ursae-majoris": "WX UMa • 15.8 ly Flare Star Companion in Ursa Major",
  "groombridge-1618": "Groombridge 1618 • 15.9 ly High Proper Motion Orange Dwarf",
  "40-eridani-a": "Keid A • 16.3 ly Naked-Eye Orange Dwarf & Host of Vulcan",
  "40-eridani-c": "DY Eri • 16.3 ly Flare Star Companion to White Dwarf 40 Eri B",
  "gliese-682": "GJ 682 • 16.3 ly Habitable Zone Planet Host in Scorpius",
  "gliese-445": "Gl 445 • 17.1 ly Red Dwarf & Voyager 1 Future Flyby Star",
  "gliese-526": "Gl 526 • 17.7 ly Bright Early M-Dwarf in Boötes",
  "stein-2051-a": "Stein 2051 A • 18.1 ly Red Dwarf Primary in Camelopardalis",
  "wolf-294": "Wolf 294 • 18.2 ly Super-Earth Host Red Dwarf in Gemini",
  "gliese-205": "GJ 205 • 18.6 ly Visually Bright Red Dwarf in Orion",
  "sigma-draconis": "Alsafi • 18.8 ly Naked-Eye Stable Orange Dwarf in Draco",
  "ross-47": "Ross 47 • 18.9 ly High Proper Motion Red Dwarf in Taurus",
  "gliese-570-a": "HR 5568 • 19.3 ly Naked-Eye Orange Dwarf in Libra Quadruple",
  "gliese-570-b": "Gl 570 B • 19.3 ly Red Dwarf Binary in Libra Quadruple",
  "gliese-570-c": "Gl 570 C • 19.3 ly Red Dwarf Companion in Libra",
  "gliese-570-d": "Gl 570 D • 19.3 ly Benchmark Cool Methane Brown Dwarf",
  "gliese-752-a": "Wolf 1055 • 19.3 ly Red Dwarf Primary to VB 10 in Aquila",
  "82-g-eridani": "82 G. Eri • 19.7 ly Naked-Eye Solar Analogue with 3 Planets",
  "hn-librae": "HN Lib • 20.4 ly Periodic Starspot Flare Star in Libra",
  "gliese-625": "GJ 625 • 21.1 ly Habitable-Zone Super-Earth Host in Draco",
  "hd-219134": "HR 8832 • 21.4 ly Naked-Eye Orange Dwarf with 6 Planets in Cas",
  "xi-bootis-a": "Xi Boo A • 22.0 ly Naked-Eye Visual Binary Primary in Boötes",
  "xi-bootis-b": "Xi Boo B • 22.0 ly Orange Dwarf Binary Companion in Boötes",
  "gliese-880": "GJ 880 • 22.4 ly High Proper Motion Early M-Dwarf in Pegasus",
  "gliese-393": "GJ 393 • 23.0 ly Super-Earth Host Red Dwarf in Sextans",
  "gliese-105-a": "26 G. Ceti • 23.5 ly Naked-Eye Orange Dwarf in Triple System",
  "gliese-105-b": "BX Ceti • 23.5 ly Flare Star Companion in Cetus",
  "gliese-514": "GJ 514 • 24.9 ly Eccentric Habitable-Zone Planet Host in Virgo",
  "gliese-673": "GJ 673 • 25.1 ly High Proper Motion Orange Dwarf in Ophiuchus",
  "gj-1151": "GJ 1151 • 26.2 ly Auroral Radio Exoplanet Host in Ursa Major",
  "chi-1-orionis": "54 Orionis • 28.3 ly Naked-Eye Young Solar Twin in Orion",
  "gamma-leporis-a": "13 Leporis A • 29.3 ly Naked-Eye F-Type Visual Binary in Lepus",
  "gamma-leporis-b": "AK Lep • 29.3 ly BY Draconis Variable Companion in Lepus",
  "caph": "West Peak of the 'W' (Beta Cassiopeiae) • Delta Scuti Variable",
  "ruchbah": "Knee of the Queen (Delta Cassiopeiae) • Eclipsing Binary",
  "segin": "East Peak of the 'W' (Epsilon Cassiopeiae) • Blue-White Giant",
  "achird": "Throne Heart (Eta Cassiopeiae) • Solar-Twin Binary System",
  "tania-australis": "Great Bear Southern Hind Paw (Mu Ursae Majoris) • Red Giant",
  "tania-borealis": "Great Bear Northern Hind Paw (Lambda Ursae Majoris) • White Subgiant",
  "talitha": "Great Bear Upper Front Paw (Iota Ursae Majoris) • Quadruple System",
  "alula-australis": "Great Bear Southern Forepaw (Xi Ursae Majoris) • Historic Binary",
  "alula-borealis": "Great Bear Northern Forepaw (Nu Ursae Majoris) • Orange Giant",
  "gienah-cygni": "Eastern Wing of the Swan (Epsilon Cygni / Aljanah)",
  "p-cygni": "Swan's Chest / Heart • Luminous Blue Variable Hypergiant",
  "atlas-pleiades": "Pleiades Father Star (27 Tauri) • Cluster Eastern Anchor",
  "electra-pleiades": "Pleiades Sister (17 Tauri) • Blue-White Be Star",
  "maia-pleiades": "Pleiades Sister (20 Tauri) • Chemically Peculiar Star",
  "merope-pleiades": "Pleiades Sister (23 Tauri) • Illuminating Reflection Nebula",
  "taygeta-pleiades": "Pleiades Sister (19 Tauri) • Triple Star System",
  "mebsuta": "Castor's Waist / Outstretched Arm (Epsilon Geminorum) • Supergiant",
  "tejat-posterior": "Castor's Foot (Mu Geminorum) • Pulsating Red Giant",
  "propus": "Castor's Toe (Eta Geminorum) • Triple Eclipsing System",
  "mekbuda": "Pollux's Knee (Zeta Geminorum) • Classical Cepheid Variable",
  "homam": "Wing of Pegasus (Zeta Pegasi) • B8 Subgiant",
  "matar": "Shoulder of Pegasus (Eta Pegasi) • G-Type Giant Binary",
  "chertan": "Lion's Rump (Theta Leonis) • Coxa Asterism Anchor",
  "al-jabbah": "Lion's Mane / Forehead (Eta Leonis) • Supergiant",
  "rasalas": "Lion's Brow (Mu Leonis) • Orange Giant",
  "subra": "Lion's Left Paw (Omicron Leonis) • Double Star",
  "alterf": "Lion's Eyes / Brow (Lambda Leonis) • K-Type Giant",
  "ascella": "Teapot Handle Base (Zeta Sagittarii) • Binary Star",
  "alnasl": "Teapot Spout Tip (Gamma-2 Sagittarii) • Pointing to Galactic Center",
  "arkab-prior": "Archer's Tendon / Front Leg (Beta-1 Sagittarii)",
  "rukbat": "Archer's Knee (Alpha Sagittarii) • Historic Lucida",
  "terebellum-omega": "Terebellum Quadrangle (Omega Sagittarii)",
  "polis-sagittarii": "Upper Bow / Mantle (Mu Sagittarii) • Multiple Supergiant",
  "seginus": "Herdsman's Left Shoulder (Gamma Bootis) • Delta Scuti Variable",
  "nekkar": "Herdsman's Head (Beta Bootis) • G8 Giant Flare Star",
  "epsilon-1-lyrae": "Double-Double Primary (Epsilon-1 Lyrae) • Quadruple System",
  "miaplacidus": "False Keel Anchor (Beta Carinae) • A2 Subgiant",
  "aspidiske": "Southern False Cross Arm (Iota Carinae) • Luminous Supergiant",
  "kalausi": "Omicron Velorum Cluster (IC 2391) Lucida",
  "miram": "Hero's Northern Armor (Eta Persei) • Perseus OB3 Supergiant",
  "menkib": "Hero's Foot / California Nebula Illuminator (Xi Persei)",
  "gorgonea-tertia": "Medusa's Hair / Hand (Rho Persei) • Semiregular Red Giant",
  "sadatoni": "Kid / Haedi Pair (Zeta Aurigae) • Atmospheric Eclipsing Binary",
  "kaffaljidhma": "Sea Monster's Jaw / Head (Gamma Ceti) • Close Visual Binary",
  "cebalrai": "Shepherd's Heart (Beta Ophiuchi) • K-Type Giant",
  "yed-prior": "Front Hand of Ophiuchus (Delta Ophiuchi) • Red Giant",
  "yed-posterior": "Rear Hand of Ophiuchus (Epsilon Ophiuchi) • Yellow-Orange Giant",
  "marfik": "Serpent Bearer's Elbow (Lambda Ophiuchi) • Binary System",
  "t-coronae-borealis": "Crown Arch Perimeter • The Blaze Star Recurrent Nova",
  "tabit": "Orion's Shield (Pi-3 Orionis) • Nearby Solar Twin",
  "hatysa": "Orion's Sword Tip (Iota Orionis / Nair al Saif)",
  "alniyat": "Heart Flank (Sigma Scorpii) • Framing Antares",
  "fang": "Scorpion Head Claw (Pi Scorpii) • Triple Star",
  "furud": "Southern Paw of Canis Major • Zeta CMa",
  "aludra": "Tail of Canis Major • Eta CMa Luminous Supergiant",
  "menkent": "Centaur's Shoulder (Theta Centauri) • K0 Giant",
  "muhlifain": "Centaur's Torso Center (Gamma Centauri) • White Subgiant Binary",
  "hadar": "Left Forefoot Pointer to Crux (Beta Centauri) • 11th Brightest Star",
  "gamma-cassiopeiae": "Central Peak of W Asterism (Navi / Tsih) • Prototype Eruptive Be Star",
  "epsilon-centauri": "Shoulder of the Centaur (Birdun) • Beta Cephei Pulsating Variable",
  "eta-centauri": "Flank of the Centaur • Rapidly Rotating Be Emission Star",
  "zeta-centauri": "Chest of the Centaur (Alnair) • Blue Subgiant Binary",
  "delta-centauri": "Shoulder Shell Star (Maekhab) • Be Shell Star",
  "theta-aurigae": "East Chariot Wheel (Mahasim) • Magnetic Silicon Star",
  "mu-velorum": "Lower Keel & Mast (Peregrini) • Yellow Giant X-Ray Flare Star",
  "iota-aurigae": "Ankle of the Charioteer (Hassaleh) • Orange Bright Giant",
  "lesath": "Stinger Cat's Eye (Upsilon Scorpii) • Pairs with Shaula",
  "pi-puppis": "Poop Deck Beacon (Ahadi) • Colossal Orange Supergiant",
  "eta-draconis": "Upper Serpent Coil (Athebyne) • Yellow Giant",
  "theta-carinae": "Southern Pleiades Beacon (Theta Carinae) • Cluster Lucida",
  "iota-centauri": "Centaur Flank (Alhakim) • White Star with Debris Disc",
  "gamma-lupi": "Chest of the Wolf (Gamma Lupi) • Blue Subgiant Binary",
  "tau-scorpii": "Heart Guardian (Paikauhale) • Hot Magnetic B-Star",
  "pi-sagittarii": "Archer Forehead (Albaldah) • Yellow-White Bright Giant",
  "epsilon-persei": "Hero Torso (Epsilon Persei) • Pulsating Fast Rotator",
  "gamma-persei": "Crown of Perseus (Alphecher) • Long-Period Eclipsing Binary",
  "upsilon-carinae": "Diamond Cross North (Upsilon Carinae) • White Supergiant",
  "tau-puppis": "Quarterdeck of the Argo (Rehoboth) • Orange Giant Binary",
  "zaurak": "Celestial Boat of Eridanus (Gamma Eridani) • Cool Red Giant",
  "raselased-australis": "Crown of the Lion's Sickle (Epsilon Leonis) • Yellow Bright Giant",
  "okab": "Eagle's Tail (Zeta Aquilae) • Rapidly Spinning Spheroid",
  "psi-ursae-majoris": "Hind Paw of the Bear (Ta Tsun) • Magnitude 3.00 Orange Giant",
  "delta-persei": "Hero's Arm (Delta Persei) • Perseus OB2 Giant",
  "omicron-2-canis-majoris": "Flank of the Great Dog • Luminous Blue Supergiant",
  "epsilon-corvi": "Beak of the Raven (Minkar) • Orange Giant",
  "gamma-cephei-a": "Errai • 45.0 ly Future North Star & Exoplanet Tadmor Host",
  "gamma-cephei-b": "Gamma Cep B • 45.0 ly Red Dwarf Companion in 70-Year Orbit",
  "upsilon-andromedae-a": "Titawin • 44.3 ly Pioneer Multi-Planet Exoplanet Host",
  "upsilon-andromedae-b-star": "Upsilon And B • 44.3 ly Red Dwarf Companion at 750 AU",
  "tau-bootis-a": "Tau Boo A • 51.1 ly Host of Tidally Locked Hot Jupiter",
  "tau-bootis-b": "Tau Boo B • 51.1 ly Red Dwarf Companion at 240 AU",
  "iota-horologii": "Iota Horologii • 56.5 ly Habitable-Zone Exoplanet Host",
  "gamma-2-velorum": "Regor • 1,120 ly Brightest Wolf-Rayet Star in the Sky",
  "gamma-1-velorum": "Gamma-1 Velorum • 1,120 ly Blue Giant Companion to Regor",
  "delta-velorum-a": "Koo She • 80.6 ly Eclipsing Binary Anchor of False Cross",
  "delta-velorum-b": "Delta Vel B • 80.6 ly Eclipsing Partner of Koo She",
  "alpha-fornacis-a": "Dalim • 45.7 ly Brightest Star in Fornax (Visual Binary)",
  "alpha-fornacis-b": "Alpha For B • 45.7 ly Yellow Dwarf Companion to Dalim",
  "alpha-corvi": "Alchiba • 48.7 ly Traditional Alpha Star of Corvus",
  "eta-corvi": "Eta Corvi • 59.4 ly Cometary Bombardment Belts",
  "alpha-1-canum-venaticorum": "Alpha-1 CVn • 110 ly Visual Companion to Cor Caroli",
  "acrux-b": "Alpha-2 Crucis • 321 ly Dazzling Blue Double of Southern Cross",
  "rigel-b": "Rigel BC • 860 ly Blue-White Binary Companion to Rigel",
  "regulus-b": "Regulus B • 79.3 ly Orange Dwarf Companion to Regulus",
  "regulus-c": "Regulus C • 79.3 ly Red Dwarf Partner to Regulus B",
  "polaris-ab": "Polaris Ab • 433 ly Close Dwarf Imaged by Hubble at 18.5 AU",
  "fomalhaut-b": "TW PsA • 24.8 ly Flare Star Companion to Fomalhaut at 0.9 ly",
  "fomalhaut-c": "LP 876-10 • 25.4 ly Debris Ring Red Dwarf Companion to Fomalhaut",
  "alcor-b": "Alcor B • 81.7 ly Red Dwarf Completing Sextuple Mizar-Alcor",
  "alphecca-b": "Alphecca B • 75.0 ly Solar Companion in 17-Day Eclipsing Orbit",
  "theta-1-orionis-c": "Trapezium C • 1,344 ly Anchor O-Star Powering Orion Nebula",
  "theta-1-orionis-a": "Trapezium A • 1,344 ly Eclipsing Binary in Trapezium Cluster",
  "epsilon-coronae-borealis": "Epsilon CrB • 221 ly Orange Giant with 6.7 M_J Planet",
  "hd-209458": "Osiris Host • 157 ly First Transiting Exoplanet Discovered",
  "hd-189733-a": "HD 189733 • 64.5 ly Cobalt-Blue World with Silicate Glass Rain",
  "hd-189733-b-star": "HD 189733 B • 64.5 ly Red Dwarf Companion at 216 AU",
  "wasp-12": "WASP-12 • 1,410 ly Devouring Doomed Egg-Shaped Hot Jupiter",
  "wasp-76": "WASP-76 • 634 ly Parent Star of Liquid Iron Rain World",
  "wasp-39": "Bocaprins • 700 ly JWST Landmark Host for Carbon Dioxide Detection",
  "kelt-9": "KELT-9 • 667 ly Hot B-Star Hosting 4,600 K Giant Planet",
  "kepler-16-a": "Kepler-16 A • 245 ly Real-World Tatooine Circumbinary Primary",
  "kepler-16-b-star": "Kepler-16 B • 245 ly Second Sun in Tatooine Circumbinary Pair",
  "hat-p-11": "HAT-P-11 • 123.3 ly Orange Dwarf Hosting Water-Bearing Warm Neptune",
  "gj-436": "GJ 436 • 31.8 ly Burning Ice Planet Host with Giant Hydrogen Cloud",
  "gj-3470": "GJ 3470 • 95.9 ly Evaporating Blue Sub-Neptune Host in Cancer"
};

export const EXTRA_CATALOG_FIGURE_STARS: Record<string, ExtraFigureStar[]> = {
  "andromeda": [
    {
      "x": 42,
      "y": 58,
      "catalogStarId": "r-andromedae",
      "name": "R Andromedae (R Andromedae (Zirconium-Oxide S-Type Mira Giant))",
      "mag": 5.8,
      "locationDescription": "R Andromedae (Zirconium-Oxide S-Type Mira Giant)"
    },
    {
      "x": 62,
      "y": 70,
      "catalogStarId": "ross-248",
      "name": "Ross 248 (HH Andromedae) (Ross 248 (Future Nearest Star to the Sun in ~33,000 Years))",
      "mag": 12.29,
      "locationDescription": "Ross 248 (Future Nearest Star to the Sun in ~33,000 Years)"
    },
    {
      "x": 52,
      "y": 64,
      "catalogStarId": "groombridge-34-a",
      "name": "Groombridge 34 A (GX And) (Groombridge 34 A (GX Andromedae Flare System))",
      "mag": 8.08,
      "locationDescription": "Groombridge 34 A (GX Andromedae Flare System)"
    },
    {
      "x": 52.8,
      "y": 64.5,
      "catalogStarId": "groombridge-34-b",
      "name": "Groombridge 34 B (GQ And) (Groombridge 34 B (GQ Andromedae Flare Companion))",
      "mag": 11.06,
      "locationDescription": "Groombridge 34 B (GQ Andromedae Flare Companion)"
    },
    {
      "x": 48,
      "y": 76,
      "catalogStarId": "wise-0146-4234",
      "name": "WISE 0146+4234 (WISE 0146+4234 Ultra-Cold Y-Dwarf Binary)",
      "mag": 17.5,
      "locationDescription": "WISE 0146+4234 Ultra-Cold Y-Dwarf Binary"
    }
  ],
  "antlia": [
    {
      "x": 48,
      "y": 52,
      "catalogStarId": "u-antliae",
      "name": "U Antliae (U Antliae Detached Carbon Envelope Giant)",
      "mag": 5.5,
      "locationDescription": "U Antliae Detached Carbon Envelope Giant"
    },
    {
      "x": 54,
      "y": 68,
      "catalogStarId": "denis-j1048-3956",
      "name": "DENIS J1048-3956 (DENIS J1048-3956 Ultra-Cool Flare Dwarf)",
      "mag": 17.39,
      "locationDescription": "DENIS J1048-3956 Ultra-Cool Flare Dwarf"
    }
  ],
  "aquarius": [
    {
      "x": 64,
      "y": 68,
      "catalogStarId": "trappist-1",
      "name": "TRAPPIST-1 (2MASS J23062928-0502285) (Southern Water Stream Exoplanet System (7 Earths))",
      "mag": 18.8,
      "locationDescription": "Southern Water Stream Exoplanet System (7 Earths)"
    },
    {
      "x": 52,
      "y": 82,
      "catalogStarId": "ez-aquarii-a",
      "name": "EZ Aquarii A (EZ Aquarii Triple Flare System A (Urn Pour Point))",
      "mag": 13.33,
      "locationDescription": "EZ Aquarii Triple Flare System A (Urn Pour Point)"
    },
    {
      "x": 52.6,
      "y": 82.3,
      "catalogStarId": "ez-aquarii-b",
      "name": "EZ Aquarii B (EZ Aquarii Triple Flare System B (Urn Pour Point))",
      "mag": 14,
      "locationDescription": "EZ Aquarii Triple Flare System B (Urn Pour Point)"
    },
    {
      "x": 51.8,
      "y": 82.5,
      "catalogStarId": "ez-aquarii-c",
      "name": "EZ Aquarii C (EZ Aquarii Triple Flare System C (Urn Pour Point))",
      "mag": 15,
      "locationDescription": "EZ Aquarii Triple Flare System C (Urn Pour Point)"
    }
  ],
  "aquila": [
    {
      "x": 56,
      "y": 64,
      "catalogStarId": "v-aquilae",
      "name": "V Aquilae (V Aquilae Deep Carbon Star (Eagle Wing))",
      "mag": 6.7,
      "locationDescription": "V Aquilae Deep Carbon Star (Eagle Wing)"
    },
    {
      "x": 48,
      "y": 38,
      "catalogStarId": "irc-10420",
      "name": "IRC +10420 (V1302 Aquilae) (IRC +10420 Yellow Supergiant Cocoon)",
      "mag": 11.1,
      "locationDescription": "IRC +10420 Yellow Supergiant Cocoon"
    },
    {
      "x": 42,
      "y": 58,
      "catalogStarId": "hulse-taylor-pulsar",
      "name": "Hulse-Taylor Pulsar (PSR B1913+16) (Hulse-Taylor Binary Pulsar (Gravitational Wave Prototype))",
      "mag": 22,
      "locationDescription": "Hulse-Taylor Binary Pulsar (Gravitational Wave Prototype)"
    }
  ],
  "ara": [
    {
      "x": 44,
      "y": 62,
      "catalogStarId": "westerlund-1-26",
      "name": "Westerlund 1-26 (Westerlund 1 Super Star Cluster Core (Red Supergiant))",
      "mag": 16.8,
      "locationDescription": "Westerlund 1 Super Star Cluster Core (Red Supergiant)"
    },
    {
      "x": 45,
      "y": 61,
      "catalogStarId": "westerlund-1-237",
      "name": "Westerlund 1-237 (Westerlund 1 Massive Red Supergiant)",
      "mag": 16.1,
      "locationDescription": "Westerlund 1 Massive Red Supergiant"
    },
    {
      "x": 46,
      "y": 63,
      "catalogStarId": "westerlund-1-75",
      "name": "Westerlund 1-75 (Westerlund 1 Cluster Evolved Member)",
      "mag": 16.5,
      "locationDescription": "Westerlund 1 Cluster Evolved Member"
    },
    {
      "x": 58,
      "y": 48,
      "catalogStarId": "mu-arae",
      "name": "Mu Arae (Cervantes) (Mu Arae (Cervantes Multi-Planet System))",
      "mag": 5.15,
      "locationDescription": "Mu Arae (Cervantes Multi-Planet System)"
    },
    {
      "x": 62,
      "y": 54,
      "catalogStarId": "gliese-674",
      "name": "Gliese 674 (Gliese 674 Red Dwarf Exoplanet Host)",
      "mag": 9.38,
      "locationDescription": "Gliese 674 Red Dwarf Exoplanet Host"
    }
  ],
  "aries": [
    {
      "x": 38,
      "y": 62,
      "catalogStarId": "teegardens-star",
      "name": "Teegarden’s Star (Teegarden’s Star (Ultra-Cool Dwarf with 2 Habitable Worlds))",
      "mag": 15.08,
      "locationDescription": "Teegarden’s Star (Ultra-Cool Dwarf with 2 Habitable Worlds)"
    },
    {
      "x": 44,
      "y": 68,
      "catalogStarId": "tz-arietis",
      "name": "TZ Arietis (TZ Arietis (Gliese 83.1 Flare Red Dwarf))",
      "mag": 12.3,
      "locationDescription": "TZ Arietis (Gliese 83.1 Flare Red Dwarf)"
    }
  ],
  "auriga": [
    {
      "x": 46,
      "y": 54,
      "catalogStarId": "uu-aurigae",
      "name": "UU Aurigae (UU Aurigae Carbon Supergiant)",
      "mag": 5.1,
      "locationDescription": "UU Aurigae Carbon Supergiant"
    },
    {
      "x": 50.8,
      "y": 22.8,
      "catalogStarId": "capella-ab",
      "name": "Capella Ab (Alpha Aurigae Ab) (Capella Ab (Close Giant Companion in Capella Quadruple))",
      "mag": 0.96,
      "locationDescription": "Capella Ab (Close Giant Companion in Capella Quadruple)"
    },
    {
      "x": 52,
      "y": 24,
      "catalogStarId": "capella-h",
      "name": "Capella H (GJ 195 A) (Distant M1V Red Dwarf in Capella Quadruple)",
      "mag": 10.16,
      "locationDescription": "Capella H (GJ 195 A Red Dwarf Companion)"
    },
    {
      "x": 52.4,
      "y": 24.2,
      "catalogStarId": "capella-l",
      "name": "Capella L (GJ 195 B) (Faint M5V Red Dwarf Companion to Capella H)",
      "mag": 13.7,
      "locationDescription": "Capella L (GJ 195 B Red Dwarf Companion)"
    }
  ],
  "caelum": [
    {
      "x": 48,
      "y": 52,
      "catalogStarId": "gamma-1-caeli",
      "name": "Gamma-1 Caeli (Gamma-1 Caeli Evolved Giant System)",
      "mag": 4.55,
      "locationDescription": "Gamma-1 Caeli Evolved Giant System"
    }
  ],
  "camelopardalis": [
    {
      "x": 52,
      "y": 52,
      "catalogStarId": "stein-2051-b",
      "name": "Stein 2051 B (Stein 2051 B (Gravitational Deflection White Dwarf))",
      "mag": 12.44,
      "locationDescription": "Stein 2051 B (Gravitational Deflection White Dwarf)"
    }
  ],
  "cancer": [
    {
      "x": 52,
      "y": 52,
      "catalogStarId": "dx-cancri",
      "name": "DX Cancri (DX Cancri High-Activity Flare Star)",
      "mag": 14.81,
      "locationDescription": "DX Cancri High-Activity Flare Star"
    }
  ],
  "canes-venatici": [
    {
      "x": 54,
      "y": 46,
      "catalogStarId": "la-superba",
      "name": "La Superba (La Superba (Y CVn / Deep Scarlet Carbon Star))",
      "mag": 5.4,
      "locationDescription": "La Superba (Y CVn / Deep Scarlet Carbon Star)"
    }
  ],
  "canis-major": [
    {
      "x": 64,
      "y": 32,
      "catalogStarId": "vy-canis-majoris",
      "name": "VY Canis Majoris (Red Hypergiant Sector (North of Sirius / Dog Torso))",
      "mag": 7.95,
      "locationDescription": "Red Hypergiant Sector (North of Sirius / Dog Torso)"
    },
    {
      "x": 45.2,
      "y": 35.8,
      "catalogStarId": "sirius-b",
      "name": "Sirius B (The Pup) (The Pup (0.13 ly from Sirius A / Dog Chest))",
      "mag": 8.44,
      "locationDescription": "The Pup (0.13 ly from Sirius A / Dog Chest)"
    },
    {
      "x": 36,
      "y": 84,
      "catalogStarId": "furud",
      "name": "Furud (Zeta Canis Majoris)",
      "mag": 3.02,
      "locationDescription": "Southern Paw of Canis Major • Zeta CMa"
    }
  ],
  "canis-minor": [
    {
      "x": 51.5,
      "y": 46.5,
      "catalogStarId": "procyon-b",
      "name": "Procyon B (Procyon B (White Dwarf Companion to Procyon A))",
      "mag": 10.92,
      "locationDescription": "Procyon B (White Dwarf Companion to Procyon A)"
    },
    {
      "x": 56,
      "y": 54,
      "catalogStarId": "luytens-star",
      "name": "Luyten’s Star (GJ 273) (GJ 273 (Luyten’s Star Multi-Planet Red Dwarf))",
      "mag": 9.87,
      "locationDescription": "GJ 273 (Luyten’s Star Multi-Planet Red Dwarf)"
    }
  ],
  "carina": [
    {
      "x": 44,
      "y": 56,
      "catalogStarId": "v602-carinae",
      "name": "V602 Carinae (Carina Nebula Outer Arm Supergiant)",
      "mag": 8.4,
      "locationDescription": "Carina Nebula Outer Arm Supergiant"
    },
    {
      "x": 48,
      "y": 62,
      "catalogStarId": "ck-carinae",
      "name": "CK Carinae (Carina Nebula Southern Cluster)",
      "mag": 7.8,
      "locationDescription": "Carina Nebula Southern Cluster"
    },
    {
      "x": 58,
      "y": 48,
      "catalogStarId": "eta-carinae-a",
      "name": "Eta Carinae A (Homunculus Nebula Core (NGC 3372 / Keel Heart))",
      "mag": 4.3,
      "locationDescription": "Homunculus Nebula Core (NGC 3372 / Keel Heart)"
    },
    {
      "x": 52,
      "y": 42,
      "catalogStarId": "ix-carinae",
      "name": "IX Carinae (Keel Center High-Luminosity Giant)",
      "mag": 7.6,
      "locationDescription": "Keel Center High-Luminosity Giant"
    },
    {
      "x": 62,
      "y": 54,
      "catalogStarId": "v382-carinae",
      "name": "V382 Carinae (x Carinae) (Yellow Supergiant Sector (Keel))",
      "mag": 3.93,
      "locationDescription": "Yellow Supergiant Sector (Keel)"
    },
    {
      "x": 50,
      "y": 46,
      "catalogStarId": "rt-carinae",
      "name": "RT Carinae (Homunculus Peripheral Supergiant)",
      "mag": 8.55,
      "locationDescription": "Homunculus Peripheral Supergiant"
    },
    {
      "x": 56,
      "y": 47,
      "catalogStarId": "hd-93129a",
      "name": "HD 93129A (Trumpler 14 Core (Extreme O2 Supergiant))",
      "mag": 7.31,
      "locationDescription": "Trumpler 14 Core (Extreme O2 Supergiant)"
    },
    {
      "x": 46,
      "y": 52,
      "catalogStarId": "ev-carinae",
      "name": "EV Carinae (Mid-Keel Red Supergiant)",
      "mag": 7.7,
      "locationDescription": "Mid-Keel Red Supergiant"
    },
    {
      "x": 64,
      "y": 44,
      "catalogStarId": "wr-30a",
      "name": "WR 30a (Carina Wolf-Rayet Massive Binary)",
      "mag": 14.7,
      "locationDescription": "Carina Wolf-Rayet Massive Binary"
    },
    {
      "x": 60,
      "y": 46,
      "catalogStarId": "wr-42e",
      "name": "WR 42e (Colliding Wind Binary (Keel))",
      "mag": 14.5,
      "locationDescription": "Colliding Wind Binary (Keel)"
    },
    {
      "x": 57,
      "y": 49,
      "catalogStarId": "wr-25",
      "name": "WR 25 (Trumpler 16 Central Monster (Keel))",
      "mag": 8.8,
      "locationDescription": "Trumpler 16 Central Monster (Keel)"
    },
    {
      "x": 48,
      "y": 48,
      "catalogStarId": "magnetar-1e-1048",
      "name": "1E 1048.1-5937 (Carina Magnetar)",
      "mag": 27.2,
      "locationDescription": "Keel Nebula Halo • Anomalous X-ray Pulsar Magnetar"
    }
  ],
  "cassiopeia": [
    {
      "x": 62,
      "y": 34,
      "catalogStarId": "pz-cassiopeiae",
      "name": "PZ Cassiopeiae (PZ Cassiopeiae Extreme Red Supergiant)",
      "mag": 8.75,
      "locationDescription": "PZ Cassiopeiae Extreme Red Supergiant"
    },
    {
      "x": 58,
      "y": 46,
      "catalogStarId": "rho-cassiopeiae",
      "name": "Rho Cassiopeiae (Rho Cassiopeiae Yellow Supergiant (Naked-Eye Rarity))",
      "mag": 4.5,
      "locationDescription": "Rho Cassiopeiae Yellow Supergiant (Naked-Eye Rarity)"
    },
    {
      "x": 36,
      "y": 42,
      "catalogStarId": "r-cassiopeiae",
      "name": "R Cassiopeiae (R Cassiopeiae Mira Variable Giant)",
      "mag": 5.8,
      "locationDescription": "R Cassiopeiae Mira Variable Giant"
    },
    {
      "x": 54,
      "y": 50,
      "catalogStarId": "v509-cassiopeiae",
      "name": "V509 Cassiopeiae (HR 8752) (HR 8752 Yellow Supergiant (Transitional Supergiant))",
      "mag": 5.1,
      "locationDescription": "HR 8752 Yellow Supergiant (Transitional Supergiant)"
    },
    {
      "x": 42,
      "y": 38,
      "catalogStarId": "wr-2",
      "name": "WR 2 (WR 2 Massive Stripped Helium Star)",
      "mag": 11.33,
      "locationDescription": "WR 2 Massive Stripped Helium Star"
    },
    {
      "x": 46,
      "y": 40,
      "catalogStarId": "kpd-0005-5106",
      "name": "KPD 0005+5106 (KPD 0005+5106 (Hottest Known White Dwarf at 200,000 K))",
      "mag": 13.3,
      "locationDescription": "KPD 0005+5106 (Hottest Known White Dwarf at 200,000 K)"
    },
    {
      "x": 22,
      "y": 25,
      "catalogStarId": "magnetar-1e-2259",
      "name": "1E 2259+586 (CTB 109 Magnetar)",
      "mag": 26.5,
      "locationDescription": "Queen's Throne Crown • CTB 109 Supernova Remnant Magnetar"
    }
  ],
  "centaurus": [
    {
      "x": 38,
      "y": 55,
      "catalogStarId": "v766-centauri",
      "name": "V766 Centauri (HR 5171 A) (Yellow Supergiant Sector (Northern Flank))",
      "mag": 6.2,
      "locationDescription": "Yellow Supergiant Sector (Northern Flank)"
    },
    {
      "x": 75.2,
      "y": 81.5,
      "catalogStarId": "alpha-centauri-b",
      "name": "Alpha Centauri B (Toliman) (Toliman (Alpha Centauri Binary / Southern Foot))",
      "mag": 1.33,
      "locationDescription": "Toliman (Alpha Centauri Binary / Southern Foot)"
    },
    {
      "x": 79,
      "y": 84.5,
      "catalogStarId": "proxima-centauri",
      "name": "Proxima Centauri (Proxima Orbit (2.18° SW of Alpha Centauri / Southern Foot))",
      "mag": 11.13,
      "locationDescription": "Proxima Orbit (2.18° SW of Alpha Centauri / Southern Foot)"
    },
    {
      "x": 44,
      "y": 40,
      "catalogStarId": "bpm-37093",
      "name": "BPM 37093 (\"Lucy\") (Crystallized Diamond Dwarf Core (Torso))",
      "mag": 14,
      "locationDescription": "Crystallized Diamond Dwarf Core (Torso)"
    }
  ],
  "cepheus": [
    {
      "x": 62,
      "y": 44,
      "catalogStarId": "v354-cephei",
      "name": "V354 Cephei (V354 Cephei Luminous Hypergiant)",
      "mag": 10.9,
      "locationDescription": "V354 Cephei Luminous Hypergiant"
    },
    {
      "x": 52,
      "y": 40,
      "catalogStarId": "st-cephei",
      "name": "ST Cephei (ST Cephei Red Supergiant (King’s Crown))",
      "mag": 7.4,
      "locationDescription": "ST Cephei Red Supergiant (King’s Crown)"
    },
    {
      "x": 48,
      "y": 42,
      "catalogStarId": "v419-cephei",
      "name": "V419 Cephei (V419 Cephei Massive Envelope Supergiant)",
      "mag": 6.6,
      "locationDescription": "V419 Cephei Massive Envelope Supergiant"
    },
    {
      "x": 44,
      "y": 38,
      "catalogStarId": "vv-cephei-a",
      "name": "VV Cephei A (VV Cephei A Eclipsing Hypergiant Monster)",
      "mag": 4.91,
      "locationDescription": "VV Cephei A Eclipsing Hypergiant Monster"
    },
    {
      "x": 56,
      "y": 32,
      "catalogStarId": "rw-cephei",
      "name": "RW Cephei (RW Cephei Pulsating Red Hypergiant)",
      "mag": 6.65,
      "locationDescription": "RW Cephei Pulsating Red Hypergiant"
    },
    {
      "x": 58,
      "y": 26,
      "catalogStarId": "t-cephei",
      "name": "T Cephei (T Cephei Long-Period Mira Giant (Crown Peak))",
      "mag": 5.2,
      "locationDescription": "T Cephei Long-Period Mira Giant (Crown Peak)"
    },
    {
      "x": 68,
      "y": 52,
      "catalogStarId": "kruger-60-a",
      "name": "Kruger 60 A (Kruger 60 Binary System Primary)",
      "mag": 9.85,
      "locationDescription": "Kruger 60 Binary System Primary"
    },
    {
      "x": 68.6,
      "y": 52.4,
      "catalogStarId": "kruger-60-b",
      "name": "Kruger 60 B (DO Cephei Flare Dwarf (Kruger 60 Companion))",
      "mag": 11.3,
      "locationDescription": "DO Cephei Flare Dwarf (Kruger 60 Companion)"
    },
    {
      "x": 46,
      "y": 34,
      "catalogStarId": "my-cephei",
      "name": "MY Cephei (MY Cephei Red Supergiant (NGC 7419 Cluster))",
      "mag": 14.4,
      "locationDescription": "MY Cephei Red Supergiant (NGC 7419 Cluster)"
    }
  ],
  "cetus": [
    {
      "x": 47.4,
      "y": 77.8,
      "catalogStarId": "luyten-726-8-a",
      "name": "Luyten 726-8 A (BL Ceti) (BL Ceti Binary System (Whale Tail))",
      "mag": 12.57,
      "locationDescription": "BL Ceti Binary System (Whale Tail)"
    },
    {
      "x": 48,
      "y": 78,
      "catalogStarId": "uv-ceti",
      "name": "UV Ceti (Luyten 726-8 B) (Luyten 726-8 Flare Prototype (Whale Tail))",
      "mag": 12.99,
      "locationDescription": "Luyten 726-8 Flare Prototype (Whale Tail)"
    },
    {
      "x": 62,
      "y": 66,
      "catalogStarId": "tau-ceti",
      "name": "Tau Ceti (Tau Ceti (Stable G-Type Solar Analogue / Whale Flank))",
      "mag": 3.49,
      "locationDescription": "Tau Ceti (Stable G-Type Solar Analogue / Whale Flank)"
    },
    {
      "x": 56,
      "y": 72,
      "catalogStarId": "lhs-1140",
      "name": "LHS 1140 (LHS 1140 Rocky Super-Earth Host (Whale Body))",
      "mag": 14.18,
      "locationDescription": "LHS 1140 Rocky Super-Earth Host (Whale Body)"
    }
  ],
  "circinus": [
    {
      "x": 52,
      "y": 52,
      "catalogStarId": "psr-b1509-58",
      "name": "PSR B1509-58 (Hand of God) (Hand of God Pulsar (PSR B1509-58 Wind Nebula))",
      "mag": 24,
      "locationDescription": "Hand of God Pulsar (PSR B1509-58 Wind Nebula)"
    }
  ],
  "corona-australis": [
    {
      "x": 52,
      "y": 52,
      "catalogStarId": "rx-j1856-3754",
      "name": "RX J1856.3-3754 (The Magnificent Seven Isolated Thermal Neutron Star)",
      "mag": 25.6,
      "locationDescription": "The Magnificent Seven Isolated Thermal Neutron Star"
    }
  ],
  "cygnus": [
    {
      "x": 44,
      "y": 26,
      "catalogStarId": "nml-cygni",
      "name": "NML Cygni (Cygnus OB2 Association (North of Sadr))",
      "mag": 16.6,
      "locationDescription": "Cygnus OB2 Association (North of Sadr)"
    },
    {
      "x": 46,
      "y": 28,
      "catalogStarId": "ky-cygni",
      "name": "KY Cygni (Northern Cross Luminous Supergiant Cloud)",
      "mag": 11.1,
      "locationDescription": "Northern Cross Luminous Supergiant Cloud"
    },
    {
      "x": 43,
      "y": 32,
      "catalogStarId": "bi-cygni",
      "name": "BI Cygni (Cygnus OB1 Red Supergiant)",
      "mag": 9.9,
      "locationDescription": "Cygnus OB1 Red Supergiant"
    },
    {
      "x": 45,
      "y": 30,
      "catalogStarId": "bc-cygni",
      "name": "BC Cygni (Cygnus OB1 Association Member)",
      "mag": 9.97,
      "locationDescription": "Cygnus OB1 Association Member"
    },
    {
      "x": 42,
      "y": 34,
      "catalogStarId": "rw-cygni",
      "name": "RW Cygni (Evolved Red Supergiant (Northern Cross))",
      "mag": 8.8,
      "locationDescription": "Evolved Red Supergiant (Northern Cross)"
    },
    {
      "x": 49,
      "y": 72,
      "catalogStarId": "chi-cygni",
      "name": "Chi Cygni (Mira Variable Spine (Near Albireo / Swan Neck))",
      "mag": 5.2,
      "locationDescription": "Mira Variable Spine (Near Albireo / Swan Neck)"
    },
    {
      "x": 45,
      "y": 27,
      "catalogStarId": "cygnus-ob2-12",
      "name": "Cygnus OB2-12 (Cygnus OB2 Cluster (Extreme Blue Supergiant))",
      "mag": 11.4,
      "locationDescription": "Cygnus OB2 Cluster (Extreme Blue Supergiant)"
    },
    {
      "x": 48,
      "y": 62,
      "catalogStarId": "hde-226868",
      "name": "HDE 226868 (Cygnus X-1 Donor) (Cygnus X-1 Accretion System (Near Eta Cygni / Neck))",
      "mag": 8.95,
      "locationDescription": "Cygnus X-1 Accretion System (Near Eta Cygni / Neck)"
    },
    {
      "x": 32,
      "y": 52,
      "catalogStarId": "kepler-186",
      "name": "Kepler-186 (Kepler Exoplanet Field (Earth-Sized Habitable Host))",
      "mag": 14.62,
      "locationDescription": "Kepler Exoplanet Field (Earth-Sized Habitable Host)"
    },
    {
      "x": 34,
      "y": 50,
      "catalogStarId": "kepler-452",
      "name": "Kepler-452 (Kepler Exoplanet Field (Earth 2.0 Host))",
      "mag": 13.37,
      "locationDescription": "Kepler Exoplanet Field (Earth 2.0 Host)"
    },
    {
      "x": 37,
      "y": 44,
      "catalogStarId": "61-cygni-a",
      "name": "61 Cygni A (Bessel’s Star) (Bessel’s Flying Star System (Near Eastern Wing))",
      "mag": 5.21,
      "locationDescription": "Bessel’s Flying Star System (Near Eastern Wing)"
    },
    {
      "x": 37.8,
      "y": 44.5,
      "catalogStarId": "61-cygni-b",
      "name": "61 Cygni B (Bessel’s Flying Star Binary B (Near Eastern Wing))",
      "mag": 6.03,
      "locationDescription": "Bessel’s Flying Star Binary B (Near Eastern Wing)"
    },
    {
      "x": 30,
      "y": 56,
      "catalogStarId": "kepler-22",
      "name": "Kepler-22 (Kepler Exoplanet Field (Water World Candidate Host))",
      "mag": 11.66,
      "locationDescription": "Kepler Exoplanet Field (Water World Candidate Host)"
    },
    {
      "x": 31,
      "y": 54,
      "catalogStarId": "kepler-11",
      "name": "Kepler-11 (Kepler Multi-Planet Coplanar System)",
      "mag": 13.7,
      "locationDescription": "Kepler Multi-Planet Coplanar System"
    },
    {
      "x": 41,
      "y": 38,
      "catalogStarId": "wr-142",
      "name": "WR 142 (WO-Class Wolf-Rayet Stripped Core)",
      "mag": 13,
      "locationDescription": "WO-Class Wolf-Rayet Stripped Core"
    },
    {
      "x": 53,
      "y": 52,
      "catalogStarId": "wr-136",
      "name": "WR 136 (Crescent Nebula Central Star (NGC 6888))",
      "mag": 7.5,
      "locationDescription": "Crescent Nebula Central Star (NGC 6888)"
    },
    {
      "x": 39,
      "y": 36,
      "catalogStarId": "boyajians-star",
      "name": "Boyajian's Star (Tabby's Star) (Tabby’s Star (Anomalous Light Curve / Near Delta Cyg))",
      "mag": 11.7,
      "locationDescription": "Tabby’s Star (Anomalous Light Curve / Near Delta Cyg)"
    },
    {
      "x": 46,
      "y": 44,
      "catalogStarId": "p-cygni",
      "name": "P Cygni (The Permanent Nova)",
      "mag": 4.82,
      "locationDescription": "Swan's Chest / Heart • Luminous Blue Variable Hypergiant"
    }
  ],
  "dorado": [
    {
      "x": 42,
      "y": 48,
      "catalogStarId": "woh-g64",
      "name": "WOH G64 (WOH G64 Red Hypergiant (Large Magellanic Cloud))",
      "mag": 18,
      "locationDescription": "WOH G64 Red Hypergiant (Large Magellanic Cloud)"
    },
    {
      "x": 54,
      "y": 46,
      "catalogStarId": "s-doradus",
      "name": "S Doradus (S Doradus Prototype Luminous Blue Variable (LMC))",
      "mag": 8.6,
      "locationDescription": "S Doradus Prototype Luminous Blue Variable (LMC)"
    },
    {
      "x": 48,
      "y": 52,
      "catalogStarId": "r136a1",
      "name": "R136a1 (Tarantula Nebula (R136 Super Star Cluster / LMC))",
      "mag": 12.23,
      "locationDescription": "Tarantula Nebula (R136 Super Star Cluster / LMC)"
    },
    {
      "x": 40,
      "y": 46,
      "catalogStarId": "woh-s70",
      "name": "WOH S70 (Large Magellanic Cloud Evolved Hypergiant)",
      "mag": 14.8,
      "locationDescription": "Large Magellanic Cloud Evolved Hypergiant"
    },
    {
      "x": 56,
      "y": 66,
      "catalogStarId": "r-doradus",
      "name": "R Doradus (R Doradus (Largest Apparent Diameter Star in Sky))",
      "mag": 5.4,
      "locationDescription": "R Doradus (Largest Apparent Diameter Star in Sky)"
    },
    {
      "x": 44,
      "y": 54,
      "catalogStarId": "vfts-352",
      "name": "VFTS 352 (Conjoined \"Kissing\" Binary) (VFTS 352 (Kissing Contact Binary / LMC))",
      "mag": 14.5,
      "locationDescription": "VFTS 352 (Kissing Contact Binary / LMC)"
    },
    {
      "x": 46.5,
      "y": 53.5,
      "catalogStarId": "melnick-42",
      "name": "Melnick 42 (Tarantula Nebula Outlier Monster (LMC))",
      "mag": 12.78,
      "locationDescription": "Tarantula Nebula Outlier Monster (LMC)"
    },
    {
      "x": 45,
      "y": 50,
      "catalogStarId": "vfts-682",
      "name": "VFTS 682 (VFTS 682 Isolated Runaway Monster (LMC))",
      "mag": 16.08,
      "locationDescription": "VFTS 682 Isolated Runaway Monster (LMC)"
    },
    {
      "x": 41,
      "y": 50,
      "catalogStarId": "iras-05280-6910",
      "name": "IRAS 05280-6910 (IRAS 05280-6910 Giant Red Envelope (LMC))",
      "mag": 13.5,
      "locationDescription": "IRAS 05280-6910 Giant Red Envelope (LMC)"
    },
    {
      "x": 47,
      "y": 55,
      "catalogStarId": "sanduleak-2-73",
      "name": "Sanduleak 2-73 (Sanduleak 2-73 Hypergiant Sector (LMC))",
      "mag": 15.2,
      "locationDescription": "Sanduleak 2-73 Hypergiant Sector (LMC)"
    },
    {
      "x": 49,
      "y": 53,
      "catalogStarId": "bat99-98",
      "name": "BAT99-98 (BAT99-98 High-Mass Monster (LMC))",
      "mag": 13.7,
      "locationDescription": "BAT99-98 High-Mass Monster (LMC)"
    },
    {
      "x": 48.6,
      "y": 51.8,
      "catalogStarId": "r136a2",
      "name": "R136a2 (R136 Monster Cluster Member (LMC))",
      "mag": 12.8,
      "locationDescription": "R136 Monster Cluster Member (LMC)"
    },
    {
      "x": 47.6,
      "y": 52.2,
      "catalogStarId": "r136a3",
      "name": "R136a3 (R136 Massive Core Component (LMC))",
      "mag": 13,
      "locationDescription": "R136 Massive Core Component (LMC)"
    },
    {
      "x": 49.2,
      "y": 52.5,
      "catalogStarId": "r136c",
      "name": "R136c (R136 Luminous Wolf-Rayet Boundary)",
      "mag": 13.4,
      "locationDescription": "R136 Luminous Wolf-Rayet Boundary"
    },
    {
      "x": 50,
      "y": 45,
      "catalogStarId": "hd-269810",
      "name": "HD 269810 (HD 269810 Extreme O2 Dwarf (LMC))",
      "mag": 12.3,
      "locationDescription": "HD 269810 Extreme O2 Dwarf (LMC)"
    }
  ],
  "draco": [
    {
      "x": 42,
      "y": 34,
      "catalogStarId": "gliese-687",
      "name": "Gliese 687 (Gliese 687 Red Dwarf System (Dragon Body Arc))",
      "mag": 9.15,
      "locationDescription": "Gliese 687 Red Dwarf System (Dragon Body Arc)"
    },
    {
      "x": 56,
      "y": 46,
      "catalogStarId": "cats-eye-central",
      "name": "Cat’s Eye Central Star (Cat’s Eye Nebula (NGC 6543) Central White Dwarf)",
      "mag": 11.1,
      "locationDescription": "Cat’s Eye Nebula (NGC 6543) Central White Dwarf"
    },
    {
      "x": 62,
      "y": 58,
      "catalogStarId": "wd-1856-534",
      "name": "WD 1856+534 (WD 1856+534 Jovian Planet Host White Dwarf)",
      "mag": 15.8,
      "locationDescription": "WD 1856+534 Jovian Planet Host White Dwarf"
    }
  ],
  "eridanus": [
    {
      "x": 48,
      "y": 44,
      "catalogStarId": "epsilon-eridani",
      "name": "Epsilon Eridani (Ran) (Ran (Epsilon Eridani / Nearest Sun-Like Exoplanet Host))",
      "mag": 3.73,
      "locationDescription": "Ran (Epsilon Eridani / Nearest Sun-Like Exoplanet Host)"
    },
    {
      "x": 54,
      "y": 58,
      "catalogStarId": "40-eridani-b",
      "name": "40 Eridani B (Keid B) (Keid B (First Discovered White Dwarf in 1783))",
      "mag": 9.52,
      "locationDescription": "Keid B (First Discovered White Dwarf in 1783)"
    }
  ],
  "gemini": [
    {
      "x": 38,
      "y": 38,
      "catalogStarId": "tv-geminorum",
      "name": "TV Geminorum (Castor Foot Red Supergiant)",
      "mag": 6.6,
      "locationDescription": "Castor Foot Red Supergiant"
    },
    {
      "x": 42,
      "y": 42,
      "catalogStarId": "bu-geminorum",
      "name": "BU Geminorum (Gemini Torso Evolved Supergiant)",
      "mag": 6.9,
      "locationDescription": "Gemini Torso Evolved Supergiant"
    },
    {
      "x": 34,
      "y": 64,
      "catalogStarId": "geminga",
      "name": "Geminga (PSR J0633+1746) (Geminga (PSR J0633+1746 Optical-Silent Gamma Pulsar))",
      "mag": 25.5,
      "locationDescription": "Geminga (PSR J0633+1746 Optical-Silent Gamma Pulsar)"
    },
    {
      "x": 68.5,
      "y": 17.5,
      "catalogStarId": "castor-c",
      "name": "Castor C (YY Geminorum) (YY Geminorum (Eclipsing Flare Dwarf of Castor Sextuple))",
      "mag": 9.07,
      "locationDescription": "YY Geminorum (Eclipsing Flare Dwarf of Castor Sextuple)"
    },
    {
      "x": 54,
      "y": 36,
      "catalogStarId": "ngc-2371-central",
      "name": "NGC 2371-2 Central Star (Double Nebula (NGC 2371-2) Ultra-Hot White Dwarf)",
      "mag": 14.8,
      "locationDescription": "Double Nebula (NGC 2371-2) Ultra-Hot White Dwarf"
    },
    {
      "x": 30,
      "y": 76,
      "catalogStarId": "psr-b0656-14",
      "name": "PSR B0656+14 (Monogem Ring Pulsar)",
      "mag": 24.8,
      "locationDescription": "Twins' Feet Relic • Cooling Middle-Aged Neutron Star"
    }
  ],
  "grus": [
    {
      "x": 48,
      "y": 44,
      "catalogStarId": "pi1-gruis",
      "name": "Pi1 Gruis (Pi1 Gruis (Convective Giant with Giant Granulation Cells))",
      "mag": 6.1,
      "locationDescription": "Pi1 Gruis (Convective Giant with Giant Granulation Cells)"
    }
  ],
  "hercules": [
    {
      "x": 52,
      "y": 46,
      "catalogStarId": "gd-358",
      "name": "GD 358 (V777 Herculis) (V777 Herculis (Prototype Pulsating DB White Dwarf))",
      "mag": 13.65,
      "locationDescription": "V777 Herculis (Prototype Pulsating DB White Dwarf)"
    }
  ],
  "horologium": [
    {
      "x": 52,
      "y": 58,
      "catalogStarId": "gj-1061",
      "name": "GJ 1061 (GJ 1061 Multi-Planet Red Dwarf System)",
      "mag": 13.07,
      "locationDescription": "GJ 1061 Multi-Planet Red Dwarf System"
    }
  ],
  "hydra": [
    {
      "x": 52,
      "y": 58,
      "catalogStarId": "w-hydrae",
      "name": "W Hydrae (W Hydrae Asymptotic Giant Branch Star with Water Ring)",
      "mag": 5.6,
      "locationDescription": "W Hydrae Asymptotic Giant Branch Star with Water Ring"
    },
    {
      "x": 46,
      "y": 64,
      "catalogStarId": "v-hydrae",
      "name": "V Hydrae (V Hydrae (Death Spiral Carbon Star Ejecting Plasma Bullets))",
      "mag": 6.8,
      "locationDescription": "V Hydrae (Death Spiral Carbon Star Ejecting Plasma Bullets)"
    },
    {
      "x": 48,
      "y": 68,
      "catalogStarId": "wise-0855-0714",
      "name": "WISE 0855-0714 (Ice Dwarf) (WISE 0855-0714 (Coldest Sub-Zero Water Cloud Brown Dwarf))",
      "mag": 25,
      "locationDescription": "WISE 0855-0714 (Coldest Sub-Zero Water Cloud Brown Dwarf)"
    }
  ],
  "hydrus": [
    {
      "x": 48,
      "y": 54,
      "catalogStarId": "hd-10180",
      "name": "HD 10180 (HD 10180 (Dense Seven-Exoplanet Solar Analogue))",
      "mag": 7.33,
      "locationDescription": "HD 10180 (Dense Seven-Exoplanet Solar Analogue)"
    }
  ],
  "leo": [
    {
      "x": 42,
      "y": 56,
      "catalogStarId": "cw-leonis",
      "name": "CW Leonis (IRC +10216 Carbon Soot Cocoon (Leo Head))",
      "mag": 11,
      "locationDescription": "IRC +10216 Carbon Soot Cocoon (Leo Head)"
    },
    {
      "x": 58,
      "y": 72,
      "catalogStarId": "wolf-359",
      "name": "Wolf 359 (CN Leonis) (Wolf 359 (CN Leonis / Hind Leg Sector))",
      "mag": 13.54,
      "locationDescription": "Wolf 359 (CN Leonis / Hind Leg Sector)"
    },
    {
      "x": 46,
      "y": 54,
      "catalogStarId": "al-jabbah",
      "name": "Al Jabbah (Eta Leonis)",
      "mag": 3.48,
      "locationDescription": "Lion's Mane / Forehead (Eta Leonis) • Supergiant"
    },
    {
      "x": 36,
      "y": 32,
      "catalogStarId": "rasalas",
      "name": "Rasalas (Mu Leonis)",
      "mag": 3.88,
      "locationDescription": "Lion's Brow (Mu Leonis) • Orange Giant"
    },
    {
      "x": 58,
      "y": 62,
      "catalogStarId": "psr-b0950-08",
      "name": "PSR B0950+08 (Bright Leo Pulsar)",
      "mag": 25.5,
      "locationDescription": "Lion's Flank • Canonical Radio Pulsar"
    }
  ],
  "lepus": [
    {
      "x": 48,
      "y": 62,
      "catalogStarId": "r-leporis",
      "name": "R Leporis (Hind’s Crimson Star (Deepest Red Carbon Star))",
      "mag": 5.5,
      "locationDescription": "Hind’s Crimson Star (Deepest Red Carbon Star)"
    },
    {
      "x": 56,
      "y": 52,
      "catalogStarId": "gliese-229-b",
      "name": "Gliese 229 B (Gliese 229 B (First Confirmed Methane T-Dwarf in 1995))",
      "mag": 14.3,
      "locationDescription": "Gliese 229 B (First Confirmed Methane T-Dwarf in 1995)"
    }
  ],
  "libra": [
    {
      "x": 44,
      "y": 66,
      "catalogStarId": "gliese-581",
      "name": "Gliese 581 (HO Librae) (Gliese 581 Famous Multi-Planet Red Dwarf)",
      "mag": 10.57,
      "locationDescription": "Gliese 581 Famous Multi-Planet Red Dwarf"
    },
    {
      "x": 48,
      "y": 72,
      "catalogStarId": "wise-1541-2250",
      "name": "WISE 1541-2250 (WISE 1541-2250 Ultra-Cold Y-Dwarf)",
      "mag": 21.5,
      "locationDescription": "WISE 1541-2250 Ultra-Cold Y-Dwarf"
    },
    {
      "x": 52,
      "y": 42,
      "catalogStarId": "methuselah-star",
      "name": "Methuselah Star (HD 140283) (HD 140283 (Methuselah Star / ~13.7 Billion Years Old))",
      "mag": 7.22,
      "locationDescription": "HD 140283 (Methuselah Star / ~13.7 Billion Years Old)"
    }
  ],
  "microscopium": [
    {
      "x": 48,
      "y": 52,
      "catalogStarId": "lacaille-8760",
      "name": "Lacaille 8760 (AX Microscopii (Brightest M-Dwarf in the Night Sky))",
      "mag": 6.67,
      "locationDescription": "AX Microscopii (Brightest M-Dwarf in the Night Sky)"
    }
  ],
  "monoceros": [
    {
      "x": 46,
      "y": 54,
      "catalogStarId": "v838-monocerotis",
      "name": "V838 Monocerotis (Luminous Red Nova) (V838 Monocerotis (Luminous Red Nova Light Echo Star))",
      "mag": 15.5,
      "locationDescription": "V838 Monocerotis (Luminous Red Nova Light Echo Star)"
    },
    {
      "x": 54,
      "y": 42,
      "catalogStarId": "plasketts-star",
      "name": "Plaskett’s Star A (HD 47129 A) (Plaskett’s Star (One of Most Massive Known Binaries))",
      "mag": 6.06,
      "locationDescription": "Plaskett’s Star (One of Most Massive Known Binaries)"
    },
    {
      "x": 58,
      "y": 62,
      "catalogStarId": "ross-614-a",
      "name": "Ross 614 A (Ross 614 Binary Red Dwarf Primary)",
      "mag": 11.15,
      "locationDescription": "Ross 614 Binary Red Dwarf Primary"
    },
    {
      "x": 58.6,
      "y": 62.4,
      "catalogStarId": "ross-614-b",
      "name": "Ross 614 B (Ross 614 B Ultra-Low Mass Companion)",
      "mag": 14.23,
      "locationDescription": "Ross 614 B Ultra-Low Mass Companion"
    }
  ],
  "norma": [
    {
      "x": 52,
      "y": 52,
      "catalogStarId": "hd-143183",
      "name": "HD 143183 (HD 143183 Massive Evolved Supergiant)",
      "mag": 7.45,
      "locationDescription": "HD 143183 Massive Evolved Supergiant"
    }
  ],
  "ophiuchus": [
    {
      "x": 48,
      "y": 26,
      "catalogStarId": "barnards-star",
      "name": "Barnard’s Star (Barnard’s Star (High Proper Motion / Northern Torso))",
      "mag": 9.51,
      "locationDescription": "Barnard’s Star (High Proper Motion / Northern Torso)"
    },
    {
      "x": 36,
      "y": 68,
      "catalogStarId": "wolf-1061",
      "name": "Wolf 1061 (GJ 628) (Wolf 1061 Habitable Zone Red Dwarf (Southern Foot))",
      "mag": 10.1,
      "locationDescription": "Wolf 1061 Habitable Zone Red Dwarf (Southern Foot)"
    },
    {
      "x": 58,
      "y": 54,
      "catalogStarId": "gj-1214",
      "name": "GJ 1214 (GJ 1214 Ocean World Host (Serpent Holder Torso))",
      "mag": 14.71,
      "locationDescription": "GJ 1214 Ocean World Host (Serpent Holder Torso)"
    }
  ],
  "orion": [
    {
      "x": 49.5,
      "y": 61,
      "catalogStarId": "theta1-orionis-c",
      "name": "Theta-1 Orionis C (Trapezium Cluster Core (M42 / Sword Center))",
      "mag": 5.13,
      "locationDescription": "Trapezium Cluster Core (M42 / Sword Center)"
    },
    {
      "x": 50,
      "y": 62,
      "catalogStarId": "hatysa",
      "name": "Hatysa (Iota Orionis)",
      "mag": 2.77,
      "locationDescription": "Orion's Sword Tip (Iota Orionis / Nair al Saif)"
    }
  ],
  "pavo": [
    {
      "x": 52,
      "y": 52,
      "catalogStarId": "scr-1845-6357-a",
      "name": "SCR 1845-6357 A (SCR 1845-6357 A Flare Red Dwarf)",
      "mag": 17.4,
      "locationDescription": "SCR 1845-6357 A Flare Red Dwarf"
    },
    {
      "x": 52.8,
      "y": 52.4,
      "catalogStarId": "scr-1845-6357-b",
      "name": "SCR 1845-6357 B (SCR 1845-6357 B T-Dwarf Companion)",
      "mag": 18.2,
      "locationDescription": "SCR 1845-6357 B T-Dwarf Companion"
    }
  ],
  "pegasus": [
    {
      "x": 44,
      "y": 42,
      "catalogStarId": "51-pegasi",
      "name": "51 Pegasi (Helvetios) (51 Pegasi (Helvetios / First Exoplanet Around Sun-Like Star))",
      "mag": 5.49,
      "locationDescription": "51 Pegasi (Helvetios / First Exoplanet Around Sun-Like Star)"
    }
  ],
  "perseus": [
    {
      "x": 62,
      "y": 32,
      "catalogStarId": "su-persei",
      "name": "SU Persei (Double Cluster (NGC 869/884) Supergiant Periphery)",
      "mag": 7.7,
      "locationDescription": "Double Cluster (NGC 869/884) Supergiant Periphery"
    },
    {
      "x": 60,
      "y": 34,
      "catalogStarId": "rs-persei",
      "name": "RS Persei (Double Cluster Red Supergiant)",
      "mag": 7.8,
      "locationDescription": "Double Cluster Red Supergiant"
    },
    {
      "x": 64,
      "y": 30,
      "catalogStarId": "s-persei",
      "name": "S Persei (Double Cluster Red Hypergiant)",
      "mag": 8.5,
      "locationDescription": "Double Cluster Red Hypergiant"
    },
    {
      "x": 49.5,
      "y": 58.5,
      "catalogStarId": "algol-b",
      "name": "Algol B (Beta Persei Aa2) (Algol B (Subgiant Companion to the Demon Star))",
      "mag": 5.4,
      "locationDescription": "Algol B (Subgiant Companion to the Demon Star)"
    },
    {
      "x": 54,
      "y": 24,
      "catalogStarId": "miram",
      "name": "Miram (Eta Persei)",
      "mag": 3.76,
      "locationDescription": "Hero's Northern Armor (Eta Persei) • Perseus OB3 Supergiant"
    },
    {
      "x": 34,
      "y": 64,
      "catalogStarId": "gorgonea-tertia",
      "name": "Gorgonea Tertia (Rho Persei)",
      "mag": 3.39,
      "locationDescription": "Medusa's Hair / Hand (Rho Persei) • Semiregular Red Giant"
    }
  ],
  "pictor": [
    {
      "x": 46,
      "y": 56,
      "catalogStarId": "eblm-j0555-57ab",
      "name": "EBLM J0555-57Ab (EBLM J0555-57Ab (Smallest Known Normal Fusion Star))",
      "mag": 17.5,
      "locationDescription": "EBLM J0555-57Ab (Smallest Known Normal Fusion Star)"
    },
    {
      "x": 54,
      "y": 64,
      "catalogStarId": "kapteyns-star",
      "name": "Kapteyn’s Star (Kapteyn’s Star (Galactic Halo High-Velocity Red Dwarf))",
      "mag": 8.86,
      "locationDescription": "Kapteyn’s Star (Galactic Halo High-Velocity Red Dwarf)"
    }
  ],
  "pisces": [
    {
      "x": 52,
      "y": 48,
      "catalogStarId": "tx-piscium",
      "name": "TX Piscium (19 Piscium (Deep Ruby Carbon Star on Ecliptic))",
      "mag": 5,
      "locationDescription": "19 Piscium (Deep Ruby Carbon Star on Ecliptic)"
    },
    {
      "x": 46,
      "y": 56,
      "catalogStarId": "van-maanens-star",
      "name": "Van Maanen’s Star (Van Maanen 2 (Nearest Isolated White Dwarf to Earth))",
      "mag": 12.37,
      "locationDescription": "Van Maanen 2 (Nearest Isolated White Dwarf to Earth)"
    }
  ],
  "piscis-austrinus": [
    {
      "x": 52,
      "y": 54,
      "catalogStarId": "lacaille-9352",
      "name": "Lacaille 9352 (Lacaille 9352 (High-Velocity Multi-Planet Red Dwarf))",
      "mag": 7.34,
      "locationDescription": "Lacaille 9352 (High-Velocity Multi-Planet Red Dwarf)"
    }
  ],
  "reticulum": [
    {
      "x": 46,
      "y": 54,
      "catalogStarId": "zeta-1-reticuli",
      "name": "Zeta-1 Reticuli (Zeta-1 Reticuli Twin Solar Analogue)",
      "mag": 5.54,
      "locationDescription": "Zeta-1 Reticuli Twin Solar Analogue"
    },
    {
      "x": 48,
      "y": 56,
      "catalogStarId": "zeta-2-reticuli",
      "name": "Zeta-2 Reticuli (Zeta-2 Reticuli Exoplanetary Debris Disk Host)",
      "mag": 5.24,
      "locationDescription": "Zeta-2 Reticuli Exoplanetary Debris Disk Host"
    },
    {
      "x": 52,
      "y": 62,
      "catalogStarId": "wise-0350-5658",
      "name": "WISE 0350-5658 (WISE 0350-5658 Room-Temperature Y-Dwarf)",
      "mag": 22,
      "locationDescription": "WISE 0350-5658 Room-Temperature Y-Dwarf"
    }
  ],
  "sagittarius": [
    {
      "x": 38,
      "y": 48,
      "catalogStarId": "kw-sagittarii",
      "name": "KW Sagittarii (Teapot Lid Supergiant Sector)",
      "mag": 8.8,
      "locationDescription": "Teapot Lid Supergiant Sector"
    },
    {
      "x": 21,
      "y": 59,
      "catalogStarId": "gcirs-7",
      "name": "GCIRS 7 (Sagittarius A* Orbital Perimeter Core)",
      "mag": 16.5,
      "locationDescription": "Sagittarius A* Orbital Perimeter Core"
    },
    {
      "x": 22,
      "y": 60,
      "catalogStarId": "pistol-star",
      "name": "Pistol Star (Quintuplet Cluster / Galactic Center Core (Western Edge))",
      "mag": 28,
      "locationDescription": "Quintuplet Cluster / Galactic Center Core (Western Edge)"
    },
    {
      "x": 62,
      "y": 72,
      "catalogStarId": "ross-154",
      "name": "Ross 154 (V1216 Sgr) (Teapot Base Flare Dwarf)",
      "mag": 10.44,
      "locationDescription": "Teapot Base Flare Dwarf"
    },
    {
      "x": 28,
      "y": 56,
      "catalogStarId": "psr-j1748-2446ad",
      "name": "PSR J1748-2446ad (Fastest Pulsar) (Terzan 5 Globular Cluster (Fastest Pulsar))",
      "mag": 24,
      "locationDescription": "Terzan 5 Globular Cluster (Fastest Pulsar)"
    },
    {
      "x": 18,
      "y": 68,
      "catalogStarId": "sgr-1806-20",
      "name": "SGR 1806-20 (Ultra-Magnetar) (Galactic Core Ultra-Magnetar)",
      "mag": 26.5,
      "locationDescription": "Galactic Core Ultra-Magnetar"
    },
    {
      "x": 20,
      "y": 64,
      "catalogStarId": "wr-102",
      "name": "WR 102 (Extreme Oxygen-Sequence Wolf-Rayet)",
      "mag": 14.1,
      "locationDescription": "Extreme Oxygen-Sequence Wolf-Rayet"
    },
    {
      "x": 34,
      "y": 52,
      "catalogStarId": "vx-sagittarii",
      "name": "VX Sagittarii (Pulsating Supergiant Core)",
      "mag": 8,
      "locationDescription": "Pulsating Supergiant Core"
    },
    {
      "x": 23,
      "y": 65,
      "catalogStarId": "wr-93b",
      "name": "WR 93b (Galactic Bar Wolf-Rayet Core)",
      "mag": 17.5,
      "locationDescription": "Galactic Bar Wolf-Rayet Core"
    },
    {
      "x": 24,
      "y": 62,
      "catalogStarId": "peony-star",
      "name": "Peony Star (Galactic Center Luminous Giant Core)",
      "mag": 17.5,
      "locationDescription": "Galactic Center Luminous Giant Core"
    },
    {
      "x": 35,
      "y": 30,
      "catalogStarId": "polis-sagittarii",
      "name": "Polis (Mu Sagittarii)",
      "mag": 3.84,
      "locationDescription": "Upper Bow / Mantle (Mu Sagittarii) • Multiple Supergiant"
    },
    {
      "x": 32,
      "y": 40,
      "catalogStarId": "swift-j1818-1607",
      "name": "Swift J1818.0-1607 (Youngest Fast Magnetar)",
      "mag": 27.5,
      "locationDescription": "Teapot Steam • Youngest Fast-Spinning Magnetar (PSR J1818-1607)"
    }
  ],
  "scorpius": [
    {
      "x": 44,
      "y": 64,
      "catalogStarId": "ah-scorpii",
      "name": "AH Scorpii (AH Scorpii Extreme Red Supergiant)",
      "mag": 8.1,
      "locationDescription": "AH Scorpii Extreme Red Supergiant"
    },
    {
      "x": 52,
      "y": 72,
      "catalogStarId": "gliese-667-c",
      "name": "Gliese 667 C (Gliese 667 C Triple System Habitable Zone Host)",
      "mag": 10.22,
      "locationDescription": "Gliese 667 C Triple System Habitable Zone Host"
    },
    {
      "x": 51.4,
      "y": 71.6,
      "catalogStarId": "gliese-667-a",
      "name": "Gliese 667 A (Gliese 667 A Primary K-Dwarf)",
      "mag": 5.89,
      "locationDescription": "Gliese 667 A Primary K-Dwarf"
    },
    {
      "x": 51.8,
      "y": 72.2,
      "catalogStarId": "gliese-667-b",
      "name": "Gliese 667 B (Gliese 667 B Companion K-Dwarf)",
      "mag": 7.2,
      "locationDescription": "Gliese 667 B Companion K-Dwarf"
    },
    {
      "x": 38,
      "y": 40,
      "catalogStarId": "alniyat",
      "name": "Alniyat (Sigma Scorpii)",
      "mag": 2.89,
      "locationDescription": "Heart Flank (Sigma Scorpii) • Framing Antares"
    },
    {
      "x": 22,
      "y": 28,
      "catalogStarId": "fang",
      "name": "Fang (Pi Scorpii)",
      "mag": 2.89,
      "locationDescription": "Scorpion Head Claw (Pi Scorpii) • Triple Star"
    },
    {
      "x": 54,
      "y": 66,
      "catalogStarId": "xamidimura",
      "name": "Xamidimura (Mu-1 Scorpii)",
      "mag": 3.04,
      "locationDescription": "Scorpion Tail Joint • Mu-1 Scorpii on Brazilian Flag"
    },
    {
      "x": 58,
      "y": 76,
      "catalogStarId": "girtab",
      "name": "Girtab (Kappa Scorpii)",
      "mag": 2.41,
      "locationDescription": "Stinger Base • Kappa Scorpii on Brazilian Flag"
    },
    {
      "x": 64,
      "y": 84,
      "catalogStarId": "iota-1-scorpii",
      "name": "Apollyon (Iota-1 Scorpii)",
      "mag": 3.03,
      "locationDescription": "Scorpion Tail Stinger Joint • Apollyon on Brazilian Flag"
    }
  ],
  "sculptor": [
    {
      "x": 48,
      "y": 52,
      "catalogStarId": "gliese-1",
      "name": "Gliese 1 (Gliese 1 (First Entry in Gliese Catalog of Nearby Stars))",
      "mag": 8.55,
      "locationDescription": "Gliese 1 (First Entry in Gliese Catalog of Nearby Stars)"
    }
  ],
  "scutum": [
    {
      "x": 53,
      "y": 62,
      "catalogStarId": "stephenson-2-18",
      "name": "Stephenson 2-18 (Stephenson 2 Open Cluster Core (Central Shield Cloud))",
      "mag": 15.2,
      "locationDescription": "Stephenson 2 Open Cluster Core (Central Shield Cloud)"
    },
    {
      "x": 47,
      "y": 32,
      "catalogStarId": "uy-scuti",
      "name": "UY Scuti (Northern Shield Hypergiant Core)",
      "mag": 9,
      "locationDescription": "Northern Shield Hypergiant Core"
    },
    {
      "x": 56,
      "y": 44,
      "catalogStarId": "irc-minus-10414",
      "name": "IRC -10414 (Mid-Shield Evolved Supergiant)",
      "mag": 12,
      "locationDescription": "Mid-Shield Evolved Supergiant"
    },
    {
      "x": 51,
      "y": 56,
      "catalogStarId": "rsgc1-f01",
      "name": "RSGC1-F01 (RSGC1 Massive Star Cluster Core)",
      "mag": 16,
      "locationDescription": "RSGC1 Massive Star Cluster Core"
    }
  ],
  "serpens": [
    {
      "x": 48,
      "y": 42,
      "catalogStarId": "r-serpentis",
      "name": "R Serpentis (R Serpentis Long-Period Pulsating Giant)",
      "mag": 5.6,
      "locationDescription": "R Serpentis Long-Period Pulsating Giant"
    }
  ],
  "sextans": [
    {
      "x": 48,
      "y": 54,
      "catalogStarId": "lhs-292",
      "name": "LHS 292 (LHS 292 Magnetic Flare Dwarf)",
      "mag": 15.6,
      "locationDescription": "LHS 292 Magnetic Flare Dwarf"
    },
    {
      "x": 62,
      "y": 55,
      "catalogStarId": "redback-pulsar",
      "name": "Redback Pulsar (PSR J1023+0038)",
      "mag": 17.5,
      "locationDescription": "Sextant Frame • Transitional Millisecond Pulsar (PSR J1023+0038)"
    }
  ],
  "taurus": [
    {
      "x": 42,
      "y": 44,
      "catalogStarId": "ruby-star",
      "name": "Ruby Star (119 Tauri) (Ruby Star / 119 Tauri (Near Southern Hyades Flank))",
      "mag": 4.32,
      "locationDescription": "Ruby Star / 119 Tauri (Near Southern Hyades Flank)"
    },
    {
      "x": 77,
      "y": 60,
      "catalogStarId": "crab-pulsar",
      "name": "Crab Pulsar (PSR B0531+21) (Crab Nebula (M1 / SN 1054 Remnant / Southern Horn Tip))",
      "mag": 16.5,
      "locationDescription": "Crab Nebula (M1 / SN 1054 Remnant / Southern Horn Tip)"
    },
    {
      "x": 31,
      "y": 44,
      "catalogStarId": "atlas-pleiades",
      "name": "Atlas (27 Tauri)",
      "mag": 3.62,
      "locationDescription": "Pleiades Father Star (27 Tauri) • Cluster Eastern Anchor"
    },
    {
      "x": 25,
      "y": 40,
      "catalogStarId": "electra-pleiades",
      "name": "Electra (17 Tauri)",
      "mag": 3.72,
      "locationDescription": "Pleiades Sister (17 Tauri) • Blue-White Be Star"
    },
    {
      "x": 27,
      "y": 39,
      "catalogStarId": "maia-pleiades",
      "name": "Maia (20 Tauri)",
      "mag": 3.87,
      "locationDescription": "Pleiades Sister (20 Tauri) • Chemically Peculiar Star"
    },
    {
      "x": 29,
      "y": 45,
      "catalogStarId": "merope-pleiades",
      "name": "Merope (23 Tauri)",
      "mag": 4.14,
      "locationDescription": "Pleiades Sister (23 Tauri) • Illuminating Reflection Nebula"
    },
    {
      "x": 24,
      "y": 38,
      "catalogStarId": "taygeta-pleiades",
      "name": "Taygeta (19 Tauri)",
      "mag": 4.3,
      "locationDescription": "Pleiades Sister (19 Tauri) • Triple Star System"
    }
  ],
  "triangulum": [
    {
      "x": 52,
      "y": 48,
      "catalogStarId": "r-trianguli",
      "name": "R Trianguli (R Trianguli High-Amplitude Mira Variable)",
      "mag": 5.4,
      "locationDescription": "R Trianguli High-Amplitude Mira Variable"
    }
  ],
  "tucana": [
    {
      "x": 48,
      "y": 52,
      "catalogStarId": "ab7",
      "name": "AB7 A (SMC WR7 A) (AB7 Binary Wolf-Rayet (Small Magellanic Cloud))",
      "mag": 13,
      "locationDescription": "AB7 Binary Wolf-Rayet (Small Magellanic Cloud)"
    },
    {
      "x": 52,
      "y": 56,
      "catalogStarId": "hv-11417",
      "name": "HV 11417 (HV 11417 Massive Red Supergiant (Small Magellanic Cloud))",
      "mag": 12.8,
      "locationDescription": "HV 11417 Massive Red Supergiant (Small Magellanic Cloud)"
    }
  ],
  "ursa-major": [
    {
      "x": 46,
      "y": 78,
      "catalogStarId": "lalande-21185",
      "name": "Lalande 21185 (Lalande 21185 (Southern Hind Paw Sector))",
      "mag": 7.52,
      "locationDescription": "Lalande 21185 (Southern Hind Paw Sector)"
    },
    {
      "x": 79,
      "y": 29,
      "catalogStarId": "alcor",
      "name": "Alcor (80 Ursae Majoris) (Alcor (Horse and Rider System / Optical Companion to Mizar))",
      "mag": 3.99,
      "locationDescription": "Alcor (Horse and Rider System / Optical Companion to Mizar)"
    }
  ],
  "ursa-minor": [
    {
      "x": 54,
      "y": 42,
      "catalogStarId": "wise-1506-7027",
      "name": "WISE 1506+7027 (WISE 1506+7027 Nearby Ultra-Cool T-Dwarf)",
      "mag": 14.3,
      "locationDescription": "WISE 1506+7027 Nearby Ultra-Cool T-Dwarf"
    },
    {
      "x": 46,
      "y": 48,
      "catalogStarId": "lp-40-365",
      "name": "LP 40-365 (GD 492) (LP 40-365 (GD 492 Hypervelocity Supernova Survivor))",
      "mag": 15.6,
      "locationDescription": "LP 40-365 (GD 492 Hypervelocity Supernova Survivor)"
    },
    {
      "x": 65,
      "y": 45,
      "catalogStarId": "calvera",
      "name": "Calvera (1RXS J141256.0+792204)",
      "mag": 28.5,
      "locationDescription": "High-Latitude Core • Isolated Thermal Neutron Star (1RXS J141256.0+792204)"
    }
  ],
  "vela": [
    {
      "x": 46,
      "y": 64,
      "catalogStarId": "vela-pulsar",
      "name": "Vela Pulsar (PSR B0833-45) (Vela Supernova Remnant Core (PSR B0833-45))",
      "mag": 23.6,
      "locationDescription": "Vela Supernova Remnant Core (PSR B0833-45)"
    },
    {
      "x": 68,
      "y": 52,
      "catalogStarId": "luhman-16-a",
      "name": "Luhman 16 A (Luhman 16 Brown Dwarf Binary (Third-Closest System))",
      "mag": 14.2,
      "locationDescription": "Luhman 16 Brown Dwarf Binary (Third-Closest System)"
    },
    {
      "x": 68.8,
      "y": 52.5,
      "catalogStarId": "luhman-16-b",
      "name": "Luhman 16 B (Luhman 16 B Striated Cloud Dwarf)",
      "mag": 15.3,
      "locationDescription": "Luhman 16 B Striated Cloud Dwarf"
    },
    {
      "x": 55,
      "y": 38,
      "catalogStarId": "kalausi",
      "name": "Kalausi (Omicron Velorum)",
      "mag": 3.6,
      "locationDescription": "Omicron Velorum Cluster (IC 2391) Lucida"
    },
    {
      "x": 42,
      "y": 68,
      "catalogStarId": "rx-j0806-4123",
      "name": "RX J0806.4-4123",
      "mag": 27.2,
      "locationDescription": "Vela Supernova Complex • Magnificent Seven Isolated Neutron Star"
    }
  ],
  "virgo": [
    {
      "x": 38,
      "y": 72,
      "catalogStarId": "ross-128",
      "name": "Ross 128 (Ross 128 (Inactive Red Dwarf with Earth-Mass Planet))",
      "mag": 11.15,
      "locationDescription": "Ross 128 (Inactive Red Dwarf with Earth-Mass Planet)"
    },
    {
      "x": 64,
      "y": 42,
      "catalogStarId": "lich-pulsar",
      "name": "Lich (PSR B1257+12) (Lich (PSR B1257+12 First Exoplanet Pulsar System))",
      "mag": 22.5,
      "locationDescription": "Lich (PSR B1257+12 First Exoplanet Pulsar System)"
    },
    {
      "x": 43.5,
      "y": 49.5,
      "catalogStarId": "gamma-virginis-b",
      "name": "Porrima B (Gamma Virginis B) (Porrima Companion (Gamma Virginis Binary / Waist))",
      "mag": 3.53,
      "locationDescription": "Porrima Companion (Gamma Virginis Binary / Waist)"
    },
    {
      "x": 48,
      "y": 60,
      "catalogStarId": "wolf-424-a",
      "name": "Wolf 424 A (Wolf 424 Binary Flare Red Dwarf A)",
      "mag": 13.18,
      "locationDescription": "Wolf 424 Binary Flare Red Dwarf A"
    },
    {
      "x": 48.6,
      "y": 60.4,
      "catalogStarId": "wolf-424-b",
      "name": "Wolf 424 B (Wolf 424 Binary Flare Red Dwarf B)",
      "mag": 13.25,
      "locationDescription": "Wolf 424 Binary Flare Red Dwarf B"
    },
    {
      "x": 52,
      "y": 55,
      "catalogStarId": "wd-1145-017",
      "name": "WD 1145+017 (WD 1145+017 Disintegrating Asteroid System)",
      "mag": 17,
      "locationDescription": "WD 1145+017 Disintegrating Asteroid System"
    }
  ],
  "vulpecula": [
    {
      "x": 52,
      "y": 48,
      "catalogStarId": "nr-vulpeculae",
      "name": "NR Vulpeculae (NR Vulpeculae Variable Supergiant)",
      "mag": 7.9,
      "locationDescription": "NR Vulpeculae Variable Supergiant"
    },
    {
      "x": 38,
      "y": 42,
      "catalogStarId": "sgr-1935-2154",
      "name": "SGR 1935+2154 (Milky Way FRB Magnetar)",
      "mag": 28,
      "locationDescription": "Fox Body • Galactic Fast Radio Burst Magnetar"
    }
  ],
  "crux": [
    {
      "x": 60,
      "y": 62,
      "catalogStarId": "epsilon-crucis",
      "name": "Intrometida (Epsilon Crucis)",
      "mag": 3.59,
      "locationDescription": "Cross Arm Intersection • Intrometida on Brazilian Flag"
    }
  ],
  "triangulum-australe": [
    {
      "x": 75,
      "y": 75,
      "catalogStarId": "gamma-trianguli-australis",
      "name": "Gamma Trianguli Australis",
      "mag": 2.87,
      "locationDescription": "Base Vertex of Southern Triangle • Brazilian Flag Anchor"
    }
  ],
  "sagitta": [
    {
      "x": 52,
      "y": 45,
      "catalogStarId": "black-widow-pulsar",
      "name": "Black Widow Pulsar (PSR B1957+20)",
      "mag": 21,
      "locationDescription": "Arrow Shaft • Relativistic Millisecond Pulsar (PSR B1957+20)"
    }
  ],
  "puppis": [
    {
      "x": 32,
      "y": 65,
      "catalogStarId": "double-pulsar-a",
      "name": "Double Pulsar A (PSR J0737-3039A)",
      "mag": 23.5,
      "locationDescription": "Stern Deck • Relativistic Double Pulsar Primary (PSR J0737-3039A)"
    },
    {
      "x": 33,
      "y": 66,
      "catalogStarId": "double-pulsar-b",
      "name": "Double Pulsar B (PSR J0737-3039B)",
      "mag": 26,
      "locationDescription": "Stern Deck • Relativistic Double Pulsar Companion (PSR J0737-3039B)"
    },
    {
      "x": 58,
      "y": 70,
      "catalogStarId": "rx-j0720-3125",
      "name": "RX J0720.4-3125",
      "mag": 26.6,
      "locationDescription": "Puppis Relic Cloud • Magnificent Seven Isolated Neutron Star"
    }
  ],
  "coma-berenices": [
    {
      "x": 42,
      "y": 55,
      "catalogStarId": "rx-j1308-2127",
      "name": "RX J1308.6+2127 (RBS 1223)",
      "mag": 28.5,
      "locationDescription": "Berenice's Tresses Halo • Magnificent Seven Isolated Neutron Star (RBS 1223)"
    }
  ],
  "corona-borealis": [
    {
      "x": 68,
      "y": 38,
      "catalogStarId": "t-coronae-borealis",
      "name": "T Coronae Borealis (The Blaze Star)",
      "mag": 10,
      "locationDescription": "Crown Arch Perimeter • The Blaze Star Recurrent Nova"
    },
    {
      "x": 32,
      "y": 42,
      "catalogStarId": "rx-j1605-3249",
      "name": "RX J1605.3+3249",
      "mag": 27.2,
      "locationDescription": "Northern Crown Perimeter • Magnificent Seven Thermal Neutron Star"
    }
  ],
  "musca": [
    {
      "x": 62,
      "y": 58,
      "catalogStarId": "psr-b1055-52",
      "name": "PSR B1055-52 (Musca Pulsar)",
      "mag": 24.9,
      "locationDescription": "Fly Wing Relic • Three Musketeers Thermal Pulsar"
    }
  ],
  "lyra": [
    {
      "x": 52,
      "y": 22,
      "catalogStarId": "epsilon-1-lyrae",
      "name": "Epsilon-1 Lyrae (The Double Double)",
      "mag": 4.67,
      "locationDescription": "Double-Double Primary (Epsilon-1 Lyrae) • Quadruple System"
    }
  ]
};
