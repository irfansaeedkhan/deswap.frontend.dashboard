import Connection from "../../../../../db/db";
import purchasedpack from "../../../../../models/deswapPack/purchasedpack";
import { responseBodyEncryption } from "../../../../../utils/common/jwtToken"
import usermiddleware from "../../../../../middleware/usermiddleware";

/**
 * @api {post} /api/users/purchasedclaimmedpack/fetch/ Fetch Purchased Claim Med Pack
 * @apiName FetchPurchasedClaimMedPack
 * @apiGroup User/Pack
 * @apiVersion 1.0.0
 * @apiDescription Fetch Purchased Claim Med Pack
 * @apiBody {Number} [skip=0]
 * @apiBody {Number} [limit=10]
 * @apiExample {axios} Example usage:
 * axios.post('/api/users/purchasedclaimmedpack/fetch/', {
 * skip: 0,
 * limit: 10
 * })
 * @apiSuccess {String} message Success message.
 * 
 *  @apiSuccess {String} data User data.
 * @apiSuccessExample {json} Success-Response:
 * {
 * "data": "Encrypted data"
 * }
 * @apiError {String} message Error message.
 * @apiErrorExample {json} Error-Response:
 * {
 * "message": "Error message"
 * }
 * 
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

        let result = await purchasedpack.find({
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
export default usermiddleware(handler);
//export default handler;