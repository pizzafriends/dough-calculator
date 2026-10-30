import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PrefermentsSection from '../../app/components/recipe/PrefermentsSection.vue'
import { createDefaultDoughRecipeInput } from '../../app/domain/dough-recipe/defaults'

describe('PrefermentsSection', () => {
  it('emits the documented toggle events and exposes only active controls', async () => {
    const preferments = createDefaultDoughRecipeInput().preferments
    const wrapper = mount(PrefermentsSection, { props: { modelValue: preferments, errors: {} } })

    expect(wrapper.find('input[type="number"]').exists()).toBe(false)
    await wrapper.get('input[type="checkbox"][aria-label="Autolysis"]').setValue(true)

    expect(wrapper.emitted('toggle-preferment')).toEqual([['autolysis']])
  })
})
