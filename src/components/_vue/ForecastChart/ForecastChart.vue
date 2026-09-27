<script setup lang="ts">
import { LineChart }                                          from "echarts/charts";
import { GridComponent, TooltipComponent }          from "echarts/components";
import { use }                                                from "echarts/core";
import { CanvasRenderer }                                     from "echarts/renderers";
import VChart                                                 from "vue-echarts";
import { onMounted }                                          from "vue";
import type { Emits, Props }                                  from "./types";
import { useController }                                      from "./useController";

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent]);

const props = withDefaults(
    defineProps<Props>(),
    {
      data: null
    }
);
const emit = defineEmits<Emits>();

const { init, option } = useController({
  props,
  emit
});

onMounted(() => init());
</script>

<template>
  <section class="forecast-chart">
    <h2 class="forecast-chart__title">Vývoj teploty</h2>

    <VChart
        v-if="option"
        class="forecast-chart__canvas"
        :option="option"
        autoresize
    />
  </section>
</template>
