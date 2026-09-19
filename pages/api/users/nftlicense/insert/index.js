import Connection from "../../../../../db/db";
import userModel from "../../../../../models/Users";
import userNFTLicenseFees from "../../../../../models/nftlicense/fees/usernftlicensefees";
import NFTlicense from "../../../../../models/nftlicense/licensedetails";
import userNFTLicense from "../../../../../models/nftlicense/purchase/userpurchased";
import usermiddleware from "../../../../../middleware/usermiddleware";
import { checkTransaction } from "../../../../../utils/common/transactionChecking";
import { responseBodyEncryption } from "../../../../../utils/common/jwtToken"
import { dollarToMatic } from "../../../../../utils/common/tokenconversion";
import { checkAmount } from "../../../../../utils/common/checkamount"
import ejs from "ejs";
import { resolve } from "path";
import { sendEmail } from "../../../../../utils/common/email";

//write documentation of inset api
/**
 * @api {post} /api/users/nftlicense/insert/ Insert NFT license
 * @apiName InsertNFTlicense
 * @apiGroup User/NFTLicense
 * @apiVersion 1.0.0
 * @apiDescription Insert NFT license
 * @apiBody UserID 
 * @apiBody NftLicense  
 * @apiBody Quantity  
 * @apiBody TxHash  
 * @apiBody Amount  
 * @apiBody totalamount 
 * @apiBody ConversionRate  
 * @apiBody TotalAmountInMatic  
 * @apiBody packageid
 * @apiExample {axios} Example usage:
 * axios.post('/api/users/nftlicense/insert/', {
 *  UserID: "0x0",
 *  NftLicense: "0x0",
 *  Quantity: "0",
 *  TxHash: "0x0",
 *  Amount: "0",
 *  totalamount: "0",
 *  ConversionRate: "0",
 *  TotalAmountInMatic: "0",
 *  packageid: "0"
 * })
 * @apiSuccess {String} message Success message.
 * @apiSuccess {String} data User data.
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "message": "NFT license inserted successfully",
 *   "data": "Encrypted data"
 * }
 * 
 * 
 * 
 * 
 * 
 */

const userpurchasedNftlicense = async (data) => {
    try {
        let pathTotemplate = await resolve("templates/email/admin/nftlicensepurchased.ejs");

        //
        let htmltempate = await ejs.renderFile(pathTotemplate, {
            name: data.name,
            price: data.price,
            incommingtxhash: data.incommingtxhash,
            amountInmatic: data.amountInmatic,
            correctAmountInmatic: data.correctAmountInmatic,
            issueWithTransaction: data.issueWithTransaction,
            transactionvalid: data.transactionvalid,
            emailid: data.emailid,
            publickey: data.publickey,
            purpose: "Purchase nftlicense"
        });

        let result = await sendEmail({
            toAddress: process.env.NEXT_PUBLIC_SMTP_ADMIN_MAIL,
            subject: "User purchased nft license " + data.emailid,
            bodyText: "User purchased nft license " + data.publickey,
            bodyHTML: htmltempate
        });
    } catch (e) {
        //
        console.log("Failed to send verification mail ", e);
    }
}


const handler = async (req, res) => {
    try {
        //
        if (req.method !== 'POST') {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }

        await Connection();

        let nftlicensedetails = await NFTlicense.findOne({
            _id: req.body.packageid,
            status: "Active"
        })

        if (!nftlicensedetails) {
            res.status(400).json({ data: null, error: "Invalid license" });
            return
        }


        let licensePriceUSD = await dollarToMatic(nftlicensedetails.Price);

        if (!licensePriceUSD.valid) {
            res.status(400).json({ data: null, error: "Invalid Price" });
            return
        }



        let findUserInfo = await userModel.findOne({ _id: req.body.uuid });

        if (!findUserInfo) {
            res.status(400).json({ data: null, error: "Invalid user" });
            return;
        }

        let transactonIsValid = false;
        let transactionInValidReason = "";
        let correctAmountOnServer = 0;

        let validTransaction = await checkTransaction(findUserInfo.walletaddress[findUserInfo.walletaddress.length - 1], req.body.txhash, licensePriceUSD.data, true, { purpose: "Deswap License purchase", emailid: findUserInfo.emailid })

        if (!validTransaction.status) {
            transactonIsValid = false;
            transactionInValidReason = transactionInValidReason + " Their is issue with transaction please check public key , private key and amount calculated : " + validTransaction.blockchainamount
        }


        let DeswapCheck = await checkAmount(validTransaction.blockchainamount, licensePriceUSD.data)

        if (DeswapCheck.valid) {
            transactonIsValid = true
        } else {
            transactonIsValid = false
            correctAmountOnServer = licensePriceUSD.data
            transactionInValidReason = transactionInValidReason + DeswapCheck.reason + " Amount calculated :  " + String(licensePriceUSD.data) + " Amount from blockchain : " + String(validTransaction.blockchainamount) + " Change in percetage " + DeswapCheck.changeInPercentage;
        }

        let result = await userNFTLicense.insertMany([{
            UserID: req.body.uuid,
            NftLicense: req.body.packageid,
            Quantity: req.body.quantity,
            TxHash: req.body.txhash,
            Amount: req.body.amount,
            TotalAmount: req.body.totalamount,
            ConversionRate: req.body.conversionrate,
            TotalAmountInMatic: req.body.amountinmatic,
            CorrectTotalMatic: licensePriceUSD.data,
            IssuewithTransaction: transactionInValidReason,
            TransactionValid: transactonIsValid,
            Status: "Requested"
        }])

        let returnObj = result[result.length - 1];
        /*
        let updateValue = await userNFTLicenseFees.updateOne({ _id: req.body.purchasingfeesid },
            {
              $set: {
                PurchaseID: returnObj._id,
              },
        })*/
        res.setHeader('response-security', true)
        res.status(200).json({ data: await responseBodyEncryption({ data: returnObj, error: null }), type: "userauth" });

        await userpurchasedNftlicense({
            name: nftlicensedetails.Name,
            price: nftlicensedetails.Price,
            incommingtxhash: req.body.txhash,
            amountInmatic: req.body.totalamount,
            correctAmountInmatic: licensePriceUSD.data,
            issueWithTransaction: transactionInValidReason,
            transactionvalid: transactonIsValid,
            emailid: findUserInfo.emailid,
            publickey: findUserInfo.walletaddress[findUserInfo.walletaddress.length - 1]
        }).catch((error) => {
            console.log("Failed to send email ", error)
        })
    } catch (e) {
        console.log(e);
        res.status(400).json({ data: null, error: "Failed to fetch" });
    }
}

//Need to add middleware
export default usermiddleware(handler);
//export default handler;