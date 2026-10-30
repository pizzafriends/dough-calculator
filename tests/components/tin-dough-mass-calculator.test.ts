import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TinDoughMassCalculator from '../../app/components/tools/TinDoughMassCalculator.vue'
import { createDefaultTinDoughMassState } from '../../app/domain/calculator-inputs'

describe('TinDoughMassCalculator', () => {
  it('shows unavailable output for zero dimensions and calculated masses otherwise', () => {
    const state = createDefaultTinDoughMassState()
    state.rectangular = { side1Cm: 30, side2Cm: 40, adjustmentPercent: 10 }
    state.round = { diameterCm: 30, adjustmentPercent: 0 }
    const wrapper = mount(TinDoughMassCalculator, { props: { modelValue: state } })

    expect(wrapper.get('[aria-label="Rectangular tin dough mass"]').text()).toBe('660 g')
    expect(wrapper.get('[aria-label="Round tin dough mass"]').text()).toBe('353 g')
  })

  it('shows a field error and withholds a result for out-of-range dimensions', () => {
    const state = createDefaultTinDoughMassState()
    state.rectangular.side1Cm = 101
    const wrapper = mount(TinDoughMassCalculator, { props: { modelValue: state } })

    expect(wrapper.get('#rectangular-side-1').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('[aria-label="Rectangular tin dough mass"]').text()).toBe('–')
    expect(wrapper.text()).toContain('Enter a value from 0 to 100 in steps of 1.')
  })
})
