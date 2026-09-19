import rewardsLevel from "../../../../../models/company/rewards/rewardsLevel";
import getMongoDBConnection from "../../../../../utils/connection/mongodbconnection";
import adminmiddleware from "../../../../../middleware/adminmiddleware";
import Joi from "joi";
import { responseBodyEncryptionAdmin } from "../../../../../utils/common/jwtToken";

const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: false,
    convert: true,
  };

const handler = async (req, res) => {
    try {
        if (req.method !== "POST") {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }
        
        const schema = Joi.object({
            _id: Joi.string().required(),
            Percentage: Joi.number().required(),
            Description: Joi.string().required()
        });
        const { error, value } = schema.validate(req.body, options);

        //end of joi validation
        await getMongoDBConnection();

        let updateresult = await rewardsLevel.updateOne(
            { _id: req.body._id },
            {
                $set: {
                    Percentage: req.body.Percentage,
                    Description: req.body.Description,
                },
            }
        );

        res.setHeader("response-security", true);
        res.status(200).json({
            data: await responseBodyEncryptionAdmin({
                data: "Success",
                error: null,
            }),
            type: "adminauth",
        });
    } catch (e) {
        console.log("Error ", e);
        res.status(400).json({ data: null, error: "Failed to insert license" + e });
    }
};

export default adminmiddleware(handler);
