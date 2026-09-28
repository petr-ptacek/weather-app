import type { City }                         from "@/types/city";
import type { CityDTO, ForecastResponseDTO } from "@/types/dto";
import type { DayForecast }                  from "@/types/forecast";
import * as weatherMapper                    from "./weatherMapper.ts";

const REVERSE_GEO_API_URL = "https://api.openweathermap.org/geo/1.0/reverse";
const GEO_API_URL = "https://api.openweathermap.org/geo/1.0/direct";
const FORECAST_API_URL = "https://api.openweathermap.org/data/2.5/forecast";
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;


export interface GetCitiesParams {
  query: string;
}

export interface GetForecastParams {
  lat: number;
  lon: number;
}

export interface GetCityByCoordsParams {
  lat: number;
  lon: number;
}

type QueryParams = Record<string, string | number>;

/**
 * Reverse geocoding – finds the nearest city for given coordinates.
 * Returns null when there is no city nearby (e.g. in the middle of the sea).
 */
export async function getCityByCoords(params: GetCityByCoordsParams): Promise<City | null> {
  const data = await request<CityDTO[]>(REVERSE_GEO_API_URL, {
    lat: params.lat,
    lon: params.lon,
    limit: 1
  });

  const city = data.at(0);

  return city ? weatherMapper.toCity(city) : null;
}

export async function getCities(params: GetCitiesParams, signal?: AbortSignal): Promise<City[]> {
  const data = await request<CityDTO[]>(GEO_API_URL, {
    q: params.query,
    limit: 5
  }, signal);

  return data.map(weatherMapper.toCity);
}

export async function getForecast(params: GetForecastParams): Promise<DayForecast[]> {
  const data = await request<ForecastResponseDTO>(FORECAST_API_URL, {
    lat: params.lat,
    lon: params.lon,
    units: "metric"
  });

  return weatherMapper.toDayForecasts(data);
}

async function request<T>(baseUrl: string, params: QueryParams, signal?: AbortSignal): Promise<T> {
  const url = new URL(baseUrl);

  Object.entries({ ...params, appid: API_KEY }).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });

  const response = await fetch(url, { signal });

  if ( !response.ok ) {
    throw new Error(
      `Request to ${ url.pathname } failed: ${ response.status } ${ response.statusText }`
    );
  }

  return response.json();
}
