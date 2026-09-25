import type { MaybeHTMLElement, Nullable } from "../types";

export interface SearchbarProps {
  onLocationSelected(): void;
}

export class Searchbar {
  private _root: MaybeHTMLElement;
  private _searchInputElement: Nullable<HTMLInputElement>;
  private _props: SearchbarProps;

  constructor(props: SearchbarProps) {
    this._root = null;
    this._searchInputElement = null;
    this._props = props;
  }

  init() {
    this._root = document.getElementById("searchbar");
    this._searchInputElement = this._root?.querySelector<HTMLInputElement>(".searchbar__input") ?? null;


    this._searchInputElement?.addEventListener("change", (e) => {
      console.log("change");
    });
  }
}