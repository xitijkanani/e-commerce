import { decodeBase64 } from "@oslojs/encoding";
import { createCipheriv } from "crypto";
import { DynamicBuffer } from "@oslojs/binary";

const key = decodeBase64(process.env.ENCRYPTION_KEY ?? "");

export function encrypt(data: Uint8Array) {
  const iv = new Uint8Array(16);
  crypto.getRandomValues(iv);

  const cipher = createCipheriv("aes-128-gcm", key, iv);
  const encrypted = new DynamicBuffer(0);

  encrypted.write(iv);
  encrypted.write(cipher.update(data));
  encrypted.write(cipher.final());
  encrypted.write(cipher.getAuthTag());

  return encrypted.bytes();
}

export function encryptString(data: string) {
  return encrypt(new TextEncoder().encode(data));
}
