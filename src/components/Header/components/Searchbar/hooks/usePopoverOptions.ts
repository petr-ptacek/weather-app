import { weatherApi as api } from "@/api";
import { useLoader }         from "@/composables";

import { cityRepository as cityRepositoryCtrl } from "@/repositories";
import type { City }                            from "@/types/city.ts";
import { Utils }                                from "@/utils";
import { useState }                             from "react";

export type UsePopoverOptions = {
  disableCityRepository: boolean;
}

const getCitiesAbortable = Utils.withAbortable(
  (signal, query: string) => api.getCities({ query }, signal)
);

export function usePopoverOptions(opt: UsePopoverOptions) {
  const [_options, setOptions] = useState<City[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const loader = useLoader();


  function clear() {
    getCitiesAbortable.abort();
    setOptions([]);
  }

  async function fetchOptions(query: string): Promise<void> {
    setError(null);

    // FROM REPOSITORY

    if ( !opt.disableCityRepository ) {
      if ( !cityRepositoryCtrl.isCitiesLoaded() ) {
        loader.show();
        try {
          await cityRepositoryCtrl.loadCities();
        } catch ( e ) {
          setOptions([]);
          setError(e as Error | null);
        } finally {
          loader.hide();
        }
      }

      setOptions(
        cityRepositoryCtrl.filterCities(query)
      );

      return;
    }


    // FROM API

    loader.show();

    try {
      setOptions(await getCitiesAbortable(query));
    } catch ( e ) {
      if ( Utils.isAbortError(e) ) return;

      setOptions([]);
      setError(e as Error | null);
    } finally {
      loader.hide();
    }
  }


  return {
    options: _options,
    error: error,
    loading: loader.loading,
    clear,
    fetchOptions
  };
}