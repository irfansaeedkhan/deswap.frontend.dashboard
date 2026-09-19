import getMongoDBConnection from "../../../../../utils/connection/mongodbconnection";
import Users from "../../../../../models/Users";
import NetworkRewards from "../../../../../models/network/networkRewards";
import networkClaimed from "../../../../../models/claimmedrewards/networkclaimmed";
import ClaimmedPack from "../../../../../models/claimmedrewards/packclaimmed";
import adminmiddleware from "middleware/adminmiddleware";

const handler = async(req, res) => {
    try {
        if (req.method !== "GET") {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }

        await getMongoDBConnection();
        //no of network claims
        const networkClaims = await networkClaimed.find({
            UserID: req.body.uuid,
        });

        //No of network rewards of the logged in user
        const userNetworkRewards = await NetworkRewards.find({
            UserTo: req.body.uuid
        });

        //claimmed pack purchase details of the logged in user
        const userClaimmedPack = await ClaimmedPack.find({
            UserID: req.body.uuid
        });
        
        res.setHeader('response-security', true);
        res.status(200).json({ data: { networkClaims: networkClaims.length, userNetworkRewards: userNetworkRewards.length, userClaimmedPack: userClaimmedPack.length }, error: null, type: "adminauth" });
    } catch (e) {
        console.log(e);
        res.status(400).json({ data: null, error: "Failed to fetch" });
    }
};

export default adminmiddleware(handler);