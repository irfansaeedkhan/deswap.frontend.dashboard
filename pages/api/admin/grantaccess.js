import adminmiddleware from "../../../middleware/adminmiddleware";
import getMongoDBConnection from "../../../utils/connection/mongodbconnection";
import IPAccessToken from "../../../models/users/ipAccessToken";
import ipBlock from "../../../models/users/ipbasedAccess";
import unprotectedmiddleware from "../../../middleware/unprotectedmiddleware";


let handler = async (req, res) => {
    try {
        if (req.method !== "POST") {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }
        //get token from get query
        let tokenenc = req.body.token;
        let token = await decodeURIComponent(tokenenc);
        if (!token) {
            res.status(400).json({ data: null, error: "Invalid Token" });
            return;
        }
        await getMongoDBConnection();
        //check if token exists in ip access token and is valid
        let ipAccessToken = await IPAccessToken.findOne({
            Token: token,
            $and: [{ Expires: { $gt:Date.now()} }, { Status: "active" }]
        });

        if (!ipAccessToken) {
            res.status(400).json({ data: null, error: "Invalid Token" });
            return;
        }
        //set Blocked to false
        let ipb = await ipBlock.findOneAndUpdate(
            { _id: ipAccessToken.ip },
            { $set: { Blocked: false } }
        );
        if (!ipb) {
            res.status(400).json({ data: null, error: "Invalid Token" });
            return;
        }
        //delete token
        let ipAccessTokenDelete = await IPAccessToken.findOneAndDelete({
            Token: token
        });
        if (!ipAccessTokenDelete) {
            res.status(400).json({ data: null, error: "Invalid Token" });
            return;
        }
        res.status(200).json({ data: "Successful", error: "" });
    } catch (e) {
        console.log("Error while fetching requested ", e);
        res.status(400).json({ data: null, error: "Failed to fetch" });
    }
}

//export default adminmiddleware(handler);
export default unprotectedmiddleware(handler);
