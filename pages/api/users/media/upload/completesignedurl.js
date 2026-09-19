import usermiddleware from "../../../../../middleware/usermiddleware";
import { fetchUserDownline } from "../../../../../utils/network/downline";
import { responseBodyEncryption } from "../../../../../utils/common/jwtToken";

const handler = async (req, res) => {
  try {
    res.setHeader("response-security", true);
    res.status(200).json({
      data: null,
      type: "userauth",
    });
  } catch (e) {
    console.log(e);
    res.setHeader("response-security", true);
    res.status(200).json({
      data: await responseBodyEncryption({
        data: null,
        error: "Failed to complete signed url",
      }),
      type: "userauth",
    });
  }
};

export default usermiddleware(handler);
