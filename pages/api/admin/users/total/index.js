import getMongoDBConnection from "../../../../../utils/connection/mongodbconnection";
import Users from "../../../../../models/Users";
import PackPurchased from "../../../../../models/deswapPack/purchasedpack";
import adminmiddleware from "middleware/adminmiddleware";

const handler = async(req, res) => {
    try {
        if (req.method !== "GET") {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }

        await getMongoDBConnection();
        
        const totalUsers= await Users.count();

        const totaPackPurchased= await PackPurchased.aggregate([
            {
                $group:
                {
                    _id:'$UserID'
                }
            }])
        
        res.setHeader('response-security', true);
        res.status(200).json({ data: { totalUsers: totalUsers,totaPackPurchased:totaPackPurchased.length }, error: null, type: "adminauth" });
    } catch (e) {
        console.log(e);
        res.status(400).json({ data: null, error: "Failed to fetch" });
    }
};

export default adminmiddleware(handler);