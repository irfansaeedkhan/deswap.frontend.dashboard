import Connection from "../../../../../db/db";
import userModel from "../../../../../models/Users";
import ejs from "ejs";
import { resolve } from "path";
import { sendEmail } from "../../../../../utils/common/email";
import deswapPacks from "../../../../../models/deswapPack/packdetails";
import purchasedPackFees from "../../../../../models/deswapPack/purchasingFees";
import purchasedPack from "../../../../../models/deswapPack/purchasedpack";
import usermiddleware from "../../../../../middleware/usermiddleware";
import { checkTransaction } from "../../../../../utils/common/transactionChecking";
import { responseBodyEncryption } from "../../../../../utils/common/jwtToken";
import {
  dollarToMatic,
  dollarToDeswap,
} from "../../../../../utils/common/tokenconversion";
import { checkAmount } from "../../../../../utils/common/checkamount";
import Joi from "joi";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: false,
  convert: true,
};

const sendInformationToAdmin = async (data) => {
  try {
    let pathTotemplate = await resolve(
      "templates/email/admin/packpurchased.ejs"
    );

    //
    let htmltempate = await ejs.renderFile(pathTotemplate, {
      emailid: data.emailid,
      publickey: data.publickey,
      packname: data.packname,
      quantity: data.quantity,
      txhash: data.incommingtxhash,
      amountInMatic: data.amountInMatic,
      correctAmountInMatic: data.correctAmountInMatic,
      transactionStatus: data.transactionStatus,
      IssueWithTransaction: data.IssueWithTransaction,
      percentageerror: data.percentageerror,
      purpose: data.purpose,
    });

    let result = await sendEmail({
      toAddress: process.env.NEXT_PUBLIC_SMTP_ADMIN_MAIL,
      subject: "Clamming pack purchased by user " + data.emailid,
      bodyText: "Clamming pack purchased by user " + data.publickey,
      bodyHTML: htmltempate,
    });
  } catch (e) {
    //
    console.log("Failed to send verification mail ", e);
  }
};

