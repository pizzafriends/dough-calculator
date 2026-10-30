import type { DoughRecipeInput } from './types'

export type DoughRecipeFieldErrors = Record<string, string>

export function validateDoughRecipeInput(
  input: DoughRecipeInput,
  options: { includeDisabledFields?: boolean } = {}
): DoughRecipeFieldErrors {
  const errors: DoughRecipeFieldErrors = {}
  const includeDisabledFields = options.includeDisabledFields ?? false
  const checkRange = (
    field: string,
    value: number,
    min: number,
    max: number,
    step: number,
    label: string
  ) => {
    if (!Number.isFinite(value)) {
      errors[field] = `${label} is required.`
    } else if (value < min || value > max) {
      errors[field] = `Enter a value from ${min} to ${max}.`
    } else if (Math.abs((value - min) / step - Math.round((value - min) / step)) > 1e-8) {
      errors[field] = `Use increments of ${step}.`
    }
  }

  checkRange('target.firstBallCount', input.target.firstBallCount, 1, 200, 1, 'Ball count')
  checkRange('target.firstBallWeightGrams', input.target.firstBallWeightGrams, 10, 1500, 5, 'Ball weight')
  if (input.target.secondGroupEnabled || includeDisabledFields) {
    checkRange('target.secondBallCount', input.target.secondBallCount, 1, 200, 1, 'Second ball count')
    checkRange('target.secondBallWeightGrams', input.target.secondBallWeightGrams, 10, 1500, 5, 'Second ball weight')
  }
  checkRange('target.wastagePercent', input.target.wastagePercent, 0, 5, 1, 'Wastage')
  checkRange('target.oldDoughOutGrams', input.target.oldDoughOutGrams, 0, 500, 10, 'Old dough out')
  if (input.target.oldDoughInEnabled || includeDisabledFields) {
    checkRange('target.oldDoughInPercent', input.target.oldDoughInPercent, 0, 20, 1, 'Old dough in')
  }

  checkRange('ingredients.flourCount', input.ingredients.flourCount, 1, 6, 1, 'Flour count')
  if (input.ingredients.flourCount > 1 || includeDisabledFields) {
    input.ingredients.flourShares.slice(0, input.ingredients.flourCount).forEach((share, index) => {
      checkRange(`ingredients.flourShares.${index}`, share, 1, 99, 1, `Flour ${index + 1} share`)
    })
  }
  checkRange('ingredients.hydrationPercent', input.ingredients.hydrationPercent, 40, 100, 1, 'Hydration')
  checkRange('ingredients.saltPercent', input.ingredients.saltPercent, 0, 6, 0.1, 'Salt')
  if (input.ingredients.fatEnabled || includeDisabledFields) {
    checkRange('ingredients.fatPercent', input.ingredients.fatPercent, 0, 10, 0.1, 'Fat')
  }

  checkRange('fermentation.roomHours', input.fermentation.roomHours, 1, 100, 1, 'Room fermentation time')
  const isFahrenheit = input.fermentation.temperatureUnit === 'F'
  checkRange(
    'fermentation.roomTemperature',
    input.fermentation.roomTemperature,
    isFahrenheit ? 50 : 10,
    isFahrenheit ? 104 : 40,
    0.5,
    'Room temperature'
  )
  if (input.fermentation.controlledEnabled || includeDisabledFields) {
    checkRange('fermentation.controlledHours', input.fermentation.controlledHours, 0, 100, 1, 'Controlled time')
    checkRange(
      'fermentation.controlledTemperature',
      input.fermentation.controlledTemperature,
      isFahrenheit ? 34 : 1,
      isFahrenheit ? 68 : 20,
      0.5,
      'Controlled temperature'
    )
  }
  checkRange('yeast.adjustmentPercent', input.yeast.adjustmentPercent, -50, 50, 5, 'Yeast adjustment')

  if (input.preferments.autolysisEnabled || includeDisabledFields) {
    checkRange('preferments.autolysisFlourPercent', input.preferments.autolysisFlourPercent, 20, 100, 1, 'Autolysis flour')
    checkRange('preferments.autolysisWaterPercent', input.preferments.autolysisWaterPercent, 40, 100, 1, 'Autolysis water')
  }
  if (input.preferments.poolishEnabled || includeDisabledFields) {
    checkRange('preferments.poolishFlourPercent', input.preferments.poolishFlourPercent, 10, 100, 1, 'Poolish flour')
    checkRange('preferments.poolishHours', input.preferments.poolishHours, 1, 24, 1, 'Poolish time')
  }
  if (input.preferments.bigaEnabled || includeDisabledFields) {
    checkRange('preferments.bigaFlourPercent', input.preferments.bigaFlourPercent, 10, 100, 1, 'Biga flour')
  }

  return errors
}
