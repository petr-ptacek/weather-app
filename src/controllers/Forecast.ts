import type { MaybeHTMLElement }           from "../types";
import type { City }                       from "../types/city.ts";
import { WeatherApi }                      from "../api";
import type { DayForecast, ForecastSlot } from "../types/forecast.ts";
import { DateUtils }                       from "../utils";

export interface ForecastProps {
  onDataLoaded(data: DayForecast[]): void;
}

export class Forecast {
  private static readonly TEMPERATURE_FORMAT = new Intl.NumberFormat(undefined, {
    style: "unit",
    unit: "celsius",
    maximumFractionDigits: 0
  });

  private static readonly WIND_FORMAT = new Intl.NumberFormat(undefined, {
    style: "unit",
    unit: "meter-per-second",
    maximumFractionDigits: 1
  });

  private static readonly PERCENT_FORMAT = new Intl.NumberFormat(undefined, {
    style: "unit",
    unit: "percent",
    maximumFractionDigits: 0
  });

  private _root: MaybeHTMLElement;
  private _props: ForecastProps | null;
  private _message: MaybeHTMLElement;
  private _table: MaybeHTMLElement;
  private _tableBody: MaybeHTMLElement;
  private _forecastData: DayForecast[];

  constructor(props?: ForecastProps) {
    this._props = props || null;

    this._root = null;
    this._table = null;
    this._tableBody = null;
    this._message = null;
    this._forecastData = [];
  }

  get data() {
    return this._forecastData;
  }

  init() {
    this._root = document.getElementById("forecast") ?? null;
    this._table = this._root?.querySelector(".forecast-table") ?? null;
    this._tableBody = this._table?.querySelector("tbody") ?? null;
    this._message = this._root?.querySelector(".forecast__message") ?? null;
  }

  async loadData(location: City) {
    this._forecastData = [];

    this.showMessage("Načítání dat ...");

    try {
      this._forecastData = await WeatherApi.getForecast({ lat: location.lat, lon: location.lon });
      this.hideMessage();
      this._props?.onDataLoaded(this._forecastData);
    } catch ( e ) {
      console.error(e);
      this.hideTable();
      this.showMessage("Nepodařilo se načíst předpověď počasí.", true);
    }
  }

  showMessage(message: string, error: boolean = false) {
    if ( !this._message ) return;
    this._message.innerText = message;
    this._message.classList.toggle("forecast__message--error", error);
    this._message.classList.remove("hidden");
  }

  hideMessage() {
    if ( !this._message ) return;
    this._message.innerHTML = "";
    this._message.classList.remove("forecast__message--error");
    this._message.classList.add("hidden");
  }

  hideTable() {
    if ( !this._table ) return;

    this._table.classList.add("hidden");
  }

  showTable() {
    if ( !this._table ) return;
    this._table.classList.remove("hidden");
  }

  drawTable(day: Date) {
    if ( !this._tableBody ) return;

    this._tableBody.innerHTML = "";

    const dayForecast = this._forecastData.find(d => DateUtils.isEqualDate(d.date, day));

    if ( !dayForecast ) {
      this.hideTable();
      return;
    }

    this._tableBody.append(
      ...dayForecast.slots.map(Forecast.createRow)
    );

    this.showTable();
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
      { value: Forecast.TEMPERATURE_FORMAT.format(slot.temperature), alignRight: true },
      { value: Forecast.TEMPERATURE_FORMAT.format(slot.feelsLike), alignRight: true },
      { value: Forecast.PERCENT_FORMAT.format(slot.precipitationChance), alignRight: true },
      { value: Forecast.WIND_FORMAT.format(slot.windSpeed), alignRight: true },
      { value: Forecast.PERCENT_FORMAT.format(slot.humidity), alignRight: true }
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
