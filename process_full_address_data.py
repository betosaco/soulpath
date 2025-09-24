#!/usr/bin/env python3
"""
Process Complete Peru Address Data with Capital Cities

This script processes the complete Peru address data from fullcodeaddressperu.json
and generates TypeScript files for use in shipping components.

Structure: Department -> Province -> Capital City -> District -> Postal Codes
"""

import json
import os

def load_address_data():
    """Load the complete Peru address data."""
    with open('frontend/components/ui/fullcodeaddressperu.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def create_complete_address_data(data):
    """Create the complete address data structure for TypeScript.
    
    Structure: Department -> Province -> Capital City -> District -> [Postal Codes]
    """
    
    # Convert to flat structure for easier component usage
    departments = []
    provinces = []
    districts = []
    cities = []

    # First pass: collect all unique cities and districts
    city_map = {}

    for dept_name, dept_data in data.items():
        dept_code = dept_name[:3].upper()
        department = {
            'code': dept_code,
            'name': dept_name,
            'provinces': []
        }

        # Level 2: Province
        for prov_name, prov_data in dept_data.items():
            prov_code = f"{dept_code}-{prov_name[:3].upper()}"
            province = {
                'code': prov_code,
                'name': prov_name,
                'districts': [],
                'cities': []
            }

            # Level 3: Capital City
            if isinstance(prov_data, dict):
                for capital_city_name, districts_data in prov_data.items():
                    # Create city entry for the capital city
                    city_code = f"{prov_code}-{capital_city_name[:3].upper()}"
                    if city_code not in city_map:
                        city_map[city_code] = {
                            'code': city_code,
                            'name': capital_city_name,
                            'postalCodes': []
                        }
                        cities.append(city_map[city_code])
                        province['cities'].append(city_map[city_code])

                    # Level 4: Districts
                    if isinstance(districts_data, dict):
                        for dist_name, postal_codes in districts_data.items():
                            # Level 5: Postal Codes
                            if isinstance(postal_codes, list):
                                # Create district
                                dist_code = f"{prov_code}-{dist_name[:3].upper()}"
                                district = {
                                    'code': dist_code,
                                    'name': dist_name,
                                    'postalCodes': postal_codes
                                }
                                province['districts'].append(district)
                                districts.append(district)

                                # Add postal codes to the capital city as well
                                for postal_code in postal_codes:
                                    if postal_code not in city_map[city_code]['postalCodes']:
                                        city_map[city_code]['postalCodes'].append(postal_code)

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

    # Debug: print some stats
    print(f"Processed {len(departments)} departments, {len(provinces)} provinces, {len(districts)} districts, {len(cities)} cities")

    return departments, provinces, districts, cities

def generate_typescript_file(departments, provinces, districts, cities):
    """Generate the TypeScript file with complete Peru address data."""

    ts_content = f'''/**
 * ========================================================================================
 * COMPLETE PERU ADDRESS DATA WITH CAPITAL CITIES
 * ========================================================================================
 *
 * SOURCE: Complete Peru address data from fullcodeaddressperu.json
 * GENERATED: {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
 *
 * This file contains the complete geographic data for Peru's administrative divisions
 * including capital cities for each province.
 *
 * Structure: DEPARTAMENTO → PROVINCIA → CAPITAL CITY → DISTRITO → CÓDIGOS POSTALES
 * Statistics:
 * - Departments: {len(departments)}
 * - Provinces: {len(provinces)}
 * - Districts: {len(districts)}
 * - Cities (Capital Cities): {len(cities)}
 *
 * NOTE: Cities represent provincial capital cities with associated postal codes.
 */

export interface PostalCodeInfo {{
  code: string;
  area: string;
}}

export interface City {{
  code: string;
  name: string;
  postalCodes: string[];
}}

export interface District {{
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

export const PERU_ADDRESS_DATA: Department[] = {json.dumps(departments, indent=2, ensure_ascii=False)};

/**
 * GET DEPARTMENTS
 * ---------------
 * Returns all departments
 */
export function getDepartments(): Department[] {{
  return PERU_ADDRESS_DATA;
}}

/**
 * GET PROVINCES BY DEPARTMENT
 * ---------------------------
 * Returns provinces for a specific department
 */
export function getProvincesByDepartment(departmentCode: string): Province[] {{
  const department = PERU_ADDRESS_DATA.find(d => d.code === departmentCode);
  return department ? department.provinces : [];
}}

/**
 * GET DISTRICTS BY PROVINCE
 * -------------------------
 * Returns districts for a specific department and province
 */
export function getDistrictsByProvince(departmentCode: string, provinceCode: string): District[] {{
  const department = PERU_ADDRESS_DATA.find(d => d.code === departmentCode);
  if (!department) return [];

  const province = department.provinces.find(p => p.code === provinceCode);
  return province ? province.districts : [];
}}

/**
 * GET CITIES BY PROVINCE
 * ----------------------
 * Returns cities (capital cities) for a specific department and province
 */
export function getCitiesByProvince(departmentCode: string, provinceCode: string): City[] {{
  const department = PERU_ADDRESS_DATA.find(d => d.code === departmentCode);
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
 * Searches for departments, provinces, districts, and cities by name
 */
export function searchGeographicLocations(query: string): Array<{{department: Department, province?: Province, district?: District, city?: City}}> {{
  const results: Array<{{department: Department, province?: Province, district?: District, city?: City}}> = [];
  const searchTerm = query.toLowerCase();

  for (const department of PERU_ADDRESS_DATA) {{
    // Search provinces
    for (const province of department.provinces) {{
      // Search districts
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

/**
 * GET CAPITAL CITY FOR PROVINCE
 * -----------------------------
 * Returns the capital city for a specific province
 */
export function getCapitalCityForProvince(departmentCode: string, provinceCode: string): City | null {{
  const cities = getCitiesByProvince(departmentCode, provinceCode);
  return cities.length > 0 ? cities[0] : null;
}}

/**
 * GET DEFAULT VALUES FOR PERU
 * ---------------------------
 * Returns default values for Peru shipping fields
 */
export function getDefaultPeruValues() {{
  return {{
    department: 'LIM', // Lima
    province: 'LIM-LIM', // Lima
    district: 'LIM-LIM-MIR', // Miraflores
    city: 'LIM-LIM-LIM', // Lima (capital city)
    postalCode: '15074' // Miraflores postal code
  }};
}}
'''

    with open('frontend/lib/peru-address-data.ts', 'w', encoding='utf-8') as f:
        f.write(ts_content)

    print(f"✅ Complete Peru address data saved as: frontend/lib/peru-address-data.ts")
    print(f"   - Departments: {len(departments)}")
    print(f"   - Provinces: {len(provinces)}")
    print(f"   - Districts: {len(districts)}")
    print(f"   - Cities (Capital Cities): {len(cities)}")

def main():
    print("Loading complete Peru address data...")
    data = load_address_data()

    print("Processing address data structure...")
    departments, provinces, districts, cities = create_complete_address_data(data)

    print("Generating TypeScript file...")
    generate_typescript_file(departments, provinces, districts, cities)

    print("✅ Process completed successfully!")

if __name__ == "__main__":
    main()
