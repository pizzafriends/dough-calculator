import type { DoughRecipeInput, DoughStyle, PrefermentType, TemperatureUnit } from './types'
import { isValidFlourShare } from './persistence'
import { createDefaultDoughRecipeInput } from './defaults'
import { validateDoughRecipeInput } from './validation'

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

export function normalizeDisabledDoughRecipeFields(input: DoughRecipeInput): DoughRecipeInput {
  const next = copyInput(input)
  const defaults = createDefaultDoughRecipeInput()
  const errors = validateDoughRecipeInput(next, { includeDisabledFields: true })

  if (!next.target.secondGroupEnabled) {
    if (errors['target.secondBallCount']) {
      next.target.secondBallCount = defaults.target.secondBallCount
    }
    if (errors['target.secondBallWeightGrams']) {
      next.target.secondBallWeightGrams = defaults.target.secondBallWeightGrams
    }
  }
  if (!next.target.oldDoughInEnabled && errors['target.oldDoughInPercent']) {
    next.target.oldDoughInPercent = defaults.target.oldDoughInPercent
  }
  if (next.ingredients.flourCount === 1 && errors['ingredients.flourShares.0']) {
    next.ingredients.flourShares[0] = defaults.ingredients.flourShares[0]!
  }
  if (!next.ingredients.fatEnabled && errors['ingredients.fatPercent']) {
    next.ingredients.fatPercent = defaults.ingredients.fatPercent
  }
  if (!next.fermentation.controlledEnabled) {
    if (errors['fermentation.controlledHours']) {
      next.fermentation.controlledHours = defaults.fermentation.controlledHours
    }
    if (errors['fermentation.controlledTemperature']) {
      next.fermentation.controlledTemperature = convertTemperature(
        defaults.fermentation.controlledTemperature,
        defaults.fermentation.temperatureUnit,
        next.fermentation.temperatureUnit
      )
    }
  }
  if (!next.preferments.autolysisEnabled) {
    if (errors['preferments.autolysisFlourPercent']) {
      next.preferments.autolysisFlourPercent = defaults.preferments.autolysisFlourPercent
    }
    if (errors['preferments.autolysisWaterPercent']) {
      next.preferments.autolysisWaterPercent = defaults.preferments.autolysisWaterPercent
    }
  }
  if (!next.preferments.poolishEnabled) {
    if (errors['preferments.poolishFlourPercent']) {
      next.preferments.poolishFlourPercent = defaults.preferments.poolishFlourPercent
    }
    if (errors['preferments.poolishHours']) {
      next.preferments.poolishHours = defaults.preferments.poolishHours
    }
  }
  if (!next.preferments.bigaEnabled && errors['preferments.bigaFlourPercent']) {
    next.preferments.bigaFlourPercent = defaults.preferments.bigaFlourPercent
  }

  return next
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
  return normalizeDisabledDoughRecipeFields(next)
}

export function setTemperatureUnit(input: DoughRecipeInput, unit: TemperatureUnit): DoughRecipeInput {
  const next = copyInput(input)
  const currentUnit = next.fermentation.temperatureUnit
  if (currentUnit === unit) return normalizeDisabledDoughRecipeFields(next)

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
  return normalizeDisabledDoughRecipeFields(next)
}

export function setFlourCount(input: DoughRecipeInput, flourCount: number): DoughRecipeInput {
  const next = copyInput(input)
  const currentCount = String(next.ingredients.flourCount)
  const nextCount = String(flourCount)
  if (next.ingredients.flourShares.every(isValidFlourShare)) {
    next.ingredients.flourSharesByCount[currentCount] = [...next.ingredients.flourShares]
  }
  next.ingredients.flourCount = flourCount
  next.ingredients.flourShares = [
    ...(next.ingredients.flourSharesByCount[nextCount] ?? Array.from({ length: flourCount }, () => 1))
  ]
  next.ingredients.flourSharesByCount[nextCount] = [...next.ingredients.flourShares]
  return normalizeDisabledDoughRecipeFields(next)
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
  return normalizeDisabledDoughRecipeFields(next)
}
