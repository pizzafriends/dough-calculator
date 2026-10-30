<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const isOnline = ref(true)

function updateStatus() {
  isOnline.value = navigator.onLine
}

onMounted(() => {
  updateStatus()
  window.addEventListener('online', updateStatus)
  window.addEventListener('offline', updateStatus)
})

onUnmounted(() => {
  window.removeEventListener('online', updateStatus)
  window.removeEventListener('offline', updateStatus)
})
</script>

<template>
  <p v-if="!isOnline" class="offline-notice" role="status">
    You’re offline. Your calculator and saved inputs are still available on this device.
  </p>
</template>
