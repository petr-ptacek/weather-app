import { DateUtils }                 from "@/utils";
import type { UseControllerOptions } from "./types";

type Cell = {
  id: string;
  value: string;
  alignRight: boolean;
}

type Row = {
  id: string;
  cells: Cell[];
}

const TEMPERATURE_FORMAT = new Intl.NumberFormat(undefined, {
  style: "unit",
  unit: "celsius",
  maximumFractionDigits: 0
});

const WIND_FORMAT = new Intl.NumberFormat(undefined, {
  style: "unit",
  unit: "meter-per-second",
  maximumFractionDigits: 1
});

const PERCENT_FORMAT = new Intl.NumberFormat(undefined, {
  style: "unit",
  unit: "percent",
  maximumFractionDigits: 0
});

export function useController({ props }: UseControllerOptions) {

  const rows = (() => {
    const _rows: Row[] = [];

    props.data?.slots.forEach((slot) => {
      const getId = (identifier: string) => `${ slot.time.getTime() }__${ identifier }`;

      const cells = [
        { value: DateUtils.formatTime(slot.time), alignRight: false, id: getId(`time`) },
        { value: TEMPERATURE_FORMAT.format(slot.temperature), alignRight: true, id: getId(`temperature`) },
        { value: TEMPERATURE_FORMAT.format(slot.feelsLike), alignRight: true, id: getId(`feelsLike`) },
        { value: PERCENT_FORMAT.format(slot.precipitationChance), alignRight: true, id: getId(`precipitationChance`) },
        { value: WIND_FORMAT.format(slot.windSpeed), alignRight: true, id: getId(`windSpeed`) },
        { value: PERCENT_FORMAT.format(slot.humidity), alignRight: true, id: getId(`humidity`) }
      ] satisfies Cell[];

      _rows.push({
        id: String(slot.time.getTime()),
        cells
      });

    });

    return _rows;
  })();

  return {
    rows
  };
}