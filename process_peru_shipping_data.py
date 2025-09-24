#!/usr/bin/env python3
"""
Process Peru Shipping Data from PeruShiipingData.json
=====================================================

This script processes the Peru shipping data with the correct structure:
Department -> Province -> City -> District -> [Array of Postal Codes]

The structure is:
Level 1 (Root): A JSON object where keys are Department names (e.g., "Lima").
Level 2 (Province): The value of a Department is an object where keys are Province names (e.g., "Lima").
Level 3 (Capital): The value of a Province is an object where the key is the Capital City name (e.g., "Lima").
Level 4 (District): The value of a City is an object where keys are District names (e.g., "Miraflores").
Level 5 (Postal Codes): The value of a District is a JSON array of strings, where each string is a postal code.
"""

import json
import os
from datetime import datetime

def load_peru_shipping_data():
    """Load the Peru shipping data from JSON file."""
    with open('PeruShiipingData.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def create_peru_shipping_data(data):
    """Create the Peru shipping data structure for TypeScript.
    
    Structure: Department -> Province -> City -> District -> [Postal Codes]
    """
    
    # Convert to flat structure for easier component usage
    departments = []
    provinces = []
    districts = []
    cities = []

    # First pass: collect all unique cities and districts
    city_map = {}

    # Track used codes to ensure uniqueness
    used_codes = set()
    
    for dept_name, dept_data in data.items():
        # Generate unique code
        base_code = dept_name[:3].upper()
        dept_code = base_code
        counter = 1
        while dept_code in used_codes:
            dept_code = f"{base_code}{counter}"
            counter += 1
        used_codes.add(dept_code)
        
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

            # Track districts to avoid duplicates
            district_map = {}

            # Level 3: Capital City
            if isinstance(prov_data, dict):
                for capital_city_name, capital_city_data in prov_data.items():
                    # Create the capital city entry
                    city_code = f"{prov_code}-{capital_city_name[:3].upper()}"
                    if city_code not in city_map:
                        city_map[city_code] = {
                            'code': city_code,
                            'name': capital_city_name,
                            'postalCodes': []
                        }
                        cities.append(city_map[city_code])
                        province['cities'].append(city_map[city_code])

                    # Level 4: Districts under this capital city
                    if isinstance(capital_city_data, dict):
                        for district_name, postal_codes in capital_city_data.items():
                            # Create district entry
                            dist_code = f"{prov_code}-{district_name[:3].upper()}"
                            if dist_code not in district_map:
                                district_map[dist_code] = {
                                    'code': dist_code,
                                    'name': district_name,
                                    'postalCodes': []
                                }
                                province['districts'].append(district_map[dist_code])
                                districts.append(district_map[dist_code])

                            # Level 5: Postal codes for this district
                            if isinstance(postal_codes, list):
                                for postal_code in postal_codes:
                                    if postal_code not in district_map[dist_code]['postalCodes']:
                                        district_map[dist_code]['postalCodes'].append(postal_code)

                                    # Also add to the capital city
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
    """Generate the TypeScript file with Peru shipping data."""
    
    ts_content = f'''/**
 * ========================================================================================
 * PERU SHIPPING ADDRESS DATA
 * ========================================================================================
 *
 * SOURCE: PeruShiipingData.json
 * GENERATED: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
 *
 * This file contains the complete geographic data for Peru's administrative divisions
 * for shipping address fields.
 *
 * Structure: DEPARTAMENTO → PROVINCIA → CIUDAD → DISTRITO → CÓDIGOS POSTALES
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

// ========================================================================================
// DATA EXPORTS
// ========================================================================================

export const departments: Department[] = {json.dumps(departments, indent=2, ensure_ascii=False)};

export const provinces: Province[] = {json.dumps(provinces, indent=2, ensure_ascii=False)};

export const districts: District[] = {json.dumps(districts, indent=2, ensure_ascii=False)};

export const cities: City[] = {json.dumps(cities, indent=2, ensure_ascii=False)};

// ========================================================================================
// HELPER FUNCTIONS
// ========================================================================================

/**
 * Get all departments
 */
export function getDepartments(): Department[] {{
  return departments;
}}

/**
 * Get provinces by department code
 */
export function getProvincesByDepartment(departmentCode: string): Province[] {{
  const department = departments.find(d => d.code === departmentCode);
  return department ? department.provinces : [];
}}

/**
 * Get cities by province code
 */
export function getCitiesByProvince(provinceCode: string): City[] {{
  const province = provinces.find(p => p.code === provinceCode);
  return province ? province.cities : [];
}}

/**
 * Get districts by province code
 */
export function getDistrictsByProvince(provinceCode: string): District[] {{
  const province = provinces.find(p => p.code === provinceCode);
  return province ? province.districts : [];
}}

/**
 * Get postal codes for a specific district
 */
export function getPostalCodesForDistrict(districtCode: string): string[] {{
  const district = districts.find(d => d.code === districtCode);
  return district ? district.postalCodes : [];
}}

/**
 * Get postal codes for a specific city
 */
export function getPostalCodesForCity(cityCode: string): string[] {{
  const city = cities.find(c => c.code === cityCode);
  return city ? city.postalCodes : [];
}}

/**
 * Search geographic locations by name
 */
export function searchGeographicLocations(searchTerm: string): {{
  departments: Department[];
  provinces: Province[];
  cities: City[];
  districts: District[];
}} {{
  const term = searchTerm.toLowerCase();
  
  const matchingDepartments = departments.filter(d => 
    d.name.toLowerCase().includes(term)
  );
  
  const matchingProvinces = provinces.filter(p => 
    p.name.toLowerCase().includes(term)
  );
  
  const matchingCities = cities.filter(c => 
    c.name.toLowerCase().includes(term)
  );
  
  const matchingDistricts = districts.filter(d => 
    d.name.toLowerCase().includes(term)
  );
  
  return {{
    departments: matchingDepartments,
    provinces: matchingProvinces,
    cities: matchingCities,
    districts: matchingDistricts
  }};
}}

/**
 * Validate location selection
 */
export function validateLocationSelection(selection: {{
  department?: string;
  province?: string;
  city?: string;
  district?: string;
}}): boolean {{
  if (!selection.department) return false;
  
  const department = departments.find(d => d.code === selection.department);
  if (!department) return false;
  
  if (selection.province) {{
    const province = department.provinces.find(p => p.code === selection.province);
    if (!province) return false;
    
    if (selection.city) {{
      const city = province.cities.find(c => c.code === selection.city);
      if (!city) return false;
    }}
    
    if (selection.district) {{
      const district = province.districts.find(d => d.code === selection.district);
      if (!district) return false;
    }}
  }}
  
  return true;
}}

/**
 * Get default Peru values for forms
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

    return ts_content

def main():
    """Main function to process Peru shipping data."""
    print("Loading Peru shipping data...")
    
    try:
        data = load_peru_shipping_data()
        print("Processing shipping data structure...")
        
        departments, provinces, districts, cities = create_peru_shipping_data(data)
        
        print("Generating TypeScript file...")
        ts_content = generate_typescript_file(departments, provinces, districts, cities)
        
        # Write to frontend/lib directory
        output_path = 'frontend/lib/peru-shipping-data.ts'
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(ts_content)
        
        print(f"✅ Peru shipping data saved as: {output_path}")
        print(f"   - Departments: {len(departments)}")
        print(f"   - Provinces: {len(provinces)}")
        print(f"   - Districts: {len(districts)}")
        print(f"   - Cities (Capital Cities): {len(cities)}")
        print("✅ Process completed successfully!")
        
    except FileNotFoundError:
        print("❌ Error: PeruShiipingData.json file not found!")
        print("   Please ensure the file exists in the current directory.")
    except json.JSONDecodeError as e:
        print(f"❌ Error: Invalid JSON format in PeruShiipingData.json: {e}")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
