import type { FlourStrengthBlendInput, WeightedFlourStrengthInput } from './flour-strength'
import type { RectangularTinInput, RoundTinInput } from './tin-dough-mass'
import type { WaterTemperatureInput } from './water-temperature'

export interface FlourStrengthCalculatorState {
  blend: FlourStrengthBlendInput
  weighted: WeightedFlourStrengthInput
}

export interface TinDoughMassCalculatorState {
  rectangular: RectangularTinInput
  round: RoundTinInput
}

export function createDefaultFlourStrengthState(): FlourStrengthCalculatorState {
  return {
    blend: { targetW: 100, flour1W: 100, flour2W: 100 },
    weighted: {
      sharesPercent: [0, 0, 0, 0],
      strengthsW: [100, 100, 100, 100]
    }
  }
}

export function createDefaultTinDoughMassState(): TinDoughMassCalculatorState {
  return {
    rectangular: { side1Cm: 0, side2Cm: 0, adjustmentPercent: 0 },
    round: { diameterCm: 0, adjustmentPercent: 0 }
  }
}

export function createDefaultWaterTemperatureState(): WaterTemperatureInput {
  return {
    desiredDoughTemperature: 20,
    roomTemperature: 20,
    mixer: 'fork',
    temperatureUnit: 'C'
  }
}
