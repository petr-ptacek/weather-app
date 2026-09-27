import type { DayForecast } from "@/types/forecast.ts";

export type Props = {
  data?: DayForecast | null;
}

export type Emits = {
  (e: "_"): void
}

export type UseControllerOptions = {
  props: Props;
  emit: Emits;
};