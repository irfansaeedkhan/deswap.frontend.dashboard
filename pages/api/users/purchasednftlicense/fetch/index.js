import NFTlicense from "../../../../../models/nftlicense/licensedetails";
import NFTlicensepurchased from "../../../../../models/nftlicense/purchase/userpurchased"
import getMongoDBConnection from "../../../../../utils/connection/mongodbconnection";
import usermiddleware from "../../../../../middleware/usermiddleware";
import { responseBodyEncryption } from "../../../../../utils/common/jwtToken"

/**
 * @api {post} /api/users/purchasednftlicense/fetch/ Fetch purchased NFT license
 * @apiName Fetch purchased NFT license
 * @apiPermission User
 * @apiGroup User/NFTLicense
 * @apiVersion 1.0.0
 * @apiDescription Fetch purchased NFT license
 * @apiExample {axios} Example usage:
 * axios.post('/api/users/purchasednftlicense/fetch/')
 * @apiSuccessExample {json} Success-Response:
 * {
 *  "data": "Encrypted data",
 *  "type": "userauth"
 * }
 * @apiErrorExample {json} Error-Response:
 * {
 *  "error": "NFT license not found"
 * }
 */
const handler = async(req, res) => {
    try {

        if (req.method !== 'POST') {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }

        //
        await getMongoDBConnection();

        let result = await NFTlicensepurchased.find({ UserID: req.body.uuid, status: "DActive" }).populate("NftLicense");

        let fetchMaxNumber = await NFTlicense.findOne({}, {}, { sort: { Index: -1 } }).select("Index");

        res.setHeader('response-security', true)
        res.status(200).json({ data: await responseBodyEncryption({ data: result, max: fetchMaxNumber, error: null }), type: "userauth" });

    } catch (e) {
        console.log("Error ", e)
        res.status(400).json({ data: null, error: "Failed to fetch data" });
    }
}

export default usermiddleware(handler);