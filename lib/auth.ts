import { cookies } from 'next/headers';
import crypto from 'crypto';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';
const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'change-this-secret-key-in-production';

// Session duration: 24 hours
const SESSION_DURATION = 24 * 60 * 60 * 1000;

export function generateSessionToken(username: string): string {
  // Create a secure token with embedded expiration and signature
  const expiration = Date.now() + SESSION_DURATION;
  const tokenData = `${username}:${expiration}`;

  // Sign the token with HMAC
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(tokenData)
    .digest('hex');

  // Combine data and signature
  return Buffer.from(`${tokenData}:${signature}`).toString('base64');
}

export function validateSessionToken(token: string): { valid: boolean; username?: string } {
  try {
    // Decode the token
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split(':');

    if (parts.length !== 3) {
      return { valid: false };
    }

    const [username, expirationStr, signature] = parts;
    const expiration = parseInt(expirationStr, 10);

    // Check if expired
    if (Date.now() > expiration) {
      return { valid: false };
    }

    // Verify signature
    const tokenData = `${username}:${expirationStr}`;
    const expectedSignature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(tokenData)
      .digest('hex');

    if (signature !== expectedSignature) {
      return { valid: false };
    }

    return { valid: true, username };
  } catch (error) {
    return { valid: false };
  }
}

export async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return false;
  }

  const result = validateSessionToken(sessionCookie.value);
  return result.valid;
}

export function validateCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}
