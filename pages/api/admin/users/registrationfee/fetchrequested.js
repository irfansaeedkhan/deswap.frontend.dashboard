import adminmiddleware from '../../../../../middleware/adminmiddleware';
import regFee from '../../../../../models/users/userRegistrationFees';
import getMongoDBConnection from "../../../../../utils/connection/mongodbconnection";
import { responseBodyEncryptionAdmin } from "../../../../../utils/common/jwtToken";


const handler = async(req, res) => {
    try {
        if (req.method !== "POST") {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }
        let offset = 0;
        let limit = 10;
        //Setting sort assending
        let sort = -1;

        if (req.body.offset) {
            offset = parseInt(req.body.offset);
        }
        if (req.body.limit) {
            limit = parseInt(req.body.limit);
        }

        if (req.body.sort) {
            sort = parseInt(req.body.sort)
        }

        await getMongoDBConnection();

        //get all users fee
        const regFeeList = await regFee.find({status:"Requested"},{},{
            sort: {
                "created_at": "desc"
            }}).populate({path:"uuid",select:"emailid walletaddress"}).skip(offset).limit(limit).sort({ createdAt: sort });
        if (!regFeeList) {
            res.status(400).json({ data: null, error: "Invalid regFeeList" });
            return;
        }

        const total = await regFee.count({status:"Requested"});


        //return response
        res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryptionAdmin({ data: regFeeList , total:total}), type: "adminauth" });
    } catch (error) {
        res.status(400).json({ data: null, error: error.message });
    }
}

export default adminmiddleware(handler);