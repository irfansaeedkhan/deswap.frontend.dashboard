import React from "react";
import Image from "next/image";
function WalletConnetModalBody({ imagelink, content, subcontent }) {
  return (
    <>
      <div className="modalcontentSuccess modalWithImage">
        <div className="topImage">
          <div className="wallet">
            <Image
              width={1221}
              height={1221}
              src={imagelink}
              alt={"deswap image"}
            />
          </div>
        </div>
        <div className="contentbox">
          <h5>{content}</h5>
          <p>{subcontent}</p>
        </div>
      </div>
    </>
  );
}

export default WalletConnetModalBody;
