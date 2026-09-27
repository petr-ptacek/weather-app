import { useCityRepositoryApi }      from "@/api";
import { useLoader }                 from "@/composables";
import type { City }                 from "@/types/city.ts";
import { useMemo, useRef, useState } from "react";

export function useCityRepository() {
  const api = useCityRepositoryApi();
  const loader = useLoader();
  const [data, setData] = useState<City[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const searchNames = useMemo(
    () => {
      return data.map(i => normalize(i.name));
    },
    [data]
  );

  let loadingPromise = useRef<Promise<void> | null>(null);


  function load(): Promise<void> {
    if ( loadingPromise.current ) return loadingPromise.current;

    loadingPromise.current = doLoad().finally(() => {
      loadingPromise.current = null;
    });

    return loadingPromise.current;
  }

  function clear() {
    setData([]);
    setError(null);
  }

  async function doLoad() {
    loader.show();
    setError(null);

    try {
      const cities = await api.fetchCities();
      setData(cities);
    } catch ( e ) {
      setError(e as Error | null);
      setData([]);
    } finally {
      loader.hide();
    }
  }

  function filterByQuery(query: string, limit = 5): City[] {
    const normalizedQuery = normalize(query.trim());
    if ( !normalizedQuery ) return [];

    const result: City[] = [];

    for ( let i = 0; i < data.length && result.length < limit; i++ ) {
      if ( searchNames[i].startsWith(normalizedQuery) ) {
        result.push(data[i]);
      }
    }

    return result;
  }

  function normalize(value: string): string {
    return value.toLocaleLowerCase();
  }

  return {
    data,
    error,
    loading: loader.loading,
    filterByQuery,
    clear,
    load
  };
}