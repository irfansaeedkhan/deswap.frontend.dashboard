import Cookies from 'cookies';
import Connection from "../../db/db";
import CryptoJS from "crypto-js";
import UserRegisterationSchema from "../../models/Users";
import unprotectedmiddleware from "../../middleware/unprotectedmiddleware";
import { decryptData, decryptfrontendData } from "../../utils/common/crypto";
import { decodeJWT, createFrontUserToken, createFrontAdminToken } from "../../utils/common/jwtToken";
/**
 * @param {object} req
 * @param {object} res
 * @returns {object}
 * @description This function is used to reset the password
 * 
 */
const Verification = async (req, res) => {
  try {
    await Connection();
    const isMatch = await UserRegisterationSchema.findOneAndUpdate({
      $and: [
        { uuid: req.body._id },
        { verificationCode: req.body.verificationCode },
        { verificatioCodeExpiration: { $gte: Date.now() } },
      ],
    }, { emailVerified: true }).select("username role");

    if (isMatch) {


      let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
      let ipToCheck = ip;

      if (ip.includes(",")) {
        ipToCheck = ip.split(",")[0]
      }

      const cookies = new Cookies(req, res);

      //Frontend cookie code
      let encryptedfrontendcookie = await cookies.get(process.env.FRONT_END_COOKIE_NAME);
      let frontendcookie = await decryptfrontendData(encryptedfrontendcookie);

      if (frontendcookie == undefined || frontendcookie == null || frontendcookie == "") {
        return res.json({
          message: "login error",
          success: false,
        });
      }


      let frontdecoded = await decodeJWT({ jwtToken: frontendcookie });

      let frontendToken;
      if (frontdecoded.payload.role == "User") {
        frontendToken = await createFrontUserToken({
          uuid: frontdecoded.payload.uuid,
          time: frontdecoded.payload.loginTime,
          verificationStatus: frontdecoded.payload.emailverified,
          emailid: frontdecoded.payload.emailid,
          role: frontdecoded.payload.role,
          messageCodeAuth: true
        });
      }else if(frontdecoded.payload.role=="DeswapAdminRole"){
          frontendToken = await createFrontAdminToken({
          uuid: frontdecoded.payload.uuid,
          time: frontdecoded.payload.loginTime,
          verificationStatus: frontdecoded.payload.emailverified,
          emailid: frontdecoded.payload.emailid,
          role: frontdecoded.payload.role,
          ip:ipToCheck,
          messageCodeAuth: true
        });
      }


      let encryptedFrontendKey = await CryptoJS.AES.encrypt(
        frontendToken,
        process.env.FRONTEND_COOKIES_SECRET_KEY
      ).toString();

      let cookiesetfronend = await cookies.set(
        process.env.FRONT_END_COOKIE_NAME,
        encryptedFrontendKey, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "strict",
        //secure:true
      }
      );

      //Create 
      //Code matched
      return res.json({
        success: true,
        message: "verification code matched !",
        isMatch
      });

    }
    return res.json({

      message: "login error !",
      success: false,
    });
  } catch (error) {
    console.log(error)
    return res.json({
      message: "login error",
      success: false,
    });

  }
};

export default unprotectedmiddleware(Verification);
