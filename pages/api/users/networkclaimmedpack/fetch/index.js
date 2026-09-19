import Connection from "../../../../../db/db";
import NetworkClaimmedPack from "../../../../../models/claimmedrewards/networkclaimmed";
import { responseBodyEncryption } from "../../../../../utils/common/jwtToken"
/**
 * @api {post} api/users/networkclaimmedpack/fetch/ Get network claimmed pack
 * @apiName GetNetworkClaimmedPack
 * @apiPermission User
 * @apiGroup User/Network
 * @apiVersion 1.0.0
 * @apiDescription Get network claimmed pack
 * @apiBody {string} [skip] skip
 * @apiBody {string} [limit] limit
 * @apiExample {axios} Example usage:
 * axios.post('/api/users/networkclaimmedpack/fetch/',{
 *    skip: 0,
 *   limit: 10
 * })
 * @apiSuccessExample {json} Success-Response:
 * {
 * "data": "encrypted data",
 * "error": null,
 * "type": "userauth"
 * }
 * @apiErrorExample {json} Error-Response:
 * {
 * "data": null,
 * "error": "Failed to fetch network claimmed pack",
 * }
 */
const handler = async(req, res) => {
    try {
        //
        if (req.method !== 'POST') {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }

        await Connection();

        if (req.body.skip == undefined || req.body.skip == null || req.body.skip == 0) {
            req.body.skip = 0;
        }

        if (req.body.limit == undefined || req.body.limit == null || req.body.limit == 0) {
            req.body.limit = 10;
        }

        let result = await NetworkClaimmedPack.find({
            UserID: req.body.uuid,
            Status: "Active"
        }, {}, {
            sort: {
                "created_at": "asc"
            }
        }).skip(req.body.skip).limit(req.body.limit).populate("PackID");

        res.setHeader('response-security', true)
        res.status(200).json({ data: await responseBodyEncryption({ data: result, error: null }), type: "userauth" });

    } catch (e) {
        console.log(e);
        res.status(400).json({ data: null, error: "Failed to fetch" });
    }
}

//Need to add middleware
//export default adminmiddleware(handler);
export default handler;