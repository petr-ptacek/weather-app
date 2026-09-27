import type { Ref } from "vue";

export type Props = {
  days: Date[];
}

export type Emits = {
  (e: "daySelected", day: Date): void
}

export type UseControllerOptions = {
  props: Props;
  emit: Emits;
  dayMV: Ref<Date | null>;
};