import getMongoDBConnection from "../../../../utils/connection/mongodbconnection";
import adminmiddleware from "../../../../middleware/adminmiddleware";
import Users from "../../../../models/Users";
import { responseBodyEncryptionAdmin } from "../../../../utils/common/jwtToken"
import MarketLicense from "../../../../models/marketplace/licence";
import Joi from "joi"
import ejs from "ejs";
import { resolve } from "path";
import { sendEmail } from "../../../../utils/common/email";

/**
 * @api {post} /api/admin/marketplace/approve/ Approve Marketplace License
 * @apiName Approve Marketplace License
 * @apiGroup Admin/Marketplace
 * @apiVersion 1.0.0
 * @apiDescription Approve Marketplace License
 * @apiBody {String} id Marketplace License ID
 * @apiExample {axios} Example usage:
 * axios.post('/api/admin/marketplace/approve/',{
 *  id:"5e8f8f8f8f8f8f8f8f8f8f8f"
 * });
 * @apiSuccess {String} data Data of the marketplace license
 */

const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: false,
    convert: true,
};

const UserEmail = async (email) => {
    try {
        let pathTotemplate = await resolve("templates/email/admin/approvelicense.ejs");

        //
        let htmltempate = await ejs.renderFile(pathTotemplate, {
            email,
            url:`${process.env.DOMAIN_NAME}/market/userprofile`
        });

        let result = await sendEmail({
            toAddress: email,
            subject: "License Approved",
            bodyText: "",
            bodyHTML: htmltempate
        });
    } catch (e) {
        //
        console.log("Failed to send verification mail ", e);
    }
}

const handler = async(req, res) => {
    try{
        if(req.method !== 'POST'){
            res.status(400).json({data: null, error: "Invalid Method"});
            return;
        }

        let marketplaceLicenseValidator = await Joi.object({
            id : Joi.string().trim().required(),
            status:Joi.string().trim().required()
        });
        const { error, value } = marketplaceLicenseValidator.validate(req.body, options);
        if(error){
            console.log(error);
            res.status(400).json({data: null, error: "Failed to create marketplace license"});
            return;
        }

        await getMongoDBConnection();
        
        //activate license
        let marketplaceLicense = await MarketLicense.findOneAndUpdate({
            _id: req.body.id,
        }, {
            $set: {
                status: req.body.status,
                acceptedAt:new Date()
            }
        }, {
            new: true,
        }).populate('UserID','emailid').exec();

        console.log("marketplaceLicense",marketplaceLicense.UserID.emailid)

        if(req.body.status=="Accept"){
            await UserEmail(marketplaceLicense.UserID.emailid)
        }

        res.setHeader('response-security', true);
        res.status(200).json({data: responseBodyEncryptionAdmin({data:"success" , error: null}),type:"adminauth"});
    }
    catch(error){
        console.log(error)
        res.status(400).json({data: null, error: "Failed to approve"});
    }
}

export default adminmiddleware(handler);