import { compare } from "bcryptjs";
import { sendEmail } from "../../utils/common/email";
import ejs from "ejs";
import { resolve } from "path";
import userModel from "../../models/Users";
import getMongoDBConnection from "../../utils/connection/mongodbconnection.js";
import {
  createUserRefreshToken,
  createJWTUniqueID,
  createJWTToken,
  createFrontUserToken,
  responseBodyEncryptionUnprotected,
} from "../../utils/common/jwtToken";
import usersSessionModal from "../../models/users/usersSession";
import Cookies from "cookies";
import CryptoJS from "crypto-js";
import parser from "ua-parser-js";
import Joi from "joi";
import rateLimit from "../../utils/common/rate-limit";
import moment from "moment";
import axios from "axios";
import userRegistrationFeesModal from "../../models/users/userRegistrationFees";
import { checkTransaction } from "../../utils/common/transactionChecking";
import unprotectedmiddleware from "../../middleware/unprotectedmiddleware";
import { getRedisClient } from "../../utils/connection/redisconnection";

/**
 * @api {post} /api/login Login into deswap
 * @apiName Login
 * @apiBody {String} email Email of the user
 * @apiBody {String} password Password of the user
 * @apiGroup Authentication
 * @apiVersion 1.0.0
 * @apiSuccessExample {json} Success-Response:
 * {
 *  "data": "encryptedtoken"
 *  "type": "noauth"
 * }
 * @apiErrorExample {json} Error-Response:
 * {
 * "error": "Invalid login"
 * }
 *
 */
const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 1000, // Max 1000 users per second
});
const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: false,
  convert: true,
};

const sendLoginEmail = async (emailid, useragent) => {
  try {
    let tDate = new Date();

    let utcDate = tDate.toUTCString();

    let pathTotemplate = await resolve("templates/email/login.ejs");

    let htmltempate = await ejs.renderFile(pathTotemplate, {
      OS: useragent.os.name + " " + useragent.os.version,
      Browser: useragent.browser.name,
      loginTime: utcDate,
    });

    let result = await sendEmail({
      toAddress: emailid,
      subject: "Deswap login",
      bodyText: "Thank you for login on Deswap",
      bodyHTML: htmltempate,
    });
  } catch (e) {
    //
    console.log("Failed to send login mail", e);
  }
};

const sendOTPMail = async (emailid, data) => {
  try {
    let pathTotemplate = await resolve(
      "templates/email/userverificationcode.ejs"
    );

    let htmltempate = await ejs.renderFile(pathTotemplate, {
      verificationCode: data,
    });

    let result = await sendEmail({
      toAddress: emailid,
      subject: "Deswap Login code",
      bodyText: "Thank you for login on Deswap",
      bodyHTML: htmltempate,
    });
  } catch (e) {
    console.log("Failed to send login mail ", e);
  }
};

const sendMaliciousIPEmail = async (data) => {
  try {
    let pathTotemplate = await resolve("templates/email/maliciousip.ejs");

    let htmltempate = await ejs.renderFile(pathTotemplate, {
      useremail: data.email,
      ip: data.ip,
      url: data.url,
      url2: data.url2,
    });

    let result = await sendEmail({
      toAddress: process.env.NEXT_PUBLIC_SMTP_ADMIN_MAIL,
      subject: "Malicious IP",
      bodyText: "Please check user IP",
      bodyHTML: htmltempate,
    });
  } catch (e) {
    //
    console.log("Failed to send verification mail ", e);
  }
};

