/** Forecast for one 3 hour slot */
export interface ForecastEntry {
  time: Date;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
}

/** Forecast entries grouped by day */
export interface DayForecast {
  /** Start of the day */
  date: Date;
  minTemperature: number;
  maxTemperature: number;
  entries: ForecastEntry[];
}
