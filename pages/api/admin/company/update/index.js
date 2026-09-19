import getMongoDBConnection from "../../../../../utils/connection/mongodbconnection";
import usermiddleware from "../../../../../middleware/usermiddleware";
import { responseBodyEncryption } from "../../../../../utils/common/jwtToken";
import company from "../../../../../models/company/company";
import catagory from "../../../../../models/company/catagory";

const Joi = require("joi");

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

    //validate request
    const schema = Joi.object({
      id: Joi.string().required(),
      name: Joi.string().required(),
      username: Joi.string().required(),
      owner: Joi.string().required(),
      email: Joi.string().required(),
      address: Joi.string().required(),
      website: Joi.array().items(Joi.string()).required(),
      youraddress: Joi.string().required(),
      youremail: Joi.string().required(),
      shareholders: Joi.number().required(),
      business: Joi.string().required(),
      catagoryName: Joi.string().required(),
      renewalDate: Joi.string().required(),
      expireDate: Joi.string().required(),
      employees: Joi.number().required(),
      walletaddress: Joi.string().required(),
      socialMedia: Joi.object().required(),
      enterdby: Joi.string().required(),
      logo: Joi.string().required(),
      tagline: Joi.string().required(),
      catagoryid: Joi.string().required(),
    });
    const validresult = schema.validate(req.body, options);
    if (validresult.error) {
      res
        .status(400)
        .json({ data: null, error: "Invalid arguments" + validresult.error });
      return;
    }
    //check if id is valid
    const validcompany = await company.findOne({ _id: validresult.value.id });
    if (!validcompany) {
      res.status(400).json({ data: null, error: "Invalid company id" });
      return;
    }
    //get mongodb connection
    await getMongoDBConnection();
    //get catagory id
    const catagoryid = await catagory.findOne({
      name: validresult.value.catagoryid,
    });
    if (!catagoryid) {
      res.status(400).json({ data: null, error: "Invalid catagory" });
      return;
    }
    //username validation
    const companyid = await company.findOne({
      //req.body.username is equal to username in database
      username: validresult.value.username,
    });
    if (companyid) {
      res
        .status(400)
        .json({ data: null, error: "Username already exists", ok: companyid });
      return;
    }
    //update company
    let result = await company.updateOne(
      { _id: validresult.value.id },
      {
        name: req.body.name,
        username: req.body.username,
        owner: req.body.owner,
        email: req.body.email,
        address: req.body.address,
        website: req.body.website,
        yourAddress: req.body.youraddress,
        yourEmail: req.body.youremail,
        shareHolders: req.body.shareholders,
        employees: req.body.employees,
        logo: req.body.logo,
        business: req.body.business,
        catagoryName: req.body.catagoryName,
        socialMedia: req.body.socialMedia,
        renewalDate: req.body.renewalDate,
        expireDate: req.body.expireDate,
        walletAddress: req.body.walletaddress,
        enterdBy: req.body.enterdby,
        tagline: req.body.tagline,
        catagoryId: catagoryid._id,
      }
    );
    //send response
    res.setHeader("response-security", true);
    res.status(200).json({
      data: await responseBodyEncryption({ data: result }),
      type: "adminauth",
    });
  } catch (error) {
    console.log(error)
    res.status(400).json({ data: null, error: "Failed to update" });
  }
};

export default usermiddleware(handler);
