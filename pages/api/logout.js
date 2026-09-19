import Cookies from "cookies";
import UsersessionModal from "../../models/users/usersSession";
import { decryptData } from "../../utils/common/crypto";
import { decodeJWT } from "../../utils/common/jwtToken";
import { getRedisClient } from "../../utils/connection/redisconnection";
import getMongoDBConnection from "../../utils/connection/mongodbconnection.js";

/**
 * @api {post} /api/admin/logout Logout
 * @apiName Logout
 * @apiPermission user
 * @apiGroup Authentication
 * @apiVersion 1.0.0
 * @apiDescription Logout
 * @apiHeader {String} cookies User's unique cookies.
 * @apiSuccess {String} data User logged out
 * @apiError {String} error Failed to logout.
 *
 */

const deleteFrontEndToken = async (cookies) => {
  try {
    let frontendcookie = await cookies.get(process.env.FRONT_END_COOKIE_NAME);
    await cookies.set(process.env.FRONT_END_COOKIE_NAME, "", {
      expires: new Date(0),
      sameSite: "strict",
      //secure:true
    });
  } catch (e) {
    console.log("Failed to delete frontend token : ", e);
  }
};

const deleteBackendToken = async (cookies) => {
  try {
    let domainNameCookie = await cookies.get(process.env.DOMAIN_NAME);
    if (
      domainNameCookie == null ||
      domainNameCookie == "" ||
      domainNameCookie == undefined
    ) {
      console.log("Failed to delete backend domain : ", domainNameCookie);
      return;
    }
    //Decrypting cookie
    let result = await decryptData(domainNameCookie);
    if (result == null || result == "" || result == undefined) {
      console.log(
        "Failed to delete backend domain :no decrypted data : ",
        result
      );
    }

    let parsedresult = JSON.parse(result);

    //
    let token = await decodeJWT({ jwtToken: parsedresult.jwtToken });

    console.log("Token : ", token);
    await getMongoDBConnection();
    //change the status of the user session to inactive
    let userSession = await UsersessionModal.findOneAndUpdate(
      {
        jwtUid: token.jwtuid,
      },
      {
        $set: {
          Status: "Logout",
        },
      }
    );

    console.log("User Session : ", userSession);
    await cookies.set(process.env.DOMAIN_NAME, "", {
      expires: new Date(0),
      sameSite: "strict",
      //secure:true
    });

    return userSession;
  } catch (e) {
    console.log("Failed to delete backend token : ", e);
  }
};

const deleteFromRedis = async (jwtuid, uuid) => {
  try {
    let redisClient = await getRedisClient();
    let settingData = await redisClient.get(uuid);
    settingData = JSON.parse(settingData);
    console.log("Setting data : ", settingData);
    console.log("JWT UID : ", jwtuid);
    if (
      settingData[jwtuid] != undefined &&
      settingData[jwtuid] != null &&
      settingData[jwtuid] != ""
    ) {
      //Deleteing
      console.log("before deleting ", settingData);
      delete settingData[jwtuid];
      console.log("after deleting ", settingData);
      await redisClient.set(uuid, JSON.stringify(settingData));
    }
    console.log("Disconnecting Redis");
    //await redisClient.quit();
  } catch (error) {
    console.log("Failed to delete from redis ", error);
  }
};
const handler = async (req, res) => {
  try {
    if (req.method !== "POST") {
      res.status(400).json({ data: null, error: "Invalid Method" });
      return;
    }

    const cookies = await new Cookies(req, res);

    await deleteFrontEndToken(cookies);
    let { jwtTokenUuid, uuid } = await deleteBackendToken(cookies);
    console.log("JWT token uuid ", jwtuid, uuid);
    //let userSession;
    /*
    if (domainNameCookie != null && domainNameCookie != "" && undefined) {
      //

      if (result != "" && result != null && result != undefined) {
        let parsedresult = JSON.parse(result);

        //change the status of the user session to inactive
        let userSession = await UsersessionModal.findOne({
          userid: token.userid,
        });
        if (userSession != null && userSession != undefined) {
          userSession.status = "inactive";
          await userSession.save();
        }
      }
    }*/

    await deleteFromRedis(jwtTokenUuid, uuid);

    res.status(200).json({ data: "Success", error: null });
    return;
  } catch (e) {
    res.status(400).json({ data: null, error: "Failed to delete" });
    return;
  }
};

export default handler;
