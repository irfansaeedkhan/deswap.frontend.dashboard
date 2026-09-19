import React from "react";
import Image from "next/image";
import SimpleButton from "@/components/reusables/SimpleButton";

function PackListCard({ imgPlaceholder, authorizeUSDCfunction, Details }) {
  return (
    <div className="PackListCard">
      <div className="PackListCardcontent">
        <div className="PackListPayment">
          <h3>Staking Pack</h3>
          <div className="rates">
            <h6>{Details.ntr} USDC</h6>
            <h5>$ {Details.rateDollor}</h5>
          </div>
        </div>
        <div className="levels">
          <h5>Daily Percentage</h5>
          <h6>{Details.per}</h6>
        </div>
        <div className="levels">
          <h5>Daily Profit</h5>
          <h6>{Details.dailyprofit} USDC</h6>
        </div>
        <div className="levels">
          <h5>Claim Lockup</h5>
          <h6>{Details.claim}</h6>
        </div>
        <div className="levels">
          <h5>Duration</h5>
          <h6>{Details.duration}</h6>
        </div>
      </div>
      <div className="buyButton">
        <SimpleButton
          text="Authorize USDC"
          backgroundColor="#E44757"
          padding="padding: 1.5rem 2rem"
          onClick={authorizeUSDCfunction}
        />
      </div>
    </div>
  );
}

export default PackListCard;
