import { useCityRepositoryApi } from "@/api";
import { useLoader }            from "@/composables";
import type { City }            from "@/types/city.ts";
import { computed, ref }        from "vue";

export function useCityRepository() {
  const api = useCityRepositoryApi();
  const loader = useLoader();
  const data = ref<City[]>([]);
  const error = ref<Error | null>(null);

  const searchNames = computed(() => {
    return data.value.map(i => normalize(i.name));
  });

  function clear() {
    data.value = [];
    error.value = null;
  }

  let loadingPromise: Promise<void> | null = null;

  function load(): Promise<void> {
    if ( loadingPromise ) return loadingPromise;

    loadingPromise = doLoad().finally(() => {
      loadingPromise = null;
    });

    return loadingPromise;
  }

  async function doLoad() {
    loader.show();
    error.value = null;

    try {
      data.value = await api.fetchCities();
    } catch ( e ) {
      error.value = e as Error | null;
      data.value = [];
    } finally {
      loader.hide();
    }
  }

  function filterByQuery(query: string, limit = 5): City[] {
    const normalizedQuery = normalize(query.trim());
    if ( !normalizedQuery ) return [];

    const result: City[] = [];

    for ( let i = 0; i < data.value.length && result.length < limit; i++ ) {
      if ( searchNames.value[i].startsWith(normalizedQuery) ) {
        result.push(data.value[i]);
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