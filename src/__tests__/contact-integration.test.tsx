import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContactSection from '@/app/(sections)/contact/ContactSection'
import { isValidEmail, formatEmailAddress } from '@/lib/email-utils'

// Mock fetch
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe('Contact Form Integration Tests', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    if (window.gtag) {
      (window.gtag as jest.Mock).mockClear()
    }
  })

  describe('Complete Contact Flow', () => {
    it('should handle complete successful contact flow', async () => {
      const user = userEvent.setup()
      
      // Mock successful API response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          message: 'Contact form submitted successfully',
          id: 'test-email-id-123'
        }),
      } as Response)
      
      render(<ContactSection />)
      
      // Verify initial state
      expect(screen.getByText('Get In Touch')).toBeInTheDocument()
      expect(screen.getByText(/available for consulting/i)).toBeInTheDocument()
      
      // Fill out the form step by step
      const nameInput = screen.getByLabelText(/name/i)
      const emailInput = screen.getByLabelText(/email/i)
      const inquirySelect = screen.getByLabelText(/inquiry type/i)
      const messageInput = screen.getByLabelText(/message/i)
      const submitButton = screen.getByRole('button', { name: /send message/i })
      
      // Step 1: Fill name
      await user.type(nameInput, 'Jane Smith')
      expect(nameInput).toHaveValue('Jane Smith')
      
      // Step 2: Fill email
      await user.type(emailInput, 'jane.smith@example.com')
      expect(emailInput).toHaveValue('jane.smith@example.com')
      
      // Step 3: Select inquiry type
      await user.selectOptions(inquirySelect, 'freelance')
      expect(inquirySelect).toHaveValue('freelance')
      
      // Step 4: Fill message
      const message = 'I am interested in hiring you for a freelance project. Please let me know your availability and rates.'
      await user.type(messageInput, message)
      expect(messageInput).toHaveValue(message)
      
      // Step 5: Submit form
      await user.click(submitButton)
      
      // Verify API call
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            message: message,
            inquiryType: 'freelance',
          }),
        })
      })
      
      // Verify success state
      await waitFor(() => {
        expect(screen.getByText(/your message has been sent/i)).toBeInTheDocument()
      })
      
      // Verify form reset
      expect(nameInput).toHaveValue('')
      expect(emailInput).toHaveValue('')
      expect(messageInput).toHaveValue('')
      expect(inquirySelect).toHaveValue('general')
      
      // Verify analytics tracking
      expect(window.gtag).toHaveBeenCalledWith('event', 'submit', {
        event_category: 'contact_form',
        event_label: 'portfolio_contact',
        value: 1,
      })
    })

    it('should handle complete error flow', async () => {
      const user = userEvent.setup()
      
      // Mock API error response
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ 
          error: 'Email service temporarily unavailable',
          details: 'Please try again later'
        }),
      } as Response)
      
      render(<ContactSection />)
      
      // Fill out form
      await user.type(screen.getByLabelText(/name/i), 'John Doe')
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/message/i), 'This is a test message with enough characters')
      
      // Submit form
      await user.click(screen.getByRole('button', { name: /send message/i }))
      
      // Verify error state
      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
      })
      
      // Verify form data is preserved for retry
      expect(screen.getByLabelText(/name/i)).toHaveValue('John Doe')
      expect(screen.getByLabelText(/email/i)).toHaveValue('john@example.com')
      expect(screen.getByLabelText(/message/i)).toHaveValue('This is a test message with enough characters')
    })

    it('should handle network error flow', async () => {
      const user = userEvent.setup()
      
      // Mock network error
      mockFetch.mockRejectedValueOnce(new Error('Network connection failed'))
      
      render(<ContactSection />)
      
      // Fill out form
      await user.type(screen.getByLabelText(/name/i), 'Alice Johnson')
      await user.type(screen.getByLabelText(/email/i), 'alice@example.com')
      await user.type(screen.getByLabelText(/message/i), 'This is a test message with enough characters')
      
      // Submit form
      await user.click(screen.getByRole('button', { name: /send message/i }))
      
      // Verify error state
      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
      })
    })
  })

  describe('Form Validation Integration', () => {
    it('should prevent submission with invalid data', async () => {
      const user = userEvent.setup()
      render(<ContactSection />)
      
      // Try to submit empty form
      await user.click(screen.getByRole('button', { name: /send message/i }))
      
      // Verify no API call was made
      expect(mockFetch).not.toHaveBeenCalled()
      
      // Fill only name
      await user.type(screen.getByLabelText(/name/i), 'John')
      await user.click(screen.getByRole('button', { name: /send message/i }))
      
      // Still no API call
      expect(mockFetch).not.toHaveBeenCalled()
      
      // Fill invalid email
      await user.type(screen.getByLabelText(/email/i), 'invalid-email')
      await user.type(screen.getByLabelText(/message/i), 'Short message')
      await user.click(screen.getByRole('button', { name: /send message/i }))
      
      // Still no API call due to validation
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('should allow submission with valid data', async () => {
      const user = userEvent.setup()
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Success' }),
      } as Response)
      
      render(<ContactSection />)
      
      // Fill valid data
      await user.type(screen.getByLabelText(/name/i), 'John Doe')
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/message/i), 'This is a valid message with enough characters')
      
      // Submit form
      await user.click(screen.getByRole('button', { name: /send message/i }))
      
      // Verify API call was made
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('Email Utils Integration', () => {
    it('should validate emails correctly in form context', () => {
      // Test various email formats that should be valid
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
        expect(() => formatEmailAddress(email)).not.toThrow()
      })

      // Test various email formats that should be invalid
      const invalidEmails = [
        '',
        'invalid-email',
        '@example.com',
        'test@',
        'test@.com',
        'test@example.',
        'test@example..com',
        'test@example.com.',
      ]

      invalidEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(false)
        expect(() => formatEmailAddress(email)).toThrow()
      })
    })

    it('should format email addresses correctly for Resend API', () => {
      // Test email formatting with names
      expect(formatEmailAddress('test@example.com', 'John Doe')).toBe('John Doe <test@example.com>')
      expect(formatEmailAddress('test@example.com', 'John "Doe" <test>')).toBe('John Doe test <test@example.com>')
      expect(formatEmailAddress('test@example.com')).toBe('test@example.com')
      expect(formatEmailAddress('test@example.com', '')).toBe('test@example.com')
    })
  })

  describe('User Experience Integration', () => {
    it('should show loading state during submission', async () => {
      const user = userEvent.setup()
      
      // Mock delayed response
      mockFetch.mockImplementationOnce(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: async () => ({ message: 'Success' }),
          } as Response), 200)
        )
      )
      
      render(<ContactSection />)
      
      // Fill and submit form
      await user.type(screen.getByLabelText(/name/i), 'John Doe')
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/message/i), 'This is a test message with enough characters')
      
      const submitButton = screen.getByRole('button', { name: /send message/i })
      await user.click(submitButton)
      
      // Verify loading state
      expect(screen.getByText('Sending...')).toBeInTheDocument()
      expect(submitButton).toBeDisabled()
      
      // Wait for completion
      await waitFor(() => {
        expect(screen.getByText(/your message has been sent/i)).toBeInTheDocument()
      })
    })

    it('should handle multiple inquiry types correctly', async () => {
      const user = userEvent.setup()
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Success' }),
      } as Response)
      
      render(<ContactSection />)
      
      const inquirySelect = screen.getByLabelText(/inquiry type/i)
      
      // Test all inquiry types
      const inquiryTypes = ['general', 'consulting', 'freelance', 'job', 'collaboration']
      
      for (const inquiryType of inquiryTypes) {
        await user.selectOptions(inquirySelect, inquiryType)
        expect(inquirySelect).toHaveValue(inquiryType)
        
        // Fill form and submit
        await user.type(screen.getByLabelText(/name/i), 'John Doe')
        await user.type(screen.getByLabelText(/email/i), 'john@example.com')
        await user.type(screen.getByLabelText(/message/i), 'This is a test message with enough characters')
        
        await user.click(screen.getByRole('button', { name: /send message/i }))
        
        await waitFor(() => {
          expect(mockFetch).toHaveBeenCalledWith('/api/contact', 
            expect.objectContaining({
              body: expect.stringContaining(`"inquiryType":"${inquiryType}"`)
            })
          )
        })
        
        // Reset for next iteration
        mockFetch.mockClear()
        await user.clear(screen.getByLabelText(/name/i))
        await user.clear(screen.getByLabelText(/email/i))
        await user.clear(screen.getByLabelText(/message/i))
      }
    })
  })
})
