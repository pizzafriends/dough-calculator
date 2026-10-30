import { describe, expect, it } from 'vitest'
import { calculateWaterTemperature, setWaterTemperatureUnit } from '../../app/domain/water-temperature'

describe('calculateWaterTemperature', () => {
  it('calculates the water temperature for a Celsius recipe', () => {
    expect(calculateWaterTemperature({
      desiredDoughTemperature: 20,
      roomTemperature: 20,
      mixer: 'fork',
      temperatureUnit: 'C'
    })).toBe(18)
  })

  it('converts Fahrenheit inputs to Celsius and rounds the result to half a degree', () => {
    expect(calculateWaterTemperature({
      desiredDoughTemperature: 68,
      roomTemperature: 68,
      mixer: 'fork',
      temperatureUnit: 'F'
    })).toBe(64.5)
  })

  it('converts existing temperature inputs when changing units', () => {
    const input = {
      desiredDoughTemperature: 20,
      roomTemperature: 18.5,
      mixer: 'fork' as const,
      temperatureUnit: 'C' as const
    }

    expect(setWaterTemperatureUnit(input, 'F')).toEqual({
      ...input,
      desiredDoughTemperature: 68,
      roomTemperature: 65.5,
      temperatureUnit: 'F'
    })
  })

  it('keeps the calculated water temperature at or above four degrees', () => {
    expect(calculateWaterTemperature({
      desiredDoughTemperature: 10,
      roomTemperature: 40,
      mixer: 'spiral',
      temperatureUnit: 'C'
    })).toBe(4)
  })
})
