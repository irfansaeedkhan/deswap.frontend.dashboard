import React, { useState, useEffect } from "react";
import ActivatedPackListCard from "./ActivatedPackListCard";
import axios from "../../../utils/common/axios";
import { encryptRequestBody } from "@/utils/common/jwtToken";
import NodataCard from "@/components/reusables/NodataCard";
import BootstrapModal from "@/components/reusables/BootstrapModal";
import Image from "next/image";
import FailedToFetchData from "@/components/reusables/FailedToFetchData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ActivatedPackListTab() {
  const [show, setShow] = useState(false);
  //Modal header
  const [modalheader, setModalHeader] = useState("Connect Wallet");
  const [connectionStatus, setconnectionStatus] = useState(false);

  const [modalbody, setModalBody] = useState(null);
  const [modalfooter, setModalFooter] = useState(null);

  const [showWalletConnectMessage, setShowWalletConnectMessage] =
    useState(false);
  const [purchasedNFTCard, setpurchasedNFTCard] = useState(null);

  const ClaimPack = async (clamingdata) => {
    try {
      await setShow(true);
      await setModalHeader("Claim rewards");
      await setModalBody(
        <div className="modalcontentSuccess modalWithImage">
          <div className="topImage">
            <div className="wallet">
              <Image
                width={1221}
                height={1221}
                src="/images/Transactions.png"
                alt={"deswap image"}
                loading="lazy"
              />
            </div>
          </div>
          <div className="contentbox">
            <h5>Claiming Rewards</h5>
            <p>Please Don't Refresh/Close Page.</p>
          </div>
        </div>
      );
      await setModalFooter(
        <div className="cointainer-fluid AuthorizationModalBtnContainer">
          <div className="row">
            <div className="col-sm-6 offset-3 offset-sm-3 mx-auto">
              <button
                className="modalcancelbutton secondaryRedBtn greyBackBtns bg-green-500 SimpleButton btnHoverEffectOutline"
                onClick={closeConnectButtonClick}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      );
      let encryptionData = await encryptRequestBody({
        packid: clamingdata.packid,
      });
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/pack/claim`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      await setShow(true);
      await setModalHeader("Success");
      await setModalBody(
        <div className="row text-center">
          <div className="col-sm-12"></div>
          <div className="col-sm-12">
            <p className="modalpurchasebody2">Claimed rewards</p>
          </div>
        </div>
      );
      await setModalFooter(
        <div className="cointainer-fluid AuthorizationModalBtnContainer">
          <div className="row">
            <div className="col-sm-6 offset-3 offset-sm-3 mx-auto">
              <button
                className="modalcancelbutton secondaryRedBtn greyBackBtns bg-green-500 SimpleButton btnHoverEffectOutline"
                onClick={closeConnectButtonClick}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      );
    } catch (e) {
      // toast.error(e.message, {
      //   position: "top-center",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   });

      await setShow(true);
      await setModalHeader("Failed");
      await setModalBody(
        <div className="modalcontentSuccess modalWithImage">
          <div className="topImage">
            <div className="wallet">
              <Image
                width={1221}
                height={1221}
                src="/images/Failed.png"
                alt={"failed image"}
                loading="lazy"
              />
            </div>
          </div>
          <div className="contentbox">
            <h5>Failed To Claim Rewards</h5>
          </div>
        </div>
      );
      await setModalFooter(
        <div className="cointainer-fluid AuthorizationModalBtnContainer">
          <div className="row">
            <div className="col-sm-6 offset-3 offset-sm-3 mx-auto">
              <button
                className="modalcancelbutton secondaryRedBtn greyBackBtns bg-green-500 SimpleButton btnHoverEffectOutline"
                onClick={closeConnectButtonClick}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      );
    }
  };

  const closeConnectButtonClick = async () => {
    try {
      setShow(false);
    } catch (e) {
      console.log(e);
    }
  };

  const buttonClickHandler = async (data) => {
    try {
      //
      setShow(false);
      await setShow(true);
      await setModalHeader("Claim rewards");
      await setModalBody(
        <div className="modalcontentSuccess modalWithImage">
          <div className="topImage">
            <div className="wallet">
              <Image
                width={1221}
                height={1221}
                src="/images/Claimrewards.png"
                alt={"Claimrewards image"}
                loading="lazy"
              />
            </div>
          </div>
          <div className="contentbox">
            <h5>Do You Want To Claim Rewards ?</h5>
          </div>
        </div>
      );
      await setModalFooter(
        <div className="cointainer-fluid AuthorizationModalBtnContainer">
          <div className="row ">
            <div className="col-sm-6 ">
              <button
                className="modalcancelbutton secondaryRedBtn greyBackBtns bg-green-500 SimpleButton btnHoverEffectOutline"
                onClick={closeConnectButtonClick}
              >
                No
              </button>
            </div>
            <div className="col-sm-6">
              <button
                className="modalauthorizationbutton SimpleButton btnHoverEffectOutline"
                onClick={() => {
                  ClaimPack(data);
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      );
    } catch (e) {
      // toast.error(e.message, {
      //   position: "top-center",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   });

      await setShow(true);
      await setModalHeader("Failed");
      await setModalBody(
        <div className="modalcontentSuccess modalWithImage">
          <div className="topImage">
            <div className="wallet">
              <Image
                width={1221}
                height={1221}
                src="/images/Failed.png"
                alt={"Failed image"}
                loading="lazy"
              />
            </div>
          </div>
          <div className="contentbox">
            <h5>Failed To Claim Rewards</h5>
          </div>
        </div>
      );
      await setModalFooter(
        <div className="cointainer-fluid AuthorizationModalBtnContainer">
          <div className="row">
            <div className="col-sm-6 offset-3 offset-sm-3 mx-auto">
              <button
                className="modalcancelbutton secondaryRedBtn greyBackBtns bg-green-500 SimpleButton btnHoverEffectOutline"
                onClick={closeConnectButtonClick}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      );
    }
  };

  const createPurchasedDeswap = async (pruchasedpack) => {
    try {
      if (!pruchasedpack || pruchasedpack.length < 1) {
        setpurchasedNFTCard(<NodataCard />);
        return;
      }
      let result = [];
      for (let index in pruchasedpack) {
        result.push(
          <ActivatedPackListCard
            key={pruchasedpack[index]?._id || index}
            claimRewardsFunction={buttonClickHandler}
            name={pruchasedpack[index]?.PackID?.PackName}
            price={pruchasedpack[index]?.TotalAmount}
            currency={pruchasedpack[index]?.Currency}
            lockup={pruchasedpack[index]?.PackID?.LockedPeriod}
            lockupinterval={pruchasedpack[index]?.PackID?.LockedPeriodType}
            id={pruchasedpack[index]?._id}
            purchaseddate={pruchasedpack[index]?.created_at}
            releasedate={pruchasedpack[index]?.created_at}
            claimcountdown={pruchasedpack[index]?.created_at}
            quantity={pruchasedpack[index]?.Quantity}
            bonous={pruchasedpack[index]?.PackID?.Bonous}
            daw={pruchasedpack[index]?.PackID?.DAW}
            status={pruchasedpack[index]?.Status}
          />
        );
      }
      setpurchasedNFTCard(result);
    } catch (e) {
      console.log("Error : ", e);
      setpurchasedNFTCard(<FailedToFetchData />);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        let result = await axios.post(
          `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/purchasedpack/fetch/all`,
          {},
          {
            withCredentials: true,
            headers: {
              "security-set": false,
            },
          }
        );
        if (cancelled) return;
        let purchasedpack = result.data.data;
        await createPurchasedDeswap(purchasedpack);
      } catch (e) {
        if (cancelled) return;
        setpurchasedNFTCard(<FailedToFetchData />);
        console.log(e);
        console.log("Failed to fetch data");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const ActivatedStackingPackDetails = [
    {
      rateUSDC: 1000,
      rateDollor: "0,0",
      activated: 2,
      per: 0.16,
      profit: "1,6",
      claimlockupduration: "Lifetime",
      purchasedon: "2022-01-13 11:41:30",
      nextreward: "22:39:08",
      earnedUSDC: "8,0",
      earnedDollor: "0,0",
    },
    {
      rateUSDC: 2000,
      rateDollor: "0,0",
      activated: 4,
      per: 0.16,
      profit: "3,2",
      claimlockupduration: "Lifetime",
      purchasedon: "2022-01-13 11:42:30",
      nextreward: "22:40:08",
      earnedUSDC: "16,0",
      earnedDollor: "0,0",
    },
  ];

  return (
    <>
      <div className="ActivatedPackListCardList">
        {purchasedNFTCard}
      </div>
      <BootstrapModal
        show={show}
        handleClose={closeConnectButtonClick}
        modaltitle={modalheader}
        modalbody={modalbody}
        modalfooter={modalfooter}
      ></BootstrapModal>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastStyle={{
          backgroundColor: "#232323",
          color: "#FFFFFF",
          fontSize: "12px",
        }}
      />
    </>
  );
}

export default ActivatedPackListTab;
