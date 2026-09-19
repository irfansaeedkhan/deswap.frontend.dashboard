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


const handler = async(req, res) => {
    try {
        if (req.method !== "POST") {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }

        //get company id from request
        const companyid = req.body.companyid;
        if (!companyid) {
            res.status(400).json({ data: null, error: "Invalid company id" });
            return;
        }
        //delete company
        const companydelete = await company.findByIdAndRemove(companyid);
        if (!companydelete) {
            res.status(400).json({ data: null, error: "Invalid company delete" });
            return;
        }


        res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryptionAdmin({ data: "deleted company" }), type: "adminauth" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ data: null, error: "Failed to delete" });
    }
}

export default adminmiddleware(handler);