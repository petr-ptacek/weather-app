import { getCities }             from "../api";
import type { MaybeHTMLElement } from "../types";
import type { City }             from "../types/city.ts";

export interface SearchbarProps {
  onLocationSelected(location: City): void;
}

const NO_RESULTS = "Žádné výsledky";

export class Searchbar {
  private _root: MaybeHTMLElement;
  private _inputElement: MaybeHTMLElement<HTMLInputElement>;
  private _popoverElement: MaybeHTMLElement<HTMLDivElement>;
  private _optionsElement: MaybeHTMLElement<HTMLDivElement>;
  private _messageElement: MaybeHTMLElement<HTMLDivElement>;
  private _props: SearchbarProps;

  private _cities: City[] = [];

  constructor(props: SearchbarProps) {
    this._root = null;
    this._inputElement = null;
    this._props = props;
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
  }

  handleDocumentClick(e: MouseEvent) {
    if ( !this._root ) return;

    if ( !e.composedPath().includes(this._root) ) {
      this.hidePopover();
    }
  }

  handleInputFocus(_e: Event) {
    if ( this._cities.length ) {
      this.showPopover();
    }
  }

  async handleInputChange(e: Event) {
    const value = (e.target as HTMLInputElement).value.trim();

    if ( !value ) {
      this._cities = [];
      this.drawOptions();
      this.hidePopover();
      return;
    }

    await this.fetchCities(value);
    this.drawOptions();
    this.setMessage(!this._cities.length ? NO_RESULTS : "");
    this.showPopover();
  }

  setMessage(message: string) {
    if ( !this._messageElement ) return;
    this._messageElement.innerText = message;
  }

  showPopover() {
    this._popoverElement?.classList.remove("hidden");
  }

  hidePopover() {
    this._popoverElement?.classList.add("hidden");
  }

  private handleLocationSelected(location: City) {
    this._props.onLocationSelected(location);
    this.hidePopover();
  }

  private async fetchCities(query: string) {
    this._cities = await getCities({ query });
  }

  private drawOptions() {
    if ( !this._optionsElement ) return;
    this._optionsElement.innerHTML = "";

    this._optionsElement.append(
      ...this._cities.map((city) => {
          return createOption(
            city, () => this.handleLocationSelected(city)
          );
        }
      )
    );
  }
}

/**
 * <li>
 *      <button type="button" class="searchbar__option searchbar__option--highlighted">
 *          Olomouc <span class="searchbar__option-meta">CZ</span>
 *      </button>
 *  </li>
 */
function createOption(city: City, onClick: (e: Event) => void) {
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


