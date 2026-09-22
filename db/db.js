const mongoose = require("mongoose");

const Connection = async () => {
  if (
    process.env.DEMO_MODE === "true" ||
    process.env.NEXT_PUBLIC_DEMO_MODE === "true"
  ) {
    return { demo: true };
  }

  if (!process.env.CONNECTION_STRING) {
    console.log("CONNECTION_STRING missing — skipping Mongo connect");
    return null;
  }

  try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      family: 4,
      maxPoolSize: 450,
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
