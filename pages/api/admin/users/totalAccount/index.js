import getMongoDBConnection from "../../../../../utils/connection/mongodbconnection";
import User from "../../../../../models/Users";
import  AdminmddleWare from "../../../../../middleware/adminmiddleware"
import Joi from "joi";
import { responseBodyEncryptionAdmin } from "../../../../../utils/common/jwtToken"


const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: false,
  convert: true,
};


const handler = async (req, res) => {
    try{
        if (req.method !== 'POST') {
            res.status(400).json({ data: null,error:"Invalid Method" });
            return;
        }

        let userValidator = await Joi.object({
            startDate: Joi.date().optional(),
            lastDate: Joi.date().optional()
          });
      
          const { error, value } = userValidator.validate(req.body, options);
      
          if (error) {
            res.status(400).json({ data: null, error: "Failed to validation" });
            return;
          }

        await getMongoDBConnection();
        //let result = await User.find({createdAt:{$gte:req.body.startDate,$lte:req.body.lastDate}}).sort({'createdAt':1}).select("createdAt");
          let result= await User.aggregate(
            [
                {
                    $match: {
                        createdAt: {$gte: new Date(req.body.startDate), $lte: new Date(req.body.lastDate)}
                    }   
                },
                {
                    $group:
                    {
                        _id: {
                            $dateToString: {
                                "date": "$createdAt",
                                "format": "%Y-%m-%d"
                            }
                        }, 
                        count: { $sum:1 }
                    }
                },{ $sort: { _id: 1 } }])

        res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryptionAdmin({ data: result,error:null}), type: "adminauth" });
        
    }catch(e){
        console.log(e);
        res.status(400).json({ data: null,error:"Failed to Fetch"});
    }
}

export default AdminmddleWare(handler);