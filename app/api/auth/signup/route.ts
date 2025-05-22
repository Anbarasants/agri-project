import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { sendOTP } from '@/lib/emailService';

export async function POST(req: Request) {
  try {
    const { username, email, password, phone, address } = await req.json();

    // Connect to database
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with OTP
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      phone,
      address,
      otp: {
        code: otp,
        expiresAt: otpExpiresAt,
      },
    });

    // Send OTP via email
    const emailSent = await sendOTP(email, otp);
    if (!emailSent) {
      await User.deleteOne({ _id: user._id });
      return NextResponse.json(
        { error: 'Failed to send OTP email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'User created successfully. Please verify your email.',
      userId: user._id,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 