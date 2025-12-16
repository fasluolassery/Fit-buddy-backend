import { env } from "../config/env.config";
import { mailTransporter } from "../config/mail.config";
import logger from "./logger.util";

export async function sendOtpMail(email: string, otp: string): Promise<void> {
  try {
    await mailTransporter.sendMail({
      from: env.MAIL_USER,
      to: email,
      subject: "verify your email",
      html: `
        <p>Your OTP is:</p>
        <h2>${otp}</h2>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    });
  } catch (err) {
    logger.error("Failed to send OTP email" + err);
    throw new Error("Email sending failed");
  }
}
