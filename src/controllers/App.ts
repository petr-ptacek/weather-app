import type { City }      from "../types/city.ts";
import { Searchbar }      from "./Searchbar.ts";
import { HeaderControls } from "./HeaderControls.ts";
import { DayTabs }        from "./DayTabs.ts";

export class App {
  searchbar: Searchbar;
  headerControls: HeaderControls;
  dayTabs: DayTabs;
  selectedLocation: City | null;

  constructor() {
    this.searchbar = new Searchbar({
      onLocationSelected: this.handleLocationSelected.bind(this)
    });

    this.headerControls = new HeaderControls();

    this.dayTabs = new DayTabs({
      days: [new Date],
      onDaySelected: this.handleDaySelected.bind(this)
    });

    this.selectedLocation = null;
  }

  init() {
    if ( !import.meta.env.VITE_OPENWEATHER_API_KEY ) {
      alert("VITE_OPENWEATHER_API_KEY missing in .env.");
      return;
    }

    this.dayTabs.init();
    this.searchbar.init();
    this.headerControls.init();
  }

  handleDaySelected(_day: Date) {

  }

  handleLocationSelected(location: City) {
    this.selectedLocation = location;
    this.headerControls.setLocationName(`${ location.name }, ${ location.state ?? location.country }`);
  }
}

