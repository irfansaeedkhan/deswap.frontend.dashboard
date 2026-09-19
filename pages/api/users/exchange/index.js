import usermiddleware from "../../../../middleware/usermiddleware";
import { convertUSDToCrypto } from "../../../../utils/common/exchangerate"
import { responseBodyEncryption } from "../../../../utils/common/jwtToken"
/**
 * @api {post} /api/users/exchange Exchange Currency 
 * @apiName ExchangeCurrency
 * @apiPermission User
 * @apiGroup User/Exchange
 * @apiVersion 1.0.0
 * @apiDescription Exchange Currency
 * @apiExample {axios} Example usage:
 * axios.post('/api/users/exchange')
 * @apiSuccessExample {json} Success-Response:
 * {
 * "data": "encrypted data",
 * "error": null,
 * "type": "userauth"
 * }
 * @apiErrorExample {json} Error-Response:
 * {
 * "data": null,
 * "error": "error message",
 * }
 */
const handler = async(req, res) => {
    try {
        let result = await convertUSDToCrypto();
        
        res.setHeader('response-security', true)
        res.status(200).json({ data: await responseBodyEncryption({ data: result, error: null }), error: null, type: "userauth" });
    } catch (e) {
        console.log(e);
        res.status(400).json({ data: null, error: e.message });
    }
}

//export default usermiddleware(handler);
export default handler;