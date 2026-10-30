import type { DoughRecipeInput, DoughStyle, PrefermentType, TemperatureUnit } from './types'

function copyInput(input: DoughRecipeInput): DoughRecipeInput {
  return {
    ...input,
    target: { ...input.target },
    ingredients: {
      ...input.ingredients,
      flourShares: [...input.ingredients.flourShares],
      flourSharesByCount: Object.fromEntries(
        Object.entries(input.ingredients.flourSharesByCount).map(([count, shares]) => [count, [...shares]])
      )
    },
    fermentation: { ...input.fermentation },
    yeast: { ...input.yeast },
    preferments: { ...input.preferments }
  }
}

function roundToHalfDegree(value: number): number {
  return Math.round(value * 2) / 2
}

function convertTemperature(value: number, from: TemperatureUnit, to: TemperatureUnit): number {
  if (from === to) return value
  if (from === 'C') return roundToHalfDegree(value * 9 / 5 + 32)
  return roundToHalfDegree((value - 32) * 5 / 9)
}

export function applyDoughStyle(input: DoughRecipeInput, style: DoughStyle): DoughRecipeInput {
  const next = copyInput(input)
  next.style = style
  next.target.firstBallWeightGrams = style === 'Verace' ? 250 : 600
  next.target.secondBallWeightGrams = style === 'Verace' ? 200 : 400
  next.ingredients.hydrationPercent = style === 'Verace' ? 60 : 80
  next.ingredients.saltPercent = style === 'Verace' ? 3 : 2.5
  next.fermentation.roomHours = style === 'Verace' ? 8 : 5
  next.fermentation.roomTemperature = convertTemperature(
    20,
    'C',
    next.fermentation.temperatureUnit
  )
  next.fermentation.controlledHours = 43
  next.fermentation.controlledTemperature = convertTemperature(
    4,
    'C',
    next.fermentation.temperatureUnit
  )
  next.fermentation.controlledEnabled = style === 'Teglia'
  next.ingredients.fatEnabled = style === 'Teglia'
  if (style === 'Teglia') next.ingredients.fatPercent = 2.5
  next.preferments.poolishEnabled = false
  next.preferments.bigaEnabled = false
  return next
}

export function setTemperatureUnit(input: DoughRecipeInput, unit: TemperatureUnit): DoughRecipeInput {
  const next = copyInput(input)
  const currentUnit = next.fermentation.temperatureUnit
  if (currentUnit === unit) return next

  next.fermentation.roomTemperature = convertTemperature(
    next.fermentation.roomTemperature,
    currentUnit,
    unit
  )
  next.fermentation.controlledTemperature = convertTemperature(
    next.fermentation.controlledTemperature,
    currentUnit,
    unit
  )
  next.fermentation.temperatureUnit = unit
  return next
}

export function setFlourCount(input: DoughRecipeInput, flourCount: number): DoughRecipeInput {
  const next = copyInput(input)
  const currentCount = String(next.ingredients.flourCount)
  const nextCount = String(flourCount)
  next.ingredients.flourSharesByCount[currentCount] = [...next.ingredients.flourShares]
  next.ingredients.flourCount = flourCount
  next.ingredients.flourShares = [
    ...(next.ingredients.flourSharesByCount[nextCount] ?? Array.from({ length: flourCount }, () => 1))
  ]
  next.ingredients.flourSharesByCount[nextCount] = [...next.ingredients.flourShares]
  return next
}

export function togglePreferment(input: DoughRecipeInput, preferment: PrefermentType): DoughRecipeInput {
  const next = copyInput(input)
  const isEnabling = !next.preferments[`${preferment}Enabled`]
  next.preferments[`${preferment}Enabled`] = isEnabling

  if (isEnabling) {
    const other: PrefermentType = preferment === 'poolish' ? 'biga' : 'poolish'
    next.preferments[`${other}Enabled`] = false
    if (next.yeast.type === 'LMS' || next.yeast.type === 'LML') next.yeast.type = 'LBF'
  }
  return next
}
