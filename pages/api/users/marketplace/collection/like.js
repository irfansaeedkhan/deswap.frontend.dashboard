import getMongoDBConnection from "../../../../../utils/connection/mongodbconnection";
import usermiddleware from "../../../../../middleware/usermiddleware";
import Users from "../../../../../models/Users";
import { responseBodyEncryption } from "../../../../../utils/common/jwtToken";
import LikeCollection from "../../../../../models/marketplace/likeCollection";
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
      collectionID: Joi.string().trim().required(),
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
    //get current user wallet address

    const data = await LikeCollection.findOne({ likeCollectionID: req.body.collectionID });

    console.log("data",data);

    if(data){
      let likeCollection = await LikeCollection.updateOne(
        {
          UserID: req.body.uuid,
        },
        {
          $pull: {
            likeCollectionID: req.body.collectionID,
          },
        }
      );
      res.setHeader("response-security", true);
      return res
        .status(200)
        .json({
          data: await responseBodyEncryption({ data: "successfully unlike", error: null }),
          type: "userauth",
        });
    }

    const like = await LikeCollection.findOne({ UserID: req.body.uuid });

    console.log("like",like)

    if (like) {
      let likeCollection = await LikeCollection.updateOne(
        {
          UserID: req.body.uuid,
        },
        {
          $push: {
            likeCollectionID: req.body.collectionID,
          },
        }
      );
    }else{
      let likeCollection = await LikeCollection.insertMany([{
        UserID: req.body.uuid,
        likeCollectionID: req.body.collectionID
      }])
    }

    res.setHeader("response-security", true);
    res
      .status(200)
      .json({
        data: await responseBodyEncryption({ data: "successfully like", error: null }),
        type: "userauth",
      });
  } catch (error) {
    console.log(error);
    res.status(400).json({ data: null, error: "Failed to like " });
    return;
  }
};

export default usermiddleware(handler);
