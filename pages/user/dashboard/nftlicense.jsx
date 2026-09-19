import React, { useState, useEffect, Fragment } from "react";
import Modal from "@/components/reusables/Modal";
import BootstrapModal from "@/components/reusables/BootstrapModal";
import "bootstrap/dist/css/bootstrap.css";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import NftLcardTab from "@/components/userDashboardComponents/nftlicenseTab/nftLcardTab";
import ActiveNftLcardTab from "@/components/userDashboardComponents/nftlicenseTab/ActiveNftLcardTab";
import axios from "../../../utils/common/axios";
import { encryptRequestBody } from "@/utils/common/jwtToken";
import { checkUserAuth } from "../../../utils/auth/userauth";
import moment from "moment";
import {
  claimmedDateFormated,
  relaseDateFormat,
} from "../../../utils/common/date";
import Head from "next/head";
import {
  convertToUSD,
  convertToEuro,
  convertToNumber,
} from "../../../utils/common/currencyconversion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  SanitizeRequestString,
  SanitizeRequestObject,
} from "../../../utils/common/sanitize";
import { UserDashboardLayout } from "@/layout/userdashboard.layout";

var metaMaskValues = null;
function Nftlicense(data) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [displayNFTLicense, setDisplayNFTLicense] = useState(true);
  const [key, setKey] = useState("NFTLicense");
  //Show modals
  const [show, setShow] = useState(false);
  //Modal header
  const [modalheader, setModalHeader] = useState("Connect Wallet");
  const [modalbody, setModalBody] = useState(null);
  const [modalfooter, setModalFooter] = useState(null);
  const [countDownTimeOut, setCountDownTimeOut] = useState(null);

  let lastUSDToMaticFetchTime = null;
  let usdToMaticConversionRate = null;

  const closeConnectButtonClick = () => {
    setShow(false);
  };

  const fetchUSDCConversionRate = async () => {
    try {
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/conversion/saveddollartomatic`,
        {},
        {
          withCredentials: true,
          headers: {
            "security-set": false,
          },
        }
      );
      const price = result?.data?.data?.PriceInUSD;
      price = await SanitizeRequestString(price);
      return price;
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

  const updateValues = async () => {
    try {
      let listOfUSD = await document.getElementsByClassName(
        "usdvaluetoconvert"
      );
      let listOfMatic = await document.getElementsByClassName("valueinmatic");

      if (listOfMatic.length != listOfUSD.length) {
        return;
      }

      for (let index in listOfUSD) {
        if (
          listOfUSD[index].innerText != undefined &&
          listOfUSD[index].innerText.trim() != ""
        ) {
          //
          let USDValue = await listOfUSD[index].innerText.trim();
          USDValue = await convertToUSD(USDValue);
          USDValue = await convertToNumber(USDValue);
          if (listOfMatic[index]) {
            listOfMatic[index].innerHTML = convertToEuro(
              (Number(USDValue) * usdToMaticConversionRate).toFixed(4)
            );
          }
        }
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
    }
  };
  const convertUSDCToMatic = async () => {
    try {
      let conversionRate = 0;
      if (!lastUSDToMaticFetchTime) {
        usdToMaticConversionRate = await fetchUSDCConversionRate();
        lastUSDToMaticFetchTime = await moment();
        await updateValues();
      }

      let currentDateTime = await moment();
      let diffDuration = await moment.duration(
        currentDateTime.diff(lastUSDToMaticFetchTime)
      );
      let difference = diffDuration.minutes();
      if (difference < 5) {
        await updateValues();
        return;
      }

      usdToMaticConversionRate = await fetchUSDCConversionRate();
      lastUSDToMaticFetchTime = await moment();

      await updateValues();
      //Find and
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
    }
  };
  const countDownFunction = async () => {
    try {
      let listOfPurchasedLicense;
      let purchasedLicenseReleaseDate;
      let purchasedcountDownLicense;
      listOfPurchasedLicense = await document.getElementsByClassName(
        "nftLicensePurchasedDate"
      );
      purchasedLicenseReleaseDate = await document.getElementsByClassName(
        "nftLicenseReleaseDate"
      );
      purchasedcountDownLicense = await document.getElementsByClassName(
        "nftLicenseCountDown"
      );

      if (
        listOfPurchasedLicense.length > 0 &&
        purchasedLicenseReleaseDate.length > 0 &&
        listOfPurchasedLicense.length == purchasedLicenseReleaseDate.length
      ) {
        for (let index in purchasedLicenseReleaseDate) {
          if (
            purchasedLicenseReleaseDate[index].dataset &&
            purchasedLicenseReleaseDate[index].dataset.releasedate
          ) {
            let currentDateTime = await moment();
            let momentJSReleaseDate = await claimmedDateFormated(
              purchasedLicenseReleaseDate[index].dataset.releasedate
            );
            let diffDuration = await moment.duration(
              momentJSReleaseDate.diff(currentDateTime)
            );
            let finalFormatedDate = await relaseDateFormat(diffDuration);
            purchasedcountDownLicense[index].innerHTML = finalFormatedDate;
          }
        }
      }
      await convertUSDCToMatic();
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
      console.log("Error ", e);
    }
  };

  const componetUnmountFun = async () => {
    try {
      clearInterval(countDownTimeOut);
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
  };
  useEffect(async () => {
    let intervalValue = await setInterval(countDownFunction, 1000);
    let countInterval = intervalValue != undefined ? intervalValue : 0;
    for (let a = 0; a < countInterval; a++) {
      clearInterval(a);
    }
    await setCountDownTimeOut(intervalValue);
    return componetUnmountFun;
  }, []);
  return (
    <Fragment>
      <Head>
        <title>NFT License</title>
      </Head>
      <div className="nftLContainer">
        <div className="nftLInner">
          <div className="title">
            <h1>NFT License market place</h1>
          </div>
          <div className="nftLMain">
            <div className="tabsContainer">
              <ul className="mb-3 nav nav-tabs">
                <li
                  className="nav-item"
                  onClick={() => {
                    setDisplayNFTLicense(true);
                  }}
                >
                  <button
                    type="button"
                    className={`nav-link ${displayNFTLicense && "active"}`}
                  >
                    NFT License
                  </button>
                </li>
                <li
                  className="nav-item"
                  onClick={() => {
                    setDisplayNFTLicense(false);
                  }}
                >
                  <button
                    type="button"
                    className={`nav-link ${!displayNFTLicense && "active"}`}
                  >
                    Activated
                  </button>
                </li>
              </ul>
              <div className="tab-content">
                {displayNFTLicense ? (
                  <NftLcardTab data={data} />
                ) : (
                  <ActiveNftLcardTab data={data} />
                )}
              </div>
            </div>
          </div>
        </div>
        <BootstrapModal
          show={show}
          handleClose={closeConnectButtonClick}
          modaltitle={modalheader}
          modalbody={modalbody}
          modalfooter={modalfooter}
        ></BootstrapModal>
        {/* Authorization modal */}

        {/* success modal */}
        <Modal
          show={showSuccess}
          cross={true}
          onClose={() => setShowSuccess(false)}
        >
          <div className="editProfileForm">
            <h2>modal</h2>
            <div className="profileImgContainer">
              <input type="file" />
            </div>
            <div className="inputsList"></div>
          </div>
        </Modal>
      </div>
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
    </Fragment>
  );
}

export const getServerSideProps = async (ctx) => {
  return await checkUserAuth(ctx);
};

export default Nftlicense;
Nftlicense.PageLayout = UserDashboardLayout;

/*
const mapStateToProps = (state) => {
  metaMaskValues = state.metamaskConn;
  return { metamaskConn: state.metamaskConn };
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    await store.dispatch(metaMaskValue());
    return await checkUserAuth(ctx);
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
      connectToMeta: bindActionCreators(connectToMeta, dispatch),
      metaMaskDisconnected: bindActionCreators(metaMaskDisconnected, dispatch),
      metaMaskValue:bindActionCreators(metaMaskValue, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Nftlicense)
*/
//export default Nftlicense
