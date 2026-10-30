export interface RectangularTinInput {
  side1Cm: number
  side2Cm: number
  adjustmentPercent: number
}

export interface RoundTinInput {
  diameterCm: number
  adjustmentPercent: number
}

export type TinMassResult =
  | { status: 'available'; massGrams: number }
  | { status: 'unavailable'; reason: 'zero-dimension' }

export function calculateRectangularTinMass(input: RectangularTinInput): TinMassResult {
  if (input.side1Cm === 0 || input.side2Cm === 0) {
    return { status: 'unavailable', reason: 'zero-dimension' }
  }

  const baseMass = input.side1Cm * input.side2Cm / 2
  return {
    status: 'available',
    massGrams: baseMass * (1 + input.adjustmentPercent / 100)
  }
}

export function calculateRoundTinMass(input: RoundTinInput): TinMassResult {
  if (input.diameterCm === 0) {
    return { status: 'unavailable', reason: 'zero-dimension' }
  }

  const radius = input.diameterCm / 2
  const baseMass = Math.PI * radius ** 2 / 2
  return {
    status: 'available',
    massGrams: baseMass * (1 + input.adjustmentPercent / 100)
  }
}
