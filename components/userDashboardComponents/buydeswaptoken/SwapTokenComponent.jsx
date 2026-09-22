import React, { useState } from "react";
import Image from "next/image";
import HistoryModal from "./HistoryModal";
import Historyicon from "@/assets/svgAssets/Historyicon";
import Timeicon from "@/assets/svgAssets/Timeicon";
import DownArrowIcon from "@/assets/svgAssets/DownArrowIcon";
import Modal from "@/components/reusables/Modal";
import BootstrapModal from "@/components/reusables/BootstrapModal";
import {
  SanitizeRequestString,
  SanitizeRequestObject,
} from "../../../utils/common/sanitize";

import {
  connectToMeta,
  metaMaskDisconnected,
  metaMaskValue,
} from "../../../redux/actions/metamask";
import {
  connectToWallet,
  fetchMetaMaskAccount,
  etherumFetchAccount,
  web3USDCContract,
  web3DeSwapContract,
} from "../../../utils/wallet/index";
import firebasedb from "../../../utils/connection/firebaseconnection";
import { firebaseDate, firebaseIDDate } from "../../../utils/common/date";
import {
  sendMetaMaskTransaction,
  sendContractTransaction,
} from "../../../utils/wallet/index";
import axios from "../../../utils/common/axios";
import {
  convertToUSD,
  convertToEuro,
  convertToEuroWithoutPrecision,
} from "../../../utils/common/currencyconversion";
import { encryptRequestBody } from "@/utils/common/jwtToken";
import { requestBodyEncryptionUnprotected } from "@/utils/common/jwtToken";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SwapTokenComponent({ toggleGraphView }) {
  let contractAddressKey = null;
  let userPublicAddress = "";
  let web3Connection = null;
  const [showSuccess, setShowSuccess] = useState(false);
  const [firebaseCollection, setFirebaseCollection] = useState(null);
  const [currentFirebaseID, setcurrentFirebaseID] = useState("");
  const [transactionInProgess, setTransactionInProgress] = useState(false);
  const [show, setShow] = useState(false);

  const [modalheader, setModalHeader] = useState("Connect Wallet");
  const [connectionStatus, setconnectionStatus] = useState(false);

  const [modalbody, setModalBody] = useState(
    <div className="modalcontentWallet">
      <div className="iconBoxContainer">
        <div
          className="iconBox"
          onClick={async () => {
            await handleMetaConnect("metamask");
          }}
        >
          <Image
            src={"/images/metamask.png"}
            width={48}
            height={48}
            alt=" icon"
            className="icon activeImg"
            loading="lazy"
          />
          <p>MetaMask</p>
        </div>
        <div
          className="iconBox disabledBox"
          onClick={async () => {
            await handleMetaConnect("coin98");
          }}
        >
          <Image
            src={"/images/coin98.png"}
            width={48}
            height={48}
            alt=" icon"
            className="icon"
            loading="lazy"
          />
          <p>Coin 98</p>
        </div>
        <div
          className="iconBox disabledBox"
          onClick={async () => {
            await handleMetaConnect("walletconnect");
          }}
        >
          <Image
            src={"/images/walletconnect.png"}
            width={48}
            height={48}
            alt=" icon"
            className="icon"
            loading="lazy"
          />
          <p>Wallet Connect</p>
        </div>
        <div
          className="iconBox disabledBox"
          onClick={async () => {
            await handleMetaConnect("trustwallet");
          }}
        >
          <Image
            src={"/images/trustwallet.png"}
            width={48}
            height={48}
            alt=" icon"
            className="icon"
            loading="lazy"
          />
          <p>Trust Wallet</p>
        </div>
      </div>
    </div>
  );
  const [modalfooter, setModalFooter] = useState(null);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [buttonText, setButtonText] = useState("Connect Wallet");
  const [walletConnect, setWalletConnect] = useState({
    walletStatus: false,
    web3Connection: null,
    errorWhileConnection: false,
    contract: null,
    publicKey: "",
  });
  const [walletBalance, setWalletBalances] = useState({
    bnb: "0,00",
    ntr: "0,00",
  });
  const [swapNTRValue, setSwapNTRValue] = useState("0,00");
  const [swapBNBValue, setSwapBNBValue] = useState("0,00");

  const writeToFireBase = async () => {
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
      console.log("Failed to write");
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

  const formatWei = async (wei) => {
    return Number(wei) / 1e18;
  };

  const fetchUser = async () => {
    try {
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/user/fetchUsers`,
        {},
        {
          withCredentials: true,
          headers: {
            "security-set": false,
          },
        }
      );
      const sanData = await SanitizeRequestObject(result.data.data);
      return sanData;
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
      console.log("Fail to fetch users list");
    }
  };

  const showHistoryPopUP = () => {
    setHistoryOpen(true);
  };
  const etherumTransaction = async (data) => {
    try {
      let params;
      data.amount = await walletConnect.web3Connection.web3.utils.toWei(
        data.amount
      );
      let count =
        await walletConnect.web3Connection.web3.eth.getTransactionCount(
          data.sender
        );
      //
      let gasPrice = await walletConnect.web3Connection.web3.eth.getGasPrice();
      let transactionHash;
      if (data.contractAddress) {
        transactionHash = await sendContractTransaction(
          walletConnect.web3Connection.web3contract,
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
          walletConnect.web3Connection.web3,
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
      console.log("Metamask transaction failed ", e);
      await writeToFireBase({
        firebasetimestamp: await firebaseDate(),
        error: true,
        errordescription: "Etherum transaction error : " + e.message,
        purpose: "Etherum transaction",
      });
      return null;
    }
  };
  const fetchDeswapBalance = async () => {
    try {
      let result = await contractAddressKey.methods
        .balanceOf(userPublicAddress)
        .call({ from: userPublicAddress });

      //
      let convertedValue = await formatWei(result);
      return convertedValue;
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
      console.log("Fetch to fetch Deswap Balance : ", e);
      return 0;
    }
  };

  const fetchMaticBalance = async () => {
    try {
      let result = await web3Connection.web3.eth.getBalance(userPublicAddress);

      let convertedValue = await formatWei(result);
      return convertedValue;
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
      console.log("Fetch to fetch Deswap Balance : ", e);
      return 0;
    }
  };

  const saveInDatabase = async (data, index, maxtry = 3) => {
    try {
      await SanitizeRequestObject(data);
      let encryptionData = await encryptRequestBody({
        publickey: data.publickey,
        amountDAW: data.ntr,
        conversionrate: data.conversionRate,
        amountMatic: data.BNB,
        txhash: data.txhash,
        sendFor: `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/transaction/add`,
        purpose: "AddTransactionInDatabase",
      });
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/transaction/add`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
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
      console.log(e);
      if (index < maxtry) {
        await saveInDatabase(data, index + 1);
      }
    }
  };

  const fetchAccountBalance = async () => {
    try {
      //

      let BNBBalance = await fetchMaticBalance();

      let walletbalancesFetched = {
        ...walletBalance,
        bnb: convertToEuro(BNBBalance.toFixed(4)),
      };
      await setWalletBalances(walletbalancesFetched);
      let NTRBalance = await fetchDeswapBalance();
      walletbalancesFetched = {
        ...walletbalancesFetched,
        ntr: convertToEuro(NTRBalance.toFixed(4)),
      };
      await setWalletBalances(walletbalancesFetched);
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
      console.log("Failed to fetch account balance ", e);
    }
  };

  const sendTransaction = async () => {
    try {
      let ntrValue = await convertToUSD(swapNTRValue);
      let bnbValue = await convertToUSD(swapBNBValue);
      ntrValue = Number(ntrValue);
      bnbValue = Number(bnbValue);

      if (isNaN(ntrValue)) {
        //Add pop - invalid ntr value
        // toast.error(`invalid Deswap value`);
        toast.error(`invalid Deswap value`, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }
      if (isNaN(bnbValue)) {
        //Add pop - invalid bnb value
        // toast.error(`invalid BNB value`);
        toast.error(`Invalid BNB Value`, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }

      if (ntrValue == 0) {
        //Add pop - message 0 value
        // toast.error(`Deswap Value is zero`);
        toast.error(`Deswap Value Is Zero`, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }
      await setButtonText("Swapping...");
      let result = await etherumTransaction({
        sender: walletConnect.publicKey,
        amount: bnbValue.toString(),
        receiver: `${process.env.NEXT_PUBLIC_ADMIN_POLYGON_PUBLIC_KEY}`,
      });

      let conversionRate = bnbValue / ntrValue;
      if (isNaN(conversionRate)) {
        conversionRate = 0;
      }
      if (result && result.transactionHash != undefined) {
        await saveInDatabase({
          publickey: walletConnect.publicKey,
          ntr: ntrValue.toString(),
          conversionRate: conversionRate,
          BNB: bnbValue.toString(),
          txhash: result.transactionHash,
        });
        //Add pop - transaction successfull
        // toast.success(`transaction successful`);
        toast.success(`Transaction Successful`, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        //Add pop - transaction failed
        // toast.error(`transaction failed`);
        toast.error(`Transaction Failed`, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      await setButtonText("Swap");
      web3Connection = walletConnect.web3Connection;
      let contract = await web3DeSwapContract(
        walletConnect.web3Connection.web3
      );
      contractAddressKey = contract;
      userPublicAddress = walletConnect.publicKey;
      //await fetchAccountBalance();
      const fetchBalanceTimeout = setTimeout(fetchAccountBalance, 2000);
    } catch (e) {
      await setButtonText("Swap");
      //Add pop - transaction failed
      // toast.error(`transaction failed`);
      toast.error(`transaction failed`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.log("Sending transaction : ", e);
    }
  };
  //
  //
  const fetchProfileData = async () => {
    try {
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/profile/info`,
        {},
        {
          withCredentials: true,
          headers: {
            "security-set": false,
          },
        }
      );

      let profileData = result.data.data;
      profileData = await SanitizeRequestObject(profileData);
      return profileData;
      /*setProfileData({
        emailid: profileData.emailid,
        username: profileData.username,
        walletaddress:
          profileData.walletaddress[profileData.walletaddress.length - 1],
      });*/
    } catch (e) {
      // toast.error(e.message, {
      //   position: "top-center",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      // });
      console.log(e);
    }
  };
  //
  //
  const bindonNetworChange = async (widowetherum) => {
    try {
      widowetherum.on("chainChanged", async (chainid) => {
        await setButtonText("Connect");
        walletConnect.walletStatus = false;
        await setWalletConnect({
          walletStatus: false,
          web3Connection: null,
          errorWhileConnection: false,
          contract: null,
          publicKey: "",
        });
        await handleMetaConnect("metamask");
      });
      widowetherum.on("accountsChanged", async (accounts) => {
        await setButtonText("Connect");
        walletConnect.walletStatus = false;
        await setWalletConnect({
          walletStatus: false,
          web3Connection: null,
          errorWhileConnection: false,
          contract: null,
          publicKey: "",
        });
        await handleMetaConnect("metamask");
      });

      widowetherum.on("disconnect", async (accounts) => {
        await setButtonText("Connect");
        walletConnect.walletStatus = false;
        await setWalletConnect({
          walletStatus: false,
          web3Connection: null,
          errorWhileConnection: false,
          contract: null,
          publicKey: "",
        });
        await handleMetaConnect("metamask");
      });
    } catch (e) {
      // toast.error(e.message, {
      //   position: "top-center",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      // });
      console.log("Error message : ", e);
    }
  };

  const handleMetaConnect = async (walletName) => {
    try {
      setButtonText("Connecting...");
      //setButtonText
      let result = await connectToWallet(walletName);

      let metamaskAccounts = await fetchMetaMaskAccount(result.web3);

      let contract = null;

      if (result.web3) {
        contract = await web3DeSwapContract(result.web3);
      }

      if (metamaskAccounts.length == 0 || metamaskAccounts == undefined) {
        metamaskAccounts = await etherumFetchAccount(result.ethereum);
      }

      await bindonNetworChange(result.ethereum);

      let userData = await fetchProfileData();

      if (
        userData.walletaddress[
          userData.walletaddress.length - 1
        ].toLowerCase() !=
        metamaskAccounts[metamaskAccounts.length - 1].toLowerCase()
      ) {
        //Invalid address
        await setShow(true);
        await setModalHeader("Failed");
        await setButtonText("Connect");
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
              <h5>Kindly Connect With Valid Public Key</h5>
            </div>
          </div>
        );
        return;
      }

      userPublicAddress = metamaskAccounts[metamaskAccounts.length - 1];
      web3Connection = result;
      contractAddressKey = contract;
      setShow(false);
      await setButtonText("Connected");
      await setWalletConnect({
        walletStatus: true,
        web3Connection: result,
        errorWhileConnection: false,
        contract: contract,
        publicKey: metamaskAccounts[metamaskAccounts.length - 1],
      });
      await setButtonText("Checking Balance...");
      await fetchAccountBalance();
      await setButtonText("Swap");
      /*
      //
      //Connect to wallet
      setButtonText(metamaskAccounts[0].substring(0, 6) +
      "...." +
      metamaskAccounts[0].substring(metamaskAccounts[0].length - 4))
      await connectToMeta({
        publickey: metamaskAccounts[metamaskAccounts.length-1],
        metaConn: result,
        web3contract: contract,
      });
      setconnectionStatus(true)*/
    } catch (e) {
      // toast.error(e.message, {
      //   position: "top-center",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      // });
      console.log(e);
      setModalHeader("Failed");
      setButtonText("Connect");
      setModalBody(
        <div className="modalcontentSuccess modalWithImage">
          <div className="topImage">
            <div className="wallet">
              <Image
                width={300}
                height={300}
                src="/images/Connectwallet.png"
                alt={"Connectwallet image"}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
          </div>

          <div className="contentbox">
            <h5>Failed To Connect To Wallet</h5>
            <p>Please Try Again</p>
          </div>
        </div>
      );
    }
  };

  //
  //
  const onConnectButtonClick = async (e) => {
    try {
      //e.target.disabled = true;
      if (!walletConnect.walletStatus && !walletConnect.errorWhileConnection) {
        setButtonText("Connecting...");
        setModalHeader(<label>Connect to wallet</label>);
        //setModalFooter()
        setShow(true);
        //Show pop and take value
        /*
        let connectionResult = null;
        connectionResult = await connectToMetaMask();
        
        let metaMaskAccount;
        metaMaskAccount = await fetchMetaMaskAccount(connectionResult.web3);
        if (metaMaskAccount.length == 0) {
          metaMaskAccount = await etherumFetchAccount(connectionResult.etherum);
        }
        const users = await fetchUser();
        
        
        let contract = await web3Contract(connectionResult.web3)
        contractAddressKey = contract;
        
        userPublicAddress = metaMaskAccount[0];
        web3Connection = connectionResult;
        if (users.MetaMaskAccountPublicKey[users.MetaMaskAccountPublicKey.length - 1].toLowerCase() !== userPublicAddress.toLowerCase()){
          //
          toast.error(`Please connect with registered public key`);
          e.target.disabled = false;  
          return;
        }*/

        //e.target.disabled = false;
        return;
      }

      //
      if (walletConnect.walletStatus) {
        await sendTransaction();
        //e.target.disabled = false;
        return;
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
      // });
      if (e == "Invalid chain id") {
        //Add pop - Failed to connect to Wallet
        // toast.error(`Please connect to polygon mainnet`);
        toast.error(`Please Connect To Polygon Mainnet`, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        //Add pop - Failed to connect to Wallet
        // toast.error(`Failed to connect to Wallet`);
        toast.error(`Failed To Connect To Wallet`, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      //e.target.disabled = false;
    }
  };

  const fetchBNBToNTR = async (data) => {
    try {
      const sanData = await SanitizeRequestObject(data);
      let encryptionData = await requestBodyEncryptionUnprotected(sanData);
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/swap/exchange`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      const sanString = await SanitizeRequestString(result.data.data.data);
      return sanString;
    } catch (e) {
      // toast.error(e.message, {
      //   position: "top-center",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      // });
      return 0;
    }
  };
  const fetchNTRToBNB = async (data) => {
    try {
      const sanData = await SanitizeRequestObject(data);
      let encryptionData = await requestBodyEncryptionUnprotected(sanData);
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/swap/exchange`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      const sanObj = await SanitizeRequestObject(result.data.data.data);
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
      // });
      console.log("Fetching Deswap to BNB failed : ", e);
    }
  };
  const fetchSwap = async (e, conversionFrom) => {
    try {
      //fetchAccountBalance
      let value = e.target.value;
      let convertedValue = await convertToUSD(value);
      if (convertedValue.includes(",")) {
        while (convertedValue.includes(",")) {
          convertedValue = convertedValue.replace(",", "");
        }
      }
      convertedValue = Number(convertedValue);
      if (isNaN(convertedValue)) {
        return;
      }

      let BNBValue, NTRValue;
      if (conversionFrom === "matic_to_deswap") {
        BNBValue = convertedValue;
        NTRValue = await fetchBNBToNTR({
          amount: convertedValue,
          converstion: "matic_to_deswap",
        });
      } else {
        //let less5percentageValue = (convertedValue*(5/100));
        NTRValue = convertedValue;
        //matic_to_deswap
        //deswap_to_matic
        BNBValue = await fetchNTRToBNB({
          amount: convertedValue,
          converstion: "deswap_to_matic",
        });
      }

      let oneNTRInBNB = Number(BNBValue) / Number(NTRValue);
      if (isNaN(oneNTRInBNB)) {
        oneNTRInBNB = 0;
      }
      /*
      let additional5percentage = NTRValue*(5/100);
      if(conversionFrom==="matic_to_deswap"){
        NTRValue = NTRValue-additional5percentage;
      }*/

      if (conversionFrom === "matic_to_deswap") {
        //swap_ntr
        if (document.getElementById("swap_ntr")) {
          document.getElementById("swap_ntr").value =
            convertToEuroWithoutPrecision(NTRValue.toString());
        }
        setSwapNTRValue(convertToEuroWithoutPrecision(NTRValue.toString()));
        setSwapBNBValue(convertToEuroWithoutPrecision(BNBValue.toString()));
      } else {
        if (document.getElementById("swap_bnb")) {
          document.getElementById("swap_bnb").value =
            convertToEuroWithoutPrecision(BNBValue.toString());
          //document.getElementById("swap_bnb").value = convertToEuroWithoutPrecision(BNBValue.toString())
        }
        setSwapNTRValue(convertToEuroWithoutPrecision(NTRValue.toString()));
        setSwapBNBValue(convertToEuroWithoutPrecision(BNBValue.toString()));
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
      // });
      console.log("Swapping : ", e);
    }
  };

  const closeConnectButtonClick = async () => {
    try {
      setShow(false);
      await writeToFireBase({
        firebasetimestamp: await firebaseDate(),
        error: true,
        errordescription: "Hide",
        purpose: "Hide",
      });
    } catch (e) {
      // toast.error(e.message, {
      //   position: "top-center",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      // });
      console.log(e);
    }
  };

  const MaxSwap = async (e) => {
    try {
      if (!walletConnect.walletStatus) {
        //Add pop - Wallet is not connected
        // toast.error(`Wallet is not connected`);
        toast.error(`Wallet Is Not connected`, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }

      if (e.target == undefined) {
        e.target = {};
      }

      e.target.value = walletBalance.bnb;
      if (document.getElementById("swap_bnb")) {
        let latestTransactionBlock =
          await walletConnect.web3Connection.web3.eth.getBlock("latest");
        let gaslimit = 0;
        if (latestTransactionBlock.gasLimit) {
          gaslimit = await formatWei(latestTransactionBlock.gasLimit);
        }
        let bnbNumber = await convertToUSD(walletBalance.bnb);
        bnbNumber = bnbNumber - gaslimit;

        //convertToEuroWithoutPrecision(bnbNumber)
        document.getElementById("swap_bnb").value =
          convertToEuroWithoutPrecision(bnbNumber.toString());
      }
      await fetchSwap(e, "matic_to_deswap");
    } catch (e) {
      // toast.error(e.message, {
      //   position: "top-center",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      // });
      console.log("Error : ", e);
    }
  };
  return (
    <div className="swaptokenContainer bg-bgg">
      <div className="swaptokenHead">
        <div className="graphtoggleContainer">
          <div className="graphtoggle">
            <button onClick={toggleGraphView}>
              {/* <Image
                width="24"
                height="24"
                src="/graphtoggleoffiicon.svg"
                alt=""
              /> */}
              <Historyicon />
            </button>
          </div>
        </div>
        <div className="heading">
          <h3>Swap</h3>
          <p>Buy Deswap In An Instant!</p>
        </div>
        <div className="historyiconContainer">
          <button className="historyicon" onClick={showHistoryPopUP}>
            <Timeicon />
          </button>
        </div>
      </div>
      <div className="swaptokenBody">
        <div className="inputformContainer upper">
          <div className="tokendropdownBtnContainer">
            <button className="tokendropdownBtn">
              <div className="tokenicon">
                <Image
                  width="24"
                  height="24"
                  src="/maticcoin.png"
                  loading="lazy"
                />
              </div>
              <h3 className="tokenname">Matic</h3>
            </button>
            <div className="balance">
              <p>Balance: {walletBalance.bnb ? walletBalance.bnb : "N/A"}</p>
            </div>
          </div>
          <div className="tokeninput">
            <input
              type="text"
              placeholder="0,0"
              autoComplete="off"
              id="swap_bnb"
              onChange={(e) => {
                fetchSwap(e, "matic_to_deswap");
              }}
            />
            <button
              className="greyBackBtns bg-green-500 text-white"
              onClick={(e) => {
                MaxSwap(e);
              }}
            >
              Max
            </button>
          </div>
        </div>
        <div className="swipeIcon">
          <button className="swipeiconBtn">
            <DownArrowIcon />
          </button>
        </div>
        <div className="inputformContainer down">
          <div className="tokendropdownBtnContainer">
            <button className="tokendropdownBtn">
              <div className="tokenicon">
                <Image
                  width="24"
                  height="24"
                  src="/logoicon.png"
                  loading="lazy"
                />
              </div>
              <h3 className="tokenname">Deswap</h3>
            </button>
            <div className="balance">
              <p>Balance: {walletBalance.ntr ? walletBalance.ntr : "N/A"}</p>
            </div>
          </div>
          <div className="tokeninput">
            <input
              type="text"
              placeholder="0,0"
              autoComplete="off"
              id="swap_ntr"
              onChange={(e) => {
                fetchSwap(e, "deswap_to_matic");
              }}
            />
          </div>
        </div>
      </div>
      <div className="swaptokenFooter">
        <button
          className="connect addNewBtns SimpleButton btnHoverEffectOutline"
          onClick={onConnectButtonClick}
        >
          {buttonText}
        </button>
      </div>
      <BootstrapModal
        show={show}
        handleClose={closeConnectButtonClick}
        modaltitle={modalheader}
        modalbody={modalbody}
        modalfooter={modalfooter}
      ></BootstrapModal>
      <Modal
        show={historyOpen}
        modaltitle="Recent Transactions"
        onClose={() => setHistoryOpen(false)}
      >
        <HistoryModal />
      </Modal>
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

export default SwapTokenComponent;
