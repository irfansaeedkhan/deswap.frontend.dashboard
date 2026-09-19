const mongoose = require("mongoose");
const schema = mongoose.Schema;

//
const NetworkRewardsSchema = new schema(
  {
    UserTo: {
      type: schema.Types.ObjectId,
      ref: 'Users'
    },
    UserFrom: {
      type: schema.Types.ObjectId,
      ref: 'Users'
    },
    Level: {
      type:Number,
    },
    RewardsPercentage:{
      type:Number
    },
    PurchasedPack: {
      type: schema.Types.ObjectId,
      ref: 'PurchasedPack'
    },
    Amount:{
      type:Number
    },
    Currency:{
      type:String,
      default:"USDT"
    },
    ClaimmedNetworkID:{
      type: schema.Types.ObjectId,
      ref: 'NetworkClaimmed'
    },
    Status: {
      type: String,
      default:"Active"
    }
  },
  {timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}
);

module.exports =
  mongoose.models.NetworkRewards ||
  mongoose.model("NetworkRewards", NetworkRewardsSchema);
