import MongoDBConnection from "../../utils/connection/mongodbconnection";
import UserModel from "../../models/Users";
import {responseBodyEncryptionUnprotected} from "../../utils/common/jwtToken"
import axios from "axios";
import unprotectedmiddleware from "../../middleware/unprotectedmiddleware";

const verifyEmailandSponsor = async (req, res) => {
  const { username, email, referral } = req.body;
  
  try {
    
    /*
    Connecting to database
    */
    await MongoDBConnection();
    
    /*
    Checking wether email is not created for 10 min mails
    */
    let registerationCheckingResult = await axios.get(`${process.env.NEXT_PUBLIC_MailVerificationlink}${email}`).catch((checkerror)=>{
      console.log(checkerror.response.data.message)
    })

    if(registerationCheckingResult && registerationCheckingResult.data!=undefined){
      if(!registerationCheckingResult.data){
        res.setHeader('response-security', true)
        res.json({data:await responseBodyEncryptionUnprotected({
          message: "Failed to validate email id",
          success: false,
        }),type:"noauth"})
        return
      }

      if((registerationCheckingResult.data)&&(registerationCheckingResult.data.disposable==true)){
        res.setHeader('response-security', true)
        res.json({data:await responseBodyEncryptionUnprotected({
          message: "Invalid email id",
          success: false,
        }),type:"noauth"})
        return;
      }
        
    }else{
      res.setHeader('response-security', true)
      res.json({data:await responseBodyEncryptionUnprotected({
        message: "Invalid email id",
        success: false,
      }),type:"noauth"})
      return;
    }

    const isValidEmail = await UserModel.findOne({ emailid:email });

    if (isValidEmail) {
      res.setHeader('response-security', true)
      return res.json({data:await responseBodyEncryptionUnprotected({
        message: "User already exists",
        success: false,
      }),type:"noauth"});
    }

    const doUserNameExits = await UserModel.findOne({ username:username });
    
    if (doUserNameExits) {
      res.setHeader('response-security', true)
      return res.json({data:await responseBodyEncryptionUnprotected({
        message: "User name already exists",
        success: false,
      }),type:"noauth"});
    }

    const isReferralValid = await UserModel.findOne({ uuid: referral });
    
    if (isReferralValid) {
      res.setHeader('response-security', true)
      return res.json({data:await responseBodyEncryptionUnprotected({
        success: true,
        message: "User have valid sponsor",
        mailok: true,
        referralAvailable: true,
      }),type:"noauth"});
    }
    res.setHeader('response-security', true)
    return res.json({data:await responseBodyEncryptionUnprotected({
      success: true,
      message: "User dont have valid sponsor",
      mailok: true,
      referralAvailable: false,
    }),type:"noauth"});
  } catch (error) {
    console.log(error);
    res.setHeader('response-security', true)
    res.json({data:await responseBodyEncryptionUnprotected({
      success: false,
      message: "User dont have valid sponsor",
      mailok: false,
      referralAvailable: false,
    }),type:"noauth"});
  }
};

export default unprotectedmiddleware(verifyEmailandSponsor);
