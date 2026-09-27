<script setup lang="ts">
import type { Props, Emits } from "./types";
import { useController }     from "./useController";
import { onMounted }         from "vue";

import { TheHeader }   from "../Header";
import { DayTabs }     from "../DayTabs";
import { TheForecast } from "../Forecast";

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { init } = useController({
  props,
  emit
});

onMounted(() => init());
</script>

<template>
  <div class="app">
    <div class="container">
      <div class="box flex flex-col gap-4">
        <TheHeader />
        <DayTabs />
      </div>
    </div>

    <main>
      <div class="container">
        <TheForecast />
      </div>
    </main>
  </div>
</template>