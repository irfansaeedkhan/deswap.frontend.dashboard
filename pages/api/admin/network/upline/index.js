import adminmiddleware from "../../../../../middleware/adminmiddleware";
import { fetchUserUpline } from "../../../../../utils/network/upline/index";
import { responseBodyEncryptionAdmin } from "../../../../../utils/common/jwtToken"

const handler = async(req, res) => {
    try {
        let upline = await fetchUserUpline(req.body.userid);
        
        res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryptionAdmin({ data: upline, error: null, total: upline.length }), type: "adminauth" });
    } catch (e) {
        console.log(e);
        res.status(200).json({data:await responseBodyEncryptionAdmin({ data: null, error: "Failed to fetch upline" }), type: "adminauth"});
    }
};

export default adminmiddleware(handler);