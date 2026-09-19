import React from "react";
import SimpleButton from "@/components/reusables/SimpleButton";
import {convertToEuro} from "../../../utils/common/currencyconversion.js"
import {myRewardsDate,claimmedDate} from "../../../utils/common/date";

function ActivatedPackListCard({claimRewardsFunction, name, price, currency, lockup, lockupinterval, id, quantity, purchaseddate, releasedate, claimcountdown, bonous, daw, status}) {
  let buttonText = status=="Active"? "Claim":"Claimmed"
  return (
    <div className="ActivatedPackListCard">
      <div className="ActivatedPackListCardcontent">
        <div className="ActivatedPackListPayment">
          <h3>{name}</h3>
          <div className="rates">
            <h6>{currency} <span className="usdvaluetoconvert">{convertToEuro(price)}</span><br/></h6>
            <h5>Matic <span className="valueinmatic">{convertToEuro(price)}</span></h5>
          </div>
        </div>
        <div className="levels">
          <h5>Bonous</h5>
          <h6>{Number(bonous).toFixed(2)} %</h6>
        </div>
        <div className="levels">
          <h5>Claim Lockup Duration</h5>
          <h6>{lockup} {lockupinterval}</h6>
        </div>
        <div className="levels">
          <h5>Quantity</h5>
          <h6 className="nftlicenseQuantity">{quantity}</h6>
        </div>
        <div className="levels">
          <h5 >Purchased On</h5>
          <h6 className="nftLicensePurchasedDate" data-purchasedid={id} data-bonous={bonous} data-price={price} data-currency={currency} data-daw={daw} data-purchasedtime={myRewardsDate(purchaseddate)}>{myRewardsDate(purchaseddate)}</h6>
        </div>
        <div className="levels">
          <h5>Release Date</h5>
          <h6 className="nftLicenseReleaseDate" data-purchasedid={id} data-bonous={bonous} data-price={price} data-currency={currency} data-daw={daw} data-purchasedtime={myRewardsDate(purchaseddate)} data-releasedate={claimmedDate(releasedate, lockup, lockupinterval)}>{claimmedDate(releasedate, lockup, lockupinterval)}</h6>
        </div>
        <div className="levels">
          <h5>Countdown</h5>
          <h6 className="nftLicenseCountDown">{claimcountdown}</h6>
        </div>
        <div className="greyline"></div>
        <div className="earned">
          <h5>Earned</h5>
          <div className="earnedContainer">
              <h4> <span id={id+"_earnedusdc"}>0</span>  DAW</h4>
              <h4>  $ <span id={id+"_earnedmatic"}>0</span></h4>
          </div>
        </div>
      </div>
      <div className="buyButton">
        <SimpleButton
          text={buttonText}
          backgroundColor="#E44757"
          padding="padding: 1.5rem 2rem"
          onClick={()=>{claimRewardsFunction({packid:id})}}
        />
      </div>
    </div>
  );
}

export default ActivatedPackListCard;
