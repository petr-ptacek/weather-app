import type { MaybeHTMLElement } from "../types";

interface DayTabsProps {
  days?: Date[];

  onDaySelected(day: Date): void;
}

export class DayTabs {
  private _root: MaybeHTMLElement;
  private _list: MaybeHTMLElement;
  private _props: DayTabsProps;
  private _days: Date[];

  private _selectedDay: Date | null;

  constructor(props: DayTabsProps) {
    this._props = props;

    this._days = props.days ?? [];
    this._selectedDay = null;
    this._list = null;
    this._root = null;
  }

  get days() {
    return this._days;
  }

  set days(v: Date[]) {
    this._days = v;
    this.update();
  }

  get selectedDay() {
    return this._selectedDay;
  }

  set selectedDay(v) {
    this._selectedDay = v;
    this.update();
  }

  init() {
    this._root = document.getElementById("day-tabs") ?? null;
    this._list = this._root?.querySelector(".day-tabs__list") ?? null;

    this.drawDays();
  }

  update() {
    this.drawDays();
  }

  private drawDays() {
    if ( !this._list ) return;
    this._list.innerHTML = "";

    this._list.append(
      ...this._days.map(day => {
        return createDay({
          date: day,
          onClick: () => this.handleSelectDay(day),
          isSelected: this._selectedDay === day
        });
      })
    );
  }

  private handleSelectDay(day: Date) {
    this._selectedDay = day;
    this.drawDays();
    this._props.onDaySelected(day);
  }
}

/**
 *                <li class="day-tabs__item">
 *                         <button type="button" class="day-tabs__button day-tabs__button--active">Pondělí</button>
 *                     </li>
 */
function createDay({ date, onClick, isSelected }: { date: Date, isSelected: boolean, onClick: () => void }) {
  const li = document.createElement("li");
  li.className = "day-tabs__item";

  const button = document.createElement("button");
  button.className = "day-tabs__button";

  if ( isSelected ) button.classList.add("day-tabs__button--active");

  button.innerText = date.toLocaleString();
  button.addEventListener("click", onClick);

  li.append(button);

  return li;
}