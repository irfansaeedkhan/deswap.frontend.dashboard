import React, { useState, useEffect } from "react";
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
import { connectToWallet } from "../../utils/wallet/index";
import SimpleButton from "@/components/reusables/SimpleButton";
import BootstrapModal from "@/components/reusables/BootstrapModal";
import {
  connectToMeta,
  metaMaskDisconnected,
  metaMaskValue,
} from "../../redux/actions/metamask";
import { wrapper } from "../../redux/store/store";
import { connect, useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { checkUserAuth } from "@/utils/auth/userauth";
import axios from "axios";

var metaMaskValues = null;

function stacknft() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("Not Loaded..");
  const [displayTab, setDisplayTab] = useState("tab1");
  const [toggleReportState, setToggleReportState] = useState(false);
  const [show, setShow] = useState(false);
  const [modalheader, setModalHeader] = useState("Complete Checkout");
  const [modalfooter, setModalFooter] = useState(null);
  const [modalbody, setModalBody] = useState(null);
  const [staked, setStaked] = useState(true);

  const [data, updateData] = useState([]);
  const [dataFetched, updateFetched] = useState(false);

  // useEffect(() => {
  //   loadNFTs()
  // }, [])

  const copy = async () => {
    // await navigator.clipboard.writeText(window.location.href.split("/")[0]+"//"+window.location.href.split("/")[1]+window.location.href.split("/")[2]+"/user/register?ref="+users.uuid);
  };
  const toggleReport = async () => {
    setToggleReportState((prev) => !prev);
  };
  const completeCheckout = async () => {
    await setShow(true);
    await setModalHeader("Sell NFT");
    await setModalBody(
      <div className="stacknftModal">
        <div className="nftImgIcon">
          <Image
            width={120}
            height={120}
            //src={nft.image}   //to show the image here
            src="/images/king.png"
            alt={"icon"}
            loading="lazy"
          />
        </div>
        <h4>King darker</h4>
        <h5>
          Octagon_Deswap-<span>55c345C3UV</span>
        </h5>
        <div className="priceBox">
          <label htmlFor="">Set Price</label>
          <div className="maticicon">
            <Image
              width={14}
              height={14}
              src={"/images/maticicon.png"}
              alt={"matic icon"}
              loading="lazy"
            />
          </div>
          <input type="text" placeholder="Price" />
        </div>
      </div>
    );
    await setModalFooter(
      <div className="FooterbtnContainer">
        <SimpleButton
          text={"Sell"}
          backgroundColor={"#E44757"}
          color={"#FFFFFF"}
          onClick={() => {
            CheckoutSuccess();
          }}
        />
      </div>
    );

    // setTimeout(CheckoutSuccess, 3000);
  };
  const CheckoutSuccess = () => {
    setShow(true);
    setModalHeader("Congratulations, Your item sold!");
    setModalBody(
      <div className="stacknftModal">
        <div
          className="nftImgIcon"
          style={{
            borderRadius: "16px",
            width: "120px",
            margin: "0 auto",
            overflow: "hidden",
          }}
        >
          <Image
            width={120}
            height={120}
            src="/images/king.png"
            alt={"icon"}
            loading="lazy"
          />
        </div>
        <h4>king darker</h4>

        <h5 style={{ color: "#858585", lineHeight: "20px" }}>
          You have successfully sold{" "}
          <span style={{ color: "#ffffff" }}>King darker</span> for{" "}
          <span style={{ color: "#E44757" }}>123.00 Poligon</span> on Nether NFT
          platform.
        </h5>
      </div>
    );
    setModalFooter(
      <div className="FooterbtnContainer">
        <SimpleButton
          text={"View Item"}
          backgroundColor={"rgba(228, 71, 87, 0.12)"}
          color={"#E44757"}
        />
      </div>
    );
  };

  async function stacknft() {
    try {
      await setShow(true);
      await setModalHeader("Stake NFT");
      await setModalBody(
        <div className="stacknftModal">
          <div
            className="nftImgIcon"
            style={{
              borderRadius: "16px",
              width: "120px",
              margin: "0 auto",
              overflow: "hidden",
            }}
          >
            <Image
              width={120}
              height={120}
              src="/images/king.png"
              alt={"icon"}
              loading="lazy"
            />
          </div>
          <h4>king darker</h4>
          <h5 style={{ color: "#858585" }}>
            Do you want to Stake Small world By{" "}
            <span style={{ color: "#ffffff" }}>king darker NFT?</span>
          </h5>
        </div>
      );
      await setModalFooter(
        <div
          className="FooterbtnContainer"
          style={{ display: "flex", gap: "7px" }}
        >
          <SimpleButton
            text={"Go Back"}
            backgroundColor={"#E44757"}
            color={"#FFFFFF"}
            onClick={() => {
              setShow(false);
            }}
          />
          <SimpleButton
            text={"Yes"}
            backgroundColor={"#E44757"}
            color={"#FFFFFF"}
            onClick={() => {
              Processstacknft();
            }}
          />
        </div>
      );
    } catch (e) {
      console.log("Failed to edit transaction ", e);
    }
  }
  async function Processstacknft() {
    try {
      await setShow(true);
      await setModalHeader("Stake NFT");
      await setModalBody(
        <div className="stacknftModal">
          <div
            className="nftImgIcon"
            style={{
              borderRadius: "16px",
              width: "120px",
              margin: "0 auto",
              overflow: "hidden",
            }}
          >
            <Image
              width={120}
              height={120}
              src="/images/king.png"
              alt={"icon"}
              loading="lazy"
            />
          </div>
          <h4>king darker</h4>
          <h5>
            Octagon_Deswap-<span>55c345C3UV</span>
          </h5>
          <div className="statusBox">
            <div className="status">
              <h5>Status</h5>
              <h6>{staked ? "Completed" : "Processing"}</h6>
            </div>
            <div className="status">
              <h5>Transaction Hash</h5>
              <h6 style={{ color: "#E44757" }}>0x1204...23b350</h6>
            </div>
          </div>
        </div>
      );
      await setModalFooter(
        <div className="FooterbtnContainer">
          <SimpleButton
            text={"Ok"}
            disabled={!staked}
            backgroundColor={staked ? "#E44757" : "#333333"}
            color={staked ? "#FFFFFF" : "#474747"}
            onClick={() => {
              setShow(false);
            }}
          />
        </div>
      );
    } catch (e) {
      console.log("Failed to edit transaction ", e);
    }
  }

  const closeButton = () => {
    setShow(false);
  };
  return (
    <div className="stacknft">
      <MarketNavbar />
      <div className="stacknftInner">
        <div className="nftImg">
          <Image
            width={696}
            height={807}
            src="/images/king.png"
            alt={"nft image"}
            loading="lazy"
          />
          <div className="heartImg">
            <HeartIcon />
          </div>
        </div>
        <div className="nftDetails">
          <div className="titleContainer">
            <h3>king darker</h3>

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
                  You
                  <TickIcon />
                </h6>
              </div>
            </div>
            <div className="Content">
              <h5>Collection</h5>
              <div className="author">
                <h6>Octagon_Deswap</h6>
              </div>
            </div>
            <div className="Content">
              <h5>Views</h5>
              <div className="author">
                <h6>41.3K</h6>
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
                text={"Stake"}
                backgroundColor={"#E44757"}
                color={"#FFFFFF"}
                onClick={() => {
                  stacknft();
                }}
              />
              <SimpleButton
                text={"Sell"}
                backgroundColor={"rgba(228, 71, 87, 0.12)"}
                color={"#e44757"}
                onClick={() => {
                  completeCheckout();
                }}
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

const mapStateToProps = (state) => {
  metaMaskValues = state.metamaskConn;
  return { metamaskConn: state.metamaskConn };
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    await store.dispatch(metaMaskValue());
    return await checkUserAuth(ctx);
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    connectToMeta: bindActionCreators(connectToMeta, dispatch),
    metaMaskDisconnected: bindActionCreators(metaMaskDisconnected, dispatch),
    metaMaskValue: bindActionCreators(metaMaskValue, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(stacknft);

//export default stacknft;
