import adminmiddleware from '../../../../../middleware/adminmiddleware';
import userNFTLicenseFees from '../../../../../models/nftlicense/fees/usernftlicensefees';
import getMongoDBConnection from "../../../../../utils/connection/mongodbconnection";
import { responseBodyEncryptionAdmin } from "../../../../../utils/common/jwtToken";
import UserModal from "../../../../../models/Users"

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
        const nftLicenseFeeList = await userNFTLicenseFees.find({uuid:req.body.id}).populate({path: 'UserID',select:'emailid username walletaddress'}).skip(offset).limit(limit).sort({ createdAt: sort });
        if (!nftLicenseFeeList) {
            res.status(400).json({ data: null, error: "Invalid nftLicenseFeeList" });
            return;
        }

        const count = await userNFTLicenseFees.count({uuid:req.body.id});

        //return response
        res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryptionAdmin({ data: nftLicenseFeeList,total:count }), type: "adminauth" });
    } catch (error) {
        res.status(400).json({ data: null, error: error.message });
    }
}

export default adminmiddleware(handler);