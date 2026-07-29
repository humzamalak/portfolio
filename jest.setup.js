/* eslint-disable @typescript-eslint/no-require-imports */
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

// Mock framer-motion while stripping animation-only props so React 19 does not
// warn about unknown DOM attributes during component tests.
jest.mock('framer-motion', () => {
  const React = require('react')
  const motionProps = new Set([
    'animate',
    'custom',
    'exit',
    'initial',
    'layout',
    'transition',
    'variants',
    'viewport',
    'whileHover',
    'whileInView',
    'whileTap',
  ])

  const componentCache = new Map()

  const createMotionComponent = (tag) => {
    if (componentCache.has(tag)) {
      return componentCache.get(tag)
    }

    const Component = React.forwardRef(({ children, ...props }, ref) => {
      const domProps = Object.fromEntries(
        Object.entries(props).filter(([key]) => !motionProps.has(key))
      )
      return React.createElement(tag, { ...domProps, ref }, children)
    })
    Component.displayName = `motion.${tag}`
    componentCache.set(tag, Component)
    return Component
  }

  return {
    motion: new Proxy({}, {
      get: (_target, tag) => createMotionComponent(tag),
    }),
    AnimatePresence: ({ children }) => children,
    useInView: () => true,
    useReducedMotion: () => false,
  }
})

// Mock window.gtag for analytics
Object.defineProperty(window, 'gtag', {
  value: jest.fn(),
  writable: true,
})

// Mock fetch globally
global.fetch = jest.fn()

// Mock Resend for API tests
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn(),
    },
  })),
}))

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
