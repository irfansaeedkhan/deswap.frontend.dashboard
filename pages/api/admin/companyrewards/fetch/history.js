import getMongoDBConnection from "../../../../../utils/connection/mongodbconnection";
import Users from "../../../../../models/Users";
import CompanyRewards from "../../../../../models/company/rewards/rewards";
import adminmiddleware from "../../../../../middleware/adminmiddleware";
import {responseBodyEncryptionAdmin} from "../../../../../utils/common/jwtToken"
import Company from "../../../../../models/company/company"

const handler = async(req, res) => {
    try{
        
        if (req.method !== "POST") {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }
        
        let offset = 0;
        let limit = 10;
        //get offset and limit from query
        if (req.body.offset) {
            offset = parseInt(req.body.offset);
        }
        if (req.body.limit) {
            limit = parseInt(req.body.limit);
        }

        await getMongoDBConnection();
        
        let totalHistory = await CompanyRewards.find({status:{$ne:"Requested"}}).countDocuments();

        let historyData = await CompanyRewards.find({status:{$ne:"Requested"}},{},{
            sort: {
                "created_at": "desc"
            }
        }).populate({ path: "ToUser", select: 'emailid walletaddress' }).populate({ path: "FromUser", select: 'emailid walletaddress' }).populate({ path: "CompanyID", select: 'name' }).skip(offset).limit(limit);

        res.setHeader('response-security', true);
        res.status(200).json({data:await responseBodyEncryptionAdmin({ data: historyData, error: null, total:totalHistory}),type:"adminauth"});
    }catch(e){
        console.log("Error while fetching requested ",e);
        res.status(400).json({ data: null, error: "Failed to fetch" });
    }
}

export default adminmiddleware(handler);