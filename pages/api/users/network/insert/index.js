import Connection from "../../../../../db/db";
import purchasedpack from "../../../../../models/deswapPack/purchasedpack";
import { responseBodyEncryption } from "../../../../../utils/common/jwtToken"
import usermiddleware from "../../../../../middleware/usermiddleware";

const handler = async(req, res) => {
    try {
        //
        if (req.method !== 'POST') {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }

        await Connection();

        if (req.body.skip == undefined || req.body.skip == null || req.body.skip == 0) {
            req.body.skip = 0;
        }

        if (req.body.limit == undefined || req.body.limit == null || req.body.limit == 0) {
            req.body.limit = 10;
        }

        let result = await purchasedpack.find({
            UserID: req.body.uuid,
            Status: "Active"
        }, {}, {
            sort: {
                "created_at": "asc"
            }
        }).skip(req.body.skip).limit(req.body.limit).populate("PackID");
        
        res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryption({ data: result, error: null }), type: "userauth" });

    } catch (e) {
        console.log(e);
        res.status(400).json({ data: null, error: "Failed to fetch" });
    }
}

//Need to add middleware
//export default adminmiddleware(handler);
export default usermiddleware(handler);