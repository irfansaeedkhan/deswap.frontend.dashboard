const WalletStorageKeys = {
  walletname: "walletname",
  walletStatus: "walletconnected",
};
module.exports.checkLocalStorage = async () => {
  let returnStatus = false;
  try {
    let localStorage = window.localStorage;
    if (localStorage) {
      returnStatus = true;
    }
    return returnStatus;
  } catch (error) {
    console.log("Local storage : ", error);
    return returnStatus;
  }
};

module.exports.getWalletValues = async () => {
  let wallet = {
    isConnected: "false",
    walletName: "metamask",
  };
  try {
    let localStorage = await window.localStorage;
    let walletStatus = await localStorage.getItem(
      WalletStorageKeys.walletStatus
    );
    if (walletStatus) {
      wallet.isConnected = walletStatus;
    }
    let walletName = await localStorage.getItem(WalletStorageKeys.walletname);
    if (walletName) {
      wallet.walletName = walletName;
    }
    return wallet;
  } catch (error) {
    console.log("Error ", error);
    return wallet;
  }
};

module.exports.setWalletValues = async (walletName, connectionStatus) => {
  try {
    let localStorage = await window.localStorage;
    await localStorage.setItem(
      WalletStorageKeys.walletStatus,
      connectionStatus
    );
    await localStorage.setItem(WalletStorageKeys.walletname, walletName);
  } catch (error) {
    console.log("Error ", error);
  }
};
