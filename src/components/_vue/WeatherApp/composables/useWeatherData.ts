import { useWeatherApi }                  from "@/api";
import { useLoader }                      from "@/composables";
import type { City }                      from "@/types/city.ts";
import type { DayForecast }               from "@/types/forecast.ts";
import { computed, ref, type Ref, watch } from "vue";

export type UseWeatherDataOptions = {
  location: Ref<City | null>;
}

export function useWeatherData(options: UseWeatherDataOptions) {
  const data = ref<DayForecast[]>([]);
  const error = ref<Error | null>(null);

  const loader = useLoader();
  const api = useWeatherApi();

  const days = computed(() => data.value.map(d => d.date));

  watch(options.location, () => {
    if ( !options.location.value ) {
      data.value = [];
      return;
    }

    fetch(options.location.value);
  }, { immediate: true });

  async function fetch({ lat, lon }: { lat: number, lon: number }) {
    loader.show();
    error.value = null;

    try {
      data.value = await api.getForecast({ lat, lon });
    } catch ( e ) {
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
    fetch
  };
}