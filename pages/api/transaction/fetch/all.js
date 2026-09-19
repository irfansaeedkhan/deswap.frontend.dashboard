import getMongoDBConnection from "../../../../utils/connection/mongodbconnection";
import userTransactions from "../../../../models/transaction/usertransaction";
import adminmiddleware from "../../../../middleware/adminmiddleware";

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
            req.body.limit = 100;
        }

        await getMongoDBConnection();

        let count = await userTransactions.count({});

        let data = await userTransactions.find().skip(req.body.skip).limit(req.body.limit)
        
        res.status(200).json({ data:data ,totalcount:count, error: null });
  
    } catch (e) {
      console.log(e);
      res.status(400).json({ data: null, error: "Failed to Delete" });
    }
}

export default adminmiddleware(handler);