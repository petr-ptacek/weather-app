import type { City }                                           from "../types/city.ts";
import type { DayForecast, ForecastEntry }                     from "../types/forecast.ts";
import type { CityDTO, ForecastItemDTO, ForecastResponseDTO }  from "../types/dto";
import { DateUtils }                                           from "../utils";

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

  static toForecastEntry(dto: ForecastItemDTO): ForecastEntry {
    const weather = dto.weather[0];

    return {
      /** dt is Unix timestamp in seconds, Date expects milliseconds */
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
  static toDayForecasts(dto: ForecastResponseDTO): DayForecast[] {
    const days: DayForecast[] = [];

    for ( const item of dto.list ) {
      const entry = WeatherMapper.toForecastEntry(item);
      const date = DateUtils.startOfDay(entry.time);

      let day = days.find(d => DateUtils.isEqualDate(d.date, date));

      if ( !day ) {
        day = {
          date,
          minTemperature: item.main.temp_min,
          maxTemperature: item.main.temp_max,
          entries: []
        };
        days.push(day);
      }

      day.minTemperature = Math.min(day.minTemperature, item.main.temp_min);
      day.maxTemperature = Math.max(day.maxTemperature, item.main.temp_max);
      day.entries.push(entry);
    }

    return days;
  }
}
