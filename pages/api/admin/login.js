import { compare } from "bcryptjs";
import { sendEmail } from "../../../utils/common/email";
import ejs from "ejs";
import { resolve } from "path";
import userModel from "../../../models/Users";
import getMongoDBConnection from "../../../utils/connection/mongodbconnection.js";
import {
    createUserRefreshToken,
    createJWTUniqueID,
    createJWTToken,
    createFrontUserToken,
    createFrontAdminToken,
    responseBodyEncryptionUnprotected
} from "../../../utils/common/jwtToken";
import usersSessionModal from "../../../models/users/usersSession";
import Cookies from "cookies";
import CryptoJS from "crypto-js";
import parser from "ua-parser-js";
import Joi from "joi";
import rateLimit from "../../../utils/common/rate-limit";
import moment from "moment";
import axios from "axios";
import userRegistrationFeesModal from "../../../models/users/userRegistrationFees"
import { checkTransaction } from "../../../utils/common/transactionChecking";
import unprotectedmiddleware from "../../../middleware/unprotectedmiddleware";
import ipBlock from "../../../models/users/ipbasedAccess";
import IPAccessToken from "../../../models/users/ipAccessToken";
const geoip = require('geoip-lite');
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

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}
const sendOTPMail = async (emailid, data) => {
    try {
        let pathTotemplate = await resolve("templates/email/userverificationcode.ejs");

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
}


const sendMaliciousIPEmail = async (data) => {
    try {
        let pathTotemplate = await resolve("templates/email/maliciousip.ejs");

        let htmltempate = await ejs.renderFile(pathTotemplate, {
            email: data.email,
            ip: data.ip,
            url: data.url,
        });

        let result = await sendEmail({
            toAddress: process.env.NEXT_PUBLIC_SMTP_ADMIN_MAIL,
            subject: "Malicious IP",
            bodyText: "Please check user IP",
            bodyHTML: htmltempate
        });
    } catch (e) {
        //
        console.log("Failed to send verification mail ", e);
    }
}
const sendInvalidTransactionHashEmaild = async (data) => {
    try {
        let pathTotemplate = await resolve("templates/email/invalidtxhashlogin.ejs");

        //
        let htmltempate = await ejs.renderFile(pathTotemplate, {
            useremail: data.email,
            txhash: data.txHash,
            walletaddress: data.walletaddress
        });

        let result = await sendEmail({
            toAddress: process.env.NEXT_PUBLIC_SMTP_ADMIN_MAIL,
            subject: "Invalid transaction hash",
            bodyText: "Please check user transaction hash",
            bodyHTML: htmltempate
        });
    } catch (e) {
        //
        console.log("Failed to send verification mail ", e);
    }
}

const Login = async (req, res) => {
    try {

        const cookies = new Cookies(req, res);

        await cookies.set(process.env.DOMAIN_NAME, '', {
            expires: new Date(0),
            sameSite: 'strict',
            //secure:true
        })

        await cookies.set(process.env.FRONT_END_COOKIE_NAME, '', {
            expires: new Date(0),
            sameSite: 'strict',
            //secure:true
        })

        let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
        let ipToCheck = ip;

        if (ip.includes(",")) {
            ipToCheck = ip.split(",")[0]
        }


        let countryData = {
            country_name: "",
            region_name: "",
        };

        let result = await axios.get(`https://api.freegeoip.app/json/${ipToCheck}?apikey=${process.env.GET_COUNTRY_API}`).catch((err) => {
            console.log("Failed to get country :", err.response.data.message, "\n Email : ", req.body.email, "IP Address : ", ip);
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

        const re = /^([a-z0-9\.-]{2,25})@([a-z\d]{2,20})\.([a-z\.-]{2,8})(\.[a-z]{2,8})?$/;
        const oneletteronenumberonechacter = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;


        let loginValidator = await Joi.object({
            email: Joi.string().trim().email().regex(re).required().messages({
                "string.pattern.base": `Invalid email id. Only - . special characters allowed , 0-9 and alphabat`
              }),
            password: Joi.string().regex(oneletteronenumberonechacter).trim().min(4).required(),
        });

        const { error, value } = loginValidator.validate(req.body, options);

        await getMongoDBConnection();

        if (error) {
            res.status(400).json({ data: null, error: "Failed to login empty feilds" });
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
        if (userInfo.role != "DeswapAdminRole") {
            res.status(400).json({ data: null, error: "invalid user" });
            return;
        }

        if (userInfo.maxfailedLoginAttemps >= 6) {
            res.status(400).json({ data: null, error: "Max login attemps exeded" });
            return;
        }

        let userloggedIn = await compare(req.body.password, userInfo.password);

        //check if users ip is available in the list of blocked ip and Blocked is true
        let isIPBlocked = await ipBlock.findOne({
            IPv4: ipToCheck,
        });


        //check if Blocked is true or not
        if (isIPBlocked && isIPBlocked.Blocked == true) {
            //If IP address is blocked then sending request to user email 
            const ipAccessToken = await IPAccessToken.findOne({ ip: isIPBlocked._id });
            //Sending email to user
            await sendMaliciousIPEmail({
                email: req.body.email,
                ip: ipToCheck,
                url: `${process.env.DOMAIN_NAME}/grantaccess/${ipAccessToken.Token}`
            });
            //
            res.status(400).json({ data: null, error: "Blocked due to security reason" });
            return;
        }

        //If Ip address doesn't saved in database then
        if (!isIPBlocked) {
            //get geoip lokup data
            let ipBlockData = {
                IPv4: ipToCheck,
                //IPv6: "",
                //add discription of the ip with the time it was blocked
                Description: `${new Date()} ip blocked by by system`,
                Blocked: true,
                RequestedIPLocation: ipToCheck
            };

            //Creating database
            let ipBlockResult = await ipBlock.create(ipBlockData);
            if (!ipBlockResult) {
                res.status(400).json({ data: null, error: "Failed to block ip" });
                return;
            }

            //create an access token for the url and store it in the database
            let token = {
                ip: ipBlockResult._id,
                Token: makeid(16),
                Expires: Date.now() + 1000 * 60 * 10
            }

            let tokenResult = await IPAccessToken.create(token);
            
            //Creating token
            let tokenenc = await encodeURIComponent(tokenResult.Token);
            await sendMaliciousIPEmail({
                email: req.body.email,
                ip: ipToCheck,
                url: `${process.env.DOMAIN_NAME}/grantaccess/${tokenenc}`
            });

            res.status(400).json({ data: null, error: "IP is blocked" });
            return;
        }


        if (!userInfo.transactionVerified) {
            //Transaction not verified
            let usertransaction = await userRegistrationFeesModal.findOne({
                uuid: userInfo._id
            })

            if (usertransaction) {

                //Checking wether difference in percentage is set or not
                if (usertransaction.percentageChangeError) {
                    if ((usertransaction.percentageChangeError < -5) && (userInfo.transactionVerified != true)) {
                        //TO DO : right function to send email to admin that user is facing issue
                        res.status(400).json({ data: null, error: "Invalid transaction" });
                        return;
                    }
                }
                //If Transaction hash exists then
                let validTransactionORNot = await checkTransaction(userInfo.walletaddress[userInfo.walletaddress.length - 1], usertransaction.txHash)
                if (!validTransactionORNot.status) {
                    //Transaction not valid
                    let currentDate = await moment();
                    let transactionSaveDate = await moment(usertransaction.created_at)
                    let differenceInMinute = currentDate.diff(transactionSaveDate, "minutes")
                    if (differenceInMinute > 1) {
                        //Difference is greater than 10 min and not verified so send email
                        if (!userInfo.informedMagement) {
                            await sendInvalidTransactionHashEmaild({
                                email: req.body.email,
                                userusername: userInfo.username,
                                txHash: usertransaction.txHash,
                                walletaddress: userInfo.walletaddress[userInfo.walletaddress.length - 1],
                            }).catch((sendMailError) => {
                                console.log("Failed to send email ", sendMailError)
                            })
                            await userModel.findOneAndUpdate({ emailid: req.body.email }, { $set: { informedMagement: true } })
                        }
                    }
                } else {
                    //Transaction is valid updating it status to true
                    await userModel.findOneAndUpdate({ emailid: req.body.email }, { $set: { transactionVerified: true } })
                }
            }
        }
        if (!userloggedIn) {
            //increase login attempt
            let userdata = await userModel.findOneAndUpdate({ emailid: req.body.email }, { $inc: { maxfailedLoginAttemps: 1 } });
            res.status(400).json({ data: null, error: "Failed to login", remaining: 6 - userdata.maxfailedLoginAttemps });
            return;
        } else {
            //reset maxfailedLoginAttemps 
            await userModel.findOneAndUpdate({ emailid: req.body.email }, { $set: { maxfailedLoginAttemps: 1 } });
            const theVerificationCode = await userInfo.verification();
            const isSaveVerification = await userInfo.save();
            await sendOTPMail(userInfo.emailid, theVerificationCode)
        }
        let loginTime = await Math.round(Number(new Date()));

        let refreshToken = await createUserRefreshToken();

        let jwtUid = await createJWTUniqueID();

        let jwtToken = await createJWTToken({
            uuid: userInfo._id,
            time: loginTime,
            jwtUid: jwtUid,
            role: userInfo.role,
            emailid: userInfo.email,
            uid: userInfo.uuid,
        });

        let frontendToken = await createFrontAdminToken({
            uuid: userInfo.uuid,
            time: loginTime,
            verificationStatus: userInfo.emailVerified,
            emailid: userInfo.emailid,
            role: userInfo.role,
            ip: ipToCheck,
            messageCodeAuth: false
        });


        let jwtExpiryTime = new Date();
        jwtExpiryTime.setMonth(jwtExpiryTime.getMonth() + 2);

        await usersSessionModal.insertMany([{
            uuid: userInfo._id,
            refreshToken: refreshToken,
            refreshTokenExpiryDate: jwtExpiryTime,
            jwtTokenUuid: jwtUid,
            clientAgent: userAgentString,
            ipv6: ip,
            Country: countryData.country_name,
            state_city: countryData.region_name,
        },]);

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


        //frontendToken
        let encryptedFrontendKey = await CryptoJS.AES.encrypt(
            frontendToken,
            process.env.FRONTEND_COOKIES_SECRET_KEY
        ).toString();


        let encryptedKey = await CryptoJS.AES.encrypt(
            cookieData,
            process.env.COOKIES_SECRET_KEY
        ).toString();



        //TO DO : Change cookie instead of maxAge add date to live
        let cookiesetfronend = await cookies.set(
            process.env.FRONT_END_COOKIE_NAME,
            encryptedFrontendKey, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "strict",
            //secure:true
        }
        );



        //TO DO : Change cookie instead of maxAge add date to live
        let cookiesetdomain = await cookies.set(
            process.env.DOMAIN_NAME,
            encryptedKey, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "strict",
            //secure:true
        }
        );


        res.setHeader('response-security', true)
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
            type: "noauth"
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
        await sendLoginEmail(req.body.email, userAgent).catch(console.error);
    } catch (e) {
        console.log("Error : ", e);
        res.status(400).json({
            data: null,
            error: "Failed to login",
        });
    }
}

export default unprotectedmiddleware(Login);