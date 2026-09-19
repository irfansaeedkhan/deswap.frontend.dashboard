import adminmiddleware from "../../../../../../middleware/adminmiddleware";
import { fetchUserDownline } from "../../../../../../utils/network/downline";
import { responseBodyEncryptionAdmin } from "../../../../../../utils/common/jwtToken"

//
const handler = async(req, res) => {
    try {
        //fetch company owner downline
        const downline = await fetchUserDownline(req.user.id);
        //encrypt response body
        const responseBody = await responseBodyEncryptionAdmin(downline);
        //send response
        res.status(200).json({ data:responseBody, type: "adminauth"});
        
    } catch (e) {
        console.log(e);
        res.status(400).json({ data: null, error: "Failed to fetch downline" });
    }
};

export default adminmiddleware(handler);