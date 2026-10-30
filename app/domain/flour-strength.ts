export interface FlourStrengthBlendInput {
  targetW: number
  flour1W: number
  flour2W: number
}

export type FlourStrengthBlendResult =
  | {
      status: 'available'
      flour1SharePercent: number
      flour2SharePercent: number
    }
  | { status: 'unavailable' }

export interface WeightedFlourStrengthInput {
  sharesPercent: [number, number, number, number]
  strengthsW: [number, number, number, number]
}

export type WeightedFlourStrengthResult =
  | { status: 'available'; strengthW: number }
  | { status: 'unavailable' }

export function calculateFlourStrengthBlend(
  input: FlourStrengthBlendInput
): FlourStrengthBlendResult {
  const { targetW, flour1W, flour2W } = input
  if (
    flour1W === flour2W ||
    (flour1W < targetW && flour2W < targetW) ||
    (flour1W > targetW && flour2W > targetW)
  ) {
    return { status: 'unavailable' }
  }

  const flour2SharePercent = 100 * (targetW - flour1W) / (flour2W - flour1W)
  return {
    status: 'available',
    flour1SharePercent: 100 - flour2SharePercent,
    flour2SharePercent
  }
}

export function calculateWeightedFlourStrength(
  input: WeightedFlourStrengthInput
): WeightedFlourStrengthResult {
  const totalShare = input.sharesPercent.reduce((total, share) => total + share, 0)
  if (totalShare !== 100) return { status: 'unavailable' }

  const strengthW = input.sharesPercent.reduce(
    (total, share, index) => total + share * input.strengthsW[index]!,
    0
  ) / 100

  return { status: 'available', strengthW }
}
