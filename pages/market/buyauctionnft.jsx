import React, { useState } from "react";
import Image from "next/image";
import MarketNavbar from "@/components/marketPlace/MarketNavbar";
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

function BuyAuctionNFT() {
  const [displayTab, setDisplayTab] = useState("tab1");
  const [toggleReportState, setToggleReportState] = useState(false);
  const [show, setShow] = useState(false);
  const [modalheader, setModalHeader] = useState("Place A Bid");
  const [modalfooter, setModalFooter] = useState(null);
  const [modalbody, setModalBody] = useState(null);
  const copy = async () => {
    // await navigator.clipboard.writeText(window.location.href.split("/")[0]+"//"+window.location.href.split("/")[1]+window.location.href.split("/")[2]+"/user/register?ref="+users.uuid);
  };
  const toggleReport = async () => {
    setToggleReportState((prev) => !prev);
  };

  const buyAuctionNFT = async () => {
    try {
      await setShow(true);
      await setModalBody(
        <div className="buyAuctionNFTModal">
          <p>
            You are about to place a bid Niken Artiz from Small city collection{" "}
          </p>

          <div className="inputBox">
            <h6>Blockchain</h6>
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
                <h6>Polygon</h6>
              </div>
            </div>
            <div className="amount">
              <h6>Amount</h6>
              <input type="text" placeholder="Enter bid (Matic)" />
            </div>
          </div>
        </div>
      );
      await setModalFooter(
        <div className="FooterbtnContainer">
          <SimpleButton
            text={"Place A Bid"}
            backgroundColor={"#E44757"}
            color={"#FFFFFF"}
            onClick={buyAuctionNFT}
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
    <div className="buyAuctionNFT">
      <MarketNavbar />
      <div className="buyAuctionNFTInner">
        <div className="nftImg">
          <Image
            width={696}
            height={807}
            src="/images/auctionnft.png"
            alt={"nft image"}
            loading="lazy"
          />
          <div className="heartImg">
            <HeartIcon />
          </div>
        </div>
        <div className="nftDetails">
          <div className="titleContainer">
            <h3>Niken Artiz</h3>

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
                <button className={`reportBtn ${toggleReportState && "show"}`}>
                  Report
                </button>
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
                <h6>33k</h6>
              </div>
            </div>
          </div>
          <div className="buyContainer">
            <div className="priceContainer">
              <p>Minimum bid</p>
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
              Niken artiz is a collection of samll city originally generated
              soldiers with hundreds of unique elements.
            </p>
            <div className="auctionBox">
              <h4>Auction ends in</h4>
              <div className="auctionTimer">
                <div className="timer">
                  <h5>13</h5>
                  <h6>Days</h6>
                </div>
                <div className="timer">
                  <h5>22</h5>
                  <h6>Hours</h6>
                </div>
                <div className="timer">
                  <h5>24</h5>
                  <h6>Minutes</h6>
                </div>
                <div className="timer">
                  <h5>2</h5>
                  <h6>Seconds</h6>
                </div>
              </div>
            </div>
            <div className="btnContainer">
              <SimpleButton
                text={"Place Bid"}
                backgroundColor={"#E44757"}
                color={"#FFFFFF"}
                onClick={buyAuctionNFT}
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
                <div className="collectioncardContainer">No Data 2 </div>
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

export default BuyAuctionNFT;
