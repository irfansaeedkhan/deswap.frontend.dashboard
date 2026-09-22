import React from "react";
import Image from "next/image";

function PageLoader({
  title = "",
  showLogo = false,
  overlay = true,
}) {
  return (
    <div
      className={
        overlay
          ? "logoutpageContainer pageLoaderOverlay"
          : "logoutpageContainer"
      }
      role="status"
      aria-live="polite"
      aria-label={title || "Loading"}
    >
      {showLogo && (
        <div className="logoContainer">
          <Image
            src={"/images/logo.png"}
            width={152}
            height={34}
            alt="logo"
            loading="lazy"
          />
        </div>
      )}
      <div className="area">
        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
      <div className="logoutContent">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
          <defs>
            <filter id="page-loader-gooey">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="10"
                result="blur"
              ></feGaussianBlur>
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                result="goo"
              ></feColorMatrix>
              <feBlend in="SourceGraphic" in2="goo"></feBlend>
            </filter>
          </defs>
        </svg>
        <div className="blobStage">
          <div className="blob blob-0"></div>
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
          <div className="blob blob-4"></div>
          <div className="blob blob-5"></div>
        </div>
        {title ? <h2>{title}</h2> : null}
      </div>
    </div>
  );
}

export default PageLoader;
