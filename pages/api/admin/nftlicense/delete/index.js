import NFTlicense from "../../../../../models/nftlicense/licensedetails";
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
    //get mongodb connection
    await getMongoDBConnection();
    //get and validate id from request
    const schema = await Joi.object({
      id: Joi.string().required(),
    });
    const validresult = await schema.validate(req.body, options);
    if (validresult.error) {
      res.status(400).json({ data: null, error: "Invalid arguments" });
      return;
    }
    //delete
    let result = await NFTlicense.deleteOne({ _id: validresult.value.id });

    res.setHeader("response-security", true);
    res
      .status(200)
      .json({ data: responseBodyEncryptionAdmin("Deleted"), error: null });
  } catch (error) {
    console.log(error)
    res.status(400).json({ data: null, error: "Failed to delete the license" });
  }
};

export default adminmiddleware(handler);
