import { useClickOutside }                                                from "@/composables";
import type { City }                                                      from "@/types/city.ts";
import { type ChangeEvent, type FocusEvent, useEffect, useRef, useState } from "react";
import { usePopoverOptions }                                              from "./hooks";
import type { UseControllerOptions }                                      from "./types";

const NO_RESULTS = "Žádné výsledky";
const FETCH_ERROR = "Nepodařilo se načíst města";
const LOADING_OPTIONS = "Načítání možností …";

export function useController({ props }: UseControllerOptions) {
  const [query, setQuery] = useState("");
  const rootEl = useRef<HTMLDivElement>(null);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const popoverOptionsCtrl = usePopoverOptions({
    disableCityRepository: props.disableCityRepository ?? false
  });

  const popoverMessage =
    popoverOptionsCtrl.loading ? LOADING_OPTIONS :
    popoverOptionsCtrl.error ? FETCH_ERROR :
    query.trimStart() && !popoverOptionsCtrl.options.length ? NO_RESULTS :
    "";

  useClickOutside({
    element: rootEl,
    onClickOutside: () => {
      popoverVisible && setPopoverVisible(false);
    }
  });

  useEffect(() => {
    void fetchOptions(query);
  }, [query]);


  async function fetchOptions(query: string) {
    if ( !query.trimStart().length ) return;

    setPopoverVisible(true);
    await popoverOptionsCtrl.fetchOptions(query);
  }

  function handleInputFocus(_e: FocusEvent<HTMLInputElement>) {
    if ( popoverOptionsCtrl.options.length ) {
      setPopoverVisible(true);
    }
  }

  function handleSelectOption(option: City) {
    popoverOptionsCtrl.clear();
    setPopoverVisible(false);
    setQuery("");
    props.onSelectLocation(option);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
  }

  return {
    query,
    handleInputChange,

    options: popoverOptionsCtrl.options,
    optionsVisible: true,

    rootEl,

    popoverVisible,
    popoverMessage,

    handleInputFocus,
    handleSelectOption
  };
}