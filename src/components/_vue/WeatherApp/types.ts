export type Props = {
  disableCityRepository?: boolean
}

export type Emits = {
  (e: "_"): void
}

export type UseControllerOptions = {
  props: Props;
  emit: Emits;
};