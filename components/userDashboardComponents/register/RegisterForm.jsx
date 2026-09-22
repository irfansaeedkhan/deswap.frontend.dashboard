import React, { useEffect, useState } from "react";
import Link from "next/link";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Modal from "@/components/reusables/Modal";
import ArrowLeft from "@/assets/svgAssets/ArrowLeft";
import { useRouter } from "next/router";
import axios from "@/utils/common/axios";
import "react-toastify/dist/ReactToastify.css";
import Web3 from "web3";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import { requestBodyEncryptionUnprotected } from "@/utils/common/jwtToken";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SanitizeRequestObject } from "../../../utils/common/sanitize";

import {
  sendMetaMaskTransaction,
  sendContractTransaction,
  connectToWallet,
  fetchMetaMaskAccount,
  etherumFetchAccount,
  web3USDCContract,
  web3DeSwapContract,
} from "../../../utils/wallet/index";
const eye = <FontAwesomeIcon icon={faEye} />;
const eyeSlash = <FontAwesomeIcon icon={faEyeSlash} />;

const re =
  /^([a-z0-9\.-]{2,25})@([a-z\d]{2,20})\.([a-z\.-]{2,8})(\.[a-z]{2,8})?$/;
const oneletteronenumberonechacter =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

// form validations
const schema = Joi.object({
  username: Joi.string().required().label("username").messages({
    "string.empty": `Username Required`,
    "any.required": `Username Required`,
  }),
  //referral: Joi.string().allow("").valid("").optional().label("referral").messages({}),
  referral: Joi.string().trim().allow("").optional(),
  email: Joi.string()
    // .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "co"] } })
    .email({ minDomainSegments: 2, tlds: {} })
    .regex(re)
    .required()
    .messages({
      "string.empty": `Email Required`,
      "any.required": `Email Required`,
      "string.pattern.base": `Invalid email id. Only - . special characters allowed , 0-9 and alphabat`,
    }),
  password: Joi.string()
    .regex(oneletteronenumberonechacter)
    .required()
    .min(4)
    .label("password")
    .messages({
      "string.empty": `Password Required`,
      "any.required": `Required Field`,
      "string.pattern.base": `Password must have at one character, one number and one special character`,
    }),
  confirmpassword: Joi.string()
    .regex(oneletteronenumberonechacter)
    .equal(Joi.ref("password"))
    .required()
    .label("Confirm Password")
    .messages({
      "any.only": `Password does not match`,
      "string.empty": `Confirm Password Required`,
      "any.required": `Required Field`,
      "string.pattern.base": `Password must have at one character, one number and one special character`,
    }),
  walletaddress: Joi.string().label("walletaddress").messages({
    "string.empty": `Wallet Address Required`,
    "any.required": `Wallet Address Required`,
  }),
});

