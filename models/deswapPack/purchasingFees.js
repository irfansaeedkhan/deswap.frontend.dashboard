const mongoose = require("mongoose");
const schema = mongoose.Schema;

const PurchasingFees = new schema(
  {
    UserID: {
        type: schema.Types.ObjectId,
        ref: 'Users'
    },
    PackID: {
        type: schema.Types.ObjectId,
        ref: 'PackDetails' 
    },
    PurchaseID:{
        type: schema.Types.ObjectId,
        ref:'PurchasedPack'
    },
    FeesUSD:{
        type:Number
    },
    Fees:{
        type:Number
    },
    Currency:{
        type:String
    },
    ConversionRate:{
        type:Number
    },
    TxHash:{
        type:String
    },
    Status: {
        type: String,
        default:"Active"
    }
  },
  {timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}
);

module.exports =
  mongoose.models.PurchasingFees ||
  mongoose.model("PurchasingFees", PurchasingFees);
