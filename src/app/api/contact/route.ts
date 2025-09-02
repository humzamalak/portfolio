import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

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
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const toAddress = process.env.CONTACT_TO_EMAIL || 'humzatmalak@gmail.com';
    const fromAddress = (process.env.CONTACT_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>').replace(/^"|"$/g, '');

    if (!resendApiKey) {
      console.error('Missing RESEND_API_KEY');
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    const resend = new Resend(resendApiKey);

    const subject = `New contact: ${body.inquiryType || 'general'} from ${body.name}`;
    const text = `
Name: ${body.name}
Email: ${body.email}
Type: ${body.inquiryType}
Time: ${new Date().toISOString()}

Message:
${body.message}
`;

    try {
      console.log('Attempting to send email with:', {
        from: fromAddress,
        to: toAddress,
        replyTo: body.email,
        subject
      });

      const result = await resend.emails.send({
        from: fromAddress,
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
    } catch (sendError) {
      console.error('Failed to send contact email:', sendError);
      console.error('Send error details:', JSON.stringify(sendError, null, 2));
      return NextResponse.json({ error: 'Failed to send email' }, { status: 502 });
    }

  } catch (error) {
    console.error('Contact form error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
