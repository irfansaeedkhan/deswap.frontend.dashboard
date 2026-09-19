//import Cookies from "cookies";
import { decryptData } from "../utils/common/crypto";
import { verifyJWT, decodeJWT } from "../utils/common/jwtToken";
import { refreshJWTToken } from "../utils/common/refreshjwtToken";
import userSessionModal from "../models/users/usersSession";
import {
  verifyRequestBody,
  decodeRequestBody,
} from "../utils/common/jwtTokenbackend";
import { SanitizeRequestObject } from "../utils/common/sanitize";
import { getRedisClient } from "../utils/connection/redisconnection";
import { getMiddlewareCookies } from "./utils/middlewareutils";

global.color = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  black: "\x1b[30m",
  reset: "\x1b[0m",
  blue: "\x1b[34m",
};

const usermiddleware = (handler) => async (req, res) => {
  let cookies, encryptedCookie, stringedcookie, cookie;
  //console.log("User middleware");
  //let redisClient = await getRedisClient();
  console.log(
    "XXXXX User middleware start : ",
    req.headers.referer,
    "\n",
    req.query,
    req.body
  );
  req.redisClient = await getRedisClient();
  try {
    let cookiedata = await getMiddlewareCookies(req, res);
    cookies = cookiedata.cookies;
    encryptedCookie = cookiedata.encryptedCookie;
    // Cookies not found means users is not logged in
    if (!encryptedCookie) {
      console.log("XXXXX No cookie : ", req.headers.referer, "\n");
      req?.redisClient?.quit();
      res.status(401).json({ data: null, error: "Invalid login" });
      return;
    }

    // Decrypting cookies
    stringedcookie = await decryptData(encryptedCookie);
    // Parsisng JSON
    cookie = await JSON.parse(stringedcookie);

    // Checking wether valid jwt token or not
    if (cookie.jwtToken == undefined || cookie.jwtToken == "") {
      console.log("XXXXX Invalid JWT : ", req.headers.referer, "\n");
      await req?.redisClient?.quit();
      res.status(401).json({ data: null, error: "Invalid login" });
      return;
    }

    // Verifying if JWT token is valid or not
    let verificationResult = await verifyJWT({ jwtToken: cookie.jwtToken });

    // If token is valid then decode token
    let jwtToken = await decodeJWT({ jwtToken: cookie.jwtToken });

    // Checking wether role is user role or not
    if (!jwtToken.payload.role.includes("User")) {
      console.log("XXXXX Not User : ", req.headers.referer, "\n");
      await req?.redisClient?.quit();
      res.status(401).json({ data: null, error: "Invalid login" });
      return;
    }

    //console.log("Usermiddleware : User ID ", jwtToken.payload.uuid);
    let userDetailsOnRedis = await req.redisClient.get(jwtToken.payload.uuid);
    // console.log(
    //   "Usermiddleware : Data inserted in database ",
    //   userDetailsOnRedis
    // );
    userDetailsOnRedis = JSON.parse(userDetailsOnRedis);
    // console.log(
    //   "Usermiddleware : Keys of the object ",
    //   Object.keys(userDetailsOnRedis)
    // );
    //console.log("Usermiddleware : JWT token data : ", jwtToken.payload);
    //await redisClient.quit();
    if (
      userDetailsOnRedis[jwtToken.payload.jwtuid] == undefined ||
      userDetailsOnRedis[jwtToken.payload.jwtuid] == null
    ) {
      // console.log(
      //   "Usermiddleware : User id doesnt exits  ",
      //   jwtToken.payload.jwtuid,
      //   "\n Redis details : \n",
      //   userDetailsOnRedis
      // );
      //User doesnt exits to return
      await req?.redisClient?.quit();
      res.status(401).json({ data: null, error: "Invalid login" });
      return;
    }

    if (userDetailsOnRedis[jwtToken.payload.jwtuid].backendTokenRefreshStatus) {
      console.log("XXXXX Not Reffresh token : ", req.headers.referer, "\n");
      //console.log("Usermiddleware : Token refreshing it");
      await req?.redisClient?.quit();
      res.status(401).json({ data: null, error: "Token refreshing" });
      return;
    }

    //

    // if(req.body!=undefined && req.body!= null && req.body !=""){
    // req.body.uuid = jwtToken.payload.uuid;
    // req.body.jwtUid = jwtToken.payload.jwtuid;
    // }

    if (req.method == "GET") {
      req.query.uuid = jwtToken.payload.uuid;
      req.query.jwtUid = jwtToken.payload.jwtuid;
      //Sanitizing request query
      req.query = await SanitizeRequestObject(req.query);
    } else {
      req.body.uuid = jwtToken.payload.uuid;
      req.body.jwtUid = jwtToken.payload.jwtuid;
      //Sanitizing request body
      //req.body = await SanitizeRequestObject(req.body);
    }
    //console.log("Before decryption : ", req.body);
    if (req.body && req.body.data != undefined && req.body.uuid != undefined) {
      //console.log("Request body 1 : ", req.body);
      //
      if (!req.body.data) {
        req?.redisClient?.quit();
        res.status(400).json({ data: null, error: "Invalid request" });
        return;
      }
      //Valid request
      let verifiedData = true;

      await verifyRequestBody(req.body.data, req.url).catch((error) => {
        verifiedData = false;
      });
      //console.log("Verified data : ", verifiedData);
      if (!verifiedData) {
        console.log("XXXXX Not verified data : ", req.headers.referer, "\n");
        req?.redisClient?.quit();
        //Return with error message
        res.status(401).json({ data: null, error: "Invalid login" });
        return;
      }
      let decodedData = await decodeRequestBody(req.body.data, req.url);
      //let decodedData = await decryptReqPayload(req.body.data);
      //console.log("Decided data : ", decodedData);
      req.body = { ...req.body, ...decodedData.payload };
    } else if (
      req.query != undefined &&
      req.query.data != undefined &&
      req.query.uuid != undefined
    ) {
      //console.log("Request body 2 : ", req.body);
      await verifyRequestBody(req.query.data).catch((error) => {
        verifiedData = false;
      });

      if (!verifiedData) {
        console.log("XXXXX Not verified : ", req.headers.referer, "\n");
        //Return with error message
        await req?.redisClient?.quit();
        res.status(401).json({ data: null, error: "Invalid login" });
        return;
      }

      let decodedData = await decodeRequestBody(req.query.data);

      req.query = { ...decodedData.payload, ...req.query };
    } else {
      //console.log("Request body 3 : ", req.body);
      if (req.method == "GET") {
        req.query = { uuid: req.query.uuid, jwtUid: req.query.jwtUid };
      } else {
        req.body = { uuid: req.body.uuid, jwtUid: req.body.jwtUid };
      }
    }
    //await redisClient.quit();
    return await handler(req, res);
  } catch (e) {
    //await redisClient.quit();
    //console.log("Usermiddleware : Error while authenticating  ", e);
    //console.log("hh")
    if (e.message == "jwt expired") {
      await refreshJWTToken(handler, req, res, cookie);
    } else {
      console.log("XXXXX Error : ", req.headers.referer, "\t", e);

      await req?.redisClient?.quit();
      //console.log("failed to refresh login refresh token");
      res.status(401).json({ data: null, error: "Invalid login" });
      //res.status(401).json({ data: null, error: "Invalid login" });
    }
  }
};

export default usermiddleware;
