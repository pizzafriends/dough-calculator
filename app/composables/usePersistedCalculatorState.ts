import { onMounted, ref, watch } from 'vue'
import type { CalculatorStateStore } from '../services/calculator-state-store'

export function usePersistedCalculatorState<T>(
  key: string,
  defaults: () => T,
  isValid: (value: unknown) => value is T,
  store?: CalculatorStateStore
) {
  const state = ref<T>(defaults())
  const hasLoaded = ref(false)
  const stateStore = store ?? useNuxtApp().$calculatorStateStore

  onMounted(() => {
    const saved = stateStore.load(key)
    if (isValid(saved)) state.value = saved
    hasLoaded.value = true
  })

  watch(state, (value) => {
    if (hasLoaded.value) stateStore.save(key, value)
  }, { deep: true })

  return state
}
