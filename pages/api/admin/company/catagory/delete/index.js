import getMongoDBConnection from "../../../../../../utils/connection/mongodbconnection";
import adminmiddleware from "../../../../../../middleware/adminmiddleware";
import { responseBodyEncryptionAdmin } from "../../../../../../utils/common/jwtToken";
import catagory from "../../../../../../models/company/catagory";
/**
 * @api {post} /api/admin/company/catagory/delete/ Delete Catagory
 * @apiName Delete Catagory
 * @apiGroup Admin/Company
 * @apiVersion 1.0.0
 * @apiDescription Delete Catagory
 * @apiBody {String} catagoryid Catagory ID
 * @apiExample {axios} Example usage:
 * axios.post('/api/admin/company/catagory/delete/',{
 *   catagoryid:"5e8f8f8f8f8f8f8f8f8f8f8f"
 * });
 * @apiSuccess {String} data Data of the catagory
 */
const handler = async(req, res) => {
    try {
        if (req.method !== "POST") {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }
        //get mongodb connection
        await getMongoDBConnection();
        //delete catagory
        const result = await catagory.deleteOne({
            _id: req.body.id,
        });
        res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryptionAdmin({ data: result }), type: "adminauth" });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ data: null, error: "Failed to delete category" });
    }
};

export default adminmiddleware(handler);