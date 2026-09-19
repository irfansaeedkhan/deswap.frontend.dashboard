import Connection from "../../../../../db/db";
import UsersModal from "../../../../../models/Users";
import purchasedPackFees from "../../../../../models/deswapPack/purchasingFees";
import purchasedPack from "../../../../../models/deswapPack/purchasedpack";
import ejs from "ejs";
import { resolve } from "path";
import { sendEmail } from "../../../../../utils/common/email";
import usermiddleware from "../../../../../middleware/usermiddleware";
import { sendTransaction } from "../../../../../utils/wallet/sendTransaction";
import PackClaimmedSchema from "../../../../../models/claimmedrewards/packclaimmed";
import moment from "moment";
import { responseBodyEncryption } from "../../../../../utils/common/jwtToken"
//documentaiton of inset api
/** 
 * @api {post} /api/users/pack/claim/ Claim pack
 * @apiName ClaimPack
 * @apiGroup User/Pack
 * @apiVersion 1.0.0
 * @apiDescription Claim pack
 * @apiBody packid
 * @apiExample {axios} Example usage:
 * axios.post('/api/users/pack/claim/', {
 * packid: "0x0"
 * })
 * @apiSuccess {String} message Success message.
 * @apiError {String} message Error message.
 * 
*/

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
        subject: "User claimmed  pack "+data.emailid,
        bodyText: "User claimmed pack "+data.publickey,
        bodyHTML: htmltempate
      });
    } catch (e) {
      //
      console.log("Failed to send verification mail ", e);
    }
}

const handler = async(req, res) => {
    try {
        //
        if (req.method !== 'POST') {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }

        await Connection();

        //fetching user details
        //
        let purchasedPackDetails = await purchasedPack.findOne({
            UserID: req.body.uuid,
            _id: req.body.packid,
            Status: "Active"
        }).populate("UserID PackID")

        if (!purchasedPackDetails) {
            res.status(400).json({ data: null, error: "No claim" });
            return;
        }

        let currentDate = await moment();
        let purchasedCurrentDate = await moment(purchasedPackDetails.updated_at);
        let diffDuration = await moment.duration(currentDate.diff(purchasedCurrentDate))
        let differenceInMonth = await diffDuration.months();

        
        /*if (differenceInMonth < 12) {
            res.status(400).json({ data: null, error: "less than 12 months" });
            return;
        }*/

        await purchasedPack.updateMany({ _id: req.body.packid }, { $set: { Status: "Inprogress" } })

        let Bonous = purchasedPackDetails.DAW * (purchasedPackDetails.Bonous / 100)

        let totalDAWToSend = purchasedPackDetails.DAW + Bonous;

        let claimmedDetails = await PackClaimmedSchema.insertMany([{
            UserID: req.body.uuid,
            PackID: purchasedPackDetails.PackID._id,
            PurchasedPack: req.body.packid,
            PublicAddress: purchasedPackDetails.UserID.walletaddress[purchasedPackDetails.UserID.walletaddress.length-1],
            AmountWithoutBonous:purchasedPackDetails.DAW,
            BonousAmount:Bonous,
            Amount: totalDAWToSend,
            Currency: "DAW",
            Status:"Requested"
        }])
        
        //Sending DAW
        /*
        let transaction = await sendTransaction({
            amount: totalDAWToSend,
            toaddress: purchasedPackDetails.UserID.walletaddress[purchasedPackDetails.UserID.walletaddress.length - 1],
            purpose: "Claming pack claim",
            emailid: purchasedPackDetails.UserID.emailid,
            data: req.body
        })

        if (!transaction) {
            await purchasedPack.findOneAndUpdate({ _id: req.body.packid, Status: "Inprogress" }, { $set: { Status: "Active" } })
            res.status(400).json({ data: null, error: "Failed" });
            return;
        }*/

        /*Copy to admin
        let claimmedDetails = await PackClaimmedSchema.insertMany([{
            UserID: req.body.uuid,
            PackID: purchasedPackDetails.PackID._id,
            PurchasedPack: req.body.packid,
            TxHash: transaction.transactionHash,
            PublicAddress: transaction.to,
            Amount: totalDAWToSend,
            Currency: "DAW"
        }])
        */
        //await purchasedPack.updateMany({ _id: req.body.packid }, { $set: { Status: "Claimmed", ClaimmedID: claimmedDetails[0]._id } })
            //console.log("Purchased Pack : ",purchasedPack)
        res.setHeader('response-security', true)
        res.status(200).json({ data: await responseBodyEncryption({ data: "Success", error: null }), type: "userauth" });

        await userclaimmedpack({
            emailid:purchasedPackDetails.UserID.emailid,
            publickey:purchasedPackDetails.UserID.walletaddress[purchasedPackDetails.UserID.walletaddress.length-1],
            packname:purchasedPackDetails.PackID.PackName,
            quantity:purchasedPackDetails.Quantity,
            incommingtxhash:purchasedPackDetails.TxHash,
            amountInMatic:purchasedPackDetails.TotalAmountInMatic,
            correctAmountInMatic:purchasedPackDetails.TotalCorrectAmountInMatic,
            transactionStatus:purchasedPackDetails.TransactionValid,
            IssueWithTransaction:purchasedPackDetails.TransactionInvalidReason,
            purpose:"User claimmed pack",
            percentageerror:""
        }).catch((error)=>{
            console.log("Failed to email ",error)
        })
    } catch (e) {
        console.log("!!!! Failed : ", e);
        res.status(400).json({ data: null, error: "Failed to claim" });
    }
}

//Need to add middleware
export default usermiddleware(handler);
//export default handler;