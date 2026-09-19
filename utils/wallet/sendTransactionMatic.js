import Web3 from 'web3';
import contractABI from "../../abi/sktest.json";
import {web3DeSwapContract} from "./index"
import ejs from "ejs";
import { resolve } from "path";
import { sendEmail } from "../common/email";
const Tx = require('ethereumjs-tx');

const formatWei = async (wei) =>{
	return Number(wei) / 1e18;
};

const isJsonString = async (str) => {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}

const isJSON = async (something) => {
  if (typeof something != 'string')
      something = JSON.stringify(something);

  try {
      JSON.parse(something);
      return true;
  } catch (e) {
      return false;
  }
}

const startingTransactionEmail = async(emaildata)=>{
  try{
      let tDate = new Date();

      let utcDate = tDate.toUTCString();
  
      let pathTotemplate = await resolve("templates/email/admin/startedtransaction.ejs");
  
      let htmltempate = await ejs.renderFile(pathTotemplate, {
          publickey: emaildata.publickey,
          errortime: utcDate,
          amount:emaildata.amount,
          emailid:emaildata.emailid,
          purpose:emaildata.purpose
      });
  
      let result = await sendEmail({
          toAddress: process.env.NEXT_PUBLIC_SMTP_ADMIN_MAIL,
          subject: "Deswap starting transaction for "+emaildata.publickey+" "+emaildata.purpose,
          bodyText: "Deswap starting transaction for public key : "+emaildata.publickey+" amount : "+emaildata.amount+" Matic",
          bodyHTML: htmltempate,
      });
  }catch(e){
      console.log("!!!! Failed to send email",emaildata)
  }
}

const successTransactionEmail = async(emaildata)=>{
  try{
      let tDate = new Date();

      let utcDate = tDate.toUTCString();
  
      let pathTotemplate = await resolve("templates/email/admin/sentrewards.ejs");
  
      let htmltempate = await ejs.renderFile(pathTotemplate, {
          publickey: emaildata.publickey,
          errortime: utcDate,
          transactionhash:emaildata.txhash,
          amount:emaildata.amount,
          emailid:emaildata.emailid,
          purpose:emaildata.purpose
      });
  
      let result = await sendEmail({
          toAddress: process.env.NEXT_PUBLIC_SMTP_ADMIN_MAIL,
          subject: "Deswap transaction success for "+emaildata.publickey+" "+emaildata.purpose,
          bodyText: "Deswap transaction success for public key : "+emaildata.publickey+" amount : "+emaildata.amount+" Matic , Transactionhash : "+emaildata.txhash,
          bodyHTML: htmltempate,
      });
  }catch(e){
      console.log("!!!! Failed to send email",emaildata)
  }
}

const failedTransactionEmail = async(emaildata)=>{
  try{
      let tDate = new Date();

      let utcDate = tDate.toUTCString();
  
      let pathTotemplate = await resolve("templates/email/admin/failedtransaction.ejs");
  
      let htmltempate = await ejs.renderFile(pathTotemplate, {
          publickey: emaildata.publickey,
          errortime: utcDate,
          amount:emaildata.amount,
          emailid:emaildata.emailid,
          purpose:emaildata.purpose,
          errormessage:emaildata.errormessage,
          devdata:emaildata.devdata
      });
  
      let result = await sendEmail({
          toAddress: process.env.NEXT_PUBLIC_SMTP_ADMIN_MAIL,
          subject: "Deswap transaction failed for "+emaildata.publickey+" "+emaildata.purpose,
          bodyText: "Deswap transaction failed for public key : "+emaildata.publickey+" amount : "+emaildata.amount+" Matic",
          bodyHTML: htmltempate,
      });
  }catch(e){
      console.log("!!!! Failed to send email",emaildata)
  }
}

const sendInsufficientBalanceMail = async (emailid, data) => {
    try {
      let tDate = new Date();
  
      let utcDate = tDate.toUTCString();
  
      let pathTotemplate = await resolve("templates/email/admin/insufficentebalanceEmail.ejs");
  
      let htmltempate = await ejs.renderFile(pathTotemplate, {
        publickey: data.publickey,
        errortime: utcDate,
        emailid:emaildata.emailid,
        purpose:emaildata.purpose,
        errormessage:emaildata.errormessage,
        devdata:emaildata.devdata
      });
  
      let result = await sendEmail({
        toAddress: emailid,
        subject: "Deswap insufficient balance"+data.publickey+" "+emaildata.purpose,
        bodyText: "Insufficient balance for "+data.publickey,
        bodyHTML: htmltempate,
      });
    } catch (e) {
      //
      console.log("!!! Failed to send login mail", e);
    }
};
//
const fetchDeswapBalance = async (contractweb) =>{
    try{

      let result = await contractweb.methods.balanceOf(process.env.ADMIN_POLYGON_PUBLIC_KEY).call({from: process.env.ADMIN_POLYGON_PUBLIC_KEY});
      //
      let convertedValue = await formatWei(result);
      return convertedValue;
      
    }catch(e){
      console.log("Fetch to fetch Deswap Balance : ",e);
      return 0;
    }
}

