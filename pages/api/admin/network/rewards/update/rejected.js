import adminmiddleware from "../../../../../../middleware/adminmiddleware";
import getMongoDBConnection from "../../../../../../utils/connection/mongodbconnection";
import Users from "../../../../../../models/Users";
import networkRewards from "../../../../../../models/network/networkRewards";
import networkclaimmed from "../../../../../../models/claimmedrewards/networkclaimmed";
import { responseBodyEncryptionAdmin } from "../../../../../../utils/common/jwtToken";
import joi from "joi";
import ejs from "ejs";
import { resolve } from "path";
import { sendEmail } from "../../../../../../utils/common/email";

const userclaimmednetworkrewards = async (data) => {
    try {
      let pathTotemplate = await resolve("templates/email/admin/networkrewardsclaimmed.ejs");
      
      //
      let htmltempate = await ejs.renderFile(pathTotemplate, {
        rewardsfrom:data.rewardsfrom,
        emailid:data.emailid,
        publickey:data.publickey,
        amount:data.amount,
        purpose:data.purpose
      });
  
      let result = await sendEmail({
        toAddress: process.env.NEXT_PUBLIC_SMTP_ADMIN_MAIL,
        subject: "Admin updated status of user network rewards "+data.emailid,
        bodyText: "Admin updated status of user network rewards "+data.publickey,
        bodyHTML: htmltempate
      });
    } catch (e) {
      //
      console.log("Failed to send verification mail ", e);
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
            outgoingtransaction: joi.string().allow("").optional(),
            transactionStatus: joi.boolean().allow("").optional(),
        });

        const { error, value } = schema.validate(req.body, options);

        if (error) {
            res.status(400).json({ data: null, error: error.details[0].message });
            return;
        }


        let networkClaimValue = await networkclaimmed.findOne({
            _id: req.body.claimid,
            Status: "Requested"
        }).populate({ path: "UserID", select: 'emailid walletaddress' });

        if (!networkClaimValue) {
            res.status(400).json({ data: null, error: "Failed to update" });
            return
        }


        let updateObject = {}
        if (req.body.requestStatus == "Rejected") {
            updateObject.RejectedOn = new Date();
            updateObject.RejectReason = req.body.rejectReason;
            updateObject.Status = req.body.requestStatus;
        } else if (req.body.requestStatus != "") {
            updateObject.RejectedOn = null;
            updateObject.Status = req.body.requestStatus;
        }

        if (req.body.outgoingtransaction != "") {
            updateObject.TxHash = req.body.outgoingtransaction
        }

        if (req.body.transactionStatus != "") {

            if (req.body.transactionStatus == "true" || req.body.transactionStatus == true) {
                //
                updateObject.TransactionValid = true
            } else {
                //
                updateObject.TransactionValid = false
            }
        }

        await networkclaimmed.updateOne({
            _id: req.body.claimid,
            Status: "Requested"
        }, {
            $set: updateObject,
        });

        await networkRewards.updateOne({
            _id: networkClaimValue.NetworkRewardsID
        }, {
            $set: {
                Status: "Active"
            }
        })

        res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryptionAdmin({ data: "Updated Successfully", error: null }), type: "adminauth" });

        await userclaimmednetworkrewards({
            rewardsfrom:"",
            emailid:networkClaimValue.UserID.emailid,
            publickey:networkClaimValue.UserID.walletaddress[networkClaimValue.UserID.walletaddress.length-1],
            amount:"",
            purpose:"Admin updated status"
        }).catch((error)=>{
            console.log("Failed to send email ",error)
        })
    } catch (e) {
        console.log(e);
        res.status(400).json({ data: null, error: "Failed to update" });
    }
}

export default adminmiddleware(handler);