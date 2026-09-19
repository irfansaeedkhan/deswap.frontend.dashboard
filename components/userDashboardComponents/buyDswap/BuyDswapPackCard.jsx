import React from "react";
import Image from "next/image";
import SimpleButton from "@/components/reusables/SimpleButton";
import {
  convertToUSD,
  convertToEuro,
  convertToEuroWithoutPrecision,
} from "../../../utils/common/currencyconversion";
function BuyDswapPackCard({
  title,
  daw,
  price,
  bonus,
  lockedperiod,
  lockedperiodtype,
  authorizedButton,
  id,
}) {
  return (
    <div className="bdCardPack">
      <div className="bdCardInner">
        <div className="bdtitle">
          <h4>{title}</h4>
        </div>
        <div className="icon">
          <Image
            src={"/images/logoicon.png"}
            width={32}
            height={32}
            alt="logoicon Logo"
            loading="lazy"
          />
        </div>
        <div className="rate">
          <h3>
            <span className="usdtodaw" data-price={price}>
              {daw}
            </span>{" "}
            DAW
          </h3>
        </div>
        <div className="rateForm">
          <h2>Buy $ {convertToEuro(price)}</h2>
          <h6>With Bonus {Number(bonus).toFixed(2)} %</h6>
        </div>
        <div className="bdcardFooter">
          <SimpleButton
            text="Authorize Matic"
            color="#E44757"
            backgroundColor="rgba(228, 71, 87, 0.12)"
            maxWidth="28.3rem"
            onClick={(targete) =>
              authorizedButton({
                id: id,
                amount: price,
                targete: targete,
                title: title,
                bonous: bonus,
              })
            }
          />
          <div className="footerTxt">
            <p>
              * The Deswap will be locked in {lockedperiod} {lockedperiodtype}.
            </p>
            <p>
              * Tokens purchased with BONUS are subject to 12 months of Lockup.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuyDswapPackCard;
