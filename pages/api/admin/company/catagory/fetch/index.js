import getMongoDBConnection from "../../../../../../utils/connection/mongodbconnection";
import adminmiddleware from "../../../../../../middleware/adminmiddleware";
import { responseBodyEncryptionAdmin } from "../../../../../../utils/common/jwtToken";
import catagory from "../../../../../../models/company/catagory";
/** 
 * @api {post} /api/admin/company/catagory/fetch/ Get Catagory
 * @apiName Get Catagory
 * @apiGroup Admin/Company
 * @apiVersion 1.0.0
 * @apiDescription Get Catagory
 * @apiBody {Number} [limit] Limit
 * @apiBody {Number} [offset] offset
 * @apiExample {axios} Example usage:
 * axios.post('/api/admin/company/catagory/fetch/',{
 *  limit:10,
 * offset:0
 * });
 * @apiSuccess {String} data Data of the catagory
 */
const handler = async(req, res) => {
    try {
        if (req.method !== "GET") {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }
        //set offset and limit
        let offset = 0;
        let limit = 10;
        if (req.query.offset) {
            offset = parseInt(req.query.offset);
        }
        if (req.query.limit) {
            limit = parseInt(req.query.limit);
        }
        //get mongodb connection
        await getMongoDBConnection();
        //get catagory where status is active
        const result = await catagory.find({
            Status: "Active",
        }).skip(offset).limit(limit);
        res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryptionAdmin({ data: result, error: null, total: result.length }), type: "adminauth" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ data: null, error: "Failed to fetch" });
    }
}

export default adminmiddleware(handler);
