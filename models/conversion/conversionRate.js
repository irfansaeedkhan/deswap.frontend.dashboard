const mongoose = require("mongoose")
const schema = mongoose.Schema


const conversionRate = new schema({
    PriceInUSD:{
        type:Number
    },
    ID:{
        type:Number
    },
    Symbol:{
        type:String
    },
    Status: {
        type: String,
        default:"Active"
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

module.exports = mongoose.models.conversionRate||mongoose.model('conversionRate',conversionRate);