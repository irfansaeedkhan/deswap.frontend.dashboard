import getMongoDBConnection from "../../../../../utils/connection/mongodbconnection";
import Company from "../../../../../models/company/company";
import { responseBodyEncryption } from "../../../../../utils/common/jwtToken"
import usermiddleware from "../../../../../middleware/usermiddleware";

const handler = async (req, res) => {
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

        const usersList = [];

        let filterObjectArray = [];
        let totalDataFilter = [];
        let countFilter = {
            $group: {
                "_id": "totaluser",
                "count": { $sum: 1 }
            }
        }
        let matchFilter = { $match: {} };
        let projectionFilter = {
            $project: {
                name: 1,
                owner: 1,
                business: 1,
                employees: 1,
                catagoryName: 1,
                created_at: 1,
                expireDate: 1,
                email: 1,
                ipfsURL: 1,
                renewalDate: 1,
                address:1
            }
        };


        if (req.body.name && req.body.name.trim() != "") {
            matchFilter.$match.name = { $regex: req.body.name, $options: 'i' }
        }

        // if(req.body.username&&req.body.username.trim()!=""){
        //     matchFilter.$match.username = {$regex:req.body.username,$options: 'i'};
        // }

        // if(req.body.publickey&&req.body.publickey.trim()!=""){
        //     matchFilter.$match.walletaddress = {$regex:req.body.publickey,$options: 'i'};
        // }

        totalDataFilter.push(projectionFilter)
        totalDataFilter.push(matchFilter)
        filterObjectArray.push(projectionFilter)
        filterObjectArray.push(matchFilter)

        filterObjectArray.push({ $skip: offset });
        filterObjectArray.push({ $limit: limit });


        filterObjectArray.push({ $sort: { createdAt: sort } })

        const userUsingOffset = await Company.aggregate(filterObjectArray)

        totalDataFilter.push(countFilter);
        const totalData = await Company.aggregate(totalDataFilter)

        res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryption({ data: userUsingOffset, total: totalData[0].count, error: null }), type: "userauth" });
    } catch (e) {
        console.log(e);
        res.status(400).json({ data: null, error: "Failed to fetch" });
    }
};

export default usermiddleware(handler);
// export default handler;