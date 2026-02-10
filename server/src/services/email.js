// Email service stub — implement with SendGrid, Resend, or SMTP in later phases

async function sendEmail({ to, subject, html }) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Email] To: ${to} | Subject: ${subject}`);
    console.log(`[Email] Body preview: ${html?.substring(0, 100)}...`);
    return { success: true, preview: true };
  }

  // TODO: Implement production email sending
  // Options: SendGrid, Resend, AWS SES, Nodemailer + SMTP
  throw new Error('Email service not configured for production');
}

module.exports = { sendEmail };
