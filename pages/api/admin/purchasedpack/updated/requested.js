import getMongoDBConnection from "../../../../../utils/connection/mongodbconnection";
import ejs from "ejs";
import { resolve } from "path";
import { sendEmail } from "../../../../../utils/common/email";
import Users from "../../../../../models/Users";
import ClammingPack from "../../../../../models/deswapPack/packdetails"
import PurchasedClammingPack from "../../../../../models/deswapPack/purchasedpack";
import adminmiddleware from "../../../../../middleware/adminmiddleware";
import { responseBodyEncryptionAdmin } from "../../../../../utils/common/jwtToken"
import Joi from "joi";

const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: false,
    convert: true,
  };

const sendInformationToAdmin = async (data) => {
    try {
      let pathTotemplate = await resolve("templates/email/admin/packpurchased.ejs");
      
      //
      let htmltempate = await ejs.renderFile(pathTotemplate, {
        emailid: data.emailid,
        publickey:data.publickey,
        packname:data.packname,
        quantity:data.quantity,
        txhash:data.incommingtxhash,
        amountInMatic:data.amountInMatic,
        correctAmountInMatic:data.correctAmountInMatic,
        transactionStatus:data.transactionStatus,
        IssueWithTransaction:data.IssueWithTransaction,
        percentageerror:data.percentageerror,
        purpose:data.purpose
      });
  
      let result = await sendEmail({
        toAddress: process.env.NEXT_PUBLIC_SMTP_ADMIN_MAIL,
        subject: "Clamming pack purchased by user "+data.emailid,
        bodyText: "Clamming pack purchased by user "+data.publickey,
        bodyHTML: htmltempate
      });
    } catch (e) {
      //
      console.log("Failed to send verification mail ", e);
    }
}

const handler = async(req, res) => {
    try {

        if (req.method !== "POST") {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }

        await getMongoDBConnection();
        const schema = Joi.object({
            claimid: Joi.string().required(),
            requestStatus: Joi.string().allow("").optional(),
            rejectReason: Joi.string().allow("").optional(),
            transactionStatus: Joi.string().allow("").optional(),
        });

        const { error, value } = schema.validate(req.body, options);
        if (error) {
            res.status(400).json({ data: null, error: "Failed to register"});
            return;
        }
        
        let purchasedPackDetails = await PurchasedClammingPack.findOne({
            Status: { $in: ["Requested"] }
        }).populate({ path: 'UserID', select: 'emailid username walletaddress' }).populate({ path: "PackID" })


        if (!purchasedPackDetails) {
            res.status(400).json({ data: null, error: "Invalid request" });
            return
        }

        let updateObject = {}
        if (req.body.requestStatus == "Rejected") {
            updateObject.requestRejectedOn = new Date();
            updateObject.TransactionInvalidReason = req.body.rejectReason;
            updateObject.Status = req.body.requestStatus;
        } else if (req.body.requestStatus != "") {
            updateObject.requestRejectedOn = null;
            updateObject.Status = req.body.requestStatus;
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

        let data = await PurchasedClammingPack.updateOne({
            _id: req.body.claimid
        }, {
            $set: updateObject,
        });

        res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryptionAdmin({ data: "Updated successfully", error: null }), type: "adminauth" });

        await sendInformationToAdmin({
            emailid:purchasedPackDetails.UserID.emailid,
            publickey:purchasedPackDetails.UserID.walletaddress[purchasedPackDetails.UserID.walletaddress.length-1],
            packname:purchasedPackDetails.PackID.PackName,
            quantity:purchasedPackDetails.Quantity,
            incommingtxhash:purchasedPackDetails.TxHash,
            amountInMatic:purchasedPackDetails.TotalAmountInMatic,
            correctAmountInMatic:purchasedPackDetails.TotalCorrectAmountInMatic,
            transactionStatus:updateObject.Status,
            IssueWithTransaction:req.body.requestStatus,
            purpose:"Pack status updated",
            percentageerror:0
        }).catch((error)=>{
            console.log("Error : ",error)
        })

    } catch (e) {
        console.log("Error while fetching requested ", e);
        res.status(400).json({ data: null, error: "Failed to fetch" });
    }
}

export default adminmiddleware(handler);