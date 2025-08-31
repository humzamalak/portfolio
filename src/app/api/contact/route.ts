import { NextRequest, NextResponse } from 'next/server';

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

    // Mock processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real implementation, you would:
    // 1. Save to database
    // 2. Send email notification
    // 3. Log the contact request
    // 4. Integrate with CRM if needed

    console.log('Contact form submission:', {
      name: body.name,
      email: body.email,
      inquiryType: body.inquiryType,
      message: body.message.substring(0, 100) + '...', // Log truncated message
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      { 
        message: 'Contact form submitted successfully',
        id: `contact_${Date.now()}`
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
