import type { DayForecast }         from "../types/forecast.ts";
import type { ForecastResponseDTO } from "../types/dto";
import { mapForecast }              from "./mappers.ts";

export interface GetForecastParams {
  lat: number;
  lon: number;
}

const FORECAST_API_URL = "https://api.openweathermap.org/data/2.5/forecast";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export async function getForecast(
  params: GetForecastParams
): Promise<DayForecast[]> {
  const url = new URL(FORECAST_API_URL);

  Object.entries({
    lat: params.lat,
    lon: params.lon,
    units: "metric",
    appid: API_KEY
  }).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });

  const response = await fetch(url);

  if ( !response.ok ) {
    throw new Error(
      `Failed to fetch forecast: ${ response.status } ${ response.statusText }`
    );
  }

  const data: ForecastResponseDTO = await response.json();

  return mapForecast(data);
}