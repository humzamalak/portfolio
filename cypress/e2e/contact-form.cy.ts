describe('Contact Form E2E Tests', () => {
  beforeEach(() => {
    // Visit the homepage
    cy.visit('/')
    
    // Scroll to contact section
    cy.get('#contact').scrollIntoView()
  })

  it('should display contact form correctly', () => {
    // Check that contact section is visible
    cy.get('#contact').should('be.visible')
    
    // Check form elements
    cy.get('h2').contains('Get In Touch').should('be.visible')
    cy.get('label').contains('Name').should('be.visible')
    cy.get('label').contains('Email').should('be.visible')
    cy.get('label').contains('Inquiry Type').should('be.visible')
    cy.get('label').contains('Message').should('be.visible')
    cy.get('button').contains('Send Message').should('be.visible')
    
    // Check availability badge
    cy.contains('Available for Consulting & Freelance Work').should('be.visible')
    
    // Check social links
    cy.get('a[href*="github.com"]').should('be.visible')
    cy.get('a[href*="linkedin.com"]').should('be.visible')
  })

  it('should validate form fields correctly', () => {
    // Try to submit empty form
    cy.get('button').contains('Send Message').click()
    
    // Form should not submit (no network request)
    cy.intercept('POST', '/api/contact').as('contactSubmit')
    cy.get('@contactSubmit.all').should('have.length', 0)
    
    // Fill only name
    cy.get('input[name="name"]').type('John Doe')
    cy.get('button').contains('Send Message').click()
    
    // Still no submission
    cy.get('@contactSubmit.all').should('have.length', 0)
    
    // Fill invalid email
    cy.get('input[name="email"]').type('invalid-email')
    cy.get('textarea[name="message"]').type('Short message')
    cy.get('button').contains('Send Message').click()
    
    // Still no submission due to validation
    cy.get('@contactSubmit.all').should('have.length', 0)
  })

  it('should submit form with valid data', () => {
    // Intercept the API call
    cy.intercept('POST', '/api/contact', {
      statusCode: 200,
      body: {
        message: 'Contact form submitted successfully',
        id: 'test-email-id'
      }
    }).as('contactSubmit')
    
    // Fill out the form
    cy.get('input[name="name"]').type('John Doe')
    cy.get('input[name="email"]').type('john.doe@example.com')
    cy.get('select[name="inquiryType"]').select('consulting')
    cy.get('textarea[name="message"]').type('I am interested in hiring you for a consulting project. Please let me know your availability and rates.')
    
    // Submit the form
    cy.get('button').contains('Send Message').click()
    
    // Verify API call was made
    cy.wait('@contactSubmit').then((interception) => {
      expect(interception.request.body).to.deep.include({
        name: 'John Doe',
        email: 'john.doe@example.com',
        inquiryType: 'consulting'
      })
      expect(interception.request.body.message).to.contain('consulting project')
    })
    
    // Verify success message
    cy.contains('Your message has been sent!').should('be.visible')
    
    // Verify form is reset
    cy.get('input[name="name"]').should('have.value', '')
    cy.get('input[name="email"]').should('have.value', '')
    cy.get('textarea[name="message"]').should('have.value', '')
    cy.get('select[name="inquiryType"]').should('have.value', 'general')
  })

  it('should handle form submission errors', () => {
    // Intercept the API call with error response
    cy.intercept('POST', '/api/contact', {
      statusCode: 500,
      body: {
        error: 'Email service temporarily unavailable'
      }
    }).as('contactSubmitError')
    
    // Fill out the form
    cy.get('input[name="name"]').type('Jane Smith')
    cy.get('input[name="email"]').type('jane.smith@example.com')
    cy.get('textarea[name="message"]').type('This is a test message with enough characters to pass validation.')
    
    // Submit the form
    cy.get('button').contains('Send Message').click()
    
    // Verify API call was made
    cy.wait('@contactSubmitError')
    
    // Verify error message
    cy.contains('Something went wrong').should('be.visible')
    
    // Verify form data is preserved for retry
    cy.get('input[name="name"]').should('have.value', 'Jane Smith')
    cy.get('input[name="email"]').should('have.value', 'jane.smith@example.com')
    cy.get('textarea[name="message"]').should('contain.value', 'test message')
  })

  it('should handle network errors', () => {
    // Intercept the API call with network error
    cy.intercept('POST', '/api/contact', {
      forceNetworkError: true
    }).as('contactSubmitNetworkError')
    
    // Fill out the form
    cy.get('input[name="name"]').type('Alice Johnson')
    cy.get('input[name="email"]').type('alice.johnson@example.com')
    cy.get('textarea[name="message"]').type('This is a test message with enough characters to pass validation.')
    
    // Submit the form
    cy.get('button').contains('Send Message').click()
    
    // Verify error message
    cy.contains('Something went wrong').should('be.visible')
  })

  it('should show loading state during submission', () => {
    // Intercept the API call with delay
    cy.intercept('POST', '/api/contact', {
      delay: 2000,
      statusCode: 200,
      body: {
        message: 'Contact form submitted successfully'
      }
    }).as('contactSubmitDelay')
    
    // Fill out the form
    cy.get('input[name="name"]').type('Bob Wilson')
    cy.get('input[name="email"]').type('bob.wilson@example.com')
    cy.get('textarea[name="message"]').type('This is a test message with enough characters to pass validation.')
    
    // Submit the form
    cy.get('button').contains('Send Message').click()
    
    // Verify loading state
    cy.get('button').contains('Sending...').should('be.visible')
    cy.get('button').should('be.disabled')
    
    // Wait for completion
    cy.wait('@contactSubmitDelay')
    cy.contains('Your message has been sent!').should('be.visible')
  })

  it('should test all inquiry types', () => {
    const inquiryTypes = [
      { value: 'general', label: 'General Inquiry' },
      { value: 'consulting', label: 'Consulting Work' },
      { value: 'freelance', label: 'Freelance Project' },
      { value: 'job', label: 'Job Opportunity' },
      { value: 'collaboration', label: 'Collaboration' }
    ]
    
    inquiryTypes.forEach((inquiryType) => {
      // Intercept API call
      cy.intercept('POST', '/api/contact', {
        statusCode: 200,
        body: { message: 'Success' }
      }).as('contactSubmit')
      
      // Fill form
      cy.get('input[name="name"]').clear().type('Test User')
      cy.get('input[name="email"]').clear().type('test@example.com')
      cy.get('select[name="inquiryType"]').select(inquiryType.value)
      cy.get('textarea[name="message"]').clear().type('This is a test message with enough characters.')
      
      // Submit
      cy.get('button').contains('Send Message').click()
      
      // Verify correct inquiry type was sent
      cy.wait('@contactSubmit').then((interception) => {
        expect(interception.request.body.inquiryType).to.equal(inquiryType.value)
      })
      
      // Clear for next iteration
      cy.get('input[name="name"]').clear()
      cy.get('input[name="email"]').clear()
      cy.get('textarea[name="message"]').clear()
    })
  })

  it('should be accessible', () => {
    // Check form accessibility
    cy.get('form').should('have.attr', 'data-analytics', 'contact')
    
    // Check labels are properly associated
    cy.get('input[name="name"]').should('have.attr', 'id', 'name')
    cy.get('label[for="name"]').should('exist')
    
    cy.get('input[name="email"]').should('have.attr', 'id', 'email')
    cy.get('label[for="email"]').should('exist')
    
    cy.get('textarea[name="message"]').should('have.attr', 'id', 'message')
    cy.get('label[for="message"]').should('exist')
    
    // Check social links have proper aria labels
    cy.get('a[href*="github.com"]').should('have.attr', 'aria-label', 'GitHub profile')
    cy.get('a[href*="linkedin.com"]').should('have.attr', 'aria-label', 'LinkedIn profile')
    
    // Check status messages have proper roles
    cy.get('[role="status"]').should('have.attr', 'aria-live', 'polite')
  })

  it('should work on mobile viewport', () => {
    // Set mobile viewport
    cy.viewport(375, 667)
    
    // Check that form is still accessible
    cy.get('#contact').should('be.visible')
    cy.get('input[name="name"]').should('be.visible')
    cy.get('input[name="email"]').should('be.visible')
    cy.get('textarea[name="message"]').should('be.visible')
    cy.get('button').contains('Send Message').should('be.visible')
    
    // Test form submission on mobile
    cy.intercept('POST', '/api/contact', {
      statusCode: 200,
      body: { message: 'Success' }
    }).as('mobileContactSubmit')
    
    cy.get('input[name="name"]').type('Mobile User')
    cy.get('input[name="email"]').type('mobile@example.com')
    cy.get('textarea[name="message"]').type('This is a test message from mobile device.')
    
    cy.get('button').contains('Send Message').click()
    
    cy.wait('@mobileContactSubmit')
    cy.contains('Your message has been sent!').should('be.visible')
  })
})
