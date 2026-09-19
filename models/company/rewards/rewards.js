const mongoose = require("mongoose");

const schema = mongoose.Schema;

const CompanyReward = new schema({
    FromUser: {
        type: schema.Types.ObjectId,
        ref: "Users",
    },
    ToUser: {
        type: schema.Types.ObjectId,
        ref: "Users",
    },
    CompanyID: {
        type: schema.Types.ObjectId,
        ref: "Company",
    },
    Level: {
        type: Number,
    },
    Currency: {
        type: String,
    },
    TotalAmount: {
        type: Number,
    },
    PercentageToUser:{
        type:Number
    },
    AmountToUser:{
        type:Number
    },
    status: {
        type: String,
        default: "Requested",
    },
    requestRejectedOn:{
        type:Date
    },
    requestRejectIssueDescription:{
        type:String
    },
    updatedBy:{
        type: schema.Types.ObjectId,
        ref: "Users"
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.models.CompanyReward || mongoose.model("CompanyReward", CompanyReward);