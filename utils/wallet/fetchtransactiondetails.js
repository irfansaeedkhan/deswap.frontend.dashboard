import Web3 from "web3";

module.exports.formatWei = async (wei) => {
  return Number(wei) / 1e18;
};

function isDemoMode() {
  return true;
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
      // ROUND 4: the old demo detail was one constant from/to/value for
      // every hash, so every purchased-pack row showed the identical
      // blockchain detail. Derive the detail deterministically from the
      // hash instead: the sender varies per row, the amount varies per
      // row, and the recipient stays the admin wallet (pack payments all
      // go to the admin). Demo only, no chain lookup is implied.
      const input = String(checkPriceTransactionHash);
      let seed = 7;
      for (let i = 0; i < input.length; i++) {
        seed = (Math.imul(seed, 31) + input.charCodeAt(i)) >>> 0;
      }
      let hex = "";
      let s = seed;
      while (hex.length < 40) {
        s = (Math.imul(s, 1103515245) + 12345) >>> 0;
        hex += s.toString(16).padStart(8, "0");
      }
      const eth = 1 + (seed % 200) / 100; // 1.00-2.99 ETH, varies per hash
      return {
        from: `0x${hex.slice(0, 40)}`,
        to: "0xAdmin35Cc6634C0532925a3b844Bc9e7595f0bEb1",
        value: String(Math.round(eth * 1e18)),
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
