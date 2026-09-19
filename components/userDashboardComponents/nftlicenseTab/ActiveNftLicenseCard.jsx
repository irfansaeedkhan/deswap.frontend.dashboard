import React, { useState } from "react";
import Image from "next/image";
import SimpleButton from "@/components/reusables/SimpleButton";
import { myRewardsDate, claimmedDate } from "../../../utils/common/date";
import {
  convertToUSD,
  convertToEuro,
} from "../../../utils/common/currencyconversion";
import { SanitizeRequestStringSync } from "../../../utils/common/sanitize";

function ActiveNftLicenseCard({
  claimRewardsFunction,
  name,
  description,
  price,
  currency,
  lockup,
  lockupinterval,
  id,
  quantity,
  purchaseddate,
  releasedate,
  claimcountdown,
  imagelocation,
  purchasedindex,
  maxindex,
}) {
  const [nftQuantityNum, setNftQuantityNum] = useState(1);

  const incrementnftQuantityNum = () => {
    setNftQuantityNum(nftQuantityNum + 1);
  };
  const decrementnftQuantityNum = () => {
    if (nftQuantityNum > 0) {
      setNftQuantityNum(nftQuantityNum - 1);
    }
  };

  return (
    <div className="ActiveNftlicenseCard" key={id}>
      <div className="licenseLogo">
        <Image
          src={SanitizeRequestStringSync(imagelocation)}
          alt="license logo"
          width="340"
          height="200"
          loading="lazy"
        />
      </div>
      <div className="licensecardcontent">
        <div className="networkPayment">
          <h3>{SanitizeRequestStringSync(name)}</h3>
          <div className="rates">
            <h5>
              <span className="usdvaluetoconvert">
                {SanitizeRequestStringSync(convertToEuro(price))}
              </span>{" "}
              {SanitizeRequestStringSync(currency)}
              <br /> ≈{" "}
              <span className="valueinmatic">
                {SanitizeRequestStringSync(price)}
              </span>{" "}
              Matic
            </h5>
            {/*<h5>{price} {currency} ≈ <span>$ {price}</span></h5>*/}
          </div>
        </div>
        <div className="description">
          <p>{SanitizeRequestStringSync(description)}</p>
        </div>
        <div className="details">
          <h3>License</h3>
          <h4>
            {SanitizeRequestStringSync(purchasedindex)} of{" "}
            {SanitizeRequestStringSync(maxindex)}
          </h4>
        </div>
        <div className="details">
          <h3>Claim Lockup</h3>
          <h4>
            {SanitizeRequestStringSync(lockup)}{" "}
            {SanitizeRequestStringSync(lockupinterval)}
          </h4>
        </div>
        <div className="details">
          <h3>Purchase On</h3>
          <h4
            className="nftLicensePurchasedDate"
            data-purchasedid={SanitizeRequestStringSync(id)}
            data-purchasedtime={SanitizeRequestStringSync(
              myRewardsDate(purchaseddate)
            )}
          >
            {SanitizeRequestStringSync(myRewardsDate(purchaseddate))}
          </h4>
        </div>
        <div className="details">
          <h3>Release Date</h3>
          <h4
            className="nftLicenseReleaseDate"
            data-purchasedid={SanitizeRequestStringSync(id)}
            data-purchasedtime={myRewardsDate(purchaseddate)}
            data-releasedate={claimmedDate(releasedate, lockup, lockupinterval)}
          >
            {claimmedDate(releasedate, lockup, lockupinterval)}
          </h4>
        </div>
        <div className="details">
          <h3>Countdown</h3>
          <h4 className="nftLicenseCountDown">
            {SanitizeRequestStringSync(claimcountdown)}
          </h4>
        </div>
      </div>
      <div className="buyButton">
        <SimpleButton
          text="Withdraw"
          backgroundColor="#E44757"
          onClick={claimRewardsFunction}
        />
      </div>
    </div>
  );
}

export default ActiveNftLicenseCard;
