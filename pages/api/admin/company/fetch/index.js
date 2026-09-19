import getMongoDBConnection from "../../../../../utils/connection/mongodbconnection";
import adminmiddleware from "../../../../../middleware/adminmiddleware";
import { responseBodyEncryptionAdmin } from "../../../../../utils/common/jwtToken";
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

    //set offset and limit
    let offset = 0;
    let limit = 10;
    if (req.query.offset) {
      offset = req.query.offset;
    }
    if (req.query.limit) {
      limit = req.query.limit;
    }

    //get mongodb connection
    await getMongoDBConnection();
    //get company list with catagory
    const companylist = await company.find({}).skip(offset).limit(limit);
    if (!companylist) {
      res.status(400).json({ data: null, error: "Invalid company list" });
      return;
    }
    //response
    res.setHeader("response-security", true);
    res
      .status(200)
      .json({
        data: await responseBodyEncryptionAdmin({ data: companylist }),
        type: "adminauth",
      });
  } catch (error) {
    console.log(error)
    res.status(400).json({ data: null, error: "Fail to fetch" });
  }
};

export default adminmiddleware(handler);
