import getMongoDBConnection from "../../../../../utils/connection/mongodbconnection.js";
import adminmiddleware from "../../../../../middleware/adminmiddleware";
import Users from "../../../../../models/Users";
import nftlicense from "../../../../../models/nftlicense/licensedetails";
import userRequested from "../../../../../models/nftlicense/purchase/userpurchased";
import { responseBodyEncryptionAdmin } from "../../../../../utils/common/jwtToken";
import ejs from "ejs";
import { resolve } from "path";
import { sendEmail } from "../../../../../utils/common/email";


const userpurchasedNftlicense = async (data) => {
    try {
      let pathTotemplate = await resolve("templates/email/admin/nftlicensepurchased.ejs");
      
      //
      let htmltempate = await ejs.renderFile(pathTotemplate, {
          name:data.name,
          price:data.price,
          incommingtxhash:data.incommingtxhash,
          amountInmatic:data.amountInmatic,
          correctAmountInmatic:data.correctAmountInmatic,
          issueWithTransaction:data.issueWithTransaction,
          transactionvalid:data.transactionvalid,
          emailid:data.emailid,
          publickey:data.publickey,
          purpose:"Admin updated status of nft license"
      });
  
      let result = await sendEmail({
        toAddress: process.env.NEXT_PUBLIC_SMTP_ADMIN_MAIL,
        subject: "Admin updated nft license "+data.emailid,
        bodyText: "Admin updated nft license "+data.publickey,
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
        
        let licenseDetails = await userRequested.findOne({
              _id: req.body.claimid,
              Status:"Requested"
        }).populate({ path: "UserID", select: 'emailid walletaddress' }).populate({ path: "NftLicense" });

        if(!licenseDetails){
            res.status(400).json({ data: null, error: "Failed to update"});
            return;
        }
        let updateObject = {}
        let licenseObjectUpdate = {}
        if(req.body.requestStatus=="Rejected"){
            updateObject.requestRejectedOn = new Date();
            updateObject.requestRejectIssueDescription = req.body.rejectReason;
            updateObject.Status = req.body.requestStatus;
            licenseObjectUpdate.Status = "Active"
        }else if(req.body.requestStatus!=""){
            updateObject.requestRejectedOn = null;
            updateObject.Status = req.body.requestStatus;
            licenseObjectUpdate.Status = "Deactive"
        }

        if(req.body.transactionStatus!=""){
            
            if(req.body.transactionStatus=="true"||req.body.transactionStatus==true){
                //
                updateObject.TransactionValid = true
            }else{
                //
                updateObject.TransactionValid = false
            }
        }

        updateObject.updatedBy= req.body.uuid

        await getMongoDBConnection();
        
        await userRequested.updateOne(
            {
              _id: req.body.claimid,
              Status:"Requested"
            },
            {
              $set: updateObject,
            }
        );

        await nftlicense.updateOne(
            {
              _id: licenseDetails.NftLicense
            },
            {
              $set: licenseObjectUpdate,
            }
        );

        res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryptionAdmin({ data: "Update successfully", error: null, }), type: "adminauth" });

        await userpurchasedNftlicense({
            name:licenseDetails.NftLicense.Name,
            price:licenseDetails.NftLicense.Price,
            incommingtxhash:licenseDetails.TxHash,
            amountInmatic:licenseDetails.TotalAmount,
            correctAmountInmatic:licenseDetails.CorrectTotalMatic,
            issueWithTransaction:updateObject.requestRejectIssueDescription,
            transactionvalid:updateObject.TransactionValid,
            emailid:licenseDetails.UserID.emailid,
            publickey:licenseDetails.UserID.walletaddress[licenseDetails.UserID.walletaddress.length - 1]
        }).catch((error)=>{
            console.log("Failed to send email ",error)
        })
    } catch (e) {
        console.log(e);
        res.status(400).json({ data: null, error: "Failed to update"});
    }
}
export default adminmiddleware(handler);