import type { City }    from "../types/city.ts";
import type { CityDTO } from "../types/dto";
import { mapCity }      from "./mappers.ts";

export interface GetCitiesParams {
  query: string;
}

const GEO_API_URL = "https://api.openweathermap.org/geo/1.0/direct";
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export async function getCities(params: GetCitiesParams): Promise<City[]> {

  const url = new URL(GEO_API_URL);

  Object.entries({
    q: params.query,
    limit: "5",
    appid: API_KEY
  }).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });


  const response = await fetch(url);

  if ( !response.ok ) {
    throw new Error(
      `Failed to fetch cities: ${ response.status } ${ response.statusText }`
    );
  }

  const data: CityDTO[] = await response.json();

  return data.map(mapCity);
}