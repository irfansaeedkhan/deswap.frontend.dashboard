import adminmiddleware from "../../../../middleware/adminmiddleware";
import getMongoDBConnection from "../../../../utils/connection/mongodbconnection.js";
import { responseBodyEncryptionAdmin } from "../../../../utils/common/jwtToken"

import Users from "../../../../models/Users";


/**
 * @api {GET} /api/admin/graph/totalusersgraph Get Total Users Graph
 * @apiName Get Total Users Graph
 * @apiGroup Admin/Graph
 * @apiVersion 1.0.0
 * @apiDescription Get Total Users Graph
 * @apiParam {String} startDate Start Date
 * @apiParam {String} endDate End Date
 * @apiExample {axios} Example usage:
 * axios.get('/api/admin/graph/totalusersgraph?startDate=2020-01-01&endDate=2020-01-31');
 * @apiSuccess {String} data Data of the catagory
 */

const handler = async(req, res) => {
    try {
        if (req.method !== "GET") {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }

        //TO DO : Seems wrong code
        //get date range from user
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;
        await getMongoDBConnection();
        let count = await Users.countDocuments({
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
        res.status(400).json({ data: null, error: "Failed to fetch"});
    }
};

export default adminmiddleware(handler);