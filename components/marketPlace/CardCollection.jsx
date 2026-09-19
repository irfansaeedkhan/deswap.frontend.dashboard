import React from "react";
import Image from "next/image";
import {
  HeartIcon,
  EmptyHeartIcon,
  TickIcon,
} from "@/components/marketPlace/MarketIcons";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { encryptRequestBody } from "@/utils/common/jwtToken";

function CardCollection({ cardData, likes }) {
  const [description, setDescription] = useState();
  const [imageLink, setImageLink] = useState();
  const [like, setLike] = useState(likes);

  const router = useRouter();

  useEffect(() => {
    console.log("cardData", cardData);
    fetchIPFSData(cardData._uri);
  }, [cardData]);

  const fetchIPFSData = async (uri) => {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_IPFS_URL +
        "/ipfs/" +
        uri.split("/")[uri.split("/").length - 1]
    );
    console.log("res--", response.data);
    setDescription(response?.data?.description);
    setImageLink(
      process.env.NEXT_PUBLIC_IPFS_URL +
        "/ipfs/" +
        response?.data?.coverImage.split("/")[
          response?.data?.coverImage.split("/").length - 1
        ]
    );
    return response.data;
  };
  console.log("imageLink", imageLink);
  const myLoader = ({ src, width, quality }) => {
    return `${imageLink}?w=420&q=${quality || 75}`;
  };
  //console.log("cardData:::::", cardData);

  const likeButton = async (collectionID) => {
    try {
      console.log("collectionID", collectionID);
      let encryptionData = await encryptRequestBody({
        collectionID: collectionID,
      });
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/marketplace/collection/like`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      console.log("result", result.data.data);
      if (result.data.data == "successfully like") {
        setLike(true);
      } else {
        setLike(false);
      }
    } catch (e) {
      console.log("error", e);
    }
  };
  useEffect(() => {
    console.log("like", like);
  }, [like]);
  return (
    <div className="collectionCard" key={cardData?.id}>
      <div className="cardTop">
        <Image
          loader={myLoader}
          src={imageLink}
          alt="Picture of the author"
          width={500}
          height={500}
          loading="lazy"
        />
        <div className="heartImg" onClick={() => likeButton(cardData?.id)}>
          {like ? <EmptyHeartIcon className="redHeart" /> : <EmptyHeartIcon />}
        </div>
      </div>
      <div className="cardBottom">
        <div className="topContent">
          <h5>{cardData?._collectionName}</h5>
          <div className="author">
            <h6>
              <span>By </span> {cardData?.by}
              <TickIcon />
            </h6>
            <button>New</button>
          </div>
        </div>
        <div className="bottomContent">
          <h5> {description}</h5>
        </div>
      </div>
      <div className="bottomBtn ">
        <button
          className="SimpleButton btnHoverEffectOutline"
          onClick={() => {
            router.push(`/market/collection/${cardData?._collection}`);
          }}
        >
          View Collection
        </button>
      </div>
    </div>
  );
}

export default CardCollection;
