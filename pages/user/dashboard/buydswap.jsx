import React, { useState, useEffect, Fragment } from "react";
import BuyDswapPackCard from "@/components/userDashboardComponents/buyDswap/BuyDswapPackCard";
import axios from "../../../utils/common/axios";
// import { axiosNodeApi } from "../../../utils/common/axios1";
import { encryptRequestBody } from "@/utils/common/jwtToken";
import { connect, useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import Image from "next/image";
import {
  connectToMeta,
  metaMaskDisconnected,
  metaMaskValue,
} from "../../../redux/actions/metamask";
import firebasedb from "../../../utils/connection/firebaseconnection";
import { readCollection } from "../../../utils/firebase/collection";
import {
  readDocument,
  insertDocument,
  deleteDocument,
  updatedDocument,
} from "../../../utils/firebase/document";
import { firebaseDate, firebaseIDDate } from "../../../utils/common/date";
import BootstrapModal from "@/components/reusables/BootstrapModal";
import {
  sendMetaMaskTransaction,
  sendContractTransaction,
} from "../../../utils/wallet/index";
import ActivatedPackListTab from "@/components/userDashboardComponents/activatedpacklistTab/ActivatedPackListTab";
import { clearAllInterval } from "../../../utils/common/interval";
import Loader from "@/components/reusables/loader/Loader";
import NodataCard from "@/components/reusables/NodataCard";
import FailedToFetchData from "@/components/reusables/FailedToFetchData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  SanitizeRequestString,
  SanitizeRequestObject,
} from "../../../utils/common/sanitize";
import { UserDashboardLayout } from "@/layout/userdashboard.layout";
{
  /* <NodataCard/> */
}
{
  /* <FailedToFetchData/> */
}
import moment from "moment";
import {
  convertToUSD,
  convertToEuro,
  convertToNumber,
} from "../../../utils/common/currencyconversion";
import {
  claimmedDateFormated,
  relaseDateFormat,
} from "../../../utils/common/date";
import Head from "next/head";
import { requestBodyEncryptionUnprotected } from "@/utils/common/jwtToken";

