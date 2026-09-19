const mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Amount will be in NTR and amountInBNB be usd
const TransactionToUserSchema =  new mongoose.Schema({
    UserTo:{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    UserToPublicKey:{
        type:String
    },
    amount : {
        type:Number
    },
    currency:{
        type:String
    },
    Description:{
        type:String
    },
    Status:{
        type:String,
        default:"Active"
    },
},{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

module.exports = mongoose.models.TransactionToUser||mongoose.model('TransactionToUser',UserTransactionSchema);