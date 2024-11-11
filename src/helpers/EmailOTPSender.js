import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Create a transporter object using Gmail's SMTP server with TLS
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // Use Gmail's service
    host: 'smtp.gmail.com', // Gmail's SMTP server
    port: 587, // TLS port (587)
    secure: false, // false for TLS (use true for SSL on port 465)
    auth: {
      user: process.env.USER,  // Your Gmail address
      pass: process.env.PASSWORD,  // Your App Password (NOT your regular Gmail password)
    },
    tls: {
      rejectUnauthorized: true, // Ensures that the connection is secured
    }
  });
};

// Function to send an OTP email
export const sendOTPEmail = async (email, otp) => {
  // Define the mail options (the email content)
  const mailOptions = {
    from: process.env.USER,  // Sender's email (your Gmail address)
    to: email,  // Recipient's email address
    subject: 'Your OTP',  // Subject of the email
    text: `Your OTP code is ${otp}`,  // OTP message
  };

  const transporter = createTransporter();

  try {
    // Send the email
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.responseCode === 534) {
      console.error('Authentication failed. Please check your email and app password.');
    }
  }
};
