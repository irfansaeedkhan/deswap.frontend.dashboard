import Connection from "../../../../../db/db";
import packdetails from "../../../../../models/deswapPack/packdetails";
import usermiddleware from "../../../../../middleware/usermiddleware";
import { responseBodyEncryption } from "../../../../../utils/common/jwtToken"

/**
 * @api {post} /api/users/pack/fetch/ Fetch Pack
 * @apiName FetchPack
 * @apiGroup User/Pack
 * @apiVersion 1.0.0
 * @apiDescription Fetch Pack
 * @apiExample {axios} Example usage:
 * axios.post('/api/users/pack/fetch/')
 * @apiSuccess {String} message Success message.
 * @apiSuccess {String} data User data.
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

        let result = await packdetails.find({
            Status: "Active"
        });

        res.setHeader('response-security', true)
        res.status(200).json({data:await responseBodyEncryption({ data: result, error: null }), type:"userauth"});

    } catch (e) {
        console.log(e);
        res.status(400).json({ data: null, error: "Failed to fetch" });
    }
}

//Need to add middleware
export default usermiddleware(handler);
// export default handler;