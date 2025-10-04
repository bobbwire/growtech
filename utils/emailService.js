const nodemailer = require('nodemailer');

// Create transporter - FIXED THE METHOD NAME
const createTransporter = () => {
  return nodemailer.createTransport({ // Changed from createTransporter to createTransport
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Email template for application notification
const createApplicationEmailTemplate = (application) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 15px; }
        .field-label { font-weight: bold; color: #555; }
        .field-value { color: #333; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Course Application Received</h1>
        </div>
        <div class="content">
          <p>A new application has been submitted for the course:</p>
          
          <div class="field">
            <div class="field-label">Course:</div>
            <div class="field-value">${application.courseTitle}</div>
          </div>
          
          <div class="field">
            <div class="field-label">Applicant Name:</div>
            <div class="field-value">${application.name}</div>
          </div>
          
          <div class="field">
            <div class="field-label">Email:</div>
            <div class="field-value">${application.email}</div>
          </div>
          
          <div class="field">
            <div class="field-label">Phone:</div>
            <div class="field-value">${application.phone}</div>
          </div>
          
          <div class="field">
            <div class="field-label">Message:</div>
            <div class="field-value">${application.message}</div>
          </div>
          
          <div class="field">
            <div class="field-label">Submitted On:</div>
            <div class="field-value">${new Date(application.createdAt).toLocaleString()}</div>
          </div>
        </div>
        <div class="footer">
          <p>This is an automated notification from your course application system.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send application email
const sendApplicationEmail = async (application) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Application: ${application.courseTitle}`,
      html: createApplicationEmailTemplate(application)
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Application email sent successfully:', result.messageId);
    return result;
    
  } catch (error) {
    console.error('Error sending application email:', error);
    throw error;
  }
};

// Optional: Send confirmation email to applicant
const sendConfirmationEmail = async (application) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: application.email,
      subject: `Application Received - ${application.courseTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Application Received!</h1>
            </div>
            <div class="content">
              <p>Dear ${application.name},</p>
              <p>Thank you for your interest in <strong>${application.courseTitle}</strong>!</p>
              <p>We have successfully received your application and will review it shortly. Our team will contact you within 2-3 business days.</p>
              <p>If you have any urgent questions, please don't hesitate to contact us.</p>
              <br>
              <p>Best regards,<br>Course Team</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent successfully:', result.messageId);
    return result;
    
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
};

module.exports = {
  sendApplicationEmail,
  sendConfirmationEmail
};