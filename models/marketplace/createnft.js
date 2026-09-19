const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// let autoIncrement = require("mongoose-auto-increment");

const nftSchema = new Schema(
  {
    UserID: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    Purchased: {
      type: String,
    },
    SpecificBuyer: {
      type: String,
    },
    status: {
      type: String,
      default: "Active",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.models.NFT || mongoose.model("NFT", nftSchema);
