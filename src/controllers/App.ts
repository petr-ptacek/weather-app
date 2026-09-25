import type { City }      from "../types/city.ts";
import { Searchbar }      from "./Searchbar.ts";
import { HeaderControls } from "./HeaderControls.ts";

export class App {
  searchbar: Searchbar;
  headerControls: HeaderControls;
  selectedLocation: City | null;

  constructor() {
    this.searchbar = new Searchbar({
      onLocationSelected: this.handleLocationSelected.bind(this)
    });

    this.headerControls = new HeaderControls();

    this.selectedLocation = null;
  }

  init() {
    if ( !import.meta.env.VITE_OPENWEATHER_API_KEY ) {
      alert("VITE_OPENWEATHER_API_KEY missing in .env.");
      return;
    }

    this.searchbar.init();
    this.headerControls.init();
  }

  handleLocationSelected(location: City) {
    this.selectedLocation = location;
    this.headerControls.setLocationName(`${ location.name }, ${ location.state ?? location.country }`);
  }
}

