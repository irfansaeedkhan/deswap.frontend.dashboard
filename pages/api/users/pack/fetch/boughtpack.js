import MongoDbConnection from "../../../../../utils/connection/mongodbconnection";
import Users from "../../../../../models/Users";
import UserPacks from "../../../../../models/deswapPack/purchasedpack";
/**
 * @api {get} /api/users/pack/claim/fetch/boughtpack Fetch bought pack
 * @apiName Fetch bought pack
 * @apiPermission User
 * @apiGroup User/Pack
 * @apiVersion 1.0.0
 * @apiDescription Fetch bought pack
 * @apiExample {axios} Example usage:
 * axios.get('/api/users/pack/claim/fetch/boughtpack')
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
      const totalUserPackPurchased = await UserPacks.find({ UserID: user._id });
      if (totalUserPackPurchased) {
        return res.json({
          message: "success on retrieving data",
          success: true,
          totalUserPackPurchased,
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
