import type { MaybeHTMLElement } from "../types";
import type { City }             from "../types/city.ts";
import { WeatherApi }            from "../api";
import type { DayForecast }      from "../types/forecast.ts";
import { DateUtils }             from "../utils";
import { ForecastGraph }         from "./ForecastGraph.ts";
import { ForecastTable }         from "./ForecastTable.ts";

export interface ForecastProps {
  onDataLoaded(data: DayForecast[]): void;
}

export class Forecast {


  private _root: MaybeHTMLElement;
  private _props: ForecastProps | null;
  private _message: MaybeHTMLElement;
  private _forecastData: DayForecast[];

  private _tableCtrl: ForecastTable;

  private _graphCtrl: ForecastGraph;

  constructor(props?: ForecastProps) {
    this._props = props || null;

    this._root = null;
    this._message = null;
    this._forecastData = [];
    this._graphCtrl = new ForecastGraph();
    this._tableCtrl = new ForecastTable();
  }

  get data() {
    return this._forecastData;
  }

  init() {
    this._root = document.getElementById("forecast") ?? null;
    this._message = this._root?.querySelector(".forecast__message") ?? null;

    this._graphCtrl.init();
    this._tableCtrl.init();
  }

  async loadData(location: City) {
    this._forecastData = [];

    this.showMessage("Načítání dat ...");

    try {
      this._forecastData = await WeatherApi.getForecast({ lat: location.lat, lon: location.lon });
      this.hideMessage();
      this._props?.onDataLoaded(this._forecastData);
    } catch ( e ) {
      this._tableCtrl.hide();
      this._graphCtrl.hide();
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

  draw(day: Date) {
    const dayForecast = this._forecastData.find(d => DateUtils.isEqualDate(d.date, day));

    if ( !dayForecast ) {
      this._graphCtrl.hide();
      this._tableCtrl.hide();
      return;
    }

    this.drawTable(dayForecast);
    this.drawGraph(dayForecast);
  }

  private drawTable(dayForecast: DayForecast) {
    this._tableCtrl.draw(dayForecast);
    this._tableCtrl.show();
  }

  private drawGraph(dayForecast: DayForecast) {
    this._graphCtrl.draw(dayForecast);
    this._graphCtrl.show();
  }
}
