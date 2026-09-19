import getMongoDBConnection from "../../utils/connection/mongodbconnection";
import UserRegisterationSchema from "../../models/Users";
import ejs from "ejs";
import { resolve } from "path";
import { sendEmail } from "../../utils/common/email";
import unprotectedmiddleware from "../../middleware/unprotectedmiddleware";


const nodemailer = require("nodemailer");

/**
 * @api {post} /api/resend Resend OTP
 * @apiName ResendOTP
 * @apiGroup Authentication
 * @apiVersion 1.0.0
 * @apiDescription This api is used to resend OTP
 * @apiBody {String} emailid Email ID
 * @apiExample {axios} Example usage:
 *  axios.post('/api/resend', {
 *   emailid: "example@gmail.com",
 * })
 * @apiErrorExample {json} Error-Response:
 *   HTTP/1.1 400 Bad Request
 * {
 *  "data": null,
 * "error": "Invalid emailid",
 * "success": false
 * }
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 * {
 * "data": "encrypted data",
 * "error": null,
 * }
 */

const sendOTPMail = async (emailid, data)=>{
  try{
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

  }catch(e){
    console.log("Failed to send login mail ",e);
  }
}
const ResendOTP = async (req, res) => {
  const { emailid } = req.body;

  try {
    await getMongoDBConnection();

    const isFound = await UserRegisterationSchema.findOne({ emailid:emailid });

    if (!isFound) {
      return res.json({
        message: "try login again ",
        success: false,
      });
    }

    const theVerificationCode = await isFound.verification();
    const isSaveVerification = await isFound.save();
    await sendOTPMail(isFound.emailid, theVerificationCode)
    return res.json({
      message: "successfully send",
      success: true,
    });

  } catch (error) {
    console.log(error)
    return res.json({
      message: "request failed try again !",
      success: false,
    });
  }
};

export default unprotectedmiddleware(ResendOTP);
