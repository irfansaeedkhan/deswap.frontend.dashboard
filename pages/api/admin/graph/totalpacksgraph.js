import adminmiddleware from "../../../../middleware/adminmiddleware";
import getMongoDBConnection from "../../../../utils/connection/mongodbconnection.js";
import { responseBodyEncryptionAdmin } from "../../../../utils/common/jwtToken"

import Packs from "../../../../models/claimmedrewards/packclaimmed";

/**
 * @api {GET} /api/admin/graph/totalpacksgraph Get Total Packs Graph
 * @apiName Get Total Packs Graph
 * @apiGroup Admin/Graph
 * @apiVersion 1.0.0
 * @apiDescription Get Total Packs Graph
 * @apiParam {String} startDate Start Date
 * @apiParam {String} endDate End Date
 * @apiExample {axios} Example usage:
 * axios.get('/api/admin/graph/totalpacksgraph?startDate=2020-01-01&endDate=2020-01-31');
 * @apiSuccess {String} data Data of the catagory
 */

const handler = async(req, res) => {
    try {
        if (req.method !== "GET") {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }
        
        //TO DO : Seems wrong code
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;

        await getMongoDBConnection();
        
        let count = await Packs.countDocuments({
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            },
        });
        let data = {
            total: count,
        };

        res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryptionAdmin({ data: data, error: null, total: count }), type: "adminauth" });
    } catch (e) {
        console.log(e);
        res
            .status(400)
            .json({ data: null, error: "Failed to fetch" });
    }
};

export default adminmiddleware(handler);