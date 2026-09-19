const mongoose = require("mongoose");
const crypto = require("crypto");

const schema = mongoose.Schema;

const Users = new schema(
  {
    username: {
      type: String,
      unique: true,
    },
    emailid: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    walletaddress: [
      {
        type: String,
      },
    ],
    txHash: {
      type: String,
    },
    role: {
      type: String,
      default: "User",
    },
    nanoid: {
      type: String,
    },
    amount: {
      type: Number,
    },
    conversionrate: {
      type: Number,
    },
    uuid: {
      type: String,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: Number,
    },
    verificatioCodeExpiration: {
      type: Date,
    },
    resetToken: {
      type: String,
    },
    resetHashExpiration: {
      type: Date,
    },
    lastpasswordOn: {
      type: Date,
    },
    status: {
      type: String,
      default: "Active",
    },
    transactionVerified: {
      type: Boolean,
      default: true,
    },
    informedMagement: {
      type: Boolean,
      default: false,
    },
    disableReason: {
      type: String,
      default: "",
    },
    maxfailedLoginAttemps: {
      type: Number,
      default: 0,
      max: 6,
    },
    marketPlaceBio: {
      type: String,
      default: "",
    },
    social_twitter: {
      type: String,
      default: "",
    },
    social_facebook: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

Users.methods.verification = function () {
  let randomNumber = Math.random();
  randomNumber = randomNumber.toString();
  let randomNumbers = parseInt(randomNumber.split(".")[1].substring(0, 6));

  if (randomNumbers < 100000) {
    randomNumbers = randomNumbers + 100000;
  }
  this.verificationCode = randomNumbers;
  this.verificatioCodeExpiration = Date.now() + 60000 * 10;

  return randomNumbers;
};

Users.methods.passwordReset = function () {
  let token = crypto.randomBytes(32).toString("hex");

  const resetToken = crypto.createHash("sha256").update(token).digest("hex");

  this.resetToken = resetToken;
  this.resetHashExpiration = Date.now() + 60000 * 10;

  return token;
};

//module.exports = mongoose.models.registered || mongoose.model("registered", registrations);

module.exports = mongoose.models.Users || mongoose.model("Users", Users);
