import usermiddleware from "../../../../../middleware/usermiddleware";
import { fetchUserDownline } from "../../../../../utils/network/downline";
import { responseBodyEncryption } from "../../../../../utils/common/jwtToken";
import {
  createPreSignedURLPart,
  createAWSObjectName,
} from "../../../../../utils/common/amazons3";

const handler = async (req, res) => {
  try {
    let awsObjectName = await createAWSObjectName();
    awsObjectName += req;
    res.setHeader("response-security", true);
    res.status(200).json({
      data: await responseBodyEncryption({ data: null, error: null }),
      type: "userauth",
    });
  } catch (e) {
    console.log(e);
    res.setHeader("response-security", true);
    res.status(200).json({
      data: await responseBodyEncryption({
        data: null,
        error: "Failed to get signed url",
      }),
      type: "userauth",
    });
  }
};

export default usermiddleware(handler);
