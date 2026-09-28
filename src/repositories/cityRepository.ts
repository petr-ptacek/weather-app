import { cityRepositoryApi as api } from "@/api";
import type { City }                from "@/types/city.ts";

let cities: City[] = [];
let searchNames: string[] = [];
let loadingPromise: Promise<void> | null = null;

function normalize(value: string): string {
  return value.toLocaleLowerCase();
}

export function isCitiesLoaded(): boolean {
  return cities.length > 0;
}

export function loadCities(): Promise<void> {
  if ( isCitiesLoaded() ) return Promise.resolve();

  if ( loadingPromise ) return loadingPromise;

  loadingPromise = api.fetchCities()
                      .then((data) => {
                        cities = data;
                        searchNames = data.map(city => normalize(city.name));
                      })
                      .finally(() => {
                        loadingPromise = null;
                      });

  return loadingPromise;
}

export function filterCities(query: string, limit = 5): City[] {
  const normalizedQuery = normalize(query.trim());
  if ( !normalizedQuery ) return [];

  const result: City[] = [];

  for ( let i = 0; i < cities.length && result.length < limit; i++ ) {
    if ( searchNames[i].startsWith(normalizedQuery) ) {
      result.push(cities[i]);
    }
  }

  return result;
}
