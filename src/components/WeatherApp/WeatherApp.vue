<script setup lang="ts">
import { ForecastTable }     from "@/components/ForecastTable";
import type { Props, Emits } from "./types";
import { useController }     from "./useController";
import { onMounted }         from "vue";

import { TheHeader } from "../Header";
import { DayTabs }   from "../DayTabs";

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { init, location, days, selectedDay, tableData, initialized, infoMessage } = useController({
  props,
  emit
});

onMounted(() => init());
</script>

<template>
  <div class="app">
    <div class="container">
      <div class="box flex flex-col gap-4">
        <TheHeader
            v-model:selected-location="location"
            :disable-city-repository="disableCityRepository"
        />
        <DayTabs
            v-model:day="selectedDay"
            :days="days"
        />
      </div>
    </div>

    <main>
      <div class="container">
        <div class="forecast">

          <div v-show="infoMessage" class="box">
            <div class="forecast__message">{{ infoMessage }}</div>
          </div>

          <div
              v-if="initialized"
              class="box"
          >
            <div class="overflow-x-auto">
              <ForecastTable
                  :data="tableData"
              />
            </div>
          </div>

        </div>
      </div>
    </main>
  </div>
</template>