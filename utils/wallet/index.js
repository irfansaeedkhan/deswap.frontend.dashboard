import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import WalletConnectProvider from "@walletconnect/web3-provider";
import netherNFTContract from "../../abi/sktest.json";

const checkWalletExits = async (wallet) => {
  let returnValue = false;
  switch (wallet) {
    case "metamask": {
      returnValue = window.ethereum.isMetaMask ? true : false;
      break;
    }
    case "coin99": {
      returnValue = window.ethereum.isMetaMask ? true : false;
      break;
    }
    case "walletconnect": {
      break;
    }
    default:
      throw "Invalid wallet";
  }
  if (!returnValue) {
    throw "Failed to fetch wallet";
  }
};
const connectToWallet = async (wallet) => {
  let provider = await detectEthereumProvider();
  let result = null;
  let chainID = 0;
  let validChain = false;

  //is this epoche time error
  //because i changed the time during the testing .. should I replace it with the old one ?yes

  if (window.ethereum && wallet == "metamask") {
    //
    await checkWalletExits(wallet);
    result = await new Web3(window.ethereum);
  }

  // else if(typeof window.ethereum !== "undefined"){
  //     console.log("we see metamask");
  //     ethereum.request({method: "eth_requestAccounts"})
  // }
  else if (window.web3 && wallet == "metamask") {
    await checkWalletExits(wallet);
    result = await new Web3(window.web3.currentProvider);
  } else if (wallet == "walletconnect") {
    let rpcObject = {};
    rpcObject.rpc = {};
    rpcObject.rpc[process.env.NEXT_PUBLIC_POLYGEN_CHAIN_ID] =
      process.env.NEXT_PUBLIC_POLYGON_CHAIN_LINK;
    provider = await new WalletConnectProvider(rpcObject);
    await provider.enable();
    result = await new Web3(provider);
  } else {
    throw "Error";
  }
  chainID = await result.eth.net.getId();

  if (chainID != process.env.NEXT_PUBLIC_POLYGEN_CHAIN_ID) {
    throw "Invalid chain id";
  }

  var web3WithoutSigner = new Web3(
    new Web3.providers.HttpProvider("https://rpc-mumbai.maticvigil.com/")
  );
  return {
    web3: result,
    web3WithoutSigner: web3WithoutSigner,
    ethereum: provider,
  };
};
const fetchMetaMaskAccount = async (metamaskconnect) => {
  try {
    let result = null;
    result = await metamaskconnect.eth.getAccounts();
    return result;
  } catch (e) {
    console.log("Failed to fetch metamask account", e);
  }
};

module.exports.etherumFetchAccount = async (metamaskconnect) => {
  try {
    let result = null;
    result = await metamaskconnect.request({ method: "eth_requestAccounts" });
    return result;
  } catch (e) {
    console.log("Failed to fetch etherum account ", e);
  }
};

module.exports.etherumFetchAccount = async (metamaskconnect) => {
  try {
    let result = null;
    result = await metamaskconnect.request({ method: "eth_requestAccounts" });
    return result;
  } catch (e) {
    console.log("Failed to fetch etherum account");
  }
};

module.exports.web3USDCContract = async (web3Conn) => {
  try {
    let contract = await new web3Conn.eth.Contract(
      netherNFTContract,
      `${process.env.NEXT_PUBLIC_ADMIN_USDC_CONTRACT_ADDRESS}`
    );
    return contract;
  } catch (e) {
    console.log("Failed to fetch web3 contract");
  }
};

module.exports.web3DeSwapContract = async (web3Conn) => {
  try {
    let contract = await new web3Conn.eth.Contract(
      netherNFTContract,
      `${process.env.NEXT_PUBLIC_ADMIN_DESWAP_CONTRACT_ADDRESS_POLYGON}`
    );
    return contract;
  } catch (e) {
    console.log("Failed to fetch web3 contract");
  }
};

module.exports.sendMetaMaskTransaction = async (metamaskconnect, params) => {
  //try{
  let result = null;
  result = await metamaskconnect.eth.sendTransaction(params);
  return result;
  //}catch(e){
  //console.log("Failed to send metamask transaction");
  //throw e;
  //}
};

module.exports.sendContractTransaction = async (metamaskcontract, params) => {
  try {
    let result = null;
    result = await metamaskcontract.methods
      .transfer(params.receiver, params.amount)
      .send({ from: params.sender });
    return result;
  } catch (e) {
    console.log("Failed to send metamask transaction");
    throw e;
  }
};

module.exports.connectToWallet = connectToWallet;
module.exports.fetchMetaMaskAccount = fetchMetaMaskAccount;
