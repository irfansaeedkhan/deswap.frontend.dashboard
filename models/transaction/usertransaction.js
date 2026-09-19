const mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Amount will be in NTR and amountInBNB be usd
//Status
// Active -> Transfered
// Requested -> User paid the Matic but admin need to send DAW
// Rejected -> Transaction rejecred by Admin and added description
// Deactive -> Don't show to user show to admin only
const UserTransactionSchema =  new mongoose.Schema({
    UserTo:{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    UserToPublicKey:{
        type:String
    },
    amountInDeswap : {
        type:Number
    },
    correctAmountInDeswap:{
        type:Number
    },
    conversionRate:{
        type:Number
    },
    amountInMatic:{
        type:Number
    },
    correctAmountInMatic:{
        type:Number
    },
    IncommingTxHash:{
        type:String,
        unique:true
    },
    OutgoingTxHash:{
        type:String
    },
    TransactionValid:{
        type:Boolean,
        default:true
    },
    informedAdmin:{
        type:Boolean,
        default:false
    },
    transactionIssueDescription:{
        type:String
    },
    requestRejectedOn:{
        type:Date
    },
    requestRejectIssueDescription:{
        type:String
    },
    updatedBy:[{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }],
    Status:{
        type:String,
        default:"Active"
    },
},{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

module.exports = mongoose.models.UserTransaction||mongoose.model('UserTransaction',UserTransactionSchema);