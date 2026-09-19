import getMongoDBConnection from "../../../../utils/connection/mongodbconnection";
import UserModal from "../../../../models/Users";
import useremailupdatehistory from "../../../../models/users/useremailupdatehistory";
import usermiddleware from "../../../../middleware/usermiddleware";
import { responseBodyEncryption } from "../../../../utils/common/jwtToken"
import Joi from "joi";
import ejs from "ejs";
import { resolve } from "path";
import { sendEmail } from "../../../../utils/common/email";

/**
 * @api {post} /api/users/profile/updateemail/ Update user email
 * @apiName UpdateUserEmail
 * @apiGroup User/Profile
 * @apiVersion 1.0.0
 * @apiDescription Update user email
 * @apiBody {String} email New email id
 * @apiBody {String} oldemail Old email id
 * @apiExample {axios} Example usage:
 * axios.post('/api/users/profile/updateemail/',{
 *    email:"newemail"
 *   oldemail:"oldemail"
 * })
 * @apiSuccess {String} message Success message.
 * @apiSuccess {String} data User data.
 * @apiSuccessExample {json} Success-Response:
 * {
 * "data": "Encrypted data"
 * }
 * @apiError {String} message Error message.
 * @apiErrorExample {json} Error-Response:
 * {
 * "message": "Failed to update email"
 * }
 * 
 * 
 */
const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: false,
    convert: true,
};

const sendChangeEmail = async(oldemail,newemail) => {
    try {
        let pathTotemplate = await resolve("templates/email/changeemail.ejs");
        let verificationurl = `${process.env.PLATFORM_URL}`;
        let htmltempate = await ejs.renderFile(pathTotemplate, {
            oldemail: oldemail,
            newemail: newemail
        });
        //console.log(htmltempate);
        let result = await sendEmail({
            toAddress: oldemail,
            subject: "Change Email ID",
            bodyText: `Email updated`,
            bodyHTML: htmltempate
        });
    } catch (e) {
        //
        console.log("Failed to registeration email ", e);
    }
}

const handler = async(req, res) => {
    try {

        let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
        let userAgent = req.headers["user-agent"]
        
        if (req.method !== 'POST') {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }

        const re = /^([a-z0-9\.-]{2,25})@([a-z\d]{2,20})\.([a-z\.-]{2,8})(\.[a-z]{2,8})?$/;

        console.log(req.body);

        let changeEmainValidator = await Joi.object({
            email: Joi.string().trim().email().regex(re).required(),
            oldemail: Joi.string().trim().email().regex(re).required()
        });

        const { error, value } = changeEmainValidator.validate(req.body, options);

        if (error) {
            res.status(400).json({ data: null, error: "Failed to change email" });
            return;
        }

        await getMongoDBConnection();
        
        if (req.body.oldemail.trim() == "") {
            res.status(400).json({ data: null, error: "Failed updated email" });
            return;
        }


        if (req.body.email.trim() == "") {
            res.status(400).json({ data: null, error: "Failed updated email" });
            return;
        }

        let checkifnewemailidalreadyexists = await UserModal.findOne({
            emailid:req.body.email
        })

        if(checkifnewemailidalreadyexists){
            //Email id already so returning it
            res.status(400).json({ data: null, error: "Failed updated email" });
            return;
        }


        let result = await UserModal.findOneAndUpdate({ 
            _id: req.body.uuid,
            emailid:req.body.oldemail
         }, { emailid: req.body.email, emailVerified: false });
        
        await useremailupdatehistory.insertMany([{
            UserID:req.body.uuid,
            CurrentEmailID:req.body.oldemail,
            NewEmailID:req.body.email,
            UserDevice:userAgent,
            UserIP:ip,
        }])

        //TO DO : Add code to send verification mail and confirm it
        await sendChangeEmail(req.body.oldemail,req.body.email);

        res.setHeader('response-security', true)
        res.status(200).json({ data: await responseBodyEncryption({ message: "Successfully", error: null }), type: "userauth" });

    } catch (e) {
        console.log(e);
        res.status(400).json({ data: null, error: "failed to update password" });
    }
}

export default usermiddleware(handler);