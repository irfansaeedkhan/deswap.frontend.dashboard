const mongoose = require("mongoose");

const schema = mongoose.Schema;

const UserNFTlicense = new schema(
  {
    UserID: {
        type: schema.Types.ObjectId,
        ref: "Users"
    },
    Amount:{
        type: Number
    },
    TotalAmount:{
      type:Number
    },
    Currency:{
        type:String
    },
    TxHash:{
        type:String
    },
    Quantity:{
      type:Number
    },
    NftLicense:{
        type: schema.Types.ObjectId,
        ref:"NFTlicense"
    },
    RejectedOn:{
      type:Date,
      default:null
    },
    RejectReason:{
      type:String,
      default:""
    },
    TotalAmountInMatic:{
      type:Number
    },
    IssuewithTransaction:{
      type:String,
      default:""
    },
    TransactionValid:{
      type:Boolean,
      default:true
    },
    CorrectTotalMatic:{
      type:Number,
      default:0
    },
    ConversionRate:{
      type:Number
    },
    NftLicenseFees:{
      type: schema.Types.ObjectId,
      ref:"UserNFTlicenseFees"
    },
    Status:{
      type:String,
      default:"Active"
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.models.UserNFTlicense || mongoose.model("UserNFTlicense", UserNFTlicense);
