import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  connectToMeta,
  metaMaskDisconnected,
  metaMaskValue,
} from "../../../redux/actions/metamask";
import dynamic from "next/dynamic";
//import FilterSearch from "./Filter/FilterSearch";
const FilterSearch = dynamic(() => import("./Filter/FilterSearch"), {
  ssr: false,
});
//import FilterSideBox from "./Filter/FilterSideBox";
const FilterSideBox = dynamic(() => import("./Filter/FilterSideBox"), {
  ssr: false,
});
//import NFTMarketPlaceContractABI from "../../../abi/nft-marketplace.json";
const NFTMarketPlaceContractABI = dynamic(
  () => import("../../../abi/nft-marketplace.json"),
  { ssr: false }
);
import axios from "../../../utils/common/axios";
//import BootstrapModal from "@/components/reusables/BootstrapModal";
const BootstrapModal = dynamic(
  () => import("@/components/reusables/BootstrapModal"),
  { ssr: false }
);
//import NFTCardv1 from "../NFTCardv1";
const NFTCardv1 = dynamic(() => import("../NFTCardv1"), { ssr: false });
const SimpleButton = dynamic(
  () => import("@/components/reusables/SimpleButton"),
  { ssr: false }
);
//import SimpleButton from "@/components/reusables/SimpleButton";
import { useInView } from "react-intersection-observer";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { listCollectionByAccount } from "../../../subgraph/query";
//import MainContent from "../resuable/MainContent";
const MainContent = dynamic(() => import("../resuable/MainContent"), {
  ssr: false,
});
//import Link from "next/link";
const Link = dynamic(() => import("next/link"), { ssr: false });
//import CreatedCollection from "../resuable/CreatedCollection";
const CreatedCollection = dynamic(
  () => import("../resuable/CreatedCollection"),
  {
    ssr: false,
  }
);

