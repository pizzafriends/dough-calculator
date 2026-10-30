import { describe, expect, it } from 'vitest'
import {
  validateFlourStrengthInput,
  validateTinDoughMassInput,
  validateWaterTemperatureInput
} from '../../app/domain/secondary-validation'
import {
  createDefaultFlourStrengthState,
  createDefaultTinDoughMassState,
  createDefaultWaterTemperatureState
} from '../../app/domain/calculator-inputs'

describe('secondary calculator validation', () => {
  it('flags out-of-range and off-step flour-strength inputs by field', () => {
    const input = createDefaultFlourStrengthState()
    input.blend.targetW = 90
    input.weighted.sharesPercent[0] = 15

    expect(validateFlourStrengthInput(input)).toEqual({
      'blend.targetW': 'Enter a value from 100 to 500 in steps of 10.',
      'weighted.shares.1': 'Enter a value from 0 to 100 in steps of 10.'
    })
  })

  it('allows zero tin dimensions but rejects values outside documented controls', () => {
    const input = createDefaultTinDoughMassState()
    input.rectangular.side1Cm = 101
    input.round.adjustmentPercent = -17

    expect(validateTinDoughMassInput(input)).toEqual({
      'rectangular.side1Cm': 'Enter a value from 0 to 100 in steps of 1.',
      'round.adjustmentPercent': 'Enter a value from -20 to 20 in steps of 5.'
    })
    expect(validateTinDoughMassInput(createDefaultTinDoughMassState())).toEqual({})
  })

  it('validates Fahrenheit temperatures against their converted control range and step', () => {
    const input = createDefaultWaterTemperatureState()
    input.temperatureUnit = 'F'
    input.desiredDoughTemperature = 104.2
    input.roomTemperature = 49

    expect(validateWaterTemperatureInput(input)).toEqual({
      desiredDoughTemperature: 'Enter a value from 50 to 104 in steps of 0.5.',
      roomTemperature: 'Enter a value from 50 to 104 in steps of 0.5.'
    })
  })
})
