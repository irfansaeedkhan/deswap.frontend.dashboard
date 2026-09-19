import usermiddleware from "../../../../../middleware/usermiddleware"
import { fetchUserUpline } from "../../../../../utils/network/upline/index"
import networkRewardsSetting from "../../../../../models/networkRewardsSetting/networkRewardsSetting"
import networkRewards from "../../../../../models/network/networkRewards";
import {responseBodyEncryption} from "../../../../../utils/common/jwtToken";
import getMongoDBConnection from "../../../../../utils/connection/mongodbconnection";
import packdetailsModel from "../../../../../models/deswapPack/packdetails";
import purchasedPackModel from "../../../../../models/deswapPack/purchasedpack";
import Joi from "joi";

/**
 * @api {post} /api/users/network/rewards/packpurchaserewards PackPurchaseRewards
 * @apiName PackPurchaseRewards
 * @apiGroup Users/Network
 * @apiDescription PackPurchaseRewards
 * @apiBody {String} purchasedpackid PurchasedPackID
 * @apiBody {Number} amount Amount
 * @apiBody {Number} totalamount TotalAmount
 * @apiExample {axios} Example usage:
 * axios.post('/api/users/network/rewards/packpurchaserewards', {
 *  "purchasedpackid": "asdasdas",
 * "amount": "100",
 * "totalamount": "100"
 * })
 * @apiSuccessExample {json} Success-Response:
 * {
 * "data": "encrypted data",
 * "type": "userauth"
 * }
 * @apiErrorExample {json} Error-Response:
 * {
 * "data": null,
 * "error": "Failed to request"
 * } 
 */

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: false,
  convert: true,
};

const handler = async(req, res) => {
    try {
        
        
        let insertnetworkrewardsValidator = await Joi.object({
            purchasedpackid: Joi.string().required(),
            amount: Joi.number().required(),
            totalamount:Joi.number().required(),
        });

        console.log("Request : ",req.body)

        const { error, value } = insertnetworkrewardsValidator.validate(req.body, options);
        
        if (error) {
            console.log(error)
            res.status(400).json({ data: null, error: "Failed to packpurchase" });
            return;
        }

        await getMongoDBConnection()

        let userPurchasedPack = await purchasedPackModel.findOne({
            _id:req.body.purchasedpackid
        }).populate("PackID UserID");

        
        if(userPurchasedPack.Status=="Claimmed"||userPurchasedPack.Status=="Deactive"){
            res.status(400).json({ data: null, error: "InValid data" });
            return
        }

        if(userPurchasedPack.UserID._id!=req.body.uuid){
            res.status(400).json({ data: null, error: "InValid data" });
            return
        }
        
        if(userPurchasedPack.UserID.status!="Active"){
            res.status(400).json({ data: null, error: "Invalid users" });
            return
        }
        
        let upline = await fetchUserUpline(req.body.uuid)

        let fetchLevel = await networkRewardsSetting.find({
                Status: "Active"
            }, {}, {
                sort: {
                    "Level": "asc"
                }
            })
        if (upline.length < 1) {
            return res.status(200).json({data:await responseBodyEncryption({ data: null, error: "Failed to fetch upline" }), type: "userauth"});
        }


        let insertIntoDB = []
        for (let level in upline) {
            if (upline[level] != null) {
                //
                let insertedNetworkRewards = await networkRewards.findOne({
                    PurchasedPack: req.body.purchasedpackid,
                    UserTo: upline[level].id,
                    Level: Number(level) + 1,
                });
                if(!insertedNetworkRewards){
                    insertIntoDB.push({
                        UserTo: upline[level].id,
                        UserFrom: req.body.uuid,
                        Level: Number(level) + 1,
                        RewardsPercentage: Number(fetchLevel[level].Percentage),
                        PurchasedPack: req.body.purchasedpackid,
                        Amount: Number(userPurchasedPack.TotalAmount),
                        Currency: "Deswap"
                    })
                }
            }
        }
        let result = await networkRewards.insertMany(insertIntoDB);

        //TO DO : Email
        res.setHeader('response-security', true);
        res.status(200).json({data: await responseBodyEncryption({ data: result, error: null }), type: "userauth" });
        return;
    } catch (e) {
        console.log(e);
        res.status(200).json({data: await responseBodyEncryption({ data: null, error: "Failed to fetch upline" }), type: "userauth"});
    }
}

//export default handler;
export default usermiddleware(handler);