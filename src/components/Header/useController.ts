import { ref }                       from "vue";
import type { UseControllerOptions } from "./types";

export function useController({ props, emit }: UseControllerOptions) {
  void emit;
  void props;

  const initialized = ref(false);

  function init() {

    initialized.value = true;
  }

  return {
    init,
    initialized
  };
}