/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  isValidEmail,
  formatEmailAddress,
  validateAndFormatEmails,
  getResendErrorMessage,
  RESEND_ERROR_MESSAGES,
} from '@/lib/email-utils'

describe('email-utils', () => {
  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'user123@test-domain.com',
        'a@b.co',
        'test.email.with+symbol@example.com',
      ]

      validEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(true)
      })
    })

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        '',
        'invalid-email',
        '@example.com',
        'test@',
        'test@.com',
        'test@example.',
        'test@example..com',
        'test@example.com.',
        null as any,
        undefined as any,
        123 as any,
      ]

      invalidEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(false)
      })
    })

    it('should handle edge cases', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail(' test@example.com ')).toBe(true) // spaces are trimmed in this function
      expect(isValidEmail('test@sub.example.com')).toBe(true)
    })
  })

  describe('formatEmailAddress', () => {
    it('should format email with name', () => {
      const result = formatEmailAddress('test@example.com', 'John Doe')
      expect(result).toBe('John Doe <test@example.com>')
    })

    it('should format email without name', () => {
      const result = formatEmailAddress('test@example.com')
      expect(result).toBe('test@example.com')
    })

    it('should escape special characters in name', () => {
      const result = formatEmailAddress('test@example.com', 'John "Doe" <test>')
      expect(result).toBe('John Doe test <test@example.com>')
    })

    it('should trim whitespace from email', () => {
      const result = formatEmailAddress(' test@example.com ', 'John Doe')
      expect(result).toBe('John Doe <test@example.com>')
    })

    it('should throw error for invalid email', () => {
      expect(() => formatEmailAddress('invalid-email')).toThrow('Invalid email format')
    })

    it('should handle empty name', () => {
      const result = formatEmailAddress('test@example.com', '')
      expect(result).toBe('test@example.com')
    })
  })

  describe('validateAndFormatEmails', () => {
    it('should validate and format all emails correctly', () => {
      const result = validateAndFormatEmails({
        fromEmail: 'sender@example.com',
        fromName: 'Sender Name',
        toEmails: ['recipient1@example.com', 'recipient2@example.com'],
        replyTo: 'reply@example.com',
      })

      expect(result).toEqual({
        from: 'Sender Name <sender@example.com>',
        to: ['recipient1@example.com', 'recipient2@example.com'],
        replyTo: 'reply@example.com',
      })
    })

    it('should filter out invalid recipient emails', () => {
      const result = validateAndFormatEmails({
        fromEmail: 'sender@example.com',
        fromName: 'Sender Name',
        toEmails: ['valid@example.com', 'invalid-email', 'another@example.com'],
        replyTo: 'reply@example.com',
      })

      expect(result).toEqual({
        from: 'Sender Name <sender@example.com>',
        to: ['valid@example.com', 'another@example.com'],
        replyTo: 'reply@example.com',
      })
    })

    it('should throw error for invalid from email', () => {
      expect(() => validateAndFormatEmails({
        fromEmail: 'invalid-email',
        fromName: 'Sender Name',
        toEmails: ['recipient@example.com'],
        replyTo: 'reply@example.com',
      })).toThrow('Invalid from email address')
    })

    it('should throw error when no valid recipient emails', () => {
      expect(() => validateAndFormatEmails({
        fromEmail: 'sender@example.com',
        fromName: 'Sender Name',
        toEmails: ['invalid-email', 'another-invalid'],
        replyTo: 'reply@example.com',
      })).toThrow('At least one valid recipient email is required')
    })

    it('should throw error for invalid reply-to email', () => {
      expect(() => validateAndFormatEmails({
        fromEmail: 'sender@example.com',
        fromName: 'Sender Name',
        toEmails: ['recipient@example.com'],
        replyTo: 'invalid-email',
      })).toThrow('Invalid reply-to email address')
    })

    it('should handle missing reply-to', () => {
      const result = validateAndFormatEmails({
        fromEmail: 'sender@example.com',
        fromName: 'Sender Name',
        toEmails: ['recipient@example.com'],
      })

      expect(result).toEqual({
        from: 'Sender Name <sender@example.com>',
        to: ['recipient@example.com'],
        replyTo: undefined,
      })
    })
  })

  describe('getResendErrorMessage', () => {
    it('should return user-friendly message for known errors', () => {
      Object.entries(RESEND_ERROR_MESSAGES).forEach(([key, expectedMessage]) => {
        const error = { message: key }
        expect(getResendErrorMessage(error)).toBe(expectedMessage)
      })
    })

    it('should return default message for unknown errors', () => {
      const error = { message: 'Some unknown error' }
      expect(getResendErrorMessage(error)).toBe('Failed to send email. Please try again later.')
    })

    it('should handle errors without message property', () => {
      const error = { code: 'UNKNOWN_ERROR' }
      expect(getResendErrorMessage(error)).toBe('Failed to send email. Please try again later.')
    })

    it('should handle null/undefined errors', () => {
      expect(getResendErrorMessage(null)).toBe('Failed to send email. Please try again later.')
      expect(getResendErrorMessage(undefined)).toBe('Failed to send email. Please try again later.')
    })

    it('should handle partial error message matches', () => {
      const error = { message: 'This error contains Invalid `from` field somewhere' }
      expect(getResendErrorMessage(error)).toBe(RESEND_ERROR_MESSAGES['Invalid `from` field'])
    })
  })

  describe('RESEND_ERROR_MESSAGES', () => {
    it('should contain all expected error mappings', () => {
      expect(RESEND_ERROR_MESSAGES).toHaveProperty('Invalid `from` field')
      expect(RESEND_ERROR_MESSAGES).toHaveProperty('Unauthorized')
      expect(RESEND_ERROR_MESSAGES).toHaveProperty('Domain not verified')
      expect(RESEND_ERROR_MESSAGES).toHaveProperty('Rate limit exceeded')
      expect(RESEND_ERROR_MESSAGES).toHaveProperty('Invalid recipient')
    })

    it('should have user-friendly error messages', () => {
      expect(RESEND_ERROR_MESSAGES['Invalid `from` field']).toContain('Email configuration error')
      expect(RESEND_ERROR_MESSAGES['Unauthorized']).toContain('authentication failed')
      expect(RESEND_ERROR_MESSAGES['Domain not verified']).toContain('verified with Resend')
      expect(RESEND_ERROR_MESSAGES['Rate limit exceeded']).toContain('try again later')
      expect(RESEND_ERROR_MESSAGES['Invalid recipient']).toContain('invalid')
    })
  })
})
