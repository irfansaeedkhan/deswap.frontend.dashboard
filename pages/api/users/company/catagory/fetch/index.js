import getMongoDBConnection from "../../../../../../utils/connection/mongodbconnection";
import usermiddleware from "../../../../../../middleware/usermiddleware";
import { responseBodyEncryption } from "../../../../../../utils/common/jwtToken";
import catagory from "../../../../../../models/company/catagory";
/**
 * @api {get} /api/users/company/catagory/fetch?offset=:offset&limit=:limit Fetch Catagories
 * @apiName FetchCatagories
 * @apiPermission User
 * @apiGroup User/Company/Catagory
 * @apiVersion 1.0.0
 * @apiDescription Fetch Catagories
 * @apiParam {Number} [offset] offset
 * @apiParam {Number} [limit] limit
 * @apiExample {axios} Example usage:
 * axios.get('/api/users/company/catagory/fetch?offset=0&limit=20')
 *
 * 
 * 
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
        //get category where status is active
        const result = await catagory.find({
            Status: "Active",
        }).skip(offset).limit(limit);
        res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryption({ data: result, error: null, total: result.length }), type: "userauth" });
    } catch (error) {
        res.status(500).json({ data: null, error: error.message });
    }
}

export default usermiddleware(handler);