const Login = async (req, res) => {
  try {
    const cookies = new Cookies(req, res);

    await cookies.set(process.env.DOMAIN_NAME, "", {
      expires: new Date(0),
      sameSite: "strict",
      //secure:true
    });

    await cookies.set(process.env.FRONT_END_COOKIE_NAME, "", {
      expires: new Date(0),
      sameSite: "strict",
      //secure:true
    });

    let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
    let ipToCheck = ip;

    if (ip.includes(",")) {
      ipToCheck = ip.split(",")[0];
    }

    let countryData = {
      country_name: "",
      region_name: "",
    };

    let result = await axios
      .get(
        `https://api.freegeoip.app/json/${ipToCheck}?apikey=${process.env.GET_COUNTRY_API}`
      )
      .catch((err) => {
        console.log(
          "Failed to get country :",
          err.response.data.message,
          "\n Email : ",
          req.body.email,
          "IP Address : ",
          ip
        );
      });
    let data = null;
    if (result && result != null) {
      data = result.data;
    }

    if (data) {
      countryData = data;
    }

    await limiter.check(res, 200, "CACHE_TOKEN");
    if (req.method !== "POST") {
      res.status(400).json({ data: null, error: "Invalid Method" });
      return;
    }

    const re =
      /^([a-z0-9\.-]{2,25})@([a-z\d]{2,20})\.([a-z\.-]{2,8})(\.[a-z]{2,8})?$/;
    const oneletteronenumberonechacter =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    let loginValidator = await Joi.object({
      email: Joi.string().trim().email().regex(re).required().messages({
        "string.pattern.base": `Invalid email id. Only - . special characters allowed , 0-9 and alphabat`,
      }),
      password: Joi.string()
        .regex(oneletteronenumberonechacter)
        .trim()
        .min(4)
        .required()
        .messages({
          "string.pattern.base": `Password must have at one character, one number and one special character`,
        }),
    });

    const { error, value } = loginValidator.validate(req.body, options);

    await getMongoDBConnection();

    if (error) {
      res
        .status(400)
        .json({ data: null, error: "Failed to login empty feilds" });
      return;
    }

    value.email = value.email.toLowerCase();

    req.body = value;

    let userAgent = await parser(req.headers["user-agent"]);
    let userAgentString = await JSON.stringify(userAgent);

    let userInfo = await userModel.findOne({
      emailid: req.body.email,
    });

    if (userInfo === null) {
      res.status(400).json({ data: null, error: "Failed to login" });
      return;
    }

    if (userInfo.status != "Active") {
      res.status(400).json({ data: null, error: "In active User" });
      return;
    }
    //check if user is User or Admin
    if (userInfo.role != "User") {
      res.status(400).json({ data: null, error: "invalid user" });
      return;
    }
    if (userInfo.maxfailedLoginAttemps >= 6) {
      res.status(400).json({ data: null, error: "Max login attemps exeded" });
      return;
    }

    // Checking password
    let userloggedIn = await compare(req.body.password, userInfo.password);

    // Checking if registeration transaction is valid or not
    if (!userInfo.transactionVerified) {
      //Transaction not verified
      let usertransaction = await userRegistrationFeesModal.findOne({
        uuid: userInfo._id,
      });

      //
      if (usertransaction) {
        //Checking wether difference in percentage is set or not
        if (usertransaction.percentageChangeError) {
          if (
            usertransaction.percentageChangeError < -5 &&
            userInfo.transactionVerified != true
          ) {
            //TO DO : right function to send email to admin that user is facing issue
            res.status(400).json({ data: null, error: "Invalid transaction" });
            return;
          }
        }
        //If Transaction hash exists then
        let validTransactionORNot = await checkTransaction(
          userInfo.walletaddress[userInfo.walletaddress.length - 1],
          usertransaction.txHash
        );
        if (!validTransactionORNot.status) {
          //Transaction not valid
          let currentDate = await moment();
          let transactionSaveDate = await moment(usertransaction.created_at);
          let differenceInMinute = currentDate.diff(
            transactionSaveDate,
            "minutes"
          );
          if (differenceInMinute > 1) {
            //Difference is greater than 10 min and not verified so send email
            if (!userInfo.informedMagement) {
              await sendInvalidTransactionHashEmaild({
                email: req.body.email,
                userusername: userInfo.username,
                txHash: usertransaction.txHash,
                walletaddress:
                  userInfo.walletaddress[userInfo.walletaddress.length - 1],
              }).catch((sendMailError) => {
                console.log("Failed to send email ", sendMailError);
              });
              await userModel.findOneAndUpdate(
                { emailid: req.body.email },
                { $set: { informedMagement: true } }
              );
            }
          }
        } else {
          //Transaction is valid updating it status to true
          await userModel.findOneAndUpdate(
            { emailid: req.body.email },
            { $set: { transactionVerified: true } }
          );
        }
      }
    }

    if (!userloggedIn) {
      //increase login attempt
      let userdata = await userModel.findOneAndUpdate(
        { emailid: req.body.email },
        { $inc: { maxfailedLoginAttemps: 1 } }
      );
      res.status(400).json({
        data: null,
        error: "Failed to login",
        remaining: 6 - userdata.maxfailedLoginAttemps,
      });
      return;
    } else {
      //reset maxfailedLoginAttemps
      await userModel.findOneAndUpdate(
        { emailid: req.body.email },
        { $set: { maxfailedLoginAttemps: 1 } }
      );
      const theVerificationCode = await userInfo.verification();
      const isSaveVerification = await userInfo.save();
      await sendOTPMail(userInfo.emailid, theVerificationCode);
    }

    //Login time
    let loginTime = await Math.round(Number(new Date()));

    // Refresh token
    let refreshToken = await createUserRefreshToken();

    // Create JWT Unique
    let jwtUid = await createJWTUniqueID();

    // Creating JWT Token
    let jwtToken = await createJWTToken({
      uuid: userInfo._id,
      time: loginTime,
      jwtUid: jwtUid,
      role: userInfo.role,
      emailid: userInfo.email,
      uid: userInfo.uuid,
    });

    // Frontend token
    let frontendToken = await createFrontUserToken({
      uuid: userInfo.uuid,
      time: loginTime,
      verificationStatus: userInfo.emailVerified,
      emailid: userInfo.emailid,
      role: userInfo.role,
      messageCodeAuth: false,
    });

    //
    let jwtExpiryTime = new Date();
    jwtExpiryTime.setMonth(jwtExpiryTime.getMonth() + 2);

    //
    let sessionID = await usersSessionModal.insertMany([
      {
        uuid: userInfo._id,
        refreshToken: refreshToken,
        refreshTokenExpiryDate: jwtExpiryTime,
        jwtTokenUuid: jwtUid,
        clientAgent: userAgentString,
        ipv6: ip,
        Country: countryData.country_name,
        state_city: countryData.region_name,
      },
    ]);

    let updateAfterTime = await moment.utc().subtract(20, "minutes");
    /*
        let deleteLateEntry = await usersSessionModal.updateMany({
            uuid: userInfo._id,
            updatedAt: {
                $lte: deleteDataAfterTime,
            },
        });
        */
    //let cookieDataFrontend = await JSON.stringify(frontendToken);

    let cookieData = await JSON.stringify({
      refreshToken: refreshToken,
      jwtToken: jwtToken,
    });

    //Frontend token
    let encryptedFrontendKey = await CryptoJS.AES.encrypt(
      frontendToken,
      process.env.FRONTEND_COOKIES_SECRET_KEY
    ).toString();

    //Server token
    let encryptedKey = await CryptoJS.AES.encrypt(
      cookieData,
      process.env.COOKIES_SECRET_KEY
    ).toString();

    //TO DO : Change cookie instead of maxAge add date to live
    let cookiesetfronend = await cookies.set(
      process.env.FRONT_END_COOKIE_NAME,
      encryptedFrontendKey,
      {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "strict",
        //secure:true
      }
    );

    //TO DO : Change cookie instead of maxAge add date to live
    let cookiesetdomain = await cookies.set(
      process.env.DOMAIN_NAME,
      encryptedKey,
      {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "strict",
        //secure:true
      }
    );

    let redisClient = await getRedisClient();
    let userdetailsOnRedis = await redisClient.get(userInfo._id);
    //
    if (!userdetailsOnRedis) {
      //If doesnt exits then setting
      let dataToInsert = {};

      dataToInsert[jwtUid] = {
        backendJWTTokenID: jwtUid,
        backendTokenRefreshStatus: false,
        frontendTokenRefreshStatus: false,
        frontendID: userInfo.uuid,
      };
      /*
      dataToInsert[sessionID[sessionID.length - 1]._id] = {
        backendJWTTokenID: jwtUid,
        backendTokenRefreshStatus: false,
        frontendTokenRefreshStatus: false,
        frontendID: userInfo.uuid,
      };
      */
      console.log("Login : Inserting to redist client : ", dataToInsert);
      dataToInsert = JSON.stringify(dataToInsert);
      console.log("Redis client set : ", userInfo._id, dataToInsert);
      let settingData = await redisClient.set(userInfo._id, dataToInsert);
      console.log("Login : Data inserted : ", settingData);
    } else {
      console.log(
        "Login : \n User already exits so setting it again ",
        userdetailsOnRedis
      );
      userdetailsOnRedis = JSON.parse(userdetailsOnRedis);

      console.log(
        Object.keys(userdetailsOnRedis),
        "Lenght : ",
        Object.keys(userdetailsOnRedis).length
      );
      if (Object.keys(userdetailsOnRedis).length > 6) {
        //
        userdetailsOnRedis = {};
      }
      userdetailsOnRedis[jwtUid] = {
        backendJWTTokenID: jwtUid,
        backendTokenRefreshStatus: false,
        frontendTokenRefreshStatus: false,
        frontendID: userInfo.uuid,
      };

      userdetailsOnRedis = JSON.stringify(userdetailsOnRedis);
      console.log("Redis client set : ", userInfo._id, userdetailsOnRedis);
      await redisClient.set(userInfo._id, userdetailsOnRedis);
      //redisClient.get(userInfo._id, dataToInsert);
    }
    console.log("!!! Login ");
    //console.log("Login : ", userdetailsOnRedis);
    console.log(
      "Login : checking if value is set ot not ",
      await redisClient.get(userInfo._id)
    );

    await redisClient.quit();
    res.setHeader("response-security", true);
    res.status(200).json({
      data: await responseBodyEncryptionUnprotected({
        data: "Success",
        error: null,
        user: {
          emailid: userInfo.email,
          address: userInfo.walletaddress[userInfo.walletaddress.length - 1],
          accountverified: userInfo.emailVerified,
          role: userInfo.role,
          uuid: userInfo.uuid,
        },
      }),
      type: "noauth",
    });

    /*
        res.status(200).json({
            data: "Success",
            error: null,
            user: {
                emailid: userInfo.email,
                address: userInfo.walletaddress[userInfo.walletaddress.length - 1],
                accountverified: userInfo.emailVerified,
                role: userInfo.role,
                uuid: userInfo.uuid,
            },
        });*/
    //Sending email to user
    await sendLoginEmail(req.body.email, userAgent).catch(console.error);
  } catch (e) {
    console.log("Failed to login Error : ", e);
    res.status(400).json({
      data: null,
      error: "Failed to login",
    });
  }
};

export default unprotectedmiddleware(Login);
