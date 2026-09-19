import NFTlicense from "../../../../../models/nftlicense/licensedetails";
import NFTlicensePurchase from "../../../../../models/nftlicense/purchase/userpurchased";
import getMongoDBConnection from "../../../../../utils/connection/mongodbconnection";
import usermiddleware from "middleware/usermiddleware";
import { responseBodyEncryption } from "../../../../../utils/common/jwtToken"
/**
 * @api {get} /api/users/nftlicense/fetch Fetch NFT License Details
 * @apiName Fetch NFT License Details
 * @apiPermission User
 * @apiGroup User/NFTLicense
 * @apiVersion 1.0.0
 * @apiDescription Fetch NFT License Details
 * @apiExample {axios} Example usage:
 * axios.get('/api/users/nftlicense/fetch')
 * @apiSuccessExample {json} Success-Response:
 * {
 * "data": "encrypted data",
 * "error": null,
 * "type": "userauth"
 * }
 * @apiErrorExample {json} Error-Response:
 * {
 * "data": null,
 * "error": "Failed to fetch data",
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

        let findPurchasedlicense = await NFTlicensePurchase.find({ UserID: req.body.uuid }).select("NftLicense")

        let listOfPurchasedLicense = findPurchasedlicense.map((value) => {
            return value.NftLicense;
        });

        let result = await NFTlicense.find({ "_id": { "$nin": listOfPurchasedLicense }, status: "Active" }, null, { sort: { Index: 1 } }).limit(100).skip(0);

        let fetchMaxNumber = await NFTlicense.findOne({}, {}, { sort: { Index: -1 } }).select("Index");
        
        res.setHeader('response-security', true)
        res.status(200).json({ data: await responseBodyEncryption({ data: result, success: true, max: fetchMaxNumber, error: null }), type: "userauth" });

    } catch (e) {
        console.log("Error ", e)
        res.status(400).json({ data: null, error: "Failed to fetch data" });
    }
}

export default usermiddleware(handler);