import { getRedisClient } from "../../utils/connection/redisconnection";

const handler = async (req, res) => {
  try {
    console.log("!!!! Handler ");
    let getRedis = await getRedisClient();
    console.log(getRedis);

    res.status(200).json({
      data: null,
      error: "Invalid token or token expired",
      success: false,
    });
  } catch (e) {
    console.log("XXXX Redis ", e);
    res.status(200).json({
      data: null,
      error: "Invalid token or token expired",
      success: false,
    });
  }
};
export default handler;
