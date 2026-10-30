import { createCalculatorStateStore } from '../services/calculator-state-store'

export default defineNuxtPlugin(() => ({
  provide: {
    calculatorStateStore: createCalculatorStateStore({
      getItem: key => window.localStorage.getItem(key),
      setItem: (key, value) => window.localStorage.setItem(key, value)
    })
  }
}))
