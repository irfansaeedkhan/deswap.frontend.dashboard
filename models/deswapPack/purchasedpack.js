const mongoose = require("mongoose");
const schema = mongoose.Schema;

//Inprogress -> Requested for clamming
//Active -> User pruchased it
//Claimmed -> User claimmed the pack
//Requested -> Show admin and user as requested
//Deactive -> Doesn't show to user only to admin
const PurchasedPackSchema = new schema(
  {
    UserID: {
      type: schema.Types.ObjectId,
      ref: 'Users'
    },
    PackID: {
      type: schema.Types.ObjectId,
      ref: 'PackDetails'
    },
    PurchasingFeesID: {
      type: schema.Types.ObjectId,
      ref: 'PurchasingFees'
    },
    ClaimmedID:{
      type: schema.Types.ObjectId,
      ref: 'PackClaimmed'
    },
    Quantity: {
      type:Number,
      default:1
    },
    TxHash: {
      type:String,
      unique:true
    },
    Amount: {
      type:Number
    },
    TotalAmount: {
      type:Number
    },
    Currency: {
      type:String,
      default:"USDC"
    },
    TotalAmountInMatic:{
      type:Number
    },
    TotalCorrectAmountInMatic:{
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
    DAWconversionRate:{
      type:Number
    },
    Bonous:{
      type:Number
    },
    DAW:{
      type:Number
    },
    Status: {
      type: String,
      default:"Active"
    }
  },
  {timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}
);

module.exports =
  mongoose.models.PurchasedPack ||
  mongoose.model("PurchasedPack", PurchasedPackSchema);
