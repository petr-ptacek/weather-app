import { Utils }                               from "@/utils";
import { useEffect, useState }                 from "react";
import { type ChartColors, createChartOption } from "./createChartOption.ts";
import type { UseControllerOptions }           from "./types";


export function useController({ props }: UseControllerOptions) {
  const [colors, setColors] = useState<ChartColors | null>(null);

  const option = !colors ?
                 null :
                 createChartOption(props.data ?? null, colors);


  useEffect(() => {
    setColors({
      line: Utils.readCssVar("--color-primary"),
      text: Utils.readCssVar("--color-text-muted"),
      grid: Utils.readCssVar("--border-color"),
    });
  }, []);


  return {
    option
  };
}
