import React, { Fragment } from "react";
import Modal from "react-bootstrap/Modal";
import Image from "next/image";

function BootstrapBodyModal({ imageSrc, heading, paragraph }) {
  console.log("imageSrc", imageSrc);
  return (
    <div className="modalcontentSuccess buydeswap modalWithImage">
      <div className="topImage">
        <div className="wallet">
          <Image
            width={1221}
            height={1221}
            src={imageSrc}
            alt={"deswap image"}
            crossOrigin=""
            loading="lazy"
          />
        </div>
      </div>

      <div className="contentbox">
        <h5>{heading}</h5>
        <p>{paragraph}</p>
      </div>
    </div>
  );
}

export default BootstrapBodyModal;
