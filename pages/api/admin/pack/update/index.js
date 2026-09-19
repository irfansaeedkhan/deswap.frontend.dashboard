import getMongoDBConnection from "../../../../../utils/connection/mongodbconnection";
import packdetails from "../../../../../models/deswapPack/packdetails";
import adminmiddleware from "../../../../../middleware/adminmiddleware";
import Joi from "joi";
import { responseBodyEncryptionAdmin } from "../../../../../utils/common/jwtToken"

const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: false,
    convert: true,
  };

const handler = async(req, res) => {
    try {

        //TO DO : it should be in admin
        if (req.method !== 'POST') {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }

        await getMongoDBConnection();
        const schema = await Joi.object({
            id: Joi.string().required(),
            deswapstackname: Joi.string().required(),
            Amount: Joi.number().required(),
            LockedPeriod: Joi.number().required(),
            LockedPeriodType: Joi.string().required(),
            Bonous: Joi.number().required(),
            status: Joi.string().required()
          });
      
          const validresult = await schema.validate(req.body, options);
      
          if (validresult.error) {
            res.status(400).json({
              data: null,
              error: "Invalid authentication" + validresult.error.message,
            });
            return;
          }

        const packdetails_ = await packdetails.findOne({
            _id: req.body.id
        });
        if (!packdetails_) {
            res.status(400).json({ data: null, error: "Pack is in use" });
            return;
        } else {
            //update packdetails
            const packdetails_ = await packdetails.findOneAndUpdate({
                _id: req.body.id
            }, {
                $set: {
                    PackName: req.body.deswapstackname,
                    Amount: req.body.Amount,
                    LockedPeriod: req.body.LockedPeriod,
                    LockedPeriodType: req.body.LockedPeriodType,
                    Bonous: req.body.Bonous,
                    status: req.body.status
                }
            }, {
                new: true
            });
            res.setHeader('response-security', true);
            res.status(200).json({ data: await responseBodyEncryptionAdmin({ data: packdetails_, error: null, total: packdetails_.length }), type: "adminauth" });
        }


    } catch (e) {
        res.status(400).json({ data: null, error: "Failed to update" });
    }
}

export default adminmiddleware(handler);