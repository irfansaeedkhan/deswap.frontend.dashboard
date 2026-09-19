import getMongoDBConnection from "../../../../utils/connection/mongodbconnection";
import PackClaimmed from "../../../../models/claimmedrewards/packclaimmed";
import  AdminmddleWare from "../../../../middleware/adminmiddleware"
import Joi from "joi";
import { responseBodyEncryptionAdmin } from "../../../../utils/common/jwtToken"


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

        let packClaimmedValidator = await Joi.object({
            startDate: Joi.date().optional(),
            lastDate: Joi.date().optional()
          });
      
          const { error, value } = packClaimmedValidator.validate(req.body, options);
      
          if (error) {
            res.status(400).json({ data: null, error: "Failed to validation" });
            return;
          }

        await getMongoDBConnection();
          let result= await PackClaimmed.aggregate(
            [
                {
                    $match: {
                        Status:{$ne:"Deactive"},
                        created_at: {$gte: new Date(req.body.startDate), $lte: new Date(req.body.lastDate)}
                    }   
                },
                {
                    $group:
                    {
                        _id: {
                            $dateToString: {
                                "date": "$created_at",
                                "format": "%Y-%m-%d"
                            }
                        }, 
                        totalQty: { $sum: '$AmountInUSD' }
                    }
                },{ $sort: { _id: 1 } }])

         res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryptionAdmin({data: result,error:null}), type: "adminauth" });
        
    }catch(e){
        console.log(e);
        res.status(400).json({ data: null,error:"Failed to Fetch"});
    }
}

export default AdminmddleWare(handler);