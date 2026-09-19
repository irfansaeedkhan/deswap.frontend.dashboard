import React, { useState } from "react";
import Image from "next/image";
import CopyIcon from "@/assets/svgAssets/CopyIcon";
import {
  HeartIcon,
  EmptyHeartIcon,
  TickIcon,
  FbIcon,
  TwitterIcon,
  ShareIcon,
} from "@/components/marketPlace/MarketIcons";
import SimpleButton from "@/components/reusables/SimpleButton";
import BootstrapModal from "@/components/reusables/BootstrapModal";

function NFTSale() {
  const [displayTab, setDisplayTab] = useState("tab1");
  const [toggleReportState, setToggleReportState] = useState(false);
  const [show, setShow] = useState(false);
  const [modalheader, setModalHeader] = useState("");
  const [modalfooter, setModalFooter] = useState(null);
  const [modalbody, setModalBody] = useState(null);
  const copy = async () => {
    // await navigator.clipboard.writeText(window.location.href.split("/")[0]+"//"+window.location.href.split("/")[1]+window.location.href.split("/")[2]+"/user/register?ref="+users.uuid);
  };
  const toggleReport = async () => {
    setToggleReportState((prev) => !prev);
  };

  const CancelSale = async () => {
    try {
      await setShow(true);
      await setModalHeader("Are You Sure  You Want To Cancel Your Listing?");
      await setModalBody(
        <div className="NFTSaleModal">
          <p>
            {" "}
            Canceling your listing will unpublish this sale from market and You
            will be asked to confirm the transaction through your wallet.
          </p>
        </div>
      );
      await setModalFooter(
        <div className="FooterbtnSaleModal">
          <SimpleButton
            text={"Go back"}
            backgroundColor={"rgba(228, 71, 87, 0.12)"}
            color={"#E44757"}
            onClick={closeButton}
          />
          <SimpleButton
            text={"Proceed"}
            backgroundColor={"#E44757"}
            color={"#FFFFFF"}
            onClick={ProceedCancelingSale}
          />
        </div>
      );
    } catch (e) {
      // toast.error(e.message, {
      //   position: "top-center",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   });
      console.log("Failed to edit transaction ", e);
    }
  };

  const ProceedCancelingSale = async () => {
    try {
      await setShow(true);
      await setModalHeader("Lower Price");
      await setModalBody(
        <div className="NFTSaleModal center">
          <div className="priceBox">
            <input type="text" />
            <div className="pricelist">
              <div className="maticicon">
                <Image
                  width={14}
                  height={14}
                  src={"/images/maticicon.png"}
                  alt={"matic icon"}
                  loading="lazy"
                />
              </div>
              <h6>0.099</h6>
            </div>
          </div>
          <p>
            You must pay an additional gas fee if you want to cancel this
            listing at a later point. Learn more
          </p>
        </div>
      );
      await setModalFooter(
        <div className="FooterbtnSaleModal">
          <SimpleButton
            text={"Go back"}
            backgroundColor={"rgba(228, 71, 87, 0.12)"}
            color={"#E44757"}
            onClick={closeButton}
          />
          <SimpleButton
            text={"Set New Price"}
            backgroundColor={"#E44757"}
            color={"#FFFFFF"}
            // onClick={ProceedCancelingSale}
          />
        </div>
      );
    } catch (e) {
      // toast.error(e.message, {
      //   position: "top-center",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   });
      console.log("Failed to edit transaction ", e);
    }
  };
  const closeButton = () => {
    setShow(false);
  };
  return (
    <div className="NFTSale">
      <div className="NFTSaleInner">
        <div className="nftImg">
          <Image
            width={696}
            height={807}
            src="/images/trimface.png"
            alt={"nft image"}
            loading="lazy"
          />
          <div className="heartImg">
            <HeartIcon />
          </div>
        </div>
        <div className="nftDetails">
          <div className="titleContainer">
            <h3>Trim Fan face</h3>

            <div className="shareContainer">
              <div className="shareBox">
                <h6>Share to :</h6>
                <div className="icons">
                  <button className="shareBtn" onClick={copy}>
                    <div className="copyImgIcon">
                      {" "}
                      <FbIcon />
                    </div>
                  </button>
                  <button className="shareBtn" onClick={copy}>
                    <div className="copyImgIcon">
                      {" "}
                      <TwitterIcon />
                    </div>
                  </button>
                  <button className="copyBtn" onClick={copy}>
                    <div className="copyImgIcon">
                      {" "}
                      <CopyIcon />
                    </div>
                  </button>
                </div>
              </div>
              <div className="reportdots">
                <button className="toggleBtn" onClick={toggleReport}>
                  <Image
                    width={20}
                    height={20}
                    src="/images/dots.png"
                    alt={"icon"}
                    loading="lazy"
                  />
                </button>
                <div className={`toggleList ${toggleReportState && "show"}`}>
                  <button className={`reportBtn`}>Lower Price</button>
                  <button className={`reportBtn`}>Stake</button>
                  <button className={`reportBtn`}>Report</button>
                </div>
              </div>
            </div>
          </div>
          <div className="creatorContainer">
            <div className="Content">
              <h5>Creator</h5>
              <div className="author">
                <h6>
                  Octagon_Deswap
                  <TickIcon />
                </h6>
              </div>
            </div>
            <div className="Content">
              <h5>Collection</h5>
              <div className="author">
                <h6>Small city</h6>
              </div>
            </div>
            <div className="Content">
              <h5>Views</h5>
              <div className="author">
                <h6>41.3k</h6>
              </div>
            </div>
          </div>
          <div className="buyContainer">
            <div className="priceContainer">
              <p>Current Price</p>
              <div className="pricelist">
                <div className="maticicon">
                  <Image
                    width={14}
                    height={14}
                    src={"/images/maticicon.png"}
                    alt={"matic icon"}
                    loading="lazy"
                  />
                </div>
                <h5>
                  119.65 MATIC <span>($19.817.00)</span>
                </h5>
              </div>
            </div>
            <p className="description">
              Julie_Pacino is a collection of Quantum Unlocked originally
              generated soldiers with hundreds of unique elements.
            </p>
            <div className="btnContainer">
              <SimpleButton
                text={"Cancel Listing"}
                backgroundColor={"#E44757"}
                color={"#FFFFFF"}
                onClick={CancelSale}
              />
              <SimpleButton
                text={"Edit"}
                backgroundColor={"rgba(228, 71, 87, 0.12)"}
                color={"#e44757"}
              />
            </div>
          </div>

          {/* tabs */}
          <div className="tabsContainer">
            <ul className="mb-3 nav nav-tabs">
              <li
                className="nav-item"
                onClick={() => {
                  setDisplayTab("tab1");
                }}
              >
                <button
                  type="button"
                  className={`nav-link ${displayTab == "tab1" && "active"}`}
                >
                  Details
                </button>
              </li>
              <li
                className="nav-item"
                onClick={() => {
                  setDisplayTab("tab2");
                }}
              >
                <button
                  type="button"
                  className={`nav-link ${displayTab == "tab2" && "active"}`}
                >
                  Offers
                </button>
              </li>
              <li
                className="nav-item"
                onClick={() => {
                  setDisplayTab("tab3");
                }}
              >
                <button
                  type="button"
                  className={`nav-link ${displayTab == "tab3" && "active"}`}
                >
                  History
                </button>
              </li>
            </ul>
            <div className="tab-content">
              {displayTab == "tab1" && (
                <div className="detailsContainer">
                  <div className="data">
                    <h6>NFT ID</h6>
                    <h5>214919</h5>
                  </div>
                  <div className="data">
                    <h6>MINT TRANSACTION</h6>
                    <h5>0x6dbcbf56...7eeae44556</h5>
                  </div>
                  <div className="data">
                    <h6>CONTRACT ADDRESS</h6>
                    <h5 className="themecolor">0xF5db...CdAA4b</h5>
                  </div>
                </div>
              )}
              {displayTab == "tab2" && (
                <div className="offerContainer">
                  <div className="offerCard">
                    <div className="leftcard">
                      <div className="imgBox">
                        <Image
                          width={44}
                          height={44}
                          src="/images/history.png"
                          alt={"icon"}
                          loading="lazy"
                        />
                      </div>
                      <div className="content">
                        <h5>
                          0.04 MATIC <span>Offerred by x989...9872</span>
                        </h5>
                      </div>
                    </div>
                    <div className="action">
                      <SimpleButton
                        text={"Counter"}
                        backgroundColor={"rgba(228, 71, 87, 0.12)"}
                        color={"#E44757"}
                      />
                      <SimpleButton
                        text={"Accept"}
                        backgroundColor={"#E44757"}
                        color={"#FFFFFF"}
                      />
                    </div>
                  </div>
                </div>
              )}
              {displayTab == "tab3" && (
                <div className="historyContainer">
                  <div className="historyCard list">
                    <div className="imgBox">
                      <Image
                        width={44}
                        height={44}
                        src="/images/history.png"
                        alt={"icon"}
                        loading="lazy"
                      />
                    </div>
                    <div className="content">
                      <h5>
                        <span>Listed for </span> 0.054 BNB
                      </h5>
                      <h6>
                        <span>By </span> 0x38...bdda <span> 33 mint ago</span>
                      </h6>
                    </div>
                    <div className="action">
                      <button>
                        <ShareIcon />
                      </button>
                    </div>
                  </div>
                  <div className="historyCard mint">
                    <div className="imgBox">
                      <Image
                        width={44}
                        height={44}
                        src="/images/history2.png"
                        alt={"icon"}
                        loading="lazy"
                      />
                    </div>
                    <div className="content">
                      <h5>
                        <span>Minted by </span>0x1c9...3e52
                      </h5>
                      <h6>
                        <span>12/01/2022, 23:01</span>
                      </h6>
                    </div>
                    <div className="action">
                      <button>
                        <ShareIcon />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <BootstrapModal
        show={show}
        handleClose={closeButton}
        modaltitle={modalheader}
        modalbody={modalbody}
        modalfooter={modalfooter}
      ></BootstrapModal>
    </div>
  );
}

export default NFTSale;
