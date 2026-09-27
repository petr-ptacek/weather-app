import { Utils }                               from "@/utils";
import { computed, ref }                       from "vue";
import { type ChartColors, createChartOption } from "./createChartOption.ts";
import type { UseControllerOptions }           from "./types";

export function useController({ props, emit }: UseControllerOptions) {
  void emit;

  const initialized = ref(false);
  const colors = ref<ChartColors | null>(null);

  const option = computed(() => {
    if ( !colors.value ) return null;

    return createChartOption(props.data ?? null, colors.value);
  });

  function init() {
    colors.value = {
      text: Utils.readCssVar("--color-text-muted"),
      grid: Utils.readCssVar("--border-color")
    };

    initialized.value = true;
  }

  return {
    initialized,
    option,
    init
  };
}