var metaMaskValues = null;
function Buydswap(data) {
  //console.log("Data ",data)
  // const [loadingState, setLoadingState] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAuthorization, setShowAuthorization] = useState(false);
  const [key, setKey] = useState("Deswaplist");
  const [displayDeswapList, setDisplayDeswapList] = useState(true);

  //TO DO : Change pack data
  const [packData, setpackData] = useState(null);
  const [firebaseCollection, setFirebaseCollection] = useState(null);
  const [currentFirebaseID, setcurrentFirebaseID] = useState("");
  const [transactionInProgess, setTransactionInProgress] = useState(false);
  //Show modals
  const [show, setShow] = useState(false);
  //Modal header
  const [modalheader, setModalHeader] = useState("Connect Wallet");
  const [connectionStatus, setconnectionStatus] = useState(false);

  const [modalbody, setModalBody] = useState(null);
  const [modalfooter, setModalFooter] = useState(null);
  const [currentTargetButton, setcurrentTargetButton] = useState(null);
  const [countDownTimeOut, setCountDownTimeOut] = useState(null);

  let currentSelectedTarget = null;
  let lastUSDToMaticFetchTime = null;
  let usdToMaticConversionRate = null;
  let usdToDeswapConversionRate = null;
  let lastUSDToDeswapFetchTime = null;
  //data.metaMaskValue();
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
      let price = result?.data?.data?.PriceInUSD;
      price = await SanitizeRequestString(price);
      return price || 0.82;
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
      return 0.82;
    }
  };

  const fetchDeswapConverionRate = async () => {
    try {
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/conversion/savedollartodeswap`,
        {},
        {
          withCredentials: true,
          headers: {
            "security-set": false,
          },
        }
      );

      let price = result?.data?.data?.PriceInUSD;
      price = await SanitizeRequestString(price);
      return price || 3.89;
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
      return 3.89;
    }
  };

  const updateUSDToDeswap = async () => {
    try {
      let usdtodaw = await document.getElementsByClassName("usdtodaw");
      for (let index in usdtodaw) {
        if (
          usdtodaw[index] &&
          usdtodaw[index].dataset &&
          usdtodaw[index].dataset.price
        ) {
          let usdtodawValue = usdtodaw[index].dataset.price;
          usdtodaw[index].innerHTML = await convertToEuro(
            (Number(usdtodawValue) * Number(usdToDeswapConversionRate)).toFixed(
              2
            )
          );
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
      console.log(e);
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
            listOfMatic[index].innerHTML = await convertToEuro(
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
      console.log(e);
    }
  };
  const convertUSDCToDeswap = async () => {
    try {
      let conversionRate = 0;
      if (!lastUSDToDeswapFetchTime) {
        usdToDeswapConversionRate = await fetchDeswapConverionRate();
        lastUSDToDeswapFetchTime = await moment();
        await updateUSDToDeswap();
      }

      let currentDateTime = await moment();
      let diffDuration = await moment.duration(
        currentDateTime.diff(lastUSDToDeswapFetchTime)
      );
      let difference = diffDuration.minutes();
      if (difference < 5) {
        await updateUSDToDeswap();
        return;
      }

      usdToDeswapConversionRate = await fetchDeswapConverionRate();
      lastUSDToDeswapFetchTime = await moment();

      await updateUSDToDeswap();
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
      console.log(e);
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
      console.log(e);
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

      await convertUSDCToMatic();
      await convertUSDCToDeswap();
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

            if (finalFormatedDate.trim() == "") {
              purchasedcountDownLicense[index].innerHTML = "00:00";
              var selectedusdcelement = document.getElementById(
                purchasedLicenseReleaseDate[index].dataset.purchasedid +
                  "_earnedusdc"
              );
              const daw = Number(
                purchasedLicenseReleaseDate[index].dataset.daw || 0
              );
              const bonusPct = Number(
                purchasedLicenseReleaseDate[index].dataset.bonous || 0
              );
              let bonous = daw + daw * (bonusPct / 100);
              if (selectedusdcelement) {
                selectedusdcelement.innerHTML = Number(bonous).toFixed(2);
              }
              const selectedMatic = document.getElementById(
                purchasedLicenseReleaseDate[index].dataset.purchasedid +
                  "_earnedmatic"
              );
              if (selectedMatic) {
                const price = Number(
                  purchasedLicenseReleaseDate[index].dataset.price || 0
                );
                selectedMatic.innerHTML = (
                  price * (bonusPct / 100) ||
                  bonous * 0.25
                ).toFixed(2);
              }
            } else {
              purchasedcountDownLicense[index].innerHTML = finalFormatedDate;
            }
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
      console.log("Error ", e);
    }
  };

  const componetUnmountFun = async () => {
    try {
      //console.log("Component unmount ")
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

  const writeToFireBase = async (messageDetails) => {
    try {
      //
      if (firebaseCollection == null) {
        return;
      }

      //Reading document
      let readDocumentResult = await readDocument(
        firebaseCollection,
        data.users.uuid,
        {}
      );
      let dataInsertToDB = {};

      dataInsertToDB[currentFirebaseID] = {};

      dataInsertToDB[currentFirebaseID][messageDetails.firebasetimestamp] = {
        error: messageDetails.error,
        errordescription: messageDetails.errordescription,
        purpose: messageDetails.purpose,
      };

      if (readDocumentResult.exists()) {
        //messageDetails.
        let dataalreadyInDatabase = await readDocumentResult.data();
        if (dataInsertToDB[currentFirebaseID] !== undefined) {
          dataInsertToDB[currentFirebaseID] = {
            ...dataalreadyInDatabase[currentFirebaseID],
            ...dataInsertToDB[currentFirebaseID],
          };
        }
        let updateDocument = await updatedDocument(
          firebaseCollection,
          data.users.uuid,
          dataInsertToDB
        );
      } else {
        //
        let insertedDocument = await insertDocument(
          firebaseCollection,
          data.users.uuid,
          dataInsertToDB
        );
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
      console.log("Failed to write ");
    }
  };

  const connectToFireBase = async () => {
    try {
      //
      let collectionInfo = await readCollection(
        firebasedb,
        `${process.env.NEXT_PUBLIC_packpurchase}`
      );
      await setFirebaseCollection(collectionInfo);
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
      console.log("Failed to connect");
    }
  };

  const networkRewards = async (data, index, maxTry = 5) => {
    try {
      const sanData = await SanitizeRequestObject(data);
      let encryptionData = await encryptRequestBody(sanData);
      let networkRewardsResult = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/network/rewards/packpurchaserewards`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      return true;
      // let rewardData= networkRewardsResult?.data?.data;
      // rewardData=await SanitizeRequestObject(rewardData)
      // return
      //return networkRewardsResult?.data?.data;
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
      console.log("Failed : ", e);
      if (index < maxTry) {
        return await networkRewards(data, index + 1);
      }
    }
  };

  const savePurchasedPack = async (data, index, maxTry = 5) => {
    try {
      const sanData = await SanitizeRequestObject(data);
      //let encryptionData = await encryptRequestBody(sanData);
      console.log("sanData", sanData);
      let result = await axios.post(`/api/users/pack/insert`, {
        data: sanData,
      });
      console.log("purchasedData", result);
      let purchasedData = result?.data?.data;
      purchasedData = await SanitizeRequestString(purchasedData);
      data.stakingpurchaseid = purchasedData;

      await networkRewards(
        {
          purchasedpackid: data.stakingpurchaseid,
          amount: data.amount,
          totalamount: data.totalamount,
        },
        1
      );
      return purchasedData;
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
      console.log("Failed : ", e);
      if (index < maxTry) {
        return await savePurchasedPack(data, index + 1);
      }
    }
  };

  const saveAuthorizationFeesInDatabase = async (data, index, maxTry = 5) => {
    try {
      const sanData = await SanitizeRequestObject(data);
      let encryptionData = await encryptRequestBody(sanData);
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/packfees/insert`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      const sanObj = await SanitizeRequestObject(result.data.data);
      return sanObj;
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
      console.log("Failed : ", e);
      if (index < maxTry) {
        return await saveAuthorizationFeesInDatabase(data, index + 1);
      }
    }
  };
  const etherumTransaction = async (data) => {
    try {
      //
      //
      let params;
      data.amount = await metaMaskValues.metaconn.web3.utils.toWei(data.amount);
      let count = await metaMaskValues.metaconn.web3.eth.getTransactionCount(
        data.sender
      );
      //
      let gasPrice = await metaMaskValues.metaconn.web3.eth.getGasPrice();
      //data.amount = "0x" + Number(data.amount).toString(16)
      let transactionHash;
      if (data.contractAddress) {
        //metaMaskValues.web3contract
        transactionHash = await sendContractTransaction(
          metaMaskValues.web3contract,
          {
            sender: data.sender,
            amount: data.amount,
            receiver: data.receiver,
            //gas:"0x76c0",
            gasPrice: gasPrice,
            //count:"0x" + count.toString(16)
          }
        );
      } else {
        params = {
          from: data.sender,
          to: data.receiver,
          //"nonce":  "0x" + count.toString(16),
          //"gas": "0x76c0",
          value: "0x" + Number(data.amount).toString(16),
          gasPrice: gasPrice,
          data: "0x",
        };
        transactionHash = await sendMetaMaskTransaction(
          metaMaskValues.metaconn.web3,
          params
        );
      }
      return transactionHash;
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
      await writeToFireBase({
        firebasetimestamp: await firebaseDate(),
        error: true,
        errordescription: "Etherum transaction error : " + e.message,
        purpose: "Etherum transaction",
      });
      return null;
    }
  };

  const purchasePack = async (purchasingData) => {
    try {
      //
      setShow(true);
      setModalHeader("Transaction");
      //TO DO : <Loader></Loader>
      <Loader loading={true} />;
      await setModalBody(
        <div className="modalcontentSuccess modalWithImage">
          <div className="topImage">
            <div className="wallet">
              <Image
                width={1221}
                height={1221}
                src="/images/Failed.png"
                alt={"deswap image"}
                loading="lazy"
              />
            </div>
          </div>
          <div className="contentbox">
            <h5>
              Please Do Not Close Windows/Refresh Page Until Transaction Is
              Complete
            </h5>
          </div>
        </div>
      );
      setModalFooter(
        <div className="row purchaseBtnContainer">
          <div className="col-6 col-sm-6">
            <button
              className="failedModalBtn SimpleButton btnHoverEffectOutline"
              onClick={closeConnectButtonClick}
            >
              Close
            </button>
          </div>
        </div>
      );
      setTransactionInProgress(true);
      await writeToFireBase({
        firebasetimestamp: await firebaseDate(),
        error: false,
        errordescription: "",
        purpose: "Staking purchase",
      });
      await SanitizeRequestString(purchasingData.amount);
      await SanitizeRequestString(purchasingData.quantity);
      // console.log("purchasingData",await SanitizeRequestObject(purchasingData))
      let encryptionData1 = await requestBodyEncryptionUnprotected({
        amount: purchasingData.amount * purchasingData.quantity,
      });
      let { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/conversion/dollartomatic`,
        { data: encryptionData1 },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      await SanitizeRequestObject(data);
      let priceInUSD = purchasingData.amount * purchasingData.quantity;
      let priceInMatic = data.conversion;
      purchasingData.priceInUSD = priceInUSD;
      purchasingData.conversionrate = data.conversionRate;
      purchasingData.priceInMatic = priceInMatic;

      /*TO DO : Remove it it will be added on database
      let encryptionData = await requestBodyEncryptionUnprotected( { amount: priceInUSD })
      let dollartodeswap = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/conversion/dollartodeswap`,
        {data:encryptionData},
        { withCredentials: true,
          headers:{
            'security-set':true
          }
         }
      );
      

      if (!dollartodeswap.data.success) {
        setTransactionInProgress(false);
        setModalHeader("Failed");
        setModalBody(<p className="modalpurchasebody3">Failed Operation</p>);
        setModalFooter(
          <div className="row custombuydeswapModalBtnsContainer">
            <div className="col-6 col-sm-6">
              <button
                className="failedModalBtn SimpleButton btnHoverEffectOutline"
                onClick={closeConnectButtonClick}
              >
                Close
              </button>
            </div>
          </div>
        );
        await writeToFireBase({
          firebasetimestamp: await firebaseDate(),
          error: true,
          errordescription: "Purchase Stacking Pack : " + e.message,
          purpose: "Purchase Staking Error",
        });
        return;
      }
      //dollartodeswap.data.
      purchasingData.daw = dollartodeswap.data.conversion;
      purchasingData.dawconversionrate =
        dollartodeswap.data.conversionRate / priceInUSD;
      */
      let result = await etherumTransaction({
        sender: metaMaskValues.metamaskaccount,
        //amount:(purchasingData.amount*purchasingData.quantity).toString(),
        amount: priceInMatic.toString(),
        receiver: `${process.env.NEXT_PUBLIC_ADMIN_POLYGON_PUBLIC_KEY}`,
        //contractAddress:`${process.env.NEXT_PUBLIC_ADMIN_USDC_CONTRACT_ADDRESS}`
      });
      if (result && result.transactionHash != undefined) {
        //savePurchasedPack
        let savedResult = await savePurchasedPack(
          {
            packageid: purchasingData.id,
            quantity: purchasingData.quantity,
            txhash: result.transactionHash,
            amount: purchasingData.amount,
            totalamount: purchasingData.quantity * purchasingData.amount,
            amountinmatic: priceInMatic,
            conversionrate: purchasingData.conversionrate,
            bonous: purchasingData.bonous,
            //daw: purchasingData.daw,
            //dawconversionrate: purchasingData.dawconversionrate,
            //purchasingfeesid:purchasingData.savedFeesID
          },
          1
        );
        setShow(true);
        setModalHeader("Success");
        setModalBody(
          <p className="modalpurchasebody2"> Operation Successful</p>
        );
        setModalFooter(
          <div className="row custombuydeswapModalBtnsContainer">
            <div className="col-6 col-sm-6">
              <button
                className="failedModalBtn SimpleButton btnHoverEffectOutline"
                onClick={closeConnectButtonClick}
              >
                Close
              </button>
            </div>
          </div>
        );
        setTransactionInProgress(false);
        await writeToFireBase({
          firebasetimestamp: await firebaseDate(),
          error: false,
          errordescription: "",
          purpose: "Staking purchase successfully",
        });
      } else {
        //Failed
        setShow(true);
        setModalHeader("Failed");
        setModalBody(<p className="modalpurchasebody3">Failed Operation</p>);
        setModalFooter(
          <div className="row custombuydeswapModalBtnsContainer">
            <div className="col-6 col-sm-6">
              <button
                className="failedModalBtn SimpleButton btnHoverEffectOutline"
                onClick={closeConnectButtonClick}
              >
                Close
              </button>
            </div>
          </div>
        );
        await writeToFireBase({
          firebasetimestamp: await firebaseDate(),
          error: true,
          errordescription: "Failed to save transaction",
          purpose: "Staking purchase error",
        });
        setTransactionInProgress(false);
      }
      <Loader loading={false} />;
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
      console.log(e);
      setTransactionInProgress(false);
      setModalHeader("Failed");
      setModalBody(<p className="modalpurchasebody3">Failed Operation</p>);
      setModalFooter(
        <div className="row custombuydeswapModalBtnsContainer">
          <div className="col-6 col-sm-6">
            <button
              className="failedModalBtn SimpleButton btnHoverEffectOutline"
              onClick={closeConnectButtonClick}
            >
              Close
            </button>
          </div>
        </div>
      );
      await writeToFireBase({
        firebasetimestamp: await firebaseDate(),
        error: true,
        errordescription: "Purchase Stacking Pack : " + e.message,
        purpose: "Purchase Staking Error",
      });
    }
  };

  /*
  const authorizationFess = async(authorizationFeesData)=>{
    try{
      await setShow(true)
      await setModalHeader(<label className="purchaseheader font-bold">Authorization Contract</label>);
      //TO DO : Add Loader
      <Loader loading={true} />;
      await setModalBody(<div className="row"><div className="col-sm-12"><p className="modalpurchasebody2"></p></div><div className="col-sm-12"><p className="modalpurchasebody3">Please do not close windows/refresh page until transaction is complete</p></div></div>)
      await setModalFooter(<div className="cointainer-fluid AuthorizationModalBtnContainer"><div className="row"><div className="col-sm-6"><button className="secondaryRedBtn modalcancelbutton greyBackBtns bg-green-500  SimpleButton btnHoverEffectOutline" onClick={closeConnectButtonClick}>Cancel</button></div><div className="col-sm-6"><button className="modalauthorizationbutton SimpleButton btnHoverEffectOutline" onClick={closeConnectButtonClick} disabled>Transaction In progress</button></div></div></div>);
      await setTransactionInProgress(true)
      await writeToFireBase({
        firebasetimestamp:await firebaseDate(),
        error:false,
        errordescription:"Authorizing Matic",
        purpose:"Authorize Matic"
      });
      let conversionFees = 1;
      let result = await axios.post("/api/conversion/dollartomatic",{amount:conversionFees},{withCredentials:true})
      let buyingFees = result.data.conversion;
      let conversionRate = result.data.conversionRate;
      authorizationFeesData.buyingFees = buyingFees;
      authorizationFeesData.conversionRate = conversionRate;
      if(!result.data.success){
        
        await setModalHeader("Failed");
        await setModalBody(<p className="modalpurchasebody3">Failed Operation</p>);
        await setModalFooter(<div className="row custombuydeswapModalBtnsContainer"><div className="col-6 col-sm-6"><button className="failedModalBtn SimpleButton btnHoverEffectOutline"  onClick={closeConnectButtonClick}>Close</button></div></div>) 
        setShow(true)
        await writeToFireBase({
          firebasetimestamp:await firebaseDate(),
          error:false,
          errordescription:"Failed due to usd to matic conversion rate ",
          purpose:"Gas price conversion failed"
        });
        await setTransactionInProgress(false)
        return;
      }
      //
      //etherumTransaction
      
      let paidTransactionFees = await etherumTransaction({
        sender:metaMaskValues.metamaskaccount,
        amount:buyingFees.toString(),
        receiver:`${process.env.NEXT_PUBLIC_ADMIN_POLYGON_PUBLIC_KEY}`,
      })
      if(paidTransactionFees&&paidTransactionFees.transactionHash!=undefined){
        let savedResult = await saveAuthorizationFeesInDatabase({
          packageid:authorizationFeesData.id,
          amount:conversionFees,
          fees:buyingFees,
          Currency:"Matic",
          txhash:paidTransactionFees.transactionHash,
          conversionrate:conversionRate
        })
        authorizationFeesData.purchaseCardFeesTxHash = paidTransactionFees.transactionHash;
        authorizationFeesData.savedFeesID = savedResult._id;
        setShow(true)
        setModalHeader("Purchase");
        setModalBody(<p className="modalpurchasebody3">Purchasing fees</p>);
        setModalFooter(<div className="row purchaseBtnContainer"><div className="col-6 col-sm-6"><button className="failedModalBtn SimpleButton btnHoverEffectOutline" onClick={()=>{purchasePack(authorizationFeesData)}}>Purchase</button></div></div>)
        setTransactionInProgress(true)
        writeToFireBase({
          firebasetimestamp:await firebaseDate(),
          error:false,
          errordescription:"Gas fees saved in the database",
          purpose:"Gas fees"
        });
      }else{
        //Failed
        await setShow(true)
        await setModalHeader("Failed");
        await setModalBody(<p className="modalpurchasebody3">Failed Operation</p>);
        await setModalFooter(<div className="row custombuydeswapModalBtnsContainer"><div className="col-6 col-sm-6"><button className="failedModalBtn SimpleButton btnHoverEffectOutline" onClick={closeConnectButtonClick}>Close</button></div></div>)
        await setTransactionInProgress(false)
        await writeToFireBase({
            firebasetimestamp:await firebaseDate(),
            error:true,
            errordescription:"Transaction cancel by the user or transaction failed",
            purpose:"Gas fees transaction failed"
        });
      }
      <Loader loading={false} />;
    }catch(e){
      await setShow(true)
      await setModalHeader("Failed");
      await setModalBody(<p className="modalpurchasebody3">Failed Operation</p>);
      await setModalFooter(<div className="row custombuydeswapModalBtnsContainer"><div className="col-6 col-sm-6"><button className="failedModalBtn SimpleButton btnHoverEffectOutline"  onClick={closeConnectButtonClick}>Close</button></div></div>) 
    }
  }*/
  const quantitySwap = async (quantityData) => {
    try {
      let qunatity = document.getElementById("packquantity");

      if (qunatity.value.trim() == "") {
        let QuantityWrongmessage = document.getElementById(
          "qunatityWrontmessage"
        );
        QuantityWrongmessage.innerText = "Please enter valid value";
      }
      if (!Number.isInteger(qunatity.value)) {
        let QuantityWrongmessage = document.getElementById(
          "qunatityWrontmessage"
        );
        QuantityWrongmessage.innerText = "Please enter valid value";
      }

      if (qunatity.value < 1) {
        //
        let QuantityWrongmessage = document.getElementById(
          "qunatityWrontmessage"
        );
        QuantityWrongmessage.innerText = "Please enter quantity greater than 0";
        //qunatityWrontmessage
        return;
      }

      let QuantityWrongmessage = document.getElementById(
        "qunatityWrontmessage"
      );
      QuantityWrongmessage.innerText = "";

      quantityData.quantity = qunatity.value;

      //
      /*await writeToFireBase({
        firebasetimestamp:await firebaseDate(),
        error:false,
        errordescription:"User selected qunatity "+qunatity.value,
        purpose:"Quantity"
      })*/
      await setShow(true);
      await setModalHeader(
        <label className="purchaseheader font-bold">
          Authorization Contract
        </label>
      );
      await setModalBody(
        <div className="modalcontentSuccess modalWithImage">
          <div className="topImage">
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
          <div className="contentbox">
            <h5>Allow Deswap To Use Your Matic ?</h5>
            <p>
              Confirmation Of The Matic Token To Intract With DESWAP Contract
            </p>
          </div>
        </div>
      );
      await setModalFooter(
        <div className="cointainer-fluid AuthorizationModalBtnContainer">
          <div className="row ">
            <div className="col-sm-6">
              <button
                className=" secondaryRedBtn modalcancelbutton greyBackBtns bg-green-500 SimpleButton btnHoverEffectOutline"
                onClick={closeConnectButtonClick}
              >
                Cancel
              </button>
            </div>
            <div className="col-sm-6">
              <button
                className="modalauthorizationbutton SimpleButton btnHoverEffectOutline"
                onClick={() => {
                  purchasePack(quantityData);
                }}
              >
                Authorization
              </button>
            </div>
          </div>
        </div>
      );
      //setModalFooter(<div className="row"><div className="col-6 col-sm-6"></div><div className="col-6 col-sm-6"><button onClick={closeConnectButtonClick}>Close</button></div></div>);
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
      setTransactionInProgress(false);
      await setShow(true);
      await setModalHeader("Failed");
      await setModalBody(
        <p className="modalpurchasebody3">Failed Operation</p>
      );
      await setModalFooter(
        <div className="row custombuydeswapModalBtnsContainer">
          <div className="col-6 col-sm-6">
            <button
              className="failedModalBtn SimpleButton btnHoverEffectOutline"
              onClick={closeConnectButtonClick}
            >
              Close
            </button>
          </div>
        </div>
      );
      await setTransactionInProgress(false);
    }
  };
  //Function will be called when button is click
  const authorizedButtonClick = async (packdata) => {
    try {
      setcurrentFirebaseID(await firebaseIDDate());
      await data.metaMaskValue();

      //Check wether wallet is connected or not
      //if wallet is not connected then display pop message and return
      if (!metaMaskValues.metamaskconnected) {
        //Metamask not connect show error message
        setShow(true);
        setTransactionInProgress(false);
        setModalHeader("Connect Wallet");
        setModalBody(
          <div className="modalcontentSuccess buydeswap modalWithImage">
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
            </div>
          </div>
        );
        setModalFooter(
          <div className="buydeswapbuttonCotainer">
            <button
              className="modalBtn btnHoverEffectOutline"
              onClick={closeConnectButtonClick}
            >
              Ok
            </button>
          </div>
        );
        packdata.targete.target.innerText = "Authorize USDC";
        return;
      }

      //if wallet is connected check transaction is not progress
      //console.log("Transaction in progress : ",transactionInProgess)
      if (transactionInProgess) {
        //console.log("Transaction in progress yes ",transactionInProgess)
        //Transaction is progress show modal only
        setShow(true);
      } else {
        //console.log("Showing quanitty")
        //Generate Unique ID for saving in the database
        setShow(true);
        packdata.targete.target.innerText = "Authorizing...";
        setTransactionInProgress(true);
        setcurrentTargetButton(packdata.targete);
        currentSelectedTarget = packdata.targete;
        setModalHeader(<label>Quantity</label>);
        setModalBody(
          <div className="row">
            <div className="col-sm-12"></div>
            <div className="col-sm-12">
              <p className="modalpurchasebody2">
                <input
                  className=""
                  style={{ color: "white" }}
                  id="packquantity"
                  type="number"
                  min="1"
                  step="1"
                  defaultValue="1"
                  placeholder="No of calming packs"
                  autoComplete="off"
                ></input>
              </p>
            </div>
            <div className="col-sm-12" id="qunatityWrontmessage"></div>
          </div>
        );
        setModalFooter(
          <div className="row custombuydeswapModalBtnsContainer">
            <div className="col-6 col-sm-6">
              <button
                className=" secondaryRedBtn modalcancelbutton greyBackBtns SimpleButton btnHoverEffectOutline"
                onClick={closeConnectButtonClick}
              >
                Close
              </button>
            </div>
            <div className="col-6 col-sm-6">
              <button
                className="SimpleButton btnHoverEffectOutline"
                onClick={() => {
                  quantitySwap(packdata);
                }}
              >
                Purchase
              </button>
            </div>
          </div>
        );
        setcurrentFirebaseID(await firebaseIDDate());
      }
      //console.log("Clicked on button : ",packdata)
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
      console.log("Failed", e);
      setModalHeader(<label>Failed</label>);
      setModalBody(<p className="modalpurchasebody3">Failed Operation</p>);
      setTransactionInProgress(false);
      setModalFooter(
        <div className="row custombuydeswapModalBtnsContainer">
          <div className="col-6 col-sm-6">
            <button
              className="failedModalBtn SimpleButton btnHoverEffectOutline"
              onClick={closeConnectButtonClick}
            >
              Close
            </button>
          </div>
        </div>
      );
    }
  };
  const createPackList = async (packlist) => {
    try {
      {
        /*<Loader loading={true} />*/
      }
      let packList = [];
      for (let index in packlist) {
        packList.push(
          <BuyDswapPackCard
            title={packlist[index].PackName}
            daw={packlist[index].DAW}
            price={packlist[index].Amount}
            bonus={packlist[index].Bonous}
            authorizedButton={authorizedButtonClick}
            lockedperiod={packlist[index].LockedPeriod}
            lockedperiodtype={packlist[index].LockedPeriodType}
            id={packlist[index]._id}
          />
        );
      }
      if (packList.length < 1) {
        setpackData(<NodataCard />);
      } else {
        setpackData(packList);
      }
      {
        /*<Loader loading={true} />*/
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
      setpackData(<NodataCard />);
      console.log("Failed to fetch");
    }
  };

  const closeConnectButtonClick = async () => {
    try {
      setShow(false);

      if (!transactionInProgess) {
        if (currentTargetButton) {
          currentTargetButton.target.innerText = "Authorize USDC";
        }
        if (currentSelectedTarget) {
          currentSelectedTarget.target.innerText = "Authorize USDC";
        }
      }

      await writeToFireBase({
        firebasetimestamp: await firebaseDate(),
        error: true,
        errordescription: "Hide",
        purpose: "Hide",
      });

      if (!transactionInProgess) {
        setcurrentTargetButton(null);
        setcurrentFirebaseID("");
        currentSelectedTarget = null;
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
    }
  };

  useEffect(() => {
    let intervalValue;
    let cancelled = false;

    (async () => {
      try {
        let result = await axios.post(
          `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/pack/fetch`,
          {},
          {
            withCredentials: true,
            headers: {
              "security-set": false,
            },
          }
        );
        if (cancelled) return;
        let data = result?.data?.data;
        data = await SanitizeRequestObject(data);
        await createPackList(data);
        await connectToFireBase();
        intervalValue = setInterval(countDownFunction, 1000);
        setCountDownTimeOut(intervalValue);
      } catch (e) {
        if (cancelled) return;
        setpackData(<FailedToFetchData />);
        console.log("Failed to fetch data : ", e);
      }
    })();

    return () => {
      cancelled = true;
      if (intervalValue) clearInterval(intervalValue);
      componetUnmountFun();
    };
  }, []);

  return (
    <Fragment>
      <Head>
        <title>Buy Deswap</title>
      </Head>
      <div className="buydswapContainer">
        <div className="buydswapInner">
          <div className="title">
            <h1>Buy Deswap</h1>
          </div>
          <div className="bdMain">
            <div className="tabsContainer">
              <ul className="mb-3 nav nav-tabs">
                <li
                  className="nav-item"
                  onClick={() => {
                    setDisplayDeswapList(true);
                  }}
                >
                  <button
                    type="button"
                    className={`nav-link ${displayDeswapList && "active"}`}
                  >
                    Deswap List
                  </button>
                </li>
                <li
                  className="nav-item"
                  onClick={() => {
                    setDisplayDeswapList(false);
                  }}
                >
                  <button
                    type="button"
                    className={`nav-link ${!displayDeswapList && "active"}`}
                  >
                    Activated
                  </button>
                </li>
              </ul>
              <div className="tab-content">
                <div
                  className="bdCardsContainer"
                  hidden={!displayDeswapList}
                >
                  {packData}
                </div>
                <div hidden={displayDeswapList}>
                  <ActivatedPackListTab />
                </div>
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
        {/* <Modal
        show={showAuthorization}
        cross={true}
        onClose={() => setShowAuthorization(false)}
      >
        <div className="editProfileForm">
          <h2>Edit Profile</h2>
          <div className="profileImgContainer">
            <input type="file" />
          </div>
          <div className="inputsList"></div>
        </div>
      </Modal> */}
        {/* success modal */}
        {/* <Modal
        show={showSuccess}
        cross={true}
        onClose={() => setShowSuccess(false)}
      >
        <div className="editProfileForm">
          <h2>Edit Profile</h2>
          <div className="profileImgContainer">
            <input type="file" />
          </div>
          <div className="inputsList"></div>
        </div>
      </Modal> */}
      </div>
      {/* {loadingState && <Loader />} */}
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

const mapStateToProps = (state) => {
  metaMaskValues = state.metamaskConn;
  return { metamaskConn: state.metamaskConn };
};


const mapDispatchToProps = (dispatch) => {
  return {
    connectToMeta: bindActionCreators(connectToMeta, dispatch),
    metaMaskDisconnected: bindActionCreators(metaMaskDisconnected, dispatch),
    metaMaskValue: bindActionCreators(metaMaskValue, dispatch),
  };
};
Buydswap.PageLayout = UserDashboardLayout;

export default connect(mapStateToProps, mapDispatchToProps)(Buydswap);
