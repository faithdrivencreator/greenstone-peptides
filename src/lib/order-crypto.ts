/**
 * AES-256-GCM encryption for at-rest card data.
 *
 * Key: ORDER_CARD_ENCRYPTION_KEY env var — must be 32 bytes, base64-encoded.
 * Throws at module load if missing (fail-closed).
 *
 * Format:
 *   - 12-byte random IV per encryption (NIST-recommended for GCM)
 *   - 16-byte auth tag (default GCM tag length)
 *   - Ciphertext, IV, and tag are all base64-encoded for transport / storage.
 */

import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

const ALGO = 'aes-256-gcm';
const IV_LEN = 12;
const TAG_LEN = 16;

function loadKey(): Buffer {
  const raw = process.env.ORDER_CARD_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error(
      'ORDER_CARD_ENCRYPTION_KEY is not set. Generate one with `node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'base64\'))"` and add it to .env.local (and Netlify env).',
    );
  }
  const buf = Buffer.from(raw, 'base64');
  if (buf.length !== 32) {
    throw new Error(
      `ORDER_CARD_ENCRYPTION_KEY must decode to exactly 32 bytes (got ${buf.length}). Regenerate with base64-encoded 32-byte random.`,
    );
  }
  return buf;
}

// Lazy load so unit tests / build-time tooling don't crash if env is unset.
let KEY: Buffer | null = null;
function key(): Buffer {
  if (!KEY) KEY = loadKey();
  return KEY;
}

export interface EncryptedBlob {
  ciphertext: string; // base64
  iv: string;         // base64
  tag: string;        // base64
}

export interface CardPayload {
  pan: string;
  cvc: string;
  exp_month: number;
  exp_year: number;
  cardholder: string;
}

/**
 * Encrypt a CardPayload (or arbitrary string) using AES-256-GCM.
 * Returns the three base64-encoded pieces needed to decrypt.
 */
export function encryptCard(payload: CardPayload): EncryptedBlob {
  return encryptString(JSON.stringify(payload));
}

export function encryptString(plaintext: string): EncryptedBlob {
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGO, key(), iv, { authTagLength: TAG_LEN });
  const enc = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    ciphertext: enc.toString('base64'),
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
  };
}

/**
 * Decrypt an EncryptedBlob back into a parsed CardPayload.
 * Throws if the ciphertext is tampered with (GCM auth tag mismatch).
 */
export function decryptCard(blob: EncryptedBlob): CardPayload {
  const str = decryptString(blob);
  return JSON.parse(str) as CardPayload;
}

export function decryptString(blob: EncryptedBlob): string {
  const iv = Buffer.from(blob.iv, 'base64');
  const tag = Buffer.from(blob.tag, 'base64');
  const ct = Buffer.from(blob.ciphertext, 'base64');
  const decipher = createDecipheriv(ALGO, key(), iv, { authTagLength: TAG_LEN });
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(ct), decipher.final()]);
  return dec.toString('utf8');
}

/**
 * Derive a card brand label from the first digits of a PAN (BIN).
 * Plaintext-safe — the brand on its own is not sensitive.
 */
export function brandFromPan(pan: string): string {
  const d = pan.replace(/\D/g, '');
  if (/^4/.test(d)) return 'Visa';
  if (/^(5[1-5]|2[2-7])/.test(d)) return 'Mastercard';
  if (/^3[47]/.test(d)) return 'Amex';
  if (/^6(?:011|5)/.test(d)) return 'Discover';
  if (/^35(2[89]|[3-8])/.test(d)) return 'JCB';
  return 'Card';
}
