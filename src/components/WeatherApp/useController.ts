import { useWeatherApi }             from "@/api";
import type { City }                 from "@/types/city.ts";
import type { DayForecast }          from "@/types/forecast.ts";
import { DateUtils, Utils }          from "@/utils";
import { computed, ref, watch }      from "vue";
import { useWeatherData }            from "./composables";
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

export function useController({ props, emit }: UseControllerOptions) {
  void emit;
  void props;

  const initialized = ref(false);
  const infoMessage = ref("");
  const location = ref<City | null>(null);
  const selectedDay = ref<Date | null>(null);

  const weatherApi = useWeatherApi();
  const weatherDataCtrl = useWeatherData({
    location
  });

  const isDataLoading = computed(() => {
    return weatherDataCtrl.loading.value;
  });

  const tableData = computed<DayForecast | null>(() => {
    if ( !selectedDay.value ) return null;

    return weatherDataCtrl.data.value.find(
      (item) => DateUtils.isEqualDate(item.date, selectedDay.value!)
    ) ?? null;
  });

  async function init() {
    location.value = await resolveInitialLocation();
    initialized.value = true;
  }

  async function resolveInitialLocation(): Promise<City> {
    infoMessage.value = CHECK_POSITION;

    try {
      const coords = await Utils.getCurrentPosition();
      const city = await weatherApi.getCityByCoords({ lat: coords.latitude, lon: coords.longitude });

      if ( !city ) return DEFAULT_LOCATION;

      return { ...city, lat: coords.latitude, lon: coords.longitude };
    } catch ( e ) {
      return DEFAULT_LOCATION;
    } finally {
      infoMessage.value = "";
    }
  }


  watch(weatherDataCtrl.days, (v) => {
    if ( !v.length ) return;
    selectedDay.value = v.at(0) ?? null;
  });

  return {
    days: weatherDataCtrl.days,
    tableData,
    selectedDay,
    location,
    initialized,
    isDataLoading,
    infoMessage,
    init
  };
}