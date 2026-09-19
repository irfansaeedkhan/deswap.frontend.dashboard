import usersSessionModal from "../../models/users/usersSession";
import getMongoDBConnection from "../connection/mongodbconnection";
import { decodeJWT, createJWTUniqueID, createJWTToken } from "./jwtToken.js";
import CryptoJS from "crypto-js";
import Cookies from "cookies";
import moment from "moment";

module.exports.refreshJWTToken = async (
  handler,
  req,
  res,
  cookie,
  checkingFrom = "User"
) => {
  try {
    console.log("Refreshing token : ", req.headers.referer, "\n");
    let userDetails = {};
    await getMongoDBConnection();

    let jwtToken = await decodeJWT({ jwtToken: cookie.jwtToken });
    let refreshToken = cookie.refreshToken;

    let userSession = await usersSessionModal.findOne({
      jwtTokenUuid: jwtToken.payload.jwtuid,
      refreshToken: refreshToken,
      Status: "Active",
    });

    if (userSession == null) {
      await req?.redisClient?.quit();
      res.status(401).json({ data: null, error: "Invalid login" });
      return;
    }

    console.log(
      "Refreshing token : User session from database : ",
      req.headers.referer,
      userSession
    );
    let tokenLastUpdateTime = await moment(userSession.updatedAt);
    let currentTime = await moment();

    if (tokenLastUpdateTime.utcOffset() == currentTime.utcOffset()) {
      console.log(
        "Refreshing token : ",
        req.headers.referer,
        "Last token time : ",
        ""
      );
      let difference = currentTime.diff(tokenLastUpdateTime, "minutes");
      if (difference > 30) {
        console.log(
          "Time difference is more than 30 min",
          req.headers.referer,
          "Last token time : ",
          ""
        );
        await req.redisClient.quit();
        res.status(401).json({ data: null, error: "Invalid login" });
        return;
      }
    } //else {
    //console.log("!!!!!!!!!!!!!!!!!!!!!!!");
    //console.log("Refreshing token : Connecting to redis  ");
    userDetails = await req.redisClient.get(userSession.uuid);
    console.log(
      "Refreshing token : User details from the Redis : ",
      req.headers.referer,
      userDetails
    );
    userDetails = JSON.parse(userDetails);
    if (
      userDetails[jwtToken.payload.jwtuid] == null ||
      userDetails[jwtToken.payload.jwtuid] == undefined
    ) {
      console.log(
        "Refreshing token : JWT token uuid doesnt ",
        req.headers.referer,
        jwtToken.payload.jwtuid,
        "User details : ",
        userDetails
      );
      await req?.redisClient?.quit();
      res.status(401).json({ data: null, error: "Invalid login" });
      return;
    }

    // console.log(
    //   "Refreshing token : JWT token payload : ",
    //   req.headers.referer,
    //   jwtToken.payload
    // );
    // console.log(
    //   "Refreshing token : User details from JWT token : ",
    //   req.headers.referer,
    //   userDetails
    // );
    userDetails[jwtToken.payload.jwtuid].backendTokenRefreshStatus = true;
    // Setting
    console.log(
      "Refreshing token : Refreshing it setting data : ",
      req.headers.referer,
      userDetails,
      userSession
    );
    await req.redisClient.set(userSession.uuid, JSON.stringify(userDetails));
    //console.log("!!!!!!!!!!!!!!!!!!!!!!!");
    //}

    //Create new unique id for jwt
    let jwtUid = await createJWTUniqueID();

    //Create jwt token
    let newjwtToken = await createJWTToken({
      uuid: jwtToken.payload.uuid,
      time: jwtToken.payload.time,
      jwtUid: jwtUid,
      role: jwtToken.payload.role,
      emailid: jwtToken.payload.emailid,
      uid: jwtToken.payload.uid,
    });

    let refreshTokenUpdated = await usersSessionModal.updateOne(
      { refreshToken: refreshToken, jwtTokenUuid: jwtToken.payload.jwtuid },
      {
        $set: {
          jwtTokenUuid: jwtUid,
        },
      }
    );

    if (refreshTokenUpdated.modifiedCount == 0) {
      await req?.redisClient?.quit();
      res.status(401).json({ data: null, error: "Failed to refresh token" });
      return;
    }

    // console.log(
    //   "Refreshing token : Copying data ",
    //   userDetails[jwtToken.payload.jwtuid],
    //   "\n Testing : ",
    //   userDetails,
    //   " Token uuid : ",
    //   jwtToken.payload.jwtuid
    // );

    let detailsToSave = {};
    detailsToSave[jwtUid] = {
      ...userDetails[jwtToken.payload.jwtuid],
    };
    // console.log(
    //   "Refreshing token : New details to save : ",
    //   req.headers.referer,
    //   detailsToSave
    // );
    //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXX");
    detailsToSave[jwtUid].backendTokenRefreshStatus = false;
    detailsToSave[jwtUid].jwtuid = jwtUid;

    console.log(
      "Refreshing token : Inserting into the database : ",
      req.headers.referer,
      detailsToSave,
      userSession
    );

    //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
    let savedInRedis = await req.redisClient.set(
      userSession.uuid,
      JSON.stringify(detailsToSave)
    );
    //console.log("Refreshing token : ", savedInRedis);
    //Encrypt key
    let cookieData = JSON.stringify({
      refreshToken: refreshToken,
      jwtToken: newjwtToken,
    });

    //await redisClient.quit();
    //Store it in cookie
    let encryptedKey = await CryptoJS.AES.encrypt(
      cookieData,
      process.env.COOKIES_SECRET_KEY
    ).toString();

    let cookies = new Cookies(req, res);

    cookies.set(process.env.DOMAIN_NAME, encryptedKey, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
      //secure:true
    });

    if (!jwtToken.payload.role.includes(checkingFrom)) {
      await req.redisClient.quit();
      res.status(401).json({ data: null, error: "Invalid login" });
      return;
    }

    if (req.method == "GET") {
      req.query.uuid = jwtToken.payload.uuid;
    } else {
      req.body.uuid = jwtToken.payload.uuid;
    }

    await req?.redisClient?.quit();
    return await handler(req, res);
  } catch (e) {
    console.log("Failed to refresh token : ", e);
    throw e;
  }
};
