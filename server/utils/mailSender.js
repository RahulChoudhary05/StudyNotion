// utils/mailSender.js

const nodemailer = require("nodemailer");
require("dotenv").config();

console.log("MAIL_HOST:", process.env.MAIL_HOST);
console.log("MAIL_USER:", process.env.MAIL_USER);
console.log("MAIL_PASS:", process.env.MAIL_PASS);

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Send mail
    let info = await transporter.sendMail({
      from: `"StudyNotion || Rahul Choudhary" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log("Email sent successfully:", info);
    return info;
  } catch (error) {
    console.log("Error occurred while sending email:", error.message);
    throw error;
  }
};

module.exports = mailSender;
