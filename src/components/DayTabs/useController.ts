import { DateUtils }                 from "@/utils";
import type { UseControllerOptions } from "./types";

type Option = {
  id: string;
  day: Date;
  selected: boolean;
  label: string;
}

export function useController({ props }: UseControllerOptions) {
  const options = props.days.map((day) => {
    return {
      day,
      label: DateUtils.formatDay(day),
      id: String(day.getTime()),
      selected: !!(props.day && DateUtils.isEqualDate(props.day, day))
    } satisfies Option;
  });


  function handleOptionSelected({ day }: Option) {
    props.onDaySelected(day);
  }

  return {
    options,
    handleOptionSelected
  };
}