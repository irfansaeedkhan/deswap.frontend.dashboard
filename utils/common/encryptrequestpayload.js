import crypto from "crypto";

import publicKey from "../../config/encryption/publickey.json";
import userpublicKey from "../../config/encryption/userpublickey.json";
import adminpublicKey from "../../config/encryption/adminpublickey.json";

export const encryptReqPayload = (payload) => {
  if (payload == null) return payload;

  const buffer = Buffer.from(JSON.stringify(payload));
  const encrypted = crypto.publicEncrypt(publicKey, buffer);
  return encrypted.toString("base64");
};

export const encryptUserReqPayLoad = (payload) => {
  if (payload == null) return payload;

  const buffer = Buffer.from(JSON.stringify(payload));
  const encrypted = crypto.publicEncrypt(userpublicKey, buffer);
  return encrypted.toString("base64");
};

export const encryptAdminReqPayLoad = (payload) => {
  if (payload == null) return payload;

  const buffer = Buffer.from(JSON.stringify(payload));
  const encrypted = crypto.publicEncrypt(adminpublicKey, buffer);
  return encrypted.toString("base64");
};
