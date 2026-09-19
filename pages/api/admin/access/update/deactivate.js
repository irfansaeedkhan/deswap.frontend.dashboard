import adminmiddleware from "../../../../../middleware/adminmiddleware";
import getMongoDBConnection from "../../../../../utils/connection/mongodbconnection";
import Users from "../../../../../models/Users";
import IPBasedAccess from "../../../../../models/users/ipbasedAccess";
import { responseBodyEncryptionAdmin } from "../../../../../utils/common/jwtToken";

const handler = async(req, res) => {
    try{
        if (req.method !== "POST") {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }

        await getMongoDBConnection();

        let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;

        let ipToCheck = ip;

        if(ip.includes(",")){
            ipToCheck = ip.split(",")[0]
        }

        if(!req.body.description||req.body.description.trim()==""){
            req.body.description = "No descrption was add while adding"
        }

        let insertedValue = await IPBasedAccess.updateOne({
            _id:req.body.id,
            Status:{$in:["Requested","Active"]}
        },{
            $set:{
                Status:"Deactivate"
            }
        });

        res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryptionAdmin({data:"Deactivate done" ,error: null}), type: "adminauth" });
        return;
        
    }catch(e){
        console.log(e)
        res.status(400).json({ data: null, error: "Failed to add" });
    }
}

export default adminmiddleware(handler);