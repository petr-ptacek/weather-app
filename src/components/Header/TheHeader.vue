<script setup lang="ts">
import type { City }         from "@/types/city.ts";
import type { Props, Emits } from "./types";
import { useController }     from "./useController";
import { onMounted }         from "vue";
import { TheSearchbar }      from "./components";

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const selectedLocationMV = defineModel<City | null>("selectedLocation", { default: null });

const { init, locationStr } = useController({
  props,
  emit,
  selectedLocationMV
});

onMounted(() => init());
</script>

<template>
  <header class="header">
    <div class="flex gap-1 items-center">
      <div class="header__icon icon">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
        >
          <circle cx="25" cy="24" r="13" fill="#fbbf24" />

          <g
              stroke="#fbbf24"
              stroke-width="4"
              stroke-linecap="round"
          >
            <path d="M25 4v5" />
            <path d="M25 39v5" />
            <path d="M5 24h5" />
            <path d="M40 24h5" />
            <path d="M11 10l4 4" />
            <path d="M39 10l-4 4" />
          </g>

          <path
              d="M18 51h31
       a10 10 0 0 0 0-20
       a15 15 0 0 0-28-3
       a12 12 0 0 0-3 23z"
              fill="#e2e8f0"
              stroke="#94a3b8"
              stroke-width="2"
          />
        </svg>
      </div>
      <h1 class="header__title">Přehled počasí</h1>
    </div>

    <div class="header__controls">
      <div
          v-if="locationStr"
          class="location"
      >
        <svg class="icon location__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none" />
          <path
              fill="currentColor"
              d="M18 8c0-3.31-2.69-6-6-6S6 4.69 6 8c0 4.5 6 11 6 11s6-6.5 6-11m-8 0c0-1.1.9-2 2-2s2 .9 2 2a2 2 0 1 1-4 0M5 20v2h14v-2z" />
        </svg>
        <span class="location__name">{{ locationStr }}</span>
      </div>

      <TheSearchbar
          :selected-location="selectedLocation"
          @update:selected-location="selectedLocation = $event"
      />
    </div>
  </header>
</template>