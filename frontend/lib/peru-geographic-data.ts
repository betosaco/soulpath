/**
 * ========================================================================================
 * PERU GEOGRAPHIC DATA FOR CHECKOUT ORGANIZATION
 * ========================================================================================
 *
 * SOURCE: Complete MTC postal code data, correctly parsed with comma-separated values
 * GENERATED: 2025-09-24 10:04:25
 *
 * This file contains properly organized geographic data for Peru's administrative divisions.
 * Each district can have multiple postal codes, and comma-separated values are correctly split.
 *
 * Structure: DEPARTAMENTO → PROVINCIA → DISTRITO → CÓDIGOS POSTALES
 * Statistics:
 * - Departments: 25
 * - Provinces: 196
 * - Districts: 1839
 *
 * NOTE: Postal codes are kept as reference data but remain manual input fields in forms.
 */

export interface PostalCodeInfo {
  code: string;
  area: string;
}

export interface District {
  code: string;
  name: string;
  postalCodes: string[];
}

export interface City {
  code: string;
  name: string;
  postalCodes: string[];
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

export const PERU_GEOGRAPHIC_DATA: Department[] = [
  {
    "code": "AMA",
    "name": "Amazonas",
    "provinces": [
      {
        "code": "AMA-BAG",
        "name": "Bagua",
        "districts": [
          {
            "code": "AMA-BAG-ARA",
            "name": "Aramango",
            "postalCodes": [
              "01801",
              "01800"
            ]
          },
          {
            "code": "AMA-BAG-BAG",
            "name": "Bagua",
            "postalCodes": [
              "01720",
              "01721"
            ]
          },
          {
            "code": "AMA-BAG-COP",
            "name": "Copallin",
            "postalCodes": [
              "01710",
              "01711"
            ]
          },
          {
            "code": "AMA-BAG-EL ",
            "name": "El Parco",
            "postalCodes": [
              "01730"
            ]
          },
          {
            "code": "AMA-BAG-IMA",
            "name": "Imaza",
            "postalCodes": [
              "01810",
              "01811"
            ]
          },
          {
            "code": "AMA-BAG-LA ",
            "name": "La Peca",
            "postalCodes": [
              "01741",
              "01740"
            ]
          }
        ],
        "cities": [
          {
            "code": "AMA-BAG-ARA",
            "name": "Aramango",
            "postalCodes": [
              "01800",
              "01801"
            ]
          },
          {
            "code": "AMA-BAG-BAG",
            "name": "Bagua",
            "postalCodes": [
              "01720",
              "01721"
            ]
          },
          {
            "code": "AMA-BAG-CHI",
            "name": "Chiriaco",
            "postalCodes": [
              "01810",
              "01811"
            ]
          },
          {
            "code": "AMA-BAG-COP",
            "name": "Copallin",
            "postalCodes": [
              "01710",
              "01711"
            ]
          },
          {
            "code": "AMA-BAG-EL ",
            "name": "El Parco",
            "postalCodes": [
              "01730"
            ]
          },
          {
            "code": "AMA-BAG-LA ",
            "name": "La Peca",
            "postalCodes": [
              "01740",
              "01741"
            ]
          }
        ]
      },
      {
        "code": "AMA-BON",
        "name": "Bongara",
        "districts": [
          {
            "code": "AMA-BON-CHI",
            "name": "Chisquilla",
            "postalCodes": [
              "01260"
            ]
          },
          {
            "code": "AMA-BON-CHU",
            "name": "Churuja",
            "postalCodes": [
              "01110"
            ]
          },
          {
            "code": "AMA-BON-COR",
            "name": "Corosha",
            "postalCodes": [
              "01270"
            ]
          },
          {
            "code": "AMA-BON-CUI",
            "name": "Cuispes",
            "postalCodes": [
              "01140"
            ]
          },
          {
            "code": "AMA-BON-FLO",
            "name": "Florida",
            "postalCodes": [
              "01150",
              "01151"
            ]
          },
          {
            "code": "AMA-BON-JAZ",
            "name": "Jazan",
            "postalCodes": [
              "01130",
              "01131"
            ]
          },
          {
            "code": "AMA-BON-JUM",
            "name": "Jumbilla",
            "postalCodes": [
              "01250"
            ]
          },
          {
            "code": "AMA-BON-REC",
            "name": "Recta",
            "postalCodes": [
              "01240"
            ]
          },
          {
            "code": "AMA-BON-SAN",
            "name": "San Carlos",
            "postalCodes": [
              "01120"
            ]
          },
          {
            "code": "AMA-BON-SHI",
            "name": "Shipasbamba",
            "postalCodes": [
              "01600"
            ]
          },
          {
            "code": "AMA-BON-VAL",
            "name": "Valera",
            "postalCodes": [
              "01100"
            ]
          },
          {
            "code": "AMA-BON-YAM",
            "name": "Yambrasbamba",
            "postalCodes": [
              "01160",
              "01161"
            ]
          }
        ],
        "cities": [
          {
            "code": "AMA-BON-CHI",
            "name": "Chisquilla",
            "postalCodes": [
              "01260"
            ]
          },
          {
            "code": "AMA-BON-CHU",
            "name": "Churuja",
            "postalCodes": [
              "01110"
            ]
          },
          {
            "code": "AMA-BON-COR",
            "name": "Corosha",
            "postalCodes": [
              "01270"
            ]
          },
          {
            "code": "AMA-BON-CUI",
            "name": "Cuispes",
            "postalCodes": [
              "01140"
            ]
          },
          {
            "code": "AMA-BON-FLO",
            "name": "Florida (Pomacochas)",
            "postalCodes": [
              "01150",
              "01151"
            ]
          },
          {
            "code": "AMA-BON-JUM",
            "name": "Jumbilla",
            "postalCodes": [
              "01250"
            ]
          },
          {
            "code": "AMA-BON-PED",
            "name": "Pedro Ruiz Gallo",
            "postalCodes": [
              "01130",
              "01131"
            ]
          },
          {
            "code": "AMA-BON-REC",
            "name": "Recta",
            "postalCodes": [
              "01240"
            ]
          },
          {
            "code": "AMA-BON-SAN",
            "name": "San Carlos",
            "postalCodes": [
              "01120"
            ]
          },
          {
            "code": "AMA-BON-SHI",
            "name": "Shipasbamba",
            "postalCodes": [
              "01600"
            ]
          },
          {
            "code": "AMA-BON-VAL",
            "name": "Valera (San Pablo)",
            "postalCodes": [
              "01100"
            ]
          },
          {
            "code": "AMA-BON-YAM",
            "name": "Yambrasbamba",
            "postalCodes": [
              "01160",
              "01161"
            ]
          }
        ]
      },
      {
        "code": "AMA-CHA",
        "name": "Chachapoyas",
        "districts": [
          {
            "code": "AMA-CHA-ASU",
            "name": "Asunción",
            "postalCodes": [
              "01230"
            ]
          },
          {
            "code": "AMA-CHA-BAL",
            "name": "Balsas",
            "postalCodes": [
              "01475"
            ]
          },
          {
            "code": "AMA-CHA-CHA",
            "name": "Chachapoyas",
            "postalCodes": [
              "01001",
              "01000"
            ]
          },
          {
            "code": "AMA-CHA-CHE",
            "name": "Cheto",
            "postalCodes": [
              "01315"
            ]
          },
          {
            "code": "AMA-CHA-CHI",
            "name": "Chiliquin",
            "postalCodes": [
              "01220"
            ]
          },
          {
            "code": "AMA-CHA-CHU",
            "name": "Chuquibamba",
            "postalCodes": [
              "01470"
            ]
          },
          {
            "code": "AMA-CHA-GRA",
            "name": "Granada",
            "postalCodes": [
              "01200"
            ]
          },
          {
            "code": "AMA-CHA-HUA",
            "name": "Huancas",
            "postalCodes": [
              "01000"
            ]
          },
          {
            "code": "AMA-CHA-LA ",
            "name": "La Jalca",
            "postalCodes": [
              "01440",
              "01441"
            ]
          },
          {
            "code": "AMA-CHA-LEI",
            "name": "Leimebamba",
            "postalCodes": [
              "01465"
            ]
          },
          {
            "code": "AMA-CHA-LEV",
            "name": "Levanto",
            "postalCodes": [
              "01400"
            ]
          },
          {
            "code": "AMA-CHA-MAG",
            "name": "Magdalena",
            "postalCodes": [
              "01410"
            ]
          },
          {
            "code": "AMA-CHA-MAR",
            "name": "Mariscal Castilla",
            "postalCodes": [
              "01455"
            ]
          },
          {
            "code": "AMA-CHA-MOL",
            "name": "Molinopampa",
            "postalCodes": [
              "01320"
            ]
          },
          {
            "code": "AMA-CHA-MON",
            "name": "Montevideo",
            "postalCodes": [
              "01460"
            ]
          },
          {
            "code": "AMA-CHA-OLL",
            "name": "Olleros",
            "postalCodes": [
              "01280"
            ]
          },
          {
            "code": "AMA-CHA-QUI",
            "name": "Quinjalca",
            "postalCodes": [
              "01210"
            ]
          },
          {
            "code": "AMA-CHA-SAN",
            "name": "San Francisco de Daguas",
            "postalCodes": [
              "01310"
            ]
          },
          {
            "code": "AMA-CHA-SAN",
            "name": "San Isidro de Maino",
            "postalCodes": [
              "01405"
            ]
          },
          {
            "code": "AMA-CHA-SOL",
            "name": "Soloco",
            "postalCodes": [
              "01305"
            ]
          },
          {
            "code": "AMA-CHA-SON",
            "name": "Sonche",
            "postalCodes": [
              "01300"
            ]
          }
        ],
        "cities": [
          {
            "code": "AMA-CHA-ASU",
            "name": "Asuncion",
            "postalCodes": [
              "01230",
              "06403",
              "06405"
            ]
          },
          {
            "code": "AMA-CHA-BAL",
            "name": "Balsas",
            "postalCodes": [
              "01475"
            ]
          },
          {
            "code": "AMA-CHA-CHA",
            "name": "Chachapoyas",
            "postalCodes": [
              "01000",
              "01001"
            ]
          },
          {
            "code": "AMA-CHA-CHE",
            "name": "Cheto",
            "postalCodes": [
              "01315"
            ]
          },
          {
            "code": "AMA-CHA-CHI",
            "name": "Chiliquin",
            "postalCodes": [
              "01220"
            ]
          },
          {
            "code": "AMA-CHA-CHU",
            "name": "Chuquibamba",
            "postalCodes": [
              "01470",
              "04710"
            ]
          },
          {
            "code": "AMA-CHA-DAG",
            "name": "Daguas",
            "postalCodes": [
              "01310"
            ]
          },
          {
            "code": "AMA-CHA-DUR",
            "name": "Duraznopampa",
            "postalCodes": [
              "01455"
            ]
          },
          {
            "code": "AMA-CHA-GRA",
            "name": "Granada",
            "postalCodes": [
              "01200"
            ]
          },
          {
            "code": "AMA-CHA-HUA",
            "name": "Huancas",
            "postalCodes": [
              "01000"
            ]
          },
          {
            "code": "AMA-CHA-LA ",
            "name": "La Jalca",
            "postalCodes": [
              "01440",
              "01441"
            ]
          },
          {
            "code": "AMA-CHA-LEI",
            "name": "Leimebamba",
            "postalCodes": [
              "01465"
            ]
          },
          {
            "code": "AMA-CHA-LEV",
            "name": "Levanto",
            "postalCodes": [
              "01400"
            ]
          },
          {
            "code": "AMA-CHA-MAG",
            "name": "Magdalena",
            "postalCodes": [
              "01410",
              "06411",
              "06412"
            ]
          },
          {
            "code": "AMA-CHA-MAI",
            "name": "Maino",
            "postalCodes": [
              "01405"
            ]
          },
          {
            "code": "AMA-CHA-MOL",
            "name": "Molinopampa",
            "postalCodes": [
              "01320"
            ]
          },
          {
            "code": "AMA-CHA-MON",
            "name": "Montevideo",
            "postalCodes": [
              "01460"
            ]
          },
          {
            "code": "AMA-CHA-OLL",
            "name": "Olleros",
            "postalCodes": [
              "01280",
              "02400"
            ]
          },
          {
            "code": "AMA-CHA-QUI",
            "name": "Quinjalca",
            "postalCodes": [
              "01210"
            ]
          },
          {
            "code": "AMA-CHA-SAN",
            "name": "San Juan de Sonche",
            "postalCodes": [
              "01300"
            ]
          },
          {
            "code": "AMA-CHA-SOL",
            "name": "Soloco",
            "postalCodes": [
              "01305"
            ]
          }
        ]
      },
      {
        "code": "AMA-CON",
        "name": "Condorcanqui",
        "districts": [
          {
            "code": "AMA-CON-EL ",
            "name": "El Cenepa",
            "postalCodes": [
              "01820",
              "01821"
            ]
          },
          {
            "code": "AMA-CON-NIE",
            "name": "Nieva",
            "postalCodes": [
              "01830",
              "01831"
            ]
          },
          {
            "code": "AMA-CON-RÍO",
            "name": "Río Santiago",
            "postalCodes": [
              "01841",
              "01840"
            ]
          }
        ],
        "cities": [
          {
            "code": "AMA-CON-HUA",
            "name": "Huampami",
            "postalCodes": [
              "01820",
              "01821"
            ]
          },
          {
            "code": "AMA-CON-PUE",
            "name": "Puerto Galilea",
            "postalCodes": [
              "01840",
              "01841"
            ]
          },
          {
            "code": "AMA-CON-SAN",
            "name": "Santa Maria de Nieva",
            "postalCodes": [
              "01830",
              "01831"
            ]
          }
        ]
      },
      {
        "code": "AMA-LUY",
        "name": "Luya",
        "districts": [
          {
            "code": "AMA-LUY-CAM",
            "name": "Camporredondo",
            "postalCodes": [
              "01551",
              "01550"
            ]
          },
          {
            "code": "AMA-LUY-COC",
            "name": "Cocabamba",
            "postalCodes": [
              "01480"
            ]
          },
          {
            "code": "AMA-LUY-COL",
            "name": "Colcamar",
            "postalCodes": [
              "01420"
            ]
          },
          {
            "code": "AMA-LUY-CON",
            "name": "Conila",
            "postalCodes": [
              "01530"
            ]
          },
          {
            "code": "AMA-LUY-ING",
            "name": "Inguilpata",
            "postalCodes": [
              "01505"
            ]
          },
          {
            "code": "AMA-LUY-LAM",
            "name": "Lamud",
            "postalCodes": [
              "01515"
            ]
          },
          {
            "code": "AMA-LUY-LON",
            "name": "Longuita",
            "postalCodes": [
              "01425"
            ]
          },
          {
            "code": "AMA-LUY-LON",
            "name": "Lonya Chico",
            "postalCodes": [
              "01500"
            ]
          },
          {
            "code": "AMA-LUY-LUY",
            "name": "Luya",
            "postalCodes": [
              "01510"
            ]
          },
          {
            "code": "AMA-LUY-LUY",
            "name": "Luya Viejo",
            "postalCodes": [
              "01575"
            ]
          },
          {
            "code": "AMA-LUY-MAR",
            "name": "María",
            "postalCodes": [
              "01430"
            ]
          },
          {
            "code": "AMA-LUY-OCA",
            "name": "Ocalli",
            "postalCodes": [
              "01545"
            ]
          },
          {
            "code": "AMA-LUY-OCU",
            "name": "Ocumal",
            "postalCodes": [
              "01535"
            ]
          },
          {
            "code": "AMA-LUY-PIS",
            "name": "Pisuquia",
            "postalCodes": [
              "01485",
              "01486"
            ]
          },
          {
            "code": "AMA-LUY-PRO",
            "name": "Providencia",
            "postalCodes": [
              "01540"
            ]
          },
          {
            "code": "AMA-LUY-SAN",
            "name": "San Cristobal",
            "postalCodes": [
              "01520"
            ]
          },
          {
            "code": "AMA-LUY-SAN",
            "name": "San Francisco del Yeso",
            "postalCodes": [
              "01450"
            ]
          },
          {
            "code": "AMA-LUY-SAN",
            "name": "San Jerónimo",
            "postalCodes": [
              "01525"
            ]
          },
          {
            "code": "AMA-LUY-SAN",
            "name": "San Juan de Lopecancha",
            "postalCodes": [
              "01435"
            ]
          },
          {
            "code": "AMA-LUY-SAN",
            "name": "Santa Catalina",
            "postalCodes": [
              "01580"
            ]
          },
          {
            "code": "AMA-LUY-SAN",
            "name": "Santo Tomas",
            "postalCodes": [
              "01445"
            ]
          },
          {
            "code": "AMA-LUY-TIN",
            "name": "Tingo",
            "postalCodes": [
              "01415"
            ]
          },
          {
            "code": "AMA-LUY-TRI",
            "name": "Trita",
            "postalCodes": [
              "01570"
            ]
          }
        ],
        "cities": [
          {
            "code": "AMA-LUY-CAM",
            "name": "Camporredondo",
            "postalCodes": [
              "01550",
              "01551"
            ]
          },
          {
            "code": "AMA-LUY-COC",
            "name": "Cocabamba",
            "postalCodes": [
              "01480"
            ]
          },
          {
            "code": "AMA-LUY-COH",
            "name": "Cohechan",
            "postalCodes": [
              "01530"
            ]
          },
          {
            "code": "AMA-LUY-COL",
            "name": "Colcamar",
            "postalCodes": [
              "01420"
            ]
          },
          {
            "code": "AMA-LUY-COL",
            "name": "Collonce",
            "postalCodes": [
              "01535"
            ]
          },
          {
            "code": "AMA-LUY-ING",
            "name": "Inguilpata",
            "postalCodes": [
              "01505"
            ]
          },
          {
            "code": "AMA-LUY-LAM",
            "name": "Lamud",
            "postalCodes": [
              "01515"
            ]
          },
          {
            "code": "AMA-LUY-LON",
            "name": "Longuita",
            "postalCodes": [
              "01425"
            ]
          },
          {
            "code": "AMA-LUY-LON",
            "name": "Lonya Chico",
            "postalCodes": [
              "01500"
            ]
          },
          {
            "code": "AMA-LUY-LUY",
            "name": "Luya",
            "postalCodes": [
              "01510"
            ]
          },
          {
            "code": "AMA-LUY-LUY",
            "name": "Luya Viejo",
            "postalCodes": [
              "01575"
            ]
          },
          {
            "code": "AMA-LUY-MAR",
            "name": "Maria",
            "postalCodes": [
              "01430"
            ]
          },
          {
            "code": "AMA-LUY-OCA",
            "name": "Ocalli",
            "postalCodes": [
              "01545"
            ]
          },
          {
            "code": "AMA-LUY-OLT",
            "name": "Olto",
            "postalCodes": [
              "01520"
            ]
          },
          {
            "code": "AMA-LUY-PAC",
            "name": "Paclas",
            "postalCodes": [
              "01525"
            ]
          },
          {
            "code": "AMA-LUY-PRO",
            "name": "Providencia",
            "postalCodes": [
              "01540"
            ]
          },
          {
            "code": "AMA-LUY-SAN",
            "name": "San Francisco del Yeso",
            "postalCodes": [
              "01450"
            ]
          },
          {
            "code": "AMA-LUY-SAN",
            "name": "San Juan de Lopecancha",
            "postalCodes": [
              "01435"
            ]
          },
          {
            "code": "AMA-LUY-SAN",
            "name": "Santa Catalina",
            "postalCodes": [
              "01580"
            ]
          },
          {
            "code": "AMA-LUY-SAN",
            "name": "Santo Tomas",
            "postalCodes": [
              "01445",
              "06760",
              "06761",
              "08420",
              "08421"
            ]
          },
          {
            "code": "AMA-LUY-TIN",
            "name": "Tingo",
            "postalCodes": [
              "01415"
            ]
          },
          {
            "code": "AMA-LUY-TRI",
            "name": "Trita",
            "postalCodes": [
              "01570"
            ]
          },
          {
            "code": "AMA-LUY-YOM",
            "name": "Yomblon",
            "postalCodes": [
              "01485",
              "01486"
            ]
          }
        ]
      },
      {
        "code": "AMA-ROD",
        "name": "Rodriguez de Mendoza",
        "districts": [
          {
            "code": "AMA-ROD-CHI",
            "name": "Chirimoto",
            "postalCodes": [
              "01380"
            ]
          },
          {
            "code": "AMA-ROD-COC",
            "name": "Cochamal",
            "postalCodes": [
              "01350"
            ]
          },
          {
            "code": "AMA-ROD-HUA",
            "name": "Huambo",
            "postalCodes": [
              "01355"
            ]
          },
          {
            "code": "AMA-ROD-LIM",
            "name": "Limabamba",
            "postalCodes": [
              "01370"
            ]
          },
          {
            "code": "AMA-ROD-LON",
            "name": "Longar",
            "postalCodes": [
              "01345"
            ]
          },
          {
            "code": "AMA-ROD-MAR",
            "name": "Mariscal Benavides",
            "postalCodes": [
              "01330"
            ]
          },
          {
            "code": "AMA-ROD-MIL",
            "name": "Milpuc",
            "postalCodes": [
              "01375"
            ]
          },
          {
            "code": "AMA-ROD-OMI",
            "name": "Omia",
            "postalCodes": [
              "01340",
              "01341"
            ]
          },
          {
            "code": "AMA-ROD-SAN",
            "name": "San Nicolas",
            "postalCodes": [
              "01335"
            ]
          },
          {
            "code": "AMA-ROD-SAN",
            "name": "Santa Rosa",
            "postalCodes": [
              "01360"
            ]
          },
          {
            "code": "AMA-ROD-TOT",
            "name": "Totora",
            "postalCodes": [
              "01365"
            ]
          },
          {
            "code": "AMA-ROD-VIS",
            "name": "Vista Alegre",
            "postalCodes": [
              "01325"
            ]
          }
        ],
        "cities": [
          {
            "code": "AMA-ROD-CHI",
            "name": "Chirimoto",
            "postalCodes": [
              "01380"
            ]
          },
          {
            "code": "AMA-ROD-COC",
            "name": "Cochamal",
            "postalCodes": [
              "01350"
            ]
          },
          {
            "code": "AMA-ROD-HUA",
            "name": "Huambo",
            "postalCodes": [
              "01355",
              "04120"
            ]
          },
          {
            "code": "AMA-ROD-LIM",
            "name": "Limabamba",
            "postalCodes": [
              "01370"
            ]
          },
          {
            "code": "AMA-ROD-LON",
            "name": "Longar",
            "postalCodes": [
              "01345"
            ]
          },
          {
            "code": "AMA-ROD-MAR",
            "name": "Mariscal Benavides",
            "postalCodes": [
              "01330"
            ]
          },
          {
            "code": "AMA-ROD-MEN",
            "name": "Mendoza",
            "postalCodes": [
              "01335"
            ]
          },
          {
            "code": "AMA-ROD-MIL",
            "name": "Milpuc",
            "postalCodes": [
              "01375"
            ]
          },
          {
            "code": "AMA-ROD-OMI",
            "name": "Omia",
            "postalCodes": [
              "01340",
              "01341"
            ]
          },
          {
            "code": "AMA-ROD-SAN",
            "name": "Santa Rosa de Huayabamba",
            "postalCodes": [
              "01360"
            ]
          },
          {
            "code": "AMA-ROD-TOT",
            "name": "Totora",
            "postalCodes": [
              "01365"
            ]
          },
          {
            "code": "AMA-ROD-VIS",
            "name": "Vista Alegre",
            "postalCodes": [
              "01325",
              "11400",
              "11401"
            ]
          }
        ]
      },
      {
        "code": "AMA-UTC",
        "name": "Utcubamba",
        "districts": [
          {
            "code": "AMA-UTC-BAG",
            "name": "Bagua Grande",
            "postalCodes": [
              "01620",
              "01621"
            ]
          },
          {
            "code": "AMA-UTC-CAJ",
            "name": "Cajaruro",
            "postalCodes": [
              "01700",
              "01701"
            ]
          },
          {
            "code": "AMA-UTC-CUM",
            "name": "Cumba",
            "postalCodes": [
              "01565",
              "01566"
            ]
          },
          {
            "code": "AMA-UTC-EL ",
            "name": "El Milagro",
            "postalCodes": [
              "01630",
              "01631"
            ]
          },
          {
            "code": "AMA-UTC-JAM",
            "name": "Jamalca",
            "postalCodes": [
              "01611",
              "01610"
            ]
          },
          {
            "code": "AMA-UTC-LON",
            "name": "Lonya Grande",
            "postalCodes": [
              "01556",
              "01555"
            ]
          },
          {
            "code": "AMA-UTC-YAM",
            "name": "Yamón",
            "postalCodes": [
              "01560"
            ]
          }
        ],
        "cities": [
          {
            "code": "AMA-UTC-BAG",
            "name": "Bagua Grande",
            "postalCodes": [
              "01620",
              "01621"
            ]
          },
          {
            "code": "AMA-UTC-CAJ",
            "name": "Cajaruro",
            "postalCodes": [
              "01700",
              "01701"
            ]
          },
          {
            "code": "AMA-UTC-CUM",
            "name": "Cumba",
            "postalCodes": [
              "01565",
              "01566"
            ]
          },
          {
            "code": "AMA-UTC-EL ",
            "name": "El Milagro",
            "postalCodes": [
              "01630",
              "01631"
            ]
          },
          {
            "code": "AMA-UTC-JAM",
            "name": "Jamalca",
            "postalCodes": [
              "01610",
              "01611"
            ]
          },
          {
            "code": "AMA-UTC-LON",
            "name": "Lonya Grande",
            "postalCodes": [
              "01555",
              "01556"
            ]
          },
          {
            "code": "AMA-UTC-YAM",
            "name": "Yamon",
            "postalCodes": [
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
        "code": "ANC-AIJ",
        "name": "Aija",
        "districts": [
          {
            "code": "ANC-AIJ-AIJ",
            "name": "Aija",
            "postalCodes": [
              "02610"
            ]
          },
          {
            "code": "ANC-AIJ-COR",
            "name": "Coris",
            "postalCodes": [
              "02621"
            ]
          },
          {
            "code": "ANC-AIJ-HUA",
            "name": "Huacllan",
            "postalCodes": [
              "02625"
            ]
          },
          {
            "code": "ANC-AIJ-LA ",
            "name": "La Merced",
            "postalCodes": [
              "02613"
            ]
          },
          {
            "code": "ANC-AIJ-SUC",
            "name": "Succha",
            "postalCodes": [
              "02616"
            ]
          }
        ],
        "cities": [
          {
            "code": "ANC-AIJ-AIJ",
            "name": "Aija",
            "postalCodes": [
              "02610"
            ]
          },
          {
            "code": "ANC-AIJ-COR",
            "name": "Coris",
            "postalCodes": [
              "02621"
            ]
          },
          {
            "code": "ANC-AIJ-HUA",
            "name": "Huacllan",
            "postalCodes": [
              "02625"
            ]
          },
          {
            "code": "ANC-AIJ-LA ",
            "name": "La Merced",
            "postalCodes": [
              "02613",
              "09355",
              "12855",
              "12856"
            ]
          },
          {
            "code": "ANC-AIJ-SUC",
            "name": "Succha",
            "postalCodes": [
              "02616"
            ]
          }
        ]
      },
      {
        "code": "ANC-ANT",
        "name": "Antonio Raymondi",
        "districts": [
          {
            "code": "ANC-ANT-ACZ",
            "name": "Aczo",
            "postalCodes": [
              "02340"
            ]
          },
          {
            "code": "ANC-ANT-CHA",
            "name": "Chaccho",
            "postalCodes": [
              "02348"
            ]
          },
          {
            "code": "ANC-ANT-CHI",
            "name": "Chingas",
            "postalCodes": [
              "02342"
            ]
          },
          {
            "code": "ANC-ANT-LLA",
            "name": "Llamellin",
            "postalCodes": [
              "02345"
            ]
          },
          {
            "code": "ANC-ANT-MIR",
            "name": "Mirgas",
            "postalCodes": [
              "02350",
              "02352"
            ]
          },
          {
            "code": "ANC-ANT-SAN",
            "name": "San Juan de Rontoy",
            "postalCodes": [
              "02335"
            ]
          }
        ],
        "cities": [
          {
            "code": "ANC-ANT-ACZ",
            "name": "Aczo",
            "postalCodes": [
              "02340"
            ]
          },
          {
            "code": "ANC-ANT-CHA",
            "name": "Chaccho",
            "postalCodes": [
              "02348"
            ]
          },
          {
            "code": "ANC-ANT-CHI",
            "name": "Chingas",
            "postalCodes": [
              "02342"
            ]
          },
          {
            "code": "ANC-ANT-LLA",
            "name": "Llamellin",
            "postalCodes": [
              "02345"
            ]
          },
          {
            "code": "ANC-ANT-MIR",
            "name": "Mirgas",
            "postalCodes": [
              "02350",
              "02352"
            ]
          },
          {
            "code": "ANC-ANT-SAN",
            "name": "San Juan de Rontoy",
            "postalCodes": [
              "02335"
            ]
          }
        ]
      },
      {
        "code": "ANC-ASU",
        "name": "Asunción",
        "districts": [
          {
            "code": "ANC-ASU-ACO",
            "name": "Acochaca",
            "postalCodes": [
              "02314"
            ]
          },
          {
            "code": "ANC-ASU-CHA",
            "name": "Chacas",
            "postalCodes": [
              "02318",
              "02315"
            ]
          }
        ],
        "cities": [
          {
            "code": "ANC-ASU-ACO",
            "name": "Acochaca",
            "postalCodes": [
              "02314"
            ]
          },
          {
            "code": "ANC-ASU-CHA",
            "name": "Chacas",
            "postalCodes": [
              "02315",
              "02318"
            ]
          }
        ]
      },
      {
        "code": "ANC-BOL",
        "name": "Bolognesi",
        "districts": [
          {
            "code": "ANC-BOL-ABE",
            "name": "Abelardo Pardo Lezameta",
            "postalCodes": [
              "02435"
            ]
          },
          {
            "code": "ANC-BOL-ANT",
            "name": "Antonio Raymondi",
            "postalCodes": [
              "02489"
            ]
          },
          {
            "code": "ANC-BOL-AQU",
            "name": "Aquía",
            "postalCodes": [
              "02420"
            ]
          },
          {
            "code": "ANC-BOL-CAJ",
            "name": "Cajacay",
            "postalCodes": [
              "02485"
            ]
          },
          {
            "code": "ANC-BOL-CAN",
            "name": "Canis",
            "postalCodes": [
              "02445"
            ]
          },
          {
            "code": "ANC-BOL-CHI",
            "name": "Chiquian",
            "postalCodes": [
              "02413"
            ]
          },
          {
            "code": "ANC-BOL-COL",
            "name": "Colquioc",
            "postalCodes": [
              "02500"
            ]
          },
          {
            "code": "ANC-BOL-HUA",
            "name": "Huallanca",
            "postalCodes": [
              "02422",
              "02425"
            ]
          },
          {
            "code": "ANC-BOL-HUA",
            "name": "Huasta",
            "postalCodes": [
              "02415"
            ]
          },
          {
            "code": "ANC-BOL-HUA",
            "name": "Huayllacayan",
            "postalCodes": [
              "02510"
            ]
          },
          {
            "code": "ANC-BOL-LA ",
            "name": "La Primavera",
            "postalCodes": [
              "02440"
            ]
          },
          {
            "code": "ANC-BOL-MAN",
            "name": "Mangas",
            "postalCodes": [
              "02441"
            ]
          },
          {
            "code": "ANC-BOL-PAC",
            "name": "Pacllon",
            "postalCodes": [
              "02426"
            ]
          },
          {
            "code": "ANC-BOL-SAN",
            "name": "San Miguel de Corpanqui",
            "postalCodes": [
              "02432"
            ]
          },
          {
            "code": "ANC-BOL-TIC",
            "name": "Ticllos",
            "postalCodes": [
              "02430"
            ]
          }
        ],
        "cities": [
          {
            "code": "ANC-BOL-AQU",
            "name": "Aquia",
            "postalCodes": [
              "02420"
            ]
          },
          {
            "code": "ANC-BOL-CAJ",
            "name": "Cajacay",
            "postalCodes": [
              "02485"
            ]
          },
          {
            "code": "ANC-BOL-CAN",
            "name": "Canis",
            "postalCodes": [
              "02445"
            ]
          },
          {
            "code": "ANC-BOL-CHA",
            "name": "Chasquitambo",
            "postalCodes": [
              "02500"
            ]
          },
          {
            "code": "ANC-BOL-CHI",
            "name": "Chiquian",
            "postalCodes": [
              "02413"
            ]
          },
          {
            "code": "ANC-BOL-COR",
            "name": "Corpanqui",
            "postalCodes": [
              "02432"
            ]
          },
          {
            "code": "ANC-BOL-GOR",
            "name": "Gorgorillo",
            "postalCodes": [
              "02440"
            ]
          },
          {
            "code": "ANC-HUA-HUA",
            "name": "Huallanca",
            "postalCodes": [
              "02193",
              "02422",
              "02425"
            ]
          },
          {
            "code": "ANC-BOL-HUA",
            "name": "Huasta",
            "postalCodes": [
              "02415"
            ]
          },
          {
            "code": "ANC-BOL-HUA",
            "name": "Huayllacayan",
            "postalCodes": [
              "02510"
            ]
          },
          {
            "code": "ANC-BOL-LLA",
            "name": "Llaclla",
            "postalCodes": [
              "02435"
            ]
          },
          {
            "code": "ANC-BOL-MAN",
            "name": "Mangas",
            "postalCodes": [
              "02441"
            ]
          },
          {
            "code": "ANC-BOL-PAC",
            "name": "Pacllon",
            "postalCodes": [
              "02426"
            ]
          },
          {
            "code": "ANC-BOL-RAQ",
            "name": "Raquia",
            "postalCodes": [
              "02489"
            ]
          },
          {
            "code": "ANC-BOL-TIC",
            "name": "Ticllos",
            "postalCodes": [
              "02430"
            ]
          }
        ]
      },
      {
        "code": "ANC-CAR",
        "name": "Carhuaz",
        "districts": [
          {
            "code": "ANC-CAR-ACO",
            "name": "Acopampa",
            "postalCodes": [
              "02123"
            ]
          },
          {
            "code": "ANC-CAR-AMA",
            "name": "Amashca",
            "postalCodes": [
              "02130"
            ]
          },
          {
            "code": "ANC-CAR-ANT",
            "name": "Anta",
            "postalCodes": [
              "02105"
            ]
          },
          {
            "code": "ANC-CAR-ATA",
            "name": "Ataquero",
            "postalCodes": [
              "02139"
            ]
          },
          {
            "code": "ANC-CAR-CAR",
            "name": "Carhuaz",
            "postalCodes": [
              "02125",
              "02127"
            ]
          },
          {
            "code": "ANC-CAR-MAR",
            "name": "Marcara",
            "postalCodes": [
              "02109",
              "02110"
            ]
          },
          {
            "code": "ANC-CAR-PAR",
            "name": "Pariahuanca",
            "postalCodes": [
              "02113"
            ]
          },
          {
            "code": "ANC-CAR-SAN",
            "name": "San Miguel de Aco",
            "postalCodes": [
              "02115"
            ]
          },
          {
            "code": "ANC-CAR-SHI",
            "name": "Shilla",
            "postalCodes": [
              "02133"
            ]
          },
          {
            "code": "ANC-CAR-TIN",
            "name": "Tinco",
            "postalCodes": [
              "02135"
            ]
          },
          {
            "code": "ANC-CAR-YUN",
            "name": "Yungar",
            "postalCodes": [
              "02103"
            ]
          }
        ],
        "cities": [
          {
            "code": "ANC-CAR-ACO",
            "name": "Aco",
            "postalCodes": [
              "02115",
              "02215",
              "02480",
              "12510"
            ]
          },
          {
            "code": "ANC-CAR-ACO",
            "name": "Acopampa",
            "postalCodes": [
              "02123"
            ]
          },
          {
            "code": "ANC-CAR-AMA",
            "name": "Amashca",
            "postalCodes": [
              "02130"
            ]
          },
          {
            "code": "ANC-CAR-ANT",
            "name": "Anta",
            "postalCodes": [
              "02105",
              "08615",
              "08616",
              "09375",
              "09376"
            ]
          },
          {
            "code": "ANC-CAR-CAR",
            "name": "Carhuac",
            "postalCodes": [
              "02139"
            ]
          },
          {
            "code": "ANC-CAR-CAR",
            "name": "Carhuaz",
            "postalCodes": [
              "02125",
              "02127"
            ]
          },
          {
            "code": "ANC-CAR-MAR",
            "name": "Marcara",
            "postalCodes": [
              "02109",
              "02110"
            ]
          },
          {
            "code": "ANC-CAR-PAR",
            "name": "Pariahuanca",
            "postalCodes": [
              "02113"
            ]
          },
          {
            "code": "ANC-CAR-SHI",
            "name": "Shilla",
            "postalCodes": [
              "02133"
            ]
          },
          {
            "code": "ANC-CAR-TIN",
            "name": "Tinco",
            "postalCodes": [
              "02135"
            ]
          },
          {
            "code": "ANC-CAR-YUN",
            "name": "Yungar",
            "postalCodes": [
              "02103"
            ]
          }
        ]
      },
      {
        "code": "ANC-CAR",
        "name": "Carlos Fermín Fitzcarrald",
        "districts": [
          {
            "code": "ANC-CAR-SAN",
            "name": "San Luis",
            "postalCodes": [
              "02311",
              "02310"
            ]
          },
          {
            "code": "ANC-CAR-SAN",
            "name": "San Nicolas",
            "postalCodes": [
              "02285"
            ]
          },
          {
            "code": "ANC-CAR-YAU",
            "name": "Yauya",
            "postalCodes": [
              "02280",
              "02283"
            ]
          }
        ],
        "cities": [
          {
            "code": "ANC-CAR-SAN",
            "name": "San Luis",
            "postalCodes": [
              "02310",
              "02311",
              "15004",
              "15019",
              "15021",
              "15022",
              "15719",
              "15720"
            ]
          },
          {
            "code": "ANC-CAR-SAN",
            "name": "San Nicolas",
            "postalCodes": [
              "02285"
            ]
          },
          {
            "code": "ANC-CAR-YAU",
            "name": "Yauya",
            "postalCodes": [
              "02280",
              "02283"
            ]
          }
        ]
      },
      {
        "code": "ANC-CAS",
        "name": "Casma",
        "districts": [
          {
            "code": "ANC-CAS-BUE",
            "name": "Buena Vista Alta",
            "postalCodes": [
              "02670"
            ]
          },
          {
            "code": "ANC-CAS-CAS",
            "name": "Casma",
            "postalCodes": [
              "02661",
              "02660"
            ]
          },
          {
            "code": "ANC-CAS-COM",
            "name": "Comandante Noel",
            "postalCodes": [
              "02665"
            ]
          },
          {
            "code": "ANC-CAS-YAU",
            "name": "Yautan",
            "postalCodes": [
              "02681",
              "02680"
            ]
          }
        ],
        "cities": [
          {
            "code": "ANC-CAS-BUE",
            "name": "Buena Vista Alta",
            "postalCodes": [
              "02670"
            ]
          },
          {
            "code": "ANC-CAS-CAS",
            "name": "Casma",
            "postalCodes": [
              "02660",
              "02661"
            ]
          },
          {
            "code": "ANC-CAS-PUE",
            "name": "Puerto Casma",
            "postalCodes": [
              "02665"
            ]
          },
          {
            "code": "ANC-CAS-YAU",
            "name": "Yautan",
            "postalCodes": [
              "02680",
              "02681"
            ]
          }
        ]
      },
      {
        "code": "ANC-COR",
        "name": "Corongo",
        "districts": [
          {
            "code": "ANC-COR-ACO",
            "name": "Aco",
            "postalCodes": [
              "02215"
            ]
          },
          {
            "code": "ANC-COR-BAM",
            "name": "Bambas",
            "postalCodes": [
              "02205"
            ]
          },
          {
            "code": "ANC-COR-COR",
            "name": "Corongo",
            "postalCodes": [
              "02218"
            ]
          },
          {
            "code": "ANC-COR-CUS",
            "name": "Cusca",
            "postalCodes": [
              "02210"
            ]
          },
          {
            "code": "ANC-COR-LA ",
            "name": "La Pampa",
            "postalCodes": [
              "02200"
            ]
          },
          {
            "code": "ANC-COR-YAN",
            "name": "Yanac",
            "postalCodes": [
              "02209"
            ]
          },
          {
            "code": "ANC-COR-YUP",
            "name": "Yupan",
            "postalCodes": [
              "02203"
            ]
          }
        ],
        "cities": [
          {
            "code": "ANC-CAR-ACO",
            "name": "Aco",
            "postalCodes": [
              "02115",
              "02215",
              "02480",
              "12510"
            ]
          },
          {
            "code": "ANC-COR-BAM",
            "name": "Bambas",
            "postalCodes": [
              "02205"
            ]
          },
          {
            "code": "ANC-COR-COR",
            "name": "Corongo",
            "postalCodes": [
              "02218"
            ]
          },
          {
            "code": "ANC-COR-CUS",
            "name": "Cusca",
            "postalCodes": [
              "02210"
            ]
          },
          {
            "code": "ANC-COR-LA ",
            "name": "La Pampa",
            "postalCodes": [
              "02200",
              "04445",
              "04446"
            ]
          },
          {
            "code": "ANC-COR-YAN",
            "name": "Yanac",
            "postalCodes": [
              "02209"
            ]
          },
          {
            "code": "ANC-COR-YUP",
            "name": "Yupan",
            "postalCodes": [
              "02203"
            ]
          }
        ]
      },
      {
        "code": "ANC-HUA",
        "name": "Huaraz",
        "districts": [
          {
            "code": "ANC-HUA-COC",
            "name": "Cochabamba",
            "postalCodes": [
              "02690"
            ]
          },
          {
            "code": "ANC-HUA-COL",
            "name": "Colcabamba",
            "postalCodes": [
              "02695"
            ]
          },
          {
            "code": "ANC-HUA-HUA",
            "name": "Huanchay",
            "postalCodes": [
              "02607"
            ]
          },
          {
            "code": "ANC-HUA-HUA",
            "name": "Huaraz",
            "postalCodes": [
              "02001",
              "02002",
              "02000"
            ]
          },
          {
            "code": "ANC-HUA-IND",
            "name": "Independencia",
            "postalCodes": [
              "02002",
              "02000"
            ]
          },
          {
            "code": "ANC-HUA-JAN",
            "name": "Jangas",
            "postalCodes": [
              "02100"
            ]
          },
          {
            "code": "ANC-HUA-LA ",
            "name": "La Libertad",
            "postalCodes": [
              "02603"
            ]
          },
          {
            "code": "ANC-HUA-OLL",
            "name": "Olleros",
            "postalCodes": [
              "02400"
            ]
          },
          {
            "code": "ANC-HUA-PAM",
            "name": "Pampas",
            "postalCodes": [
              "02605"
            ]
          },
          {
            "code": "ANC-HUA-PAR",
            "name": "Pariacoto",
            "postalCodes": [
              "02685"
            ]
          },
          {
            "code": "ANC-HUA-PIR",
            "name": "Pira",
            "postalCodes": [
              "02600"
            ]
          },
          {
            "code": "ANC-HUA-TAR",
            "name": "Tarica",
            "postalCodes": [
              "02120",
              "02119"
            ]
          }
        ],
        "cities": [
          {
            "code": "ANC-HUA-CAJ",
            "name": "Cajamarquilla",
            "postalCodes": [
              "02603",
              "02447"
            ]
          },
          {
            "code": "ANC-HUA-CEN",
            "name": "Centenario",
            "postalCodes": [
              "02000",
              "02002"
            ]
          },
          {
            "code": "ANC-HUA-COC",
            "name": "Cochabamba",
            "postalCodes": [
              "02690",
              "06650",
              "06651",
              "10830"
            ]
          },
          {
            "code": "ANC-HUA-COL",
            "name": "Colcabamba",
            "postalCodes": [
              "02695",
              "03500",
              "09320",
              "09321"
            ]
          },
          {
            "code": "ANC-HUA-HUA",
            "name": "Huanchay",
            "postalCodes": [
              "02607",
              "02475"
            ]
          },
          {
            "code": "ANC-HUA-HUA",
            "name": "Huaraz",
            "postalCodes": [
              "02000",
              "02001",
              "02002"
            ]
          },
          {
            "code": "ANC-HUA-JAN",
            "name": "Jangas",
            "postalCodes": [
              "02100"
            ]
          },
          {
            "code": "AMA-CHA-OLL",
            "name": "Olleros",
            "postalCodes": [
              "01280",
              "02400"
            ]
          },
          {
            "code": "ANC-HUA-PAM",
            "name": "Pampas",
            "postalCodes": [
              "02605",
              "02865",
              "02866",
              "05290",
              "09155",
              "09156"
            ]
          },
          {
            "code": "ANC-HUA-PAR",
            "name": "Pariacoto",
            "postalCodes": [
              "02685"
            ]
          },
          {
            "code": "ANC-HUA-PIR",
            "name": "Pira",
            "postalCodes": [
              "02600"
            ]
          },
          {
            "code": "ANC-HUA-TAR",
            "name": "Tarica",
            "postalCodes": [
              "02119",
              "02120"
            ]
          }
        ]
      },
      {
        "code": "ANC-HUA",
        "name": "Huari",
        "districts": [
          {
            "code": "ANC-HUA-ANR",
            "name": "Anra",
            "postalCodes": [
              "02358"
            ]
          },
          {
            "code": "ANC-HUA-CAJ",
            "name": "Cajay",
            "postalCodes": [
              "02305"
            ]
          },
          {
            "code": "ANC-HUA-CHA",
            "name": "Chavín de Huantar",
            "postalCodes": [
              "02396",
              "02395"
            ]
          },
          {
            "code": "ANC-HUA-HUA",
            "name": "Huacachi",
            "postalCodes": [
              "02355"
            ]
          },
          {
            "code": "ANC-HUA-HUA",
            "name": "Huacchis",
            "postalCodes": [
              "02380"
            ]
          },
          {
            "code": "ANC-HUA-HUA",
            "name": "Huachis",
            "postalCodes": [
              "02320"
            ]
          },
          {
            "code": "ANC-HUA-HUA",
            "name": "Huantar",
            "postalCodes": [
              "02300"
            ]
          },
          {
            "code": "ANC-HUA-HUA",
            "name": "Huari",
            "postalCodes": [
              "02304",
              "02303"
            ]
          },
          {
            "code": "ANC-HUA-MAS",
            "name": "Masin",
            "postalCodes": [
              "02324"
            ]
          },
          {
            "code": "ANC-HUA-PAU",
            "name": "Paucas",
            "postalCodes": [
              "02375"
            ]
          },
          {
            "code": "ANC-HUA-PON",
            "name": "Ponto",
            "postalCodes": [
              "02330"
            ]
          },
          {
            "code": "ANC-HUA-RAH",
            "name": "Rahuapampa",
            "postalCodes": [
              "02325"
            ]
          },
          {
            "code": "ANC-HUA-RAP",
            "name": "Rapayan",
            "postalCodes": [
              "02385"
            ]
          },
          {
            "code": "ANC-HUA-SAN",
            "name": "San Marcos",
            "postalCodes": [
              "02390",
              "02391"
            ]
          },
          {
            "code": "ANC-HUA-SAN",
            "name": "San Pedro de Chama",
            "postalCodes": [
              "02333"
            ]
          },
          {
            "code": "ANC-HUA-UCO",
            "name": "Uco",
            "postalCodes": [
              "02370"
            ]
          }
        ],
        "cities": [
          {
            "code": "ANC-HUA-ANR",
            "name": "Anra",
            "postalCodes": [
              "02358"
            ]
          },
          {
            "code": "ANC-HUA-CAJ",
            "name": "Cajay",
            "postalCodes": [
              "02305"
            ]
          },
          {
            "code": "ANC-HUA-CHA",
            "name": "Chana",
            "postalCodes": [
              "02333"
            ]
          },
          {
            "code": "ANC-HUA-CHA",
            "name": "Chavin de Huantar",
            "postalCodes": [
              "02395",
              "02396"
            ]
          },
          {
            "code": "ANC-HUA-HUA",
            "name": "Huacachi",
            "postalCodes": [
              "02355"
            ]
          },
          {
            "code": "ANC-HUA-HUA",
            "name": "Huacchis",
            "postalCodes": [
              "02380"
            ]
          },
          {
            "code": "ANC-HUA-HUA",
            "name": "Huachis",
            "postalCodes": [
              "02320"
            ]
          },
          {
            "code": "ANC-HUA-HUA",
            "name": "Huantar",
            "postalCodes": [
              "02300"
            ]
          },
          {
            "code": "ANC-HUA-HUA",
            "name": "Huari",
            "postalCodes": [
              "02303",
              "02304"
            ]
          },
          {
            "code": "ANC-HUA-MAS",
            "name": "Masin",
            "postalCodes": [
              "02324"
            ]
          },
          {
            "code": "ANC-HUA-PAU",
            "name": "Paucas",
            "postalCodes": [
              "02375"
            ]
          },
          {
            "code": "ANC-HUA-PON",
            "name": "Ponto",
            "postalCodes": [
              "02330"
            ]
          },
          {
            "code": "ANC-HUA-RAH",
            "name": "Rahuapampa",
            "postalCodes": [
              "02325"
            ]
          },
          {
            "code": "ANC-HUA-RAP",
            "name": "Rapayan",
            "postalCodes": [
              "02385"
            ]
          },
          {
            "code": "ANC-HUA-SAN",
            "name": "San Marcos",
            "postalCodes": [
              "02390",
              "02391",
              "06320",
              "06321"
            ]
          },
          {
            "code": "ANC-HUA-UCO",
            "name": "Uco",
            "postalCodes": [
              "02370"
            ]
          }
        ]
      },
      {
        "code": "ANC-HUA",
        "name": "Huarmey",
        "districts": [
          {
            "code": "ANC-HUA-COC",
            "name": "Cochapeti",
            "postalCodes": [
              "02630"
            ]
          },
          {
            "code": "ANC-HUA-CUL",
            "name": "Culebras",
            "postalCodes": [
              "02655"
            ]
          },
          {
            "code": "ANC-HUA-HUA",
            "name": "Huarmey",
            "postalCodes": [
              "02651",
              "02650"
            ]
          },
          {
            "code": "ANC-HUA-HUA",
            "name": "Huayán",
            "postalCodes": [
              "02618"
            ]
          },
          {
            "code": "ANC-HUA-MAL",
            "name": "Malvas",
            "postalCodes": [
              "02627"
            ]
          }
        ],
        "cities": [
          {
            "code": "ANC-HUA-CAL",
            "name": "Caleta Culebras",
            "postalCodes": [
              "02655"
            ]
          },
          {
            "code": "ANC-HUA-COC",
            "name": "Cochapeti",
            "postalCodes": [
              "02630"
            ]
          },
          {
            "code": "ANC-HUA-HUA",
            "name": "Huarmey",
            "postalCodes": [
              "02650",
              "02651"
            ]
          },
          {
            "code": "ANC-HUA-HUA",
            "name": "Huayan",
            "postalCodes": [
              "02618"
            ]
          },
          {
            "code": "ANC-HUA-MAL",
            "name": "Malvas",
            "postalCodes": [
              "02627"
            ]
          }
        ]
      },
      {
        "code": "ANC-HUA",
        "name": "Huaylas",
        "districts": [
          {
            "code": "ANC-HUA-CAR",
            "name": "Caraz",
            "postalCodes": [
              "02167",
              "02165"
            ]
          },
          {
            "code": "ANC-HUA-HUA",
            "name": "Huallanca",
            "postalCodes": [
              "02193"
            ]
          },
          {
            "code": "ANC-HUA-HUA",
            "name": "Huata",
            "postalCodes": [
              "02175"
            ]
          },
          {
            "code": "ANC-HUA-HUA",
            "name": "Huaylas",
            "postalCodes": [
              "02185"
            ]
          },
          {
            "code": "ANC-HUA-MAT",
            "name": "Mato",
            "postalCodes": [
              "02184"
            ]
          },
          {
            "code": "ANC-HUA-PAM",
            "name": "Pamparomas",
            "postalCodes": [
              "02181",
              "02180"
            ]
          },
          {
            "code": "ANC-HUA-PUE",
            "name": "Pueblo Libre",
            "postalCodes": [
              "02171",
              "02170"
            ]
          },
          {
            "code": "ANC-HUA-SAN",
            "name": "Santa Cruz",
            "postalCodes": [
              "02174"
            ]
          },
          {
            "code": "ANC-HUA-SAN",
            "name": "Santo Toribio",
            "postalCodes": [
              "02190"
            ]
          },
          {
            "code": "ANC-HUA-YUR",
            "name": "Yuracmarca",
            "postalCodes": [
              "02195"
            ]
          }
        ],
        "cities": [
          {
            "code": "ANC-HUA-CAR",
            "name": "Caraz",
            "postalCodes": [
              "02165",
              "02167"
            ]
          },
          {
            "code": "ANC-HUA-HUA",
            "name": "Huallanca",
            "postalCodes": [
              "02193",
              "02422",
              "02425"
            ]
          },
          {
            "code": "ANC-HUA-HUA",
            "name": "Huaripampa",
            "postalCodes": [
              "02174",
              "12530"
            ]
          },
          {
            "code": "ANC-HUA-HUA",
            "name": "Huata",
            "postalCodes": [
              "02175",
              "21116",
              "21117"
            ]
          },
          {
            "code": "ANC-HUA-HUA",
            "name": "Huaylas",
            "postalCodes": [
              "02185"
            ]
          },
          {
            "code": "ANC-HUA-PAM",
            "name": "Pamparomas",
            "postalCodes": [
              "02180",
              "02181"
            ]
          },
          {
            "code": "ANC-HUA-SAN",
            "name": "San Juan",
            "postalCodes": [
              "02170",
              "02171",
              "05520",
              "06400",
              "09755",
              "11420",
              "11421",
              "16000",
              "16007",
              "16008"
            ]
          },
          {
            "code": "ANC-HUA-SAN",
            "name": "Santo Toribio",
            "postalCodes": [
              "02190"
            ]
          },
          {
            "code": "ANC-HUA-SUC",
            "name": "Sucre",
            "postalCodes": [
              "02184",
              "06205",
              "06206"
            ]
          },
          {
            "code": "ANC-HUA-YUR",
            "name": "Yuracmarca",
            "postalCodes": [
              "02195"
            ]
          }
        ]
      },
      {
        "code": "ANC-MAR",
        "name": "Mariscal Luzuriaga",
        "districts": [
          {
            "code": "ANC-MAR-CAS",
            "name": "Casca",
            "postalCodes": [
              "02264"
            ]
          },
          {
            "code": "ANC-MAR-ELE",
            "name": "Eleazar Guzman Barrón",
            "postalCodes": [
              "02279"
            ]
          },
          {
            "code": "ANC-MAR-FID",
            "name": "Fidel Olivas Escudero",
            "postalCodes": [
              "02270"
            ]
          },
          {
            "code": "ANC-MAR-LLA",
            "name": "Llama",
            "postalCodes": [
              "02275"
            ]
          },
          {
            "code": "ANC-MAR-LLU",
            "name": "Llumpa",
            "postalCodes": [
              "02289",
              "02291"
            ]
          },
          {
            "code": "ANC-MAR-LUC",
            "name": "Lucma",
            "postalCodes": [
              "02290"
            ]
          },
          {
            "code": "ANC-MAR-MUS",
            "name": "Musga",
            "postalCodes": [
              "02273"
            ]
          },
          {
            "code": "ANC-MAR-PIS",
            "name": "Piscobamba",
            "postalCodes": [
              "02265"
            ]
          }
        ],
        "cities": [
          {
            "code": "ANC-MAR-CAS",
            "name": "Casca",
            "postalCodes": [
              "02264"
            ]
          },
          {
            "code": "ANC-MAR-LLA",
            "name": "Llama",
            "postalCodes": [
              "02275",
              "06665",
              "06666"
            ]
          },
          {
            "code": "ANC-MAR-LLU",
            "name": "Llumpa",
            "postalCodes": [
              "02289",
              "02291"
            ]
          },
          {
            "code": "ANC-MAR-LUC",
            "name": "Lucma",
            "postalCodes": [
              "02290",
              "08720",
              "08721",
              "13240",
              "13241"
            ]
          },
          {
            "code": "ANC-MAR-MUS",
            "name": "Musga",
            "postalCodes": [
              "02273"
            ]
          },
          {
            "code": "ANC-MAR-PAM",
            "name": "Pampachacra",
            "postalCodes": [
              "02279"
            ]
          },
          {
            "code": "ANC-MAR-PIS",
            "name": "Piscobamba",
            "postalCodes": [
              "02265"
            ]
          },
          {
            "code": "ANC-MAR-SAN",
            "name": "Sanachgan",
            "postalCodes": [
              "02270"
            ]
          }
        ]
      },
      {
        "code": "ANC-OCR",
        "name": "Ocros",
        "districts": [
          {
            "code": "ANC-OCR-ACA",
            "name": "Acas",
            "postalCodes": [
              "02470"
            ]
          },
          {
            "code": "ANC-OCR-CAJ",
            "name": "Cajamarquilla",
            "postalCodes": [
              "02447"
            ]
          },
          {
            "code": "ANC-OCR-CAR",
            "name": "Carhuapampa",
            "postalCodes": [
              "02480"
            ]
          },
          {
            "code": "ANC-OCR-COC",
            "name": "Cochas",
            "postalCodes": [
              "02475"
            ]
          },
          {
            "code": "ANC-OCR-CON",
            "name": "Congas",
            "postalCodes": [
              "02530"
            ]
          },
          {
            "code": "ANC-OCR-LLI",
            "name": "Llipa",
            "postalCodes": [
              "02455"
            ]
          },
          {
            "code": "ANC-OCR-OCR",
            "name": "Ocros",
            "postalCodes": [
              "02460"
            ]
          },
          {
            "code": "ANC-OCR-SAN",
            "name": "San Cristobal de Rajan",
            "postalCodes": [
              "02450"
            ]
          },
          {
            "code": "ANC-OCR-SAN",
            "name": "San Pedro",
            "postalCodes": [
              "02520"
            ]
          },
          {
            "code": "ANC-OCR-SAN",
            "name": "Santiago de Chilcas",
            "postalCodes": [
              "02465"
            ]
          }
        ],
        "cities": [
          {
            "code": "ANC-OCR-ACA",
            "name": "Acas",
            "postalCodes": [
              "02470"
            ]
          },
          {
            "code": "ANC-CAR-ACO",
            "name": "Aco",
            "postalCodes": [
              "02115",
              "02215",
              "02480",
              "12510"
            ]
          },
          {
            "code": "ANC-HUA-CAJ",
            "name": "Cajamarquilla",
            "postalCodes": [
              "02603",
              "02447"
            ]
          },
          {
            "code": "ANC-OCR-CON",
            "name": "Congas",
            "postalCodes": [
              "02530"
            ]
          },
          {
            "code": "ANC-OCR-COP",
            "name": "Copa",
            "postalCodes": [
              "02520",
              "15197"
            ]
          },
          {
            "code": "ANC-HUA-HUA",
            "name": "Huanchay",
            "postalCodes": [
              "02607",
              "02475"
            ]
          },
          {
            "code": "ANC-OCR-LLI",
            "name": "Llipa",
            "postalCodes": [
              "02455"
            ]
          },
          {
            "code": "ANC-OCR-OCR",
            "name": "Ocros",
            "postalCodes": [
              "02460",
              "05310",
              "05311"
            ]
          },
          {
            "code": "ANC-OCR-RAJ",
            "name": "Rajan",
            "postalCodes": [
              "02450"
            ]
          },
          {
            "code": "ANC-OCR-SAN",
            "name": "Santiago de Chilcas",
            "postalCodes": [
              "02465"
            ]
          }
        ]
      },
      {
        "code": "ANC-PAL",
        "name": "Pallasca",
        "districts": [
          {
            "code": "ANC-PAL-BOL",
            "name": "Bolognesi",
            "postalCodes": [
              "02830"
            ]
          },
          {
            "code": "ANC-PAL-CAB",
            "name": "Cabana",
            "postalCodes": [
              "02850"
            ]
          },
          {
            "code": "ANC-PAL-CON",
            "name": "Conchucos",
            "postalCodes": [
              "02876",
              "02875"
            ]
          },
          {
            "code": "ANC-PAL-HUA",
            "name": "Huacaschuque",
            "postalCodes": [
              "02860"
            ]
          },
          {
            "code": "ANC-PAL-HUA",
            "name": "Huandoval",
            "postalCodes": [
              "02855"
            ]
          },
          {
            "code": "ANC-PAL-LAC",
            "name": "Lacabamba",
            "postalCodes": [
              "02870"
            ]
          },
          {
            "code": "ANC-PAL-LLA",
            "name": "Llapo",
            "postalCodes": [
              "02840"
            ]
          },
          {
            "code": "ANC-PAL-PAL",
            "name": "Pallasca",
            "postalCodes": [
              "02835"
            ]
          },
          {
            "code": "ANC-PAL-PAM",
            "name": "Pampas",
            "postalCodes": [
              "02865",
              "02866"
            ]
          },
          {
            "code": "ANC-PAL-SAN",
            "name": "Santa Rosa",
            "postalCodes": [
              "02825"
            ]
          },
          {
            "code": "ANC-PAL-TAU",
            "name": "Tauca",
            "postalCodes": [
              "02845"
            ]
          }
        ],
        "cities": [
          {
            "code": "ANC-PAL-BOL",
            "name": "Bolognesi",
            "postalCodes": [
              "02830",
              "25220",
              "25221"
            ]
          },
          {
            "code": "ANC-PAL-CAB",
            "name": "Cabana",
            "postalCodes": [
              "02850",
              "05475",
              "21700"
            ]
          },
          {
            "code": "ANC-PAL-CON",
            "name": "Conchucos",
            "postalCodes": [
              "02875",
              "02876"
            ]
          },
          {
            "code": "ANC-PAL-HUA",
            "name": "Huacaschuque",
            "postalCodes": [
              "02860"
            ]
          },
          {
            "code": "ANC-PAL-HUA",
            "name": "Huandoval",
            "postalCodes": [
              "02855"
            ]
          },
          {
            "code": "ANC-PAL-LAC",
            "name": "Lacabamba",
            "postalCodes": [
              "02870"
            ]
          },
          {
            "code": "ANC-PAL-LLA",
            "name": "Llapo",
            "postalCodes": [
              "02840"
            ]
          },
          {
            "code": "ANC-PAL-PAL",
            "name": "Pallasca",
            "postalCodes": [
              "02835"
            ]
          },
          {
            "code": "ANC-HUA-PAM",
            "name": "Pampas",
            "postalCodes": [
              "02605",
              "02865",
              "02866",
              "05290",
              "09155",
              "09156"
            ]
          },
          {
            "code": "ANC-PAL-SAN",
            "name": "Santa Rosa",
            "postalCodes": [
              "02825",
              "03345",
              "05240",
              "05241",
              "06820",
              "06821",
              "12200",
              "14840",
              "14841",
              "15123",
              "21885",
              "21886",
              "22720",
              "22721"
            ]
          },
          {
            "code": "ANC-PAL-TAU",
            "name": "Tauca",
            "postalCodes": [
              "02845"
            ]
          }
        ]
      },
      {
        "code": "ANC-POM",
        "name": "Pomabamba",
        "districts": [
          {
            "code": "ANC-POM-HUA",
            "name": "Huayllan",
            "postalCodes": [
              "02295"
            ]
          },
          {
            "code": "ANC-POM-PAR",
            "name": "Parobamba",
            "postalCodes": [
              "02250",
              "02254"
            ]
          },
          {
            "code": "ANC-POM-POM",
            "name": "Pomabamba",
            "postalCodes": [
              "02260",
              "02262"
            ]
          },
          {
            "code": "ANC-POM-QUI",
            "name": "Quinuabamba",
            "postalCodes": [
              "02258"
            ]
          }
        ],
        "cities": [
          {
            "code": "ANC-POM-HUA",
            "name": "Huayllan",
            "postalCodes": [
              "02295"
            ]
          },
          {
            "code": "ANC-POM-PAR",
            "name": "Parobamba",
            "postalCodes": [
              "02250",
              "02254"
            ]
          },
          {
            "code": "ANC-POM-POM",
            "name": "Pomabamba",
            "postalCodes": [
              "02260",
              "02262",
              "05840"
            ]
          },
          {
            "code": "ANC-POM-QUI",
            "name": "Quinuabamba",
            "postalCodes": [
              "02258"
            ]
          }
        ]
      },
      {
        "code": "ANC-REC",
        "name": "Recuay",
        "districts": [
          {
            "code": "ANC-REC-CAT",
            "name": "Catac",
            "postalCodes": [
              "02410"
            ]
          },
          {
            "code": "ANC-REC-COT",
            "name": "Cotaparaco",
            "postalCodes": [
              "02633"
            ]
          },
          {
            "code": "ANC-REC-HUA",
            "name": "Huayllapampa",
            "postalCodes": [
              "02495"
            ]
          },
          {
            "code": "ANC-REC-LLA",
            "name": "Llacllin",
            "postalCodes": [
              "02645"
            ]
          },
          {
            "code": "ANC-REC-MAR",
            "name": "Marca",
            "postalCodes": [
              "02490"
            ]
          },
          {
            "code": "ANC-REC-PAM",
            "name": "Pampas Chico",
            "postalCodes": [
              "02483"
            ]
          },
          {
            "code": "ANC-REC-PAR",
            "name": "Pararín",
            "postalCodes": [
              "02640"
            ]
          },
          {
            "code": "ANC-REC-REC",
            "name": "Recuay",
            "postalCodes": [
              "02405",
              "02403"
            ]
          },
          {
            "code": "ANC-REC-TAP",
            "name": "Tapacocha",
            "postalCodes": [
              "02635"
            ]
          },
          {
            "code": "ANC-REC-TIC",
            "name": "Ticapampa",
            "postalCodes": [
              "02407"
            ]
          }
        ],
        "cities": [
          {
            "code": "ANC-REC-CAT",
            "name": "Catac",
            "postalCodes": [
              "02410"
            ]
          },
          {
            "code": "ANC-REC-COT",
            "name": "Cotaparaco",
            "postalCodes": [
              "02633"
            ]
          },
          {
            "code": "ANC-REC-HUA",
            "name": "Huayllapampa",
            "postalCodes": [
              "02495"
            ]
          },
          {
            "code": "ANC-REC-LLA",
            "name": "Llacllin",
            "postalCodes": [
              "02645"
            ]
          },
          {
            "code": "ANC-REC-MAR",
            "name": "Marca",
            "postalCodes": [
              "02490"
            ]
          },
          {
            "code": "ANC-REC-PAM",
            "name": "Pampas Chico",
            "postalCodes": [
              "02483"
            ]
          },
          {
            "code": "ANC-REC-PAR",
            "name": "Pararin",
            "postalCodes": [
              "02640"
            ]
          },
          {
            "code": "ANC-REC-REC",
            "name": "Recuay",
            "postalCodes": [
              "02403",
              "02405"
            ]
          },
          {
            "code": "ANC-REC-TAP",
            "name": "Tapacocha",
            "postalCodes": [
              "02635"
            ]
          },
          {
            "code": "ANC-REC-TIC",
            "name": "Ticapampa",
            "postalCodes": [
              "02407"
            ]
          }
        ]
      },
      {
        "code": "ANC-SAN",
        "name": "Santa",
        "districts": [
          {
            "code": "ANC-SAN-CAC",
            "name": "Caceres del Perú",
            "postalCodes": [
              "02740",
              "02741"
            ]
          },
          {
            "code": "ANC-SAN-CHI",
            "name": "Chimbote",
            "postalCodes": [
              "02804",
              "02802",
              "02801",
              "02803",
              "02800"
            ]
          },
          {
            "code": "ANC-SAN-COI",
            "name": "Coishco",
            "postalCodes": [
              "02811",
              "02810"
            ]
          },
          {
            "code": "ANC-SAN-MAC",
            "name": "Macate",
            "postalCodes": [
              "02820"
            ]
          },
          {
            "code": "ANC-SAN-MOR",
            "name": "Moro",
            "postalCodes": [
              "02730",
              "02731"
            ]
          },
          {
            "code": "ANC-SAN-NEP",
            "name": "Nepeña",
            "postalCodes": [
              "02720",
              "02721"
            ]
          },
          {
            "code": "ANC-SAN-NUE",
            "name": "Nuevo Chimbote",
            "postalCodes": [
              "02712",
              "02710",
              "02711"
            ]
          },
          {
            "code": "ANC-SAN-SAM",
            "name": "Samanco",
            "postalCodes": [
              "02700"
            ]
          },
          {
            "code": "ANC-SAN-SAN",
            "name": "Santa",
            "postalCodes": [
              "02816",
              "02815"
            ]
          }
        ],
        "cities": [
          {
            "code": "ANC-SAN-BUE",
            "name": "Buenos Aires",
            "postalCodes": [
              "02710",
              "02711",
              "02712",
              "13008",
              "13009",
              "20380",
              "20381",
              "22410"
            ]
          },
          {
            "code": "ANC-SAN-CHI",
            "name": "Chimbote",
            "postalCodes": [
              "02800",
              "02801",
              "02802",
              "02803",
              "02804"
            ]
          },
          {
            "code": "ANC-SAN-COI",
            "name": "Coishco",
            "postalCodes": [
              "02810",
              "02811"
            ]
          },
          {
            "code": "ANC-SAN-JIM",
            "name": "Jimbe",
            "postalCodes": [
              "02740",
              "02741"
            ]
          },
          {
            "code": "ANC-SAN-MAC",
            "name": "Macate",
            "postalCodes": [
              "02820"
            ]
          },
          {
            "code": "ANC-SAN-MOR",
            "name": "Moro",
            "postalCodes": [
              "02730",
              "02731"
            ]
          },
          {
            "code": "ANC-SAN-NEP",
            "name": "Nepeña",
            "postalCodes": [
              "02720",
              "02721"
            ]
          },
          {
            "code": "ANC-SAN-SAM",
            "name": "Samanco",
            "postalCodes": [
              "02700"
            ]
          },
          {
            "code": "ANC-SAN-SAN",
            "name": "Santa",
            "postalCodes": [
              "02815",
              "02816"
            ]
          }
        ]
      },
      {
        "code": "ANC-SIH",
        "name": "Sihuas",
        "districts": [
          {
            "code": "ANC-SIH-ACO",
            "name": "Acobamba",
            "postalCodes": [
              "02235"
            ]
          },
          {
            "code": "ANC-SIH-ALF",
            "name": "Alfonso Ugarte",
            "postalCodes": [
              "02245"
            ]
          },
          {
            "code": "ANC-SIH-CAS",
            "name": "Cashapampa",
            "postalCodes": [
              "02225"
            ]
          },
          {
            "code": "ANC-SIH-CHI",
            "name": "Chingalpo",
            "postalCodes": [
              "02240"
            ]
          },
          {
            "code": "ANC-SIH-HUA",
            "name": "Huayllabamba",
            "postalCodes": [
              "02230"
            ]
          },
          {
            "code": "ANC-SIH-QUI",
            "name": "Quiches",
            "postalCodes": [
              "02234"
            ]
          },
          {
            "code": "ANC-SIH-RAG",
            "name": "Ragash",
            "postalCodes": [
              "02228"
            ]
          },
          {
            "code": "ANC-SIH-SAN",
            "name": "San Juan",
            "postalCodes": [
              "02249",
              "02251"
            ]
          },
          {
            "code": "ANC-SIH-SIC",
            "name": "Sicsibamba",
            "postalCodes": [
              "02243"
            ]
          },
          {
            "code": "ANC-SIH-SIH",
            "name": "Sihuas",
            "postalCodes": [
              "02222",
              "02220"
            ]
          }
        ],
        "cities": [
          {
            "code": "ANC-SIH-ACO",
            "name": "Acobamba",
            "postalCodes": [
              "02235",
              "09380",
              "09381",
              "12700",
              "12701"
            ]
          },
          {
            "code": "ANC-SIH-CAS",
            "name": "Cashapampa",
            "postalCodes": [
              "02225"
            ]
          },
          {
            "code": "ANC-SIH-CHI",
            "name": "Chingalpo",
            "postalCodes": [
              "02240"
            ]
          },
          {
            "code": "ANC-SIH-CHU",
            "name": "Chullin",
            "postalCodes": [
              "02249",
              "02251"
            ]
          },
          {
            "code": "ANC-SIH-HUA",
            "name": "Huayllabamba",
            "postalCodes": [
              "02230",
              "08670"
            ]
          },
          {
            "code": "ANC-SIH-QUI",
            "name": "Quiches",
            "postalCodes": [
              "02234"
            ]
          },
          {
            "code": "ANC-SIH-RAG",
            "name": "Ragash",
            "postalCodes": [
              "02228"
            ]
          },
          {
            "code": "ANC-SIH-SIH",
            "name": "Sihuas",
            "postalCodes": [
              "02220",
              "02222"
            ]
          },
          {
            "code": "ANC-SIH-ULL",
            "name": "Ullulluco",
            "postalCodes": [
              "02245"
            ]
          },
          {
            "code": "ANC-SIH-UMB",
            "name": "Umbe",
            "postalCodes": [
              "02243"
            ]
          }
        ]
      },
      {
        "code": "ANC-YUN",
        "name": "Yungay",
        "districts": [
          {
            "code": "ANC-YUN-CAS",
            "name": "Cascapara",
            "postalCodes": [
              "02145"
            ]
          },
          {
            "code": "ANC-YUN-MAN",
            "name": "Mancos",
            "postalCodes": [
              "02150",
              "02148"
            ]
          },
          {
            "code": "ANC-YUN-MAT",
            "name": "Matacoto",
            "postalCodes": [
              "02155"
            ]
          },
          {
            "code": "ANC-YUN-QUI",
            "name": "Quillo",
            "postalCodes": [
              "02676",
              "02675"
            ]
          },
          {
            "code": "ANC-YUN-RAN",
            "name": "Ranrahirca",
            "postalCodes": [
              "02152"
            ]
          },
          {
            "code": "ANC-YUN-SHU",
            "name": "Shupluy",
            "postalCodes": [
              "02140"
            ]
          },
          {
            "code": "ANC-YUN-YAN",
            "name": "Yanama",
            "postalCodes": [
              "02163",
              "02162"
            ]
          },
          {
            "code": "ANC-YUN-YUN",
            "name": "Yungay",
            "postalCodes": [
              "02160",
              "02158"
            ]
          }
        ],
        "cities": [
          {
            "code": "ANC-YUN-CAS",
            "name": "Cascapara",
            "postalCodes": [
              "02145"
            ]
          },
          {
            "code": "ANC-YUN-MAN",
            "name": "Mancos",
            "postalCodes": [
              "02148",
              "02150"
            ]
          },
          {
            "code": "ANC-YUN-MAT",
            "name": "Matacoto",
            "postalCodes": [
              "02155"
            ]
          },
          {
            "code": "ANC-YUN-QUI",
            "name": "Quillo",
            "postalCodes": [
              "02675",
              "02676"
            ]
          },
          {
            "code": "ANC-YUN-RAN",
            "name": "Ranrahirca",
            "postalCodes": [
              "02152"
            ]
          },
          {
            "code": "ANC-YUN-SHU",
            "name": "Shupluy",
            "postalCodes": [
              "02140"
            ]
          },
          {
            "code": "ANC-YUN-YAN",
            "name": "Yanama",
            "postalCodes": [
              "02162",
              "02163"
            ]
          },
          {
            "code": "ANC-YUN-YUN",
            "name": "Yungay",
            "postalCodes": [
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
        "code": "APU-ABA",
        "name": "Abancay",
        "districts": [
          {
            "code": "APU-ABA-ABA",
            "name": "Abancay",
            "postalCodes": [
              "03000",
              "03001"
            ]
          },
          {
            "code": "APU-ABA-CHA",
            "name": "Chacoche",
            "postalCodes": [
              "03405"
            ]
          },
          {
            "code": "APU-ABA-CIR",
            "name": "Circa",
            "postalCodes": [
              "03305"
            ]
          },
          {
            "code": "APU-ABA-CUR",
            "name": "Curahuasi",
            "postalCodes": [
              "03101",
              "03100"
            ]
          },
          {
            "code": "APU-ABA-HUA",
            "name": "Huanipaca",
            "postalCodes": [
              "03120"
            ]
          },
          {
            "code": "APU-ABA-LAM",
            "name": "Lambrama",
            "postalCodes": [
              "03301",
              "03300"
            ]
          },
          {
            "code": "APU-ABA-PIC",
            "name": "Pichirhua",
            "postalCodes": [
              "03400"
            ]
          },
          {
            "code": "APU-ABA-SAN",
            "name": "San Pedro de Cachora",
            "postalCodes": [
              "03110"
            ]
          },
          {
            "code": "APU-ABA-TAM",
            "name": "Tamburco",
            "postalCodes": [
              "03000",
              "03001"
            ]
          }
        ],
        "cities": [
          {
            "code": "APU-ABA-ABA",
            "name": "Abancay",
            "postalCodes": [
              "03000",
              "03001"
            ]
          },
          {
            "code": "APU-ABA-CAC",
            "name": "Cachora",
            "postalCodes": [
              "03110"
            ]
          },
          {
            "code": "APU-ABA-CHA",
            "name": "Chacoche",
            "postalCodes": [
              "03405"
            ]
          },
          {
            "code": "APU-ABA-CIR",
            "name": "Circa",
            "postalCodes": [
              "03305"
            ]
          },
          {
            "code": "APU-ABA-CUR",
            "name": "Curahuasi",
            "postalCodes": [
              "03100",
              "03101"
            ]
          },
          {
            "code": "APU-ABA-HUA",
            "name": "Huanipaca",
            "postalCodes": [
              "03120"
            ]
          },
          {
            "code": "APU-ABA-LAM",
            "name": "Lambrama",
            "postalCodes": [
              "03300",
              "03301"
            ]
          },
          {
            "code": "APU-ABA-PIC",
            "name": "Pichirhua",
            "postalCodes": [
              "03400"
            ]
          },
          {
            "code": "APU-ABA-TAM",
            "name": "Tamburco",
            "postalCodes": [
              "03000",
              "03001"
            ]
          }
        ]
      },
      {
        "code": "APU-AND",
        "name": "Andahuaylas",
        "districts": [
          {
            "code": "APU-AND-AND",
            "name": "Andahuaylas",
            "postalCodes": [
              "03701",
              "03700"
            ]
          },
          {
            "code": "APU-AND-AND",
            "name": "Andarapa",
            "postalCodes": [
              "03741",
              "03740"
            ]
          },
          {
            "code": "APU-AND-CHI",
            "name": "Chiara",
            "postalCodes": [
              "03650"
            ]
          },
          {
            "code": "APU-AND-HUA",
            "name": "Huancarama",
            "postalCodes": [
              "03781",
              "03780"
            ]
          },
          {
            "code": "APU-AND-HUA",
            "name": "Huancaray",
            "postalCodes": [
              "03670"
            ]
          },
          {
            "code": "APU-AND-HUA",
            "name": "Huayana",
            "postalCodes": [
              "03630"
            ]
          },
          {
            "code": "APU-AND-KAQ",
            "name": "Kaquiabamba",
            "postalCodes": [
              "03750"
            ]
          },
          {
            "code": "APU-AND-KIS",
            "name": "Kishuara",
            "postalCodes": [
              "03760",
              "03761"
            ]
          },
          {
            "code": "APU-AND-PAC",
            "name": "Pacobamba",
            "postalCodes": [
              "03770"
            ]
          },
          {
            "code": "APU-AND-PAC",
            "name": "Pacucha",
            "postalCodes": [
              "03730",
              "03731"
            ]
          },
          {
            "code": "APU-AND-PAM",
            "name": "Pampachiri",
            "postalCodes": [
              "03600"
            ]
          },
          {
            "code": "APU-AND-POM",
            "name": "Pomacocha",
            "postalCodes": [
              "03610"
            ]
          },
          {
            "code": "APU-AND-SAN",
            "name": "San Antonio de Cachi",
            "postalCodes": [
              "03660"
            ]
          },
          {
            "code": "APU-AND-SAN",
            "name": "San Jerónimo",
            "postalCodes": [
              "03701",
              "03700"
            ]
          },
          {
            "code": "APU-AND-SAN",
            "name": "San Miguel de Chaccrampa",
            "postalCodes": [
              "03640"
            ]
          },
          {
            "code": "APU-AND-SAN",
            "name": "Santa María de Chicmo",
            "postalCodes": [
              "03800",
              "03801"
            ]
          },
          {
            "code": "APU-AND-TAL",
            "name": "Talavera",
            "postalCodes": [
              "03701",
              "03700"
            ]
          },
          {
            "code": "APU-AND-TUM",
            "name": "Tumay Huaraca",
            "postalCodes": [
              "03620"
            ]
          },
          {
            "code": "APU-AND-TUR",
            "name": "Turpo",
            "postalCodes": [
              "03680"
            ]
          }
        ],
        "cities": [
          {
            "code": "APU-AND-AND",
            "name": "Andahuaylas",
            "postalCodes": [
              "03700",
              "03701"
            ]
          },
          {
            "code": "APU-AND-AND",
            "name": "Andarapa",
            "postalCodes": [
              "03740",
              "03741"
            ]
          },
          {
            "code": "APU-AND-CHA",
            "name": "Chaccrampa",
            "postalCodes": [
              "03640"
            ]
          },
          {
            "code": "APU-AND-CHI",
            "name": "Chiara",
            "postalCodes": [
              "03650",
              "05315",
              "05316"
            ]
          },
          {
            "code": "APU-AND-HUA",
            "name": "Huancarama",
            "postalCodes": [
              "03780",
              "03781"
            ]
          },
          {
            "code": "APU-AND-HUA",
            "name": "Huancaray",
            "postalCodes": [
              "03670"
            ]
          },
          {
            "code": "APU-AND-HUA",
            "name": "Huayana",
            "postalCodes": [
              "03630"
            ]
          },
          {
            "code": "APU-AND-KAQ",
            "name": "Kaquiabamba",
            "postalCodes": [
              "03750"
            ]
          },
          {
            "code": "APU-AND-KIS",
            "name": "Kishuara",
            "postalCodes": [
              "03760",
              "03761"
            ]
          },
          {
            "code": "APU-AND-PAC",
            "name": "Pacobamba",
            "postalCodes": [
              "03770"
            ]
          },
          {
            "code": "APU-AND-PAC",
            "name": "Pacucha",
            "postalCodes": [
              "03730",
              "03731"
            ]
          },
          {
            "code": "APU-AND-PAM",
            "name": "Pampachiri",
            "postalCodes": [
              "03600"
            ]
          },
          {
            "code": "APU-AND-POM",
            "name": "Pomacocha",
            "postalCodes": [
              "03610",
              "09385"
            ]
          },
          {
            "code": "APU-AND-SAN",
            "name": "San Antonio de Cachi",
            "postalCodes": [
              "03660"
            ]
          },
          {
            "code": "APU-AND-SAN",
            "name": "San Jeronimo",
            "postalCodes": [
              "03700",
              "03701",
              "08000",
              "08006"
            ]
          },
          {
            "code": "APU-AND-SAN",
            "name": "Santa Maria de Chicmo",
            "postalCodes": [
              "03800",
              "03801"
            ]
          },
          {
            "code": "APU-AND-TAL",
            "name": "Talavera",
            "postalCodes": [
              "03700",
              "03701"
            ]
          },
          {
            "code": "APU-AND-TUR",
            "name": "Turpo",
            "postalCodes": [
              "03680"
            ]
          },
          {
            "code": "APU-AND-UMA",
            "name": "Umamarca",
            "postalCodes": [
              "03620"
            ]
          }
        ]
      },
      {
        "code": "APU-ANT",
        "name": "Antabamba",
        "districts": [
          {
            "code": "APU-ANT-ANT",
            "name": "Antabamba",
            "postalCodes": [
              "03465"
            ]
          },
          {
            "code": "APU-ANT-EL ",
            "name": "El Oro",
            "postalCodes": [
              "03450"
            ]
          },
          {
            "code": "APU-ANT-HUA",
            "name": "Huaquirca",
            "postalCodes": [
              "03470"
            ]
          },
          {
            "code": "APU-ANT-JUA",
            "name": "Juan Espinoza Medrano",
            "postalCodes": [
              "03475"
            ]
          },
          {
            "code": "APU-ANT-ORO",
            "name": "Oropesa",
            "postalCodes": [
              "03340"
            ]
          },
          {
            "code": "APU-ANT-PAC",
            "name": "Pachaconas",
            "postalCodes": [
              "03455"
            ]
          },
          {
            "code": "APU-ANT-SAB",
            "name": "Sabaino",
            "postalCodes": [
              "03460"
            ]
          }
        ],
        "cities": [
          {
            "code": "APU-ANT-ANT",
            "name": "Antabamba",
            "postalCodes": [
              "03465"
            ]
          },
          {
            "code": "APU-ANT-AYA",
            "name": "Ayahuay",
            "postalCodes": [
              "03450"
            ]
          },
          {
            "code": "APU-ANT-HUA",
            "name": "Huaquirca",
            "postalCodes": [
              "03470"
            ]
          },
          {
            "code": "APU-ANT-MOL",
            "name": "Mollebamba",
            "postalCodes": [
              "03475",
              "13165"
            ]
          },
          {
            "code": "APU-ANT-ORO",
            "name": "Oropesa",
            "postalCodes": [
              "03340",
              "08204",
              "08205"
            ]
          },
          {
            "code": "APU-ANT-PAC",
            "name": "Pachaconas",
            "postalCodes": [
              "03455"
            ]
          },
          {
            "code": "APU-ANT-SAB",
            "name": "Sabaino",
            "postalCodes": [
              "03460"
            ]
          }
        ]
      },
      {
        "code": "APU-AYM",
        "name": "Aymaraes",
        "districts": [
          {
            "code": "APU-AYM-CAP",
            "name": "Capaya",
            "postalCodes": [
              "03520"
            ]
          },
          {
            "code": "APU-AYM-CAR",
            "name": "Caraybamba",
            "postalCodes": [
              "03570"
            ]
          },
          {
            "code": "APU-AYM-CHA",
            "name": "Chalhuanca",
            "postalCodes": [
              "03560"
            ]
          },
          {
            "code": "APU-AYM-CHA",
            "name": "Chapimarca",
            "postalCodes": [
              "03425"
            ]
          },
          {
            "code": "APU-AYM-COL",
            "name": "Colcabamba",
            "postalCodes": [
              "03500"
            ]
          },
          {
            "code": "APU-AYM-COT",
            "name": "Cotaruse",
            "postalCodes": [
              "03580"
            ]
          },
          {
            "code": "APU-AYM-HUA",
            "name": "Huayllo",
            "postalCodes": [
              "03530"
            ]
          },
          {
            "code": "APU-AYM-JUS",
            "name": "Justo Apu Sahuaraura",
            "postalCodes": [
              "03430"
            ]
          },
          {
            "code": "APU-AYM-LUC",
            "name": "Lucre",
            "postalCodes": [
              "03415"
            ]
          },
          {
            "code": "APU-AYM-POC",
            "name": "Pocohuanca",
            "postalCodes": [
              "03445"
            ]
          },
          {
            "code": "APU-AYM-SAN",
            "name": "San Juan de Chacña",
            "postalCodes": [
              "03420"
            ]
          },
          {
            "code": "APU-AYM-SAÑ",
            "name": "Sañayca",
            "postalCodes": [
              "03550"
            ]
          },
          {
            "code": "APU-AYM-SOR",
            "name": "Soraya",
            "postalCodes": [
              "03540"
            ]
          },
          {
            "code": "APU-AYM-TAP",
            "name": "Tapairihua",
            "postalCodes": [
              "03435"
            ]
          },
          {
            "code": "APU-AYM-TIN",
            "name": "Tintay",
            "postalCodes": [
              "03410"
            ]
          },
          {
            "code": "APU-AYM-TOR",
            "name": "Toraya",
            "postalCodes": [
              "03510"
            ]
          },
          {
            "code": "APU-AYM-YAN",
            "name": "Yanaca",
            "postalCodes": [
              "03440"
            ]
          }
        ],
        "cities": [
          {
            "code": "APU-AYM-CAP",
            "name": "Capaya",
            "postalCodes": [
              "03520"
            ]
          },
          {
            "code": "APU-AYM-CAR",
            "name": "Caraybamba",
            "postalCodes": [
              "03570"
            ]
          },
          {
            "code": "APU-AYM-CHA",
            "name": "Chalhuanca",
            "postalCodes": [
              "03560"
            ]
          },
          {
            "code": "APU-AYM-CHA",
            "name": "Chapimarca",
            "postalCodes": [
              "03425"
            ]
          },
          {
            "code": "ANC-HUA-COL",
            "name": "Colcabamba",
            "postalCodes": [
              "02695",
              "03500",
              "09320",
              "09321"
            ]
          },
          {
            "code": "APU-AYM-COT",
            "name": "Cotaruse",
            "postalCodes": [
              "03580"
            ]
          },
          {
            "code": "APU-AYM-HUA",
            "name": "Huayllo",
            "postalCodes": [
              "03530"
            ]
          },
          {
            "code": "APU-AYM-LUC",
            "name": "Lucre",
            "postalCodes": [
              "03415",
              "08207"
            ]
          },
          {
            "code": "APU-AYM-PIC",
            "name": "Pichihua",
            "postalCodes": [
              "03430"
            ]
          },
          {
            "code": "APU-AYM-POC",
            "name": "Pocohuanca",
            "postalCodes": [
              "03445"
            ]
          },
          {
            "code": "APU-AYM-SAN",
            "name": "San Juan de Chacña",
            "postalCodes": [
              "03420"
            ]
          },
          {
            "code": "APU-AYM-SAÑ",
            "name": "Sañayca",
            "postalCodes": [
              "03550"
            ]
          },
          {
            "code": "APU-AYM-SOR",
            "name": "Soraya",
            "postalCodes": [
              "03540"
            ]
          },
          {
            "code": "APU-AYM-TAP",
            "name": "Tapairihua",
            "postalCodes": [
              "03435"
            ]
          },
          {
            "code": "APU-AYM-TIN",
            "name": "Tintay",
            "postalCodes": [
              "03410",
              "09260",
              "09261"
            ]
          },
          {
            "code": "APU-AYM-TOR",
            "name": "Toraya",
            "postalCodes": [
              "03510"
            ]
          },
          {
            "code": "APU-AYM-YAN",
            "name": "Yanaca",
            "postalCodes": [
              "03440"
            ]
          }
        ]
      },
      {
        "code": "APU-CHI",
        "name": "Chincheros",
        "districts": [
          {
            "code": "APU-CHI-ANC",
            "name": "Anco Huallo",
            "postalCodes": [
              "03840",
              "03841"
            ]
          },
          {
            "code": "APU-CHI-CHI",
            "name": "Chincheros",
            "postalCodes": [
              "03851",
              "03850"
            ]
          },
          {
            "code": "APU-CHI-COC",
            "name": "Cocharcas",
            "postalCodes": [
              "03820"
            ]
          },
          {
            "code": "APU-CHI-HUA",
            "name": "Huaccana",
            "postalCodes": [
              "03881",
              "03880"
            ]
          },
          {
            "code": "APU-CHI-OCO",
            "name": "Ocobamba",
            "postalCodes": [
              "03861",
              "03860"
            ]
          },
          {
            "code": "APU-CHI-ONG",
            "name": "Ongoy",
            "postalCodes": [
              "03870",
              "03871"
            ]
          },
          {
            "code": "APU-CHI-RAN",
            "name": "Ranracancha",
            "postalCodes": [
              "03830"
            ]
          },
          {
            "code": "APU-CHI-URA",
            "name": "Uranmarca",
            "postalCodes": [
              "03810"
            ]
          }
        ],
        "cities": [
          {
            "code": "APU-CHI-CHI",
            "name": "Chincheros",
            "postalCodes": [
              "03850",
              "03851"
            ]
          },
          {
            "code": "APU-CHI-COC",
            "name": "Cocharcas",
            "postalCodes": [
              "03820"
            ]
          },
          {
            "code": "APU-CHI-HUA",
            "name": "Huaccana",
            "postalCodes": [
              "03880",
              "03881"
            ]
          },
          {
            "code": "APU-CHI-OCO",
            "name": "Ocobamba",
            "postalCodes": [
              "03860",
              "03861"
            ]
          },
          {
            "code": "APU-CHI-ONG",
            "name": "Ongoy",
            "postalCodes": [
              "03870",
              "03871"
            ]
          },
          {
            "code": "APU-CHI-RAN",
            "name": "Ranracancha",
            "postalCodes": [
              "03830"
            ]
          },
          {
            "code": "APU-CHI-URA",
            "name": "Uranmarca",
            "postalCodes": [
              "03810"
            ]
          },
          {
            "code": "APU-CHI-URI",
            "name": "Uripa",
            "postalCodes": [
              "03840",
              "03841"
            ]
          }
        ]
      },
      {
        "code": "APU-COT",
        "name": "Cotabambas",
        "districts": [
          {
            "code": "APU-COT-CHA",
            "name": "Challhuahuacho",
            "postalCodes": [
              "03261",
              "03260"
            ]
          },
          {
            "code": "APU-COT-COT",
            "name": "Cotabambas",
            "postalCodes": [
              "03230"
            ]
          },
          {
            "code": "APU-COT-COY",
            "name": "Coyllurqui",
            "postalCodes": [
              "03220",
              "03221"
            ]
          },
          {
            "code": "APU-COT-HAQ",
            "name": "Haquira",
            "postalCodes": [
              "03271",
              "03270"
            ]
          },
          {
            "code": "APU-COT-MAR",
            "name": "Mara",
            "postalCodes": [
              "03250",
              "03251"
            ]
          },
          {
            "code": "APU-COT-TAM",
            "name": "Tambobamba",
            "postalCodes": [
              "03240",
              "03241"
            ]
          }
        ],
        "cities": [
          {
            "code": "APU-COT-CHA",
            "name": "Challhuahuacho",
            "postalCodes": [
              "03260",
              "03261"
            ]
          },
          {
            "code": "APU-COT-COT",
            "name": "Cotabambas",
            "postalCodes": [
              "03230"
            ]
          },
          {
            "code": "APU-COT-COY",
            "name": "Coyllurqui",
            "postalCodes": [
              "03220",
              "03221"
            ]
          },
          {
            "code": "APU-COT-HAQ",
            "name": "Haquira",
            "postalCodes": [
              "03270",
              "03271"
            ]
          },
          {
            "code": "APU-COT-MAR",
            "name": "Mara",
            "postalCodes": [
              "03250",
              "03251"
            ]
          },
          {
            "code": "APU-COT-TAM",
            "name": "Tambobamba",
            "postalCodes": [
              "03240",
              "03241"
            ]
          }
        ]
      },
      {
        "code": "APU-GRA",
        "name": "Grau",
        "districts": [
          {
            "code": "APU-GRA-CHU",
            "name": "Chuquibambilla",
            "postalCodes": [
              "03311",
              "03310"
            ]
          },
          {
            "code": "APU-GRA-CUR",
            "name": "Curasco",
            "postalCodes": [
              "03290"
            ]
          },
          {
            "code": "APU-GRA-CUR",
            "name": "Curpahuasi",
            "postalCodes": [
              "03315"
            ]
          },
          {
            "code": "APU-GRA-GAM",
            "name": "Gamarra",
            "postalCodes": [
              "03200"
            ]
          },
          {
            "code": "APU-GRA-HUA",
            "name": "Huayllati",
            "postalCodes": [
              "03210"
            ]
          },
          {
            "code": "APU-GRA-MAM",
            "name": "Mamara",
            "postalCodes": [
              "03335"
            ]
          },
          {
            "code": "APU-GRA-MIC",
            "name": "Micaela Bastidas",
            "postalCodes": [
              "03325"
            ]
          },
          {
            "code": "APU-GRA-PAT",
            "name": "Pataypampa",
            "postalCodes": [
              "03350"
            ]
          },
          {
            "code": "APU-GRA-PRO",
            "name": "Progreso",
            "postalCodes": [
              "03280"
            ]
          },
          {
            "code": "APU-GRA-SAN",
            "name": "San Antonio",
            "postalCodes": [
              "03330"
            ]
          },
          {
            "code": "APU-GRA-SAN",
            "name": "Santa Rosa",
            "postalCodes": [
              "03345"
            ]
          },
          {
            "code": "APU-GRA-TUR",
            "name": "Turpay",
            "postalCodes": [
              "03355"
            ]
          },
          {
            "code": "APU-GRA-VIL",
            "name": "Vilcabamba",
            "postalCodes": [
              "03320"
            ]
          },
          {
            "code": "APU-GRA-VIR",
            "name": "Virundo",
            "postalCodes": [
              "03360"
            ]
          }
        ],
        "cities": [
          {
            "code": "APU-GRA-AYR",
            "name": "Ayrihuanca",
            "postalCodes": [
              "03325"
            ]
          },
          {
            "code": "APU-GRA-CHU",
            "name": "Chuquibambilla",
            "postalCodes": [
              "03310",
              "03311"
            ]
          },
          {
            "code": "APU-GRA-CUR",
            "name": "Curasco",
            "postalCodes": [
              "03290"
            ]
          },
          {
            "code": "APU-GRA-CUR",
            "name": "Curpahuasi",
            "postalCodes": [
              "03315"
            ]
          },
          {
            "code": "APU-GRA-HUA",
            "name": "Huayllati",
            "postalCodes": [
              "03210"
            ]
          },
          {
            "code": "APU-GRA-MAM",
            "name": "Mamara",
            "postalCodes": [
              "03335"
            ]
          },
          {
            "code": "APU-GRA-PAL",
            "name": "Palpacachi",
            "postalCodes": [
              "03200"
            ]
          },
          {
            "code": "APU-GRA-PAT",
            "name": "Pataypampa",
            "postalCodes": [
              "03350"
            ]
          },
          {
            "code": "APU-GRA-PRO",
            "name": "Progreso",
            "postalCodes": [
              "03280"
            ]
          },
          {
            "code": "APU-GRA-SAN",
            "name": "San Antonio",
            "postalCodes": [
              "03330",
              "15600",
              "22215"
            ]
          },
          {
            "code": "APU-GRA-SAN",
            "name": "San Juan de Virundo",
            "postalCodes": [
              "03360"
            ]
          },
          {
            "code": "ANC-PAL-SAN",
            "name": "Santa Rosa",
            "postalCodes": [
              "02825",
              "03345",
              "05240",
              "05241",
              "06820",
              "06821",
              "12200",
              "14840",
              "14841",
              "15123",
              "21885",
              "21886",
              "22720",
              "22721"
            ]
          },
          {
            "code": "APU-GRA-TUR",
            "name": "Turpay",
            "postalCodes": [
              "03355"
            ]
          },
          {
            "code": "APU-GRA-VIL",
            "name": "Vilcabamba",
            "postalCodes": [
              "03320",
              "19730"
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
        "code": "ARE-ARE",
        "name": "Arequipa",
        "districts": [
          {
            "code": "ARE-ARE-ALT",
            "name": "Alto Selva Alegre",
            "postalCodes": [
              "04004",
              "04003",
              "04001"
            ]
          },
          {
            "code": "ARE-ARE-ARE",
            "name": "Arequipa",
            "postalCodes": [
              "04011",
              "04017",
              "04002",
              "04013",
              "04001"
            ]
          },
          {
            "code": "ARE-ARE-CAY",
            "name": "Cayma",
            "postalCodes": [
              "04014",
              "04018",
              "04017",
              "04013",
              "04000"
            ]
          },
          {
            "code": "ARE-ARE-CER",
            "name": "Cerro Colorado",
            "postalCodes": [
              "04014",
              "04017",
              "04016",
              "04013",
              "04000"
            ]
          },
          {
            "code": "ARE-ARE-CHA",
            "name": "Characato",
            "postalCodes": [
              "04012",
              "04000"
            ]
          },
          {
            "code": "ARE-ARE-CHI",
            "name": "Chiguata",
            "postalCodes": [
              "04200"
            ]
          },
          {
            "code": "ARE-ARE-JAC",
            "name": "Jacobo Hunter",
            "postalCodes": [
              "04012",
              "04011"
            ]
          },
          {
            "code": "ARE-ARE-JOS",
            "name": "José Luis Bustamante y Rivero",
            "postalCodes": [
              "04008",
              "04012",
              "04011",
              "04002",
              "04009"
            ]
          },
          {
            "code": "ARE-ARE-LA ",
            "name": "La Joya",
            "postalCodes": [
              "04406",
              "04405"
            ]
          },
          {
            "code": "ARE-ARE-MAR",
            "name": "Mariano Melgar",
            "postalCodes": [
              "04002",
              "04006"
            ]
          },
          {
            "code": "ARE-ARE-MIR",
            "name": "Miraflores",
            "postalCodes": [
              "04004",
              "04001"
            ]
          },
          {
            "code": "ARE-ARE-MOL",
            "name": "Mollebaya",
            "postalCodes": [
              "04300"
            ]
          },
          {
            "code": "ARE-ARE-PAU",
            "name": "Paucarpata",
            "postalCodes": [
              "04007",
              "04002",
              "04009",
              "04008"
            ]
          },
          {
            "code": "ARE-ARE-POC",
            "name": "Pocsi",
            "postalCodes": [
              "04310"
            ]
          },
          {
            "code": "ARE-ARE-POL",
            "name": "Polobaya",
            "postalCodes": [
              "04320"
            ]
          },
          {
            "code": "ARE-ARE-QUE",
            "name": "Quequeña",
            "postalCodes": [
              "04340"
            ]
          },
          {
            "code": "ARE-ARE-SAB",
            "name": "Sabandía",
            "postalCodes": [
              "04012",
              "04000"
            ]
          },
          {
            "code": "ARE-ARE-SAC",
            "name": "Sachaca",
            "postalCodes": [
              "04013"
            ]
          },
          {
            "code": "ARE-ARE-SAN",
            "name": "San Juan de Siguas",
            "postalCodes": [
              "04105"
            ]
          },
          {
            "code": "ARE-ARE-SAN",
            "name": "San Juan de Tarucani",
            "postalCodes": [
              "04210"
            ]
          },
          {
            "code": "ARE-ARE-SAN",
            "name": "Santa Isabel de Siguas",
            "postalCodes": [
              "04108"
            ]
          },
          {
            "code": "ARE-ARE-SAN",
            "name": "Santa Rita de Siguas",
            "postalCodes": [
              "04102"
            ]
          },
          {
            "code": "ARE-ARE-SOC",
            "name": "Socabaya",
            "postalCodes": [
              "04012",
              "04011",
              "04013",
              "04009",
              "04000"
            ]
          },
          {
            "code": "ARE-ARE-TIA",
            "name": "Tiabaya",
            "postalCodes": [
              "04013",
              "04000"
            ]
          },
          {
            "code": "ARE-ARE-UCH",
            "name": "Uchumayo",
            "postalCodes": [
              "04400",
              "04401"
            ]
          },
          {
            "code": "ARE-ARE-VIT",
            "name": "Vitor",
            "postalCodes": [
              "04100"
            ]
          },
          {
            "code": "ARE-ARE-YAN",
            "name": "Yanahuara",
            "postalCodes": [
              "04017",
              "04014",
              "04013"
            ]
          },
          {
            "code": "ARE-ARE-YAR",
            "name": "Yarabamba",
            "postalCodes": [
              "04330"
            ]
          },
          {
            "code": "ARE-ARE-YUR",
            "name": "Yura",
            "postalCodes": [
              "04016",
              "04076",
              "04000"
            ]
          }
        ],
        "cities": [
          {
            "code": "ARE-ARE-ARE",
            "name": "Arequipa",
            "postalCodes": [
              "04001",
              "04002",
              "04011",
              "04013",
              "04017"
            ]
          },
          {
            "code": "ARE-ARE-CAY",
            "name": "Cayma",
            "postalCodes": [
              "04000",
              "04013",
              "04014",
              "04017",
              "04018"
            ]
          },
          {
            "code": "ARE-ARE-CHA",
            "name": "Characato",
            "postalCodes": [
              "04000",
              "04012"
            ]
          },
          {
            "code": "ARE-ARE-CHI",
            "name": "Chiguata",
            "postalCodes": [
              "04200"
            ]
          },
          {
            "code": "ARE-ARE-CIU",
            "name": "Ciudad Satelite",
            "postalCodes": [
              "04002",
              "04008",
              "04009",
              "04011",
              "04012"
            ]
          },
          {
            "code": "ARE-ARE-JAC",
            "name": "Jacobo Hunter",
            "postalCodes": [
              "04011",
              "04012"
            ]
          },
          {
            "code": "ARE-ARE-LA ",
            "name": "La Joya",
            "postalCodes": [
              "04405",
              "04406"
            ]
          },
          {
            "code": "ARE-ARE-LA ",
            "name": "La Libertad",
            "postalCodes": [
              "04000",
              "04013",
              "04014",
              "04016",
              "04017",
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
            "code": "ARE-ARE-MAR",
            "name": "Mariano Melgar",
            "postalCodes": [
              "04002",
              "04006"
            ]
          },
          {
            "code": "ARE-ARE-MIR",
            "name": "Miraflores",
            "postalCodes": [
              "04001",
              "04004",
              "10680",
              "15046",
              "15047",
              "15048",
              "15073",
              "15074",
              "15076",
              "15792"
            ]
          },
          {
            "code": "ARE-ARE-MOL",
            "name": "Mollebaya",
            "postalCodes": [
              "04300"
            ]
          },
          {
            "code": "ARE-ARE-PAU",
            "name": "Paucarpata",
            "postalCodes": [
              "04002",
              "04007",
              "04008",
              "04009"
            ]
          },
          {
            "code": "ARE-ARE-POC",
            "name": "Pocsi",
            "postalCodes": [
              "04310"
            ]
          },
          {
            "code": "ARE-ARE-POL",
            "name": "Polobaya Grande",
            "postalCodes": [
              "04320"
            ]
          },
          {
            "code": "ARE-ARE-QUE",
            "name": "Quequeña",
            "postalCodes": [
              "04340"
            ]
          },
          {
            "code": "ARE-ARE-SAB",
            "name": "Sabandia",
            "postalCodes": [
              "04000",
              "04012"
            ]
          },
          {
            "code": "ARE-ARE-SAC",
            "name": "Sachaca",
            "postalCodes": [
              "04013"
            ]
          },
          {
            "code": "ARE-ARE-SAN",
            "name": "Santa Isabel de Siguas",
            "postalCodes": [
              "04108"
            ]
          },
          {
            "code": "ARE-ARE-SAN",
            "name": "Santa Rita de Siguas",
            "postalCodes": [
              "04102"
            ]
          },
          {
            "code": "ARE-ARE-SEL",
            "name": "Selva Alegre",
            "postalCodes": [
              "04001",
              "04003",
              "04004"
            ]
          },
          {
            "code": "ARE-ARE-SOC",
            "name": "Socabaya",
            "postalCodes": [
              "04000",
              "04009",
              "04011",
              "04012",
              "04013"
            ]
          },
          {
            "code": "ARE-ARE-TAM",
            "name": "Tambillo",
            "postalCodes": [
              "04105",
              "05300",
              "05301",
              "21255",
              "21256"
            ]
          },
          {
            "code": "ARE-ARE-TAR",
            "name": "Tarucani",
            "postalCodes": [
              "04210"
            ]
          },
          {
            "code": "ARE-ARE-TIA",
            "name": "Tiabaya",
            "postalCodes": [
              "04000",
              "04013"
            ]
          },
          {
            "code": "ARE-ARE-UCH",
            "name": "Uchumayo",
            "postalCodes": [
              "04400",
              "04401"
            ]
          },
          {
            "code": "ARE-ARE-VIT",
            "name": "Vitor",
            "postalCodes": [
              "04100"
            ]
          },
          {
            "code": "ARE-ARE-YAN",
            "name": "Yanahuara",
            "postalCodes": [
              "04013",
              "04014",
              "04017"
            ]
          },
          {
            "code": "ARE-ARE-YAR",
            "name": "Yarabamba",
            "postalCodes": [
              "04330"
            ]
          },
          {
            "code": "ARE-ARE-YUR",
            "name": "Yura (Baños de Yura)",
            "postalCodes": [
              "04000",
              "04016",
              "04076"
            ]
          }
        ]
      },
      {
        "code": "ARE-CAM",
        "name": "Camana",
        "districts": [
          {
            "code": "ARE-CAM-CAM",
            "name": "Camaná",
            "postalCodes": [
              "04450",
              "04451"
            ]
          },
          {
            "code": "ARE-CAM-JOS",
            "name": "José María Quimper",
            "postalCodes": [
              "04460"
            ]
          },
          {
            "code": "ARE-CAM-MAR",
            "name": "Mariano Nicolas Valcarcel",
            "postalCodes": [
              "04760"
            ]
          },
          {
            "code": "ARE-CAM-MAR",
            "name": "Mariscal Cáceres",
            "postalCodes": [
              "04465",
              "04466"
            ]
          },
          {
            "code": "ARE-CAM-NIC",
            "name": "Nicolas de Pierola",
            "postalCodes": [
              "04455",
              "04456"
            ]
          },
          {
            "code": "ARE-CAM-OCO",
            "name": "Ocoña",
            "postalCodes": [
              "04470"
            ]
          },
          {
            "code": "ARE-CAM-QUI",
            "name": "Quilca",
            "postalCodes": [
              "04440"
            ]
          },
          {
            "code": "ARE-CAM-SAM",
            "name": "Samuel Pastor",
            "postalCodes": [
              "04445",
              "04446"
            ]
          }
        ],
        "cities": [
          {
            "code": "ARE-CAM-CAM",
            "name": "Camana",
            "postalCodes": [
              "04450",
              "04451"
            ]
          },
          {
            "code": "ARE-CAM-EL ",
            "name": "El Cardo",
            "postalCodes": [
              "04460"
            ]
          },
          {
            "code": "ANC-COR-LA ",
            "name": "La Pampa",
            "postalCodes": [
              "02200",
              "04445",
              "04446"
            ]
          },
          {
            "code": "ARE-CAM-OCO",
            "name": "Ocoña",
            "postalCodes": [
              "04470"
            ]
          },
          {
            "code": "ARE-CAM-QUI",
            "name": "Quilca",
            "postalCodes": [
              "04440"
            ]
          },
          {
            "code": "ARE-CAM-SAN",
            "name": "San Gregorio",
            "postalCodes": [
              "04455",
              "04456",
              "06475"
            ]
          },
          {
            "code": "ARE-CAM-SAN",
            "name": "San Jose",
            "postalCodes": [
              "04465",
              "04466",
              "13830",
              "13831",
              "14000",
              "14051",
              "21162",
              "21165"
            ]
          },
          {
            "code": "ARE-CAM-URA",
            "name": "Urasqui",
            "postalCodes": [
              "04760"
            ]
          }
        ]
      },
      {
        "code": "ARE-CAR",
        "name": "Caraveli",
        "districts": [
          {
            "code": "ARE-CAR-ACA",
            "name": "Acarí",
            "postalCodes": [
              "04550"
            ]
          },
          {
            "code": "ARE-CAR-ATI",
            "name": "Atico",
            "postalCodes": [
              "04475"
            ]
          },
          {
            "code": "ARE-CAR-ATI",
            "name": "Atiquipa",
            "postalCodes": [
              "04520"
            ]
          },
          {
            "code": "ARE-CAR-BEL",
            "name": "Bella Unión",
            "postalCodes": [
              "04560"
            ]
          },
          {
            "code": "ARE-CAR-CAH",
            "name": "Cahuacho",
            "postalCodes": [
              "04750"
            ]
          },
          {
            "code": "ARE-CAR-CAR",
            "name": "Caravelí",
            "postalCodes": [
              "04740"
            ]
          },
          {
            "code": "ARE-CAR-CHA",
            "name": "Chala",
            "postalCodes": [
              "04500",
              "04501"
            ]
          },
          {
            "code": "ARE-CAR-CHA",
            "name": "Chaparra",
            "postalCodes": [
              "04580"
            ]
          },
          {
            "code": "ARE-CAR-HUA",
            "name": "Huanuhuanu",
            "postalCodes": [
              "04510"
            ]
          },
          {
            "code": "ARE-CAR-JAQ",
            "name": "Jaqui",
            "postalCodes": [
              "04540"
            ]
          },
          {
            "code": "ARE-CAR-LOM",
            "name": "Lomas",
            "postalCodes": [
              "04570"
            ]
          },
          {
            "code": "ARE-CAR-QUI",
            "name": "Quicacha",
            "postalCodes": [
              "04590"
            ]
          },
          {
            "code": "ARE-CAR-YAU",
            "name": "Yauca",
            "postalCodes": [
              "04530"
            ]
          }
        ],
        "cities": [
          {
            "code": "ARE-CAR-ACA",
            "name": "Acari",
            "postalCodes": [
              "04550"
            ]
          },
          {
            "code": "ARE-CAR-ACH",
            "name": "Achanizo",
            "postalCodes": [
              "04580"
            ]
          },
          {
            "code": "ARE-CAR-ATI",
            "name": "Atico",
            "postalCodes": [
              "04475"
            ]
          },
          {
            "code": "ARE-CAR-ATI",
            "name": "Atiquipa",
            "postalCodes": [
              "04520"
            ]
          },
          {
            "code": "ARE-CAR-BEL",
            "name": "Bella Union",
            "postalCodes": [
              "04560"
            ]
          },
          {
            "code": "ARE-CAR-CAH",
            "name": "Cahuacho",
            "postalCodes": [
              "04750"
            ]
          },
          {
            "code": "ARE-CAR-CAR",
            "name": "Caraveli",
            "postalCodes": [
              "04740"
            ]
          },
          {
            "code": "ARE-CAR-CHA",
            "name": "Chala",
            "postalCodes": [
              "04500",
              "04501"
            ]
          },
          {
            "code": "ARE-CAR-JAQ",
            "name": "Jaqui",
            "postalCodes": [
              "04540"
            ]
          },
          {
            "code": "ARE-CAR-LOM",
            "name": "Lomas",
            "postalCodes": [
              "04570"
            ]
          },
          {
            "code": "ARE-CAR-QUI",
            "name": "Quicacha",
            "postalCodes": [
              "04590"
            ]
          },
          {
            "code": "ARE-CAR-TOC",
            "name": "Tocota",
            "postalCodes": [
              "04510"
            ]
          },
          {
            "code": "ARE-CAR-YAU",
            "name": "Yauca",
            "postalCodes": [
              "04530"
            ]
          }
        ]
      },
      {
        "code": "ARE-CAS",
        "name": "Castilla",
        "districts": [
          {
            "code": "ARE-CAS-AND",
            "name": "Andagua",
            "postalCodes": [
              "04640"
            ]
          },
          {
            "code": "ARE-CAS-APL",
            "name": "Aplao",
            "postalCodes": [
              "04605",
              "04606"
            ]
          },
          {
            "code": "ARE-CAS-AYO",
            "name": "Ayo",
            "postalCodes": [
              "04645"
            ]
          },
          {
            "code": "ARE-CAS-CHA",
            "name": "Chachas",
            "postalCodes": [
              "04660"
            ]
          },
          {
            "code": "ARE-CAS-CHI",
            "name": "Chilcaymarca",
            "postalCodes": [
              "04650"
            ]
          },
          {
            "code": "ARE-CAS-CHO",
            "name": "Choco",
            "postalCodes": [
              "04665"
            ]
          },
          {
            "code": "ARE-CAS-HUA",
            "name": "Huancarqui",
            "postalCodes": [
              "04610"
            ]
          },
          {
            "code": "ARE-CAS-MAC",
            "name": "Machaguay",
            "postalCodes": [
              "04630"
            ]
          },
          {
            "code": "ARE-CAS-ORC",
            "name": "Orcopampa",
            "postalCodes": [
              "04656",
              "04655"
            ]
          },
          {
            "code": "ARE-CAS-PAM",
            "name": "Pampacolca",
            "postalCodes": [
              "04620"
            ]
          },
          {
            "code": "ARE-CAS-TIP",
            "name": "Tipan",
            "postalCodes": [
              "04615"
            ]
          },
          {
            "code": "ARE-CAS-URA",
            "name": "Uraca",
            "postalCodes": [
              "04600",
              "04601"
            ]
          },
          {
            "code": "ARE-CAS-UÑO",
            "name": "Uñon",
            "postalCodes": [
              "04635"
            ]
          },
          {
            "code": "ARE-CAS-VIR",
            "name": "Viraco",
            "postalCodes": [
              "04625"
            ]
          }
        ],
        "cities": [
          {
            "code": "ARE-CAS-AND",
            "name": "Andagua",
            "postalCodes": [
              "04640"
            ]
          },
          {
            "code": "ARE-CAS-APL",
            "name": "Aplao",
            "postalCodes": [
              "04605",
              "04606"
            ]
          },
          {
            "code": "ARE-CAS-AYO",
            "name": "Ayo",
            "postalCodes": [
              "04645"
            ]
          },
          {
            "code": "ARE-CAS-CHA",
            "name": "Chachas",
            "postalCodes": [
              "04660"
            ]
          },
          {
            "code": "ARE-CAS-CHI",
            "name": "Chilcaymarca",
            "postalCodes": [
              "04650"
            ]
          },
          {
            "code": "ARE-CAS-CHO",
            "name": "Choco",
            "postalCodes": [
              "04665"
            ]
          },
          {
            "code": "ARE-CAS-COR",
            "name": "Corire",
            "postalCodes": [
              "04600",
              "04601"
            ]
          },
          {
            "code": "ARE-CAS-HUA",
            "name": "Huancarqui",
            "postalCodes": [
              "04610"
            ]
          },
          {
            "code": "ARE-CAS-MAC",
            "name": "Machahuay",
            "postalCodes": [
              "04630"
            ]
          },
          {
            "code": "ARE-CAS-ORC",
            "name": "Orcopampa",
            "postalCodes": [
              "04655",
              "04656"
            ]
          },
          {
            "code": "ARE-CAS-PAM",
            "name": "Pampacolca",
            "postalCodes": [
              "04620"
            ]
          },
          {
            "code": "ARE-CAS-TIP",
            "name": "Tipan",
            "postalCodes": [
              "04615"
            ]
          },
          {
            "code": "ARE-CAS-UÑO",
            "name": "Uñon",
            "postalCodes": [
              "04635"
            ]
          },
          {
            "code": "ARE-CAS-VIR",
            "name": "Viraco",
            "postalCodes": [
              "04625"
            ]
          }
        ]
      },
      {
        "code": "ARE-CAY",
        "name": "Caylloma",
        "districts": [
          {
            "code": "ARE-CAY-ACH",
            "name": "Achoma",
            "postalCodes": [
              "04135"
            ]
          },
          {
            "code": "ARE-CAY-CAB",
            "name": "Cabanaconde",
            "postalCodes": [
              "04124"
            ]
          },
          {
            "code": "ARE-CAY-CAL",
            "name": "Callalli",
            "postalCodes": [
              "04180"
            ]
          },
          {
            "code": "ARE-CAY-CAY",
            "name": "Caylloma",
            "postalCodes": [
              "04190"
            ]
          },
          {
            "code": "ARE-CAY-CHI",
            "name": "Chivay",
            "postalCodes": [
              "04145",
              "04146"
            ]
          },
          {
            "code": "ARE-CAY-COP",
            "name": "Coporaque",
            "postalCodes": [
              "04150"
            ]
          },
          {
            "code": "ARE-CAY-HUA",
            "name": "Huambo",
            "postalCodes": [
              "04120"
            ]
          },
          {
            "code": "ARE-CAY-HUA",
            "name": "Huanca",
            "postalCodes": [
              "04118"
            ]
          },
          {
            "code": "ARE-CAY-ICH",
            "name": "Ichupampa",
            "postalCodes": [
              "04155"
            ]
          },
          {
            "code": "ARE-CAY-LAR",
            "name": "Lari",
            "postalCodes": [
              "04160"
            ]
          },
          {
            "code": "ARE-CAY-LLU",
            "name": "Lluta",
            "postalCodes": [
              "04115"
            ]
          },
          {
            "code": "ARE-CAY-MAC",
            "name": "Maca",
            "postalCodes": [
              "04130"
            ]
          },
          {
            "code": "ARE-CAY-MAD",
            "name": "Madrigal",
            "postalCodes": [
              "04165"
            ]
          },
          {
            "code": "ARE-CAY-MAJ",
            "name": "Majes",
            "postalCodes": [
              "04110",
              "04112"
            ]
          },
          {
            "code": "ARE-CAY-SAN",
            "name": "San Antonio de Chuca",
            "postalCodes": [
              "04220"
            ]
          },
          {
            "code": "ARE-CAY-SIB",
            "name": "Sibayo",
            "postalCodes": [
              "04175"
            ]
          },
          {
            "code": "ARE-CAY-TAP",
            "name": "Tapay",
            "postalCodes": [
              "04125"
            ]
          },
          {
            "code": "ARE-CAY-TIS",
            "name": "Tisco",
            "postalCodes": [
              "04185"
            ]
          },
          {
            "code": "ARE-CAY-TUT",
            "name": "Tuti",
            "postalCodes": [
              "04170"
            ]
          },
          {
            "code": "ARE-CAY-YAN",
            "name": "Yanque",
            "postalCodes": [
              "04140"
            ]
          }
        ],
        "cities": [
          {
            "code": "ARE-CAY-ACH",
            "name": "Achoma",
            "postalCodes": [
              "04135"
            ]
          },
          {
            "code": "ARE-CAY-CAB",
            "name": "Cabanaconde",
            "postalCodes": [
              "04124"
            ]
          },
          {
            "code": "ARE-CAY-CAL",
            "name": "Callalli",
            "postalCodes": [
              "04180"
            ]
          },
          {
            "code": "ARE-CAY-CAY",
            "name": "Caylloma",
            "postalCodes": [
              "04190"
            ]
          },
          {
            "code": "ARE-CAY-CHI",
            "name": "Chivay",
            "postalCodes": [
              "04145",
              "04146"
            ]
          },
          {
            "code": "ARE-CAY-COP",
            "name": "Coporaque",
            "postalCodes": [
              "04150",
              "08370",
              "08371"
            ]
          },
          {
            "code": "ARE-CAY-EL ",
            "name": "El Pedregal",
            "postalCodes": [
              "04110",
              "04112"
            ]
          },
          {
            "code": "AMA-ROD-HUA",
            "name": "Huambo",
            "postalCodes": [
              "01355",
              "04120"
            ]
          },
          {
            "code": "ARE-CAY-HUA",
            "name": "Huanca",
            "postalCodes": [
              "04118"
            ]
          },
          {
            "code": "ARE-CAY-ICH",
            "name": "Ichupampa",
            "postalCodes": [
              "04155"
            ]
          },
          {
            "code": "ARE-CAY-IMA",
            "name": "Imata",
            "postalCodes": [
              "04220"
            ]
          },
          {
            "code": "ARE-CAY-LAR",
            "name": "Lari",
            "postalCodes": [
              "04160"
            ]
          },
          {
            "code": "ARE-CAY-LLU",
            "name": "Lluta",
            "postalCodes": [
              "04115"
            ]
          },
          {
            "code": "ARE-CAY-MAC",
            "name": "Maca",
            "postalCodes": [
              "04130"
            ]
          },
          {
            "code": "ARE-CAY-MAD",
            "name": "Madrigal",
            "postalCodes": [
              "04165"
            ]
          },
          {
            "code": "ARE-CAY-SIB",
            "name": "Sibayo",
            "postalCodes": [
              "04175"
            ]
          },
          {
            "code": "ARE-CAY-TAP",
            "name": "Tapay",
            "postalCodes": [
              "04125"
            ]
          },
          {
            "code": "ARE-CAY-TIS",
            "name": "Tisco",
            "postalCodes": [
              "04185"
            ]
          },
          {
            "code": "ARE-CAY-TUT",
            "name": "Tuti",
            "postalCodes": [
              "04170"
            ]
          },
          {
            "code": "ARE-CAY-YAN",
            "name": "Yanque",
            "postalCodes": [
              "04140"
            ]
          }
        ]
      },
      {
        "code": "ARE-CON",
        "name": "Condesuyos",
        "districts": [
          {
            "code": "ARE-CON-AND",
            "name": "Andaray",
            "postalCodes": [
              "04720"
            ]
          },
          {
            "code": "ARE-CON-CAY",
            "name": "Cayarani",
            "postalCodes": [
              "04195"
            ]
          },
          {
            "code": "ARE-CON-CHI",
            "name": "Chichas",
            "postalCodes": [
              "04805"
            ]
          },
          {
            "code": "ARE-CON-CHU",
            "name": "Chuquibamba",
            "postalCodes": [
              "04710"
            ]
          },
          {
            "code": "ARE-CON-IRA",
            "name": "Iray",
            "postalCodes": [
              "04700"
            ]
          },
          {
            "code": "ARE-CON-RÍO",
            "name": "Río Grande",
            "postalCodes": [
              "04770"
            ]
          },
          {
            "code": "ARE-CON-SAL",
            "name": "Salamanca",
            "postalCodes": [
              "04800"
            ]
          },
          {
            "code": "ARE-CON-YAN",
            "name": "Yanaquihua",
            "postalCodes": [
              "04730"
            ]
          }
        ],
        "cities": [
          {
            "code": "ARE-CON-AND",
            "name": "Andaray",
            "postalCodes": [
              "04720"
            ]
          },
          {
            "code": "ARE-CON-CAY",
            "name": "Cayarani",
            "postalCodes": [
              "04195"
            ]
          },
          {
            "code": "ARE-CON-CHI",
            "name": "Chichas",
            "postalCodes": [
              "04805"
            ]
          },
          {
            "code": "AMA-CHA-CHU",
            "name": "Chuquibamba",
            "postalCodes": [
              "01470",
              "04710"
            ]
          },
          {
            "code": "ARE-CON-IQU",
            "name": "Iquipi",
            "postalCodes": [
              "04770"
            ]
          },
          {
            "code": "ARE-CON-IRA",
            "name": "Iray",
            "postalCodes": [
              "04700"
            ]
          },
          {
            "code": "ARE-CON-SAL",
            "name": "Salamanca",
            "postalCodes": [
              "04800"
            ]
          },
          {
            "code": "ARE-CON-YAN",
            "name": "Yanaquihua",
            "postalCodes": [
              "04730"
            ]
          }
        ]
      },
      {
        "code": "ARE-ISL",
        "name": "Islay",
        "districts": [
          {
            "code": "ARE-ISL-COC",
            "name": "Cocachacra",
            "postalCodes": [
              "04431",
              "04430"
            ]
          },
          {
            "code": "ARE-ISL-DEA",
            "name": "Dean Valdivia",
            "postalCodes": [
              "04426",
              "04425"
            ]
          },
          {
            "code": "ARE-ISL-ISL",
            "name": "Islay",
            "postalCodes": [
              "04410"
            ]
          },
          {
            "code": "ARE-ISL-MEJ",
            "name": "Mejía",
            "postalCodes": [
              "04420"
            ]
          },
          {
            "code": "ARE-ISL-MOL",
            "name": "Mollendo",
            "postalCodes": [
              "04415",
              "04416"
            ]
          },
          {
            "code": "ARE-ISL-PUN",
            "name": "Punta de Bombón",
            "postalCodes": [
              "04435",
              "04436"
            ]
          }
        ],
        "cities": [
          {
            "code": "ARE-ISL-COC",
            "name": "Cocachacra",
            "postalCodes": [
              "04430",
              "04431",
              "15545"
            ]
          },
          {
            "code": "ARE-ISL-ISL",
            "name": "Islay (Matarani)",
            "postalCodes": [
              "04410"
            ]
          },
          {
            "code": "ARE-ISL-LA ",
            "name": "La Curva",
            "postalCodes": [
              "04425",
              "04426"
            ]
          },
          {
            "code": "ARE-ISL-MEJ",
            "name": "Mejia",
            "postalCodes": [
              "04420"
            ]
          },
          {
            "code": "ARE-ISL-MOL",
            "name": "Mollendo",
            "postalCodes": [
              "04415",
              "04416"
            ]
          },
          {
            "code": "ARE-ISL-PUN",
            "name": "Punta de Bombon",
            "postalCodes": [
              "04435",
              "04436"
            ]
          }
        ]
      },
      {
        "code": "ARE-LA ",
        "name": "La Unión",
        "districts": [
          {
            "code": "ARE-LA -ALC",
            "name": "Alca",
            "postalCodes": [
              "04830"
            ]
          },
          {
            "code": "ARE-LA -CHA",
            "name": "Charcana",
            "postalCodes": [
              "04850"
            ]
          },
          {
            "code": "ARE-LA -COT",
            "name": "Cotahuasi",
            "postalCodes": [
              "04810"
            ]
          },
          {
            "code": "ARE-LA -HUA",
            "name": "Huaynacotas",
            "postalCodes": [
              "04820"
            ]
          },
          {
            "code": "ARE-LA -PAM",
            "name": "Pampamarca",
            "postalCodes": [
              "04815"
            ]
          },
          {
            "code": "ARE-LA -PUY",
            "name": "Puyca",
            "postalCodes": [
              "04835"
            ]
          },
          {
            "code": "ARE-LA -QUE",
            "name": "Quechualla",
            "postalCodes": [
              "04845"
            ]
          },
          {
            "code": "ARE-LA -SAY",
            "name": "Sayla",
            "postalCodes": [
              "04855"
            ]
          },
          {
            "code": "ARE-LA -TAU",
            "name": "Tauría",
            "postalCodes": [
              "04860"
            ]
          },
          {
            "code": "ARE-LA -TOM",
            "name": "Tomepampa",
            "postalCodes": [
              "04825"
            ]
          },
          {
            "code": "ARE-LA -TOR",
            "name": "Toro",
            "postalCodes": [
              "04840"
            ]
          }
        ],
        "cities": [
          {
            "code": "ARE-LA -ALC",
            "name": "Alca",
            "postalCodes": [
              "04830"
            ]
          },
          {
            "code": "ARE-LA -CHA",
            "name": "Charcana",
            "postalCodes": [
              "04850"
            ]
          },
          {
            "code": "ARE-LA -COT",
            "name": "Cotahuasi",
            "postalCodes": [
              "04810"
            ]
          },
          {
            "code": "ARE-LA -MUN",
            "name": "Mungui",
            "postalCodes": [
              "04815"
            ]
          },
          {
            "code": "ARE-LA -PUY",
            "name": "Puyca",
            "postalCodes": [
              "04835"
            ]
          },
          {
            "code": "ARE-LA -SAY",
            "name": "Sayla",
            "postalCodes": [
              "04855"
            ]
          },
          {
            "code": "ARE-LA -TAU",
            "name": "Tauria",
            "postalCodes": [
              "04860"
            ]
          },
          {
            "code": "ARE-LA -TAU",
            "name": "Taurisma",
            "postalCodes": [
              "04820"
            ]
          },
          {
            "code": "ARE-LA -TOM",
            "name": "Tomepampa",
            "postalCodes": [
              "04825"
            ]
          },
          {
            "code": "ARE-LA -TOR",
            "name": "Toro",
            "postalCodes": [
              "04840"
            ]
          },
          {
            "code": "ARE-LA -VEL",
            "name": "Velinga",
            "postalCodes": [
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
        "code": "AYA-CAN",
        "name": "Cangallo",
        "districts": [
          {
            "code": "AYA-CAN-CAN",
            "name": "Cangallo",
            "postalCodes": [
              "05401",
              "05400"
            ]
          },
          {
            "code": "AYA-CAN-CHU",
            "name": "Chuschi",
            "postalCodes": [
              "05836",
              "05835"
            ]
          },
          {
            "code": "AYA-CAN-LOS",
            "name": "Los Morochucos",
            "postalCodes": [
              "05845",
              "05846"
            ]
          },
          {
            "code": "AYA-CAN-MAR",
            "name": "María Parado de Bellido",
            "postalCodes": [
              "05840"
            ]
          },
          {
            "code": "AYA-CAN-PAR",
            "name": "Paras",
            "postalCodes": [
              "05820",
              "05821"
            ]
          },
          {
            "code": "AYA-CAN-TOT",
            "name": "Totos",
            "postalCodes": [
              "05830"
            ]
          }
        ],
        "cities": [
          {
            "code": "AYA-CAN-CAN",
            "name": "Cangallo",
            "postalCodes": [
              "05400",
              "05401"
            ]
          },
          {
            "code": "AYA-CAN-CHU",
            "name": "Chuschi",
            "postalCodes": [
              "05835",
              "05836"
            ]
          },
          {
            "code": "AYA-CAN-PAM",
            "name": "Pampa Cangallo",
            "postalCodes": [
              "05845",
              "05846"
            ]
          },
          {
            "code": "AYA-CAN-PAR",
            "name": "Paras",
            "postalCodes": [
              "05820",
              "05821"
            ]
          },
          {
            "code": "ANC-POM-POM",
            "name": "Pomabamba",
            "postalCodes": [
              "02260",
              "02262",
              "05840"
            ]
          },
          {
            "code": "AYA-CAN-TOT",
            "name": "Totos",
            "postalCodes": [
              "05830"
            ]
          }
        ]
      },
      {
        "code": "AYA-HUA",
        "name": "Huamanga",
        "districts": [
          {
            "code": "AYA-HUA-ACO",
            "name": "Acocro",
            "postalCodes": [
              "05306",
              "05305"
            ]
          },
          {
            "code": "AYA-HUA-ACO",
            "name": "Acos Vinchos",
            "postalCodes": [
              "05180",
              "05181"
            ]
          },
          {
            "code": "AYA-HUA-AYA",
            "name": "Ayacucho",
            "postalCodes": [
              "05001",
              "05000",
              "05002",
              "05003"
            ]
          },
          {
            "code": "AYA-HUA-CAR",
            "name": "Carmen Alto",
            "postalCodes": [
              "05000",
              "05002"
            ]
          },
          {
            "code": "AYA-HUA-CHI",
            "name": "Chiara",
            "postalCodes": [
              "05315",
              "05316"
            ]
          },
          {
            "code": "AYA-HUA-JES",
            "name": "Jesús Nazareno",
            "postalCodes": [
              "05001",
              "05000"
            ]
          },
          {
            "code": "AYA-HUA-OCR",
            "name": "Ocros",
            "postalCodes": [
              "05310",
              "05311"
            ]
          },
          {
            "code": "AYA-HUA-PAC",
            "name": "Pacaycasa",
            "postalCodes": [
              "05100"
            ]
          },
          {
            "code": "AYA-HUA-QUI",
            "name": "Quinua",
            "postalCodes": [
              "05160",
              "05161"
            ]
          },
          {
            "code": "AYA-HUA-SAN",
            "name": "San José de Ticllas",
            "postalCodes": [
              "05805"
            ]
          },
          {
            "code": "AYA-HUA-SAN",
            "name": "San Juan Bautista",
            "postalCodes": [
              "05001",
              "05000",
              "05002"
            ]
          },
          {
            "code": "AYA-HUA-SAN",
            "name": "Santiago de Pischa",
            "postalCodes": [
              "05800"
            ]
          },
          {
            "code": "AYA-HUA-SOC",
            "name": "Socos",
            "postalCodes": [
              "05810",
              "05811"
            ]
          },
          {
            "code": "AYA-HUA-TAM",
            "name": "Tambillo",
            "postalCodes": [
              "05300",
              "05301"
            ]
          },
          {
            "code": "AYA-HUA-VIN",
            "name": "Vinchos",
            "postalCodes": [
              "05816",
              "05815"
            ]
          }
        ],
        "cities": [
          {
            "code": "AYA-HUA-ACO",
            "name": "Acocro",
            "postalCodes": [
              "05305",
              "05306"
            ]
          },
          {
            "code": "AYA-HUA-ACO",
            "name": "Acos Vinchos",
            "postalCodes": [
              "05180",
              "05181"
            ]
          },
          {
            "code": "AYA-HUA-AYA",
            "name": "Ayacucho",
            "postalCodes": [
              "05000",
              "05001",
              "05002",
              "05003"
            ]
          },
          {
            "code": "AYA-HUA-CAR",
            "name": "Carmen",
            "postalCodes": [
              "05000",
              "05002"
            ]
          },
          {
            "code": "APU-AND-CHI",
            "name": "Chiara",
            "postalCodes": [
              "03650",
              "05315",
              "05316"
            ]
          },
          {
            "code": "AYA-HUA-LAS",
            "name": "Las Nazarenas",
            "postalCodes": [
              "05000",
              "05001"
            ]
          },
          {
            "code": "ANC-OCR-OCR",
            "name": "Ocros",
            "postalCodes": [
              "02460",
              "05310",
              "05311"
            ]
          },
          {
            "code": "AYA-HUA-PAC",
            "name": "Pacaycasa",
            "postalCodes": [
              "05100"
            ]
          },
          {
            "code": "AYA-HUA-QUI",
            "name": "Quinua",
            "postalCodes": [
              "05160",
              "05161"
            ]
          },
          {
            "code": "AYA-HUA-SAN",
            "name": "San Juan Bautista",
            "postalCodes": [
              "05000",
              "05001",
              "05002",
              "11000",
              "11002"
            ]
          },
          {
            "code": "AYA-HUA-SAN",
            "name": "San Pedro de Cachi",
            "postalCodes": [
              "05800"
            ]
          },
          {
            "code": "AYA-HUA-SOC",
            "name": "Socos",
            "postalCodes": [
              "05810",
              "05811"
            ]
          },
          {
            "code": "ARE-ARE-TAM",
            "name": "Tambillo",
            "postalCodes": [
              "04105",
              "05300",
              "05301",
              "21255",
              "21256"
            ]
          },
          {
            "code": "AYA-HUA-TIC",
            "name": "Ticllas",
            "postalCodes": [
              "05805"
            ]
          },
          {
            "code": "AYA-HUA-VIN",
            "name": "Vinchos",
            "postalCodes": [
              "05815",
              "05816"
            ]
          }
        ]
      },
      {
        "code": "AYA-HUA",
        "name": "Huanta",
        "districts": [
          {
            "code": "AYA-HUA-AYA",
            "name": "Ayahuanco",
            "postalCodes": [
              "05150",
              "05151"
            ]
          },
          {
            "code": "AYA-HUA-HUA",
            "name": "Huamanguilla",
            "postalCodes": [
              "05171",
              "05170"
            ]
          },
          {
            "code": "AYA-HUA-HUA",
            "name": "Huanta",
            "postalCodes": [
              "05120",
              "05121"
            ]
          },
          {
            "code": "AYA-HUA-IGU",
            "name": "Iguain",
            "postalCodes": [
              "05110"
            ]
          },
          {
            "code": "AYA-HUA-LLO",
            "name": "Llochegua",
            "postalCodes": [
              "05231",
              "05230"
            ]
          },
          {
            "code": "AYA-HUA-LUR",
            "name": "Luricocha",
            "postalCodes": [
              "05130",
              "05131"
            ]
          },
          {
            "code": "AYA-HUA-SAN",
            "name": "Santillana",
            "postalCodes": [
              "05141",
              "05140"
            ]
          },
          {
            "code": "AYA-HUA-SIL",
            "name": "Silvia",
            "postalCodes": [
              "05221",
              "05220"
            ]
          }
        ],
        "cities": [
          {
            "code": "AYA-HUA-HUA",
            "name": "Huamanguilla",
            "postalCodes": [
              "05170",
              "05171"
            ]
          },
          {
            "code": "AYA-HUA-HUA",
            "name": "Huanta",
            "postalCodes": [
              "05120",
              "05121"
            ]
          },
          {
            "code": "AYA-HUA-LLO",
            "name": "Llochegua",
            "postalCodes": [
              "05230",
              "05231"
            ]
          },
          {
            "code": "AYA-HUA-LUR",
            "name": "Luricocha",
            "postalCodes": [
              "05130",
              "05131"
            ]
          },
          {
            "code": "AYA-HUA-MAC",
            "name": "Macachacra",
            "postalCodes": [
              "05110"
            ]
          },
          {
            "code": "AYA-HUA-SAN",
            "name": "San Jose de Secce",
            "postalCodes": [
              "05140",
              "05141"
            ]
          },
          {
            "code": "AYA-HUA-SIV",
            "name": "Sivia",
            "postalCodes": [
              "05220",
              "05221"
            ]
          },
          {
            "code": "AYA-HUA-VIR",
            "name": "Viracochan",
            "postalCodes": [
              "05150",
              "05151"
            ]
          }
        ]
      },
      {
        "code": "AYA-HUN",
        "name": "Hunca Sancos",
        "districts": [
          {
            "code": "AYA-HUN-CAR",
            "name": "Carapo",
            "postalCodes": [
              "05700"
            ]
          },
          {
            "code": "AYA-HUN-SAC",
            "name": "Sacsamarca",
            "postalCodes": [
              "05730"
            ]
          },
          {
            "code": "AYA-HUN-SAN",
            "name": "Sancos",
            "postalCodes": [
              "05710"
            ]
          },
          {
            "code": "AYA-HUN-SAN",
            "name": "Santiago de Lucanamarca",
            "postalCodes": [
              "05720"
            ]
          }
        ],
        "cities": [
          {
            "code": "AYA-HUN-CAR",
            "name": "Carapo",
            "postalCodes": [
              "05700"
            ]
          },
          {
            "code": "AYA-HUN-HUA",
            "name": "Huanca Sancos",
            "postalCodes": [
              "05710"
            ]
          },
          {
            "code": "AYA-HUN-SAC",
            "name": "Sacsamarca",
            "postalCodes": [
              "05730"
            ]
          },
          {
            "code": "AYA-HUN-SAN",
            "name": "Santiago de Lucanamarca",
            "postalCodes": [
              "05720"
            ]
          }
        ]
      },
      {
        "code": "AYA-LA ",
        "name": "La Mar",
        "districts": [
          {
            "code": "AYA-LA -ANC",
            "name": "Anco",
            "postalCodes": [
              "05260",
              "05261"
            ]
          },
          {
            "code": "AYA-LA -AYN",
            "name": "Ayna",
            "postalCodes": [
              "05210",
              "05211"
            ]
          },
          {
            "code": "AYA-LA -CHI",
            "name": "Chilcas",
            "postalCodes": [
              "05280"
            ]
          },
          {
            "code": "AYA-LA -CHU",
            "name": "Chungui",
            "postalCodes": [
              "05271",
              "05270"
            ]
          },
          {
            "code": "AYA-LA -LUI",
            "name": "Luis Carranza",
            "postalCodes": [
              "05290"
            ]
          },
          {
            "code": "AYA-LA -SAN",
            "name": "San Miguel",
            "postalCodes": [
              "05250",
              "05251"
            ]
          },
          {
            "code": "AYA-LA -SAN",
            "name": "Santa Rosa",
            "postalCodes": [
              "05241",
              "05240"
            ]
          },
          {
            "code": "AYA-LA -TAM",
            "name": "Tambo",
            "postalCodes": [
              "05201",
              "05200"
            ]
          }
        ],
        "cities": [
          {
            "code": "AYA-LA -CHI",
            "name": "Chilcas",
            "postalCodes": [
              "05280"
            ]
          },
          {
            "code": "AYA-LA -CHI",
            "name": "Chiquintirca",
            "postalCodes": [
              "05260",
              "05261"
            ]
          },
          {
            "code": "AYA-LA -CHU",
            "name": "Chungui",
            "postalCodes": [
              "05270",
              "05271"
            ]
          },
          {
            "code": "ANC-HUA-PAM",
            "name": "Pampas",
            "postalCodes": [
              "02605",
              "02865",
              "02866",
              "05290",
              "09155",
              "09156"
            ]
          },
          {
            "code": "AYA-LA -SAN",
            "name": "San Francisco",
            "postalCodes": [
              "05210",
              "05211"
            ]
          },
          {
            "code": "AYA-LA -SAN",
            "name": "San Miguel",
            "postalCodes": [
              "05250",
              "05251",
              "12485",
              "15084",
              "15086",
              "15087",
              "15088"
            ]
          },
          {
            "code": "ANC-PAL-SAN",
            "name": "Santa Rosa",
            "postalCodes": [
              "02825",
              "03345",
              "05240",
              "05241",
              "06820",
              "06821",
              "12200",
              "14840",
              "14841",
              "15123",
              "21885",
              "21886",
              "22720",
              "22721"
            ]
          },
          {
            "code": "AYA-LA -TAM",
            "name": "Tambo",
            "postalCodes": [
              "05200",
              "05201",
              "09610"
            ]
          }
        ]
      },
      {
        "code": "AYA-LUC",
        "name": "Lucanas",
        "districts": [
          {
            "code": "AYA-LUC-AUC",
            "name": "Aucará",
            "postalCodes": [
              "05470"
            ]
          },
          {
            "code": "AYA-LUC-CAB",
            "name": "Cabana",
            "postalCodes": [
              "05475"
            ]
          },
          {
            "code": "AYA-LUC-CAR",
            "name": "Carmen Salcedo",
            "postalCodes": [
              "05480"
            ]
          },
          {
            "code": "AYA-LUC-CHA",
            "name": "Chaviña",
            "postalCodes": [
              "05600"
            ]
          },
          {
            "code": "AYA-LUC-CHI",
            "name": "Chipao",
            "postalCodes": [
              "05485"
            ]
          },
          {
            "code": "AYA-LUC-HUA",
            "name": "Huac Huas",
            "postalCodes": [
              "05760"
            ]
          },
          {
            "code": "AYA-LUC-LAR",
            "name": "Laramate",
            "postalCodes": [
              "05740"
            ]
          },
          {
            "code": "AYA-LUC-LEO",
            "name": "Leoncio Prado",
            "postalCodes": [
              "05540"
            ]
          },
          {
            "code": "AYA-LUC-LLA",
            "name": "Llauta",
            "postalCodes": [
              "05750"
            ]
          },
          {
            "code": "AYA-LUC-LUC",
            "name": "Lucanas",
            "postalCodes": [
              "05530"
            ]
          },
          {
            "code": "AYA-LUC-OCO",
            "name": "Ocoña",
            "postalCodes": [
              "05770"
            ]
          },
          {
            "code": "AYA-LUC-OTA",
            "name": "Otaca",
            "postalCodes": [
              "05790"
            ]
          },
          {
            "code": "AYA-LUC-PUQ",
            "name": "Puquio",
            "postalCodes": [
              "05500",
              "05501"
            ]
          },
          {
            "code": "AYA-LUC-SAI",
            "name": "Saisa",
            "postalCodes": [
              "05560"
            ]
          },
          {
            "code": "AYA-LUC-SAN",
            "name": "San Cristobal",
            "postalCodes": [
              "05550"
            ]
          },
          {
            "code": "AYA-LUC-SAN",
            "name": "San Juan",
            "postalCodes": [
              "05520"
            ]
          },
          {
            "code": "AYA-LUC-SAN",
            "name": "San Pedro",
            "postalCodes": [
              "05510"
            ]
          },
          {
            "code": "AYA-LUC-SAN",
            "name": "San Pedro de Palco",
            "postalCodes": [
              "05780"
            ]
          },
          {
            "code": "AYA-LUC-SAN",
            "name": "Sancos",
            "postalCodes": [
              "05606",
              "05605"
            ]
          },
          {
            "code": "AYA-LUC-SAN",
            "name": "Santa Ana de Huaycahuacho",
            "postalCodes": [
              "05465"
            ]
          },
          {
            "code": "AYA-LUC-SAN",
            "name": "Santa Lucía",
            "postalCodes": [
              "05570"
            ]
          }
        ],
        "cities": [
          {
            "code": "AYA-LUC-AND",
            "name": "Andamarca",
            "postalCodes": [
              "05480",
              "12235",
              "12236"
            ]
          },
          {
            "code": "AYA-LUC-AUC",
            "name": "Aucara",
            "postalCodes": [
              "05470"
            ]
          },
          {
            "code": "ANC-PAL-CAB",
            "name": "Cabana",
            "postalCodes": [
              "02850",
              "05475",
              "21700"
            ]
          },
          {
            "code": "AYA-LUC-CHA",
            "name": "Chaviña",
            "postalCodes": [
              "05600"
            ]
          },
          {
            "code": "AYA-LUC-CHI",
            "name": "Chipao",
            "postalCodes": [
              "05485"
            ]
          },
          {
            "code": "AYA-LUC-HUA",
            "name": "Huac- Huas",
            "postalCodes": [
              "05760"
            ]
          },
          {
            "code": "AYA-LUC-LAR",
            "name": "Laramate",
            "postalCodes": [
              "05740"
            ]
          },
          {
            "code": "AYA-LUC-LLA",
            "name": "Llauta",
            "postalCodes": [
              "05750"
            ]
          },
          {
            "code": "AYA-LUC-LUC",
            "name": "Lucanas",
            "postalCodes": [
              "05530"
            ]
          },
          {
            "code": "AYA-LUC-OCA",
            "name": "Ocaña",
            "postalCodes": [
              "05770"
            ]
          },
          {
            "code": "AYA-LUC-OTO",
            "name": "Otoca",
            "postalCodes": [
              "05790"
            ]
          },
          {
            "code": "AYA-LUC-PUQ",
            "name": "Puquio",
            "postalCodes": [
              "05500",
              "05501"
            ]
          },
          {
            "code": "AYA-LUC-SAI",
            "name": "Saisa",
            "postalCodes": [
              "05560"
            ]
          },
          {
            "code": "AYA-LUC-SAN",
            "name": "San Cristobal",
            "postalCodes": [
              "05550"
            ]
          },
          {
            "code": "ANC-HUA-SAN",
            "name": "San Juan",
            "postalCodes": [
              "02170",
              "02171",
              "05520",
              "06400",
              "09755",
              "11420",
              "11421",
              "16000",
              "16007",
              "16008"
            ]
          },
          {
            "code": "AYA-LUC-SAN",
            "name": "San Pedro",
            "postalCodes": [
              "05510",
              "08245",
              "11700",
              "11703",
              "15641"
            ]
          },
          {
            "code": "AYA-LUC-SAN",
            "name": "San Pedro de Palco",
            "postalCodes": [
              "05780"
            ]
          },
          {
            "code": "AYA-LUC-SAN",
            "name": "Sancos",
            "postalCodes": [
              "05605",
              "05606"
            ]
          },
          {
            "code": "AYA-LUC-SAN",
            "name": "Santa Ana de Huaycahuacho",
            "postalCodes": [
              "05465"
            ]
          },
          {
            "code": "AYA-LUC-SAN",
            "name": "Santa Lucia",
            "postalCodes": [
              "05570",
              "21770",
              "21771"
            ]
          },
          {
            "code": "AYA-LUC-TAM",
            "name": "Tambo Quemado",
            "postalCodes": [
              "05540"
            ]
          }
        ]
      },
      {
        "code": "AYA-PAR",
        "name": "Parinacochas",
        "districts": [
          {
            "code": "AYA-PAR-CHU",
            "name": "Chumpi",
            "postalCodes": [
              "05615"
            ]
          },
          {
            "code": "AYA-PAR-COR",
            "name": "Coracora",
            "postalCodes": [
              "05611",
              "05610"
            ]
          },
          {
            "code": "AYA-PAR-COR",
            "name": "Coronel Castañeda",
            "postalCodes": [
              "05695"
            ]
          },
          {
            "code": "AYA-PAR-PAC",
            "name": "Pacapausa",
            "postalCodes": [
              "05685"
            ]
          },
          {
            "code": "AYA-PAR-PUL",
            "name": "Pullo",
            "postalCodes": [
              "05620"
            ]
          },
          {
            "code": "AYA-PAR-PUY",
            "name": "Puyusca",
            "postalCodes": [
              "05625"
            ]
          },
          {
            "code": "AYA-PAR-SAN",
            "name": "San Francisco de Ravacayco",
            "postalCodes": [
              "05680"
            ]
          },
          {
            "code": "AYA-PAR-UPA",
            "name": "Upahuacho",
            "postalCodes": [
              "05690"
            ]
          }
        ],
        "cities": [
          {
            "code": "AYA-PAR-ANI",
            "name": "Aniso",
            "postalCodes": [
              "05695"
            ]
          },
          {
            "code": "AYA-PAR-CHU",
            "name": "Chumpi",
            "postalCodes": [
              "05615"
            ]
          },
          {
            "code": "AYA-PAR-COR",
            "name": "Coracora",
            "postalCodes": [
              "05610",
              "05611"
            ]
          },
          {
            "code": "AYA-PAR-INC",
            "name": "Incuyo",
            "postalCodes": [
              "05625"
            ]
          },
          {
            "code": "AYA-PAR-PAC",
            "name": "Pacapausa",
            "postalCodes": [
              "05685"
            ]
          },
          {
            "code": "AYA-PAR-PUL",
            "name": "Pullo",
            "postalCodes": [
              "05620"
            ]
          },
          {
            "code": "AYA-PAR-SAN",
            "name": "San Francisco de Ravacayco",
            "postalCodes": [
              "05680"
            ]
          },
          {
            "code": "AYA-PAR-UPA",
            "name": "Upahuacho",
            "postalCodes": [
              "05690"
            ]
          }
        ]
      },
      {
        "code": "AYA-PAU",
        "name": "Paucar del Sara Sara",
        "districts": [
          {
            "code": "AYA-PAU-COL",
            "name": "Colpa",
            "postalCodes": [
              "05655"
            ]
          },
          {
            "code": "AYA-PAU-COR",
            "name": "Corculla",
            "postalCodes": [
              "05670"
            ]
          },
          {
            "code": "AYA-PAU-LAM",
            "name": "Lampa",
            "postalCodes": [
              "05645"
            ]
          },
          {
            "code": "AYA-PAU-MAR",
            "name": "Marcabamba",
            "postalCodes": [
              "05650"
            ]
          },
          {
            "code": "AYA-PAU-OYO",
            "name": "Oyolo",
            "postalCodes": [
              "05660"
            ]
          },
          {
            "code": "AYA-PAU-PAR",
            "name": "Pararca",
            "postalCodes": [
              "05635"
            ]
          },
          {
            "code": "AYA-PAU-PAU",
            "name": "Pausa",
            "postalCodes": [
              "05640"
            ]
          },
          {
            "code": "AYA-PAU-SAN",
            "name": "San Javier de Alpabamba",
            "postalCodes": [
              "05675"
            ]
          },
          {
            "code": "AYA-PAU-SAN",
            "name": "San José de Ushua",
            "postalCodes": [
              "05665"
            ]
          },
          {
            "code": "AYA-PAU-SAR",
            "name": "Sara Sara",
            "postalCodes": [
              "05630"
            ]
          }
        ],
        "cities": [
          {
            "code": "AYA-PAU-COL",
            "name": "Colta",
            "postalCodes": [
              "05655"
            ]
          },
          {
            "code": "AYA-PAU-COR",
            "name": "Corculla",
            "postalCodes": [
              "05670"
            ]
          },
          {
            "code": "AYA-PAU-LAM",
            "name": "Lampa",
            "postalCodes": [
              "05645",
              "12245",
              "12246",
              "21800",
              "21801"
            ]
          },
          {
            "code": "AYA-PAU-MAR",
            "name": "Marcabamba",
            "postalCodes": [
              "05650"
            ]
          },
          {
            "code": "AYA-PAU-OYO",
            "name": "Oyolo",
            "postalCodes": [
              "05660"
            ]
          },
          {
            "code": "AYA-PAU-PAR",
            "name": "Pararca",
            "postalCodes": [
              "05635"
            ]
          },
          {
            "code": "AYA-PAU-PAU",
            "name": "Pausa",
            "postalCodes": [
              "05640"
            ]
          },
          {
            "code": "AYA-PAU-QUI",
            "name": "Quilcata",
            "postalCodes": [
              "05630"
            ]
          },
          {
            "code": "AYA-PAU-SAN",
            "name": "San Javier de Alpabamba",
            "postalCodes": [
              "05675"
            ]
          },
          {
            "code": "AYA-PAU-SAN",
            "name": "San Jose de Ushua",
            "postalCodes": [
              "05665"
            ]
          }
        ]
      },
      {
        "code": "AYA-SUC",
        "name": "Sucre",
        "districts": [
          {
            "code": "AYA-SUC-BEL",
            "name": "Belén",
            "postalCodes": [
              "05345"
            ]
          },
          {
            "code": "AYA-SUC-CHA",
            "name": "Chalcos",
            "postalCodes": [
              "05350"
            ]
          },
          {
            "code": "AYA-SUC-CHI",
            "name": "Chilcayoc",
            "postalCodes": [
              "05355"
            ]
          },
          {
            "code": "AYA-SUC-HUA",
            "name": "Huacaña",
            "postalCodes": [
              "05460"
            ]
          },
          {
            "code": "AYA-SUC-MOR",
            "name": "Morcolla",
            "postalCodes": [
              "05455"
            ]
          },
          {
            "code": "AYA-SUC-PAI",
            "name": "Paico",
            "postalCodes": [
              "05365"
            ]
          },
          {
            "code": "AYA-SUC-QUE",
            "name": "Querobamba",
            "postalCodes": [
              "05450"
            ]
          },
          {
            "code": "AYA-SUC-SAN",
            "name": "San Pedro de Larcay",
            "postalCodes": [
              "05380"
            ]
          },
          {
            "code": "AYA-SUC-SAN",
            "name": "San Salvador de Quije",
            "postalCodes": [
              "05360"
            ]
          },
          {
            "code": "AYA-SUC-SAN",
            "name": "Santiago de Paucaray",
            "postalCodes": [
              "05370"
            ]
          },
          {
            "code": "AYA-SUC-SOR",
            "name": "Soras",
            "postalCodes": [
              "05375"
            ]
          }
        ],
        "cities": [
          {
            "code": "AYA-SUC-BEL",
            "name": "Belen",
            "postalCodes": [
              "05345",
              "16000",
              "16001",
              "16006",
              "16008"
            ]
          },
          {
            "code": "AYA-SUC-CHA",
            "name": "Chalcos",
            "postalCodes": [
              "05350"
            ]
          },
          {
            "code": "AYA-SUC-CHI",
            "name": "Chilcayoc",
            "postalCodes": [
              "05355"
            ]
          },
          {
            "code": "AYA-SUC-HUA",
            "name": "Huacaña",
            "postalCodes": [
              "05460"
            ]
          },
          {
            "code": "AYA-SUC-MOR",
            "name": "Morcolla",
            "postalCodes": [
              "05455"
            ]
          },
          {
            "code": "AYA-SUC-PAI",
            "name": "Paico",
            "postalCodes": [
              "05365"
            ]
          },
          {
            "code": "AYA-SUC-QUE",
            "name": "Querobamba",
            "postalCodes": [
              "05450"
            ]
          },
          {
            "code": "AYA-SUC-SAN",
            "name": "San Pedro de Larcay",
            "postalCodes": [
              "05380"
            ]
          },
          {
            "code": "AYA-SUC-SAN",
            "name": "San Salvador de Quije",
            "postalCodes": [
              "05360"
            ]
          },
          {
            "code": "AYA-SUC-SAN",
            "name": "Santiago de Paucaray",
            "postalCodes": [
              "05370"
            ]
          },
          {
            "code": "AYA-SUC-SOR",
            "name": "Soras",
            "postalCodes": [
              "05375"
            ]
          }
        ]
      },
      {
        "code": "AYA-VIL",
        "name": "Vilcas Huamán",
        "districts": [
          {
            "code": "AYA-VIL-ACC",
            "name": "Accomarca",
            "postalCodes": [
              "05390"
            ]
          },
          {
            "code": "AYA-VIL-CAR",
            "name": "Carhuanca",
            "postalCodes": [
              "05340"
            ]
          },
          {
            "code": "AYA-VIL-CON",
            "name": "Concepción",
            "postalCodes": [
              "05330"
            ]
          },
          {
            "code": "AYA-VIL-HUA",
            "name": "Huambalpa",
            "postalCodes": [
              "05385"
            ]
          },
          {
            "code": "AYA-VIL-IND",
            "name": "Independencia",
            "postalCodes": [
              "05395"
            ]
          },
          {
            "code": "AYA-VIL-SAU",
            "name": "Saurama",
            "postalCodes": [
              "05335"
            ]
          },
          {
            "code": "AYA-VIL-VIL",
            "name": "Vilcas Huamán",
            "postalCodes": [
              "05325",
              "05326"
            ]
          },
          {
            "code": "AYA-VIL-VIS",
            "name": "Vischongo",
            "postalCodes": [
              "05320"
            ]
          }
        ],
        "cities": [
          {
            "code": "AYA-VIL-ACC",
            "name": "Accomarca",
            "postalCodes": [
              "05390"
            ]
          },
          {
            "code": "AYA-VIL-CAR",
            "name": "Carhuanca",
            "postalCodes": [
              "05340"
            ]
          },
          {
            "code": "AYA-VIL-CON",
            "name": "Concepcion",
            "postalCodes": [
              "05330",
              "12125",
              "12126"
            ]
          },
          {
            "code": "AYA-VIL-HUA",
            "name": "Huambalpa",
            "postalCodes": [
              "05385"
            ]
          },
          {
            "code": "AYA-VIL-NUE",
            "name": "Nuevo Paccha Huallhua",
            "postalCodes": [
              "05395"
            ]
          },
          {
            "code": "AYA-VIL-SAU",
            "name": "Saurama",
            "postalCodes": [
              "05335"
            ]
          },
          {
            "code": "AYA-VIL-VIL",
            "name": "Vilcas Huaman",
            "postalCodes": [
              "05325",
              "05326"
            ]
          },
          {
            "code": "AYA-VIL-VIS",
            "name": "Vischongo",
            "postalCodes": [
              "05320"
            ]
          }
        ]
      },
      {
        "code": "AYA-VÍC",
        "name": "Víctor Fajardo",
        "districts": [
          {
            "code": "AYA-VÍC-ALC",
            "name": "Alcamenca",
            "postalCodes": [
              "05405"
            ]
          },
          {
            "code": "AYA-VÍC-APO",
            "name": "Apongo",
            "postalCodes": [
              "05440"
            ]
          },
          {
            "code": "AYA-VÍC-ASQ",
            "name": "Asquipata",
            "postalCodes": [
              "05445"
            ]
          },
          {
            "code": "AYA-VÍC-CAN",
            "name": "Canaria",
            "postalCodes": [
              "05435"
            ]
          },
          {
            "code": "AYA-VÍC-CAY",
            "name": "Cayara",
            "postalCodes": [
              "05420"
            ]
          },
          {
            "code": "AYA-VÍC-COL",
            "name": "Colca",
            "postalCodes": [
              "05425"
            ]
          },
          {
            "code": "AYA-VÍC-HUA",
            "name": "Huamanquiquia",
            "postalCodes": [
              "05855"
            ]
          },
          {
            "code": "AYA-VÍC-HUA",
            "name": "Huancapi",
            "postalCodes": [
              "05415"
            ]
          },
          {
            "code": "AYA-VÍC-HUA",
            "name": "Huancaraylla",
            "postalCodes": [
              "05410"
            ]
          },
          {
            "code": "AYA-VÍC-HUA",
            "name": "Huaya",
            "postalCodes": [
              "05430"
            ]
          },
          {
            "code": "AYA-VÍC-SAR",
            "name": "Sarhua",
            "postalCodes": [
              "05850"
            ]
          },
          {
            "code": "AYA-VÍC-VIL",
            "name": "Vilcanchos",
            "postalCodes": [
              "05825"
            ]
          }
        ],
        "cities": [
          {
            "code": "AYA-VÍC-ALC",
            "name": "Alcamenca",
            "postalCodes": [
              "05405"
            ]
          },
          {
            "code": "AYA-VÍC-APO",
            "name": "Apongo",
            "postalCodes": [
              "05440"
            ]
          },
          {
            "code": "AYA-VÍC-ASQ",
            "name": "Asquipata",
            "postalCodes": [
              "05445"
            ]
          },
          {
            "code": "AYA-VÍC-CAN",
            "name": "Canaria",
            "postalCodes": [
              "05435"
            ]
          },
          {
            "code": "AYA-VÍC-CAY",
            "name": "Cayara",
            "postalCodes": [
              "05420"
            ]
          },
          {
            "code": "AYA-VÍC-COL",
            "name": "Colca",
            "postalCodes": [
              "05425",
              "12436"
            ]
          },
          {
            "code": "AYA-VÍC-HUA",
            "name": "Huamanquiquia",
            "postalCodes": [
              "05855"
            ]
          },
          {
            "code": "AYA-VÍC-HUA",
            "name": "Huancapi",
            "postalCodes": [
              "05415"
            ]
          },
          {
            "code": "AYA-VÍC-HUA",
            "name": "Huancaraylla",
            "postalCodes": [
              "05410"
            ]
          },
          {
            "code": "AYA-VÍC-SAN",
            "name": "San Pedro de Huaya",
            "postalCodes": [
              "05430"
            ]
          },
          {
            "code": "AYA-VÍC-SAR",
            "name": "Sarhua",
            "postalCodes": [
              "05850"
            ]
          },
          {
            "code": "AYA-VÍC-VIL",
            "name": "Vilcanchos",
            "postalCodes": [
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
        "code": "CAJ-CAJ",
        "name": "Cajabamba",
        "districts": [
          {
            "code": "CAJ-CAJ-CAC",
            "name": "Cachachi",
            "postalCodes": [
              "06340",
              "06341"
            ]
          },
          {
            "code": "CAJ-CAJ-CAJ",
            "name": "Cajabamba",
            "postalCodes": [
              "06350",
              "06351"
            ]
          },
          {
            "code": "CAJ-CAJ-CON",
            "name": "Condebamba",
            "postalCodes": [
              "06346",
              "06345"
            ]
          },
          {
            "code": "CAJ-CAJ-SIT",
            "name": "Sitacocha",
            "postalCodes": [
              "06356",
              "06355"
            ]
          }
        ],
        "cities": [
          {
            "code": "CAJ-CAJ-CAC",
            "name": "Cachachi",
            "postalCodes": [
              "06340",
              "06341"
            ]
          },
          {
            "code": "CAJ-CAJ-CAJ",
            "name": "Cajabamba",
            "postalCodes": [
              "06350",
              "06351"
            ]
          },
          {
            "code": "CAJ-CAJ-CAU",
            "name": "Cauday",
            "postalCodes": [
              "06345",
              "06346"
            ]
          },
          {
            "code": "CAJ-CAJ-LLU",
            "name": "Lluchubamba",
            "postalCodes": [
              "06355",
              "06356"
            ]
          }
        ]
      },
      {
        "code": "CAJ-CAJ",
        "name": "Cajamarca",
        "districts": [
          {
            "code": "CAJ-CAJ-ASU",
            "name": "Asunción",
            "postalCodes": [
              "06405",
              "06403"
            ]
          },
          {
            "code": "CAJ-CAJ-CAJ",
            "name": "Cajamarca",
            "postalCodes": [
              "06001",
              "06000",
              "06002",
              "06003"
            ]
          },
          {
            "code": "CAJ-CAJ-CHE",
            "name": "Chetilla",
            "postalCodes": [
              "06415"
            ]
          },
          {
            "code": "CAJ-CAJ-COS",
            "name": "Cospan",
            "postalCodes": [
              "06410",
              "06407"
            ]
          },
          {
            "code": "CAJ-CAJ-ENC",
            "name": "Encañada",
            "postalCodes": [
              "06201",
              "06200"
            ]
          },
          {
            "code": "CAJ-CAJ-JES",
            "name": "Jesús",
            "postalCodes": [
              "06370",
              "06371"
            ]
          },
          {
            "code": "CAJ-CAJ-LLA",
            "name": "Llacanora",
            "postalCodes": [
              "06300"
            ]
          },
          {
            "code": "CAJ-CAJ-LOS",
            "name": "Los Baños del Inca",
            "postalCodes": [
              "06001",
              "06000",
              "06004"
            ]
          },
          {
            "code": "CAJ-CAJ-MAG",
            "name": "Magdalena",
            "postalCodes": [
              "06412",
              "06411"
            ]
          },
          {
            "code": "CAJ-CAJ-MAT",
            "name": "Matara",
            "postalCodes": [
              "06310"
            ]
          },
          {
            "code": "CAJ-CAJ-NAM",
            "name": "Namora",
            "postalCodes": [
              "06305",
              "06306"
            ]
          },
          {
            "code": "CAJ-CAJ-SAN",
            "name": "San Juan",
            "postalCodes": [
              "06400"
            ]
          }
        ],
        "cities": [
          {
            "code": "AMA-CHA-ASU",
            "name": "Asuncion",
            "postalCodes": [
              "01230",
              "06403",
              "06405"
            ]
          },
          {
            "code": "CAJ-CAJ-CAJ",
            "name": "Cajamarca",
            "postalCodes": [
              "06000",
              "06001",
              "06002",
              "06003"
            ]
          },
          {
            "code": "CAJ-CAJ-CHE",
            "name": "Chetilla",
            "postalCodes": [
              "06415"
            ]
          },
          {
            "code": "CAJ-CAJ-COS",
            "name": "Cospan",
            "postalCodes": [
              "06407",
              "06410"
            ]
          },
          {
            "code": "CAJ-CAJ-ENC",
            "name": "Encañada",
            "postalCodes": [
              "06200",
              "06201"
            ]
          },
          {
            "code": "CAJ-CAJ-JES",
            "name": "Jesus",
            "postalCodes": [
              "06370",
              "06371",
              "10530",
              "10531"
            ]
          },
          {
            "code": "CAJ-CAJ-LLA",
            "name": "Llacanora",
            "postalCodes": [
              "06300"
            ]
          },
          {
            "code": "CAJ-CAJ-LOS",
            "name": "Los Baños del Inca",
            "postalCodes": [
              "06000",
              "06001",
              "06004"
            ]
          },
          {
            "code": "AMA-CHA-MAG",
            "name": "Magdalena",
            "postalCodes": [
              "01410",
              "06411",
              "06412"
            ]
          },
          {
            "code": "CAJ-CAJ-MAT",
            "name": "Matara",
            "postalCodes": [
              "06310"
            ]
          },
          {
            "code": "CAJ-CAJ-NAM",
            "name": "Namora",
            "postalCodes": [
              "06305",
              "06306"
            ]
          },
          {
            "code": "ANC-HUA-SAN",
            "name": "San Juan",
            "postalCodes": [
              "02170",
              "02171",
              "05520",
              "06400",
              "09755",
              "11420",
              "11421",
              "16000",
              "16007",
              "16008"
            ]
          }
        ]
      },
      {
        "code": "CAJ-CEL",
        "name": "Celendín",
        "districts": [
          {
            "code": "CAJ-CEL-CEL",
            "name": "Celendin",
            "postalCodes": [
              "06225",
              "06226"
            ]
          },
          {
            "code": "CAJ-CEL-CHU",
            "name": "Chumuch",
            "postalCodes": [
              "06255"
            ]
          },
          {
            "code": "CAJ-CEL-COR",
            "name": "Cortegana",
            "postalCodes": [
              "06261",
              "06260"
            ]
          },
          {
            "code": "CAJ-CEL-HUA",
            "name": "Huasmin",
            "postalCodes": [
              "06240",
              "06241"
            ]
          },
          {
            "code": "CAJ-CEL-JOR",
            "name": "Jorge Chávez",
            "postalCodes": [
              "06220"
            ]
          },
          {
            "code": "CAJ-CEL-JOS",
            "name": "José Galvez",
            "postalCodes": [
              "06215"
            ]
          },
          {
            "code": "CAJ-CEL-LA ",
            "name": "La Libertad de Pallán",
            "postalCodes": [
              "06245",
              "06246"
            ]
          },
          {
            "code": "CAJ-CEL-MIG",
            "name": "Miguel Iglesias",
            "postalCodes": [
              "06250"
            ]
          },
          {
            "code": "CAJ-CEL-OXA",
            "name": "Oxamarca",
            "postalCodes": [
              "06210",
              "06211"
            ]
          },
          {
            "code": "CAJ-CEL-SOR",
            "name": "Sorochuco",
            "postalCodes": [
              "06235",
              "06236"
            ]
          },
          {
            "code": "CAJ-CEL-SUC",
            "name": "Sucre",
            "postalCodes": [
              "06205",
              "06206"
            ]
          },
          {
            "code": "CAJ-CEL-UTC",
            "name": "Utco",
            "postalCodes": [
              "06230"
            ]
          }
        ],
        "cities": [
          {
            "code": "CAJ-CEL-CEL",
            "name": "Celendin",
            "postalCodes": [
              "06225",
              "06226"
            ]
          },
          {
            "code": "CAJ-CEL-CHA",
            "name": "Chalan",
            "postalCodes": [
              "06250"
            ]
          },
          {
            "code": "CAJ-CEL-CHI",
            "name": "Chimuch (Cortegana)",
            "postalCodes": [
              "06260",
              "06261"
            ]
          },
          {
            "code": "CAJ-CEL-CHU",
            "name": "Chumuch",
            "postalCodes": [
              "06255"
            ]
          },
          {
            "code": "CAJ-CEL-HUA",
            "name": "Huacapampa",
            "postalCodes": [
              "06215"
            ]
          },
          {
            "code": "CAJ-CEL-HUA",
            "name": "Huasmin",
            "postalCodes": [
              "06240",
              "06241"
            ]
          },
          {
            "code": "CAJ-CEL-LA ",
            "name": "La Libertad de Pallan",
            "postalCodes": [
              "06245",
              "06246"
            ]
          },
          {
            "code": "CAJ-CEL-LUC",
            "name": "Lucmapampa",
            "postalCodes": [
              "06220"
            ]
          },
          {
            "code": "CAJ-CEL-OXA",
            "name": "Oxamarca",
            "postalCodes": [
              "06210",
              "06211"
            ]
          },
          {
            "code": "CAJ-CEL-SOR",
            "name": "Sorochuco",
            "postalCodes": [
              "06235",
              "06236"
            ]
          },
          {
            "code": "ANC-HUA-SUC",
            "name": "Sucre",
            "postalCodes": [
              "02184",
              "06205",
              "06206"
            ]
          },
          {
            "code": "CAJ-CEL-UTC",
            "name": "Utco",
            "postalCodes": [
              "06230"
            ]
          }
        ]
      },
      {
        "code": "CAJ-CHO",
        "name": "Chota",
        "districts": [
          {
            "code": "CAJ-CHO-ANG",
            "name": "Anguía",
            "postalCodes": [
              "06140"
            ]
          },
          {
            "code": "CAJ-CHO-CHA",
            "name": "Chadín",
            "postalCodes": [
              "06155"
            ]
          },
          {
            "code": "CAJ-CHO-CHA",
            "name": "Chalamarca",
            "postalCodes": [
              "06145",
              "06146"
            ]
          },
          {
            "code": "CAJ-CHO-CHI",
            "name": "Chiguirip",
            "postalCodes": [
              "06130"
            ]
          },
          {
            "code": "CAJ-CHO-CHI",
            "name": "Chimban",
            "postalCodes": [
              "06165"
            ]
          },
          {
            "code": "CAJ-CHO-CHO",
            "name": "Choropampa",
            "postalCodes": [
              "06160"
            ]
          },
          {
            "code": "CAJ-CHO-CHO",
            "name": "Chota",
            "postalCodes": [
              "06120",
              "06121"
            ]
          },
          {
            "code": "CAJ-CHO-COC",
            "name": "Cochabamba",
            "postalCodes": [
              "06650",
              "06651"
            ]
          },
          {
            "code": "CAJ-CHO-CON",
            "name": "Conchán",
            "postalCodes": [
              "06126",
              "06125"
            ]
          },
          {
            "code": "CAJ-CHO-HUA",
            "name": "Huambos",
            "postalCodes": [
              "06653",
              "06655"
            ]
          },
          {
            "code": "CAJ-CHO-LAJ",
            "name": "Lajas",
            "postalCodes": [
              "06600",
              "06601"
            ]
          },
          {
            "code": "CAJ-CHO-LLA",
            "name": "Llama",
            "postalCodes": [
              "06665",
              "06666"
            ]
          },
          {
            "code": "CAJ-CHO-MIR",
            "name": "Miracosta",
            "postalCodes": [
              "06675"
            ]
          },
          {
            "code": "CAJ-CHO-PAC",
            "name": "Paccha",
            "postalCodes": [
              "06150",
              "06151"
            ]
          },
          {
            "code": "CAJ-CHO-PIO",
            "name": "Pion",
            "postalCodes": [
              "06170"
            ]
          },
          {
            "code": "CAJ-CHO-QUE",
            "name": "Querocoto",
            "postalCodes": [
              "06685",
              "06683"
            ]
          },
          {
            "code": "CAJ-CHO-SAN",
            "name": "San Juan de Licupis",
            "postalCodes": [
              "06670"
            ]
          },
          {
            "code": "CAJ-CHO-TAC",
            "name": "Tacabamba",
            "postalCodes": [
              "06136",
              "06135"
            ]
          },
          {
            "code": "CAJ-CHO-TOC",
            "name": "Tocmoche",
            "postalCodes": [
              "06680"
            ]
          }
        ],
        "cities": [
          {
            "code": "CAJ-CHO-ANG",
            "name": "Anguia",
            "postalCodes": [
              "06140"
            ]
          },
          {
            "code": "CAJ-CHO-CHA",
            "name": "Chadin",
            "postalCodes": [
              "06155"
            ]
          },
          {
            "code": "CAJ-CHO-CHA",
            "name": "Chalamarca",
            "postalCodes": [
              "06145",
              "06146"
            ]
          },
          {
            "code": "CAJ-CHO-CHI",
            "name": "Chiguirip",
            "postalCodes": [
              "06130"
            ]
          },
          {
            "code": "CAJ-CHO-CHI",
            "name": "Chimban",
            "postalCodes": [
              "06165"
            ]
          },
          {
            "code": "CAJ-CHO-CHO",
            "name": "Choropampa",
            "postalCodes": [
              "06160"
            ]
          },
          {
            "code": "CAJ-CHO-CHO",
            "name": "Chota",
            "postalCodes": [
              "06120",
              "06121"
            ]
          },
          {
            "code": "ANC-HUA-COC",
            "name": "Cochabamba",
            "postalCodes": [
              "02690",
              "06650",
              "06651",
              "10830"
            ]
          },
          {
            "code": "CAJ-CHO-CON",
            "name": "Conchan",
            "postalCodes": [
              "06125",
              "06126"
            ]
          },
          {
            "code": "CAJ-CHO-HUA",
            "name": "Huambos",
            "postalCodes": [
              "06653",
              "06655"
            ]
          },
          {
            "code": "CAJ-CHO-LAJ",
            "name": "Lajas",
            "postalCodes": [
              "06600",
              "06601"
            ]
          },
          {
            "code": "CAJ-CHO-LIC",
            "name": "Licupis",
            "postalCodes": [
              "06670"
            ]
          },
          {
            "code": "ANC-MAR-LLA",
            "name": "Llama",
            "postalCodes": [
              "02275",
              "06665",
              "06666"
            ]
          },
          {
            "code": "CAJ-CHO-MIR",
            "name": "Miracosta",
            "postalCodes": [
              "06675"
            ]
          },
          {
            "code": "CAJ-CHO-PAC",
            "name": "Paccha",
            "postalCodes": [
              "06150",
              "06151",
              "12585",
              "12535"
            ]
          },
          {
            "code": "CAJ-CHO-PIO",
            "name": "Pion",
            "postalCodes": [
              "06170"
            ]
          },
          {
            "code": "CAJ-CHO-QUE",
            "name": "Querocoto",
            "postalCodes": [
              "06683",
              "06685"
            ]
          },
          {
            "code": "CAJ-CHO-TAC",
            "name": "Tacabamba",
            "postalCodes": [
              "06135",
              "06136"
            ]
          },
          {
            "code": "CAJ-CHO-TOC",
            "name": "Tocmoche",
            "postalCodes": [
              "06680"
            ]
          }
        ]
      },
      {
        "code": "CAJ-CON",
        "name": "Contumaza",
        "districts": [
          {
            "code": "CAJ-CON-CHI",
            "name": "Chilete",
            "postalCodes": [
              "06420"
            ]
          },
          {
            "code": "CAJ-CON-CON",
            "name": "Contumazá",
            "postalCodes": [
              "06422",
              "06421"
            ]
          },
          {
            "code": "CAJ-CON-CUP",
            "name": "Cupisnique",
            "postalCodes": [
              "06441"
            ]
          },
          {
            "code": "CAJ-CON-GUZ",
            "name": "Guzmango",
            "postalCodes": [
              "06431"
            ]
          },
          {
            "code": "CAJ-CON-SAN",
            "name": "San Benito",
            "postalCodes": [
              "06435"
            ]
          },
          {
            "code": "CAJ-CON-SAN",
            "name": "Santa Cruz de Toled",
            "postalCodes": [
              "06425"
            ]
          },
          {
            "code": "CAJ-CON-TAN",
            "name": "Tantarica",
            "postalCodes": [
              "06430"
            ]
          },
          {
            "code": "CAJ-CON-YON",
            "name": "Yonan",
            "postalCodes": [
              "06440",
              "06437"
            ]
          }
        ],
        "cities": [
          {
            "code": "CAJ-CON-CAT",
            "name": "Catan",
            "postalCodes": [
              "06430"
            ]
          },
          {
            "code": "CAJ-CON-CHI",
            "name": "Chilete",
            "postalCodes": [
              "06420"
            ]
          },
          {
            "code": "CAJ-CON-CON",
            "name": "Contumaza",
            "postalCodes": [
              "06421",
              "06422"
            ]
          },
          {
            "code": "CAJ-CON-GUZ",
            "name": "Guzmango",
            "postalCodes": [
              "06431"
            ]
          },
          {
            "code": "CAJ-CON-SAN",
            "name": "San Benito",
            "postalCodes": [
              "06435"
            ]
          },
          {
            "code": "CAJ-CON-SAN",
            "name": "Santa Cruz de Toled",
            "postalCodes": [
              "06425"
            ]
          },
          {
            "code": "CAJ-CON-TEM",
            "name": "Tembladera",
            "postalCodes": [
              "06437",
              "06440"
            ]
          },
          {
            "code": "CAJ-CON-TRI",
            "name": "Trinidad",
            "postalCodes": [
              "06441"
            ]
          }
        ]
      },
      {
        "code": "CAJ-CUT",
        "name": "Cutervo",
        "districts": [
          {
            "code": "CAJ-CUT-CAL",
            "name": "Callayuc",
            "postalCodes": [
              "06711",
              "06710"
            ]
          },
          {
            "code": "CAJ-CUT-CHO",
            "name": "Choros",
            "postalCodes": [
              "06785"
            ]
          },
          {
            "code": "CAJ-CUT-CUJ",
            "name": "Cujillo",
            "postalCodes": [
              "06775"
            ]
          },
          {
            "code": "CAJ-CUT-CUT",
            "name": "Cutervo",
            "postalCodes": [
              "06701",
              "06700"
            ]
          },
          {
            "code": "CAJ-CUT-LA ",
            "name": "La Ramada",
            "postalCodes": [
              "06175"
            ]
          },
          {
            "code": "CAJ-CUT-PIM",
            "name": "Pimpingos",
            "postalCodes": [
              "06765",
              "06766"
            ]
          },
          {
            "code": "CAJ-CUT-QUE",
            "name": "Querocotillo",
            "postalCodes": [
              "06690",
              "06691"
            ]
          },
          {
            "code": "CAJ-CUT-SAN",
            "name": "San Andres de Cutervo",
            "postalCodes": [
              "06755",
              "06756"
            ]
          },
          {
            "code": "CAJ-CUT-SAN",
            "name": "San Juan de Cutervo",
            "postalCodes": [
              "06770"
            ]
          },
          {
            "code": "CAJ-CUT-SAN",
            "name": "San Luis de Lucma",
            "postalCodes": [
              "06180"
            ]
          },
          {
            "code": "CAJ-CUT-SAN",
            "name": "Santa Cruz",
            "postalCodes": [
              "06715"
            ]
          },
          {
            "code": "CAJ-CUT-SAN",
            "name": "Santo Domingo de la Capilla",
            "postalCodes": [
              "06706",
              "06705"
            ]
          },
          {
            "code": "CAJ-CUT-SAN",
            "name": "Santo Tomas",
            "postalCodes": [
              "06761",
              "06760"
            ]
          },
          {
            "code": "CAJ-CUT-SOC",
            "name": "Socota",
            "postalCodes": [
              "06751",
              "06750"
            ]
          },
          {
            "code": "CAJ-CUT-TOR",
            "name": "Toribio Casanova",
            "postalCodes": [
              "06780"
            ]
          }
        ],
        "cities": [
          {
            "code": "CAJ-CUT-CAL",
            "name": "Callayuc",
            "postalCodes": [
              "06710",
              "06711"
            ]
          },
          {
            "code": "CAJ-CUT-CHO",
            "name": "Choros",
            "postalCodes": [
              "06785"
            ]
          },
          {
            "code": "CAJ-CUT-CUJ",
            "name": "Cujillo",
            "postalCodes": [
              "06775"
            ]
          },
          {
            "code": "CAJ-CUT-CUT",
            "name": "Cutervo",
            "postalCodes": [
              "06700",
              "06701"
            ]
          },
          {
            "code": "CAJ-CUT-LA ",
            "name": "La Ramada",
            "postalCodes": [
              "06175"
            ]
          },
          {
            "code": "CAJ-CUT-LA ",
            "name": "La Sacilia",
            "postalCodes": [
              "06780"
            ]
          },
          {
            "code": "CAJ-CUT-PIM",
            "name": "Pimpingos",
            "postalCodes": [
              "06765",
              "06766"
            ]
          },
          {
            "code": "CAJ-CUT-QUE",
            "name": "Querocotillo",
            "postalCodes": [
              "06690",
              "06691"
            ]
          },
          {
            "code": "CAJ-CUT-SAN",
            "name": "San Andres de Cutervo",
            "postalCodes": [
              "06755",
              "06756"
            ]
          },
          {
            "code": "CAJ-CUT-SAN",
            "name": "San Juan de Cutervo",
            "postalCodes": [
              "06770"
            ]
          },
          {
            "code": "CAJ-CUT-SAN",
            "name": "San Luis de Lucma",
            "postalCodes": [
              "06180"
            ]
          },
          {
            "code": "CAJ-CUT-SAN",
            "name": "Santa Cruz",
            "postalCodes": [
              "06715",
              "11300",
              "15246",
              "16540"
            ]
          },
          {
            "code": "CAJ-CUT-SAN",
            "name": "Santo Domingo de la Capilla",
            "postalCodes": [
              "06705",
              "06706"
            ]
          },
          {
            "code": "AMA-LUY-SAN",
            "name": "Santo Tomas",
            "postalCodes": [
              "01445",
              "06760",
              "06761",
              "08420",
              "08421"
            ]
          },
          {
            "code": "CAJ-CUT-SOC",
            "name": "Socota",
            "postalCodes": [
              "06750",
              "06751"
            ]
          }
        ]
      },
      {
        "code": "CAJ-HUA",
        "name": "Hualgayoc",
        "districts": [
          {
            "code": "CAJ-HUA-BAM",
            "name": "Bambamarca",
            "postalCodes": [
              "06116",
              "06115"
            ]
          },
          {
            "code": "CAJ-HUA-CHU",
            "name": "Chugur",
            "postalCodes": [
              "06625"
            ]
          },
          {
            "code": "CAJ-HUA-HUA",
            "name": "Hualgayoc",
            "postalCodes": [
              "06101",
              "06100"
            ]
          }
        ],
        "cities": [
          {
            "code": "CAJ-HUA-BAM",
            "name": "Bambamarca",
            "postalCodes": [
              "06115",
              "06116",
              "13400"
            ]
          },
          {
            "code": "CAJ-HUA-CHU",
            "name": "Chugur",
            "postalCodes": [
              "06625"
            ]
          },
          {
            "code": "CAJ-HUA-HUA",
            "name": "Hualgayoc",
            "postalCodes": [
              "06100",
              "06101"
            ]
          }
        ]
      },
      {
        "code": "CAJ-JAE",
        "name": "Jaen",
        "districts": [
          {
            "code": "CAJ-JAE-BEL",
            "name": "Bellavista",
            "postalCodes": [
              "06815",
              "06816"
            ]
          },
          {
            "code": "CAJ-JAE-CHO",
            "name": "Chontali",
            "postalCodes": [
              "06745",
              "06746"
            ]
          },
          {
            "code": "CAJ-JAE-COL",
            "name": "Colasay",
            "postalCodes": [
              "06721",
              "06720"
            ]
          },
          {
            "code": "CAJ-JAE-HUA",
            "name": "Huabal",
            "postalCodes": [
              "06811",
              "06810"
            ]
          },
          {
            "code": "CAJ-JAE-JAE",
            "name": "Jaen",
            "postalCodes": [
              "06800",
              "06801"
            ]
          },
          {
            "code": "CAJ-JAE-LAS",
            "name": "Las Pirias",
            "postalCodes": [
              "06805"
            ]
          },
          {
            "code": "CAJ-JAE-POM",
            "name": "Pomahuaca",
            "postalCodes": [
              "06731",
              "06730"
            ]
          },
          {
            "code": "CAJ-JAE-PUC",
            "name": "Pucará",
            "postalCodes": [
              "06726",
              "06725"
            ]
          },
          {
            "code": "CAJ-JAE-SAL",
            "name": "Sallique",
            "postalCodes": [
              "06741",
              "06740"
            ]
          },
          {
            "code": "CAJ-JAE-SAN",
            "name": "San Felipe",
            "postalCodes": [
              "06736",
              "06735"
            ]
          },
          {
            "code": "CAJ-JAE-SAN",
            "name": "San José del Alto",
            "postalCodes": [
              "06831",
              "06830"
            ]
          },
          {
            "code": "CAJ-JAE-SAN",
            "name": "Santa Rosa",
            "postalCodes": [
              "06821",
              "06820"
            ]
          }
        ],
        "cities": [
          {
            "code": "CAJ-JAE-BEL",
            "name": "Bellavista",
            "postalCodes": [
              "06815",
              "06816",
              "07001",
              "07006",
              "07011",
              "07016",
              "07021",
              "20101",
              "20102",
              "20650",
              "22740",
              "22741"
            ]
          },
          {
            "code": "CAJ-JAE-CHO",
            "name": "Chontali",
            "postalCodes": [
              "06745",
              "06746"
            ]
          },
          {
            "code": "CAJ-JAE-COL",
            "name": "Colasay",
            "postalCodes": [
              "06720",
              "06721"
            ]
          },
          {
            "code": "CAJ-JAE-HUA",
            "name": "Huabal",
            "postalCodes": [
              "06810",
              "06811"
            ]
          },
          {
            "code": "CAJ-JAE-JAE",
            "name": "Jaen",
            "postalCodes": [
              "06800",
              "06801"
            ]
          },
          {
            "code": "CAJ-JAE-LAS",
            "name": "Las Pirias",
            "postalCodes": [
              "06805"
            ]
          },
          {
            "code": "CAJ-JAE-POM",
            "name": "Pomahuaca",
            "postalCodes": [
              "06730",
              "06731"
            ]
          },
          {
            "code": "CAJ-JAE-PUC",
            "name": "Pucara",
            "postalCodes": [
              "06725",
              "06726",
              "12404",
              "12405",
              "12845",
              "21136",
              "21137"
            ]
          },
          {
            "code": "CAJ-JAE-SAL",
            "name": "Sallique",
            "postalCodes": [
              "06740",
              "06741"
            ]
          },
          {
            "code": "CAJ-JAE-SAN",
            "name": "San Felipe",
            "postalCodes": [
              "06735",
              "06736"
            ]
          },
          {
            "code": "CAJ-JAE-SAN",
            "name": "San Jose del Alto",
            "postalCodes": [
              "06830",
              "06831"
            ]
          },
          {
            "code": "ANC-PAL-SAN",
            "name": "Santa Rosa",
            "postalCodes": [
              "02825",
              "03345",
              "05240",
              "05241",
              "06820",
              "06821",
              "12200",
              "14840",
              "14841",
              "15123",
              "21885",
              "21886",
              "22720",
              "22721"
            ]
          }
        ]
      },
      {
        "code": "CAJ-SAN",
        "name": "San Ignacio",
        "districts": [
          {
            "code": "CAJ-SAN-CHI",
            "name": "Chirinos",
            "postalCodes": [
              "06840",
              "06841"
            ]
          },
          {
            "code": "CAJ-SAN-HUA",
            "name": "Huarango",
            "postalCodes": [
              "06861",
              "06860"
            ]
          },
          {
            "code": "CAJ-SAN-LA ",
            "name": "La Coipa",
            "postalCodes": [
              "06826",
              "06825"
            ]
          },
          {
            "code": "CAJ-SAN-NAM",
            "name": "Namballe",
            "postalCodes": [
              "06851",
              "06850"
            ]
          },
          {
            "code": "CAJ-SAN-SAN",
            "name": "San Ignacio",
            "postalCodes": [
              "06845",
              "06846"
            ]
          },
          {
            "code": "CAJ-SAN-SAN",
            "name": "San José de Lourdes",
            "postalCodes": [
              "06856",
              "06855"
            ]
          },
          {
            "code": "CAJ-SAN-TAB",
            "name": "Tabaconas",
            "postalCodes": [
              "06836",
              "06835"
            ]
          }
        ],
        "cities": [
          {
            "code": "CAJ-SAN-CHI",
            "name": "Chirinos",
            "postalCodes": [
              "06840",
              "06841"
            ]
          },
          {
            "code": "CAJ-SAN-HUA",
            "name": "Huarango",
            "postalCodes": [
              "06860",
              "06861"
            ]
          },
          {
            "code": "CAJ-SAN-LA ",
            "name": "La Coipa",
            "postalCodes": [
              "06825",
              "06826"
            ]
          },
          {
            "code": "CAJ-SAN-NAM",
            "name": "Namballe",
            "postalCodes": [
              "06850",
              "06851"
            ]
          },
          {
            "code": "CAJ-SAN-SAN",
            "name": "San Ignacio",
            "postalCodes": [
              "06845",
              "06846"
            ]
          },
          {
            "code": "CAJ-SAN-SAN",
            "name": "San Jose de Lourdes",
            "postalCodes": [
              "06855",
              "06856"
            ]
          },
          {
            "code": "CAJ-SAN-TAB",
            "name": "Tabaconas",
            "postalCodes": [
              "06835",
              "06836"
            ]
          }
        ]
      },
      {
        "code": "CAJ-SAN",
        "name": "San Marcos",
        "districts": [
          {
            "code": "CAJ-SAN-CHA",
            "name": "Chancay",
            "postalCodes": [
              "06330"
            ]
          },
          {
            "code": "CAJ-SAN-EDU",
            "name": "Eduardo Villanueva",
            "postalCodes": [
              "06335"
            ]
          },
          {
            "code": "CAJ-SAN-GRE",
            "name": "Gregorio Pita",
            "postalCodes": [
              "06316",
              "06315"
            ]
          },
          {
            "code": "CAJ-SAN-ICH",
            "name": "Ichocán",
            "postalCodes": [
              "06325"
            ]
          },
          {
            "code": "CAJ-SAN-JOS",
            "name": "José Manuel Quiroz",
            "postalCodes": [
              "06360"
            ]
          },
          {
            "code": "CAJ-SAN-JOS",
            "name": "José Sabogal",
            "postalCodes": [
              "06366",
              "06365"
            ]
          },
          {
            "code": "CAJ-SAN-PED",
            "name": "Pedro Galvez",
            "postalCodes": [
              "06320",
              "06321"
            ]
          }
        ],
        "cities": [
          {
            "code": "CAJ-SAN-CHA",
            "name": "Chancay",
            "postalCodes": [
              "06330",
              "15130",
              "15131"
            ]
          },
          {
            "code": "CAJ-SAN-ICH",
            "name": "Ichocan",
            "postalCodes": [
              "06325"
            ]
          },
          {
            "code": "CAJ-SAN-LA ",
            "name": "La Grama",
            "postalCodes": [
              "06335"
            ]
          },
          {
            "code": "CAJ-SAN-PAU",
            "name": "Paucamarca",
            "postalCodes": [
              "06315",
              "06316"
            ]
          },
          {
            "code": "ANC-HUA-SAN",
            "name": "San Marcos",
            "postalCodes": [
              "02390",
              "02391",
              "06320",
              "06321"
            ]
          },
          {
            "code": "CAJ-SAN-SHI",
            "name": "Shirac",
            "postalCodes": [
              "06360"
            ]
          },
          {
            "code": "CAJ-SAN-VEN",
            "name": "Venecia",
            "postalCodes": [
              "06365",
              "06366"
            ]
          }
        ]
      },
      {
        "code": "CAJ-SAN",
        "name": "San Miguel",
        "districts": [
          {
            "code": "CAJ-SAN-BOL",
            "name": "Bolivar",
            "postalCodes": [
              "06520"
            ]
          },
          {
            "code": "CAJ-SAN-CAL",
            "name": "Calquis",
            "postalCodes": [
              "06460"
            ]
          },
          {
            "code": "CAJ-SAN-CAT",
            "name": "Catilluc",
            "postalCodes": [
              "06495"
            ]
          },
          {
            "code": "CAJ-SAN-EL ",
            "name": "El Prado",
            "postalCodes": [
              "06465"
            ]
          },
          {
            "code": "CAJ-SAN-LA ",
            "name": "La Florida",
            "postalCodes": [
              "06500"
            ]
          },
          {
            "code": "CAJ-SAN-LLA",
            "name": "Llapa",
            "postalCodes": [
              "06480",
              "06481"
            ]
          },
          {
            "code": "CAJ-SAN-NAN",
            "name": "Nanchoc",
            "postalCodes": [
              "06530"
            ]
          },
          {
            "code": "CAJ-SAN-NIE",
            "name": "Niepos",
            "postalCodes": [
              "06510"
            ]
          },
          {
            "code": "CAJ-SAN-SAN",
            "name": "San Gregorio",
            "postalCodes": [
              "06475"
            ]
          },
          {
            "code": "CAJ-SAN-SAN",
            "name": "San Miguel",
            "postalCodes": [
              "06455",
              "06456"
            ]
          },
          {
            "code": "CAJ-SAN-SAN",
            "name": "San Silvestre de Cochan",
            "postalCodes": [
              "06485"
            ]
          },
          {
            "code": "CAJ-SAN-TON",
            "name": "Tongod",
            "postalCodes": [
              "06630"
            ]
          },
          {
            "code": "CAJ-SAN-UNI",
            "name": "Unión Agua Blanca",
            "postalCodes": [
              "06470"
            ]
          }
        ],
        "cities": [
          {
            "code": "CAJ-SAN-AGU",
            "name": "Agua Blanca",
            "postalCodes": [
              "06470",
              "22710"
            ]
          },
          {
            "code": "CAJ-SAN-BOL",
            "name": "Bolivar",
            "postalCodes": [
              "06520",
              "13420"
            ]
          },
          {
            "code": "CAJ-SAN-CAL",
            "name": "Calquis",
            "postalCodes": [
              "06460"
            ]
          },
          {
            "code": "CAJ-SAN-CAT",
            "name": "Catilluc",
            "postalCodes": [
              "06495"
            ]
          },
          {
            "code": "CAJ-SAN-EL ",
            "name": "El Prado",
            "postalCodes": [
              "06465"
            ]
          },
          {
            "code": "CAJ-SAN-LA ",
            "name": "La Florida",
            "postalCodes": [
              "06500"
            ]
          },
          {
            "code": "CAJ-SAN-LLA",
            "name": "Llapa",
            "postalCodes": [
              "06480",
              "06481"
            ]
          },
          {
            "code": "CAJ-SAN-NAN",
            "name": "Nanchoc",
            "postalCodes": [
              "06530"
            ]
          },
          {
            "code": "CAJ-SAN-NIE",
            "name": "Niepos",
            "postalCodes": [
              "06510"
            ]
          },
          {
            "code": "ARE-CAM-SAN",
            "name": "San Gregorio",
            "postalCodes": [
              "04455",
              "04456",
              "06475"
            ]
          },
          {
            "code": "CAJ-SAN-SAN",
            "name": "San Miguel de Pallaques",
            "postalCodes": [
              "06455",
              "06456"
            ]
          },
          {
            "code": "CAJ-SAN-SAN",
            "name": "San Silvestre de Cochan",
            "postalCodes": [
              "06485"
            ]
          },
          {
            "code": "CAJ-SAN-TON",
            "name": "Tongod",
            "postalCodes": [
              "06630"
            ]
          }
        ]
      },
      {
        "code": "CAJ-SAN",
        "name": "San Pablo",
        "districts": [
          {
            "code": "CAJ-SAN-SAN",
            "name": "San Bernardino",
            "postalCodes": [
              "06445"
            ]
          },
          {
            "code": "CAJ-SAN-SAN",
            "name": "San Luis",
            "postalCodes": [
              "06450"
            ]
          },
          {
            "code": "CAJ-SAN-SAN",
            "name": "San Pablo",
            "postalCodes": [
              "06451",
              "06452"
            ]
          },
          {
            "code": "CAJ-SAN-TUM",
            "name": "Tumbaden",
            "postalCodes": [
              "06490"
            ]
          }
        ],
        "cities": [
          {
            "code": "CAJ-SAN-SAN",
            "name": "San Bernardino",
            "postalCodes": [
              "06445"
            ]
          },
          {
            "code": "CAJ-SAN-SAN",
            "name": "San Luis Grande",
            "postalCodes": [
              "06450"
            ]
          },
          {
            "code": "CAJ-SAN-SAN",
            "name": "San Pablo",
            "postalCodes": [
              "06451",
              "06452",
              "08250",
              "22730",
              "22731"
            ]
          },
          {
            "code": "CAJ-SAN-TUM",
            "name": "Tumbaden",
            "postalCodes": [
              "06490"
            ]
          }
        ]
      },
      {
        "code": "CAJ-SAN",
        "name": "Santa Cruz",
        "districts": [
          {
            "code": "CAJ-SAN-AND",
            "name": "Andabamba",
            "postalCodes": [
              "06615"
            ]
          },
          {
            "code": "CAJ-SAN-CAT",
            "name": "Catache",
            "postalCodes": [
              "06645",
              "06644"
            ]
          },
          {
            "code": "CAJ-SAN-CHA",
            "name": "Chancaybaños",
            "postalCodes": [
              "06610"
            ]
          },
          {
            "code": "CAJ-SAN-LA ",
            "name": "La Esperanza",
            "postalCodes": [
              "06611"
            ]
          },
          {
            "code": "CAJ-SAN-NIN",
            "name": "Ninabamba",
            "postalCodes": [
              "06621"
            ]
          },
          {
            "code": "CAJ-SAN-PUL",
            "name": "Pulan",
            "postalCodes": [
              "06641"
            ]
          },
          {
            "code": "CAJ-SAN-SAN",
            "name": "Santa Cruz",
            "postalCodes": [
              "06635",
              "06633"
            ]
          },
          {
            "code": "CAJ-SAN-SAU",
            "name": "Saucepampa",
            "postalCodes": [
              "06640"
            ]
          },
          {
            "code": "CAJ-SAN-SEX",
            "name": "Sexi",
            "postalCodes": [
              "06660"
            ]
          },
          {
            "code": "CAJ-SAN-UTI",
            "name": "Uticyacu",
            "postalCodes": [
              "06605"
            ]
          },
          {
            "code": "CAJ-SAN-YAU",
            "name": "Yauyucan",
            "postalCodes": [
              "06620"
            ]
          }
        ],
        "cities": [
          {
            "code": "CAJ-SAN-AND",
            "name": "Andabamba",
            "postalCodes": [
              "06615",
              "09310"
            ]
          },
          {
            "code": "CAJ-SAN-CAT",
            "name": "Catache",
            "postalCodes": [
              "06644",
              "06645"
            ]
          },
          {
            "code": "CAJ-SAN-CHA",
            "name": "Chancaybaños",
            "postalCodes": [
              "06610"
            ]
          },
          {
            "code": "CAJ-SAN-LA ",
            "name": "La Esperanza",
            "postalCodes": [
              "06611",
              "13002",
              "13012",
              "13013",
              "13014",
              "23000",
              "23001",
              "23002",
              "23006"
            ]
          },
          {
            "code": "CAJ-SAN-NIN",
            "name": "Ninabamba",
            "postalCodes": [
              "06621"
            ]
          },
          {
            "code": "CAJ-SAN-PUL",
            "name": "Pulan",
            "postalCodes": [
              "06641"
            ]
          },
          {
            "code": "CAJ-SAN-SAN",
            "name": "Santa Cruz de Succhabamba",
            "postalCodes": [
              "06633",
              "06635"
            ]
          },
          {
            "code": "CAJ-SAN-SAU",
            "name": "Saucepampa",
            "postalCodes": [
              "06640"
            ]
          },
          {
            "code": "CAJ-SAN-SEX",
            "name": "Sexi",
            "postalCodes": [
              "06660"
            ]
          },
          {
            "code": "CAJ-SAN-UTI",
            "name": "Uticyacu",
            "postalCodes": [
              "06605"
            ]
          },
          {
            "code": "CAJ-SAN-YAU",
            "name": "Yauyucan",
            "postalCodes": [
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
        "code": "CAL-CAL",
        "name": "Callao",
        "districts": [
          {
            "code": "CAL-CAL-BEL",
            "name": "Bellavista",
            "postalCodes": [
              "07021",
              "07016",
              "07011",
              "07001",
              "07006"
            ]
          },
          {
            "code": "CAL-CAL-CAL",
            "name": "Callao",
            "postalCodes": [
              "07021",
              "07026",
              "07041",
              "07001",
              "07036",
              "07046",
              "07031",
              "07006"
            ]
          },
          {
            "code": "CAL-CAL-CAR",
            "name": "Carmen de la Legua Reynoso",
            "postalCodes": [
              "07006"
            ]
          },
          {
            "code": "CAL-CAL-LA ",
            "name": "La Perla",
            "postalCodes": [
              "07011",
              "07016"
            ]
          },
          {
            "code": "CAL-CAL-LA ",
            "name": "La Punta",
            "postalCodes": [
              "07021"
            ]
          },
          {
            "code": "CAL-CAL-VEN",
            "name": "Ventanilla",
            "postalCodes": [
              "07056",
              "07071",
              "07061",
              "07076",
              "07066",
              "07051",
              "07046"
            ]
          }
        ],
        "cities": [
          {
            "code": "CAJ-JAE-BEL",
            "name": "Bellavista",
            "postalCodes": [
              "06815",
              "06816",
              "07001",
              "07006",
              "07011",
              "07016",
              "07021",
              "20101",
              "20102",
              "20650",
              "22740",
              "22741"
            ]
          },
          {
            "code": "CAL-CAL-CAL",
            "name": "Callao",
            "postalCodes": [
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
            "code": "CAL-CAL-CAR",
            "name": "Carmen de la Legua Reynoso",
            "postalCodes": [
              "07006"
            ]
          },
          {
            "code": "CAL-CAL-LA ",
            "name": "La Perla",
            "postalCodes": [
              "07011",
              "07016"
            ]
          },
          {
            "code": "CAL-CAL-LA ",
            "name": "La Punta",
            "postalCodes": [
              "07021"
            ]
          },
          {
            "code": "CAL-CAL-VEN",
            "name": "Ventanilla",
            "postalCodes": [
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
        "code": "CUZ-ACO",
        "name": "Acomayo",
        "districts": [
          {
            "code": "CUZ-ACO-ACO",
            "name": "Acomayo",
            "postalCodes": [
              "08550",
              "08551"
            ]
          },
          {
            "code": "CUZ-ACO-ACO",
            "name": "Acopia",
            "postalCodes": [
              "08295"
            ]
          },
          {
            "code": "CUZ-ACO-ACO",
            "name": "Acos",
            "postalCodes": [
              "08545"
            ]
          },
          {
            "code": "CUZ-ACO-MOS",
            "name": "Mosoc Llacta",
            "postalCodes": [
              "08290"
            ]
          },
          {
            "code": "CUZ-ACO-POM",
            "name": "Pomacanchi",
            "postalCodes": [
              "08560",
              "08561"
            ]
          },
          {
            "code": "CUZ-ACO-RON",
            "name": "Rondocan",
            "postalCodes": [
              "08525"
            ]
          },
          {
            "code": "CUZ-ACO-SAN",
            "name": "Sangarara",
            "postalCodes": [
              "08555"
            ]
          }
        ],
        "cities": [
          {
            "code": "CUZ-ACO-ACO",
            "name": "Acomayo",
            "postalCodes": [
              "08550",
              "08551",
              "10110",
              "10111"
            ]
          },
          {
            "code": "CUZ-ACO-ACO",
            "name": "Acopia",
            "postalCodes": [
              "08295"
            ]
          },
          {
            "code": "CUZ-ACO-ACO",
            "name": "Acos",
            "postalCodes": [
              "08545",
              "15215"
            ]
          },
          {
            "code": "CUZ-ACO-MOS",
            "name": "Mosoc Llacta",
            "postalCodes": [
              "08290"
            ]
          },
          {
            "code": "CUZ-ACO-POM",
            "name": "Pomacanchi",
            "postalCodes": [
              "08560",
              "08561"
            ]
          },
          {
            "code": "CUZ-ACO-RON",
            "name": "Rondocan",
            "postalCodes": [
              "08525"
            ]
          },
          {
            "code": "CUZ-ACO-SAN",
            "name": "Sangarara",
            "postalCodes": [
              "08555"
            ]
          }
        ]
      },
      {
        "code": "CUZ-ANT",
        "name": "Anta",
        "districts": [
          {
            "code": "CUZ-ANT-ANC",
            "name": "Ancahuasi",
            "postalCodes": [
              "08635",
              "08636"
            ]
          },
          {
            "code": "CUZ-ANT-ANT",
            "name": "Anta",
            "postalCodes": [
              "08615",
              "08616"
            ]
          },
          {
            "code": "CUZ-ANT-CAC",
            "name": "Cachimayo",
            "postalCodes": [
              "08605"
            ]
          },
          {
            "code": "CUZ-ANT-CHI",
            "name": "Chinchaypujio",
            "postalCodes": [
              "08620"
            ]
          },
          {
            "code": "CUZ-ANT-HUA",
            "name": "Huarocondo",
            "postalCodes": [
              "08626",
              "08625"
            ]
          },
          {
            "code": "CUZ-ANT-LIM",
            "name": "Limatambo",
            "postalCodes": [
              "08640",
              "08641"
            ]
          },
          {
            "code": "CUZ-ANT-MOL",
            "name": "Mollepata",
            "postalCodes": [
              "08645"
            ]
          },
          {
            "code": "CUZ-ANT-PUC",
            "name": "Pucyura",
            "postalCodes": [
              "08610"
            ]
          },
          {
            "code": "CUZ-ANT-ZUR",
            "name": "Zurite",
            "postalCodes": [
              "08630"
            ]
          }
        ],
        "cities": [
          {
            "code": "CUZ-ANT-ANC",
            "name": "Ancahuasi",
            "postalCodes": [
              "08635",
              "08636"
            ]
          },
          {
            "code": "ANC-CAR-ANT",
            "name": "Anta",
            "postalCodes": [
              "02105",
              "08615",
              "08616",
              "09375",
              "09376"
            ]
          },
          {
            "code": "CUZ-ANT-CAC",
            "name": "Cachimayo",
            "postalCodes": [
              "08605"
            ]
          },
          {
            "code": "CUZ-ANT-CHI",
            "name": "Chinchaypujio",
            "postalCodes": [
              "08620"
            ]
          },
          {
            "code": "CUZ-ANT-HUA",
            "name": "Huarocondo",
            "postalCodes": [
              "08625",
              "08626"
            ]
          },
          {
            "code": "CUZ-ANT-LIM",
            "name": "Limatambo",
            "postalCodes": [
              "08640",
              "08641"
            ]
          },
          {
            "code": "CUZ-ANT-MOL",
            "name": "Mollepata",
            "postalCodes": [
              "08645",
              "13170"
            ]
          },
          {
            "code": "CUZ-ANT-PUC",
            "name": "Pucyura",
            "postalCodes": [
              "08610"
            ]
          },
          {
            "code": "CUZ-ANT-ZUR",
            "name": "Zurite",
            "postalCodes": [
              "08630"
            ]
          }
        ]
      },
      {
        "code": "CUZ-CAL",
        "name": "Calca",
        "districts": [
          {
            "code": "CUZ-CAL-CAL",
            "name": "Calca",
            "postalCodes": [
              "08120",
              "08121"
            ]
          },
          {
            "code": "CUZ-CAL-COY",
            "name": "Coya",
            "postalCodes": [
              "08110"
            ]
          },
          {
            "code": "CUZ-CAL-LAM",
            "name": "Lamay",
            "postalCodes": [
              "08116",
              "08115"
            ]
          },
          {
            "code": "CUZ-CAL-LAR",
            "name": "Lares",
            "postalCodes": [
              "08125",
              "08126"
            ]
          },
          {
            "code": "CUZ-CAL-PIS",
            "name": "Pisac",
            "postalCodes": [
              "08105",
              "08106"
            ]
          },
          {
            "code": "CUZ-CAL-SAN",
            "name": "San Salvador",
            "postalCodes": [
              "08151",
              "08150"
            ]
          },
          {
            "code": "CUZ-CAL-TAR",
            "name": "Taray",
            "postalCodes": [
              "08100"
            ]
          },
          {
            "code": "CUZ-CAL-YAN",
            "name": "Yanatile",
            "postalCodes": [
              "08770",
              "08771"
            ]
          }
        ],
        "cities": [
          {
            "code": "CUZ-CAL-CAL",
            "name": "Calca",
            "postalCodes": [
              "08120",
              "08121"
            ]
          },
          {
            "code": "CUZ-CAL-COY",
            "name": "Coya",
            "postalCodes": [
              "08110"
            ]
          },
          {
            "code": "CUZ-CAL-LAM",
            "name": "Lamay",
            "postalCodes": [
              "08115",
              "08116"
            ]
          },
          {
            "code": "CUZ-CAL-LAR",
            "name": "Lares",
            "postalCodes": [
              "08125",
              "08126"
            ]
          },
          {
            "code": "CUZ-CAL-PIS",
            "name": "Pisac",
            "postalCodes": [
              "08105",
              "08106"
            ]
          },
          {
            "code": "CUZ-CAL-QUE",
            "name": "Quebrada Honda",
            "postalCodes": [
              "08770",
              "08771"
            ]
          },
          {
            "code": "CUZ-CAL-SAN",
            "name": "San Salvador",
            "postalCodes": [
              "08150",
              "08151"
            ]
          },
          {
            "code": "CUZ-CAL-TAR",
            "name": "Taray",
            "postalCodes": [
              "08100"
            ]
          }
        ]
      },
      {
        "code": "CUZ-CAN",
        "name": "Canas",
        "districts": [
          {
            "code": "CUZ-CAN-CHE",
            "name": "Checca",
            "postalCodes": [
              "08277",
              "08278"
            ]
          },
          {
            "code": "CUZ-CAN-KUN",
            "name": "Kunturkannki",
            "postalCodes": [
              "08268",
              "08267"
            ]
          },
          {
            "code": "CUZ-CAN-LAN",
            "name": "Langui",
            "postalCodes": [
              "08270"
            ]
          },
          {
            "code": "CUZ-CAN-LAY",
            "name": "Layo",
            "postalCodes": [
              "08275",
              "08274"
            ]
          },
          {
            "code": "CUZ-CAN-PAM",
            "name": "Pampamarca",
            "postalCodes": [
              "08260"
            ]
          },
          {
            "code": "CUZ-CAN-QUE",
            "name": "Quehue",
            "postalCodes": [
              "08280"
            ]
          },
          {
            "code": "CUZ-CAN-TUP",
            "name": "Tupac Amaru",
            "postalCodes": [
              "08285"
            ]
          },
          {
            "code": "CUZ-CAN-YAN",
            "name": "Yanaoca",
            "postalCodes": [
              "08265",
              "08264"
            ]
          }
        ],
        "cities": [
          {
            "code": "CUZ-CAN-CHE",
            "name": "Checca",
            "postalCodes": [
              "08277",
              "08278"
            ]
          },
          {
            "code": "CUZ-CAN-EL ",
            "name": "El Descanso",
            "postalCodes": [
              "08267",
              "08268"
            ]
          },
          {
            "code": "CUZ-CAN-LAN",
            "name": "Langui",
            "postalCodes": [
              "08270"
            ]
          },
          {
            "code": "CUZ-CAN-LAY",
            "name": "Layo",
            "postalCodes": [
              "08274",
              "08275"
            ]
          },
          {
            "code": "CUZ-CAN-PAM",
            "name": "Pampamarca",
            "postalCodes": [
              "08260",
              "10750"
            ]
          },
          {
            "code": "CUZ-CAN-QUE",
            "name": "Quehue",
            "postalCodes": [
              "08280"
            ]
          },
          {
            "code": "CUZ-CAN-TUN",
            "name": "Tungasuca",
            "postalCodes": [
              "08285"
            ]
          },
          {
            "code": "CUZ-CAN-YAN",
            "name": "Yanaoca",
            "postalCodes": [
              "08264",
              "08265"
            ]
          }
        ]
      },
      {
        "code": "CUZ-CAN",
        "name": "Canchis",
        "districts": [
          {
            "code": "CUZ-CAN-CHE",
            "name": "Checacupe",
            "postalCodes": [
              "08230"
            ]
          },
          {
            "code": "CUZ-CAN-COM",
            "name": "Combapata",
            "postalCodes": [
              "08238",
              "08240"
            ]
          },
          {
            "code": "CUZ-CAN-MAR",
            "name": "Marangani",
            "postalCodes": [
              "08258",
              "08257"
            ]
          },
          {
            "code": "CUZ-CAN-PIT",
            "name": "Pitumarca",
            "postalCodes": [
              "08234",
              "08235"
            ]
          },
          {
            "code": "CUZ-CAN-SAN",
            "name": "San Pablo",
            "postalCodes": [
              "08250"
            ]
          },
          {
            "code": "CUZ-CAN-SAN",
            "name": "San Pedro",
            "postalCodes": [
              "08245"
            ]
          },
          {
            "code": "CUZ-CAN-SIC",
            "name": "Sicuani",
            "postalCodes": [
              "08254",
              "08255"
            ]
          },
          {
            "code": "CUZ-CAN-TIN",
            "name": "Tinta",
            "postalCodes": [
              "08243",
              "08242"
            ]
          }
        ],
        "cities": [
          {
            "code": "CUZ-CAN-CHE",
            "name": "Checacupe",
            "postalCodes": [
              "08230"
            ]
          },
          {
            "code": "CUZ-CAN-COM",
            "name": "Combapata",
            "postalCodes": [
              "08238",
              "08240"
            ]
          },
          {
            "code": "CUZ-CAN-MAR",
            "name": "Marangani",
            "postalCodes": [
              "08257",
              "08258"
            ]
          },
          {
            "code": "CUZ-CAN-PIT",
            "name": "Pitumarca",
            "postalCodes": [
              "08234",
              "08235"
            ]
          },
          {
            "code": "CAJ-SAN-SAN",
            "name": "San Pablo",
            "postalCodes": [
              "06451",
              "06452",
              "08250",
              "22730",
              "22731"
            ]
          },
          {
            "code": "AYA-LUC-SAN",
            "name": "San Pedro",
            "postalCodes": [
              "05510",
              "08245",
              "11700",
              "11703",
              "15641"
            ]
          },
          {
            "code": "CUZ-CAN-SIC",
            "name": "Sicuani",
            "postalCodes": [
              "08254",
              "08255"
            ]
          },
          {
            "code": "CUZ-CAN-TIN",
            "name": "Tinta",
            "postalCodes": [
              "08242",
              "08243"
            ]
          }
        ]
      },
      {
        "code": "CUZ-CHU",
        "name": "Chumbivilcas",
        "districts": [
          {
            "code": "CUZ-CHU-CAP",
            "name": "Capacmarca",
            "postalCodes": [
              "08450"
            ]
          },
          {
            "code": "CUZ-CHU-CHA",
            "name": "Chamaca",
            "postalCodes": [
              "08461",
              "08460"
            ]
          },
          {
            "code": "CUZ-CHU-COL",
            "name": "Colquemarca",
            "postalCodes": [
              "08441",
              "08440"
            ]
          },
          {
            "code": "CUZ-CHU-LIV",
            "name": "Livitaca",
            "postalCodes": [
              "08471",
              "08470"
            ]
          },
          {
            "code": "CUZ-CHU-LLU",
            "name": "Llusco",
            "postalCodes": [
              "08410",
              "08411"
            ]
          },
          {
            "code": "CUZ-CHU-QUI",
            "name": "Quiñota",
            "postalCodes": [
              "08400"
            ]
          },
          {
            "code": "CUZ-CHU-SAN",
            "name": "Santo Tomas",
            "postalCodes": [
              "08420",
              "08421"
            ]
          },
          {
            "code": "CUZ-CHU-VEL",
            "name": "Velille",
            "postalCodes": [
              "08431",
              "08430"
            ]
          }
        ],
        "cities": [
          {
            "code": "CUZ-CHU-CAP",
            "name": "Capacmarca",
            "postalCodes": [
              "08450"
            ]
          },
          {
            "code": "CUZ-CHU-CHA",
            "name": "Chamaca",
            "postalCodes": [
              "08460",
              "08461"
            ]
          },
          {
            "code": "CUZ-CHU-COL",
            "name": "Colquemarca",
            "postalCodes": [
              "08440",
              "08441"
            ]
          },
          {
            "code": "CUZ-CHU-LIV",
            "name": "Livitaca",
            "postalCodes": [
              "08470",
              "08471"
            ]
          },
          {
            "code": "CUZ-CHU-LLU",
            "name": "Llusco",
            "postalCodes": [
              "08410",
              "08411"
            ]
          },
          {
            "code": "CUZ-CHU-QUI",
            "name": "Quiñota",
            "postalCodes": [
              "08400"
            ]
          },
          {
            "code": "AMA-LUY-SAN",
            "name": "Santo Tomas",
            "postalCodes": [
              "01445",
              "06760",
              "06761",
              "08420",
              "08421"
            ]
          },
          {
            "code": "CUZ-CHU-VEL",
            "name": "Velille",
            "postalCodes": [
              "08430",
              "08431"
            ]
          }
        ]
      },
      {
        "code": "CUZ-CUZ",
        "name": "Cuzco",
        "districts": [
          {
            "code": "CUZ-CUZ-CCO",
            "name": "Ccorca",
            "postalCodes": [
              "08000",
              "08051"
            ]
          },
          {
            "code": "CUZ-CUZ-CUS",
            "name": "Cusco",
            "postalCodes": [
              "08003",
              "08000",
              "08002",
              "08001"
            ]
          },
          {
            "code": "CUZ-CUZ-POR",
            "name": "Poroy",
            "postalCodes": [
              "08600"
            ]
          },
          {
            "code": "CUZ-CUZ-SAN",
            "name": "San Jerónimo",
            "postalCodes": [
              "08000",
              "08006"
            ]
          },
          {
            "code": "CUZ-CUZ-SAN",
            "name": "San Sebastian",
            "postalCodes": [
              "08004",
              "08000",
              "08006"
            ]
          },
          {
            "code": "CUZ-CUZ-SAN",
            "name": "Santiago",
            "postalCodes": [
              "08007",
              "08000",
              "08006",
              "08001"
            ]
          },
          {
            "code": "CUZ-CUZ-SAY",
            "name": "Saylla",
            "postalCodes": [
              "08200"
            ]
          },
          {
            "code": "CUZ-CUZ-WAN",
            "name": "Wanchaq",
            "postalCodes": [
              "08006",
              "08003",
              "08004",
              "08007",
              "08002"
            ]
          }
        ],
        "cities": [
          {
            "code": "CUZ-CUZ-CCO",
            "name": "Ccorcca",
            "postalCodes": [
              "08000",
              "08051"
            ]
          },
          {
            "code": "CUZ-CUZ-CUS",
            "name": "Cusco",
            "postalCodes": [
              "08000",
              "08001",
              "08002",
              "08003"
            ]
          },
          {
            "code": "CUZ-CUZ-POR",
            "name": "Poroy",
            "postalCodes": [
              "08600"
            ]
          },
          {
            "code": "APU-AND-SAN",
            "name": "San Jeronimo",
            "postalCodes": [
              "03700",
              "03701",
              "08000",
              "08006"
            ]
          },
          {
            "code": "CUZ-CUZ-SAN",
            "name": "San Sebastian",
            "postalCodes": [
              "08000",
              "08004",
              "08006"
            ]
          },
          {
            "code": "CUZ-CUZ-SAN",
            "name": "Santiago",
            "postalCodes": [
              "08000",
              "08001",
              "08006",
              "08007",
              "11230",
              "11231"
            ]
          },
          {
            "code": "CUZ-CUZ-SAY",
            "name": "Saylla",
            "postalCodes": [
              "08200"
            ]
          },
          {
            "code": "CUZ-CUZ-WAN",
            "name": "Wanchaq",
            "postalCodes": [
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
        "code": "CUZ-ESP",
        "name": "Espinar",
        "districts": [
          {
            "code": "CUZ-ESP-ALT",
            "name": "Alto Pichigua",
            "postalCodes": [
              "08330"
            ]
          },
          {
            "code": "CUZ-ESP-CON",
            "name": "Condoroma",
            "postalCodes": [
              "08350"
            ]
          },
          {
            "code": "CUZ-ESP-COP",
            "name": "Coporaque",
            "postalCodes": [
              "08370",
              "08371"
            ]
          },
          {
            "code": "CUZ-ESP-ESP",
            "name": "Espinar",
            "postalCodes": [
              "08301",
              "08300"
            ]
          },
          {
            "code": "CUZ-ESP-OCO",
            "name": "Ocoruro",
            "postalCodes": [
              "08340"
            ]
          },
          {
            "code": "CUZ-ESP-PAL",
            "name": "Pallpata",
            "postalCodes": [
              "08320",
              "08321"
            ]
          },
          {
            "code": "CUZ-ESP-PIC",
            "name": "Pichigua",
            "postalCodes": [
              "08310"
            ]
          },
          {
            "code": "CUZ-ESP-SUY",
            "name": "Suyckutambo",
            "postalCodes": [
              "08360"
            ]
          }
        ],
        "cities": [
          {
            "code": "CUZ-ESP-ACC",
            "name": "Accocunca",
            "postalCodes": [
              "08330"
            ]
          },
          {
            "code": "CUZ-ESP-CON",
            "name": "Condoroma",
            "postalCodes": [
              "08350"
            ]
          },
          {
            "code": "ARE-CAY-COP",
            "name": "Coporaque",
            "postalCodes": [
              "04150",
              "08370",
              "08371"
            ]
          },
          {
            "code": "CUZ-ESP-HEC",
            "name": "Hector Tejada",
            "postalCodes": [
              "08320",
              "08321"
            ]
          },
          {
            "code": "CUZ-ESP-OCO",
            "name": "Ocoruro",
            "postalCodes": [
              "08340"
            ]
          },
          {
            "code": "CUZ-ESP-PIC",
            "name": "Pichigua",
            "postalCodes": [
              "08310"
            ]
          },
          {
            "code": "CUZ-ESP-VIR",
            "name": "Virginiyoc",
            "postalCodes": [
              "08360"
            ]
          },
          {
            "code": "CUZ-ESP-YAU",
            "name": "Yauri  ( Espinar)",
            "postalCodes": [
              "08300",
              "08301"
            ]
          }
        ]
      },
      {
        "code": "CUZ-LA ",
        "name": "La Convención",
        "districts": [
          {
            "code": "CUZ-LA -ECH",
            "name": "Echarate",
            "postalCodes": [
              "08751",
              "08750"
            ]
          },
          {
            "code": "CUZ-LA -HUA",
            "name": "Huayopata",
            "postalCodes": [
              "08700",
              "08701"
            ]
          },
          {
            "code": "CUZ-LA -KIM",
            "name": "Kimbiri",
            "postalCodes": [
              "08801",
              "08800"
            ]
          },
          {
            "code": "CUZ-LA -MAR",
            "name": "Maranura",
            "postalCodes": [
              "08730",
              "08731"
            ]
          },
          {
            "code": "CUZ-LA -OCO",
            "name": "Ocobamba",
            "postalCodes": [
              "08781",
              "08780"
            ]
          },
          {
            "code": "CUZ-LA -PIC",
            "name": "Pichari",
            "postalCodes": [
              "08851",
              "08850"
            ]
          },
          {
            "code": "CUZ-LA -QUE",
            "name": "Quellouno",
            "postalCodes": [
              "08760",
              "08761"
            ]
          },
          {
            "code": "CUZ-LA -SAN",
            "name": "Santa Ana",
            "postalCodes": [
              "08740",
              "08741"
            ]
          },
          {
            "code": "CUZ-LA -SAN",
            "name": "Santa Teresa",
            "postalCodes": [
              "08710",
              "08711"
            ]
          },
          {
            "code": "CUZ-LA -VIL",
            "name": "Vilcabamba",
            "postalCodes": [
              "08721",
              "08720"
            ]
          }
        ],
        "cities": [
          {
            "code": "CUZ-LA -ECH",
            "name": "Echarate",
            "postalCodes": [
              "08750",
              "08751"
            ]
          },
          {
            "code": "CUZ-LA -HUY",
            "name": "Huyro",
            "postalCodes": [
              "08700",
              "08701"
            ]
          },
          {
            "code": "CUZ-LA -KIM",
            "name": "Kimbiri",
            "postalCodes": [
              "08800",
              "08801"
            ]
          },
          {
            "code": "CUZ-LA -KQU",
            "name": "Kquelccaybamba",
            "postalCodes": [
              "08780",
              "08781"
            ]
          },
          {
            "code": "ANC-MAR-LUC",
            "name": "Lucma",
            "postalCodes": [
              "02290",
              "08720",
              "08721",
              "13240",
              "13241"
            ]
          },
          {
            "code": "CUZ-LA -MAR",
            "name": "Maranura",
            "postalCodes": [
              "08730",
              "08731"
            ]
          },
          {
            "code": "CUZ-LA -PIC",
            "name": "Pichari",
            "postalCodes": [
              "08850",
              "08851"
            ]
          },
          {
            "code": "CUZ-LA -QUE",
            "name": "Quellouno",
            "postalCodes": [
              "08760",
              "08761"
            ]
          },
          {
            "code": "CUZ-LA -QUI",
            "name": "Quillabamba",
            "postalCodes": [
              "08740",
              "08741"
            ]
          },
          {
            "code": "CUZ-LA -SAN",
            "name": "Santa Teresa",
            "postalCodes": [
              "08710",
              "08711"
            ]
          }
        ]
      },
      {
        "code": "CUZ-PAR",
        "name": "Paruro",
        "districts": [
          {
            "code": "CUZ-PAR-ACC",
            "name": "Accha",
            "postalCodes": [
              "08535"
            ]
          },
          {
            "code": "CUZ-PAR-CCA",
            "name": "Ccapi",
            "postalCodes": [
              "08505"
            ]
          },
          {
            "code": "CUZ-PAR-COL",
            "name": "Colcha",
            "postalCodes": [
              "08530"
            ]
          },
          {
            "code": "CUZ-PAR-HUA",
            "name": "Huanoquite",
            "postalCodes": [
              "08500",
              "08501"
            ]
          },
          {
            "code": "CUZ-PAR-OMA",
            "name": "Omacha",
            "postalCodes": [
              "08565",
              "08566"
            ]
          },
          {
            "code": "CUZ-PAR-PAC",
            "name": "Paccaritambo",
            "postalCodes": [
              "08515"
            ]
          },
          {
            "code": "CUZ-PAR-PAR",
            "name": "Paruro",
            "postalCodes": [
              "08520"
            ]
          },
          {
            "code": "CUZ-PAR-PIL",
            "name": "Pillpinto",
            "postalCodes": [
              "08540"
            ]
          },
          {
            "code": "CUZ-PAR-YAU",
            "name": "Yaurisque",
            "postalCodes": [
              "08510"
            ]
          }
        ],
        "cities": [
          {
            "code": "CUZ-PAR-ACC",
            "name": "Accha",
            "postalCodes": [
              "08535"
            ]
          },
          {
            "code": "CUZ-PAR-CCA",
            "name": "Ccapi",
            "postalCodes": [
              "08505"
            ]
          },
          {
            "code": "CUZ-PAR-COL",
            "name": "Colcha",
            "postalCodes": [
              "08530"
            ]
          },
          {
            "code": "CUZ-PAR-HUA",
            "name": "Huanoquite",
            "postalCodes": [
              "08500",
              "08501"
            ]
          },
          {
            "code": "CUZ-PAR-OMA",
            "name": "Omacha",
            "postalCodes": [
              "08565",
              "08566"
            ]
          },
          {
            "code": "CUZ-PAR-PAC",
            "name": "Paccaritambo",
            "postalCodes": [
              "08515"
            ]
          },
          {
            "code": "CUZ-PAR-PAR",
            "name": "Paruro",
            "postalCodes": [
              "08520"
            ]
          },
          {
            "code": "CUZ-PAR-PIL",
            "name": "Pillpinto",
            "postalCodes": [
              "08540"
            ]
          },
          {
            "code": "CUZ-PAR-YAU",
            "name": "Yaurisque",
            "postalCodes": [
              "08510"
            ]
          }
        ]
      },
      {
        "code": "CUZ-PAU",
        "name": "Paucartambo",
        "districts": [
          {
            "code": "CUZ-PAU-CAI",
            "name": "Caicay",
            "postalCodes": [
              "08155"
            ]
          },
          {
            "code": "CUZ-PAU-CHA",
            "name": "Challabamba",
            "postalCodes": [
              "08141",
              "08140"
            ]
          },
          {
            "code": "CUZ-PAU-COL",
            "name": "Colquepata",
            "postalCodes": [
              "08131",
              "08130"
            ]
          },
          {
            "code": "CUZ-PAU-HUA",
            "name": "Huancarani",
            "postalCodes": [
              "08160",
              "08161"
            ]
          },
          {
            "code": "CUZ-PAU-KOS",
            "name": "Kosñipata",
            "postalCodes": [
              "08145"
            ]
          },
          {
            "code": "CUZ-PAU-PAU",
            "name": "Paucartambo",
            "postalCodes": [
              "08135",
              "08136"
            ]
          }
        ],
        "cities": [
          {
            "code": "CUZ-PAU-CAI",
            "name": "Caicay",
            "postalCodes": [
              "08155"
            ]
          },
          {
            "code": "CUZ-PAU-CHA",
            "name": "Challabamba",
            "postalCodes": [
              "08140",
              "08141"
            ]
          },
          {
            "code": "CUZ-PAU-COL",
            "name": "Colquepata",
            "postalCodes": [
              "08130",
              "08131"
            ]
          },
          {
            "code": "CUZ-PAU-HUA",
            "name": "Huancarani",
            "postalCodes": [
              "08160",
              "08161"
            ]
          },
          {
            "code": "CUZ-PAU-PAU",
            "name": "Paucartambo",
            "postalCodes": [
              "08135",
              "08136",
              "19200",
              "19201"
            ]
          },
          {
            "code": "CUZ-PAU-PIL",
            "name": "Pillcopata",
            "postalCodes": [
              "08145"
            ]
          }
        ]
      },
      {
        "code": "CUZ-QUI",
        "name": "Quispicanchi",
        "districts": [
          {
            "code": "CUZ-QUI-AND",
            "name": "Andahuaylillas",
            "postalCodes": [
              "08210"
            ]
          },
          {
            "code": "CUZ-QUI-CAM",
            "name": "Camanti",
            "postalCodes": [
              "08185"
            ]
          },
          {
            "code": "CUZ-QUI-CCA",
            "name": "Ccarhuayo",
            "postalCodes": [
              "08175"
            ]
          },
          {
            "code": "CUZ-QUI-CCA",
            "name": "Ccatca",
            "postalCodes": [
              "08166",
              "08165"
            ]
          },
          {
            "code": "CUZ-QUI-CUS",
            "name": "Cusipata",
            "postalCodes": [
              "08225"
            ]
          },
          {
            "code": "CUZ-QUI-HUA",
            "name": "Huaro",
            "postalCodes": [
              "08215"
            ]
          },
          {
            "code": "CUZ-QUI-LUC",
            "name": "Lucre",
            "postalCodes": [
              "08207"
            ]
          },
          {
            "code": "CUZ-QUI-MAR",
            "name": "Marcapata",
            "postalCodes": [
              "08180"
            ]
          },
          {
            "code": "CUZ-QUI-OCO",
            "name": "Ocongate",
            "postalCodes": [
              "08170",
              "08171"
            ]
          },
          {
            "code": "CUZ-QUI-ORO",
            "name": "Oropesa",
            "postalCodes": [
              "08204",
              "08205"
            ]
          },
          {
            "code": "CUZ-QUI-QUI",
            "name": "Quiquijana",
            "postalCodes": [
              "08223",
              "08222"
            ]
          },
          {
            "code": "CUZ-QUI-URC",
            "name": "Urcos",
            "postalCodes": [
              "08219",
              "08220"
            ]
          }
        ],
        "cities": [
          {
            "code": "CUZ-QUI-AND",
            "name": "Andahuaylillas",
            "postalCodes": [
              "08210"
            ]
          },
          {
            "code": "CUZ-QUI-CCA",
            "name": "Ccarhuayo",
            "postalCodes": [
              "08175"
            ]
          },
          {
            "code": "CUZ-QUI-CCA",
            "name": "Ccatca",
            "postalCodes": [
              "08165",
              "08166"
            ]
          },
          {
            "code": "CUZ-QUI-CUS",
            "name": "Cusipata",
            "postalCodes": [
              "08225"
            ]
          },
          {
            "code": "CUZ-QUI-HUA",
            "name": "Huaro",
            "postalCodes": [
              "08215"
            ]
          },
          {
            "code": "APU-AYM-LUC",
            "name": "Lucre",
            "postalCodes": [
              "03415",
              "08207"
            ]
          },
          {
            "code": "CUZ-QUI-MAR",
            "name": "Marcapata",
            "postalCodes": [
              "08180"
            ]
          },
          {
            "code": "CUZ-QUI-OCO",
            "name": "Ocongate",
            "postalCodes": [
              "08170",
              "08171"
            ]
          },
          {
            "code": "APU-ANT-ORO",
            "name": "Oropesa",
            "postalCodes": [
              "03340",
              "08204",
              "08205"
            ]
          },
          {
            "code": "CUZ-QUI-QUI",
            "name": "Quincemil",
            "postalCodes": [
              "08185"
            ]
          },
          {
            "code": "CUZ-QUI-QUI",
            "name": "Quiquijana",
            "postalCodes": [
              "08222",
              "08223"
            ]
          },
          {
            "code": "CUZ-QUI-URC",
            "name": "Urcos",
            "postalCodes": [
              "08219",
              "08220"
            ]
          }
        ]
      },
      {
        "code": "CUZ-URU",
        "name": "Urubamba",
        "districts": [
          {
            "code": "CUZ-URU-CHI",
            "name": "Chinchero",
            "postalCodes": [
              "08650",
              "08651"
            ]
          },
          {
            "code": "CUZ-URU-HUA",
            "name": "Huayllabamba",
            "postalCodes": [
              "08670"
            ]
          },
          {
            "code": "CUZ-URU-MAC",
            "name": "Machupicchu",
            "postalCodes": [
              "08681",
              "08680"
            ]
          },
          {
            "code": "CUZ-URU-MAR",
            "name": "Maras",
            "postalCodes": [
              "08656",
              "08655"
            ]
          },
          {
            "code": "CUZ-URU-OLL",
            "name": "Ollantaytambo",
            "postalCodes": [
              "08676",
              "08675"
            ]
          },
          {
            "code": "CUZ-URU-URU",
            "name": "Urubamba",
            "postalCodes": [
              "08661",
              "08660"
            ]
          },
          {
            "code": "CUZ-URU-YUC",
            "name": "Yucay",
            "postalCodes": [
              "08665"
            ]
          }
        ],
        "cities": [
          {
            "code": "CUZ-URU-CHI",
            "name": "Chinchero",
            "postalCodes": [
              "08650",
              "08651"
            ]
          },
          {
            "code": "ANC-SIH-HUA",
            "name": "Huayllabamba",
            "postalCodes": [
              "02230",
              "08670"
            ]
          },
          {
            "code": "CUZ-URU-MAC",
            "name": "Machupicchu",
            "postalCodes": [
              "08680",
              "08681"
            ]
          },
          {
            "code": "CUZ-URU-MAR",
            "name": "Maras",
            "postalCodes": [
              "08655",
              "08656"
            ]
          },
          {
            "code": "CUZ-URU-OLL",
            "name": "Ollantaytambo",
            "postalCodes": [
              "08675",
              "08676"
            ]
          },
          {
            "code": "CUZ-URU-URU",
            "name": "Urubamba",
            "postalCodes": [
              "08660",
              "08661"
            ]
          },
          {
            "code": "CUZ-URU-YUC",
            "name": "Yucay",
            "postalCodes": [
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
        "code": "HUA-ACO",
        "name": "Acobamba",
        "districts": [
          {
            "code": "HUA-ACO-ACO",
            "name": "Acobamba",
            "postalCodes": [
              "09380",
              "09381"
            ]
          },
          {
            "code": "HUA-ACO-AND",
            "name": "Andabamba",
            "postalCodes": [
              "09310"
            ]
          },
          {
            "code": "HUA-ACO-ANT",
            "name": "Anta",
            "postalCodes": [
              "09375",
              "09376"
            ]
          },
          {
            "code": "HUA-ACO-CAJ",
            "name": "Caja",
            "postalCodes": [
              "09390"
            ]
          },
          {
            "code": "HUA-ACO-MAR",
            "name": "Marcas",
            "postalCodes": [
              "09395"
            ]
          },
          {
            "code": "HUA-ACO-PAU",
            "name": "Paucara",
            "postalCodes": [
              "09305",
              "09306"
            ]
          },
          {
            "code": "HUA-ACO-POM",
            "name": "Pomacocha",
            "postalCodes": [
              "09385"
            ]
          },
          {
            "code": "HUA-ACO-ROS",
            "name": "Rosario",
            "postalCodes": [
              "09370",
              "09371"
            ]
          }
        ],
        "cities": [
          {
            "code": "ANC-SIH-ACO",
            "name": "Acobamba",
            "postalCodes": [
              "02235",
              "09380",
              "09381",
              "12700",
              "12701"
            ]
          },
          {
            "code": "CAJ-SAN-AND",
            "name": "Andabamba",
            "postalCodes": [
              "06615",
              "09310"
            ]
          },
          {
            "code": "ANC-CAR-ANT",
            "name": "Anta",
            "postalCodes": [
              "02105",
              "08615",
              "08616",
              "09375",
              "09376"
            ]
          },
          {
            "code": "HUA-ACO-CAJ",
            "name": "Caja",
            "postalCodes": [
              "09390"
            ]
          },
          {
            "code": "HUA-ACO-MAR",
            "name": "Marcas",
            "postalCodes": [
              "09395"
            ]
          },
          {
            "code": "HUA-ACO-PAU",
            "name": "Paucara",
            "postalCodes": [
              "09305",
              "09306"
            ]
          },
          {
            "code": "APU-AND-POM",
            "name": "Pomacocha",
            "postalCodes": [
              "03610",
              "09385"
            ]
          },
          {
            "code": "HUA-ACO-ROS",
            "name": "Rosario",
            "postalCodes": [
              "09370",
              "09371"
            ]
          }
        ]
      },
      {
        "code": "HUA-ANG",
        "name": "Angaraes",
        "districts": [
          {
            "code": "HUA-ANG-ANC",
            "name": "Anchonga",
            "postalCodes": [
              "09416",
              "09415"
            ]
          },
          {
            "code": "HUA-ANG-CAL",
            "name": "Callanmarca",
            "postalCodes": [
              "09425"
            ]
          },
          {
            "code": "HUA-ANG-CCO",
            "name": "Ccochaccasa",
            "postalCodes": [
              "09400"
            ]
          },
          {
            "code": "HUA-ANG-CHI",
            "name": "Chincho",
            "postalCodes": [
              "09450"
            ]
          },
          {
            "code": "HUA-ANG-CON",
            "name": "Congalla",
            "postalCodes": [
              "09435"
            ]
          },
          {
            "code": "HUA-ANG-HUA",
            "name": "Huanca Huanca",
            "postalCodes": [
              "09430"
            ]
          },
          {
            "code": "HUA-ANG-HUA",
            "name": "Huayllay Grande",
            "postalCodes": [
              "09420"
            ]
          },
          {
            "code": "HUA-ANG-JUL",
            "name": "Julcamarca",
            "postalCodes": [
              "09445"
            ]
          },
          {
            "code": "HUA-ANG-LIR",
            "name": "Lircay",
            "postalCodes": [
              "09405",
              "09406"
            ]
          },
          {
            "code": "HUA-ANG-SAN",
            "name": "San Antonio de Antaparco",
            "postalCodes": [
              "09455"
            ]
          },
          {
            "code": "HUA-ANG-SAN",
            "name": "Santo Tomas de Pata",
            "postalCodes": [
              "09460"
            ]
          },
          {
            "code": "HUA-ANG-SEC",
            "name": "Secclla",
            "postalCodes": [
              "09440"
            ]
          }
        ],
        "cities": [
          {
            "code": "HUA-ANG-ANC",
            "name": "Anchonga",
            "postalCodes": [
              "09415",
              "09416"
            ]
          },
          {
            "code": "HUA-ANG-ANT",
            "name": "Antaparco",
            "postalCodes": [
              "09455"
            ]
          },
          {
            "code": "HUA-ANG-CAL",
            "name": "Callanmarca",
            "postalCodes": [
              "09425"
            ]
          },
          {
            "code": "HUA-ANG-CCO",
            "name": "Ccochaccasa",
            "postalCodes": [
              "09400"
            ]
          },
          {
            "code": "HUA-ANG-CHI",
            "name": "Chincho",
            "postalCodes": [
              "09450"
            ]
          },
          {
            "code": "HUA-ANG-CON",
            "name": "Congalla",
            "postalCodes": [
              "09435"
            ]
          },
          {
            "code": "HUA-ANG-HUA",
            "name": "Huanca Huanca",
            "postalCodes": [
              "09430"
            ]
          },
          {
            "code": "HUA-ANG-HUA",
            "name": "Huayllay Grande",
            "postalCodes": [
              "09420"
            ]
          },
          {
            "code": "HUA-ANG-JUL",
            "name": "Julcamarca",
            "postalCodes": [
              "09445"
            ]
          },
          {
            "code": "HUA-ANG-LIR",
            "name": "Lircay",
            "postalCodes": [
              "09405",
              "09406"
            ]
          },
          {
            "code": "HUA-ANG-SAN",
            "name": "Santo Tomas de Pata",
            "postalCodes": [
              "09460"
            ]
          },
          {
            "code": "HUA-ANG-SEC",
            "name": "Secclla",
            "postalCodes": [
              "09440"
            ]
          }
        ]
      },
      {
        "code": "HUA-CAS",
        "name": "Castrovirreyna",
        "districts": [
          {
            "code": "HUA-CAS-ARM",
            "name": "Arma",
            "postalCodes": [
              "09700"
            ]
          },
          {
            "code": "HUA-CAS-AUR",
            "name": "Aurahua",
            "postalCodes": [
              "09735"
            ]
          },
          {
            "code": "HUA-CAS-CAP",
            "name": "Capillas",
            "postalCodes": [
              "09710"
            ]
          },
          {
            "code": "HUA-CAS-CAS",
            "name": "Castrovirreyna",
            "postalCodes": [
              "09725"
            ]
          },
          {
            "code": "HUA-CAS-CHU",
            "name": "Chupamarca",
            "postalCodes": [
              "09740"
            ]
          },
          {
            "code": "HUA-CAS-COC",
            "name": "Cocas",
            "postalCodes": [
              "09720"
            ]
          },
          {
            "code": "HUA-CAS-HUA",
            "name": "Huachos",
            "postalCodes": [
              "09705"
            ]
          },
          {
            "code": "HUA-CAS-HUA",
            "name": "Huamatambo",
            "postalCodes": [
              "09750"
            ]
          },
          {
            "code": "HUA-CAS-MOL",
            "name": "Mollepampa",
            "postalCodes": [
              "09715"
            ]
          },
          {
            "code": "HUA-CAS-SAN",
            "name": "San Juan",
            "postalCodes": [
              "09755"
            ]
          },
          {
            "code": "HUA-CAS-SAN",
            "name": "Santa Ana",
            "postalCodes": [
              "09500"
            ]
          },
          {
            "code": "HUA-CAS-TAN",
            "name": "Tantara",
            "postalCodes": [
              "09745"
            ]
          },
          {
            "code": "HUA-CAS-TIC",
            "name": "Ticrapo",
            "postalCodes": [
              "09730"
            ]
          }
        ],
        "cities": [
          {
            "code": "HUA-CAS-ARM",
            "name": "Arma",
            "postalCodes": [
              "09700"
            ]
          },
          {
            "code": "HUA-CAS-AUR",
            "name": "Aurahua",
            "postalCodes": [
              "09735"
            ]
          },
          {
            "code": "HUA-CAS-CAP",
            "name": "Capillas",
            "postalCodes": [
              "09710"
            ]
          },
          {
            "code": "HUA-CAS-CAS",
            "name": "Castrovirreyna",
            "postalCodes": [
              "09725"
            ]
          },
          {
            "code": "HUA-CAS-CHU",
            "name": "Chupamarca",
            "postalCodes": [
              "09740"
            ]
          },
          {
            "code": "HUA-CAS-COC",
            "name": "Cocas",
            "postalCodes": [
              "09720"
            ]
          },
          {
            "code": "HUA-CAS-HUA",
            "name": "Huachos",
            "postalCodes": [
              "09705"
            ]
          },
          {
            "code": "HUA-CAS-HUA",
            "name": "Huamatambo",
            "postalCodes": [
              "09750"
            ]
          },
          {
            "code": "HUA-CAS-MOL",
            "name": "Mollepampa",
            "postalCodes": [
              "09715"
            ]
          },
          {
            "code": "ANC-HUA-SAN",
            "name": "San Juan",
            "postalCodes": [
              "02170",
              "02171",
              "05520",
              "06400",
              "09755",
              "11420",
              "11421",
              "16000",
              "16007",
              "16008"
            ]
          },
          {
            "code": "HUA-CAS-SAN",
            "name": "Santa Ana",
            "postalCodes": [
              "09500"
            ]
          },
          {
            "code": "HUA-CAS-TAN",
            "name": "Tantara",
            "postalCodes": [
              "09745"
            ]
          },
          {
            "code": "HUA-CAS-TIC",
            "name": "Ticrapo",
            "postalCodes": [
              "09730"
            ]
          }
        ]
      },
      {
        "code": "HUA-CHU",
        "name": "Churcampa",
        "districts": [
          {
            "code": "HUA-CHU-ANC",
            "name": "Anco",
            "postalCodes": [
              "09316",
              "09315"
            ]
          },
          {
            "code": "HUA-CHU-CHI",
            "name": "Chinchihuasi",
            "postalCodes": [
              "09325"
            ]
          },
          {
            "code": "HUA-CHU-CHU",
            "name": "Churcampa",
            "postalCodes": [
              "09345",
              "09346"
            ]
          },
          {
            "code": "HUA-CHU-EL ",
            "name": "El Carmen",
            "postalCodes": [
              "09365"
            ]
          },
          {
            "code": "HUA-CHU-LA ",
            "name": "La Merced",
            "postalCodes": [
              "09355"
            ]
          },
          {
            "code": "HUA-CHU-LOC",
            "name": "Locroja",
            "postalCodes": [
              "09350"
            ]
          },
          {
            "code": "HUA-CHU-PAC",
            "name": "Pachamarca",
            "postalCodes": [
              "09335"
            ]
          },
          {
            "code": "HUA-CHU-PAU",
            "name": "Paucarbamba",
            "postalCodes": [
              "09330",
              "09331"
            ]
          },
          {
            "code": "HUA-CHU-SAN",
            "name": "San Miguel de Mayocc",
            "postalCodes": [
              "09360"
            ]
          },
          {
            "code": "HUA-CHU-SAN",
            "name": "San Pedro de Coris",
            "postalCodes": [
              "09340"
            ]
          }
        ],
        "cities": [
          {
            "code": "HUA-CHU-CHI",
            "name": "Chinchihuasi",
            "postalCodes": [
              "09325"
            ]
          },
          {
            "code": "HUA-CHU-CHU",
            "name": "Churcampa",
            "postalCodes": [
              "09345",
              "09346"
            ]
          },
          {
            "code": "HUA-CHU-LA ",
            "name": "La Esmeralda",
            "postalCodes": [
              "09315",
              "09316"
            ]
          },
          {
            "code": "ANC-AIJ-LA ",
            "name": "La Merced",
            "postalCodes": [
              "02613",
              "09355",
              "12855",
              "12856"
            ]
          },
          {
            "code": "HUA-CHU-LOC",
            "name": "Locroja",
            "postalCodes": [
              "09350"
            ]
          },
          {
            "code": "HUA-CHU-MAY",
            "name": "Mayocc",
            "postalCodes": [
              "09360"
            ]
          },
          {
            "code": "HUA-CHU-PAC",
            "name": "Pachamarca",
            "postalCodes": [
              "09335"
            ]
          },
          {
            "code": "HUA-CHU-PAU",
            "name": "Paucarbamba",
            "postalCodes": [
              "09330",
              "09331",
              "10000",
              "10002",
              "10003"
            ]
          },
          {
            "code": "HUA-CHU-PAU",
            "name": "Paucarbambilla",
            "postalCodes": [
              "09365"
            ]
          },
          {
            "code": "HUA-CHU-SAN",
            "name": "San Pedro de Coris",
            "postalCodes": [
              "09340"
            ]
          }
        ]
      },
      {
        "code": "HUA-HUA",
        "name": "Huancavelica",
        "districts": [
          {
            "code": "HUA-HUA-ACO",
            "name": "Acobambilla",
            "postalCodes": [
              "09800"
            ]
          },
          {
            "code": "HUA-HUA-ACO",
            "name": "Acoria",
            "postalCodes": [
              "09101",
              "09100"
            ]
          },
          {
            "code": "HUA-HUA-ASC",
            "name": "Ascensión",
            "postalCodes": [
              "09000",
              "09001"
            ]
          },
          {
            "code": "HUA-HUA-CON",
            "name": "Conayca",
            "postalCodes": [
              "09870"
            ]
          },
          {
            "code": "HUA-HUA-CUE",
            "name": "Cuenca",
            "postalCodes": [
              "09860"
            ]
          },
          {
            "code": "HUA-HUA-HUA",
            "name": "Huachocolpa",
            "postalCodes": [
              "09510"
            ]
          },
          {
            "code": "HUA-HUA-HUA",
            "name": "Huancavelíca",
            "postalCodes": [
              "09000",
              "09001"
            ]
          },
          {
            "code": "HUA-HUA-HUA",
            "name": "Huando",
            "postalCodes": [
              "09111",
              "09110"
            ]
          },
          {
            "code": "HUA-HUA-HUA",
            "name": "Huayllahuara",
            "postalCodes": [
              "09840"
            ]
          },
          {
            "code": "HUA-HUA-IZC",
            "name": "Izcuchaca",
            "postalCodes": [
              "09115"
            ]
          },
          {
            "code": "HUA-HUA-LAR",
            "name": "Laría",
            "postalCodes": [
              "09880"
            ]
          },
          {
            "code": "HUA-HUA-MAN",
            "name": "Manta",
            "postalCodes": [
              "09810"
            ]
          },
          {
            "code": "HUA-HUA-MAR",
            "name": "Mariscal Cáceres",
            "postalCodes": [
              "09120"
            ]
          },
          {
            "code": "HUA-HUA-MOY",
            "name": "Moya",
            "postalCodes": [
              "09830"
            ]
          },
          {
            "code": "HUA-HUA-NUE",
            "name": "Nuevo Occoro",
            "postalCodes": [
              "09890"
            ]
          },
          {
            "code": "HUA-HUA-PAL",
            "name": "Palca",
            "postalCodes": [
              "09105"
            ]
          },
          {
            "code": "HUA-HUA-PIL",
            "name": "Pilchaca",
            "postalCodes": [
              "09850"
            ]
          },
          {
            "code": "HUA-HUA-VIL",
            "name": "Vilca",
            "postalCodes": [
              "09820"
            ]
          },
          {
            "code": "HUA-HUA-YAU",
            "name": "Yauli",
            "postalCodes": [
              "09300",
              "09301"
            ]
          }
        ],
        "cities": [
          {
            "code": "HUA-HUA-ACO",
            "name": "Acobambilla",
            "postalCodes": [
              "09800"
            ]
          },
          {
            "code": "HUA-HUA-ACO",
            "name": "Acoria",
            "postalCodes": [
              "09100",
              "09101"
            ]
          },
          {
            "code": "HUA-HUA-ASC",
            "name": "Ascencion",
            "postalCodes": [
              "09000",
              "09001"
            ]
          },
          {
            "code": "HUA-HUA-CON",
            "name": "Conayca",
            "postalCodes": [
              "09870"
            ]
          },
          {
            "code": "HUA-HUA-CUE",
            "name": "Cuenca",
            "postalCodes": [
              "09860"
            ]
          },
          {
            "code": "HUA-HUA-HUA",
            "name": "Huachocolpa",
            "postalCodes": [
              "09510",
              "09250"
            ]
          },
          {
            "code": "HUA-HUA-HUA",
            "name": "Huancavelica",
            "postalCodes": [
              "09000",
              "09001"
            ]
          },
          {
            "code": "HUA-HUA-HUA",
            "name": "Huando",
            "postalCodes": [
              "09110",
              "09111"
            ]
          },
          {
            "code": "HUA-HUA-HUA",
            "name": "Huayllahuara",
            "postalCodes": [
              "09840"
            ]
          },
          {
            "code": "HUA-HUA-IZC",
            "name": "Izcuchaca",
            "postalCodes": [
              "09115"
            ]
          },
          {
            "code": "HUA-HUA-LAR",
            "name": "Laria",
            "postalCodes": [
              "09880"
            ]
          },
          {
            "code": "HUA-HUA-MAN",
            "name": "Manta",
            "postalCodes": [
              "09810"
            ]
          },
          {
            "code": "HUA-HUA-MAR",
            "name": "Mariscal Caceres",
            "postalCodes": [
              "09120",
              "09160",
              "09161"
            ]
          },
          {
            "code": "HUA-HUA-MOY",
            "name": "Moya",
            "postalCodes": [
              "09830"
            ]
          },
          {
            "code": "HUA-HUA-OCC",
            "name": "Occoro",
            "postalCodes": [
              "09890"
            ]
          },
          {
            "code": "HUA-HUA-PAL",
            "name": "Palca",
            "postalCodes": [
              "09105",
              "12830",
              "12831",
              "21805",
              "23550"
            ]
          },
          {
            "code": "HUA-HUA-PIL",
            "name": "Pilchaca",
            "postalCodes": [
              "09850"
            ]
          },
          {
            "code": "HUA-HUA-VIL",
            "name": "Vilca",
            "postalCodes": [
              "09820"
            ]
          },
          {
            "code": "HUA-HUA-YAU",
            "name": "Yauli",
            "postalCodes": [
              "09300",
              "09301",
              "12815",
              "12590",
              "12591"
            ]
          }
        ]
      },
      {
        "code": "HUA-HUA",
        "name": "Huaytara",
        "districts": [
          {
            "code": "HUA-HUA-AYA",
            "name": "Ayaví",
            "postalCodes": [
              "09605"
            ]
          },
          {
            "code": "HUA-HUA-COR",
            "name": "Cordova",
            "postalCodes": [
              "09635"
            ]
          },
          {
            "code": "HUA-HUA-HUA",
            "name": "Huayacundo Arma",
            "postalCodes": [
              "09660"
            ]
          },
          {
            "code": "HUA-HUA-HUA",
            "name": "Huaytará",
            "postalCodes": [
              "09600"
            ]
          },
          {
            "code": "HUA-HUA-LAR",
            "name": "Laramarca",
            "postalCodes": [
              "09640"
            ]
          },
          {
            "code": "HUA-HUA-OCO",
            "name": "Ocoyo",
            "postalCodes": [
              "09650"
            ]
          },
          {
            "code": "HUA-HUA-PIL",
            "name": "Pilpichaca",
            "postalCodes": [
              "09520"
            ]
          },
          {
            "code": "HUA-HUA-QUE",
            "name": "Querco",
            "postalCodes": [
              "09645"
            ]
          },
          {
            "code": "HUA-HUA-QUI",
            "name": "Quito Arma",
            "postalCodes": [
              "09665"
            ]
          },
          {
            "code": "HUA-HUA-SAN",
            "name": "San Antonio de Cusicancha",
            "postalCodes": [
              "09670"
            ]
          },
          {
            "code": "HUA-HUA-SAN",
            "name": "San Francisco de Sangayaico",
            "postalCodes": [
              "09620"
            ]
          },
          {
            "code": "HUA-HUA-SAN",
            "name": "San isidro",
            "postalCodes": [
              "09630"
            ]
          },
          {
            "code": "HUA-HUA-SAN",
            "name": "Santiago de Chocorvos",
            "postalCodes": [
              "09625"
            ]
          },
          {
            "code": "HUA-HUA-SAN",
            "name": "Santiago de Quirahuara",
            "postalCodes": [
              "09655"
            ]
          },
          {
            "code": "HUA-HUA-SAN",
            "name": "Santo Domingo de Capillas",
            "postalCodes": [
              "09615"
            ]
          },
          {
            "code": "HUA-HUA-TAM",
            "name": "Tambo",
            "postalCodes": [
              "09610"
            ]
          }
        ],
        "cities": [
          {
            "code": "HUA-HUA-AYA",
            "name": "Ayavi",
            "postalCodes": [
              "09605"
            ]
          },
          {
            "code": "HUA-HUA-COR",
            "name": "Cordova",
            "postalCodes": [
              "09635"
            ]
          },
          {
            "code": "HUA-HUA-CUS",
            "name": "Cusicancha",
            "postalCodes": [
              "09670"
            ]
          },
          {
            "code": "HUA-HUA-HUA",
            "name": "Huayacundo Arma",
            "postalCodes": [
              "09660"
            ]
          },
          {
            "code": "HUA-HUA-HUA",
            "name": "Huaytara",
            "postalCodes": [
              "09600"
            ]
          },
          {
            "code": "HUA-HUA-LAR",
            "name": "Laramarca",
            "postalCodes": [
              "09640"
            ]
          },
          {
            "code": "HUA-HUA-OCO",
            "name": "Ocoyo",
            "postalCodes": [
              "09650"
            ]
          },
          {
            "code": "HUA-HUA-PIL",
            "name": "Pilpichaca",
            "postalCodes": [
              "09520"
            ]
          },
          {
            "code": "HUA-HUA-QUE",
            "name": "Querco",
            "postalCodes": [
              "09645"
            ]
          },
          {
            "code": "HUA-HUA-QUI",
            "name": "Quito Arma",
            "postalCodes": [
              "09665"
            ]
          },
          {
            "code": "HUA-HUA-SAN",
            "name": "San Francisco de Sangallaico",
            "postalCodes": [
              "09620"
            ]
          },
          {
            "code": "HUA-HUA-SAN",
            "name": "San Juan de Huirpacancha",
            "postalCodes": [
              "09630"
            ]
          },
          {
            "code": "HUA-HUA-SAN",
            "name": "Santiago de Chocorvos",
            "postalCodes": [
              "09625"
            ]
          },
          {
            "code": "HUA-HUA-SAN",
            "name": "Santiago de Quirahuara",
            "postalCodes": [
              "09655"
            ]
          },
          {
            "code": "HUA-HUA-SAN",
            "name": "Santo Domingo de Capillas",
            "postalCodes": [
              "09615"
            ]
          },
          {
            "code": "AYA-LA -TAM",
            "name": "Tambo",
            "postalCodes": [
              "05200",
              "05201",
              "09610"
            ]
          }
        ]
      },
      {
        "code": "HUA-TAY",
        "name": "Tayacaja",
        "districts": [
          {
            "code": "HUA-TAY-ACO",
            "name": "Acostambo",
            "postalCodes": [
              "09125"
            ]
          },
          {
            "code": "HUA-TAY-ACR",
            "name": "Acraquia",
            "postalCodes": [
              "09146",
              "09145"
            ]
          },
          {
            "code": "HUA-TAY-AHU",
            "name": "Ahuaycha",
            "postalCodes": [
              "09151",
              "09150"
            ]
          },
          {
            "code": "HUA-TAY-COL",
            "name": "Colcabamba",
            "postalCodes": [
              "09321",
              "09320"
            ]
          },
          {
            "code": "HUA-TAY-DAN",
            "name": "Daniel Hernandez",
            "postalCodes": [
              "09161",
              "09160"
            ]
          },
          {
            "code": "HUA-TAY-HUA",
            "name": "Huachocolpa",
            "postalCodes": [
              "09250"
            ]
          },
          {
            "code": "HUA-TAY-HUA",
            "name": "Huaribamba",
            "postalCodes": [
              "09140",
              "09141"
            ]
          },
          {
            "code": "HUA-TAY-PAM",
            "name": "Pampas",
            "postalCodes": [
              "09155",
              "09156"
            ]
          },
          {
            "code": "HUA-TAY-PAZ",
            "name": "Pazos",
            "postalCodes": [
              "09135",
              "09136"
            ]
          },
          {
            "code": "HUA-TAY-QUI",
            "name": "Quishuar",
            "postalCodes": [
              "09210"
            ]
          },
          {
            "code": "HUA-TAY-SAL",
            "name": "Salcabamba",
            "postalCodes": [
              "09200",
              "09201"
            ]
          },
          {
            "code": "HUA-TAY-SAL",
            "name": "Salcahuasi",
            "postalCodes": [
              "09220"
            ]
          },
          {
            "code": "HUA-TAY-SAN",
            "name": "San Marcos de Rocchac",
            "postalCodes": [
              "09230"
            ]
          },
          {
            "code": "HUA-TAY-SUR",
            "name": "Surcubamba",
            "postalCodes": [
              "09241",
              "09240"
            ]
          },
          {
            "code": "HUA-TAY-TIN",
            "name": "Tintay Puncu",
            "postalCodes": [
              "09260",
              "09261"
            ]
          },
          {
            "code": "HUA-TAY-ÑAH",
            "name": "Ñahuimpuquio",
            "postalCodes": [
              "09130"
            ]
          }
        ],
        "cities": [
          {
            "code": "HUA-TAY-ACO",
            "name": "Acostambo",
            "postalCodes": [
              "09125"
            ]
          },
          {
            "code": "HUA-TAY-ACR",
            "name": "Acraquia",
            "postalCodes": [
              "09145",
              "09146"
            ]
          },
          {
            "code": "HUA-TAY-AHU",
            "name": "Ahuaycha",
            "postalCodes": [
              "09150",
              "09151"
            ]
          },
          {
            "code": "ANC-HUA-COL",
            "name": "Colcabamba",
            "postalCodes": [
              "02695",
              "03500",
              "09320",
              "09321"
            ]
          },
          {
            "code": "HUA-HUA-HUA",
            "name": "Huachocolpa",
            "postalCodes": [
              "09510",
              "09250"
            ]
          },
          {
            "code": "HUA-TAY-HUA",
            "name": "Huaribamba",
            "postalCodes": [
              "09140",
              "09141"
            ]
          },
          {
            "code": "HUA-HUA-MAR",
            "name": "Mariscal Caceres",
            "postalCodes": [
              "09120",
              "09160",
              "09161"
            ]
          },
          {
            "code": "ANC-HUA-PAM",
            "name": "Pampas",
            "postalCodes": [
              "02605",
              "02865",
              "02866",
              "05290",
              "09155",
              "09156"
            ]
          },
          {
            "code": "HUA-TAY-PAZ",
            "name": "Pazos",
            "postalCodes": [
              "09135",
              "09136"
            ]
          },
          {
            "code": "HUA-TAY-QUI",
            "name": "Quishuar",
            "postalCodes": [
              "09210"
            ]
          },
          {
            "code": "HUA-TAY-SAL",
            "name": "Salcabamba",
            "postalCodes": [
              "09200",
              "09201"
            ]
          },
          {
            "code": "HUA-TAY-SAL",
            "name": "Salcahuasi",
            "postalCodes": [
              "09220"
            ]
          },
          {
            "code": "HUA-TAY-SAN",
            "name": "San Marcos de Rocchac",
            "postalCodes": [
              "09230"
            ]
          },
          {
            "code": "HUA-TAY-SUR",
            "name": "Surcubamba",
            "postalCodes": [
              "09240",
              "09241"
            ]
          },
          {
            "code": "APU-AYM-TIN",
            "name": "Tintay",
            "postalCodes": [
              "03410",
              "09260",
              "09261"
            ]
          },
          {
            "code": "HUA-TAY-ÑAH",
            "name": "Ñahuimpuquio",
            "postalCodes": [
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
        "code": "HUA-AMB",
        "name": "Ambo",
        "districts": [
          {
            "code": "HUA-AMB-AMB",
            "name": "Ambo",
            "postalCodes": [
              "10420",
              "10421"
            ]
          },
          {
            "code": "HUA-AMB-CAY",
            "name": "Cayna",
            "postalCodes": [
              "10460"
            ]
          },
          {
            "code": "HUA-AMB-COL",
            "name": "Colpas",
            "postalCodes": [
              "10470"
            ]
          },
          {
            "code": "HUA-AMB-CON",
            "name": "Conchamarca",
            "postalCodes": [
              "10401",
              "10400"
            ]
          },
          {
            "code": "HUA-AMB-HUA",
            "name": "Huacar",
            "postalCodes": [
              "10441",
              "10440"
            ]
          },
          {
            "code": "HUA-AMB-SAN",
            "name": "San Francisco",
            "postalCodes": [
              "10450"
            ]
          },
          {
            "code": "HUA-AMB-SAN",
            "name": "San Rafael",
            "postalCodes": [
              "10430",
              "10431"
            ]
          },
          {
            "code": "HUA-AMB-TOM",
            "name": "Tomay Kichwa",
            "postalCodes": [
              "10410"
            ]
          }
        ],
        "cities": [
          {
            "code": "HUA-AMB-AMB",
            "name": "Ambo",
            "postalCodes": [
              "10420",
              "10421"
            ]
          },
          {
            "code": "HUA-AMB-CAY",
            "name": "Cayna",
            "postalCodes": [
              "10460"
            ]
          },
          {
            "code": "HUA-AMB-COL",
            "name": "Colpas",
            "postalCodes": [
              "10470"
            ]
          },
          {
            "code": "HUA-AMB-CON",
            "name": "Conchamarca",
            "postalCodes": [
              "10400",
              "10401"
            ]
          },
          {
            "code": "HUA-AMB-HUA",
            "name": "Huacar",
            "postalCodes": [
              "10440",
              "10441"
            ]
          },
          {
            "code": "HUA-AMB-MOS",
            "name": "Mosca",
            "postalCodes": [
              "10450"
            ]
          },
          {
            "code": "HUA-AMB-SAN",
            "name": "San Rafael",
            "postalCodes": [
              "10430",
              "10431",
              "22470",
              "22471"
            ]
          },
          {
            "code": "HUA-AMB-TOM",
            "name": "Tomay Kichwa",
            "postalCodes": [
              "10410"
            ]
          }
        ]
      },
      {
        "code": "HUA-DOS",
        "name": "Dos de Mayo",
        "districts": [
          {
            "code": "HUA-DOS-CHU",
            "name": "Chuquis",
            "postalCodes": [
              "10741",
              "10740"
            ]
          },
          {
            "code": "HUA-DOS-LA ",
            "name": "La Unión",
            "postalCodes": [
              "10620",
              "10621"
            ]
          },
          {
            "code": "HUA-DOS-MAR",
            "name": "Marias",
            "postalCodes": [
              "10760",
              "10761"
            ]
          },
          {
            "code": "HUA-DOS-PAC",
            "name": "Pachas",
            "postalCodes": [
              "10600",
              "10601"
            ]
          },
          {
            "code": "HUA-DOS-QUI",
            "name": "Quivilla",
            "postalCodes": [
              "10755"
            ]
          },
          {
            "code": "HUA-DOS-RIP",
            "name": "Ripan",
            "postalCodes": [
              "10611",
              "10610"
            ]
          },
          {
            "code": "HUA-DOS-SHU",
            "name": "Shunqui",
            "postalCodes": [
              "10605"
            ]
          },
          {
            "code": "HUA-DOS-SIL",
            "name": "Sillapata",
            "postalCodes": [
              "10615"
            ]
          },
          {
            "code": "HUA-DOS-YAN",
            "name": "Yanas",
            "postalCodes": [
              "10745"
            ]
          }
        ],
        "cities": [
          {
            "code": "HUA-DOS-CHU",
            "name": "Chuquis",
            "postalCodes": [
              "10740",
              "10741"
            ]
          },
          {
            "code": "HUA-DOS-LA ",
            "name": "La Union",
            "postalCodes": [
              "10620",
              "10621",
              "20620",
              "20621"
            ]
          },
          {
            "code": "HUA-DOS-MAR",
            "name": "Marias",
            "postalCodes": [
              "10760",
              "10761"
            ]
          },
          {
            "code": "HUA-DOS-PAC",
            "name": "Pachas",
            "postalCodes": [
              "10600",
              "10601"
            ]
          },
          {
            "code": "HUA-DOS-QUI",
            "name": "Quivilla",
            "postalCodes": [
              "10755"
            ]
          },
          {
            "code": "HUA-DOS-RIP",
            "name": "Ripan",
            "postalCodes": [
              "10610",
              "10611"
            ]
          },
          {
            "code": "HUA-DOS-SHU",
            "name": "Shunqui",
            "postalCodes": [
              "10605"
            ]
          },
          {
            "code": "HUA-DOS-SIL",
            "name": "Sillapata",
            "postalCodes": [
              "10615"
            ]
          },
          {
            "code": "HUA-DOS-YAN",
            "name": "Yanas",
            "postalCodes": [
              "10745"
            ]
          }
        ]
      },
      {
        "code": "HUA-HUA",
        "name": "Huacaybamba",
        "districts": [
          {
            "code": "HUA-HUA-CAN",
            "name": "Canchabamba",
            "postalCodes": [
              "10860"
            ]
          },
          {
            "code": "HUA-HUA-COC",
            "name": "Cochabamba",
            "postalCodes": [
              "10830"
            ]
          },
          {
            "code": "HUA-HUA-HUA",
            "name": "Huacaybamba",
            "postalCodes": [
              "10841",
              "10840"
            ]
          },
          {
            "code": "HUA-HUA-PIN",
            "name": "Pinra",
            "postalCodes": [
              "10850",
              "10851"
            ]
          }
        ],
        "cities": [
          {
            "code": "HUA-HUA-CAN",
            "name": "Canchabamba",
            "postalCodes": [
              "10860"
            ]
          },
          {
            "code": "ANC-HUA-COC",
            "name": "Cochabamba",
            "postalCodes": [
              "02690",
              "06650",
              "06651",
              "10830"
            ]
          },
          {
            "code": "HUA-HUA-HUA",
            "name": "Huacaybamba",
            "postalCodes": [
              "10840",
              "10841"
            ]
          },
          {
            "code": "HUA-HUA-PIN",
            "name": "Pinra",
            "postalCodes": [
              "10850",
              "10851"
            ]
          }
        ]
      },
      {
        "code": "HUA-HUA",
        "name": "Huamalies",
        "districts": [
          {
            "code": "HUA-HUA-ARA",
            "name": "Arancay",
            "postalCodes": [
              "10820"
            ]
          },
          {
            "code": "HUA-HUA-CHA",
            "name": "Chavín de Pariarca",
            "postalCodes": [
              "10775"
            ]
          },
          {
            "code": "HUA-HUA-JAC",
            "name": "Jacas Grande",
            "postalCodes": [
              "10771",
              "10770"
            ]
          },
          {
            "code": "HUA-HUA-JIR",
            "name": "Jircan",
            "postalCodes": [
              "10810"
            ]
          },
          {
            "code": "HUA-HUA-LLA",
            "name": "Llata",
            "postalCodes": [
              "10660",
              "10641"
            ]
          },
          {
            "code": "HUA-HUA-MIR",
            "name": "Miraflores",
            "postalCodes": [
              "10680"
            ]
          },
          {
            "code": "HUA-HUA-MON",
            "name": "Monzón",
            "postalCodes": [
              "10800",
              "10801"
            ]
          },
          {
            "code": "HUA-HUA-PUN",
            "name": "Punchao",
            "postalCodes": [
              "10685"
            ]
          },
          {
            "code": "HUA-HUA-PUÑ",
            "name": "Puños",
            "postalCodes": [
              "10670"
            ]
          },
          {
            "code": "HUA-HUA-SIN",
            "name": "Singa",
            "postalCodes": [
              "10690"
            ]
          },
          {
            "code": "HUA-HUA-TAN",
            "name": "Tantamayo",
            "postalCodes": [
              "10780"
            ]
          }
        ],
        "cities": [
          {
            "code": "HUA-HUA-ARA",
            "name": "Arancay",
            "postalCodes": [
              "10820"
            ]
          },
          {
            "code": "HUA-HUA-CHA",
            "name": "Chavin de Pariarca",
            "postalCodes": [
              "10775"
            ]
          },
          {
            "code": "HUA-HUA-JAC",
            "name": "Jacas Grande",
            "postalCodes": [
              "10770",
              "10771"
            ]
          },
          {
            "code": "HUA-HUA-JIR",
            "name": "Jircan",
            "postalCodes": [
              "10810"
            ]
          },
          {
            "code": "HUA-HUA-LLA",
            "name": "Llata",
            "postalCodes": [
              "10641",
              "10660"
            ]
          },
          {
            "code": "ARE-ARE-MIR",
            "name": "Miraflores",
            "postalCodes": [
              "04001",
              "04004",
              "10680",
              "15046",
              "15047",
              "15048",
              "15073",
              "15074",
              "15076",
              "15792"
            ]
          },
          {
            "code": "HUA-HUA-MON",
            "name": "Monzon",
            "postalCodes": [
              "10800",
              "10801"
            ]
          },
          {
            "code": "HUA-HUA-PUN",
            "name": "Punchao",
            "postalCodes": [
              "10685"
            ]
          },
          {
            "code": "HUA-HUA-PUÑ",
            "name": "Puños",
            "postalCodes": [
              "10670"
            ]
          },
          {
            "code": "HUA-HUA-SIN",
            "name": "Singa",
            "postalCodes": [
              "10690"
            ]
          },
          {
            "code": "HUA-HUA-TAN",
            "name": "Tantamayo",
            "postalCodes": [
              "10780"
            ]
          }
        ]
      },
      {
        "code": "HUA-HUA",
        "name": "Huanuco",
        "districts": [
          {
            "code": "HUA-HUA-AMA",
            "name": "Amarilis",
            "postalCodes": [
              "10000",
              "10002",
              "10003"
            ]
          },
          {
            "code": "HUA-HUA-CHI",
            "name": "Chinchao",
            "postalCodes": [
              "10110",
              "10111"
            ]
          },
          {
            "code": "HUA-HUA-CHU",
            "name": "Churubamba",
            "postalCodes": [
              "10180",
              "10181"
            ]
          },
          {
            "code": "HUA-HUA-HUA",
            "name": "Huanuco",
            "postalCodes": [
              "10000",
              "10003",
              "10001"
            ]
          },
          {
            "code": "HUA-HUA-MAR",
            "name": "Margos",
            "postalCodes": [
              "10520",
              "10521"
            ]
          },
          {
            "code": "HUA-HUA-PIL",
            "name": "Pillco Marca",
            "postalCodes": [
              "10000",
              "10003"
            ]
          },
          {
            "code": "HUA-HUA-QUI",
            "name": "Quisqui",
            "postalCodes": [
              "10701",
              "10700"
            ]
          },
          {
            "code": "HUA-HUA-SAN",
            "name": "San Francisco de Cayran",
            "postalCodes": [
              "10031",
              "10000"
            ]
          },
          {
            "code": "HUA-HUA-SAN",
            "name": "San Pedro de Chaulan",
            "postalCodes": [
              "10511",
              "10510"
            ]
          },
          {
            "code": "HUA-HUA-SAN",
            "name": "Santa María del Valle",
            "postalCodes": [
              "10101",
              "10100"
            ]
          },
          {
            "code": "HUA-HUA-YUR",
            "name": "Yurumayo",
            "postalCodes": [
              "10500"
            ]
          }
        ],
        "cities": [
          {
            "code": "CUZ-ACO-ACO",
            "name": "Acomayo",
            "postalCodes": [
              "08550",
              "08551",
              "10110",
              "10111"
            ]
          },
          {
            "code": "HUA-HUA-CAY",
            "name": "Cayhuayna",
            "postalCodes": [
              "10000",
              "10003"
            ]
          },
          {
            "code": "HUA-HUA-CAY",
            "name": "Cayran",
            "postalCodes": [
              "10000",
              "10031"
            ]
          },
          {
            "code": "HUA-HUA-CHA",
            "name": "Chaulan",
            "postalCodes": [
              "10510",
              "10511"
            ]
          },
          {
            "code": "HUA-HUA-CHU",
            "name": "Churubamba",
            "postalCodes": [
              "10180",
              "10181"
            ]
          },
          {
            "code": "HUA-HUA-HUA",
            "name": "Huancapallac",
            "postalCodes": [
              "10700",
              "10701"
            ]
          },
          {
            "code": "HUA-HUA-HUA",
            "name": "Huanuco",
            "postalCodes": [
              "10000",
              "10001",
              "10003"
            ]
          },
          {
            "code": "HUA-HUA-MAR",
            "name": "Margos",
            "postalCodes": [
              "10520",
              "10521"
            ]
          },
          {
            "code": "HUA-CHU-PAU",
            "name": "Paucarbamba",
            "postalCodes": [
              "09330",
              "09331",
              "10000",
              "10002",
              "10003"
            ]
          },
          {
            "code": "HUA-HUA-SAN",
            "name": "Santa Maria del Valle",
            "postalCodes": [
              "10100",
              "10101"
            ]
          },
          {
            "code": "HUA-HUA-YAR",
            "name": "Yarumayo",
            "postalCodes": [
              "10500"
            ]
          }
        ]
      },
      {
        "code": "HUA-LAU",
        "name": "Lauricocha",
        "districts": [
          {
            "code": "HUA-LAU-BAÑ",
            "name": "Baños",
            "postalCodes": [
              "10640",
              "10631"
            ]
          },
          {
            "code": "HUA-LAU-JES",
            "name": "Jesús",
            "postalCodes": [
              "10531",
              "10530"
            ]
          },
          {
            "code": "HUA-LAU-JIV",
            "name": "Jivia",
            "postalCodes": [
              "10550"
            ]
          },
          {
            "code": "HUA-LAU-QUE",
            "name": "Queropalca",
            "postalCodes": [
              "10650"
            ]
          },
          {
            "code": "HUA-LAU-RON",
            "name": "Rondos",
            "postalCodes": [
              "10626",
              "10630"
            ]
          },
          {
            "code": "HUA-LAU-SAN",
            "name": "San Francisco de Asís",
            "postalCodes": [
              "10560"
            ]
          },
          {
            "code": "HUA-LAU-SAN",
            "name": "San Miguel de Cauri",
            "postalCodes": [
              "10541",
              "10540"
            ]
          }
        ],
        "cities": [
          {
            "code": "HUA-LAU-BAÑ",
            "name": "Baños",
            "postalCodes": [
              "10631",
              "10640"
            ]
          },
          {
            "code": "HUA-LAU-CAU",
            "name": "Cauri",
            "postalCodes": [
              "10540",
              "10541"
            ]
          },
          {
            "code": "HUA-LAU-HUA",
            "name": "Huarin",
            "postalCodes": [
              "10560"
            ]
          },
          {
            "code": "CAJ-CAJ-JES",
            "name": "Jesus",
            "postalCodes": [
              "06370",
              "06371",
              "10530",
              "10531"
            ]
          },
          {
            "code": "HUA-LAU-JIV",
            "name": "Jivia",
            "postalCodes": [
              "10550"
            ]
          },
          {
            "code": "HUA-LAU-QUE",
            "name": "Queropalca",
            "postalCodes": [
              "10650"
            ]
          },
          {
            "code": "HUA-LAU-RON",
            "name": "Rondos",
            "postalCodes": [
              "10626",
              "10630"
            ]
          }
        ]
      },
      {
        "code": "HUA-LEO",
        "name": "Leoncio Prado",
        "districts": [
          {
            "code": "HUA-LEO-DAN",
            "name": "Daniel Alomias Robles",
            "postalCodes": [
              "10150",
              "10151"
            ]
          },
          {
            "code": "HUA-LEO-HER",
            "name": "Hermilio Valdizán",
            "postalCodes": [
              "10160"
            ]
          },
          {
            "code": "HUA-LEO-JOS",
            "name": "José Crespo y Castillo",
            "postalCodes": [
              "10171",
              "10170"
            ]
          },
          {
            "code": "HUA-LEO-LUY",
            "name": "Luyando",
            "postalCodes": [
              "10140",
              "10141"
            ]
          },
          {
            "code": "HUA-LEO-MAR",
            "name": "Mariano Damaso Beraún",
            "postalCodes": [
              "10120",
              "10121"
            ]
          },
          {
            "code": "HUA-LEO-RUP",
            "name": "Rupa Rupa",
            "postalCodes": [
              "10130",
              "10131"
            ]
          }
        ],
        "cities": [
          {
            "code": "HUA-LEO-AUC",
            "name": "Aucayacu",
            "postalCodes": [
              "10170",
              "10171"
            ]
          },
          {
            "code": "HUA-LEO-DAN",
            "name": "Daniel Alomias Robles (Pumahuasi)",
            "postalCodes": [
              "10150",
              "10151"
            ]
          },
          {
            "code": "HUA-LEO-HER",
            "name": "Hermilio Valdizan",
            "postalCodes": [
              "10160"
            ]
          },
          {
            "code": "HUA-LEO-LAS",
            "name": "Las Palmas",
            "postalCodes": [
              "10120",
              "10121"
            ]
          },
          {
            "code": "HUA-LEO-NAR",
            "name": "Naranjillo",
            "postalCodes": [
              "10140",
              "10141"
            ]
          },
          {
            "code": "HUA-LEO-TIN",
            "name": "Tingo Maria",
            "postalCodes": [
              "10130",
              "10131"
            ]
          }
        ]
      },
      {
        "code": "HUA-MAR",
        "name": "Marañon",
        "districts": [
          {
            "code": "HUA-MAR-CHO",
            "name": "Cholón",
            "postalCodes": [
              "10890",
              "10891"
            ]
          },
          {
            "code": "HUA-MAR-HUA",
            "name": "Huacrachuco",
            "postalCodes": [
              "10880",
              "10881"
            ]
          },
          {
            "code": "HUA-MAR-SAN",
            "name": "San Buenaventura",
            "postalCodes": [
              "10870"
            ]
          }
        ],
        "cities": [
          {
            "code": "HUA-MAR-HUA",
            "name": "Huacrachuco",
            "postalCodes": [
              "10880",
              "10881"
            ]
          },
          {
            "code": "HUA-MAR-SAN",
            "name": "San Buenaventura",
            "postalCodes": [
              "10870",
              "15350"
            ]
          },
          {
            "code": "HUA-MAR-SAN",
            "name": "San Pedro de Chonta",
            "postalCodes": [
              "10890",
              "10891"
            ]
          }
        ]
      },
      {
        "code": "HUA-PAC",
        "name": "Pachitea",
        "districts": [
          {
            "code": "HUA-PAC-CHA",
            "name": "Chaglla",
            "postalCodes": [
              "10231",
              "10230"
            ]
          },
          {
            "code": "HUA-PAC-MOL",
            "name": "Molino",
            "postalCodes": [
              "10210",
              "10211"
            ]
          },
          {
            "code": "HUA-PAC-PAN",
            "name": "Panao",
            "postalCodes": [
              "10220",
              "10221"
            ]
          },
          {
            "code": "HUA-PAC-UMA",
            "name": "Umari",
            "postalCodes": [
              "10200",
              "10201"
            ]
          }
        ],
        "cities": [
          {
            "code": "HUA-PAC-CHA",
            "name": "Chaglla",
            "postalCodes": [
              "10230",
              "10231"
            ]
          },
          {
            "code": "HUA-PAC-MOL",
            "name": "Molinos",
            "postalCodes": [
              "10210",
              "10211",
              "12180"
            ]
          },
          {
            "code": "HUA-PAC-PAN",
            "name": "Panao",
            "postalCodes": [
              "10220",
              "10221"
            ]
          },
          {
            "code": "HUA-PAC-UMA",
            "name": "Umari (Tambillo)",
            "postalCodes": [
              "10200",
              "10201"
            ]
          }
        ]
      },
      {
        "code": "HUA-PUE",
        "name": "Puerto Inca",
        "districts": [
          {
            "code": "HUA-PUE-COD",
            "name": "Codo del Pozuzo",
            "postalCodes": [
              "10240",
              "10241"
            ]
          },
          {
            "code": "HUA-PUE-HON",
            "name": "Honoría",
            "postalCodes": [
              "10350",
              "10351"
            ]
          },
          {
            "code": "HUA-PUE-PUE",
            "name": "Puerto Inca",
            "postalCodes": [
              "10261",
              "10260"
            ]
          },
          {
            "code": "HUA-PUE-TOU",
            "name": "Tournavista",
            "postalCodes": [
              "10301",
              "10300"
            ]
          },
          {
            "code": "HUA-PUE-YUY",
            "name": "Yuyapichis",
            "postalCodes": [
              "10251",
              "10250"
            ]
          }
        ],
        "cities": [
          {
            "code": "HUA-PUE-COD",
            "name": "Codo del Pozuzo",
            "postalCodes": [
              "10240",
              "10241"
            ]
          },
          {
            "code": "HUA-PUE-HON",
            "name": "Honoria",
            "postalCodes": [
              "10350",
              "10351"
            ]
          },
          {
            "code": "HUA-PUE-PUE",
            "name": "Puerto Inca",
            "postalCodes": [
              "10260",
              "10261"
            ]
          },
          {
            "code": "HUA-PUE-TOU",
            "name": "Tournavista",
            "postalCodes": [
              "10300",
              "10301"
            ]
          },
          {
            "code": "HUA-PUE-YUY",
            "name": "Yuyapichis",
            "postalCodes": [
              "10250",
              "10251"
            ]
          }
        ]
      },
      {
        "code": "HUA-YAR",
        "name": "Yarowilca",
        "districts": [
          {
            "code": "HUA-YAR-APA",
            "name": "Aparicio Pomares",
            "postalCodes": [
              "10731",
              "10730"
            ]
          },
          {
            "code": "HUA-YAR-CAH",
            "name": "Cahuac",
            "postalCodes": [
              "10590"
            ]
          },
          {
            "code": "HUA-YAR-CHA",
            "name": "Chacabamba",
            "postalCodes": [
              "10580"
            ]
          },
          {
            "code": "HUA-YAR-CHA",
            "name": "Chavinillo",
            "postalCodes": [
              "10711",
              "10710"
            ]
          },
          {
            "code": "HUA-YAR-CHO",
            "name": "Choras",
            "postalCodes": [
              "10570"
            ]
          },
          {
            "code": "HUA-YAR-JAC",
            "name": "Jacas Chico",
            "postalCodes": [
              "10705"
            ]
          },
          {
            "code": "HUA-YAR-OBA",
            "name": "Obas",
            "postalCodes": [
              "10721",
              "10720"
            ]
          },
          {
            "code": "HUA-YAR-PAM",
            "name": "Pampamarca",
            "postalCodes": [
              "10750"
            ]
          }
        ],
        "cities": [
          {
            "code": "HUA-YAR-CAH",
            "name": "Cahuac",
            "postalCodes": [
              "10590"
            ]
          },
          {
            "code": "HUA-YAR-CHA",
            "name": "Chacabamba",
            "postalCodes": [
              "10580"
            ]
          },
          {
            "code": "HUA-YAR-CHA",
            "name": "Chavinillo",
            "postalCodes": [
              "10710",
              "10711"
            ]
          },
          {
            "code": "HUA-YAR-CHO",
            "name": "Choras",
            "postalCodes": [
              "10570"
            ]
          },
          {
            "code": "HUA-YAR-CHU",
            "name": "Chupan",
            "postalCodes": [
              "10730",
              "10731"
            ]
          },
          {
            "code": "HUA-YAR-OBA",
            "name": "Obas",
            "postalCodes": [
              "10720",
              "10721"
            ]
          },
          {
            "code": "CUZ-CAN-PAM",
            "name": "Pampamarca",
            "postalCodes": [
              "08260",
              "10750"
            ]
          },
          {
            "code": "HUA-YAR-SAN",
            "name": "San Cristobal de Jacas Chico",
            "postalCodes": [
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
        "code": "ICA-CHI",
        "name": "Chincha",
        "districts": [
          {
            "code": "ICA-CHI-ALT",
            "name": "Alto Larán",
            "postalCodes": [
              "11771",
              "11770"
            ]
          },
          {
            "code": "ICA-CHI-CHA",
            "name": "Chavín",
            "postalCodes": [
              "11780"
            ]
          },
          {
            "code": "ICA-CHI-CHI",
            "name": "Chincha Alta",
            "postalCodes": [
              "11702",
              "11701",
              "11703"
            ]
          },
          {
            "code": "ICA-CHI-CHI",
            "name": "Chincha Baja",
            "postalCodes": [
              "11750",
              "11751"
            ]
          },
          {
            "code": "ICA-CHI-EL ",
            "name": "El Carmen",
            "postalCodes": [
              "11740",
              "11741"
            ]
          },
          {
            "code": "ICA-CHI-GRO",
            "name": "Grocio Prado",
            "postalCodes": [
              "11703",
              "11700"
            ]
          },
          {
            "code": "ICA-CHI-PUE",
            "name": "Pueblo Nuevo",
            "postalCodes": [
              "11701",
              "11703"
            ]
          },
          {
            "code": "ICA-CHI-SAN",
            "name": "San Juan de Yanac",
            "postalCodes": [
              "11850"
            ]
          },
          {
            "code": "ICA-CHI-SAN",
            "name": "San Pedro de Huacarpana",
            "postalCodes": [
              "11800"
            ]
          },
          {
            "code": "ICA-CHI-SUN",
            "name": "Sunampe",
            "postalCodes": [
              "11702",
              "11700"
            ]
          },
          {
            "code": "ICA-CHI-TAM",
            "name": "Tambo de Mora",
            "postalCodes": [
              "11760"
            ]
          }
        ],
        "cities": [
          {
            "code": "ICA-CHI-ALT",
            "name": "Alto Laran",
            "postalCodes": [
              "11770",
              "11771"
            ]
          },
          {
            "code": "ICA-CHI-CHA",
            "name": "Chavin",
            "postalCodes": [
              "11780"
            ]
          },
          {
            "code": "ICA-CHI-CHI",
            "name": "Chincha Alta",
            "postalCodes": [
              "11701",
              "11702",
              "11703"
            ]
          },
          {
            "code": "ICA-CHI-CHI",
            "name": "Chincha Baja",
            "postalCodes": [
              "11750",
              "11751"
            ]
          },
          {
            "code": "ICA-CHI-EL ",
            "name": "El Carmen",
            "postalCodes": [
              "11740",
              "11741"
            ]
          },
          {
            "code": "ICA-ICA-PUE",
            "name": "Pueblo Nuevo",
            "postalCodes": [
              "11200",
              "11701",
              "11703",
              "13850",
              "13851",
              "14310",
              "14311",
              "18610",
              "18611"
            ]
          },
          {
            "code": "ICA-CHI-SAN",
            "name": "San Juan de Yanac",
            "postalCodes": [
              "11850"
            ]
          },
          {
            "code": "AYA-LUC-SAN",
            "name": "San Pedro",
            "postalCodes": [
              "05510",
              "08245",
              "11700",
              "11703",
              "15641"
            ]
          },
          {
            "code": "ICA-CHI-SAN",
            "name": "San Pedro de Huacarpana",
            "postalCodes": [
              "11800"
            ]
          },
          {
            "code": "ICA-CHI-SUN",
            "name": "Sunampe",
            "postalCodes": [
              "11700",
              "11702"
            ]
          },
          {
            "code": "ICA-CHI-TAM",
            "name": "Tambo de Mora",
            "postalCodes": [
              "11760"
            ]
          }
        ]
      },
      {
        "code": "ICA-ICA",
        "name": "Ica",
        "districts": [
          {
            "code": "ICA-ICA-ICA",
            "name": "Ica",
            "postalCodes": [
              "11004",
              "11002",
              "11001",
              "11000"
            ]
          },
          {
            "code": "ICA-ICA-LA ",
            "name": "La Tinguiña",
            "postalCodes": [
              "11003",
              "11002",
              "11000"
            ]
          },
          {
            "code": "ICA-ICA-LOS",
            "name": "Los Aquijes",
            "postalCodes": [
              "11061",
              "11000"
            ]
          },
          {
            "code": "ICA-ICA-OCU",
            "name": "Ocucaje",
            "postalCodes": [
              "11240"
            ]
          },
          {
            "code": "ICA-ICA-PAC",
            "name": "Pachacutec",
            "postalCodes": [
              "11221",
              "11220"
            ]
          },
          {
            "code": "ICA-ICA-PAR",
            "name": "Parcona",
            "postalCodes": [
              "11003",
              "11001",
              "11000"
            ]
          },
          {
            "code": "ICA-ICA-PUE",
            "name": "Pueblo Nuevo",
            "postalCodes": [
              "11200"
            ]
          },
          {
            "code": "ICA-ICA-SAL",
            "name": "Salas",
            "postalCodes": [
              "11500",
              "11501"
            ]
          },
          {
            "code": "ICA-ICA-SAN",
            "name": "San José de los Molinos",
            "postalCodes": [
              "11101",
              "11100"
            ]
          },
          {
            "code": "ICA-ICA-SAN",
            "name": "San Juan Bautista",
            "postalCodes": [
              "11002",
              "11000"
            ]
          },
          {
            "code": "ICA-ICA-SAN",
            "name": "Santiago",
            "postalCodes": [
              "11231",
              "11230"
            ]
          },
          {
            "code": "ICA-ICA-SUB",
            "name": "Subtanjalla",
            "postalCodes": [
              "11004",
              "11000"
            ]
          },
          {
            "code": "ICA-ICA-TAT",
            "name": "Tate",
            "postalCodes": [
              "11210"
            ]
          },
          {
            "code": "ICA-ICA-YAU",
            "name": "Yauca del Rosario",
            "postalCodes": [
              "11260"
            ]
          }
        ],
        "cities": [
          {
            "code": "ICA-ICA-GUA",
            "name": "Guadalupe",
            "postalCodes": [
              "11500",
              "11501",
              "13840",
              "13841"
            ]
          },
          {
            "code": "ICA-ICA-ICA",
            "name": "Ica",
            "postalCodes": [
              "11000",
              "11001",
              "11002",
              "11004"
            ]
          },
          {
            "code": "ICA-ICA-LA ",
            "name": "La Tinguiña",
            "postalCodes": [
              "11000",
              "11002",
              "11003"
            ]
          },
          {
            "code": "ICA-ICA-LOS",
            "name": "Los Aquijes",
            "postalCodes": [
              "11000",
              "11061"
            ]
          },
          {
            "code": "ICA-ICA-OCU",
            "name": "Ocucaje",
            "postalCodes": [
              "11240"
            ]
          },
          {
            "code": "ICA-ICA-PAM",
            "name": "Pampa de Tate",
            "postalCodes": [
              "11220",
              "11221"
            ]
          },
          {
            "code": "ICA-ICA-PAM",
            "name": "Pampahuasi",
            "postalCodes": [
              "11260"
            ]
          },
          {
            "code": "ICA-ICA-PAR",
            "name": "Parcona",
            "postalCodes": [
              "11000",
              "11001",
              "11003"
            ]
          },
          {
            "code": "ICA-ICA-PUE",
            "name": "Pueblo Nuevo",
            "postalCodes": [
              "11200",
              "11701",
              "11703",
              "13850",
              "13851",
              "14310",
              "14311",
              "18610",
              "18611"
            ]
          },
          {
            "code": "ICA-ICA-SAN",
            "name": "San Jose de los Molinos",
            "postalCodes": [
              "11100",
              "11101"
            ]
          },
          {
            "code": "AYA-HUA-SAN",
            "name": "San Juan Bautista",
            "postalCodes": [
              "05000",
              "05001",
              "05002",
              "11000",
              "11002"
            ]
          },
          {
            "code": "CUZ-CUZ-SAN",
            "name": "Santiago",
            "postalCodes": [
              "08000",
              "08001",
              "08006",
              "08007",
              "11230",
              "11231"
            ]
          },
          {
            "code": "ICA-ICA-SUB",
            "name": "Subtanjalla",
            "postalCodes": [
              "11000",
              "11004"
            ]
          },
          {
            "code": "ICA-ICA-TAT",
            "name": "Tate de la Capilla",
            "postalCodes": [
              "11210"
            ]
          }
        ]
      },
      {
        "code": "ICA-NAZ",
        "name": "Nazca",
        "districts": [
          {
            "code": "ICA-NAZ-CHA",
            "name": "Changuillo",
            "postalCodes": [
              "11340"
            ]
          },
          {
            "code": "ICA-NAZ-EL ",
            "name": "El Ingenio",
            "postalCodes": [
              "11350"
            ]
          },
          {
            "code": "ICA-NAZ-MAR",
            "name": "Marcona",
            "postalCodes": [
              "11420",
              "11421"
            ]
          },
          {
            "code": "ICA-NAZ-NAZ",
            "name": "Nazca",
            "postalCodes": [
              "11400",
              "11401"
            ]
          },
          {
            "code": "ICA-NAZ-VIS",
            "name": "Vista Alegre",
            "postalCodes": [
              "11400",
              "11401"
            ]
          }
        ],
        "cities": [
          {
            "code": "ICA-NAZ-CHA",
            "name": "Changuillo",
            "postalCodes": [
              "11340"
            ]
          },
          {
            "code": "ICA-NAZ-EL ",
            "name": "El Ingenio",
            "postalCodes": [
              "11350"
            ]
          },
          {
            "code": "ICA-NAZ-NAZ",
            "name": "Nazca",
            "postalCodes": [
              "11400",
              "11401"
            ]
          },
          {
            "code": "ANC-HUA-SAN",
            "name": "San Juan",
            "postalCodes": [
              "02170",
              "02171",
              "05520",
              "06400",
              "09755",
              "11420",
              "11421",
              "16000",
              "16007",
              "16008"
            ]
          },
          {
            "code": "AMA-ROD-VIS",
            "name": "Vista Alegre",
            "postalCodes": [
              "01325",
              "11400",
              "11401"
            ]
          }
        ]
      },
      {
        "code": "ICA-PAL",
        "name": "Palpa",
        "districts": [
          {
            "code": "ICA-PAL-LLI",
            "name": "Llipata",
            "postalCodes": [
              "11360"
            ]
          },
          {
            "code": "ICA-PAL-PAL",
            "name": "Palpa",
            "postalCodes": [
              "11331",
              "11330"
            ]
          },
          {
            "code": "ICA-PAL-RÍO",
            "name": "Río Grande",
            "postalCodes": [
              "11320"
            ]
          },
          {
            "code": "ICA-PAL-SAN",
            "name": "Santa Cruz",
            "postalCodes": [
              "11300"
            ]
          },
          {
            "code": "ICA-PAL-TIB",
            "name": "Tibillo",
            "postalCodes": [
              "11310"
            ]
          }
        ],
        "cities": [
          {
            "code": "ICA-PAL-LLI",
            "name": "Llipata",
            "postalCodes": [
              "11360"
            ]
          },
          {
            "code": "ICA-PAL-PAL",
            "name": "Palpa",
            "postalCodes": [
              "11330",
              "11331"
            ]
          },
          {
            "code": "ICA-PAL-RIO",
            "name": "Rio Grande",
            "postalCodes": [
              "11320"
            ]
          },
          {
            "code": "CAJ-CUT-SAN",
            "name": "Santa Cruz",
            "postalCodes": [
              "06715",
              "11300",
              "15246",
              "16540"
            ]
          },
          {
            "code": "ICA-PAL-TIB",
            "name": "Tibillo",
            "postalCodes": [
              "11310"
            ]
          }
        ]
      },
      {
        "code": "ICA-PIS",
        "name": "Pisco",
        "districts": [
          {
            "code": "ICA-PIS-HUA",
            "name": "Huancano",
            "postalCodes": [
              "11660"
            ]
          },
          {
            "code": "ICA-PIS-HUM",
            "name": "Humay",
            "postalCodes": [
              "11650",
              "11651"
            ]
          },
          {
            "code": "ICA-PIS-IND",
            "name": "Independencia",
            "postalCodes": [
              "11641",
              "11640"
            ]
          },
          {
            "code": "ICA-PIS-PAR",
            "name": "Paracas",
            "postalCodes": [
              "11550"
            ]
          },
          {
            "code": "ICA-PIS-PIS",
            "name": "Pisco",
            "postalCodes": [
              "11601",
              "11600"
            ]
          },
          {
            "code": "ICA-PIS-SAN",
            "name": "San Andres",
            "postalCodes": [
              "11601",
              "11600"
            ]
          },
          {
            "code": "ICA-PIS-SAN",
            "name": "San Clemente",
            "postalCodes": [
              "11630",
              "11631"
            ]
          },
          {
            "code": "ICA-PIS-TUP",
            "name": "Tupac Amaru Inca",
            "postalCodes": [
              "11621",
              "11620"
            ]
          }
        ],
        "cities": [
          {
            "code": "ICA-PIS-HUA",
            "name": "Huancano",
            "postalCodes": [
              "11660"
            ]
          },
          {
            "code": "ICA-PIS-HUM",
            "name": "Humay",
            "postalCodes": [
              "11650",
              "11651"
            ]
          },
          {
            "code": "ICA-PIS-IND",
            "name": "Independencia",
            "postalCodes": [
              "11640",
              "11641",
              "15311",
              "15328",
              "15331",
              "15332",
              "15333"
            ]
          },
          {
            "code": "ICA-PIS-PAR",
            "name": "Paracas",
            "postalCodes": [
              "11550"
            ]
          },
          {
            "code": "ICA-PIS-PIS",
            "name": "Pisco",
            "postalCodes": [
              "11600",
              "11601"
            ]
          },
          {
            "code": "ICA-PIS-SAN",
            "name": "San Andres",
            "postalCodes": [
              "11600",
              "11601"
            ]
          },
          {
            "code": "ICA-PIS-SAN",
            "name": "San Clemente",
            "postalCodes": [
              "11630",
              "11631"
            ]
          },
          {
            "code": "ICA-PIS-TUP",
            "name": "Tupac Amaru",
            "postalCodes": [
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
        "code": "JUN-CHA",
        "name": "Chanchamayo",
        "districts": [
          {
            "code": "JUN-CHA-CHA",
            "name": "Chanchamayo",
            "postalCodes": [
              "12855",
              "12856"
            ]
          },
          {
            "code": "JUN-CHA-PER",
            "name": "Perené",
            "postalCodes": [
              "12867",
              "12865"
            ]
          },
          {
            "code": "JUN-CHA-PIC",
            "name": "Pichanaqui",
            "postalCodes": [
              "12866",
              "12865"
            ]
          },
          {
            "code": "JUN-CHA-SAN",
            "name": "San Luis de Shuaro",
            "postalCodes": [
              "12861",
              "12860"
            ]
          },
          {
            "code": "JUN-CHA-SAN",
            "name": "San Ramón",
            "postalCodes": [
              "12841",
              "12840"
            ]
          },
          {
            "code": "JUN-CHA-VIT",
            "name": "Vitoc",
            "postalCodes": [
              "12845"
            ]
          }
        ],
        "cities": [
          {
            "code": "JUN-CHA-BAJ",
            "name": "Bajo Pichanaqui",
            "postalCodes": [
              "12865",
              "12866"
            ]
          },
          {
            "code": "ANC-AIJ-LA ",
            "name": "La Merced",
            "postalCodes": [
              "02613",
              "09355",
              "12855",
              "12856"
            ]
          },
          {
            "code": "JUN-CHA-PER",
            "name": "Perene",
            "postalCodes": [
              "12865",
              "12867"
            ]
          },
          {
            "code": "CAJ-JAE-PUC",
            "name": "Pucara",
            "postalCodes": [
              "06725",
              "06726",
              "12404",
              "12405",
              "12845",
              "21136",
              "21137"
            ]
          },
          {
            "code": "JUN-CHA-SAN",
            "name": "San Luis de Shuaro",
            "postalCodes": [
              "12860",
              "12861"
            ]
          },
          {
            "code": "JUN-CHA-SAN",
            "name": "San Ramon",
            "postalCodes": [
              "12840",
              "12841"
            ]
          }
        ]
      },
      {
        "code": "JUN-CHU",
        "name": "Chupaca",
        "districts": [
          {
            "code": "JUN-CHU-AHU",
            "name": "Ahuac",
            "postalCodes": [
              "12466",
              "12465"
            ]
          },
          {
            "code": "JUN-CHU-CHO",
            "name": "Chongos Bajo",
            "postalCodes": [
              "12430"
            ]
          },
          {
            "code": "JUN-CHU-CHU",
            "name": "Chupaca",
            "postalCodes": [
              "12456",
              "12455"
            ]
          },
          {
            "code": "JUN-CHU-HUA",
            "name": "Huachac",
            "postalCodes": [
              "12480"
            ]
          },
          {
            "code": "JUN-CHU-HUA",
            "name": "Huamancaca Chico",
            "postalCodes": [
              "12425"
            ]
          },
          {
            "code": "JUN-CHU-SAN",
            "name": "San Juan de Jarpa",
            "postalCodes": [
              "12475"
            ]
          },
          {
            "code": "JUN-CHU-SAN",
            "name": "San Juan de Yscos",
            "postalCodes": [
              "12460"
            ]
          },
          {
            "code": "JUN-CHU-TRE",
            "name": "Tres de Diciembre",
            "postalCodes": [
              "12428"
            ]
          },
          {
            "code": "JUN-CHU-YAN",
            "name": "Yanacancha",
            "postalCodes": [
              "12470"
            ]
          }
        ],
        "cities": [
          {
            "code": "JUN-CHU-AHU",
            "name": "Ahuac",
            "postalCodes": [
              "12465",
              "12466"
            ]
          },
          {
            "code": "JUN-CHU-CHO",
            "name": "Chongos Bajo",
            "postalCodes": [
              "12430"
            ]
          },
          {
            "code": "JUN-CHU-CHU",
            "name": "Chupaca",
            "postalCodes": [
              "12455",
              "12456"
            ]
          },
          {
            "code": "JUN-CHU-HUA",
            "name": "Huachac",
            "postalCodes": [
              "12480"
            ]
          },
          {
            "code": "JUN-CHU-HUA",
            "name": "Huamancaca Chico",
            "postalCodes": [
              "12425"
            ]
          },
          {
            "code": "JUN-CHU-ISC",
            "name": "Iscos",
            "postalCodes": [
              "12460"
            ]
          },
          {
            "code": "JUN-CHU-JAR",
            "name": "Jarpa",
            "postalCodes": [
              "12475"
            ]
          },
          {
            "code": "JUN-CHU-TRE",
            "name": "Tres de Diciembre",
            "postalCodes": [
              "12428"
            ]
          },
          {
            "code": "JUN-CHU-YAN",
            "name": "Yanacancha",
            "postalCodes": [
              "12470",
              "19000",
              "19001"
            ]
          }
        ]
      },
      {
        "code": "JUN-CON",
        "name": "Concepción",
        "districts": [
          {
            "code": "JUN-CON-ACO",
            "name": "Aco",
            "postalCodes": [
              "12510"
            ]
          },
          {
            "code": "JUN-CON-AND",
            "name": "Andamarca",
            "postalCodes": [
              "12236",
              "12235"
            ]
          },
          {
            "code": "JUN-CON-CHA",
            "name": "Chambará",
            "postalCodes": [
              "12490"
            ]
          },
          {
            "code": "JUN-CON-COC",
            "name": "Cochas",
            "postalCodes": [
              "12225"
            ]
          },
          {
            "code": "JUN-CON-COM",
            "name": "Comas",
            "postalCodes": [
              "12221",
              "12220"
            ]
          },
          {
            "code": "JUN-CON-CON",
            "name": "Concepción",
            "postalCodes": [
              "12126",
              "12125"
            ]
          },
          {
            "code": "JUN-CON-HER",
            "name": "Heroinas Toledo",
            "postalCodes": [
              "12215"
            ]
          },
          {
            "code": "JUN-CON-MAN",
            "name": "Manzanares",
            "postalCodes": [
              "12485"
            ]
          },
          {
            "code": "JUN-CON-MAR",
            "name": "Mariscal Castilla",
            "postalCodes": [
              "12230"
            ]
          },
          {
            "code": "JUN-CON-MAT",
            "name": "Matahuasi",
            "postalCodes": [
              "12136",
              "12135"
            ]
          },
          {
            "code": "JUN-CON-MIT",
            "name": "Mito",
            "postalCodes": [
              "12505"
            ]
          },
          {
            "code": "JUN-CON-NUE",
            "name": "Nueve de Julio",
            "postalCodes": [
              "12130"
            ]
          },
          {
            "code": "JUN-CON-ORC",
            "name": "Orcotuna",
            "postalCodes": [
              "12504"
            ]
          },
          {
            "code": "JUN-CON-SAN",
            "name": "San José de Quero",
            "postalCodes": [
              "12496",
              "12495"
            ]
          },
          {
            "code": "JUN-CON-SAN",
            "name": "Santa Rosa de Ocopa",
            "postalCodes": [
              "12200"
            ]
          }
        ],
        "cities": [
          {
            "code": "ANC-CAR-ACO",
            "name": "Aco",
            "postalCodes": [
              "02115",
              "02215",
              "02480",
              "12510"
            ]
          },
          {
            "code": "AYA-LUC-AND",
            "name": "Andamarca",
            "postalCodes": [
              "05480",
              "12235",
              "12236"
            ]
          },
          {
            "code": "JUN-CON-CHA",
            "name": "Chambara",
            "postalCodes": [
              "12490"
            ]
          },
          {
            "code": "JUN-CON-COC",
            "name": "Cochas",
            "postalCodes": [
              "12225",
              "15621"
            ]
          },
          {
            "code": "JUN-CON-COM",
            "name": "Comas",
            "postalCodes": [
              "12220",
              "12221"
            ]
          },
          {
            "code": "AYA-VIL-CON",
            "name": "Concepcion",
            "postalCodes": [
              "05330",
              "12125",
              "12126"
            ]
          },
          {
            "code": "JUN-CON-MAT",
            "name": "Matahuasi",
            "postalCodes": [
              "12135",
              "12136"
            ]
          },
          {
            "code": "JUN-CON-MIT",
            "name": "Mito",
            "postalCodes": [
              "12505"
            ]
          },
          {
            "code": "JUN-CON-MUC",
            "name": "Mucllo",
            "postalCodes": [
              "12230"
            ]
          },
          {
            "code": "JUN-CON-ORC",
            "name": "Orcotuna",
            "postalCodes": [
              "12504"
            ]
          },
          {
            "code": "JUN-CON-SAN",
            "name": "San Antonio de Ocopa",
            "postalCodes": [
              "12215"
            ]
          },
          {
            "code": "JUN-CON-SAN",
            "name": "San Jose de Quero",
            "postalCodes": [
              "12495",
              "12496"
            ]
          },
          {
            "code": "AYA-LA -SAN",
            "name": "San Miguel",
            "postalCodes": [
              "05250",
              "05251",
              "12485",
              "15084",
              "15086",
              "15087",
              "15088"
            ]
          },
          {
            "code": "ANC-PAL-SAN",
            "name": "Santa Rosa",
            "postalCodes": [
              "02825",
              "03345",
              "05240",
              "05241",
              "06820",
              "06821",
              "12200",
              "14840",
              "14841",
              "15123",
              "21885",
              "21886",
              "22720",
              "22721"
            ]
          },
          {
            "code": "JUN-CON-SAN",
            "name": "Santo Domingo del Prado",
            "postalCodes": [
              "12130"
            ]
          }
        ]
      },
      {
        "code": "JUN-HUA",
        "name": "Huancayo",
        "districts": [
          {
            "code": "JUN-HUA-CAR",
            "name": "Carhuacallanga",
            "postalCodes": [
              "12442"
            ]
          },
          {
            "code": "JUN-HUA-CHA",
            "name": "Chacapampa",
            "postalCodes": [
              "12440"
            ]
          },
          {
            "code": "JUN-HUA-CHI",
            "name": "Chicche",
            "postalCodes": [
              "12451"
            ]
          },
          {
            "code": "JUN-HUA-CHI",
            "name": "Chilca",
            "postalCodes": [
              "12003",
              "12000",
              "12001",
              "12051",
              "12002"
            ]
          },
          {
            "code": "JUN-HUA-CHO",
            "name": "Chongos Alto",
            "postalCodes": [
              "12450"
            ]
          },
          {
            "code": "JUN-HUA-CHU",
            "name": "Chupuro",
            "postalCodes": [
              "12435"
            ]
          },
          {
            "code": "JUN-HUA-COL",
            "name": "Colca",
            "postalCodes": [
              "12436"
            ]
          },
          {
            "code": "JUN-HUA-CUL",
            "name": "Cullhuas",
            "postalCodes": [
              "12420"
            ]
          },
          {
            "code": "JUN-HUA-EL ",
            "name": "El Tambo",
            "postalCodes": [
              "12007",
              "12006",
              "12004",
              "12000"
            ]
          },
          {
            "code": "JUN-HUA-HUA",
            "name": "Huacrapuquio",
            "postalCodes": [
              "12419"
            ]
          },
          {
            "code": "JUN-HUA-HUA",
            "name": "Hualhuas",
            "postalCodes": [
              "12105"
            ]
          },
          {
            "code": "JUN-HUA-HUA",
            "name": "Huancan",
            "postalCodes": [
              "12051",
              "12000"
            ]
          },
          {
            "code": "JUN-HUA-HUA",
            "name": "Huancayo",
            "postalCodes": [
              "12003",
              "12004",
              "12000",
              "12001",
              "12002"
            ]
          },
          {
            "code": "JUN-HUA-HUA",
            "name": "Huasicancha",
            "postalCodes": [
              "12445"
            ]
          },
          {
            "code": "JUN-HUA-HUA",
            "name": "Huayucachi",
            "postalCodes": [
              "12410",
              "12408"
            ]
          },
          {
            "code": "JUN-HUA-ING",
            "name": "Ingenio",
            "postalCodes": [
              "12210"
            ]
          },
          {
            "code": "JUN-HUA-PAR",
            "name": "Pariahuanca",
            "postalCodes": [
              "12246",
              "12245"
            ]
          },
          {
            "code": "JUN-HUA-PIL",
            "name": "Pilcomayo",
            "postalCodes": [
              "12006"
            ]
          },
          {
            "code": "JUN-HUA-PUC",
            "name": "Pucará",
            "postalCodes": [
              "12405",
              "12404"
            ]
          },
          {
            "code": "JUN-HUA-QUI",
            "name": "Quichuay",
            "postalCodes": [
              "12205"
            ]
          },
          {
            "code": "JUN-HUA-QUI",
            "name": "Quilcas",
            "postalCodes": [
              "12120"
            ]
          },
          {
            "code": "JUN-HUA-SAN",
            "name": "San Agustín",
            "postalCodes": [
              "12101",
              "12100"
            ]
          },
          {
            "code": "JUN-HUA-SAN",
            "name": "San Domingo de Acobamba",
            "postalCodes": [
              "12240",
              "12241"
            ]
          },
          {
            "code": "JUN-HUA-SAN",
            "name": "San Jerónimo de Tunán",
            "postalCodes": [
              "12115",
              "12116"
            ]
          },
          {
            "code": "JUN-HUA-SAP",
            "name": "Sapallanca",
            "postalCodes": [
              "12400",
              "12401"
            ]
          },
          {
            "code": "JUN-HUA-SAÑ",
            "name": "Saño",
            "postalCodes": [
              "12110"
            ]
          },
          {
            "code": "JUN-HUA-SIC",
            "name": "Sicaya",
            "postalCodes": [
              "12501",
              "12500"
            ]
          },
          {
            "code": "JUN-HUA-VIQ",
            "name": "Viques",
            "postalCodes": [
              "12415"
            ]
          }
        ],
        "cities": [
          {
            "code": "JUN-HUA-CAR",
            "name": "Carhuacallanga",
            "postalCodes": [
              "12442"
            ]
          },
          {
            "code": "JUN-HUA-CHA",
            "name": "Chacapampa",
            "postalCodes": [
              "12440"
            ]
          },
          {
            "code": "JUN-HUA-CHI",
            "name": "Chicche",
            "postalCodes": [
              "12451"
            ]
          },
          {
            "code": "JUN-HUA-CHI",
            "name": "Chilca",
            "postalCodes": [
              "12000",
              "12001",
              "12002",
              "12003",
              "12051",
              "15870",
              "15871"
            ]
          },
          {
            "code": "JUN-HUA-CHO",
            "name": "Chongos Alto",
            "postalCodes": [
              "12450"
            ]
          },
          {
            "code": "JUN-HUA-CHU",
            "name": "Chupuro",
            "postalCodes": [
              "12435"
            ]
          },
          {
            "code": "AYA-VÍC-COL",
            "name": "Colca",
            "postalCodes": [
              "05425",
              "12436"
            ]
          },
          {
            "code": "JUN-HUA-CUL",
            "name": "Cullhuas",
            "postalCodes": [
              "12420"
            ]
          },
          {
            "code": "JUN-HUA-EL ",
            "name": "El Tambo",
            "postalCodes": [
              "12000",
              "12004",
              "12006",
              "12007"
            ]
          },
          {
            "code": "JUN-HUA-HUA",
            "name": "Huacrapuquio",
            "postalCodes": [
              "12419"
            ]
          },
          {
            "code": "JUN-HUA-HUA",
            "name": "Hualhuas",
            "postalCodes": [
              "12105"
            ]
          },
          {
            "code": "JUN-HUA-HUA",
            "name": "Huancan",
            "postalCodes": [
              "12000",
              "12051"
            ]
          },
          {
            "code": "JUN-HUA-HUA",
            "name": "Huancayo",
            "postalCodes": [
              "12000",
              "12001",
              "12002",
              "12003",
              "12004"
            ]
          },
          {
            "code": "JUN-HUA-HUA",
            "name": "Huasicancha",
            "postalCodes": [
              "12445"
            ]
          },
          {
            "code": "JUN-HUA-HUA",
            "name": "Huayucachi",
            "postalCodes": [
              "12408",
              "12410"
            ]
          },
          {
            "code": "JUN-HUA-ING",
            "name": "Ingenio",
            "postalCodes": [
              "12210"
            ]
          },
          {
            "code": "AYA-PAU-LAM",
            "name": "Lampa",
            "postalCodes": [
              "05645",
              "12245",
              "12246",
              "21800",
              "21801"
            ]
          },
          {
            "code": "JUN-HUA-PIL",
            "name": "Pilcomayo",
            "postalCodes": [
              "12006"
            ]
          },
          {
            "code": "CAJ-JAE-PUC",
            "name": "Pucara",
            "postalCodes": [
              "06725",
              "06726",
              "12404",
              "12405",
              "12845",
              "21136",
              "21137"
            ]
          },
          {
            "code": "JUN-HUA-QUI",
            "name": "Quichuay",
            "postalCodes": [
              "12205"
            ]
          },
          {
            "code": "JUN-HUA-QUI",
            "name": "Quilcas",
            "postalCodes": [
              "12120"
            ]
          },
          {
            "code": "JUN-HUA-SAN",
            "name": "San Agustin",
            "postalCodes": [
              "12100",
              "12101"
            ]
          },
          {
            "code": "JUN-HUA-SAN",
            "name": "San Jeronimo de Tunan",
            "postalCodes": [
              "12115",
              "12116"
            ]
          },
          {
            "code": "JUN-HUA-SAN",
            "name": "Santo Domingo de Acobamba",
            "postalCodes": [
              "12240",
              "12241"
            ]
          },
          {
            "code": "JUN-HUA-SAP",
            "name": "Sapallanga",
            "postalCodes": [
              "12400",
              "12401"
            ]
          },
          {
            "code": "JUN-HUA-SAÑ",
            "name": "Saño",
            "postalCodes": [
              "12110"
            ]
          },
          {
            "code": "JUN-HUA-SIC",
            "name": "Sicaya",
            "postalCodes": [
              "12500",
              "12501"
            ]
          },
          {
            "code": "JUN-HUA-VIQ",
            "name": "Viques",
            "postalCodes": [
              "12415"
            ]
          }
        ]
      },
      {
        "code": "JUN-JAU",
        "name": "Jauja",
        "districts": [
          {
            "code": "JUN-JAU-ACO",
            "name": "Acolla",
            "postalCodes": [
              "12621",
              "12620"
            ]
          },
          {
            "code": "JUN-JAU-APA",
            "name": "Apata",
            "postalCodes": [
              "12140"
            ]
          },
          {
            "code": "JUN-JAU-ATA",
            "name": "Ataura",
            "postalCodes": [
              "12160"
            ]
          },
          {
            "code": "JUN-JAU-CAN",
            "name": "Canchayllo",
            "postalCodes": [
              "12555"
            ]
          },
          {
            "code": "JUN-JAU-CUR",
            "name": "Curicaca",
            "postalCodes": [
              "12550"
            ]
          },
          {
            "code": "JUN-JAU-EL ",
            "name": "El Mantaro",
            "postalCodes": [
              "12150"
            ]
          },
          {
            "code": "JUN-JAU-HUA",
            "name": "Huamalí",
            "postalCodes": [
              "12155"
            ]
          },
          {
            "code": "JUN-JAU-HUA",
            "name": "Huaripampa",
            "postalCodes": [
              "12530"
            ]
          },
          {
            "code": "JUN-JAU-HUE",
            "name": "Huertas",
            "postalCodes": [
              "12615"
            ]
          },
          {
            "code": "JUN-JAU-JAN",
            "name": "Janjaillo",
            "postalCodes": [
              "12630"
            ]
          },
          {
            "code": "JUN-JAU-JAU",
            "name": "Jauja",
            "postalCodes": [
              "12601"
            ]
          },
          {
            "code": "JUN-JAU-JUL",
            "name": "Julcán",
            "postalCodes": [
              "12175"
            ]
          },
          {
            "code": "JUN-JAU-LEO",
            "name": "Leonor Ordoñez",
            "postalCodes": [
              "12515"
            ]
          },
          {
            "code": "JUN-JAU-LLO",
            "name": "Llocllapampa",
            "postalCodes": [
              "12545"
            ]
          },
          {
            "code": "JUN-JAU-MAR",
            "name": "Marco",
            "postalCodes": [
              "12625"
            ]
          },
          {
            "code": "JUN-JAU-MAS",
            "name": "Masma",
            "postalCodes": [
              "12165"
            ]
          },
          {
            "code": "JUN-JAU-MAS",
            "name": "Masma Chicche",
            "postalCodes": [
              "12170"
            ]
          },
          {
            "code": "JUN-JAU-MOL",
            "name": "Molinos",
            "postalCodes": [
              "12180"
            ]
          },
          {
            "code": "JUN-JAU-MON",
            "name": "Monobamba",
            "postalCodes": [
              "12850"
            ]
          },
          {
            "code": "JUN-JAU-MUQ",
            "name": "Muqui",
            "postalCodes": [
              "12520"
            ]
          },
          {
            "code": "JUN-JAU-MUQ",
            "name": "Muquiyauyo",
            "postalCodes": [
              "12525"
            ]
          },
          {
            "code": "JUN-JAU-PAC",
            "name": "Paca",
            "postalCodes": [
              "12810"
            ]
          },
          {
            "code": "JUN-JAU-PAC",
            "name": "Paccha",
            "postalCodes": [
              "12585"
            ]
          },
          {
            "code": "JUN-JAU-PAN",
            "name": "Pancan",
            "postalCodes": [
              "12800"
            ]
          },
          {
            "code": "JUN-JAU-PAR",
            "name": "Parco",
            "postalCodes": [
              "12540"
            ]
          },
          {
            "code": "JUN-JAU-POM",
            "name": "Pomacancha",
            "postalCodes": [
              "12635"
            ]
          },
          {
            "code": "JUN-JAU-RII",
            "name": "RIicran",
            "postalCodes": [
              "12820"
            ]
          },
          {
            "code": "JUN-JAU-SAN",
            "name": "San Lorenzo",
            "postalCodes": [
              "12145"
            ]
          },
          {
            "code": "JUN-JAU-SAN",
            "name": "San Pedro de Chunán",
            "postalCodes": [
              "12805"
            ]
          },
          {
            "code": "JUN-JAU-SAU",
            "name": "Sausa",
            "postalCodes": [
              "12601",
              "12600"
            ]
          },
          {
            "code": "JUN-JAU-SIN",
            "name": "Sincos",
            "postalCodes": [
              "12513"
            ]
          },
          {
            "code": "JUN-JAU-TUN",
            "name": "Tunan Marca",
            "postalCodes": [
              "12640"
            ]
          },
          {
            "code": "JUN-JAU-YAU",
            "name": "Yauli",
            "postalCodes": [
              "12815"
            ]
          },
          {
            "code": "JUN-JAU-YAU",
            "name": "Yauyos",
            "postalCodes": [
              "12601",
              "12600"
            ]
          }
        ],
        "cities": [
          {
            "code": "JUN-JAU-ACO",
            "name": "Acolla",
            "postalCodes": [
              "12620",
              "12621"
            ]
          },
          {
            "code": "JUN-JAU-APA",
            "name": "Apata",
            "postalCodes": [
              "12140"
            ]
          },
          {
            "code": "JUN-JAU-ATA",
            "name": "Ataura",
            "postalCodes": [
              "12160"
            ]
          },
          {
            "code": "JUN-JAU-CAN",
            "name": "Canchayllo",
            "postalCodes": [
              "12555"
            ]
          },
          {
            "code": "JUN-JAU-CON",
            "name": "Concho",
            "postalCodes": [
              "12640"
            ]
          },
          {
            "code": "JUN-JAU-EL ",
            "name": "El Rosario",
            "postalCodes": [
              "12550"
            ]
          },
          {
            "code": "JUN-JAU-HUA",
            "name": "Huamali",
            "postalCodes": [
              "12155"
            ]
          },
          {
            "code": "JUN-JAU-HUA",
            "name": "Huancani",
            "postalCodes": [
              "12515"
            ]
          },
          {
            "code": "ANC-HUA-HUA",
            "name": "Huaripampa",
            "postalCodes": [
              "02174",
              "12530"
            ]
          },
          {
            "code": "JUN-JAU-HUE",
            "name": "Huertas",
            "postalCodes": [
              "12615"
            ]
          },
          {
            "code": "JUN-JAU-JAN",
            "name": "Janjaillo",
            "postalCodes": [
              "12630"
            ]
          },
          {
            "code": "JUN-JAU-JAU",
            "name": "Jauja",
            "postalCodes": [
              "12601"
            ]
          },
          {
            "code": "JUN-JAU-JUL",
            "name": "Julcan",
            "postalCodes": [
              "12175",
              "13180",
              "13181"
            ]
          },
          {
            "code": "JUN-JAU-LLO",
            "name": "Llocllapampa",
            "postalCodes": [
              "12545"
            ]
          },
          {
            "code": "JUN-JAU-MAR",
            "name": "Marco",
            "postalCodes": [
              "12625"
            ]
          },
          {
            "code": "JUN-JAU-MAS",
            "name": "Masma",
            "postalCodes": [
              "12165"
            ]
          },
          {
            "code": "JUN-JAU-MAS",
            "name": "Masma Chicche",
            "postalCodes": [
              "12170"
            ]
          },
          {
            "code": "HUA-PAC-MOL",
            "name": "Molinos",
            "postalCodes": [
              "10210",
              "10211",
              "12180"
            ]
          },
          {
            "code": "JUN-JAU-MON",
            "name": "Monobamba",
            "postalCodes": [
              "12850"
            ]
          },
          {
            "code": "JUN-JAU-MUQ",
            "name": "Muqui",
            "postalCodes": [
              "12520"
            ]
          },
          {
            "code": "JUN-JAU-MUQ",
            "name": "Muquiyauyo",
            "postalCodes": [
              "12525"
            ]
          },
          {
            "code": "JUN-JAU-PAC",
            "name": "Paca",
            "postalCodes": [
              "12810"
            ]
          },
          {
            "code": "CAJ-CHO-PAC",
            "name": "Paccha",
            "postalCodes": [
              "06150",
              "06151",
              "12585",
              "12535"
            ]
          },
          {
            "code": "JUN-JAU-PAN",
            "name": "Pancan",
            "postalCodes": [
              "12800"
            ]
          },
          {
            "code": "JUN-JAU-PAR",
            "name": "Parco",
            "postalCodes": [
              "12540"
            ]
          },
          {
            "code": "JUN-JAU-POM",
            "name": "Pomacancha",
            "postalCodes": [
              "12635"
            ]
          },
          {
            "code": "JUN-JAU-PUC",
            "name": "Pucucho",
            "postalCodes": [
              "12150"
            ]
          },
          {
            "code": "JUN-JAU-RIC",
            "name": "Ricran",
            "postalCodes": [
              "12820"
            ]
          },
          {
            "code": "JUN-JAU-SAN",
            "name": "San Lorenzo",
            "postalCodes": [
              "12145",
              "16600",
              "16601",
              "17200"
            ]
          },
          {
            "code": "JUN-JAU-SAN",
            "name": "San Pedro de Chunan",
            "postalCodes": [
              "12805"
            ]
          },
          {
            "code": "JUN-JAU-SAU",
            "name": "Sausa",
            "postalCodes": [
              "12600",
              "12601"
            ]
          },
          {
            "code": "JUN-JAU-SIN",
            "name": "Sincos",
            "postalCodes": [
              "12513"
            ]
          },
          {
            "code": "HUA-HUA-YAU",
            "name": "Yauli",
            "postalCodes": [
              "09300",
              "09301",
              "12815",
              "12590",
              "12591"
            ]
          },
          {
            "code": "JUN-JAU-YAU",
            "name": "Yauyos",
            "postalCodes": [
              "12600",
              "12601",
              "15775"
            ]
          }
        ]
      },
      {
        "code": "JUN-JUN",
        "name": "Junín",
        "districts": [
          {
            "code": "JUN-JUN-CAR",
            "name": "Carhuamayo",
            "postalCodes": [
              "12740",
              "12741"
            ]
          },
          {
            "code": "JUN-JUN-JUN",
            "name": "Junín",
            "postalCodes": [
              "12731",
              "12730"
            ]
          },
          {
            "code": "JUN-JUN-OND",
            "name": "Ondores",
            "postalCodes": [
              "12760"
            ]
          },
          {
            "code": "JUN-JUN-ULC",
            "name": "Ulcumayo",
            "postalCodes": [
              "12751",
              "12750"
            ]
          }
        ],
        "cities": [
          {
            "code": "JUN-JUN-CAR",
            "name": "Carhuamayo",
            "postalCodes": [
              "12740",
              "12741"
            ]
          },
          {
            "code": "JUN-JUN-JUN",
            "name": "Junin",
            "postalCodes": [
              "12730",
              "12731"
            ]
          },
          {
            "code": "JUN-JUN-OND",
            "name": "Ondores",
            "postalCodes": [
              "12760"
            ]
          },
          {
            "code": "JUN-JUN-ULC",
            "name": "Ulcumayo",
            "postalCodes": [
              "12750",
              "12751"
            ]
          }
        ]
      },
      {
        "code": "JUN-SAT",
        "name": "Satipo",
        "districts": [
          {
            "code": "JUN-SAT-COV",
            "name": "Coviriali",
            "postalCodes": [
              "12255",
              "12256"
            ]
          },
          {
            "code": "JUN-SAT-LLA",
            "name": "Llaylla",
            "postalCodes": [
              "12311",
              "12310"
            ]
          },
          {
            "code": "JUN-SAT-MAZ",
            "name": "Mazamari",
            "postalCodes": [
              "12300",
              "12301"
            ]
          },
          {
            "code": "JUN-SAT-PAM",
            "name": "Pampa Hermosa",
            "postalCodes": [
              "12251",
              "12250"
            ]
          },
          {
            "code": "JUN-SAT-PAN",
            "name": "Pangoa",
            "postalCodes": [
              "12321",
              "12320"
            ]
          },
          {
            "code": "JUN-SAT-RÍO",
            "name": "Río Negro",
            "postalCodes": [
              "12876",
              "12875"
            ]
          },
          {
            "code": "JUN-SAT-RÍO",
            "name": "Río Tambo",
            "postalCodes": [
              "12330",
              "12331"
            ]
          },
          {
            "code": "JUN-SAT-SAT",
            "name": "Satipo",
            "postalCodes": [
              "12261",
              "12260"
            ]
          }
        ],
        "cities": [
          {
            "code": "JUN-SAT-COV",
            "name": "Coviriali",
            "postalCodes": [
              "12255",
              "12256"
            ]
          },
          {
            "code": "JUN-SAT-LLA",
            "name": "Llaylla",
            "postalCodes": [
              "12310",
              "12311"
            ]
          },
          {
            "code": "JUN-SAT-MAR",
            "name": "Mariposa",
            "postalCodes": [
              "12250",
              "12251"
            ]
          },
          {
            "code": "JUN-SAT-MAZ",
            "name": "Mazamari",
            "postalCodes": [
              "12300",
              "12301"
            ]
          },
          {
            "code": "JUN-SAT-PUE",
            "name": "Puerto Ocopa",
            "postalCodes": [
              "12330",
              "12331"
            ]
          },
          {
            "code": "JUN-SAT-RIO",
            "name": "Rio Negro",
            "postalCodes": [
              "12875",
              "12876"
            ]
          },
          {
            "code": "JUN-SAT-SAN",
            "name": "San Martin de Pangoa",
            "postalCodes": [
              "12320",
              "12321"
            ]
          },
          {
            "code": "JUN-SAT-SAT",
            "name": "Satipo",
            "postalCodes": [
              "12260",
              "12261"
            ]
          }
        ]
      },
      {
        "code": "JUN-TAR",
        "name": "Tarma",
        "districts": [
          {
            "code": "JUN-TAR-ACO",
            "name": "Acobamba",
            "postalCodes": [
              "12701",
              "12700"
            ]
          },
          {
            "code": "JUN-TAR-HUA",
            "name": "Huaricolca",
            "postalCodes": [
              "12645"
            ]
          },
          {
            "code": "JUN-TAR-HUA",
            "name": "Huasahuasi",
            "postalCodes": [
              "12835",
              "12836"
            ]
          },
          {
            "code": "JUN-TAR-LA ",
            "name": "La Unión",
            "postalCodes": [
              "12655"
            ]
          },
          {
            "code": "JUN-TAR-PAL",
            "name": "Palca",
            "postalCodes": [
              "12831",
              "12830"
            ]
          },
          {
            "code": "JUN-TAR-PAL",
            "name": "Palcamayo",
            "postalCodes": [
              "12710",
              "12711"
            ]
          },
          {
            "code": "JUN-TAR-SAN",
            "name": "San Pedro de Cajas",
            "postalCodes": [
              "12721",
              "12720"
            ]
          },
          {
            "code": "JUN-TAR-TAP",
            "name": "Tapo",
            "postalCodes": [
              "12825",
              "12826"
            ]
          },
          {
            "code": "JUN-TAR-TAR",
            "name": "Tarma",
            "postalCodes": [
              "12651",
              "12650"
            ]
          }
        ],
        "cities": [
          {
            "code": "ANC-SIH-ACO",
            "name": "Acobamba",
            "postalCodes": [
              "02235",
              "09380",
              "09381",
              "12700",
              "12701"
            ]
          },
          {
            "code": "JUN-TAR-HUA",
            "name": "Huaricolca",
            "postalCodes": [
              "12645"
            ]
          },
          {
            "code": "JUN-TAR-HUA",
            "name": "Huasahuasi",
            "postalCodes": [
              "12835",
              "12836"
            ]
          },
          {
            "code": "JUN-TAR-LET",
            "name": "Leticia",
            "postalCodes": [
              "12655"
            ]
          },
          {
            "code": "HUA-HUA-PAL",
            "name": "Palca",
            "postalCodes": [
              "09105",
              "12830",
              "12831",
              "21805",
              "23550"
            ]
          },
          {
            "code": "JUN-TAR-PAL",
            "name": "Palcamayo",
            "postalCodes": [
              "12710",
              "12711"
            ]
          },
          {
            "code": "JUN-TAR-SAN",
            "name": "San Pedro de Cajas",
            "postalCodes": [
              "12720",
              "12721"
            ]
          },
          {
            "code": "JUN-TAR-TAP",
            "name": "Tapo",
            "postalCodes": [
              "12825",
              "12826"
            ]
          },
          {
            "code": "JUN-TAR-TAR",
            "name": "Tarma",
            "postalCodes": [
              "12650",
              "12651"
            ]
          }
        ]
      },
      {
        "code": "JUN-YAU",
        "name": "Yauli",
        "districts": [
          {
            "code": "JUN-YAU-CHA",
            "name": "Chacapalpa",
            "postalCodes": [
              "12560"
            ]
          },
          {
            "code": "JUN-YAU-HUA",
            "name": "Huay Huay",
            "postalCodes": [
              "12565"
            ]
          },
          {
            "code": "JUN-YAU-LA ",
            "name": "La Oroya",
            "postalCodes": [
              "12576",
              "12575"
            ]
          },
          {
            "code": "JUN-YAU-MAR",
            "name": "Marcapomacocha",
            "postalCodes": [
              "12780"
            ]
          },
          {
            "code": "JUN-YAU-MOR",
            "name": "Morococha",
            "postalCodes": [
              "12596",
              "12595"
            ]
          },
          {
            "code": "JUN-YAU-PAC",
            "name": "Paccha",
            "postalCodes": [
              "12535"
            ]
          },
          {
            "code": "JUN-YAU-SAN",
            "name": "Santa Barbara de Carhuacayan",
            "postalCodes": [
              "12770"
            ]
          },
          {
            "code": "JUN-YAU-SAN",
            "name": "Santa Rosa de Sacco",
            "postalCodes": [
              "12576",
              "12575"
            ]
          },
          {
            "code": "JUN-YAU-SUI",
            "name": "Suitucancha",
            "postalCodes": [
              "12570"
            ]
          },
          {
            "code": "JUN-YAU-YAU",
            "name": "Yauli",
            "postalCodes": [
              "12591",
              "12590"
            ]
          }
        ],
        "cities": [
          {
            "code": "JUN-YAU-CHA",
            "name": "Chacapalpa",
            "postalCodes": [
              "12560"
            ]
          },
          {
            "code": "JUN-YAU-HUA",
            "name": "Huay Huay",
            "postalCodes": [
              "12565"
            ]
          },
          {
            "code": "JUN-YAU-LA ",
            "name": "La Oroya",
            "postalCodes": [
              "12575",
              "12576"
            ]
          },
          {
            "code": "JUN-YAU-MAR",
            "name": "Marcapomacocha",
            "postalCodes": [
              "12780"
            ]
          },
          {
            "code": "JUN-YAU-MOR",
            "name": "Morococha",
            "postalCodes": [
              "12595",
              "12596"
            ]
          },
          {
            "code": "CAJ-CHO-PAC",
            "name": "Paccha",
            "postalCodes": [
              "06150",
              "06151",
              "12585",
              "12535"
            ]
          },
          {
            "code": "JUN-YAU-SAN",
            "name": "Santa Barbara de Carhuacayan",
            "postalCodes": [
              "12770"
            ]
          },
          {
            "code": "JUN-YAU-SAN",
            "name": "Santa Rosa de Sacco",
            "postalCodes": [
              "12575",
              "12576"
            ]
          },
          {
            "code": "JUN-YAU-SUI",
            "name": "Suitucancha",
            "postalCodes": [
              "12570"
            ]
          },
          {
            "code": "HUA-HUA-YAU",
            "name": "Yauli",
            "postalCodes": [
              "09300",
              "09301",
              "12815",
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
        "code": "LA -ASC",
        "name": "Ascope",
        "districts": [
          {
            "code": "LA -ASC-ASC",
            "name": "Ascope",
            "postalCodes": [
              "13771",
              "13770"
            ]
          },
          {
            "code": "LA -ASC-CAS",
            "name": "Casa Grande",
            "postalCodes": [
              "13760",
              "13761"
            ]
          },
          {
            "code": "LA -ASC-CHI",
            "name": "Chicama",
            "postalCodes": [
              "13700",
              "13701"
            ]
          },
          {
            "code": "LA -ASC-CHO",
            "name": "Chocope",
            "postalCodes": [
              "13711",
              "13710"
            ]
          },
          {
            "code": "LA -ASC-MAG",
            "name": "Magdalena de Cao",
            "postalCodes": [
              "13750"
            ]
          },
          {
            "code": "LA -ASC-PAI",
            "name": "Paijan",
            "postalCodes": [
              "13720",
              "13721"
            ]
          },
          {
            "code": "LA -ASC-RAZ",
            "name": "Razuri",
            "postalCodes": [
              "13730",
              "13731"
            ]
          },
          {
            "code": "LA -ASC-SAN",
            "name": "Santiago de Cao",
            "postalCodes": [
              "13741",
              "13740"
            ]
          }
        ],
        "cities": [
          {
            "code": "LA -ASC-ASC",
            "name": "Ascope",
            "postalCodes": [
              "13770",
              "13771"
            ]
          },
          {
            "code": "LA -ASC-CAS",
            "name": "Casa Grande",
            "postalCodes": [
              "13760",
              "13761"
            ]
          },
          {
            "code": "LA -ASC-CHI",
            "name": "Chicama",
            "postalCodes": [
              "13700",
              "13701"
            ]
          },
          {
            "code": "LA -ASC-CHO",
            "name": "Chocope",
            "postalCodes": [
              "13710",
              "13711"
            ]
          },
          {
            "code": "LA -ASC-MAG",
            "name": "Magdalena de Cao",
            "postalCodes": [
              "13750"
            ]
          },
          {
            "code": "LA -ASC-PAI",
            "name": "Paijan",
            "postalCodes": [
              "13720",
              "13721"
            ]
          },
          {
            "code": "LA -ASC-PUE",
            "name": "Puerto de Malabrigo",
            "postalCodes": [
              "13730",
              "13731"
            ]
          },
          {
            "code": "LA -ASC-SAN",
            "name": "Santiago de Cao",
            "postalCodes": [
              "13740",
              "13741"
            ]
          }
        ]
      },
      {
        "code": "LA -BOL",
        "name": "Bolivar",
        "districts": [
          {
            "code": "LA -BOL-BAM",
            "name": "Bambamarca",
            "postalCodes": [
              "13400"
            ]
          },
          {
            "code": "LA -BOL-BOL",
            "name": "Bolivar",
            "postalCodes": [
              "13420"
            ]
          },
          {
            "code": "LA -BOL-CON",
            "name": "Condormarca",
            "postalCodes": [
              "13410"
            ]
          },
          {
            "code": "LA -BOL-LON",
            "name": "Longotea",
            "postalCodes": [
              "13440"
            ]
          },
          {
            "code": "LA -BOL-UCH",
            "name": "Uchumarca",
            "postalCodes": [
              "13450"
            ]
          },
          {
            "code": "LA -BOL-UCU",
            "name": "Ucuncha",
            "postalCodes": [
              "13430"
            ]
          }
        ],
        "cities": [
          {
            "code": "CAJ-HUA-BAM",
            "name": "Bambamarca",
            "postalCodes": [
              "06115",
              "06116",
              "13400"
            ]
          },
          {
            "code": "CAJ-SAN-BOL",
            "name": "Bolivar",
            "postalCodes": [
              "06520",
              "13420"
            ]
          },
          {
            "code": "LA -BOL-LON",
            "name": "Longotea",
            "postalCodes": [
              "13440"
            ]
          },
          {
            "code": "LA -BOL-NUE",
            "name": "Nuevo Condormarca",
            "postalCodes": [
              "13410"
            ]
          },
          {
            "code": "LA -BOL-UCH",
            "name": "Uchucmarca",
            "postalCodes": [
              "13450"
            ]
          },
          {
            "code": "LA -BOL-UCU",
            "name": "Ucuncha",
            "postalCodes": [
              "13430"
            ]
          }
        ]
      },
      {
        "code": "LA -CHE",
        "name": "Chepen",
        "districts": [
          {
            "code": "LA -CHE-CHE",
            "name": "Chepén",
            "postalCodes": [
              "13870",
              "13871"
            ]
          },
          {
            "code": "LA -CHE-PAC",
            "name": "Pacanga",
            "postalCodes": [
              "13860",
              "13861"
            ]
          },
          {
            "code": "LA -CHE-PUE",
            "name": "Pueblo Nuevo",
            "postalCodes": [
              "13850",
              "13851"
            ]
          }
        ],
        "cities": [
          {
            "code": "LA -CHE-CHE",
            "name": "Chepen",
            "postalCodes": [
              "13870",
              "13871"
            ]
          },
          {
            "code": "LA -CHE-PAC",
            "name": "Pacanga",
            "postalCodes": [
              "13860",
              "13861"
            ]
          },
          {
            "code": "ICA-ICA-PUE",
            "name": "Pueblo Nuevo",
            "postalCodes": [
              "11200",
              "11701",
              "11703",
              "13850",
              "13851",
              "14310",
              "14311",
              "18610",
              "18611"
            ]
          }
        ]
      },
      {
        "code": "LA -GRA",
        "name": "Gran Chimu",
        "districts": [
          {
            "code": "LA -GRA-CAS",
            "name": "Cascas",
            "postalCodes": [
              "13780",
              "13781"
            ]
          },
          {
            "code": "LA -GRA-LUC",
            "name": "Lucma",
            "postalCodes": [
              "13241",
              "13240"
            ]
          },
          {
            "code": "LA -GRA-MAR",
            "name": "Marmot",
            "postalCodes": [
              "13260"
            ]
          },
          {
            "code": "LA -GRA-SAY",
            "name": "Sayapullo",
            "postalCodes": [
              "13251",
              "13250"
            ]
          }
        ],
        "cities": [
          {
            "code": "LA -GRA-CAS",
            "name": "Cascas",
            "postalCodes": [
              "13780",
              "13781"
            ]
          },
          {
            "code": "LA -GRA-COM",
            "name": "Compin",
            "postalCodes": [
              "13260"
            ]
          },
          {
            "code": "ANC-MAR-LUC",
            "name": "Lucma",
            "postalCodes": [
              "02290",
              "08720",
              "08721",
              "13240",
              "13241"
            ]
          },
          {
            "code": "LA -GRA-SAY",
            "name": "Sayapullo",
            "postalCodes": [
              "13250",
              "13251"
            ]
          }
        ]
      },
      {
        "code": "LA -JUL",
        "name": "Julcan",
        "districts": [
          {
            "code": "LA -JUL-CAL",
            "name": "Calamarca",
            "postalCodes": [
              "13186",
              "13185"
            ]
          },
          {
            "code": "LA -JUL-CAR",
            "name": "Carabamba",
            "postalCodes": [
              "13195",
              "13196"
            ]
          },
          {
            "code": "LA -JUL-HUA",
            "name": "Huaso",
            "postalCodes": [
              "13190",
              "13191"
            ]
          },
          {
            "code": "LA -JUL-JUL",
            "name": "Julcán",
            "postalCodes": [
              "13180",
              "13181"
            ]
          }
        ],
        "cities": [
          {
            "code": "LA -JUL-CAL",
            "name": "Calamarca",
            "postalCodes": [
              "13185",
              "13186"
            ]
          },
          {
            "code": "LA -JUL-CAR",
            "name": "Carabamba",
            "postalCodes": [
              "13195",
              "13196"
            ]
          },
          {
            "code": "LA -JUL-HUA",
            "name": "Huaso",
            "postalCodes": [
              "13190",
              "13191"
            ]
          },
          {
            "code": "JUN-JAU-JUL",
            "name": "Julcan",
            "postalCodes": [
              "12175",
              "13180",
              "13181"
            ]
          }
        ]
      },
      {
        "code": "LA -OTU",
        "name": "Otuzco",
        "districts": [
          {
            "code": "LA -OTU-AGA",
            "name": "Agallpampa",
            "postalCodes": [
              "13135",
              "13136"
            ]
          },
          {
            "code": "LA -OTU-CHA",
            "name": "Charat",
            "postalCodes": [
              "13210"
            ]
          },
          {
            "code": "LA -OTU-HUA",
            "name": "Huaranchal",
            "postalCodes": [
              "13231",
              "13230"
            ]
          },
          {
            "code": "LA -OTU-LA ",
            "name": "La Cuesta",
            "postalCodes": [
              "13120"
            ]
          },
          {
            "code": "LA -OTU-MAC",
            "name": "Mache",
            "postalCodes": [
              "13175"
            ]
          },
          {
            "code": "LA -OTU-OTU",
            "name": "Otuzco",
            "postalCodes": [
              "13200",
              "13201"
            ]
          },
          {
            "code": "LA -OTU-PAR",
            "name": "Paranday",
            "postalCodes": [
              "13115"
            ]
          },
          {
            "code": "LA -OTU-SAL",
            "name": "Salpo",
            "postalCodes": [
              "13130",
              "13131"
            ]
          },
          {
            "code": "LA -OTU-SIN",
            "name": "Sinsicap",
            "postalCodes": [
              "13111",
              "13110"
            ]
          },
          {
            "code": "LA -OTU-USQ",
            "name": "Usquil",
            "postalCodes": [
              "13221",
              "13220"
            ]
          }
        ],
        "cities": [
          {
            "code": "LA -OTU-AGA",
            "name": "Agallpampa",
            "postalCodes": [
              "13135",
              "13136"
            ]
          },
          {
            "code": "LA -OTU-CHA",
            "name": "Charat",
            "postalCodes": [
              "13210"
            ]
          },
          {
            "code": "LA -OTU-HUA",
            "name": "Huaranchal",
            "postalCodes": [
              "13230",
              "13231"
            ]
          },
          {
            "code": "LA -OTU-LA ",
            "name": "La Cuesta",
            "postalCodes": [
              "13120"
            ]
          },
          {
            "code": "LA -OTU-MAC",
            "name": "Mache",
            "postalCodes": [
              "13175"
            ]
          },
          {
            "code": "LA -OTU-OTU",
            "name": "Otuzco",
            "postalCodes": [
              "13200",
              "13201"
            ]
          },
          {
            "code": "LA -OTU-PAR",
            "name": "Paranday",
            "postalCodes": [
              "13115"
            ]
          },
          {
            "code": "LA -OTU-SAL",
            "name": "Salpo",
            "postalCodes": [
              "13130",
              "13131"
            ]
          },
          {
            "code": "LA -OTU-SIN",
            "name": "Sinsicap",
            "postalCodes": [
              "13110",
              "13111"
            ]
          },
          {
            "code": "LA -OTU-USQ",
            "name": "Usquil",
            "postalCodes": [
              "13220",
              "13221"
            ]
          }
        ]
      },
      {
        "code": "LA -PAC",
        "name": "Pacasmayo",
        "districts": [
          {
            "code": "LA -PAC-GUA",
            "name": "Guadalupe",
            "postalCodes": [
              "13840",
              "13841"
            ]
          },
          {
            "code": "LA -PAC-JEQ",
            "name": "Jequetepeque",
            "postalCodes": [
              "13820"
            ]
          },
          {
            "code": "LA -PAC-PAC",
            "name": "Pacasmayo",
            "postalCodes": [
              "13810",
              "13811"
            ]
          },
          {
            "code": "LA -PAC-SAN",
            "name": "San José",
            "postalCodes": [
              "13830",
              "13831"
            ]
          },
          {
            "code": "LA -PAC-SAN",
            "name": "San Pedro de Lloc",
            "postalCodes": [
              "13801",
              "13800"
            ]
          }
        ],
        "cities": [
          {
            "code": "ICA-ICA-GUA",
            "name": "Guadalupe",
            "postalCodes": [
              "11500",
              "11501",
              "13840",
              "13841"
            ]
          },
          {
            "code": "LA -PAC-JEQ",
            "name": "Jequetepeque",
            "postalCodes": [
              "13820"
            ]
          },
          {
            "code": "LA -PAC-PAC",
            "name": "Pacasmayo",
            "postalCodes": [
              "13810",
              "13811"
            ]
          },
          {
            "code": "ARE-CAM-SAN",
            "name": "San Jose",
            "postalCodes": [
              "04465",
              "04466",
              "13830",
              "13831",
              "14000",
              "14051",
              "21162",
              "21165"
            ]
          },
          {
            "code": "LA -PAC-SAN",
            "name": "San Pedro de Lloc",
            "postalCodes": [
              "13800",
              "13801"
            ]
          }
        ]
      },
      {
        "code": "LA -PAT",
        "name": "Pataz",
        "districts": [
          {
            "code": "LA -PAT-BUL",
            "name": "Buldibuyo",
            "postalCodes": [
              "13515"
            ]
          },
          {
            "code": "LA -PAT-CHI",
            "name": "Chillia",
            "postalCodes": [
              "13550",
              "13551"
            ]
          },
          {
            "code": "LA -PAT-HUA",
            "name": "Huancaspata",
            "postalCodes": [
              "13530",
              "13531"
            ]
          },
          {
            "code": "LA -PAT-HUA",
            "name": "Huaylillas",
            "postalCodes": [
              "13520"
            ]
          },
          {
            "code": "LA -PAT-HUA",
            "name": "Huayo",
            "postalCodes": [
              "13555"
            ]
          },
          {
            "code": "LA -PAT-ONG",
            "name": "Ongón",
            "postalCodes": [
              "13560"
            ]
          },
          {
            "code": "LA -PAT-PAR",
            "name": "Parcoy",
            "postalCodes": [
              "13511",
              "13510"
            ]
          },
          {
            "code": "LA -PAT-PAT",
            "name": "Pataz",
            "postalCodes": [
              "13500",
              "13501"
            ]
          },
          {
            "code": "LA -PAT-PÍA",
            "name": "Pías",
            "postalCodes": [
              "13505"
            ]
          },
          {
            "code": "LA -PAT-SAN",
            "name": "Santiago de Challas",
            "postalCodes": [
              "13535"
            ]
          },
          {
            "code": "LA -PAT-TAU",
            "name": "Taurija",
            "postalCodes": [
              "13545"
            ]
          },
          {
            "code": "LA -PAT-TAY",
            "name": "Tayabamba",
            "postalCodes": [
              "13526",
              "13525"
            ]
          },
          {
            "code": "LA -PAT-URP",
            "name": "Urpay",
            "postalCodes": [
              "13540"
            ]
          }
        ],
        "cities": [
          {
            "code": "LA -PAT-BUL",
            "name": "Buldibuyo",
            "postalCodes": [
              "13515"
            ]
          },
          {
            "code": "LA -PAT-CHA",
            "name": "Challas",
            "postalCodes": [
              "13535"
            ]
          },
          {
            "code": "LA -PAT-CHI",
            "name": "Chillia",
            "postalCodes": [
              "13550",
              "13551"
            ]
          },
          {
            "code": "LA -PAT-HUA",
            "name": "Huancaspata",
            "postalCodes": [
              "13530",
              "13531"
            ]
          },
          {
            "code": "LA -PAT-HUA",
            "name": "Huaylillas",
            "postalCodes": [
              "13520"
            ]
          },
          {
            "code": "LA -PAT-HUA",
            "name": "Huayo",
            "postalCodes": [
              "13555"
            ]
          },
          {
            "code": "LA -PAT-ONG",
            "name": "Ongon",
            "postalCodes": [
              "13560"
            ]
          },
          {
            "code": "LA -PAT-PAR",
            "name": "Parcoy",
            "postalCodes": [
              "13510",
              "13511"
            ]
          },
          {
            "code": "LA -PAT-PAT",
            "name": "Pataz",
            "postalCodes": [
              "13500",
              "13501"
            ]
          },
          {
            "code": "LA -PAT-PIA",
            "name": "Pias",
            "postalCodes": [
              "13505"
            ]
          },
          {
            "code": "LA -PAT-TAU",
            "name": "Taurija",
            "postalCodes": [
              "13545"
            ]
          },
          {
            "code": "LA -PAT-TAY",
            "name": "Tayabamba",
            "postalCodes": [
              "13525",
              "13526"
            ]
          },
          {
            "code": "LA -PAT-URP",
            "name": "Urpay",
            "postalCodes": [
              "13540"
            ]
          }
        ]
      },
      {
        "code": "LA -SAN",
        "name": "Sanchez Carrión",
        "districts": [
          {
            "code": "LA -SAN-CHU",
            "name": "Chugay",
            "postalCodes": [
              "13330",
              "13331"
            ]
          },
          {
            "code": "LA -SAN-COC",
            "name": "Cochorco",
            "postalCodes": [
              "13340",
              "13341"
            ]
          },
          {
            "code": "LA -SAN-CUR",
            "name": "Curgos",
            "postalCodes": [
              "13361",
              "13360"
            ]
          },
          {
            "code": "LA -SAN-HUA",
            "name": "Huamachuco",
            "postalCodes": [
              "13300",
              "13301"
            ]
          },
          {
            "code": "LA -SAN-MAR",
            "name": "Marcabal",
            "postalCodes": [
              "13320",
              "13321"
            ]
          },
          {
            "code": "LA -SAN-SAN",
            "name": "Sanagorán",
            "postalCodes": [
              "13310",
              "13311"
            ]
          },
          {
            "code": "LA -SAN-SAR",
            "name": "Sartimbamba",
            "postalCodes": [
              "13350",
              "13351"
            ]
          },
          {
            "code": "LA -SAN-SAR",
            "name": "Sarín",
            "postalCodes": [
              "13370",
              "13371"
            ]
          }
        ],
        "cities": [
          {
            "code": "LA -SAN-ARI",
            "name": "Aricapampa",
            "postalCodes": [
              "13340",
              "13341"
            ]
          },
          {
            "code": "LA -SAN-CHU",
            "name": "Chugay",
            "postalCodes": [
              "13330",
              "13331"
            ]
          },
          {
            "code": "LA -SAN-CUR",
            "name": "Curgos",
            "postalCodes": [
              "13360",
              "13361"
            ]
          },
          {
            "code": "LA -SAN-HUA",
            "name": "Huamachuco",
            "postalCodes": [
              "13300",
              "13301"
            ]
          },
          {
            "code": "LA -SAN-MAR",
            "name": "Marcabal",
            "postalCodes": [
              "13320",
              "13321"
            ]
          },
          {
            "code": "LA -SAN-SAN",
            "name": "Sanagoran",
            "postalCodes": [
              "13310",
              "13311"
            ]
          },
          {
            "code": "LA -SAN-SAR",
            "name": "Sarin",
            "postalCodes": [
              "13370",
              "13371"
            ]
          },
          {
            "code": "LA -SAN-SAR",
            "name": "Sartimbamba",
            "postalCodes": [
              "13350",
              "13351"
            ]
          }
        ]
      },
      {
        "code": "LA -SAN",
        "name": "Santiago de Chucho",
        "districts": [
          {
            "code": "LA -SAN-ANG",
            "name": "Angasmarca",
            "postalCodes": [
              "13160",
              "13161"
            ]
          },
          {
            "code": "LA -SAN-CAC",
            "name": "Cachicadan",
            "postalCodes": [
              "13155",
              "13156"
            ]
          },
          {
            "code": "LA -SAN-MOL",
            "name": "Mollebamba",
            "postalCodes": [
              "13165"
            ]
          },
          {
            "code": "LA -SAN-MOL",
            "name": "Mollepata",
            "postalCodes": [
              "13170"
            ]
          },
          {
            "code": "LA -SAN-QUI",
            "name": "Quiruvilca",
            "postalCodes": [
              "13141",
              "13140"
            ]
          },
          {
            "code": "LA -SAN-SAN",
            "name": "Santa Cruz de Chuca",
            "postalCodes": [
              "13150"
            ]
          },
          {
            "code": "LA -SAN-SAN",
            "name": "Santiago de Chuco",
            "postalCodes": [
              "13146",
              "13145"
            ]
          },
          {
            "code": "LA -SAN-SIT",
            "name": "Sitabamba",
            "postalCodes": [
              "13380"
            ]
          }
        ],
        "cities": [
          {
            "code": "LA -SAN-ANG",
            "name": "Angasmarca",
            "postalCodes": [
              "13160",
              "13161"
            ]
          },
          {
            "code": "LA -SAN-CAC",
            "name": "Cachicadan",
            "postalCodes": [
              "13155",
              "13156"
            ]
          },
          {
            "code": "APU-ANT-MOL",
            "name": "Mollebamba",
            "postalCodes": [
              "03475",
              "13165"
            ]
          },
          {
            "code": "CUZ-ANT-MOL",
            "name": "Mollepata",
            "postalCodes": [
              "08645",
              "13170"
            ]
          },
          {
            "code": "LA -SAN-QUI",
            "name": "Quiruvilca",
            "postalCodes": [
              "13140",
              "13141"
            ]
          },
          {
            "code": "LA -SAN-SAN",
            "name": "Santa Cruz de Chuca",
            "postalCodes": [
              "13150"
            ]
          },
          {
            "code": "LA -SAN-SAN",
            "name": "Santiago de Chuco",
            "postalCodes": [
              "13145",
              "13146"
            ]
          },
          {
            "code": "LA -SAN-SIT",
            "name": "Sitabamba",
            "postalCodes": [
              "13380"
            ]
          }
        ]
      },
      {
        "code": "LA -TRU",
        "name": "Trujillo",
        "districts": [
          {
            "code": "LA -TRU-EL ",
            "name": "El Porvenir",
            "postalCodes": [
              "13002",
              "13004",
              "13003"
            ]
          },
          {
            "code": "LA -TRU-FLO",
            "name": "Florencia de Mora",
            "postalCodes": [
              "13002",
              "13003"
            ]
          },
          {
            "code": "LA -TRU-HUA",
            "name": "Huanchaco",
            "postalCodes": [
              "13014",
              "13011",
              "13000"
            ]
          },
          {
            "code": "LA -TRU-LA ",
            "name": "La Esperanza",
            "postalCodes": [
              "13012",
              "13002",
              "13014",
              "13013"
            ]
          },
          {
            "code": "LA -TRU-LAR",
            "name": "Laredo",
            "postalCodes": [
              "13100",
              "13101"
            ]
          },
          {
            "code": "LA -TRU-MOC",
            "name": "Moche",
            "postalCodes": [
              "13600",
              "13601"
            ]
          },
          {
            "code": "LA -TRU-POR",
            "name": "Poroto",
            "postalCodes": [
              "13125"
            ]
          },
          {
            "code": "LA -TRU-SAL",
            "name": "Salaverry",
            "postalCodes": [
              "13610",
              "13611"
            ]
          },
          {
            "code": "LA -TRU-SIM",
            "name": "Simbal",
            "postalCodes": [
              "13105"
            ]
          },
          {
            "code": "LA -TRU-TRU",
            "name": "Trujillo",
            "postalCodes": [
              "13011",
              "13001",
              "13008",
              "13006",
              "13007"
            ]
          },
          {
            "code": "LA -TRU-VÍC",
            "name": "Víctor Larco Herrera",
            "postalCodes": [
              "13009",
              "13008"
            ]
          }
        ],
        "cities": [
          {
            "code": "ANC-SAN-BUE",
            "name": "Buenos Aires",
            "postalCodes": [
              "02710",
              "02711",
              "02712",
              "13008",
              "13009",
              "20380",
              "20381",
              "22410"
            ]
          },
          {
            "code": "LA -TRU-EL ",
            "name": "El Porvenir",
            "postalCodes": [
              "13002",
              "13003",
              "13004"
            ]
          },
          {
            "code": "LA -TRU-FLO",
            "name": "Florencia de Mora",
            "postalCodes": [
              "13002",
              "13003"
            ]
          },
          {
            "code": "LA -TRU-HUA",
            "name": "Huanchaco",
            "postalCodes": [
              "13000",
              "13011",
              "13014"
            ]
          },
          {
            "code": "CAJ-SAN-LA ",
            "name": "La Esperanza",
            "postalCodes": [
              "06611",
              "13002",
              "13012",
              "13013",
              "13014",
              "23000",
              "23001",
              "23002",
              "23006"
            ]
          },
          {
            "code": "LA -TRU-LAR",
            "name": "Laredo",
            "postalCodes": [
              "13100",
              "13101"
            ]
          },
          {
            "code": "LA -TRU-MOC",
            "name": "Moche",
            "postalCodes": [
              "13600",
              "13601"
            ]
          },
          {
            "code": "LA -TRU-POR",
            "name": "Poroto",
            "postalCodes": [
              "13125"
            ]
          },
          {
            "code": "LA -TRU-SAL",
            "name": "Salaverry",
            "postalCodes": [
              "13610",
              "13611"
            ]
          },
          {
            "code": "LA -TRU-SIM",
            "name": "Simbal",
            "postalCodes": [
              "13105"
            ]
          },
          {
            "code": "LA -TRU-TRU",
            "name": "Trujillo",
            "postalCodes": [
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
        "code": "LA -VIR",
        "name": "Viru",
        "districts": [
          {
            "code": "LA -VIR-CHA",
            "name": "Chao",
            "postalCodes": [
              "13631",
              "13630"
            ]
          },
          {
            "code": "LA -VIR-GUA",
            "name": "Guadalupito",
            "postalCodes": [
              "13641",
              "13640"
            ]
          },
          {
            "code": "LA -VIR-VIR",
            "name": "Virú",
            "postalCodes": [
              "13620",
              "13621"
            ]
          }
        ],
        "cities": [
          {
            "code": "LA -VIR-CHA",
            "name": "Chao",
            "postalCodes": [
              "13630",
              "13631"
            ]
          },
          {
            "code": "LA -VIR-GUA",
            "name": "Guadalupito",
            "postalCodes": [
              "13640",
              "13641"
            ]
          },
          {
            "code": "LA -VIR-VIR",
            "name": "Viru",
            "postalCodes": [
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
        "code": "LAM-CHI",
        "name": "Chiclayo",
        "districts": [
          {
            "code": "LAM-CHI-CAY",
            "name": "Cayalti",
            "postalCodes": [
              "14721",
              "14720"
            ]
          },
          {
            "code": "LAM-CHI-CHI",
            "name": "Chiclayo",
            "postalCodes": [
              "14001",
              "14006",
              "14004",
              "14009",
              "14011",
              "14008",
              "14002",
              "14012"
            ]
          },
          {
            "code": "LAM-CHI-CHO",
            "name": "Chongoyape",
            "postalCodes": [
              "14620",
              "14621"
            ]
          },
          {
            "code": "LAM-CHI-ETÉ",
            "name": "Etén",
            "postalCodes": [
              "14821",
              "14820"
            ]
          },
          {
            "code": "LAM-CHI-ETÉ",
            "name": "Etén Puerto",
            "postalCodes": [
              "14810"
            ]
          },
          {
            "code": "LAM-CHI-JOS",
            "name": "José Leonardo Ortíz",
            "postalCodes": [
              "14004",
              "14002",
              "14003"
            ]
          },
          {
            "code": "LAM-CHI-LA ",
            "name": "La Victoria",
            "postalCodes": [
              "14008",
              "14007"
            ]
          },
          {
            "code": "LAM-CHI-LAG",
            "name": "Lagunas",
            "postalCodes": [
              "14700",
              "14701"
            ]
          },
          {
            "code": "LAM-CHI-MON",
            "name": "Monsefú",
            "postalCodes": [
              "14831",
              "14830"
            ]
          },
          {
            "code": "LAM-CHI-NUE",
            "name": "Nueva Arica",
            "postalCodes": [
              "14730"
            ]
          },
          {
            "code": "LAM-CHI-OYO",
            "name": "Oyotun",
            "postalCodes": [
              "14741",
              "14740"
            ]
          },
          {
            "code": "LAM-CHI-PAT",
            "name": "Patapo",
            "postalCodes": [
              "14610",
              "14611"
            ]
          },
          {
            "code": "LAM-CHI-PIC",
            "name": "Picsi",
            "postalCodes": [
              "14300",
              "14301"
            ]
          },
          {
            "code": "LAM-CHI-PIM",
            "name": "Pimentel",
            "postalCodes": [
              "14012"
            ]
          },
          {
            "code": "LAM-CHI-POM",
            "name": "Pomalca",
            "postalCodes": [
              "14006"
            ]
          },
          {
            "code": "LAM-CHI-PUC",
            "name": "Pucalá",
            "postalCodes": [
              "14630",
              "14631"
            ]
          },
          {
            "code": "LAM-CHI-REQ",
            "name": "Reque",
            "postalCodes": [
              "14801",
              "14800"
            ]
          },
          {
            "code": "LAM-CHI-SAN",
            "name": "Santa Rosa",
            "postalCodes": [
              "14841",
              "14840"
            ]
          },
          {
            "code": "LAM-CHI-SAÑ",
            "name": "Saña",
            "postalCodes": [
              "14710",
              "14711"
            ]
          },
          {
            "code": "LAM-CHI-TUM",
            "name": "Tumán",
            "postalCodes": [
              "14601",
              "14600"
            ]
          }
        ],
        "cities": [
          {
            "code": "LAM-CHI-CAY",
            "name": "Cayalti",
            "postalCodes": [
              "14720",
              "14721"
            ]
          },
          {
            "code": "LAM-CHI-CHI",
            "name": "Chiclayo",
            "postalCodes": [
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
            "code": "LAM-CHI-CHO",
            "name": "Chongoyape",
            "postalCodes": [
              "14620",
              "14621"
            ]
          },
          {
            "code": "LAM-CHI-ETE",
            "name": "Eten",
            "postalCodes": [
              "14820",
              "14821"
            ]
          },
          {
            "code": "LAM-CHI-ETE",
            "name": "Eten Puerto",
            "postalCodes": [
              "14810"
            ]
          },
          {
            "code": "LAM-CHI-JOS",
            "name": "Jose Leonardo Ortiz",
            "postalCodes": [
              "14000",
              "14013",
              "14002",
              "14003",
              "14004"
            ]
          },
          {
            "code": "LAM-CHI-LA ",
            "name": "La Victoria",
            "postalCodes": [
              "14000",
              "14007",
              "14008",
              "15018",
              "15019",
              "15033",
              "15034"
            ]
          },
          {
            "code": "LAM-CHI-MOC",
            "name": "Mocupe",
            "postalCodes": [
              "14700",
              "14701"
            ]
          },
          {
            "code": "LAM-CHI-MON",
            "name": "Monsefu",
            "postalCodes": [
              "14830",
              "14831"
            ]
          },
          {
            "code": "LAM-CHI-NUE",
            "name": "Nueva Arica",
            "postalCodes": [
              "14730"
            ]
          },
          {
            "code": "LAM-CHI-OYO",
            "name": "Oyotun",
            "postalCodes": [
              "14740",
              "14741"
            ]
          },
          {
            "code": "LAM-CHI-PAT",
            "name": "Patapo",
            "postalCodes": [
              "14610",
              "14611"
            ]
          },
          {
            "code": "LAM-CHI-PIC",
            "name": "Picsi",
            "postalCodes": [
              "14300",
              "14301"
            ]
          },
          {
            "code": "LAM-CHI-PIM",
            "name": "Pimentel",
            "postalCodes": [
              "14000",
              "14012"
            ]
          },
          {
            "code": "LAM-CHI-POM",
            "name": "Pomalca",
            "postalCodes": [
              "14000",
              "14006"
            ]
          },
          {
            "code": "LAM-CHI-PUC",
            "name": "Pucala",
            "postalCodes": [
              "14630",
              "14631"
            ]
          },
          {
            "code": "LAM-CHI-REQ",
            "name": "Reque",
            "postalCodes": [
              "14800",
              "14801"
            ]
          },
          {
            "code": "ANC-PAL-SAN",
            "name": "Santa Rosa",
            "postalCodes": [
              "02825",
              "03345",
              "05240",
              "05241",
              "06820",
              "06821",
              "12200",
              "14840",
              "14841",
              "15123",
              "21885",
              "21886",
              "22720",
              "22721"
            ]
          },
          {
            "code": "LAM-CHI-SAÑ",
            "name": "Saña",
            "postalCodes": [
              "14710",
              "14711"
            ]
          },
          {
            "code": "LAM-CHI-TUM",
            "name": "Tuman",
            "postalCodes": [
              "14600",
              "14601"
            ]
          }
        ]
      },
      {
        "code": "LAM-CHI",
        "name": "Chiclayo, Lambayeque",
        "districts": [
          {
            "code": "LAM-CHI-JOS",
            "name": "José Leonardo Ortíz",
            "postalCodes": [
              "14013",
              "14000"
            ]
          },
          {
            "code": "LAM-CHI-LA ",
            "name": "La Victoria",
            "postalCodes": [
              "14000"
            ]
          },
          {
            "code": "LAM-CHI-LAM",
            "name": "Lambayeque",
            "postalCodes": [
              "14013",
              "14000"
            ]
          },
          {
            "code": "LAM-CHI-PIM",
            "name": "Pimentel",
            "postalCodes": [
              "14000"
            ]
          },
          {
            "code": "LAM-CHI-POM",
            "name": "Pomalca",
            "postalCodes": [
              "14000"
            ]
          },
          {
            "code": "LAM-CHI-SAN",
            "name": "San José",
            "postalCodes": [
              "14000"
            ]
          }
        ],
        "cities": [
          {
            "code": "LAM-CHI-JOS",
            "name": "Jose Leonardo Ortiz",
            "postalCodes": [
              "14000",
              "14013",
              "14002",
              "14003",
              "14004"
            ]
          },
          {
            "code": "LAM-CHI-LA ",
            "name": "La Victoria",
            "postalCodes": [
              "14000",
              "14007",
              "14008",
              "15018",
              "15019",
              "15033",
              "15034"
            ]
          },
          {
            "code": "LAM-CHI-LAM",
            "name": "Lambayeque",
            "postalCodes": [
              "14000",
              "14013"
            ]
          },
          {
            "code": "LAM-CHI-PIM",
            "name": "Pimentel",
            "postalCodes": [
              "14000",
              "14012"
            ]
          },
          {
            "code": "LAM-CHI-POM",
            "name": "Pomalca",
            "postalCodes": [
              "14000",
              "14006"
            ]
          },
          {
            "code": "ARE-CAM-SAN",
            "name": "San Jose",
            "postalCodes": [
              "04465",
              "04466",
              "13830",
              "13831",
              "14000",
              "14051",
              "21162",
              "21165"
            ]
          }
        ]
      },
      {
        "code": "LAM-FER",
        "name": "Ferreñafe",
        "districts": [
          {
            "code": "LAM-FER-CAÑ",
            "name": "Cañaris",
            "postalCodes": [
              "14500",
              "14501"
            ]
          },
          {
            "code": "LAM-FER-FER",
            "name": "Ferreñafe",
            "postalCodes": [
              "14311",
              "14310"
            ]
          },
          {
            "code": "LAM-FER-INC",
            "name": "Incahuasi",
            "postalCodes": [
              "14400",
              "14401"
            ]
          },
          {
            "code": "LAM-FER-MAN",
            "name": "Manuel Antonio Mesones Muro",
            "postalCodes": [
              "14330"
            ]
          },
          {
            "code": "LAM-FER-PIT",
            "name": "Pitipo",
            "postalCodes": [
              "14340",
              "14341"
            ]
          },
          {
            "code": "LAM-FER-PUE",
            "name": "Pueblo Nuevo",
            "postalCodes": [
              "14311",
              "14310"
            ]
          }
        ],
        "cities": [
          {
            "code": "LAM-FER-CAÑ",
            "name": "Cañaris",
            "postalCodes": [
              "14500",
              "14501"
            ]
          },
          {
            "code": "LAM-FER-FER",
            "name": "Ferreñafe",
            "postalCodes": [
              "14310",
              "14311"
            ]
          },
          {
            "code": "LAM-FER-INC",
            "name": "Incahuasi",
            "postalCodes": [
              "14400",
              "14401"
            ]
          },
          {
            "code": "LAM-FER-MAN",
            "name": "Manuel Antonio Mesones Muro",
            "postalCodes": [
              "14330"
            ]
          },
          {
            "code": "LAM-FER-PIT",
            "name": "Pitipo",
            "postalCodes": [
              "14340",
              "14341"
            ]
          },
          {
            "code": "ICA-ICA-PUE",
            "name": "Pueblo Nuevo",
            "postalCodes": [
              "11200",
              "11701",
              "11703",
              "13850",
              "13851",
              "14310",
              "14311",
              "18610",
              "18611"
            ]
          }
        ]
      },
      {
        "code": "LAM-LAM",
        "name": "Lambayeque",
        "districts": [
          {
            "code": "LAM-LAM-CHO",
            "name": "Chochope",
            "postalCodes": [
              "14220"
            ]
          },
          {
            "code": "LAM-LAM-ILL",
            "name": "Illimo",
            "postalCodes": [
              "14131",
              "14130"
            ]
          },
          {
            "code": "LAM-LAM-JAY",
            "name": "Jayanca",
            "postalCodes": [
              "14151",
              "14150"
            ]
          },
          {
            "code": "LAM-LAM-MOC",
            "name": "Mochumi",
            "postalCodes": [
              "14110",
              "14111"
            ]
          },
          {
            "code": "LAM-LAM-MOR",
            "name": "Morrope",
            "postalCodes": [
              "14160",
              "14161"
            ]
          },
          {
            "code": "LAM-LAM-MOT",
            "name": "Motupe",
            "postalCodes": [
              "14200",
              "14201"
            ]
          },
          {
            "code": "LAM-LAM-OLM",
            "name": "Olmos",
            "postalCodes": [
              "14210",
              "14211"
            ]
          },
          {
            "code": "LAM-LAM-PAC",
            "name": "Pacora",
            "postalCodes": [
              "14140",
              "14141"
            ]
          },
          {
            "code": "LAM-LAM-SAL",
            "name": "Salas",
            "postalCodes": [
              "14230",
              "14231"
            ]
          },
          {
            "code": "LAM-LAM-SAN",
            "name": "San José",
            "postalCodes": [
              "14051"
            ]
          },
          {
            "code": "LAM-LAM-TUC",
            "name": "Tucumé",
            "postalCodes": [
              "14121",
              "14120"
            ]
          }
        ],
        "cities": [
          {
            "code": "LAM-LAM-CHO",
            "name": "Chochope",
            "postalCodes": [
              "14220"
            ]
          },
          {
            "code": "LAM-LAM-ILL",
            "name": "Illimo",
            "postalCodes": [
              "14130",
              "14131"
            ]
          },
          {
            "code": "LAM-LAM-JAY",
            "name": "Jayanca",
            "postalCodes": [
              "14150",
              "14151"
            ]
          },
          {
            "code": "LAM-LAM-MOC",
            "name": "Mochumi",
            "postalCodes": [
              "14110",
              "14111"
            ]
          },
          {
            "code": "LAM-LAM-MOR",
            "name": "Morrope",
            "postalCodes": [
              "14160",
              "14161"
            ]
          },
          {
            "code": "LAM-LAM-MOT",
            "name": "Motupe",
            "postalCodes": [
              "14200",
              "14201"
            ]
          },
          {
            "code": "LAM-LAM-OLM",
            "name": "Olmos",
            "postalCodes": [
              "14210",
              "14211"
            ]
          },
          {
            "code": "LAM-LAM-PAC",
            "name": "Pacora",
            "postalCodes": [
              "14140",
              "14141"
            ]
          },
          {
            "code": "LAM-LAM-SAL",
            "name": "Salas",
            "postalCodes": [
              "14230",
              "14231"
            ]
          },
          {
            "code": "ARE-CAM-SAN",
            "name": "San Jose",
            "postalCodes": [
              "04465",
              "04466",
              "13830",
              "13831",
              "14000",
              "14051",
              "21162",
              "21165"
            ]
          },
          {
            "code": "LAM-LAM-TUC",
            "name": "Tucume",
            "postalCodes": [
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
        "code": "LIM-BAR",
        "name": "Barranca",
        "districts": [
          {
            "code": "LIM-BAR-BAR",
            "name": "Barranca",
            "postalCodes": [
              "15170",
              "15169"
            ]
          },
          {
            "code": "LIM-BAR-PAR",
            "name": "Paramonga",
            "postalCodes": [
              "15178",
              "15180"
            ]
          },
          {
            "code": "LIM-BAR-PAT",
            "name": "Pativilca",
            "postalCodes": [
              "15174",
              "15175"
            ]
          },
          {
            "code": "LIM-BAR-SUP",
            "name": "Supe",
            "postalCodes": [
              "15162",
              "15161"
            ]
          },
          {
            "code": "LIM-BAR-SUP",
            "name": "Supe Puerto",
            "postalCodes": [
              "15162",
              "15161"
            ]
          }
        ],
        "cities": [
          {
            "code": "LIM-BAR-BAR",
            "name": "Barranca",
            "postalCodes": [
              "15169",
              "15170"
            ]
          },
          {
            "code": "LIM-BAR-PAR",
            "name": "Paramonga",
            "postalCodes": [
              "15178",
              "15180"
            ]
          },
          {
            "code": "LIM-BAR-PAT",
            "name": "Pativilca",
            "postalCodes": [
              "15174",
              "15175"
            ]
          },
          {
            "code": "LIM-BAR-SUP",
            "name": "Supe",
            "postalCodes": [
              "15161",
              "15162"
            ]
          },
          {
            "code": "LIM-BAR-SUP",
            "name": "Supe Puerto",
            "postalCodes": [
              "15161",
              "15162"
            ]
          }
        ]
      },
      {
        "code": "LIM-CAJ",
        "name": "Cajatambo",
        "districts": [
          {
            "code": "LIM-CAJ-CAJ",
            "name": "Cajatambo",
            "postalCodes": [
              "15195"
            ]
          },
          {
            "code": "LIM-CAJ-COP",
            "name": "Copa",
            "postalCodes": [
              "15197"
            ]
          },
          {
            "code": "LIM-CAJ-GOR",
            "name": "Gorgor",
            "postalCodes": [
              "15190"
            ]
          },
          {
            "code": "LIM-CAJ-HUA",
            "name": "Huancapón",
            "postalCodes": [
              "15191"
            ]
          },
          {
            "code": "LIM-CAJ-MAN",
            "name": "Manas",
            "postalCodes": [
              "15185"
            ]
          }
        ],
        "cities": [
          {
            "code": "LIM-CAJ-CAJ",
            "name": "Cajatambo",
            "postalCodes": [
              "15195"
            ]
          },
          {
            "code": "ANC-OCR-COP",
            "name": "Copa",
            "postalCodes": [
              "02520",
              "15197"
            ]
          },
          {
            "code": "LIM-CAJ-GOR",
            "name": "Gorgor",
            "postalCodes": [
              "15190"
            ]
          },
          {
            "code": "LIM-CAJ-HUA",
            "name": "Huancapon",
            "postalCodes": [
              "15191"
            ]
          },
          {
            "code": "LIM-CAJ-MAN",
            "name": "Manas",
            "postalCodes": [
              "15185"
            ]
          }
        ]
      },
      {
        "code": "LIM-CAN",
        "name": "Canta",
        "districts": [
          {
            "code": "LIM-CAN-ARA",
            "name": "Arahuay",
            "postalCodes": [
              "15340"
            ]
          },
          {
            "code": "LIM-CAN-CAN",
            "name": "Canta",
            "postalCodes": [
              "15360"
            ]
          },
          {
            "code": "LIM-CAN-HUA",
            "name": "Huamantanga",
            "postalCodes": [
              "15355"
            ]
          },
          {
            "code": "LIM-CAN-HUA",
            "name": "Huaros",
            "postalCodes": [
              "15365"
            ]
          },
          {
            "code": "LIM-CAN-LAC",
            "name": "Lachaqui",
            "postalCodes": [
              "15345"
            ]
          },
          {
            "code": "LIM-CAN-SAN",
            "name": "San Buenaventura",
            "postalCodes": [
              "15350"
            ]
          },
          {
            "code": "LIM-CAN-SAN",
            "name": "Santa Rosa de Quives",
            "postalCodes": [
              "15335",
              "15336"
            ]
          }
        ],
        "cities": [
          {
            "code": "LIM-CAN-ARA",
            "name": "Arahuay",
            "postalCodes": [
              "15340"
            ]
          },
          {
            "code": "LIM-CAN-CAN",
            "name": "Canta",
            "postalCodes": [
              "15360"
            ]
          },
          {
            "code": "LIM-CAN-HUA",
            "name": "Huamantanga",
            "postalCodes": [
              "15355"
            ]
          },
          {
            "code": "LIM-CAN-HUA",
            "name": "Huaros",
            "postalCodes": [
              "15365"
            ]
          },
          {
            "code": "LIM-CAN-LAC",
            "name": "Lachaqui",
            "postalCodes": [
              "15345"
            ]
          },
          {
            "code": "HUA-MAR-SAN",
            "name": "San Buenaventura",
            "postalCodes": [
              "10870",
              "15350"
            ]
          },
          {
            "code": "LIM-CAN-YAN",
            "name": "Yangas",
            "postalCodes": [
              "15335",
              "15336"
            ]
          }
        ]
      },
      {
        "code": "LIM-CAÑ",
        "name": "Cañete",
        "districts": [
          {
            "code": "LIM-CAÑ-ASI",
            "name": "Asia",
            "postalCodes": [
              "15690",
              "15689"
            ]
          },
          {
            "code": "LIM-CAÑ-CAL",
            "name": "Calango",
            "postalCodes": [
              "15615"
            ]
          },
          {
            "code": "LIM-CAÑ-CER",
            "name": "Cerro Azul",
            "postalCodes": [
              "15717",
              "15716"
            ]
          },
          {
            "code": "LIM-CAÑ-CHI",
            "name": "Chilca",
            "postalCodes": [
              "15870",
              "15871"
            ]
          },
          {
            "code": "LIM-CAÑ-COA",
            "name": "Coayllo",
            "postalCodes": [
              "15685"
            ]
          },
          {
            "code": "LIM-CAÑ-IMP",
            "name": "Imperial",
            "postalCodes": [
              "15700",
              "15701"
            ]
          },
          {
            "code": "LIM-CAÑ-LUN",
            "name": "Lunahuana",
            "postalCodes": [
              "15727"
            ]
          },
          {
            "code": "LIM-CAÑ-MAL",
            "name": "Mala",
            "postalCodes": [
              "15608",
              "15610"
            ]
          },
          {
            "code": "LIM-CAÑ-NUE",
            "name": "Nuevo Imperial",
            "postalCodes": [
              "15723",
              "15725"
            ]
          },
          {
            "code": "LIM-CAÑ-PAC",
            "name": "Pacarán",
            "postalCodes": [
              "15730"
            ]
          },
          {
            "code": "LIM-CAÑ-QUI",
            "name": "Quilmana",
            "postalCodes": [
              "15715",
              "15712"
            ]
          },
          {
            "code": "LIM-CAÑ-SAN",
            "name": "San Antonio",
            "postalCodes": [
              "15600"
            ]
          },
          {
            "code": "LIM-CAÑ-SAN",
            "name": "San Luis",
            "postalCodes": [
              "15720",
              "15719"
            ]
          },
          {
            "code": "LIM-CAÑ-SAN",
            "name": "San Vicente de Cañete",
            "postalCodes": [
              "15700",
              "15701"
            ]
          },
          {
            "code": "LIM-CAÑ-SAN",
            "name": "Santa Cruz de Flores",
            "postalCodes": [
              "15605"
            ]
          },
          {
            "code": "LIM-CAÑ-ZUÑ",
            "name": "Zuñiga",
            "postalCodes": [
              "15735"
            ]
          }
        ],
        "cities": [
          {
            "code": "LIM-CAÑ-ASI",
            "name": "Asia",
            "postalCodes": [
              "15689",
              "15690"
            ]
          },
          {
            "code": "LIM-CAÑ-CAL",
            "name": "Calango",
            "postalCodes": [
              "15615"
            ]
          },
          {
            "code": "LIM-CAÑ-CER",
            "name": "Cerro Azul",
            "postalCodes": [
              "15716",
              "15717"
            ]
          },
          {
            "code": "JUN-HUA-CHI",
            "name": "Chilca",
            "postalCodes": [
              "12000",
              "12001",
              "12002",
              "12003",
              "12051",
              "15870",
              "15871"
            ]
          },
          {
            "code": "LIM-CAÑ-COA",
            "name": "Coayllo",
            "postalCodes": [
              "15685"
            ]
          },
          {
            "code": "LIM-CAÑ-IMP",
            "name": "Imperial",
            "postalCodes": [
              "15700",
              "15701"
            ]
          },
          {
            "code": "LIM-CAÑ-LUN",
            "name": "Lunahuana",
            "postalCodes": [
              "15727"
            ]
          },
          {
            "code": "LIM-CAÑ-MAL",
            "name": "Mala",
            "postalCodes": [
              "15608",
              "15610"
            ]
          },
          {
            "code": "LIM-CAÑ-NUE",
            "name": "Nuevo Imperial",
            "postalCodes": [
              "15723",
              "15725"
            ]
          },
          {
            "code": "LIM-CAÑ-PAC",
            "name": "Pacaran",
            "postalCodes": [
              "15730"
            ]
          },
          {
            "code": "LIM-CAÑ-QUI",
            "name": "Quilmana",
            "postalCodes": [
              "15712",
              "15715"
            ]
          },
          {
            "code": "APU-GRA-SAN",
            "name": "San Antonio",
            "postalCodes": [
              "03330",
              "15600",
              "22215"
            ]
          },
          {
            "code": "ANC-CAR-SAN",
            "name": "San Luis",
            "postalCodes": [
              "02310",
              "02311",
              "15004",
              "15019",
              "15021",
              "15022",
              "15719",
              "15720"
            ]
          },
          {
            "code": "LIM-CAÑ-SAN",
            "name": "San Vicente de Cañete",
            "postalCodes": [
              "15700",
              "15701"
            ]
          },
          {
            "code": "LIM-CAÑ-SAN",
            "name": "Santa Cruz de Flores",
            "postalCodes": [
              "15605"
            ]
          },
          {
            "code": "LIM-CAÑ-ZUÑ",
            "name": "Zuñiga",
            "postalCodes": [
              "15735"
            ]
          }
        ]
      },
      {
        "code": "LIM-HUA",
        "name": "Huaral",
        "districts": [
          {
            "code": "LIM-HUA-ATA",
            "name": "Atavillos Alto",
            "postalCodes": [
              "15225"
            ]
          },
          {
            "code": "LIM-HUA-ATA",
            "name": "Atavillos Bajo",
            "postalCodes": [
              "15205"
            ]
          },
          {
            "code": "LIM-HUA-AUC",
            "name": "Aucallama",
            "postalCodes": [
              "15126",
              "15125"
            ]
          },
          {
            "code": "LIM-HUA-CHA",
            "name": "Chancay",
            "postalCodes": [
              "15131",
              "15130"
            ]
          },
          {
            "code": "LIM-HUA-HUA",
            "name": "Huaral",
            "postalCodes": [
              "15201",
              "15202",
              "15200"
            ]
          },
          {
            "code": "LIM-HUA-IHU",
            "name": "Ihuari",
            "postalCodes": [
              "15245"
            ]
          },
          {
            "code": "LIM-HUA-LAM",
            "name": "Lampian",
            "postalCodes": [
              "15220"
            ]
          },
          {
            "code": "LIM-HUA-PAC",
            "name": "Pacaraos",
            "postalCodes": [
              "15230"
            ]
          },
          {
            "code": "LIM-HUA-SAN",
            "name": "San Miguel de Acos",
            "postalCodes": [
              "15215"
            ]
          },
          {
            "code": "LIM-HUA-SAN",
            "name": "Santa Cruz de Andamarca",
            "postalCodes": [
              "15235"
            ]
          },
          {
            "code": "LIM-HUA-SUM",
            "name": "Sumbilca",
            "postalCodes": [
              "15210"
            ]
          },
          {
            "code": "LIM-HUA-VEI",
            "name": "Veintisiete de Noviembre",
            "postalCodes": [
              "15221"
            ]
          }
        ],
        "cities": [
          {
            "code": "CUZ-ACO-ACO",
            "name": "Acos",
            "postalCodes": [
              "08545",
              "15215"
            ]
          },
          {
            "code": "LIM-HUA-AUC",
            "name": "Aucallama",
            "postalCodes": [
              "15125",
              "15126"
            ]
          },
          {
            "code": "LIM-HUA-CAR",
            "name": "Carac",
            "postalCodes": [
              "15221"
            ]
          },
          {
            "code": "CAJ-SAN-CHA",
            "name": "Chancay",
            "postalCodes": [
              "06330",
              "15130",
              "15131"
            ]
          },
          {
            "code": "LIM-HUA-HUA",
            "name": "Huaral",
            "postalCodes": [
              "15200",
              "15201",
              "15202"
            ]
          },
          {
            "code": "LIM-HUA-IHU",
            "name": "Ihuari",
            "postalCodes": [
              "15245"
            ]
          },
          {
            "code": "LIM-HUA-LAM",
            "name": "Lampian",
            "postalCodes": [
              "15220"
            ]
          },
          {
            "code": "LIM-HUA-PAC",
            "name": "Pacaraos",
            "postalCodes": [
              "15230"
            ]
          },
          {
            "code": "LIM-HUA-PIR",
            "name": "Pirca",
            "postalCodes": [
              "15225"
            ]
          },
          {
            "code": "LIM-HUA-SAN",
            "name": "San Agustin de Huayopampa",
            "postalCodes": [
              "15205"
            ]
          },
          {
            "code": "LIM-HUA-SAN",
            "name": "Santa Cruz de Andamarca",
            "postalCodes": [
              "15235"
            ]
          },
          {
            "code": "LIM-HUA-SUM",
            "name": "Sumbilca",
            "postalCodes": [
              "15210"
            ]
          }
        ]
      },
      {
        "code": "LIM-HUA",
        "name": "Huarochiri",
        "districts": [
          {
            "code": "LIM-HUA-ANT",
            "name": "Antioquía",
            "postalCodes": [
              "15586"
            ]
          },
          {
            "code": "LIM-HUA-CAL",
            "name": "Callahuanca",
            "postalCodes": [
              "15505"
            ]
          },
          {
            "code": "LIM-HUA-CAR",
            "name": "Carampoma",
            "postalCodes": [
              "15525"
            ]
          },
          {
            "code": "LIM-HUA-CHI",
            "name": "Chicla",
            "postalCodes": [
              "15565",
              "15564"
            ]
          },
          {
            "code": "LIM-HUA-CUE",
            "name": "Cuenca",
            "postalCodes": [
              "15585"
            ]
          },
          {
            "code": "LIM-HUA-HUA",
            "name": "Huachupampa",
            "postalCodes": [
              "15516"
            ]
          },
          {
            "code": "LIM-HUA-HUA",
            "name": "Huanza",
            "postalCodes": [
              "15535"
            ]
          },
          {
            "code": "LIM-HUA-HUA",
            "name": "Huarochiri",
            "postalCodes": [
              "15635"
            ]
          },
          {
            "code": "LIM-HUA-LAH",
            "name": "Lahuaytambo",
            "postalCodes": [
              "15577"
            ]
          },
          {
            "code": "LIM-HUA-LAN",
            "name": "Langa",
            "postalCodes": [
              "15580"
            ]
          },
          {
            "code": "LIM-HUA-LAR",
            "name": "Laraos",
            "postalCodes": [
              "15530"
            ]
          },
          {
            "code": "LIM-HUA-MAR",
            "name": "Mariatana",
            "postalCodes": [
              "15630"
            ]
          },
          {
            "code": "LIM-HUA-MAT",
            "name": "Matucana",
            "postalCodes": [
              "15556"
            ]
          },
          {
            "code": "LIM-HUA-RIC",
            "name": "Ricardo Palma",
            "postalCodes": [
              "15536",
              "15537"
            ]
          },
          {
            "code": "LIM-HUA-SAN",
            "name": "San Andres de Tupicocha",
            "postalCodes": [
              "15571"
            ]
          },
          {
            "code": "LIM-HUA-SAN",
            "name": "San Antonio",
            "postalCodes": [
              "15510"
            ]
          },
          {
            "code": "LIM-HUA-SAN",
            "name": "San Bartolomé",
            "postalCodes": [
              "15550"
            ]
          },
          {
            "code": "LIM-HUA-SAN",
            "name": "San Damian",
            "postalCodes": [
              "15575"
            ]
          },
          {
            "code": "LIM-HUA-SAN",
            "name": "San Juan de Irís",
            "postalCodes": [
              "15520"
            ]
          },
          {
            "code": "LIM-HUA-SAN",
            "name": "San Juan de Tantaranche",
            "postalCodes": [
              "15650"
            ]
          },
          {
            "code": "LIM-HUA-SAN",
            "name": "San Lorenzo de Quinti",
            "postalCodes": [
              "15640"
            ]
          },
          {
            "code": "LIM-HUA-SAN",
            "name": "San Mateo",
            "postalCodes": [
              "15561",
              "15560"
            ]
          },
          {
            "code": "LIM-HUA-SAN",
            "name": "San Mateo de Otao",
            "postalCodes": [
              "15540"
            ]
          },
          {
            "code": "LIM-HUA-SAN",
            "name": "San Pedro de Casta",
            "postalCodes": [
              "15515"
            ]
          },
          {
            "code": "LIM-HUA-SAN",
            "name": "San Pedro de Huancayre",
            "postalCodes": [
              "15641"
            ]
          },
          {
            "code": "LIM-HUA-SAN",
            "name": "Sangallaya",
            "postalCodes": [
              "15625"
            ]
          },
          {
            "code": "LIM-HUA-SAN",
            "name": "Santa Cruz de Cocachacra",
            "postalCodes": [
              "15545"
            ]
          },
          {
            "code": "LIM-HUA-SAN",
            "name": "Santa Eulalia",
            "postalCodes": [
              "15501",
              "15500"
            ]
          },
          {
            "code": "LIM-HUA-SAN",
            "name": "Santiago de Anchucaya",
            "postalCodes": [
              "15645"
            ]
          },
          {
            "code": "LIM-HUA-SAN",
            "name": "Santiago de Tuna",
            "postalCodes": [
              "15570"
            ]
          },
          {
            "code": "LIM-HUA-SAN",
            "name": "Santo Domingo de los Olleros",
            "postalCodes": [
              "15590"
            ]
          },
          {
            "code": "LIM-HUA-SUR",
            "name": "Surco",
            "postalCodes": [
              "15555"
            ]
          }
        ],
        "cities": [
          {
            "code": "LIM-HUA-ANT",
            "name": "Antioquia",
            "postalCodes": [
              "15586"
            ]
          },
          {
            "code": "LIM-HUA-CAL",
            "name": "Callahuanca",
            "postalCodes": [
              "15505"
            ]
          },
          {
            "code": "LIM-HUA-CAR",
            "name": "Carampoma",
            "postalCodes": [
              "15525"
            ]
          },
          {
            "code": "LIM-HUA-CHA",
            "name": "Chaclla",
            "postalCodes": [
              "15510"
            ]
          },
          {
            "code": "LIM-HUA-CHI",
            "name": "Chicla",
            "postalCodes": [
              "15564",
              "15565"
            ]
          },
          {
            "code": "ARE-ISL-COC",
            "name": "Cocachacra",
            "postalCodes": [
              "04430",
              "04431",
              "15545"
            ]
          },
          {
            "code": "LIM-HUA-HUA",
            "name": "Huanza",
            "postalCodes": [
              "15535"
            ]
          },
          {
            "code": "LIM-HUA-HUA",
            "name": "Huarochiri",
            "postalCodes": [
              "15635"
            ]
          },
          {
            "code": "LIM-HUA-LAH",
            "name": "Lahuaytambo",
            "postalCodes": [
              "15577"
            ]
          },
          {
            "code": "LIM-HUA-LAN",
            "name": "Langa",
            "postalCodes": [
              "15580"
            ]
          },
          {
            "code": "LIM-HUA-LAR",
            "name": "Laraos",
            "postalCodes": [
              "15530",
              "15785"
            ]
          },
          {
            "code": "LIM-HUA-MAR",
            "name": "Mariatana",
            "postalCodes": [
              "15630"
            ]
          },
          {
            "code": "LIM-HUA-MAT",
            "name": "Matucana",
            "postalCodes": [
              "15556"
            ]
          },
          {
            "code": "LIM-HUA-RIC",
            "name": "Ricardo Palma",
            "postalCodes": [
              "15536",
              "15537"
            ]
          },
          {
            "code": "LIM-HUA-SAN",
            "name": "San Andres de Tupicocha",
            "postalCodes": [
              "15571"
            ]
          },
          {
            "code": "LIM-HUA-SAN",
            "name": "San Bartolome",
            "postalCodes": [
              "15550"
            ]
          },
          {
            "code": "LIM-HUA-SAN",
            "name": "San Damian",
            "postalCodes": [
              "15575"
            ]
          },
          {
            "code": "LIM-HUA-SAN",
            "name": "San Jose de los Chorrillos",
            "postalCodes": [
              "15585"
            ]
          },
          {
            "code": "LIM-HUA-SAN",
            "name": "San Juan de Iris",
            "postalCodes": [
              "15520"
            ]
          },
          {
            "code": "LIM-HUA-SAN",
            "name": "San Juan de Lanca",
            "postalCodes": [
              "15540"
            ]
          },
          {
            "code": "LIM-HUA-SAN",
            "name": "San Juan de Tantaranche",
            "postalCodes": [
              "15650"
            ]
          },
          {
            "code": "LIM-HUA-SAN",
            "name": "San Lorenzo de Huachupampa",
            "postalCodes": [
              "15516"
            ]
          },
          {
            "code": "LIM-HUA-SAN",
            "name": "San Lorenzo de Quinti",
            "postalCodes": [
              "15640"
            ]
          },
          {
            "code": "LIM-HUA-SAN",
            "name": "San Mateo",
            "postalCodes": [
              "15560",
              "15561"
            ]
          },
          {
            "code": "AYA-LUC-SAN",
            "name": "San Pedro",
            "postalCodes": [
              "05510",
              "08245",
              "11700",
              "11703",
              "15641"
            ]
          },
          {
            "code": "LIM-HUA-SAN",
            "name": "San Pedro de Casta",
            "postalCodes": [
              "15515"
            ]
          },
          {
            "code": "LIM-HUA-SAN",
            "name": "Sangallaya",
            "postalCodes": [
              "15625"
            ]
          },
          {
            "code": "LIM-HUA-SAN",
            "name": "Santa Eulalia",
            "postalCodes": [
              "15500",
              "15501"
            ]
          },
          {
            "code": "LIM-HUA-SAN",
            "name": "Santiago de Anchucaya",
            "postalCodes": [
              "15645"
            ]
          },
          {
            "code": "LIM-HUA-SAN",
            "name": "Santiago de Tuna",
            "postalCodes": [
              "15570"
            ]
          },
          {
            "code": "LIM-HUA-SAN",
            "name": "Santo Domingo de los Olleros",
            "postalCodes": [
              "15590"
            ]
          },
          {
            "code": "LIM-HUA-SUR",
            "name": "Surco",
            "postalCodes": [
              "15555"
            ]
          }
        ]
      },
      {
        "code": "LIM-HUA",
        "name": "Huaura",
        "districts": [
          {
            "code": "LIM-HUA-AMB",
            "name": "Ambar",
            "postalCodes": [
              "15182"
            ]
          },
          {
            "code": "LIM-HUA-CAL",
            "name": "Caleta de Carquín",
            "postalCodes": [
              "15138"
            ]
          },
          {
            "code": "LIM-HUA-CHE",
            "name": "Checras",
            "postalCodes": [
              "15280"
            ]
          },
          {
            "code": "LIM-HUA-HUA",
            "name": "Huacho",
            "postalCodes": [
              "15135",
              "15138",
              "15136",
              "15137"
            ]
          },
          {
            "code": "LIM-HUA-HUA",
            "name": "Hualmay",
            "postalCodes": [
              "15138",
              "15137"
            ]
          },
          {
            "code": "LIM-HUA-HUA",
            "name": "Huaura",
            "postalCodes": [
              "15135",
              "15138"
            ]
          },
          {
            "code": "LIM-HUA-LEO",
            "name": "Leoncio Prado",
            "postalCodes": [
              "15246"
            ]
          },
          {
            "code": "LIM-HUA-PAC",
            "name": "Paccho",
            "postalCodes": [
              "15255"
            ]
          },
          {
            "code": "LIM-HUA-SAN",
            "name": "Santa Leonor",
            "postalCodes": [
              "15285"
            ]
          },
          {
            "code": "LIM-HUA-SAN",
            "name": "Santa María",
            "postalCodes": [
              "15135",
              "15138",
              "15137"
            ]
          },
          {
            "code": "LIM-HUA-SAY",
            "name": "Sayán",
            "postalCodes": [
              "15240",
              "15237"
            ]
          },
          {
            "code": "LIM-HUA-VEG",
            "name": "Vegueta",
            "postalCodes": [
              "15157",
              "15160"
            ]
          }
        ],
        "cities": [
          {
            "code": "LIM-HUA-AMB",
            "name": "Ambar",
            "postalCodes": [
              "15182"
            ]
          },
          {
            "code": "LIM-HUA-CAL",
            "name": "Caleta de Carquin",
            "postalCodes": [
              "15138"
            ]
          },
          {
            "code": "LIM-HUA-CRU",
            "name": "Cruz Blanca",
            "postalCodes": [
              "15135",
              "15137",
              "15138"
            ]
          },
          {
            "code": "LIM-HUA-HUA",
            "name": "Huacho",
            "postalCodes": [
              "15135",
              "15136",
              "15137",
              "15138"
            ]
          },
          {
            "code": "LIM-HUA-HUA",
            "name": "Hualmay",
            "postalCodes": [
              "15137",
              "15138"
            ]
          },
          {
            "code": "LIM-HUA-HUA",
            "name": "Huaura",
            "postalCodes": [
              "15135",
              "15138"
            ]
          },
          {
            "code": "LIM-HUA-JUC",
            "name": "Jucul",
            "postalCodes": [
              "15285"
            ]
          },
          {
            "code": "LIM-HUA-MAR",
            "name": "Maray",
            "postalCodes": [
              "15280"
            ]
          },
          {
            "code": "LIM-HUA-PAC",
            "name": "Paccho",
            "postalCodes": [
              "15255"
            ]
          },
          {
            "code": "CAJ-CUT-SAN",
            "name": "Santa Cruz",
            "postalCodes": [
              "06715",
              "11300",
              "15246",
              "16540"
            ]
          },
          {
            "code": "LIM-HUA-SAY",
            "name": "Sayan",
            "postalCodes": [
              "15237",
              "15240"
            ]
          },
          {
            "code": "LIM-HUA-VEG",
            "name": "Vegueta",
            "postalCodes": [
              "15157",
              "15160"
            ]
          }
        ]
      },
      {
        "code": "LIM-LIM",
        "name": "Lima",
        "districts": [
          {
            "code": "LIM-LIM-ANC",
            "name": "Ancón",
            "postalCodes": [
              "15123"
            ]
          },
          {
            "code": "LIM-LIM-ATE",
            "name": "Ate",
            "postalCodes": [
              "15498",
              "15491",
              "15004",
              "15023",
              "15022",
              "15026",
              "15483",
              "15494",
              "15476",
              "15479",
              "15012",
              "15487",
              "15019",
              "15011"
            ]
          },
          {
            "code": "LIM-LIM-BAR",
            "name": "Barranco",
            "postalCodes": [
              "15049",
              "15063",
              "15047"
            ]
          },
          {
            "code": "LIM-LIM-BRE",
            "name": "Breña",
            "postalCodes": [
              "15083",
              "15082"
            ]
          },
          {
            "code": "LIM-LIM-CAR",
            "name": "Carabayllo",
            "postalCodes": [
              "15321",
              "15316",
              "15319",
              "15121",
              "15122",
              "15313",
              "15320",
              "15324",
              "15318"
            ]
          },
          {
            "code": "LIM-LIM-CHA",
            "name": "Chaclacayo",
            "postalCodes": [
              "15472",
              "15476"
            ]
          },
          {
            "code": "LIM-LIM-CHO",
            "name": "Chorrillos",
            "postalCodes": [
              "15056",
              "15058",
              "15066",
              "15064",
              "15063",
              "15054",
              "15067",
              "15057"
            ]
          },
          {
            "code": "LIM-LIM-CIE",
            "name": "Cieneguilla",
            "postalCodes": [
              "15594",
              "15593"
            ]
          },
          {
            "code": "LIM-LIM-COM",
            "name": "Comas",
            "postalCodes": [
              "15316",
              "15311",
              "15332",
              "15312",
              "15313",
              "15328",
              "15314",
              "15324",
              "15327",
              "15326"
            ]
          },
          {
            "code": "LIM-LIM-EL ",
            "name": "El Agustino",
            "postalCodes": [
              "15004",
              "15007",
              "15022",
              "15008",
              "15003",
              "15009",
              "15011",
              "15006",
              "15018"
            ]
          },
          {
            "code": "LIM-LIM-IND",
            "name": "Independencia",
            "postalCodes": [
              "15311",
              "15332",
              "15331",
              "15328",
              "15333"
            ]
          },
          {
            "code": "LIM-LIM-JES",
            "name": "Jesús María",
            "postalCodes": [
              "15084",
              "15073",
              "15083",
              "15076",
              "15046",
              "15072"
            ]
          },
          {
            "code": "LIM-LIM-LA ",
            "name": "La Molina",
            "postalCodes": [
              "15023",
              "15026",
              "15024",
              "15012"
            ]
          },
          {
            "code": "LIM-LIM-LA ",
            "name": "La Victoria",
            "postalCodes": [
              "15019",
              "15033",
              "15034",
              "15018"
            ]
          },
          {
            "code": "LIM-LIM-LIM",
            "name": "Lima",
            "postalCodes": [
              "15004",
              "15046",
              "15082",
              "15001",
              "15083",
              "15079",
              "15081",
              "15003",
              "15018",
              "15088",
              "15019",
              "15006",
              "15072"
            ]
          },
          {
            "code": "LIM-LIM-LIN",
            "name": "Lince",
            "postalCodes": [
              "15073",
              "15076",
              "15072",
              "15046"
            ]
          },
          {
            "code": "LIM-LIM-LOS",
            "name": "Los Olivos",
            "postalCodes": [
              "15113",
              "15311",
              "15302",
              "15304",
              "15307",
              "15314",
              "15306",
              "15301"
            ]
          },
          {
            "code": "LIM-LIM-LUR",
            "name": "Lurigancho",
            "postalCodes": [
              "15461",
              "15472",
              "15457",
              "15464",
              "15468"
            ]
          },
          {
            "code": "LIM-LIM-LUR",
            "name": "Lurín",
            "postalCodes": [
              "15846",
              "15823",
              "15842",
              "15841",
              "15822"
            ]
          },
          {
            "code": "LIM-LIM-MAG",
            "name": "Magdalena Vieja",
            "postalCodes": [
              "15083",
              "15084",
              "15086",
              "15088"
            ]
          },
          {
            "code": "LIM-LIM-MAG",
            "name": "Magdalena del Mar",
            "postalCodes": [
              "15076",
              "15086"
            ]
          },
          {
            "code": "LIM-LIM-MIR",
            "name": "Miraflores",
            "postalCodes": [
              "15073",
              "15076",
              "15047",
              "15046",
              "15048",
              "15074"
            ]
          },
          {
            "code": "LIM-LIM-PAC",
            "name": "Pachacamac",
            "postalCodes": [
              "15594",
              "15593",
              "15823"
            ]
          },
          {
            "code": "LIM-LIM-PUC",
            "name": "Pucusana",
            "postalCodes": [
              "15866",
              "15865"
            ]
          },
          {
            "code": "LIM-LIM-PUE",
            "name": "Puente Piedra",
            "postalCodes": [
              "15113",
              "15121",
              "15122",
              "15117",
              "15118",
              "15116"
            ]
          },
          {
            "code": "LIM-LIM-PUN",
            "name": "Punta Hermosa",
            "postalCodes": [
              "15846",
              "15845"
            ]
          },
          {
            "code": "LIM-LIM-PUN",
            "name": "Punta Negra",
            "postalCodes": [
              "15850",
              "15851"
            ]
          },
          {
            "code": "LIM-LIM-RIM",
            "name": "Rimac",
            "postalCodes": [
              "15093",
              "15096",
              "15333",
              "15094"
            ]
          },
          {
            "code": "LIM-LIM-SAN",
            "name": "San Bartolo",
            "postalCodes": [
              "15856",
              "15855"
            ]
          },
          {
            "code": "LIM-LIM-SAN",
            "name": "San Borja",
            "postalCodes": [
              "15036",
              "15034",
              "15021",
              "15037"
            ]
          },
          {
            "code": "LIM-LIM-SAN",
            "name": "San Isidro",
            "postalCodes": [
              "15073",
              "15076",
              "15047",
              "15046",
              "15036",
              "15074",
              "15072"
            ]
          },
          {
            "code": "LIM-LIM-SAN",
            "name": "San Juan de Lurigancho",
            "postalCodes": [
              "15431",
              "15412",
              "15408",
              "15434",
              "15423",
              "15416",
              "15457",
              "15427",
              "15453",
              "15419",
              "15438",
              "15446",
              "15442",
              "15449",
              "15404",
              "15401"
            ]
          },
          {
            "code": "LIM-LIM-SAN",
            "name": "San Juan de Miraflores",
            "postalCodes": [
              "15056",
              "15829",
              "15058",
              "15801",
              "15824",
              "15842",
              "15806",
              "15809",
              "15803",
              "15828",
              "15804"
            ]
          },
          {
            "code": "LIM-LIM-SAN",
            "name": "San Luis",
            "postalCodes": [
              "15019",
              "15004",
              "15022",
              "15021"
            ]
          },
          {
            "code": "LIM-LIM-SAN",
            "name": "San Martin de Porres",
            "postalCodes": [
              "15113",
              "15102",
              "15109",
              "15101",
              "15107",
              "15103",
              "15108",
              "15112",
              "15106"
            ]
          },
          {
            "code": "LIM-LIM-SAN",
            "name": "San Miguel",
            "postalCodes": [
              "15084",
              "15086",
              "15087",
              "15088"
            ]
          },
          {
            "code": "LIM-LIM-SAN",
            "name": "Santa Anita",
            "postalCodes": [
              "15498",
              "15007",
              "15008",
              "15009",
              "15011"
            ]
          },
          {
            "code": "LIM-LIM-SAN",
            "name": "Santa Maria del Mar",
            "postalCodes": [
              "15861"
            ]
          },
          {
            "code": "LIM-LIM-SAN",
            "name": "Santa Rosa",
            "postalCodes": [
              "15123"
            ]
          },
          {
            "code": "LIM-LIM-SAN",
            "name": "Santiago de Surco",
            "postalCodes": [
              "15056",
              "15049",
              "15037",
              "15038",
              "15064",
              "15063",
              "15054",
              "15047",
              "15803",
              "15048",
              "15023",
              "15039",
              "15024"
            ]
          },
          {
            "code": "LIM-LIM-SUR",
            "name": "Surquillo",
            "postalCodes": [
              "15037",
              "15048",
              "15047",
              "15036",
              "15038"
            ]
          },
          {
            "code": "LIM-LIM-VIL",
            "name": "Villa Maria del Triunfo",
            "postalCodes": [
              "15816",
              "15812",
              "15824",
              "15818",
              "15809",
              "15803",
              "15811",
              "15828",
              "15822",
              "15817",
              "15804"
            ]
          },
          {
            "code": "LIM-LIM-VIL",
            "name": "Villa el Salvador",
            "postalCodes": [
              "15816",
              "15829",
              "15836",
              "15831",
              "15842",
              "15837",
              "15841",
              "15828",
              "15834"
            ]
          }
        ],
        "cities": [
          {
            "code": "LIM-LIM-ANC",
            "name": "Ancon",
            "postalCodes": [
              "15123"
            ]
          },
          {
            "code": "LIM-LIM-BAR",
            "name": "Barranco",
            "postalCodes": [
              "15047",
              "15049",
              "15063"
            ]
          },
          {
            "code": "LIM-LIM-BAR",
            "name": "Barrio Obrero Industrial",
            "postalCodes": [
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
            "code": "LIM-LIM-BRE",
            "name": "Breña",
            "postalCodes": [
              "15082",
              "15083"
            ]
          },
          {
            "code": "LIM-LIM-CAR",
            "name": "Carabayllo",
            "postalCodes": [
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
            "code": "LIM-LIM-CHA",
            "name": "Chaclacayo",
            "postalCodes": [
              "15472",
              "15476"
            ]
          },
          {
            "code": "LIM-LIM-CHO",
            "name": "Chorrillos",
            "postalCodes": [
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
            "code": "LIM-LIM-CHO",
            "name": "Chosica",
            "postalCodes": [
              "15457",
              "15461",
              "15464",
              "15468",
              "15472"
            ]
          },
          {
            "code": "LIM-LIM-CIE",
            "name": "Cieneguilla",
            "postalCodes": [
              "15593",
              "15594"
            ]
          },
          {
            "code": "LIM-LIM-CIU",
            "name": "Ciudad de Dios",
            "postalCodes": [
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
            "code": "LIM-LIM-EL ",
            "name": "El Agustino",
            "postalCodes": [
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
            "code": "ICA-PIS-IND",
            "name": "Independencia",
            "postalCodes": [
              "11640",
              "11641",
              "15311",
              "15328",
              "15331",
              "15332",
              "15333"
            ]
          },
          {
            "code": "LIM-LIM-JES",
            "name": "Jesus Maria",
            "postalCodes": [
              "15046",
              "15072",
              "15073",
              "15076",
              "15083",
              "15084"
            ]
          },
          {
            "code": "ARE-ARE-LA ",
            "name": "La Libertad",
            "postalCodes": [
              "04000",
              "04013",
              "04014",
              "04016",
              "04017",
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
            "code": "LIM-LIM-LA ",
            "name": "La Molina",
            "postalCodes": [
              "15012",
              "15023",
              "15024",
              "15026"
            ]
          },
          {
            "code": "LAM-CHI-LA ",
            "name": "La Victoria",
            "postalCodes": [
              "14000",
              "14007",
              "14008",
              "15018",
              "15019",
              "15033",
              "15034"
            ]
          },
          {
            "code": "LIM-LIM-LAS",
            "name": "Las Palmeras",
            "postalCodes": [
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
            "code": "LIM-LIM-LIM",
            "name": "Lima",
            "postalCodes": [
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
            "code": "LIM-LIM-LIN",
            "name": "Lince",
            "postalCodes": [
              "15046",
              "15072",
              "15073",
              "15076"
            ]
          },
          {
            "code": "LIM-LIM-LUR",
            "name": "Lurin",
            "postalCodes": [
              "15822",
              "15823",
              "15841",
              "15842",
              "15846"
            ]
          },
          {
            "code": "LIM-LIM-MAG",
            "name": "Magdalena del Mar",
            "postalCodes": [
              "15076",
              "15086"
            ]
          },
          {
            "code": "ARE-ARE-MIR",
            "name": "Miraflores",
            "postalCodes": [
              "04001",
              "04004",
              "10680",
              "15046",
              "15047",
              "15048",
              "15073",
              "15074",
              "15076",
              "15792"
            ]
          },
          {
            "code": "LIM-LIM-PAC",
            "name": "Pachacamac",
            "postalCodes": [
              "15593",
              "15594",
              "15823"
            ]
          },
          {
            "code": "LIM-LIM-PUC",
            "name": "Pucusana",
            "postalCodes": [
              "15865",
              "15866"
            ]
          },
          {
            "code": "LIM-LIM-PUE",
            "name": "Pueblo Libre",
            "postalCodes": [
              "15083",
              "15084",
              "15086",
              "15088"
            ]
          },
          {
            "code": "LIM-LIM-PUE",
            "name": "Puente Piedra",
            "postalCodes": [
              "15113",
              "15116",
              "15117",
              "15118",
              "15121",
              "15122"
            ]
          },
          {
            "code": "LIM-LIM-PUN",
            "name": "Punta Hermosa",
            "postalCodes": [
              "15845",
              "15846"
            ]
          },
          {
            "code": "LIM-LIM-PUN",
            "name": "Punta Negra",
            "postalCodes": [
              "15850",
              "15851"
            ]
          },
          {
            "code": "LIM-LIM-RIM",
            "name": "Rimac",
            "postalCodes": [
              "15093",
              "15094",
              "15096",
              "15333"
            ]
          },
          {
            "code": "LIM-LIM-SAN",
            "name": "San Bartolo",
            "postalCodes": [
              "15855",
              "15856"
            ]
          },
          {
            "code": "LIM-LIM-SAN",
            "name": "San Francisco de Borja",
            "postalCodes": [
              "15021",
              "15034",
              "15036",
              "15037"
            ]
          },
          {
            "code": "LIM-LIM-SAN",
            "name": "San Isidro",
            "postalCodes": [
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
            "code": "LIM-LIM-SAN",
            "name": "San Juan de Lurigancho",
            "postalCodes": [
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
            "code": "ANC-CAR-SAN",
            "name": "San Luis",
            "postalCodes": [
              "02310",
              "02311",
              "15004",
              "15019",
              "15021",
              "15022",
              "15719",
              "15720"
            ]
          },
          {
            "code": "AYA-LA -SAN",
            "name": "San Miguel",
            "postalCodes": [
              "05250",
              "05251",
              "12485",
              "15084",
              "15086",
              "15087",
              "15088"
            ]
          },
          {
            "code": "LIM-LIM-SAN",
            "name": "Santa Anita - los Ficus",
            "postalCodes": [
              "15007",
              "15008",
              "15009",
              "15011",
              "15498"
            ]
          },
          {
            "code": "LIM-LIM-SAN",
            "name": "Santa Maria del Mar",
            "postalCodes": [
              "15861"
            ]
          },
          {
            "code": "ANC-PAL-SAN",
            "name": "Santa Rosa",
            "postalCodes": [
              "02825",
              "03345",
              "05240",
              "05241",
              "06820",
              "06821",
              "12200",
              "14840",
              "14841",
              "15123",
              "21885",
              "21886",
              "22720",
              "22721"
            ]
          },
          {
            "code": "LIM-LIM-SAN",
            "name": "Santiago de Surco",
            "postalCodes": [
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
            "code": "LIM-LIM-SUR",
            "name": "Surquillo",
            "postalCodes": [
              "15036",
              "15037",
              "15038",
              "15047",
              "15048"
            ]
          },
          {
            "code": "LIM-LIM-VIL",
            "name": "Villa Maria del Triunfo",
            "postalCodes": [
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
            "code": "LIM-LIM-VIL",
            "name": "Villa el Salvador",
            "postalCodes": [
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
            "code": "LIM-LIM-VIT",
            "name": "Vitarte",
            "postalCodes": [
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
        "code": "LIM-OYÓ",
        "name": "Oyón",
        "districts": [
          {
            "code": "LIM-OYÓ-AND",
            "name": "Andajes",
            "postalCodes": [
              "15266"
            ]
          },
          {
            "code": "LIM-OYÓ-CAU",
            "name": "Caujul",
            "postalCodes": [
              "15265"
            ]
          },
          {
            "code": "LIM-OYÓ-COC",
            "name": "Cochamarca",
            "postalCodes": [
              "15250"
            ]
          },
          {
            "code": "LIM-OYÓ-NAV",
            "name": "Navan",
            "postalCodes": [
              "15260"
            ]
          },
          {
            "code": "LIM-OYÓ-OYÓ",
            "name": "Oyón",
            "postalCodes": [
              "15274",
              "15275"
            ]
          },
          {
            "code": "LIM-OYÓ-PAC",
            "name": "Pachangara",
            "postalCodes": [
              "15270"
            ]
          }
        ],
        "cities": [
          {
            "code": "LIM-OYÓ-AND",
            "name": "Andajes",
            "postalCodes": [
              "15266"
            ]
          },
          {
            "code": "LIM-OYÓ-CAU",
            "name": "Caujul",
            "postalCodes": [
              "15265"
            ]
          },
          {
            "code": "LIM-OYÓ-CHU",
            "name": "Churin",
            "postalCodes": [
              "15270"
            ]
          },
          {
            "code": "LIM-OYÓ-COC",
            "name": "Cochamarca",
            "postalCodes": [
              "15250"
            ]
          },
          {
            "code": "LIM-OYÓ-NAV",
            "name": "Navan",
            "postalCodes": [
              "15260"
            ]
          },
          {
            "code": "LIM-OYÓ-OYO",
            "name": "Oyon",
            "postalCodes": [
              "15274",
              "15275"
            ]
          }
        ]
      },
      {
        "code": "LIM-YAU",
        "name": "Yauyos",
        "districts": [
          {
            "code": "LIM-YAU-ALI",
            "name": "Alis",
            "postalCodes": [
              "15786"
            ]
          },
          {
            "code": "LIM-YAU-AYA",
            "name": "Ayauca",
            "postalCodes": [
              "15765"
            ]
          },
          {
            "code": "LIM-YAU-AYA",
            "name": "Ayavirí",
            "postalCodes": [
              "15675"
            ]
          },
          {
            "code": "LIM-YAU-AZA",
            "name": "Azangaro",
            "postalCodes": [
              "15740"
            ]
          },
          {
            "code": "LIM-YAU-CAC",
            "name": "Cacra",
            "postalCodes": [
              "15750"
            ]
          },
          {
            "code": "LIM-YAU-CAR",
            "name": "Carania",
            "postalCodes": [
              "15781"
            ]
          },
          {
            "code": "LIM-YAU-CAT",
            "name": "Catahuasi",
            "postalCodes": [
              "15760"
            ]
          },
          {
            "code": "LIM-YAU-CHO",
            "name": "Chocos",
            "postalCodes": [
              "15736"
            ]
          },
          {
            "code": "LIM-YAU-COC",
            "name": "Cochas",
            "postalCodes": [
              "15621"
            ]
          },
          {
            "code": "LIM-YAU-COL",
            "name": "Colonia",
            "postalCodes": [
              "15770"
            ]
          },
          {
            "code": "LIM-YAU-HON",
            "name": "Hongos",
            "postalCodes": [
              "15753"
            ]
          },
          {
            "code": "LIM-YAU-HUA",
            "name": "Huampara",
            "postalCodes": [
              "15670"
            ]
          },
          {
            "code": "LIM-YAU-HUA",
            "name": "Huancaya",
            "postalCodes": [
              "15796"
            ]
          },
          {
            "code": "LIM-YAU-HUA",
            "name": "Huangascar",
            "postalCodes": [
              "15748"
            ]
          },
          {
            "code": "LIM-YAU-HUA",
            "name": "Huantán",
            "postalCodes": [
              "15780"
            ]
          },
          {
            "code": "LIM-YAU-HUA",
            "name": "Huañec",
            "postalCodes": [
              "15661"
            ]
          },
          {
            "code": "LIM-YAU-LAR",
            "name": "Laraos",
            "postalCodes": [
              "15785"
            ]
          },
          {
            "code": "LIM-YAU-LIN",
            "name": "Lincha",
            "postalCodes": [
              "15755"
            ]
          },
          {
            "code": "LIM-YAU-MAD",
            "name": "Madean",
            "postalCodes": [
              "15742"
            ]
          },
          {
            "code": "LIM-YAU-MIR",
            "name": "Miraflores",
            "postalCodes": [
              "15792"
            ]
          },
          {
            "code": "LIM-YAU-OMA",
            "name": "Omas",
            "postalCodes": [
              "15681"
            ]
          },
          {
            "code": "LIM-YAU-PUT",
            "name": "Putinza",
            "postalCodes": [
              "15763"
            ]
          },
          {
            "code": "LIM-YAU-QUI",
            "name": "Quinches",
            "postalCodes": [
              "15665"
            ]
          },
          {
            "code": "LIM-YAU-QUI",
            "name": "Quinocay",
            "postalCodes": [
              "15620"
            ]
          },
          {
            "code": "LIM-YAU-SAN",
            "name": "San Joaquin",
            "postalCodes": [
              "15655"
            ]
          },
          {
            "code": "LIM-YAU-SAN",
            "name": "San Pedro de Pilas",
            "postalCodes": [
              "15680"
            ]
          },
          {
            "code": "LIM-YAU-TAN",
            "name": "Tanta",
            "postalCodes": [
              "15660"
            ]
          },
          {
            "code": "LIM-YAU-TAU",
            "name": "Tauripampa",
            "postalCodes": [
              "15768"
            ]
          },
          {
            "code": "LIM-YAU-TOM",
            "name": "Tomás",
            "postalCodes": [
              "15790"
            ]
          },
          {
            "code": "LIM-YAU-TUP",
            "name": "Tupe",
            "postalCodes": [
              "15761"
            ]
          },
          {
            "code": "LIM-YAU-VIT",
            "name": "Vitis",
            "postalCodes": [
              "15795"
            ]
          },
          {
            "code": "LIM-YAU-VIÑ",
            "name": "Viñac",
            "postalCodes": [
              "15745"
            ]
          },
          {
            "code": "LIM-YAU-YAU",
            "name": "Yauyos",
            "postalCodes": [
              "15775"
            ]
          }
        ],
        "cities": [
          {
            "code": "LIM-YAU-ALI",
            "name": "Alis",
            "postalCodes": [
              "15786"
            ]
          },
          {
            "code": "LIM-YAU-AYA",
            "name": "Ayauca",
            "postalCodes": [
              "15765"
            ]
          },
          {
            "code": "LIM-YAU-AYA",
            "name": "Ayaviri",
            "postalCodes": [
              "15675",
              "21865",
              "21866"
            ]
          },
          {
            "code": "LIM-YAU-AZA",
            "name": "Azangaro",
            "postalCodes": [
              "15740",
              "21157",
              "21160"
            ]
          },
          {
            "code": "LIM-YAU-CAC",
            "name": "Cacra",
            "postalCodes": [
              "15750"
            ]
          },
          {
            "code": "LIM-YAU-CAR",
            "name": "Carania",
            "postalCodes": [
              "15781"
            ]
          },
          {
            "code": "LIM-YAU-CAT",
            "name": "Catahuasi",
            "postalCodes": [
              "15760"
            ]
          },
          {
            "code": "LIM-YAU-CHO",
            "name": "Chocos",
            "postalCodes": [
              "15736"
            ]
          },
          {
            "code": "JUN-CON-COC",
            "name": "Cochas",
            "postalCodes": [
              "12225",
              "15621"
            ]
          },
          {
            "code": "LIM-YAU-COL",
            "name": "Colonia",
            "postalCodes": [
              "15770"
            ]
          },
          {
            "code": "LIM-YAU-HON",
            "name": "Hongos",
            "postalCodes": [
              "15753"
            ]
          },
          {
            "code": "LIM-YAU-HUA",
            "name": "Huampara",
            "postalCodes": [
              "15670"
            ]
          },
          {
            "code": "LIM-YAU-HUA",
            "name": "Huancaya",
            "postalCodes": [
              "15796"
            ]
          },
          {
            "code": "LIM-YAU-HUA",
            "name": "Huangascar",
            "postalCodes": [
              "15748"
            ]
          },
          {
            "code": "LIM-YAU-HUA",
            "name": "Huantan",
            "postalCodes": [
              "15780"
            ]
          },
          {
            "code": "LIM-YAU-HUA",
            "name": "Huañec",
            "postalCodes": [
              "15661"
            ]
          },
          {
            "code": "LIM-HUA-LAR",
            "name": "Laraos",
            "postalCodes": [
              "15530",
              "15785"
            ]
          },
          {
            "code": "LIM-YAU-LIN",
            "name": "Lincha",
            "postalCodes": [
              "15755"
            ]
          },
          {
            "code": "LIM-YAU-MAD",
            "name": "Madean",
            "postalCodes": [
              "15742"
            ]
          },
          {
            "code": "ARE-ARE-MIR",
            "name": "Miraflores",
            "postalCodes": [
              "04001",
              "04004",
              "10680",
              "15046",
              "15047",
              "15048",
              "15073",
              "15074",
              "15076",
              "15792"
            ]
          },
          {
            "code": "LIM-YAU-OMA",
            "name": "Omas",
            "postalCodes": [
              "15681"
            ]
          },
          {
            "code": "LIM-YAU-QUI",
            "name": "Quinches",
            "postalCodes": [
              "15665"
            ]
          },
          {
            "code": "LIM-YAU-QUI",
            "name": "Quinocay",
            "postalCodes": [
              "15620"
            ]
          },
          {
            "code": "LIM-YAU-SAN",
            "name": "San Joaquin",
            "postalCodes": [
              "15655"
            ]
          },
          {
            "code": "LIM-YAU-SAN",
            "name": "San Lorenzo de Putinza",
            "postalCodes": [
              "15763"
            ]
          },
          {
            "code": "LIM-YAU-SAN",
            "name": "San Pedro de Pilas",
            "postalCodes": [
              "15680"
            ]
          },
          {
            "code": "LIM-YAU-TAN",
            "name": "Tanta",
            "postalCodes": [
              "15660"
            ]
          },
          {
            "code": "LIM-YAU-TAU",
            "name": "Tauripampa",
            "postalCodes": [
              "15768"
            ]
          },
          {
            "code": "LIM-YAU-TOM",
            "name": "Tomas",
            "postalCodes": [
              "15790"
            ]
          },
          {
            "code": "LIM-YAU-TUP",
            "name": "Tupe",
            "postalCodes": [
              "15761"
            ]
          },
          {
            "code": "LIM-YAU-VIT",
            "name": "Vitis",
            "postalCodes": [
              "15795"
            ]
          },
          {
            "code": "LIM-YAU-VIÑ",
            "name": "Viñac",
            "postalCodes": [
              "15745"
            ]
          },
          {
            "code": "JUN-JAU-YAU",
            "name": "Yauyos",
            "postalCodes": [
              "12600",
              "12601",
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
        "code": "LOR-ALT",
        "name": "Alto Amazonas",
        "districts": [
          {
            "code": "LOR-ALT-BAL",
            "name": "Balsapuerto",
            "postalCodes": [
              "16511",
              "16510"
            ]
          },
          {
            "code": "LOR-ALT-JEB",
            "name": "Jeberos",
            "postalCodes": [
              "16520"
            ]
          },
          {
            "code": "LOR-ALT-LAG",
            "name": "Lagunas",
            "postalCodes": [
              "16551",
              "16550"
            ]
          },
          {
            "code": "LOR-ALT-SAN",
            "name": "Santa Cruz",
            "postalCodes": [
              "16540"
            ]
          },
          {
            "code": "LOR-ALT-TEN",
            "name": "Teniente Cesar López Rojas",
            "postalCodes": [
              "16530",
              "16531"
            ]
          },
          {
            "code": "LOR-ALT-YUR",
            "name": "Yurimaguas",
            "postalCodes": [
              "16501",
              "16500"
            ]
          }
        ],
        "cities": [
          {
            "code": "LOR-ALT-BAL",
            "name": "Balsapuerto",
            "postalCodes": [
              "16510",
              "16511"
            ]
          },
          {
            "code": "LOR-ALT-JEB",
            "name": "Jeberos",
            "postalCodes": [
              "16520"
            ]
          },
          {
            "code": "LOR-ALT-LAG",
            "name": "Lagunas",
            "postalCodes": [
              "16550",
              "16551",
              "20550",
              "20551"
            ]
          },
          {
            "code": "CAJ-CUT-SAN",
            "name": "Santa Cruz",
            "postalCodes": [
              "06715",
              "11300",
              "15246",
              "16540"
            ]
          },
          {
            "code": "LOR-ALT-SHU",
            "name": "Shucushuyacu",
            "postalCodes": [
              "16530",
              "16531"
            ]
          },
          {
            "code": "LOR-ALT-YUR",
            "name": "Yurimaguas",
            "postalCodes": [
              "16500",
              "16501"
            ]
          }
        ]
      },
      {
        "code": "LOR-DAT",
        "name": "Datem del Marañón",
        "districts": [
          {
            "code": "LOR-DAT-AND",
            "name": "Andoas",
            "postalCodes": [
              "16751",
              "16750"
            ]
          },
          {
            "code": "LOR-DAT-BAR",
            "name": "Barranca",
            "postalCodes": [
              "16601",
              "16600"
            ]
          },
          {
            "code": "LOR-DAT-CAH",
            "name": "Cahuapanas",
            "postalCodes": [
              "16611",
              "16610"
            ]
          },
          {
            "code": "LOR-DAT-MAN",
            "name": "Manseriche",
            "postalCodes": [
              "16620",
              "16621"
            ]
          },
          {
            "code": "LOR-DAT-MOR",
            "name": "Morona",
            "postalCodes": [
              "16630",
              "16631"
            ]
          },
          {
            "code": "LOR-DAT-PAS",
            "name": "Pastaza",
            "postalCodes": [
              "16701",
              "16700"
            ]
          }
        ],
        "cities": [
          {
            "code": "LOR-DAT-ALI",
            "name": "Alianza Cristiana",
            "postalCodes": [
              "16750",
              "16751"
            ]
          },
          {
            "code": "LOR-DAT-PUE",
            "name": "Puerto Alegria",
            "postalCodes": [
              "16630",
              "16631"
            ]
          },
          {
            "code": "JUN-JAU-SAN",
            "name": "San Lorenzo",
            "postalCodes": [
              "12145",
              "16600",
              "16601",
              "17200"
            ]
          },
          {
            "code": "LOR-DAT-SAN",
            "name": "Santa Maria de Cahuapanas",
            "postalCodes": [
              "16610",
              "16611"
            ]
          },
          {
            "code": "LOR-DAT-SAR",
            "name": "Saramiriza",
            "postalCodes": [
              "16620",
              "16621"
            ]
          },
          {
            "code": "LOR-DAT-ULL",
            "name": "Ullpayacu",
            "postalCodes": [
              "16700",
              "16701"
            ]
          }
        ]
      },
      {
        "code": "LOR-LOR",
        "name": "Loreto",
        "districts": [
          {
            "code": "LOR-LOR-NAU",
            "name": "Nauta",
            "postalCodes": [
              "16301",
              "16300"
            ]
          },
          {
            "code": "LOR-LOR-PAR",
            "name": "Parinari",
            "postalCodes": [
              "16570",
              "16571"
            ]
          },
          {
            "code": "LOR-LOR-TIG",
            "name": "Tigre",
            "postalCodes": [
              "16810",
              "16811"
            ]
          },
          {
            "code": "LOR-LOR-TRO",
            "name": "Trompeteros",
            "postalCodes": [
              "16821",
              "16820"
            ]
          },
          {
            "code": "LOR-LOR-URA",
            "name": "Urarinas",
            "postalCodes": [
              "16561",
              "16560"
            ]
          }
        ],
        "cities": [
          {
            "code": "LOR-LOR-CON",
            "name": "Concordia",
            "postalCodes": [
              "16560",
              "16561"
            ]
          },
          {
            "code": "LOR-LOR-INT",
            "name": "Intuto",
            "postalCodes": [
              "16810",
              "16811"
            ]
          },
          {
            "code": "LOR-LOR-NAU",
            "name": "Nauta",
            "postalCodes": [
              "16300",
              "16301"
            ]
          },
          {
            "code": "LOR-LOR-PAR",
            "name": "Parinari",
            "postalCodes": [
              "16570",
              "16571"
            ]
          },
          {
            "code": "LOR-LOR-VIL",
            "name": "Villa Trompeteros",
            "postalCodes": [
              "16820",
              "16821"
            ]
          }
        ]
      },
      {
        "code": "LOR-MAR",
        "name": "Mariscal Ramón Castilla",
        "districts": [
          {
            "code": "LOR-MAR-PEB",
            "name": "Pebas",
            "postalCodes": [
              "16221",
              "16220"
            ]
          },
          {
            "code": "LOR-MAR-RAM",
            "name": "Ramón Castilla",
            "postalCodes": [
              "16241",
              "16240"
            ]
          },
          {
            "code": "LOR-MAR-SAN",
            "name": "San Pablo",
            "postalCodes": [
              "16230",
              "16231"
            ]
          },
          {
            "code": "LOR-MAR-YAV",
            "name": "Yavarí",
            "postalCodes": [
              "16250",
              "16251"
            ]
          }
        ],
        "cities": [
          {
            "code": "LOR-MAR-CAB",
            "name": "Caballococha",
            "postalCodes": [
              "16240",
              "16241"
            ]
          },
          {
            "code": "LOR-MAR-ISL",
            "name": "Islandia",
            "postalCodes": [
              "16250",
              "16251"
            ]
          },
          {
            "code": "LOR-MAR-PEB",
            "name": "Pebas",
            "postalCodes": [
              "16220",
              "16221"
            ]
          },
          {
            "code": "LOR-MAR-SAN",
            "name": "San Pablo de Loreto",
            "postalCodes": [
              "16230",
              "16231"
            ]
          }
        ]
      },
      {
        "code": "LOR-MAY",
        "name": "Maynas",
        "districts": [
          {
            "code": "LOR-MAY-ALT",
            "name": "Alto Nanay",
            "postalCodes": [
              "16800"
            ]
          },
          {
            "code": "LOR-MAY-BEL",
            "name": "Belén",
            "postalCodes": [
              "16001",
              "16006",
              "16008",
              "16000"
            ]
          },
          {
            "code": "LOR-MAY-FER",
            "name": "Fernado Lores",
            "postalCodes": [
              "16311",
              "16310"
            ]
          },
          {
            "code": "LOR-MAY-IND",
            "name": "Indiana",
            "postalCodes": [
              "16200",
              "16201"
            ]
          },
          {
            "code": "LOR-MAY-IQU",
            "name": "Iquitos",
            "postalCodes": [
              "16003",
              "16000",
              "16004",
              "16006",
              "16002",
              "16001",
              "16007"
            ]
          },
          {
            "code": "LOR-MAY-LAS",
            "name": "Las Amazonas",
            "postalCodes": [
              "16211",
              "16210"
            ]
          },
          {
            "code": "LOR-MAY-MAZ",
            "name": "Mazán",
            "postalCodes": [
              "16100",
              "16101"
            ]
          },
          {
            "code": "LOR-MAY-NAP",
            "name": "Napo",
            "postalCodes": [
              "16121",
              "16120"
            ]
          },
          {
            "code": "LOR-MAY-PUN",
            "name": "Punchana",
            "postalCodes": [
              "16004",
              "16000",
              "16003"
            ]
          },
          {
            "code": "LOR-MAY-PUT",
            "name": "Putumayo",
            "postalCodes": [
              "16111",
              "16110"
            ]
          },
          {
            "code": "LOR-MAY-SAN",
            "name": "San Juan Bautista",
            "postalCodes": [
              "16007",
              "16008",
              "16000"
            ]
          },
          {
            "code": "LOR-MAY-TEN",
            "name": "Teniente Manuel Clavero",
            "postalCodes": [
              "16140"
            ]
          },
          {
            "code": "LOR-MAY-TOR",
            "name": "Torres Causana",
            "postalCodes": [
              "16130"
            ]
          }
        ],
        "cities": [
          {
            "code": "AYA-SUC-BEL",
            "name": "Belen",
            "postalCodes": [
              "05345",
              "16000",
              "16001",
              "16006",
              "16008"
            ]
          },
          {
            "code": "LOR-MAY-FRA",
            "name": "Francisco de Orellana",
            "postalCodes": [
              "16210",
              "16211"
            ]
          },
          {
            "code": "LOR-MAY-IND",
            "name": "Indiana",
            "postalCodes": [
              "16200",
              "16201"
            ]
          },
          {
            "code": "LOR-MAY-IQU",
            "name": "Iquitos",
            "postalCodes": [
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
            "code": "LOR-MAY-MAZ",
            "name": "Mazan",
            "postalCodes": [
              "16100",
              "16101"
            ]
          },
          {
            "code": "LOR-MAY-PAN",
            "name": "Pantoja",
            "postalCodes": [
              "16130"
            ]
          },
          {
            "code": "LOR-MAY-PUN",
            "name": "Punchana",
            "postalCodes": [
              "16000",
              "16003",
              "16004"
            ]
          },
          {
            "code": "LOR-MAY-SAN",
            "name": "San Antonio del Estrecho",
            "postalCodes": [
              "16110",
              "16111"
            ]
          },
          {
            "code": "ANC-HUA-SAN",
            "name": "San Juan",
            "postalCodes": [
              "02170",
              "02171",
              "05520",
              "06400",
              "09755",
              "11420",
              "11421",
              "16000",
              "16007",
              "16008"
            ]
          },
          {
            "code": "LOR-MAY-SAN",
            "name": "Santa Clotilde",
            "postalCodes": [
              "16120",
              "16121"
            ]
          },
          {
            "code": "LOR-MAY-SAN",
            "name": "Santa Maria de Nanay",
            "postalCodes": [
              "16800"
            ]
          },
          {
            "code": "LOR-MAY-SOP",
            "name": "Soplin Vargas",
            "postalCodes": [
              "16140"
            ]
          },
          {
            "code": "LOR-MAY-TAM",
            "name": "Tamshiyacu",
            "postalCodes": [
              "16310",
              "16311"
            ]
          }
        ]
      },
      {
        "code": "LOR-REQ",
        "name": "Requena",
        "districts": [
          {
            "code": "LOR-REQ-ALT",
            "name": "Alto Tapiche",
            "postalCodes": [
              "16380"
            ]
          },
          {
            "code": "LOR-REQ-CAP",
            "name": "Capelo",
            "postalCodes": [
              "16400"
            ]
          },
          {
            "code": "LOR-REQ-EMI",
            "name": "Emilio San Martín",
            "postalCodes": [
              "16421",
              "16420"
            ]
          },
          {
            "code": "LOR-REQ-JEN",
            "name": "Jenaro Herrera",
            "postalCodes": [
              "16331",
              "16330"
            ]
          },
          {
            "code": "LOR-REQ-MAQ",
            "name": "Maquia",
            "postalCodes": [
              "16431",
              "16430"
            ]
          },
          {
            "code": "LOR-REQ-PUI",
            "name": "Puinahua",
            "postalCodes": [
              "16411",
              "16410"
            ]
          },
          {
            "code": "LOR-REQ-REQ",
            "name": "Requena",
            "postalCodes": [
              "16340",
              "16341"
            ]
          },
          {
            "code": "LOR-REQ-SAQ",
            "name": "Saquena",
            "postalCodes": [
              "16320"
            ]
          },
          {
            "code": "LOR-REQ-SOP",
            "name": "Soplin",
            "postalCodes": [
              "16360"
            ]
          },
          {
            "code": "LOR-REQ-TAP",
            "name": "Tapiche",
            "postalCodes": [
              "16370"
            ]
          },
          {
            "code": "LOR-REQ-YAQ",
            "name": "Yaquerana",
            "postalCodes": [
              "16350"
            ]
          }
        ],
        "cities": [
          {
            "code": "LOR-REQ-ANG",
            "name": "Angamos",
            "postalCodes": [
              "16350"
            ]
          },
          {
            "code": "LOR-REQ-BAG",
            "name": "Bagazan",
            "postalCodes": [
              "16320"
            ]
          },
          {
            "code": "LOR-REQ-BRE",
            "name": "Bretaña",
            "postalCodes": [
              "16410",
              "16411"
            ]
          },
          {
            "code": "LOR-REQ-FLO",
            "name": "Flor de Punga",
            "postalCodes": [
              "16400"
            ]
          },
          {
            "code": "LOR-REQ-IBE",
            "name": "Iberia",
            "postalCodes": [
              "16370",
              "17250",
              "17251"
            ]
          },
          {
            "code": "LOR-REQ-JEN",
            "name": "Jenaro Herrera",
            "postalCodes": [
              "16330",
              "16331"
            ]
          },
          {
            "code": "LOR-REQ-NUE",
            "name": "Nueva Alejandria (Curinga)",
            "postalCodes": [
              "16360"
            ]
          },
          {
            "code": "LOR-REQ-REQ",
            "name": "Requena",
            "postalCodes": [
              "16340",
              "16341"
            ]
          },
          {
            "code": "LOR-REQ-SAN",
            "name": "Santa Elena",
            "postalCodes": [
              "16380"
            ]
          },
          {
            "code": "LOR-REQ-SAN",
            "name": "Santa Isabel",
            "postalCodes": [
              "16430",
              "16431"
            ]
          },
          {
            "code": "LOR-REQ-TAM",
            "name": "Tamanco",
            "postalCodes": [
              "16420",
              "16421"
            ]
          }
        ]
      },
      {
        "code": "LOR-UCA",
        "name": "Ucayali",
        "districts": [
          {
            "code": "LOR-UCA-CON",
            "name": "Contamaná",
            "postalCodes": [
              "16480",
              "16481"
            ]
          },
          {
            "code": "LOR-UCA-INA",
            "name": "Inahuaya",
            "postalCodes": [
              "16460"
            ]
          },
          {
            "code": "LOR-UCA-PAD",
            "name": "Padre Marquez",
            "postalCodes": [
              "16491",
              "16490"
            ]
          },
          {
            "code": "LOR-UCA-PAM",
            "name": "Pampa Hermosa",
            "postalCodes": [
              "16471",
              "16470"
            ]
          },
          {
            "code": "LOR-UCA-SAR",
            "name": "Sarayacu",
            "postalCodes": [
              "16441",
              "16440"
            ]
          },
          {
            "code": "LOR-UCA-VAR",
            "name": "Vargas Guerra",
            "postalCodes": [
              "16451",
              "16450"
            ]
          }
        ],
        "cities": [
          {
            "code": "LOR-UCA-CON",
            "name": "Contamana",
            "postalCodes": [
              "16480",
              "16481"
            ]
          },
          {
            "code": "LOR-UCA-DOS",
            "name": "Dos de Mayo",
            "postalCodes": [
              "16440",
              "16441"
            ]
          },
          {
            "code": "LOR-UCA-INA",
            "name": "Inahuaya",
            "postalCodes": [
              "16460"
            ]
          },
          {
            "code": "LOR-UCA-ORE",
            "name": "Orellana",
            "postalCodes": [
              "16450",
              "16451"
            ]
          },
          {
            "code": "LOR-UCA-PAM",
            "name": "Pampa Hermosa",
            "postalCodes": [
              "16470",
              "16471"
            ]
          },
          {
            "code": "LOR-UCA-TIR",
            "name": "Tiruntan",
            "postalCodes": [
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
        "code": "MAD-MAN",
        "name": "Manu",
        "districts": [
          {
            "code": "MAD-MAN-FIT",
            "name": "Fitzcarrald",
            "postalCodes": [
              "17800"
            ]
          },
          {
            "code": "MAD-MAN-HUE",
            "name": "Huepetuhe",
            "postalCodes": [
              "17550",
              "17551"
            ]
          },
          {
            "code": "MAD-MAN-MAD",
            "name": "Madre de Dios",
            "postalCodes": [
              "17601",
              "17600"
            ]
          },
          {
            "code": "MAD-MAN-MAN",
            "name": "Manú",
            "postalCodes": [
              "17700"
            ]
          }
        ],
        "cities": [
          {
            "code": "MAD-MAN-BOC",
            "name": "Boca Colorado",
            "postalCodes": [
              "17600",
              "17601"
            ]
          },
          {
            "code": "MAD-MAN-BOC",
            "name": "Boca Manu",
            "postalCodes": [
              "17800"
            ]
          },
          {
            "code": "MAD-MAN-HUE",
            "name": "Huepetuhe",
            "postalCodes": [
              "17550",
              "17551"
            ]
          },
          {
            "code": "MAD-MAN-SAL",
            "name": "Salvacion",
            "postalCodes": [
              "17700"
            ]
          }
        ]
      },
      {
        "code": "MAD-TAH",
        "name": "Tahuamanu",
        "districts": [
          {
            "code": "MAD-TAH-IBE",
            "name": "Iberia",
            "postalCodes": [
              "17251",
              "17250"
            ]
          },
          {
            "code": "MAD-TAH-IÑA",
            "name": "Iñapari",
            "postalCodes": [
              "17300"
            ]
          },
          {
            "code": "MAD-TAH-TAH",
            "name": "Tahuamanú",
            "postalCodes": [
              "17200"
            ]
          }
        ],
        "cities": [
          {
            "code": "LOR-REQ-IBE",
            "name": "Iberia",
            "postalCodes": [
              "16370",
              "17250",
              "17251"
            ]
          },
          {
            "code": "MAD-TAH-IÑA",
            "name": "Iñapari",
            "postalCodes": [
              "17300"
            ]
          },
          {
            "code": "JUN-JAU-SAN",
            "name": "San Lorenzo",
            "postalCodes": [
              "12145",
              "16600",
              "16601",
              "17200"
            ]
          }
        ]
      },
      {
        "code": "MAD-TAM",
        "name": "Tambopata",
        "districts": [
          {
            "code": "MAD-TAM-INA",
            "name": "Inambari",
            "postalCodes": [
              "17501",
              "17500"
            ]
          },
          {
            "code": "MAD-TAM-LAB",
            "name": "Laberinto",
            "postalCodes": [
              "17400"
            ]
          },
          {
            "code": "MAD-TAM-LAS",
            "name": "Las Piedras",
            "postalCodes": [
              "17101",
              "17100"
            ]
          },
          {
            "code": "MAD-TAM-TAM",
            "name": "Tambopata",
            "postalCodes": [
              "17001",
              "17000"
            ]
          }
        ],
        "cities": [
          {
            "code": "MAD-TAM-LAS",
            "name": "Las Piedras (Planchon)",
            "postalCodes": [
              "17100",
              "17101"
            ]
          },
          {
            "code": "MAD-TAM-MAZ",
            "name": "Mazuko",
            "postalCodes": [
              "17500",
              "17501"
            ]
          },
          {
            "code": "MAD-TAM-PUE",
            "name": "Puerto Maldonado",
            "postalCodes": [
              "17000",
              "17001"
            ]
          },
          {
            "code": "MAD-TAM-PUE",
            "name": "Puerto Rosario de Laberinto",
            "postalCodes": [
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
        "code": "MOQ-GEN",
        "name": "General Sanchez Cerro",
        "districts": [
          {
            "code": "MOQ-GEN-CHO",
            "name": "Chojata",
            "postalCodes": [
              "18500"
            ]
          },
          {
            "code": "MOQ-GEN-COA",
            "name": "Coalaque",
            "postalCodes": [
              "18210"
            ]
          },
          {
            "code": "MOQ-GEN-ICH",
            "name": "Ichuña",
            "postalCodes": [
              "18530"
            ]
          },
          {
            "code": "MOQ-GEN-LA ",
            "name": "La Capilla",
            "postalCodes": [
              "18230"
            ]
          },
          {
            "code": "MOQ-GEN-LLO",
            "name": "Lloque",
            "postalCodes": [
              "18510"
            ]
          },
          {
            "code": "MOQ-GEN-MAT",
            "name": "Matalaque",
            "postalCodes": [
              "18310"
            ]
          },
          {
            "code": "MOQ-GEN-OMA",
            "name": "Omate",
            "postalCodes": [
              "18200"
            ]
          },
          {
            "code": "MOQ-GEN-PUQ",
            "name": "Puquina",
            "postalCodes": [
              "18220"
            ]
          },
          {
            "code": "MOQ-GEN-QUI",
            "name": "Quinistaquillas",
            "postalCodes": [
              "18300"
            ]
          },
          {
            "code": "MOQ-GEN-UBI",
            "name": "Ubinas",
            "postalCodes": [
              "18320"
            ]
          },
          {
            "code": "MOQ-GEN-YUN",
            "name": "Yunga",
            "postalCodes": [
              "18520"
            ]
          }
        ],
        "cities": [
          {
            "code": "MOQ-GEN-CHO",
            "name": "Chojata",
            "postalCodes": [
              "18500"
            ]
          },
          {
            "code": "MOQ-GEN-COA",
            "name": "Coalaque",
            "postalCodes": [
              "18210"
            ]
          },
          {
            "code": "MOQ-GEN-ICH",
            "name": "Ichuña",
            "postalCodes": [
              "18530"
            ]
          },
          {
            "code": "MOQ-GEN-LA ",
            "name": "La Capilla",
            "postalCodes": [
              "18230"
            ]
          },
          {
            "code": "MOQ-GEN-LLO",
            "name": "Lloque",
            "postalCodes": [
              "18510"
            ]
          },
          {
            "code": "MOQ-GEN-MAT",
            "name": "Matalaque",
            "postalCodes": [
              "18310"
            ]
          },
          {
            "code": "MOQ-GEN-OMA",
            "name": "Omate",
            "postalCodes": [
              "18200"
            ]
          },
          {
            "code": "MOQ-GEN-PUQ",
            "name": "Puquina",
            "postalCodes": [
              "18220"
            ]
          },
          {
            "code": "MOQ-GEN-QUI",
            "name": "Quinistaquillas",
            "postalCodes": [
              "18300"
            ]
          },
          {
            "code": "MOQ-GEN-UBI",
            "name": "Ubinas",
            "postalCodes": [
              "18320"
            ]
          },
          {
            "code": "MOQ-GEN-YUN",
            "name": "Yunga",
            "postalCodes": [
              "18520"
            ]
          }
        ]
      },
      {
        "code": "MOQ-ILO",
        "name": "Ilo",
        "districts": [
          {
            "code": "MOQ-ILO-EL ",
            "name": "El Algarrobal",
            "postalCodes": [
              "18620"
            ]
          },
          {
            "code": "MOQ-ILO-ILO",
            "name": "Ilo",
            "postalCodes": [
              "18601",
              "18600"
            ]
          },
          {
            "code": "MOQ-ILO-PAC",
            "name": "Pacocha",
            "postalCodes": [
              "18611",
              "18610"
            ]
          }
        ],
        "cities": [
          {
            "code": "MOQ-ILO-EL ",
            "name": "El Algarrobal",
            "postalCodes": [
              "18620"
            ]
          },
          {
            "code": "MOQ-ILO-ILO",
            "name": "Ilo",
            "postalCodes": [
              "18600",
              "18601"
            ]
          },
          {
            "code": "ICA-ICA-PUE",
            "name": "Pueblo Nuevo",
            "postalCodes": [
              "11200",
              "11701",
              "11703",
              "13850",
              "13851",
              "14310",
              "14311",
              "18610",
              "18611"
            ]
          }
        ]
      },
      {
        "code": "MOQ-MAR",
        "name": "Mariscal Nieto",
        "districts": [
          {
            "code": "MOQ-MAR-CUC",
            "name": "Cuchumbaya",
            "postalCodes": [
              "18410"
            ]
          },
          {
            "code": "MOQ-MAR-CUR",
            "name": "Curumas",
            "postalCodes": [
              "18400"
            ]
          },
          {
            "code": "MOQ-MAR-MOQ",
            "name": "Moquegua",
            "postalCodes": [
              "18001",
              "18000"
            ]
          },
          {
            "code": "MOQ-MAR-SAM",
            "name": "Samegua",
            "postalCodes": [
              "18001",
              "18000"
            ]
          },
          {
            "code": "MOQ-MAR-SAN",
            "name": "San Cristobal",
            "postalCodes": [
              "18420"
            ]
          },
          {
            "code": "MOQ-MAR-TOR",
            "name": "Torata",
            "postalCodes": [
              "18101",
              "18100"
            ]
          }
        ],
        "cities": [
          {
            "code": "MOQ-MAR-CAL",
            "name": "Calacoa",
            "postalCodes": [
              "18420"
            ]
          },
          {
            "code": "MOQ-MAR-CAR",
            "name": "Carumas",
            "postalCodes": [
              "18400"
            ]
          },
          {
            "code": "MOQ-MAR-CUC",
            "name": "Cuchumbaya",
            "postalCodes": [
              "18410"
            ]
          },
          {
            "code": "MOQ-MAR-MOQ",
            "name": "Moquegua",
            "postalCodes": [
              "18000",
              "18001"
            ]
          },
          {
            "code": "MOQ-MAR-SAM",
            "name": "Samegua",
            "postalCodes": [
              "18000",
              "18001"
            ]
          },
          {
            "code": "MOQ-MAR-TOR",
            "name": "Torata",
            "postalCodes": [
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
        "code": "PAS-DAN",
        "name": "Daniel Alcides Carrión",
        "districts": [
          {
            "code": "PAS-DAN-CHA",
            "name": "Chacayán",
            "postalCodes": [
              "19720"
            ]
          },
          {
            "code": "PAS-DAN-GOY",
            "name": "Goyllarisquizga",
            "postalCodes": [
              "19710"
            ]
          },
          {
            "code": "PAS-DAN-PAU",
            "name": "Paucar",
            "postalCodes": [
              "19750"
            ]
          },
          {
            "code": "PAS-DAN-SAN",
            "name": "San Pedro de Pillao",
            "postalCodes": [
              "19650"
            ]
          },
          {
            "code": "PAS-DAN-SAN",
            "name": "Santa Ana de Tusi",
            "postalCodes": [
              "19700",
              "19701"
            ]
          },
          {
            "code": "PAS-DAN-TAP",
            "name": "Tapuc",
            "postalCodes": [
              "19740"
            ]
          },
          {
            "code": "PAS-DAN-VIL",
            "name": "Vilcabamba",
            "postalCodes": [
              "19730"
            ]
          },
          {
            "code": "PAS-DAN-YAN",
            "name": "Yanahuanca",
            "postalCodes": [
              "19601",
              "19600"
            ]
          }
        ],
        "cities": [
          {
            "code": "PAS-DAN-CHA",
            "name": "Chacayan",
            "postalCodes": [
              "19720"
            ]
          },
          {
            "code": "PAS-DAN-GOY",
            "name": "Goyllarisquizga",
            "postalCodes": [
              "19710"
            ]
          },
          {
            "code": "PAS-DAN-PAU",
            "name": "Paucar",
            "postalCodes": [
              "19750"
            ]
          },
          {
            "code": "PAS-DAN-SAN",
            "name": "San Pedro de Pillao",
            "postalCodes": [
              "19650"
            ]
          },
          {
            "code": "PAS-DAN-SAN",
            "name": "Santa Ana de Tusi",
            "postalCodes": [
              "19700",
              "19701"
            ]
          },
          {
            "code": "PAS-DAN-TAP",
            "name": "Tapuc",
            "postalCodes": [
              "19740"
            ]
          },
          {
            "code": "APU-GRA-VIL",
            "name": "Vilcabamba",
            "postalCodes": [
              "03320",
              "19730"
            ]
          },
          {
            "code": "PAS-DAN-YAN",
            "name": "Yanahuanca",
            "postalCodes": [
              "19600",
              "19601"
            ]
          }
        ]
      },
      {
        "code": "PAS-OXA",
        "name": "Oxapampa",
        "districts": [
          {
            "code": "PAS-OXA-CHO",
            "name": "Chontabamba",
            "postalCodes": [
              "19210"
            ]
          },
          {
            "code": "PAS-OXA-HUA",
            "name": "Huancabamba",
            "postalCodes": [
              "19240",
              "19241"
            ]
          },
          {
            "code": "PAS-OXA-OXA",
            "name": "Oxapampa",
            "postalCodes": [
              "19231",
              "19230"
            ]
          },
          {
            "code": "PAS-OXA-PAL",
            "name": "Palcazú",
            "postalCodes": [
              "19321",
              "19320"
            ]
          },
          {
            "code": "PAS-OXA-POZ",
            "name": "Pozuzo",
            "postalCodes": [
              "19250",
              "19251"
            ]
          },
          {
            "code": "PAS-OXA-PUE",
            "name": "Puerto Bermudez",
            "postalCodes": [
              "19311",
              "19310"
            ]
          },
          {
            "code": "PAS-OXA-VIL",
            "name": "Villa Rica",
            "postalCodes": [
              "19301",
              "19300"
            ]
          }
        ],
        "cities": [
          {
            "code": "PAS-OXA-CHO",
            "name": "Chontabamba",
            "postalCodes": [
              "19210"
            ]
          },
          {
            "code": "PAS-OXA-HUA",
            "name": "Huancabamba",
            "postalCodes": [
              "19240",
              "19241",
              "20440",
              "20441"
            ]
          },
          {
            "code": "PAS-OXA-ISC",
            "name": "Iscozacin",
            "postalCodes": [
              "19320",
              "19321"
            ]
          },
          {
            "code": "PAS-OXA-OXA",
            "name": "Oxapampa",
            "postalCodes": [
              "19230",
              "19231"
            ]
          },
          {
            "code": "PAS-OXA-POZ",
            "name": "Pozuzo",
            "postalCodes": [
              "19250",
              "19251"
            ]
          },
          {
            "code": "PAS-OXA-PUE",
            "name": "Puerto Bermudez",
            "postalCodes": [
              "19310",
              "19311"
            ]
          },
          {
            "code": "PAS-OXA-VIL",
            "name": "Villa Rica",
            "postalCodes": [
              "19300",
              "19301"
            ]
          }
        ]
      },
      {
        "code": "PAS-PAS",
        "name": "Pasco",
        "districts": [
          {
            "code": "PAS-PAS-CHA",
            "name": "Chaupimarca",
            "postalCodes": [
              "19000",
              "19001"
            ]
          },
          {
            "code": "PAS-PAS-HUA",
            "name": "Huachón",
            "postalCodes": [
              "19220"
            ]
          },
          {
            "code": "PAS-PAS-HUA",
            "name": "Huariaca",
            "postalCodes": [
              "19120",
              "19121"
            ]
          },
          {
            "code": "PAS-PAS-HUA",
            "name": "Huayllay",
            "postalCodes": [
              "19501",
              "19500"
            ]
          },
          {
            "code": "PAS-PAS-NIN",
            "name": "Ninacaca",
            "postalCodes": [
              "19420"
            ]
          },
          {
            "code": "PAS-PAS-PAL",
            "name": "Pallanchacra",
            "postalCodes": [
              "19110"
            ]
          },
          {
            "code": "PAS-PAS-PAU",
            "name": "Paucartambo",
            "postalCodes": [
              "19201",
              "19200"
            ]
          },
          {
            "code": "PAS-PAS-SAN",
            "name": "San Francisco de Asís de Yarusyacán",
            "postalCodes": [
              "19100",
              "19101"
            ]
          },
          {
            "code": "PAS-PAS-SIM",
            "name": "Simón Bolivar",
            "postalCodes": [
              "19000",
              "19001",
              "19031"
            ]
          },
          {
            "code": "PAS-PAS-TIC",
            "name": "Ticlacayan",
            "postalCodes": [
              "19131",
              "19130"
            ]
          },
          {
            "code": "PAS-PAS-TIN",
            "name": "Tinyahuarco",
            "postalCodes": [
              "19400",
              "19401"
            ]
          },
          {
            "code": "PAS-PAS-VIC",
            "name": "Vicco",
            "postalCodes": [
              "19410"
            ]
          },
          {
            "code": "PAS-PAS-YAN",
            "name": "Yanacancha",
            "postalCodes": [
              "19000",
              "19001"
            ]
          }
        ],
        "cities": [
          {
            "code": "PAS-PAS-CER",
            "name": "Cerro de Pasco",
            "postalCodes": [
              "19000",
              "19001"
            ]
          },
          {
            "code": "PAS-PAS-HUA",
            "name": "Huachon",
            "postalCodes": [
              "19220"
            ]
          },
          {
            "code": "PAS-PAS-HUA",
            "name": "Huariaca",
            "postalCodes": [
              "19120",
              "19121"
            ]
          },
          {
            "code": "PAS-PAS-HUA",
            "name": "Huayllay",
            "postalCodes": [
              "19500",
              "19501"
            ]
          },
          {
            "code": "PAS-PAS-NIN",
            "name": "Ninacaca",
            "postalCodes": [
              "19420"
            ]
          },
          {
            "code": "PAS-PAS-PAL",
            "name": "Pallanchacra",
            "postalCodes": [
              "19110"
            ]
          },
          {
            "code": "CUZ-PAU-PAU",
            "name": "Paucartambo",
            "postalCodes": [
              "08135",
              "08136",
              "19200",
              "19201"
            ]
          },
          {
            "code": "PAS-PAS-SAN",
            "name": "San Antonio de Rancas",
            "postalCodes": [
              "19000",
              "19001",
              "19031"
            ]
          },
          {
            "code": "PAS-PAS-TIC",
            "name": "Ticlacayan",
            "postalCodes": [
              "19130",
              "19131"
            ]
          },
          {
            "code": "PAS-PAS-TIN",
            "name": "Tinyahuarco (Smelter)",
            "postalCodes": [
              "19400",
              "19401"
            ]
          },
          {
            "code": "PAS-PAS-VIC",
            "name": "Vicco",
            "postalCodes": [
              "19410"
            ]
          },
          {
            "code": "JUN-CHU-YAN",
            "name": "Yanacancha",
            "postalCodes": [
              "12470",
              "19000",
              "19001"
            ]
          },
          {
            "code": "PAS-PAS-YAR",
            "name": "Yarusyacan",
            "postalCodes": [
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
        "code": "PIU-AYA",
        "name": "Ayabaca",
        "districts": [
          {
            "code": "PIU-AYA-AYA",
            "name": "Ayabaca",
            "postalCodes": [
              "20541",
              "20540"
            ]
          },
          {
            "code": "PIU-AYA-FRÍ",
            "name": "Frías",
            "postalCodes": [
              "20340",
              "20341"
            ]
          },
          {
            "code": "PIU-AYA-JIL",
            "name": "Jilili",
            "postalCodes": [
              "20520"
            ]
          },
          {
            "code": "PIU-AYA-LAG",
            "name": "Lagunas",
            "postalCodes": [
              "20551",
              "20550"
            ]
          },
          {
            "code": "PIU-AYA-MON",
            "name": "Montero",
            "postalCodes": [
              "20510",
              "20511"
            ]
          },
          {
            "code": "PIU-AYA-PAC",
            "name": "Pacaipampa",
            "postalCodes": [
              "20560",
              "20561"
            ]
          },
          {
            "code": "PIU-AYA-PAI",
            "name": "Paimas",
            "postalCodes": [
              "20500",
              "20501"
            ]
          },
          {
            "code": "PIU-AYA-SAP",
            "name": "Sapillica",
            "postalCodes": [
              "20231",
              "20230"
            ]
          },
          {
            "code": "PIU-AYA-SIC",
            "name": "Sicchez",
            "postalCodes": [
              "20530"
            ]
          },
          {
            "code": "PIU-AYA-SUY",
            "name": "Suyo",
            "postalCodes": [
              "20220",
              "20221"
            ]
          }
        ],
        "cities": [
          {
            "code": "PIU-AYA-AYA",
            "name": "Ayabaca",
            "postalCodes": [
              "20540",
              "20541"
            ]
          },
          {
            "code": "PIU-AYA-FRI",
            "name": "Frias",
            "postalCodes": [
              "20340",
              "20341"
            ]
          },
          {
            "code": "PIU-AYA-JIL",
            "name": "Jilili",
            "postalCodes": [
              "20520"
            ]
          },
          {
            "code": "LOR-ALT-LAG",
            "name": "Lagunas",
            "postalCodes": [
              "16550",
              "16551",
              "20550",
              "20551"
            ]
          },
          {
            "code": "PIU-AYA-MON",
            "name": "Montero",
            "postalCodes": [
              "20510",
              "20511"
            ]
          },
          {
            "code": "PIU-AYA-PAC",
            "name": "Pacaipampa",
            "postalCodes": [
              "20560",
              "20561"
            ]
          },
          {
            "code": "PIU-AYA-PAI",
            "name": "Paimas",
            "postalCodes": [
              "20500",
              "20501"
            ]
          },
          {
            "code": "PIU-AYA-SAP",
            "name": "Sapillica",
            "postalCodes": [
              "20230",
              "20231"
            ]
          },
          {
            "code": "PIU-AYA-SIC",
            "name": "Sicchez",
            "postalCodes": [
              "20530"
            ]
          },
          {
            "code": "PIU-AYA-SUY",
            "name": "Suyo",
            "postalCodes": [
              "20220",
              "20221"
            ]
          }
        ]
      },
      {
        "code": "PIU-HUA",
        "name": "Huancabamba",
        "districts": [
          {
            "code": "PIU-HUA-CAN",
            "name": "Canchaque",
            "postalCodes": [
              "20430",
              "20431"
            ]
          },
          {
            "code": "PIU-HUA-EL ",
            "name": "El Carmen de la Frontera",
            "postalCodes": [
              "20450",
              "20451"
            ]
          },
          {
            "code": "PIU-HUA-HUA",
            "name": "Huancabamba",
            "postalCodes": [
              "20441",
              "20440"
            ]
          },
          {
            "code": "PIU-HUA-HUA",
            "name": "Huarmaca",
            "postalCodes": [
              "20471",
              "20470"
            ]
          },
          {
            "code": "PIU-HUA-LAL",
            "name": "Lalaquiz",
            "postalCodes": [
              "20421",
              "20420"
            ]
          },
          {
            "code": "PIU-HUA-SAN",
            "name": "San Miguel de el Faique",
            "postalCodes": [
              "20461",
              "20460"
            ]
          },
          {
            "code": "PIU-HUA-SON",
            "name": "Sondor",
            "postalCodes": [
              "20481",
              "20480"
            ]
          },
          {
            "code": "PIU-HUA-SON",
            "name": "Sondorillo",
            "postalCodes": [
              "20490",
              "20491"
            ]
          }
        ],
        "cities": [
          {
            "code": "PIU-HUA-CAN",
            "name": "Canchaque",
            "postalCodes": [
              "20430",
              "20431"
            ]
          },
          {
            "code": "PAS-OXA-HUA",
            "name": "Huancabamba",
            "postalCodes": [
              "19240",
              "19241",
              "20440",
              "20441"
            ]
          },
          {
            "code": "PIU-HUA-HUA",
            "name": "Huarmaca",
            "postalCodes": [
              "20470",
              "20471"
            ]
          },
          {
            "code": "PIU-HUA-SAN",
            "name": "San Miguel del Faique",
            "postalCodes": [
              "20460",
              "20461"
            ]
          },
          {
            "code": "PIU-HUA-SAP",
            "name": "Sapalache",
            "postalCodes": [
              "20450",
              "20451"
            ]
          },
          {
            "code": "PIU-HUA-SON",
            "name": "Sondor",
            "postalCodes": [
              "20480",
              "20481"
            ]
          },
          {
            "code": "PIU-HUA-SON",
            "name": "Sondorillo",
            "postalCodes": [
              "20490",
              "20491"
            ]
          },
          {
            "code": "PIU-HUA-TUN",
            "name": "Tunal",
            "postalCodes": [
              "20420",
              "20421"
            ]
          }
        ]
      },
      {
        "code": "PIU-MOR",
        "name": "Morropon",
        "districts": [
          {
            "code": "PIU-MOR-BUE",
            "name": "Buenos Aires",
            "postalCodes": [
              "20380",
              "20381"
            ]
          },
          {
            "code": "PIU-MOR-CHA",
            "name": "Chalaco",
            "postalCodes": [
              "20351",
              "20350"
            ]
          },
          {
            "code": "PIU-MOR-CHU",
            "name": "Chulucanas",
            "postalCodes": [
              "20300",
              "20301"
            ]
          },
          {
            "code": "PIU-MOR-LA ",
            "name": "La Matanza",
            "postalCodes": [
              "20371",
              "20370"
            ]
          },
          {
            "code": "PIU-MOR-MOR",
            "name": "Morropón",
            "postalCodes": [
              "20310",
              "20311"
            ]
          },
          {
            "code": "PIU-MOR-SAL",
            "name": "Salitral",
            "postalCodes": [
              "20400",
              "20401"
            ]
          },
          {
            "code": "PIU-MOR-SAN",
            "name": "San Juan de Bigote",
            "postalCodes": [
              "20410",
              "20411"
            ]
          },
          {
            "code": "PIU-MOR-SAN",
            "name": "Santa Catalina de Mossa",
            "postalCodes": [
              "20320"
            ]
          },
          {
            "code": "PIU-MOR-SAN",
            "name": "Santo Domingo",
            "postalCodes": [
              "20331",
              "20330"
            ]
          },
          {
            "code": "PIU-MOR-YAM",
            "name": "Yamango",
            "postalCodes": [
              "20361",
              "20360"
            ]
          }
        ],
        "cities": [
          {
            "code": "PIU-MOR-BIG",
            "name": "Bigote",
            "postalCodes": [
              "20410",
              "20411"
            ]
          },
          {
            "code": "ANC-SAN-BUE",
            "name": "Buenos Aires",
            "postalCodes": [
              "02710",
              "02711",
              "02712",
              "13008",
              "13009",
              "20380",
              "20381",
              "22410"
            ]
          },
          {
            "code": "PIU-MOR-CHA",
            "name": "Chalaco",
            "postalCodes": [
              "20350",
              "20351"
            ]
          },
          {
            "code": "PIU-MOR-CHU",
            "name": "Chulucanas",
            "postalCodes": [
              "20300",
              "20301"
            ]
          },
          {
            "code": "PIU-MOR-LA ",
            "name": "La Matanza",
            "postalCodes": [
              "20370",
              "20371"
            ]
          },
          {
            "code": "PIU-MOR-MOR",
            "name": "Morropon",
            "postalCodes": [
              "20310",
              "20311"
            ]
          },
          {
            "code": "PIU-MOR-PAL",
            "name": "Paltashaco",
            "postalCodes": [
              "20320"
            ]
          },
          {
            "code": "PIU-SUL-SAL",
            "name": "Salitral",
            "postalCodes": [
              "20130",
              "20131",
              "20400",
              "20401"
            ]
          },
          {
            "code": "PIU-MOR-SAN",
            "name": "Santo Domingo",
            "postalCodes": [
              "20330",
              "20331"
            ]
          },
          {
            "code": "PIU-MOR-YAM",
            "name": "Yamango",
            "postalCodes": [
              "20360",
              "20361"
            ]
          }
        ]
      },
      {
        "code": "PIU-PAI",
        "name": "Paita",
        "districts": [
          {
            "code": "PIU-PAI-AMO",
            "name": "Amotape",
            "postalCodes": [
              "20730"
            ]
          },
          {
            "code": "PIU-PAI-ARE",
            "name": "Arenal",
            "postalCodes": [
              "20720"
            ]
          },
          {
            "code": "PIU-PAI-COL",
            "name": "Colán",
            "postalCodes": [
              "20711",
              "20710"
            ]
          },
          {
            "code": "PIU-PAI-LA ",
            "name": "La Huaca",
            "postalCodes": [
              "20780",
              "20781"
            ]
          },
          {
            "code": "PIU-PAI-PAI",
            "name": "Paita",
            "postalCodes": [
              "20700",
              "20701"
            ]
          },
          {
            "code": "PIU-PAI-TAM",
            "name": "Tamarindo",
            "postalCodes": [
              "20750"
            ]
          },
          {
            "code": "PIU-PAI-VIC",
            "name": "Vichayal",
            "postalCodes": [
              "20740",
              "20741"
            ]
          }
        ],
        "cities": [
          {
            "code": "PIU-PAI-AMO",
            "name": "Amotape",
            "postalCodes": [
              "20730"
            ]
          },
          {
            "code": "PIU-PAI-EL ",
            "name": "El Arenal",
            "postalCodes": [
              "20720"
            ]
          },
          {
            "code": "PIU-PAI-LA ",
            "name": "La Huaca",
            "postalCodes": [
              "20780",
              "20781"
            ]
          },
          {
            "code": "PIU-PAI-PAI",
            "name": "Paita",
            "postalCodes": [
              "20700",
              "20701"
            ]
          },
          {
            "code": "PIU-PAI-SAN",
            "name": "San Felipe de Vichayal",
            "postalCodes": [
              "20740",
              "20741"
            ]
          },
          {
            "code": "PIU-PAI-SAN",
            "name": "San Lucas (Pueblo Nuevo de Colan)",
            "postalCodes": [
              "20710",
              "20711"
            ]
          },
          {
            "code": "PIU-PAI-TAM",
            "name": "Tamarindo",
            "postalCodes": [
              "20750"
            ]
          }
        ]
      },
      {
        "code": "PIU-PIU",
        "name": "Piura",
        "districts": [
          {
            "code": "PIU-PIU-CAS",
            "name": "Castilla",
            "postalCodes": [
              "20002",
              "20003",
              "20000"
            ]
          },
          {
            "code": "PIU-PIU-CAT",
            "name": "Catacaos",
            "postalCodes": [
              "20006",
              "20004",
              "20000"
            ]
          },
          {
            "code": "PIU-PIU-CUR",
            "name": "Cura Mori",
            "postalCodes": [
              "20601",
              "20600"
            ]
          },
          {
            "code": "PIU-PIU-EL ",
            "name": "El Tallan",
            "postalCodes": [
              "20630"
            ]
          },
          {
            "code": "PIU-PIU-LA ",
            "name": "La Arena",
            "postalCodes": [
              "20621",
              "20620"
            ]
          },
          {
            "code": "PIU-PIU-LA ",
            "name": "La Unión",
            "postalCodes": [
              "20621",
              "20620"
            ]
          },
          {
            "code": "PIU-PIU-LAS",
            "name": "Las Lomas",
            "postalCodes": [
              "20210",
              "20211"
            ]
          },
          {
            "code": "PIU-PIU-PIU",
            "name": "Piura",
            "postalCodes": [
              "20009",
              "20007",
              "20001",
              "20004",
              "20008",
              "20000"
            ]
          },
          {
            "code": "PIU-PIU-TAM",
            "name": "Tambo Grande",
            "postalCodes": [
              "20201",
              "20200"
            ]
          }
        ],
        "cities": [
          {
            "code": "PIU-PIU-CAS",
            "name": "Castilla",
            "postalCodes": [
              "20000",
              "20002",
              "20003"
            ]
          },
          {
            "code": "PIU-PIU-CAT",
            "name": "Catacaos",
            "postalCodes": [
              "20000",
              "20004",
              "20006"
            ]
          },
          {
            "code": "PIU-PIU-CUC",
            "name": "Cucungara",
            "postalCodes": [
              "20600",
              "20601"
            ]
          },
          {
            "code": "PIU-PIU-LA ",
            "name": "La Arena",
            "postalCodes": [
              "20620",
              "20621"
            ]
          },
          {
            "code": "HUA-DOS-LA ",
            "name": "La Union",
            "postalCodes": [
              "10620",
              "10621",
              "20620",
              "20621"
            ]
          },
          {
            "code": "PIU-PIU-LAS",
            "name": "Las Lomas",
            "postalCodes": [
              "20210",
              "20211"
            ]
          },
          {
            "code": "PIU-PIU-PIU",
            "name": "Piura",
            "postalCodes": [
              "20000",
              "20001",
              "20004",
              "20007",
              "20008",
              "20009"
            ]
          },
          {
            "code": "PIU-PIU-SIN",
            "name": "Sinchao",
            "postalCodes": [
              "20630"
            ]
          },
          {
            "code": "PIU-PIU-TAM",
            "name": "Tambo Grande",
            "postalCodes": [
              "20200",
              "20201"
            ]
          }
        ]
      },
      {
        "code": "PIU-SEC",
        "name": "Sechura",
        "districts": [
          {
            "code": "PIU-SEC-BEL",
            "name": "Bellavista de la Unión",
            "postalCodes": [
              "20650"
            ]
          },
          {
            "code": "PIU-SEC-BER",
            "name": "Bernal",
            "postalCodes": [
              "20671",
              "20670"
            ]
          },
          {
            "code": "PIU-SEC-CRI",
            "name": "Cristo Nos Valga",
            "postalCodes": [
              "20680"
            ]
          },
          {
            "code": "PIU-SEC-RIN",
            "name": "Rinconada Llicuar",
            "postalCodes": [
              "20660"
            ]
          },
          {
            "code": "PIU-SEC-SEC",
            "name": "Sechura",
            "postalCodes": [
              "20691",
              "20690"
            ]
          },
          {
            "code": "PIU-SEC-VIC",
            "name": "Vice",
            "postalCodes": [
              "20641",
              "20640"
            ]
          }
        ],
        "cities": [
          {
            "code": "CAJ-JAE-BEL",
            "name": "Bellavista",
            "postalCodes": [
              "06815",
              "06816",
              "07001",
              "07006",
              "07011",
              "07016",
              "07021",
              "20101",
              "20102",
              "20650",
              "22740",
              "22741"
            ]
          },
          {
            "code": "PIU-SEC-BER",
            "name": "Bernal",
            "postalCodes": [
              "20670",
              "20671"
            ]
          },
          {
            "code": "PIU-SEC-DOS",
            "name": "Dos Pueblos",
            "postalCodes": [
              "20660"
            ]
          },
          {
            "code": "PIU-SEC-SAN",
            "name": "San Cristo",
            "postalCodes": [
              "20680"
            ]
          },
          {
            "code": "PIU-SEC-SEC",
            "name": "Sechura",
            "postalCodes": [
              "20690",
              "20691"
            ]
          },
          {
            "code": "PIU-SEC-VIC",
            "name": "Vice",
            "postalCodes": [
              "20640",
              "20641"
            ]
          }
        ]
      },
      {
        "code": "PIU-SUL",
        "name": "Sullana",
        "districts": [
          {
            "code": "PIU-SUL-BEL",
            "name": "Bellavista",
            "postalCodes": [
              "20101",
              "20102"
            ]
          },
          {
            "code": "PIU-SUL-IGN",
            "name": "Ignacio Escudero",
            "postalCodes": [
              "20761",
              "20760"
            ]
          },
          {
            "code": "PIU-SUL-LAN",
            "name": "Lancones",
            "postalCodes": [
              "20151",
              "20150"
            ]
          },
          {
            "code": "PIU-SUL-MAR",
            "name": "Marcavelica",
            "postalCodes": [
              "20121",
              "20120"
            ]
          },
          {
            "code": "PIU-SUL-MIG",
            "name": "Miguel Checa",
            "postalCodes": [
              "20771",
              "20770"
            ]
          },
          {
            "code": "PIU-SUL-QUE",
            "name": "Querecotillo",
            "postalCodes": [
              "20141",
              "20140"
            ]
          },
          {
            "code": "PIU-SUL-SAL",
            "name": "Salitral",
            "postalCodes": [
              "20130",
              "20131"
            ]
          },
          {
            "code": "PIU-SUL-SUL",
            "name": "Sullana",
            "postalCodes": [
              "20101",
              "20100",
              "20103",
              "20102"
            ]
          }
        ],
        "cities": [
          {
            "code": "CAJ-JAE-BEL",
            "name": "Bellavista",
            "postalCodes": [
              "06815",
              "06816",
              "07001",
              "07006",
              "07011",
              "07016",
              "07021",
              "20101",
              "20102",
              "20650",
              "22740",
              "22741"
            ]
          },
          {
            "code": "PIU-SUL-LAN",
            "name": "Lancones",
            "postalCodes": [
              "20150",
              "20151"
            ]
          },
          {
            "code": "PIU-SUL-MAR",
            "name": "Marcavelica",
            "postalCodes": [
              "20120",
              "20121"
            ]
          },
          {
            "code": "PIU-SUL-QUE",
            "name": "Querecotillo",
            "postalCodes": [
              "20140",
              "20141"
            ]
          },
          {
            "code": "PIU-SUL-SAL",
            "name": "Salitral",
            "postalCodes": [
              "20130",
              "20131",
              "20400",
              "20401"
            ]
          },
          {
            "code": "PIU-SUL-SAN",
            "name": "San Jacinto",
            "postalCodes": [
              "20760",
              "20761",
              "24400",
              "24401"
            ]
          },
          {
            "code": "PIU-SUL-SOJ",
            "name": "Sojo",
            "postalCodes": [
              "20770",
              "20771"
            ]
          },
          {
            "code": "PIU-SUL-SUL",
            "name": "Sullana",
            "postalCodes": [
              "20100",
              "20101",
              "20102",
              "20103"
            ]
          }
        ]
      },
      {
        "code": "PIU-TAL",
        "name": "Talara",
        "districts": [
          {
            "code": "PIU-TAL-EL ",
            "name": "El Alto",
            "postalCodes": [
              "20830",
              "20831"
            ]
          },
          {
            "code": "PIU-TAL-LA ",
            "name": "La Brea",
            "postalCodes": [
              "20800",
              "20801"
            ]
          },
          {
            "code": "PIU-TAL-LOB",
            "name": "Lobitos",
            "postalCodes": [
              "20820"
            ]
          },
          {
            "code": "PIU-TAL-LOS",
            "name": "Los Organos",
            "postalCodes": [
              "20840",
              "20841"
            ]
          },
          {
            "code": "PIU-TAL-MÁN",
            "name": "Máncora",
            "postalCodes": [
              "20851",
              "20850"
            ]
          },
          {
            "code": "PIU-TAL-PAR",
            "name": "Pariñas",
            "postalCodes": [
              "20811",
              "20810"
            ]
          }
        ],
        "cities": [
          {
            "code": "PIU-TAL-EL ",
            "name": "El Alto",
            "postalCodes": [
              "20830",
              "20831"
            ]
          },
          {
            "code": "PIU-TAL-LOB",
            "name": "Lobitos",
            "postalCodes": [
              "20820"
            ]
          },
          {
            "code": "PIU-TAL-LOS",
            "name": "Los Organos",
            "postalCodes": [
              "20840",
              "20841"
            ]
          },
          {
            "code": "PIU-TAL-MAN",
            "name": "Mancora",
            "postalCodes": [
              "20850",
              "20851"
            ]
          },
          {
            "code": "PIU-TAL-NEG",
            "name": "Negritos",
            "postalCodes": [
              "20800",
              "20801"
            ]
          },
          {
            "code": "PIU-TAL-TAL",
            "name": "Talara",
            "postalCodes": [
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
        "code": "PUN-AZA",
        "name": "Azangaro",
        "districts": [
          {
            "code": "PUN-AZA-ACH",
            "name": "Achaya",
            "postalCodes": [
              "21180"
            ]
          },
          {
            "code": "PUN-AZA-ARA",
            "name": "Arapa",
            "postalCodes": [
              "21170",
              "21169"
            ]
          },
          {
            "code": "PUN-AZA-ASI",
            "name": "Asillo",
            "postalCodes": [
              "21149",
              "21150"
            ]
          },
          {
            "code": "PUN-AZA-AZA",
            "name": "Azangaro",
            "postalCodes": [
              "21157",
              "21160"
            ]
          },
          {
            "code": "PUN-AZA-CAM",
            "name": "Caminaca",
            "postalCodes": [
              "21175"
            ]
          },
          {
            "code": "PUN-AZA-CHU",
            "name": "Chupa",
            "postalCodes": [
              "21320",
              "21321"
            ]
          },
          {
            "code": "PUN-AZA-JOS",
            "name": "José Domingo Choquehuanca",
            "postalCodes": [
              "21139",
              "21140"
            ]
          },
          {
            "code": "PUN-AZA-MUÑ",
            "name": "Muñani",
            "postalCodes": [
              "21346",
              "21345"
            ]
          },
          {
            "code": "PUN-AZA-POT",
            "name": "Potoni",
            "postalCodes": [
              "21211",
              "21210"
            ]
          },
          {
            "code": "PUN-AZA-SAM",
            "name": "Saman",
            "postalCodes": [
              "21301",
              "21300"
            ]
          },
          {
            "code": "PUN-AZA-SAN",
            "name": "San Antón",
            "postalCodes": [
              "21200",
              "21201"
            ]
          },
          {
            "code": "PUN-AZA-SAN",
            "name": "San José",
            "postalCodes": [
              "21162",
              "21165"
            ]
          },
          {
            "code": "PUN-AZA-SAN",
            "name": "San Juan de Salinas",
            "postalCodes": [
              "21166"
            ]
          },
          {
            "code": "PUN-AZA-SAN",
            "name": "Santiago de Pupuja",
            "postalCodes": [
              "21145",
              "21143"
            ]
          },
          {
            "code": "PUN-AZA-TIR",
            "name": "Tirapata",
            "postalCodes": [
              "21146"
            ]
          }
        ],
        "cities": [
          {
            "code": "PUN-AZA-ACH",
            "name": "Achaya",
            "postalCodes": [
              "21180"
            ]
          },
          {
            "code": "PUN-AZA-ARA",
            "name": "Arapa",
            "postalCodes": [
              "21169",
              "21170"
            ]
          },
          {
            "code": "PUN-AZA-ASI",
            "name": "Asillo",
            "postalCodes": [
              "21149",
              "21150"
            ]
          },
          {
            "code": "LIM-YAU-AZA",
            "name": "Azangaro",
            "postalCodes": [
              "15740",
              "21157",
              "21160"
            ]
          },
          {
            "code": "PUN-AZA-CAM",
            "name": "Caminaca",
            "postalCodes": [
              "21175"
            ]
          },
          {
            "code": "PUN-AZA-CHU",
            "name": "Chupa",
            "postalCodes": [
              "21320",
              "21321"
            ]
          },
          {
            "code": "PUN-AZA-EST",
            "name": "Estacion de Pucara",
            "postalCodes": [
              "21139",
              "21140"
            ]
          },
          {
            "code": "PUN-AZA-MUÑ",
            "name": "Muñani",
            "postalCodes": [
              "21345",
              "21346"
            ]
          },
          {
            "code": "PUN-AZA-POT",
            "name": "Potoni",
            "postalCodes": [
              "21210",
              "21211"
            ]
          },
          {
            "code": "PUN-AZA-SAM",
            "name": "Saman",
            "postalCodes": [
              "21300",
              "21301"
            ]
          },
          {
            "code": "PUN-AZA-SAN",
            "name": "San Anton",
            "postalCodes": [
              "21200",
              "21201"
            ]
          },
          {
            "code": "ARE-CAM-SAN",
            "name": "San Jose",
            "postalCodes": [
              "04465",
              "04466",
              "13830",
              "13831",
              "14000",
              "14051",
              "21162",
              "21165"
            ]
          },
          {
            "code": "PUN-AZA-SAN",
            "name": "San Juan de Salinas",
            "postalCodes": [
              "21166"
            ]
          },
          {
            "code": "PUN-AZA-SAN",
            "name": "Santiago de Pupuja",
            "postalCodes": [
              "21143",
              "21145"
            ]
          },
          {
            "code": "PUN-AZA-TIR",
            "name": "Tirapata",
            "postalCodes": [
              "21146"
            ]
          }
        ]
      },
      {
        "code": "PUN-CAR",
        "name": "Carabaya",
        "districts": [
          {
            "code": "PUN-CAR-AJO",
            "name": "Ajoyani",
            "postalCodes": [
              "21240"
            ]
          },
          {
            "code": "PUN-CAR-AYA",
            "name": "Ayapata",
            "postalCodes": [
              "21261",
              "21260"
            ]
          },
          {
            "code": "PUN-CAR-COA",
            "name": "Coasa",
            "postalCodes": [
              "21245",
              "21246"
            ]
          },
          {
            "code": "PUN-CAR-COR",
            "name": "Corani",
            "postalCodes": [
              "21265"
            ]
          },
          {
            "code": "PUN-CAR-CRU",
            "name": "Crucero",
            "postalCodes": [
              "21215",
              "21216"
            ]
          },
          {
            "code": "PUN-CAR-ITU",
            "name": "Ituata",
            "postalCodes": [
              "21255",
              "21256"
            ]
          },
          {
            "code": "PUN-CAR-MAC",
            "name": "Macusani",
            "postalCodes": [
              "21251",
              "21250"
            ]
          },
          {
            "code": "PUN-CAR-OLL",
            "name": "Ollachea",
            "postalCodes": [
              "21270"
            ]
          },
          {
            "code": "PUN-CAR-SAN",
            "name": "San Gaban",
            "postalCodes": [
              "21275"
            ]
          },
          {
            "code": "PUN-CAR-USI",
            "name": "Usicayos",
            "postalCodes": [
              "21236",
              "21235"
            ]
          }
        ],
        "cities": [
          {
            "code": "PUN-CAR-AJO",
            "name": "Ajoyani",
            "postalCodes": [
              "21240"
            ]
          },
          {
            "code": "PUN-CAR-AYA",
            "name": "Ayapata",
            "postalCodes": [
              "21260",
              "21261"
            ]
          },
          {
            "code": "PUN-CAR-COA",
            "name": "Coasa",
            "postalCodes": [
              "21245",
              "21246"
            ]
          },
          {
            "code": "PUN-CAR-COR",
            "name": "Corani",
            "postalCodes": [
              "21265"
            ]
          },
          {
            "code": "PUN-CAR-CRU",
            "name": "Crucero",
            "postalCodes": [
              "21215",
              "21216"
            ]
          },
          {
            "code": "PUN-CAR-LAN",
            "name": "Lanlacuni Bajo",
            "postalCodes": [
              "21275"
            ]
          },
          {
            "code": "PUN-CAR-MAC",
            "name": "Macusani",
            "postalCodes": [
              "21250",
              "21251"
            ]
          },
          {
            "code": "PUN-CAR-OLL",
            "name": "Ollachea",
            "postalCodes": [
              "21270"
            ]
          },
          {
            "code": "ARE-ARE-TAM",
            "name": "Tambillo",
            "postalCodes": [
              "04105",
              "05300",
              "05301",
              "21255",
              "21256"
            ]
          },
          {
            "code": "PUN-CAR-USI",
            "name": "Usicayos",
            "postalCodes": [
              "21235",
              "21236"
            ]
          }
        ]
      },
      {
        "code": "PUN-CHU",
        "name": "Chucuito",
        "districts": [
          {
            "code": "PUN-CHU-DES",
            "name": "Desaguadero",
            "postalCodes": [
              "21611",
              "21610"
            ]
          },
          {
            "code": "PUN-CHU-HUA",
            "name": "Huacullani",
            "postalCodes": [
              "21620",
              "21621"
            ]
          },
          {
            "code": "PUN-CHU-JUL",
            "name": "Juli",
            "postalCodes": [
              "21531",
              "21530"
            ]
          },
          {
            "code": "PUN-CHU-KEL",
            "name": "Kelluyo",
            "postalCodes": [
              "21631",
              "21630"
            ]
          },
          {
            "code": "PUN-CHU-PIS",
            "name": "Pisacoma",
            "postalCodes": [
              "21641",
              "21640"
            ]
          },
          {
            "code": "PUN-CHU-POM",
            "name": "Pomata",
            "postalCodes": [
              "21535",
              "21536"
            ]
          },
          {
            "code": "PUN-CHU-ZEP",
            "name": "Zepita",
            "postalCodes": [
              "21601",
              "21600"
            ]
          }
        ],
        "cities": [
          {
            "code": "PUN-CHU-DES",
            "name": "Desaguadero",
            "postalCodes": [
              "21610",
              "21611"
            ]
          },
          {
            "code": "PUN-CHU-HUA",
            "name": "Huacullani",
            "postalCodes": [
              "21620",
              "21621"
            ]
          },
          {
            "code": "PUN-CHU-JUL",
            "name": "Juli",
            "postalCodes": [
              "21530",
              "21531"
            ]
          },
          {
            "code": "PUN-CHU-KEL",
            "name": "Kelluyo",
            "postalCodes": [
              "21630",
              "21631"
            ]
          },
          {
            "code": "PUN-CHU-PIS",
            "name": "Pisacoma",
            "postalCodes": [
              "21640",
              "21641"
            ]
          },
          {
            "code": "PUN-CHU-POM",
            "name": "Pomata",
            "postalCodes": [
              "21535",
              "21536"
            ]
          },
          {
            "code": "PUN-CHU-ZEP",
            "name": "Zepita",
            "postalCodes": [
              "21600",
              "21601"
            ]
          }
        ]
      },
      {
        "code": "PUN-EL ",
        "name": "El Collao",
        "districts": [
          {
            "code": "PUN-EL -CAP",
            "name": "Capazo",
            "postalCodes": [
              "21650"
            ]
          },
          {
            "code": "PUN-EL -CON",
            "name": "Conduriri",
            "postalCodes": [
              "21670"
            ]
          },
          {
            "code": "PUN-EL -ILA",
            "name": "Ilave",
            "postalCodes": [
              "21500",
              "21501"
            ]
          },
          {
            "code": "PUN-EL -PIL",
            "name": "Pilcuyo",
            "postalCodes": [
              "21525",
              "21526"
            ]
          },
          {
            "code": "PUN-EL -SAN",
            "name": "Santa Rosa",
            "postalCodes": [
              "21660",
              "21661"
            ]
          }
        ],
        "cities": [
          {
            "code": "PUN-EL -CAP",
            "name": "Capazo",
            "postalCodes": [
              "21650"
            ]
          },
          {
            "code": "PUN-EL -CON",
            "name": "Conduriri",
            "postalCodes": [
              "21670"
            ]
          },
          {
            "code": "PUN-EL -ILA",
            "name": "Ilave",
            "postalCodes": [
              "21500",
              "21501"
            ]
          },
          {
            "code": "PUN-EL -MAZ",
            "name": "Mazo Cruz",
            "postalCodes": [
              "21660",
              "21661"
            ]
          },
          {
            "code": "PUN-EL -PIL",
            "name": "Pilcuyo",
            "postalCodes": [
              "21525",
              "21526"
            ]
          }
        ]
      },
      {
        "code": "PUN-HUA",
        "name": "Huancane",
        "districts": [
          {
            "code": "PUN-HUA-COJ",
            "name": "Cojata",
            "postalCodes": [
              "21410"
            ]
          },
          {
            "code": "PUN-HUA-HUA",
            "name": "Huancané",
            "postalCodes": [
              "21315",
              "21316"
            ]
          },
          {
            "code": "PUN-HUA-HUA",
            "name": "Huatasani",
            "postalCodes": [
              "21325"
            ]
          },
          {
            "code": "PUN-HUA-INC",
            "name": "Inchupalla",
            "postalCodes": [
              "21330"
            ]
          },
          {
            "code": "PUN-HUA-PUS",
            "name": "Pusi",
            "postalCodes": [
              "21311",
              "21310"
            ]
          },
          {
            "code": "PUN-HUA-RAS",
            "name": "Rasaspata",
            "postalCodes": [
              "21421",
              "21420"
            ]
          },
          {
            "code": "PUN-HUA-TAR",
            "name": "Taraco",
            "postalCodes": [
              "21305",
              "21306"
            ]
          },
          {
            "code": "PUN-HUA-VIL",
            "name": "Vilque Chico",
            "postalCodes": [
              "21400",
              "21401"
            ]
          }
        ],
        "cities": [
          {
            "code": "PUN-HUA-COJ",
            "name": "Cojata",
            "postalCodes": [
              "21410"
            ]
          },
          {
            "code": "PUN-HUA-HUA",
            "name": "Huancane",
            "postalCodes": [
              "21315",
              "21316"
            ]
          },
          {
            "code": "PUN-HUA-HUA",
            "name": "Huatasani",
            "postalCodes": [
              "21325"
            ]
          },
          {
            "code": "PUN-HUA-INC",
            "name": "Inchupalla",
            "postalCodes": [
              "21330"
            ]
          },
          {
            "code": "PUN-HUA-PUS",
            "name": "Pusi",
            "postalCodes": [
              "21310",
              "21311"
            ]
          },
          {
            "code": "PUN-HUA-ROS",
            "name": "Rosaspata",
            "postalCodes": [
              "21420",
              "21421"
            ]
          },
          {
            "code": "PUN-HUA-TAR",
            "name": "Taraco",
            "postalCodes": [
              "21305",
              "21306"
            ]
          },
          {
            "code": "PUN-HUA-VIL",
            "name": "Vilque Chico",
            "postalCodes": [
              "21400",
              "21401"
            ]
          }
        ]
      },
      {
        "code": "PUN-LAM",
        "name": "Lampa",
        "districts": [
          {
            "code": "PUN-LAM-CAB",
            "name": "Cabanilla",
            "postalCodes": [
              "21710",
              "21711"
            ]
          },
          {
            "code": "PUN-LAM-CAL",
            "name": "Calapuja",
            "postalCodes": [
              "21130"
            ]
          },
          {
            "code": "PUN-LAM-LAM",
            "name": "Lampa",
            "postalCodes": [
              "21801",
              "21800"
            ]
          },
          {
            "code": "PUN-LAM-NIC",
            "name": "Nicasio",
            "postalCodes": [
              "21135"
            ]
          },
          {
            "code": "PUN-LAM-OCU",
            "name": "Ocuviri",
            "postalCodes": [
              "21825"
            ]
          },
          {
            "code": "PUN-LAM-PAL",
            "name": "Palca",
            "postalCodes": [
              "21805"
            ]
          },
          {
            "code": "PUN-LAM-PAR",
            "name": "Paratía",
            "postalCodes": [
              "21781",
              "21780"
            ]
          },
          {
            "code": "PUN-LAM-PUC",
            "name": "Pucará",
            "postalCodes": [
              "21136",
              "21137"
            ]
          },
          {
            "code": "PUN-LAM-SAN",
            "name": "Santa Lucía",
            "postalCodes": [
              "21770",
              "21771"
            ]
          },
          {
            "code": "PUN-LAM-VIL",
            "name": "Vilavila",
            "postalCodes": [
              "21815"
            ]
          }
        ],
        "cities": [
          {
            "code": "PUN-LAM-CAB",
            "name": "Cabanilla",
            "postalCodes": [
              "21710",
              "21711"
            ]
          },
          {
            "code": "PUN-LAM-CAL",
            "name": "Calapuja",
            "postalCodes": [
              "21130"
            ]
          },
          {
            "code": "AYA-PAU-LAM",
            "name": "Lampa",
            "postalCodes": [
              "05645",
              "12245",
              "12246",
              "21800",
              "21801"
            ]
          },
          {
            "code": "PUN-LAM-NIC",
            "name": "Nicasio",
            "postalCodes": [
              "21135"
            ]
          },
          {
            "code": "PUN-LAM-OCU",
            "name": "Ocuviri",
            "postalCodes": [
              "21825"
            ]
          },
          {
            "code": "HUA-HUA-PAL",
            "name": "Palca",
            "postalCodes": [
              "09105",
              "12830",
              "12831",
              "21805",
              "23550"
            ]
          },
          {
            "code": "PUN-LAM-PAR",
            "name": "Paratia",
            "postalCodes": [
              "21780",
              "21781"
            ]
          },
          {
            "code": "CAJ-JAE-PUC",
            "name": "Pucara",
            "postalCodes": [
              "06725",
              "06726",
              "12404",
              "12405",
              "12845",
              "21136",
              "21137"
            ]
          },
          {
            "code": "AYA-LUC-SAN",
            "name": "Santa Lucia",
            "postalCodes": [
              "05570",
              "21770",
              "21771"
            ]
          },
          {
            "code": "PUN-LAM-VIL",
            "name": "Vilavila",
            "postalCodes": [
              "21815"
            ]
          }
        ]
      },
      {
        "code": "PUN-MEL",
        "name": "Melgar",
        "districts": [
          {
            "code": "PUN-MEL-ANT",
            "name": "Antauta",
            "postalCodes": [
              "21205"
            ]
          },
          {
            "code": "PUN-MEL-AYA",
            "name": "Ayavarí",
            "postalCodes": [
              "21865",
              "21866"
            ]
          },
          {
            "code": "PUN-MEL-CUP",
            "name": "Cupi",
            "postalCodes": [
              "21845"
            ]
          },
          {
            "code": "PUN-MEL-LLA",
            "name": "Llalli",
            "postalCodes": [
              "21835"
            ]
          },
          {
            "code": "PUN-MEL-MAC",
            "name": "Macarí",
            "postalCodes": [
              "21875",
              "21876"
            ]
          },
          {
            "code": "PUN-MEL-NUÑ",
            "name": "Nuñoa",
            "postalCodes": [
              "21896",
              "21895"
            ]
          },
          {
            "code": "PUN-MEL-ORU",
            "name": "Orurillo",
            "postalCodes": [
              "21155",
              "21153"
            ]
          },
          {
            "code": "PUN-MEL-SAN",
            "name": "Santa Rosa",
            "postalCodes": [
              "21885",
              "21886"
            ]
          },
          {
            "code": "PUN-MEL-UMA",
            "name": "Umachiri",
            "postalCodes": [
              "21855"
            ]
          }
        ],
        "cities": [
          {
            "code": "PUN-MEL-ANT",
            "name": "Antauta",
            "postalCodes": [
              "21205"
            ]
          },
          {
            "code": "LIM-YAU-AYA",
            "name": "Ayaviri",
            "postalCodes": [
              "15675",
              "21865",
              "21866"
            ]
          },
          {
            "code": "PUN-MEL-CUP",
            "name": "Cupi",
            "postalCodes": [
              "21845"
            ]
          },
          {
            "code": "PUN-MEL-LLA",
            "name": "Llalli",
            "postalCodes": [
              "21835"
            ]
          },
          {
            "code": "PUN-MEL-MAC",
            "name": "Macari",
            "postalCodes": [
              "21875",
              "21876"
            ]
          },
          {
            "code": "PUN-MEL-NUÑ",
            "name": "Nuñoa",
            "postalCodes": [
              "21895",
              "21896"
            ]
          },
          {
            "code": "PUN-MEL-ORU",
            "name": "Orurillo",
            "postalCodes": [
              "21153",
              "21155"
            ]
          },
          {
            "code": "ANC-PAL-SAN",
            "name": "Santa Rosa",
            "postalCodes": [
              "02825",
              "03345",
              "05240",
              "05241",
              "06820",
              "06821",
              "12200",
              "14840",
              "14841",
              "15123",
              "21885",
              "21886",
              "22720",
              "22721"
            ]
          },
          {
            "code": "PUN-MEL-UMA",
            "name": "Umachiri",
            "postalCodes": [
              "21855"
            ]
          }
        ]
      },
      {
        "code": "PUN-MOH",
        "name": "Moho",
        "districts": [
          {
            "code": "PUN-MOH-CON",
            "name": "Conima",
            "postalCodes": [
              "21450"
            ]
          },
          {
            "code": "PUN-MOH-HUA",
            "name": "Huayrapata",
            "postalCodes": [
              "21440"
            ]
          },
          {
            "code": "PUN-MOH-MOH",
            "name": "Moho",
            "postalCodes": [
              "21431",
              "21430"
            ]
          },
          {
            "code": "PUN-MOH-TIL",
            "name": "Tilali",
            "postalCodes": [
              "21460"
            ]
          }
        ],
        "cities": [
          {
            "code": "PUN-MOH-CON",
            "name": "Conima",
            "postalCodes": [
              "21450"
            ]
          },
          {
            "code": "PUN-MOH-HUA",
            "name": "Huayrapata",
            "postalCodes": [
              "21440"
            ]
          },
          {
            "code": "PUN-MOH-MOH",
            "name": "Moho",
            "postalCodes": [
              "21430",
              "21431"
            ]
          },
          {
            "code": "PUN-MOH-TIL",
            "name": "Tilali",
            "postalCodes": [
              "21460"
            ]
          }
        ]
      },
      {
        "code": "PUN-PUN",
        "name": "Puno",
        "districts": [
          {
            "code": "PUN-PUN-ACO",
            "name": "Acora",
            "postalCodes": [
              "21510",
              "21511"
            ]
          },
          {
            "code": "PUN-PUN-AMA",
            "name": "Amantani",
            "postalCodes": [
              "21127"
            ]
          },
          {
            "code": "PUN-PUN-ATU",
            "name": "Atuncolla",
            "postalCodes": [
              "21115",
              "21113"
            ]
          },
          {
            "code": "PUN-PUN-CAP",
            "name": "Capachica",
            "postalCodes": [
              "21125",
              "21123"
            ]
          },
          {
            "code": "PUN-PUN-CHU",
            "name": "Chucuito",
            "postalCodes": [
              "21521",
              "21520"
            ]
          },
          {
            "code": "PUN-PUN-COA",
            "name": "Coata",
            "postalCodes": [
              "21120",
              "21119"
            ]
          },
          {
            "code": "PUN-PUN-HUA",
            "name": "Huata",
            "postalCodes": [
              "21116",
              "21117"
            ]
          },
          {
            "code": "PUN-PUN-MAÑ",
            "name": "Mañozo",
            "postalCodes": [
              "21730",
              "21731"
            ]
          },
          {
            "code": "PUN-PUN-PAU",
            "name": "Paucarcolla",
            "postalCodes": [
              "21110"
            ]
          },
          {
            "code": "PUN-PUN-PIC",
            "name": "Pichacani",
            "postalCodes": [
              "21576",
              "21575"
            ]
          },
          {
            "code": "PUN-PUN-PLA",
            "name": "Platería",
            "postalCodes": [
              "21515",
              "21516"
            ]
          },
          {
            "code": "PUN-PUN-PUN",
            "name": "Puno",
            "postalCodes": [
              "21001",
              "21000",
              "21002"
            ]
          },
          {
            "code": "PUN-PUN-SAN",
            "name": "San Antonio",
            "postalCodes": [
              "21760"
            ]
          },
          {
            "code": "PUN-PUN-TIQ",
            "name": "Tiquillaca",
            "postalCodes": [
              "21750"
            ]
          },
          {
            "code": "PUN-PUN-VIL",
            "name": "Vilque",
            "postalCodes": [
              "21740"
            ]
          }
        ],
        "cities": [
          {
            "code": "PUN-PUN-ACO",
            "name": "Acora",
            "postalCodes": [
              "21510",
              "21511"
            ]
          },
          {
            "code": "PUN-PUN-AMA",
            "name": "Amantani",
            "postalCodes": [
              "21127"
            ]
          },
          {
            "code": "PUN-PUN-ATU",
            "name": "Atuncolla",
            "postalCodes": [
              "21113",
              "21115"
            ]
          },
          {
            "code": "PUN-PUN-CAP",
            "name": "Capachica",
            "postalCodes": [
              "21123",
              "21125"
            ]
          },
          {
            "code": "PUN-PUN-CHU",
            "name": "Chucuito",
            "postalCodes": [
              "21520",
              "21521"
            ]
          },
          {
            "code": "PUN-PUN-COA",
            "name": "Coata",
            "postalCodes": [
              "21119",
              "21120"
            ]
          },
          {
            "code": "ANC-HUA-HUA",
            "name": "Huata",
            "postalCodes": [
              "02175",
              "21116",
              "21117"
            ]
          },
          {
            "code": "PUN-PUN-JUN",
            "name": "Juncal",
            "postalCodes": [
              "21760"
            ]
          },
          {
            "code": "PUN-PUN-LAR",
            "name": "Laraqueri",
            "postalCodes": [
              "21575",
              "21576"
            ]
          },
          {
            "code": "PUN-PUN-MAÑ",
            "name": "Mañazo",
            "postalCodes": [
              "21730",
              "21731"
            ]
          },
          {
            "code": "PUN-PUN-PAU",
            "name": "Paucarcolla",
            "postalCodes": [
              "21110"
            ]
          },
          {
            "code": "PUN-PUN-PLA",
            "name": "Plateria",
            "postalCodes": [
              "21515",
              "21516"
            ]
          },
          {
            "code": "PUN-PUN-PUN",
            "name": "Puno",
            "postalCodes": [
              "21000",
              "21001",
              "21002"
            ]
          },
          {
            "code": "PUN-PUN-TIQ",
            "name": "Tiquillaca",
            "postalCodes": [
              "21750"
            ]
          },
          {
            "code": "PUN-PUN-VIL",
            "name": "Vilque",
            "postalCodes": [
              "21740"
            ]
          }
        ]
      },
      {
        "code": "PUN-SAN",
        "name": "San Antonio de Putina",
        "districts": [
          {
            "code": "PUN-SAN-ANA",
            "name": "Ananea",
            "postalCodes": [
              "21356",
              "21355"
            ]
          },
          {
            "code": "PUN-SAN-PED",
            "name": "Pedro Vilca Apaza",
            "postalCodes": [
              "21335"
            ]
          },
          {
            "code": "PUN-SAN-PUT",
            "name": "Putina",
            "postalCodes": [
              "21340",
              "21341"
            ]
          },
          {
            "code": "PUN-SAN-QUI",
            "name": "Quilcapuncu",
            "postalCodes": [
              "21351",
              "21350"
            ]
          },
          {
            "code": "PUN-SAN-SIN",
            "name": "Sina",
            "postalCodes": [
              "21395"
            ]
          }
        ],
        "cities": [
          {
            "code": "PUN-SAN-ANA",
            "name": "Ananea",
            "postalCodes": [
              "21355",
              "21356"
            ]
          },
          {
            "code": "PUN-SAN-AYR",
            "name": "Ayrampuni",
            "postalCodes": [
              "21335"
            ]
          },
          {
            "code": "PUN-SAN-PUT",
            "name": "Putina",
            "postalCodes": [
              "21340",
              "21341"
            ]
          },
          {
            "code": "PUN-SAN-QUI",
            "name": "Quilcapuncu",
            "postalCodes": [
              "21350",
              "21351"
            ]
          },
          {
            "code": "PUN-SAN-SIN",
            "name": "Sina",
            "postalCodes": [
              "21395"
            ]
          }
        ]
      },
      {
        "code": "PUN-SAN",
        "name": "San Román",
        "districts": [
          {
            "code": "PUN-SAN-CAB",
            "name": "Cabana",
            "postalCodes": [
              "21700"
            ]
          },
          {
            "code": "PUN-SAN-CAB",
            "name": "Cabanillas",
            "postalCodes": [
              "21721",
              "21720"
            ]
          },
          {
            "code": "PUN-SAN-CAR",
            "name": "Caracoto",
            "postalCodes": [
              "21107",
              "21108"
            ]
          },
          {
            "code": "PUN-SAN-JUL",
            "name": "Juliaca",
            "postalCodes": [
              "21104",
              "21100",
              "21102",
              "21103",
              "21101"
            ]
          }
        ],
        "cities": [
          {
            "code": "ANC-PAL-CAB",
            "name": "Cabana",
            "postalCodes": [
              "02850",
              "05475",
              "21700"
            ]
          },
          {
            "code": "PUN-SAN-CAR",
            "name": "Caracoto",
            "postalCodes": [
              "21107",
              "21108"
            ]
          },
          {
            "code": "PUN-SAN-DEU",
            "name": "Deustua",
            "postalCodes": [
              "21720",
              "21721"
            ]
          },
          {
            "code": "PUN-SAN-JUL",
            "name": "Juliaca",
            "postalCodes": [
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
        "code": "PUN-SAN",
        "name": "Sandia",
        "districts": [
          {
            "code": "PUN-SAN-ALT",
            "name": "Alto Inambari",
            "postalCodes": [
              "21370",
              "21371"
            ]
          },
          {
            "code": "PUN-SAN-CUY",
            "name": "Cuyocuyo",
            "postalCodes": [
              "21360",
              "21361"
            ]
          },
          {
            "code": "PUN-SAN-LIM",
            "name": "Limbani",
            "postalCodes": [
              "21225"
            ]
          },
          {
            "code": "PUN-SAN-PAT",
            "name": "Patambuco",
            "postalCodes": [
              "21220"
            ]
          },
          {
            "code": "PUN-SAN-PHA",
            "name": "Phara",
            "postalCodes": [
              "21230"
            ]
          },
          {
            "code": "PUN-SAN-QUI",
            "name": "Quiaca",
            "postalCodes": [
              "21390"
            ]
          },
          {
            "code": "PUN-SAN-SAN",
            "name": "San Juan del Oro",
            "postalCodes": [
              "21376",
              "21375"
            ]
          },
          {
            "code": "PUN-SAN-SAN",
            "name": "San Pedro de Putína Punco",
            "postalCodes": [
              "21381",
              "21380"
            ]
          },
          {
            "code": "PUN-SAN-SAN",
            "name": "Sandia",
            "postalCodes": [
              "21365",
              "21366"
            ]
          },
          {
            "code": "PUN-SAN-YAN",
            "name": "Yanahuaya",
            "postalCodes": [
              "21385"
            ]
          }
        ],
        "cities": [
          {
            "code": "PUN-SAN-CUY",
            "name": "Cuyocuyo",
            "postalCodes": [
              "21360",
              "21361"
            ]
          },
          {
            "code": "PUN-SAN-LIM",
            "name": "Limbani",
            "postalCodes": [
              "21225"
            ]
          },
          {
            "code": "PUN-SAN-MAS",
            "name": "Massiapo",
            "postalCodes": [
              "21370",
              "21371"
            ]
          },
          {
            "code": "PUN-SAN-PAT",
            "name": "Patambuco",
            "postalCodes": [
              "21220"
            ]
          },
          {
            "code": "PUN-SAN-PHA",
            "name": "Phara",
            "postalCodes": [
              "21230"
            ]
          },
          {
            "code": "PUN-SAN-PUT",
            "name": "Putina Punco",
            "postalCodes": [
              "21380",
              "21381"
            ]
          },
          {
            "code": "PUN-SAN-QUI",
            "name": "Quiaca",
            "postalCodes": [
              "21390"
            ]
          },
          {
            "code": "PUN-SAN-SAN",
            "name": "San Juan del Oro",
            "postalCodes": [
              "21375",
              "21376"
            ]
          },
          {
            "code": "PUN-SAN-SAN",
            "name": "Sandia",
            "postalCodes": [
              "21365",
              "21366"
            ]
          },
          {
            "code": "PUN-SAN-YAN",
            "name": "Yanahuaya",
            "postalCodes": [
              "21385"
            ]
          }
        ]
      },
      {
        "code": "PUN-YUN",
        "name": "Yunguyo",
        "districts": [
          {
            "code": "PUN-YUN-ANA",
            "name": "Anapia",
            "postalCodes": [
              "21565"
            ]
          },
          {
            "code": "PUN-YUN-COP",
            "name": "Copani",
            "postalCodes": [
              "21571",
              "21570"
            ]
          },
          {
            "code": "PUN-YUN-CUT",
            "name": "Cuturapi",
            "postalCodes": [
              "21540"
            ]
          },
          {
            "code": "PUN-YUN-OLL",
            "name": "Ollaraya",
            "postalCodes": [
              "21550"
            ]
          },
          {
            "code": "PUN-YUN-TIN",
            "name": "Tinicachi",
            "postalCodes": [
              "21560"
            ]
          },
          {
            "code": "PUN-YUN-UNI",
            "name": "Unicachi",
            "postalCodes": [
              "21555"
            ]
          },
          {
            "code": "PUN-YUN-YUN",
            "name": "Yunguyo",
            "postalCodes": [
              "21545",
              "21546"
            ]
          }
        ],
        "cities": [
          {
            "code": "PUN-YUN-ANA",
            "name": "Anapia",
            "postalCodes": [
              "21565"
            ]
          },
          {
            "code": "PUN-YUN-COP",
            "name": "Copani",
            "postalCodes": [
              "21570",
              "21571"
            ]
          },
          {
            "code": "PUN-YUN-MAR",
            "name": "Marcaja",
            "postalCodes": [
              "21555"
            ]
          },
          {
            "code": "PUN-YUN-SAN",
            "name": "San Juan de Cuturapi",
            "postalCodes": [
              "21540"
            ]
          },
          {
            "code": "PUN-YUN-SAN",
            "name": "San Miguel de Ollaraya",
            "postalCodes": [
              "21550"
            ]
          },
          {
            "code": "PUN-YUN-TIN",
            "name": "Tinicachi",
            "postalCodes": [
              "21560"
            ]
          },
          {
            "code": "PUN-YUN-YUN",
            "name": "Yunguyo",
            "postalCodes": [
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
        "code": "SAN-BEL",
        "name": "Bellavista",
        "districts": [
          {
            "code": "SAN-BEL-ALT",
            "name": "Alto Biavo",
            "postalCodes": [
              "22490",
              "22491"
            ]
          },
          {
            "code": "SAN-BEL-BAJ",
            "name": "Bajo Biavo",
            "postalCodes": [
              "22480",
              "22481"
            ]
          },
          {
            "code": "SAN-BEL-BEL",
            "name": "Bellavista",
            "postalCodes": [
              "22740",
              "22741"
            ]
          },
          {
            "code": "SAN-BEL-HUA",
            "name": "Huallaga",
            "postalCodes": [
              "22510"
            ]
          },
          {
            "code": "SAN-BEL-SAN",
            "name": "San Pablo",
            "postalCodes": [
              "22731",
              "22730"
            ]
          },
          {
            "code": "SAN-BEL-SAN",
            "name": "San Rafael",
            "postalCodes": [
              "22470",
              "22471"
            ]
          }
        ],
        "cities": [
          {
            "code": "CAJ-JAE-BEL",
            "name": "Bellavista",
            "postalCodes": [
              "06815",
              "06816",
              "07001",
              "07006",
              "07011",
              "07016",
              "07021",
              "20101",
              "20102",
              "20650",
              "22740",
              "22741"
            ]
          },
          {
            "code": "SAN-BEL-CUZ",
            "name": "Cuzco",
            "postalCodes": [
              "22490",
              "22491"
            ]
          },
          {
            "code": "SAN-BEL-LED",
            "name": "Ledoy",
            "postalCodes": [
              "22510"
            ]
          },
          {
            "code": "SAN-BEL-NUE",
            "name": "Nuevo Lima",
            "postalCodes": [
              "22480",
              "22481"
            ]
          },
          {
            "code": "CAJ-SAN-SAN",
            "name": "San Pablo",
            "postalCodes": [
              "06451",
              "06452",
              "08250",
              "22730",
              "22731"
            ]
          },
          {
            "code": "HUA-AMB-SAN",
            "name": "San Rafael",
            "postalCodes": [
              "10430",
              "10431",
              "22470",
              "22471"
            ]
          }
        ]
      },
      {
        "code": "SAN-EL ",
        "name": "El Dorado",
        "districts": [
          {
            "code": "SAN-EL -AGU",
            "name": "Agua Blanca",
            "postalCodes": [
              "22710"
            ]
          },
          {
            "code": "SAN-EL -SAN",
            "name": "San José de Sisa",
            "postalCodes": [
              "22701",
              "22700"
            ]
          },
          {
            "code": "SAN-EL -SAN",
            "name": "San Martín",
            "postalCodes": [
              "22770",
              "22771"
            ]
          },
          {
            "code": "SAN-EL -SAN",
            "name": "Santa Rosa",
            "postalCodes": [
              "22721",
              "22720"
            ]
          },
          {
            "code": "SAN-EL -SHA",
            "name": "Shatoja",
            "postalCodes": [
              "22760"
            ]
          }
        ],
        "cities": [
          {
            "code": "CAJ-SAN-AGU",
            "name": "Agua Blanca",
            "postalCodes": [
              "06470",
              "22710"
            ]
          },
          {
            "code": "SAN-EL -SAN",
            "name": "San Jose de Sisa",
            "postalCodes": [
              "22700",
              "22701"
            ]
          },
          {
            "code": "SAN-EL -SAN",
            "name": "San Martin",
            "postalCodes": [
              "22770",
              "22771"
            ]
          },
          {
            "code": "ANC-PAL-SAN",
            "name": "Santa Rosa",
            "postalCodes": [
              "02825",
              "03345",
              "05240",
              "05241",
              "06820",
              "06821",
              "12200",
              "14840",
              "14841",
              "15123",
              "21885",
              "21886",
              "22720",
              "22721"
            ]
          },
          {
            "code": "SAN-EL -SHA",
            "name": "Shatoja",
            "postalCodes": [
              "22760"
            ]
          }
        ]
      },
      {
        "code": "SAN-HUA",
        "name": "Huallaga",
        "districts": [
          {
            "code": "SAN-HUA-ALT",
            "name": "Alto Saposoa",
            "postalCodes": [
              "22670"
            ]
          },
          {
            "code": "SAN-HUA-EL ",
            "name": "El Eslabón",
            "postalCodes": [
              "22640"
            ]
          },
          {
            "code": "SAN-HUA-PIS",
            "name": "Piscoyacu",
            "postalCodes": [
              "22650"
            ]
          },
          {
            "code": "SAN-HUA-SAC",
            "name": "Sacanche",
            "postalCodes": [
              "22630"
            ]
          },
          {
            "code": "SAN-HUA-SAP",
            "name": "Saposoa",
            "postalCodes": [
              "22661",
              "22660"
            ]
          },
          {
            "code": "SAN-HUA-TII",
            "name": "TIingo de Saposoa",
            "postalCodes": [
              "22750"
            ]
          }
        ],
        "cities": [
          {
            "code": "SAN-HUA-EL ",
            "name": "El Eslabon",
            "postalCodes": [
              "22640"
            ]
          },
          {
            "code": "SAN-HUA-PAS",
            "name": "Pasarraya",
            "postalCodes": [
              "22670"
            ]
          },
          {
            "code": "SAN-HUA-PIS",
            "name": "Piscoyacu",
            "postalCodes": [
              "22650"
            ]
          },
          {
            "code": "SAN-HUA-SAC",
            "name": "Sacanche",
            "postalCodes": [
              "22630"
            ]
          },
          {
            "code": "SAN-HUA-SAP",
            "name": "Saposoa",
            "postalCodes": [
              "22660",
              "22661"
            ]
          },
          {
            "code": "SAN-HUA-TIN",
            "name": "Tingo de Saposoa",
            "postalCodes": [
              "22750"
            ]
          }
        ]
      },
      {
        "code": "SAN-LAM",
        "name": "Lamas",
        "districts": [
          {
            "code": "SAN-LAM-ALO",
            "name": "Alonso de Alvarado",
            "postalCodes": [
              "22111",
              "22110"
            ]
          },
          {
            "code": "SAN-LAM-BAR",
            "name": "Barranquita",
            "postalCodes": [
              "22241",
              "22240"
            ]
          },
          {
            "code": "SAN-LAM-CAY",
            "name": "Caynarachi",
            "postalCodes": [
              "22235",
              "22236"
            ]
          },
          {
            "code": "SAN-LAM-CUÑ",
            "name": "Cuñumbuqui",
            "postalCodes": [
              "22180"
            ]
          },
          {
            "code": "SAN-LAM-LAM",
            "name": "Lamas",
            "postalCodes": [
              "22151",
              "22150"
            ]
          },
          {
            "code": "SAN-LAM-PIN",
            "name": "Pinto Recodo",
            "postalCodes": [
              "22140",
              "22141"
            ]
          },
          {
            "code": "SAN-LAM-RUM",
            "name": "Rumisapa",
            "postalCodes": [
              "22170"
            ]
          },
          {
            "code": "SAN-LAM-SAN",
            "name": "San Roque de Cumbaza",
            "postalCodes": [
              "22220"
            ]
          },
          {
            "code": "SAN-LAM-SHA",
            "name": "Shanao",
            "postalCodes": [
              "22130"
            ]
          },
          {
            "code": "SAN-LAM-TAB",
            "name": "Tabalosos",
            "postalCodes": [
              "22121",
              "22120"
            ]
          },
          {
            "code": "SAN-LAM-ZAP",
            "name": "Zapatero",
            "postalCodes": [
              "22190"
            ]
          }
        ],
        "cities": [
          {
            "code": "SAN-LAM-BAR",
            "name": "Barranquita",
            "postalCodes": [
              "22240",
              "22241"
            ]
          },
          {
            "code": "SAN-LAM-CUÑ",
            "name": "Cuñumbuqui",
            "postalCodes": [
              "22180"
            ]
          },
          {
            "code": "SAN-LAM-LAM",
            "name": "Lamas",
            "postalCodes": [
              "22150",
              "22151"
            ]
          },
          {
            "code": "SAN-LAM-PIN",
            "name": "Pinto Recodo",
            "postalCodes": [
              "22140",
              "22141"
            ]
          },
          {
            "code": "SAN-LAM-PON",
            "name": "Pongo de Caynarachi",
            "postalCodes": [
              "22235",
              "22236"
            ]
          },
          {
            "code": "SAN-LAM-ROQ",
            "name": "Roque",
            "postalCodes": [
              "22110",
              "22111"
            ]
          },
          {
            "code": "SAN-LAM-RUM",
            "name": "Rumisapa",
            "postalCodes": [
              "22170"
            ]
          },
          {
            "code": "SAN-LAM-SAN",
            "name": "San Roque de Cumbaza",
            "postalCodes": [
              "22220"
            ]
          },
          {
            "code": "SAN-LAM-SHA",
            "name": "Shanao",
            "postalCodes": [
              "22130"
            ]
          },
          {
            "code": "SAN-LAM-TAB",
            "name": "Tabalosos",
            "postalCodes": [
              "22120",
              "22121"
            ]
          },
          {
            "code": "SAN-LAM-ZAP",
            "name": "Zapatero",
            "postalCodes": [
              "22190"
            ]
          }
        ]
      },
      {
        "code": "SAN-MAR",
        "name": "Mariscal Cáceres",
        "districts": [
          {
            "code": "SAN-MAR-CAN",
            "name": "Canpanilla",
            "postalCodes": [
              "22520",
              "22521"
            ]
          },
          {
            "code": "SAN-MAR-HUI",
            "name": "Huicungo",
            "postalCodes": [
              "22621",
              "22620"
            ]
          },
          {
            "code": "SAN-MAR-JUA",
            "name": "Juanjui",
            "postalCodes": [
              "22601",
              "22600"
            ]
          },
          {
            "code": "SAN-MAR-PAC",
            "name": "Pachiza",
            "postalCodes": [
              "22610"
            ]
          },
          {
            "code": "SAN-MAR-PAJ",
            "name": "Pajarillo",
            "postalCodes": [
              "22500",
              "22501"
            ]
          }
        ],
        "cities": [
          {
            "code": "SAN-MAR-CAM",
            "name": "Campanilla",
            "postalCodes": [
              "22520",
              "22521"
            ]
          },
          {
            "code": "SAN-MAR-HUI",
            "name": "Huicungo",
            "postalCodes": [
              "22620",
              "22621"
            ]
          },
          {
            "code": "SAN-MAR-JUA",
            "name": "Juanjui",
            "postalCodes": [
              "22600",
              "22601"
            ]
          },
          {
            "code": "SAN-MAR-PAC",
            "name": "Pachiza",
            "postalCodes": [
              "22610"
            ]
          },
          {
            "code": "SAN-MAR-PAJ",
            "name": "Pajarillo",
            "postalCodes": [
              "22500",
              "22501"
            ]
          }
        ]
      },
      {
        "code": "SAN-MOY",
        "name": "Moyobamba",
        "districts": [
          {
            "code": "SAN-MOY-CAL",
            "name": "Calzada",
            "postalCodes": [
              "22800"
            ]
          },
          {
            "code": "SAN-MOY-HAB",
            "name": "Habana",
            "postalCodes": [
              "22805"
            ]
          },
          {
            "code": "SAN-MOY-JEP",
            "name": "Jepelacio",
            "postalCodes": [
              "22100",
              "22101"
            ]
          },
          {
            "code": "SAN-MOY-MOY",
            "name": "Moyobamba",
            "postalCodes": [
              "22000",
              "22001"
            ]
          },
          {
            "code": "SAN-MOY-SOR",
            "name": "Soritor",
            "postalCodes": [
              "22811",
              "22810"
            ]
          },
          {
            "code": "SAN-MOY-YAN",
            "name": "Yantalo",
            "postalCodes": [
              "22000",
              "22051"
            ]
          }
        ],
        "cities": [
          {
            "code": "SAN-MOY-CAL",
            "name": "Calzada",
            "postalCodes": [
              "22800"
            ]
          },
          {
            "code": "SAN-MOY-HAB",
            "name": "Habana",
            "postalCodes": [
              "22805"
            ]
          },
          {
            "code": "SAN-MOY-JEP",
            "name": "Jepelacio",
            "postalCodes": [
              "22100",
              "22101"
            ]
          },
          {
            "code": "SAN-MOY-MOY",
            "name": "Moyobamba",
            "postalCodes": [
              "22000",
              "22001"
            ]
          },
          {
            "code": "SAN-MOY-SOR",
            "name": "Soritor",
            "postalCodes": [
              "22810",
              "22811"
            ]
          },
          {
            "code": "SAN-MOY-YAN",
            "name": "Yantalo",
            "postalCodes": [
              "22000",
              "22051"
            ]
          }
        ]
      },
      {
        "code": "SAN-PIC",
        "name": "PIcota",
        "districts": [
          {
            "code": "SAN-PIC-BUE",
            "name": "Buenos Aires",
            "postalCodes": [
              "22410"
            ]
          },
          {
            "code": "SAN-PIC-CAS",
            "name": "Caspisapa",
            "postalCodes": [
              "22440"
            ]
          },
          {
            "code": "SAN-PIC-PIC",
            "name": "Picota",
            "postalCodes": [
              "22431",
              "22430"
            ]
          },
          {
            "code": "SAN-PIC-PIL",
            "name": "Pilluana",
            "postalCodes": [
              "22350"
            ]
          },
          {
            "code": "SAN-PIC-PUC",
            "name": "Pucacaca",
            "postalCodes": [
              "22420"
            ]
          },
          {
            "code": "SAN-PIC-SAN",
            "name": "San Cristobal",
            "postalCodes": [
              "22450"
            ]
          },
          {
            "code": "SAN-PIC-SAN",
            "name": "San Hilarión",
            "postalCodes": [
              "22460"
            ]
          },
          {
            "code": "SAN-PIC-SHA",
            "name": "Shamboyacu",
            "postalCodes": [
              "22370",
              "22371"
            ]
          },
          {
            "code": "SAN-PIC-TIN",
            "name": "Tingo de Ponasa",
            "postalCodes": [
              "22360"
            ]
          },
          {
            "code": "SAN-PIC-TRE",
            "name": "Tres Unidos",
            "postalCodes": [
              "22340"
            ]
          }
        ],
        "cities": [
          {
            "code": "ANC-SAN-BUE",
            "name": "Buenos Aires",
            "postalCodes": [
              "02710",
              "02711",
              "02712",
              "13008",
              "13009",
              "20380",
              "20381",
              "22410"
            ]
          },
          {
            "code": "SAN-PIC-CAS",
            "name": "Caspisapa",
            "postalCodes": [
              "22440"
            ]
          },
          {
            "code": "SAN-PIC-PIC",
            "name": "Picota",
            "postalCodes": [
              "22430",
              "22431"
            ]
          },
          {
            "code": "SAN-PIC-PIL",
            "name": "Pilluana",
            "postalCodes": [
              "22350"
            ]
          },
          {
            "code": "SAN-PIC-PUC",
            "name": "Pucacaca",
            "postalCodes": [
              "22420"
            ]
          },
          {
            "code": "SAN-PIC-PUE",
            "name": "Puerto Rico",
            "postalCodes": [
              "22450"
            ]
          },
          {
            "code": "SAN-PIC-SAN",
            "name": "San Cristobal de Sisa",
            "postalCodes": [
              "22460"
            ]
          },
          {
            "code": "SAN-PIC-SHA",
            "name": "Shamboyacu",
            "postalCodes": [
              "22370",
              "22371"
            ]
          },
          {
            "code": "SAN-PIC-TIN",
            "name": "Tingo de Ponasa",
            "postalCodes": [
              "22360"
            ]
          },
          {
            "code": "SAN-PIC-TRE",
            "name": "Tres Unidos",
            "postalCodes": [
              "22340"
            ]
          }
        ]
      },
      {
        "code": "SAN-RIO",
        "name": "Rioja",
        "districts": [
          {
            "code": "SAN-RIO-AWA",
            "name": "Awajun",
            "postalCodes": [
              "22861",
              "22860"
            ]
          },
          {
            "code": "SAN-RIO-ELI",
            "name": "Elias SoplinVargas",
            "postalCodes": [
              "22841",
              "22840"
            ]
          },
          {
            "code": "SAN-RIO-NUE",
            "name": "Nueva Cajamarca",
            "postalCodes": [
              "22845",
              "22846"
            ]
          },
          {
            "code": "SAN-RIO-PAR",
            "name": "Pardo Miguel",
            "postalCodes": [
              "22865",
              "22866"
            ]
          },
          {
            "code": "SAN-RIO-POS",
            "name": "Posic",
            "postalCodes": [
              "22835"
            ]
          },
          {
            "code": "SAN-RIO-RIO",
            "name": "Rioja",
            "postalCodes": [
              "22825",
              "22826"
            ]
          },
          {
            "code": "SAN-RIO-SAN",
            "name": "San Fernando",
            "postalCodes": [
              "22855"
            ]
          },
          {
            "code": "SAN-RIO-YOR",
            "name": "Yorongos",
            "postalCodes": [
              "22820"
            ]
          },
          {
            "code": "SAN-RIO-YUR",
            "name": "Yuracyacu",
            "postalCodes": [
              "22850"
            ]
          }
        ],
        "cities": [
          {
            "code": "SAN-RIO-BAJ",
            "name": "Bajo Naranjillo",
            "postalCodes": [
              "22860",
              "22861"
            ]
          },
          {
            "code": "SAN-RIO-NAR",
            "name": "Naranjos",
            "postalCodes": [
              "22865",
              "22866"
            ]
          },
          {
            "code": "SAN-RIO-NUE",
            "name": "Nueva Cajamarca",
            "postalCodes": [
              "22845",
              "22846"
            ]
          },
          {
            "code": "SAN-RIO-POS",
            "name": "Posic",
            "postalCodes": [
              "22835"
            ]
          },
          {
            "code": "SAN-RIO-RIO",
            "name": "Rioja",
            "postalCodes": [
              "22825",
              "22826"
            ]
          },
          {
            "code": "SAN-RIO-SAN",
            "name": "San Fernando",
            "postalCodes": [
              "22855",
              "25000",
              "25001",
              "25002"
            ]
          },
          {
            "code": "SAN-RIO-SEG",
            "name": "Segunda Jerusalen- Azunguillo",
            "postalCodes": [
              "22840",
              "22841"
            ]
          },
          {
            "code": "SAN-RIO-YOR",
            "name": "Yorongos",
            "postalCodes": [
              "22820"
            ]
          },
          {
            "code": "SAN-RIO-YUR",
            "name": "Yuracyacu",
            "postalCodes": [
              "22850"
            ]
          }
        ]
      },
      {
        "code": "SAN-SAN",
        "name": "San Martín",
        "districts": [
          {
            "code": "SAN-SAN-ALB",
            "name": "Alberto Leveau",
            "postalCodes": [
              "22320"
            ]
          },
          {
            "code": "SAN-SAN-CAC",
            "name": "Cacatachi",
            "postalCodes": [
              "22160"
            ]
          },
          {
            "code": "SAN-SAN-CHA",
            "name": "Chazuta",
            "postalCodes": [
              "22310",
              "22311"
            ]
          },
          {
            "code": "SAN-SAN-CHI",
            "name": "Chipurana",
            "postalCodes": [
              "22255"
            ]
          },
          {
            "code": "SAN-SAN-EL ",
            "name": "El Porvenir",
            "postalCodes": [
              "22245"
            ]
          },
          {
            "code": "SAN-SAN-HUI",
            "name": "Huimbayoc",
            "postalCodes": [
              "22260"
            ]
          },
          {
            "code": "SAN-SAN-JUA",
            "name": "Juan Guerra",
            "postalCodes": [
              "22400"
            ]
          },
          {
            "code": "SAN-SAN-LA ",
            "name": "La Banda de Shilcayo",
            "postalCodes": [
              "22202",
              "22201",
              "22200"
            ]
          },
          {
            "code": "SAN-SAN-MOR",
            "name": "Morales",
            "postalCodes": [
              "22202",
              "22201",
              "22200"
            ]
          },
          {
            "code": "SAN-SAN-PAP",
            "name": "Papaplaya",
            "postalCodes": [
              "22250"
            ]
          },
          {
            "code": "SAN-SAN-SAN",
            "name": "San Antonio",
            "postalCodes": [
              "22215"
            ]
          },
          {
            "code": "SAN-SAN-SAU",
            "name": "Sauce",
            "postalCodes": [
              "22331",
              "22330"
            ]
          },
          {
            "code": "SAN-SAN-SHA",
            "name": "Shapaja",
            "postalCodes": [
              "22300"
            ]
          },
          {
            "code": "SAN-SAN-TAR",
            "name": "Tarapoto",
            "postalCodes": [
              "22202",
              "22201",
              "22200"
            ]
          }
        ],
        "cities": [
          {
            "code": "SAN-SAN-CAC",
            "name": "Cacatachi",
            "postalCodes": [
              "22160"
            ]
          },
          {
            "code": "SAN-SAN-CHA",
            "name": "Chazuta",
            "postalCodes": [
              "22310",
              "22311"
            ]
          },
          {
            "code": "SAN-SAN-HUI",
            "name": "Huimbayoc",
            "postalCodes": [
              "22260"
            ]
          },
          {
            "code": "SAN-SAN-JUA",
            "name": "Juan Guerra",
            "postalCodes": [
              "22400"
            ]
          },
          {
            "code": "SAN-SAN-LA ",
            "name": "La Banda",
            "postalCodes": [
              "22200",
              "22201",
              "22202"
            ]
          },
          {
            "code": "SAN-SAN-MOR",
            "name": "Morales",
            "postalCodes": [
              "22200",
              "22201",
              "22202"
            ]
          },
          {
            "code": "SAN-SAN-NAV",
            "name": "Navarro",
            "postalCodes": [
              "22255"
            ]
          },
          {
            "code": "SAN-SAN-PAP",
            "name": "Papaplaya",
            "postalCodes": [
              "22250"
            ]
          },
          {
            "code": "SAN-SAN-PEL",
            "name": "Pelejo",
            "postalCodes": [
              "22245"
            ]
          },
          {
            "code": "APU-GRA-SAN",
            "name": "San Antonio",
            "postalCodes": [
              "03330",
              "15600",
              "22215"
            ]
          },
          {
            "code": "SAN-SAN-SAU",
            "name": "Sauce",
            "postalCodes": [
              "22330",
              "22331"
            ]
          },
          {
            "code": "SAN-SAN-SHA",
            "name": "Shapaja",
            "postalCodes": [
              "22300"
            ]
          },
          {
            "code": "SAN-SAN-TAR",
            "name": "Tarapoto",
            "postalCodes": [
              "22200",
              "22201",
              "22202"
            ]
          },
          {
            "code": "SAN-SAN-UTC",
            "name": "Utcurarca",
            "postalCodes": [
              "22320"
            ]
          }
        ]
      },
      {
        "code": "SAN-TOC",
        "name": "Tocache",
        "districts": [
          {
            "code": "SAN-TOC-NUE",
            "name": "Nuevo Progreso",
            "postalCodes": [
              "22550",
              "22551"
            ]
          },
          {
            "code": "SAN-TOC-POL",
            "name": "Polvora",
            "postalCodes": [
              "22530",
              "22531"
            ]
          },
          {
            "code": "SAN-TOC-SHU",
            "name": "Shunte",
            "postalCodes": [
              "22570"
            ]
          },
          {
            "code": "SAN-TOC-TOC",
            "name": "Tocache",
            "postalCodes": [
              "22540",
              "22541"
            ]
          },
          {
            "code": "SAN-TOC-UCH",
            "name": "Uchiza",
            "postalCodes": [
              "22561",
              "22560"
            ]
          }
        ],
        "cities": [
          {
            "code": "SAN-TOC-MON",
            "name": "Monte Cristo",
            "postalCodes": [
              "22570"
            ]
          },
          {
            "code": "SAN-TOC-NUE",
            "name": "Nuevo Progreso",
            "postalCodes": [
              "22550",
              "22551"
            ]
          },
          {
            "code": "SAN-TOC-POL",
            "name": "Polvora",
            "postalCodes": [
              "22530",
              "22531"
            ]
          },
          {
            "code": "SAN-TOC-TOC",
            "name": "Tocache",
            "postalCodes": [
              "22540",
              "22541"
            ]
          },
          {
            "code": "SAN-TOC-UCH",
            "name": "Uchiza",
            "postalCodes": [
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
        "code": "TAC-CAN",
        "name": "Candarave",
        "districts": [
          {
            "code": "TAC-CAN-CAI",
            "name": "Cairani",
            "postalCodes": [
              "23440"
            ]
          },
          {
            "code": "TAC-CAN-CAM",
            "name": "Camilaca",
            "postalCodes": [
              "23850"
            ]
          },
          {
            "code": "TAC-CAN-CAN",
            "name": "Candarave",
            "postalCodes": [
              "23420"
            ]
          },
          {
            "code": "TAC-CAN-CUR",
            "name": "Curibaya",
            "postalCodes": [
              "23480"
            ]
          },
          {
            "code": "TAC-CAN-HUA",
            "name": "Huanaura",
            "postalCodes": [
              "23460"
            ]
          },
          {
            "code": "TAC-CAN-QUI",
            "name": "Quilahuani",
            "postalCodes": [
              "23400"
            ]
          }
        ],
        "cities": [
          {
            "code": "TAC-CAN-CAI",
            "name": "Cairani",
            "postalCodes": [
              "23440"
            ]
          },
          {
            "code": "TAC-CAN-CAM",
            "name": "Camilaca",
            "postalCodes": [
              "23850"
            ]
          },
          {
            "code": "TAC-CAN-CAN",
            "name": "Candarave",
            "postalCodes": [
              "23420"
            ]
          },
          {
            "code": "TAC-CAN-CUR",
            "name": "Curibaya",
            "postalCodes": [
              "23480"
            ]
          },
          {
            "code": "TAC-CAN-HUA",
            "name": "Huanuara",
            "postalCodes": [
              "23460"
            ]
          },
          {
            "code": "TAC-CAN-QUI",
            "name": "Quilahuani",
            "postalCodes": [
              "23400"
            ]
          }
        ]
      },
      {
        "code": "TAC-JOR",
        "name": "Jorge Basadre",
        "districts": [
          {
            "code": "TAC-JOR-ILA",
            "name": "Ilabaya",
            "postalCodes": [
              "23800"
            ]
          },
          {
            "code": "TAC-JOR-ITE",
            "name": "Ite",
            "postalCodes": [
              "23700"
            ]
          },
          {
            "code": "TAC-JOR-LOC",
            "name": "Locumba",
            "postalCodes": [
              "23750"
            ]
          }
        ],
        "cities": [
          {
            "code": "TAC-JOR-ILA",
            "name": "Ilabaya",
            "postalCodes": [
              "23800"
            ]
          },
          {
            "code": "TAC-JOR-ITE",
            "name": "Ite",
            "postalCodes": [
              "23700"
            ]
          },
          {
            "code": "TAC-JOR-LOC",
            "name": "Locumba",
            "postalCodes": [
              "23750"
            ]
          }
        ]
      },
      {
        "code": "TAC-TAC",
        "name": "Tacna",
        "districts": [
          {
            "code": "TAC-TAC-ALT",
            "name": "Alto de la Alianza",
            "postalCodes": [
              "23001",
              "23006",
              "23002",
              "23000"
            ]
          },
          {
            "code": "TAC-TAC-CAL",
            "name": "Calana",
            "postalCodes": [
              "23041",
              "23000"
            ]
          },
          {
            "code": "TAC-TAC-CIU",
            "name": "Ciudad Nueva",
            "postalCodes": [
              "23002",
              "23000"
            ]
          },
          {
            "code": "TAC-TAC-COR",
            "name": "Coronel Gregorio Albarracin Lanchipa",
            "postalCodes": [
              "23003",
              "23006",
              "23000",
              "23004"
            ]
          },
          {
            "code": "TAC-TAC-INC",
            "name": "Inclan",
            "postalCodes": [
              "23600"
            ]
          },
          {
            "code": "TAC-TAC-PAC",
            "name": "Pachia",
            "postalCodes": [
              "23500"
            ]
          },
          {
            "code": "TAC-TAC-PAL",
            "name": "Palca",
            "postalCodes": [
              "23550"
            ]
          },
          {
            "code": "TAC-TAC-POC",
            "name": "Pocollay",
            "postalCodes": [
              "23003",
              "23001",
              "23002",
              "23000"
            ]
          },
          {
            "code": "TAC-TAC-SAM",
            "name": "Sama",
            "postalCodes": [
              "23650"
            ]
          },
          {
            "code": "TAC-TAC-TAC",
            "name": "Tacna",
            "postalCodes": [
              "23003",
              "23001",
              "23006",
              "23000",
              "23004"
            ]
          }
        ],
        "cities": [
          {
            "code": "TAC-TAC-ALF",
            "name": "Alfonso Ugarte",
            "postalCodes": [
              "23000",
              "23003",
              "23004",
              "23006"
            ]
          },
          {
            "code": "TAC-TAC-CAL",
            "name": "Calana",
            "postalCodes": [
              "23000",
              "23041"
            ]
          },
          {
            "code": "TAC-TAC-CIU",
            "name": "Ciudad Nueva",
            "postalCodes": [
              "23000",
              "23002"
            ]
          },
          {
            "code": "CAJ-SAN-LA ",
            "name": "La Esperanza",
            "postalCodes": [
              "06611",
              "13002",
              "13012",
              "13013",
              "13014",
              "23000",
              "23001",
              "23002",
              "23006"
            ]
          },
          {
            "code": "TAC-TAC-LAS",
            "name": "Las Yaras",
            "postalCodes": [
              "23650"
            ]
          },
          {
            "code": "TAC-TAC-PAC",
            "name": "Pachia",
            "postalCodes": [
              "23500"
            ]
          },
          {
            "code": "HUA-HUA-PAL",
            "name": "Palca",
            "postalCodes": [
              "09105",
              "12830",
              "12831",
              "21805",
              "23550"
            ]
          },
          {
            "code": "TAC-TAC-POC",
            "name": "Pocollay",
            "postalCodes": [
              "23000",
              "23001",
              "23002",
              "23003"
            ]
          },
          {
            "code": "TAC-TAC-SAM",
            "name": "Sama Grande",
            "postalCodes": [
              "23600"
            ]
          },
          {
            "code": "TAC-TAC-TAC",
            "name": "Tacna",
            "postalCodes": [
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
        "code": "TAC-TAR",
        "name": "Tarata",
        "districts": [
          {
            "code": "TAC-TAR-EST",
            "name": "Estique",
            "postalCodes": [
              "23120"
            ]
          },
          {
            "code": "TAC-TAR-EST",
            "name": "Estique Pampa",
            "postalCodes": [
              "23100"
            ]
          },
          {
            "code": "TAC-TAR-HER",
            "name": "Heroes Albarracín",
            "postalCodes": [
              "23240"
            ]
          },
          {
            "code": "TAC-TAR-SIT",
            "name": "Sitajara",
            "postalCodes": [
              "23300"
            ]
          },
          {
            "code": "TAC-TAR-SUS",
            "name": "Susapaya",
            "postalCodes": [
              "23350"
            ]
          },
          {
            "code": "TAC-TAR-TAR",
            "name": "Tarata",
            "postalCodes": [
              "23200"
            ]
          },
          {
            "code": "TAC-TAR-TAR",
            "name": "Tarucachi",
            "postalCodes": [
              "23140"
            ]
          },
          {
            "code": "TAC-TAR-TIC",
            "name": "Ticaco",
            "postalCodes": [
              "23220"
            ]
          }
        ],
        "cities": [
          {
            "code": "TAC-TAR-CHU",
            "name": "Chucatamani",
            "postalCodes": [
              "23240"
            ]
          },
          {
            "code": "TAC-TAR-EST",
            "name": "Estique",
            "postalCodes": [
              "23120"
            ]
          },
          {
            "code": "TAC-TAR-EST",
            "name": "Estique Pampa",
            "postalCodes": [
              "23100"
            ]
          },
          {
            "code": "TAC-TAR-SIT",
            "name": "Sitajara",
            "postalCodes": [
              "23300"
            ]
          },
          {
            "code": "TAC-TAR-SUS",
            "name": "Susapaya",
            "postalCodes": [
              "23350"
            ]
          },
          {
            "code": "TAC-TAR-TAR",
            "name": "Tarata",
            "postalCodes": [
              "23200"
            ]
          },
          {
            "code": "TAC-TAR-TAR",
            "name": "Tarucachi",
            "postalCodes": [
              "23140"
            ]
          },
          {
            "code": "TAC-TAR-TIC",
            "name": "Ticaco",
            "postalCodes": [
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
        "code": "TUM-CON",
        "name": "Contralmirante Villar",
        "districts": [
          {
            "code": "TUM-CON-CAN",
            "name": "Canoas de Punta Sal",
            "postalCodes": [
              "24560"
            ]
          },
          {
            "code": "TUM-CON-CAS",
            "name": "Casitas",
            "postalCodes": [
              "24450"
            ]
          },
          {
            "code": "TUM-CON-ZOR",
            "name": "Zorritos",
            "postalCodes": [
              "24541",
              "24540"
            ]
          }
        ],
        "cities": [
          {
            "code": "TUM-CON-CAN",
            "name": "Cancas",
            "postalCodes": [
              "24560"
            ]
          },
          {
            "code": "TUM-CON-CAÑ",
            "name": "Cañaveral",
            "postalCodes": [
              "24450"
            ]
          },
          {
            "code": "TUM-CON-ZOR",
            "name": "Zorritos",
            "postalCodes": [
              "24540",
              "24541"
            ]
          }
        ]
      },
      {
        "code": "TUM-TUM",
        "name": "Tumbes",
        "districts": [
          {
            "code": "TUM-TUM-COR",
            "name": "Corrales",
            "postalCodes": [
              "24501",
              "24500"
            ]
          },
          {
            "code": "TUM-TUM-LA ",
            "name": "La Cruz",
            "postalCodes": [
              "24521",
              "24520"
            ]
          },
          {
            "code": "TUM-TUM-PAM",
            "name": "Pampas de Hospital",
            "postalCodes": [
              "24350",
              "24351"
            ]
          },
          {
            "code": "TUM-TUM-SAN",
            "name": "San Jacinto",
            "postalCodes": [
              "24400",
              "24401"
            ]
          },
          {
            "code": "TUM-TUM-SAN",
            "name": "San Juan de la Virgen",
            "postalCodes": [
              "24300"
            ]
          },
          {
            "code": "TUM-TUM-TUM",
            "name": "Tumbes",
            "postalCodes": [
              "24001",
              "24002",
              "24000"
            ]
          }
        ],
        "cities": [
          {
            "code": "TUM-TUM-CAL",
            "name": "Caleta Cruz",
            "postalCodes": [
              "24520",
              "24521"
            ]
          },
          {
            "code": "TUM-TUM-PAM",
            "name": "Pampas de Hospital",
            "postalCodes": [
              "24350",
              "24351"
            ]
          },
          {
            "code": "PIU-SUL-SAN",
            "name": "San Jacinto",
            "postalCodes": [
              "20760",
              "20761",
              "24400",
              "24401"
            ]
          },
          {
            "code": "TUM-TUM-SAN",
            "name": "San Juan de la Virgen",
            "postalCodes": [
              "24300"
            ]
          },
          {
            "code": "TUM-TUM-SAN",
            "name": "San Pedro de los Incas",
            "postalCodes": [
              "24500",
              "24501"
            ]
          },
          {
            "code": "TUM-TUM-TUM",
            "name": "Tumbes",
            "postalCodes": [
              "24000",
              "24001",
              "24002"
            ]
          }
        ]
      },
      {
        "code": "TUM-ZAR",
        "name": "Zarumilla",
        "districts": [
          {
            "code": "TUM-ZAR-AGU",
            "name": "Aguas Verdes",
            "postalCodes": [
              "24100",
              "24101"
            ]
          },
          {
            "code": "TUM-ZAR-MAT",
            "name": "Matapalo",
            "postalCodes": [
              "24250"
            ]
          },
          {
            "code": "TUM-ZAR-PAP",
            "name": "Papayal",
            "postalCodes": [
              "24200"
            ]
          },
          {
            "code": "TUM-ZAR-ZAR",
            "name": "Zarumilla",
            "postalCodes": [
              "24150",
              "24151"
            ]
          }
        ],
        "cities": [
          {
            "code": "TUM-ZAR-AGU",
            "name": "Aguas Verdes",
            "postalCodes": [
              "24100",
              "24101"
            ]
          },
          {
            "code": "TUM-ZAR-MAT",
            "name": "Matapalo",
            "postalCodes": [
              "24250"
            ]
          },
          {
            "code": "TUM-ZAR-PAP",
            "name": "Papayal",
            "postalCodes": [
              "24200"
            ]
          },
          {
            "code": "TUM-ZAR-ZAR",
            "name": "Zarumilla",
            "postalCodes": [
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
        "code": "UCA-ATA",
        "name": "Atalaya",
        "districts": [
          {
            "code": "UCA-ATA-RAY",
            "name": "Raymondi",
            "postalCodes": [
              "25201",
              "25200"
            ]
          },
          {
            "code": "UCA-ATA-SEP",
            "name": "Sepahua",
            "postalCodes": [
              "25211",
              "25210"
            ]
          },
          {
            "code": "UCA-ATA-TAH",
            "name": "Tahuania",
            "postalCodes": [
              "25220",
              "25221"
            ]
          },
          {
            "code": "UCA-ATA-YUR",
            "name": "Yurua",
            "postalCodes": [
              "25300"
            ]
          }
        ],
        "cities": [
          {
            "code": "UCA-ATA-ATA",
            "name": "Atalaya",
            "postalCodes": [
              "25200",
              "25201"
            ]
          },
          {
            "code": "ANC-PAL-BOL",
            "name": "Bolognesi",
            "postalCodes": [
              "02830",
              "25220",
              "25221"
            ]
          },
          {
            "code": "UCA-ATA-BRE",
            "name": "Breu",
            "postalCodes": [
              "25300"
            ]
          },
          {
            "code": "UCA-ATA-SEP",
            "name": "Sepahua",
            "postalCodes": [
              "25210",
              "25211"
            ]
          }
        ]
      },
      {
        "code": "UCA-COR",
        "name": "Coronel Portillo",
        "districts": [
          {
            "code": "UCA-COR-CAL",
            "name": "Callería",
            "postalCodes": [
              "25000",
              "25003",
              "25006",
              "25002",
              "25001",
              "25004"
            ]
          },
          {
            "code": "UCA-COR-CAM",
            "name": "Campoverde",
            "postalCodes": [
              "25500",
              "25501"
            ]
          },
          {
            "code": "UCA-COR-IPA",
            "name": "Iparía",
            "postalCodes": [
              "25231",
              "25230"
            ]
          },
          {
            "code": "UCA-COR-MAN",
            "name": "Manantay",
            "postalCodes": [
              "25001",
              "25002",
              "25000"
            ]
          },
          {
            "code": "UCA-COR-MAS",
            "name": "Masisea",
            "postalCodes": [
              "25101",
              "25100"
            ]
          },
          {
            "code": "UCA-COR-NUE",
            "name": "Nueva Requena",
            "postalCodes": [
              "25700",
              "25701"
            ]
          },
          {
            "code": "UCA-COR-YAR",
            "name": "Yarinacocha",
            "postalCodes": [
              "25003",
              "25004",
              "25000",
              "25006"
            ]
          }
        ],
        "cities": [
          {
            "code": "UCA-COR-CAM",
            "name": "Campo Verde",
            "postalCodes": [
              "25500",
              "25501"
            ]
          },
          {
            "code": "UCA-COR-IPA",
            "name": "Iparia",
            "postalCodes": [
              "25230",
              "25231"
            ]
          },
          {
            "code": "UCA-COR-MAS",
            "name": "Masisea",
            "postalCodes": [
              "25100",
              "25101"
            ]
          },
          {
            "code": "UCA-COR-NUE",
            "name": "Nueva Requena",
            "postalCodes": [
              "25700",
              "25701"
            ]
          },
          {
            "code": "UCA-COR-PUC",
            "name": "Pucallpa",
            "postalCodes": [
              "25000",
              "25001",
              "25002",
              "25003",
              "25004",
              "25006"
            ]
          },
          {
            "code": "UCA-COR-PUE",
            "name": "Puerto Callao",
            "postalCodes": [
              "25000",
              "25003",
              "25004",
              "25006"
            ]
          },
          {
            "code": "SAN-RIO-SAN",
            "name": "San Fernando",
            "postalCodes": [
              "22855",
              "25000",
              "25001",
              "25002"
            ]
          }
        ]
      },
      {
        "code": "UCA-PAD",
        "name": "Padre Abad",
        "districts": [
          {
            "code": "UCA-PAD-CUR",
            "name": "Curimana",
            "postalCodes": [
              "25600",
              "25601"
            ]
          },
          {
            "code": "UCA-PAD-IRA",
            "name": "Irazola",
            "postalCodes": [
              "25530",
              "25531"
            ]
          },
          {
            "code": "UCA-PAD-PAD",
            "name": "Padre Abad",
            "postalCodes": [
              "25551",
              "25550"
            ]
          }
        ],
        "cities": [
          {
            "code": "UCA-PAD-AGU",
            "name": "Aguaytia",
            "postalCodes": [
              "25550",
              "25551"
            ]
          },
          {
            "code": "UCA-PAD-CUR",
            "name": "Curimana",
            "postalCodes": [
              "25600",
              "25601"
            ]
          },
          {
            "code": "UCA-PAD-SAN",
            "name": "San Alejandro",
            "postalCodes": [
              "25530",
              "25531"
            ]
          }
        ]
      },
      {
        "code": "UCA-PUR",
        "name": "Purus",
        "districts": [
          {
            "code": "UCA-PUR-PUR",
            "name": "Purús",
            "postalCodes": [
              "25400"
            ]
          }
        ],
        "cities": [
          {
            "code": "UCA-PUR-ESP",
            "name": "Esperanza",
            "postalCodes": [
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
  return PERU_GEOGRAPHIC_DATA;
}

/**
 * GET PROVINCES BY DEPARTMENT
 * ---------------------------
 * Returns provinces for a specific department
 */
export function getProvincesByDepartment(departmentCode: string): Province[] {
  const department = PERU_GEOGRAPHIC_DATA.find(d => d.code === departmentCode);
  return department ? department.provinces : [];
}

/**
 * GET DISTRICTS BY PROVINCE
 * -------------------------
 * Returns districts for a specific department and province
 */
export function getDistrictsByProvince(departmentCode: string, provinceCode: string): District[] {
  const department = PERU_GEOGRAPHIC_DATA.find(d => d.code === departmentCode);
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
  const department = PERU_GEOGRAPHIC_DATA.find(d => d.code === departmentCode);
  if (!department) return [];

  const province = department.provinces.find(p => p.code === provinceCode);
  return province ? province.cities : [];
}

/**
 * GET POSTAL CODES FOR DISTRICT
 * -----------------------------
 * Returns all postal codes available for a specific district
 */
export function getPostalCodesForDistrict(departmentCode: string, provinceCode: string, districtCode: string): string[] {
  const districts = getDistrictsByProvince(departmentCode, provinceCode);
  const district = districts.find(d => d.code === districtCode);
  return district ? district.postalCodes : [];
}

/**
 * GET POSTAL CODES FOR CITY
 * -------------------------
 * Returns all postal codes available for a specific city
 */
export function getPostalCodesForCity(departmentCode: string, provinceCode: string, cityCode: string): string[] {
  const cities = getCitiesByProvince(departmentCode, provinceCode);
  const city = cities.find(c => c.code === cityCode);
  return city ? city.postalCodes : [];
}

/**
 * SEARCH GEOGRAPHIC LOCATIONS
 * ---------------------------
 * Searches for departments, provinces, and districts by name
 */
export function searchGeographicLocations(query: string): Array<{department: Department, province?: Province, district?: District, city?: City}> {
  const results: Array<{department: Department, province?: Province, district?: District, city?: City}> = [];
  const searchTerm = query.toLowerCase();

  for (const department of PERU_GEOGRAPHIC_DATA) {
    // Search districts
    for (const province of department.provinces) {
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

      // Search provinces
      if (
        department.name.toLowerCase().includes(searchTerm) ||
        province.name.toLowerCase().includes(searchTerm)
      ) {
        results.push({ department, province });
      }
    }

    // Search departments
    if (department.name.toLowerCase().includes(searchTerm)) {
      results.push({ department });
    }
  }

  return results;
}

/**
 * VALIDATE LOCATION SELECTION
 * ---------------------------
 * Validates if a department-province-district combination is valid
 */
export function validateLocationSelection(departmentCode: string, provinceCode: string, districtCode: string): boolean {
  const districts = getDistrictsByProvince(departmentCode, provinceCode);
  return districts.some(d => d.code === districtCode);
}
