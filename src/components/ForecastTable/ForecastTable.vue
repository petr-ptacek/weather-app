<script setup lang="ts">
import { onMounted }         from "vue";
import type { Emits, Props } from "./types";
import { useController }     from "./useController";

const props = withDefaults(
    defineProps<Props>(),
    {
      data: null
    }
);
const emit = defineEmits<Emits>();

const { init, rows } = useController({
  props,
  emit
});

onMounted(() => init());
</script>

<template>
  <table class="forecast__table forecast-table">
    <thead>
      <tr>
        <th class="forecast-table__header-cell">Čas</th>
        <th class="forecast-table__header-cell forecast-table__header-cell--right">Teplota</th>
        <th class="forecast-table__header-cell forecast-table__header-cell--right">Pocitová
                                                                                   teplota
        </th>
        <th class="forecast-table__header-cell forecast-table__header-cell--right">Srážky</th>
        <th class="forecast-table__header-cell forecast-table__header-cell--right">Vítr</th>
        <th class="forecast-table__header-cell forecast-table__header-cell--right">Vlhkost</th>
      </tr>
    </thead>

    <tbody>
      <tr
          v-for="row in rows"
          :key="row.id"
          class="forecast-table__row"
      >
        <td
            v-for="cell in row.cells"
            :key="cell.id"
            class="forecast-table__cell"
            :class="{
              'forecast-table__cell--right': cell.alignRight
            }"
        >
          {{ cell.value }}
        </td>
      </tr>

      <!--                         <tr class="forecast-table__row"> -->
      <!--                             <td class="forecast-table__cell">9:00</td> -->
      <!--                                   <td class="forecast-table__cell forecast-table__cell&#45;&#45;right">14 °C</td> -->
      <!--                             <td class="forecast-table__cell forecast-table__cell&#45;&#45;right">12 °C</td> -->
      <!--                             <td class="forecast-table__cell forecast-table__cell&#45;&#45;right">3,2 m/s</td> -->
      <!--                             <td class="forecast-table__cell forecast-table__cell&#45;&#45;right">78 %</td> -->
      <!--                         </tr> -->
      <!--                         <tr class="forecast-table__row"> -->
      <!--                             <td class="forecast-table__cell">12:00</td> -->
      <!--                             <td class="forecast-table__cell forecast-table__cell&#45;&#45;right">18 °C</td> -->
      <!--                             <td class="forecast-table__cell forecast-table__cell&#45;&#45;right">17 °C</td> -->
      <!--                             <td class="forecast-table__cell forecast-table__cell&#45;&#45;right">4,1 m/s</td> -->
      <!--                             <td class="forecast-table__cell forecast-table__cell&#45;&#45;right">60 %</td> -->
      <!--                         </tr> -->
      <!--                         <tr class="forecast-table__row"> -->
      <!--                             <td class="forecast-table__cell">15:00</td> -->
      <!--                             <td class="forecast-table__cell forecast-table__cell&#45;&#45;right">21 °C</td> -->
      <!--                             <td class="forecast-table__cell forecast-table__cell&#45;&#45;right">21 °C</td> -->
      <!--                             <td class="forecast-table__cell forecast-table__cell&#45;&#45;right">3,5 m/s</td> -->
      <!--                             <td class="forecast-table__cell forecast-table__cell&#45;&#45;right">48 %</td> -->
      <!--                         </tr> -->
    </tbody>
  </table>
</template>