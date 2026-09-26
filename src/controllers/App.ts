import type { City }        from "../types/city.ts";
import type { DayForecast } from "../types/forecast.ts";
import { Forecast }         from "./Forecast.ts";
import { Searchbar }        from "./Searchbar.ts";
import { HeaderControls }   from "./HeaderControls.ts";
import { DayTabs }          from "./DayTabs.ts";
import { WeatherApi }       from "../api";
import { Utils }            from "../utils";

export class App {
  private static readonly DEFAULT_LOCATION: City = {
    name: "Olomouc",
    country: "CZ",
    state: "Central Moravia",
    lat: 49.5940567,
    lon: 17.251143
  };

  searchbar: Searchbar;
  headerControls: HeaderControls;
  dayTabs: DayTabs;
  forecast: Forecast;
  selectedLocation: City | null;
  initialized: boolean;

  constructor() {
    this.selectedLocation = null;

    this.searchbar = new Searchbar({
      onLocationSelected: this.handleLocationSelected.bind(this)
    });

    this.headerControls = new HeaderControls();

    this.dayTabs = new DayTabs({
      onDaySelected: this.handleDaySelected.bind(this)
    });

    this.forecast = new Forecast({
      onDataLoaded: this.handleForecastDataLoaded.bind(this)
    });

    this.initialized = false;
  }

  async init() {
    if ( !import.meta.env.VITE_OPENWEATHER_API_KEY ) {
      alert("VITE_OPENWEATHER_API_KEY missing in .env.");
      return;
    }

    this.headerControls.init();
    this.searchbar.init();
    this.dayTabs.init();
    this.forecast.init();

    this.forecast.showMessage("Zjišťuji polohu…");
    const location = await this.resolveInitialLocation();
    await this.handleLocationSelected(location);

    this.initialized = true;
  }

  /**
   * Tries user's current position, falls back to the default location
   * when geolocation is denied, unavailable, times out or no city is found.
   */
  private async resolveInitialLocation(): Promise<City> {
    try {
      const coords = await Utils.getCurrentPosition();
      const city = await WeatherApi.getCityByCoords({ lat: coords.latitude, lon: coords.longitude });

      if ( !city ) return App.DEFAULT_LOCATION;

      // keep exact user's position for the forecast, the city is used for its name
      return { ...city, lat: coords.latitude, lon: coords.longitude };
    } catch ( e ) {
      return App.DEFAULT_LOCATION;
    }
  }

  private handleForecastDataLoaded(data: DayForecast[]) {
    const days = data.map(i => i.date);
    if ( !days.length ) return;
    this.dayTabs.setDays(days);
    this.dayTabs.setSelectedDay(days.at(0)!);
    this.forecast.drawTable(days.at(0)!);
  }

  private handleDaySelected(day: Date) {
    this.forecast.drawTable(day);
  }

  async handleLocationSelected(location: City) {
    this.selectedLocation = location;
    this.headerControls.setLocationName(`${ location.name }, ${ location.state ?? location.country }`);
    await this.forecast.loadData(location);
  }
}

