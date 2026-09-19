import usermiddleware from "../../../../../middleware/usermiddleware"
import { fetchUserUpline } from "../../../../../utils/network/upline/index"
import {responseBodyEncryption} from "../../../../../utils/common/jwtToken"
/**
 * @api {post} /api/users/network/upline Get upline
 * @apiName Getupline
 * @apiPermission User
 * @apiGroup User/Network
 * @apiVersion 1.0.0
 * @apiDescription Get upline
 * @apiExample {axios} Example usage:
 * axios.post('/api/users/network/upline')
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
        let upline = await fetchUserUpline(req.body.uuid)
        let uplineData=new Array();
        for(let i=0;i<upline.length;i++){
            if(upline[i]==null){
                break;
            }
            uplineData.push(upline[i])
        }
        res.setHeader('response-security', true)
        res.status(200).json({ data: await responseBodyEncryption({ data: uplineData, error: null }), type: "userauth" });
    } catch (e) {
        console.log(e);
        res.setHeader('response-security', true)
        res.status(200).json({ data: await responseBodyEncryption({ data: null, error: "Failed to fetch upline" }), type: "userauth" });
    }
}

export default usermiddleware(handler);