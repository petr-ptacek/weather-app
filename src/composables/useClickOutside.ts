import { type MaybeRef, onMounted, onUnmounted, toValue } from "vue";

export type UseClickOutsideOptions = {
  element: MaybeRef<HTMLElement | null>;
  onClickOutside?: () => void;
}

export function useClickOutside(options: UseClickOutsideOptions) {

  function handleClickOutside(e: PointerEvent) {
    const element = toValue(options.element);

    if ( !element ) return;
    if ( !e.composedPath().includes(element) ) {
      options.onClickOutside?.();
    }
  }

  onMounted(() => {
    document.addEventListener("click", handleClickOutside);
  });

  onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
  });
}