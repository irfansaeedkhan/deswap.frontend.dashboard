const mongoose = require('mongoose');
const schema = mongoose.Schema;

const ProfilePicSchema = new mongoose.Schema({
    Name: {
        type: String
    },
    Location: {
        type: String
    },
    Status: {
        type: String,
        default: "Active"
    },
    Scale: {
        type: String
    },
    Origin: {
        type: String
    },
    UserID: {
        type: schema.Types.ObjectId,
        ref: "Users"
    },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.models.ProfilePic || mongoose.model('ProfilePic', ProfilePicSchema);
