import adminmiddleware from "../../../../../../middleware/adminmiddleware";
import Users from "../../../../../../models/Users";
import purchasedpack from "../../../../../../models/deswapPack/purchasedpack";
import networkRewards from "../../../../../../models/network/networkRewards";
import networkclaimmed from "../../../../../../models/claimmedrewards/networkclaimmed";
import { responseBodyEncryptionAdmin } from "../../../../../../utils/common/jwtToken";
import joi from "joi";
import ejs from "ejs";
import { resolve } from "path";
import { sendEmail } from "../../../../../../utils/common/email";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: false,
  convert: true,
};

const userclaimmednetworkrewards = async (data) => {
  try {
    let pathTotemplate = await resolve(
      "templates/email/admin/networkrewardsclaimmed.ejs"
    );

    //
    let htmltempate = await ejs.renderFile(pathTotemplate, {
      rewardsfrom: data.rewardsfrom,
      emailid: data.emailid,
      publickey: data.publickey,
      amount: data.amount,
      purpose: data.purpose,
    });

    let result = await sendEmail({
      toAddress: process.env.NEXT_PUBLIC_SMTP_ADMIN_MAIL,
      subject: "Admin sent network rewards to users " + data.emailid,
      bodyText: "Admin sent network rewards to users " + data.publickey,
      bodyHTML: htmltempate,
    });
  } catch (e) {
    //
    console.log("Failed to send verification mail ", e);
  }
};

const handler = async (req, res) => {
  try {
    if (req.method !== "POST") {
      res.status(400).json({ data: null, error: "Invalid Method" });
      return;
    }


    const schema = joi.object({
      rewardid: joi.string(),
      txhash: joi.string(),
      amountSent: joi.number(),
    });
    const { error, value } = schema.validate(schema, options);

    if (error) {
      res.status(400).json({ data: null, error: error.details[0].message });
      return;
    }

    let claimmedRewardsDetails = await networkclaimmed
      .findOne({
        _id: req.body.rewardid,
        Status: "Requested",
      })
      .populate({ path: "UserID", select: "emailid walletaddress" })
      .populate("NetworkRewardsID");

    if (!claimmedRewardsDetails) {
      res.status(400).json({ data: null, error: "Failed to update" });
      return;
    }

    //
    let updatedInDatabase = await networkclaimmed.updateOne(
      {
        _id: req.body.rewardid,
        Status: "Requested",
      },
      {
        $set: {
          TxHash: req.body.txhash,
          ValidRequest: true,
          Status: "Active",
          Amount: req.body.amountSent,
        },
      }
    );

    let networkRewardsResult = await networkRewards.updateOne(
      {
        _id: claimmedRewardsDetails.NetworkRewardsID._id,
      },
      {
        $set: {
          Status: "Claimmed",
        },
      }
    );

    res.setHeader("response-security", true);
    res
      .status(200)
      .json({
        data: await responseBodyEncryptionAdmin({
          data: "Updated Successfully",
          error: null,
        }),
        type: "adminauth",
      });

    await userclaimmednetworkrewards({
      rewardsfrom: "",
      emailid: claimmedRewardsDetails.UserID.emailid,
      publickey:
        claimmedRewardsDetails.UserID.walletaddress[
          claimmedRewardsDetails.UserID.walletaddress.length - 1
        ],
      amount: req.body.amountSent,
      purpose: "Admin sent network rewards to users",
    }).catch((error) => {
      console.log("Failed to send email ", error);
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ data: null, error: "Failed to update" });
  }
};

export default adminmiddleware(handler);
