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
import { connectToWallet } from "../../../utils/wallet/index";
import SimpleButton from "@/components/reusables/SimpleButton";
import BootstrapModal from "@/components/reusables/BootstrapModal";
import {
  connectToMeta,
  metaMaskDisconnected,
  metaMaskValue,
} from "../../../redux/actions/metamask";
import { wrapper } from "../../../redux/store/store";
import { connect, useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { checkUserAuth } from "@/utils/auth/userauth";
import axios from "axios";
import MarketPlaceABI from "../../../abi/nft-marketplace.json";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import {
  listNFTInID
} from "../../../subgraph/query";
import { reducedWalletAddress } from "@/utils/common/walletaddress";
import MainContent from "../../../components/marketPlace/resuable/MainContent";
import BootstrapBodyModal from "@/components/reusables/BootstrapBodyModal";
import { useRouter } from "next/router";


var metaMaskValues = null;

function buynft() {
  const [nfts, setNFTData] = useState();
  const [loadingState, setLoadingState] = useState("Not Loaded..");
  const [displayTab, setDisplayTab] = useState("tab1");
  const [toggleReportState, setToggleReportState] = useState(false);
  const [show, setShow] = useState(false);
  const [modalheader, setModalHeader] = useState("Complete Checkout");
  const [modalfooter, setModalFooter] = useState(null);
  const [modalbody, setModalBody] = useState(null);
  const [resp, setResp] = useState();
  const [price, setPrice] = useState()
  const [data, updateData] = useState([]);
  const [dataFetched, updateFetched] = useState(false);
  const [description, setDescription] = useState();
  const [imageLink, setImageLink] = useState();
  const router = useRouter();


  useEffect(() => {
    fetchNFT()
  }, [metaMaskValues,router])


  const fetchNFT = async () => {
    try {
      console.log("router",router)
      //Checking if metamask wallet is connected or not
      if (!metaMaskValues.metamaskconnected) {
        setShow(true);
        setModalHeader()
        setModalBody(
          <BootstrapBodyModal
            imageSrc="/images/Connectwallet.png"
            heading="Wallet Not Connected"
            paragraph="Please Connect To Wallet Using Connect Button"
          ></BootstrapBodyModal>
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
        )
        return;
      }
      const client = new ApolloClient({
        uri: process.env.NEXT_PUBLIC_THEGRAPH_URL,
        cache: new InMemoryCache(),
      });
      console.log("fsdklmlkdfmg", router.query.id)
      const { data } = await client.query({
        query: gql(listNFTInID),
        variables: {
          id: router.query.id,
        },
        fetchPolicy: "cache-first",
      });
      console.log("data", data)
      // // console.log("nftData",nftData)
      console.log("data.createItems", data.createItems[0])
      const response = await axios.get(
        process.env.NEXT_PUBLIC_IPFS_URL +
        "/ipfs/" +
        data.createItems[0]._tokenURI.split("/")[data.createItems[0]._tokenURI.split("/").length - 1]
      );
      console.log("res--", response.data);
      setDescription(response?.data?.description);
      setImageLink(
        process.env.NEXT_PUBLIC_IPFS_URL +
        "/ipfs/" +
        response?.data?.image.split("/")[
        response?.data?.image.split("/").length - 1
        ]
      );
      setResp(response.data)
      let result = await connectToWallet("metamask");
      let price = result.web3.utils.fromWei(
        data.createItems[0]._price,
        "ether"
      )
      setPrice(price)
      setNFTData(data.createItems)
    } catch (error) {
      console.log("testing ", error);
    }
  }

  console.log("metaMaskValues", metaMaskValues)

  const copy = async () => {
    // await navigator.clipboard.writeText(window.location.href.split("/")[0]+"//"+window.location.href.split("/")[1]+window.location.href.split("/")[2]+"/user/register?ref="+users.uuid);
  };
  const toggleReport = async () => {
    setToggleReportState((prev) => !prev);
  };
  const completeCheckout = async() => {
    const contract = new metaMaskValues.metaconn.web3.eth.Contract(
      MarketPlaceABI,
      `${process.env.NEXT_PUBLIC_NFT_Marketplace_Address}`
    );

    const accounts = await metaMaskValues.metaconn.web3.eth.getAccounts();

    console.log("nfts", nfts[0])

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = metaMaskValues.metaconn.web3.utils.toWei(nfts[0]._price.toString());
    const transaction = await contract.methods.createMarketSale(nfts[0]._tokenID).send({
      from:accounts[0],
      gasLimit: await metaMaskValues.metaconn.web3.utils.toHex(
        2100000
      ),
      value: nfts[0]._price.toString()
    })
    console.log("transaction", transaction)
    setShow(true);
    setModalHeader("Your purchase is processing!");
    setModalBody(
      <div className="buynftModal">
        <div className="nftImgIcon loadingCircle">
          <Image
            width={64}
            height={64}
            src="/images/Loading.png"
            alt={"loading"}
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
      <div className="buynftModal">
        <div className="nftImgIcon ">
          <Image
            width={64}
            height={64}
            src="/images/greenTick.png"
            alt={"loading"}
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

  // async function loadNFTs() {
  //   let result = await connectToWallet("metamask");
  //   console.log("metamask results:", await result.web3.eth.getAccounts());

  //   //const accounts = await metaMaskValues.metaconn.web3.eth.getAccounts()
  //   const accounts = await result.web3.eth.getAccounts();

  //   //Pull the deployed contract instance(without signer)
  //   const contract = new result.web3WithoutSigner.eth.Contract(
  //     MarketPlaceABI,
  //     `${process.env.NEXT_PUBLIC_NFT_Marketplace_Address}`
  //   );

  //   /*fatching the function from (marketplace) contract that will return all the listed NFT's */
  //   //console.log("contract.methods: ",contract.methods);

  //   let marketdata = await contract.methods.fetchItemsListed().call();
  //   console.log("fetchMarketItems details: ",marketdata);

  //   /*
  //    *  Iterate over the listed NFTs and retrieve their metadata
  //    *  map over items returned from smart contract and format
  //    *  them as well as fetch their token metadata
  //    */

  //   //Fetch all the details of every NFT from the contract and display it
  //   const items = await Promise.all(
  //     marketdata.map(async (i) => {
  //       //fetching the token URI from CreateNFT page
  //       const tokenUri = await contract.methods.tokenURI(i.tokenId).call();
  //       // console.log("token URI is: ", tokenUri);
  //       try {
  //         const meta = await axios.get(tokenUri); //fetching the url(https://ipps....)

  //         /*
  //          * this code exactly doing the same thing as above code
  //          * const response = await fetch(tokenUri);
  //          * const metadata55 = await response.json();
  //          *  console.log(" meta = await response.json(): ", meta); */

  //         let price = ethers.utils.formatEther(i.price);
  //         //let price = metaMaskValues.metaconn.web3.utils.toWei(`${data.Price}`, 'ether');
  //         console.log("price is: ", price);

  //         let item = {
  //           price,
  //           tokenId: Number(i.tokenId),
  //           ExternalLink: i.ExternalLink,
  //           owner: i.owner,
  //           name: meta.data.name ? meta.data.name : "None",
  //           image: meta.data.image ? meta.data.image : "None",
  //           description: meta.data.description ? meta.data.description : "None",
  //         };
  //         console.log(
  //           "item details inside try catch from buyNFT page...: ",
  //           item
  //         );
  //         return item;
  //       } catch (err) {
  //         console.log("There is some error", err);
  //         return null;
  //       }
  //     })
  //   );

  //   updateFetched(true);
  //   updateData(items);

  //   // setNfts(items.filter(item => item !== null))
  //   // //setNfts(items);
  //   // console.log("items:",items);
  //   // setLoadingState("NFT loaded..");
  // }
  // if (!dataFetched) {
  //   loadNFTs();
  // }

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
      );
    } catch (e) {
      console.log("Failed to close modal");
    }
  };

  async function buyNFT(nft) {
    //I want to ask about built in libraries.. like this...??

    //this is the way to use built-in libraries
    //  /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    //  const web3Modal = new Web3Modal()
    //  const connection = await web3Modal.connect()
    //  const provider = new ethers.providers.Web3Provider(connection)
    //  const signer = provider.getSigner()
    //  const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)

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

    // const accounts = await metaMaskValues.metaconn.web3.eth.getAccounts();

    // const contract = new metaMaskValues.metaconn.web3.eth.Contract(
    //   MarketPlaceABI,
    //   `${process.env.NEXT_PUBLIC_NFT_Marketplace_Address}`
    // );

    // /* user will be prompted to pay the asking proces to complete the transaction */
    // const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    // const transaction = await contract.createMarketSale(nft.tokenId);
    // // await transaction.wait()
    // loadNFTs();

    try {
      await setShow(true);
      await setModalBody(
        <div className="buynftModal">
          <div className="nftImgIcon">
            <Image
              width={120}
              height={120}
              //src={nft.image}   //to show the image here
              src="/images/buynft.png"
              alt={"icon"}
            />
          </div>
          <h4>{resp?.name}</h4>
          <h5>
            Small world By <span>Octagon_Deswap</span>
          </h5>
          <div className="priceBox">
            <input type="text" placeholder="Price" />
            <div className="pricelist">
              <div className="maticicon">
                <Image
                  width={14}
                  height={14}
                  src={"/images/maticicon.png"}
                  alt={"matic icon"}
                />
              </div>
              <h6>
                {price} <span>${price}</span>
              </h6>
            </div>
          </div>
        </div>
      );
      await setModalFooter(
        <div className="FooterbtnContainer">
          <SimpleButton
            text={"Checkout"}
            backgroundColor={"#E44757"}
            color={"#FFFFFF"}
            onClick={() => {
              completeCheckout();
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
  return (
    <div className="buyNFT">
      <MarketNavbar />
      <div className="buyNFTInner">
        <div className="nftImg">
          <Image
            width={696}
            height={807}
            src="/images/trimface.png"
            alt={"nft image"}
          />
          <div className="heartImg">
            <HeartIcon />
          </div>
        </div>
        <div className="nftDetails">
          <div className="titleContainer">
            <h3>{resp?.name}</h3>

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
                  />
                </div>
                <h5>
                  {price} MATIC <span>(${price})</span>
                </h5>
              </div>
            </div>
            <p className="description">
              {description}
            </p>
            <div className="btnContainer">
              <SimpleButton
                text={"Buy Now"}
                backgroundColor={"#E44757"}
                color={"#FFFFFF"}
                onClick={() => {
                  buyNFT();
                }}
              />
              <SimpleButton
                text={"Make Offer"}
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
                    <h5>{nfts && nfts[0]?.id}</h5>
                  </div>
                  <div className="data">
                    <h6>MINT TRANSACTION</h6>
                    <h5>{nfts && reducedWalletAddress(nfts[0]?.transactionHash)}</h5>
                  </div>
                  <div className="data">
                    <h6>CONTRACT ADDRESS</h6>
                    <h5 className="themecolor">{reducedWalletAddress(process.env.NEXT_PUBLIC_NFT_Marketplace_Address)}</h5>
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

export default connect(mapStateToProps, mapDispatchToProps)(buynft);

//export default BuyNFT;
