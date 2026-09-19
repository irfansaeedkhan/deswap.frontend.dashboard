import usermiddleware from "../../../../../middleware/usermiddleware"
import { fetchUserDownline } from "../../../../../utils/network/downline";
import { responseBodyEncryption } from "../../../../../utils/common/jwtToken"
/**
 * @api {post} /api/users/network/downline Get Downline
 * @apiName GetDownline
 * @apiPermission User
 * @apiGroup User/Network
 * @apiVersion 1.0.0
 * @apiDescription Get Downline
 * @apiExample {axios} Example usage:
 * axios.post('/api/users/network/downline')
 * @apiSuccessExample {json} Success-Response:
 * {
 * "data": "encrypted data",
 * "error": null,
 * "type": "userauth"
 * }
 * @apiErrorExample {json} Error-Response:
 * {
 * "data": null,
 * "error": "Failed to fetch upline",
 * }
 */
const handler = async(req, res) => {
    try {
        let downline = await fetchUserDownline(req.body.uuid)
        
        res.setHeader('response-security', true)
        res.status(200).json({ data: await responseBodyEncryption({ data: downline, error: null }), type: "userauth" });
    } catch (e) {
        console.log(e);
        res.setHeader('response-security', true)
        res.status(200).json({ data: await responseBodyEncryption({ data: null, error: "Failed to fetch upline" }), type: "userauth" });
    }
}

export default usermiddleware(handler);