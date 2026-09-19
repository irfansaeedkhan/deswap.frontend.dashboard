import adminmiddleware from "../../../../middleware/adminmiddleware";
import getMongoDBConnection from "../../../../utils/connection/mongodbconnection.js";
import { responseBodyEncryptionAdmin } from "../../../../utils/common/jwtToken"

import Users from "../../../../models/Users";


/**
 * @api {GET} /api/admin/fees/ Get Fees
 * @apiName Get Fees
 * @apiGroup Admin/Fees
 * @apiVersion 1.0.0
 * @apiDescription Get Fees
 * @apiBody {Number} [limit] Limit
 * @apiBody {Number} [offset] offset
 * @apiExample {axios} Example usage:
 * axios.get('/api/admin/fees/',{
 * limit:10,
 * offset:0
 * });
 * @apiSuccess {String} data Data of the fees
 */

const handler = async(req, res) => {
    try {
        if (req.method !== "GET") {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }
        let offset = 0;
        let limit = 10;
        if (req.query.offset) {
            offset = parseInt(req.query.offset);
        }
        if (req.query.limit) {
            limit = parseInt(req.query.limit);
        }
        await getMongoDBConnection();
        
        //TO DO : wrong code why we are running loop for sum it should be done by $sum or $count in mongodb
        let User = await Users.find()
            .select(
                "ammount transactionhash conversionrate emailid username walletaddress"
            )
            .skip(offset)
            .limit(limit);

        let sum = 0;
        
        User.forEach((element) => {
            sum += parseInt(element.amount) * parseInt(element.conversionrate);
        });
        let count = await Users.countDocuments();
        let data = {
            total: count,
            sum: sum,
            data: User,
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