import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import PwaUpdatePrompt from '../../app/components/app/PwaUpdatePrompt.vue'

describe('PwaUpdatePrompt', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('activates a waiting worker and reloads when it takes control', async () => {
    let controllerChange: (() => void) | undefined
    const waitingWorker = { postMessage: vi.fn() }
    const registration = {
      waiting: waitingWorker,
      installing: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }
    const serviceWorker = {
      controller: {},
      getRegistration: vi.fn().mockResolvedValue(registration),
      addEventListener: vi.fn((event: string, listener: () => void) => {
        if (event === 'controllerchange') controllerChange = listener
      }),
      removeEventListener: vi.fn()
    }
    const reload = vi.fn()
    vi.stubGlobal('navigator', { serviceWorker })
    vi.stubGlobal('location', { reload })
    const wrapper = mount(PwaUpdatePrompt)
    await flushPromises()

    await wrapper.get('button').trigger('click')
    expect(waitingWorker.postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' })
    controllerChange?.()
    expect(reload).toHaveBeenCalledOnce()
  })

  it('waits for registration when the initial service worker lookup is empty', async () => {
    const registration = {
      waiting: {},
      installing: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }
    const serviceWorker = {
      controller: {},
      getRegistration: vi.fn().mockResolvedValue(undefined),
      ready: Promise.resolve(registration),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }
    vi.stubGlobal('navigator', { serviceWorker })

    const wrapper = mount(PwaUpdatePrompt)
    await flushPromises()

    expect(wrapper.get('button').text()).toBe('Update app')
  })
})
