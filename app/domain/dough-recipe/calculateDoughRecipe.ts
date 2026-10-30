import type {
  DoughRecipeInput,
  DoughRecipeResult,
  DoughRecipeWarning,
  YeastType
} from './types'

const YEAST_EXPONENT = 1.4496535328056595

function nutrientNumber(temperatureCelsius: number): number {
  return 2.52766 * Math.exp(-0.12816 * temperatureCelsius)
}

function roomFermentationRate(temperatureCelsius: number, hours: number): number {
  return (nutrientNumber(temperatureCelsius) / hours) ** YEAST_EXPONENT
}

function toCelsius(value: number, unit: 'C' | 'F'): number {
  return unit === 'C' ? value : (value - 32) * 5 / 9
}

function calculateYeastRate(input: DoughRecipeInput, oldDoughInPercent: number): number {
  const roomTemperature = toCelsius(
    input.fermentation.roomTemperature,
    input.fermentation.temperatureUnit
  )
  const controlledTemperature = toCelsius(
    input.fermentation.controlledTemperature,
    input.fermentation.temperatureUnit
  )
  const roomHours = input.fermentation.roomHours
  const controlledHours = input.fermentation.controlledEnabled
    ? input.fermentation.controlledHours
    : 0
  const oldDoughCorrection = oldDoughInPercent * (
    input.target.oldDoughStrength === 'high' ? 0.0058 : 0.0029
  )
  const roomRate = roomFermentationRate(roomTemperature, roomHours)
  const controlledEnabled = controlledHours > 0

  if (input.yeast.type === 'LBF') {
    if (!controlledEnabled) return 100 * roomRate - oldDoughCorrection
    const k = nutrientNumber(controlledTemperature) * roomRate ** -0.68982
    return 100 * (nutrientNumber(controlledTemperature) / (controlledHours + k)) ** YEAST_EXPONENT
      - oldDoughCorrection
  }

  if (input.yeast.type === 'LSI' || input.yeast.type === 'LSA') {
    const divisor = (temperature: number) =>
      (input.yeast.type === 'LSI' ? 0.0643 : 0.042) * temperature + 1
    if (!controlledEnabled) return (100 * roomRate - oldDoughCorrection) / divisor(roomTemperature)

    if (roomTemperature >= controlledTemperature) {
      const k = nutrientNumber(controlledTemperature) * roomRate ** -0.68982
      return (
        100 * (nutrientNumber(controlledTemperature) / (controlledHours + k)) ** YEAST_EXPONENT
        - oldDoughCorrection
      ) / divisor(roomTemperature)
    }

    const controlledRate = roomFermentationRate(controlledTemperature, controlledHours)
    const kc = nutrientNumber(controlledTemperature) * controlledRate ** -0.68982
    return 100 * (nutrientNumber(roomTemperature) / (roomHours + kc)) ** YEAST_EXPONENT
      / divisor(controlledTemperature)
  }

  const a = -0.00159331210952735 * roomTemperature ** 4
    + 0.163153907011014 * roomTemperature ** 3
    - 6.5110885867497101 * roomTemperature ** 2
    + 120.9209432050130033 * roomTemperature
    - 902.4593301366560354
  const b = -0.000343046132670815 * roomTemperature ** 4
    + 0.0352173329513804 * roomTemperature ** 3
    - 1.41145182345809994 * roomTemperature ** 2
    + 26.35584499441489825 * roomTemperature
    - 197.8869720834400141
  const q = Math.exp((roomHours + a) / b)
  const sourdoughFactor = input.yeast.type === 'LML' ? 0.75 : 1
  return controlledEnabled
    ? sourdoughFactor * q * Math.exp(controlledHours / (
      -0.000343046132670815 * controlledTemperature ** 4
      + 0.0352173329513804 * controlledTemperature ** 3
      - 1.41145182345809994 * controlledTemperature ** 2
      + 26.35584499441489825 * controlledTemperature
      - 197.8869720834400141
    ))
    : sourdoughFactor * q
}

function prefermentYeastFactor(type: YeastType): number {
  if (type === 'LSA') return 0.54
  if (type === 'LSI') return 0.45
  return 1
}

