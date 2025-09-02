# Resend Email Setup Guide

## Overview
This guide helps you set up Resend for sending emails from your portfolio contact form.

## Current Issue
The 422 validation error occurs because:
1. **Domain not verified**: `humzamalak.dev` domain isn't verified with Resend
2. **Invalid from format**: The email format needs proper validation
3. **Missing configuration**: Environment variables need proper setup

## Quick Fix (Immediate Solution)

### 1. Use Resend's Verified Domain
For immediate functionality, use Resend's verified domain:

```bash
# In your .env.local file
RESEND_API_KEY=your-resend-api-key
CONTACT_TO_EMAIL=humzatmalak@gmail.com
CONTACT_FROM_EMAIL=onboarding@resend.dev
CONTACT_FROM_NAME=Portfolio Contact
```

### 2. Test the Fix
The corrected request format will be:
```json
{
  "from": "Portfolio Contact <onboarding@resend.dev>",
  "reply_to": "humzatmalak@gmail.com",
  "subject": "New contact: general from testing",
  "text": "Name: testing\nEmail: humzatmalak@gmail.com\nType: general\nTime: 2025-09-02T18:33:50.303Z",
  "to": ["humzatmalak@gmail.com"]
}
```

## Complete Domain Verification Setup

### Step 1: Sign Up for Resend
1. Go to [resend.com](https://resend.com)
2. Create an account
3. Get your API key from the dashboard

### Step 2: Add Your Domain
1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter: `humzamalak.dev`
4. Click **Add Domain**

### Step 3: Configure DNS Records
Resend will provide DNS records to add to your domain provider:

#### For Cloudflare (recommended):
1. Go to Cloudflare dashboard
2. Select `humzamalak.dev` domain
3. Go to **DNS** tab
4. Add these records:

```
Type: TXT
Name: @
Content: resend-verification=your-verification-code
TTL: Auto

Type: CNAME
Name: resend
Content: track.resend.com
TTL: Auto
```

#### For other providers:
Add the same records provided by Resend.

### Step 4: Verify Domain
1. Wait 5-10 minutes for DNS propagation
2. In Resend dashboard, click **Verify** on your domain
3. Status should change to "Verified"

### Step 5: Update Environment Variables
Once verified, update your `.env.local`:

```bash
RESEND_API_KEY=your-resend-api-key
CONTACT_TO_EMAIL=humzatmalak@gmail.com
CONTACT_FROM_EMAIL=contact@humzamalak.dev
CONTACT_FROM_NAME=Portfolio Contact
```

## Email Validation Features Added

### 1. Frontend Validation
- Real-time email format validation
- Required field validation
- User-friendly error messages

### 2. Backend Validation
- RFC 5322 compliant email regex
- Proper email formatting for Resend
- Comprehensive error handling

### 3. Error Handling
- Specific error messages for different issues
- Graceful fallback to verified domains
- Detailed logging for debugging

## Testing Your Setup

### 1. Test with Verified Domain
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message",
    "inquiryType": "general"
  }'
```

### 2. Check Response
Success response:
```json
{
  "message": "Contact form submitted successfully",
  "id": "email_id_here"
}
```

Error response:
```json
{
  "error": "Email configuration error: Please verify your domain with Resend",
  "details": "The from email address needs to be verified with Resend"
}
```

## Troubleshooting

### Common Issues

1. **422 Validation Error**
   - Domain not verified with Resend
   - Invalid email format
   - Solution: Use `onboarding@resend.dev` temporarily

2. **401 Unauthorized**
   - Invalid API key
   - Solution: Check your `RESEND_API_KEY`

3. **DNS Issues**
   - DNS records not propagated
   - Solution: Wait 10-15 minutes, check DNS propagation

### Debug Steps

1. Check environment variables:
```bash
echo $RESEND_API_KEY
echo $CONTACT_FROM_EMAIL
```

2. Test API directly:
```bash
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer $RESEND_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "Portfolio Contact <onboarding@resend.dev>",
    "to": ["humzatmalak@gmail.com"],
    "subject": "Test",
    "text": "Test message"
  }'
```

3. Check Resend dashboard for:
   - Domain verification status
   - API key validity
   - Email delivery logs

## Best Practices

1. **Always use verified domains** for production
2. **Implement rate limiting** to prevent abuse
3. **Log email attempts** for debugging
4. **Use environment variables** for configuration
5. **Test thoroughly** before deployment

## Next Steps

1. ✅ Fix immediate issue with `onboarding@resend.dev`
2. 🔄 Verify `humzamalak.dev` domain with Resend
3. 🔄 Update to use verified domain
4. 🔄 Add email templates for better formatting
5. 🔄 Implement email tracking and analytics
