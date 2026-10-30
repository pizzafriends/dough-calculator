import { describe, expect, it } from 'vitest'
import { createDefaultDoughRecipeInput } from '../../app/domain/dough-recipe/defaults'
import { validateDoughRecipeInput } from '../../app/domain/dough-recipe/validation'

describe('validateDoughRecipeInput', () => {
  it('accepts the documented defaults', () => {
    expect(validateDoughRecipeInput(createDefaultDoughRecipeInput())).toEqual({})
  })

  it('returns field-level errors for non-finite and out-of-range values', () => {
    const input = createDefaultDoughRecipeInput()
    input.fermentation.roomHours = Number.NaN
    input.target.firstBallWeightGrams = 5

    expect(validateDoughRecipeInput(input)).toMatchObject({
      'fermentation.roomHours': expect.any(String),
      'target.firstBallWeightGrams': expect.any(String)
    })
  })
})
