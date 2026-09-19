import getMongoDBConnection from "../../../../../utils/connection/mongodbconnection";
import usermiddleware from "../../../../../middleware/usermiddleware";
import { responseBodyEncryption } from "../../../../../utils/common/jwtToken";
import company from "../../../../../models/company/company";


const Joi = require("joi");
/**
 * @api {post} /api/users/company/username/check Check Username
 * @apiName CheckUsername
 * @apiPermission User
 * @apiGroup User/Company
 * @apiVersion 1.0.0
 * @apiDescription Check Username is available or not
 * @apiBody {String} username
 * @apiExample {axios} Example usage:
 * axios.post('/api/users/company/username/check', {
 *  "username": "test35675",
 * });
 * @apiSuccessExample {json} Success-Response:
 * {
 *  "data": "encrypted data",
 * "error": null,
 * "type": "userauth"
 * }
 * @apiErrorExample {json} Error-Response:
 * {
 * "data": null,
 * "error": "error message",
 * }
 * 
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
            username: Joi.string().required(),
        });
        const validresult = schema.validate(req.body, options);
        if (validresult.error) {
            res.status(400).json({ data: null, error: "Invalid arguments" + validresult.error });
            return;
        }

        //mogo db connection
        await getMongoDBConnection();

        //check if username is already taken
        const companyid = await company.findOne({ username: req.body.username });
        if (companyid) {
            res.status(400).json({ data: await responseBodyEncryption({ data: "username alrady taken", error: null }), error: null, type: "userauth" });
            return;
        }
        //response
        res.setHeader('response-security', true)
        res.status(200).json({ data: await responseBodyEncryption({ data: "username available", error: null }), error: null, type: "userauth" });
    } catch (error) {
        res.status(500).json({ data: null, error: error.message });
    }
}

export default usermiddleware(handler);