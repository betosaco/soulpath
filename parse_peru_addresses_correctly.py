#!/usr/bin/env python3
"""
Parse Peru Addresses CSV Correctly

This script properly parses the geodir-codigo-postal-mtc CSV file,
handling comma-separated values in the Capitales (cities) and Distritos (districts) columns.

Structure:
- Codigo Postal: Zip code
- Capitales: Comma-separated city names (capitals)
- Distritos: Comma-separated district names
- Provincia: Province name
- Departamento: Department name

Each zip code can serve multiple cities and districts.
"""

import csv
import json
from collections import defaultdict

def parse_csv_file():
    """Parse the CSV file and create proper data structures."""

    # Data structures
    departments = {}
    provinces = {}
    districts = {}
    cities = {}
    zip_codes = {}

    with open('frontend/geodir-codigo-postal-mtc - codigo_postal.csv', 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)

        for row in reader:
            # Extract data
            zip_code = row['Codigo Postal'].strip()
            capitales_str = row['Capitales'].strip()
            distritos_str = row['Distritos'].strip()
            provincia = row['Provincia'].strip()
            departamento = row['Departamento'].strip()

            # Skip if missing essential data
            if not zip_code or not provincia or not departamento:
                continue

            # Parse comma-separated values
            # Remove quotes and split by comma
            capitales = [c.strip() for c in capitales_str.strip('"').split(',') if c.strip()]
            distritos = [d.strip() for d in distritos_str.strip('"').split(',') if d.strip()]

            # Initialize department if not exists
            if departamento not in departments:
                departments[departamento] = {
                    'code': departamento[:3].upper(),  # Create 3-letter code
                    'name': departamento,
                    'provinces': {}
                }

            # Initialize province if not exists
            if provincia not in departments[departamento]['provinces']:
                province_code = provincia[:3].upper()
                departments[departamento]['provinces'][provincia] = {
                    'code': province_code,
                    'name': provincia,
                    'districts': {},
                    'cities': {}
                }

            province_data = departments[departamento]['provinces'][provincia]

            # Process districts
            for district_name in distritos:
                if district_name not in province_data['districts']:
                    district_code = f"{province_code}-{district_name[:3].upper()}"
                    province_data['districts'][district_name] = {
                        'code': district_code,
                        'name': district_name,
                        'zipCodes': []
                    }

                # Add zip code to district
                district_data = province_data['districts'][district_name]
                if zip_code not in district_data['zipCodes']:
                    district_data['zipCodes'].append(zip_code)

            # Process cities (capitals)
            for city_name in capitales:
                if city_name not in province_data['cities']:
                    city_code = f"{province_code}-{city_name[:3].upper()}"
                    province_data['cities'][city_name] = {
                        'code': city_code,
                        'name': city_name,
                        'zipCodes': []
                    }

                # Add zip code to city
                city_data = province_data['cities'][city_name]
                if zip_code not in city_data['zipCodes']:
                    city_data['zipCodes'].append(zip_code)

    return departments

def create_flat_structure(departments):
    """Convert nested structure to flat arrays for the TypeScript file."""

    flat_departments = []
    all_provinces = []
    all_districts = []
    all_cities = []

    for dept_name, dept_data in departments.items():
        # Create department
        department = {
            'code': dept_data['code'],
            'name': dept_data['name'],
            'provinces': []
        }

        for prov_name, prov_data in dept_data['provinces'].items():
            # Create province
            province = {
                'code': prov_data['code'],
                'name': prov_data['name'],
                'districts': [],
                'cities': []
            }

            # Add districts to province
            for dist_name, dist_data in prov_data['districts'].items():
                district = {
                    'code': dist_data['code'],
                    'name': dist_data['name'],
                    'zipCodes': sorted(dist_data['zipCodes'])
                }
                province['districts'].append(district)
                all_districts.append(district)

            # Add cities to province
            for city_name, city_data in prov_data['cities'].items():
                city = {
                    'code': city_data['code'],
                    'name': city_data['name'],
                    'zipCodes': sorted(city_data['zipCodes'])
                }
                province['cities'].append(city)
                all_cities.append(city)

            # Sort districts and cities within province
            province['districts'].sort(key=lambda x: x['name'])
            province['cities'].sort(key=lambda x: x['name'])

            department['provinces'].append(province)
            all_provinces.append(province)

        # Sort provinces within department
        department['provinces'].sort(key=lambda x: x['name'])
        flat_departments.append(department)

    # Sort departments
    flat_departments.sort(key=lambda x: x['name'])

    return flat_departments, all_provinces, all_districts, all_cities

