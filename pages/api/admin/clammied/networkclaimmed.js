import adminmiddleware from "../../../../middleware/adminmiddleware";
import getMongoDBConnection from "../../../../utils/connection/mongodbconnection.js";
import userModal from "../../../../models/Users";
import networkRewardsModal from "../../../../models/network/networkRewards";
import packModal from "../../../../models/deswapPack/packdetails";
import networkclaimmed from "../../../../models/claimmedrewards/networkclaimmed";
import { responseBodyEncryptionAdmin } from "../../../../utils/common/jwtToken"
/**
 * @api {post} /api/admin/claimmed/fetch fetch Claimmed Rewards
 * @apiName FetchClaimmedRewards
 * @apiPermission Admin
 * @apiGroup Claimmed
 * @apiVersion 1.0.0
 * @apiDescription Fetch Claimmed Rewards
 * @apiBody  {Number} [offset] offset 
 * @apiBody  {Number} [limit] limit 
 * @apiParamExample {json} Request-Example:
 * {
 *    "offset": 0,
 *   "limit": 10
 * }
 * @apiExample {axios} Example usage:
 * axios.post('/api/admin/claimmed/fetch', {
 *   "offset": 0,
 *  "limit": 10
 * })
 * @apiSuccessExample {json} Success-Response:
 * {
 *  "data": "ecrypted data",
 * "type": "adminauth"
 * }
 * @apiErrorExample {json} Error-Response:
 * {
 * "data": null,
 * "error": "Failed to fetch"
 * }
 * 
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
        //totalpacks where status is not requested
        let totalPacks = await networkclaimmed.find({ Status: { $nin: ["Requested"] } }).countDocuments();

        //UserID PackID NetworkRewardsID
        let Packs = await networkclaimmed.find({ Status: { $nin: ["Requested"] } }).populate({ path: "UserID", select: 'emailid walletaddress' }).populate({ path: "PackID", select: 'PackName Amount Bonous' }).populate({ path: "NetworkRewardsID", populate: [{ path: "UserTo", select: 'emailid walletaddress' }, { path: "UserFrom", select: 'emailid walletaddress' }], select: 'UserTo UserFrom Level RewardsPercentage Amount' }).skip(offset).limit(limit);

        res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryptionAdmin({ data: Packs, error: null, total: totalPacks }), type: "adminauth" });
    } catch (e) {
        console.log(e);
        res.status(400).json({ data: null, error: "Failed to fetch" + "\n" + e.message, total: 0 });
    }
};
export default adminmiddleware(handler);