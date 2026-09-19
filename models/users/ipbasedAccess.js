const mongoose = require('mongoose');
var Schema = mongoose.Schema;

//
const IPBasedAccessSchema = new mongoose.Schema({
    UserID: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    AddedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    AcceptedIP: {
        type: String,
        default: ""
    },
    Blocked: {
        type: Boolean,
        default: true
    },
    IPv4: {
        type: String,
        unique: true
    },
    Description: {
        type: String,
        default: ""
    },
    ValidTill: {
        type: Date,
        default: Date.now() + 604800000
    },
    RequestedIPLocation: {
        type: String,
        default: null
    },
    Status: {
        type: String,
        default: "active"
    },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.models.IPBasedAccess || mongoose.model('IPBasedAccess', IPBasedAccessSchema);