def generate_typescript_file(departments, provinces, districts, cities):
    """Generate the TypeScript file with the parsed data."""

    ts_content = f'''/**
 * ========================================================================================
 * PERU ADDRESS DATABASE (MTC) - CORRECTLY PARSED
 * ========================================================================================
 *
 * SOURCE: Complete MTC postal code data from geodir-codigo-postal-mtc
 * GENERATED: {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
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
 * - Departments: {len(departments)}
 * - Provinces: {len(provinces)}
 * - Districts: {len(districts)}
 * - Cities: {len(cities)}
 */

export interface District {{
  code: string;
  name: string;
  zipCodes: string[];
}}

export interface City {{
  code: string;
  name: string;
  zipCodes: string[];
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

export const PERU_ADDRESSES: Department[] = {json.dumps(departments, indent=2, ensure_ascii=False)};

/**
 * GET DEPARTMENTS
 * ---------------
 * Returns all departments
 */
export function getDepartments(): Department[] {{
  return PERU_ADDRESSES;
}}

/**
 * GET PROVINCES BY DEPARTMENT
 * ---------------------------
 * Returns provinces for a specific department
 */
export function getProvincesByDepartment(departmentCode: string): Province[] {{
  const department = PERU_ADDRESSES.find(d => d.code === departmentCode);
  return department ? department.provinces : [];
}}

/**
 * GET DISTRICTS BY PROVINCE
 * -------------------------
 * Returns districts for a specific department and province
 */
export function getDistrictsByProvince(departmentCode: string, provinceCode: string): District[] {{
  const department = PERU_ADDRESSES.find(d => d.code === departmentCode);
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
  const department = PERU_ADDRESSES.find(d => d.code === departmentCode);
  if (!department) return [];

  const province = department.provinces.find(p => p.code === provinceCode);
  return province ? province.cities : [];
}}

/**
 * GET POSTAL CODES FOR DISTRICT
 * -----------------------------
 * Returns all postal codes for a specific district
 */
export function getPostalCodesForDistrict(departmentCode: string, provinceCode: string, districtCode: string): string[] {{
  const districts = getDistrictsByProvince(departmentCode, provinceCode);
  const district = districts.find(d => d.code === districtCode);
  return district ? district.zipCodes : [];
}}

/**
 * GET POSTAL CODES FOR CITY
 * -------------------------
 * Returns all postal codes for a specific city
 */
export function getPostalCodesForCity(departmentCode: string, provinceCode: string, cityCode: string): string[] {{
  const cities = getCitiesByProvince(departmentCode, provinceCode);
  const city = cities.find(c => c.code === cityCode);
  return city ? city.zipCodes : [];
}}

/**
 * SEARCH ADDRESSES
 * ----------------
 * Searches for addresses by name
 */
export function searchAddresses(query: string): Array<{{department: Department, province: Province, district?: District, city?: City}}> {{
  const results: Array<{{department: Department, province: Province, district?: District, city?: City}}> = [];
  const searchTerm = query.toLowerCase();

  for (const department of PERU_ADDRESSES) {{
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
    }}
  }}

  return results;
}}
'''

    with open('frontend/lib/peru-addresses-mtc-corrected.ts', 'w', encoding='utf-8') as f:
        f.write(ts_content)

def main():
    print("Parsing Peru addresses CSV file...")
    departments = parse_csv_file()

    print("Creating flat structure...")
    flat_departments, provinces, districts, cities = create_flat_structure(departments)

    print("Generating TypeScript file...")
    generate_typescript_file(flat_departments, provinces, districts, cities)

    print(f"✅ Processing complete!")
    print(f"   - Departments: {len(flat_departments)}")
    print(f"   - Provinces: {len(provinces)}")
    print(f"   - Districts: {len(districts)}")
    print(f"   - Cities: {len(cities)}")
    print("   - File saved as: ../frontend/lib/peru-addresses-mtc-corrected.ts")

if __name__ == "__main__":
    main()
