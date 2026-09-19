import React, { useState, useEffect } from "react";
import CardCollection from "@/components/marketPlace/CardCollection";
import MarketFooter from "@/components/marketPlace/MarketFooter";
import MarketNavbar from "@/components/marketPlace/MarketNavbar";
import MarketPlaceABI from "../../abi/nft-marketplace.json";
import nftABI from "../../abi/my-nft.json";
import { useInView } from "react-intersection-observer";

import { checkUserAuth } from "@/utils/auth/userauth";
import {
  connectToMeta,
  metaMaskDisconnected,
  metaMaskValue,
} from "../../redux/actions/metamask";
import {
  connectToWallet,
  fetchMetaMaskAccount,
  etherumFetchAccount,
  web3USDCContract,
  web3DeSwapContract,
} from "../../utils/wallet/index";
import { encryptRequestBody } from "@/utils/common/jwtToken";

import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import {
  listCollectionBySymbol,
  listAllCollections,
} from "../../subgraph/query";

import { ethers, logger } from "ethers";
import axios from "axios";
// import Web3Modal, { findMatchingRequiredOptions } from "web3modal";
//import Web3Modal from 'web3modal'
import { create as ipfsCreate } from "ipfs-http-client";

import { useRouter } from "next/router";

import { wrapper } from "../../redux/store/store";
import { connect, useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import image from "next/image";

var metaMaskValues = null;

function Dashboard() {
  const [lastPostRef, _lastPostInView, lastPostEntry] = useInView();
  const [displayTab, setDisplayTab] = useState("tab1");
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("Not-loaded");
  const [show, setShow] = useState(false);
  const [modalheader, setModalHeader] = useState();
  const [modalbody, setModalBody] = useState();
  const [modalfooter, setModalFooter] = useState(null);

  const [data, updateData] = useState([]);
  const [dataFetched, updateFetched] = useState(false);
  const [collection, setCollection] = useState([]);
  const [likedCollection, setLikedCollection] = useState([]);
  const [skip, setSkip] = useState(0);

  const router = useRouter();

  useEffect(() => {
    //loadNFTs();
    fetchCollection();
    if (lastPostEntry?.isIntersecting) {
      setSkip(skip + 6);
    }
  }, [lastPostRef, lastPostEntry, setSkip]);
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

  const fetchCollection = async () => {
    try {
      console.log("skip", skip);
      const client = new ApolloClient({
        uri: process.env.NEXT_PUBLIC_THEGRAPH_URL,
        cache: new InMemoryCache(),
      });
      const { data } = await client.query({
        query: gql(listAllCollections),
        variables: {
          first: 6,
          skip: skip,
        },
        fetchPolicy: "cache-first",
      });

      console.log("Fetching data : ", data);
      let collectionIDs = new Array();
      data.createCollections.map((datas) => {
        collectionIDs.push(datas.id);
      });
      console.log("collectionIDs", collectionIDs);
      //let encryptionData = await encryptRequestBody({collectionIDs:collectionIDs});
      let result = await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/users/marketplace/collection/fetchlike`,
        { data: collectionIDs },
        {
          withCredentials: true,
          headers: {
            "security-set": true,
          },
        }
      );

      console.log("Liked APIs : ", result.data.data);
      setLikedCollection(result.data.data);
      setCollection([...collection, ...data.createCollections]);
    } catch (error) {
      console.log("testing ", error);
    }
  };

  //geting all the nft's
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
    console.log("contract connection: ", contract);

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
          return item;
        } catch (err) {
          console.log("There is some error", err);
          return null;
        }
      })
    );

    //now we are getting all the details from inputs fields

    updateFetched(true);
    updateData(items);

    // setNfts(items.filter(item => item !== null))
    // //setNfts(items);
    // console.log("items:",items);
    // setLoadingState("NFT loaded..");
  }
  if (!dataFetched) {
    //loadNFTs();
  }

  // if (loadingState === "loaded" && !nfts.length) {
  //   return (
  //     <h1 className="py-10 px-20 text-2xl">No NFT's in the marketplace</h1>
  //   );
  // }

  //tab
  //function Explorecollections() {

  //const [displayTab, setDisplayTab] = useState("tab1");

  // nfts.map((nft, i) => (
  //   <div key={i} className="border shadow rounded-xl overflow-hidden">
  //     <img src={nft.image} className="rounded" />
  //     <div className="p-4 bg-black">
  //       <p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
  //     </div>
  //   </div>
  // ))

  async function buyNft(nft) {
    let result = await connectToWallet("metamask");
    console.log("results:", await result.web3.eth.getAccounts());

    console.log("metaMaskValues: ", metaMaskValues);

    const accounts = await result.web3.eth.getAccounts();

    const contract = new result.web3.eth.Contract(
      MarketPlaceABI,
      `${process.env.NEXT_PUBLIC_NFT_Marketplace_Address}`,
      {
        from: accounts[0],
      }
    );

    console.log("marketplace contract data: ", contract);

    // const contract = new ethers.Contract(MarketPlaceABI, `${process.env.NEXT_PUBLIC_NFT_Marketplace_Address}`, signer);

    //fatching the function from (marketplace) contract that will return all the listed NFT's
    //const marketdata = await contract.methods.fetchItemsListed().call();
    const transaction = await contract.methods.createMarketSale(nft.tokenId);
    await transaction.wait();
    console.log("create market sale data: ", transaction);
    loadNFTs();
  }

  console.log("likedCollection", likedCollection);
  return (
    <div className="marketMain">
      <MarketNavbar />
      <div className="exploreContainer">
        <div className="exploreInner deswapMax">
          <div className="title">
            <h1>Explore Collections</h1>
          </div>
          <div className="exploreMain">
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
                    Trending
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
                    Stakable
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
                    Unique
                  </button>
                </li>
              </ul>
              <div className="tab-content">
                {displayTab == "tab1" && (
                  <div className="collectioncardContainer" ref={lastPostRef}>
                    {collection &&
                      collection.map((cardData) => (
                        <>
                          {likedCollection.indexOf(cardData.id) >= 0 ? (
                            <CardCollection
                              key={cardData.id}
                              cardData={cardData}
                              likes={true}
                            />
                          ) : (
                            <CardCollection
                              key={cardData.id}
                              cardData={cardData}
                              likes={false}
                            />
                          )}
                        </>
                      ))}
                  </div>
                )}
                {displayTab == "tab2" && (
                  <div className="collectioncardContainer">
                    {data.map((cardData) => (
                      <CardCollection cardData={cardData} />
                    ))}
                  </div>
                )}
                {displayTab == "tab3" && (
                  <div className="collectioncardContainer">
                    {data.map((cardData) => (
                      <CardCollection cardData={cardData} />
                    ))}
                  </div>
                )}
                <div className="collectioncardContainer">
                  {/* <CardCollection cardData={cardData} /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MarketFooter />
    </div>
  );
  //}
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

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
