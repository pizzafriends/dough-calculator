import { describe, expect, it } from 'vitest'
import {
  createDefaultFlourStrengthState,
  createDefaultTinDoughMassState,
  createDefaultWaterTemperatureState
} from '../../app/domain/calculator-inputs'
import {
  isFlourStrengthCalculatorState,
  isTinDoughMassCalculatorState,
  isWaterTemperatureInput
} from '../../app/domain/calculator-persistence'

describe('calculator persistence guards', () => {
  it('accepts documented defaults', () => {
    expect(isFlourStrengthCalculatorState(createDefaultFlourStrengthState())).toBe(true)
    expect(isTinDoughMassCalculatorState(createDefaultTinDoughMassState())).toBe(true)
    expect(isWaterTemperatureInput(createDefaultWaterTemperatureState())).toBe(true)
  })

  it('rejects out-of-range and off-step saved values', () => {
    const flourStrength = createDefaultFlourStrengthState()
    flourStrength.weighted.sharesPercent[0] = 15
    expect(isFlourStrengthCalculatorState(flourStrength)).toBe(false)

    const tinMass = createDefaultTinDoughMassState()
    tinMass.rectangular.side1Cm = -1
    expect(isTinDoughMassCalculatorState(tinMass)).toBe(false)

    const waterTemperature = createDefaultWaterTemperatureState()
    waterTemperature.roomTemperature = 20.2
    expect(isWaterTemperatureInput(waterTemperature)).toBe(false)
  })
})
