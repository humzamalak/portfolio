# Email Functionality Testing Walkthrough

This comprehensive guide walks you through testing the email functionality in the portfolio contact form using multiple testing approaches.

## 🎯 Overview

The email functionality consists of:
- **Frontend Form**: React component with validation
- **API Route**: Next.js API endpoint (`/api/contact`)
- **Email Service**: Resend integration for sending emails
- **Email Utils**: Validation and formatting utilities

## 🚀 Quick Start

### Prerequisites
```bash
# Ensure you have the project dependencies installed
npm install

# Verify test dependencies are available
npm list jest @testing-library/react cypress
```

### Environment Setup
```bash
# Copy environment variables
cp env.example .env.local

# Add your Resend API key
echo "RESEND_API_KEY=your_resend_api_key_here" >> .env.local
echo "CONTACT_TO_EMAIL=your_email@example.com" >> .env.local
echo "CONTACT_FROM_EMAIL=noreply@yourdomain.com" >> .env.local
echo "CONTACT_FROM_NAME=Your Portfolio" >> .env.local
```

## 🧪 Testing Approaches

### 1. Unit Testing (Email Utils)

**Purpose**: Test individual email validation and formatting functions

```bash
# Run email utility tests
npm run test:unit
```

**What's Tested**:
- Email format validation
- Email address formatting
- Error message mapping
- Edge cases and special characters

**Example Test Run**:
```bash
$ npm run test:unit

> humza-portfolio@0.1.0 test:unit
> jest --testPathPatterns=email-utils.test.ts

 PASS  src/__tests__/email-utils.test.ts
  email-utils
    isValidEmail
      ✓ should validate correct email addresses (1ms)
      ✓ should reject invalid email addresses (2ms)
      ✓ should handle edge cases
    formatEmailAddress
      ✓ should format email with name
      ✓ should format email without name
      ✓ should escape special characters in name
      ✓ should trim whitespace from email
      ✓ should throw error for invalid email (3ms)
      ✓ should handle empty name
    validateAndFormatEmails
      ✓ should validate and format all emails correctly
      ✓ should filter out invalid recipient emails
      ✓ should throw error for invalid from email
      ✓ should throw error when no valid recipient emails
      ✓ should throw error for invalid reply-to email (1ms)
      ✓ should handle missing reply-to
    getResendErrorMessage
      ✓ should return user-friendly message for known errors
      ✓ should return default message for unknown errors
      ✓ should handle errors without message property
      ✓ should handle null/undefined errors
      ✓ should handle partial error message matches
    RESEND_ERROR_MESSAGES
      ✓ should contain all expected error mappings
      ✓ should have user-friendly error messages

Test Suites: 1 passed, 1 total
Tests:       22 passed, 22 total
```

### 2. API Route Testing

**Purpose**: Test the backend API endpoint that handles email sending

```bash
# Run API route tests
npm run test:api
```

**What's Tested**:
- Request validation (required fields, email format)
- Resend API integration
- Error handling (missing API key, service errors)
- Response formatting
- Environment variable handling

**Example Test Run**:
```bash
$ npm run test:api

> humza-portfolio@0.1.0 test:api
> jest --testPathPatterns=contact-api.test.ts

 PASS  src/__tests__/contact-api.test.ts
  /api/contact
    ✓ should return 400 for missing required fields (1ms)
    ✓ should return 400 for invalid email format (1ms)
    ✓ should return 500 when RESEND_API_KEY is missing (11ms)
    ✓ should send email successfully (3ms)
    ✓ should handle Resend send error with invalid from field (4ms)
    ✓ should handle Resend send error with unauthorized (2ms)
    ✓ should handle generic Resend errors (2ms)
    ✓ should use default values when environment variables are not set (1ms)
    ✓ should handle JSON parsing errors (4ms)
    ✓ should include timestamp in email content (1ms)

Test Suites: 1 passed, 1 total
Tests:       10 passed, 10 total
```

### 3. Component Testing

**Purpose**: Test the React contact form component behavior

```bash
# Run component tests
npm run test:component
```

