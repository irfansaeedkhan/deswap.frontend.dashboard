const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeNFTSchema = new Schema({
    UserID: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    likeNFTID: [{
        type: String,
        required: true
    }],
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.models.LikeNFT || mongoose.model('LikeNFT', likeNFTSchema);