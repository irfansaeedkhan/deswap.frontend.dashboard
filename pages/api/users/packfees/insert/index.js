import Connection from "../../../../../db/db";
import userModel from "../../../../../models/Users";
import purchasingFessModal from "../../../../../models/deswapPack/purchasingFees";
import usermiddleware from "../../../../../middleware/usermiddleware";
import { checkTransaction } from "../../../../../utils/common/transactionChecking";
import { responseBodyEncryption } from "../../../../../utils/common/jwtToken"
/**
 * @api {post} /api/users/packfees/insert/ Insert Purchasing Fees 
 * @apiName InsertPurchasingFees
 * @apiGroup User/Pack
 * @apiVersion 1.0.0
 * @apiDescription Insert Purchasing Fees
 * @apiBody packageid
 * @apiBody amount
 * @apiBody fees
 * @apiBody txhash
 * @apiBody conversionrate
 * @apiExample {axios} Example usage:
 * axios.post('/api/users/packfees/insert/', {
 * "packageid" = "data",
 * "amount" = 0,
 * "fees" = 0,
 * "txhash" = "data",
 * "conversionrate" = 0
 * })
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Object} data User data.
 * 
 */
const handler = async(req, res) => {
    try {
        //
        if (req.method !== 'POST') {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }

        await Connection();

        let findUserInfo = await userModel.findOne({ _id: req.body.uuid });

        if (!findUserInfo) {
            res.status(400).json({ data: null, error: "Invalid user" });
            return;
        }

        if(findUserInfo.status!="Active"){
            res.status(400).json({ data: null, error: "Invalid user" });
            return;
        }
        //Checking valid transaction
        let validTransaction = await checkTransaction(findUserInfo.walletaddress[findUserInfo.walletaddress.length - 1], req.body.txhash)

        if (!validTransaction.status) {
            res.status(400).json({ data: null, error: "Invalid user" });
            return;
        }

        if(validTransaction.transactiontimeissue){
            transactionValid = false
            transactionissue += " Transaction time : "+validTransaction.transactiontimeissuedescription
        }

        let result = await purchasingFessModal.insertMany([{
            UserID: req.body.uuid,
            PackID: req.body.packageid,
            FeesUSD: req.body.amount,
            Fees: req.body.fees,
            Currency: "Matic",
            TxHash: req.body.txhash,
            ConversionRate: req.body.conversionrate
        }])

        res.setHeader('response-security', true)
        res.status(200).json({ data: await responseBodyEncryption({ data: result[result.length - 1], error: null }), type: "userauth" });

    } catch (e) {
        console.log(e);
        res.status(400).json({ data: null, error: "Failed to fetch" });
    }
}

//Need to add middleware
export default usermiddleware(handler);
//export default handler;