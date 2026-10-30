import { describe, expect, it } from 'vitest'
import { calculateRectangularTinMass, calculateRoundTinMass } from '../../app/domain/tin-dough-mass'

describe('calculateRectangularTinMass', () => {
  it('calculates the adjusted dough mass for a rectangular tin', () => {
    expect(calculateRectangularTinMass({ side1Cm: 30, side2Cm: 40, adjustmentPercent: 10 })).toEqual({
      status: 'available',
      massGrams: 660
    })
  })

  it('returns an unavailable result when either dimension is zero', () => {
    expect(calculateRectangularTinMass({ side1Cm: 0, side2Cm: 40, adjustmentPercent: 0 })).toEqual({
      status: 'unavailable',
      reason: 'zero-dimension'
    })
  })

  it('calculates the adjusted mass for a round tin', () => {
    expect(calculateRoundTinMass({ diameterCm: 30, adjustmentPercent: 0 })).toEqual({
      status: 'available',
      massGrams: Math.PI * 15 ** 2 / 2
    })
  })
})
