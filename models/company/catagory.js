const mongoose = require("mongoose");

const schema = mongoose.Schema;

const Catagory = new schema({
    Name: {
        type: String,
    },
    Description: {
        type: String,
    },
    Status: {
        type: String,
        default: "Active"
    },

}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.models.Catagory || mongoose.model("Catagory", Catagory);