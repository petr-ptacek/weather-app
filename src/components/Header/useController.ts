import { computed, ref }             from "vue";
import type { UseControllerOptions } from "./types";

export function useController({ props, emit, selectedLocationMV }: UseControllerOptions) {
  void emit;
  void props;

  const initialized = ref(false);

  const locationStr = computed(() => {
    if ( !selectedLocationMV.value ) {
      return "";
    }

    const { name, state, country } = selectedLocationMV.value;

    return `${ name }, ${ state ?? country }`;
  });

  function init() {
    initialized.value = true;
  }

  return {
    init,
    locationStr,
    initialized
  };
}