import axios from "@/utils/common/axios";
import { encryptRequestBody } from "@/utils/common/jwtToken";
import React, { useEffect, useState } from "react";
import BootstrapModal from "@/components/reusables/BootstrapModal";
import Loader from "@/components/reusables/loader/Loader";
import TableLoader from "@/components/reusables/loader/TableLoader";
import NodataCard from "@/components/reusables/NodataCard";
import FailedToFetchData from "@/components/reusables/FailedToFetchData";

import { myRewardsDate } from "../../../utils/common/date";
import { reducedWalletAddress } from "../../../utils/common/walletaddress";
import { convertToEuro } from "../../../utils/common/currencyconversion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  SanitizeRequestString,
  SanitizeRequestObject,
} from "../../../utils/common/sanitize";

import Image from "next/image";
function NetworkRewards() {
  const [show, setShow] = useState(false);
  const [modalheader, setModalHeader] = useState("Claim rewards");
  const [modalbody, setModalBody] = useState(null);
  const [modalfooter, setModalFooter] = useState(null);
  const [loaderStatus, setLoaderStatus] = useState(false);

  const [tableData, settableData] = useState(
    <tr>
      <th colSpan={5}>
        <div className="text-center">Loading...</div>
      </th>
    </tr>
  );

  const claimmingRewards = async (passeddata) => {
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
      const sanData = await SanitizeRequestString(passeddata.rewardid);
      let encryptionData = await encryptRequestBody({
        id: sanData,
      });
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/network/rewards/claimrewards`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      let data = result.data;
      await setShow(true);
      await setModalHeader("Success");
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
                src="/images/Successfullyregistered.png"
                alt={"deswap image"}
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
      setLoaderStatus(true);
      await fetchData();
      setLoaderStatus(false);
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
  const claimRewards = async (data) => {
    try {
      setLoaderStatus(true);
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
                  claimmingRewards(data);
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      );
      setLoaderStatus(false);
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
      setLoaderStatus(false);
    }
  };
  const createTableData = async (data, totaldata) => {
    try {
      settableData(<TableLoader colSpan={6} />);
      if (data?.length < 1) {
        settableData(
          <tr>
            <td className="text-center" colSpan={5}>
              <NodataCard />
            </td>
          </tr>
        );
      }
      let dispalyData = [];
      for (let index in data) {
        dispalyData.push(
          <tr>
            <td>
              {data[index]?.created_at
                ? myRewardsDate(data[index].created_at)
                : "N/A"}
            </td>
            <td>
              {data[index].UserFrom.walletaddress[
                data[index].UserFrom.walletaddress.length - 1
              ] ? (
                <a
                  target="_blank"
                  href={`${process.env.NEXT_PUBLIC_POLYGON_SCANLINK}address/${
                    data[index].UserFrom.walletaddress[
                      data[index].UserFrom.walletaddress.length - 1
                    ]
                  }`}
                >
                  {reducedWalletAddress(
                    data[index].UserFrom.walletaddress[
                      data[index].UserFrom.walletaddress.length - 1
                    ]
                  )}
                </a>
              ) : (
                "N/A"
              )}
            </td>
            <td>{data[index]?.Level ? data[index].Level : "N/A"}</td>
            <td>
              {data[index]?.Amount && data[index]?.RewardsPercentage
                ? convertToEuro(
                    data[index].Amount * data[index].RewardsPercentage
                  )
                : "N/A"}
            </td>
            <td>
              <button
                onClick={(e) => {
                  claimRewards({
                    event: e,
                    rewardid: data[index]._id,
                    amount: data[index].Amount,
                    rewardspercentage: data[index].RewardsPercentage,
                    purchasedid: data[index].PurchasedPack._id,
                    packageid: data[index].PurchasedPack.PackID,
                    totalamount: data[index].PurchasedPack.TotalAmount,
                    totalamountmatic:
                      data[index].PurchasedPack.TotalAmountInMatic,
                  });
                }}
              >
                Claim
              </button>
            </td>
          </tr>
        );
      }
      settableData(dispalyData);
      setLoaderStatus(false);
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
      setLoaderStatus(true);
      console.log(e);
      settableData(
        <tr>
          <td className="text-center" colSpan={5}>
            <FailedToFetchData />
          </td>
        </tr>
      );
      setLoaderStatus(false);
    }
  };

  const fetchData = async (skipped = 0, limited = 10) => {
    try {
      setLoaderStatus(true);
      const skippedData = await SanitizeRequestString(skipped);
      const limitedData = await SanitizeRequestString(limited);
      let result = await axios.post(
        "/api/users/network/fetch",
        { skip: skippedData, limit: limitedData },
        { withCredentials: true }
      );
      let tableData = result.data;
      if (result.data.totaldata < 1) {
        settableData(
          <tr>
            <td className="text-center" colSpan={5}>
              <NodataCard />
            </td>
          </tr>
        );
        return;
      }
      await createTableData(tableData.data, tableData.totaldata);
      setLoaderStatus(result && false);
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
      setLoaderStatus(true);
      settableData(
        <tr>
          <td className="text-center" colSpan={5}>
            <FailedToFetchData />
          </td>
        </tr>
      );
      setLoaderStatus(false);
    }
  };

  const closeConnectButtonClick = async () => {
    setShow(false);
  };

  useEffect(() => {
    void (async () => {
    try {
      setLoaderStatus(true);
      ///api/users/network/fetch\index.js
      //let tableData = result.data.data;
      await fetchData();
      setLoaderStatus(false);
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
      setLoaderStatus(false);
      console.log("error:", e);
      settableData(
        <tr>
          <td className="text-center" colSpan={5}>
            <FailedToFetchData />
          </td>
        </tr>
      );
    }
      })();
  }, []);
  return (
    <div className="rewardDataContainer">
      <h3>Network Rewards</h3>
      <div className="rewardTable customScroll">
        <table cellPadding="0" cellSpacing="0" border="0">
          <thead>
            <tr>
              <th>Date</th>
              <th> Public Key (Rewards From)</th>
              <th> Level</th>
              <th> My Rewards ($)</th>
              <th> Claimed Rewards</th>
            </tr>
          </thead>
          <tbody>
            {
              tableData
              /**/
            }
          </tbody>
          {/*<tbody>
                    <tr>
                    <td>02-02-2022</td>
                    <td>sdfsdf4343443d</td>
                    <td>1-4</td>
                    <td>22</td>
                    <td>567</td>
                    <td>6567</td>
                    <td>Active</td>
                    </tr>
                    <tr>
                    <td>02-02-2022</td>
                    <td>sdfsdf4343443d</td>
                    <td>1-4</td>
                    <td>22</td>
                    <td>567</td>
                    <td>6567</td>
                    <td>Active</td>
                    </tr>
                </tbody>*/}
        </table>
      </div>

      {/* {loaderStatus && <Loader />} */}
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

export default NetworkRewards;
