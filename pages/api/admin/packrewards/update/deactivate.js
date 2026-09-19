import adminmiddleware from "../../../../../middleware/adminmiddleware";
import getMongoDBConnection from "../../../../../utils/connection/mongodbconnection.js";
import PackDetails from "../../../../../models/deswapPack/packdetails";
import PurchasedPack from "../../../../../models/deswapPack/purchasedpack";
import PackClaimmed from "../../../../../models/claimmedrewards/packclaimmed";
import { responseBodyEncryptionAdmin } from "../../../../../utils/common/jwtToken"
import Joi from "joi";
import ejs from "ejs";
import { resolve } from "path";
import { sendEmail } from "../../../../../utils/common/email";


const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: false,
    convert: true,
};

const userclaimmedpack = async (data) => {
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
        subject: "Admin updated claming pack rewards status "+data.emailid,
        bodyText: "Admin updated claming pack rewards status "+data.publickey,
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
        
        const schema = Joi.object({
            claimid: Joi.string().required(),
            requestStatus: Joi.string().allow("").optional(),
            outgoingtxhash: Joi.string().allow("").optional(),
            rejectReason: Joi.string().allow("").optional(),
        });

        const { error, value } = schema.validate(req.body, options);
        
        if (error) {
            res.status(400).json({ data: null, error: error.details[0].message });
            return;
        }

        //TO DO : Add JOI validator
        await getMongoDBConnection();

        //Fetching pack claim details that have status Requested and claim id
        let packclaimDetails = await PackClaimmed.findOne({
            _id: req.body.claimid,
            Status: "Requested"
        }).populate({ path: 'UserID', select: 'emailid username walletaddress' }).populate({ path: "PackID" }).populate({ path: "PurchasedPack" });


        if (!packclaimDetails) {
            res.status(400).json({ data: null, error: "Failed to fetch" });
            return;
        }


        //Updating Status to active
        /*
        let updatedPack = await PackClaimmed.updateOne({
            _id:packclaimDetails._id,
            Status:"Requested"
        },{
            $set: {
                TxHash: req.body.txhash,
                Status:"Active"
            },
        });*/
        let updateObject = {}
        if (req.body.requestStatus == "Rejected") {
            updateObject.RejectedOn = new Date();
            updateObject.RejectReason = req.body.rejectReason;
            updateObject.Status = req.body.requestStatus;
        } else if (req.body.requestStatus != "") {
            updateObject.RejectedOn = null;
            updateObject.Status = req.body.requestStatus;
        }

        //TxHash
        if (req.body.outgoingtxhash != "") {
            updateObject.TxHash = req.body.outgoingtxhash
        }


        let data = await PackClaimmed.updateOne({
            _id: req.body.claimid
        }, {
            $set: updateObject,
        });

        //Updating purchased pack claim to claimmed
        let updatepurchasedPackDetails = await PurchasedPack.updateOne({
            _id: packclaimDetails.PurchasedPack._id
        }, {
            $set: {
                Status: "Claimmed"
            }
        })

        //
        res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryptionAdmin({ data: "Successfull", error: null }), type: "adminauth" });
    
        await userclaimmedpack({
            emailid:packclaimDetails.UserID.emailid,
            publickey:packclaimDetails.UserID.walletaddress[packclaimDetails.UserID.walletaddress.length-1],
            packname:packclaimDetails.PurchasedPack.PackName,
            quantity:packclaimDetails.PurchasedPack.Quantity,
            incommingtxhash:req.body.outgoingtxhash,
            amountInMatic:"",
            correctAmountInMatic:"",
            transactionStatus:req.body.requestStatus,
            IssueWithTransaction:req.body.rejectReason,
            purpose:"Admin updated user clamming rewards status",
            percentageerror:""
        }).catch((error)=>{
            console.log("Failed to email ",error)
        })
    } catch (e) {
        console.log(e);
        res.status(400)
            .json({ data: null, error: "Failed to fetch" });
    }
};

export default adminmiddleware(handler);