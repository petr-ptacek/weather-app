export interface City {
  /**
   * OpenWeather city id for cities from the local list,
   * generated UUID for cities from the Geocoding API (it has no id).
   */
  id: string;
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}
