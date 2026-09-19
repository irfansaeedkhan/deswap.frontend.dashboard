import getMongoDBConnection from "../../utils/connection/mongodbconnection.js";
import userModel from "../../models/Users";
import userSession from "../../models/users/usersSession";
import { verifyJWT, decodeJWT } from "../../utils/common/jwtToken";
import ejs from "ejs";
import { resolve } from "path";
import { sendEmail } from "../../utils/common/email";
import resetpasswordModel from "../../models/password/resetpassword.js";
import { hash } from "bcryptjs";
import unprotectedmiddleware from "../../middleware/unprotectedmiddleware.js";
import { getRedisClient } from "../../utils/connection/redisconnection";

/**
 * @api {post} /api/newPassword?token=:token Reset Password
 * @apiName ResetPassword
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription This api is used to reset password
 * @apiQuery {String} token Token
 * @apiBody {String} password New Password
 * @apiErrorExample {json} Error-Response:
 *    HTTP/1.1 400 Bad Request
 *   {
 *    "data": null,
 *   "error": "Invalid token",
 *  "success": false
 *  }
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *  {
 *   "data": "encrypted data",
 *  "error": null,
 *  }
 * @apiExample {axios} Example usage:
 *   axios.post('/api/newPassword?token=:token', {
 *     password: "password"
 *  })
 *
 *
 *
 */
const sendResetPasswordEmail = async (emailid) => {
  try {
    let pathTotemplate = await resolve("templates/email/resetpassword.ejs");
    let verificationurl = `${process.env.PLATFORM_URL}`;
    let htmltempate = await ejs.renderFile(pathTotemplate, {
      emailID: emailid,
      url: verificationurl,
    });
    //console.log(htmltempate);
    let result = await sendEmail({
      toAddress: emailid,
      subject: "Password Resetted",
      bodyText: `Password updated`,
      bodyHTML: htmltempate,
    });
  } catch (e) {
    //
    console.log("Failed to registeration email ", e);
  }
};

const logoutAllUsersDevices = async (uuid) => {
  try {
    let redisClient = await getRedisClient();
    let userData = await redisClient.get(uuid);
    if (userData) {
      await redisClient.del(uuid);
    }
  } catch (error) {
    console.log("Failed to logout all users ", error);
  }
};

const handler = async (req, res) => {
  try {
    if (req.method !== "POST") {
      res.status(400).json({ data: null, error: "Invalid Method" });
      return;
    }

    await getMongoDBConnection();

    let token = await decodeURIComponent(req.body.token);

    let verificationResult = await verifyJWT({ jwtToken: token });

    let jwtToken = await decodeJWT({ jwtToken: token });

    //console.log("JWT Token : ",jwtToken);
    let userInfo = await userModel.findOne({
      uuid: jwtToken.payload.user,
    });

    if (userInfo == null || userInfo == undefined) {
      res.status(400).json({ data: null, error: "Invalid user" });
      return;
    }

    //
    let findToken = await resetpasswordModel.findOne({
      uid: jwtToken.payload.user,
      tokenhash: jwtToken.payload.hash,
      tokenType: "PasswordReset",
    });

    if (findToken == null || findToken == undefined) {
      res.status(400).json({
        data: null,
        error: "Invalid token or token expired",
        success: false,
      });
      return;
    }

    let hashPassword = await hash(req.body.password, 10);

    await userModel.updateOne(
      {
        uuid: jwtToken.payload.user,
      },
      {
        $set: {
          password: hashPassword,
          maxfailedLoginAttemps: 0,
          lastpasswordOn: new Date(),
        },
      }
    );

    await resetpasswordModel.deleteOne({
      uid: jwtToken.payload.user,
      tokenhash: jwtToken.payload.hash,
      tokenType: "PasswordReset",
    });

    //Logout all users sessions
    await userSession.updateMany(
      {
        uuid: userInfo._id,
      },
      {
        $set: {
          Status: "Logout",
        },
      }
    );

    //console.log("Token : ",findToken);
    await sendResetPasswordEmail(userInfo.emailid).catch(console.error);

    await logoutAllUsersDevices(userInfo._id);
    res.status(200).json({
      data: { uid: jwtToken.payload.user },
      error: null,
      success: true,
    });
  } catch (e) {
    console.log("Token", e);
    if (e.message == "jwt expired") {
      res
        .status(400)
        .json({ data: null, error: "Token expired", success: false });
    } else {
      res
        .status(400)
        .json({ data: null, error: "Invalid token", success: false });
    }
    return;
  }
};

export default unprotectedmiddleware(handler);
