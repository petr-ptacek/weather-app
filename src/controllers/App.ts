import { Searchbar } from "./Searchbar.ts";

export class App {
  searchbar: Searchbar;

  constructor() {
    this.searchbar = new Searchbar({
      onLocationSelected: () => void 0
    });
  }

  init() {
    if ( !import.meta.env.VITE_OPENWEATHER_API_KEY ) {
      alert("VITE_OPENWEATHER_API_KEY missing in .env.");
      return;
    }

    this.searchbar.init();
  }


}