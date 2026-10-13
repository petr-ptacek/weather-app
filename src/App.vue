<script setup lang="ts">
import { WeatherApp } from "./components";

const disableCityRepository = import.meta.env.VITE_ENABLE_CITY_REPOSITORY === "false";
</script>

<template>
  <WeatherApp :disable-city-repository="disableCityRepository" />
</template>
