import type {
  FlourStrengthCalculatorState,
  TinDoughMassCalculatorState
} from './calculator-inputs'
import type { WaterTemperatureInput } from './water-temperature'

type ValidationErrors = Record<string, string>

function validateNumber(value: number, minimum: number, maximum: number, step: number): string | undefined {
  if (!Number.isFinite(value) || value < minimum || value > maximum) {
    return `Enter a value from ${minimum} to ${maximum} in steps of ${step}.`
  }

  const stepPosition = (value - minimum) / step
  if (Math.abs(stepPosition - Math.round(stepPosition)) > 1e-8) {
    return `Enter a value from ${minimum} to ${maximum} in steps of ${step}.`
  }
}

function addNumberError(
  errors: ValidationErrors,
  key: string,
  value: number,
  minimum: number,
  maximum: number,
  step: number
) {
  const error = validateNumber(value, minimum, maximum, step)
  if (error) errors[key] = error
}

export function validateFlourStrengthInput(input: FlourStrengthCalculatorState): ValidationErrors {
  const errors: ValidationErrors = {}
  addNumberError(errors, 'blend.targetW', input.blend.targetW, 100, 500, 10)
  addNumberError(errors, 'blend.flour1W', input.blend.flour1W, 100, 500, 10)
  addNumberError(errors, 'blend.flour2W', input.blend.flour2W, 100, 500, 10)

  input.weighted.sharesPercent.forEach((share, index) => {
    addNumberError(errors, `weighted.shares.${index + 1}`, share, 0, 100, 10)
  })
  input.weighted.strengthsW.forEach((strength, index) => {
    addNumberError(errors, `weighted.strengths.${index + 1}`, strength, 100, 500, 10)
  })

  return errors
}

export function validateTinDoughMassInput(input: TinDoughMassCalculatorState): ValidationErrors {
  const errors: ValidationErrors = {}
  addNumberError(errors, 'rectangular.side1Cm', input.rectangular.side1Cm, 0, 100, 1)
  addNumberError(errors, 'rectangular.side2Cm', input.rectangular.side2Cm, 0, 100, 1)
  addNumberError(errors, 'rectangular.adjustmentPercent', input.rectangular.adjustmentPercent, -20, 20, 5)
  addNumberError(errors, 'round.diameterCm', input.round.diameterCm, 0, 100, 1)
  addNumberError(errors, 'round.adjustmentPercent', input.round.adjustmentPercent, -20, 20, 5)
  return errors
}

export function validateWaterTemperatureInput(input: WaterTemperatureInput): ValidationErrors {
  const errors: ValidationErrors = {}
  const minimum = input.temperatureUnit === 'C' ? 10 : 50
  const maximum = input.temperatureUnit === 'C' ? 40 : 104
  addNumberError(errors, 'desiredDoughTemperature', input.desiredDoughTemperature, minimum, maximum, 0.5)
  addNumberError(errors, 'roomTemperature', input.roomTemperature, minimum, maximum, 0.5)
  return errors
}
