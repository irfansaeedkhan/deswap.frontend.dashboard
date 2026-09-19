import getMongoDBConnection from "../../../../utils/connection/mongodbconnection";
import userTransactions from "../../../../models/transaction/usertransaction";
import usermiddleware from "../../../../middleware/usermiddleware";

const handler = async(req, res) => {
    try {
        if (req.method !== 'POST') {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }

        await getMongoDBConnection();
        await userTransactions.updateOne({
            _id: req.body.transactionID
        }, {
            $set: {
                Status: req.body.Status
            },
        })

        res.status(200).json({ message: "Successfully deleted", error: null });
    } catch (e) {
        console.log(e);
        res.status(400).json({ data: null, error: "Failed to Delete" });
    }
}

export default usermiddleware(handler);