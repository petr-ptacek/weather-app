import { useWeatherApi }                from "@/api";
import { useCityRepository, useLoader } from "@/composables";
import type { City }                    from "@/types/city.ts";
import { Utils }                        from "@/utils";
import { computed, readonly, ref }      from "vue";

export type UsePopoverOptions = {
  disableCityRepository: boolean;
}

export function usePopoverOptions(opt: UsePopoverOptions) {
  const _options = ref<City[]>([]);
  const loader = useLoader();
  const error = ref<Error | null>(null);

  const api = useWeatherApi();
  const cityRepositoryCtrl = useCityRepository();

  const getCitiesAbortable = Utils.withAbortable(
    (signal, query: string) => api.getCities({ query }, signal)
  );

  function clear() {
    getCitiesAbortable.abort();
    _options.value = [];
  }
  
  async function fetchOptions(query: string): Promise<boolean> {
    error.value = null;

    // FROM REPOSITORY

    if ( !opt.disableCityRepository ) {
      if ( !cityRepositoryCtrl.data.value.length ) {
        await cityRepositoryCtrl.load();
      }

      _options.value = cityRepositoryCtrl.filterByQuery(query);
      return true;
    }


    // FROM API

    loader.show();

    try {
      _options.value = await getCitiesAbortable(query);
      return true;
    } catch ( e ) {
      if ( Utils.isAbortError(e) ) return false;

      _options.value = [];
      error.value = e as Error | null;
      return true;
    } finally {
      loader.hide();
    }
  }


  return {
    options: readonly(_options),
    error: computed(() => error.value || cityRepositoryCtrl.error.value),
    loading: computed(() => loader.loading.value || cityRepositoryCtrl.loading.value),
    clear,
    fetchOptions
  };
}