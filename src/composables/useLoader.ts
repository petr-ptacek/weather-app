import { ref, computed } from "vue";

export function useLoader() {
  const counter = ref(0);
  const loading = computed(() => counter.value > 0);

  function show() {
    counter.value++;
  }

  function hide() {
    counter.value--;
  }

  return {
    show,
    hide,
    loading
  };
}