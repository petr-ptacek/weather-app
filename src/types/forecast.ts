/** 3 hours slot */
export interface ForecastSlot {
  time: Date;
  temperature: number;
  feelsLike: number;
  humidity: number;
  /** srazky in percent (0–100) */
  precipitationChance: number;
  windSpeed: number;
  description: string;
  icon: string;
}

/** slots grouped by day */
export interface DayForecast {
  /** Start of the day */
  date: Date;
  slots: ForecastSlot[];
}
