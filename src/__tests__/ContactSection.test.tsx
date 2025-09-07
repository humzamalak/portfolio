import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContactSection from '@/app/(sections)/contact/ContactSection'

// Mock fetch
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe('ContactSection', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    // Reset window.gtag mock
    if (window.gtag) {
      (window.gtag as jest.Mock).mockClear()
    }
  })

  it('renders contact form with all required fields', () => {
    render(<ContactSection />)
    
    expect(screen.getByText('Get In Touch')).toBeInTheDocument()
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/inquiry type/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument()
  })

  it('shows availability badge', () => {
    render(<ContactSection />)
    
    expect(screen.getByText(/available for consulting/i)).toBeInTheDocument()
  })

  it('validates required fields on form submission', async () => {
    const user = userEvent.setup()
    render(<ContactSection />)
    
    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)
    
    // Check that validation prevents submission
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Success' }),
    } as Response)
    
    render(<ContactSection />)
    
    // Fill out form
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/message/i), 'This is a test message with enough characters')
    
    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'This is a test message with enough characters',
          inquiryType: 'general',
        }),
      })
    })
  })

  it('shows success message after successful submission', async () => {
    const user = userEvent.setup()
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Success' }),
    } as Response)
    
    render(<ContactSection />)
    
    // Fill out form
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/message/i), 'This is a test message with enough characters')
    
    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/your message has been sent/i)).toBeInTheDocument()
    })
    
    // Form should be reset
    expect(screen.getByLabelText(/name/i)).toHaveValue('')
    expect(screen.getByLabelText(/email/i)).toHaveValue('')
    expect(screen.getByLabelText(/message/i)).toHaveValue('')
  })

  it('shows error message after failed submission', async () => {
    const user = userEvent.setup()
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({ error: 'Server error' }),
    } as Response)
    
    render(<ContactSection />)
    
    // Fill out form
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/message/i), 'This is a test message with enough characters')
    
    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })
  })

  it('handles network errors gracefully', async () => {
    const user = userEvent.setup()
    mockFetch.mockRejectedValueOnce(new Error('Network error'))
    
    render(<ContactSection />)
    
    // Fill out form
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/message/i), 'This is a test message with enough characters')
    
    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })
  })

  it('shows loading state during submission', async () => {
    const user = userEvent.setup()
    // Mock a delayed response
    mockFetch.mockImplementationOnce(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({ message: 'Success' }),
        } as Response), 100)
      )
    )
    
    render(<ContactSection />)
    
    // Fill out form
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/message/i), 'This is a test message with enough characters')
    
    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)
    
    // Should show loading state
    expect(screen.getByText('Sending...')).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })

  it('tracks form submission with analytics', async () => {
    const user = userEvent.setup()
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Success' }),
    } as Response)
    
    render(<ContactSection />)
    
    // Fill out form
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/message/i), 'This is a test message with enough characters')
    
    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(window.gtag).toHaveBeenCalledWith('event', 'submit', {
        event_category: 'contact_form',
        event_label: 'portfolio_contact',
        value: 1,
      })
    })
  })

  it('allows selecting different inquiry types', async () => {
    const user = userEvent.setup()
    render(<ContactSection />)
    
    const inquirySelect = screen.getByLabelText(/inquiry type/i)
    await user.selectOptions(inquirySelect, 'consulting')
    
    expect(inquirySelect).toHaveValue('consulting')
  })

  it('has proper accessibility attributes', () => {
    render(<ContactSection />)
    
    // Use querySelector instead of getByRole since form doesn't have role attribute
    const form = document.querySelector('form[data-analytics="contact"]')
    expect(form).toBeInTheDocument()
    expect(screen.getByLabelText(/github profile/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/linkedin profile/i)).toBeInTheDocument()
  })

  it('handles form input changes correctly', async () => {
    const user = userEvent.setup()
    render(<ContactSection />)
    
    const nameInput = screen.getByLabelText(/name/i)
    const emailInput = screen.getByLabelText(/email/i)
    const messageInput = screen.getByLabelText(/message/i)
    
    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(messageInput, 'Test message')
    
    expect(nameInput).toHaveValue('John Doe')
    expect(emailInput).toHaveValue('john@example.com')
    expect(messageInput).toHaveValue('Test message')
  })
})
