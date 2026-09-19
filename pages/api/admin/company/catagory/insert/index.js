import getMongoDBConnection from "../../../../../../utils/connection/mongodbconnection";
import adminmiddleware from "../../../../../../middleware/adminmiddleware";
import { responseBodyEncryptionAdmin } from "../../../../../../utils/common/jwtToken";
import catagory from "../../../../../../models/company/catagory";
import Joi from "joi";

/**
 * @api {post} /api/admin/company/catagory/insert/ Insert Catagory
 * @apiName Insert Catagory
 * @apiGroup Admin/Company
 * @apiVersion 1.0.0
 * @apiDescription Insert Catagory
 * @apiBody {String} name Catagory Name
 * @apiBody {String} description Catagory Description
 * @apiExample {axios} Example usage:
 * axios.post('/api/admin/company/catagory/insert/',{
 *  name:"Catagory Name",
 * description:"Catagory Description"
 * });
 * @apiSuccess {String} data Data of the catagory
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
        //validate request
        const schema = Joi.object({
            name: Joi.string().required(),
            description: Joi.string().required(),
        });
        const validresult = schema.validate(req.body, options);
        if (validresult.error) {
            res.status(400).json({ data: null, error: "Invalid arguments" + validresult.error });
            return;
        }
        //get mongodb connection
        await getMongoDBConnection();
        //insert catagory
        const result = await catagory.insertMany({
            Name: validresult.value.name,
            Description: validresult.value.description,
            Status: "Active",
        });

        res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryptionAdmin({ data: result }), type: "adminauth" });
    } catch (error) {
        console.log("Error : ",error)
        res.status(500).json({ data: null, error: "Failed to insert" });
    }
};

export default adminmiddleware(handler);
