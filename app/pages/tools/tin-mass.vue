<script setup lang="ts">
import { createDefaultTinDoughMassState } from '../../domain/calculator-inputs'
import { isTinDoughMassCalculatorState } from '../../domain/calculator-persistence'
import { usePersistedCalculatorState } from '../../composables/usePersistedCalculatorState'
import TinDoughMassCalculator from '../../components/tools/TinDoughMassCalculator.vue'
import CalculatorNavigation from '../../components/app/CalculatorNavigation.vue'

const calculator = usePersistedCalculatorState(
  'tin-mass',
  createDefaultTinDoughMassState,
  isTinDoughMassCalculatorState
)
</script>

<template>
  <section class="page-intro" aria-labelledby="page-title">
    <div><p class="eyebrow">Right dough, right pan</p><h1 id="page-title">Tin dough mass</h1><p class="page-intro__copy">Estimate the dough mass for a rectangular sheet pan or round pizza tin using its inside dimensions.</p></div>
    <span class="freshness-tag"><span />Baker’s tool</span>
  </section>
  <TinDoughMassCalculator v-model="calculator" />
  <CalculatorNavigation />
</template>
