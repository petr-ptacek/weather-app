import { ref, readonly } from "vue";

const NO_RESULTS = "Žádné výsledky";
const FETCH_ERROR = "Nepodařilo se načíst města";
const LOADING_OPTIONS = "Načítání možností …";

// const LOAD_OPTIONS_ERROR = "Nepodařilo se načíst seznam měst";

export function usePopover() {
  const message = ref("");
  const visible = ref(false);

  function setMessage(msg: string) {
    message.value = msg;
  }

  function setMessageNoResults() {
    setMessage(NO_RESULTS);
  }

  function setMessageFetchError() {
    setMessage(FETCH_ERROR);
  }

  function setMessageLoadingOptions() {
    setMessage(LOADING_OPTIONS);
  }

  function clearMessage() {
    message.value = "";
  }

  function show() {
    visible.value = true;
  }

  function hide() {
    visible.value = false;
    clearMessage();
  }

  return {
    message: readonly(message),
    visible: readonly(visible),
    show,
    hide,
    setMessage,
    setMessageFetchError,
    setMessageLoadingOptions,
    setMessageNoResults,
    clearMessage
  };
}