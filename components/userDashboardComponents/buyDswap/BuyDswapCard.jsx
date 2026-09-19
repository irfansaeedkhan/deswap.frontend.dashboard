import React, { useState } from "react";
import Image from "next/image";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import SimpleButton from "@/components/reusables/SimpleButton";
import Modal from "@/components/reusables/Modal";
// form validations
const schema = Joi.object({
  amount: Joi.number().required().label("amount").messages({
    "string.empty": `amount Required`,
    "any.required": `Required Field`,
  }),
});
function BuyDswapCard() {
  const { handleSubmit, register, setError, formState } = useForm({
    mode: "onChange",
    resolver: joiResolver(schema),
  });
  const [showAuthorizationContract, setShowAuthorizationContract] =
    useState(false);
  const [activeBuyBtn, setActiveBuyBtn] = useState(false);
  const [showSuccessPurchaseModal, setShowSuccessPurchaseModal] =
    useState(false);

  const AuthorizationContractModal = () => {
    setShowAuthorizationContract(true);
  };
  const AuthorizationCompleted = () => {
    setActiveBuyBtn(true);
    setShowAuthorizationContract(false);
  };
  const successfulPurchaseModal = () => {
    setShowSuccessPurchaseModal(true);
  };
  const onSubmit = (data) => {
    if (data) {
    }
  };
  return (
    <div className="bdCard">
      <div className="bdCardInner">
        <div className="bdtitle">
          <h4>Buy Deswap</h4>
        </div>
        <div className="icon">
          <Image
            src={"/images/logoicon.png"}
            width={32}
            height={32}
            alt="Deswap Logo"
            loading="lazy"
          />
        </div>
        <div className="rate">
          <h3>
            <span>--</span> DAW
          </h3>
        </div>
        <div className="rateForm">
          <p>Available : 12,000</p>
          <div className="inputPrice">
            <input
              id="amount"
              name="amount"
              type="text"
              placeholder="Enter amount"
              autoComplete="off"
              {...register("amount")}
              error={formState.errors.amount && true}
            />
            {formState.errors.amount && (
              <p>{formState.errors.amount.message}</p>
            )}
            <div className="coinInput">
              <div className="coinImage">
                <Image
                  src={"/images/usdcCoin.png"}
                  width={28}
                  height={28}
                  alt="usdcCoin Logo"
                  loading="lazy"
                />
              </div>
              <h5>USDC</h5>
            </div>
          </div>
          <h6>With Bonus --%</h6>
        </div>
        <div className="bdcardFooter">
          {activeBuyBtn ? (
            <SimpleButton
              text={"Buy"}
              backgroundColor={"#E44757"}
              color={"#FFFFFF"}
              onClick={successfulPurchaseModal}
            />
          ) : (
            <SimpleButton
              text={
                !formState.isValid ? "Enter Amount First" : "Authorize USDC"
              }
              backgroundColor={
                !formState.isValid ? "#333333" : "rgba(228, 71, 87, 0.12)"
              }
              color={!formState.isValid ? "#474747" : "#E44757"}
              disabled={!formState.isValid}
              maxWidth="28.3rem"
              onClick={AuthorizationContractModal}
            />
          )}

          <div className="footerTxt">
            <p>The Deswap will be locked In 12 Months.</p>
          </div>
        </div>
      </div>
      {/* authorization modal */}
      <Modal
        show={showAuthorizationContract}
        cross={false}
        modaltitle="Authorization Contract"
        onClose={() => setShowAuthorizationContract(false)}
      >
        <div className="contentbody">
          <div className="imgContainer">
            <div className="wallet">
              <Image
                width={1221}
                height={1221}
                src="/images/AuthorizationContract.png"
                alt={"AuthorizationContract image"}
                loading="lazy"
              />
            </div>
          </div>
          <h6>Allow deswap.in to use your USDC?</h6>
          <p>
            Confirmation of the USDC token to interact with the dswap contract.
          </p>
        </div>
        <div className="modalFooter">
          <SimpleButton
            text={"Cancel"}
            backgroundColor={"#291719"}
            color={"#E44757"}
            onClick={() => {
              setShowAuthorizationContract(false);
            }}
          />
          <SimpleButton
            text={"Authorize"}
            backgroundColor={"#E44757"}
            color={"#FFFFFF"}
            onClick={AuthorizationCompleted}
          />
        </div>
      </Modal>
      {/* sucessful purchase modal */}
      <Modal
        show={showSuccessPurchaseModal}
        cross={true}
        onClose={() => setShowSuccessPurchaseModal(false)}
      >
        <div className="contentbody">
          <div className="imgContainer">
            loading="lazy"
            <Image
              src={"/images/checkSelect.png"}
              width={65}
              height={64}
              alt="checkSelect icon"
              loading="lazy"
            />
          </div>
          <h6>Successfully</h6>
          <p>You have successfully purchased 2,500 DAW</p>
        </div>
        <div className="modalFooter">
          <SimpleButton
            text={"Go To PolygonScan"}
            backgroundColor={"rgba(228, 71, 87, 0.12)"}
            color={"#E44757"}
            onClick={() => {
              setShowSuccessPurchaseModal(false);
            }}
          />
          <SimpleButton
            text={"Back To Dashboard"}
            backgroundColor={"#E44757"}
            color={"#FFFFFF"}
            onClick={() => {
              setShowSuccessPurchaseModal(false);
            }}
          />
        </div>
      </Modal>
    </div>
  );
}

export default BuyDswapCard;
