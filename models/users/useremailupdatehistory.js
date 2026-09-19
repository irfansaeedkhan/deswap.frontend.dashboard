const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const UsersEmailUpdateHistorySchema =  new mongoose.Schema({
    UserID:{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    CurrentEmailID:{
        type:String
    },
    NewEmailID:{
        type:String
    },
    UserDevice:{
        type: String,
    },
    UserIP:{
        type:String
    },
    Status:{
        type:String,
        default:"Active"
    }
},{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

module.exports = mongoose.models.UsersEmailUpdateHistory||mongoose.model('UsersEmailUpdateHistory',UsersEmailUpdateHistorySchema);