import {
  requestBodyVerificationUnprotected,
  decodeRequestBodyUnprotected,
} from "../utils/common/jwtTokenbackend";
import { getMiddlewareCookies } from "./utils/middlewareutils";

const unprotectedmiddleware = (handler) => async (req, res) => {
  try {
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
      await requestBodyVerificationUnprotected(req.body.data).catch((error) => {
        verifiedData = false;
      });
      let decodedData = await decodeRequestBodyUnprotected(req.body.data);

      req.body = { ...decodedData.payload, ...req.body };
    }
    return await handler(req, res);
  } catch (e) {
    console.log("Error : ", e);
  }
};
export default unprotectedmiddleware;
