import React, { useState, useEffect } from "react";
import ActiveNftLicenseCard from "./ActiveNftLicenseCard";
import Modal from "@/components/reusables/Modal";
import axios from "../../../utils/common/axios";
import { encryptRequestBody } from "@/utils/common/jwtToken";
import Loader from "@/components/reusables/loader/Loader";
import NodataCard from "@/components/reusables/NodataCard";
import Image from "next/image";
import FailedToFetchData from "@/components/reusables/FailedToFetchData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  SanitizeRequestString,
  SanitizeRequestObject,
} from "../../../utils/common/sanitize";

const noDataComponent = NodataCard;
function ActiveNftLcardTab() {
  const [showWalletConnectMessage, setShowWalletConnectMessage] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [purchasedNFTCard, setpurchasedNFTCard] = useState(false);

  const buyNFTLicenseFunction = () => {
    setShowWalletConnectMessage(true);
  };

  const claimRewardsFunction = async (data) => {
    try {
      // Clicked on claimng reward
    } catch (e) {
      console.log("Claming rewards function");
    }
  };
  //
  const createPurchasedNFTLicense = async (pruchasedpack, maxvalue) => {
    try {
      if (pruchasedpack.length < 1) {
        setpurchasedNFTCard(<NodataCard />);
        return;
      }
      let result = [];
      for (let index in pruchasedpack) {
        //
        //quantity
        result.push(
          <ActiveNftLicenseCard
            claimRewardsFunction={claimRewardsFunction}
            name={pruchasedpack[index].NftLicense.Name}
            description={pruchasedpack[index].NftLicense.Description}
            price={pruchasedpack[index].NftLicense.Price}
            currency={pruchasedpack[index].NftLicense.Currency}
            lockup={pruchasedpack[index].NftLicense.LookUp}
            lockupinterval={pruchasedpack[index].NftLicense.LookUpInterval}
            id={pruchasedpack[index]._id}
            purchaseddate={pruchasedpack[index].created_at}
            releasedate={pruchasedpack[index].created_at}
            claimcountdown={pruchasedpack[index].created_at}
            quantity={pruchasedpack[index].Quantity}
            imagelocation={pruchasedpack[index].NftLicense.Image}
            purchasedindex={pruchasedpack[index].NftLicense.Index}
            maxindex={maxvalue.Index}
          />
        );
      }
      setpurchasedNFTCard(result);
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
      setpurchasedNFTCard(<FailedToFetchData />);
    }
  };
  useEffect(() => {
    void (async () => {
    try {
      setLoading(true);
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/purchasednftlicense/fetch`,
        {},
        {
          withCredentials: true,
          headers: {
            "security-set": false,
          },
        }
      );
      setLoading(result && false);
      let purchasedpack = result.data.data;
      purchasedpack = await SanitizeRequestObject(purchasedpack);
      const max = await SanitizeRequestObject(result.data.max);
      await createPurchasedNFTLicense(purchasedpack, max);
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
      setLoading(false);
      setpurchasedNFTCard(<FailedToFetchData />);
      console.log("Failed to fetch data");
    }
      })();
  }, []);
  //
  //
  const NFTRealEstateLincenseDetails = {
    name: "NFT REAL ESTATE LICENSE",
    rateDollor: "50",
    rateUSDT: "500",
    description:
      "Join the leading NFT platform to get all the details about secret upcoming NFT projects. Get the regular updates and event alerts before the launch.",
    quantity: "1",
    claimLockup: "9 Months",
    PurchaseOn: "2021-12-06 23: 18:04",
    ReleaseDate: "2022-12-06 23: 18:04",
    Countdown: "7 months 12 days, 16:22",
  };

  return (
    <>
      <div className="ActiveNftlicenseCardList">
        {/*<ActiveNftLicenseCard Details={NFTRealEstateLincenseDetails} imgPlaceholder={activenft} buyNFTLicenseFunction={buyNFTLicenseFunction} />*/}
        {purchasedNFTCard}
      </div>

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
                alt={"Connectwallet image"}
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
      {loading && <Loader />}
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

export default ActiveNftLcardTab;
