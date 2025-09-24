#!/usr/bin/env python3
"""
Parse Peru Postal Codes CSV Correctly

This script correctly handles rows with single or multiple entries
and builds the robust JSON structure needed for the checkout page.
"""

import csv
import json

def entender_y_organizar_datos_geograficos(nombre_archivo_csv):
    """
    Lee un archivo CSV geográfico de Perú, "entendiendo" sus complejidades
    como valores separados por comas en una sola celda.

    Esta función procesa cada fila y, si encuentra múltiples distritos o capitales
    separados por comas, crea una entrada individual para cada uno en la
    estructura JSON final.

    La estructura final será:
    {
        "Departamento": {
            "Provincia": {
                "Distrito": [
                    {
                        "CodigoPostal": "XXXXX",
                        "Area": "Nombre de la Capital/Area"
                    }
                ]
            }
        }
    }
    """
    datos_organizados = {}

    try:
        with open(nombre_archivo_csv, mode='r', encoding='utf-8') as archivo_csv:
            lector_csv = csv.DictReader(archivo_csv)

            for fila in lector_csv:
                # --- PASO CLAVE: ENTENDER LA FILA ---

                # Extraer los datos base que son los mismos para toda la fila
                departamento = fila['Departamento'].strip()
                provincia = fila['Provincia'].strip()
                codigo_postal = fila['Codigo Postal'].strip()

                # Dividir los distritos y capitales por comas.
                # Usamos list comprehension y .strip() para limpiar espacios en blanco.
                distritos_lista = [d.strip() for d in fila['Distritos'].split(',')]
                capitales_lista = [c.strip() for c in fila['Capitales'].split(',')]

                # --- PASO 2: PROCESAR CADA ITEM INDIVIDUALMENTE ---

                # Iteramos a través de la lista de distritos que hemos creado
                for i, distrito_nombre in enumerate(distritos_lista):

                    # Asignamos la capital correspondiente.
                    # Si la lista de capitales es más corta, reutilizamos la primera
                    # o, como fallback seguro, usamos el propio nombre del distrito.
                    if i < len(capitales_lista):
                        area_nombre = capitales_lista[i]
                    else:
                        area_nombre = distrito_nombre # Un fallback lógico y seguro

                    # Crear el objeto de información postal para este distrito específico
                    info_postal = {
                        'CodigoPostal': codigo_postal,
                        'Area': area_nombre
                    }

                    # --- PASO 3: CONSTRUIR LA ESTRUCTURA JSON ---

                    # Construir la jerarquía como antes, pero ahora para cada item individual
                    if departamento not in datos_organizados:
                        datos_organizados[departamento] = {}

                    if provincia not in datos_organizados[departamento]:
                        datos_organizados[departamento][provincia] = {}

                    if distrito_nombre not in datos_organizados[departamento][provincia]:
                        datos_organizados[departamento][provincia][distrito_nombre] = []

                    # Añadir el objeto a la lista del distrito correspondiente
                    datos_organizados[departamento][provincia][distrito_nombre].append(info_postal)

    except FileNotFoundError:
        print(f"Error: No se encontró el archivo '{nombre_archivo_csv}'.")
        return None
    except KeyError as e:
        print(f"Error: El archivo CSV no tiene la columna esperada: {e}")
        return None

    return datos_organizados

def main():
    # --- EJECUCIÓN DEL SCRIPT ---
    nombre_csv = 'frontend/geodir-codigo-postal-mtc - codigo_postal.csv'
    datos_finales_para_ia = entender_y_organizar_datos_geograficos(nombre_csv)

    if datos_finales_para_ia:
        nombre_json = 'frontend/datos_geograficos_peru_inteligente.json'
        with open(nombre_json, 'w', encoding='utf-8') as f:
            json.dump(datos_finales_para_ia, f, indent=2, ensure_ascii=False)

        print(f"✅ Proceso completado. El script ha 'entendido' y organizado los datos.")
        print(f"La estructura JSON inteligente ha sido guardada en: '{nombre_json}'")

        # Now convert to TypeScript format for checkout page
        create_typescript_checkout_data(datos_finales_para_ia)

