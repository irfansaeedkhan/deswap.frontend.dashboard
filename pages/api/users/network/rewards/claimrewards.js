import usermiddleware from "../../../../../middleware/usermiddleware"
import Users from "../../../../../models/Users";
import packDetails from "../../../../../models/deswapPack/packdetails"
import purchasedpack from "../../../../../models/deswapPack/purchasedpack";
import networkRewards from "../../../../../models/network/networkRewards";
import getMongoDBConnection from "../../../../../utils/connection/mongodbconnection";
import { sendTransactionMatic } from "../../../../../utils/wallet/sendTransactionMatic";
import claimmedRewards from "../../../../../models/claimmedrewards/networkclaimmed";
import { responseBodyEncryption } from "../../../../../utils/common/jwtToken"
import axios from "axios";
import ejs from "ejs";
import { resolve } from "path";
import { sendEmail } from "../../../../../utils/common/email";

/**
 * @api {post} /api/user/network/rewards/claimrewards Claim Rewards
 * @apiName ClaimRewards
 * @apiPermission User
 * @apiGroup User/Network
 * @apiVersion 1.0.0
 * @apiDescription Claim Rewards
 * @apiBody {string} id  Pack id to claim rewards
 * @apiExample {axios} Example usage:
 * axios.post('/api/user/network/rewards/claimrewards'{
 *  "id": "a8a8s8ad8a8dcvsvdsdvsdv8sd"
 * })
 * @apiSuccessExample {json} Success-Response:
 * {
 * "data": "encrypted data",
 * "error": null,
 * "type": "userauth"
 * }
 * @apiErrorExample {json} Error-Response:
 * {
 * "data": null,
 * "error": "error message",
 * }
 * 
 */

const userclaimmednetworkrewards = async (data) => {
    try {
      let pathTotemplate = await resolve("templates/email/admin/networkrewardsclaimmed.ejs");
      
      //
      let htmltempate = await ejs.renderFile(pathTotemplate, {
        rewardsfrom:data.rewardsfrom,
        emailid:data.emailid,
        publickey:data.publickey,
        amount:data.amount,
        purpose:data.purpose
      });
  
      let result = await sendEmail({
        toAddress: process.env.NEXT_PUBLIC_SMTP_ADMIN_MAIL,
        subject: "User claimmed network rewards "+data.emailid,
        bodyText: "User claimmed network rewards "+data.publickey,
        bodyHTML: htmltempate
      });
    } catch (e) {
      //
      console.log("Failed to send verification mail ", e);
    }
}


const handler = async(req, res) => {
    try {
        //
        await getMongoDBConnection();

        let userNetworkRewards = await networkRewards.findOne({
            UserTo: req.body.uuid,
            Status: "Active",
            _id: req.body.id
        }).populate("PurchasedPack UserFrom UserTo")

        if (!userNetworkRewards) {
            res.status(400).json({ data: null, error: "No rewards" });
            return;
        }

        await networkRewards.findOneAndUpdate({ _id: req.body.id }, { $set: { Status: "Requested" } })

        let usdAmountNeedToBeSent = userNetworkRewards.RewardsPercentage * userNetworkRewards.Amount;

        let result = await axios.get(`${process.env.NEXT_PUBLIC_COINMARKET_CAP_BASE}/data-api/v3/tools/price-conversion?amount=${usdAmountNeedToBeSent}&id=2781&convert_id=3890`).catch(async(error) => {
            await networkRewards.findOneAndUpdate({ _id: req.body.id, Status: "Active" }, { $set: { transactionVerified: true } })
        })

        if (!result) {
            res.status(400).json({ data: null, error: "Failed to convert usd to matic" });
            return;
        }

        if (!result.data.data) {
            res.status(400).json({ data: null, error: "Failed to convert usd to matic" });
            return;
        }

        let conversionData = result.data.data;
        let quotedData = conversionData.quote;

        let amountInMatic = 0;
        for (let index in quotedData) {
            //
            if (quotedData[index].cryptoId == 3890) {
                amountInMatic = quotedData[index].price;
            }
        }

        let claimmedResult = await claimmedRewards.insertMany([{
            UserID: req.body.uuid,
            PackID: userNetworkRewards.PurchasedPack._id,
            NetworkRewardsID: req.body.id,
            TxHash: "",
            PublicAddress: userNetworkRewards.UserTo.walletaddress[userNetworkRewards.UserTo.walletaddress.length-1],
            Amount: amountInMatic,
            AmountInUSD: usdAmountNeedToBeSent,
            Currency: "Matic",
            Status:"Requested"
        }]);
        
        /*
        let transaction = await sendTransactionMatic({
            toaddress: userNetworkRewards.UserTo.walletaddress[userNetworkRewards.UserTo.walletaddress.length - 1],
            amount: amountInMatic,
            purpose: "Network rewards",
            emailid: userNetworkRewards.UserTo.emailid,
            data: req.body
        })

        if (!transaction) {
            await networkRewards.findOneAndUpdate({ _id: req.body.id, Status: "Inprogress" }, { $set: { Status: "Active" } })
            res.status(400).json({ data: null, error: "Failed to register" });
            return;
        }

        let claimmedResult = await claimmedRewards.insertMany([{
            UserID: req.body.uuid,
            PackID: userNetworkRewards.PurchasedPack._id,
            NetworkRewardsID: req.body.id,
            TxHash: transaction.transactionHash,
            PublicAddress: transaction.to,
            Amount: amountInMatic,
            AmountInUSD: usdAmountNeedToBeSent,
            Currency: "Matic",
        }]);
        let updatedNetworkRewards = await networkRewards.updateOne({ _id: req.body.id, Status: "Inprogress" }, { $set: { Status: "Claimmed", ClaimmedNetworkID: claimmedResult[0]._id } })
        */

        res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryption({ data: "Success", error: null }), type: "userauth" });
        
        await userclaimmednetworkrewards({
            rewardsfrom:userNetworkRewards.UserFrom.emailid,
            emailid:userNetworkRewards.UserTo.emailid,
            publickey:userNetworkRewards.UserTo.walletaddress[userNetworkRewards.UserTo.walletaddress.length-1],
            amount:usdAmountNeedToBeSent,
            purpose:"User claimmed network rewards"
        }).catch((error)=>{
            console.log("Failed to send email ",error)
        })

        //networkrewardsclaimmed
    } catch (e) {
        console.log("Error while clamming ",e);
        await networkRewards.findOneAndUpdate({ _id: req.body.id, Status: "Requested" }, { $set: { Status: "Active" } })
        res.status(400).json({ data: null, error: "Failed to claimed rewards" });
    }
}

//export default handler;
export default usermiddleware(handler);