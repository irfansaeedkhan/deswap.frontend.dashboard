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

function isDemoMode() {
  return (
    process.env.DEMO_MODE === "true" ||
    process.env.NEXT_PUBLIC_DEMO_MODE === "true"
  );
}

/**
 * Mongo connection — no-op in demo mode (client demos without a database).
 */
async function getMongoDBConnection() {
  try {
    if (isDemoMode()) {
      connection.isConnected = false;
      connection.demo = true;
      return { demo: true };
    }

    if (connection.isConnected) {
      return;
    }

    if (!process.env.MONGODB_URI) {
      console.log(
        global.color.yellow,
        "MONGODB_URI missing — skipping DB connect",
        global.color.reset
      );
      return;
    }

    const mongodbConn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      family: 4,
      maxPoolSize: 450,
      connectTimeoutMS: 10000,
    });

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
    }
  } catch (e) {
    console.error("Failed to connect to mongodb database : ", e.message);
  }
}

export default getMongoDBConnection;
