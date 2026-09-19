import usermiddleware from "../../../../../middleware/usermiddleware";
import { fetchUserDownline } from "../../../../../utils/network/downline";
import { responseBodyEncryption } from "../../../../../utils/common/jwtToken";
import {
  createAWSObjectName,
  createPresignedPost,
} from "../../../../../utils/common/amazons3";

const handler = async (req, res) => {
  try {
    console.log("\n!!!! Creating AWS : ", createAWSObjectName);
    console.log("Request data : ", req.query);
    const filename = req.query.filename;
    if (!filename) {
      res.setHeader("response-security", true);
      res.status(200).json({
        data: await responseBodyEncryption({ data: null, error: null }),
        type: "userauth",
      });
      return;
    }

    const contentType = mime.getType(filename);

    if (!["image/png", "image/jpeg", "image/jpg"].includes(contentType)) {
      res.setHeader("response-security", true);
      res.status(200).json({
        data: await responseBodyEncryption({ data: null, error: null }),
        type: "userauth",
      });
      return;
    }

    const ext = path.extname(filename);

    let awsObjectName = await createAWSObjectName();
    awsObjectName += req;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Expires: 60,
      Conditions: [
        { acl: "public-read" },
        ["content-length-range", 5000, 5000000], // 5KB - 5MB
        { "Content-Type": contentType },
      ],
      Fields: {
        key: objectName,
        acl: "public-read",
        "Content-Type": contentType,
      },
    };

    const presignedPostData = await createPresignedPost(params);

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
