import React, { useEffect, useState } from "react";
import SimpleButton from "./../../reusables/SimpleButton";
import BootstrapModal from "@/components/reusables/BootstrapModal";
import Loader from "@/components/reusables/loader/Loader";
import NodataCard from "@/components/reusables/NodataCard";
import axios from "../../../utils/common/axios";
import { encryptRequestBody } from "@/utils/common/jwtToken";
import { convertToEuro } from "../../../utils/common/currencyconversion";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  SanitizeRequestString,
  SanitizeRequestObject,
} from "../../../utils/common/sanitize";

function totalNetworkRewards() {
  const [show, setShow] = useState(false);
  const [modalheader, setModalHeader] = useState("Claim rewards");
  const [modalbody, setModalBody] = useState(null);
  const [modalfooter, setModalFooter] = useState(null);

  const [totalRewardsUSD, settotalRewardsUSD] = useState("0,0");
  const [claimmedRewardsUSD, setclaimmedRewardsUSD] = useState("0,0");
  const [avaibleRewardsUSD, setavaibleRewardsUSD] = useState("0,0");

  const [totalRewardsDeswap, settotalRewardsDeswap] = useState("0,0");
  const [claimmedRewardsDeswap, setclaimmedRewardsDeswap] = useState("0,0");
  const [avaibleRewardsDeswap, setavaibleRewardsDeswap] = useState("0,0");

  let usdtodeswap = 0;
  const fetchUSDToDeswap = async () => {
    try {
      //api/conversion/dollartodeswap
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/conversion/dollartodeswap`,
        {},
        {
          withCredentials: true,
          headers: {
            "security-set": false,
          },
        }
      );
      //console.log("Conversion rate : ",result.data.conversion)
      usdtodeswap = result.data.conversion;
      await SanitizeRequestString(usdtodeswap);
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
      console.log("Fetch USD to Deswap");
    }
  };

  const fetchUserRewards = async () => {
    try {
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/network/fetch/totaldata`,
        {},
        {
          withCredentials: true,
          headers: {
            "security-set": false,
          },
        }
      );

      let networkRewards = result?.data?.data;
      networkRewards = await SanitizeRequestObject(networkRewards);
      //console.log("Network rewards : ",networkRewards)
      //return result.data.data;
      if (
        networkRewards?.total?.length > 0 &&
        networkRewards?.total[0]?.totalRewards != undefined
      ) {
        settotalRewardsUSD(convertToEuro(networkRewards.total[0].totalRewards));
        settotalRewardsDeswap(
          convertToEuro(networkRewards.total[0].totalRewards * usdtodeswap)
        );
      } else {
        settotalRewardsUSD(convertToEuro(0.0));
        settotalRewardsDeswap(convertToEuro(0.0));
      }

      if (
        networkRewards?.claimmed?.length > 0 &&
        networkRewards?.claimmed[0]?.totalRewards != undefined
      ) {
        setclaimmedRewardsUSD(
          convertToEuro(networkRewards.claimmed[0].totalRewards)
        );
        setclaimmedRewardsDeswap(
          convertToEuro(networkRewards.claimmed[0].totalRewards * usdtodeswap)
        );
      } else {
        settotalRewardsUSD(convertToEuro(0.0));
        settotalRewardsDeswap(convertToEuro(0.0));
      }

      if (
        networkRewards?.avaible?.length > 0 &&
        networkRewards?.avaible[0]?.totalRewards != undefined
      ) {
        setavaibleRewardsUSD(
          convertToEuro(networkRewards.avaible[0].totalRewards)
        );
        setavaibleRewardsDeswap(
          convertToEuro(networkRewards.avaible[0].totalRewards * usdtodeswap)
        );
      } else {
        settotalRewardsUSD(convertToEuro(0.0));
        settotalRewardsDeswap(convertToEuro(0.0));
      }

      if (
        networkRewards?.avaible?.length > 0 &&
        networkRewards?.avaible[0]?.totalRewards != undefined
      ) {
        return networkRewards.avaible[0].totalRewards;
      } else {
        return 0;
      }
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
      console.log(e);
      return 0;
    }
  };
  useEffect(() => {
    void (async () => {
    try {
      await fetchUSDToDeswap();
      await fetchUserRewards();
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
      console.log(e);
    }
      })();
  }, []);

  const claimmingRewards = async (clammingdata) => {
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
            <p>Please Don't Refresh/Close Page</p>
          </div>
        </div>
      );
      await setModalFooter(
        <div className="cointainer-fluid AuthorizationModalBtnContainer">
          <div className="row ">
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
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/network/rewards/claimallrewards`,
        {},
        {
          withCredentials: true,
          headers: {
            "security-set": false,
          },
        }
      );

      await setShow(true);
      await setModalHeader("Success");
      await setModalBody(
        <div className="modalcontentSuccess modalWithImage">
          <div className="topImage">
            <div className="wallet">
              <Image
                width={1221}
                height={1221}
                src="/images/Successfullyregistered.png"
                alt={"Successfullyregistered image"}
                loading="lazy"
              />
            </div>
          </div>
          <div className="contentbox">
            <h5>Claimed rewards</h5>
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
      await fetchUSDToDeswap();
      await fetchUserRewards();
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
        <div className="row text-center">
          <div className="col-sm-12"></div>
          <div className="col-sm-12">
            <p className="modalpurchasebody2">
              Failed to claim all network rewards
            </p>
          </div>
        </div>
      );
      await setModalFooter(
        <div className="cointainer-fluid AuthorizationModalBtnContainer">
          <div className="row ">
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

  const ClaimRewards = async (data) => {
    try {
      await setShow(true);
      await setModalHeader("Claim rewards");
      await setModalBody(
        <div className="row text-center">
          <div className="col-sm-12"></div>
          <div className="col-sm-12">
            <p className="modalpurchasebody2">
              Checking avaible network rewards
            </p>
          </div>
        </div>
      );
      await setModalFooter(
        <div className="cointainer-fluid AuthorizationModalBtnContainer">
          <div className="row ">
            <div className="col-sm-6 offset-3 offset-sm-3 text-center">
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
      let avaibleRewards = await fetchUserRewards();

      //console.log("Avaible rewards : ",avaibleRewards)
      if (avaibleRewards % 1 == 0) {
        await setShow(true);
        await setModalHeader("Claim rewards");
        await setModalBody(
          <div className="row text-center">
            <div className="col-sm-12"></div>
            <div className="col-sm-12">
              <p className="modalpurchasebody2">No avaible rewards to claim</p>
            </div>
          </div>
        );
        await setModalFooter(
          <div className="cointainer-fluid AuthorizationModalBtnContainer">
            <div className="row ">
              <div className="col-sm-6 offset-3 offset-sm-3 text-center">
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
        return;
      }
      await setShow(true);
      await setModalHeader("Claim rewards");
      await setModalBody(
        <div className="row text-center">
          <div className="col-sm-12"></div>
          <div className="col-sm-12">
            <p className="modalpurchasebody2"></p>
          </div>
        </div>
      );
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
            <h5>Do You Want To Claim All Network Rewards ?</h5>
          </div>
        </div>
      );
      await setModalFooter(
        <div className="cointainer-fluid AuthorizationModalBtnContainer">
          <div className="row ">
            <div className="col-sm-6">
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
                  claimmingRewards(data);
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
      setShow(true);
      setModalHeader("Failed");
      setModalBody(
        <div className="row text-center">
          <div className="col-sm-12"></div>
          <div className="col-sm-12">
            <p className="modalpurchasebody2">
              Failed to claim all network rewards
            </p>
          </div>
        </div>
      );
      setModalFooter(
        <div className="cointainer-fluid AuthorizationModalBtnContainer">
          <div className="row ">
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
    setShow(false);
  };

  return (
    <div className="networkCardsContainer">
      <h2>My Network Reward</h2>
      <div className="cardsContainer">
        <div className="rewardCard">
          <h5>Total Reward</h5>
          <h6>
            DESWAP {totalRewardsDeswap} ~ $ {totalRewardsUSD}
          </h6>
        </div>
        <div className="rewardCard claimBtnContainer">
          <div className="content">
            <h5>Available Balance</h5>
            <h6>
              DESWAP {avaibleRewardsDeswap} ~ $ {avaibleRewardsUSD}
            </h6>
          </div>
          <div className="claimBtn">
            <SimpleButton
              text="Claim"
              backgroundColor="#E44757"
              maxWidth="28.3rem"
              onClick={(e) => {
                ClaimRewards({ currenttarget: e });
              }}
            />
          </div>
        </div>
        <div className="rewardCard">
          <h5>Claimed</h5>
          <h6>
            DESWAP {claimmedRewardsDeswap} ~ $ {claimmedRewardsUSD}
          </h6>
        </div>
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
    </div>
  );
}

export default totalNetworkRewards;
