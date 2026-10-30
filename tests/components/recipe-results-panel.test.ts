import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import RecipeResultsPanel from '../../app/components/recipe/RecipeResultsPanel.vue'
import { calculateDoughRecipe } from '../../app/domain/dough-recipe/calculateDoughRecipe'
import { createDefaultDoughRecipeInput } from '../../app/domain/dough-recipe/defaults'
import { DOUGH_WARNING_LABELS } from '../../app/utils/format-results'

describe('RecipeResultsPanel', () => {
  it('shows formatted recipe quantities and non-blocking warnings', () => {
    const input = createDefaultDoughRecipeInput()
    input.ingredients.flourCount = 2
    input.ingredients.flourShares = [40, 40]
    const result = calculateDoughRecipe(input)
    const wrapper = mount(RecipeResultsPanel, {
      props: { result, errors: {}, targetLabel: '1 ball · 250 g' }
    })

    expect(wrapper.text()).toContain('Total flour')
    expect(wrapper.text()).toContain('Water')
    expect(wrapper.text()).toContain(DOUGH_WARNING_LABELS['invalid-flour-share-total'])
    expect(wrapper.get('[aria-label="Flour 1 amount"]').text()).toBe('–')
  })

  it('withholds calculated quantities when field validation fails', () => {
    const wrapper = mount(RecipeResultsPanel, {
      props: {
        result: null,
        errors: { 'target.firstBallCount': 'Ball count is required.' },
        targetLabel: 'Fix the highlighted inputs'
      }
    })

    expect(wrapper.get('[role="alert"]').text()).toContain('Correct the highlighted fields')
    expect(wrapper.find('[aria-label="Main dough flour"]').exists()).toBe(false)
  })
})
