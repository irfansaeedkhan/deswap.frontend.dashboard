const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// let autoIncrement = require('mongoose-auto-increment');

const licenceSchema = new Schema(
  {
    UserID: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    name: {
      type: String,
      required: true,
    },
    creatorAddress: {
      type: String,
      required: true,
    },
    submitedAt: {
      type: Date,
      default: Date.now,
    },
    acceptedAt: {
      type: Date,
      default: null,
    },
    activate: {
      type: Boolean,
      default: false,
    },
    signature_hash: {
      type: String,
      default: null,
    },
    licenseID: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      default: "Requested",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

// autoIncrement.initialize(mongoose.connection);
// licenceSchema.plugin(autoIncrement.plugin, { model: 'Licence', field: 'licenseID' });

module.exports =
  mongoose.models.Licence || mongoose.model("Licence", licenceSchema);
