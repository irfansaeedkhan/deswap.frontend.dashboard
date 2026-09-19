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
            id: Joi.string().required()
          });
      
          const validresult = await schema.validate(req.body, options);
      
          if (validresult.error) {
            res.status(400).json({
              data: null,
              error: "Invalid authentication",
            });
            return;
          }

        let result = await packdetails.findByIdAndUpdate({_id:req.body.id},{Status:"Deactive"})

        res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryptionAdmin({ data: "Successfull", error: null}), type: "adminauth" });

    } catch (e) {
        console.log(e);
        res.status(400).json({ data: null, error: " failed to insert" });
    }
}

//Need to add middleware
export default adminmiddleware(handler);
