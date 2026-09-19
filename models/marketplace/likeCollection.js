const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeCollectionSchema = new Schema({
    UserID: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    likeCollectionID: [{
        type: String,
        required: true
    }],
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.models.LikeCollection || mongoose.model('LikeCollection', likeCollectionSchema);