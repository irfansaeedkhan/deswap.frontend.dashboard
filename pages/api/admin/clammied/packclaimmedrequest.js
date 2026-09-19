import adminmiddleware from "../../../../middleware/adminmiddleware";
import getMongoDBConnection from "../../../../utils/connection/mongodbconnection.js";
import PackDetails from "../../../../models/deswapPack/packdetails";
import PurchasedPack from "../../../../models/deswapPack/purchasedpack";
import PackClaimmed from "../../../../models/claimmedrewards/packclaimmed";
import { responseBodyEncryptionAdmin } from "../../../../utils/common/jwtToken"

/**
 * @api {post} /api/admin/clammied/packclaimmedrequest Get Pack Claimmed Request
 * @apiName Get Pack Claimmed Request
 * @apiGroup Admin/Clammied
 * @apiVersion 1.0.0
 * @apiDescription Get Pack Claimmed Request
 * @apiBody {Number} [limit] Limit
 * @apiBody {Number} [offset] offset
 * @apiExample {axios} Example usage:
 * axios.post('/api/admin/clammied/packclaimmedrequest',{
 *   limit:10,
 *  offset:0
 * });
 * @apiSuccess {String} data Data of the pack claimmed request
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
        
        let totalPacks = await PackClaimmed.find({Status: { $in: ["Requested"]}}).countDocuments();
        
        let Packs = await PackClaimmed.find({
            Status: { $in: ["Requested"]}
        }).skip(offset).limit(limit).populate({path: 'UserID',select:'emailid username walletaddress'}).populate({path:"PackID"}).populate({path:"PurchasedPack"});
        
        let data = {
            total: totalPacks,
            data: Packs,
        };
        res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryptionAdmin({ data: data, error: null, total: totalPacks }), type: "adminauth" });
    } catch (e) {
        console.log(e);
        res.status(400).json({ data: null, error: "Failed to fetch"});
    }
};
export default adminmiddleware(handler);