import Connection from "../../../../../db/db";
import packdetails from "../../../../../models/deswapPack/packdetails";
import adminmiddleware from "../../../../../middleware/adminmiddleware";
import { responseBodyEncryptionAdmin } from "../../../../../utils/common/jwtToken"
import Joi from "joi";


const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: false,
  convert: true,
};

const handler = async(req, res) => {
    try {
        //
        if (req.method !== 'POST') {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }

        await Connection();
        

        const schema = await Joi.object({
          PackName: Joi.string().required(),
          Amount: Joi.number().required(),
          LockedPeriod: Joi.number().required(),
          LockedPeriodType: Joi.string().required(),
          Bonous: Joi.number().required(),
        });
    
        const validresult = await schema.validate(req.body, options);
    
        if (validresult.error) {
          res.status(400).json({
            data: null,
            error: "Invalid authentication" + validresult.error.message,
          });
          return;
        }


        if (req.body.skip == undefined || req.body.skip == null || req.body.skip == 0) {
            req.body.skip = 0;
        }

        if (req.body.limit == undefined || req.body.limit == null || req.body.limit == 0) {
            req.body.limit = 10;
        }

        let result = await packdetails.insertMany([{
            PackName: req.body.PackName,
            Amount: req.body.Amount,
            LockedPeriod: req.body.LockedPeriod,
            LockedPeriodType: req.body.LockedPeriodType,
            Bonous: req.body.Bonous,
        }]);

        res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryptionAdmin({ data: result, error: null, total: result.length }), type: "adminauth" });

    } catch (e) {
        console.log(e);
        res.status(400).json({ data: null, error: " failed to insert" });
    }
}

export default adminmiddleware(handler);