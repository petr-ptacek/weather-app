import type { UseControllerOptions } from "./types";

export function useController({ props }: UseControllerOptions) {
  const { name, state, country } = props.selectedLocation ?? {};

  const locationStr = props.selectedLocation ?
                      `${ name }, ${ state ?? country }` :
                      "";

  return {
    locationStr
  };
}