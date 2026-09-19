const mongoose = require("mongoose");
const schema = mongoose.Schema;

//Deactivate ->Not show to user
//Rejected -> Rejected by user
//Claimmed -> User claimmed rewards
//Requested -> 
const NetworkClaimmedSchema = new schema(
  {
    UserID: {
      type: schema.Types.ObjectId,
      ref: 'Users'
    },
    PackID: {
      type: schema.Types.ObjectId,
      ref: 'PackDetails'
    },
    NetworkRewardsID: {
      type: schema.Types.ObjectId,
      ref: 'NetworkRewards'
    },
    TxHash: {
      type:String,
    },
    PublicAddress:{
      type:String
    },
    Amount: {
      type:Number
    },
    AmountInUSD: {
      type:Number
    },
    Currency: {
      type:String,
      default:"USDT"
    },
    ValidRequest:{
      type:Boolean,
      default:true
    },
    RejectedOn:{
      type:Date,
      default:null
    },
    RejectReason:{
      type:String,
      default:""
    },
    Status: {
      type: String,
      default:"Active"
    }
  },
  {timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}
);

module.exports =
  mongoose.models.NetworkClaimmed ||
  mongoose.model("NetworkClaimmed", NetworkClaimmedSchema);
