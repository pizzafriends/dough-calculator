import type { FlourStrengthCalculatorState, TinDoughMassCalculatorState } from './calculator-inputs'
import { validateFlourStrengthInput, validateTinDoughMassInput, validateWaterTemperatureInput } from './secondary-validation'
import type { WaterTemperatureInput } from './water-temperature'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

export function isFlourStrengthCalculatorState(value: unknown): value is FlourStrengthCalculatorState {
  if (!isRecord(value) || !isRecord(value.blend) || !isRecord(value.weighted)) return false
  const blend = value.blend
  const blendKeys = ['targetW', 'flour1W', 'flour2W']
  const weighted = value.weighted
  const hasValidShape = blendKeys.every(key => isFiniteNumber(blend[key]))
    && Array.isArray(weighted.sharesPercent)
    && weighted.sharesPercent.length === 4
    && weighted.sharesPercent.every(isFiniteNumber)
    && Array.isArray(weighted.strengthsW)
    && weighted.strengthsW.length === 4
    && weighted.strengthsW.every(isFiniteNumber)

  return hasValidShape
    && Object.keys(validateFlourStrengthInput(value as unknown as FlourStrengthCalculatorState)).length === 0
}

export function isTinDoughMassCalculatorState(value: unknown): value is TinDoughMassCalculatorState {
  if (!isRecord(value) || !isRecord(value.rectangular) || !isRecord(value.round)) return false
  const rectangular = value.rectangular
  const round = value.round
  const hasValidShape = ['side1Cm', 'side2Cm', 'adjustmentPercent'].every(key => isFiniteNumber(rectangular[key]))
    && ['diameterCm', 'adjustmentPercent'].every(key => isFiniteNumber(round[key]))

  return hasValidShape
    && Object.keys(validateTinDoughMassInput(value as unknown as TinDoughMassCalculatorState)).length === 0
}

export function isWaterTemperatureInput(value: unknown): value is WaterTemperatureInput {
  const hasValidShape = isRecord(value)
    && isFiniteNumber(value.desiredDoughTemperature)
    && isFiniteNumber(value.roomTemperature)
    && ['fork', 'spiral', 'planetary', 'plunging-arms', 'hands'].includes(String(value.mixer))
    && (value.temperatureUnit === 'C' || value.temperatureUnit === 'F')

  return hasValidShape
    && Object.keys(validateWaterTemperatureInput(value as unknown as WaterTemperatureInput)).length === 0
}
