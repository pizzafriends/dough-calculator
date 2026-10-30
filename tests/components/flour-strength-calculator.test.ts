import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import FlourStrengthCalculator from '../../app/components/tools/FlourStrengthCalculator.vue'
import { createDefaultFlourStrengthState } from '../../app/domain/calculator-inputs'

describe('FlourStrengthCalculator', () => {
  it('shows the calculated two-flour shares and leaves an unbalanced weighted mix unavailable', () => {
    const state = createDefaultFlourStrengthState()
    state.blend = { targetW: 120, flour1W: 100, flour2W: 200 }
    state.weighted.sharesPercent = [20, 20, 20, 20]
    const wrapper = mount(FlourStrengthCalculator, { props: { modelValue: state } })

    expect(wrapper.get('[aria-label="Flour 1 share"]').text()).toBe('80%')
    expect(wrapper.get('[aria-label="Flour 2 share"]').text()).toBe('20%')
    expect(wrapper.get('[aria-label="Weighted flour strength"]').text()).toBe('–')
  })

  it('shows a field error and withholds results for invalid inputs', () => {
    const state = createDefaultFlourStrengthState()
    state.blend.targetW = 90
    const wrapper = mount(FlourStrengthCalculator, { props: { modelValue: state } })

    expect(wrapper.get('#target-w').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('[aria-label="Flour 1 share"]').text()).toBe('–')
    expect(wrapper.text()).toContain('Enter a value from 100 to 500 in steps of 10.')
  })
})
