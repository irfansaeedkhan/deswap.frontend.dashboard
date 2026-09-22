import React from "react";
import Image from "next/image";

function WalletConnetModalBody({ imagelink, content, subcontent }) {
  return (
    <>
      <div className="modalcontentSuccess modalWithImage">
        <div className="topImage">
          <div className="wallet">
            <Image
              width={300}
              height={300}
              src={imagelink}
              alt={"deswap image"}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        </div>
        <div className="contentbox">
          <h5>{content}</h5>
          {subcontent ? <p>{subcontent}</p> : null}
        </div>
      </div>
    </>
  );
}

export default WalletConnetModalBody;
