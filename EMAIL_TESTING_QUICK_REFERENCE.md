# Email Testing Quick Reference

## 🚀 Quick Commands

```bash
# Run all tests
npm run test:all

# Individual test suites
npm run test:unit          # Email utilities
npm run test:component     # React form
npm run test:api          # Backend API
npm run test:integration  # End-to-end flows
npm run test:e2e          # Browser testing

# Development
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

## 🔧 Environment Setup

```bash
# Required environment variables
RESEND_API_KEY=re_xxxxxxxxx
CONTACT_TO_EMAIL=your@email.com
CONTACT_FROM_EMAIL=noreply@yourdomain.com
CONTACT_FROM_NAME=Your Portfolio
```

## 🧪 Test Scenarios

### 1. Email Validation
```bash
# Test email format validation
npm test -- --testNamePattern="should validate email format"

# Expected: Valid emails pass, invalid emails fail
# Valid: test@example.com, user.name@domain.co.uk
# Invalid: invalid-email, @example.com, test@
```

### 2. Form Submission
```bash
# Test successful form submission
npm test -- --testNamePattern="should submit form with valid data"

# Expected: Form submits, success message shows, form resets
```

### 3. Error Handling
```bash
# Test API error handling
npm test -- --testNamePattern="should handle Resend send error"

# Expected: User-friendly error messages, form data preserved
```

### 4. API Integration
```bash
# Test Resend API integration
npm test -- --testNamePattern="should send email successfully"

# Expected: Email sent via Resend, proper response format
```

## 🐛 Common Issues & Fixes

| Issue | Symptom | Solution |
|-------|---------|----------|
| Email not sending | Form submits but no email | Check RESEND_API_KEY |
| Validation fails | Form won't submit | Check email format |
| API errors | 500 server error | Verify environment variables |
| Tests fail | Jest errors | Run `npm install` |

## 📊 Test Results

**Expected Results:**
- Unit Tests: 22/22 passing
- API Tests: 10/10 passing  
- Component Tests: 12/12 passing
- Integration Tests: 9/9 passing
- E2E Tests: 8/8 passing

**Total: 61 tests passing**

## 🔍 Manual Testing

1. **Start dev server**: `npm run dev`
2. **Open browser**: `http://localhost:3000`
3. **Fill form** with valid data
4. **Submit form** and verify success
5. **Check email** in your inbox
6. **Test error cases** (invalid email, empty fields)

## 📈 Coverage Targets

- Statements: >95%
- Branches: >90%
- Functions: >95%
- Lines: >95%

Run `npm run test:coverage` to check current coverage.
