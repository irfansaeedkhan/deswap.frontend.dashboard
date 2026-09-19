const mongoose = require("mongoose");
const schema = mongoose.Schema;

const NetworkRewardsSettingSchema = new schema(
  {
    Level: {
        type:Number,
    },
    Percentage:{
        type:Number
    },
    Status: {
      type: String,
      default:"Active"
    }
  },
  {timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}
);

module.exports =
  mongoose.models.NetworkRewardsSetting ||
  mongoose.model("NetworkRewardsSetting", NetworkRewardsSettingSchema);
