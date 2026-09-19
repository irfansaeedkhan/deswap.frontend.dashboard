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

function listingnft() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("Not Loaded..");
  const [displayTab, setDisplayTab] = useState("tab1");
  const [toggleReportState, setToggleReportState] = useState(false);
  const [show, setShow] = useState(false);
  const [modalheader, setModalHeader] = useState("Complete Checkout");
  const [modalfooter, setModalFooter] = useState(null);
  const [modalbody, setModalBody] = useState(null);

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
  const completeCheckout = () => {
    setShow(true);
    setModalHeader("Your purchase is processing!");
    setModalBody(
      <div className="listingnftModal">
        <div className="nftImgIcon loadingCircle">
          <Image
            width={64}
            height={64}
            src="/images/Loading.png"
            alt={"loading"}
            loading="lazy"
          />
        </div>
        <h4>Transaction in progress</h4>
        <p>Your transaction is in progress, Please wait.</p>
      </div>
    );
    setModalFooter(
      <div className="FooterbtnContainer">
        <SimpleButton
          text={"Cancel"}
          // backgroundColor={"#E44757"}
          // color={"#FFFFFF"}
          backgroundColor={"#333333"}
          color={"#474747"}
          disabled={true}
          // onClick={() => {
          //   completeCheckout;
          // }}
        />
      </div>
    );

    setTimeout(CheckoutSuccess, 3000);
  };
  const CheckoutSuccess = () => {
    setShow(true);
    setModalHeader("Your purchase is successful");
    setModalBody(
      <div className="listingnftModal">
        <div className="nftImgIcon ">
          <Image
            width={64}
            height={64}
            src="/images/greenTick.png"
            alt={"greenTick"}
            loading="lazy"
          />
        </div>
        <h4>Purchased</h4>
        <p>
          Congratulations! You have successfully bought <span>King Darker</span>{" "}
          NFT on Nether NFT platform.
        </p>
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
  // async function loadNFTs() {

  //   // const connection = await web3Modal.connect()
  //   // const provider = new ethers.providers.Web3Provider(connection)
  //   // const signer = provider.getSigner()
  //   console.log("metaMaskValues: ",metaMaskValues);

  //   if (!metaMaskValues.metamaskconnected) {
  //     //Metamask not connected show pop
  //     setShow(true);
  //     setModalBody(
  //       <div className="modalcontentSuccess buydeswap modalWithImage">
  //         <div className="topImage">
  //           <div className="wallet">
  //             <Image
  //
  //
  //               width={1221}
  //               height={1221}
  //               src="/images/Connectwallet.png"
  //               alt={"deswap image"}
  //             />
  //           </div>
  //         </div>

  //         <div className="contentbox">
  //           <h5>Wallet Not Connected</h5>
  //           <p>Please Connect To Wallet Using Connect Button</p>
  //         </div>
  //       </div>
  //     );
  //     setModalFooter(
  //       <div className="buydeswapbuttonCotainer">
  //         <button
  //           className="modalBtn btnHoverEffectOutline"
  //           onClick={closeConnectButtonClick}
  //         >
  //           Ok
  //         </button>
  //       </div>
  //     );
  //     return;
  //   }

  //   const accounts = await metaMaskValues.metaconn.web3.eth.getAccounts()
  //   const nftcontract = new metaMaskValues.metaconn.web3.eth.Contract(nftABI, `${process.env.NEXT_PUBLIC_MY_NFT_Contract_Address}`);

  //   const contract = new metaMaskValues.metaconn.web3.eth.Contract(MarketPlaceABI, `${process.env.NEXT_PUBLIC_NFT_Marketplace_Address}`);

  //  // const contract = new ethers.Contract(MarketPlaceABI, `${process.env.NEXT_PUBLIC_NFT_Marketplace_Address}`, signer);

  //  /*
  //  * fatching the function from (marketplace) contract
  //  * returns all the nft's from the marktplace
  //  */
  //    let marketdata = await contract.methods.fetchMarketItems().call();
  //   //const data1 = await contract.methods.fetchItemsListed()

  //   const items = await Promise.all(marketdata.map(async i => {

  //     const tokenUri = await nftcontract.tokenURI(i.tokenId)
  //     const meta = await axios.get(tokenUri)  //https://ipps....
  //     let price = ethers.utils.formatEther(i.price)
  //     console.log("price is: ", price);
  //     //let price = metaMaskValues.metaconn.web3.utils.toWei(`${data1.Price}`, 'ether');
  //     let item = {
  //           price,
  //           tokenId: Number(i.tokenId),
  //           ExternalLink: i.ExternalLink,
  //           owner: i.owner,
  //           name: meta.data.name? meta.data.name : "None",
  //           image: meta.data.image? meta.data.image : "None",
  //           description: meta.data.description? meta.data.description : "None",
  //         }
  //     return item;
  //   }))

  //   setNfts(items);
  //   setLoadingState('NFT loaded..')
  // }

  async function loadNFTs() {
    let result = await connectToWallet("metamask");
    console.log("metamask results:", await result.web3.eth.getAccounts());

    //const accounts = await metaMaskValues.metaconn.web3.eth.getAccounts()
    const accounts = await result.web3.eth.getAccounts();

    //Pull the deployed contract instance(without signer)
    const contract = new result.web3WithoutSigner.eth.Contract(
      MarketPlaceABI,
      `${process.env.NEXT_PUBLIC_NFT_Marketplace_Address}`
    );

    /*fatching the function from (marketplace) contract that will return all the listed NFT's */
    //console.log("contract.methods: ",contract.methods);

    let marketdata = await contract.methods.fetchMarketItems().call();
    // console.log("fetchMarketItems details: ",marketdata);

    /*
     *  Iterate over the listed NFTs and retrieve their metadata
     *  map over items returned from smart contract and format
     *  them as well as fetch their token metadata
     */

    //Fetch all the details of every NFT from the contract and display it
    const items = await Promise.all(
      marketdata.map(async (i) => {
        //fetching the token URI from CreateNFT page
        const tokenUri = await contract.methods.tokenURI(i.tokenId).call();
        // console.log("token URI is: ", tokenUri);
        try {
          const meta = await axios.get(tokenUri); //fetching the url(https://ipps....)

          /*
           * this code exactly doing the same thing as above code
           * const response = await fetch(tokenUri);
           * const metadata55 = await response.json();
           *  console.log(" meta = await response.json(): ", meta); */

          let price = ethers.utils.formatEther(i.price);
          //let price = metaMaskValues.metaconn.web3.utils.toWei(`${data.Price}`, 'ether');
          console.log("price is: ", price);

          let item = {
            price,
            tokenId: Number(i.tokenId),
            ExternalLink: i.ExternalLink,
            owner: i.owner,
            name: meta.data.name ? meta.data.name : "None",
            image: meta.data.image ? meta.data.image : "None",
            description: meta.data.description ? meta.data.description : "None",
          };
          console.log(
            "item details inside try catch from listingnft page...: ",
            item
          );
          return item;
        } catch (err) {
          console.log("There is some error", err);
          return null;
        }
      })
    );

    updateFetched(true);
    updateData(items);

    // setNfts(items.filter(item => item !== null))
    // //setNfts(items);
    // console.log("items:",items);
    // setLoadingState("NFT loaded..");
  }
  if (!dataFetched) {
    loadNFTs();
  }

  async function lowerPriceFunc(nft) {
    try {
      await setShow(true);
      await setModalHeader("Lower Price");
      await setModalBody(
        <div className="listingnftModal">
          <div className="priceBox">
            <input type="text" placeholder="Price" />
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
            </div>
          </div>
          <h5
            style={{ color: "#858585", lineHeight: "20px", paddingTop: "10px" }}
          >
            You must pay an additional gas fee if you want to cancel this
            listing at a later point. Learn more
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
            text={"Set New Price"}
            backgroundColor={"#E44757"}
            color={"#FFFFFF"}
            onClick={() => {
              setShow(false);
            }}
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
  }

  const closeButton = () => {
    setShow(false);
  };
  async function listingnftModal() {
    try {
      await setShow(true);
      await setModalHeader("Are you sure  you want to cancel your Listing?");
      await setModalBody(
        <div className="stacknftModal">
          <h5 style={{ color: "#858585" }}>
            Canceling your listing will unpublish this sale from market and You
            will be asked to confirm the transaction through your wallet.
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
            text={"Proceed"}
            backgroundColor={"#E44757"}
            color={"#FFFFFF"}
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
  return (
    <div className="listingnft">
      <MarketNavbar />
      <div className="listingnftInner">
        <div className="nftImg">
          <Image
            width={696}
            height={807}
            src="/images/nft4.png"
            alt={"nft image"}
            loading="lazy"
          />
          <div className="heartImg">
            <HeartIcon />
          </div>
        </div>
        <div className="nftDetails">
          <div className="titleContainer">
            <h3>Hayazeen Bugy</h3>

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
                <button
                  className={`reportBtn ${toggleReportState && "show"}`}
                  onClick={lowerPriceFunc}
                >
                  Lower Price
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
                onClick={listingnftModal}
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

export default connect(mapStateToProps, mapDispatchToProps)(listingnft);

//export default listingnft;
