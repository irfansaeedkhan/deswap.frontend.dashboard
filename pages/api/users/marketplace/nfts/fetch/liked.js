import mongoose from "mongoose";
import getMongoDBConnection from "../../../../../../utils/connection/mongodbconnection";
import usermiddleware from "../../../../../../middleware/usermiddleware";
import Users from "../../../../../../models/Users";
import { responseBodyEncryption } from "../../../../../../utils/common/jwtToken";
import LikeNFT from "../../../../../../models/marketplace/likenft";
import Joi from "joi";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: false,
  convert: true,
};

const handler = async (req, res) => {
  try {
    //check if request is post
    console.log("hello");
    if (req.method !== "POST") {
      res.status(400).json({ data: null, error: "Invalid Method" });
      return;
    }
    //validate request body
    let likeNFTValidator = await Joi.object({
      collectionIDs: Joi.array().optional(),
    });
    const { error, value } = likeNFTValidator.validate(
      req.body,
      options
    );
    if (error) {
      console.log(error);
      res.status(400).json({ data: null, error: "Failed to like collection" });
      return;
    }

    await getMongoDBConnection();
    //get current user wallet address
    const data = await LikeNFT.aggregate([
      {
        $match: {
          UserID: new mongoose.Types.ObjectId("62b41dd3caeac12c4d929426"),
        },
      },
      {
        $unwind: "$likeNFTID",
      },
      {
        $match: {
          likeNFTID: { $in: req.body.data },
        },
      },
      {
        $project: {
          _id: 1,
          likeNFTID: 1,
        },
      },
      {
        $group: {
          _id: "$_id",
          likeNFTID: {
            $push: "$likeNFTID",
          },
        },
      },
    ]);

    let returnValue = [];
    if (data[data.length - 1].likeNFTID) {
      returnValue = data[data.length - 1].likeNFTID;
    }
    res.setHeader("response-security", true);
    res.status(200).json({
      data: await responseBodyEncryption({
        data: returnValue,
        error: null,
      }),
      type: "userauth",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ data: null, error: "Failed to like " });
    return;
  }
};

export default handler;
//export default usermiddleware(handler);
