import getMongoDBConnection from "../../../../utils/connection/mongodbconnection.js";
import adminmiddleware from "../../../../middleware/adminmiddleware";
import Users from "../../../../models/Users";
import nftlicense from "../../../../models/nftlicense/licensedetails";
import userRequested from "../../../../models/nftlicense/purchase/userpurchased";
import { responseBodyEncryptionAdmin } from "../../../../utils/common/jwtToken";


const handler = async(req, res) => {
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
        let totalPacks = await userRequested.find({ Status: "Requested" }).countDocuments();
        //
        let Packs = await userRequested.find({ Status: "Requested" }).populate({ path: "UserID", select: 'emailid walletaddress' }).populate({ path: "NftLicense" }).skip(offset).limit(limit);
        
        res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryptionAdmin({ data: Packs, error: null, total: totalPacks }), type: "adminauth" });
    } catch (e) {
        console.log(e);
        res.status(400).json({ data: null, error: "Failed to fetch" + "\n" + e.message, total: 0 });
    }
}
export default adminmiddleware(handler);