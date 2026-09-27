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
const LOADING_DATA = "Načítání dat …";
const FETCH_FORECAST_ERROR = "Nepodařilo se načíst předpověď počasí.";

export function useController({ props, emit }: UseControllerOptions) {
  void emit;
  void props;

  const initialized = ref(false);
  const positionMessage = ref("");
  const location = ref<City | null>(null);
  const selectedDay = ref<Date | null>(null);

  const weatherApi = useWeatherApi();
  const weatherDataCtrl = useWeatherData({
    location
  });

  const isDataLoading = computed(() => {
    return weatherDataCtrl.loading.value;
  });

  const hasError = computed(() => !!weatherDataCtrl.error.value);

  const infoMessage = computed(() => {
    if ( positionMessage.value ) return positionMessage.value;
    if ( isDataLoading.value ) return LOADING_DATA;
    return "";
  });

  const errorMessage = computed(() => {
    return hasError.value ? FETCH_FORECAST_ERROR : "";
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
    positionMessage.value = CHECK_POSITION;

    try {
      const coords = await Utils.getCurrentPosition();
      const city = await weatherApi.getCityByCoords({ lat: coords.latitude, lon: coords.longitude });

      if ( !city ) return DEFAULT_LOCATION;

      return { ...city, lat: coords.latitude, lon: coords.longitude };
    } catch ( e ) {
      return DEFAULT_LOCATION;
    } finally {
      positionMessage.value = "";
    }
  }


  watch(weatherDataCtrl.days, (v) => {
    selectedDay.value = v.at(0) ?? null;
  });

  return {
    days: weatherDataCtrl.days,
    tableData,
    selectedDay,
    location,
    initialized,
    isDataLoading,
    hasError,
    infoMessage,
    errorMessage,
    init
  };
}