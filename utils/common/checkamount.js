import ejs from "ejs";
import { resolve } from "path";
import { sendEmail } from "./email";

const invalidTransactionAmount = async(emaildata)=>{
    try{
        let tDate = new Date();
  
        let utcDate = tDate.toUTCString();
    
        let pathTotemplate = await resolve("templates/email/admin/invalidTransactionAmount.ejs");
    
        let htmltempate = await ejs.renderFile(pathTotemplate, {
            publickey: emaildata.publickey,
            errortime: utcDate,
            amount:emaildata.amount,
            emailid:emaildata.emailid,
            purpose:emaildata.purpose,
        });
    
        let result = await sendEmail({
            toAddress: process.env.NEXT_PUBLIC_SMTP_ADMIN_MAIL,
            subject: "Deswap failed transaction check "+emaildata.publickey+" "+emaildata.purpose,
            bodyText: "Deswap failed transaction check : "+emaildata.publickey+" amount : "+emaildata.amount+" DAW",
            bodyHTML: htmltempate,
        });
    }catch(e){
        console.log("!!!! Failed to send email",emaildata)
    }
}

module.exports.checkAmount = (currentAmount, expectedAmount, userdetails={})=>{
    try{
        //
        currentAmount = Number(currentAmount).toFixed(6)
        expectedAmount = Number(expectedAmount).toFixed(6)
        if(currentAmount==expectedAmount){
            return {valid:true,reason:"Amount is same",changeInPercentage:""}
        }else if(currentAmount<expectedAmount){
            let percentageChange = ((currentAmount-expectedAmount)/expectedAmount)*100;
            return {valid:false,reason:"Amount in request is less than found on server from cmc (decreased) ",changeInPercentage:percentageChange}
        }else{
            //
            let percentageChange = ((currentAmount-expectedAmount)/expectedAmount)*100;
            return {valid:false,reason:"Amount is request is more than found on server from cmc (increased )",changeInPercentage:percentageChange}
        }
    } catch(e){
        console.log(e)
    } 
}