import { describe, expect, it } from 'vitest'
import {
  calculateFlourStrengthBlend,
  calculateWeightedFlourStrength
} from '../../app/domain/flour-strength'

describe('calculateFlourStrengthBlend', () => {
  it('calculates the percentages needed to reach a target strength', () => {
    expect(calculateFlourStrengthBlend({ targetW: 120, flour1W: 100, flour2W: 200 })).toEqual({
      status: 'available',
      flour1SharePercent: 80,
      flour2SharePercent: 20
    })
  })

  it('keeps the weighted result unavailable unless shares total exactly 100%', () => {
    expect(calculateWeightedFlourStrength({
      sharesPercent: [50, 50, 0, 0],
      strengthsW: [100, 200, 300, 400]
    })).toEqual({ status: 'available', strengthW: 150 })

    expect(calculateWeightedFlourStrength({
      sharesPercent: [0, 0, 0, 0],
      strengthsW: [100, 200, 300, 400]
    })).toEqual({ status: 'unavailable' })
  })
})
