import React, { useState, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  connectToMeta,
  metaMaskDisconnected,
  metaMaskValue,
} from "../../redux/actions/metamask";
import { wrapper } from "../../redux/store/store";
import axios from "../../utils/common/axios";
import { encryptRequestBody } from "@/utils/common/jwtToken";
import Image from "next/image";
import {
  connectToWallet,
  fetchMetaMaskAccount,
  etherumFetchAccount,
  web3USDCContract,
  web3DeSwapContract,
} from "../../utils/wallet/index";
//import BootstrapModal from "./BootstrapModal";
import Modal from "react-bootstrap/Modal";
import BootstrapModal from "./BootstrapModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WalletConnectButtonAdmin = ({
  connectToMeta,
  metaMaskDisconnected,
  metaMaskValue,
}) => {
  //
  const [buttontext, setButtonText] = useState("Connect");
  //Show modals
  const [show, setShow] = useState(false);
  const [showWalletPopup, setShowWalletPopup] = useState(false);

  //Modal header
  const [modalheader, setModalHeader] = useState("Connect Wallet");
  const [connectionStatus, setconnectionStatus] = useState(false);
  const [currentProvider, setCurrentProvider] = useState(null);
  //
  //Function called when click on type of wallet

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
            alt="icon"
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
          className="iconBox"
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

  /*
  const fetchUserDetails = async () => {
    try {
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/profile/info`,
        {},
        { 
          withCredentials: true,
          headers:{
            'security-set':false
          }
         }
      );
      return result.data.data;
    } catch (e) {
      console.log("Failed to fetch user details");
    }
  };
  */

  const bindonNetworChange = async (widowetherum) => {
    try {
      widowetherum.on("chainChanged", async (chainid) => {
        await disconnectMetaButton();
      });
      widowetherum.on("accountsChanged", async (accounts) => {
        await disconnectMetaButton();
      });
      widowetherum.on("disconnect", async (code, reason) => {
        await widowetherum.disconnect();
        await disconnectMetaButton();
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

  /*
  const bindonNetworkChangeWalletConnect = async (walletconnectprovider)=>{
    try{
      walletconnectprovider.on("accountsChanged", (accounts) => {
        console.log(accounts);
      });
      
      // Subscribe to chainId change
      walletconnectprovider.on("chainChanged", (chainId) => {
        console.log(chainId);
      });
      
      // Subscribe to session disconnection
      walletconnectprovider.on("disconnect", (code, reason) => {
        console.log(code, reason);
      });
    }catch(e){
      console.log(e)
    }
  }
  */
  const handleMetaConnect = async (walletName) => {
    try {
      setButtonText("Connecting...");

      if (walletName == "walletconnect") {
        //Hide
        setShow(false);
      }
      let result = await connectToWallet(walletName);

      let metamaskAccounts = await fetchMetaMaskAccount(result.web3);

      let contract = null;

      if (result.web3) {
        contract = await web3DeSwapContract(result.web3);
      }

      if (metamaskAccounts.length == 0 || metamaskAccounts == undefined) {
        metamaskAccounts = await etherumFetchAccount(result.ethereum);
      }

      /*
      if(walletName=="walletconnect"){
        await bindonNetworkChangeWalletConnect();
      }else{*/
      await setCurrentProvider(result.ethereum);
      await bindonNetworChange(result.ethereum);
      //}
      /*
      let userData = await fetchUserDetails();

      if (userData.walletaddress[userData.walletaddress.length - 1].toLowerCase() !=metamaskAccounts[metamaskAccounts.length - 1].toLowerCase()) {
        //Invalid address
        setShow(true);
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
                  alt={"deswap image"}
                />
              </div>
            </div>
          <div className="contentbox">
            <h5>Kindly Connect With Valid Public Key</h5>
          </div>
        </div>
        );
        return;
      }*/

      setShow(false);
      //
      //Connect to wallet
      setButtonText(
        metamaskAccounts[0].substring(0, 6) +
          "...." +
          metamaskAccounts[0].substring(metamaskAccounts[0].length - 4)
      );
      await connectToMeta({
        publickey: metamaskAccounts[metamaskAccounts.length - 1],
        metaConn: result,
        web3contract: contract,
        walletname: walletName,
      });
      setconnectionStatus(true);
    } catch (e) {
      console.log(e);

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
        setModalHeader("Failed");
        setButtonText("Connect");
        setModalBody(
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
              <h5>Failed To Connect To Wallet</h5>
              <p>Please connect to valid chain</p>
            </div>
          </div>
        );
      } else {
        setModalHeader("Failed");
        setButtonText("Connect");
        setModalBody(
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
              <h5>Failed To Connect To Wallet</h5>
              <p>Please Try Again</p>
            </div>
          </div>
        );
      }
    }
  };

  const disconnectMetaButton = async () => {
    try {
      setButtonText("Connect");
      setconnectionStatus(false);
      setModalBody(
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
              <p>Coin98</p>
            </div>
            <div
              className="iconBox"
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
              <p>Wallet connect</p>
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
              <p>Trust wallet</p>
            </div>
          </div>
        </div>
      );

      if (currentProvider) {
        await currentProvider.disconnect();
      }

      //await setModalFooter
      await metaMaskDisconnected();
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
      console.log("Failed to disconnect ", e);
    }
  };
  //
  //When clicked on connect button it is called
  const handleConnectButtonClick = async () => {
    try {
      if (connectionStatus) {
        await disconnectMetaButton();
        return;
      }
      await setShow(true);
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
      console.log("Failed to connect to button");
    }
  };

  //
  //Called when click on close button
  const closeConnectButtonClick = async () => {
    try {
      await setShow(false);
      setModalBody(
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
              className="iconBox"
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
      console.log("Failed to close modal");
    }
  };
  return (
    <Fragment>
      <button
        className="SimpleButton btnHoverEffectOutline"
        onClick={handleConnectButtonClick}
      >
        {buttontext}
      </button>
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
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return { metamaskConn: state.metamaskConn };
};
export const getStaticProps = wrapper.getStaticProps((store) => () => {
  store.dispatch(connectToMeta());
});

const mapDispatchToProps = (dispatch) => {
  return {
    connectToMeta: bindActionCreators(connectToMeta, dispatch),
    metaMaskDisconnected: bindActionCreators(metaMaskDisconnected, dispatch),
    metaMaskValue: bindActionCreators(metaMaskValue, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WalletConnectButtonAdmin);
//export default WalletConnectButton;
