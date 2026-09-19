import networkSetting from "../../../../../models/networkRewardsSetting/networkRewardsSetting";
import getMongoDBConnection from "../../../../../utils/connection/mongodbconnection";
import adminmiddleware from "../../../../../middleware/adminmiddleware";
import { responseBodyEncryptionAdmin } from "../../../../../utils/common/jwtToken"

const handler = async(req, res) => {
    try {

        if (req.method !== 'POST') {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }

        //TO DO : Add offset and limit
        await getMongoDBConnection();
        
        let count = await networkSetting.count();
                
        res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryptionAdmin({ data: count }), type: "adminauth" });
    } catch (e) {
        console.log("Error ", e)
        res.status(400).json({ data: null, error: "Failed to insert license" });
    }
}

export default adminmiddleware(handler);