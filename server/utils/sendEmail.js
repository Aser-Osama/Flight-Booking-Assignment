const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

const sendEmail = async ({ to, subject, text, html }) => {
  return transporter.sendMail({
    from: '"Flight Booking" <no-reply@flightbooking.local>',
    to,
    subject,
    text,
    html,
  });
};

module.exports = sendEmail;
