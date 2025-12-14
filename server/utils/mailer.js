const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendOtpEmail(to, otp) {
  const html = `
    <div>
      <h2>Your verification code</h2>
      <p>Use this code to verify your email: <strong>${otp}</strong></p>
    </div>
  `;
  return transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: 'Your OTP code',
    html
  });
}

module.exports = { sendOtpEmail };
