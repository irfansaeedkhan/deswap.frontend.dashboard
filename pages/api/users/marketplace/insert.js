import getMongoDBConnection from "../../../../utils/connection/mongodbconnection";
import usermiddleware from "../../../../middleware/usermiddleware";
import Users from "../../../../models/Users";
import { responseBodyEncryption } from "../../../../utils/common/jwtToken"
import MarketLicense from "../../../../models/marketplace/licence";
import Joi from "joi";
/**
 * @api {post} /api/users/marketplace/insert Create Marketplace License
 * @apiName CreateMarketplaceLicense
 * @apiPermission User
 * @apiGroup User/Marketplace
 * @apiVersion 1.0.0
 * @apiDescription Create Marketplace License
 * @apiBody {String} [name] Name of the license
 * @apiBody {String} signature_hash Signature hash of the license
 * @apiExample {axios} Example usage:
 * axios.post('/api/users/marketplace/insert', {
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
        let marketplaceLicenseValidator = await Joi.object({
            name: Joi.string().trim(),
            signature_hash: Joi.string().trim().required(),
            activate: Joi.boolean().required()
        });
        const { error, value } = marketplaceLicenseValidator.validate(req.body, options);
        if (error) {
            console.log(error);
            res.status(400).json({ data: null, error: "Failed to create marketplace license" });
            return;
        }

        await getMongoDBConnection();
        //get current user wallet address
        let user = await Users.findOne({
            _id: req.body.uuid
        });
        if (!user) {
            res.status(400).json({ data: null, error: "User not found" });
            return;
        }
        let checkiflicenceisalreadyexists = await MarketLicense.findOne({
            UserID:req.body.uuid,
            status:{$in:["Active","Requested"]}
        });

        if (checkiflicenceisalreadyexists) {
            //licence already exists
            res.status(400).json({ data: null, error: "Failed to create marketplace license" });
            return;
        }

        let newMarketLicense = new MarketLicense({
            UserID:req.body.uuid,
            creatorAddress: user.walletaddress[user.walletaddress.length-1],
            name: req.body.name || "",
            signature_hash: req.body.signature_hash,
            activate:req.body.activate
        });

        let marketplaceLicense = await newMarketLicense.save();

        res.setHeader('response-security', true);
        res.status(200).json({ data:await responseBodyEncryption({data:marketplaceLicense, error: null }),type:"userauth"});
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ data: null, error: "Failed to create marketplace license" });
        return;
    }
}

export default usermiddleware(handler);
