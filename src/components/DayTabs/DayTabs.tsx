import type { Props }    from "./types";
import { useController } from "./useController.ts";

export function DayTabs(props: Props) {
  const { options, handleOptionSelected } = useController({ props });

  return (

    <nav className="day-tabs">
      <ul className="day-tabs__list">
        {
          options.map(opt => {
            let btnClassName = "day-tabs__button";

            if ( opt.selected ) {
              btnClassName += " day-tabs__button--active";
            }

            return (
              <li key={ opt.id } className="day-tabs__item">
                <button
                  type="button"
                  className={ btnClassName }
                  onClick={ () => handleOptionSelected(opt) }
                >
                  { opt.label }
                </button>
              </li>
            );
          })
        }
      </ul>
    </nav>
  );
}