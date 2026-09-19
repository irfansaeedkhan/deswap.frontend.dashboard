import adminmiddleware from "../../../../../middleware/adminmiddleware";
import getMongoDBConnection from "../../../../../utils/connection/mongodbconnection";
import Users from "../../../../../models/Users";
import userRegistrationFees from "../../../../../models/users/userRegistrationFees";
import { responseBodyEncryptionAdmin } from "../../../../../utils/common/jwtToken";
import joi from "joi";
import ejs from "ejs";
import { resolve } from "path";
import { sendEmail } from "../../../../../utils/common/email";

const informAdminAboutRequest = async(data)=>{
    try{
        let tDate = new Date();
  
        let utcDate = tDate.toUTCString();
    
        let pathTotemplate = await resolve("templates/email/admin/update.ejs");
    
        let htmltempate = await ejs.renderFile(pathTotemplate, {
            data
        });
    
        let result = await sendEmail({
            toAddress: process.env.NEXT_PUBLIC_SMTP_ADMIN_MAIL,
            subject: "Update Registeration Fee of "+data.publickey,
            bodyText: "Update Registeration Fee : "+data.publickey,
            bodyHTML: htmltempate,
        });
    }catch(e){
        console.log("!!!! Failed to send email",emaildata)
    }
}

const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: false,
    convert: true,
};

const handler = async(req, res) => {
    //
    try {
        if (req.method !== "POST") {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }

        await getMongoDBConnection();
        const schema = joi.object().keys({
            claimid: joi.string().required(),
            requestStatus: joi.string().allow("").optional(),
            transactionStatus: joi.boolean().allow("").optional(),
        });

        const { error, value } = schema.validate(req.body, options);

        if (error) {
            res.status(400).json({ data: null, error: error.details[0].message });
            return;
        }


        let userRegistrationFeesValue = await userRegistrationFees.findOne({
            _id: req.body.claimid,
            Status: "Requested"
        }).populate({ path: "uuid", select: 'emailid walletaddress' });

        if (!userRegistrationFeesValue) {
            res.status(400).json({ data: null, error: "Failed to update" });
            return
        }


        let updateObject = {}
        if (req.body.requestStatus == "Rejected") {
            updateObject.RejectedOn = new Date();
            updateObject.RejectReason = req.body.rejectReason;
            updateObject.status = req.body.requestStatus;
        } else if (req.body.requestStatus != "") {
            updateObject.RejectedOn = null;
            updateObject.status = req.body.requestStatus;
        }


        if (req.body.transactionStatus != "") {

            if (req.body.transactionStatus == "true" || req.body.transactionStatus == true) {
                //
                updateObject.validTransaction = true
            } else {
                //
                updateObject.validTransaction = false
            }
        }

        await userRegistrationFees.updateOne({
            _id: req.body.claimid,
            status: "Requested"
        }, {
            $set: updateObject,
        });

        res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryptionAdmin({ data: "Updated Successfully", error: null }), type: "adminauth" });

        await informAdminAboutRequest({
            id:userRegistrationFeesValue._id,
            publickey:userRegistrationFeesValue.uuid.walletaddress[userRegistrationFeesValue.uuid.walletaddress.length-1],
            emailid:userRegistrationFeesValue.uuid.emailid,
            purpose:"Update Registration Fee",
            status:req.body.requestStatus,
            validTransaction:updateObject.validTransaction,
            rejectReason:req.body.rejectReason
        }).catch((error)=>{
            console.log("Failed to send mail",error)
        })
    } catch (e) {
        console.log(e);
        res.status(400).json({ data: null, error: "Failed to update" });
    }
}

export default adminmiddleware(handler);