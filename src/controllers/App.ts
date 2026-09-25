import { Searchbar } from "./Searchbar.ts";

export class App {
  searchbar: Searchbar;

  constructor() {
    this.searchbar = new Searchbar();
  }

  init() {
    this.searchbar.init();
  }
}