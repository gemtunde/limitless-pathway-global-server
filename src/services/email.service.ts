import nodemailer from "nodemailer";
import config from "../config/env";

const transporter = nodemailer.createTransport({
  service: config.email.service,
  host: config.email.host,
  port: config.email.port,
  secure: config.email.secure,
  auth: {
    user: config.email.auth.user,
    pass: config.email.auth.pass,
  },
});

export const sendEmailVerification = async (
  email: string,
  token: string,
  firstName: string
) => {
  try {
    const verificationUrl = `${config.app.baseUrl}/verify-email?token=${token}`;

    await transporter.sendMail({
      from: config.email.from,
      to: email,
      subject: "onboard and Verify Your Email - Limitless Global Pathways",
      html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <h2 style="color: #2563eb;">Welcome to Limitless Global Pathways, ${firstName}!</h2>
        <p>Thank you for registering with Limitless Global Pathways. Please verify your email address to complete your registration.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p>If you didn't create an account with Limitless Global Pathways, please ignore this email.</p>
        <p>This link will expire in 24 hours.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          Best regards,<br>
          The Limitless Global Pathways Team
        </p>
      </div>
    `,
    });
  } catch (error) {
    throw error;
  }
};

export const sendPasswordResetEmail = async (
  email: string,
  firstName: string,
  token: string
) => {
  try {
    const resetUrl = `${config.app.baseUrl}/admin/auth/reset-password/${token}`;

    await transporter.sendMail({
      from: config.email.from,
      to: email,
      subject: "Password Reset - Limitless Global Pathways",
      html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <h2 style="color: #2563eb;">Password Reset Request</h2>
        <p>Hi ${firstName},</p>
        <p>We received a request to reset your password for your Limitless Global Pathways account.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p>This link will expire in 30 minutes.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          Best regards,<br>
          The Limitless Global Pathways Team
        </p>
      </div>
    `,
    });
  } catch (error) {
    throw error;
  }
};

export const sendVerificationSMS = async (
  email: string,
  code: string,
  firstName: string,
  operation: string,
  isSmsViaEmail: boolean = false
): Promise<void> => {
  const operationText =
    operation === "send_money" ? "money transfer" : "wallet funding";
  const subject = isSmsViaEmail
    ? `SMS Verification Code - ${code}`
    : `Verification Code - ${code}`;

  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: email,
    subject,
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <h2 style="color: #2563eb;">Transaction Verification</h2>
        <p>Hi ${firstName},</p>
        <p>Please use the following verification code to confirm your ${operationText}:</p>
        
        <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f3f4f6; border-radius: 8px;">
          <h1 style="color: #1f2937; font-size: 32px; letter-spacing: 8px; margin: 0; font-family: monospace;">
            ${code}
          </h1>
        </div>
        
        <p style="color: #dc2626; font-weight: bold;">This code will expire in 10 minutes.</p>
        
        ${
          isSmsViaEmail
            ? `
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="color: #92400e; margin: 0; font-size: 14px;">
              <strong>Note:</strong> This is a demo SMS sent via email. In production, this would be sent to your phone number.
            </p>
          </div>
        `
            : ""
        }
        
        <p>If you didn't initiate this ${operationText}, please contact our support team immediately.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          Best regards,<br>
          The Limitless Global Pathways Team
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
