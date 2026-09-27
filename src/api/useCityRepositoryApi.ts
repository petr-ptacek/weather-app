import { useWeatherMapper }     from "@/api/useWeatherMapper.ts";
import type { City }            from "@/types/city.ts";
import type { CityListItemDTO } from "@/types/dto";

const CITIES_URL = `${ import.meta.env.BASE_URL }data/cities.min.json`;

export function useCityRepositoryApi() {
  const weatherMapper = useWeatherMapper();

  async function fetchCities(): Promise<City[]> {
    const response = await fetch(CITIES_URL);

    if ( !response.ok ) {
      throw new Error(
        `Failed to load cities: ${ response.status } ${ response.statusText }`
      );
    }

    const data: CityListItemDTO[] = await response.json();

    return data.map(weatherMapper.toCityFromListItem);
  }

  return {
    fetchCities
  };
}