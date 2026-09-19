const mongoose = require("mongoose");

const schema = mongoose.Schema;

const UserNFTlicenseFees = new schema(
  {
    UserID: {
      type: schema.Types.ObjectId,
      ref: "Users"
    },
    PurchasedNFTLicense: {
      type: schema.Types.ObjectId,
      ref: "UserNFTlicense"
    },
    Amount:{
      type: Number
    },
    Currency:{
      type:String
    },
    AmountInUSD:{
      type: Number
    },
    TxHash:{
      type:String
    },
    ConversionRate:{
      type:Number
    },
    Status:{
      type:String,
      default:"Active"
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.models.UserNFTlicenseFees || mongoose.model("UserNFTlicenseFees", UserNFTlicenseFees);
