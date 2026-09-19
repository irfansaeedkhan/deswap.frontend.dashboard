const mongoose = require("mongoose");
const schema = mongoose.Schema;

const PackDetailsSchema = new schema(
  {
    PackName: {
      type: String,
    },
    Amount: {
      type: Number
    },
    Currency: {
      type: String,
      default: "USDT"
    },
    LockedPeriod:{
      type:Number
    },
    LockedPeriodType:{
      type:String,
      default:"months"
    },
    Bonous:{
      type:Number,
    },
    DAW:{
      type:Number,
      default:0
    },
    Status: {
      type: String,
      default:"Active"
    }
  },
  {timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}
);

module.exports = mongoose.models.PackDetails || mongoose.model("PackDetails", PackDetailsSchema);




                