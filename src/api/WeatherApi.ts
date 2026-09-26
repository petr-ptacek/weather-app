import type { City }                             from "../types/city.ts";
import type { DayForecast }                      from "../types/forecast.ts";
import type { CityDTO, ForecastResponseDTO }     from "../types/dto";
import { WeatherMapper }                         from "./WeatherMapper.ts";

export interface GetCitiesParams {
  query: string;
}

export interface GetForecastParams {
  lat: number;
  lon: number;
}

type QueryParams = Record<string, string | number>;

export class WeatherApi {
  private static readonly GEO_API_URL = "https://api.openweathermap.org/geo/1.0/direct";
  private static readonly FORECAST_API_URL = "https://api.openweathermap.org/data/2.5/forecast";
  private static readonly API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  static async getCities(params: GetCitiesParams): Promise<City[]> {
    const data = await WeatherApi.request<CityDTO[]>(WeatherApi.GEO_API_URL, {
      q: params.query,
      limit: 5
    });

    return data.map(WeatherMapper.toCity);
  }

  static async getForecast(params: GetForecastParams): Promise<DayForecast[]> {
    const data = await WeatherApi.request<ForecastResponseDTO>(WeatherApi.FORECAST_API_URL, {
      lat: params.lat,
      lon: params.lon,
      units: "metric"
    });

    return WeatherMapper.toDayForecasts(data);
  }

  private static async request<T>(baseUrl: string, params: QueryParams): Promise<T> {
    const url = new URL(baseUrl);

    Object.entries({ ...params, appid: WeatherApi.API_KEY }).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });

    const response = await fetch(url);

    if ( !response.ok ) {
      throw new Error(
        `Request to ${ url.pathname } failed: ${ response.status } ${ response.statusText }`
      );
    }

    return response.json();
  }
}
