import type { City }        from "../types/city.ts";
import type { DayForecast } from "../types/forecast.ts";
import { Forecast }         from "./Forecast.ts";
import { Searchbar }        from "./Searchbar.ts";
import { HeaderControls }   from "./HeaderControls.ts";
import { DayTabs }          from "./DayTabs.ts";

export class App {
  searchbar: Searchbar;
  headerControls: HeaderControls;
  dayTabs: DayTabs;
  forecast: Forecast;
  selectedLocation: City | null;
  initialized: boolean;

  constructor() {
    this.selectedLocation = {
      name: "Olomouc",
      country: "CZ",
      state: "Central Moravia",
      lat: 49.5940567,
      lon: 17.251143
    };

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

    if ( this.selectedLocation ) {
      const { name, state, country } = this.selectedLocation;
      this.headerControls.setLocationName(`${ name }, ${ state ?? country }`);
      await this.forecast.loadData(this.selectedLocation);
    }

    this.initialized = true;
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

