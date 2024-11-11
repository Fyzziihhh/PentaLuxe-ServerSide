import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Create a transporter object using Gmail's SMTP server with TLS
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // Use Gmail's service
    port: 587,
    secure: true,
    requireTLS: true, 
    auth: {
      user: process.env.USER, 
      pass: process.env.PASSWORD, 
    },
  
  });
};

// Function to send an OTP email
export const sendOTPEmail = async (email, otp) => {
  // Define the mail options (the email content)
  const mailOptions = {
    from: process.env.USER,  
    to: email,  
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