**What's Tested**:
- Form rendering and accessibility
- User interactions (typing, selecting, submitting)
- Form validation feedback
- Loading states and success/error messages
- Analytics tracking

**Example Test Run**:
```bash
$ npm run test:component

> humza-portfolio@0.1.0 test:component
> jest --testPathPatterns=ContactSection.test.tsx

 PASS  src/__tests__/ContactSection.test.tsx
  ContactSection
    ✓ renders contact form with all required fields (61ms)
    ✓ shows availability badge (5ms)
    ✓ validates required fields on form submission (21ms)
    ✓ submits form with valid data (213ms)
    ✓ shows success message after successful submission (213ms)
    ✓ shows error message after failed submission (204ms)
    ✓ handles network errors gracefully (158ms)
    ✓ shows loading state during submission (224ms)
    ✓ tracks form submission with analytics (220ms)
    ✓ allows selecting different inquiry types (14ms)
    ✓ has proper accessibility attributes (4ms)
    ✓ handles form input changes correctly (119ms)

Test Suites: 1 passed, 1 total
Tests:       12 passed, 12 total
```

### 4. Integration Testing

**Purpose**: Test complete workflows from form submission to email sending

```bash
# Run integration tests
npm run test:integration
```

**What's Tested**:
- Complete successful contact flow
- Error handling workflows
- Form validation integration
- Email utility integration
- User experience flows

**Example Test Run**:
```bash
$ npm run test:integration

> humza-portfolio@0.1.0 test:integration
> jest --testPathPatterns=contact-integration.test.tsx

 PASS  src/__tests__/contact-integration.test.tsx
  Contact Form Integration Tests
    Complete Contact Flow
      ✓ should handle complete successful contact flow (440ms)
      ✓ should handle complete error flow (215ms)
      ✓ should handle network error flow (180ms)
    Form Validation Integration
      ✓ should prevent submission with invalid data (117ms)
      ✓ should allow submission with valid data (204ms)
    Email Utils Integration
      ✓ should validate emails correctly in form context (4ms)
      ✓ should format email addresses correctly for Resend API
    User Experience Integration
      ✓ should show loading state during submission (422ms)
      ✓ should handle multiple inquiry types correctly (1142ms)

Test Suites: 1 passed, 1 total
Tests:       9 passed, 9 total
```

### 5. End-to-End Testing (Cypress)

**Purpose**: Test the complete user journey in a real browser

```bash
# Open Cypress test runner
npm run test:e2e:open

# Or run headless
npm run test:e2e
```

**What's Tested**:
- Real browser interactions
- Cross-browser compatibility
- Mobile responsiveness
- Accessibility features
- Network request handling

**Cypress Test Runner**:
1. Open Cypress: `npm run test:e2e:open`
2. Select "E2E Testing"
3. Choose your browser (Chrome recommended)
4. Click on `contact-form.cy.ts`
5. Watch tests run in real-time

## 🔍 Manual Testing Guide

### Step 1: Start Development Server
```bash
npm run dev
```

### Step 2: Navigate to Contact Form
- Open browser to `http://localhost:3000`
- Scroll to the contact section
- Verify form elements are visible

### Step 3: Test Form Validation

**Test Empty Form Submission**:
1. Click "Send Message" without filling any fields
2. Verify form doesn't submit
3. Check for validation messages

**Test Invalid Email**:
1. Fill name: "John Doe"
2. Fill email: "invalid-email"
3. Fill message: "Test message"
4. Click "Send Message"
5. Verify validation prevents submission

**Test Short Message**:
1. Fill name: "John Doe"
2. Fill email: "john@example.com"
3. Fill message: "Short"
4. Click "Send Message"
5. Verify validation prevents submission

### Step 4: Test Successful Submission

**Valid Form Submission**:
1. Fill name: "John Doe"
2. Fill email: "john.doe@example.com"
3. Select inquiry type: "Consulting Work"
4. Fill message: "I am interested in hiring you for a consulting project. Please let me know your availability and rates."
5. Click "Send Message"
6. Verify loading state appears
7. Verify success message shows
8. Verify form resets

### Step 5: Check Email Delivery

