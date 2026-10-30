import { describe, expect, it } from 'vitest'
import {
  DOUGH_WARNING_LABELS,
  formatMass,
  formatPercent,
  formatSaltMass,
  formatTemperature,
  formatYeastMass
} from '../../app/utils/format-results'

describe('result formatting', () => {
  it('formats unavailable mass and whole-gram quantities', () => {
    expect(formatMass(null)).toBe('–')
    expect(formatMass(152.6)).toBe('153 g')
  })

  it('uses the documented salt and yeast precision thresholds', () => {
    expect(formatSaltMass(9.46)).toBe('9.5 g')
    expect(formatSaltMass(10.2)).toBe('10 g')
    expect(formatYeastMass(0.08, false)).toBe('0.08 g')
    expect(formatYeastMass(0.5, true)).toBe('0.5 g')
    expect(formatYeastMass(11.4, false)).toBe('11.4 g')
  })

  it('formats temperatures with at most one decimal place', () => {
    expect(formatTemperature(64.5, 'F')).toBe('64.5°F')
    expect(formatTemperature(20, 'C')).toBe('20°C')
  })

  it('formats percentages and documented warnings', () => {
    expect(formatPercent(12.5)).toBe('13%')
    expect(DOUGH_WARNING_LABELS['invalid-flour-share-total'])
      .toBe('Flour shares must total 100% to show individual flour quantities.')
    expect(DOUGH_WARNING_LABELS['preferment-allocation-exceeded'])
      .toBe('Preferment flour or water allocations exceed the available recipe amounts.')
    expect(DOUGH_WARNING_LABELS['excessive-leavening'])
      .toBe('The preferment leaves less than 25% of the calculated yeast for the main dough.')
  })
})
