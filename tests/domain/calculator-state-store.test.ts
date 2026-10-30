import { describe, expect, it } from 'vitest'
import { createCalculatorStateStore } from '../../app/services/calculator-state-store'

describe('calculator state store', () => {
  it('round-trips state inside the current schema version envelope', () => {
    const values = new Map<string, string>()
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value)
    }
    const store = createCalculatorStateStore(storage)

    store.save('recipe', { hydration: 65 })

    expect(store.load('recipe')).toEqual({ hydration: 65 })
    expect(JSON.parse(values.get('dough-calculator:recipe')!)).toEqual({
      version: 1,
      data: { hydration: 65 }
    })
  })

  it('returns no saved state for corrupt or incompatible values', () => {
    const values = new Map([
      ['dough-calculator:corrupt', '{'],
      ['dough-calculator:old', '{"version":0,"data":{}}']
    ])
    const store = createCalculatorStateStore({
      getItem: key => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value)
    })

    expect(store.load('corrupt')).toBeNull()
    expect(store.load('old')).toBeNull()
  })

  it('keeps the calculator usable when browser storage throws', () => {
    const store = createCalculatorStateStore({
      getItem: () => { throw new Error('storage denied') },
      setItem: () => { throw new Error('storage denied') }
    })

    expect(store.load('recipe')).toBeNull()
    expect(() => store.save('recipe', {})).not.toThrow()
  })
})
