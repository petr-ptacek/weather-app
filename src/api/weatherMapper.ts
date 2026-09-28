import type { City }                                                           from "@/types/city.ts";
import type { CityDTO, CityListItemDTO, ForecastItemDTO, ForecastResponseDTO } from "@/types/dto";
import type { DayForecast, ForecastSlot }                                      from "@/types/forecast.ts";
import { DateUtils }                                                           from "@/utils";

export function toCity(dto: CityDTO): City {
  return {
    // Geocoding API returns no id
    id: crypto.randomUUID(),
    name: dto.name,
    country: dto.country,
    state: dto.state,
    lat: dto.lat,
    lon: dto.lon
  };
}

export function toCityFromListItem(dto: CityListItemDTO): City {
  return {
    id: String(dto.id),
    name: dto.name,
    country: dto.country,
    state: dto.state || undefined,
    lat: dto.coord.lat,
    lon: dto.coord.lon
  };
}

export function toForecastSlot(dto: ForecastItemDTO): ForecastSlot {
  const weather = dto.weather[0];

  return {
    /** dt is Unix timestamp in seconds, Date expects milliseconds */
    time: new Date(dto.dt * 1000),
    /** teplota */
    temperature: dto.main.temp,
    /** pocitova teplota */
    feelsLike: dto.main.feels_like,
    /** vlhkost */
    humidity: dto.main.humidity,
    /** srazky 0–1 */
    precipitationChance: Math.round(dto.pop * 100),
    /** vitr */
    windSpeed: dto.wind.speed,
    description: weather?.description ?? "",
    icon: weather?.icon ?? ""
  };
}

/**
 * Groups 3 hour slots by day
 */
export function toDayForecasts(dto: ForecastResponseDTO): DayForecast[] {
  const days: DayForecast[] = [];

  for ( const item of dto.list ) {
    const slot = toForecastSlot(item);
    const date = DateUtils.startOfDay(slot.time);

    let day = days.find(d => DateUtils.isEqualDate(d.date, date));

    if ( !day ) {
      day = {
        date,
        slots: []
      };
      days.push(day);
    }

    day.slots.push(slot);
  }

  return days;
}
