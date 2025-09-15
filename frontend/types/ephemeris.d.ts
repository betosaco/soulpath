declare module 'ephemeris' {
  export interface EphemerisData {
    // Add specific types as needed
    [key: string]: unknown; // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  export function calculate(
    date: Date,
    latitude: number,
    longitude: number,
    altitude?: number
  ): EphemerisData;

  export function calculateAll(
    date: Date,
    latitude: number,
    longitude: number,
    altitude?: number
  ): EphemerisData;

  // Add other exports as needed
  const ephemerisModule = {
    calculate,
    calculateAll
  };

  export default ephemerisModule;
}
