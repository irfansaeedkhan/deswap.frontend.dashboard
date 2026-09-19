const mongoose = require("mongoose");

const schema = mongoose.Schema;

const Company = new schema({
    uuid: {
        type: schema.Types.ObjectId,
        ref: "Users"
    },
    name: {
        type: String,
    },

    username: {
        type: String,
        unique: true,
    },
    owner: {
        type: String,
    },
    email: {
        type: String,
    },
    address: {
        type: String,
    },
    //array of websites
    website: [{
        type: String,
    }],
    sponsor: {
        type: schema.Types.ObjectId,
        ref: "Company",
    },
    yourAddress: {
        type: String,
    },
    yourEmail: {
        type: String,
    },
    shareHolders: {
        type: Number,
    },
    employees: {
        type: Number,
    },
    logo: {
        type: String,
    },
    walletAddress: {
        type: String,
    },
    enterdBy: {
        type: String,
    },
    tagline: {
        type: String,
    },
    business: {
        type: String,
    },
    catagoryName: {
        type: String,
    },
    //renual date
    renewalDate: {
        type: Date,
    },
    //expire date
    expireDate: {
        type: Date,
    },
    //object of social media
    socialMedia: {
        type: Object,
    },
    //cataegory from catagory.js
    catagoryId: {
        type: schema.Types.ObjectId,
        ref: "Catagory",
        strictPopulate: true,
    },
    
    ipfSURL:{
        type:String
    },
    TxHash: {
        type:String,
        unique:true
      },
      Amount: {
        type:Number
      },
      AmountInMatic:{
        type:Number
      },
      CorrectAmountInMatic:{
        type:Number,
        default:0
      },
      TransactionValid:{
        type:Boolean,
        default:true
      },
      requestRejectedOn:{
        type:Date,
        default:null
      },
      TransactionInvalidReason:{
        type:String,
        default:""
      },
      ConversionRate:{
        type:Number
      },
      requestRejectIssueDescription:{
        type:String
      },
    "status": {
        type: String,
        default: "Requested"
    }

}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });




module.exports = mongoose.models.Company || mongoose.model("Company", Company);