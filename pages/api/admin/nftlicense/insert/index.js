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

    const schema = await Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
      price: Joi.number().required(),
      currency: Joi.string().required(),
      lookup: Joi.number().required(),
      lookupinterval: Joi.string().required(),
      image: Joi.string().required(),
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
    //calculate index
    const index = await NFTlicense.find({}).sort({ Index: -1 }).limit(1);
    let newindex = 0;
    if (index.length > 0) {
      newindex = index[0].Index + 1;
    }

    let result = await NFTlicense.insertMany([
      {
        Name: req.body.name,
        Description: req.body.description,
        Price: req.body.price,
        Currency: req.body.currency,
        LookUp: req.body.lookup,
        LookUpInterval: req.body.lookupinterval,
        Image: req.body.image,
        Index: newindex,
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
    res.status(400).json({ data: null, error: "Failed to insert license" });
  }
};

export default adminmiddleware(handler);
