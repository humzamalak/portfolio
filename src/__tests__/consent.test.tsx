import { act, fireEvent, render, screen } from '@testing-library/react'

const TOKEN = 'test-cf-token'

// consent.tsx reads the token when the module loads, so set it before the import.
let ConsentBanner: typeof import('../components/consent').ConsentBanner
beforeAll(async () => {
  process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN = TOKEN
  ConsentBanner = (await import('../components/consent')).ConsentBanner
})
afterAll(() => { delete process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN })

async function showBanner() {
  render(<ConsentBanner />)
  // The banner opens on the next animation frame, after hydration.
  await act(() => new Promise<void>(resolve => requestAnimationFrame(() => resolve())))
}

const beacon = () => document.getElementById('cf-beacon') as HTMLScriptElement | null

beforeEach(() => {
  localStorage.clear()
  beacon()?.remove()
})

describe('Cloudflare Web Analytics consent', () => {
  it('does not load the beacon before the visitor chooses', async () => {
    await showBanner()
    expect(screen.getByRole('dialog')).toBeTruthy()
    expect(beacon()).toBeNull()
  })

  it('loads the beacon with the token after Accept', async () => {
    await showBanner()
    fireEvent.click(screen.getByRole('button', { name: 'Accept' }))
    const script = beacon()
    expect(script?.src).toBe('https://static.cloudflareinsights.com/beacon.min.js')
    expect(script?.type).toBe('module')
    expect(JSON.parse(script?.dataset.cfBeacon ?? '{}')).toEqual({ token: TOKEN })
    expect(localStorage.getItem('analytics-consent')).toBe('accepted')
  })

  it('does not load the beacon after Decline', async () => {
    await showBanner()
    fireEvent.click(screen.getByRole('button', { name: 'Decline' }))
    expect(beacon()).toBeNull()
  })

  it('loads the beacon on a later visit when the visitor accepted before', async () => {
    localStorage.setItem('analytics-consent', 'accepted')
    await showBanner()
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(beacon()).not.toBeNull()
  })
})
