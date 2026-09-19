import adminmiddleware from "../../../../../middleware/adminmiddleware";
import getMongoDBConnection from "../../../../../utils/connection/mongodbconnection";
import Users from "../../../../../models/Users";
import IPBasedAccess from "../../../../../models/users/ipbasedAccess";
import { responseBodyEncryptionAdmin } from "../../../../../utils/common/jwtToken";
/**
 * @api {post} /api/admin/access/fetch fetch IP Based Access
 * @apiName FetchAccess
 * @apiGroup Access
 * @apiVersion 1.0.0
 * @apiDescription Fetch IP Based Access
 * 
 */
const handler = async(req, res) => {
    try{
        if (req.method !== "POST") {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }

        await getMongoDBConnection();
        
        let fetchListOfAvaible = await IPBasedAccess.find().populate({path: 'UserID',select:'emailid username walletaddress'}).populate({path: 'AddedBy',select:'emailid username walletaddress'}).select("UserID AddedBy IPv4 Description Status");

        res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryptionAdmin({data:fetchListOfAvaible ,error: null}), type: "adminauth" });
        return;

    }catch(e){
        console.log(e)
        res.status(400).json({ data: null, error: "Failed to add" });
    }
}

export default adminmiddleware(handler);