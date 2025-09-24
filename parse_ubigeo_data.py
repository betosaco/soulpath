#!/usr/bin/env python3
"""
Parse Peru UBIGEO Data for Checkout Organization

This script parses the geodir-ubigeo-inei CSV file to create a clean
administrative division structure for Peru. This data will be used
for organizing addresses in the checkout page, while postal codes
remain manual input fields.

UBIGEO Structure:
- 6-digit code: XXYYZZ
  - XX: Department code (2 digits)
  - YY: Province code within department (2 digits)
  - ZZ: District code within province (2 digits)

Data Structure:
- Departments contain provinces
- Provinces contain districts
- Clean hierarchical organization
- No postal code data (manual input)
"""

import csv
import json
from collections import defaultdict

def parse_ubigeo_csv():
    """Parse the UBIGEO CSV file and create hierarchical data structures."""

    # Data structures
    departments = {}
    provinces = {}
    districts = {}

    with open('frontend/geodir-ubigeo-inei - ubigeo_inei.csv', 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)

        for row in reader:
            # Extract data
            ubigeo = row['Ubigeo'].strip()
            distrito = row['Distrito'].strip()
            provincia = row['Provincia'].strip()
            departamento = row['Departamento'].strip()

            # Skip if missing essential data
            if not ubigeo or not distrito or not provincia or not departamento:
                continue

            # Parse UBIGEO code (6 digits: XXYYZZ)
            if len(ubigeo) == 6:
                dept_code = ubigeo[:2]
                prov_code = ubigeo[2:4]
                dist_code = ubigeo[4:6]

                # Create department code (3-letter abbreviation)
                dept_abbrev = departamento[:3].upper()

                # Initialize department if not exists
                if dept_abbrev not in departments:
                    departments[dept_abbrev] = {
                        'code': dept_abbrev,
                        'name': departamento,
                        'provinces': {}
                    }

                # Initialize province if not exists
                if provincia not in departments[dept_abbrev]['provinces']:
                    province_code = f"{dept_abbrev}-{prov_code}"
                    departments[dept_abbrev]['provinces'][provincia] = {
                        'code': province_code,
                        'name': provincia,
                        'districts': {}
                    }

                # Add district to province
                district_code = f"{province_code}-{dist_code}"
                departments[dept_abbrev]['provinces'][provincia]['districts'][distrito] = {
                    'code': district_code,
                    'name': distrito,
                    'ubigeo': ubigeo
                }

    return departments

def create_flat_structure(departments):
    """Convert nested structure to flat arrays for the TypeScript file."""

    flat_departments = []
    all_provinces = []
    all_districts = []

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
                'districts': []
            }

            # Add districts to province
            for dist_name, dist_data in prov_data['districts'].items():
                district = {
                    'code': dist_data['code'],
                    'name': dist_data['name'],
                    'ubigeo': dist_data['ubigeo']
                }
                province['districts'].append(district)
                all_districts.append(district)

            # Sort districts within province
            province['districts'].sort(key=lambda x: x['name'])

            department['provinces'].append(province)
            all_provinces.append(province)

        # Sort provinces within department
        department['provinces'].sort(key=lambda x: x['name'])
        flat_departments.append(department)

    # Sort departments
    flat_departments.sort(key=lambda x: x['name'])

    return flat_departments, all_provinces, all_districts

def generate_typescript_file(departments, provinces, districts):
    """Generate the TypeScript file with the UBIGEO data."""

    ts_content = f'''/**
 * ========================================================================================
 * PERU UBIGEO ADMINISTRATIVE DIVISIONS
 * ========================================================================================
 *
 * SOURCE: Complete INEI UBIGEO data from geodir-ubigeo-inei
 * GENERATED: {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
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
 * - Departments: {len(departments)}
 * - Provinces: {len(provinces)}
 * - Districts: {len(districts)}
 *
 * NOTE: Postal codes are handled separately as manual input fields.
 */

export interface District {{
  code: string;
  name: string;
  ubigeo: string;
}}

export interface Province {{
  code: string;
  name: string;
  districts: District[];
}}

export interface Department {{
  code: string;
  name: string;
  provinces: Province[];
}}

export const PERU_UBIGEO: Department[] = {json.dumps(departments, indent=2, ensure_ascii=False)};

/**
 * GET DEPARTMENTS
 * ---------------
 * Returns all departments
 */
export function getDepartments(): Department[] {{
  return PERU_UBIGEO;
}}

/**
 * GET PROVINCES BY DEPARTMENT
 * ---------------------------
 * Returns provinces for a specific department
 */
export function getProvincesByDepartment(departmentCode: string): Province[] {{
  const department = PERU_UBIGEO.find(d => d.code === departmentCode);
  return department ? department.provinces : [];
}}

/**
 * GET DISTRICTS BY PROVINCE
 * -------------------------
 * Returns districts for a specific department and province
 */
export function getDistrictsByProvince(departmentCode: string, provinceCode: string): District[] {{
  const department = PERU_UBIGEO.find(d => d.code === departmentCode);
  if (!department) return [];

  const province = department.provinces.find(p => p.code === provinceCode);
  return province ? province.districts : [];
}}

/**
 * GET DISTRICT BY UBIGEO
 * ----------------------
 * Returns district information for a specific UBIGEO code
 */
export function getDistrictByUbigeo(ubigeo: string): District | null {{
  for (const department of PERU_UBIGEO) {{
    for (const province of department.provinces) {{
      for (const district of province.districts) {{
        if (district.ubigeo === ubigeo) {{
          return district;
        }}
      }}
    }}
  }}
  return null;
}}

/**
 * SEARCH ADMINISTRATIVE DIVISIONS
 * -------------------------------
 * Searches for administrative divisions by name
 */
export function searchAdministrativeDivisions(query: string): Array<{{department: Department, province: Province, district?: District}}> {{
  const results: Array<{{department: Department, province: Province, district?: District}}> = [];
  const searchTerm = query.toLowerCase();

  for (const department of PERU_UBIGEO) {{
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
'''

    with open('frontend/lib/peru-ubigeo.ts', 'w', encoding='utf-8') as f:
        f.write(ts_content)

def main():
    print("Parsing Peru UBIGEO CSV file...")
    departments = parse_ubigeo_csv()

    print("Creating flat structure...")
    flat_departments, provinces, districts = create_flat_structure(departments)

    print("Generating TypeScript file...")
    generate_typescript_file(flat_departments, provinces, districts)

    print(f"✅ Processing complete!")
    print(f"   - Departments: {len(flat_departments)}")
    print(f"   - Provinces: {len(provinces)}")
    print(f"   - Districts: {len(districts)}")
    print("   - File saved as: frontend/lib/peru-ubigeo.ts")
    print("   - Postal codes remain as manual input fields")

if __name__ == "__main__":
    main()
