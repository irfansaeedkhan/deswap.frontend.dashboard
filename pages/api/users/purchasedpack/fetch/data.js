import Connection from "../../../../../db/db";
import packdetails from "../../../../../models/deswapPack/packdetails";
import purchasedpack from "../../../../../models/deswapPack/purchasedpack";
import { responseBodyEncryption } from "../../../../../utils/common/jwtToken"

import usermiddleware from "../../../../../middleware/usermiddleware";
var mongoose = require('mongoose');

/**
 * @api {post} /api/users/purchasedpack/fetch/data/ Fetch Purchased Pack data
 * @apiName data
 * @apiGroup User/Pack
 * @apiVersion 1.0.0
 * @apiDescription Fetch Purchased Pack data
 * @apiExample {axios} Example usage:
 * axios.post('/api/users/purchasedpack/fetch/data/')
 * @apiSuccess {String} message Success message.
 * 
 * @apiSuccess {String} data User data.
 * @apiSuccessExample {json} Success-Response:
 * {
 * "data": "Encrypted data"
 * }
 * @apiError {String} message Error message.
 * @apiErrorExample {json} Error-Response:
 * {
 * "message": "Error message"
 * }
 * 
 *  
 */

const handler = async(req, res) => {
    try {
        //
        if (req.method !== 'POST') {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }

        await Connection();

        let purchasedPackTotal = await purchasedpack.aggregate([{
                $match: {
                    UserID: new mongoose.Types.ObjectId(req.body.uuid),
                    Status: "Active"
                }
            },
            {

                $lookup: {
                    from: "packdetails",
                    localField: "PackID",
                    foreignField: "_id",
                    as: "packdetails"
                }
            },
            {
                $unwind: '$packdetails'
            },
            {
                $project: {
                    dawReward: "$DAW",
                    bonousRewards: { $multiply: ["$DAW", "$packdetails.Bonous"] }
                }
            },
            {
                $group: {
                    _id: "lockedrewards",
                    totalrewards: { $sum: "$dawReward" },
                    totalbonousrewards: { $sum: "$bonousRewards" },
                }
            }
        ])

        //DAW,Bonous
        let purchasedPackClaimmed = await purchasedpack.aggregate([{
                $match: {
                    UserID: new mongoose.Types.ObjectId(req.body.uuid),
                    Status: "Claimmed"
                }
            },
            {

                $lookup: {
                    from: "packdetails",
                    localField: "PackID",
                    foreignField: "_id",
                    as: "packdetails"
                }
            },
            {
                $unwind: '$packdetails'
            },
            {
                $project: {
                    dawReward: "$DAW",
                    bonousRewards: { $multiply: ["$DAW", "$packdetails.Bonous"] }
                }
            },
            {
                $group: {
                    _id: "avaiblerewards",
                    totalrewards: { $sum: "$dawReward" },
                    totalbonousrewards: { $sum: "$bonousRewards" },
                }
            }
        ])

        res.setHeader('response-security', true)
        res.status(200).json({ data: await responseBodyEncryption({ data: { locked: purchasedPackTotal, avaible: purchasedPackClaimmed }, error: null }), type: "userauth" });

    } catch (e) {
        console.log(e);
        res.status(400).json({ data: { locked: [], avaible: [] }, error: "Failed to fetch" });
    }
}

//Need to add middleware
export default usermiddleware(handler);
//export default handler;