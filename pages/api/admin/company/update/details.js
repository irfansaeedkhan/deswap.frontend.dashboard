import getMongoDBConnection from "../../../../../utils/connection/mongodbconnection";
import Users from "../../../../../models/Users";
import Company from "../../../../../models/company/company";
import adminmiddleware from "../../../../../middleware/adminmiddleware";
import { responseBodyEncryptionAdmin } from "../../../../../utils/common/jwtToken";
import joi from "joi";
import ejs from "ejs";
import { resolve } from "path";
import { sendEmail } from "../../../../../utils/common/email";
import CompanyFeeRequested from "@/components/adminDashboardComponents/companyfee/CompanyFeeRequested";

const informAdminAboutStatusUpdate = async (emaildata) => {
  try {
    let tDate = new Date();

    let utcDate = tDate.toUTCString();

    let pathTotemplate = await resolve(
      "templates/email/admin/transactionRequestUpdated.ejs"
    );

    let htmltempate = await ejs.renderFile(pathTotemplate, {
      publickey: emaildata.publickey,
      errortime: utcDate,
      amount: emaildata.amount,
      emailid: emaildata.emailid,
      purpose: emaildata.purpose,
      incommingtxhash: emaildata.incommingtxhash,
      claimid: emaildata.claimid,
      rejectreason: emaildata.rejectreason,
      status: emaildata.status,
    });

    let result = await sendEmail({
      toAddress: process.env.NEXT_PUBLIC_SMTP_ADMIN_MAIL,
      subject: "Status update " + emaildata.publickey + " " + emaildata.purpose,
      bodyText:
        "Status update " +
        emaildata.publickey +
        " amount : " +
        emaildata.amount +
        " DAW",
      bodyHTML: htmltempate,
    });
  } catch (e) {
    console.log("!!!! Failed to send email", emaildata);
  }
};

const handler = async (req, res) => {
  try {
    if (req.method !== "POST") {
      res.status(400).json({ data: null, error: "Invalid Method" });
      return;
    }

    await getMongoDBConnection();

    let checkTransactionExists = await Company.findOne({
      _id: req.body.claimid,
      status: "Requested",
    }).populate({ path: "uuid", select: "emailid walletaddress" });

    if (!checkTransactionExists) {
      res.status(400).json({ data: null, error: "Invalid request" });
      return;
    }

    let updateObject = {};
    if (req.body.requestStatus == "Rejected") {
      updateObject.requestRejectedOn = new Date();
      updateObject.requestRejectIssueDescription = req.body.rejectReason;
      updateObject.status = req.body.requestStatus;
    } else if (req.body.requestStatus != "") {
      updateObject.requestRejectedOn = null;
      updateObject.status = req.body.requestStatus;
    }

    if (req.body.transactionStatus != "") {
      if (
        req.body.transactionStatus == "true" ||
        req.body.transactionStatus == true
      ) {
        //
        updateObject.TransactionValid = true;
      } else {
        //
        updateObject.TransactionValid = false;
      }
    }

    updateObject.updatedBy = req.body.uuid;
    await Company.updateOne(
      {
        _id: req.body.claimid,
      },
      {
        $set: updateObject,
      }
    );
    await informAdminAboutStatusUpdate({
      publickey:
        checkTransactionExists.uuid.walletaddress[
          checkTransactionExists.uuid.walletaddress.length - 1
        ],
      emailid: checkTransactionExists.uuid.emailid,
      purpose: "Admin company fee updated",
      status: req.body.requestStatus,
      rejectreason: req.body.rejectReason,
      claimid: req.body.claimid,
      amount: checkTransactionExists.amountInDeswap,
    }).catch((error) => {
      console.log("Failed to send mail", error);
    });

    res.setHeader("response-security", true);
    res.status(200).json({
      data: await responseBodyEncryptionAdmin({
        data: "Success",
        error: null,
      }),
      type: "adminauth",
    });
  } catch (e) {
    console.log("Error while fetching requested ", e);
    res.status(400).json({ data: null, error: "Failed to update" });
  }
};

export default adminmiddleware(handler);
