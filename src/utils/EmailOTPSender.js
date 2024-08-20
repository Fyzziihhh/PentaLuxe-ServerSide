import nodemailer from 'nodemailer';

// Create a transporter object
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587, // Use 465 if you want a fully secure connection
    secure: false, // Use true for 465, false for 587
    auth: {
      user: process.env.USER, // Your email address
      pass: process.env.PASSWORD, // Your App Password
    },
  });
};

// Function to send an email
export const sendOTPEmail = async (email, otp) => {
  // Define email options
  const mailOptions = {
    from: process.env.USER,
    to: email,
    subject: 'Your OTP',
    text: `Your OTP code is ${otp}`, // Add some context to the OTP message
  };

  // Create a transporter
  const transporter = createTransporter();

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
