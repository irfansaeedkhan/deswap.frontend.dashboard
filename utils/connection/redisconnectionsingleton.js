var Redis = require("ioredis");
class RedisConnection {
  static connection = null;
  constructor() {
    console.log("Checking connection");
    if (connection) {
      console.log("Connection exits so returning it");
      return connection;
    }
    console.log("connection doest exits so connecting it to the redis");
    this.connectToRedis();
    return redisClient;
  }
  connectToRedis() {
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
    console.log("Connected to the redis");
    this.connection = redisClient;
  }
}
module.exports.RedisConnection = RedisConnection;
