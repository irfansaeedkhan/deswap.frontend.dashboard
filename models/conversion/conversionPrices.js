const mongoose = require("mongoose")
const schema = mongoose.Schema


const conversionPrices = new schema({
    PrimarySymbol:{
        type:String
    },
    PrimarySymbolID:{
        type:Number
    },
    Price:{
        type:Number
    },
    ConversionRate:{
        type:Number
    },
    SecondarySymbol:{
        type:String
    },
    SecondarySymbolID:{
        type:Number
    },
    Status: {
        type: String,
        default:"Active"
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

module.exports = mongoose.models.conversionPrices||mongoose.model('conversionPrices',conversionPrices);