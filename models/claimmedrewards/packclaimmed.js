const mongoose = require("mongoose");
const schema = mongoose.Schema;

//Rejected =>Rejected by admin
//Deactive => User will not
//Active =>
//Requested => User claimmed
const PackClaimmedSchema = new schema(
  {
    UserID: {
      type: schema.Types.ObjectId,
      ref: 'Users'
    },
    PackID: {
      type: schema.Types.ObjectId,
      ref: 'PackDetails'
    },
    PurchasedPack: {
      type: schema.Types.ObjectId,
      ref: 'PurchasedPack'
    },
    TxHash: {
      type:String,
    },
    PublicAddress:{
      type:String
    },
    AmountWithoutBonous:{
      type:Number,
      default:0
    },
    BonousAmount:{
      type:Number,
      default:0
    },
    Amount: {
      type:Number
    },
    Currency: {
      type:String,
      default:"USDT"
    },
    RejectedOn:{
      type:Date,
      default:null
    },
    RejectReason:{
      type:String,
      default:""
    },
    Status: {
      type: String,
      default:"Active"
    }
  },
  {timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}
);

module.exports =
  mongoose.models.PackClaimmed ||
  mongoose.model("PackClaimmed", PackClaimmedSchema);


  // "PackID": {    "$oid": "621dc7a75993c2195d381155"  },
  // "PurchasedPack": {    "$oid": "622b16196c1a4f4dc9fa62c3"  },
  // "TxHash": "dd45x123",
  // "PublicAddress": "dd1234545x123",
  // "Amount": 2,
  // "Currency": "Deswap",
  // "Status": "Claimmed",
  // "created_at": {    "$date": "2022-03-11T11:46:27.878Z"  }

  

  // "__v": 0,
  // "created_at": {    "$date": "2022-03-11T11:46:27.878Z"  },
  // "updated_at": {    "$date": "2022-04-15T11:49:30.746Z"  },
  // "ClaimmedNetworkID": {    "$oid": "62595bca1b6aeace33758e0f"  }