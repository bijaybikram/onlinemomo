const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  var transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.OTP_EMAIL,
      pass: process.env.OTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: '"Onlinemomo 👻" <becauseiam33@gmail.com>', // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: `Your OTP is ${options.otp}`, // plain text body
  };
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
