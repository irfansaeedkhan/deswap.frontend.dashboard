import Connection from "../../../../../db/db";
import claimmednetworkRewards from "../../../../../models/claimmedrewards/networkclaimmed";
import purchasedpack from "../../../../../models/deswapPack/purchasedpack";
import networkRewards from "../../../../../models/network/networkRewards";
import usermiddleware from "../../../../../middleware/usermiddleware";
import { responseBodyEncryption } from "../../../../../utils/common/jwtToken";
/**
 * @api {post} /api/user/claimmed/fetch/all?offset=:offset&limit=:limit fetch Claimmed Rewards
 * @apiName FetchClaimmedRewards
 * @apiPermission User
 * @apiGroup User/Network
 * @apiVersion 1.0.0
 * @apiDescription Fetch Claimmed Rewards
 * @apiParam  {Number} [offset] offset
 * @apiParam {Number} [limit] limit
 * @apiExample {axios} Example usage:
 * axios.post('/api/user/claimmed/fetch/all?offset=:offset&limit=:limit')
 * @apiSuccessExample {json} Success-Response:
 * {
 * "data": "encrypted data",
 * "error": null,
 * "type": "userauth"
 * }
 * @apiErrorExample {json} Error-Response:
 * {
 * "data": null,
 * "error": "error message",
 * }
 * 
 * 
 */
//PurchasedPack
const handler = async (req, res) => {
  try {
    //
    if (req.method !== "POST") {
      res.status(400).json({ data: null, error: "Invalid Method" });
      return;
    }

    await Connection();

    //set offset and limit
    let offset = 0;
    let limit = 10;
    if (req.query.offset) {
      offset = parseInt(req.query.offset);
    }
    if (req.query.limit) {
      limit = parseInt(req.query.limit);
    }

    var fields = {
      Amount: 1,
      Level: 1,
      RewardsPercentage: 1,
      Status: 1,
      created_at: 1,
      UserFrom: 1,
      ClaimmedNetworkID: 1,
    };
    let result = await networkRewards
      .find(
        {
          UserTo: req.body.uuid,
          Status: { $in: ["Active", "Claimmed"] },
        },
        {},
        {
          sort: {
            created_at: "asc",
          },
        }
      )
      .skip(offset)
      .limit(limit)
      .populate({ path: "PurchasedPack UserFrom ClaimmedNetworkID" })
      .select(fields);
    //.populate("PurchasedPack")

    let mappedResult = await result.map((mapdata) => {
      let userform = { walletaddress: mapdata.UserFrom.walletaddress };
      let purchasedpack = {
        PackID: mapdata.PurchasedPack.PackID,
        Quantity: mapdata.PurchasedPack.Quantity,
        TotalAmount: mapdata.PurchasedPack.TotalAmount,
        TotalAmountInMatic: mapdata.PurchasedPack.TotalAmountInMatic,
        Bonous: mapdata.PurchasedPack.Bonous,
      };
      mapdata.UserFrom = userform;
      mapdata.PurchasedPack = purchasedpack;
      mapdata.UserFrom.role = null;
      mapdata.UserFrom.emailVerified = null;
      mapdata.UserFrom.status = null;
      return mapdata;
    });

    let count = await networkRewards
      .find(
        {
          UserTo: req.body.uuid,
          Status: { $in: ["Active", "Claimmed"] },
        },
        {},
        {
          sort: {
            created_at: "asc",
          },
        }
      )
      .count();

    res.setHeader("response-security", true);
    res.status(200).json({
      data: await responseBodyEncryption({
        data: mappedResult,
        error: null,
        count: count,
      }),
      type: "userauth",
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ data: null, error: "Failed to fetch" + e });
  }
};

export default usermiddleware(handler);
//export default handler;
