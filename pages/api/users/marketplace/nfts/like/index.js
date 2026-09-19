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
      nftID: Joi.string().trim().required(),
    });
    const { error, value } = likeNFTValidator.validate(
      req.body,
      options
    );
    if (error) {
      console.log(error);
      res.status(400).json({ data: null, error: "Failed to like nft" });
      return;
    }

    await getMongoDBConnection();
    //get current user wallet address

    const data = await LikeNFT.findOne({ likeNFTID: req.body.nftID });

    console.log("data",data);

    if(data){
      let likeNft = await LikeNFT.updateOne(
        {
          UserID: req.body.uuid,
        },
        {
          $pull: {
            likeNFTID: req.body.nftID,
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

    const like = await LikeNFT.findOne({ UserID: req.body.uuid });

    console.log("like",like)

    if (like) {
      let likeNFT = await LikeNFT.updateOne(
        {
          UserID: req.body.uuid,
        },
        {
          $push: {
            likeNFTID: req.body.nftID,
          },
        }
      );
    }else{
      let likeCollection = await LikeNFT.insertMany([{
        UserID: req.body.uuid,
        likeNFTID: req.body.nftID
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
