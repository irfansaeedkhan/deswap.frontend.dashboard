import Connection from "../../../../../db/db";
import purchasedpack from "../../../../../models/deswapPack/purchasedpack";
import networkRewards from "../../../../../models/network/networkRewards";
import usermiddleware from "../../../../../middleware/usermiddleware";
import { responseBodyEncryption } from "../../../../../utils/common/jwtToken"
/**
 * @api {post} /api/users/network/fetch/totaldata Total Data
 * @apiName Total Data
 * @apiGroup User/Network
 * @apiVersion 1.0.0
 * @apiDescription This api is used to fetch total data of packs purchased by user
 * @apiExample {axios} Request Example:
 * axios.post('/api/users/network/fetch/totaldata')
 * 
 * 
 */
var mongoose = require('mongoose');
//PurchasedPack
const handler = async(req, res) => {
    try {
        //

        if (req.method !== 'POST') {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }

        await Connection();


        let totalRewards = await networkRewards.aggregate([{
                $match: {
                    UserTo: new mongoose.Types.ObjectId(req.body.uuid),
                }
            },
            {
                $project: {
                    userrewards: { $multiply: ["$RewardsPercentage", "$Amount"] }
                }
            },
            {
                $group: {
                    _id: "totalrewards",
                    totalRewards: {
                        $sum: {
                            $ifNull: ["$userrewards", 0]
                        }
                    }
                }
            }
        ])

        if (totalRewards.length < 1) {
            totalRewards.push({
                _id: "totalrewards",
                totalRewards: 0.0
            })
        }
        /*
        {
                $group:{
                    _id:"totalrewards",
                    totalRewards:{$sum:"$userrewards"}
                }
            }

        */
        let avaibleRewards = await networkRewards.aggregate([{
                $match: {
                    UserTo: new mongoose.Types.ObjectId(req.body.uuid),
                    Status: "Active"
                }
            },
            {
                $project: {
                    userrewards: { $multiply: ["$RewardsPercentage", "$Amount"] }
                }
            },
            {
                $project: {
                    _id: "avaiblerewards",
                    totalRewards: {
                        $sum: {
                            $ifNull: ["$userrewards", 0]
                        }
                    }
                }
            }
        ])

        if (avaibleRewards.length < 1) {
            avaibleRewards.push({
                _id: "avaiblerewards",
                totalRewards: 0.0
            })
        }
        /**
         * {
                $group:{
                    _id:"avaiblerewards",
                    totalRewards:{$sum:"$userrewards"}
                }
            }
         */
        let claimmedRewards = await networkRewards.aggregate([{
                $match: {
                    UserTo: new mongoose.Types.ObjectId(req.body.uuid),
                    Status: "Claimmed"
                }
            },
            {
                $project: {
                    userrewards: { $multiply: ["$RewardsPercentage", "$Amount"] }
                }
            },
            {
                $group: {
                    _id: "claimmed",
                    totalRewards: {
                        $sum: {
                            $ifNull: ["$userrewards", 0]
                        }
                    }
                }
            }
        ])

        if (claimmedRewards.length < 1) {
            claimmedRewards.push({
                _id: "claimmed",
                totalRewards: 0.0
            })
        }
        /**
         * $group:{
                    _id:"claimmed",
                    totalRewards:{$sum:"$userrewards"}
                }
         */
        res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryption({ data: { total: totalRewards, avaible: avaibleRewards, claimmed: claimmedRewards }, error: null }), type: "userauth" });

    } catch (e) {
        console.log(e);
        res.status(400).json({ data: null, error: "Failed to fetch" });
    }
}

//Need to add middleware
export default usermiddleware(handler);
//export default handler;