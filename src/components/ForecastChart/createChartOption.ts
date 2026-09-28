import type { EChartsOption } from "echarts";
import type { DayForecast }   from "@/types/forecast.ts";
import { DateUtils }          from "@/utils";


/**
 * https://echarts.apache.org/en/option.html
 */

export type ChartColors = {
  /** line and points */
  line: string;
  text: string;
  grid: string;
};

const TEMPERATURE_FORMAT = new Intl.NumberFormat(undefined, {
  style: "unit",
  unit: "celsius",
  maximumFractionDigits: 0
});


export function createChartOption(
  day: DayForecast | null,
  colors: ChartColors
): EChartsOption {
  const slots = day?.slots ?? [];

  return {
    grid: { left: 8, right: 16, top: 16, bottom: 8, containLabel: true },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "line", lineStyle: { color: colors.grid } },
      formatter: (params) => {
        const [item] = Array.isArray(params) ? params : [params];
        const slot = slots[item.dataIndex];
        if ( !slot ) return "";

        return [
          DateUtils.formatTime(slot.time),
          `Teplota: <b>${ TEMPERATURE_FORMAT.format(slot.temperature) }</b>`,
          `Pocitová: ${ TEMPERATURE_FORMAT.format(slot.feelsLike) }`
        ].join("<br>");
      }
    },
    xAxis: {
      type: "category",
      data: slots.map(slot => DateUtils.formatTime(slot.time)),
      boundaryGap: false,
      axisLine: { lineStyle: { color: colors.grid } },
      axisTick: { show: false },
      axisLabel: { color: colors.text }
    },
    yAxis: {
      type: "value",
      scale: true,
      axisLabel: {
        color: colors.text,
        formatter: (value: number) => TEMPERATURE_FORMAT.format(value)
      },
      splitLine: { lineStyle: { color: colors.grid, width: 1 } }
    },
    series: [
      {
        name: "Teplota",
        type: "line",
        data: slots.map(slot => slot.temperature),
        symbol: "circle",
        symbolSize: 10,
        lineStyle: { width: 2, color: colors.line },
        itemStyle: { color: colors.line }
      }
    ]
  };
}
