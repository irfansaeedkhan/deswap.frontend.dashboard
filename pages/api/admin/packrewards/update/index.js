import adminmiddleware from "../../../../../middleware/adminmiddleware";
import getMongoDBConnection from "../../../../../utils/connection/mongodbconnection.js";
import PackDetails from "../../../../../models/deswapPack/packdetails";
import PurchasedPack from "../../../../../models/deswapPack/purchasedpack";
import PackClaimmed from "../../../../../models/claimmedrewards/packclaimmed";
import { responseBodyEncryptionAdmin } from "../../../../../utils/common/jwtToken"
import joi, { options } from "joi";
import ejs from "ejs";
import { resolve } from "path";
import { sendEmail } from "../../../../../utils/common/email";

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
        subject: "Admin sent rewards to user "+data.emailid,
        bodyText: "Admin sent rewards to user "+data.publickey,
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

        const schema = joi.object({
            claimid: joi.string().required(),
            txhash: joi.string().required(),
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

        //Updating Status to active
        let updatedPack = await PackClaimmed.updateOne({
            _id: packclaimDetails._id
        }, {
            $set: {
                TxHash: req.body.txhash,
                Amount:req.body.amountSent,
                Status: "Active"
            },
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
            incommingtxhash:req.body.txhash,
            amountInMatic:req.body.amountSent,
            correctAmountInMatic:"",
            transactionStatus:"Active",
            IssueWithTransaction:"",
            purpose:"Admin sent clamming pack rewards to users",
            percentageerror:""
        }).catch((error)=>{
            console.log("Failed to email ",error)
        })
    } catch (e) {
        console.log(e);
        res.status(400)
            .json({ data: null, error: "Failed to fetch" + "\n" + e.message });
    }
};

export default adminmiddleware(handler);