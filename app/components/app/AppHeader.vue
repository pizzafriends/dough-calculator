<script setup lang="ts">
const links = [
  { label: 'Recipe', to: '/' },
  { label: 'Flour strength', to: '/tools/flour-strength' },
  { label: 'Tin mass', to: '/tools/tin-mass' },
  { label: 'Water temp', to: '/tools/water-temperature' }
]
</script>

<template>
  <header class="site-header">
    <div class="site-header__inner">
      <NuxtLink class="brand" to="/" aria-label="Dough Notes home">
        <span class="brand__mark" aria-hidden="true">D</span>
        <span class="brand__name">Dough<span>Notes</span></span>
      </NuxtLink>
      <nav class="primary-nav" aria-label="Calculators">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="primary-nav__link"
          active-class="primary-nav__link--active"
          exact-active-class="primary-nav__link--active"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
      <span class="header-note"><span class="header-note__dot" />Made for the bake</span>
    </div>
  </header>
</template>
