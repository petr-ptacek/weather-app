/**
 * (public/data/cities.min.json)
 * https://bulk.openweathermap.org/sample/
 */
export interface CityListItemDTO {
  id: number;
  name: string;
  state: string;
  country: string;
  coord: {
    lat: number;
    lon: number;
  };
}
