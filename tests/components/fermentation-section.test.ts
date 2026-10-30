import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import FermentationSection from '../../app/components/recipe/FermentationSection.vue'
import { createDefaultDoughRecipeInput } from '../../app/domain/dough-recipe/defaults'

describe('FermentationSection', () => {
  it('presents documented yeast choices and emits temperature unit changes', async () => {
    const input = createDefaultDoughRecipeInput()
    const wrapper = mount(FermentationSection, {
      props: {
        modelValue: input.fermentation,
        yeast: input.yeast,
        sourdoughDisabled: false,
        errors: {}
      }
    })

    expect(wrapper.get('input[type="radio"][value="LBF"]').element).toBeTruthy()
    expect(wrapper.get('#fermentation-heading').text()).toContain('Fermentation')

    await wrapper.get('select').setValue('F')
    expect(wrapper.emitted('unit-change')).toEqual([['F']])
  })

  it('disables sourdough choices while a yeast preferment is active', () => {
    const input = createDefaultDoughRecipeInput()
    const wrapper = mount(FermentationSection, {
      props: {
        modelValue: input.fermentation,
        yeast: input.yeast,
        sourdoughDisabled: true,
        errors: {}
      }
    })

    expect(wrapper.get('input[type="radio"][value="LMS"]').attributes('disabled')).toBeDefined()
    expect(wrapper.get('input[type="radio"][value="LML"]').attributes('disabled')).toBeDefined()
  })
})
