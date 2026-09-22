import { randomBytes } from "crypto";
import { sign, verify, decode } from "jsonwebtoken";
import jwtConfig from "../../config/jwt/jwtConfig.json";
import {
  // decryptUserRequestBody,
  decryptUserResponseBody,
  // decryptAdminRequestBody,
  decryptAdminResponseBody,
  //decryptUnprotectedRequestBody,
  decryptUnprotectedResponseBody,
} from "./crypto";
import CryptoJS from "crypto-js";
import {
  encryptReqPayload,
  encryptUserReqPayLoad,
  encryptAdminReqPayLoad,
} from "./encryptrequestpayload";

const DEMO_FRONT_USER_KEY = "deswap-demo-frontend-user-key";
const DEMO_JWT_SECRET_KEY = "demo-jwt-secret-key-change-me";

function isDemoMode() {
  if (
    process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
    process.env.DEMO_MODE === "true"
  ) {
    return true;
  }
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    return (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.endsWith(".vercel.app")
    );
  }
  return process.env.VERCEL === "1";
}

function frontendUserKey() {
  return (
    process.env.FRONT_END_USER_KEY ||
    process.env.JWT_SECRET_KEY ||
    DEMO_FRONT_USER_KEY
  );
}

function jwtSigningKey() {
  return (
    process.env.JWT_SECRET_KEY || process.env.JWT_SECRET || DEMO_JWT_SECRET_KEY
  );
}

module.exports.createUserRefreshToken = async (refreshTokenLength = 30) => {
  try {
    return await randomBytes(refreshTokenLength).toString("hex");
  } catch (e) {
    throw e;
  }
};

//
module.exports.createJWTUniqueID = async (jwtUidLength = 20) => {
  try {
    return await randomBytes(jwtUidLength).toString("hex");
  } catch (e) {
    throw e;
  }
};

//
module.exports.createJWTToken = async (params) => {
  try {
    return await sign(
      {
        uuid: params.uuid,
        loginTime: params.time,
        jwtuid: params.jwtUid,
        role: params.role,
        emailid: params.emailid,
        uid: params.uid,
      },
      jwtSigningKey(),
      jwtConfig
    );
  } catch (e) {
    throw e;
  }
};

//
module.exports.verifyJWT = async (param) => {
  try {
    return await verify(param.jwtToken, jwtSigningKey());
  } catch (e) {
    throw e;
  }
};

//
module.exports.decodeJWT = async (param) => {
  try {
    return await decode(param.jwtToken, { complete: true });
  } catch (e) {
    throw e;
  }
};

//
module.exports.createUniqueToken = async (tokenLength = 50) => {
  try {
    return await randomBytes(tokenLength).toString("hex");
  } catch (e) {
    throw e;
  }
};

//
module.exports.createPasswordResetToken = async (params) => {
  try {
    let jwtconfig = JSON.parse(JSON.stringify(jwtConfig));
    jwtconfig.expiresIn = "60m";
    //
    return await sign(
      {
        user: params.uuid,
        time: new Date().toUTCString(),
        hash: params.hash,
        type: params.type,
      },
      jwtSigningKey(),
      jwtconfig
    );
  } catch (e) {
    throw e;
  }
};

//
module.exports.emailVerificationToken = async (params) => {
  try {
    let jwtconfig = JSON.parse(JSON.stringify(jwtConfig));
    jwtconfig.expiresIn = "1d";

    return await sign(
      {
        user: params.uuid,
        time: new Date().toUTCString(),
        hash: params.hash,
        type: params.type,
      },
      jwtSigningKey(),
      jwtconfig
    );
  } catch (e) {
    throw e;
  }
};

//
//
module.exports.createFrontUserToken = async (params) => {
  try {
    let jwtconfig = JSON.parse(JSON.stringify(jwtConfig));
    jwtconfig.expiresIn =
      process.env.DEMO_MODE === "true" ||
      process.env.NEXT_PUBLIC_DEMO_MODE === "true"
        ? "24h"
        : "5m";

    return await sign(
      {
        uuid: params.uuid,
        loginTime: params.time,
        emailverified: params.verificationStatus,
        emailid: params.emailid,
        role: params.role,
        messageCodeAuth: params.messageCodeAuth,
      },
      frontendUserKey(),
      jwtconfig
    );
  } catch (e) {
    throw e;
  }
};

module.exports.createFrontAdminToken = async (params) => {
  try {
    let jwtconfig = JSON.parse(JSON.stringify(jwtConfig));
    jwtconfig.expiresIn =
      process.env.DEMO_MODE === "true" ||
      process.env.NEXT_PUBLIC_DEMO_MODE === "true"
        ? "24h"
        : "5m";

    return await sign(
      {
        uuid: params.uuid,
        loginTime: params.time,
        emailverified: params.verificationStatus,
        emailid: params.emailid,
        role: params.role,
        ip: params.ip,
        messageCodeAuth: params.messageCodeAuth,
      },
      frontendUserKey(),
      jwtconfig
    );
  } catch (e) {
    throw e;
  }
};

//
module.exports.verifyFrontEndToken = async (param) => {
  try {
    return await verify(param.jwtToken, frontendUserKey());
  } catch (e) {
    throw e;
  }
};

module.exports.encryptRequestBody = async (param) => {
  if (isDemoMode()) return param;
  try {
    //

    let jwtconfig = JSON.parse(JSON.stringify(jwtConfig));
    jwtconfig.expiresIn = "7m";
    //
    let jwtTokenCreated = await sign(
      param,
      process.env.NEXT_PUBLIC_Encryption_Key,
      jwtconfig
    );

    //

    /*
	let requestToken = await CryptoJS.AES.encrypt(
      jwtTokenCreated,
      process.env.NEXT_PUBLIC_ENCRYPTION_User_Request
    ).toString();
	*/
    let requestToken = await encryptUserReqPayLoad(jwtTokenCreated);
    requestToken = await encodeURIComponent(requestToken);
    return requestToken;
  } catch (e) {
    if (isDemoMode()) return param;
    throw e;
  }
};

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

