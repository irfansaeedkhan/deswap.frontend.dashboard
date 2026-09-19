import Web3 from 'web3';
import ejs from "ejs";
import { resolve } from "path";
import { sendEmail } from "../common/email";
import moment from "moment";

const failedTransactionCheck = async(emaildata)=>{
    try{
        let tDate = new Date();
  
        let utcDate = tDate.toUTCString();
    
        let pathTotemplate = await resolve("templates/email/admin/failedTransactionChecking.ejs");
    
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

const checkTransactionPrice = async (publickey, amount, checkPriceTransactionHash)=>{
    try{
        let web3Ch = new Web3(new Web3.providers.HttpProvider(process.env.POLYGON_CHAIN_LINK));
        let transactionPriceInfo = await web3Ch.eth.getTransactionReceipt(checkPriceTransactionHash)
        // console.log("TransactionPrice Info : ",transactionPriceInfo)
        // console.log(Object.keys(transactionPriceInfo.logs));
        let priceInHex = transactionPriceInfo.logs[0].data;
        // console.log("Price in hex ",priceInHex)
        let convertedPriceBN = await web3Ch.utils.toBN(priceInHex)
        //let convertedPriceDecimal = await web3Ch.utils.toDecimal(priceInHex);
        //let convertedPriceNumber = await web3Ch.utils.toNumber(priceInHex);
        // console.log("BN : ",convertedPriceBN)
        //console.log("Decimal : ",convertedPriceDecimal)
        //console.log("Number : ",convertedPriceNumber)
    }catch(e){
        console.log(e)
        return false
    }
}

const formatWei = async (wei) =>{
	return Number(wei) / 1e18;
};

module.exports.checkTransaction = async (publickey, transactionhash, amountToCheck=0.1, checkAmount=false, datapassed)=>{
    
    let result = {status:false, from:false, to:false, amountcorrect:false, blockchainamount:0}
    try{

        let web3 = new Web3(new Web3.providers.HttpProvider(process.env.POLYGON_CHAIN_LINK));
        let transactionInfo = await web3.eth.getTransaction(transactionhash)
        let transactionBlock = await web3.eth.getBlock(transactionInfo.blockNumber)

        let transactionDate = transactionBlock.timestamp;
        let currentTimeInUnix = await moment().unix();

        if(currentTimeInUnix-transactionDate>5){
            //Greater than 10 seconds so might be issue with transaction
            result.transactiontimeissue = true
            result.transactiontimeissuedescription = "Time issue with transaction Transaction time. kindly check transaction"
        }else{
            //No issue with transaction
            result.transactiontimeissue = false
            result.transactiontimeissuedescription = "No issue with transaction time"
        }

        if((transactionInfo.to.toLowerCase()!=process.env.NEXT_PUBLIC_ADMIN_POLYGON_PUBLIC_KEY.toLowerCase())&&(transactionInfo.to.toLowerCase()!=process.env.NEXT_PUBLIC_ADMIN_DESWAP_CONTRACT_ADDRESS_POLYGON.toLowerCase())&&(transactionInfo.to.toLowerCase()!=process.env.ADMIN_POLYGON_PUBLIC_KEY.toLowerCase())){
            // console.log("Transaction to user is not correct ",transactionInfo.to.toLowerCase(),"\n",process.env.NEXT_PUBLIC_ADMIN_POLYGON_PUBLIC_KEY.toLowerCase(),"\n",transactionhash)
            result.status = false;
            result.to = false;
            return result;
        }else{
            result.to = true;
        }

        if((transactionInfo.from.toLowerCase()!=publickey.toLowerCase())&&(transactionInfo.from.toLowerCase()!=process.env.NEXT_PUBLIC_ADMIN_POLYGON_PUBLIC_KEY.toLowerCase())&&(transactionInfo.from.toLowerCase()!=process.env.ADMIN_POLYGON_PUBLIC_KEY.toLowerCase())&&(transactionInfo.from.toLowerCase()!=process.env.NEXT_PUBLIC_ADMIN_DESWAP_CONTRACT_ADDRESS_POLYGON.toLowerCase())){
            // console.log("Transaction from user is not correct ",transactionInfo.from.toLowerCase(),"\n",publickey.toLowerCase(),"\n",transactionhash)
            result.status = false;
            result.from = false;
            return false;
        }else{
            result.from = true;
        }

        let amountInWei = await transactionInfo.value;

        let convertedAmount = await formatWei(amountInWei);

        
        if(checkAmount){
            // console.log("Fetched Amount : ",convertedAmount, " Amount to check : ",amountToCheck)
            if(Number(amountToCheck).toFixed(6)==convertedAmount.toFixed(6)){
                //
                result.status = true;
                result.amountcorrect = true;
                result.blockchainamount = convertedAmount.toFixed(6);
                return result

            }else{
                result.status = false;
                result.amountcorrect = false;
                result.blockchainamount = convertedAmount.toFixed(6);
                // console.log("False Transaction found public : ",publickey,"  transaction hash : ",transactionhash," Amount in transaction ",convertedAmount.toFixed(6)," API amount : ",amountToCheck.toFixed(6))
                await failedTransactionCheck({
                    publickey:publickey,
                    amount:Number(amountToCheck),
                    emailid:datapassed.emailid,
                    purpose:datapassed.purpose,
                }).catch((error)=>{console.log("Failed to send email ",error.message)})
                return result
            }
        }
        //await checkTransactionPrice(publickey, 0,transactionhash)
        result.status = true;
        return result;
    }catch(e){
        console.log("False transaction found : ",publickey," transaction hash : ",transactionhash);
        await failedTransactionCheck({
            publickey:publickey,
            amount:Number(amountToCheck),
            emailid:datapassed.emailid,
            purpose:datapassed.purpose,
        }).catch((error)=>{console.log("Failed to send email ",error.message)})
        
        result.status = false
        result.amountcorrect = false;
        result.to = false;
        result.from = false;
        result.blockchainamount = 0;
        result.transactiontimeissue = false;
        result.transactiontimeissuedescription = "";
        //
        return result;
    }
}
module.exports.checkTransactionPrice = checkTransactionPrice;