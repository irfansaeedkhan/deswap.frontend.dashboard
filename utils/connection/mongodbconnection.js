var mongoose = require("mongoose");

const connection = {};
global.color = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  black: "\x1b[30m",
  reset: "\x1b[0m",
  blue: "\x1b[34m",
};

//
/**
 *
 *
 */
async function getMongoDBConnection() {
  try {
    //
    //
    if (connection.isConnected) {
      console.log(
        global.color.green,
        "Already connected to mongodb !!!!",
        global.color.reset
      );
      return;
    }

    //
    const mongodbConn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      family: 4,
      maxPoolSize: 450,
      connectTimeoutMS: 10000,
    });

    //
    if (mongodbConn.connect) {
      connection.isConnected = true;
      connection.dbConnection = mongodbConn;
      console.log(
        global.color.green,
        "Connected to mongodb !!!!",
        global.color.reset
      );
    } else {
      connection.isConnected = false;
      connection.dbConnection = null;
      console.log(
        global.color.red,
        "Failed to connect to DB XXXX",
        global.color.reset
      );
    }
  } catch (e) {
    console.log("Failed to connect to mongodb database : ", e);
    console.error("Failed to connect to mongodb database : ", e);
  }
}

export default getMongoDBConnection;
