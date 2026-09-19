import React from "react";
import Image from "next/image";

function ConnectWalletModalUI({ handleMetaConnect }) {
  return (
    <>
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
            />
            <p>Trust Wallet</p>
          </div>
        </div>
      </div>
    </>
  );
}
export default ConnectWalletModalUI;
