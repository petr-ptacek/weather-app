import { useCallback, useState } from "react";

export function useLoader() {
  const [counter, setCounter] = useState(0);
  const loading = counter > 0;

  // https://react.dev/reference/react/useCallback
  const show = useCallback(() => setCounter((v) => v + 1), []);
  const hide = useCallback(() => setCounter((v) => v - 1), []);

  return {
    show,
    hide,
    loading
  };
}