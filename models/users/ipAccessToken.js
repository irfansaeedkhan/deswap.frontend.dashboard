const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const IPAccessToken = new mongoose.Schema({
    ip: {
        type: Schema.Types.ObjectId,
        ref: 'IPBasedAccess'
    },
    Token: {
        type: String,
        unique: true
    },
    Expires: {
        type: Date,
        default: Date.now() + 1000 * 60 * 10
    },
    Status:{
        type:String,
        default:"active"
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });


module.exports = mongoose.models.IPAccessToken || mongoose.model('IPAccessToken', IPAccessToken);