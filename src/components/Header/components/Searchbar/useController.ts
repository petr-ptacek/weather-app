import { useClickOutside }               from "@/composables";
import type { City }                     from "@/types/city.ts";
import { ref, useTemplateRef, watch }    from "vue";
import { usePopover, usePopoverOptions } from "./composables";
import type { UseControllerOptions }     from "./types";

export function useController({ props, emit }: UseControllerOptions) {
  void emit;
  void props;

  const initialized = ref(false);
  const query = ref("");

  const rootEl = useTemplateRef<HTMLElement>("searchbar");
  const popoverCtrl = usePopover();
  const popoverOptionsCtrl = usePopoverOptions();

  useClickOutside({
    element: rootEl,
    onClickOutside: () => {
      popoverCtrl.visible.value && popoverCtrl.hide();
    }
  });

  watch(query, (value) => {
    void fetchOptions(value);
  });

  watch(popoverOptionsCtrl.error, (v) => {
    if ( v ) {
      popoverCtrl.setMessageFetchError();
    } else {
      popoverCtrl.clearMessage();
    }
  });

  function init() {
    initialized.value = true;
  }

  async function fetchOptions(query: string) {
    popoverCtrl.setMessageLoadingOptions();
    await popoverOptionsCtrl.fetch(query);
    popoverCtrl.clearMessage();

    if ( popoverOptionsCtrl.options.value.length ) {
      popoverCtrl.show();
    } else {
      popoverCtrl.setMessageNoResults();
    }
  }

  function handleInputFocus(_e: Event) {
    if ( popoverOptionsCtrl.options.value.length ) {
      popoverCtrl.show();
    }
  }

  function handleSelectOption(option: City) {
    popoverCtrl.clearMessage();
    popoverOptionsCtrl.clear();
    popoverCtrl.hide();
    emit("locationSelected", option);
  }

  return {
    query,
    initialized,
    options: popoverOptionsCtrl.options,
    optionsVisible: true,

    popoverVisible: popoverCtrl.visible,
    popoverMessage: popoverCtrl.message,

    init,
    handleInputFocus,
    handleSelectOption
  };
}