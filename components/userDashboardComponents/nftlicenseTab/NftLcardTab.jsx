import React, { useState, useEffect } from "react";
import NftLicenseCard from "./NftLicenseCard";

import firebasedb from "../../../utils/connection/firebaseconnection";
import { readCollection } from "../../../utils/firebase/collection";
import {
  readDocument,
  insertDocument,
  deleteDocument,
  updatedDocument,
} from "../../../utils/firebase/document";
import { firebaseDate, firebaseIDDate } from "../../../utils/common/date";
import {
  sendMetaMaskTransaction,
  sendContractTransaction,
} from "../../../utils/wallet/index";
import axios from "../../../utils/common/axios";
import { encryptRequestBody } from "@/utils/common/jwtToken";
import { connect, useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import {
  connectToMeta,
  metaMaskDisconnected,
  metaMaskValue,
} from "../../../redux/actions/metamask";
import { wrapper } from "../../../redux/store/store";
import BootstrapModal from "@/components/reusables/BootstrapModal";
import NodataCard from "@/components/reusables/NodataCard";
import Image from "next/image";
import FailedToFetchData from "@/components/reusables/FailedToFetchData";
import Loader from "@/components/reusables/loader/Loader";
import { requestBodyEncryptionUnprotected } from "@/utils/common/jwtToken";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  SanitizeRequestString,
  SanitizeRequestObject,
} from "../../../utils/common/sanitize";

