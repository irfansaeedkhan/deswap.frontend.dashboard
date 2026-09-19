const mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Amount will be in USD and amountInBNB be usd
const UserClaminedFeesSchema = new mongoose.Schema({
    UserID: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    ClaimID: {
        type: Schema.Types.ObjectId,
        ref: 'CoinPackageClaimedRewards'
    },
    Amount: {
        type: Number
    },
    conversionRate: {
        type: Number
    },
    amountInBNB: {
        type: Number
    },
    TxHash: {
        type: String
    },
    Status: {
        type: String,
        default: "Active"
    },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.models.UserClaminedFees || mongoose.model('UserClaminedFees', UserClaminedFeesSchema);