import getMongoDBConnection from "../../../../../utils/connection/mongodbconnection";
import usermiddleware from "../../../../../middleware/usermiddleware";
import { responseBodyEncryption } from "../../../../../utils/common/jwtToken";
import companyRewards from "../../../../../models/company/rewards/rewards";
import catagory from "../../../../../models/company/catagory";


const Joi = require("joi");

/**
 * @api {post} /api/users/company/fetch Fetch Companies
 * @apiName FetchCompanies
 * @apiPermission User
 * @apiGroup User/Company
 * @apiVersion 1.0.0
 * @apiDescription Fetch Companies
 * @apiBody {Number} [offset] offset
 * @apiBody {Number} [limit] limit
 * @apiExample {axios} Example usage:
 * axios.post('/api/users/company/fetch', { offset: 0, limit: 20 })
 * 
 */

const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: false,
    convert: true,
};


const handler = async(req, res) => {
    try {

        if (req.method !== "POST") {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }

        //set offset and limit
        let offset = 0;
        let limit = 10;
        if (req.body.offset) {
            offset = parseInt(req.body.offset);
        }
        if (req.body.limit) {
            limit = parseInt(req.body.limit);
        }

        //get mongodb connection
        await getMongoDBConnection();
        //get company list with catagory
        const companylist = await companyRewards.find({
            FromUser:req.body.uuid,
            status:{
                $in:["Active","Requested"]
            },
            Level:2
        }).populate("CompanyID").skip(offset).limit(limit);
        const count = await companyRewards.count({FromUser:req.body.uuid, status: {
            $in:["Active","Requested"],
        },Level:2});
        if (!companylist) {
            res.status(400).json({ data: null, error: "Invalid company list" });
            return;
        }
        //response
        res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryption({ data: companylist, total:count }), type: "userauth" });
    } catch (error) {
        res.status(500).json({ data: null, error: error.message });
    }
}

export default usermiddleware(handler);
//export default handler