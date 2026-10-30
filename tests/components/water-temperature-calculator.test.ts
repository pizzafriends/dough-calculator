import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WaterTemperatureCalculator from '../../app/components/tools/WaterTemperatureCalculator.vue'
import { createDefaultWaterTemperatureState } from '../../app/domain/calculator-inputs'

describe('WaterTemperatureCalculator', () => {
  it('shows the calculated water temperature with the selected unit', () => {
    const wrapper = mount(WaterTemperatureCalculator, {
      props: { modelValue: createDefaultWaterTemperatureState() }
    })

    expect(wrapper.get('[aria-label="Water temperature result"]').text()).toBe('18°C')
  })

  it('shows a field error and withholds the result for an off-step temperature', () => {
    const input = createDefaultWaterTemperatureState()
    input.desiredDoughTemperature = 20.2
    const wrapper = mount(WaterTemperatureCalculator, { props: { modelValue: input } })

    expect(wrapper.get('#desired-dough-temperature').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('[aria-label="Water temperature result"]').text()).toBe('–')
    expect(wrapper.text()).toContain('Enter a value from 10 to 40 in steps of 0.5.')
  })

  it('converts the existing temperatures when changing the selected unit', async () => {
    const wrapper = mount(WaterTemperatureCalculator, {
      props: { modelValue: createDefaultWaterTemperatureState() }
    })

    await wrapper.get('select').setValue('F')

    const updated = wrapper.emitted('update:modelValue')?.at(-1)?.[0]
    expect(updated).toMatchObject({
      desiredDoughTemperature: 68,
      roomTemperature: 68,
      temperatureUnit: 'F'
    })
  })
})
