/**
 * ========================================================================================
 * PERU ADDRESS DATA
 * ========================================================================================
 *
 * PURPOSE:
 * --------
 * Comprehensive address data for Peru including departments, provinces, and districts.
 * Used for shipping address forms and location selection.
 *
 * STRUCTURE:
 * - Departments (Regions)
 * - Provinces (Cities within departments)
 * - Districts (Districts within provinces)
 * - Postal codes for major districts
 */

export interface PeruDepartment {
  code: string;
  name: string;
  provinces: PeruProvince[];
}

export interface PeruProvince {
  code: string;
  name: string;
  districts: PeruDistrict[];
}

export interface PeruDistrict {
  code: string;
  name: string;
  postalCode?: string;
}

export const peruAddresses: PeruDepartment[] = [
  {
    code: 'LIM',
    name: 'Lima',
    provinces: [
      {
        code: 'LMA',
        name: 'Lima Metropolitana',
        districts: [
          { code: 'MIR', name: 'Miraflores', postalCode: '15074' },
          { code: 'SAN', name: 'San Isidro', postalCode: '15036' },
          { code: 'SUR', name: 'Surco', postalCode: '15023' },
          { code: 'LAP', name: 'La Molina', postalCode: '15026' },
          { code: 'PUE', name: 'Pueblo Libre', postalCode: '15084' },
          { code: 'JES', name: 'Jesús María', postalCode: '15072' },
          { code: 'LIN', name: 'Lince', postalCode: '15073' },
          { code: 'MAG', name: 'Magdalena', postalCode: '15076' },
          { code: 'BRE', name: 'Breña', postalCode: '15082' },
          { code: 'CER', name: 'Cerro de Pasco', postalCode: '15001' },
          { code: 'CHI', name: 'Chorrillos', postalCode: '15063' },
          { code: 'LUR', name: 'Lurín', postalCode: '15080' },
          { code: 'PUN', name: 'Punta Negra', postalCode: '15065' },
          { code: 'PUC', name: 'Pucusana', postalCode: '15066' },
          { code: 'SAN_MAR', name: 'San Martín de Porres', postalCode: '15081' },
          { code: 'SAN_MIG', name: 'San Miguel', postalCode: '15088' },
          { code: 'SANTA_AN', name: 'Santa Anita', postalCode: '15089' },
          { code: 'SANTIAGO', name: 'Santiago de Surco', postalCode: '15023' },
          { code: 'VILLA_EL', name: 'Villa El Salvador', postalCode: '15095' },
          { code: 'VILLA_MAR', name: 'Villa María del Triunfo', postalCode: '15096' }
        ]
      },
      {
        code: 'CAL',
        name: 'Callao',
        districts: [
          { code: 'CAL_BELL', name: 'Bellavista', postalCode: '07001' },
          { code: 'CAL_CARM', name: 'Carmen de la Legua', postalCode: '07002' },
          { code: 'CAL_LA_P', name: 'La Perla', postalCode: '07003' },
          { code: 'CAL_LA_PU', name: 'La Punta', postalCode: '07004' },
          { code: 'CAL_VEN', name: 'Ventanilla', postalCode: '07005' }
        ]
      }
    ]
  },
  {
    code: 'ARE',
    name: 'Arequipa',
    provinces: [
      {
        code: 'ARE_ARE',
        name: 'Arequipa',
        districts: [
          { code: 'ARE_CER', name: 'Cerro Colorado', postalCode: '04001' },
          { code: 'ARE_CHA', name: 'Characato', postalCode: '04002' },
          { code: 'ARE_CHI', name: 'Chiguata', postalCode: '04003' },
          { code: 'ARE_JAC', name: 'Jacobo Hunter', postalCode: '04004' },
          { code: 'ARE_LA_J', name: 'La Joya', postalCode: '04005' },
          { code: 'ARE_MAR', name: 'Mariano Melgar', postalCode: '04006' },
          { code: 'ARE_MIR', name: 'Miraflores', postalCode: '04007' },
          { code: 'ARE_MOL', name: 'Mollebaya', postalCode: '04008' },
          { code: 'ARE_PAU', name: 'Paucarpata', postalCode: '04009' },
          { code: 'ARE_POC', name: 'Pocsi', postalCode: '04010' },
          { code: 'ARE_POL', name: 'Polobaya', postalCode: '04011' },
          { code: 'ARE_QUE', name: 'Quequeña', postalCode: '04012' },
          { code: 'ARE_SAB', name: 'Sabandia', postalCode: '04013' },
          { code: 'ARE_SAC', name: 'Sachaca', postalCode: '04014' },
          { code: 'ARE_SAN_J', name: 'San Juan de Siguas', postalCode: '04015' },
          { code: 'ARE_SAN_S', name: 'San Juan de Tarucani', postalCode: '04016' },
          { code: 'ARE_SANTA', name: 'Santa Isabel de Siguas', postalCode: '04017' },
          { code: 'ARE_SANTA_M', name: 'Santa Rita de Siguas', postalCode: '04018' },
          { code: 'ARE_SOC', name: 'Socabaya', postalCode: '04019' },
          { code: 'ARE_TIA', name: 'Tiabaya', postalCode: '04020' },
          { code: 'ARE_UC', name: 'Uchumayo', postalCode: '04021' },
          { code: 'ARE_VIT', name: 'Vitor', postalCode: '04022' },
          { code: 'ARE_YAN', name: 'Yanahuara', postalCode: '04023' },
          { code: 'ARE_YAR', name: 'Yarabamba', postalCode: '04024' },
          { code: 'ARE_YUR', name: 'Yura', postalCode: '04025' }
        ]
      }
    ]
  },
  {
    code: 'CUS',
    name: 'Cusco',
    provinces: [
      {
        code: 'CUS_CUS',
        name: 'Cusco',
        districts: [
          { code: 'CUS_CCOR', name: 'Ccorca', postalCode: '08001' },
          { code: 'CUS_POR', name: 'Poroy', postalCode: '08002' },
          { code: 'CUS_SAN_J', name: 'San Jerónimo', postalCode: '08003' },
          { code: 'CUS_SAN_S', name: 'San Sebastián', postalCode: '08004' },
          { code: 'CUS_SANTI', name: 'Santiago', postalCode: '08005' },
          { code: 'CUS_SID', name: 'Sidcay', postalCode: '08006' },
          { code: 'CUS_WAN', name: 'Wanchaq', postalCode: '08007' }
        ]
      }
    ]
  },
  {
    code: 'LAM',
    name: 'Lambayeque',
    provinces: [
      {
        code: 'LAM_CHI',
        name: 'Chiclayo',
        districts: [
          { code: 'LAM_CAY', name: 'Cayalti', postalCode: '14001' },
          { code: 'LAM_CHI', name: 'Chiclayo', postalCode: '14002' },
          { code: 'LAM_CHO', name: 'Chongoyape', postalCode: '14003' },
          { code: 'LAM_ET', name: 'Eten', postalCode: '14004' },
          { code: 'LAM_ET_P', name: 'Eten Puerto', postalCode: '14005' },
          { code: 'LAM_JOS', name: 'José Leonardo Ortiz', postalCode: '14006' },
          { code: 'LAM_LA_V', name: 'La Victoria', postalCode: '14007' },
          { code: 'LAM_LAG', name: 'Lagunas', postalCode: '14008' },
          { code: 'LAM_MON', name: 'Monsefú', postalCode: '14009' },
          { code: 'LAM_NY', name: 'Nueva Arica', postalCode: '14010' },
          { code: 'LAM_OY', name: 'Oyotún', postalCode: '14011' },
          { code: 'LAM_PAT', name: 'Patapo', postalCode: '14012' },
          { code: 'LAM_PIC', name: 'Picsi', postalCode: '14013' },
          { code: 'LAM_PIM', name: 'Pimentel', postalCode: '14014' },
          { code: 'LAM_POM', name: 'Pomalca', postalCode: '14015' },
          { code: 'LAM_PUC', name: 'Pucalá', postalCode: '14016' },
          { code: 'LAM_REQ', name: 'Reque', postalCode: '14017' },
          { code: 'LAM_SAÑ', name: 'Saña', postalCode: '14018' },
          { code: 'LAM_SAN_J', name: 'San José', postalCode: '14019' },
          { code: 'LAM_SANTA', name: 'Santa Rosa', postalCode: '14020' }
        ]
      }
    ]
  },
  {
    code: 'PIU',
    name: 'Piura',
    provinces: [
      {
        code: 'PIU_PIU',
        name: 'Piura',
        districts: [
          { code: 'PIU_CAST', name: 'Castilla', postalCode: '20001' },
          { code: 'PIU_CATA', name: 'Catacaos', postalCode: '20002' },
          { code: 'PIU_CURA', name: 'Cura Mori', postalCode: '20003' },
          { code: 'PIU_EL_T', name: 'El Tallán', postalCode: '20004' },
          { code: 'PIU_LA_A', name: 'La Arena', postalCode: '20005' },
          { code: 'PIU_LA_U', name: 'La Unión', postalCode: '20006' },
          { code: 'PIU_LAS_L', name: 'Las Lomas', postalCode: '20007' },
          { code: 'PIU_PIU', name: 'Piura', postalCode: '20008' },
          { code: 'PIU_SAN_J', name: 'San Juan de Bigote', postalCode: '20009' },
          { code: 'PIU_SANTA', name: 'Santa Rosa', postalCode: '20010' },
          { code: 'PIU_SULL', name: 'Sullana', postalCode: '20011' },
          { code: 'PIU_TAM', name: 'Tambogrande', postalCode: '20012' },
          { code: 'PIU_VEINT', name: 'Veintiséis de Octubre', postalCode: '20013' }
        ]
      }
    ]
  },
  {
    code: 'TAC',
    name: 'Tacna',
    provinces: [
      {
        code: 'TAC_TAC',
        name: 'Tacna',
        districts: [
          { code: 'TAC_ALTO', name: 'Alto de la Alianza', postalCode: '23001' },
          { code: 'TAC_CAL', name: 'Calana', postalCode: '23002' },
          { code: 'TAC_CIT', name: 'Ciudad Nueva', postalCode: '23003' },
          { code: 'TAC_INC', name: 'Inclán', postalCode: '23004' },
          { code: 'TAC_PAC', name: 'Pachía', postalCode: '23005' },
          { code: 'TAC_PAL', name: 'Palca', postalCode: '23006' },
          { code: 'TAC_POC', name: 'Pocollay', postalCode: '23007' },
          { code: 'TAC_SAC', name: 'Sama', postalCode: '23008' },
          { code: 'TAC_TAC', name: 'Tacna', postalCode: '23009' }
        ]
      }
    ]
  },
  {
    code: 'ICA',
    name: 'Ica',
    provinces: [
      {
        code: 'ICA_ICA',
        name: 'Ica',
        districts: [
          { code: 'ICA_ICA', name: 'Ica', postalCode: '11001' },
          { code: 'ICA_LA_T', name: 'La Tinguiña', postalCode: '11002' },
          { code: 'ICA_LOS_A', name: 'Los Aquijes', postalCode: '11003' },
          { code: 'ICA_OCU', name: 'Ocucaje', postalCode: '11004' },
          { code: 'ICA_PACH', name: 'Pachacutec', postalCode: '11005' },
          { code: 'ICA_PAR', name: 'Parcona', postalCode: '11006' },
          { code: 'ICA_PUE', name: 'Pueblo Nuevo', postalCode: '11007' },
          { code: 'ICA_SAL', name: 'Salas', postalCode: '11008' },
          { code: 'ICA_SAN_J', name: 'San José de los Molinos', postalCode: '11009' },
          { code: 'ICA_SAN_J_B', name: 'San Juan Bautista', postalCode: '11010' },
          { code: 'ICA_SANTI', name: 'Santiago', postalCode: '11011' },
          { code: 'ICA_SUB', name: 'Subtanjalla', postalCode: '11012' },
          { code: 'ICA_TATE', name: 'Tate', postalCode: '11013' },
          { code: 'ICA_YAU', name: 'Yauca del Rosario', postalCode: '11014' }
        ]
      }
    ]
  },
  {
    code: 'TRU',
    name: 'La Libertad',
    provinces: [
      {
        code: 'TRU_TRU',
        name: 'Trujillo',
        districts: [
          { code: 'TRU_EL_P', name: 'El Porvenir', postalCode: '13001' },
          { code: 'TRU_FLOR', name: 'Florencia de Mora', postalCode: '13002' },
          { code: 'TRU_HUA', name: 'Huanchaco', postalCode: '13003' },
          { code: 'TRU_LA_E', name: 'La Esperanza', postalCode: '13004' },
          { code: 'TRU_LAR', name: 'Laredo', postalCode: '13005' },
          { code: 'TRU_MOC', name: 'Moche', postalCode: '13006' },
          { code: 'TRU_POR', name: 'Poroto', postalCode: '13007' },
          { code: 'TRU_SAL', name: 'Salaverry', postalCode: '13008' },
          { code: 'TRU_SIM', name: 'Simbal', postalCode: '13009' },
          { code: 'TRU_TRU', name: 'Trujillo', postalCode: '13010' },
          { code: 'TRU_VIR', name: 'Víctor Larco Herrera', postalCode: '13011' }
        ]
      }
    ]
  }
];

/**
 * GET PERU ADDRESS DATA
 * ---------------------
 * Helper functions to get address data for Peru
 */

export const getPeruDepartments = (): PeruDepartment[] => {
  return peruAddresses;
};

export const getPeruProvinces = (departmentCode: string): PeruProvince[] => {
  const department = peruAddresses.find(d => d.code === departmentCode);
  return department ? department.provinces : [];
};

export const getPeruDistricts = (departmentCode: string, provinceCode: string): PeruDistrict[] => {
  const department = peruAddresses.find(d => d.code === departmentCode);
  if (!department) return [];
  
  const province = department.provinces.find(p => p.code === provinceCode);
  return province ? province.districts : [];
};

export const getDefaultPeruAddress = () => {
  return {
    department: 'LIM',
    province: 'LMA',
    district: 'MIR',
    postalCode: '15074'
  };
};
