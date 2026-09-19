import getMongoDBConnection from "../../../../utils/connection/mongodbconnection";
import UserModal from "../../../../models/Users";
import usermiddleware from "../../../../middleware/usermiddleware";
import { hash, compare } from "bcryptjs";
import { responseBodyEncryption } from "../../../../utils/common/jwtToken"

import Joi from "joi";
/**
 * @api {post} /api/users/profile/updatepassword Update Password
 * @apiName Update Password
 * @apiGroup User/Profile
 * @apiVersion 1.0.0
 * @apiDescription Update Password
 * @apiBody {String} password New Password
 * @apiBody {String} oldpassword Old Password
 * @apiExample {axios} Example usage:
 * axios.post('/api/users/profile/updatepassword', {
 *     password: "newpassword",
 *    oldpassword: "oldpassword"
 * })
 * @apiSuccess {json} Success-response:
 * {
 *    "data": "Successfully updated password",
 *   "error": null
 * }
 * @apiError {json} Error-response:
 * {
 *   "data": null,
 *  "error": "Failed to update password"
 * }
 * 
 * 
 * 
 * 
 */
const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: false,
    convert: true,
};
//make function for sending email
const sendResetPasswordEmail = async(emailid) => {
    try {
        let pathTotemplate = await resolve("templates/email/resetpassword.ejs");
        let verificationurl = `${process.env.PLATFORM_URL}`;
        let htmltempate = await ejs.renderFile(pathTotemplate, {
            emailID: emailid,
            url: verificationurl
        });
        //console.log(htmltempate);
        let result = await sendEmail({
            toAddress: emailid,
            subject: "Password Resetted",
            bodyText: `Password updated`,
            bodyHTML: htmltempate
        });
    } catch (e) {
        //
        console.log("Failed to registeration email ", e);
    }
}


const handler = async(req, res) => {
    try {

        if (req.method !== 'POST') {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }

        const oneletteronenumberonechacter = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

        let changePasswordValidator = await Joi.object({
            oldpassword: Joi.string().regex(oneletteronenumberonechacter).trim().min(4).required(),
            password: Joi.string().regex(oneletteronenumberonechacter).trim().min(4).required()
        });

        const { error, value } = await changePasswordValidator.validate(req.body, options);

        if (error) {
            console.log(error);
            res.status(400).json({ data: null, error: "Failed to change password" });
            return;
        }

        await getMongoDBConnection();

        let userinfo = await UserModal.findOne({ _id: req.body.uuid })

        if (!userinfo) {
            res.status(400).json({ data: null, error: "Failed to change password" });
            return;
        }
        //check if user status is not active then return error
        if (userinfo.status != "Active") {
            res.status(400).json({ data: null, error: "Invalid login" });
            return;
        }
        if (req.body.password.trim() == "") {
            res.status(400).json({ data: null, error: "Failed updated password" });
            return;
        }

        if (req.body.oldpassword.trim() == "") {
            res.status(400).json({ data: null, error: "Failed updated password" });
            return;
        }

        let userloggedIn = await compare(req.body.oldpassword, userinfo.password);
        
        if(!userloggedIn){
            res.status(400).json({ data: null, error: "Failed updated password" });
            return;
        }

        let hashPassword = await hash(req.body.password, 10);
        
        let result = await UserModal.findByIdAndUpdate({ _id: req.body.uuid }, { password: hashPassword, maxfailedLoginAttemps: 0, lastpasswordOn: new Date() });

        await sendResetPasswordEmail(userinfo.email);
        res.setHeader('response-security', true)
        res.status(200).json({ data: await responseBodyEncryption({ message: "Successfully", error: null }), type: "userauth" });

    } catch (e) {
        console.log(e);
        res.status(400).json({ data: null, error: "failed to update password" });
    }
}


export default usermiddleware(handler);