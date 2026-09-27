import { WeatherApi }    from "@/api";
import { useLoader }     from "@/composables";
import type { City }     from "@/types/city.ts";
import { readonly, ref } from "vue";

export function usePopoverOptions() {
  const options = ref<City[]>([]);
  const loader = useLoader();
  const error = ref<Error | null>(null);

  function clear() {
    options.value = [];
  }

  async function fetch(query: string) {
    loader.show();

    try {
      options.value = await WeatherApi.getCities({ query });
    } catch ( e ) {
      options.value = [];
      error.value = e as Error | null;
    } finally {
      loader.hide();
    }
  }

  return {
    options: readonly(options),
    error: readonly(error),
    loading: loader.loading,
    clear,
    fetch
  };
}