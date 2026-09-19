//import Cookies from "cookies";
import { decryptData } from "../utils/common/crypto";
import { verifyJWT, decodeJWT } from "../utils/common/jwtToken";
import { refreshJWTToken } from "../utils/common/refreshjwtToken";
import {
  requestBodyVerificationAdmin,
  decoderequestBodyAdmin,
} from "../utils/common/jwtTokenbackend";
import { getMiddlewareCookies } from "./utils/middlewareutils";

const adminmiddleware = (handler) => async (req, res) => {
  let cookies, encryptedCookie, stringedcookie, cookie;
  try {
    let cookiedata = await getMiddlewareCookies(req, res);
    cookies = cookiedata.cookies;
    encryptedCookie = cookiedata.encryptedCookie;

    if (!encryptedCookie) {
      res.status(401).json({ data: null, error: "Invalid login" });
      return;
    }
    stringedcookie = await decryptData(encryptedCookie);
    cookie = await JSON.parse(stringedcookie);

    //getMiddleware;

    //Checking wether valid jwt token or not
    if (cookie.jwtToken == undefined || cookie.jwtToken == "") {
      res.status(401).json({ data: null, error: "Invalid login" });
      return;
    }

    let verificationResult = await verifyJWT({ jwtToken: cookie.jwtToken });
    let jwtToken = await decodeJWT({ jwtToken: cookie.jwtToken });

    if (!jwtToken.payload.role.includes("DeswapAdminRole")) {
      res.status(401).json({ data: null, error: "Invalid login" });
      return;
    }

    if (req.body) {
      req.body.uuid = jwtToken.payload.uuid;
    }

    if (
      req.headers.hasOwnProperty("security-set") &&
      req.headers["security-set"] &&
      Boolean(req.headers["security-set"]) == true &&
      req.headers["security-set"] == "true"
    ) {
      //
      if (!req.body.data) {
        res.status(400).json({ data: null, error: "Invalid request" });
        return;
      }
      //Valid request
      let verifiedData = true;
      await requestBodyVerificationAdmin(req.body.data).catch((error) => {
        verifiedData = false;
      });
      let decodedData = await decoderequestBodyAdmin(req.body.data);

      req.body = { ...decodedData.payload, ...req.body };
    }

    return await handler(req, res);
  } catch (e) {
    if (e.message == "jwt expired") {
      await refreshJWTToken(handler, req, res, cookie, "DeswapAdminRole");
    } else {
      res.status(401).json({ data: null, error: "Invalid login" });
    }
  }
};

export default adminmiddleware;