**Verify Email Received**:
1. Check your email inbox (CONTACT_TO_EMAIL)
2. Look for email with subject: "New contact: consulting from John Doe"
3. Verify email contains:
   - Sender information
   - Form data
   - Timestamp
   - Reply-to address

## 🛠️ Debugging Email Issues

### Common Issues and Solutions

**1. Email Not Sending**
```bash
# Check environment variables
echo $RESEND_API_KEY
echo $CONTACT_TO_EMAIL
echo $CONTACT_FROM_EMAIL

# Verify API key is valid
curl -X POST "https://api.resend.com/emails" \
  -H "Authorization: Bearer $RESEND_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"from":"test@example.com","to":["test@example.com"],"subject":"Test","text":"Test message"}'
```

**2. Validation Errors**
```bash
# Run specific validation tests
npm test -- --testNamePattern="should validate email format"

# Check email regex
node -e "
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
console.log('test@example.com:', EMAIL_REGEX.test('test@example.com'));
console.log('invalid-email:', EMAIL_REGEX.test('invalid-email'));
"
```

**3. API Route Issues**
```bash
# Test API route directly
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message with enough characters",
    "inquiryType": "general"
  }'
```

**4. Component Rendering Issues**
```bash
# Run component tests with verbose output
npm test -- --testNamePattern="renders contact form" --verbose

# Check for console errors
npm run dev
# Open browser dev tools and check console
```

## 📊 Test Coverage Analysis

### Run Coverage Report
```bash
npm run test:coverage
```

### Coverage Targets
- **Statements**: >95%
- **Branches**: >90%
- **Functions**: >95%
- **Lines**: >95%

### Coverage Report Example
```
File                    | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------------------|---------|----------|---------|---------|-------------------
All files               |   96.2  |   92.1   |   95.8  |   96.0  |
 email-utils.ts         |   100   |   100    |   100   |   100   |
 ContactSection.tsx     |   94.5  |   88.9   |   92.3  |   94.2  | 45,67,89
 route.ts               |   97.8  |   95.2   |   100   |   97.6  | 23
```

## 🚀 Continuous Integration

### GitHub Actions Workflow
```yaml
name: Email Functionality Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run unit tests
      run: npm run test:unit
    
    - name: Run component tests
      run: npm run test:component
    
    - name: Run API tests
      run: npm run test:api
    
    - name: Run integration tests
      run: npm run test:integration
    
    - name: Run E2E tests
      run: npm run test:e2e
      env:
        RESEND_API_KEY: ${{ secrets.RESEND_API_KEY }}
        CONTACT_TO_EMAIL: ${{ secrets.CONTACT_TO_EMAIL }}
```

## 📋 Testing Checklist

### Pre-Deployment Testing
- [ ] All unit tests pass
- [ ] All component tests pass
- [ ] All API tests pass
- [ ] All integration tests pass
- [ ] E2E tests pass in CI/CD
- [ ] Manual testing completed
- [ ] Email delivery verified
- [ ] Error handling tested
- [ ] Accessibility validated
- [ ] Mobile responsiveness checked

### Production Monitoring
- [ ] Email delivery rate monitoring
- [ ] Error rate tracking
- [ ] Performance metrics
- [ ] User feedback collection
- [ ] Analytics event tracking

## 🎯 Best Practices

### Test Writing
- Write descriptive test names
- Test one thing per test
- Use proper mocking
- Include edge cases
- Test error scenarios

### Test Maintenance
- Keep tests up to date
- Refactor tests with code changes
- Monitor test performance
- Regular dependency updates
- Coverage threshold enforcement

### Debugging
- Use console.log strategically
- Check browser dev tools
- Verify network requests
- Test with real data
- Monitor error logs

---

## 📞 Support

If you encounter issues with email functionality testing:

1. **Check the logs**: Look for error messages in console
2. **Verify environment**: Ensure all environment variables are set
3. **Test incrementally**: Start with unit tests, then move to integration
4. **Use debugging tools**: Browser dev tools, network tab, etc.
5. **Review documentation**: Check Resend API docs for service issues

The email functionality is thoroughly tested and ready for production use with confidence in its reliability and user experience.