def create_typescript_checkout_data(data):
    """Convert the organized data to TypeScript format for checkout page use."""

    # Convert to flat structure for easier component usage
    departments = []
    provinces = []
    districts = []
    cities = []
    postal_codes = []

    # First pass: collect all unique cities
    city_map = {}  # city_name -> city_data

    for dept_name, dept_data in data.items():
        for prov_name, prov_data in dept_data.items():
            for dist_name, dist_data in prov_data.items():
                for postal_info in dist_data:
                    city_name = postal_info['Area']
                    if city_name not in city_map:
                        city_map[city_name] = {
                            'code': f"{dept_name[:3].upper()}-{prov_name[:3].upper()}-{city_name[:3].upper()}",
                            'name': city_name,
                            'postalCodes': []
                        }
                    if postal_info['CodigoPostal'] not in city_map[city_name]['postalCodes']:
                        city_map[city_name]['postalCodes'].append(postal_info['CodigoPostal'])

    for dept_name, dept_data in data.items():
        dept_code = dept_name[:3].upper()
        department = {
            'code': dept_code,
            'name': dept_name,
            'provinces': []
        }

        for prov_name, prov_data in dept_data.items():
            prov_code = f"{dept_code}-{prov_name[:3].upper()}"
            province = {
                'code': prov_code,
                'name': prov_name,
                'districts': [],
                'cities': []
            }

            for dist_name, dist_data in prov_data.items():
                dist_code = f"{prov_code}-{dist_name[:3].upper()}"
                district = {
                    'code': dist_code,
                    'name': dist_name,
                    'postalCodes': list(set([item['CodigoPostal'] for item in dist_data]))
                }
                province['districts'].append(district)
                districts.append(district)

            # Add cities that belong to this province
            for city_name, city_data in city_map.items():
                # Check if this city appears in any district of this province
                city_in_province = any(
                    city_name in [item['Area'] for item in prov_data.get(dist_name, [])]
                    for dist_name in prov_data.keys()
                )
                if city_in_province:
                    province['cities'].append(city_data)
                    cities.append(city_data)

            # Sort districts and cities
            province['districts'].sort(key=lambda x: x['name'])
            province['cities'].sort(key=lambda x: x['name'])

            department['provinces'].append(province)
            provinces.append(province)

        # Sort provinces
        department['provinces'].sort(key=lambda x: x['name'])
        departments.append(department)

    # Sort departments
    departments.sort(key=lambda x: x['name'])

    # Remove duplicates from cities list
    seen = set()
    cities = [x for x in cities if not (x['name'] in seen or seen.add(x['name']))]

    # Generate TypeScript file
    ts_content = f'''/**
 * ========================================================================================
 * PERU GEOGRAPHIC DATA FOR CHECKOUT ORGANIZATION
 * ========================================================================================
 *
 * SOURCE: Complete MTC postal code data, correctly parsed with comma-separated values
 * GENERATED: {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
 *
 * This file contains properly organized geographic data for Peru's administrative divisions.
 * Each district can have multiple postal codes, and comma-separated values are correctly split.
 *
 * Structure: DEPARTAMENTO → PROVINCIA → DISTRITO → CÓDIGOS POSTALES
 * Statistics:
 * - Departments: {len(departments)}
 * - Provinces: {len(provinces)}
 * - Districts: {len(districts)}
 *
 * NOTE: Postal codes are kept as reference data but remain manual input fields in forms.
 */

export interface PostalCodeInfo {{
  code: string;
  area: string;
}}

export interface District {{
  code: string;
  name: string;
  postalCodes: string[];
}}

export interface City {{
  code: string;
  name: string;
  postalCodes: string[];
}}

export interface Province {{
  code: string;
  name: string;
  districts: District[];
  cities: City[];
}}

export interface Department {{
  code: string;
  name: string;
  provinces: Province[];
}}

export const PERU_GEOGRAPHIC_DATA: Department[] = {json.dumps(departments, indent=2, ensure_ascii=False)};

/**
 * GET DEPARTMENTS
 * ---------------
 * Returns all departments
 */
export function getDepartments(): Department[] {{
  return PERU_GEOGRAPHIC_DATA;
}}

/**
 * GET PROVINCES BY DEPARTMENT
 * ---------------------------
 * Returns provinces for a specific department
 */
export function getProvincesByDepartment(departmentCode: string): Province[] {{
  const department = PERU_GEOGRAPHIC_DATA.find(d => d.code === departmentCode);
  return department ? department.provinces : [];
}}

/**
 * GET DISTRICTS BY PROVINCE
 * -------------------------
 * Returns districts for a specific department and province
 */
export function getDistrictsByProvince(departmentCode: string, provinceCode: string): District[] {{
  const department = PERU_GEOGRAPHIC_DATA.find(d => d.code === departmentCode);
  if (!department) return [];

  const province = department.provinces.find(p => p.code === provinceCode);
  return province ? province.districts : [];
}}

/**
 * GET CITIES BY PROVINCE
 * ----------------------
 * Returns cities for a specific department and province
 */
export function getCitiesByProvince(departmentCode: string, provinceCode: string): City[] {{
  const department = PERU_GEOGRAPHIC_DATA.find(d => d.code === departmentCode);
  if (!department) return [];

  const province = department.provinces.find(p => p.code === provinceCode);
  return province ? province.cities : [];
}}

/**
 * GET POSTAL CODES FOR DISTRICT
 * -----------------------------
 * Returns all postal codes available for a specific district
 */
export function getPostalCodesForDistrict(departmentCode: string, provinceCode: string, districtCode: string): string[] {{
  const districts = getDistrictsByProvince(departmentCode, provinceCode);
  const district = districts.find(d => d.code === districtCode);
  return district ? district.postalCodes : [];
}}

/**
 * GET POSTAL CODES FOR CITY
 * -------------------------
 * Returns all postal codes available for a specific city
 */
export function getPostalCodesForCity(departmentCode: string, provinceCode: string, cityCode: string): string[] {{
  const cities = getCitiesByProvince(departmentCode, provinceCode);
  const city = cities.find(c => c.code === cityCode);
  return city ? city.postalCodes : [];
}}

/**
 * SEARCH GEOGRAPHIC LOCATIONS
 * ---------------------------
 * Searches for departments, provinces, and districts by name
 */
export function searchGeographicLocations(query: string): Array<{{department: Department, province?: Province, district?: District, city?: City}}> {{
  const results: Array<{{department: Department, province?: Province, district?: District, city?: City}}> = [];
  const searchTerm = query.toLowerCase();

  for (const department of PERU_GEOGRAPHIC_DATA) {{
    // Search districts
    for (const province of department.provinces) {{
      for (const district of province.districts) {{
        if (
          department.name.toLowerCase().includes(searchTerm) ||
          province.name.toLowerCase().includes(searchTerm) ||
          district.name.toLowerCase().includes(searchTerm)
        ) {{
          results.push({{ department, province, district }});
        }}
      }}

      // Search cities
      for (const city of province.cities) {{
        if (
          department.name.toLowerCase().includes(searchTerm) ||
          province.name.toLowerCase().includes(searchTerm) ||
          city.name.toLowerCase().includes(searchTerm)
        ) {{
          results.push({{ department, province, city }});
        }}
      }}

      // Search provinces
      if (
        department.name.toLowerCase().includes(searchTerm) ||
        province.name.toLowerCase().includes(searchTerm)
      ) {{
        results.push({{ department, province }});
      }}
    }}

    // Search departments
    if (department.name.toLowerCase().includes(searchTerm)) {{
      results.push({{ department }});
    }}
  }}

  return results;
}}

/**
 * VALIDATE LOCATION SELECTION
 * ---------------------------
 * Validates if a department-province-district combination is valid
 */
export function validateLocationSelection(departmentCode: string, provinceCode: string, districtCode: string): boolean {{
  const districts = getDistrictsByProvince(departmentCode, provinceCode);
  return districts.some(d => d.code === districtCode);
}}
'''

    with open('frontend/lib/peru-geographic-data.ts', 'w', encoding='utf-8') as f:
        f.write(ts_content)

if __name__ == "__main__":
    main()
