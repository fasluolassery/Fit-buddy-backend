import crypto from "crypto";

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function generateResetToken(): {
  rawToken: string;
  tokenHash: string;
} {
  const rawToken = crypto.randomBytes(32).toString("hex");

  const tokenHash = hashToken(rawToken);

  return { rawToken, tokenHash };
}
