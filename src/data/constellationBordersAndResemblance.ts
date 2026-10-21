import { ConstellationBorderInfo } from './constellationsCore';

export interface ConstellationExtraData {
  resemblance: string;
  borders: ConstellationBorderInfo;
}

export const CONSTELLATION_ASTRONOMICAL_DETAILS: Record<string, ConstellationExtraData> = {
  "andromeda": {
    "resemblance": "A maiden princess chained by her wrists to a sea cliff, stretching across the autumn sky. The brilliant star Alpheratz marks her head (connecting to the Great Square of Pegasus), while two diverging star chains trace her draped gown and outstretched chained arms reaching towards Perseus.",
    "borders": {
      "raRange": "22h 57m – 02h 40m",
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
        { "x": 84.8, "y": 52.0 },
        { "x": 85.0, "y": 8.0 },
        { "x": 75.1, "y": 8.0 },
        { "x": 75.1, "y": 14.1 },
        { "x": 69.9, "y": 14.1 },
        { "x": 69.8, "y": 19.0 },
        { "x": 57.5, "y": 19.0 },
        { "x": 57.6, "y": 23.9 },
        { "x": 42.8, "y": 23.9 },
        { "x": 42.8, "y": 19.0 },
        { "x": 37.5, "y": 19.1 },
        { "x": 37.5, "y": 14.2 },
        { "x": 32.2, "y": 14.2 },
        { "x": 25.9, "y": 14.3 },
        { "x": 26.0, "y": 21.6 },
        { "x": 18.1, "y": 21.7 },
        { "x": 18.0, "y": 13.1 },
        { "x": 8.0, "y": 13.2 },
        { "x": 8.3, "y": 46.8 },
        { "x": 19.1, "y": 46.7 },
        { "x": 19.1, "y": 51.0 },
        { "x": 31.5, "y": 50.9 },
        { "x": 31.6, "y": 55.8 },
        { "x": 46.0, "y": 55.7 },
        { "x": 46.1, "y": 78.3 },
        { "x": 43.3, "y": 78.3 },
        { "x": 43.3, "y": 85.0 },
        { "x": 58.1, "y": 85.0 },
        { "x": 58.1, "y": 82.5 },
        { "x": 59.7, "y": 82.5 },
        { "x": 59.7, "y": 67.8 },
        { "x": 61.1, "y": 67.8 },
        { "x": 61.1, "y": 59.7 },
        { "x": 66.3, "y": 59.7 },
        { "x": 66.3, "y": 57.9 },
        { "x": 71.5, "y": 57.9 },
        { "x": 71.6, "y": 52.0 },
        { "x": 84.8, "y": 52.0 }
      ]
    }
  },
  "antlia": {
    "resemblance": "An 18th-century pneumatic air vacuum pump invented by Denis Papin and commemorated by Nicolas-Louis de Lacaille. Outlined by faint 4th- and 5th-magnitude stars that form an upright mechanical piston cylinder and air receiver.",
    "borders": {
      "raRange": "09h 27m – 11h 06m",
      "decRange": "-40° 25′ – -24° 33′",
      "borderingConstellations": [
        "Centaurus",
        "Hydra",
        "Pyxis",
        "Vela"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Tucked beneath Hydra to the north, Pyxis and Vela to the west and south, and Centaurus to the southwest.",
      "boundaryPolygon": [
        { "x": 84.5, "y": 8.0 },
        { "x": 84.9, "y": 69.8 },
        { "x": 85.0, "y": 84.4 },
        { "x": 8.1, "y": 85.0 },
        { "x": 8.0, "y": 62.0 },
        { "x": 15.8, "y": 61.9 },
        { "x": 15.8, "y": 43.3 },
        { "x": 27.5, "y": 43.3 },
        { "x": 27.5, "y": 33.6 },
        { "x": 43.2, "y": 33.5 },
        { "x": 43.1, "y": 20.5 },
        { "x": 66.6, "y": 20.3 },
        { "x": 66.5, "y": 8.2 },
        { "x": 84.5, "y": 8.0 }
      ]
    }
  },
  "apus": {
    "resemblance": "An exotic, footless Bird of Paradise soaring through the deep southern circumpolar realm, depicted with long trailing decorative tail plumes and streamlined wings.",
    "borders": {
      "raRange": "13h 50m – 18h 27m",
      "decRange": "-83° 07′ – -67° 29′",
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
        { "x": 83.2, "y": 85.0 },
        { "x": 8.0, "y": 81.7 },
        { "x": 11.0, "y": 44.9 },
        { "x": 12.0, "y": 8.0 },
        { "x": 20.3, "y": 8.4 },
        { "x": 28.7, "y": 8.9 },
        { "x": 28.4, "y": 21.2 },
        { "x": 66.5, "y": 22.9 },
        { "x": 85.0, "y": 23.5 },
        { "x": 84.6, "y": 48.1 },
        { "x": 83.2, "y": 85.0 }
      ]
    }
  },
  "aquarius": {
    "resemblance": "A youthful figure pouring a celestial stream of water from an overturned urn into the open mouth of Piscis Austrinus. The compact Y-shaped 'Water Jar' asterism marks the mouth of the vessel, with undulating cascades of stars tracing the water.",
    "borders": {
      "raRange": "20h 38m – 23h 56m",
      "decRange": "-24° 54′ – +03° 20′",
      "borderingConstellations": [
        "Aquila",
        "Capricornus",
        "Cetus",
        "Delphinus",
        "Equuleus",
        "Pegasus",
        "Piscis Austrinus",
        "Pisces",
        "Sculptor"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Sprawls along the celestial equator, bordered by Pegasus to the north, Capricornus to the southwest, and Pisces to the east.",
      "boundaryPolygon": [
        { "x": 85.0, "y": 15.9 },
        { "x": 85.0, "y": 10.4 },
        { "x": 78.0, "y": 10.3 },
        { "x": 66.3, "y": 10.1 },
        { "x": 63.2, "y": 10.1 },
        { "x": 63.2, "y": 8.1 },
        { "x": 58.6, "y": 8.0 },
        { "x": 58.6, "y": 10.7 },
        { "x": 50.8, "y": 10.6 },
        { "x": 50.8, "y": 10.0 },
        { "x": 33.3, "y": 9.8 },
        { "x": 33.3, "y": 15.3 },
        { "x": 33.3, "y": 26.2 },
        { "x": 8.0, "y": 26.1 },
        { "x": 8.0, "y": 34.3 },
        { "x": 8.0, "y": 84.7 },
        { "x": 27.3, "y": 84.8 },
        { "x": 53.6, "y": 85.0 },
        { "x": 53.8, "y": 40.0 },
        { "x": 66.2, "y": 40.1 },
        { "x": 66.1, "y": 56.5 },
        { "x": 84.7, "y": 56.8 },
        { "x": 84.8, "y": 40.4 },
        { "x": 85.0, "y": 15.9 }
      ]
    }
  },
  "aquila": {
    "resemblance": "A soaring imperial eagle with wide outstretched wings flying along the celestial equator. Dazzling Altair marks its heart, flanked symmetrically by Tarazed and Alshain, with stars sweeping back to its wingtips and tail.",
    "borders": {
      "raRange": "18h 41m – 20h 39m",
      "decRange": "-11° 52′ – +18° 41′",
      "borderingConstellations": [
        "Aquarius",
        "Capricornus",
        "Delphinus",
        "Hercules",
        "Ophiuchus",
        "Scutum",
        "Serpens",
        "Sagitta",
        "Sagittarius"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Cruises along the Milky Way rift, bordered by Sagitta and Vulpecula to the north, Ophiuchus to the west, and Sagittarius to the south.",
      "boundaryPolygon": [
        { "x": 84.9, "y": 54.8 },
        { "x": 85.0, "y": 49.8 },
        { "x": 73.9, "y": 49.6 },
        { "x": 74.0, "y": 38.9 },
        { "x": 82.0, "y": 39.0 },
        { "x": 82.2, "y": 24.5 },
        { "x": 74.2, "y": 24.4 },
        { "x": 74.4, "y": 8.1 },
        { "x": 69.1, "y": 8.0 },
        { "x": 69.1, "y": 13.9 },
        { "x": 36.2, "y": 13.5 },
        { "x": 36.2, "y": 14.6 },
        { "x": 24.1, "y": 14.5 },
        { "x": 23.9, "y": 32.7 },
        { "x": 17.6, "y": 32.7 },
        { "x": 17.5, "y": 49.0 },
        { "x": 8.3, "y": 49.0 },
        { "x": 8.2, "y": 54.0 },
        { "x": 8.0, "y": 76.7 },
        { "x": 29.0, "y": 76.9 },
        { "x": 28.9, "y": 84.5 },
        { "x": 73.4, "y": 85.0 },
        { "x": 73.7, "y": 64.8 },
        { "x": 84.8, "y": 64.9 },
        { "x": 84.9, "y": 54.8 }
      ]
    }
  },
  "ara": {
    "resemblance": "A sacred ceremonial stone altar, imagined with holy incense smoke ascending directly into the luminous star clouds of the southern Milky Way. A compact rectangle of stars outlines the stone hearth and sacred flame.",
    "borders": {
      "raRange": "16h 34m – 18h 11m",
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
        { "x": 83.5, "y": 59.2 },
        { "x": 85.0, "y": 9.0 },
        { "x": 17.1, "y": 8.1 },
        { "x": 9.2, "y": 8.0 },
        { "x": 8.0, "y": 47.9 },
        { "x": 32.0, "y": 48.2 },
        { "x": 30.0, "y": 84.6 },
        { "x": 54.1, "y": 84.9 },
        { "x": 62.1, "y": 85.0 },
        { "x": 62.7, "y": 76.3 },
        { "x": 66.7, "y": 76.4 },
        { "x": 67.0, "y": 71.5 },
        { "x": 75.1, "y": 71.6 },
        { "x": 75.5, "y": 62.6 },
        { "x": 83.4, "y": 62.7 },
        { "x": 83.5, "y": 59.2 }
      ]
    }
  },
  "aries": {
    "resemblance": "The legendary Ram with the Golden Fleece, represented by an iconic bent line of three prominent stars—Hamal, Sheratan, and Mesarthim—depicting its curved horns and proud head.",
    "borders": {
      "raRange": "01h 47m – 03h 30m",
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
        { "x": 70.0, "y": 84.4 },
        { "x": 85.0, "y": 84.3 },
        { "x": 84.7, "y": 28.7 },
        { "x": 73.5, "y": 28.7 },
        { "x": 73.4, "y": 20.4 },
        { "x": 50.9, "y": 20.6 },
        { "x": 50.8, "y": 8.0 },
        { "x": 37.3, "y": 8.1 },
        { "x": 8.0, "y": 8.4 },
        { "x": 8.4, "y": 51.5 },
        { "x": 12.2, "y": 51.5 },
        { "x": 12.4, "y": 85.0 },
        { "x": 70.0, "y": 84.4 }
      ]
    }
  },
  "auriga": {
    "resemblance": "A kneeling celestial charioteer carrying a mother goat (brilliant yellow Capella) on his left shoulder and two young kid goats ('The Kids') in his left arm, forming an unmistakable bright celestial pentagon.",
    "borders": {
      "raRange": "04h 38m – 07h 31m",
      "decRange": "+27° 53′ – +56° 10′",
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
        { "x": 85.0, "y": 76.7 },
        { "x": 84.8, "y": 62.2 },
        { "x": 79.7, "y": 62.3 },
        { "x": 79.0, "y": 17.4 },
        { "x": 70.7, "y": 17.5 },
        { "x": 70.5, "y": 8.0 },
        { "x": 41.1, "y": 8.5 },
        { "x": 41.2, "y": 14.0 },
        { "x": 30.6, "y": 14.2 },
        { "x": 30.8, "y": 25.1 },
        { "x": 22.8, "y": 25.2 },
        { "x": 23.1, "y": 40.2 },
        { "x": 8.0, "y": 40.5 },
        { "x": 8.3, "y": 65.0 },
        { "x": 30.5, "y": 64.6 },
        { "x": 30.7, "y": 85.0 },
        { "x": 48.1, "y": 84.7 },
        { "x": 48.1, "y": 83.3 },
        { "x": 78.4, "y": 82.8 },
        { "x": 78.3, "y": 78.7 },
        { "x": 85.0, "y": 78.6 },
        { "x": 85.0, "y": 76.7 }
      ]
    }
  },
  "bootes": {
    "resemblance": "The Herdsman or Bear Driver, striding across the celestial dome like an enormous diamond kite or ice-cream cone, anchored at its base by the brilliant golden-orange giant Arcturus.",
    "borders": {
      "raRange": "13h 36m – 15h 49m",
      "decRange": "+07° 22′ – +55° 03′",
      "borderingConstellations": [
        "Canes Venatici",
        "Coma Berenices",
        "Corona Borealis",
        "Draco",
        "Hercules",
        "Serpens",
        "Ursa Major",
        "Virgo"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Follows the arc of the Big Dipper's handle south to Arcturus, flanked by Corona Borealis to the east and Canes Venatici to the west.",
      "boundaryPolygon": [
        { "x": 30.1, "y": 84.7 },
        { "x": 84.7, "y": 85.0 },
        { "x": 84.8, "y": 73.7 },
        { "x": 85.0, "y": 51.9 },
        { "x": 69.2, "y": 51.8 },
        { "x": 69.3, "y": 48.2 },
        { "x": 66.7, "y": 48.2 },
        { "x": 67.2, "y": 19.5 },
        { "x": 67.4, "y": 8.2 },
        { "x": 54.4, "y": 8.2 },
        { "x": 25.9, "y": 8.0 },
        { "x": 25.8, "y": 12.0 },
        { "x": 8.6, "y": 11.9 },
        { "x": 8.6, "y": 14.3 },
        { "x": 8.0, "y": 32.9 },
        { "x": 18.9, "y": 33.0 },
        { "x": 18.6, "y": 44.3 },
        { "x": 27.2, "y": 44.3 },
        { "x": 27.0, "y": 55.6 },
        { "x": 30.5, "y": 55.7 },
        { "x": 30.1, "y": 84.7 }
      ]
    }
  },
  "caelum": {
    "resemblance": "A sculptor's burin or engraving chisel with a sharp, beveled triangular cutting edge, created by Lacaille to celebrate engraving tools. Outlined by two faint 4th- and 5th-magnitude stars forming a slender blade.",
    "borders": {
      "raRange": "04h 20m – 05h 05m",
      "decRange": "-48° 44′ – -27° 01′",
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
        { "x": 83.7, "y": 53.0 },
        { "x": 85.0, "y": 84.9 },
        { "x": 61.4, "y": 85.0 },
        { "x": 61.0, "y": 76.1 },
        { "x": 27.3, "y": 76.3 },
        { "x": 26.8, "y": 63.9 },
        { "x": 9.9, "y": 64.0 },
        { "x": 8.0, "y": 8.2 },
        { "x": 24.9, "y": 8.1 },
        { "x": 38.4, "y": 8.0 },
        { "x": 38.7, "y": 17.8 },
        { "x": 50.5, "y": 17.7 },
        { "x": 51.3, "y": 42.5 },
        { "x": 83.3, "y": 42.3 },
        { "x": 83.7, "y": 53.0 }
      ]
    }
  },
  "camelopardalis": {
    "resemblance": "A towering giraffe with a long, slender neck grazing in the northern circumpolar skies, outlined by a faint, winding zigzag of stars roaming quietly between Cassiopeia and the Big Dipper.",
    "borders": {
      "raRange": "03h 16m – 14h 27m",
      "decRange": "+52° 40′ – +86° 06′",
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
        { "x": 64.3, "y": 77.4 },
        { "x": 71.8, "y": 76.9 },
        { "x": 71.9, "y": 85.0 },
        { "x": 74.0, "y": 84.9 },
        { "x": 83.4, "y": 84.4 },
        { "x": 83.4, "y": 78.6 },
        { "x": 84.6, "y": 78.6 },
        { "x": 84.5, "y": 74.0 },
        { "x": 85.0, "y": 73.9 },
        { "x": 84.8, "y": 48.6 },
        { "x": 82.6, "y": 48.7 },
        { "x": 82.1, "y": 28.0 },
        { "x": 81.4, "y": 28.0 },
        { "x": 81.0, "y": 21.1 },
        { "x": 70.5, "y": 21.7 },
        { "x": 68.7, "y": 10.2 },
        { "x": 48.7, "y": 11.4 },
        { "x": 47.6, "y": 8.0 },
        { "x": 9.7, "y": 8.4 },
        { "x": 8.0, "y": 23.3 },
        { "x": 14.0, "y": 23.5 },
        { "x": 13.8, "y": 30.4 },
        { "x": 17.6, "y": 30.5 },
        { "x": 27.4, "y": 30.5 },
        { "x": 27.4, "y": 23.6 },
        { "x": 32.8, "y": 23.6 },
        { "x": 32.6, "y": 19.0 },
        { "x": 42.2, "y": 18.7 },
        { "x": 42.9, "y": 38.2 },
        { "x": 51.0, "y": 37.8 },
        { "x": 51.4, "y": 68.9 },
        { "x": 58.0, "y": 68.6 },
        { "x": 58.0, "y": 64.0 },
        { "x": 64.1, "y": 63.6 },
        { "x": 64.3, "y": 77.4 }
      ]
    }
  },
  "cancer": {
    "resemblance": "A celestial crab with outstretched pincers and legs, formed by an inverted 'Y' pattern of modest stars guarding the shimmering Beehive open cluster (Praesepe) nestled at its shell center.",
    "borders": {
      "raRange": "07h 55m – 09h 23m",
      "decRange": "+06° 28′ – +33° 08′",
      "borderingConstellations": [
        "Canis Minor",
        "Gemini",
        "Hydra",
        "Leo",
        "Lynx"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Stationed on the ecliptic between Gemini to the west and Leo to the east, with Hydra slithering along its southern border.",
      "boundaryPolygon": [
        { "x": 8.9, "y": 85.0 },
        { "x": 70.6, "y": 84.5 },
        { "x": 78.9, "y": 84.5 },
        { "x": 78.8, "y": 75.8 },
        { "x": 85.0, "y": 75.8 },
        { "x": 84.9, "y": 65.6 },
        { "x": 84.6, "y": 46.9 },
        { "x": 80.6, "y": 46.9 },
        { "x": 80.3, "y": 23.8 },
        { "x": 74.1, "y": 23.9 },
        { "x": 73.8, "y": 8.0 },
        { "x": 8.0, "y": 8.5 },
        { "x": 8.9, "y": 85.0 }
      ]
    }
  },
  "canes-venatici": {
    "resemblance": "Two loyal hunting dogs, Asterion and Chara, held on a leash by Boötes as they pace around the Great Bear. Traced by a simple two-star pair centered around the glittering magnetic binary Cor Caroli.",
    "borders": {
      "raRange": "12h 06m – 14h 08m",
      "decRange": "+27° 51′ – +52° 22′",
      "borderingConstellations": [
        "Boötes",
        "Coma Berenices",
        "Ursa Major"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Sheltered in the hollow beneath the handle of the Big Dipper, bordered by Boötes to the east and Coma Berenices to the south.",
      "boundaryPolygon": [
        { "x": 85.0, "y": 67.9 },
        { "x": 85.0, "y": 33.3 },
        { "x": 81.9, "y": 33.3 },
        { "x": 81.9, "y": 8.2 },
        { "x": 28.7, "y": 8.0 },
        { "x": 28.6, "y": 22.1 },
        { "x": 8.5, "y": 22.0 },
        { "x": 8.0, "y": 77.7 },
        { "x": 10.8, "y": 77.8 },
        { "x": 10.8, "y": 84.8 },
        { "x": 28.2, "y": 84.9 },
        { "x": 37.6, "y": 85.0 },
        { "x": 37.7, "y": 74.0 },
        { "x": 72.4, "y": 74.1 },
        { "x": 72.4, "y": 67.8 },
        { "x": 85.0, "y": 67.9 }
      ]
    }
  },
  "canis-major": {
    "resemblance": "The Great Hunting Dog leaping faithfully at Orion's boots, with the diamond-bright beacon of Sirius marking its chest, and prominent star lines sketching its head, forelegs, spine, and tail.",
    "borders": {
      "raRange": "06h 12m – 07h 28m",
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
        { "x": 83.7, "y": 8.0 },
        { "x": 8.0, "y": 8.8 },
        { "x": 9.2, "y": 85.0 },
        { "x": 56.7, "y": 84.5 },
        { "x": 85.0, "y": 84.2 },
        { "x": 84.6, "y": 64.3 },
        { "x": 83.7, "y": 8.0 }
      ]
    }
  },
  "canis-minor": {
    "resemblance": "The Lesser Hunting Dog perched on the unicorn's flank, outlined by a clean two-star line segment connecting dazzling Procyon (the 'Before the Dog' star) with Gomeisa.",
    "borders": {
      "raRange": "07h 07m – 08h 12m",
      "decRange": "-00° 22′ – +13° 13′",
      "borderingConstellations": [
        "Cancer",
        "Gemini",
        "Hydra",
        "Monoceros"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "A compact rectangular equatorial sector between Gemini and Monoceros, just east of the Winter Triangle.",
      "boundaryPolygon": [
        { "x": 8.3, "y": 85.0 },
        { "x": 71.1, "y": 84.2 },
        { "x": 71.0, "y": 75.7 },
        { "x": 84.0, "y": 75.5 },
        { "x": 83.8, "y": 52.8 },
        { "x": 85.0, "y": 52.8 },
        { "x": 84.7, "y": 27.3 },
        { "x": 84.6, "y": 13.2 },
        { "x": 49.1, "y": 13.7 },
        { "x": 49.1, "y": 8.0 },
        { "x": 27.2, "y": 8.3 },
        { "x": 27.4, "y": 28.1 },
        { "x": 19.1, "y": 28.2 },
        { "x": 19.2, "y": 45.2 },
        { "x": 8.0, "y": 45.4 },
        { "x": 8.3, "y": 85.0 }
      ]
    }
  },
  "capricornus": {
    "resemblance": "A mythical Sea-Goat, with the head and forelegs of a mountain goat and the curved, tail-finned body of a fish. An expansive arrowhead or boat-hull triangle spans between Giedi, Dabih, and Deneb Algedi.",
    "borders": {
      "raRange": "20h 07m – 21h 59m",
      "decRange": "-27° 39′ – -08° 24′",
      "borderingConstellations": [
        "Aquila",
        "Aquarius",
        "Microscopium",
        "Piscis Austrinus",
        "Sagittarius"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Southern zodiac territory bordered by Sagittarius to the west, Aquarius to the north and east, and Piscis Austrinus to the south.",
      "boundaryPolygon": [
        { "x": 63.1, "y": 8.6 },
        { "x": 85.0, "y": 9.0 },
        { "x": 84.9, "y": 21.1 },
        { "x": 84.4, "y": 85.0 },
        { "x": 70.7, "y": 84.8 },
        { "x": 29.8, "y": 84.3 },
        { "x": 29.8, "y": 74.3 },
        { "x": 8.0, "y": 74.0 },
        { "x": 8.3, "y": 8.0 },
        { "x": 30.2, "y": 8.2 },
        { "x": 30.1, "y": 32.2 },
        { "x": 62.9, "y": 32.7 },
        { "x": 63.1, "y": 8.6 }
      ]
    }
  },
  "carina": {
    "resemblance": "The mighty wooden keel and lower hull of the mythical ship Argo Navis, cutting across the southern Milky Way with supergiant Canopus blazing like a navigational lighthouse at its rudder.",
    "borders": {
      "raRange": "06h 03m – 11h 21m",
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
        { "x": 8.0, "y": 27.9 },
        { "x": 11.7, "y": 27.8 },
        { "x": 43.7, "y": 27.2 },
        { "x": 43.6, "y": 21.0 },
        { "x": 49.3, "y": 20.9 },
        { "x": 49.2, "y": 16.2 },
        { "x": 53.4, "y": 16.1 },
        { "x": 53.3, "y": 9.2 },
        { "x": 55.8, "y": 9.1 },
        { "x": 84.9, "y": 8.0 },
        { "x": 85.0, "y": 13.4 },
        { "x": 82.6, "y": 13.5 },
        { "x": 82.7, "y": 21.2 },
        { "x": 77.8, "y": 21.4 },
        { "x": 77.9, "y": 30.7 },
        { "x": 73.1, "y": 30.9 },
        { "x": 73.4, "y": 49.4 },
        { "x": 41.0, "y": 50.5 },
        { "x": 41.8, "y": 84.4 },
        { "x": 8.3, "y": 85.0 },
        { "x": 8.1, "y": 51.0 },
        { "x": 8.0, "y": 27.9 }
      ]
    }
  },
  "cassiopeia": {
    "resemblance": "The vain Queen of Ethiopia seated on her celestial throne, forming the world-renowned 'W' or 'M' pattern of five bright stars circumpolar to the North Star.",
    "borders": {
      "raRange": "22h 57m – 03h 41m",
      "decRange": "+46° 41′ – +77° 42′",
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
        { "x": 84.9, "y": 68.9 },
        { "x": 85.0, "y": 59.6 },
        { "x": 85.0, "y": 52.5 },
        { "x": 80.0, "y": 52.5 },
        { "x": 80.1, "y": 42.8 },
        { "x": 73.1, "y": 42.8 },
        { "x": 73.2, "y": 35.3 },
        { "x": 60.6, "y": 35.3 },
        { "x": 60.4, "y": 8.0 },
        { "x": 8.0, "y": 8.7 },
        { "x": 9.2, "y": 31.0 },
        { "x": 14.4, "y": 30.9 },
        { "x": 14.9, "y": 58.2 },
        { "x": 25.9, "y": 58.0 },
        { "x": 25.9, "y": 54.3 },
        { "x": 34.6, "y": 54.1 },
        { "x": 34.6, "y": 56.6 },
        { "x": 38.0, "y": 56.6 },
        { "x": 38.1, "y": 65.3 },
        { "x": 43.6, "y": 65.2 },
        { "x": 43.7, "y": 75.1 },
        { "x": 47.8, "y": 75.1 },
        { "x": 47.8, "y": 80.1 },
        { "x": 51.9, "y": 80.0 },
        { "x": 51.9, "y": 85.0 },
        { "x": 63.5, "y": 85.0 },
        { "x": 63.5, "y": 80.0 },
        { "x": 73.1, "y": 80.0 },
        { "x": 73.1, "y": 75.0 },
        { "x": 77.2, "y": 75.0 },
        { "x": 77.2, "y": 68.8 },
        { "x": 84.9, "y": 68.9 }
      ]
    }
  },
  "centaurus": {
    "resemblance": "A wise, noble centaur—half human, half stallion—poised above the Southern Cross. The radiant pointers Alpha and Beta Centauri mark his front hooves, with sweeping arcs forming his torso and equine flanks.",
    "borders": {
      "raRange": "11h 05m – 15h 03m",
      "decRange": "-64° 42′ – -30° 00′",
      "borderingConstellations": [
        "Antlia",
        "Carina",
        "Circinus",
        "Crux",
        "Hydra",
        "Lupus",
        "Musca",
        "Vela"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "A colossal southern constellation wrapping completely around the Southern Cross (Crux), bordered by Hydra to the north.",
      "boundaryPolygon": [
        { "x": 84.8, "y": 20.6 },
        { "x": 84.8, "y": 31.1 },
        { "x": 85.0, "y": 68.3 },
        { "x": 80.1, "y": 68.3 },
        { "x": 80.1, "y": 85.0 },
        { "x": 68.5, "y": 85.0 },
        { "x": 68.5, "y": 65.0 },
        { "x": 48.7, "y": 65.0 },
        { "x": 48.6, "y": 85.0 },
        { "x": 35.3, "y": 84.9 },
        { "x": 14.8, "y": 84.7 },
        { "x": 15.2, "y": 64.7 },
        { "x": 22.4, "y": 64.8 },
        { "x": 22.7, "y": 35.9 },
        { "x": 8.0, "y": 35.7 },
        { "x": 8.2, "y": 8.0 },
        { "x": 53.8, "y": 8.4 },
        { "x": 53.8, "y": 16.2 },
        { "x": 60.3, "y": 16.2 },
        { "x": 60.3, "y": 20.6 },
        { "x": 84.8, "y": 20.6 }
      ]
    }
  },
  "cepheus": {
    "resemblance": "The crowned King of Ethiopia and father of Andromeda, shaped like an unmistakable child's drawing of a square house with a sharp triangular roof pointing directly toward Polaris.",
    "borders": {
      "raRange": "20h 02m – 09h 03m",
      "decRange": "+53° 21′ – +88° 40′",
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
        { "x": 85.0, "y": 70.8 },
        { "x": 85.0, "y": 66.5 },
        { "x": 82.5, "y": 66.3 },
        { "x": 82.6, "y": 54.3 },
        { "x": 81.1, "y": 54.3 },
        { "x": 81.4, "y": 36.8 },
        { "x": 84.5, "y": 37.0 },
        { "x": 84.9, "y": 26.1 },
        { "x": 79.8, "y": 25.8 },
        { "x": 81.8, "y": 12.8 },
        { "x": 81.9, "y": 12.4 },
        { "x": 68.0, "y": 12.0 },
        { "x": 69.7, "y": 8.0 },
        { "x": 61.2, "y": 8.1 },
        { "x": 51.8, "y": 8.7 },
        { "x": 38.8, "y": 9.4 },
        { "x": 8.0, "y": 10.4 },
        { "x": 10.1, "y": 13.6 },
        { "x": 11.1, "y": 16.8 },
        { "x": 28.2, "y": 15.7 },
        { "x": 29.8, "y": 26.6 },
        { "x": 38.9, "y": 26.0 },
        { "x": 39.2, "y": 32.6 },
        { "x": 39.7, "y": 32.5 },
        { "x": 58.8, "y": 31.9 },
        { "x": 58.9, "y": 55.9 },
        { "x": 63.4, "y": 55.9 },
        { "x": 63.4, "y": 62.5 },
        { "x": 65.9, "y": 62.5 },
        { "x": 65.9, "y": 71.0 },
        { "x": 67.7, "y": 71.0 },
        { "x": 67.7, "y": 77.2 },
        { "x": 71.0, "y": 77.3 },
        { "x": 71.0, "y": 80.0 },
        { "x": 72.1, "y": 80.1 },
        { "x": 72.1, "y": 85.0 },
        { "x": 73.1, "y": 85.0 },
        { "x": 73.1, "y": 80.5 },
        { "x": 81.3, "y": 80.8 },
        { "x": 81.4, "y": 67.5 },
        { "x": 81.8, "y": 67.6 },
        { "x": 81.8, "y": 70.7 },
        { "x": 85.0, "y": 70.8 }
      ]
    }
  },
  "cetus": {
    "resemblance": "An enormous mythical sea monster or leviathan, featuring a coiled reptilian torso, swimming flippers, and a gaping circular maw outlined by the five-star ring of Alpha, Gamma, Delta, Mu, and Xi Ceti.",
    "borders": {
      "raRange": "23h 56m – 03h 24m",
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
        { "x": 73.9, "y": 29.4 },
        { "x": 73.9, "y": 25.0 },
        { "x": 36.7, "y": 25.2 },
        { "x": 36.6, "y": 8.0 },
        { "x": 8.0, "y": 8.3 },
        { "x": 8.1, "y": 29.9 },
        { "x": 8.2, "y": 33.7 },
        { "x": 22.3, "y": 33.5 },
        { "x": 22.6, "y": 82.8 },
        { "x": 44.4, "y": 82.6 },
        { "x": 44.4, "y": 85.0 },
        { "x": 85.0, "y": 84.9 },
        { "x": 85.0, "y": 44.6 },
        { "x": 73.9, "y": 44.6 },
        { "x": 73.9, "y": 29.4 }
      ]
    }
  },
  "chamaeleon": {
    "resemblance": "A vigilant chameleon clutching a branch in the southern polar skies, traced by an angular crook of 4th-magnitude stars portraying a curled prehensile tail and grasping claws.",
    "borders": {
      "raRange": "07h 27m – 13h 56m",
      "decRange": "-83° 07′ – -75° 17′",
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
        { "x": 85.0, "y": 81.6 },
        { "x": 8.0, "y": 85.0 },
        { "x": 9.1, "y": 11.3 },
        { "x": 39.0, "y": 11.9 },
        { "x": 66.4, "y": 10.0 },
        { "x": 83.0, "y": 8.0 },
        { "x": 85.0, "y": 81.6 }
      ]
    }
  },
  "circinus": {
    "resemblance": "A pair of drafting dividers or navigational compass opened at an angle, used by marine cartographers to plot ocean routes. Outlined by a sharp, narrow acute triangle of stars.",
    "borders": {
      "raRange": "13h 39m – 15h 30m",
      "decRange": "-70° 37′ – -55° 26′",
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
        { "x": 85.0, "y": 54.6 },
        { "x": 84.9, "y": 59.7 },
        { "x": 77.9, "y": 59.7 },
        { "x": 77.3, "y": 85.0 },
        { "x": 31.2, "y": 84.4 },
        { "x": 31.7, "y": 71.8 },
        { "x": 24.6, "y": 71.6 },
        { "x": 25.2, "y": 51.8 },
        { "x": 14.7, "y": 51.6 },
        { "x": 15.0, "y": 38.5 },
        { "x": 8.0, "y": 38.4 },
        { "x": 8.1, "y": 33.3 },
        { "x": 8.6, "y": 8.0 },
        { "x": 20.4, "y": 8.2 },
        { "x": 42.1, "y": 8.5 },
        { "x": 41.3, "y": 54.1 },
        { "x": 85.0, "y": 54.6 }
      ]
    }
  },
  "columba": {
    "resemblance": "Noah's dove carrying an olive sprig across the sky, depicted by a soft fluttering wing-like crook of stars nestled just south of Lepus and west of Canis Major.",
    "borders": {
      "raRange": "05h 04m – 06h 40m",
      "decRange": "-43° 07′ – -27° 05′",
      "borderingConstellations": [
        "Canis Major",
        "Caelum",
        "Lepus",
        "Pictor",
        "Puppis"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "South of Lepus, bordered by Canis Major and Puppis to the east and Pictor and Caelum to the south and west.",
      "boundaryPolygon": [
        { "x": 85.0, "y": 83.6 },
        { "x": 84.1, "y": 8.0 },
        { "x": 30.2, "y": 9.0 },
        { "x": 30.5, "y": 36.6 },
        { "x": 8.0, "y": 37.0 },
        { "x": 8.6, "y": 85.0 },
        { "x": 36.8, "y": 84.5 },
        { "x": 85.0, "y": 83.6 }
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
        { "x": 85.0, "y": 85.0 },
        { "x": 85.0, "y": 27.3 },
        { "x": 78.7, "y": 27.3 },
        { "x": 78.7, "y": 8.0 },
        { "x": 63.1, "y": 8.0 },
        { "x": 63.1, "y": 15.7 },
        { "x": 20.0, "y": 15.6 },
        { "x": 20.0, "y": 29.0 },
        { "x": 8.2, "y": 29.0 },
        { "x": 8.0, "y": 80.9 },
        { "x": 39.4, "y": 81.1 },
        { "x": 39.4, "y": 84.9 },
        { "x": 85.0, "y": 85.0 }
      ]
    }
  },
  "corona-australis": {
    "resemblance": "A delicate golden laurel wreath or tiara, traced by a neat, graceful semicircular horseshoe of 4th- and 5th-magnitude stars resting beneath the hooves of Sagittarius.",
    "borders": {
      "raRange": "17h 59m – 19h 19m",
      "decRange": "-45° 31′ – -36° 47′",
      "borderingConstellations": [
        "Ara",
        "Scorpius",
        "Sagittarius",
        "Telescopium"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Compact southern arc tucked between the Teapot of Sagittarius, Scorpius's stinger, and Telescopium.",
      "boundaryPolygon": [
        { "x": 85.0, "y": 10.1 },
        { "x": 8.7, "y": 8.0 },
        { "x": 8.0, "y": 82.9 },
        { "x": 74.7, "y": 84.7 },
        { "x": 84.3, "y": 85.0 },
        { "x": 85.0, "y": 10.1 }
      ]
    }
  },
  "corona-borealis": {
    "resemblance": "The jewel-encrusted wedding tiara of Princess Ariadne, forming a striking, gleaming celestial crown anchored at its center by the brilliant gem Alphecca (Gemma).",
    "borders": {
      "raRange": "15h 16m – 16h 25m",
      "decRange": "+25° 32′ – +39° 43′",
      "borderingConstellations": [
        "Boötes",
        "Hercules",
        "Serpens"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "A compact, unmistakable semicircular northern jewel box positioned directly between Boötes and Hercules.",
      "boundaryPolygon": [
        { "x": 84.6, "y": 85.0 },
        { "x": 85.0, "y": 47.0 },
        { "x": 68.4, "y": 46.8 },
        { "x": 68.8, "y": 8.8 },
        { "x": 47.8, "y": 8.5 },
        { "x": 8.9, "y": 8.0 },
        { "x": 8.0, "y": 78.6 },
        { "x": 19.1, "y": 78.8 },
        { "x": 19.1, "y": 84.2 },
        { "x": 28.0, "y": 84.3 },
        { "x": 84.6, "y": 85.0 }
      ]
    }
  },
  "corvus": {
    "resemblance": "The sacred black raven of Apollo perched upon the coils of Hydra, formed by a remarkably crisp, compact spinnaker-sail quadrilateral of four bright 2nd- and 3rd-magnitude stars.",
    "borders": {
      "raRange": "11h 56m – 12h 57m",
      "decRange": "-25° 12′ – -11° 41′",
      "borderingConstellations": [
        "Crater",
        "Hydra",
        "Virgo"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "A tight quadrilateral nestled southwest of Spica in Virgo, sitting squarely atop the back of Hydra.",
      "boundaryPolygon": [
        { "x": 8.2, "y": 8.0 },
        { "x": 85.0, "y": 8.1 },
        { "x": 85.0, "y": 85.0 },
        { "x": 27.2, "y": 84.9 },
        { "x": 27.2, "y": 70.7 },
        { "x": 8.0, "y": 70.7 },
        { "x": 8.2, "y": 8.0 }
      ]
    }
  },
  "crater": {
    "resemblance": "The two-handled golden drinking chalice or cup of Apollo, shaped like a slender goblet with a flared rim and sturdy base resting upon the water snake Hydra.",
    "borders": {
      "raRange": "10h 51m – 11h 56m",
      "decRange": "-25° 12′ – -06° 40′",
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
        { "x": 84.8, "y": 8.0 },
        { "x": 84.8, "y": 28.8 },
        { "x": 85.0, "y": 62.0 },
        { "x": 79.1, "y": 62.0 },
        { "x": 79.2, "y": 84.9 },
        { "x": 8.0, "y": 85.0 },
        { "x": 8.0, "y": 28.9 },
        { "x": 8.0, "y": 8.1 },
        { "x": 30.4, "y": 8.1 },
        { "x": 84.8, "y": 8.0 }
      ]
    }
  },
  "crux": {
    "resemblance": "The world-famous Southern Cross, an unmistakable diamond-and-cross kite of four brilliant stars (Acrux, Mimosa, Gacrux, Imai) plus companion star Ginan, pointing straight to the South Pole.",
    "borders": {
      "raRange": "11h 56m – 12h 58m",
      "decRange": "-64° 42′ – -55° 41′",
      "borderingConstellations": [
        "Centaurus",
        "Musca"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "The smallest of all 88 constellations (68 sq°), completely enveloped on three sides by Centaurus and to the south by Musca.",
      "boundaryPolygon": [
        { "x": 84.9, "y": 8.2 },
        { "x": 85.0, "y": 85.0 },
        { "x": 8.0, "y": 84.8 },
        { "x": 8.5, "y": 8.0 },
        { "x": 84.9, "y": 8.2 }
      ]
    }
  },
  "cygnus": {
    "resemblance": "A magnificent celestial swan in full flight gliding along the summer Milky Way with wings outstretched and neck extended forward, famously known as the prominent 'Northern Cross' asterism anchored by Deneb.",
    "borders": {
      "raRange": "19h 08m – 22h 03m",
      "decRange": "+27° 44′ – +61° 21′",
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
        { "x": 79.3, "y": 85.0 },
        { "x": 79.4, "y": 79.3 },
        { "x": 76.7, "y": 79.2 },
        { "x": 76.9, "y": 64.4 },
        { "x": 75.8, "y": 64.3 },
        { "x": 76.0, "y": 48.3 },
        { "x": 82.2, "y": 48.4 },
        { "x": 82.4, "y": 39.2 },
        { "x": 84.6, "y": 39.3 },
        { "x": 85.0, "y": 21.0 },
        { "x": 76.2, "y": 20.8 },
        { "x": 76.3, "y": 15.1 },
        { "x": 67.1, "y": 15.0 },
        { "x": 67.2, "y": 11.5 },
        { "x": 61.0, "y": 11.5 },
        { "x": 46.7, "y": 11.3 },
        { "x": 46.8, "y": 8.0 },
        { "x": 45.1, "y": 8.0 },
        { "x": 44.7, "y": 21.9 },
        { "x": 8.3, "y": 21.6 },
        { "x": 8.2, "y": 26.3 },
        { "x": 8.0, "y": 46.4 },
        { "x": 9.6, "y": 46.4 },
        { "x": 9.5, "y": 47.0 },
        { "x": 10.4, "y": 47.0 },
        { "x": 10.3, "y": 64.7 },
        { "x": 14.0, "y": 64.7 },
        { "x": 13.9, "y": 83.1 },
        { "x": 22.3, "y": 83.1 },
        { "x": 35.5, "y": 83.3 },
        { "x": 35.5, "y": 81.0 },
        { "x": 68.6, "y": 81.4 },
        { "x": 68.5, "y": 84.8 },
        { "x": 79.3, "y": 85.0 }
      ]
    }
  },
  "delphinus": {
    "resemblance": "A playful dolphin leaping from the oceanic star clouds of the Milky Way, formed by a tidy diamond asterism ('Job's Coffin') for its head and a curved two-star tail leaping downward.",
    "borders": {
      "raRange": "20h 14m – 21h 09m",
      "decRange": "+02° 24′ – +20° 56′",
      "borderingConstellations": [
        "Aquila",
        "Aquarius",
        "Equuleus",
        "Pegasus",
        "Sagitta",
        "Vulpecula"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "A compact gem just east of Aquila and north of Aquarius, bounded by Pegasus and Equuleus to the east.",
      "boundaryPolygon": [
        { "x": 51.1, "y": 84.9 },
        { "x": 70.8, "y": 85.0 },
        { "x": 71.2, "y": 58.0 },
        { "x": 84.6, "y": 58.1 },
        { "x": 85.0, "y": 28.0 },
        { "x": 75.8, "y": 27.9 },
        { "x": 76.1, "y": 8.2 },
        { "x": 49.4, "y": 8.0 },
        { "x": 49.3, "y": 12.2 },
        { "x": 8.4, "y": 11.9 },
        { "x": 8.0, "y": 43.7 },
        { "x": 22.8, "y": 43.8 },
        { "x": 22.5, "y": 68.1 },
        { "x": 26.0, "y": 68.1 },
        { "x": 25.8, "y": 84.7 },
        { "x": 51.1, "y": 84.9 }
      ]
    }
  },
  "dorado": {
    "resemblance": "A leaping dolphinfish (mahi-mahi) or swordfish with a streamlined body and dorsal fin, hosting the central disc of the dazzling Large Magellanic Cloud satellite galaxy.",
    "borders": {
      "raRange": "03h 53m – 06h 36m",
      "decRange": "-70° 06′ – -48° 40′",
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
        { "x": 85.0, "y": 22.8 },
        { "x": 80.3, "y": 22.9 },
        { "x": 80.5, "y": 34.9 },
        { "x": 71.1, "y": 35.1 },
        { "x": 71.3, "y": 44.1 },
        { "x": 64.2, "y": 44.2 },
        { "x": 65.1, "y": 74.7 },
        { "x": 65.5, "y": 83.7 },
        { "x": 8.9, "y": 85.0 },
        { "x": 8.0, "y": 63.5 },
        { "x": 24.6, "y": 63.1 },
        { "x": 24.3, "y": 52.3 },
        { "x": 38.5, "y": 52.0 },
        { "x": 38.2, "y": 39.4 },
        { "x": 52.3, "y": 39.1 },
        { "x": 52.1, "y": 26.5 },
        { "x": 66.2, "y": 26.2 },
        { "x": 66.0, "y": 8.2 },
        { "x": 72.6, "y": 8.1 },
        { "x": 77.7, "y": 8.0 },
        { "x": 77.8, "y": 15.2 },
        { "x": 84.9, "y": 15.0 },
        { "x": 85.0, "y": 22.8 }
      ]
    }
  },
  "draco": {
    "resemblance": "A giant serpentine dragon winding its coils between the Big and Little Dippers, with a distinctive quadrilateral head ('The Lozenge') marked by bright Eltanin and Rastaban gazing down at Hercules.",
    "borders": {
      "raRange": "09h 22m – 20h 55m",
      "decRange": "+47° 33′ – +86° 28′",
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
        { "x": 85.0, "y": 34.7 },
        { "x": 84.3, "y": 17.9 },
        { "x": 75.0, "y": 18.1 },
        { "x": 75.1, "y": 22.1 },
        { "x": 69.9, "y": 22.2 },
        { "x": 70.0, "y": 28.1 },
        { "x": 60.4, "y": 28.1 },
        { "x": 60.3, "y": 41.9 },
        { "x": 53.8, "y": 41.8 },
        { "x": 53.8, "y": 49.7 },
        { "x": 42.9, "y": 49.3 },
        { "x": 43.0, "y": 41.4 },
        { "x": 37.3, "y": 41.1 },
        { "x": 37.6, "y": 31.2 },
        { "x": 31.2, "y": 30.9 },
        { "x": 31.8, "y": 21.0 },
        { "x": 28.5, "y": 20.8 },
        { "x": 31.1, "y": 9.0 },
        { "x": 10.2, "y": 8.0 },
        { "x": 8.0, "y": 19.8 },
        { "x": 13.8, "y": 20.1 },
        { "x": 13.3, "y": 30.0 },
        { "x": 9.8, "y": 29.8 },
        { "x": 9.5, "y": 45.6 },
        { "x": 11.2, "y": 45.7 },
        { "x": 11.1, "y": 56.6 },
        { "x": 13.9, "y": 56.7 },
        { "x": 13.8, "y": 60.7 },
        { "x": 15.4, "y": 60.7 },
        { "x": 15.4, "y": 63.7 },
        { "x": 17.7, "y": 63.8 },
        { "x": 17.7, "y": 68.8 },
        { "x": 19.9, "y": 68.9 },
        { "x": 19.8, "y": 84.7 },
        { "x": 25.5, "y": 85.0 },
        { "x": 25.5, "y": 79.1 },
        { "x": 33.8, "y": 79.5 },
        { "x": 33.8, "y": 77.5 },
        { "x": 42.1, "y": 77.9 },
        { "x": 42.1, "y": 75.0 },
        { "x": 45.4, "y": 75.1 },
        { "x": 45.4, "y": 70.2 },
        { "x": 50.9, "y": 70.4 },
        { "x": 51.0, "y": 55.5 },
        { "x": 57.0, "y": 55.7 },
        { "x": 57.0, "y": 53.7 },
        { "x": 66.8, "y": 53.8 },
        { "x": 66.8, "y": 48.9 },
        { "x": 71.1, "y": 48.9 },
        { "x": 71.1, "y": 35.0 },
        { "x": 85.0, "y": 34.7 }
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
        { "x": 84.6, "y": 85.0 },
        { "x": 85.0, "y": 55.8 },
        { "x": 78.6, "y": 55.8 },
        { "x": 79.1, "y": 13.3 },
        { "x": 52.3, "y": 13.1 },
        { "x": 42.0, "y": 13.0 },
        { "x": 42.1, "y": 8.2 },
        { "x": 8.8, "y": 8.0 },
        { "x": 8.0, "y": 84.5 },
        { "x": 84.6, "y": 85.0 }
      ]
    }
  },
  "eridanus": {
    "resemblance": "A vast meandering celestial river winding from near the foot of Orion (at star Cursa) southwards through the heavens in long serpentine bends, terminating at the radiant blue-white gem Achernar.",
    "borders": {
      "raRange": "01h 25m – 05h 11m",
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
        "Taurus"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Extends 60 degrees from the celestial equator near Orion down to the deep southern sky near Tucana and Hydrus.",
      "boundaryPolygon": [
        { "x": 38.5, "y": 8.0 },
        { "x": 17.5, "y": 8.2 },
        { "x": 16.4, "y": 8.2 },
        { "x": 16.5, "y": 13.5 },
        { "x": 8.0, "y": 13.6 },
        { "x": 8.1, "y": 22.8 },
        { "x": 11.5, "y": 22.8 },
        { "x": 11.6, "y": 27.4 },
        { "x": 13.3, "y": 27.4 },
        { "x": 13.5, "y": 44.2 },
        { "x": 16.2, "y": 44.2 },
        { "x": 16.3, "y": 47.8 },
        { "x": 18.6, "y": 47.8 },
        { "x": 18.8, "y": 57.1 },
        { "x": 25.2, "y": 57.0 },
        { "x": 25.3, "y": 61.0 },
        { "x": 33.4, "y": 60.9 },
        { "x": 33.5, "y": 66.1 },
        { "x": 42.7, "y": 66.1 },
        { "x": 42.7, "y": 68.7 },
        { "x": 51.1, "y": 68.6 },
        { "x": 51.2, "y": 72.6 },
        { "x": 58.0, "y": 72.5 },
        { "x": 58.0, "y": 75.2 },
        { "x": 63.0, "y": 75.1 },
        { "x": 63.1, "y": 79.1 },
        { "x": 68.2, "y": 79.1 },
        { "x": 68.3, "y": 85.0 },
        { "x": 85.0, "y": 84.9 },
        { "x": 84.9, "y": 78.3 },
        { "x": 79.9, "y": 78.3 },
        { "x": 79.8, "y": 75.7 },
        { "x": 74.8, "y": 75.7 },
        { "x": 74.8, "y": 71.3 },
        { "x": 64.7, "y": 71.4 },
        { "x": 64.5, "y": 60.6 },
        { "x": 51.0, "y": 60.7 },
        { "x": 51.0, "y": 60.2 },
        { "x": 40.9, "y": 60.2 },
        { "x": 40.8, "y": 55.5 },
        { "x": 35.7, "y": 55.6 },
        { "x": 35.5, "y": 40.2 },
        { "x": 57.9, "y": 40.0 },
        { "x": 57.6, "y": 10.1 },
        { "x": 44.7, "y": 10.3 },
        { "x": 38.6, "y": 10.3 },
        { "x": 38.5, "y": 8.0 }
      ]
    }
  },
  "fornax": {
    "resemblance": "A chemical smelting furnace with a glass distillation receiver, designed by Lacaille to celebrate Antoine Lavoisier's revolutionary chemical discoveries.",
    "borders": {
      "raRange": "01h 45m – 03h 50m",
      "decRange": "-39° 31′ – -23° 45′",
      "borderingConstellations": [
        "Cetus",
        "Eridanus",
        "Phoenix",
        "Sculptor"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Enclosed in a gentle bend of Eridanus to the east, Cetus to the north, and Sculptor to the west.",
      "boundaryPolygon": [
        { "x": 84.7, "y": 8.0 },
        { "x": 48.5, "y": 8.5 },
        { "x": 8.0, "y": 9.2 },
        { "x": 8.4, "y": 66.0 },
        { "x": 17.6, "y": 65.8 },
        { "x": 17.7, "y": 83.3 },
        { "x": 36.1, "y": 83.0 },
        { "x": 36.1, "y": 85.0 },
        { "x": 60.6, "y": 84.6 },
        { "x": 85.0, "y": 84.3 },
        { "x": 84.7, "y": 13.5 },
        { "x": 84.7, "y": 8.0 }
      ]
    }
  },
  "gemini": {
    "resemblance": "The heavenly twin brothers Castor and Pollux standing side-by-side with locked arms, outlined by two parallel columns of bright stars descending from their matching heads down to their feet on the Milky Way.",
    "borders": {
      "raRange": "06h 01m – 08h 08m",
      "decRange": "+09° 49′ – +35° 23′",
      "borderingConstellations": [
        "Auriga",
        "Canis Minor",
        "Cancer",
        "Lynx",
        "Monoceros",
        "Orion",
        "Taurus"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Zodiac icon bordered by Taurus and Orion to the west, Cancer to the east, and Auriga and Lynx to the north.",
      "boundaryPolygon": [
        { "x": 69.9, "y": 78.6 },
        { "x": 69.7, "y": 62.1 },
        { "x": 73.1, "y": 62.0 },
        { "x": 72.9, "y": 50.0 },
        { "x": 85.0, "y": 49.8 },
        { "x": 85.0, "y": 45.8 },
        { "x": 84.8, "y": 30.2 },
        { "x": 61.2, "y": 30.6 },
        { "x": 60.9, "y": 8.0 },
        { "x": 30.8, "y": 8.4 },
        { "x": 16.9, "y": 8.6 },
        { "x": 17.0, "y": 14.7 },
        { "x": 8.0, "y": 14.8 },
        { "x": 8.2, "y": 31.3 },
        { "x": 12.4, "y": 31.3 },
        { "x": 12.6, "y": 55.3 },
        { "x": 15.4, "y": 55.3 },
        { "x": 15.5, "y": 74.9 },
        { "x": 26.7, "y": 74.7 },
        { "x": 26.7, "y": 77.7 },
        { "x": 44.8, "y": 77.5 },
        { "x": 44.9, "y": 85.0 },
        { "x": 47.3, "y": 85.0 },
        { "x": 47.3, "y": 78.9 },
        { "x": 69.9, "y": 78.6 }
      ]
    }
  },
  "grus": {
    "resemblance": "A tall, elegant crane with an outstretched neck and slender legs gliding over the southern water constellations, anchored by an acute triangular head and the bright alpha star Alnair.",
    "borders": {
      "raRange": "21h 28m – 23h 27m",
      "decRange": "-56° 23′ – -36° 19′",
      "borderingConstellations": [
        "Indus",
        "Microscopium",
        "Phoenix",
        "Piscis Austrinus",
        "Sculptor",
        "Tucana"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Southern sky fixture located directly south of Piscis Austrinus, bordered by Phoenix to the east and Indus to the west.",
      "boundaryPolygon": [
        { "x": 85.0, "y": 8.6 },
        { "x": 84.7, "y": 41.2 },
        { "x": 84.5, "y": 58.4 },
        { "x": 59.0, "y": 58.2 },
        { "x": 58.7, "y": 85.0 },
        { "x": 8.0, "y": 84.7 },
        { "x": 8.2, "y": 19.5 },
        { "x": 8.2, "y": 8.0 },
        { "x": 21.0, "y": 8.0 },
        { "x": 85.0, "y": 8.6 }
      ]
    }
  },
  "hercules": {
    "resemblance": "The mighty hero kneeling triumphantly with one foot resting upon the head of Draco the dragon, centered around the iconic 'Keystone' quadrilateral asterism that outlines his powerful torso.",
    "borders": {
      "raRange": "15h 48m – 18h 58m",
      "decRange": "+03° 40′ – +51° 19′",
      "borderingConstellations": [
        "Aquila",
        "Boötes",
        "Corona Borealis",
        "Draco",
        "Lyra",
        "Ophiuchus",
        "Serpens",
        "Sagitta",
        "Vulpecula"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Dominates the mid-summer sky between Lyra and Corona Borealis, bounded by Draco to the north and Ophiuchus to the south.",
      "boundaryPolygon": [
        { "x": 71.3, "y": 85.0 },
        { "x": 75.8, "y": 85.0 },
        { "x": 76.0, "y": 65.6 },
        { "x": 80.0, "y": 65.7 },
        { "x": 80.1, "y": 56.0 },
        { "x": 77.3, "y": 55.9 },
        { "x": 77.4, "y": 49.5 },
        { "x": 74.1, "y": 49.4 },
        { "x": 74.2, "y": 47.8 },
        { "x": 70.1, "y": 47.8 },
        { "x": 70.4, "y": 26.8 },
        { "x": 84.6, "y": 26.9 },
        { "x": 85.0, "y": 8.3 },
        { "x": 54.7, "y": 8.0 },
        { "x": 54.6, "y": 9.6 },
        { "x": 24.6, "y": 9.3 },
        { "x": 24.5, "y": 14.1 },
        { "x": 25.9, "y": 14.1 },
        { "x": 25.3, "y": 42.4 },
        { "x": 20.6, "y": 42.3 },
        { "x": 20.5, "y": 48.8 },
        { "x": 8.3, "y": 48.7 },
        { "x": 8.3, "y": 49.5 },
        { "x": 8.2, "y": 56.6 },
        { "x": 8.1, "y": 60.8 },
        { "x": 8.0, "y": 71.3 },
        { "x": 13.0, "y": 71.3 },
        { "x": 23.1, "y": 71.5 },
        { "x": 23.1, "y": 67.7 },
        { "x": 47.5, "y": 68.0 },
        { "x": 47.5, "y": 70.4 },
        { "x": 59.7, "y": 70.5 },
        { "x": 59.5, "y": 84.8 },
        { "x": 71.3, "y": 85.0 }
      ]
    }
  },
  "horologium": {
    "resemblance": "A pendulum clock with escapement and weights, introduced by Lacaille to honor Christiaan Huygens's invention of the pendulum clock. Outlined by an elongated line of faint stars.",
    "borders": {
      "raRange": "02h 13m – 04h 20m",
      "decRange": "-67° 02′ – -39° 38′",
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
        { "x": 8.0, "y": 8.2 },
        { "x": 8.5, "y": 33.5 },
        { "x": 15.1, "y": 33.4 },
        { "x": 15.2, "y": 39.0 },
        { "x": 24.2, "y": 38.9 },
        { "x": 24.3, "y": 45.0 },
        { "x": 36.3, "y": 44.8 },
        { "x": 36.6, "y": 57.0 },
        { "x": 47.3, "y": 56.9 },
        { "x": 48.4, "y": 85.0 },
        { "x": 85.0, "y": 84.7 },
        { "x": 84.3, "y": 59.4 },
        { "x": 84.1, "y": 46.7 },
        { "x": 75.1, "y": 46.8 },
        { "x": 75.0, "y": 38.4 },
        { "x": 66.0, "y": 38.4 },
        { "x": 66.0, "y": 32.8 },
        { "x": 54.0, "y": 32.9 },
        { "x": 53.9, "y": 24.5 },
        { "x": 38.9, "y": 24.7 },
        { "x": 38.8, "y": 19.1 },
        { "x": 22.6, "y": 19.2 },
        { "x": 22.4, "y": 8.0 },
        { "x": 8.0, "y": 8.2 }
      ]
    }
  },
  "hydra": {
    "resemblance": "The monstrous multi-headed water snake slain by Hercules; stretching over 100 degrees across the sky as the largest constellation of all, headed by a neat ring of six stars and winding south of Leo and Virgo.",
    "borders": {
      "raRange": "08h 11m – 15h 03m",
      "decRange": "-35° 42′ – +06° 38′",
      "borderingConstellations": [
        "Antlia",
        "Canis Minor",
        "Centaurus",
        "Cancer",
        "Crater",
        "Corvus",
        "Leo",
        "Libra",
        "Monoceros",
        "Puppis",
        "Pyxis",
        "Sextans",
        "Virgo"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Sprawls across more than 7 hours of RA, touching 13 neighboring constellations along the southern celestial equator.",
      "boundaryPolygon": [
        { "x": 84.9, "y": 20.7 },
        { "x": 84.9, "y": 8.0 },
        { "x": 71.8, "y": 8.3 },
        { "x": 68.0, "y": 8.4 },
        { "x": 68.1, "y": 21.1 },
        { "x": 68.1, "y": 41.1 },
        { "x": 55.0, "y": 41.3 },
        { "x": 55.0, "y": 55.8 },
        { "x": 54.1, "y": 55.8 },
        { "x": 54.1, "y": 65.8 },
        { "x": 42.8, "y": 65.9 },
        { "x": 34.4, "y": 65.9 },
        { "x": 34.4, "y": 61.3 },
        { "x": 31.5, "y": 61.3 },
        { "x": 15.6, "y": 61.1 },
        { "x": 15.6, "y": 65.7 },
        { "x": 8.0, "y": 65.5 },
        { "x": 8.0, "y": 74.6 },
        { "x": 34.4, "y": 75.0 },
        { "x": 34.3, "y": 81.3 },
        { "x": 38.1, "y": 81.4 },
        { "x": 38.1, "y": 85.0 },
        { "x": 52.3, "y": 85.0 },
        { "x": 54.2, "y": 85.0 },
        { "x": 54.1, "y": 78.0 },
        { "x": 57.0, "y": 77.9 },
        { "x": 57.0, "y": 74.3 },
        { "x": 60.7, "y": 74.3 },
        { "x": 60.7, "y": 69.4 },
        { "x": 66.3, "y": 69.3 },
        { "x": 66.3, "y": 64.8 },
        { "x": 70.7, "y": 64.7 },
        { "x": 73.8, "y": 64.7 },
        { "x": 73.8, "y": 55.6 },
        { "x": 79.4, "y": 55.4 },
        { "x": 79.4, "y": 51.8 },
        { "x": 81.9, "y": 51.7 },
        { "x": 81.8, "y": 40.8 },
        { "x": 85.0, "y": 40.7 },
        { "x": 84.9, "y": 20.7 }
      ]
    }
  },
  "hydrus": {
    "resemblance": "The lesser southern water snake (distinct from ancient Hydra), outlined by a clean triangle of 3rd-magnitude stars slithering quietly between the two Magellanic Clouds.",
    "borders": {
      "raRange": "00h 06m – 04h 35m",
      "decRange": "-82° 04′ – -57° 51′",
      "borderingConstellations": [
        "Dorado",
        "Eridanus",
        "Horologium",
        "Mensa",
        "Octans",
        "Reticulum",
        "Tucana"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Far southern sector between Tucana, Octans, and Eridanus, wrapped around the South Celestial Pole.",
      "boundaryPolygon": [
        { "x": 8.0, "y": 37.9 },
        { "x": 8.2, "y": 45.8 },
        { "x": 9.0, "y": 61.7 },
        { "x": 27.1, "y": 61.2 },
        { "x": 29.4, "y": 85.0 },
        { "x": 85.0, "y": 84.2 },
        { "x": 85.0, "y": 60.3 },
        { "x": 72.6, "y": 60.4 },
        { "x": 72.7, "y": 63.5 },
        { "x": 63.1, "y": 63.6 },
        { "x": 62.5, "y": 8.0 },
        { "x": 48.4, "y": 8.2 },
        { "x": 48.7, "y": 36.8 },
        { "x": 31.4, "y": 37.2 },
        { "x": 8.0, "y": 37.9 }
      ]
    }
  },
  "indus": {
    "resemblance": "An indigenous hunter or warrior holding arrows in his hands, created by Dutch navigators to celebrate native peoples encountered during early maritime explorations.",
    "borders": {
      "raRange": "20h 29m – 23h 28m",
      "decRange": "-74° 27′ – -44° 58′",
      "borderingConstellations": [
        "Grus",
        "Microscopium",
        "Octans",
        "Pavo",
        "Telescopium",
        "Tucana"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Bordered by Pavo to the east, Grus to the north, and Octans to the south.",
      "boundaryPolygon": [
        { "x": 57.5, "y": 85.0 },
        { "x": 8.0, "y": 84.6 },
        { "x": 8.2, "y": 65.1 },
        { "x": 41.7, "y": 65.3 },
        { "x": 42.2, "y": 37.8 },
        { "x": 42.4, "y": 19.6 },
        { "x": 59.3, "y": 19.7 },
        { "x": 59.5, "y": 8.0 },
        { "x": 85.0, "y": 8.3 },
        { "x": 84.5, "y": 38.4 },
        { "x": 84.3, "y": 46.2 },
        { "x": 58.9, "y": 45.8 },
        { "x": 57.5, "y": 85.0 }
      ]
    }
  },
  "lacerta": {
    "resemblance": "A small lizard scampering along the northern Milky Way, formed by a tight zigzagging chain of 4th-magnitude stars scurrying between Cygnus and Andromeda.",
    "borders": {
      "raRange": "21h 58m – 22h 58m",
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
        { "x": 84.6, "y": 79.9 },
        { "x": 85.0, "y": 52.5 },
        { "x": 82.4, "y": 52.5 },
        { "x": 82.4, "y": 51.6 },
        { "x": 77.9, "y": 51.6 },
        { "x": 78.6, "y": 20.6 },
        { "x": 65.6, "y": 20.6 },
        { "x": 65.8, "y": 12.6 },
        { "x": 51.6, "y": 12.6 },
        { "x": 51.7, "y": 8.1 },
        { "x": 8.8, "y": 8.0 },
        { "x": 8.6, "y": 21.3 },
        { "x": 8.0, "y": 85.0 },
        { "x": 11.9, "y": 85.0 },
        { "x": 11.9, "y": 83.2 },
        { "x": 74.9, "y": 83.4 },
        { "x": 74.9, "y": 79.9 },
        { "x": 84.6, "y": 79.9 }
      ]
    }
  },
  "leo": {
    "resemblance": "A regal crouching lion facing westward, with the famous 'Sickle' (a backward question mark) outlining its mane and proud head, brilliant blue-white Regulus as its heart, and a triangle tracing its flank and tail.",
    "borders": {
      "raRange": "09h 22m – 11h 58m",
      "decRange": "-06° 42′ – +32° 58′",
      "borderingConstellations": [
        "Cancer",
        "Coma Berenices",
        "Crater",
        "Hydra",
        "Leo Minor",
        "Sextans",
        "Ursa Major",
        "Virgo"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Prominent northern spring zodiac constellation bordered by Cancer to the west, Virgo to the east, and Ursa Major to the north.",
      "boundaryPolygon": [
        { "x": 40.9, "y": 73.3 },
        { "x": 40.9, "y": 59.7 },
        { "x": 75.2, "y": 59.5 },
        { "x": 85.0, "y": 59.4 },
        { "x": 84.5, "y": 8.0 },
        { "x": 66.0, "y": 8.1 },
        { "x": 66.1, "y": 17.8 },
        { "x": 48.0, "y": 17.9 },
        { "x": 48.1, "y": 27.6 },
        { "x": 40.7, "y": 27.7 },
        { "x": 40.7, "y": 23.8 },
        { "x": 33.4, "y": 23.8 },
        { "x": 33.4, "y": 17.0 },
        { "x": 8.0, "y": 17.1 },
        { "x": 8.0, "y": 46.2 },
        { "x": 8.0, "y": 52.0 },
        { "x": 18.3, "y": 52.0 },
        { "x": 18.3, "y": 73.4 },
        { "x": 18.3, "y": 85.0 },
        { "x": 41.0, "y": 84.9 },
        { "x": 40.9, "y": 73.3 }
      ]
    }
  },
  "leo-minor": {
    "resemblance": "A sprightly lion cub trotting just north of Leo, outlined by an understated triangle of stars situated between the paws of Ursa Major and the Sickle of Leo.",
    "borders": {
      "raRange": "09h 23m – 11h 07m",
      "decRange": "+22° 50′ – +41° 26′",
      "borderingConstellations": [
        "Leo",
        "Lynx",
        "Ursa Major"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Wedge situated directly north of Leo's back and south of the hind paws of Ursa Major.",
      "boundaryPolygon": [
        { "x": 85.0, "y": 43.0 },
        { "x": 84.8, "y": 17.2 },
        { "x": 70.1, "y": 17.3 },
        { "x": 70.0, "y": 8.0 },
        { "x": 44.4, "y": 8.2 },
        { "x": 44.5, "y": 16.5 },
        { "x": 17.4, "y": 16.7 },
        { "x": 17.5, "y": 41.5 },
        { "x": 8.0, "y": 41.6 },
        { "x": 8.1, "y": 62.3 },
        { "x": 8.1, "y": 76.8 },
        { "x": 19.1, "y": 76.7 },
        { "x": 19.1, "y": 85.0 },
        { "x": 30.2, "y": 84.9 },
        { "x": 30.1, "y": 64.2 },
        { "x": 57.2, "y": 64.0 },
        { "x": 57.1, "y": 43.3 },
        { "x": 85.0, "y": 43.0 }
      ]
    }
  },
  "lepus": {
    "resemblance": "A nimble hare crouched low in the celestial grass beneath the feet of Orion, fleeing the jaws of Canis Major. Outlined by an irregular quadrilateral with curved ears.",
    "borders": {
      "raRange": "04h 55m – 06h 13m",
      "decRange": "-27° 17′ – -10° 49′",
      "borderingConstellations": [
        "Canis Major",
        "Caelum",
        "Columba",
        "Eridanus",
        "Monoceros",
        "Orion"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Located directly beneath the feet of Orion (Rigel and Saiph), bordered by Canis Major to the east and Eridanus to the west.",
      "boundaryPolygon": [
        { "x": 85.0, "y": 83.9 },
        { "x": 75.1, "y": 84.1 },
        { "x": 8.9, "y": 85.0 },
        { "x": 8.0, "y": 9.0 },
        { "x": 24.8, "y": 8.8 },
        { "x": 69.3, "y": 8.1 },
        { "x": 79.2, "y": 8.0 },
        { "x": 79.4, "y": 24.4 },
        { "x": 84.3, "y": 24.3 },
        { "x": 85.0, "y": 83.9 }
      ]
    }
  },
  "libra": {
    "resemblance": "The balanced scales of cosmic justice held by Virgo, outlined by an open quadrangle of stars featuring Zubeneschamali (the Northern Claw) and Zubenelgenubi (the Southern Claw).",
    "borders": {
      "raRange": "14h 22m – 16h 02m",
      "decRange": "-30° 00′ – -00° 28′",
      "borderingConstellations": [
        "Hydra",
        "Lupus",
        "Ophiuchus",
        "Scorpius",
        "Serpens",
        "Virgo"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Zodiac scales resting on the ecliptic between Virgo to the west and Scorpius/Ophiuchus to the east.",
      "boundaryPolygon": [
        { "x": 46.9, "y": 8.0 },
        { "x": 66.0, "y": 8.1 },
        { "x": 65.8, "y": 29.0 },
        { "x": 85.0, "y": 29.1 },
        { "x": 84.7, "y": 65.6 },
        { "x": 84.6, "y": 72.2 },
        { "x": 53.9, "y": 72.0 },
        { "x": 53.7, "y": 85.0 },
        { "x": 19.1, "y": 84.7 },
        { "x": 19.5, "y": 59.9 },
        { "x": 8.0, "y": 59.8 },
        { "x": 8.4, "y": 28.5 },
        { "x": 8.6, "y": 16.2 },
        { "x": 46.8, "y": 16.5 },
        { "x": 46.9, "y": 8.0 }
      ]
    }
  },
  "lupus": {
    "resemblance": "A mythical wild wolf impaled upon the spear of Centaurus, outlined by an interconnected quadrangle and zigzag of 3rd-magnitude stars in the rich southern Milky Way.",
    "borders": {
      "raRange": "14h 18m – 16h 09m",
      "decRange": "-55° 35′ – -29° 50′",
      "borderingConstellations": [
        "Centaurus",
        "Circinus",
        "Libra",
        "Norma",
        "Scorpius"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Positioned between Centaurus to the west, Scorpius to the east, and Norma to the south.",
      "boundaryPolygon": [
        { "x": 84.4, "y": 85.0 },
        { "x": 68.9, "y": 84.9 },
        { "x": 47.1, "y": 84.7 },
        { "x": 47.2, "y": 81.7 },
        { "x": 35.2, "y": 81.6 },
        { "x": 35.6, "y": 63.6 },
        { "x": 21.6, "y": 63.5 },
        { "x": 22.0, "y": 45.5 },
        { "x": 8.0, "y": 45.4 },
        { "x": 8.6, "y": 8.0 },
        { "x": 22.5, "y": 8.2 },
        { "x": 53.9, "y": 8.5 },
        { "x": 53.5, "y": 45.9 },
        { "x": 85.0, "y": 46.1 },
        { "x": 84.4, "y": 85.0 }
      ]
    }
  },
  "lynx": {
    "resemblance": "An elusive wild lynx with keen night-vision; named by Johannes Hevelius because only an observer with lynx-like eyes could spot its dim, winding chain of stars.",
    "borders": {
      "raRange": "06h 16m – 09h 43m",
      "decRange": "+32° 58′ – +61° 58′",
      "borderingConstellations": [
        "Auriga",
        "Camelopardalis",
        "Cancer",
        "Gemini",
        "Leo Minor",
        "Ursa Major"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "A long, slender northern band stretching between Auriga and Ursa Major, north of Gemini and Cancer.",
      "boundaryPolygon": [
        { "x": 57.4, "y": 79.0 },
        { "x": 57.2, "y": 55.1 },
        { "x": 69.8, "y": 54.8 },
        { "x": 69.6, "y": 40.2 },
        { "x": 76.3, "y": 40.1 },
        { "x": 76.1, "y": 29.4 },
        { "x": 85.0, "y": 29.2 },
        { "x": 84.9, "y": 23.9 },
        { "x": 84.5, "y": 8.0 },
        { "x": 64.4, "y": 8.4 },
        { "x": 64.6, "y": 13.7 },
        { "x": 43.2, "y": 14.2 },
        { "x": 33.2, "y": 14.3 },
        { "x": 33.7, "y": 48.9 },
        { "x": 17.1, "y": 49.1 },
        { "x": 17.2, "y": 62.4 },
        { "x": 8.0, "y": 62.5 },
        { "x": 8.0, "y": 68.5 },
        { "x": 15.4, "y": 68.4 },
        { "x": 15.5, "y": 85.0 },
        { "x": 43.4, "y": 84.5 },
        { "x": 48.9, "y": 84.4 },
        { "x": 48.9, "y": 79.1 },
        { "x": 57.4, "y": 79.0 }
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
        { "x": 40.4, "y": 85.0 },
        { "x": 40.4, "y": 83.3 },
        { "x": 71.4, "y": 83.6 },
        { "x": 71.7, "y": 69.6 },
        { "x": 83.5, "y": 69.7 },
        { "x": 85.0, "y": 8.6 },
        { "x": 81.4, "y": 8.6 },
        { "x": 28.6, "y": 8.1 },
        { "x": 23.5, "y": 8.0 },
        { "x": 23.1, "y": 22.0 },
        { "x": 8.6, "y": 21.8 },
        { "x": 8.0, "y": 46.3 },
        { "x": 10.6, "y": 46.3 },
        { "x": 10.2, "y": 69.0 },
        { "x": 16.4, "y": 69.0 },
        { "x": 16.2, "y": 77.8 },
        { "x": 16.1, "y": 84.8 },
        { "x": 40.4, "y": 85.0 }
      ]
    }
  },
  "mensa": {
    "resemblance": "Table Mountain overlooking Cape Town, South Africa, commemorated by Lacaille as a flat-topped celestial plateau harboring part of the Large Magellanic Cloud.",
    "borders": {
      "raRange": "03h 13m – 07h 37m",
      "decRange": "-85° 16′ – -69° 45′",
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
        { "x": 14.1, "y": 85.0 },
        { "x": 85.0, "y": 81.5 },
        { "x": 82.8, "y": 69.1 },
        { "x": 80.5, "y": 32.0 },
        { "x": 62.0, "y": 32.8 },
        { "x": 61.3, "y": 8.0 },
        { "x": 26.4, "y": 9.8 },
        { "x": 27.2, "y": 34.6 },
        { "x": 8.0, "y": 35.5 },
        { "x": 11.0, "y": 72.7 },
        { "x": 14.1, "y": 85.0 }
      ]
    }
  },
  "microscopium": {
    "resemblance": "An 18th-century optical compound microscope with eyepiece and specimen stage, created by Lacaille to celebrate scientific microscopy. Outlined by an open bend of faint stars.",
    "borders": {
      "raRange": "20h 28m – 21h 28m",
      "decRange": "-45° 05′ – -27° 28′",
      "borderingConstellations": [
        "Capricornus",
        "Grus",
        "Indus",
        "Piscis Austrinus",
        "Sagittarius"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Tucked directly south of Capricornus, bordered by Piscis Austrinus to the east and Sagittarius/Telescopium to the west.",
      "boundaryPolygon": [
        { "x": 85.0, "y": 8.6 },
        { "x": 9.1, "y": 8.0 },
        { "x": 8.6, "y": 47.3 },
        { "x": 8.0, "y": 84.4 },
        { "x": 83.6, "y": 85.0 },
        { "x": 85.0, "y": 8.6 }
      ]
    }
  },
  "monoceros": {
    "resemblance": "A mythical wild unicorn with a gleaming horn galloping through the winter Milky Way, positioned between Orion and Canis Major and harboring stellar nurseries like the Rosette Nebula.",
    "borders": {
      "raRange": "05h 56m – 08h 11m",
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
        { "x": 70.8, "y": 47.6 },
        { "x": 70.5, "y": 14.6 },
        { "x": 68.2, "y": 14.6 },
        { "x": 68.2, "y": 8.0 },
        { "x": 46.9, "y": 8.4 },
        { "x": 46.9, "y": 15.0 },
        { "x": 44.7, "y": 15.0 },
        { "x": 44.8, "y": 29.9 },
        { "x": 44.2, "y": 29.9 },
        { "x": 44.3, "y": 43.1 },
        { "x": 38.1, "y": 43.2 },
        { "x": 38.1, "y": 48.2 },
        { "x": 8.0, "y": 48.7 },
        { "x": 8.3, "y": 85.0 },
        { "x": 32.7, "y": 84.6 },
        { "x": 75.3, "y": 83.9 },
        { "x": 85.0, "y": 83.7 },
        { "x": 84.8, "y": 60.6 },
        { "x": 70.9, "y": 60.8 },
        { "x": 70.8, "y": 47.6 }
      ]
    }
  },
  "musca": {
    "resemblance": "A small fly buzzing around the Southern Cross, outlined by a crisp trapezoid and tail hovering right beside the dark void of the Coalsack Nebula.",
    "borders": {
      "raRange": "11h 19m – 13h 51m",
      "decRange": "-75° 41′ – -64° 38′",
      "borderingConstellations": [
        "Apus",
        "Carina",
        "Centaurus",
        "Chamaeleon",
        "Circinus",
        "Crux"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Located immediately south of Crux (the Southern Cross) and Centaurus, with Chamaeleon to the south.",
      "boundaryPolygon": [
        { "x": 84.5, "y": 8.3 },
        { "x": 85.0, "y": 85.0 },
        { "x": 8.0, "y": 84.6 },
        { "x": 8.7, "y": 49.7 },
        { "x": 9.0, "y": 14.9 },
        { "x": 14.2, "y": 15.0 },
        { "x": 14.3, "y": 8.0 },
        { "x": 35.1, "y": 8.3 },
        { "x": 66.3, "y": 8.4 },
        { "x": 84.5, "y": 8.3 }
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
        { "x": 68.5, "y": 85.0 },
        { "x": 8.0, "y": 84.3 },
        { "x": 9.7, "y": 22.8 },
        { "x": 10.0, "y": 8.0 },
        { "x": 33.3, "y": 8.3 },
        { "x": 51.7, "y": 8.5 },
        { "x": 51.3, "y": 33.9 },
        { "x": 69.8, "y": 34.1 },
        { "x": 69.2, "y": 59.6 },
        { "x": 85.0, "y": 59.7 },
        { "x": 84.9, "y": 64.0 },
        { "x": 69.1, "y": 63.8 },
        { "x": 68.5, "y": 85.0 }
      ]
    }
  },
  "octans": {
    "resemblance": "The reflecting octant navigational instrument invented by John Hadley in 1730; historic for hosting the South Celestial Pole (marked by Polaris Australis / Sigma Octantis).",
    "borders": {
      "raRange": "13h 56m – 07h 27m",
      "decRange": "-85° 16′ – -74° 18′",
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
        { "x": 40.3, "y": 60.7 },
        { "x": 26.1, "y": 62.5 },
        { "x": 26.6, "y": 80.0 },
        { "x": 8.8, "y": 85.0 },
        { "x": 8.0, "y": 67.5 },
        { "x": 85.0, "y": 70.0 },
        { "x": 65.1, "y": 65.3 },
        { "x": 65.9, "y": 12.7 },
        { "x": 51.5, "y": 9.1 },
        { "x": 43.1, "y": 8.1 },
        { "x": 40.3, "y": 8.0 },
        { "x": 40.3, "y": 60.7 }
      ]
    }
  },
  "ophiuchus": {
    "resemblance": "The colossal mythological healer Asclepius wrestling an enormous serpent (Serpens) wrapped around his waist. A huge upright bell-shaped polygon of stars standing proudly upon Scorpius.",
    "borders": {
      "raRange": "16h 02m – 18h 46m",
      "decRange": "-30° 13′ – +14° 23′",
      "borderingConstellations": [
        "Aquila",
        "Hercules",
        "Libra",
        "Scorpius",
        "Serpens",
        "Sagittarius"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Straddles the celestial equator and ecliptic, splitting Serpens in two, bounded by Hercules to the north and Scorpius to the south.",
      "boundaryPolygon": [
        { "x": 75.2, "y": 33.4 },
        { "x": 75.3, "y": 26.4 },
        { "x": 61.7, "y": 26.3 },
        { "x": 61.9, "y": 11.1 },
        { "x": 47.9, "y": 10.9 },
        { "x": 47.9, "y": 8.3 },
        { "x": 19.8, "y": 8.0 },
        { "x": 19.7, "y": 12.0 },
        { "x": 8.1, "y": 11.9 },
        { "x": 8.0, "y": 21.8 },
        { "x": 19.6, "y": 22.0 },
        { "x": 19.6, "y": 25.0 },
        { "x": 14.6, "y": 24.9 },
        { "x": 14.6, "y": 27.5 },
        { "x": 19.5, "y": 27.6 },
        { "x": 19.5, "y": 32.7 },
        { "x": 31.2, "y": 32.9 },
        { "x": 31.1, "y": 39.8 },
        { "x": 27.3, "y": 39.7 },
        { "x": 27.2, "y": 50.1 },
        { "x": 35.6, "y": 50.2 },
        { "x": 35.6, "y": 53.1 },
        { "x": 37.9, "y": 53.1 },
        { "x": 38.0, "y": 50.2 },
        { "x": 49.7, "y": 50.3 },
        { "x": 49.5, "y": 60.7 },
        { "x": 37.4, "y": 60.6 },
        { "x": 37.0, "y": 84.7 },
        { "x": 60.9, "y": 85.0 },
        { "x": 61.1, "y": 75.6 },
        { "x": 74.7, "y": 75.8 },
        { "x": 74.8, "y": 66.6 },
        { "x": 71.8, "y": 66.6 },
        { "x": 71.8, "y": 64.8 },
        { "x": 74.8, "y": 64.9 },
        { "x": 75.1, "y": 47.2 },
        { "x": 84.9, "y": 47.3 },
        { "x": 85.0, "y": 39.1 },
        { "x": 75.2, "y": 39.0 },
        { "x": 75.2, "y": 33.4 }
      ]
    }
  },
  "orion": {
    "resemblance": "The supreme celestial Hunter brandishing a raised club and lion-skin shield, framed by fiery Betelgeuse and diamond Rigel, with the world's most famous three-star Belt and hanging Sword.",
    "borders": {
      "raRange": "04h 43m – 06h 26m",
      "decRange": "-10° 59′ – +22° 53′",
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
        { "x": 85.0, "y": 59.5 },
        { "x": 84.5, "y": 24.2 },
        { "x": 68.6, "y": 24.4 },
        { "x": 68.6, "y": 23.2 },
        { "x": 52.1, "y": 23.4 },
        { "x": 52.1, "y": 24.5 },
        { "x": 40.0, "y": 24.6 },
        { "x": 40.2, "y": 31.5 },
        { "x": 32.6, "y": 31.5 },
        { "x": 32.4, "y": 19.0 },
        { "x": 35.4, "y": 19.0 },
        { "x": 35.2, "y": 8.0 },
        { "x": 27.0, "y": 8.1 },
        { "x": 27.0, "y": 11.1 },
        { "x": 12.0, "y": 11.2 },
        { "x": 12.1, "y": 20.3 },
        { "x": 8.0, "y": 20.4 },
        { "x": 8.2, "y": 32.9 },
        { "x": 8.3, "y": 37.4 },
        { "x": 11.3, "y": 37.4 },
        { "x": 11.7, "y": 60.2 },
        { "x": 11.8, "y": 69.2 },
        { "x": 30.2, "y": 69.1 },
        { "x": 30.5, "y": 85.0 },
        { "x": 64.3, "y": 84.7 },
        { "x": 64.1, "y": 68.8 },
        { "x": 82.9, "y": 68.6 },
        { "x": 82.7, "y": 59.5 },
        { "x": 85.0, "y": 59.5 }
      ]
    }
  },
  "pavo": {
    "resemblance": "A resplendent peacock displaying its iridescent eye-spotted tail feathers across the southern sky, crowned by the brilliant 2nd-magnitude bluish star Peacock (Alpha Pavonis).",
    "borders": {
      "raRange": "17h 41m – 21h 33m",
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
        { "x": 73.0, "y": 85.0 },
        { "x": 8.0, "y": 82.8 },
        { "x": 9.1, "y": 20.0 },
        { "x": 28.7, "y": 20.6 },
        { "x": 28.9, "y": 8.0 },
        { "x": 75.0, "y": 9.7 },
        { "x": 85.0, "y": 10.0 },
        { "x": 84.2, "y": 54.0 },
        { "x": 74.2, "y": 53.6 },
        { "x": 73.0, "y": 85.0 }
      ]
    }
  },
  "pegasus": {
    "resemblance": "The mythical winged stallion soaring upside-down across the autumn sky, anchored by the iconic 'Great Square of Pegasus' outlining its equine torso, with starry legs kicking toward the zenith.",
    "borders": {
      "raRange": "21h 09m – 00h 15m",
      "decRange": "+02° 20′ – +36° 36′",
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
        { "x": 77.7, "y": 84.5 },
        { "x": 77.9, "y": 60.9 },
        { "x": 83.2, "y": 61.0 },
        { "x": 83.2, "y": 62.5 },
        { "x": 84.9, "y": 62.5 },
        { "x": 85.0, "y": 45.3 },
        { "x": 80.0, "y": 45.2 },
        { "x": 80.1, "y": 36.3 },
        { "x": 75.9, "y": 36.2 },
        { "x": 76.0, "y": 26.1 },
        { "x": 68.1, "y": 26.0 },
        { "x": 68.2, "y": 8.1 },
        { "x": 64.7, "y": 8.0 },
        { "x": 61.6, "y": 8.0 },
        { "x": 61.5, "y": 10.2 },
        { "x": 41.1, "y": 10.1 },
        { "x": 41.1, "y": 11.2 },
        { "x": 39.9, "y": 11.2 },
        { "x": 24.0, "y": 11.2 },
        { "x": 24.0, "y": 16.6 },
        { "x": 17.8, "y": 16.6 },
        { "x": 17.8, "y": 18.3 },
        { "x": 11.5, "y": 18.3 },
        { "x": 11.5, "y": 25.8 },
        { "x": 9.9, "y": 25.8 },
        { "x": 9.9, "y": 39.2 },
        { "x": 8.0, "y": 39.2 },
        { "x": 8.0, "y": 41.5 },
        { "x": 8.0, "y": 60.6 },
        { "x": 11.5, "y": 60.6 },
        { "x": 11.5, "y": 66.2 },
        { "x": 15.7, "y": 66.2 },
        { "x": 15.7, "y": 71.8 },
        { "x": 42.6, "y": 71.9 },
        { "x": 42.6, "y": 84.2 },
        { "x": 61.2, "y": 84.4 },
        { "x": 61.2, "y": 84.9 },
        { "x": 69.4, "y": 85.0 },
        { "x": 69.5, "y": 82.8 },
        { "x": 74.4, "y": 82.8 },
        { "x": 74.4, "y": 84.5 },
        { "x": 77.7, "y": 84.5 }
      ]
    }
  },
  "perseus": {
    "resemblance": "The legendary hero Perseus striding across the northern Milky Way holding aloft the severed head of Medusa (marked by the eerie eclipsing demon star Algol) and a curved sword.",
    "borders": {
      "raRange": "01h 30m – 04h 51m",
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
        { "x": 54.1, "y": 84.3 },
        { "x": 54.1, "y": 75.2 },
        { "x": 57.5, "y": 75.1 },
        { "x": 57.5, "y": 67.6 },
        { "x": 58.6, "y": 67.6 },
        { "x": 58.3, "y": 30.0 },
        { "x": 69.3, "y": 29.9 },
        { "x": 69.4, "y": 39.5 },
        { "x": 78.1, "y": 39.4 },
        { "x": 78.0, "y": 31.2 },
        { "x": 85.0, "y": 31.1 },
        { "x": 84.9, "y": 20.2 },
        { "x": 77.2, "y": 20.2 },
        { "x": 77.1, "y": 10.7 },
        { "x": 72.2, "y": 10.7 },
        { "x": 72.2, "y": 8.0 },
        { "x": 60.0, "y": 8.1 },
        { "x": 60.0, "y": 12.2 },
        { "x": 44.6, "y": 12.5 },
        { "x": 43.0, "y": 12.5 },
        { "x": 43.1, "y": 18.0 },
        { "x": 39.2, "y": 18.0 },
        { "x": 39.3, "y": 24.9 },
        { "x": 8.0, "y": 25.4 },
        { "x": 8.6, "y": 70.5 },
        { "x": 13.0, "y": 70.4 },
        { "x": 13.1, "y": 85.0 },
        { "x": 39.2, "y": 84.5 },
        { "x": 54.1, "y": 84.3 }
      ]
    }
  },
  "phoenix": {
    "resemblance": "The mythical immortal firebird with outspread glowing wings rising triumphantly from its funeral pyre, outlined by an open triangle and long curved neck anchored by bright Ankaa.",
    "borders": {
      "raRange": "23h 27m – 02h 25m",
      "decRange": "-57° 51′ – -39° 18′",
      "borderingConstellations": [
        "Eridanus",
        "Fornax",
        "Grus",
        "Sculptor",
        "Tucana"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Southern jewel bordered by Grus to the west, Eridanus to the north and east, and Tucana to the south.",
      "boundaryPolygon": [
        { "x": 85.0, "y": 8.0 },
        { "x": 84.9, "y": 78.6 },
        { "x": 84.9, "y": 84.9 },
        { "x": 34.0, "y": 85.0 },
        { "x": 33.9, "y": 64.2 },
        { "x": 27.5, "y": 64.3 },
        { "x": 27.5, "y": 56.0 },
        { "x": 21.1, "y": 56.1 },
        { "x": 21.0, "y": 42.3 },
        { "x": 8.2, "y": 42.4 },
        { "x": 8.0, "y": 8.5 },
        { "x": 25.1, "y": 8.3 },
        { "x": 69.6, "y": 8.0 },
        { "x": 85.0, "y": 8.0 }
      ]
    }
  },
  "pictor": {
    "resemblance": "A classical artist's studio easel with a palette and canvas, created by Lacaille to commemorate fine art. Traced by an acute three-star frame near Canopus and the Large Magellanic Cloud.",
    "borders": {
      "raRange": "04h 33m – 06h 52m",
      "decRange": "-64° 09′ – -42° 48′",
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
        { "x": 34.7, "y": 8.8 },
        { "x": 67.8, "y": 8.1 },
        { "x": 73.3, "y": 8.0 },
        { "x": 73.5, "y": 20.6 },
        { "x": 84.5, "y": 20.4 },
        { "x": 84.7, "y": 29.4 },
        { "x": 85.0, "y": 47.4 },
        { "x": 68.5, "y": 47.8 },
        { "x": 68.8, "y": 60.4 },
        { "x": 52.2, "y": 60.7 },
        { "x": 52.6, "y": 73.3 },
        { "x": 36.0, "y": 73.6 },
        { "x": 36.4, "y": 84.5 },
        { "x": 17.0, "y": 84.8 },
        { "x": 8.7, "y": 85.0 },
        { "x": 8.0, "y": 63.4 },
        { "x": 19.1, "y": 63.2 },
        { "x": 18.8, "y": 52.3 },
        { "x": 29.9, "y": 52.1 },
        { "x": 29.7, "y": 43.1 },
        { "x": 35.3, "y": 43.0 },
        { "x": 35.1, "y": 36.7 },
        { "x": 34.7, "y": 8.8 }
      ]
    }
  },
  "pisces": {
    "resemblance": "Two sacred fishes swimming in divergent directions, bound together at their tails by a long celestial ribbon tied at the knot star Alrescha, one fish swimming northward and the other westward.",
    "borders": {
      "raRange": "22h 51m – 02h 07m",
      "decRange": "-06° 18′ – +33° 41′",
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
        { "x": 85.0, "y": 71.6 },
        { "x": 85.0, "y": 67.7 },
        { "x": 85.0, "y": 57.1 },
        { "x": 59.3, "y": 57.1 },
        { "x": 59.3, "y": 52.3 },
        { "x": 55.4, "y": 52.3 },
        { "x": 55.4, "y": 47.4 },
        { "x": 52.0, "y": 47.4 },
        { "x": 52.0, "y": 31.1 },
        { "x": 35.2, "y": 31.1 },
        { "x": 35.2, "y": 25.8 },
        { "x": 38.3, "y": 25.8 },
        { "x": 38.3, "y": 8.0 },
        { "x": 21.8, "y": 8.1 },
        { "x": 21.9, "y": 17.7 },
        { "x": 15.7, "y": 17.7 },
        { "x": 15.8, "y": 23.5 },
        { "x": 15.9, "y": 52.6 },
        { "x": 8.0, "y": 52.6 },
        { "x": 8.1, "y": 67.9 },
        { "x": 47.5, "y": 67.7 },
        { "x": 47.5, "y": 71.5 },
        { "x": 47.5, "y": 85.0 },
        { "x": 59.3, "y": 85.0 },
        { "x": 59.3, "y": 79.2 },
        { "x": 84.9, "y": 79.3 },
        { "x": 85.0, "y": 71.6 }
      ]
    }
  },
  "piscis-austrinus": {
    "resemblance": "The solitary Southern Fish drinking the stream of celestial water poured from the urn of Aquarius, famously anchored by the brilliant solitary 1st-magnitude star Fomalhaut.",
    "borders": {
      "raRange": "21h 27m – 23h 07m",
      "decRange": "-36° 28′ – -24° 49′",
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
        { "x": 8.1, "y": 8.0 },
        { "x": 60.4, "y": 8.5 },
        { "x": 85.0, "y": 8.9 },
        { "x": 84.9, "y": 25.4 },
        { "x": 84.6, "y": 85.0 },
        { "x": 8.0, "y": 84.1 },
        { "x": 8.1, "y": 8.0 }
      ]
    }
  },
  "puppis": {
    "resemblance": "The elevated poop deck and stern of the mythological ship Argo Navis, overflowing with dazzling open star clusters, star clouds, and nebulae along the southern Milky Way.",
    "borders": {
      "raRange": "06h 03m – 08h 28m",
      "decRange": "-51° 06′ – -11° 15′",
      "borderingConstellations": [
        "Canis Major",
        "Carina",
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
        { "x": 39.9, "y": 8.0 },
        { "x": 40.5, "y": 50.5 },
        { "x": 65.5, "y": 50.2 },
        { "x": 66.0, "y": 69.6 },
        { "x": 84.6, "y": 69.4 },
        { "x": 85.0, "y": 84.3 },
        { "x": 21.0, "y": 85.0 },
        { "x": 20.6, "y": 70.0 },
        { "x": 8.9, "y": 70.1 },
        { "x": 8.7, "y": 58.1 },
        { "x": 8.1, "y": 19.9 },
        { "x": 8.0, "y": 8.3 },
        { "x": 17.0, "y": 8.2 },
        { "x": 39.9, "y": 8.0 }
      ]
    }
  },
  "pyxis": {
    "resemblance": "The magnetic mariner's compass used by seafaring explorers, formed by a linear needle of stars pointing northward along the southern Milky Way plane.",
    "borders": {
      "raRange": "08h 27m – 09h 28m",
      "decRange": "-37° 18′ – -17° 25′",
      "borderingConstellations": [
        "Antlia",
        "Hydra",
        "Puppis",
        "Vela"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Small rectangular sector adjoining the stern and sails of Argo Navis (Puppis and Vela), with Hydra to the north.",
      "boundaryPolygon": [
        { "x": 83.7, "y": 8.0 },
        { "x": 67.3, "y": 8.1 },
        { "x": 67.4, "y": 15.9 },
        { "x": 29.3, "y": 16.1 },
        { "x": 29.6, "y": 35.5 },
        { "x": 8.0, "y": 35.6 },
        { "x": 8.7, "y": 85.0 },
        { "x": 85.0, "y": 84.5 },
        { "x": 83.7, "y": 8.0 }
      ]
    }
  },
  "reticulum": {
    "resemblance": "A reticle or crosshair net inside a telescope eyepiece, used by astronomers to measure precise star coordinates; formed by an exceptionally neat small diamond of stars.",
    "borders": {
      "raRange": "03h 13m – 04h 37m",
      "decRange": "-67° 15′ – -52° 45′",
      "borderingConstellations": [
        "Dorado",
        "Horologium",
        "Hydrus"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "A compact diamond sector nestled between the Large Magellanic Cloud in Dorado and the river Eridanus/Horologium.",
      "boundaryPolygon": [
        { "x": 85.0, "y": 83.9 },
        { "x": 9.8, "y": 85.0 },
        { "x": 8.0, "y": 39.9 },
        { "x": 21.7, "y": 39.7 },
        { "x": 21.3, "y": 26.4 },
        { "x": 39.6, "y": 26.1 },
        { "x": 39.2, "y": 8.4 },
        { "x": 48.3, "y": 8.3 },
        { "x": 66.6, "y": 8.0 },
        { "x": 67.1, "y": 31.0 },
        { "x": 83.4, "y": 30.8 },
        { "x": 85.0, "y": 83.9 }
      ]
    }
  },
  "sagitta": {
    "resemblance": "A slender cosmic arrow flying through the summer Milky Way, complete with fletched feathered tail and pointed tip, shot between Aquila the Eagle and Cygnus the Swan.",
    "borders": {
      "raRange": "18h 57m – 20h 21m",
      "decRange": "+16° 05′ – +21° 39′",
      "borderingConstellations": [
        "Aquila",
        "Delphinus",
        "Hercules",
        "Vulpecula"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Third smallest constellation in the sky (80 sq°), flying right in the heart of the Summer Triangle.",
      "boundaryPolygon": [
        { "x": 84.9, "y": 49.2 },
        { "x": 85.0, "y": 13.5 },
        { "x": 63.7, "y": 12.6 },
        { "x": 63.6, "y": 39.1 },
        { "x": 31.3, "y": 37.7 },
        { "x": 31.4, "y": 8.9 },
        { "x": 8.2, "y": 8.0 },
        { "x": 8.2, "y": 18.4 },
        { "x": 8.0, "y": 84.1 },
        { "x": 14.0, "y": 84.3 },
        { "x": 31.1, "y": 85.0 },
        { "x": 31.1, "y": 79.2 },
        { "x": 77.4, "y": 81.2 },
        { "x": 77.5, "y": 48.9 },
        { "x": 84.9, "y": 49.2 }
      ]
    }
  },
  "sagittarius": {
    "resemblance": "An armed centaur archer drawing his bow toward the heart of Scorpius, world-renowned for the iconic 'Teapot' asterism appearing to boil over the dense galactic core of the Milky Way.",
    "borders": {
      "raRange": "17h 43m – 20h 29m",
      "decRange": "-45° 17′ – -11° 41′",
      "borderingConstellations": [
        "Aquila",
        "Capricornus",
        "Corona Australis",
        "Microscopium",
        "Ophiuchus",
        "Scorpius",
        "Scutum",
        "Serpens",
        "Telescopium"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Zodiac powerhouse hosting the Galactic Center, bordered by Scorpius and Ophiuchus to the west and Capricornus to the east.",
      "boundaryPolygon": [
        { "x": 49.7, "y": 8.4 },
        { "x": 49.6, "y": 17.5 },
        { "x": 66.9, "y": 17.8 },
        { "x": 85.0, "y": 18.1 },
        { "x": 84.6, "y": 50.1 },
        { "x": 78.1, "y": 50.0 },
        { "x": 77.9, "y": 66.1 },
        { "x": 40.7, "y": 65.5 },
        { "x": 40.4, "y": 85.0 },
        { "x": 8.0, "y": 84.6 },
        { "x": 8.5, "y": 44.5 },
        { "x": 17.8, "y": 44.6 },
        { "x": 18.1, "y": 8.0 },
        { "x": 49.7, "y": 8.4 }
      ]
    }
  },
  "scorpius": {
    "resemblance": "One of the most unmistakable figures in the heavens: an ominous scorpion with grasping claws, the glowing red supergiant heart Antares, and a gracefully curling tail culminating in the double stinger Shaula and Lesath.",
    "borders": {
      "raRange": "15h 47m – 17h 59m",
      "decRange": "-45° 46′ – -08° 18′",
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
        { "x": 76.5, "y": 8.1 },
        { "x": 64.3, "y": 8.0 },
        { "x": 64.0, "y": 29.1 },
        { "x": 60.2, "y": 29.0 },
        { "x": 60.2, "y": 31.1 },
        { "x": 64.0, "y": 31.1 },
        { "x": 63.8, "y": 42.1 },
        { "x": 46.9, "y": 41.9 },
        { "x": 46.7, "y": 53.0 },
        { "x": 16.9, "y": 52.7 },
        { "x": 8.7, "y": 52.6 },
        { "x": 8.4, "y": 67.0 },
        { "x": 8.0, "y": 84.5 },
        { "x": 57.6, "y": 85.0 },
        { "x": 57.7, "y": 77.8 },
        { "x": 72.5, "y": 78.0 },
        { "x": 73.0, "y": 52.3 },
        { "x": 84.7, "y": 52.4 },
        { "x": 85.0, "y": 32.9 },
        { "x": 76.2, "y": 32.8 },
        { "x": 76.5, "y": 8.1 }
      ]
    }
  },
  "sculptor": {
    "resemblance": "A sculptor's studio featuring a tripod workbench holding a freshly carved marble bust and carving mallet, hosting the South Galactic Pole and nearby Sculptor Galaxy (NGC 253).",
    "borders": {
      "raRange": "23h 07m – 01h 46m",
      "decRange": "-39° 22′ – -24° 48′",
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
        { "x": 85.0, "y": 8.1 },
        { "x": 60.9, "y": 8.0 },
        { "x": 8.0, "y": 8.4 },
        { "x": 8.2, "y": 85.0 },
        { "x": 58.1, "y": 84.6 },
        { "x": 75.3, "y": 84.7 },
        { "x": 75.3, "y": 68.8 },
        { "x": 84.9, "y": 68.9 },
        { "x": 85.0, "y": 8.1 }
      ]
    }
  },
  "scutum": {
    "resemblance": "The royal battle shield of Polish King Jan III Sobieski commemorating the 1683 victory at the Battle of Vienna, sitting over the brilliant Scutum Star Cloud.",
    "borders": {
      "raRange": "18h 22m – 18h 59m",
      "decRange": "-15° 57′ – -03° 50′",
      "borderingConstellations": [
        "Aquila",
        "Serpens",
        "Sagittarius"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "A compact diamond sector (109 sq°) situated directly between Aquila, Ophiuchus, and Sagittarius.",
      "boundaryPolygon": [
        { "x": 83.8, "y": 85.0 },
        { "x": 8.0, "y": 84.3 },
        { "x": 8.4, "y": 59.1 },
        { "x": 9.2, "y": 8.0 },
        { "x": 44.0, "y": 8.3 },
        { "x": 85.0, "y": 8.7 },
        { "x": 83.8, "y": 85.0 }
      ]
    }
  },
  "serpens": {
    "resemblance": "An enormous celestial serpent held by Ophiuchus; unique among all 88 constellations for being split into two distinct disjoint sectors: Serpens Caput (the Head) to the west and Serpens Cauda (the Tail) to the east.",
    "borders": {
      "raRange": "15h 10m – 18h 58m",
      "decRange": "-16° 08′ – +25° 40′",
      "borderingConstellations": [
        "Aquila",
        "Boötes",
        "Corona Borealis",
        "Hercules",
        "Libra",
        "Ophiuchus",
        "Sagittarius",
        "Scutum",
        "Virgo"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "The only constellation split into two separated halves by Ophiuchus: Serpens Caput (Ser-Cap) in the west and Serpens Cauda (Ser-Cau) in the east.",
      "boundaryPolygon": [
        { "x": 83.9, "y": 76.5 },
        { "x": 84.2, "y": 55.5 },
        { "x": 85.0, "y": 8.4 },
        { "x": 78.6, "y": 8.3 },
        { "x": 24.4, "y": 8.0 },
        { "x": 24.1, "y": 18.5 },
        { "x": 31.6, "y": 18.5 },
        { "x": 31.3, "y": 34.2 },
        { "x": 20.6, "y": 34.2 },
        { "x": 20.1, "y": 65.6 },
        { "x": 8.3, "y": 65.5 },
        { "x": 8.2, "y": 76.0 },
        { "x": 8.0, "y": 84.5 },
        { "x": 30.4, "y": 84.7 },
        { "x": 83.8, "y": 85.0 },
        { "x": 83.9, "y": 76.5 }
      ],
      "sectors": [
        {
          "name": "Serpens Caput (Ser-Cap)",
          "shortCode": "Ser-Cap",
          "englishName": "Serpent’s Head (Western Sector)",
          "raRange": "15h 10m – 16h 23m",
          "decRange": "-03° 43′ – +25° 40′",
          "borderingConstellations": [
            "Boötes",
            "Corona Borealis",
            "Hercules",
            "Libra",
            "Ophiuchus",
            "Virgo"
          ],
          "boundaryPolygon": [
            { "x": 83.9, "y": 76.5 },
            { "x": 84.2, "y": 55.5 },
            { "x": 85.0, "y": 8.4 },
            { "x": 78.6, "y": 8.3 },
            { "x": 24.4, "y": 8.0 },
            { "x": 24.1, "y": 18.5 },
            { "x": 31.6, "y": 18.5 },
            { "x": 31.3, "y": 34.2 },
            { "x": 20.6, "y": 34.2 },
            { "x": 20.1, "y": 65.6 },
            { "x": 8.3, "y": 65.5 },
            { "x": 8.2, "y": 76.0 },
            { "x": 8.0, "y": 84.5 },
            { "x": 30.4, "y": 84.7 },
            { "x": 83.8, "y": 85.0 },
            { "x": 83.9, "y": 76.5 }
          ]
        },
        {
          "name": "Serpens Cauda (Ser-Cau)",
          "shortCode": "Ser-Cau",
          "englishName": "Serpent’s Tail (Eastern Sector)",
          "raRange": "17h 17m – 18h 58m",
          "decRange": "-16° 08′ – +06° 25′",
          "borderingConstellations": [
            "Aquila",
            "Ophiuchus",
            "Sagittarius",
            "Scutum"
          ],
          "boundaryPolygon": [
            { "x": 36.0, "y": 29.7 },
            { "x": 36.1, "y": 19.5 },
            { "x": 28.2, "y": 19.4 },
            { "x": 28.2, "y": 14.2 },
            { "x": 36.2, "y": 14.4 },
            { "x": 36.2, "y": 8.4 },
            { "x": 17.5, "y": 8.1 },
            { "x": 8.2, "y": 8.0 },
            { "x": 8.0, "y": 22.5 },
            { "x": 20.9, "y": 22.7 },
            { "x": 20.8, "y": 29.5 },
            { "x": 20.7, "y": 43.2 },
            { "x": 35.9, "y": 43.4 },
            { "x": 35.4, "y": 84.3 },
            { "x": 65.0, "y": 84.7 },
            { "x": 84.8, "y": 85.0 },
            { "x": 85.0, "y": 64.5 },
            { "x": 66.0, "y": 64.3 },
            { "x": 66.0, "y": 70.0 },
            { "x": 62.2, "y": 69.9 },
            { "x": 62.2, "y": 64.2 },
            { "x": 48.6, "y": 64.0 },
            { "x": 48.8, "y": 43.5 },
            { "x": 54.9, "y": 43.6 },
            { "x": 55.0, "y": 30.0 },
            { "x": 36.0, "y": 29.7 }
          ]
        }
      ]
    }
  },
  "sextans": {
    "resemblance": "The astronomical measuring sextant used by Johannes Hevelius to chart stellar coordinates before the advent of telescopic sights. Outlined by an open angle of stars.",
    "borders": {
      "raRange": "09h 41m – 10h 52m",
      "decRange": "-11° 40′ – +06° 26′",
      "borderingConstellations": [
        "Crater",
        "Hydra",
        "Leo"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Located directly south of Leo's sickle and chest, bordered by Crater and Hydra to the south.",
      "boundaryPolygon": [
        { "x": 84.7, "y": 37.8 },
        { "x": 84.4, "y": 8.0 },
        { "x": 8.0, "y": 8.4 },
        { "x": 8.1, "y": 38.2 },
        { "x": 8.2, "y": 63.7 },
        { "x": 8.3, "y": 85.0 },
        { "x": 85.0, "y": 84.6 },
        { "x": 84.7, "y": 37.8 }
      ]
    }
  },
  "taurus": {
    "resemblance": "The fierce head and sweeping horns of a charging bull, marked by the prominent 'V'-shaped Hyades cluster, the burning red eye Aldebaran, and carrying the glittering Pleiades cluster upon its shoulder.",
    "borders": {
      "raRange": "03h 23m – 06h 01m",
      "decRange": "-01° 21′ – +31° 06′",
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
        { "x": 85.0, "y": 84.9 },
        { "x": 85.0, "y": 80.7 },
        { "x": 84.8, "y": 57.2 },
        { "x": 84.6, "y": 35.7 },
        { "x": 82.2, "y": 35.7 },
        { "x": 81.9, "y": 8.0 },
        { "x": 48.5, "y": 8.4 },
        { "x": 48.6, "y": 10.0 },
        { "x": 41.2, "y": 10.1 },
        { "x": 41.3, "y": 13.7 },
        { "x": 8.0, "y": 14.1 },
        { "x": 8.0, "y": 15.3 },
        { "x": 8.2, "y": 27.6 },
        { "x": 13.5, "y": 27.5 },
        { "x": 13.7, "y": 39.0 },
        { "x": 11.7, "y": 39.0 },
        { "x": 11.9, "y": 52.1 },
        { "x": 16.7, "y": 52.0 },
        { "x": 16.7, "y": 44.9 },
        { "x": 24.5, "y": 44.8 },
        { "x": 24.5, "y": 43.6 },
        { "x": 35.2, "y": 43.4 },
        { "x": 35.2, "y": 44.6 },
        { "x": 45.5, "y": 44.5 },
        { "x": 45.9, "y": 81.2 },
        { "x": 76.2, "y": 80.8 },
        { "x": 76.2, "y": 85.0 },
        { "x": 85.0, "y": 84.9 }
      ]
    }
  },
  "telescopium": {
    "resemblance": "A long aerial refracting telescope resting upon an observation stand, introduced by Lacaille to celebrate optical instruments that revealed deep space.",
    "borders": {
      "raRange": "18h 09m – 20h 30m",
      "decRange": "-56° 59′ – -45° 05′",
      "borderingConstellations": [
        "Ara",
        "Corona Australis",
        "Indus",
        "Pavo",
        "Sagittarius"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Located directly south of Corona Australis and Sagittarius, bordered by Ara to the west and Pavo to the south.",
      "boundaryPolygon": [
        { "x": 8.0, "y": 82.4 },
        { "x": 8.6, "y": 8.0 },
        { "x": 46.8, "y": 9.2 },
        { "x": 85.0, "y": 10.6 },
        { "x": 84.2, "y": 85.0 },
        { "x": 8.0, "y": 82.4 }
      ]
    }
  },
  "triangulum": {
    "resemblance": "A neat, sharp isosceles triangle formed by three stars in the northern autumn sky, celebrated since antiquity and home to the majestic face-on Triangulum Galaxy (M33).",
    "borders": {
      "raRange": "01h 31m – 02h 51m",
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
        { "x": 69.9, "y": 84.9 },
        { "x": 69.8, "y": 65.2 },
        { "x": 85.0, "y": 65.1 },
        { "x": 84.9, "y": 32.3 },
        { "x": 84.8, "y": 19.2 },
        { "x": 50.0, "y": 19.5 },
        { "x": 50.0, "y": 8.0 },
        { "x": 19.6, "y": 8.4 },
        { "x": 16.7, "y": 8.4 },
        { "x": 16.8, "y": 26.4 },
        { "x": 8.0, "y": 26.5 },
        { "x": 8.1, "y": 48.4 },
        { "x": 25.7, "y": 48.2 },
        { "x": 25.9, "y": 70.6 },
        { "x": 55.2, "y": 70.2 },
        { "x": 55.3, "y": 85.0 },
        { "x": 69.9, "y": 84.9 }
      ]
    }
  },
  "triangulum-australe": {
    "resemblance": "A vivid equilateral triangle of three bright 2nd- and 3rd-magnitude stars glowing in the southern Milky Way, nicknamed 'The Three Patriarchs' by navigators.",
    "borders": {
      "raRange": "14h 56m – 17h 14m",
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
        { "x": 84.6, "y": 85.0 },
        { "x": 85.0, "y": 66.2 },
        { "x": 79.3, "y": 66.1 },
        { "x": 79.8, "y": 36.6 },
        { "x": 71.2, "y": 36.4 },
        { "x": 71.5, "y": 17.0 },
        { "x": 65.8, "y": 16.8 },
        { "x": 65.9, "y": 9.3 },
        { "x": 29.1, "y": 8.0 },
        { "x": 29.0, "y": 15.5 },
        { "x": 23.5, "y": 15.3 },
        { "x": 23.2, "y": 34.7 },
        { "x": 17.6, "y": 34.5 },
        { "x": 17.4, "y": 45.1 },
        { "x": 14.5, "y": 45.0 },
        { "x": 14.1, "y": 63.8 },
        { "x": 8.5, "y": 63.6 },
        { "x": 8.0, "y": 82.4 },
        { "x": 84.6, "y": 85.0 }
      ]
    }
  },
  "tucana": {
    "resemblance": "A vivid South American toucan with a long, colorful bill, nestled beside the Small Magellanic Cloud and the dazzling globular cluster 47 Tucanae.",
    "borders": {
      "raRange": "22h 08m – 01h 25m",
      "decRange": "-75° 21′ – -56° 19′",
      "borderingConstellations": [
        "Grus",
        "Hydrus",
        "Indus",
        "Octans",
        "Phoenix"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Bordered by Grus to the north, Phoenix to the northeast, Hydrus to the south, and Octans toward the pole.",
      "boundaryPolygon": [
        { "x": 53.8, "y": 80.8 },
        { "x": 38.8, "y": 80.8 },
        { "x": 21.9, "y": 80.8 },
        { "x": 22.0, "y": 84.9 },
        { "x": 8.9, "y": 85.0 },
        { "x": 8.0, "y": 14.2 },
        { "x": 54.2, "y": 14.1 },
        { "x": 54.2, "y": 8.0 },
        { "x": 85.0, "y": 8.3 },
        { "x": 84.6, "y": 50.8 },
        { "x": 54.0, "y": 50.5 },
        { "x": 53.8, "y": 80.8 }
      ]
    }
  },
  "ursa-major": {
    "resemblance": "The Great She-Bear stalking across the northern sky; its hindquarters and arched tail are traced by the world-famous 'Big Dipper' (or Plough), with extended stars forming her snout, neck, and stepping claws.",
    "borders": {
      "raRange": "08h 09m – 14h 29m",
      "decRange": "+28° 18′ – +73° 08′",
      "borderingConstellations": [
        "Boötes",
        "Canes Venatici",
        "Camelopardalis",
        "Coma Berenices",
        "Draco",
        "Leo Minor",
        "Leo",
        "Lynx"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Third-largest constellation in the sky, spanning from near the pole down to Leo, guiding stargazers to Polaris with its pointer stars.",
      "boundaryPolygon": [
        { "x": 65.9, "y": 62.5 },
        { "x": 70.9, "y": 62.4 },
        { "x": 70.9, "y": 53.8 },
        { "x": 79.9, "y": 53.6 },
        { "x": 79.6, "y": 31.3 },
        { "x": 85.0, "y": 31.2 },
        { "x": 84.2, "y": 8.0 },
        { "x": 70.0, "y": 8.3 },
        { "x": 44.7, "y": 8.6 },
        { "x": 44.8, "y": 20.6 },
        { "x": 36.9, "y": 20.6 },
        { "x": 36.9, "y": 24.9 },
        { "x": 19.1, "y": 24.8 },
        { "x": 19.1, "y": 26.5 },
        { "x": 8.2, "y": 26.4 },
        { "x": 8.0, "y": 39.3 },
        { "x": 12.6, "y": 39.3 },
        { "x": 12.5, "y": 51.3 },
        { "x": 18.9, "y": 51.4 },
        { "x": 18.9, "y": 43.7 },
        { "x": 35.9, "y": 43.8 },
        { "x": 35.9, "y": 57.5 },
        { "x": 36.9, "y": 57.5 },
        { "x": 36.9, "y": 76.4 },
        { "x": 36.9, "y": 85.0 },
        { "x": 38.5, "y": 85.0 },
        { "x": 48.9, "y": 85.0 },
        { "x": 48.9, "y": 76.4 },
        { "x": 51.5, "y": 76.4 },
        { "x": 51.5, "y": 66.1 },
        { "x": 58.9, "y": 66.0 },
        { "x": 58.9, "y": 62.5 },
        { "x": 65.9, "y": 62.5 }
      ]
    }
  },
  "ursa-minor": {
    "resemblance": "The Little She-Bear, traced by the famous 'Little Dipper' asterism with the radiant North Celestial Pole star Polaris marking the very tip of its curved tail.",
    "borders": {
      "raRange": "13h 03m – 09h 03m",
      "decRange": "+65° 24′ – +88° 40′",
      "borderingConstellations": [
        "Camelopardalis",
        "Cepheus",
        "Draco"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Surrounds the North Celestial Pole (+90° Dec), covering all 24 hours of Right Ascension, tightly encircled by Draco, Cepheus, and Camelopardalis.",
      "boundaryPolygon": [
        { "x": 85.0, "y": 48.8 },
        { "x": 84.9, "y": 72.0 },
        { "x": 81.2, "y": 71.8 },
        { "x": 81.2, "y": 85.0 },
        { "x": 74.9, "y": 84.3 },
        { "x": 74.9, "y": 71.1 },
        { "x": 71.6, "y": 70.6 },
        { "x": 71.8, "y": 54.1 },
        { "x": 68.1, "y": 53.5 },
        { "x": 68.5, "y": 37.0 },
        { "x": 66.6, "y": 36.7 },
        { "x": 68.1, "y": 17.0 },
        { "x": 56.0, "y": 15.3 },
        { "x": 56.1, "y": 14.7 },
        { "x": 47.1, "y": 14.0 },
        { "x": 48.2, "y": 8.0 },
        { "x": 42.6, "y": 8.2 },
        { "x": 36.5, "y": 9.0 },
        { "x": 28.1, "y": 10.2 },
        { "x": 8.0, "y": 11.6 },
        { "x": 9.4, "y": 16.5 },
        { "x": 80.6, "y": 17.0 },
        { "x": 79.6, "y": 38.5 },
        { "x": 82.9, "y": 38.8 },
        { "x": 82.9, "y": 48.7 },
        { "x": 85.0, "y": 48.8 }
      ]
    }
  },
  "vela": {
    "resemblance": "The billowing canvas sails of the mythical ship Argo Navis caught in the celestial wind, featuring the famous 'False Cross' asterism and the glowing Vela Supernova Remnant.",
    "borders": {
      "raRange": "08h 03m – 11h 06m",
      "decRange": "-57° 10′ – -37° 10′",
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
        { "x": 8.2, "y": 85.0 },
        { "x": 8.0, "y": 20.6 },
        { "x": 49.8, "y": 20.0 },
        { "x": 49.7, "y": 8.5 },
        { "x": 75.2, "y": 8.0 },
        { "x": 75.4, "y": 32.0 },
        { "x": 84.7, "y": 31.8 },
        { "x": 85.0, "y": 61.6 },
        { "x": 80.7, "y": 61.7 },
        { "x": 80.8, "y": 70.4 },
        { "x": 73.6, "y": 70.6 },
        { "x": 73.7, "y": 76.3 },
        { "x": 63.9, "y": 76.5 },
        { "x": 64.0, "y": 84.2 },
        { "x": 8.2, "y": 85.0 }
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
        "Crater",
        "Corvus",
        "Hydra",
        "Leo",
        "Libra",
        "Serpens"
      ],
      "iauDelporteYear": 1930,
      "boundarySummary": "Second largest constellation in the sky (1294 sq°), centered on the ecliptic between Leo and Libra, rich in deep-sky galaxies.",
      "boundaryPolygon": [
        { "x": 85.0, "y": 39.3 },
        { "x": 85.0, "y": 16.4 },
        { "x": 77.4, "y": 16.4 },
        { "x": 77.4, "y": 10.2 },
        { "x": 56.6, "y": 10.2 },
        { "x": 56.6, "y": 8.1 },
        { "x": 42.3, "y": 8.0 },
        { "x": 42.2, "y": 22.6 },
        { "x": 8.1, "y": 22.2 },
        { "x": 8.0, "y": 38.8 },
        { "x": 17.0, "y": 39.0 },
        { "x": 16.9, "y": 55.6 },
        { "x": 25.9, "y": 55.7 },
        { "x": 25.8, "y": 84.8 },
        { "x": 56.5, "y": 85.0 },
        { "x": 56.5, "y": 62.1 },
        { "x": 78.2, "y": 62.2 },
        { "x": 78.2, "y": 51.8 },
        { "x": 85.0, "y": 51.8 },
        { "x": 85.0, "y": 39.3 }
      ]
    }
  },
  "volans": {
    "resemblance": "A tropical flying fish skimming above the ocean waves with translucent pectoral wings extended, outlined by a compact quadrangle and wings in the southern sky.",
    "borders": {
      "raRange": "06h 31m – 09h 04m",
      "decRange": "-75° 30′ – -64° 06′",
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
        { "x": 82.7, "y": 8.0 },
        { "x": 83.6, "y": 48.5 },
        { "x": 85.0, "y": 82.3 },
        { "x": 52.0, "y": 83.6 },
        { "x": 9.7, "y": 85.0 },
        { "x": 8.0, "y": 10.7 },
        { "x": 75.1, "y": 8.3 },
        { "x": 82.7, "y": 8.0 }
      ]
    }
  },
  "vulpecula": {
    "resemblance": "A sly little fox carrying a captured goose in its jaws, created by Hevelius; home to the breathtaking Dumbbell Nebula (M27) and the first discovered pulsar (PSR B1919+21).",
    "borders": {
      "raRange": "18h 57m – 21h 31m",
      "decRange": "+19° 24′ – +29° 29′",
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
        { "x": 84.9, "y": 70.9 },
        { "x": 85.0, "y": 37.2 },
        { "x": 73.2, "y": 36.7 },
        { "x": 73.3, "y": 21.4 },
        { "x": 60.9, "y": 20.9 },
        { "x": 61.0, "y": 9.4 },
        { "x": 23.2, "y": 8.0 },
        { "x": 23.2, "y": 15.6 },
        { "x": 8.1, "y": 15.2 },
        { "x": 8.0, "y": 49.5 },
        { "x": 13.0, "y": 49.7 },
        { "x": 13.0, "y": 80.2 },
        { "x": 19.0, "y": 80.4 },
        { "x": 33.6, "y": 80.9 },
        { "x": 33.6, "y": 73.2 },
        { "x": 43.2, "y": 73.6 },
        { "x": 43.2, "y": 67.9 },
        { "x": 55.7, "y": 68.4 },
        { "x": 55.7, "y": 84.3 },
        { "x": 73.3, "y": 85.0 },
        { "x": 73.3, "y": 70.4 },
        { "x": 84.9, "y": 70.9 }
      ]
    }
  }
};
