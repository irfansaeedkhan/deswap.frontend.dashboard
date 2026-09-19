import React, { useState } from "react";
import Image from "next/image";
import SimpleButton from "@/components/reusables/SimpleButton";
import {
  convertToUSD,
  convertToEuro,
} from "../../../utils/common/currencyconversion";
import { SanitizeRequestStringSync } from "../../../utils/common/sanitize";

function NftLicenseCard({
  imgPlaceholder,
  authorizedButton,
  name,
  description,
  price,
  currency,
  lockup,
  lockupinterval,
  id,
  maxlicense,
  currentIndex,
  nftPurchaseModalFunc,
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
    <div className="NftlicenseCard" key={id}>
      {imgPlaceholder?.includes("/") ? (
        <div className="licenseLogo">
          <Image
            src={SanitizeRequestStringSync(imgPlaceholder)}
            alt="license logo"
            width="340"
            height="200"
            loading="lazy"
          />
        </div>
      ) : (
        <div
          className="imgboxContainer"
          style={{
            width: "100%",
            position: "relative",
            padding: "14px 0 10px 0",
          }}
        >
          <h6
            style={{
              color: "#e44757",
              fontWeight: "600",
              fontSize: "12px",
              position: "absolute",
              top: "0",
              left: "0",
            }}
          >
            License Image Not Found
          </h6>
          <Image
            src={"/nodata.png"}
            width="340"
            height="200"
            alt="license logo"
            loading="lazy"
          />
        </div>
      )}

      <div className="licensecardcontent">
        <div className="networkPayment">
          <h3>{name}</h3>
          <div className="rates">
            <h5>
              <span className="usdvaluetoconvert">
                {SanitizeRequestStringSync(convertToEuro(price))}
              </span>{" "}
              {SanitizeRequestStringSync(currency)} <br /> ≈{" "}
              <span className="valueinmatic">
                {SanitizeRequestStringSync(price)}
              </span>{" "}
              Matic
            </h5>
          </div>
        </div>
        <div className="description">
          <p>{SanitizeRequestStringSync(description)}</p>
        </div>
        <div className="quantity">
          <h3>License</h3>
          <div className="quantityInputContainer">
            {SanitizeRequestStringSync(currentIndex)} of{" "}
            {SanitizeRequestStringSync(maxlicense)}
          </div>
          {/*<div className="quantityInputContainer">
          <div class="counter">
      <button onClick={incrementnftQuantityNum} class="counter--arrow-inc"><span>Increase</span></button>
        <input type="number" autoComplete="off" class="counter--output" min="1" value={nftQuantityNum}/>
      <button onClick={decrementnftQuantityNum} class="counter--arrow-dec"><span>Decrease</span></button>
    </div>
  </div>*/}
        </div>
        <div className="ClaimLockup">
          <h3>Claim Lockup</h3>
          <h4>
            {SanitizeRequestStringSync(lockup)}{" "}
            {SanitizeRequestStringSync(lockupinterval)}
          </h4>
        </div>
      </div>
      <div className="buyButton">
        <SimpleButton
          text="Purchase NFT"
          backgroundColor="#E44757"
          id={SanitizeRequestStringSync(id)}
          // onClick={(targete) => {
          //   authorizedButton({
          //     id: id,
          //     currency: currency,
          //     price: price,
          //     targete: targete,
          //     nftQuantityNum: nftQuantityNum,
          //   });
          // }}
          onClick={() => {
            nftPurchaseModalFunc();
          }}
        />
      </div>
    </div>
  );
}

export default NftLicenseCard;
