import getMongoDBConnection from "../../../../utils/connection/mongodbconnection";
import networkSetting from "../../../../models/networkRewardsSetting/networkRewardsSetting";
import adminmiddleware from "../../../../middleware/adminmiddleware";
import joi from "joi";
import { responseBodyEncryptionAdmin } from "../../../../utils/common/jwtToken"

const handler = async(req, res) => {
    try {
        //
        if (req.method !== 'POST') {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }
        //validate all the fields
        const schema = joi.object({
            level: joi.number().required(),
            percentage: joi.number().required(),
        });
        if (!schema.validate(req.body).error) {
            res.status(400).json({ data: null, error: "Invalid Request" });
            return;
        }

        await getMongoDBConnection();

        let result = await networkSetting.insertMany([{
            Level: req.body.level,
            Percentage: req.body.percentage,
        }]);
        res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryptionAdmin({ data: result, error: null, total: result.length }), type: "adminauth" });


    } catch (e) {
        console.log(e);
        res.status(400).json({ data: null, error: "Failed to fetch" });
    }
}

export default adminmiddleware(handler);