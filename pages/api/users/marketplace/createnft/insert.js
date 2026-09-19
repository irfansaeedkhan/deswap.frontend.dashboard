import getMongoDBConnection from "../../../../../utils/connection/mongodbconnection";
import usermiddleware from "../../../../../middleware/usermiddleware";
import Users from "../../../../../models/Users";
import { responseBodyEncryption } from "../../../../../utils/common/jwtToken"
import CreateNFT from "../../../../../models/marketplace/createnft";
import Joi from "joi";
/**
 * @api {post} /api/users/marketplace/createntf/insert Create Marketplace License
 * @apiName CreateMarketplaceLicense
 * @apiPermission User
 * @apiGroup User/Marketplace
 * @apiVersion 1.0.0
 * @apiDescription Create Marketplace License
 * @apiBody {String} [name] Name of the license
 * @apiBody {String} signature_hash Signature hash of the license
 * @apiExample {axios} Example usage:
 * axios.post('/api/users/marketplace/createntf/insert', {
 * "name": "test35675",
 * "signature_hash": "0x123456789",
 * });
 * @apiSuccessExample {json} Success-Response:
 * {
 * "data": "encrypted data",
 * "error": null,
 * "type": "userauth"
 * }
 * @apiErrorExample {json} Error-Response:
 * {
 * "data": null,
 * "error": "Failed to create marketplace license",
 * }
 */

const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: false,
    convert: true,
};


const handler = async(req, res) => {
    try {
        //check if request is post
        if (req.method !== 'POST') {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }
        //validate request body
        let createNFTValidator = await Joi.object({
            Purchased: Joi.string().trim().optional(),
            SpecificBuyer: Joi.string().trim().optional(),
        });
        const { error, value } = createNFTValidator.validate(req.body, options);
        if (error) {
            console.log(error);
            res.status(400).json({ data: null, error: "Failed to create marketplace license" });
            return;
        }

        await getMongoDBConnection();
        //get current user wallet address
        

        let newCreateNFT = new CreateNFT({
            UserID:req.body.uuid,
            Purchased: req.body.Purchased,
            SpecificBuyer: req.body.SpecificBuyer
        });

        let createNFT = await newCreateNFT.save();

        res.setHeader('response-security', true);
        res.status(200).json({ data:await responseBodyEncryption({data:createNFT, error: null }),type:"userauth"});
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ data: null, error: "Failed to create marketplace license" });
        return;
    }
}

export default usermiddleware(handler);
