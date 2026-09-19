const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const UsersNetworksSchema =  new mongoose.Schema({
    uuid:{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    childuid:[{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }],
    sponsoruid:{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }
},{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

module.exports = mongoose.models.UsersNetworks||mongoose.model('UsersNetworks',UsersNetworksSchema);