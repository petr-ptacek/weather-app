import { useWeatherApi }                from "@/api";
import { useCityRepository, useLoader } from "@/composables";
import type { City }                    from "@/types/city.ts";
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

  function clear() {
    _options.value = [];
  }

  async function fetchOptions(query: string) {
    error.value = null;

    if ( !opt.disableCityRepository ) {
      if ( cityRepositoryCtrl.data.value.length ) {
        _options.value = cityRepositoryCtrl.filterByQuery(query);
        return;
      }

      await cityRepositoryCtrl.load();
      _options.value = cityRepositoryCtrl.filterByQuery(query);
      return;
    }

    loader.show();

    try {
      _options.value = await api.getCities({ query });
    } catch ( e ) {
      _options.value = [];
      error.value = e as Error | null;
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