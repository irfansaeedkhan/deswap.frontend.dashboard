import getMongoDBConnection from "../../utils/connection/mongodbconnection.js";
import userModel from "../../models/Users";
import ejs from "ejs";
import { hash } from "bcryptjs";
import { resolve } from "path";
import { sendEmail } from "../../utils/common/email";
import { createJWTUniqueID, emailVerificationToken ,responseBodyEncryptionUnprotected} from "../../utils/common/jwtToken";
import userNetworkModal from "../../models/users/usersNetworks";
import resetpasswordModal from "../../models/password/resetpassword.js";
import userRegistrationFeesModal from "../../models/users/userRegistrationFees";
import rateLimit from "../../utils/common/rate-limit";
import Joi from "joi";
import CryptoJS from "crypto-js";
import {checkTransaction} from "../../utils/common/transactionChecking";
import {dollarToMatic} from "../../utils/common/tokenconversion";
import axios from "axios";
import {checkAmount} from "../../utils/common/checkamount"
import unprotectedmiddleware from "../../middleware/unprotectedmiddleware";
/**
 * @api {post} /api/v1/register/user Register User
 * @apiName Register User
 * @apiGroup Authentication
 * @apiVersion 1.0.0
 * @apiDescription This api is used to register user
 * @apiBody {String} email Email id of the user
 * @apiBody {String} password Password of the user
 * @apiBody {String} username Username of the user
 * @apiBody {String} [referral] Referral code of the user
 * @apiBody {String} walletaddress Wallet address of the user
 * @apiBody {String} amount Amount of the user
 * @apiBody {String} conversionrate Conversion rate of the user
 * @apiBody {String} txHash Transaction hash of the user
 * @apiBody {String} [amountInUSD] Amount in USD of the user
 * @apiExample {axios} Example usage:
 * axios.post('/api/v1/register/user', {
 *  email: "example@gmail.com",
 * password: "123456",
 * username: "example",
 * referral: "example",
 * walletaddress: "0x123456789",
 * amount: "1",
 * conversionrate: "1",
 * txHash: "0x123456789"
 * })
 * @apiSuccessExample {json} Success-Response:
 * {
 * "status": 200,
 * "data": {
 * "message": "User registered successfully",
 * }
 * }
 * @apiErrorExample {json} Error-Response:
 * {
 * "status": 400,
 * "data": {
 * "message": "User already exists",
 * }
 */
const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 10000, // Max 1000 users per second
})
const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: false,
  convert: true,
};

const sendRegisterationEmail = async (emailid) => {
  try {
    let pathTotemplate = await resolve("templates/email/registeration.ejs");
    let htmltempate = await ejs.renderFile(pathTotemplate, {
      emailID: emailid
    });
    let result = await sendEmail({
      toAddress: emailid,
      subject: "Deswap Registeration",
      bodyText: "Thank you for registering on Deswap",
      bodyHTML: htmltempate
    });

  } catch (e) {
    //
    console.log("Failed to registeration email ", e);
  }
}

const sendVerificationEmail = async (emailid, verificationEmail) => {
  try {
    let pathTotemplate = await resolve("templates/email/verification.ejs");
    let verificationurl = `${process.env.PLATFORM_URL}/verify/email/${verificationEmail}`;

    //
    let htmltempate = await ejs.renderFile(pathTotemplate, {
      url: verificationurl
    });

    let result = await sendEmail({
      toAddress: emailid,
      subject: "Verification Mail",
      bodyText: "Please Verify Email Id",
      bodyHTML: htmltempate
    });
  } catch (e) {
    //
    console.log("Failed to send verification mail ", e);
  }
}


const newUserRegisterationMailToAdmin = async (data) => {
  try {
    let pathTotemplate = await resolve("templates/email/admin/newUserRegister.ejs");
    
    //
    let htmltempate = await ejs.renderFile(pathTotemplate, {
      useremail: data.email,
      userusername:data.username,
      txhash:data.txHash,
      referral:data.referral,
      walletaddress:data.walletaddress,
      amount:data.amount,
      amountInUSD:data.amountInUSD,
      checkedAmount:data.checkedAmountMatic,
      transactionError:data.transactionError,
      percentageerror:data.percentageerror
    });

    let result = await sendEmail({
      toAddress: process.env.NEXT_PUBLIC_SMTP_ADMIN_MAIL,
      subject: "New user registered "+data.username,
      bodyText: "New user registered "+data.username,
      bodyHTML: htmltempate
    });
  } catch (e) {
    //
    console.log("Failed to send verification mail ", e);
  }
}

