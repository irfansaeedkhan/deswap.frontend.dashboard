import getMongoDBConnection from "../../../../utils/connection/mongodbconnection";
import adminmiddleware from "../../../../middleware/adminmiddleware";
import Users from "../../../../models/Users";
import { responseBodyEncryptionAdmin } from "../../../../utils/common/jwtToken"
import MarketLicense from "../../../../models/marketplace/licence";

/**
 * @api {post} /api/admin/marketplace/getalllicences/ Get All Marketplace Licenses
 * @apiName Get All Marketplace Licenses
 * @apiGroup Admin/Marketplace
 * @apiVersion 1.0.0
 * @apiDescription Get All Marketplace Licenses
 * @apiBody {String} offset Offset
 * @apiBody {String} limit Limit
 * @apiExample {axios} Example usage:
 * axios.post('/api/admin/marketplace/getalllicences/',{
 * offset:0,
 * limit:10
 * });
 * @apiSuccess {String} data Data of the marketplace licenses
 */

const handler = async(req, res) => {
    try {
        if (req.method !== 'POST') {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }

        let offset = 0;
        let limit = 10;
        if (req.body.offset) {
            offset = parseInt(req.body.offset);
        }
        if (req.body.limit) {
            limit = parseInt(req.body.limit);
        }

        await getMongoDBConnection();

        let marketplaceLicense = await MarketLicense.find({status:{$ne:"Requested"}}).skip(offset).limit(limit).exec();
        let total = await MarketLicense.count({status:{$ne:"Requested"}});

       
        res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryptionAdmin({data:marketplaceLicense,total:total, error: null }),type:"adminauth"});;
    } catch (error) {
        res.status(400).json({ data: null, error: error.message });
    }
}

export default adminmiddleware(handler);