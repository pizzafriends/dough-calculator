import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import NumberField from '../../app/components/form/NumberField.vue'

describe('NumberField', () => {
  it('exposes an accessible labeled numeric control and reports invalid state', () => {
    const wrapper = mount(NumberField, {
      props: { modelValue: 0, label: 'Tin width', min: 1, max: 100, error: 'Enter a width.' }
    })
    const input = wrapper.get('input')

    expect(wrapper.get('label').text()).toContain('Tin width')
    expect(input.attributes('type')).toBe('number')
    expect(input.attributes('min')).toBe('1')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(wrapper.text()).toContain('Enter a width.')
  })

  it('emits numeric values when the user edits the field', async () => {
    const wrapper = mount(NumberField, { props: { modelValue: 10, label: 'Tin width' } })

    await wrapper.get('input').setValue('25')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([25])
  })
})
