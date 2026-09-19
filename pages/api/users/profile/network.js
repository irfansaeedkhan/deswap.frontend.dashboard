import getMongoDBConnection from "../../../../utils/connection/mongodbconnection";
import usermiddleware from "../../../../middleware/usermiddleware";
import Users from "../../../../models/Users";
import UsersNetwork from "../../../../models/users/usersNetworks";
import { responseBodyEncryption } from "../../../../utils/common/jwtToken"

/**
 * @api {post} /api/users/profile/network/ Fetch user profile Network
 * @apiName FetchUserProfileNetwork
 * @apiGroup User/Profile
 * @apiVersion 1.0.0
 * @apiDescription Fetch user profile Network
 * @apiExample {axios} Example usage:
 * axios.post('/api/users/profile/network/')
 * @apiSuccess {String} message Success message.
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
 */
const handler = async(req, res) => {
    try {
        //
        if (req.method !== 'POST') {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }

        await getMongoDBConnection();

        let result = await UsersNetwork.findOne({
            uuid: req.body.uuid
        }).populate("uuid")
            //let result = await Users.findOne({_id: req.body.uuid}).select("username emailid walletaddress role uuid")

        res.setHeader('response-security', true)
        res.status(200).json({ data: await responseBodyEncryption({ data: { directnetwork: result.childuid.length, publickey: result.uuid.walletaddress[result.uuid.walletaddress.length - 1] }, error: null }), type: "userauth" });

    } catch (e) {
        console.log(e);
        res.status(400).json({ data: null, error: "Failed to fetch" });
    }
}

//Need to add middleware
export default usermiddleware(handler);