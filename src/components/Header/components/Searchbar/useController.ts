import { useClickOutside }               from "@/composables";
import type { City }                     from "@/types/city.ts";
import { ref, useTemplateRef, watch }    from "vue";
import { usePopover, usePopoverOptions } from "./composables";
import type { UseControllerOptions }     from "./types";

export function useController({ props, emit, selectedLocationMV }: UseControllerOptions) {
  void emit;
  void props;

  const initialized = ref(false);
  const query = ref("");

  const rootEl = useTemplateRef<HTMLElement>("searchbar");
  const popoverCtrl = usePopover();
  const popoverOptionsCtrl = usePopoverOptions({
    disableCityRepository: props.disableCityRepository ?? false
  });

  useClickOutside({
    element: rootEl,
    onClickOutside: () => {
      popoverCtrl.visible.value && popoverCtrl.hide();
    }
  });

  watch(query, (value) => {
    void fetchOptions(value);
  });

  async function init() {
    initialized.value = true;
  }

  async function fetchOptions(query: string) {
    if ( !query.trimStart().length ) return;

    popoverCtrl.setMessageLoadingOptions();
    popoverCtrl.show();
    await popoverOptionsCtrl.fetchOptions(query);

    if ( popoverOptionsCtrl.error.value ) {
      popoverCtrl.setMessageFetchError();
    } else if ( !popoverOptionsCtrl.options.value.length ) {
      popoverCtrl.setMessageNoResults();
    } else {
      popoverCtrl.clearMessage();
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
    query.value = "";
    selectedLocationMV.value = option;
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