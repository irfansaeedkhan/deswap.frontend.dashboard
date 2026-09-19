const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// let autoIncrement = require("mongoose-auto-increment");

const notificationSchema = new Schema(
  {
    UserID: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    id:{
      type: String,
    },
    type:{
      type: String,
    },
    for:{
      type: Schema.Types.ObjectId,
    },
    by:{
      type: Schema.Types.ObjectId,
    },
    status: {
      type: String,
      default: "Active",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.models.Notifcation || mongoose.model("Notifcation", notificationSchema);
