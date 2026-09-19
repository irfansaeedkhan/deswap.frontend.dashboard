import Web3 from "web3";

module.exports.formatWei = async (wei) => {
  return Number(wei) / 1e18;
};

module.exports.ConnectToWeb3 = async (checkPriceTransactionHash) => {
  try {
    if (
      checkPriceTransactionHash == null ||
      checkPriceTransactionHash == undefined ||
      checkPriceTransactionHash.trim() == ""
    ) {
      return null;
    }
    let web3Ch = new Web3(
      new Web3.providers.HttpProvider(
        process.env.NEXT_PUBLIC_POLYGON_CHAIN_LINK
      )
    );
    let transactionInfo = await web3Ch.eth.getTransaction(
      checkPriceTransactionHash
    );

    return transactionInfo;
  } catch (e) {
    console.log("Error ", e);
    return null;
  }
};
