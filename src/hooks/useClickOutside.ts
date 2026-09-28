import { type RefObject, useEffect, useRef } from "react";

export type UseClickOutsideOptions = {
  element: RefObject<HTMLElement | null>;
  onClickOutside?: () => void;
}

export function useClickOutside(options: UseClickOutsideOptions) {
  const { element } = options;

  const callbackRef = useRef(options.onClickOutside);
  callbackRef.current = options.onClickOutside;

  useEffect(() => {
    function handleClickOutside(e: PointerEvent) {
      if ( !element.current ) return;
      if ( !e.composedPath().includes(element.current) ) {
        callbackRef.current?.();
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [element]);
}
