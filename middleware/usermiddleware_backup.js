import Cookies from 'cookies';
import { decryptData } from "../utils/common/crypto";
import { verifyJWT, decodeJWT } from "../utils/common/jwtToken";
import { refreshJWTToken } from "../utils/common/refreshjwtToken";
import userSessionModal from "../models/users/usersSession";
import {verifyRequestBody,decodeRequestBody} from "../utils/common/jwtToken";

global.color = {
    red:"\x1b[31m",
    green:"\x1b[32m",
    yellow:"\x1b[33m",
    black:"\x1b[30m",
    reset:"\x1b[0m",
    blue:"\x1b[34m"
};

const usermiddleware = (handler) => async(req, res) => {
    let cookies, encryptedCookie, stringedcookie, cookie;

    try {
        cookies = await new Cookies(req, res);
        encryptedCookie = await cookies.get(process.env.DOMAIN_NAME);


        if (!encryptedCookie) {
            res.status(401).json({ data: null, error: "Invalid login" });
            return;
        }
        stringedcookie = await decryptData(encryptedCookie);
        cookie = await JSON.parse(stringedcookie);

        //Checking wether valid jwt token or not
        if (cookie.jwtToken == undefined || cookie.jwtToken == "") {
            res.status(401).json({ data: null, error: "Invalid login" });
            return
        }
        

        let verificationResult = await verifyJWT({ jwtToken: cookie.jwtToken });
        let jwtToken = await decodeJWT({ jwtToken: cookie.jwtToken });


        if (!jwtToken.payload.role.includes("User")) {
            res.status(401).json({ data: null, error: "Invalid login" });
            return;
        }

        if(req.body!=undefined && req.body!= null && req.body !=""){
        req.body.uuid = jwtToken.payload.uuid;
        req.body.jwtUid = jwtToken.payload.jwtuid;
        }

        
        if(req.body && req.body.data!=undefined&&req.headers.hasOwnProperty("security-set")&&req.headers['security-set']&&(Boolean(req.headers['security-set'])==true)&&(req.headers['security-set']=="true")){
            //
            if(!req.body.data){
                res.status(400).json({ data: null, error: "Invalid request" }); 
                return   
            }
            //Valid request
            let verifiedData = true;
            
            await verifyRequestBody(req.body.data, req.url).catch((error)=>{
                verifiedData=false;
            })
            
            let decodedData = await decodeRequestBody(req.body.data, req.url);

            
            req.body = {...decodedData.payload , ...req.body}

        }
        console.log(await handler(req, res))
        return  
    } catch (e) {
        if (e.message == "jwt expired") {
            await refreshJWTToken(handler, req, res, cookie);
        } else {
            //console.log("failed to refresh login refresh token");
            res.status(401).json({ data: null, error: "Invalid login" });
            //res.status(401).json({ data: null, error: "Invalid login" });
        }
    }
}

export default usermiddleware;