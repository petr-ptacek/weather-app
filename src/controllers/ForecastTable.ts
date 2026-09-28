import type { MaybeHTMLElement }          from "../types";
import type { DayForecast, ForecastSlot } from "../types/forecast.ts";
import { DateUtils, FormattersUtils }     from "../utils";

export class ForecastTable {
  private _rootEl: MaybeHTMLElement = null;
  private _tableEl: MaybeHTMLElement = null;
  private _bodyEl: MaybeHTMLElement = null;


  init() {
    this._rootEl = document.getElementById("forecast-table") ?? null;
    this._tableEl = this._rootEl?.querySelector(".forecast-table__table") ?? null;
    this._bodyEl = this._tableEl?.querySelector("tbody") ?? null;
  }

  show() {
    if ( !this._rootEl ) return;
    this._rootEl.classList.remove("hidden");
  }

  hide() {
    if ( !this._rootEl ) return;
    this._rootEl.classList.add("hidden");
  }

  draw(dayForecast: DayForecast) {
    if ( !this._bodyEl ) return;

    this._bodyEl.innerHTML = "";

    this._bodyEl.append(
      ...dayForecast.slots.map(ForecastTable.createRow)
    );
  }

  /**
   * <tr class="forecast-table__row">
   *   <td class="forecast-table__cell">9:00</td>
   *   <td class="forecast-table__cell forecast-table__cell--right">14 °C</td>
   * </tr>
   */
  private static createRow(slot: ForecastSlot) {
    const tr = document.createElement("tr");
    tr.className = "forecast-table__row";

    const cells: { value: string, alignRight?: boolean }[] = [
      { value: DateUtils.formatTime(slot.time) },
      { value: FormattersUtils.TEMPERATURE_FORMAT.format(slot.temperature), alignRight: true },
      { value: FormattersUtils.TEMPERATURE_FORMAT.format(slot.feelsLike), alignRight: true },
      { value: FormattersUtils.PERCENT_FORMAT.format(slot.precipitationChance), alignRight: true },
      { value: FormattersUtils.WIND_FORMAT.format(slot.windSpeed), alignRight: true },
      { value: FormattersUtils.PERCENT_FORMAT.format(slot.humidity), alignRight: true }
    ];

    cells.forEach(({ value, alignRight }) => {
      const td = document.createElement("td");
      td.className = "forecast-table__cell";

      if ( alignRight ) td.classList.add("forecast-table__cell--right");

      td.innerText = value;
      tr.append(td);
    });

    return tr;
  }
}