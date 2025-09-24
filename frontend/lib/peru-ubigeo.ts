/**
 * ========================================================================================
 * PERU UBIGEO ADMINISTRATIVE DIVISIONS
 * ========================================================================================
 *
 * SOURCE: Complete INEI UBIGEO data from geodir-ubigeo-inei
 * GENERATED: 2025-09-24 09:45:26
 *
 * This file contains the official administrative divisions of Peru using UBIGEO codes.
 * Used for organizing addresses in the checkout page, while postal codes remain manual.
 *
 * UBIGEO Structure: XXYYZZ (6 digits)
 * - XX: Department code (2 digits)
 * - YY: Province code within department (2 digits)
 * - ZZ: District code within province (2 digits)
 *
 * Statistics:
 * - Departments: 24
 * - Provinces: 195
 * - Districts: 1874
 *
 * NOTE: Postal codes are handled separately as manual input fields.
 */

export interface District {
  code: string;
  name: string;
  ubigeo: string;
}

export interface Province {
  code: string;
  name: string;
  districts: District[];
}

export interface Department {
  code: string;
  name: string;
  provinces: Province[];
}

export const PERU_UBIGEO: Department[] = [
  {
    "code": "AMA",
    "name": "Amazonas",
    "provinces": [
      {
        "code": "AMA-02",
        "name": "Bagua",
        "districts": [
          {
            "code": "AMA-02-02",
            "name": "Aramango",
            "ubigeo": "010202"
          },
          {
            "code": "AMA-02-01",
            "name": "Bagua",
            "ubigeo": "010201"
          },
          {
            "code": "AMA-02-03",
            "name": "Copallin",
            "ubigeo": "010203"
          },
          {
            "code": "AMA-02-04",
            "name": "El Parco",
            "ubigeo": "010204"
          },
          {
            "code": "AMA-02-05",
            "name": "Imaza",
            "ubigeo": "010205"
          },
          {
            "code": "AMA-02-06",
            "name": "La Peca",
            "ubigeo": "010206"
          }
        ]
      },
      {
        "code": "AMA-03",
        "name": "Bongara",
        "districts": [
          {
            "code": "AMA-03-02",
            "name": "Chisquilla",
            "ubigeo": "010302"
          },
          {
            "code": "AMA-03-03",
            "name": "Churuja",
            "ubigeo": "010303"
          },
          {
            "code": "AMA-03-04",
            "name": "Corosha",
            "ubigeo": "010304"
          },
          {
            "code": "AMA-03-05",
            "name": "Cuispes",
            "ubigeo": "010305"
          },
          {
            "code": "AMA-03-06",
            "name": "Florida",
            "ubigeo": "010306"
          },
          {
            "code": "AMA-03-07",
            "name": "Jazan",
            "ubigeo": "010307"
          },
          {
            "code": "AMA-03-01",
            "name": "Jumbilla",
            "ubigeo": "010301"
          },
          {
            "code": "AMA-03-08",
            "name": "Recta",
            "ubigeo": "010308"
          },
          {
            "code": "AMA-03-09",
            "name": "San Carlos",
            "ubigeo": "010309"
          },
          {
            "code": "AMA-03-10",
            "name": "Shipasbamba",
            "ubigeo": "010310"
          },
          {
            "code": "AMA-03-11",
            "name": "Valera",
            "ubigeo": "010311"
          },
          {
            "code": "AMA-03-12",
            "name": "Yambrasbamba",
            "ubigeo": "010312"
          }
        ]
      },
      {
        "code": "AMA-01",
        "name": "Chachapoyas",
        "districts": [
          {
            "code": "AMA-01-02",
            "name": "Asuncion",
            "ubigeo": "010102"
          },
          {
            "code": "AMA-01-03",
            "name": "Balsas",
            "ubigeo": "010103"
          },
          {
            "code": "AMA-01-01",
            "name": "Chachapoyas",
            "ubigeo": "010101"
          },
          {
            "code": "AMA-01-04",
            "name": "Cheto",
            "ubigeo": "010104"
          },
          {
            "code": "AMA-01-05",
            "name": "Chiliquin",
            "ubigeo": "010105"
          },
          {
            "code": "AMA-01-06",
            "name": "Chuquibamba",
            "ubigeo": "010106"
          },
          {
            "code": "AMA-01-07",
            "name": "Granada",
            "ubigeo": "010107"
          },
          {
            "code": "AMA-01-08",
            "name": "Huancas",
            "ubigeo": "010108"
          },
          {
            "code": "AMA-01-09",
            "name": "La Jalca",
            "ubigeo": "010109"
          },
          {
            "code": "AMA-01-10",
            "name": "Leimebamba",
            "ubigeo": "010110"
          },
          {
            "code": "AMA-01-11",
            "name": "Levanto",
            "ubigeo": "010111"
          },
          {
            "code": "AMA-01-12",
            "name": "Magdalena",
            "ubigeo": "010112"
          },
          {
            "code": "AMA-01-13",
            "name": "Mariscal Castilla",
            "ubigeo": "010113"
          },
          {
            "code": "AMA-01-14",
            "name": "Molinopampa",
            "ubigeo": "010114"
          },
          {
            "code": "AMA-01-15",
            "name": "Montevideo",
            "ubigeo": "010115"
          },
          {
            "code": "AMA-01-16",
            "name": "Olleros",
            "ubigeo": "010116"
          },
          {
            "code": "AMA-01-17",
            "name": "Quinjalca",
            "ubigeo": "010117"
          },
          {
            "code": "AMA-01-18",
            "name": "San Francisco de Daguas",
            "ubigeo": "010118"
          },
          {
            "code": "AMA-01-19",
            "name": "San Isidro de Maino",
            "ubigeo": "010119"
          },
          {
            "code": "AMA-01-20",
            "name": "Soloco",
            "ubigeo": "010120"
          },
          {
            "code": "AMA-01-21",
            "name": "Sonche",
            "ubigeo": "010121"
          }
        ]
      },
      {
        "code": "AMA-04",
        "name": "Condorcanqui",
        "districts": [
          {
            "code": "AMA-04-02",
            "name": "El Cenepa",
            "ubigeo": "010402"
          },
          {
            "code": "AMA-04-01",
            "name": "Nieva",
            "ubigeo": "010401"
          },
          {
            "code": "AMA-04-03",
            "name": "Rio Santiago",
            "ubigeo": "010403"
          }
        ]
      },
      {
        "code": "AMA-05",
        "name": "Luya",
        "districts": [
          {
            "code": "AMA-05-02",
            "name": "Camporredondo",
            "ubigeo": "010502"
          },
          {
            "code": "AMA-05-03",
            "name": "Cocabamba",
            "ubigeo": "010503"
          },
          {
            "code": "AMA-05-04",
            "name": "Colcamar",
            "ubigeo": "010504"
          },
          {
            "code": "AMA-05-05",
            "name": "Conila",
            "ubigeo": "010505"
          },
          {
            "code": "AMA-05-06",
            "name": "Inguilpata",
            "ubigeo": "010506"
          },
          {
            "code": "AMA-05-01",
            "name": "Lamud",
            "ubigeo": "010501"
          },
          {
            "code": "AMA-05-07",
            "name": "Longuita",
            "ubigeo": "010507"
          },
          {
            "code": "AMA-05-08",
            "name": "Lonya Chico",
            "ubigeo": "010508"
          },
          {
            "code": "AMA-05-09",
            "name": "Luya",
            "ubigeo": "010509"
          },
          {
            "code": "AMA-05-10",
            "name": "Luya Viejo",
            "ubigeo": "010510"
          },
          {
            "code": "AMA-05-11",
            "name": "Maria",
            "ubigeo": "010511"
          },
          {
            "code": "AMA-05-12",
            "name": "Ocalli",
            "ubigeo": "010512"
          },
          {
            "code": "AMA-05-13",
            "name": "Ocumal",
            "ubigeo": "010513"
          },
          {
            "code": "AMA-05-14",
            "name": "Pisuquia",
            "ubigeo": "010514"
          },
          {
            "code": "AMA-05-15",
            "name": "Providencia",
            "ubigeo": "010515"
          },
          {
            "code": "AMA-05-16",
            "name": "San Cristobal",
            "ubigeo": "010516"
          },
          {
            "code": "AMA-05-17",
            "name": "San Francisco del Yeso",
            "ubigeo": "010517"
          },
          {
            "code": "AMA-05-18",
            "name": "San Jeronimo",
            "ubigeo": "010518"
          },
          {
            "code": "AMA-05-19",
            "name": "San Juan de Lopecancha",
            "ubigeo": "010519"
          },
          {
            "code": "AMA-05-20",
            "name": "Santa Catalina",
            "ubigeo": "010520"
          },
          {
            "code": "AMA-05-21",
            "name": "Santo Tomas",
            "ubigeo": "010521"
          },
          {
            "code": "AMA-05-22",
            "name": "Tingo",
            "ubigeo": "010522"
          },
          {
            "code": "AMA-05-23",
            "name": "Trita",
            "ubigeo": "010523"
          }
        ]
      },
      {
        "code": "AMA-06",
        "name": "Rodriguez de Mendoza",
        "districts": [
          {
            "code": "AMA-06-02",
            "name": "Chirimoto",
            "ubigeo": "010602"
          },
          {
            "code": "AMA-06-03",
            "name": "Cochamal",
            "ubigeo": "010603"
          },
          {
            "code": "AMA-06-04",
            "name": "Huambo",
            "ubigeo": "010604"
          },
          {
            "code": "AMA-06-05",
            "name": "Limabamba",
            "ubigeo": "010605"
          },
          {
            "code": "AMA-06-06",
            "name": "Longar",
            "ubigeo": "010606"
          },
          {
            "code": "AMA-06-07",
            "name": "Mariscal Benavides",
            "ubigeo": "010607"
          },
          {
            "code": "AMA-06-08",
            "name": "Milpuc",
            "ubigeo": "010608"
          },
          {
            "code": "AMA-06-09",
            "name": "Omia",
            "ubigeo": "010609"
          },
          {
            "code": "AMA-06-01",
            "name": "San Nicolas",
            "ubigeo": "010601"
          },
          {
            "code": "AMA-06-10",
            "name": "Santa Rosa",
            "ubigeo": "010610"
          },
          {
            "code": "AMA-06-11",
            "name": "Totora",
            "ubigeo": "010611"
          },
          {
            "code": "AMA-06-12",
            "name": "Vista Alegre",
            "ubigeo": "010612"
          }
        ]
      },
      {
        "code": "AMA-07",
        "name": "Utcubamba",
        "districts": [
          {
            "code": "AMA-07-01",
            "name": "Bagua Grande",
            "ubigeo": "010701"
          },
          {
            "code": "AMA-07-02",
            "name": "Cajaruro",
            "ubigeo": "010702"
          },
          {
            "code": "AMA-07-03",
            "name": "Cumba",
            "ubigeo": "010703"
          },
          {
            "code": "AMA-07-04",
            "name": "El Milagro",
            "ubigeo": "010704"
          },
          {
            "code": "AMA-07-05",
            "name": "Jamalca",
            "ubigeo": "010705"
          },
          {
            "code": "AMA-07-06",
            "name": "Lonya Grande",
            "ubigeo": "010706"
          },
          {
            "code": "AMA-07-07",
            "name": "Yamon",
            "ubigeo": "010707"
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
        "code": "ANC-02",
        "name": "Aija",
        "districts": [
          {
            "code": "ANC-02-01",
            "name": "Aija",
            "ubigeo": "020201"
          },
          {
            "code": "ANC-02-02",
            "name": "Coris",
            "ubigeo": "020202"
          },
          {
            "code": "ANC-02-03",
            "name": "Huacllan",
            "ubigeo": "020203"
          },
          {
            "code": "ANC-02-04",
            "name": "La Merced",
            "ubigeo": "020204"
          },
          {
            "code": "ANC-02-05",
            "name": "Succha",
            "ubigeo": "020205"
          }
        ]
      },
      {
        "code": "ANC-03",
        "name": "Antonio Raymondi",
        "districts": [
          {
            "code": "ANC-03-02",
            "name": "Aczo",
            "ubigeo": "020302"
          },
          {
            "code": "ANC-03-03",
            "name": "Chaccho",
            "ubigeo": "020303"
          },
          {
            "code": "ANC-03-04",
            "name": "Chingas",
            "ubigeo": "020304"
          },
          {
            "code": "ANC-03-01",
            "name": "Llamellin",
            "ubigeo": "020301"
          },
          {
            "code": "ANC-03-05",
            "name": "Mirgas",
            "ubigeo": "020305"
          },
          {
            "code": "ANC-03-06",
            "name": "San Juan de Rontoy",
            "ubigeo": "020306"
          }
        ]
      },
      {
        "code": "ANC-04",
        "name": "Asuncion",
        "districts": [
          {
            "code": "ANC-04-02",
            "name": "Acochaca",
            "ubigeo": "020402"
          },
          {
            "code": "ANC-04-01",
            "name": "Chacas",
            "ubigeo": "020401"
          }
        ]
      },
      {
        "code": "ANC-05",
        "name": "Bolognesi",
        "districts": [
          {
            "code": "ANC-05-02",
            "name": "Abelardo Pardo Lezameta",
            "ubigeo": "020502"
          },
          {
            "code": "ANC-05-03",
            "name": "Antonio Raymondi",
            "ubigeo": "020503"
          },
          {
            "code": "ANC-05-04",
            "name": "Aquia",
            "ubigeo": "020504"
          },
          {
            "code": "ANC-05-05",
            "name": "Cajacay",
            "ubigeo": "020505"
          },
          {
            "code": "ANC-05-06",
            "name": "Canis",
            "ubigeo": "020506"
          },
          {
            "code": "ANC-05-01",
            "name": "Chiquian",
            "ubigeo": "020501"
          },
          {
            "code": "ANC-05-07",
            "name": "Colquioc",
            "ubigeo": "020507"
          },
          {
            "code": "ANC-05-08",
            "name": "Huallanca",
            "ubigeo": "020508"
          },
          {
            "code": "ANC-05-09",
            "name": "Huasta",
            "ubigeo": "020509"
          },
          {
            "code": "ANC-05-10",
            "name": "Huayllacayan",
            "ubigeo": "020510"
          },
          {
            "code": "ANC-05-11",
            "name": "La Primavera",
            "ubigeo": "020511"
          },
          {
            "code": "ANC-05-12",
            "name": "Mangas",
            "ubigeo": "020512"
          },
          {
            "code": "ANC-05-13",
            "name": "Pacllon",
            "ubigeo": "020513"
          },
          {
            "code": "ANC-05-14",
            "name": "San Miguel de Corpanqui",
            "ubigeo": "020514"
          },
          {
            "code": "ANC-05-15",
            "name": "Ticllos",
            "ubigeo": "020515"
          }
        ]
      },
      {
        "code": "ANC-06",
        "name": "Carhuaz",
        "districts": [
          {
            "code": "ANC-06-02",
            "name": "Acopampa",
            "ubigeo": "020602"
          },
          {
            "code": "ANC-06-03",
            "name": "Amashca",
            "ubigeo": "020603"
          },
          {
            "code": "ANC-06-04",
            "name": "Anta",
            "ubigeo": "020604"
          },
          {
            "code": "ANC-06-05",
            "name": "Ataquero",
            "ubigeo": "020605"
          },
          {
            "code": "ANC-06-01",
            "name": "Carhuaz",
            "ubigeo": "020601"
          },
          {
            "code": "ANC-06-06",
            "name": "Marcara",
            "ubigeo": "020606"
          },
          {
            "code": "ANC-06-07",
            "name": "Pariahuanca",
            "ubigeo": "020607"
          },
          {
            "code": "ANC-06-08",
            "name": "San Miguel de Aco",
            "ubigeo": "020608"
          },
          {
            "code": "ANC-06-09",
            "name": "Shilla",
            "ubigeo": "020609"
          },
          {
            "code": "ANC-06-10",
            "name": "Tinco",
            "ubigeo": "020610"
          },
          {
            "code": "ANC-06-11",
            "name": "Yungar",
            "ubigeo": "020611"
          }
        ]
      },
      {
        "code": "ANC-07",
        "name": "Carlos Fermin Fitzca",
        "districts": [
          {
            "code": "ANC-07-01",
            "name": "San Luis",
            "ubigeo": "020701"
          },
          {
            "code": "ANC-07-02",
            "name": "San Nicolas",
            "ubigeo": "020702"
          },
          {
            "code": "ANC-07-03",
            "name": "Yauya",
            "ubigeo": "020703"
          }
        ]
      },
      {
        "code": "ANC-08",
        "name": "Casma",
        "districts": [
          {
            "code": "ANC-08-02",
            "name": "Buena Vista Alta",
            "ubigeo": "020802"
          },
          {
            "code": "ANC-08-01",
            "name": "Casma",
            "ubigeo": "020801"
          },
          {
            "code": "ANC-08-03",
            "name": "Comandante Noel",
            "ubigeo": "020803"
          },
          {
            "code": "ANC-08-04",
            "name": "Yautan",
            "ubigeo": "020804"
          }
        ]
      },
      {
        "code": "ANC-09",
        "name": "Corongo",
        "districts": [
          {
            "code": "ANC-09-02",
            "name": "Aco",
            "ubigeo": "020902"
          },
          {
            "code": "ANC-09-03",
            "name": "Bambas",
            "ubigeo": "020903"
          },
          {
            "code": "ANC-09-01",
            "name": "Corongo",
            "ubigeo": "020901"
          },
          {
            "code": "ANC-09-04",
            "name": "Cusca",
            "ubigeo": "020904"
          },
          {
            "code": "ANC-09-05",
            "name": "La Pampa",
            "ubigeo": "020905"
          },
          {
            "code": "ANC-09-06",
            "name": "Yanac",
            "ubigeo": "020906"
          },
          {
            "code": "ANC-09-07",
            "name": "Yupan",
            "ubigeo": "020907"
          }
        ]
      },
      {
        "code": "ANC-01",
        "name": "Huaraz",
        "districts": [
          {
            "code": "ANC-01-02",
            "name": "Cochabamba",
            "ubigeo": "020102"
          },
          {
            "code": "ANC-01-03",
            "name": "Colcabamba",
            "ubigeo": "020103"
          },
          {
            "code": "ANC-01-04",
            "name": "Huanchay",
            "ubigeo": "020104"
          },
          {
            "code": "ANC-01-01",
            "name": "Huaraz",
            "ubigeo": "020101"
          },
          {
            "code": "ANC-01-05",
            "name": "Independencia",
            "ubigeo": "020105"
          },
          {
            "code": "ANC-01-06",
            "name": "Jangas",
            "ubigeo": "020106"
          },
          {
            "code": "ANC-01-07",
            "name": "La Libertad",
            "ubigeo": "020107"
          },
          {
            "code": "ANC-01-08",
            "name": "Olleros",
            "ubigeo": "020108"
          },
          {
            "code": "ANC-01-09",
            "name": "Pampas",
            "ubigeo": "020109"
          },
          {
            "code": "ANC-01-10",
            "name": "Pariacoto",
            "ubigeo": "020110"
          },
          {
            "code": "ANC-01-11",
            "name": "Pira",
            "ubigeo": "020111"
          },
          {
            "code": "ANC-01-12",
            "name": "Tarica",
            "ubigeo": "020112"
          }
        ]
      },
      {
        "code": "ANC-10",
        "name": "Huari",
        "districts": [
          {
            "code": "ANC-10-02",
            "name": "Anra",
            "ubigeo": "021002"
          },
          {
            "code": "ANC-10-03",
            "name": "Cajay",
            "ubigeo": "021003"
          },
          {
            "code": "ANC-10-04",
            "name": "Chavin de Huantar",
            "ubigeo": "021004"
          },
          {
            "code": "ANC-10-05",
            "name": "Huacachi",
            "ubigeo": "021005"
          },
          {
            "code": "ANC-10-06",
            "name": "Huacchis",
            "ubigeo": "021006"
          },
          {
            "code": "ANC-10-07",
            "name": "Huachis",
            "ubigeo": "021007"
          },
          {
            "code": "ANC-10-08",
            "name": "Huantar",
            "ubigeo": "021008"
          },
          {
            "code": "ANC-10-01",
            "name": "Huari",
            "ubigeo": "021001"
          },
          {
            "code": "ANC-10-09",
            "name": "Masin",
            "ubigeo": "021009"
          },
          {
            "code": "ANC-10-10",
            "name": "Paucas",
            "ubigeo": "021010"
          },
          {
            "code": "ANC-10-11",
            "name": "Ponto",
            "ubigeo": "021011"
          },
          {
            "code": "ANC-10-12",
            "name": "Rahuapampa",
            "ubigeo": "021012"
          },
          {
            "code": "ANC-10-13",
            "name": "Rapayan",
            "ubigeo": "021013"
          },
          {
            "code": "ANC-10-14",
            "name": "San Marcos",
            "ubigeo": "021014"
          },
          {
            "code": "ANC-10-15",
            "name": "San Pedro de Chana",
            "ubigeo": "021015"
          },
          {
            "code": "ANC-10-16",
            "name": "Uco",
            "ubigeo": "021016"
          }
        ]
      },
      {
        "code": "ANC-11",
        "name": "Huarmey",
        "districts": [
          {
            "code": "ANC-11-02",
            "name": "Cochapeti",
            "ubigeo": "021102"
          },
          {
            "code": "ANC-11-03",
            "name": "Culebras",
            "ubigeo": "021103"
          },
          {
            "code": "ANC-11-01",
            "name": "Huarmey",
            "ubigeo": "021101"
          },
          {
            "code": "ANC-11-04",
            "name": "Huayan",
            "ubigeo": "021104"
          },
          {
            "code": "ANC-11-05",
            "name": "Malvas",
            "ubigeo": "021105"
          }
        ]
      },
      {
        "code": "ANC-12",
        "name": "Huaylas",
        "districts": [
          {
            "code": "ANC-12-01",
            "name": "Caraz",
            "ubigeo": "021201"
          },
          {
            "code": "ANC-12-02",
            "name": "Huallanca",
            "ubigeo": "021202"
          },
          {
            "code": "ANC-12-03",
            "name": "Huata",
            "ubigeo": "021203"
          },
          {
            "code": "ANC-12-04",
            "name": "Huaylas",
            "ubigeo": "021204"
          },
          {
            "code": "ANC-12-05",
            "name": "Mato",
            "ubigeo": "021205"
          },
          {
            "code": "ANC-12-06",
            "name": "Pamparomas",
            "ubigeo": "021206"
          },
          {
            "code": "ANC-12-07",
            "name": "Pueblo Libre",
            "ubigeo": "021207"
          },
          {
            "code": "ANC-12-08",
            "name": "Santa Cruz",
            "ubigeo": "021208"
          },
          {
            "code": "ANC-12-09",
            "name": "Santo Toribio",
            "ubigeo": "021209"
          },
          {
            "code": "ANC-12-10",
            "name": "Yuracmarca",
            "ubigeo": "021210"
          }
        ]
      },
      {
        "code": "ANC-13",
        "name": "Mariscal Luzuriaga",
        "districts": [
          {
            "code": "ANC-13-02",
            "name": "Casca",
            "ubigeo": "021302"
          },
          {
            "code": "ANC-13-03",
            "name": "Eleazar Guzman Barron",
            "ubigeo": "021303"
          },
          {
            "code": "ANC-13-04",
            "name": "Fidel Olivas Escudero",
            "ubigeo": "021304"
          },
          {
            "code": "ANC-13-05",
            "name": "Llama",
            "ubigeo": "021305"
          },
          {
            "code": "ANC-13-06",
            "name": "Llumpa",
            "ubigeo": "021306"
          },
          {
            "code": "ANC-13-07",
            "name": "Lucma",
            "ubigeo": "021307"
          },
          {
            "code": "ANC-13-08",
            "name": "Musga",
            "ubigeo": "021308"
          },
          {
            "code": "ANC-13-01",
            "name": "Piscobamba",
            "ubigeo": "021301"
          }
        ]
      },
      {
        "code": "ANC-14",
        "name": "Ocros",
        "districts": [
          {
            "code": "ANC-14-02",
            "name": "Acas",
            "ubigeo": "021402"
          },
          {
            "code": "ANC-14-03",
            "name": "Cajamarquilla",
            "ubigeo": "021403"
          },
          {
            "code": "ANC-14-04",
            "name": "Carhuapampa",
            "ubigeo": "021404"
          },
          {
            "code": "ANC-14-05",
            "name": "Cochas",
            "ubigeo": "021405"
          },
          {
            "code": "ANC-14-06",
            "name": "Congas",
            "ubigeo": "021406"
          },
          {
            "code": "ANC-14-07",
            "name": "Llipa",
            "ubigeo": "021407"
          },
          {
            "code": "ANC-14-01",
            "name": "Ocros",
            "ubigeo": "021401"
          },
          {
            "code": "ANC-14-08",
            "name": "San Cristobal de Rajan",
            "ubigeo": "021408"
          },
          {
            "code": "ANC-14-09",
            "name": "San Pedro",
            "ubigeo": "021409"
          },
          {
            "code": "ANC-14-10",
            "name": "Santiago de Chilcas",
            "ubigeo": "021410"
          }
        ]
      },
      {
        "code": "ANC-15",
        "name": "Pallasca",
        "districts": [
          {
            "code": "ANC-15-02",
            "name": "Bolognesi",
            "ubigeo": "021502"
          },
          {
            "code": "ANC-15-01",
            "name": "Cabana",
            "ubigeo": "021501"
          },
          {
            "code": "ANC-15-03",
            "name": "Conchucos",
            "ubigeo": "021503"
          },
          {
            "code": "ANC-15-04",
            "name": "Huacaschuque",
            "ubigeo": "021504"
          },
          {
            "code": "ANC-15-05",
            "name": "Huandoval",
            "ubigeo": "021505"
          },
          {
            "code": "ANC-15-06",
            "name": "Lacabamba",
            "ubigeo": "021506"
          },
          {
            "code": "ANC-15-07",
            "name": "Llapo",
            "ubigeo": "021507"
          },
          {
            "code": "ANC-15-08",
            "name": "Pallasca",
            "ubigeo": "021508"
          },
          {
            "code": "ANC-15-09",
            "name": "Pampas",
            "ubigeo": "021509"
          },
          {
            "code": "ANC-15-10",
            "name": "Santa Rosa",
            "ubigeo": "021510"
          },
          {
            "code": "ANC-15-11",
            "name": "Tauca",
            "ubigeo": "021511"
          }
        ]
      },
      {
        "code": "ANC-16",
        "name": "Pomabamba",
        "districts": [
          {
            "code": "ANC-16-02",
            "name": "Huayllan",
            "ubigeo": "021602"
          },
          {
            "code": "ANC-16-03",
            "name": "Parobamba",
            "ubigeo": "021603"
          },
          {
            "code": "ANC-16-01",
            "name": "Pomabamba",
            "ubigeo": "021601"
          },
          {
            "code": "ANC-16-04",
            "name": "Quinuabamba",
            "ubigeo": "021604"
          }
        ]
      },
      {
        "code": "ANC-17",
        "name": "Recuay",
        "districts": [
          {
            "code": "ANC-17-02",
            "name": "Catac",
            "ubigeo": "021702"
          },
          {
            "code": "ANC-17-03",
            "name": "Cotaparaco",
            "ubigeo": "021703"
          },
          {
            "code": "ANC-17-04",
            "name": "Huayllapampa",
            "ubigeo": "021704"
          },
          {
            "code": "ANC-17-05",
            "name": "Llacllin",
            "ubigeo": "021705"
          },
          {
            "code": "ANC-17-06",
            "name": "Marca",
            "ubigeo": "021706"
          },
          {
            "code": "ANC-17-07",
            "name": "Pampas Chico",
            "ubigeo": "021707"
          },
          {
            "code": "ANC-17-08",
            "name": "Pararin",
            "ubigeo": "021708"
          },
          {
            "code": "ANC-17-01",
            "name": "Recuay",
            "ubigeo": "021701"
          },
          {
            "code": "ANC-17-09",
            "name": "Tapacocha",
            "ubigeo": "021709"
          },
          {
            "code": "ANC-17-10",
            "name": "Ticapampa",
            "ubigeo": "021710"
          }
        ]
      },
      {
        "code": "ANC-18",
        "name": "Santa",
        "districts": [
          {
            "code": "ANC-18-02",
            "name": "Caceres del Peru",
            "ubigeo": "021802"
          },
          {
            "code": "ANC-18-01",
            "name": "Chimbote",
            "ubigeo": "021801"
          },
          {
            "code": "ANC-18-03",
            "name": "Coishco",
            "ubigeo": "021803"
          },
          {
            "code": "ANC-18-04",
            "name": "Macate",
            "ubigeo": "021804"
          },
          {
            "code": "ANC-18-05",
            "name": "Moro",
            "ubigeo": "021805"
          },
          {
            "code": "ANC-18-06",
            "name": "Nepeña",
            "ubigeo": "021806"
          },
          {
            "code": "ANC-18-09",
            "name": "Nuevo Chimbote",
            "ubigeo": "021809"
          },
          {
            "code": "ANC-18-07",
            "name": "Samanco",
            "ubigeo": "021807"
          },
          {
            "code": "ANC-18-08",
            "name": "Santa",
            "ubigeo": "021808"
          }
        ]
      },
      {
        "code": "ANC-19",
        "name": "Sihuas",
        "districts": [
          {
            "code": "ANC-19-02",
            "name": "Acobamba",
            "ubigeo": "021902"
          },
          {
            "code": "ANC-19-03",
            "name": "Alfonso Ugarte",
            "ubigeo": "021903"
          },
          {
            "code": "ANC-19-04",
            "name": "Cashapampa",
            "ubigeo": "021904"
          },
          {
            "code": "ANC-19-05",
            "name": "Chingalpo",
            "ubigeo": "021905"
          },
          {
            "code": "ANC-19-06",
            "name": "Huayllabamba",
            "ubigeo": "021906"
          },
          {
            "code": "ANC-19-07",
            "name": "Quiches",
            "ubigeo": "021907"
          },
          {
            "code": "ANC-19-08",
            "name": "Ragash",
            "ubigeo": "021908"
          },
          {
            "code": "ANC-19-09",
            "name": "San Juan",
            "ubigeo": "021909"
          },
          {
            "code": "ANC-19-10",
            "name": "Sicsibamba",
            "ubigeo": "021910"
          },
          {
            "code": "ANC-19-01",
            "name": "Sihuas",
            "ubigeo": "021901"
          }
        ]
      },
      {
        "code": "ANC-20",
        "name": "Yungay",
        "districts": [
          {
            "code": "ANC-20-02",
            "name": "Cascapara",
            "ubigeo": "022002"
          },
          {
            "code": "ANC-20-03",
            "name": "Mancos",
            "ubigeo": "022003"
          },
          {
            "code": "ANC-20-04",
            "name": "Matacoto",
            "ubigeo": "022004"
          },
          {
            "code": "ANC-20-05",
            "name": "Quillo",
            "ubigeo": "022005"
          },
          {
            "code": "ANC-20-06",
            "name": "Ranrahirca",
            "ubigeo": "022006"
          },
          {
            "code": "ANC-20-07",
            "name": "Shupluy",
            "ubigeo": "022007"
          },
          {
            "code": "ANC-20-08",
            "name": "Yanama",
            "ubigeo": "022008"
          },
          {
            "code": "ANC-20-01",
            "name": "Yungay",
            "ubigeo": "022001"
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
        "code": "APU-01",
        "name": "Abancay",
        "districts": [
          {
            "code": "APU-01-01",
            "name": "Abancay",
            "ubigeo": "030101"
          },
          {
            "code": "APU-01-02",
            "name": "Chacoche",
            "ubigeo": "030102"
          },
          {
            "code": "APU-01-03",
            "name": "Circa",
            "ubigeo": "030103"
          },
          {
            "code": "APU-01-04",
            "name": "Curahuasi",
            "ubigeo": "030104"
          },
          {
            "code": "APU-01-05",
            "name": "Huanipaca",
            "ubigeo": "030105"
          },
          {
            "code": "APU-01-06",
            "name": "Lambrama",
            "ubigeo": "030106"
          },
          {
            "code": "APU-01-07",
            "name": "Pichirhua",
            "ubigeo": "030107"
          },
          {
            "code": "APU-01-08",
            "name": "San Pedro de Cachora",
            "ubigeo": "030108"
          },
          {
            "code": "APU-01-09",
            "name": "Tamburco",
            "ubigeo": "030109"
          }
        ]
      },
      {
        "code": "APU-02",
        "name": "Andahuaylas",
        "districts": [
          {
            "code": "APU-02-01",
            "name": "Andahuaylas",
            "ubigeo": "030201"
          },
          {
            "code": "APU-02-02",
            "name": "Andarapa",
            "ubigeo": "030202"
          },
          {
            "code": "APU-02-03",
            "name": "Chiara",
            "ubigeo": "030203"
          },
          {
            "code": "APU-02-04",
            "name": "Huancarama",
            "ubigeo": "030204"
          },
          {
            "code": "APU-02-05",
            "name": "Huancaray",
            "ubigeo": "030205"
          },
          {
            "code": "APU-02-06",
            "name": "Huayana",
            "ubigeo": "030206"
          },
          {
            "code": "APU-02-20",
            "name": "José María Arguedas",
            "ubigeo": "030220"
          },
          {
            "code": "APU-02-19",
            "name": "Kaquiabamba",
            "ubigeo": "030219"
          },
          {
            "code": "APU-02-07",
            "name": "Kishuara",
            "ubigeo": "030207"
          },
          {
            "code": "APU-02-08",
            "name": "Pacobamba",
            "ubigeo": "030208"
          },
          {
            "code": "APU-02-09",
            "name": "Pacucha",
            "ubigeo": "030209"
          },
          {
            "code": "APU-02-10",
            "name": "Pampachiri",
            "ubigeo": "030210"
          },
          {
            "code": "APU-02-11",
            "name": "Pomacocha",
            "ubigeo": "030211"
          },
          {
            "code": "APU-02-12",
            "name": "San Antonio de Cachi",
            "ubigeo": "030212"
          },
          {
            "code": "APU-02-13",
            "name": "San Jeronimo",
            "ubigeo": "030213"
          },
          {
            "code": "APU-02-14",
            "name": "San Miguel de Chaccrampa",
            "ubigeo": "030214"
          },
          {
            "code": "APU-02-15",
            "name": "Santa Maria de Chicmo",
            "ubigeo": "030215"
          },
          {
            "code": "APU-02-16",
            "name": "Talavera",
            "ubigeo": "030216"
          },
          {
            "code": "APU-02-17",
            "name": "Tumay Huaraca",
            "ubigeo": "030217"
          },
          {
            "code": "APU-02-18",
            "name": "Turpo",
            "ubigeo": "030218"
          }
        ]
      },
      {
        "code": "APU-03",
        "name": "Antabamba",
        "districts": [
          {
            "code": "APU-03-01",
            "name": "Antabamba",
            "ubigeo": "030301"
          },
          {
            "code": "APU-03-02",
            "name": "El Oro",
            "ubigeo": "030302"
          },
          {
            "code": "APU-03-03",
            "name": "Huaquirca",
            "ubigeo": "030303"
          },
          {
            "code": "APU-03-04",
            "name": "Juan Espinoza Medrano",
            "ubigeo": "030304"
          },
          {
            "code": "APU-03-05",
            "name": "Oropesa",
            "ubigeo": "030305"
          },
          {
            "code": "APU-03-06",
            "name": "Pachaconas",
            "ubigeo": "030306"
          },
          {
            "code": "APU-03-07",
            "name": "Sabaino",
            "ubigeo": "030307"
          }
        ]
      },
      {
        "code": "APU-04",
        "name": "Aymaraes",
        "districts": [
          {
            "code": "APU-04-02",
            "name": "Capaya",
            "ubigeo": "030402"
          },
          {
            "code": "APU-04-03",
            "name": "Caraybamba",
            "ubigeo": "030403"
          },
          {
            "code": "APU-04-01",
            "name": "Chalhuanca",
            "ubigeo": "030401"
          },
          {
            "code": "APU-04-04",
            "name": "Chapimarca",
            "ubigeo": "030404"
          },
          {
            "code": "APU-04-05",
            "name": "Colcabamba",
            "ubigeo": "030405"
          },
          {
            "code": "APU-04-06",
            "name": "Cotaruse",
            "ubigeo": "030406"
          },
          {
            "code": "APU-04-07",
            "name": "Huayllo",
            "ubigeo": "030407"
          },
          {
            "code": "APU-04-08",
            "name": "Justo Apu Sahuaraura",
            "ubigeo": "030408"
          },
          {
            "code": "APU-04-09",
            "name": "Lucre",
            "ubigeo": "030409"
          },
          {
            "code": "APU-04-10",
            "name": "Pocohuanca",
            "ubigeo": "030410"
          },
          {
            "code": "APU-04-11",
            "name": "San Juan de Chacña",
            "ubigeo": "030411"
          },
          {
            "code": "APU-04-12",
            "name": "Sañayca",
            "ubigeo": "030412"
          },
          {
            "code": "APU-04-13",
            "name": "Soraya",
            "ubigeo": "030413"
          },
          {
            "code": "APU-04-14",
            "name": "Tapairihua",
            "ubigeo": "030414"
          },
          {
            "code": "APU-04-15",
            "name": "Tintay",
            "ubigeo": "030415"
          },
          {
            "code": "APU-04-16",
            "name": "Toraya",
            "ubigeo": "030416"
          },
          {
            "code": "APU-04-17",
            "name": "Yanaca",
            "ubigeo": "030417"
          }
        ]
      },
      {
        "code": "APU-06",
        "name": "Chincheros",
        "districts": [
          {
            "code": "APU-06-02",
            "name": "Anco_Huallo",
            "ubigeo": "030602"
          },
          {
            "code": "APU-06-01",
            "name": "Chincheros",
            "ubigeo": "030601"
          },
          {
            "code": "APU-06-03",
            "name": "Cocharcas",
            "ubigeo": "030603"
          },
          {
            "code": "APU-06-10",
            "name": "El Porvenir",
            "ubigeo": "030610"
          },
          {
            "code": "APU-06-04",
            "name": "Huaccana",
            "ubigeo": "030604"
          },
          {
            "code": "APU-06-11",
            "name": "Los Chankas",
            "ubigeo": "030611"
          },
          {
            "code": "APU-06-05",
            "name": "Ocobamba",
            "ubigeo": "030605"
          },
          {
            "code": "APU-06-06",
            "name": "Ongoy",
            "ubigeo": "030606"
          },
          {
            "code": "APU-06-08",
            "name": "Ranracancha",
            "ubigeo": "030608"
          },
          {
            "code": "APU-06-09",
            "name": "Rocchacc",
            "ubigeo": "030609"
          },
          {
            "code": "APU-06-07",
            "name": "Uranmarca",
            "ubigeo": "030607"
          }
        ]
      },
      {
        "code": "APU-05",
        "name": "Cotabambas",
        "districts": [
          {
            "code": "APU-05-06",
            "name": "Challhuahuacho",
            "ubigeo": "030506"
          },
          {
            "code": "APU-05-02",
            "name": "Cotabambas",
            "ubigeo": "030502"
          },
          {
            "code": "APU-05-03",
            "name": "Coyllurqui",
            "ubigeo": "030503"
          },
          {
            "code": "APU-05-04",
            "name": "Haquira",
            "ubigeo": "030504"
          },
          {
            "code": "APU-05-05",
            "name": "Mara",
            "ubigeo": "030505"
          },
          {
            "code": "APU-05-01",
            "name": "Tambobamba",
            "ubigeo": "030501"
          }
        ]
      },
      {
        "code": "APU-07",
        "name": "Grau",
        "districts": [
          {
            "code": "APU-07-01",
            "name": "Chuquibambilla",
            "ubigeo": "030701"
          },
          {
            "code": "APU-07-14",
            "name": "Curasco",
            "ubigeo": "030714"
          },
          {
            "code": "APU-07-02",
            "name": "Curpahuasi",
            "ubigeo": "030702"
          },
          {
            "code": "APU-07-03",
            "name": "Gamarra",
            "ubigeo": "030703"
          },
          {
            "code": "APU-07-04",
            "name": "Huayllati",
            "ubigeo": "030704"
          },
          {
            "code": "APU-07-05",
            "name": "Mamara",
            "ubigeo": "030705"
          },
          {
            "code": "APU-07-06",
            "name": "Micaela Bastidas",
            "ubigeo": "030706"
          },
          {
            "code": "APU-07-07",
            "name": "Pataypampa",
            "ubigeo": "030707"
          },
          {
            "code": "APU-07-08",
            "name": "Progreso",
            "ubigeo": "030708"
          },
          {
            "code": "APU-07-09",
            "name": "San Antonio",
            "ubigeo": "030709"
          },
          {
            "code": "APU-07-10",
            "name": "Santa Rosa",
            "ubigeo": "030710"
          },
          {
            "code": "APU-07-11",
            "name": "Turpay",
            "ubigeo": "030711"
          },
          {
            "code": "APU-07-12",
            "name": "Vilcabamba",
            "ubigeo": "030712"
          },
          {
            "code": "APU-07-13",
            "name": "Virundo",
            "ubigeo": "030713"
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
        "code": "ARE-01",
        "name": "Arequipa",
        "districts": [
          {
            "code": "ARE-01-02",
            "name": "Alto Selva Alegre",
            "ubigeo": "040102"
          },
          {
            "code": "ARE-01-01",
            "name": "Arequipa",
            "ubigeo": "040101"
          },
          {
            "code": "ARE-01-03",
            "name": "Cayma",
            "ubigeo": "040103"
          },
          {
            "code": "ARE-01-04",
            "name": "Cerro Colorado",
            "ubigeo": "040104"
          },
          {
            "code": "ARE-01-05",
            "name": "Characato",
            "ubigeo": "040105"
          },
          {
            "code": "ARE-01-06",
            "name": "Chiguata",
            "ubigeo": "040106"
          },
          {
            "code": "ARE-01-07",
            "name": "Jacobo Hunter",
            "ubigeo": "040107"
          },
          {
            "code": "ARE-01-29",
            "name": "Jose Luis Bustamante y Rivero",
            "ubigeo": "040129"
          },
          {
            "code": "ARE-01-08",
            "name": "La Joya",
            "ubigeo": "040108"
          },
          {
            "code": "ARE-01-09",
            "name": "Mariano Melgar",
            "ubigeo": "040109"
          },
          {
            "code": "ARE-01-10",
            "name": "Miraflores",
            "ubigeo": "040110"
          },
          {
            "code": "ARE-01-11",
            "name": "Mollebaya",
            "ubigeo": "040111"
          },
          {
            "code": "ARE-01-12",
            "name": "Paucarpata",
            "ubigeo": "040112"
          },
          {
            "code": "ARE-01-13",
            "name": "Pocsi",
            "ubigeo": "040113"
          },
          {
            "code": "ARE-01-14",
            "name": "Polobaya",
            "ubigeo": "040114"
          },
          {
            "code": "ARE-01-15",
            "name": "Quequeña",
            "ubigeo": "040115"
          },
          {
            "code": "ARE-01-16",
            "name": "Sabandia",
            "ubigeo": "040116"
          },
          {
            "code": "ARE-01-17",
            "name": "Sachaca",
            "ubigeo": "040117"
          },
          {
            "code": "ARE-01-18",
            "name": "San Juan de Siguas",
            "ubigeo": "040118"
          },
          {
            "code": "ARE-01-19",
            "name": "San Juan de Tarucani",
            "ubigeo": "040119"
          },
          {
            "code": "ARE-01-20",
            "name": "Santa Isabel de Siguas",
            "ubigeo": "040120"
          },
          {
            "code": "ARE-01-21",
            "name": "Santa Rita de Siguas",
            "ubigeo": "040121"
          },
          {
            "code": "ARE-01-22",
            "name": "Socabaya",
            "ubigeo": "040122"
          },
          {
            "code": "ARE-01-23",
            "name": "Tiabaya",
            "ubigeo": "040123"
          },
          {
            "code": "ARE-01-24",
            "name": "Uchumayo",
            "ubigeo": "040124"
          },
          {
            "code": "ARE-01-25",
            "name": "Vitor",
            "ubigeo": "040125"
          },
          {
            "code": "ARE-01-26",
            "name": "Yanahuara",
            "ubigeo": "040126"
          },
          {
            "code": "ARE-01-27",
            "name": "Yarabamba",
            "ubigeo": "040127"
          },
          {
            "code": "ARE-01-28",
            "name": "Yura",
            "ubigeo": "040128"
          }
        ]
      },
      {
        "code": "ARE-02",
        "name": "Camana",
        "districts": [
          {
            "code": "ARE-02-01",
            "name": "Camana",
            "ubigeo": "040201"
          },
          {
            "code": "ARE-02-02",
            "name": "Jose Maria Quimper",
            "ubigeo": "040202"
          },
          {
            "code": "ARE-02-03",
            "name": "Mariano Nicolas Valcarcel",
            "ubigeo": "040203"
          },
          {
            "code": "ARE-02-04",
            "name": "Mariscal Caceres",
            "ubigeo": "040204"
          },
          {
            "code": "ARE-02-05",
            "name": "Nicolas de Pierola",
            "ubigeo": "040205"
          },
          {
            "code": "ARE-02-06",
            "name": "Ocoña",
            "ubigeo": "040206"
          },
          {
            "code": "ARE-02-07",
            "name": "Quilca",
            "ubigeo": "040207"
          },
          {
            "code": "ARE-02-08",
            "name": "Samuel Pastor",
            "ubigeo": "040208"
          }
        ]
      },
      {
        "code": "ARE-03",
        "name": "Caraveli",
        "districts": [
          {
            "code": "ARE-03-02",
            "name": "Acari",
            "ubigeo": "040302"
          },
          {
            "code": "ARE-03-03",
            "name": "Atico",
            "ubigeo": "040303"
          },
          {
            "code": "ARE-03-04",
            "name": "Atiquipa",
            "ubigeo": "040304"
          },
          {
            "code": "ARE-03-05",
            "name": "Bella Union",
            "ubigeo": "040305"
          },
          {
            "code": "ARE-03-06",
            "name": "Cahuacho",
            "ubigeo": "040306"
          },
          {
            "code": "ARE-03-01",
            "name": "Caraveli",
            "ubigeo": "040301"
          },
          {
            "code": "ARE-03-07",
            "name": "Chala",
            "ubigeo": "040307"
          },
          {
            "code": "ARE-03-08",
            "name": "Chaparra",
            "ubigeo": "040308"
          },
          {
            "code": "ARE-03-09",
            "name": "Huanuhuanu",
            "ubigeo": "040309"
          },
          {
            "code": "ARE-03-10",
            "name": "Jaqui",
            "ubigeo": "040310"
          },
          {
            "code": "ARE-03-11",
            "name": "Lomas",
            "ubigeo": "040311"
          },
          {
            "code": "ARE-03-12",
            "name": "Quicacha",
            "ubigeo": "040312"
          },
          {
            "code": "ARE-03-13",
            "name": "Yauca",
            "ubigeo": "040313"
          }
        ]
      },
      {
        "code": "ARE-04",
        "name": "Castilla",
        "districts": [
          {
            "code": "ARE-04-02",
            "name": "Andagua",
            "ubigeo": "040402"
          },
          {
            "code": "ARE-04-01",
            "name": "Aplao",
            "ubigeo": "040401"
          },
          {
            "code": "ARE-04-03",
            "name": "Ayo",
            "ubigeo": "040403"
          },
          {
            "code": "ARE-04-04",
            "name": "Chachas",
            "ubigeo": "040404"
          },
          {
            "code": "ARE-04-05",
            "name": "Chilcaymarca",
            "ubigeo": "040405"
          },
          {
            "code": "ARE-04-06",
            "name": "Choco",
            "ubigeo": "040406"
          },
          {
            "code": "ARE-04-07",
            "name": "Huancarqui",
            "ubigeo": "040407"
          },
          {
            "code": "ARE-04-08",
            "name": "Machaguay",
            "ubigeo": "040408"
          },
          {
            "code": "ARE-04-09",
            "name": "Orcopampa",
            "ubigeo": "040409"
          },
          {
            "code": "ARE-04-10",
            "name": "Pampacolca",
            "ubigeo": "040410"
          },
          {
            "code": "ARE-04-11",
            "name": "Tipan",
            "ubigeo": "040411"
          },
          {
            "code": "ARE-04-13",
            "name": "Uraca",
            "ubigeo": "040413"
          },
          {
            "code": "ARE-04-12",
            "name": "Uñon",
            "ubigeo": "040412"
          },
          {
            "code": "ARE-04-14",
            "name": "Viraco",
            "ubigeo": "040414"
          }
        ]
      },
      {
        "code": "ARE-05",
        "name": "Caylloma",
        "districts": [
          {
            "code": "ARE-05-02",
            "name": "Achoma",
            "ubigeo": "040502"
          },
          {
            "code": "ARE-05-03",
            "name": "Cabanaconde",
            "ubigeo": "040503"
          },
          {
            "code": "ARE-05-04",
            "name": "Callalli",
            "ubigeo": "040504"
          },
          {
            "code": "ARE-05-05",
            "name": "Caylloma",
            "ubigeo": "040505"
          },
          {
            "code": "ARE-05-01",
            "name": "Chivay",
            "ubigeo": "040501"
          },
          {
            "code": "ARE-05-06",
            "name": "Coporaque",
            "ubigeo": "040506"
          },
          {
            "code": "ARE-05-07",
            "name": "Huambo",
            "ubigeo": "040507"
          },
          {
            "code": "ARE-05-08",
            "name": "Huanca",
            "ubigeo": "040508"
          },
          {
            "code": "ARE-05-09",
            "name": "Ichupampa",
            "ubigeo": "040509"
          },
          {
            "code": "ARE-05-10",
            "name": "Lari",
            "ubigeo": "040510"
          },
          {
            "code": "ARE-05-11",
            "name": "Lluta",
            "ubigeo": "040511"
          },
          {
            "code": "ARE-05-12",
            "name": "Maca",
            "ubigeo": "040512"
          },
          {
            "code": "ARE-05-13",
            "name": "Madrigal",
            "ubigeo": "040513"
          },
          {
            "code": "ARE-05-20",
            "name": "Majes",
            "ubigeo": "040520"
          },
          {
            "code": "ARE-05-14",
            "name": "San Antonio de Chuca",
            "ubigeo": "040514"
          },
          {
            "code": "ARE-05-15",
            "name": "Sibayo",
            "ubigeo": "040515"
          },
          {
            "code": "ARE-05-16",
            "name": "Tapay",
            "ubigeo": "040516"
          },
          {
            "code": "ARE-05-17",
            "name": "Tisco",
            "ubigeo": "040517"
          },
          {
            "code": "ARE-05-18",
            "name": "Tuti",
            "ubigeo": "040518"
          },
          {
            "code": "ARE-05-19",
            "name": "Yanque",
            "ubigeo": "040519"
          }
        ]
      },
      {
        "code": "ARE-06",
        "name": "Condesuyos",
        "districts": [
          {
            "code": "ARE-06-02",
            "name": "Andaray",
            "ubigeo": "040602"
          },
          {
            "code": "ARE-06-03",
            "name": "Cayarani",
            "ubigeo": "040603"
          },
          {
            "code": "ARE-06-04",
            "name": "Chichas",
            "ubigeo": "040604"
          },
          {
            "code": "ARE-06-01",
            "name": "Chuquibamba",
            "ubigeo": "040601"
          },
          {
            "code": "ARE-06-05",
            "name": "Iray",
            "ubigeo": "040605"
          },
          {
            "code": "ARE-06-06",
            "name": "Rio Grande",
            "ubigeo": "040606"
          },
          {
            "code": "ARE-06-07",
            "name": "Salamanca",
            "ubigeo": "040607"
          },
          {
            "code": "ARE-06-08",
            "name": "Yanaquihua",
            "ubigeo": "040608"
          }
        ]
      },
      {
        "code": "ARE-07",
        "name": "Islay",
        "districts": [
          {
            "code": "ARE-07-02",
            "name": "Cocachacra",
            "ubigeo": "040702"
          },
          {
            "code": "ARE-07-03",
            "name": "Dean Valdivia",
            "ubigeo": "040703"
          },
          {
            "code": "ARE-07-04",
            "name": "Islay",
            "ubigeo": "040704"
          },
          {
            "code": "ARE-07-05",
            "name": "Mejia",
            "ubigeo": "040705"
          },
          {
            "code": "ARE-07-01",
            "name": "Mollendo",
            "ubigeo": "040701"
          },
          {
            "code": "ARE-07-06",
            "name": "Punta de Bombon",
            "ubigeo": "040706"
          }
        ]
      },
      {
        "code": "ARE-08",
        "name": "La Union",
        "districts": [
          {
            "code": "ARE-08-02",
            "name": "Alca",
            "ubigeo": "040802"
          },
          {
            "code": "ARE-08-03",
            "name": "Charcana",
            "ubigeo": "040803"
          },
          {
            "code": "ARE-08-01",
            "name": "Cotahuasi",
            "ubigeo": "040801"
          },
          {
            "code": "ARE-08-04",
            "name": "Huaynacotas",
            "ubigeo": "040804"
          },
          {
            "code": "ARE-08-05",
            "name": "Pampamarca",
            "ubigeo": "040805"
          },
          {
            "code": "ARE-08-06",
            "name": "Puyca",
            "ubigeo": "040806"
          },
          {
            "code": "ARE-08-07",
            "name": "Quechualla",
            "ubigeo": "040807"
          },
          {
            "code": "ARE-08-08",
            "name": "Sayla",
            "ubigeo": "040808"
          },
          {
            "code": "ARE-08-09",
            "name": "Tauria",
            "ubigeo": "040809"
          },
          {
            "code": "ARE-08-10",
            "name": "Tomepampa",
            "ubigeo": "040810"
          },
          {
            "code": "ARE-08-11",
            "name": "Toro",
            "ubigeo": "040811"
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
        "code": "AYA-02",
        "name": "Cangallo",
        "districts": [
          {
            "code": "AYA-02-01",
            "name": "Cangallo",
            "ubigeo": "050201"
          },
          {
            "code": "AYA-02-02",
            "name": "Chuschi",
            "ubigeo": "050202"
          },
          {
            "code": "AYA-02-03",
            "name": "Los Morochucos",
            "ubigeo": "050203"
          },
          {
            "code": "AYA-02-04",
            "name": "Maria Parado de Bellido",
            "ubigeo": "050204"
          },
          {
            "code": "AYA-02-05",
            "name": "Paras",
            "ubigeo": "050205"
          },
          {
            "code": "AYA-02-06",
            "name": "Totos",
            "ubigeo": "050206"
          }
        ]
      },
      {
        "code": "AYA-01",
        "name": "Huamanga",
        "districts": [
          {
            "code": "AYA-01-02",
            "name": "Acocro",
            "ubigeo": "050102"
          },
          {
            "code": "AYA-01-03",
            "name": "Acos Vinchos",
            "ubigeo": "050103"
          },
          {
            "code": "AYA-01-16",
            "name": "Andrés Avelino Cáceres Dorregaray",
            "ubigeo": "050116"
          },
          {
            "code": "AYA-01-01",
            "name": "Ayacucho",
            "ubigeo": "050101"
          },
          {
            "code": "AYA-01-04",
            "name": "Carmen Alto",
            "ubigeo": "050104"
          },
          {
            "code": "AYA-01-05",
            "name": "Chiara",
            "ubigeo": "050105"
          },
          {
            "code": "AYA-01-15",
            "name": "Jesus Nazareno",
            "ubigeo": "050115"
          },
          {
            "code": "AYA-01-06",
            "name": "Ocros",
            "ubigeo": "050106"
          },
          {
            "code": "AYA-01-07",
            "name": "Pacaycasa",
            "ubigeo": "050107"
          },
          {
            "code": "AYA-01-08",
            "name": "Quinua",
            "ubigeo": "050108"
          },
          {
            "code": "AYA-01-09",
            "name": "San Jose de Ticllas",
            "ubigeo": "050109"
          },
          {
            "code": "AYA-01-10",
            "name": "San Juan Bautista",
            "ubigeo": "050110"
          },
          {
            "code": "AYA-01-11",
            "name": "Santiago de Pischa",
            "ubigeo": "050111"
          },
          {
            "code": "AYA-01-12",
            "name": "Socos",
            "ubigeo": "050112"
          },
          {
            "code": "AYA-01-13",
            "name": "Tambillo",
            "ubigeo": "050113"
          },
          {
            "code": "AYA-01-14",
            "name": "Vinchos",
            "ubigeo": "050114"
          }
        ]
      },
      {
        "code": "AYA-03",
        "name": "Huanca Sancos",
        "districts": [
          {
            "code": "AYA-03-02",
            "name": "Carapo",
            "ubigeo": "050302"
          },
          {
            "code": "AYA-03-03",
            "name": "Sacsamarca",
            "ubigeo": "050303"
          },
          {
            "code": "AYA-03-01",
            "name": "Sancos",
            "ubigeo": "050301"
          },
          {
            "code": "AYA-03-04",
            "name": "Santiago de Lucanamarca",
            "ubigeo": "050304"
          }
        ]
      },
      {
        "code": "AYA-04",
        "name": "Huanta",
        "districts": [
          {
            "code": "AYA-04-02",
            "name": "Ayahuanco",
            "ubigeo": "050402"
          },
          {
            "code": "AYA-04-09",
            "name": "Canayre",
            "ubigeo": "050409"
          },
          {
            "code": "AYA-04-12",
            "name": "Chaca",
            "ubigeo": "050412"
          },
          {
            "code": "AYA-04-03",
            "name": "Huamanguilla",
            "ubigeo": "050403"
          },
          {
            "code": "AYA-04-01",
            "name": "Huanta",
            "ubigeo": "050401"
          },
          {
            "code": "AYA-04-04",
            "name": "Iguain",
            "ubigeo": "050404"
          },
          {
            "code": "AYA-04-08",
            "name": "Llochegua",
            "ubigeo": "050408"
          },
          {
            "code": "AYA-04-05",
            "name": "Luricocha",
            "ubigeo": "050405"
          },
          {
            "code": "AYA-04-11",
            "name": "Pucacolpa",
            "ubigeo": "050411"
          },
          {
            "code": "AYA-04-06",
            "name": "Santillana",
            "ubigeo": "050406"
          },
          {
            "code": "AYA-04-07",
            "name": "Sivia",
            "ubigeo": "050407"
          },
          {
            "code": "AYA-04-10",
            "name": "Uchuraccay",
            "ubigeo": "050410"
          }
        ]
      },
      {
        "code": "AYA-05",
        "name": "La Mar",
        "districts": [
          {
            "code": "AYA-05-10",
            "name": "Anchihuay",
            "ubigeo": "050510"
          },
          {
            "code": "AYA-05-02",
            "name": "Anco",
            "ubigeo": "050502"
          },
          {
            "code": "AYA-05-03",
            "name": "Ayna",
            "ubigeo": "050503"
          },
          {
            "code": "AYA-05-04",
            "name": "Chilcas",
            "ubigeo": "050504"
          },
          {
            "code": "AYA-05-05",
            "name": "Chungui",
            "ubigeo": "050505"
          },
          {
            "code": "AYA-05-06",
            "name": "Luis Carranza",
            "ubigeo": "050506"
          },
          {
            "code": "AYA-05-11",
            "name": "Oronccoy",
            "ubigeo": "050511"
          },
          {
            "code": "AYA-05-09",
            "name": "Samugari",
            "ubigeo": "050509"
          },
          {
            "code": "AYA-05-01",
            "name": "San Miguel",
            "ubigeo": "050501"
          },
          {
            "code": "AYA-05-07",
            "name": "Santa Rosa",
            "ubigeo": "050507"
          },
          {
            "code": "AYA-05-08",
            "name": "Tambo",
            "ubigeo": "050508"
          }
        ]
      },
      {
        "code": "AYA-06",
        "name": "Lucanas",
        "districts": [
          {
            "code": "AYA-06-02",
            "name": "Aucara",
            "ubigeo": "050602"
          },
          {
            "code": "AYA-06-03",
            "name": "Cabana",
            "ubigeo": "050603"
          },
          {
            "code": "AYA-06-04",
            "name": "Carmen Salcedo",
            "ubigeo": "050604"
          },
          {
            "code": "AYA-06-05",
            "name": "Chaviña",
            "ubigeo": "050605"
          },
          {
            "code": "AYA-06-06",
            "name": "Chipao",
            "ubigeo": "050606"
          },
          {
            "code": "AYA-06-07",
            "name": "Huac-Huas",
            "ubigeo": "050607"
          },
          {
            "code": "AYA-06-08",
            "name": "Laramate",
            "ubigeo": "050608"
          },
          {
            "code": "AYA-06-09",
            "name": "Leoncio Prado",
            "ubigeo": "050609"
          },
          {
            "code": "AYA-06-10",
            "name": "Llauta",
            "ubigeo": "050610"
          },
          {
            "code": "AYA-06-11",
            "name": "Lucanas",
            "ubigeo": "050611"
          },
          {
            "code": "AYA-06-12",
            "name": "Ocaña",
            "ubigeo": "050612"
          },
          {
            "code": "AYA-06-13",
            "name": "Otoca",
            "ubigeo": "050613"
          },
          {
            "code": "AYA-06-01",
            "name": "Puquio",
            "ubigeo": "050601"
          },
          {
            "code": "AYA-06-14",
            "name": "Saisa",
            "ubigeo": "050614"
          },
          {
            "code": "AYA-06-15",
            "name": "San Cristobal",
            "ubigeo": "050615"
          },
          {
            "code": "AYA-06-16",
            "name": "San Juan",
            "ubigeo": "050616"
          },
          {
            "code": "AYA-06-17",
            "name": "San Pedro",
            "ubigeo": "050617"
          },
          {
            "code": "AYA-06-18",
            "name": "San Pedro de Palco",
            "ubigeo": "050618"
          },
          {
            "code": "AYA-06-19",
            "name": "Sancos",
            "ubigeo": "050619"
          },
          {
            "code": "AYA-06-20",
            "name": "Santa Ana de Huaycahuacho",
            "ubigeo": "050620"
          },
          {
            "code": "AYA-06-21",
            "name": "Santa Lucia",
            "ubigeo": "050621"
          }
        ]
      },
      {
        "code": "AYA-07",
        "name": "Parinacochas",
        "districts": [
          {
            "code": "AYA-07-02",
            "name": "Chumpi",
            "ubigeo": "050702"
          },
          {
            "code": "AYA-07-01",
            "name": "Coracora",
            "ubigeo": "050701"
          },
          {
            "code": "AYA-07-03",
            "name": "Coronel Castañeda",
            "ubigeo": "050703"
          },
          {
            "code": "AYA-07-04",
            "name": "Pacapausa",
            "ubigeo": "050704"
          },
          {
            "code": "AYA-07-05",
            "name": "Pullo",
            "ubigeo": "050705"
          },
          {
            "code": "AYA-07-06",
            "name": "Puyusca",
            "ubigeo": "050706"
          },
          {
            "code": "AYA-07-07",
            "name": "San Francisco de Ravacayco",
            "ubigeo": "050707"
          },
          {
            "code": "AYA-07-08",
            "name": "Upahuacho",
            "ubigeo": "050708"
          }
        ]
      },
      {
        "code": "AYA-08",
        "name": "Paucar del Sara Sara",
        "districts": [
          {
            "code": "AYA-08-02",
            "name": "Colta",
            "ubigeo": "050802"
          },
          {
            "code": "AYA-08-03",
            "name": "Corculla",
            "ubigeo": "050803"
          },
          {
            "code": "AYA-08-04",
            "name": "Lampa",
            "ubigeo": "050804"
          },
          {
            "code": "AYA-08-05",
            "name": "Marcabamba",
            "ubigeo": "050805"
          },
          {
            "code": "AYA-08-06",
            "name": "Oyolo",
            "ubigeo": "050806"
          },
          {
            "code": "AYA-08-07",
            "name": "Pararca",
            "ubigeo": "050807"
          },
          {
            "code": "AYA-08-01",
            "name": "Pausa",
            "ubigeo": "050801"
          },
          {
            "code": "AYA-08-08",
            "name": "San Javier de Alpabamba",
            "ubigeo": "050808"
          },
          {
            "code": "AYA-08-09",
            "name": "San Jose de Ushua",
            "ubigeo": "050809"
          },
          {
            "code": "AYA-08-10",
            "name": "Sara Sara",
            "ubigeo": "050810"
          }
        ]
      },
      {
        "code": "AYA-09",
        "name": "Sucre",
        "districts": [
          {
            "code": "AYA-09-02",
            "name": "Belen",
            "ubigeo": "050902"
          },
          {
            "code": "AYA-09-03",
            "name": "Chalcos",
            "ubigeo": "050903"
          },
          {
            "code": "AYA-09-04",
            "name": "Chilcayoc",
            "ubigeo": "050904"
          },
          {
            "code": "AYA-09-05",
            "name": "Huacaña",
            "ubigeo": "050905"
          },
          {
            "code": "AYA-09-06",
            "name": "Morcolla",
            "ubigeo": "050906"
          },
          {
            "code": "AYA-09-07",
            "name": "Paico",
            "ubigeo": "050907"
          },
          {
            "code": "AYA-09-01",
            "name": "Querobamba",
            "ubigeo": "050901"
          },
          {
            "code": "AYA-09-08",
            "name": "San Pedro de Larcay",
            "ubigeo": "050908"
          },
          {
            "code": "AYA-09-09",
            "name": "San Salvador de Quije",
            "ubigeo": "050909"
          },
          {
            "code": "AYA-09-10",
            "name": "Santiago de Paucaray",
            "ubigeo": "050910"
          },
          {
            "code": "AYA-09-11",
            "name": "Soras",
            "ubigeo": "050911"
          }
        ]
      },
      {
        "code": "AYA-10",
        "name": "Victor Fajardo",
        "districts": [
          {
            "code": "AYA-10-02",
            "name": "Alcamenca",
            "ubigeo": "051002"
          },
          {
            "code": "AYA-10-03",
            "name": "Apongo",
            "ubigeo": "051003"
          },
          {
            "code": "AYA-10-04",
            "name": "Asquipata",
            "ubigeo": "051004"
          },
          {
            "code": "AYA-10-05",
            "name": "Canaria",
            "ubigeo": "051005"
          },
          {
            "code": "AYA-10-06",
            "name": "Cayara",
            "ubigeo": "051006"
          },
          {
            "code": "AYA-10-07",
            "name": "Colca",
            "ubigeo": "051007"
          },
          {
            "code": "AYA-10-08",
            "name": "Huamanquiquia",
            "ubigeo": "051008"
          },
          {
            "code": "AYA-10-01",
            "name": "Huancapi",
            "ubigeo": "051001"
          },
          {
            "code": "AYA-10-09",
            "name": "Huancaraylla",
            "ubigeo": "051009"
          },
          {
            "code": "AYA-10-10",
            "name": "Huaya",
            "ubigeo": "051010"
          },
          {
            "code": "AYA-10-11",
            "name": "Sarhua",
            "ubigeo": "051011"
          },
          {
            "code": "AYA-10-12",
            "name": "Vilcanchos",
            "ubigeo": "051012"
          }
        ]
      },
      {
        "code": "AYA-11",
        "name": "Vilcas Huaman",
        "districts": [
          {
            "code": "AYA-11-02",
            "name": "Accomarca",
            "ubigeo": "051102"
          },
          {
            "code": "AYA-11-03",
            "name": "Carhuanca",
            "ubigeo": "051103"
          },
          {
            "code": "AYA-11-04",
            "name": "Concepcion",
            "ubigeo": "051104"
          },
          {
            "code": "AYA-11-05",
            "name": "Huambalpa",
            "ubigeo": "051105"
          },
          {
            "code": "AYA-11-06",
            "name": "Independencia",
            "ubigeo": "051106"
          },
          {
            "code": "AYA-11-07",
            "name": "Saurama",
            "ubigeo": "051107"
          },
          {
            "code": "AYA-11-01",
            "name": "Vilcas Huaman",
            "ubigeo": "051101"
          },
          {
            "code": "AYA-11-08",
            "name": "Vischongo",
            "ubigeo": "051108"
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
        "code": "CAJ-02",
        "name": "Cajabamba",
        "districts": [
          {
            "code": "CAJ-02-02",
            "name": "Cachachi",
            "ubigeo": "060202"
          },
          {
            "code": "CAJ-02-01",
            "name": "Cajabamba",
            "ubigeo": "060201"
          },
          {
            "code": "CAJ-02-03",
            "name": "Condebamba",
            "ubigeo": "060203"
          },
          {
            "code": "CAJ-02-04",
            "name": "Sitacocha",
            "ubigeo": "060204"
          }
        ]
      },
      {
        "code": "CAJ-01",
        "name": "Cajamarca",
        "districts": [
          {
            "code": "CAJ-01-02",
            "name": "Asuncion",
            "ubigeo": "060102"
          },
          {
            "code": "CAJ-01-01",
            "name": "Cajamarca",
            "ubigeo": "060101"
          },
          {
            "code": "CAJ-01-03",
            "name": "Chetilla",
            "ubigeo": "060103"
          },
          {
            "code": "CAJ-01-04",
            "name": "Cospan",
            "ubigeo": "060104"
          },
          {
            "code": "CAJ-01-05",
            "name": "Encañada",
            "ubigeo": "060105"
          },
          {
            "code": "CAJ-01-06",
            "name": "Jesus",
            "ubigeo": "060106"
          },
          {
            "code": "CAJ-01-07",
            "name": "Llacanora",
            "ubigeo": "060107"
          },
          {
            "code": "CAJ-01-08",
            "name": "Los Baños del Inca",
            "ubigeo": "060108"
          },
          {
            "code": "CAJ-01-09",
            "name": "Magdalena",
            "ubigeo": "060109"
          },
          {
            "code": "CAJ-01-10",
            "name": "Matara",
            "ubigeo": "060110"
          },
          {
            "code": "CAJ-01-11",
            "name": "Namora",
            "ubigeo": "060111"
          },
          {
            "code": "CAJ-01-12",
            "name": "San Juan",
            "ubigeo": "060112"
          }
        ]
      },
      {
        "code": "CAJ-03",
        "name": "Celendin",
        "districts": [
          {
            "code": "CAJ-03-01",
            "name": "Celendin",
            "ubigeo": "060301"
          },
          {
            "code": "CAJ-03-02",
            "name": "Chumuch",
            "ubigeo": "060302"
          },
          {
            "code": "CAJ-03-03",
            "name": "Cortegana",
            "ubigeo": "060303"
          },
          {
            "code": "CAJ-03-04",
            "name": "Huasmin",
            "ubigeo": "060304"
          },
          {
            "code": "CAJ-03-05",
            "name": "Jorge Chavez",
            "ubigeo": "060305"
          },
          {
            "code": "CAJ-03-06",
            "name": "Jose Galvez",
            "ubigeo": "060306"
          },
          {
            "code": "CAJ-03-12",
            "name": "La Libertad de Pallan",
            "ubigeo": "060312"
          },
          {
            "code": "CAJ-03-07",
            "name": "Miguel Iglesias",
            "ubigeo": "060307"
          },
          {
            "code": "CAJ-03-08",
            "name": "Oxamarca",
            "ubigeo": "060308"
          },
          {
            "code": "CAJ-03-09",
            "name": "Sorochuco",
            "ubigeo": "060309"
          },
          {
            "code": "CAJ-03-10",
            "name": "Sucre",
            "ubigeo": "060310"
          },
          {
            "code": "CAJ-03-11",
            "name": "Utco",
            "ubigeo": "060311"
          }
        ]
      },
      {
        "code": "CAJ-04",
        "name": "Chota",
        "districts": [
          {
            "code": "CAJ-04-02",
            "name": "Anguia",
            "ubigeo": "060402"
          },
          {
            "code": "CAJ-04-03",
            "name": "Chadin",
            "ubigeo": "060403"
          },
          {
            "code": "CAJ-04-19",
            "name": "Chalamarca",
            "ubigeo": "060419"
          },
          {
            "code": "CAJ-04-04",
            "name": "Chiguirip",
            "ubigeo": "060404"
          },
          {
            "code": "CAJ-04-05",
            "name": "Chimban",
            "ubigeo": "060405"
          },
          {
            "code": "CAJ-04-06",
            "name": "Choropampa",
            "ubigeo": "060406"
          },
          {
            "code": "CAJ-04-01",
            "name": "Chota",
            "ubigeo": "060401"
          },
          {
            "code": "CAJ-04-07",
            "name": "Cochabamba",
            "ubigeo": "060407"
          },
          {
            "code": "CAJ-04-08",
            "name": "Conchan",
            "ubigeo": "060408"
          },
          {
            "code": "CAJ-04-09",
            "name": "Huambos",
            "ubigeo": "060409"
          },
          {
            "code": "CAJ-04-10",
            "name": "Lajas",
            "ubigeo": "060410"
          },
          {
            "code": "CAJ-04-11",
            "name": "Llama",
            "ubigeo": "060411"
          },
          {
            "code": "CAJ-04-12",
            "name": "Miracosta",
            "ubigeo": "060412"
          },
          {
            "code": "CAJ-04-13",
            "name": "Paccha",
            "ubigeo": "060413"
          },
          {
            "code": "CAJ-04-14",
            "name": "Pion",
            "ubigeo": "060414"
          },
          {
            "code": "CAJ-04-15",
            "name": "Querocoto",
            "ubigeo": "060415"
          },
          {
            "code": "CAJ-04-16",
            "name": "San Juan de Licupis",
            "ubigeo": "060416"
          },
          {
            "code": "CAJ-04-17",
            "name": "Tacabamba",
            "ubigeo": "060417"
          },
          {
            "code": "CAJ-04-18",
            "name": "Tocmoche",
            "ubigeo": "060418"
          }
        ]
      },
      {
        "code": "CAJ-05",
        "name": "Contumaza",
        "districts": [
          {
            "code": "CAJ-05-02",
            "name": "Chilete",
            "ubigeo": "060502"
          },
          {
            "code": "CAJ-05-01",
            "name": "Contumaza",
            "ubigeo": "060501"
          },
          {
            "code": "CAJ-05-03",
            "name": "Cupisnique",
            "ubigeo": "060503"
          },
          {
            "code": "CAJ-05-04",
            "name": "Guzmango",
            "ubigeo": "060504"
          },
          {
            "code": "CAJ-05-05",
            "name": "San Benito",
            "ubigeo": "060505"
          },
          {
            "code": "CAJ-05-06",
            "name": "Santa Cruz de Toled",
            "ubigeo": "060506"
          },
          {
            "code": "CAJ-05-07",
            "name": "Tantarica",
            "ubigeo": "060507"
          },
          {
            "code": "CAJ-05-08",
            "name": "Yonan",
            "ubigeo": "060508"
          }
        ]
      },
      {
        "code": "CAJ-06",
        "name": "Cutervo",
        "districts": [
          {
            "code": "CAJ-06-02",
            "name": "Callayuc",
            "ubigeo": "060602"
          },
          {
            "code": "CAJ-06-03",
            "name": "Choros",
            "ubigeo": "060603"
          },
          {
            "code": "CAJ-06-04",
            "name": "Cujillo",
            "ubigeo": "060604"
          },
          {
            "code": "CAJ-06-01",
            "name": "Cutervo",
            "ubigeo": "060601"
          },
          {
            "code": "CAJ-06-05",
            "name": "La Ramada",
            "ubigeo": "060605"
          },
          {
            "code": "CAJ-06-06",
            "name": "Pimpingos",
            "ubigeo": "060606"
          },
          {
            "code": "CAJ-06-07",
            "name": "Querocotillo",
            "ubigeo": "060607"
          },
          {
            "code": "CAJ-06-08",
            "name": "San Andres de Cutervo",
            "ubigeo": "060608"
          },
          {
            "code": "CAJ-06-09",
            "name": "San Juan de Cutervo",
            "ubigeo": "060609"
          },
          {
            "code": "CAJ-06-10",
            "name": "San Luis de Lucma",
            "ubigeo": "060610"
          },
          {
            "code": "CAJ-06-11",
            "name": "Santa Cruz",
            "ubigeo": "060611"
          },
          {
            "code": "CAJ-06-12",
            "name": "Santo Domingo de La Capilla",
            "ubigeo": "060612"
          },
          {
            "code": "CAJ-06-13",
            "name": "Santo Tomas",
            "ubigeo": "060613"
          },
          {
            "code": "CAJ-06-14",
            "name": "Socota",
            "ubigeo": "060614"
          },
          {
            "code": "CAJ-06-15",
            "name": "Toribio Casanova",
            "ubigeo": "060615"
          }
        ]
      },
      {
        "code": "CAJ-07",
        "name": "Hualgayoc",
        "districts": [
          {
            "code": "CAJ-07-01",
            "name": "Bambamarca",
            "ubigeo": "060701"
          },
          {
            "code": "CAJ-07-02",
            "name": "Chugur",
            "ubigeo": "060702"
          },
          {
            "code": "CAJ-07-03",
            "name": "Hualgayoc",
            "ubigeo": "060703"
          }
        ]
      },
      {
        "code": "CAJ-08",
        "name": "Jaen",
        "districts": [
          {
            "code": "CAJ-08-02",
            "name": "Bellavista",
            "ubigeo": "060802"
          },
          {
            "code": "CAJ-08-03",
            "name": "Chontali",
            "ubigeo": "060803"
          },
          {
            "code": "CAJ-08-04",
            "name": "Colasay",
            "ubigeo": "060804"
          },
          {
            "code": "CAJ-08-05",
            "name": "Huabal",
            "ubigeo": "060805"
          },
          {
            "code": "CAJ-08-01",
            "name": "Jaen",
            "ubigeo": "060801"
          },
          {
            "code": "CAJ-08-06",
            "name": "Las Pirias",
            "ubigeo": "060806"
          },
          {
            "code": "CAJ-08-07",
            "name": "Pomahuaca",
            "ubigeo": "060807"
          },
          {
            "code": "CAJ-08-08",
            "name": "Pucara",
            "ubigeo": "060808"
          },
          {
            "code": "CAJ-08-09",
            "name": "Sallique",
            "ubigeo": "060809"
          },
          {
            "code": "CAJ-08-10",
            "name": "San Felipe",
            "ubigeo": "060810"
          },
          {
            "code": "CAJ-08-11",
            "name": "San Jose del Alto",
            "ubigeo": "060811"
          },
          {
            "code": "CAJ-08-12",
            "name": "Santa Rosa",
            "ubigeo": "060812"
          }
        ]
      },
      {
        "code": "CAJ-09",
        "name": "San Ignacio",
        "districts": [
          {
            "code": "CAJ-09-02",
            "name": "Chirinos",
            "ubigeo": "060902"
          },
          {
            "code": "CAJ-09-03",
            "name": "Huarango",
            "ubigeo": "060903"
          },
          {
            "code": "CAJ-09-04",
            "name": "La Coipa",
            "ubigeo": "060904"
          },
          {
            "code": "CAJ-09-05",
            "name": "Namballe",
            "ubigeo": "060905"
          },
          {
            "code": "CAJ-09-01",
            "name": "San Ignacio",
            "ubigeo": "060901"
          },
          {
            "code": "CAJ-09-06",
            "name": "San Jose de Lourdes",
            "ubigeo": "060906"
          },
          {
            "code": "CAJ-09-07",
            "name": "Tabaconas",
            "ubigeo": "060907"
          }
        ]
      },
      {
        "code": "CAJ-10",
        "name": "San Marcos",
        "districts": [
          {
            "code": "CAJ-10-02",
            "name": "Chancay",
            "ubigeo": "061002"
          },
          {
            "code": "CAJ-10-03",
            "name": "Eduardo Villanueva",
            "ubigeo": "061003"
          },
          {
            "code": "CAJ-10-04",
            "name": "Gregorio Pita",
            "ubigeo": "061004"
          },
          {
            "code": "CAJ-10-05",
            "name": "Ichocan",
            "ubigeo": "061005"
          },
          {
            "code": "CAJ-10-06",
            "name": "Jose Manuel Quiroz",
            "ubigeo": "061006"
          },
          {
            "code": "CAJ-10-07",
            "name": "Jose Sabogal",
            "ubigeo": "061007"
          },
          {
            "code": "CAJ-10-01",
            "name": "Pedro Galvez",
            "ubigeo": "061001"
          }
        ]
      },
      {
        "code": "CAJ-11",
        "name": "San Miguel",
        "districts": [
          {
            "code": "CAJ-11-02",
            "name": "Bolivar",
            "ubigeo": "061102"
          },
          {
            "code": "CAJ-11-03",
            "name": "Calquis",
            "ubigeo": "061103"
          },
          {
            "code": "CAJ-11-04",
            "name": "Catilluc",
            "ubigeo": "061104"
          },
          {
            "code": "CAJ-11-05",
            "name": "El Prado",
            "ubigeo": "061105"
          },
          {
            "code": "CAJ-11-06",
            "name": "La Florida",
            "ubigeo": "061106"
          },
          {
            "code": "CAJ-11-07",
            "name": "Llapa",
            "ubigeo": "061107"
          },
          {
            "code": "CAJ-11-08",
            "name": "Nanchoc",
            "ubigeo": "061108"
          },
          {
            "code": "CAJ-11-09",
            "name": "Niepos",
            "ubigeo": "061109"
          },
          {
            "code": "CAJ-11-10",
            "name": "San Gregorio",
            "ubigeo": "061110"
          },
          {
            "code": "CAJ-11-01",
            "name": "San Miguel",
            "ubigeo": "061101"
          },
          {
            "code": "CAJ-11-11",
            "name": "San Silvestre de Cochan",
            "ubigeo": "061111"
          },
          {
            "code": "CAJ-11-12",
            "name": "Tongod",
            "ubigeo": "061112"
          },
          {
            "code": "CAJ-11-13",
            "name": "Union Agua Blanca",
            "ubigeo": "061113"
          }
        ]
      },
      {
        "code": "CAJ-12",
        "name": "San Pablo",
        "districts": [
          {
            "code": "CAJ-12-02",
            "name": "San Bernardino",
            "ubigeo": "061202"
          },
          {
            "code": "CAJ-12-03",
            "name": "San Luis",
            "ubigeo": "061203"
          },
          {
            "code": "CAJ-12-01",
            "name": "San Pablo",
            "ubigeo": "061201"
          },
          {
            "code": "CAJ-12-04",
            "name": "Tumbaden",
            "ubigeo": "061204"
          }
        ]
      },
      {
        "code": "CAJ-13",
        "name": "Santa Cruz",
        "districts": [
          {
            "code": "CAJ-13-02",
            "name": "Andabamba",
            "ubigeo": "061302"
          },
          {
            "code": "CAJ-13-03",
            "name": "Catache",
            "ubigeo": "061303"
          },
          {
            "code": "CAJ-13-04",
            "name": "Chancaybaños",
            "ubigeo": "061304"
          },
          {
            "code": "CAJ-13-05",
            "name": "La Esperanza",
            "ubigeo": "061305"
          },
          {
            "code": "CAJ-13-06",
            "name": "Ninabamba",
            "ubigeo": "061306"
          },
          {
            "code": "CAJ-13-07",
            "name": "Pulan",
            "ubigeo": "061307"
          },
          {
            "code": "CAJ-13-01",
            "name": "Santa Cruz",
            "ubigeo": "061301"
          },
          {
            "code": "CAJ-13-08",
            "name": "Saucepampa",
            "ubigeo": "061308"
          },
          {
            "code": "CAJ-13-09",
            "name": "Sexi",
            "ubigeo": "061309"
          },
          {
            "code": "CAJ-13-10",
            "name": "Uticyacu",
            "ubigeo": "061310"
          },
          {
            "code": "CAJ-13-11",
            "name": "Yauyucan",
            "ubigeo": "061311"
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
        "code": "CAL-01",
        "name": "Callao",
        "districts": [
          {
            "code": "CAL-01-02",
            "name": "Bellavista",
            "ubigeo": "070102"
          },
          {
            "code": "CAL-01-01",
            "name": "Callao",
            "ubigeo": "070101"
          },
          {
            "code": "CAL-01-03",
            "name": "Carmen de La Legua",
            "ubigeo": "070103"
          },
          {
            "code": "CAL-01-04",
            "name": "La Perla",
            "ubigeo": "070104"
          },
          {
            "code": "CAL-01-05",
            "name": "La Punta",
            "ubigeo": "070105"
          },
          {
            "code": "CAL-01-07",
            "name": "Mi Peru",
            "ubigeo": "070107"
          },
          {
            "code": "CAL-01-06",
            "name": "Ventanilla",
            "ubigeo": "070106"
          }
        ]
      }
    ]
  },
  {
    "code": "CUS",
    "name": "Cusco",
    "provinces": [
      {
        "code": "CUS-02",
        "name": "Acomayo",
        "districts": [
          {
            "code": "CUS-02-01",
            "name": "Acomayo",
            "ubigeo": "080201"
          },
          {
            "code": "CUS-02-02",
            "name": "Acopia",
            "ubigeo": "080202"
          },
          {
            "code": "CUS-02-03",
            "name": "Acos",
            "ubigeo": "080203"
          },
          {
            "code": "CUS-02-04",
            "name": "Mosoc Llacta",
            "ubigeo": "080204"
          },
          {
            "code": "CUS-02-05",
            "name": "Pomacanchi",
            "ubigeo": "080205"
          },
          {
            "code": "CUS-02-06",
            "name": "Rondocan",
            "ubigeo": "080206"
          },
          {
            "code": "CUS-02-07",
            "name": "Sangarara",
            "ubigeo": "080207"
          }
        ]
      },
      {
        "code": "CUS-03",
        "name": "Anta",
        "districts": [
          {
            "code": "CUS-03-02",
            "name": "Ancahuasi",
            "ubigeo": "080302"
          },
          {
            "code": "CUS-03-01",
            "name": "Anta",
            "ubigeo": "080301"
          },
          {
            "code": "CUS-03-03",
            "name": "Cachimayo",
            "ubigeo": "080303"
          },
          {
            "code": "CUS-03-04",
            "name": "Chinchaypujio",
            "ubigeo": "080304"
          },
          {
            "code": "CUS-03-05",
            "name": "Huarocondo",
            "ubigeo": "080305"
          },
          {
            "code": "CUS-03-06",
            "name": "Limatambo",
            "ubigeo": "080306"
          },
          {
            "code": "CUS-03-07",
            "name": "Mollepata",
            "ubigeo": "080307"
          },
          {
            "code": "CUS-03-08",
            "name": "Pucyura",
            "ubigeo": "080308"
          },
          {
            "code": "CUS-03-09",
            "name": "Zurite",
            "ubigeo": "080309"
          }
        ]
      },
      {
        "code": "CUS-04",
        "name": "Calca",
        "districts": [
          {
            "code": "CUS-04-01",
            "name": "Calca",
            "ubigeo": "080401"
          },
          {
            "code": "CUS-04-02",
            "name": "Coya",
            "ubigeo": "080402"
          },
          {
            "code": "CUS-04-03",
            "name": "Lamay",
            "ubigeo": "080403"
          },
          {
            "code": "CUS-04-04",
            "name": "Lares",
            "ubigeo": "080404"
          },
          {
            "code": "CUS-04-05",
            "name": "Pisac",
            "ubigeo": "080405"
          },
          {
            "code": "CUS-04-06",
            "name": "San Salvador",
            "ubigeo": "080406"
          },
          {
            "code": "CUS-04-07",
            "name": "Taray",
            "ubigeo": "080407"
          },
          {
            "code": "CUS-04-08",
            "name": "Yanatile",
            "ubigeo": "080408"
          }
        ]
      },
      {
        "code": "CUS-05",
        "name": "Canas",
        "districts": [
          {
            "code": "CUS-05-02",
            "name": "Checca",
            "ubigeo": "080502"
          },
          {
            "code": "CUS-05-03",
            "name": "Kunturkanki",
            "ubigeo": "080503"
          },
          {
            "code": "CUS-05-04",
            "name": "Langui",
            "ubigeo": "080504"
          },
          {
            "code": "CUS-05-05",
            "name": "Layo",
            "ubigeo": "080505"
          },
          {
            "code": "CUS-05-06",
            "name": "Pampamarca",
            "ubigeo": "080506"
          },
          {
            "code": "CUS-05-07",
            "name": "Quehue",
            "ubigeo": "080507"
          },
          {
            "code": "CUS-05-08",
            "name": "Tupac Amaru",
            "ubigeo": "080508"
          },
          {
            "code": "CUS-05-01",
            "name": "Yanaoca",
            "ubigeo": "080501"
          }
        ]
      },
      {
        "code": "CUS-06",
        "name": "Canchis",
        "districts": [
          {
            "code": "CUS-06-02",
            "name": "Checacupe",
            "ubigeo": "080602"
          },
          {
            "code": "CUS-06-03",
            "name": "Combapata",
            "ubigeo": "080603"
          },
          {
            "code": "CUS-06-04",
            "name": "Marangani",
            "ubigeo": "080604"
          },
          {
            "code": "CUS-06-05",
            "name": "Pitumarca",
            "ubigeo": "080605"
          },
          {
            "code": "CUS-06-06",
            "name": "San Pablo",
            "ubigeo": "080606"
          },
          {
            "code": "CUS-06-07",
            "name": "San Pedro",
            "ubigeo": "080607"
          },
          {
            "code": "CUS-06-01",
            "name": "Sicuani",
            "ubigeo": "080601"
          },
          {
            "code": "CUS-06-08",
            "name": "Tinta",
            "ubigeo": "080608"
          }
        ]
      },
      {
        "code": "CUS-07",
        "name": "Chumbivilcas",
        "districts": [
          {
            "code": "CUS-07-02",
            "name": "Capacmarca",
            "ubigeo": "080702"
          },
          {
            "code": "CUS-07-03",
            "name": "Chamaca",
            "ubigeo": "080703"
          },
          {
            "code": "CUS-07-04",
            "name": "Colquemarca",
            "ubigeo": "080704"
          },
          {
            "code": "CUS-07-05",
            "name": "Livitaca",
            "ubigeo": "080705"
          },
          {
            "code": "CUS-07-06",
            "name": "Llusco",
            "ubigeo": "080706"
          },
          {
            "code": "CUS-07-07",
            "name": "Quiñota",
            "ubigeo": "080707"
          },
          {
            "code": "CUS-07-01",
            "name": "Santo Tomas",
            "ubigeo": "080701"
          },
          {
            "code": "CUS-07-08",
            "name": "Velille",
            "ubigeo": "080708"
          }
        ]
      },
      {
        "code": "CUS-01",
        "name": "Cusco",
        "districts": [
          {
            "code": "CUS-01-02",
            "name": "Ccorca",
            "ubigeo": "080102"
          },
          {
            "code": "CUS-01-01",
            "name": "Cusco",
            "ubigeo": "080101"
          },
          {
            "code": "CUS-01-03",
            "name": "Poroy",
            "ubigeo": "080103"
          },
          {
            "code": "CUS-01-04",
            "name": "San Jeronimo",
            "ubigeo": "080104"
          },
          {
            "code": "CUS-01-05",
            "name": "San Sebastian",
            "ubigeo": "080105"
          },
          {
            "code": "CUS-01-06",
            "name": "Santiago",
            "ubigeo": "080106"
          },
          {
            "code": "CUS-01-07",
            "name": "Saylla",
            "ubigeo": "080107"
          },
          {
            "code": "CUS-01-08",
            "name": "Wanchaq",
            "ubigeo": "080108"
          }
        ]
      },
      {
        "code": "CUS-08",
        "name": "Espinar",
        "districts": [
          {
            "code": "CUS-08-08",
            "name": "Alto Pichigua",
            "ubigeo": "080808"
          },
          {
            "code": "CUS-08-02",
            "name": "Condoroma",
            "ubigeo": "080802"
          },
          {
            "code": "CUS-08-03",
            "name": "Coporaque",
            "ubigeo": "080803"
          },
          {
            "code": "CUS-08-01",
            "name": "Espinar",
            "ubigeo": "080801"
          },
          {
            "code": "CUS-08-04",
            "name": "Ocoruro",
            "ubigeo": "080804"
          },
          {
            "code": "CUS-08-05",
            "name": "Pallpata",
            "ubigeo": "080805"
          },
          {
            "code": "CUS-08-06",
            "name": "Pichigua",
            "ubigeo": "080806"
          },
          {
            "code": "CUS-08-07",
            "name": "Suyckutambo",
            "ubigeo": "080807"
          }
        ]
      },
      {
        "code": "CUS-09",
        "name": "La Convencion",
        "districts": [
          {
            "code": "CUS-09-02",
            "name": "Echarate",
            "ubigeo": "080902"
          },
          {
            "code": "CUS-09-03",
            "name": "Huayopata",
            "ubigeo": "080903"
          },
          {
            "code": "CUS-09-11",
            "name": "Inkawasi",
            "ubigeo": "080911"
          },
          {
            "code": "CUS-09-07",
            "name": "Kimbiri",
            "ubigeo": "080907"
          },
          {
            "code": "CUS-09-04",
            "name": "Maranura",
            "ubigeo": "080904"
          },
          {
            "code": "CUS-09-14",
            "name": "Megantoni",
            "ubigeo": "080914"
          },
          {
            "code": "CUS-09-05",
            "name": "Ocobamba",
            "ubigeo": "080905"
          },
          {
            "code": "CUS-09-10",
            "name": "Pichari",
            "ubigeo": "080910"
          },
          {
            "code": "CUS-09-06",
            "name": "Quellouno",
            "ubigeo": "080906"
          },
          {
            "code": "CUS-09-01",
            "name": "Santa Ana",
            "ubigeo": "080901"
          },
          {
            "code": "CUS-09-08",
            "name": "Santa Teresa",
            "ubigeo": "080908"
          },
          {
            "code": "CUS-09-09",
            "name": "Vilcabamba",
            "ubigeo": "080909"
          },
          {
            "code": "CUS-09-13",
            "name": "Villa Kintiarina",
            "ubigeo": "080913"
          },
          {
            "code": "CUS-09-12",
            "name": "Villa Virgen",
            "ubigeo": "080912"
          }
        ]
      },
      {
        "code": "CUS-10",
        "name": "Paruro",
        "districts": [
          {
            "code": "CUS-10-02",
            "name": "Accha",
            "ubigeo": "081002"
          },
          {
            "code": "CUS-10-03",
            "name": "Ccapi",
            "ubigeo": "081003"
          },
          {
            "code": "CUS-10-04",
            "name": "Colcha",
            "ubigeo": "081004"
          },
          {
            "code": "CUS-10-05",
            "name": "Huanoquite",
            "ubigeo": "081005"
          },
          {
            "code": "CUS-10-06",
            "name": "Omacha",
            "ubigeo": "081006"
          },
          {
            "code": "CUS-10-07",
            "name": "Paccaritambo",
            "ubigeo": "081007"
          },
          {
            "code": "CUS-10-01",
            "name": "Paruro",
            "ubigeo": "081001"
          },
          {
            "code": "CUS-10-08",
            "name": "Pillpinto",
            "ubigeo": "081008"
          },
          {
            "code": "CUS-10-09",
            "name": "Yaurisque",
            "ubigeo": "081009"
          }
        ]
      },
      {
        "code": "CUS-11",
        "name": "Paucartambo",
        "districts": [
          {
            "code": "CUS-11-02",
            "name": "Caicay",
            "ubigeo": "081102"
          },
          {
            "code": "CUS-11-03",
            "name": "Challabamba",
            "ubigeo": "081103"
          },
          {
            "code": "CUS-11-04",
            "name": "Colquepata",
            "ubigeo": "081104"
          },
          {
            "code": "CUS-11-05",
            "name": "Huancarani",
            "ubigeo": "081105"
          },
          {
            "code": "CUS-11-06",
            "name": "Kosñipata",
            "ubigeo": "081106"
          },
          {
            "code": "CUS-11-01",
            "name": "Paucartambo",
            "ubigeo": "081101"
          }
        ]
      },
      {
        "code": "CUS-12",
        "name": "Quispicanchi",
        "districts": [
          {
            "code": "CUS-12-02",
            "name": "Andahuaylillas",
            "ubigeo": "081202"
          },
          {
            "code": "CUS-12-03",
            "name": "Camanti",
            "ubigeo": "081203"
          },
          {
            "code": "CUS-12-04",
            "name": "Ccarhuayo",
            "ubigeo": "081204"
          },
          {
            "code": "CUS-12-05",
            "name": "Ccatca",
            "ubigeo": "081205"
          },
          {
            "code": "CUS-12-06",
            "name": "Cusipata",
            "ubigeo": "081206"
          },
          {
            "code": "CUS-12-07",
            "name": "Huaro",
            "ubigeo": "081207"
          },
          {
            "code": "CUS-12-08",
            "name": "Lucre",
            "ubigeo": "081208"
          },
          {
            "code": "CUS-12-09",
            "name": "Marcapata",
            "ubigeo": "081209"
          },
          {
            "code": "CUS-12-10",
            "name": "Ocongate",
            "ubigeo": "081210"
          },
          {
            "code": "CUS-12-11",
            "name": "Oropesa",
            "ubigeo": "081211"
          },
          {
            "code": "CUS-12-12",
            "name": "Quiquijana",
            "ubigeo": "081212"
          },
          {
            "code": "CUS-12-01",
            "name": "Urcos",
            "ubigeo": "081201"
          }
        ]
      },
      {
        "code": "CUS-13",
        "name": "Urubamba",
        "districts": [
          {
            "code": "CUS-13-02",
            "name": "Chinchero",
            "ubigeo": "081302"
          },
          {
            "code": "CUS-13-03",
            "name": "Huayllabamba",
            "ubigeo": "081303"
          },
          {
            "code": "CUS-13-04",
            "name": "Machupicchu",
            "ubigeo": "081304"
          },
          {
            "code": "CUS-13-05",
            "name": "Maras",
            "ubigeo": "081305"
          },
          {
            "code": "CUS-13-06",
            "name": "Ollantaytambo",
            "ubigeo": "081306"
          },
          {
            "code": "CUS-13-01",
            "name": "Urubamba",
            "ubigeo": "081301"
          },
          {
            "code": "CUS-13-07",
            "name": "Yucay",
            "ubigeo": "081307"
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
        "code": "HUA-02",
        "name": "Acobamba",
        "districts": [
          {
            "code": "HUA-02-01",
            "name": "Acobamba",
            "ubigeo": "090201"
          },
          {
            "code": "HUA-02-02",
            "name": "Andabamba",
            "ubigeo": "090202"
          },
          {
            "code": "HUA-02-03",
            "name": "Anta",
            "ubigeo": "090203"
          },
          {
            "code": "HUA-02-04",
            "name": "Caja",
            "ubigeo": "090204"
          },
          {
            "code": "HUA-02-05",
            "name": "Marcas",
            "ubigeo": "090205"
          },
          {
            "code": "HUA-02-06",
            "name": "Paucara",
            "ubigeo": "090206"
          },
          {
            "code": "HUA-02-07",
            "name": "Pomacocha",
            "ubigeo": "090207"
          },
          {
            "code": "HUA-02-08",
            "name": "Rosario",
            "ubigeo": "090208"
          }
        ]
      },
      {
        "code": "HUA-02",
        "name": "Ambo",
        "districts": [
          {
            "code": "HUA-02-01",
            "name": "Ambo",
            "ubigeo": "100201"
          },
          {
            "code": "HUA-02-02",
            "name": "Cayna",
            "ubigeo": "100202"
          },
          {
            "code": "HUA-02-03",
            "name": "Colpas",
            "ubigeo": "100203"
          },
          {
            "code": "HUA-02-04",
            "name": "Conchamarca",
            "ubigeo": "100204"
          },
          {
            "code": "HUA-02-05",
            "name": "Huacar",
            "ubigeo": "100205"
          },
          {
            "code": "HUA-02-06",
            "name": "San Francisco",
            "ubigeo": "100206"
          },
          {
            "code": "HUA-02-07",
            "name": "San Rafael",
            "ubigeo": "100207"
          },
          {
            "code": "HUA-02-08",
            "name": "Tomay Kichwa",
            "ubigeo": "100208"
          }
        ]
      },
      {
        "code": "HUA-03",
        "name": "Angaraes",
        "districts": [
          {
            "code": "HUA-03-02",
            "name": "Anchonga",
            "ubigeo": "090302"
          },
          {
            "code": "HUA-03-03",
            "name": "Callanmarca",
            "ubigeo": "090303"
          },
          {
            "code": "HUA-03-04",
            "name": "Ccochaccasa",
            "ubigeo": "090304"
          },
          {
            "code": "HUA-03-05",
            "name": "Chincho",
            "ubigeo": "090305"
          },
          {
            "code": "HUA-03-06",
            "name": "Congalla",
            "ubigeo": "090306"
          },
          {
            "code": "HUA-03-07",
            "name": "Huanca-Huanca",
            "ubigeo": "090307"
          },
          {
            "code": "HUA-03-08",
            "name": "Huayllay Grande",
            "ubigeo": "090308"
          },
          {
            "code": "HUA-03-09",
            "name": "Julcamarca",
            "ubigeo": "090309"
          },
          {
            "code": "HUA-03-01",
            "name": "Lircay",
            "ubigeo": "090301"
          },
          {
            "code": "HUA-03-10",
            "name": "San Antonio de Antaparco",
            "ubigeo": "090310"
          },
          {
            "code": "HUA-03-11",
            "name": "Santo Tomas de Pata",
            "ubigeo": "090311"
          },
          {
            "code": "HUA-03-12",
            "name": "Secclla",
            "ubigeo": "090312"
          }
        ]
      },
      {
        "code": "HUA-04",
        "name": "Castrovirreyna",
        "districts": [
          {
            "code": "HUA-04-02",
            "name": "Arma",
            "ubigeo": "090402"
          },
          {
            "code": "HUA-04-03",
            "name": "Aurahua",
            "ubigeo": "090403"
          },
          {
            "code": "HUA-04-04",
            "name": "Capillas",
            "ubigeo": "090404"
          },
          {
            "code": "HUA-04-01",
            "name": "Castrovirreyna",
            "ubigeo": "090401"
          },
          {
            "code": "HUA-04-05",
            "name": "Chupamarca",
            "ubigeo": "090405"
          },
          {
            "code": "HUA-04-06",
            "name": "Cocas",
            "ubigeo": "090406"
          },
          {
            "code": "HUA-04-07",
            "name": "Huachos",
            "ubigeo": "090407"
          },
          {
            "code": "HUA-04-08",
            "name": "Huamatambo",
            "ubigeo": "090408"
          },
          {
            "code": "HUA-04-09",
            "name": "Mollepampa",
            "ubigeo": "090409"
          },
          {
            "code": "HUA-04-10",
            "name": "San Juan",
            "ubigeo": "090410"
          },
          {
            "code": "HUA-04-11",
            "name": "Santa Ana",
            "ubigeo": "090411"
          },
          {
            "code": "HUA-04-12",
            "name": "Tantara",
            "ubigeo": "090412"
          },
          {
            "code": "HUA-04-13",
            "name": "Ticrapo",
            "ubigeo": "090413"
          }
        ]
      },
      {
        "code": "HUA-05",
        "name": "Churcampa",
        "districts": [
          {
            "code": "HUA-05-02",
            "name": "Anco",
            "ubigeo": "090502"
          },
          {
            "code": "HUA-05-03",
            "name": "Chinchihuasi",
            "ubigeo": "090503"
          },
          {
            "code": "HUA-05-01",
            "name": "Churcampa",
            "ubigeo": "090501"
          },
          {
            "code": "HUA-05-11",
            "name": "Cosme",
            "ubigeo": "090511"
          },
          {
            "code": "HUA-05-04",
            "name": "El Carmen",
            "ubigeo": "090504"
          },
          {
            "code": "HUA-05-05",
            "name": "La Merced",
            "ubigeo": "090505"
          },
          {
            "code": "HUA-05-06",
            "name": "Locroja",
            "ubigeo": "090506"
          },
          {
            "code": "HUA-05-10",
            "name": "Pachamarca",
            "ubigeo": "090510"
          },
          {
            "code": "HUA-05-07",
            "name": "Paucarbamba",
            "ubigeo": "090507"
          },
          {
            "code": "HUA-05-08",
            "name": "San Miguel de Mayocc",
            "ubigeo": "090508"
          },
          {
            "code": "HUA-05-09",
            "name": "San Pedro de Coris",
            "ubigeo": "090509"
          }
        ]
      },
      {
        "code": "HUA-03",
        "name": "Dos de Mayo",
        "districts": [
          {
            "code": "HUA-03-07",
            "name": "Chuquis",
            "ubigeo": "100307"
          },
          {
            "code": "HUA-03-01",
            "name": "La Union",
            "ubigeo": "100301"
          },
          {
            "code": "HUA-03-11",
            "name": "Marias",
            "ubigeo": "100311"
          },
          {
            "code": "HUA-03-13",
            "name": "Pachas",
            "ubigeo": "100313"
          },
          {
            "code": "HUA-03-16",
            "name": "Quivilla",
            "ubigeo": "100316"
          },
          {
            "code": "HUA-03-17",
            "name": "Ripan",
            "ubigeo": "100317"
          },
          {
            "code": "HUA-03-21",
            "name": "Shunqui",
            "ubigeo": "100321"
          },
          {
            "code": "HUA-03-22",
            "name": "Sillapata",
            "ubigeo": "100322"
          },
          {
            "code": "HUA-03-23",
            "name": "Yanas",
            "ubigeo": "100323"
          }
        ]
      },
      {
        "code": "HUA-04",
        "name": "Huacaybamba",
        "districts": [
          {
            "code": "HUA-04-02",
            "name": "Canchabamba",
            "ubigeo": "100402"
          },
          {
            "code": "HUA-04-03",
            "name": "Cochabamba",
            "ubigeo": "100403"
          },
          {
            "code": "HUA-04-01",
            "name": "Huacaybamba",
            "ubigeo": "100401"
          },
          {
            "code": "HUA-04-04",
            "name": "Pinra",
            "ubigeo": "100404"
          }
        ]
      },
      {
        "code": "HUA-05",
        "name": "Huamalies",
        "districts": [
          {
            "code": "HUA-05-02",
            "name": "Arancay",
            "ubigeo": "100502"
          },
          {
            "code": "HUA-05-03",
            "name": "Chavin de Pariarca",
            "ubigeo": "100503"
          },
          {
            "code": "HUA-05-04",
            "name": "Jacas Grande",
            "ubigeo": "100504"
          },
          {
            "code": "HUA-05-05",
            "name": "Jircan",
            "ubigeo": "100505"
          },
          {
            "code": "HUA-05-01",
            "name": "Llata",
            "ubigeo": "100501"
          },
          {
            "code": "HUA-05-06",
            "name": "Miraflores",
            "ubigeo": "100506"
          },
          {
            "code": "HUA-05-07",
            "name": "Monzon",
            "ubigeo": "100507"
          },
          {
            "code": "HUA-05-08",
            "name": "Punchao",
            "ubigeo": "100508"
          },
          {
            "code": "HUA-05-09",
            "name": "Puños",
            "ubigeo": "100509"
          },
          {
            "code": "HUA-05-10",
            "name": "Singa",
            "ubigeo": "100510"
          },
          {
            "code": "HUA-05-11",
            "name": "Tantamayo",
            "ubigeo": "100511"
          }
        ]
      },
      {
        "code": "HUA-01",
        "name": "Huancavelica",
        "districts": [
          {
            "code": "HUA-01-02",
            "name": "Acobambilla",
            "ubigeo": "090102"
          },
          {
            "code": "HUA-01-03",
            "name": "Acoria",
            "ubigeo": "090103"
          },
          {
            "code": "HUA-01-18",
            "name": "Ascension",
            "ubigeo": "090118"
          },
          {
            "code": "HUA-01-04",
            "name": "Conayca",
            "ubigeo": "090104"
          },
          {
            "code": "HUA-01-05",
            "name": "Cuenca",
            "ubigeo": "090105"
          },
          {
            "code": "HUA-01-06",
            "name": "Huachocolpa",
            "ubigeo": "090106"
          },
          {
            "code": "HUA-01-01",
            "name": "Huancavelica",
            "ubigeo": "090101"
          },
          {
            "code": "HUA-01-19",
            "name": "Huando",
            "ubigeo": "090119"
          },
          {
            "code": "HUA-01-07",
            "name": "Huayllahuara",
            "ubigeo": "090107"
          },
          {
            "code": "HUA-01-08",
            "name": "Izcuchaca",
            "ubigeo": "090108"
          },
          {
            "code": "HUA-01-09",
            "name": "Laria",
            "ubigeo": "090109"
          },
          {
            "code": "HUA-01-10",
            "name": "Manta",
            "ubigeo": "090110"
          },
          {
            "code": "HUA-01-11",
            "name": "Mariscal Caceres",
            "ubigeo": "090111"
          },
          {
            "code": "HUA-01-12",
            "name": "Moya",
            "ubigeo": "090112"
          },
          {
            "code": "HUA-01-13",
            "name": "Nuevo Occoro",
            "ubigeo": "090113"
          },
          {
            "code": "HUA-01-14",
            "name": "Palca",
            "ubigeo": "090114"
          },
          {
            "code": "HUA-01-15",
            "name": "Pilchaca",
            "ubigeo": "090115"
          },
          {
            "code": "HUA-01-16",
            "name": "Vilca",
            "ubigeo": "090116"
          },
          {
            "code": "HUA-01-17",
            "name": "Yauli",
            "ubigeo": "090117"
          }
        ]
      },
      {
        "code": "HUA-01",
        "name": "Huanuco",
        "districts": [
          {
            "code": "HUA-01-02",
            "name": "Amarilis",
            "ubigeo": "100102"
          },
          {
            "code": "HUA-01-03",
            "name": "Chinchao",
            "ubigeo": "100103"
          },
          {
            "code": "HUA-01-04",
            "name": "Churubamba",
            "ubigeo": "100104"
          },
          {
            "code": "HUA-01-01",
            "name": "Huanuco",
            "ubigeo": "100101"
          },
          {
            "code": "HUA-01-05",
            "name": "Margos",
            "ubigeo": "100105"
          },
          {
            "code": "HUA-01-11",
            "name": "Pillco Marca",
            "ubigeo": "100111"
          },
          {
            "code": "HUA-01-06",
            "name": "Quisqui",
            "ubigeo": "100106"
          },
          {
            "code": "HUA-01-07",
            "name": "San Francisco de Cayran",
            "ubigeo": "100107"
          },
          {
            "code": "HUA-01-13",
            "name": "San Pablo de Pillao",
            "ubigeo": "100113"
          },
          {
            "code": "HUA-01-08",
            "name": "San Pedro de Chaulan",
            "ubigeo": "100108"
          },
          {
            "code": "HUA-01-09",
            "name": "Santa Maria del Valle",
            "ubigeo": "100109"
          },
          {
            "code": "HUA-01-12",
            "name": "Yacus",
            "ubigeo": "100112"
          },
          {
            "code": "HUA-01-10",
            "name": "Yarumayo",
            "ubigeo": "100110"
          }
        ]
      },
      {
        "code": "HUA-06",
        "name": "Huaytara",
        "districts": [
          {
            "code": "HUA-06-02",
            "name": "Ayavi",
            "ubigeo": "090602"
          },
          {
            "code": "HUA-06-03",
            "name": "Cordova",
            "ubigeo": "090603"
          },
          {
            "code": "HUA-06-04",
            "name": "Huayacundo Arma",
            "ubigeo": "090604"
          },
          {
            "code": "HUA-06-01",
            "name": "Huaytara",
            "ubigeo": "090601"
          },
          {
            "code": "HUA-06-05",
            "name": "Laramarca",
            "ubigeo": "090605"
          },
          {
            "code": "HUA-06-06",
            "name": "Ocoyo",
            "ubigeo": "090606"
          },
          {
            "code": "HUA-06-07",
            "name": "Pilpichaca",
            "ubigeo": "090607"
          },
          {
            "code": "HUA-06-08",
            "name": "Querco",
            "ubigeo": "090608"
          },
          {
            "code": "HUA-06-09",
            "name": "Quito-Arma",
            "ubigeo": "090609"
          },
          {
            "code": "HUA-06-10",
            "name": "San Antonio de Cusicancha",
            "ubigeo": "090610"
          },
          {
            "code": "HUA-06-11",
            "name": "San Francisco de Sangayaico",
            "ubigeo": "090611"
          },
          {
            "code": "HUA-06-12",
            "name": "San Isidro",
            "ubigeo": "090612"
          },
          {
            "code": "HUA-06-13",
            "name": "Santiago de Chocorvos",
            "ubigeo": "090613"
          },
          {
            "code": "HUA-06-14",
            "name": "Santiago de Quirahuara",
            "ubigeo": "090614"
          },
          {
            "code": "HUA-06-15",
            "name": "Santo Domingo de Capillas",
            "ubigeo": "090615"
          },
          {
            "code": "HUA-06-16",
            "name": "Tambo",
            "ubigeo": "090616"
          }
        ]
      },
      {
        "code": "HUA-10",
        "name": "Lauricocha",
        "districts": [
          {
            "code": "HUA-10-02",
            "name": "Baños",
            "ubigeo": "101002"
          },
          {
            "code": "HUA-10-01",
            "name": "Jesus",
            "ubigeo": "101001"
          },
          {
            "code": "HUA-10-03",
            "name": "Jivia",
            "ubigeo": "101003"
          },
          {
            "code": "HUA-10-04",
            "name": "Queropalca",
            "ubigeo": "101004"
          },
          {
            "code": "HUA-10-05",
            "name": "Rondos",
            "ubigeo": "101005"
          },
          {
            "code": "HUA-10-06",
            "name": "San Francisco de Asis",
            "ubigeo": "101006"
          },
          {
            "code": "HUA-10-07",
            "name": "San Miguel de Cauri",
            "ubigeo": "101007"
          }
        ]
      },
      {
        "code": "HUA-06",
        "name": "Leoncio Prado",
        "districts": [
          {
            "code": "HUA-06-08",
            "name": "Castillo Grande",
            "ubigeo": "100608"
          },
          {
            "code": "HUA-06-02",
            "name": "Daniel Alomias Robles",
            "ubigeo": "100602"
          },
          {
            "code": "HUA-06-03",
            "name": "Hermilio Valdizan",
            "ubigeo": "100603"
          },
          {
            "code": "HUA-06-04",
            "name": "Jose Crespo y Castillo",
            "ubigeo": "100604"
          },
          {
            "code": "HUA-06-05",
            "name": "Luyando",
            "ubigeo": "100605"
          },
          {
            "code": "HUA-06-06",
            "name": "Mariano Damaso Beraun",
            "ubigeo": "100606"
          },
          {
            "code": "HUA-06-07",
            "name": "Pucayacu",
            "ubigeo": "100607"
          },
          {
            "code": "HUA-06-09",
            "name": "Pueblo Nuevo",
            "ubigeo": "100609"
          },
          {
            "code": "HUA-06-01",
            "name": "Rupa-Rupa",
            "ubigeo": "100601"
          },
          {
            "code": "HUA-06-10",
            "name": "Santo Domingo de Anda",
            "ubigeo": "100610"
          }
        ]
      },
      {
        "code": "HUA-07",
        "name": "Marañon",
        "districts": [
          {
            "code": "HUA-07-02",
            "name": "Cholon",
            "ubigeo": "100702"
          },
          {
            "code": "HUA-07-01",
            "name": "Huacrachuco",
            "ubigeo": "100701"
          },
          {
            "code": "HUA-07-04",
            "name": "La Morada",
            "ubigeo": "100704"
          },
          {
            "code": "HUA-07-03",
            "name": "San Buenaventura",
            "ubigeo": "100703"
          },
          {
            "code": "HUA-07-05",
            "name": "Santa Rosa de Alto Yanajanca",
            "ubigeo": "100705"
          }
        ]
      },
      {
        "code": "HUA-08",
        "name": "Pachitea",
        "districts": [
          {
            "code": "HUA-08-02",
            "name": "Chaglla",
            "ubigeo": "100802"
          },
          {
            "code": "HUA-08-03",
            "name": "Molino",
            "ubigeo": "100803"
          },
          {
            "code": "HUA-08-01",
            "name": "Panao",
            "ubigeo": "100801"
          },
          {
            "code": "HUA-08-04",
            "name": "Umari",
            "ubigeo": "100804"
          }
        ]
      },
      {
        "code": "HUA-09",
        "name": "Puerto Inca",
        "districts": [
          {
            "code": "HUA-09-02",
            "name": "Codo del Pozuzo",
            "ubigeo": "100902"
          },
          {
            "code": "HUA-09-03",
            "name": "Honoria",
            "ubigeo": "100903"
          },
          {
            "code": "HUA-09-01",
            "name": "Puerto Inca",
            "ubigeo": "100901"
          },
          {
            "code": "HUA-09-04",
            "name": "Tournavista",
            "ubigeo": "100904"
          },
          {
            "code": "HUA-09-05",
            "name": "Yuyapichis",
            "ubigeo": "100905"
          }
        ]
      },
      {
        "code": "HUA-07",
        "name": "Tayacaja",
        "districts": [
          {
            "code": "HUA-07-02",
            "name": "Acostambo",
            "ubigeo": "090702"
          },
          {
            "code": "HUA-07-03",
            "name": "Acraquia",
            "ubigeo": "090703"
          },
          {
            "code": "HUA-07-04",
            "name": "Ahuaycha",
            "ubigeo": "090704"
          },
          {
            "code": "HUA-07-20",
            "name": "Andaymarca",
            "ubigeo": "090720"
          },
          {
            "code": "HUA-07-05",
            "name": "Colcabamba",
            "ubigeo": "090705"
          },
          {
            "code": "HUA-07-06",
            "name": "Daniel Hernandez",
            "ubigeo": "090706"
          },
          {
            "code": "HUA-07-07",
            "name": "Huachocolpa",
            "ubigeo": "090707"
          },
          {
            "code": "HUA-07-09",
            "name": "Huaribamba",
            "ubigeo": "090709"
          },
          {
            "code": "HUA-07-01",
            "name": "Pampas",
            "ubigeo": "090701"
          },
          {
            "code": "HUA-07-11",
            "name": "Pazos",
            "ubigeo": "090711"
          },
          {
            "code": "HUA-07-22",
            "name": "Pichos",
            "ubigeo": "090722"
          },
          {
            "code": "HUA-07-19",
            "name": "Quichuas",
            "ubigeo": "090719"
          },
          {
            "code": "HUA-07-13",
            "name": "Quishuar",
            "ubigeo": "090713"
          },
          {
            "code": "HUA-07-21",
            "name": "Roble",
            "ubigeo": "090721"
          },
          {
            "code": "HUA-07-14",
            "name": "Salcabamba",
            "ubigeo": "090714"
          },
          {
            "code": "HUA-07-15",
            "name": "Salcahuasi",
            "ubigeo": "090715"
          },
          {
            "code": "HUA-07-16",
            "name": "San Marcos de Rocchac",
            "ubigeo": "090716"
          },
          {
            "code": "HUA-07-23",
            "name": "Santiago de Túcuma",
            "ubigeo": "090723"
          },
          {
            "code": "HUA-07-17",
            "name": "Surcubamba",
            "ubigeo": "090717"
          },
          {
            "code": "HUA-07-18",
            "name": "Tintay Puncu",
            "ubigeo": "090718"
          },
          {
            "code": "HUA-07-10",
            "name": "Ñahuimpuquio",
            "ubigeo": "090710"
          }
        ]
      },
      {
        "code": "HUA-11",
        "name": "Yarowilca",
        "districts": [
          {
            "code": "HUA-11-04",
            "name": "Aparicio Pomares",
            "ubigeo": "101104"
          },
          {
            "code": "HUA-11-02",
            "name": "Cahuac",
            "ubigeo": "101102"
          },
          {
            "code": "HUA-11-03",
            "name": "Chacabamba",
            "ubigeo": "101103"
          },
          {
            "code": "HUA-11-01",
            "name": "Chavinillo",
            "ubigeo": "101101"
          },
          {
            "code": "HUA-11-08",
            "name": "Choras",
            "ubigeo": "101108"
          },
          {
            "code": "HUA-11-05",
            "name": "Jacas Chico",
            "ubigeo": "101105"
          },
          {
            "code": "HUA-11-06",
            "name": "Obas",
            "ubigeo": "101106"
          },
          {
            "code": "HUA-11-07",
            "name": "Pampamarca",
            "ubigeo": "101107"
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
        "code": "ICA-02",
        "name": "Chincha",
        "districts": [
          {
            "code": "ICA-02-02",
            "name": "Alto Laran",
            "ubigeo": "110202"
          },
          {
            "code": "ICA-02-03",
            "name": "Chavin",
            "ubigeo": "110203"
          },
          {
            "code": "ICA-02-01",
            "name": "Chincha Alta",
            "ubigeo": "110201"
          },
          {
            "code": "ICA-02-04",
            "name": "Chincha Baja",
            "ubigeo": "110204"
          },
          {
            "code": "ICA-02-05",
            "name": "El Carmen",
            "ubigeo": "110205"
          },
          {
            "code": "ICA-02-06",
            "name": "Grocio Prado",
            "ubigeo": "110206"
          },
          {
            "code": "ICA-02-07",
            "name": "Pueblo Nuevo",
            "ubigeo": "110207"
          },
          {
            "code": "ICA-02-08",
            "name": "San Juan de Yanac",
            "ubigeo": "110208"
          },
          {
            "code": "ICA-02-09",
            "name": "San Pedro de Huacarpana",
            "ubigeo": "110209"
          },
          {
            "code": "ICA-02-10",
            "name": "Sunampe",
            "ubigeo": "110210"
          },
          {
            "code": "ICA-02-11",
            "name": "Tambo de Mora",
            "ubigeo": "110211"
          }
        ]
      },
      {
        "code": "ICA-01",
        "name": "Ica",
        "districts": [
          {
            "code": "ICA-01-01",
            "name": "Ica",
            "ubigeo": "110101"
          },
          {
            "code": "ICA-01-02",
            "name": "La Tinguiña",
            "ubigeo": "110102"
          },
          {
            "code": "ICA-01-03",
            "name": "Los Aquijes",
            "ubigeo": "110103"
          },
          {
            "code": "ICA-01-04",
            "name": "Ocucaje",
            "ubigeo": "110104"
          },
          {
            "code": "ICA-01-05",
            "name": "Pachacutec",
            "ubigeo": "110105"
          },
          {
            "code": "ICA-01-06",
            "name": "Parcona",
            "ubigeo": "110106"
          },
          {
            "code": "ICA-01-07",
            "name": "Pueblo Nuevo",
            "ubigeo": "110107"
          },
          {
            "code": "ICA-01-08",
            "name": "Salas",
            "ubigeo": "110108"
          },
          {
            "code": "ICA-01-09",
            "name": "San Jose de los Molinos",
            "ubigeo": "110109"
          },
          {
            "code": "ICA-01-10",
            "name": "San Juan Bautista",
            "ubigeo": "110110"
          },
          {
            "code": "ICA-01-11",
            "name": "Santiago",
            "ubigeo": "110111"
          },
          {
            "code": "ICA-01-12",
            "name": "Subtanjalla",
            "ubigeo": "110112"
          },
          {
            "code": "ICA-01-13",
            "name": "Tate",
            "ubigeo": "110113"
          },
          {
            "code": "ICA-01-14",
            "name": "Yauca del Rosario",
            "ubigeo": "110114"
          }
        ]
      },
      {
        "code": "ICA-03",
        "name": "Nazca",
        "districts": [
          {
            "code": "ICA-03-02",
            "name": "Changuillo",
            "ubigeo": "110302"
          },
          {
            "code": "ICA-03-03",
            "name": "El Ingenio",
            "ubigeo": "110303"
          },
          {
            "code": "ICA-03-04",
            "name": "Marcona",
            "ubigeo": "110304"
          },
          {
            "code": "ICA-03-01",
            "name": "Nazca",
            "ubigeo": "110301"
          },
          {
            "code": "ICA-03-05",
            "name": "Vista Alegre",
            "ubigeo": "110305"
          }
        ]
      },
      {
        "code": "ICA-04",
        "name": "Palpa",
        "districts": [
          {
            "code": "ICA-04-02",
            "name": "Llipata",
            "ubigeo": "110402"
          },
          {
            "code": "ICA-04-01",
            "name": "Palpa",
            "ubigeo": "110401"
          },
          {
            "code": "ICA-04-03",
            "name": "Rio Grande",
            "ubigeo": "110403"
          },
          {
            "code": "ICA-04-04",
            "name": "Santa Cruz",
            "ubigeo": "110404"
          },
          {
            "code": "ICA-04-05",
            "name": "Tibillo",
            "ubigeo": "110405"
          }
        ]
      },
      {
        "code": "ICA-05",
        "name": "Pisco",
        "districts": [
          {
            "code": "ICA-05-02",
            "name": "Huancano",
            "ubigeo": "110502"
          },
          {
            "code": "ICA-05-03",
            "name": "Humay",
            "ubigeo": "110503"
          },
          {
            "code": "ICA-05-04",
            "name": "Independencia",
            "ubigeo": "110504"
          },
          {
            "code": "ICA-05-05",
            "name": "Paracas",
            "ubigeo": "110505"
          },
          {
            "code": "ICA-05-01",
            "name": "Pisco",
            "ubigeo": "110501"
          },
          {
            "code": "ICA-05-06",
            "name": "San Andres",
            "ubigeo": "110506"
          },
          {
            "code": "ICA-05-07",
            "name": "San Clemente",
            "ubigeo": "110507"
          },
          {
            "code": "ICA-05-08",
            "name": "Tupac Amaru Inca",
            "ubigeo": "110508"
          }
        ]
      }
    ]
  },
  {
    "code": "JUN",
    "name": "Junin",
    "provinces": [
      {
        "code": "JUN-03",
        "name": "Chanchamayo",
        "districts": [
          {
            "code": "JUN-03-01",
            "name": "Chanchamayo",
            "ubigeo": "120301"
          },
          {
            "code": "JUN-03-02",
            "name": "Perene",
            "ubigeo": "120302"
          },
          {
            "code": "JUN-03-03",
            "name": "Pichanaqui",
            "ubigeo": "120303"
          },
          {
            "code": "JUN-03-04",
            "name": "San Luis de Shuaro",
            "ubigeo": "120304"
          },
          {
            "code": "JUN-03-05",
            "name": "San Ramon",
            "ubigeo": "120305"
          },
          {
            "code": "JUN-03-06",
            "name": "Vitoc",
            "ubigeo": "120306"
          }
        ]
      },
      {
        "code": "JUN-09",
        "name": "Chupaca",
        "districts": [
          {
            "code": "JUN-09-02",
            "name": "Ahuac",
            "ubigeo": "120902"
          },
          {
            "code": "JUN-09-03",
            "name": "Chongos Bajo",
            "ubigeo": "120903"
          },
          {
            "code": "JUN-09-01",
            "name": "Chupaca",
            "ubigeo": "120901"
          },
          {
            "code": "JUN-09-04",
            "name": "Huachac",
            "ubigeo": "120904"
          },
          {
            "code": "JUN-09-05",
            "name": "Huamancaca Chico",
            "ubigeo": "120905"
          },
          {
            "code": "JUN-09-07",
            "name": "San Juan de Jarpa",
            "ubigeo": "120907"
          },
          {
            "code": "JUN-09-06",
            "name": "San Juan de Yscos",
            "ubigeo": "120906"
          },
          {
            "code": "JUN-09-08",
            "name": "Tres de Diciembre",
            "ubigeo": "120908"
          },
          {
            "code": "JUN-09-09",
            "name": "Yanacancha",
            "ubigeo": "120909"
          }
        ]
      },
      {
        "code": "JUN-02",
        "name": "Concepcion",
        "districts": [
          {
            "code": "JUN-02-02",
            "name": "Aco",
            "ubigeo": "120202"
          },
          {
            "code": "JUN-02-03",
            "name": "Andamarca",
            "ubigeo": "120203"
          },
          {
            "code": "JUN-02-04",
            "name": "Chambara",
            "ubigeo": "120204"
          },
          {
            "code": "JUN-02-05",
            "name": "Cochas",
            "ubigeo": "120205"
          },
          {
            "code": "JUN-02-06",
            "name": "Comas",
            "ubigeo": "120206"
          },
          {
            "code": "JUN-02-01",
            "name": "Concepcion",
            "ubigeo": "120201"
          },
          {
            "code": "JUN-02-07",
            "name": "Heroinas Toledo",
            "ubigeo": "120207"
          },
          {
            "code": "JUN-02-08",
            "name": "Manzanares",
            "ubigeo": "120208"
          },
          {
            "code": "JUN-02-09",
            "name": "Mariscal Castilla",
            "ubigeo": "120209"
          },
          {
            "code": "JUN-02-10",
            "name": "Matahuasi",
            "ubigeo": "120210"
          },
          {
            "code": "JUN-02-11",
            "name": "Mito",
            "ubigeo": "120211"
          },
          {
            "code": "JUN-02-12",
            "name": "Nueve de Julio",
            "ubigeo": "120212"
          },
          {
            "code": "JUN-02-13",
            "name": "Orcotuna",
            "ubigeo": "120213"
          },
          {
            "code": "JUN-02-14",
            "name": "San Jose de Quero",
            "ubigeo": "120214"
          },
          {
            "code": "JUN-02-15",
            "name": "Santa Rosa de Ocopa",
            "ubigeo": "120215"
          }
        ]
      },
      {
        "code": "JUN-01",
        "name": "Huancayo",
        "districts": [
          {
            "code": "JUN-01-04",
            "name": "Carhuacallanga",
            "ubigeo": "120104"
          },
          {
            "code": "JUN-01-05",
            "name": "Chacapampa",
            "ubigeo": "120105"
          },
          {
            "code": "JUN-01-06",
            "name": "Chicche",
            "ubigeo": "120106"
          },
          {
            "code": "JUN-01-07",
            "name": "Chilca",
            "ubigeo": "120107"
          },
          {
            "code": "JUN-01-08",
            "name": "Chongos Alto",
            "ubigeo": "120108"
          },
          {
            "code": "JUN-01-11",
            "name": "Chupuro",
            "ubigeo": "120111"
          },
          {
            "code": "JUN-01-12",
            "name": "Colca",
            "ubigeo": "120112"
          },
          {
            "code": "JUN-01-13",
            "name": "Cullhuas",
            "ubigeo": "120113"
          },
          {
            "code": "JUN-01-14",
            "name": "El Tambo",
            "ubigeo": "120114"
          },
          {
            "code": "JUN-01-16",
            "name": "Huacrapuquio",
            "ubigeo": "120116"
          },
          {
            "code": "JUN-01-17",
            "name": "Hualhuas",
            "ubigeo": "120117"
          },
          {
            "code": "JUN-01-19",
            "name": "Huancan",
            "ubigeo": "120119"
          },
          {
            "code": "JUN-01-01",
            "name": "Huancayo",
            "ubigeo": "120101"
          },
          {
            "code": "JUN-01-20",
            "name": "Huasicancha",
            "ubigeo": "120120"
          },
          {
            "code": "JUN-01-21",
            "name": "Huayucachi",
            "ubigeo": "120121"
          },
          {
            "code": "JUN-01-22",
            "name": "Ingenio",
            "ubigeo": "120122"
          },
          {
            "code": "JUN-01-24",
            "name": "Pariahuanca",
            "ubigeo": "120124"
          },
          {
            "code": "JUN-01-25",
            "name": "Pilcomayo",
            "ubigeo": "120125"
          },
          {
            "code": "JUN-01-26",
            "name": "Pucara",
            "ubigeo": "120126"
          },
          {
            "code": "JUN-01-27",
            "name": "Quichuay",
            "ubigeo": "120127"
          },
          {
            "code": "JUN-01-28",
            "name": "Quilcas",
            "ubigeo": "120128"
          },
          {
            "code": "JUN-01-29",
            "name": "San Agustin",
            "ubigeo": "120129"
          },
          {
            "code": "JUN-01-30",
            "name": "San Jeronimo de Tunan",
            "ubigeo": "120130"
          },
          {
            "code": "JUN-01-35",
            "name": "Santo Domingo de Acobamba",
            "ubigeo": "120135"
          },
          {
            "code": "JUN-01-33",
            "name": "Sapallanga",
            "ubigeo": "120133"
          },
          {
            "code": "JUN-01-32",
            "name": "Saño",
            "ubigeo": "120132"
          },
          {
            "code": "JUN-01-34",
            "name": "Sicaya",
            "ubigeo": "120134"
          },
          {
            "code": "JUN-01-36",
            "name": "Viques",
            "ubigeo": "120136"
          }
        ]
      },
      {
        "code": "JUN-04",
        "name": "Jauja",
        "districts": [
          {
            "code": "JUN-04-02",
            "name": "Acolla",
            "ubigeo": "120402"
          },
          {
            "code": "JUN-04-03",
            "name": "Apata",
            "ubigeo": "120403"
          },
          {
            "code": "JUN-04-04",
            "name": "Ataura",
            "ubigeo": "120404"
          },
          {
            "code": "JUN-04-05",
            "name": "Canchayllo",
            "ubigeo": "120405"
          },
          {
            "code": "JUN-04-06",
            "name": "Curicaca",
            "ubigeo": "120406"
          },
          {
            "code": "JUN-04-07",
            "name": "El Mantaro",
            "ubigeo": "120407"
          },
          {
            "code": "JUN-04-08",
            "name": "Huamali",
            "ubigeo": "120408"
          },
          {
            "code": "JUN-04-09",
            "name": "Huaripampa",
            "ubigeo": "120409"
          },
          {
            "code": "JUN-04-10",
            "name": "Huertas",
            "ubigeo": "120410"
          },
          {
            "code": "JUN-04-11",
            "name": "Janjaillo",
            "ubigeo": "120411"
          },
          {
            "code": "JUN-04-01",
            "name": "Jauja",
            "ubigeo": "120401"
          },
          {
            "code": "JUN-04-12",
            "name": "Julcan",
            "ubigeo": "120412"
          },
          {
            "code": "JUN-04-13",
            "name": "Leonor Ordoñez",
            "ubigeo": "120413"
          },
          {
            "code": "JUN-04-14",
            "name": "Llocllapampa",
            "ubigeo": "120414"
          },
          {
            "code": "JUN-04-15",
            "name": "Marco",
            "ubigeo": "120415"
          },
          {
            "code": "JUN-04-16",
            "name": "Masma",
            "ubigeo": "120416"
          },
          {
            "code": "JUN-04-17",
            "name": "Masma Chicche",
            "ubigeo": "120417"
          },
          {
            "code": "JUN-04-18",
            "name": "Molinos",
            "ubigeo": "120418"
          },
          {
            "code": "JUN-04-19",
            "name": "Monobamba",
            "ubigeo": "120419"
          },
          {
            "code": "JUN-04-20",
            "name": "Muqui",
            "ubigeo": "120420"
          },
          {
            "code": "JUN-04-21",
            "name": "Muquiyauyo",
            "ubigeo": "120421"
          },
          {
            "code": "JUN-04-22",
            "name": "Paca",
            "ubigeo": "120422"
          },
          {
            "code": "JUN-04-23",
            "name": "Paccha",
            "ubigeo": "120423"
          },
          {
            "code": "JUN-04-24",
            "name": "Pancan",
            "ubigeo": "120424"
          },
          {
            "code": "JUN-04-25",
            "name": "Parco",
            "ubigeo": "120425"
          },
          {
            "code": "JUN-04-26",
            "name": "Pomacancha",
            "ubigeo": "120426"
          },
          {
            "code": "JUN-04-27",
            "name": "Ricran",
            "ubigeo": "120427"
          },
          {
            "code": "JUN-04-28",
            "name": "San Lorenzo",
            "ubigeo": "120428"
          },
          {
            "code": "JUN-04-29",
            "name": "San Pedro de Chunan",
            "ubigeo": "120429"
          },
          {
            "code": "JUN-04-30",
            "name": "Sausa",
            "ubigeo": "120430"
          },
          {
            "code": "JUN-04-31",
            "name": "Sincos",
            "ubigeo": "120431"
          },
          {
            "code": "JUN-04-32",
            "name": "Tunan Marca",
            "ubigeo": "120432"
          },
          {
            "code": "JUN-04-33",
            "name": "Yauli",
            "ubigeo": "120433"
          },
          {
            "code": "JUN-04-34",
            "name": "Yauyos",
            "ubigeo": "120434"
          }
        ]
      },
      {
        "code": "JUN-05",
        "name": "Junin",
        "districts": [
          {
            "code": "JUN-05-02",
            "name": "Carhuamayo",
            "ubigeo": "120502"
          },
          {
            "code": "JUN-05-01",
            "name": "Junin",
            "ubigeo": "120501"
          },
          {
            "code": "JUN-05-03",
            "name": "Ondores",
            "ubigeo": "120503"
          },
          {
            "code": "JUN-05-04",
            "name": "Ulcumayo",
            "ubigeo": "120504"
          }
        ]
      },
      {
        "code": "JUN-06",
        "name": "Satipo",
        "districts": [
          {
            "code": "JUN-06-02",
            "name": "Coviriali",
            "ubigeo": "120602"
          },
          {
            "code": "JUN-06-03",
            "name": "Llaylla",
            "ubigeo": "120603"
          },
          {
            "code": "JUN-06-04",
            "name": "Mazamari",
            "ubigeo": "120604"
          },
          {
            "code": "JUN-06-05",
            "name": "Pampa Hermosa",
            "ubigeo": "120605"
          },
          {
            "code": "JUN-06-06",
            "name": "Pangoa",
            "ubigeo": "120606"
          },
          {
            "code": "JUN-06-07",
            "name": "Rio Negro",
            "ubigeo": "120607"
          },
          {
            "code": "JUN-06-08",
            "name": "Rio Tambo",
            "ubigeo": "120608"
          },
          {
            "code": "JUN-06-01",
            "name": "Satipo",
            "ubigeo": "120601"
          },
          {
            "code": "JUN-06-09",
            "name": "Vizcatán del Ene",
            "ubigeo": "120609"
          }
        ]
      },
      {
        "code": "JUN-07",
        "name": "Tarma",
        "districts": [
          {
            "code": "JUN-07-02",
            "name": "Acobamba",
            "ubigeo": "120702"
          },
          {
            "code": "JUN-07-03",
            "name": "Huaricolca",
            "ubigeo": "120703"
          },
          {
            "code": "JUN-07-04",
            "name": "Huasahuasi",
            "ubigeo": "120704"
          },
          {
            "code": "JUN-07-05",
            "name": "La Union",
            "ubigeo": "120705"
          },
          {
            "code": "JUN-07-06",
            "name": "Palca",
            "ubigeo": "120706"
          },
          {
            "code": "JUN-07-07",
            "name": "Palcamayo",
            "ubigeo": "120707"
          },
          {
            "code": "JUN-07-08",
            "name": "San Pedro de Cajas",
            "ubigeo": "120708"
          },
          {
            "code": "JUN-07-09",
            "name": "Tapo",
            "ubigeo": "120709"
          },
          {
            "code": "JUN-07-01",
            "name": "Tarma",
            "ubigeo": "120701"
          }
        ]
      },
      {
        "code": "JUN-08",
        "name": "Yauli",
        "districts": [
          {
            "code": "JUN-08-02",
            "name": "Chacapalpa",
            "ubigeo": "120802"
          },
          {
            "code": "JUN-08-03",
            "name": "Huay-Huay",
            "ubigeo": "120803"
          },
          {
            "code": "JUN-08-01",
            "name": "La Oroya",
            "ubigeo": "120801"
          },
          {
            "code": "JUN-08-04",
            "name": "Marcapomacocha",
            "ubigeo": "120804"
          },
          {
            "code": "JUN-08-05",
            "name": "Morococha",
            "ubigeo": "120805"
          },
          {
            "code": "JUN-08-06",
            "name": "Paccha",
            "ubigeo": "120806"
          },
          {
            "code": "JUN-08-07",
            "name": "Santa Barbara de Carhuacayan",
            "ubigeo": "120807"
          },
          {
            "code": "JUN-08-08",
            "name": "Santa Rosa de Sacco",
            "ubigeo": "120808"
          },
          {
            "code": "JUN-08-09",
            "name": "Suitucancha",
            "ubigeo": "120809"
          },
          {
            "code": "JUN-08-10",
            "name": "Yauli",
            "ubigeo": "120810"
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
        "code": "LA -02",
        "name": "Ascope",
        "districts": [
          {
            "code": "LA -02-01",
            "name": "Ascope",
            "ubigeo": "130201"
          },
          {
            "code": "LA -02-08",
            "name": "Casa Grande",
            "ubigeo": "130208"
          },
          {
            "code": "LA -02-02",
            "name": "Chicama",
            "ubigeo": "130202"
          },
          {
            "code": "LA -02-03",
            "name": "Chocope",
            "ubigeo": "130203"
          },
          {
            "code": "LA -02-04",
            "name": "Magdalena de Cao",
            "ubigeo": "130204"
          },
          {
            "code": "LA -02-05",
            "name": "Paijan",
            "ubigeo": "130205"
          },
          {
            "code": "LA -02-06",
            "name": "Razuri",
            "ubigeo": "130206"
          },
          {
            "code": "LA -02-07",
            "name": "Santiago de Cao",
            "ubigeo": "130207"
          }
        ]
      },
      {
        "code": "LA -03",
        "name": "Bolivar",
        "districts": [
          {
            "code": "LA -03-02",
            "name": "Bambamarca",
            "ubigeo": "130302"
          },
          {
            "code": "LA -03-01",
            "name": "Bolivar",
            "ubigeo": "130301"
          },
          {
            "code": "LA -03-03",
            "name": "Condormarca",
            "ubigeo": "130303"
          },
          {
            "code": "LA -03-04",
            "name": "Longotea",
            "ubigeo": "130304"
          },
          {
            "code": "LA -03-05",
            "name": "Uchumarca",
            "ubigeo": "130305"
          },
          {
            "code": "LA -03-06",
            "name": "Ucuncha",
            "ubigeo": "130306"
          }
        ]
      },
      {
        "code": "LA -04",
        "name": "Chepen",
        "districts": [
          {
            "code": "LA -04-01",
            "name": "Chepen",
            "ubigeo": "130401"
          },
          {
            "code": "LA -04-02",
            "name": "Pacanga",
            "ubigeo": "130402"
          },
          {
            "code": "LA -04-03",
            "name": "Pueblo Nuevo",
            "ubigeo": "130403"
          }
        ]
      },
      {
        "code": "LA -11",
        "name": "Gran Chimu",
        "districts": [
          {
            "code": "LA -11-01",
            "name": "Cascas",
            "ubigeo": "131101"
          },
          {
            "code": "LA -11-03",
            "name": "Compin",
            "ubigeo": "131103"
          },
          {
            "code": "LA -11-02",
            "name": "Lucma",
            "ubigeo": "131102"
          },
          {
            "code": "LA -11-04",
            "name": "Sayapullo",
            "ubigeo": "131104"
          }
        ]
      },
      {
        "code": "LA -05",
        "name": "Julcan",
        "districts": [
          {
            "code": "LA -05-02",
            "name": "Calamarca",
            "ubigeo": "130502"
          },
          {
            "code": "LA -05-03",
            "name": "Carabamba",
            "ubigeo": "130503"
          },
          {
            "code": "LA -05-04",
            "name": "Huaso",
            "ubigeo": "130504"
          },
          {
            "code": "LA -05-01",
            "name": "Julcan",
            "ubigeo": "130501"
          }
        ]
      },
      {
        "code": "LA -06",
        "name": "Otuzco",
        "districts": [
          {
            "code": "LA -06-02",
            "name": "Agallpampa",
            "ubigeo": "130602"
          },
          {
            "code": "LA -06-04",
            "name": "Charat",
            "ubigeo": "130604"
          },
          {
            "code": "LA -06-05",
            "name": "Huaranchal",
            "ubigeo": "130605"
          },
          {
            "code": "LA -06-06",
            "name": "La Cuesta",
            "ubigeo": "130606"
          },
          {
            "code": "LA -06-08",
            "name": "Mache",
            "ubigeo": "130608"
          },
          {
            "code": "LA -06-01",
            "name": "Otuzco",
            "ubigeo": "130601"
          },
          {
            "code": "LA -06-10",
            "name": "Paranday",
            "ubigeo": "130610"
          },
          {
            "code": "LA -06-11",
            "name": "Salpo",
            "ubigeo": "130611"
          },
          {
            "code": "LA -06-13",
            "name": "Sinsicap",
            "ubigeo": "130613"
          },
          {
            "code": "LA -06-14",
            "name": "Usquil",
            "ubigeo": "130614"
          }
        ]
      },
      {
        "code": "LA -07",
        "name": "Pacasmayo",
        "districts": [
          {
            "code": "LA -07-02",
            "name": "Guadalupe",
            "ubigeo": "130702"
          },
          {
            "code": "LA -07-03",
            "name": "Jequetepeque",
            "ubigeo": "130703"
          },
          {
            "code": "LA -07-04",
            "name": "Pacasmayo",
            "ubigeo": "130704"
          },
          {
            "code": "LA -07-05",
            "name": "San Jose",
            "ubigeo": "130705"
          },
          {
            "code": "LA -07-01",
            "name": "San Pedro de Lloc",
            "ubigeo": "130701"
          }
        ]
      },
      {
        "code": "LA -08",
        "name": "Pataz",
        "districts": [
          {
            "code": "LA -08-02",
            "name": "Buldibuyo",
            "ubigeo": "130802"
          },
          {
            "code": "LA -08-03",
            "name": "Chillia",
            "ubigeo": "130803"
          },
          {
            "code": "LA -08-04",
            "name": "Huancaspata",
            "ubigeo": "130804"
          },
          {
            "code": "LA -08-05",
            "name": "Huaylillas",
            "ubigeo": "130805"
          },
          {
            "code": "LA -08-06",
            "name": "Huayo",
            "ubigeo": "130806"
          },
          {
            "code": "LA -08-07",
            "name": "Ongon",
            "ubigeo": "130807"
          },
          {
            "code": "LA -08-08",
            "name": "Parcoy",
            "ubigeo": "130808"
          },
          {
            "code": "LA -08-09",
            "name": "Pataz",
            "ubigeo": "130809"
          },
          {
            "code": "LA -08-10",
            "name": "Pias",
            "ubigeo": "130810"
          },
          {
            "code": "LA -08-11",
            "name": "Santiago de Challas",
            "ubigeo": "130811"
          },
          {
            "code": "LA -08-12",
            "name": "Taurija",
            "ubigeo": "130812"
          },
          {
            "code": "LA -08-01",
            "name": "Tayabamba",
            "ubigeo": "130801"
          },
          {
            "code": "LA -08-13",
            "name": "Urpay",
            "ubigeo": "130813"
          }
        ]
      },
      {
        "code": "LA -09",
        "name": "Sanchez Carrion",
        "districts": [
          {
            "code": "LA -09-02",
            "name": "Chugay",
            "ubigeo": "130902"
          },
          {
            "code": "LA -09-03",
            "name": "Cochorco",
            "ubigeo": "130903"
          },
          {
            "code": "LA -09-04",
            "name": "Curgos",
            "ubigeo": "130904"
          },
          {
            "code": "LA -09-01",
            "name": "Huamachuco",
            "ubigeo": "130901"
          },
          {
            "code": "LA -09-05",
            "name": "Marcabal",
            "ubigeo": "130905"
          },
          {
            "code": "LA -09-06",
            "name": "Sanagoran",
            "ubigeo": "130906"
          },
          {
            "code": "LA -09-07",
            "name": "Sarin",
            "ubigeo": "130907"
          },
          {
            "code": "LA -09-08",
            "name": "Sartimbamba",
            "ubigeo": "130908"
          }
        ]
      },
      {
        "code": "LA -10",
        "name": "Santiago de Chuco",
        "districts": [
          {
            "code": "LA -10-02",
            "name": "Angasmarca",
            "ubigeo": "131002"
          },
          {
            "code": "LA -10-03",
            "name": "Cachicadan",
            "ubigeo": "131003"
          },
          {
            "code": "LA -10-04",
            "name": "Mollebamba",
            "ubigeo": "131004"
          },
          {
            "code": "LA -10-05",
            "name": "Mollepata",
            "ubigeo": "131005"
          },
          {
            "code": "LA -10-06",
            "name": "Quiruvilca",
            "ubigeo": "131006"
          },
          {
            "code": "LA -10-07",
            "name": "Santa Cruz de Chuca",
            "ubigeo": "131007"
          },
          {
            "code": "LA -10-01",
            "name": "Santiago de Chuco",
            "ubigeo": "131001"
          },
          {
            "code": "LA -10-08",
            "name": "Sitabamba",
            "ubigeo": "131008"
          }
        ]
      },
      {
        "code": "LA -01",
        "name": "Trujillo",
        "districts": [
          {
            "code": "LA -01-02",
            "name": "El Porvenir",
            "ubigeo": "130102"
          },
          {
            "code": "LA -01-03",
            "name": "Florencia de Mora",
            "ubigeo": "130103"
          },
          {
            "code": "LA -01-04",
            "name": "Huanchaco",
            "ubigeo": "130104"
          },
          {
            "code": "LA -01-05",
            "name": "La Esperanza",
            "ubigeo": "130105"
          },
          {
            "code": "LA -01-06",
            "name": "Laredo",
            "ubigeo": "130106"
          },
          {
            "code": "LA -01-07",
            "name": "Moche",
            "ubigeo": "130107"
          },
          {
            "code": "LA -01-08",
            "name": "Poroto",
            "ubigeo": "130108"
          },
          {
            "code": "LA -01-09",
            "name": "Salaverry",
            "ubigeo": "130109"
          },
          {
            "code": "LA -01-10",
            "name": "Simbal",
            "ubigeo": "130110"
          },
          {
            "code": "LA -01-01",
            "name": "Trujillo",
            "ubigeo": "130101"
          },
          {
            "code": "LA -01-11",
            "name": "Victor Larco Herrera",
            "ubigeo": "130111"
          }
        ]
      },
      {
        "code": "LA -12",
        "name": "Viru",
        "districts": [
          {
            "code": "LA -12-02",
            "name": "Chao",
            "ubigeo": "131202"
          },
          {
            "code": "LA -12-03",
            "name": "Guadalupito",
            "ubigeo": "131203"
          },
          {
            "code": "LA -12-01",
            "name": "Viru",
            "ubigeo": "131201"
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
        "code": "LAM-01",
        "name": "Chiclayo",
        "districts": [
          {
            "code": "LAM-01-16",
            "name": "Cayalti",
            "ubigeo": "140116"
          },
          {
            "code": "LAM-01-01",
            "name": "Chiclayo",
            "ubigeo": "140101"
          },
          {
            "code": "LAM-01-02",
            "name": "Chongoyape",
            "ubigeo": "140102"
          },
          {
            "code": "LAM-01-03",
            "name": "Eten",
            "ubigeo": "140103"
          },
          {
            "code": "LAM-01-04",
            "name": "Eten Puerto",
            "ubigeo": "140104"
          },
          {
            "code": "LAM-01-05",
            "name": "Jose Leonardo Ortiz",
            "ubigeo": "140105"
          },
          {
            "code": "LAM-01-06",
            "name": "La Victoria",
            "ubigeo": "140106"
          },
          {
            "code": "LAM-01-07",
            "name": "Lagunas",
            "ubigeo": "140107"
          },
          {
            "code": "LAM-01-08",
            "name": "Monsefu",
            "ubigeo": "140108"
          },
          {
            "code": "LAM-01-09",
            "name": "Nueva Arica",
            "ubigeo": "140109"
          },
          {
            "code": "LAM-01-10",
            "name": "Oyotun",
            "ubigeo": "140110"
          },
          {
            "code": "LAM-01-17",
            "name": "Patapo",
            "ubigeo": "140117"
          },
          {
            "code": "LAM-01-11",
            "name": "Picsi",
            "ubigeo": "140111"
          },
          {
            "code": "LAM-01-12",
            "name": "Pimentel",
            "ubigeo": "140112"
          },
          {
            "code": "LAM-01-18",
            "name": "Pomalca",
            "ubigeo": "140118"
          },
          {
            "code": "LAM-01-19",
            "name": "Pucala",
            "ubigeo": "140119"
          },
          {
            "code": "LAM-01-13",
            "name": "Reque",
            "ubigeo": "140113"
          },
          {
            "code": "LAM-01-14",
            "name": "Santa Rosa",
            "ubigeo": "140114"
          },
          {
            "code": "LAM-01-15",
            "name": "Saña",
            "ubigeo": "140115"
          },
          {
            "code": "LAM-01-20",
            "name": "Tuman",
            "ubigeo": "140120"
          }
        ]
      },
      {
        "code": "LAM-02",
        "name": "Ferreñafe",
        "districts": [
          {
            "code": "LAM-02-02",
            "name": "Cañaris",
            "ubigeo": "140202"
          },
          {
            "code": "LAM-02-01",
            "name": "Ferreñafe",
            "ubigeo": "140201"
          },
          {
            "code": "LAM-02-03",
            "name": "Incahuasi",
            "ubigeo": "140203"
          },
          {
            "code": "LAM-02-04",
            "name": "Manuel Antonio Mesones Muro",
            "ubigeo": "140204"
          },
          {
            "code": "LAM-02-05",
            "name": "Pitipo",
            "ubigeo": "140205"
          },
          {
            "code": "LAM-02-06",
            "name": "Pueblo Nuevo",
            "ubigeo": "140206"
          }
        ]
      },
      {
        "code": "LAM-03",
        "name": "Lambayeque",
        "districts": [
          {
            "code": "LAM-03-02",
            "name": "Chochope",
            "ubigeo": "140302"
          },
          {
            "code": "LAM-03-03",
            "name": "Illimo",
            "ubigeo": "140303"
          },
          {
            "code": "LAM-03-04",
            "name": "Jayanca",
            "ubigeo": "140304"
          },
          {
            "code": "LAM-03-01",
            "name": "Lambayeque",
            "ubigeo": "140301"
          },
          {
            "code": "LAM-03-05",
            "name": "Mochumi",
            "ubigeo": "140305"
          },
          {
            "code": "LAM-03-06",
            "name": "Morrope",
            "ubigeo": "140306"
          },
          {
            "code": "LAM-03-07",
            "name": "Motupe",
            "ubigeo": "140307"
          },
          {
            "code": "LAM-03-08",
            "name": "Olmos",
            "ubigeo": "140308"
          },
          {
            "code": "LAM-03-09",
            "name": "Pacora",
            "ubigeo": "140309"
          },
          {
            "code": "LAM-03-10",
            "name": "Salas",
            "ubigeo": "140310"
          },
          {
            "code": "LAM-03-11",
            "name": "San Jose",
            "ubigeo": "140311"
          },
          {
            "code": "LAM-03-12",
            "name": "Tucume",
            "ubigeo": "140312"
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
        "code": "LIM-02",
        "name": "Barranca",
        "districts": [
          {
            "code": "LIM-02-01",
            "name": "Barranca",
            "ubigeo": "150201"
          },
          {
            "code": "LIM-02-02",
            "name": "Paramonga",
            "ubigeo": "150202"
          },
          {
            "code": "LIM-02-03",
            "name": "Pativilca",
            "ubigeo": "150203"
          },
          {
            "code": "LIM-02-04",
            "name": "Supe",
            "ubigeo": "150204"
          },
          {
            "code": "LIM-02-05",
            "name": "Supe Puerto",
            "ubigeo": "150205"
          }
        ]
      },
      {
        "code": "LIM-03",
        "name": "Cajatambo",
        "districts": [
          {
            "code": "LIM-03-01",
            "name": "Cajatambo",
            "ubigeo": "150301"
          },
          {
            "code": "LIM-03-02",
            "name": "Copa",
            "ubigeo": "150302"
          },
          {
            "code": "LIM-03-03",
            "name": "Gorgor",
            "ubigeo": "150303"
          },
          {
            "code": "LIM-03-04",
            "name": "Huancapon",
            "ubigeo": "150304"
          },
          {
            "code": "LIM-03-05",
            "name": "Manas",
            "ubigeo": "150305"
          }
        ]
      },
      {
        "code": "LIM-04",
        "name": "Canta",
        "districts": [
          {
            "code": "LIM-04-02",
            "name": "Arahuay",
            "ubigeo": "150402"
          },
          {
            "code": "LIM-04-01",
            "name": "Canta",
            "ubigeo": "150401"
          },
          {
            "code": "LIM-04-03",
            "name": "Huamantanga",
            "ubigeo": "150403"
          },
          {
            "code": "LIM-04-04",
            "name": "Huaros",
            "ubigeo": "150404"
          },
          {
            "code": "LIM-04-05",
            "name": "Lachaqui",
            "ubigeo": "150405"
          },
          {
            "code": "LIM-04-06",
            "name": "San Buenaventura",
            "ubigeo": "150406"
          },
          {
            "code": "LIM-04-07",
            "name": "Santa Rosa de Quives",
            "ubigeo": "150407"
          }
        ]
      },
      {
        "code": "LIM-05",
        "name": "Cañete",
        "districts": [
          {
            "code": "LIM-05-02",
            "name": "Asia",
            "ubigeo": "150502"
          },
          {
            "code": "LIM-05-03",
            "name": "Calango",
            "ubigeo": "150503"
          },
          {
            "code": "LIM-05-04",
            "name": "Cerro Azul",
            "ubigeo": "150504"
          },
          {
            "code": "LIM-05-05",
            "name": "Chilca",
            "ubigeo": "150505"
          },
          {
            "code": "LIM-05-06",
            "name": "Coayllo",
            "ubigeo": "150506"
          },
          {
            "code": "LIM-05-07",
            "name": "Imperial",
            "ubigeo": "150507"
          },
          {
            "code": "LIM-05-08",
            "name": "Lunahuana",
            "ubigeo": "150508"
          },
          {
            "code": "LIM-05-09",
            "name": "Mala",
            "ubigeo": "150509"
          },
          {
            "code": "LIM-05-10",
            "name": "Nuevo Imperial",
            "ubigeo": "150510"
          },
          {
            "code": "LIM-05-11",
            "name": "Pacaran",
            "ubigeo": "150511"
          },
          {
            "code": "LIM-05-12",
            "name": "Quilmana",
            "ubigeo": "150512"
          },
          {
            "code": "LIM-05-13",
            "name": "San Antonio",
            "ubigeo": "150513"
          },
          {
            "code": "LIM-05-14",
            "name": "San Luis",
            "ubigeo": "150514"
          },
          {
            "code": "LIM-05-01",
            "name": "San Vicente de Cañete",
            "ubigeo": "150501"
          },
          {
            "code": "LIM-05-15",
            "name": "Santa Cruz de Flores",
            "ubigeo": "150515"
          },
          {
            "code": "LIM-05-16",
            "name": "Zuñiga",
            "ubigeo": "150516"
          }
        ]
      },
      {
        "code": "LIM-06",
        "name": "Huaral",
        "districts": [
          {
            "code": "LIM-06-02",
            "name": "Atavillos Alto",
            "ubigeo": "150602"
          },
          {
            "code": "LIM-06-03",
            "name": "Atavillos Bajo",
            "ubigeo": "150603"
          },
          {
            "code": "LIM-06-04",
            "name": "Aucallama",
            "ubigeo": "150604"
          },
          {
            "code": "LIM-06-05",
            "name": "Chancay",
            "ubigeo": "150605"
          },
          {
            "code": "LIM-06-01",
            "name": "Huaral",
            "ubigeo": "150601"
          },
          {
            "code": "LIM-06-06",
            "name": "Ihuari",
            "ubigeo": "150606"
          },
          {
            "code": "LIM-06-07",
            "name": "Lampian",
            "ubigeo": "150607"
          },
          {
            "code": "LIM-06-08",
            "name": "Pacaraos",
            "ubigeo": "150608"
          },
          {
            "code": "LIM-06-09",
            "name": "San Miguel de Acos",
            "ubigeo": "150609"
          },
          {
            "code": "LIM-06-10",
            "name": "Santa Cruz de Andamarca",
            "ubigeo": "150610"
          },
          {
            "code": "LIM-06-11",
            "name": "Sumbilca",
            "ubigeo": "150611"
          },
          {
            "code": "LIM-06-12",
            "name": "Veintisiete de Noviembre",
            "ubigeo": "150612"
          }
        ]
      },
      {
        "code": "LIM-07",
        "name": "Huarochiri",
        "districts": [
          {
            "code": "LIM-07-02",
            "name": "Antioquia",
            "ubigeo": "150702"
          },
          {
            "code": "LIM-07-03",
            "name": "Callahuanca",
            "ubigeo": "150703"
          },
          {
            "code": "LIM-07-04",
            "name": "Carampoma",
            "ubigeo": "150704"
          },
          {
            "code": "LIM-07-05",
            "name": "Chicla",
            "ubigeo": "150705"
          },
          {
            "code": "LIM-07-06",
            "name": "Cuenca",
            "ubigeo": "150706"
          },
          {
            "code": "LIM-07-07",
            "name": "Huachupampa",
            "ubigeo": "150707"
          },
          {
            "code": "LIM-07-08",
            "name": "Huanza",
            "ubigeo": "150708"
          },
          {
            "code": "LIM-07-09",
            "name": "Huarochiri",
            "ubigeo": "150709"
          },
          {
            "code": "LIM-07-10",
            "name": "Lahuaytambo",
            "ubigeo": "150710"
          },
          {
            "code": "LIM-07-11",
            "name": "Langa",
            "ubigeo": "150711"
          },
          {
            "code": "LIM-07-12",
            "name": "Laraos",
            "ubigeo": "150712"
          },
          {
            "code": "LIM-07-13",
            "name": "Mariatana",
            "ubigeo": "150713"
          },
          {
            "code": "LIM-07-01",
            "name": "Matucana",
            "ubigeo": "150701"
          },
          {
            "code": "LIM-07-14",
            "name": "Ricardo Palma",
            "ubigeo": "150714"
          },
          {
            "code": "LIM-07-15",
            "name": "San Andres de Tupicocha",
            "ubigeo": "150715"
          },
          {
            "code": "LIM-07-16",
            "name": "San Antonio",
            "ubigeo": "150716"
          },
          {
            "code": "LIM-07-17",
            "name": "San Bartolome",
            "ubigeo": "150717"
          },
          {
            "code": "LIM-07-18",
            "name": "San Damian",
            "ubigeo": "150718"
          },
          {
            "code": "LIM-07-19",
            "name": "San Juan de Iris",
            "ubigeo": "150719"
          },
          {
            "code": "LIM-07-20",
            "name": "San Juan de Tantaranche",
            "ubigeo": "150720"
          },
          {
            "code": "LIM-07-21",
            "name": "San Lorenzo de Quinti",
            "ubigeo": "150721"
          },
          {
            "code": "LIM-07-22",
            "name": "San Mateo",
            "ubigeo": "150722"
          },
          {
            "code": "LIM-07-23",
            "name": "San Mateo de Otao",
            "ubigeo": "150723"
          },
          {
            "code": "LIM-07-24",
            "name": "San Pedro de Casta",
            "ubigeo": "150724"
          },
          {
            "code": "LIM-07-25",
            "name": "San Pedro de Huancayre",
            "ubigeo": "150725"
          },
          {
            "code": "LIM-07-26",
            "name": "Sangallaya",
            "ubigeo": "150726"
          },
          {
            "code": "LIM-07-27",
            "name": "Santa Cruz de Cocachacra",
            "ubigeo": "150727"
          },
          {
            "code": "LIM-07-28",
            "name": "Santa Eulalia",
            "ubigeo": "150728"
          },
          {
            "code": "LIM-07-29",
            "name": "Santiago de Anchucaya",
            "ubigeo": "150729"
          },
          {
            "code": "LIM-07-30",
            "name": "Santiago de Tuna",
            "ubigeo": "150730"
          },
          {
            "code": "LIM-07-31",
            "name": "Santo Domingo de los Olleros",
            "ubigeo": "150731"
          },
          {
            "code": "LIM-07-32",
            "name": "Surco",
            "ubigeo": "150732"
          }
        ]
      },
      {
        "code": "LIM-08",
        "name": "Huaura",
        "districts": [
          {
            "code": "LIM-08-02",
            "name": "Ambar",
            "ubigeo": "150802"
          },
          {
            "code": "LIM-08-03",
            "name": "Caleta de Carquin",
            "ubigeo": "150803"
          },
          {
            "code": "LIM-08-04",
            "name": "Checras",
            "ubigeo": "150804"
          },
          {
            "code": "LIM-08-01",
            "name": "Huacho",
            "ubigeo": "150801"
          },
          {
            "code": "LIM-08-05",
            "name": "Hualmay",
            "ubigeo": "150805"
          },
          {
            "code": "LIM-08-06",
            "name": "Huaura",
            "ubigeo": "150806"
          },
          {
            "code": "LIM-08-07",
            "name": "Leoncio Prado",
            "ubigeo": "150807"
          },
          {
            "code": "LIM-08-08",
            "name": "Paccho",
            "ubigeo": "150808"
          },
          {
            "code": "LIM-08-09",
            "name": "Santa Leonor",
            "ubigeo": "150809"
          },
          {
            "code": "LIM-08-10",
            "name": "Santa Maria",
            "ubigeo": "150810"
          },
          {
            "code": "LIM-08-11",
            "name": "Sayan",
            "ubigeo": "150811"
          },
          {
            "code": "LIM-08-12",
            "name": "Vegueta",
            "ubigeo": "150812"
          }
        ]
      },
      {
        "code": "LIM-01",
        "name": "Lima",
        "districts": [
          {
            "code": "LIM-01-02",
            "name": "Ancon",
            "ubigeo": "150102"
          },
          {
            "code": "LIM-01-03",
            "name": "Ate",
            "ubigeo": "150103"
          },
          {
            "code": "LIM-01-04",
            "name": "Barranco",
            "ubigeo": "150104"
          },
          {
            "code": "LIM-01-05",
            "name": "Breña",
            "ubigeo": "150105"
          },
          {
            "code": "LIM-01-06",
            "name": "Carabayllo",
            "ubigeo": "150106"
          },
          {
            "code": "LIM-01-07",
            "name": "Chaclacayo",
            "ubigeo": "150107"
          },
          {
            "code": "LIM-01-08",
            "name": "Chorrillos",
            "ubigeo": "150108"
          },
          {
            "code": "LIM-01-09",
            "name": "Cieneguilla",
            "ubigeo": "150109"
          },
          {
            "code": "LIM-01-10",
            "name": "Comas",
            "ubigeo": "150110"
          },
          {
            "code": "LIM-01-11",
            "name": "El Agustino",
            "ubigeo": "150111"
          },
          {
            "code": "LIM-01-12",
            "name": "Independencia",
            "ubigeo": "150112"
          },
          {
            "code": "LIM-01-13",
            "name": "Jesus Maria",
            "ubigeo": "150113"
          },
          {
            "code": "LIM-01-14",
            "name": "La Molina",
            "ubigeo": "150114"
          },
          {
            "code": "LIM-01-15",
            "name": "La Victoria",
            "ubigeo": "150115"
          },
          {
            "code": "LIM-01-01",
            "name": "Lima",
            "ubigeo": "150101"
          },
          {
            "code": "LIM-01-16",
            "name": "Lince",
            "ubigeo": "150116"
          },
          {
            "code": "LIM-01-17",
            "name": "Los Olivos",
            "ubigeo": "150117"
          },
          {
            "code": "LIM-01-18",
            "name": "Lurigancho",
            "ubigeo": "150118"
          },
          {
            "code": "LIM-01-19",
            "name": "Lurin",
            "ubigeo": "150119"
          },
          {
            "code": "LIM-01-20",
            "name": "Magdalena del Mar",
            "ubigeo": "150120"
          },
          {
            "code": "LIM-01-22",
            "name": "Miraflores",
            "ubigeo": "150122"
          },
          {
            "code": "LIM-01-23",
            "name": "Pachacamac",
            "ubigeo": "150123"
          },
          {
            "code": "LIM-01-24",
            "name": "Pucusana",
            "ubigeo": "150124"
          },
          {
            "code": "LIM-01-21",
            "name": "Pueblo Libre",
            "ubigeo": "150121"
          },
          {
            "code": "LIM-01-25",
            "name": "Puente Piedra",
            "ubigeo": "150125"
          },
          {
            "code": "LIM-01-26",
            "name": "Punta Hermosa",
            "ubigeo": "150126"
          },
          {
            "code": "LIM-01-27",
            "name": "Punta Negra",
            "ubigeo": "150127"
          },
          {
            "code": "LIM-01-28",
            "name": "Rimac",
            "ubigeo": "150128"
          },
          {
            "code": "LIM-01-29",
            "name": "San Bartolo",
            "ubigeo": "150129"
          },
          {
            "code": "LIM-01-30",
            "name": "San Borja",
            "ubigeo": "150130"
          },
          {
            "code": "LIM-01-31",
            "name": "San Isidro",
            "ubigeo": "150131"
          },
          {
            "code": "LIM-01-32",
            "name": "San Juan de Lurigancho",
            "ubigeo": "150132"
          },
          {
            "code": "LIM-01-33",
            "name": "San Juan de Miraflores",
            "ubigeo": "150133"
          },
          {
            "code": "LIM-01-34",
            "name": "San Luis",
            "ubigeo": "150134"
          },
          {
            "code": "LIM-01-35",
            "name": "San Martin de Porres",
            "ubigeo": "150135"
          },
          {
            "code": "LIM-01-36",
            "name": "San Miguel",
            "ubigeo": "150136"
          },
          {
            "code": "LIM-01-37",
            "name": "Santa Anita",
            "ubigeo": "150137"
          },
          {
            "code": "LIM-01-38",
            "name": "Santa Maria del Mar",
            "ubigeo": "150138"
          },
          {
            "code": "LIM-01-39",
            "name": "Santa Rosa",
            "ubigeo": "150139"
          },
          {
            "code": "LIM-01-40",
            "name": "Santiago de Surco",
            "ubigeo": "150140"
          },
          {
            "code": "LIM-01-41",
            "name": "Surquillo",
            "ubigeo": "150141"
          },
          {
            "code": "LIM-01-42",
            "name": "Villa El Salvador",
            "ubigeo": "150142"
          },
          {
            "code": "LIM-01-43",
            "name": "Villa Maria del Triunfo",
            "ubigeo": "150143"
          }
        ]
      },
      {
        "code": "LIM-09",
        "name": "Oyon",
        "districts": [
          {
            "code": "LIM-09-02",
            "name": "Andajes",
            "ubigeo": "150902"
          },
          {
            "code": "LIM-09-03",
            "name": "Caujul",
            "ubigeo": "150903"
          },
          {
            "code": "LIM-09-04",
            "name": "Cochamarca",
            "ubigeo": "150904"
          },
          {
            "code": "LIM-09-05",
            "name": "Navan",
            "ubigeo": "150905"
          },
          {
            "code": "LIM-09-01",
            "name": "Oyon",
            "ubigeo": "150901"
          },
          {
            "code": "LIM-09-06",
            "name": "Pachangara",
            "ubigeo": "150906"
          }
        ]
      },
      {
        "code": "LIM-10",
        "name": "Yauyos",
        "districts": [
          {
            "code": "LIM-10-02",
            "name": "Alis",
            "ubigeo": "151002"
          },
          {
            "code": "LIM-10-03",
            "name": "Ayauca",
            "ubigeo": "151003"
          },
          {
            "code": "LIM-10-04",
            "name": "Ayaviri",
            "ubigeo": "151004"
          },
          {
            "code": "LIM-10-05",
            "name": "Azangaro",
            "ubigeo": "151005"
          },
          {
            "code": "LIM-10-06",
            "name": "Cacra",
            "ubigeo": "151006"
          },
          {
            "code": "LIM-10-07",
            "name": "Carania",
            "ubigeo": "151007"
          },
          {
            "code": "LIM-10-08",
            "name": "Catahuasi",
            "ubigeo": "151008"
          },
          {
            "code": "LIM-10-09",
            "name": "Chocos",
            "ubigeo": "151009"
          },
          {
            "code": "LIM-10-10",
            "name": "Cochas",
            "ubigeo": "151010"
          },
          {
            "code": "LIM-10-11",
            "name": "Colonia",
            "ubigeo": "151011"
          },
          {
            "code": "LIM-10-12",
            "name": "Hongos",
            "ubigeo": "151012"
          },
          {
            "code": "LIM-10-13",
            "name": "Huampara",
            "ubigeo": "151013"
          },
          {
            "code": "LIM-10-14",
            "name": "Huancaya",
            "ubigeo": "151014"
          },
          {
            "code": "LIM-10-15",
            "name": "Huangascar",
            "ubigeo": "151015"
          },
          {
            "code": "LIM-10-16",
            "name": "Huantan",
            "ubigeo": "151016"
          },
          {
            "code": "LIM-10-17",
            "name": "Huañec",
            "ubigeo": "151017"
          },
          {
            "code": "LIM-10-18",
            "name": "Laraos",
            "ubigeo": "151018"
          },
          {
            "code": "LIM-10-19",
            "name": "Lincha",
            "ubigeo": "151019"
          },
          {
            "code": "LIM-10-20",
            "name": "Madean",
            "ubigeo": "151020"
          },
          {
            "code": "LIM-10-21",
            "name": "Miraflores",
            "ubigeo": "151021"
          },
          {
            "code": "LIM-10-22",
            "name": "Omas",
            "ubigeo": "151022"
          },
          {
            "code": "LIM-10-23",
            "name": "Putinza",
            "ubigeo": "151023"
          },
          {
            "code": "LIM-10-24",
            "name": "Quinches",
            "ubigeo": "151024"
          },
          {
            "code": "LIM-10-25",
            "name": "Quinocay",
            "ubigeo": "151025"
          },
          {
            "code": "LIM-10-26",
            "name": "San Joaquin",
            "ubigeo": "151026"
          },
          {
            "code": "LIM-10-27",
            "name": "San Pedro de Pilas",
            "ubigeo": "151027"
          },
          {
            "code": "LIM-10-28",
            "name": "Tanta",
            "ubigeo": "151028"
          },
          {
            "code": "LIM-10-29",
            "name": "Tauripampa",
            "ubigeo": "151029"
          },
          {
            "code": "LIM-10-30",
            "name": "Tomas",
            "ubigeo": "151030"
          },
          {
            "code": "LIM-10-31",
            "name": "Tupe",
            "ubigeo": "151031"
          },
          {
            "code": "LIM-10-33",
            "name": "Vitis",
            "ubigeo": "151033"
          },
          {
            "code": "LIM-10-32",
            "name": "Viñac",
            "ubigeo": "151032"
          },
          {
            "code": "LIM-10-01",
            "name": "Yauyos",
            "ubigeo": "151001"
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
        "code": "LOR-02",
        "name": "Alto Amazonas",
        "districts": [
          {
            "code": "LOR-02-02",
            "name": "Balsapuerto",
            "ubigeo": "160202"
          },
          {
            "code": "LOR-02-05",
            "name": "Jeberos",
            "ubigeo": "160205"
          },
          {
            "code": "LOR-02-06",
            "name": "Lagunas",
            "ubigeo": "160206"
          },
          {
            "code": "LOR-02-10",
            "name": "Santa Cruz",
            "ubigeo": "160210"
          },
          {
            "code": "LOR-02-11",
            "name": "Teniente Cesar Lopez Rojas",
            "ubigeo": "160211"
          },
          {
            "code": "LOR-02-01",
            "name": "Yurimaguas",
            "ubigeo": "160201"
          }
        ]
      },
      {
        "code": "LOR-07",
        "name": "Datem del Marañon",
        "districts": [
          {
            "code": "LOR-07-06",
            "name": "Andoas",
            "ubigeo": "160706"
          },
          {
            "code": "LOR-07-01",
            "name": "Barranca",
            "ubigeo": "160701"
          },
          {
            "code": "LOR-07-02",
            "name": "Cahuapanas",
            "ubigeo": "160702"
          },
          {
            "code": "LOR-07-03",
            "name": "Manseriche",
            "ubigeo": "160703"
          },
          {
            "code": "LOR-07-04",
            "name": "Morona",
            "ubigeo": "160704"
          },
          {
            "code": "LOR-07-05",
            "name": "Pastaza",
            "ubigeo": "160705"
          }
        ]
      },
      {
        "code": "LOR-03",
        "name": "Loreto",
        "districts": [
          {
            "code": "LOR-03-01",
            "name": "Nauta",
            "ubigeo": "160301"
          },
          {
            "code": "LOR-03-02",
            "name": "Parinari",
            "ubigeo": "160302"
          },
          {
            "code": "LOR-03-03",
            "name": "Tigre",
            "ubigeo": "160303"
          },
          {
            "code": "LOR-03-04",
            "name": "Trompeteros",
            "ubigeo": "160304"
          },
          {
            "code": "LOR-03-05",
            "name": "Urarinas",
            "ubigeo": "160305"
          }
        ]
      },
      {
        "code": "LOR-04",
        "name": "Mariscal Ramon Castilla",
        "districts": [
          {
            "code": "LOR-04-02",
            "name": "Pebas",
            "ubigeo": "160402"
          },
          {
            "code": "LOR-04-01",
            "name": "Ramon Castilla",
            "ubigeo": "160401"
          },
          {
            "code": "LOR-04-04",
            "name": "San Pablo",
            "ubigeo": "160404"
          },
          {
            "code": "LOR-04-03",
            "name": "Yavari",
            "ubigeo": "160403"
          }
        ]
      },
      {
        "code": "LOR-01",
        "name": "Maynas",
        "districts": [
          {
            "code": "LOR-01-02",
            "name": "Alto Nanay",
            "ubigeo": "160102"
          },
          {
            "code": "LOR-01-12",
            "name": "Belen",
            "ubigeo": "160112"
          },
          {
            "code": "LOR-01-03",
            "name": "Fernando Lores",
            "ubigeo": "160103"
          },
          {
            "code": "LOR-01-04",
            "name": "Indiana",
            "ubigeo": "160104"
          },
          {
            "code": "LOR-01-01",
            "name": "Iquitos",
            "ubigeo": "160101"
          },
          {
            "code": "LOR-01-05",
            "name": "Las Amazonas",
            "ubigeo": "160105"
          },
          {
            "code": "LOR-01-06",
            "name": "Mazan",
            "ubigeo": "160106"
          },
          {
            "code": "LOR-01-07",
            "name": "Napo",
            "ubigeo": "160107"
          },
          {
            "code": "LOR-01-08",
            "name": "Punchana",
            "ubigeo": "160108"
          },
          {
            "code": "LOR-07-01",
            "name": "Putumayo",
            "ubigeo": "160801"
          },
          {
            "code": "LOR-07-02",
            "name": "Rosa Panduro",
            "ubigeo": "160802"
          },
          {
            "code": "LOR-01-13",
            "name": "San Juan Bautista",
            "ubigeo": "160113"
          },
          {
            "code": "LOR-07-03",
            "name": "Teniente Manuel Clavero",
            "ubigeo": "160803"
          },
          {
            "code": "LOR-01-10",
            "name": "Torres Causana",
            "ubigeo": "160110"
          },
          {
            "code": "LOR-07-04",
            "name": "Yaguas",
            "ubigeo": "160804"
          }
        ]
      },
      {
        "code": "LOR-05",
        "name": "Requena",
        "districts": [
          {
            "code": "LOR-05-02",
            "name": "Alto Tapiche",
            "ubigeo": "160502"
          },
          {
            "code": "LOR-05-03",
            "name": "Capelo",
            "ubigeo": "160503"
          },
          {
            "code": "LOR-05-04",
            "name": "Emilio San Martin",
            "ubigeo": "160504"
          },
          {
            "code": "LOR-05-10",
            "name": "Jenaro Herrera",
            "ubigeo": "160510"
          },
          {
            "code": "LOR-05-05",
            "name": "Maquia",
            "ubigeo": "160505"
          },
          {
            "code": "LOR-05-06",
            "name": "Puinahua",
            "ubigeo": "160506"
          },
          {
            "code": "LOR-05-01",
            "name": "Requena",
            "ubigeo": "160501"
          },
          {
            "code": "LOR-05-07",
            "name": "Saquena",
            "ubigeo": "160507"
          },
          {
            "code": "LOR-05-08",
            "name": "Soplin",
            "ubigeo": "160508"
          },
          {
            "code": "LOR-05-09",
            "name": "Tapiche",
            "ubigeo": "160509"
          },
          {
            "code": "LOR-05-11",
            "name": "Yaquerana",
            "ubigeo": "160511"
          }
        ]
      },
      {
        "code": "LOR-06",
        "name": "Ucayali",
        "districts": [
          {
            "code": "LOR-06-01",
            "name": "Contamana",
            "ubigeo": "160601"
          },
          {
            "code": "LOR-06-02",
            "name": "Inahuaya",
            "ubigeo": "160602"
          },
          {
            "code": "LOR-06-03",
            "name": "Padre Marquez",
            "ubigeo": "160603"
          },
          {
            "code": "LOR-06-04",
            "name": "Pampa Hermosa",
            "ubigeo": "160604"
          },
          {
            "code": "LOR-06-05",
            "name": "Sarayacu",
            "ubigeo": "160605"
          },
          {
            "code": "LOR-06-06",
            "name": "Vargas Guerra",
            "ubigeo": "160606"
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
        "code": "MAD-02",
        "name": "Manu",
        "districts": [
          {
            "code": "MAD-02-02",
            "name": "Fitzcarrald",
            "ubigeo": "170202"
          },
          {
            "code": "MAD-02-04",
            "name": "Huepetuhe",
            "ubigeo": "170204"
          },
          {
            "code": "MAD-02-03",
            "name": "Madre de Dios",
            "ubigeo": "170203"
          },
          {
            "code": "MAD-02-01",
            "name": "Manu",
            "ubigeo": "170201"
          }
        ]
      },
      {
        "code": "MAD-03",
        "name": "Tahuamanu",
        "districts": [
          {
            "code": "MAD-03-02",
            "name": "Iberia",
            "ubigeo": "170302"
          },
          {
            "code": "MAD-03-01",
            "name": "Iñapari",
            "ubigeo": "170301"
          },
          {
            "code": "MAD-03-03",
            "name": "Tahuamanu",
            "ubigeo": "170303"
          }
        ]
      },
      {
        "code": "MAD-01",
        "name": "Tambopata",
        "districts": [
          {
            "code": "MAD-01-02",
            "name": "Inambari",
            "ubigeo": "170102"
          },
          {
            "code": "MAD-01-04",
            "name": "Laberinto",
            "ubigeo": "170104"
          },
          {
            "code": "MAD-01-03",
            "name": "Las Piedras",
            "ubigeo": "170103"
          },
          {
            "code": "MAD-01-01",
            "name": "Tambopata",
            "ubigeo": "170101"
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
        "code": "MOQ-02",
        "name": "General Sanchez Cerr",
        "districts": [
          {
            "code": "MOQ-02-02",
            "name": "Chojata",
            "ubigeo": "180202"
          },
          {
            "code": "MOQ-02-03",
            "name": "Coalaque",
            "ubigeo": "180203"
          },
          {
            "code": "MOQ-02-04",
            "name": "Ichuña",
            "ubigeo": "180204"
          },
          {
            "code": "MOQ-02-05",
            "name": "La Capilla",
            "ubigeo": "180205"
          },
          {
            "code": "MOQ-02-06",
            "name": "Lloque",
            "ubigeo": "180206"
          },
          {
            "code": "MOQ-02-07",
            "name": "Matalaque",
            "ubigeo": "180207"
          },
          {
            "code": "MOQ-02-01",
            "name": "Omate",
            "ubigeo": "180201"
          },
          {
            "code": "MOQ-02-08",
            "name": "Puquina",
            "ubigeo": "180208"
          },
          {
            "code": "MOQ-02-09",
            "name": "Quinistaquillas",
            "ubigeo": "180209"
          },
          {
            "code": "MOQ-02-10",
            "name": "Ubinas",
            "ubigeo": "180210"
          },
          {
            "code": "MOQ-02-11",
            "name": "Yunga",
            "ubigeo": "180211"
          }
        ]
      },
      {
        "code": "MOQ-03",
        "name": "Ilo",
        "districts": [
          {
            "code": "MOQ-03-02",
            "name": "El Algarrobal",
            "ubigeo": "180302"
          },
          {
            "code": "MOQ-03-01",
            "name": "Ilo",
            "ubigeo": "180301"
          },
          {
            "code": "MOQ-03-03",
            "name": "Pacocha",
            "ubigeo": "180303"
          }
        ]
      },
      {
        "code": "MOQ-01",
        "name": "Mariscal Nieto",
        "districts": [
          {
            "code": "MOQ-01-02",
            "name": "Carumas",
            "ubigeo": "180102"
          },
          {
            "code": "MOQ-01-03",
            "name": "Cuchumbaya",
            "ubigeo": "180103"
          },
          {
            "code": "MOQ-01-01",
            "name": "Moquegua",
            "ubigeo": "180101"
          },
          {
            "code": "MOQ-01-04",
            "name": "Samegua",
            "ubigeo": "180104"
          },
          {
            "code": "MOQ-01-05",
            "name": "San Cristobal",
            "ubigeo": "180105"
          },
          {
            "code": "MOQ-01-06",
            "name": "Torata",
            "ubigeo": "180106"
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
        "code": "PAS-02",
        "name": "Daniel Alcides Carri",
        "districts": [
          {
            "code": "PAS-02-02",
            "name": "Chacayan",
            "ubigeo": "190202"
          },
          {
            "code": "PAS-02-03",
            "name": "Goyllarisquizga",
            "ubigeo": "190203"
          },
          {
            "code": "PAS-02-04",
            "name": "Paucar",
            "ubigeo": "190204"
          },
          {
            "code": "PAS-02-05",
            "name": "San Pedro de Pillao",
            "ubigeo": "190205"
          },
          {
            "code": "PAS-02-06",
            "name": "Santa Ana de Tusi",
            "ubigeo": "190206"
          },
          {
            "code": "PAS-02-07",
            "name": "Tapuc",
            "ubigeo": "190207"
          },
          {
            "code": "PAS-02-08",
            "name": "Vilcabamba",
            "ubigeo": "190208"
          },
          {
            "code": "PAS-02-01",
            "name": "Yanahuanca",
            "ubigeo": "190201"
          }
        ]
      },
      {
        "code": "PAS-03",
        "name": "Oxapampa",
        "districts": [
          {
            "code": "PAS-03-02",
            "name": "Chontabamba",
            "ubigeo": "190302"
          },
          {
            "code": "PAS-03-08",
            "name": "Constitución",
            "ubigeo": "190308"
          },
          {
            "code": "PAS-03-03",
            "name": "Huancabamba",
            "ubigeo": "190303"
          },
          {
            "code": "PAS-03-01",
            "name": "Oxapampa",
            "ubigeo": "190301"
          },
          {
            "code": "PAS-03-04",
            "name": "Palcazu",
            "ubigeo": "190304"
          },
          {
            "code": "PAS-03-05",
            "name": "Pozuzo",
            "ubigeo": "190305"
          },
          {
            "code": "PAS-03-06",
            "name": "Puerto Bermudez",
            "ubigeo": "190306"
          },
          {
            "code": "PAS-03-07",
            "name": "Villa Rica",
            "ubigeo": "190307"
          }
        ]
      },
      {
        "code": "PAS-01",
        "name": "Pasco",
        "districts": [
          {
            "code": "PAS-01-01",
            "name": "Chaupimarca",
            "ubigeo": "190101"
          },
          {
            "code": "PAS-01-02",
            "name": "Huachon",
            "ubigeo": "190102"
          },
          {
            "code": "PAS-01-03",
            "name": "Huariaca",
            "ubigeo": "190103"
          },
          {
            "code": "PAS-01-04",
            "name": "Huayllay",
            "ubigeo": "190104"
          },
          {
            "code": "PAS-01-05",
            "name": "Ninacaca",
            "ubigeo": "190105"
          },
          {
            "code": "PAS-01-06",
            "name": "Pallanchacra",
            "ubigeo": "190106"
          },
          {
            "code": "PAS-01-07",
            "name": "Paucartambo",
            "ubigeo": "190107"
          },
          {
            "code": "PAS-01-08",
            "name": "San Francisco de Asis de Yarusyacan",
            "ubigeo": "190108"
          },
          {
            "code": "PAS-01-09",
            "name": "Simon Bolivar",
            "ubigeo": "190109"
          },
          {
            "code": "PAS-01-10",
            "name": "Ticlacayan",
            "ubigeo": "190110"
          },
          {
            "code": "PAS-01-11",
            "name": "Tinyahuarco",
            "ubigeo": "190111"
          },
          {
            "code": "PAS-01-12",
            "name": "Vicco",
            "ubigeo": "190112"
          },
          {
            "code": "PAS-01-13",
            "name": "Yanacancha",
            "ubigeo": "190113"
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
        "code": "PIU-02",
        "name": "Ayabaca",
        "districts": [
          {
            "code": "PIU-02-01",
            "name": "Ayabaca",
            "ubigeo": "200201"
          },
          {
            "code": "PIU-02-02",
            "name": "Frias",
            "ubigeo": "200202"
          },
          {
            "code": "PIU-02-03",
            "name": "Jilili",
            "ubigeo": "200203"
          },
          {
            "code": "PIU-02-04",
            "name": "Lagunas",
            "ubigeo": "200204"
          },
          {
            "code": "PIU-02-05",
            "name": "Montero",
            "ubigeo": "200205"
          },
          {
            "code": "PIU-02-06",
            "name": "Pacaipampa",
            "ubigeo": "200206"
          },
          {
            "code": "PIU-02-07",
            "name": "Paimas",
            "ubigeo": "200207"
          },
          {
            "code": "PIU-02-08",
            "name": "Sapillica",
            "ubigeo": "200208"
          },
          {
            "code": "PIU-02-09",
            "name": "Sicchez",
            "ubigeo": "200209"
          },
          {
            "code": "PIU-02-10",
            "name": "Suyo",
            "ubigeo": "200210"
          }
        ]
      },
      {
        "code": "PIU-03",
        "name": "Huancabamba",
        "districts": [
          {
            "code": "PIU-03-02",
            "name": "Canchaque",
            "ubigeo": "200302"
          },
          {
            "code": "PIU-03-03",
            "name": "El Carmen de La Frontera",
            "ubigeo": "200303"
          },
          {
            "code": "PIU-03-01",
            "name": "Huancabamba",
            "ubigeo": "200301"
          },
          {
            "code": "PIU-03-04",
            "name": "Huarmaca",
            "ubigeo": "200304"
          },
          {
            "code": "PIU-03-05",
            "name": "Lalaquiz",
            "ubigeo": "200305"
          },
          {
            "code": "PIU-03-06",
            "name": "San Miguel de El Faique",
            "ubigeo": "200306"
          },
          {
            "code": "PIU-03-07",
            "name": "Sondor",
            "ubigeo": "200307"
          },
          {
            "code": "PIU-03-08",
            "name": "Sondorillo",
            "ubigeo": "200308"
          }
        ]
      },
      {
        "code": "PIU-04",
        "name": "Morropon",
        "districts": [
          {
            "code": "PIU-04-02",
            "name": "Buenos Aires",
            "ubigeo": "200402"
          },
          {
            "code": "PIU-04-03",
            "name": "Chalaco",
            "ubigeo": "200403"
          },
          {
            "code": "PIU-04-01",
            "name": "Chulucanas",
            "ubigeo": "200401"
          },
          {
            "code": "PIU-04-04",
            "name": "La Matanza",
            "ubigeo": "200404"
          },
          {
            "code": "PIU-04-05",
            "name": "Morropon",
            "ubigeo": "200405"
          },
          {
            "code": "PIU-04-06",
            "name": "Salitral",
            "ubigeo": "200406"
          },
          {
            "code": "PIU-04-07",
            "name": "San Juan de Bigote",
            "ubigeo": "200407"
          },
          {
            "code": "PIU-04-08",
            "name": "Santa Catalina de Mossa",
            "ubigeo": "200408"
          },
          {
            "code": "PIU-04-09",
            "name": "Santo Domingo",
            "ubigeo": "200409"
          },
          {
            "code": "PIU-04-10",
            "name": "Yamango",
            "ubigeo": "200410"
          }
        ]
      },
      {
        "code": "PIU-05",
        "name": "Paita",
        "districts": [
          {
            "code": "PIU-05-02",
            "name": "Amotape",
            "ubigeo": "200502"
          },
          {
            "code": "PIU-05-03",
            "name": "Arenal",
            "ubigeo": "200503"
          },
          {
            "code": "PIU-05-04",
            "name": "Colan",
            "ubigeo": "200504"
          },
          {
            "code": "PIU-05-05",
            "name": "La Huaca",
            "ubigeo": "200505"
          },
          {
            "code": "PIU-05-01",
            "name": "Paita",
            "ubigeo": "200501"
          },
          {
            "code": "PIU-05-06",
            "name": "Tamarindo",
            "ubigeo": "200506"
          },
          {
            "code": "PIU-05-07",
            "name": "Vichayal",
            "ubigeo": "200507"
          }
        ]
      },
      {
        "code": "PIU-01",
        "name": "Piura",
        "districts": [
          {
            "code": "PIU-01-15",
            "name": "26 de Octubre",
            "ubigeo": "200115"
          },
          {
            "code": "PIU-01-04",
            "name": "Castilla",
            "ubigeo": "200104"
          },
          {
            "code": "PIU-01-05",
            "name": "Catacaos",
            "ubigeo": "200105"
          },
          {
            "code": "PIU-01-07",
            "name": "Cura Mori",
            "ubigeo": "200107"
          },
          {
            "code": "PIU-01-08",
            "name": "El Tallan",
            "ubigeo": "200108"
          },
          {
            "code": "PIU-01-09",
            "name": "La Arena",
            "ubigeo": "200109"
          },
          {
            "code": "PIU-01-10",
            "name": "La Union",
            "ubigeo": "200110"
          },
          {
            "code": "PIU-01-11",
            "name": "Las Lomas",
            "ubigeo": "200111"
          },
          {
            "code": "PIU-01-01",
            "name": "Piura",
            "ubigeo": "200101"
          },
          {
            "code": "PIU-01-14",
            "name": "Tambo Grande",
            "ubigeo": "200114"
          }
        ]
      },
      {
        "code": "PIU-08",
        "name": "Sechura",
        "districts": [
          {
            "code": "PIU-08-02",
            "name": "Bellavista de La Union",
            "ubigeo": "200802"
          },
          {
            "code": "PIU-08-03",
            "name": "Bernal",
            "ubigeo": "200803"
          },
          {
            "code": "PIU-08-04",
            "name": "Cristo Nos Valga",
            "ubigeo": "200804"
          },
          {
            "code": "PIU-08-06",
            "name": "Rinconada Llicuar",
            "ubigeo": "200806"
          },
          {
            "code": "PIU-08-01",
            "name": "Sechura",
            "ubigeo": "200801"
          },
          {
            "code": "PIU-08-05",
            "name": "Vice",
            "ubigeo": "200805"
          }
        ]
      },
      {
        "code": "PIU-06",
        "name": "Sullana",
        "districts": [
          {
            "code": "PIU-06-02",
            "name": "Bellavista",
            "ubigeo": "200602"
          },
          {
            "code": "PIU-06-03",
            "name": "Ignacio Escudero",
            "ubigeo": "200603"
          },
          {
            "code": "PIU-06-04",
            "name": "Lancones",
            "ubigeo": "200604"
          },
          {
            "code": "PIU-06-05",
            "name": "Marcavelica",
            "ubigeo": "200605"
          },
          {
            "code": "PIU-06-06",
            "name": "Miguel Checa",
            "ubigeo": "200606"
          },
          {
            "code": "PIU-06-07",
            "name": "Querecotillo",
            "ubigeo": "200607"
          },
          {
            "code": "PIU-06-08",
            "name": "Salitral",
            "ubigeo": "200608"
          },
          {
            "code": "PIU-06-01",
            "name": "Sullana",
            "ubigeo": "200601"
          }
        ]
      },
      {
        "code": "PIU-07",
        "name": "Talara",
        "districts": [
          {
            "code": "PIU-07-02",
            "name": "El Alto",
            "ubigeo": "200702"
          },
          {
            "code": "PIU-07-03",
            "name": "La Brea",
            "ubigeo": "200703"
          },
          {
            "code": "PIU-07-04",
            "name": "Lobitos",
            "ubigeo": "200704"
          },
          {
            "code": "PIU-07-05",
            "name": "Los Organos",
            "ubigeo": "200705"
          },
          {
            "code": "PIU-07-06",
            "name": "Mancora",
            "ubigeo": "200706"
          },
          {
            "code": "PIU-07-01",
            "name": "Pariñas",
            "ubigeo": "200701"
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
        "code": "PUN-02",
        "name": "Azangaro",
        "districts": [
          {
            "code": "PUN-02-02",
            "name": "Achaya",
            "ubigeo": "210202"
          },
          {
            "code": "PUN-02-03",
            "name": "Arapa",
            "ubigeo": "210203"
          },
          {
            "code": "PUN-02-04",
            "name": "Asillo",
            "ubigeo": "210204"
          },
          {
            "code": "PUN-02-01",
            "name": "Azangaro",
            "ubigeo": "210201"
          },
          {
            "code": "PUN-02-05",
            "name": "Caminaca",
            "ubigeo": "210205"
          },
          {
            "code": "PUN-02-06",
            "name": "Chupa",
            "ubigeo": "210206"
          },
          {
            "code": "PUN-02-07",
            "name": "Jose Domingo Choquehuanca",
            "ubigeo": "210207"
          },
          {
            "code": "PUN-02-08",
            "name": "Muñani",
            "ubigeo": "210208"
          },
          {
            "code": "PUN-02-09",
            "name": "Potoni",
            "ubigeo": "210209"
          },
          {
            "code": "PUN-02-10",
            "name": "Saman",
            "ubigeo": "210210"
          },
          {
            "code": "PUN-02-11",
            "name": "San Anton",
            "ubigeo": "210211"
          },
          {
            "code": "PUN-02-12",
            "name": "San Jose",
            "ubigeo": "210212"
          },
          {
            "code": "PUN-02-13",
            "name": "San Juan de Salinas",
            "ubigeo": "210213"
          },
          {
            "code": "PUN-02-14",
            "name": "Santiago de Pupuja",
            "ubigeo": "210214"
          },
          {
            "code": "PUN-02-15",
            "name": "Tirapata",
            "ubigeo": "210215"
          }
        ]
      },
      {
        "code": "PUN-03",
        "name": "Carabaya",
        "districts": [
          {
            "code": "PUN-03-02",
            "name": "Ajoyani",
            "ubigeo": "210302"
          },
          {
            "code": "PUN-03-03",
            "name": "Ayapata",
            "ubigeo": "210303"
          },
          {
            "code": "PUN-03-04",
            "name": "Coasa",
            "ubigeo": "210304"
          },
          {
            "code": "PUN-03-05",
            "name": "Corani",
            "ubigeo": "210305"
          },
          {
            "code": "PUN-03-06",
            "name": "Crucero",
            "ubigeo": "210306"
          },
          {
            "code": "PUN-03-07",
            "name": "Ituata",
            "ubigeo": "210307"
          },
          {
            "code": "PUN-03-01",
            "name": "Macusani",
            "ubigeo": "210301"
          },
          {
            "code": "PUN-03-08",
            "name": "Ollachea",
            "ubigeo": "210308"
          },
          {
            "code": "PUN-03-09",
            "name": "San Gaban",
            "ubigeo": "210309"
          },
          {
            "code": "PUN-03-10",
            "name": "Usicayos",
            "ubigeo": "210310"
          }
        ]
      },
      {
        "code": "PUN-04",
        "name": "Chucuito",
        "districts": [
          {
            "code": "PUN-04-02",
            "name": "Desaguadero",
            "ubigeo": "210402"
          },
          {
            "code": "PUN-04-03",
            "name": "Huacullani",
            "ubigeo": "210403"
          },
          {
            "code": "PUN-04-01",
            "name": "Juli",
            "ubigeo": "210401"
          },
          {
            "code": "PUN-04-04",
            "name": "Kelluyo",
            "ubigeo": "210404"
          },
          {
            "code": "PUN-04-05",
            "name": "Pisacoma",
            "ubigeo": "210405"
          },
          {
            "code": "PUN-04-06",
            "name": "Pomata",
            "ubigeo": "210406"
          },
          {
            "code": "PUN-04-07",
            "name": "Zepita",
            "ubigeo": "210407"
          }
        ]
      },
      {
        "code": "PUN-05",
        "name": "El Collao",
        "districts": [
          {
            "code": "PUN-05-02",
            "name": "Capazo",
            "ubigeo": "210502"
          },
          {
            "code": "PUN-05-05",
            "name": "Conduriri",
            "ubigeo": "210505"
          },
          {
            "code": "PUN-05-01",
            "name": "Ilave",
            "ubigeo": "210501"
          },
          {
            "code": "PUN-05-03",
            "name": "Pilcuyo",
            "ubigeo": "210503"
          },
          {
            "code": "PUN-05-04",
            "name": "Santa Rosa",
            "ubigeo": "210504"
          }
        ]
      },
      {
        "code": "PUN-06",
        "name": "Huancane",
        "districts": [
          {
            "code": "PUN-06-02",
            "name": "Cojata",
            "ubigeo": "210602"
          },
          {
            "code": "PUN-06-01",
            "name": "Huancane",
            "ubigeo": "210601"
          },
          {
            "code": "PUN-06-03",
            "name": "Huatasani",
            "ubigeo": "210603"
          },
          {
            "code": "PUN-06-04",
            "name": "Inchupalla",
            "ubigeo": "210604"
          },
          {
            "code": "PUN-06-05",
            "name": "Pusi",
            "ubigeo": "210605"
          },
          {
            "code": "PUN-06-06",
            "name": "Rosaspata",
            "ubigeo": "210606"
          },
          {
            "code": "PUN-06-07",
            "name": "Taraco",
            "ubigeo": "210607"
          },
          {
            "code": "PUN-06-08",
            "name": "Vilque Chico",
            "ubigeo": "210608"
          }
        ]
      },
      {
        "code": "PUN-07",
        "name": "Lampa",
        "districts": [
          {
            "code": "PUN-07-02",
            "name": "Cabanilla",
            "ubigeo": "210702"
          },
          {
            "code": "PUN-07-03",
            "name": "Calapuja",
            "ubigeo": "210703"
          },
          {
            "code": "PUN-07-01",
            "name": "Lampa",
            "ubigeo": "210701"
          },
          {
            "code": "PUN-07-04",
            "name": "Nicasio",
            "ubigeo": "210704"
          },
          {
            "code": "PUN-07-05",
            "name": "Ocuviri",
            "ubigeo": "210705"
          },
          {
            "code": "PUN-07-06",
            "name": "Palca",
            "ubigeo": "210706"
          },
          {
            "code": "PUN-07-07",
            "name": "Paratia",
            "ubigeo": "210707"
          },
          {
            "code": "PUN-07-08",
            "name": "Pucara",
            "ubigeo": "210708"
          },
          {
            "code": "PUN-07-09",
            "name": "Santa Lucia",
            "ubigeo": "210709"
          },
          {
            "code": "PUN-07-10",
            "name": "Vilavila",
            "ubigeo": "210710"
          }
        ]
      },
      {
        "code": "PUN-08",
        "name": "Melgar",
        "districts": [
          {
            "code": "PUN-08-02",
            "name": "Antauta",
            "ubigeo": "210802"
          },
          {
            "code": "PUN-08-01",
            "name": "Ayaviri",
            "ubigeo": "210801"
          },
          {
            "code": "PUN-08-03",
            "name": "Cupi",
            "ubigeo": "210803"
          },
          {
            "code": "PUN-08-04",
            "name": "Llalli",
            "ubigeo": "210804"
          },
          {
            "code": "PUN-08-05",
            "name": "Macari",
            "ubigeo": "210805"
          },
          {
            "code": "PUN-08-06",
            "name": "Nuñoa",
            "ubigeo": "210806"
          },
          {
            "code": "PUN-08-07",
            "name": "Orurillo",
            "ubigeo": "210807"
          },
          {
            "code": "PUN-08-08",
            "name": "Santa Rosa",
            "ubigeo": "210808"
          },
          {
            "code": "PUN-08-09",
            "name": "Umachiri",
            "ubigeo": "210809"
          }
        ]
      },
      {
        "code": "PUN-09",
        "name": "Moho",
        "districts": [
          {
            "code": "PUN-09-02",
            "name": "Conima",
            "ubigeo": "210902"
          },
          {
            "code": "PUN-09-03",
            "name": "Huayrapata",
            "ubigeo": "210903"
          },
          {
            "code": "PUN-09-01",
            "name": "Moho",
            "ubigeo": "210901"
          },
          {
            "code": "PUN-09-04",
            "name": "Tilali",
            "ubigeo": "210904"
          }
        ]
      },
      {
        "code": "PUN-01",
        "name": "Puno",
        "districts": [
          {
            "code": "PUN-01-02",
            "name": "Acora",
            "ubigeo": "210102"
          },
          {
            "code": "PUN-01-03",
            "name": "Amantani",
            "ubigeo": "210103"
          },
          {
            "code": "PUN-01-04",
            "name": "Atuncolla",
            "ubigeo": "210104"
          },
          {
            "code": "PUN-01-05",
            "name": "Capachica",
            "ubigeo": "210105"
          },
          {
            "code": "PUN-01-06",
            "name": "Chucuito",
            "ubigeo": "210106"
          },
          {
            "code": "PUN-01-07",
            "name": "Coata",
            "ubigeo": "210107"
          },
          {
            "code": "PUN-01-08",
            "name": "Huata",
            "ubigeo": "210108"
          },
          {
            "code": "PUN-01-09",
            "name": "Mañazo",
            "ubigeo": "210109"
          },
          {
            "code": "PUN-01-10",
            "name": "Paucarcolla",
            "ubigeo": "210110"
          },
          {
            "code": "PUN-01-11",
            "name": "Pichacani",
            "ubigeo": "210111"
          },
          {
            "code": "PUN-01-12",
            "name": "Plateria",
            "ubigeo": "210112"
          },
          {
            "code": "PUN-01-01",
            "name": "Puno",
            "ubigeo": "210101"
          },
          {
            "code": "PUN-01-13",
            "name": "San Antonio",
            "ubigeo": "210113"
          },
          {
            "code": "PUN-01-14",
            "name": "Tiquillaca",
            "ubigeo": "210114"
          },
          {
            "code": "PUN-01-15",
            "name": "Vilque",
            "ubigeo": "210115"
          }
        ]
      },
      {
        "code": "PUN-10",
        "name": "San Antonio de Putin",
        "districts": [
          {
            "code": "PUN-10-02",
            "name": "Ananea",
            "ubigeo": "211002"
          },
          {
            "code": "PUN-10-03",
            "name": "Pedro Vilca Apaza",
            "ubigeo": "211003"
          },
          {
            "code": "PUN-10-01",
            "name": "Putina",
            "ubigeo": "211001"
          },
          {
            "code": "PUN-10-04",
            "name": "Quilcapuncu",
            "ubigeo": "211004"
          },
          {
            "code": "PUN-10-05",
            "name": "Sina",
            "ubigeo": "211005"
          }
        ]
      },
      {
        "code": "PUN-11",
        "name": "San Roman",
        "districts": [
          {
            "code": "PUN-11-02",
            "name": "Cabana",
            "ubigeo": "211102"
          },
          {
            "code": "PUN-11-03",
            "name": "Cabanillas",
            "ubigeo": "211103"
          },
          {
            "code": "PUN-11-04",
            "name": "Caracoto",
            "ubigeo": "211104"
          },
          {
            "code": "PUN-11-01",
            "name": "Juliaca",
            "ubigeo": "211101"
          },
          {
            "code": "PUN-11-05",
            "name": "San Miguel",
            "ubigeo": "211105"
          }
        ]
      },
      {
        "code": "PUN-12",
        "name": "Sandia",
        "districts": [
          {
            "code": "PUN-12-09",
            "name": "Alto Inambari",
            "ubigeo": "211209"
          },
          {
            "code": "PUN-12-02",
            "name": "Cuyocuyo",
            "ubigeo": "211202"
          },
          {
            "code": "PUN-12-03",
            "name": "Limbani",
            "ubigeo": "211203"
          },
          {
            "code": "PUN-12-04",
            "name": "Patambuco",
            "ubigeo": "211204"
          },
          {
            "code": "PUN-12-05",
            "name": "Phara",
            "ubigeo": "211205"
          },
          {
            "code": "PUN-12-06",
            "name": "Quiaca",
            "ubigeo": "211206"
          },
          {
            "code": "PUN-12-07",
            "name": "San Juan del Oro",
            "ubigeo": "211207"
          },
          {
            "code": "PUN-12-10",
            "name": "San Pedro de Putina Punco",
            "ubigeo": "211210"
          },
          {
            "code": "PUN-12-01",
            "name": "Sandia",
            "ubigeo": "211201"
          },
          {
            "code": "PUN-12-08",
            "name": "Yanahuaya",
            "ubigeo": "211208"
          }
        ]
      },
      {
        "code": "PUN-13",
        "name": "Yunguyo",
        "districts": [
          {
            "code": "PUN-13-02",
            "name": "Anapia",
            "ubigeo": "211302"
          },
          {
            "code": "PUN-13-03",
            "name": "Copani",
            "ubigeo": "211303"
          },
          {
            "code": "PUN-13-04",
            "name": "Cuturapi",
            "ubigeo": "211304"
          },
          {
            "code": "PUN-13-05",
            "name": "Ollaraya",
            "ubigeo": "211305"
          },
          {
            "code": "PUN-13-06",
            "name": "Tinicachi",
            "ubigeo": "211306"
          },
          {
            "code": "PUN-13-07",
            "name": "Unicachi",
            "ubigeo": "211307"
          },
          {
            "code": "PUN-13-01",
            "name": "Yunguyo",
            "ubigeo": "211301"
          }
        ]
      }
    ]
  },
  {
    "code": "SAN",
    "name": "San Martin",
    "provinces": [
      {
        "code": "SAN-02",
        "name": "Bellavista",
        "districts": [
          {
            "code": "SAN-02-02",
            "name": "Alto Biavo",
            "ubigeo": "220202"
          },
          {
            "code": "SAN-02-03",
            "name": "Bajo Biavo",
            "ubigeo": "220203"
          },
          {
            "code": "SAN-02-01",
            "name": "Bellavista",
            "ubigeo": "220201"
          },
          {
            "code": "SAN-02-04",
            "name": "Huallaga",
            "ubigeo": "220204"
          },
          {
            "code": "SAN-02-05",
            "name": "San Pablo",
            "ubigeo": "220205"
          },
          {
            "code": "SAN-02-06",
            "name": "San Rafael",
            "ubigeo": "220206"
          }
        ]
      },
      {
        "code": "SAN-03",
        "name": "El Dorado",
        "districts": [
          {
            "code": "SAN-03-02",
            "name": "Agua Blanca",
            "ubigeo": "220302"
          },
          {
            "code": "SAN-03-01",
            "name": "San Jose de Sisa",
            "ubigeo": "220301"
          },
          {
            "code": "SAN-03-03",
            "name": "San Martin",
            "ubigeo": "220303"
          },
          {
            "code": "SAN-03-04",
            "name": "Santa Rosa",
            "ubigeo": "220304"
          },
          {
            "code": "SAN-03-05",
            "name": "Shatoja",
            "ubigeo": "220305"
          }
        ]
      },
      {
        "code": "SAN-04",
        "name": "Huallaga",
        "districts": [
          {
            "code": "SAN-04-02",
            "name": "Alto Saposoa",
            "ubigeo": "220402"
          },
          {
            "code": "SAN-04-03",
            "name": "El Eslabon",
            "ubigeo": "220403"
          },
          {
            "code": "SAN-04-04",
            "name": "Piscoyacu",
            "ubigeo": "220404"
          },
          {
            "code": "SAN-04-05",
            "name": "Sacanche",
            "ubigeo": "220405"
          },
          {
            "code": "SAN-04-01",
            "name": "Saposoa",
            "ubigeo": "220401"
          },
          {
            "code": "SAN-04-06",
            "name": "Tingo de Saposoa",
            "ubigeo": "220406"
          }
        ]
      },
      {
        "code": "SAN-05",
        "name": "Lamas",
        "districts": [
          {
            "code": "SAN-05-02",
            "name": "Alonso de Alvarado",
            "ubigeo": "220502"
          },
          {
            "code": "SAN-05-03",
            "name": "Barranquita",
            "ubigeo": "220503"
          },
          {
            "code": "SAN-05-04",
            "name": "Caynarachi",
            "ubigeo": "220504"
          },
          {
            "code": "SAN-05-05",
            "name": "Cuñumbuqui",
            "ubigeo": "220505"
          },
          {
            "code": "SAN-05-01",
            "name": "Lamas",
            "ubigeo": "220501"
          },
          {
            "code": "SAN-05-06",
            "name": "Pinto Recodo",
            "ubigeo": "220506"
          },
          {
            "code": "SAN-05-07",
            "name": "Rumisapa",
            "ubigeo": "220507"
          },
          {
            "code": "SAN-05-08",
            "name": "San Roque de Cumbaza",
            "ubigeo": "220508"
          },
          {
            "code": "SAN-05-09",
            "name": "Shanao",
            "ubigeo": "220509"
          },
          {
            "code": "SAN-05-10",
            "name": "Tabalosos",
            "ubigeo": "220510"
          },
          {
            "code": "SAN-05-11",
            "name": "Zapatero",
            "ubigeo": "220511"
          }
        ]
      },
      {
        "code": "SAN-06",
        "name": "Mariscal Caceres",
        "districts": [
          {
            "code": "SAN-06-02",
            "name": "Campanilla",
            "ubigeo": "220602"
          },
          {
            "code": "SAN-06-03",
            "name": "Huicungo",
            "ubigeo": "220603"
          },
          {
            "code": "SAN-06-01",
            "name": "Juanjui",
            "ubigeo": "220601"
          },
          {
            "code": "SAN-06-04",
            "name": "Pachiza",
            "ubigeo": "220604"
          },
          {
            "code": "SAN-06-05",
            "name": "Pajarillo",
            "ubigeo": "220605"
          }
        ]
      },
      {
        "code": "SAN-01",
        "name": "Moyobamba",
        "districts": [
          {
            "code": "SAN-01-02",
            "name": "Calzada",
            "ubigeo": "220102"
          },
          {
            "code": "SAN-01-03",
            "name": "Habana",
            "ubigeo": "220103"
          },
          {
            "code": "SAN-01-04",
            "name": "Jepelacio",
            "ubigeo": "220104"
          },
          {
            "code": "SAN-01-01",
            "name": "Moyobamba",
            "ubigeo": "220101"
          },
          {
            "code": "SAN-01-05",
            "name": "Soritor",
            "ubigeo": "220105"
          },
          {
            "code": "SAN-01-06",
            "name": "Yantalo",
            "ubigeo": "220106"
          }
        ]
      },
      {
        "code": "SAN-07",
        "name": "Picota",
        "districts": [
          {
            "code": "SAN-07-02",
            "name": "Buenos Aires",
            "ubigeo": "220702"
          },
          {
            "code": "SAN-07-03",
            "name": "Caspisapa",
            "ubigeo": "220703"
          },
          {
            "code": "SAN-07-01",
            "name": "Picota",
            "ubigeo": "220701"
          },
          {
            "code": "SAN-07-04",
            "name": "Pilluana",
            "ubigeo": "220704"
          },
          {
            "code": "SAN-07-05",
            "name": "Pucacaca",
            "ubigeo": "220705"
          },
          {
            "code": "SAN-07-06",
            "name": "San Cristobal",
            "ubigeo": "220706"
          },
          {
            "code": "SAN-07-07",
            "name": "San Hilarion",
            "ubigeo": "220707"
          },
          {
            "code": "SAN-07-08",
            "name": "Shamboyacu",
            "ubigeo": "220708"
          },
          {
            "code": "SAN-07-09",
            "name": "Tingo de Ponasa",
            "ubigeo": "220709"
          },
          {
            "code": "SAN-07-10",
            "name": "Tres Unidos",
            "ubigeo": "220710"
          }
        ]
      },
      {
        "code": "SAN-08",
        "name": "Rioja",
        "districts": [
          {
            "code": "SAN-08-02",
            "name": "Awajun",
            "ubigeo": "220802"
          },
          {
            "code": "SAN-08-03",
            "name": "Elias Soplin Vargas",
            "ubigeo": "220803"
          },
          {
            "code": "SAN-08-04",
            "name": "Nueva Cajamarca",
            "ubigeo": "220804"
          },
          {
            "code": "SAN-08-05",
            "name": "Pardo Miguel",
            "ubigeo": "220805"
          },
          {
            "code": "SAN-08-06",
            "name": "Posic",
            "ubigeo": "220806"
          },
          {
            "code": "SAN-08-01",
            "name": "Rioja",
            "ubigeo": "220801"
          },
          {
            "code": "SAN-08-07",
            "name": "San Fernando",
            "ubigeo": "220807"
          },
          {
            "code": "SAN-08-08",
            "name": "Yorongos",
            "ubigeo": "220808"
          },
          {
            "code": "SAN-08-09",
            "name": "Yuracyacu",
            "ubigeo": "220809"
          }
        ]
      },
      {
        "code": "SAN-09",
        "name": "San Martin",
        "districts": [
          {
            "code": "SAN-09-02",
            "name": "Alberto Leveau",
            "ubigeo": "220902"
          },
          {
            "code": "SAN-09-03",
            "name": "Cacatachi",
            "ubigeo": "220903"
          },
          {
            "code": "SAN-09-04",
            "name": "Chazuta",
            "ubigeo": "220904"
          },
          {
            "code": "SAN-09-05",
            "name": "Chipurana",
            "ubigeo": "220905"
          },
          {
            "code": "SAN-09-06",
            "name": "El Porvenir",
            "ubigeo": "220906"
          },
          {
            "code": "SAN-09-07",
            "name": "Huimbayoc",
            "ubigeo": "220907"
          },
          {
            "code": "SAN-09-08",
            "name": "Juan Guerra",
            "ubigeo": "220908"
          },
          {
            "code": "SAN-09-09",
            "name": "La Banda de Shilcayo",
            "ubigeo": "220909"
          },
          {
            "code": "SAN-09-10",
            "name": "Morales",
            "ubigeo": "220910"
          },
          {
            "code": "SAN-09-11",
            "name": "Papaplaya",
            "ubigeo": "220911"
          },
          {
            "code": "SAN-09-12",
            "name": "San Antonio",
            "ubigeo": "220912"
          },
          {
            "code": "SAN-09-13",
            "name": "Sauce",
            "ubigeo": "220913"
          },
          {
            "code": "SAN-09-14",
            "name": "Shapaja",
            "ubigeo": "220914"
          },
          {
            "code": "SAN-09-01",
            "name": "Tarapoto",
            "ubigeo": "220901"
          }
        ]
      },
      {
        "code": "SAN-10",
        "name": "Tocache",
        "districts": [
          {
            "code": "SAN-10-02",
            "name": "Nuevo Progreso",
            "ubigeo": "221002"
          },
          {
            "code": "SAN-10-03",
            "name": "Polvora",
            "ubigeo": "221003"
          },
          {
            "code": "SAN-10-04",
            "name": "Shunte",
            "ubigeo": "221004"
          },
          {
            "code": "SAN-10-01",
            "name": "Tocache",
            "ubigeo": "221001"
          },
          {
            "code": "SAN-10-05",
            "name": "Uchiza",
            "ubigeo": "221005"
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
        "code": "TAC-02",
        "name": "Candarave",
        "districts": [
          {
            "code": "TAC-02-02",
            "name": "Cairani",
            "ubigeo": "230202"
          },
          {
            "code": "TAC-02-03",
            "name": "Camilaca",
            "ubigeo": "230203"
          },
          {
            "code": "TAC-02-01",
            "name": "Candarave",
            "ubigeo": "230201"
          },
          {
            "code": "TAC-02-04",
            "name": "Curibaya",
            "ubigeo": "230204"
          },
          {
            "code": "TAC-02-05",
            "name": "Huanuara",
            "ubigeo": "230205"
          },
          {
            "code": "TAC-02-06",
            "name": "Quilahuani",
            "ubigeo": "230206"
          }
        ]
      },
      {
        "code": "TAC-03",
        "name": "Jorge Basadre",
        "districts": [
          {
            "code": "TAC-03-02",
            "name": "Ilabaya",
            "ubigeo": "230302"
          },
          {
            "code": "TAC-03-03",
            "name": "Ite",
            "ubigeo": "230303"
          },
          {
            "code": "TAC-03-01",
            "name": "Locumba",
            "ubigeo": "230301"
          }
        ]
      },
      {
        "code": "TAC-01",
        "name": "Tacna",
        "districts": [
          {
            "code": "TAC-01-02",
            "name": "Alto de La Alianza",
            "ubigeo": "230102"
          },
          {
            "code": "TAC-01-03",
            "name": "Calana",
            "ubigeo": "230103"
          },
          {
            "code": "TAC-01-04",
            "name": "Ciudad Nueva",
            "ubigeo": "230104"
          },
          {
            "code": "TAC-01-10",
            "name": "Coronel Gregorio Albarracin Lanchipa",
            "ubigeo": "230110"
          },
          {
            "code": "TAC-01-05",
            "name": "Inclan",
            "ubigeo": "230105"
          },
          {
            "code": "TAC-01-11",
            "name": "La Yarada-Los Palos",
            "ubigeo": "230111"
          },
          {
            "code": "TAC-01-06",
            "name": "Pachia",
            "ubigeo": "230106"
          },
          {
            "code": "TAC-01-07",
            "name": "Palca",
            "ubigeo": "230107"
          },
          {
            "code": "TAC-01-08",
            "name": "Pocollay",
            "ubigeo": "230108"
          },
          {
            "code": "TAC-01-09",
            "name": "Sama",
            "ubigeo": "230109"
          },
          {
            "code": "TAC-01-01",
            "name": "Tacna",
            "ubigeo": "230101"
          }
        ]
      },
      {
        "code": "TAC-04",
        "name": "Tarata",
        "districts": [
          {
            "code": "TAC-04-03",
            "name": "Estique",
            "ubigeo": "230403"
          },
          {
            "code": "TAC-04-04",
            "name": "Estique-Pampa",
            "ubigeo": "230404"
          },
          {
            "code": "TAC-04-02",
            "name": "Heroes Albarracin",
            "ubigeo": "230402"
          },
          {
            "code": "TAC-04-05",
            "name": "Sitajara",
            "ubigeo": "230405"
          },
          {
            "code": "TAC-04-06",
            "name": "Susapaya",
            "ubigeo": "230406"
          },
          {
            "code": "TAC-04-01",
            "name": "Tarata",
            "ubigeo": "230401"
          },
          {
            "code": "TAC-04-07",
            "name": "Tarucachi",
            "ubigeo": "230407"
          },
          {
            "code": "TAC-04-08",
            "name": "Ticaco",
            "ubigeo": "230408"
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
        "code": "TUM-02",
        "name": "Contralmirante Villa",
        "districts": [
          {
            "code": "TUM-02-03",
            "name": "Canoas de Punta Sal",
            "ubigeo": "240203"
          },
          {
            "code": "TUM-02-02",
            "name": "Casitas",
            "ubigeo": "240202"
          },
          {
            "code": "TUM-02-01",
            "name": "Zorritos",
            "ubigeo": "240201"
          }
        ]
      },
      {
        "code": "TUM-01",
        "name": "Tumbes",
        "districts": [
          {
            "code": "TUM-01-02",
            "name": "Corrales",
            "ubigeo": "240102"
          },
          {
            "code": "TUM-01-03",
            "name": "La Cruz",
            "ubigeo": "240103"
          },
          {
            "code": "TUM-01-04",
            "name": "Pampas de Hospital",
            "ubigeo": "240104"
          },
          {
            "code": "TUM-01-05",
            "name": "San Jacinto",
            "ubigeo": "240105"
          },
          {
            "code": "TUM-01-06",
            "name": "San Juan de La Virgen",
            "ubigeo": "240106"
          },
          {
            "code": "TUM-01-01",
            "name": "Tumbes",
            "ubigeo": "240101"
          }
        ]
      },
      {
        "code": "TUM-03",
        "name": "Zarumilla",
        "districts": [
          {
            "code": "TUM-03-02",
            "name": "Aguas Verdes",
            "ubigeo": "240302"
          },
          {
            "code": "TUM-03-03",
            "name": "Matapalo",
            "ubigeo": "240303"
          },
          {
            "code": "TUM-03-04",
            "name": "Papayal",
            "ubigeo": "240304"
          },
          {
            "code": "TUM-03-01",
            "name": "Zarumilla",
            "ubigeo": "240301"
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
        "code": "UCA-02",
        "name": "Atalaya",
        "districts": [
          {
            "code": "UCA-02-01",
            "name": "Raymondi",
            "ubigeo": "250201"
          },
          {
            "code": "UCA-02-02",
            "name": "Sepahua",
            "ubigeo": "250202"
          },
          {
            "code": "UCA-02-03",
            "name": "Tahuania",
            "ubigeo": "250203"
          },
          {
            "code": "UCA-02-04",
            "name": "Yurua",
            "ubigeo": "250204"
          }
        ]
      },
      {
        "code": "UCA-01",
        "name": "Coronel Portillo",
        "districts": [
          {
            "code": "UCA-01-01",
            "name": "Calleria",
            "ubigeo": "250101"
          },
          {
            "code": "UCA-01-02",
            "name": "Campoverde",
            "ubigeo": "250102"
          },
          {
            "code": "UCA-01-03",
            "name": "Iparia",
            "ubigeo": "250103"
          },
          {
            "code": "UCA-01-07",
            "name": "Manantay",
            "ubigeo": "250107"
          },
          {
            "code": "UCA-01-04",
            "name": "Masisea",
            "ubigeo": "250104"
          },
          {
            "code": "UCA-01-06",
            "name": "Nueva Requena",
            "ubigeo": "250106"
          },
          {
            "code": "UCA-01-05",
            "name": "Yarinacocha",
            "ubigeo": "250105"
          }
        ]
      },
      {
        "code": "UCA-03",
        "name": "Padre Abad",
        "districts": [
          {
            "code": "UCA-03-05",
            "name": "Alexander von Humboldt",
            "ubigeo": "250305"
          },
          {
            "code": "UCA-03-03",
            "name": "Curimana",
            "ubigeo": "250303"
          },
          {
            "code": "UCA-03-02",
            "name": "Irazola",
            "ubigeo": "250302"
          },
          {
            "code": "UCA-03-04",
            "name": "Neshuya",
            "ubigeo": "250304"
          },
          {
            "code": "UCA-03-01",
            "name": "Padre Abad",
            "ubigeo": "250301"
          }
        ]
      },
      {
        "code": "UCA-04",
        "name": "Purus",
        "districts": [
          {
            "code": "UCA-04-01",
            "name": "Purus",
            "ubigeo": "250401"
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
  return PERU_UBIGEO;
}

/**
 * GET PROVINCES BY DEPARTMENT
 * ---------------------------
 * Returns provinces for a specific department
 */
export function getProvincesByDepartment(departmentCode: string): Province[] {
  const department = PERU_UBIGEO.find(d => d.code === departmentCode);
  return department ? department.provinces : [];
}

/**
 * GET DISTRICTS BY PROVINCE
 * -------------------------
 * Returns districts for a specific department and province
 */
export function getDistrictsByProvince(departmentCode: string, provinceCode: string): District[] {
  const department = PERU_UBIGEO.find(d => d.code === departmentCode);
  if (!department) return [];

  const province = department.provinces.find(p => p.code === provinceCode);
  return province ? province.districts : [];
}

/**
 * GET DISTRICT BY UBIGEO
 * ----------------------
 * Returns district information for a specific UBIGEO code
 */
export function getDistrictByUbigeo(ubigeo: string): District | null {
  for (const department of PERU_UBIGEO) {
    for (const province of department.provinces) {
      for (const district of province.districts) {
        if (district.ubigeo === ubigeo) {
          return district;
        }
      }
    }
  }
  return null;
}

/**
 * SEARCH ADMINISTRATIVE DIVISIONS
 * -------------------------------
 * Searches for administrative divisions by name
 */
export function searchAdministrativeDivisions(query: string): Array<{department: Department, province?: Province, district?: District}> {
  const results: Array<{department: Department, province: Province, district?: District}> = [];
  const searchTerm = query.toLowerCase();

  for (const department of PERU_UBIGEO) {
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
      results.push({ department, province: department.provinces[0] });
    }
  }

  return results;
}
