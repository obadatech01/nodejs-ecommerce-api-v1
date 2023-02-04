const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create transporter ( service that will send email like: gmail, Mailgun, mailtrap, sendGrid)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PROT, // if secure false port=587, if false port=465
    secure: true,
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    }
  });

  // 2) Define email options (like: from, to, subject, content)
  const mailOptions = {
    from: 'E-shop App <progobadaabumusameh@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  // 3) Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;