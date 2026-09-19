import networkclaimmed from "../../../../models/claimmedrewards/networkclaimmed";
import getMongoDBConnection from "../../../../utils/connection/mongodbconnection";
import adminmiddleware from "../../../../middleware/adminmiddleware";
import { responseBodyEncryptionAdmin } from "../../../../utils/common/jwtToken";
/**
 * @api {post} /api/admin/clammied/networkclaimmedrequested Get Claimmed Pack Requested
 * @apiName GetClaimmedPackRequested
 * @apiPermission Admin
 * @apiVersion 1.0.0
 * @apiDescription Get Claimmed Pack Requested
 * @apiBody {String} [offset] Offset
 * @apiBody {String} [limit] Limit
 * @apiHeader {String} cookies Admin's unique cookies.
 * @apiDefine adminauth Admin Authentication.
 * @apiSuccess {String} data Encrypted Pack Requested
 * @apiSuccess {String} type adminauth
 * @apiError {String} error Failed to fetch.
 * @apiExample {axios} Example usage:
 * axios.post('/api/admin/clammied/networkclaimmedrequested', {
 *  "offset": 0,
 * "limit": 10
 * })
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "data": "sadsadqwqwe213213enj23fdj213rj1jbd1jbjbd1bd12be21be21be1bejk21m1smknsjkndxjbd",
 *   "type": "adminauth"
 * }
 * @apiErrorExample {json} Error-Response:
 * {
 *   "data": null,
 *  "error": "Failed to fetch"
 * }
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
        let totalPacks = await networkclaimmed.find({ Status: "Requested" }).countDocuments();
        
        let Packs = await networkclaimmed.find({ Status: "Requested" }).populate({ path: "UserID", select: 'emailid walletaddress' }).populate({ path: "PackID", select: 'PackName Amount Bonous' }).populate({ path: "NetworkRewardsID", populate: [{ path: "UserTo", select: 'emailid walletaddress' }, { path: "UserFrom", select: 'emailid walletaddress' }], select: 'UserTo UserFrom Level RewardsPercentage Amount' }).skip(offset).limit(limit);
        
        res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryptionAdmin({ data: Packs, error: null, total: totalPacks }), type: "adminauth" });
    } catch (e) {
        console.log(e);
        res.status(400).json({ data: null, error: "Failed to fetch" + "\n" + e.message, total: 0 });
    }
}
export default adminmiddleware(handler);