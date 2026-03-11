const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

const sendVerificationEmail = async (email, code) => {
  return transporter.sendMail({
    from: '"Flight Booking" <no-reply@flightbooking.local>',
    to: email,
    subject: "Verify your email",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
        <h2>Email Verification</h2>
        <p>Your verification code is:</p>
        <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px; margin: 12px 0;">${code}</p>
        <p>This code expires in 10 minutes.</p>
      </div>
    `,
  });
};

module.exports = sendVerificationEmail;
