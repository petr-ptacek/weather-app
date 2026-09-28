import { weatherApi as api }   from "@/api";
import { useLoader }           from "@/hooks";
import type { City }           from "@/types/city.ts";
import type { DayForecast }    from "@/types/forecast.ts";
import { useEffect, useState } from "react";

export type UseWeatherDataOptions = {
  location: City | null;
}

export function useWeatherData(options: UseWeatherDataOptions) {
  const [data, setData] = useState<DayForecast[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const loader = useLoader();

  const days = data.map(d => d.date);

  useEffect(() => {
    if ( !options.location ) {
      setData([]);
      return;
    }

    fetch(options.location);
  }, [options.location]);


  async function fetch({ lat, lon }: { lat: number, lon: number }) {
    loader.show();
    setError(null);

    try {
      const t = await api.getForecast({ lat, lon });
      setData(t);
    } catch ( e ) {
      setData([]);
      setError(e as Error | null);
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