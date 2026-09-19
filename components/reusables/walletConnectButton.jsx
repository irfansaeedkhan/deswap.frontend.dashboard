import React, { useState, Fragment, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  connectToMeta,
  metaMaskDisconnected,
  metaMaskValue,
} from "../../redux/actions/metamask";
import { wrapper } from "../../redux/store/store";
import axios from "../../utils/common/axios";
import Image from "next/image";
import {
  connectToWallet,
  fetchMetaMaskAccount,
  etherumFetchAccount,
  web3USDCContract,
  web3DeSwapContract,
} from "../../utils/wallet/index";
import BootstrapModal from "./BootstrapModal";
import "react-toastify/dist/ReactToastify.css";
import ConnectWalletModalUI from "./wallet/connectmodalui";
import WalletConnetModalBody from "./wallet/WalletConnetModalBody";
import {
  checkLocalStorage,
  getWalletValues,
  setWalletValues,
} from "../../utils/common/localstorage";

const WalletConnectButton = ({
  connectToMeta,
  metaMaskDisconnected,
  metaMaskValue,
  metamaskConn,
}) => {
  //Button text
  const [buttontext, setButtonText] = useState("Connect");
  //Show modals
  const [show, setShow] = useState(false);
  //Modal header
  const [modalheader, setModalHeader] = useState("Connect Wallet");

  const [modalfooter, setModalFooter] = useState(null);
  //Status
  const [connectionStatus, setconnectionStatus] = useState(false);
  //
  const fetchUserDetails = async () => {
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
      console.log("User details : ", result.data.data);
      return result.data.data;
    } catch (e) {
      console.log("Failed to fetch user details ", e);
    }
  };

  const bindonNetworChange = async (widowetherum) => {
    try {
      widowetherum.on("chainChanged", async (chainid) => {
        await disconnectMetaButton();
      });
      widowetherum.on("accountsChanged", async (accounts) => {
        await disconnectMetaButton();
      });
      widowetherum.on("disconnect", async (disconnect) => {
        await disconnectMetaButton();
      });
    } catch (e) {
      console.log("Error message : ", e);
    }
  };

  const handleMetaConnect = async (walletName) => {
    try {
      setButtonText("Connecting...");

      let result = await connectToWallet(walletName);

      let metamaskAccounts = await fetchMetaMaskAccount(result.web3);

      let contract = null;

      if (result.web3) {
        contract = await web3USDCContract(result.web3);
      }

      if (metamaskAccounts.length == 0 || metamaskAccounts == undefined) {
        metamaskAccounts = await etherumFetchAccount(result.ethereum);
      }

      await bindonNetworChange(result.ethereum);
      let userData = await fetchUserDetails();

      if (
        userData.walletaddress[
          userData.walletaddress.length - 1
        ].toLowerCase() !=
        metamaskAccounts[metamaskAccounts.length - 1].toLowerCase()
      ) {
        //Invalid address
        setShow(true);
        await setModalHeader("Failed");
        await setButtonText("Connect");
        await setModalBody(
          <WalletConnetModalBody
            imagelink={"/images/Failed.png"}
            content={"Kindly Connect With Valid Public Key"}
            subcontent={null}
          ></WalletConnetModalBody>
        );
        await setWalletValues(walletName, false);
        return;
      }

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
      });
      setconnectionStatus(true);
      await setWalletValues(walletName, true);
    } catch (e) {
      console.log("Error ", e);
      setModalHeader("Failed");
      setButtonText("Connect");
      setModalBody(
        <WalletConnetModalBody
          imagelink={"/images/Connectwallet.png"}
          content={"Failed To Connect To Wallet"}
          subcontent={"Please Try Again"}
        ></WalletConnetModalBody>
      );
      await setWalletValues(walletName, false);
    }
  };

  const [modalbody, setModalBody] = useState(
    <ConnectWalletModalUI
      handleMetaConnect={handleMetaConnect}
    ></ConnectWalletModalUI>
  );

  const disconnectMetaButton = async () => {
    try {
      setButtonText("Connect");
      setconnectionStatus(false);
      setModalBody(
        <ConnectWalletModalUI
          handleMetaConnect={handleMetaConnect}
        ></ConnectWalletModalUI>
      );
      //await setModalFooter
      await setWalletValues("metamask", false);
      await setButtonText("Connect");
      await metaMaskDisconnected();
    } catch (e) {
      console.log("Failed to disconnect");
    }
  };
  //
  //When clicked on connect button it is called
  const handleConnectButtonClick = async (e) => {
    e.preventDefault();
    try {
      if (connectionStatus) {
        await disconnectMetaButton();
        return;
      }
      await setShow(true);
    } catch (e) {
      console.log("Failed to connect to button");
    }
  };

  //
  //Called when click on close button
  const closeConnectButtonClick = async () => {
    try {
      await setShow(false);
      setModalBody(
        <ConnectWalletModalUI
          handleMetaConnect={handleMetaConnect}
        ></ConnectWalletModalUI>
      );
    } catch (e) {
      console.log("Failed to close modal");
    }
  };

  useEffect(async () => {
    let storageExists = await checkLocalStorage();
    if (!storageExists) {
      return;
    }
    let walletStatus = await getWalletValues();
    if (walletStatus.isConnected === "true") {
      await handleMetaConnect(walletStatus.walletName);
    }
  }, [checkLocalStorage]);
  return (
    <Fragment>
      <button
        className="SimpleButton btnHoverEffectOutline"
        onClick={(e) => handleConnectButtonClick(e)}
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
)(WalletConnectButton);
