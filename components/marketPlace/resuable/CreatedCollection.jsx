import React, { useState, useEffect } from "react";
import { HeartIcon, TickIcon } from "@/components/marketPlace/MarketIcons";
import Image from "next/image";

function CreatedCollection({ cardDetails }) {
  return (
    <div className="collectionCard">
      <div className="cardTop">
        <Image
          src={cardDetails.coverImage}
          alt="Picture of the author"
          width={500}
          height={500}
          loading="lazy"
        />
        <div className="heartImg">
          <HeartIcon />
        </div>
      </div>
      <div className="cardBottom">
        <div className="topContent">
          <h5>{cardDetails.name}</h5>
          <div className="author">
            <h6>
              <span>By </span> John_wiker
              <TickIcon />
            </h6>
            <button>New</button>
          </div>
        </div>
        <div className="bottomContent">
          <h5> {cardDetails.description}</h5>
        </div>
      </div>
    </div>
  );
}

export default CreatedCollection;
