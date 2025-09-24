/**
 * ========================================================================================
 * PERU ADDRESS DATABASE (MTC) - CORRECTLY PARSED
 * ========================================================================================
 *
 * SOURCE: Complete MTC postal code data from geodir-codigo-postal-mtc
 * GENERATED: 2025-09-24 03:10:33
 *
 * This file contains the correctly parsed Peru address database with proper handling
 * of comma-separated values in the Capitales (cities) and Distritos (districts) columns.
 *
 * IMPORTANT:
 * - Each zip code can serve multiple cities and districts
 * - Cities and districts are properly separated
 * - No duplicate entries
 *
 * Structure: DEPARTAMENTO → PROVINCIA → DISTRITOS/CITIES → CODIGO POSTAL (multiple per entity)
 * Statistics:
 * - Departments: 25
 * - Provinces: 196
 * - Districts: 1839
 * - Cities: 1839
 */

export interface District {
  code: string;
  name: string;
  zipCodes: string[];
}

export interface City {
  code: string;
  name: string;
  zipCodes: string[];
}

export interface Province {
  code: string;
  name: string;
  districts: District[];
  cities: City[];
}

export interface Department {
  code: string;
  name: string;
  provinces: Province[];
}

export const PERU_ADDRESSES: Department[] = [
  {
    "code": "AMA",
    "name": "Amazonas",
    "provinces": [
      {
        "code": "BAG",
        "name": "Bagua",
        "districts": [
          {
            "code": "BAG-ARA",
            "name": "Aramango",
            "zipCodes": [
              "01800",
              "01801"
            ]
          },
          {
            "code": "BAG-BAG",
            "name": "Bagua",
            "zipCodes": [
              "01720",
              "01721"
            ]
          },
          {
            "code": "BAG-COP",
            "name": "Copallin",
            "zipCodes": [
              "01710",
              "01711"
            ]
          },
          {
            "code": "BAG-EL ",
            "name": "El Parco",
            "zipCodes": [
              "01730"
            ]
          },
          {
            "code": "BAG-IMA",
            "name": "Imaza",
            "zipCodes": [
              "01810",
              "01811"
            ]
          },
          {
            "code": "BAG-LA ",
            "name": "La Peca",
            "zipCodes": [
              "01740",
              "01741"
            ]
          }
        ],
        "cities": [
          {
            "code": "BAG-ARA",
            "name": "Aramango",
            "zipCodes": [
              "01800",
              "01801"
            ]
          },
          {
            "code": "BAG-BAG",
            "name": "Bagua",
            "zipCodes": [
              "01720",
              "01721"
            ]
          },
          {
            "code": "BAG-CHI",
            "name": "Chiriaco",
            "zipCodes": [
              "01810",
              "01811"
            ]
          },
          {
            "code": "BAG-COP",
            "name": "Copallin",
            "zipCodes": [
              "01710",
              "01711"
            ]
          },
          {
            "code": "BAG-EL ",
            "name": "El Parco",
            "zipCodes": [
              "01730"
            ]
          },
          {
            "code": "BAG-LA ",
            "name": "La Peca",
            "zipCodes": [
              "01740",
              "01741"
            ]
          }
        ]
      },
      {
        "code": "BON",
        "name": "Bongara",
        "districts": [
          {
            "code": "BON-CHI",
            "name": "Chisquilla",
            "zipCodes": [
              "01260"
            ]
          },
          {
            "code": "BON-CHU",
            "name": "Churuja",
            "zipCodes": [
              "01110"
            ]
          },
          {
            "code": "BON-COR",
            "name": "Corosha",
            "zipCodes": [
              "01270"
            ]
          },
          {
            "code": "BON-CUI",
            "name": "Cuispes",
            "zipCodes": [
              "01140"
            ]
          },
          {
            "code": "BON-FLO",
            "name": "Florida",
            "zipCodes": [
              "01150",
              "01151"
            ]
          },
          {
            "code": "BON-JAZ",
            "name": "Jazan",
            "zipCodes": [
              "01130",
              "01131"
            ]
          },
          {
            "code": "BON-JUM",
            "name": "Jumbilla",
            "zipCodes": [
              "01250"
            ]
          },
          {
            "code": "BON-REC",
            "name": "Recta",
            "zipCodes": [
              "01240"
            ]
          },
          {
            "code": "BON-SAN",
            "name": "San Carlos",
            "zipCodes": [
              "01120"
            ]
          },
          {
            "code": "UTC-SHI",
            "name": "Shipasbamba",
            "zipCodes": [
              "01600"
            ]
          },
          {
            "code": "BON-VAL",
            "name": "Valera",
            "zipCodes": [
              "01100"
            ]
          },
          {
            "code": "BON-YAM",
            "name": "Yambrasbamba",
            "zipCodes": [
              "01160",
              "01161"
            ]
          }
        ],
        "cities": [
          {
            "code": "BON-CHI",
            "name": "Chisquilla",
            "zipCodes": [
              "01260"
            ]
          },
          {
            "code": "BON-CHU",
            "name": "Churuja",
            "zipCodes": [
              "01110"
            ]
          },
          {
            "code": "BON-COR",
            "name": "Corosha",
            "zipCodes": [
              "01270"
            ]
          },
          {
            "code": "BON-CUI",
            "name": "Cuispes",
            "zipCodes": [
              "01140"
            ]
          },
          {
            "code": "BON-FLO",
            "name": "Florida (Pomacochas)",
            "zipCodes": [
              "01150",
              "01151"
            ]
          },
          {
            "code": "BON-JUM",
            "name": "Jumbilla",
            "zipCodes": [
              "01250"
            ]
          },
          {
            "code": "BON-PED",
            "name": "Pedro Ruiz Gallo",
            "zipCodes": [
              "01130",
              "01131"
            ]
          },
          {
            "code": "BON-REC",
            "name": "Recta",
            "zipCodes": [
              "01240"
            ]
          },
          {
            "code": "BON-SAN",
            "name": "San Carlos",
            "zipCodes": [
              "01120"
            ]
          },
          {
            "code": "UTC-SHI",
            "name": "Shipasbamba",
            "zipCodes": [
              "01600"
            ]
          },
          {
            "code": "BON-VAL",
            "name": "Valera (San Pablo)",
            "zipCodes": [
              "01100"
            ]
          },
          {
            "code": "BON-YAM",
            "name": "Yambrasbamba",
            "zipCodes": [
              "01160",
              "01161"
            ]
          }
        ]
      },
      {
        "code": "CHA",
        "name": "Chachapoyas",
        "districts": [
          {
            "code": "BON-ASU",
            "name": "Asunción",
            "zipCodes": [
              "01230"
            ]
          },
          {
            "code": "LUY-BAL",
            "name": "Balsas",
            "zipCodes": [
              "01475"
            ]
          },
          {
            "code": "CHA-CHA",
            "name": "Chachapoyas",
            "zipCodes": [
              "01000",
              "01001"
            ]
          },
          {
            "code": "BON-CHE",
            "name": "Cheto",
            "zipCodes": [
              "01315"
            ]
          },
          {
            "code": "BON-CHI",
            "name": "Chiliquin",
            "zipCodes": [
              "01220"
            ]
          },
          {
            "code": "LUY-CHU",
            "name": "Chuquibamba",
            "zipCodes": [
              "01470"
            ]
          },
          {
            "code": "BON-GRA",
            "name": "Granada",
            "zipCodes": [
              "01200"
            ]
          },
          {
            "code": "CHA-HUA",
            "name": "Huancas",
            "zipCodes": [
              "01000"
            ]
          },
          {
            "code": "LUY-LA ",
            "name": "La Jalca",
            "zipCodes": [
              "01440",
              "01441"
            ]
          },
          {
            "code": "LUY-LEI",
            "name": "Leimebamba",
            "zipCodes": [
              "01465"
            ]
          },
          {
            "code": "ROD-LEV",
            "name": "Levanto",
            "zipCodes": [
              "01400"
            ]
          },
          {
            "code": "ROD-MAG",
            "name": "Magdalena",
            "zipCodes": [
              "01410"
            ]
          },
          {
            "code": "LUY-MAR",
            "name": "Mariscal Castilla",
            "zipCodes": [
              "01455"
            ]
          },
          {
            "code": "BON-MOL",
            "name": "Molinopampa",
            "zipCodes": [
              "01320"
            ]
          },
          {
            "code": "LUY-MON",
            "name": "Montevideo",
            "zipCodes": [
              "01460"
            ]
          },
          {
            "code": "BON-OLL",
            "name": "Olleros",
            "zipCodes": [
              "01280"
            ]
          },
          {
            "code": "BON-QUI",
            "name": "Quinjalca",
            "zipCodes": [
              "01210"
            ]
          },
          {
            "code": "BON-SAN",
            "name": "San Francisco de Daguas",
            "zipCodes": [
              "01310"
            ]
          },
          {
            "code": "ROD-SAN",
            "name": "San Isidro de Maino",
            "zipCodes": [
              "01405"
            ]
          },
          {
            "code": "BON-SOL",
            "name": "Soloco",
            "zipCodes": [
              "01305"
            ]
          },
          {
            "code": "BON-SON",
            "name": "Sonche",
            "zipCodes": [
              "01300"
            ]
          }
        ],
        "cities": [
          {
            "code": "BON-ASU",
            "name": "Asuncion",
            "zipCodes": [
              "01230"
            ]
          },
          {
            "code": "LUY-BAL",
            "name": "Balsas",
            "zipCodes": [
              "01475"
            ]
          },
          {
            "code": "CHA-CHA",
            "name": "Chachapoyas",
            "zipCodes": [
              "01000",
              "01001"
            ]
          },
          {
            "code": "BON-CHE",
            "name": "Cheto",
            "zipCodes": [
              "01315"
            ]
          },
          {
            "code": "BON-CHI",
            "name": "Chiliquin",
            "zipCodes": [
              "01220"
            ]
          },
          {
            "code": "LUY-CHU",
            "name": "Chuquibamba",
            "zipCodes": [
              "01470"
            ]
          },
          {
            "code": "BON-DAG",
            "name": "Daguas",
            "zipCodes": [
              "01310"
            ]
          },
          {
            "code": "LUY-DUR",
            "name": "Duraznopampa",
            "zipCodes": [
              "01455"
            ]
          },
          {
            "code": "BON-GRA",
            "name": "Granada",
            "zipCodes": [
              "01200"
            ]
          },
          {
            "code": "CHA-HUA",
            "name": "Huancas",
            "zipCodes": [
              "01000"
            ]
          },
          {
            "code": "LUY-LA ",
            "name": "La Jalca",
            "zipCodes": [
              "01440",
              "01441"
            ]
          },
          {
            "code": "LUY-LEI",
            "name": "Leimebamba",
            "zipCodes": [
              "01465"
            ]
          },
          {
            "code": "ROD-LEV",
            "name": "Levanto",
            "zipCodes": [
              "01400"
            ]
          },
          {
            "code": "ROD-MAG",
            "name": "Magdalena",
            "zipCodes": [
              "01410"
            ]
          },
          {
            "code": "ROD-MAI",
            "name": "Maino",
            "zipCodes": [
              "01405"
            ]
          },
          {
            "code": "BON-MOL",
            "name": "Molinopampa",
            "zipCodes": [
              "01320"
            ]
          },
          {
            "code": "LUY-MON",
            "name": "Montevideo",
            "zipCodes": [
              "01460"
            ]
          },
          {
            "code": "BON-OLL",
            "name": "Olleros",
            "zipCodes": [
              "01280"
            ]
          },
          {
            "code": "BON-QUI",
            "name": "Quinjalca",
            "zipCodes": [
              "01210"
            ]
          },
          {
            "code": "BON-SAN",
            "name": "San Juan de Sonche",
            "zipCodes": [
              "01300"
            ]
          },
          {
            "code": "BON-SOL",
            "name": "Soloco",
            "zipCodes": [
              "01305"
            ]
          }
        ]
      },
      {
        "code": "CON",
        "name": "Condorcanqui",
        "districts": [
          {
            "code": "CON-EL ",
            "name": "El Cenepa",
            "zipCodes": [
              "01820",
              "01821"
            ]
          },
          {
            "code": "CON-NIE",
            "name": "Nieva",
            "zipCodes": [
              "01830",
              "01831"
            ]
          },
          {
            "code": "CON-RÍO",
            "name": "Río Santiago",
            "zipCodes": [
              "01840",
              "01841"
            ]
          }
        ],
        "cities": [
          {
            "code": "CON-HUA",
            "name": "Huampami",
            "zipCodes": [
              "01820",
              "01821"
            ]
          },
          {
            "code": "CON-PUE",
            "name": "Puerto Galilea",
            "zipCodes": [
              "01840",
              "01841"
            ]
          },
          {
            "code": "CON-SAN",
            "name": "Santa Maria de Nieva",
            "zipCodes": [
              "01830",
              "01831"
            ]
          }
        ]
      },
      {
        "code": "LUY",
        "name": "Luya",
        "districts": [
          {
            "code": "LUY-CAM",
            "name": "Camporredondo",
            "zipCodes": [
              "01550",
              "01551"
            ]
          },
          {
            "code": "LUY-COC",
            "name": "Cocabamba",
            "zipCodes": [
              "01480"
            ]
          },
          {
            "code": "LUY-COL",
            "name": "Colcamar",
            "zipCodes": [
              "01420"
            ]
          },
          {
            "code": "LUY-CON",
            "name": "Conila",
            "zipCodes": [
              "01530"
            ]
          },
          {
            "code": "LUY-ING",
            "name": "Inguilpata",
            "zipCodes": [
              "01505"
            ]
          },
          {
            "code": "LUY-LAM",
            "name": "Lamud",
            "zipCodes": [
              "01515"
            ]
          },
          {
            "code": "LUY-LON",
            "name": "Longuita",
            "zipCodes": [
              "01425"
            ]
          },
          {
            "code": "LUY-LON",
            "name": "Lonya Chico",
            "zipCodes": [
              "01500"
            ]
          },
          {
            "code": "LUY-LUY",
            "name": "Luya",
            "zipCodes": [
              "01510"
            ]
          },
          {
            "code": "UTC-LUY",
            "name": "Luya Viejo",
            "zipCodes": [
              "01575"
            ]
          },
          {
            "code": "LUY-MAR",
            "name": "María",
            "zipCodes": [
              "01430"
            ]
          },
          {
            "code": "LUY-OCA",
            "name": "Ocalli",
            "zipCodes": [
              "01545"
            ]
          },
          {
            "code": "LUY-OCU",
            "name": "Ocumal",
            "zipCodes": [
              "01535"
            ]
          },
          {
            "code": "LUY-PIS",
            "name": "Pisuquia",
            "zipCodes": [
              "01485",
              "01486"
            ]
          },
          {
            "code": "LUY-PRO",
            "name": "Providencia",
            "zipCodes": [
              "01540"
            ]
          },
          {
            "code": "LUY-SAN",
            "name": "San Cristobal",
            "zipCodes": [
              "01520"
            ]
          },
          {
            "code": "LUY-SAN",
            "name": "San Francisco del Yeso",
            "zipCodes": [
              "01450"
            ]
          },
          {
            "code": "LUY-SAN",
            "name": "San Jerónimo",
            "zipCodes": [
              "01525"
            ]
          },
          {
            "code": "LUY-SAN",
            "name": "San Juan de Lopecancha",
            "zipCodes": [
              "01435"
            ]
          },
          {
            "code": "UTC-SAN",
            "name": "Santa Catalina",
            "zipCodes": [
              "01580"
            ]
          },
          {
            "code": "LUY-SAN",
            "name": "Santo Tomas",
            "zipCodes": [
              "01445"
            ]
          },
          {
            "code": "LUY-TIN",
            "name": "Tingo",
            "zipCodes": [
              "01415"
            ]
          },
          {
            "code": "UTC-TRI",
            "name": "Trita",
            "zipCodes": [
              "01570"
            ]
          }
        ],
        "cities": [
          {
            "code": "LUY-CAM",
            "name": "Camporredondo",
            "zipCodes": [
              "01550",
              "01551"
            ]
          },
          {
            "code": "LUY-COC",
            "name": "Cocabamba",
            "zipCodes": [
              "01480"
            ]
          },
          {
            "code": "LUY-COH",
            "name": "Cohechan",
            "zipCodes": [
              "01530"
            ]
          },
          {
            "code": "LUY-COL",
            "name": "Colcamar",
            "zipCodes": [
              "01420"
            ]
          },
          {
            "code": "LUY-COL",
            "name": "Collonce",
            "zipCodes": [
              "01535"
            ]
          },
          {
            "code": "LUY-ING",
            "name": "Inguilpata",
            "zipCodes": [
              "01505"
            ]
          },
          {
            "code": "LUY-LAM",
            "name": "Lamud",
            "zipCodes": [
              "01515"
            ]
          },
          {
            "code": "LUY-LON",
            "name": "Longuita",
            "zipCodes": [
              "01425"
            ]
          },
          {
            "code": "LUY-LON",
            "name": "Lonya Chico",
            "zipCodes": [
              "01500"
            ]
          },
          {
            "code": "LUY-LUY",
            "name": "Luya",
            "zipCodes": [
              "01510"
            ]
          },
          {
            "code": "UTC-LUY",
            "name": "Luya Viejo",
            "zipCodes": [
              "01575"
            ]
          },
          {
            "code": "LUY-MAR",
            "name": "Maria",
            "zipCodes": [
              "01430"
            ]
          },
          {
            "code": "LUY-OCA",
            "name": "Ocalli",
            "zipCodes": [
              "01545"
            ]
          },
          {
            "code": "LUY-OLT",
            "name": "Olto",
            "zipCodes": [
              "01520"
            ]
          },
          {
            "code": "LUY-PAC",
            "name": "Paclas",
            "zipCodes": [
              "01525"
            ]
          },
          {
            "code": "LUY-PRO",
            "name": "Providencia",
            "zipCodes": [
              "01540"
            ]
          },
          {
            "code": "LUY-SAN",
            "name": "San Francisco del Yeso",
            "zipCodes": [
              "01450"
            ]
          },
          {
            "code": "LUY-SAN",
            "name": "San Juan de Lopecancha",
            "zipCodes": [
              "01435"
            ]
          },
          {
            "code": "UTC-SAN",
            "name": "Santa Catalina",
            "zipCodes": [
              "01580"
            ]
          },
          {
            "code": "LUY-SAN",
            "name": "Santo Tomas",
            "zipCodes": [
              "01445"
            ]
          },
          {
            "code": "LUY-TIN",
            "name": "Tingo",
            "zipCodes": [
              "01415"
            ]
          },
          {
            "code": "UTC-TRI",
            "name": "Trita",
            "zipCodes": [
              "01570"
            ]
          },
          {
            "code": "LUY-YOM",
            "name": "Yomblon",
            "zipCodes": [
              "01485",
              "01486"
            ]
          }
        ]
      },
      {
        "code": "ROD",
        "name": "Rodriguez de Mendoza",
        "districts": [
          {
            "code": "ROD-CHI",
            "name": "Chirimoto",
            "zipCodes": [
              "01380"
            ]
          },
          {
            "code": "ROD-COC",
            "name": "Cochamal",
            "zipCodes": [
              "01350"
            ]
          },
          {
            "code": "ROD-HUA",
            "name": "Huambo",
            "zipCodes": [
              "01355"
            ]
          },
          {
            "code": "ROD-LIM",
            "name": "Limabamba",
            "zipCodes": [
              "01370"
            ]
          },
          {
            "code": "ROD-LON",
            "name": "Longar",
            "zipCodes": [
              "01345"
            ]
          },
          {
            "code": "ROD-MAR",
            "name": "Mariscal Benavides",
            "zipCodes": [
              "01330"
            ]
          },
          {
            "code": "ROD-MIL",
            "name": "Milpuc",
            "zipCodes": [
              "01375"
            ]
          },
          {
            "code": "ROD-OMI",
            "name": "Omia",
            "zipCodes": [
              "01340",
              "01341"
            ]
          },
          {
            "code": "ROD-SAN",
            "name": "San Nicolas",
            "zipCodes": [
              "01335"
            ]
          },
          {
            "code": "ROD-SAN",
            "name": "Santa Rosa",
            "zipCodes": [
              "01360"
            ]
          },
          {
            "code": "ROD-TOT",
            "name": "Totora",
            "zipCodes": [
              "01365"
            ]
          },
          {
            "code": "ROD-VIS",
            "name": "Vista Alegre",
            "zipCodes": [
              "01325"
            ]
          }
        ],
        "cities": [
          {
            "code": "ROD-CHI",
            "name": "Chirimoto",
            "zipCodes": [
              "01380"
            ]
          },
          {
            "code": "ROD-COC",
            "name": "Cochamal",
            "zipCodes": [
              "01350"
            ]
          },
          {
            "code": "ROD-HUA",
            "name": "Huambo",
            "zipCodes": [
              "01355"
            ]
          },
          {
            "code": "ROD-LIM",
            "name": "Limabamba",
            "zipCodes": [
              "01370"
            ]
          },
          {
            "code": "ROD-LON",
            "name": "Longar",
            "zipCodes": [
              "01345"
            ]
          },
          {
            "code": "ROD-MAR",
            "name": "Mariscal Benavides",
            "zipCodes": [
              "01330"
            ]
          },
          {
            "code": "ROD-MEN",
            "name": "Mendoza",
            "zipCodes": [
              "01335"
            ]
          },
          {
            "code": "ROD-MIL",
            "name": "Milpuc",
            "zipCodes": [
              "01375"
            ]
          },
          {
            "code": "ROD-OMI",
            "name": "Omia",
            "zipCodes": [
              "01340",
              "01341"
            ]
          },
          {
            "code": "ROD-SAN",
            "name": "Santa Rosa de Huayabamba",
            "zipCodes": [
              "01360"
            ]
          },
          {
            "code": "ROD-TOT",
            "name": "Totora",
            "zipCodes": [
              "01365"
            ]
          },
          {
            "code": "ROD-VIS",
            "name": "Vista Alegre",
            "zipCodes": [
              "01325"
            ]
          }
        ]
      },
      {
        "code": "UTC",
        "name": "Utcubamba",
        "districts": [
          {
            "code": "UTC-BAG",
            "name": "Bagua Grande",
            "zipCodes": [
              "01620",
              "01621"
            ]
          },
          {
            "code": "UTC-CAJ",
            "name": "Cajaruro",
            "zipCodes": [
              "01700",
              "01701"
            ]
          },
          {
            "code": "UTC-CUM",
            "name": "Cumba",
            "zipCodes": [
              "01565",
              "01566"
            ]
          },
          {
            "code": "UTC-EL ",
            "name": "El Milagro",
            "zipCodes": [
              "01630",
              "01631"
            ]
          },
          {
            "code": "UTC-JAM",
            "name": "Jamalca",
            "zipCodes": [
              "01610",
              "01611"
            ]
          },
          {
            "code": "UTC-LON",
            "name": "Lonya Grande",
            "zipCodes": [
              "01555",
              "01556"
            ]
          },
          {
            "code": "UTC-YAM",
            "name": "Yamón",
            "zipCodes": [
              "01560"
            ]
          }
        ],
        "cities": [
          {
            "code": "UTC-BAG",
            "name": "Bagua Grande",
            "zipCodes": [
              "01620",
              "01621"
            ]
          },
          {
            "code": "UTC-CAJ",
            "name": "Cajaruro",
            "zipCodes": [
              "01700",
              "01701"
            ]
          },
          {
            "code": "UTC-CUM",
            "name": "Cumba",
            "zipCodes": [
              "01565",
              "01566"
            ]
          },
          {
            "code": "UTC-EL ",
            "name": "El Milagro",
            "zipCodes": [
              "01630",
              "01631"
            ]
          },
          {
            "code": "UTC-JAM",
            "name": "Jamalca",
            "zipCodes": [
              "01610",
              "01611"
            ]
          },
          {
            "code": "UTC-LON",
            "name": "Lonya Grande",
            "zipCodes": [
              "01555",
              "01556"
            ]
          },
          {
            "code": "UTC-YAM",
            "name": "Yamon",
            "zipCodes": [
              "01560"
            ]
          }
        ]
      }
    ]
  },
  {
    "code": "ANC",
    "name": "Ancash",
    "provinces": [
      {
        "code": "AIJ",
        "name": "Aija",
        "districts": [
          {
            "code": "AIJ-AIJ",
            "name": "Aija",
            "zipCodes": [
              "02610"
            ]
          },
          {
            "code": "HUA-COR",
            "name": "Coris",
            "zipCodes": [
              "02621"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huacllan",
            "zipCodes": [
              "02625"
            ]
          },
          {
            "code": "AIJ-LA ",
            "name": "La Merced",
            "zipCodes": [
              "02613"
            ]
          },
          {
            "code": "AIJ-SUC",
            "name": "Succha",
            "zipCodes": [
              "02616"
            ]
          }
        ],
        "cities": [
          {
            "code": "AIJ-AIJ",
            "name": "Aija",
            "zipCodes": [
              "02610"
            ]
          },
          {
            "code": "HUA-COR",
            "name": "Coris",
            "zipCodes": [
              "02621"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huacllan",
            "zipCodes": [
              "02625"
            ]
          },
          {
            "code": "AIJ-LA ",
            "name": "La Merced",
            "zipCodes": [
              "02613"
            ]
          },
          {
            "code": "AIJ-SUC",
            "name": "Succha",
            "zipCodes": [
              "02616"
            ]
          }
        ]
      },
      {
        "code": "ANT",
        "name": "Antonio Raymondi",
        "districts": [
          {
            "code": "ANT-ACZ",
            "name": "Aczo",
            "zipCodes": [
              "02340"
            ]
          },
          {
            "code": "ANT-CHA",
            "name": "Chaccho",
            "zipCodes": [
              "02348"
            ]
          },
          {
            "code": "ANT-CHI",
            "name": "Chingas",
            "zipCodes": [
              "02342"
            ]
          },
          {
            "code": "ANT-LLA",
            "name": "Llamellin",
            "zipCodes": [
              "02345"
            ]
          },
          {
            "code": "ANT-MIR",
            "name": "Mirgas",
            "zipCodes": [
              "02350",
              "02352"
            ]
          },
          {
            "code": "ANT-SAN",
            "name": "San Juan de Rontoy",
            "zipCodes": [
              "02335"
            ]
          }
        ],
        "cities": [
          {
            "code": "ANT-ACZ",
            "name": "Aczo",
            "zipCodes": [
              "02340"
            ]
          },
          {
            "code": "ANT-CHA",
            "name": "Chaccho",
            "zipCodes": [
              "02348"
            ]
          },
          {
            "code": "ANT-CHI",
            "name": "Chingas",
            "zipCodes": [
              "02342"
            ]
          },
          {
            "code": "ANT-LLA",
            "name": "Llamellin",
            "zipCodes": [
              "02345"
            ]
          },
          {
            "code": "ANT-MIR",
            "name": "Mirgas",
            "zipCodes": [
              "02350",
              "02352"
            ]
          },
          {
            "code": "ANT-SAN",
            "name": "San Juan de Rontoy",
            "zipCodes": [
              "02335"
            ]
          }
        ]
      },
      {
        "code": "ASU",
        "name": "Asunción",
        "districts": [
          {
            "code": "ASU-ACO",
            "name": "Acochaca",
            "zipCodes": [
              "02314"
            ]
          },
          {
            "code": "ASU-CHA",
            "name": "Chacas",
            "zipCodes": [
              "02315",
              "02318"
            ]
          }
        ],
        "cities": [
          {
            "code": "ASU-ACO",
            "name": "Acochaca",
            "zipCodes": [
              "02314"
            ]
          },
          {
            "code": "ASU-CHA",
            "name": "Chacas",
            "zipCodes": [
              "02315",
              "02318"
            ]
          }
        ]
      },
      {
        "code": "BOL",
        "name": "Bolognesi",
        "districts": [
          {
            "code": "BOL-ABE",
            "name": "Abelardo Pardo Lezameta",
            "zipCodes": [
              "02435"
            ]
          },
          {
            "code": "OCR-ANT",
            "name": "Antonio Raymondi",
            "zipCodes": [
              "02489"
            ]
          },
          {
            "code": "BOL-AQU",
            "name": "Aquía",
            "zipCodes": [
              "02420"
            ]
          },
          {
            "code": "OCR-CAJ",
            "name": "Cajacay",
            "zipCodes": [
              "02485"
            ]
          },
          {
            "code": "BOL-CAN",
            "name": "Canis",
            "zipCodes": [
              "02445"
            ]
          },
          {
            "code": "BOL-CHI",
            "name": "Chiquian",
            "zipCodes": [
              "02413"
            ]
          },
          {
            "code": "OCR-COL",
            "name": "Colquioc",
            "zipCodes": [
              "02500"
            ]
          },
          {
            "code": "BOL-HUA",
            "name": "Huallanca",
            "zipCodes": [
              "02422",
              "02425"
            ]
          },
          {
            "code": "BOL-HUA",
            "name": "Huasta",
            "zipCodes": [
              "02415"
            ]
          },
          {
            "code": "OCR-HUA",
            "name": "Huayllacayan",
            "zipCodes": [
              "02510"
            ]
          },
          {
            "code": "BOL-LA ",
            "name": "La Primavera",
            "zipCodes": [
              "02440"
            ]
          },
          {
            "code": "BOL-MAN",
            "name": "Mangas",
            "zipCodes": [
              "02441"
            ]
          },
          {
            "code": "BOL-PAC",
            "name": "Pacllon",
            "zipCodes": [
              "02426"
            ]
          },
          {
            "code": "BOL-SAN",
            "name": "San Miguel de Corpanqui",
            "zipCodes": [
              "02432"
            ]
          },
          {
            "code": "BOL-TIC",
            "name": "Ticllos",
            "zipCodes": [
              "02430"
            ]
          }
        ],
        "cities": [
          {
            "code": "BOL-AQU",
            "name": "Aquia",
            "zipCodes": [
              "02420"
            ]
          },
          {
            "code": "OCR-CAJ",
            "name": "Cajacay",
            "zipCodes": [
              "02485"
            ]
          },
          {
            "code": "BOL-CAN",
            "name": "Canis",
            "zipCodes": [
              "02445"
            ]
          },
          {
            "code": "OCR-CHA",
            "name": "Chasquitambo",
            "zipCodes": [
              "02500"
            ]
          },
          {
            "code": "BOL-CHI",
            "name": "Chiquian",
            "zipCodes": [
              "02413"
            ]
          },
          {
            "code": "BOL-COR",
            "name": "Corpanqui",
            "zipCodes": [
              "02432"
            ]
          },
          {
            "code": "BOL-GOR",
            "name": "Gorgorillo",
            "zipCodes": [
              "02440"
            ]
          },
          {
            "code": "BOL-HUA",
            "name": "Huallanca",
            "zipCodes": [
              "02422",
              "02425"
            ]
          },
          {
            "code": "BOL-HUA",
            "name": "Huasta",
            "zipCodes": [
              "02415"
            ]
          },
          {
            "code": "OCR-HUA",
            "name": "Huayllacayan",
            "zipCodes": [
              "02510"
            ]
          },
          {
            "code": "BOL-LLA",
            "name": "Llaclla",
            "zipCodes": [
              "02435"
            ]
          },
          {
            "code": "BOL-MAN",
            "name": "Mangas",
            "zipCodes": [
              "02441"
            ]
          },
          {
            "code": "BOL-PAC",
            "name": "Pacllon",
            "zipCodes": [
              "02426"
            ]
          },
          {
            "code": "OCR-RAQ",
            "name": "Raquia",
            "zipCodes": [
              "02489"
            ]
          },
          {
            "code": "BOL-TIC",
            "name": "Ticllos",
            "zipCodes": [
              "02430"
            ]
          }
        ]
      },
      {
        "code": "CAR",
        "name": "Carhuaz",
        "districts": [
          {
            "code": "CAR-ACO",
            "name": "Acopampa",
            "zipCodes": [
              "02123"
            ]
          },
          {
            "code": "CAR-AMA",
            "name": "Amashca",
            "zipCodes": [
              "02130"
            ]
          },
          {
            "code": "CAR-ANT",
            "name": "Anta",
            "zipCodes": [
              "02105"
            ]
          },
          {
            "code": "CAR-ATA",
            "name": "Ataquero",
            "zipCodes": [
              "02139"
            ]
          },
          {
            "code": "CAR-CAR",
            "name": "Carhuaz",
            "zipCodes": [
              "02125",
              "02127"
            ]
          },
          {
            "code": "CAR-MAR",
            "name": "Marcara",
            "zipCodes": [
              "02109",
              "02110"
            ]
          },
          {
            "code": "CAR-PAR",
            "name": "Pariahuanca",
            "zipCodes": [
              "02113"
            ]
          },
          {
            "code": "CAR-SAN",
            "name": "San Miguel de Aco",
            "zipCodes": [
              "02115"
            ]
          },
          {
            "code": "CAR-SHI",
            "name": "Shilla",
            "zipCodes": [
              "02133"
            ]
          },
          {
            "code": "CAR-TIN",
            "name": "Tinco",
            "zipCodes": [
              "02135"
            ]
          },
          {
            "code": "CAR-YUN",
            "name": "Yungar",
            "zipCodes": [
              "02103"
            ]
          }
        ],
        "cities": [
          {
            "code": "CAR-ACO",
            "name": "Aco",
            "zipCodes": [
              "02115"
            ]
          },
          {
            "code": "CAR-ACO",
            "name": "Acopampa",
            "zipCodes": [
              "02123"
            ]
          },
          {
            "code": "CAR-AMA",
            "name": "Amashca",
            "zipCodes": [
              "02130"
            ]
          },
          {
            "code": "CAR-ANT",
            "name": "Anta",
            "zipCodes": [
              "02105"
            ]
          },
          {
            "code": "CAR-CAR",
            "name": "Carhuac",
            "zipCodes": [
              "02139"
            ]
          },
          {
            "code": "CAR-CAR",
            "name": "Carhuaz",
            "zipCodes": [
              "02125",
              "02127"
            ]
          },
          {
            "code": "CAR-MAR",
            "name": "Marcara",
            "zipCodes": [
              "02109",
              "02110"
            ]
          },
          {
            "code": "CAR-PAR",
            "name": "Pariahuanca",
            "zipCodes": [
              "02113"
            ]
          },
          {
            "code": "CAR-SHI",
            "name": "Shilla",
            "zipCodes": [
              "02133"
            ]
          },
          {
            "code": "CAR-TIN",
            "name": "Tinco",
            "zipCodes": [
              "02135"
            ]
          },
          {
            "code": "CAR-YUN",
            "name": "Yungar",
            "zipCodes": [
              "02103"
            ]
          }
        ]
      },
      {
        "code": "CAR",
        "name": "Carlos Fermín Fitzcarrald",
        "districts": [
          {
            "code": "HUA-SAN",
            "name": "San Luis",
            "zipCodes": [
              "02310",
              "02311"
            ]
          },
          {
            "code": "CAR-SAN",
            "name": "San Nicolas",
            "zipCodes": [
              "02285"
            ]
          },
          {
            "code": "CAR-YAU",
            "name": "Yauya",
            "zipCodes": [
              "02280",
              "02283"
            ]
          }
        ],
        "cities": [
          {
            "code": "HUA-SAN",
            "name": "San Luis",
            "zipCodes": [
              "02310",
              "02311"
            ]
          },
          {
            "code": "CAR-SAN",
            "name": "San Nicolas",
            "zipCodes": [
              "02285"
            ]
          },
          {
            "code": "CAR-YAU",
            "name": "Yauya",
            "zipCodes": [
              "02280",
              "02283"
            ]
          }
        ]
      },
      {
        "code": "CAS",
        "name": "Casma",
        "districts": [
          {
            "code": "CAS-BUE",
            "name": "Buena Vista Alta",
            "zipCodes": [
              "02670"
            ]
          },
          {
            "code": "CAS-CAS",
            "name": "Casma",
            "zipCodes": [
              "02660",
              "02661"
            ]
          },
          {
            "code": "CAS-COM",
            "name": "Comandante Noel",
            "zipCodes": [
              "02665"
            ]
          },
          {
            "code": "CAS-YAU",
            "name": "Yautan",
            "zipCodes": [
              "02680",
              "02681"
            ]
          }
        ],
        "cities": [
          {
            "code": "CAS-BUE",
            "name": "Buena Vista Alta",
            "zipCodes": [
              "02670"
            ]
          },
          {
            "code": "CAS-CAS",
            "name": "Casma",
            "zipCodes": [
              "02660",
              "02661"
            ]
          },
          {
            "code": "CAS-PUE",
            "name": "Puerto Casma",
            "zipCodes": [
              "02665"
            ]
          },
          {
            "code": "CAS-YAU",
            "name": "Yautan",
            "zipCodes": [
              "02680",
              "02681"
            ]
          }
        ]
      },
      {
        "code": "COR",
        "name": "Corongo",
        "districts": [
          {
            "code": "COR-ACO",
            "name": "Aco",
            "zipCodes": [
              "02215"
            ]
          },
          {
            "code": "COR-BAM",
            "name": "Bambas",
            "zipCodes": [
              "02205"
            ]
          },
          {
            "code": "COR-COR",
            "name": "Corongo",
            "zipCodes": [
              "02218"
            ]
          },
          {
            "code": "COR-CUS",
            "name": "Cusca",
            "zipCodes": [
              "02210"
            ]
          },
          {
            "code": "COR-LA ",
            "name": "La Pampa",
            "zipCodes": [
              "02200"
            ]
          },
          {
            "code": "COR-YAN",
            "name": "Yanac",
            "zipCodes": [
              "02209"
            ]
          },
          {
            "code": "COR-YUP",
            "name": "Yupan",
            "zipCodes": [
              "02203"
            ]
          }
        ],
        "cities": [
          {
            "code": "COR-ACO",
            "name": "Aco",
            "zipCodes": [
              "02215"
            ]
          },
          {
            "code": "COR-BAM",
            "name": "Bambas",
            "zipCodes": [
              "02205"
            ]
          },
          {
            "code": "COR-COR",
            "name": "Corongo",
            "zipCodes": [
              "02218"
            ]
          },
          {
            "code": "COR-CUS",
            "name": "Cusca",
            "zipCodes": [
              "02210"
            ]
          },
          {
            "code": "COR-LA ",
            "name": "La Pampa",
            "zipCodes": [
              "02200"
            ]
          },
          {
            "code": "COR-YAN",
            "name": "Yanac",
            "zipCodes": [
              "02209"
            ]
          },
          {
            "code": "COR-YUP",
            "name": "Yupan",
            "zipCodes": [
              "02203"
            ]
          }
        ]
      },
      {
        "code": "HUA",
        "name": "Huaraz",
        "districts": [
          {
            "code": "CAS-COC",
            "name": "Cochabamba",
            "zipCodes": [
              "02690"
            ]
          },
          {
            "code": "CAS-COL",
            "name": "Colcabamba",
            "zipCodes": [
              "02695"
            ]
          },
          {
            "code": "OCR-HUA",
            "name": "Huanchay",
            "zipCodes": [
              "02607"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huaraz",
            "zipCodes": [
              "02000",
              "02001",
              "02002"
            ]
          },
          {
            "code": "HUA-IND",
            "name": "Independencia",
            "zipCodes": [
              "02000",
              "02002"
            ]
          },
          {
            "code": "HUA-JAN",
            "name": "Jangas",
            "zipCodes": [
              "02100"
            ]
          },
          {
            "code": "OCR-LA ",
            "name": "La Libertad",
            "zipCodes": [
              "02603"
            ]
          },
          {
            "code": "ANT-OLL",
            "name": "Olleros",
            "zipCodes": [
              "02400"
            ]
          },
          {
            "code": "OCR-PAM",
            "name": "Pampas",
            "zipCodes": [
              "02605"
            ]
          },
          {
            "code": "CAS-PAR",
            "name": "Pariacoto",
            "zipCodes": [
              "02685"
            ]
          },
          {
            "code": "OCR-PIR",
            "name": "Pira",
            "zipCodes": [
              "02600"
            ]
          },
          {
            "code": "CAR-TAR",
            "name": "Tarica",
            "zipCodes": [
              "02119",
              "02120"
            ]
          }
        ],
        "cities": [
          {
            "code": "OCR-CAJ",
            "name": "Cajamarquilla",
            "zipCodes": [
              "02603"
            ]
          },
          {
            "code": "HUA-CEN",
            "name": "Centenario",
            "zipCodes": [
              "02000",
              "02002"
            ]
          },
          {
            "code": "CAS-COC",
            "name": "Cochabamba",
            "zipCodes": [
              "02690"
            ]
          },
          {
            "code": "CAS-COL",
            "name": "Colcabamba",
            "zipCodes": [
              "02695"
            ]
          },
          {
            "code": "OCR-HUA",
            "name": "Huanchay",
            "zipCodes": [
              "02607"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huaraz",
            "zipCodes": [
              "02000",
              "02001",
              "02002"
            ]
          },
          {
            "code": "HUA-JAN",
            "name": "Jangas",
            "zipCodes": [
              "02100"
            ]
          },
          {
            "code": "ANT-OLL",
            "name": "Olleros",
            "zipCodes": [
              "02400"
            ]
          },
          {
            "code": "OCR-PAM",
            "name": "Pampas",
            "zipCodes": [
              "02605"
            ]
          },
          {
            "code": "CAS-PAR",
            "name": "Pariacoto",
            "zipCodes": [
              "02685"
            ]
          },
          {
            "code": "OCR-PIR",
            "name": "Pira",
            "zipCodes": [
              "02600"
            ]
          },
          {
            "code": "CAR-TAR",
            "name": "Tarica",
            "zipCodes": [
              "02119",
              "02120"
            ]
          }
        ]
      },
      {
        "code": "HUA",
        "name": "Huari",
        "districts": [
          {
            "code": "ANT-ANR",
            "name": "Anra",
            "zipCodes": [
              "02358"
            ]
          },
          {
            "code": "HUA-CAJ",
            "name": "Cajay",
            "zipCodes": [
              "02305"
            ]
          },
          {
            "code": "ANT-CHA",
            "name": "Chavín de Huantar",
            "zipCodes": [
              "02395",
              "02396"
            ]
          },
          {
            "code": "ANT-HUA",
            "name": "Huacachi",
            "zipCodes": [
              "02355"
            ]
          },
          {
            "code": "ANT-HUA",
            "name": "Huacchis",
            "zipCodes": [
              "02380"
            ]
          },
          {
            "code": "ASU-HUA",
            "name": "Huachis",
            "zipCodes": [
              "02320"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huantar",
            "zipCodes": [
              "02300"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huari",
            "zipCodes": [
              "02303",
              "02304"
            ]
          },
          {
            "code": "ASU-MAS",
            "name": "Masin",
            "zipCodes": [
              "02324"
            ]
          },
          {
            "code": "ANT-PAU",
            "name": "Paucas",
            "zipCodes": [
              "02375"
            ]
          },
          {
            "code": "ASU-PON",
            "name": "Ponto",
            "zipCodes": [
              "02330"
            ]
          },
          {
            "code": "ASU-RAH",
            "name": "Rahuapampa",
            "zipCodes": [
              "02325"
            ]
          },
          {
            "code": "ANT-RAP",
            "name": "Rapayan",
            "zipCodes": [
              "02385"
            ]
          },
          {
            "code": "ANT-SAN",
            "name": "San Marcos",
            "zipCodes": [
              "02390",
              "02391"
            ]
          },
          {
            "code": "ASU-SAN",
            "name": "San Pedro de Chama",
            "zipCodes": [
              "02333"
            ]
          },
          {
            "code": "ANT-UCO",
            "name": "Uco",
            "zipCodes": [
              "02370"
            ]
          }
        ],
        "cities": [
          {
            "code": "ANT-ANR",
            "name": "Anra",
            "zipCodes": [
              "02358"
            ]
          },
          {
            "code": "HUA-CAJ",
            "name": "Cajay",
            "zipCodes": [
              "02305"
            ]
          },
          {
            "code": "ASU-CHA",
            "name": "Chana",
            "zipCodes": [
              "02333"
            ]
          },
          {
            "code": "ANT-CHA",
            "name": "Chavin de Huantar",
            "zipCodes": [
              "02395",
              "02396"
            ]
          },
          {
            "code": "ANT-HUA",
            "name": "Huacachi",
            "zipCodes": [
              "02355"
            ]
          },
          {
            "code": "ANT-HUA",
            "name": "Huacchis",
            "zipCodes": [
              "02380"
            ]
          },
          {
            "code": "ASU-HUA",
            "name": "Huachis",
            "zipCodes": [
              "02320"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huantar",
            "zipCodes": [
              "02300"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huari",
            "zipCodes": [
              "02303",
              "02304"
            ]
          },
          {
            "code": "ASU-MAS",
            "name": "Masin",
            "zipCodes": [
              "02324"
            ]
          },
          {
            "code": "ANT-PAU",
            "name": "Paucas",
            "zipCodes": [
              "02375"
            ]
          },
          {
            "code": "ASU-PON",
            "name": "Ponto",
            "zipCodes": [
              "02330"
            ]
          },
          {
            "code": "ASU-RAH",
            "name": "Rahuapampa",
            "zipCodes": [
              "02325"
            ]
          },
          {
            "code": "ANT-RAP",
            "name": "Rapayan",
            "zipCodes": [
              "02385"
            ]
          },
          {
            "code": "ANT-SAN",
            "name": "San Marcos",
            "zipCodes": [
              "02390",
              "02391"
            ]
          },
          {
            "code": "ANT-UCO",
            "name": "Uco",
            "zipCodes": [
              "02370"
            ]
          }
        ]
      },
      {
        "code": "HUA",
        "name": "Huarmey",
        "districts": [
          {
            "code": "HUA-COC",
            "name": "Cochapeti",
            "zipCodes": [
              "02630"
            ]
          },
          {
            "code": "HUA-CUL",
            "name": "Culebras",
            "zipCodes": [
              "02655"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huarmey",
            "zipCodes": [
              "02650",
              "02651"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huayán",
            "zipCodes": [
              "02618"
            ]
          },
          {
            "code": "HUA-MAL",
            "name": "Malvas",
            "zipCodes": [
              "02627"
            ]
          }
        ],
        "cities": [
          {
            "code": "HUA-CAL",
            "name": "Caleta Culebras",
            "zipCodes": [
              "02655"
            ]
          },
          {
            "code": "HUA-COC",
            "name": "Cochapeti",
            "zipCodes": [
              "02630"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huarmey",
            "zipCodes": [
              "02650",
              "02651"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huayan",
            "zipCodes": [
              "02618"
            ]
          },
          {
            "code": "HUA-MAL",
            "name": "Malvas",
            "zipCodes": [
              "02627"
            ]
          }
        ]
      },
      {
        "code": "HUA",
        "name": "Huaylas",
        "districts": [
          {
            "code": "HUA-CAR",
            "name": "Caraz",
            "zipCodes": [
              "02165",
              "02167"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huallanca",
            "zipCodes": [
              "02193"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huata",
            "zipCodes": [
              "02175"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huaylas",
            "zipCodes": [
              "02185"
            ]
          },
          {
            "code": "HUA-MAT",
            "name": "Mato",
            "zipCodes": [
              "02184"
            ]
          },
          {
            "code": "HUA-PAM",
            "name": "Pamparomas",
            "zipCodes": [
              "02180",
              "02181"
            ]
          },
          {
            "code": "HUA-PUE",
            "name": "Pueblo Libre",
            "zipCodes": [
              "02170",
              "02171"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "Santa Cruz",
            "zipCodes": [
              "02174"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "Santo Toribio",
            "zipCodes": [
              "02190"
            ]
          },
          {
            "code": "HUA-YUR",
            "name": "Yuracmarca",
            "zipCodes": [
              "02195"
            ]
          }
        ],
        "cities": [
          {
            "code": "HUA-CAR",
            "name": "Caraz",
            "zipCodes": [
              "02165",
              "02167"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huallanca",
            "zipCodes": [
              "02193"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huaripampa",
            "zipCodes": [
              "02174"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huata",
            "zipCodes": [
              "02175"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huaylas",
            "zipCodes": [
              "02185"
            ]
          },
          {
            "code": "HUA-PAM",
            "name": "Pamparomas",
            "zipCodes": [
              "02180",
              "02181"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "San Juan",
            "zipCodes": [
              "02170",
              "02171"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "Santo Toribio",
            "zipCodes": [
              "02190"
            ]
          },
          {
            "code": "HUA-SUC",
            "name": "Sucre",
            "zipCodes": [
              "02184"
            ]
          },
          {
            "code": "HUA-YUR",
            "name": "Yuracmarca",
            "zipCodes": [
              "02195"
            ]
          }
        ]
      },
      {
        "code": "MAR",
        "name": "Mariscal Luzuriaga",
        "districts": [
          {
            "code": "MAR-CAS",
            "name": "Casca",
            "zipCodes": [
              "02264"
            ]
          },
          {
            "code": "MAR-ELE",
            "name": "Eleazar Guzman Barrón",
            "zipCodes": [
              "02279"
            ]
          },
          {
            "code": "MAR-FID",
            "name": "Fidel Olivas Escudero",
            "zipCodes": [
              "02270"
            ]
          },
          {
            "code": "MAR-LLA",
            "name": "Llama",
            "zipCodes": [
              "02275"
            ]
          },
          {
            "code": "CAR-LLU",
            "name": "Llumpa",
            "zipCodes": [
              "02289",
              "02291"
            ]
          },
          {
            "code": "CAR-LUC",
            "name": "Lucma",
            "zipCodes": [
              "02290"
            ]
          },
          {
            "code": "MAR-MUS",
            "name": "Musga",
            "zipCodes": [
              "02273"
            ]
          },
          {
            "code": "MAR-PIS",
            "name": "Piscobamba",
            "zipCodes": [
              "02265"
            ]
          }
        ],
        "cities": [
          {
            "code": "MAR-CAS",
            "name": "Casca",
            "zipCodes": [
              "02264"
            ]
          },
          {
            "code": "MAR-LLA",
            "name": "Llama",
            "zipCodes": [
              "02275"
            ]
          },
          {
            "code": "CAR-LLU",
            "name": "Llumpa",
            "zipCodes": [
              "02289",
              "02291"
            ]
          },
          {
            "code": "CAR-LUC",
            "name": "Lucma",
            "zipCodes": [
              "02290"
            ]
          },
          {
            "code": "MAR-MUS",
            "name": "Musga",
            "zipCodes": [
              "02273"
            ]
          },
          {
            "code": "MAR-PAM",
            "name": "Pampachacra",
            "zipCodes": [
              "02279"
            ]
          },
          {
            "code": "MAR-PIS",
            "name": "Piscobamba",
            "zipCodes": [
              "02265"
            ]
          },
          {
            "code": "MAR-SAN",
            "name": "Sanachgan",
            "zipCodes": [
              "02270"
            ]
          }
        ]
      },
      {
        "code": "OCR",
        "name": "Ocros",
        "districts": [
          {
            "code": "OCR-ACA",
            "name": "Acas",
            "zipCodes": [
              "02470"
            ]
          },
          {
            "code": "OCR-CAJ",
            "name": "Cajamarquilla",
            "zipCodes": [
              "02447"
            ]
          },
          {
            "code": "OCR-CAR",
            "name": "Carhuapampa",
            "zipCodes": [
              "02480"
            ]
          },
          {
            "code": "OCR-COC",
            "name": "Cochas",
            "zipCodes": [
              "02475"
            ]
          },
          {
            "code": "OCR-CON",
            "name": "Congas",
            "zipCodes": [
              "02530"
            ]
          },
          {
            "code": "OCR-LLI",
            "name": "Llipa",
            "zipCodes": [
              "02455"
            ]
          },
          {
            "code": "OCR-OCR",
            "name": "Ocros",
            "zipCodes": [
              "02460"
            ]
          },
          {
            "code": "OCR-SAN",
            "name": "San Cristobal de Rajan",
            "zipCodes": [
              "02450"
            ]
          },
          {
            "code": "OCR-SAN",
            "name": "San Pedro",
            "zipCodes": [
              "02520"
            ]
          },
          {
            "code": "OCR-SAN",
            "name": "Santiago de Chilcas",
            "zipCodes": [
              "02465"
            ]
          }
        ],
        "cities": [
          {
            "code": "OCR-ACA",
            "name": "Acas",
            "zipCodes": [
              "02470"
            ]
          },
          {
            "code": "OCR-ACO",
            "name": "Aco",
            "zipCodes": [
              "02480"
            ]
          },
          {
            "code": "OCR-CAJ",
            "name": "Cajamarquilla",
            "zipCodes": [
              "02447"
            ]
          },
          {
            "code": "OCR-CON",
            "name": "Congas",
            "zipCodes": [
              "02530"
            ]
          },
          {
            "code": "OCR-COP",
            "name": "Copa",
            "zipCodes": [
              "02520"
            ]
          },
          {
            "code": "OCR-HUA",
            "name": "Huanchay",
            "zipCodes": [
              "02475"
            ]
          },
          {
            "code": "OCR-LLI",
            "name": "Llipa",
            "zipCodes": [
              "02455"
            ]
          },
          {
            "code": "OCR-OCR",
            "name": "Ocros",
            "zipCodes": [
              "02460"
            ]
          },
          {
            "code": "OCR-RAJ",
            "name": "Rajan",
            "zipCodes": [
              "02450"
            ]
          },
          {
            "code": "OCR-SAN",
            "name": "Santiago de Chilcas",
            "zipCodes": [
              "02465"
            ]
          }
        ]
      },
      {
        "code": "PAL",
        "name": "Pallasca",
        "districts": [
          {
            "code": "PAL-BOL",
            "name": "Bolognesi",
            "zipCodes": [
              "02830"
            ]
          },
          {
            "code": "PAL-CAB",
            "name": "Cabana",
            "zipCodes": [
              "02850"
            ]
          },
          {
            "code": "PAL-CON",
            "name": "Conchucos",
            "zipCodes": [
              "02875",
              "02876"
            ]
          },
          {
            "code": "PAL-HUA",
            "name": "Huacaschuque",
            "zipCodes": [
              "02860"
            ]
          },
          {
            "code": "PAL-HUA",
            "name": "Huandoval",
            "zipCodes": [
              "02855"
            ]
          },
          {
            "code": "PAL-LAC",
            "name": "Lacabamba",
            "zipCodes": [
              "02870"
            ]
          },
          {
            "code": "PAL-LLA",
            "name": "Llapo",
            "zipCodes": [
              "02840"
            ]
          },
          {
            "code": "PAL-PAL",
            "name": "Pallasca",
            "zipCodes": [
              "02835"
            ]
          },
          {
            "code": "PAL-PAM",
            "name": "Pampas",
            "zipCodes": [
              "02865",
              "02866"
            ]
          },
          {
            "code": "PAL-SAN",
            "name": "Santa Rosa",
            "zipCodes": [
              "02825"
            ]
          },
          {
            "code": "PAL-TAU",
            "name": "Tauca",
            "zipCodes": [
              "02845"
            ]
          }
        ],
        "cities": [
          {
            "code": "PAL-BOL",
            "name": "Bolognesi",
            "zipCodes": [
              "02830"
            ]
          },
          {
            "code": "PAL-CAB",
            "name": "Cabana",
            "zipCodes": [
              "02850"
            ]
          },
          {
            "code": "PAL-CON",
            "name": "Conchucos",
            "zipCodes": [
              "02875",
              "02876"
            ]
          },
          {
            "code": "PAL-HUA",
            "name": "Huacaschuque",
            "zipCodes": [
              "02860"
            ]
          },
          {
            "code": "PAL-HUA",
            "name": "Huandoval",
            "zipCodes": [
              "02855"
            ]
          },
          {
            "code": "PAL-LAC",
            "name": "Lacabamba",
            "zipCodes": [
              "02870"
            ]
          },
          {
            "code": "PAL-LLA",
            "name": "Llapo",
            "zipCodes": [
              "02840"
            ]
          },
          {
            "code": "PAL-PAL",
            "name": "Pallasca",
            "zipCodes": [
              "02835"
            ]
          },
          {
            "code": "PAL-PAM",
            "name": "Pampas",
            "zipCodes": [
              "02865",
              "02866"
            ]
          },
          {
            "code": "PAL-SAN",
            "name": "Santa Rosa",
            "zipCodes": [
              "02825"
            ]
          },
          {
            "code": "PAL-TAU",
            "name": "Tauca",
            "zipCodes": [
              "02845"
            ]
          }
        ]
      },
      {
        "code": "POM",
        "name": "Pomabamba",
        "districts": [
          {
            "code": "CAR-HUA",
            "name": "Huayllan",
            "zipCodes": [
              "02295"
            ]
          },
          {
            "code": "POM-PAR",
            "name": "Parobamba",
            "zipCodes": [
              "02250",
              "02254"
            ]
          },
          {
            "code": "POM-POM",
            "name": "Pomabamba",
            "zipCodes": [
              "02260",
              "02262"
            ]
          },
          {
            "code": "POM-QUI",
            "name": "Quinuabamba",
            "zipCodes": [
              "02258"
            ]
          }
        ],
        "cities": [
          {
            "code": "CAR-HUA",
            "name": "Huayllan",
            "zipCodes": [
              "02295"
            ]
          },
          {
            "code": "POM-PAR",
            "name": "Parobamba",
            "zipCodes": [
              "02250",
              "02254"
            ]
          },
          {
            "code": "POM-POM",
            "name": "Pomabamba",
            "zipCodes": [
              "02260",
              "02262"
            ]
          },
          {
            "code": "POM-QUI",
            "name": "Quinuabamba",
            "zipCodes": [
              "02258"
            ]
          }
        ]
      },
      {
        "code": "REC",
        "name": "Recuay",
        "districts": [
          {
            "code": "REC-CAT",
            "name": "Catac",
            "zipCodes": [
              "02410"
            ]
          },
          {
            "code": "HUA-COT",
            "name": "Cotaparaco",
            "zipCodes": [
              "02633"
            ]
          },
          {
            "code": "OCR-HUA",
            "name": "Huayllapampa",
            "zipCodes": [
              "02495"
            ]
          },
          {
            "code": "HUA-LLA",
            "name": "Llacllin",
            "zipCodes": [
              "02645"
            ]
          },
          {
            "code": "OCR-MAR",
            "name": "Marca",
            "zipCodes": [
              "02490"
            ]
          },
          {
            "code": "OCR-PAM",
            "name": "Pampas Chico",
            "zipCodes": [
              "02483"
            ]
          },
          {
            "code": "HUA-PAR",
            "name": "Pararín",
            "zipCodes": [
              "02640"
            ]
          },
          {
            "code": "REC-REC",
            "name": "Recuay",
            "zipCodes": [
              "02403",
              "02405"
            ]
          },
          {
            "code": "HUA-TAP",
            "name": "Tapacocha",
            "zipCodes": [
              "02635"
            ]
          },
          {
            "code": "REC-TIC",
            "name": "Ticapampa",
            "zipCodes": [
              "02407"
            ]
          }
        ],
        "cities": [
          {
            "code": "REC-CAT",
            "name": "Catac",
            "zipCodes": [
              "02410"
            ]
          },
          {
            "code": "HUA-COT",
            "name": "Cotaparaco",
            "zipCodes": [
              "02633"
            ]
          },
          {
            "code": "OCR-HUA",
            "name": "Huayllapampa",
            "zipCodes": [
              "02495"
            ]
          },
          {
            "code": "HUA-LLA",
            "name": "Llacllin",
            "zipCodes": [
              "02645"
            ]
          },
          {
            "code": "OCR-MAR",
            "name": "Marca",
            "zipCodes": [
              "02490"
            ]
          },
          {
            "code": "OCR-PAM",
            "name": "Pampas Chico",
            "zipCodes": [
              "02483"
            ]
          },
          {
            "code": "HUA-PAR",
            "name": "Pararin",
            "zipCodes": [
              "02640"
            ]
          },
          {
            "code": "REC-REC",
            "name": "Recuay",
            "zipCodes": [
              "02403",
              "02405"
            ]
          },
          {
            "code": "HUA-TAP",
            "name": "Tapacocha",
            "zipCodes": [
              "02635"
            ]
          },
          {
            "code": "REC-TIC",
            "name": "Ticapampa",
            "zipCodes": [
              "02407"
            ]
          }
        ]
      },
      {
        "code": "SAN",
        "name": "Santa",
        "districts": [
          {
            "code": "SAN-CAC",
            "name": "Caceres del Perú",
            "zipCodes": [
              "02740",
              "02741"
            ]
          },
          {
            "code": "SAN-CHI",
            "name": "Chimbote",
            "zipCodes": [
              "02800",
              "02801",
              "02802",
              "02803",
              "02804"
            ]
          },
          {
            "code": "SAN-COI",
            "name": "Coishco",
            "zipCodes": [
              "02810",
              "02811"
            ]
          },
          {
            "code": "SAN-MAC",
            "name": "Macate",
            "zipCodes": [
              "02820"
            ]
          },
          {
            "code": "SAN-MOR",
            "name": "Moro",
            "zipCodes": [
              "02730",
              "02731"
            ]
          },
          {
            "code": "SAN-NEP",
            "name": "Nepeña",
            "zipCodes": [
              "02720",
              "02721"
            ]
          },
          {
            "code": "SAN-NUE",
            "name": "Nuevo Chimbote",
            "zipCodes": [
              "02710",
              "02711",
              "02712"
            ]
          },
          {
            "code": "SAN-SAM",
            "name": "Samanco",
            "zipCodes": [
              "02700"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "Santa",
            "zipCodes": [
              "02815",
              "02816"
            ]
          }
        ],
        "cities": [
          {
            "code": "SAN-BUE",
            "name": "Buenos Aires",
            "zipCodes": [
              "02710",
              "02711",
              "02712"
            ]
          },
          {
            "code": "SAN-CHI",
            "name": "Chimbote",
            "zipCodes": [
              "02800",
              "02801",
              "02802",
              "02803",
              "02804"
            ]
          },
          {
            "code": "SAN-COI",
            "name": "Coishco",
            "zipCodes": [
              "02810",
              "02811"
            ]
          },
          {
            "code": "SAN-JIM",
            "name": "Jimbe",
            "zipCodes": [
              "02740",
              "02741"
            ]
          },
          {
            "code": "SAN-MAC",
            "name": "Macate",
            "zipCodes": [
              "02820"
            ]
          },
          {
            "code": "SAN-MOR",
            "name": "Moro",
            "zipCodes": [
              "02730",
              "02731"
            ]
          },
          {
            "code": "SAN-NEP",
            "name": "Nepeña",
            "zipCodes": [
              "02720",
              "02721"
            ]
          },
          {
            "code": "SAN-SAM",
            "name": "Samanco",
            "zipCodes": [
              "02700"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "Santa",
            "zipCodes": [
              "02815",
              "02816"
            ]
          }
        ]
      },
      {
        "code": "SIH",
        "name": "Sihuas",
        "districts": [
          {
            "code": "SIH-ACO",
            "name": "Acobamba",
            "zipCodes": [
              "02235"
            ]
          },
          {
            "code": "SIH-ALF",
            "name": "Alfonso Ugarte",
            "zipCodes": [
              "02245"
            ]
          },
          {
            "code": "SIH-CAS",
            "name": "Cashapampa",
            "zipCodes": [
              "02225"
            ]
          },
          {
            "code": "SIH-CHI",
            "name": "Chingalpo",
            "zipCodes": [
              "02240"
            ]
          },
          {
            "code": "SIH-HUA",
            "name": "Huayllabamba",
            "zipCodes": [
              "02230"
            ]
          },
          {
            "code": "SIH-QUI",
            "name": "Quiches",
            "zipCodes": [
              "02234"
            ]
          },
          {
            "code": "SIH-RAG",
            "name": "Ragash",
            "zipCodes": [
              "02228"
            ]
          },
          {
            "code": "SIH-SAN",
            "name": "San Juan",
            "zipCodes": [
              "02249",
              "02251"
            ]
          },
          {
            "code": "SIH-SIC",
            "name": "Sicsibamba",
            "zipCodes": [
              "02243"
            ]
          },
          {
            "code": "SIH-SIH",
            "name": "Sihuas",
            "zipCodes": [
              "02220",
              "02222"
            ]
          }
        ],
        "cities": [
          {
            "code": "SIH-ACO",
            "name": "Acobamba",
            "zipCodes": [
              "02235"
            ]
          },
          {
            "code": "SIH-CAS",
            "name": "Cashapampa",
            "zipCodes": [
              "02225"
            ]
          },
          {
            "code": "SIH-CHI",
            "name": "Chingalpo",
            "zipCodes": [
              "02240"
            ]
          },
          {
            "code": "SIH-CHU",
            "name": "Chullin",
            "zipCodes": [
              "02249",
              "02251"
            ]
          },
          {
            "code": "SIH-HUA",
            "name": "Huayllabamba",
            "zipCodes": [
              "02230"
            ]
          },
          {
            "code": "SIH-QUI",
            "name": "Quiches",
            "zipCodes": [
              "02234"
            ]
          },
          {
            "code": "SIH-RAG",
            "name": "Ragash",
            "zipCodes": [
              "02228"
            ]
          },
          {
            "code": "SIH-SIH",
            "name": "Sihuas",
            "zipCodes": [
              "02220",
              "02222"
            ]
          },
          {
            "code": "SIH-ULL",
            "name": "Ullulluco",
            "zipCodes": [
              "02245"
            ]
          },
          {
            "code": "SIH-UMB",
            "name": "Umbe",
            "zipCodes": [
              "02243"
            ]
          }
        ]
      },
      {
        "code": "YUN",
        "name": "Yungay",
        "districts": [
          {
            "code": "YUN-CAS",
            "name": "Cascapara",
            "zipCodes": [
              "02145"
            ]
          },
          {
            "code": "YUN-MAN",
            "name": "Mancos",
            "zipCodes": [
              "02148",
              "02150"
            ]
          },
          {
            "code": "YUN-MAT",
            "name": "Matacoto",
            "zipCodes": [
              "02155"
            ]
          },
          {
            "code": "CAS-QUI",
            "name": "Quillo",
            "zipCodes": [
              "02675",
              "02676"
            ]
          },
          {
            "code": "YUN-RAN",
            "name": "Ranrahirca",
            "zipCodes": [
              "02152"
            ]
          },
          {
            "code": "YUN-SHU",
            "name": "Shupluy",
            "zipCodes": [
              "02140"
            ]
          },
          {
            "code": "YUN-YAN",
            "name": "Yanama",
            "zipCodes": [
              "02162",
              "02163"
            ]
          },
          {
            "code": "YUN-YUN",
            "name": "Yungay",
            "zipCodes": [
              "02158",
              "02160"
            ]
          }
        ],
        "cities": [
          {
            "code": "YUN-CAS",
            "name": "Cascapara",
            "zipCodes": [
              "02145"
            ]
          },
          {
            "code": "YUN-MAN",
            "name": "Mancos",
            "zipCodes": [
              "02148",
              "02150"
            ]
          },
          {
            "code": "YUN-MAT",
            "name": "Matacoto",
            "zipCodes": [
              "02155"
            ]
          },
          {
            "code": "CAS-QUI",
            "name": "Quillo",
            "zipCodes": [
              "02675",
              "02676"
            ]
          },
          {
            "code": "YUN-RAN",
            "name": "Ranrahirca",
            "zipCodes": [
              "02152"
            ]
          },
          {
            "code": "YUN-SHU",
            "name": "Shupluy",
            "zipCodes": [
              "02140"
            ]
          },
          {
            "code": "YUN-YAN",
            "name": "Yanama",
            "zipCodes": [
              "02162",
              "02163"
            ]
          },
          {
            "code": "YUN-YUN",
            "name": "Yungay",
            "zipCodes": [
              "02158",
              "02160"
            ]
          }
        ]
      }
    ]
  },
  {
    "code": "APU",
    "name": "Apurimac",
    "provinces": [
      {
        "code": "ABA",
        "name": "Abancay",
        "districts": [
          {
            "code": "ABA-ABA",
            "name": "Abancay",
            "zipCodes": [
              "03000",
              "03001"
            ]
          },
          {
            "code": "ANT-CHA",
            "name": "Chacoche",
            "zipCodes": [
              "03405"
            ]
          },
          {
            "code": "COT-CIR",
            "name": "Circa",
            "zipCodes": [
              "03305"
            ]
          },
          {
            "code": "ABA-CUR",
            "name": "Curahuasi",
            "zipCodes": [
              "03100",
              "03101"
            ]
          },
          {
            "code": "ABA-HUA",
            "name": "Huanipaca",
            "zipCodes": [
              "03120"
            ]
          },
          {
            "code": "COT-LAM",
            "name": "Lambrama",
            "zipCodes": [
              "03300",
              "03301"
            ]
          },
          {
            "code": "ANT-PIC",
            "name": "Pichirhua",
            "zipCodes": [
              "03400"
            ]
          },
          {
            "code": "ABA-SAN",
            "name": "San Pedro de Cachora",
            "zipCodes": [
              "03110"
            ]
          },
          {
            "code": "ABA-TAM",
            "name": "Tamburco",
            "zipCodes": [
              "03000",
              "03001"
            ]
          }
        ],
        "cities": [
          {
            "code": "ABA-ABA",
            "name": "Abancay",
            "zipCodes": [
              "03000",
              "03001"
            ]
          },
          {
            "code": "ABA-CAC",
            "name": "Cachora",
            "zipCodes": [
              "03110"
            ]
          },
          {
            "code": "ANT-CHA",
            "name": "Chacoche",
            "zipCodes": [
              "03405"
            ]
          },
          {
            "code": "COT-CIR",
            "name": "Circa",
            "zipCodes": [
              "03305"
            ]
          },
          {
            "code": "ABA-CUR",
            "name": "Curahuasi",
            "zipCodes": [
              "03100",
              "03101"
            ]
          },
          {
            "code": "ABA-HUA",
            "name": "Huanipaca",
            "zipCodes": [
              "03120"
            ]
          },
          {
            "code": "COT-LAM",
            "name": "Lambrama",
            "zipCodes": [
              "03300",
              "03301"
            ]
          },
          {
            "code": "ANT-PIC",
            "name": "Pichirhua",
            "zipCodes": [
              "03400"
            ]
          },
          {
            "code": "ABA-TAM",
            "name": "Tamburco",
            "zipCodes": [
              "03000",
              "03001"
            ]
          }
        ]
      },
      {
        "code": "AND",
        "name": "Andahuaylas",
        "districts": [
          {
            "code": "AND-AND",
            "name": "Andahuaylas",
            "zipCodes": [
              "03700",
              "03701"
            ]
          },
          {
            "code": "AND-AND",
            "name": "Andarapa",
            "zipCodes": [
              "03740",
              "03741"
            ]
          },
          {
            "code": "AND-CHI",
            "name": "Chiara",
            "zipCodes": [
              "03650"
            ]
          },
          {
            "code": "AND-HUA",
            "name": "Huancarama",
            "zipCodes": [
              "03780",
              "03781"
            ]
          },
          {
            "code": "AND-HUA",
            "name": "Huancaray",
            "zipCodes": [
              "03670"
            ]
          },
          {
            "code": "AND-HUA",
            "name": "Huayana",
            "zipCodes": [
              "03630"
            ]
          },
          {
            "code": "AND-KAQ",
            "name": "Kaquiabamba",
            "zipCodes": [
              "03750"
            ]
          },
          {
            "code": "AND-KIS",
            "name": "Kishuara",
            "zipCodes": [
              "03760",
              "03761"
            ]
          },
          {
            "code": "AND-PAC",
            "name": "Pacobamba",
            "zipCodes": [
              "03770"
            ]
          },
          {
            "code": "AND-PAC",
            "name": "Pacucha",
            "zipCodes": [
              "03730",
              "03731"
            ]
          },
          {
            "code": "AND-PAM",
            "name": "Pampachiri",
            "zipCodes": [
              "03600"
            ]
          },
          {
            "code": "AND-POM",
            "name": "Pomacocha",
            "zipCodes": [
              "03610"
            ]
          },
          {
            "code": "AND-SAN",
            "name": "San Antonio de Cachi",
            "zipCodes": [
              "03660"
            ]
          },
          {
            "code": "AND-SAN",
            "name": "San Jerónimo",
            "zipCodes": [
              "03700",
              "03701"
            ]
          },
          {
            "code": "AND-SAN",
            "name": "San Miguel de Chaccrampa",
            "zipCodes": [
              "03640"
            ]
          },
          {
            "code": "AND-SAN",
            "name": "Santa María de Chicmo",
            "zipCodes": [
              "03800",
              "03801"
            ]
          },
          {
            "code": "AND-TAL",
            "name": "Talavera",
            "zipCodes": [
              "03700",
              "03701"
            ]
          },
          {
            "code": "AND-TUM",
            "name": "Tumay Huaraca",
            "zipCodes": [
              "03620"
            ]
          },
          {
            "code": "AND-TUR",
            "name": "Turpo",
            "zipCodes": [
              "03680"
            ]
          }
        ],
        "cities": [
          {
            "code": "AND-AND",
            "name": "Andahuaylas",
            "zipCodes": [
              "03700",
              "03701"
            ]
          },
          {
            "code": "AND-AND",
            "name": "Andarapa",
            "zipCodes": [
              "03740",
              "03741"
            ]
          },
          {
            "code": "AND-CHA",
            "name": "Chaccrampa",
            "zipCodes": [
              "03640"
            ]
          },
          {
            "code": "AND-CHI",
            "name": "Chiara",
            "zipCodes": [
              "03650"
            ]
          },
          {
            "code": "AND-HUA",
            "name": "Huancarama",
            "zipCodes": [
              "03780",
              "03781"
            ]
          },
          {
            "code": "AND-HUA",
            "name": "Huancaray",
            "zipCodes": [
              "03670"
            ]
          },
          {
            "code": "AND-HUA",
            "name": "Huayana",
            "zipCodes": [
              "03630"
            ]
          },
          {
            "code": "AND-KAQ",
            "name": "Kaquiabamba",
            "zipCodes": [
              "03750"
            ]
          },
          {
            "code": "AND-KIS",
            "name": "Kishuara",
            "zipCodes": [
              "03760",
              "03761"
            ]
          },
          {
            "code": "AND-PAC",
            "name": "Pacobamba",
            "zipCodes": [
              "03770"
            ]
          },
          {
            "code": "AND-PAC",
            "name": "Pacucha",
            "zipCodes": [
              "03730",
              "03731"
            ]
          },
          {
            "code": "AND-PAM",
            "name": "Pampachiri",
            "zipCodes": [
              "03600"
            ]
          },
          {
            "code": "AND-POM",
            "name": "Pomacocha",
            "zipCodes": [
              "03610"
            ]
          },
          {
            "code": "AND-SAN",
            "name": "San Antonio de Cachi",
            "zipCodes": [
              "03660"
            ]
          },
          {
            "code": "AND-SAN",
            "name": "San Jeronimo",
            "zipCodes": [
              "03700",
              "03701"
            ]
          },
          {
            "code": "AND-SAN",
            "name": "Santa Maria de Chicmo",
            "zipCodes": [
              "03800",
              "03801"
            ]
          },
          {
            "code": "AND-TAL",
            "name": "Talavera",
            "zipCodes": [
              "03700",
              "03701"
            ]
          },
          {
            "code": "AND-TUR",
            "name": "Turpo",
            "zipCodes": [
              "03680"
            ]
          },
          {
            "code": "AND-UMA",
            "name": "Umamarca",
            "zipCodes": [
              "03620"
            ]
          }
        ]
      },
      {
        "code": "ANT",
        "name": "Antabamba",
        "districts": [
          {
            "code": "AYM-ANT",
            "name": "Antabamba",
            "zipCodes": [
              "03465"
            ]
          },
          {
            "code": "AYM-EL ",
            "name": "El Oro",
            "zipCodes": [
              "03450"
            ]
          },
          {
            "code": "AYM-HUA",
            "name": "Huaquirca",
            "zipCodes": [
              "03470"
            ]
          },
          {
            "code": "AYM-JUA",
            "name": "Juan Espinoza Medrano",
            "zipCodes": [
              "03475"
            ]
          },
          {
            "code": "ANT-ORO",
            "name": "Oropesa",
            "zipCodes": [
              "03340"
            ]
          },
          {
            "code": "AYM-PAC",
            "name": "Pachaconas",
            "zipCodes": [
              "03455"
            ]
          },
          {
            "code": "AYM-SAB",
            "name": "Sabaino",
            "zipCodes": [
              "03460"
            ]
          }
        ],
        "cities": [
          {
            "code": "AYM-ANT",
            "name": "Antabamba",
            "zipCodes": [
              "03465"
            ]
          },
          {
            "code": "AYM-AYA",
            "name": "Ayahuay",
            "zipCodes": [
              "03450"
            ]
          },
          {
            "code": "AYM-HUA",
            "name": "Huaquirca",
            "zipCodes": [
              "03470"
            ]
          },
          {
            "code": "AYM-MOL",
            "name": "Mollebamba",
            "zipCodes": [
              "03475"
            ]
          },
          {
            "code": "ANT-ORO",
            "name": "Oropesa",
            "zipCodes": [
              "03340"
            ]
          },
          {
            "code": "AYM-PAC",
            "name": "Pachaconas",
            "zipCodes": [
              "03455"
            ]
          },
          {
            "code": "AYM-SAB",
            "name": "Sabaino",
            "zipCodes": [
              "03460"
            ]
          }
        ]
      },
      {
        "code": "AYM",
        "name": "Aymaraes",
        "districts": [
          {
            "code": "AYM-CAP",
            "name": "Capaya",
            "zipCodes": [
              "03520"
            ]
          },
          {
            "code": "AYM-CAR",
            "name": "Caraybamba",
            "zipCodes": [
              "03570"
            ]
          },
          {
            "code": "AYM-CHA",
            "name": "Chalhuanca",
            "zipCodes": [
              "03560"
            ]
          },
          {
            "code": "AYM-CHA",
            "name": "Chapimarca",
            "zipCodes": [
              "03425"
            ]
          },
          {
            "code": "AYM-COL",
            "name": "Colcabamba",
            "zipCodes": [
              "03500"
            ]
          },
          {
            "code": "AYM-COT",
            "name": "Cotaruse",
            "zipCodes": [
              "03580"
            ]
          },
          {
            "code": "AYM-HUA",
            "name": "Huayllo",
            "zipCodes": [
              "03530"
            ]
          },
          {
            "code": "AYM-JUS",
            "name": "Justo Apu Sahuaraura",
            "zipCodes": [
              "03430"
            ]
          },
          {
            "code": "AYM-LUC",
            "name": "Lucre",
            "zipCodes": [
              "03415"
            ]
          },
          {
            "code": "AYM-POC",
            "name": "Pocohuanca",
            "zipCodes": [
              "03445"
            ]
          },
          {
            "code": "AYM-SAN",
            "name": "San Juan de Chacña",
            "zipCodes": [
              "03420"
            ]
          },
          {
            "code": "AYM-SAÑ",
            "name": "Sañayca",
            "zipCodes": [
              "03550"
            ]
          },
          {
            "code": "AYM-SOR",
            "name": "Soraya",
            "zipCodes": [
              "03540"
            ]
          },
          {
            "code": "AYM-TAP",
            "name": "Tapairihua",
            "zipCodes": [
              "03435"
            ]
          },
          {
            "code": "AYM-TIN",
            "name": "Tintay",
            "zipCodes": [
              "03410"
            ]
          },
          {
            "code": "AYM-TOR",
            "name": "Toraya",
            "zipCodes": [
              "03510"
            ]
          },
          {
            "code": "AYM-YAN",
            "name": "Yanaca",
            "zipCodes": [
              "03440"
            ]
          }
        ],
        "cities": [
          {
            "code": "AYM-CAP",
            "name": "Capaya",
            "zipCodes": [
              "03520"
            ]
          },
          {
            "code": "AYM-CAR",
            "name": "Caraybamba",
            "zipCodes": [
              "03570"
            ]
          },
          {
            "code": "AYM-CHA",
            "name": "Chalhuanca",
            "zipCodes": [
              "03560"
            ]
          },
          {
            "code": "AYM-CHA",
            "name": "Chapimarca",
            "zipCodes": [
              "03425"
            ]
          },
          {
            "code": "AYM-COL",
            "name": "Colcabamba",
            "zipCodes": [
              "03500"
            ]
          },
          {
            "code": "AYM-COT",
            "name": "Cotaruse",
            "zipCodes": [
              "03580"
            ]
          },
          {
            "code": "AYM-HUA",
            "name": "Huayllo",
            "zipCodes": [
              "03530"
            ]
          },
          {
            "code": "AYM-LUC",
            "name": "Lucre",
            "zipCodes": [
              "03415"
            ]
          },
          {
            "code": "AYM-PIC",
            "name": "Pichihua",
            "zipCodes": [
              "03430"
            ]
          },
          {
            "code": "AYM-POC",
            "name": "Pocohuanca",
            "zipCodes": [
              "03445"
            ]
          },
          {
            "code": "AYM-SAN",
            "name": "San Juan de Chacña",
            "zipCodes": [
              "03420"
            ]
          },
          {
            "code": "AYM-SAÑ",
            "name": "Sañayca",
            "zipCodes": [
              "03550"
            ]
          },
          {
            "code": "AYM-SOR",
            "name": "Soraya",
            "zipCodes": [
              "03540"
            ]
          },
          {
            "code": "AYM-TAP",
            "name": "Tapairihua",
            "zipCodes": [
              "03435"
            ]
          },
          {
            "code": "AYM-TIN",
            "name": "Tintay",
            "zipCodes": [
              "03410"
            ]
          },
          {
            "code": "AYM-TOR",
            "name": "Toraya",
            "zipCodes": [
              "03510"
            ]
          },
          {
            "code": "AYM-YAN",
            "name": "Yanaca",
            "zipCodes": [
              "03440"
            ]
          }
        ]
      },
      {
        "code": "CHI",
        "name": "Chincheros",
        "districts": [
          {
            "code": "CHI-ANC",
            "name": "Anco Huallo",
            "zipCodes": [
              "03840",
              "03841"
            ]
          },
          {
            "code": "CHI-CHI",
            "name": "Chincheros",
            "zipCodes": [
              "03850",
              "03851"
            ]
          },
          {
            "code": "CHI-COC",
            "name": "Cocharcas",
            "zipCodes": [
              "03820"
            ]
          },
          {
            "code": "CHI-HUA",
            "name": "Huaccana",
            "zipCodes": [
              "03880",
              "03881"
            ]
          },
          {
            "code": "CHI-OCO",
            "name": "Ocobamba",
            "zipCodes": [
              "03860",
              "03861"
            ]
          },
          {
            "code": "CHI-ONG",
            "name": "Ongoy",
            "zipCodes": [
              "03870",
              "03871"
            ]
          },
          {
            "code": "CHI-RAN",
            "name": "Ranracancha",
            "zipCodes": [
              "03830"
            ]
          },
          {
            "code": "CHI-URA",
            "name": "Uranmarca",
            "zipCodes": [
              "03810"
            ]
          }
        ],
        "cities": [
          {
            "code": "CHI-CHI",
            "name": "Chincheros",
            "zipCodes": [
              "03850",
              "03851"
            ]
          },
          {
            "code": "CHI-COC",
            "name": "Cocharcas",
            "zipCodes": [
              "03820"
            ]
          },
          {
            "code": "CHI-HUA",
            "name": "Huaccana",
            "zipCodes": [
              "03880",
              "03881"
            ]
          },
          {
            "code": "CHI-OCO",
            "name": "Ocobamba",
            "zipCodes": [
              "03860",
              "03861"
            ]
          },
          {
            "code": "CHI-ONG",
            "name": "Ongoy",
            "zipCodes": [
              "03870",
              "03871"
            ]
          },
          {
            "code": "CHI-RAN",
            "name": "Ranracancha",
            "zipCodes": [
              "03830"
            ]
          },
          {
            "code": "CHI-URA",
            "name": "Uranmarca",
            "zipCodes": [
              "03810"
            ]
          },
          {
            "code": "CHI-URI",
            "name": "Uripa",
            "zipCodes": [
              "03840",
              "03841"
            ]
          }
        ]
      },
      {
        "code": "COT",
        "name": "Cotabambas",
        "districts": [
          {
            "code": "COT-CHA",
            "name": "Challhuahuacho",
            "zipCodes": [
              "03260",
              "03261"
            ]
          },
          {
            "code": "COT-COT",
            "name": "Cotabambas",
            "zipCodes": [
              "03230"
            ]
          },
          {
            "code": "COT-COY",
            "name": "Coyllurqui",
            "zipCodes": [
              "03220",
              "03221"
            ]
          },
          {
            "code": "COT-HAQ",
            "name": "Haquira",
            "zipCodes": [
              "03270",
              "03271"
            ]
          },
          {
            "code": "COT-MAR",
            "name": "Mara",
            "zipCodes": [
              "03250",
              "03251"
            ]
          },
          {
            "code": "COT-TAM",
            "name": "Tambobamba",
            "zipCodes": [
              "03240",
              "03241"
            ]
          }
        ],
        "cities": [
          {
            "code": "COT-CHA",
            "name": "Challhuahuacho",
            "zipCodes": [
              "03260",
              "03261"
            ]
          },
          {
            "code": "COT-COT",
            "name": "Cotabambas",
            "zipCodes": [
              "03230"
            ]
          },
          {
            "code": "COT-COY",
            "name": "Coyllurqui",
            "zipCodes": [
              "03220",
              "03221"
            ]
          },
          {
            "code": "COT-HAQ",
            "name": "Haquira",
            "zipCodes": [
              "03270",
              "03271"
            ]
          },
          {
            "code": "COT-MAR",
            "name": "Mara",
            "zipCodes": [
              "03250",
              "03251"
            ]
          },
          {
            "code": "COT-TAM",
            "name": "Tambobamba",
            "zipCodes": [
              "03240",
              "03241"
            ]
          }
        ]
      },
      {
        "code": "GRA",
        "name": "Grau",
        "districts": [
          {
            "code": "COT-CHU",
            "name": "Chuquibambilla",
            "zipCodes": [
              "03310",
              "03311"
            ]
          },
          {
            "code": "COT-CUR",
            "name": "Curasco",
            "zipCodes": [
              "03290"
            ]
          },
          {
            "code": "COT-CUR",
            "name": "Curpahuasi",
            "zipCodes": [
              "03315"
            ]
          },
          {
            "code": "GRA-GAM",
            "name": "Gamarra",
            "zipCodes": [
              "03200"
            ]
          },
          {
            "code": "GRA-HUA",
            "name": "Huayllati",
            "zipCodes": [
              "03210"
            ]
          },
          {
            "code": "COT-MAM",
            "name": "Mamara",
            "zipCodes": [
              "03335"
            ]
          },
          {
            "code": "COT-MIC",
            "name": "Micaela Bastidas",
            "zipCodes": [
              "03325"
            ]
          },
          {
            "code": "ANT-PAT",
            "name": "Pataypampa",
            "zipCodes": [
              "03350"
            ]
          },
          {
            "code": "COT-PRO",
            "name": "Progreso",
            "zipCodes": [
              "03280"
            ]
          },
          {
            "code": "COT-SAN",
            "name": "San Antonio",
            "zipCodes": [
              "03330"
            ]
          },
          {
            "code": "ANT-SAN",
            "name": "Santa Rosa",
            "zipCodes": [
              "03345"
            ]
          },
          {
            "code": "ANT-TUR",
            "name": "Turpay",
            "zipCodes": [
              "03355"
            ]
          },
          {
            "code": "COT-VIL",
            "name": "Vilcabamba",
            "zipCodes": [
              "03320"
            ]
          },
          {
            "code": "ANT-VIR",
            "name": "Virundo",
            "zipCodes": [
              "03360"
            ]
          }
        ],
        "cities": [
          {
            "code": "COT-AYR",
            "name": "Ayrihuanca",
            "zipCodes": [
              "03325"
            ]
          },
          {
            "code": "COT-CHU",
            "name": "Chuquibambilla",
            "zipCodes": [
              "03310",
              "03311"
            ]
          },
          {
            "code": "COT-CUR",
            "name": "Curasco",
            "zipCodes": [
              "03290"
            ]
          },
          {
            "code": "COT-CUR",
            "name": "Curpahuasi",
            "zipCodes": [
              "03315"
            ]
          },
          {
            "code": "GRA-HUA",
            "name": "Huayllati",
            "zipCodes": [
              "03210"
            ]
          },
          {
            "code": "COT-MAM",
            "name": "Mamara",
            "zipCodes": [
              "03335"
            ]
          },
          {
            "code": "GRA-PAL",
            "name": "Palpacachi",
            "zipCodes": [
              "03200"
            ]
          },
          {
            "code": "ANT-PAT",
            "name": "Pataypampa",
            "zipCodes": [
              "03350"
            ]
          },
          {
            "code": "COT-PRO",
            "name": "Progreso",
            "zipCodes": [
              "03280"
            ]
          },
          {
            "code": "COT-SAN",
            "name": "San Antonio",
            "zipCodes": [
              "03330"
            ]
          },
          {
            "code": "ANT-SAN",
            "name": "San Juan de Virundo",
            "zipCodes": [
              "03360"
            ]
          },
          {
            "code": "ANT-SAN",
            "name": "Santa Rosa",
            "zipCodes": [
              "03345"
            ]
          },
          {
            "code": "ANT-TUR",
            "name": "Turpay",
            "zipCodes": [
              "03355"
            ]
          },
          {
            "code": "COT-VIL",
            "name": "Vilcabamba",
            "zipCodes": [
              "03320"
            ]
          }
        ]
      }
    ]
  },
  {
    "code": "ARE",
    "name": "Arequipa",
    "provinces": [
      {
        "code": "ARE",
        "name": "Arequipa",
        "districts": [
          {
            "code": "ARE-ALT",
            "name": "Alto Selva Alegre",
            "zipCodes": [
              "04001",
              "04003",
              "04004"
            ]
          },
          {
            "code": "ARE-ARE",
            "name": "Arequipa",
            "zipCodes": [
              "04001",
              "04002",
              "04011",
              "04013",
              "04017"
            ]
          },
          {
            "code": "ARE-CAY",
            "name": "Cayma",
            "zipCodes": [
              "04000",
              "04013",
              "04014",
              "04017",
              "04018"
            ]
          },
          {
            "code": "ARE-CER",
            "name": "Cerro Colorado",
            "zipCodes": [
              "04000",
              "04013",
              "04014",
              "04016",
              "04017"
            ]
          },
          {
            "code": "ARE-CHA",
            "name": "Characato",
            "zipCodes": [
              "04000",
              "04012"
            ]
          },
          {
            "code": "CON-CHI",
            "name": "Chiguata",
            "zipCodes": [
              "04200"
            ]
          },
          {
            "code": "ARE-JAC",
            "name": "Jacobo Hunter",
            "zipCodes": [
              "04011",
              "04012"
            ]
          },
          {
            "code": "ARE-JOS",
            "name": "José Luis Bustamante y Rivero",
            "zipCodes": [
              "04002",
              "04008",
              "04009",
              "04011",
              "04012"
            ]
          },
          {
            "code": "CON-LA ",
            "name": "La Joya",
            "zipCodes": [
              "04405",
              "04406"
            ]
          },
          {
            "code": "ARE-MAR",
            "name": "Mariano Melgar",
            "zipCodes": [
              "04002",
              "04006"
            ]
          },
          {
            "code": "ARE-MIR",
            "name": "Miraflores",
            "zipCodes": [
              "04001",
              "04004"
            ]
          },
          {
            "code": "CON-MOL",
            "name": "Mollebaya",
            "zipCodes": [
              "04300"
            ]
          },
          {
            "code": "ARE-PAU",
            "name": "Paucarpata",
            "zipCodes": [
              "04002",
              "04007",
              "04008",
              "04009"
            ]
          },
          {
            "code": "CON-POC",
            "name": "Pocsi",
            "zipCodes": [
              "04310"
            ]
          },
          {
            "code": "CON-POL",
            "name": "Polobaya",
            "zipCodes": [
              "04320"
            ]
          },
          {
            "code": "CON-QUE",
            "name": "Quequeña",
            "zipCodes": [
              "04340"
            ]
          },
          {
            "code": "ARE-SAB",
            "name": "Sabandía",
            "zipCodes": [
              "04000",
              "04012"
            ]
          },
          {
            "code": "ARE-SAC",
            "name": "Sachaca",
            "zipCodes": [
              "04013"
            ]
          },
          {
            "code": "ARE-SAN",
            "name": "San Juan de Siguas",
            "zipCodes": [
              "04105"
            ]
          },
          {
            "code": "CON-SAN",
            "name": "San Juan de Tarucani",
            "zipCodes": [
              "04210"
            ]
          },
          {
            "code": "ARE-SAN",
            "name": "Santa Isabel de Siguas",
            "zipCodes": [
              "04108"
            ]
          },
          {
            "code": "ARE-SAN",
            "name": "Santa Rita de Siguas",
            "zipCodes": [
              "04102"
            ]
          },
          {
            "code": "ARE-SOC",
            "name": "Socabaya",
            "zipCodes": [
              "04000",
              "04009",
              "04011",
              "04012",
              "04013"
            ]
          },
          {
            "code": "ARE-TIA",
            "name": "Tiabaya",
            "zipCodes": [
              "04000",
              "04013"
            ]
          },
          {
            "code": "CON-UCH",
            "name": "Uchumayo",
            "zipCodes": [
              "04400",
              "04401"
            ]
          },
          {
            "code": "ARE-VIT",
            "name": "Vitor",
            "zipCodes": [
              "04100"
            ]
          },
          {
            "code": "ARE-YAN",
            "name": "Yanahuara",
            "zipCodes": [
              "04013",
              "04014",
              "04017"
            ]
          },
          {
            "code": "CON-YAR",
            "name": "Yarabamba",
            "zipCodes": [
              "04330"
            ]
          },
          {
            "code": "ARE-YUR",
            "name": "Yura",
            "zipCodes": [
              "04000",
              "04016",
              "04076"
            ]
          }
        ],
        "cities": [
          {
            "code": "ARE-ARE",
            "name": "Arequipa",
            "zipCodes": [
              "04001",
              "04002",
              "04011",
              "04013",
              "04017"
            ]
          },
          {
            "code": "ARE-CAY",
            "name": "Cayma",
            "zipCodes": [
              "04000",
              "04013",
              "04014",
              "04017",
              "04018"
            ]
          },
          {
            "code": "ARE-CHA",
            "name": "Characato",
            "zipCodes": [
              "04000",
              "04012"
            ]
          },
          {
            "code": "CON-CHI",
            "name": "Chiguata",
            "zipCodes": [
              "04200"
            ]
          },
          {
            "code": "ARE-CIU",
            "name": "Ciudad Satelite",
            "zipCodes": [
              "04002",
              "04008",
              "04009",
              "04011",
              "04012"
            ]
          },
          {
            "code": "ARE-JAC",
            "name": "Jacobo Hunter",
            "zipCodes": [
              "04011",
              "04012"
            ]
          },
          {
            "code": "CON-LA ",
            "name": "La Joya",
            "zipCodes": [
              "04405",
              "04406"
            ]
          },
          {
            "code": "ARE-LA ",
            "name": "La Libertad",
            "zipCodes": [
              "04000",
              "04013",
              "04014",
              "04016",
              "04017"
            ]
          },
          {
            "code": "ARE-MAR",
            "name": "Mariano Melgar",
            "zipCodes": [
              "04002",
              "04006"
            ]
          },
          {
            "code": "ARE-MIR",
            "name": "Miraflores",
            "zipCodes": [
              "04001",
              "04004"
            ]
          },
          {
            "code": "CON-MOL",
            "name": "Mollebaya",
            "zipCodes": [
              "04300"
            ]
          },
          {
            "code": "ARE-PAU",
            "name": "Paucarpata",
            "zipCodes": [
              "04002",
              "04007",
              "04008",
              "04009"
            ]
          },
          {
            "code": "CON-POC",
            "name": "Pocsi",
            "zipCodes": [
              "04310"
            ]
          },
          {
            "code": "CON-POL",
            "name": "Polobaya Grande",
            "zipCodes": [
              "04320"
            ]
          },
          {
            "code": "CON-QUE",
            "name": "Quequeña",
            "zipCodes": [
              "04340"
            ]
          },
          {
            "code": "ARE-SAB",
            "name": "Sabandia",
            "zipCodes": [
              "04000",
              "04012"
            ]
          },
          {
            "code": "ARE-SAC",
            "name": "Sachaca",
            "zipCodes": [
              "04013"
            ]
          },
          {
            "code": "ARE-SAN",
            "name": "Santa Isabel de Siguas",
            "zipCodes": [
              "04108"
            ]
          },
          {
            "code": "ARE-SAN",
            "name": "Santa Rita de Siguas",
            "zipCodes": [
              "04102"
            ]
          },
          {
            "code": "ARE-SEL",
            "name": "Selva Alegre",
            "zipCodes": [
              "04001",
              "04003",
              "04004"
            ]
          },
          {
            "code": "ARE-SOC",
            "name": "Socabaya",
            "zipCodes": [
              "04000",
              "04009",
              "04011",
              "04012",
              "04013"
            ]
          },
          {
            "code": "ARE-TAM",
            "name": "Tambillo",
            "zipCodes": [
              "04105"
            ]
          },
          {
            "code": "CON-TAR",
            "name": "Tarucani",
            "zipCodes": [
              "04210"
            ]
          },
          {
            "code": "ARE-TIA",
            "name": "Tiabaya",
            "zipCodes": [
              "04000",
              "04013"
            ]
          },
          {
            "code": "CON-UCH",
            "name": "Uchumayo",
            "zipCodes": [
              "04400",
              "04401"
            ]
          },
          {
            "code": "ARE-VIT",
            "name": "Vitor",
            "zipCodes": [
              "04100"
            ]
          },
          {
            "code": "ARE-YAN",
            "name": "Yanahuara",
            "zipCodes": [
              "04013",
              "04014",
              "04017"
            ]
          },
          {
            "code": "CON-YAR",
            "name": "Yarabamba",
            "zipCodes": [
              "04330"
            ]
          },
          {
            "code": "ARE-YUR",
            "name": "Yura (Baños de Yura)",
            "zipCodes": [
              "04000",
              "04016",
              "04076"
            ]
          }
        ]
      },
      {
        "code": "CAM",
        "name": "Camana",
        "districts": [
          {
            "code": "CAM-CAM",
            "name": "Camaná",
            "zipCodes": [
              "04450",
              "04451"
            ]
          },
          {
            "code": "CAM-JOS",
            "name": "José María Quimper",
            "zipCodes": [
              "04460"
            ]
          },
          {
            "code": "CAS-MAR",
            "name": "Mariano Nicolas Valcarcel",
            "zipCodes": [
              "04760"
            ]
          },
          {
            "code": "CAM-MAR",
            "name": "Mariscal Cáceres",
            "zipCodes": [
              "04465",
              "04466"
            ]
          },
          {
            "code": "CAM-NIC",
            "name": "Nicolas de Pierola",
            "zipCodes": [
              "04455",
              "04456"
            ]
          },
          {
            "code": "CAM-OCO",
            "name": "Ocoña",
            "zipCodes": [
              "04470"
            ]
          },
          {
            "code": "CAM-QUI",
            "name": "Quilca",
            "zipCodes": [
              "04440"
            ]
          },
          {
            "code": "CAM-SAM",
            "name": "Samuel Pastor",
            "zipCodes": [
              "04445",
              "04446"
            ]
          }
        ],
        "cities": [
          {
            "code": "CAM-CAM",
            "name": "Camana",
            "zipCodes": [
              "04450",
              "04451"
            ]
          },
          {
            "code": "CAM-EL ",
            "name": "El Cardo",
            "zipCodes": [
              "04460"
            ]
          },
          {
            "code": "CAM-LA ",
            "name": "La Pampa",
            "zipCodes": [
              "04445",
              "04446"
            ]
          },
          {
            "code": "CAM-OCO",
            "name": "Ocoña",
            "zipCodes": [
              "04470"
            ]
          },
          {
            "code": "CAM-QUI",
            "name": "Quilca",
            "zipCodes": [
              "04440"
            ]
          },
          {
            "code": "CAM-SAN",
            "name": "San Gregorio",
            "zipCodes": [
              "04455",
              "04456"
            ]
          },
          {
            "code": "CAM-SAN",
            "name": "San Jose",
            "zipCodes": [
              "04465",
              "04466"
            ]
          },
          {
            "code": "CAS-URA",
            "name": "Urasqui",
            "zipCodes": [
              "04760"
            ]
          }
        ]
      },
      {
        "code": "CAR",
        "name": "Caraveli",
        "districts": [
          {
            "code": "CAR-ACA",
            "name": "Acarí",
            "zipCodes": [
              "04550"
            ]
          },
          {
            "code": "CAR-ATI",
            "name": "Atico",
            "zipCodes": [
              "04475"
            ]
          },
          {
            "code": "CAR-ATI",
            "name": "Atiquipa",
            "zipCodes": [
              "04520"
            ]
          },
          {
            "code": "CAR-BEL",
            "name": "Bella Unión",
            "zipCodes": [
              "04560"
            ]
          },
          {
            "code": "CAS-CAH",
            "name": "Cahuacho",
            "zipCodes": [
              "04750"
            ]
          },
          {
            "code": "CAS-CAR",
            "name": "Caravelí",
            "zipCodes": [
              "04740"
            ]
          },
          {
            "code": "CAR-CHA",
            "name": "Chala",
            "zipCodes": [
              "04500",
              "04501"
            ]
          },
          {
            "code": "CAR-CHA",
            "name": "Chaparra",
            "zipCodes": [
              "04580"
            ]
          },
          {
            "code": "CAR-HUA",
            "name": "Huanuhuanu",
            "zipCodes": [
              "04510"
            ]
          },
          {
            "code": "CAR-JAQ",
            "name": "Jaqui",
            "zipCodes": [
              "04540"
            ]
          },
          {
            "code": "CAR-LOM",
            "name": "Lomas",
            "zipCodes": [
              "04570"
            ]
          },
          {
            "code": "CAR-QUI",
            "name": "Quicacha",
            "zipCodes": [
              "04590"
            ]
          },
          {
            "code": "CAR-YAU",
            "name": "Yauca",
            "zipCodes": [
              "04530"
            ]
          }
        ],
        "cities": [
          {
            "code": "CAR-ACA",
            "name": "Acari",
            "zipCodes": [
              "04550"
            ]
          },
          {
            "code": "CAR-ACH",
            "name": "Achanizo",
            "zipCodes": [
              "04580"
            ]
          },
          {
            "code": "CAR-ATI",
            "name": "Atico",
            "zipCodes": [
              "04475"
            ]
          },
          {
            "code": "CAR-ATI",
            "name": "Atiquipa",
            "zipCodes": [
              "04520"
            ]
          },
          {
            "code": "CAR-BEL",
            "name": "Bella Union",
            "zipCodes": [
              "04560"
            ]
          },
          {
            "code": "CAS-CAH",
            "name": "Cahuacho",
            "zipCodes": [
              "04750"
            ]
          },
          {
            "code": "CAS-CAR",
            "name": "Caraveli",
            "zipCodes": [
              "04740"
            ]
          },
          {
            "code": "CAR-CHA",
            "name": "Chala",
            "zipCodes": [
              "04500",
              "04501"
            ]
          },
          {
            "code": "CAR-JAQ",
            "name": "Jaqui",
            "zipCodes": [
              "04540"
            ]
          },
          {
            "code": "CAR-LOM",
            "name": "Lomas",
            "zipCodes": [
              "04570"
            ]
          },
          {
            "code": "CAR-QUI",
            "name": "Quicacha",
            "zipCodes": [
              "04590"
            ]
          },
          {
            "code": "CAR-TOC",
            "name": "Tocota",
            "zipCodes": [
              "04510"
            ]
          },
          {
            "code": "CAR-YAU",
            "name": "Yauca",
            "zipCodes": [
              "04530"
            ]
          }
        ]
      },
      {
        "code": "CAS",
        "name": "Castilla",
        "districts": [
          {
            "code": "CAS-AND",
            "name": "Andagua",
            "zipCodes": [
              "04640"
            ]
          },
          {
            "code": "CAS-APL",
            "name": "Aplao",
            "zipCodes": [
              "04605",
              "04606"
            ]
          },
          {
            "code": "CAS-AYO",
            "name": "Ayo",
            "zipCodes": [
              "04645"
            ]
          },
          {
            "code": "CAS-CHA",
            "name": "Chachas",
            "zipCodes": [
              "04660"
            ]
          },
          {
            "code": "CAS-CHI",
            "name": "Chilcaymarca",
            "zipCodes": [
              "04650"
            ]
          },
          {
            "code": "CAS-CHO",
            "name": "Choco",
            "zipCodes": [
              "04665"
            ]
          },
          {
            "code": "CAS-HUA",
            "name": "Huancarqui",
            "zipCodes": [
              "04610"
            ]
          },
          {
            "code": "CAS-MAC",
            "name": "Machaguay",
            "zipCodes": [
              "04630"
            ]
          },
          {
            "code": "CAS-ORC",
            "name": "Orcopampa",
            "zipCodes": [
              "04655",
              "04656"
            ]
          },
          {
            "code": "CAS-PAM",
            "name": "Pampacolca",
            "zipCodes": [
              "04620"
            ]
          },
          {
            "code": "CAS-TIP",
            "name": "Tipan",
            "zipCodes": [
              "04615"
            ]
          },
          {
            "code": "CAS-URA",
            "name": "Uraca",
            "zipCodes": [
              "04600",
              "04601"
            ]
          },
          {
            "code": "CAS-UÑO",
            "name": "Uñon",
            "zipCodes": [
              "04635"
            ]
          },
          {
            "code": "CAS-VIR",
            "name": "Viraco",
            "zipCodes": [
              "04625"
            ]
          }
        ],
        "cities": [
          {
            "code": "CAS-AND",
            "name": "Andagua",
            "zipCodes": [
              "04640"
            ]
          },
          {
            "code": "CAS-APL",
            "name": "Aplao",
            "zipCodes": [
              "04605",
              "04606"
            ]
          },
          {
            "code": "CAS-AYO",
            "name": "Ayo",
            "zipCodes": [
              "04645"
            ]
          },
          {
            "code": "CAS-CHA",
            "name": "Chachas",
            "zipCodes": [
              "04660"
            ]
          },
          {
            "code": "CAS-CHI",
            "name": "Chilcaymarca",
            "zipCodes": [
              "04650"
            ]
          },
          {
            "code": "CAS-CHO",
            "name": "Choco",
            "zipCodes": [
              "04665"
            ]
          },
          {
            "code": "CAS-COR",
            "name": "Corire",
            "zipCodes": [
              "04600",
              "04601"
            ]
          },
          {
            "code": "CAS-HUA",
            "name": "Huancarqui",
            "zipCodes": [
              "04610"
            ]
          },
          {
            "code": "CAS-MAC",
            "name": "Machahuay",
            "zipCodes": [
              "04630"
            ]
          },
          {
            "code": "CAS-ORC",
            "name": "Orcopampa",
            "zipCodes": [
              "04655",
              "04656"
            ]
          },
          {
            "code": "CAS-PAM",
            "name": "Pampacolca",
            "zipCodes": [
              "04620"
            ]
          },
          {
            "code": "CAS-TIP",
            "name": "Tipan",
            "zipCodes": [
              "04615"
            ]
          },
          {
            "code": "CAS-UÑO",
            "name": "Uñon",
            "zipCodes": [
              "04635"
            ]
          },
          {
            "code": "CAS-VIR",
            "name": "Viraco",
            "zipCodes": [
              "04625"
            ]
          }
        ]
      },
      {
        "code": "CAY",
        "name": "Caylloma",
        "districts": [
          {
            "code": "CAY-ACH",
            "name": "Achoma",
            "zipCodes": [
              "04135"
            ]
          },
          {
            "code": "CAY-CAB",
            "name": "Cabanaconde",
            "zipCodes": [
              "04124"
            ]
          },
          {
            "code": "CAY-CAL",
            "name": "Callalli",
            "zipCodes": [
              "04180"
            ]
          },
          {
            "code": "CAY-CAY",
            "name": "Caylloma",
            "zipCodes": [
              "04190"
            ]
          },
          {
            "code": "CAY-CHI",
            "name": "Chivay",
            "zipCodes": [
              "04145",
              "04146"
            ]
          },
          {
            "code": "CAY-COP",
            "name": "Coporaque",
            "zipCodes": [
              "04150"
            ]
          },
          {
            "code": "CAY-HUA",
            "name": "Huambo",
            "zipCodes": [
              "04120"
            ]
          },
          {
            "code": "CAY-HUA",
            "name": "Huanca",
            "zipCodes": [
              "04118"
            ]
          },
          {
            "code": "CAY-ICH",
            "name": "Ichupampa",
            "zipCodes": [
              "04155"
            ]
          },
          {
            "code": "CAY-LAR",
            "name": "Lari",
            "zipCodes": [
              "04160"
            ]
          },
          {
            "code": "CAY-LLU",
            "name": "Lluta",
            "zipCodes": [
              "04115"
            ]
          },
          {
            "code": "CAY-MAC",
            "name": "Maca",
            "zipCodes": [
              "04130"
            ]
          },
          {
            "code": "CAY-MAD",
            "name": "Madrigal",
            "zipCodes": [
              "04165"
            ]
          },
          {
            "code": "CAY-MAJ",
            "name": "Majes",
            "zipCodes": [
              "04110",
              "04112"
            ]
          },
          {
            "code": "CON-SAN",
            "name": "San Antonio de Chuca",
            "zipCodes": [
              "04220"
            ]
          },
          {
            "code": "CAY-SIB",
            "name": "Sibayo",
            "zipCodes": [
              "04175"
            ]
          },
          {
            "code": "CAY-TAP",
            "name": "Tapay",
            "zipCodes": [
              "04125"
            ]
          },
          {
            "code": "CAY-TIS",
            "name": "Tisco",
            "zipCodes": [
              "04185"
            ]
          },
          {
            "code": "CAY-TUT",
            "name": "Tuti",
            "zipCodes": [
              "04170"
            ]
          },
          {
            "code": "CAY-YAN",
            "name": "Yanque",
            "zipCodes": [
              "04140"
            ]
          }
        ],
        "cities": [
          {
            "code": "CAY-ACH",
            "name": "Achoma",
            "zipCodes": [
              "04135"
            ]
          },
          {
            "code": "CAY-CAB",
            "name": "Cabanaconde",
            "zipCodes": [
              "04124"
            ]
          },
          {
            "code": "CAY-CAL",
            "name": "Callalli",
            "zipCodes": [
              "04180"
            ]
          },
          {
            "code": "CAY-CAY",
            "name": "Caylloma",
            "zipCodes": [
              "04190"
            ]
          },
          {
            "code": "CAY-CHI",
            "name": "Chivay",
            "zipCodes": [
              "04145",
              "04146"
            ]
          },
          {
            "code": "CAY-COP",
            "name": "Coporaque",
            "zipCodes": [
              "04150"
            ]
          },
          {
            "code": "CAY-EL ",
            "name": "El Pedregal",
            "zipCodes": [
              "04110",
              "04112"
            ]
          },
          {
            "code": "CAY-HUA",
            "name": "Huambo",
            "zipCodes": [
              "04120"
            ]
          },
          {
            "code": "CAY-HUA",
            "name": "Huanca",
            "zipCodes": [
              "04118"
            ]
          },
          {
            "code": "CAY-ICH",
            "name": "Ichupampa",
            "zipCodes": [
              "04155"
            ]
          },
          {
            "code": "CON-IMA",
            "name": "Imata",
            "zipCodes": [
              "04220"
            ]
          },
          {
            "code": "CAY-LAR",
            "name": "Lari",
            "zipCodes": [
              "04160"
            ]
          },
          {
            "code": "CAY-LLU",
            "name": "Lluta",
            "zipCodes": [
              "04115"
            ]
          },
          {
            "code": "CAY-MAC",
            "name": "Maca",
            "zipCodes": [
              "04130"
            ]
          },
          {
            "code": "CAY-MAD",
            "name": "Madrigal",
            "zipCodes": [
              "04165"
            ]
          },
          {
            "code": "CAY-SIB",
            "name": "Sibayo",
            "zipCodes": [
              "04175"
            ]
          },
          {
            "code": "CAY-TAP",
            "name": "Tapay",
            "zipCodes": [
              "04125"
            ]
          },
          {
            "code": "CAY-TIS",
            "name": "Tisco",
            "zipCodes": [
              "04185"
            ]
          },
          {
            "code": "CAY-TUT",
            "name": "Tuti",
            "zipCodes": [
              "04170"
            ]
          },
          {
            "code": "CAY-YAN",
            "name": "Yanque",
            "zipCodes": [
              "04140"
            ]
          }
        ]
      },
      {
        "code": "CON",
        "name": "Condesuyos",
        "districts": [
          {
            "code": "CAS-AND",
            "name": "Andaray",
            "zipCodes": [
              "04720"
            ]
          },
          {
            "code": "CON-CAY",
            "name": "Cayarani",
            "zipCodes": [
              "04195"
            ]
          },
          {
            "code": "CAS-CHI",
            "name": "Chichas",
            "zipCodes": [
              "04805"
            ]
          },
          {
            "code": "CAS-CHU",
            "name": "Chuquibamba",
            "zipCodes": [
              "04710"
            ]
          },
          {
            "code": "CAS-IRA",
            "name": "Iray",
            "zipCodes": [
              "04700"
            ]
          },
          {
            "code": "CAS-RÍO",
            "name": "Río Grande",
            "zipCodes": [
              "04770"
            ]
          },
          {
            "code": "CAS-SAL",
            "name": "Salamanca",
            "zipCodes": [
              "04800"
            ]
          },
          {
            "code": "CAS-YAN",
            "name": "Yanaquihua",
            "zipCodes": [
              "04730"
            ]
          }
        ],
        "cities": [
          {
            "code": "CAS-AND",
            "name": "Andaray",
            "zipCodes": [
              "04720"
            ]
          },
          {
            "code": "CON-CAY",
            "name": "Cayarani",
            "zipCodes": [
              "04195"
            ]
          },
          {
            "code": "CAS-CHI",
            "name": "Chichas",
            "zipCodes": [
              "04805"
            ]
          },
          {
            "code": "CAS-CHU",
            "name": "Chuquibamba",
            "zipCodes": [
              "04710"
            ]
          },
          {
            "code": "CAS-IQU",
            "name": "Iquipi",
            "zipCodes": [
              "04770"
            ]
          },
          {
            "code": "CAS-IRA",
            "name": "Iray",
            "zipCodes": [
              "04700"
            ]
          },
          {
            "code": "CAS-SAL",
            "name": "Salamanca",
            "zipCodes": [
              "04800"
            ]
          },
          {
            "code": "CAS-YAN",
            "name": "Yanaquihua",
            "zipCodes": [
              "04730"
            ]
          }
        ]
      },
      {
        "code": "ISL",
        "name": "Islay",
        "districts": [
          {
            "code": "ISL-COC",
            "name": "Cocachacra",
            "zipCodes": [
              "04430",
              "04431"
            ]
          },
          {
            "code": "ISL-DEA",
            "name": "Dean Valdivia",
            "zipCodes": [
              "04425",
              "04426"
            ]
          },
          {
            "code": "ISL-ISL",
            "name": "Islay",
            "zipCodes": [
              "04410"
            ]
          },
          {
            "code": "ISL-MEJ",
            "name": "Mejía",
            "zipCodes": [
              "04420"
            ]
          },
          {
            "code": "ISL-MOL",
            "name": "Mollendo",
            "zipCodes": [
              "04415",
              "04416"
            ]
          },
          {
            "code": "ISL-PUN",
            "name": "Punta de Bombón",
            "zipCodes": [
              "04435",
              "04436"
            ]
          }
        ],
        "cities": [
          {
            "code": "ISL-COC",
            "name": "Cocachacra",
            "zipCodes": [
              "04430",
              "04431"
            ]
          },
          {
            "code": "ISL-ISL",
            "name": "Islay (Matarani)",
            "zipCodes": [
              "04410"
            ]
          },
          {
            "code": "ISL-LA ",
            "name": "La Curva",
            "zipCodes": [
              "04425",
              "04426"
            ]
          },
          {
            "code": "ISL-MEJ",
            "name": "Mejia",
            "zipCodes": [
              "04420"
            ]
          },
          {
            "code": "ISL-MOL",
            "name": "Mollendo",
            "zipCodes": [
              "04415",
              "04416"
            ]
          },
          {
            "code": "ISL-PUN",
            "name": "Punta de Bombon",
            "zipCodes": [
              "04435",
              "04436"
            ]
          }
        ]
      },
      {
        "code": "LA ",
        "name": "La Unión",
        "districts": [
          {
            "code": "LA -ALC",
            "name": "Alca",
            "zipCodes": [
              "04830"
            ]
          },
          {
            "code": "LA -CHA",
            "name": "Charcana",
            "zipCodes": [
              "04850"
            ]
          },
          {
            "code": "LA -COT",
            "name": "Cotahuasi",
            "zipCodes": [
              "04810"
            ]
          },
          {
            "code": "LA -HUA",
            "name": "Huaynacotas",
            "zipCodes": [
              "04820"
            ]
          },
          {
            "code": "LA -PAM",
            "name": "Pampamarca",
            "zipCodes": [
              "04815"
            ]
          },
          {
            "code": "LA -PUY",
            "name": "Puyca",
            "zipCodes": [
              "04835"
            ]
          },
          {
            "code": "LA -QUE",
            "name": "Quechualla",
            "zipCodes": [
              "04845"
            ]
          },
          {
            "code": "LA -SAY",
            "name": "Sayla",
            "zipCodes": [
              "04855"
            ]
          },
          {
            "code": "LA -TAU",
            "name": "Tauría",
            "zipCodes": [
              "04860"
            ]
          },
          {
            "code": "LA -TOM",
            "name": "Tomepampa",
            "zipCodes": [
              "04825"
            ]
          },
          {
            "code": "LA -TOR",
            "name": "Toro",
            "zipCodes": [
              "04840"
            ]
          }
        ],
        "cities": [
          {
            "code": "LA -ALC",
            "name": "Alca",
            "zipCodes": [
              "04830"
            ]
          },
          {
            "code": "LA -CHA",
            "name": "Charcana",
            "zipCodes": [
              "04850"
            ]
          },
          {
            "code": "LA -COT",
            "name": "Cotahuasi",
            "zipCodes": [
              "04810"
            ]
          },
          {
            "code": "LA -MUN",
            "name": "Mungui",
            "zipCodes": [
              "04815"
            ]
          },
          {
            "code": "LA -PUY",
            "name": "Puyca",
            "zipCodes": [
              "04835"
            ]
          },
          {
            "code": "LA -SAY",
            "name": "Sayla",
            "zipCodes": [
              "04855"
            ]
          },
          {
            "code": "LA -TAU",
            "name": "Tauria",
            "zipCodes": [
              "04860"
            ]
          },
          {
            "code": "LA -TAU",
            "name": "Taurisma",
            "zipCodes": [
              "04820"
            ]
          },
          {
            "code": "LA -TOM",
            "name": "Tomepampa",
            "zipCodes": [
              "04825"
            ]
          },
          {
            "code": "LA -TOR",
            "name": "Toro",
            "zipCodes": [
              "04840"
            ]
          },
          {
            "code": "LA -VEL",
            "name": "Velinga",
            "zipCodes": [
              "04845"
            ]
          }
        ]
      }
    ]
  },
  {
    "code": "AYA",
    "name": "Ayacucho",
    "provinces": [
      {
        "code": "CAN",
        "name": "Cangallo",
        "districts": [
          {
            "code": "CAN-CAN",
            "name": "Cangallo",
            "zipCodes": [
              "05400",
              "05401"
            ]
          },
          {
            "code": "HUN-CHU",
            "name": "Chuschi",
            "zipCodes": [
              "05835",
              "05836"
            ]
          },
          {
            "code": "HUN-LOS",
            "name": "Los Morochucos",
            "zipCodes": [
              "05845",
              "05846"
            ]
          },
          {
            "code": "HUN-MAR",
            "name": "María Parado de Bellido",
            "zipCodes": [
              "05840"
            ]
          },
          {
            "code": "HUN-PAR",
            "name": "Paras",
            "zipCodes": [
              "05820",
              "05821"
            ]
          },
          {
            "code": "HUN-TOT",
            "name": "Totos",
            "zipCodes": [
              "05830"
            ]
          }
        ],
        "cities": [
          {
            "code": "CAN-CAN",
            "name": "Cangallo",
            "zipCodes": [
              "05400",
              "05401"
            ]
          },
          {
            "code": "HUN-CHU",
            "name": "Chuschi",
            "zipCodes": [
              "05835",
              "05836"
            ]
          },
          {
            "code": "HUN-PAM",
            "name": "Pampa Cangallo",
            "zipCodes": [
              "05845",
              "05846"
            ]
          },
          {
            "code": "HUN-PAR",
            "name": "Paras",
            "zipCodes": [
              "05820",
              "05821"
            ]
          },
          {
            "code": "HUN-POM",
            "name": "Pomabamba",
            "zipCodes": [
              "05840"
            ]
          },
          {
            "code": "HUN-TOT",
            "name": "Totos",
            "zipCodes": [
              "05830"
            ]
          }
        ]
      },
      {
        "code": "HUA",
        "name": "Huamanga",
        "districts": [
          {
            "code": "LA -ACO",
            "name": "Acocro",
            "zipCodes": [
              "05305",
              "05306"
            ]
          },
          {
            "code": "HUA-ACO",
            "name": "Acos Vinchos",
            "zipCodes": [
              "05180",
              "05181"
            ]
          },
          {
            "code": "HUA-AYA",
            "name": "Ayacucho",
            "zipCodes": [
              "05000",
              "05001",
              "05002",
              "05003"
            ]
          },
          {
            "code": "HUA-CAR",
            "name": "Carmen Alto",
            "zipCodes": [
              "05000",
              "05002"
            ]
          },
          {
            "code": "LA -CHI",
            "name": "Chiara",
            "zipCodes": [
              "05315",
              "05316"
            ]
          },
          {
            "code": "HUA-JES",
            "name": "Jesús Nazareno",
            "zipCodes": [
              "05000",
              "05001"
            ]
          },
          {
            "code": "LA -OCR",
            "name": "Ocros",
            "zipCodes": [
              "05310",
              "05311"
            ]
          },
          {
            "code": "HUA-PAC",
            "name": "Pacaycasa",
            "zipCodes": [
              "05100"
            ]
          },
          {
            "code": "HUA-QUI",
            "name": "Quinua",
            "zipCodes": [
              "05160",
              "05161"
            ]
          },
          {
            "code": "HUN-SAN",
            "name": "San José de Ticllas",
            "zipCodes": [
              "05805"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "San Juan Bautista",
            "zipCodes": [
              "05000",
              "05001",
              "05002"
            ]
          },
          {
            "code": "HUN-SAN",
            "name": "Santiago de Pischa",
            "zipCodes": [
              "05800"
            ]
          },
          {
            "code": "HUN-SOC",
            "name": "Socos",
            "zipCodes": [
              "05810",
              "05811"
            ]
          },
          {
            "code": "LA -TAM",
            "name": "Tambillo",
            "zipCodes": [
              "05300",
              "05301"
            ]
          },
          {
            "code": "HUN-VIN",
            "name": "Vinchos",
            "zipCodes": [
              "05815",
              "05816"
            ]
          }
        ],
        "cities": [
          {
            "code": "LA -ACO",
            "name": "Acocro",
            "zipCodes": [
              "05305",
              "05306"
            ]
          },
          {
            "code": "HUA-ACO",
            "name": "Acos Vinchos",
            "zipCodes": [
              "05180",
              "05181"
            ]
          },
          {
            "code": "HUA-AYA",
            "name": "Ayacucho",
            "zipCodes": [
              "05000",
              "05001",
              "05002",
              "05003"
            ]
          },
          {
            "code": "HUA-CAR",
            "name": "Carmen",
            "zipCodes": [
              "05000",
              "05002"
            ]
          },
          {
            "code": "LA -CHI",
            "name": "Chiara",
            "zipCodes": [
              "05315",
              "05316"
            ]
          },
          {
            "code": "HUA-LAS",
            "name": "Las Nazarenas",
            "zipCodes": [
              "05000",
              "05001"
            ]
          },
          {
            "code": "LA -OCR",
            "name": "Ocros",
            "zipCodes": [
              "05310",
              "05311"
            ]
          },
          {
            "code": "HUA-PAC",
            "name": "Pacaycasa",
            "zipCodes": [
              "05100"
            ]
          },
          {
            "code": "HUA-QUI",
            "name": "Quinua",
            "zipCodes": [
              "05160",
              "05161"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "San Juan Bautista",
            "zipCodes": [
              "05000",
              "05001",
              "05002"
            ]
          },
          {
            "code": "HUN-SAN",
            "name": "San Pedro de Cachi",
            "zipCodes": [
              "05800"
            ]
          },
          {
            "code": "HUN-SOC",
            "name": "Socos",
            "zipCodes": [
              "05810",
              "05811"
            ]
          },
          {
            "code": "LA -TAM",
            "name": "Tambillo",
            "zipCodes": [
              "05300",
              "05301"
            ]
          },
          {
            "code": "HUN-TIC",
            "name": "Ticllas",
            "zipCodes": [
              "05805"
            ]
          },
          {
            "code": "HUN-VIN",
            "name": "Vinchos",
            "zipCodes": [
              "05815",
              "05816"
            ]
          }
        ]
      },
      {
        "code": "HUA",
        "name": "Huanta",
        "districts": [
          {
            "code": "HUA-AYA",
            "name": "Ayahuanco",
            "zipCodes": [
              "05150",
              "05151"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huamanguilla",
            "zipCodes": [
              "05170",
              "05171"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huanta",
            "zipCodes": [
              "05120",
              "05121"
            ]
          },
          {
            "code": "HUA-IGU",
            "name": "Iguain",
            "zipCodes": [
              "05110"
            ]
          },
          {
            "code": "LA -LLO",
            "name": "Llochegua",
            "zipCodes": [
              "05230",
              "05231"
            ]
          },
          {
            "code": "HUA-LUR",
            "name": "Luricocha",
            "zipCodes": [
              "05130",
              "05131"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "Santillana",
            "zipCodes": [
              "05140",
              "05141"
            ]
          },
          {
            "code": "LA -SIL",
            "name": "Silvia",
            "zipCodes": [
              "05220",
              "05221"
            ]
          }
        ],
        "cities": [
          {
            "code": "HUA-HUA",
            "name": "Huamanguilla",
            "zipCodes": [
              "05170",
              "05171"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huanta",
            "zipCodes": [
              "05120",
              "05121"
            ]
          },
          {
            "code": "LA -LLO",
            "name": "Llochegua",
            "zipCodes": [
              "05230",
              "05231"
            ]
          },
          {
            "code": "HUA-LUR",
            "name": "Luricocha",
            "zipCodes": [
              "05130",
              "05131"
            ]
          },
          {
            "code": "HUA-MAC",
            "name": "Macachacra",
            "zipCodes": [
              "05110"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "San Jose de Secce",
            "zipCodes": [
              "05140",
              "05141"
            ]
          },
          {
            "code": "LA -SIV",
            "name": "Sivia",
            "zipCodes": [
              "05220",
              "05221"
            ]
          },
          {
            "code": "HUA-VIR",
            "name": "Viracochan",
            "zipCodes": [
              "05150",
              "05151"
            ]
          }
        ]
      },
      {
        "code": "HUN",
        "name": "Hunca Sancos",
        "districts": [
          {
            "code": "HUN-CAR",
            "name": "Carapo",
            "zipCodes": [
              "05700"
            ]
          },
          {
            "code": "HUN-SAC",
            "name": "Sacsamarca",
            "zipCodes": [
              "05730"
            ]
          },
          {
            "code": "HUN-SAN",
            "name": "Sancos",
            "zipCodes": [
              "05710"
            ]
          },
          {
            "code": "HUN-SAN",
            "name": "Santiago de Lucanamarca",
            "zipCodes": [
              "05720"
            ]
          }
        ],
        "cities": [
          {
            "code": "HUN-CAR",
            "name": "Carapo",
            "zipCodes": [
              "05700"
            ]
          },
          {
            "code": "HUN-HUA",
            "name": "Huanca Sancos",
            "zipCodes": [
              "05710"
            ]
          },
          {
            "code": "HUN-SAC",
            "name": "Sacsamarca",
            "zipCodes": [
              "05730"
            ]
          },
          {
            "code": "HUN-SAN",
            "name": "Santiago de Lucanamarca",
            "zipCodes": [
              "05720"
            ]
          }
        ]
      },
      {
        "code": "LA ",
        "name": "La Mar",
        "districts": [
          {
            "code": "LA -ANC",
            "name": "Anco",
            "zipCodes": [
              "05260",
              "05261"
            ]
          },
          {
            "code": "LA -AYN",
            "name": "Ayna",
            "zipCodes": [
              "05210",
              "05211"
            ]
          },
          {
            "code": "LA -CHI",
            "name": "Chilcas",
            "zipCodes": [
              "05280"
            ]
          },
          {
            "code": "LA -CHU",
            "name": "Chungui",
            "zipCodes": [
              "05270",
              "05271"
            ]
          },
          {
            "code": "LA -LUI",
            "name": "Luis Carranza",
            "zipCodes": [
              "05290"
            ]
          },
          {
            "code": "LA -SAN",
            "name": "San Miguel",
            "zipCodes": [
              "05250",
              "05251"
            ]
          },
          {
            "code": "LA -SAN",
            "name": "Santa Rosa",
            "zipCodes": [
              "05240",
              "05241"
            ]
          },
          {
            "code": "LA -TAM",
            "name": "Tambo",
            "zipCodes": [
              "05200",
              "05201"
            ]
          }
        ],
        "cities": [
          {
            "code": "LA -CHI",
            "name": "Chilcas",
            "zipCodes": [
              "05280"
            ]
          },
          {
            "code": "LA -CHI",
            "name": "Chiquintirca",
            "zipCodes": [
              "05260",
              "05261"
            ]
          },
          {
            "code": "LA -CHU",
            "name": "Chungui",
            "zipCodes": [
              "05270",
              "05271"
            ]
          },
          {
            "code": "LA -PAM",
            "name": "Pampas",
            "zipCodes": [
              "05290"
            ]
          },
          {
            "code": "LA -SAN",
            "name": "San Francisco",
            "zipCodes": [
              "05210",
              "05211"
            ]
          },
          {
            "code": "LA -SAN",
            "name": "San Miguel",
            "zipCodes": [
              "05250",
              "05251"
            ]
          },
          {
            "code": "LA -SAN",
            "name": "Santa Rosa",
            "zipCodes": [
              "05240",
              "05241"
            ]
          },
          {
            "code": "LA -TAM",
            "name": "Tambo",
            "zipCodes": [
              "05200",
              "05201"
            ]
          }
        ]
      },
      {
        "code": "LUC",
        "name": "Lucanas",
        "districts": [
          {
            "code": "LUC-AUC",
            "name": "Aucará",
            "zipCodes": [
              "05470"
            ]
          },
          {
            "code": "LUC-CAB",
            "name": "Cabana",
            "zipCodes": [
              "05475"
            ]
          },
          {
            "code": "LUC-CAR",
            "name": "Carmen Salcedo",
            "zipCodes": [
              "05480"
            ]
          },
          {
            "code": "LUC-CHA",
            "name": "Chaviña",
            "zipCodes": [
              "05600"
            ]
          },
          {
            "code": "LUC-CHI",
            "name": "Chipao",
            "zipCodes": [
              "05485"
            ]
          },
          {
            "code": "HUN-HUA",
            "name": "Huac Huas",
            "zipCodes": [
              "05760"
            ]
          },
          {
            "code": "HUN-LAR",
            "name": "Laramate",
            "zipCodes": [
              "05740"
            ]
          },
          {
            "code": "LUC-LEO",
            "name": "Leoncio Prado",
            "zipCodes": [
              "05540"
            ]
          },
          {
            "code": "HUN-LLA",
            "name": "Llauta",
            "zipCodes": [
              "05750"
            ]
          },
          {
            "code": "LUC-LUC",
            "name": "Lucanas",
            "zipCodes": [
              "05530"
            ]
          },
          {
            "code": "HUN-OCO",
            "name": "Ocoña",
            "zipCodes": [
              "05770"
            ]
          },
          {
            "code": "HUN-OTA",
            "name": "Otaca",
            "zipCodes": [
              "05790"
            ]
          },
          {
            "code": "LUC-PUQ",
            "name": "Puquio",
            "zipCodes": [
              "05500",
              "05501"
            ]
          },
          {
            "code": "LUC-SAI",
            "name": "Saisa",
            "zipCodes": [
              "05560"
            ]
          },
          {
            "code": "LUC-SAN",
            "name": "San Cristobal",
            "zipCodes": [
              "05550"
            ]
          },
          {
            "code": "LUC-SAN",
            "name": "San Juan",
            "zipCodes": [
              "05520"
            ]
          },
          {
            "code": "LUC-SAN",
            "name": "San Pedro",
            "zipCodes": [
              "05510"
            ]
          },
          {
            "code": "HUN-SAN",
            "name": "San Pedro de Palco",
            "zipCodes": [
              "05780"
            ]
          },
          {
            "code": "LUC-SAN",
            "name": "Sancos",
            "zipCodes": [
              "05605",
              "05606"
            ]
          },
          {
            "code": "LUC-SAN",
            "name": "Santa Ana de Huaycahuacho",
            "zipCodes": [
              "05465"
            ]
          },
          {
            "code": "LUC-SAN",
            "name": "Santa Lucía",
            "zipCodes": [
              "05570"
            ]
          }
        ],
        "cities": [
          {
            "code": "LUC-AND",
            "name": "Andamarca",
            "zipCodes": [
              "05480"
            ]
          },
          {
            "code": "LUC-AUC",
            "name": "Aucara",
            "zipCodes": [
              "05470"
            ]
          },
          {
            "code": "LUC-CAB",
            "name": "Cabana",
            "zipCodes": [
              "05475"
            ]
          },
          {
            "code": "LUC-CHA",
            "name": "Chaviña",
            "zipCodes": [
              "05600"
            ]
          },
          {
            "code": "LUC-CHI",
            "name": "Chipao",
            "zipCodes": [
              "05485"
            ]
          },
          {
            "code": "HUN-HUA",
            "name": "Huac- Huas",
            "zipCodes": [
              "05760"
            ]
          },
          {
            "code": "HUN-LAR",
            "name": "Laramate",
            "zipCodes": [
              "05740"
            ]
          },
          {
            "code": "HUN-LLA",
            "name": "Llauta",
            "zipCodes": [
              "05750"
            ]
          },
          {
            "code": "LUC-LUC",
            "name": "Lucanas",
            "zipCodes": [
              "05530"
            ]
          },
          {
            "code": "HUN-OCA",
            "name": "Ocaña",
            "zipCodes": [
              "05770"
            ]
          },
          {
            "code": "HUN-OTO",
            "name": "Otoca",
            "zipCodes": [
              "05790"
            ]
          },
          {
            "code": "LUC-PUQ",
            "name": "Puquio",
            "zipCodes": [
              "05500",
              "05501"
            ]
          },
          {
            "code": "LUC-SAI",
            "name": "Saisa",
            "zipCodes": [
              "05560"
            ]
          },
          {
            "code": "LUC-SAN",
            "name": "San Cristobal",
            "zipCodes": [
              "05550"
            ]
          },
          {
            "code": "LUC-SAN",
            "name": "San Juan",
            "zipCodes": [
              "05520"
            ]
          },
          {
            "code": "LUC-SAN",
            "name": "San Pedro",
            "zipCodes": [
              "05510"
            ]
          },
          {
            "code": "HUN-SAN",
            "name": "San Pedro de Palco",
            "zipCodes": [
              "05780"
            ]
          },
          {
            "code": "LUC-SAN",
            "name": "Sancos",
            "zipCodes": [
              "05605",
              "05606"
            ]
          },
          {
            "code": "LUC-SAN",
            "name": "Santa Ana de Huaycahuacho",
            "zipCodes": [
              "05465"
            ]
          },
          {
            "code": "LUC-SAN",
            "name": "Santa Lucia",
            "zipCodes": [
              "05570"
            ]
          },
          {
            "code": "LUC-TAM",
            "name": "Tambo Quemado",
            "zipCodes": [
              "05540"
            ]
          }
        ]
      },
      {
        "code": "PAR",
        "name": "Parinacochas",
        "districts": [
          {
            "code": "PAR-CHU",
            "name": "Chumpi",
            "zipCodes": [
              "05615"
            ]
          },
          {
            "code": "PAR-COR",
            "name": "Coracora",
            "zipCodes": [
              "05610",
              "05611"
            ]
          },
          {
            "code": "PAU-COR",
            "name": "Coronel Castañeda",
            "zipCodes": [
              "05695"
            ]
          },
          {
            "code": "PAU-PAC",
            "name": "Pacapausa",
            "zipCodes": [
              "05685"
            ]
          },
          {
            "code": "PAR-PUL",
            "name": "Pullo",
            "zipCodes": [
              "05620"
            ]
          },
          {
            "code": "PAR-PUY",
            "name": "Puyusca",
            "zipCodes": [
              "05625"
            ]
          },
          {
            "code": "PAU-SAN",
            "name": "San Francisco de Ravacayco",
            "zipCodes": [
              "05680"
            ]
          },
          {
            "code": "PAU-UPA",
            "name": "Upahuacho",
            "zipCodes": [
              "05690"
            ]
          }
        ],
        "cities": [
          {
            "code": "PAU-ANI",
            "name": "Aniso",
            "zipCodes": [
              "05695"
            ]
          },
          {
            "code": "PAR-CHU",
            "name": "Chumpi",
            "zipCodes": [
              "05615"
            ]
          },
          {
            "code": "PAR-COR",
            "name": "Coracora",
            "zipCodes": [
              "05610",
              "05611"
            ]
          },
          {
            "code": "PAR-INC",
            "name": "Incuyo",
            "zipCodes": [
              "05625"
            ]
          },
          {
            "code": "PAU-PAC",
            "name": "Pacapausa",
            "zipCodes": [
              "05685"
            ]
          },
          {
            "code": "PAR-PUL",
            "name": "Pullo",
            "zipCodes": [
              "05620"
            ]
          },
          {
            "code": "PAU-SAN",
            "name": "San Francisco de Ravacayco",
            "zipCodes": [
              "05680"
            ]
          },
          {
            "code": "PAU-UPA",
            "name": "Upahuacho",
            "zipCodes": [
              "05690"
            ]
          }
        ]
      },
      {
        "code": "PAU",
        "name": "Paucar del Sara Sara",
        "districts": [
          {
            "code": "PAU-COL",
            "name": "Colpa",
            "zipCodes": [
              "05655"
            ]
          },
          {
            "code": "PAU-COR",
            "name": "Corculla",
            "zipCodes": [
              "05670"
            ]
          },
          {
            "code": "PAU-LAM",
            "name": "Lampa",
            "zipCodes": [
              "05645"
            ]
          },
          {
            "code": "PAU-MAR",
            "name": "Marcabamba",
            "zipCodes": [
              "05650"
            ]
          },
          {
            "code": "PAU-OYO",
            "name": "Oyolo",
            "zipCodes": [
              "05660"
            ]
          },
          {
            "code": "PAU-PAR",
            "name": "Pararca",
            "zipCodes": [
              "05635"
            ]
          },
          {
            "code": "PAU-PAU",
            "name": "Pausa",
            "zipCodes": [
              "05640"
            ]
          },
          {
            "code": "PAU-SAN",
            "name": "San Javier de Alpabamba",
            "zipCodes": [
              "05675"
            ]
          },
          {
            "code": "PAU-SAN",
            "name": "San José de Ushua",
            "zipCodes": [
              "05665"
            ]
          },
          {
            "code": "PAU-SAR",
            "name": "Sara Sara",
            "zipCodes": [
              "05630"
            ]
          }
        ],
        "cities": [
          {
            "code": "PAU-COL",
            "name": "Colta",
            "zipCodes": [
              "05655"
            ]
          },
          {
            "code": "PAU-COR",
            "name": "Corculla",
            "zipCodes": [
              "05670"
            ]
          },
          {
            "code": "PAU-LAM",
            "name": "Lampa",
            "zipCodes": [
              "05645"
            ]
          },
          {
            "code": "PAU-MAR",
            "name": "Marcabamba",
            "zipCodes": [
              "05650"
            ]
          },
          {
            "code": "PAU-OYO",
            "name": "Oyolo",
            "zipCodes": [
              "05660"
            ]
          },
          {
            "code": "PAU-PAR",
            "name": "Pararca",
            "zipCodes": [
              "05635"
            ]
          },
          {
            "code": "PAU-PAU",
            "name": "Pausa",
            "zipCodes": [
              "05640"
            ]
          },
          {
            "code": "PAU-QUI",
            "name": "Quilcata",
            "zipCodes": [
              "05630"
            ]
          },
          {
            "code": "PAU-SAN",
            "name": "San Javier de Alpabamba",
            "zipCodes": [
              "05675"
            ]
          },
          {
            "code": "PAU-SAN",
            "name": "San Jose de Ushua",
            "zipCodes": [
              "05665"
            ]
          }
        ]
      },
      {
        "code": "SUC",
        "name": "Sucre",
        "districts": [
          {
            "code": "SUC-BEL",
            "name": "Belén",
            "zipCodes": [
              "05345"
            ]
          },
          {
            "code": "SUC-CHA",
            "name": "Chalcos",
            "zipCodes": [
              "05350"
            ]
          },
          {
            "code": "SUC-CHI",
            "name": "Chilcayoc",
            "zipCodes": [
              "05355"
            ]
          },
          {
            "code": "VÍC-HUA",
            "name": "Huacaña",
            "zipCodes": [
              "05460"
            ]
          },
          {
            "code": "VÍC-MOR",
            "name": "Morcolla",
            "zipCodes": [
              "05455"
            ]
          },
          {
            "code": "SUC-PAI",
            "name": "Paico",
            "zipCodes": [
              "05365"
            ]
          },
          {
            "code": "VÍC-QUE",
            "name": "Querobamba",
            "zipCodes": [
              "05450"
            ]
          },
          {
            "code": "SUC-SAN",
            "name": "San Pedro de Larcay",
            "zipCodes": [
              "05380"
            ]
          },
          {
            "code": "SUC-SAN",
            "name": "San Salvador de Quije",
            "zipCodes": [
              "05360"
            ]
          },
          {
            "code": "SUC-SAN",
            "name": "Santiago de Paucaray",
            "zipCodes": [
              "05370"
            ]
          },
          {
            "code": "SUC-SOR",
            "name": "Soras",
            "zipCodes": [
              "05375"
            ]
          }
        ],
        "cities": [
          {
            "code": "SUC-BEL",
            "name": "Belen",
            "zipCodes": [
              "05345"
            ]
          },
          {
            "code": "SUC-CHA",
            "name": "Chalcos",
            "zipCodes": [
              "05350"
            ]
          },
          {
            "code": "SUC-CHI",
            "name": "Chilcayoc",
            "zipCodes": [
              "05355"
            ]
          },
          {
            "code": "VÍC-HUA",
            "name": "Huacaña",
            "zipCodes": [
              "05460"
            ]
          },
          {
            "code": "VÍC-MOR",
            "name": "Morcolla",
            "zipCodes": [
              "05455"
            ]
          },
          {
            "code": "SUC-PAI",
            "name": "Paico",
            "zipCodes": [
              "05365"
            ]
          },
          {
            "code": "VÍC-QUE",
            "name": "Querobamba",
            "zipCodes": [
              "05450"
            ]
          },
          {
            "code": "SUC-SAN",
            "name": "San Pedro de Larcay",
            "zipCodes": [
              "05380"
            ]
          },
          {
            "code": "SUC-SAN",
            "name": "San Salvador de Quije",
            "zipCodes": [
              "05360"
            ]
          },
          {
            "code": "SUC-SAN",
            "name": "Santiago de Paucaray",
            "zipCodes": [
              "05370"
            ]
          },
          {
            "code": "SUC-SOR",
            "name": "Soras",
            "zipCodes": [
              "05375"
            ]
          }
        ]
      },
      {
        "code": "VIL",
        "name": "Vilcas Huamán",
        "districts": [
          {
            "code": "SUC-ACC",
            "name": "Accomarca",
            "zipCodes": [
              "05390"
            ]
          },
          {
            "code": "VIL-CAR",
            "name": "Carhuanca",
            "zipCodes": [
              "05340"
            ]
          },
          {
            "code": "VIL-CON",
            "name": "Concepción",
            "zipCodes": [
              "05330"
            ]
          },
          {
            "code": "SUC-HUA",
            "name": "Huambalpa",
            "zipCodes": [
              "05385"
            ]
          },
          {
            "code": "SUC-IND",
            "name": "Independencia",
            "zipCodes": [
              "05395"
            ]
          },
          {
            "code": "VIL-SAU",
            "name": "Saurama",
            "zipCodes": [
              "05335"
            ]
          },
          {
            "code": "VIL-VIL",
            "name": "Vilcas Huamán",
            "zipCodes": [
              "05325",
              "05326"
            ]
          },
          {
            "code": "VIL-VIS",
            "name": "Vischongo",
            "zipCodes": [
              "05320"
            ]
          }
        ],
        "cities": [
          {
            "code": "SUC-ACC",
            "name": "Accomarca",
            "zipCodes": [
              "05390"
            ]
          },
          {
            "code": "VIL-CAR",
            "name": "Carhuanca",
            "zipCodes": [
              "05340"
            ]
          },
          {
            "code": "VIL-CON",
            "name": "Concepcion",
            "zipCodes": [
              "05330"
            ]
          },
          {
            "code": "SUC-HUA",
            "name": "Huambalpa",
            "zipCodes": [
              "05385"
            ]
          },
          {
            "code": "SUC-NUE",
            "name": "Nuevo Paccha Huallhua",
            "zipCodes": [
              "05395"
            ]
          },
          {
            "code": "VIL-SAU",
            "name": "Saurama",
            "zipCodes": [
              "05335"
            ]
          },
          {
            "code": "VIL-VIL",
            "name": "Vilcas Huaman",
            "zipCodes": [
              "05325",
              "05326"
            ]
          },
          {
            "code": "VIL-VIS",
            "name": "Vischongo",
            "zipCodes": [
              "05320"
            ]
          }
        ]
      },
      {
        "code": "VÍC",
        "name": "Víctor Fajardo",
        "districts": [
          {
            "code": "VÍC-ALC",
            "name": "Alcamenca",
            "zipCodes": [
              "05405"
            ]
          },
          {
            "code": "VÍC-APO",
            "name": "Apongo",
            "zipCodes": [
              "05440"
            ]
          },
          {
            "code": "VÍC-ASQ",
            "name": "Asquipata",
            "zipCodes": [
              "05445"
            ]
          },
          {
            "code": "VÍC-CAN",
            "name": "Canaria",
            "zipCodes": [
              "05435"
            ]
          },
          {
            "code": "VÍC-CAY",
            "name": "Cayara",
            "zipCodes": [
              "05420"
            ]
          },
          {
            "code": "VÍC-COL",
            "name": "Colca",
            "zipCodes": [
              "05425"
            ]
          },
          {
            "code": "HUN-HUA",
            "name": "Huamanquiquia",
            "zipCodes": [
              "05855"
            ]
          },
          {
            "code": "VÍC-HUA",
            "name": "Huancapi",
            "zipCodes": [
              "05415"
            ]
          },
          {
            "code": "VÍC-HUA",
            "name": "Huancaraylla",
            "zipCodes": [
              "05410"
            ]
          },
          {
            "code": "VÍC-HUA",
            "name": "Huaya",
            "zipCodes": [
              "05430"
            ]
          },
          {
            "code": "HUN-SAR",
            "name": "Sarhua",
            "zipCodes": [
              "05850"
            ]
          },
          {
            "code": "HUN-VIL",
            "name": "Vilcanchos",
            "zipCodes": [
              "05825"
            ]
          }
        ],
        "cities": [
          {
            "code": "VÍC-ALC",
            "name": "Alcamenca",
            "zipCodes": [
              "05405"
            ]
          },
          {
            "code": "VÍC-APO",
            "name": "Apongo",
            "zipCodes": [
              "05440"
            ]
          },
          {
            "code": "VÍC-ASQ",
            "name": "Asquipata",
            "zipCodes": [
              "05445"
            ]
          },
          {
            "code": "VÍC-CAN",
            "name": "Canaria",
            "zipCodes": [
              "05435"
            ]
          },
          {
            "code": "VÍC-CAY",
            "name": "Cayara",
            "zipCodes": [
              "05420"
            ]
          },
          {
            "code": "VÍC-COL",
            "name": "Colca",
            "zipCodes": [
              "05425"
            ]
          },
          {
            "code": "HUN-HUA",
            "name": "Huamanquiquia",
            "zipCodes": [
              "05855"
            ]
          },
          {
            "code": "VÍC-HUA",
            "name": "Huancapi",
            "zipCodes": [
              "05415"
            ]
          },
          {
            "code": "VÍC-HUA",
            "name": "Huancaraylla",
            "zipCodes": [
              "05410"
            ]
          },
          {
            "code": "VÍC-SAN",
            "name": "San Pedro de Huaya",
            "zipCodes": [
              "05430"
            ]
          },
          {
            "code": "HUN-SAR",
            "name": "Sarhua",
            "zipCodes": [
              "05850"
            ]
          },
          {
            "code": "HUN-VIL",
            "name": "Vilcanchos",
            "zipCodes": [
              "05825"
            ]
          }
        ]
      }
    ]
  },
  {
    "code": "CAJ",
    "name": "Cajamarca",
    "provinces": [
      {
        "code": "CAJ",
        "name": "Cajabamba",
        "districts": [
          {
            "code": "CAJ-CAC",
            "name": "Cachachi",
            "zipCodes": [
              "06340",
              "06341"
            ]
          },
          {
            "code": "CAJ-CAJ",
            "name": "Cajabamba",
            "zipCodes": [
              "06350",
              "06351"
            ]
          },
          {
            "code": "CAJ-CON",
            "name": "Condebamba",
            "zipCodes": [
              "06345",
              "06346"
            ]
          },
          {
            "code": "CAJ-SIT",
            "name": "Sitacocha",
            "zipCodes": [
              "06355",
              "06356"
            ]
          }
        ],
        "cities": [
          {
            "code": "CAJ-CAC",
            "name": "Cachachi",
            "zipCodes": [
              "06340",
              "06341"
            ]
          },
          {
            "code": "CAJ-CAJ",
            "name": "Cajabamba",
            "zipCodes": [
              "06350",
              "06351"
            ]
          },
          {
            "code": "CAJ-CAU",
            "name": "Cauday",
            "zipCodes": [
              "06345",
              "06346"
            ]
          },
          {
            "code": "CAJ-LLU",
            "name": "Lluchubamba",
            "zipCodes": [
              "06355",
              "06356"
            ]
          }
        ]
      },
      {
        "code": "CAJ",
        "name": "Cajamarca",
        "districts": [
          {
            "code": "CAJ-ASU",
            "name": "Asunción",
            "zipCodes": [
              "06403",
              "06405"
            ]
          },
          {
            "code": "CAJ-CAJ",
            "name": "Cajamarca",
            "zipCodes": [
              "06000",
              "06001",
              "06002",
              "06003"
            ]
          },
          {
            "code": "CAJ-CHE",
            "name": "Chetilla",
            "zipCodes": [
              "06415"
            ]
          },
          {
            "code": "CAJ-COS",
            "name": "Cospan",
            "zipCodes": [
              "06407",
              "06410"
            ]
          },
          {
            "code": "CUT-ENC",
            "name": "Encañada",
            "zipCodes": [
              "06200",
              "06201"
            ]
          },
          {
            "code": "CAJ-JES",
            "name": "Jesús",
            "zipCodes": [
              "06370",
              "06371"
            ]
          },
          {
            "code": "CEL-LLA",
            "name": "Llacanora",
            "zipCodes": [
              "06300"
            ]
          },
          {
            "code": "CAJ-LOS",
            "name": "Los Baños del Inca",
            "zipCodes": [
              "06000",
              "06001",
              "06004"
            ]
          },
          {
            "code": "CAJ-MAG",
            "name": "Magdalena",
            "zipCodes": [
              "06411",
              "06412"
            ]
          },
          {
            "code": "CEL-MAT",
            "name": "Matara",
            "zipCodes": [
              "06310"
            ]
          },
          {
            "code": "CEL-NAM",
            "name": "Namora",
            "zipCodes": [
              "06305",
              "06306"
            ]
          },
          {
            "code": "CAJ-SAN",
            "name": "San Juan",
            "zipCodes": [
              "06400"
            ]
          }
        ],
        "cities": [
          {
            "code": "CAJ-ASU",
            "name": "Asuncion",
            "zipCodes": [
              "06403",
              "06405"
            ]
          },
          {
            "code": "CAJ-CAJ",
            "name": "Cajamarca",
            "zipCodes": [
              "06000",
              "06001",
              "06002",
              "06003"
            ]
          },
          {
            "code": "CAJ-CHE",
            "name": "Chetilla",
            "zipCodes": [
              "06415"
            ]
          },
          {
            "code": "CAJ-COS",
            "name": "Cospan",
            "zipCodes": [
              "06407",
              "06410"
            ]
          },
          {
            "code": "CUT-ENC",
            "name": "Encañada",
            "zipCodes": [
              "06200",
              "06201"
            ]
          },
          {
            "code": "CAJ-JES",
            "name": "Jesus",
            "zipCodes": [
              "06370",
              "06371"
            ]
          },
          {
            "code": "CEL-LLA",
            "name": "Llacanora",
            "zipCodes": [
              "06300"
            ]
          },
          {
            "code": "CAJ-LOS",
            "name": "Los Baños del Inca",
            "zipCodes": [
              "06000",
              "06001",
              "06004"
            ]
          },
          {
            "code": "CAJ-MAG",
            "name": "Magdalena",
            "zipCodes": [
              "06411",
              "06412"
            ]
          },
          {
            "code": "CEL-MAT",
            "name": "Matara",
            "zipCodes": [
              "06310"
            ]
          },
          {
            "code": "CEL-NAM",
            "name": "Namora",
            "zipCodes": [
              "06305",
              "06306"
            ]
          },
          {
            "code": "CAJ-SAN",
            "name": "San Juan",
            "zipCodes": [
              "06400"
            ]
          }
        ]
      },
      {
        "code": "CEL",
        "name": "Celendín",
        "districts": [
          {
            "code": "CEL-CEL",
            "name": "Celendin",
            "zipCodes": [
              "06225",
              "06226"
            ]
          },
          {
            "code": "CEL-CHU",
            "name": "Chumuch",
            "zipCodes": [
              "06255"
            ]
          },
          {
            "code": "CEL-COR",
            "name": "Cortegana",
            "zipCodes": [
              "06260",
              "06261"
            ]
          },
          {
            "code": "CEL-HUA",
            "name": "Huasmin",
            "zipCodes": [
              "06240",
              "06241"
            ]
          },
          {
            "code": "CEL-JOR",
            "name": "Jorge Chávez",
            "zipCodes": [
              "06220"
            ]
          },
          {
            "code": "CEL-JOS",
            "name": "José Galvez",
            "zipCodes": [
              "06215"
            ]
          },
          {
            "code": "CEL-LA ",
            "name": "La Libertad de Pallán",
            "zipCodes": [
              "06245",
              "06246"
            ]
          },
          {
            "code": "CEL-MIG",
            "name": "Miguel Iglesias",
            "zipCodes": [
              "06250"
            ]
          },
          {
            "code": "CEL-OXA",
            "name": "Oxamarca",
            "zipCodes": [
              "06210",
              "06211"
            ]
          },
          {
            "code": "CEL-SOR",
            "name": "Sorochuco",
            "zipCodes": [
              "06235",
              "06236"
            ]
          },
          {
            "code": "CEL-SUC",
            "name": "Sucre",
            "zipCodes": [
              "06205",
              "06206"
            ]
          },
          {
            "code": "CEL-UTC",
            "name": "Utco",
            "zipCodes": [
              "06230"
            ]
          }
        ],
        "cities": [
          {
            "code": "CEL-CEL",
            "name": "Celendin",
            "zipCodes": [
              "06225",
              "06226"
            ]
          },
          {
            "code": "CEL-CHA",
            "name": "Chalan",
            "zipCodes": [
              "06250"
            ]
          },
          {
            "code": "CEL-CHI",
            "name": "Chimuch (Cortegana)",
            "zipCodes": [
              "06260",
              "06261"
            ]
          },
          {
            "code": "CEL-CHU",
            "name": "Chumuch",
            "zipCodes": [
              "06255"
            ]
          },
          {
            "code": "CEL-HUA",
            "name": "Huacapampa",
            "zipCodes": [
              "06215"
            ]
          },
          {
            "code": "CEL-HUA",
            "name": "Huasmin",
            "zipCodes": [
              "06240",
              "06241"
            ]
          },
          {
            "code": "CEL-LA ",
            "name": "La Libertad de Pallan",
            "zipCodes": [
              "06245",
              "06246"
            ]
          },
          {
            "code": "CEL-LUC",
            "name": "Lucmapampa",
            "zipCodes": [
              "06220"
            ]
          },
          {
            "code": "CEL-OXA",
            "name": "Oxamarca",
            "zipCodes": [
              "06210",
              "06211"
            ]
          },
          {
            "code": "CEL-SOR",
            "name": "Sorochuco",
            "zipCodes": [
              "06235",
              "06236"
            ]
          },
          {
            "code": "CEL-SUC",
            "name": "Sucre",
            "zipCodes": [
              "06205",
              "06206"
            ]
          },
          {
            "code": "CEL-UTC",
            "name": "Utco",
            "zipCodes": [
              "06230"
            ]
          }
        ]
      },
      {
        "code": "CHO",
        "name": "Chota",
        "districts": [
          {
            "code": "CHO-ANG",
            "name": "Anguía",
            "zipCodes": [
              "06140"
            ]
          },
          {
            "code": "CHO-CHA",
            "name": "Chadín",
            "zipCodes": [
              "06155"
            ]
          },
          {
            "code": "CHO-CHA",
            "name": "Chalamarca",
            "zipCodes": [
              "06145",
              "06146"
            ]
          },
          {
            "code": "CHO-CHI",
            "name": "Chiguirip",
            "zipCodes": [
              "06130"
            ]
          },
          {
            "code": "CHO-CHI",
            "name": "Chimban",
            "zipCodes": [
              "06165"
            ]
          },
          {
            "code": "CHO-CHO",
            "name": "Choropampa",
            "zipCodes": [
              "06160"
            ]
          },
          {
            "code": "CHO-CHO",
            "name": "Chota",
            "zipCodes": [
              "06120",
              "06121"
            ]
          },
          {
            "code": "SAN-COC",
            "name": "Cochabamba",
            "zipCodes": [
              "06650",
              "06651"
            ]
          },
          {
            "code": "CHO-CON",
            "name": "Conchán",
            "zipCodes": [
              "06125",
              "06126"
            ]
          },
          {
            "code": "SAN-HUA",
            "name": "Huambos",
            "zipCodes": [
              "06653",
              "06655"
            ]
          },
          {
            "code": "SAN-LAJ",
            "name": "Lajas",
            "zipCodes": [
              "06600",
              "06601"
            ]
          },
          {
            "code": "SAN-LLA",
            "name": "Llama",
            "zipCodes": [
              "06665",
              "06666"
            ]
          },
          {
            "code": "SAN-MIR",
            "name": "Miracosta",
            "zipCodes": [
              "06675"
            ]
          },
          {
            "code": "CHO-PAC",
            "name": "Paccha",
            "zipCodes": [
              "06150",
              "06151"
            ]
          },
          {
            "code": "CHO-PIO",
            "name": "Pion",
            "zipCodes": [
              "06170"
            ]
          },
          {
            "code": "SAN-QUE",
            "name": "Querocoto",
            "zipCodes": [
              "06683",
              "06685"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "San Juan de Licupis",
            "zipCodes": [
              "06670"
            ]
          },
          {
            "code": "CHO-TAC",
            "name": "Tacabamba",
            "zipCodes": [
              "06135",
              "06136"
            ]
          },
          {
            "code": "SAN-TOC",
            "name": "Tocmoche",
            "zipCodes": [
              "06680"
            ]
          }
        ],
        "cities": [
          {
            "code": "CHO-ANG",
            "name": "Anguia",
            "zipCodes": [
              "06140"
            ]
          },
          {
            "code": "CHO-CHA",
            "name": "Chadin",
            "zipCodes": [
              "06155"
            ]
          },
          {
            "code": "CHO-CHA",
            "name": "Chalamarca",
            "zipCodes": [
              "06145",
              "06146"
            ]
          },
          {
            "code": "CHO-CHI",
            "name": "Chiguirip",
            "zipCodes": [
              "06130"
            ]
          },
          {
            "code": "CHO-CHI",
            "name": "Chimban",
            "zipCodes": [
              "06165"
            ]
          },
          {
            "code": "CHO-CHO",
            "name": "Choropampa",
            "zipCodes": [
              "06160"
            ]
          },
          {
            "code": "CHO-CHO",
            "name": "Chota",
            "zipCodes": [
              "06120",
              "06121"
            ]
          },
          {
            "code": "SAN-COC",
            "name": "Cochabamba",
            "zipCodes": [
              "06650",
              "06651"
            ]
          },
          {
            "code": "CHO-CON",
            "name": "Conchan",
            "zipCodes": [
              "06125",
              "06126"
            ]
          },
          {
            "code": "SAN-HUA",
            "name": "Huambos",
            "zipCodes": [
              "06653",
              "06655"
            ]
          },
          {
            "code": "SAN-LAJ",
            "name": "Lajas",
            "zipCodes": [
              "06600",
              "06601"
            ]
          },
          {
            "code": "SAN-LIC",
            "name": "Licupis",
            "zipCodes": [
              "06670"
            ]
          },
          {
            "code": "SAN-LLA",
            "name": "Llama",
            "zipCodes": [
              "06665",
              "06666"
            ]
          },
          {
            "code": "SAN-MIR",
            "name": "Miracosta",
            "zipCodes": [
              "06675"
            ]
          },
          {
            "code": "CHO-PAC",
            "name": "Paccha",
            "zipCodes": [
              "06150",
              "06151"
            ]
          },
          {
            "code": "CHO-PIO",
            "name": "Pion",
            "zipCodes": [
              "06170"
            ]
          },
          {
            "code": "SAN-QUE",
            "name": "Querocoto",
            "zipCodes": [
              "06683",
              "06685"
            ]
          },
          {
            "code": "CHO-TAC",
            "name": "Tacabamba",
            "zipCodes": [
              "06135",
              "06136"
            ]
          },
          {
            "code": "SAN-TOC",
            "name": "Tocmoche",
            "zipCodes": [
              "06680"
            ]
          }
        ]
      },
      {
        "code": "CON",
        "name": "Contumaza",
        "districts": [
          {
            "code": "CON-CHI",
            "name": "Chilete",
            "zipCodes": [
              "06420"
            ]
          },
          {
            "code": "CON-CON",
            "name": "Contumazá",
            "zipCodes": [
              "06421",
              "06422"
            ]
          },
          {
            "code": "CON-CUP",
            "name": "Cupisnique",
            "zipCodes": [
              "06441"
            ]
          },
          {
            "code": "CON-GUZ",
            "name": "Guzmango",
            "zipCodes": [
              "06431"
            ]
          },
          {
            "code": "CON-SAN",
            "name": "San Benito",
            "zipCodes": [
              "06435"
            ]
          },
          {
            "code": "CON-SAN",
            "name": "Santa Cruz de Toled",
            "zipCodes": [
              "06425"
            ]
          },
          {
            "code": "CON-TAN",
            "name": "Tantarica",
            "zipCodes": [
              "06430"
            ]
          },
          {
            "code": "CON-YON",
            "name": "Yonan",
            "zipCodes": [
              "06437",
              "06440"
            ]
          }
        ],
        "cities": [
          {
            "code": "CON-CAT",
            "name": "Catan",
            "zipCodes": [
              "06430"
            ]
          },
          {
            "code": "CON-CHI",
            "name": "Chilete",
            "zipCodes": [
              "06420"
            ]
          },
          {
            "code": "CON-CON",
            "name": "Contumaza",
            "zipCodes": [
              "06421",
              "06422"
            ]
          },
          {
            "code": "CON-GUZ",
            "name": "Guzmango",
            "zipCodes": [
              "06431"
            ]
          },
          {
            "code": "CON-SAN",
            "name": "San Benito",
            "zipCodes": [
              "06435"
            ]
          },
          {
            "code": "CON-SAN",
            "name": "Santa Cruz de Toled",
            "zipCodes": [
              "06425"
            ]
          },
          {
            "code": "CON-TEM",
            "name": "Tembladera",
            "zipCodes": [
              "06437",
              "06440"
            ]
          },
          {
            "code": "CON-TRI",
            "name": "Trinidad",
            "zipCodes": [
              "06441"
            ]
          }
        ]
      },
      {
        "code": "CUT",
        "name": "Cutervo",
        "districts": [
          {
            "code": "SAN-CAL",
            "name": "Callayuc",
            "zipCodes": [
              "06710",
              "06711"
            ]
          },
          {
            "code": "JAE-CHO",
            "name": "Choros",
            "zipCodes": [
              "06785"
            ]
          },
          {
            "code": "JAE-CUJ",
            "name": "Cujillo",
            "zipCodes": [
              "06775"
            ]
          },
          {
            "code": "SAN-CUT",
            "name": "Cutervo",
            "zipCodes": [
              "06700",
              "06701"
            ]
          },
          {
            "code": "CUT-LA ",
            "name": "La Ramada",
            "zipCodes": [
              "06175"
            ]
          },
          {
            "code": "JAE-PIM",
            "name": "Pimpingos",
            "zipCodes": [
              "06765",
              "06766"
            ]
          },
          {
            "code": "SAN-QUE",
            "name": "Querocotillo",
            "zipCodes": [
              "06690",
              "06691"
            ]
          },
          {
            "code": "JAE-SAN",
            "name": "San Andres de Cutervo",
            "zipCodes": [
              "06755",
              "06756"
            ]
          },
          {
            "code": "JAE-SAN",
            "name": "San Juan de Cutervo",
            "zipCodes": [
              "06770"
            ]
          },
          {
            "code": "CUT-SAN",
            "name": "San Luis de Lucma",
            "zipCodes": [
              "06180"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "Santa Cruz",
            "zipCodes": [
              "06715"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "Santo Domingo de la Capilla",
            "zipCodes": [
              "06705",
              "06706"
            ]
          },
          {
            "code": "JAE-SAN",
            "name": "Santo Tomas",
            "zipCodes": [
              "06760",
              "06761"
            ]
          },
          {
            "code": "JAE-SOC",
            "name": "Socota",
            "zipCodes": [
              "06750",
              "06751"
            ]
          },
          {
            "code": "JAE-TOR",
            "name": "Toribio Casanova",
            "zipCodes": [
              "06780"
            ]
          }
        ],
        "cities": [
          {
            "code": "SAN-CAL",
            "name": "Callayuc",
            "zipCodes": [
              "06710",
              "06711"
            ]
          },
          {
            "code": "JAE-CHO",
            "name": "Choros",
            "zipCodes": [
              "06785"
            ]
          },
          {
            "code": "JAE-CUJ",
            "name": "Cujillo",
            "zipCodes": [
              "06775"
            ]
          },
          {
            "code": "SAN-CUT",
            "name": "Cutervo",
            "zipCodes": [
              "06700",
              "06701"
            ]
          },
          {
            "code": "CUT-LA ",
            "name": "La Ramada",
            "zipCodes": [
              "06175"
            ]
          },
          {
            "code": "JAE-LA ",
            "name": "La Sacilia",
            "zipCodes": [
              "06780"
            ]
          },
          {
            "code": "JAE-PIM",
            "name": "Pimpingos",
            "zipCodes": [
              "06765",
              "06766"
            ]
          },
          {
            "code": "SAN-QUE",
            "name": "Querocotillo",
            "zipCodes": [
              "06690",
              "06691"
            ]
          },
          {
            "code": "JAE-SAN",
            "name": "San Andres de Cutervo",
            "zipCodes": [
              "06755",
              "06756"
            ]
          },
          {
            "code": "JAE-SAN",
            "name": "San Juan de Cutervo",
            "zipCodes": [
              "06770"
            ]
          },
          {
            "code": "CUT-SAN",
            "name": "San Luis de Lucma",
            "zipCodes": [
              "06180"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "Santa Cruz",
            "zipCodes": [
              "06715"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "Santo Domingo de la Capilla",
            "zipCodes": [
              "06705",
              "06706"
            ]
          },
          {
            "code": "JAE-SAN",
            "name": "Santo Tomas",
            "zipCodes": [
              "06760",
              "06761"
            ]
          },
          {
            "code": "JAE-SOC",
            "name": "Socota",
            "zipCodes": [
              "06750",
              "06751"
            ]
          }
        ]
      },
      {
        "code": "HUA",
        "name": "Hualgayoc",
        "districts": [
          {
            "code": "HUA-BAM",
            "name": "Bambamarca",
            "zipCodes": [
              "06115",
              "06116"
            ]
          },
          {
            "code": "SAN-CHU",
            "name": "Chugur",
            "zipCodes": [
              "06625"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Hualgayoc",
            "zipCodes": [
              "06100",
              "06101"
            ]
          }
        ],
        "cities": [
          {
            "code": "HUA-BAM",
            "name": "Bambamarca",
            "zipCodes": [
              "06115",
              "06116"
            ]
          },
          {
            "code": "SAN-CHU",
            "name": "Chugur",
            "zipCodes": [
              "06625"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Hualgayoc",
            "zipCodes": [
              "06100",
              "06101"
            ]
          }
        ]
      },
      {
        "code": "JAE",
        "name": "Jaen",
        "districts": [
          {
            "code": "JAE-BEL",
            "name": "Bellavista",
            "zipCodes": [
              "06815",
              "06816"
            ]
          },
          {
            "code": "JAE-CHO",
            "name": "Chontali",
            "zipCodes": [
              "06745",
              "06746"
            ]
          },
          {
            "code": "JAE-COL",
            "name": "Colasay",
            "zipCodes": [
              "06720",
              "06721"
            ]
          },
          {
            "code": "JAE-HUA",
            "name": "Huabal",
            "zipCodes": [
              "06810",
              "06811"
            ]
          },
          {
            "code": "JAE-JAE",
            "name": "Jaen",
            "zipCodes": [
              "06800",
              "06801"
            ]
          },
          {
            "code": "JAE-LAS",
            "name": "Las Pirias",
            "zipCodes": [
              "06805"
            ]
          },
          {
            "code": "JAE-POM",
            "name": "Pomahuaca",
            "zipCodes": [
              "06730",
              "06731"
            ]
          },
          {
            "code": "JAE-PUC",
            "name": "Pucará",
            "zipCodes": [
              "06725",
              "06726"
            ]
          },
          {
            "code": "JAE-SAL",
            "name": "Sallique",
            "zipCodes": [
              "06740",
              "06741"
            ]
          },
          {
            "code": "JAE-SAN",
            "name": "San Felipe",
            "zipCodes": [
              "06735",
              "06736"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "San José del Alto",
            "zipCodes": [
              "06830",
              "06831"
            ]
          },
          {
            "code": "JAE-SAN",
            "name": "Santa Rosa",
            "zipCodes": [
              "06820",
              "06821"
            ]
          }
        ],
        "cities": [
          {
            "code": "JAE-BEL",
            "name": "Bellavista",
            "zipCodes": [
              "06815",
              "06816"
            ]
          },
          {
            "code": "JAE-CHO",
            "name": "Chontali",
            "zipCodes": [
              "06745",
              "06746"
            ]
          },
          {
            "code": "JAE-COL",
            "name": "Colasay",
            "zipCodes": [
              "06720",
              "06721"
            ]
          },
          {
            "code": "JAE-HUA",
            "name": "Huabal",
            "zipCodes": [
              "06810",
              "06811"
            ]
          },
          {
            "code": "JAE-JAE",
            "name": "Jaen",
            "zipCodes": [
              "06800",
              "06801"
            ]
          },
          {
            "code": "JAE-LAS",
            "name": "Las Pirias",
            "zipCodes": [
              "06805"
            ]
          },
          {
            "code": "JAE-POM",
            "name": "Pomahuaca",
            "zipCodes": [
              "06730",
              "06731"
            ]
          },
          {
            "code": "JAE-PUC",
            "name": "Pucara",
            "zipCodes": [
              "06725",
              "06726"
            ]
          },
          {
            "code": "JAE-SAL",
            "name": "Sallique",
            "zipCodes": [
              "06740",
              "06741"
            ]
          },
          {
            "code": "JAE-SAN",
            "name": "San Felipe",
            "zipCodes": [
              "06735",
              "06736"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "San Jose del Alto",
            "zipCodes": [
              "06830",
              "06831"
            ]
          },
          {
            "code": "JAE-SAN",
            "name": "Santa Rosa",
            "zipCodes": [
              "06820",
              "06821"
            ]
          }
        ]
      },
      {
        "code": "SAN",
        "name": "San Ignacio",
        "districts": [
          {
            "code": "SAN-CHI",
            "name": "Chirinos",
            "zipCodes": [
              "06840",
              "06841"
            ]
          },
          {
            "code": "SAN-HUA",
            "name": "Huarango",
            "zipCodes": [
              "06860",
              "06861"
            ]
          },
          {
            "code": "SAN-LA ",
            "name": "La Coipa",
            "zipCodes": [
              "06825",
              "06826"
            ]
          },
          {
            "code": "SAN-NAM",
            "name": "Namballe",
            "zipCodes": [
              "06850",
              "06851"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "San Ignacio",
            "zipCodes": [
              "06845",
              "06846"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "San José de Lourdes",
            "zipCodes": [
              "06855",
              "06856"
            ]
          },
          {
            "code": "SAN-TAB",
            "name": "Tabaconas",
            "zipCodes": [
              "06835",
              "06836"
            ]
          }
        ],
        "cities": [
          {
            "code": "SAN-CHI",
            "name": "Chirinos",
            "zipCodes": [
              "06840",
              "06841"
            ]
          },
          {
            "code": "SAN-HUA",
            "name": "Huarango",
            "zipCodes": [
              "06860",
              "06861"
            ]
          },
          {
            "code": "SAN-LA ",
            "name": "La Coipa",
            "zipCodes": [
              "06825",
              "06826"
            ]
          },
          {
            "code": "SAN-NAM",
            "name": "Namballe",
            "zipCodes": [
              "06850",
              "06851"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "San Ignacio",
            "zipCodes": [
              "06845",
              "06846"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "San Jose de Lourdes",
            "zipCodes": [
              "06855",
              "06856"
            ]
          },
          {
            "code": "SAN-TAB",
            "name": "Tabaconas",
            "zipCodes": [
              "06835",
              "06836"
            ]
          }
        ]
      },
      {
        "code": "SAN",
        "name": "San Marcos",
        "districts": [
          {
            "code": "SAN-CHA",
            "name": "Chancay",
            "zipCodes": [
              "06330"
            ]
          },
          {
            "code": "SAN-EDU",
            "name": "Eduardo Villanueva",
            "zipCodes": [
              "06335"
            ]
          },
          {
            "code": "SAN-GRE",
            "name": "Gregorio Pita",
            "zipCodes": [
              "06315",
              "06316"
            ]
          },
          {
            "code": "SAN-ICH",
            "name": "Ichocán",
            "zipCodes": [
              "06325"
            ]
          },
          {
            "code": "CAJ-JOS",
            "name": "José Manuel Quiroz",
            "zipCodes": [
              "06360"
            ]
          },
          {
            "code": "CAJ-JOS",
            "name": "José Sabogal",
            "zipCodes": [
              "06365",
              "06366"
            ]
          },
          {
            "code": "SAN-PED",
            "name": "Pedro Galvez",
            "zipCodes": [
              "06320",
              "06321"
            ]
          }
        ],
        "cities": [
          {
            "code": "SAN-CHA",
            "name": "Chancay",
            "zipCodes": [
              "06330"
            ]
          },
          {
            "code": "SAN-ICH",
            "name": "Ichocan",
            "zipCodes": [
              "06325"
            ]
          },
          {
            "code": "SAN-LA ",
            "name": "La Grama",
            "zipCodes": [
              "06335"
            ]
          },
          {
            "code": "SAN-PAU",
            "name": "Paucamarca",
            "zipCodes": [
              "06315",
              "06316"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "San Marcos",
            "zipCodes": [
              "06320",
              "06321"
            ]
          },
          {
            "code": "CAJ-SHI",
            "name": "Shirac",
            "zipCodes": [
              "06360"
            ]
          },
          {
            "code": "CAJ-VEN",
            "name": "Venecia",
            "zipCodes": [
              "06365",
              "06366"
            ]
          }
        ]
      },
      {
        "code": "SAN",
        "name": "San Miguel",
        "districts": [
          {
            "code": "SAN-BOL",
            "name": "Bolivar",
            "zipCodes": [
              "06520"
            ]
          },
          {
            "code": "SAN-CAL",
            "name": "Calquis",
            "zipCodes": [
              "06460"
            ]
          },
          {
            "code": "SAN-CAT",
            "name": "Catilluc",
            "zipCodes": [
              "06495"
            ]
          },
          {
            "code": "SAN-EL ",
            "name": "El Prado",
            "zipCodes": [
              "06465"
            ]
          },
          {
            "code": "SAN-LA ",
            "name": "La Florida",
            "zipCodes": [
              "06500"
            ]
          },
          {
            "code": "SAN-LLA",
            "name": "Llapa",
            "zipCodes": [
              "06480",
              "06481"
            ]
          },
          {
            "code": "SAN-NAN",
            "name": "Nanchoc",
            "zipCodes": [
              "06530"
            ]
          },
          {
            "code": "SAN-NIE",
            "name": "Niepos",
            "zipCodes": [
              "06510"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "San Gregorio",
            "zipCodes": [
              "06475"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "San Miguel",
            "zipCodes": [
              "06455",
              "06456"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "San Silvestre de Cochan",
            "zipCodes": [
              "06485"
            ]
          },
          {
            "code": "SAN-TON",
            "name": "Tongod",
            "zipCodes": [
              "06630"
            ]
          },
          {
            "code": "SAN-UNI",
            "name": "Unión Agua Blanca",
            "zipCodes": [
              "06470"
            ]
          }
        ],
        "cities": [
          {
            "code": "SAN-AGU",
            "name": "Agua Blanca",
            "zipCodes": [
              "06470"
            ]
          },
          {
            "code": "SAN-BOL",
            "name": "Bolivar",
            "zipCodes": [
              "06520"
            ]
          },
          {
            "code": "SAN-CAL",
            "name": "Calquis",
            "zipCodes": [
              "06460"
            ]
          },
          {
            "code": "SAN-CAT",
            "name": "Catilluc",
            "zipCodes": [
              "06495"
            ]
          },
          {
            "code": "SAN-EL ",
            "name": "El Prado",
            "zipCodes": [
              "06465"
            ]
          },
          {
            "code": "SAN-LA ",
            "name": "La Florida",
            "zipCodes": [
              "06500"
            ]
          },
          {
            "code": "SAN-LLA",
            "name": "Llapa",
            "zipCodes": [
              "06480",
              "06481"
            ]
          },
          {
            "code": "SAN-NAN",
            "name": "Nanchoc",
            "zipCodes": [
              "06530"
            ]
          },
          {
            "code": "SAN-NIE",
            "name": "Niepos",
            "zipCodes": [
              "06510"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "San Gregorio",
            "zipCodes": [
              "06475"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "San Miguel de Pallaques",
            "zipCodes": [
              "06455",
              "06456"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "San Silvestre de Cochan",
            "zipCodes": [
              "06485"
            ]
          },
          {
            "code": "SAN-TON",
            "name": "Tongod",
            "zipCodes": [
              "06630"
            ]
          }
        ]
      },
      {
        "code": "SAN",
        "name": "San Pablo",
        "districts": [
          {
            "code": "SAN-SAN",
            "name": "San Bernardino",
            "zipCodes": [
              "06445"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "San Luis",
            "zipCodes": [
              "06450"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "San Pablo",
            "zipCodes": [
              "06451",
              "06452"
            ]
          },
          {
            "code": "SAN-TUM",
            "name": "Tumbaden",
            "zipCodes": [
              "06490"
            ]
          }
        ],
        "cities": [
          {
            "code": "SAN-SAN",
            "name": "San Bernardino",
            "zipCodes": [
              "06445"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "San Luis Grande",
            "zipCodes": [
              "06450"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "San Pablo",
            "zipCodes": [
              "06451",
              "06452"
            ]
          },
          {
            "code": "SAN-TUM",
            "name": "Tumbaden",
            "zipCodes": [
              "06490"
            ]
          }
        ]
      },
      {
        "code": "SAN",
        "name": "Santa Cruz",
        "districts": [
          {
            "code": "SAN-AND",
            "name": "Andabamba",
            "zipCodes": [
              "06615"
            ]
          },
          {
            "code": "SAN-CAT",
            "name": "Catache",
            "zipCodes": [
              "06644",
              "06645"
            ]
          },
          {
            "code": "SAN-CHA",
            "name": "Chancaybaños",
            "zipCodes": [
              "06610"
            ]
          },
          {
            "code": "SAN-LA ",
            "name": "La Esperanza",
            "zipCodes": [
              "06611"
            ]
          },
          {
            "code": "SAN-NIN",
            "name": "Ninabamba",
            "zipCodes": [
              "06621"
            ]
          },
          {
            "code": "SAN-PUL",
            "name": "Pulan",
            "zipCodes": [
              "06641"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "Santa Cruz",
            "zipCodes": [
              "06633",
              "06635"
            ]
          },
          {
            "code": "SAN-SAU",
            "name": "Saucepampa",
            "zipCodes": [
              "06640"
            ]
          },
          {
            "code": "SAN-SEX",
            "name": "Sexi",
            "zipCodes": [
              "06660"
            ]
          },
          {
            "code": "SAN-UTI",
            "name": "Uticyacu",
            "zipCodes": [
              "06605"
            ]
          },
          {
            "code": "SAN-YAU",
            "name": "Yauyucan",
            "zipCodes": [
              "06620"
            ]
          }
        ],
        "cities": [
          {
            "code": "SAN-AND",
            "name": "Andabamba",
            "zipCodes": [
              "06615"
            ]
          },
          {
            "code": "SAN-CAT",
            "name": "Catache",
            "zipCodes": [
              "06644",
              "06645"
            ]
          },
          {
            "code": "SAN-CHA",
            "name": "Chancaybaños",
            "zipCodes": [
              "06610"
            ]
          },
          {
            "code": "SAN-LA ",
            "name": "La Esperanza",
            "zipCodes": [
              "06611"
            ]
          },
          {
            "code": "SAN-NIN",
            "name": "Ninabamba",
            "zipCodes": [
              "06621"
            ]
          },
          {
            "code": "SAN-PUL",
            "name": "Pulan",
            "zipCodes": [
              "06641"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "Santa Cruz de Succhabamba",
            "zipCodes": [
              "06633",
              "06635"
            ]
          },
          {
            "code": "SAN-SAU",
            "name": "Saucepampa",
            "zipCodes": [
              "06640"
            ]
          },
          {
            "code": "SAN-SEX",
            "name": "Sexi",
            "zipCodes": [
              "06660"
            ]
          },
          {
            "code": "SAN-UTI",
            "name": "Uticyacu",
            "zipCodes": [
              "06605"
            ]
          },
          {
            "code": "SAN-YAU",
            "name": "Yauyucan",
            "zipCodes": [
              "06620"
            ]
          }
        ]
      }
    ]
  },
  {
    "code": "CAL",
    "name": "Callao",
    "provinces": [
      {
        "code": "CAL",
        "name": "Callao",
        "districts": [
          {
            "code": "CAL-BEL",
            "name": "Bellavista",
            "zipCodes": [
              "07001",
              "07006",
              "07011",
              "07016",
              "07021"
            ]
          },
          {
            "code": "CAL-CAL",
            "name": "Callao",
            "zipCodes": [
              "07001",
              "07006",
              "07021",
              "07026",
              "07031",
              "07036",
              "07041",
              "07046"
            ]
          },
          {
            "code": "CAL-CAR",
            "name": "Carmen de la Legua Reynoso",
            "zipCodes": [
              "07006"
            ]
          },
          {
            "code": "CAL-LA ",
            "name": "La Perla",
            "zipCodes": [
              "07011",
              "07016"
            ]
          },
          {
            "code": "CAL-LA ",
            "name": "La Punta",
            "zipCodes": [
              "07021"
            ]
          },
          {
            "code": "CAL-VEN",
            "name": "Ventanilla",
            "zipCodes": [
              "07046",
              "07051",
              "07056",
              "07061",
              "07066",
              "07071",
              "07076"
            ]
          }
        ],
        "cities": [
          {
            "code": "CAL-BEL",
            "name": "Bellavista",
            "zipCodes": [
              "07001",
              "07006",
              "07011",
              "07016",
              "07021"
            ]
          },
          {
            "code": "CAL-CAL",
            "name": "Callao",
            "zipCodes": [
              "07001",
              "07006",
              "07021",
              "07026",
              "07031",
              "07036",
              "07041",
              "07046"
            ]
          },
          {
            "code": "CAL-CAR",
            "name": "Carmen de la Legua Reynoso",
            "zipCodes": [
              "07006"
            ]
          },
          {
            "code": "CAL-LA ",
            "name": "La Perla",
            "zipCodes": [
              "07011",
              "07016"
            ]
          },
          {
            "code": "CAL-LA ",
            "name": "La Punta",
            "zipCodes": [
              "07021"
            ]
          },
          {
            "code": "CAL-VEN",
            "name": "Ventanilla",
            "zipCodes": [
              "07046",
              "07051",
              "07056",
              "07061",
              "07066",
              "07071",
              "07076"
            ]
          }
        ]
      }
    ]
  },
  {
    "code": "CUZ",
    "name": "Cuzco",
    "provinces": [
      {
        "code": "ACO",
        "name": "Acomayo",
        "districts": [
          {
            "code": "PAR-ACO",
            "name": "Acomayo",
            "zipCodes": [
              "08550",
              "08551"
            ]
          },
          {
            "code": "ACO-ACO",
            "name": "Acopia",
            "zipCodes": [
              "08295"
            ]
          },
          {
            "code": "PAR-ACO",
            "name": "Acos",
            "zipCodes": [
              "08545"
            ]
          },
          {
            "code": "ACO-MOS",
            "name": "Mosoc Llacta",
            "zipCodes": [
              "08290"
            ]
          },
          {
            "code": "PAR-POM",
            "name": "Pomacanchi",
            "zipCodes": [
              "08560",
              "08561"
            ]
          },
          {
            "code": "PAR-RON",
            "name": "Rondocan",
            "zipCodes": [
              "08525"
            ]
          },
          {
            "code": "PAR-SAN",
            "name": "Sangarara",
            "zipCodes": [
              "08555"
            ]
          }
        ],
        "cities": [
          {
            "code": "PAR-ACO",
            "name": "Acomayo",
            "zipCodes": [
              "08550",
              "08551"
            ]
          },
          {
            "code": "ACO-ACO",
            "name": "Acopia",
            "zipCodes": [
              "08295"
            ]
          },
          {
            "code": "PAR-ACO",
            "name": "Acos",
            "zipCodes": [
              "08545"
            ]
          },
          {
            "code": "ACO-MOS",
            "name": "Mosoc Llacta",
            "zipCodes": [
              "08290"
            ]
          },
          {
            "code": "PAR-POM",
            "name": "Pomacanchi",
            "zipCodes": [
              "08560",
              "08561"
            ]
          },
          {
            "code": "PAR-RON",
            "name": "Rondocan",
            "zipCodes": [
              "08525"
            ]
          },
          {
            "code": "PAR-SAN",
            "name": "Sangarara",
            "zipCodes": [
              "08555"
            ]
          }
        ]
      },
      {
        "code": "ANT",
        "name": "Anta",
        "districts": [
          {
            "code": "ANT-ANC",
            "name": "Ancahuasi",
            "zipCodes": [
              "08635",
              "08636"
            ]
          },
          {
            "code": "ANT-ANT",
            "name": "Anta",
            "zipCodes": [
              "08615",
              "08616"
            ]
          },
          {
            "code": "ANT-CAC",
            "name": "Cachimayo",
            "zipCodes": [
              "08605"
            ]
          },
          {
            "code": "ANT-CHI",
            "name": "Chinchaypujio",
            "zipCodes": [
              "08620"
            ]
          },
          {
            "code": "ANT-HUA",
            "name": "Huarocondo",
            "zipCodes": [
              "08625",
              "08626"
            ]
          },
          {
            "code": "ANT-LIM",
            "name": "Limatambo",
            "zipCodes": [
              "08640",
              "08641"
            ]
          },
          {
            "code": "ANT-MOL",
            "name": "Mollepata",
            "zipCodes": [
              "08645"
            ]
          },
          {
            "code": "ANT-PUC",
            "name": "Pucyura",
            "zipCodes": [
              "08610"
            ]
          },
          {
            "code": "ANT-ZUR",
            "name": "Zurite",
            "zipCodes": [
              "08630"
            ]
          }
        ],
        "cities": [
          {
            "code": "ANT-ANC",
            "name": "Ancahuasi",
            "zipCodes": [
              "08635",
              "08636"
            ]
          },
          {
            "code": "ANT-ANT",
            "name": "Anta",
            "zipCodes": [
              "08615",
              "08616"
            ]
          },
          {
            "code": "ANT-CAC",
            "name": "Cachimayo",
            "zipCodes": [
              "08605"
            ]
          },
          {
            "code": "ANT-CHI",
            "name": "Chinchaypujio",
            "zipCodes": [
              "08620"
            ]
          },
          {
            "code": "ANT-HUA",
            "name": "Huarocondo",
            "zipCodes": [
              "08625",
              "08626"
            ]
          },
          {
            "code": "ANT-LIM",
            "name": "Limatambo",
            "zipCodes": [
              "08640",
              "08641"
            ]
          },
          {
            "code": "ANT-MOL",
            "name": "Mollepata",
            "zipCodes": [
              "08645"
            ]
          },
          {
            "code": "ANT-PUC",
            "name": "Pucyura",
            "zipCodes": [
              "08610"
            ]
          },
          {
            "code": "ANT-ZUR",
            "name": "Zurite",
            "zipCodes": [
              "08630"
            ]
          }
        ]
      },
      {
        "code": "CAL",
        "name": "Calca",
        "districts": [
          {
            "code": "CAL-CAL",
            "name": "Calca",
            "zipCodes": [
              "08120",
              "08121"
            ]
          },
          {
            "code": "CAL-COY",
            "name": "Coya",
            "zipCodes": [
              "08110"
            ]
          },
          {
            "code": "CAL-LAM",
            "name": "Lamay",
            "zipCodes": [
              "08115",
              "08116"
            ]
          },
          {
            "code": "CAL-LAR",
            "name": "Lares",
            "zipCodes": [
              "08125",
              "08126"
            ]
          },
          {
            "code": "CAL-PIS",
            "name": "Pisac",
            "zipCodes": [
              "08105",
              "08106"
            ]
          },
          {
            "code": "PAU-SAN",
            "name": "San Salvador",
            "zipCodes": [
              "08150",
              "08151"
            ]
          },
          {
            "code": "CAL-TAR",
            "name": "Taray",
            "zipCodes": [
              "08100"
            ]
          },
          {
            "code": "LA -YAN",
            "name": "Yanatile",
            "zipCodes": [
              "08770",
              "08771"
            ]
          }
        ],
        "cities": [
          {
            "code": "CAL-CAL",
            "name": "Calca",
            "zipCodes": [
              "08120",
              "08121"
            ]
          },
          {
            "code": "CAL-COY",
            "name": "Coya",
            "zipCodes": [
              "08110"
            ]
          },
          {
            "code": "CAL-LAM",
            "name": "Lamay",
            "zipCodes": [
              "08115",
              "08116"
            ]
          },
          {
            "code": "CAL-LAR",
            "name": "Lares",
            "zipCodes": [
              "08125",
              "08126"
            ]
          },
          {
            "code": "CAL-PIS",
            "name": "Pisac",
            "zipCodes": [
              "08105",
              "08106"
            ]
          },
          {
            "code": "LA -QUE",
            "name": "Quebrada Honda",
            "zipCodes": [
              "08770",
              "08771"
            ]
          },
          {
            "code": "PAU-SAN",
            "name": "San Salvador",
            "zipCodes": [
              "08150",
              "08151"
            ]
          },
          {
            "code": "CAL-TAR",
            "name": "Taray",
            "zipCodes": [
              "08100"
            ]
          }
        ]
      },
      {
        "code": "CAN",
        "name": "Canas",
        "districts": [
          {
            "code": "CAN-CHE",
            "name": "Checca",
            "zipCodes": [
              "08277",
              "08278"
            ]
          },
          {
            "code": "CAN-KUN",
            "name": "Kunturkannki",
            "zipCodes": [
              "08267",
              "08268"
            ]
          },
          {
            "code": "CAN-LAN",
            "name": "Langui",
            "zipCodes": [
              "08270"
            ]
          },
          {
            "code": "CAN-LAY",
            "name": "Layo",
            "zipCodes": [
              "08274",
              "08275"
            ]
          },
          {
            "code": "CAN-PAM",
            "name": "Pampamarca",
            "zipCodes": [
              "08260"
            ]
          },
          {
            "code": "CAN-QUE",
            "name": "Quehue",
            "zipCodes": [
              "08280"
            ]
          },
          {
            "code": "CAN-TUP",
            "name": "Tupac Amaru",
            "zipCodes": [
              "08285"
            ]
          },
          {
            "code": "CAN-YAN",
            "name": "Yanaoca",
            "zipCodes": [
              "08264",
              "08265"
            ]
          }
        ],
        "cities": [
          {
            "code": "CAN-CHE",
            "name": "Checca",
            "zipCodes": [
              "08277",
              "08278"
            ]
          },
          {
            "code": "CAN-EL ",
            "name": "El Descanso",
            "zipCodes": [
              "08267",
              "08268"
            ]
          },
          {
            "code": "CAN-LAN",
            "name": "Langui",
            "zipCodes": [
              "08270"
            ]
          },
          {
            "code": "CAN-LAY",
            "name": "Layo",
            "zipCodes": [
              "08274",
              "08275"
            ]
          },
          {
            "code": "CAN-PAM",
            "name": "Pampamarca",
            "zipCodes": [
              "08260"
            ]
          },
          {
            "code": "CAN-QUE",
            "name": "Quehue",
            "zipCodes": [
              "08280"
            ]
          },
          {
            "code": "CAN-TUN",
            "name": "Tungasuca",
            "zipCodes": [
              "08285"
            ]
          },
          {
            "code": "CAN-YAN",
            "name": "Yanaoca",
            "zipCodes": [
              "08264",
              "08265"
            ]
          }
        ]
      },
      {
        "code": "CAN",
        "name": "Canchis",
        "districts": [
          {
            "code": "CAN-CHE",
            "name": "Checacupe",
            "zipCodes": [
              "08230"
            ]
          },
          {
            "code": "CAN-COM",
            "name": "Combapata",
            "zipCodes": [
              "08238",
              "08240"
            ]
          },
          {
            "code": "CAN-MAR",
            "name": "Marangani",
            "zipCodes": [
              "08257",
              "08258"
            ]
          },
          {
            "code": "CAN-PIT",
            "name": "Pitumarca",
            "zipCodes": [
              "08234",
              "08235"
            ]
          },
          {
            "code": "CAN-SAN",
            "name": "San Pablo",
            "zipCodes": [
              "08250"
            ]
          },
          {
            "code": "CAN-SAN",
            "name": "San Pedro",
            "zipCodes": [
              "08245"
            ]
          },
          {
            "code": "CAN-SIC",
            "name": "Sicuani",
            "zipCodes": [
              "08254",
              "08255"
            ]
          },
          {
            "code": "CAN-TIN",
            "name": "Tinta",
            "zipCodes": [
              "08242",
              "08243"
            ]
          }
        ],
        "cities": [
          {
            "code": "CAN-CHE",
            "name": "Checacupe",
            "zipCodes": [
              "08230"
            ]
          },
          {
            "code": "CAN-COM",
            "name": "Combapata",
            "zipCodes": [
              "08238",
              "08240"
            ]
          },
          {
            "code": "CAN-MAR",
            "name": "Marangani",
            "zipCodes": [
              "08257",
              "08258"
            ]
          },
          {
            "code": "CAN-PIT",
            "name": "Pitumarca",
            "zipCodes": [
              "08234",
              "08235"
            ]
          },
          {
            "code": "CAN-SAN",
            "name": "San Pablo",
            "zipCodes": [
              "08250"
            ]
          },
          {
            "code": "CAN-SAN",
            "name": "San Pedro",
            "zipCodes": [
              "08245"
            ]
          },
          {
            "code": "CAN-SIC",
            "name": "Sicuani",
            "zipCodes": [
              "08254",
              "08255"
            ]
          },
          {
            "code": "CAN-TIN",
            "name": "Tinta",
            "zipCodes": [
              "08242",
              "08243"
            ]
          }
        ]
      },
      {
        "code": "CHU",
        "name": "Chumbivilcas",
        "districts": [
          {
            "code": "CHU-CAP",
            "name": "Capacmarca",
            "zipCodes": [
              "08450"
            ]
          },
          {
            "code": "CHU-CHA",
            "name": "Chamaca",
            "zipCodes": [
              "08460",
              "08461"
            ]
          },
          {
            "code": "CHU-COL",
            "name": "Colquemarca",
            "zipCodes": [
              "08440",
              "08441"
            ]
          },
          {
            "code": "CHU-LIV",
            "name": "Livitaca",
            "zipCodes": [
              "08470",
              "08471"
            ]
          },
          {
            "code": "CHU-LLU",
            "name": "Llusco",
            "zipCodes": [
              "08410",
              "08411"
            ]
          },
          {
            "code": "CHU-QUI",
            "name": "Quiñota",
            "zipCodes": [
              "08400"
            ]
          },
          {
            "code": "CHU-SAN",
            "name": "Santo Tomas",
            "zipCodes": [
              "08420",
              "08421"
            ]
          },
          {
            "code": "CHU-VEL",
            "name": "Velille",
            "zipCodes": [
              "08430",
              "08431"
            ]
          }
        ],
        "cities": [
          {
            "code": "CHU-CAP",
            "name": "Capacmarca",
            "zipCodes": [
              "08450"
            ]
          },
          {
            "code": "CHU-CHA",
            "name": "Chamaca",
            "zipCodes": [
              "08460",
              "08461"
            ]
          },
          {
            "code": "CHU-COL",
            "name": "Colquemarca",
            "zipCodes": [
              "08440",
              "08441"
            ]
          },
          {
            "code": "CHU-LIV",
            "name": "Livitaca",
            "zipCodes": [
              "08470",
              "08471"
            ]
          },
          {
            "code": "CHU-LLU",
            "name": "Llusco",
            "zipCodes": [
              "08410",
              "08411"
            ]
          },
          {
            "code": "CHU-QUI",
            "name": "Quiñota",
            "zipCodes": [
              "08400"
            ]
          },
          {
            "code": "CHU-SAN",
            "name": "Santo Tomas",
            "zipCodes": [
              "08420",
              "08421"
            ]
          },
          {
            "code": "CHU-VEL",
            "name": "Velille",
            "zipCodes": [
              "08430",
              "08431"
            ]
          }
        ]
      },
      {
        "code": "CUZ",
        "name": "Cuzco",
        "districts": [
          {
            "code": "CUZ-CCO",
            "name": "Ccorca",
            "zipCodes": [
              "08000",
              "08051"
            ]
          },
          {
            "code": "CUZ-CUS",
            "name": "Cusco",
            "zipCodes": [
              "08000",
              "08001",
              "08002",
              "08003"
            ]
          },
          {
            "code": "PAR-POR",
            "name": "Poroy",
            "zipCodes": [
              "08600"
            ]
          },
          {
            "code": "CUZ-SAN",
            "name": "San Jerónimo",
            "zipCodes": [
              "08000",
              "08006"
            ]
          },
          {
            "code": "CUZ-SAN",
            "name": "San Sebastian",
            "zipCodes": [
              "08000",
              "08004",
              "08006"
            ]
          },
          {
            "code": "CUZ-SAN",
            "name": "Santiago",
            "zipCodes": [
              "08000",
              "08001",
              "08006",
              "08007"
            ]
          },
          {
            "code": "QUI-SAY",
            "name": "Saylla",
            "zipCodes": [
              "08200"
            ]
          },
          {
            "code": "CUZ-WAN",
            "name": "Wanchaq",
            "zipCodes": [
              "08002",
              "08003",
              "08004",
              "08006",
              "08007"
            ]
          }
        ],
        "cities": [
          {
            "code": "CUZ-CCO",
            "name": "Ccorcca",
            "zipCodes": [
              "08000",
              "08051"
            ]
          },
          {
            "code": "CUZ-CUS",
            "name": "Cusco",
            "zipCodes": [
              "08000",
              "08001",
              "08002",
              "08003"
            ]
          },
          {
            "code": "PAR-POR",
            "name": "Poroy",
            "zipCodes": [
              "08600"
            ]
          },
          {
            "code": "CUZ-SAN",
            "name": "San Jeronimo",
            "zipCodes": [
              "08000",
              "08006"
            ]
          },
          {
            "code": "CUZ-SAN",
            "name": "San Sebastian",
            "zipCodes": [
              "08000",
              "08004",
              "08006"
            ]
          },
          {
            "code": "CUZ-SAN",
            "name": "Santiago",
            "zipCodes": [
              "08000",
              "08001",
              "08006",
              "08007"
            ]
          },
          {
            "code": "QUI-SAY",
            "name": "Saylla",
            "zipCodes": [
              "08200"
            ]
          },
          {
            "code": "CUZ-WAN",
            "name": "Wanchaq",
            "zipCodes": [
              "08002",
              "08003",
              "08004",
              "08006",
              "08007"
            ]
          }
        ]
      },
      {
        "code": "ESP",
        "name": "Espinar",
        "districts": [
          {
            "code": "ESP-ALT",
            "name": "Alto Pichigua",
            "zipCodes": [
              "08330"
            ]
          },
          {
            "code": "ESP-CON",
            "name": "Condoroma",
            "zipCodes": [
              "08350"
            ]
          },
          {
            "code": "ESP-COP",
            "name": "Coporaque",
            "zipCodes": [
              "08370",
              "08371"
            ]
          },
          {
            "code": "ESP-ESP",
            "name": "Espinar",
            "zipCodes": [
              "08300",
              "08301"
            ]
          },
          {
            "code": "ESP-OCO",
            "name": "Ocoruro",
            "zipCodes": [
              "08340"
            ]
          },
          {
            "code": "ESP-PAL",
            "name": "Pallpata",
            "zipCodes": [
              "08320",
              "08321"
            ]
          },
          {
            "code": "ESP-PIC",
            "name": "Pichigua",
            "zipCodes": [
              "08310"
            ]
          },
          {
            "code": "ESP-SUY",
            "name": "Suyckutambo",
            "zipCodes": [
              "08360"
            ]
          }
        ],
        "cities": [
          {
            "code": "ESP-ACC",
            "name": "Accocunca",
            "zipCodes": [
              "08330"
            ]
          },
          {
            "code": "ESP-CON",
            "name": "Condoroma",
            "zipCodes": [
              "08350"
            ]
          },
          {
            "code": "ESP-COP",
            "name": "Coporaque",
            "zipCodes": [
              "08370",
              "08371"
            ]
          },
          {
            "code": "ESP-HEC",
            "name": "Hector Tejada",
            "zipCodes": [
              "08320",
              "08321"
            ]
          },
          {
            "code": "ESP-OCO",
            "name": "Ocoruro",
            "zipCodes": [
              "08340"
            ]
          },
          {
            "code": "ESP-PIC",
            "name": "Pichigua",
            "zipCodes": [
              "08310"
            ]
          },
          {
            "code": "ESP-VIR",
            "name": "Virginiyoc",
            "zipCodes": [
              "08360"
            ]
          },
          {
            "code": "ESP-YAU",
            "name": "Yauri  ( Espinar)",
            "zipCodes": [
              "08300",
              "08301"
            ]
          }
        ]
      },
      {
        "code": "LA ",
        "name": "La Convención",
        "districts": [
          {
            "code": "LA -ECH",
            "name": "Echarate",
            "zipCodes": [
              "08750",
              "08751"
            ]
          },
          {
            "code": "LA -HUA",
            "name": "Huayopata",
            "zipCodes": [
              "08700",
              "08701"
            ]
          },
          {
            "code": "LA -KIM",
            "name": "Kimbiri",
            "zipCodes": [
              "08800",
              "08801"
            ]
          },
          {
            "code": "LA -MAR",
            "name": "Maranura",
            "zipCodes": [
              "08730",
              "08731"
            ]
          },
          {
            "code": "LA -OCO",
            "name": "Ocobamba",
            "zipCodes": [
              "08780",
              "08781"
            ]
          },
          {
            "code": "LA -PIC",
            "name": "Pichari",
            "zipCodes": [
              "08850",
              "08851"
            ]
          },
          {
            "code": "LA -QUE",
            "name": "Quellouno",
            "zipCodes": [
              "08760",
              "08761"
            ]
          },
          {
            "code": "LA -SAN",
            "name": "Santa Ana",
            "zipCodes": [
              "08740",
              "08741"
            ]
          },
          {
            "code": "LA -SAN",
            "name": "Santa Teresa",
            "zipCodes": [
              "08710",
              "08711"
            ]
          },
          {
            "code": "LA -VIL",
            "name": "Vilcabamba",
            "zipCodes": [
              "08720",
              "08721"
            ]
          }
        ],
        "cities": [
          {
            "code": "LA -ECH",
            "name": "Echarate",
            "zipCodes": [
              "08750",
              "08751"
            ]
          },
          {
            "code": "LA -HUY",
            "name": "Huyro",
            "zipCodes": [
              "08700",
              "08701"
            ]
          },
          {
            "code": "LA -KIM",
            "name": "Kimbiri",
            "zipCodes": [
              "08800",
              "08801"
            ]
          },
          {
            "code": "LA -KQU",
            "name": "Kquelccaybamba",
            "zipCodes": [
              "08780",
              "08781"
            ]
          },
          {
            "code": "LA -LUC",
            "name": "Lucma",
            "zipCodes": [
              "08720",
              "08721"
            ]
          },
          {
            "code": "LA -MAR",
            "name": "Maranura",
            "zipCodes": [
              "08730",
              "08731"
            ]
          },
          {
            "code": "LA -PIC",
            "name": "Pichari",
            "zipCodes": [
              "08850",
              "08851"
            ]
          },
          {
            "code": "LA -QUE",
            "name": "Quellouno",
            "zipCodes": [
              "08760",
              "08761"
            ]
          },
          {
            "code": "LA -QUI",
            "name": "Quillabamba",
            "zipCodes": [
              "08740",
              "08741"
            ]
          },
          {
            "code": "LA -SAN",
            "name": "Santa Teresa",
            "zipCodes": [
              "08710",
              "08711"
            ]
          }
        ]
      },
      {
        "code": "PAR",
        "name": "Paruro",
        "districts": [
          {
            "code": "PAR-ACC",
            "name": "Accha",
            "zipCodes": [
              "08535"
            ]
          },
          {
            "code": "PAR-CCA",
            "name": "Ccapi",
            "zipCodes": [
              "08505"
            ]
          },
          {
            "code": "PAR-COL",
            "name": "Colcha",
            "zipCodes": [
              "08530"
            ]
          },
          {
            "code": "PAR-HUA",
            "name": "Huanoquite",
            "zipCodes": [
              "08500",
              "08501"
            ]
          },
          {
            "code": "PAR-OMA",
            "name": "Omacha",
            "zipCodes": [
              "08565",
              "08566"
            ]
          },
          {
            "code": "PAR-PAC",
            "name": "Paccaritambo",
            "zipCodes": [
              "08515"
            ]
          },
          {
            "code": "PAR-PAR",
            "name": "Paruro",
            "zipCodes": [
              "08520"
            ]
          },
          {
            "code": "PAR-PIL",
            "name": "Pillpinto",
            "zipCodes": [
              "08540"
            ]
          },
          {
            "code": "PAR-YAU",
            "name": "Yaurisque",
            "zipCodes": [
              "08510"
            ]
          }
        ],
        "cities": [
          {
            "code": "PAR-ACC",
            "name": "Accha",
            "zipCodes": [
              "08535"
            ]
          },
          {
            "code": "PAR-CCA",
            "name": "Ccapi",
            "zipCodes": [
              "08505"
            ]
          },
          {
            "code": "PAR-COL",
            "name": "Colcha",
            "zipCodes": [
              "08530"
            ]
          },
          {
            "code": "PAR-HUA",
            "name": "Huanoquite",
            "zipCodes": [
              "08500",
              "08501"
            ]
          },
          {
            "code": "PAR-OMA",
            "name": "Omacha",
            "zipCodes": [
              "08565",
              "08566"
            ]
          },
          {
            "code": "PAR-PAC",
            "name": "Paccaritambo",
            "zipCodes": [
              "08515"
            ]
          },
          {
            "code": "PAR-PAR",
            "name": "Paruro",
            "zipCodes": [
              "08520"
            ]
          },
          {
            "code": "PAR-PIL",
            "name": "Pillpinto",
            "zipCodes": [
              "08540"
            ]
          },
          {
            "code": "PAR-YAU",
            "name": "Yaurisque",
            "zipCodes": [
              "08510"
            ]
          }
        ]
      },
      {
        "code": "PAU",
        "name": "Paucartambo",
        "districts": [
          {
            "code": "PAU-CAI",
            "name": "Caicay",
            "zipCodes": [
              "08155"
            ]
          },
          {
            "code": "PAU-CHA",
            "name": "Challabamba",
            "zipCodes": [
              "08140",
              "08141"
            ]
          },
          {
            "code": "PAU-COL",
            "name": "Colquepata",
            "zipCodes": [
              "08130",
              "08131"
            ]
          },
          {
            "code": "PAU-HUA",
            "name": "Huancarani",
            "zipCodes": [
              "08160",
              "08161"
            ]
          },
          {
            "code": "PAU-KOS",
            "name": "Kosñipata",
            "zipCodes": [
              "08145"
            ]
          },
          {
            "code": "PAU-PAU",
            "name": "Paucartambo",
            "zipCodes": [
              "08135",
              "08136"
            ]
          }
        ],
        "cities": [
          {
            "code": "PAU-CAI",
            "name": "Caicay",
            "zipCodes": [
              "08155"
            ]
          },
          {
            "code": "PAU-CHA",
            "name": "Challabamba",
            "zipCodes": [
              "08140",
              "08141"
            ]
          },
          {
            "code": "PAU-COL",
            "name": "Colquepata",
            "zipCodes": [
              "08130",
              "08131"
            ]
          },
          {
            "code": "PAU-HUA",
            "name": "Huancarani",
            "zipCodes": [
              "08160",
              "08161"
            ]
          },
          {
            "code": "PAU-PAU",
            "name": "Paucartambo",
            "zipCodes": [
              "08135",
              "08136"
            ]
          },
          {
            "code": "PAU-PIL",
            "name": "Pillcopata",
            "zipCodes": [
              "08145"
            ]
          }
        ]
      },
      {
        "code": "QUI",
        "name": "Quispicanchi",
        "districts": [
          {
            "code": "QUI-AND",
            "name": "Andahuaylillas",
            "zipCodes": [
              "08210"
            ]
          },
          {
            "code": "QUI-CAM",
            "name": "Camanti",
            "zipCodes": [
              "08185"
            ]
          },
          {
            "code": "QUI-CCA",
            "name": "Ccarhuayo",
            "zipCodes": [
              "08175"
            ]
          },
          {
            "code": "QUI-CCA",
            "name": "Ccatca",
            "zipCodes": [
              "08165",
              "08166"
            ]
          },
          {
            "code": "QUI-CUS",
            "name": "Cusipata",
            "zipCodes": [
              "08225"
            ]
          },
          {
            "code": "QUI-HUA",
            "name": "Huaro",
            "zipCodes": [
              "08215"
            ]
          },
          {
            "code": "QUI-LUC",
            "name": "Lucre",
            "zipCodes": [
              "08207"
            ]
          },
          {
            "code": "QUI-MAR",
            "name": "Marcapata",
            "zipCodes": [
              "08180"
            ]
          },
          {
            "code": "QUI-OCO",
            "name": "Ocongate",
            "zipCodes": [
              "08170",
              "08171"
            ]
          },
          {
            "code": "QUI-ORO",
            "name": "Oropesa",
            "zipCodes": [
              "08204",
              "08205"
            ]
          },
          {
            "code": "QUI-QUI",
            "name": "Quiquijana",
            "zipCodes": [
              "08222",
              "08223"
            ]
          },
          {
            "code": "QUI-URC",
            "name": "Urcos",
            "zipCodes": [
              "08219",
              "08220"
            ]
          }
        ],
        "cities": [
          {
            "code": "QUI-AND",
            "name": "Andahuaylillas",
            "zipCodes": [
              "08210"
            ]
          },
          {
            "code": "QUI-CCA",
            "name": "Ccarhuayo",
            "zipCodes": [
              "08175"
            ]
          },
          {
            "code": "QUI-CCA",
            "name": "Ccatca",
            "zipCodes": [
              "08165",
              "08166"
            ]
          },
          {
            "code": "QUI-CUS",
            "name": "Cusipata",
            "zipCodes": [
              "08225"
            ]
          },
          {
            "code": "QUI-HUA",
            "name": "Huaro",
            "zipCodes": [
              "08215"
            ]
          },
          {
            "code": "QUI-LUC",
            "name": "Lucre",
            "zipCodes": [
              "08207"
            ]
          },
          {
            "code": "QUI-MAR",
            "name": "Marcapata",
            "zipCodes": [
              "08180"
            ]
          },
          {
            "code": "QUI-OCO",
            "name": "Ocongate",
            "zipCodes": [
              "08170",
              "08171"
            ]
          },
          {
            "code": "QUI-ORO",
            "name": "Oropesa",
            "zipCodes": [
              "08204",
              "08205"
            ]
          },
          {
            "code": "QUI-QUI",
            "name": "Quincemil",
            "zipCodes": [
              "08185"
            ]
          },
          {
            "code": "QUI-QUI",
            "name": "Quiquijana",
            "zipCodes": [
              "08222",
              "08223"
            ]
          },
          {
            "code": "QUI-URC",
            "name": "Urcos",
            "zipCodes": [
              "08219",
              "08220"
            ]
          }
        ]
      },
      {
        "code": "URU",
        "name": "Urubamba",
        "districts": [
          {
            "code": "URU-CHI",
            "name": "Chinchero",
            "zipCodes": [
              "08650",
              "08651"
            ]
          },
          {
            "code": "URU-HUA",
            "name": "Huayllabamba",
            "zipCodes": [
              "08670"
            ]
          },
          {
            "code": "URU-MAC",
            "name": "Machupicchu",
            "zipCodes": [
              "08680",
              "08681"
            ]
          },
          {
            "code": "URU-MAR",
            "name": "Maras",
            "zipCodes": [
              "08655",
              "08656"
            ]
          },
          {
            "code": "URU-OLL",
            "name": "Ollantaytambo",
            "zipCodes": [
              "08675",
              "08676"
            ]
          },
          {
            "code": "URU-URU",
            "name": "Urubamba",
            "zipCodes": [
              "08660",
              "08661"
            ]
          },
          {
            "code": "URU-YUC",
            "name": "Yucay",
            "zipCodes": [
              "08665"
            ]
          }
        ],
        "cities": [
          {
            "code": "URU-CHI",
            "name": "Chinchero",
            "zipCodes": [
              "08650",
              "08651"
            ]
          },
          {
            "code": "URU-HUA",
            "name": "Huayllabamba",
            "zipCodes": [
              "08670"
            ]
          },
          {
            "code": "URU-MAC",
            "name": "Machupicchu",
            "zipCodes": [
              "08680",
              "08681"
            ]
          },
          {
            "code": "URU-MAR",
            "name": "Maras",
            "zipCodes": [
              "08655",
              "08656"
            ]
          },
          {
            "code": "URU-OLL",
            "name": "Ollantaytambo",
            "zipCodes": [
              "08675",
              "08676"
            ]
          },
          {
            "code": "URU-URU",
            "name": "Urubamba",
            "zipCodes": [
              "08660",
              "08661"
            ]
          },
          {
            "code": "URU-YUC",
            "name": "Yucay",
            "zipCodes": [
              "08665"
            ]
          }
        ]
      }
    ]
  },
  {
    "code": "HUA",
    "name": "Huancavelica",
    "provinces": [
      {
        "code": "ACO",
        "name": "Acobamba",
        "districts": [
          {
            "code": "CHU-ACO",
            "name": "Acobamba",
            "zipCodes": [
              "09380",
              "09381"
            ]
          },
          {
            "code": "ACO-AND",
            "name": "Andabamba",
            "zipCodes": [
              "09310"
            ]
          },
          {
            "code": "CHU-ANT",
            "name": "Anta",
            "zipCodes": [
              "09375",
              "09376"
            ]
          },
          {
            "code": "CHU-CAJ",
            "name": "Caja",
            "zipCodes": [
              "09390"
            ]
          },
          {
            "code": "CHU-MAR",
            "name": "Marcas",
            "zipCodes": [
              "09395"
            ]
          },
          {
            "code": "ACO-PAU",
            "name": "Paucara",
            "zipCodes": [
              "09305",
              "09306"
            ]
          },
          {
            "code": "CHU-POM",
            "name": "Pomacocha",
            "zipCodes": [
              "09385"
            ]
          },
          {
            "code": "CHU-ROS",
            "name": "Rosario",
            "zipCodes": [
              "09370",
              "09371"
            ]
          }
        ],
        "cities": [
          {
            "code": "CHU-ACO",
            "name": "Acobamba",
            "zipCodes": [
              "09380",
              "09381"
            ]
          },
          {
            "code": "ACO-AND",
            "name": "Andabamba",
            "zipCodes": [
              "09310"
            ]
          },
          {
            "code": "CHU-ANT",
            "name": "Anta",
            "zipCodes": [
              "09375",
              "09376"
            ]
          },
          {
            "code": "CHU-CAJ",
            "name": "Caja",
            "zipCodes": [
              "09390"
            ]
          },
          {
            "code": "CHU-MAR",
            "name": "Marcas",
            "zipCodes": [
              "09395"
            ]
          },
          {
            "code": "ACO-PAU",
            "name": "Paucara",
            "zipCodes": [
              "09305",
              "09306"
            ]
          },
          {
            "code": "CHU-POM",
            "name": "Pomacocha",
            "zipCodes": [
              "09385"
            ]
          },
          {
            "code": "CHU-ROS",
            "name": "Rosario",
            "zipCodes": [
              "09370",
              "09371"
            ]
          }
        ]
      },
      {
        "code": "ANG",
        "name": "Angaraes",
        "districts": [
          {
            "code": "ANG-ANC",
            "name": "Anchonga",
            "zipCodes": [
              "09415",
              "09416"
            ]
          },
          {
            "code": "ANG-CAL",
            "name": "Callanmarca",
            "zipCodes": [
              "09425"
            ]
          },
          {
            "code": "ANG-CCO",
            "name": "Ccochaccasa",
            "zipCodes": [
              "09400"
            ]
          },
          {
            "code": "ANG-CHI",
            "name": "Chincho",
            "zipCodes": [
              "09450"
            ]
          },
          {
            "code": "ANG-CON",
            "name": "Congalla",
            "zipCodes": [
              "09435"
            ]
          },
          {
            "code": "ANG-HUA",
            "name": "Huanca Huanca",
            "zipCodes": [
              "09430"
            ]
          },
          {
            "code": "ANG-HUA",
            "name": "Huayllay Grande",
            "zipCodes": [
              "09420"
            ]
          },
          {
            "code": "ANG-JUL",
            "name": "Julcamarca",
            "zipCodes": [
              "09445"
            ]
          },
          {
            "code": "ANG-LIR",
            "name": "Lircay",
            "zipCodes": [
              "09405",
              "09406"
            ]
          },
          {
            "code": "ANG-SAN",
            "name": "San Antonio de Antaparco",
            "zipCodes": [
              "09455"
            ]
          },
          {
            "code": "ANG-SAN",
            "name": "Santo Tomas de Pata",
            "zipCodes": [
              "09460"
            ]
          },
          {
            "code": "ANG-SEC",
            "name": "Secclla",
            "zipCodes": [
              "09440"
            ]
          }
        ],
        "cities": [
          {
            "code": "ANG-ANC",
            "name": "Anchonga",
            "zipCodes": [
              "09415",
              "09416"
            ]
          },
          {
            "code": "ANG-ANT",
            "name": "Antaparco",
            "zipCodes": [
              "09455"
            ]
          },
          {
            "code": "ANG-CAL",
            "name": "Callanmarca",
            "zipCodes": [
              "09425"
            ]
          },
          {
            "code": "ANG-CCO",
            "name": "Ccochaccasa",
            "zipCodes": [
              "09400"
            ]
          },
          {
            "code": "ANG-CHI",
            "name": "Chincho",
            "zipCodes": [
              "09450"
            ]
          },
          {
            "code": "ANG-CON",
            "name": "Congalla",
            "zipCodes": [
              "09435"
            ]
          },
          {
            "code": "ANG-HUA",
            "name": "Huanca Huanca",
            "zipCodes": [
              "09430"
            ]
          },
          {
            "code": "ANG-HUA",
            "name": "Huayllay Grande",
            "zipCodes": [
              "09420"
            ]
          },
          {
            "code": "ANG-JUL",
            "name": "Julcamarca",
            "zipCodes": [
              "09445"
            ]
          },
          {
            "code": "ANG-LIR",
            "name": "Lircay",
            "zipCodes": [
              "09405",
              "09406"
            ]
          },
          {
            "code": "ANG-SAN",
            "name": "Santo Tomas de Pata",
            "zipCodes": [
              "09460"
            ]
          },
          {
            "code": "ANG-SEC",
            "name": "Secclla",
            "zipCodes": [
              "09440"
            ]
          }
        ]
      },
      {
        "code": "CAS",
        "name": "Castrovirreyna",
        "districts": [
          {
            "code": "HUA-ARM",
            "name": "Arma",
            "zipCodes": [
              "09700"
            ]
          },
          {
            "code": "HUA-AUR",
            "name": "Aurahua",
            "zipCodes": [
              "09735"
            ]
          },
          {
            "code": "HUA-CAP",
            "name": "Capillas",
            "zipCodes": [
              "09710"
            ]
          },
          {
            "code": "HUA-CAS",
            "name": "Castrovirreyna",
            "zipCodes": [
              "09725"
            ]
          },
          {
            "code": "HUA-CHU",
            "name": "Chupamarca",
            "zipCodes": [
              "09740"
            ]
          },
          {
            "code": "HUA-COC",
            "name": "Cocas",
            "zipCodes": [
              "09720"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huachos",
            "zipCodes": [
              "09705"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huamatambo",
            "zipCodes": [
              "09750"
            ]
          },
          {
            "code": "HUA-MOL",
            "name": "Mollepampa",
            "zipCodes": [
              "09715"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "San Juan",
            "zipCodes": [
              "09755"
            ]
          },
          {
            "code": "CAS-SAN",
            "name": "Santa Ana",
            "zipCodes": [
              "09500"
            ]
          },
          {
            "code": "HUA-TAN",
            "name": "Tantara",
            "zipCodes": [
              "09745"
            ]
          },
          {
            "code": "HUA-TIC",
            "name": "Ticrapo",
            "zipCodes": [
              "09730"
            ]
          }
        ],
        "cities": [
          {
            "code": "HUA-ARM",
            "name": "Arma",
            "zipCodes": [
              "09700"
            ]
          },
          {
            "code": "HUA-AUR",
            "name": "Aurahua",
            "zipCodes": [
              "09735"
            ]
          },
          {
            "code": "HUA-CAP",
            "name": "Capillas",
            "zipCodes": [
              "09710"
            ]
          },
          {
            "code": "HUA-CAS",
            "name": "Castrovirreyna",
            "zipCodes": [
              "09725"
            ]
          },
          {
            "code": "HUA-CHU",
            "name": "Chupamarca",
            "zipCodes": [
              "09740"
            ]
          },
          {
            "code": "HUA-COC",
            "name": "Cocas",
            "zipCodes": [
              "09720"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huachos",
            "zipCodes": [
              "09705"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huamatambo",
            "zipCodes": [
              "09750"
            ]
          },
          {
            "code": "HUA-MOL",
            "name": "Mollepampa",
            "zipCodes": [
              "09715"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "San Juan",
            "zipCodes": [
              "09755"
            ]
          },
          {
            "code": "CAS-SAN",
            "name": "Santa Ana",
            "zipCodes": [
              "09500"
            ]
          },
          {
            "code": "HUA-TAN",
            "name": "Tantara",
            "zipCodes": [
              "09745"
            ]
          },
          {
            "code": "HUA-TIC",
            "name": "Ticrapo",
            "zipCodes": [
              "09730"
            ]
          }
        ]
      },
      {
        "code": "CHU",
        "name": "Churcampa",
        "districts": [
          {
            "code": "CHU-ANC",
            "name": "Anco",
            "zipCodes": [
              "09315",
              "09316"
            ]
          },
          {
            "code": "CHU-CHI",
            "name": "Chinchihuasi",
            "zipCodes": [
              "09325"
            ]
          },
          {
            "code": "CHU-CHU",
            "name": "Churcampa",
            "zipCodes": [
              "09345",
              "09346"
            ]
          },
          {
            "code": "CHU-EL ",
            "name": "El Carmen",
            "zipCodes": [
              "09365"
            ]
          },
          {
            "code": "CHU-LA ",
            "name": "La Merced",
            "zipCodes": [
              "09355"
            ]
          },
          {
            "code": "CHU-LOC",
            "name": "Locroja",
            "zipCodes": [
              "09350"
            ]
          },
          {
            "code": "CHU-PAC",
            "name": "Pachamarca",
            "zipCodes": [
              "09335"
            ]
          },
          {
            "code": "CHU-PAU",
            "name": "Paucarbamba",
            "zipCodes": [
              "09330",
              "09331"
            ]
          },
          {
            "code": "CHU-SAN",
            "name": "San Miguel de Mayocc",
            "zipCodes": [
              "09360"
            ]
          },
          {
            "code": "CHU-SAN",
            "name": "San Pedro de Coris",
            "zipCodes": [
              "09340"
            ]
          }
        ],
        "cities": [
          {
            "code": "CHU-CHI",
            "name": "Chinchihuasi",
            "zipCodes": [
              "09325"
            ]
          },
          {
            "code": "CHU-CHU",
            "name": "Churcampa",
            "zipCodes": [
              "09345",
              "09346"
            ]
          },
          {
            "code": "CHU-LA ",
            "name": "La Esmeralda",
            "zipCodes": [
              "09315",
              "09316"
            ]
          },
          {
            "code": "CHU-LA ",
            "name": "La Merced",
            "zipCodes": [
              "09355"
            ]
          },
          {
            "code": "CHU-LOC",
            "name": "Locroja",
            "zipCodes": [
              "09350"
            ]
          },
          {
            "code": "CHU-MAY",
            "name": "Mayocc",
            "zipCodes": [
              "09360"
            ]
          },
          {
            "code": "CHU-PAC",
            "name": "Pachamarca",
            "zipCodes": [
              "09335"
            ]
          },
          {
            "code": "CHU-PAU",
            "name": "Paucarbamba",
            "zipCodes": [
              "09330",
              "09331"
            ]
          },
          {
            "code": "CHU-PAU",
            "name": "Paucarbambilla",
            "zipCodes": [
              "09365"
            ]
          },
          {
            "code": "CHU-SAN",
            "name": "San Pedro de Coris",
            "zipCodes": [
              "09340"
            ]
          }
        ]
      },
      {
        "code": "HUA",
        "name": "Huancavelica",
        "districts": [
          {
            "code": "HUA-ACO",
            "name": "Acobambilla",
            "zipCodes": [
              "09800"
            ]
          },
          {
            "code": "HUA-ACO",
            "name": "Acoria",
            "zipCodes": [
              "09100",
              "09101"
            ]
          },
          {
            "code": "HUA-ASC",
            "name": "Ascensión",
            "zipCodes": [
              "09000",
              "09001"
            ]
          },
          {
            "code": "HUA-CON",
            "name": "Conayca",
            "zipCodes": [
              "09870"
            ]
          },
          {
            "code": "HUA-CUE",
            "name": "Cuenca",
            "zipCodes": [
              "09860"
            ]
          },
          {
            "code": "CAS-HUA",
            "name": "Huachocolpa",
            "zipCodes": [
              "09510"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huancavelíca",
            "zipCodes": [
              "09000",
              "09001"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huando",
            "zipCodes": [
              "09110",
              "09111"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huayllahuara",
            "zipCodes": [
              "09840"
            ]
          },
          {
            "code": "HUA-IZC",
            "name": "Izcuchaca",
            "zipCodes": [
              "09115"
            ]
          },
          {
            "code": "HUA-LAR",
            "name": "Laría",
            "zipCodes": [
              "09880"
            ]
          },
          {
            "code": "HUA-MAN",
            "name": "Manta",
            "zipCodes": [
              "09810"
            ]
          },
          {
            "code": "HUA-MAR",
            "name": "Mariscal Cáceres",
            "zipCodes": [
              "09120"
            ]
          },
          {
            "code": "HUA-MOY",
            "name": "Moya",
            "zipCodes": [
              "09830"
            ]
          },
          {
            "code": "HUA-NUE",
            "name": "Nuevo Occoro",
            "zipCodes": [
              "09890"
            ]
          },
          {
            "code": "HUA-PAL",
            "name": "Palca",
            "zipCodes": [
              "09105"
            ]
          },
          {
            "code": "HUA-PIL",
            "name": "Pilchaca",
            "zipCodes": [
              "09850"
            ]
          },
          {
            "code": "HUA-VIL",
            "name": "Vilca",
            "zipCodes": [
              "09820"
            ]
          },
          {
            "code": "TAY-YAU",
            "name": "Yauli",
            "zipCodes": [
              "09300",
              "09301"
            ]
          }
        ],
        "cities": [
          {
            "code": "HUA-ACO",
            "name": "Acobambilla",
            "zipCodes": [
              "09800"
            ]
          },
          {
            "code": "HUA-ACO",
            "name": "Acoria",
            "zipCodes": [
              "09100",
              "09101"
            ]
          },
          {
            "code": "HUA-ASC",
            "name": "Ascencion",
            "zipCodes": [
              "09000",
              "09001"
            ]
          },
          {
            "code": "HUA-CON",
            "name": "Conayca",
            "zipCodes": [
              "09870"
            ]
          },
          {
            "code": "HUA-CUE",
            "name": "Cuenca",
            "zipCodes": [
              "09860"
            ]
          },
          {
            "code": "CAS-HUA",
            "name": "Huachocolpa",
            "zipCodes": [
              "09510"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huancavelica",
            "zipCodes": [
              "09000",
              "09001"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huando",
            "zipCodes": [
              "09110",
              "09111"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huayllahuara",
            "zipCodes": [
              "09840"
            ]
          },
          {
            "code": "HUA-IZC",
            "name": "Izcuchaca",
            "zipCodes": [
              "09115"
            ]
          },
          {
            "code": "HUA-LAR",
            "name": "Laria",
            "zipCodes": [
              "09880"
            ]
          },
          {
            "code": "HUA-MAN",
            "name": "Manta",
            "zipCodes": [
              "09810"
            ]
          },
          {
            "code": "HUA-MAR",
            "name": "Mariscal Caceres",
            "zipCodes": [
              "09120"
            ]
          },
          {
            "code": "HUA-MOY",
            "name": "Moya",
            "zipCodes": [
              "09830"
            ]
          },
          {
            "code": "HUA-OCC",
            "name": "Occoro",
            "zipCodes": [
              "09890"
            ]
          },
          {
            "code": "HUA-PAL",
            "name": "Palca",
            "zipCodes": [
              "09105"
            ]
          },
          {
            "code": "HUA-PIL",
            "name": "Pilchaca",
            "zipCodes": [
              "09850"
            ]
          },
          {
            "code": "HUA-VIL",
            "name": "Vilca",
            "zipCodes": [
              "09820"
            ]
          },
          {
            "code": "TAY-YAU",
            "name": "Yauli",
            "zipCodes": [
              "09300",
              "09301"
            ]
          }
        ]
      },
      {
        "code": "HUA",
        "name": "Huaytara",
        "districts": [
          {
            "code": "HUA-AYA",
            "name": "Ayaví",
            "zipCodes": [
              "09605"
            ]
          },
          {
            "code": "HUA-COR",
            "name": "Cordova",
            "zipCodes": [
              "09635"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huayacundo Arma",
            "zipCodes": [
              "09660"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huaytará",
            "zipCodes": [
              "09600"
            ]
          },
          {
            "code": "HUA-LAR",
            "name": "Laramarca",
            "zipCodes": [
              "09640"
            ]
          },
          {
            "code": "HUA-OCO",
            "name": "Ocoyo",
            "zipCodes": [
              "09650"
            ]
          },
          {
            "code": "HUA-PIL",
            "name": "Pilpichaca",
            "zipCodes": [
              "09520"
            ]
          },
          {
            "code": "HUA-QUE",
            "name": "Querco",
            "zipCodes": [
              "09645"
            ]
          },
          {
            "code": "HUA-QUI",
            "name": "Quito Arma",
            "zipCodes": [
              "09665"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "San Antonio de Cusicancha",
            "zipCodes": [
              "09670"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "San Francisco de Sangayaico",
            "zipCodes": [
              "09620"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "San isidro",
            "zipCodes": [
              "09630"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "Santiago de Chocorvos",
            "zipCodes": [
              "09625"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "Santiago de Quirahuara",
            "zipCodes": [
              "09655"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "Santo Domingo de Capillas",
            "zipCodes": [
              "09615"
            ]
          },
          {
            "code": "HUA-TAM",
            "name": "Tambo",
            "zipCodes": [
              "09610"
            ]
          }
        ],
        "cities": [
          {
            "code": "HUA-AYA",
            "name": "Ayavi",
            "zipCodes": [
              "09605"
            ]
          },
          {
            "code": "HUA-COR",
            "name": "Cordova",
            "zipCodes": [
              "09635"
            ]
          },
          {
            "code": "HUA-CUS",
            "name": "Cusicancha",
            "zipCodes": [
              "09670"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huayacundo Arma",
            "zipCodes": [
              "09660"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huaytara",
            "zipCodes": [
              "09600"
            ]
          },
          {
            "code": "HUA-LAR",
            "name": "Laramarca",
            "zipCodes": [
              "09640"
            ]
          },
          {
            "code": "HUA-OCO",
            "name": "Ocoyo",
            "zipCodes": [
              "09650"
            ]
          },
          {
            "code": "HUA-PIL",
            "name": "Pilpichaca",
            "zipCodes": [
              "09520"
            ]
          },
          {
            "code": "HUA-QUE",
            "name": "Querco",
            "zipCodes": [
              "09645"
            ]
          },
          {
            "code": "HUA-QUI",
            "name": "Quito Arma",
            "zipCodes": [
              "09665"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "San Francisco de Sangallaico",
            "zipCodes": [
              "09620"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "San Juan de Huirpacancha",
            "zipCodes": [
              "09630"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "Santiago de Chocorvos",
            "zipCodes": [
              "09625"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "Santiago de Quirahuara",
            "zipCodes": [
              "09655"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "Santo Domingo de Capillas",
            "zipCodes": [
              "09615"
            ]
          },
          {
            "code": "HUA-TAM",
            "name": "Tambo",
            "zipCodes": [
              "09610"
            ]
          }
        ]
      },
      {
        "code": "TAY",
        "name": "Tayacaja",
        "districts": [
          {
            "code": "TAY-ACO",
            "name": "Acostambo",
            "zipCodes": [
              "09125"
            ]
          },
          {
            "code": "TAY-ACR",
            "name": "Acraquia",
            "zipCodes": [
              "09145",
              "09146"
            ]
          },
          {
            "code": "TAY-AHU",
            "name": "Ahuaycha",
            "zipCodes": [
              "09150",
              "09151"
            ]
          },
          {
            "code": "CHU-COL",
            "name": "Colcabamba",
            "zipCodes": [
              "09320",
              "09321"
            ]
          },
          {
            "code": "TAY-DAN",
            "name": "Daniel Hernandez",
            "zipCodes": [
              "09160",
              "09161"
            ]
          },
          {
            "code": "TAY-HUA",
            "name": "Huachocolpa",
            "zipCodes": [
              "09250"
            ]
          },
          {
            "code": "TAY-HUA",
            "name": "Huaribamba",
            "zipCodes": [
              "09140",
              "09141"
            ]
          },
          {
            "code": "TAY-PAM",
            "name": "Pampas",
            "zipCodes": [
              "09155",
              "09156"
            ]
          },
          {
            "code": "TAY-PAZ",
            "name": "Pazos",
            "zipCodes": [
              "09135",
              "09136"
            ]
          },
          {
            "code": "TAY-QUI",
            "name": "Quishuar",
            "zipCodes": [
              "09210"
            ]
          },
          {
            "code": "TAY-SAL",
            "name": "Salcabamba",
            "zipCodes": [
              "09200",
              "09201"
            ]
          },
          {
            "code": "TAY-SAL",
            "name": "Salcahuasi",
            "zipCodes": [
              "09220"
            ]
          },
          {
            "code": "TAY-SAN",
            "name": "San Marcos de Rocchac",
            "zipCodes": [
              "09230"
            ]
          },
          {
            "code": "TAY-SUR",
            "name": "Surcubamba",
            "zipCodes": [
              "09240",
              "09241"
            ]
          },
          {
            "code": "TAY-TIN",
            "name": "Tintay Puncu",
            "zipCodes": [
              "09260",
              "09261"
            ]
          },
          {
            "code": "TAY-ÑAH",
            "name": "Ñahuimpuquio",
            "zipCodes": [
              "09130"
            ]
          }
        ],
        "cities": [
          {
            "code": "TAY-ACO",
            "name": "Acostambo",
            "zipCodes": [
              "09125"
            ]
          },
          {
            "code": "TAY-ACR",
            "name": "Acraquia",
            "zipCodes": [
              "09145",
              "09146"
            ]
          },
          {
            "code": "TAY-AHU",
            "name": "Ahuaycha",
            "zipCodes": [
              "09150",
              "09151"
            ]
          },
          {
            "code": "CHU-COL",
            "name": "Colcabamba",
            "zipCodes": [
              "09320",
              "09321"
            ]
          },
          {
            "code": "TAY-HUA",
            "name": "Huachocolpa",
            "zipCodes": [
              "09250"
            ]
          },
          {
            "code": "TAY-HUA",
            "name": "Huaribamba",
            "zipCodes": [
              "09140",
              "09141"
            ]
          },
          {
            "code": "TAY-MAR",
            "name": "Mariscal Caceres",
            "zipCodes": [
              "09160",
              "09161"
            ]
          },
          {
            "code": "TAY-PAM",
            "name": "Pampas",
            "zipCodes": [
              "09155",
              "09156"
            ]
          },
          {
            "code": "TAY-PAZ",
            "name": "Pazos",
            "zipCodes": [
              "09135",
              "09136"
            ]
          },
          {
            "code": "TAY-QUI",
            "name": "Quishuar",
            "zipCodes": [
              "09210"
            ]
          },
          {
            "code": "TAY-SAL",
            "name": "Salcabamba",
            "zipCodes": [
              "09200",
              "09201"
            ]
          },
          {
            "code": "TAY-SAL",
            "name": "Salcahuasi",
            "zipCodes": [
              "09220"
            ]
          },
          {
            "code": "TAY-SAN",
            "name": "San Marcos de Rocchac",
            "zipCodes": [
              "09230"
            ]
          },
          {
            "code": "TAY-SUR",
            "name": "Surcubamba",
            "zipCodes": [
              "09240",
              "09241"
            ]
          },
          {
            "code": "TAY-TIN",
            "name": "Tintay",
            "zipCodes": [
              "09260",
              "09261"
            ]
          },
          {
            "code": "TAY-ÑAH",
            "name": "Ñahuimpuquio",
            "zipCodes": [
              "09130"
            ]
          }
        ]
      }
    ]
  },
  {
    "code": "HUA",
    "name": "Huanuco",
    "provinces": [
      {
        "code": "AMB",
        "name": "Ambo",
        "districts": [
          {
            "code": "AMB-AMB",
            "name": "Ambo",
            "zipCodes": [
              "10420",
              "10421"
            ]
          },
          {
            "code": "AMB-CAY",
            "name": "Cayna",
            "zipCodes": [
              "10460"
            ]
          },
          {
            "code": "AMB-COL",
            "name": "Colpas",
            "zipCodes": [
              "10470"
            ]
          },
          {
            "code": "AMB-CON",
            "name": "Conchamarca",
            "zipCodes": [
              "10400",
              "10401"
            ]
          },
          {
            "code": "AMB-HUA",
            "name": "Huacar",
            "zipCodes": [
              "10440",
              "10441"
            ]
          },
          {
            "code": "AMB-SAN",
            "name": "San Francisco",
            "zipCodes": [
              "10450"
            ]
          },
          {
            "code": "AMB-SAN",
            "name": "San Rafael",
            "zipCodes": [
              "10430",
              "10431"
            ]
          },
          {
            "code": "AMB-TOM",
            "name": "Tomay Kichwa",
            "zipCodes": [
              "10410"
            ]
          }
        ],
        "cities": [
          {
            "code": "AMB-AMB",
            "name": "Ambo",
            "zipCodes": [
              "10420",
              "10421"
            ]
          },
          {
            "code": "AMB-CAY",
            "name": "Cayna",
            "zipCodes": [
              "10460"
            ]
          },
          {
            "code": "AMB-COL",
            "name": "Colpas",
            "zipCodes": [
              "10470"
            ]
          },
          {
            "code": "AMB-CON",
            "name": "Conchamarca",
            "zipCodes": [
              "10400",
              "10401"
            ]
          },
          {
            "code": "AMB-HUA",
            "name": "Huacar",
            "zipCodes": [
              "10440",
              "10441"
            ]
          },
          {
            "code": "AMB-MOS",
            "name": "Mosca",
            "zipCodes": [
              "10450"
            ]
          },
          {
            "code": "AMB-SAN",
            "name": "San Rafael",
            "zipCodes": [
              "10430",
              "10431"
            ]
          },
          {
            "code": "AMB-TOM",
            "name": "Tomay Kichwa",
            "zipCodes": [
              "10410"
            ]
          }
        ]
      },
      {
        "code": "DOS",
        "name": "Dos de Mayo",
        "districts": [
          {
            "code": "HUA-CHU",
            "name": "Chuquis",
            "zipCodes": [
              "10740",
              "10741"
            ]
          },
          {
            "code": "DOS-LA ",
            "name": "La Unión",
            "zipCodes": [
              "10620",
              "10621"
            ]
          },
          {
            "code": "HUA-MAR",
            "name": "Marias",
            "zipCodes": [
              "10760",
              "10761"
            ]
          },
          {
            "code": "DOS-PAC",
            "name": "Pachas",
            "zipCodes": [
              "10600",
              "10601"
            ]
          },
          {
            "code": "HUA-QUI",
            "name": "Quivilla",
            "zipCodes": [
              "10755"
            ]
          },
          {
            "code": "DOS-RIP",
            "name": "Ripan",
            "zipCodes": [
              "10610",
              "10611"
            ]
          },
          {
            "code": "DOS-SHU",
            "name": "Shunqui",
            "zipCodes": [
              "10605"
            ]
          },
          {
            "code": "DOS-SIL",
            "name": "Sillapata",
            "zipCodes": [
              "10615"
            ]
          },
          {
            "code": "HUA-YAN",
            "name": "Yanas",
            "zipCodes": [
              "10745"
            ]
          }
        ],
        "cities": [
          {
            "code": "HUA-CHU",
            "name": "Chuquis",
            "zipCodes": [
              "10740",
              "10741"
            ]
          },
          {
            "code": "DOS-LA ",
            "name": "La Union",
            "zipCodes": [
              "10620",
              "10621"
            ]
          },
          {
            "code": "HUA-MAR",
            "name": "Marias",
            "zipCodes": [
              "10760",
              "10761"
            ]
          },
          {
            "code": "DOS-PAC",
            "name": "Pachas",
            "zipCodes": [
              "10600",
              "10601"
            ]
          },
          {
            "code": "HUA-QUI",
            "name": "Quivilla",
            "zipCodes": [
              "10755"
            ]
          },
          {
            "code": "DOS-RIP",
            "name": "Ripan",
            "zipCodes": [
              "10610",
              "10611"
            ]
          },
          {
            "code": "DOS-SHU",
            "name": "Shunqui",
            "zipCodes": [
              "10605"
            ]
          },
          {
            "code": "DOS-SIL",
            "name": "Sillapata",
            "zipCodes": [
              "10615"
            ]
          },
          {
            "code": "HUA-YAN",
            "name": "Yanas",
            "zipCodes": [
              "10745"
            ]
          }
        ]
      },
      {
        "code": "HUA",
        "name": "Huacaybamba",
        "districts": [
          {
            "code": "HUA-CAN",
            "name": "Canchabamba",
            "zipCodes": [
              "10860"
            ]
          },
          {
            "code": "HUA-COC",
            "name": "Cochabamba",
            "zipCodes": [
              "10830"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huacaybamba",
            "zipCodes": [
              "10840",
              "10841"
            ]
          },
          {
            "code": "HUA-PIN",
            "name": "Pinra",
            "zipCodes": [
              "10850",
              "10851"
            ]
          }
        ],
        "cities": [
          {
            "code": "HUA-CAN",
            "name": "Canchabamba",
            "zipCodes": [
              "10860"
            ]
          },
          {
            "code": "HUA-COC",
            "name": "Cochabamba",
            "zipCodes": [
              "10830"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huacaybamba",
            "zipCodes": [
              "10840",
              "10841"
            ]
          },
          {
            "code": "HUA-PIN",
            "name": "Pinra",
            "zipCodes": [
              "10850",
              "10851"
            ]
          }
        ]
      },
      {
        "code": "HUA",
        "name": "Huamalies",
        "districts": [
          {
            "code": "HUA-ARA",
            "name": "Arancay",
            "zipCodes": [
              "10820"
            ]
          },
          {
            "code": "HUA-CHA",
            "name": "Chavín de Pariarca",
            "zipCodes": [
              "10775"
            ]
          },
          {
            "code": "HUA-JAC",
            "name": "Jacas Grande",
            "zipCodes": [
              "10770",
              "10771"
            ]
          },
          {
            "code": "HUA-JIR",
            "name": "Jircan",
            "zipCodes": [
              "10810"
            ]
          },
          {
            "code": "HUA-LLA",
            "name": "Llata",
            "zipCodes": [
              "10641",
              "10660"
            ]
          },
          {
            "code": "HUA-MIR",
            "name": "Miraflores",
            "zipCodes": [
              "10680"
            ]
          },
          {
            "code": "HUA-MON",
            "name": "Monzón",
            "zipCodes": [
              "10800",
              "10801"
            ]
          },
          {
            "code": "HUA-PUN",
            "name": "Punchao",
            "zipCodes": [
              "10685"
            ]
          },
          {
            "code": "HUA-PUÑ",
            "name": "Puños",
            "zipCodes": [
              "10670"
            ]
          },
          {
            "code": "HUA-SIN",
            "name": "Singa",
            "zipCodes": [
              "10690"
            ]
          },
          {
            "code": "HUA-TAN",
            "name": "Tantamayo",
            "zipCodes": [
              "10780"
            ]
          }
        ],
        "cities": [
          {
            "code": "HUA-ARA",
            "name": "Arancay",
            "zipCodes": [
              "10820"
            ]
          },
          {
            "code": "HUA-CHA",
            "name": "Chavin de Pariarca",
            "zipCodes": [
              "10775"
            ]
          },
          {
            "code": "HUA-JAC",
            "name": "Jacas Grande",
            "zipCodes": [
              "10770",
              "10771"
            ]
          },
          {
            "code": "HUA-JIR",
            "name": "Jircan",
            "zipCodes": [
              "10810"
            ]
          },
          {
            "code": "HUA-LLA",
            "name": "Llata",
            "zipCodes": [
              "10641",
              "10660"
            ]
          },
          {
            "code": "HUA-MIR",
            "name": "Miraflores",
            "zipCodes": [
              "10680"
            ]
          },
          {
            "code": "HUA-MON",
            "name": "Monzon",
            "zipCodes": [
              "10800",
              "10801"
            ]
          },
          {
            "code": "HUA-PUN",
            "name": "Punchao",
            "zipCodes": [
              "10685"
            ]
          },
          {
            "code": "HUA-PUÑ",
            "name": "Puños",
            "zipCodes": [
              "10670"
            ]
          },
          {
            "code": "HUA-SIN",
            "name": "Singa",
            "zipCodes": [
              "10690"
            ]
          },
          {
            "code": "HUA-TAN",
            "name": "Tantamayo",
            "zipCodes": [
              "10780"
            ]
          }
        ]
      },
      {
        "code": "HUA",
        "name": "Huanuco",
        "districts": [
          {
            "code": "HUA-AMA",
            "name": "Amarilis",
            "zipCodes": [
              "10000",
              "10002",
              "10003"
            ]
          },
          {
            "code": "HUA-CHI",
            "name": "Chinchao",
            "zipCodes": [
              "10110",
              "10111"
            ]
          },
          {
            "code": "LEO-CHU",
            "name": "Churubamba",
            "zipCodes": [
              "10180",
              "10181"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huanuco",
            "zipCodes": [
              "10000",
              "10001",
              "10003"
            ]
          },
          {
            "code": "AMB-MAR",
            "name": "Margos",
            "zipCodes": [
              "10520",
              "10521"
            ]
          },
          {
            "code": "HUA-PIL",
            "name": "Pillco Marca",
            "zipCodes": [
              "10000",
              "10003"
            ]
          },
          {
            "code": "HUA-QUI",
            "name": "Quisqui",
            "zipCodes": [
              "10700",
              "10701"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "San Francisco de Cayran",
            "zipCodes": [
              "10000",
              "10031"
            ]
          },
          {
            "code": "AMB-SAN",
            "name": "San Pedro de Chaulan",
            "zipCodes": [
              "10510",
              "10511"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "Santa María del Valle",
            "zipCodes": [
              "10100",
              "10101"
            ]
          },
          {
            "code": "AMB-YUR",
            "name": "Yurumayo",
            "zipCodes": [
              "10500"
            ]
          }
        ],
        "cities": [
          {
            "code": "HUA-ACO",
            "name": "Acomayo",
            "zipCodes": [
              "10110",
              "10111"
            ]
          },
          {
            "code": "HUA-CAY",
            "name": "Cayhuayna",
            "zipCodes": [
              "10000",
              "10003"
            ]
          },
          {
            "code": "HUA-CAY",
            "name": "Cayran",
            "zipCodes": [
              "10000",
              "10031"
            ]
          },
          {
            "code": "AMB-CHA",
            "name": "Chaulan",
            "zipCodes": [
              "10510",
              "10511"
            ]
          },
          {
            "code": "LEO-CHU",
            "name": "Churubamba",
            "zipCodes": [
              "10180",
              "10181"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huancapallac",
            "zipCodes": [
              "10700",
              "10701"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huanuco",
            "zipCodes": [
              "10000",
              "10001",
              "10003"
            ]
          },
          {
            "code": "AMB-MAR",
            "name": "Margos",
            "zipCodes": [
              "10520",
              "10521"
            ]
          },
          {
            "code": "HUA-PAU",
            "name": "Paucarbamba",
            "zipCodes": [
              "10000",
              "10002",
              "10003"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "Santa Maria del Valle",
            "zipCodes": [
              "10100",
              "10101"
            ]
          },
          {
            "code": "AMB-YAR",
            "name": "Yarumayo",
            "zipCodes": [
              "10500"
            ]
          }
        ]
      },
      {
        "code": "LAU",
        "name": "Lauricocha",
        "districts": [
          {
            "code": "DOS-BAÑ",
            "name": "Baños",
            "zipCodes": [
              "10631",
              "10640"
            ]
          },
          {
            "code": "LAU-JES",
            "name": "Jesús",
            "zipCodes": [
              "10530",
              "10531"
            ]
          },
          {
            "code": "LAU-JIV",
            "name": "Jivia",
            "zipCodes": [
              "10550"
            ]
          },
          {
            "code": "HUA-QUE",
            "name": "Queropalca",
            "zipCodes": [
              "10650"
            ]
          },
          {
            "code": "DOS-RON",
            "name": "Rondos",
            "zipCodes": [
              "10626",
              "10630"
            ]
          },
          {
            "code": "LAU-SAN",
            "name": "San Francisco de Asís",
            "zipCodes": [
              "10560"
            ]
          },
          {
            "code": "LAU-SAN",
            "name": "San Miguel de Cauri",
            "zipCodes": [
              "10540",
              "10541"
            ]
          }
        ],
        "cities": [
          {
            "code": "DOS-BAÑ",
            "name": "Baños",
            "zipCodes": [
              "10631",
              "10640"
            ]
          },
          {
            "code": "LAU-CAU",
            "name": "Cauri",
            "zipCodes": [
              "10540",
              "10541"
            ]
          },
          {
            "code": "LAU-HUA",
            "name": "Huarin",
            "zipCodes": [
              "10560"
            ]
          },
          {
            "code": "LAU-JES",
            "name": "Jesus",
            "zipCodes": [
              "10530",
              "10531"
            ]
          },
          {
            "code": "LAU-JIV",
            "name": "Jivia",
            "zipCodes": [
              "10550"
            ]
          },
          {
            "code": "HUA-QUE",
            "name": "Queropalca",
            "zipCodes": [
              "10650"
            ]
          },
          {
            "code": "DOS-RON",
            "name": "Rondos",
            "zipCodes": [
              "10626",
              "10630"
            ]
          }
        ]
      },
      {
        "code": "LEO",
        "name": "Leoncio Prado",
        "districts": [
          {
            "code": "LEO-DAN",
            "name": "Daniel Alomias Robles",
            "zipCodes": [
              "10150",
              "10151"
            ]
          },
          {
            "code": "LEO-HER",
            "name": "Hermilio Valdizán",
            "zipCodes": [
              "10160"
            ]
          },
          {
            "code": "LEO-JOS",
            "name": "José Crespo y Castillo",
            "zipCodes": [
              "10170",
              "10171"
            ]
          },
          {
            "code": "LEO-LUY",
            "name": "Luyando",
            "zipCodes": [
              "10140",
              "10141"
            ]
          },
          {
            "code": "LEO-MAR",
            "name": "Mariano Damaso Beraún",
            "zipCodes": [
              "10120",
              "10121"
            ]
          },
          {
            "code": "LEO-RUP",
            "name": "Rupa Rupa",
            "zipCodes": [
              "10130",
              "10131"
            ]
          }
        ],
        "cities": [
          {
            "code": "LEO-AUC",
            "name": "Aucayacu",
            "zipCodes": [
              "10170",
              "10171"
            ]
          },
          {
            "code": "LEO-DAN",
            "name": "Daniel Alomias Robles (Pumahuasi)",
            "zipCodes": [
              "10150",
              "10151"
            ]
          },
          {
            "code": "LEO-HER",
            "name": "Hermilio Valdizan",
            "zipCodes": [
              "10160"
            ]
          },
          {
            "code": "LEO-LAS",
            "name": "Las Palmas",
            "zipCodes": [
              "10120",
              "10121"
            ]
          },
          {
            "code": "LEO-NAR",
            "name": "Naranjillo",
            "zipCodes": [
              "10140",
              "10141"
            ]
          },
          {
            "code": "LEO-TIN",
            "name": "Tingo Maria",
            "zipCodes": [
              "10130",
              "10131"
            ]
          }
        ]
      },
      {
        "code": "MAR",
        "name": "Marañon",
        "districts": [
          {
            "code": "MAR-CHO",
            "name": "Cholón",
            "zipCodes": [
              "10890",
              "10891"
            ]
          },
          {
            "code": "MAR-HUA",
            "name": "Huacrachuco",
            "zipCodes": [
              "10880",
              "10881"
            ]
          },
          {
            "code": "MAR-SAN",
            "name": "San Buenaventura",
            "zipCodes": [
              "10870"
            ]
          }
        ],
        "cities": [
          {
            "code": "MAR-HUA",
            "name": "Huacrachuco",
            "zipCodes": [
              "10880",
              "10881"
            ]
          },
          {
            "code": "MAR-SAN",
            "name": "San Buenaventura",
            "zipCodes": [
              "10870"
            ]
          },
          {
            "code": "MAR-SAN",
            "name": "San Pedro de Chonta",
            "zipCodes": [
              "10890",
              "10891"
            ]
          }
        ]
      },
      {
        "code": "PAC",
        "name": "Pachitea",
        "districts": [
          {
            "code": "PAC-CHA",
            "name": "Chaglla",
            "zipCodes": [
              "10230",
              "10231"
            ]
          },
          {
            "code": "PAC-MOL",
            "name": "Molino",
            "zipCodes": [
              "10210",
              "10211"
            ]
          },
          {
            "code": "PAC-PAN",
            "name": "Panao",
            "zipCodes": [
              "10220",
              "10221"
            ]
          },
          {
            "code": "PAC-UMA",
            "name": "Umari",
            "zipCodes": [
              "10200",
              "10201"
            ]
          }
        ],
        "cities": [
          {
            "code": "PAC-CHA",
            "name": "Chaglla",
            "zipCodes": [
              "10230",
              "10231"
            ]
          },
          {
            "code": "PAC-MOL",
            "name": "Molinos",
            "zipCodes": [
              "10210",
              "10211"
            ]
          },
          {
            "code": "PAC-PAN",
            "name": "Panao",
            "zipCodes": [
              "10220",
              "10221"
            ]
          },
          {
            "code": "PAC-UMA",
            "name": "Umari (Tambillo)",
            "zipCodes": [
              "10200",
              "10201"
            ]
          }
        ]
      },
      {
        "code": "PUE",
        "name": "Puerto Inca",
        "districts": [
          {
            "code": "PUE-COD",
            "name": "Codo del Pozuzo",
            "zipCodes": [
              "10240",
              "10241"
            ]
          },
          {
            "code": "PUE-HON",
            "name": "Honoría",
            "zipCodes": [
              "10350",
              "10351"
            ]
          },
          {
            "code": "PUE-PUE",
            "name": "Puerto Inca",
            "zipCodes": [
              "10260",
              "10261"
            ]
          },
          {
            "code": "PUE-TOU",
            "name": "Tournavista",
            "zipCodes": [
              "10300",
              "10301"
            ]
          },
          {
            "code": "PUE-YUY",
            "name": "Yuyapichis",
            "zipCodes": [
              "10250",
              "10251"
            ]
          }
        ],
        "cities": [
          {
            "code": "PUE-COD",
            "name": "Codo del Pozuzo",
            "zipCodes": [
              "10240",
              "10241"
            ]
          },
          {
            "code": "PUE-HON",
            "name": "Honoria",
            "zipCodes": [
              "10350",
              "10351"
            ]
          },
          {
            "code": "PUE-PUE",
            "name": "Puerto Inca",
            "zipCodes": [
              "10260",
              "10261"
            ]
          },
          {
            "code": "PUE-TOU",
            "name": "Tournavista",
            "zipCodes": [
              "10300",
              "10301"
            ]
          },
          {
            "code": "PUE-YUY",
            "name": "Yuyapichis",
            "zipCodes": [
              "10250",
              "10251"
            ]
          }
        ]
      },
      {
        "code": "YAR",
        "name": "Yarowilca",
        "districts": [
          {
            "code": "HUA-APA",
            "name": "Aparicio Pomares",
            "zipCodes": [
              "10730",
              "10731"
            ]
          },
          {
            "code": "YAR-CAH",
            "name": "Cahuac",
            "zipCodes": [
              "10590"
            ]
          },
          {
            "code": "YAR-CHA",
            "name": "Chacabamba",
            "zipCodes": [
              "10580"
            ]
          },
          {
            "code": "HUA-CHA",
            "name": "Chavinillo",
            "zipCodes": [
              "10710",
              "10711"
            ]
          },
          {
            "code": "YAR-CHO",
            "name": "Choras",
            "zipCodes": [
              "10570"
            ]
          },
          {
            "code": "HUA-JAC",
            "name": "Jacas Chico",
            "zipCodes": [
              "10705"
            ]
          },
          {
            "code": "HUA-OBA",
            "name": "Obas",
            "zipCodes": [
              "10720",
              "10721"
            ]
          },
          {
            "code": "HUA-PAM",
            "name": "Pampamarca",
            "zipCodes": [
              "10750"
            ]
          }
        ],
        "cities": [
          {
            "code": "YAR-CAH",
            "name": "Cahuac",
            "zipCodes": [
              "10590"
            ]
          },
          {
            "code": "YAR-CHA",
            "name": "Chacabamba",
            "zipCodes": [
              "10580"
            ]
          },
          {
            "code": "HUA-CHA",
            "name": "Chavinillo",
            "zipCodes": [
              "10710",
              "10711"
            ]
          },
          {
            "code": "YAR-CHO",
            "name": "Choras",
            "zipCodes": [
              "10570"
            ]
          },
          {
            "code": "HUA-CHU",
            "name": "Chupan",
            "zipCodes": [
              "10730",
              "10731"
            ]
          },
          {
            "code": "HUA-OBA",
            "name": "Obas",
            "zipCodes": [
              "10720",
              "10721"
            ]
          },
          {
            "code": "HUA-PAM",
            "name": "Pampamarca",
            "zipCodes": [
              "10750"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "San Cristobal de Jacas Chico",
            "zipCodes": [
              "10705"
            ]
          }
        ]
      }
    ]
  },
  {
    "code": "ICA",
    "name": "Ica",
    "provinces": [
      {
        "code": "CHI",
        "name": "Chincha",
        "districts": [
          {
            "code": "CHI-ALT",
            "name": "Alto Larán",
            "zipCodes": [
              "11770",
              "11771"
            ]
          },
          {
            "code": "CHI-CHA",
            "name": "Chavín",
            "zipCodes": [
              "11780"
            ]
          },
          {
            "code": "CHI-CHI",
            "name": "Chincha Alta",
            "zipCodes": [
              "11701",
              "11702",
              "11703"
            ]
          },
          {
            "code": "CHI-CHI",
            "name": "Chincha Baja",
            "zipCodes": [
              "11750",
              "11751"
            ]
          },
          {
            "code": "CHI-EL ",
            "name": "El Carmen",
            "zipCodes": [
              "11740",
              "11741"
            ]
          },
          {
            "code": "CHI-GRO",
            "name": "Grocio Prado",
            "zipCodes": [
              "11700",
              "11703"
            ]
          },
          {
            "code": "CHI-PUE",
            "name": "Pueblo Nuevo",
            "zipCodes": [
              "11701",
              "11703"
            ]
          },
          {
            "code": "CHI-SAN",
            "name": "San Juan de Yanac",
            "zipCodes": [
              "11850"
            ]
          },
          {
            "code": "CHI-SAN",
            "name": "San Pedro de Huacarpana",
            "zipCodes": [
              "11800"
            ]
          },
          {
            "code": "CHI-SUN",
            "name": "Sunampe",
            "zipCodes": [
              "11700",
              "11702"
            ]
          },
          {
            "code": "CHI-TAM",
            "name": "Tambo de Mora",
            "zipCodes": [
              "11760"
            ]
          }
        ],
        "cities": [
          {
            "code": "CHI-ALT",
            "name": "Alto Laran",
            "zipCodes": [
              "11770",
              "11771"
            ]
          },
          {
            "code": "CHI-CHA",
            "name": "Chavin",
            "zipCodes": [
              "11780"
            ]
          },
          {
            "code": "CHI-CHI",
            "name": "Chincha Alta",
            "zipCodes": [
              "11701",
              "11702",
              "11703"
            ]
          },
          {
            "code": "CHI-CHI",
            "name": "Chincha Baja",
            "zipCodes": [
              "11750",
              "11751"
            ]
          },
          {
            "code": "CHI-EL ",
            "name": "El Carmen",
            "zipCodes": [
              "11740",
              "11741"
            ]
          },
          {
            "code": "CHI-PUE",
            "name": "Pueblo Nuevo",
            "zipCodes": [
              "11701",
              "11703"
            ]
          },
          {
            "code": "CHI-SAN",
            "name": "San Juan de Yanac",
            "zipCodes": [
              "11850"
            ]
          },
          {
            "code": "CHI-SAN",
            "name": "San Pedro",
            "zipCodes": [
              "11700",
              "11703"
            ]
          },
          {
            "code": "CHI-SAN",
            "name": "San Pedro de Huacarpana",
            "zipCodes": [
              "11800"
            ]
          },
          {
            "code": "CHI-SUN",
            "name": "Sunampe",
            "zipCodes": [
              "11700",
              "11702"
            ]
          },
          {
            "code": "CHI-TAM",
            "name": "Tambo de Mora",
            "zipCodes": [
              "11760"
            ]
          }
        ]
      },
      {
        "code": "ICA",
        "name": "Ica",
        "districts": [
          {
            "code": "ICA-ICA",
            "name": "Ica",
            "zipCodes": [
              "11000",
              "11001",
              "11002",
              "11004"
            ]
          },
          {
            "code": "ICA-LA ",
            "name": "La Tinguiña",
            "zipCodes": [
              "11000",
              "11002",
              "11003"
            ]
          },
          {
            "code": "ICA-LOS",
            "name": "Los Aquijes",
            "zipCodes": [
              "11000",
              "11061"
            ]
          },
          {
            "code": "ICA-OCU",
            "name": "Ocucaje",
            "zipCodes": [
              "11240"
            ]
          },
          {
            "code": "ICA-PAC",
            "name": "Pachacutec",
            "zipCodes": [
              "11220",
              "11221"
            ]
          },
          {
            "code": "ICA-PAR",
            "name": "Parcona",
            "zipCodes": [
              "11000",
              "11001",
              "11003"
            ]
          },
          {
            "code": "ICA-PUE",
            "name": "Pueblo Nuevo",
            "zipCodes": [
              "11200"
            ]
          },
          {
            "code": "NAZ-SAL",
            "name": "Salas",
            "zipCodes": [
              "11500",
              "11501"
            ]
          },
          {
            "code": "ICA-SAN",
            "name": "San José de los Molinos",
            "zipCodes": [
              "11100",
              "11101"
            ]
          },
          {
            "code": "ICA-SAN",
            "name": "San Juan Bautista",
            "zipCodes": [
              "11000",
              "11002"
            ]
          },
          {
            "code": "ICA-SAN",
            "name": "Santiago",
            "zipCodes": [
              "11230",
              "11231"
            ]
          },
          {
            "code": "ICA-SUB",
            "name": "Subtanjalla",
            "zipCodes": [
              "11000",
              "11004"
            ]
          },
          {
            "code": "ICA-TAT",
            "name": "Tate",
            "zipCodes": [
              "11210"
            ]
          },
          {
            "code": "ICA-YAU",
            "name": "Yauca del Rosario",
            "zipCodes": [
              "11260"
            ]
          }
        ],
        "cities": [
          {
            "code": "NAZ-GUA",
            "name": "Guadalupe",
            "zipCodes": [
              "11500",
              "11501"
            ]
          },
          {
            "code": "ICA-ICA",
            "name": "Ica",
            "zipCodes": [
              "11000",
              "11001",
              "11002",
              "11004"
            ]
          },
          {
            "code": "ICA-LA ",
            "name": "La Tinguiña",
            "zipCodes": [
              "11000",
              "11002",
              "11003"
            ]
          },
          {
            "code": "ICA-LOS",
            "name": "Los Aquijes",
            "zipCodes": [
              "11000",
              "11061"
            ]
          },
          {
            "code": "ICA-OCU",
            "name": "Ocucaje",
            "zipCodes": [
              "11240"
            ]
          },
          {
            "code": "ICA-PAM",
            "name": "Pampa de Tate",
            "zipCodes": [
              "11220",
              "11221"
            ]
          },
          {
            "code": "ICA-PAM",
            "name": "Pampahuasi",
            "zipCodes": [
              "11260"
            ]
          },
          {
            "code": "ICA-PAR",
            "name": "Parcona",
            "zipCodes": [
              "11000",
              "11001",
              "11003"
            ]
          },
          {
            "code": "ICA-PUE",
            "name": "Pueblo Nuevo",
            "zipCodes": [
              "11200"
            ]
          },
          {
            "code": "ICA-SAN",
            "name": "San Jose de los Molinos",
            "zipCodes": [
              "11100",
              "11101"
            ]
          },
          {
            "code": "ICA-SAN",
            "name": "San Juan Bautista",
            "zipCodes": [
              "11000",
              "11002"
            ]
          },
          {
            "code": "ICA-SAN",
            "name": "Santiago",
            "zipCodes": [
              "11230",
              "11231"
            ]
          },
          {
            "code": "ICA-SUB",
            "name": "Subtanjalla",
            "zipCodes": [
              "11000",
              "11004"
            ]
          },
          {
            "code": "ICA-TAT",
            "name": "Tate de la Capilla",
            "zipCodes": [
              "11210"
            ]
          }
        ]
      },
      {
        "code": "NAZ",
        "name": "Nazca",
        "districts": [
          {
            "code": "NAZ-CHA",
            "name": "Changuillo",
            "zipCodes": [
              "11340"
            ]
          },
          {
            "code": "NAZ-EL ",
            "name": "El Ingenio",
            "zipCodes": [
              "11350"
            ]
          },
          {
            "code": "NAZ-MAR",
            "name": "Marcona",
            "zipCodes": [
              "11420",
              "11421"
            ]
          },
          {
            "code": "NAZ-NAZ",
            "name": "Nazca",
            "zipCodes": [
              "11400",
              "11401"
            ]
          },
          {
            "code": "NAZ-VIS",
            "name": "Vista Alegre",
            "zipCodes": [
              "11400",
              "11401"
            ]
          }
        ],
        "cities": [
          {
            "code": "NAZ-CHA",
            "name": "Changuillo",
            "zipCodes": [
              "11340"
            ]
          },
          {
            "code": "NAZ-EL ",
            "name": "El Ingenio",
            "zipCodes": [
              "11350"
            ]
          },
          {
            "code": "NAZ-NAZ",
            "name": "Nazca",
            "zipCodes": [
              "11400",
              "11401"
            ]
          },
          {
            "code": "NAZ-SAN",
            "name": "San Juan",
            "zipCodes": [
              "11420",
              "11421"
            ]
          },
          {
            "code": "NAZ-VIS",
            "name": "Vista Alegre",
            "zipCodes": [
              "11400",
              "11401"
            ]
          }
        ]
      },
      {
        "code": "PAL",
        "name": "Palpa",
        "districts": [
          {
            "code": "NAZ-LLI",
            "name": "Llipata",
            "zipCodes": [
              "11360"
            ]
          },
          {
            "code": "PAL-PAL",
            "name": "Palpa",
            "zipCodes": [
              "11330",
              "11331"
            ]
          },
          {
            "code": "PAL-RÍO",
            "name": "Río Grande",
            "zipCodes": [
              "11320"
            ]
          },
          {
            "code": "PAL-SAN",
            "name": "Santa Cruz",
            "zipCodes": [
              "11300"
            ]
          },
          {
            "code": "PAL-TIB",
            "name": "Tibillo",
            "zipCodes": [
              "11310"
            ]
          }
        ],
        "cities": [
          {
            "code": "NAZ-LLI",
            "name": "Llipata",
            "zipCodes": [
              "11360"
            ]
          },
          {
            "code": "PAL-PAL",
            "name": "Palpa",
            "zipCodes": [
              "11330",
              "11331"
            ]
          },
          {
            "code": "PAL-RIO",
            "name": "Rio Grande",
            "zipCodes": [
              "11320"
            ]
          },
          {
            "code": "PAL-SAN",
            "name": "Santa Cruz",
            "zipCodes": [
              "11300"
            ]
          },
          {
            "code": "PAL-TIB",
            "name": "Tibillo",
            "zipCodes": [
              "11310"
            ]
          }
        ]
      },
      {
        "code": "PIS",
        "name": "Pisco",
        "districts": [
          {
            "code": "PIS-HUA",
            "name": "Huancano",
            "zipCodes": [
              "11660"
            ]
          },
          {
            "code": "PIS-HUM",
            "name": "Humay",
            "zipCodes": [
              "11650",
              "11651"
            ]
          },
          {
            "code": "PIS-IND",
            "name": "Independencia",
            "zipCodes": [
              "11640",
              "11641"
            ]
          },
          {
            "code": "PIS-PAR",
            "name": "Paracas",
            "zipCodes": [
              "11550"
            ]
          },
          {
            "code": "PIS-PIS",
            "name": "Pisco",
            "zipCodes": [
              "11600",
              "11601"
            ]
          },
          {
            "code": "PIS-SAN",
            "name": "San Andres",
            "zipCodes": [
              "11600",
              "11601"
            ]
          },
          {
            "code": "PIS-SAN",
            "name": "San Clemente",
            "zipCodes": [
              "11630",
              "11631"
            ]
          },
          {
            "code": "PIS-TUP",
            "name": "Tupac Amaru Inca",
            "zipCodes": [
              "11620",
              "11621"
            ]
          }
        ],
        "cities": [
          {
            "code": "PIS-HUA",
            "name": "Huancano",
            "zipCodes": [
              "11660"
            ]
          },
          {
            "code": "PIS-HUM",
            "name": "Humay",
            "zipCodes": [
              "11650",
              "11651"
            ]
          },
          {
            "code": "PIS-IND",
            "name": "Independencia",
            "zipCodes": [
              "11640",
              "11641"
            ]
          },
          {
            "code": "PIS-PAR",
            "name": "Paracas",
            "zipCodes": [
              "11550"
            ]
          },
          {
            "code": "PIS-PIS",
            "name": "Pisco",
            "zipCodes": [
              "11600",
              "11601"
            ]
          },
          {
            "code": "PIS-SAN",
            "name": "San Andres",
            "zipCodes": [
              "11600",
              "11601"
            ]
          },
          {
            "code": "PIS-SAN",
            "name": "San Clemente",
            "zipCodes": [
              "11630",
              "11631"
            ]
          },
          {
            "code": "PIS-TUP",
            "name": "Tupac Amaru",
            "zipCodes": [
              "11620",
              "11621"
            ]
          }
        ]
      }
    ]
  },
  {
    "code": "JUN",
    "name": "Junín",
    "provinces": [
      {
        "code": "CHA",
        "name": "Chanchamayo",
        "districts": [
          {
            "code": "CHA-CHA",
            "name": "Chanchamayo",
            "zipCodes": [
              "12855",
              "12856"
            ]
          },
          {
            "code": "CHA-PER",
            "name": "Perené",
            "zipCodes": [
              "12865",
              "12867"
            ]
          },
          {
            "code": "CHA-PIC",
            "name": "Pichanaqui",
            "zipCodes": [
              "12865",
              "12866"
            ]
          },
          {
            "code": "CHA-SAN",
            "name": "San Luis de Shuaro",
            "zipCodes": [
              "12860",
              "12861"
            ]
          },
          {
            "code": "CHA-SAN",
            "name": "San Ramón",
            "zipCodes": [
              "12840",
              "12841"
            ]
          },
          {
            "code": "CHA-VIT",
            "name": "Vitoc",
            "zipCodes": [
              "12845"
            ]
          }
        ],
        "cities": [
          {
            "code": "CHA-BAJ",
            "name": "Bajo Pichanaqui",
            "zipCodes": [
              "12865",
              "12866"
            ]
          },
          {
            "code": "CHA-LA ",
            "name": "La Merced",
            "zipCodes": [
              "12855",
              "12856"
            ]
          },
          {
            "code": "CHA-PER",
            "name": "Perene",
            "zipCodes": [
              "12865",
              "12867"
            ]
          },
          {
            "code": "CHA-PUC",
            "name": "Pucara",
            "zipCodes": [
              "12845"
            ]
          },
          {
            "code": "CHA-SAN",
            "name": "San Luis de Shuaro",
            "zipCodes": [
              "12860",
              "12861"
            ]
          },
          {
            "code": "CHA-SAN",
            "name": "San Ramon",
            "zipCodes": [
              "12840",
              "12841"
            ]
          }
        ]
      },
      {
        "code": "CHU",
        "name": "Chupaca",
        "districts": [
          {
            "code": "CHU-AHU",
            "name": "Ahuac",
            "zipCodes": [
              "12465",
              "12466"
            ]
          },
          {
            "code": "CHU-CHO",
            "name": "Chongos Bajo",
            "zipCodes": [
              "12430"
            ]
          },
          {
            "code": "CHU-CHU",
            "name": "Chupaca",
            "zipCodes": [
              "12455",
              "12456"
            ]
          },
          {
            "code": "CHU-HUA",
            "name": "Huachac",
            "zipCodes": [
              "12480"
            ]
          },
          {
            "code": "CHU-HUA",
            "name": "Huamancaca Chico",
            "zipCodes": [
              "12425"
            ]
          },
          {
            "code": "CHU-SAN",
            "name": "San Juan de Jarpa",
            "zipCodes": [
              "12475"
            ]
          },
          {
            "code": "CHU-SAN",
            "name": "San Juan de Yscos",
            "zipCodes": [
              "12460"
            ]
          },
          {
            "code": "CHU-TRE",
            "name": "Tres de Diciembre",
            "zipCodes": [
              "12428"
            ]
          },
          {
            "code": "CHU-YAN",
            "name": "Yanacancha",
            "zipCodes": [
              "12470"
            ]
          }
        ],
        "cities": [
          {
            "code": "CHU-AHU",
            "name": "Ahuac",
            "zipCodes": [
              "12465",
              "12466"
            ]
          },
          {
            "code": "CHU-CHO",
            "name": "Chongos Bajo",
            "zipCodes": [
              "12430"
            ]
          },
          {
            "code": "CHU-CHU",
            "name": "Chupaca",
            "zipCodes": [
              "12455",
              "12456"
            ]
          },
          {
            "code": "CHU-HUA",
            "name": "Huachac",
            "zipCodes": [
              "12480"
            ]
          },
          {
            "code": "CHU-HUA",
            "name": "Huamancaca Chico",
            "zipCodes": [
              "12425"
            ]
          },
          {
            "code": "CHU-ISC",
            "name": "Iscos",
            "zipCodes": [
              "12460"
            ]
          },
          {
            "code": "CHU-JAR",
            "name": "Jarpa",
            "zipCodes": [
              "12475"
            ]
          },
          {
            "code": "CHU-TRE",
            "name": "Tres de Diciembre",
            "zipCodes": [
              "12428"
            ]
          },
          {
            "code": "CHU-YAN",
            "name": "Yanacancha",
            "zipCodes": [
              "12470"
            ]
          }
        ]
      },
      {
        "code": "CON",
        "name": "Concepción",
        "districts": [
          {
            "code": "CHU-ACO",
            "name": "Aco",
            "zipCodes": [
              "12510"
            ]
          },
          {
            "code": "JAU-AND",
            "name": "Andamarca",
            "zipCodes": [
              "12235",
              "12236"
            ]
          },
          {
            "code": "CHU-CHA",
            "name": "Chambará",
            "zipCodes": [
              "12490"
            ]
          },
          {
            "code": "JAU-COC",
            "name": "Cochas",
            "zipCodes": [
              "12225"
            ]
          },
          {
            "code": "JAU-COM",
            "name": "Comas",
            "zipCodes": [
              "12220",
              "12221"
            ]
          },
          {
            "code": "CON-CON",
            "name": "Concepción",
            "zipCodes": [
              "12125",
              "12126"
            ]
          },
          {
            "code": "JAU-HER",
            "name": "Heroinas Toledo",
            "zipCodes": [
              "12215"
            ]
          },
          {
            "code": "CHU-MAN",
            "name": "Manzanares",
            "zipCodes": [
              "12485"
            ]
          },
          {
            "code": "JAU-MAR",
            "name": "Mariscal Castilla",
            "zipCodes": [
              "12230"
            ]
          },
          {
            "code": "CON-MAT",
            "name": "Matahuasi",
            "zipCodes": [
              "12135",
              "12136"
            ]
          },
          {
            "code": "CHU-MIT",
            "name": "Mito",
            "zipCodes": [
              "12505"
            ]
          },
          {
            "code": "CON-NUE",
            "name": "Nueve de Julio",
            "zipCodes": [
              "12130"
            ]
          },
          {
            "code": "CHU-ORC",
            "name": "Orcotuna",
            "zipCodes": [
              "12504"
            ]
          },
          {
            "code": "CHU-SAN",
            "name": "San José de Quero",
            "zipCodes": [
              "12495",
              "12496"
            ]
          },
          {
            "code": "JAU-SAN",
            "name": "Santa Rosa de Ocopa",
            "zipCodes": [
              "12200"
            ]
          }
        ],
        "cities": [
          {
            "code": "CHU-ACO",
            "name": "Aco",
            "zipCodes": [
              "12510"
            ]
          },
          {
            "code": "JAU-AND",
            "name": "Andamarca",
            "zipCodes": [
              "12235",
              "12236"
            ]
          },
          {
            "code": "CHU-CHA",
            "name": "Chambara",
            "zipCodes": [
              "12490"
            ]
          },
          {
            "code": "JAU-COC",
            "name": "Cochas",
            "zipCodes": [
              "12225"
            ]
          },
          {
            "code": "JAU-COM",
            "name": "Comas",
            "zipCodes": [
              "12220",
              "12221"
            ]
          },
          {
            "code": "CON-CON",
            "name": "Concepcion",
            "zipCodes": [
              "12125",
              "12126"
            ]
          },
          {
            "code": "CON-MAT",
            "name": "Matahuasi",
            "zipCodes": [
              "12135",
              "12136"
            ]
          },
          {
            "code": "CHU-MIT",
            "name": "Mito",
            "zipCodes": [
              "12505"
            ]
          },
          {
            "code": "JAU-MUC",
            "name": "Mucllo",
            "zipCodes": [
              "12230"
            ]
          },
          {
            "code": "CHU-ORC",
            "name": "Orcotuna",
            "zipCodes": [
              "12504"
            ]
          },
          {
            "code": "JAU-SAN",
            "name": "San Antonio de Ocopa",
            "zipCodes": [
              "12215"
            ]
          },
          {
            "code": "CHU-SAN",
            "name": "San Jose de Quero",
            "zipCodes": [
              "12495",
              "12496"
            ]
          },
          {
            "code": "CHU-SAN",
            "name": "San Miguel",
            "zipCodes": [
              "12485"
            ]
          },
          {
            "code": "JAU-SAN",
            "name": "Santa Rosa",
            "zipCodes": [
              "12200"
            ]
          },
          {
            "code": "CON-SAN",
            "name": "Santo Domingo del Prado",
            "zipCodes": [
              "12130"
            ]
          }
        ]
      },
      {
        "code": "HUA",
        "name": "Huancayo",
        "districts": [
          {
            "code": "CHU-CAR",
            "name": "Carhuacallanga",
            "zipCodes": [
              "12442"
            ]
          },
          {
            "code": "CHU-CHA",
            "name": "Chacapampa",
            "zipCodes": [
              "12440"
            ]
          },
          {
            "code": "CHU-CHI",
            "name": "Chicche",
            "zipCodes": [
              "12451"
            ]
          },
          {
            "code": "HUA-CHI",
            "name": "Chilca",
            "zipCodes": [
              "12000",
              "12001",
              "12002",
              "12003",
              "12051"
            ]
          },
          {
            "code": "CHU-CHO",
            "name": "Chongos Alto",
            "zipCodes": [
              "12450"
            ]
          },
          {
            "code": "CHU-CHU",
            "name": "Chupuro",
            "zipCodes": [
              "12435"
            ]
          },
          {
            "code": "CHU-COL",
            "name": "Colca",
            "zipCodes": [
              "12436"
            ]
          },
          {
            "code": "SAT-CUL",
            "name": "Cullhuas",
            "zipCodes": [
              "12420"
            ]
          },
          {
            "code": "HUA-EL ",
            "name": "El Tambo",
            "zipCodes": [
              "12000",
              "12004",
              "12006",
              "12007"
            ]
          },
          {
            "code": "SAT-HUA",
            "name": "Huacrapuquio",
            "zipCodes": [
              "12419"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Hualhuas",
            "zipCodes": [
              "12105"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huancan",
            "zipCodes": [
              "12000",
              "12051"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huancayo",
            "zipCodes": [
              "12000",
              "12001",
              "12002",
              "12003",
              "12004"
            ]
          },
          {
            "code": "CHU-HUA",
            "name": "Huasicancha",
            "zipCodes": [
              "12445"
            ]
          },
          {
            "code": "SAT-HUA",
            "name": "Huayucachi",
            "zipCodes": [
              "12408",
              "12410"
            ]
          },
          {
            "code": "JAU-ING",
            "name": "Ingenio",
            "zipCodes": [
              "12210"
            ]
          },
          {
            "code": "JAU-PAR",
            "name": "Pariahuanca",
            "zipCodes": [
              "12245",
              "12246"
            ]
          },
          {
            "code": "HUA-PIL",
            "name": "Pilcomayo",
            "zipCodes": [
              "12006"
            ]
          },
          {
            "code": "SAT-PUC",
            "name": "Pucará",
            "zipCodes": [
              "12404",
              "12405"
            ]
          },
          {
            "code": "JAU-QUI",
            "name": "Quichuay",
            "zipCodes": [
              "12205"
            ]
          },
          {
            "code": "HUA-QUI",
            "name": "Quilcas",
            "zipCodes": [
              "12120"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "San Agustín",
            "zipCodes": [
              "12100",
              "12101"
            ]
          },
          {
            "code": "JAU-SAN",
            "name": "San Domingo de Acobamba",
            "zipCodes": [
              "12240",
              "12241"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "San Jerónimo de Tunán",
            "zipCodes": [
              "12115",
              "12116"
            ]
          },
          {
            "code": "SAT-SAP",
            "name": "Sapallanca",
            "zipCodes": [
              "12400",
              "12401"
            ]
          },
          {
            "code": "HUA-SAÑ",
            "name": "Saño",
            "zipCodes": [
              "12110"
            ]
          },
          {
            "code": "CHU-SIC",
            "name": "Sicaya",
            "zipCodes": [
              "12500",
              "12501"
            ]
          },
          {
            "code": "SAT-VIQ",
            "name": "Viques",
            "zipCodes": [
              "12415"
            ]
          }
        ],
        "cities": [
          {
            "code": "CHU-CAR",
            "name": "Carhuacallanga",
            "zipCodes": [
              "12442"
            ]
          },
          {
            "code": "CHU-CHA",
            "name": "Chacapampa",
            "zipCodes": [
              "12440"
            ]
          },
          {
            "code": "CHU-CHI",
            "name": "Chicche",
            "zipCodes": [
              "12451"
            ]
          },
          {
            "code": "HUA-CHI",
            "name": "Chilca",
            "zipCodes": [
              "12000",
              "12001",
              "12002",
              "12003",
              "12051"
            ]
          },
          {
            "code": "CHU-CHO",
            "name": "Chongos Alto",
            "zipCodes": [
              "12450"
            ]
          },
          {
            "code": "CHU-CHU",
            "name": "Chupuro",
            "zipCodes": [
              "12435"
            ]
          },
          {
            "code": "CHU-COL",
            "name": "Colca",
            "zipCodes": [
              "12436"
            ]
          },
          {
            "code": "SAT-CUL",
            "name": "Cullhuas",
            "zipCodes": [
              "12420"
            ]
          },
          {
            "code": "HUA-EL ",
            "name": "El Tambo",
            "zipCodes": [
              "12000",
              "12004",
              "12006",
              "12007"
            ]
          },
          {
            "code": "SAT-HUA",
            "name": "Huacrapuquio",
            "zipCodes": [
              "12419"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Hualhuas",
            "zipCodes": [
              "12105"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huancan",
            "zipCodes": [
              "12000",
              "12051"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huancayo",
            "zipCodes": [
              "12000",
              "12001",
              "12002",
              "12003",
              "12004"
            ]
          },
          {
            "code": "CHU-HUA",
            "name": "Huasicancha",
            "zipCodes": [
              "12445"
            ]
          },
          {
            "code": "SAT-HUA",
            "name": "Huayucachi",
            "zipCodes": [
              "12408",
              "12410"
            ]
          },
          {
            "code": "JAU-ING",
            "name": "Ingenio",
            "zipCodes": [
              "12210"
            ]
          },
          {
            "code": "JAU-LAM",
            "name": "Lampa",
            "zipCodes": [
              "12245",
              "12246"
            ]
          },
          {
            "code": "HUA-PIL",
            "name": "Pilcomayo",
            "zipCodes": [
              "12006"
            ]
          },
          {
            "code": "SAT-PUC",
            "name": "Pucara",
            "zipCodes": [
              "12404",
              "12405"
            ]
          },
          {
            "code": "JAU-QUI",
            "name": "Quichuay",
            "zipCodes": [
              "12205"
            ]
          },
          {
            "code": "HUA-QUI",
            "name": "Quilcas",
            "zipCodes": [
              "12120"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "San Agustin",
            "zipCodes": [
              "12100",
              "12101"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "San Jeronimo de Tunan",
            "zipCodes": [
              "12115",
              "12116"
            ]
          },
          {
            "code": "JAU-SAN",
            "name": "Santo Domingo de Acobamba",
            "zipCodes": [
              "12240",
              "12241"
            ]
          },
          {
            "code": "SAT-SAP",
            "name": "Sapallanga",
            "zipCodes": [
              "12400",
              "12401"
            ]
          },
          {
            "code": "HUA-SAÑ",
            "name": "Saño",
            "zipCodes": [
              "12110"
            ]
          },
          {
            "code": "CHU-SIC",
            "name": "Sicaya",
            "zipCodes": [
              "12500",
              "12501"
            ]
          },
          {
            "code": "SAT-VIQ",
            "name": "Viques",
            "zipCodes": [
              "12415"
            ]
          }
        ]
      },
      {
        "code": "JAU",
        "name": "Jauja",
        "districts": [
          {
            "code": "YAU-ACO",
            "name": "Acolla",
            "zipCodes": [
              "12620",
              "12621"
            ]
          },
          {
            "code": "JAU-APA",
            "name": "Apata",
            "zipCodes": [
              "12140"
            ]
          },
          {
            "code": "JAU-ATA",
            "name": "Ataura",
            "zipCodes": [
              "12160"
            ]
          },
          {
            "code": "YAU-CAN",
            "name": "Canchayllo",
            "zipCodes": [
              "12555"
            ]
          },
          {
            "code": "YAU-CUR",
            "name": "Curicaca",
            "zipCodes": [
              "12550"
            ]
          },
          {
            "code": "JAU-EL ",
            "name": "El Mantaro",
            "zipCodes": [
              "12150"
            ]
          },
          {
            "code": "JAU-HUA",
            "name": "Huamalí",
            "zipCodes": [
              "12155"
            ]
          },
          {
            "code": "CHU-HUA",
            "name": "Huaripampa",
            "zipCodes": [
              "12530"
            ]
          },
          {
            "code": "YAU-HUE",
            "name": "Huertas",
            "zipCodes": [
              "12615"
            ]
          },
          {
            "code": "YAU-JAN",
            "name": "Janjaillo",
            "zipCodes": [
              "12630"
            ]
          },
          {
            "code": "YAU-JAU",
            "name": "Jauja",
            "zipCodes": [
              "12601"
            ]
          },
          {
            "code": "JAU-JUL",
            "name": "Julcán",
            "zipCodes": [
              "12175"
            ]
          },
          {
            "code": "CHU-LEO",
            "name": "Leonor Ordoñez",
            "zipCodes": [
              "12515"
            ]
          },
          {
            "code": "YAU-LLO",
            "name": "Llocllapampa",
            "zipCodes": [
              "12545"
            ]
          },
          {
            "code": "YAU-MAR",
            "name": "Marco",
            "zipCodes": [
              "12625"
            ]
          },
          {
            "code": "JAU-MAS",
            "name": "Masma",
            "zipCodes": [
              "12165"
            ]
          },
          {
            "code": "JAU-MAS",
            "name": "Masma Chicche",
            "zipCodes": [
              "12170"
            ]
          },
          {
            "code": "JAU-MOL",
            "name": "Molinos",
            "zipCodes": [
              "12180"
            ]
          },
          {
            "code": "CHA-MON",
            "name": "Monobamba",
            "zipCodes": [
              "12850"
            ]
          },
          {
            "code": "CHU-MUQ",
            "name": "Muqui",
            "zipCodes": [
              "12520"
            ]
          },
          {
            "code": "CHU-MUQ",
            "name": "Muquiyauyo",
            "zipCodes": [
              "12525"
            ]
          },
          {
            "code": "JUN-PAC",
            "name": "Paca",
            "zipCodes": [
              "12810"
            ]
          },
          {
            "code": "YAU-PAC",
            "name": "Paccha",
            "zipCodes": [
              "12585"
            ]
          },
          {
            "code": "JUN-PAN",
            "name": "Pancan",
            "zipCodes": [
              "12800"
            ]
          },
          {
            "code": "YAU-PAR",
            "name": "Parco",
            "zipCodes": [
              "12540"
            ]
          },
          {
            "code": "YAU-POM",
            "name": "Pomacancha",
            "zipCodes": [
              "12635"
            ]
          },
          {
            "code": "JUN-RII",
            "name": "RIicran",
            "zipCodes": [
              "12820"
            ]
          },
          {
            "code": "JAU-SAN",
            "name": "San Lorenzo",
            "zipCodes": [
              "12145"
            ]
          },
          {
            "code": "JUN-SAN",
            "name": "San Pedro de Chunán",
            "zipCodes": [
              "12805"
            ]
          },
          {
            "code": "YAU-SAU",
            "name": "Sausa",
            "zipCodes": [
              "12600",
              "12601"
            ]
          },
          {
            "code": "CHU-SIN",
            "name": "Sincos",
            "zipCodes": [
              "12513"
            ]
          },
          {
            "code": "YAU-TUN",
            "name": "Tunan Marca",
            "zipCodes": [
              "12640"
            ]
          },
          {
            "code": "JUN-YAU",
            "name": "Yauli",
            "zipCodes": [
              "12815"
            ]
          },
          {
            "code": "YAU-YAU",
            "name": "Yauyos",
            "zipCodes": [
              "12600",
              "12601"
            ]
          }
        ],
        "cities": [
          {
            "code": "YAU-ACO",
            "name": "Acolla",
            "zipCodes": [
              "12620",
              "12621"
            ]
          },
          {
            "code": "JAU-APA",
            "name": "Apata",
            "zipCodes": [
              "12140"
            ]
          },
          {
            "code": "JAU-ATA",
            "name": "Ataura",
            "zipCodes": [
              "12160"
            ]
          },
          {
            "code": "YAU-CAN",
            "name": "Canchayllo",
            "zipCodes": [
              "12555"
            ]
          },
          {
            "code": "YAU-CON",
            "name": "Concho",
            "zipCodes": [
              "12640"
            ]
          },
          {
            "code": "YAU-EL ",
            "name": "El Rosario",
            "zipCodes": [
              "12550"
            ]
          },
          {
            "code": "JAU-HUA",
            "name": "Huamali",
            "zipCodes": [
              "12155"
            ]
          },
          {
            "code": "CHU-HUA",
            "name": "Huancani",
            "zipCodes": [
              "12515"
            ]
          },
          {
            "code": "CHU-HUA",
            "name": "Huaripampa",
            "zipCodes": [
              "12530"
            ]
          },
          {
            "code": "YAU-HUE",
            "name": "Huertas",
            "zipCodes": [
              "12615"
            ]
          },
          {
            "code": "YAU-JAN",
            "name": "Janjaillo",
            "zipCodes": [
              "12630"
            ]
          },
          {
            "code": "YAU-JAU",
            "name": "Jauja",
            "zipCodes": [
              "12601"
            ]
          },
          {
            "code": "JAU-JUL",
            "name": "Julcan",
            "zipCodes": [
              "12175"
            ]
          },
          {
            "code": "YAU-LLO",
            "name": "Llocllapampa",
            "zipCodes": [
              "12545"
            ]
          },
          {
            "code": "YAU-MAR",
            "name": "Marco",
            "zipCodes": [
              "12625"
            ]
          },
          {
            "code": "JAU-MAS",
            "name": "Masma",
            "zipCodes": [
              "12165"
            ]
          },
          {
            "code": "JAU-MAS",
            "name": "Masma Chicche",
            "zipCodes": [
              "12170"
            ]
          },
          {
            "code": "JAU-MOL",
            "name": "Molinos",
            "zipCodes": [
              "12180"
            ]
          },
          {
            "code": "CHA-MON",
            "name": "Monobamba",
            "zipCodes": [
              "12850"
            ]
          },
          {
            "code": "CHU-MUQ",
            "name": "Muqui",
            "zipCodes": [
              "12520"
            ]
          },
          {
            "code": "CHU-MUQ",
            "name": "Muquiyauyo",
            "zipCodes": [
              "12525"
            ]
          },
          {
            "code": "JUN-PAC",
            "name": "Paca",
            "zipCodes": [
              "12810"
            ]
          },
          {
            "code": "YAU-PAC",
            "name": "Paccha",
            "zipCodes": [
              "12585"
            ]
          },
          {
            "code": "JUN-PAN",
            "name": "Pancan",
            "zipCodes": [
              "12800"
            ]
          },
          {
            "code": "YAU-PAR",
            "name": "Parco",
            "zipCodes": [
              "12540"
            ]
          },
          {
            "code": "YAU-POM",
            "name": "Pomacancha",
            "zipCodes": [
              "12635"
            ]
          },
          {
            "code": "JAU-PUC",
            "name": "Pucucho",
            "zipCodes": [
              "12150"
            ]
          },
          {
            "code": "JUN-RIC",
            "name": "Ricran",
            "zipCodes": [
              "12820"
            ]
          },
          {
            "code": "JAU-SAN",
            "name": "San Lorenzo",
            "zipCodes": [
              "12145"
            ]
          },
          {
            "code": "JUN-SAN",
            "name": "San Pedro de Chunan",
            "zipCodes": [
              "12805"
            ]
          },
          {
            "code": "YAU-SAU",
            "name": "Sausa",
            "zipCodes": [
              "12600",
              "12601"
            ]
          },
          {
            "code": "CHU-SIN",
            "name": "Sincos",
            "zipCodes": [
              "12513"
            ]
          },
          {
            "code": "JUN-YAU",
            "name": "Yauli",
            "zipCodes": [
              "12815"
            ]
          },
          {
            "code": "YAU-YAU",
            "name": "Yauyos",
            "zipCodes": [
              "12600",
              "12601"
            ]
          }
        ]
      },
      {
        "code": "JUN",
        "name": "Junín",
        "districts": [
          {
            "code": "JUN-CAR",
            "name": "Carhuamayo",
            "zipCodes": [
              "12740",
              "12741"
            ]
          },
          {
            "code": "JUN-JUN",
            "name": "Junín",
            "zipCodes": [
              "12730",
              "12731"
            ]
          },
          {
            "code": "JUN-OND",
            "name": "Ondores",
            "zipCodes": [
              "12760"
            ]
          },
          {
            "code": "JUN-ULC",
            "name": "Ulcumayo",
            "zipCodes": [
              "12750",
              "12751"
            ]
          }
        ],
        "cities": [
          {
            "code": "JUN-CAR",
            "name": "Carhuamayo",
            "zipCodes": [
              "12740",
              "12741"
            ]
          },
          {
            "code": "JUN-JUN",
            "name": "Junin",
            "zipCodes": [
              "12730",
              "12731"
            ]
          },
          {
            "code": "JUN-OND",
            "name": "Ondores",
            "zipCodes": [
              "12760"
            ]
          },
          {
            "code": "JUN-ULC",
            "name": "Ulcumayo",
            "zipCodes": [
              "12750",
              "12751"
            ]
          }
        ]
      },
      {
        "code": "SAT",
        "name": "Satipo",
        "districts": [
          {
            "code": "SAT-COV",
            "name": "Coviriali",
            "zipCodes": [
              "12255",
              "12256"
            ]
          },
          {
            "code": "SAT-LLA",
            "name": "Llaylla",
            "zipCodes": [
              "12310",
              "12311"
            ]
          },
          {
            "code": "SAT-MAZ",
            "name": "Mazamari",
            "zipCodes": [
              "12300",
              "12301"
            ]
          },
          {
            "code": "SAT-PAM",
            "name": "Pampa Hermosa",
            "zipCodes": [
              "12250",
              "12251"
            ]
          },
          {
            "code": "SAT-PAN",
            "name": "Pangoa",
            "zipCodes": [
              "12320",
              "12321"
            ]
          },
          {
            "code": "CHA-RÍO",
            "name": "Río Negro",
            "zipCodes": [
              "12875",
              "12876"
            ]
          },
          {
            "code": "SAT-RÍO",
            "name": "Río Tambo",
            "zipCodes": [
              "12330",
              "12331"
            ]
          },
          {
            "code": "SAT-SAT",
            "name": "Satipo",
            "zipCodes": [
              "12260",
              "12261"
            ]
          }
        ],
        "cities": [
          {
            "code": "SAT-COV",
            "name": "Coviriali",
            "zipCodes": [
              "12255",
              "12256"
            ]
          },
          {
            "code": "SAT-LLA",
            "name": "Llaylla",
            "zipCodes": [
              "12310",
              "12311"
            ]
          },
          {
            "code": "SAT-MAR",
            "name": "Mariposa",
            "zipCodes": [
              "12250",
              "12251"
            ]
          },
          {
            "code": "SAT-MAZ",
            "name": "Mazamari",
            "zipCodes": [
              "12300",
              "12301"
            ]
          },
          {
            "code": "SAT-PUE",
            "name": "Puerto Ocopa",
            "zipCodes": [
              "12330",
              "12331"
            ]
          },
          {
            "code": "CHA-RIO",
            "name": "Rio Negro",
            "zipCodes": [
              "12875",
              "12876"
            ]
          },
          {
            "code": "SAT-SAN",
            "name": "San Martin de Pangoa",
            "zipCodes": [
              "12320",
              "12321"
            ]
          },
          {
            "code": "SAT-SAT",
            "name": "Satipo",
            "zipCodes": [
              "12260",
              "12261"
            ]
          }
        ]
      },
      {
        "code": "TAR",
        "name": "Tarma",
        "districts": [
          {
            "code": "TAR-ACO",
            "name": "Acobamba",
            "zipCodes": [
              "12700",
              "12701"
            ]
          },
          {
            "code": "TAR-HUA",
            "name": "Huaricolca",
            "zipCodes": [
              "12645"
            ]
          },
          {
            "code": "JUN-HUA",
            "name": "Huasahuasi",
            "zipCodes": [
              "12835",
              "12836"
            ]
          },
          {
            "code": "TAR-LA ",
            "name": "La Unión",
            "zipCodes": [
              "12655"
            ]
          },
          {
            "code": "JUN-PAL",
            "name": "Palca",
            "zipCodes": [
              "12830",
              "12831"
            ]
          },
          {
            "code": "TAR-PAL",
            "name": "Palcamayo",
            "zipCodes": [
              "12710",
              "12711"
            ]
          },
          {
            "code": "TAR-SAN",
            "name": "San Pedro de Cajas",
            "zipCodes": [
              "12720",
              "12721"
            ]
          },
          {
            "code": "JUN-TAP",
            "name": "Tapo",
            "zipCodes": [
              "12825",
              "12826"
            ]
          },
          {
            "code": "TAR-TAR",
            "name": "Tarma",
            "zipCodes": [
              "12650",
              "12651"
            ]
          }
        ],
        "cities": [
          {
            "code": "TAR-ACO",
            "name": "Acobamba",
            "zipCodes": [
              "12700",
              "12701"
            ]
          },
          {
            "code": "TAR-HUA",
            "name": "Huaricolca",
            "zipCodes": [
              "12645"
            ]
          },
          {
            "code": "JUN-HUA",
            "name": "Huasahuasi",
            "zipCodes": [
              "12835",
              "12836"
            ]
          },
          {
            "code": "TAR-LET",
            "name": "Leticia",
            "zipCodes": [
              "12655"
            ]
          },
          {
            "code": "JUN-PAL",
            "name": "Palca",
            "zipCodes": [
              "12830",
              "12831"
            ]
          },
          {
            "code": "TAR-PAL",
            "name": "Palcamayo",
            "zipCodes": [
              "12710",
              "12711"
            ]
          },
          {
            "code": "TAR-SAN",
            "name": "San Pedro de Cajas",
            "zipCodes": [
              "12720",
              "12721"
            ]
          },
          {
            "code": "JUN-TAP",
            "name": "Tapo",
            "zipCodes": [
              "12825",
              "12826"
            ]
          },
          {
            "code": "TAR-TAR",
            "name": "Tarma",
            "zipCodes": [
              "12650",
              "12651"
            ]
          }
        ]
      },
      {
        "code": "YAU",
        "name": "Yauli",
        "districts": [
          {
            "code": "YAU-CHA",
            "name": "Chacapalpa",
            "zipCodes": [
              "12560"
            ]
          },
          {
            "code": "YAU-HUA",
            "name": "Huay Huay",
            "zipCodes": [
              "12565"
            ]
          },
          {
            "code": "YAU-LA ",
            "name": "La Oroya",
            "zipCodes": [
              "12575",
              "12576"
            ]
          },
          {
            "code": "JUN-MAR",
            "name": "Marcapomacocha",
            "zipCodes": [
              "12780"
            ]
          },
          {
            "code": "YAU-MOR",
            "name": "Morococha",
            "zipCodes": [
              "12595",
              "12596"
            ]
          },
          {
            "code": "YAU-PAC",
            "name": "Paccha",
            "zipCodes": [
              "12535"
            ]
          },
          {
            "code": "JUN-SAN",
            "name": "Santa Barbara de Carhuacayan",
            "zipCodes": [
              "12770"
            ]
          },
          {
            "code": "YAU-SAN",
            "name": "Santa Rosa de Sacco",
            "zipCodes": [
              "12575",
              "12576"
            ]
          },
          {
            "code": "YAU-SUI",
            "name": "Suitucancha",
            "zipCodes": [
              "12570"
            ]
          },
          {
            "code": "YAU-YAU",
            "name": "Yauli",
            "zipCodes": [
              "12590",
              "12591"
            ]
          }
        ],
        "cities": [
          {
            "code": "YAU-CHA",
            "name": "Chacapalpa",
            "zipCodes": [
              "12560"
            ]
          },
          {
            "code": "YAU-HUA",
            "name": "Huay Huay",
            "zipCodes": [
              "12565"
            ]
          },
          {
            "code": "YAU-LA ",
            "name": "La Oroya",
            "zipCodes": [
              "12575",
              "12576"
            ]
          },
          {
            "code": "JUN-MAR",
            "name": "Marcapomacocha",
            "zipCodes": [
              "12780"
            ]
          },
          {
            "code": "YAU-MOR",
            "name": "Morococha",
            "zipCodes": [
              "12595",
              "12596"
            ]
          },
          {
            "code": "YAU-PAC",
            "name": "Paccha",
            "zipCodes": [
              "12535"
            ]
          },
          {
            "code": "JUN-SAN",
            "name": "Santa Barbara de Carhuacayan",
            "zipCodes": [
              "12770"
            ]
          },
          {
            "code": "YAU-SAN",
            "name": "Santa Rosa de Sacco",
            "zipCodes": [
              "12575",
              "12576"
            ]
          },
          {
            "code": "YAU-SUI",
            "name": "Suitucancha",
            "zipCodes": [
              "12570"
            ]
          },
          {
            "code": "YAU-YAU",
            "name": "Yauli",
            "zipCodes": [
              "12590",
              "12591"
            ]
          }
        ]
      }
    ]
  },
  {
    "code": "LA ",
    "name": "La Libertad",
    "provinces": [
      {
        "code": "ASC",
        "name": "Ascope",
        "districts": [
          {
            "code": "ASC-ASC",
            "name": "Ascope",
            "zipCodes": [
              "13770",
              "13771"
            ]
          },
          {
            "code": "ASC-CAS",
            "name": "Casa Grande",
            "zipCodes": [
              "13760",
              "13761"
            ]
          },
          {
            "code": "ASC-CHI",
            "name": "Chicama",
            "zipCodes": [
              "13700",
              "13701"
            ]
          },
          {
            "code": "ASC-CHO",
            "name": "Chocope",
            "zipCodes": [
              "13710",
              "13711"
            ]
          },
          {
            "code": "ASC-MAG",
            "name": "Magdalena de Cao",
            "zipCodes": [
              "13750"
            ]
          },
          {
            "code": "ASC-PAI",
            "name": "Paijan",
            "zipCodes": [
              "13720",
              "13721"
            ]
          },
          {
            "code": "ASC-RAZ",
            "name": "Razuri",
            "zipCodes": [
              "13730",
              "13731"
            ]
          },
          {
            "code": "ASC-SAN",
            "name": "Santiago de Cao",
            "zipCodes": [
              "13740",
              "13741"
            ]
          }
        ],
        "cities": [
          {
            "code": "ASC-ASC",
            "name": "Ascope",
            "zipCodes": [
              "13770",
              "13771"
            ]
          },
          {
            "code": "ASC-CAS",
            "name": "Casa Grande",
            "zipCodes": [
              "13760",
              "13761"
            ]
          },
          {
            "code": "ASC-CHI",
            "name": "Chicama",
            "zipCodes": [
              "13700",
              "13701"
            ]
          },
          {
            "code": "ASC-CHO",
            "name": "Chocope",
            "zipCodes": [
              "13710",
              "13711"
            ]
          },
          {
            "code": "ASC-MAG",
            "name": "Magdalena de Cao",
            "zipCodes": [
              "13750"
            ]
          },
          {
            "code": "ASC-PAI",
            "name": "Paijan",
            "zipCodes": [
              "13720",
              "13721"
            ]
          },
          {
            "code": "ASC-PUE",
            "name": "Puerto de Malabrigo",
            "zipCodes": [
              "13730",
              "13731"
            ]
          },
          {
            "code": "ASC-SAN",
            "name": "Santiago de Cao",
            "zipCodes": [
              "13740",
              "13741"
            ]
          }
        ]
      },
      {
        "code": "BOL",
        "name": "Bolivar",
        "districts": [
          {
            "code": "BOL-BAM",
            "name": "Bambamarca",
            "zipCodes": [
              "13400"
            ]
          },
          {
            "code": "BOL-BOL",
            "name": "Bolivar",
            "zipCodes": [
              "13420"
            ]
          },
          {
            "code": "BOL-CON",
            "name": "Condormarca",
            "zipCodes": [
              "13410"
            ]
          },
          {
            "code": "BOL-LON",
            "name": "Longotea",
            "zipCodes": [
              "13440"
            ]
          },
          {
            "code": "BOL-UCH",
            "name": "Uchumarca",
            "zipCodes": [
              "13450"
            ]
          },
          {
            "code": "BOL-UCU",
            "name": "Ucuncha",
            "zipCodes": [
              "13430"
            ]
          }
        ],
        "cities": [
          {
            "code": "BOL-BAM",
            "name": "Bambamarca",
            "zipCodes": [
              "13400"
            ]
          },
          {
            "code": "BOL-BOL",
            "name": "Bolivar",
            "zipCodes": [
              "13420"
            ]
          },
          {
            "code": "BOL-LON",
            "name": "Longotea",
            "zipCodes": [
              "13440"
            ]
          },
          {
            "code": "BOL-NUE",
            "name": "Nuevo Condormarca",
            "zipCodes": [
              "13410"
            ]
          },
          {
            "code": "BOL-UCH",
            "name": "Uchucmarca",
            "zipCodes": [
              "13450"
            ]
          },
          {
            "code": "BOL-UCU",
            "name": "Ucuncha",
            "zipCodes": [
              "13430"
            ]
          }
        ]
      },
      {
        "code": "CHE",
        "name": "Chepen",
        "districts": [
          {
            "code": "CHE-CHE",
            "name": "Chepén",
            "zipCodes": [
              "13870",
              "13871"
            ]
          },
          {
            "code": "CHE-PAC",
            "name": "Pacanga",
            "zipCodes": [
              "13860",
              "13861"
            ]
          },
          {
            "code": "CHE-PUE",
            "name": "Pueblo Nuevo",
            "zipCodes": [
              "13850",
              "13851"
            ]
          }
        ],
        "cities": [
          {
            "code": "CHE-CHE",
            "name": "Chepen",
            "zipCodes": [
              "13870",
              "13871"
            ]
          },
          {
            "code": "CHE-PAC",
            "name": "Pacanga",
            "zipCodes": [
              "13860",
              "13861"
            ]
          },
          {
            "code": "CHE-PUE",
            "name": "Pueblo Nuevo",
            "zipCodes": [
              "13850",
              "13851"
            ]
          }
        ]
      },
      {
        "code": "GRA",
        "name": "Gran Chimu",
        "districts": [
          {
            "code": "ASC-CAS",
            "name": "Cascas",
            "zipCodes": [
              "13780",
              "13781"
            ]
          },
          {
            "code": "GRA-LUC",
            "name": "Lucma",
            "zipCodes": [
              "13240",
              "13241"
            ]
          },
          {
            "code": "GRA-MAR",
            "name": "Marmot",
            "zipCodes": [
              "13260"
            ]
          },
          {
            "code": "GRA-SAY",
            "name": "Sayapullo",
            "zipCodes": [
              "13250",
              "13251"
            ]
          }
        ],
        "cities": [
          {
            "code": "ASC-CAS",
            "name": "Cascas",
            "zipCodes": [
              "13780",
              "13781"
            ]
          },
          {
            "code": "GRA-COM",
            "name": "Compin",
            "zipCodes": [
              "13260"
            ]
          },
          {
            "code": "GRA-LUC",
            "name": "Lucma",
            "zipCodes": [
              "13240",
              "13241"
            ]
          },
          {
            "code": "GRA-SAY",
            "name": "Sayapullo",
            "zipCodes": [
              "13250",
              "13251"
            ]
          }
        ]
      },
      {
        "code": "JUL",
        "name": "Julcan",
        "districts": [
          {
            "code": "JUL-CAL",
            "name": "Calamarca",
            "zipCodes": [
              "13185",
              "13186"
            ]
          },
          {
            "code": "JUL-CAR",
            "name": "Carabamba",
            "zipCodes": [
              "13195",
              "13196"
            ]
          },
          {
            "code": "JUL-HUA",
            "name": "Huaso",
            "zipCodes": [
              "13190",
              "13191"
            ]
          },
          {
            "code": "JUL-JUL",
            "name": "Julcán",
            "zipCodes": [
              "13180",
              "13181"
            ]
          }
        ],
        "cities": [
          {
            "code": "JUL-CAL",
            "name": "Calamarca",
            "zipCodes": [
              "13185",
              "13186"
            ]
          },
          {
            "code": "JUL-CAR",
            "name": "Carabamba",
            "zipCodes": [
              "13195",
              "13196"
            ]
          },
          {
            "code": "JUL-HUA",
            "name": "Huaso",
            "zipCodes": [
              "13190",
              "13191"
            ]
          },
          {
            "code": "JUL-JUL",
            "name": "Julcan",
            "zipCodes": [
              "13180",
              "13181"
            ]
          }
        ]
      },
      {
        "code": "OTU",
        "name": "Otuzco",
        "districts": [
          {
            "code": "OTU-AGA",
            "name": "Agallpampa",
            "zipCodes": [
              "13135",
              "13136"
            ]
          },
          {
            "code": "JUL-CHA",
            "name": "Charat",
            "zipCodes": [
              "13210"
            ]
          },
          {
            "code": "JUL-HUA",
            "name": "Huaranchal",
            "zipCodes": [
              "13230",
              "13231"
            ]
          },
          {
            "code": "OTU-LA ",
            "name": "La Cuesta",
            "zipCodes": [
              "13120"
            ]
          },
          {
            "code": "SAN-MAC",
            "name": "Mache",
            "zipCodes": [
              "13175"
            ]
          },
          {
            "code": "JUL-OTU",
            "name": "Otuzco",
            "zipCodes": [
              "13200",
              "13201"
            ]
          },
          {
            "code": "OTU-PAR",
            "name": "Paranday",
            "zipCodes": [
              "13115"
            ]
          },
          {
            "code": "OTU-SAL",
            "name": "Salpo",
            "zipCodes": [
              "13130",
              "13131"
            ]
          },
          {
            "code": "OTU-SIN",
            "name": "Sinsicap",
            "zipCodes": [
              "13110",
              "13111"
            ]
          },
          {
            "code": "JUL-USQ",
            "name": "Usquil",
            "zipCodes": [
              "13220",
              "13221"
            ]
          }
        ],
        "cities": [
          {
            "code": "OTU-AGA",
            "name": "Agallpampa",
            "zipCodes": [
              "13135",
              "13136"
            ]
          },
          {
            "code": "JUL-CHA",
            "name": "Charat",
            "zipCodes": [
              "13210"
            ]
          },
          {
            "code": "JUL-HUA",
            "name": "Huaranchal",
            "zipCodes": [
              "13230",
              "13231"
            ]
          },
          {
            "code": "OTU-LA ",
            "name": "La Cuesta",
            "zipCodes": [
              "13120"
            ]
          },
          {
            "code": "SAN-MAC",
            "name": "Mache",
            "zipCodes": [
              "13175"
            ]
          },
          {
            "code": "JUL-OTU",
            "name": "Otuzco",
            "zipCodes": [
              "13200",
              "13201"
            ]
          },
          {
            "code": "OTU-PAR",
            "name": "Paranday",
            "zipCodes": [
              "13115"
            ]
          },
          {
            "code": "OTU-SAL",
            "name": "Salpo",
            "zipCodes": [
              "13130",
              "13131"
            ]
          },
          {
            "code": "OTU-SIN",
            "name": "Sinsicap",
            "zipCodes": [
              "13110",
              "13111"
            ]
          },
          {
            "code": "JUL-USQ",
            "name": "Usquil",
            "zipCodes": [
              "13220",
              "13221"
            ]
          }
        ]
      },
      {
        "code": "PAC",
        "name": "Pacasmayo",
        "districts": [
          {
            "code": "PAC-GUA",
            "name": "Guadalupe",
            "zipCodes": [
              "13840",
              "13841"
            ]
          },
          {
            "code": "PAC-JEQ",
            "name": "Jequetepeque",
            "zipCodes": [
              "13820"
            ]
          },
          {
            "code": "PAC-PAC",
            "name": "Pacasmayo",
            "zipCodes": [
              "13810",
              "13811"
            ]
          },
          {
            "code": "PAC-SAN",
            "name": "San José",
            "zipCodes": [
              "13830",
              "13831"
            ]
          },
          {
            "code": "PAC-SAN",
            "name": "San Pedro de Lloc",
            "zipCodes": [
              "13800",
              "13801"
            ]
          }
        ],
        "cities": [
          {
            "code": "PAC-GUA",
            "name": "Guadalupe",
            "zipCodes": [
              "13840",
              "13841"
            ]
          },
          {
            "code": "PAC-JEQ",
            "name": "Jequetepeque",
            "zipCodes": [
              "13820"
            ]
          },
          {
            "code": "PAC-PAC",
            "name": "Pacasmayo",
            "zipCodes": [
              "13810",
              "13811"
            ]
          },
          {
            "code": "PAC-SAN",
            "name": "San Jose",
            "zipCodes": [
              "13830",
              "13831"
            ]
          },
          {
            "code": "PAC-SAN",
            "name": "San Pedro de Lloc",
            "zipCodes": [
              "13800",
              "13801"
            ]
          }
        ]
      },
      {
        "code": "PAT",
        "name": "Pataz",
        "districts": [
          {
            "code": "PAT-BUL",
            "name": "Buldibuyo",
            "zipCodes": [
              "13515"
            ]
          },
          {
            "code": "PAT-CHI",
            "name": "Chillia",
            "zipCodes": [
              "13550",
              "13551"
            ]
          },
          {
            "code": "PAT-HUA",
            "name": "Huancaspata",
            "zipCodes": [
              "13530",
              "13531"
            ]
          },
          {
            "code": "PAT-HUA",
            "name": "Huaylillas",
            "zipCodes": [
              "13520"
            ]
          },
          {
            "code": "PAT-HUA",
            "name": "Huayo",
            "zipCodes": [
              "13555"
            ]
          },
          {
            "code": "PAT-ONG",
            "name": "Ongón",
            "zipCodes": [
              "13560"
            ]
          },
          {
            "code": "PAT-PAR",
            "name": "Parcoy",
            "zipCodes": [
              "13510",
              "13511"
            ]
          },
          {
            "code": "PAT-PAT",
            "name": "Pataz",
            "zipCodes": [
              "13500",
              "13501"
            ]
          },
          {
            "code": "PAT-PÍA",
            "name": "Pías",
            "zipCodes": [
              "13505"
            ]
          },
          {
            "code": "PAT-SAN",
            "name": "Santiago de Challas",
            "zipCodes": [
              "13535"
            ]
          },
          {
            "code": "PAT-TAU",
            "name": "Taurija",
            "zipCodes": [
              "13545"
            ]
          },
          {
            "code": "PAT-TAY",
            "name": "Tayabamba",
            "zipCodes": [
              "13525",
              "13526"
            ]
          },
          {
            "code": "PAT-URP",
            "name": "Urpay",
            "zipCodes": [
              "13540"
            ]
          }
        ],
        "cities": [
          {
            "code": "PAT-BUL",
            "name": "Buldibuyo",
            "zipCodes": [
              "13515"
            ]
          },
          {
            "code": "PAT-CHA",
            "name": "Challas",
            "zipCodes": [
              "13535"
            ]
          },
          {
            "code": "PAT-CHI",
            "name": "Chillia",
            "zipCodes": [
              "13550",
              "13551"
            ]
          },
          {
            "code": "PAT-HUA",
            "name": "Huancaspata",
            "zipCodes": [
              "13530",
              "13531"
            ]
          },
          {
            "code": "PAT-HUA",
            "name": "Huaylillas",
            "zipCodes": [
              "13520"
            ]
          },
          {
            "code": "PAT-HUA",
            "name": "Huayo",
            "zipCodes": [
              "13555"
            ]
          },
          {
            "code": "PAT-ONG",
            "name": "Ongon",
            "zipCodes": [
              "13560"
            ]
          },
          {
            "code": "PAT-PAR",
            "name": "Parcoy",
            "zipCodes": [
              "13510",
              "13511"
            ]
          },
          {
            "code": "PAT-PAT",
            "name": "Pataz",
            "zipCodes": [
              "13500",
              "13501"
            ]
          },
          {
            "code": "PAT-PIA",
            "name": "Pias",
            "zipCodes": [
              "13505"
            ]
          },
          {
            "code": "PAT-TAU",
            "name": "Taurija",
            "zipCodes": [
              "13545"
            ]
          },
          {
            "code": "PAT-TAY",
            "name": "Tayabamba",
            "zipCodes": [
              "13525",
              "13526"
            ]
          },
          {
            "code": "PAT-URP",
            "name": "Urpay",
            "zipCodes": [
              "13540"
            ]
          }
        ]
      },
      {
        "code": "SAN",
        "name": "Sanchez Carrión",
        "districts": [
          {
            "code": "SAN-CHU",
            "name": "Chugay",
            "zipCodes": [
              "13330",
              "13331"
            ]
          },
          {
            "code": "SAN-COC",
            "name": "Cochorco",
            "zipCodes": [
              "13340",
              "13341"
            ]
          },
          {
            "code": "SAN-CUR",
            "name": "Curgos",
            "zipCodes": [
              "13360",
              "13361"
            ]
          },
          {
            "code": "SAN-HUA",
            "name": "Huamachuco",
            "zipCodes": [
              "13300",
              "13301"
            ]
          },
          {
            "code": "SAN-MAR",
            "name": "Marcabal",
            "zipCodes": [
              "13320",
              "13321"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "Sanagorán",
            "zipCodes": [
              "13310",
              "13311"
            ]
          },
          {
            "code": "SAN-SAR",
            "name": "Sartimbamba",
            "zipCodes": [
              "13350",
              "13351"
            ]
          },
          {
            "code": "SAN-SAR",
            "name": "Sarín",
            "zipCodes": [
              "13370",
              "13371"
            ]
          }
        ],
        "cities": [
          {
            "code": "SAN-ARI",
            "name": "Aricapampa",
            "zipCodes": [
              "13340",
              "13341"
            ]
          },
          {
            "code": "SAN-CHU",
            "name": "Chugay",
            "zipCodes": [
              "13330",
              "13331"
            ]
          },
          {
            "code": "SAN-CUR",
            "name": "Curgos",
            "zipCodes": [
              "13360",
              "13361"
            ]
          },
          {
            "code": "SAN-HUA",
            "name": "Huamachuco",
            "zipCodes": [
              "13300",
              "13301"
            ]
          },
          {
            "code": "SAN-MAR",
            "name": "Marcabal",
            "zipCodes": [
              "13320",
              "13321"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "Sanagoran",
            "zipCodes": [
              "13310",
              "13311"
            ]
          },
          {
            "code": "SAN-SAR",
            "name": "Sarin",
            "zipCodes": [
              "13370",
              "13371"
            ]
          },
          {
            "code": "SAN-SAR",
            "name": "Sartimbamba",
            "zipCodes": [
              "13350",
              "13351"
            ]
          }
        ]
      },
      {
        "code": "SAN",
        "name": "Santiago de Chucho",
        "districts": [
          {
            "code": "SAN-ANG",
            "name": "Angasmarca",
            "zipCodes": [
              "13160",
              "13161"
            ]
          },
          {
            "code": "SAN-CAC",
            "name": "Cachicadan",
            "zipCodes": [
              "13155",
              "13156"
            ]
          },
          {
            "code": "SAN-MOL",
            "name": "Mollebamba",
            "zipCodes": [
              "13165"
            ]
          },
          {
            "code": "SAN-MOL",
            "name": "Mollepata",
            "zipCodes": [
              "13170"
            ]
          },
          {
            "code": "SAN-QUI",
            "name": "Quiruvilca",
            "zipCodes": [
              "13140",
              "13141"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "Santa Cruz de Chuca",
            "zipCodes": [
              "13150"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "Santiago de Chuco",
            "zipCodes": [
              "13145",
              "13146"
            ]
          },
          {
            "code": "SAN-SIT",
            "name": "Sitabamba",
            "zipCodes": [
              "13380"
            ]
          }
        ],
        "cities": [
          {
            "code": "SAN-ANG",
            "name": "Angasmarca",
            "zipCodes": [
              "13160",
              "13161"
            ]
          },
          {
            "code": "SAN-CAC",
            "name": "Cachicadan",
            "zipCodes": [
              "13155",
              "13156"
            ]
          },
          {
            "code": "SAN-MOL",
            "name": "Mollebamba",
            "zipCodes": [
              "13165"
            ]
          },
          {
            "code": "SAN-MOL",
            "name": "Mollepata",
            "zipCodes": [
              "13170"
            ]
          },
          {
            "code": "SAN-QUI",
            "name": "Quiruvilca",
            "zipCodes": [
              "13140",
              "13141"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "Santa Cruz de Chuca",
            "zipCodes": [
              "13150"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "Santiago de Chuco",
            "zipCodes": [
              "13145",
              "13146"
            ]
          },
          {
            "code": "SAN-SIT",
            "name": "Sitabamba",
            "zipCodes": [
              "13380"
            ]
          }
        ]
      },
      {
        "code": "TRU",
        "name": "Trujillo",
        "districts": [
          {
            "code": "TRU-EL ",
            "name": "El Porvenir",
            "zipCodes": [
              "13002",
              "13003",
              "13004"
            ]
          },
          {
            "code": "TRU-FLO",
            "name": "Florencia de Mora",
            "zipCodes": [
              "13002",
              "13003"
            ]
          },
          {
            "code": "TRU-HUA",
            "name": "Huanchaco",
            "zipCodes": [
              "13000",
              "13011",
              "13014"
            ]
          },
          {
            "code": "TRU-LA ",
            "name": "La Esperanza",
            "zipCodes": [
              "13002",
              "13012",
              "13013",
              "13014"
            ]
          },
          {
            "code": "TRU-LAR",
            "name": "Laredo",
            "zipCodes": [
              "13100",
              "13101"
            ]
          },
          {
            "code": "PAT-MOC",
            "name": "Moche",
            "zipCodes": [
              "13600",
              "13601"
            ]
          },
          {
            "code": "OTU-POR",
            "name": "Poroto",
            "zipCodes": [
              "13125"
            ]
          },
          {
            "code": "PAT-SAL",
            "name": "Salaverry",
            "zipCodes": [
              "13610",
              "13611"
            ]
          },
          {
            "code": "TRU-SIM",
            "name": "Simbal",
            "zipCodes": [
              "13105"
            ]
          },
          {
            "code": "TRU-TRU",
            "name": "Trujillo",
            "zipCodes": [
              "13001",
              "13006",
              "13007",
              "13008",
              "13011"
            ]
          },
          {
            "code": "TRU-VÍC",
            "name": "Víctor Larco Herrera",
            "zipCodes": [
              "13008",
              "13009"
            ]
          }
        ],
        "cities": [
          {
            "code": "TRU-BUE",
            "name": "Buenos Aires",
            "zipCodes": [
              "13008",
              "13009"
            ]
          },
          {
            "code": "TRU-EL ",
            "name": "El Porvenir",
            "zipCodes": [
              "13002",
              "13003",
              "13004"
            ]
          },
          {
            "code": "TRU-FLO",
            "name": "Florencia de Mora",
            "zipCodes": [
              "13002",
              "13003"
            ]
          },
          {
            "code": "TRU-HUA",
            "name": "Huanchaco",
            "zipCodes": [
              "13000",
              "13011",
              "13014"
            ]
          },
          {
            "code": "TRU-LA ",
            "name": "La Esperanza",
            "zipCodes": [
              "13002",
              "13012",
              "13013",
              "13014"
            ]
          },
          {
            "code": "TRU-LAR",
            "name": "Laredo",
            "zipCodes": [
              "13100",
              "13101"
            ]
          },
          {
            "code": "PAT-MOC",
            "name": "Moche",
            "zipCodes": [
              "13600",
              "13601"
            ]
          },
          {
            "code": "OTU-POR",
            "name": "Poroto",
            "zipCodes": [
              "13125"
            ]
          },
          {
            "code": "PAT-SAL",
            "name": "Salaverry",
            "zipCodes": [
              "13610",
              "13611"
            ]
          },
          {
            "code": "TRU-SIM",
            "name": "Simbal",
            "zipCodes": [
              "13105"
            ]
          },
          {
            "code": "TRU-TRU",
            "name": "Trujillo",
            "zipCodes": [
              "13001",
              "13006",
              "13007",
              "13008",
              "13011"
            ]
          }
        ]
      },
      {
        "code": "VIR",
        "name": "Viru",
        "districts": [
          {
            "code": "VIR-CHA",
            "name": "Chao",
            "zipCodes": [
              "13630",
              "13631"
            ]
          },
          {
            "code": "VIR-GUA",
            "name": "Guadalupito",
            "zipCodes": [
              "13640",
              "13641"
            ]
          },
          {
            "code": "VIR-VIR",
            "name": "Virú",
            "zipCodes": [
              "13620",
              "13621"
            ]
          }
        ],
        "cities": [
          {
            "code": "VIR-CHA",
            "name": "Chao",
            "zipCodes": [
              "13630",
              "13631"
            ]
          },
          {
            "code": "VIR-GUA",
            "name": "Guadalupito",
            "zipCodes": [
              "13640",
              "13641"
            ]
          },
          {
            "code": "VIR-VIR",
            "name": "Viru",
            "zipCodes": [
              "13620",
              "13621"
            ]
          }
        ]
      }
    ]
  },
  {
    "code": "LAM",
    "name": "Lambayeque",
    "provinces": [
      {
        "code": "CHI",
        "name": "Chiclayo",
        "districts": [
          {
            "code": "FER-CAY",
            "name": "Cayalti",
            "zipCodes": [
              "14720",
              "14721"
            ]
          },
          {
            "code": "CHI-CHI",
            "name": "Chiclayo",
            "zipCodes": [
              "14001",
              "14002",
              "14004",
              "14006",
              "14008",
              "14009",
              "14011",
              "14012"
            ]
          },
          {
            "code": "FER-CHO",
            "name": "Chongoyape",
            "zipCodes": [
              "14620",
              "14621"
            ]
          },
          {
            "code": "FER-ETÉ",
            "name": "Etén",
            "zipCodes": [
              "14820",
              "14821"
            ]
          },
          {
            "code": "FER-ETÉ",
            "name": "Etén Puerto",
            "zipCodes": [
              "14810"
            ]
          },
          {
            "code": "CHI-JOS",
            "name": "José Leonardo Ortíz",
            "zipCodes": [
              "14002",
              "14003",
              "14004"
            ]
          },
          {
            "code": "CHI-LA ",
            "name": "La Victoria",
            "zipCodes": [
              "14007",
              "14008"
            ]
          },
          {
            "code": "FER-LAG",
            "name": "Lagunas",
            "zipCodes": [
              "14700",
              "14701"
            ]
          },
          {
            "code": "FER-MON",
            "name": "Monsefú",
            "zipCodes": [
              "14830",
              "14831"
            ]
          },
          {
            "code": "FER-NUE",
            "name": "Nueva Arica",
            "zipCodes": [
              "14730"
            ]
          },
          {
            "code": "FER-OYO",
            "name": "Oyotun",
            "zipCodes": [
              "14740",
              "14741"
            ]
          },
          {
            "code": "FER-PAT",
            "name": "Patapo",
            "zipCodes": [
              "14610",
              "14611"
            ]
          },
          {
            "code": "LAM-PIC",
            "name": "Picsi",
            "zipCodes": [
              "14300",
              "14301"
            ]
          },
          {
            "code": "CHI-PIM",
            "name": "Pimentel",
            "zipCodes": [
              "14012"
            ]
          },
          {
            "code": "CHI-POM",
            "name": "Pomalca",
            "zipCodes": [
              "14006"
            ]
          },
          {
            "code": "FER-PUC",
            "name": "Pucalá",
            "zipCodes": [
              "14630",
              "14631"
            ]
          },
          {
            "code": "FER-REQ",
            "name": "Reque",
            "zipCodes": [
              "14800",
              "14801"
            ]
          },
          {
            "code": "FER-SAN",
            "name": "Santa Rosa",
            "zipCodes": [
              "14840",
              "14841"
            ]
          },
          {
            "code": "FER-SAÑ",
            "name": "Saña",
            "zipCodes": [
              "14710",
              "14711"
            ]
          },
          {
            "code": "FER-TUM",
            "name": "Tumán",
            "zipCodes": [
              "14600",
              "14601"
            ]
          }
        ],
        "cities": [
          {
            "code": "FER-CAY",
            "name": "Cayalti",
            "zipCodes": [
              "14720",
              "14721"
            ]
          },
          {
            "code": "CHI-CHI",
            "name": "Chiclayo",
            "zipCodes": [
              "14001",
              "14002",
              "14004",
              "14006",
              "14008",
              "14009",
              "14011",
              "14012"
            ]
          },
          {
            "code": "FER-CHO",
            "name": "Chongoyape",
            "zipCodes": [
              "14620",
              "14621"
            ]
          },
          {
            "code": "FER-ETE",
            "name": "Eten",
            "zipCodes": [
              "14820",
              "14821"
            ]
          },
          {
            "code": "FER-ETE",
            "name": "Eten Puerto",
            "zipCodes": [
              "14810"
            ]
          },
          {
            "code": "CHI-JOS",
            "name": "Jose Leonardo Ortiz",
            "zipCodes": [
              "14002",
              "14003",
              "14004"
            ]
          },
          {
            "code": "CHI-LA ",
            "name": "La Victoria",
            "zipCodes": [
              "14007",
              "14008"
            ]
          },
          {
            "code": "FER-MOC",
            "name": "Mocupe",
            "zipCodes": [
              "14700",
              "14701"
            ]
          },
          {
            "code": "FER-MON",
            "name": "Monsefu",
            "zipCodes": [
              "14830",
              "14831"
            ]
          },
          {
            "code": "FER-NUE",
            "name": "Nueva Arica",
            "zipCodes": [
              "14730"
            ]
          },
          {
            "code": "FER-OYO",
            "name": "Oyotun",
            "zipCodes": [
              "14740",
              "14741"
            ]
          },
          {
            "code": "FER-PAT",
            "name": "Patapo",
            "zipCodes": [
              "14610",
              "14611"
            ]
          },
          {
            "code": "LAM-PIC",
            "name": "Picsi",
            "zipCodes": [
              "14300",
              "14301"
            ]
          },
          {
            "code": "CHI-PIM",
            "name": "Pimentel",
            "zipCodes": [
              "14012"
            ]
          },
          {
            "code": "CHI-POM",
            "name": "Pomalca",
            "zipCodes": [
              "14006"
            ]
          },
          {
            "code": "FER-PUC",
            "name": "Pucala",
            "zipCodes": [
              "14630",
              "14631"
            ]
          },
          {
            "code": "FER-REQ",
            "name": "Reque",
            "zipCodes": [
              "14800",
              "14801"
            ]
          },
          {
            "code": "FER-SAN",
            "name": "Santa Rosa",
            "zipCodes": [
              "14840",
              "14841"
            ]
          },
          {
            "code": "FER-SAÑ",
            "name": "Saña",
            "zipCodes": [
              "14710",
              "14711"
            ]
          },
          {
            "code": "FER-TUM",
            "name": "Tuman",
            "zipCodes": [
              "14600",
              "14601"
            ]
          }
        ]
      },
      {
        "code": "CHI",
        "name": "Chiclayo, Lambayeque",
        "districts": [
          {
            "code": "CHI-JOS",
            "name": "José Leonardo Ortíz",
            "zipCodes": [
              "14000",
              "14013"
            ]
          },
          {
            "code": "CHI-LA ",
            "name": "La Victoria",
            "zipCodes": [
              "14000"
            ]
          },
          {
            "code": "CHI-LAM",
            "name": "Lambayeque",
            "zipCodes": [
              "14000",
              "14013"
            ]
          },
          {
            "code": "CHI-PIM",
            "name": "Pimentel",
            "zipCodes": [
              "14000"
            ]
          },
          {
            "code": "CHI-POM",
            "name": "Pomalca",
            "zipCodes": [
              "14000"
            ]
          },
          {
            "code": "CHI-SAN",
            "name": "San José",
            "zipCodes": [
              "14000"
            ]
          }
        ],
        "cities": [
          {
            "code": "CHI-JOS",
            "name": "Jose Leonardo Ortiz",
            "zipCodes": [
              "14000",
              "14013"
            ]
          },
          {
            "code": "CHI-LA ",
            "name": "La Victoria",
            "zipCodes": [
              "14000"
            ]
          },
          {
            "code": "CHI-LAM",
            "name": "Lambayeque",
            "zipCodes": [
              "14000",
              "14013"
            ]
          },
          {
            "code": "CHI-PIM",
            "name": "Pimentel",
            "zipCodes": [
              "14000"
            ]
          },
          {
            "code": "CHI-POM",
            "name": "Pomalca",
            "zipCodes": [
              "14000"
            ]
          },
          {
            "code": "CHI-SAN",
            "name": "San Jose",
            "zipCodes": [
              "14000"
            ]
          }
        ]
      },
      {
        "code": "FER",
        "name": "Ferreñafe",
        "districts": [
          {
            "code": "FER-CAÑ",
            "name": "Cañaris",
            "zipCodes": [
              "14500",
              "14501"
            ]
          },
          {
            "code": "FER-FER",
            "name": "Ferreñafe",
            "zipCodes": [
              "14310",
              "14311"
            ]
          },
          {
            "code": "FER-INC",
            "name": "Incahuasi",
            "zipCodes": [
              "14400",
              "14401"
            ]
          },
          {
            "code": "FER-MAN",
            "name": "Manuel Antonio Mesones Muro",
            "zipCodes": [
              "14330"
            ]
          },
          {
            "code": "FER-PIT",
            "name": "Pitipo",
            "zipCodes": [
              "14340",
              "14341"
            ]
          },
          {
            "code": "FER-PUE",
            "name": "Pueblo Nuevo",
            "zipCodes": [
              "14310",
              "14311"
            ]
          }
        ],
        "cities": [
          {
            "code": "FER-CAÑ",
            "name": "Cañaris",
            "zipCodes": [
              "14500",
              "14501"
            ]
          },
          {
            "code": "FER-FER",
            "name": "Ferreñafe",
            "zipCodes": [
              "14310",
              "14311"
            ]
          },
          {
            "code": "FER-INC",
            "name": "Incahuasi",
            "zipCodes": [
              "14400",
              "14401"
            ]
          },
          {
            "code": "FER-MAN",
            "name": "Manuel Antonio Mesones Muro",
            "zipCodes": [
              "14330"
            ]
          },
          {
            "code": "FER-PIT",
            "name": "Pitipo",
            "zipCodes": [
              "14340",
              "14341"
            ]
          },
          {
            "code": "FER-PUE",
            "name": "Pueblo Nuevo",
            "zipCodes": [
              "14310",
              "14311"
            ]
          }
        ]
      },
      {
        "code": "LAM",
        "name": "Lambayeque",
        "districts": [
          {
            "code": "LAM-CHO",
            "name": "Chochope",
            "zipCodes": [
              "14220"
            ]
          },
          {
            "code": "LAM-ILL",
            "name": "Illimo",
            "zipCodes": [
              "14130",
              "14131"
            ]
          },
          {
            "code": "LAM-JAY",
            "name": "Jayanca",
            "zipCodes": [
              "14150",
              "14151"
            ]
          },
          {
            "code": "LAM-MOC",
            "name": "Mochumi",
            "zipCodes": [
              "14110",
              "14111"
            ]
          },
          {
            "code": "LAM-MOR",
            "name": "Morrope",
            "zipCodes": [
              "14160",
              "14161"
            ]
          },
          {
            "code": "LAM-MOT",
            "name": "Motupe",
            "zipCodes": [
              "14200",
              "14201"
            ]
          },
          {
            "code": "LAM-OLM",
            "name": "Olmos",
            "zipCodes": [
              "14210",
              "14211"
            ]
          },
          {
            "code": "LAM-PAC",
            "name": "Pacora",
            "zipCodes": [
              "14140",
              "14141"
            ]
          },
          {
            "code": "LAM-SAL",
            "name": "Salas",
            "zipCodes": [
              "14230",
              "14231"
            ]
          },
          {
            "code": "LAM-SAN",
            "name": "San José",
            "zipCodes": [
              "14051"
            ]
          },
          {
            "code": "LAM-TUC",
            "name": "Tucumé",
            "zipCodes": [
              "14120",
              "14121"
            ]
          }
        ],
        "cities": [
          {
            "code": "LAM-CHO",
            "name": "Chochope",
            "zipCodes": [
              "14220"
            ]
          },
          {
            "code": "LAM-ILL",
            "name": "Illimo",
            "zipCodes": [
              "14130",
              "14131"
            ]
          },
          {
            "code": "LAM-JAY",
            "name": "Jayanca",
            "zipCodes": [
              "14150",
              "14151"
            ]
          },
          {
            "code": "LAM-MOC",
            "name": "Mochumi",
            "zipCodes": [
              "14110",
              "14111"
            ]
          },
          {
            "code": "LAM-MOR",
            "name": "Morrope",
            "zipCodes": [
              "14160",
              "14161"
            ]
          },
          {
            "code": "LAM-MOT",
            "name": "Motupe",
            "zipCodes": [
              "14200",
              "14201"
            ]
          },
          {
            "code": "LAM-OLM",
            "name": "Olmos",
            "zipCodes": [
              "14210",
              "14211"
            ]
          },
          {
            "code": "LAM-PAC",
            "name": "Pacora",
            "zipCodes": [
              "14140",
              "14141"
            ]
          },
          {
            "code": "LAM-SAL",
            "name": "Salas",
            "zipCodes": [
              "14230",
              "14231"
            ]
          },
          {
            "code": "LAM-SAN",
            "name": "San Jose",
            "zipCodes": [
              "14051"
            ]
          },
          {
            "code": "LAM-TUC",
            "name": "Tucume",
            "zipCodes": [
              "14120",
              "14121"
            ]
          }
        ]
      }
    ]
  },
  {
    "code": "LIM",
    "name": "Lima",
    "provinces": [
      {
        "code": "BAR",
        "name": "Barranca",
        "districts": [
          {
            "code": "BAR-BAR",
            "name": "Barranca",
            "zipCodes": [
              "15169",
              "15170"
            ]
          },
          {
            "code": "BAR-PAR",
            "name": "Paramonga",
            "zipCodes": [
              "15178",
              "15180"
            ]
          },
          {
            "code": "BAR-PAT",
            "name": "Pativilca",
            "zipCodes": [
              "15174",
              "15175"
            ]
          },
          {
            "code": "BAR-SUP",
            "name": "Supe",
            "zipCodes": [
              "15161",
              "15162"
            ]
          },
          {
            "code": "BAR-SUP",
            "name": "Supe Puerto",
            "zipCodes": [
              "15161",
              "15162"
            ]
          }
        ],
        "cities": [
          {
            "code": "BAR-BAR",
            "name": "Barranca",
            "zipCodes": [
              "15169",
              "15170"
            ]
          },
          {
            "code": "BAR-PAR",
            "name": "Paramonga",
            "zipCodes": [
              "15178",
              "15180"
            ]
          },
          {
            "code": "BAR-PAT",
            "name": "Pativilca",
            "zipCodes": [
              "15174",
              "15175"
            ]
          },
          {
            "code": "BAR-SUP",
            "name": "Supe",
            "zipCodes": [
              "15161",
              "15162"
            ]
          },
          {
            "code": "BAR-SUP",
            "name": "Supe Puerto",
            "zipCodes": [
              "15161",
              "15162"
            ]
          }
        ]
      },
      {
        "code": "CAJ",
        "name": "Cajatambo",
        "districts": [
          {
            "code": "CAJ-CAJ",
            "name": "Cajatambo",
            "zipCodes": [
              "15195"
            ]
          },
          {
            "code": "CAJ-COP",
            "name": "Copa",
            "zipCodes": [
              "15197"
            ]
          },
          {
            "code": "CAJ-GOR",
            "name": "Gorgor",
            "zipCodes": [
              "15190"
            ]
          },
          {
            "code": "CAJ-HUA",
            "name": "Huancapón",
            "zipCodes": [
              "15191"
            ]
          },
          {
            "code": "CAJ-MAN",
            "name": "Manas",
            "zipCodes": [
              "15185"
            ]
          }
        ],
        "cities": [
          {
            "code": "CAJ-CAJ",
            "name": "Cajatambo",
            "zipCodes": [
              "15195"
            ]
          },
          {
            "code": "CAJ-COP",
            "name": "Copa",
            "zipCodes": [
              "15197"
            ]
          },
          {
            "code": "CAJ-GOR",
            "name": "Gorgor",
            "zipCodes": [
              "15190"
            ]
          },
          {
            "code": "CAJ-HUA",
            "name": "Huancapon",
            "zipCodes": [
              "15191"
            ]
          },
          {
            "code": "CAJ-MAN",
            "name": "Manas",
            "zipCodes": [
              "15185"
            ]
          }
        ]
      },
      {
        "code": "CAN",
        "name": "Canta",
        "districts": [
          {
            "code": "CAN-ARA",
            "name": "Arahuay",
            "zipCodes": [
              "15340"
            ]
          },
          {
            "code": "CAN-CAN",
            "name": "Canta",
            "zipCodes": [
              "15360"
            ]
          },
          {
            "code": "CAN-HUA",
            "name": "Huamantanga",
            "zipCodes": [
              "15355"
            ]
          },
          {
            "code": "CAN-HUA",
            "name": "Huaros",
            "zipCodes": [
              "15365"
            ]
          },
          {
            "code": "CAN-LAC",
            "name": "Lachaqui",
            "zipCodes": [
              "15345"
            ]
          },
          {
            "code": "CAN-SAN",
            "name": "San Buenaventura",
            "zipCodes": [
              "15350"
            ]
          },
          {
            "code": "CAN-SAN",
            "name": "Santa Rosa de Quives",
            "zipCodes": [
              "15335",
              "15336"
            ]
          }
        ],
        "cities": [
          {
            "code": "CAN-ARA",
            "name": "Arahuay",
            "zipCodes": [
              "15340"
            ]
          },
          {
            "code": "CAN-CAN",
            "name": "Canta",
            "zipCodes": [
              "15360"
            ]
          },
          {
            "code": "CAN-HUA",
            "name": "Huamantanga",
            "zipCodes": [
              "15355"
            ]
          },
          {
            "code": "CAN-HUA",
            "name": "Huaros",
            "zipCodes": [
              "15365"
            ]
          },
          {
            "code": "CAN-LAC",
            "name": "Lachaqui",
            "zipCodes": [
              "15345"
            ]
          },
          {
            "code": "CAN-SAN",
            "name": "San Buenaventura",
            "zipCodes": [
              "15350"
            ]
          },
          {
            "code": "CAN-YAN",
            "name": "Yangas",
            "zipCodes": [
              "15335",
              "15336"
            ]
          }
        ]
      },
      {
        "code": "CAÑ",
        "name": "Cañete",
        "districts": [
          {
            "code": "YAU-ASI",
            "name": "Asia",
            "zipCodes": [
              "15689",
              "15690"
            ]
          },
          {
            "code": "CAÑ-CAL",
            "name": "Calango",
            "zipCodes": [
              "15615"
            ]
          },
          {
            "code": "YAU-CER",
            "name": "Cerro Azul",
            "zipCodes": [
              "15716",
              "15717"
            ]
          },
          {
            "code": "YAU-CHI",
            "name": "Chilca",
            "zipCodes": [
              "15870",
              "15871"
            ]
          },
          {
            "code": "YAU-COA",
            "name": "Coayllo",
            "zipCodes": [
              "15685"
            ]
          },
          {
            "code": "YAU-IMP",
            "name": "Imperial",
            "zipCodes": [
              "15700",
              "15701"
            ]
          },
          {
            "code": "YAU-LUN",
            "name": "Lunahuana",
            "zipCodes": [
              "15727"
            ]
          },
          {
            "code": "CAÑ-MAL",
            "name": "Mala",
            "zipCodes": [
              "15608",
              "15610"
            ]
          },
          {
            "code": "YAU-NUE",
            "name": "Nuevo Imperial",
            "zipCodes": [
              "15723",
              "15725"
            ]
          },
          {
            "code": "YAU-PAC",
            "name": "Pacarán",
            "zipCodes": [
              "15730"
            ]
          },
          {
            "code": "YAU-QUI",
            "name": "Quilmana",
            "zipCodes": [
              "15712",
              "15715"
            ]
          },
          {
            "code": "CAÑ-SAN",
            "name": "San Antonio",
            "zipCodes": [
              "15600"
            ]
          },
          {
            "code": "YAU-SAN",
            "name": "San Luis",
            "zipCodes": [
              "15719",
              "15720"
            ]
          },
          {
            "code": "YAU-SAN",
            "name": "San Vicente de Cañete",
            "zipCodes": [
              "15700",
              "15701"
            ]
          },
          {
            "code": "CAÑ-SAN",
            "name": "Santa Cruz de Flores",
            "zipCodes": [
              "15605"
            ]
          },
          {
            "code": "YAU-ZUÑ",
            "name": "Zuñiga",
            "zipCodes": [
              "15735"
            ]
          }
        ],
        "cities": [
          {
            "code": "YAU-ASI",
            "name": "Asia",
            "zipCodes": [
              "15689",
              "15690"
            ]
          },
          {
            "code": "CAÑ-CAL",
            "name": "Calango",
            "zipCodes": [
              "15615"
            ]
          },
          {
            "code": "YAU-CER",
            "name": "Cerro Azul",
            "zipCodes": [
              "15716",
              "15717"
            ]
          },
          {
            "code": "YAU-CHI",
            "name": "Chilca",
            "zipCodes": [
              "15870",
              "15871"
            ]
          },
          {
            "code": "YAU-COA",
            "name": "Coayllo",
            "zipCodes": [
              "15685"
            ]
          },
          {
            "code": "YAU-IMP",
            "name": "Imperial",
            "zipCodes": [
              "15700",
              "15701"
            ]
          },
          {
            "code": "YAU-LUN",
            "name": "Lunahuana",
            "zipCodes": [
              "15727"
            ]
          },
          {
            "code": "CAÑ-MAL",
            "name": "Mala",
            "zipCodes": [
              "15608",
              "15610"
            ]
          },
          {
            "code": "YAU-NUE",
            "name": "Nuevo Imperial",
            "zipCodes": [
              "15723",
              "15725"
            ]
          },
          {
            "code": "YAU-PAC",
            "name": "Pacaran",
            "zipCodes": [
              "15730"
            ]
          },
          {
            "code": "YAU-QUI",
            "name": "Quilmana",
            "zipCodes": [
              "15712",
              "15715"
            ]
          },
          {
            "code": "CAÑ-SAN",
            "name": "San Antonio",
            "zipCodes": [
              "15600"
            ]
          },
          {
            "code": "YAU-SAN",
            "name": "San Luis",
            "zipCodes": [
              "15719",
              "15720"
            ]
          },
          {
            "code": "YAU-SAN",
            "name": "San Vicente de Cañete",
            "zipCodes": [
              "15700",
              "15701"
            ]
          },
          {
            "code": "CAÑ-SAN",
            "name": "Santa Cruz de Flores",
            "zipCodes": [
              "15605"
            ]
          },
          {
            "code": "YAU-ZUÑ",
            "name": "Zuñiga",
            "zipCodes": [
              "15735"
            ]
          }
        ]
      },
      {
        "code": "HUA",
        "name": "Huaral",
        "districts": [
          {
            "code": "CAJ-ATA",
            "name": "Atavillos Alto",
            "zipCodes": [
              "15225"
            ]
          },
          {
            "code": "CAJ-ATA",
            "name": "Atavillos Bajo",
            "zipCodes": [
              "15205"
            ]
          },
          {
            "code": "HUA-AUC",
            "name": "Aucallama",
            "zipCodes": [
              "15125",
              "15126"
            ]
          },
          {
            "code": "HUA-CHA",
            "name": "Chancay",
            "zipCodes": [
              "15130",
              "15131"
            ]
          },
          {
            "code": "CAJ-HUA",
            "name": "Huaral",
            "zipCodes": [
              "15200",
              "15201",
              "15202"
            ]
          },
          {
            "code": "CAJ-IHU",
            "name": "Ihuari",
            "zipCodes": [
              "15245"
            ]
          },
          {
            "code": "CAJ-LAM",
            "name": "Lampian",
            "zipCodes": [
              "15220"
            ]
          },
          {
            "code": "CAJ-PAC",
            "name": "Pacaraos",
            "zipCodes": [
              "15230"
            ]
          },
          {
            "code": "CAJ-SAN",
            "name": "San Miguel de Acos",
            "zipCodes": [
              "15215"
            ]
          },
          {
            "code": "CAJ-SAN",
            "name": "Santa Cruz de Andamarca",
            "zipCodes": [
              "15235"
            ]
          },
          {
            "code": "CAJ-SUM",
            "name": "Sumbilca",
            "zipCodes": [
              "15210"
            ]
          },
          {
            "code": "CAJ-VEI",
            "name": "Veintisiete de Noviembre",
            "zipCodes": [
              "15221"
            ]
          }
        ],
        "cities": [
          {
            "code": "CAJ-ACO",
            "name": "Acos",
            "zipCodes": [
              "15215"
            ]
          },
          {
            "code": "HUA-AUC",
            "name": "Aucallama",
            "zipCodes": [
              "15125",
              "15126"
            ]
          },
          {
            "code": "CAJ-CAR",
            "name": "Carac",
            "zipCodes": [
              "15221"
            ]
          },
          {
            "code": "HUA-CHA",
            "name": "Chancay",
            "zipCodes": [
              "15130",
              "15131"
            ]
          },
          {
            "code": "CAJ-HUA",
            "name": "Huaral",
            "zipCodes": [
              "15200",
              "15201",
              "15202"
            ]
          },
          {
            "code": "CAJ-IHU",
            "name": "Ihuari",
            "zipCodes": [
              "15245"
            ]
          },
          {
            "code": "CAJ-LAM",
            "name": "Lampian",
            "zipCodes": [
              "15220"
            ]
          },
          {
            "code": "CAJ-PAC",
            "name": "Pacaraos",
            "zipCodes": [
              "15230"
            ]
          },
          {
            "code": "CAJ-PIR",
            "name": "Pirca",
            "zipCodes": [
              "15225"
            ]
          },
          {
            "code": "CAJ-SAN",
            "name": "San Agustin de Huayopampa",
            "zipCodes": [
              "15205"
            ]
          },
          {
            "code": "CAJ-SAN",
            "name": "Santa Cruz de Andamarca",
            "zipCodes": [
              "15235"
            ]
          },
          {
            "code": "CAJ-SUM",
            "name": "Sumbilca",
            "zipCodes": [
              "15210"
            ]
          }
        ]
      },
      {
        "code": "HUA",
        "name": "Huarochiri",
        "districts": [
          {
            "code": "HUA-ANT",
            "name": "Antioquía",
            "zipCodes": [
              "15586"
            ]
          },
          {
            "code": "HUA-CAL",
            "name": "Callahuanca",
            "zipCodes": [
              "15505"
            ]
          },
          {
            "code": "HUA-CAR",
            "name": "Carampoma",
            "zipCodes": [
              "15525"
            ]
          },
          {
            "code": "HUA-CHI",
            "name": "Chicla",
            "zipCodes": [
              "15564",
              "15565"
            ]
          },
          {
            "code": "HUA-CUE",
            "name": "Cuenca",
            "zipCodes": [
              "15585"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huachupampa",
            "zipCodes": [
              "15516"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huanza",
            "zipCodes": [
              "15535"
            ]
          },
          {
            "code": "YAU-HUA",
            "name": "Huarochiri",
            "zipCodes": [
              "15635"
            ]
          },
          {
            "code": "HUA-LAH",
            "name": "Lahuaytambo",
            "zipCodes": [
              "15577"
            ]
          },
          {
            "code": "HUA-LAN",
            "name": "Langa",
            "zipCodes": [
              "15580"
            ]
          },
          {
            "code": "HUA-LAR",
            "name": "Laraos",
            "zipCodes": [
              "15530"
            ]
          },
          {
            "code": "YAU-MAR",
            "name": "Mariatana",
            "zipCodes": [
              "15630"
            ]
          },
          {
            "code": "HUA-MAT",
            "name": "Matucana",
            "zipCodes": [
              "15556"
            ]
          },
          {
            "code": "HUA-RIC",
            "name": "Ricardo Palma",
            "zipCodes": [
              "15536",
              "15537"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "San Andres de Tupicocha",
            "zipCodes": [
              "15571"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "San Antonio",
            "zipCodes": [
              "15510"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "San Bartolomé",
            "zipCodes": [
              "15550"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "San Damian",
            "zipCodes": [
              "15575"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "San Juan de Irís",
            "zipCodes": [
              "15520"
            ]
          },
          {
            "code": "YAU-SAN",
            "name": "San Juan de Tantaranche",
            "zipCodes": [
              "15650"
            ]
          },
          {
            "code": "YAU-SAN",
            "name": "San Lorenzo de Quinti",
            "zipCodes": [
              "15640"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "San Mateo",
            "zipCodes": [
              "15560",
              "15561"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "San Mateo de Otao",
            "zipCodes": [
              "15540"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "San Pedro de Casta",
            "zipCodes": [
              "15515"
            ]
          },
          {
            "code": "YAU-SAN",
            "name": "San Pedro de Huancayre",
            "zipCodes": [
              "15641"
            ]
          },
          {
            "code": "YAU-SAN",
            "name": "Sangallaya",
            "zipCodes": [
              "15625"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "Santa Cruz de Cocachacra",
            "zipCodes": [
              "15545"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "Santa Eulalia",
            "zipCodes": [
              "15500",
              "15501"
            ]
          },
          {
            "code": "YAU-SAN",
            "name": "Santiago de Anchucaya",
            "zipCodes": [
              "15645"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "Santiago de Tuna",
            "zipCodes": [
              "15570"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "Santo Domingo de los Olleros",
            "zipCodes": [
              "15590"
            ]
          },
          {
            "code": "HUA-SUR",
            "name": "Surco",
            "zipCodes": [
              "15555"
            ]
          }
        ],
        "cities": [
          {
            "code": "HUA-ANT",
            "name": "Antioquia",
            "zipCodes": [
              "15586"
            ]
          },
          {
            "code": "HUA-CAL",
            "name": "Callahuanca",
            "zipCodes": [
              "15505"
            ]
          },
          {
            "code": "HUA-CAR",
            "name": "Carampoma",
            "zipCodes": [
              "15525"
            ]
          },
          {
            "code": "HUA-CHA",
            "name": "Chaclla",
            "zipCodes": [
              "15510"
            ]
          },
          {
            "code": "HUA-CHI",
            "name": "Chicla",
            "zipCodes": [
              "15564",
              "15565"
            ]
          },
          {
            "code": "HUA-COC",
            "name": "Cocachacra",
            "zipCodes": [
              "15545"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huanza",
            "zipCodes": [
              "15535"
            ]
          },
          {
            "code": "YAU-HUA",
            "name": "Huarochiri",
            "zipCodes": [
              "15635"
            ]
          },
          {
            "code": "HUA-LAH",
            "name": "Lahuaytambo",
            "zipCodes": [
              "15577"
            ]
          },
          {
            "code": "HUA-LAN",
            "name": "Langa",
            "zipCodes": [
              "15580"
            ]
          },
          {
            "code": "HUA-LAR",
            "name": "Laraos",
            "zipCodes": [
              "15530"
            ]
          },
          {
            "code": "YAU-MAR",
            "name": "Mariatana",
            "zipCodes": [
              "15630"
            ]
          },
          {
            "code": "HUA-MAT",
            "name": "Matucana",
            "zipCodes": [
              "15556"
            ]
          },
          {
            "code": "HUA-RIC",
            "name": "Ricardo Palma",
            "zipCodes": [
              "15536",
              "15537"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "San Andres de Tupicocha",
            "zipCodes": [
              "15571"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "San Bartolome",
            "zipCodes": [
              "15550"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "San Damian",
            "zipCodes": [
              "15575"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "San Jose de los Chorrillos",
            "zipCodes": [
              "15585"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "San Juan de Iris",
            "zipCodes": [
              "15520"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "San Juan de Lanca",
            "zipCodes": [
              "15540"
            ]
          },
          {
            "code": "YAU-SAN",
            "name": "San Juan de Tantaranche",
            "zipCodes": [
              "15650"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "San Lorenzo de Huachupampa",
            "zipCodes": [
              "15516"
            ]
          },
          {
            "code": "YAU-SAN",
            "name": "San Lorenzo de Quinti",
            "zipCodes": [
              "15640"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "San Mateo",
            "zipCodes": [
              "15560",
              "15561"
            ]
          },
          {
            "code": "YAU-SAN",
            "name": "San Pedro",
            "zipCodes": [
              "15641"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "San Pedro de Casta",
            "zipCodes": [
              "15515"
            ]
          },
          {
            "code": "YAU-SAN",
            "name": "Sangallaya",
            "zipCodes": [
              "15625"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "Santa Eulalia",
            "zipCodes": [
              "15500",
              "15501"
            ]
          },
          {
            "code": "YAU-SAN",
            "name": "Santiago de Anchucaya",
            "zipCodes": [
              "15645"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "Santiago de Tuna",
            "zipCodes": [
              "15570"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "Santo Domingo de los Olleros",
            "zipCodes": [
              "15590"
            ]
          },
          {
            "code": "HUA-SUR",
            "name": "Surco",
            "zipCodes": [
              "15555"
            ]
          }
        ]
      },
      {
        "code": "HUA",
        "name": "Huaura",
        "districts": [
          {
            "code": "BAR-AMB",
            "name": "Ambar",
            "zipCodes": [
              "15182"
            ]
          },
          {
            "code": "HUA-CAL",
            "name": "Caleta de Carquín",
            "zipCodes": [
              "15138"
            ]
          },
          {
            "code": "OYÓ-CHE",
            "name": "Checras",
            "zipCodes": [
              "15280"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huacho",
            "zipCodes": [
              "15135",
              "15136",
              "15137",
              "15138"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Hualmay",
            "zipCodes": [
              "15137",
              "15138"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huaura",
            "zipCodes": [
              "15135",
              "15138"
            ]
          },
          {
            "code": "CAJ-LEO",
            "name": "Leoncio Prado",
            "zipCodes": [
              "15246"
            ]
          },
          {
            "code": "OYÓ-PAC",
            "name": "Paccho",
            "zipCodes": [
              "15255"
            ]
          },
          {
            "code": "OYÓ-SAN",
            "name": "Santa Leonor",
            "zipCodes": [
              "15285"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "Santa María",
            "zipCodes": [
              "15135",
              "15137",
              "15138"
            ]
          },
          {
            "code": "CAJ-SAY",
            "name": "Sayán",
            "zipCodes": [
              "15237",
              "15240"
            ]
          },
          {
            "code": "HUA-VEG",
            "name": "Vegueta",
            "zipCodes": [
              "15157",
              "15160"
            ]
          }
        ],
        "cities": [
          {
            "code": "BAR-AMB",
            "name": "Ambar",
            "zipCodes": [
              "15182"
            ]
          },
          {
            "code": "HUA-CAL",
            "name": "Caleta de Carquin",
            "zipCodes": [
              "15138"
            ]
          },
          {
            "code": "HUA-CRU",
            "name": "Cruz Blanca",
            "zipCodes": [
              "15135",
              "15137",
              "15138"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huacho",
            "zipCodes": [
              "15135",
              "15136",
              "15137",
              "15138"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Hualmay",
            "zipCodes": [
              "15137",
              "15138"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huaura",
            "zipCodes": [
              "15135",
              "15138"
            ]
          },
          {
            "code": "OYÓ-JUC",
            "name": "Jucul",
            "zipCodes": [
              "15285"
            ]
          },
          {
            "code": "OYÓ-MAR",
            "name": "Maray",
            "zipCodes": [
              "15280"
            ]
          },
          {
            "code": "OYÓ-PAC",
            "name": "Paccho",
            "zipCodes": [
              "15255"
            ]
          },
          {
            "code": "CAJ-SAN",
            "name": "Santa Cruz",
            "zipCodes": [
              "15246"
            ]
          },
          {
            "code": "CAJ-SAY",
            "name": "Sayan",
            "zipCodes": [
              "15237",
              "15240"
            ]
          },
          {
            "code": "HUA-VEG",
            "name": "Vegueta",
            "zipCodes": [
              "15157",
              "15160"
            ]
          }
        ]
      },
      {
        "code": "LIM",
        "name": "Lima",
        "districts": [
          {
            "code": "LIM-ANC",
            "name": "Ancón",
            "zipCodes": [
              "15123"
            ]
          },
          {
            "code": "LIM-ATE",
            "name": "Ate",
            "zipCodes": [
              "15004",
              "15011",
              "15012",
              "15019",
              "15022",
              "15023",
              "15026",
              "15476",
              "15479",
              "15483",
              "15487",
              "15491",
              "15494",
              "15498"
            ]
          },
          {
            "code": "LIM-BAR",
            "name": "Barranco",
            "zipCodes": [
              "15047",
              "15049",
              "15063"
            ]
          },
          {
            "code": "LIM-BRE",
            "name": "Breña",
            "zipCodes": [
              "15082",
              "15083"
            ]
          },
          {
            "code": "LIM-CAR",
            "name": "Carabayllo",
            "zipCodes": [
              "15121",
              "15122",
              "15313",
              "15316",
              "15318",
              "15319",
              "15320",
              "15321",
              "15324"
            ]
          },
          {
            "code": "CAN-CHA",
            "name": "Chaclacayo",
            "zipCodes": [
              "15472",
              "15476"
            ]
          },
          {
            "code": "LIM-CHO",
            "name": "Chorrillos",
            "zipCodes": [
              "15054",
              "15056",
              "15057",
              "15058",
              "15063",
              "15064",
              "15066",
              "15067"
            ]
          },
          {
            "code": "HUA-CIE",
            "name": "Cieneguilla",
            "zipCodes": [
              "15593",
              "15594"
            ]
          },
          {
            "code": "OYÓ-COM",
            "name": "Comas",
            "zipCodes": [
              "15311",
              "15312",
              "15313",
              "15314",
              "15316",
              "15324",
              "15326",
              "15327",
              "15328",
              "15332"
            ]
          },
          {
            "code": "LIM-EL ",
            "name": "El Agustino",
            "zipCodes": [
              "15003",
              "15004",
              "15006",
              "15007",
              "15008",
              "15009",
              "15011",
              "15018",
              "15022"
            ]
          },
          {
            "code": "OYÓ-IND",
            "name": "Independencia",
            "zipCodes": [
              "15311",
              "15328",
              "15331",
              "15332",
              "15333"
            ]
          },
          {
            "code": "LIM-JES",
            "name": "Jesús María",
            "zipCodes": [
              "15046",
              "15072",
              "15073",
              "15076",
              "15083",
              "15084"
            ]
          },
          {
            "code": "LIM-LA ",
            "name": "La Molina",
            "zipCodes": [
              "15012",
              "15023",
              "15024",
              "15026"
            ]
          },
          {
            "code": "LIM-LA ",
            "name": "La Victoria",
            "zipCodes": [
              "15018",
              "15019",
              "15033",
              "15034"
            ]
          },
          {
            "code": "LIM-LIM",
            "name": "Lima",
            "zipCodes": [
              "15001",
              "15003",
              "15004",
              "15006",
              "15018",
              "15019",
              "15046",
              "15072",
              "15079",
              "15081",
              "15082",
              "15083",
              "15088"
            ]
          },
          {
            "code": "LIM-LIN",
            "name": "Lince",
            "zipCodes": [
              "15046",
              "15072",
              "15073",
              "15076"
            ]
          },
          {
            "code": "LIM-LOS",
            "name": "Los Olivos",
            "zipCodes": [
              "15113",
              "15301",
              "15302",
              "15304",
              "15306",
              "15307",
              "15311",
              "15314"
            ]
          },
          {
            "code": "CAN-LUR",
            "name": "Lurigancho",
            "zipCodes": [
              "15457",
              "15461",
              "15464",
              "15468",
              "15472"
            ]
          },
          {
            "code": "YAU-LUR",
            "name": "Lurín",
            "zipCodes": [
              "15822",
              "15823",
              "15841",
              "15842",
              "15846"
            ]
          },
          {
            "code": "LIM-MAG",
            "name": "Magdalena Vieja",
            "zipCodes": [
              "15083",
              "15084",
              "15086",
              "15088"
            ]
          },
          {
            "code": "LIM-MAG",
            "name": "Magdalena del Mar",
            "zipCodes": [
              "15076",
              "15086"
            ]
          },
          {
            "code": "LIM-MIR",
            "name": "Miraflores",
            "zipCodes": [
              "15046",
              "15047",
              "15048",
              "15073",
              "15074",
              "15076"
            ]
          },
          {
            "code": "HUA-PAC",
            "name": "Pachacamac",
            "zipCodes": [
              "15593",
              "15594",
              "15823"
            ]
          },
          {
            "code": "YAU-PUC",
            "name": "Pucusana",
            "zipCodes": [
              "15865",
              "15866"
            ]
          },
          {
            "code": "LIM-PUE",
            "name": "Puente Piedra",
            "zipCodes": [
              "15113",
              "15116",
              "15117",
              "15118",
              "15121",
              "15122"
            ]
          },
          {
            "code": "YAU-PUN",
            "name": "Punta Hermosa",
            "zipCodes": [
              "15845",
              "15846"
            ]
          },
          {
            "code": "YAU-PUN",
            "name": "Punta Negra",
            "zipCodes": [
              "15850",
              "15851"
            ]
          },
          {
            "code": "LIM-RIM",
            "name": "Rimac",
            "zipCodes": [
              "15093",
              "15094",
              "15096",
              "15333"
            ]
          },
          {
            "code": "YAU-SAN",
            "name": "San Bartolo",
            "zipCodes": [
              "15855",
              "15856"
            ]
          },
          {
            "code": "LIM-SAN",
            "name": "San Borja",
            "zipCodes": [
              "15021",
              "15034",
              "15036",
              "15037"
            ]
          },
          {
            "code": "LIM-SAN",
            "name": "San Isidro",
            "zipCodes": [
              "15036",
              "15046",
              "15047",
              "15072",
              "15073",
              "15074",
              "15076"
            ]
          },
          {
            "code": "CAN-SAN",
            "name": "San Juan de Lurigancho",
            "zipCodes": [
              "15401",
              "15404",
              "15408",
              "15412",
              "15416",
              "15419",
              "15423",
              "15427",
              "15431",
              "15434",
              "15438",
              "15442",
              "15446",
              "15449",
              "15453",
              "15457"
            ]
          },
          {
            "code": "LIM-SAN",
            "name": "San Juan de Miraflores",
            "zipCodes": [
              "15056",
              "15058",
              "15801",
              "15803",
              "15804",
              "15806",
              "15809",
              "15824",
              "15828",
              "15829",
              "15842"
            ]
          },
          {
            "code": "LIM-SAN",
            "name": "San Luis",
            "zipCodes": [
              "15004",
              "15019",
              "15021",
              "15022"
            ]
          },
          {
            "code": "LIM-SAN",
            "name": "San Martin de Porres",
            "zipCodes": [
              "15101",
              "15102",
              "15103",
              "15106",
              "15107",
              "15108",
              "15109",
              "15112",
              "15113"
            ]
          },
          {
            "code": "LIM-SAN",
            "name": "San Miguel",
            "zipCodes": [
              "15084",
              "15086",
              "15087",
              "15088"
            ]
          },
          {
            "code": "LIM-SAN",
            "name": "Santa Anita",
            "zipCodes": [
              "15007",
              "15008",
              "15009",
              "15011",
              "15498"
            ]
          },
          {
            "code": "YAU-SAN",
            "name": "Santa Maria del Mar",
            "zipCodes": [
              "15861"
            ]
          },
          {
            "code": "LIM-SAN",
            "name": "Santa Rosa",
            "zipCodes": [
              "15123"
            ]
          },
          {
            "code": "LIM-SAN",
            "name": "Santiago de Surco",
            "zipCodes": [
              "15023",
              "15024",
              "15037",
              "15038",
              "15039",
              "15047",
              "15048",
              "15049",
              "15054",
              "15056",
              "15063",
              "15064",
              "15803"
            ]
          },
          {
            "code": "LIM-SUR",
            "name": "Surquillo",
            "zipCodes": [
              "15036",
              "15037",
              "15038",
              "15047",
              "15048"
            ]
          },
          {
            "code": "YAU-VIL",
            "name": "Villa Maria del Triunfo",
            "zipCodes": [
              "15803",
              "15804",
              "15809",
              "15811",
              "15812",
              "15816",
              "15817",
              "15818",
              "15822",
              "15824",
              "15828"
            ]
          },
          {
            "code": "YAU-VIL",
            "name": "Villa el Salvador",
            "zipCodes": [
              "15816",
              "15828",
              "15829",
              "15831",
              "15834",
              "15836",
              "15837",
              "15841",
              "15842"
            ]
          }
        ],
        "cities": [
          {
            "code": "LIM-ANC",
            "name": "Ancon",
            "zipCodes": [
              "15123"
            ]
          },
          {
            "code": "LIM-BAR",
            "name": "Barranco",
            "zipCodes": [
              "15047",
              "15049",
              "15063"
            ]
          },
          {
            "code": "LIM-BAR",
            "name": "Barrio Obrero Industrial",
            "zipCodes": [
              "15101",
              "15102",
              "15103",
              "15106",
              "15107",
              "15108",
              "15109",
              "15112",
              "15113"
            ]
          },
          {
            "code": "LIM-BRE",
            "name": "Breña",
            "zipCodes": [
              "15082",
              "15083"
            ]
          },
          {
            "code": "LIM-CAR",
            "name": "Carabayllo",
            "zipCodes": [
              "15121",
              "15122",
              "15313",
              "15316",
              "15318",
              "15319",
              "15320",
              "15321",
              "15324"
            ]
          },
          {
            "code": "CAN-CHA",
            "name": "Chaclacayo",
            "zipCodes": [
              "15472",
              "15476"
            ]
          },
          {
            "code": "LIM-CHO",
            "name": "Chorrillos",
            "zipCodes": [
              "15054",
              "15056",
              "15057",
              "15058",
              "15063",
              "15064",
              "15066",
              "15067"
            ]
          },
          {
            "code": "CAN-CHO",
            "name": "Chosica",
            "zipCodes": [
              "15457",
              "15461",
              "15464",
              "15468",
              "15472"
            ]
          },
          {
            "code": "HUA-CIE",
            "name": "Cieneguilla",
            "zipCodes": [
              "15593",
              "15594"
            ]
          },
          {
            "code": "LIM-CIU",
            "name": "Ciudad de Dios",
            "zipCodes": [
              "15056",
              "15058",
              "15801",
              "15803",
              "15804",
              "15806",
              "15809",
              "15824",
              "15828",
              "15829",
              "15842"
            ]
          },
          {
            "code": "LIM-EL ",
            "name": "El Agustino",
            "zipCodes": [
              "15003",
              "15004",
              "15006",
              "15007",
              "15008",
              "15009",
              "15011",
              "15018",
              "15022"
            ]
          },
          {
            "code": "OYÓ-IND",
            "name": "Independencia",
            "zipCodes": [
              "15311",
              "15328",
              "15331",
              "15332",
              "15333"
            ]
          },
          {
            "code": "LIM-JES",
            "name": "Jesus Maria",
            "zipCodes": [
              "15046",
              "15072",
              "15073",
              "15076",
              "15083",
              "15084"
            ]
          },
          {
            "code": "OYÓ-LA ",
            "name": "La Libertad",
            "zipCodes": [
              "15311",
              "15312",
              "15313",
              "15314",
              "15316",
              "15324",
              "15326",
              "15327",
              "15328",
              "15332"
            ]
          },
          {
            "code": "LIM-LA ",
            "name": "La Molina",
            "zipCodes": [
              "15012",
              "15023",
              "15024",
              "15026"
            ]
          },
          {
            "code": "LIM-LA ",
            "name": "La Victoria",
            "zipCodes": [
              "15018",
              "15019",
              "15033",
              "15034"
            ]
          },
          {
            "code": "LIM-LAS",
            "name": "Las Palmeras",
            "zipCodes": [
              "15113",
              "15301",
              "15302",
              "15304",
              "15306",
              "15307",
              "15311",
              "15314"
            ]
          },
          {
            "code": "LIM-LIM",
            "name": "Lima",
            "zipCodes": [
              "15001",
              "15003",
              "15004",
              "15006",
              "15018",
              "15019",
              "15046",
              "15072",
              "15079",
              "15081",
              "15082",
              "15083",
              "15088"
            ]
          },
          {
            "code": "LIM-LIN",
            "name": "Lince",
            "zipCodes": [
              "15046",
              "15072",
              "15073",
              "15076"
            ]
          },
          {
            "code": "YAU-LUR",
            "name": "Lurin",
            "zipCodes": [
              "15822",
              "15823",
              "15841",
              "15842",
              "15846"
            ]
          },
          {
            "code": "LIM-MAG",
            "name": "Magdalena del Mar",
            "zipCodes": [
              "15076",
              "15086"
            ]
          },
          {
            "code": "LIM-MIR",
            "name": "Miraflores",
            "zipCodes": [
              "15046",
              "15047",
              "15048",
              "15073",
              "15074",
              "15076"
            ]
          },
          {
            "code": "HUA-PAC",
            "name": "Pachacamac",
            "zipCodes": [
              "15593",
              "15594",
              "15823"
            ]
          },
          {
            "code": "YAU-PUC",
            "name": "Pucusana",
            "zipCodes": [
              "15865",
              "15866"
            ]
          },
          {
            "code": "LIM-PUE",
            "name": "Pueblo Libre",
            "zipCodes": [
              "15083",
              "15084",
              "15086",
              "15088"
            ]
          },
          {
            "code": "LIM-PUE",
            "name": "Puente Piedra",
            "zipCodes": [
              "15113",
              "15116",
              "15117",
              "15118",
              "15121",
              "15122"
            ]
          },
          {
            "code": "YAU-PUN",
            "name": "Punta Hermosa",
            "zipCodes": [
              "15845",
              "15846"
            ]
          },
          {
            "code": "YAU-PUN",
            "name": "Punta Negra",
            "zipCodes": [
              "15850",
              "15851"
            ]
          },
          {
            "code": "LIM-RIM",
            "name": "Rimac",
            "zipCodes": [
              "15093",
              "15094",
              "15096",
              "15333"
            ]
          },
          {
            "code": "YAU-SAN",
            "name": "San Bartolo",
            "zipCodes": [
              "15855",
              "15856"
            ]
          },
          {
            "code": "LIM-SAN",
            "name": "San Francisco de Borja",
            "zipCodes": [
              "15021",
              "15034",
              "15036",
              "15037"
            ]
          },
          {
            "code": "LIM-SAN",
            "name": "San Isidro",
            "zipCodes": [
              "15036",
              "15046",
              "15047",
              "15072",
              "15073",
              "15074",
              "15076"
            ]
          },
          {
            "code": "CAN-SAN",
            "name": "San Juan de Lurigancho",
            "zipCodes": [
              "15401",
              "15404",
              "15408",
              "15412",
              "15416",
              "15419",
              "15423",
              "15427",
              "15431",
              "15434",
              "15438",
              "15442",
              "15446",
              "15449",
              "15453",
              "15457"
            ]
          },
          {
            "code": "LIM-SAN",
            "name": "San Luis",
            "zipCodes": [
              "15004",
              "15019",
              "15021",
              "15022"
            ]
          },
          {
            "code": "LIM-SAN",
            "name": "San Miguel",
            "zipCodes": [
              "15084",
              "15086",
              "15087",
              "15088"
            ]
          },
          {
            "code": "LIM-SAN",
            "name": "Santa Anita - los Ficus",
            "zipCodes": [
              "15007",
              "15008",
              "15009",
              "15011",
              "15498"
            ]
          },
          {
            "code": "YAU-SAN",
            "name": "Santa Maria del Mar",
            "zipCodes": [
              "15861"
            ]
          },
          {
            "code": "LIM-SAN",
            "name": "Santa Rosa",
            "zipCodes": [
              "15123"
            ]
          },
          {
            "code": "LIM-SAN",
            "name": "Santiago de Surco",
            "zipCodes": [
              "15023",
              "15024",
              "15037",
              "15038",
              "15039",
              "15047",
              "15048",
              "15049",
              "15054",
              "15056",
              "15063",
              "15064",
              "15803"
            ]
          },
          {
            "code": "LIM-SUR",
            "name": "Surquillo",
            "zipCodes": [
              "15036",
              "15037",
              "15038",
              "15047",
              "15048"
            ]
          },
          {
            "code": "YAU-VIL",
            "name": "Villa Maria del Triunfo",
            "zipCodes": [
              "15803",
              "15804",
              "15809",
              "15811",
              "15812",
              "15816",
              "15817",
              "15818",
              "15822",
              "15824",
              "15828"
            ]
          },
          {
            "code": "YAU-VIL",
            "name": "Villa el Salvador",
            "zipCodes": [
              "15816",
              "15828",
              "15829",
              "15831",
              "15834",
              "15836",
              "15837",
              "15841",
              "15842"
            ]
          },
          {
            "code": "LIM-VIT",
            "name": "Vitarte",
            "zipCodes": [
              "15004",
              "15011",
              "15012",
              "15019",
              "15022",
              "15023",
              "15026",
              "15476",
              "15479",
              "15483",
              "15487",
              "15491",
              "15494",
              "15498"
            ]
          }
        ]
      },
      {
        "code": "OYÓ",
        "name": "Oyón",
        "districts": [
          {
            "code": "OYÓ-AND",
            "name": "Andajes",
            "zipCodes": [
              "15266"
            ]
          },
          {
            "code": "OYÓ-CAU",
            "name": "Caujul",
            "zipCodes": [
              "15265"
            ]
          },
          {
            "code": "OYÓ-COC",
            "name": "Cochamarca",
            "zipCodes": [
              "15250"
            ]
          },
          {
            "code": "OYÓ-NAV",
            "name": "Navan",
            "zipCodes": [
              "15260"
            ]
          },
          {
            "code": "OYÓ-OYÓ",
            "name": "Oyón",
            "zipCodes": [
              "15274",
              "15275"
            ]
          },
          {
            "code": "OYÓ-PAC",
            "name": "Pachangara",
            "zipCodes": [
              "15270"
            ]
          }
        ],
        "cities": [
          {
            "code": "OYÓ-AND",
            "name": "Andajes",
            "zipCodes": [
              "15266"
            ]
          },
          {
            "code": "OYÓ-CAU",
            "name": "Caujul",
            "zipCodes": [
              "15265"
            ]
          },
          {
            "code": "OYÓ-CHU",
            "name": "Churin",
            "zipCodes": [
              "15270"
            ]
          },
          {
            "code": "OYÓ-COC",
            "name": "Cochamarca",
            "zipCodes": [
              "15250"
            ]
          },
          {
            "code": "OYÓ-NAV",
            "name": "Navan",
            "zipCodes": [
              "15260"
            ]
          },
          {
            "code": "OYÓ-OYO",
            "name": "Oyon",
            "zipCodes": [
              "15274",
              "15275"
            ]
          }
        ]
      },
      {
        "code": "YAU",
        "name": "Yauyos",
        "districts": [
          {
            "code": "YAU-ALI",
            "name": "Alis",
            "zipCodes": [
              "15786"
            ]
          },
          {
            "code": "YAU-AYA",
            "name": "Ayauca",
            "zipCodes": [
              "15765"
            ]
          },
          {
            "code": "YAU-AYA",
            "name": "Ayavirí",
            "zipCodes": [
              "15675"
            ]
          },
          {
            "code": "YAU-AZA",
            "name": "Azangaro",
            "zipCodes": [
              "15740"
            ]
          },
          {
            "code": "YAU-CAC",
            "name": "Cacra",
            "zipCodes": [
              "15750"
            ]
          },
          {
            "code": "YAU-CAR",
            "name": "Carania",
            "zipCodes": [
              "15781"
            ]
          },
          {
            "code": "YAU-CAT",
            "name": "Catahuasi",
            "zipCodes": [
              "15760"
            ]
          },
          {
            "code": "YAU-CHO",
            "name": "Chocos",
            "zipCodes": [
              "15736"
            ]
          },
          {
            "code": "YAU-COC",
            "name": "Cochas",
            "zipCodes": [
              "15621"
            ]
          },
          {
            "code": "YAU-COL",
            "name": "Colonia",
            "zipCodes": [
              "15770"
            ]
          },
          {
            "code": "YAU-HON",
            "name": "Hongos",
            "zipCodes": [
              "15753"
            ]
          },
          {
            "code": "YAU-HUA",
            "name": "Huampara",
            "zipCodes": [
              "15670"
            ]
          },
          {
            "code": "YAU-HUA",
            "name": "Huancaya",
            "zipCodes": [
              "15796"
            ]
          },
          {
            "code": "YAU-HUA",
            "name": "Huangascar",
            "zipCodes": [
              "15748"
            ]
          },
          {
            "code": "YAU-HUA",
            "name": "Huantán",
            "zipCodes": [
              "15780"
            ]
          },
          {
            "code": "YAU-HUA",
            "name": "Huañec",
            "zipCodes": [
              "15661"
            ]
          },
          {
            "code": "YAU-LAR",
            "name": "Laraos",
            "zipCodes": [
              "15785"
            ]
          },
          {
            "code": "YAU-LIN",
            "name": "Lincha",
            "zipCodes": [
              "15755"
            ]
          },
          {
            "code": "YAU-MAD",
            "name": "Madean",
            "zipCodes": [
              "15742"
            ]
          },
          {
            "code": "YAU-MIR",
            "name": "Miraflores",
            "zipCodes": [
              "15792"
            ]
          },
          {
            "code": "YAU-OMA",
            "name": "Omas",
            "zipCodes": [
              "15681"
            ]
          },
          {
            "code": "YAU-PUT",
            "name": "Putinza",
            "zipCodes": [
              "15763"
            ]
          },
          {
            "code": "YAU-QUI",
            "name": "Quinches",
            "zipCodes": [
              "15665"
            ]
          },
          {
            "code": "YAU-QUI",
            "name": "Quinocay",
            "zipCodes": [
              "15620"
            ]
          },
          {
            "code": "YAU-SAN",
            "name": "San Joaquin",
            "zipCodes": [
              "15655"
            ]
          },
          {
            "code": "YAU-SAN",
            "name": "San Pedro de Pilas",
            "zipCodes": [
              "15680"
            ]
          },
          {
            "code": "YAU-TAN",
            "name": "Tanta",
            "zipCodes": [
              "15660"
            ]
          },
          {
            "code": "YAU-TAU",
            "name": "Tauripampa",
            "zipCodes": [
              "15768"
            ]
          },
          {
            "code": "YAU-TOM",
            "name": "Tomás",
            "zipCodes": [
              "15790"
            ]
          },
          {
            "code": "YAU-TUP",
            "name": "Tupe",
            "zipCodes": [
              "15761"
            ]
          },
          {
            "code": "YAU-VIT",
            "name": "Vitis",
            "zipCodes": [
              "15795"
            ]
          },
          {
            "code": "YAU-VIÑ",
            "name": "Viñac",
            "zipCodes": [
              "15745"
            ]
          },
          {
            "code": "YAU-YAU",
            "name": "Yauyos",
            "zipCodes": [
              "15775"
            ]
          }
        ],
        "cities": [
          {
            "code": "YAU-ALI",
            "name": "Alis",
            "zipCodes": [
              "15786"
            ]
          },
          {
            "code": "YAU-AYA",
            "name": "Ayauca",
            "zipCodes": [
              "15765"
            ]
          },
          {
            "code": "YAU-AYA",
            "name": "Ayaviri",
            "zipCodes": [
              "15675"
            ]
          },
          {
            "code": "YAU-AZA",
            "name": "Azangaro",
            "zipCodes": [
              "15740"
            ]
          },
          {
            "code": "YAU-CAC",
            "name": "Cacra",
            "zipCodes": [
              "15750"
            ]
          },
          {
            "code": "YAU-CAR",
            "name": "Carania",
            "zipCodes": [
              "15781"
            ]
          },
          {
            "code": "YAU-CAT",
            "name": "Catahuasi",
            "zipCodes": [
              "15760"
            ]
          },
          {
            "code": "YAU-CHO",
            "name": "Chocos",
            "zipCodes": [
              "15736"
            ]
          },
          {
            "code": "YAU-COC",
            "name": "Cochas",
            "zipCodes": [
              "15621"
            ]
          },
          {
            "code": "YAU-COL",
            "name": "Colonia",
            "zipCodes": [
              "15770"
            ]
          },
          {
            "code": "YAU-HON",
            "name": "Hongos",
            "zipCodes": [
              "15753"
            ]
          },
          {
            "code": "YAU-HUA",
            "name": "Huampara",
            "zipCodes": [
              "15670"
            ]
          },
          {
            "code": "YAU-HUA",
            "name": "Huancaya",
            "zipCodes": [
              "15796"
            ]
          },
          {
            "code": "YAU-HUA",
            "name": "Huangascar",
            "zipCodes": [
              "15748"
            ]
          },
          {
            "code": "YAU-HUA",
            "name": "Huantan",
            "zipCodes": [
              "15780"
            ]
          },
          {
            "code": "YAU-HUA",
            "name": "Huañec",
            "zipCodes": [
              "15661"
            ]
          },
          {
            "code": "YAU-LAR",
            "name": "Laraos",
            "zipCodes": [
              "15785"
            ]
          },
          {
            "code": "YAU-LIN",
            "name": "Lincha",
            "zipCodes": [
              "15755"
            ]
          },
          {
            "code": "YAU-MAD",
            "name": "Madean",
            "zipCodes": [
              "15742"
            ]
          },
          {
            "code": "YAU-MIR",
            "name": "Miraflores",
            "zipCodes": [
              "15792"
            ]
          },
          {
            "code": "YAU-OMA",
            "name": "Omas",
            "zipCodes": [
              "15681"
            ]
          },
          {
            "code": "YAU-QUI",
            "name": "Quinches",
            "zipCodes": [
              "15665"
            ]
          },
          {
            "code": "YAU-QUI",
            "name": "Quinocay",
            "zipCodes": [
              "15620"
            ]
          },
          {
            "code": "YAU-SAN",
            "name": "San Joaquin",
            "zipCodes": [
              "15655"
            ]
          },
          {
            "code": "YAU-SAN",
            "name": "San Lorenzo de Putinza",
            "zipCodes": [
              "15763"
            ]
          },
          {
            "code": "YAU-SAN",
            "name": "San Pedro de Pilas",
            "zipCodes": [
              "15680"
            ]
          },
          {
            "code": "YAU-TAN",
            "name": "Tanta",
            "zipCodes": [
              "15660"
            ]
          },
          {
            "code": "YAU-TAU",
            "name": "Tauripampa",
            "zipCodes": [
              "15768"
            ]
          },
          {
            "code": "YAU-TOM",
            "name": "Tomas",
            "zipCodes": [
              "15790"
            ]
          },
          {
            "code": "YAU-TUP",
            "name": "Tupe",
            "zipCodes": [
              "15761"
            ]
          },
          {
            "code": "YAU-VIT",
            "name": "Vitis",
            "zipCodes": [
              "15795"
            ]
          },
          {
            "code": "YAU-VIÑ",
            "name": "Viñac",
            "zipCodes": [
              "15745"
            ]
          },
          {
            "code": "YAU-YAU",
            "name": "Yauyos",
            "zipCodes": [
              "15775"
            ]
          }
        ]
      }
    ]
  },
  {
    "code": "LOR",
    "name": "Loreto",
    "provinces": [
      {
        "code": "ALT",
        "name": "Alto Amazonas",
        "districts": [
          {
            "code": "ALT-BAL",
            "name": "Balsapuerto",
            "zipCodes": [
              "16510",
              "16511"
            ]
          },
          {
            "code": "ALT-JEB",
            "name": "Jeberos",
            "zipCodes": [
              "16520"
            ]
          },
          {
            "code": "ALT-LAG",
            "name": "Lagunas",
            "zipCodes": [
              "16550",
              "16551"
            ]
          },
          {
            "code": "ALT-SAN",
            "name": "Santa Cruz",
            "zipCodes": [
              "16540"
            ]
          },
          {
            "code": "ALT-TEN",
            "name": "Teniente Cesar López Rojas",
            "zipCodes": [
              "16530",
              "16531"
            ]
          },
          {
            "code": "ALT-YUR",
            "name": "Yurimaguas",
            "zipCodes": [
              "16500",
              "16501"
            ]
          }
        ],
        "cities": [
          {
            "code": "ALT-BAL",
            "name": "Balsapuerto",
            "zipCodes": [
              "16510",
              "16511"
            ]
          },
          {
            "code": "ALT-JEB",
            "name": "Jeberos",
            "zipCodes": [
              "16520"
            ]
          },
          {
            "code": "ALT-LAG",
            "name": "Lagunas",
            "zipCodes": [
              "16550",
              "16551"
            ]
          },
          {
            "code": "ALT-SAN",
            "name": "Santa Cruz",
            "zipCodes": [
              "16540"
            ]
          },
          {
            "code": "ALT-SHU",
            "name": "Shucushuyacu",
            "zipCodes": [
              "16530",
              "16531"
            ]
          },
          {
            "code": "ALT-YUR",
            "name": "Yurimaguas",
            "zipCodes": [
              "16500",
              "16501"
            ]
          }
        ]
      },
      {
        "code": "DAT",
        "name": "Datem del Marañón",
        "districts": [
          {
            "code": "DAT-AND",
            "name": "Andoas",
            "zipCodes": [
              "16750",
              "16751"
            ]
          },
          {
            "code": "DAT-BAR",
            "name": "Barranca",
            "zipCodes": [
              "16600",
              "16601"
            ]
          },
          {
            "code": "DAT-CAH",
            "name": "Cahuapanas",
            "zipCodes": [
              "16610",
              "16611"
            ]
          },
          {
            "code": "DAT-MAN",
            "name": "Manseriche",
            "zipCodes": [
              "16620",
              "16621"
            ]
          },
          {
            "code": "DAT-MOR",
            "name": "Morona",
            "zipCodes": [
              "16630",
              "16631"
            ]
          },
          {
            "code": "DAT-PAS",
            "name": "Pastaza",
            "zipCodes": [
              "16700",
              "16701"
            ]
          }
        ],
        "cities": [
          {
            "code": "DAT-ALI",
            "name": "Alianza Cristiana",
            "zipCodes": [
              "16750",
              "16751"
            ]
          },
          {
            "code": "DAT-PUE",
            "name": "Puerto Alegria",
            "zipCodes": [
              "16630",
              "16631"
            ]
          },
          {
            "code": "DAT-SAN",
            "name": "San Lorenzo",
            "zipCodes": [
              "16600",
              "16601"
            ]
          },
          {
            "code": "DAT-SAN",
            "name": "Santa Maria de Cahuapanas",
            "zipCodes": [
              "16610",
              "16611"
            ]
          },
          {
            "code": "DAT-SAR",
            "name": "Saramiriza",
            "zipCodes": [
              "16620",
              "16621"
            ]
          },
          {
            "code": "DAT-ULL",
            "name": "Ullpayacu",
            "zipCodes": [
              "16700",
              "16701"
            ]
          }
        ]
      },
      {
        "code": "LOR",
        "name": "Loreto",
        "districts": [
          {
            "code": "LOR-NAU",
            "name": "Nauta",
            "zipCodes": [
              "16300",
              "16301"
            ]
          },
          {
            "code": "ALT-PAR",
            "name": "Parinari",
            "zipCodes": [
              "16570",
              "16571"
            ]
          },
          {
            "code": "DAT-TIG",
            "name": "Tigre",
            "zipCodes": [
              "16810",
              "16811"
            ]
          },
          {
            "code": "DAT-TRO",
            "name": "Trompeteros",
            "zipCodes": [
              "16820",
              "16821"
            ]
          },
          {
            "code": "ALT-URA",
            "name": "Urarinas",
            "zipCodes": [
              "16560",
              "16561"
            ]
          }
        ],
        "cities": [
          {
            "code": "ALT-CON",
            "name": "Concordia",
            "zipCodes": [
              "16560",
              "16561"
            ]
          },
          {
            "code": "DAT-INT",
            "name": "Intuto",
            "zipCodes": [
              "16810",
              "16811"
            ]
          },
          {
            "code": "LOR-NAU",
            "name": "Nauta",
            "zipCodes": [
              "16300",
              "16301"
            ]
          },
          {
            "code": "ALT-PAR",
            "name": "Parinari",
            "zipCodes": [
              "16570",
              "16571"
            ]
          },
          {
            "code": "DAT-VIL",
            "name": "Villa Trompeteros",
            "zipCodes": [
              "16820",
              "16821"
            ]
          }
        ]
      },
      {
        "code": "MAR",
        "name": "Mariscal Ramón Castilla",
        "districts": [
          {
            "code": "MAR-PEB",
            "name": "Pebas",
            "zipCodes": [
              "16220",
              "16221"
            ]
          },
          {
            "code": "MAR-RAM",
            "name": "Ramón Castilla",
            "zipCodes": [
              "16240",
              "16241"
            ]
          },
          {
            "code": "MAR-SAN",
            "name": "San Pablo",
            "zipCodes": [
              "16230",
              "16231"
            ]
          },
          {
            "code": "MAR-YAV",
            "name": "Yavarí",
            "zipCodes": [
              "16250",
              "16251"
            ]
          }
        ],
        "cities": [
          {
            "code": "MAR-CAB",
            "name": "Caballococha",
            "zipCodes": [
              "16240",
              "16241"
            ]
          },
          {
            "code": "MAR-ISL",
            "name": "Islandia",
            "zipCodes": [
              "16250",
              "16251"
            ]
          },
          {
            "code": "MAR-PEB",
            "name": "Pebas",
            "zipCodes": [
              "16220",
              "16221"
            ]
          },
          {
            "code": "MAR-SAN",
            "name": "San Pablo de Loreto",
            "zipCodes": [
              "16230",
              "16231"
            ]
          }
        ]
      },
      {
        "code": "MAY",
        "name": "Maynas",
        "districts": [
          {
            "code": "DAT-ALT",
            "name": "Alto Nanay",
            "zipCodes": [
              "16800"
            ]
          },
          {
            "code": "MAY-BEL",
            "name": "Belén",
            "zipCodes": [
              "16000",
              "16001",
              "16006",
              "16008"
            ]
          },
          {
            "code": "LOR-FER",
            "name": "Fernado Lores",
            "zipCodes": [
              "16310",
              "16311"
            ]
          },
          {
            "code": "MAY-IND",
            "name": "Indiana",
            "zipCodes": [
              "16200",
              "16201"
            ]
          },
          {
            "code": "MAY-IQU",
            "name": "Iquitos",
            "zipCodes": [
              "16000",
              "16001",
              "16002",
              "16003",
              "16004",
              "16006",
              "16007"
            ]
          },
          {
            "code": "MAY-LAS",
            "name": "Las Amazonas",
            "zipCodes": [
              "16210",
              "16211"
            ]
          },
          {
            "code": "MAY-MAZ",
            "name": "Mazán",
            "zipCodes": [
              "16100",
              "16101"
            ]
          },
          {
            "code": "MAY-NAP",
            "name": "Napo",
            "zipCodes": [
              "16120",
              "16121"
            ]
          },
          {
            "code": "MAY-PUN",
            "name": "Punchana",
            "zipCodes": [
              "16000",
              "16003",
              "16004"
            ]
          },
          {
            "code": "MAY-PUT",
            "name": "Putumayo",
            "zipCodes": [
              "16110",
              "16111"
            ]
          },
          {
            "code": "MAY-SAN",
            "name": "San Juan Bautista",
            "zipCodes": [
              "16000",
              "16007",
              "16008"
            ]
          },
          {
            "code": "MAY-TEN",
            "name": "Teniente Manuel Clavero",
            "zipCodes": [
              "16140"
            ]
          },
          {
            "code": "MAY-TOR",
            "name": "Torres Causana",
            "zipCodes": [
              "16130"
            ]
          }
        ],
        "cities": [
          {
            "code": "MAY-BEL",
            "name": "Belen",
            "zipCodes": [
              "16000",
              "16001",
              "16006",
              "16008"
            ]
          },
          {
            "code": "MAY-FRA",
            "name": "Francisco de Orellana",
            "zipCodes": [
              "16210",
              "16211"
            ]
          },
          {
            "code": "MAY-IND",
            "name": "Indiana",
            "zipCodes": [
              "16200",
              "16201"
            ]
          },
          {
            "code": "MAY-IQU",
            "name": "Iquitos",
            "zipCodes": [
              "16000",
              "16001",
              "16002",
              "16003",
              "16004",
              "16006",
              "16007"
            ]
          },
          {
            "code": "MAY-MAZ",
            "name": "Mazan",
            "zipCodes": [
              "16100",
              "16101"
            ]
          },
          {
            "code": "MAY-PAN",
            "name": "Pantoja",
            "zipCodes": [
              "16130"
            ]
          },
          {
            "code": "MAY-PUN",
            "name": "Punchana",
            "zipCodes": [
              "16000",
              "16003",
              "16004"
            ]
          },
          {
            "code": "MAY-SAN",
            "name": "San Antonio del Estrecho",
            "zipCodes": [
              "16110",
              "16111"
            ]
          },
          {
            "code": "MAY-SAN",
            "name": "San Juan",
            "zipCodes": [
              "16000",
              "16007",
              "16008"
            ]
          },
          {
            "code": "MAY-SAN",
            "name": "Santa Clotilde",
            "zipCodes": [
              "16120",
              "16121"
            ]
          },
          {
            "code": "DAT-SAN",
            "name": "Santa Maria de Nanay",
            "zipCodes": [
              "16800"
            ]
          },
          {
            "code": "MAY-SOP",
            "name": "Soplin Vargas",
            "zipCodes": [
              "16140"
            ]
          },
          {
            "code": "LOR-TAM",
            "name": "Tamshiyacu",
            "zipCodes": [
              "16310",
              "16311"
            ]
          }
        ]
      },
      {
        "code": "REQ",
        "name": "Requena",
        "districts": [
          {
            "code": "REQ-ALT",
            "name": "Alto Tapiche",
            "zipCodes": [
              "16380"
            ]
          },
          {
            "code": "REQ-CAP",
            "name": "Capelo",
            "zipCodes": [
              "16400"
            ]
          },
          {
            "code": "REQ-EMI",
            "name": "Emilio San Martín",
            "zipCodes": [
              "16420",
              "16421"
            ]
          },
          {
            "code": "REQ-JEN",
            "name": "Jenaro Herrera",
            "zipCodes": [
              "16330",
              "16331"
            ]
          },
          {
            "code": "REQ-MAQ",
            "name": "Maquia",
            "zipCodes": [
              "16430",
              "16431"
            ]
          },
          {
            "code": "REQ-PUI",
            "name": "Puinahua",
            "zipCodes": [
              "16410",
              "16411"
            ]
          },
          {
            "code": "REQ-REQ",
            "name": "Requena",
            "zipCodes": [
              "16340",
              "16341"
            ]
          },
          {
            "code": "REQ-SAQ",
            "name": "Saquena",
            "zipCodes": [
              "16320"
            ]
          },
          {
            "code": "REQ-SOP",
            "name": "Soplin",
            "zipCodes": [
              "16360"
            ]
          },
          {
            "code": "REQ-TAP",
            "name": "Tapiche",
            "zipCodes": [
              "16370"
            ]
          },
          {
            "code": "REQ-YAQ",
            "name": "Yaquerana",
            "zipCodes": [
              "16350"
            ]
          }
        ],
        "cities": [
          {
            "code": "REQ-ANG",
            "name": "Angamos",
            "zipCodes": [
              "16350"
            ]
          },
          {
            "code": "REQ-BAG",
            "name": "Bagazan",
            "zipCodes": [
              "16320"
            ]
          },
          {
            "code": "REQ-BRE",
            "name": "Bretaña",
            "zipCodes": [
              "16410",
              "16411"
            ]
          },
          {
            "code": "REQ-FLO",
            "name": "Flor de Punga",
            "zipCodes": [
              "16400"
            ]
          },
          {
            "code": "REQ-IBE",
            "name": "Iberia",
            "zipCodes": [
              "16370"
            ]
          },
          {
            "code": "REQ-JEN",
            "name": "Jenaro Herrera",
            "zipCodes": [
              "16330",
              "16331"
            ]
          },
          {
            "code": "REQ-NUE",
            "name": "Nueva Alejandria (Curinga)",
            "zipCodes": [
              "16360"
            ]
          },
          {
            "code": "REQ-REQ",
            "name": "Requena",
            "zipCodes": [
              "16340",
              "16341"
            ]
          },
          {
            "code": "REQ-SAN",
            "name": "Santa Elena",
            "zipCodes": [
              "16380"
            ]
          },
          {
            "code": "REQ-SAN",
            "name": "Santa Isabel",
            "zipCodes": [
              "16430",
              "16431"
            ]
          },
          {
            "code": "REQ-TAM",
            "name": "Tamanco",
            "zipCodes": [
              "16420",
              "16421"
            ]
          }
        ]
      },
      {
        "code": "UCA",
        "name": "Ucayali",
        "districts": [
          {
            "code": "UCA-CON",
            "name": "Contamaná",
            "zipCodes": [
              "16480",
              "16481"
            ]
          },
          {
            "code": "UCA-INA",
            "name": "Inahuaya",
            "zipCodes": [
              "16460"
            ]
          },
          {
            "code": "UCA-PAD",
            "name": "Padre Marquez",
            "zipCodes": [
              "16490",
              "16491"
            ]
          },
          {
            "code": "UCA-PAM",
            "name": "Pampa Hermosa",
            "zipCodes": [
              "16470",
              "16471"
            ]
          },
          {
            "code": "UCA-SAR",
            "name": "Sarayacu",
            "zipCodes": [
              "16440",
              "16441"
            ]
          },
          {
            "code": "UCA-VAR",
            "name": "Vargas Guerra",
            "zipCodes": [
              "16450",
              "16451"
            ]
          }
        ],
        "cities": [
          {
            "code": "UCA-CON",
            "name": "Contamana",
            "zipCodes": [
              "16480",
              "16481"
            ]
          },
          {
            "code": "UCA-DOS",
            "name": "Dos de Mayo",
            "zipCodes": [
              "16440",
              "16441"
            ]
          },
          {
            "code": "UCA-INA",
            "name": "Inahuaya",
            "zipCodes": [
              "16460"
            ]
          },
          {
            "code": "UCA-ORE",
            "name": "Orellana",
            "zipCodes": [
              "16450",
              "16451"
            ]
          },
          {
            "code": "UCA-PAM",
            "name": "Pampa Hermosa",
            "zipCodes": [
              "16470",
              "16471"
            ]
          },
          {
            "code": "UCA-TIR",
            "name": "Tiruntan",
            "zipCodes": [
              "16490",
              "16491"
            ]
          }
        ]
      }
    ]
  },
  {
    "code": "MAD",
    "name": "Madre de Dios",
    "provinces": [
      {
        "code": "MAN",
        "name": "Manu",
        "districts": [
          {
            "code": "MAN-FIT",
            "name": "Fitzcarrald",
            "zipCodes": [
              "17800"
            ]
          },
          {
            "code": "MAN-HUE",
            "name": "Huepetuhe",
            "zipCodes": [
              "17550",
              "17551"
            ]
          },
          {
            "code": "MAN-MAD",
            "name": "Madre de Dios",
            "zipCodes": [
              "17600",
              "17601"
            ]
          },
          {
            "code": "MAN-MAN",
            "name": "Manú",
            "zipCodes": [
              "17700"
            ]
          }
        ],
        "cities": [
          {
            "code": "MAN-BOC",
            "name": "Boca Colorado",
            "zipCodes": [
              "17600",
              "17601"
            ]
          },
          {
            "code": "MAN-BOC",
            "name": "Boca Manu",
            "zipCodes": [
              "17800"
            ]
          },
          {
            "code": "MAN-HUE",
            "name": "Huepetuhe",
            "zipCodes": [
              "17550",
              "17551"
            ]
          },
          {
            "code": "MAN-SAL",
            "name": "Salvacion",
            "zipCodes": [
              "17700"
            ]
          }
        ]
      },
      {
        "code": "TAH",
        "name": "Tahuamanu",
        "districts": [
          {
            "code": "TAH-IBE",
            "name": "Iberia",
            "zipCodes": [
              "17250",
              "17251"
            ]
          },
          {
            "code": "TAH-IÑA",
            "name": "Iñapari",
            "zipCodes": [
              "17300"
            ]
          },
          {
            "code": "TAH-TAH",
            "name": "Tahuamanú",
            "zipCodes": [
              "17200"
            ]
          }
        ],
        "cities": [
          {
            "code": "TAH-IBE",
            "name": "Iberia",
            "zipCodes": [
              "17250",
              "17251"
            ]
          },
          {
            "code": "TAH-IÑA",
            "name": "Iñapari",
            "zipCodes": [
              "17300"
            ]
          },
          {
            "code": "TAH-SAN",
            "name": "San Lorenzo",
            "zipCodes": [
              "17200"
            ]
          }
        ]
      },
      {
        "code": "TAM",
        "name": "Tambopata",
        "districts": [
          {
            "code": "TAH-INA",
            "name": "Inambari",
            "zipCodes": [
              "17500",
              "17501"
            ]
          },
          {
            "code": "TAH-LAB",
            "name": "Laberinto",
            "zipCodes": [
              "17400"
            ]
          },
          {
            "code": "TAM-LAS",
            "name": "Las Piedras",
            "zipCodes": [
              "17100",
              "17101"
            ]
          },
          {
            "code": "TAM-TAM",
            "name": "Tambopata",
            "zipCodes": [
              "17000",
              "17001"
            ]
          }
        ],
        "cities": [
          {
            "code": "TAM-LAS",
            "name": "Las Piedras (Planchon)",
            "zipCodes": [
              "17100",
              "17101"
            ]
          },
          {
            "code": "TAH-MAZ",
            "name": "Mazuko",
            "zipCodes": [
              "17500",
              "17501"
            ]
          },
          {
            "code": "TAM-PUE",
            "name": "Puerto Maldonado",
            "zipCodes": [
              "17000",
              "17001"
            ]
          },
          {
            "code": "TAH-PUE",
            "name": "Puerto Rosario de Laberinto",
            "zipCodes": [
              "17400"
            ]
          }
        ]
      }
    ]
  },
  {
    "code": "MOQ",
    "name": "Moquegua",
    "provinces": [
      {
        "code": "GEN",
        "name": "General Sanchez Cerro",
        "districts": [
          {
            "code": "GEN-CHO",
            "name": "Chojata",
            "zipCodes": [
              "18500"
            ]
          },
          {
            "code": "GEN-COA",
            "name": "Coalaque",
            "zipCodes": [
              "18210"
            ]
          },
          {
            "code": "GEN-ICH",
            "name": "Ichuña",
            "zipCodes": [
              "18530"
            ]
          },
          {
            "code": "GEN-LA ",
            "name": "La Capilla",
            "zipCodes": [
              "18230"
            ]
          },
          {
            "code": "GEN-LLO",
            "name": "Lloque",
            "zipCodes": [
              "18510"
            ]
          },
          {
            "code": "GEN-MAT",
            "name": "Matalaque",
            "zipCodes": [
              "18310"
            ]
          },
          {
            "code": "GEN-OMA",
            "name": "Omate",
            "zipCodes": [
              "18200"
            ]
          },
          {
            "code": "GEN-PUQ",
            "name": "Puquina",
            "zipCodes": [
              "18220"
            ]
          },
          {
            "code": "GEN-QUI",
            "name": "Quinistaquillas",
            "zipCodes": [
              "18300"
            ]
          },
          {
            "code": "GEN-UBI",
            "name": "Ubinas",
            "zipCodes": [
              "18320"
            ]
          },
          {
            "code": "GEN-YUN",
            "name": "Yunga",
            "zipCodes": [
              "18520"
            ]
          }
        ],
        "cities": [
          {
            "code": "GEN-CHO",
            "name": "Chojata",
            "zipCodes": [
              "18500"
            ]
          },
          {
            "code": "GEN-COA",
            "name": "Coalaque",
            "zipCodes": [
              "18210"
            ]
          },
          {
            "code": "GEN-ICH",
            "name": "Ichuña",
            "zipCodes": [
              "18530"
            ]
          },
          {
            "code": "GEN-LA ",
            "name": "La Capilla",
            "zipCodes": [
              "18230"
            ]
          },
          {
            "code": "GEN-LLO",
            "name": "Lloque",
            "zipCodes": [
              "18510"
            ]
          },
          {
            "code": "GEN-MAT",
            "name": "Matalaque",
            "zipCodes": [
              "18310"
            ]
          },
          {
            "code": "GEN-OMA",
            "name": "Omate",
            "zipCodes": [
              "18200"
            ]
          },
          {
            "code": "GEN-PUQ",
            "name": "Puquina",
            "zipCodes": [
              "18220"
            ]
          },
          {
            "code": "GEN-QUI",
            "name": "Quinistaquillas",
            "zipCodes": [
              "18300"
            ]
          },
          {
            "code": "GEN-UBI",
            "name": "Ubinas",
            "zipCodes": [
              "18320"
            ]
          },
          {
            "code": "GEN-YUN",
            "name": "Yunga",
            "zipCodes": [
              "18520"
            ]
          }
        ]
      },
      {
        "code": "ILO",
        "name": "Ilo",
        "districts": [
          {
            "code": "ILO-EL ",
            "name": "El Algarrobal",
            "zipCodes": [
              "18620"
            ]
          },
          {
            "code": "ILO-ILO",
            "name": "Ilo",
            "zipCodes": [
              "18600",
              "18601"
            ]
          },
          {
            "code": "ILO-PAC",
            "name": "Pacocha",
            "zipCodes": [
              "18610",
              "18611"
            ]
          }
        ],
        "cities": [
          {
            "code": "ILO-EL ",
            "name": "El Algarrobal",
            "zipCodes": [
              "18620"
            ]
          },
          {
            "code": "ILO-ILO",
            "name": "Ilo",
            "zipCodes": [
              "18600",
              "18601"
            ]
          },
          {
            "code": "ILO-PUE",
            "name": "Pueblo Nuevo",
            "zipCodes": [
              "18610",
              "18611"
            ]
          }
        ]
      },
      {
        "code": "MAR",
        "name": "Mariscal Nieto",
        "districts": [
          {
            "code": "GEN-CUC",
            "name": "Cuchumbaya",
            "zipCodes": [
              "18410"
            ]
          },
          {
            "code": "GEN-CUR",
            "name": "Curumas",
            "zipCodes": [
              "18400"
            ]
          },
          {
            "code": "MAR-MOQ",
            "name": "Moquegua",
            "zipCodes": [
              "18000",
              "18001"
            ]
          },
          {
            "code": "MAR-SAM",
            "name": "Samegua",
            "zipCodes": [
              "18000",
              "18001"
            ]
          },
          {
            "code": "GEN-SAN",
            "name": "San Cristobal",
            "zipCodes": [
              "18420"
            ]
          },
          {
            "code": "MAR-TOR",
            "name": "Torata",
            "zipCodes": [
              "18100",
              "18101"
            ]
          }
        ],
        "cities": [
          {
            "code": "GEN-CAL",
            "name": "Calacoa",
            "zipCodes": [
              "18420"
            ]
          },
          {
            "code": "GEN-CAR",
            "name": "Carumas",
            "zipCodes": [
              "18400"
            ]
          },
          {
            "code": "GEN-CUC",
            "name": "Cuchumbaya",
            "zipCodes": [
              "18410"
            ]
          },
          {
            "code": "MAR-MOQ",
            "name": "Moquegua",
            "zipCodes": [
              "18000",
              "18001"
            ]
          },
          {
            "code": "MAR-SAM",
            "name": "Samegua",
            "zipCodes": [
              "18000",
              "18001"
            ]
          },
          {
            "code": "MAR-TOR",
            "name": "Torata",
            "zipCodes": [
              "18100",
              "18101"
            ]
          }
        ]
      }
    ]
  },
  {
    "code": "PAS",
    "name": "Pasco",
    "provinces": [
      {
        "code": "DAN",
        "name": "Daniel Alcides Carrión",
        "districts": [
          {
            "code": "DAN-CHA",
            "name": "Chacayán",
            "zipCodes": [
              "19720"
            ]
          },
          {
            "code": "DAN-GOY",
            "name": "Goyllarisquizga",
            "zipCodes": [
              "19710"
            ]
          },
          {
            "code": "DAN-PAU",
            "name": "Paucar",
            "zipCodes": [
              "19750"
            ]
          },
          {
            "code": "DAN-SAN",
            "name": "San Pedro de Pillao",
            "zipCodes": [
              "19650"
            ]
          },
          {
            "code": "DAN-SAN",
            "name": "Santa Ana de Tusi",
            "zipCodes": [
              "19700",
              "19701"
            ]
          },
          {
            "code": "DAN-TAP",
            "name": "Tapuc",
            "zipCodes": [
              "19740"
            ]
          },
          {
            "code": "DAN-VIL",
            "name": "Vilcabamba",
            "zipCodes": [
              "19730"
            ]
          },
          {
            "code": "DAN-YAN",
            "name": "Yanahuanca",
            "zipCodes": [
              "19600",
              "19601"
            ]
          }
        ],
        "cities": [
          {
            "code": "DAN-CHA",
            "name": "Chacayan",
            "zipCodes": [
              "19720"
            ]
          },
          {
            "code": "DAN-GOY",
            "name": "Goyllarisquizga",
            "zipCodes": [
              "19710"
            ]
          },
          {
            "code": "DAN-PAU",
            "name": "Paucar",
            "zipCodes": [
              "19750"
            ]
          },
          {
            "code": "DAN-SAN",
            "name": "San Pedro de Pillao",
            "zipCodes": [
              "19650"
            ]
          },
          {
            "code": "DAN-SAN",
            "name": "Santa Ana de Tusi",
            "zipCodes": [
              "19700",
              "19701"
            ]
          },
          {
            "code": "DAN-TAP",
            "name": "Tapuc",
            "zipCodes": [
              "19740"
            ]
          },
          {
            "code": "DAN-VIL",
            "name": "Vilcabamba",
            "zipCodes": [
              "19730"
            ]
          },
          {
            "code": "DAN-YAN",
            "name": "Yanahuanca",
            "zipCodes": [
              "19600",
              "19601"
            ]
          }
        ]
      },
      {
        "code": "OXA",
        "name": "Oxapampa",
        "districts": [
          {
            "code": "OXA-CHO",
            "name": "Chontabamba",
            "zipCodes": [
              "19210"
            ]
          },
          {
            "code": "OXA-HUA",
            "name": "Huancabamba",
            "zipCodes": [
              "19240",
              "19241"
            ]
          },
          {
            "code": "OXA-OXA",
            "name": "Oxapampa",
            "zipCodes": [
              "19230",
              "19231"
            ]
          },
          {
            "code": "OXA-PAL",
            "name": "Palcazú",
            "zipCodes": [
              "19320",
              "19321"
            ]
          },
          {
            "code": "OXA-POZ",
            "name": "Pozuzo",
            "zipCodes": [
              "19250",
              "19251"
            ]
          },
          {
            "code": "OXA-PUE",
            "name": "Puerto Bermudez",
            "zipCodes": [
              "19310",
              "19311"
            ]
          },
          {
            "code": "OXA-VIL",
            "name": "Villa Rica",
            "zipCodes": [
              "19300",
              "19301"
            ]
          }
        ],
        "cities": [
          {
            "code": "OXA-CHO",
            "name": "Chontabamba",
            "zipCodes": [
              "19210"
            ]
          },
          {
            "code": "OXA-HUA",
            "name": "Huancabamba",
            "zipCodes": [
              "19240",
              "19241"
            ]
          },
          {
            "code": "OXA-ISC",
            "name": "Iscozacin",
            "zipCodes": [
              "19320",
              "19321"
            ]
          },
          {
            "code": "OXA-OXA",
            "name": "Oxapampa",
            "zipCodes": [
              "19230",
              "19231"
            ]
          },
          {
            "code": "OXA-POZ",
            "name": "Pozuzo",
            "zipCodes": [
              "19250",
              "19251"
            ]
          },
          {
            "code": "OXA-PUE",
            "name": "Puerto Bermudez",
            "zipCodes": [
              "19310",
              "19311"
            ]
          },
          {
            "code": "OXA-VIL",
            "name": "Villa Rica",
            "zipCodes": [
              "19300",
              "19301"
            ]
          }
        ]
      },
      {
        "code": "PAS",
        "name": "Pasco",
        "districts": [
          {
            "code": "PAS-CHA",
            "name": "Chaupimarca",
            "zipCodes": [
              "19000",
              "19001"
            ]
          },
          {
            "code": "OXA-HUA",
            "name": "Huachón",
            "zipCodes": [
              "19220"
            ]
          },
          {
            "code": "PAS-HUA",
            "name": "Huariaca",
            "zipCodes": [
              "19120",
              "19121"
            ]
          },
          {
            "code": "OXA-HUA",
            "name": "Huayllay",
            "zipCodes": [
              "19500",
              "19501"
            ]
          },
          {
            "code": "OXA-NIN",
            "name": "Ninacaca",
            "zipCodes": [
              "19420"
            ]
          },
          {
            "code": "PAS-PAL",
            "name": "Pallanchacra",
            "zipCodes": [
              "19110"
            ]
          },
          {
            "code": "PAS-PAU",
            "name": "Paucartambo",
            "zipCodes": [
              "19200",
              "19201"
            ]
          },
          {
            "code": "PAS-SAN",
            "name": "San Francisco de Asís de Yarusyacán",
            "zipCodes": [
              "19100",
              "19101"
            ]
          },
          {
            "code": "PAS-SIM",
            "name": "Simón Bolivar",
            "zipCodes": [
              "19000",
              "19001",
              "19031"
            ]
          },
          {
            "code": "PAS-TIC",
            "name": "Ticlacayan",
            "zipCodes": [
              "19130",
              "19131"
            ]
          },
          {
            "code": "OXA-TIN",
            "name": "Tinyahuarco",
            "zipCodes": [
              "19400",
              "19401"
            ]
          },
          {
            "code": "OXA-VIC",
            "name": "Vicco",
            "zipCodes": [
              "19410"
            ]
          },
          {
            "code": "PAS-YAN",
            "name": "Yanacancha",
            "zipCodes": [
              "19000",
              "19001"
            ]
          }
        ],
        "cities": [
          {
            "code": "PAS-CER",
            "name": "Cerro de Pasco",
            "zipCodes": [
              "19000",
              "19001"
            ]
          },
          {
            "code": "OXA-HUA",
            "name": "Huachon",
            "zipCodes": [
              "19220"
            ]
          },
          {
            "code": "PAS-HUA",
            "name": "Huariaca",
            "zipCodes": [
              "19120",
              "19121"
            ]
          },
          {
            "code": "OXA-HUA",
            "name": "Huayllay",
            "zipCodes": [
              "19500",
              "19501"
            ]
          },
          {
            "code": "OXA-NIN",
            "name": "Ninacaca",
            "zipCodes": [
              "19420"
            ]
          },
          {
            "code": "PAS-PAL",
            "name": "Pallanchacra",
            "zipCodes": [
              "19110"
            ]
          },
          {
            "code": "PAS-PAU",
            "name": "Paucartambo",
            "zipCodes": [
              "19200",
              "19201"
            ]
          },
          {
            "code": "PAS-SAN",
            "name": "San Antonio de Rancas",
            "zipCodes": [
              "19000",
              "19001",
              "19031"
            ]
          },
          {
            "code": "PAS-TIC",
            "name": "Ticlacayan",
            "zipCodes": [
              "19130",
              "19131"
            ]
          },
          {
            "code": "OXA-TIN",
            "name": "Tinyahuarco (Smelter)",
            "zipCodes": [
              "19400",
              "19401"
            ]
          },
          {
            "code": "OXA-VIC",
            "name": "Vicco",
            "zipCodes": [
              "19410"
            ]
          },
          {
            "code": "PAS-YAN",
            "name": "Yanacancha",
            "zipCodes": [
              "19000",
              "19001"
            ]
          },
          {
            "code": "PAS-YAR",
            "name": "Yarusyacan",
            "zipCodes": [
              "19100",
              "19101"
            ]
          }
        ]
      }
    ]
  },
  {
    "code": "PIU",
    "name": "Piura",
    "provinces": [
      {
        "code": "AYA",
        "name": "Ayabaca",
        "districts": [
          {
            "code": "HUA-AYA",
            "name": "Ayabaca",
            "zipCodes": [
              "20540",
              "20541"
            ]
          },
          {
            "code": "MOR-FRÍ",
            "name": "Frías",
            "zipCodes": [
              "20340",
              "20341"
            ]
          },
          {
            "code": "HUA-JIL",
            "name": "Jilili",
            "zipCodes": [
              "20520"
            ]
          },
          {
            "code": "HUA-LAG",
            "name": "Lagunas",
            "zipCodes": [
              "20550",
              "20551"
            ]
          },
          {
            "code": "HUA-MON",
            "name": "Montero",
            "zipCodes": [
              "20510",
              "20511"
            ]
          },
          {
            "code": "HUA-PAC",
            "name": "Pacaipampa",
            "zipCodes": [
              "20560",
              "20561"
            ]
          },
          {
            "code": "HUA-PAI",
            "name": "Paimas",
            "zipCodes": [
              "20500",
              "20501"
            ]
          },
          {
            "code": "AYA-SAP",
            "name": "Sapillica",
            "zipCodes": [
              "20230",
              "20231"
            ]
          },
          {
            "code": "HUA-SIC",
            "name": "Sicchez",
            "zipCodes": [
              "20530"
            ]
          },
          {
            "code": "AYA-SUY",
            "name": "Suyo",
            "zipCodes": [
              "20220",
              "20221"
            ]
          }
        ],
        "cities": [
          {
            "code": "HUA-AYA",
            "name": "Ayabaca",
            "zipCodes": [
              "20540",
              "20541"
            ]
          },
          {
            "code": "MOR-FRI",
            "name": "Frias",
            "zipCodes": [
              "20340",
              "20341"
            ]
          },
          {
            "code": "HUA-JIL",
            "name": "Jilili",
            "zipCodes": [
              "20520"
            ]
          },
          {
            "code": "HUA-LAG",
            "name": "Lagunas",
            "zipCodes": [
              "20550",
              "20551"
            ]
          },
          {
            "code": "HUA-MON",
            "name": "Montero",
            "zipCodes": [
              "20510",
              "20511"
            ]
          },
          {
            "code": "HUA-PAC",
            "name": "Pacaipampa",
            "zipCodes": [
              "20560",
              "20561"
            ]
          },
          {
            "code": "HUA-PAI",
            "name": "Paimas",
            "zipCodes": [
              "20500",
              "20501"
            ]
          },
          {
            "code": "AYA-SAP",
            "name": "Sapillica",
            "zipCodes": [
              "20230",
              "20231"
            ]
          },
          {
            "code": "HUA-SIC",
            "name": "Sicchez",
            "zipCodes": [
              "20530"
            ]
          },
          {
            "code": "AYA-SUY",
            "name": "Suyo",
            "zipCodes": [
              "20220",
              "20221"
            ]
          }
        ]
      },
      {
        "code": "HUA",
        "name": "Huancabamba",
        "districts": [
          {
            "code": "HUA-CAN",
            "name": "Canchaque",
            "zipCodes": [
              "20430",
              "20431"
            ]
          },
          {
            "code": "HUA-EL ",
            "name": "El Carmen de la Frontera",
            "zipCodes": [
              "20450",
              "20451"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huancabamba",
            "zipCodes": [
              "20440",
              "20441"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huarmaca",
            "zipCodes": [
              "20470",
              "20471"
            ]
          },
          {
            "code": "HUA-LAL",
            "name": "Lalaquiz",
            "zipCodes": [
              "20420",
              "20421"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "San Miguel de el Faique",
            "zipCodes": [
              "20460",
              "20461"
            ]
          },
          {
            "code": "HUA-SON",
            "name": "Sondor",
            "zipCodes": [
              "20480",
              "20481"
            ]
          },
          {
            "code": "HUA-SON",
            "name": "Sondorillo",
            "zipCodes": [
              "20490",
              "20491"
            ]
          }
        ],
        "cities": [
          {
            "code": "HUA-CAN",
            "name": "Canchaque",
            "zipCodes": [
              "20430",
              "20431"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huancabamba",
            "zipCodes": [
              "20440",
              "20441"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huarmaca",
            "zipCodes": [
              "20470",
              "20471"
            ]
          },
          {
            "code": "HUA-SAN",
            "name": "San Miguel del Faique",
            "zipCodes": [
              "20460",
              "20461"
            ]
          },
          {
            "code": "HUA-SAP",
            "name": "Sapalache",
            "zipCodes": [
              "20450",
              "20451"
            ]
          },
          {
            "code": "HUA-SON",
            "name": "Sondor",
            "zipCodes": [
              "20480",
              "20481"
            ]
          },
          {
            "code": "HUA-SON",
            "name": "Sondorillo",
            "zipCodes": [
              "20490",
              "20491"
            ]
          },
          {
            "code": "HUA-TUN",
            "name": "Tunal",
            "zipCodes": [
              "20420",
              "20421"
            ]
          }
        ]
      },
      {
        "code": "MOR",
        "name": "Morropon",
        "districts": [
          {
            "code": "MOR-BUE",
            "name": "Buenos Aires",
            "zipCodes": [
              "20380",
              "20381"
            ]
          },
          {
            "code": "MOR-CHA",
            "name": "Chalaco",
            "zipCodes": [
              "20350",
              "20351"
            ]
          },
          {
            "code": "MOR-CHU",
            "name": "Chulucanas",
            "zipCodes": [
              "20300",
              "20301"
            ]
          },
          {
            "code": "MOR-LA ",
            "name": "La Matanza",
            "zipCodes": [
              "20370",
              "20371"
            ]
          },
          {
            "code": "MOR-MOR",
            "name": "Morropón",
            "zipCodes": [
              "20310",
              "20311"
            ]
          },
          {
            "code": "MOR-SAL",
            "name": "Salitral",
            "zipCodes": [
              "20400",
              "20401"
            ]
          },
          {
            "code": "MOR-SAN",
            "name": "San Juan de Bigote",
            "zipCodes": [
              "20410",
              "20411"
            ]
          },
          {
            "code": "MOR-SAN",
            "name": "Santa Catalina de Mossa",
            "zipCodes": [
              "20320"
            ]
          },
          {
            "code": "MOR-SAN",
            "name": "Santo Domingo",
            "zipCodes": [
              "20330",
              "20331"
            ]
          },
          {
            "code": "MOR-YAM",
            "name": "Yamango",
            "zipCodes": [
              "20360",
              "20361"
            ]
          }
        ],
        "cities": [
          {
            "code": "MOR-BIG",
            "name": "Bigote",
            "zipCodes": [
              "20410",
              "20411"
            ]
          },
          {
            "code": "MOR-BUE",
            "name": "Buenos Aires",
            "zipCodes": [
              "20380",
              "20381"
            ]
          },
          {
            "code": "MOR-CHA",
            "name": "Chalaco",
            "zipCodes": [
              "20350",
              "20351"
            ]
          },
          {
            "code": "MOR-CHU",
            "name": "Chulucanas",
            "zipCodes": [
              "20300",
              "20301"
            ]
          },
          {
            "code": "MOR-LA ",
            "name": "La Matanza",
            "zipCodes": [
              "20370",
              "20371"
            ]
          },
          {
            "code": "MOR-MOR",
            "name": "Morropon",
            "zipCodes": [
              "20310",
              "20311"
            ]
          },
          {
            "code": "MOR-PAL",
            "name": "Paltashaco",
            "zipCodes": [
              "20320"
            ]
          },
          {
            "code": "MOR-SAL",
            "name": "Salitral",
            "zipCodes": [
              "20400",
              "20401"
            ]
          },
          {
            "code": "MOR-SAN",
            "name": "Santo Domingo",
            "zipCodes": [
              "20330",
              "20331"
            ]
          },
          {
            "code": "MOR-YAM",
            "name": "Yamango",
            "zipCodes": [
              "20360",
              "20361"
            ]
          }
        ]
      },
      {
        "code": "PAI",
        "name": "Paita",
        "districts": [
          {
            "code": "PAI-AMO",
            "name": "Amotape",
            "zipCodes": [
              "20730"
            ]
          },
          {
            "code": "PAI-ARE",
            "name": "Arenal",
            "zipCodes": [
              "20720"
            ]
          },
          {
            "code": "PAI-COL",
            "name": "Colán",
            "zipCodes": [
              "20710",
              "20711"
            ]
          },
          {
            "code": "PAI-LA ",
            "name": "La Huaca",
            "zipCodes": [
              "20780",
              "20781"
            ]
          },
          {
            "code": "PAI-PAI",
            "name": "Paita",
            "zipCodes": [
              "20700",
              "20701"
            ]
          },
          {
            "code": "PAI-TAM",
            "name": "Tamarindo",
            "zipCodes": [
              "20750"
            ]
          },
          {
            "code": "PAI-VIC",
            "name": "Vichayal",
            "zipCodes": [
              "20740",
              "20741"
            ]
          }
        ],
        "cities": [
          {
            "code": "PAI-AMO",
            "name": "Amotape",
            "zipCodes": [
              "20730"
            ]
          },
          {
            "code": "PAI-EL ",
            "name": "El Arenal",
            "zipCodes": [
              "20720"
            ]
          },
          {
            "code": "PAI-LA ",
            "name": "La Huaca",
            "zipCodes": [
              "20780",
              "20781"
            ]
          },
          {
            "code": "PAI-PAI",
            "name": "Paita",
            "zipCodes": [
              "20700",
              "20701"
            ]
          },
          {
            "code": "PAI-SAN",
            "name": "San Felipe de Vichayal",
            "zipCodes": [
              "20740",
              "20741"
            ]
          },
          {
            "code": "PAI-SAN",
            "name": "San Lucas (Pueblo Nuevo de Colan)",
            "zipCodes": [
              "20710",
              "20711"
            ]
          },
          {
            "code": "PAI-TAM",
            "name": "Tamarindo",
            "zipCodes": [
              "20750"
            ]
          }
        ]
      },
      {
        "code": "PIU",
        "name": "Piura",
        "districts": [
          {
            "code": "PIU-CAS",
            "name": "Castilla",
            "zipCodes": [
              "20000",
              "20002",
              "20003"
            ]
          },
          {
            "code": "PIU-CAT",
            "name": "Catacaos",
            "zipCodes": [
              "20000",
              "20004",
              "20006"
            ]
          },
          {
            "code": "HUA-CUR",
            "name": "Cura Mori",
            "zipCodes": [
              "20600",
              "20601"
            ]
          },
          {
            "code": "HUA-EL ",
            "name": "El Tallan",
            "zipCodes": [
              "20630"
            ]
          },
          {
            "code": "HUA-LA ",
            "name": "La Arena",
            "zipCodes": [
              "20620",
              "20621"
            ]
          },
          {
            "code": "HUA-LA ",
            "name": "La Unión",
            "zipCodes": [
              "20620",
              "20621"
            ]
          },
          {
            "code": "SUL-LAS",
            "name": "Las Lomas",
            "zipCodes": [
              "20210",
              "20211"
            ]
          },
          {
            "code": "PIU-PIU",
            "name": "Piura",
            "zipCodes": [
              "20000",
              "20001",
              "20004",
              "20007",
              "20008",
              "20009"
            ]
          },
          {
            "code": "SUL-TAM",
            "name": "Tambo Grande",
            "zipCodes": [
              "20200",
              "20201"
            ]
          }
        ],
        "cities": [
          {
            "code": "PIU-CAS",
            "name": "Castilla",
            "zipCodes": [
              "20000",
              "20002",
              "20003"
            ]
          },
          {
            "code": "PIU-CAT",
            "name": "Catacaos",
            "zipCodes": [
              "20000",
              "20004",
              "20006"
            ]
          },
          {
            "code": "HUA-CUC",
            "name": "Cucungara",
            "zipCodes": [
              "20600",
              "20601"
            ]
          },
          {
            "code": "HUA-LA ",
            "name": "La Arena",
            "zipCodes": [
              "20620",
              "20621"
            ]
          },
          {
            "code": "HUA-LA ",
            "name": "La Union",
            "zipCodes": [
              "20620",
              "20621"
            ]
          },
          {
            "code": "SUL-LAS",
            "name": "Las Lomas",
            "zipCodes": [
              "20210",
              "20211"
            ]
          },
          {
            "code": "PIU-PIU",
            "name": "Piura",
            "zipCodes": [
              "20000",
              "20001",
              "20004",
              "20007",
              "20008",
              "20009"
            ]
          },
          {
            "code": "HUA-SIN",
            "name": "Sinchao",
            "zipCodes": [
              "20630"
            ]
          },
          {
            "code": "SUL-TAM",
            "name": "Tambo Grande",
            "zipCodes": [
              "20200",
              "20201"
            ]
          }
        ]
      },
      {
        "code": "SEC",
        "name": "Sechura",
        "districts": [
          {
            "code": "SEC-BEL",
            "name": "Bellavista de la Unión",
            "zipCodes": [
              "20650"
            ]
          },
          {
            "code": "SEC-BER",
            "name": "Bernal",
            "zipCodes": [
              "20670",
              "20671"
            ]
          },
          {
            "code": "SEC-CRI",
            "name": "Cristo Nos Valga",
            "zipCodes": [
              "20680"
            ]
          },
          {
            "code": "SEC-RIN",
            "name": "Rinconada Llicuar",
            "zipCodes": [
              "20660"
            ]
          },
          {
            "code": "SEC-SEC",
            "name": "Sechura",
            "zipCodes": [
              "20690",
              "20691"
            ]
          },
          {
            "code": "SEC-VIC",
            "name": "Vice",
            "zipCodes": [
              "20640",
              "20641"
            ]
          }
        ],
        "cities": [
          {
            "code": "SEC-BEL",
            "name": "Bellavista",
            "zipCodes": [
              "20650"
            ]
          },
          {
            "code": "SEC-BER",
            "name": "Bernal",
            "zipCodes": [
              "20670",
              "20671"
            ]
          },
          {
            "code": "SEC-DOS",
            "name": "Dos Pueblos",
            "zipCodes": [
              "20660"
            ]
          },
          {
            "code": "SEC-SAN",
            "name": "San Cristo",
            "zipCodes": [
              "20680"
            ]
          },
          {
            "code": "SEC-SEC",
            "name": "Sechura",
            "zipCodes": [
              "20690",
              "20691"
            ]
          },
          {
            "code": "SEC-VIC",
            "name": "Vice",
            "zipCodes": [
              "20640",
              "20641"
            ]
          }
        ]
      },
      {
        "code": "SUL",
        "name": "Sullana",
        "districts": [
          {
            "code": "SUL-BEL",
            "name": "Bellavista",
            "zipCodes": [
              "20101",
              "20102"
            ]
          },
          {
            "code": "PAI-IGN",
            "name": "Ignacio Escudero",
            "zipCodes": [
              "20760",
              "20761"
            ]
          },
          {
            "code": "SUL-LAN",
            "name": "Lancones",
            "zipCodes": [
              "20150",
              "20151"
            ]
          },
          {
            "code": "SUL-MAR",
            "name": "Marcavelica",
            "zipCodes": [
              "20120",
              "20121"
            ]
          },
          {
            "code": "PAI-MIG",
            "name": "Miguel Checa",
            "zipCodes": [
              "20770",
              "20771"
            ]
          },
          {
            "code": "SUL-QUE",
            "name": "Querecotillo",
            "zipCodes": [
              "20140",
              "20141"
            ]
          },
          {
            "code": "SUL-SAL",
            "name": "Salitral",
            "zipCodes": [
              "20130",
              "20131"
            ]
          },
          {
            "code": "SUL-SUL",
            "name": "Sullana",
            "zipCodes": [
              "20100",
              "20101",
              "20102",
              "20103"
            ]
          }
        ],
        "cities": [
          {
            "code": "SUL-BEL",
            "name": "Bellavista",
            "zipCodes": [
              "20101",
              "20102"
            ]
          },
          {
            "code": "SUL-LAN",
            "name": "Lancones",
            "zipCodes": [
              "20150",
              "20151"
            ]
          },
          {
            "code": "SUL-MAR",
            "name": "Marcavelica",
            "zipCodes": [
              "20120",
              "20121"
            ]
          },
          {
            "code": "SUL-QUE",
            "name": "Querecotillo",
            "zipCodes": [
              "20140",
              "20141"
            ]
          },
          {
            "code": "SUL-SAL",
            "name": "Salitral",
            "zipCodes": [
              "20130",
              "20131"
            ]
          },
          {
            "code": "PAI-SAN",
            "name": "San Jacinto",
            "zipCodes": [
              "20760",
              "20761"
            ]
          },
          {
            "code": "PAI-SOJ",
            "name": "Sojo",
            "zipCodes": [
              "20770",
              "20771"
            ]
          },
          {
            "code": "SUL-SUL",
            "name": "Sullana",
            "zipCodes": [
              "20100",
              "20101",
              "20102",
              "20103"
            ]
          }
        ]
      },
      {
        "code": "TAL",
        "name": "Talara",
        "districts": [
          {
            "code": "TAL-EL ",
            "name": "El Alto",
            "zipCodes": [
              "20830",
              "20831"
            ]
          },
          {
            "code": "TAL-LA ",
            "name": "La Brea",
            "zipCodes": [
              "20800",
              "20801"
            ]
          },
          {
            "code": "TAL-LOB",
            "name": "Lobitos",
            "zipCodes": [
              "20820"
            ]
          },
          {
            "code": "TAL-LOS",
            "name": "Los Organos",
            "zipCodes": [
              "20840",
              "20841"
            ]
          },
          {
            "code": "TAL-MÁN",
            "name": "Máncora",
            "zipCodes": [
              "20850",
              "20851"
            ]
          },
          {
            "code": "TAL-PAR",
            "name": "Pariñas",
            "zipCodes": [
              "20810",
              "20811"
            ]
          }
        ],
        "cities": [
          {
            "code": "TAL-EL ",
            "name": "El Alto",
            "zipCodes": [
              "20830",
              "20831"
            ]
          },
          {
            "code": "TAL-LOB",
            "name": "Lobitos",
            "zipCodes": [
              "20820"
            ]
          },
          {
            "code": "TAL-LOS",
            "name": "Los Organos",
            "zipCodes": [
              "20840",
              "20841"
            ]
          },
          {
            "code": "TAL-MAN",
            "name": "Mancora",
            "zipCodes": [
              "20850",
              "20851"
            ]
          },
          {
            "code": "TAL-NEG",
            "name": "Negritos",
            "zipCodes": [
              "20800",
              "20801"
            ]
          },
          {
            "code": "TAL-TAL",
            "name": "Talara",
            "zipCodes": [
              "20810",
              "20811"
            ]
          }
        ]
      }
    ]
  },
  {
    "code": "PUN",
    "name": "Puno",
    "provinces": [
      {
        "code": "AZA",
        "name": "Azangaro",
        "districts": [
          {
            "code": "MEL-ACH",
            "name": "Achaya",
            "zipCodes": [
              "21180"
            ]
          },
          {
            "code": "MEL-ARA",
            "name": "Arapa",
            "zipCodes": [
              "21169",
              "21170"
            ]
          },
          {
            "code": "AZA-ASI",
            "name": "Asillo",
            "zipCodes": [
              "21149",
              "21150"
            ]
          },
          {
            "code": "MEL-AZA",
            "name": "Azangaro",
            "zipCodes": [
              "21157",
              "21160"
            ]
          },
          {
            "code": "MEL-CAM",
            "name": "Caminaca",
            "zipCodes": [
              "21175"
            ]
          },
          {
            "code": "HUA-CHU",
            "name": "Chupa",
            "zipCodes": [
              "21320",
              "21321"
            ]
          },
          {
            "code": "AZA-JOS",
            "name": "José Domingo Choquehuanca",
            "zipCodes": [
              "21139",
              "21140"
            ]
          },
          {
            "code": "SAN-MUÑ",
            "name": "Muñani",
            "zipCodes": [
              "21345",
              "21346"
            ]
          },
          {
            "code": "MEL-POT",
            "name": "Potoni",
            "zipCodes": [
              "21210",
              "21211"
            ]
          },
          {
            "code": "SAN-SAM",
            "name": "Saman",
            "zipCodes": [
              "21300",
              "21301"
            ]
          },
          {
            "code": "MEL-SAN",
            "name": "San Antón",
            "zipCodes": [
              "21200",
              "21201"
            ]
          },
          {
            "code": "MEL-SAN",
            "name": "San José",
            "zipCodes": [
              "21162",
              "21165"
            ]
          },
          {
            "code": "MEL-SAN",
            "name": "San Juan de Salinas",
            "zipCodes": [
              "21166"
            ]
          },
          {
            "code": "AZA-SAN",
            "name": "Santiago de Pupuja",
            "zipCodes": [
              "21143",
              "21145"
            ]
          },
          {
            "code": "AZA-TIR",
            "name": "Tirapata",
            "zipCodes": [
              "21146"
            ]
          }
        ],
        "cities": [
          {
            "code": "MEL-ACH",
            "name": "Achaya",
            "zipCodes": [
              "21180"
            ]
          },
          {
            "code": "MEL-ARA",
            "name": "Arapa",
            "zipCodes": [
              "21169",
              "21170"
            ]
          },
          {
            "code": "AZA-ASI",
            "name": "Asillo",
            "zipCodes": [
              "21149",
              "21150"
            ]
          },
          {
            "code": "MEL-AZA",
            "name": "Azangaro",
            "zipCodes": [
              "21157",
              "21160"
            ]
          },
          {
            "code": "MEL-CAM",
            "name": "Caminaca",
            "zipCodes": [
              "21175"
            ]
          },
          {
            "code": "HUA-CHU",
            "name": "Chupa",
            "zipCodes": [
              "21320",
              "21321"
            ]
          },
          {
            "code": "AZA-EST",
            "name": "Estacion de Pucara",
            "zipCodes": [
              "21139",
              "21140"
            ]
          },
          {
            "code": "SAN-MUÑ",
            "name": "Muñani",
            "zipCodes": [
              "21345",
              "21346"
            ]
          },
          {
            "code": "MEL-POT",
            "name": "Potoni",
            "zipCodes": [
              "21210",
              "21211"
            ]
          },
          {
            "code": "SAN-SAM",
            "name": "Saman",
            "zipCodes": [
              "21300",
              "21301"
            ]
          },
          {
            "code": "MEL-SAN",
            "name": "San Anton",
            "zipCodes": [
              "21200",
              "21201"
            ]
          },
          {
            "code": "MEL-SAN",
            "name": "San Jose",
            "zipCodes": [
              "21162",
              "21165"
            ]
          },
          {
            "code": "MEL-SAN",
            "name": "San Juan de Salinas",
            "zipCodes": [
              "21166"
            ]
          },
          {
            "code": "AZA-SAN",
            "name": "Santiago de Pupuja",
            "zipCodes": [
              "21143",
              "21145"
            ]
          },
          {
            "code": "AZA-TIR",
            "name": "Tirapata",
            "zipCodes": [
              "21146"
            ]
          }
        ]
      },
      {
        "code": "CAR",
        "name": "Carabaya",
        "districts": [
          {
            "code": "SAN-AJO",
            "name": "Ajoyani",
            "zipCodes": [
              "21240"
            ]
          },
          {
            "code": "SAN-AYA",
            "name": "Ayapata",
            "zipCodes": [
              "21260",
              "21261"
            ]
          },
          {
            "code": "SAN-COA",
            "name": "Coasa",
            "zipCodes": [
              "21245",
              "21246"
            ]
          },
          {
            "code": "SAN-COR",
            "name": "Corani",
            "zipCodes": [
              "21265"
            ]
          },
          {
            "code": "CAR-CRU",
            "name": "Crucero",
            "zipCodes": [
              "21215",
              "21216"
            ]
          },
          {
            "code": "SAN-ITU",
            "name": "Ituata",
            "zipCodes": [
              "21255",
              "21256"
            ]
          },
          {
            "code": "SAN-MAC",
            "name": "Macusani",
            "zipCodes": [
              "21250",
              "21251"
            ]
          },
          {
            "code": "SAN-OLL",
            "name": "Ollachea",
            "zipCodes": [
              "21270"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "San Gaban",
            "zipCodes": [
              "21275"
            ]
          },
          {
            "code": "SAN-USI",
            "name": "Usicayos",
            "zipCodes": [
              "21235",
              "21236"
            ]
          }
        ],
        "cities": [
          {
            "code": "SAN-AJO",
            "name": "Ajoyani",
            "zipCodes": [
              "21240"
            ]
          },
          {
            "code": "SAN-AYA",
            "name": "Ayapata",
            "zipCodes": [
              "21260",
              "21261"
            ]
          },
          {
            "code": "SAN-COA",
            "name": "Coasa",
            "zipCodes": [
              "21245",
              "21246"
            ]
          },
          {
            "code": "SAN-COR",
            "name": "Corani",
            "zipCodes": [
              "21265"
            ]
          },
          {
            "code": "CAR-CRU",
            "name": "Crucero",
            "zipCodes": [
              "21215",
              "21216"
            ]
          },
          {
            "code": "SAN-LAN",
            "name": "Lanlacuni Bajo",
            "zipCodes": [
              "21275"
            ]
          },
          {
            "code": "SAN-MAC",
            "name": "Macusani",
            "zipCodes": [
              "21250",
              "21251"
            ]
          },
          {
            "code": "SAN-OLL",
            "name": "Ollachea",
            "zipCodes": [
              "21270"
            ]
          },
          {
            "code": "SAN-TAM",
            "name": "Tambillo",
            "zipCodes": [
              "21255",
              "21256"
            ]
          },
          {
            "code": "SAN-USI",
            "name": "Usicayos",
            "zipCodes": [
              "21235",
              "21236"
            ]
          }
        ]
      },
      {
        "code": "CHU",
        "name": "Chucuito",
        "districts": [
          {
            "code": "YUN-DES",
            "name": "Desaguadero",
            "zipCodes": [
              "21610",
              "21611"
            ]
          },
          {
            "code": "YUN-HUA",
            "name": "Huacullani",
            "zipCodes": [
              "21620",
              "21621"
            ]
          },
          {
            "code": "CHU-JUL",
            "name": "Juli",
            "zipCodes": [
              "21530",
              "21531"
            ]
          },
          {
            "code": "YUN-KEL",
            "name": "Kelluyo",
            "zipCodes": [
              "21630",
              "21631"
            ]
          },
          {
            "code": "YUN-PIS",
            "name": "Pisacoma",
            "zipCodes": [
              "21640",
              "21641"
            ]
          },
          {
            "code": "CHU-POM",
            "name": "Pomata",
            "zipCodes": [
              "21535",
              "21536"
            ]
          },
          {
            "code": "YUN-ZEP",
            "name": "Zepita",
            "zipCodes": [
              "21600",
              "21601"
            ]
          }
        ],
        "cities": [
          {
            "code": "YUN-DES",
            "name": "Desaguadero",
            "zipCodes": [
              "21610",
              "21611"
            ]
          },
          {
            "code": "YUN-HUA",
            "name": "Huacullani",
            "zipCodes": [
              "21620",
              "21621"
            ]
          },
          {
            "code": "CHU-JUL",
            "name": "Juli",
            "zipCodes": [
              "21530",
              "21531"
            ]
          },
          {
            "code": "YUN-KEL",
            "name": "Kelluyo",
            "zipCodes": [
              "21630",
              "21631"
            ]
          },
          {
            "code": "YUN-PIS",
            "name": "Pisacoma",
            "zipCodes": [
              "21640",
              "21641"
            ]
          },
          {
            "code": "CHU-POM",
            "name": "Pomata",
            "zipCodes": [
              "21535",
              "21536"
            ]
          },
          {
            "code": "YUN-ZEP",
            "name": "Zepita",
            "zipCodes": [
              "21600",
              "21601"
            ]
          }
        ]
      },
      {
        "code": "EL ",
        "name": "El Collao",
        "districts": [
          {
            "code": "YUN-CAP",
            "name": "Capazo",
            "zipCodes": [
              "21650"
            ]
          },
          {
            "code": "YUN-CON",
            "name": "Conduriri",
            "zipCodes": [
              "21670"
            ]
          },
          {
            "code": "EL -ILA",
            "name": "Ilave",
            "zipCodes": [
              "21500",
              "21501"
            ]
          },
          {
            "code": "EL -PIL",
            "name": "Pilcuyo",
            "zipCodes": [
              "21525",
              "21526"
            ]
          },
          {
            "code": "YUN-SAN",
            "name": "Santa Rosa",
            "zipCodes": [
              "21660",
              "21661"
            ]
          }
        ],
        "cities": [
          {
            "code": "YUN-CAP",
            "name": "Capazo",
            "zipCodes": [
              "21650"
            ]
          },
          {
            "code": "YUN-CON",
            "name": "Conduriri",
            "zipCodes": [
              "21670"
            ]
          },
          {
            "code": "EL -ILA",
            "name": "Ilave",
            "zipCodes": [
              "21500",
              "21501"
            ]
          },
          {
            "code": "YUN-MAZ",
            "name": "Mazo Cruz",
            "zipCodes": [
              "21660",
              "21661"
            ]
          },
          {
            "code": "EL -PIL",
            "name": "Pilcuyo",
            "zipCodes": [
              "21525",
              "21526"
            ]
          }
        ]
      },
      {
        "code": "HUA",
        "name": "Huancane",
        "districts": [
          {
            "code": "SAN-COJ",
            "name": "Cojata",
            "zipCodes": [
              "21410"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huancané",
            "zipCodes": [
              "21315",
              "21316"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huatasani",
            "zipCodes": [
              "21325"
            ]
          },
          {
            "code": "HUA-INC",
            "name": "Inchupalla",
            "zipCodes": [
              "21330"
            ]
          },
          {
            "code": "HUA-PUS",
            "name": "Pusi",
            "zipCodes": [
              "21310",
              "21311"
            ]
          },
          {
            "code": "SAN-RAS",
            "name": "Rasaspata",
            "zipCodes": [
              "21420",
              "21421"
            ]
          },
          {
            "code": "HUA-TAR",
            "name": "Taraco",
            "zipCodes": [
              "21305",
              "21306"
            ]
          },
          {
            "code": "SAN-VIL",
            "name": "Vilque Chico",
            "zipCodes": [
              "21400",
              "21401"
            ]
          }
        ],
        "cities": [
          {
            "code": "SAN-COJ",
            "name": "Cojata",
            "zipCodes": [
              "21410"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huancane",
            "zipCodes": [
              "21315",
              "21316"
            ]
          },
          {
            "code": "HUA-HUA",
            "name": "Huatasani",
            "zipCodes": [
              "21325"
            ]
          },
          {
            "code": "HUA-INC",
            "name": "Inchupalla",
            "zipCodes": [
              "21330"
            ]
          },
          {
            "code": "HUA-PUS",
            "name": "Pusi",
            "zipCodes": [
              "21310",
              "21311"
            ]
          },
          {
            "code": "SAN-ROS",
            "name": "Rosaspata",
            "zipCodes": [
              "21420",
              "21421"
            ]
          },
          {
            "code": "HUA-TAR",
            "name": "Taraco",
            "zipCodes": [
              "21305",
              "21306"
            ]
          },
          {
            "code": "SAN-VIL",
            "name": "Vilque Chico",
            "zipCodes": [
              "21400",
              "21401"
            ]
          }
        ]
      },
      {
        "code": "LAM",
        "name": "Lampa",
        "districts": [
          {
            "code": "YUN-CAB",
            "name": "Cabanilla",
            "zipCodes": [
              "21710",
              "21711"
            ]
          },
          {
            "code": "LAM-CAL",
            "name": "Calapuja",
            "zipCodes": [
              "21130"
            ]
          },
          {
            "code": "YUN-LAM",
            "name": "Lampa",
            "zipCodes": [
              "21800",
              "21801"
            ]
          },
          {
            "code": "LAM-NIC",
            "name": "Nicasio",
            "zipCodes": [
              "21135"
            ]
          },
          {
            "code": "YUN-OCU",
            "name": "Ocuviri",
            "zipCodes": [
              "21825"
            ]
          },
          {
            "code": "YUN-PAL",
            "name": "Palca",
            "zipCodes": [
              "21805"
            ]
          },
          {
            "code": "YUN-PAR",
            "name": "Paratía",
            "zipCodes": [
              "21780",
              "21781"
            ]
          },
          {
            "code": "LAM-PUC",
            "name": "Pucará",
            "zipCodes": [
              "21136",
              "21137"
            ]
          },
          {
            "code": "YUN-SAN",
            "name": "Santa Lucía",
            "zipCodes": [
              "21770",
              "21771"
            ]
          },
          {
            "code": "YUN-VIL",
            "name": "Vilavila",
            "zipCodes": [
              "21815"
            ]
          }
        ],
        "cities": [
          {
            "code": "YUN-CAB",
            "name": "Cabanilla",
            "zipCodes": [
              "21710",
              "21711"
            ]
          },
          {
            "code": "LAM-CAL",
            "name": "Calapuja",
            "zipCodes": [
              "21130"
            ]
          },
          {
            "code": "YUN-LAM",
            "name": "Lampa",
            "zipCodes": [
              "21800",
              "21801"
            ]
          },
          {
            "code": "LAM-NIC",
            "name": "Nicasio",
            "zipCodes": [
              "21135"
            ]
          },
          {
            "code": "YUN-OCU",
            "name": "Ocuviri",
            "zipCodes": [
              "21825"
            ]
          },
          {
            "code": "YUN-PAL",
            "name": "Palca",
            "zipCodes": [
              "21805"
            ]
          },
          {
            "code": "YUN-PAR",
            "name": "Paratia",
            "zipCodes": [
              "21780",
              "21781"
            ]
          },
          {
            "code": "LAM-PUC",
            "name": "Pucara",
            "zipCodes": [
              "21136",
              "21137"
            ]
          },
          {
            "code": "YUN-SAN",
            "name": "Santa Lucia",
            "zipCodes": [
              "21770",
              "21771"
            ]
          },
          {
            "code": "YUN-VIL",
            "name": "Vilavila",
            "zipCodes": [
              "21815"
            ]
          }
        ]
      },
      {
        "code": "MEL",
        "name": "Melgar",
        "districts": [
          {
            "code": "MEL-ANT",
            "name": "Antauta",
            "zipCodes": [
              "21205"
            ]
          },
          {
            "code": "YUN-AYA",
            "name": "Ayavarí",
            "zipCodes": [
              "21865",
              "21866"
            ]
          },
          {
            "code": "YUN-CUP",
            "name": "Cupi",
            "zipCodes": [
              "21845"
            ]
          },
          {
            "code": "YUN-LLA",
            "name": "Llalli",
            "zipCodes": [
              "21835"
            ]
          },
          {
            "code": "YUN-MAC",
            "name": "Macarí",
            "zipCodes": [
              "21875",
              "21876"
            ]
          },
          {
            "code": "YUN-NUÑ",
            "name": "Nuñoa",
            "zipCodes": [
              "21895",
              "21896"
            ]
          },
          {
            "code": "MEL-ORU",
            "name": "Orurillo",
            "zipCodes": [
              "21153",
              "21155"
            ]
          },
          {
            "code": "YUN-SAN",
            "name": "Santa Rosa",
            "zipCodes": [
              "21885",
              "21886"
            ]
          },
          {
            "code": "YUN-UMA",
            "name": "Umachiri",
            "zipCodes": [
              "21855"
            ]
          }
        ],
        "cities": [
          {
            "code": "MEL-ANT",
            "name": "Antauta",
            "zipCodes": [
              "21205"
            ]
          },
          {
            "code": "YUN-AYA",
            "name": "Ayaviri",
            "zipCodes": [
              "21865",
              "21866"
            ]
          },
          {
            "code": "YUN-CUP",
            "name": "Cupi",
            "zipCodes": [
              "21845"
            ]
          },
          {
            "code": "YUN-LLA",
            "name": "Llalli",
            "zipCodes": [
              "21835"
            ]
          },
          {
            "code": "YUN-MAC",
            "name": "Macari",
            "zipCodes": [
              "21875",
              "21876"
            ]
          },
          {
            "code": "YUN-NUÑ",
            "name": "Nuñoa",
            "zipCodes": [
              "21895",
              "21896"
            ]
          },
          {
            "code": "MEL-ORU",
            "name": "Orurillo",
            "zipCodes": [
              "21153",
              "21155"
            ]
          },
          {
            "code": "YUN-SAN",
            "name": "Santa Rosa",
            "zipCodes": [
              "21885",
              "21886"
            ]
          },
          {
            "code": "YUN-UMA",
            "name": "Umachiri",
            "zipCodes": [
              "21855"
            ]
          }
        ]
      },
      {
        "code": "MOH",
        "name": "Moho",
        "districts": [
          {
            "code": "MOH-CON",
            "name": "Conima",
            "zipCodes": [
              "21450"
            ]
          },
          {
            "code": "MOH-HUA",
            "name": "Huayrapata",
            "zipCodes": [
              "21440"
            ]
          },
          {
            "code": "MOH-MOH",
            "name": "Moho",
            "zipCodes": [
              "21430",
              "21431"
            ]
          },
          {
            "code": "MOH-TIL",
            "name": "Tilali",
            "zipCodes": [
              "21460"
            ]
          }
        ],
        "cities": [
          {
            "code": "MOH-CON",
            "name": "Conima",
            "zipCodes": [
              "21450"
            ]
          },
          {
            "code": "MOH-HUA",
            "name": "Huayrapata",
            "zipCodes": [
              "21440"
            ]
          },
          {
            "code": "MOH-MOH",
            "name": "Moho",
            "zipCodes": [
              "21430",
              "21431"
            ]
          },
          {
            "code": "MOH-TIL",
            "name": "Tilali",
            "zipCodes": [
              "21460"
            ]
          }
        ]
      },
      {
        "code": "PUN",
        "name": "Puno",
        "districts": [
          {
            "code": "EL -ACO",
            "name": "Acora",
            "zipCodes": [
              "21510",
              "21511"
            ]
          },
          {
            "code": "SAN-AMA",
            "name": "Amantani",
            "zipCodes": [
              "21127"
            ]
          },
          {
            "code": "SAN-ATU",
            "name": "Atuncolla",
            "zipCodes": [
              "21113",
              "21115"
            ]
          },
          {
            "code": "SAN-CAP",
            "name": "Capachica",
            "zipCodes": [
              "21123",
              "21125"
            ]
          },
          {
            "code": "EL -CHU",
            "name": "Chucuito",
            "zipCodes": [
              "21520",
              "21521"
            ]
          },
          {
            "code": "SAN-COA",
            "name": "Coata",
            "zipCodes": [
              "21119",
              "21120"
            ]
          },
          {
            "code": "SAN-HUA",
            "name": "Huata",
            "zipCodes": [
              "21116",
              "21117"
            ]
          },
          {
            "code": "YUN-MAÑ",
            "name": "Mañozo",
            "zipCodes": [
              "21730",
              "21731"
            ]
          },
          {
            "code": "SAN-PAU",
            "name": "Paucarcolla",
            "zipCodes": [
              "21110"
            ]
          },
          {
            "code": "YUN-PIC",
            "name": "Pichacani",
            "zipCodes": [
              "21575",
              "21576"
            ]
          },
          {
            "code": "EL -PLA",
            "name": "Platería",
            "zipCodes": [
              "21515",
              "21516"
            ]
          },
          {
            "code": "PUN-PUN",
            "name": "Puno",
            "zipCodes": [
              "21000",
              "21001",
              "21002"
            ]
          },
          {
            "code": "YUN-SAN",
            "name": "San Antonio",
            "zipCodes": [
              "21760"
            ]
          },
          {
            "code": "YUN-TIQ",
            "name": "Tiquillaca",
            "zipCodes": [
              "21750"
            ]
          },
          {
            "code": "YUN-VIL",
            "name": "Vilque",
            "zipCodes": [
              "21740"
            ]
          }
        ],
        "cities": [
          {
            "code": "EL -ACO",
            "name": "Acora",
            "zipCodes": [
              "21510",
              "21511"
            ]
          },
          {
            "code": "SAN-AMA",
            "name": "Amantani",
            "zipCodes": [
              "21127"
            ]
          },
          {
            "code": "SAN-ATU",
            "name": "Atuncolla",
            "zipCodes": [
              "21113",
              "21115"
            ]
          },
          {
            "code": "SAN-CAP",
            "name": "Capachica",
            "zipCodes": [
              "21123",
              "21125"
            ]
          },
          {
            "code": "EL -CHU",
            "name": "Chucuito",
            "zipCodes": [
              "21520",
              "21521"
            ]
          },
          {
            "code": "SAN-COA",
            "name": "Coata",
            "zipCodes": [
              "21119",
              "21120"
            ]
          },
          {
            "code": "SAN-HUA",
            "name": "Huata",
            "zipCodes": [
              "21116",
              "21117"
            ]
          },
          {
            "code": "YUN-JUN",
            "name": "Juncal",
            "zipCodes": [
              "21760"
            ]
          },
          {
            "code": "YUN-LAR",
            "name": "Laraqueri",
            "zipCodes": [
              "21575",
              "21576"
            ]
          },
          {
            "code": "YUN-MAÑ",
            "name": "Mañazo",
            "zipCodes": [
              "21730",
              "21731"
            ]
          },
          {
            "code": "SAN-PAU",
            "name": "Paucarcolla",
            "zipCodes": [
              "21110"
            ]
          },
          {
            "code": "EL -PLA",
            "name": "Plateria",
            "zipCodes": [
              "21515",
              "21516"
            ]
          },
          {
            "code": "PUN-PUN",
            "name": "Puno",
            "zipCodes": [
              "21000",
              "21001",
              "21002"
            ]
          },
          {
            "code": "YUN-TIQ",
            "name": "Tiquillaca",
            "zipCodes": [
              "21750"
            ]
          },
          {
            "code": "YUN-VIL",
            "name": "Vilque",
            "zipCodes": [
              "21740"
            ]
          }
        ]
      },
      {
        "code": "SAN",
        "name": "San Antonio de Putina",
        "districts": [
          {
            "code": "SAN-ANA",
            "name": "Ananea",
            "zipCodes": [
              "21355",
              "21356"
            ]
          },
          {
            "code": "SAN-PED",
            "name": "Pedro Vilca Apaza",
            "zipCodes": [
              "21335"
            ]
          },
          {
            "code": "SAN-PUT",
            "name": "Putina",
            "zipCodes": [
              "21340",
              "21341"
            ]
          },
          {
            "code": "SAN-QUI",
            "name": "Quilcapuncu",
            "zipCodes": [
              "21350",
              "21351"
            ]
          },
          {
            "code": "SAN-SIN",
            "name": "Sina",
            "zipCodes": [
              "21395"
            ]
          }
        ],
        "cities": [
          {
            "code": "SAN-ANA",
            "name": "Ananea",
            "zipCodes": [
              "21355",
              "21356"
            ]
          },
          {
            "code": "SAN-AYR",
            "name": "Ayrampuni",
            "zipCodes": [
              "21335"
            ]
          },
          {
            "code": "SAN-PUT",
            "name": "Putina",
            "zipCodes": [
              "21340",
              "21341"
            ]
          },
          {
            "code": "SAN-QUI",
            "name": "Quilcapuncu",
            "zipCodes": [
              "21350",
              "21351"
            ]
          },
          {
            "code": "SAN-SIN",
            "name": "Sina",
            "zipCodes": [
              "21395"
            ]
          }
        ]
      },
      {
        "code": "SAN",
        "name": "San Román",
        "districts": [
          {
            "code": "YUN-CAB",
            "name": "Cabana",
            "zipCodes": [
              "21700"
            ]
          },
          {
            "code": "YUN-CAB",
            "name": "Cabanillas",
            "zipCodes": [
              "21720",
              "21721"
            ]
          },
          {
            "code": "SAN-CAR",
            "name": "Caracoto",
            "zipCodes": [
              "21107",
              "21108"
            ]
          },
          {
            "code": "SAN-JUL",
            "name": "Juliaca",
            "zipCodes": [
              "21100",
              "21101",
              "21102",
              "21103",
              "21104"
            ]
          }
        ],
        "cities": [
          {
            "code": "YUN-CAB",
            "name": "Cabana",
            "zipCodes": [
              "21700"
            ]
          },
          {
            "code": "SAN-CAR",
            "name": "Caracoto",
            "zipCodes": [
              "21107",
              "21108"
            ]
          },
          {
            "code": "YUN-DEU",
            "name": "Deustua",
            "zipCodes": [
              "21720",
              "21721"
            ]
          },
          {
            "code": "SAN-JUL",
            "name": "Juliaca",
            "zipCodes": [
              "21100",
              "21101",
              "21102",
              "21103",
              "21104"
            ]
          }
        ]
      },
      {
        "code": "SAN",
        "name": "Sandia",
        "districts": [
          {
            "code": "SAN-ALT",
            "name": "Alto Inambari",
            "zipCodes": [
              "21370",
              "21371"
            ]
          },
          {
            "code": "SAN-CUY",
            "name": "Cuyocuyo",
            "zipCodes": [
              "21360",
              "21361"
            ]
          },
          {
            "code": "SAN-LIM",
            "name": "Limbani",
            "zipCodes": [
              "21225"
            ]
          },
          {
            "code": "SAN-PAT",
            "name": "Patambuco",
            "zipCodes": [
              "21220"
            ]
          },
          {
            "code": "SAN-PHA",
            "name": "Phara",
            "zipCodes": [
              "21230"
            ]
          },
          {
            "code": "SAN-QUI",
            "name": "Quiaca",
            "zipCodes": [
              "21390"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "San Juan del Oro",
            "zipCodes": [
              "21375",
              "21376"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "San Pedro de Putína Punco",
            "zipCodes": [
              "21380",
              "21381"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "Sandia",
            "zipCodes": [
              "21365",
              "21366"
            ]
          },
          {
            "code": "SAN-YAN",
            "name": "Yanahuaya",
            "zipCodes": [
              "21385"
            ]
          }
        ],
        "cities": [
          {
            "code": "SAN-CUY",
            "name": "Cuyocuyo",
            "zipCodes": [
              "21360",
              "21361"
            ]
          },
          {
            "code": "SAN-LIM",
            "name": "Limbani",
            "zipCodes": [
              "21225"
            ]
          },
          {
            "code": "SAN-MAS",
            "name": "Massiapo",
            "zipCodes": [
              "21370",
              "21371"
            ]
          },
          {
            "code": "SAN-PAT",
            "name": "Patambuco",
            "zipCodes": [
              "21220"
            ]
          },
          {
            "code": "SAN-PHA",
            "name": "Phara",
            "zipCodes": [
              "21230"
            ]
          },
          {
            "code": "SAN-PUT",
            "name": "Putina Punco",
            "zipCodes": [
              "21380",
              "21381"
            ]
          },
          {
            "code": "SAN-QUI",
            "name": "Quiaca",
            "zipCodes": [
              "21390"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "San Juan del Oro",
            "zipCodes": [
              "21375",
              "21376"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "Sandia",
            "zipCodes": [
              "21365",
              "21366"
            ]
          },
          {
            "code": "SAN-YAN",
            "name": "Yanahuaya",
            "zipCodes": [
              "21385"
            ]
          }
        ]
      },
      {
        "code": "YUN",
        "name": "Yunguyo",
        "districts": [
          {
            "code": "YUN-ANA",
            "name": "Anapia",
            "zipCodes": [
              "21565"
            ]
          },
          {
            "code": "YUN-COP",
            "name": "Copani",
            "zipCodes": [
              "21570",
              "21571"
            ]
          },
          {
            "code": "YUN-CUT",
            "name": "Cuturapi",
            "zipCodes": [
              "21540"
            ]
          },
          {
            "code": "YUN-OLL",
            "name": "Ollaraya",
            "zipCodes": [
              "21550"
            ]
          },
          {
            "code": "YUN-TIN",
            "name": "Tinicachi",
            "zipCodes": [
              "21560"
            ]
          },
          {
            "code": "YUN-UNI",
            "name": "Unicachi",
            "zipCodes": [
              "21555"
            ]
          },
          {
            "code": "YUN-YUN",
            "name": "Yunguyo",
            "zipCodes": [
              "21545",
              "21546"
            ]
          }
        ],
        "cities": [
          {
            "code": "YUN-ANA",
            "name": "Anapia",
            "zipCodes": [
              "21565"
            ]
          },
          {
            "code": "YUN-COP",
            "name": "Copani",
            "zipCodes": [
              "21570",
              "21571"
            ]
          },
          {
            "code": "YUN-MAR",
            "name": "Marcaja",
            "zipCodes": [
              "21555"
            ]
          },
          {
            "code": "YUN-SAN",
            "name": "San Juan de Cuturapi",
            "zipCodes": [
              "21540"
            ]
          },
          {
            "code": "YUN-SAN",
            "name": "San Miguel de Ollaraya",
            "zipCodes": [
              "21550"
            ]
          },
          {
            "code": "YUN-TIN",
            "name": "Tinicachi",
            "zipCodes": [
              "21560"
            ]
          },
          {
            "code": "YUN-YUN",
            "name": "Yunguyo",
            "zipCodes": [
              "21545",
              "21546"
            ]
          }
        ]
      }
    ]
  },
  {
    "code": "SAN",
    "name": "San Martín",
    "provinces": [
      {
        "code": "BEL",
        "name": "Bellavista",
        "districts": [
          {
            "code": "BEL-ALT",
            "name": "Alto Biavo",
            "zipCodes": [
              "22490",
              "22491"
            ]
          },
          {
            "code": "BEL-BAJ",
            "name": "Bajo Biavo",
            "zipCodes": [
              "22480",
              "22481"
            ]
          },
          {
            "code": "EL -BEL",
            "name": "Bellavista",
            "zipCodes": [
              "22740",
              "22741"
            ]
          },
          {
            "code": "MAR-HUA",
            "name": "Huallaga",
            "zipCodes": [
              "22510"
            ]
          },
          {
            "code": "EL -SAN",
            "name": "San Pablo",
            "zipCodes": [
              "22730",
              "22731"
            ]
          },
          {
            "code": "BEL-SAN",
            "name": "San Rafael",
            "zipCodes": [
              "22470",
              "22471"
            ]
          }
        ],
        "cities": [
          {
            "code": "EL -BEL",
            "name": "Bellavista",
            "zipCodes": [
              "22740",
              "22741"
            ]
          },
          {
            "code": "BEL-CUZ",
            "name": "Cuzco",
            "zipCodes": [
              "22490",
              "22491"
            ]
          },
          {
            "code": "MAR-LED",
            "name": "Ledoy",
            "zipCodes": [
              "22510"
            ]
          },
          {
            "code": "BEL-NUE",
            "name": "Nuevo Lima",
            "zipCodes": [
              "22480",
              "22481"
            ]
          },
          {
            "code": "EL -SAN",
            "name": "San Pablo",
            "zipCodes": [
              "22730",
              "22731"
            ]
          },
          {
            "code": "BEL-SAN",
            "name": "San Rafael",
            "zipCodes": [
              "22470",
              "22471"
            ]
          }
        ]
      },
      {
        "code": "EL ",
        "name": "El Dorado",
        "districts": [
          {
            "code": "EL -AGU",
            "name": "Agua Blanca",
            "zipCodes": [
              "22710"
            ]
          },
          {
            "code": "EL -SAN",
            "name": "San José de Sisa",
            "zipCodes": [
              "22700",
              "22701"
            ]
          },
          {
            "code": "EL -SAN",
            "name": "San Martín",
            "zipCodes": [
              "22770",
              "22771"
            ]
          },
          {
            "code": "EL -SAN",
            "name": "Santa Rosa",
            "zipCodes": [
              "22720",
              "22721"
            ]
          },
          {
            "code": "EL -SHA",
            "name": "Shatoja",
            "zipCodes": [
              "22760"
            ]
          }
        ],
        "cities": [
          {
            "code": "EL -AGU",
            "name": "Agua Blanca",
            "zipCodes": [
              "22710"
            ]
          },
          {
            "code": "EL -SAN",
            "name": "San Jose de Sisa",
            "zipCodes": [
              "22700",
              "22701"
            ]
          },
          {
            "code": "EL -SAN",
            "name": "San Martin",
            "zipCodes": [
              "22770",
              "22771"
            ]
          },
          {
            "code": "EL -SAN",
            "name": "Santa Rosa",
            "zipCodes": [
              "22720",
              "22721"
            ]
          },
          {
            "code": "EL -SHA",
            "name": "Shatoja",
            "zipCodes": [
              "22760"
            ]
          }
        ]
      },
      {
        "code": "HUA",
        "name": "Huallaga",
        "districts": [
          {
            "code": "HUA-ALT",
            "name": "Alto Saposoa",
            "zipCodes": [
              "22670"
            ]
          },
          {
            "code": "HUA-EL ",
            "name": "El Eslabón",
            "zipCodes": [
              "22640"
            ]
          },
          {
            "code": "HUA-PIS",
            "name": "Piscoyacu",
            "zipCodes": [
              "22650"
            ]
          },
          {
            "code": "HUA-SAC",
            "name": "Sacanche",
            "zipCodes": [
              "22630"
            ]
          },
          {
            "code": "HUA-SAP",
            "name": "Saposoa",
            "zipCodes": [
              "22660",
              "22661"
            ]
          },
          {
            "code": "EL -TII",
            "name": "TIingo de Saposoa",
            "zipCodes": [
              "22750"
            ]
          }
        ],
        "cities": [
          {
            "code": "HUA-EL ",
            "name": "El Eslabon",
            "zipCodes": [
              "22640"
            ]
          },
          {
            "code": "HUA-PAS",
            "name": "Pasarraya",
            "zipCodes": [
              "22670"
            ]
          },
          {
            "code": "HUA-PIS",
            "name": "Piscoyacu",
            "zipCodes": [
              "22650"
            ]
          },
          {
            "code": "HUA-SAC",
            "name": "Sacanche",
            "zipCodes": [
              "22630"
            ]
          },
          {
            "code": "HUA-SAP",
            "name": "Saposoa",
            "zipCodes": [
              "22660",
              "22661"
            ]
          },
          {
            "code": "EL -TIN",
            "name": "Tingo de Saposoa",
            "zipCodes": [
              "22750"
            ]
          }
        ]
      },
      {
        "code": "LAM",
        "name": "Lamas",
        "districts": [
          {
            "code": "LAM-ALO",
            "name": "Alonso de Alvarado",
            "zipCodes": [
              "22110",
              "22111"
            ]
          },
          {
            "code": "SAN-BAR",
            "name": "Barranquita",
            "zipCodes": [
              "22240",
              "22241"
            ]
          },
          {
            "code": "SAN-CAY",
            "name": "Caynarachi",
            "zipCodes": [
              "22235",
              "22236"
            ]
          },
          {
            "code": "SAN-CUÑ",
            "name": "Cuñumbuqui",
            "zipCodes": [
              "22180"
            ]
          },
          {
            "code": "LAM-LAM",
            "name": "Lamas",
            "zipCodes": [
              "22150",
              "22151"
            ]
          },
          {
            "code": "LAM-PIN",
            "name": "Pinto Recodo",
            "zipCodes": [
              "22140",
              "22141"
            ]
          },
          {
            "code": "SAN-RUM",
            "name": "Rumisapa",
            "zipCodes": [
              "22170"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "San Roque de Cumbaza",
            "zipCodes": [
              "22220"
            ]
          },
          {
            "code": "LAM-SHA",
            "name": "Shanao",
            "zipCodes": [
              "22130"
            ]
          },
          {
            "code": "LAM-TAB",
            "name": "Tabalosos",
            "zipCodes": [
              "22120",
              "22121"
            ]
          },
          {
            "code": "SAN-ZAP",
            "name": "Zapatero",
            "zipCodes": [
              "22190"
            ]
          }
        ],
        "cities": [
          {
            "code": "SAN-BAR",
            "name": "Barranquita",
            "zipCodes": [
              "22240",
              "22241"
            ]
          },
          {
            "code": "SAN-CUÑ",
            "name": "Cuñumbuqui",
            "zipCodes": [
              "22180"
            ]
          },
          {
            "code": "LAM-LAM",
            "name": "Lamas",
            "zipCodes": [
              "22150",
              "22151"
            ]
          },
          {
            "code": "LAM-PIN",
            "name": "Pinto Recodo",
            "zipCodes": [
              "22140",
              "22141"
            ]
          },
          {
            "code": "SAN-PON",
            "name": "Pongo de Caynarachi",
            "zipCodes": [
              "22235",
              "22236"
            ]
          },
          {
            "code": "LAM-ROQ",
            "name": "Roque",
            "zipCodes": [
              "22110",
              "22111"
            ]
          },
          {
            "code": "SAN-RUM",
            "name": "Rumisapa",
            "zipCodes": [
              "22170"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "San Roque de Cumbaza",
            "zipCodes": [
              "22220"
            ]
          },
          {
            "code": "LAM-SHA",
            "name": "Shanao",
            "zipCodes": [
              "22130"
            ]
          },
          {
            "code": "LAM-TAB",
            "name": "Tabalosos",
            "zipCodes": [
              "22120",
              "22121"
            ]
          },
          {
            "code": "SAN-ZAP",
            "name": "Zapatero",
            "zipCodes": [
              "22190"
            ]
          }
        ]
      },
      {
        "code": "MAR",
        "name": "Mariscal Cáceres",
        "districts": [
          {
            "code": "MAR-CAN",
            "name": "Canpanilla",
            "zipCodes": [
              "22520",
              "22521"
            ]
          },
          {
            "code": "TOC-HUI",
            "name": "Huicungo",
            "zipCodes": [
              "22620",
              "22621"
            ]
          },
          {
            "code": "TOC-JUA",
            "name": "Juanjui",
            "zipCodes": [
              "22600",
              "22601"
            ]
          },
          {
            "code": "TOC-PAC",
            "name": "Pachiza",
            "zipCodes": [
              "22610"
            ]
          },
          {
            "code": "MAR-PAJ",
            "name": "Pajarillo",
            "zipCodes": [
              "22500",
              "22501"
            ]
          }
        ],
        "cities": [
          {
            "code": "MAR-CAM",
            "name": "Campanilla",
            "zipCodes": [
              "22520",
              "22521"
            ]
          },
          {
            "code": "TOC-HUI",
            "name": "Huicungo",
            "zipCodes": [
              "22620",
              "22621"
            ]
          },
          {
            "code": "TOC-JUA",
            "name": "Juanjui",
            "zipCodes": [
              "22600",
              "22601"
            ]
          },
          {
            "code": "TOC-PAC",
            "name": "Pachiza",
            "zipCodes": [
              "22610"
            ]
          },
          {
            "code": "MAR-PAJ",
            "name": "Pajarillo",
            "zipCodes": [
              "22500",
              "22501"
            ]
          }
        ]
      },
      {
        "code": "MOY",
        "name": "Moyobamba",
        "districts": [
          {
            "code": "EL -CAL",
            "name": "Calzada",
            "zipCodes": [
              "22800"
            ]
          },
          {
            "code": "EL -HAB",
            "name": "Habana",
            "zipCodes": [
              "22805"
            ]
          },
          {
            "code": "MOY-JEP",
            "name": "Jepelacio",
            "zipCodes": [
              "22100",
              "22101"
            ]
          },
          {
            "code": "MOY-MOY",
            "name": "Moyobamba",
            "zipCodes": [
              "22000",
              "22001"
            ]
          },
          {
            "code": "EL -SOR",
            "name": "Soritor",
            "zipCodes": [
              "22810",
              "22811"
            ]
          },
          {
            "code": "MOY-YAN",
            "name": "Yantalo",
            "zipCodes": [
              "22000",
              "22051"
            ]
          }
        ],
        "cities": [
          {
            "code": "EL -CAL",
            "name": "Calzada",
            "zipCodes": [
              "22800"
            ]
          },
          {
            "code": "EL -HAB",
            "name": "Habana",
            "zipCodes": [
              "22805"
            ]
          },
          {
            "code": "MOY-JEP",
            "name": "Jepelacio",
            "zipCodes": [
              "22100",
              "22101"
            ]
          },
          {
            "code": "MOY-MOY",
            "name": "Moyobamba",
            "zipCodes": [
              "22000",
              "22001"
            ]
          },
          {
            "code": "EL -SOR",
            "name": "Soritor",
            "zipCodes": [
              "22810",
              "22811"
            ]
          },
          {
            "code": "MOY-YAN",
            "name": "Yantalo",
            "zipCodes": [
              "22000",
              "22051"
            ]
          }
        ]
      },
      {
        "code": "PIC",
        "name": "PIcota",
        "districts": [
          {
            "code": "PIC-BUE",
            "name": "Buenos Aires",
            "zipCodes": [
              "22410"
            ]
          },
          {
            "code": "PIC-CAS",
            "name": "Caspisapa",
            "zipCodes": [
              "22440"
            ]
          },
          {
            "code": "PIC-PIC",
            "name": "Picota",
            "zipCodes": [
              "22430",
              "22431"
            ]
          },
          {
            "code": "PIC-PIL",
            "name": "Pilluana",
            "zipCodes": [
              "22350"
            ]
          },
          {
            "code": "PIC-PUC",
            "name": "Pucacaca",
            "zipCodes": [
              "22420"
            ]
          },
          {
            "code": "PIC-SAN",
            "name": "San Cristobal",
            "zipCodes": [
              "22450"
            ]
          },
          {
            "code": "PIC-SAN",
            "name": "San Hilarión",
            "zipCodes": [
              "22460"
            ]
          },
          {
            "code": "PIC-SHA",
            "name": "Shamboyacu",
            "zipCodes": [
              "22370",
              "22371"
            ]
          },
          {
            "code": "PIC-TIN",
            "name": "Tingo de Ponasa",
            "zipCodes": [
              "22360"
            ]
          },
          {
            "code": "PIC-TRE",
            "name": "Tres Unidos",
            "zipCodes": [
              "22340"
            ]
          }
        ],
        "cities": [
          {
            "code": "PIC-BUE",
            "name": "Buenos Aires",
            "zipCodes": [
              "22410"
            ]
          },
          {
            "code": "PIC-CAS",
            "name": "Caspisapa",
            "zipCodes": [
              "22440"
            ]
          },
          {
            "code": "PIC-PIC",
            "name": "Picota",
            "zipCodes": [
              "22430",
              "22431"
            ]
          },
          {
            "code": "PIC-PIL",
            "name": "Pilluana",
            "zipCodes": [
              "22350"
            ]
          },
          {
            "code": "PIC-PUC",
            "name": "Pucacaca",
            "zipCodes": [
              "22420"
            ]
          },
          {
            "code": "PIC-PUE",
            "name": "Puerto Rico",
            "zipCodes": [
              "22450"
            ]
          },
          {
            "code": "PIC-SAN",
            "name": "San Cristobal de Sisa",
            "zipCodes": [
              "22460"
            ]
          },
          {
            "code": "PIC-SHA",
            "name": "Shamboyacu",
            "zipCodes": [
              "22370",
              "22371"
            ]
          },
          {
            "code": "PIC-TIN",
            "name": "Tingo de Ponasa",
            "zipCodes": [
              "22360"
            ]
          },
          {
            "code": "PIC-TRE",
            "name": "Tres Unidos",
            "zipCodes": [
              "22340"
            ]
          }
        ]
      },
      {
        "code": "RIO",
        "name": "Rioja",
        "districts": [
          {
            "code": "RIO-AWA",
            "name": "Awajun",
            "zipCodes": [
              "22860",
              "22861"
            ]
          },
          {
            "code": "RIO-ELI",
            "name": "Elias SoplinVargas",
            "zipCodes": [
              "22840",
              "22841"
            ]
          },
          {
            "code": "RIO-NUE",
            "name": "Nueva Cajamarca",
            "zipCodes": [
              "22845",
              "22846"
            ]
          },
          {
            "code": "RIO-PAR",
            "name": "Pardo Miguel",
            "zipCodes": [
              "22865",
              "22866"
            ]
          },
          {
            "code": "RIO-POS",
            "name": "Posic",
            "zipCodes": [
              "22835"
            ]
          },
          {
            "code": "RIO-RIO",
            "name": "Rioja",
            "zipCodes": [
              "22825",
              "22826"
            ]
          },
          {
            "code": "RIO-SAN",
            "name": "San Fernando",
            "zipCodes": [
              "22855"
            ]
          },
          {
            "code": "RIO-YOR",
            "name": "Yorongos",
            "zipCodes": [
              "22820"
            ]
          },
          {
            "code": "RIO-YUR",
            "name": "Yuracyacu",
            "zipCodes": [
              "22850"
            ]
          }
        ],
        "cities": [
          {
            "code": "RIO-BAJ",
            "name": "Bajo Naranjillo",
            "zipCodes": [
              "22860",
              "22861"
            ]
          },
          {
            "code": "RIO-NAR",
            "name": "Naranjos",
            "zipCodes": [
              "22865",
              "22866"
            ]
          },
          {
            "code": "RIO-NUE",
            "name": "Nueva Cajamarca",
            "zipCodes": [
              "22845",
              "22846"
            ]
          },
          {
            "code": "RIO-POS",
            "name": "Posic",
            "zipCodes": [
              "22835"
            ]
          },
          {
            "code": "RIO-RIO",
            "name": "Rioja",
            "zipCodes": [
              "22825",
              "22826"
            ]
          },
          {
            "code": "RIO-SAN",
            "name": "San Fernando",
            "zipCodes": [
              "22855"
            ]
          },
          {
            "code": "RIO-SEG",
            "name": "Segunda Jerusalen- Azunguillo",
            "zipCodes": [
              "22840",
              "22841"
            ]
          },
          {
            "code": "RIO-YOR",
            "name": "Yorongos",
            "zipCodes": [
              "22820"
            ]
          },
          {
            "code": "RIO-YUR",
            "name": "Yuracyacu",
            "zipCodes": [
              "22850"
            ]
          }
        ]
      },
      {
        "code": "SAN",
        "name": "San Martín",
        "districts": [
          {
            "code": "SAN-ALB",
            "name": "Alberto Leveau",
            "zipCodes": [
              "22320"
            ]
          },
          {
            "code": "SAN-CAC",
            "name": "Cacatachi",
            "zipCodes": [
              "22160"
            ]
          },
          {
            "code": "SAN-CHA",
            "name": "Chazuta",
            "zipCodes": [
              "22310",
              "22311"
            ]
          },
          {
            "code": "SAN-CHI",
            "name": "Chipurana",
            "zipCodes": [
              "22255"
            ]
          },
          {
            "code": "SAN-EL ",
            "name": "El Porvenir",
            "zipCodes": [
              "22245"
            ]
          },
          {
            "code": "SAN-HUI",
            "name": "Huimbayoc",
            "zipCodes": [
              "22260"
            ]
          },
          {
            "code": "PIC-JUA",
            "name": "Juan Guerra",
            "zipCodes": [
              "22400"
            ]
          },
          {
            "code": "SAN-LA ",
            "name": "La Banda de Shilcayo",
            "zipCodes": [
              "22200",
              "22201",
              "22202"
            ]
          },
          {
            "code": "SAN-MOR",
            "name": "Morales",
            "zipCodes": [
              "22200",
              "22201",
              "22202"
            ]
          },
          {
            "code": "SAN-PAP",
            "name": "Papaplaya",
            "zipCodes": [
              "22250"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "San Antonio",
            "zipCodes": [
              "22215"
            ]
          },
          {
            "code": "SAN-SAU",
            "name": "Sauce",
            "zipCodes": [
              "22330",
              "22331"
            ]
          },
          {
            "code": "SAN-SHA",
            "name": "Shapaja",
            "zipCodes": [
              "22300"
            ]
          },
          {
            "code": "SAN-TAR",
            "name": "Tarapoto",
            "zipCodes": [
              "22200",
              "22201",
              "22202"
            ]
          }
        ],
        "cities": [
          {
            "code": "SAN-CAC",
            "name": "Cacatachi",
            "zipCodes": [
              "22160"
            ]
          },
          {
            "code": "SAN-CHA",
            "name": "Chazuta",
            "zipCodes": [
              "22310",
              "22311"
            ]
          },
          {
            "code": "SAN-HUI",
            "name": "Huimbayoc",
            "zipCodes": [
              "22260"
            ]
          },
          {
            "code": "PIC-JUA",
            "name": "Juan Guerra",
            "zipCodes": [
              "22400"
            ]
          },
          {
            "code": "SAN-LA ",
            "name": "La Banda",
            "zipCodes": [
              "22200",
              "22201",
              "22202"
            ]
          },
          {
            "code": "SAN-MOR",
            "name": "Morales",
            "zipCodes": [
              "22200",
              "22201",
              "22202"
            ]
          },
          {
            "code": "SAN-NAV",
            "name": "Navarro",
            "zipCodes": [
              "22255"
            ]
          },
          {
            "code": "SAN-PAP",
            "name": "Papaplaya",
            "zipCodes": [
              "22250"
            ]
          },
          {
            "code": "SAN-PEL",
            "name": "Pelejo",
            "zipCodes": [
              "22245"
            ]
          },
          {
            "code": "SAN-SAN",
            "name": "San Antonio",
            "zipCodes": [
              "22215"
            ]
          },
          {
            "code": "SAN-SAU",
            "name": "Sauce",
            "zipCodes": [
              "22330",
              "22331"
            ]
          },
          {
            "code": "SAN-SHA",
            "name": "Shapaja",
            "zipCodes": [
              "22300"
            ]
          },
          {
            "code": "SAN-TAR",
            "name": "Tarapoto",
            "zipCodes": [
              "22200",
              "22201",
              "22202"
            ]
          },
          {
            "code": "SAN-UTC",
            "name": "Utcurarca",
            "zipCodes": [
              "22320"
            ]
          }
        ]
      },
      {
        "code": "TOC",
        "name": "Tocache",
        "districts": [
          {
            "code": "TOC-NUE",
            "name": "Nuevo Progreso",
            "zipCodes": [
              "22550",
              "22551"
            ]
          },
          {
            "code": "TOC-POL",
            "name": "Polvora",
            "zipCodes": [
              "22530",
              "22531"
            ]
          },
          {
            "code": "TOC-SHU",
            "name": "Shunte",
            "zipCodes": [
              "22570"
            ]
          },
          {
            "code": "TOC-TOC",
            "name": "Tocache",
            "zipCodes": [
              "22540",
              "22541"
            ]
          },
          {
            "code": "TOC-UCH",
            "name": "Uchiza",
            "zipCodes": [
              "22560",
              "22561"
            ]
          }
        ],
        "cities": [
          {
            "code": "TOC-MON",
            "name": "Monte Cristo",
            "zipCodes": [
              "22570"
            ]
          },
          {
            "code": "TOC-NUE",
            "name": "Nuevo Progreso",
            "zipCodes": [
              "22550",
              "22551"
            ]
          },
          {
            "code": "TOC-POL",
            "name": "Polvora",
            "zipCodes": [
              "22530",
              "22531"
            ]
          },
          {
            "code": "TOC-TOC",
            "name": "Tocache",
            "zipCodes": [
              "22540",
              "22541"
            ]
          },
          {
            "code": "TOC-UCH",
            "name": "Uchiza",
            "zipCodes": [
              "22560",
              "22561"
            ]
          }
        ]
      }
    ]
  },
  {
    "code": "TAC",
    "name": "Tacna",
    "provinces": [
      {
        "code": "CAN",
        "name": "Candarave",
        "districts": [
          {
            "code": "CAN-CAI",
            "name": "Cairani",
            "zipCodes": [
              "23440"
            ]
          },
          {
            "code": "JOR-CAM",
            "name": "Camilaca",
            "zipCodes": [
              "23850"
            ]
          },
          {
            "code": "CAN-CAN",
            "name": "Candarave",
            "zipCodes": [
              "23420"
            ]
          },
          {
            "code": "CAN-CUR",
            "name": "Curibaya",
            "zipCodes": [
              "23480"
            ]
          },
          {
            "code": "CAN-HUA",
            "name": "Huanaura",
            "zipCodes": [
              "23460"
            ]
          },
          {
            "code": "CAN-QUI",
            "name": "Quilahuani",
            "zipCodes": [
              "23400"
            ]
          }
        ],
        "cities": [
          {
            "code": "CAN-CAI",
            "name": "Cairani",
            "zipCodes": [
              "23440"
            ]
          },
          {
            "code": "JOR-CAM",
            "name": "Camilaca",
            "zipCodes": [
              "23850"
            ]
          },
          {
            "code": "CAN-CAN",
            "name": "Candarave",
            "zipCodes": [
              "23420"
            ]
          },
          {
            "code": "CAN-CUR",
            "name": "Curibaya",
            "zipCodes": [
              "23480"
            ]
          },
          {
            "code": "CAN-HUA",
            "name": "Huanuara",
            "zipCodes": [
              "23460"
            ]
          },
          {
            "code": "CAN-QUI",
            "name": "Quilahuani",
            "zipCodes": [
              "23400"
            ]
          }
        ]
      },
      {
        "code": "JOR",
        "name": "Jorge Basadre",
        "districts": [
          {
            "code": "JOR-ILA",
            "name": "Ilabaya",
            "zipCodes": [
              "23800"
            ]
          },
          {
            "code": "JOR-ITE",
            "name": "Ite",
            "zipCodes": [
              "23700"
            ]
          },
          {
            "code": "JOR-LOC",
            "name": "Locumba",
            "zipCodes": [
              "23750"
            ]
          }
        ],
        "cities": [
          {
            "code": "JOR-ILA",
            "name": "Ilabaya",
            "zipCodes": [
              "23800"
            ]
          },
          {
            "code": "JOR-ITE",
            "name": "Ite",
            "zipCodes": [
              "23700"
            ]
          },
          {
            "code": "JOR-LOC",
            "name": "Locumba",
            "zipCodes": [
              "23750"
            ]
          }
        ]
      },
      {
        "code": "TAC",
        "name": "Tacna",
        "districts": [
          {
            "code": "TAC-ALT",
            "name": "Alto de la Alianza",
            "zipCodes": [
              "23000",
              "23001",
              "23002",
              "23006"
            ]
          },
          {
            "code": "TAC-CAL",
            "name": "Calana",
            "zipCodes": [
              "23000",
              "23041"
            ]
          },
          {
            "code": "TAC-CIU",
            "name": "Ciudad Nueva",
            "zipCodes": [
              "23000",
              "23002"
            ]
          },
          {
            "code": "TAC-COR",
            "name": "Coronel Gregorio Albarracin Lanchipa",
            "zipCodes": [
              "23000",
              "23003",
              "23004",
              "23006"
            ]
          },
          {
            "code": "CAN-INC",
            "name": "Inclan",
            "zipCodes": [
              "23600"
            ]
          },
          {
            "code": "CAN-PAC",
            "name": "Pachia",
            "zipCodes": [
              "23500"
            ]
          },
          {
            "code": "CAN-PAL",
            "name": "Palca",
            "zipCodes": [
              "23550"
            ]
          },
          {
            "code": "TAC-POC",
            "name": "Pocollay",
            "zipCodes": [
              "23000",
              "23001",
              "23002",
              "23003"
            ]
          },
          {
            "code": "CAN-SAM",
            "name": "Sama",
            "zipCodes": [
              "23650"
            ]
          },
          {
            "code": "TAC-TAC",
            "name": "Tacna",
            "zipCodes": [
              "23000",
              "23001",
              "23003",
              "23004",
              "23006"
            ]
          }
        ],
        "cities": [
          {
            "code": "TAC-ALF",
            "name": "Alfonso Ugarte",
            "zipCodes": [
              "23000",
              "23003",
              "23004",
              "23006"
            ]
          },
          {
            "code": "TAC-CAL",
            "name": "Calana",
            "zipCodes": [
              "23000",
              "23041"
            ]
          },
          {
            "code": "TAC-CIU",
            "name": "Ciudad Nueva",
            "zipCodes": [
              "23000",
              "23002"
            ]
          },
          {
            "code": "TAC-LA ",
            "name": "La Esperanza",
            "zipCodes": [
              "23000",
              "23001",
              "23002",
              "23006"
            ]
          },
          {
            "code": "CAN-LAS",
            "name": "Las Yaras",
            "zipCodes": [
              "23650"
            ]
          },
          {
            "code": "CAN-PAC",
            "name": "Pachia",
            "zipCodes": [
              "23500"
            ]
          },
          {
            "code": "CAN-PAL",
            "name": "Palca",
            "zipCodes": [
              "23550"
            ]
          },
          {
            "code": "TAC-POC",
            "name": "Pocollay",
            "zipCodes": [
              "23000",
              "23001",
              "23002",
              "23003"
            ]
          },
          {
            "code": "CAN-SAM",
            "name": "Sama Grande",
            "zipCodes": [
              "23600"
            ]
          },
          {
            "code": "TAC-TAC",
            "name": "Tacna",
            "zipCodes": [
              "23000",
              "23001",
              "23003",
              "23004",
              "23006"
            ]
          }
        ]
      },
      {
        "code": "TAR",
        "name": "Tarata",
        "districts": [
          {
            "code": "TAR-EST",
            "name": "Estique",
            "zipCodes": [
              "23120"
            ]
          },
          {
            "code": "TAR-EST",
            "name": "Estique Pampa",
            "zipCodes": [
              "23100"
            ]
          },
          {
            "code": "TAR-HER",
            "name": "Heroes Albarracín",
            "zipCodes": [
              "23240"
            ]
          },
          {
            "code": "TAR-SIT",
            "name": "Sitajara",
            "zipCodes": [
              "23300"
            ]
          },
          {
            "code": "TAR-SUS",
            "name": "Susapaya",
            "zipCodes": [
              "23350"
            ]
          },
          {
            "code": "TAR-TAR",
            "name": "Tarata",
            "zipCodes": [
              "23200"
            ]
          },
          {
            "code": "TAR-TAR",
            "name": "Tarucachi",
            "zipCodes": [
              "23140"
            ]
          },
          {
            "code": "TAR-TIC",
            "name": "Ticaco",
            "zipCodes": [
              "23220"
            ]
          }
        ],
        "cities": [
          {
            "code": "TAR-CHU",
            "name": "Chucatamani",
            "zipCodes": [
              "23240"
            ]
          },
          {
            "code": "TAR-EST",
            "name": "Estique",
            "zipCodes": [
              "23120"
            ]
          },
          {
            "code": "TAR-EST",
            "name": "Estique Pampa",
            "zipCodes": [
              "23100"
            ]
          },
          {
            "code": "TAR-SIT",
            "name": "Sitajara",
            "zipCodes": [
              "23300"
            ]
          },
          {
            "code": "TAR-SUS",
            "name": "Susapaya",
            "zipCodes": [
              "23350"
            ]
          },
          {
            "code": "TAR-TAR",
            "name": "Tarata",
            "zipCodes": [
              "23200"
            ]
          },
          {
            "code": "TAR-TAR",
            "name": "Tarucachi",
            "zipCodes": [
              "23140"
            ]
          },
          {
            "code": "TAR-TIC",
            "name": "Ticaco",
            "zipCodes": [
              "23220"
            ]
          }
        ]
      }
    ]
  },
  {
    "code": "TUM",
    "name": "Tumbes",
    "provinces": [
      {
        "code": "CON",
        "name": "Contralmirante Villar",
        "districts": [
          {
            "code": "CON-CAN",
            "name": "Canoas de Punta Sal",
            "zipCodes": [
              "24560"
            ]
          },
          {
            "code": "CON-CAS",
            "name": "Casitas",
            "zipCodes": [
              "24450"
            ]
          },
          {
            "code": "CON-ZOR",
            "name": "Zorritos",
            "zipCodes": [
              "24540",
              "24541"
            ]
          }
        ],
        "cities": [
          {
            "code": "CON-CAN",
            "name": "Cancas",
            "zipCodes": [
              "24560"
            ]
          },
          {
            "code": "CON-CAÑ",
            "name": "Cañaveral",
            "zipCodes": [
              "24450"
            ]
          },
          {
            "code": "CON-ZOR",
            "name": "Zorritos",
            "zipCodes": [
              "24540",
              "24541"
            ]
          }
        ]
      },
      {
        "code": "TUM",
        "name": "Tumbes",
        "districts": [
          {
            "code": "CON-COR",
            "name": "Corrales",
            "zipCodes": [
              "24500",
              "24501"
            ]
          },
          {
            "code": "CON-LA ",
            "name": "La Cruz",
            "zipCodes": [
              "24520",
              "24521"
            ]
          },
          {
            "code": "ZAR-PAM",
            "name": "Pampas de Hospital",
            "zipCodes": [
              "24350",
              "24351"
            ]
          },
          {
            "code": "ZAR-SAN",
            "name": "San Jacinto",
            "zipCodes": [
              "24400",
              "24401"
            ]
          },
          {
            "code": "ZAR-SAN",
            "name": "San Juan de la Virgen",
            "zipCodes": [
              "24300"
            ]
          },
          {
            "code": "TUM-TUM",
            "name": "Tumbes",
            "zipCodes": [
              "24000",
              "24001",
              "24002"
            ]
          }
        ],
        "cities": [
          {
            "code": "CON-CAL",
            "name": "Caleta Cruz",
            "zipCodes": [
              "24520",
              "24521"
            ]
          },
          {
            "code": "ZAR-PAM",
            "name": "Pampas de Hospital",
            "zipCodes": [
              "24350",
              "24351"
            ]
          },
          {
            "code": "ZAR-SAN",
            "name": "San Jacinto",
            "zipCodes": [
              "24400",
              "24401"
            ]
          },
          {
            "code": "ZAR-SAN",
            "name": "San Juan de la Virgen",
            "zipCodes": [
              "24300"
            ]
          },
          {
            "code": "CON-SAN",
            "name": "San Pedro de los Incas",
            "zipCodes": [
              "24500",
              "24501"
            ]
          },
          {
            "code": "TUM-TUM",
            "name": "Tumbes",
            "zipCodes": [
              "24000",
              "24001",
              "24002"
            ]
          }
        ]
      },
      {
        "code": "ZAR",
        "name": "Zarumilla",
        "districts": [
          {
            "code": "ZAR-AGU",
            "name": "Aguas Verdes",
            "zipCodes": [
              "24100",
              "24101"
            ]
          },
          {
            "code": "ZAR-MAT",
            "name": "Matapalo",
            "zipCodes": [
              "24250"
            ]
          },
          {
            "code": "ZAR-PAP",
            "name": "Papayal",
            "zipCodes": [
              "24200"
            ]
          },
          {
            "code": "ZAR-ZAR",
            "name": "Zarumilla",
            "zipCodes": [
              "24150",
              "24151"
            ]
          }
        ],
        "cities": [
          {
            "code": "ZAR-AGU",
            "name": "Aguas Verdes",
            "zipCodes": [
              "24100",
              "24101"
            ]
          },
          {
            "code": "ZAR-MAT",
            "name": "Matapalo",
            "zipCodes": [
              "24250"
            ]
          },
          {
            "code": "ZAR-PAP",
            "name": "Papayal",
            "zipCodes": [
              "24200"
            ]
          },
          {
            "code": "ZAR-ZAR",
            "name": "Zarumilla",
            "zipCodes": [
              "24150",
              "24151"
            ]
          }
        ]
      }
    ]
  },
  {
    "code": "UCA",
    "name": "Ucayali",
    "provinces": [
      {
        "code": "ATA",
        "name": "Atalaya",
        "districts": [
          {
            "code": "ATA-RAY",
            "name": "Raymondi",
            "zipCodes": [
              "25200",
              "25201"
            ]
          },
          {
            "code": "ATA-SEP",
            "name": "Sepahua",
            "zipCodes": [
              "25210",
              "25211"
            ]
          },
          {
            "code": "ATA-TAH",
            "name": "Tahuania",
            "zipCodes": [
              "25220",
              "25221"
            ]
          },
          {
            "code": "ATA-YUR",
            "name": "Yurua",
            "zipCodes": [
              "25300"
            ]
          }
        ],
        "cities": [
          {
            "code": "ATA-ATA",
            "name": "Atalaya",
            "zipCodes": [
              "25200",
              "25201"
            ]
          },
          {
            "code": "ATA-BOL",
            "name": "Bolognesi",
            "zipCodes": [
              "25220",
              "25221"
            ]
          },
          {
            "code": "ATA-BRE",
            "name": "Breu",
            "zipCodes": [
              "25300"
            ]
          },
          {
            "code": "ATA-SEP",
            "name": "Sepahua",
            "zipCodes": [
              "25210",
              "25211"
            ]
          }
        ]
      },
      {
        "code": "COR",
        "name": "Coronel Portillo",
        "districts": [
          {
            "code": "COR-CAL",
            "name": "Callería",
            "zipCodes": [
              "25000",
              "25001",
              "25002",
              "25003",
              "25004",
              "25006"
            ]
          },
          {
            "code": "PUR-CAM",
            "name": "Campoverde",
            "zipCodes": [
              "25500",
              "25501"
            ]
          },
          {
            "code": "ATA-IPA",
            "name": "Iparía",
            "zipCodes": [
              "25230",
              "25231"
            ]
          },
          {
            "code": "COR-MAN",
            "name": "Manantay",
            "zipCodes": [
              "25000",
              "25001",
              "25002"
            ]
          },
          {
            "code": "COR-MAS",
            "name": "Masisea",
            "zipCodes": [
              "25100",
              "25101"
            ]
          },
          {
            "code": "PAD-NUE",
            "name": "Nueva Requena",
            "zipCodes": [
              "25700",
              "25701"
            ]
          },
          {
            "code": "COR-YAR",
            "name": "Yarinacocha",
            "zipCodes": [
              "25000",
              "25003",
              "25004",
              "25006"
            ]
          }
        ],
        "cities": [
          {
            "code": "PUR-CAM",
            "name": "Campo Verde",
            "zipCodes": [
              "25500",
              "25501"
            ]
          },
          {
            "code": "ATA-IPA",
            "name": "Iparia",
            "zipCodes": [
              "25230",
              "25231"
            ]
          },
          {
            "code": "COR-MAS",
            "name": "Masisea",
            "zipCodes": [
              "25100",
              "25101"
            ]
          },
          {
            "code": "PAD-NUE",
            "name": "Nueva Requena",
            "zipCodes": [
              "25700",
              "25701"
            ]
          },
          {
            "code": "COR-PUC",
            "name": "Pucallpa",
            "zipCodes": [
              "25000",
              "25001",
              "25002",
              "25003",
              "25004",
              "25006"
            ]
          },
          {
            "code": "COR-PUE",
            "name": "Puerto Callao",
            "zipCodes": [
              "25000",
              "25003",
              "25004",
              "25006"
            ]
          },
          {
            "code": "COR-SAN",
            "name": "San Fernando",
            "zipCodes": [
              "25000",
              "25001",
              "25002"
            ]
          }
        ]
      },
      {
        "code": "PAD",
        "name": "Padre Abad",
        "districts": [
          {
            "code": "PAD-CUR",
            "name": "Curimana",
            "zipCodes": [
              "25600",
              "25601"
            ]
          },
          {
            "code": "PAD-IRA",
            "name": "Irazola",
            "zipCodes": [
              "25530",
              "25531"
            ]
          },
          {
            "code": "PAD-PAD",
            "name": "Padre Abad",
            "zipCodes": [
              "25550",
              "25551"
            ]
          }
        ],
        "cities": [
          {
            "code": "PAD-AGU",
            "name": "Aguaytia",
            "zipCodes": [
              "25550",
              "25551"
            ]
          },
          {
            "code": "PAD-CUR",
            "name": "Curimana",
            "zipCodes": [
              "25600",
              "25601"
            ]
          },
          {
            "code": "PAD-SAN",
            "name": "San Alejandro",
            "zipCodes": [
              "25530",
              "25531"
            ]
          }
        ]
      },
      {
        "code": "PUR",
        "name": "Purus",
        "districts": [
          {
            "code": "PUR-PUR",
            "name": "Purús",
            "zipCodes": [
              "25400"
            ]
          }
        ],
        "cities": [
          {
            "code": "PUR-ESP",
            "name": "Esperanza",
            "zipCodes": [
              "25400"
            ]
          }
        ]
      }
    ]
  }
];

/**
 * GET DEPARTMENTS
 * ---------------
 * Returns all departments
 */
export function getDepartments(): Department[] {
  return PERU_ADDRESSES;
}

/**
 * GET PROVINCES BY DEPARTMENT
 * ---------------------------
 * Returns provinces for a specific department
 */
export function getProvincesByDepartment(departmentCode: string): Province[] {
  const department = PERU_ADDRESSES.find(d => d.code === departmentCode);
  return department ? department.provinces : [];
}

/**
 * GET DISTRICTS BY PROVINCE
 * -------------------------
 * Returns districts for a specific department and province
 */
export function getDistrictsByProvince(departmentCode: string, provinceCode: string): District[] {
  const department = PERU_ADDRESSES.find(d => d.code === departmentCode);
  if (!department) return [];

  const province = department.provinces.find(p => p.code === provinceCode);
  return province ? province.districts : [];
}

/**
 * GET CITIES BY PROVINCE
 * ----------------------
 * Returns cities for a specific department and province
 */
export function getCitiesByProvince(departmentCode: string, provinceCode: string): City[] {
  const department = PERU_ADDRESSES.find(d => d.code === departmentCode);
  if (!department) return [];

  const province = department.provinces.find(p => p.code === provinceCode);
  return province ? province.cities : [];
}

/**
 * GET POSTAL CODES FOR DISTRICT
 * -----------------------------
 * Returns all postal codes for a specific district
 */
export function getPostalCodesForDistrict(departmentCode: string, provinceCode: string, districtCode: string): string[] {
  const districts = getDistrictsByProvince(departmentCode, provinceCode);
  const district = districts.find(d => d.code === districtCode);
  return district ? district.zipCodes : [];
}

/**
 * GET POSTAL CODES FOR CITY
 * -------------------------
 * Returns all postal codes for a specific city
 */
export function getPostalCodesForCity(departmentCode: string, provinceCode: string, cityCode: string): string[] {
  const cities = getCitiesByProvince(departmentCode, provinceCode);
  const city = cities.find(c => c.code === cityCode);
  return city ? city.zipCodes : [];
}

/**
 * SEARCH ADDRESSES
 * ----------------
 * Searches for addresses by name
 */
export function searchAddresses(query: string): Array<{department: Department, province: Province, district?: District, city?: City}> {
  const results: Array<{department: Department, province: Province, district?: District, city?: City}> = [];
  const searchTerm = query.toLowerCase();

  for (const department of PERU_ADDRESSES) {
    for (const province of department.provinces) {
      // Search districts
      for (const district of province.districts) {
        if (
          department.name.toLowerCase().includes(searchTerm) ||
          province.name.toLowerCase().includes(searchTerm) ||
          district.name.toLowerCase().includes(searchTerm)
        ) {
          results.push({ department, province, district });
        }
      }

      // Search cities
      for (const city of province.cities) {
        if (
          department.name.toLowerCase().includes(searchTerm) ||
          province.name.toLowerCase().includes(searchTerm) ||
          city.name.toLowerCase().includes(searchTerm)
        ) {
          results.push({ department, province, city });
        }
      }
    }
  }

  return results;
}
