const mongoose = require("mongoose")
const Schema = mongoose.Schema

//totaAmount is in BNB but totalAmountInUSD is in USD
const userRegistrationFeesSchema = new Schema({
    txHash:{
        type: String,
        required: true
    },
    publicKey: {
        type: String,
        requried: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    totalAmountInUSD:{
        type:Number
    },
    conversionrate: {
        type: String,
        requried: true
    },
    uuid: {
        type: Schema.Types.ObjectId,
        ref: "Users"
    },
    validTransaction:{
        type:Boolean,
        default:true
    },
    correctAmountInMatic:{
        type:Number,
        default:0
    },
    correctConversionRate:{
        type:Number,
        default:0
    },
    percentageChangeError:{
        type:Number,
        default:0
    },
    invalidTransactionReason:{
        type:String,
        default:""
    },
    RejectedOn:{
        type:Date
    },
    RejectReason:{
        type:String
    },
    status:{
        type:String,
        default:"Requested"
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })



module.exports = mongoose.models.userRegistrationFees||mongoose.model('userRegistrationFees',userRegistrationFeesSchema);