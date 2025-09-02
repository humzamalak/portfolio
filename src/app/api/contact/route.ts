import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { isValidEmail, formatEmailAddress, getResendErrorMessage } from '@/lib/email-utils';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  inquiryType: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    
    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const toAddress = process.env.CONTACT_TO_EMAIL || 'humzatmalak@gmail.com';
    
    // Use verified domain or fallback to Resend's verified domain
    const fromEmail = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev';
    const fromName = process.env.CONTACT_FROM_NAME || 'Portfolio Contact';

    if (!resendApiKey) {
      console.error('Missing RESEND_API_KEY');
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
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

      return NextResponse.json(
        { message: 'Contact form submitted successfully', id: result?.data?.id || `contact_${Date.now()}` },
        { status: 200 }
      );
    } catch (sendError: unknown) {
      console.error('Failed to send contact email:', sendError);
      console.error('Send error details:', JSON.stringify(sendError, null, 2));
      
      const userFriendlyError = getResendErrorMessage(sendError);
      
      // Type guard for error objects with message property
      const errorMessage = sendError && typeof sendError === 'object' && 'message' in sendError 
        ? String(sendError.message) 
        : 'Unknown error occurred';
      
      // Handle specific Resend errors
      if (errorMessage.includes('Invalid `from` field')) {
        return NextResponse.json({ 
          error: userFriendlyError,
          details: 'The from email address needs to be verified with Resend'
        }, { status: 422 });
      }
      
      if (errorMessage.includes('Unauthorized')) {
        return NextResponse.json({ 
          error: userFriendlyError,
          details: 'Please check your Resend API key'
        }, { status: 401 });
      }
      
      return NextResponse.json({ 
        error: userFriendlyError,
        details: errorMessage
      }, { status: 502 });
    }

  } catch (error: unknown) {
    console.error('Contact form error:', error);
    
    // Type guard for error objects with message property
    const errorMessage = error && typeof error === 'object' && 'message' in error 
      ? String(error.message) 
      : 'Unknown error';
    
    if (errorMessage.includes('Invalid email format')) {
      return NextResponse.json(
        { error: 'Invalid email format provided' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}
