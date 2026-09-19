import CryptoJS from "crypto-js";

module.exports.encryptData = async (data) => {
  try {
    data = data.trim();
    let encryptedData = await CryptoJS.AES.encrypt(
      data,
      process.env.COOKIES_SECRET_KEY
    ).toString();
    return encryptedData;
  } catch (e) {
    throw e;
  }
};

module.exports.decryptData = async (data) => {
  try {
    let decryptedKey = await CryptoJS.AES.decrypt(
      data,
      process.env.COOKIES_SECRET_KEY
    );
    let original = await decryptedKey.toString(CryptoJS.enc.Utf8);
    return original;
  } catch (e) {
    throw e;
  }
};

module.exports.encryptfrontendData = async (data) => {
  try {
    data = data.trim();
    let encryptedData = await CryptoJS.AES.encrypt(
      data,
      process.env.FRONTEND_COOKIES_SECRET_KEY
    ).toString();
    return encryptedData;
  } catch (e) {
    throw e;
  }
};

module.exports.decryptfrontendData = async (data) => {
  try {
    let decryptedKey = await CryptoJS.AES.decrypt(
      data,
      process.env.FRONTEND_COOKIES_SECRET_KEY
    );
    let original = await decryptedKey.toString(CryptoJS.enc.Utf8);
    return original;
  } catch (e) {
    throw e;
  }
};

module.exports.encryptEmailVerificationData = async (data) => {
  try {
    data = data.trim();
    let encryptedData = await CryptoJS.AES.encrypt(
      data,
      process.env.EMAIL_VERIFICATION_SECRET_KEY
    ).toString();
    return encryptedData;
  } catch (e) {
    throw e;
  }
};

module.exports.decryptEmailVerificationData = async (data) => {
  try {
    let decryptedKey = await CryptoJS.AES.decrypt(
      data,
      process.env.EMAIL_VERIFICATION_SECRET_KEY
    );
    let original = await decryptedKey.toString(CryptoJS.enc.Utf8);
    return original;
  } catch (e) {
    throw e;
  }
};

module.exports.decryptUserResponseBody = async (data) => {
  try {
    data = await decodeURIComponent(data);
    let decryptedKey = await CryptoJS.AES.decrypt(
      data,
      process.env.NEXT_PUBLIC_ENCRYPTION_User_Response
    );
    let original = await decryptedKey.toString(CryptoJS.enc.Utf8);
    return original;
  } catch (e) {
    throw e;
  }
};

module.exports.decryptAdminResponseBody = async (data) => {
  try {
    data = await decodeURIComponent(data);
    let decryptedKey = await CryptoJS.AES.decrypt(
      data,
      process.env.NEXT_PUBLIC_ENCRYPTION_Admin_Response
    );
    let original = await decryptedKey.toString(CryptoJS.enc.Utf8);
    return original;
  } catch (e) {
    throw e;
  }
};

module.exports.decryptUnprotectedResponseBody = async (data) => {
  try {
    data = await decodeURIComponent(data);
    let decryptedKey = await CryptoJS.AES.decrypt(
      data,
      process.env.NEXT_PUBLIC_ENCRYPTION_Unprotected_Response
    );
    let original = await decryptedKey.toString(CryptoJS.enc.Utf8);
    return original;
  } catch (e) {
    throw e;
  }
};
