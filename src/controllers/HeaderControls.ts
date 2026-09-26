import type { MaybeHTMLElement } from "../types";

export class HeaderControls {
  root: MaybeHTMLElement = null;
  locationName: MaybeHTMLElement = null;
  locationIcon: MaybeHTMLElement = null;

  init() {
    this.root = document.getElementById("header-controls") ?? null;
    this.locationName = this.root?.querySelector(".location__name") ?? null;
    this.locationIcon = this.root?.querySelector(".location__icon") ?? null;
  }

  setLocationName(name: string) {
    if ( !this.locationName ) return;
    this.locationName.innerText = name;

    this.toggleLocationIcon(!name);
  }

  toggleLocationName(visible?: boolean) {
    if ( !this.locationName ) return;
    this.locationName.classList.toggle("hidden", visible);
  }

  toggleLocationIcon(visible?: boolean) {
    if ( !this.locationIcon ) return;
    this.locationIcon.classList.toggle("hidden", visible);
  }
}