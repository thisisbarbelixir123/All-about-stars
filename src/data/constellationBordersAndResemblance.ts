import { ConstellationBorderInfo } from './constellationsCore';

export interface ConstellationExtraData {
  resemblance: string;
  borders: ConstellationBorderInfo;
}

export const CONSTELLATION_ASTRONOMICAL_DETAILS: Record<string, ConstellationExtraData> = {
  "andromeda": {
    "resemblance": "A maiden princess chained by her wrists to a sea cliff, stretching across the autumn sky. The brilliant star Alpheratz marks her head (connecting to the Great Square of Pegasus), while two diverging star chains trace her draped gown and outstretched chained arms reaching towards Perseus.",
    "borders": {
      "raRange": "22h 57m – 02h 39m",
      "decRange": "+21° 41′ – +53° 11′",
      "borderingConstellations": [
        "Cassiopeia",
        "Lacerta",
        "Pegasus",
        "Perseus",
        "Pisces",
        "Triangulum"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Bounded by Pegasus and Pisces to the south, Cassiopeia and Lacerta to the north/northwest, and Perseus and Triangulum to the east.",
      "boundaryPolygon": [
        {
          "x": 11,
          "y": 17
        },
        {
          "x": 52,
          "y": 17
        },
        {
          "x": 52,
          "y": 9
        },
        {
          "x": 93,
          "y": 9
        },
        {
          "x": 93,
          "y": 49
        },
        {
          "x": 85,
          "y": 49
        },
        {
          "x": 85,
          "y": 89
        },
        {
          "x": 85,
          "y": 81
        },
        {
          "x": 52,
          "y": 81
        },
        {
          "x": 52,
          "y": 89
        },
        {
          "x": 11,
          "y": 89
        },
        {
          "x": 19,
          "y": 89
        },
        {
          "x": 19,
          "y": 49
        },
        {
          "x": 11,
          "y": 49
        }
      ]
    }
  },
  "antlia": {
    "resemblance": "An 18th-century pneumatic air vacuum pump invented by Denis Papin and commemorated by Nicolas-Louis de Lacaille. Outlined by faint 4th- and 5th-magnitude stars that form an upright mechanical piston cylinder and air receiver.",
    "borders": {
      "raRange": "09h 26m – 11h 05m",
      "decRange": "-40° 29′ – -24° 32′",
      "borderingConstellations": [
        "Centaurus",
        "Hydra",
        "Pyxis",
        "Vela"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Tucked beneath Hydra to the north, Pyxis and Vela to the west and south, and Centaurus to the southwest.",
      "boundaryPolygon": [
        {
          "x": 25,
          "y": 9
        },
        {
          "x": 75,
          "y": 9
        },
        {
          "x": 67,
          "y": 9
        },
        {
          "x": 67,
          "y": 50
        },
        {
          "x": 75,
          "y": 50
        },
        {
          "x": 75,
          "y": 91
        },
        {
          "x": 25,
          "y": 91
        }
      ]
    }
  },
  "apus": {
    "resemblance": "An exotic, footless Bird of Paradise soaring through the deep southern circumpolar realm, depicted with long trailing decorative tail plumes and streamlined wings.",
    "borders": {
      "raRange": "13h 50m – 18h 27m",
      "decRange": "-83° 05′ – -67° 29′",
      "borderingConstellations": [
        "Ara",
        "Chamaeleon",
        "Circinus",
        "Musca",
        "Octans",
        "Pavo",
        "Triangulum Australe"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Circumpolar neighbor to the South Pole (Octans), bordered by Pavo, Ara, and Triangulum Australe.",
      "boundaryPolygon": [
        {
          "x": 11,
          "y": 19
        },
        {
          "x": 50,
          "y": 19
        },
        {
          "x": 50,
          "y": 11
        },
        {
          "x": 89,
          "y": 11
        },
        {
          "x": 89,
          "y": 52
        },
        {
          "x": 81,
          "y": 52
        },
        {
          "x": 81,
          "y": 93
        },
        {
          "x": 81,
          "y": 85
        },
        {
          "x": 50,
          "y": 85
        },
        {
          "x": 50,
          "y": 93
        },
        {
          "x": 11,
          "y": 93
        },
        {
          "x": 11,
          "y": 52
        },
        {
          "x": 19,
          "y": 52
        },
        {
          "x": 19,
          "y": 19
        }
      ]
    }
  },
  "aquarius": {
    "resemblance": "A youthful figure pouring a celestial stream of water from an overturned urn into the open mouth of Piscis Austrinus. The compact Y-shaped 'Water Jar' asterism marks the mouth of the vessel, with undulating cascades of stars tracing the water.",
    "borders": {
      "raRange": "20h 39m – 23h 56m",
      "decRange": "-24° 54′ – +03° 20′",
      "borderingConstellations": [
        "Aquila",
        "Capricornus",
        "Cetus",
        "Delphinus",
        "Equuleus",
        "Pegasus",
        "Pisces",
        "Piscis Austrinus",
        "Sculptor"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Sprawls along the celestial equator, bordered by Pegasus to the north, Capricornus to the southwest, and Pisces to the east.",
      "boundaryPolygon": [
        {
          "x": 15,
          "y": 17
        },
        {
          "x": 45,
          "y": 17
        },
        {
          "x": 45,
          "y": 9
        },
        {
          "x": 75,
          "y": 9
        },
        {
          "x": 75,
          "y": 94
        },
        {
          "x": 75,
          "y": 86
        },
        {
          "x": 45,
          "y": 86
        },
        {
          "x": 45,
          "y": 94
        },
        {
          "x": 15,
          "y": 94
        }
      ]
    }
  },
  "aquila": {
    "resemblance": "A soaring imperial eagle with wide outstretched wings flying along the celestial equator. Dazzling Altair marks its heart, flanked symmetrically by Tarazed and Alshain, with stars sweeping back to its wingtips and tail.",
    "borders": {
      "raRange": "18h 41m – 20h 38m",
      "decRange": "-11° 52′ – +18° 41′",
      "borderingConstellations": [
        "Aquarius",
        "Capricornus",
        "Delphinus",
        "Hercules",
        "Ophiuchus",
        "Sagitta",
        "Sagittarius",
        "Scutum",
        "Serpens Cauda (Ser-Cau)"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Cruises along the Milky Way rift, bordered by Sagitta and Vulpecula to the north, Ophiuchus to the west, and Sagittarius to the south.",
      "boundaryPolygon": [
        {
          "x": 6,
          "y": 13
        },
        {
          "x": 50,
          "y": 13
        },
        {
          "x": 50,
          "y": 21
        },
        {
          "x": 94,
          "y": 21
        },
        {
          "x": 86,
          "y": 21
        },
        {
          "x": 86,
          "y": 54
        },
        {
          "x": 94,
          "y": 54
        },
        {
          "x": 94,
          "y": 94
        },
        {
          "x": 94,
          "y": 86
        },
        {
          "x": 50,
          "y": 86
        },
        {
          "x": 50,
          "y": 94
        },
        {
          "x": 6,
          "y": 94
        },
        {
          "x": 14,
          "y": 94
        },
        {
          "x": 14,
          "y": 54
        },
        {
          "x": 6,
          "y": 54
        }
      ]
    }
  },
  "ara": {
    "resemblance": "A sacred ceremonial stone altar, imagined with holy incense smoke ascending directly into the luminous star clouds of the southern Milky Way. A compact rectangle of stars outlines the stone hearth and sacred flame.",
    "borders": {
      "raRange": "16h 36m – 18h 10m",
      "decRange": "-67° 41′ – -45° 29′",
      "borderingConstellations": [
        "Apus",
        "Corona Australis",
        "Norma",
        "Pavo",
        "Scorpius",
        "Telescopium",
        "Triangulum Australe"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Located directly south of Scorpius's stinger, bordered by Telescopium to the east and Norma to the west.",
      "boundaryPolygon": [
        {
          "x": 28,
          "y": 11
        },
        {
          "x": 55,
          "y": 11
        },
        {
          "x": 55,
          "y": 19
        },
        {
          "x": 81,
          "y": 19
        },
        {
          "x": 73,
          "y": 19
        },
        {
          "x": 73,
          "y": 50
        },
        {
          "x": 81,
          "y": 50
        },
        {
          "x": 81,
          "y": 89
        },
        {
          "x": 28,
          "y": 89
        }
      ]
    }
  },
  "aries": {
    "resemblance": "The legendary Ram with the Golden Fleece, represented by an iconic bent line of three prominent stars—Hamal, Sheratan, and Mesarthim—depicting its curved horns and proud head.",
    "borders": {
      "raRange": "01h 46m – 03h 29m",
      "decRange": "+10° 22′ – +31° 13′",
      "borderingConstellations": [
        "Cetus",
        "Perseus",
        "Pisces",
        "Taurus",
        "Triangulum"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Situated along the ecliptic between Taurus to the east and Pisces to the west, bounded by Triangulum and Perseus to the north.",
      "boundaryPolygon": [
        {
          "x": 19,
          "y": 21
        },
        {
          "x": 56,
          "y": 21
        },
        {
          "x": 56,
          "y": 28
        },
        {
          "x": 93,
          "y": 28
        },
        {
          "x": 85,
          "y": 28
        },
        {
          "x": 85,
          "y": 52
        },
        {
          "x": 93,
          "y": 52
        },
        {
          "x": 93,
          "y": 82
        },
        {
          "x": 56,
          "y": 82
        },
        {
          "x": 56,
          "y": 74
        },
        {
          "x": 19,
          "y": 74
        },
        {
          "x": 27,
          "y": 74
        },
        {
          "x": 27,
          "y": 52
        },
        {
          "x": 19,
          "y": 52
        }
      ]
    }
  },
  "auriga": {
    "resemblance": "A kneeling celestial charioteer carrying a mother goat (brilliant yellow Capella) on his left shoulder and two young kid goats ('The Kids') in his left arm, forming an unmistakable bright celestial pentagon.",
    "borders": {
      "raRange": "04h 37m – 07h 30m",
      "decRange": "+27° 59′ – +56° 10′",
      "borderingConstellations": [
        "Camelopardalis",
        "Gemini",
        "Lynx",
        "Perseus",
        "Taurus"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "High in the northern winter sky, sharing its southern corner star Elnath with Taurus, and bordered by Perseus and Gemini.",
      "boundaryPolygon": [
        {
          "x": 8,
          "y": 8
        },
        {
          "x": 92,
          "y": 8
        },
        {
          "x": 92,
          "y": 54
        },
        {
          "x": 86,
          "y": 54
        },
        {
          "x": 86,
          "y": 92
        },
        {
          "x": 24,
          "y": 92
        },
        {
          "x": 24,
          "y": 72
        },
        {
          "x": 8,
          "y": 72
        }
      ]
    }
  },
  "bootes": {
    "resemblance": "The Herdsman or Bear Driver, striding across the celestial dome like an enormous diamond kite or ice-cream cone, anchored at its base by the brilliant golden-orange giant Arcturus.",
    "borders": {
      "raRange": "13h 36m – 15h 49m",
      "decRange": "+07° 23′ – +55° 01′",
      "borderingConstellations": [
        "Canes Venatici",
        "Coma Berenices",
        "Corona Borealis",
        "Draco",
        "Hercules",
        "Serpens Caput (Ser-Cap)",
        "Ursa Major",
        "Virgo"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Follows the arc of the Big Dipper's handle south to Arcturus, flanked by Corona Borealis to the east and Canes Venatici to the west.",
      "boundaryPolygon": [
        {
          "x": 11,
          "y": 12
        },
        {
          "x": 51,
          "y": 12
        },
        {
          "x": 51,
          "y": 6
        },
        {
          "x": 91,
          "y": 6
        },
        {
          "x": 91,
          "y": 49
        },
        {
          "x": 83,
          "y": 49
        },
        {
          "x": 83,
          "y": 91
        },
        {
          "x": 83,
          "y": 83
        },
        {
          "x": 51,
          "y": 83
        },
        {
          "x": 51,
          "y": 91
        },
        {
          "x": 11,
          "y": 91
        },
        {
          "x": 19,
          "y": 91
        },
        {
          "x": 19,
          "y": 49
        },
        {
          "x": 11,
          "y": 49
        }
      ]
    }
  },
  "caelum": {
    "resemblance": "A sculptor's burin or engraving chisel with a sharp, beveled triangular cutting edge, created by Lacaille to celebrate engraving tools. Outlined by two faint 4th- and 5th-magnitude stars forming a slender blade.",
    "borders": {
      "raRange": "04h 19m – 05h 05m",
      "decRange": "-48° 43′ – -27° 01′",
      "borderingConstellations": [
        "Columba",
        "Dorado",
        "Eridanus",
        "Horologium",
        "Lepus",
        "Pictor"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "A compact southern wedge bordered by Eridanus to the west, Columba and Lepus to the north and east, and Dorado to the south.",
      "boundaryPolygon": [
        {
          "x": 35,
          "y": 11
        },
        {
          "x": 50,
          "y": 11
        },
        {
          "x": 50,
          "y": 16
        },
        {
          "x": 65,
          "y": 16
        },
        {
          "x": 65,
          "y": 52
        },
        {
          "x": 58,
          "y": 52
        },
        {
          "x": 58,
          "y": 93
        },
        {
          "x": 50,
          "y": 93
        },
        {
          "x": 50,
          "y": 85
        },
        {
          "x": 35,
          "y": 85
        },
        {
          "x": 40,
          "y": 85
        },
        {
          "x": 40,
          "y": 52
        },
        {
          "x": 35,
          "y": 52
        }
      ]
    }
  },
  "camelopardalis": {
    "resemblance": "A towering giraffe with a long, slender neck grazing in the northern circumpolar skies, outlined by a faint, winding zigzag of stars roaming quietly between Cassiopeia and the Big Dipper.",
    "borders": {
      "raRange": "03h 15m – 14h 27m",
      "decRange": "+52° 41′ – +86° 03′",
      "borderingConstellations": [
        "Auriga",
        "Cassiopeia",
        "Cepheus",
        "Draco",
        "Lynx",
        "Perseus",
        "Ursa Major",
        "Ursa Minor"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "A large circumpolar territory winding from near the North Celestial Pole down between Auriga, Perseus, and Ursa Major.",
      "boundaryPolygon": [
        {
          "x": 28,
          "y": 7
        },
        {
          "x": 87,
          "y": 7
        },
        {
          "x": 87,
          "y": 94
        },
        {
          "x": 28,
          "y": 94
        },
        {
          "x": 36,
          "y": 94
        },
        {
          "x": 36,
          "y": 51
        },
        {
          "x": 28,
          "y": 51
        }
      ]
    }
  },
  "cancer": {
    "resemblance": "A celestial crab with outstretched pincers and legs, formed by an inverted 'Y' pattern of modest stars guarding the shimmering Beehive open cluster (Praesepe) nestled at its shell center.",
    "borders": {
      "raRange": "07h 55m – 09h 22m",
      "decRange": "+06° 47′ – +33° 08′",
      "borderingConstellations": [
        "Canis Minor",
        "Gemini",
        "Hydra",
        "Leo",
        "Leo Minor",
        "Lynx"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Stationed on the ecliptic between Gemini to the west and Leo to the east, with Hydra slithering along its southern border.",
      "boundaryPolygon": [
        {
          "x": 11,
          "y": 9
        },
        {
          "x": 51,
          "y": 9
        },
        {
          "x": 51,
          "y": 17
        },
        {
          "x": 91,
          "y": 17
        },
        {
          "x": 83,
          "y": 17
        },
        {
          "x": 83,
          "y": 50
        },
        {
          "x": 91,
          "y": 50
        },
        {
          "x": 91,
          "y": 91
        },
        {
          "x": 51,
          "y": 91
        },
        {
          "x": 51,
          "y": 83
        },
        {
          "x": 11,
          "y": 83
        },
        {
          "x": 19,
          "y": 83
        },
        {
          "x": 19,
          "y": 50
        },
        {
          "x": 11,
          "y": 50
        }
      ]
    }
  },
  "canes-venatici": {
    "resemblance": "Two loyal hunting dogs, Asterion and Chara, held on a leash by Boötes as they pace around the Great Bear. Traced by a simple two-star pair centered around the glittering magnetic binary Cor Caroli.",
    "borders": {
      "raRange": "12h 06m – 14h 07m",
      "decRange": "+27° 51′ – +52° 21′",
      "borderingConstellations": [
        "Boötes",
        "Coma Berenices",
        "Ursa Major"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Sheltered in the hollow beneath the handle of the Big Dipper, bordered by Boötes to the east and Coma Berenices to the south.",
      "boundaryPolygon": [
        {
          "x": 11,
          "y": 25
        },
        {
          "x": 87,
          "y": 25
        },
        {
          "x": 87,
          "y": 75
        },
        {
          "x": 11,
          "y": 75
        }
      ]
    }
  },
  "canis-major": {
    "resemblance": "The Great Hunting Dog leaping faithfully at Orion's boots, with the diamond-bright beacon of Sirius marking its chest, and prominent star lines sketching its head, forelegs, spine, and tail.",
    "borders": {
      "raRange": "06h 11m – 07h 27m",
      "decRange": "-33° 15′ – -11° 02′",
      "borderingConstellations": [
        "Columba",
        "Lepus",
        "Monoceros",
        "Puppis"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Positioned directly southeast of Orion and Lepus, bordered by Monoceros to the north and Puppis to the east.",
      "boundaryPolygon": [
        {
          "x": 10,
          "y": 8
        },
        {
          "x": 92,
          "y": 8
        },
        {
          "x": 92,
          "y": 58
        },
        {
          "x": 86,
          "y": 58
        },
        {
          "x": 86,
          "y": 92
        },
        {
          "x": 26,
          "y": 92
        },
        {
          "x": 26,
          "y": 74
        },
        {
          "x": 10,
          "y": 74
        }
      ]
    }
  },
  "canis-minor": {
    "resemblance": "The Lesser Hunting Dog perched on the unicorn's flank, outlined by a clean two-star line segment connecting dazzling Procyon (the 'Before the Dog' star) with Gomeisa.",
    "borders": {
      "raRange": "07h 06m – 08h 11m",
      "decRange": "+00° 00′ – +13° 13′",
      "borderingConstellations": [
        "Cancer",
        "Gemini",
        "Hydra",
        "Monoceros"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "A compact rectangular equatorial sector between Gemini and Monoceros, just east of the Winter Triangle.",
      "boundaryPolygon": [
        {
          "x": 17,
          "y": 19
        },
        {
          "x": 69,
          "y": 19
        },
        {
          "x": 69,
          "y": 79
        },
        {
          "x": 17,
          "y": 79
        }
      ]
    }
  },
  "capricornus": {
    "resemblance": "A mythical Sea-Goat, with the head and forelegs of a mountain goat and the curved, tail-finned body of a fish. An expansive arrowhead or boat-hull triangle spans between Giedi, Dabih, and Deneb Algedi.",
    "borders": {
      "raRange": "20h 06m – 21h 59m",
      "decRange": "-27° 38′ – -08° 24′",
      "borderingConstellations": [
        "Aquarius",
        "Aquila",
        "Microscopium",
        "Piscis Austrinus",
        "Sagittarius"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Southern zodiac territory bordered by Sagittarius to the west, Aquarius to the north and east, and Piscis Austrinus to the south.",
      "boundaryPolygon": [
        {
          "x": 11,
          "y": 19
        },
        {
          "x": 53,
          "y": 19
        },
        {
          "x": 53,
          "y": 27
        },
        {
          "x": 94,
          "y": 27
        },
        {
          "x": 94,
          "y": 81
        },
        {
          "x": 94,
          "y": 74
        },
        {
          "x": 53,
          "y": 74
        },
        {
          "x": 53,
          "y": 81
        },
        {
          "x": 11,
          "y": 81
        },
        {
          "x": 19,
          "y": 81
        },
        {
          "x": 19,
          "y": 50
        },
        {
          "x": 11,
          "y": 50
        }
      ]
    }
  },
  "carina": {
    "resemblance": "The mighty wooden keel and lower hull of the mythical ship Argo Navis, cutting across the southern Milky Way with supergiant Canopus blazing like a navigational lighthouse at its rudder.",
    "borders": {
      "raRange": "06h 02m – 11h 20m",
      "decRange": "-75° 41′ – -50° 45′",
      "borderingConstellations": [
        "Centaurus",
        "Chamaeleon",
        "Musca",
        "Pictor",
        "Puppis",
        "Vela",
        "Volans"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Occupies the rich southern galactic plane, bordered by Vela and Puppis (the rest of Argo) to the north and Centaurus to the east.",
      "boundaryPolygon": [
        {
          "x": 9,
          "y": 15
        },
        {
          "x": 48,
          "y": 15
        },
        {
          "x": 48,
          "y": 23
        },
        {
          "x": 87,
          "y": 23
        },
        {
          "x": 87,
          "y": 52
        },
        {
          "x": 79,
          "y": 52
        },
        {
          "x": 79,
          "y": 89
        },
        {
          "x": 79,
          "y": 81
        },
        {
          "x": 48,
          "y": 81
        },
        {
          "x": 48,
          "y": 89
        },
        {
          "x": 9,
          "y": 89
        },
        {
          "x": 9,
          "y": 52
        },
        {
          "x": 17,
          "y": 52
        },
        {
          "x": 17,
          "y": 15
        }
      ]
    }
  },
  "cassiopeia": {
    "resemblance": "The vain Queen of Ethiopia seated on her celestial throne, forming the world-renowned 'W' or 'M' pattern of five bright stars circumpolar to the North Star.",
    "borders": {
      "raRange": "22h 57m – 03h 41m",
      "decRange": "+46° 40′ – +77° 41′",
      "borderingConstellations": [
        "Andromeda",
        "Camelopardalis",
        "Cepheus",
        "Lacerta",
        "Perseus"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Northern circumpolar powerhouse bordered by Cepheus to the north, Perseus and Andromeda to the south, and Lacerta to the west.",
      "boundaryPolygon": [
        {
          "x": 11,
          "y": 17
        },
        {
          "x": 53,
          "y": 17
        },
        {
          "x": 53,
          "y": 9
        },
        {
          "x": 94,
          "y": 9
        },
        {
          "x": 94,
          "y": 49
        },
        {
          "x": 86,
          "y": 49
        },
        {
          "x": 86,
          "y": 89
        },
        {
          "x": 86,
          "y": 81
        },
        {
          "x": 53,
          "y": 81
        },
        {
          "x": 53,
          "y": 89
        },
        {
          "x": 11,
          "y": 89
        },
        {
          "x": 19,
          "y": 89
        },
        {
          "x": 19,
          "y": 49
        },
        {
          "x": 11,
          "y": 49
        }
      ]
    }
  },
  "centaurus": {
    "resemblance": "A wise, noble centaur—half human, half stallion—poised above the Southern Cross. The radiant pointers Alpha and Beta Centauri mark his front hooves, with sweeping arcs forming his torso and equine flanks.",
    "borders": {
      "raRange": "11h 05m – 15h 03m",
      "decRange": "-64° 42′ – -29° 59′",
      "borderingConstellations": [
        "Antlia",
        "Carina",
        "Circinus",
        "Crux",
        "Hydra",
        "Libra",
        "Musca",
        "Norma",
        "Vela"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "A colossal southern constellation wrapping completely around the Southern Cross (Crux), bordered by Hydra to the north.",
      "boundaryPolygon": [
        {
          "x": 8,
          "y": 8
        },
        {
          "x": 92,
          "y": 8
        },
        {
          "x": 92,
          "y": 52
        },
        {
          "x": 86,
          "y": 52
        },
        {
          "x": 86,
          "y": 92
        },
        {
          "x": 58,
          "y": 92
        },
        {
          "x": 58,
          "y": 68
        },
        {
          "x": 38,
          "y": 68
        },
        {
          "x": 38,
          "y": 92
        },
        {
          "x": 8,
          "y": 92
        },
        {
          "x": 8,
          "y": 48
        },
        {
          "x": 14,
          "y": 48
        },
        {
          "x": 14,
          "y": 28
        },
        {
          "x": 8,
          "y": 28
        }
      ]
    }
  },
  "cepheus": {
    "resemblance": "The crowned King of Ethiopia and father of Andromeda, shaped like an unmistakable child's drawing of a square house with a sharp triangular roof pointing directly toward Polaris.",
    "borders": {
      "raRange": "20h 01m – 08h 30m",
      "decRange": "+53° 23′ – +88° 41′",
      "borderingConstellations": [
        "Camelopardalis",
        "Cassiopeia",
        "Cygnus",
        "Draco",
        "Lacerta",
        "Ursa Minor"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Circumpolar sector crowning the northern sky, bordering Ursa Minor at the pole and flanked by Cassiopeia and Cygnus.",
      "boundaryPolygon": [
        {
          "x": 13,
          "y": 15
        },
        {
          "x": 50,
          "y": 15
        },
        {
          "x": 50,
          "y": 7
        },
        {
          "x": 87,
          "y": 7
        },
        {
          "x": 79,
          "y": 7
        },
        {
          "x": 79,
          "y": 48
        },
        {
          "x": 87,
          "y": 48
        },
        {
          "x": 87,
          "y": 89
        },
        {
          "x": 13,
          "y": 89
        },
        {
          "x": 13,
          "y": 48
        },
        {
          "x": 21,
          "y": 48
        },
        {
          "x": 21,
          "y": 15
        }
      ]
    }
  },
  "cetus": {
    "resemblance": "An enormous mythical sea monster or leviathan, featuring a coiled reptilian torso, swimming flippers, and a gaping circular maw outlined by the five-star ring of Alpha, Gamma, Delta, Mu, and Xi Ceti.",
    "borders": {
      "raRange": "23h 57m – 03h 23m",
      "decRange": "-24° 52′ – +10° 31′",
      "borderingConstellations": [
        "Aquarius",
        "Aries",
        "Eridanus",
        "Fornax",
        "Pisces",
        "Sculptor",
        "Taurus"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Massive equatorial sector lying just south of Pisces and Aries, bounded to the east by the winding river Eridanus.",
      "boundaryPolygon": [
        {
          "x": 6,
          "y": 21
        },
        {
          "x": 94,
          "y": 21
        },
        {
          "x": 94,
          "y": 53
        },
        {
          "x": 86,
          "y": 53
        },
        {
          "x": 86,
          "y": 85
        },
        {
          "x": 86,
          "y": 77
        },
        {
          "x": 50,
          "y": 77
        },
        {
          "x": 50,
          "y": 85
        },
        {
          "x": 6,
          "y": 85
        }
      ]
    }
  },
  "chamaeleon": {
    "resemblance": "A vigilant chameleon clutching a branch in the southern polar skies, traced by an angular crook of 4th-magnitude stars portraying a curled prehensile tail and grasping claws.",
    "borders": {
      "raRange": "07h 33m – 13h 40m",
      "decRange": "-82° 37′ – -75° 18′",
      "borderingConstellations": [
        "Apus",
        "Carina",
        "Mensa",
        "Musca",
        "Octans",
        "Volans"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Far southern circumpolar wedge nestled between Carina, Mensa, Musca, and the South Pole in Octans.",
      "boundaryPolygon": [
        {
          "x": 15,
          "y": 19
        },
        {
          "x": 49,
          "y": 19
        },
        {
          "x": 49,
          "y": 11
        },
        {
          "x": 83,
          "y": 11
        },
        {
          "x": 83,
          "y": 89
        },
        {
          "x": 15,
          "y": 89
        },
        {
          "x": 15,
          "y": 50
        },
        {
          "x": 23,
          "y": 50
        },
        {
          "x": 23,
          "y": 19
        }
      ]
    }
  },
  "circinus": {
    "resemblance": "A pair of drafting dividers or navigational compass opened at an angle, used by marine cartographers to plot ocean routes. Outlined by a sharp, narrow acute triangle of stars.",
    "borders": {
      "raRange": "13h 38m – 15h 30m",
      "decRange": "-70° 29′ – -54° 17′",
      "borderingConstellations": [
        "Apus",
        "Centaurus",
        "Lupus",
        "Musca",
        "Norma",
        "Triangulum Australe"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Nestled directly beside Alpha and Beta Centauri, bounded by Triangulum Australe, Lupus, and Norma.",
      "boundaryPolygon": [
        {
          "x": 25,
          "y": 9
        },
        {
          "x": 75,
          "y": 9
        },
        {
          "x": 67,
          "y": 9
        },
        {
          "x": 67,
          "y": 47
        },
        {
          "x": 75,
          "y": 47
        },
        {
          "x": 75,
          "y": 85
        },
        {
          "x": 25,
          "y": 85
        }
      ]
    }
  },
  "columba": {
    "resemblance": "Noah's dove carrying an olive sprig across the sky, depicted by a soft fluttering wing-like crook of stars nestled just south of Lepus and west of Canis Major.",
    "borders": {
      "raRange": "05h 04m – 06h 39m",
      "decRange": "-43° 08′ – -27° 04′",
      "borderingConstellations": [
        "Caelum",
        "Canis Major",
        "Lepus",
        "Pictor",
        "Puppis"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "South of Lepus, bordered by Canis Major and Puppis to the east and Pictor and Caelum to the south and west.",
      "boundaryPolygon": [
        {
          "x": 19,
          "y": 15
        },
        {
          "x": 83,
          "y": 15
        },
        {
          "x": 83,
          "y": 47
        },
        {
          "x": 75,
          "y": 47
        },
        {
          "x": 75,
          "y": 79
        },
        {
          "x": 19,
          "y": 79
        }
      ]
    }
  },
  "coma-berenices": {
    "resemblance": "The shimmering amber braids of Egyptian Queen Berenice II dedicated to the goddess Aphrodite, visualised as a luminous cascade of faint stars from the open cluster Melotte 111.",
    "borders": {
      "raRange": "11h 58m – 13h 36m",
      "decRange": "+13° 18′ – +33° 18′",
      "borderingConstellations": [
        "Boötes",
        "Canes Venatici",
        "Leo",
        "Ursa Major",
        "Virgo"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "A rich galaxy-filled patch bordered by Leo to the west, Boötes to the east, and Virgo to the south.",
      "boundaryPolygon": [
        {
          "x": 23,
          "y": 26
        },
        {
          "x": 50,
          "y": 26
        },
        {
          "x": 50,
          "y": 21
        },
        {
          "x": 77,
          "y": 21
        },
        {
          "x": 77,
          "y": 52
        },
        {
          "x": 69,
          "y": 52
        },
        {
          "x": 69,
          "y": 83
        },
        {
          "x": 23,
          "y": 83
        }
      ]
    }
  },
  "corona-australis": {
    "resemblance": "A delicate golden laurel wreath or tiara, traced by a neat, graceful semicircular horseshoe of 4th- and 5th-magnitude stars resting beneath the hooves of Sagittarius.",
    "borders": {
      "raRange": "17h 58m – 19h 19m",
      "decRange": "-45° 31′ – -36° 52′",
      "borderingConstellations": [
        "Ara",
        "Sagittarius",
        "Scorpius",
        "Telescopium"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Compact southern arc tucked between the Teapot of Sagittarius, Scorpius's stinger, and Telescopium.",
      "boundaryPolygon": [
        {
          "x": 21,
          "y": 21
        },
        {
          "x": 75,
          "y": 21
        },
        {
          "x": 75,
          "y": 51
        },
        {
          "x": 67,
          "y": 51
        },
        {
          "x": 67,
          "y": 81
        },
        {
          "x": 48,
          "y": 81
        },
        {
          "x": 48,
          "y": 73
        },
        {
          "x": 21,
          "y": 73
        }
      ]
    }
  },
  "corona-borealis": {
    "resemblance": "The jewel-encrusted wedding tiara of Princess Ariadne, forming a striking, gleaming celestial crown anchored at its center by the brilliant gem Alphecca (Gemma).",
    "borders": {
      "raRange": "15h 16m – 16h 25m",
      "decRange": "+25° 39′ – +39° 42′",
      "borderingConstellations": [
        "Boötes",
        "Hercules",
        "Serpens Caput (Ser-Cap)"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "A compact, unmistakable semicircular northern jewel box positioned directly between Boötes and Hercules.",
      "boundaryPolygon": [
        {
          "x": 19,
          "y": 25
        },
        {
          "x": 81,
          "y": 25
        },
        {
          "x": 81,
          "y": 51
        },
        {
          "x": 73,
          "y": 51
        },
        {
          "x": 73,
          "y": 77
        },
        {
          "x": 50,
          "y": 77
        },
        {
          "x": 50,
          "y": 69
        },
        {
          "x": 19,
          "y": 69
        },
        {
          "x": 27,
          "y": 69
        },
        {
          "x": 27,
          "y": 51
        },
        {
          "x": 19,
          "y": 51
        }
      ]
    }
  },
  "corvus": {
    "resemblance": "The sacred black raven of Apollo perched upon the coils of Hydra, formed by a remarkably crisp, compact spinnaker-sail quadrilateral of four bright 2nd- and 3rd-magnitude stars.",
    "borders": {
      "raRange": "11h 56m – 12h 56m",
      "decRange": "-25° 19′ – -11° 09′",
      "borderingConstellations": [
        "Crater",
        "Hydra",
        "Virgo"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "A tight quadrilateral nestled southwest of Spica in Virgo, sitting squarely atop the back of Hydra.",
      "boundaryPolygon": [
        {
          "x": 17,
          "y": 28
        },
        {
          "x": 49,
          "y": 28
        },
        {
          "x": 49,
          "y": 21
        },
        {
          "x": 81,
          "y": 21
        },
        {
          "x": 81,
          "y": 54
        },
        {
          "x": 73,
          "y": 54
        },
        {
          "x": 73,
          "y": 87
        },
        {
          "x": 49,
          "y": 87
        },
        {
          "x": 49,
          "y": 82
        },
        {
          "x": 17,
          "y": 82
        },
        {
          "x": 17,
          "y": 54
        },
        {
          "x": 25,
          "y": 54
        },
        {
          "x": 25,
          "y": 28
        }
      ]
    }
  },
  "crater": {
    "resemblance": "The two-handled golden drinking chalice or cup of Apollo, shaped like a slender goblet with a flared rim and sturdy base resting upon the water snake Hydra.",
    "borders": {
      "raRange": "10h 51m – 11h 56m",
      "decRange": "-25° 04′ – -06° 40′",
      "borderingConstellations": [
        "Corvus",
        "Hydra",
        "Leo",
        "Sextans",
        "Virgo"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Located west of Corvus and south of Leo and Virgo, riding the back of Hydra.",
      "boundaryPolygon": [
        {
          "x": 23,
          "y": 16
        },
        {
          "x": 50,
          "y": 16
        },
        {
          "x": 50,
          "y": 11
        },
        {
          "x": 77,
          "y": 11
        },
        {
          "x": 77,
          "y": 52
        },
        {
          "x": 69,
          "y": 52
        },
        {
          "x": 69,
          "y": 93
        },
        {
          "x": 23,
          "y": 93
        },
        {
          "x": 31,
          "y": 93
        },
        {
          "x": 31,
          "y": 52
        },
        {
          "x": 23,
          "y": 52
        }
      ]
    }
  },
  "crux": {
    "resemblance": "The world-famous Southern Cross, an unmistakable diamond-and-cross kite of four brilliant stars (Acrux, Mimosa, Gacrux, Imai) plus companion star Ginan, pointing straight to the South Pole.",
    "borders": {
      "raRange": "11h 56m – 12h 57m",
      "decRange": "-64° 42′ – -55° 40′",
      "borderingConstellations": [
        "Centaurus",
        "Musca"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "The smallest of all 88 constellations (68 sq°), completely enveloped on three sides by Centaurus and to the south by Musca.",
      "boundaryPolygon": [
        {
          "x": 16,
          "y": 10
        },
        {
          "x": 84,
          "y": 10
        },
        {
          "x": 84,
          "y": 90
        },
        {
          "x": 16,
          "y": 90
        }
      ]
    }
  },
  "cygnus": {
    "resemblance": "A magnificent celestial swan in full flight gliding along the summer Milky Way with wings outstretched and neck extended forward, famously known as the prominent 'Northern Cross' asterism anchored by Deneb.",
    "borders": {
      "raRange": "19h 07m – 22h 03m",
      "decRange": "+27° 44′ – +61° 22′",
      "borderingConstellations": [
        "Cepheus",
        "Draco",
        "Lacerta",
        "Lyra",
        "Pegasus",
        "Vulpecula"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Heart of the northern Milky Way, bordered by Lyra to the west, Cepheus to the north, and Pegasus to the east.",
      "boundaryPolygon": [
        {
          "x": 6,
          "y": 8
        },
        {
          "x": 52,
          "y": 8
        },
        {
          "x": 52,
          "y": 12
        },
        {
          "x": 94,
          "y": 12
        },
        {
          "x": 94,
          "y": 72
        },
        {
          "x": 74,
          "y": 72
        },
        {
          "x": 74,
          "y": 92
        },
        {
          "x": 28,
          "y": 92
        },
        {
          "x": 28,
          "y": 76
        },
        {
          "x": 6,
          "y": 76
        }
      ]
    }
  },
  "delphinus": {
    "resemblance": "A playful dolphin leaping from the oceanic star clouds of the Milky Way, formed by a tidy diamond asterism ('Job's Coffin') for its head and a curved two-star tail leaping downward.",
    "borders": {
      "raRange": "20h 14m – 21h 08m",
      "decRange": "+02° 24′ – +20° 56′",
      "borderingConstellations": [
        "Aquarius",
        "Aquila",
        "Equuleus",
        "Pegasus",
        "Sagitta",
        "Vulpecula"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "A compact gem just east of Aquila and north of Aquarius, bounded by Pegasus and Equuleus to the east.",
      "boundaryPolygon": [
        {
          "x": 13,
          "y": 27
        },
        {
          "x": 49,
          "y": 27
        },
        {
          "x": 49,
          "y": 19
        },
        {
          "x": 85,
          "y": 19
        },
        {
          "x": 85,
          "y": 94
        },
        {
          "x": 13,
          "y": 94
        },
        {
          "x": 13,
          "y": 57
        },
        {
          "x": 21,
          "y": 57
        },
        {
          "x": 21,
          "y": 27
        }
      ]
    }
  },
  "dorado": {
    "resemblance": "A leaping dolphinfish (mahi-mahi) or swordfish with a streamlined body and dorsal fin, hosting the central disc of the dazzling Large Magellanic Cloud satellite galaxy.",
    "borders": {
      "raRange": "03h 53m – 06h 36m",
      "decRange": "-70° 08′ – -48° 40′",
      "borderingConstellations": [
        "Caelum",
        "Horologium",
        "Hydrus",
        "Mensa",
        "Pictor",
        "Reticulum",
        "Volans"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Deep southern sky, bordered by Pictor to the east, Reticulum and Horologium to the west, and Mensa to the south.",
      "boundaryPolygon": [
        {
          "x": 13,
          "y": 21
        },
        {
          "x": 50,
          "y": 21
        },
        {
          "x": 50,
          "y": 13
        },
        {
          "x": 87,
          "y": 13
        },
        {
          "x": 87,
          "y": 94
        },
        {
          "x": 13,
          "y": 94
        },
        {
          "x": 13,
          "y": 54
        },
        {
          "x": 21,
          "y": 54
        },
        {
          "x": 21,
          "y": 21
        }
      ]
    }
  },
  "draco": {
    "resemblance": "A giant serpentine dragon winding its coils between the Big and Little Dippers, with a distinctive quadrilateral head ('The Lozenge') marked by bright Eltanin and Rastaban gazing down at Hercules.",
    "borders": {
      "raRange": "09h 22m – 20h 54m",
      "decRange": "+47° 37′ – +86° 30′",
      "borderingConstellations": [
        "Boötes",
        "Camelopardalis",
        "Cepheus",
        "Cygnus",
        "Hercules",
        "Lyra",
        "Ursa Major",
        "Ursa Minor"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "A sprawling circumpolar serpent snaking between Ursa Major and Ursa Minor, stretching from Cygnus to Camelopardalis.",
      "boundaryPolygon": [
        {
          "x": 17,
          "y": 14
        },
        {
          "x": 56,
          "y": 14
        },
        {
          "x": 56,
          "y": 6
        },
        {
          "x": 94,
          "y": 6
        },
        {
          "x": 94,
          "y": 91
        },
        {
          "x": 17,
          "y": 91
        },
        {
          "x": 24,
          "y": 91
        },
        {
          "x": 24,
          "y": 49
        },
        {
          "x": 17,
          "y": 49
        }
      ]
    }
  },
  "equuleus": {
    "resemblance": "The head and slender muzzle of a young foal or little horse, companion to Pegasus. The second-smallest constellation in the entire sky, outlined by a faint trapezoid of stars.",
    "borders": {
      "raRange": "20h 56m – 21h 26m",
      "decRange": "+02° 29′ – +13° 02′",
      "borderingConstellations": [
        "Aquarius",
        "Delphinus",
        "Pegasus"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Tiny triangular-shaped celestial wedge (72 sq°) sandwiched directly between Delphinus, Pegasus, and Aquarius.",
      "boundaryPolygon": [
        {
          "x": 27,
          "y": 11
        },
        {
          "x": 53,
          "y": 11
        },
        {
          "x": 53,
          "y": 18
        },
        {
          "x": 79,
          "y": 18
        },
        {
          "x": 79,
          "y": 61
        },
        {
          "x": 27,
          "y": 61
        },
        {
          "x": 27,
          "y": 36
        },
        {
          "x": 35,
          "y": 36
        },
        {
          "x": 35,
          "y": 11
        }
      ]
    }
  },
  "eridanus": {
    "resemblance": "A vast meandering celestial river winding from near the foot of Orion (at star Cursa) southwards through the heavens in long serpentine bends, terminating at the radiant blue-white gem Achernar.",
    "borders": {
      "raRange": "01h 24m – 05h 11m",
      "decRange": "-57° 55′ – +00° 24′",
      "borderingConstellations": [
        "Caelum",
        "Cetus",
        "Fornax",
        "Horologium",
        "Hydrus",
        "Lepus",
        "Orion",
        "Phoenix",
        "Taurus",
        "Tucana"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Extends 60 degrees from the celestial equator near Orion down to the deep southern sky near Tucana and Hydrus.",
      "boundaryPolygon": [
        {
          "x": 7,
          "y": 15
        },
        {
          "x": 48,
          "y": 15
        },
        {
          "x": 48,
          "y": 7
        },
        {
          "x": 89,
          "y": 7
        },
        {
          "x": 89,
          "y": 51
        },
        {
          "x": 81,
          "y": 51
        },
        {
          "x": 81,
          "y": 94
        },
        {
          "x": 81,
          "y": 86
        },
        {
          "x": 48,
          "y": 86
        },
        {
          "x": 48,
          "y": 94
        },
        {
          "x": 7,
          "y": 94
        },
        {
          "x": 7,
          "y": 51
        },
        {
          "x": 15,
          "y": 51
        },
        {
          "x": 15,
          "y": 15
        }
      ]
    }
  },
  "fornax": {
    "resemblance": "A chemical smelting furnace with a glass distillation receiver, designed by Lacaille to celebrate Antoine Lavoisier's revolutionary chemical discoveries.",
    "borders": {
      "raRange": "01h 45m – 03h 50m",
      "decRange": "-39° 30′ – -23° 45′",
      "borderingConstellations": [
        "Cetus",
        "Eridanus",
        "Phoenix",
        "Sculptor"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Enclosed in a gentle bend of Eridanus to the east, Cetus to the north, and Sculptor to the west.",
      "boundaryPolygon": [
        {
          "x": 29,
          "y": 19
        },
        {
          "x": 50,
          "y": 19
        },
        {
          "x": 50,
          "y": 27
        },
        {
          "x": 71,
          "y": 27
        },
        {
          "x": 71,
          "y": 55
        },
        {
          "x": 63,
          "y": 55
        },
        {
          "x": 63,
          "y": 91
        },
        {
          "x": 50,
          "y": 91
        },
        {
          "x": 50,
          "y": 83
        },
        {
          "x": 29,
          "y": 83
        },
        {
          "x": 29,
          "y": 55
        },
        {
          "x": 37,
          "y": 55
        },
        {
          "x": 37,
          "y": 19
        }
      ]
    }
  },
  "gemini": {
    "resemblance": "The heavenly twin brothers Castor and Pollux standing side-by-side with locked arms, outlined by two parallel columns of bright stars descending from their matching heads down to their feet on the Milky Way.",
    "borders": {
      "raRange": "06h 00m – 08h 08m",
      "decRange": "+09° 49′ – +35° 23′",
      "borderingConstellations": [
        "Auriga",
        "Cancer",
        "Canis Minor",
        "Lynx",
        "Monoceros",
        "Orion",
        "Taurus"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Zodiac icon bordered by Taurus and Orion to the west, Cancer to the east, and Auriga and Lynx to the north.",
      "boundaryPolygon": [
        {
          "x": 7,
          "y": 9
        },
        {
          "x": 81,
          "y": 9
        },
        {
          "x": 81,
          "y": 51
        },
        {
          "x": 74,
          "y": 51
        },
        {
          "x": 74,
          "y": 93
        },
        {
          "x": 7,
          "y": 93
        },
        {
          "x": 7,
          "y": 51
        },
        {
          "x": 15,
          "y": 51
        },
        {
          "x": 15,
          "y": 9
        }
      ]
    }
  },
  "grus": {
    "resemblance": "A tall, elegant crane with an outstretched neck and slender legs gliding over the southern water constellations, anchored by an acute triangular head and the bright alpha star Alnair.",
    "borders": {
      "raRange": "21h 27m – 23h 27m",
      "decRange": "-56° 23′ – -36° 22′",
      "borderingConstellations": [
        "Indus",
        "Microscopium",
        "Piscis Austrinus",
        "Sculptor",
        "Phoenix",
        "Tucana"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Southern sky fixture located directly south of Piscis Austrinus, bordered by Phoenix to the east and Indus to the west.",
      "boundaryPolygon": [
        {
          "x": 11,
          "y": 7
        },
        {
          "x": 93,
          "y": 7
        },
        {
          "x": 93,
          "y": 94
        },
        {
          "x": 93,
          "y": 86
        },
        {
          "x": 52,
          "y": 86
        },
        {
          "x": 52,
          "y": 94
        },
        {
          "x": 11,
          "y": 94
        },
        {
          "x": 19,
          "y": 94
        },
        {
          "x": 19,
          "y": 51
        },
        {
          "x": 11,
          "y": 51
        }
      ]
    }
  },
  "hercules": {
    "resemblance": "The mighty hero kneeling triumphantly with one foot resting upon the head of Draco the dragon, centered around the iconic 'Keystone' quadrilateral asterism that outlines his powerful torso.",
    "borders": {
      "raRange": "15h 48m – 18h 57m",
      "decRange": "+03° 40′ – +51° 20′",
      "borderingConstellations": [
        "Aquila",
        "Boötes",
        "Corona Borealis",
        "Draco",
        "Lyra",
        "Ophiuchus",
        "Sagitta",
        "Serpens Caput (Ser-Cap)",
        "Vulpecula"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Dominates the mid-summer sky between Lyra and Corona Borealis, bounded by Draco to the north and Ophiuchus to the south.",
      "boundaryPolygon": [
        {
          "x": 21,
          "y": 6
        },
        {
          "x": 58,
          "y": 6
        },
        {
          "x": 58,
          "y": 14
        },
        {
          "x": 94,
          "y": 14
        },
        {
          "x": 94,
          "y": 49
        },
        {
          "x": 86,
          "y": 49
        },
        {
          "x": 86,
          "y": 91
        },
        {
          "x": 86,
          "y": 83
        },
        {
          "x": 58,
          "y": 83
        },
        {
          "x": 58,
          "y": 91
        },
        {
          "x": 21,
          "y": 91
        },
        {
          "x": 29,
          "y": 91
        },
        {
          "x": 29,
          "y": 49
        },
        {
          "x": 21,
          "y": 49
        }
      ]
    }
  },
  "horologium": {
    "resemblance": "A pendulum clock with escapement and weights, introduced by Lacaille to honor Christiaan Huygens's invention of the pendulum clock. Outlined by an elongated line of faint stars.",
    "borders": {
      "raRange": "02h 12m – 04h 20m",
      "decRange": "-67° 02′ – -39° 39′",
      "borderingConstellations": [
        "Caelum",
        "Dorado",
        "Eridanus",
        "Hydrus",
        "Reticulum"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "A narrow southern strip winding alongside Eridanus to the west and Dorado/Reticulum to the east.",
      "boundaryPolygon": [
        {
          "x": 29,
          "y": 19
        },
        {
          "x": 50,
          "y": 19
        },
        {
          "x": 50,
          "y": 11
        },
        {
          "x": 71,
          "y": 11
        },
        {
          "x": 71,
          "y": 51
        },
        {
          "x": 63,
          "y": 51
        },
        {
          "x": 63,
          "y": 91
        },
        {
          "x": 29,
          "y": 91
        }
      ]
    }
  },
  "hydra": {
    "resemblance": "The monstrous multi-headed water snake slain by Hercules; stretching over 100 degrees across the sky as the largest constellation of all, headed by a neat ring of six stars and winding south of Leo and Virgo.",
    "borders": {
      "raRange": "08h 10m – 15h 02m",
      "decRange": "-35° 40′ – +06° 38′",
      "borderingConstellations": [
        "Antlia",
        "Cancer",
        "Canis Minor",
        "Centaurus",
        "Corvus",
        "Crater",
        "Leo",
        "Libra",
        "Lupus",
        "Puppis",
        "Pyxis",
        "Sextans",
        "Virgo"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Sprawls across more than 7 hours of RA, touching 13 neighboring constellations along the southern celestial equator.",
      "boundaryPolygon": [
        {
          "x": 6,
          "y": 8
        },
        {
          "x": 94,
          "y": 8
        },
        {
          "x": 94,
          "y": 44
        },
        {
          "x": 88,
          "y": 44
        },
        {
          "x": 88,
          "y": 92
        },
        {
          "x": 44,
          "y": 92
        },
        {
          "x": 44,
          "y": 84
        },
        {
          "x": 6,
          "y": 84
        }
      ]
    }
  },
  "hydrus": {
    "resemblance": "The lesser southern water snake (distinct from ancient Hydra), outlined by a clean triangle of 3rd-magnitude stars slithering quietly between the two Magellanic Clouds.",
    "borders": {
      "raRange": "00h 05m – 04h 35m",
      "decRange": "-82° 04′ – -57° 27′",
      "borderingConstellations": [
        "Dorado",
        "Eridanus",
        "Horologium",
        "Mensa",
        "Octans",
        "Phoenix",
        "Reticulum",
        "Tucana"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Far southern sector between Tucana, Octans, and Eridanus, wrapped around the South Celestial Pole.",
      "boundaryPolygon": [
        {
          "x": 13,
          "y": 27
        },
        {
          "x": 50,
          "y": 27
        },
        {
          "x": 50,
          "y": 19
        },
        {
          "x": 87,
          "y": 19
        },
        {
          "x": 87,
          "y": 91
        },
        {
          "x": 13,
          "y": 91
        },
        {
          "x": 13,
          "y": 55
        },
        {
          "x": 21,
          "y": 55
        },
        {
          "x": 21,
          "y": 27
        }
      ]
    }
  },
  "indus": {
    "resemblance": "An indigenous hunter or warrior holding arrows in his hands, created by Dutch navigators to celebrate native peoples encountered during early maritime explorations.",
    "borders": {
      "raRange": "20h 28m – 23h 27m",
      "decRange": "-74° 27′ – -44° 57′",
      "borderingConstellations": [
        "Apus",
        "Grus",
        "Microscopium",
        "Octans",
        "Pavo",
        "Sagittarius",
        "Telescopium",
        "Tucana"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Bordered by Pavo to the east, Grus to the north, and Octans to the south.",
      "boundaryPolygon": [
        {
          "x": 17,
          "y": 19
        },
        {
          "x": 45,
          "y": 19
        },
        {
          "x": 45,
          "y": 11
        },
        {
          "x": 73,
          "y": 11
        },
        {
          "x": 73,
          "y": 94
        },
        {
          "x": 17,
          "y": 94
        },
        {
          "x": 17,
          "y": 53
        },
        {
          "x": 25,
          "y": 53
        },
        {
          "x": 25,
          "y": 19
        }
      ]
    }
  },
  "lacerta": {
    "resemblance": "A small lizard scampering along the northern Milky Way, formed by a tight zigzagging chain of 4th-magnitude stars scurrying between Cygnus and Andromeda.",
    "borders": {
      "raRange": "21h 57m – 22h 57m",
      "decRange": "+35° 10′ – +56° 55′",
      "borderingConstellations": [
        "Andromeda",
        "Cassiopeia",
        "Cepheus",
        "Cygnus",
        "Pegasus"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "A narrow northern corridor filling the gap between Cygnus, Andromeda, Cassiopeia, and Pegasus.",
      "boundaryPolygon": [
        {
          "x": 19,
          "y": 15
        },
        {
          "x": 50,
          "y": 15
        },
        {
          "x": 50,
          "y": 7
        },
        {
          "x": 81,
          "y": 7
        },
        {
          "x": 76,
          "y": 7
        },
        {
          "x": 76,
          "y": 50
        },
        {
          "x": 81,
          "y": 50
        },
        {
          "x": 81,
          "y": 93
        },
        {
          "x": 50,
          "y": 93
        },
        {
          "x": 50,
          "y": 85
        },
        {
          "x": 19,
          "y": 85
        },
        {
          "x": 19,
          "y": 50
        },
        {
          "x": 24,
          "y": 50
        },
        {
          "x": 24,
          "y": 15
        }
      ]
    }
  },
  "leo": {
    "resemblance": "A regal crouching lion facing westward, with the famous 'Sickle' (a backward question mark) outlining its mane and proud head, brilliant blue-white Regulus as its heart, and a triangle tracing its flank and tail.",
    "borders": {
      "raRange": "09h 21m – 11h 58m",
      "decRange": "-06° 40′ – +32° 49′",
      "borderingConstellations": [
        "Cancer",
        "Coma Berenices",
        "Crater",
        "Hydra",
        "Leo Minor",
        "Lynx",
        "Sextans",
        "Ursa Major",
        "Virgo"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Prominent northern spring zodiac constellation bordered by Cancer to the west, Virgo to the east, and Ursa Major to the north.",
      "boundaryPolygon": [
        {
          "x": 13,
          "y": 9
        },
        {
          "x": 54,
          "y": 9
        },
        {
          "x": 54,
          "y": 17
        },
        {
          "x": 94,
          "y": 17
        },
        {
          "x": 86,
          "y": 17
        },
        {
          "x": 86,
          "y": 50
        },
        {
          "x": 94,
          "y": 50
        },
        {
          "x": 94,
          "y": 91
        },
        {
          "x": 94,
          "y": 83
        },
        {
          "x": 54,
          "y": 83
        },
        {
          "x": 54,
          "y": 91
        },
        {
          "x": 13,
          "y": 91
        },
        {
          "x": 13,
          "y": 50
        },
        {
          "x": 20,
          "y": 50
        },
        {
          "x": 20,
          "y": 9
        }
      ]
    }
  },
  "leo-minor": {
    "resemblance": "A sprightly lion cub trotting just north of Leo, outlined by an understated triangle of stars situated between the paws of Ursa Major and the Sickle of Leo.",
    "borders": {
      "raRange": "09h 22m – 11h 06m",
      "decRange": "+22° 49′ – +41° 25′",
      "borderingConstellations": [
        "Cancer",
        "Leo",
        "Lynx",
        "Ursa Major"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Wedge situated directly north of Leo's back and south of the hind paws of Ursa Major.",
      "boundaryPolygon": [
        {
          "x": 19,
          "y": 39
        },
        {
          "x": 50,
          "y": 39
        },
        {
          "x": 50,
          "y": 31
        },
        {
          "x": 81,
          "y": 31
        },
        {
          "x": 74,
          "y": 31
        },
        {
          "x": 74,
          "y": 55
        },
        {
          "x": 81,
          "y": 55
        },
        {
          "x": 81,
          "y": 79
        },
        {
          "x": 50,
          "y": 79
        },
        {
          "x": 50,
          "y": 71
        },
        {
          "x": 19,
          "y": 71
        },
        {
          "x": 19,
          "y": 55
        },
        {
          "x": 27,
          "y": 55
        },
        {
          "x": 27,
          "y": 39
        }
      ]
    }
  },
  "lepus": {
    "resemblance": "A nimble hare crouched low in the celestial grass beneath the feet of Orion, fleeing the jaws of Canis Major. Outlined by an irregular quadrilateral with curved ears.",
    "borders": {
      "raRange": "04h 55m – 06h 12m",
      "decRange": "-27° 16′ – -10° 48′",
      "borderingConstellations": [
        "Caelum",
        "Canis Major",
        "Columba",
        "Eridanus",
        "Monoceros",
        "Orion"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Located directly beneath the feet of Orion (Rigel and Saiph), bordered by Canis Major to the east and Eridanus to the west.",
      "boundaryPolygon": [
        {
          "x": 17,
          "y": 7
        },
        {
          "x": 52,
          "y": 7
        },
        {
          "x": 52,
          "y": 15
        },
        {
          "x": 87,
          "y": 15
        },
        {
          "x": 87,
          "y": 44
        },
        {
          "x": 79,
          "y": 44
        },
        {
          "x": 79,
          "y": 81
        },
        {
          "x": 17,
          "y": 81
        },
        {
          "x": 17,
          "y": 44
        },
        {
          "x": 24,
          "y": 44
        },
        {
          "x": 24,
          "y": 7
        }
      ]
    }
  },
  "libra": {
    "resemblance": "The balanced scales of cosmic justice held by Virgo, outlined by an open quadrangle of stars featuring Zubeneschamali (the Northern Claw) and Zubenelgenubi (the Southern Claw).",
    "borders": {
      "raRange": "14h 21m – 16h 02m",
      "decRange": "-30° 00′ – +00° 30′",
      "borderingConstellations": [
        "Centaurus",
        "Hydra",
        "Lupus",
        "Ophiuchus",
        "Scorpius",
        "Serpens Caput (Ser-Cap)",
        "Virgo"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Zodiac scales resting on the ecliptic between Virgo to the west and Scorpius/Ophiuchus to the east.",
      "boundaryPolygon": [
        {
          "x": 13,
          "y": 19
        },
        {
          "x": 49,
          "y": 19
        },
        {
          "x": 49,
          "y": 11
        },
        {
          "x": 85,
          "y": 11
        },
        {
          "x": 77,
          "y": 11
        },
        {
          "x": 77,
          "y": 47
        },
        {
          "x": 85,
          "y": 47
        },
        {
          "x": 85,
          "y": 82
        },
        {
          "x": 13,
          "y": 82
        },
        {
          "x": 13,
          "y": 47
        },
        {
          "x": 21,
          "y": 47
        },
        {
          "x": 21,
          "y": 19
        }
      ]
    }
  },
  "lupus": {
    "resemblance": "A mythical wild wolf impaled upon the spear of Centaurus, outlined by an interconnected quadrangle and zigzag of 3rd-magnitude stars in the rich southern Milky Way.",
    "borders": {
      "raRange": "14h 17m – 16h 08m",
      "decRange": "-55° 34′ – -29° 50′",
      "borderingConstellations": [
        "Centaurus",
        "Circinus",
        "Hydra",
        "Libra",
        "Norma",
        "Scorpius"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Positioned between Centaurus to the west, Scorpius to the east, and Norma to the south.",
      "boundaryPolygon": [
        {
          "x": 19,
          "y": 9
        },
        {
          "x": 54,
          "y": 9
        },
        {
          "x": 54,
          "y": 17
        },
        {
          "x": 89,
          "y": 17
        },
        {
          "x": 81,
          "y": 17
        },
        {
          "x": 81,
          "y": 45
        },
        {
          "x": 89,
          "y": 45
        },
        {
          "x": 89,
          "y": 81
        },
        {
          "x": 54,
          "y": 81
        },
        {
          "x": 54,
          "y": 73
        },
        {
          "x": 19,
          "y": 73
        },
        {
          "x": 19,
          "y": 45
        },
        {
          "x": 27,
          "y": 45
        },
        {
          "x": 27,
          "y": 9
        }
      ]
    }
  },
  "lynx": {
    "resemblance": "An elusive wild lynx with keen night-vision; named by Johannes Hevelius because only an observer with lynx-like eyes could spot its dim, winding chain of stars.",
    "borders": {
      "raRange": "06h 16m – 09h 42m",
      "decRange": "+32° 58′ – +61° 56′",
      "borderingConstellations": [
        "Auriga",
        "Camelopardalis",
        "Cancer",
        "Gemini",
        "Leo",
        "Leo Minor",
        "Ursa Major"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "A long, slender northern band stretching between Auriga and Ursa Major, north of Gemini and Cancer.",
      "boundaryPolygon": [
        {
          "x": 11,
          "y": 11
        },
        {
          "x": 93,
          "y": 11
        },
        {
          "x": 93,
          "y": 91
        },
        {
          "x": 11,
          "y": 91
        }
      ]
    }
  },
  "lyra": {
    "resemblance": "The magical stringed lyre or harp of Orpheus, outlined by a brilliant blue-white jewel (Vega) atop an acute triangle attached to a neat parallelogram of stars.",
    "borders": {
      "raRange": "18h 14m – 19h 28m",
      "decRange": "+25° 40′ – +47° 43′",
      "borderingConstellations": [
        "Cygnus",
        "Draco",
        "Hercules",
        "Vulpecula"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Compact northern jewel anchored by Vega, nestled directly between Hercules and Cygnus.",
      "boundaryPolygon": [
        {
          "x": 12,
          "y": 8
        },
        {
          "x": 88,
          "y": 8
        },
        {
          "x": 88,
          "y": 62
        },
        {
          "x": 82,
          "y": 62
        },
        {
          "x": 82,
          "y": 92
        },
        {
          "x": 22,
          "y": 92
        },
        {
          "x": 22,
          "y": 68
        },
        {
          "x": 12,
          "y": 68
        }
      ]
    }
  },
  "mensa": {
    "resemblance": "Table Mountain overlooking Cape Town, South Africa, commemorated by Lacaille as a flat-topped celestial plateau harboring part of the Large Magellanic Cloud.",
    "borders": {
      "raRange": "03h 12m – 07h 36m",
      "decRange": "-85° 15′ – -69° 45′",
      "borderingConstellations": [
        "Chamaeleon",
        "Dorado",
        "Hydrus",
        "Octans",
        "Volans"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "The faintest constellation in the sky; directly borders the South Pole (Octans), Dorado, and Chamaeleon.",
      "boundaryPolygon": [
        {
          "x": 19,
          "y": 17
        },
        {
          "x": 48,
          "y": 17
        },
        {
          "x": 48,
          "y": 24
        },
        {
          "x": 77,
          "y": 24
        },
        {
          "x": 77,
          "y": 89
        },
        {
          "x": 48,
          "y": 89
        },
        {
          "x": 48,
          "y": 81
        },
        {
          "x": 19,
          "y": 81
        },
        {
          "x": 19,
          "y": 53
        },
        {
          "x": 27,
          "y": 53
        },
        {
          "x": 27,
          "y": 17
        }
      ]
    }
  },
  "microscopium": {
    "resemblance": "An 18th-century optical compound microscope with eyepiece and specimen stage, created by Lacaille to celebrate scientific microscopy. Outlined by an open bend of faint stars.",
    "borders": {
      "raRange": "20h 27m – 21h 28m",
      "decRange": "-45° 06′ – -27° 27′",
      "borderingConstellations": [
        "Capricornus",
        "Grus",
        "Indus",
        "Piscis Austrinus",
        "Sagittarius",
        "Telescopium"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Tucked directly south of Capricornus, bordered by Piscis Austrinus to the east and Sagittarius/Telescopium to the west.",
      "boundaryPolygon": [
        {
          "x": 23,
          "y": 9
        },
        {
          "x": 73,
          "y": 9
        },
        {
          "x": 73,
          "y": 50
        },
        {
          "x": 68,
          "y": 50
        },
        {
          "x": 68,
          "y": 91
        },
        {
          "x": 48,
          "y": 91
        },
        {
          "x": 48,
          "y": 83
        },
        {
          "x": 23,
          "y": 83
        }
      ]
    }
  },
  "monoceros": {
    "resemblance": "A mythical wild unicorn with a gleaming horn galloping through the winter Milky Way, positioned between Orion and Canis Major and harboring stellar nurseries like the Rosette Nebula.",
    "borders": {
      "raRange": "05h 55m – 08h 11m",
      "decRange": "-11° 22′ – +11° 56′",
      "borderingConstellations": [
        "Canis Major",
        "Canis Minor",
        "Gemini",
        "Hydra",
        "Lepus",
        "Orion",
        "Puppis"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Centered squarely within the Winter Triangle formed by Betelgeuse, Sirius, and Procyon.",
      "boundaryPolygon": [
        {
          "x": 15,
          "y": 9
        },
        {
          "x": 87,
          "y": 9
        },
        {
          "x": 87,
          "y": 51
        },
        {
          "x": 79,
          "y": 51
        },
        {
          "x": 79,
          "y": 93
        },
        {
          "x": 79,
          "y": 85
        },
        {
          "x": 51,
          "y": 85
        },
        {
          "x": 51,
          "y": 93
        },
        {
          "x": 15,
          "y": 93
        }
      ]
    }
  },
  "musca": {
    "resemblance": "A small fly buzzing around the Southern Cross, outlined by a crisp trapezoid and tail hovering right beside the dark void of the Coalsack Nebula.",
    "borders": {
      "raRange": "11h 19m – 13h 51m",
      "decRange": "-75° 41′ – -64° 08′",
      "borderingConstellations": [
        "Apus",
        "Carina",
        "Centaurus",
        "Circinus",
        "Crux",
        "Chamaeleon"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Located immediately south of Crux (the Southern Cross) and Centaurus, with Chamaeleon to the south.",
      "boundaryPolygon": [
        {
          "x": 19,
          "y": 23
        },
        {
          "x": 50,
          "y": 23
        },
        {
          "x": 50,
          "y": 15
        },
        {
          "x": 81,
          "y": 15
        },
        {
          "x": 81,
          "y": 49
        },
        {
          "x": 73,
          "y": 49
        },
        {
          "x": 73,
          "y": 83
        },
        {
          "x": 19,
          "y": 83
        },
        {
          "x": 27,
          "y": 83
        },
        {
          "x": 27,
          "y": 49
        },
        {
          "x": 19,
          "y": 49
        }
      ]
    }
  },
  "norma": {
    "resemblance": "A carpenter's right-angle level and square, used for geometric measurement, set amidst the densely populated star lanes of the inner southern Milky Way.",
    "borders": {
      "raRange": "15h 12m – 16h 36m",
      "decRange": "-60° 26′ – -42° 16′",
      "borderingConstellations": [
        "Ara",
        "Circinus",
        "Lupus",
        "Scorpius",
        "Triangulum Australe"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Bordered by Scorpius to the north, Lupus to the west, and Ara and Triangulum Australe to the south.",
      "boundaryPolygon": [
        {
          "x": 23,
          "y": 17
        },
        {
          "x": 52,
          "y": 17
        },
        {
          "x": 52,
          "y": 25
        },
        {
          "x": 81,
          "y": 25
        },
        {
          "x": 73,
          "y": 25
        },
        {
          "x": 73,
          "y": 54
        },
        {
          "x": 81,
          "y": 54
        },
        {
          "x": 81,
          "y": 91
        },
        {
          "x": 81,
          "y": 83
        },
        {
          "x": 52,
          "y": 83
        },
        {
          "x": 52,
          "y": 91
        },
        {
          "x": 23,
          "y": 91
        },
        {
          "x": 30,
          "y": 91
        },
        {
          "x": 30,
          "y": 54
        },
        {
          "x": 23,
          "y": 54
        }
      ]
    }
  },
  "octans": {
    "resemblance": "The reflecting octant navigational instrument invented by John Hadley in 1730; historic for hosting the South Celestial Pole (marked by Polaris Australis / Sigma Octantis).",
    "borders": {
      "raRange": "00h 00m – 24h 00m",
      "decRange": "-90° 00′ – -74° 18′",
      "borderingConstellations": [
        "Apus",
        "Chamaeleon",
        "Hydrus",
        "Indus",
        "Mensa",
        "Pavo",
        "Tucana"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Surrounds the South Celestial Pole, covering all 24 hours of Right Ascension south of declination -74° 18′.",
      "boundaryPolygon": [
        {
          "x": 27,
          "y": 9
        },
        {
          "x": 75,
          "y": 9
        },
        {
          "x": 75,
          "y": 89
        },
        {
          "x": 51,
          "y": 89
        },
        {
          "x": 51,
          "y": 81
        },
        {
          "x": 27,
          "y": 81
        },
        {
          "x": 35,
          "y": 81
        },
        {
          "x": 35,
          "y": 49
        },
        {
          "x": 27,
          "y": 49
        }
      ]
    }
  },
  "ophiuchus": {
    "resemblance": "The colossal mythological healer Asclepius wrestling an enormous serpent (Serpens) wrapped around his waist. A huge upright bell-shaped polygon of stars standing proudly upon Scorpius.",
    "borders": {
      "raRange": "16h 01m – 18h 35m",
      "decRange": "-30° 12′ – +14° 23′",
      "borderingConstellations": [
        "Aquila",
        "Hercules",
        "Libra",
        "Sagittarius",
        "Scorpius",
        "Serpens Caput (Ser-Cap)",
        "Serpens Cauda (Ser-Cau)"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Straddles the celestial equator and ecliptic, splitting Serpens in two, bounded by Hercules to the north and Scorpius to the south.",
      "boundaryPolygon": [
        {
          "x": 13,
          "y": 15
        },
        {
          "x": 50,
          "y": 15
        },
        {
          "x": 50,
          "y": 7
        },
        {
          "x": 87,
          "y": 7
        },
        {
          "x": 87,
          "y": 50
        },
        {
          "x": 79,
          "y": 50
        },
        {
          "x": 79,
          "y": 93
        },
        {
          "x": 13,
          "y": 93
        },
        {
          "x": 18,
          "y": 93
        },
        {
          "x": 18,
          "y": 50
        },
        {
          "x": 13,
          "y": 50
        }
      ]
    }
  },
  "orion": {
    "resemblance": "The supreme celestial Hunter brandishing a raised club and lion-skin shield, framed by fiery Betelgeuse and diamond Rigel, with the world's most famous three-star Belt and hanging Sword.",
    "borders": {
      "raRange": "04h 43m – 06h 25m",
      "decRange": "-10° 59′ – +22° 52′",
      "borderingConstellations": [
        "Eridanus",
        "Gemini",
        "Lepus",
        "Monoceros",
        "Taurus"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Equatorial centerpiece of the winter sky, bordered by Taurus and Gemini to the north, Monoceros to the east, and Lepus to the south.",
      "boundaryPolygon": [
        {
          "x": 8,
          "y": 4
        },
        {
          "x": 92,
          "y": 4
        },
        {
          "x": 92,
          "y": 48
        },
        {
          "x": 94,
          "y": 48
        },
        {
          "x": 94,
          "y": 86
        },
        {
          "x": 26,
          "y": 86
        },
        {
          "x": 26,
          "y": 72
        },
        {
          "x": 8,
          "y": 72
        },
        {
          "x": 8,
          "y": 44
        },
        {
          "x": 12,
          "y": 44
        },
        {
          "x": 12,
          "y": 24
        },
        {
          "x": 8,
          "y": 24
        }
      ]
    }
  },
  "pavo": {
    "resemblance": "A resplendent peacock displaying its iridescent eye-spotted tail feathers across the southern sky, crowned by the brilliant 2nd-magnitude bluish star Peacock (Alpha Pavonis).",
    "borders": {
      "raRange": "17h 40m – 21h 28m",
      "decRange": "-74° 58′ – -56° 35′",
      "borderingConstellations": [
        "Apus",
        "Ara",
        "Indus",
        "Octans",
        "Telescopium"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Southern sky sector bordered by Indus to the east, Ara and Apus to the west, and Octans to the south.",
      "boundaryPolygon": [
        {
          "x": 13,
          "y": 11
        },
        {
          "x": 87,
          "y": 11
        },
        {
          "x": 79,
          "y": 11
        },
        {
          "x": 79,
          "y": 50
        },
        {
          "x": 87,
          "y": 50
        },
        {
          "x": 87,
          "y": 89
        },
        {
          "x": 13,
          "y": 89
        }
      ]
    }
  },
  "pegasus": {
    "resemblance": "The mythical winged stallion soaring upside-down across the autumn sky, anchored by the iconic 'Great Square of Pegasus' outlining its equine torso, with starry legs kicking toward the zenith.",
    "borders": {
      "raRange": "21h 12m – 00h 14m",
      "decRange": "+02° 20′ – +36° 37′",
      "borderingConstellations": [
        "Andromeda",
        "Aquarius",
        "Cygnus",
        "Delphinus",
        "Equuleus",
        "Lacerta",
        "Pisces",
        "Vulpecula"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Massive northern autumn landmark, bordered by Andromeda to the northeast, Pisces and Aquarius to the south, and Cygnus to the west.",
      "boundaryPolygon": [
        {
          "x": 6,
          "y": 13
        },
        {
          "x": 44,
          "y": 13
        },
        {
          "x": 44,
          "y": 21
        },
        {
          "x": 81,
          "y": 21
        },
        {
          "x": 81,
          "y": 94
        },
        {
          "x": 6,
          "y": 94
        },
        {
          "x": 12,
          "y": 94
        },
        {
          "x": 12,
          "y": 54
        },
        {
          "x": 6,
          "y": 54
        }
      ]
    }
  },
  "perseus": {
    "resemblance": "The legendary hero Perseus striding across the northern Milky Way holding aloft the severed head of Medusa (marked by the eerie eclipsing demon star Algol) and a curved sword.",
    "borders": {
      "raRange": "01h 29m – 04h 51m",
      "decRange": "+30° 55′ – +59° 06′",
      "borderingConstellations": [
        "Andromeda",
        "Aries",
        "Auriga",
        "Camelopardalis",
        "Cassiopeia",
        "Taurus",
        "Triangulum"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Bordered by Cassiopeia and Camelopardalis to the north, Auriga to the east, and Andromeda and Triangulum to the west.",
      "boundaryPolygon": [
        {
          "x": 13,
          "y": 6
        },
        {
          "x": 49,
          "y": 6
        },
        {
          "x": 49,
          "y": 14
        },
        {
          "x": 85,
          "y": 14
        },
        {
          "x": 85,
          "y": 91
        },
        {
          "x": 13,
          "y": 91
        },
        {
          "x": 13,
          "y": 49
        },
        {
          "x": 21,
          "y": 49
        },
        {
          "x": 21,
          "y": 6
        }
      ]
    }
  },
  "phoenix": {
    "resemblance": "The mythical immortal firebird with outspread glowing wings rising triumphantly from its funeral pyre, outlined by an open triangle and long curved neck anchored by bright Ankaa.",
    "borders": {
      "raRange": "23h 26m – 02h 25m",
      "decRange": "-57° 50′ – -39° 46′",
      "borderingConstellations": [
        "Eridanus",
        "Fornax",
        "Grus",
        "Hydrus",
        "Sculptor",
        "Tucana"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Southern jewel bordered by Grus to the west, Eridanus to the north and east, and Tucana to the south.",
      "boundaryPolygon": [
        {
          "x": 17,
          "y": 17
        },
        {
          "x": 50,
          "y": 17
        },
        {
          "x": 50,
          "y": 9
        },
        {
          "x": 83,
          "y": 9
        },
        {
          "x": 83,
          "y": 52
        },
        {
          "x": 75,
          "y": 52
        },
        {
          "x": 75,
          "y": 94
        },
        {
          "x": 50,
          "y": 94
        },
        {
          "x": 50,
          "y": 86
        },
        {
          "x": 17,
          "y": 86
        },
        {
          "x": 25,
          "y": 86
        },
        {
          "x": 25,
          "y": 52
        },
        {
          "x": 17,
          "y": 52
        }
      ]
    }
  },
  "pictor": {
    "resemblance": "A classical artist's studio easel with a palette and canvas, created by Lacaille to commemorate fine art. Traced by an acute three-star frame near Canopus and the Large Magellanic Cloud.",
    "borders": {
      "raRange": "04h 32m – 06h 52m",
      "decRange": "-64° 09′ – -42° 47′",
      "borderingConstellations": [
        "Caelum",
        "Carina",
        "Columba",
        "Dorado",
        "Puppis",
        "Volans"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Positioned directly west of brilliant Canopus in Carina, bordered by Dorado to the west and Columba to the north.",
      "boundaryPolygon": [
        {
          "x": 11,
          "y": 9
        },
        {
          "x": 89,
          "y": 9
        },
        {
          "x": 81,
          "y": 9
        },
        {
          "x": 81,
          "y": 52
        },
        {
          "x": 89,
          "y": 52
        },
        {
          "x": 89,
          "y": 94
        },
        {
          "x": 11,
          "y": 94
        }
      ]
    }
  },
  "pisces": {
    "resemblance": "Two sacred fishes swimming in divergent directions, bound together at their tails by a long celestial ribbon tied at the knot star Alrescha, one fish swimming northward and the other westward.",
    "borders": {
      "raRange": "22h 51m – 02h 06m",
      "decRange": "-06° 20′ – +33° 40′",
      "borderingConstellations": [
        "Andromeda",
        "Aquarius",
        "Aries",
        "Cetus",
        "Pegasus",
        "Triangulum"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Vast sprawling V-shaped zodiac sector wrapping around the south and east of the Great Square of Pegasus.",
      "boundaryPolygon": [
        {
          "x": 7,
          "y": 19
        },
        {
          "x": 49,
          "y": 19
        },
        {
          "x": 49,
          "y": 11
        },
        {
          "x": 91,
          "y": 11
        },
        {
          "x": 91,
          "y": 50
        },
        {
          "x": 83,
          "y": 50
        },
        {
          "x": 83,
          "y": 89
        },
        {
          "x": 49,
          "y": 89
        },
        {
          "x": 49,
          "y": 82
        },
        {
          "x": 7,
          "y": 82
        },
        {
          "x": 7,
          "y": 50
        },
        {
          "x": 12,
          "y": 50
        },
        {
          "x": 12,
          "y": 19
        }
      ]
    }
  },
  "piscis-austrinus": {
    "resemblance": "The solitary Southern Fish drinking the stream of celestial water poured from the urn of Aquarius, famously anchored by the brilliant solitary 1st-magnitude star Fomalhaut.",
    "borders": {
      "raRange": "21h 27m – 23h 06m",
      "decRange": "-36° 27′ – -24° 49′",
      "borderingConstellations": [
        "Aquarius",
        "Capricornus",
        "Grus",
        "Microscopium",
        "Sculptor"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Situated immediately south of Aquarius, bordered by Capricornus to the northwest and Grus to the south.",
      "boundaryPolygon": [
        {
          "x": 19,
          "y": 21
        },
        {
          "x": 94,
          "y": 21
        },
        {
          "x": 94,
          "y": 67
        },
        {
          "x": 94,
          "y": 62
        },
        {
          "x": 57,
          "y": 62
        },
        {
          "x": 57,
          "y": 67
        },
        {
          "x": 19,
          "y": 67
        },
        {
          "x": 19,
          "y": 44
        },
        {
          "x": 27,
          "y": 44
        },
        {
          "x": 27,
          "y": 21
        }
      ]
    }
  },
  "puppis": {
    "resemblance": "The elevated poop deck and stern of the mythological ship Argo Navis, overflowing with dazzling open star clusters, star clouds, and nebulae along the southern Milky Way.",
    "borders": {
      "raRange": "06h 02m – 08h 27m",
      "decRange": "-51° 02′ – -11° 16′",
      "borderingConstellations": [
        "Carina",
        "Canis Major",
        "Columba",
        "Hydra",
        "Monoceros",
        "Pictor",
        "Pyxis",
        "Vela"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Eastern flank of Argo Navis, bordered by Canis Major and Monoceros to the north and Carina and Vela to the south.",
      "boundaryPolygon": [
        {
          "x": 25,
          "y": 15
        },
        {
          "x": 54,
          "y": 15
        },
        {
          "x": 54,
          "y": 23
        },
        {
          "x": 83,
          "y": 23
        },
        {
          "x": 75,
          "y": 23
        },
        {
          "x": 75,
          "y": 53
        },
        {
          "x": 83,
          "y": 53
        },
        {
          "x": 83,
          "y": 91
        },
        {
          "x": 25,
          "y": 91
        },
        {
          "x": 25,
          "y": 53
        },
        {
          "x": 32,
          "y": 53
        },
        {
          "x": 32,
          "y": 15
        }
      ]
    }
  },
  "pyxis": {
    "resemblance": "The magnetic mariner's compass used by seafaring explorers, formed by a linear needle of stars pointing northward along the southern Milky Way plane.",
    "borders": {
      "raRange": "08h 26m – 09h 15m",
      "decRange": "-37° 12′ – -17° 43′",
      "borderingConstellations": [
        "Antlia",
        "Hydra",
        "Puppis",
        "Vela"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Small rectangular sector adjoining the stern and sails of Argo Navis (Puppis and Vela), with Hydra to the north.",
      "boundaryPolygon": [
        {
          "x": 25,
          "y": 11
        },
        {
          "x": 75,
          "y": 11
        },
        {
          "x": 67,
          "y": 11
        },
        {
          "x": 67,
          "y": 48
        },
        {
          "x": 75,
          "y": 48
        },
        {
          "x": 75,
          "y": 85
        },
        {
          "x": 50,
          "y": 85
        },
        {
          "x": 50,
          "y": 77
        },
        {
          "x": 25,
          "y": 77
        }
      ]
    }
  },
  "reticulum": {
    "resemblance": "A reticle or crosshair net inside a telescope eyepiece, used by astronomers to measure precise star coordinates; formed by an exceptionally neat small diamond of stars.",
    "borders": {
      "raRange": "03h 15m – 04h 37m",
      "decRange": "-67° 15′ – -52° 46′",
      "borderingConstellations": [
        "Dorado",
        "Horologium",
        "Hydrus"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "A compact diamond sector nestled between the Large Magellanic Cloud in Dorado and the river Eridanus/Horologium.",
      "boundaryPolygon": [
        {
          "x": 19,
          "y": 9
        },
        {
          "x": 81,
          "y": 9
        },
        {
          "x": 73,
          "y": 9
        },
        {
          "x": 73,
          "y": 48
        },
        {
          "x": 81,
          "y": 48
        },
        {
          "x": 81,
          "y": 87
        },
        {
          "x": 50,
          "y": 87
        },
        {
          "x": 50,
          "y": 79
        },
        {
          "x": 19,
          "y": 79
        }
      ]
    }
  },
  "sagitta": {
    "resemblance": "A slender cosmic arrow flying through the summer Milky Way, complete with fletched feathered tail and pointed tip, shot between Aquila the Eagle and Cygnus the Swan.",
    "borders": {
      "raRange": "19h 07m – 20h 20m",
      "decRange": "+16° 05′ – +21° 34′",
      "borderingConstellations": [
        "Aquila",
        "Delphinus",
        "Hercules",
        "Vulpecula"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Third smallest constellation in the sky (80 sq°), flying right in the heart of the Summer Triangle.",
      "boundaryPolygon": [
        {
          "x": 15,
          "y": 35
        },
        {
          "x": 94,
          "y": 35
        },
        {
          "x": 94,
          "y": 50
        },
        {
          "x": 86,
          "y": 50
        },
        {
          "x": 86,
          "y": 65
        },
        {
          "x": 86,
          "y": 57
        },
        {
          "x": 55,
          "y": 57
        },
        {
          "x": 55,
          "y": 65
        },
        {
          "x": 15,
          "y": 65
        }
      ]
    }
  },
  "sagittarius": {
    "resemblance": "An armed centaur archer drawing his bow toward the heart of Scorpius, world-renowned for the iconic 'Teapot' asterism appearing to boil over the dense galactic core of the Milky Way.",
    "borders": {
      "raRange": "17h 43m – 20h 28m",
      "decRange": "-45° 16′ – -11° 43′",
      "borderingConstellations": [
        "Aquila",
        "Capricornus",
        "Corona Australis",
        "Indus",
        "Microscopium",
        "Ophiuchus",
        "Scorpius",
        "Scutum",
        "Serpens Cauda (Ser-Cau)",
        "Telescopium"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Zodiac powerhouse hosting the Galactic Center, bordered by Scorpius and Ophiuchus to the west and Capricornus to the east.",
      "boundaryPolygon": [
        {
          "x": 8,
          "y": 8
        },
        {
          "x": 92,
          "y": 8
        },
        {
          "x": 92,
          "y": 46
        },
        {
          "x": 94,
          "y": 46
        },
        {
          "x": 94,
          "y": 92
        },
        {
          "x": 46,
          "y": 92
        },
        {
          "x": 46,
          "y": 84
        },
        {
          "x": 8,
          "y": 84
        }
      ]
    }
  },
  "scorpius": {
    "resemblance": "One of the most unmistakable figures in the heavens: an ominous scorpion with grasping claws, the glowing red supergiant heart Antares, and a gracefully curling tail culminating in the double stinger Shaula and Lesath.",
    "borders": {
      "raRange": "15h 47m – 17h 59m",
      "decRange": "-45° 48′ – -08° 10′",
      "borderingConstellations": [
        "Ara",
        "Corona Australis",
        "Libra",
        "Lupus",
        "Norma",
        "Ophiuchus",
        "Sagittarius"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Dominates the southern Milky Way between Libra to the west and Sagittarius to the east, bounded by Ophiuchus to the north.",
      "boundaryPolygon": [
        {
          "x": 13,
          "y": 7
        },
        {
          "x": 69,
          "y": 7
        },
        {
          "x": 61,
          "y": 7
        },
        {
          "x": 61,
          "y": 50
        },
        {
          "x": 69,
          "y": 50
        },
        {
          "x": 69,
          "y": 93
        },
        {
          "x": 13,
          "y": 93
        },
        {
          "x": 13,
          "y": 50
        },
        {
          "x": 21,
          "y": 50
        },
        {
          "x": 21,
          "y": 7
        }
      ]
    }
  },
  "sculptor": {
    "resemblance": "A sculptor's studio featuring a tripod workbench holding a freshly carved marble bust and carving mallet, hosting the South Galactic Pole and nearby Sculptor Galaxy (NGC 253).",
    "borders": {
      "raRange": "23h 06m – 01h 45m",
      "decRange": "-39° 54′ – -24° 49′",
      "borderingConstellations": [
        "Aquarius",
        "Cetus",
        "Fornax",
        "Grus",
        "Phoenix",
        "Piscis Austrinus"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Southern galaxy-rich sector bordered by Cetus and Aquarius to the north, and Phoenix and Grus to the south.",
      "boundaryPolygon": [
        {
          "x": 25,
          "y": 23
        },
        {
          "x": 50,
          "y": 23
        },
        {
          "x": 50,
          "y": 15
        },
        {
          "x": 75,
          "y": 15
        },
        {
          "x": 75,
          "y": 54
        },
        {
          "x": 67,
          "y": 54
        },
        {
          "x": 67,
          "y": 93
        },
        {
          "x": 50,
          "y": 93
        },
        {
          "x": 50,
          "y": 85
        },
        {
          "x": 25,
          "y": 85
        },
        {
          "x": 33,
          "y": 85
        },
        {
          "x": 33,
          "y": 54
        },
        {
          "x": 25,
          "y": 54
        }
      ]
    }
  },
  "scutum": {
    "resemblance": "The royal battle shield of Polish King Jan III Sobieski commemorating the 1683 victory at the Battle of Vienna, sitting over the brilliant Scutum Star Cloud.",
    "borders": {
      "raRange": "18h 21m – 18h 59m",
      "decRange": "-15° 56′ – -03° 48′",
      "borderingConstellations": [
        "Aquila",
        "Ophiuchus",
        "Sagittarius",
        "Serpens Cauda (Ser-Cau)"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "A compact diamond sector (109 sq°) situated directly between Aquila, Ophiuchus, and Sagittarius.",
      "boundaryPolygon": [
        {
          "x": 19,
          "y": 11
        },
        {
          "x": 81,
          "y": 11
        },
        {
          "x": 73,
          "y": 11
        },
        {
          "x": 73,
          "y": 50
        },
        {
          "x": 81,
          "y": 50
        },
        {
          "x": 81,
          "y": 89
        },
        {
          "x": 50,
          "y": 89
        },
        {
          "x": 50,
          "y": 81
        },
        {
          "x": 19,
          "y": 81
        }
      ]
    }
  },
  "serpens": {
    "resemblance": "An enormous celestial serpent held by Ophiuchus; unique among all 88 constellations for being split into two distinct disjoint sectors: Serpens Caput (the Head) to the west and Serpens Cauda (the Tail) to the east.",
    "borders": {
      "raRange": "Caput: 15h 10m – 16h 23m | Cauda: 17h 16m – 18h 58m",
      "decRange": "Caput: -03° 50′ – +25° 40′ | Cauda: -16° 08′ – +06° 35′",
      "borderingConstellations": [
        "Boötes",
        "Corona Borealis",
        "Hercules",
        "Libra",
        "Virgo",
        "Ophiuchus",
        "Aquila",
        "Sagittarius",
        "Scutum"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "The only constellation split into two separated halves by Ophiuchus: Serpens Caput (Ser-Cap) in the west and Serpens Cauda (Ser-Cau) in the east.",
      "boundaryPolygon": [
        {
          "x": 11,
          "y": 9
        },
        {
          "x": 93,
          "y": 9
        },
        {
          "x": 93,
          "y": 89
        },
        {
          "x": 52,
          "y": 89
        },
        {
          "x": 52,
          "y": 81
        },
        {
          "x": 11,
          "y": 81
        },
        {
          "x": 19,
          "y": 81
        },
        {
          "x": 19,
          "y": 49
        },
        {
          "x": 11,
          "y": 49
        }
      ],
      "sectors": [
        {
          "name": "Serpens Caput",
          "shortCode": "Ser-Cap",
          "englishName": "Serpent's Head (West)",
          "raRange": "15h 10m – 16h 23m",
          "decRange": "-03° 50′ – +25° 40′",
          "borderingConstellations": [
            "Boötes",
            "Corona Borealis",
            "Hercules",
            "Libra",
            "Ophiuchus",
            "Virgo"
          ],
          "boundaryPolygon": [
            {
              "x": 8,
              "y": 8
            },
            {
              "x": 44,
              "y": 8
            },
            {
              "x": 44,
              "y": 40
            },
            {
              "x": 40,
              "y": 40
            },
            {
              "x": 40,
              "y": 68
            },
            {
              "x": 12,
              "y": 68
            },
            {
              "x": 12,
              "y": 42
            },
            {
              "x": 8,
              "y": 42
            }
          ]
        },
        {
          "name": "Serpens Cauda",
          "shortCode": "Ser-Cau",
          "englishName": "Serpent's Tail (East)",
          "raRange": "17h 16m – 18h 58m",
          "decRange": "-16° 08′ – +06° 35′",
          "borderingConstellations": [
            "Aquila",
            "Ophiuchus",
            "Sagittarius",
            "Scutum"
          ],
          "boundaryPolygon": [
            {
              "x": 54,
              "y": 50
            },
            {
              "x": 88,
              "y": 50
            },
            {
              "x": 88,
              "y": 66
            },
            {
              "x": 94,
              "y": 66
            },
            {
              "x": 94,
              "y": 92
            },
            {
              "x": 62,
              "y": 92
            },
            {
              "x": 62,
              "y": 78
            },
            {
              "x": 54,
              "y": 78
            }
          ]
        }
      ]
    }
  },
  "sextans": {
    "resemblance": "The astronomical measuring sextant used by Johannes Hevelius to chart stellar coordinates before the advent of telescopic sights. Outlined by an open angle of stars.",
    "borders": {
      "raRange": "09h 41m – 10h 51m",
      "decRange": "-08° 03′ – +06° 43′",
      "borderingConstellations": [
        "Crater",
        "Hydra",
        "Leo"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Located directly south of Leo's sickle and chest, bordered by Crater and Hydra to the south.",
      "boundaryPolygon": [
        {
          "x": 25,
          "y": 13
        },
        {
          "x": 79,
          "y": 13
        },
        {
          "x": 79,
          "y": 91
        },
        {
          "x": 52,
          "y": 91
        },
        {
          "x": 52,
          "y": 83
        },
        {
          "x": 25,
          "y": 83
        },
        {
          "x": 25,
          "y": 52
        },
        {
          "x": 33,
          "y": 52
        },
        {
          "x": 33,
          "y": 13
        }
      ]
    }
  },
  "taurus": {
    "resemblance": "The fierce head and sweeping horns of a charging bull, marked by the prominent 'V'-shaped Hyades cluster, the burning red eye Aldebaran, and carrying the glittering Pleiades cluster upon its shoulder.",
    "borders": {
      "raRange": "03h 23m – 06h 00m",
      "decRange": "-01° 45′ – +31° 10′",
      "borderingConstellations": [
        "Aries",
        "Auriga",
        "Cetus",
        "Eridanus",
        "Gemini",
        "Orion",
        "Perseus"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Major winter zodiac constellation bordered by Aries to the west, Gemini and Orion to the east, and Auriga to the north.",
      "boundaryPolygon": [
        {
          "x": 7,
          "y": 17
        },
        {
          "x": 41,
          "y": 17
        },
        {
          "x": 41,
          "y": 9
        },
        {
          "x": 75,
          "y": 9
        },
        {
          "x": 75,
          "y": 52
        },
        {
          "x": 67,
          "y": 52
        },
        {
          "x": 67,
          "y": 94
        },
        {
          "x": 7,
          "y": 94
        },
        {
          "x": 15,
          "y": 94
        },
        {
          "x": 15,
          "y": 52
        },
        {
          "x": 7,
          "y": 52
        }
      ]
    }
  },
  "telescopium": {
    "resemblance": "A long aerial refracting telescope resting upon an observation stand, introduced by Lacaille to celebrate optical instruments that revealed deep space.",
    "borders": {
      "raRange": "18h 09m – 20h 29m",
      "decRange": "-56° 59′ – -45° 01′",
      "borderingConstellations": [
        "Ara",
        "Corona Australis",
        "Indus",
        "Microscopium",
        "Pavo",
        "Sagittarius"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Located directly south of Corona Australis and Sagittarius, bordered by Ara to the west and Pavo to the south.",
      "boundaryPolygon": [
        {
          "x": 25,
          "y": 11
        },
        {
          "x": 75,
          "y": 11
        },
        {
          "x": 67,
          "y": 11
        },
        {
          "x": 67,
          "y": 51
        },
        {
          "x": 75,
          "y": 51
        },
        {
          "x": 75,
          "y": 91
        },
        {
          "x": 50,
          "y": 91
        },
        {
          "x": 50,
          "y": 83
        },
        {
          "x": 25,
          "y": 83
        }
      ]
    }
  },
  "triangulum": {
    "resemblance": "A neat, sharp isosceles triangle formed by three stars in the northern autumn sky, celebrated since antiquity and home to the majestic face-on Triangulum Galaxy (M33).",
    "borders": {
      "raRange": "01h 31m – 02h 50m",
      "decRange": "+25° 36′ – +37° 21′",
      "borderingConstellations": [
        "Andromeda",
        "Aries",
        "Perseus",
        "Pisces"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Compact northern triangle wedged neatly between Andromeda to the north, Aries to the south, and Perseus to the east.",
      "boundaryPolygon": [
        {
          "x": 19,
          "y": 9
        },
        {
          "x": 81,
          "y": 9
        },
        {
          "x": 73,
          "y": 9
        },
        {
          "x": 73,
          "y": 50
        },
        {
          "x": 81,
          "y": 50
        },
        {
          "x": 81,
          "y": 91
        },
        {
          "x": 50,
          "y": 91
        },
        {
          "x": 50,
          "y": 84
        },
        {
          "x": 19,
          "y": 84
        }
      ]
    }
  },
  "triangulum-australe": {
    "resemblance": "A vivid equilateral triangle of three bright 2nd- and 3rd-magnitude stars glowing in the southern Milky Way, nicknamed 'The Three Patriarchs' by navigators.",
    "borders": {
      "raRange": "14h 56m – 17h 13m",
      "decRange": "-70° 31′ – -60° 16′",
      "borderingConstellations": [
        "Apus",
        "Ara",
        "Circinus",
        "Norma"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Deep southern sky anchor bordered by Circinus to the west, Norma and Ara to the north, and Apus to the south.",
      "boundaryPolygon": [
        {
          "x": 15,
          "y": 13
        },
        {
          "x": 85,
          "y": 13
        },
        {
          "x": 77,
          "y": 13
        },
        {
          "x": 77,
          "y": 52
        },
        {
          "x": 85,
          "y": 52
        },
        {
          "x": 85,
          "y": 91
        },
        {
          "x": 50,
          "y": 91
        },
        {
          "x": 50,
          "y": 83
        },
        {
          "x": 15,
          "y": 83
        }
      ]
    }
  },
  "tucana": {
    "resemblance": "A vivid South American toucan with a long, colorful bill, nestled beside the Small Magellanic Cloud and the dazzling globular cluster 47 Tucanae.",
    "borders": {
      "raRange": "22h 08m – 01h 25m",
      "decRange": "-75° 19′ – -56° 29′",
      "borderingConstellations": [
        "Eridanus",
        "Grus",
        "Hydrus",
        "Indus",
        "Octans",
        "Phoenix"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Bordered by Grus to the north, Phoenix to the northeast, Hydrus to the south, and Octans toward the pole.",
      "boundaryPolygon": [
        {
          "x": 15,
          "y": 23
        },
        {
          "x": 53,
          "y": 23
        },
        {
          "x": 53,
          "y": 15
        },
        {
          "x": 91,
          "y": 15
        },
        {
          "x": 91,
          "y": 94
        },
        {
          "x": 15,
          "y": 94
        },
        {
          "x": 15,
          "y": 55
        },
        {
          "x": 23,
          "y": 55
        },
        {
          "x": 23,
          "y": 23
        }
      ]
    }
  },
  "ursa-major": {
    "resemblance": "The Great She-Bear stalking across the northern sky; its hindquarters and arched tail are traced by the world-famous 'Big Dipper' (or Plough), with extended stars forming her snout, neck, and stepping claws.",
    "borders": {
      "raRange": "08h 08m – 14h 29m",
      "decRange": "+28° 18′ – +73° 08′",
      "borderingConstellations": [
        "Boötes",
        "Camelopardalis",
        "Canes Venatici",
        "Coma Berenices",
        "Draco",
        "Leo",
        "Leo Minor",
        "Lynx"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Third-largest constellation in the sky, spanning from near the pole down to Leo, guiding stargazers to Polaris with its pointer stars.",
      "boundaryPolygon": [
        {
          "x": 8,
          "y": 6
        },
        {
          "x": 92,
          "y": 6
        },
        {
          "x": 92,
          "y": 40
        },
        {
          "x": 94,
          "y": 40
        },
        {
          "x": 94,
          "y": 92
        },
        {
          "x": 64,
          "y": 92
        },
        {
          "x": 64,
          "y": 78
        },
        {
          "x": 42,
          "y": 78
        },
        {
          "x": 42,
          "y": 92
        },
        {
          "x": 8,
          "y": 92
        },
        {
          "x": 8,
          "y": 52
        },
        {
          "x": 12,
          "y": 52
        },
        {
          "x": 12,
          "y": 26
        },
        {
          "x": 8,
          "y": 26
        }
      ]
    }
  },
  "ursa-minor": {
    "resemblance": "The Little She-Bear, traced by the famous 'Little Dipper' asterism with the radiant North Celestial Pole star Polaris marking the very tip of its curved tail.",
    "borders": {
      "raRange": "00h 00m – 24h 00m",
      "decRange": "+65° 24′ – +90° 00′",
      "borderingConstellations": [
        "Camelopardalis",
        "Cepheus",
        "Draco"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Surrounds the North Celestial Pole (+90° Dec), covering all 24 hours of Right Ascension, tightly encircled by Draco, Cepheus, and Camelopardalis.",
      "boundaryPolygon": [
        {
          "x": 19,
          "y": 17
        },
        {
          "x": 56,
          "y": 17
        },
        {
          "x": 56,
          "y": 9
        },
        {
          "x": 93,
          "y": 9
        },
        {
          "x": 93,
          "y": 93
        },
        {
          "x": 19,
          "y": 93
        },
        {
          "x": 24,
          "y": 93
        },
        {
          "x": 24,
          "y": 51
        },
        {
          "x": 19,
          "y": 51
        }
      ]
    }
  },
  "vela": {
    "resemblance": "The billowing canvas sails of the mythical ship Argo Navis caught in the celestial wind, featuring the famous 'False Cross' asterism and the glowing Vela Supernova Remnant.",
    "borders": {
      "raRange": "08h 13m – 11h 05m",
      "decRange": "-57° 10′ – -37° 06′",
      "borderingConstellations": [
        "Antlia",
        "Carina",
        "Centaurus",
        "Puppis",
        "Pyxis"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Sails portion of Argo Navis, bordered by Carina to the south, Puppis to the west, and Centaurus to the east.",
      "boundaryPolygon": [
        {
          "x": 17,
          "y": 11
        },
        {
          "x": 49,
          "y": 11
        },
        {
          "x": 49,
          "y": 19
        },
        {
          "x": 81,
          "y": 19
        },
        {
          "x": 74,
          "y": 19
        },
        {
          "x": 74,
          "y": 46
        },
        {
          "x": 81,
          "y": 46
        },
        {
          "x": 81,
          "y": 81
        },
        {
          "x": 81,
          "y": 74
        },
        {
          "x": 49,
          "y": 74
        },
        {
          "x": 49,
          "y": 81
        },
        {
          "x": 17,
          "y": 81
        },
        {
          "x": 17,
          "y": 46
        },
        {
          "x": 25,
          "y": 46
        },
        {
          "x": 25,
          "y": 11
        }
      ]
    }
  },
  "virgo": {
    "resemblance": "The winged Maiden of Justice (Astraea or Demeter) holding an ear of golden wheat marked by sparkling blue-white Spica, reclining along the ecliptic in the spring night sky.",
    "borders": {
      "raRange": "11h 37m – 15h 11m",
      "decRange": "-22° 41′ – +14° 22′",
      "borderingConstellations": [
        "Boötes",
        "Coma Berenices",
        "Corvus",
        "Crater",
        "Hydra",
        "Leo",
        "Libra",
        "Serpens Caput (Ser-Cap)"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Second largest constellation in the sky (1294 sq°), centered on the ecliptic between Leo and Libra, rich in deep-sky galaxies.",
      "boundaryPolygon": [
        {
          "x": 17,
          "y": 15
        },
        {
          "x": 54,
          "y": 15
        },
        {
          "x": 54,
          "y": 22
        },
        {
          "x": 91,
          "y": 22
        },
        {
          "x": 83,
          "y": 22
        },
        {
          "x": 83,
          "y": 53
        },
        {
          "x": 91,
          "y": 53
        },
        {
          "x": 91,
          "y": 91
        },
        {
          "x": 54,
          "y": 91
        },
        {
          "x": 54,
          "y": 83
        },
        {
          "x": 17,
          "y": 83
        },
        {
          "x": 25,
          "y": 83
        },
        {
          "x": 25,
          "y": 53
        },
        {
          "x": 17,
          "y": 53
        }
      ]
    }
  },
  "volans": {
    "resemblance": "A tropical flying fish skimming above the ocean waves with translucent pectoral wings extended, outlined by a compact quadrangle and wings in the southern sky.",
    "borders": {
      "raRange": "06h 35m – 09h 04m",
      "decRange": "-75° 30′ – -64° 02′",
      "borderingConstellations": [
        "Carina",
        "Chamaeleon",
        "Dorado",
        "Mensa",
        "Pictor"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Southern circumpolar sector bounded by Carina to the north and east, and Dorado and Mensa to the west.",
      "boundaryPolygon": [
        {
          "x": 15,
          "y": 19
        },
        {
          "x": 50,
          "y": 19
        },
        {
          "x": 50,
          "y": 11
        },
        {
          "x": 85,
          "y": 11
        },
        {
          "x": 85,
          "y": 53
        },
        {
          "x": 77,
          "y": 53
        },
        {
          "x": 77,
          "y": 94
        },
        {
          "x": 15,
          "y": 94
        },
        {
          "x": 23,
          "y": 94
        },
        {
          "x": 23,
          "y": 53
        },
        {
          "x": 15,
          "y": 53
        }
      ]
    }
  },
  "vulpecula": {
    "resemblance": "A sly little fox carrying a captured goose in its jaws, created by Hevelius; home to the breathtaking Dumbbell Nebula (M27) and the first discovered pulsar (PSR B1919+21).",
    "borders": {
      "raRange": "18h 57m – 21h 16m",
      "decRange": "+19° 23′ – +29° 29′",
      "borderingConstellations": [
        "Cygnus",
        "Delphinus",
        "Hercules",
        "Lyra",
        "Pegasus",
        "Sagitta"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Positioned directly inside the Summer Triangle, bordered by Cygnus to the north and Sagitta/Delphinus to the south.",
      "boundaryPolygon": [
        {
          "x": 21,
          "y": 27
        },
        {
          "x": 91,
          "y": 27
        },
        {
          "x": 91,
          "y": 53
        },
        {
          "x": 83,
          "y": 53
        },
        {
          "x": 83,
          "y": 79
        },
        {
          "x": 21,
          "y": 79
        },
        {
          "x": 29,
          "y": 79
        },
        {
          "x": 29,
          "y": 53
        },
        {
          "x": 21,
          "y": 53
        }
      ]
    }
  }
};
