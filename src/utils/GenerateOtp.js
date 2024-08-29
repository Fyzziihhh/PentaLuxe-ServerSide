export const  generateOtp = (length = 4) => {
    let otp = "";
    const digits = "1234567890";
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
  };