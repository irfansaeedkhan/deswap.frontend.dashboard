const mongoose = require("mongoose")

const Connection = async () => {
  // connecting to mongodb atlas
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      family:4,
      maxPoolSize:450,
      connectTimeoutMS: 10000,
    });

    if (connect) {
      return console.log("connected to Mongodb atlas");
    }
  } catch (error) {
    console.log("unable to connect to ATLAS :", error.message);
  }
};

export default Connection;
