import getMongoDBConnection from "../../../../../utils/connection/mongodbconnection";
import Users from "../../../../../models/Users";
import UserTransaction from "../../../../../models/transaction/usertransaction";
import adminmiddleware from "../../../../../middleware/adminmiddleware";
import {responseBodyEncryptionAdmin} from "../../../../../utils/common/jwtToken"
import joi from "joi";
import ejs from "ejs";
import { resolve } from "path";
import { sendEmail } from "../../../../../utils/common/email";


const informAdminAboutStatusUpdate = async(emaildata)=>{
  try{
      let tDate = new Date();

      let utcDate = tDate.toUTCString();
  
      let pathTotemplate = await resolve("templates/email/admin/transactionRequestUpdated.ejs");
  
      let htmltempate = await ejs.renderFile(pathTotemplate, {
          publickey: emaildata.publickey,
          errortime: utcDate,
          amount:emaildata.amount,
          emailid:emaildata.emailid,
          purpose:emaildata.purpose,
          incommingtxhash:emaildata.incommingtxhash,
          claimid:emaildata.claimid,
          rejectreason:emaildata.rejectreason,
          status:emaildata.status
      });
  
      let result = await sendEmail({
          toAddress: process.env.NEXT_PUBLIC_SMTP_ADMIN_MAIL,
          subject: "Status update "+emaildata.publickey+" "+emaildata.purpose,
          bodyText: "Status update "+emaildata.publickey+" amount : "+emaildata.amount+" DAW",
          bodyHTML: htmltempate,
      });
  }catch(e){
      console.log("!!!! Failed to send email",e, emaildata)
  }
}

const handler = async(req, res) => {
    try{
        
        if (req.method !== "POST") {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }

        await getMongoDBConnection();
        
        let checkTransactionExists = await UserTransaction.findOne({
          _id: req.body.claimid,
          Status:"Requested"
        }).populate({ path: "UserTo", select: 'emailid walletaddress'});

        await UserTransaction.updateOne(
            {
              _id: req.body.claimid,
              Status:"Requested"
            },
            {
              $set: {
                OutgoingTxHash: req.body.txhash,
                Status:"Active",
                amountInDeswap:req.body.amountSent
              },
            }
        );
        res.setHeader('response-security', true);
        res.status(200).json({data:await responseBodyEncryptionAdmin({ data: "Success", error: null}),type:"adminauth"});

        await informAdminAboutStatusUpdate({
          publickey:checkTransactionExists.UserTo.walletaddress[checkTransactionExists.UserTo.walletaddress.length-1],
          emailid:checkTransactionExists.UserTo.emailid,
          purpose:"Admin matic to deswap success",
          incommingtxhash:req.body.txhash,
          status:"Active",
          rejectreason:"",
          claimid:req.body.claimid,
          amount:req.body.amountSent
        }).catch((error)=>{
          console.log("Failed to send mail",error)
        })
    
      }catch(e){
        console.log("Error while fetching requested ",e);
        res.status(400).json({ data: null, error: "Failed to fetch" });
    }
}

export default adminmiddleware(handler);