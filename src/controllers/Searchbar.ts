import { CityRepositoryApi, WeatherApi } from "../api";
import type { MaybeHTMLElement } from "../types";
import type { City }             from "../types/city.ts";
import { Utils }                 from "../utils";

export interface SearchbarProps {
  cities?: City[];
  enableCityRepository?: boolean;

  onLocationSelected(location: City): void;
}

const NO_RESULTS = "Žádné výsledky";
const FETCH_ERROR = "Nepodařilo se načíst města";
const LOADING_OPTIONS = "Načítání možností …";
const LOAD_OPTIONS_ERROR = "Nepodařilo se načíst seznam měst";

export class Searchbar {
  private _root: MaybeHTMLElement;
  private _inputElement: MaybeHTMLElement<HTMLInputElement>;
  private _popoverElement: MaybeHTMLElement<HTMLDivElement> = null;
  private _optionsElement: MaybeHTMLElement<HTMLDivElement> = null;
  private _messageElement: MaybeHTMLElement<HTMLDivElement> = null;
  private _props: SearchbarProps;
  private _enableCityRepository: boolean;
  private _cityRepository: CityRepositoryApi;
  /** true while the local city list is being loaded */
  private _loadingOptions: boolean = false;

  private _cities: City[];

  constructor(props: SearchbarProps) {
    this._root = null;
    this._inputElement = null;
    this._props = props;
    this._enableCityRepository = this._props.enableCityRepository ?? true;
    this._cityRepository = new CityRepositoryApi({
      onCitiesLoaded: this.handleCitiesLoaded.bind(this),
      onCitiesLoadError: this.handleCitiesLoadError.bind(this)
    });

    this._cities = props.cities ?? [];
  }

  init() {
    this._root = document.getElementById("searchbar");
    this._inputElement = this._root?.querySelector<HTMLInputElement>(".searchbar__input") ?? null;
    this._popoverElement = this._root?.querySelector<HTMLDivElement>(".searchbar__popover") ?? null;
    this._optionsElement = this._root?.querySelector<HTMLDivElement>(".searchbar__options") ?? null;
    this._messageElement = this._root?.querySelector<HTMLDivElement>(".searchbar__message") ?? null;

    this._inputElement?.addEventListener("input", this.handleInputChange.bind(this));
    this._inputElement?.addEventListener("focus", this.handleInputFocus.bind(this));

    document.addEventListener("click", this.handleDocumentClick.bind(this));

    if ( this._enableCityRepository ) {
      void this.loadOptions();
    }
  }

  private async loadOptions() {
    this._loadingOptions = true;
    this.setInputDisabled(true);
    this.setMessage(LOADING_OPTIONS);
    this.showPopover();

    await this._cityRepository.loadCities();
  }

  private handleCitiesLoaded(_cities: City[]) {
    this._loadingOptions = false;
    this.setInputDisabled(false);
    this.setMessage("");
    this.hidePopover();
  }

  private handleCitiesLoadError(_error: unknown) {
    this._loadingOptions = false;
    this.setMessage(LOAD_OPTIONS_ERROR, true);
  }

  private setInputDisabled(disabled: boolean) {
    if ( !this._inputElement ) return;
    this._inputElement.disabled = disabled;
  }

  private handleDocumentClick(e: MouseEvent) {
    if ( !this._root ) return;
    if ( this._loadingOptions ) return;

    if ( !e.composedPath().includes(this._root) ) {
      this.hidePopover();
    }
  }

  private handleInputFocus(_e: Event) {
    if ( this._cities.length ) {
      this.showPopover();
    }
  }

  private async handleInputChange(e: Event) {
    const value = (e.target as HTMLInputElement).value.trim();

    if ( !value ) {
      this._fetchCities.abort();
      this._cities = [];
      this.drawOptions();
      this.hidePopover();
      return;
    }

    try {
      this._cities = await this._fetchCities(value);
      this.setMessage(!this._cities.length ? NO_RESULTS : "");
    } catch ( e ) {
      // superseded by a newer input – newer call handles the UI
      if ( Utils.isAbortError(e) ) return;

      this._cities = [];
      this.setMessage(FETCH_ERROR, true);
    }

    this.drawOptions();
    this.showPopover();
  }

  setMessage(message: string, error: boolean = false) {
    if ( !this._messageElement ) return;
    this._messageElement.innerText = message;
    this._messageElement.classList.toggle("searchbar__message--error", error);
  }

  showPopover() {
    this._popoverElement?.classList.remove("hidden");
  }

  hidePopover() {
    this._popoverElement?.classList.add("hidden");
  }

  private handleLocationSelected(location: City) {
    this._props.onLocationSelected(location);
    this.clear();
  }

  private clear() {
    this._fetchCities.abort();
    if ( this._inputElement ) this._inputElement.value = "";
    this._cities = [];
    this.drawOptions();
    this.setMessage("");
    this.hidePopover();
  }

  private readonly _fetchCities = Utils.withAbortable(
    async (signal, query: string): Promise<City[]> => {
      if ( this._enableCityRepository ) {
        return this._cityRepository.filterByQuery(query);
      }

      return WeatherApi.getCities({ query }, signal);
    }
  );

  private drawOptions() {
    if ( !this._optionsElement ) return;
    this._optionsElement.innerHTML = "";

    this._optionsElement.append(
      ...this._cities.map((city) => {
          return Searchbar.createOption(
            city, () => this.handleLocationSelected(city)
          );
        }
      )
    );
  }

  /**
   * <li>
   *      <button type="button" class="searchbar__option searchbar__option--highlighted">
   *          Olomouc <span class="searchbar__option-meta">CZ</span>
   *      </button>
   *  </li>
   */
  private static createOption(city: City, onClick: (e: Event) => void) {
    const meta = document.createElement("span");
    meta.innerText = city.state ?? city.country;
    meta.className = "searchbar__option-meta";

    const button = document.createElement("button");
    button.className = "searchbar__option";
    button.addEventListener("click", onClick);

    button.append(city.name, meta);

    const li = document.createElement("li");
    li.append(button);

    return li;
  }
}
