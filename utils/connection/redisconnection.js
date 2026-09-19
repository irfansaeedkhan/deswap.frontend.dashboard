//import { Redis } from "ioredis";
var Redis = require("ioredis");

// Connect to Redis
/*
const redisClient = new Redis({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  db: process.env.REDIS_DB,
  connectTimeout: 10000,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 5,
});*/
const connection = {};

module.exports.getRedisClient = () => {
  try {
    if (connection.isConnected) {
      console.log("Already connected redis !!!!");
      return connection.redisConnection;
    }
    const redisClient = new Redis({
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      db: process.env.REDIS_DB,
      connectTimeout: 10000,
      retryStrategy: function (times) {
        if (times % 5 == 0) {
          console.log(
            "redisRetryError",
            "Redis reconnect exhausted after 3 retries."
          );
          return null;
        }

        return 200;
      },
      maxRetriesPerRequest: 25,
    });
    redisClient.on("error", (error) => {
      console.log(`Redis Error ${error}`);
    });
    redisClient.on("close", () => {
      console.log(`Redis close`);
      connection.redisConnection = false;
      connection.redisConnection = {};
    });
    connection.isConnected = true;
    connection.redisConnection = redisClient;
    return redisClient;
  } catch (error) {
    connection.isConnected = false;
    connection.redisConnection = {};
    console.log("Failed to connect to reddis : ", error);
  }
};
/*
module.exports.getRedisClient = () => redisClient;

redisClient.on("connect", () => {
  console.log("Redis client connected ");
});

redisClient.on("error", (err) => {
  console.log("Redis error: ", err);
  throw err;
});
*/
