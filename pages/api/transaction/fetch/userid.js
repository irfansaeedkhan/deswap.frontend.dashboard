import getMongoDBConnection from "../../../../utils/connection/mongodbconnection";
import userTransactions from "../../../../models/transaction/usertransaction";
import usermiddleware from "../../../../middleware/usermiddleware";
import {responseBodyEncryption} from "../../../../utils/common/jwtToken";


const handler = async (req, res) => {
    try {
        if (req.method !== 'POST') {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }

        if (req.body.skip == undefined || req.body.skip == null || req.body.skip == 0) {
            req.body.skip = 0;
        }

        if (req.body.limit == undefined || req.body.limit == null || req.body.limit == 0) {
            req.body.limit = 10;
        }

        await getMongoDBConnection();

        let count = await userTransactions.count({UserTo:req.body.uuid,Status:{"$in":["Active","Requested","Rejected"]}});

        let data = await userTransactions.find({
            UserTo:req.body.uuid,
            Status:{"$in":["Active","Requested","Rejected"]}
        },{

        },
        {
            sort:{
                created_at: -1 //Sort by Date Added DESC
            }
        }).skip(req.body.skip).limit(req.body.limit).select("UserToPublicKey amountInMatic amountInDeswap created_at IncommingTxHash Status")

        res.setHeader('response-security', true);
        res.status(200).json({data:await responseBodyEncryption({ data:data ,total:count, error: null }) ,type:"userauth"});
  
    } catch (e) {
      console.log(e);
      res.status(400).json({ data: null, error: "Failed to fetch data" });
    }
}

export default usermiddleware(handler);