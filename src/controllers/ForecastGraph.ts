import type { EChartsOption }                   from "echarts";
import { LineChart }                            from "echarts/charts";
import { GridComponent, TooltipComponent }      from "echarts/components";
import { type ECharts, init as initChart, use } from "echarts/core";
import { CanvasRenderer }                       from "echarts/renderers";
import type { MaybeHTMLElement }                from "../types";
import type { DayForecast }                     from "../types/forecast.ts";
import { DateUtils, FormattersUtils, Utils }    from "../utils";

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent]);

type ChartColors = {
  /** line and points */
  line: string;
  text: string;
  grid: string;
};

export class ForecastGraph {
  private _rootEl: MaybeHTMLElement;
  private _graphEl: MaybeHTMLElement;
  private _chart: ECharts | null;
  private _colors: ChartColors | null;

  constructor() {
    this._rootEl = null;
    this._graphEl = null;
    this._chart = null;
    this._colors = null;
  }

  init() {
    this._rootEl = document.getElementById("forecast-chart") ?? null;
    this._graphEl = this._rootEl?.querySelector(".forecast-chart__canvas") ?? null;

    if ( !this._graphEl ) return;

    this._chart = initChart(this._graphEl);

    this._colors = {
      line: Utils.readCssVar("--color-primary"),
      text: Utils.readCssVar("--color-text-muted"),
      grid: Utils.readCssVar("--border-color")
    };

    window.addEventListener("resize", () => this._chart?.resize());
  }

  draw(dayForecast: DayForecast) {
    if ( !this._chart || !this._colors ) return;

    // notMerge – replace the previous day completely
    this._chart.setOption(ForecastGraph.createOption(dayForecast, this._colors), { notMerge: true });
  }

  show() {
    if ( !this._rootEl ) return;
    this._rootEl.classList.remove("hidden");

    // the chart was initialized while hidden (zero size) – measure the container again
    this._chart?.resize();
  }

  hide() {
    if ( !this._rootEl ) return;
    this._rootEl.classList.add("hidden");
  }


  private static createOption(day: DayForecast, colors: ChartColors): EChartsOption {
    const slots = day.slots;
    const formatterTemperature = (v: number) => FormattersUtils.TEMPERATURE_FORMAT.format(v);

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
            `Teplota: <b>${ formatterTemperature(slot.temperature) }</b>`,
            `Pocitová: ${ formatterTemperature(slot.feelsLike) }`
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
          formatter: formatterTemperature
        },
        splitLine: { lineStyle: { color: colors.grid, width: 1 } }
      },
      series: [
        {
          name: "Teplota",
          type: "line",
          data: slots.map(slot => slot.temperature),
          symbol: "circle",
          symbolSize: 8,
          lineStyle: { width: 2, color: colors.line },
          itemStyle: { color: colors.line }
        }
      ]
    };
  }
}
