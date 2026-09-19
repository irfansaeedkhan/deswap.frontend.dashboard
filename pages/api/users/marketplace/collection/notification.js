import Connection from "../../../../../db/db";
import Notifcation from "../../../../../models/notification";
import usermiddleware from "../../../../../middleware/usermiddleware";
import { responseBodyEncryption } from "../../../../../utils/common/jwtToken"

const handler = async (req, res) => {
    try {
        //
        if (req.method !== 'POST') {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }

        await Connection();

        
        let result = await Notifcation.insertMany([{
            UserID: req.body.uuid,
            id: req.body.collectionID,
            type:"Create Collection",
            for:req.body.uuid,
            by:req.body.uuid
        }])

        res.setHeader('response-security', true)
        res.status(200).json({ data: await responseBodyEncryption({ data: "success", error: null }), type: "userauth" });
    } catch (e) {
        console.log(e);
        res.status(400).json({ data: null, error: "Failed to fetch" });
    }
}

//Need to add middleware
export default usermiddleware(handler);
//export default handler;