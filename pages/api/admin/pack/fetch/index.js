import Connection from "../../../../../db/db";
import packdetails from "../../../../../models/deswapPack/packdetails";
import adminmiddleware from "../../../../../middleware/adminmiddleware";
import { responseBodyEncryptionAdmin } from "../../../../../utils/common/jwtToken"


const handler = async(req, res) => {
    try {
        //
        if (req.method !== 'GET') {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }
        let offset = 0;
        let limit = 150;

        await Connection();

        if (req.query.offset) {
            offset = parseInt(req.query.offset);
        }
        if (req.query.limit) {
            limit = parseInt(req.query.limit);
        }

        //TO DO : Seems to be incorrent
        let result = await packdetails.find({
            packdetails
        }, {}, {
            sort: {
                "created_at": "1",
                "createdAt": "1"
            }
        }).skip(offset).limit(limit);

        res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryptionAdmin({ data: result, error: null, total: result.length }), type: "adminauth" });

    } catch (e) {
        console.log(e);
        res.status(400).json({ data: null, error: "Failed to fetch" });
    }
}

export default adminmiddleware(handler);