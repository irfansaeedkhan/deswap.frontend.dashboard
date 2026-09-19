const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CompanyNetworkSchema = new Schema({
    companyID: {
        type: Schema.Types.ObjectId,
        ref: "Company",
    },
    chaildCompanyID: {
        type: Schema.Types.ObjectId,
        ref: "Company",
    },
    sponsorCompanyID: {
        type: Schema.Types.ObjectId,
        ref: "Company",
    },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.models.CompanyNetwork || mongoose.model("CompanyNetwork", CompanyNetworkSchema);