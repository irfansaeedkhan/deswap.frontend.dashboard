import Networkclaimmed from "../../../../models/claimmedrewards/networkclaimmed";
import PackClaimmed from "../../../../models/claimmedrewards/packclaimmed";
import UserTransaction from "../../../../models/transaction/usertransaction";
import PurchasedPack from "../../../../models/deswapPack/purchasedpack";
import { responseBodyEncryptionAdmin } from "../../../../utils/common/jwtToken";
import getMongoDBConnection from "../../../../utils/connection/mongodbconnection";
import adminmiddleware from "../../../../middleware/adminmiddleware";


const handler = async(req, res) => {
    try {
        if (req.method !== "GET") {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }
        //return no of packs where status is requested
        await getMongoDBConnection();
        //pack where status is requested
        const RequestedPacks = await PackClaimmed.find({ Status: "Requested" }).countDocuments();
        //network rewards where status is requested
        const RequestedNetworkRewards = await Networkclaimmed.find({ Status: "Requested" }).countDocuments();
        //user transaction where status is requested
        const RequestedUserTransactions = await UserTransaction.find({ Status: "Requested" }).countDocuments();
        //purchased pack where status is requested
        const RequestedPurchasedPacks = await PurchasedPack.find({ Status: "Requested" }).countDocuments();
        //total number of requested packs
        const TotalRequestedPacks = RequestedPacks + RequestedNetworkRewards + RequestedUserTransactions + RequestedPurchasedPacks;

        res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryptionAdmin({ data: { RequestedPacks, RequestedNetworkRewards, RequestedUserTransactions, RequestedPurchasedPacks, TotalRequestedPacks }, error: null }), type: "adminauth" });
    } catch (e) {
        console.log(e);
        res.status(400).json({ data: null, error: "Failed to fetch"});
    }
}

export default adminmiddleware(handler);