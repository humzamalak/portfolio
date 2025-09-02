/**
 * Email validation and formatting utilities for Resend API
 */

// RFC 5322 compliant email regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * Validates email format
 * @param email - Email address to validate
 * @returns boolean indicating if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  return EMAIL_REGEX.test(email.trim());
};

/**
 * Formats email address for Resend API
 * @param email - Email address
 * @param name - Optional display name
 * @returns Properly formatted email string
 */
export const formatEmailAddress = (email: string, name?: string): string => {
  const cleanEmail = email.trim();
  
  if (!isValidEmail(cleanEmail)) {
    throw new Error('Invalid email format');
  }
  
  if (name) {
    // Escape special characters in name and remove quotes
    const escapedName = name.replace(/[<>"]/g, '').trim();
    return `${escapedName} <${cleanEmail}>`;
  }
  
  return cleanEmail;
};

/**
 * Validates and formats email addresses for Resend API
 * @param fromEmail - Sender email
 * @param fromName - Sender name
 * @param toEmails - Recipient emails (array)
 * @param replyTo - Reply-to email
 * @returns Object with formatted email addresses
 */
export const validateAndFormatEmails = ({
  fromEmail,
  fromName,
  toEmails,
  replyTo
}: {
  fromEmail: string;
  fromName?: string;
  toEmails: string[];
  replyTo?: string;
}) => {
  // Validate from email
  if (!isValidEmail(fromEmail)) {
    throw new Error('Invalid from email address');
  }

  // Validate to emails
  const validToEmails = toEmails.filter(email => isValidEmail(email));
  if (validToEmails.length === 0) {
    throw new Error('At least one valid recipient email is required');
  }

  // Validate reply-to if provided
  if (replyTo && !isValidEmail(replyTo)) {
    throw new Error('Invalid reply-to email address');
  }

  return {
    from: formatEmailAddress(fromEmail, fromName),
    to: validToEmails,
    replyTo: replyTo ? formatEmailAddress(replyTo) : undefined
  };
};

/**
 * Common Resend error messages and their user-friendly equivalents
 */
export const RESEND_ERROR_MESSAGES = {
  'Invalid `from` field': 'Email configuration error: Please verify your domain with Resend',
  'Unauthorized': 'Email service authentication failed: Please check your API key',
  'Domain not verified': 'Your domain needs to be verified with Resend before sending emails',
  'Rate limit exceeded': 'Too many email requests. Please try again later',
  'Invalid recipient': 'One or more recipient email addresses are invalid'
} as const;

/**
 * Converts Resend error to user-friendly message
 * @param error - Resend error object
 * @returns User-friendly error message
 */
export const getResendErrorMessage = (error: any): string => {
  const message = error?.message || '';
  
  for (const [key, value] of Object.entries(RESEND_ERROR_MESSAGES)) {
    if (message.includes(key)) {
      return value;
    }
  }
  
  return 'Failed to send email. Please try again later.';
};
