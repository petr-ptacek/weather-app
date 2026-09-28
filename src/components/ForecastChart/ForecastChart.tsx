import ReactECharts      from "echarts-for-react";
import type { Props }    from "./types";
import { useController } from "./useController.ts";


export function ForecastChart(props: Props) {
  const { option } = useController({ props });

  return (
    <section className="forecast-chart">
      <h2 className="forecast-chart__title">Vývoj teploty</h2>

      {
        option && (
          <ReactECharts
            option={ option }
            className="forecast-chart__canvas"
            autoResize={ true }
          />
        )
      }

    </section>
  );
}