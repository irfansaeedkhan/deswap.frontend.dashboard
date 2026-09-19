import getMongoDBConnection from "../../utils/connection/mongodbconnection.js";
import userModel from "../../models/Users";
import ejs from "ejs";
import {resolve} from "path";
import {sendEmail} from "../../utils/common/email";
import {verifyRequestBody,decodeRequestBody} from "../../utils/common/jwtToken"
import {createPasswordResetToken,createJWTUniqueID} from "../../utils/common/jwtToken";
import resetpasswordModel from "../../models/password/resetpassword.js";
import unprotectedmiddleware from "../../middleware/unprotectedmiddleware";

const sendForgetpasswordEmail = async (emailid,token)=>{
    try{
        let pathTotemplate = await resolve("templates/email/recoverpassword.ejs");
        let url = `${process.env.PLATFORM_URL}/user/resetpassword?token=${token}`;
        let htmltempate = await ejs.renderFile(pathTotemplate,{
            emailID:emailid,
            token:token,
            url:url
          });
        let result = await sendEmail({
            toAddress:emailid,
            subject:"Reset Password",
            bodyText:`Kindly use this link for resetting password ${url}`,
            bodyHTML:htmltempate
        });
    }catch(e){
        //
        console.log("Failed to send recover password email ",e);
    }
}

/**
 * Fucntion 
 */
 const handler = async (req, res)=>{
    try{

        if (req.method !== 'POST') {
            res.status(400).json({ data: null,error:"Invalid Method" });
            return;
        }

        if(!req.body.data){
          res.status(400).json({ data: null,error:"Invalid request"});
          return;
        }

        /*
        await verifyRequestBody(req.body.data);

        let decodedData = await decodeRequestBody(req.body.data);

        req.body = decodedData.payload
        */
        await getMongoDBConnection();

        let userInfo = await userModel.findOne({emailid:req.body.email});


        if(userInfo===null){
            res.status(400).json({ data: null,error:"Invalid user"});
            return;
        }


        let resetPasswordHash = await resetpasswordModel.findOneAndDelete({
            uid:userInfo.uuid,
            type:"PasswordReset"
        });
        
        //let result = await emailValidation(req.body.emailid);
        
        let hashPassword = await createJWTUniqueID(10);
        
        let hashValue = await createPasswordResetToken({uuid:userInfo.uuid,hash:hashPassword,type:"PasswordReset"});
        
        let encodeHashValue = await encodeURIComponent(hashValue);

        await resetpasswordModel.insertMany([{
            uid:userInfo.uuid,
            tokenhash:hashPassword,
            tokenType:"PasswordReset"
        }]);
        
        res.status(200).json({ data: "Success",error:null});

        await sendForgetpasswordEmail(req.body.email,encodeHashValue).catch(console.error);

    }catch(e){
        console.log("Failed to register user ",e);
        res.status(400).json({ data: null,error:"Failed to resetpassword"});
        return
    }
}

export default unprotectedmiddleware(handler);