import getMongoDBConnection from "../../../../utils/connection/mongodbconnection";
import userModel from "../../../../models/Users";
import userTransactions from "../../../../models/transaction/usertransaction";
import usermiddleware from "../../../../middleware/usermiddleware";
import {sendTransaction} from "../../../../utils/wallet/sendTransaction";
import {checkTransaction} from "../../../../utils/common/transactionChecking";
import {responseBodyEncryption} from "../../../../utils/common/jwtToken"
import ejs from "ejs";
import { resolve } from "path";
import { sendEmail } from "../../../../utils/common/email";
import {maticToDeswap} from "../../../../utils/common/tokenconversion";
import {checkAmount} from "../../../../utils/common/checkamount"
import Joi from "joi";

const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: false,
    convert: true,
};

const informAdminAboutRequest = async(emaildata)=>{
    try{
        let tDate = new Date();
  
        let utcDate = tDate.toUTCString();
    
        let pathTotemplate = await resolve("templates/email/admin/transactionRequestInfo.ejs");
    
        let htmltempate = await ejs.renderFile(pathTotemplate, {
            publickey: emaildata.publickey,
            errortime: utcDate,
            amount:emaildata.amount,
            emailid:emaildata.emailid,
            purpose:emaildata.purpose,
            incommingtxhash:emaildata.incommingtxhash
        });
    
        let result = await sendEmail({
            toAddress: process.env.NEXT_PUBLIC_SMTP_ADMIN_MAIL,
            subject: "Requested Matic to Deswap "+emaildata.publickey+" "+emaildata.purpose,
            bodyText: "Requested Matic to Deswap : "+emaildata.publickey+" amount : "+emaildata.amount+" DAW",
            bodyHTML: htmltempate,
        });
    }catch(e){
        console.log("!!!! Failed to send email",emaildata)
    }
}


