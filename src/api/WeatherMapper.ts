import type { City }                                          from "../types/city.ts";
import type { DayForecast, ForecastSlot }                     from "../types/forecast.ts";
import type { CityDTO, CityListItemDTO, ForecastItemDTO, ForecastResponseDTO } from "../types/dto";
import { DateUtils }                                          from "../utils";

export class WeatherMapper {
  static toCity(dto: CityDTO): City {
    return {
      name: dto.name,
      country: dto.country,
      state: dto.state,
      lat: dto.lat,
      lon: dto.lon
    };
  }

  static toCityFromListItem(dto: CityListItemDTO): City {
    return {
      name: dto.name,
      country: dto.country,
      state: dto.state || undefined,
      lat: dto.coord.lat,
      lon: dto.coord.lon
    };
  }

  static toForecastSlot(dto: ForecastItemDTO): ForecastSlot {
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
  static toDayForecasts(dto: ForecastResponseDTO): DayForecast[] {
    const days: DayForecast[] = [];

    for ( const item of dto.list ) {
      const slot = WeatherMapper.toForecastSlot(item);
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
}
