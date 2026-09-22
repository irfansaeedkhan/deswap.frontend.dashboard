import React, { useState, useEffect } from "react";
import NFTCard from "@/components/marketPlace/NFTCard";
import { HeartIcon, TickIcon } from "@/components/marketPlace/MarketIcons";
import ArrowDown from "@/assets/svgAssets/ArrowDown";
import Searchicon from "@/assets/svgAssets/SearchIcon";
import DropDownV2 from "@/components/global/DropDownV2";
import SimpleButton from "@/components/reusables/SimpleButton";
import { useRouter } from "next/router";
import axios from "@/utils/common/axios";
import OctagonLicense from "../../../abi/octagon-license";
import {
  connectToMeta,
  metaMaskDisconnected,
  metaMaskValue,
} from "../../../redux/actions/metamask";
import { wrapper } from "../../../redux/store/store";
import { connect, useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { checkAdminAuth } from "@/utils/auth/checkAdminAuth";
import Loader from "@/components/reusables/loader/Loader";
import BootstrapModal from "@/components/reusables/BootstrapModal";
import Image from "next/image";
import MarketPlaceABI from "../../../abi/nft-marketplace.json";

var metaMaskValues = null;

function NFTFilterBox({
  collectedData,
  data,
  auctiondata,
  dataType,
  purchase,
  metamaskConny,
}) {
  const [activeCollection, setActiveCollection] = useState("buy");
  const [filterState, setFilterState] = useState(true);
  const [statusState, setStatusState] = useState(true);
  const [priceState, setPriceState] = useState(true);
  const [statusError, setStatusError] = useState(false);
  const [getStatus, setGetStatus] = useState("Active");
  const [liceseData, setLicenseData] = useState();
  const [displayButton, setDisplayButton] = useState(false);
  const [show, setShow] = useState(false);
  const [modalheader, setModalHeader] = useState();
  const [modalbody, setModalBody] = useState();
  const [modalfooter, setModalFooter] = useState(null);
  // status notApplied - Pending - Mint - CreateCollection
  const [licenseStatus, setLicenseStatus] = useState("notApplied");
  const router = useRouter();

  const getDropdownValue = (value) => {
    setGetStatus(value);
  };

  useEffect(() => {
    fetchLicenseData();
  }, []);

  const fetchLicenseData = async () => {
    try {
      let result = await axios.get(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/marketplace/license/fetchall`,
        {},
        {
          withCredentials: true,
          headers: {
            "security-set": false,
          },
        }
      );

      setLicenseData(result.data.data);
      setDisplayButton(true);
    } catch (e) {
      console.log(e);
    }
  };

  const closeConnectButtonClick = async () => {
    try {
      await setShow(false);
      setModalBody(
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
                alt=" icon"
                className="icon activeImg"
                loading="lazy"
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
                loading="lazy"
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
                loading="lazy"
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
                loading="lazy"
              />
              <p>Trust Wallet</p>
            </div>
          </div>
        </div>
      );
    } catch (e) {
      console.log("Failed to close modal");
    }
  };

  const mintFunction = async () => {
    try {
      if (!metaMaskValues.metamaskconnected) {
        //Metamask not connected show pop
        setShow(true);
        setModalBody(
          <div className="modalcontentSuccess buydeswap modalWithImage">
            <div className="topImage">
              <div className="wallet">
                <Image
                  width={1221}
                  height={1221}
                  src="/images/Connectwallet.png"
                  alt={"deswap image"}
                  crossOrigin=""
                  loading="lazy"
                />
              </div>
            </div>

            <div className="contentbox">
              <h5>Wallet Not Connected</h5>
              <p>Please Connect To Wallet Using Connect Button</p>
            </div>
          </div>
        );
        setModalFooter(
          <div className="buydeswapbuttonCotainer">
            <button
              className="modalBtn btnHoverEffectOutline"
              onClick={closeConnectButtonClick}
            >
              Ok
            </button>
          </div>
        );
        return;
      }
      const accounts = await metaMaskValues.metaconn.web3.eth.getAccounts();
      const contract = new metaMaskValues.metaconn.web3.eth.Contract(
        OctagonLicense,
        `${process.env.NEXT_PUBLIC_Octagon_License_Contract_Address}`,
        {
          from: accounts[0],
        }
      );
      // const status = await contract.methods.checkStatus(accounts[0]).call();
      // console.log("status",status)
      // if (status == false) {
      //   setShow(true);
      //   setModalHeader(<div className="modalcontentSuccess">Failed</div>);
      //   setModalBody(<div className="contentbox"><h5>Your License has not approved.</h5></div>)
      //   setModalFooter(<div className="buydeswapbuttonCotainer">
      //     <button
      //       className="modalBtn btnHoverEffectOutline"
      //       onClick={closeConnectButtonClick}
      //     >
      //       Ok
      //     </button>
      //   </div>)
      //   return;
      // }
      let result = await contract.methods.mintLicense().call();
      console.log("result", result);

      const marketPlacecontract = new metaMaskValues.metaconn.web3.eth.Contract(
        MarketPlaceABI,
        `${process.env.NEXT_PUBLIC_NFT_Marketplace_Address}`,
        {
          from: accounts[0],
        }
      );

      const fetchData = await marketPlacecontract.methods
        .fetchItemsListed()
        .call();
      console.log("fetchData", fetchData);
    } catch (e) {
      console.log(e);
    }
  };

  const sortData = [
    { id: 0, label: "Lowest Price" },
    { id: 1, label: "Highest Price" },
  ];
  const filterToggle = () => {
    setFilterState((prev) => !prev);
  };
  const statusToggle = () => {
    setStatusState((prev) => !prev);
    setTimeout(() => {
      let over = document.querySelector(".status .contents");
      if (over.classList.contains("active")) {
        over.style.overflow = "initial";
      } else {
        over.style.overflow = "hidden";
      }
    }, 130);
  };
  const priceToggle = () => {
    setPriceState((prev) => !prev);
  };

  const exploreFunction = () => {
    router.push("/market/license");
  };
  return (
    <div className="ItemsContainer">
      <div className="filterTopContainer">
        <SimpleButton
          text={"Filters"}
          backgroundColor={!filterState ? "#333333" : "#ffffff"}
          color={!filterState ? "#858585" : "#0a0a0a"}
          onClick={filterToggle}
        />
        <div className="searchInput">
          <div className="searchIcon">
            <Searchicon />
          </div>
          <input type="text" placeholder="Search Here" />
        </div>
        <div className="dropdownInput">
          <DropDownV2
            title={"Sort and filters"}
            data={sortData}
            getDropdownValue={getDropdownValue}
            placeholder={sortData[0].label}
          />
          {statusError && <p>{"kindly select the status"}</p>}
        </div>
      </div>
      <div className="filterBottomContainer">
        {filterState && (
          <div className="filterBox">
            <div className="filterBoxInner">
              <div className={`status ${statusState && "active"}`}>
                <div className="titleArrow" onClick={statusToggle}>
                  <h6>Status</h6>
                  <ArrowDown />
                </div>
                <div className={`contents ${statusState && "active"}`}>
                  <div className="contentsInner">
                    <button
                      className={`SimpleButton btnHoverEffectOutline ${
                        activeCollection == "buy" && "active"
                      }`}
                      onClick={() => {
                        setActiveCollection("buy");
                      }}
                    >
                      Buy Now
                    </button>
                    <button
                      className={`SimpleButton btnHoverEffectOutline ${
                        activeCollection == "auction" && "active"
                      }`}
                      onClick={() => {
                        setActiveCollection("auction");
                      }}
                    >
                      Timed Auction
                    </button>
                  </div>
                </div>
              </div>
              <div className={`price ${priceState && "active"}`}>
                <div className="titleArrow" onClick={priceToggle}>
                  <h6>Price</h6>
                  <ArrowDown />
                </div>
                <div className="contents">
                  <div className="contentsInner">
                    <div className="inputBoxContainer">
                      <p>Lowest</p>
                      <div className="inputBox">
                        <input type="text" placeholder="0" />
                        <h6>Matic</h6>
                      </div>
                    </div>
                    <div className="inputBoxContainer">
                      <p>Highest</p>
                      <div className="inputBox">
                        <input type="text" placeholder="0" />
                        <h6>Matic</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="filterFooter">
                <button className="SimpleButton btnHoverEffectOutline">
                  Apply
                </button>
                <button className="SimpleButton btnHoverEffectOutline">
                  Clear Filter
                </button>
              </div>
            </div>
          </div>
        )}

        <div className={`collectionBox ${!filterState && "Box4"}  `}>
          {activeCollection == "buy" &&
            (data?.length > 0 ? (
              data.map((cardData) => (
                <NFTCard
                  cardData={cardData}
                  purchase={purchase}
                  dataType={dataType}
                  collectedData={collectedData}
                />
              ))
            ) : (
              <>
                {dataType == "collected" && (
                  <div className="nodataDetail collected">
                    <h4>Nothing found</h4>
                    <p>We couldn't find anything with this criteria</p>
                    <SimpleButton
                      text={"Explore NFTs"}
                      backgroundColor={"#E44757"}
                      color={"#FFFFFF"}
                      onClick={exploreFunction}
                    />
                  </div>
                )}
                {licenseStatus === "notApplied" && (
                  <div className="nodataDetail created">
                    <h4>Create And Sell Your Own NFTs</h4>
                    <p>
                      Only license holders are allowed to build in the ocatgon
                      metaverse. Get your license now and start building
                    </p>
                    {displayButton ? (
                      liceseData ? (
                        liceseData.status == "Accept" ? (
                          <SimpleButton
                            text={"Mint your License"}
                            backgroundColor={"#E44757"}
                            color={"#FFFFFF"}
                            onClick={mintFunction}
                          />
                        ) : liceseData.status != "Reject" ? (
                          <SimpleButton
                            text={"Mint your License"}
                            backgroundColor={"#333333"}
                            color={"#474747"}
                          />
                        ) : (
                          <SimpleButton
                            text={"Apply For License"}
                            backgroundColor={"#E44757"}
                            color={"#FFFFFF"}
                            onClick={exploreFunction}
                          />
                        )
                      ) : (
                        <SimpleButton
                          text={"Apply For License"}
                          backgroundColor={"#E44757"}
                          color={"#FFFFFF"}
                          onClick={exploreFunction}
                        />
                      )
                    ) : null}
                  </div>
                )}
              </>
            ))}
          {activeCollection == "auction" &&
            auctiondata.map((AuctionCardData) => (
              <NFTCard
                collectedData={collectedData}
                cardData={AuctionCardData}
                purchase={purchase}
                dataType={dataType}
              />
            ))}
        </div>
      </div>
      <BootstrapModal
        show={show}
        handleClose={closeConnectButtonClick}
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
    return await checkAdminAuth(ctx);
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    connectToMeta: bindActionCreators(connectToMeta, dispatch),
    metaMaskDisconnected: bindActionCreators(metaMaskDisconnected, dispatch),
    metaMaskValue: bindActionCreators(metaMaskValue, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NFTFilterBox);