const createUserNetwork = async (data) => {
  try {
    let result = null;
    //
    if (data.sponsorid) {
      result = await userNetworkModal.insertMany({
        uuid: data.userid,
        sponsoruid: data.sponsorid
      });
    } else {
      //
      result = await userNetworkModal.insertMany({
        uuid: data.userid
      });
    }
    return result;
  } catch (e) {
    console.log("Failed to register ", e);
  }
}
const createNetwork = async (user, sponsor) => {
  try {

    let sponsorNetworkData = null
    //If sponsor value is passed then fetching sponsor network
    if (sponsor != null && sponsor._id != undefined) {

      //Checking whether sponsor exits in the database or not
      sponsorNetworkData = await userNetworkModal.findOne({
        uuid: sponsor._id
      });

      //If sponsor network does not exits then creating sponsor network
      if (sponsorNetworkData == null || sponsorNetworkData == undefined) {
        //Sponsor doesn't exists need to create sponsor but without sponsor id
        //TO DO : Inform admin about the same via mail or message because we dont know about wether user have sponspor or not
        sponsorNetworkData = await createUserNetwork({ userid: sponsor._id });
        sponsorNetworkData = sponsorNetworkData["0"];
      }
    }

    //Checking wether newly register user have sponsored user or not
    let userNetworkData;
    if (sponsor == null) {
      //Registering user without sponsor because user doesnt have sponsor id
      userNetworkData = await createUserNetwork({ userid: user._id });
    } else {
      //Registering user with sponsor because user have sponsor id
      userNetworkData = await createUserNetwork({ userid: user._id, sponsorid: sponsor._id });
    }


    //Checking whether sponsor is provided or not
    if (sponsor == null) {
      //If sponsonr is not provided then returning and not need to update the sponsor
      return;
    }

    //Sponsor is provided so fetching its network
    sponsorNetworkData = await userNetworkModal.findOne({
      uuid: sponsor._id
    });

    //Checking wether referral is added in sponsor id or not.

    if (sponsorNetworkData.childuid.includes(userNetworkData._id)) {
      //User id is already added so returning no need to update
      return;
    }

    //Checking if filed is empty or it have already exitsing data
    if (sponsorNetworkData.childuid.length < 1) {
      //
      sponsorNetworkData.childuid = [];
    }

    //Pushing User ID
    await sponsorNetworkData.childuid.push(user._id);

    await userNetworkModal.updateOne(
      {
        uuid: sponsorNetworkData.uuid
      },
      {
        $set: {
          childuid: sponsorNetworkData.childuid
        },
      }
    );

  } catch (e) {
    console.log("Failed to created network : ", e);
  }
}

/**
 * Fucntion for handling register request.
 * Check input parameters
 * Checks user is already registered or not
 *  
 */
