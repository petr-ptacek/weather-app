import type { DayForecast } from "@/types/forecast.ts";

export type Props = {
  data?: DayForecast | null;
}

export type UseControllerOptions = {
  props: Props;
};
