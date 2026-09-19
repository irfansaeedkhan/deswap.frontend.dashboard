import MongoDbConnection from "../../../../../utils/connection/mongodbconnection";
import Users from "../../../../../models/Users";
import UserNetwork from "../../../../../models/users/usersNetworks"
/**
 * @api {get} /api/users/pack/claim/fetch/fetchReferral Fetch referral
 * @apiName Fetch referral
 * @apiPermission User
 * @apiGroup User/Pack
 * @apiVersion 1.0.0
 * @apiDescription Fetch referral
 * @apiExample {axios} Example usage:
 * axios.get('/api/users/pack/claim/fetch/fetchReferral')
 * @apiSuccessExample {json} Success-Response:
 * {
 * "data": "encrypted data",
 * "error": null,
 * "type": "userauth"
 * }
 * @apiErrorExample {json} Error-Response:
 * {
 * "data": null,
 * "error": "Failed to fetch data",
 * }
 * 
 */

const FetchBoughtPack = async (req, res) => {
  try {

    return res.json({
      message: "No Data available",
      success: false,
    });
    await MongoDbConnection();
    const { emailid } = req.body;

    const user = await Users.findOne({ emailid });

    if (user) {
      const totalUserReferrals = await UserNetwork.find({ sponsoruid: user.uuid });
      if (totalUserReferrals) {
        return res.json({
          message: "success on retrieving data",
          success: true,
          totalUserReferrals,
        });
      }

      return res.json({
        message: "No Data available",
        success: false,
      });
    }
    return res.json({
      message: "No Data available",
      success: false,
    });
  } catch (error) {
    return res.json({
      message: "No Data available",
      success: false,
    });
  }
};
export default FetchBoughtPack;
