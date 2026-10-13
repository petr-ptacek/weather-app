import { useWeatherApi } from "@/api";
import { useLoader } from "@/composables";
import type { City } from "@/types/city.ts";
import type { DayForecast } from "@/types/forecast.ts";
import { Utils } from "@/utils";
import { computed, ref, type Ref, watch } from "vue";

export type UseWeatherDataOptions = {
  location: Ref<City | null>;
}

export function useWeatherData(options: UseWeatherDataOptions) {
  const data = ref<DayForecast[]>([]);
  const error = ref<Error | null>(null);

  const loader = useLoader();
  const api = useWeatherApi();

  const _fetchForecastAbortable = Utils.withAbortable(
    (signal, { lat, lon }: { lat: number, lon: number }) => {
      return api.getForecast({ lat, lon, signal });
    },
  );

  const days = computed(() => data.value.map(d => d.date));

  watch(options.location, () => {
    if (!options.location.value) {
      _fetchForecastAbortable.abort();
      data.value = [];
      return;
    }

    void _fetch(options.location.value);
  }, { immediate: true });

  async function _fetch({ lat, lon }: { lat: number, lon: number }) {
    loader.show();
    error.value = null;

    try {
      data.value = await _fetchForecastAbortable({ lat, lon });
    } catch (e) {
      if (Utils.isAbortError(e)) return;
      data.value = [];
      error.value = e as Error | null;
    } finally {
      loader.hide();
    }
  }

  return {
    data,
    days,
    error,
    loading: loader.loading,
    fetch: _fetch,
  };
}