<script setup lang="ts">
import { createDefaultWaterTemperatureState } from '../../domain/calculator-inputs'
import { isWaterTemperatureInput } from '../../domain/calculator-persistence'
import { usePersistedCalculatorState } from '../../composables/usePersistedCalculatorState'
import WaterTemperatureCalculator from '../../components/tools/WaterTemperatureCalculator.vue'
import CalculatorNavigation from '../../components/app/CalculatorNavigation.vue'

const calculator = usePersistedCalculatorState(
  'water-temperature',
  createDefaultWaterTemperatureState,
  isWaterTemperatureInput
)
</script>

<template>
  <section class="page-intro" aria-labelledby="page-title">
    <div><p class="eyebrow">Control the mix</p><h1 id="page-title">Water temperature</h1><p class="page-intro__copy">Account for room temperature and mixer friction to bring your dough to the desired temperature.</p></div>
    <span class="freshness-tag"><span />Baker’s tool</span>
  </section>
  <WaterTemperatureCalculator v-model="calculator" />
  <CalculatorNavigation />
</template>
