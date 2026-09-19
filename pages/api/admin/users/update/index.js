import getMongoDBConnection from "../../../../../utils/connection/mongodbconnection";
import Users from "../../../../../models/Users";
import adminmiddleware from "../../../../../middleware/adminmiddleware";
import {responseBodyEncryptionAdmin} from "../../../../../utils/common/jwtToken"

const handler = async(req, res) => {
    try{
        
        if (req.method !== "POST") {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }

        await getMongoDBConnection();
        
        let updateObject = {}
        
        if(req.body.transactionStatus=="true"||req.body.transactionStatus==true){
            updateObject.transactionVerified = true
        }else{
            updateObject.transactionVerified = false
        }

        if(req.body.userStatus=="Active"||req.body.userStatus=="active"){
            updateObject.status = "Active"
        }else{
            updateObject.status = "InActive"
        }

        
        if(req.body.userDisabledReason!=""){
            updateObject.disableReason = req.body.userDisabledReason
        }

        let result =await Users.updateOne(
            {
              _id: req.body.userid
            },
            {
              $set: updateObject,
            }
        );
        
        res.setHeader('response-security', true);
        res.status(200).json({data:await responseBodyEncryptionAdmin({ data: "Success", error: null}),type:"adminauth"});
    }catch(e){
        console.log("Error while fetching requested ",e);
        res.status(400).json({ data: null, error: "Failed to fetch" });
    }
}

export default adminmiddleware(handler);