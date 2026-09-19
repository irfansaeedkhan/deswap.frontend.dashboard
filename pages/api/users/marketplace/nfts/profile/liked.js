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
    let likeCollectionValidator = await Joi.object({
      collectionIDs: Joi.array().optional(),
    });
    const { error, value } = likeCollectionValidator.validate(
      req.body,
      options
    );
    if (error) {
      console.log(error);
      res.status(400).json({ data: null, error: "Failed to like collection" });
      return;
    }

    await getMongoDBConnection();
    if (req.body.skip == undefined) {
      req.body.skip = 0;
    }

    if (req.body.limit == undefined) {
      req.body.limit = 10;
    }

    if (req.body.limit > 50) {
      req.body.limit = 10;
    }
    req.body.uuid = "62b41dd3caeac12c4d929426";
    //get current user wallet address
    console.log("Fetching collection from the database");
    const data = await LikeNFT.aggregate([
      {
        $match: {
          UserID: new mongoose.Types.ObjectId(req.body.uuid),
        },
      },
      {
        $project: {
          likeNFTID: 1,
        },
      },
      {
        $unwind: "$likeNFTID",
      },
      {
        $skip: req.body.skip,
      },
      {
        $limit: req.body.limit,
      },
    ]);
    res.setHeader("response-security", true);
    res.status(200).json({
      data: await responseBodyEncryption({
        data: data,
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
