const mongoose = require("mongoose");

const schema = mongoose.Schema;

const CompanyRewardLevel = new schema({
    CreatedBy: {
        type: schema.Types.ObjectId,
        ref: 'Users'
    },
    Level: {
        type: Number,
    },
    Percentage:{
        type:Number
    },
    Description:{
        type:String
    },
    status: {
        type: String,
        default: "Active",
    },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.models.CompanyRewardLevel || mongoose.model("CompanyRewardLevel", CompanyRewardLevel);