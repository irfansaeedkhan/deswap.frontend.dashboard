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
      _id: Joi.string().required(),
      name: Joi.string().required(),
      discription: Joi.string().required(),
      price: Joi.number().required(),
      currency: Joi.string().required(),
      lookup: Joi.number().required(),
      lookUpInterval: Joi.string().required(),
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

    //TO DO : Wrong
    // const schema = Joi.object({
    //   _id: Joi.string().required(),
    //   name: Joi.string().required(),
    //   discription: Joi.string().required(),
    //   price: Joi.number().required(),
    //   currency: Joi.string().required(),
    //   lookup: Joi.number().required(),
    //   lookUpInterval: Joi.string().required(),
    //   image: Joi.string().required(),
    // });
    // const result = schema.validate(req.body);
    // if (result.error) {
    //   res
    //     .status(400)
    //     .json({ data: null, error: result.error.details[0].message });
    //   return;
    // }
    //end of joi validation
    await getMongoDBConnection();
    //update nftlicense using _id
    //get old index using
    const oldIndex = await NFTlicense.findOne({ _id: req.body._id });
    const oldIndexValue = oldIndex.index;
    let updateresult = await NFTlicense.updateOne(
      { _id: req.body._id },
      {
        $set: {
          Name: req.body.name,
          Description: req.body.discription,
          Price: req.body.price,
          Currency: req.body.currency,
          LookUp: req.body.lookup,
          LookUpInterval: req.body.lookUpInterval,
          Image: req.body.image,
          Index: oldIndexValue,
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
