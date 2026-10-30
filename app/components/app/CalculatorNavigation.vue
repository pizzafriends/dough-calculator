<script setup lang="ts">
const links = [
  { title: 'Recipe calculator', detail: 'Build your dough', to: '/', number: '01' },
  { title: 'Flour strength', detail: 'Blend by W value', to: '/tools/flour-strength', number: '02' },
  { title: 'Tin dough mass', detail: 'Size your pan', to: '/tools/tin-mass', number: '03' },
  { title: 'Water temperature', detail: 'Dial in your mix', to: '/tools/water-temperature', number: '04' }
]
</script>

<template>
  <nav class="tool-nav" aria-label="Calculator tools">
    <NuxtLink v-for="item in links" :key="item.to" :to="item.to" class="tool-nav__item">
      <span class="tool-nav__number">{{ item.number }}</span>
      <span class="tool-nav__text"><strong>{{ item.title }}</strong><small>{{ item.detail }}</small></span>
      <span class="tool-nav__arrow" aria-hidden="true">↗</span>
    </NuxtLink>
  </nav>
</template>
