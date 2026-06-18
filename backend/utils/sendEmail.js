const nodemailer = require('nodemailer');

/**
 * Send an email using Nodemailer or log to console in development.
 * @param {Object} options - Email options
 * @param {string} options.email - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.message - Plain text message body
 * @param {string} [options.html] - HTML body
 */
const sendEmail = async (options) => {
  const hasSMTPConfig = process.env.EMAIL_USER && process.env.EMAIL_PASS;

  if (!hasSMTPConfig) {
    console.log('\n==================================================');
    console.log('📧 DEV MODE: EMAIL SIMULATION');
    console.log(`TO:      ${options.email}`);
    console.log(`SUBJECT: ${options.subject}`);
    console.log('--------------------------------------------------');
    console.log(options.message);
    console.log('==================================================\n');
    return { success: true, simulated: true };
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM || `"Pelawahak.com" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
  return { success: true };
};

module.exports = sendEmail;
