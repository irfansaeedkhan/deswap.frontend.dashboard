import getMongoDBConnection from "../../../../utils/connection/mongodbconnection";
import usermiddleware from "../../../../middleware/usermiddleware";
import Users from "../../../../models/Users";
import ProfilePic from "../../../../models/profilepic/profilepic";
import { responseBodyEncryption } from "../../../../utils/common/jwtToken";
/**
 * @api {post} /api/users/profile/info/ Fetch user profile
 * @apiName FetchUserProfileInfo
 * @apiGroup User/Profile
 * @apiVersion 1.0.0
 * @apiDescription Fetch user profile
 * @apiExample {axios} Example usage:
 * axios.post('/api/users/profile/info/')
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
const handler = async (req, res) => {
  try {
    //
    if (req.method !== "POST") {
      res.status(400).json({ data: null, error: "Invalid Method" });
      return;
    }

    await getMongoDBConnection();

    let profilePic = await ProfilePic.findOne({
      UserID: req.body.uuid,
      Status: "Active",
    });

    let result = await Users.findOne({
      _id: req.body.uuid,
      Status: "Active",
    }).select(
      "username emailid walletaddress role uuid createdAt marketPlaceBio social_twitter social_facebook"
    );

    console.log("Profle Pic ", profilePic);
    //Checking if profile pic exits
    if (profilePic) {
      //If profile pic exits then updating it
      result["profilePic"] = profilePic.Location;
    } else {
      result["profilePic"] = "";
    }

    console.log("Sending data ", result, profilePic);
    res.setHeader("response-security", true);
    res.status(200).json({
      data: await responseBodyEncryption({ data: result, error: null }),
      type: "userauth",
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ data: null, error: "Failed to fetch" });
  }
};

//Need to add middleware
export default usermiddleware(handler);
