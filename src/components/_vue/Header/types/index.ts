import type { City } from "@/types/city.ts";
import type { Ref }  from "vue";

export type Props = {
  disableCityRepository?: boolean;
}

export type Emits = {
  (e: "_"): void
}

export type UseControllerOptions = {
  props: Props;
  emit: Emits;
  selectedLocationMV: Ref<City | null>;
};