module.exports.sendTransactionMatic = async (data)=>{
    try{
        //Connecting BSC Chain
        let web3 = new Web3(new Web3.providers.HttpProvider(process.env.POLYGON_CHAIN_LINK));
        
        //Checking wether admin address is valid address
        let checkValidAdminAddress = await web3.utils.isAddress(process.env.ADMIN_POLYGON_PUBLIC_KEY);
        
        //Returning error if not valid address
        if(!checkValidAdminAddress){
            throw "Invalid admin address";
        }

        //Fetching Account balance
        let adminAccountBalance = await web3.eth.getBalance(process.env.ADMIN_POLYGON_PUBLIC_KEY);
        
        //Converting account balance
        let accountBalance = await web3.utils.fromWei(adminAccountBalance);

        //let contract = await web3DeSwapContract(web3);
        
        //let deswapBalance = await fetchDeswapBalance(contract)
        
        if(Number(accountBalance)<Number(data.amount)){
            let validJSONData = await isJSON(data);
            let dataToSendInRequest = "";
            if(validJSONData){
                dataToSendInRequest = await JSON.stringify(data);
            }
            await sendInsufficientBalanceMail(process.env.NEXT_PUBLIC_SMTP_ADMIN_MAIL,{publickey:data.toaddress,emailid:data.emailid,purpose:data.purpose,errormessage:"Insufficent balance",devdata:dataToSendInRequest})
            //throw "Insufficent balance"
            return;
        }/**/

        //Fetching transaction count
        //let count = await  web3.eth.getTransactionCount(process.env.NEXT_PUBLIC_ADMIN_POLYGON_PUBLIC_KEY);
        
        await startingTransactionEmail({
          publickey:data.toaddress,
          amount:data.amount,
          emailid:data.emailid,
          purpose:data.purpose,
        });
        
        //Converting transaction amount
        let convertedTransactionAmount = await web3.utils.toWei(data.amount.toString());

        let privatekey = process.env.ADMIN_POLYGON_PRIVATE_KEY;
        //

        /*
        if(privatekey.includes("0x")){
            privatekey = privatekey.replace("0x", "");
        }
        */

        //let encodeABI = await contract.methods.transfer(data.toaddress, convertedTransactionAmount.toString()).encodeABI();

        /*
        let tx = {
            from: `${process.env.NEXT_PUBLIC_ADMIN_POLYGON_PUBLIC_KEY}`,
            to: `${process.env.NEXT_PUBLIC_ADMIN_DESWAP_CONTRACT_ADDRESS_POLYGON}`,
            gas: 2000000,
            data: encodeABI
        };*/

        let estimateGasPrice = await web3.eth.estimateGas({
          to: data.toaddress,
          //data: ""
        });

        let tx = {
          from: `${process.env.ADMIN_POLYGON_PUBLIC_KEY}`,
          to: data.toaddress,
          gas:estimateGasPrice,
          //gas: 2000000,
          value:convertedTransactionAmount,
          data: ""
        };

        let signedTx = await web3.eth.accounts.signTransaction(tx,`${process.env.ADMIN_POLYGON_PRIVATE_KEY}`);

        let transactionHash = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        
        await successTransactionEmail({
          publickey:data.toaddress,
          amount:data.amount,
          txhash:transactionHash.transactionHash,
          emailid:data.emailid,
          purpose:data.purpose
        });
        return transactionHash;

    }catch(e){
        console.log("\n!!!! Failed send transaction matic : ",e,"\n",data);
        let errormessage = "No error message"
        if(e?.message){
            errormessage = e.message;
        }
        let validJSONData = await isJSON(data);
        let dataToSendInRequest = "";
        if(validJSONData){
            dataToSendInRequest = await JSON.stringify(data);
        }
        await failedTransactionEmail({
          publickey:data.toaddress,
          amount:data.amount,
          emailid:data.emailid,
          purpose:data.purpose,
          errormessage:errormessage,
          devdata:dataToSendInRequest,
      });
    }
};
