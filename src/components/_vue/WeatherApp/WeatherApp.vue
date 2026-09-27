<script setup lang="ts">
import { ForecastTable }     from "@/components/ForecastTable";
import { ForecastChart }     from "@/components/ForecastChart";
import type { Props, Emits } from "./types";
import { useController }     from "./useController";
import { onMounted }         from "vue";

import { TheHeader } from "../Header";
import { DayTabs }   from "../DayTabs";

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const {
  init,
  location,
  days,
  selectedDay,
  tableData,
  initialized,
  hasError,
  infoMessage,
  errorMessage
} = useController({
  props,
  emit
});

onMounted(() => init());
</script>

<template>
  <div class="weather-app">
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

          <div v-show="errorMessage" class="box">
            <div class="forecast__message forecast__message--error">{{ errorMessage }}</div>
          </div>

          <div
              v-if="initialized && !hasError"
              class="box"
          >
            <div class="overflow-x-auto">
              <ForecastTable
                  :data="tableData"
              />
            </div>
          </div>

          <div
              v-if="initialized && !hasError"
              class="box"
          >
            <ForecastChart
                :data="tableData"
            />
          </div>

        </div>
      </div>
    </main>
  </div>
</template>