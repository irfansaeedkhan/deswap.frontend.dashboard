import adminmiddleware from "../../../../../middleware/adminmiddleware";
import { fetchUserDownline } from "../../../../../utils/network/downline";
import { responseBodyEncryptionAdmin } from "../../../../../utils/common/jwtToken"

const handler = async(req, res) => {
    try {
        //
        let downline = await fetchUserDownline(req.body.userid);
        
        res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryptionAdmin({ data: downline, error: null, total: downline.length }), type: "adminauth" });
    } catch (e) {
        console.log(e);
        res.status(400).json({ data: null, error: "Failed to fetch upline" });
    }
};

export default adminmiddleware(handler);