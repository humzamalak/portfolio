import { onRequestPost } from '../../functions/api/contact'

// The contact endpoint is a Cloudflare Pages Function that calls the Resend REST API with fetch.
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

const env = {
  RESEND_API_KEY: 'test-api-key',
  CONTACT_TO_EMAIL: 'owner@example.com',
  CONTACT_FROM_EMAIL: 'noreply@example.com',
  CONTACT_FROM_NAME: 'Test Portfolio',
}

const post = (body: unknown, overrides: Partial<typeof env> = {}) =>
  onRequestPost({
    request: { json: async () => body } as unknown as Request,
    env: { ...env, ...overrides },
  })

const valid = { name: 'John Doe', email: 'john@example.com', message: 'Test message' }

describe('POST /api/contact (Pages Function)', () => {
  beforeEach(() => mockFetch.mockReset())

  it('returns 400 when a required field is missing', async () => {
    const response = await post({ name: 'John Doe' })
    expect(response.status).toBe(400)
    expect((await response.json()).error).toBe('Name, email, and message are required.')
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('returns 400 for an invalid email address', async () => {
    const response = await post({ ...valid, email: 'invalid-email' })
    expect(response.status).toBe(400)
    expect((await response.json()).error).toBe('Please enter a valid email address.')
  })

  it('returns 400 when the message is too long', async () => {
    const response = await post({ ...valid, message: 'x'.repeat(5001) })
    expect(response.status).toBe(400)
    expect((await response.json()).error).toBe('The message is too long.')
  })

  it('returns 400 when the body is not valid JSON', async () => {
    const response = await onRequestPost({
      request: { json: async () => { throw new SyntaxError('bad json') } } as unknown as Request,
      env,
    })
    expect(response.status).toBe(400)
  })

  it('returns 503 when RESEND_API_KEY is not set', async () => {
    const response = await post(valid, { RESEND_API_KEY: '' })
    expect(response.status).toBe(503)
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('sends the email through Resend and returns 200', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true } as Response)

    const response = await post(valid)

    expect(response.status).toBe(200)
    expect((await response.json()).message).toBe('Contact form submitted successfully.')
    const [url, init] = mockFetch.mock.calls[0]
    expect(url).toBe('https://api.resend.com/emails')
    expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer test-api-key')
    const sent = JSON.parse(init?.body as string)
    expect(sent).toMatchObject({
      from: 'Test Portfolio <noreply@example.com>',
      to: ['owner@example.com'],
      reply_to: 'john@example.com',
      subject: 'New portfolio enquiry from John Doe',
    })
    expect(sent.text).toContain('Test message')
  })

  it('returns 502 when Resend rejects the message', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false } as Response)
    const response = await post(valid)
    expect(response.status).toBe(502)
  })

  it('does not send CORS headers, so other sites cannot post to the form', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true } as Response)
    const response = await post(valid)
    expect(response.headers.get('Access-Control-Allow-Origin') ?? null).toBeNull()
  })
})
