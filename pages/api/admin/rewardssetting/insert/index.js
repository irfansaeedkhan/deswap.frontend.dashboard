import networkSetting from "../../../../../models/networkRewardsSetting/networkRewardsSetting";
import getMongoDBConnection from "../../../../../utils/connection/mongodbconnection";
import adminmiddleware from "../../../../../middleware/adminmiddleware";
const Joi = require("joi");
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

    const schema = await Joi.object({
      Level: Joi.number().required(),
      Percentage: Joi.number().required(),
    });

    const validresult = await schema.validate(req.body, options);

    if (validresult.error) {
      res.status(400).json({
        data: null,
        error: "Invalid authentication" + validresult.error.message,
      });
      return;
    }
    //
    await getMongoDBConnection();
    
    let result = await networkSetting.insertMany([
      {
        Level: req.body.Level,
        Percentage: req.body.Percentage,
        Status:"Active"
      },
    ]);

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