const noDataComponent = NodataCard;
var metaMaskValues = null;
function NftLcardTab(data) {
  const [showWalletConnectMessage, setShowWalletConnectMessage] =
    useState(false);
  const [loading, setLoading] = useState(false);

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
  let currentButtonTarget = null;
  //api/users/nftlicense/insert
  const savePurchasedPack = async (data, index, maxTry = 5) => {
    try {
      const sanData = await SanitizeRequestObject(data);
      let encryptionData = await encryptRequestBody(sanData);
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/nftlicense/insert`,
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
      if (index < maxTry) {
        return await savePurchasedPack(data, index + 1);
      }
    }
  };

  //
  const saveAuthorizationFeesInDatabase = async (data, index, maxTry = 5) => {
    try {
      const sanData = await SanitizeRequestObject(data);
      let encryptionData = await encryptRequestBody(sanData);
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/nftlicensefees/insert`,
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
      if (index < maxTry) {
        return await saveAuthorizationFeesInDatabase(data, index + 1);
      }
    }
  };

  const writeToFireBase = async (messageDetails) => {
    try {
      //connect.log("Writing to firebase : ",firebaseCollection)
      //
      if (firebaseCollection == null) {
        return;
      }
      //Reading document
      let readDocumentResult = await readDocument(
        firebaseCollection,
        data.data.users.uuid,
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
          data.data.users.uuid,
          dataInsertToDB
        );
      } else {
        //
        let insertedDocument = await insertDocument(
          firebaseCollection,
          data.data.users.uuid,
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
      console.log("Failed to write");
    }
  };

  const etherumTransaction = async (data) => {
    try {
      let params;
      data.amount = await metaMaskValues.metaconn.web3.utils.toWei(data.amount);
      let count = await metaMaskValues.metaconn.web3.eth.getTransactionCount(
        data.sender
      );
      //
      let gasPrice = await metaMaskValues.metaconn.web3.eth.getGasPrice();
      let transactionHash;
      if (data.contractAddress) {
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
      await setModalHeader("Transaction");
      //TO DO : <Loader></Loader>
      //<Loader loading={true} />
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
            <h5>
              Please Do Not Close Windows/Refresh Page Until Transaction Is
              Complete
            </h5>
          </div>
        </div>
      );
      await setModalFooter(
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
      await setTransactionInProgress(true);
      await writeToFireBase({
        firebasetimestamp: await firebaseDate(),
        error: false,
        errordescription: "",
        purpose: "Staking purchase",
      });
      const price = await SanitizeRequestString(purchasingData.price);
      const quality = await SanitizeRequestString(
        purchasingData.nftQuantityNum
      );
      let encryptionData = await requestBodyEncryptionUnprotected({
        amount: purchasingData.price * purchasingData.nftQuantityNum,
      });
      let { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/conversion/dollartomatic`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      const data1 = await SanitizeRequestObject(data);
      let priceInUSD = purchasingData.price * purchasingData.nftQuantityNum;
      let priceInMatic = data1.conversion;
      purchasingData.priceInUSD = priceInUSD;
      purchasingData.conversionrate = data1.conversionRate;
      purchasingData.priceInMatic = priceInMatic;
      let result = await etherumTransaction({
        sender: metaMaskValues.metamaskaccount,
        amount: priceInMatic.toString(),
        receiver: `${process.env.NEXT_PUBLIC_ADMIN_POLYGON_PUBLIC_KEY}`,
        //contractAddress:`${process.env.NEXT_PUBLIC_ADMIN_USDC_CONTRACT_ADDRESS}`
      });
      if (result && result.transactionHash != undefined) {
        //savePurchasedPack
        let savedResult = await savePurchasedPack(
          {
            packageid: purchasingData.id,
            quantity: purchasingData.nftQuantityNum,
            txhash: result.transactionHash,
            amount: purchasingData.price,
            totalamount: purchasingData.nftQuantityNum * purchasingData.price,
            //purchasingfeesid:purchasingData.savedFeesID
            amountinmatic: priceInMatic,
            conversionrate: purchasingData.conversionrate,
          },
          1
        );
        setShow(true);
        await setModalHeader("Success");
        await setTransactionInProgress(false);
        await setModalBody(
          <p className="modalpurchasebody2"> Operation Successful</p>
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
        await writeToFireBase({
          firebasetimestamp: await firebaseDate(),
          error: false,
          errordescription: "",
          purpose: "Staking purchase successfully",
        });

        currentButtonTarget.target.style.backgroundColor = "rgb(60 54 55)";
        currentButtonTarget.target.disabled = true;
      } else {
        //Failed
        await setShow(true);
        await setTransactionInProgress(false);
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
        await writeToFireBase({
          firebasetimestamp: await firebaseDate(),
          error: true,
          errordescription: "Failed to save transaction",
          purpose: "Staking purchase error",
        });
      }
      //<Loader loading={false} />
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
      await setTransactionInProgress(false);
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
      setShow(true)
      await setModalHeader(<label className="purchaseheader font-bold">Authorization Contract</label>);
      //TO DO : Add Loader
      //<Loader loading={true} />
      await setModalBody(<div className="row"><div className="col-sm-12"><p className="modalpurchasebody2"></p></div><div className="col-sm-12"><p className="modalpurchasebody3">Please do not close windows/refresh page until transaction is complete</p></div></div>)
      await setModalFooter(<div className="cointainer-fluid AuthorizationModalBtnContainer"><div className="row"><div className="col-sm-6"><button className="modalcancelbutton greyBackBtns bg-green-500 text-white  SimpleButton btnHoverEffectOutline" onClick={closeConnectButtonClick}>Cancel</button></div><div className="col-sm-6"><button className="modalauthorizationbutton SimpleButton btnHoverEffectOutline" onClick={closeConnectButtonClick} disabled>Transaction In progress</button></div></div></div>);
      await setTransactionInProgress(true)
      await writeToFireBase({
        firebasetimestamp:await firebaseDate(),
        error:false,
        errordescription:"Authorizing Matic",
        purpose:"Authorize Matic"
      });
      //
      let conversionFees = 1;
      let result = await axios.post("/api/conversion/dollartomatic",{amount:conversionFees},{withCredentials:true})
      let buyingFees = result.data.conversion;
      let conversionRate = result.data.conversionRate;
      authorizationFeesData.buyingFees = buyingFees;
      authorizationFeesData.conversionRate = conversionRate;
      if(!result.data.success){
        await setShow(true)
        await setModalHeader("Failed");
        await setModalBody(<p className="modalpurchasebody3">Failed Operation</p>);
        await setModalFooter(<div className="row custombuydeswapModalBtnsContainer"><div className="col-6 col-sm-6"><button className="failedModalBtn SimpleButton btnHoverEffectOutline"  onClick={closeConnectButtonClick}>Close</button></div></div>) 
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
        receiver:`${process.env.NEXT_PUBLIC_ADMIN_BSC_PUBLIC_KEY}`,
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
        await setModalHeader("Purchase");
        await setModalBody(<p className="modalpurchasebody3">Kindly click on purchase button</p>);
        await setModalFooter(<div className="row purchaseBtnContainer"><div className="col-6 col-sm-6"><button className="failedModalBtn SimpleButton btnHoverEffectOutline" onClick={()=>{purchasePack(authorizationFeesData)}}>Purchase</button></div></div>)
        await setTransactionInProgress(true)
        await writeToFireBase({
          firebasetimestamp:await firebaseDate(),
          error:false,
          errordescription:"Gas fees saved in the database",
          purpose:"Gas fees"
        });
      //<Loader loading={false} />

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
      <Loader loading={false} />
    }catch(e){
      await setTransactionInProgress(false)
      await setShow(true)
      await setModalHeader("Failed");
      await setModalBody(<p className="modalpurchasebody3">Failed Operation</p>);
      await setModalFooter(<div className="row custombuydeswapModalBtnsContainer"><div className="col-6 col-sm-6"><button className="failedModalBtn SimpleButton btnHoverEffectOutline"  onClick={closeConnectButtonClick}>Close</button></div></div>) 
    }
  }*/

  const checkPurchasedLicense = async (data) => {
    try {
      //pages\api\users\nftlicense\checkpurchased\index.js
      const sanData = await SanitizeRequestObject(data);
      let encryptionData = await encryptRequestBody(sanData);
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/nftlicense/checkpurchased`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      let purhcased = result.data.data;
      if (purhcased) {
        return true;
      }
      return false;
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
      return true;
    }
  };
  const authorizedButtonClick = async (packdata) => {
    try {
      <Loader loading={true} />;

      await setcurrentFirebaseID(await firebaseIDDate());

      await data.metaMaskValue();

      //Check wether wallet is connected or not
      //if wallet is not connected then display pop message and return
      if (!metaMaskValues.metamaskconnected) {
        //Metamask not connect show error message
        await setShow(true);
        await setTransactionInProgress(false);
        await setModalHeader("Connect");
        await setModalBody(
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
        packdata.targete.target.innerText = "Purchase NFT";
        //packdata.targete.target.innerText = "Authorize"
        return;
      }

      //if wallet is connected check transaction is not progress
      if (transactionInProgess) {
        //Transaction is progress show modal only
        setShow(true);
      } else {
        //Generate Unique ID for saving in the database

        setShow(true);

        packdata.targete.target.innerText = "Authorizing...";

        //await setTransactionInProgress(true)
        currentButtonTarget = packdata.targete;
        await setcurrentTargetButton(packdata.targete);
        let purchased = await checkPurchasedLicense({
          nftlicenseid: packdata.id,
        });
        if (purchased) {
          await setModalHeader(<label>Failed</label>);
          await setModalBody(
            <p className="modalpurchasebody3">License already purchased</p>
          );
          await setTransactionInProgress(false);
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
          return;
        }

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
                  className="modalcancelbutton secondaryRedBtn greyBackBtns bg-green-500 SimpleButton btnHoverEffectOutline"
                  onClick={closeConnectButtonClick}
                >
                  Cancel
                </button>
              </div>
              <div className="col-sm-6">
                <button
                  className="modalauthorizationbutton SimpleButton btnHoverEffectOutline"
                  onClick={() => {
                    purchasePack(packdata);
                  }}
                >
                  Authorization
                </button>
              </div>
            </div>
          </div>
        );
        //setModalHeader(<label>Quantity</label>);
        //setModalBody(<div className="row"><div className="col-sm-12"></div><div className="col-sm-12"><p className="modalpurchasebody2"><input className="" autoComplete="off" style={{color:"white"}} id="packquantity" type="number" min="1" step="1" defaultValue="1" placeholder="No of claming packs" ></input></p></div><div className="col-sm-12" id="qunatityWrontmessage"></div></div>);
        //setModalFooter(<div className="row custombuydeswapModalBtnsContainer"><div className="col-6 col-sm-6"><button className="SimpleButton btnHoverEffectOutline" onClick={closeConnectButtonClick}>Close</button></div><div className="col-6 col-sm-6"><button className="SimpleButton btnHoverEffectOutline" onClick={()=>{quantitySwap(packdata)}}>Purchase</button></div></div>)
        setcurrentFirebaseID(await firebaseIDDate());
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
      //setShow(true)
      console.log("Failed", e);
      await setModalHeader(<label>Failed</label>);
      await setModalBody(
        <p className="modalpurchasebody3">Failed Operation</p>
      );
      await setTransactionInProgress(false);
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
    }
  };
  // nft modal to provide purchase link

  const nftPurchaseModalFunc = async () => {
    try {
      setShow(true);
      await setModalHeader(
        <label className="purchaseheader font-bold">Buy The License</label>
      );
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
            <h5>You can buy the license exclusively manually at this link</h5>
            <a href="https://metaverso.sergioalbertirealestate.it/it/">
              https://metaverso.sergioalbertirealestate.it/it/
            </a>
          </div>
        </div>
      );
      await setModalFooter(
        <div className="row custombuydeswapModalBtnsContainer">
          <div className="col-6 col-sm-6">
            <button
              className="failedModalBtn SimpleButton btnHoverEffectOutline"
              onClick={closeConnectButtonClick}
            >
              OK
            </button>
          </div>
        </div>
      );
    } catch (e) {
      console.log("Failed", e);
    }
  };

  const createNFTLicense = async (packlist, maxValue) => {
    try {
      let packList = [];
      for (let index in packlist) {
        packList.push(
          <NftLicenseCard
            name={packlist[index].Name}
            description={packlist[index].Description}
            price={packlist[index].Price}
            currency={packlist[index].Currency}
            authorizedButton={authorizedButtonClick}
            nftPurchaseModalFunc={nftPurchaseModalFunc}
            lockup={packlist[index].LookUp}
            lockupinterval={packlist[index].LookUpInterval}
            id={packlist[index]._id}
            imgPlaceholder={packlist[index].Image}
            maxlicense={maxValue.Index}
            currentIndex={packlist[index].Index}
          />
        );
      }
      if (packList.length < 1) {
        setpackData(<NodataCard />);
      } else {
        setpackData(packList);
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
      setLoading(false);
      setpackData(<FailedToFetchData />);
      console.log("Failed to fetch");
    }
  };

  //
  //
  const closeConnectButtonClick = async () => {
    try {
      setShow(false);

      if (!transactionInProgess) {
        //Transaction is not in progress
        //
        if (currentTargetButton) {
          currentTargetButton.target.innerText = "Purchase NFT";
        }
        //currentButtonTarget = packdata.targete;
        if (currentButtonTarget) {
          currentButtonTarget.target.innerText = "Purchase NFT";
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
        currentButtonTarget = null;
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
  //
  const connectToFireBase = async () => {
    try {
      //
      let collectionInfo = await readCollection(
        firebasedb,
        `${process.env.NEXT_PUBLIC_nftlicensepurchase}`
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
      console.log("Failed to read ", e);
    }
  };

  useEffect(async () => {
    try {
      setLoading(true);
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/nftlicense/fetch`,
        {},
        {
          withCredentials: true,
          headers: {
            "security-set": false,
          },
        }
      );
      let data = result.data.data;
      setLoading(result && false);
      await createNFTLicense(data, result.data.max);
      await connectToFireBase();
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
      setpackData(<FailedToFetchData />);
      console.log("Failed to fetch data : ", e);
    }
  }, []);

  const buyNFTLicenseFunction = () => {
    setShowWalletConnectMessage(true);
  };

  const NFTRealEstateLincenseDetails = {
    name: "NFT REAL ESTATE LICENSE",
    rateDollor: "50",
    rateUSDT: "500",
    description:
      "Join the leading NFT platform to get all the details about secret upcoming NFT projects. Get the regular updates and event alerts before the launch.",
    claimLockup: "12 Months",
  };

  return (
    <>
      <div className="NftlicenseCardList">{packData}</div>
      <BootstrapModal
        show={show}
        handleClose={closeConnectButtonClick}
        modaltitle={modalheader}
        modalbody={modalbody}
        modalfooter={modalfooter}
      ></BootstrapModal>
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

const mapStateToProps = (state) => {
  metaMaskValues = state.metamaskConn;
  return { metamaskConn: state.metamaskConn };
};

export const getStaticProps = wrapper.getStaticProps((store) => () => {
  store.dispatch(metaMaskValue());
});

const mapDispatchToProps = (dispatch) => {
  return {
    connectToMeta: bindActionCreators(connectToMeta, dispatch),
    metaMaskDisconnected: bindActionCreators(metaMaskDisconnected, dispatch),
    metaMaskValue: bindActionCreators(metaMaskValue, dispatch),
  };
};
/**/
export default connect(mapStateToProps, mapDispatchToProps)(NftLcardTab);
//export default NftLcardTab;