const handler = async (req, res) => {
  await getMongoDBConnection()
  let checkedAmountMatic = 0;
  let invalidTransactionError = "";
  let percentageChange = 0;


  const { username, email, walletaddress, txHash, referral, amount, conversionrate, amountInUSD } = req.body;

  try {

    await limiter.check(res, 200, 'CACHE_TOKEN')

    if (req.method !== 'POST') {
      res.status(400).json({ data: null, error: "Invalid Method" });
      return;
    }

    const re = /^([a-z0-9\.-]{2,25})@([a-z\d]{2,20})\.([a-z\.-]{2,8})(\.[a-z]{2,8})?$/;
    const oneletteronenumberonechacter = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;


    //username, email, walletaddress, txHash, referral
    let registerValidator = await Joi.object({
      username: Joi.string().required(),
      email: Joi.string().trim().email().regex(re).required().messages({
        "string.pattern.base": `Invalid email id. Only - . special characters allowed , 0-9 and alphabat`
      }),
      password: Joi.string().regex(oneletteronenumberonechacter).trim().min(8).required().messages({
        "string.pattern.base": `Password must have at one character, one number and one special character`
      }),
      referral: Joi.string().trim().allow("").optional(),
      walletaddress: Joi.string().trim().required(),
      amount: Joi.number().required(),
      conversionrate: Joi.number().required(),
      txHash: Joi.string().trim().required(),
      amountInUSD: Joi.number().optional(),
    });

    const { error, value } = registerValidator.validate(req.body, options);

    if (error) {
      console.log(error)
      res.status(400).json({ data: null, error: "Failed to register" });
      return;
    }

    value.email = value.email.toLowerCase();

    req.body = value;

    //Connecting to mongodb database
    // await getMongoDBConnection();
    let registerationCheckingResult = await axios.get(`${process.env.NEXT_PUBLIC_MailVerificationlink}${req.body.email}`).catch((checkerror)=>{
      console.log(checkerror.response.data.message)
    })

    if(registerationCheckingResult && registerationCheckingResult.data!=undefined){
      if(!registerationCheckingResult.data){
        res.status(400).json({ data: null, error: "Invalid email id" });
        return
      }

      if((registerationCheckingResult.data)&&(registerationCheckingResult.data.disposable==true)){
        res.status(400).json({ data: null, error: "Invalid email id" });
        return;
      }
        
    }else{
      res.status(400).json({ data: null, error: "Invalid email id" });
      return;
    }

    //Checking sponsor
    let sponsorUser = null;
    let amountInDollar = 18;
    if (req.body.referral.trim() != "") {
      //Fetching sponsor details from the database
      sponsorUser = await userModel.findOne({ uuid: req.body.referral });
      amountInDollar = 9;


      //If sponsor value will be null means not valid sponsor
      if (sponsorUser == null) {
        res.status(400).json({ data: null, error: "Invalid sponsor" });
        return;
      }
    }


    let dollarToMaticValue = await dollarToMatic(amountInDollar);


    let transactionValid = false;
    //Checking valid transaction
    let validTransaction = await checkTransaction(req.body.walletaddress,req.body.txHash, amount, true, {purpose:"Registeration page checking",emailid:req.body.email})

    if(!validTransaction.status){
      transactionValid = false;
      invalidTransactionError = invalidTransactionError+'Please check may be invalid transaction. Kindly check transaction is on mainnet. '
      
    }else{
      transactionValid = true;
    }

    let MaticChecked = await checkAmount(req.body.amount, dollarToMaticValue.data)

    if(MaticChecked.valid){
        //Amount is valid
        transactionValid = true
        checkedAmountMatic = req.body.amount
        //transactionissue = ""
    }else{
        transactionValid = false
        checkedAmountMatic = dollarToMaticValue.data
        percentageChange = MaticChecked.changeInPercentage
        invalidTransactionError = invalidTransactionError+"  "+MaticChecked.reason+" Amount sent from the browser to server : "+String(req.body.amount)+" Amount fetched on server using cmc api : "+String(dollarToMaticValue.data)+". Percentage change in amount values : "+String(MaticChecked.changeInPercentage)
    }

    //
    //Checking whether user is already registerd or not platform
    let userInfo = await userModel.findOne({ emailid: req.body.email });
    //If user is registered on platform then returning response
    if (userInfo !== null) {

      res.status(400).json({ data: null, error: "User already registered" });
      return;
    }

    //Checking whether user is already registerd or not platform
    let userWithPublicKey = await userModel.findOne({ walletaddress: req.body.walletaddress });
    if (userWithPublicKey !== null) {
      res.status(400).json({ data: null, error: "User already registered with public key" });
      return;
    }

    //Hashing password
    let hashPassword = await hash(req.body.password, 10);


    let useruniqueid = await createJWTUniqueID(15);


    //Inserting user detail in the database
    let databaseinsertion = null
   try {
    databaseinsertion  = await userModel.insertMany([
      {
        username: req.body.username,
        emailid: req.body.email,
        password: hashPassword,
        role: "User",
        uuid: useruniqueid,
        walletaddress: req.body.walletaddress,
        amount,
        conversionrate,
        transactionVerified:transactionValid,
      }
    ]);

   } catch (error) {
      console.log("error is ",error)     
   }
    if (databaseinsertion == null || databaseinsertion[0] == undefined) {
      res.setHeader('response-security', true)
      res.status(200).json({data:await responseBodyEncryptionUnprotected({ data: "Failed to register", error: null }),type:"noauth"});
      return;
    }

    //Creating network of the user
    await createNetwork(databaseinsertion[0], sponsorUser);

    let userRegisterationFeesResult = await userRegistrationFeesModal.insertMany([
      {
        uuid: databaseinsertion[0]._id,
        publicKey: req.body.publicAddress,
        totalAmount: req.body.amount,
        conversionrate: req.body.conversionrate,
        txHash: req.body.txHash,
        totalAmountInUSD: req.body.amountInUSD,
        correctAmountInMatic:checkedAmountMatic,
        invalidTransactionReason:invalidTransactionError,
        validTransaction:transactionValid,
        percentageChangeError:percentageChange,
      }
    ]);
    res.setHeader('response-security', true)
    res.status(200).json({data:await responseBodyEncryptionUnprotected({ data: "Success", error: null }), type:"noauth"});

    let verificationUniqueID = await createJWTUniqueID(10);

    let hashValue = await emailVerificationToken({ uuid: databaseinsertion[0].uuid, hash: verificationUniqueID, type: "EmailVerification" });

    let encryptedKey = await CryptoJS.AES.encrypt(hashValue, process.env.EMAIL_VERIFICATION_SECRET_KEY).toString();

    let encodeHashValue = await encodeURIComponent(encryptedKey);

    //Store verification token in the database
    await resetpasswordModal.insertMany([{
      uid: databaseinsertion[0].uuid,
      tokenhash: verificationUniqueID,
      tokenType: "EmailVerification"
    }]).catch(console.error);

    //TO DO : Uncomment when doing live
    await sendRegisterationEmail(req.body.email).catch(console.error);

    //
    await sendVerificationEmail(req.body.email, encodeHashValue).catch(console.error);

    await newUserRegisterationMailToAdmin({
      email:req.body.email,
      username:req.body.username,
      txHash:req.body.txHash,
      referral:req.body.referral,
      walletaddress:req.body.walletaddress,
      amount:req.body.amount,
      amountInUSD:req.body.amountInUSD,
      checkedAmount:checkedAmountMatic,
      transactionError:invalidTransactionError,
      percentageerror:percentageChange
    }).catch(console.error);

  } catch (e) {
    console.log(e);
    res.status(400).json({ data: null, error: "Failed to register" });
    return
  }
}

export default unprotectedmiddleware(handler);
