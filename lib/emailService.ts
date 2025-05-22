import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'amudhavanm339@gmail.com',
    pass: 'gfek hlva zmpa dmnx'
  }
});

export const sendOTP = async (email: string, otp: string) => {
  try {
    await transporter.sendMail({
      from: 'amudhavanm339@gmail.com',
      to: email,
      subject: 'OTP Verification - Jayam Machinery',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>OTP Verification</h2>
          <p>Your OTP for Jayam Machinery account verification is:</p>
          <h1 style="font-size: 32px; letter-spacing: 5px; text-align: center; padding: 20px; background-color: #f5f5f5; border-radius: 5px;">${otp}</h1>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this OTP, please ignore this email.</p>
        </div>
      `
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}; 