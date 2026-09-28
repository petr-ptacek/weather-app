import type { Props }    from "./types";
import { useController } from "./useController.ts";

export function ForecastTable(props: Props) {
  const { rows } = useController({ props });

  return (
    <table className="forecast__table forecast-table">
      <thead>
        <tr>
          <th className="forecast-table__header-cell">Čas</th>
          <th className="forecast-table__header-cell forecast-table__header-cell--right">Teplota</th>
          <th className="forecast-table__header-cell forecast-table__header-cell--right">Pocitová
                                                                                         teplota
          </th>
          <th className="forecast-table__header-cell forecast-table__header-cell--right">Srážky</th>
          <th className="forecast-table__header-cell forecast-table__header-cell--right">Vítr</th>
          <th className="forecast-table__header-cell forecast-table__header-cell--right">Vlhkost</th>
        </tr>
      </thead>

      <tbody>
        {
          rows.map(row => {
            return (
              <tr key={ row.id } className="forecast-table__row">
                {
                  row.cells.map(cell => {
                    return (
                      <td
                        key={ cell.id }
                        className={
                          [
                            "forecast-table__cell",
                            cell.alignRight ? "forecast-table__cell--right" : ""
                          ].filter(Boolean).join(" ")
                        }
                      >
                        { cell.value }
                      </td>
                    );
                  })
                }
              </tr>
            );
          })
        }

      </tbody>
    </table>
  );
}