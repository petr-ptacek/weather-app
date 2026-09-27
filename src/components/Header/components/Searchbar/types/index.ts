import type { Ref }  from "vue";
import type { City } from "@/types/city.ts";

export type Props = {
  _?: never;
}

export type Emits = {
  (e: "locationSelected", location: City): void
}

export type UseControllerOptions = {
  props: Props;
  emit: Emits;
  selectedLocationMV: Ref<City | null>;
};