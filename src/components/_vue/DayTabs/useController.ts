import { DateUtils }                 from "@/utils";
import { computed, ref }             from "vue";
import type { UseControllerOptions } from "./types";

type Option = {
  id: string;
  day: Date;
  selected: boolean;
  label: string;
}

export function useController({ props, emit, dayMV }: UseControllerOptions) {
  const initialized = ref(false);

  const options = computed(() => {
    return props.days.map((day) => {
      return {
        day,
        label: DateUtils.formatDay(day),
        id: String(day.getTime()),
        selected: !!(dayMV.value && DateUtils.isEqualDate(dayMV.value, day))
      } satisfies Option;
    });
  });

  function init() {
    initialized.value = true;
  }

  function handleOptionSelected({ day }: Option) {
    dayMV.value = day;
    emit("daySelected", day);
  }

  return {
    initialized,
    options,
    init,
    handleOptionSelected
  };
}