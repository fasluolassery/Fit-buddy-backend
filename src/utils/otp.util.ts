import crypto from "crypto";

export function generateOtp(): string {
  const min = 100000;
  const max = 1000000;
  return crypto.randomInt(min, max).toString();
}
