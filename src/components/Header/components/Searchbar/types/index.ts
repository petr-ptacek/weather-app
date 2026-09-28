import type { City } from "@/types/city.ts";

export type Props = {
  disableCityRepository?: boolean;
  location: City | null;
  onSelectLocation: (loc: City | null) => void;
}

export type UseControllerOptions = {
  props: Props;
};