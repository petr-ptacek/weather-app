<script setup lang="ts">
import type { Props, Emits } from "./types";
import { useController }     from "./useController";
import { onMounted }         from "vue";

const props = withDefaults(
    defineProps<Props>(),
    {
      days: () => []
    }
);
const emit = defineEmits<Emits>();

const dayMV = defineModel<Date | null>("day", { default: null });

const { init, options, handleOptionSelected } = useController({
  props,
  emit,
  dayMV
});

onMounted(() => init());
</script>

<template>
  <nav class="day-tabs">
    <ul class="day-tabs__list">
      <li
          v-for="opt in options"
          :key="opt.id"
          class="day-tabs__item"
      >
        <button
            type="button"
            class="day-tabs__button"
            :class="{
              'day-tabs__button--active': opt.selected
            }"
            @click="handleOptionSelected(opt)"
        >
          {{ opt.label }}
        </button>
      </li>
    </ul>
  </nav>
</template>