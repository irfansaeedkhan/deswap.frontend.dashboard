import getMongoDBConnection from "../../../../../utils/connection/mongodbconnection";
import usermiddleware from "../../../../../middleware/usermiddleware";
import { responseBodyEncryption } from "../../../../../utils/common/jwtToken";
import company from "../../../../../models/company/company";
import catagory from "../../../../../models/company/catagory";
import companyRewardsLevel from "../../../../../models/company/rewards/rewardsLevel";
import companyRewards from "../../../../../models/company/rewards/rewards";
import upline from "../../network/upline";
import { fetchUserUpline } from "../../../../../utils/network/upline/index"
import userModel from "../../../../../models/Users";
import { checkTransaction } from "../../../../../utils/common/transactionChecking";
import { dollarToMatic } from "../../../../../utils/common/tokenconversion";
import { checkAmount } from "../../../../../utils/common/checkamount"
import ejs from "ejs";
import { resolve } from "path";
import { sendEmail } from "../../../../../utils/common/email";

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
      let pathTotemplate = await resolve("templates/email/company.ejs");
      
      //
      let htmltempate = await ejs.renderFile(pathTotemplate, {
        data
      });
  
      let result = await sendEmail({
        toAddress: process.env.NEXT_PUBLIC_SMTP_ADMIN_MAIL,
        subject: "User add company with "+data.email,
        bodyText: "User add company",
        bodyHTML: htmltempate
      });
    } catch (e) {
      //
      console.log("Failed to send verification mail ", e);
    }
}


const handler = async(req, res) => {
    try {
        if (req.method !== "POST") {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }

        //validate request
        const schema = await Joi.object({
            name: Joi.string().required(),
            username: Joi.string().required(),
            owner: Joi.string().required(),
            email: Joi.string().required(),
            address: Joi.string().required(),
            sponsor: Joi.string(),
            website: Joi.array(),
            youraddress: Joi.string().allow(null,''),
            youremail: Joi.string().allow(null,''),
            shareholders: Joi.number().required(),
            business: Joi.string().required(),
            catagoryName: Joi.string().required(),
            renewalDate: Joi.date().required(),
            expireDate: Joi.date().required(),
            employees: Joi.number().required(),
            walletaddress: Joi.string().required(),
            socialMedia: Joi.object(),
            enterdby: Joi.string(),
            logo: Joi.string().required(),
            tagline: Joi.string().required(),
            ipfSURL:Joi.string(),
            TxHash: Joi.string().required(),
            Amount: Joi.number().required(),
            AmountInMatic: Joi.number().required(),
            ConversionRate: Joi.string().allow(null,'')
        });
        const {error, value} = schema.validate(req.body, options);
        
        if (error) {
            console.log(error)
            res.status(400).json({ data: null, error: "Invalid arguments" });
            return;
        }

        if(value.youremail!=undefined){
            value.youremail = value.youremail.toLowerCase();
        }

        if(value.email!=undefined){
            value.email = value.email.toLowerCase();
        }
        

        //get mongodb connection
        await getMongoDBConnection();
        // //get catagory id
        const catagoryid = await catagory.findOne({ name: value.catagoryid });
        if (!catagoryid) {
            res.status(400).json({ data: null, error: "Invalid catagory" });
            return;
        }
        // //username validation
        const companyid = await company.findOne({
            //req.body.username is equal to username in database
            username: value.username

        });
        if (companyid) {
            res.status(400).json({ data: null, error: "Username already exists", ok: companyid });
            return;
        }

        let findUserInfo = await userModel.findOne({ _id: req.body.uuid });

        if (!findUserInfo) {
            res.status(400).json({ data: null, error: "Invalid user" });
            return;
        }

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
        let result = await company.insertMany({
            name: req.body.name,
            username: req.body.username,
            owner: req.body.owner,
            email: req.body.email,
            address: req.body.address,
            website: req.body.website,
            sponsor: req.body.sponsor || null,
            yourAddress: req.body.youraddress,
            yourEmail: req.body.youremail,
            shareHolders: req.body.shareholders,
            employees: req.body.employees,
            logo: req.body.logo,
            business: req.body.business,
            catagoryName: req.body.catagoryName,
            socialMedia: req.body.socialMedia,
            renewalDate: req.body.renewalDate,
            expireDate: req.body.expireDate,
            walletAddress: req.body.walletaddress,
            ipfSURL:req.body.ipfSURL,
            enterdBy: req.body.enterdby,
            tagline: req.body.tagline,
            catagoryId: catagoryid._id,
            TxHash:req.body.TxHash,
            Amount:req.body.Amount,
            AmountInMatic:req.body.AmountInMatic,
            CorrectAmountInMatic:correctAmountOnServer,
            TransactionValid:transactonIsValid,
            TransactionInvalidReason:transactionInValidReason,
            ConversionRate:req.body.ConversionRate,
            uuid:req.body.uuid
        });




        let amount= req.body.AmountInMatic;
        let rewardsUsers;
        const upline=await fetchUserUpline(req.body.uuid,2);
        for(let i=0;i<upline.length;i++){
            let companyRewardsData=await companyRewardsLevel.findOne({Level:i+1});
            let amountToUser=(amount*companyRewardsData.Percentage)/100;
            if(upline[i]!=null){
                await companyRewards.insertMany({
                    FromUser: req.body.uuid,
                    ToUser:upline[i].id,
                    CompanyID:result[0]._id,
                    Level:i+1,
                    Currency: "DAW",
                    TotalAmount: amount,
                    PercentageToUser:companyRewardsData.Percentage,
                    AmountToUser:amountToUser
                })
                let uplineEmail = await userModel.findOne({ _id: upline[i].id});
                rewardsUsers=uplineEmail.emailid+","
            }
            
        }

        //check if company hanve any sponsor
        // if (req.body.sponsor) {
        //     //insert company network
        //     let companyNetwork = await companyNetworkModel.insertMany({
        //         companyID: result[0]._id,
        //         sponsorCompanyID: req.body.sponsor,
        //     });
        // } else {
        //     //insert company network
        //     let companyNetwork = await companyNetworkModel.insertMany({
        //         companyID: result[0]._id,
        //         sponsorCompanyID: null,
        //     });
        // }


        const sendData={
            email:findUserInfo.emailid,
            companyName:req.body.name,
            TxHash:req.body.TxHash,
            Amount:req.body.Amount,
            AmountInMatic:req.body.AmountInMatic,
            CorrectAmountInMatic:correctAmountOnServer,
            TransactionValid:transactonIsValid,
            TransactionInvalidReason:transactionInValidReason,
            ConversionRate:req.body.ConversionRate,
            rewardsUsers:rewardsUsers
        }

        await transactionDetailsSend(sendData)

        //send response
        res.setHeader('response-security', true);
        res.status(200).json({ data: await responseBodyEncryption({ data: result }), type: "userauth" });
    } catch (error) {
        res.status(500).json({ data: null, error: error.message });
    }
};

export default  usermiddleware(handler);