export function calculateDoughRecipe(input: DoughRecipeInput): DoughRecipeResult {
  const { target, ingredients, fermentation, yeast, preferments } = input
  const oldDoughInPercent = target.oldDoughInEnabled ? target.oldDoughInPercent : 0
  const requestedBallMass = target.firstBallCount * target.firstBallWeightGrams
    + (target.secondGroupEnabled ? target.secondBallCount * target.secondBallWeightGrams : 0)
    + target.oldDoughOutGrams
  const targetMassGrams = requestedBallMass * (1 + target.wastagePercent / 100)
  const oldDoughInMassGrams = targetMassGrams * oldDoughInPercent / 100
  const newDoughMassGrams = targetMassGrams - oldDoughInMassGrams
  const hydrationPercent = ingredients.hydrationPercent
  const saltPercent = ingredients.saltPercent
  const fatPercent = ingredients.fatEnabled ? ingredients.fatPercent : 0
  const yeastRate = calculateYeastRate(input, oldDoughInPercent)
  const adjustment = 1 + yeast.adjustmentPercent / 100
  const styleFactor = input.style === 'Verace' ? 0.9 : 2.2
  const hasYeastPreferment = preferments.poolishEnabled || preferments.bigaEnabled
  const initialFlour = newDoughMassGrams
    / (1 + (hydrationPercent + saltPercent + fatPercent + yeastRate) / 100)
  let yeastGrams = adjustment * styleFactor * 1.8 * initialFlour ** -0.1
    * (initialFlour * yeastRate / 100)
  if (hasYeastPreferment) yeastGrams /= 2

  const yeastPercent = 100 * yeastGrams / initialFlour
  let totalFlourGrams = newDoughMassGrams
    / (1 + (hydrationPercent + saltPercent + fatPercent + yeastPercent) / 100)

  if (input.style === 'Teglia') {
    yeastGrams = adjustment * 2.2 * 1.8 * totalFlourGrams ** -0.1
      * ((totalFlourGrams * hydrationPercent / 100) * yeastRate / 100)
  }

  let sourdoughFlourGrams = 0
  let sourdoughWaterGrams = 0
  if (yeast.type === 'LMS' || yeast.type === 'LML') {
    sourdoughFlourGrams = yeast.type === 'LMS' ? yeastGrams * 2 / 3 : yeastGrams / 2
    sourdoughWaterGrams = yeast.type === 'LMS' ? yeastGrams / 3 : yeastGrams / 2
    totalFlourGrams = newDoughMassGrams / (1 + (hydrationPercent + saltPercent + fatPercent) / 100)
      - sourdoughFlourGrams
  }

  const baseWaterGrams = (totalFlourGrams + sourdoughFlourGrams) * hydrationPercent / 100
    - sourdoughWaterGrams
  const saltGrams = (totalFlourGrams + sourdoughFlourGrams) * saltPercent / 100
  const fatGrams = (totalFlourGrams + sourdoughFlourGrams) * fatPercent / 100

  const autolysisFlourGrams = preferments.autolysisEnabled
    ? totalFlourGrams * preferments.autolysisFlourPercent / 100
    : 0
  const autolysisWaterGrams = preferments.autolysisEnabled
    ? autolysisFlourGrams * preferments.autolysisWaterPercent / 100
    : 0
  const poolishFlourGrams = preferments.poolishEnabled
    ? totalFlourGrams * preferments.poolishFlourPercent / 100
    : 0
  const poolishWaterGrams = poolishFlourGrams
  const poolishYeastGrams = preferments.poolishEnabled
    ? poolishFlourGrams * 3.9 * Math.exp(-0.23 * preferments.poolishHours) / 100
      * prefermentYeastFactor(yeast.type)
    : 0
  const bigaFlourGrams = preferments.bigaEnabled
    ? totalFlourGrams * preferments.bigaFlourPercent / 100
    : 0
  const bigaWaterGrams = bigaFlourGrams * 0.45
  const bigaYeastGrams = preferments.bigaEnabled
    ? bigaFlourGrams / 100 * prefermentYeastFactor(yeast.type)
    : 0
  const allocatedYeast = poolishYeastGrams + bigaYeastGrams
  const yeastAfterAllocation = yeastGrams - allocatedYeast
  const mainDoughYeastGrams = Math.max(0, yeastAfterAllocation)
  const mainDoughFlourGrams = totalFlourGrams
    - autolysisFlourGrams
    - poolishFlourGrams
    - bigaFlourGrams
  const mainDoughWaterGrams = baseWaterGrams
    - autolysisWaterGrams
    - poolishWaterGrams
    - bigaWaterGrams

  const warnings: DoughRecipeWarning[] = []
  const activeShares = ingredients.flourShares.slice(0, ingredients.flourCount)
  const shareTotal = activeShares.reduce((total, share) => total + share, 0)
  const flourMix = ingredients.flourCount === 1
    ? { status: 'single' as const, flourGrams: [mainDoughFlourGrams] }
    : shareTotal === 100
      ? {
          status: 'valid' as const,
          flourGrams: activeShares.map(share => mainDoughFlourGrams * share / 100)
        }
      : {
          status: 'invalid' as const,
          flourGrams: Array.from({ length: ingredients.flourCount }, () => null)
        }
  if (flourMix.status === 'invalid') warnings.push('invalid-flour-share-total')

  const allocationExceeded = preferments.autolysisEnabled && (
    (preferments.poolishEnabled
      && preferments.autolysisFlourPercent + preferments.poolishFlourPercent > 100)
    || (preferments.bigaEnabled
      && preferments.autolysisFlourPercent + preferments.bigaFlourPercent > 100)
  )
  if (allocationExceeded) warnings.push('preferment-allocation-exceeded')

  if (hasYeastPreferment && yeastAfterAllocation < 0.25 * yeastGrams) {
    warnings.push('excessive-leavening')
  }

  return {
    targetMassGrams,
    oldDoughInMassGrams,
    oldDoughOutMassGrams: target.oldDoughOutGrams,
    newDoughMassGrams,
    totalFlourGrams,
    mainDough: {
      flourGrams: mainDoughFlourGrams,
      waterGrams: mainDoughWaterGrams,
      saltGrams,
      fatGrams,
      yeastGrams: mainDoughYeastGrams
    },
    preferments: {
      autolysis: { flourGrams: autolysisFlourGrams, waterGrams: autolysisWaterGrams },
      poolish: {
        flourGrams: poolishFlourGrams,
        waterGrams: poolishWaterGrams,
        yeastGrams: poolishYeastGrams
      },
      biga: { flourGrams: bigaFlourGrams, waterGrams: bigaWaterGrams, yeastGrams: bigaYeastGrams }
    },
    flourMix,
    warnings
  }
}
