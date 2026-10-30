<script setup lang="ts">
import { createDefaultFlourStrengthState } from '../../domain/calculator-inputs'
import { isFlourStrengthCalculatorState } from '../../domain/calculator-persistence'
import { usePersistedCalculatorState } from '../../composables/usePersistedCalculatorState'
import FlourStrengthCalculator from '../../components/tools/FlourStrengthCalculator.vue'
import CalculatorNavigation from '../../components/app/CalculatorNavigation.vue'

const calculator = usePersistedCalculatorState(
  'flour-strength',
  createDefaultFlourStrengthState,
  isFlourStrengthCalculatorState
)
</script>

<template>
  <section class="page-intro" aria-labelledby="page-title">
    <div><p class="eyebrow">Strength in balance</p><h1 id="page-title">Flour strength</h1><p class="page-intro__copy">Blend flours to reach a target W value, or calculate the strength of a flour mix you already have.</p></div>
    <span class="freshness-tag"><span />Baker’s tool</span>
  </section>
  <FlourStrengthCalculator v-model="calculator" />
  <CalculatorNavigation />
</template>
