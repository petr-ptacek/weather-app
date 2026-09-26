/**
 * OpenWeather 5 day / 3 hour forecast API response
 * https://openweathermap.org/forecast5
 */
export interface ForecastResponseDTO {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItemDTO[];
  city: ForecastCityDTO;
}

export interface ForecastItemDTO {
  dt: number;
  main: ForecastMainDTO;
  weather: WeatherDTO[];
  clouds: CloudsDTO;
  wind: WindDTO;
  visibility: number;
  pop: number;
  sys: ForecastSysDTO;
  dt_txt: string;
}

export interface ForecastMainDTO {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
}

export interface WeatherDTO {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface CloudsDTO {
  all: number;
}

export interface WindDTO {
  speed: number;
  deg: number;
  gust: number;
}

export interface ForecastSysDTO {
  pod: "d" | "n";
}

export interface ForecastCityDTO {
  id: number;
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}