const mongoose = require("mongoose")
const Schema = mongoose.Schema

//totaAmount is in BNB but totalAmountInUSD is in USD
const updateAddressFeesSchema = new Schema({
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
        ref: "User"
    }


}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })



module.exports = mongoose.models.updateAddressFees||mongoose.model('updateAddressFees',updateAddressFeesSchema);