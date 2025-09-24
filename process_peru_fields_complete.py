#!/usr/bin/env python3
"""
Process Complete Peru Fields JSON for Shipping Components

This script processes the complete Peru geographic data from perufieldscomplete.json
and generates TypeScript files for use in shipping components.
"""

import json
import os

def load_peru_data():
    """Load the complete Peru geographic data."""
    with open('frontend/perufieldscomplete.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def create_complete_geographic_data(data):
    """Create the complete geographic data structure for TypeScript."""

    # Convert to flat structure for easier component usage
    departments = []
    provinces = []
    districts = []
    cities = []

    # First pass: collect all unique cities (districts that have postal codes are considered cities)
    city_map = {}

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

            for dist_name, postal_codes in prov_data.items():
                # Create district
                dist_code = f"{prov_code}-{dist_name[:3].upper()}"
                district = {
                    'code': dist_code,
                    'name': dist_name,
                    'postalCodes': postal_codes
                }
                province['districts'].append(district)
                districts.append(district)

                # Create city entry (district is also a city)
                city_code = f"{prov_code}-{dist_name[:3].upper()}"
                if city_code not in city_map:
                    city_map[city_code] = {
                        'code': city_code,
                        'name': dist_name,
                        'postalCodes': postal_codes
                    }
                    province['cities'].append(city_map[city_code])
                    cities.append(city_map[city_code])

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

    return departments, provinces, districts, cities

def generate_typescript_file(departments, provinces, districts, cities):
    """Generate the TypeScript file with complete Peru geographic data."""

    ts_content = f'''/**
 * ========================================================================================
 * COMPLETE PERU GEOGRAPHIC DATA FOR SHIPPING FIELDS
 * ========================================================================================
 *
 * SOURCE: Complete Peru fields data from perufieldscomplete.json
 * GENERATED: {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
 *
 * This file contains the complete geographic data for Peru's administrative divisions
 * used in shipping fields. Each district has associated postal codes.
 *
 * Structure: DEPARTAMENTO → PROVINCIA → DISTRITO → CÓDIGOS POSTALES
 * Statistics:
 * - Departments: {len(departments)}
 * - Provinces: {len(provinces)}
 * - Districts: {len(districts)}
 * - Cities: {len(cities)}
 *
 * NOTE: Cities are derived from districts for shipping field organization.
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

export const PERU_SHIPPING_DATA: Department[] = {json.dumps(departments, indent=2, ensure_ascii=False)};

/**
 * GET DEPARTMENTS
 * ---------------
 * Returns all departments
 */
export function getDepartments(): Department[] {{
  return PERU_SHIPPING_DATA;
}}

/**
 * GET PROVINCES BY DEPARTMENT
 * ---------------------------
 * Returns provinces for a specific department
 */
export function getProvincesByDepartment(departmentCode: string): Province[] {{
  const department = PERU_SHIPPING_DATA.find(d => d.code === departmentCode);
  return department ? department.provinces : [];
}}

/**
 * GET DISTRICTS BY PROVINCE
 * -------------------------
 * Returns districts for a specific department and province
 */
export function getDistrictsByProvince(departmentCode: string, provinceCode: string): District[] {{
  const department = PERU_SHIPPING_DATA.find(d => d.code === departmentCode);
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
  const department = PERU_SHIPPING_DATA.find(d => d.code === departmentCode);
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

  for (const department of PERU_SHIPPING_DATA) {{
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
 * GET DEFAULT VALUES FOR PERU
 * ---------------------------
 * Returns default values for Peru shipping fields
 */
export function getDefaultPeruValues() {{
  return {{
    department: 'LIM', // Lima
    province: 'LIM-LMA', // Lima Metropolitana
    district: 'LIM-LMA-MIR', // Miraflores
    postalCode: '15074' // Miraflores postal code
  }};
}}
'''

    with open('frontend/lib/peru-shipping-data.ts', 'w', encoding='utf-8') as f:
        f.write(ts_content)

    print(f"✅ Complete Peru shipping data saved as: frontend/lib/peru-shipping-data.ts")
    print(f"   - Departments: {len(departments)}")
    print(f"   - Provinces: {len(provinces)}")
    print(f"   - Districts: {len(districts)}")
    print(f"   - Cities: {len(cities)}")

def main():
    print("Loading complete Peru geographic data...")
    data = load_peru_data()

    print("Processing data structure...")
    departments, provinces, districts, cities = create_complete_geographic_data(data)

    print("Generating TypeScript file...")
    generate_typescript_file(departments, provinces, districts, cities)

    print("✅ Process completed successfully!")

if __name__ == "__main__":
    main()
