<script setup lang="ts">
import type { Props, Emits } from "./types";
import { useController }     from "./useController";
import { onMounted }         from "vue";

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { init } = useController({
  props,
  emit
});

onMounted(() => init());
</script>

<template>
  <nav id="day-tabs" class="day-tabs">
    <ul class="day-tabs__list">
      <li class="day-tabs__item">
        <button type="button" class="day-tabs__button day-tabs__button--active">Pondělí 21.6.2026</button>
      </li>
      <li class="day-tabs__item">
        <button type="button" class="day-tabs__button">Úterý 22.6.2026</button>
      </li>
      <li class="day-tabs__item">
        <button type="button" class="day-tabs__button">Středa 23.6.2026</button>
      </li>
    </ul>
  </nav>
</template>