/**
 * Item of OpenWeather Geocoding API response
 * https://openweathermap.org/api/geocoding-api
 */
export interface CityDTO {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}
