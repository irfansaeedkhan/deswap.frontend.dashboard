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
 * @api {post} /api/user/network/rewards/claimallrewards Claim All Rewards
 * @apiName ClaimAllRewards
 * @apiPermission User
 * @apiGroup User/Network
 * @apiVersion 1.0.0
 * @apiDescription Claim All Rewards
 * @apiExample {axios} Example usage:
 * axios.post('/api/user/network/rewards/claimallrewards')
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
 */
const userclaimmednetworkrewards = async (data) => {
    try {
      let pathTotemplate = await resolve("templates/email/admin/networkrewardsclaimmed.ejs");
      
      //
      let htmltempate = await ejs.renderFile(pathTotemplate, {
        rewardsfrom:data.rewardsfrom,
        emailid:data.emailid,
        publickey:data.publickey,
        amount:data.publickey,
        purpose:data.purpose
      });
  
      let result = await sendEmail({
        toAddress: process.env.NEXT_PUBLIC_SMTP_ADMIN_MAIL,
        subject: "User claimmed multiple network rewards "+data.emailid,
        bodyText: "User claimmed multiple network rewards "+data.publickey,
        bodyHTML: htmltempate
      });
    } catch (e) {
      //
      console.log("Failed to send verification mail ", e);
    }
}

const handler = async(req, res) => {
    //
    let numberOfNetworkRewards = [];
    let purchasedPackID = [];
    let rewardsfrom = "";
    try {

        await getMongoDBConnection();

        let userNetworkRewards = await networkRewards.find({
            UserTo: req.body.uuid,
            Status: "Active",
        }).populate("PurchasedPack UserFrom UserTo")

        if (userNetworkRewards.length < 1) {
            res.status(400).json({ data: null, error: "No rewards" });
            return;
        }

        let totalRewardsInUSD = 0;

        let userWalletAddress = "";
        let emailaddress = "";
        for (let index in userNetworkRewards) {
            //console.log(userNetworkRewards[index])
            //console.log(userNetworkRewards[index].RewardsPercentage, userNetworkRewards[index].Amount,userNetworkRewards[index].RewardsPercentage*userNetworkRewards[index].Amount)
            emailaddress = userNetworkRewards[index].UserTo.emailid;
            totalRewardsInUSD += userNetworkRewards[index].RewardsPercentage * userNetworkRewards[index].Amount
            numberOfNetworkRewards.push(userNetworkRewards[index]._id)
            purchasedPackID.push(userNetworkRewards[index].PurchasedPack._id)
            userWalletAddress = userNetworkRewards[index].UserTo.walletaddress[userNetworkRewards[index].UserTo.walletaddress.length - 1]
            rewardsfrom = rewardsfrom+userNetworkRewards[index].UserFrom.emailid+","
        }

        await networkRewards.updateMany({ _id: { $in: numberOfNetworkRewards } }, { $set: { Status: "Requested" } })
            //.findOneAndUpdate({_id:req.body.id},{$set:{Status:"Inprogress"}})

        //let usdAmountNeedToBeSent = userNetworkRewards.RewardsPercentage*userNetworkRewards.Amount;

        let result = await axios.get(`${process.env.NEXT_PUBLIC_COINMARKET_CAP_BASE}/data-api/v3/tools/price-conversion?amount=${totalRewardsInUSD}&id=2781&convert_id=3890`).catch(async(error) => {
            //Update
            await networkRewards.updateMany({ _id: { $in: numberOfNetworkRewards }, Status: "Requested" }, { $set: { Status: "Active" } })
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
            //console.log()
            if (quotedData[index].cryptoId == 3890) {
                amountInMatic = quotedData[index].price;
            }
        }


        /*
        let transaction = await sendTransactionMatic({
            toaddress: userWalletAddress,
            amount: amountInMatic,
            purpose: "Network rewards all",
            emailid: emailaddress,
            data: req.body
        })*/

        //Update Network Code Here
        /*
        if (!transaction) {
            await networkRewards.updateMany({ _id: { $in: numberOfNetworkRewards }, Status: "Inprogress" }, { $set: { Status: "Active" } })
                //await networkRewards.findOneAndUpdate({_id:req.body.id,Status:"Inprogress"},{$set:{Status:"Active"}})
            res.status(400).json({ data: null, error: "Failed to register" });
            return;
        }
        */

        // console.log("Returning ",amountInMatic)
        // res.status(400).json({ data: null,error:"No rewards"});
        // return; 
        let insertClaimmedRewards = [];

        for (let index in numberOfNetworkRewards) {
            insertClaimmedRewards.push({
                UserID: req.body.uuid,
                PackID: purchasedPackID[index],
                NetworkRewardsID: numberOfNetworkRewards[index],
                TxHash: "",
                PublicAddress: userWalletAddress,
                Amount: amountInMatic,
                AmountInUSD: totalRewardsInUSD,
                Currency: "Matic",
                Status:"Requested"
            })
        }
        let claimmedResult = await claimmedRewards.insertMany(insertClaimmedRewards);

        /*
        for (let index in claimmedResult) {
            //console.log("Updating... ",claimmedResult[index])
            await networkRewards.updateOne({ _id: claimmedResult[index].NetworkRewardsID, Status: "Inprogress" }, { $set: { Status: "Claimmed", ClaimmedNetworkID: claimmedResult[index]._id } })
        }*/
        //let updatedNetworkRewards = 
        res.setHeader('response-security', true);
        res.status(200).json({ data: responseBodyEncryption({ data: "Success", error: null }), type: "userauth" });
        
        await userclaimmednetworkrewards({
            rewardsfrom:rewardsfrom,
            emailid:emailaddress,
            publickey:userWalletAddress,
            amount:totalRewardsInUSD,
            purpose:"User claimmed network rewards"
        }).catch((error)=>{
            console.log("Failed to send email ",error)
        })

    } catch (e) {
        console.log(e);
        await networkRewards.updateMany({ _id: { $in: numberOfNetworkRewards }, Status: "Requested" }, { $set: { Status: "Active" } });
        res.status(400).json({ data: null, error: "Failed to claimed rewards" });
    }
}

//export default handler;
export default usermiddleware(handler);