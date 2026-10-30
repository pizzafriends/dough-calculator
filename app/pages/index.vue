<script setup lang="ts">
import DoughRecipeWorkspace from '../components/recipe/DoughRecipeWorkspace.vue'
import CalculatorNavigation from '../components/app/CalculatorNavigation.vue'
</script>

<template>
  <section class="page-intro" aria-labelledby="page-title">
    <div>
      <p class="eyebrow">Your next bake, well measured</p>
      <h1 id="page-title">A better dough<br>starts with a plan.</h1>
      <p class="page-intro__copy">Build a pizza dough recipe around your target, fermentation, and flour. Your calculations stay on this device.</p>
    </div>
    <span class="freshness-tag"><span />Recipe workspace</span>
  </section>
  <DoughRecipeWorkspace />
  <CalculatorNavigation />
</template>
