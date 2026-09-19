import React, { useState } from "react";
import PackListCard from "./PackListCard";
import networklicense1 from "@/assets/images/dashboard/networklicense1.png";
import Modal from "@/components/reusables/Modal";
import warning from "@/assets/images/dashboard/icons/warning.png";
import checkSelect from "@/assets/images/dashboard/icons/checkSelect.png";
import Image from "next/image";
import SimpleButton from "@/components/reusables/SimpleButton";

function PackListTab() {
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
  const [showWalletConnectMessage, setShowWalletConnectMessage] =
    useState(false);
  const authorizeUSDCfunction = () => {
    setShowWalletConnectMessage(true);
  };

  const StackingPackDetails = {
    ntr: 500,
    rateDollor: 4660,
    per: 0.16,
    dailyprofit: "0,8",
    claim: "Unlimited",
    duration: "Lifetime",
  };

  return (
    <>
      <div className="PackListCardList">
        <PackListCard
          Details={StackingPackDetails}
          authorizeUSDCfunction={AuthorizationContractModal}
        />
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
                alt={"deswap image"}
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
            <Image src={checkSelect} alt="checkSelect icon" loading="lazy" />
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
      {/* wallect connect message modal */}
      <Modal
        show={showWalletConnectMessage}
        onClose={() => setShowWalletConnectMessage(false)}
      >
        <div className="modalcontentSuccess modalWithImage">
          <div className="topImage">
            <div className="wallet">
              <Image
                width={1221}
                height={1221}
                src="/images/Connectwallet.png"
                alt={"deswap image"}
                loading="lazy"
              />
            </div>
          </div>
          <div className="contentbox">
            <h5>Wallet Not Connected</h5>
            <p>Please Connect To Wallet Using Connect Button</p>
            <button
              className="modalBtn btnHoverEffectOutline"
              onClick={() => {
                setShowWalletConnectMessage(false);
              }}
            >
              Ok
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default PackListTab;
