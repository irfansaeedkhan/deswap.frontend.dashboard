import Connection from "../../../../../db/db";
import claimmednetworkRewards from "../../../../../models/claimmedrewards/networkclaimmed"
import purchasedpack from "../../../../../models/deswapPack/purchasedpack";
import networkRewards from "../../../../../models/network/networkRewards";
import usermiddleware from "../../../../../middleware/usermiddleware";
import { responseBodyEncryption } from "../../../../../utils/common/jwtToken"
/**
 * @api {post} /api/user/claimmed/fetch/claimmed?offset=:offset&limit=:limit fetch Claimmed Rewards
 * @apiName FetchClaimmedRewards
 * @apiPermission User
 * @apiGroup User/Network
 * @apiVersion 1.0.0
 * @apiDescription Fetch Claimmed Rewards
 * @apiParam  {Number} [offset] offset
 * @apiParam {Number} [limit] limit
 * @apiExample {axios} Example usage:
 * axios.post('/api/user/claimmed/fetch/claimmed?offset=:offset&limit=:limit')
 * @apiSuccessExample {json} Success-Response:
 * {
 * "data": "encrypted data",
 * "error": null,
 * "type": "userauth"
 * }
 * @apiErrorExample {json} Error-Response:
 *  {
 * "data": null,
 * "error": "error message",
 * }
 */
//PurchasedPack
const handler = async (req, res) => {
    try {
        //
        if (req.method !== 'POST') {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }

        await Connection();

        let offset = 0;
        let limit = 10;
        if (req.body.offset) {
            offset = req.body.offset;
        }
        if (req.body.limit) {
            limit = req.body.limit;
        }


        //console.log("Request body :  ",req.body)
        var fields = { 'Amount': 1, 'Level': 1, 'RewardsPercentage': 1, 'Status': 1, 'created_at': 1, 'UserFrom': 1, 'ClaimmedNetworkID': 1 }
        let result = await networkRewards.find({
            UserTo: req.body.uuid,
            Status: "Claimmed"
        }, {}, {
            sort: {
                "created_at": "asc"
            }
        }).skip(req.body.offset).limit(req.body.limit).populate({ path: "PurchasedPack UserFrom ClaimmedNetworkID" }).select(fields);
        //.populate("PurchasedPack")


        let mappedResult = await result.map((mapdata) => {
            let userform = { walletaddress: mapdata.UserFrom.walletaddress };
            let purchasedpack = {
                PackID: mapdata.PurchasedPack ? mapdata.PurchasedPack.PackID : null,
                Quantity: mapdata.PurchasedPack ? mapdata.PurchasedPack.Quantity : null,
                TotalAmount: mapdata.PurchasedPack ? mapdata.PurchasedPack.TotalAmount : null,
                TotalAmountInMatic: mapdata.PurchasedPack ? mapdata.PurchasedPack.TotalAmountInMatic : null,
                Bonous: mapdata.PurchasedPack ? mapdata.PurchasedPack.Bonous : null,
            }
            mapdata.UserFrom = userform;
            mapdata.PurchasedPack = purchasedpack;
            mapdata.UserFrom.role = null
            mapdata.UserFrom.emailVerified = null
            mapdata.UserFrom.status = null
            return mapdata
        })

        let count = await networkRewards.find({
            UserTo: req.body.uuid,
            Status: "Claimmed"
        }, {}, {
            sort: {
                "created_at": "asc"
            }
        }).count();

        res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryption({ data: mappedResult, count: count, error: null }), type: "userauth" });

    } catch (e) {
        console.log(e);
        res.status(400).json({ data: null, error: "Failed to fetch" });
    }
}

export default usermiddleware(handler);