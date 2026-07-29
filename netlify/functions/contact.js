const { Resend } = require('resend');

// Email validation utilities
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const formatEmailAddress = (email, name) => {
  if (name && name.trim()) {
    return `${name.trim()} <${email}>`;
  }
  return email;
};

const getResendErrorMessage = (error) => {
  if (error && typeof error === 'object' && error.message) {
    const message = error.message.toLowerCase();
    
    if (message.includes('invalid `from` field') || message.includes('from email')) {
      return 'Email configuration error. Please contact the administrator.';
    }
    if (message.includes('unauthorized') || message.includes('api key')) {
      return 'Email service authentication failed. Please try again later.';
    }
    if (message.includes('rate limit') || message.includes('too many requests')) {
      return 'Too many requests. Please wait a moment before trying again.';
    }
    if (message.includes('domain') || message.includes('verification')) {
      return 'Email domain verification required. Please contact the administrator.';
    }
  }
  
  return 'Failed to send email. Please try again later.';
};

exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    
    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Missing required fields: name, email, and message are required'
        }),
      };
    }

    // Validate email format
    if (!isValidEmail(body.email)) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Invalid email format'
        }),
      };
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const toAddress = process.env.CONTACT_TO_EMAIL || 'humzatmalak@gmail.com';
    
    // Use verified domain or fallback to Resend's verified domain
    const fromEmail = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev';
    const fromName = process.env.CONTACT_FROM_NAME || 'Portfolio Contact';

    if (!resendApiKey) {
      console.error('Missing RESEND_API_KEY');
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Email service not configured'
        }),
      };
    }

    const resend = new Resend(resendApiKey);

    const subject = `New contact: ${body.inquiryType || 'general'} from ${body.name}`;
    const text = `
Name: ${body.name}
Email: ${body.email}
Type: ${body.inquiryType || 'general'}
Time: ${new Date().toISOString()}

Message:
${body.message}
`;

    try {
      // Format the from address properly
      const formattedFrom = formatEmailAddress(fromEmail, fromName);
      
      console.log('Attempting to send email with:', {
        from: formattedFrom,
        to: toAddress,
        replyTo: body.email,
        subject
      });

      const result = await resend.emails.send({
        from: formattedFrom,
        to: [toAddress],
        replyTo: body.email,
        subject,
        text,
      });

      console.log('Resend response:', JSON.stringify(result, null, 2));
      console.log('Contact email sent:', { id: result?.data?.id });

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Contact form submitted successfully',
          id: result?.data?.id || `contact_${Date.now()}`
        }),
      };
    } catch (sendError) {
      console.error('Failed to send contact email:', sendError);
      console.error('Send error details:', JSON.stringify(sendError, null, 2));
      
      const userFriendlyError = getResendErrorMessage(sendError);
      
      // Type guard for error objects with message property
      const errorMessage = sendError && typeof sendError === 'object' && 'message' in sendError 
        ? String(sendError.message) 
        : 'Unknown error occurred';
      
      // Handle specific Resend errors
      if (errorMessage.includes('Invalid `from` field')) {
        return {
          statusCode: 422,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            error: userFriendlyError,
            details: 'The from email address needs to be verified with Resend'
          }),
        };
      }
      
      if (errorMessage.includes('Unauthorized')) {
        return {
          statusCode: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            error: userFriendlyError,
            details: 'Please check your Resend API key'
          }),
        };
      }
      
      return {
        statusCode: 502,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: userFriendlyError,
          details: errorMessage
        }),
      };
    }

  } catch (error) {
    console.error('Contact form error:', error);
    
    // Type guard for error objects with message property
    const errorMessage = error && typeof error === 'object' && 'message' in error 
      ? String(error.message) 
      : 'Unknown error';
    
    if (errorMessage.includes('Invalid email format')) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Invalid email format provided'
        }),
      };
    }
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Internal server error',
        details: errorMessage
      }),
    };
  }
};