module.exports.responseBodyEncryption = async (param) => {
  try {
    //
    console.log("inside response",param);
    let jwtconfig = JSON.parse(JSON.stringify(jwtConfig));
    jwtconfig.expiresIn = "10m";
    //
    let jwtTokenCreated = await sign(
      param,
      process.env.NEXT_PUBLIC_ResponseEncryption_Key,
      jwtconfig
    );

    let requestToken = await CryptoJS.AES.encrypt(
      jwtTokenCreated,
      process.env.NEXT_PUBLIC_ENCRYPTION_User_Response
    ).toString();
    requestToken = await encodeURIComponent(requestToken);
    console.log("requestToken", requestToken);
    return requestToken;
  } catch (e) {
    console.log("kk");
    throw e;
  }
};

module.exports.responseBodyVerification = async (param) => {
  param = await decryptUserResponseBody(param);
  return await verify(param, process.env.NEXT_PUBLIC_ResponseEncryption_Key);
};

module.exports.decodeResponseBody = async (param) => {
  param = await decryptUserResponseBody(param);
  return await decode(param, { complete: true });
};

//Request unprotected
module.exports.requestBodyEncryptionUnprotected = async (param) => {
  if (isDemoMode()) return param;
  try {
    //
    let jwtconfig = JSON.parse(JSON.stringify(jwtConfig));
    jwtconfig.expiresIn = "10m";
    //
    let jwtTokenCreated = await sign(
      param,
      process.env.NEXT_PUBLIC_UnprotectedRequest_Key,
      jwtconfig
    );
    let requestToken = await encryptReqPayload(jwtTokenCreated);
    /*
	let requestToken = await CryptoJS.AES.encrypt(
      jwtTokenCreated,
      process.env.NEXT_PUBLIC_ENCRYPTION_Unprotected_Request
    ).toString();
	*/
    requestToken = await encodeURIComponent(requestToken);
    return requestToken;
  } catch (e) {
    if (isDemoMode()) return param;
    throw e;
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

//Unprotected Response
module.exports.responseBodyEncryptionUnprotected = async (param) => {
  try {
    //
    let jwtconfig = JSON.parse(JSON.stringify(jwtConfig));
    jwtconfig.expiresIn = "10m";
    //
    let jwtTokenCreated = await sign(
      param,
      process.env.NEXT_PUBLIC_UnprotectedResponse_Key,
      jwtconfig
    );
    let requestToken = await CryptoJS.AES.encrypt(
      jwtTokenCreated,
      process.env.NEXT_PUBLIC_ENCRYPTION_Unprotected_Response
    ).toString();
    requestToken = await encodeURIComponent(requestToken);
    return requestToken;
  } catch (e) {
    throw e;
  }
};

module.exports.responseBodyVerificationUnprotected = async (param) => {
  param = await decryptUnprotectedResponseBody(param);
  return await verify(param, process.env.NEXT_PUBLIC_UnprotectedResponse_Key);
};

module.exports.decodeResponseBodyUnprotected = async (param) => {
  param = await decryptUnprotectedResponseBody(param);
  return await decode(param, { complete: true });
};

//Admin request
module.exports.requestBodyEncryptionAdmin = async (param) => {
  if (isDemoMode()) return param;
  try {
    //
    let jwtconfig = JSON.parse(JSON.stringify(jwtConfig));
    jwtconfig.expiresIn = "10m";
    //
    let jwtTokenCreated = await sign(
      param,
      process.env.NEXT_PUBLIC_AdminRequest_Key,
      jwtconfig
    );
    /*
    let requestToken = await CryptoJS.AES.encrypt(
      jwtTokenCreated,
      process.env.NEXT_PUBLIC_ENCRYPTION_Admin_Request
    ).toString();
	*/
    let requestToken = await encryptAdminReqPayLoad(jwtTokenCreated);

    requestToken = await encodeURIComponent(requestToken);
    return requestToken;
  } catch (e) {
    if (isDemoMode()) return param;
    throw e;
  }
};

module.exports.requestBodyVerificationAdmin = async (param) => {
  param = await decryptAdminRequestBody(param);
  return await verify(param, process.env.NEXT_PUBLIC_AdminRequest_Key);
};

module.exports.decoderequestBodyAdmin = async (param) => {
  param = await decryptAdminRequestBody(param);
  return await decode(param, { complete: true });
};

//Admin Response
module.exports.responseBodyEncryptionAdmin = async (param) => {
  try {
    //
    let jwtconfig = JSON.parse(JSON.stringify(jwtConfig));
    jwtconfig.expiresIn = "10m";
    //
    let jwtTokenCreated = await sign(
      param,
      process.env.NEXT_PUBLIC_AdminResponse_Key,
      jwtconfig
    );
    let requestToken = await CryptoJS.AES.encrypt(
      jwtTokenCreated,
      process.env.NEXT_PUBLIC_ENCRYPTION_Admin_Response
    ).toString();
    requestToken = await encodeURIComponent(requestToken);
    return requestToken;
  } catch (e) {
    throw e;
  }
};

module.exports.responseBodyVerificationAdmin = async (param) => {
  param = await decryptAdminResponseBody(param);
  return await verify(param, process.env.NEXT_PUBLIC_AdminResponse_Key);
};

module.exports.decodeResponseBodyAdmin = async (param) => {
  param = await decryptAdminResponseBody(param);
  return await decode(param, { complete: true });
};
