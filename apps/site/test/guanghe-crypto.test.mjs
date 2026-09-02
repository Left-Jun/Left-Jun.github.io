import assert from "node:assert/strict";
import crypto from "node:crypto";
import test from "node:test";

const password = "fixture-password-for-tests";
const salt = Buffer.alloc(16, 7);
const key = crypto.pbkdf2Sync(password, salt, 10_000, 32, "sha256");

function seal(value, aad) {
  const iv = Buffer.alloc(12, 3);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  cipher.setAAD(Buffer.from(aad));
  const ciphertext = Buffer.concat([cipher.update(Buffer.from(value)), cipher.final(), cipher.getAuthTag()]);
  return { iv: iv.toString("base64"), ciphertext: ciphertext.toString("base64"), aad };
}

function open(envelope, candidate) {
  const candidateKey = crypto.pbkdf2Sync(candidate, salt, 10_000, 32, "sha256");
  const decipher = crypto.createDecipheriv("aes-256-gcm", candidateKey, Buffer.from(envelope.iv, "base64"));
  decipher.setAAD(Buffer.from(envelope.aad));
  const bytes = Buffer.from(envelope.ciphertext, "base64");
  decipher.setAuthTag(bytes.subarray(-16));
  return Buffer.concat([decipher.update(bytes.subarray(0, -16)), decipher.final()]).toString();
}

test("password encryption round-trips and rejects wrong passwords", () => {
  const envelope = seal("private Guanghe record", "manifest:v1");
  assert.equal(open(envelope, password), "private Guanghe record");
  assert.throws(() => open(envelope, "wrong-password"));
});

test("AES-GCM rejects tampered ciphertext", () => {
  const envelope = seal("private attachment", "asset:test");
  const bytes = Buffer.from(envelope.ciphertext, "base64");
  bytes[0] ^= 0xff;
  assert.throws(() => open({ ...envelope, ciphertext: bytes.toString("base64") }, password));
});
