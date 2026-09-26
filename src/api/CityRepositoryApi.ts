import type { City }            from "../types/city.ts";
import type { CityListItemDTO } from "../types/dto";
import { WeatherMapper }        from "./WeatherMapper.ts";

export interface CityRepositoryApiProps {
  onCitiesLoaded: (cities: City[]) => void;
  onCitiesLoadError: (error: unknown) => void;
}

export class CityRepositoryApi {
  private static readonly CITIES_URL = `${ import.meta.env.BASE_URL }data/cities.min.json`;

  private _props: CityRepositoryApiProps | null;
  private _loaded: boolean = false;
  private _loading: boolean = false;
  private _cities: City[] = [];
  /** precomputed for fast search */
  private _searchNames: string[] = [];

  get cities() {
    return this._cities;
  }

  get loaded() {
    return this._loaded;
  }

  get loading() {
    return this._loading;
  }

  constructor(props: CityRepositoryApiProps) {
    this._props = props;
  }

  async loadCities(): Promise<void> {
    if ( this._loaded || this._loading ) return;

    this._loading = true;

    let cities: City[];

    try {
      cities = await this.fetchCities();
    } catch ( error ) {
      this._props?.onCitiesLoadError(error);
      return;
    } finally {
      this._loading = false;
    }

    // outside try – an error thrown in the callback is not a load error
    this._props?.onCitiesLoaded(cities);
  }


  filterByQuery(query: string, limit = 5): City[] {
    const normalizedQuery = CityRepositoryApi.normalize(query.trim());
    if ( !normalizedQuery ) return [];

    const result: City[] = [];

    for ( let i = 0; i < this._cities.length && result.length < limit; i++ ) {
      if ( this._searchNames[i].startsWith(normalizedQuery) ) {
        result.push(this._cities[i]);
      }
    }

    return result;
  }

  private async fetchCities(): Promise<City[]> {
    const response = await fetch(CityRepositoryApi.CITIES_URL);

    if ( !response.ok ) {
      throw new Error(
        `Failed to load cities: ${ response.status } ${ response.statusText }`
      );
    }

    const data: CityListItemDTO[] = await response.json();

    this._cities = data.map(WeatherMapper.toCityFromListItem);
    this._searchNames = this._cities.map(city => CityRepositoryApi.normalize(city.name));
    this._loaded = true;

    return this._cities;
  }

  private static normalize(value: string): string {
    return value.toLocaleLowerCase();
  }
}
