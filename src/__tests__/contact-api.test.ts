/* eslint-disable @typescript-eslint/no-explicit-any */
import { POST } from '@/app/api/contact/route'
import { Resend } from 'resend'

// Mock Resend
jest.mock('resend')
const MockedResend = Resend as jest.MockedClass<typeof Resend>

// Mock NextResponse
jest.mock('next/server', () => ({
  NextRequest: class MockNextRequest {
    constructor(public url: string, public init?: RequestInit) {}
    async json() {
      return JSON.parse(this.init?.body as string || '{}')
    }
  },
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: async () => data,
      status: init?.status || 200,
      statusText: init?.statusText || 'OK',
    })),
  },
}))

describe('/api/contact', () => {
  let mockResendInstance: {
    emails: {
      send: jest.Mock
    }
  }

  beforeEach(() => {
    mockResendInstance = {
      emails: {
        send: jest.fn(),
      },
    }
    MockedResend.mockImplementation(() => mockResendInstance as unknown as Resend)
    
    // Set up environment variables
    process.env.RESEND_API_KEY = 'test-api-key'
    process.env.CONTACT_TO_EMAIL = 'test@example.com'
    process.env.CONTACT_FROM_EMAIL = 'noreply@example.com'
    process.env.CONTACT_FROM_NAME = 'Test Portfolio'
  })

  afterEach(() => {
    jest.clearAllMocks()
    delete process.env.RESEND_API_KEY
    delete process.env.CONTACT_TO_EMAIL
    delete process.env.CONTACT_FROM_EMAIL
    delete process.env.CONTACT_FROM_NAME
  })

  it('should return 400 for missing required fields', async () => {
    const request = {
      json: async () => ({}),
    } as any

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toContain('Missing required fields')
  })

  it('should return 400 for invalid email format', async () => {
    const request = {
      json: async () => ({
        name: 'John Doe',
        email: 'invalid-email',
        message: 'Test message',
      }),
    } as any

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid email format')
  })

  it('should return 500 when RESEND_API_KEY is missing', async () => {
    delete process.env.RESEND_API_KEY

    const request = {
      json: async () => ({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message',
      }),
    } as any

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Email service not configured')
  })

  it('should send email successfully', async () => {
    mockResendInstance.emails.send.mockResolvedValueOnce({
      data: { id: 'test-email-id' },
    })

    const request = {
      json: async () => ({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message',
        inquiryType: 'consulting',
      }),
    } as any

    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.message).toBe('Contact form submitted successfully')
    expect(json.id).toBe('test-email-id')

    expect(mockResendInstance.emails.send).toHaveBeenCalledWith({
      from: 'Test Portfolio <noreply@example.com>',
      to: ['test@example.com'],
      replyTo: 'john@example.com',
      subject: 'New contact: consulting from John Doe',
      text: expect.stringContaining('John Doe'),
    })
  })

  it('should handle Resend send error with invalid from field', async () => {
    mockResendInstance.emails.send.mockRejectedValueOnce({
      message: 'Invalid `from` field',
    })

    const request = {
      json: async () => ({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message',
      }),
    } as any

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(422)
    expect(data.error).toContain('Email configuration error')
    expect(data.details).toContain('verified with Resend')
  })

  it('should handle Resend send error with unauthorized', async () => {
    mockResendInstance.emails.send.mockRejectedValueOnce({
      message: 'Unauthorized',
    })

    const request = {
      json: async () => ({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message',
      }),
    } as any

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toContain('Email service authentication failed')
    expect(data.details).toContain('API key')
  })

  it('should handle generic Resend errors', async () => {
    mockResendInstance.emails.send.mockRejectedValueOnce({
      message: 'Some other error',
    })

    const request = {
      json: async () => ({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message',
      }),
    } as any

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(502)
    expect(data.error).toBe('Failed to send email. Please try again later.')
  })

  it('should use default values when environment variables are not set', async () => {
    delete process.env.CONTACT_TO_EMAIL
    delete process.env.CONTACT_FROM_EMAIL
    delete process.env.CONTACT_FROM_NAME

    mockResendInstance.emails.send.mockResolvedValueOnce({
      data: { id: 'test-email-id' },
    })

    const request = {
      json: async () => ({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message',
      }),
    } as any

    const response = await POST(request)
    await response.json()

    expect(response.status).toBe(200)

    expect(mockResendInstance.emails.send).toHaveBeenCalledWith({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: ['humzatmalak@gmail.com'],
      replyTo: 'john@example.com',
      subject: 'New contact: general from John Doe',
      text: expect.stringContaining('John Doe'),
    })
  })

  it('should handle JSON parsing errors', async () => {
    const request = {
      json: async () => {
        throw new Error('Invalid JSON')
      },
    } as any

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Internal server error')
  })

  it('should include timestamp in email content', async () => {
    const mockDate = new Date('2023-01-01T00:00:00.000Z')
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any)

    mockResendInstance.emails.send.mockResolvedValueOnce({
      data: { id: 'test-email-id' },
    })

    const request = {
      json: async () => ({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message',
        inquiryType: 'freelance',
      }),
    } as any

    await POST(request)

    expect(mockResendInstance.emails.send).toHaveBeenCalledWith({
      from: 'Test Portfolio <noreply@example.com>',
      to: ['test@example.com'],
      replyTo: 'john@example.com',
      subject: 'New contact: freelance from John Doe',
      text: expect.stringContaining('2023-01-01T00:00:00.000Z'),
    })

    jest.restoreAllMocks()
  })
})