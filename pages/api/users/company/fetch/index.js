import getMongoDBConnection from "../../../../../utils/connection/mongodbconnection";
import usermiddleware from "../../../../../middleware/usermiddleware";
import { responseBodyEncryption } from "../../../../../utils/common/jwtToken";
import company from "../../../../../models/company/company";
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
        //Setting sort assending
        let sort = -1;

        if (req.body.offset) {
            offset = parseInt(req.body.offset);
        }
        if (req.body.limit) {
            limit = parseInt(req.body.limit);
        }

        if (req.body.sort){
            sort = parseInt(req.body.sort)
        }

        //get mongodb connection
        await getMongoDBConnection();
        
        let matchFilter = {$match:{}};

        //
        if(req.body.filtername && req.body.filtername.trim()!=""){
            matchFilter.$match.name = {$regex:req.body.filtername, $options: 'i'};
            matchFilter.$match.business = {$regex:req.body.filtername, $options: 'i'};
        }

        //get company list with catagory
        const companylist = await company.find({ status: {$in:["Active","Requested"]}}).skip(offset).limit(limit);
        const count = await company.count({ status: {$in:["Active","Requested"] } });
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