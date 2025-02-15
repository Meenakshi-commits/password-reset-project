const nodemailer = require('nodemailer');

async function sendTestEmail() {
  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',  // or fetch these from your DB for testing
    port: 587,
    auth: {
      user: 'your_dummy_email@ethereal.email',
      pass: 'VWct5jXrZ64zgJTn6p'
    }
  });

  try {
    let info = await transporter.sendMail({
      from: 'no-reply@dummyapp.com',
      to: 'recipient@example.com',
      subject: 'Test Email',
      text: 'This is a test email.'
    });
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending test email:', error);
  }
}

sendTestEmail();
