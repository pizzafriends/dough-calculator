import { defineComponent, h, nextTick, type Ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { usePersistedCalculatorState } from '../../app/composables/usePersistedCalculatorState'
import type { CalculatorStateStore } from '../../app/services/calculator-state-store'

interface CalculatorState {
  value: number
}

function isCalculatorState(value: unknown): value is CalculatorState {
  return typeof value === 'object'
    && value !== null
    && 'value' in value
    && typeof value.value === 'number'
    && Number.isFinite(value.value)
    && value.value >= 0
}

function mountCalculator(store: CalculatorStateStore) {
  let state: Ref<CalculatorState> | undefined
  const component = defineComponent({
    setup() {
      state = usePersistedCalculatorState(
        'calculator',
        () => ({ value: 1 }),
        isCalculatorState,
        store
      )
      return () => h('div')
    }
  })

  const wrapper = mount(component)
  return { wrapper, getState: () => state! }
}

describe('usePersistedCalculatorState', () => {
  it('saves valid edits and leaves the last valid value stored after an invalid edit', async () => {
    const store: CalculatorStateStore = {
      load: vi.fn(() => null),
      save: vi.fn()
    }
    const { wrapper, getState } = mountCalculator(store)
    await nextTick()
    vi.mocked(store.save).mockClear()

    getState().value = { value: 2 }
    await nextTick()
    expect(store.save).toHaveBeenLastCalledWith('calculator', { value: 2 })

    getState().value = { value: Number.NaN }
    await nextTick()
    expect(store.save).toHaveBeenCalledTimes(1)
    expect(store.save).toHaveBeenLastCalledWith('calculator', { value: 2 })

    wrapper.unmount()
  })

  it('restores valid state and falls back to defaults for invalid saved state', async () => {
    const validStore: CalculatorStateStore = {
      load: vi.fn(() => ({ value: 7 })),
      save: vi.fn()
    }
    const valid = mountCalculator(validStore)
    await nextTick()
    expect(valid.getState().value).toEqual({ value: 7 })
    valid.wrapper.unmount()

    const invalidStore: CalculatorStateStore = {
      load: vi.fn(() => ({ value: Number.NaN })),
      save: vi.fn()
    }
    const invalid = mountCalculator(invalidStore)
    await nextTick()
    expect(invalid.getState().value).toEqual({ value: 1 })
    invalid.wrapper.unmount()
  })
})
