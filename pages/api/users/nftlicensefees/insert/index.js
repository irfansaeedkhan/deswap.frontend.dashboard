import Connection from "../../../../../db/db";
import userModel from "../../../../../models/Users";
import nftlicensefeesModal from "../../../../../models/nftlicense/fees/usernftlicensefees";
import usermiddleware from "../../../../../middleware/usermiddleware";
import { checkTransaction } from "../../../../../utils/common/transactionChecking";
import { responseBodyEncryption } from "../../../../../utils/common/jwtToken"
/**
 * @api {post} /api/users/nftlicensefees/insert/ Insert NFT license
 * @apiName InsertNFTlicense
 * @apiGroup User/NFTLicense
 * @apiVersion 1.0.0
 * @apiDescription Insert NFT license fees
 * @apiBody packageid
 * @apiBody amount
 * @apiBody fees
 * @apiBody txhash
 * @apiBody conversionrate
 * @apiExample {axios} Example usage:
 * axios.post('/api/users/nftlicensefee/insert/', {
 *  "packageid" = "data",
 *  "amount" = 0,
 *  "fees" = 0,
 *  "txhash" = "data",
 *  "conversionrate" = 0
 * })
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Object} data User data.
 * 
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

        //Checking valid transaction
        let validTransaction = await checkTransaction(findUserInfo.walletaddress[findUserInfo.walletaddress.length - 1], req.body.txhash)

        if (!validTransaction.status) {
            res.status(400).json({ data: null, error: "Invalid user" });
            return;
        }

        let result = await nftlicensefeesModal.insertMany([{
            UserID: req.body.uuid,
            PurchasedNFTLicense: req.body.packageid,
            AmountInUSD: req.body.amount,
            Amount: req.body.fees,
            Currency: "Matic",
            TxHash: req.body.txhash,
            ConversionRate: req.body.conversionrate
        }])

        res.setHeader('response-security', true)
        res.status(200).json({ data: await responseBodyEncryption({ data: result[result.length - 1], error: null }), type: "userauth" });

    } catch (e) {
        res.status(400).json({ data: null, error: "Failed to fetch" });
    }
}

//Need to add middleware
export default usermiddleware(handler);
//export default handler;