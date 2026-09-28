import { weatherApi as weatherApi }  from "@/api";
import type { City }                 from "@/types/city.ts";
import { DateUtils, Utils }          from "@/utils";
import { useEffect, useState }       from "react";
import { useWeatherData }            from "./hooks";
import type { UseControllerOptions } from "./types";

const DEFAULT_LOCATION: City = {
  id: "3069011",
  name: "Olomouc",
  country: "CZ",
  state: "Central Moravia",
  lat: 49.5940567,
  lon: 17.251143
} as const;

const CHECK_POSITION = "Zjišťuji polohu…";
const LOADING_DATA = "Načítání dat …";
const FETCH_FORECAST_ERROR = "Nepodařilo se načíst předpověď počasí.";

export function useController(_options: UseControllerOptions) {
  const [positionMessage, setPositionMessage] = useState("");
  const [location, setLocation] = useState<City | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const weatherDataCtrl = useWeatherData({
    location
  });

  const isDataLoading = weatherDataCtrl.loading;
  const hasError = !!weatherDataCtrl.error;
  const infoMessage = positionMessage || (isDataLoading ? LOADING_DATA : "");
  const errorMessage = hasError ? FETCH_FORECAST_ERROR : "";
  const tableData = selectedDay ?
                    weatherDataCtrl.data.find(
                      (item) => DateUtils.isEqualDate(item.date, selectedDay!)
                    ) ?? null :
                    null;

  useEffect(() => {
    resolveInitialLocation().then(loc => setLocation(loc));
  }, []);

  useEffect(() => {
    setSelectedDay(weatherDataCtrl.days.at(0) ?? null);
  }, [weatherDataCtrl.data]);

  async function resolveInitialLocation(): Promise<City> {
    setPositionMessage(CHECK_POSITION);

    try {
      const coords = await Utils.getCurrentPosition();
      const city = await weatherApi.getCityByCoords({ lat: coords.latitude, lon: coords.longitude });

      if ( !city ) return DEFAULT_LOCATION;

      return { ...city, lat: coords.latitude, lon: coords.longitude };
    } catch ( e ) {
      return DEFAULT_LOCATION;
    } finally {
      setPositionMessage("");
    }
  }


  return {
    days: weatherDataCtrl.days,
    tableData,

    selectedDay,
    setSelectedDay,

    location,
    setLocation,

    isDataLoading,

    hasError,
    infoMessage,
    errorMessage
  };
}