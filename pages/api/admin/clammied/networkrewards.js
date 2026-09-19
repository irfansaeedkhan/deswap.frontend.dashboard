import adminmiddleware from "../../../../middleware/adminmiddleware";
import getMongoDBConnection from "../../../../utils/connection/mongodbconnection.js";
import { responseBodyEncryptionAdmin } from "../../../../utils/common/jwtToken"
import networkRewards from "../../../../models/network/networkRewards";
/**
 * @api {post} /api/admin/clammied/networkrewards Get Network Rewards
 * @apiName Get Network Rewards
 * @apiGroup Admin/Clammied
 * @apiVersion 1.0.0
 * @apiDescription Get Network Rewards
 * @apiBody {Number} [limit] Limit
 * @apiBody {Number} [offset] offset
 * @apiExample {axios} Example usage:
 * axios.post('/api/admin/clammied/networkrewards',{
 *    limit:10,
 *   offset:0
 * });
 * @apiSuccess {String} data Data of the network rewards
 * 
 */
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

        let totalPacks = await networkRewards.find({
            Status:"Active"
        }).countDocuments();

        let Packs = await networkRewards.find({Status:"Active"}).populate({ path: "ClaimmedNetworkID", populate: [{ path: "UserTo", select: 'emailid walletaddress' }, { path: "UserFrom", select: 'emailid walletaddress' }], select: 'UserTo UserFrom Level RewardsPercentage Amount' }).skip(offset).limit(limit);
        
        res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryptionAdmin({ data: Packs, error: null, total: totalPacks }) , type:"adminauth"});
    } catch (e) {
        console.log(e);
        res.status(400).json({ data: null, error: "Failed to fetch" + "\n" + e.message, total: 0 });
    }
};
export default adminmiddleware(handler);