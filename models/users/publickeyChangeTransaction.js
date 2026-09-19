const mongoose = require("mongoose");

const schema = mongoose.Schema;

const PublicKeyChangeTransaction = new schema({
    uuid: {
        type: schema.Types.ObjectId,
        ref: "Users"
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
    Status: {
        type: String,
        default: "Requested"
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.models.PublicKeyChangeTransaction || mongoose.model("PublicKeyChangeTransaction", PublicKeyChangeTransaction);