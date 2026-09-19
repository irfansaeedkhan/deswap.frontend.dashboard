import getMongoDBConnection from "../../../../../utils/connection/mongodbconnection";
import Users from "../../../../../models/Users";
import UserTransaction from "../../../../../models/transaction/usertransaction";
import adminmiddleware from "../../../../../middleware/adminmiddleware";
import {responseBodyEncryptionAdmin} from "../../../../../utils/common/jwtToken"

const handler = async(req, res) => {
    try{
        /*
        if (req.method !== "POST") {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }
        */

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

        let totalrequestSwap = await UserTransaction.find({Status:"Requested"}).countDocuments();

        let requestedSwap = await UserTransaction.find({Status:"Requested"},
        {},{
            sort: {
                "created_at": "desc"
            }
        }).populate({ path: "UserTo", select: 'emailid walletaddress' }).skip(offset).limit(limit);
        
        res.status(200).json({ data: requestedSwap, error: null, total:totalrequestSwap });
    }catch(e){
        console.log("Error while fetching requested ",e);
        res.status(400).json({ data: null, error: "Failed to fetch" });
    }
}

export default adminmiddleware(handler);