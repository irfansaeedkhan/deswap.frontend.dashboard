import getMongoDBConnection from "../../../../../utils/connection/mongodbconnection";
import Users from "../../../../../models/Users";
import PurchasedPack from "../../../../../models/deswapPack/purchasedpack";
import adminmiddleware from "../../../../../middleware/adminmiddleware";
import { responseBodyEncryptionAdmin } from "../../../../../utils/common/jwtToken"

const handler = async (req, res) => {
    try {

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


        let totalPacks = await PurchasedPack.count()
        let Packs = await PurchasedPack.find({
        }).skip(offset).limit(limit).populate({path: 'UserID',select:'walletaddress'})
        

        // let data = {
        //     total: totalPacks,
        //     data: Packs,
        // };

        res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryptionAdmin({ data: Packs, total:totalPacks }), type: "adminauth" });
    } catch (e) {
        console.log("Error while fetching requested ", e);
        res.status(400).json({ data: null, error: "Failed to fetch" });
    }
}

export default adminmiddleware(handler);