import {
  decryptPublicReqPayload,
  decryptUserReqPayload,
  decryptAdminReqPayload,
} from "./decryptrequestpayload.js";

module.exports.decryptUserRequestBody = async (data) => {
  try {
    data = await decodeURIComponent(data);
    let original = await decryptUserReqPayload(data);
    //let decryptedKey = await CryptoJS.AES.decrypt(data,process.env.NEXT_PUBLIC_ENCRYPTION_User_Request);
    //let original = await decryptedKey.toString(CryptoJS.enc.Utf8);
    return original;
  } catch (e) {
    console.log("Error message : ", e);
    throw e;
  }
};

module.exports.decryptAdminRequestBody = async (data) => {
  try {
    data = await decodeURIComponent(data);
    let original = await decryptAdminReqPayload(data);
    // let decryptedKey = await CryptoJS.AES.decrypt(
    //   data,
    //   process.env.NEXT_PUBLIC_ENCRYPTION_Admin_Request
    // );
    // let original = await decryptedKey.toString(CryptoJS.enc.Utf8);
    return original;
  } catch (e) {
    console.log("Error message : ", e);
    throw e;
  }
};

module.exports.decryptUnprotectedRequestBody = async (data) => {
  try {
    data = await decodeURIComponent(data);
    let original = await decryptPublicReqPayload(data);
    // let decryptedKey = await CryptoJS.AES.decrypt(
    //   data,
    //   process.env.NEXT_PUBLIC_ENCRYPTION_Unprotected_Request
    // );
    // let original = await decryptedKey.toString(CryptoJS.enc.Utf8);
    return original;
  } catch (e) {
    console.log("Error message : ", e);
    throw e;
  }
};
