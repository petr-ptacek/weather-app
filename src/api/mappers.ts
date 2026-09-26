import type { City }                        from "../types/city.ts";
import type { DayForecast, ForecastEntry }  from "../types/forecast.ts";
import type { CityDTO, ForecastItemDTO, ForecastResponseDTO } from "../types/dto";
import { startOfDay }                     from "../utils";

export function mapCity(dto: CityDTO): City {
  return {
    name: dto.name,
    country: dto.country,
    state: dto.state,
    lat: dto.lat,
    lon: dto.lon
  };
}

export function mapForecastEntry(dto: ForecastItemDTO): ForecastEntry {
  const weather = dto.weather[0];

  return {
    /** milliseconds to seconds, dt is from 1.1.1970 */
    time: new Date(dto.dt * 1000),
    temperature: dto.main.temp,
    feelsLike: dto.main.feels_like,
    humidity: dto.main.humidity,
    windSpeed: dto.wind.speed,
    description: weather?.description ?? "",
    icon: weather?.icon ?? ""
  };
}

/**
 * Groups 3 hour entries by day in the browser's time zone.
 */
export function mapForecast(dto: ForecastResponseDTO): DayForecast[] {
  const days = new Map<string, DayForecast>();

  for ( const item of dto.list ) {
    const entry = mapForecastEntry(item);
    const date = startOfDay(entry.time);
    const key = date.toDateString();

    let day = days.get(key);

    if ( !day ) {
      day = {
        date,
        minTemperature: item.main.temp_min,
        maxTemperature: item.main.temp_max,
        entries: []
      };
      days.set(key, day);
    }

    day.minTemperature = Math.min(day.minTemperature, item.main.temp_min);
    day.maxTemperature = Math.max(day.maxTemperature, item.main.temp_max);
    day.entries.push(entry);
  }

  return [...days.values()];
}
