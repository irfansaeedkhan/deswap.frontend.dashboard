const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const UsersSessionSchema = new mongoose.Schema(
  {
    uuid: { type: Schema.Types.ObjectId, ref: "Users" },
    clientAgent: {
      type: String,
      require: true,
    },
    deviceID: {
      type: String,
      required: false,
    },

    ipv6: {
      type: String,
    },

    refreshToken: {
      type: String,
      required: true,
    },
    refreshTokenExpiryDate: {
      type: Date,
      required: true,
    },
    jwtTokenUuid: {
      type: String,
      required: true,
    },
    Country: {
      type: String,
    },
    state_city:{
      type:String,
    },
    Status: {
      type: String,
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

UsersSessionSchema.index(
  {
    jwtTokenUuid: 1,
  },
  {
    unique: true,
  }
);

module.exports =
  mongoose.models.UsersSession ||
  mongoose.model("UsersSession", UsersSessionSchema);
