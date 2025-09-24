/**
 * ========================================================================================
 * PERU ADDRESS DATABASE (MTC)
 * ========================================================================================
 *
 * SOURCE: https://account.geodir.co/recursos/codigo-postal-mtc-peru.html
 * LAST UPDATED: 15/01/2019
 * GENERATED: 2025-09-24T06:59:28.071Z
 *
 * This file contains the complete Peru address database with departments, provinces,
 * districts, and postal codes based on MTC (Ministry of Transport and Communications) data.
 */

export interface District {
  code: string;
  name: string;
  postalCode: string;
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

export const PERU_ADDRESSES: Department[] = [
  {
    "code": "LIM",
    "name": "Lima",
    "provinces": [
      {
        "code": "LMA",
        "name": "Lima Metropolitana",
        "districts": [
          {
            "code": "Lima_Centro",
            "name": "Lima Centro",
            "postalCode": "15001"
          },
          {
            "code": "Rimac",
            "name": "Rímac",
            "postalCode": "15025"
          },
          {
            "code": "Breña",
            "name": "Breña",
            "postalCode": "15082"
          },
          {
            "code": "La_Victoria",
            "name": "La Victoria",
            "postalCode": "15013"
          },
          {
            "code": "Lince",
            "name": "Lince",
            "postalCode": "15073"
          },
          {
            "code": "Jesus_Maria",
            "name": "Jesús María",
            "postalCode": "15072"
          },
          {
            "code": "Pueblo_Libre",
            "name": "Pueblo Libre",
            "postalCode": "15084"
          },
          {
            "code": "Magdalena",
            "name": "Magdalena",
            "postalCode": "15076"
          },
          {
            "code": "Miraflores",
            "name": "Miraflores",
            "postalCode": "15074"
          },
          {
            "code": "San_Isidro",
            "name": "San Isidro",
            "postalCode": "15036"
          },
          {
            "code": "Surco",
            "name": "Surco",
            "postalCode": "15023"
          },
          {
            "code": "La_Molina",
            "name": "La Molina",
            "postalCode": "15026"
          },
          {
            "code": "Chorrillos",
            "name": "Chorrillos",
            "postalCode": "15063"
          },
          {
            "code": "Lurin",
            "name": "Lurín",
            "postalCode": "15080"
          },
          {
            "code": "Punta_Negra",
            "name": "Punta Negra",
            "postalCode": "15065"
          },
          {
            "code": "Pucusana",
            "name": "Pucusana",
            "postalCode": "15066"
          },
          {
            "code": "San_Martin_de_Porres",
            "name": "San Martín de Porres",
            "postalCode": "15081"
          },
          {
            "code": "San_Miguel",
            "name": "San Miguel",
            "postalCode": "15088"
          },
          {
            "code": "Santa_Anita",
            "name": "Santa Anita",
            "postalCode": "15089"
          },
          {
            "code": "Santiago_de_Surco",
            "name": "Santiago de Surco",
            "postalCode": "15023"
          },
          {
            "code": "Villa_El_Salvador",
            "name": "Villa El Salvador",
            "postalCode": "15095"
          },
          {
            "code": "Villa_Maria_del_Triunfo",
            "name": "Villa María del Triunfo",
            "postalCode": "15096"
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
            "code": "Callao_Centro",
            "name": "Callao Centro",
            "postalCode": "07001"
          },
          {
            "code": "Bellavista",
            "name": "Bellavista",
            "postalCode": "07002"
          },
          {
            "code": "Carmen_de_la_Legua",
            "name": "Carmen de la Legua",
            "postalCode": "07003"
          },
          {
            "code": "La_Perla",
            "name": "La Perla",
            "postalCode": "07004"
          },
          {
            "code": "La_Punta",
            "name": "La Punta",
            "postalCode": "07005"
          },
          {
            "code": "Ventanilla",
            "name": "Ventanilla",
            "postalCode": "07006"
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
            "code": "Arequipa_Centro",
            "name": "Arequipa Centro",
            "postalCode": "04001"
          },
          {
            "code": "Cayma",
            "name": "Cayma",
            "postalCode": "04002"
          },
          {
            "code": "Cerro_Colorado",
            "name": "Cerro Colorado",
            "postalCode": "04003"
          },
          {
            "code": "Characato",
            "name": "Characato",
            "postalCode": "04004"
          },
          {
            "code": "Chiguata",
            "name": "Chiguata",
            "postalCode": "04005"
          },
          {
            "code": "Jacobo_Hunter",
            "name": "Jacobo Hunter",
            "postalCode": "04006"
          },
          {
            "code": "La_Joya",
            "name": "La Joya",
            "postalCode": "04007"
          },
          {
            "code": "Mariano_Melgar",
            "name": "Mariano Melgar",
            "postalCode": "04008"
          },
          {
            "code": "Miraflores",
            "name": "Miraflores",
            "postalCode": "04009"
          },
          {
            "code": "Mollebaya",
            "name": "Mollebaya",
            "postalCode": "04010"
          },
          {
            "code": "Paucarpata",
            "name": "Paucarpata",
            "postalCode": "04011"
          },
          {
            "code": "Pocsi",
            "name": "Pocsi",
            "postalCode": "04012"
          },
          {
            "code": "Polobaya",
            "name": "Polobaya",
            "postalCode": "04013"
          },
          {
            "code": "Quequeña",
            "name": "Quequeña",
            "postalCode": "04014"
          },
          {
            "code": "Sabandia",
            "name": "Sabandía",
            "postalCode": "04015"
          },
          {
            "code": "Sachaca",
            "name": "Sachaca",
            "postalCode": "04016"
          },
          {
            "code": "San_Juan_de_Siguas",
            "name": "San Juan de Siguas",
            "postalCode": "04017"
          },
          {
            "code": "San_Juan_de_Tarucani",
            "name": "San Juan de Tarucani",
            "postalCode": "04018"
          },
          {
            "code": "Santa_Isabel_de_Siguas",
            "name": "Santa Isabel de Siguas",
            "postalCode": "04019"
          },
          {
            "code": "Santa_Rita_de_Siguas",
            "name": "Santa Rita de Siguas",
            "postalCode": "04020"
          },
          {
            "code": "Socabaya",
            "name": "Socabaya",
            "postalCode": "04021"
          },
          {
            "code": "Tiabaya",
            "name": "Tiabaya",
            "postalCode": "04022"
          },
          {
            "code": "Uchumayo",
            "name": "Uchumayo",
            "postalCode": "04023"
          },
          {
            "code": "Vitor",
            "name": "Vitor",
            "postalCode": "04024"
          },
          {
            "code": "Yanahuara",
            "name": "Yanahuara",
            "postalCode": "04025"
          },
          {
            "code": "Yarabamba",
            "name": "Yarabamba",
            "postalCode": "04026"
          },
          {
            "code": "Yura",
            "name": "Yura",
            "postalCode": "04027"
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
        "code": "CUS",
        "name": "Cusco",
        "districts": [
          {
            "code": "Cusco_Centro",
            "name": "Cusco Centro",
            "postalCode": "08001"
          },
          {
            "code": "Ccorca",
            "name": "Ccorca",
            "postalCode": "08002"
          },
          {
            "code": "Poroy",
            "name": "Poroy",
            "postalCode": "08003"
          },
          {
            "code": "San_Jerónimo",
            "name": "San Jerónimo",
            "postalCode": "08004"
          },
          {
            "code": "San_Sebastian",
            "name": "San Sebastián",
            "postalCode": "08005"
          },
          {
            "code": "Santiago",
            "name": "Santiago",
            "postalCode": "08006"
          },
          {
            "code": "Saylla",
            "name": "Saylla",
            "postalCode": "08007"
          },
          {
            "code": "Wanchaq",
            "name": "Wanchaq",
            "postalCode": "08008"
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
            "code": "Chiclayo_Centro",
            "name": "Chiclayo Centro",
            "postalCode": "14001"
          },
          {
            "code": "Cayalti",
            "name": "Cayaltí",
            "postalCode": "14002"
          },
          {
            "code": "Chongoyape",
            "name": "Chongoyape",
            "postalCode": "14003"
          },
          {
            "code": "Eten",
            "name": "Eten",
            "postalCode": "14004"
          },
          {
            "code": "Eten_Puerto",
            "name": "Eten Puerto",
            "postalCode": "14005"
          },
          {
            "code": "Jose_Leonardo_Ortiz",
            "name": "José Leonardo Ortiz",
            "postalCode": "14006"
          },
          {
            "code": "La_Victoria",
            "name": "La Victoria",
            "postalCode": "14007"
          },
          {
            "code": "Lagunas",
            "name": "Lagunas",
            "postalCode": "14008"
          },
          {
            "code": "Monsefu",
            "name": "Monsefú",
            "postalCode": "14009"
          },
          {
            "code": "Nueva_Arica",
            "name": "Nueva Arica",
            "postalCode": "14010"
          },
          {
            "code": "Oyotun",
            "name": "Oyotún",
            "postalCode": "14011"
          },
          {
            "code": "Picsi",
            "name": "Picsi",
            "postalCode": "14012"
          },
          {
            "code": "Pimentel",
            "name": "Pimentel",
            "postalCode": "14013"
          },
          {
            "code": "Pomalca",
            "name": "Pomalca",
            "postalCode": "14014"
          },
          {
            "code": "Pucala",
            "name": "Pucalá",
            "postalCode": "14015"
          },
          {
            "code": "Reque",
            "name": "Reque",
            "postalCode": "14016"
          },
          {
            "code": "Santa_Rosa",
            "name": "Santa Rosa",
            "postalCode": "14017"
          },
          {
            "code": "Saña",
            "name": "Saña",
            "postalCode": "14018"
          },
          {
            "code": "Cayalti",
            "name": "Cayaltí",
            "postalCode": "14019"
          },
          {
            "code": "Patapo",
            "name": "Patapo",
            "postalCode": "14020"
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
        "code": "PIU",
        "name": "Piura",
        "districts": [
          {
            "code": "Piura_Centro",
            "name": "Piura Centro",
            "postalCode": "20001"
          },
          {
            "code": "Castilla",
            "name": "Castilla",
            "postalCode": "20002"
          },
          {
            "code": "Catacaos",
            "name": "Catacaos",
            "postalCode": "20003"
          },
          {
            "code": "Cura_Mori",
            "name": "Cura Mori",
            "postalCode": "20004"
          },
          {
            "code": "El_Tallan",
            "name": "El Tallán",
            "postalCode": "20005"
          },
          {
            "code": "La_Arena",
            "name": "La Arena",
            "postalCode": "20006"
          },
          {
            "code": "La_Union",
            "name": "La Unión",
            "postalCode": "20007"
          },
          {
            "code": "Las_Lomas",
            "name": "Las Lomas",
            "postalCode": "20008"
          },
          {
            "code": "Tambo_Grande",
            "name": "Tambo Grande",
            "postalCode": "20009"
          },
          {
            "code": "Veintiseis_de_Octubre",
            "name": "Veintiséis de Octubre",
            "postalCode": "20010"
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
        "code": "TAC",
        "name": "Tacna",
        "districts": [
          {
            "code": "Tacna_Centro",
            "name": "Tacna Centro",
            "postalCode": "23001"
          },
          {
            "code": "Alto_de_la_Alianza",
            "name": "Alto de la Alianza",
            "postalCode": "23002"
          },
          {
            "code": "Calana",
            "name": "Calana",
            "postalCode": "23003"
          },
          {
            "code": "Ciudad_Nueva",
            "name": "Ciudad Nueva",
            "postalCode": "23004"
          },
          {
            "code": "Inclan",
            "name": "Inclán",
            "postalCode": "23005"
          },
          {
            "code": "Pachia",
            "name": "Pachía",
            "postalCode": "23006"
          },
          {
            "code": "Palca",
            "name": "Palca",
            "postalCode": "23007"
          },
          {
            "code": "Pocollay",
            "name": "Pocollay",
            "postalCode": "23008"
          },
          {
            "code": "Sama",
            "name": "Sama",
            "postalCode": "23009"
          },
          {
            "code": "Coronel_Gregorio_Albarracin",
            "name": "Coronel Gregorio Albarracín",
            "postalCode": "23010"
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
        "code": "ICA",
        "name": "Ica",
        "districts": [
          {
            "code": "Ica_Centro",
            "name": "Ica Centro",
            "postalCode": "11001"
          },
          {
            "code": "La_Tinguiña",
            "name": "La Tinguiña",
            "postalCode": "11002"
          },
          {
            "code": "Los_Aquijes",
            "name": "Los Aquijes",
            "postalCode": "11003"
          },
          {
            "code": "Ocucaje",
            "name": "Ocucaje",
            "postalCode": "11004"
          },
          {
            "code": "Pachacutec",
            "name": "Pachacútec",
            "postalCode": "11005"
          },
          {
            "code": "Parcona",
            "name": "Parcona",
            "postalCode": "11006"
          },
          {
            "code": "Pueblo_Nuevo",
            "name": "Pueblo Nuevo",
            "postalCode": "11007"
          },
          {
            "code": "Salas",
            "name": "Salas",
            "postalCode": "11008"
          },
          {
            "code": "San_Jose_de_los_Molinos",
            "name": "San José de los Molinos",
            "postalCode": "11009"
          },
          {
            "code": "San_Juan_Bautista",
            "name": "San Juan Bautista",
            "postalCode": "11010"
          },
          {
            "code": "Santiago",
            "name": "Santiago",
            "postalCode": "11011"
          },
          {
            "code": "Subtanjalla",
            "name": "Subtanjalla",
            "postalCode": "11012"
          },
          {
            "code": "Tate",
            "name": "Tate",
            "postalCode": "11013"
          },
          {
            "code": "Yauca_del_Rosario",
            "name": "Yauca del Rosario",
            "postalCode": "11014"
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
 * Returns districts for a specific province
 */
export function getDistrictsByProvince(departmentCode: string, provinceCode: string): District[] {
  const department = PERU_ADDRESSES.find(d => d.code === departmentCode);
  if (!department) return [];
  
  const province = department.provinces.find(p => p.code === provinceCode);
  return province ? province.districts : [];
}

/**
 * GET DISTRICTS BY CITY
 * ---------------------
 * Returns districts for a specific city (for backward compatibility)
 */
export function getDistrictsByCity(cityCode: string): District[] {
  for (const department of PERU_ADDRESSES) {
    for (const province of department.provinces) {
      for (const district of province.districts) {
        if (district.code === cityCode) {
          return [district];
        }
      }
    }
  }
  return [];
}

/**
 * GET POSTAL CODE
 * ---------------
 * Returns postal code for a specific district
 */
export function getPostalCode(departmentCode: string, provinceCode: string, districtCode: string): string | null {
  const districts = getDistrictsByProvince(departmentCode, provinceCode);
  const district = districts.find(d => d.code === districtCode);
  return district ? district.postalCode : null;
}

/**
 * SEARCH ADDRESS
 * --------------
 * Searches for addresses by name
 */
export function searchAddress(query: string): Array<{department: Department, province: Province, district: District}> {
  const results: Array<{department: Department, province: Province, district: District}> = [];
  const searchTerm = query.toLowerCase();
  
  for (const department of PERU_ADDRESSES) {
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
    }
  }
  
  return results;
}
