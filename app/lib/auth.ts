import crypto from "crypto";
import { cookies } from "next/headers";

export function getSessionHash(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function verifyAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("oryx_admin_session")?.value;
    if (!token) return false;

    const expectedPassword = process.env.ADMIN_PASSWORD;
    if (!expectedPassword) return false;

    const expectedHash = getSessionHash(expectedPassword);
    return token === expectedHash;
  } catch (error) {
    console.error("Auth verification error:", error);
    return false;
  }
}
