const mongoose = require("mongoose");

const schema = mongoose.Schema;

const NFTlicense = new schema(
  {
    Name: {
      type: String,
    },
    Description:{
        type: String,
    },
    Price : {
        type: Number
    },
    Currency : {
        type: String
    },
    LookUp: {
        type: Number 
    },
    LookUpInterval: {
        type: String
    },
    Image:{
      type:String
    },
    Index:{
      type:Number,
      unique:true
    },
    status:{
      type:String,
      default:"Active"
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.models.NFTlicense || mongoose.model("NFTlicense", NFTlicense);
