export type TemperatureUnit = 'C' | 'F'
export type MixerType = 'fork' | 'spiral' | 'planetary' | 'plunging-arms' | 'hands'

export interface WaterTemperatureInput {
  desiredDoughTemperature: number
  roomTemperature: number
  mixer: MixerType
  temperatureUnit: TemperatureUnit
}

const MIXER_FACTORS: Record<MixerType, number> = {
  fork: 3,
  spiral: 9,
  planetary: 9,
  'plunging-arms': 6,
  hands: 1
}

export function roundToHalfDegree(value: number): number {
  return Math.round(value * 2) / 2
}

function toCelsius(value: number, unit: TemperatureUnit): number {
  return unit === 'C' ? value : roundToHalfDegree((value - 32) * 5 / 9)
}

function fromCelsius(value: number, unit: TemperatureUnit): number {
  return unit === 'C' ? value : roundToHalfDegree(value * 9 / 5 + 32)
}

function convertTemperature(value: number, from: TemperatureUnit, to: TemperatureUnit): number {
  if (from === to) return value
  return fromCelsius(toCelsius(value, from), to)
}

export function setWaterTemperatureUnit(
  input: WaterTemperatureInput,
  temperatureUnit: TemperatureUnit
): WaterTemperatureInput {
  return {
    ...input,
    desiredDoughTemperature: convertTemperature(
      input.desiredDoughTemperature,
      input.temperatureUnit,
      temperatureUnit
    ),
    roomTemperature: convertTemperature(input.roomTemperature, input.temperatureUnit, temperatureUnit),
    temperatureUnit
  }
}

export function calculateWaterTemperature(input: WaterTemperatureInput): number {
  const desiredCelsius = toCelsius(input.desiredDoughTemperature, input.temperatureUnit)
  const roomCelsius = toCelsius(input.roomTemperature, input.temperatureUnit)
  const waterCelsius = Math.max(
    4,
    3 * desiredCelsius - 2 * roomCelsius + 1 - MIXER_FACTORS[input.mixer]
  )

  return fromCelsius(waterCelsius, input.temperatureUnit)
}
