import adminmiddleware from "../../../../middleware/adminmiddleware";
import getMongoDBConnection from "../../../../utils/connection/mongodbconnection.js";
import { sendEmail } from "../../../../utils/common/email.js";
import PackClaimmed from "../../../../models/claimmedrewards/packclaimmed";
import { responseBodyEncryptionAdmin } from "../../../../utils/common/jwtToken";
/**
 * @api {post} /api/admin/clammied/deleteclaimedpack?packid=:packid Delete Claimmed Pack
 * @apiName DeleteClaimmedPack
 * @apiPermission Admin
 * @apiGroup Admin
 * @apiVersion 1.0.0
 * @apiDescription Delete Claimmed Pack
 * @apiHeader {String} cookies Admin's unique cookies.
 * @apiDefine adminauth Admin Authentication.
 * @apiParam {String} [packid] Pack id
 * @apiSuccess {String} data Pack deleted
 * @apiError {String} error Failed to delete.
 *
 *
 */

const handler = async (req, res) => {
  try {
    if (req.method !== "DELETE") {
      res.status(400).json({ data: null, error: "Invalid Method" });
      return;
    }

    let packid = req.query.packid;
    await getMongoDBConnection();
    let pack = await PackClaimmed.findById(packid);
    if (!pack) {
      res.status(400).json({ data: null, error: "Pack not found" });
      return;
    }
    //send pack delete email with pack details

    let emailData = {
      toAddress: pack.email,
      subject: "Pack Deleted",
      bodyText: `Your pack ${pack.packname} has been deleted.`,
      bodyHTML: `<p>Your pack ${pack.packname} has been deleted. pack details are ${pack}</p>`,
    };
    await sendEmail(emailData);
    //delete pack
    await PackClaimmed.findByIdAndDelete(packid);

    res.setHeader("response-security", true);
    res.status(200).json({
      data: await responseBodyEncryptionAdmin({
        data: "Deleted",
        error: null,
      }),
      type: "adminauth",
    });
  } catch (e) {
    console.log(e);
    res
      .status(400)
      .json({ data: null, error: "Failed to delete" + "\n" + e.message });
  }
};
export default adminmiddleware(handler);