function Created({ metamaskConn }) {
  const [lastPostRef, _lastPostInView, lastPostEntry] = useInView();

  const [show, setShow] = useState(false);
  const [modalheader, setModalHeader] = useState("");
  const [modalfooter, setModalFooter] = useState(null);
  const [modalbody, setModalBody] = useState(null);
  const [createdNFTs, setCreatedNFTs] = useState(
    <MainContent
      heading={"No NFTs"}
      subheading={"Create NFTs"}
      content={<button className="exploreBtn">NFTs</button>}
    />
  );
  const [licenseStatus, setLicenseStatus] = useState("notApplied");
  const [skip, setSkip] = useState(0);
  let MarketPlaceContract = null;
  const createNFTUI = async (nftsDetails) => {
    try {
      //Checking if their is any staking NFTs
      if (nftsDetails.lenght == 0) {
        //
        setstakedNFTs(
          <div className="nodataDetail created">
            <h4>Stake NFTs</h4>
            <p>No staked NFTs</p>
          </div>
        );
        return;
      }

      let NFTUI = [];
      for (let index = 0; index < nftsDetails.length; index++) {
        NFTUI.push(<CreatedCollection cardDetails={nftsDetails[index]} />);
      }
      setCreatedNFTs(NFTUI);
    } catch (error) {
      console.log("Created NFTS ", error);
    }
  };

  const fetchNFTDetails = async (NFTsList) => {
    try {
      let NFTList = [];
      for (let index = 0; index < NFTsList.length; index++) {
        let meta = await axios.get(
          process.env.NEXT_PUBLIC_IPFS_URL +
            "/ipfs/" +
            NFTsList[index]._uri.split("/")[
              NFTsList[index]._uri.split("/").length - 1
            ]
        );
        meta.data.coverImage =
          process.env.NEXT_PUBLIC_IPFS_URL +
          "/ipfs/" +
          meta.data.coverImage.split("/")[
            meta.data.coverImage.split("/").length - 1
          ];
        meta.data.image =
          process.env.NEXT_PUBLIC_IPFS_URL +
          "/ipfs/" +
          meta.data.image.split("/")[meta.data.image.split("/").length - 1];
        NFTList.push({ ...meta.data, ...NFTsList[index] });
      }
      return NFTList;
    } catch (error) {
      console.log("XXX Error ", error);
      return [];
    }
  };
  const fetchCreatedNFTs = async () => {
    try {
      if (!metamaskConn.metamaskconnected) {
        console.log("Not connected to the metamask wallet");
        setCreatedNFTs(
          <MainContent
            heading={"Not connected to wallet"}
            subheading={"Please connect metamask wallet"}
            content={null}
          />
        );
        return;
      }

      MarketPlaceContract = new metamaskConn.metaconn.web3.eth.Contract(
        NFTMarketPlaceContractABI,
        `${process.env.NEXT_PUBLIC_NFT_Marketplace_Address}`,
        {
          from: metamaskConn.metamaskaccount,
        }
      );

      const client = new ApolloClient({
        uri: process.env.NEXT_PUBLIC_THEGRAPH_URL,
        cache: new InMemoryCache(),
      });
      //
      const { data } = await client.query({
        query: gql(listCollectionByAccount),
        variables: {
          first: 5,
          skip: skip,
          creator: metamaskConn.metamaskaccount,
        },
        fetchPolicy: "cache-first",
      });

      let NFTListWithDetails = await fetchNFTDetails(data.createCollections);
      await createNFTUI(NFTListWithDetails);
    } catch (error) {
      console.log("Failed to get rewards : ", error);
    }
  };

  /*
  //Checking if metamask wallet is connected
  if (metamaskConn.metamaskconnected) {
    //Call function fetch NFTs from blockchain
    fetchCreatedNFTs();
  }*/

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

      setLicenseStatus(result.data.data);
      //setDisplayButton(true);
    } catch (e) {
      console.log(e);
    }
  };

  const closeButton = () => {};

  useEffect(() => {
    fetchLicenseData();
    fetchCreatedNFTs();
    if (lastPostEntry?.isIntersecting) {
      setSkip(skip + 6);
    }
    return () => {
      setCreatedNFTs(null);
    };
  }, [metamaskConn, lastPostRef, lastPostEntry, setSkip]);
  return (
    <div className="ItemsContainer">
      <FilterSearch />
      <div className="filterBottomContainer">
        {/* {createdNFTs} */}
        <div className="collectionBox">
          {createdNFTs}
          {/* <div className="collectionCard">
            <div className="cardTop">
              <Image
                src="/images/nft1.png"
                alt="Picture of the author"
                width={500}
                height={500}
              />
              <div className="heartImg">
                <HeartIcon />
              </div>
            </div>
            <div className="cardBottom">
              <div className="topContent">
                <h5>Robbie Trevino on Twitter</h5>
                <div className="author">
                  <h6>
                    <span>By </span> John_wiker
                    <TickIcon />
                  </h6>
                  <button>New</button>
                </div>
              </div>
              <div className="bottomContent">
                <h5>
                  {" "}
                  4 Years. That was how long it took to finally get recognized
                  and featured by Apple. I had done everything from shooting
                  weddings and other stuf like nft and more etc.
                </h5>
              </div>
            </div>
          </div> */}
          <div className="ApplyforLicenseCard">
            <div className="contents">
              <h4>Create and Sell your own NFTs</h4>
              <h6>
                Apply for licennce to create more collection. Get your license
                now and start building
              </h6>
              <SimpleButton
                text={"Apply fo license"}
                backgroundColor={"#E44757"}
                color={"#FFFFFF"}
                maxWidth={"160px"}

                // onClick={}
              />
            </div>
          </div>
          <div className="nodataDetail created">
            <h4>Nothing found</h4>
            <p>We couldn't find anything with this criteria</p>
            <button className="exploreBtn">Explore NFTs</button>
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

const mapStateToProps = (state) => ({
  metamaskConn: state.metamaskConn,
});

const mapDispatchToProps = (dispatch) => {
  return {
    connectToMeta: bindActionCreators(connectToMeta, dispatch),
    metaMaskDisconnected: bindActionCreators(metaMaskDisconnected, dispatch),
    metaMaskValue: bindActionCreators(metaMaskValue, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Created);
//export default Created;
