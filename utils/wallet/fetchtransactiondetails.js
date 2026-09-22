import Web3 from "web3";

module.exports.formatWei = async (wei) => {
  return Number(wei) / 1e18;
};

function isDemoMode() {
  return (
    process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
    process.env.DEMO_MODE === "true"
  );
}

module.exports.ConnectToWeb3 = async (checkPriceTransactionHash) => {
  try {
    if (
      checkPriceTransactionHash == null ||
      checkPriceTransactionHash == undefined ||
      String(checkPriceTransactionHash).trim() == ""
    ) {
      return null;
    }
    if (isDemoMode()) {
      return {
        from: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0",
        to: "0xAdmin35Cc6634C0532925a3b844Bc9e7595f0bEb1",
        value: "1500000000000000000",
        hash: checkPriceTransactionHash,
      };
    }
    let web3Ch = new Web3(
      new Web3.providers.HttpProvider(
        process.env.NEXT_PUBLIC_POLYGON_CHAIN_LINK,
        { timeout: 4000 }
      )
    );
    let transactionInfo = await Promise.race([
      web3Ch.eth.getTransaction(checkPriceTransactionHash),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("tx lookup timeout")), 4000)
      ),
    ]);

    return transactionInfo;
  } catch (e) {
    console.log("Error ", e);
    return null;
  }
};
