const mongoose = require('mongoose');

const UserVerificationTokensSchema =  new mongoose.Schema({
    uid:{
        type: String,
        required: true
    },
    tokenhash:{
        type: String,
        required: true
    },
    tokenType:{
        type:String,
        required: true
    }
},{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

module.exports = mongoose.models.UserVerificationTokens||mongoose.model('UserVerificationTokens',UserVerificationTokensSchema);