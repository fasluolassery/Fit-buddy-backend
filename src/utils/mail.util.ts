import { InternalServerError } from "../common/errors/internal-server.error";
import { env } from "../config/env.config";
import { mailTransporter } from "../config/mail.config";
import logger from "./logger.util";

export async function sendOtpMail(email: string, otp: string): Promise<void> {
  try {
    await mailTransporter.sendMail({
      from: env.MAIL_USER,
      to: email,
      subject: "Verify your email",
      html: `
        <p>Your email verification OTP:</p>
        <h2>${otp}</h2>
        <p>Valid for 5 minutes.</p>
      `,
    });
  } catch (err) {
    logger.error("Verify email OTP failed" + err);
    throw new InternalServerError("Email sending failed");
  }
}

export async function sendResetPasswordOtp(
  email: string,
  otp: string,
): Promise<void> {
  try {
    await mailTransporter.sendMail({
      from: env.MAIL_USER,
      to: email,
      subject: "Reset your password",
      html: `
        <p>Password reset OTP:</p>
        <h2>${otp}</h2>
        <p>This OTP expires in 5 minutes.</p>
        <p>If you did not request this, ignore this email.</p>
      `,
    });
  } catch (err) {
    logger.error("Reset password OTP failed" + err);
    throw new InternalServerError("Email sending failed");
  }
}

export async function sendResetPasswordLink(
  email: string,
  link: string,
  time: number,
): Promise<void> {
  try {
    const html = `
    <p>You requested a password reset.</p>
    <p>This link is valid for ${time} minutes.</p>
    <a href="${link}">Reset Password</a>
    <p>If you didn’t request this, ignore this email.</p>
  `;

    await mailTransporter.sendMail({
      from: env.MAIL_USER,
      to: email,
      subject: "Reset your password",
      html,
    });
  } catch (err) {
    logger.error("Reset password link failed" + err);
    throw new InternalServerError("Email sending failed");
  }
}
