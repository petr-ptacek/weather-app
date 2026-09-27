<script setup lang="ts">
import type { City }         from "@/types/city.ts";
import type { Props, Emits } from "./types";
import { useController }     from "./useController";
import { onMounted }         from "vue";

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const selectedLocationMV = defineModel<City | null>("selectedLocation", { default: null });

const {
  init,
  query,
  popoverVisible,
  popoverMessage,
  options,
  optionsVisible,
  handleInputFocus,
  handleSelectOption
} = useController({
  props,
  emit,
  selectedLocationMV
});

onMounted(() => init());
</script>

<template>
  <div class="searchbar" ref="searchbar">
    <svg class="icon searchbar__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M0 0h24v24H0z" fill="none" />
      <path
          fill="currentColor"
          d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14" />
    </svg>

    <input
        v-model="query"
        type="search"
        class="searchbar__input"
        autocomplete="off"
        placeholder="Lokace"
        @focus="handleInputFocus"
    >

    <div v-show="popoverVisible" class="searchbar__popover">
      <div
          v-show="popoverMessage"
          class="searchbar__message"
      >
        {{ popoverMessage }}
      </div>

      <ul v-show="optionsVisible" class="searchbar__options">
        <li v-for="option in options" :key="option.id">
          <button
              type="button"
              class="searchbar__option"
              @click="handleSelectOption(option)"
          >
            <span>{{ option.name }}</span> <span class="searchbar__option-meta">{{
              option.state ?? option.country
                                                                                }}</span>
          </button>
        </li>

        <!--                                 <li> -->
        <!--                                     <button type="button" class="searchbar__option searchbar__option&#45;&#45;highlighted"> -->
        <!--                                         Olomouc <span class="searchbar__option-meta">CZ</span> -->
        <!--                                     </button> -->
        <!--                                 </li> -->
        <!--                                 <li> -->
        <!--                                     <button type="button" class="searchbar__option"> -->
        <!--                                         Praha <span class="searchbar__option-meta">CZ</span> -->
        <!--                                     </button> -->
        <!--                                 </li> -->
      </ul>
    </div>
  </div>
</template>