function RegisterForm({ referalKey }) {
  const router = useRouter();
  const [metaState, setMetaState] = useState(false);
  const [show, setShow] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setconfirmPasswordShown] = useState(false);
  const [metaMaskPublicAddress, setMetaMastPublicAddress] = useState("");
  const [userRegisterationData, setuserRegisterationData] = useState(null);
  const [saveDataOnServer, setsaveDataOnServer] = useState({
    savingInDatabase: false,
    savedInDatabase: false,
    count: 0,
  });
  const [transactionInProgress, settransactionInProgress] = useState({
    transactionInProgress: false,
    failedTransaction: 0,
    successFullTransaction: 0,
    count: 0,
  });

  var metamaskConnection = null;
  var userData = null;
  var saveDataOnServerSuccesfull = {
    savingInDatabase: false,
    savedInDatabase: false,
    count: 0,
  };
  var transaction = {
    transactionInProgress: false,
    failedTransaction: 0,
    successFullTransaction: 0,
    count: 0,
  };
  var NoOfBlockConfirmation = 0;
  const [metaconn, setmetaconn] = useState(null);
  const [error, setErr] = useState("");
  const [buttontext, setbuttontext] = useState("Create An Account");

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };
  const toggleConfirmPasswordVisiblity = () => {
    setconfirmPasswordShown(confirmPasswordShown ? false : true);
  };
  const { handleSubmit, register, setError, formState } = useForm({
    mode: "onChange",
    resolver: joiResolver(schema),
  });

  var bindonNetworChange;
  const etherumTransaction = async (data) => {
    try {
      await setdisplayerror(errorString);
      let params;
      data.amount = await metamaskConnection.web3.utils.toWei(data.amount);
      let count = await metamaskConnection.web3.eth.getTransactionCount(
        data.sender
      );
      //
      await setdisplayerror(errorString);
      let gasPrice = await metamaskConnection.web3.eth.getGasPrice();

      let transactionHash;
      await setdisplayerror(errorString);
      if (data.contractAddress) {
        transactionHash = await sendContractTransaction(
          metamaskConnection.web3contract,
          {
            sender: data.sender,
            amount: data.amount,
            receiver: data.receiver,
            gasPrice: gasPrice,
          }
        );
      } else {
        //0x76c0
        //30400
        params = {
          from: data.sender,
          to: data.receiver,
          value: "0x" + Number(data.amount).toString(16),
          gasPrice: gasPrice,
          data: "0x",
        };
        transactionHash = await sendMetaMaskTransaction(
          metamaskConnection.web3,
          params
        );
      }
      await setdisplayerror(errorString);
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
      setbuttontext("Create An Account");
      setErr("Transaction Failed");
      /*
      errorString+="Error message \n"+e.message;
      await setdisplayerror(errorString)
      if(e.message!=undefined){
        errorString += e.message;
        await setdisplayerror(e.message);
      }*/
      return null;
    }
  };

  const etherumTransactionWithEventEmitter = async (data) => {
    try {
      let params;

      data.amount = await metamaskConnection.web3.utils.toWei(data.amount);

      let gasPrice = await metamaskConnection.web3.eth.getGasPrice();

      params = {
        from: data.sender,
        to: data.receiver,
        value: "0x" + Number(data.amount).toString(16),
        gasPrice: gasPrice,
        data: "0x",
      };
      /*
      transactionHash = await sendMetaMaskTransaction(
        metamaskConnection.web3,
        params
      );*/

      metamaskConnection.web3.eth
        .sendTransaction(params)
        .on("transactionHash", async (hash) => {
          try {
            //setErr(`Transaction hash : ${hash}`);
            await setbuttontext("Transaction Hash Received");
            userData.txHash = hash;
            /**
             * Saving in database true
             */
            saveDataOnServerSuccesfull.savingInDatabase = true;
            saveDataOnServerSuccesfull.count =
              saveDataOnServerSuccesfull.count + 1;
            await setsaveDataOnServer({
              ...saveDataOnServer,
              savingInDatabase: true,
              savedInDatabase: false,
              count: saveDataOnServer.count + 1,
            });
            const registerationFinalResult = await registerUser(userData);
            if (registerationFinalResult) {
              /**
               * Saved in database true and saving is false
               */
              await setsaveDataOnServer({
                ...saveDataOnServer,
                savingInDatabase: false,
                savedInDatabase: true,
                count: saveDataOnServer.count,
              });
              saveDataOnServerSuccesfull.savedInDatabase = true;
              saveDataOnServerSuccesfull.savingInDatabase = false;
              //setbuttontext("Successful");
            } else {
              /**
               * Saved in database false and saved in database false
               */
              await setsaveDataOnServer({
                ...saveDataOnServer,
                savingInDatabase: false,
                savedInDatabase: false,
                count: saveDataOnServer.count,
              });
              saveDataOnServerSuccesfull.savingInDatabase = false;
              saveDataOnServerSuccesfull.savedInDatabase = false;
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
            setErr(`Registeration failed [REG08] : message ${e.message}`);
          }
        })
        .on("receipt", async (receipt) => {
          try {
            await setbuttontext("Transaction receipt received");
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
            setErr(`Registeration failed [REG09] : message ${e.message}`);
          }
        })
        .on("confirmation", async (confirmationNumber, receipt) => {
          try {
            NoOfBlockConfirmation = NoOfBlockConfirmation + 1;
            await setbuttontext(`Confirmation ${confirmationNumber}`);

            if (
              saveDataOnServerSuccesfull.savedInDatabase &&
              confirmationNumber > 14
            ) {
              transaction.transactionInProgress = false;
              transaction.successFullTransaction =
                transaction.successFullTransaction + 1;
              await setbuttontext("Create An Account");
              setErr("Transaction Successful");
              await settransactionInProgress({
                ...transactionInProgress,
                transactionInProgress: false,
              });
              return router.push("/user/login");
            } else if (
              !saveDataOnServerSuccesfull.savedInDatabase &&
              !saveDataOnServerSuccesfull.savingInDatabase &&
              confirmationNumber > 40
            ) {
              /**
               * Not saved in database and no transaction
               */
              await setsaveDataOnServer({
                ...saveDataOnServer,
                savingInDatabase: true,
                savedInDatabase: false,
                count: saveDataOnServer.count + 1,
              });
              saveDataOnServerSuccesfull.savingInDatabase = true;
              const registerationFinalResult = await registerUser(userData);
              if (registerationFinalResult) {
                await setsaveDataOnServer({
                  ...saveDataOnServer,
                  savingInDatabase: true,
                  savedInDatabase: false,
                  count: saveDataOnServer.count,
                });
                saveDataOnServerSuccesfull.savedInDatabase = true;
                saveDataOnServerSuccesfull.savingInDatabase = false;
              } else {
                await setsaveDataOnServer({
                  ...saveDataOnServer,
                  savingInDatabase: false,
                  savedInDatabase: false,
                  count: saveDataOnServer.count,
                });
                saveDataOnServerSuccesfull.savedInDatabase = false;
                saveDataOnServerSuccesfull.savingInDatabase = false;
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
            await settransactionInProgress({
              ...transactionInProgress,
              transactionInProgress: false,
            });
            setErr(`Registeration failed [REG10] : message ${error.message}`);
          }
        })
        .on("error", async (error) => {
          await settransactionInProgress({
            ...transactionInProgress,
            transactionInProgress: false,
          });
          try {
            await setbuttontext("Create An Account");
            transaction.transactionInProgress = false;
            transaction.failedTransaction = transaction.failedTransaction + 1;
            setErr(`Registeration failed [REG11] : message ${error.message}`);
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
            setErr(`Registeration failed [REG07] : message ${e.message}`);
          }
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
      //   });
      setbuttontext("Create An Account");
      console.log(e);
      setErr(`Registeration failed [REG06]`);
      return null;
    }
  };

  bindonNetworChange = async (widowetherum) => {
    try {
      widowetherum.on("chainChanged", async (chainid) => {
        metamaskConnection = null;
        setmetaconn(null);
        await connectToWalletMeta();
        setMetaMastPublicAddress("");
      });
      widowetherum.on("accountsChanged", async (accounts) => {
        metamaskConnection = null;
        setmetaconn(null);
        await connectToWalletMeta();
        setMetaMastPublicAddress("");
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
      //   });
      console.log("Error message : ", e);
    }
  };

  const connectToWalletMeta = async () => {
    try {
      let result = await connectToWallet("metamask");

      let metamaskAccounts = await fetchMetaMaskAccount(result.web3);

      if (metamaskAccounts.length == 0 || metamaskAccounts == undefined) {
        metamaskAccounts = await etherumFetchAccount(result.ethereum);
      }

      await bindonNetworChange(result.ethereum);
      setmetaconn(result);
      metamaskConnection = { ...result };
      setMetaMastPublicAddress(metamaskAccounts[metamaskAccounts.length - 1]);
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
      if (e == "Invalid chain id") {
        setErr(`Please connect to matic mainnet`);
        resetter();
      } else if (e == "Error") {
        setErr(`Failed to connect to metamask`);
        resetter();
      } else {
        setErr(`Failed to connect to metamask`);
        resetter();
      }
      console.log("Failed to connect to wallet ", e);
    }
  };

  const registerUser = async (userData) => {
    try {
      let encryptionData = await requestBodyEncryptionUnprotected(userData);
      //console.log("Encryption data ",encryptionData)
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/registration`,
        { data: encryptionData },
        {
          headers: {
            "security-set": true,
          },
        }
      );
      //TO DO : Change-to-normal
      return true;
      //return data.success;
    } catch (error) {
      // toast.error(error.message, {
      //   position: "top-center",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   });
      console.log("error regsitering new user :", error);
      return false;
    }
  };
  const resetter = () => {
    setTimeout(() => {
      setErr("");
    }, 3000);
  };

  const checkValidSponsor = async (checkdata) => {
    try {
      let encryptionData = await requestBodyEncryptionUnprotected(checkdata);
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/validSponsor`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );

      if (data.success && data.referralAvailable) {
        return { result: true, sponsorValid: true, data: null };
      } else if (data.success && !data.referralAvailable) {
        return { result: true, sponsorValid: false, data: null };
      } else {
        setErr(data.message);
        return { result: false, sponsorValid: false, data: null };
      }

      setErr(data.message);
      return { result: false, sponsorValid: false, data: null };
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
      setErr("Registeration failed [REG01]");
      return { result: false, sponsorValid: false, data: null };
    }
  };

  const dollarToMatic = async (dollar) => {
    try {
      let encryptionData = await requestBodyEncryptionUnprotected({
        amount: dollar,
      });
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/conversion/dollartomatic`,
        { data: encryptionData },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );
      return {
        result: true,
        matic: data.conversion.toString(),
        conversionRate: data.conversionRate,
      };
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
      setErr("Registeration failed [REG02]");
      return { result: false, matic: "0", conversionRate: 0 };
    }
  };
  const onSubmit = async (userCredentials) => {
    try {
      setErr("");
      await SanitizeRequestObject(userCredentials);
      if (
        !transaction.transactionInProgress &&
        !transactionInProgress.transactionInProgress
      ) {
        transaction.transactionInProgress = true;
        transaction.count = transaction.count + 1;
        await settransactionInProgress({
          ...transactionInProgress,
          transactionInProgress: true,
          count: transactionInProgress.count + 1,
        });
        NoOfBlockConfirmation = 0;
      } else {
        return;
      }
      userData = userCredentials;
      setuserRegisterationData(userCredentials);
      let inDollar = 18; //18

      await setbuttontext("Checking..");
      let checkUser = await checkValidSponsor(userCredentials);
      if (!checkUser.result) {
        await setbuttontext("Create An Account");
        transaction.transactionInProgress = false;
        transaction.failedTransaction = transaction.failedTransaction + 1;
        await settransactionInProgress({
          ...transactionInProgress,
          transactionInProgress: false,
        });
        return;
      }

      if (checkUser.sponsorValid) {
        inDollar = 9; //9
      }

      await setbuttontext("Converting..");
      let currencyConversion = await dollarToMatic(inDollar);

      if (!currencyConversion.result) {
        await setbuttontext("Create An Account");
        transaction.transactionInProgress = false;
        transaction.failedTransaction = transaction.failedTransaction + 1;
        await settransactionInProgress({
          ...transactionInProgress,
          transactionInProgress: false,
        });
        return;
      }

      if (metaconn == null) {
        setErr("Metamask is not connected [REG03]");
        await setbuttontext("Create An Account");
        transaction.transactionInProgress = false;
        transaction.failedTransaction = transaction.failedTransaction + 1;
        await settransactionInProgress({
          ...transactionInProgress,
          transactionInProgress: false,
        });
        return;
      }
      metamaskConnection = metaconn;

      if (metaMaskPublicAddress.trim() == "") {
        setErr("Invalid metamask account");
        await setbuttontext("Create An Account");
        transaction.transactionInProgress = false;
        transaction.failedTransaction = transaction.failedTransaction + 1;
        await settransactionInProgress({
          ...transactionInProgress,
          transactionInProgress: false,
        });
        return;
      }
      await setbuttontext("Fetching balance...");

      let userAccountBalance = await metaconn.web3.eth.getBalance(
        metaMaskPublicAddress
      );

      if (!userAccountBalance) {
        setErr("Failed to fetch account balance [REG04]");
        await setbuttontext("Create An Account");
        transaction.transactionInProgress = false;
        transaction.failedTransaction = transaction.failedTransaction + 1;
        await settransactionInProgress({
          ...transactionInProgress,
          transactionInProgress: false,
        });
        return;
      }

      await setbuttontext("Converting..");
      let accountBalanceUser = await metamaskConnection.web3.utils.fromWei(
        userAccountBalance
      );

      await setbuttontext("Fetching Gas");
      let gasprice = await metamaskConnection.web3.eth.getGasPrice();

      let gasPriceToAdd = await metamaskConnection.web3.utils.fromWei(
        gasprice.toString()
      );

      let transactionAmountWithGas =
        Number(currencyConversion.matic) + Number(gasPriceToAdd);

      if (accountBalanceUser < transactionAmountWithGas) {
        setErr(
          `Wallet balance is low , Required balance is ${transactionAmountWithGas} MATIC [REG05]`
        );
        await setbuttontext("Create An Account");
        transaction.transactionInProgress = false;
        transaction.failedTransaction = transaction.failedTransaction + 1;
        await settransactionInProgress({
          ...transactionInProgress,
          transactionInProgress: false,
        });
        return;
      }

      await setbuttontext("Transaction..");

      userData.walletaddress = metaMaskPublicAddress;
      userData.amountInUSD = inDollar;
      userData.conversionrate = currencyConversion.conversionRate;
      userData.amount = parseFloat(currencyConversion.matic).toFixed(6);

      //TO DO : Remove

      await etherumTransactionWithEventEmitter({
        sender: metaMaskPublicAddress,
        amount: currencyConversion.matic.toString(),
        receiver: `${process.env.NEXT_PUBLIC_ADMIN_POLYGON_PUBLIC_KEY}`,
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
      //   });
      transaction.transactionInProgress = false;
      transaction.failedTransaction = transaction.failedTransaction + 1;
      await setbuttontext("Create An Account");
      await settransactionInProgress({
        ...transactionInProgress,
        transactionInProgress: false,
      });
      setErr(`Registeration failed [REG00] : message ${e.message}`);
      console.log("Failed to register ", e);
    }
  };

  useEffect(() => {
    let iconBoxContainer = document.querySelector(".iconBoxContainer");
    let metaIcons = iconBoxContainer.getElementsByClassName("iconBox");
    for (let i = 0; i < metaIcons.length; i++) {
      metaIcons[i].addEventListener("click", function (element) {
        let current = document.getElementsByClassName("activeImg");
        current[0].className = current[0].className.replace(" activeImg", "");
        this.className += " activeImg";
      });
    }
  }, []);

  /**
   *
   * Connect to wallet
   */
  const handleMetaConnect = async () => {
    try {
      setMetaState(true);
      //Hiding popup
      setShow(false);

      //Connecting to metamask
      await connectToWalletMeta();
      //setMetaMastPublicAddress
    } catch (e) {
      toast.error("Failed To Connect To The Metamask", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setMetaState(false);
      console.log("Failed to connect to the metamask");
    }
  };

  return (
    <>
      <div className="registerForm">
        <div className="backBtn" onClick={() => router.push("/user/login")}>
          <ArrowLeft />
        </div>
        <h2>Create Your Account</h2>
        {/*<div style={{color:"white",fontSize:"bold"}}>{displayerror}</div>*/}
        <div className="inputsList">
          <p
            className="text-danger fw-bold"
            style={{
              color: "rgb(228, 71, 87)",
              marginBottom: "3px",
              fontSize: "16px",
            }}
          >
            {" "}
            {error}
          </p>
          <form method="post" autoComplete="off">
            <div className="formInputs">
              <input
                id="username"
                name="username"
                type={"text"}
                placeholder="Enter Username"
                autoComplete="off"
                {...register("username")}
                error={formState.errors.username && true}
              />
              {formState.errors.username && (
                <p>{formState.errors.username.message}</p>
              )}
            </div>
            <div className="formInputs">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter Your Email"
                autoComplete="off"
                {...register("email")}
                error={formState.errors.email && true}
              />
              {formState.errors.email && (
                <p>{formState.errors.email.message}</p>
              )}
            </div>
            <div className="formInputs">
              <div className="iconinputContainer">
                <input
                  id="password"
                  name="password"
                  type={passwordShown ? "text" : "password"}
                  placeholder="Enter Password"
                  autoComplete="off"
                  {...register("password")}
                  error={formState.errors.password && true}
                />
                <i onClick={togglePasswordVisiblity}>
                  {passwordShown ? eyeSlash : eye}
                </i>
              </div>
              {formState.errors.password && (
                <p>{formState.errors.password.message}</p>
              )}
            </div>
            <div className="formInputs">
              <div className="iconinputContainer">
                <input
                  id="confirmpassword"
                  name="confirmpassword"
                  type={confirmPasswordShown ? "text" : "password"}
                  placeholder="Confirm Password"
                  autoComplete="off"
                  {...register("confirmpassword")}
                  error={formState.errors.confirmpassword && true}
                />
                <i onClick={toggleConfirmPasswordVisiblity}>
                  {confirmPasswordShown ? eyeSlash : eye}
                </i>
              </div>

              {formState.errors.confirmpassword && (
                <p>{formState.errors.confirmpassword.message}</p>
              )}
            </div>

            <div className="formInputs">
              <input
                name="referral"
                type="text"
                defaultValue={referalKey}
                placeholder="Referral Code"
                autoComplete="off"
                {...register("referral")}
              />
            </div>

            <div className="formInputs">
              <input
                // id="walletaddress"
                name="walletaddress"
                type={"text"}
                placeholder="Wallet Address"
                autoComplete="off"
                // {...register("walletaddress")}
                error={formState.errors.walletaddress && true}
                // disabled="true"
                style={{ letterSpacing: "0.5px" }}
                value={metaMaskPublicAddress}
              />
              {/* {formState.errors.walletaddress && <p>{formState.errors.walletaddress.message}</p>} */}
            </div>
            <div className="formInputs firstbutton">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShow(true);
                }}
                className={
                  metaState
                    ? "btnslider btnactive"
                    : "SimpleButton btnHoverEffectOutline"
                }
              >
                Connect Wallet
              </button>
            </div>
            <div className="formInputs secondbutton">
              <button
                className="btnslider SimpleButton btnHoverEffectOutline"
                style={{
                  background: !formState.isValid ? "#333333" : "#e44757",
                  color: !formState.isValid ? "#474747" : "#FFF",
                }}
                disabled={!formState.isValid}
                onClick={handleSubmit(onSubmit)}
              >
                {buttontext}
              </button>
            </div>
          </form>

          {/* <div className="formFooter">
            <p>
              Have an Account Already?
              <Link legacyBehavior href="/login">
                <a>Login</a>
              </Link>
            </p>
          </div> */}
        </div>
      </div>
      <Modal
        show={show}
        onClose={() => setShow(false)}
        modaltitle={"Connect Wallet"}
      >
        <div className="modalcontentWallet">
          <div className="iconBoxContainer">
            <div className="iconBox" onClick={handleMetaConnect}>
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
            <div className="iconBox disabledBox">
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
            <div className="iconBox disabledBox">
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
            <div className="iconBox disabledBox">
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
      </Modal>
      {/* success modal */}
      <Modal
        modaltitle={"Successfully Registered"}
        show={showSuccess}
        onClose={() => setShowSuccess(false)}
      >
        <div className="modalcontentSuccess modalWithImage">
          <div className="contentbox">
            <div className="iconBox">
              <div className="wallet">
                <Image
                  width={1221}
                  height={1221}
                  src="/images/Successfullyregistered.png"
                  alt={"Successfully registered image"}
                  loading="lazy"
                />
              </div>
            </div>
            <h5>You Have Successfully Registered</h5>
            <p>
              A Verification Email Has Been Sent To Your Email, Please Verify
              Your Email To Continue Logging In
            </p>
          </div>
        </div>
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
    </>
  );
}

export default RegisterForm;
