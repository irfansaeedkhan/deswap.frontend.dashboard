import Connection from "../../../../../db/db";
import purchasedpack from "../../../../../models/deswapPack/purchasedpack";
import networkRewards from "../../../../../models/network/networkRewards";
import usermiddleware from "../../../../../middleware/usermiddleware";
import { responseBodyEncryption } from "../../../../../utils/common/jwtToken"
/**
 * @api {post} /api/user/claimmed/fetch?skip=:skip&limit=:limit fetch Claimmed Rewards
 * @apiName FetchClaimmedRewards
 * @apiPermission User
 * @apiGroup User/Network
 * @apiVersion 1.0.0
 * @apiDescription Fetch Claimmed Rewards
 * @apiParam  {Number} [skip] skip
 * @apiParam {Number} [limit] limit
 * @apiExample {axios} Example usage:
 * axios.post('/api/user/claimmed/fetch?skip=:skip&limit=:limit')
 * @apiSuccessExample {json} Success-Response:
 *  {
 * "data": "encrypted data",
 * "error": null,
 * "type": "userauth"
 * }
 * @apiErrorExample {json} Error-Response:
 * {
 * "data": null,
 * "error": "error message",
 * }
 */
//PurchasedPack
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

        var fields = { 'Amount': 1, 'Level': 1, 'RewardsPercentage': 1, 'Status': 1, 'created_at': 1, 'UserFrom': 1 }
        let result = await networkRewards.find({
            UserTo: req.body.uuid,
            Status: "Active"
        }, {}, {
            sort: {
                "created_at": "asc"
            }
        }).skip(req.body.skip).limit(req.body.limit).populate({ path: "PurchasedPack UserFrom" }).select(fields);
        //.populate("PurchasedPack")

        let mappedResult = await result.map((mapdata) => {
            let userform = { walletaddress: mapdata.UserFrom.walletaddress };
            let purchasedpack = {
                    PackID: mapdata.PurchasedPack.PackID,
                    Quantity: mapdata.PurchasedPack.Quantity,
                    TotalAmount: mapdata.PurchasedPack.TotalAmount,
                    TotalAmountInMatic: mapdata.PurchasedPack.TotalAmountInMatic,
                    Bonous: mapdata.PurchasedPack.Bonous,
                }
                //
                //console.log("User from ",userform)
                //mapdata.UserFrom = null
            mapdata.UserFrom = userform;
            mapdata.PurchasedPack = purchasedpack;
            mapdata.UserFrom.role = null
            mapdata.UserFrom.emailVerified = null
            mapdata.UserFrom.status = null
                // delete mapdata.UserFrom.role
                // delete mapdata.UserFrom.emailVerified
                // delete mapdata.UserFrom.status

            //console.log("Mapped result : ",mapdata)

            return mapdata
        })

        let count = await networkRewards.find({
            UserTo: req.body.uuid,
            Status: "Active"
        }, {}, {
            sort: {
                "created_at": "asc"
            }
        }).count();
        res.setHeader('response-security', true);

        res.status(200).json({ data: await responseBodyEncryption({ data: mappedResult, error: null, totaldata: count }), type: "userauth" });

    } catch (e) {
        console.log(e);
        res.status(400).json({ data: null, error: "Failed to fetch" });
    }
}

//Need to add middleware
export default usermiddleware(handler);
//export default handler;