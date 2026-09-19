import { verify, decode } from "jsonwebtoken";
import {
  decryptUserRequestBody,
  decryptAdminRequestBody,
  decryptUnprotectedRequestBody,
} from "./cryptobackend";

module.exports.verifyRequestBody = async (param, url = "") => {
  try {
    param = await decryptUserRequestBody(param);
    return await verify(param, process.env.NEXT_PUBLIC_Encryption_Key);
  } catch (e) {
    console.log("\n\n", url, " : XXXXX Verify request body : ", e);
  }
};

module.exports.decodeRequestBody = async (param, url = "") => {
  try {
    param = await decryptUserRequestBody(param);
    return await decode(param, { complete: true });
  } catch (e) {
    console.log("\n\n", url, " : XXXXX Decode request body : ", e);
  }
};

module.exports.requestBodyVerificationUnprotected = async (param) => {
  param = await decryptUnprotectedRequestBody(param);
  return await verify(param, process.env.NEXT_PUBLIC_UnprotectedRequest_Key);
};

module.exports.decodeRequestBodyUnprotected = async (param) => {
  param = await decryptUnprotectedRequestBody(param);
  return await decode(param, { complete: true });
};

module.exports.requestBodyVerificationAdmin = async (param) => {
  param = await decryptAdminRequestBody(param);
  return await verify(param, process.env.NEXT_PUBLIC_AdminRequest_Key);
};

module.exports.decoderequestBodyAdmin = async (param) => {
  param = await decryptAdminRequestBody(param);
  return await decode(param, { complete: true });
};
