import getMongoDBConnection from "../../../../utils/connection/mongodbconnection";
import License from "../../../../models/marketplace/licence";
import { responseBodyEncryptionAdmin } from "../../../../utils/common/jwtToken"
import adminmiddleware from "../../../../middleware/adminmiddleware";

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
                licenseID: 1,
                creatorAddress: 1,
                signature_hash: 1,
                submitedAt: 1,
                status: 1
            }
        };

        let userUsingOffset;
        let totalData;
        var reg = new RegExp('^[0-9]*$');
            if (reg.test(req.body.licenseID)==false) {
                if (req.body.licenseID && req.body.licenseID.trim() != "") {
                    matchFilter.$match.creatorAddress = { $regex: req.body.licenseID, $options: 'i' }
                    matchFilter.$match.status="Requested"
                }

                totalDataFilter.push(projectionFilter)
                totalDataFilter.push(matchFilter)
                filterObjectArray.push(projectionFilter)
                filterObjectArray.push(matchFilter)

                filterObjectArray.push({ $skip: offset });
                filterObjectArray.push({ $limit: limit });


                filterObjectArray.push({ $sort: { submitedAt: sort } })

                userUsingOffset = await License.aggregate(filterObjectArray)

                totalDataFilter.push(countFilter);
                totalData = await License.aggregate(totalDataFilter)
            }
            else {
                userUsingOffset = await License.find({ licenseID: req.body.licenseID,status:"Requested" });
                totalData=await License.count({ licenseID: req.body.licenseID });
            }
            res.setHeader('response-security', true);
            res.status(200).json({ data: await responseBodyEncryptionAdmin({ data: userUsingOffset,totalData:totalData, error: null }), type: "adminauth" });
        } catch (e) {
            console.log(e);
            res.status(400).json({ data: null, error: "Failed to fetch" });
        }
    };

    export default adminmiddleware(handler);