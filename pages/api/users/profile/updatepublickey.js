import getMongoDBConnection from "../../../../utils/connection/mongodbconnection";
import usermiddleware from "../../../../middleware/usermiddleware";
import { responseBodyEncryption } from "../../../../utils/common/jwtToken";
import publickeyChangeTransaction from "../../../../models/users/publickeyChangeTransaction";
import userModel from "../../../../models/Users";
import { checkTransaction } from "../../../../utils/common/transactionChecking";
import { dollarToMatic } from "../../../../utils/common/tokenconversion";
import { checkAmount } from "../../../../utils/common/checkamount"
import ejs from "ejs";
import { resolve } from "path";
import { sendEmail } from "../../../../utils/common/email";

const Joi = require("joi");
/**
 * @api {post} /api/users/company/insert Insert Company
 * @apiName InsertCompany
 * @apiPermission User
 * @apiGroup User/Company
 * @apiVersion 1.0.0
 * @apiDescription Insert Company
 * @apiBody {String} name name of company
 * @apiBody {String} username username of company
 * @apiBody {String} owner owner of company
 * @apiBody {String} email email of company
 * @apiBody {String} address address of company
 * @apiBody {Array} website website of company
 * @apiBody {String} youraddress your address 
 * @apiBody {String} youremail your email
 * @apiBody {Number} shareholders  shareholders of company
 * @apiBody {Number} business business of company
 * @apiBody {String} catagoryName catagory of company
 * @apiBody {Date} renewalDate renewal date of company
 * @apiBody {Date} expireDate   expire date of company
 * @apiBody {Number} employees employees of company
 * @apiBody {String} walletaddress wallet address of company
 * @apiBody {Object} socialMedia social media of company
 * @apiBody {String} enterdby entered by
 * @apiBody {String} logo logo of company
 * @apiBody {String} tagline tagline of company
 * 
 * @apiExample {axios} Example usage:
 * axios.post('/api/users/company/insert', {
 *   "name": "test35675",
 *   "username": "test99999999",
 *   "owner": "test",
 *   "email": "test",
 *   "address": "test",
 *   "website": [
 *       "https://abc.com",
 *       "https://abc.com"
 *   ],
 *   "sponsor" : "62909f0d6544ad33ba4f23c3",
 *   "youraddress": "test",
 *   "youremail": "test",
 *   "shareholders": 1,
 *   "employees": 1,
 *   "walletaddress": "test",
 *   "enterdby": "test",
 *   "business" : "nft artist",
 *   "catagoryName": "jadi",
 *   "socialMedia": {
 *       "facebook": "https://facebook.com/algioalliance"
 *   },
 *   "renewalDate": "2-5-2022",
 *   "expireDate" : "2-4-2025",
 *   "tagline": "test",
 *   "catagoryid": "628dfa6a962f7ba6abe68e72",
 *   "logo": "logo.png"
 * })
 * 
 */

const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: false,
    convert: true,
};


const transactionDetailsSend = async (data) => {
    try {
        let pathTotemplate = await resolve("templates/email/publickey.ejs");

        //
        let htmltempate = await ejs.renderFile(pathTotemplate, {
            data
        });

        let result = await sendEmail({
            toAddress: data.email,
            subject: "Update your public key",
            bodyText: "",
            bodyHTML: htmltempate
        });
    } catch (e) {
        //
        console.log("Failed to send verification mail ", e);
    }
}


const handler = async (req, res) => {
    try {
        if (req.method !== "POST") {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }
        
        //validate request
        const schema = await Joi.object({
            TxHash: Joi.string().required(),
            Amount: Joi.number().required(),
            AmountInMatic: Joi.number().required(),
            ConversionRate: Joi.string().required(),
            publickey: Joi.string().required()
        });
        const { error, value } = schema.validate(req.body, options);

        if (error) {
            res.status(400).json({ data: null, error: "Invalid arguments" });
            return;
        }

        //get mongodb connection
        await getMongoDBConnection();
        
        let findUserInfo = await userModel.findOne({ _id: req.body.uuid });

        if (!findUserInfo) {
            res.status(400).json({ data: null, error: "Invalid user" });
            return;
        }

        if (findUserInfo.status != "Active") {
            res.status(400).json({ data: null, error: "Invalid user" });
            return;
          }
      
          if(!findUserInfo.emailVerified){
            res.status(400).json({ data: null,error:"Email not verified"});
            return;
        }


        let userpublicKeyArray = findUserInfo.walletaddress;
        userpublicKeyArray.push(req.body.publickey);

    
        let results = await userModel.updateOne(
          { _id: req.body.uuid },
          {
            $set: {
                walletaddress: userpublicKeyArray,
            },
          }
        );
        let licensePriceUSD = await dollarToMatic(req.body.Amount);

        if (!licensePriceUSD.valid) {
            res.status(400).json({ data: null, error: "Invalid Price" });
            return
        }



        let transactonIsValid = false;
        let transactionInValidReason = "";
        let correctAmountOnServer = 0;

        let validTransaction = await checkTransaction(findUserInfo.walletaddress[findUserInfo.walletaddress.length - 1], req.body.TxHash, licensePriceUSD.data, true, { purpose: "Deswap License purchase", emailid: findUserInfo.emailid })


        if (!validTransaction.status) {
            transactonIsValid = false;
            transactionInValidReason = transactionInValidReason + " Their is issue with transaction please check public key , private key and amount calculated : " + validTransaction.blockchainamount
        }


        let DeswapCheck = await checkAmount(validTransaction.blockchainamount, licensePriceUSD.data)

        if (DeswapCheck.valid) {
            transactonIsValid = true
        } else {
            transactonIsValid = false
            correctAmountOnServer = licensePriceUSD.data
            transactionInValidReason = transactionInValidReason + DeswapCheck.reason + " Amount calculated :  " + String(licensePriceUSD.data) + " Amount from blockchain : " + String(validTransaction.blockchainamount) + " Change in percetage " + DeswapCheck.changeInPercentage;
        }


        //websites array 
        //return res.status(200).json({ data: validresult.value, type: "userauth" });
        //insert company
        let result = await publickeyChangeTransaction.insertMany({
            TxHash: req.body.TxHash,
            Amount: req.body.Amount,
            AmountInMatic: req.body.AmountInMatic,
            CorrectAmountInMatic: correctAmountOnServer,
            TransactionValid: transactonIsValid,
            TransactionInvalidReason: transactionInValidReason,
            ConversionRate: req.body.ConversionRate,
            uuid: req.body.uuid
        });



        const sendData = {
            email: findUserInfo.emailid,
            publickey:req.body.publickey
        }

        await transactionDetailsSend(sendData)

        //send response
        res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryption({ data: result }), type: "userauth" });
    } catch (error) {
        res.status(500).json({ data: null, error: error.message });
    }
};

export default usermiddleware(handler);