const handler = async (req, res) => {
  console.log("uuuuu");
  let transactonIsValid = false;
  let transactionInValidReason = "";
  let correctAmountOnServer = 0;
  try {
    //Checking wether request made is post or not
    if (req.method !== "POST") {
      res.status(400).json({ data: null, error: "Invalid Method" });
      return;
    }
    console.log("req.body");
    let insertpurchasePackValidator = await Joi.object({
      packageid: Joi.string().required(),
      quantity: Joi.string().required(),
      txhash: Joi.string().required(),
      amount: Joi.number().required(),
      totalamount: Joi.number().required(),
      amountinmatic: Joi.number().required(),
      conversionrate: Joi.number().required(),
      bonous: Joi.number().required(),
    });

    const { error, value } = insertpurchasePackValidator.validate(
      req.body,
      options
    );

    console.log("error", error);

    if (error) {
      res.status(400).json({ data: null, error: "Failed to register" });
      return;
    }
    //Connecting to database
    await Connection();

    console.log("heee");
    //Checking if quantity is less than zero then retuning request
    if (Number(req.body.quantity) < 1) {
      //
      res.status(400).json({ data: null, error: "Invalid data" });
      return;
    }

    //Fetching purchased pack details
    let packdetails = await deswapPacks.findOne({ _id: req.body.packageid });

    if (!packdetails) {
      //if pack doesnt exits then returning user data
      consolel.log("!!! Invalid request pack purchase !!! 2", req.body);
      res.status(400).json({ data: null, error: "Failed" });
      return;
    }

    //Total claming pack purchase price in USD
    let totalAmountInUSD =
      Number(packdetails.Amount) * Number(req.body.quantity);

    console.log("test");

    //Converting usd to matic
    let serverAmountInMatic = await dollarToMatic(totalAmountInUSD);

    //If not got correct response from the storage then
    if (!serverAmountInMatic.valid) {
      //
      res.status(400).json({ data: null, error: "Failed" });
      return;
    }

    //Fetching users details
    let findUserInfo = await userModel.findOne({ _id: req.body.uuid });

    //If user is not valid then returning
    if (!findUserInfo) {
      res.status(400).json({ data: null, error: "Invalid user" });
      return;
    }

    if (findUserInfo.status != "Active") {
      res.status(400).json({ data: null, error: "Invalid user" });
      return;
    }

    //Checking wether transaction is on mainnet or not and it is equal to
    let validTransaction = await checkTransaction(
      findUserInfo.walletaddress[findUserInfo.walletaddress.length - 1],
      req.body.txhash,
      serverAmountInMatic.data,
      true,
      { emailid: findUserInfo.emailid, purpose: "Purchasing clamming pack" }
    );

    if (!validTransaction.status) {
      transactonIsValid = false;
      transactionInValidReason =
        transactionInValidReason +
        " Issue with transaction public key , private key or amount Amount calculate : " +
        validTransaction.blockchainamount;
      //If transaction is not valid then set invalid request
      //res.status(400).json({ data: null, error: "Invalid transaction details"});
      //return;
    }

    if (validTransaction.transactiontimeissue) {
      transactonIsValid = false;
      transactionInValidReason +=
        " Transaction time : " +
        validTransaction.transactiontimeissuedescription;
    }

    let DeswapCheck = await checkAmount(
      validTransaction.blockchainamount,
      serverAmountInMatic.data
    );

    if (DeswapCheck.valid) {
      transactonIsValid = true;
      correctAmountOnServer = 0;
    } else {
      transactonIsValid = false;
      correctAmountOnServer = serverAmountInMatic.data;
      transactionInValidReason =
        transactionInValidReason +
        DeswapCheck.reason +
        " Amount calculated :  " +
        String(serverAmountInMatic.data) +
        " Amount from blockchain : " +
        String(validTransaction.blockchainamount) +
        " Change in percetage " +
        DeswapCheck.changeInPercentage;
    }

    //TO Fetch DAW value from the server
    let dollarToDAWPrice = await dollarToDeswap(totalAmountInUSD);

    let result = await purchasedPack.insertMany([
      {
        UserID: req.body.uuid,
        PackID: req.body.packageid,
        Quantity: req.body.quantity,
        TxHash: req.body.txhash,
        Amount: packdetails.Amount,
        TotalAmount: totalAmountInUSD,
        ConversionRate: req.body.conversionrate,
        TotalAmountInMatic: req.body.amountinmatic,
        Bonous: packdetails.Bonous,
        DAW: dollarToDAWPrice.data,
        DAWconversionRate: dollarToDAWPrice.conversionrate,
        Status: "Requested",
        TransactionValid: transactonIsValid,
        TransactionInvalidReason: transactionInValidReason,
        TotalCorrectAmountInMatic: correctAmountOnServer,
      },
    ]);

    let returnObj = result[result.length - 1];
    /*
        let updateValue = await purchasedPackFees.updateOne({ _id: req.body.purchasingfeesid },
            {
              $set: {
                PurchaseID: returnObj._id,
              },
            })*/
    console.log("Response body ", returnObj);
    res.setHeader("response-security", true);
    console.log("before status");
    res.status(200).json({
      data: await responseBodyEncryption({
        data: returnObj._id,
        error: null,
      }),
      type: "userauth",
    });

    await sendInformationToAdmin({
      emailid: findUserInfo.emailid,
      publickey:
        findUserInfo.walletaddress[findUserInfo.walletaddress.length - 1],
      packname: packdetails.PackName,
      quantity: req.body.quantity,
      incommingtxhash: req.body.txhash,
      amountInMatic: req.body.amountinmatic,
      correctAmountInMatic: correctAmountOnServer,
      transactionStatus: transactonIsValid,
      IssueWithTransaction: transactionInValidReason,
      purpose: "Pack purchased",
      percentageerror: DeswapCheck.changeInPercentage,
    }).catch((error) => {
      console.log("Failed to email ", error);
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ data: null, error: "Failed to fetch" });
  }
};

//Need to add middleware
export default usermiddleware(handler);
//export default handler;