const handler = async (req, res) => {
    let transactionValid = true;
    let correctAmountInMatic = 0;
    let correctAmountInDeswap = 0;
    let informAdmin = false;
    let transactionissue = 0;
    try {
        
        //Checked method type post
        if (req.method !== 'POST') {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }

        //Connecting to database
        await getMongoDBConnection();
        
        //Checking if transaction already exists in database or not
        let checkIfTransaction= await userTransactions.findOne({IncommingTxHash:req.body.txhash});

        //Checking Public key already exits in the database
        if(checkIfTransaction){
            res.status(400).json({ data: null, error: "Transaction hash already exists in database" });
            return;
        }

        //
        if(req.body.purpose!="AddTransactionInDatabase"){
            res.status(400).json({ data: null, error: "Invalid request" });
            return;
        }

        //Checking valid input type
        let addTransactionValidator = await Joi.object({
            publickey:Joi.string().trim().required(),
            amountDAW:Joi.string().trim().allow("").optional(),
            conversionrate:Joi.number().required(),
            amountMatic:Joi.string().trim().required(),
            txhash:Joi.string().trim().required(),
            sendFor:Joi.string().trim().required(),
            purpose:Joi.string().trim().required(),
            uuid:Joi.string().trim().required(),
        });

        const { error, value } = addTransactionValidator.validate(req.body, options);
        
        if(error){
            res.status(400).json({ data: null, error: "Invalid request data" });
            return;
        }

        //Converting matic to deswap to check requested deswap is correct or not
        let fetchedAmount = await maticToDeswap(req.body.amountMatic);
        
        //Comparing deswap amount fetch from cmc and requested
        let DeswapCheck = await checkAmount(req.body.amountDAW, fetchedAmount.data)

        //if transaction is valid then
        if(DeswapCheck.valid){
            //Amount is valid
            transactionValid = true
            correctAmountInDeswap = req.body.amountDAW
            transactionissue = ""
        }else{
            // if transaction is not valid
            transactionValid = false
            correctAmountInDeswap = fetchedAmount.data
            transactionissue = DeswapCheck.reason+" Please check transaction ,user requested for : "+String(req.body.amountDAW)+" DAW. Amount calculated on server is : "+String(fetchedAmount.data)+" DAW. Change in percentage of these two value are : "+String(DeswapCheck.changeInPercentage)
        }
        
        //Checking wether user exits or not
        let findUserInfo = await userModel.findOne({_id:req.body.uuid});

        //Returning if use dont exits
        if(!findUserInfo){
            res.status(400).json({ data: null,error:"Invalid user"});
            return;
        }

        if(findUserInfo.status!="Active"){
            res.status(400).json({ data: null,error:"Invalid user"});
            return;
        }
        //Checking wether transaction amount is same or not
        let validTransaction = await checkTransaction(findUserInfo.walletaddress[findUserInfo.walletaddress.length-1],req.body.txhash, req.body.amountMatic, true, {purpose:"Matic to Deswap", emailid:findUserInfo.emailid, ...req.body})

        if(!validTransaction.status){
            //
            await informAdminAboutRequest({
                publickey:findUserInfo.walletaddress[findUserInfo.walletaddress.length-1],
                amount:req.body.amountMatic+" Matic",
                emailid:findUserInfo.emailid,
                purpose:"Invalid transaction details (Check hack)",
                incommingtxhash:req.body.txhash
            }).catch((error)=>{
                console.log("Failed to send mail",error)
            })
            //res.status(400).json({ data: null,error:"Invalid transaction data"});
            //return;
        }

        if(validTransaction.transactiontimeissue){
            transactionValid = false
            transactionissue += " Transaction time : "+validTransaction.transactiontimeissuedescription
            await informAdminAboutRequest({
                publickey:findUserInfo.walletaddress[findUserInfo.walletaddress.length-1],
                amount:req.body.amountMatic+" Matic",
                emailid:findUserInfo.emailid,
                purpose:"Invalid transaction details (Delayed transaction details)",
                incommingtxhash:req.body.txhash
            }).catch((error)=>{
                console.log("Failed to send mail",error)
            })
        }

        let insertedTransaction = await userTransactions.insertMany([{
            UserTo:req.body.uuid,
            UserToPublicKey:req.body.publickey,
            amountInDeswap:req.body.amountDAW,
            conversionRate:req.body.conversionrate,
            amountInMatic:req.body.amountMatic,
            IncommingTxHash:req.body.txhash,
            Status:"Requested",
            transactionIssueDescription:transactionissue,
            informedAdmin:informAdmin,
            TransactionValid:transactionValid,
            correctAmountInMatic:req.body.amountMatic,
            correctAmountInDeswap:correctAmountInDeswap,
        }]);
        
        //
        /*
        let tx = await sendTransaction({
            amount:req.body.amountDAW,
            toaddress:req.body.publickey,
            purpose:"Swap Matic to DAW",
            emailid:findUserInfo.emailid,
            data:req.body
        });
        
        if(!tx){
            res.status(400).json({ message:"Failed to transfer", error: null });
            return;
        }
        let updateResult = await userTransactions.updateOne({
            _id:insertedTransaction['0']._id
          },{
            $set: {
                OutgoingTxHash:tx.transactionHash
            },
        })

        if(updateResult.modifiedCount>0){
            res.setHeader('response-security', true)
            res.status(200).json({data:await responseBodyEncryption({ message:"Successfully updated", error: null }),type:"userauth"});
        }else{
            res.setHeader('response-security', true)
            res.status(200).json({data:await responseBodyEncryption({ message:"Failed to updated", error: null }),type:"userauth"});
        }
        //
        */
        res.setHeader('response-security', true)
        res.status(200).json({data:await responseBodyEncryption({ message:"Successfully updated", error: null }),type:"userauth"});
        await informAdminAboutRequest({
            publickey:findUserInfo.walletaddress[findUserInfo.walletaddress.length-1],
            amount:req.body.amountDAW+" Deswap",
            emailid:findUserInfo.emailid,
            purpose:"Swapping request Matic to Deswap",
            incommingtxhash:req.body.txhash
        }).catch((error)=>{
            console.log("Failed to send mail",error)
        })
    } catch (e) {
      console.log("!!!! Failed ",e);
      res.status(400).json({ data: null, error: "Failed to add"});
    }
}

export default usermiddleware(handler);