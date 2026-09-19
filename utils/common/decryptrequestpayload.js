import fs from "fs";
import crypto from "crypto";
import { resolve } from "path";

const publicAPIprivateKeyFilePath = resolve("private.pem");
const adminAPIprivateKeyFilePath = resolve("adminprivatekey.pem");
const userAPIprivateKeyFilePath = resolve("userprivatekey.pem");

const publicprivateKey = fs
  .readFileSync(publicAPIprivateKeyFilePath, "utf8")
  .toString();
const adminprivateKey = fs
  .readFileSync(adminAPIprivateKeyFilePath, "utf8")
  .toString();
const userprivateKey = fs
  .readFileSync(userAPIprivateKeyFilePath, "utf8")
  .toString();

module.exports.decryptPublicReqPayload = (payload) => {
  if (payload == null) return payload;

  const buffer = Buffer.from(payload, "base64");
  const decrypted = crypto.privateDecrypt(
    {
      key: publicprivateKey,
      passphrase: process.env.PUBLIC_ENCRYPTION_PRIVATE_KEY_PASSPHRASE,
    },
    buffer
  );
  return JSON.parse(decrypted.toString("utf8"));
};

module.exports.decryptUserReqPayload = (payload) => {
  if (payload == null) return payload;

  const buffer = Buffer.from(payload, "base64");
  const decrypted = crypto.privateDecrypt(
    {
      key: userprivateKey,
      passphrase: process.env.USER_ENCRYPTION_PRIVATE_KEY_PASSPHRASE,
    },
    buffer
  );
  return JSON.parse(decrypted.toString("utf8"));
};

module.exports.decryptAdminReqPayload = (payload) => {
  if (payload == null) return payload;

  const buffer = Buffer.from(payload, "base64");
  const decrypted = crypto.privateDecrypt(
    {
      key: adminprivateKey,
      passphrase: process.env.ADMIN_ENCRYPTION_PRIVATE_KEY_PASSPHRASE,
    },
    buffer
  );
  return JSON.parse(decrypted.toString("utf8"));
};
