import NFTlicense from "../../../../../models/nftlicense/licensedetails";
import NFTlicensePurchase from "../../../../../models/nftlicense/purchase/userpurchased";
import getMongoDBConnection from "../../../../../utils/connection/mongodbconnection";
import usermiddleware from "middleware/usermiddleware";
import { responseBodyEncryption } from "../../../../../utils/common/jwtToken"
/**
 * @api {post} api/users/nftlicense/checkpurchased/ check purchased license
 * @apiName checkPurchasedLicense
 * @apiPermission User
 * @apiGroup User/NFTLicense
 * @apiVersion 1.0.0
 * @apiDescription check purchased license for NFT license
 * @apiBody {string} [uuid] user uuid
 * @apiBody {string} nftlicenseid nft license id
 * @apiExample {axios} Example usage:
 * axios.post('/api/users/nftlicense/checkpurchased/',{
 *  "nftlicenseid" : "628dfa6a962f7ba6abe68e72"
 * })
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

        let findPurchasedlicense = await NFTlicensePurchase.find({
            UserID: req.body.uuid,
            NftLicense: req.body.nftlicenseid
        });

        if (findPurchasedlicense.length > 0) {
            res.setHeader('response-security', true)
            res.status(200).json({ data: await responseBodyEncryption({ data: true, error: null }), type: "userauth" });
            return;
        }

        res.setHeader('response-security', true)
        res.status(200).json({ data: await responseBodyEncryption({ data: false, error: null }), type: "userauth" });

    } catch (e) {
        console.log("Error ", e)
        res.setHeader('response-security', true)
        res.status(200).json({ data: await responseBodyEncryption({ data: true, error: "Failed to fetch data" }), type: "userauth" });
    }
}

export default usermiddleware(handler);