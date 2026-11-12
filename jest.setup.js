import '@testing-library/jest-dom'

jest.setTimeout(15000)

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock window.gtag for analytics
Object.defineProperty(window, 'gtag', {
  value: jest.fn(),
  writable: true,
})

// Mock fetch globally
global.fetch = jest.fn()

// Mock Next.js Request/Response for API tests
global.Request = class Request {
  constructor(input, init) {
    Object.defineProperty(this, 'url', {
      value: typeof input === 'string' ? input : input.url,
      writable: false,
      enumerable: true,
      configurable: false
    })
    this.method = init?.method || 'GET'
    this.headers = new Map(Object.entries(init?.headers || {}))
    this._body = init?.body
  }
  
  async json() {
    return JSON.parse(this._body)
  }
}

global.Response = class Response {
  constructor(body, init) {
    this.body = body
    this.status = init?.status || 200
    this.statusText = init?.statusText || 'OK'
    this.headers = new Map(Object.entries(init?.headers || {}))
  }
  
  async json() {
    return JSON.parse(this.body)
  }
}
